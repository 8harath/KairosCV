import { ChatPromptTemplate } from "@langchain/core/prompts"
import { z } from "zod"
import { buildLangChainLLM } from "../llm"
import type { ResumeAgentStateType, AgentExperience, AgentResumeData } from "../state"

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const TailoredBulletsSchema = z.object({
  bullets: z.array(z.string()).describe("Rewritten bullets that incorporate JD keywords naturally"),
})

const TailoredSummarySchema = z.object({
  summary: z.string().describe("Tailored 2-3 sentence summary aligned with the job description"),
})

const KeywordAnalysisSchema = z.object({
  mustHaveKeywords: z.array(z.string()).describe("Top 8 keywords from the JD the resume must include"),
  niceToHaveKeywords: z.array(z.string()).describe("Secondary keywords that add value"),
  missingFromResume: z.array(z.string()).describe("Keywords from the JD not found in the resume"),
})

// ---------------------------------------------------------------------------
// Prompts
// ---------------------------------------------------------------------------

const KEYWORD_ANALYSIS_PROMPT = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an ATS expert. Analyze the job description and resume to identify keyword gaps.
Extract the most important technical and domain keywords from the JD that should appear in the resume.
Only flag truly missing keywords — not synonyms or closely related terms already present.`,
  ],
  [
    "human",
    `Job Description:\n{job_description}\n\nResume Text:\n{resume_text}`,
  ],
])

const TAILORED_BULLET_PROMPT = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an expert resume writer tailoring a resume to a specific job.
Rewrite the experience bullet points to naturally incorporate the target keywords.
Rules:
- Incorporate keywords only where they fit authentically — never fabricate experience
- Maintain the original achievement/metric if present
- Keep bullets under 160 characters
- Use the exact keyword phrasing from the job description
- Return exactly the same number of bullets`,
  ],
  [
    "human",
    `Role: {title} at {company}
Target keywords to incorporate (where authentic): {keywords}
Original bullets:
{bullets}`,
  ],
])

const TAILORED_SUMMARY_PROMPT = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an expert resume writer. Write a 2-3 sentence professional summary tailored
to the job description. Naturally incorporate the top keywords. Do not use first person.
Sound authentic — do not make it sound like a keyword list.`,
  ],
  [
    "human",
    `Job Description:\n{job_description}\n\nResume context:\n{resume_context}\n\nTop keywords to include:\n{keywords}`,
  ],
])

// ---------------------------------------------------------------------------
// Tailor Node
// ---------------------------------------------------------------------------

export async function tailorNode(
  state: ResumeAgentStateType
): Promise<Partial<ResumeAgentStateType>> {
  // Skip if no JD provided
  if (!state.jobDescription || state.jobDescription.trim().length < 30) {
    return {
      enhancedData: state.enhancedData,
      stage: "tailoring",
      progress: 86,
      message: "No job description — skipping tailoring",
    }
  }

  const data = state.enhancedData ?? state.extractedData
  if (!data) {
    return {
      stage: "tailoring",
      progress: 86,
      message: "No resume data to tailor",
    }
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const llm = buildLangChainLLM({ temperature: 0.3 }) as any

    // Step 1: Identify keyword gaps
    const keywordResult = await (KEYWORD_ANALYSIS_PROMPT.pipe(
      llm.withStructuredOutput(KeywordAnalysisSchema)
    ) as unknown as {
      invoke: (input: Record<string, string>) => Promise<{
        mustHaveKeywords: string[]
        niceToHaveKeywords: string[]
        missingFromResume: string[]
      }>
    }).invoke({
      job_description: state.jobDescription.slice(0, 3000),
      resume_text: state.rawText.slice(0, 4000),
    })

    const targetKeywords = [
      ...keywordResult.mustHaveKeywords,
      ...keywordResult.niceToHaveKeywords.slice(0, 4),
    ].join(", ")

    console.log(`🎯 JD tailoring: ${keywordResult.mustHaveKeywords.length} must-have, ${keywordResult.missingFromResume.length} missing keywords`)

    // Step 2: Tailor bullets for top 3 experience entries in parallel + tailored summary
    const experience = data.experience ?? []
    const topEntries = experience.slice(0, 3).filter(e => (e.bullets?.length ?? 0) > 0)

    const [tailoredBulletResults, summaryResult] = await Promise.allSettled([
      // Parallel bullet tailoring
      Promise.allSettled(
        topEntries.map(entry =>
          (TAILORED_BULLET_PROMPT.pipe(llm.withStructuredOutput(TailoredBulletsSchema)) as unknown as {
            invoke: (input: Record<string, string>) => Promise<{ bullets: string[] }>
          }).invoke({
            title: entry.title ?? "Professional",
            company: entry.company ?? "Company",
            keywords: targetKeywords,
            bullets: (entry.bullets ?? []).join("\n"),
          })
        )
      ),
      // Tailored summary
      (TAILORED_SUMMARY_PROMPT.pipe(llm.withStructuredOutput(TailoredSummarySchema)) as unknown as {
        invoke: (input: Record<string, string>) => Promise<{ summary: string }>
      }).invoke({
        job_description: state.jobDescription.slice(0, 2000),
        resume_context: state.rawText.slice(0, 2000),
        keywords: keywordResult.mustHaveKeywords.slice(0, 6).join(", "),
      }),
    ])

    // Merge tailored bullets back into experience
    const tailoredExperience: AgentExperience[] = experience.map((entry, i) => {
      const topIdx = topEntries.indexOf(entry)
      if (
        topIdx >= 0 &&
        tailoredBulletResults.status === "fulfilled" &&
        tailoredBulletResults.value[topIdx]?.status === "fulfilled"
      ) {
        const result = tailoredBulletResults.value[topIdx] as PromiseFulfilledResult<{ bullets: string[] }>
        if (result.value.bullets.length === entry.bullets.length) {
          return { ...entry, bullets: result.value.bullets }
        }
      }
      return entry
    })

    const tailored: AgentResumeData = {
      ...data,
      experience: tailoredExperience,
      summary:
        summaryResult.status === "fulfilled"
          ? summaryResult.value.summary
          : data.summary,
    }

    return {
      enhancedData: tailored,
      stage: "tailoring",
      progress: 88,
      message: `Tailored to job description (${keywordResult.mustHaveKeywords.length} keywords targeted)`,
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error"
    return {
      enhancedData: data,
      stage: "tailoring",
      progress: 88,
      message: "Tailoring skipped (AI unavailable)",
      warnings: [`JD tailoring failed: ${msg}`],
    }
  }
}
