import { GoogleGenerativeAI } from "@google/generative-ai"
import { getGeminiApiKey, getGeminiTextModel, hasGeminiApiKey } from "../config/env"
import { parseModelJson } from "./json-utils"

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(getGeminiApiKey())

const model = genAI.getGenerativeModel({
  model: getGeminiTextModel(),
  generationConfig: {
    temperature: 0.3,
    maxOutputTokens: 2048,
  },
})

const extractionModel = genAI.getGenerativeModel({
  model: getGeminiTextModel(),
  generationConfig: {
    temperature: 0.2,
    maxOutputTokens: 8192,
  },
})

export interface SkillsCategories {
  languages: string[]
  frameworks: string[]
  tools: string[]
  databases: string[]
}

export interface EnhancedBulletPoint {
  original: string
  enhanced: string
}

/**
 * Retry logic with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 4,
  initialDelay = 1000
): Promise<T> {
  let lastError: Error | undefined

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Retry transient model errors such as rate limits and temporary overload.
      const errorMessage = lastError.message || ""
      const isTransientError =
        errorMessage.includes("429") ||
        errorMessage.includes("503") ||
        errorMessage.includes("overloaded")

      if (!isTransientError) {
        throw lastError
      }

      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i)
        console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError || new Error("Max retries exceeded")
}

/**
 * Enhance a single bullet point using Gemini AI
 */
export async function enhanceBulletPoint(
  bulletPoint: string,
  jobTitle: string,
  company: string
): Promise<string> {
  if (!hasGeminiApiKey()) {
    console.warn("GEMINI_API_KEY not set. Returning original bullet point.")
    return bulletPoint
  }

  const prompt = `You are an expert resume writer specializing in ATS optimization.

Task: Rewrite this experience bullet point following these strict rules:
1. Start with a strong action verb (past tense for previous roles)
2. Include specific metrics, numbers, or percentages
3. Highlight tangible impact or business results
4. Use industry-standard terminology
5. Keep under 150 characters
6. Make it achievement-focused, not task-focused

Job Context: ${jobTitle} at ${company}
Original Bullet: ${bulletPoint}

Return ONLY the rewritten bullet point, no explanations.`

  try {
    const result = await retryWithBackoff(async () => {
      const response = await model.generateContent(prompt)
      return response.response.text().trim()
    })

    return result
  } catch (error) {
    console.error("Error enhancing bullet point:", error)
    return bulletPoint // Return original on error
  }
}

/**
 * Enhance multiple bullet points for a job
 */
export async function enhanceBulletPoints(
  bullets: string[],
  jobTitle: string,
  company: string
): Promise<EnhancedBulletPoint[]> {
  if (!hasGeminiApiKey() || bullets.length === 0) {
    return bullets.map((bullet) => ({ original: bullet, enhanced: bullet }))
  }

  const prompt = `You are an expert resume writer specializing in ATS optimization.

Rewrite every bullet using these strict rules:
1. Start with a strong action verb.
2. Include specific metrics when possible.
3. Focus on measurable impact.
4. Keep each bullet concise (under 150 characters when possible).
5. Preserve the original meaning.

Job Context: ${jobTitle} at ${company}
Original Bullets (JSON array):
${JSON.stringify(bullets)}

Return ONLY valid JSON in this format:
{
  "bullets": ["enhanced bullet 1", "enhanced bullet 2"]
}`

  try {
    const enhancedBullets = await retryWithBackoff(async () => {
      const response = await model.generateContent(prompt)
      const parsed = parseModelJson<{ bullets?: string[] }>(response.response.text().trim())

      if (!parsed?.bullets || !Array.isArray(parsed.bullets)) {
        throw new Error("Invalid bullet enhancement payload")
      }

      return parsed.bullets
    })

    return bullets.map((original, index) => ({
      original,
      enhanced: enhancedBullets[index]?.trim() || original,
    }))
  } catch (error) {
    console.warn("Batch bullet enhancement failed, using original bullets:", error)
    return bullets.map((bullet) => ({ original: bullet, enhanced: bullet }))
  }
}

/**
 * Extract and categorize skills from resume text using Gemini AI
 */
export async function extractSkills(resumeText: string): Promise<SkillsCategories> {
  if (!hasGeminiApiKey()) {
    console.warn("GEMINI_API_KEY not set. Returning empty skills.")
    return {
      languages: [],
      frameworks: [],
      tools: [],
      databases: [],
    }
  }

  const prompt = `Extract and categorize all technical skills from this resume text.

Rules:
1. Separate into: Programming Languages, Frameworks/Libraries, Tools/Platforms, Databases
2. Use standard naming conventions (e.g., "JavaScript" not "java script")
3. Remove duplicates
4. Infer related skills (e.g., Redux mentioned → include React)
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

  try {
    const result = await retryWithBackoff(async () => {
      const response = await model.generateContent(prompt)
      const parsed = parseModelJson<Partial<SkillsCategories>>(response.response.text().trim())
      if (!parsed) {
        throw new Error("Invalid skills JSON from model")
      }
      return parsed
    })

    return {
      languages: result.languages || [],
      frameworks: result.frameworks || [],
      tools: result.tools || [],
      databases: result.databases || [],
    }
  } catch (error) {
    console.warn("Could not extract skills with Gemini. Falling back to empty categories.", error)
    return {
      languages: [],
      frameworks: [],
      tools: [],
      databases: [],
    }
  }
}

/**
 * Enhance an entire resume section with AI
 */
export async function enhanceSection(
  sectionContent: string[],
  sectionType: "experience" | "education" | "projects"
): Promise<string[]> {
  if (!hasGeminiApiKey()) {
    console.warn("GEMINI_API_KEY not set. Returning original content.")
    return sectionContent
  }

  const prompt = `You are an expert resume writer. Enhance this ${sectionType} section for ATS optimization.

Rules:
1. Use strong action verbs
2. Add metrics and specific achievements where possible
3. Keep professional and concise
4. Return enhanced version maintaining original structure
5. Each line on a new line

Original content:
${sectionContent.join("\n")}

Return ONLY the enhanced content, one item per line.`

  try {
    const result = await retryWithBackoff(async () => {
      const response = await model.generateContent(prompt)
      const text = response.response.text().trim()
      return text.split("\n").filter((line) => line.trim().length > 0)
    })

    return result
  } catch (error) {
    console.warn(`Could not enhance ${sectionType} section. Using original content.`, error)
    return sectionContent // Return original on error
  }
}

/**
 * Generate professional summary from resume data
 */
export async function generateSummary(resumeText: string): Promise<string> {
  if (!hasGeminiApiKey()) {
    console.warn("GEMINI_API_KEY not set. Returning default summary.")
    return "Experienced professional with a proven track record of success."
  }

  const prompt = `Based on this resume, write a compelling 2-3 sentence professional summary that:
1. Highlights key strengths and expertise
2. Includes years of experience (if mentioned)
3. Mentions most relevant technical skills
4. Focuses on value and impact

Resume:
${resumeText}

Return ONLY the professional summary, no additional text.`

  try {
    const result = await retryWithBackoff(async () => {
      const response = await model.generateContent(prompt)
      return response.response.text().trim()
    })

    return result
  } catch (error) {
    console.warn("Could not generate summary with Gemini. Using default summary.", error)
    return "Experienced professional with a proven track record of success."
  }
}

/**
 * Extract complete structured resume data using Gemini AI
 * This is the primary extraction method - Gemini does all the heavy lifting
 */
export async function extractCompleteResumeData(resumeText: string): Promise<any> {
  if (!hasGeminiApiKey()) {
    console.warn("GEMINI_API_KEY not set. Cannot extract resume data.")
    return null
  }

  const prompt = `You are an expert resume parser. Extract EVERY piece of information from this resume into structured JSON.

🚨 ZERO DATA LOSS RULE: Do NOT skip ANY content. If you see a section you don't recognize, add it to "customSections".

EXTRACTION REQUIREMENTS:

1. CONTACT INFORMATION (always required):
   - Full name (usually at the top)
   - Email, phone, LinkedIn, GitHub, website, location

2. WORK EXPERIENCE (extract if present):
   - Job title, company name, location
   - Start/end dates (format: "Month Year" or "Present")
   - ALL bullet points describing responsibilities/achievements

3. EDUCATION (extract if present):
   - Institution, degree, field of study
   - Start/end dates, GPA, location
   - Honors (Dean's List, Cum Laude, etc.)
   - Relevant coursework (if listed)

4. TECHNICAL SKILLS (categorize properly):
   - languages: Programming languages (Python, JavaScript, Java, C++, etc.)
   - frameworks: Libraries/Frameworks (React, Django, TensorFlow, etc.)
   - tools: Tools/Platforms (Docker, AWS, Git, Kubernetes, etc.)
   - databases: Databases (PostgreSQL, MongoDB, Redis, etc.)

5. PROJECTS (extract if present):
   - Name, description, technologies used
   - Bullet points, GitHub links, live demo links

6. CERTIFICATIONS (extract if present):
   - Name, issuer, date, expiration, credential ID/URL

7. AWARDS & HONORS (extract if present):
   - Award name, issuing organization, date, description
   - Examples: "Dean's List", "Employee of the Month", "Hackathon Winner"

8. PUBLICATIONS (extract if present):
   - Title, authors, venue (conference/journal), date, URL
   - Examples: Research papers, blog posts, articles

9. LANGUAGES (spoken languages, NOT programming):
   - Language name, proficiency level (Native, Fluent, Professional, Basic)
   - Certifications (TOEFL, IELTS, etc.)

10. VOLUNTEER WORK (extract if present):
    - Organization, role, location, dates
    - Bullet points describing contributions

11. HOBBIES/INTERESTS (extract if present):
    - List of hobbies, interests, extracurricular activities

12. REFERENCES (extract if present):
    - Usually just "References available upon request"
    - Or specific referee names/contacts

13. CUSTOM SECTIONS (catch-all for unrecognized content):
    - If you see ANY section not listed above (e.g., "Leadership", "Research", "Patents", "Speaking Engagements"),
      add it to customSections with the exact heading and all content

OUTPUT FORMAT (JSON only):
{
  "contact": {
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "+1234567890",
    "linkedin": "linkedin.com/in/username",
    "github": "github.com/username",
    "website": "https://example.com",
    "location": "City, State"
  },
  "summary": "Professional summary or objective (if present)",
  "experience": [
    {
      "title": "Software Engineer",
      "company": "Company Name",
      "location": "City, State",
      "startDate": "Jan 2020",
      "endDate": "Dec 2022",
      "bullets": ["Achievement 1", "Achievement 2"]
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "location": "City, State",
      "startDate": "Aug 2016",
      "endDate": "May 2020",
      "gpa": "3.8",
      "honors": ["Dean's List"],
      "relevantCoursework": ["Data Structures", "Algorithms"]
    }
  ],
  "skills": {
    "languages": ["Python", "JavaScript"],
    "frameworks": ["React", "Django"],
    "tools": ["Docker", "Git"],
    "databases": ["PostgreSQL"]
  },
  "projects": [
    {
      "name": "Project Name",
      "description": "Brief description",
      "technologies": ["React", "Node.js"],
      "bullets": ["Built X", "Implemented Y"],
      "github": "https://github.com/user/repo"
    }
  ],
  "certifications": [
    {
      "name": "AWS Certified Developer",
      "issuer": "Amazon",
      "date": "Jan 2023",
      "credentialId": "ABC123"
    }
  ],
  "awards": [
    {
      "name": "Dean's List",
      "issuer": "University Name",
      "date": "Spring 2019",
      "description": "Awarded for academic excellence"
    }
  ],
  "publications": [
    {
      "title": "Paper Title",
      "authors": ["Author 1", "Author 2"],
      "venue": "Conference Name",
      "date": "Jun 2022",
      "url": "https://example.com/paper"
    }
  ],
  "languageProficiency": [
    {
      "language": "Spanish",
      "proficiency": "Fluent",
      "certification": "DELE C1"
    }
  ],
  "volunteer": [
    {
      "organization": "Nonprofit Name",
      "role": "Volunteer Role",
      "location": "City, State",
      "startDate": "Jan 2021",
      "endDate": "Dec 2021",
      "bullets": ["Helped with X", "Organized Y"]
    }
  ],
  "hobbies": [
    {
      "name": "Photography"
    },
    {
      "name": "Hiking"
    }
  ],
  "references": ["Available upon request"],
  "customSections": [
    {
      "heading": "Leadership Experience",
      "content": ["Led team of 5", "Organized events"]
    }
  ]
}

RESUME TEXT:
${resumeText}

CRITICAL: Return ONLY valid JSON. No markdown, no code blocks, no explanations. Extract EVERYTHING you see.`

  try {
    const result = await retryWithBackoff(async () => {
      const response = await extractionModel.generateContent(prompt)
      const parsed = parseModelJson<any>(response.response.text().trim())
      if (!parsed) {
        throw new Error("Invalid resume JSON from model")
      }

      // Validate with Zod (dynamic import to avoid circular dependencies)
      const { validatePartialResumeData } = await import('../schemas/resume-schema')
      const validation = validatePartialResumeData(parsed)

      if (!validation.success) {
        console.warn('Gemini extraction validation warnings:', validation.errors)
        // Log but continue - AI might have extracted valid data in non-standard format
      }

      return validation.data || parsed
    })

    return result
  } catch (error) {
    console.warn("Could not parse structured Gemini output. Fallback parser will be used.", error)
    return null
  }
}

/**
 * Enhance extracted resume data with AI improvements
 */
export async function enhanceExtractedData(extractedData: any): Promise<any> {
  if (!hasGeminiApiKey() || !extractedData) {
    return extractedData
  }

  try {
    const MAX_BULLETS_TO_ENHANCE = 20
    let enhancedCount = 0

    // Enhance all experience bullet points
    if (extractedData.experience && Array.isArray(extractedData.experience)) {
      for (const exp of extractedData.experience) {
        if (exp.bullets && exp.bullets.length > 0) {
          const remaining = MAX_BULLETS_TO_ENHANCE - enhancedCount
          if (remaining <= 0) {
            break
          }

          const bulletsToEnhance = exp.bullets.slice(0, remaining)
          const enhanced = await enhanceBulletPoints(bulletsToEnhance, exp.title, exp.company)

          exp.bullets = [
            ...enhanced.map((item) => item.enhanced),
            ...exp.bullets.slice(bulletsToEnhance.length),
          ]
          enhancedCount += bulletsToEnhance.length
        }
      }
    }

    // Generate professional summary
    const summaryPayload = {
      contact: extractedData.contact,
      experience: extractedData.experience,
      education: extractedData.education,
      skills: extractedData.skills,
      projects: extractedData.projects,
    }
    const summaryText = JSON.stringify(summaryPayload).slice(0, 12000)
    const summary = await generateSummary(summaryText)

    return {
      ...extractedData,
      summary
    }
  } catch (error) {
    console.warn("Could not apply Gemini enhancement. Using extracted data as-is.", error)
    return extractedData
  }
}

/**
 * Check if Gemini API is configured
 */
export function isGeminiConfigured(): boolean {
  return hasGeminiApiKey()
}
