import { describe, it, expect } from "vitest"
import { getResumeJsonSchema } from "@/lib/ai/resume-json-schema"
import { toGeminiResponseSchema, toGroqJsonSchema } from "@/lib/ai/schema-adapters"

describe("getResumeJsonSchema", () => {
  it("produces a self-contained object schema for the resume shape", () => {
    const schema = getResumeJsonSchema() as any
    expect(schema.type).toBe("object")
    expect(schema.properties.contact).toBeDefined()
    expect(schema.properties.experience).toBeDefined()
    // refs are inlined, so there should be no definitions/$ref left
    expect(JSON.stringify(schema)).not.toContain("$ref")
  })
})

describe("toGeminiResponseSchema", () => {
  const gemini = toGeminiResponseSchema(getResumeJsonSchema()) as any

  it("drops keywords Gemini does not support", () => {
    const json = JSON.stringify(gemini)
    expect(json).not.toContain("$schema")
    expect(json).not.toContain("additionalProperties")
    expect(json).not.toContain("anyOf")
    expect(json).not.toContain('"const"')
  })

  it("collapses a union to its first non-null branch", () => {
    // endDate is z.string().or(z.literal("Present")) -> anyOf -> plain string
    expect(gemini.properties.experience.items.properties.endDate).toEqual({ type: "string" })
  })

  it("expresses an optional/nullable field via nullable", () => {
    // honors is z.array(z.string()).nullish() -> nullable array
    const honors = gemini.properties.education.items.properties.honors
    expect(honors.type).toBe("array")
    expect(honors.nullable).toBe(true)
  })

  it("preserves enums", () => {
    expect(gemini.properties.parseSource.enum).toEqual(["pdf", "docx", "txt"])
  })
})

describe("toGroqJsonSchema", () => {
  const groq = toGroqJsonSchema(getResumeJsonSchema()) as any

  it("strips $schema but keeps draft-7 constructs like anyOf", () => {
    expect(JSON.stringify(groq)).not.toContain("$schema")
    expect(groq.type).toBe("object")
    expect(groq.properties.experience.items.properties.endDate.anyOf).toBeDefined()
  })
})
