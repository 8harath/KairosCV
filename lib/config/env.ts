const geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || ""

const TRUE_VALUES = new Set(["1", "true", "yes", "on"])
const FALSE_VALUES = new Set(["0", "false", "no", "off"])

function parseBooleanEnv(raw: string | undefined, defaultValue: boolean): boolean {
  if (!raw) {
    return defaultValue
  }

  const normalized = raw.trim().toLowerCase()
  if (TRUE_VALUES.has(normalized)) {
    return true
  }
  if (FALSE_VALUES.has(normalized)) {
    return false
  }

  return defaultValue
}

function normalizeModelName(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : fallback
}

export function getGeminiApiKey(): string {
  return geminiApiKey
}

export function hasGeminiApiKey(): boolean {
  return geminiApiKey.length > 0
}

export function getGeminiTextModel(): string {
  return normalizeModelName(process.env.GEMINI_MODEL, "gemini-2.5-flash")
}

export function getGeminiVisionModelCandidates(): string[] {
  const candidates = [
    process.env.GEMINI_VISION_MODEL,
    process.env.GEMINI_MODEL,
    "gemini-1.5-flash",
  ]

  return [...new Set(candidates.map((candidate) => candidate?.trim()).filter(Boolean))] as string[]
}

export function isAuthBypassed(): boolean {
  return parseBooleanEnv(process.env.DISABLE_AUTH, process.env.NODE_ENV !== "production")
}

export function isTrialLimitEnabled(): boolean {
  if (isAuthBypassed()) {
    return false
  }
  return parseBooleanEnv(process.env.ENABLE_TRIAL_LIMIT, true)
}

export function isOcrCrossVerificationEnabled(): boolean {
  return parseBooleanEnv(process.env.ENABLE_OCR_CROSS_VERIFY, false)
}

export function isVisualExtractionEnabled(): boolean {
  return parseBooleanEnv(process.env.ENABLE_VISUAL_EXTRACTION, false)
}

export function isFieldVerificationEnabled(): boolean {
  return parseBooleanEnv(process.env.ENABLE_FIELD_VERIFICATION, false)
}

export function isGeminiLatexPipelineEnabled(): boolean {
  return parseBooleanEnv(process.env.ENABLE_GEMINI_LATEX_PIPELINE, true)
}

export function isPdflatexStrictMode(): boolean {
  return parseBooleanEnv(process.env.REQUIRE_PDFLATEX, false)
}
