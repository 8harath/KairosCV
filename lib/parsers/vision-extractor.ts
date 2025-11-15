/**
 * Vision-based Resume Extraction
 *
 * Uses PDF-to-Image + Tesseract OCR for 100% visual extraction
 * Cross-verifies with text-based extraction
 */

import { createWorker } from 'tesseract.js'
import type { ParsedResume } from './enhanced-parser'

export interface VisionExtractionResult {
  method: 'vision-ocr'
  confidence: number
  text: string
  metadata: {
    totalPages: number
    processingTime: number
    ocrConfidence: number
    crossVerified: boolean
  }
}

export interface CrossVerificationResult {
  textExtraction: string
  visionExtraction: string
  matchPercentage: number
  missingInText: string[]
  missingInVision: string[]
  recommendation: 'use-text' | 'use-vision' | 'merge-both'
  mergedText: string
}

/**
 * Extract text from PDF using vision (OCR on images)
 */
export async function extractWithVision(
  pdfPath: string
): Promise<VisionExtractionResult> {
  const startTime = Date.now()

  try {
    console.log('  🔍 Starting vision-based extraction...')

    // Dynamically import pdf-to-png-converter
    const { pdfToPng } = await import('pdf-to-png-converter')

    // Convert PDF to images
    console.log('  📸 Converting PDF pages to images...')
    const pngPages = await pdfToPng(pdfPath, {
      outputFolder: '/tmp/kairos-vision',
      viewportScale: 2.0, // Higher resolution for better OCR
      pagesToProcess: [1, 2, 3], // Process up to 3 pages
    })

    console.log(`  ✓ Converted ${pngPages.length} pages to images`)

    // Initialize Tesseract worker
    console.log('  🤖 Initializing OCR engine...')
    const worker = await createWorker('eng')

    let fullText = ''
    let totalConfidence = 0

    // Process each page image with OCR
    for (let i = 0; i < pngPages.length; i++) {
      console.log(`  📄 Processing page ${i + 1}/${pngPages.length} with OCR...`)

      const imagePath = pngPages[i].path
      const { data } = await worker.recognize(imagePath)

      fullText += data.text + '\n\n'
      totalConfidence += data.confidence

      console.log(`  ✓ Page ${i + 1} OCR confidence: ${data.confidence.toFixed(1)}%`)
    }

    await worker.terminate()

    const avgConfidence = totalConfidence / pngPages.length
    const processingTime = Date.now() - startTime

    console.log(`  ✅ Vision extraction complete in ${processingTime}ms`)
    console.log(`  📊 Average OCR confidence: ${avgConfidence.toFixed(1)}%`)

    return {
      method: 'vision-ocr',
      confidence: avgConfidence,
      text: fullText.trim(),
      metadata: {
        totalPages: pngPages.length,
        processingTime,
        ocrConfidence: avgConfidence,
        crossVerified: false,
      },
    }
  } catch (error) {
    console.error('  ❌ Vision extraction failed:', error)
    throw error
  }
}

/**
 * Cross-verify text extraction vs vision extraction
 */
export function crossVerifyExtractions(
  textExtraction: string,
  visionExtraction: string
): CrossVerificationResult {
  console.log('  🔄 Cross-verifying text vs vision extraction...')

  // Normalize both extractions
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s@.]/g, '')
      .trim()
  }

  const textNorm = normalizeText(textExtraction)
  const visionNorm = normalizeText(visionExtraction)

  // Calculate similarity using Levenshtein distance
  const similarity = calculateSimilarity(textNorm, visionNorm)
  const matchPercentage = Math.round(similarity * 100)

  console.log(`  📊 Text vs Vision match: ${matchPercentage}%`)

  // Find content missing in text extraction
  const missingInText = findMissingContent(visionNorm, textNorm)

  // Find content missing in vision extraction (OCR errors)
  const missingInVision = findMissingContent(textNorm, visionNorm)

  // Determine recommendation
  let recommendation: 'use-text' | 'use-vision' | 'merge-both'

  if (matchPercentage >= 95) {
    recommendation = 'use-text' // Text extraction is accurate enough
  } else if (missingInText.length > missingInVision.length * 2) {
    recommendation = 'use-vision' // Vision caught more content
  } else {
    recommendation = 'merge-both' // Merge for best results
  }

  // Merge both extractions intelligently
  const mergedText = mergeExtractions(textExtraction, visionExtraction, recommendation)

  console.log(`  ✅ Recommendation: ${recommendation}`)
  console.log(`  📝 Missing in text: ${missingInText.length} phrases`)
  console.log(`  📝 Missing in vision: ${missingInVision.length} phrases`)

  return {
    textExtraction,
    visionExtraction,
    matchPercentage,
    missingInText,
    missingInVision,
    recommendation,
    mergedText,
  }
}

/**
 * Calculate similarity between two strings (0-1)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1

  if (longer.length === 0) return 1.0

  const editDistance = levenshteinDistance(longer, shorter)
  return (longer.length - editDistance) / longer.length
}

/**
 * Levenshtein distance algorithm
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }

  return matrix[str2.length][str1.length]
}

/**
 * Find content that exists in source but missing in target
 */
function findMissingContent(source: string, target: string): string[] {
  const missing: string[] = []

  // Split into meaningful phrases (5+ word sequences)
  const words = source.split(/\s+/)

  for (let i = 0; i < words.length - 4; i++) {
    const phrase = words.slice(i, i + 5).join(' ')

    if (!target.includes(phrase) && phrase.length > 20) {
      // Only report significant missing phrases
      missing.push(phrase)
    }
  }

  // Deduplicate
  return [...new Set(missing)]
}

/**
 * Merge text and vision extractions intelligently
 */
function mergeExtractions(
  textExtraction: string,
  visionExtraction: string,
  recommendation: 'use-text' | 'use-vision' | 'merge-both'
): string {
  if (recommendation === 'use-text') {
    return textExtraction
  }

  if (recommendation === 'use-vision') {
    return visionExtraction
  }

  // Merge both: Use text as base, append unique vision content
  const textNorm = textExtraction.toLowerCase()
  const visionLines = visionExtraction.split('\n')

  let merged = textExtraction

  for (const line of visionLines) {
    const lineNorm = line.toLowerCase().trim()

    // If line has meaningful content and not in text extraction
    if (lineNorm.length > 20 && !textNorm.includes(lineNorm)) {
      merged += '\n' + line
    }
  }

  return merged
}

/**
 * Extract resume data with vision and cross-verification
 */
export async function extractWithVisionAndVerify(
  pdfPath: string,
  textExtraction: string
): Promise<{
  visionResult: VisionExtractionResult
  crossVerification: CrossVerificationResult
  bestText: string
}> {
  console.log('\n🔍 Starting vision-based extraction with cross-verification...')

  // Extract using vision
  const visionResult = await extractWithVision(pdfPath)

  // Cross-verify
  const crossVerification = crossVerifyExtractions(
    textExtraction,
    visionResult.text
  )

  // Mark as cross-verified
  visionResult.metadata.crossVerified = true

  console.log('\n✅ Vision extraction and cross-verification complete!')
  console.log(`📊 Final recommendation: ${crossVerification.recommendation}`)
  console.log(`📊 Match percentage: ${crossVerification.matchPercentage}%`)

  return {
    visionResult,
    crossVerification,
    bestText: crossVerification.mergedText,
  }
}
