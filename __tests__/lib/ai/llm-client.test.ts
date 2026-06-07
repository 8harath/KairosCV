import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock the Groq SDK so the structured-output path runs without a live API.
const { createMock } = vi.hoisted(() => ({ createMock: vi.fn() }))
vi.mock("groq-sdk", () => ({
  default: class {
    chat = { completions: { create: createMock } }
    constructor(_opts: unknown) {}
  },
}))

import {
  llmGenerateStructured,
  LLMValidationError,
  LLMTruncationError,
} from "@/lib/ai/llm-client"
import { getResumeJsonSchema } from "@/lib/ai/resume-json-schema"
import { validatePartialResumeData } from "@/lib/schemas/resume-schema"

function groqResponse(content: string, finishReason = "stop") {
  return { choices: [{ message: { content }, finish_reason: finishReason }] }
}

const structuredOpts = {
  jsonSchema: getResumeJsonSchema(),
  schemaName: "resume_data",
  validate: validatePartialResumeData,
}

beforeEach(() => {
  createMock.mockReset()
  process.env.GROQ_API_KEY = "test-key"
})

describe("llmGenerateStructured", () => {
  it("returns validated data on the first attempt", async () => {
    createMock.mockResolvedValueOnce(groqResponse('{"contact":{"name":"Jane Doe"}}'))

    const result = await llmGenerateStructured("extract", structuredOpts)

    expect(result.contact?.name).toBe("Jane Doe")
    expect(createMock).toHaveBeenCalledTimes(1)
  })

  it("self-repairs once, feeding validation errors back to the model", async () => {
    // First response is missing the required `contact` -> fails validation.
    createMock.mockResolvedValueOnce(groqResponse("{}"))
    createMock.mockResolvedValueOnce(groqResponse('{"contact":{"name":"Jane Doe"}}'))

    const result = await llmGenerateStructured("extract", structuredOpts)

    expect(result.contact?.name).toBe("Jane Doe")
    expect(createMock).toHaveBeenCalledTimes(2)

    const repairMessages = createMock.mock.calls[1][0].messages
    const userMsg = repairMessages.find((m: any) => m.role === "user").content
    expect(userMsg).toContain("failed schema validation")
  })

  it("throws LLMValidationError after the repair attempt also fails", async () => {
    createMock.mockResolvedValue(groqResponse("{}"))

    await expect(llmGenerateStructured("extract", structuredOpts)).rejects.toBeInstanceOf(
      LLMValidationError
    )
    expect(createMock).toHaveBeenCalledTimes(2)
  })

  it("throws LLMTruncationError without attempting repair", async () => {
    createMock.mockResolvedValueOnce(
      groqResponse('{"contact":{"name":"Jane"', "length")
    )

    await expect(llmGenerateStructured("extract", structuredOpts)).rejects.toBeInstanceOf(
      LLMTruncationError
    )
    expect(createMock).toHaveBeenCalledTimes(1)
  })
})
