/**
 * Single source of truth for the resume output shape.
 *
 * The provider-native structured-output features (Gemini `responseSchema`,
 * Groq `json_schema`) both consume a JSON Schema. Rather than hand-writing that
 * schema — or duplicating the shape as a literal example inside the prompt — we
 * derive it directly from the Zod `PartialResumeDataSchema` that already governs
 * validation. One definition, no drift.
 *
 * Refs are inlined (`$refStrategy: "none"`) so the result is a single
 * self-contained object that the per-provider adapters can massage into each
 * provider's accepted dialect.
 */

import { zodToJsonSchema } from "zod-to-json-schema"
import { PartialResumeDataSchema } from "../schemas/resume-schema"

export type JsonSchema = Record<string, unknown>

let cached: JsonSchema | null = null

/**
 * The base JSON Schema (draft-7) for partial resume data, generated once from
 * the Zod schema and memoized for reuse across every extraction call.
 */
export function getResumeJsonSchema(): JsonSchema {
  if (!cached) {
    cached = zodToJsonSchema(PartialResumeDataSchema, {
      $refStrategy: "none",
      target: "jsonSchema7",
    }) as JsonSchema
  }
  return cached
}
