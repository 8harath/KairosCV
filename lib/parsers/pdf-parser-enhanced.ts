/**
 * Enhanced PDF Text Extraction with Multi-Strategy Approach
 *
 * Implements a two-tier extraction pipeline:
 * 1. unpdf (fastest, best for standard PDFs)
 * 2. tesseract.js OCR (fallback for scanned PDFs)
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
  type ExtractionQuality,
} from './extraction-utils'

export interface PDFExtractionResult {
  text: string
  confidence: number // 0-100
  method: 'unpdf' | 'ocr' | 'failed'
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

    if (unpdfResult.confidence >= 80) {
      unpdfResult.duration = Date.now() - startTime
      console.log(`  ✓ unpdf succeeded with ${unpdfResult.confidence}% confidence`)
      return unpdfResult
    }

    console.log(`  ⚠ unpdf confidence low (${unpdfResult.confidence}%), trying OCR fallback...`)

    // STRATEGY 2: OCR (for scanned PDFs or low-quality text extraction)
    try {
      console.log('  Trying OCR extraction...')
      const ocrResult = await extractWithOCR(filePath, fileSize)
      ocrResult.duration = Date.now() - startTime
      console.log(`  ✓ OCR completed with ${ocrResult.confidence}% confidence`)

      // Return OCR if it's better than unpdf
      if (ocrResult.confidence > unpdfResult.confidence) {
        return ocrResult
      }

      // Otherwise return unpdf result even if confidence is low
      unpdfResult.duration = Date.now() - startTime
      return unpdfResult
    } catch (ocrError) {
      console.error('  ✗ OCR failed:', ocrError)
      // Return unpdf result even if low confidence
      unpdfResult.duration = Date.now() - startTime
      return unpdfResult
    }
  } catch (unpdfError) {
    console.warn('  ✗ unpdf failed:', unpdfError)

    // If unpdf completely fails, try OCR directly
    try {
      console.log('  Trying OCR extraction (unpdf failed)...')
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
 * Strategy 2: Extract with OCR (tesseract.js) for scanned PDFs
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
