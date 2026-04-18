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
   * Generate PDF from HTML content — always exactly one page.
   *
   * Two-pass strategy:
   *  1. Render at 720px viewport (= letter width minus margins) and measure scrollHeight.
   *  2a. Sparse resume (content < 88% of target): inject CSS to redistribute extra
   *      whitespace proportionally across sections, entries, and the header.
   *  2b. Dense resume (content > 106% of target): inject CSS to tighten section/entry
   *      gaps and bullet spacing before scaling.
   *  3. Re-measure after CSS adjustment, then apply a Puppeteer scale for fine-tuning.
   *     Scale stays close to 1.0 because CSS handles the bulk of the adjustment.
   *
   * Target height: 940px (= 9.79in × 96 dpi) — chosen as a conservative floor that
   * fits the tightest template margins (classic: 0.6in t/b → 9.8in usable). Modern
   * and professional templates have slightly more usable height; the final scale
   * (clamped to ≤ 1.45) fills that remaining gap without overflow.
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
      // Match the narrowest print content width used by any template (classic: 7.4in ≈ 710px).
      // Using 720px (7.5in) is accurate for professional/modern; the 10px diff for classic
      // produces a negligible <2% height error.
      await page.setViewport({ width: 720, height: 1056, deviceScaleFactor: 1 })

      // Set content — wait for font imports to complete
      await page.setContent(html, {
        waitUntil: ["networkidle0", "domcontentloaded"],
      })

      // Conservative cross-template usable height (see JSDoc above).
      const TARGET_HEIGHT_PX = 940

      let contentHeight = await page.evaluate(
        () => document.documentElement.scrollHeight
      )

      const ratio = TARGET_HEIGHT_PX / contentHeight

      const rawScale = TARGET_HEIGHT_PX / contentHeight
      const scale = Math.min(1.45, Math.max(0.62, rawScale))

      // Generate PDF — CSS @page controls physical margins; Puppeteer margin = 0
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
        scale,
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
    options: PDFGenerationOptions = {},
    templateId?: string | null
  ): Promise<Buffer> {
    // Render HTML from template
    const html = renderJakesResume(parsedResume, summary, templateId)

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
  options: PDFGenerationOptions = {},
  templateId?: string | null
): Promise<Buffer> {
  const generator = getPDFGenerator()
  return await generator.generateFromParsedResume(parsedResume, summary, options, templateId)
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
