import type { Contact } from '@/lib/schemas/resume-schema'

/**
 * Section Detection Utilities
 *
 * Advanced regex patterns and heuristics for identifying resume sections
 * and extracting contact information from unstructured text.
 */

// ============================================================================
// Section Patterns - Match common resume section headers
// ============================================================================

export const SECTION_PATTERNS = {
  contact: {
    email: /[\w.-]+@[\w.-]+\.\w+/gi,
    phone: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    linkedin: /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/gi,
    github: /(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+/gi,
    website: /(?:https?:\/\/)?(?:www\.)?[\w-]+\.[\w.-]+/gi,
  },

  experience: [
    /^experience$/i,
    /^work\s+experience$/i,
    /^employment$/i,
    /^professional\s+experience$/i,
    /^work\s+history$/i,
    /^career\s+history$/i,
    /^employment\s+history$/i,
  ],

  education: [
    /^education$/i,
    /^academic\s+background$/i,
    /^academic$/i,
    /^educational\s+background$/i,
    /^degrees$/i,
  ],

  skills: [
    /^skills$/i,
    /^technical\s+skills$/i,
    /^core\s+skills$/i,
    /^technologies$/i,
    /^competencies$/i,
    /^proficiencies$/i,
    /^expertise$/i,
    /^tech\s+stack$/i,
  ],

  projects: [
    /^projects$/i,
    /^personal\s+projects$/i,
    /^portfolio$/i,
    /^selected\s+projects$/i,
    /^relevant\s+projects$/i,
  ],

  certifications: [
    /^certifications?$/i,
    /^licenses?$/i,
    /^credentials$/i,
    /^professional\s+certifications?$/i,
  ],

  summary: [
    /^summary$/i,
    /^professional\s+summary$/i,
    /^profile$/i,
    /^objective$/i,
    /^career\s+objective$/i,
    /^about$/i,
  ],
}

// ============================================================================
// Section Detection Function
// ============================================================================

/**
 * Detects the type of resume section based on header text.
 *
 * @param text - The header text to analyze
 * @returns Section name ('experience', 'education', etc.) or null if no match
 */
export function detectSectionType(text: string): string | null {
  const normalized = text.toLowerCase().trim()

  // Skip very long lines (likely not headers)
  if (normalized.length > 100) {
    return null
  }

  for (const [sectionName, patterns] of Object.entries(SECTION_PATTERNS)) {
    // Skip contact patterns (handled separately)
    if (sectionName === 'contact') continue

    if (Array.isArray(patterns)) {
      if (patterns.some(pattern => pattern.test(normalized))) {
        return sectionName
      }
    }
  }

  return null
}

// ============================================================================
// Contact Information Extraction
// ============================================================================

/**
 * Extracts contact information from resume text using regex patterns.
 *
 * @param text - Full resume text or header section
 * @returns Partial contact object with extracted fields
 */
export function extractContactInfo(text: string): Partial<Contact> {
  const contact: Partial<Contact> = {}

  // Extract email
  const emailMatch = text.match(SECTION_PATTERNS.contact.email)
  if (emailMatch && emailMatch[0]) {
    // Take the first valid email, filter out common false positives
    const email = emailMatch[0].toLowerCase()
    if (!email.includes('@example.com') && !email.includes('@domain.com')) {
      contact.email = email
    }
  }

  // Extract phone
  const phoneMatch = text.match(SECTION_PATTERNS.contact.phone)
  if (phoneMatch && phoneMatch[0]) {
    contact.phone = phoneMatch[0].trim()
  }

  // Extract LinkedIn
  const linkedinMatch = text.match(SECTION_PATTERNS.contact.linkedin)
  if (linkedinMatch && linkedinMatch[0]) {
    let url = linkedinMatch[0]
    if (!url.startsWith('http')) {
      url = 'https://' + url
    }
    contact.linkedin = url
  }

  // Extract GitHub
  const githubMatch = text.match(SECTION_PATTERNS.contact.github)
  if (githubMatch && githubMatch[0]) {
    let url = githubMatch[0]
    if (!url.startsWith('http')) {
      url = 'https://' + url
    }
    contact.github = url
  }

  // Extract name (heuristic: first non-empty line that looks like a name)
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0)
  if (lines.length > 0) {
    const potentialName = lines[0]
    // Name heuristics:
    // - Less than 50 characters
    // - Doesn't contain @ (email)
    // - Doesn't contain http (URL)
    // - Not all uppercase (unless short)
    // - Contains at least one space (first + last name)
    if (
      potentialName.length < 50 &&
      !potentialName.includes('@') &&
      !potentialName.toLowerCase().includes('http') &&
      (potentialName !== potentialName.toUpperCase() || potentialName.length < 20)
    ) {
      contact.name = potentialName
    }
  }

  // Extract location (look for common patterns)
  const locationPatterns = [
    /(?:^|\n)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2}(?:\s+\d{5})?)(?:\n|$)/,
    /(?:^|\n)([A-Z][a-z]+,\s*[A-Z][a-z]+)(?:\n|$)/, // City, State
  ]

  for (const pattern of locationPatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      contact.location = match[1].trim()
      break
    }
  }

  return contact
}

// ============================================================================
// Enhanced Section Detection with Context
// ============================================================================

/**
 * Detects if a line is likely a section header based on multiple heuristics.
 *
 * @param line - The line to analyze
 * @param prevLine - Previous line for context (optional)
 * @param nextLine - Next line for context (optional)
 * @returns true if line is likely a section header
 */
export function isSectionHeader(
  line: string,
  prevLine?: string,
  nextLine?: string
): boolean {
  const trimmed = line.trim()

  // Empty line is not a header
  if (trimmed.length === 0) {
    return false
  }

  // Too long to be a header
  if (trimmed.length > 100) {
    return false
  }

  // Check if it matches known section patterns
  if (detectSectionType(trimmed) !== null) {
    return true
  }

  // Additional heuristics
  const heuristics = [
    // All caps (common for headers)
    trimmed === trimmed.toUpperCase() && trimmed.length > 3 && trimmed.length < 50,

    // Ends with colon
    trimmed.endsWith(':'),

    // All bold/underlined (can't detect in plain text, but check for markdown-style)
    /^[*_]{1,2}[^*_]+[*_]{1,2}$/.test(trimmed),

    // Preceded by blank line and followed by content
    (!prevLine || prevLine.trim().length === 0) &&
      (nextLine && nextLine.trim().length > 0),

    // Short line followed by longer content
    trimmed.length < 30 && (nextLine && nextLine.trim().length > trimmed.length),
  ]

  // If 2+ heuristics match, likely a header
  const matchCount = heuristics.filter(Boolean).length
  return matchCount >= 2
}

// ============================================================================
// Date Extraction Utilities
// ============================================================================

/**
 * Extracts date ranges from text (e.g., "Jan 2020 - Dec 2022" or "2020 - Present")
 *
 * @param text - Text containing date information
 * @returns Object with startDate and endDate, or null if no match
 */
export function extractDateRange(text: string): {
  startDate: string
  endDate: string
} | null {
  // Pattern 1: "Month Year - Month Year" (e.g., "Jan 2020 - Dec 2022")
  const pattern1 = /(\w{3,9}\s+\d{4})\s*[-–—]\s*(\w{3,9}\s+\d{4}|Present|Current)/i
  const match1 = text.match(pattern1)
  if (match1) {
    return {
      startDate: match1[1].trim(),
      endDate: match1[2].trim(),
    }
  }

  // Pattern 2: "Year - Year" (e.g., "2020 - 2022")
  const pattern2 = /(\d{4})\s*[-–—]\s*(\d{4}|Present|Current)/i
  const match2 = text.match(pattern2)
  if (match2) {
    return {
      startDate: match2[1].trim(),
      endDate: match2[2].trim(),
    }
  }

  // Pattern 3: Single date (e.g., "May 2024" for graduation)
  const pattern3 = /(\w{3,9}\s+\d{4})/
  const match3 = text.match(pattern3)
  if (match3) {
    return {
      startDate: match3[1].trim(),
      endDate: match3[1].trim(),
    }
  }

  return null
}

// ============================================================================
// Bullet Point Detection
// ============================================================================

/**
 * Detects if a line is a bullet point.
 *
 * @param line - The line to check
 * @returns true if line is a bullet point
 */
export function isBulletPoint(line: string): boolean {
  const trimmed = line.trim()

  // Empty line is not a bullet
  if (trimmed.length === 0) {
    return false
  }

  // Check for common bullet indicators
  const bulletIndicators = [
    /^[•·◦▪▫○●∙-]\s+/, // Bullet symbols
    /^\*\s+/, // Asterisk
    /^\d+\.\s+/, // Numbered list
    /^[a-z]\)\s+/i, // Letter list
  ]

  return bulletIndicators.some(pattern => pattern.test(trimmed))
}

/**
 * Strips bullet indicators from a line.
 *
 * @param line - The bullet point line
 * @returns Clean text without bullet indicators
 */
export function stripBullet(line: string): string {
  return line
    .trim()
    .replace(/^[•·◦▪▫○●∙-]\s+/, '')
    .replace(/^\*\s+/, '')
    .replace(/^\d+\.\s+/, '')
    .replace(/^[a-z]\)\s+/i, '')
    .trim()
}

// ============================================================================
// Skill Categorization Utilities
// ============================================================================

/**
 * Common programming languages for categorization
 */
const PROGRAMMING_LANGUAGES = new Set([
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'csharp',
  'ruby', 'php', 'swift', 'kotlin', 'go', 'golang', 'rust', 'scala',
  'r', 'matlab', 'perl', 'bash', 'shell', 'sql', 'html', 'css',
])

/**
 * Common frameworks for categorization
 */
const FRAMEWORKS = new Set([
  'react', 'angular', 'vue', 'svelte', 'nextjs', 'next.js', 'gatsby',
  'django', 'flask', 'fastapi', 'express', 'nestjs', 'spring', 'springboot',
  'rails', 'laravel', 'asp.net', '.net', 'tensorflow', 'pytorch', 'keras',
  'tailwind', 'bootstrap', 'materialui', 'mui', 'chakraui',
])

/**
 * Common tools for categorization
 */
const TOOLS = new Set([
  'git', 'github', 'gitlab', 'bitbucket', 'docker', 'kubernetes', 'k8s',
  'jenkins', 'circleci', 'travis', 'aws', 'azure', 'gcp', 'heroku', 'vercel',
  'netlify', 'vscode', 'intellij', 'eclipse', 'vim', 'webpack', 'vite',
  'babel', 'eslint', 'prettier', 'jest', 'mocha', 'cypress', 'selenium',
  'postman', 'insomnia', 'figma', 'sketch', 'jira', 'confluence', 'slack',
])

/**
 * Categorizes a skill into languages, frameworks, or tools.
 *
 * @param skill - The skill to categorize
 * @returns Category: 'languages', 'frameworks', 'tools', or 'other'
 */
export function categorizeSkill(skill: string): 'languages' | 'frameworks' | 'tools' | 'other' {
  const normalized = skill.toLowerCase().replace(/[^a-z0-9]/g, '')

  if (PROGRAMMING_LANGUAGES.has(normalized)) {
    return 'languages'
  }

  if (FRAMEWORKS.has(normalized)) {
    return 'frameworks'
  }

  if (TOOLS.has(normalized)) {
    return 'tools'
  }

  return 'other'
}

/**
 * Extracts and categorizes skills from a comma-separated or line-separated list.
 *
 * @param text - Text containing skills
 * @returns Categorized skills object
 */
export function extractAndCategorizeSkills(text: string): {
  languages: string[]
  frameworks: string[]
  tools: string[]
  other: string[]
} {
  // Split by common delimiters
  const skills = text
    .split(/[,;•·\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && s.length < 50) // Filter out empty and very long entries

  const categorized = {
    languages: [] as string[],
    frameworks: [] as string[],
    tools: [] as string[],
    other: [] as string[],
  }

  for (const skill of skills) {
    const category = categorizeSkill(skill)
    categorized[category].push(skill)
  }

  return categorized
}
