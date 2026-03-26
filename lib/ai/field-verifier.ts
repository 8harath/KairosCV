/**
 * Field Verification and Research
 *
 * Uses the unified LLM client (Groq or Gemini) to:
 * 1. Cross-verify extracted fields are correct
 * 2. Research raw text for missing information
 * 3. Continue searching until all critical fields are found
 */

import { ResumeData } from "../schemas/resume-schema"
import { llmGenerate, isLLMConfigured } from "./llm-client"
import { parseModelJson } from "./json-utils"

export interface VerificationResult {
  field: string
  isValid: boolean
  confidence: number
  correctedValue?: string
  reasoning: string
}

export interface ResearchResult {
  field: string
  found: boolean
  value?: string
  confidence: number
  searchAttempts: number
}

export interface VerificationProgress {
  stage: string
  field: string
  status: "verifying" | "researching" | "found" | "not_found" | "valid" | "invalid"
  message: string
  progress: number
}

/**
 * Verify a specific field value is correct
 */
export async function verifyField(
  field: string,
  value: string,
  rawText: string,
  expectedType: string
): Promise<VerificationResult> {
  if (!isLLMConfigured()) {
    return {
      field,
      isValid: true,
      confidence: 0.5,
      reasoning: "API key not configured, skipping verification",
    }
  }

  const prompt = `You are verifying extracted resume data for accuracy.

FIELD: ${field}
EXTRACTED VALUE: "${value}"
EXPECTED TYPE: ${expectedType}

RAW RESUME TEXT (excerpt):
${rawText.substring(0, 3000)}

TASK: Verify if the extracted value is ACTUALLY present in the raw text and is the correct type.

VERIFICATION RULES:
1. The value must appear verbatim or very similarly in the raw text
2. The value must match the expected type (e.g., location should be a place, not a company)
3. If the value is wrong or not found, provide the CORRECT value from the text
4. Be strict - if you're not confident, mark as invalid

Return ONLY a JSON object:
{
  "isValid": true,
  "confidence": 0.95,
  "correctedValue": "correct value if isValid is false, otherwise null",
  "reasoning": "Brief explanation of why valid/invalid"
}`

  try {
    const raw = await llmGenerate(prompt, { temperature: 0.1, maxTokens: 512, jsonMode: true, fast: true })
    const result = parseModelJson<{
      isValid?: boolean
      confidence?: number
      correctedValue?: string | null
      reasoning?: string
    }>(raw)
    if (!result) {
      throw new Error("Invalid JSON verification response")
    }

    return {
      field,
      isValid: result.isValid ?? true,
      confidence: result.confidence || 0.5,
      correctedValue: result.correctedValue || undefined,
      reasoning: result.reasoning || "Verification completed",
    }
  } catch (error) {
    console.warn(`Field verification failed for ${field}. Keeping existing value.`, error)
    return {
      field,
      isValid: true,
      confidence: 0.3,
      reasoning: "Verification failed due to error",
    }
  }
}

/**
 * Research raw text to find missing field value
 */
export async function researchMissingField(
  field: string,
  fieldType: string,
  rawText: string,
  attemptNumber: number = 1
): Promise<ResearchResult> {
  if (!isLLMConfigured()) {
    return { field, found: false, confidence: 0, searchAttempts: attemptNumber }
  }

  const prompt = `You are researching a resume to find missing information.

MISSING FIELD: ${field}
FIELD TYPE: ${fieldType}
SEARCH ATTEMPT: ${attemptNumber}

FULL RESUME TEXT:
${rawText}

TASK: Find the ${field} (${fieldType}) in this resume text.

SEARCH STRATEGIES (try all):
1. Look for explicit labels: "${field}:", "Location:", "Email:", etc.
2. Look for patterns: phone numbers, email addresses, city/state combinations
3. Infer from context: header information, contact section, footer
4. Look in less obvious places: signatures, addresses, links

Return ONLY a JSON object:
{
  "found": true,
  "value": "the extracted value if found, null if not found",
  "confidence": 0.95,
  "reasoning": "where/how you found it or why not found"
}`

  try {
    const raw = await llmGenerate(prompt, { temperature: 0.1, maxTokens: 512, jsonMode: true, fast: true })
    const result = parseModelJson<{ found?: boolean; value?: string | null; confidence?: number }>(raw)
    if (!result) {
      throw new Error("Invalid JSON research response")
    }

    return {
      field,
      found: result.found ?? false,
      value: result.value || undefined,
      confidence: result.confidence || 0.5,
      searchAttempts: attemptNumber,
    }
  } catch (error) {
    console.warn(`Field research failed for ${field}.`, error)
    return { field, found: false, confidence: 0, searchAttempts: attemptNumber }
  }
}

/**
 * Verify and research all critical fields in resume data
 */
export async function verifyAndResearchResumeData(
  extractedData: ResumeData,
  rawText: string,
  onProgress?: (progress: VerificationProgress) => void
): Promise<ResumeData> {
  console.log("Starting field verification and research...")

  const criticalFields = [
    { key: "contact.name", type: "person's full name", required: true },
    { key: "contact.email", type: "email address", required: true },
    { key: "contact.phone", type: "phone number", required: true },
    { key: "contact.location", type: "city and state or country", required: true },
    { key: "contact.linkedin", type: "LinkedIn profile URL", required: false },
    { key: "contact.github", type: "GitHub profile URL", required: false },
    { key: "contact.website", type: "personal website URL", required: false },
  ]

  let totalFields = criticalFields.length
  let processedFields = 0

  const verifiedData = JSON.parse(JSON.stringify(extractedData)) as ResumeData

  for (const fieldConfig of criticalFields) {
    const { key, type, required } = fieldConfig
    const [section, field] = key.split(".")

    const currentValue = (verifiedData as any)[section]?.[field]

    processedFields++
    const baseProgress = (processedFields / totalFields) * 100

    // Step 1: Verify existing value (if present)
    if (currentValue && currentValue.trim() !== "") {
      onProgress?.({
        stage: "verification",
        field: key,
        status: "verifying",
        message: `Verifying ${field}: "${currentValue}"`,
        progress: baseProgress - 10,
      })

      const verification = await verifyField(key, currentValue, rawText, type)

      console.log(`Verified ${key}:`, {
        isValid: verification.isValid,
        confidence: verification.confidence,
        reasoning: verification.reasoning,
      })

      if (!verification.isValid) {
        console.warn(`${key} is INVALID: ${verification.reasoning}`)

        onProgress?.({
          stage: "verification",
          field: key,
          status: "invalid",
          message: `${field} is incorrect - researching correct value...`,
          progress: baseProgress - 5,
        })

        if (verification.correctedValue) {
          if (verifiedData && verifiedData[section as keyof typeof verifiedData]) {
            const sectionData = verifiedData[section as keyof typeof verifiedData] as any
            sectionData[field] = verification.correctedValue
          }
          console.log(`Corrected ${key} to: ${verification.correctedValue}`)

          onProgress?.({
            stage: "verification",
            field: key,
            status: "found",
            message: `Found correct ${field}: "${verification.correctedValue}"`,
            progress: baseProgress,
          })

          continue
        }
      } else {
        onProgress?.({
          stage: "verification",
          field: key,
          status: "valid",
          message: `${field} verified`,
          progress: baseProgress,
        })

        continue
      }
    }

    // Step 2: Research missing or invalid field
    if (required || currentValue) {
      onProgress?.({
        stage: "research",
        field: key,
        status: "researching",
        message: `Searching for ${field} in resume...`,
        progress: baseProgress - 5,
      })

      let maxAttempts = 2
      let found = false

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        console.log(`Research attempt ${attempt}/${maxAttempts} for ${key}...`)

        const research = await researchMissingField(key, type, rawText, attempt)

        if (research.found && research.value) {
          found = true
          console.log(`Found ${key}: ${research.value}`)

          onProgress?.({
            stage: "research",
            field: key,
            status: "found",
            message: `Found ${field}: "${research.value}"`,
            progress: baseProgress,
          })

          if (verifiedData && verifiedData[section as keyof typeof verifiedData]) {
            const sectionData = verifiedData[section as keyof typeof verifiedData] as any
            sectionData[field] = research.value
          }
          break
        }
      }

      if (!found && required) {
        console.warn(`CRITICAL: Could not find required field ${key}`)
        onProgress?.({
          stage: "research",
          field: key,
          status: "not_found",
          message: `${field} not found after ${maxAttempts} attempts`,
          progress: baseProgress,
        })
      } else if (!found) {
        onProgress?.({
          stage: "research",
          field: key,
          status: "not_found",
          message: `${field} not found (optional)`,
          progress: baseProgress,
        })
      }
    }
  }

  console.log("Verification and research complete!")

  return verifiedData
}

/**
 * Check if LLM is configured for verification
 */
export function isVerificationAvailable(): boolean {
  return isLLMConfigured()
}
