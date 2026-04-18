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
      await page.setViewport({ width: 720, height: 1056, deviceScaleFactor: 1 })

      await page.setContent(html, {
        waitUntil: ["networkidle0", "domcontentloaded"],
      })

      // Conservative cross-template usable height (see JSDoc above).
      const TARGET_HEIGHT_PX = 940

      let contentHeight = await page.evaluate(
        () => document.documentElement.scrollHeight
      )

      const ratio = TARGET_HEIGHT_PX / contentHeight

      if (ratio > 1.12) {
        // Sparse resume: redistribute extra whitespace via CSS so scale stays near 1.0.
        const extraPx = TARGET_HEIGHT_PX - contentHeight
        await page.evaluate((extra: number) => {
          const header = document.querySelector<HTMLElement>(".header")
          const sections = Array.from(document.querySelectorAll<HTMLElement>(".section"))
          const entries = Array.from(document.querySelectorAll<HTMLElement>(".entry"))
          // Weight: header=1, each section=1, each entry=0.4
          const totalWeight = (header ? 1 : 0) + sections.length + entries.length * 0.4
          const pxPerUnit = totalWeight > 0 ? extra / totalWeight : 0

          if (header) {
            const cur = parseFloat(getComputedStyle(header).marginBottom) || 2
            header.style.marginBottom = cur + pxPerUnit * 0.8 + "px"
          }
          sections.forEach(el => {
            const cur = parseFloat(getComputedStyle(el).marginTop) || 4
            el.style.marginTop = cur + pxPerUnit * 0.7 + "px"
          })
          entries.forEach(el => {
            const cur = parseFloat(getComputedStyle(el).marginBottom) || 3
            el.style.marginBottom = cur + pxPerUnit * 0.3 + "px"
          })
        }, extraPx)

        contentHeight = await page.evaluate(
          () => document.documentElement.scrollHeight
        )
      } else if (ratio < 0.944) {
        // Dense resume: tighten spacing so less compression is needed from scale.
        await page.evaluate((r: number) => {
          const compress = Math.max(r * 0.85, 0.65)
          document.querySelectorAll<HTMLElement>(".section").forEach(el => {
            const cur = parseFloat(getComputedStyle(el).marginTop) || 6
            el.style.marginTop = Math.max(cur * compress, 1.5) + "px"
          })
          document.querySelectorAll<HTMLElement>(".entry").forEach(el => {
            const cur = parseFloat(getComputedStyle(el).marginBottom) || 4
            el.style.marginBottom = Math.max(cur * compress, 1) + "px"
          })
          document.querySelectorAll<HTMLElement>(".bullet").forEach(el => {
            el.style.marginBottom = "0"
          })
          document.querySelectorAll<HTMLElement>(".bullets").forEach(el => {
            el.style.marginTop = "0"
          })
        }, ratio)

        contentHeight = await page.evaluate(
          () => document.documentElement.scrollHeight
        )
      }

      // CSS handled the bulk; scale provides final fine-tuning.
      const rawScale = TARGET_HEIGHT_PX / contentHeight
      const scale = Math.min(1.45, Math.max(0.55, rawScale))
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
