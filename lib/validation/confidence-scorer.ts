/**
 * Confidence Scoring System for Resume Data Quality
 *
 * Scores extracted resume data on a 0-100 scale across different sections
 * to provide quality metrics and identify areas needing improvement.
 */

import type { Contact, Experience, Education, Skills, Project } from "../schemas/resume-schema"

export interface FieldConfidence {
  field: string
  score: number // 0-100
  reason: string
  issues: string[]
}

export interface ResumeConfidence {
  overall: number // 0-100 (weighted average)
  sections: {
    contact: FieldConfidence
    experience: FieldConfidence
    education: FieldConfidence
    skills: FieldConfidence
    projects: FieldConfidence
  }
  suggestions: string[]
  level: "excellent" | "good" | "fair" | "poor" // Based on overall score
}

/**
 * Score contact information section (20% weight in overall)
 */
export function scoreContactSection(contact: Contact): FieldConfidence {
  let score = 0
  const issues: string[] = []

  // Name (40 points) - CRITICAL
  if (contact.name && contact.name.trim().length > 0 && contact.name !== "Your Name") {
    score += 40
  } else {
    issues.push("Missing or invalid name")
  }

  // Email (20 points) - CRITICAL
  if (contact.email && contact.email.includes("@")) {
    score += 20
  } else {
    issues.push("Missing or invalid email address")
  }

  // Phone (15 points)
  if (contact.phone && contact.phone.length >= 10) {
    score += 15
  } else {
    issues.push("Missing phone number")
  }

  // LinkedIn or GitHub (15 points)
  if (contact.linkedin || contact.github) {
    score += 15
    if (contact.linkedin && contact.github) {
      score += 5 // Bonus for both
    }
  } else {
    issues.push("Missing LinkedIn/GitHub profile")
  }

  // Location (10 points)
  if (contact.location && contact.location.length > 0) {
    score += 10
  }

  const reason = score >= 90 ? "Complete contact information" :
                 score >= 70 ? "Most contact details present" :
                 score >= 50 ? "Basic contact info provided" :
                 "Critical contact information missing"

  return {
    field: "contact",
    score: Math.min(score, 100),
    reason,
    issues
  }
}

/**
 * Score experience section (30% weight in overall)
 */
export function scoreExperienceSection(experience: Experience[]): FieldConfidence {
  let score = 0
  const issues: string[] = []

  // At least 1 experience entry (30 points)
  if (experience.length === 0) {
    issues.push("No work experience entries found")
    return {
      field: "experience",
      score: 0,
      reason: "No work experience provided",
      issues
    }
  }
  score += 30

  // Quality of experience entries
  let totalBullets = 0
  let entriesWithDates = 0
  let entriesWithLocation = 0

  experience.forEach((exp, idx) => {
    // Check bullets (up to 40 points total)
    if (exp.bullets && exp.bullets.length > 0) {
      totalBullets += exp.bullets.length
      if (exp.bullets.length >= 3) {
        score += 5 // Good detail
      } else if (exp.bullets.length >= 1) {
        score += 2 // Some detail
      }
    } else {
      issues.push(`Experience entry ${idx + 1} (${exp.company || 'Unknown'}) has no bullet points`)
    }

    // Check dates
    if (exp.startDate && exp.endDate) {
      entriesWithDates++
    }

    // Check location
    if (exp.location) {
      entriesWithLocation++
    }
  })

  // Cap bullets score at 40
  score = Math.min(score, 70) // 30 base + 40 max for bullets

  // Date ranges (10 points)
  if (entriesWithDates === experience.length) {
    score += 10
  } else if (entriesWithDates > 0) {
    score += 5
    issues.push("Some experience entries missing dates")
  } else {
    issues.push("All experience entries missing dates")
  }

  // Locations (10 points)
  if (entriesWithLocation === experience.length) {
    score += 10
  } else if (entriesWithLocation > 0) {
    score += 5
  }

  // Bonus for multiple experiences (10 points)
  if (experience.length >= 3) {
    score += 10
  } else if (experience.length >= 2) {
    score += 5
  }

  const avgBulletsPerJob = totalBullets / experience.length

  const reason = score >= 90 ? "Detailed work experience with comprehensive bullet points" :
                 score >= 70 ? "Good work experience section" :
                 score >= 50 ? "Work experience needs more detail" :
                 "Work experience section is incomplete"

  return {
    field: "experience",
    score: Math.min(score, 100),
    reason,
    issues
  }
}

/**
 * Score education section (20% weight in overall)
 */
export function scoreEducationSection(education: Education[]): FieldConfidence {
  let score = 0
  const issues: string[] = []

  // At least 1 education entry (50 points)
  if (education.length === 0) {
    issues.push("No education entries found")
    return {
      field: "education",
      score: 0,
      reason: "No education information provided",
      issues
    }
  }
  score += 50

  const firstEntry = education[0]

  // Has degree field (20 points)
  if (firstEntry.degree && firstEntry.degree.length > 0) {
    score += 20
  } else {
    issues.push("Degree information missing")
  }

  // Has field of study (10 points)
  if (firstEntry.field && firstEntry.field.length > 0) {
    score += 10
  }

  // Has GPA (10 points)
  if (firstEntry.gpa) {
    score += 10
  }

  // Has location (10 points)
  if (firstEntry.location && firstEntry.location.length > 0) {
    score += 10
  }

  const reason = score >= 90 ? "Complete education details" :
                 score >= 70 ? "Good education information" :
                 score >= 50 ? "Basic education provided" :
                 "Education details incomplete"

  return {
    field: "education",
    score: Math.min(score, 100),
    reason,
    issues
  }
}

/**
 * Score skills section (15% weight in overall)
 */
export function scoreSkillsSection(skills: Skills): FieldConfidence {
  let score = 0
  const issues: string[] = []

  // Count total skills
  const languagesCount = skills.languages?.length || 0
  const frameworksCount = skills.frameworks?.length || 0
  const toolsCount = skills.tools?.length || 0
  const databasesCount = skills.databases?.length || 0

  const totalSkills = languagesCount + frameworksCount + toolsCount + databasesCount

  if (totalSkills === 0) {
    issues.push("No technical skills listed")
    return {
      field: "skills",
      score: 0,
      reason: "No skills provided",
      issues
    }
  }

  // Languages (25 points)
  if (languagesCount >= 3) {
    score += 25
  } else if (languagesCount >= 2) {
    score += 15
  } else if (languagesCount >= 1) {
    score += 10
  } else {
    issues.push("No programming languages listed")
  }

  // Frameworks (25 points)
  if (frameworksCount >= 3) {
    score += 25
  } else if (frameworksCount >= 2) {
    score += 15
  } else if (frameworksCount >= 1) {
    score += 10
  } else {
    issues.push("No frameworks listed")
  }

  // Tools (25 points)
  if (toolsCount >= 3) {
    score += 25
  } else if (toolsCount >= 2) {
    score += 15
  } else if (toolsCount >= 1) {
    score += 10
  } else {
    issues.push("No tools listed")
  }

  // Databases (25 points)
  if (databasesCount >= 2) {
    score += 25
  } else if (databasesCount >= 1) {
    score += 15
  }

  const reason = score >= 90 ? "Comprehensive technical skills across all categories" :
                 score >= 70 ? "Good range of technical skills" :
                 score >= 50 ? "Basic technical skills listed" :
                 "Technical skills section needs expansion"

  return {
    field: "skills",
    score: Math.min(score, 100),
    reason,
    issues
  }
}

/**
 * Score projects section (15% weight in overall)
 */
export function scoreProjectsSection(projects: Project[]): FieldConfidence {
  let score = 0
  const issues: string[] = []

  // At least 1 project (40 points)
  if (projects.length === 0) {
    issues.push("No projects listed")
    return {
      field: "projects",
      score: 0,
      reason: "No projects provided",
      issues
    }
  }
  score += 40

  // Quality of projects
  let projectsWithBullets = 0
  let projectsWithTech = 0

  projects.forEach((proj, idx) => {
    // Has bullets (up to 30 points)
    if (proj.bullets && proj.bullets.length >= 2) {
      projectsWithBullets++
      score += 10
    } else if (proj.bullets && proj.bullets.length >= 1) {
      score += 5
    } else {
      issues.push(`Project ${idx + 1} (${proj.name}) has no description bullets`)
    }

    // Has technologies (30 points total)
    if (proj.technologies && proj.technologies.length > 0) {
      projectsWithTech++
    }
  })

  // Cap bullets score
  score = Math.min(score, 70) // 40 base + 30 max for bullets

  // Technologies specified
  if (projectsWithTech === projects.length) {
    score += 30
  } else if (projectsWithTech > 0) {
    score += 15
    issues.push("Some projects missing technology details")
  } else {
    issues.push("No technologies listed for projects")
  }

  const reason = score >= 90 ? "Well-documented projects with clear descriptions" :
                 score >= 70 ? "Good project portfolio" :
                 score >= 50 ? "Projects need more detail" :
                 "Project section needs improvement"

  return {
    field: "projects",
    score: Math.min(score, 100),
    reason,
    issues
  }
}

/**
 * Calculate overall confidence score with weighted average
 */
export function calculateOverallConfidence(
  contact: FieldConfidence,
  experience: FieldConfidence,
  education: FieldConfidence,
  skills: FieldConfidence,
  projects: FieldConfidence
): number {
  const weights = {
    contact: 0.20,    // 20%
    experience: 0.30, // 30%
    education: 0.20,  // 20%
    skills: 0.15,     // 15%
    projects: 0.15    // 15%
  }

  const overall =
    contact.score * weights.contact +
    experience.score * weights.experience +
    education.score * weights.education +
    skills.score * weights.skills +
    projects.score * weights.projects

  return Math.round(overall)
}

/**
 * Generate actionable suggestions based on confidence scores
 */
export function generateSuggestions(
  contact: FieldConfidence,
  experience: FieldConfidence,
  education: FieldConfidence,
  skills: FieldConfidence,
  projects: FieldConfidence,
  overall: number
): string[] {
  const suggestions: string[] = []

  // Critical issues
  if (contact.score < 60) {
    suggestions.push("⚠️ CRITICAL: Ensure your name and email are clearly visible at the top of your resume")
  }

  if (experience.score === 0) {
    suggestions.push("⚠️ Add work experience section with job titles, companies, and accomplishments")
  }

  // Contact improvements
  if (contact.issues.length > 0 && contact.score >= 60) {
    if (!contact.issues.some(i => i.includes("name")) && !contact.issues.some(i => i.includes("email"))) {
      suggestions.push("Consider adding LinkedIn or GitHub profile links to your contact information")
    }
  }

  // Experience improvements
  if (experience.score > 0 && experience.score < 80) {
    if (experience.issues.some(i => i.includes("bullet points"))) {
      suggestions.push("Add 3-5 bullet points for each job describing your achievements and impact")
    }
    if (experience.issues.some(i => i.includes("dates"))) {
      suggestions.push("Include start and end dates for all work experiences")
    }
  }

  // Education improvements
  if (education.score > 0 && education.score < 80) {
    if (education.issues.some(i => i.includes("Degree"))) {
      suggestions.push("Specify your degree name (e.g., Bachelor of Science, Master's in Computer Science)")
    }
    if (education.issues.some(i => i.includes("GPA"))) {
      suggestions.push("Consider adding your GPA if it's above 3.5")
    }
  }

  // Skills improvements
  if (skills.score < 70) {
    suggestions.push("Expand your technical skills section with more languages, frameworks, and tools")
    if (skills.issues.some(i => i.includes("programming languages"))) {
      suggestions.push("List all programming languages you're proficient in (e.g., Python, JavaScript, Java)")
    }
  }

  // Projects improvements
  if (projects.score > 0 && projects.score < 70) {
    if (projects.issues.some(i => i.includes("description"))) {
      suggestions.push("Add 2-3 bullet points for each project explaining what you built and the impact")
    }
    if (projects.issues.some(i => i.includes("technology"))) {
      suggestions.push("List the technologies used for each project (e.g., React, Node.js, PostgreSQL)")
    }
  }

  // Overall suggestions
  if (overall < 75) {
    suggestions.push("💡 Pro tip: Use action verbs and quantify your achievements (e.g., 'Increased performance by 40%')")
  }

  if (suggestions.length === 0) {
    suggestions.push("✨ Your resume looks great! All sections are complete and well-detailed.")
  }

  return suggestions
}

/**
 * Score complete resume data and return confidence report
 */
export function scoreResume(resumeData: any): ResumeConfidence {
  // Score individual sections
  const contactScore = scoreContactSection(resumeData.contact || {})
  const experienceScore = scoreExperienceSection(resumeData.experience || [])
  const educationScore = scoreEducationSection(resumeData.education || [])
  const skillsScore = scoreSkillsSection(resumeData.skills || {})
  const projectsScore = scoreProjectsSection(resumeData.projects || [])

  // Calculate overall weighted score
  const overall = calculateOverallConfidence(
    contactScore,
    experienceScore,
    educationScore,
    skillsScore,
    projectsScore
  )

  // Generate suggestions
  const suggestions = generateSuggestions(
    contactScore,
    experienceScore,
    educationScore,
    skillsScore,
    projectsScore,
    overall
  )

  // Determine level
  const level = overall >= 90 ? "excellent" :
                overall >= 75 ? "good" :
                overall >= 60 ? "fair" :
                "poor"

  return {
    overall,
    sections: {
      contact: contactScore,
      experience: experienceScore,
      education: educationScore,
      skills: skillsScore,
      projects: projectsScore
    },
    suggestions,
    level
  }
}
