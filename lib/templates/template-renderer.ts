import fs from "fs-extra"
import path from "path"
import type { ParsedResume, ExperienceEntry, EducationEntry, ProjectEntry } from "../parsers/enhanced-parser"
import { isValidResumeData } from "@/lib/schemas/resume-schema"

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
  if (!entry || !entry.bullets) {
    return ''
  }

  const bullets = entry.bullets
    .filter(b => b && typeof b === 'string')
    .map((bullet) => `    <div class="bullet">${escapeHtml(bullet)}</div>`)
    .join("\n")

  const dateStr = [escapeHtml(entry.startDate), escapeHtml(entry.endDate)].filter(Boolean).join(" – ")

  return `  <div class="entry">
    <div class="entry-header">
      <span class="entry-title">${escapeHtml(entry.title)}</span>
      ${dateStr ? `<span class="entry-date">${dateStr}</span>` : ""}
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
 * Generate award entry HTML
 */
function generateAwardHTML(award: {name: string; issuer?: string; date?: string; description?: string}): string {
  return `  <div class="bullet">${escapeHtml(award.name)}${award.issuer ? ` - ${escapeHtml(award.issuer)}` : ""}${award.date ? ` (${escapeHtml(award.date)})` : ""}${award.description ? ` - ${escapeHtml(award.description)}` : ""}</div>`
}

/**
 * Generate publication entry HTML
 */
function generatePublicationHTML(pub: {title: string; authors?: string[]; venue?: string; date?: string; url?: string}): string {
  const authors = pub.authors && pub.authors.length > 0 ? pub.authors.join(", ") : ""
  return `  <div class="bullet">${escapeHtml(pub.title)}${authors ? ` - ${escapeHtml(authors)}` : ""}${pub.venue ? ` - ${escapeHtml(pub.venue)}` : ""}${pub.date ? ` (${escapeHtml(pub.date)})` : ""}</div>`
}

/**
 * Generate volunteer entry HTML (similar to experience)
 */
function generateVolunteerHTML(vol: {organization: string; role: string; location?: string; startDate?: string; endDate?: string; bullets: string[]}): string {
  if (!vol || !vol.bullets) {
    return ''
  }

  const bullets = vol.bullets
    .filter(b => b && typeof b === 'string')
    .map((bullet) => `    <div class="bullet">${escapeHtml(bullet)}</div>`)
    .join("\n")

  return `  <div class="entry">
    <div class="entry-header">
      <span class="entry-title">${escapeHtml(vol.role)}</span>
      ${vol.startDate && vol.endDate ? `<span class="entry-date">${escapeHtml(vol.startDate)} – ${escapeHtml(vol.endDate)}</span>` : ""}
    </div>
    <div class="entry-subtitle">
      <span class="entry-company">${escapeHtml(vol.organization)}</span>
      ${vol.location ? `<span class="entry-location">${escapeHtml(vol.location)}</span>` : ""}
    </div>
    <div class="bullets">
${bullets}
    </div>
  </div>`
}

/**
 * Generate custom section HTML
 */
function generateCustomSectionHTML(section: {heading: string; content: string[]}): string {
  if (!section || !section.content || !Array.isArray(section.content)) {
    return ''
  }

  const content = section.content
    .filter(line => line && typeof line === 'string')
    .map((line) => `  <div class="bullet">${escapeHtml(line)}</div>`)
    .join("\n")

  if (!content) {
    return ''
  }

  return `<div class="section">
  <div class="section-title">${escapeHtml(section.heading)}</div>
${content}
</div>`
}

/**
 * Generate education entry HTML — Jake's format
 */
function generateEducationHTML(entry: EducationEntry): string {
  if (!entry) {
    return ''
  }

  const degree = entry.degree && entry.field
    ? `${entry.degree} in ${entry.field}`
    : entry.degree || entry.field || "Degree"

  // Build extra details line (GPA, honors, coursework) — Jake's style keeps it compact
  const details: string[] = []
  if (entry.gpa) details.push(`GPA: ${entry.gpa}`)
  if (entry.honors && entry.honors.length > 0) details.push(entry.honors.join(", "))
  const coursework = (entry as any).relevantCoursework as string[] | undefined
  if (coursework && coursework.length > 0) {
    details.push(`Coursework: ${coursework.join(", ")}`)
  }

  const eduDateStr = [escapeHtml(entry.startDate), escapeHtml(entry.endDate)].filter(Boolean).join(" – ")

  return `  <div class="entry">
    <div class="entry-header">
      <span class="entry-title">${escapeHtml(entry.institution)}</span>
      ${eduDateStr ? `<span class="entry-date">${eduDateStr}</span>` : ""}
    </div>
    <div class="entry-subtitle">
      <span class="entry-company">${escapeHtml(degree)}</span>
      ${entry.location ? `<span class="entry-location">${escapeHtml(entry.location)}</span>` : ""}
    </div>
    ${details.length > 0 ? `<div class="bullets"><div class="bullet">${escapeHtml(details.join(" | "))}</div></div>` : ""}
  </div>`
}

/**
 * Generate project entry HTML — Jake's format: Name | Tech Stack on one line
 */
function generateProjectHTML(entry: ProjectEntry): string {
  if (!entry || !entry.bullets) {
    return ''
  }

  const bullets = entry.bullets
    .filter(b => b && typeof b === 'string')
    .map((bullet) => `    <div class="bullet">${escapeHtml(bullet)}</div>`)
    .join("\n")

  const techStack = entry.technologies && entry.technologies.length > 0
    ? entry.technologies.filter(t => t).map(escapeHtml).join(", ")
    : ""

  const links: string[] = []
  if (entry.github) {
    const githubUrl = /^https?:\/\//i.test(entry.github) ? entry.github : `https://${entry.github}`
    links.push(`<a href="${escapeHtml(githubUrl)}">GitHub</a>`)
  }

  const dateStr = entry.startDate && entry.endDate
    ? `${escapeHtml(entry.startDate)} – ${escapeHtml(entry.endDate)}`
    : entry.startDate ? escapeHtml(entry.startDate) : ""

  return `  <div class="entry">
    <div class="project-header">
      <span class="project-title-line"><span class="project-name">${escapeHtml(entry.name)}</span>${techStack ? ` <span class="project-tech">| ${techStack}</span>` : ""}</span>
      ${dateStr ? `<span class="project-date">${dateStr}</span>` : ""}${links.length > 0 ? `<span class="project-links">${links.join(" ")}</span>` : ""}
    </div>
    <div class="bullets">
${bullets}
    </div>
  </div>`
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string | undefined | null): string {
  if (!text || typeof text !== 'string') {
    return ''
  }
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
  }
  return text.replace(/[&<>"]/g, (m) => map[m])
}

export interface TemplateInfo {
  id: string
  name: string
  description: string
}

const TEMPLATES: TemplateInfo[] = [
  { id: "professional", name: "Professional", description: "LaTeX-inspired layout with serif font. Clean, traditional academic style." },
  { id: "modern", name: "Modern", description: "Clean sans-serif design with blue accents. Contemporary and minimal." },
  { id: "classic", name: "Classic", description: "Traditional serif layout with horizontal rules. Conservative and formal." },
]

const TEMPLATE_FILES: Record<string, string> = {
  professional: "jakes-resume-improved.html",
  modern: "modern.html",
  classic: "classic.html",
}

export function getAvailableTemplates(): TemplateInfo[] {
  return TEMPLATES
}

function resolveTemplateFile(templateId?: string | null): string {
  const file = TEMPLATE_FILES[templateId || "professional"] || TEMPLATE_FILES["professional"]
  return path.join(process.cwd(), "lib", "templates", file)
}

/**
 * Render resume template with parsed data
 */
export function renderJakesResume(parsedResume: ParsedResume, summary?: string, templateId?: string | null): string {
  // Fail-safe validation (last line of defense before rendering)
  try {
    const { isValidResumeData } = require('../schemas/resume-schema')
    if (!isValidResumeData(parsedResume)) {
      console.warn('⚠️  Invalid resume data passed to template renderer - continuing anyway')
    }
  } catch (error) {
    console.warn('Could not validate resume data in renderer:', error)
  }

  const templatePath = resolveTemplateFile(templateId)
  const renderer = new TemplateRenderer(templatePath)

  // Generate experience items
  const experienceHTML = (parsedResume.experience || [])
    .filter(exp => exp && exp.company && exp.title)
    .map(generateExperienceHTML)
    .filter(html => html.length > 0)
    .join("\n")

  // Generate education items
  const educationHTML = (parsedResume.education || [])
    .filter(edu => edu && edu.institution)
    .map(generateEducationHTML)
    .filter(html => html.length > 0)
    .join("\n")

  // Generate project items
  const projectHTML = (parsedResume.projects || [])
    .filter(proj => proj && proj.name)
    .map(generateProjectHTML)
    .filter(html => html.length > 0)
    .join("\n")

  // Prepare skills — merge sparse categories (<2 items) into "Other"
  const skills = parsedResume.skills || { languages: [], frameworks: [], tools: [], databases: [] }
  const skillCategories: { key: keyof typeof skills; items: string[] }[] = [
    { key: "languages",  items: (skills.languages  || []).filter(Boolean) },
    { key: "frameworks", items: (skills.frameworks || []).filter(Boolean) },
    { key: "tools",      items: (skills.tools      || []).filter(Boolean) },
    { key: "databases",  items: (skills.databases  || []).filter(Boolean) },
  ]
  const sparseItems: string[] = []
  const denseCategories: Record<string, string[]> = {}
  for (const cat of skillCategories) {
    if (cat.items.length >= 2) {
      denseCategories[cat.key] = cat.items
    } else if (cat.items.length === 1) {
      sparseItems.push(...cat.items)
    }
  }
  const hasSkills =
    Object.values(denseCategories).some(arr => arr.length > 0) || sparseItems.length > 0

  // Build contact line (avoid nested conditionals in template)
  const contact = parsedResume.contact || {}
  const contactParts: string[] = []
  if (contact.phone) contactParts.push(contact.phone)
  if (contact.email) contactParts.push(`<a href="mailto:${contact.email}">${contact.email}</a>`)
  if (contact.linkedin) {
    const linkedinUrl = /^https?:\/\//i.test(contact.linkedin) ? contact.linkedin : `https://${contact.linkedin}`
    contactParts.push(`<a href="${linkedinUrl}">LinkedIn</a>`)
  }
  if (contact.github) {
    const githubContactUrl = /^https?:\/\//i.test(contact.github) ? contact.github : `https://${contact.github}`
    contactParts.push(`<a href="${githubContactUrl}">GitHub</a>`)
  }
  if (contact.location) contactParts.push(contact.location)

  const contactLine = contactParts.join(' <span class="separator">|</span> ')

  // Format certifications as bullet points (handle both string and object formats)
  const certifications = parsedResume.certifications || []
  const certificationsHTML = certifications.length > 0
    ? certifications.filter(cert => cert).map(cert => {
        if (typeof cert === 'string') return `<div class="bullet">${escapeHtml(cert)}</div>`
        const c = cert as { name?: string; issuer?: string; date?: string }
        if (!c.name) return ''
        return `<div class="bullet">${escapeHtml(c.name)}${c.issuer ? ` - ${escapeHtml(c.issuer)}` : ''}${c.date ? ` (${escapeHtml(c.date)})` : ''}</div>`
      }).filter(h => h).join('\n')
    : ""

  // Generate new section HTMLs
  const awardsHTML = parsedResume.awards && parsedResume.awards.length > 0
    ? parsedResume.awards.filter(a => a && a.name).map(generateAwardHTML).join('\n')
    : ""

  const publicationsHTML = parsedResume.publications && parsedResume.publications.length > 0
    ? parsedResume.publications.filter(p => p && p.title).map(generatePublicationHTML).join('\n')
    : ""

  const languageProficiencyHTML = parsedResume.languageProficiency && parsedResume.languageProficiency.length > 0
    ? parsedResume.languageProficiency.filter(lang => lang && lang.language).map(lang =>
        `<div class="bullet">${escapeHtml(lang.language)}${lang.proficiency ? ` - ${escapeHtml(lang.proficiency)}` : ""}${lang.certification ? ` (${escapeHtml(lang.certification)})` : ""}</div>`
      ).join('\n')
    : ""

  const volunteerHTML = parsedResume.volunteer && parsedResume.volunteer.length > 0
    ? parsedResume.volunteer.filter(v => v && v.organization && v.role).map(generateVolunteerHTML).filter(html => html.length > 0).join('\n')
    : ""

  const hobbiesHTML = parsedResume.hobbies && parsedResume.hobbies.length > 0
    ? parsedResume.hobbies.filter(h => h && h.name).map(hobby =>
        `<div class="bullet">${escapeHtml(hobby.name)}${hobby.description ? ` - ${escapeHtml(hobby.description)}` : ""}</div>`
      ).join('\n')
    : ""

  const referencesHTML = parsedResume.references && parsedResume.references.length > 0
    ? parsedResume.references
        .filter(ref => ref && typeof ref === 'string')
        .map(ref => `<div class="bullet">${escapeHtml(ref)}</div>`).join('\n')
    : ""

  const customSectionsHTML = parsedResume.customSections && parsedResume.customSections.length > 0
    ? parsedResume.customSections.map(generateCustomSectionHTML).join('\n')
    : ""

  const data = {
    NAME: escapeHtml(parsedResume.contact?.name || "Your Name"),
    CONTACT_LINE: contactLine,
    EMAIL: parsedResume.contact?.email || "",
    PHONE: parsedResume.contact?.phone || "",
    LINKEDIN: parsedResume.contact?.linkedin || "",
    GITHUB: parsedResume.contact?.github || "",
    LOCATION: parsedResume.contact?.location || "",
    SUMMARY: summary || "",
    EXPERIENCE_ITEMS: experienceHTML || "",
    EDUCATION_ITEMS: educationHTML || "",
    PROJECT_ITEMS: projectHTML || "",
    HAS_SKILLS: hasSkills,
    LANGUAGES:  (denseCategories["languages"]  || []).join(", "),
    FRAMEWORKS: (denseCategories["frameworks"] || []).join(", "),
    TOOLS:      (denseCategories["tools"]      || []).join(", "),
    DATABASES:  (denseCategories["databases"]  || []).join(", "),
    OTHER_SKILLS: sparseItems.join(", "),
    CERTIFICATIONS: certificationsHTML,
    // New comprehensive sections
    AWARDS: awardsHTML,
    PUBLICATIONS: publicationsHTML,
    LANGUAGE_PROFICIENCY: languageProficiencyHTML,
    VOLUNTEER: volunteerHTML,
    HOBBIES: hobbiesHTML,
    REFERENCES: referencesHTML,
    CUSTOM_SECTIONS: customSectionsHTML,
  }

  let html = renderer.render(data)

  // Post-render cleanup: remove any section that has a heading but no actual content
  html = html.replace(/<div class="section">\s*<div class="section-title">[^<]*<\/div>\s*<\/div>/g, '')

  return html
}
