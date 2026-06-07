import { describe, it, expect } from "vitest"
import { parseModelJson } from "@/lib/ai/json-utils"

describe("parseModelJson (fallback parser)", () => {
  it("parses plain JSON", () => {
    expect(parseModelJson<{ a: number }>('{"a":1}')).toEqual({ a: 1 })
  })

  it("strips markdown code fences", () => {
    const raw = "```json\n{\"a\":1}\n```"
    expect(parseModelJson<{ a: number }>(raw)).toEqual({ a: 1 })
  })

  it("extracts the first balanced JSON value from surrounding prose", () => {
    const raw = 'Sure! Here is the result: {"a":1,"b":[2,3]} Hope that helps.'
    expect(parseModelJson(raw)).toEqual({ a: 1, b: [2, 3] })
  })

  it("sanitizes smart quotes and trailing commas", () => {
    const raw = '{“a”: 1, “b”: 2,}'
    expect(parseModelJson(raw)).toEqual({ a: 1, b: 2 })
  })

  it("returns null when no JSON can be recovered", () => {
    expect(parseModelJson("not json at all")).toBeNull()
  })
})
