/**
 * Per-provider schema adapters.
 *
 * Both Gemini and Groq accept a JSON Schema to constrain output, but in
 * different dialects. We keep one base JSON Schema (see `resume-json-schema.ts`)
 * and translate it here:
 *
 * - Gemini's `responseSchema` is an OpenAPI-3.0 subset: no `$schema`,
 *   `additionalProperties`, `const`, `default`, or `definitions`; optional
 *   fields are expressed via `nullable` rather than a `["string","null"]` union;
 *   and `anyOf`/`oneOf` are not reliably supported, so unions are collapsed to
 *   their first non-null branch.
 * - Groq follows OpenAI's `json_schema` semantics, which tolerate draft-7
 *   constructs (incl. `anyOf`), so we only strip the keywords it rejects.
 */

import type { JsonSchema } from "./resume-json-schema"

// Keywords Gemini's Schema type understands. Everything else is dropped.
const GEMINI_ALLOWED_KEYS = new Set([
  "type",
  "description",
  "enum",
  "format",
  "items",
  "properties",
  "required",
  "nullable",
  "minItems",
  "maxItems",
  "minLength",
  "maxLength",
  "minimum",
  "maximum",
])

/**
 * Translate the base JSON Schema into Gemini's `responseSchema` dialect.
 */
export function toGeminiResponseSchema(schema: JsonSchema): JsonSchema {
  return sanitizeForGemini(schema) as JsonSchema
}

function sanitizeForGemini(node: unknown): unknown {
  if (Array.isArray(node)) {
    return node.map(sanitizeForGemini)
  }
  if (!node || typeof node !== "object") {
    return node
  }

  const input = node as Record<string, unknown>

  // Collapse unions (anyOf/oneOf/allOf) to the first non-null branch, marking
  // the result nullable when a `{ type: "null" }` branch was present.
  const union = (input.anyOf ?? input.oneOf ?? input.allOf) as unknown[] | undefined
  if (Array.isArray(union)) {
    const branches = union as Record<string, unknown>[]
    const hasNull = branches.some((b) => b?.type === "null")
    const chosen = branches.find((b) => b?.type !== "null") ?? {}
    const merged = sanitizeForGemini(chosen) as Record<string, unknown>
    if (hasNull) merged.nullable = true
    return merged
  }

  const out: Record<string, unknown> = {}

  // Normalize `type`: a `["string","null"]` array becomes a single type + nullable.
  let type = input.type
  if (Array.isArray(type)) {
    const types = type as string[]
    if (types.includes("null")) out.nullable = true
    type = types.find((t) => t !== "null") ?? types[0]
  }
  if (typeof type === "string" && type !== "null") {
    out.type = type
  }

  for (const [key, value] of Object.entries(input)) {
    if (key === "type" || key === "anyOf" || key === "oneOf" || key === "allOf") continue
    if (!GEMINI_ALLOWED_KEYS.has(key)) continue

    if (key === "properties" && value && typeof value === "object") {
      const props: Record<string, unknown> = {}
      for (const [propName, propSchema] of Object.entries(value as Record<string, unknown>)) {
        props[propName] = sanitizeForGemini(propSchema)
      }
      out.properties = props
    } else if (key === "items") {
      out.items = sanitizeForGemini(value)
    } else {
      out[key] = value
    }
  }

  return out
}
