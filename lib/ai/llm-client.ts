/**
 * Unified LLM client abstraction.
 *
 * Delegates to Groq (preferred) or Gemini (fallback) depending on which API key
 * is configured. All call sites use the same interface regardless of provider.
 */

import { hasGroqApiKey, getGroqApiKey, getGroqModel, getGroqFastModel, hasGeminiApiKey, getGeminiApiKey, getGeminiTextModel } from "../config/env"

export interface LLMGenerateOptions {
  temperature?: number
  maxTokens?: number
  jsonMode?: boolean
  /** Use a smaller / faster model when available */
  fast?: boolean
}

export interface LLMResponse {
  text: string
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

async function generateWithGroq(prompt: string, systemPrompt: string | undefined, opts: LLMGenerateOptions): Promise<string> {
  const Groq = (await import("groq-sdk")).default
  const client = new Groq({ apiKey: getGroqApiKey() })

  const modelName = opts.fast ? getGroqFastModel() : getGroqModel()

  const messages: Array<{ role: "system" | "user"; content: string }> = []
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt })
  }
  messages.push({ role: "user", content: prompt })

  const response = await client.chat.completions.create({
    model: modelName,
    messages,
    temperature: opts.temperature ?? 0.3,
    max_tokens: opts.maxTokens ?? 2048,
    ...(opts.jsonMode ? { response_format: { type: "json_object" as const } } : {}),
  })

  return response.choices[0]?.message?.content?.trim() || ""
}

// ----- Gemini path -----

async function generateWithGemini(prompt: string, _systemPrompt: string | undefined, opts: LLMGenerateOptions): Promise<string> {
  const { GoogleGenerativeAI } = await import("@google/generative-ai")
  const genAI = new GoogleGenerativeAI(getGeminiApiKey())

  const model = genAI.getGenerativeModel({
    model: getGeminiTextModel(),
    generationConfig: {
      temperature: opts.temperature ?? 0.3,
      maxOutputTokens: opts.maxTokens ?? 2048,
    },
  })

  // For Gemini, system prompt is prepended to the user prompt
  const fullPrompt = _systemPrompt ? `${_systemPrompt}\n\n${prompt}` : prompt
  const response = await model.generateContent(fullPrompt)
  return response.response.text().trim()
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
  const provider = getActiveProvider()
  if (!provider) {
    throw new Error("No LLM provider configured. Set GROQ_API_KEY or GOOGLE_GEMINI_API_KEY.")
  }

  if (provider === "groq") {
    return generateWithGroq(prompt, systemPrompt, opts)
  }
  return generateWithGemini(prompt, systemPrompt, opts)
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
