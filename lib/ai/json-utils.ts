/**
 * Utilities for parsing JSON responses from LLM output.
 * Models sometimes include markdown fences or extra prose even when asked for JSON.
 */

function stripCodeFences(text: string): string {
  return text
    .replace(/```json\s*/gi, "")
    .replace(/```/g, "")
    .trim()
}

function sanitizeJsonLikeText(text: string): string {
  return text
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/,\s*([}\]])/g, "$1")
    .trim()
}

function extractFirstJsonValue(text: string): string | null {
  const start = text.search(/[\[{]/)
  if (start === -1) {
    return null
  }

  const openingChar = text[start]
  const closingChar = openingChar === "{" ? "}" : "]"

  let depth = 0
  let inString = false
  let isEscaped = false

  for (let i = start; i < text.length; i++) {
    const char = text[i]

    if (inString) {
      if (isEscaped) {
        isEscaped = false
      } else if (char === "\\") {
        isEscaped = true
      } else if (char === '"') {
        inString = false
      }
      continue
    }

    if (char === '"') {
      inString = true
      continue
    }

    if (char === openingChar) {
      depth += 1
      continue
    }

    if (char === closingChar) {
      depth -= 1
      if (depth === 0) {
        return text.slice(start, i + 1)
      }
    }
  }

  return null
}

export function parseModelJson<T>(rawText: string): T | null {
  const stripped = stripCodeFences(rawText)
  const extracted = extractFirstJsonValue(stripped)

  const candidates = [stripped, extracted].filter((value): value is string => Boolean(value))

  for (const candidate of candidates) {
    const sanitized = sanitizeJsonLikeText(candidate)
    try {
      return JSON.parse(sanitized) as T
    } catch {
      // Try next candidate.
    }
  }

  return null
}
