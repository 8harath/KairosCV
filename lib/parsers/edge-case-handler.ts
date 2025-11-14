/**
 * Comprehensive Edge Case Handler for Resume Data
 *
 * Handles ALL possible edge cases including:
 * - Duplicate detection and removal
 * - Data normalization
 * - Date validation and standardization
 * - Content quality checks
 * - Multi-page artifacts removal
 * - Empty content removal
 */

import type { ResumeData } from '../schemas/resume-schema'

// ============================================================================
// DEDUPLICATION UTILITIES
// ============================================================================

/**
 * Calculate similarity between two strings (0-1 scale)
 * Uses Levenshtein distance ratio
 */
function stringSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1

  if (longer.length === 0) return 1.0

  const editDistance = levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase())
  return (longer.length - editDistance) / longer.length
}

/**
 * Levenshtein distance calculation
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }

  return matrix[str2.length][str1.length]
}

/**
 * Remove duplicate experience entries
 */
function deduplicateExperience(experiences: any[]): any[] {
  if (!experiences || experiences.length === 0) return []

  const unique: any[] = []

  for (const exp of experiences) {
    // Check if this experience is similar to any existing one
    const isDuplicate = unique.some(existing => {
      const companySimilar = stringSimilarity(exp.company || '', existing.company || '') > 0.85
      const titleSimilar = stringSimilarity(exp.title || '', existing.title || '') > 0.85
      const dateSimilar = exp.startDate === existing.startDate && exp.endDate === existing.endDate

      return companySimilar && titleSimilar && dateSimilar
    })

    if (!isDuplicate) {
      unique.push(exp)
    }
  }

  return unique
}

/**
 * Remove duplicate education entries
 */
function deduplicateEducation(education: any[]): any[] {
  if (!education || education.length === 0) return []

  const unique: any[] = []

  for (const edu of education) {
    const isDuplicate = unique.some(existing => {
      const institutionSimilar = stringSimilarity(edu.institution || '', existing.institution || '') > 0.85
      const degreeSimilar = stringSimilarity(edu.degree || '', existing.degree || '') > 0.85
      const dateSimilar = edu.endDate === existing.endDate

      return institutionSimilar && degreeSimilar && dateSimilar
    })

    if (!isDuplicate) {
      unique.push(edu)
    }
  }

  return unique
}

/**
 * Remove duplicate projects
 */
function deduplicateProjects(projects: any[]): any[] {
  if (!projects || projects.length === 0) return []

  const unique: any[] = []

  for (const proj of projects) {
    const isDuplicate = unique.some(existing => {
      const nameSimilar = stringSimilarity(proj.name || '', existing.name || '') > 0.85
      return nameSimilar
    })

    if (!isDuplicate) {
      unique.push(proj)
    }
  }

  return unique
}

/**
 * Remove duplicate skills
 */
function deduplicateSkills(skills: string[]): string[] {
  if (!skills || skills.length === 0) return []

  const unique: string[] = []
  const normalized = new Set<string>()

  for (const skill of skills) {
    const norm = normalizeSkill(skill)
    if (!normalized.has(norm)) {
      normalized.add(norm)
      unique.push(skill)
    }
  }

  return unique
}

/**
 * Normalize skill name for comparison
 */
function normalizeSkill(skill: string): string {
  return skill
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[.-]/g, '')
    .replace(/js$/i, 'javascript')
    .replace(/py$/i, 'python')
}

/**
 * Remove duplicate strings from array
 */
function deduplicateStringArray(arr: string[]): string[] {
  if (!arr || arr.length === 0) return []
  return Array.from(new Set(arr.map(s => s.trim()).filter(s => s.length > 0)))
}

// ============================================================================
// DATA NORMALIZATION UTILITIES
// ============================================================================

/**
 * Normalize date string to consistent format
 */
function normalizeDate(date: string | undefined): string {
  if (!date) return ''

  const normalized = date.trim()

  // Handle "Present", "Current", "Now"
  if (/^(present|current|now)$/i.test(normalized)) {
    return 'Present'
  }

  // Handle various date formats
  // "Jan 2020", "January 2020", "01/2020", "2020-01"
  const monthMap: Record<string, string> = {
    'january': 'Jan', 'jan': 'Jan',
    'february': 'Feb', 'feb': 'Feb',
    'march': 'Mar', 'mar': 'Mar',
    'april': 'Apr', 'apr': 'Apr',
    'may': 'May',
    'june': 'Jun', 'jun': 'Jun',
    'july': 'Jul', 'jul': 'Jul',
    'august': 'Aug', 'aug': 'Aug',
    'september': 'Sep', 'sept': 'Sep', 'sep': 'Sep',
    'october': 'Oct', 'oct': 'Oct',
    'november': 'Nov', 'nov': 'Nov',
    'december': 'Dec', 'dec': 'Dec'
  }

  // Try to extract month and year
  const monthYearMatch = normalized.match(/([a-z]+)[\s,]+(\d{4})/i)
  if (monthYearMatch) {
    const month = monthMap[monthYearMatch[1].toLowerCase()] || monthYearMatch[1]
    return `${month} ${monthYearMatch[2]}`
  }

  // Try numeric format: 01/2020 or 2020-01
  const numericMatch = normalized.match(/(\d{1,2})[\/\-](\d{4})/)
  if (numericMatch) {
    const monthNum = parseInt(numericMatch[1])
    const year = numericMatch[2]
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    if (monthNum >= 1 && monthNum <= 12) {
      return `${months[monthNum - 1]} ${year}`
    }
  }

  // Return as-is if can't normalize
  return normalized
}

/**
 * Validate and fix date range
 */
function validateDateRange(startDate: string, endDate: string): { start: string; end: string } {
  const start = normalizeDate(startDate)
  const end = normalizeDate(endDate)

  // If end is "Present", it's always valid
  if (end === 'Present') {
    return { start, end }
  }

  // Both should have year
  const startYear = parseInt(start.match(/\d{4}/)?.[0] || '0')
  const endYear = parseInt(end.match(/\d{4}/)?.[0] || '0')

  // If end year is before start year, swap them
  if (endYear > 0 && startYear > 0 && endYear < startYear) {
    console.warn(`Date range issue: ${start} to ${end} - swapping`)
    return { start: end, end: start }
  }

  return { start, end }
}

/**
 * Normalize phone number
 */
function normalizePhoneNumber(phone: string | undefined): string {
  if (!phone) return ''

  // Remove all non-digit characters except + at start
  let normalized = phone.replace(/[^\d+]/g, '')

  // If starts with country code, keep it
  if (normalized.startsWith('+')) {
    return normalized
  }

  // If 10 digits, format as US number
  if (normalized.length === 10) {
    return `+1${normalized}`
  }

  return normalized
}

/**
 * Normalize URL
 */
function normalizeURL(url: string | undefined): string {
  if (!url) return ''

  let normalized = url.trim()

  // Remove http:// or https://
  normalized = normalized.replace(/^https?:\/\//i, '')

  // Remove www.
  normalized = normalized.replace(/^www\./i, '')

  // Remove trailing slash
  normalized = normalized.replace(/\/$/, '')

  return normalized
}

/**
 * Clean bullet point text
 */
function cleanBulletPoint(bullet: string): string {
  if (!bullet) return ''

  let cleaned = bullet.trim()

  // Remove bullet symbols at start
  cleaned = cleaned.replace(/^[•●\-*▪︎◦○■□☐☑✓✔➢➣⦿⦾]\s*/, '')

  // Remove extra whitespace
  cleaned = cleaned.replace(/\s+/g, ' ')

  // Fix smart quotes
  cleaned = cleaned.replace(/[""]/g, '"')
  cleaned = cleaned.replace(/['']/g, "'")

  // Fix em-dashes and en-dashes
  cleaned = cleaned.replace(/[—–]/g, '-')

  // Trim again
  cleaned = cleaned.trim()

  return cleaned
}

/**
 * Validate bullet point quality
 */
function isValidBullet(bullet: string): boolean {
  if (!bullet || bullet.length < 10) return false
  if (bullet.length > 1000) return false // Too long
  if (/^\d+$/.test(bullet)) return false // Just a number
  if (/^[\d\s\-\/]+$/.test(bullet)) return false // Just dates/numbers
  if (/^[A-Z\s]+$/.test(bullet) && bullet.length < 30) return false // Likely a header
  return true
}

// ============================================================================
// MULTI-PAGE ARTIFACT REMOVAL
// ============================================================================

/**
 * Detect and remove common multi-page artifacts
 */
function removePageArtifacts(text: string, contactName: string): string {
  let cleaned = text

  // Remove page numbers (various formats)
  cleaned = cleaned.replace(/^Page \d+ of \d+$/gmi, '')
  cleaned = cleaned.replace(/^\d+ \/ \d+$/gmi, '')
  cleaned = cleaned.replace(/^\d+$/gm, '') // Standalone numbers on their own line

  // Remove repeated name (often appears as header on each page)
  if (contactName) {
    const nameLine = new RegExp(`^${contactName}$`, 'gmi')
    // Only remove if it appears more than once
    const matches = cleaned.match(nameLine)
    if (matches && matches.length > 1) {
      cleaned = cleaned.replace(nameLine, '')
    }
  }

  // Remove repeated contact info lines
  const emailPattern = /^[\w.-]+@[\w.-]+\.\w+$/gm
  const phonePattern = /^[\+\d\s\-\(\)]+$/gm

  // Remove consecutive duplicate lines
  const lines = cleaned.split('\n')
  const uniqueLines: string[] = []
  let previousLine = ''

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed !== previousLine || trimmed.length === 0) {
      uniqueLines.push(line)
    }
    previousLine = trimmed
  }

  cleaned = uniqueLines.join('\n')

  // Remove excessive blank lines (more than 2 consecutive)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n')

  return cleaned
}

// ============================================================================
// MAIN EDGE CASE HANDLER
// ============================================================================

/**
 * Process resume data to handle ALL edge cases
 */
export function handleAllEdgeCases(resumeData: any, rawText?: string): ResumeData {
  console.log('🔧 Handling edge cases and normalizing data...')

  // Step 1: Remove multi-page artifacts from raw text if available
  let cleanedText = rawText
  if (cleanedText && resumeData.contact?.name) {
    cleanedText = removePageArtifacts(cleanedText, resumeData.contact.name)
  }

  // Step 2: Normalize contact information
  if (resumeData.contact) {
    resumeData.contact.phone = normalizePhoneNumber(resumeData.contact.phone)
    resumeData.contact.linkedin = normalizeURL(resumeData.contact.linkedin)
    resumeData.contact.github = normalizeURL(resumeData.contact.github)
    resumeData.contact.website = normalizeURL(resumeData.contact.website)
    resumeData.contact.name = resumeData.contact.name?.trim() || ''
    resumeData.contact.email = resumeData.contact.email?.trim().toLowerCase() || ''
    resumeData.contact.location = resumeData.contact.location?.trim() || ''
  }

  // Step 3: Deduplicate and normalize experience
  if (resumeData.experience) {
    resumeData.experience = deduplicateExperience(resumeData.experience)

    for (const exp of resumeData.experience) {
      // Normalize dates
      const dates = validateDateRange(exp.startDate, exp.endDate)
      exp.startDate = dates.start
      exp.endDate = dates.end

      // Clean bullets
      if (exp.bullets) {
        exp.bullets = exp.bullets
          .map((b: string) => cleanBulletPoint(b))
          .filter((b: string) => isValidBullet(b))

        // Deduplicate bullets
        exp.bullets = deduplicateStringArray(exp.bullets)
      }

      // Normalize text fields
      exp.company = exp.company?.trim() || ''
      exp.title = exp.title?.trim() || ''
      exp.location = exp.location?.trim() || ''
    }

    // Remove entries with no bullets
    resumeData.experience = resumeData.experience.filter((exp: any) =>
      exp.bullets && exp.bullets.length > 0
    )
  }

  // Step 4: Deduplicate and normalize education
  if (resumeData.education) {
    resumeData.education = deduplicateEducation(resumeData.education)

    for (const edu of resumeData.education) {
      // Normalize dates
      if (edu.startDate || edu.endDate) {
        const dates = validateDateRange(edu.startDate || '', edu.endDate || '')
        edu.startDate = dates.start || undefined
        edu.endDate = dates.end || undefined
      }

      // Normalize text fields
      edu.institution = edu.institution?.trim() || ''
      edu.degree = edu.degree?.trim() || ''
      edu.field = edu.field?.trim() || undefined
      edu.location = edu.location?.trim() || undefined
      edu.gpa = edu.gpa?.trim() || undefined

      // Deduplicate honors and coursework
      if (edu.honors) {
        edu.honors = deduplicateStringArray(edu.honors)
      }
      if (edu.relevantCoursework) {
        edu.relevantCoursework = deduplicateStringArray(edu.relevantCoursework)
      }
    }
  }

  // Step 5: Deduplicate and normalize skills
  if (resumeData.skills) {
    resumeData.skills.languages = deduplicateSkills(resumeData.skills.languages || [])
    resumeData.skills.frameworks = deduplicateSkills(resumeData.skills.frameworks || [])
    resumeData.skills.tools = deduplicateSkills(resumeData.skills.tools || [])
    resumeData.skills.databases = deduplicateSkills(resumeData.skills.databases || [])

    if (resumeData.skills.other) {
      resumeData.skills.other = deduplicateSkills(resumeData.skills.other)
    }
  }

  // Step 6: Deduplicate and normalize projects
  if (resumeData.projects) {
    resumeData.projects = deduplicateProjects(resumeData.projects)

    for (const proj of resumeData.projects) {
      // Clean bullets
      if (proj.bullets) {
        proj.bullets = proj.bullets
          .map((b: string) => cleanBulletPoint(b))
          .filter((b: string) => isValidBullet(b))
        proj.bullets = deduplicateStringArray(proj.bullets)
      }

      // Deduplicate technologies
      if (proj.technologies) {
        proj.technologies = deduplicateSkills(proj.technologies)
      }

      // Normalize URLs
      proj.link = normalizeURL(proj.link)
      proj.github = normalizeURL(proj.github)

      // Normalize text fields
      proj.name = proj.name?.trim() || ''
      proj.description = proj.description?.trim() || ''
    }
  }

  // Step 7: Normalize certifications
  if (resumeData.certifications) {
    if (Array.isArray(resumeData.certifications)) {
      // Could be string[] or Certification[]
      if (typeof resumeData.certifications[0] === 'string') {
        resumeData.certifications = deduplicateStringArray(resumeData.certifications as string[])
      } else {
        // It's Certification objects
        const seen = new Set<string>()
        resumeData.certifications = resumeData.certifications.filter((cert: any) => {
          const key = `${cert.name}|${cert.issuer}`.toLowerCase()
          if (seen.has(key)) return false
          seen.add(key)
          return true
        })
      }
    }
  }

  // Step 8: Normalize awards
  if (resumeData.awards) {
    const seen = new Set<string>()
    resumeData.awards = resumeData.awards.filter((award: any) => {
      const key = `${award.name}|${award.issuer}`.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      award.name = award.name?.trim() || ''
      award.issuer = award.issuer?.trim() || undefined
      award.date = award.date?.trim() || undefined
      award.description = award.description?.trim() || undefined
      return true
    })
  }

  // Step 9: Normalize publications
  if (resumeData.publications) {
    const seen = new Set<string>()
    resumeData.publications = resumeData.publications.filter((pub: any) => {
      const key = pub.title?.toLowerCase() || ''
      if (seen.has(key)) return false
      seen.add(key)
      pub.title = pub.title?.trim() || ''
      pub.venue = pub.venue?.trim() || undefined
      pub.date = pub.date?.trim() || undefined
      pub.url = normalizeURL(pub.url)
      return true
    })
  }

  // Step 10: Normalize volunteer
  if (resumeData.volunteer) {
    for (const vol of resumeData.volunteer) {
      if (vol.startDate || vol.endDate) {
        const dates = validateDateRange(vol.startDate || '', vol.endDate || '')
        vol.startDate = dates.start || undefined
        vol.endDate = dates.end || undefined
      }

      if (vol.bullets) {
        vol.bullets = vol.bullets
          .map((b: string) => cleanBulletPoint(b))
          .filter((b: string) => isValidBullet(b))
        vol.bullets = deduplicateStringArray(vol.bullets)
      }

      vol.organization = vol.organization?.trim() || ''
      vol.role = vol.role?.trim() || ''
      vol.location = vol.location?.trim() || undefined
    }
  }

  // Step 11: Normalize hobbies
  if (resumeData.hobbies) {
    const seen = new Set<string>()
    resumeData.hobbies = resumeData.hobbies.filter((hobby: any) => {
      const key = hobby.name?.toLowerCase() || ''
      if (seen.has(key)) return false
      seen.add(key)
      hobby.name = hobby.name?.trim() || ''
      hobby.description = hobby.description?.trim() || undefined
      return true
    })
  }

  // Step 12: Normalize references
  if (resumeData.references) {
    resumeData.references = deduplicateStringArray(resumeData.references)
  }

  // Step 13: Normalize language proficiency
  if (resumeData.languageProficiency) {
    const seen = new Set<string>()
    resumeData.languageProficiency = resumeData.languageProficiency.filter((lang: any) => {
      const key = lang.language?.toLowerCase() || ''
      if (seen.has(key)) return false
      seen.add(key)
      lang.language = lang.language?.trim() || ''
      lang.proficiency = lang.proficiency?.trim() || undefined
      lang.certification = lang.certification?.trim() || undefined
      return true
    })
  }

  // Step 14: Normalize custom sections
  if (resumeData.customSections) {
    for (const section of resumeData.customSections) {
      section.heading = section.heading?.trim() || ''
      if (section.content) {
        section.content = section.content
          .map((c: string) => cleanBulletPoint(c))
          .filter((c: string) => c.length > 0)
        section.content = deduplicateStringArray(section.content)
      }
    }

    // Remove empty custom sections
    resumeData.customSections = resumeData.customSections.filter((section: any) =>
      section.content && section.content.length > 0
    )
  }

  // Step 15: Update rawText with cleaned version
  if (cleanedText) {
    resumeData.rawText = cleanedText
  }

  console.log('✓ Edge case handling complete')

  return resumeData as ResumeData
}

/**
 * Validate resume data after edge case handling
 */
export function validateProcessedData(resumeData: ResumeData): {
  isValid: boolean
  issues: string[]
  warnings: string[]
} {
  const issues: string[] = []
  const warnings: string[] = []

  // Critical validations
  if (!resumeData.contact?.name || resumeData.contact.name.length < 2) {
    issues.push('Missing or invalid contact name')
  }

  if (!resumeData.contact?.email && !resumeData.contact?.phone) {
    warnings.push('No contact email or phone number')
  }

  if (!resumeData.experience || resumeData.experience.length === 0) {
    warnings.push('No work experience entries found')
  }

  if (!resumeData.education || resumeData.education.length === 0) {
    warnings.push('No education entries found')
  }

  // Check for potential duplicates that weren't caught
  if (resumeData.experience && resumeData.experience.length > 1) {
    for (let i = 0; i < resumeData.experience.length; i++) {
      for (let j = i + 1; j < resumeData.experience.length; j++) {
        const exp1 = resumeData.experience[i]
        const exp2 = resumeData.experience[j]

        if (exp1.company === exp2.company &&
            exp1.title === exp2.title &&
            exp1.startDate === exp2.startDate) {
          warnings.push(`Potential duplicate experience: ${exp1.title} at ${exp1.company}`)
        }
      }
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
    warnings
  }
}
