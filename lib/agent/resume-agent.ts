import { getResumeGraph } from "./graph"
import type { ResumeAgentStateType } from "./state"
import type { ProcessingProgress } from "@/lib/resume-processor"

export interface AgentRunInput {
  fileId: string
  filePath: string
  fileType: string
  originalFilename: string
  jobDescription?: string | null
  templateId?: string | null
  paperFormat?: "letter" | "a4"
}

/**
 * runResumeAgent — drives the LangGraph pipeline and yields SSE progress events.
 *
 * Replaces the linear generator in resume-processor.ts with an agentic
 * StateGraph that supports conditional retry, parallel enhancement, and
 * JD-aware tailoring.
 */
export async function* runResumeAgent(
  input: AgentRunInput
): AsyncGenerator<ProcessingProgress, void, unknown> {
  const graph = getResumeGraph()

  const initialState: Partial<ResumeAgentStateType> = {
    fileId: input.fileId,
    filePath: input.filePath,
    fileType: input.fileType,
    originalFilename: input.originalFilename,
    jobDescription: input.jobDescription ?? null,
    templateId: input.templateId ?? null,
    paperFormat: input.paperFormat ?? "letter",
    stage: "idle",
    progress: 0,
    message: "Starting...",
  }

  yield { stage: "parsing", progress: 5, message: "Initializing agentic pipeline..." }

  let lastProgress = 5
  let lastStage = "parsing"
  let finalConfidence: ProcessingProgress["confidence"] | undefined
  const nodeTimings: Record<string, number> = {}
  let nodeStart = Date.now()

  // Stream graph execution — each state update yields progress
  try {
    const stream = await graph.stream(initialState, { streamMode: "updates" })

    for await (const update of stream) {
      const elapsed = Date.now() - nodeStart
      nodeStart = Date.now()

      // Each update is a Record<nodeName, partialState>
      for (const [nodeName, nodeState] of Object.entries(update)) {
        nodeTimings[nodeName] = elapsed
        const s = nodeState as Partial<ResumeAgentStateType>

        if (s.error) {
          throw new Error(s.error)
        }

        if (s.warnings && s.warnings.length > 0) {
          s.warnings.forEach(w => console.warn(`[agent:${nodeName}] ${w}`))
        }

        if (s.stage && s.progress !== undefined && s.message) {
          lastProgress = s.progress
          lastStage = s.stage

          const progressEvent: ProcessingProgress = {
            stage: s.stage,
            progress: s.progress,
            message: s.message,
          }

          if (s.confidenceScore) {
            finalConfidence = s.confidenceScore
            progressEvent.confidence = s.confidenceScore
          }

          yield progressEvent
        }
      }
    }

    // Log timing breakdown for observability
    const totalMs = Object.values(nodeTimings).reduce((a, b) => a + b, 0)
    console.log(
      "⏱️  Agent node timings:",
      Object.entries(nodeTimings)
        .map(([k, v]) => `${k}=${v}ms`)
        .join(" | "),
      `| total=${totalMs}ms`
    )

    // Emit final completion event with confidence
    if (lastStage !== "complete" || lastProgress < 100) {
      const finalEvent: ProcessingProgress = {
        stage: "complete",
        progress: 100,
        message: "Resume optimization complete!",
      }
      if (finalConfidence) finalEvent.confidence = finalConfidence
      yield finalEvent
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error"
    throw new Error(`Agent pipeline failed: ${msg}`)
  }
}
