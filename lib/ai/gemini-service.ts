import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.3,
    maxOutputTokens: 2048,
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
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError: Error | undefined

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Check if it's a 503 Service Unavailable error
      const errorMessage = lastError.message || ""
      const is503Error = errorMessage.includes("503") || errorMessage.includes("overloaded")

      // For 503 errors, only retry once to fail fast
      if (is503Error && i >= 1) {
        console.warn("Gemini API is overloaded, falling back to basic parser...")
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
  if (!process.env.GEMINI_API_KEY) {
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
  const results: EnhancedBulletPoint[] = []

  for (const bullet of bullets) {
    const enhanced = await enhanceBulletPoint(bullet, jobTitle, company)
    results.push({
      original: bullet,
      enhanced,
    })
  }

  return results
}

/**
 * Extract and categorize skills from resume text using Gemini AI
 */
export async function extractSkills(resumeText: string): Promise<SkillsCategories> {
  if (!process.env.GEMINI_API_KEY) {
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
      const text = response.response.text().trim()

      // Remove markdown code blocks if present
      const cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()

      return JSON.parse(cleanText)
    })

    return result
  } catch (error) {
    console.error("Error extracting skills:", error)
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
  if (!process.env.GEMINI_API_KEY) {
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
    console.error(`Error enhancing ${sectionType} section:`, error)
    return sectionContent // Return original on error
  }
}

/**
 * Generate professional summary from resume data
 */
export async function generateSummary(resumeText: string): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
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
    console.error("Error generating summary:", error)
    return "Experienced professional with a proven track record of success."
  }
}

/**
 * Extract complete structured resume data using Gemini AI
 * This is the primary extraction method - Gemini does all the heavy lifting
 */
export async function extractCompleteResumeData(resumeText: string): Promise<any> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY not set. Cannot extract resume data.")
    return null
  }

  const prompt = `You are an expert resume parser. Extract ALL information from this resume into structured JSON.

CRITICAL INSTRUCTIONS:
1. Extract the person's full name (usually at the top)
2. Extract ALL contact information (email, phone, LinkedIn, GitHub, location)
3. Extract ALL work experience entries with:
   - Job title
   - Company name
   - Start date and end date (format as "Month Year" or "Present")
   - Location (city, state/country)
   - Bullet points describing responsibilities and achievements
4. Extract ALL education entries with:
   - Institution name
   - Degree and field of study
   - Start date and end date
   - GPA (if mentioned)
   - Location
5. Extract ALL technical skills and categorize them into:
   - Programming Languages (Python, JavaScript, Java, etc.)
   - Frameworks/Libraries (React, Django, Node.js, etc.)
   - Tools/Platforms (Docker, AWS, Git, etc.)
   - Databases (PostgreSQL, MongoDB, etc.)
6. Extract ALL projects with:
   - Project name
   - Description
   - Technologies used
   - Bullet points describing what was built
7. Extract certifications (if any)

OUTPUT FORMAT (JSON only, no markdown):
{
  "contact": {
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "+1234567890",
    "linkedin": "linkedin.com/in/username",
    "github": "github.com/username",
    "location": "City, State"
  },
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "startDate": "Jan 2020",
      "endDate": "Dec 2022",
      "location": "City, State",
      "bullets": [
        "Achievement or responsibility 1",
        "Achievement or responsibility 2"
      ]
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "startDate": "Aug 2016",
      "endDate": "May 2020",
      "gpa": "3.8",
      "location": "City, State"
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
      "bullets": [
        "What was built",
        "Key features"
      ]
    }
  ],
  "certifications": ["Certification 1", "Certification 2"]
}

RESUME TEXT:
${resumeText}

Return ONLY valid JSON, no markdown code blocks, no explanations.`

  try {
    const result = await retryWithBackoff(async () => {
      const response = await model.generateContent(prompt)
      const text = response.response.text().trim()

      // Remove markdown code blocks if present
      const cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()

      return JSON.parse(cleanText)
    })

    return result
  } catch (error) {
    console.error("Error extracting complete resume data:", error)
    return null
  }
}

/**
 * Enhance extracted resume data with AI improvements
 */
export async function enhanceExtractedData(extractedData: any): Promise<any> {
  if (!process.env.GEMINI_API_KEY || !extractedData) {
    return extractedData
  }

  try {
    // Enhance all experience bullet points
    if (extractedData.experience && Array.isArray(extractedData.experience)) {
      for (const exp of extractedData.experience) {
        if (exp.bullets && exp.bullets.length > 0) {
          const enhanced = await enhanceBulletPoints(exp.bullets, exp.title, exp.company)
          exp.bullets = enhanced.map(e => e.enhanced)
        }
      }
    }

    // Generate professional summary
    const summaryText = JSON.stringify(extractedData)
    const summary = await generateSummary(summaryText)

    return {
      ...extractedData,
      summary
    }
  } catch (error) {
    console.error("Error enhancing extracted data:", error)
    return extractedData
  }
}

/**
 * Check if Gemini API is configured
 */
export function isGeminiConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== ""
}
