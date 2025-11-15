/**
 * LLM-Based Field Classification and Validation
 *
 * Uses Gemini to intelligently classify extracted text into correct fields:
 * - Name vs Job Title
 * - Company vs Institution
 * - Work Experience vs Projects vs Volunteer Work
 * - Skills categorization (languages vs frameworks vs tools)
 * - Date validation and normalization
 */

import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.1, // Lower temperature for more consistent classification
    maxOutputTokens: 1024,
  },
})

export interface ClassificationResult {
  field: string
  confidence: number
  reasoning?: string
}

/**
 * Classify a piece of text into the correct resume field
 */
export async function classifyField(
  text: string,
  context?: { section?: string; previousFields?: string[] }
): Promise<ClassificationResult> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY not set. Using fallback classification.")
    return {
      field: "unknown",
      confidence: 0.5,
      reasoning: "API key not configured",
    }
  }

  const prompt = `You are an expert resume parser. Classify this text into the correct resume field.

TEXT: "${text}"
${context?.section ? `SECTION CONTEXT: ${context.section}` : ""}
${context?.previousFields ? `PREVIOUSLY EXTRACTED: ${context.previousFields.join(", ")}` : ""}

POSSIBLE FIELDS:
- name: Person's full name (usually 2-4 words, appears at top)
- email: Email address
- phone: Phone number
- location: City, State or Country
- linkedin: LinkedIn profile URL or username
- github: GitHub profile URL or username
- website: Personal website/portfolio URL
- job_title: Job role/position title
- company: Company/organization name
- institution: Educational institution
- degree: Academic degree (Bachelor's, Master's, etc.)
- skill: Technical skill (programming language, framework, tool, database)
- project_name: Name of a personal/professional project
- bullet_point: Description of work/project achievement
- date: Date or date range
- certification: Professional certification
- award: Award or honor
- publication: Research paper or article
- language_proficiency: Spoken language skill
- volunteer_role: Volunteer position
- hobby: Personal interest/hobby
- other: Anything else not fitting above categories

CLASSIFICATION RULES:
1. Names are typically 2-4 words, capitalized, no special characters
2. Job titles describe roles (e.g., "Software Engineer", "Senior Developer")
3. Companies are organization names (e.g., "Google", "Microsoft", "ABC Corp")
4. Institutions include "University", "College", "Institute", etc.
5. Skills are technical terms (React, Python, Docker, AWS, etc.)
6. Bullet points start with action verbs or describe achievements
7. Dates contain months (Jan, Feb, etc.) or years (2020, 2021, etc.)

Return ONLY a JSON object in this format:
{
  "field": "the_field_name",
  "confidence": 0.95,
  "reasoning": "Brief explanation"
}`

  try {
    const response = await model.generateContent(prompt)
    const text = response.response.text().trim()

    // Clean markdown code blocks
    const cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()

    const result = JSON.parse(cleanText)

    return {
      field: result.field || "unknown",
      confidence: result.confidence || 0.5,
      reasoning: result.reasoning,
    }
  } catch (error) {
    console.error("Error classifying field:", error)
    return {
      field: "unknown",
      confidence: 0.3,
      reasoning: "Classification failed",
    }
  }
}

/**
 * Validate that extracted data is in the correct field
 */
export async function validateFieldPlacement(
  fieldName: string,
  value: string | string[],
  expectedType: string
): Promise<{ isCorrect: boolean; suggestedField?: string; confidence: number }> {
  if (!process.env.GEMINI_API_KEY) {
    return { isCorrect: true, confidence: 0.5 }
  }

  const valueStr = Array.isArray(value) ? value.join(", ") : value

  const prompt = `You are validating resume data extraction.

FIELD: ${fieldName}
EXPECTED TYPE: ${expectedType}
VALUE: "${valueStr}"

QUESTION: Is this value correctly placed in the "${fieldName}" field for a ${expectedType}?

EXAMPLES OF CORRECT PLACEMENT:
- Field "name", Expected "person's full name", Value "John Smith" → CORRECT
- Field "name", Expected "person's full name", Value "Software Engineer" → INCORRECT (this is a job title)
- Field "company", Expected "company name", Value "Google" → CORRECT
- Field "company", Expected "company name", Value "Bachelor of Science" → INCORRECT (this is a degree)
- Field "title", Expected "job title", Value "Senior Developer" → CORRECT
- Field "title", Expected "job title", Value "John Doe" → INCORRECT (this is a name)

Return ONLY a JSON object:
{
  "isCorrect": true/false,
  "suggestedField": "correct_field_name" (only if isCorrect is false),
  "confidence": 0.95
}`

  try {
    const response = await model.generateContent(prompt)
    const text = response.response.text().trim()

    const cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()

    const result = JSON.parse(cleanText)

    return {
      isCorrect: result.isCorrect ?? true,
      suggestedField: result.suggestedField,
      confidence: result.confidence || 0.5,
    }
  } catch (error) {
    console.error("Error validating field placement:", error)
    return { isCorrect: true, confidence: 0.3 }
  }
}

/**
 * Categorize a skill into the correct category
 */
export async function categorizeSkill(
  skill: string
): Promise<"language" | "framework" | "tool" | "database" | "other"> {
  if (!process.env.GEMINI_API_KEY) {
    return "other"
  }

  const prompt = `Categorize this technical skill:

SKILL: "${skill}"

CATEGORIES:
- language: Programming languages (Python, JavaScript, Java, C++, Go, Rust, etc.)
- framework: Libraries/Frameworks (React, Django, Flask, Angular, Vue, TensorFlow, PyTorch, etc.)
- tool: Tools/Platforms (Docker, Kubernetes, Git, AWS, Azure, GCP, Jenkins, Linux, etc.)
- database: Databases (PostgreSQL, MongoDB, MySQL, Redis, Cassandra, etc.)
- other: Anything else

EXAMPLES:
- "Python" → language
- "React" → framework
- "Docker" → tool
- "PostgreSQL" → database
- "Machine Learning" → other (too broad)

Return ONLY the category name (language/framework/tool/database/other):`

  try {
    const response = await model.generateContent(prompt)
    const category = response.response.text().trim().toLowerCase()

    if (["language", "framework", "tool", "database", "other"].includes(category)) {
      return category as "language" | "framework" | "tool" | "database" | "other"
    }

    return "other"
  } catch (error) {
    console.error("Error categorizing skill:", error)
    return "other"
  }
}

/**
 * Batch categorize multiple skills efficiently
 */
export async function categorizeSkillsBatch(
  skills: string[]
): Promise<{
  languages: string[]
  frameworks: string[]
  tools: string[]
  databases: string[]
  other: string[]
}> {
  if (!process.env.GEMINI_API_KEY || skills.length === 0) {
    return { languages: [], frameworks: [], tools: [], databases: [], other: skills }
  }

  const prompt = `Categorize these technical skills into categories:

SKILLS: ${JSON.stringify(skills)}

CATEGORIES:
- languages: Programming languages (Python, JavaScript, Java, C++, Go, Rust, etc.)
- frameworks: Libraries/Frameworks (React, Django, Flask, Angular, Vue, TensorFlow, etc.)
- tools: Tools/Platforms (Docker, Kubernetes, Git, AWS, Azure, Jenkins, Linux, etc.)
- databases: Databases (PostgreSQL, MongoDB, MySQL, Redis, Cassandra, etc.)
- other: Soft skills or anything else

Return ONLY a JSON object:
{
  "languages": ["Python", "JavaScript"],
  "frameworks": ["React", "Django"],
  "tools": ["Docker", "Git"],
  "databases": ["PostgreSQL"],
  "other": []
}`

  try {
    const response = await model.generateContent(prompt)
    const text = response.response.text().trim()

    const cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()

    const result = JSON.parse(cleanText)

    return {
      languages: result.languages || [],
      frameworks: result.frameworks || [],
      tools: result.tools || [],
      databases: result.databases || [],
      other: result.other || [],
    }
  } catch (error) {
    console.error("Error categorizing skills batch:", error)
    return { languages: [], frameworks: [], tools: [], databases: [], other: skills }
  }
}

/**
 * Verify that ALL content from raw text has been extracted
 */
export async function verifyDataCompleteness(
  rawText: string,
  extractedData: any
): Promise<{ complete: boolean; missingContent: string[]; confidence: number }> {
  if (!process.env.GEMINI_API_KEY) {
    return { complete: true, missingContent: [], confidence: 0.5 }
  }

  const extractedJSON = JSON.stringify(extractedData, null, 2)

  const prompt = `You are verifying resume data extraction completeness.

ORIGINAL RESUME TEXT:
${rawText}

EXTRACTED DATA (JSON):
${extractedJSON}

TASK: Identify ANY content from the original text that is missing in the extracted JSON.

LOOK FOR:
- Names, emails, phone numbers, links not captured
- Work experience entries missing
- Education entries missing
- Skills mentioned but not extracted
- Projects described but not captured
- Bullet points or achievements lost
- Dates/locations missing
- Certifications, awards, publications, languages not captured
- Any sections or content completely missed

Return ONLY a JSON object:
{
  "complete": true/false,
  "missingContent": ["description of missing item 1", "description of missing item 2"],
  "confidence": 0.95
}

If everything is captured, return:
{
  "complete": true,
  "missingContent": [],
  "confidence": 0.99
}`

  try {
    const response = await model.generateContent(prompt)
    const text = response.response.text().trim()

    const cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()

    const result = JSON.parse(cleanText)

    return {
      complete: result.complete ?? true,
      missingContent: result.missingContent || [],
      confidence: result.confidence || 0.5,
    }
  } catch (error) {
    console.error("Error verifying completeness:", error)
    return { complete: true, missingContent: [], confidence: 0.3 }
  }
}
