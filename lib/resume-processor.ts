/**
 * Resume Processor - Thin Client to Python Backend
 *
 * This module acts as a lightweight client that:
 * 1. Parses files to extract raw text (PDF, DOCX, TXT)
 * 2. Extracts basic structured data using simple regex
 * 3. Sends data to Python backend for LaTeX PDF generation
 * 4. Returns download URL for generated PDF
 *
 * Heavy lifting (AI, LaTeX, PDF generation) is done by Python backend.
 */

import fs from "fs-extra"
import path from "path"
import pdf from "pdf-parse"
import mammoth from "mammoth"
import { getUploadFilePath, fileExists } from "./file-storage"
import { backendAPI, type ResumeData as BackendResumeData } from "./services/backend-api"
import { transformToBackendSchema } from "./mappers/schema-mapper"

export interface ProcessingProgress {
  stage: string
  progress: number
  message: string
  download_url?: string
  error?: string
}

// ============================================================================
// Basic Text Extraction (Minimal Parsing)
// ============================================================================

/**
 * Extract text from PDF using pdf-parse (simple, reliable)
 */
async function parsePDF(filePath: string): Promise<string> {
  try {
    const dataBuffer = await fs.readFile(filePath)
    const data = await pdf(dataBuffer)
    return data.text
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`PDF parsing failed: ${msg}`)
  }
}

/**
 * Extract text from DOCX using mammoth (HTML conversion)
 */
async function parseDOCX(filePath: string): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ path: filePath })
    return result.value
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`DOCX parsing failed: ${msg}`)
  }
}

/**
 * Read plain text file
 */
async function parseTXT(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, "utf-8")
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`TXT reading failed: ${msg}`)
  }
}

/**
 * Parse resume file based on extension
 */
export async function parseResumeFile(filePath: string, fileType: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase()

  if (ext === ".pdf" || fileType.includes("pdf")) {
    return await parsePDF(filePath)
  } else if (ext === ".docx" || fileType.includes("word")) {
    return await parseDOCX(filePath)
  } else if (ext === ".txt" || fileType.includes("text")) {
    return await parseTXT(filePath)
  } else {
    throw new Error(`Unsupported file type: ${ext}`)
  }
}

// ============================================================================
// Basic Data Extraction (Simple Regex-Based)
// ============================================================================

/**
 * Extract basic structured data from raw text using simple patterns
 * This is a lightweight alternative to AI extraction
 */
export function extractBasicStructuredData(text: string): any {
  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0)

  // Extract name (usually first non-empty line or line with capital letters)
  const nameCandidate = lines.find(l => {
    const words = l.split(/\s+/)
    return words.length >= 2 && words.length <= 4 && /^[A-Z]/.test(l)
  }) || "Unknown Name"

  // Extract email
  const emailMatch = text.match(/[\w\.-]+@[\w\.-]+\.\w+/)
  const email = emailMatch ? emailMatch[0] : ""

  // Extract phone
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)
  const phone = phoneMatch ? phoneMatch[0] : ""

  // Extract LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/)
  const linkedin = linkedinMatch ? `https://${linkedinMatch[0]}` : ""

  // Extract GitHub
  const githubMatch = text.match(/github\.com\/[\w-]+/)
  const github = githubMatch ? `https://${githubMatch[0]}` : ""

  // Extract education (look for universities and degrees)
  const educationKeywords = ['university', 'college', 'institute', 'school', 'bachelor', 'master', 'phd', 'b.s.', 'm.s.']
  const educationSections = lines.filter(l =>
    educationKeywords.some(kw => l.toLowerCase().includes(kw))
  )

  // Extract experience (look for company indicators)
  const experienceKeywords = ['engineer', 'developer', 'manager', 'analyst', 'consultant', 'intern']
  const experienceSections = lines.filter(l =>
    experienceKeywords.some(kw => l.toLowerCase().includes(kw))
  )

  // Extract skills (common programming languages and frameworks)
  const skillKeywords = [
    'python', 'javascript', 'java', 'c++', 'react', 'node',
    'typescript', 'sql', 'aws', 'docker', 'kubernetes', 'git'
  ]
  const skills = skillKeywords.filter(skill =>
    text.toLowerCase().includes(skill)
  )

  return {
    basicInfo: {
      fullName: nameCandidate,
      phone: phone,
      email: email,
      linkedin: linkedin,
      github: github,
      website: null,
    },
    education: educationSections.slice(0, 2).map((edu, i) => ({
      id: `edu-${i}`,
      institution: edu.slice(0, 100),
      location: "",
      degree: "",
      minor: null,
      startDate: "",
      endDate: null,
      isPresent: false,
    })),
    experience: experienceSections.slice(0, 3).map((exp, i) => ({
      id: `exp-${i}`,
      organization: exp.slice(0, 50),
      jobTitle: "",
      location: "",
      startDate: "",
      endDate: null,
      isPresent: false,
      description: [],
    })),
    projects: [],
    skills: {
      languages: skills.join(', '),
      frameworks: "",
      developerTools: "",
      libraries: "",
    },
  }
}

// ============================================================================
// Main Processing Pipeline
// ============================================================================

/**
 * Process resume file: parse → extract → send to Python backend → return PDF URL
 */
export async function* processResume(
  fileId: string,
  fileType: string,
  originalFilename: string
): AsyncGenerator<ProcessingProgress, void, unknown> {
  try {
    // Stage 1: Parse file to extract raw text
    yield { stage: "parsing", progress: 10, message: "Reading resume file..." }

    const filePath = getUploadFilePath(fileId, path.extname(originalFilename) || ".txt")

    if (!(await fileExists(filePath))) {
      throw new Error("Uploaded file not found")
    }

    const rawText = await parseResumeFile(filePath, fileType)

    yield { stage: "parsing", progress: 30, message: "Text extraction complete" }

    // Stage 2: Extract basic structured data
    yield { stage: "extracting", progress: 40, message: "Extracting resume data..." }

    const extractedData = extractBasicStructuredData(rawText)

    yield { stage: "extracting", progress: 60, message: "Data extraction complete" }

    // Stage 3: Transform to backend schema
    yield { stage: "transforming", progress: 70, message: "Preparing data for backend..." }

    const backendData: BackendResumeData = transformToBackendSchema(extractedData)

    yield { stage: "transforming", progress: 75, message: "Data transformation complete" }

    // Stage 4: Send to Python backend for LaTeX PDF generation
    yield { stage: "generating", progress: 80, message: "Generating professional PDF with LaTeX..." }

    const response = await backendAPI.convertResumeToLatex(backendData)

    yield { stage: "generating", progress: 95, message: "PDF generation complete!" }

    // Stage 5: Return download URL
    const downloadUrl = `/api/proxy-download/${response.pdf_filename}`

    yield {
      stage: "complete",
      progress: 100,
      message: "Resume optimization complete!",
      download_url: downloadUrl,
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    yield {
      stage: "error",
      progress: 0,
      message: `Processing failed: ${errorMessage}`,
      error: errorMessage,
    }
    throw new Error(`Processing failed: ${errorMessage}`)
  }
}

// ============================================================================
// Health Check
// ============================================================================

/**
 * Check if Python backend is available
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await backendAPI.healthCheck()
    return response.message === "API is running!"
  } catch (error) {
    console.error("Backend health check failed:", error)
    return false
  }
}
