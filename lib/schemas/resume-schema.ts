import { z } from 'zod'

/**
 * Resume Data Schemas
 *
 * Type-safe schemas for resume data validation using Zod.
 * These schemas ensure data integrity throughout the parsing,
 * enhancement, and PDF generation pipeline.
 */

// ============================================================================
// Contact Information Schema
// ============================================================================

export const ContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().optional(),
  linkedin: z.string().optional(), // Can be URL or path like "linkedin.com/in/username"
  github: z.string().optional(), // Can be URL or path like "github.com/username"
  website: z.string().optional(), // Can be URL
  location: z.string().optional(),
})

export type Contact = z.infer<typeof ContactSchema>

// ============================================================================
// Experience Entry Schema
// ============================================================================

export const ExperienceSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  title: z.string().min(1, "Job title is required"),
  location: z.string().optional(),
  startDate: z.string(), // Format: "Jan 2020" or "January 2020"
  endDate: z.string().or(z.literal("Present")), // "Dec 2022" or "Present"
  bullets: z.array(z.string()).min(1, "At least one bullet point required"),
  isEnhanced: z.boolean().default(false), // Track if AI-enhanced
})

export type Experience = z.infer<typeof ExperienceSchema>

// ============================================================================
// Education Entry Schema
// ============================================================================

export const EducationSchema = z.object({
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().optional(), // e.g., "Computer Science"
  location: z.string().optional(),
  startDate: z.string().optional(), // "Aug 2020"
  endDate: z.string().optional(), // "May 2024" or "Expected May 2024"
  gpa: z.string().optional(), // "3.8/4.0" or "3.8"
  honors: z.array(z.string()).optional(), // Dean's List, Cum Laude, etc.
  relevantCoursework: z.array(z.string()).optional(),
})

export type Education = z.infer<typeof EducationSchema>

// ============================================================================
// Project Entry Schema
// ============================================================================

export const ProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Project description is required"),
  technologies: z.array(z.string()).min(1, "At least one technology required"),
  link: z.string().url("Invalid project URL").optional(),
  github: z.string().url("Invalid GitHub URL").optional(),
  bullets: z.array(z.string()).min(1, "At least one bullet point required"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export type Project = z.infer<typeof ProjectSchema>

// ============================================================================
// Skills Schema (Categorized)
// ============================================================================

export const SkillsSchema = z.object({
  languages: z.array(z.string()).default([]),
  frameworks: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
  databases: z.array(z.string()).default([]), // Made required with default empty array
  other: z.array(z.string()).optional(),
})

export type Skills = z.infer<typeof SkillsSchema>

// ============================================================================
// Certification Schema
// ============================================================================

export const CertificationSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuing organization is required"),
  date: z.string(), // "Jan 2023"
  expirationDate: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url("Invalid credential URL").optional(),
})

export type Certification = z.infer<typeof CertificationSchema>

// ============================================================================
// Award/Honor Schema
// ============================================================================

export const AwardSchema = z.object({
  name: z.string().min(1, "Award name is required"),
  issuer: z.string().optional(), // Organization that gave the award
  date: z.string().optional(), // "May 2023"
  description: z.string().optional(),
})

export type Award = z.infer<typeof AwardSchema>

// ============================================================================
// Publication Schema
// ============================================================================

export const PublicationSchema = z.object({
  title: z.string().min(1, "Publication title is required"),
  authors: z.array(z.string()).optional(), // Co-authors
  venue: z.string().optional(), // Conference/Journal name
  date: z.string().optional(),
  url: z.string().optional(), // Removed .url() validation for flexibility
  description: z.string().optional(),
})

export type Publication = z.infer<typeof PublicationSchema>

// ============================================================================
// Language Proficiency Schema (Spoken Languages)
// ============================================================================

export const LanguageProficiencySchema = z.object({
  language: z.string().min(1, "Language name is required"),
  proficiency: z.string().optional(), // "Native", "Fluent", "Professional", "Limited"
  certification: z.string().optional(), // e.g., "TOEFL 110/120"
})

export type LanguageProficiency = z.infer<typeof LanguageProficiencySchema>

// ============================================================================
// Volunteer Work Schema
// ============================================================================

export const VolunteerSchema = z.object({
  organization: z.string().min(1, "Organization is required"),
  role: z.string().min(1, "Role is required"),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  bullets: z.array(z.string()).min(1, "At least one bullet point required"),
})

export type Volunteer = z.infer<typeof VolunteerSchema>

// ============================================================================
// Hobby/Interest Schema
// ============================================================================

export const HobbySchema = z.object({
  name: z.string().min(1, "Hobby name is required"),
  description: z.string().optional(),
})

export type Hobby = z.infer<typeof HobbySchema>

// ============================================================================
// Custom Section Schema (Catch-all for unrecognized sections)
// ============================================================================

export const CustomSectionSchema = z.object({
  heading: z.string().min(1, "Section heading is required"),
  content: z.array(z.string()).min(1, "Section content is required"),
})

export type CustomSection = z.infer<typeof CustomSectionSchema>

// ============================================================================
// Complete Resume Schema
// ============================================================================

export const ResumeDataSchema = z.object({
  // Required sections
  contact: ContactSchema,

  // Core sections (may be empty but must be present)
  experience: z.array(ExperienceSchema).default([]),
  education: z.array(EducationSchema).default([]),
  skills: SkillsSchema.default({
    languages: [],
    frameworks: [],
    tools: [],
  }),

  // Optional standard sections
  summary: z.string().optional(),
  projects: z.array(ProjectSchema).optional(),
  certifications: z.array(CertificationSchema).optional(),

  // Optional additional sections (comprehensive coverage)
  awards: z.array(AwardSchema).optional(),
  publications: z.array(PublicationSchema).optional(),
  languageProficiency: z.array(LanguageProficiencySchema).optional(), // Spoken languages
  volunteer: z.array(VolunteerSchema).optional(),
  hobbies: z.array(HobbySchema).optional(),
  references: z.array(z.string()).optional(), // Simple string array like "Available upon request"

  // Catch-all for unrecognized sections (ZERO DATA LOSS)
  customSections: z.array(CustomSectionSchema).optional(),

  // Metadata (for tracking)
  rawText: z.string().optional(), // Original parsed text
  parseSource: z.enum(['pdf', 'docx', 'txt']).optional(),
  parsedAt: z.date().optional(),
  enhancedAt: z.date().optional(),
})

export type ResumeData = z.infer<typeof ResumeDataSchema>

// ============================================================================
// Partial Resume Schema (for incremental parsing)
// ============================================================================

/**
 * PartialResumeDataSchema allows incomplete resume data during parsing.
 * Use this during the parsing phase, then validate with full schema before PDF generation.
 */
export const PartialResumeDataSchema = z.object({
  contact: ContactSchema.partial(),
  experience: z.array(ExperienceSchema.partial()).optional(),
  education: z.array(EducationSchema.partial()).optional(),
  skills: SkillsSchema.partial().optional(),
  summary: z.string().optional(),
  projects: z.array(ProjectSchema.partial()).optional(),
  certifications: z.array(CertificationSchema.partial()).optional(),
  awards: z.array(AwardSchema.partial()).optional(),
  publications: z.array(PublicationSchema.partial()).optional(),
  languageProficiency: z.array(LanguageProficiencySchema.partial()).optional(),
  volunteer: z.array(VolunteerSchema.partial()).optional(),
  hobbies: z.array(HobbySchema.partial()).optional(),
  references: z.array(z.string()).optional(),
  customSections: z.array(CustomSectionSchema.partial()).optional(),
  rawText: z.string().optional(),
  parseSource: z.enum(['pdf', 'docx', 'txt']).optional(),
})

export type PartialResumeData = z.infer<typeof PartialResumeDataSchema>

// ============================================================================
// Validation Helper Functions
// ============================================================================

/**
 * Validates complete resume data before PDF generation.
 * Throws ZodError if validation fails with detailed error messages.
 */
export function validateResumeData(data: unknown): ResumeData {
  return ResumeDataSchema.parse(data)
}

/**
 * Safely validates resume data and returns result with error info.
 * Use this when you want to handle validation errors gracefully.
 */
export function safeValidateResumeData(data: unknown): {
  success: boolean
  data?: ResumeData
  errors?: string[]
} {
  const result = ResumeDataSchema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  } else {
    const errors = result.error.issues.map(
      issue => `${issue.path.join('.')}: ${issue.message}`
    )
    return { success: false, errors }
  }
}

/**
 * Validates partial resume data during parsing phase.
 * Returns validation result without throwing.
 */
export function validatePartialResumeData(data: unknown): {
  success: boolean
  data?: PartialResumeData
  errors?: string[]
} {
  const result = PartialResumeDataSchema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  } else {
    const errors = result.error.issues.map(
      issue => `${issue.path.join('.')}: ${issue.message}`
    )
    return { success: false, errors }
  }
}

/**
 * Fills in missing required fields with defaults to make partial data valid.
 * Use this to convert PartialResumeData to ResumeData.
 */
export function fillDefaults(partial: PartialResumeData): ResumeData {
  return {
    contact: {
      name: partial.contact?.name || 'Unknown',
      email: partial.contact?.email,
      phone: partial.contact?.phone,
      linkedin: partial.contact?.linkedin,
      github: partial.contact?.github,
      website: partial.contact?.website,
      location: partial.contact?.location,
    },
    experience: partial.experience?.map(exp => ({
      company: exp.company || 'Unknown Company',
      title: exp.title || 'Unknown Title',
      location: exp.location,
      startDate: exp.startDate || 'Unknown',
      endDate: exp.endDate || 'Unknown',
      bullets: exp.bullets || [],
      isEnhanced: exp.isEnhanced || false,
    })) || [],
    education: partial.education?.map(edu => ({
      institution: edu.institution || 'Unknown Institution',
      degree: edu.degree || 'Unknown Degree',
      field: edu.field,
      location: edu.location,
      startDate: edu.startDate,
      endDate: edu.endDate,
      gpa: edu.gpa,
      honors: edu.honors,
      relevantCoursework: edu.relevantCoursework,
    })) || [],
    skills: {
      languages: partial.skills?.languages || [],
      frameworks: partial.skills?.frameworks || [],
      tools: partial.skills?.tools || [],
      databases: partial.skills?.databases || [],
      other: partial.skills?.other,
    },
    summary: partial.summary,
    projects: partial.projects?.map(proj => ({
      name: proj.name || 'Unknown Project',
      description: proj.description || '',
      technologies: proj.technologies || [],
      link: proj.link,
      github: proj.github,
      bullets: proj.bullets || [],
      startDate: proj.startDate,
      endDate: proj.endDate,
    })),
    certifications: partial.certifications?.map(cert => ({
      name: cert.name || 'Unknown Certification',
      issuer: cert.issuer || 'Unknown Issuer',
      date: cert.date || 'Unknown',
      expirationDate: cert.expirationDate,
      credentialId: cert.credentialId,
      credentialUrl: cert.credentialUrl,
    })),
    // New sections
    awards: partial.awards?.map(award => ({
      name: award.name || 'Unknown Award',
      issuer: award.issuer,
      date: award.date,
      description: award.description,
    })),
    publications: partial.publications?.map(pub => ({
      title: pub.title || 'Unknown Publication',
      authors: pub.authors,
      venue: pub.venue,
      date: pub.date,
      url: pub.url,
      description: pub.description,
    })),
    languageProficiency: partial.languageProficiency?.map(lang => ({
      language: lang.language || 'Unknown Language',
      proficiency: lang.proficiency,
      certification: lang.certification,
    })),
    volunteer: partial.volunteer?.map(vol => ({
      organization: vol.organization || 'Unknown Organization',
      role: vol.role || 'Unknown Role',
      location: vol.location,
      startDate: vol.startDate,
      endDate: vol.endDate,
      bullets: vol.bullets || [],
    })),
    hobbies: partial.hobbies?.map(hobby => ({
      name: hobby.name || 'Unknown Hobby',
      description: hobby.description,
    })),
    references: partial.references,
    customSections: partial.customSections?.map(section => ({
      heading: section.heading || 'Untitled Section',
      content: section.content || [],
    })),
    rawText: partial.rawText,
    parseSource: partial.parseSource,
  }
}

// ============================================================================
// Type Guards
// ============================================================================

export function isValidResumeData(data: unknown): data is ResumeData {
  return ResumeDataSchema.safeParse(data).success
}

export function isValidContact(data: unknown): data is Contact {
  return ContactSchema.safeParse(data).success
}

export function isValidExperience(data: unknown): data is Experience {
  return ExperienceSchema.safeParse(data).success
}

export function isValidEducation(data: unknown): data is Education {
  return EducationSchema.safeParse(data).success
}

export function isValidProject(data: unknown): data is Project {
  return ProjectSchema.safeParse(data).success
}

export function isValidSkills(data: unknown): data is Skills {
  return SkillsSchema.safeParse(data).success
}
