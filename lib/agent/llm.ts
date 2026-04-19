import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import type { BaseChatModel } from "@langchain/core/language_models/chat_models"

// LangSmith tracing — enabled when LANGCHAIN_API_KEY is set in env.
// Set these in .env.local to enable:
//   LANGCHAIN_API_KEY=ls__...
//   LANGCHAIN_PROJECT=kairoscv
//   LANGCHAIN_TRACING_V2=true
if (process.env.LANGCHAIN_API_KEY) {
  process.env.LANGCHAIN_TRACING_V2 = "true"
  process.env.LANGCHAIN_PROJECT = process.env.LANGCHAIN_PROJECT ?? "kairoscv"
}

interface LLMOptions {
  temperature?: number
  maxTokens?: number
  /** Use a smaller/faster model variant */
  fast?: boolean
}

/**
 * Returns a LangChain BaseChatModel using Groq (primary) or Gemini (fallback).
 * Mirrors the priority logic in lib/ai/llm-client.ts but returns LangChain objects.
 */
export function buildLangChainLLM(opts: LLMOptions = {}): BaseChatModel {
  const { temperature = 0.3, maxTokens = 4096, fast = false } = opts

  if (process.env.GROQ_API_KEY) {
    const model = fast
      ? "llama-3.1-8b-instant"
      : "llama-3.3-70b-versatile"
    return new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model,
      temperature,
      maxTokens,
    })
  }

  if (process.env.GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY) {
    const model = fast ? "gemini-1.5-flash" : "gemini-1.5-pro"
    return new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? "",
      model,
      temperature,
      maxOutputTokens: maxTokens,
    })
  }

  throw new Error(
    "No LLM API key configured. Set GROQ_API_KEY or GOOGLE_GEMINI_API_KEY."
  )
}
