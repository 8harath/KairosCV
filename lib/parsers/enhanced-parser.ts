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

  // Extract name (usually the first line if it's short and capitalized)
  const firstLine = lines[0]?.trim() || ""
  const name = firstLine.length < 50 && firstLine.match(/^[A-Z][a-z]+\s+[A-Z][a-z]+/)
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
        lowerLine.includes("certifications"))
    ) {
      // Save last entry
      if (currentEntry && currentEntry.company) {
        experiences.push({
          company: currentEntry.company,
          title: currentEntry.title || "",
          location: currentEntry.location || "",
          startDate: currentEntry.startDate || "",
          endDate: currentEntry.endDate || "",
          bullets: bullets,
        })
      }
      break
    }

    if (!inExperienceSection || !line) continue

    // Detect job title and company (various formats)
    // Format 1: "Software Engineer | Google"
    // Format 2: "Software Engineer, Google"
    // Format 3: "Company Name" on one line, "Job Title" on next
    const jobCompanyMatch = line.match(/^(.+?)\s*[|,–-]\s*(.+?)(\s*[|,–-]\s*.+)?$/)

    if (jobCompanyMatch && !line.match(/^[•\-*]/)) {
      // Save previous entry
      if (currentEntry && currentEntry.company) {
        experiences.push({
          company: currentEntry.company,
          title: currentEntry.title || "",
          location: currentEntry.location || "",
          startDate: currentEntry.startDate || "",
          endDate: currentEntry.endDate || "",
          bullets: bullets,
        })
      }

      // Start new entry
      currentEntry = {
        title: jobCompanyMatch[1].trim(),
        company: jobCompanyMatch[2].trim(),
        location: "",
        startDate: "",
        endDate: "",
      }
      bullets = []

      // Check next line for dates
      const nextLine = lines[i + 1]?.trim() || ""
      const dateMatch = nextLine.match(
        /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|\d{1,2}\/\d{4}|\d{4})/i
      )
      if (dateMatch) {
        const dates = extractDates(nextLine)
        currentEntry.startDate = dates.start
        currentEntry.endDate = dates.end
        i++ // Skip next line
      }
    }
    // Detect dates on separate line
    else if (line.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{1,2}\/\d{4})/i)) {
      if (currentEntry) {
        const dates = extractDates(line)
        currentEntry.startDate = dates.start
        currentEntry.endDate = dates.end
      }
    }
    // Detect bullet points
    else if (line.match(/^[•\-*▪︎◦]/)) {
      const bullet = line.replace(/^[•\-*▪︎◦]\s*/, "").trim()
      if (bullet) bullets.push(bullet)
    }
    // Regular line that might be a bullet (indented or starts with action verb)
    else if (
      currentEntry &&
      line.length > 20 &&
      !line.match(/^[A-Z][a-z]+\s+\d{4}/)
    ) {
      bullets.push(line)
    }
  }

  // Save last entry
  if (currentEntry && currentEntry.company) {
    experiences.push({
      company: currentEntry.company,
      title: currentEntry.title || "",
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
        lowerLine.includes("certifications"))
    ) {
      // Save last entry
      if (currentEntry && currentEntry.institution) {
        education.push(currentEntry as EducationEntry)
      }
      break
    }

    if (!inEducationSection || !line) continue

    // Detect university/institution
    if (
      line.match(/university|college|institute|school/i) ||
      (line.length > 5 && line.length < 100 && !line.match(/^[•\-*]/))
    ) {
      // Save previous entry
      if (currentEntry && currentEntry.institution) {
        education.push(currentEntry as EducationEntry)
      }

      currentEntry = {
        institution: line,
        degree: "",
        field: "",
        location: "",
        startDate: "",
        endDate: "",
      }
    }
    // Detect degree
    else if (
      currentEntry &&
      line.match(/bachelor|master|phd|b\.s\.|m\.s\.|b\.a\.|m\.a\.|associate/i)
    ) {
      const degreeMatch = line.match(/(bachelor|master|phd|doctorate|b\.s\.|m\.s\.|b\.a\.|m\.a\.|associate)[\w\s.]*/i)
      currentEntry.degree = degreeMatch ? degreeMatch[0].trim() : line

      // Try to extract field
      const fieldMatch = line.match(/in\s+([A-Z][a-z\s]+)/i)
      if (fieldMatch) {
        currentEntry.field = fieldMatch[1].trim()
      }
    }
    // Detect GPA
    else if (currentEntry && line.match(/gpa|grade/i)) {
      const gpaMatch = line.match(/(\d\.\d+)/i)
      if (gpaMatch) {
        currentEntry.gpa = gpaMatch[1]
      }
    }
    // Detect dates
    else if (currentEntry && line.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4})/i)) {
      const dates = extractDates(line)
      currentEntry.startDate = dates.start
      currentEntry.endDate = dates.end
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

  for (const line of lines) {
    const lowerLine = line.toLowerCase()

    // Detect projects section
    if (lowerLine.includes("projects") || lowerLine.includes("portfolio")) {
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

    if (!inProjectsSection || !line.trim()) continue

    // Detect project name (bold or capitalized line)
    if (!line.match(/^[•\-*]/) && line.length < 100) {
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

      currentProject = {
        name: line.trim(),
        description: "",
        technologies: [],
        bullets: [],
      }
      bullets = []
    }
    // Detect bullet points
    else if (line.match(/^[•\-*]/)) {
      const bullet = line.replace(/^[•\-*]\s*/, "").trim()
      if (bullet) bullets.push(bullet)
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
  return {
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
}
