import fs from "fs-extra"
import path from "path"
import { getFileMetadata, resolveUploadedFile } from "./file-storage"
import { type ParsedResume } from "./parsers/enhanced-parser"
import { extractSkills, enhanceBulletPoints, generateSummary, isGeminiConfigured, enhanceExtractedData, type SkillsCategories } from "./ai/groq-service"
import { generateResumePDF } from "./pdf/pdf-generator"
import { type ResumeConfidence } from "./validation/confidence-scorer"
import { extractPDFEnhanced } from "./parsers/pdf-parser-enhanced"
import { extractDOCXEnhanced } from "./parsers/docx-parser-enhanced"
import { extractWithVisionAndVerify } from "./parsers/vision-extractor"
import { isOcrCrossVerificationEnabled } from "./config/env"

export interface ResumeData {
  text: string
  sections: {
    [key: string]: string[]
  }
  skills: string[]
  experience: string[]
  education: string[]
}

export interface ProcessingProgress {
  stage: string
  progress: number
  message: string
  confidence?: ResumeConfidence // Optional confidence score
}

// Parse PDF file using enhanced multi-strategy extraction + vision cross-verification
export async function parsePDF(filePath: string): Promise<{ text: string; extractionInfo?: string }> {
  // Step 1: Text-based extraction
  const result = await extractPDFEnhanced(filePath)

  console.log('📄 PDF Extraction Result:', {
    method: result.method,
    confidence: result.confidence,
    metadata: result.metadata
  })

  const features = []
  if (result.metadata?.hasMultiColumn) features.push('multi-column')
  if (result.metadata?.hasTables) features.push('tables')

  // Step 2: Vision-based extraction and cross-verification
  let finalText = result.text
  let extractionMethod = result.method
  let visionInfo = ''

  if (!isOcrCrossVerificationEnabled()) {
    return {
      text: finalText,
      extractionInfo: `Method: ${extractionMethod} | Confidence: ${result.confidence}% | OCR cross-verify: disabled | Features: ${features.length > 0 ? features.join(', ') : 'standard'}`
    }
  }

  try {
    console.log('🔍 Running vision-based cross-verification...')

    const { visionResult, crossVerification, bestText } = await extractWithVisionAndVerify(
      filePath,
      result.text
    )

    finalText = bestText // Use merged/best text
    visionInfo = ` | Vision: ${visionResult.metadata.ocrConfidence.toFixed(0)}% | Match: ${crossVerification.matchPercentage}% | Using: ${crossVerification.recommendation}`

    console.log(`✅ Vision cross-verification complete: ${crossVerification.recommendation}`)

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.log(`⚠️  Vision extraction failed: ${errorMsg}`)
    console.log('⚠️  Falling back to text-only extraction')
    visionInfo = ' | Vision: unavailable'
    if (process.env.NODE_ENV === 'development') {
      console.error('Vision extraction error details:', error)
    }
    // Continue with text-only extraction
  }

  return {
    text: finalText,
    extractionInfo: `Method: ${extractionMethod} | Confidence: ${result.confidence}%${visionInfo} | Features: ${features.length > 0 ? features.join(', ') : 'standard'}`
  }
}

// Parse DOCX file using enhanced HTML-based extraction
export async function parseDOCX(filePath: string): Promise<{ text: string; extractionInfo?: string }> {
  const result = await extractDOCXEnhanced(filePath)

  console.log('📄 DOCX Extraction Result:', {
    confidence: result.confidence,
    metadata: result.metadata
  })

  return {
    text: result.text,
    extractionInfo: `Confidence: ${result.confidence}% | Bullets: ${result.metadata.hasBullets} | Tables: ${result.metadata.hasTables}`
  }
}

// Parse TXT file
export async function parseTXT(filePath: string): Promise<string> {
  return await fs.readFile(filePath, "utf-8")
}

// Parse resume based on file extension
export async function parseResume(
  filePath: string,
  fileType: string
): Promise<{ text: string; extractionInfo?: string }> {
  const ext = path.extname(filePath).toLowerCase()

  if (ext === ".pdf" || fileType.includes("pdf")) {
    return await parsePDF(filePath)
  } else if (ext === ".docx" || fileType.includes("word")) {
    return await parseDOCX(filePath)
  } else if (ext === ".txt" || fileType.includes("text")) {
    const text = await parseTXT(filePath)
    return { text, extractionInfo: "Plain text file" }
  } else {
    throw new Error(`Unsupported file type: ${ext}`)
  }
}

// Extract sections from resume text (basic implementation)
export function extractSections(text: string): ResumeData {
  const lines = text.split("\n").map((line) => line.trim()).filter((line) => line.length > 0)
  
  const sections: { [key: string]: string[] } = {}
  const skills: string[] = []
  const experience: string[] = []
  const education: string[] = []
  
  let currentSection = ""
  
  for (const line of lines) {
    // Detect section headers (common resume sections)
    const lowerLine = line.toLowerCase()
    if (
      lowerLine.includes("experience") ||
      lowerLine.includes("work") ||
      lowerLine.includes("employment")
    ) {
      currentSection = "experience"
      sections[currentSection] = sections[currentSection] || []
    } else if (lowerLine.includes("education")) {
      currentSection = "education"
      sections[currentSection] = sections[currentSection] || []
    } else if (lowerLine.includes("skill")) {
      currentSection = "skills"
      sections[currentSection] = sections[currentSection] || []
    } else if (currentSection) {
      sections[currentSection].push(line)
      
      // Populate typed arrays
      if (currentSection === "experience") {
        experience.push(line)
      } else if (currentSection === "education") {
        education.push(line)
      } else if (currentSection === "skills") {
        skills.push(line)
      }
    }
  }
  
  return {
    text,
    sections,
    skills,
    experience,
    education,
  }
}

// Generate PDF from parsed resume data using Puppeteer and selected template
export async function generatePDF(
  parsedResume: ParsedResume,
  summary?: string,
  templateId?: string | null,
  format?: "letter" | "a4" | null
): Promise<Buffer> {
  try {
    const pdfBuffer = await generateResumePDF(parsedResume, summary, {
      format: format ?? "letter",
      printBackground: true,
    }, templateId)

    return pdfBuffer
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// Enhance resume with AI using Gemini
export async function enhanceWithAI(
  resumeData: ResumeData,
  parsedResume?: ParsedResume
): Promise<{ enhancedData: ResumeData; enhancedSkills: SkillsCategories | null; summary: string | null }> {
  if (!isGeminiConfigured()) {
    console.warn("Gemini API not configured. Skipping AI enhancement.")
    return { enhancedData: resumeData, enhancedSkills: null, summary: null }
  }

  try {
    // Extract and categorize skills using AI
    const enhancedSkills = await extractSkills(resumeData.text)

    // Generate professional summary
    const summary = await generateSummary(resumeData.text)

    // Enhance experience bullets if we have parsed experience data
    if (parsedResume && parsedResume.experience.length > 0) {
      for (const exp of parsedResume.experience) {
        if (exp.bullets.length > 0) {
          const enhanced = await enhanceBulletPoints(exp.bullets, exp.title, exp.company)
          // Update the bullets with enhanced versions
          exp.bullets = enhanced.map(e => e.enhanced)
        }
      }
    }

    return {
      enhancedData: {
        ...resumeData,
        skills: [
          ...enhancedSkills.languages,
          ...enhancedSkills.frameworks,
          ...enhancedSkills.tools,
          ...enhancedSkills.databases,
        ],
      },
      enhancedSkills,
      summary,
    }
  } catch (error) {
    console.error("Error in AI enhancement:", error)
    return { enhancedData: resumeData, enhancedSkills: null, summary: null }
  }
}

// Process resume file — delegates to the LangGraph agentic pipeline.
export async function* processResume(
  fileId: string,
  fileType: string,
  originalFilename: string
): AsyncGenerator<ProcessingProgress, ResumeData, unknown> {
  let resolvedUpload: Awaited<ReturnType<typeof resolveUploadedFile>> | undefined

  try {
    yield { stage: "parsing", progress: 5, message: "Loading metadata..." }

    const metadata = await getFileMetadata(fileId)
    if (!metadata) {
      throw new Error("Uploaded file metadata not found")
    }

    resolvedUpload = await resolveUploadedFile(fileId, originalFilename, metadata.storage)
    const filePath = resolvedUpload.filePath

    // Delegate to the LangGraph agentic pipeline
    const { runResumeAgent } = await import("./agent")

    const agentInput = {
      fileId,
      filePath,
      fileType,
      originalFilename,
      jobDescription: metadata.jobDescription ?? null,
      templateId: metadata.templateId ?? null,
      paperFormat: (metadata.format === "a4" ? "a4" : "letter") as "letter" | "a4",
    }

    for await (const event of runResumeAgent(agentInput)) {
      yield event
    }

    // Return minimal ResumeData for SSE route compatibility
    const resumeData: ResumeData = {
      text: "",
      sections: {},
      skills: [],
      experience: [],
      education: [],
    }

    return resumeData
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    throw new Error(`Processing failed: ${errorMessage}`)
  } finally {
    if (typeof resolvedUpload !== "undefined" && resolvedUpload.cleanup) {
      await resolvedUpload.cleanup().catch((error) => {
        console.warn("Failed to clean up temporary uploaded file:", error)
      })
    }
  }
}

