/**
 * Enhanced Resume Parser
 * Extracts structured data from resume text with better logic
 */

export interface ContactInfo {
  name: string
  email: string
  phone: string
  linkedin: string
  github: string
  website: string
  location: string
}

export interface ExperienceEntry {
  company: string
  title: string
  location: string
  startDate: string
  endDate: string
  bullets: string[]
}

export interface EducationEntry {
  institution: string
  degree: string
  field: string
  location: string
  startDate: string
  endDate: string
  gpa?: string
  honors?: string[]
}

export interface ProjectEntry {
  name: string
  description: string
  technologies: string[]
  link?: string
  bullets: string[]
}

export interface ParsedResume {
  contact: ContactInfo
  summary?: string
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: {
    languages: string[]
    frameworks: string[]
    tools: string[]
    databases: string[]
  }
  projects: ProjectEntry[]
  certifications: string[]
  // New comprehensive sections
  awards?: Array<{name: string; issuer?: string; date?: string; description?: string}>
  publications?: Array<{title: string; authors?: string[]; venue?: string; date?: string; url?: string}>
  languageProficiency?: Array<{language: string; proficiency?: string; certification?: string}>
  volunteer?: Array<{organization: string; role: string; location?: string; startDate?: string; endDate?: string; bullets: string[]}>
  hobbies?: Array<{name: string; description?: string}>
  references?: string[]
  customSections?: Array<{heading: string; content: string[]}>
}

/**
 * Extract contact information from resume text
 */
export function extractContactInfo(text: string): ContactInfo {
  const lines = text.split("\n").slice(0, 10) // Check first 10 lines
  const fullText = lines.join(" ")

  // Extract email
  const emailMatch = fullText.match(/[\w.-]+@[\w.-]+\.\w+/i)
  const email = emailMatch ? emailMatch[0] : ""

  // Extract phone
  const phoneMatch = fullText.match(/(\+?\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/i)
  const phone = phoneMatch ? phoneMatch[0] : ""

  // Extract LinkedIn
  const linkedinMatch = fullText.match(/linkedin\.com\/in\/([\w-]+)/i)
  const linkedin = linkedinMatch ? linkedinMatch[0] : ""

  // Extract GitHub
  const githubMatch = fullText.match(/github\.com\/([\w-]+)/i)
  const github = githubMatch ? githubMatch[0] : ""

  // Extract website
  const websiteMatch = fullText.match(/(https?:\/\/)?(www\.)?[\w-]+\.(com|net|org|io|dev)/i)
  const website = websiteMatch && !websiteMatch[0].includes("linkedin") && !websiteMatch[0].includes("github")
    ? websiteMatch[0]
    : ""

  // Extract name (usually the first line if it's short and looks like a name)
  const firstLine = lines[0]?.trim() || ""

  // More flexible name matching:
  // - Allow all caps (JOHN SMITH)
  // - Allow initials (John S., J. Smith, BHARATH K)
  // - Allow multiple capitals (McDonald, O'Brien)
  // - Require at least 2 words
  // - Must be under 50 characters
  const namePattern = /^[A-Z][A-Za-z'.-]*(?:\s+[A-Z][A-Za-z'.-]*)+$/
  const name = firstLine.length > 0 &&
               firstLine.length < 50 &&
               !firstLine.includes('@') && // Not an email
               !firstLine.match(/^\d/) && // Doesn't start with number
               namePattern.test(firstLine)
    ? firstLine
    : ""

  // Extract location (common patterns)
  const locationMatch = fullText.match(/([A-Z][a-z]+,\s*[A-Z]{2})|([A-Z][a-z]+,\s*[A-Z][a-z]+)/i)
  const location = locationMatch ? locationMatch[0] : ""

  return {
    name,
    email,
    phone,
    linkedin,
    github,
    website,
    location,
  }
}

/**
 * Extract experience entries with structured data
 */
export function extractExperience(text: string): ExperienceEntry[] {
  const experiences: ExperienceEntry[] = []
  const lines = text.split("\n")

  let inExperienceSection = false
  let currentEntry: Partial<ExperienceEntry> | null = null
  let bullets: string[] = []
  let expectingJobTitle = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    const lowerLine = line.toLowerCase()

    // Detect experience section start
    if (
      lowerLine.includes("experience") ||
      lowerLine.includes("work history") ||
      lowerLine.includes("employment")
    ) {
      inExperienceSection = true
      continue
    }

    // Stop at next section
    if (
      inExperienceSection &&
      (lowerLine.includes("education") ||
        lowerLine.includes("skills") ||
        lowerLine.includes("projects") ||
        lowerLine.includes("certifications") ||
        lowerLine.includes("activities"))
    ) {
      // Save last entry
      if (currentEntry && currentEntry.company) {
        experiences.push({
          company: currentEntry.company,
          title: currentEntry.title || "Position",
          location: currentEntry.location || "",
          startDate: currentEntry.startDate || "",
          endDate: currentEntry.endDate || "",
          bullets: bullets,
        })
      }
      break
    }

    if (!inExperienceSection || !line) continue

    // Format detection:
    // 1. "CompanyName    Location" or "CompanyName, Location"
    // 2. Next line: dates
    // 3. Next line: job title (optional)
    // 4. Then bullets

    // Check if it's a company/location line (not a bullet, not a date)
    const companyLocationMatch = line.match(/^([A-Za-z0-9\s&.'-]+)\s{2,}([A-Za-z\s,]+)$/) ||
                                 line.match(/^([A-Za-z0-9\s&.'-]+?),?\s+([A-Z][A-Za-z]+,?\s*[A-Z]{2,3}|[A-Z][A-Za-z]+)$/i)

    if (companyLocationMatch && !line.match(/^[•●\-*]/) && i > 0) {
      // Save previous entry
      if (currentEntry && currentEntry.company) {
        experiences.push({
          company: currentEntry.company,
          title: currentEntry.title || "Position",
          location: currentEntry.location || "",
          startDate: currentEntry.startDate || "",
          endDate: currentEntry.endDate || "",
          bullets: bullets,
        })
      }

      // Start new entry
      currentEntry = {
        company: companyLocationMatch[1].trim(),
        location: companyLocationMatch[2].trim(),
        title: "",
        startDate: "",
        endDate: "",
      }
      bullets = []
      expectingJobTitle = false
    }
    // Detect dates
    else if (currentEntry && line.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4}|Present|Current)/i)) {
      const dates = extractDates(line)
      currentEntry.startDate = dates.start
      currentEntry.endDate = dates.end
      expectingJobTitle = true // Job title might come after dates
    }
    // If we have a company but no title yet, and this isn't a bullet or date, it might be the title
    else if (
      expectingJobTitle &&
      currentEntry &&
      !currentEntry.title &&
      !line.match(/^[•●\-*]/) &&
      line.length < 80 &&
      !line.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i)
    ) {
      currentEntry.title = line
      expectingJobTitle = false
    }
    // Detect bullet points with ● (or other bullet chars)
    else if (line.match(/^[•●\-*▪︎◦○■□☐☑✓✔➢➣⦿⦾]/)) {
      const bullet = line.replace(/^[•●\-*▪︎◦○■□☐☑✓✔➢➣⦿⦾]\s*/, "").trim()
      if (bullet && bullet.length > 3) {
        bullets.push(bullet)
        expectingJobTitle = false
      }
    }
    // Lines starting with action verbs (common in resumes)
    else if (
      currentEntry &&
      line.match(/^(Developed|Built|Created|Implemented|Designed|Led|Managed|Improved|Increased|Decreased|Reduced|Achieved|Delivered|Launched|Established|Coordinated|Analyzed|Optimized|Automated|Integrated|Collaborated|Spearheaded|Executed|Enhanced|Architected|Engineered|Configured|Maintained|Deployed|Tested|Debugged|Troubleshot|Resolved|Streamlined|Facilitated|Conducted|Presented|Trained|Mentored|Directed|Oversaw|Supervised|Pioneered|Initiated|Organized|Planned|Strategized|Evaluated|Assessed|Monitored|Tracked|Documented|Researched|Investigated|Identified|Proposed|Recommended|Advised|Consulted|Supported|Assisted|Provided|Ensured|Verified|Validated|Certified|Approved|Authorized|Negotiated|Contracted|Procured|Purchased|Acquired|Generated|Produced|Published|Wrote|Edited|Reviewed|Translated|Interpreted|Collected|Used|Utilized|Leveraged)/i)
    ) {
      bullets.push(line)
      expectingJobTitle = false
    }
  }

  // Save last entry
  if (currentEntry && currentEntry.company) {
    experiences.push({
      company: currentEntry.company,
      title: currentEntry.title || "Position",
      location: currentEntry.location || "",
      startDate: currentEntry.startDate || "",
      endDate: currentEntry.endDate || "",
      bullets: bullets,
    })
  }

  return experiences
}

/**
 * Extract education entries with structured data
 */
export function extractEducation(text: string): EducationEntry[] {
  const education: EducationEntry[] = []
  const lines = text.split("\n")

  let inEducationSection = false
  let currentEntry: Partial<EducationEntry> | null = null
  let linesSinceEntry = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    const lowerLine = line.toLowerCase()

    // Detect education section start
    if (lowerLine.includes("education")) {
      inEducationSection = true
      continue
    }

    // Stop at next section
    if (
      inEducationSection &&
      (lowerLine.includes("experience") ||
        lowerLine.includes("skills") ||
        lowerLine.includes("projects") ||
        lowerLine.includes("certifications") ||
        lowerLine.includes("activities"))
    ) {
      // Save last entry
      if (currentEntry && currentEntry.institution) {
        education.push(currentEntry as EducationEntry)
      }
      break
    }

    if (!inEducationSection || !line) continue

    // Detect institution (has location or keywords)
    const institutionMatch = line.match(/^([A-Za-z\s()'-]+?)\s+([A-Z][a-z]+,?\s*[A-Z]{2,3})$/i) ||
                             (line.match(/university|college|institute|school|deemed/i) && line.length < 100)

    if (institutionMatch) {
      // Save previous entry
      if (currentEntry && currentEntry.institution && linesSinceEntry > 0) {
        education.push(currentEntry as EducationEntry)
      }

      if (Array.isArray(institutionMatch)) {
        currentEntry = {
          institution: institutionMatch[1].trim(),
          location: institutionMatch[2].trim(),
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
        }
      } else {
        currentEntry = {
          institution: line,
          degree: "",
          field: "",
          location: "",
          startDate: "",
          endDate: "",
        }
      }
      linesSinceEntry = 0
    }
    // Detect degree
    else if (
      currentEntry &&
      line.match(/bachelor|master|degree|phd|b\.s\.|m\.s\.|b\.a\.|m\.a\.|b\.c\.a\.|associate|diploma/i)
    ) {
      const degreeMatch = line.match(/(bachelor|master|degree|phd|doctorate|b\.s\.|m\.s\.|b\.a\.|m\.a\.|b\.c\.a\.|associate|diploma)[\w\s.]*/i)
      currentEntry.degree = degreeMatch ? degreeMatch[0].trim() : line

      // Try to extract expected graduation
      const expectedMatch = line.match(/Expected\s+([A-Za-z]+\s+\d{4})/i)
      if (expectedMatch) {
        currentEntry.endDate = expectedMatch[1]
      }

      // Try to extract field
      const fieldMatch = line.match(/(?:in|of)\s+([A-Z][a-z][a-zA-Z\s]+?)(?:;|$|Expected)/i)
      if (fieldMatch) {
        currentEntry.field = fieldMatch[1].trim()
      }
      linesSinceEntry++
    }
    // Detect major/minor
    else if (currentEntry && line.match(/major|minor/i)) {
      const fieldMatch = line.match(/(?:Major|Minor)\s+in\s+([A-Za-z\s]+)/i)
      if (fieldMatch && !currentEntry.field) {
        currentEntry.field = fieldMatch[1].trim()
      }
      linesSinceEntry++
    }
    // Detect GPA
    else if (currentEntry && line.match(/gpa|grade|cumulative/i)) {
      const gpaMatch = line.match(/(\d+\.?\d*)/i)
      if (gpaMatch && !currentEntry.gpa) {
        currentEntry.gpa = gpaMatch[1]
      }
      linesSinceEntry++
    }
    // Detect dates
    else if (currentEntry && line.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4}|Expected)/i)) {
      const dates = extractDates(line)
      if (!currentEntry.startDate) {
        currentEntry.startDate = dates.start
        currentEntry.endDate = dates.end
      }
      linesSinceEntry++
    } else if (currentEntry) {
      linesSinceEntry++
    }
  }

  // Save last entry
  if (currentEntry && currentEntry.institution) {
    education.push(currentEntry as EducationEntry)
  }

  return education
}

/**
 * Extract date range from text
 */
function extractDates(text: string): { start: string; end: string } {
  const datePattern =
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s*(\d{4})/gi

  const matches = Array.from(text.matchAll(datePattern))

  if (matches.length >= 2) {
    return {
      start: matches[0][0],
      end: matches[1][0],
    }
  } else if (matches.length === 1) {
    const present = text.match(/present|current|now/i)
    return {
      start: matches[0][0],
      end: present ? "Present" : matches[0][0],
    }
  }

  // Fallback to year-only pattern
  const yearPattern = /(\d{4})/g
  const years = Array.from(text.matchAll(yearPattern))

  if (years.length >= 2) {
    return {
      start: years[0][0],
      end: years[1][0],
    }
  } else if (years.length === 1) {
    const present = text.match(/present|current|now/i)
    return {
      start: years[0][0],
      end: present ? "Present" : years[0][0],
    }
  }

  return { start: "", end: "" }
}

/**
 * Extract skills from text
 */
export function extractSkillsFromText(text: string): string[] {
  const skills: string[] = []
  const lines = text.split("\n")

  let inSkillsSection = false

  for (const line of lines) {
    const lowerLine = line.toLowerCase()

    // Detect skills section
    if (lowerLine.includes("skills") || lowerLine.includes("technologies")) {
      inSkillsSection = true
      continue
    }

    // Stop at next section
    if (
      inSkillsSection &&
      (lowerLine.includes("experience") ||
        lowerLine.includes("education") ||
        lowerLine.includes("projects"))
    ) {
      break
    }

    if (inSkillsSection && line.trim()) {
      // Split by common delimiters
      const items = line.split(/[,|•\-*;]/).map((s) => s.trim()).filter((s) => s.length > 0)
      skills.push(...items)
    }
  }

  return skills
}

/**
 * Extract projects from text
 */
export function extractProjects(text: string): ProjectEntry[] {
  const projects: ProjectEntry[] = []
  const lines = text.split("\n")

  let inProjectsSection = false
  let currentProject: Partial<ProjectEntry> | null = null
  let bullets: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    const lowerLine = line.toLowerCase()

    // Detect projects section
    if (lowerLine.includes("projects") || lowerLine.includes("portfolio") || lowerLine.includes("activities")) {
      inProjectsSection = true
      continue
    }

    // Stop at next section
    if (
      inProjectsSection &&
      (lowerLine.includes("experience") ||
        lowerLine.includes("education") ||
        lowerLine.includes("skills") ||
        lowerLine.includes("certifications"))
    ) {
      // Save last project
      if (currentProject && currentProject.name) {
        projects.push({
          name: currentProject.name,
          description: currentProject.description || "",
          technologies: currentProject.technologies || [],
          link: currentProject.link,
          bullets: bullets,
        })
      }
      break
    }

    if (!inProjectsSection || !line) continue

    // Detect project name (not a bullet, reasonable length, might have date at end)
    // Format: "Project Name    Date" or just "Project Name"
    if (!line.match(/^[•●\-*]/) && line.length > 5 && line.length < 150) {
      // Check if this looks like a project title (not a description/bullet)
      const hasDate = line.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4})$/i)
      const startsWithAction = line.match(/^(Developed|Built|Created|Implemented|Designed|Fine-tuned|Used|Integrated|Collected)/i)

      // If it starts with an action verb, it's probably a bullet, not a title
      if (startsWithAction) {
        if (currentProject) {
          bullets.push(line)
        }
        continue
      }

      // This is likely a project title
      // Save previous project
      if (currentProject && currentProject.name) {
        projects.push({
          name: currentProject.name,
          description: currentProject.description || "",
          technologies: currentProject.technologies || [],
          link: currentProject.link,
          bullets: bullets,
        })
      }

      // Extract project name and date if present
      let projectName = line
      if (hasDate) {
        projectName = line.replace(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4})$/i, "").trim()
      }

      currentProject = {
        name: projectName,
        description: "",
        technologies: [],
        bullets: [],
      }
      bullets = []
    }
    // Detect bullet points
    else if (line.match(/^[•●\-*▪︎◦○■□☐☑✓✔➢➣⦿⦾]/)) {
      const bullet = line.replace(/^[•●\-*▪︎◦○■□☐☑✓✔➢➣⦿⦾]\s*/, "").trim()
      if (bullet && bullet.length > 3) {
        bullets.push(bullet)
      }
    }
    // Lines starting with action verbs (even without bullets)
    else if (
      currentProject &&
      line.match(/^(Developed|Built|Created|Implemented|Designed|Integrated|Deployed|Launched|Published|Wrote|Enhanced|Optimized|Configured|Added|Removed|Fixed|Updated|Refactored|Tested|Documented|Researched|Analyzed|Utilized|Leveraged|Fine-tuned|Used|Collected|Generated)/i)
    ) {
      bullets.push(line)
    }
  }

  // Save last project
  if (currentProject && currentProject.name) {
    projects.push({
      name: currentProject.name,
      description: currentProject.description || "",
      technologies: currentProject.technologies || [],
      link: currentProject.link,
      bullets: bullets,
    })
  }

  return projects
}

/**
 * Main parsing function
 */
export function parseResumeEnhanced(text: string): ParsedResume {
  const parsed: ParsedResume = {
    contact: extractContactInfo(text),
    experience: extractExperience(text),
    education: extractEducation(text),
    skills: {
      languages: [],
      frameworks: [],
      tools: [],
      databases: [],
    },
    projects: extractProjects(text),
    certifications: [],
  }

  // Validate structure with Zod (helps catch parser issues)
  try {
    const { validatePartialResumeData } = require('../schemas/resume-schema')
    const validation = validatePartialResumeData(parsed)

    if (!validation.success) {
      console.warn('Fallback parser validation warnings:', validation.errors)
      // Continue with parsed data even if validation fails
    }
  } catch (error) {
    // If validation fails, just log and continue
    console.warn('Could not validate fallback parser output:', error)
  }

  return parsed
}
