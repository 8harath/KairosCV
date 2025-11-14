/**
 * Text Extraction Quality Assessment & Detection Utilities
 *
 * Provides functions to assess extraction quality, detect document features,
 * and determine confidence scores for extracted text.
 */

export interface ExtractionQuality {
  confidence: number // 0-100
  issues: string[]
  warnings: string[]
  stats: {
    textLength: number
    lineCount: number
    wordCount: number
    keywordsFound: number
    specialCharRatio: number
  }
}

/**
 * Assess overall quality of extracted text
 * Returns confidence score (0-100) and detailed analysis
 */
export function assessTextQuality(text: string): ExtractionQuality {
  const issues: string[] = []
  const warnings: string[] = []
  let score = 100

  // Basic stats
  const textLength = text.length
  const lines = text.split('\n')
  const lineCount = lines.filter(l => l.trim().length > 0).length
  const words = text.split(/\s+/).filter(w => w.length > 0)
  const wordCount = words.length

  // Check 1: Text length
  if (textLength < 50) {
    score -= 60
    issues.push('Extracted text is too short (< 50 characters)')
  } else if (textLength < 200) {
    score -= 30
    warnings.push('Extracted text seems short for a resume')
  }

  // Check 2: Line count
  if (lineCount < 5) {
    score -= 20
    warnings.push('Very few lines extracted')
  }

  // Check 3: Word count
  if (wordCount < 20) {
    score -= 30
    issues.push('Very few words extracted')
  }

  // Check 4: Common resume keywords
  const keywords = [
    'experience', 'education', 'skills', 'work', 'university',
    'college', 'project', 'email', 'phone', 'developer',
    'engineer', 'manager', 'bachelor', 'master', 'degree'
  ]

  const lowerText = text.toLowerCase()
  const foundKeywords = keywords.filter(kw => lowerText.includes(kw))
  const keywordCount = foundKeywords.length

  if (keywordCount < 2) {
    score -= 30
    issues.push('Missing common resume keywords')
  } else if (keywordCount < 4) {
    score -= 15
    warnings.push('Few resume keywords found')
  }

  // Check 5: Special character ratio (high ratio suggests extraction artifacts)
  const specialChars = (text.match(/[^\w\s.,;:()?!@+\-'"/\\]/g) || []).length
  const specialCharRatio = specialChars / textLength

  if (specialCharRatio > 0.15) {
    score -= 25
    issues.push('High ratio of special characters (possible extraction artifacts)')
  } else if (specialCharRatio > 0.10) {
    score -= 10
    warnings.push('Some special characters detected')
  }

  // Check 6: Proper sentence structure
  const hasCapitalization = /[A-Z][a-z]+/.test(text)
  const hasProperSentences = /[A-Z][a-z]+\s+[a-z]+/.test(text)

  if (!hasCapitalization) {
    score -= 20
    issues.push('No proper capitalization found')
  } else if (!hasProperSentences) {
    score -= 10
    warnings.push('Limited sentence structure detected')
  }

  // Check 7: Reasonable line length distribution
  const lineLengths = lines.map(l => l.trim().length).filter(l => l > 0)
  if (lineLengths.length > 0) {
    const avgLineLength = lineLengths.reduce((sum, l) => sum + l, 0) / lineLengths.length
    if (avgLineLength < 10) {
      score -= 15
      warnings.push('Very short average line length')
    }
  }

  // Ensure score is between 0 and 100
  const confidence = Math.max(0, Math.min(100, score))

  return {
    confidence,
    issues,
    warnings,
    stats: {
      textLength,
      lineCount,
      wordCount,
      keywordsFound: keywordCount,
      specialCharRatio: Math.round(specialCharRatio * 1000) / 1000,
    }
  }
}

/**
 * Detect if PDF likely has multi-column layout
 */
export function detectMultiColumn(text: string): boolean {
  const lines = text.split('\n').filter(l => l.trim().length > 0)

  if (lines.length < 10) {
    return false // Too few lines to determine
  }

  // Calculate line length variance
  const lineLengths = lines.map(l => l.trim().length)
  const avgLength = lineLengths.reduce((sum, l) => sum + l, 0) / lineLengths.length

  // Calculate variance
  const variance = lineLengths.reduce((sum, l) =>
    sum + Math.pow(l - avgLength, 2), 0
  ) / lineLengths.length

  // High variance suggests multi-column (some lines are full-width, others are half)
  // Also check for very short lines mixed with longer ones
  const shortLines = lineLengths.filter(l => l < avgLength * 0.4).length
  const shortLineRatio = shortLines / lineLengths.length

  return variance > 500 || shortLineRatio > 0.3
}

/**
 * Detect if text contains tabular data
 */
export function detectTables(text: string): boolean {
  const lines = text.split('\n')

  // Look for lines with multiple spaces or tabs (suggesting columns)
  const tabularLines = lines.filter(line => {
    const trimmed = line.trim()
    // Multiple consecutive spaces (3+) or tabs suggest tabular data
    return trimmed.match(/\s{3,}/) !== null || trimmed.includes('\t')
  }).length

  // If more than 20% of lines look tabular, likely has tables
  return tabularLines > Math.max(5, lines.length * 0.2)
}

/**
 * Detect if PDF is likely scanned (image-based) vs text-based
 * Note: This is a heuristic based on extraction results, not file inspection
 */
export function detectScannedPDF(extractedText: string, fileSize: number): boolean {
  // If extraction yielded very little text relative to file size, likely scanned
  const textBytesPerFileMB = (extractedText.length / (fileSize / (1024 * 1024)))

  // Text-based PDFs typically have 5000+ text bytes per MB
  // Scanned PDFs have much less (mostly just image data)
  if (textBytesPerFileMB < 1000) {
    return true
  }

  // Also check text quality
  const quality = assessTextQuality(extractedText)
  if (quality.confidence < 40) {
    return true // Poor quality suggests OCR is needed
  }

  return false
}

/**
 * Clean and normalize extracted text
 * Removes excessive whitespace, normalizes line breaks, etc.
 */
export function cleanExtractedText(text: string): string {
  return text
    // Normalize line breaks (Windows/Unix/Mac)
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove excessive spaces
    .replace(/ {2,}/g, ' ')
    // Collapse excessive line breaks (max 2)
    .replace(/\n{3,}/g, '\n\n')
    // Trim each line
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    // Trim overall
    .trim()
}

/**
 * Normalize bullet point characters to standard bullets
 */
export function normalizeBullets(text: string): string {
  return text
    // Convert various bullet chars to standard •
    .replace(/^[\-*▪︎◦○■□☐☑✓✔➢➣⦿⦾]\s+/gm, '• ')
    // Handle numbered lists (1. 2. 3. etc.)
    .replace(/^\d+\.\s+/gm, '• ')
}

/**
 * Preserve text structure by adding markers for sections
 * This helps downstream parsers identify sections better
 */
export function addStructuralMarkers(text: string): string {
  const lines = text.split('\n')
  const result: string[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    const lower = trimmed.toLowerCase()

    // Detect section headers (short lines in all caps or title case)
    if (trimmed.length > 0 && trimmed.length < 50) {
      const isAllCaps = trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed)
      const isTitleCase = /^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/.test(trimmed)

      // Check if it's a common resume section
      const isSectionHeader = [
        'experience', 'education', 'skills', 'projects',
        'work history', 'employment', 'qualifications',
        'certifications', 'achievements', 'summary'
      ].some(section => lower.includes(section))

      if ((isAllCaps || isTitleCase) && isSectionHeader) {
        result.push(`\n### ${trimmed} ###\n`) // Add markers
        continue
      }
    }

    result.push(line)
  }

  return result.join('\n')
}

/**
 * Compare two extraction results and return the better one
 */
export function chooseBetterExtraction(
  textA: string,
  confidenceA: number,
  textB: string,
  confidenceB: number
): { text: string; confidence: number; reason: string } {
  // If one has significantly higher confidence, use it
  if (Math.abs(confidenceA - confidenceB) > 15) {
    if (confidenceA > confidenceB) {
      return {
        text: textA,
        confidence: confidenceA,
        reason: `Confidence difference: ${confidenceA} vs ${confidenceB}`
      }
    } else {
      return {
        text: textB,
        confidence: confidenceB,
        reason: `Confidence difference: ${confidenceB} vs ${confidenceA}`
      }
    }
  }

  // If confidences are similar, prefer longer text (more information)
  if (textA.length > textB.length * 1.2) {
    return {
      text: textA,
      confidence: confidenceA,
      reason: `Text A is ${Math.round((textA.length / textB.length - 1) * 100)}% longer`
    }
  } else if (textB.length > textA.length * 1.2) {
    return {
      text: textB,
      confidence: confidenceB,
      reason: `Text B is ${Math.round((textB.length / textA.length - 1) * 100)}% longer`
    }
  }

  // Otherwise use the one with higher confidence
  if (confidenceA >= confidenceB) {
    return {
      text: textA,
      confidence: confidenceA,
      reason: 'Higher confidence'
    }
  } else {
    return {
      text: textB,
      confidence: confidenceB,
      reason: 'Higher confidence'
    }
  }
}

/**
 * Log extraction details for debugging and monitoring
 */
export interface ExtractionLog {
  fileId: string
  filename: string
  fileType: string
  method: string
  confidence: number
  textLength: number
  duration: number
  errors: string[]
  warnings: string[]
  timestamp: Date
}

export function logExtraction(log: ExtractionLog): void {
  console.log('📄 Text Extraction Log:', {
    file: log.filename,
    type: log.fileType,
    method: log.method,
    confidence: `${log.confidence}%`,
    textLength: log.textLength,
    duration: `${log.duration}ms`,
    errors: log.errors.length,
    warnings: log.warnings.length,
  })

  if (log.errors.length > 0) {
    console.warn('  Errors:', log.errors)
  }

  if (log.warnings.length > 0) {
    console.warn('  Warnings:', log.warnings)
  }
}
