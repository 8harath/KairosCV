const geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || ""
const DEFAULT_TRIAL_LIMIT = 3
const DEFAULT_TRIAL_WINDOW_HOURS = 24
const DEFAULT_CHROMIUM_BINARY_URL =
  "https://github.com/Sparticuz/chromium/releases/download/v143.0.0/chromium-v143.0.0-pack.x64.tar"

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

export function getChromiumBinaryUrl(): string {
  return process.env.CHROMIUM_BINARY_URL?.trim() || DEFAULT_CHROMIUM_BINARY_URL
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

export function getTrialLimit(): number {
  const rawValue = process.env.TRIAL_LIMIT?.trim()
  if (!rawValue) {
    return DEFAULT_TRIAL_LIMIT
  }

  const parsed = Number.parseInt(rawValue, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TRIAL_LIMIT
}

export function getTrialWindowHours(): number {
  const rawValue = process.env.TRIAL_WINDOW_HOURS?.trim()
  if (!rawValue) {
    return DEFAULT_TRIAL_WINDOW_HOURS
  }

  const parsed = Number.parseInt(rawValue, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TRIAL_WINDOW_HOURS
}

export function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || ""
}

export function getSupabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || ""
}

export function getSupabaseServiceRoleKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || ""
}

export function isSupabaseConfigured(): boolean {
  return (
    getSupabaseUrl().length > 0 &&
    getSupabaseAnonKey().length > 0 &&
    getSupabaseServiceRoleKey().length > 0
  )
}

export function shouldUseSupabaseStorage(): boolean {
  return parseBooleanEnv(process.env.USE_SUPABASE_STORAGE, false) && isSupabaseConfigured()
}

export function shouldUseSupabaseTrials(): boolean {
  return parseBooleanEnv(process.env.USE_SUPABASE_TRIALS, false) && isSupabaseConfigured()
}

export function getSupabaseInputBucket(): string {
  return process.env.SUPABASE_INPUT_BUCKET?.trim() || "resume-inputs"
}

export function getSupabaseOutputBucket(): string {
  return process.env.SUPABASE_OUTPUT_BUCKET?.trim() || "resume-outputs"
}

export function getSupabaseJsonBucket(): string {
  return process.env.SUPABASE_JSON_BUCKET?.trim() || "resume-json"
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
