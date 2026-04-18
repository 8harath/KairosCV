import { ChatPromptTemplate } from "@langchain/core/prompts"
import { z } from "zod"
import { buildLangChainLLM } from "../llm"
import type { ResumeAgentStateType } from "../state"

// ---------------------------------------------------------------------------
// Zod schema for structured extraction output
// ---------------------------------------------------------------------------

const ExperienceSchema = z.object({
  title: z.string().optional(),
  company: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  location: z.string().optional(),
  bullets: z.array(z.string()).default([]),
})

const EducationSchema = z.object({
  degree: z.string().optional(),
  institution: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
  honors: z.string().optional(),
})

const ProjectSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  url: z.string().optional(),
  github: z.string().optional(),
  bullets: z.array(z.string()).default([]),
})

const SkillsSchema = z.object({
  languages: z.array(z.string()).default([]),
  frameworks: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
  databases: z.array(z.string()).default([]),
})

const ExtractedResumeSchema = z.object({
  contact: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    website: z.string().optional(),
    location: z.string().optional(),
  }).optional(),
  summary: z.string().optional(),
  experience: z.array(ExperienceSchema).default([]),
  education: z.array(EducationSchema).default([]),
  skills: SkillsSchema.optional(),
  projects: z.array(ProjectSchema).default([]),
  certifications: z.array(z.string()).default([]),
  confidence: z.number().min(0).max(1).describe("How confident you are in the extraction accuracy (0-1)"),
})

// ---------------------------------------------------------------------------
// Prompt template
// ---------------------------------------------------------------------------

const EXTRACTION_PROMPT = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an expert resume parser. Extract ALL information from the resume text into a structured JSON format.
Rules:
- Extract every piece of information present — do not omit any experience, project, or skill
- For bullets, extract them verbatim; do not paraphrase
- For dates, use the format "Mon YYYY" or "YYYY" as found in the text
- If a field is not present in the resume, omit it or use an empty array
- For skills, categorize: languages (Python, JS, etc), frameworks (React, Django, etc), tools (Git, Docker, etc), databases (PostgreSQL, Redis, etc)
- Set confidence to 0.9+ if the text is clean and complete, 0.5-0.89 if there are gaps or unclear sections, <0.5 if the text is garbled or incomplete
{retry_hint}`,
  ],
  [
    "human",
    `Extract all information from this resume:\n\n{resume_text}`,
  ],
])

// ---------------------------------------------------------------------------
// Extract Node
// ---------------------------------------------------------------------------

const MAX_ATTEMPTS = 3

export async function extractNode(
  state: ResumeAgentStateType
): Promise<Partial<ResumeAgentStateType>> {
  const attempt = (state.extractionAttempts ?? 0) + 1

  const retryHint =
    attempt > 1
      ? `IMPORTANT: Previous extraction attempt ${attempt - 1} had low confidence. Look more carefully — pay special attention to dates, company names, and any bullets that may have been missed.`
      : ""

  try {
    type ExtractedResume = z.infer<typeof ExtractedResumeSchema>

    const llm = buildLangChainLLM({ temperature: 0.1, fast: attempt === 1 })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const structured = (llm as any).withStructuredOutput(ExtractedResumeSchema)
    const formatted = await EXTRACTION_PROMPT.formatMessages({
      resume_text: state.rawText.slice(0, 12000),
      retry_hint: retryHint,
    })
    const result = await structured.invoke(formatted) as ExtractedResume

    const confidence = result.confidence
    const resumeData = {
      contact: result.contact,
      summary: result.summary,
      experience: result.experience,
      education: result.education,
      skills: result.skills,
      projects: result.projects,
      certifications: result.certifications,
    }

    return {
      extractedData: resumeData,
      extractionConfidence: confidence ?? 0.5,
      extractionAttempts: attempt,
      stage: "extraction",
      progress: 50 + attempt * 5,
      message: `Extraction attempt ${attempt} — confidence ${((confidence ?? 0.5) * 100).toFixed(0)}%`,
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown extraction error"
    // On structured output failure, fall back to legacy extractor
    try {
      const { extractWithVerification } = await import("@/lib/extraction/multi-layer-extractor")
      const result = await extractWithVerification(state.rawText, state.fileId, state.filePath, () => {})
      return {
        extractedData: result.data as ResumeAgentStateType["extractedData"],
        extractionConfidence: result.verification.confidence,
        extractionAttempts: attempt,
        stage: "extraction",
        progress: 55,
        message: `Extraction via fallback (confidence ${(result.verification.confidence * 100).toFixed(0)}%)`,
        warnings: [`LangChain extraction failed: ${msg}; used legacy extractor`],
      }
    } catch {
      return {
        error: `Extraction failed after ${attempt} attempts: ${msg}`,
        extractionAttempts: attempt,
        stage: "extraction",
        progress: 55,
        message: "Extraction failed",
      }
    }
  }
}
