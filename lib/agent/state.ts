import { Annotation } from "@langchain/langgraph"
import type { ResumeConfidence } from "@/lib/validation/confidence-scorer"

// ---------------------------------------------------------------------------
// Shared resume data types (mirrors SchemaResumeData loosely for graph use)
// ---------------------------------------------------------------------------

export interface AgentContact {
  name?: string
  email?: string
  phone?: string
  linkedin?: string
  github?: string
  website?: string
  location?: string
}

export interface AgentExperience {
  title?: string
  company?: string
  startDate?: string
  endDate?: string
  location?: string
  bullets: string[]
}

export interface AgentEducation {
  degree?: string
  institution?: string
  startDate?: string
  endDate?: string
  gpa?: string
  honors?: string | string[]
}

export interface AgentProject {
  name?: string
  description?: string
  technologies?: string[]
  url?: string
  github?: string
  bullets?: string[]
}

export interface AgentSkills {
  languages?: string[]
  frameworks?: string[]
  tools?: string[]
  databases?: string[]
}

export interface AgentResumeData {
  contact?: AgentContact
  summary?: string
  experience?: AgentExperience[]
  education?: AgentEducation[]
  skills?: AgentSkills
  projects?: AgentProject[]
  certifications?: string[]
  awards?: unknown[]
  publications?: unknown[]
  languageProficiency?: unknown[]
  volunteer?: unknown[]
  hobbies?: unknown[]
  references?: string[]
  customSections?: unknown[]
}

// ---------------------------------------------------------------------------
// LangGraph state annotation
// ---------------------------------------------------------------------------

export const ResumeAgentState = Annotation.Root({
  // ── Inputs (set once at graph entry) ─────────────────────────────────────
  fileId: Annotation<string>({ reducer: (_, b) => b }),
  filePath: Annotation<string>({ reducer: (_, b) => b }),
  fileType: Annotation<string>({ reducer: (_, b) => b }),
  originalFilename: Annotation<string>({ reducer: (_, b) => b }),
  jobDescription: Annotation<string | null>({ reducer: (_, b) => b }),
  templateId: Annotation<string | null>({ reducer: (_, b) => b }),
  paperFormat: Annotation<"letter" | "a4">({ reducer: (_, b) => b }),

  // ── Parsing ───────────────────────────────────────────────────────────────
  rawText: Annotation<string>({ reducer: (_, b) => b, default: () => "" }),
  extractionInfo: Annotation<string>({ reducer: (_, b) => b, default: () => "" }),

  // ── Extraction ────────────────────────────────────────────────────────────
  extractedData: Annotation<AgentResumeData | null>({ reducer: (_, b) => b, default: () => null }),
  extractionConfidence: Annotation<number>({ reducer: (_, b) => b, default: () => 0 }),
  extractionAttempts: Annotation<number>({
    reducer: (a, b) => b,
    default: () => 0,
  }),

  // ── Enhancement ───────────────────────────────────────────────────────────
  enhancedData: Annotation<AgentResumeData | null>({ reducer: (_, b) => b, default: () => null }),

  // ── Quality scoring ───────────────────────────────────────────────────────
  confidenceScore: Annotation<ResumeConfidence | null>({ reducer: (_, b) => b, default: () => null }),

  // ── Output ────────────────────────────────────────────────────────────────
  pdfSaved: Annotation<boolean>({ reducer: (_, b) => b, default: () => false }),

  // ── Progress (streamed as SSE) ────────────────────────────────────────────
  stage: Annotation<string>({ reducer: (_, b) => b, default: () => "idle" }),
  progress: Annotation<number>({ reducer: (_, b) => b, default: () => 0 }),
  message: Annotation<string>({ reducer: (_, b) => b, default: () => "" }),

  // ── Errors / warnings ────────────────────────────────────────────────────
  error: Annotation<string | null>({ reducer: (_, b) => b, default: () => null }),
  warnings: Annotation<string[]>({
    reducer: (a, b) => [...(a ?? []), ...(b ?? [])],
    default: () => [],
  }),
})

export type ResumeAgentStateType = typeof ResumeAgentState.State
