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
   * Render template with data
   */
  render(data: Record<string, any>): string {
    let result = this.template

    // Replace all variables {{VAR}}
    result = result.replace(/\{\{([^#/}]+)\}\}/g, (match, key) => {
      const trimmedKey = key.trim()
      return data[trimmedKey] !== undefined ? String(data[trimmedKey]) : ""
    })

    // Handle {{#if CONDITION}}...{{/if}} blocks
    result = result.replace(/\{\{#if ([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, content) => {
      const trimmedCondition = condition.trim()
      return data[trimmedCondition] ? content : ""
    })

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
  const templatePath = path.join(__dirname, "jakes-resume.html")
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

  const data = {
    NAME: parsedResume.contact.name || "Your Name",
    EMAIL: parsedResume.contact.email,
    PHONE: parsedResume.contact.phone,
    LINKEDIN: parsedResume.contact.linkedin,
    GITHUB: parsedResume.contact.github,
    LOCATION: parsedResume.contact.location,
    SUMMARY: summary || "",
    EXPERIENCE_ITEMS: experienceHTML,
    EDUCATION_ITEMS: educationHTML,
    PROJECT_ITEMS: projectHTML,
    HAS_SKILLS: hasSkills,
    LANGUAGES: parsedResume.skills.languages.join(", "),
    FRAMEWORKS: parsedResume.skills.frameworks.join(", "),
    TOOLS: parsedResume.skills.tools.join(", "),
    DATABASES: parsedResume.skills.databases.join(", "),
    CERTIFICATIONS: parsedResume.certifications.join("\n"),
  }

  return renderer.render(data)
}
