/**
 * Unified LLM client abstraction.
 *
 * Delegates to Groq (preferred) or Gemini (fallback) depending on which API key
 * is configured. All call sites use the same interface regardless of provider.
 */

import { hasGroqApiKey, getGroqApiKey, getGroqModel, getGroqFastModel, hasGeminiApiKey, getGeminiApiKey, getGeminiTextModel } from "../config/env"
import { parseModelJson } from "./json-utils"

export interface LLMGenerateOptions {
  temperature?: number
  maxTokens?: number
  jsonMode?: boolean
  /** Use a smaller / faster model when available */
  fast?: boolean
  /**
   * Base JSON Schema to constrain output via provider-native structured output.
   * Each provider path translates it into its own dialect before sending.
   */
  schema?: Record<string, unknown>
  /** Name for the schema (Groq's json_schema requires one). */
  schemaName?: string
}

export interface LLMResponse {
  text: string
}

/** Raw provider result, including enough metadata to detect truncation. */
export interface LLMStructuredResponse {
  text: string
  /** Provider-reported stop reason (e.g. "stop", "length", "MAX_TOKENS"). */
  finishReason?: string
  /** True when the model hit its output-token ceiling mid-response. */
  truncated: boolean
}

// ----- Errors -----

/** Thrown when a structured response was cut off by the output-token limit. */
export class LLMTruncationError extends Error {
  constructor(public readonly finishReason?: string) {
    super(
      `LLM response was truncated (finishReason: ${finishReason ?? "unknown"}). ` +
        "Increase maxTokens or shorten the input."
    )
    this.name = "LLMTruncationError"
  }
}

/** Throw if the provider reports the response was cut off mid-generation. */
function assertNotTruncated(res: LLMStructuredResponse): void {
  if (res.truncated) {
    throw new LLMTruncationError(res.finishReason)
  }
}

/** Thrown when structured output fails schema validation after all attempts. */
export class LLMValidationError extends Error {
  constructor(public readonly errors: string[] = []) {
    super(`LLM output failed schema validation: ${errors.join("; ") || "unknown error"}`)
    this.name = "LLMValidationError"
  }
}

type Provider = "groq" | "gemini"

function getActiveProvider(): Provider | null {
  if (hasGroqApiKey()) return "groq"
  if (hasGeminiApiKey()) return "gemini"
  return null
}

export function isLLMConfigured(): boolean {
  return getActiveProvider() !== null
}

// ----- Groq path -----

async function generateWithGroq(prompt: string, systemPrompt: string | undefined, opts: LLMGenerateOptions): Promise<LLMStructuredResponse> {
  const Groq = (await import("groq-sdk")).default
  const { toGroqJsonSchema } = await import("./schema-adapters")
  const client = new Groq({ apiKey: getGroqApiKey() })

  const modelName = opts.fast ? getGroqFastModel() : getGroqModel()

  const messages: Array<{ role: "system" | "user"; content: string }> = []
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt })
  }
  messages.push({ role: "user", content: prompt })

  // Prefer schema-constrained output; fall back to plain JSON mode, then text.
  let responseFormat: Record<string, unknown> | undefined
  if (opts.schema) {
    responseFormat = {
      type: "json_schema",
      json_schema: {
        name: opts.schemaName || "response",
        schema: toGroqJsonSchema(opts.schema),
        strict: false,
      },
    }
  } else if (opts.jsonMode) {
    responseFormat = { type: "json_object" }
  }

  const response = await client.chat.completions.create({
    model: modelName,
    messages,
    temperature: opts.temperature ?? 0.3,
    max_tokens: opts.maxTokens ?? 2048,
    ...(responseFormat ? { response_format: responseFormat as any } : {}),
  })

  const finishReason = response.choices[0]?.finish_reason as string | undefined
  return {
    text: response.choices[0]?.message?.content?.trim() || "",
    finishReason,
    truncated: finishReason === "length",
  }
}

// ----- Gemini path -----

async function generateWithGemini(prompt: string, _systemPrompt: string | undefined, opts: LLMGenerateOptions): Promise<LLMStructuredResponse> {
  const { GoogleGenerativeAI } = await import("@google/generative-ai")
  const { toGeminiResponseSchema } = await import("./schema-adapters")
  const genAI = new GoogleGenerativeAI(getGeminiApiKey())

  const generationConfig: Record<string, unknown> = {
    temperature: opts.temperature ?? 0.3,
    maxOutputTokens: opts.maxTokens ?? 2048,
  }

  // Native structured output: constrain generation to JSON matching the schema.
  if (opts.schema) {
    generationConfig.responseMimeType = "application/json"
    generationConfig.responseSchema = toGeminiResponseSchema(opts.schema)
  } else if (opts.jsonMode) {
    generationConfig.responseMimeType = "application/json"
  }

  const model = genAI.getGenerativeModel({
    model: getGeminiTextModel(),
    generationConfig: generationConfig as any,
  })

  // For Gemini, system prompt is prepended to the user prompt
  const fullPrompt = _systemPrompt ? `${_systemPrompt}\n\n${prompt}` : prompt
  const result = await model.generateContent(fullPrompt)
  const finishReason = result.response.candidates?.[0]?.finishReason as string | undefined
  return {
    text: result.response.text().trim(),
    finishReason,
    truncated: finishReason === "MAX_TOKENS",
  }
}

// ----- Dispatch -----

/**
 * Dispatch a generation request to the active provider, returning the raw
 * structured response (text + finish metadata).
 */
async function generateRaw(
  prompt: string,
  systemPrompt: string | undefined,
  opts: LLMGenerateOptions
): Promise<LLMStructuredResponse> {
  const provider = getActiveProvider()
  if (!provider) {
    throw new Error("No LLM provider configured. Set GROQ_API_KEY or GOOGLE_GEMINI_API_KEY.")
  }

  return provider === "groq"
    ? generateWithGroq(prompt, systemPrompt, opts)
    : generateWithGemini(prompt, systemPrompt, opts)
}

// ----- Public API -----

/**
 * Generate text from the configured LLM provider.
 * Throws if no provider is configured.
 */
export async function llmGenerate(
  prompt: string,
  opts: LLMGenerateOptions = {},
  systemPrompt?: string
): Promise<string> {
  return (await generateRaw(prompt, systemPrompt, opts)).text
}

export interface StructuredGenerateOptions<T> {
  /** Base JSON Schema used to constrain provider output. */
  jsonSchema: Record<string, unknown>
  /** Validator (typically a Zod safeParse wrapper) gating the parsed result. */
  validate: (data: unknown) => { success: boolean; data?: T; errors?: string[] }
  schemaName?: string
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
}

/**
 * Generate schema-constrained JSON and return a validated, typed object.
 *
 * The provider is asked for structured output, the text is defensively parsed
 * (models still occasionally wrap JSON in prose/fences), and the result is gated
 * through `validate`. Throws LLMTruncationError or LLMValidationError on failure
 * rather than returning unvalidated data.
 */
export async function llmGenerateStructured<T>(
  prompt: string,
  options: StructuredGenerateOptions<T>
): Promise<T> {
  const genOpts: LLMGenerateOptions = {
    temperature: options.temperature ?? 0.2,
    maxTokens: options.maxTokens ?? 4096,
    jsonMode: true,
    schema: options.jsonSchema,
    schemaName: options.schemaName,
  }

  // Attempt once, then make a single self-repair attempt that feeds the
  // validation errors back to the model before giving up.
  let lastErrors: string[] = []
  for (let attempt = 0; attempt < 2; attempt++) {
    const augmentedPrompt =
      attempt === 0
        ? prompt
        : `${prompt}\n\nYour previous response failed schema validation with these errors:\n${lastErrors
            .map((e) => `- ${e}`)
            .join("\n")}\n\nReturn corrected JSON that satisfies the schema. Output JSON only.`

    const res = await generateRaw(augmentedPrompt, options.systemPrompt, genOpts)
    assertNotTruncated(res)

    const parsed = parseModelJson<unknown>(res.text)
    const validation = options.validate(parsed)
    if (validation.success) {
      return validation.data as T
    }
    lastErrors = validation.errors ?? []
  }

  throw new LLMValidationError(lastErrors)
}

/**
 * Retry logic with exponential backoff for transient LLM errors (429, 503).
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 4,
  initialDelay = 1000
): Promise<T> {
  let lastError: Error | undefined

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      const errorMessage = lastError.message || ""
      const isTransientError =
        errorMessage.includes("429") ||
        errorMessage.includes("503") ||
        errorMessage.includes("overloaded") ||
        errorMessage.includes("rate_limit")

      if (!isTransientError) {
        throw lastError
      }

      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i)
        console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError || new Error("Max retries exceeded")
}
