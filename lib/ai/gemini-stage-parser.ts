import { GoogleGenerativeAI } from "@google/generative-ai"
import { getGeminiApiKey, getGeminiTextModel, hasGeminiApiKey } from "../config/env"
import { parseModelJson } from "./json-utils"

const genAI = new GoogleGenerativeAI(getGeminiApiKey())

const extractionModel = genAI.getGenerativeModel({
  model: getGeminiTextModel(),
  generationConfig: {
    temperature: 0.1,
    maxOutputTokens: 8192,
  },
})

export interface StageEducation {
  degree: string
  institution: string
  location: string
  duration: string
  cgpa: string
  coursework: string[]
}

export interface StageSkills {
  languages: string[]
  libraries: string[]
  databases: string[]
  tools: string[]
}

export interface StageProject {
  title: string
  tech_stack: string[]
  bullets: string[]
}

export interface StageCertification {
  name: string
  issuer: string
  year: string
}

export interface StageResumeData {
  name: string
  phone: string
  email: string
  github: string
  education: StageEducation[]
  skills: StageSkills
  projects: StageProject[]
  certifications: StageCertification[]
  achievements: string[]
  extracurriculars: string[]
}

function emptyStageData(): StageResumeData {
  return {
    name: "",
    phone: "",
    email: "",
    github: "",
    education: [],
    skills: {
      languages: [],
      libraries: [],
      databases: [],
      tools: [],
    },
    projects: [],
    certifications: [],
    achievements: [],
    extracurriculars: [],
  }
}

function toStringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter((item) => item.length > 0)
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value
      .split(/[,\n]/)
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

function normalizeProject(project: unknown): StageProject | null {
  if (!project || typeof project !== "object") {
    return null
  }

  const source = project as Record<string, unknown>
  const title = toStringValue(source.title || source.name)
  if (!title) {
    return null
  }

  const techStack = toStringArray(source.tech_stack || source.technologies)
  const bullets = toStringArray(source.bullets || source.description)

  return {
    title,
    tech_stack: techStack,
    bullets,
  }
}

function normalizeEducation(education: unknown): StageEducation | null {
  if (!education || typeof education !== "object") {
    return null
  }

  const source = education as Record<string, unknown>
  const institution = toStringValue(source.institution)
  if (!institution) {
    return null
  }

  return {
    degree: toStringValue(source.degree),
    institution,
    location: toStringValue(source.location),
    duration: toStringValue(source.duration || source.date || source.dates),
    cgpa: toStringValue(source.cgpa || source.gpa),
    coursework: toStringArray(source.coursework || source.relevantCoursework),
  }
}

function normalizeCertification(certification: unknown): StageCertification | null {
  if (!certification || typeof certification !== "object") {
    return null
  }

  const source = certification as Record<string, unknown>
  const name = toStringValue(source.name)
  if (!name) {
    return null
  }

  return {
    name,
    issuer: toStringValue(source.issuer),
    year: toStringValue(source.year || source.date),
  }
}

function normalizeStageData(payload: unknown): StageResumeData {
  const source = (payload && typeof payload === "object" ? payload : {}) as Record<string, unknown>
  const normalized = emptyStageData()

  normalized.name = toStringValue(source.name)
  normalized.phone = toStringValue(source.phone)
  normalized.email = toStringValue(source.email)
  normalized.github = toStringValue(source.github)

  if (Array.isArray(source.education)) {
    normalized.education = source.education
      .map((item) => normalizeEducation(item))
      .filter((item): item is StageEducation => Boolean(item))
  } else if (source.education && typeof source.education === "object") {
    const singleEducation = normalizeEducation(source.education)
    normalized.education = singleEducation ? [singleEducation] : []
  }

  const skillsSource = (source.skills && typeof source.skills === "object"
    ? source.skills
    : {}) as Record<string, unknown>
  normalized.skills = {
    languages: toStringArray(skillsSource.languages),
    libraries: toStringArray(skillsSource.libraries || skillsSource.frameworks),
    databases: toStringArray(skillsSource.databases),
    tools: toStringArray(skillsSource.tools),
  }

  if (Array.isArray(source.projects)) {
    normalized.projects = source.projects
      .map((item) => normalizeProject(item))
      .filter((item): item is StageProject => Boolean(item))
  }

  if (Array.isArray(source.certifications)) {
    normalized.certifications = source.certifications
      .map((item) => normalizeCertification(item))
      .filter((item): item is StageCertification => Boolean(item))
  }

  normalized.achievements = toStringArray(source.achievements)
  normalized.extracurriculars = toStringArray(source.extracurriculars)

  return normalized
}

function shouldRetry(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error)
  return (
    message.includes("429") ||
    message.includes("503") ||
    message.toLowerCase().includes("overloaded")
  )
}

async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  let attempt = 0
  let delayMs = 1000

  while (attempt < retries) {
    try {
      return await fn()
    } catch (error) {
      attempt += 1
      if (attempt >= retries || !shouldRetry(error)) {
        throw error
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs))
      delayMs *= 2
    }
  }

  throw new Error("Retry loop exited unexpectedly")
}

function hasWeakOrMissingData(data: StageResumeData): boolean {
  const missingTopLevel =
    !data.name ||
    (!data.email && !data.phone) ||
    data.education.length === 0 ||
    data.projects.length === 0

  if (missingTopLevel) {
    return true
  }

  const weakProject = data.projects.some((project) => {
    const hasShortBullets = project.bullets.some((bullet) => bullet.split(/\s+/).length < 6)
    return project.tech_stack.length === 0 || project.bullets.length === 0 || hasShortBullets
  })

  return weakProject
}

export async function extractResumeStage2(rawText: string): Promise<StageResumeData | null> {
  if (!hasGeminiApiKey()) {
    return null
  }

  const prompt = `Extract the following fields from this resume text and return ONLY valid JSON:
{
  "name", "phone", "email", "github",
  "education": [{ "degree", "institution", "location", "duration", "cgpa", "coursework" }],
  "skills": { "languages", "libraries", "databases", "tools" },
  "projects": [{ "title", "tech_stack", "bullets": [] }],
  "certifications": [{ "name", "issuer", "year" }],
  "achievements": [],
  "extracurriculars": []
}

Rules:
1. Return strict JSON only (no markdown, no prose, no comments).
2. Keep the schema exactly as shown.
3. Use empty arrays/strings when a field is missing.
4. Infer missing labels when possible from context.

RESUME TEXT:
${rawText}`

  try {
    const parsed = await retryWithBackoff(async () => {
      const response = await extractionModel.generateContent(prompt)
      const value = parseModelJson<StageResumeData>(response.response.text().trim())
      if (!value) {
        throw new Error("Gemini Stage 2 returned non-JSON output")
      }
      return value
    })

    return normalizeStageData(parsed)
  } catch (error) {
    console.warn("Stage 2 extraction failed. Falling back to existing parser.", error)
    return null
  }
}

export async function validateAndGapFillStage3(
  rawText: string,
  extracted: StageResumeData
): Promise<StageResumeData> {
  const normalizedInput = normalizeStageData(extracted)

  if (!hasGeminiApiKey() || !hasWeakOrMissingData(normalizedInput)) {
    return normalizedInput
  }

  const prompt = `You are improving structured resume JSON.

Given the resume text and current extracted JSON:
1. Fill missing fields from context where possible.
2. Rewrite weak project bullets into strong action-verb + metric bullets.
3. Infer missing project tech_stack values from surrounding context.
4. Expand vague project descriptions into concise, impact-oriented bullets.
5. Keep the exact same JSON schema and return ONLY valid JSON.

CURRENT JSON:
${JSON.stringify(normalizedInput, null, 2)}

RESUME TEXT:
${rawText}`

  try {
    const improved = await retryWithBackoff(async () => {
      const response = await extractionModel.generateContent(prompt)
      const value = parseModelJson<StageResumeData>(response.response.text().trim())
      if (!value) {
        throw new Error("Gemini Stage 3 returned non-JSON output")
      }
      return value
    })

    return normalizeStageData(improved)
  } catch (error) {
    console.warn("Stage 3 gap-fill failed. Using Stage 2 output.", error)
    return normalizedInput
  }
}
