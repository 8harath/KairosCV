import pdfParse from "pdf-parse"
import mammoth from "mammoth"
import fs from "fs-extra"
import path from "path"
import { getUploadFilePath, getGeneratedFilePath, saveGeneratedPDF, fileExists } from "./file-storage"
import { parseResumeEnhanced, type ParsedResume } from "./parsers/enhanced-parser"
import { extractSkills, enhanceBulletPoints, generateSummary, isGeminiConfigured, extractCompleteResumeData, enhanceExtractedData } from "./ai/gemini-service"
import { generateResumePDF } from "./pdf/pdf-generator"

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
}

// Parse PDF file
export async function parsePDF(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath)
  const data = await pdfParse(buffer)
  return data.text
}

// Parse DOCX file
export async function parseDOCX(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath)
  const result = await mammoth.extractRawText({ buffer })
  return result.value
}

// Parse TXT file
export async function parseTXT(filePath: string): Promise<string> {
  return await fs.readFile(filePath, "utf-8")
}

// Parse resume based on file extension
export async function parseResume(filePath: string, fileType: string): Promise<string> {
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

    const rawText = await parseResume(filePath, fileType)
    yield { stage: "parsing", progress: 20, message: "Text extraction complete" }

    // Stage 2: Use Gemini to extract ALL structured data from the resume
    yield { stage: "enhancing", progress: 30, message: "Analyzing resume with AI..." }

    let extractedData = await extractCompleteResumeData(rawText)

    // Fallback to basic parsing if AI extraction fails (e.g., API unavailable)
    if (!extractedData) {
      console.warn("AI extraction failed, falling back to basic parsing...")
      yield { stage: "enhancing", progress: 40, message: "Using fallback parser (AI service unavailable)..." }

      // Use the enhanced parser as fallback
      const parsedFallback = parseResumeEnhanced(rawText)

      // Convert to expected format
      extractedData = {
        contact: parsedFallback.contact,
        experience: parsedFallback.experience,
        education: parsedFallback.education,
        skills: parsedFallback.skills,
        projects: parsedFallback.projects,
        certifications: parsedFallback.certifications,
      }
    }

    yield { stage: "enhancing", progress: 50, message: "Enhancing content for ATS optimization..." }

    // Stage 3: Enhance the extracted data (improve bullet points, generate summary)
    const enhancedData = await enhanceExtractedData(extractedData)

    yield { stage: "enhancing", progress: 70, message: "Optimizing bullet points..." }

    // Stage 4: Convert to ParsedResume format for PDF generation
    const parsedResume: ParsedResume = {
      contact: {
        name: enhancedData.contact?.name || "Your Name",
        email: enhancedData.contact?.email || "",
        phone: enhancedData.contact?.phone || "",
        linkedin: enhancedData.contact?.linkedin || "",
        github: enhancedData.contact?.github || "",
        location: enhancedData.contact?.location || "",
      },
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

