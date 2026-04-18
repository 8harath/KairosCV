import type { ResumeAgentStateType } from "../state"

const CONFIDENCE_THRESHOLD = 0.70
const MAX_RETRY_ATTEMPTS = 3

/**
 * Verify Node — inspects extraction confidence and decides whether to retry.
 *
 * This node does not call an LLM. It sets routing metadata in state that
 * the graph's conditional edge reads.
 *
 * Routing outcomes written to state.stage:
 *   "retry_extraction" → loop back to extractNode
 *   "verified"         → proceed to enhanceNode
 */
export async function verifyNode(
  state: ResumeAgentStateType
): Promise<Partial<ResumeAgentStateType>> {
  const attempts = state.extractionAttempts ?? 0
  const confidence = state.extractionConfidence ?? 0
  const data = state.extractedData

  // Hard failure — nothing extracted at all
  if (!data) {
    return {
      error: "Extraction produced no data",
      stage: "verified",
      progress: 60,
      message: "Extraction returned empty result",
    }
  }

  // Count populated top-level fields as a sanity check
  const hasContact = !!(data.contact?.name || data.contact?.email)
  const hasExperience = (data.experience?.length ?? 0) > 0
  const hasEducation = (data.education?.length ?? 0) > 0

  const structurallySound = hasContact || hasExperience || hasEducation

  // Retry if confidence is low and we haven't exhausted attempts
  if (
    confidence < CONFIDENCE_THRESHOLD &&
    attempts < MAX_RETRY_ATTEMPTS &&
    structurallySound === false
  ) {
    return {
      stage: "retry_extraction",
      progress: 55,
      message: `Low confidence (${(confidence * 100).toFixed(0)}%) — retrying extraction (${attempts}/${MAX_RETRY_ATTEMPTS})`,
      warnings: [`Extraction attempt ${attempts} below threshold — retrying`],
    }
  }

  // Warn but proceed when confident enough or retries exhausted
  const warnings: string[] = []
  if (confidence < CONFIDENCE_THRESHOLD) {
    warnings.push(
      `Extraction confidence ${(confidence * 100).toFixed(0)}% is below threshold after ${attempts} attempts — proceeding with best result`
    )
  }
  if (!hasContact) warnings.push("No contact information detected")
  if (!hasExperience && !hasEducation) warnings.push("No experience or education sections detected")

  return {
    stage: "verified",
    progress: 62,
    message: `Extraction verified (${(confidence * 100).toFixed(0)}% confidence)`,
    warnings,
  }
}

/** Routing function for the conditional edge after verifyNode */
export function routeAfterVerify(state: ResumeAgentStateType): "extract" | "enhance" {
  if (state.stage === "retry_extraction") return "extract"
  return "enhance"
}
