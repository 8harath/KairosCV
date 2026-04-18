import { scoreResume } from "@/lib/validation/confidence-scorer"
import { handleAllEdgeCases } from "@/lib/parsers/edge-case-handler"
import { safeValidateResumeData, fillDefaults } from "@/lib/schemas/resume-schema"
import type { ResumeAgentStateType } from "../state"

/**
 * Score Node — runs edge-case handling, schema validation, and confidence scoring.
 */
export async function scoreNode(
  state: ResumeAgentStateType
): Promise<Partial<ResumeAgentStateType>> {
  const data = state.enhancedData ?? state.extractedData
  if (!data) {
    return {
      stage: "scoring",
      progress: 92,
      message: "No data to score",
      error: "Pipeline reached score stage with no resume data",
    }
  }

  // Run edge-case deduplication and normalization
  const cleaned = handleAllEdgeCases(data, state.rawText)

  // Validate + fill defaults
  let validated = cleaned
  const validationResult = safeValidateResumeData(cleaned)
  if (!validationResult.success) {
    validated = fillDefaults(cleaned)
    const recheck = safeValidateResumeData(validated)
    if (!recheck.success) {
      return {
        error: `Resume data is invalid after defaults: ${recheck.errors?.join(", ")}`,
        stage: "scoring",
        progress: 92,
        message: "Validation failed",
      }
    }
  }

  // Confidence score
  const score = scoreResume(validated)

  console.log("📊 Resume score:", {
    overall: score.overall,
    level: score.level,
    sections: Object.fromEntries(
      Object.entries(score.sections).map(([k, v]) => [k, v.score])
    ),
  })

  return {
    enhancedData: validated as unknown as ResumeAgentStateType["enhancedData"],
    confidenceScore: score,
    stage: "scoring",
    progress: 94,
    message: `Resume quality: ${score.overall}% (${score.level})`,
  }
}
