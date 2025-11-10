import puppeteer, { Browser, Page } from "puppeteer"
import type { ParsedResume } from "../parsers/enhanced-parser"
import { renderJakesResume } from "../templates/template-renderer"

/**
 * PDF Generation Options
 */
export interface PDFGenerationOptions {
  format?: "letter" | "a4"
  printBackground?: boolean
  margin?: {
    top?: string
    right?: string
    bottom?: string
    left?: string
  }
}

/**
 * PDF Generator Service using Puppeteer
 */
export class PDFGenerator {
  private browser: Browser | null = null

  /**
   * Initialize browser instance
   */
  async initialize(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
        ],
      })
    }
  }

  /**
   * Close browser instance
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }

  /**
   * Generate PDF from HTML content
   */
  async generateFromHTML(
    html: string,
    options: PDFGenerationOptions = {}
  ): Promise<Buffer> {
    await this.initialize()

    if (!this.browser) {
      throw new Error("Browser not initialized")
    }

    const page: Page = await this.browser.newPage()

    try {
      // Set content
      await page.setContent(html, {
        waitUntil: "networkidle0",
      })

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: options.format || "letter",
        printBackground: options.printBackground !== false,
        margin: options.margin || {
          top: "0.5in",
          right: "0.5in",
          bottom: "0.5in",
          left: "0.5in",
        },
        preferCSSPageSize: false,
      })

      return Buffer.from(pdfBuffer)
    } finally {
      await page.close()
    }
  }

  /**
   * Generate PDF from parsed resume using Jake's template
   */
  async generateFromParsedResume(
    parsedResume: ParsedResume,
    summary?: string,
    options: PDFGenerationOptions = {}
  ): Promise<Buffer> {
    // Render HTML from template
    const html = renderJakesResume(parsedResume, summary)

    // Generate PDF from HTML
    return await this.generateFromHTML(html, options)
  }
}

/**
 * Global PDF generator instance (singleton)
 */
let globalGenerator: PDFGenerator | null = null

/**
 * Get or create global PDF generator instance
 */
export function getPDFGenerator(): PDFGenerator {
  if (!globalGenerator) {
    globalGenerator = new PDFGenerator()
  }
  return globalGenerator
}

/**
 * Generate PDF from parsed resume (convenience function)
 */
export async function generateResumePDF(
  parsedResume: ParsedResume,
  summary?: string,
  options: PDFGenerationOptions = {}
): Promise<Buffer> {
  const generator = getPDFGenerator()
  return await generator.generateFromParsedResume(parsedResume, summary, options)
}

/**
 * Cleanup function to close browser
 */
export async function cleanupPDFGenerator(): Promise<void> {
  if (globalGenerator) {
    await globalGenerator.close()
    globalGenerator = null
  }
}
