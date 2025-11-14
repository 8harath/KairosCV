import fs from "fs-extra"
import path from "path"
import type { ParsedResume, ExperienceEntry, EducationEntry, ProjectEntry } from "../parsers/enhanced-parser"

/**
 * Simple template renderer (Handlebars-like syntax)
 */
export class TemplateRenderer {
  private template: string

  constructor(templatePath: string) {
    this.template = fs.readFileSync(templatePath, "utf-8")
  }

  /**
   * Render template with data (handles nested conditionals)
   */
  render(data: Record<string, any>): string {
    let result = this.template

    // Process conditionals using a stack-based approach to handle nesting
    result = this.processConditionals(result, data)

    // Replace all variables {{VAR}} (after conditionals are processed)
    result = result.replace(/\{\{([^#/}]+)\}\}/g, (match, key) => {
      const trimmedKey = key.trim()
      const value = data[trimmedKey]

      // Check if value is truthy (not undefined, null, empty string, or false)
      if (value !== undefined && value !== null && value !== "") {
        return String(value)
      }
      return ""
    })

    return result
  }

  /**
   * Process conditional blocks recursively (innermost first)
   */
  private processConditionals(template: string, data: Record<string, any>): string {
    let result = template
    let changed = true
    let iterations = 0
    const maxIterations = 20 // Prevent infinite loops

    while (changed && iterations < maxIterations) {
      changed = false
      iterations++

      // Find innermost {{#if}}...{{/if}} blocks (those without nested {{#if}})
      const regex = /\{\{#if\s+([^}]+)\}\}((?:(?!\{\{#if)[^])*?)\{\{\/if\}\}/g

      result = result.replace(regex, (match, condition, content) => {
        changed = true
        const trimmedCondition = condition.trim()
        const value = data[trimmedCondition]

        // Check if condition is truthy
        // For strings, check if not empty
        // For booleans, check if true
        // For numbers, check if not 0
        // For arrays/objects, check if exists
        const shouldRender = value !== undefined &&
                            value !== null &&
                            value !== false &&
                            value !== "" &&
                            value !== 0

        return shouldRender ? content : ""
      })
    }

    return result
  }
}

/**
 * Generate experience entry HTML
 */
function generateExperienceHTML(entry: ExperienceEntry): string {
  const bullets = entry.bullets
    .map((bullet) => `    <div class="bullet">${escapeHtml(bullet)}</div>`)
    .join("\n")

  return `  <div class="entry">
    <div class="entry-header">
      <span class="entry-title">${escapeHtml(entry.title)}</span>
      <span class="entry-date">${escapeHtml(entry.startDate)} – ${escapeHtml(entry.endDate)}</span>
    </div>
    <div class="entry-subtitle">
      <span class="entry-company">${escapeHtml(entry.company)}</span>
      ${entry.location ? `<span class="entry-location">${escapeHtml(entry.location)}</span>` : ""}
    </div>
    <div class="bullets">
${bullets}
    </div>
  </div>`
}

/**
 * Generate education entry HTML
 */
function generateEducationHTML(entry: EducationEntry): string {
  const degree = entry.degree && entry.field
    ? `${entry.degree} in ${entry.field}`
    : entry.degree || entry.field || "Degree"

  return `  <div class="entry">
    <div class="entry-header">
      <span class="entry-title">${escapeHtml(entry.institution)}</span>
      <span class="entry-date">${escapeHtml(entry.startDate)} – ${escapeHtml(entry.endDate)}</span>
    </div>
    <div class="entry-subtitle">
      <span class="entry-company">${escapeHtml(degree)}</span>
      ${entry.location ? `<span class="entry-location">${escapeHtml(entry.location)}</span>` : ""}
    </div>
    ${entry.gpa ? `<div class="bullets"><div class="bullet">GPA: ${escapeHtml(entry.gpa)}</div></div>` : ""}
  </div>`
}

/**
 * Generate project entry HTML
 */
function generateProjectHTML(entry: ProjectEntry): string {
  const bullets = entry.bullets
    .map((bullet) => `    <div class="bullet">${escapeHtml(bullet)}</div>`)
    .join("\n")

  const techStack = entry.technologies.length > 0
    ? `<div class="bullet"><strong>Technologies:</strong> ${entry.technologies.map(escapeHtml).join(", ")}</div>`
    : ""

  return `  <div class="entry">
    <div class="entry-header">
      <span class="entry-title">${escapeHtml(entry.name)}</span>
    </div>
    ${entry.description ? `<div class="entry-subtitle"><span class="entry-company">${escapeHtml(entry.description)}</span></div>` : ""}
    <div class="bullets">
${bullets}
${techStack ? "    " + techStack : ""}
    </div>
  </div>`
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

/**
 * Render Jake's Resume template with parsed data
 */
export function renderJakesResume(parsedResume: ParsedResume, summary?: string): string {
  // Fail-safe validation (last line of defense before rendering)
  try {
    const { isValidResumeData } = require('../schemas/resume-schema')
    if (!isValidResumeData(parsedResume)) {
      console.warn('⚠️  Invalid resume data passed to template renderer - continuing anyway')
      // Don't throw - we want to render what we can
    }
  } catch (error) {
    // If validation import fails, just log and continue
    console.warn('Could not validate resume data in renderer:', error)
  }

  // Use process.cwd() to get the project root, then navigate to the improved template
  const templatePath = path.join(process.cwd(), "lib", "templates", "jakes-resume-improved.html")
  const renderer = new TemplateRenderer(templatePath)

  // Generate experience items
  const experienceHTML = parsedResume.experience.map(generateExperienceHTML).join("\n")

  // Generate education items
  const educationHTML = parsedResume.education.map(generateEducationHTML).join("\n")

  // Generate project items
  const projectHTML = parsedResume.projects.map(generateProjectHTML).join("\n")

  // Prepare skills
  const hasSkills =
    parsedResume.skills.languages.length > 0 ||
    parsedResume.skills.frameworks.length > 0 ||
    parsedResume.skills.tools.length > 0 ||
    parsedResume.skills.databases.length > 0

  // Build contact line (avoid nested conditionals in template)
  const contactParts: string[] = []
  if (parsedResume.contact.phone) contactParts.push(parsedResume.contact.phone)
  if (parsedResume.contact.email) contactParts.push(`<a href="mailto:${parsedResume.contact.email}">${parsedResume.contact.email}</a>`)
  if (parsedResume.contact.linkedin) contactParts.push(`<a href="https://${parsedResume.contact.linkedin}">LinkedIn</a>`)
  if (parsedResume.contact.github) contactParts.push(`<a href="https://${parsedResume.contact.github}">GitHub</a>`)
  if (parsedResume.contact.location) contactParts.push(parsedResume.contact.location)

  const contactLine = contactParts.join(' <span class="separator">|</span> ')

  // Format certifications as bullet points
  const certificationsHTML = parsedResume.certifications.length > 0
    ? parsedResume.certifications.map(cert => `<div class="bullet">${escapeHtml(cert)}</div>`).join('\n')
    : ""

  const data = {
    NAME: parsedResume.contact.name || "Your Name",
    CONTACT_LINE: contactLine,
    EMAIL: parsedResume.contact.email || "",
    PHONE: parsedResume.contact.phone || "",
    LINKEDIN: parsedResume.contact.linkedin || "",
    GITHUB: parsedResume.contact.github || "",
    LOCATION: parsedResume.contact.location || "",
    SUMMARY: summary || "",
    EXPERIENCE_ITEMS: experienceHTML || "",
    EDUCATION_ITEMS: educationHTML || "",
    PROJECT_ITEMS: projectHTML || "",
    HAS_SKILLS: hasSkills,
    LANGUAGES: parsedResume.skills.languages.join(", "),
    FRAMEWORKS: parsedResume.skills.frameworks.join(", "),
    TOOLS: parsedResume.skills.tools.join(", "),
    DATABASES: parsedResume.skills.databases.join(", "),
    CERTIFICATIONS: certificationsHTML,
  }

  return renderer.render(data)
}
