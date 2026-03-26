import fs from "fs-extra"
import chromium from "@sparticuz/chromium-min"
import puppeteer, { Browser, Page, type LaunchOptions } from "puppeteer-core"
import { getChromiumBinaryUrl } from "../config/env"
import type { ParsedResume } from "../parsers/enhanced-parser"
import { renderJakesResume } from "../templates/template-renderer"

const COMMON_LOCAL_CHROME_PATHS = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  process.env.CHROME_EXECUTABLE_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Chromium\\Application\\chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium-browser",
  "/usr/bin/chromium",
].filter((value): value is string => Boolean(value))

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

  private async resolveLocalExecutablePath(): Promise<string> {
    for (const candidate of COMMON_LOCAL_CHROME_PATHS) {
      if (await fs.pathExists(candidate)) {
        return candidate
      }
    }

    try {
      const installedPuppeteer = await import("puppeteer")
      const candidate = installedPuppeteer.executablePath()
      if (candidate && await fs.pathExists(candidate)) {
        return candidate
      }
    } catch {
      // Fall through to the explicit error below.
    }

    throw new Error(
      "No Chrome/Chromium executable was found. Set PUPPETEER_EXECUTABLE_PATH locally or configure CHROMIUM_BINARY_URL for Vercel."
    )
  }

  private async getLaunchOptions(): Promise<LaunchOptions> {
    if (process.env.VERCEL) {
      chromium.setGraphicsMode = false

      const executablePath = await chromium.executablePath(getChromiumBinaryUrl())

      return {
        args: puppeteer.defaultArgs({
          args: chromium.args,
          headless: "shell",
        }),
        executablePath,
        headless: "shell",
      }
    }

    const executablePath = await this.resolveLocalExecutablePath()

    return {
      headless: true,
      executablePath,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    }
  }

  /**
   * Initialize browser instance
   */
  async initialize(): Promise<void> {
    if (!this.browser) {
      const launchOptions = await this.getLaunchOptions()
      this.browser = await puppeteer.launch(launchOptions)
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
      // Set content — wait for font imports to complete
      await page.setContent(html, {
        waitUntil: ["networkidle0", "domcontentloaded"],
      })

      // Generate PDF — use CSS @page margins, no additional Puppeteer margins
      const pdfBuffer = await page.pdf({
        format: options.format || "letter",
        printBackground: options.printBackground !== false,
        margin: options.margin || {
          top: "0",
          right: "0",
          bottom: "0",
          left: "0",
        },
        preferCSSPageSize: true,
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
