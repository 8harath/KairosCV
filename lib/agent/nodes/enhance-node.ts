import { ChatPromptTemplate } from "@langchain/core/prompts"
import { RunnableMap } from "@langchain/core/runnables"
import { z } from "zod"
import { buildLangChainLLM } from "../llm"
import type { ResumeAgentStateType, AgentExperience, AgentResumeData } from "../state"

// ---------------------------------------------------------------------------
// Schema for enhanced bullet output
// ---------------------------------------------------------------------------

const EnhancedBulletsSchema = z.object({
  bullets: z.array(z.string()).describe("Enhanced, ATS-optimized bullet points"),
})

const SummarySchema = z.object({
  summary: z.string().describe("A concise 2-3 sentence professional summary for a resume"),
})

const SkillsSchema = z.object({
  languages: z.array(z.string()).default([]),
  frameworks: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
  databases: z.array(z.string()).default([]),
})

// ---------------------------------------------------------------------------
// Prompt templates
// ---------------------------------------------------------------------------

const BULLET_PROMPT = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an expert resume writer specializing in ATS optimization.
Rewrite these experience bullet points for maximum impact:
- Start each bullet with a strong past-tense action verb
- Add specific metrics, percentages, or impact numbers where plausible
- Make each bullet achievement-focused, not task-focused
- Keep each bullet under 160 characters
- Return the same number of bullets as given`,
  ],
  [
    "human",
    `Role: {title} at {company}
Bullets:
{bullets}`,
  ],
])

const SUMMARY_PROMPT = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are an expert resume writer. Write a concise 2-3 sentence professional summary for the resume. Focus on years of experience, key strengths, and most impressive achievements. Do not use first person.",
  ],
  ["human", "Resume context:\n{context}"],
])

const SKILLS_PROMPT = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a technical recruiter. Extract and categorize all technical skills from the resume text.
Categories: languages (Python, JS, etc), frameworks (React, Django, etc), tools (Git, Docker, etc), databases (PostgreSQL, Redis, etc).
Only include skills explicitly mentioned in the resume.`,
  ],
  ["human", "Resume text:\n{text}"],
])

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function enhanceBullets(
  experience: AgentExperience[],
  rawText: string
): Promise<AgentExperience[]> {
  if (experience.length === 0) return experience

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const llm = buildLangChainLLM({ temperature: 0.4, fast: true }) as any
  const structuredLLM = llm.withStructuredOutput(EnhancedBulletsSchema)

  // Build a RunnableMap to enhance all entries in parallel
  const entries = experience.filter(e => e.bullets && e.bullets.length > 0)
  if (entries.length === 0) return experience

  const tasks: Record<string, { invoke: (input: Record<string, string>) => Promise<{ bullets: string[] }> }> = {}
  for (let i = 0; i < entries.length; i++) {
    const chain = BULLET_PROMPT.pipe(structuredLLM)
    tasks[`entry_${i}`] = chain as unknown as { invoke: (input: Record<string, string>) => Promise<{ bullets: string[] }> }
  }

  // Invoke all enhancement tasks in parallel
  const inputs = entries.map(e => ({
    title: e.title ?? "Professional",
    company: e.company ?? "Company",
    bullets: e.bullets.join("\n"),
  }))

  const enhanced = new Map<number, string[]>()
  await Promise.allSettled(
    entries.map(async (entry, i) => {
      try {
        const result = await (BULLET_PROMPT.pipe(structuredLLM) as unknown as {
          invoke: (input: Record<string, string>) => Promise<{ bullets: string[] }>
        }).invoke(inputs[i])
        if (result.bullets && result.bullets.length === entry.bullets.length) {
          enhanced.set(i, result.bullets)
        } else {
          enhanced.set(i, entry.bullets)
        }
      } catch {
        enhanced.set(i, entry.bullets)
      }
    })
  )

  // Merge enhanced bullets back
  return experience.map(e => {
    const idx = entries.indexOf(e)
    if (idx >= 0 && enhanced.has(idx)) {
      return { ...e, bullets: enhanced.get(idx)! }
    }
    return e
  })
}

// ---------------------------------------------------------------------------
// Enhance Node
// ---------------------------------------------------------------------------

export async function enhanceNode(
  state: ResumeAgentStateType
): Promise<Partial<ResumeAgentStateType>> {
  const data = state.extractedData
  if (!data) {
    return {
      enhancedData: null,
      stage: "enhancing",
      progress: 78,
      message: "No extracted data to enhance",
    }
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const llm = buildLangChainLLM({ temperature: 0.3 }) as any
    const rawText = state.rawText

    // Run summary + skills extraction in parallel with bullet enhancement
    const [enhancedExperience, summaryResult, skillsResult] = await Promise.allSettled([
      enhanceBullets(data.experience ?? [], rawText),
      (SUMMARY_PROMPT.pipe(llm.withStructuredOutput(SummarySchema)) as unknown as {
        invoke: (input: Record<string, string>) => Promise<{ summary: string }>
      }).invoke({ context: rawText.slice(0, 6000) }),
      (data.skills == null || Object.values(data.skills).every(arr => (arr ?? []).length === 0)
        ? (SKILLS_PROMPT.pipe(llm.withStructuredOutput(SkillsSchema)) as unknown as {
            invoke: (input: Record<string, string>) => Promise<{ languages: string[]; frameworks: string[]; tools: string[]; databases: string[] }>
          }).invoke({ text: rawText.slice(0, 6000) })
        : Promise.resolve(data.skills)
      ),
    ])

    const enhanced: AgentResumeData = {
      ...data,
      experience:
        enhancedExperience.status === "fulfilled"
          ? enhancedExperience.value
          : (data.experience ?? []),
      summary:
        summaryResult.status === "fulfilled" && summaryResult.value.summary
          ? summaryResult.value.summary
          : data.summary,
      skills:
        skillsResult.status === "fulfilled"
          ? (skillsResult.value as AgentResumeData["skills"])
          : data.skills,
    }

    return {
      enhancedData: enhanced,
      stage: "enhancing",
      progress: 82,
      message: "Content enhanced with AI",
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error"
    // Return unmodified data rather than failing the pipeline
    return {
      enhancedData: data,
      stage: "enhancing",
      progress: 82,
      message: "Enhancement skipped (AI unavailable)",
      warnings: [`Enhancement failed: ${msg}`],
    }
  }
}
