const geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || ""

export function getGeminiApiKey(): string {
  return geminiApiKey
}

export function hasGeminiApiKey(): boolean {
  return geminiApiKey.length > 0
}
