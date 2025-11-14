/**
 * Enhanced DOCX Text Extraction
 *
 * Uses mammoth to convert DOCX to HTML, then parses HTML to text
 * while preserving structure (bullets, tables, formatting).
 */

import mammoth from 'mammoth'
import fs from 'fs-extra'
import {
  assessTextQuality,
  cleanExtractedText,
  normalizeBullets,
  type ExtractionQuality,
} from './extraction-utils'

export interface DOCXExtractionResult {
  text: string
  html: string
  confidence: number
  quality: ExtractionQuality
  metadata: {
    fileSize: number
    hasTables: boolean
    hasBullets: boolean
  }
  duration: number
}

/**
 * Extract text from DOCX with structure preservation
 */
export async function extractDOCXEnhanced(filePath: string): Promise<DOCXExtractionResult> {
  const startTime = Date.now()
  const stats = await fs.stat(filePath)
  const fileSize = stats.size

  console.log(`📄 Starting DOCX extraction for file (${Math.round(fileSize / 1024)}KB)`)

  const buffer = await fs.readFile(filePath)

  // Extract as HTML to preserve structure (bullets, tables, formatting)
  console.log('  Converting DOCX to HTML...')
  const htmlResult = await mammoth.convertToHtml({ buffer }, {
    styleMap: [
      // Preserve list markers
      "p[style-name='List Paragraph'] => li",
      // Preserve headings
      "p[style-name='Heading 1'] => h1",
      "p[style-name='Heading 2'] => h2",
      "p[style-name='Heading 3'] => h3",
    ]
  })

  const html = htmlResult.value

  // Parse HTML to structured text
  console.log('  Converting HTML to structured text...')
  const structuredText = parseHTMLToStructuredText(html)

  // Clean and normalize
  const cleanedText = cleanExtractedText(structuredText)
  const normalizedText = normalizeBullets(cleanedText)

  // Assess quality
  const quality = assessTextQuality(normalizedText)

  const duration = Date.now() - startTime

  // Detect features
  const hasTables = html.includes('<table') || cleanedText.includes('\t')
  const hasBullets = html.includes('<li>') || /^[•\-*]/m.test(normalizedText)

  console.log(`  ✓ DOCX extraction completed in ${duration}ms with ${quality.confidence}% confidence`)

  return {
    text: normalizedText,
    html,
    confidence: quality.confidence,
    quality,
    metadata: {
      fileSize,
      hasTables,
      hasBullets,
    },
    duration,
  }
}

/**
 * Convert HTML to plain text while preserving structure
 */
function parseHTMLToStructuredText(html: string): string {
  let text = html

  // Preserve headings with extra spacing
  text = text.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n\n$1\n\n')
  text = text.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n\n$1\n\n')
  text = text.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n\n$1\n')

  // Preserve paragraphs
  text = text.replace(/<\/p>/gi, '\n\n')
  text = text.replace(/<p[^>]*>/gi, '')

  // Preserve list items with bullet markers
  text = text.replace(/<li[^>]*>/gi, '• ')
  text = text.replace(/<\/li>/gi, '\n')
  text = text.replace(/<\/?[ou]l[^>]*>/gi, '\n')

  // Preserve line breaks
  text = text.replace(/<br\s*\/?>/gi, '\n')

  // Preserve table structure (convert to tab-separated)
  text = text.replace(/<\/td>/gi, '\t')
  text = text.replace(/<\/tr>/gi, '\n')
  text = text.replace(/<\/?t[rdh][^>]*>/gi, '')
  text = text.replace(/<\/?table[^>]*>/gi, '\n')

  // Preserve strong/bold text (keep text, remove tags)
  text = text.replace(/<\/?strong[^>]*>/gi, '')
  text = text.replace(/<\/?b[^>]*>/gi, '')

  // Preserve emphasis/italic text (keep text, remove tags)
  text = text.replace(/<\/?em[^>]*>/gi, '')
  text = text.replace(/<\/?i[^>]*>/gi, '')

  // Remove all other HTML tags
  text = text.replace(/<[^>]+>/g, '')

  // Decode HTML entities
  text = decodeHTMLEntities(text)

  // Clean up excessive whitespace
  text = text
    .replace(/\t{2,}/g, '\t') // Collapse multiple tabs
    .replace(/ {2,}/g, ' ') // Collapse multiple spaces
    .replace(/\n{3,}/g, '\n\n') // Collapse multiple newlines (max 2)
    .trim()

  return text
}

/**
 * Decode common HTML entities
 */
function decodeHTMLEntities(text: string): string {
  const entities: Record<string, string> = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x27;': "'",
    '&apos;': "'",
    '&mdash;': '—',
    '&ndash;': '–',
    '&bull;': '•',
    '&middot;': '·',
    '&hellip;': '…',
  }

  let decoded = text
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), char)
  }

  // Decode numeric entities (&#123; or &#x1A;)
  decoded = decoded.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(Number(dec)))
  decoded = decoded.replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)))

  return decoded
}

/**
 * Extract text with basic mammoth (fallback if HTML conversion fails)
 */
export async function extractDOCXBasic(filePath: string): Promise<DOCXExtractionResult> {
  const startTime = Date.now()
  const stats = await fs.stat(filePath)
  const fileSize = stats.size

  console.log('  Using basic DOCX extraction (fallback)...')

  const buffer = await fs.readFile(filePath)

  // Extract raw text
  const textResult = await mammoth.extractRawText({ buffer })
  const rawText = textResult.value

  // Clean text
  const cleanedText = cleanExtractedText(rawText)

  // Assess quality
  const quality = assessTextQuality(cleanedText)

  const duration = Date.now() - startTime

  console.log(`  ✓ Basic DOCX extraction completed in ${duration}ms with ${quality.confidence}% confidence`)

  return {
    text: cleanedText,
    html: '', // No HTML in basic mode
    confidence: quality.confidence,
    quality,
    metadata: {
      fileSize,
      hasTables: false,
      hasBullets: false,
    },
    duration,
  }
}
