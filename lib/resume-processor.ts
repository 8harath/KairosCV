import pdfParse from "pdf-parse"
import mammoth from "mammoth"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import fs from "fs-extra"
import path from "path"
import { getUploadFilePath, getGeneratedFilePath, saveGeneratedPDF, fileExists } from "./file-storage"

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

// Enhance resume with AI (placeholder for Gemini API integration)
export async function enhanceWithAI(resumeData: ResumeData): Promise<ResumeData> {
  // TODO: Integrate with Gemini API for actual enhancement
  // For now, return as-is
  // This structure is ready for Gemini API integration:
  // - Send resumeData to Gemini
  // - Get enhanced bullet points
  // - Extract keywords and skills
  // - Optimize for ATS
  
  return resumeData
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

// Generate PDF from resume data
export async function generatePDF(resumeData: ResumeData, originalFilename: string): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([612, 792]) // US Letter size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  
  let yPosition = 750
  const margin = 50
  const fontSize = 12
  const lineHeight = 16
  
  // Title
  page.drawText("OPTIMIZED RESUME", {
    x: margin,
    y: yPosition,
    size: 18,
    font: boldFont,
    color: rgb(0, 0, 0),
  })
  
  yPosition -= 30
  
  // Sections
  for (const [sectionName, content] of Object.entries(resumeData.sections)) {
    if (content.length === 0) continue
    
    // Section header
    page.drawText(sectionName.toUpperCase(), {
      x: margin,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    })
    
    yPosition -= 20
    
    // Section content
    for (const line of content) {
      if (yPosition < margin) {
        // Add new page if needed
        const newPage = pdfDoc.addPage([612, 792])
        yPosition = 750
      }
      
      // Wrap long lines
      const words = line.split(" ")
      let currentLine = ""
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word
        const textWidth = font.widthOfTextAtSize(testLine, fontSize)
        
        if (textWidth > 500 && currentLine) {
          page.drawText(currentLine, {
            x: margin,
            y: yPosition,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0),
          })
          yPosition -= lineHeight
          currentLine = word
          
          if (yPosition < margin) {
            const newPage = pdfDoc.addPage([612, 792])
            yPosition = 750
          }
        } else {
          currentLine = testLine
        }
      }
      
      if (currentLine) {
        page.drawText(currentLine, {
          x: margin,
          y: yPosition,
          size: fontSize,
          font: font,
          color: rgb(0, 0, 0),
        })
        yPosition -= lineHeight
      }
      
      yPosition -= 5 // Spacing between lines
    }
    
    yPosition -= 15 // Spacing between sections
  }
  
  // Footer
  const footerPage = pdfDoc.getPage(pdfDoc.getPageCount() - 1)
  footerPage.drawText(`Generated from: ${originalFilename}`, {
    x: margin,
    y: 30,
    size: 10,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  })
  
  return Buffer.from(await pdfDoc.save())
}

// Process resume file (main processing pipeline)
export async function* processResume(
  fileId: string,
  fileType: string,
  originalFilename: string
): AsyncGenerator<ProcessingProgress, ResumeData, unknown> {
  try {
    // Stage 1: Parse file
    yield { stage: "parsing", progress: 15, message: "Parsing resume content..." }
    
    const filePath = getUploadFilePath(fileId, path.extname(originalFilename) || ".txt")
    
    if (!(await fileExists(filePath))) {
      throw new Error("Uploaded file not found")
    }
    
    const rawText = await parseResume(filePath, fileType)
    yield { stage: "parsing", progress: 35, message: "Extracting sections and formatting..." }
    
    // Stage 2: Extract sections
    const resumeData = extractSections(rawText)
    yield { stage: "enhancing", progress: 45, message: "Enhancing content with AI..." }
    
    // Stage 3: AI Enhancement (placeholder)
    const enhancedData = await enhanceWithAI(resumeData)
    yield { stage: "enhancing", progress: 65, message: "Optimizing bullet points for ATS..." }
    
    // Stage 4: Generate PDF
    yield { stage: "generating", progress: 75, message: "Generating optimized document..." }
    const pdfBuffer = await generatePDF(enhancedData, originalFilename)
    
    // Save generated PDF
    await saveGeneratedPDF(fileId, pdfBuffer)
    yield { stage: "compiling", progress: 95, message: "Finalizing..." }
    
    // Final completion message
    yield {
      stage: "complete",
      progress: 100,
      message: "Resume optimization complete!",
    }
    
    return enhancedData
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    throw new Error(`Processing failed: ${errorMessage}`)
  }
}

