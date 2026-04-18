import { parseResume } from "@/lib/resume-processor"
import type { ResumeAgentStateType } from "../state"

/**
 * Parse Node — reads the uploaded file and extracts raw text.
 * Supports PDF (multi-strategy + optional vision), DOCX (HTML-based), and TXT.
 */
export async function parseNode(
  state: ResumeAgentStateType
): Promise<Partial<ResumeAgentStateType>> {
  try {
    const result = await parseResume(state.filePath, state.fileType)

    return {
      rawText: result.text,
      extractionInfo: result.extractionInfo ?? "",
      stage: "parsing",
      progress: 20,
      message: result.extractionInfo
        ? `Text extracted | ${result.extractionInfo}`
        : "Text extraction complete",
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown parse error"
    return {
      error: `Parse failed: ${msg}`,
      stage: "parsing",
      progress: 20,
      message: "Failed to read resume file",
    }
  }
}
