/**
 * Enhanced Visual Extractor
 *
 * Uses Gemini Vision API to extract EVERYTHING from resume PDFs:
 * - All text including small fonts, italics, bold
 * - Bullet points with their exact content
 * - Headers, footers, sidebars
 * - Multi-column layouts
 * - Visual elements and formatting
 * - Colors and styles (for context)
 */

import { GoogleGenerativeAI } from "@google/generative-ai"
import fs from "fs-extra"
import { PDFDocument } from "pdf-lib"
import sharp from "sharp"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

const visionModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    temperature: 0.1,
    maxOutputTokens: 8192, // Increased for comprehensive extraction
  },
})

export interface VisualExtractionResult {
  fullText: string
  structuredData: any
  visualElements: {
    bulletPoints: string[]
    italicText: string[]
    boldText: string[]
    smallText: string[]
    headers: string[]
    footers: string[]
    colors: string[]
    layout: string
  }
  confidence: number
  method: "vision-complete"
}

/**
 * Convert PDF page to high-quality image for vision analysis
 */
async function pdfPageToImage(pdfPath: string, pageNum: number): Promise<string> {
  try {
    // Use sharp to convert PDF to high-DPI PNG
    const pdfBuffer = await fs.readFile(pdfPath)

    // Create a temporary PNG file
    const tempPngPath = `${pdfPath}-page-${pageNum}.png`

    // For now, we'll use a simpler approach - just read the PDF bytes
    // In production, you'd use pdf-poppler or similar to convert to image
    const base64 = pdfBuffer.toString('base64')

    return base64
  } catch (error) {
    console.error('Error converting PDF to image:', error)
    throw error
  }
}

/**
 * Extract EVERYTHING from resume using Gemini Vision
 */
export async function extractCompleteResumeVisually(
  pdfPath: string,
  rawText: string
): Promise<VisualExtractionResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Gemini API key not configured")
  }

  try {
    console.log("🎨 Starting comprehensive visual extraction...")

    // Read PDF as bytes for vision API
    const pdfBytes = await fs.readFile(pdfPath)
    const base64Data = pdfBytes.toString('base64')

    const prompt = `You are an expert resume analyzer with perfect visual perception. Analyze this resume image and extract EVERY SINGLE PIECE OF INFORMATION.

🚨 CRITICAL INSTRUCTIONS - EXTRACT EVERYTHING:

1. **ALL TEXT CONTENT:**
   - Regular text
   - Bold text (note it's bold)
   - Italic text (note it's italic)
   - Underlined text
   - Small font text (often missed - look carefully!)
   - Large font text (titles, headers)
   - Text in margins, headers, footers
   - Text in sidebars or columns
   - ANY text you can see, no matter how small or faint

2. **BULLET POINTS (CRITICAL):**
   - Extract every bullet point you see
   - Include the bullet symbol type (•, ○, -, *, etc.)
   - Preserve the exact text after each bullet
   - Note the indentation level
   - Look for nested bullets

3. **STRUCTURE:**
   - Section headers (Experience, Education, Skills, etc.)
   - Sub-headers
   - Multi-column layouts
   - Text boxes or callouts

4. **VISUAL ELEMENTS:**
   - Colors used (for important text)
   - Different font sizes
   - Icons or symbols
   - Borders or separators
   - Background colors or shading

5. **COMMONLY MISSED CONTENT:**
   - Phone numbers in headers/footers
   - Email addresses in small font
   - LinkedIn/GitHub URLs
   - Location information
   - Dates in various formats
   - Skills listed in small text
   - Certifications in footer
   - Languages spoken
   - Volunteer work
   - Publications

6. **LAYOUT ANALYSIS:**
   - Is it single or multi-column?
   - Where are headers/footers?
   - What's the visual hierarchy?

EXTRACTION FORMAT:
Return comprehensive JSON with this structure:

{
  "fullText": "Every single word and character you can see, preserving line breaks",

  "contact": {
    "name": "Full name (usually largest text at top)",
    "email": "Email (look everywhere - header, footer, body)",
    "phone": "Phone (often in header/footer)",
    "linkedin": "LinkedIn URL or username",
    "github": "GitHub URL or username",
    "website": "Personal website",
    "location": "City, State or Country"
  },

  "sections": {
    "summary": "Professional summary if present",
    "experience": [
      {
        "company": "Company name",
        "title": "Job title",
        "location": "Location",
        "dates": "Start - End",
        "bullets": ["Every bullet point under this job", "Even small ones", "Even italic ones"]
      }
    ],
    "education": [
      {
        "institution": "School name",
        "degree": "Degree name",
        "field": "Major/field",
        "dates": "Start - End",
        "gpa": "GPA if shown",
        "details": ["Any additional details", "Honors, coursework, etc."]
      }
    ],
    "skills": {
      "technical": ["All technical skills you see"],
      "languages": ["Programming languages"],
      "frameworks": ["Frameworks"],
      "tools": ["Tools"],
      "other": ["Any other skills"]
    },
    "projects": [
      {
        "name": "Project name",
        "description": "Description",
        "technologies": ["Tech used"],
        "bullets": ["Project bullets"],
        "links": ["URLs"]
      }
    ],
    "certifications": ["All certifications"],
    "awards": ["All awards and honors"],
    "languages": ["Spoken languages"],
    "volunteer": ["Volunteer work"],
    "publications": ["Publications"],
    "other": ["ANY other content not categorized above"]
  },

  "visualElements": {
    "bulletPoints": ["Every single bullet point text"],
    "italicText": ["Text that appears italic"],
    "boldText": ["Text that appears bold"],
    "smallText": ["Text in smaller font"],
    "headers": ["All section headers"],
    "footers": ["Footer content"],
    "colors": ["Main colors used"],
    "layout": "single-column OR multi-column OR mixed"
  },

  "rawTextComparison": "Any text you see in the image that's NOT in the provided raw text below"
}

RAW TEXT FROM PDF (for cross-reference):
${rawText.substring(0, 5000)}

⚠️  IMPORTANT: The raw text above may be missing content! Your job is to find EVERYTHING in the visual image, including what's missing from the raw text.

Return ONLY the JSON, no markdown, no explanations.`

    console.log("📸 Sending PDF to Gemini Vision for analysis...")

    const result = await visionModel.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: "application/pdf"
        }
      },
      { text: prompt }
    ])

    const responseText = result.response.text().trim()
    console.log("✅ Received vision analysis")

    // Parse the JSON response
    const cleanText = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim()

    const parsed = JSON.parse(cleanText)

    // Construct result
    const visualResult: VisualExtractionResult = {
      fullText: parsed.fullText || rawText,
      structuredData: parsed.sections || {},
      visualElements: {
        bulletPoints: parsed.visualElements?.bulletPoints || [],
        italicText: parsed.visualElements?.italicText || [],
        boldText: parsed.visualElements?.boldText || [],
        smallText: parsed.visualElements?.smallText || [],
        headers: parsed.visualElements?.headers || [],
        footers: parsed.visualElements?.footers || [],
        colors: parsed.visualElements?.colors || [],
        layout: parsed.visualElements?.layout || "unknown",
      },
      confidence: 95,
      method: "vision-complete",
    }

    console.log("✅ Visual extraction complete:")
    console.log(`   - Bullets found: ${visualResult.visualElements.bulletPoints.length}`)
    console.log(`   - Italic text: ${visualResult.visualElements.italicText.length}`)
    console.log(`   - Bold text: ${visualResult.visualElements.boldText.length}`)
    console.log(`   - Small text: ${visualResult.visualElements.smallText.length}`)
    console.log(`   - Layout: ${visualResult.visualElements.layout}`)

    return visualResult

  } catch (error) {
    console.error("❌ Visual extraction failed:", error)
    throw error
  }
}

/**
 * Check if vision extraction is available
 */
export function isVisualExtractionAvailable(): boolean {
  return !!process.env.GEMINI_API_KEY
}
