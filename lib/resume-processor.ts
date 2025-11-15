import fs from "fs-extra"
import path from "path"
import { getUploadFilePath, getGeneratedFilePath, saveGeneratedPDF, fileExists } from "./file-storage"
import { parseResumeEnhanced, type ParsedResume } from "./parsers/enhanced-parser"
import { extractSkills, enhanceBulletPoints, generateSummary, isGeminiConfigured, extractCompleteResumeData, enhanceExtractedData, type SkillsCategories } from "./ai/gemini-service"
import { generateResumePDF } from "./pdf/pdf-generator"
import { safeValidateResumeData, fillDefaults } from "./schemas/resume-schema"
import { scoreResume, type ResumeConfidence } from "./validation/confidence-scorer"
import { handleAllEdgeCases, validateProcessedData } from "./parsers/edge-case-handler"
import { extractPDFEnhanced } from "./parsers/pdf-parser-enhanced"
import { extractDOCXEnhanced } from "./parsers/docx-parser-enhanced"
import { extractWithVisionAndVerify } from "./parsers/vision-extractor"

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

// Generate LaTeX content (placeholder)
export function generateLaTeX(resumeData: ResumeData): string {
  // TODO: Implement LaTeX template generation
  // For now, return a simple structure
  const sections = Object.entries(resumeData.sections)
    .map(([name, content]) => `\\section{${name}}\n${content.join("\n")}`)
    .join("\n\n")
  
  return `\\documentclass{article}
\\begin{document}
${sections}
\\end{document}`
}

// Generate PDF from parsed resume data using Puppeteer and Jake's template
export async function generatePDF(
  parsedResume: ParsedResume,
  summary?: string
): Promise<Buffer> {
  try {
    // Generate PDF using Puppeteer and Jake's Resume template
    const pdfBuffer = await generateResumePDF(parsedResume, summary, {
      format: "letter",
      printBackground: true,
    })

    return pdfBuffer
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// Process resume file (main processing pipeline using Gemini for extraction)
export async function* processResume(
  fileId: string,
  fileType: string,
  originalFilename: string
): AsyncGenerator<ProcessingProgress, ResumeData, unknown> {
  try {
    // Stage 1: Parse file to extract raw text
    yield { stage: "parsing", progress: 10, message: "Reading resume file..." }

    const filePath = getUploadFilePath(fileId, path.extname(originalFilename) || ".txt")

    if (!(await fileExists(filePath))) {
      throw new Error("Uploaded file not found")
    }

    const parseResult = await parseResume(filePath, fileType)
    const rawText = parseResult.text

    // Show extraction details in progress
    if (parseResult.extractionInfo) {
      yield {
        stage: "parsing",
        progress: 20,
        message: `Text extraction complete | ${parseResult.extractionInfo}`
      }
    } else {
      yield { stage: "parsing", progress: 20, message: "Text extraction complete" }
    }

    // Stage 2: Multi-layer extraction with verification (NEW APPROACH)
    yield { stage: "extraction", progress: 25, message: "Starting multi-layer extraction..." }

    const { extractWithVerification } = await import('./extraction/multi-layer-extractor')

    const extractionResult = await extractWithVerification(
      rawText,
      fileId,
      (stage, progress, message) => {
        // Forward progress updates from extractor
        // Map progress from 25-75
        const mappedProgress = 25 + (progress / 100) * 50
        // Don't yield here to avoid async generator issues
      }
    )

    const extractedData = extractionResult.data

    // Show verification results
    if (!extractionResult.verification.complete) {
      const missingCount = extractionResult.verification.missingContent.length
      yield {
        stage: "extraction",
        progress: 75,
        message: `Extraction complete with ${missingCount} potential gaps (confidence: ${(extractionResult.verification.confidence * 100).toFixed(0)}%)`
      }

      console.warn("⚠️  Extraction verification warnings:")
      extractionResult.verification.missingContent.forEach((item, i) => {
        console.warn(`   ${i + 1}. ${item}`)
      })
    } else {
      yield {
        stage: "extraction",
        progress: 75,
        message: `All data extracted successfully (${(extractionResult.verification.confidence * 100).toFixed(0)}% confidence)`
      }
    }

    yield { stage: "enhancing", progress: 78, message: "Enhancing content for ATS optimization..." }

    // Stage 3: Enhance the extracted data (improve bullet points, generate summary)
    let enhancedData = await enhanceExtractedData(extractedData)

    yield { stage: "enhancing", progress: 85, message: "Optimizing bullet points..." }

    // Stage 3.4: Handle ALL edge cases (deduplication, normalization, cleanup)
    yield { stage: "cleaning", progress: 87, message: "Removing duplicates and normalizing data..." }
    enhancedData = handleAllEdgeCases(enhancedData, rawText)

    // Validate processed data
    const processedValidation = validateProcessedData(enhancedData as any)
    if (processedValidation.warnings.length > 0) {
      console.warn('⚠️  Data quality warnings:', processedValidation.warnings)
    }
    if (processedValidation.issues.length > 0) {
      console.error('❌ Data quality issues:', processedValidation.issues)
    }

    // Stage 3.5: Validate and score resume data quality
    yield { stage: "validating", progress: 89, message: "Validating resume data..." }

    const validation = safeValidateResumeData(enhancedData)

    if (!validation.success) {
      console.warn('Resume data validation failed:', validation.errors)
      // Fill defaults for missing required fields
      enhancedData = fillDefaults(enhancedData as any)
      yield {
        stage: "validating",
        progress: 91,
        message: "Auto-fixing missing fields..."
      }
    } else {
      yield { stage: "validating", progress: 91, message: "Validation passed!" }
    }

    // Calculate confidence score
    yield { stage: "scoring", progress: 93, message: "Calculating quality score..." }
    const confidenceScore = scoreResume(enhancedData)

    // Log confidence for debugging
    console.log('📊 Resume Confidence Score:', {
      overall: confidenceScore.overall,
      level: confidenceScore.level,
      contact: confidenceScore.sections.contact.score,
      experience: confidenceScore.sections.experience.score,
      education: confidenceScore.sections.education.score,
      skills: confidenceScore.sections.skills.score,
      projects: confidenceScore.sections.projects.score,
    })

    // Yield progress with confidence score
    yield {
      stage: "scoring",
      progress: 95,
      message: `Resume quality: ${confidenceScore.overall}% (${confidenceScore.level})`,
      confidence: confidenceScore
    }

    // Stage 4: Convert to ParsedResume format for PDF generation
    const parsedResume: ParsedResume = {
      contact: {
        name: enhancedData.contact?.name || "Your Name",
        email: enhancedData.contact?.email || "",
        phone: enhancedData.contact?.phone || "",
        linkedin: enhancedData.contact?.linkedin || "",
        github: enhancedData.contact?.github || "",
        website: enhancedData.contact?.website || "",
        location: enhancedData.contact?.location || "",
      },
      summary: enhancedData.summary,
      experience: enhancedData.experience || [],
      education: enhancedData.education || [],
      skills: enhancedData.skills || {
        languages: [],
        frameworks: [],
        tools: [],
        databases: [],
      },
      projects: enhancedData.projects || [],
      certifications: enhancedData.certifications || [],
      // New comprehensive sections
      awards: enhancedData.awards,
      publications: enhancedData.publications,
      languageProficiency: enhancedData.languageProficiency,
      volunteer: enhancedData.volunteer,
      hobbies: enhancedData.hobbies,
      references: enhancedData.references,
      customSections: enhancedData.customSections,
    }

    yield { stage: "generating", progress: 80, message: "Generating optimized PDF..." }

    // Stage 5: Generate PDF using Puppeteer and Jake's template
    const pdfBuffer = await generatePDF(parsedResume, enhancedData.summary)

    // Save generated PDF
    await saveGeneratedPDF(fileId, pdfBuffer)
    yield { stage: "compiling", progress: 95, message: "Finalizing..." }

    // Final completion message
    yield {
      stage: "complete",
      progress: 100,
      message: "Resume optimization complete!",
    }

    // Return basic resume data for compatibility
    const resumeData: ResumeData = {
      text: rawText,
      sections: {},
      skills: parsedResume.skills.languages.concat(parsedResume.skills.frameworks),
      experience: parsedResume.experience.map(exp => exp.title),
      education: parsedResume.education.map(edu => edu.institution),
    }

    return resumeData
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    throw new Error(`Processing failed: ${errorMessage}`)
  }
}

