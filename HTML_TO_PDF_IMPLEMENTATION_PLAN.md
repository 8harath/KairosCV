# HTML-to-PDF Implementation Plan - Branch: bharath-013

## 📋 Overview

This document outlines the comprehensive implementation plan for transitioning the Resume Optimizer from basic PDF-lib generation to a professional HTML-to-PDF approach using Jake's Resume Template design.

**Status:** Implementation Ready
**Branch:** bharath-013
**Target:** Production-ready MVP with HTML-to-PDF generation

---

## 🎯 Goals

1. **Replace pdf-lib** with Puppeteer/Playwright for professional PDF generation
2. **Create ATS-optimized HTML templates** inspired by Jake's Resume LaTeX design
3. **Integrate Gemini API** for intelligent content enhancement
4. **Improve parsing** to extract structured data from any resume format
5. **Maintain real-time progress** updates via Server-Sent Events
6. **Deploy to production** with full end-to-end testing

---

## 🏗️ Current Architecture

### What Already Exists

```
Next.js 16 Application
├── Frontend: React 19 + Radix UI components
├── API Routes: Next.js API endpoints
├── File Upload: Multi-format support (PDF, DOCX, TXT)
├── Parser: Basic text extraction with pdf-parse & mammoth
├── Progress: Server-Sent Events (SSE) streaming
└── PDF Generation: Basic pdf-lib implementation (TO BE REPLACED)
```

### Current File Structure

```
kairosCV/
├── app/
│   ├── api/
│   │   ├── upload/route.ts          ✓ File upload endpoint
│   │   ├── stream/[fileId]/route.ts ✓ SSE progress streaming
│   │   └── download/[fileId]/route.ts ✓ PDF download
│   ├── page.tsx                      ✓ Main UI
│   └── layout.tsx                    ✓ App layout
├── lib/
│   ├── resume-processor.ts          ⚠️ TO BE ENHANCED
│   ├── file-storage.ts              ✓ File management
│   └── utils.ts                     ✓ Utilities
├── components/                       ✓ UI components
└── public/                          ✓ Static assets
```

---

## 🔄 New HTML-to-PDF Architecture

### Technology Stack

| Component | Current | New |
|-----------|---------|-----|
| PDF Generation | pdf-lib (manual drawing) | **Puppeteer** (HTML→PDF) |
| Template Engine | None | **Handlebars / React SSR** |
| AI Enhancement | None | **Google Gemini 1.5 Flash** |
| Data Validation | Loose typing | **Zod schemas** |
| CSS Framework | Tailwind | **Tailwind + Custom ATS-optimized styles** |

### Data Flow

```
┌─────────────┐
│ User Upload │ (PDF/DOCX/TXT)
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ File Validation │ (Type, Size, Security)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Parser Module   │ → Extract raw text
│  - PDF Parser   │ → Detect sections (Experience, Education, etc.)
│  - DOCX Parser  │ → Extract contact info (email, phone, LinkedIn)
│  - TXT Parser   │ → Structure into ResumeData object
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│ Gemini AI Service   │ → Enhance bullet points (action verbs, metrics)
│  - Bullet Enhance   │ → Extract/categorize skills
│  - Skills Extract   │ → Optimize language for ATS
│  - Grammar Check    │ → Add missing keywords
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ HTML Template       │ → Populate Jake's Resume template
│  - Contact Header   │ → Format dates consistently
│  - Experience Items │ → Apply professional styling
│  - Education Items  │ → Ensure ATS-friendly formatting
│  - Skills Grid      │ → Escape special characters
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Puppeteer Engine    │ → Render HTML in headless browser
│  - Page Setup       │ → Apply print CSS
│  - PDF Generation   │ → Optimize for file size
│  - A4/Letter Size   │ → Output high-quality PDF
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Optimized PDF       │ → Download ready
└─────────────────────┘
```

---

## 📦 Phase 1: Setup & Dependencies (Days 1-2)

### 1.1 Install Required Packages

```bash
pnpm add puppeteer
pnpm add handlebars
pnpm add zod
pnpm add @google/generative-ai
pnpm add date-fns
pnpm add -D @types/puppeteer @types/handlebars
```

### 1.2 Environment Configuration

Create `.env.local`:
```env
# Gemini API Configuration
GOOGLE_GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-1.5-flash
GEMINI_TEMPERATURE=0.3
GEMINI_MAX_TOKENS=2048

# Application Settings
MAX_FILE_SIZE=5242880
UPLOAD_DIR=uploads
OUTPUT_DIR=outputs

# Puppeteer Configuration
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
PUPPETEER_HEADLESS=true
```

### 1.3 Update Package Scripts

Add to `package.json`:
```json
{
  "scripts": {
    "postinstall": "puppeteer browsers install chrome",
    "test": "jest",
    "test:parser": "jest lib/parsers",
    "test:generator": "jest lib/pdf-generator"
  }
}
```

---

## 📝 Phase 2: Enhanced Resume Parser (Days 3-5)

### 2.1 Create Resume Data Schema

**File:** `lib/schemas/resume-schema.ts`

```typescript
import { z } from 'zod'

// Contact Information
export const ContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().optional(),
  linkedin: z.string().url("Invalid LinkedIn URL").optional(),
  github: z.string().url("Invalid GitHub URL").optional(),
  location: z.string().optional(),
})

// Experience Entry
export const ExperienceSchema = z.object({
  company: z.string().min(1),
  title: z.string().min(1),
  location: z.string().optional(),
  startDate: z.string(), // Format: "Jan 2020"
  endDate: z.string().or(z.literal("Present")),
  bullets: z.array(z.string()).min(1),
  isEnhanced: z.boolean().default(false),
})

// Education Entry
export const EducationSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  field: z.string().optional(),
  location: z.string().optional(),
  graduationDate: z.string(),
  gpa: z.string().optional(),
  honors: z.array(z.string()).optional(),
})

// Project Entry
export const ProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  technologies: z.array(z.string()),
  link: z.string().url().optional(),
  bullets: z.array(z.string()),
})

// Skills Categorization
export const SkillsSchema = z.object({
  languages: z.array(z.string()),
  frameworks: z.array(z.string()),
  tools: z.array(z.string()),
  databases: z.array(z.string()).optional(),
  other: z.array(z.string()).optional(),
})

// Complete Resume Schema
export const ResumeDataSchema = z.object({
  contact: ContactSchema,
  summary: z.string().optional(),
  experience: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
  projects: z.array(ProjectSchema).optional(),
  skills: SkillsSchema,
  certifications: z.array(z.string()).optional(),
})

export type ResumeData = z.infer<typeof ResumeDataSchema>
export type Contact = z.infer<typeof ContactSchema>
export type Experience = z.infer<typeof ExperienceSchema>
export type Education = z.infer<typeof EducationSchema>
export type Project = z.infer<typeof ProjectSchema>
export type Skills = z.infer<typeof SkillsSchema>
```

### 2.2 Enhanced Section Detection

**File:** `lib/parsers/section-detector.ts`

```typescript
export const SECTION_PATTERNS = {
  contact: {
    email: /[\w.-]+@[\w.-]+\.\w+/gi,
    phone: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    linkedin: /linkedin\.com\/in\/[\w-]+/gi,
    github: /github\.com\/[\w-]+/gi,
  },

  experience: [
    /experience/i,
    /work\s+history/i,
    /employment/i,
    /professional\s+experience/i,
  ],

  education: [
    /education/i,
    /academic/i,
    /university/i,
    /college/i,
  ],

  skills: [
    /skills/i,
    /technical\s+skills/i,
    /technologies/i,
    /competencies/i,
    /proficiencies/i,
  ],

  projects: [
    /projects/i,
    /portfolio/i,
    /personal\s+projects/i,
  ],

  certifications: [
    /certifications?/i,
    /licenses?/i,
  ],
}

export function detectSectionType(text: string): string | null {
  const normalized = text.toLowerCase().trim()

  for (const [sectionName, patterns] of Object.entries(SECTION_PATTERNS)) {
    if (Array.isArray(patterns)) {
      if (patterns.some(pattern => pattern.test(normalized))) {
        return sectionName
      }
    }
  }

  return null
}

export function extractContactInfo(text: string): Partial<Contact> {
  const contact: Partial<Contact> = {}

  // Extract email
  const emailMatch = text.match(SECTION_PATTERNS.contact.email)
  if (emailMatch) contact.email = emailMatch[0]

  // Extract phone
  const phoneMatch = text.match(SECTION_PATTERNS.contact.phone)
  if (phoneMatch) contact.phone = phoneMatch[0]

  // Extract LinkedIn
  const linkedinMatch = text.match(SECTION_PATTERNS.contact.linkedin)
  if (linkedinMatch) contact.linkedin = `https://${linkedinMatch[0]}`

  // Extract GitHub
  const githubMatch = text.match(SECTION_PATTERNS.contact.github)
  if (githubMatch) contact.github = `https://${githubMatch[0]}`

  // Extract name (heuristic: first non-empty line, usually all caps or title case)
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0)
  if (lines.length > 0) {
    const potentialName = lines[0]
    if (potentialName.length < 50 && !potentialName.includes('@')) {
      contact.name = potentialName
    }
  }

  return contact
}
```

### 2.3 Enhanced Resume Processor

**File:** `lib/parsers/enhanced-resume-parser.ts`

```typescript
import { ResumeData, ResumeDataSchema } from '../schemas/resume-schema'
import { detectSectionType, extractContactInfo } from './section-detector'
import { parsePDF, parseDOCX, parseTXT } from '../resume-processor'

export async function parseResumeEnhanced(
  filePath: string,
  fileType: string
): Promise<Partial<ResumeData>> {
  // Extract raw text
  const rawText = await parseResume(filePath, fileType)

  // Split into lines
  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0)

  // Extract contact information
  const contact = extractContactInfo(rawText)

  // Initialize sections
  const resume: Partial<ResumeData> = {
    contact: contact as any,
    experience: [],
    education: [],
    skills: {
      languages: [],
      frameworks: [],
      tools: [],
    },
    projects: [],
  }

  let currentSection: string | null = null
  let sectionBuffer: string[] = []

  for (const line of lines) {
    const detectedSection = detectSectionType(line)

    if (detectedSection) {
      // Process previous section
      if (currentSection && sectionBuffer.length > 0) {
        processSection(resume, currentSection, sectionBuffer)
      }

      currentSection = detectedSection
      sectionBuffer = []
    } else if (currentSection) {
      sectionBuffer.push(line)
    }
  }

  // Process final section
  if (currentSection && sectionBuffer.length > 0) {
    processSection(resume, currentSection, sectionBuffer)
  }

  return resume
}

function processSection(
  resume: Partial<ResumeData>,
  sectionName: string,
  lines: string[]
) {
  switch (sectionName) {
    case 'experience':
      // Parse experience entries (detect company, title, dates, bullets)
      resume.experience = parseExperienceSection(lines)
      break

    case 'education':
      resume.education = parseEducationSection(lines)
      break

    case 'skills':
      // Extract skills (comma-separated or bullet points)
      const skillsList = extractSkillsList(lines)
      resume.skills = categorizeSkills(skillsList)
      break

    case 'projects':
      resume.projects = parseProjectsSection(lines)
      break
  }
}

// Helper functions for parsing specific sections
function parseExperienceSection(lines: string[]): Experience[] {
  // TODO: Implement experience parsing logic
  // Look for patterns like: Company Name, Job Title, Date Range
  return []
}

function parseEducationSection(lines: string[]): Education[] {
  // TODO: Implement education parsing logic
  return []
}

function extractSkillsList(lines: string[]): string[] {
  // Extract skills from comma-separated lists or bullet points
  return lines.flatMap(line =>
    line.split(/[,;•·]/).map(s => s.trim()).filter(s => s.length > 0)
  )
}

function categorizeSkills(skills: string[]): Skills {
  // Basic categorization - will be enhanced by Gemini API
  return {
    languages: skills.filter(s => isProgLanguage(s)),
    frameworks: skills.filter(s => isFramework(s)),
    tools: skills.filter(s => isTool(s)),
  }
}
```

---

## 🤖 Phase 3: Gemini API Integration (Days 6-8)

### 3.1 Gemini Service Setup

**File:** `lib/ai/gemini-service.ts`

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)

export class GeminiService {
  private model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2048,
    }
  })

  async enhanceBulletPoint(
    bullet: string,
    jobTitle: string,
    company: string
  ): Promise<string> {
    const prompt = `You are an expert resume writer specializing in ATS optimization.

Task: Rewrite this experience bullet point following these strict rules:
1. Start with a strong action verb (past tense for previous roles)
2. Include specific metrics, numbers, or percentages if possible
3. Highlight tangible impact or business results
4. Use industry-standard terminology
5. Keep under 150 characters
6. Make it achievement-focused, not task-focused

Job Context: ${jobTitle} at ${company}
Original Bullet: ${bullet}

Return ONLY the rewritten bullet point, no explanations.`

    const result = await this.model.generateContent(prompt)
    return result.response.text().trim()
  }

  async enhanceAllBullets(
    experience: Experience[]
  ): Promise<Experience[]> {
    const enhanced = []

    for (const exp of experience) {
      const enhancedBullets = []

      for (const bullet of exp.bullets) {
        try {
          const enhanced = await this.enhanceBulletPoint(
            bullet,
            exp.title,
            exp.company
          )
          enhancedBullets.push(enhanced)

          // Rate limiting delay
          await new Promise(resolve => setTimeout(resolve, 1000))
        } catch (error) {
          console.error('Enhancement failed, using original:', error)
          enhancedBullets.push(bullet)
        }
      }

      enhanced.push({
        ...exp,
        bullets: enhancedBullets,
        isEnhanced: true,
      })
    }

    return enhanced
  }

  async extractAndCategorizeSkills(resumeText: string): Promise<Skills> {
    const prompt = `Extract and categorize all technical skills from this resume text.

Rules:
1. Separate into: Programming Languages, Frameworks/Libraries, Tools/Platforms, Databases
2. Use standard naming conventions (e.g., "JavaScript" not "java script")
3. Remove duplicates
4. Infer related skills (e.g., if Redux mentioned → include React)
5. Return JSON with categorized arrays

Resume Text:
${resumeText}

Output format (JSON only, no markdown):
{
  "languages": ["Python", "JavaScript"],
  "frameworks": ["React", "Django"],
  "tools": ["Docker", "Git"],
  "databases": ["PostgreSQL"]
}`

    const result = await this.model.generateContent(prompt)
    const text = result.response.text()

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    throw new Error('Failed to parse skills from AI response')
  }
}

export const geminiService = new GeminiService()
```

### 3.2 Update Resume Processor

**File:** `lib/resume-processor.ts` (update)

```typescript
import { geminiService } from './ai/gemini-service'

export async function enhanceWithAI(resumeData: Partial<ResumeData>): Promise<Partial<ResumeData>> {
  try {
    // Enhance experience bullets
    if (resumeData.experience && resumeData.experience.length > 0) {
      resumeData.experience = await geminiService.enhanceAllBullets(resumeData.experience)
    }

    // Extract and categorize skills
    if (resumeData.text) {
      resumeData.skills = await geminiService.extractAndCategorizeSkills(resumeData.text)
    }

    return resumeData
  } catch (error) {
    console.error('AI enhancement failed:', error)
    // Return original data if AI fails
    return resumeData
  }
}
```

---

## 🎨 Phase 4: HTML Template Creation (Days 9-11)

### 4.1 Jake's Resume HTML Template

**File:** `lib/templates/jakes-resume.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{contact.name}} - Resume</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Computer Modern', 'Latin Modern', serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #000;
      background: #fff;
      max-width: 8.5in;
      margin: 0 auto;
      padding: 0.5in 0.5in;
    }

    /* Header */
    .header {
      text-align: center;
      margin-bottom: 20px;
      border-bottom: 1px solid #000;
      padding-bottom: 10px;
    }

    .header h1 {
      font-size: 24pt;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .contact-info {
      font-size: 10pt;
      line-height: 1.3;
    }

    .contact-info a {
      color: #000;
      text-decoration: none;
    }

    /* Sections */
    .section {
      margin-bottom: 18px;
    }

    .section-title {
      font-size: 12pt;
      font-weight: bold;
      text-transform: uppercase;
      border-bottom: 1px solid #000;
      margin-bottom: 8px;
      padding-bottom: 2px;
    }

    /* Experience Items */
    .experience-item,
    .education-item,
    .project-item {
      margin-bottom: 12px;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2px;
    }

    .item-title {
      font-weight: bold;
    }

    .item-date {
      font-style: italic;
    }

    .item-subtitle {
      display: flex;
      justify-content: space-between;
      font-style: italic;
      margin-bottom: 4px;
    }

    /* Bullet Points */
    .bullets {
      padding-left: 20px;
      margin-top: 4px;
    }

    .bullets li {
      margin-bottom: 2px;
      line-height: 1.3;
    }

    /* Skills */
    .skills-grid {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 8px 12px;
    }

    .skill-category {
      font-weight: bold;
      white-space: nowrap;
    }

    .skill-list {
      text-align: left;
    }

    /* Print Optimization */
    @media print {
      body {
        margin: 0;
        padding: 0.5in 0.5in;
      }

      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <h1>{{contact.name}}</h1>
    <div class="contact-info">
      {{#if contact.phone}}{{contact.phone}} · {{/if}}
      {{#if contact.email}}<a href="mailto:{{contact.email}}">{{contact.email}}</a> · {{/if}}
      {{#if contact.linkedin}}<a href="{{contact.linkedin}}">LinkedIn</a> · {{/if}}
      {{#if contact.github}}<a href="{{contact.github}}">GitHub</a>{{/if}}
      {{#if contact.location}}<br>{{contact.location}}{{/if}}
    </div>
  </div>

  <!-- Experience Section -->
  {{#if experience}}
  <div class="section">
    <div class="section-title">Experience</div>
    {{#each experience}}
    <div class="experience-item">
      <div class="item-header">
        <span class="item-title">{{title}}</span>
        <span class="item-date">{{startDate}} – {{endDate}}</span>
      </div>
      <div class="item-subtitle">
        <span>{{company}}</span>
        {{#if location}}<span>{{location}}</span>{{/if}}
      </div>
      <ul class="bullets">
        {{#each bullets}}
        <li>{{this}}</li>
        {{/each}}
      </ul>
    </div>
    {{/each}}
  </div>
  {{/if}}

  <!-- Education Section -->
  {{#if education}}
  <div class="section">
    <div class="section-title">Education</div>
    {{#each education}}
    <div class="education-item">
      <div class="item-header">
        <span class="item-title">{{institution}}</span>
        <span class="item-date">{{graduationDate}}</span>
      </div>
      <div class="item-subtitle">
        <span>{{degree}}{{#if field}} in {{field}}{{/if}}</span>
        {{#if gpa}}<span>GPA: {{gpa}}</span>{{/if}}
      </div>
      {{#if honors}}
      <ul class="bullets">
        {{#each honors}}
        <li>{{this}}</li>
        {{/each}}
      </ul>
      {{/if}}
    </div>
    {{/each}}
  </div>
  {{/if}}

  <!-- Projects Section -->
  {{#if projects}}
  <div class="section">
    <div class="section-title">Projects</div>
    {{#each projects}}
    <div class="project-item">
      <div class="item-header">
        <span class="item-title">{{name}}{{#if link}} (<a href="{{link}}">{{link}}</a>){{/if}}</span>
      </div>
      <div class="item-subtitle">
        <span>{{technologies}}</span>
      </div>
      <ul class="bullets">
        {{#each bullets}}
        <li>{{this}}</li>
        {{/each}}
      </ul>
    </div>
    {{/each}}
  </div>
  {{/if}}

  <!-- Technical Skills Section -->
  {{#if skills}}
  <div class="section">
    <div class="section-title">Technical Skills</div>
    <div class="skills-grid">
      {{#if skills.languages}}
      <div class="skill-category">Languages:</div>
      <div class="skill-list">{{join skills.languages ", "}}</div>
      {{/if}}

      {{#if skills.frameworks}}
      <div class="skill-category">Frameworks:</div>
      <div class="skill-list">{{join skills.frameworks ", "}}</div>
      {{/if}}

      {{#if skills.tools}}
      <div class="skill-category">Tools:</div>
      <div class="skill-list">{{join skills.tools ", "}}</div>
      {{/if}}

      {{#if skills.databases}}
      <div class="skill-category">Databases:</div>
      <div class="skill-list">{{join skills.databases ", "}}</div>
      {{/if}}
    </div>
  </div>
  {{/if}}
</body>
</html>
```

### 4.2 HTML Template Engine

**File:** `lib/templates/template-engine.ts`

```typescript
import Handlebars from 'handlebars'
import fs from 'fs-extra'
import path from 'path'
import { ResumeData } from '../schemas/resume-schema'

// Register custom helpers
Handlebars.registerHelper('join', function(array: string[], separator: string) {
  return array.join(separator)
})

export class TemplateEngine {
  private templateCache: Map<string, HandlebarsTemplateDelegate> = new Map()

  async loadTemplate(templateName: string): Promise<HandlebarsTemplateDelegate> {
    if (this.templateCache.has(templateName)) {
      return this.templateCache.get(templateName)!
    }

    const templatePath = path.join(process.cwd(), 'lib', 'templates', `${templateName}.html`)
    const templateContent = await fs.readFile(templatePath, 'utf-8')
    const compiled = Handlebars.compile(templateContent)

    this.templateCache.set(templateName, compiled)
    return compiled
  }

  async renderResume(resumeData: ResumeData): Promise<string> {
    const template = await this.loadTemplate('jakes-resume')

    // Sanitize data for HTML (prevent XSS)
    const sanitized = this.sanitizeData(resumeData)

    return template(sanitized)
  }

  private sanitizeData(data: any): any {
    if (typeof data === 'string') {
      return this.escapeHtml(data)
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item))
    }

    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {}
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeData(value)
      }
      return sanitized
    }

    return data
  }

  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    }

    return text.replace(/[&<>"'/]/g, char => map[char])
  }
}

export const templateEngine = new TemplateEngine()
```

---

## 🖨️ Phase 5: Puppeteer PDF Generation (Days 12-14)

### 5.1 PDF Generator Service

**File:** `lib/pdf/puppeteer-generator.ts`

```typescript
import puppeteer from 'puppeteer'
import { ResumeData } from '../schemas/resume-schema'
import { templateEngine } from '../templates/template-engine'

export class PuppeteerPDFGenerator {
  async generatePDF(resumeData: ResumeData): Promise<Buffer> {
    let browser

    try {
      // Launch headless browser
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
        ],
      })

      const page = await browser.newPage()

      // Render HTML from template
      const html = await templateEngine.renderResume(resumeData)

      // Set content
      await page.setContent(html, {
        waitUntil: 'networkidle0',
      })

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'Letter', // 8.5 x 11 inches (US standard)
        printBackground: true,
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in',
        },
        preferCSSPageSize: false,
      })

      return Buffer.from(pdfBuffer)
    } catch (error) {
      console.error('PDF generation failed:', error)
      throw new Error(`Failed to generate PDF: ${error}`)
    } finally {
      if (browser) {
        await browser.close()
      }
    }
  }
}

export const pdfGenerator = new PuppeteerPDFGenerator()
```

### 5.2 Update Resume Processor

**File:** `lib/resume-processor.ts` (replace generatePDF function)

```typescript
import { pdfGenerator } from './pdf/puppeteer-generator'

export async function generatePDF(
  resumeData: Partial<ResumeData>,
  originalFilename: string
): Promise<Buffer> {
  // Validate data against schema
  const validated = ResumeDataSchema.parse(resumeData)

  // Generate PDF using Puppeteer
  return await pdfGenerator.generatePDF(validated)
}
```

---

## 🧪 Phase 6: Testing & Validation (Days 15-17)

### 6.1 Test Cases

Create test files in `__tests__/` directory:

```
__tests__/
├── parsers/
│   ├── pdf-parser.test.ts
│   ├── docx-parser.test.ts
│   └── section-detector.test.ts
├── ai/
│   └── gemini-service.test.ts
├── templates/
│   └── template-engine.test.ts
└── pdf/
    └── puppeteer-generator.test.ts
```

### 6.2 Sample Test Resumes

Prepare diverse test cases:
1. Well-formatted PDF resume
2. Messy/poorly formatted PDF
3. DOCX with tables and formatting
4. Plain text resume
5. Resume with missing sections
6. International resume (non-US format)

---

## 🚀 Phase 7: Deployment (Days 18-20)

### 7.1 Render Configuration

Update `render.yaml`:

```yaml
services:
  - type: web
    name: kairos-cv
    env: node
    region: oregon
    plan: free
    buildCommand: pnpm install --no-frozen-lockfile && pnpm build
    startCommand: pnpm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: GOOGLE_GEMINI_API_KEY
        sync: false
      - key: PUPPETEER_SKIP_CHROMIUM_DOWNLOAD
        value: false
      - key: PUPPETEER_EXECUTABLE_PATH
        value: /usr/bin/chromium-browser
```

### 7.2 Dockerfile for Puppeteer (if needed)

```dockerfile
FROM node:18-slim

# Install Chromium dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Set Puppeteer to use installed Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app
COPY package*.json ./
RUN pnpm install
COPY . .
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start"]
```

---

## 📊 Success Metrics

### Performance Targets
- File upload: < 2 seconds
- Parsing: < 5 seconds
- AI enhancement: < 30 seconds (depends on content length)
- PDF generation: < 10 seconds
- **Total processing time: < 60 seconds**

### Quality Targets
- ATS score: > 85% on ATS checkers
- Format consistency: 100% (all resumes use same template)
- Error rate: < 5% (graceful degradation on errors)
- User satisfaction: Clear progress updates, helpful error messages

---

## 🔐 Security Considerations

1. **File Upload Security**
   - Validate magic numbers (not just extensions)
   - Scan for malicious content
   - Limit file size (5MB max)
   - Sanitize filenames

2. **XSS Prevention**
   - Escape all user-provided content in HTML
   - Use Content Security Policy headers
   - Sanitize URLs

3. **API Security**
   - Rate limit Gemini API calls
   - Store API keys in environment variables
   - Implement request timeouts

4. **File Storage**
   - Auto-delete uploaded files after 1 hour
   - Use temporary directories with proper permissions
   - No persistent storage of user data

---

## 📈 Future Enhancements

1. **Multiple Template Options**
   - Modern template
   - Creative template
   - Academic CV template

2. **Job Description Matching**
   - Keyword optimization for specific jobs
   - ATS compatibility scoring
   - Tailored bullet points

3. **User Accounts**
   - Save resume history
   - Version control
   - Side-by-side comparison

4. **Advanced AI Features**
   - Cover letter generation
   - Interview preparation tips
   - Career advice

---

## 📝 Implementation Checklist

### Week 1: Foundation
- [ ] Install dependencies (Puppeteer, Handlebars, Zod, Gemini)
- [ ] Set up environment variables
- [ ] Create resume data schemas with Zod
- [ ] Implement enhanced section detection
- [ ] Test with sample resumes

### Week 2: AI Integration
- [ ] Set up Gemini API service
- [ ] Implement bullet point enhancement
- [ ] Implement skills extraction
- [ ] Add rate limiting and error handling
- [ ] Test AI enhancements with real data

### Week 3: PDF Generation
- [ ] Create HTML template (Jake's Resume style)
- [ ] Build template engine with Handlebars
- [ ] Implement Puppeteer PDF generation
- [ ] Add XSS prevention and sanitization
- [ ] Test PDF output quality

### Week 4: Testing & Deployment
- [ ] Write comprehensive test suite
- [ ] Test with diverse resume formats
- [ ] Optimize performance (caching, batching)
- [ ] Update deployment configuration
- [ ] Deploy to Render and test end-to-end

---

## 🎯 Key Differences: HTML vs LaTeX

| Aspect | LaTeX (Original Plan) | HTML-to-PDF (Current) |
|--------|----------------------|----------------------|
| **Complexity** | High (LaTeX syntax) | Low (HTML/CSS) |
| **Dependencies** | Tectonic compiler | Puppeteer browser |
| **Template Editing** | Requires LaTeX knowledge | Standard HTML/CSS |
| **Debugging** | Difficult (compiler errors) | Easy (browser dev tools) |
| **Styling** | Limited CSS support | Full CSS3 support |
| **Fonts** | LaTeX fonts only | Web fonts + system fonts |
| **Iteration Speed** | Slow (recompile each time) | Fast (instant preview) |
| **ATS Compatibility** | Excellent | Excellent |
| **File Size** | Smaller | Slightly larger |

**Verdict:** HTML-to-PDF is more maintainable, easier to debug, and faster to iterate on for MVP development.

---

## 🛠️ Troubleshooting Guide

### Issue: Puppeteer fails to launch on Render
**Solution:** Install Chromium dependencies in deployment config

### Issue: Gemini API rate limits
**Solution:** Implement exponential backoff, add delay between requests

### Issue: PDF generation takes too long
**Solution:** Cache template compilation, optimize HTML, reduce image sizes

### Issue: Resume parsing misses sections
**Solution:** Add more regex patterns, implement fuzzy matching

### Issue: XSS vulnerabilities in PDF
**Solution:** Sanitize all user input, use Handlebars auto-escaping

---

## 📞 Support & Resources

- **Puppeteer Docs:** https://pptr.dev/
- **Gemini API:** https://ai.google.dev/docs
- **Jake's Resume:** https://github.com/jakegut/resume
- **Handlebars:** https://handlebarsjs.com/
- **Render Deployment:** https://render.com/docs

---

**Document Version:** 1.0
**Last Updated:** November 2025
**Branch:** bharath-013
**Status:** Ready for Implementation
