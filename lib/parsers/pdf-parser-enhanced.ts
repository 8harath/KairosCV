/**
 * Enhanced PDF Text Extraction with Multi-Strategy Approach
 *
 * Implements a three-tier extraction pipeline:
 * 1. unpdf (fastest, best for standard PDFs)
 * 2. pdfreader (better for multi-column/tables)
 * 3. tesseract.js OCR (fallback for scanned PDFs)
 *
 * Automatically selects the best extraction based on confidence scores.
 */

import fs from 'fs-extra'
import { getDocumentProxy } from 'unpdf'
import { createWorker } from 'tesseract.js'
import {
  assessTextQuality,
  cleanExtractedText,
  detectMultiColumn,
  detectTables,
  chooseBetterExtraction,
  type ExtractionQuality,
} from './extraction-utils'

// Type definition for pdfreader (no @types available)
declare module 'pdfreader' {
  export class PdfReader {
    parseFileItems(
      filePath: string,
      callback: (err: Error | null, item?: any) => void
    ): void
  }
}

const PdfReader = require('pdfreader').PdfReader

export interface PDFExtractionResult {
  text: string
  confidence: number // 0-100
  method: 'unpdf' | 'pdfreader' | 'ocr' | 'failed'
  quality: ExtractionQuality
  metadata: {
    pageCount: number
    hasMultiColumn: boolean
    hasTables: boolean
    fileSize: number
  }
  duration: number // milliseconds
}

/**
 * Main extraction function - tries all strategies and returns best result
 */
export async function extractPDFEnhanced(filePath: string): Promise<PDFExtractionResult> {
  const startTime = Date.now()
  const stats = await fs.stat(filePath)
  const fileSize = stats.size

  console.log(`📄 Starting PDF extraction for file (${Math.round(fileSize / 1024)}KB)`)

  // STRATEGY 1: unpdf (fastest, good for standard PDFs)
  try {
    console.log('  Trying unpdf extraction...')
    const unpdfResult = await extractWithUnpdf(filePath, fileSize)

    if (unpdfResult.confidence >= 85) {
      unpdfResult.duration = Date.now() - startTime
      console.log(`  ✓ unpdf succeeded with ${unpdfResult.confidence}% confidence`)
      return unpdfResult
    }

    console.log(`  ⚠ unpdf confidence low (${unpdfResult.confidence}%), trying fallback...`)

    // STRATEGY 2: pdfreader (better for complex layouts)
    try {
      console.log('  Trying pdfreader extraction...')
      const pdfreaderResult = await extractWithPdfreader(filePath, fileSize)

      // Choose better result between unpdf and pdfreader
      const better = chooseBetterExtraction(
        unpdfResult.text,
        unpdfResult.confidence,
        pdfreaderResult.text,
        pdfreaderResult.confidence
      )

      if (better.confidence >= 80) {
        const finalResult = better.text === unpdfResult.text ? unpdfResult : pdfreaderResult
        finalResult.duration = Date.now() - startTime
        console.log(`  ✓ ${finalResult.method} won with ${finalResult.confidence}% confidence`)
        return finalResult
      }

      console.log(`  ⚠ Both methods have low confidence, trying OCR as last resort...`)

      // STRATEGY 3: OCR (slowest, for scanned PDFs)
      try {
        console.log('  Trying OCR extraction...')
        const ocrResult = await extractWithOCR(filePath, fileSize)
        ocrResult.duration = Date.now() - startTime
        console.log(`  ✓ OCR completed with ${ocrResult.confidence}% confidence`)
        return ocrResult
      } catch (ocrError) {
        console.error('  ✗ OCR failed:', ocrError)
        // Return best of unpdf/pdfreader even if low confidence
        const finalResult = better.text === unpdfResult.text ? unpdfResult : pdfreaderResult
        finalResult.duration = Date.now() - startTime
        return finalResult
      }
    } catch (pdfreaderError) {
      console.warn('  ✗ pdfreader failed:', pdfreaderError)
      unpdfResult.duration = Date.now() - startTime
      return unpdfResult
    }
  } catch (unpdfError) {
    console.warn('  ✗ unpdf failed:', unpdfError)

    // If unpdf completely fails, try pdfreader directly
    try {
      console.log('  Trying pdfreader extraction (unpdf failed)...')
      const pdfreaderResult = await extractWithPdfreader(filePath, fileSize)
      pdfreaderResult.duration = Date.now() - startTime
      return pdfreaderResult
    } catch (pdfreaderError) {
      console.error('  ✗ pdfreader failed:', pdfreaderError)

      // Last resort: OCR
      try {
        console.log('  Trying OCR extraction (all text methods failed)...')
        const ocrResult = await extractWithOCR(filePath, fileSize)
        ocrResult.duration = Date.now() - startTime
        return ocrResult
      } catch (ocrError) {
        console.error('  ✗ All extraction methods failed!')
        throw new Error('Failed to extract text from PDF using any method')
      }
    }
  }
}

/**
 * Strategy 1: Extract with unpdf (Mozilla's pdf.js wrapper)
 */
async function extractWithUnpdf(filePath: string, fileSize: number): Promise<PDFExtractionResult> {
  const buffer = await fs.readFile(filePath)
  const pdf = await getDocumentProxy(new Uint8Array(buffer))

  let fullText = ''
  const pageCount = pdf.numPages

  // Extract text from each page
  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()

    // Sort text items by position (y coordinate, then x) to preserve reading order
    const items = textContent.items
      .filter((item: any) => 'str' in item && item.str.trim().length > 0)
      .sort((a: any, b: any) => {
        // Compare y positions (top to bottom)
        const yDiff = Math.abs(b.transform[5] - a.transform[5])
        if (yDiff < 5) {
          // Same line - sort by x position (left to right)
          return a.transform[4] - b.transform[4]
        }
        return b.transform[5] - a.transform[5]
      })

    // Combine text items with proper spacing
    let previousY: number | null = null
    let lineText = ''

    for (const item of items as any[]) {
      const currentY = item.transform[5]

      // New line if y position changed significantly
      if (previousY !== null && Math.abs(currentY - previousY) > 5) {
        fullText += lineText.trim() + '\n'
        lineText = ''
      }

      lineText += item.str + ' '
      previousY = currentY
    }

    fullText += lineText.trim() + '\n\n'
  }

  // Clean and assess quality
  const cleanedText = cleanExtractedText(fullText)
  const quality = assessTextQuality(cleanedText)

  return {
    text: cleanedText,
    confidence: quality.confidence,
    method: 'unpdf',
    quality,
    metadata: {
      pageCount,
      hasMultiColumn: detectMultiColumn(cleanedText),
      hasTables: detectTables(cleanedText),
      fileSize,
    },
    duration: 0, // Set by caller
  }
}

/**
 * Strategy 2: Extract with pdfreader (better for tables/multi-column)
 */
async function extractWithPdfreader(filePath: string, fileSize: number): Promise<PDFExtractionResult> {
  return new Promise((resolve, reject) => {
    const rows: Record<number, string[]> = {}
    let pageCount = 0
    let currentPage = 0

    const reader = new PdfReader()

    reader.parseFileItems(filePath, (err: Error | null, item?: any) => {
      if (err) {
        reject(err)
      } else if (!item) {
        // End of file - compile results
        try {
          // Sort rows by y position and join text
          const fullText = Object.keys(rows)
            .map(Number)
            .sort((a, b) => a - b)
            .map(y => {
              const rowText = rows[y].join(' ')
              return rowText.trim()
            })
            .filter(line => line.length > 0)
            .join('\n')

          const cleanedText = cleanExtractedText(fullText)
          const quality = assessTextQuality(cleanedText)

          resolve({
            text: cleanedText,
            confidence: quality.confidence,
            method: 'pdfreader',
            quality,
            metadata: {
              pageCount,
              hasMultiColumn: detectMultiColumn(cleanedText),
              hasTables: detectTables(cleanedText),
              fileSize,
            },
            duration: 0,
          })
        } catch (error) {
          reject(error)
        }
      } else if (item.page) {
        // New page
        currentPage = item.page
        pageCount = Math.max(pageCount, currentPage)
      } else if (item.text) {
        // Text item with position
        const y = Math.floor(item.y * 100) // Scale for grouping
        if (!rows[y]) {
          rows[y] = []
        }
        rows[y].push(item.text)
      }
    })
  })
}

/**
 * Strategy 3: Extract with OCR (tesseract.js) for scanned PDFs
 */
async function extractWithOCR(filePath: string, fileSize: number): Promise<PDFExtractionResult> {
  console.log('  📸 Converting PDF to images for OCR...')

  // Dynamically import pdf-to-png-converter only when OCR is needed
  const { pdfToPng } = await import('pdf-to-png-converter')

  // Convert PDF pages to PNG images
  const pngPages = await pdfToPng(filePath, {
    outputFolder: '/tmp/kairos-ocr',
    viewportScale: 2.0, // Higher resolution for better OCR
    pagesToProcess: [1, 2, 3, 4, 5], // Limit to first 5 pages for performance
  })

  const pageCount = pngPages.length
  console.log(`  Processing ${pageCount} pages with OCR...`)

  // Create Tesseract worker
  const worker = await createWorker('eng')

  let fullText = ''
  let totalConfidence = 0

  try {
    // Process each page
    for (let i = 0; i < pngPages.length; i++) {
      console.log(`    Page ${i + 1}/${pngPages.length}...`)

      const { data } = await worker.recognize(pngPages[i].path)
      fullText += data.text + '\n\n'
      totalConfidence += data.confidence
    }

    // Clean up temp images
    for (const page of pngPages) {
      try {
        await fs.unlink(page.path)
      } catch (error) {
        console.warn(`    Could not delete temp file: ${page.path}`)
      }
    }

    // Clean up temp directory
    try {
      await fs.rmdir('/tmp/kairos-ocr')
    } catch (error) {
      // Directory might not be empty or might not exist - ignore
    }
  } finally {
    await worker.terminate()
  }

  const avgOCRConfidence = totalConfidence / pageCount
  const cleanedText = cleanExtractedText(fullText)
  const quality = assessTextQuality(cleanedText)

  // Combine OCR confidence with text quality assessment
  const combinedConfidence = Math.round((avgOCRConfidence + quality.confidence) / 2)

  return {
    text: cleanedText,
    confidence: combinedConfidence,
    method: 'ocr',
    quality,
    metadata: {
      pageCount,
      hasMultiColumn: false, // OCR doesn't preserve multi-column well
      hasTables: false,
      fileSize,
    },
    duration: 0,
  }
}
