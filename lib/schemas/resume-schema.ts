/**
 * Resume Data Schemas - Aligned with Python Backend
 *
 * These schemas match EXACTLY with Backend_Modified/models.py
 * to ensure perfect compatibility between frontend and backend.
 *
 * IMPORTANT: Any changes here MUST be reflected in Python models.py
 */

import { z } from 'zod'

// ============================================================================
// Basic Info Schema (matches Python BasicInfo)
// ============================================================================

export const BasicInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email format"),
  linkedin: z.string().min(1, "LinkedIn is required"),
  github: z.string().min(1, "GitHub is required"),
  website: z.string().nullable().optional(),
})

export type BasicInfo = z.infer<typeof BasicInfoSchema>

// ============================================================================
// Education Item Schema (matches Python EducationItem)
// ============================================================================

export const EducationItemSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, "Institution is required"),
  location: z.string().min(1, "Location is required"),
  degree: z.string().min(1, "Degree is required"),
  minor: z.string().nullable().optional(),
  startDate: z.string(), // ISO format or "YYYY-MM"
  endDate: z.string().nullable().optional(),
  isPresent: z.boolean(),
})

export type EducationItem = z.infer<typeof EducationItemSchema>

// ============================================================================
// Experience Item Schema (matches Python ExperienceItem)
// ============================================================================

export const ExperienceItemSchema = z.object({
  id: z.string(),
  organization: z.string().min(1, "Organization is required"), // NOT "company"!
  jobTitle: z.string().min(1, "Job title is required"), // NOT "title"!
  location: z.string().min(1, "Location is required"),
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  isPresent: z.boolean(),
  description: z.array(z.string()), // Bullet points
})

export type ExperienceItem = z.infer<typeof ExperienceItemSchema>

// ============================================================================
// Project Item Schema (matches Python ProjectItem)
// ============================================================================

export const ProjectItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Project name is required"),
  technologies: z.string(), // String, NOT array! "React, Node.js, MongoDB"
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  isPresent: z.boolean(),
  description: z.array(z.string()), // Bullet points
})

export type ProjectItem = z.infer<typeof ProjectItemSchema>

// ============================================================================
// Skills Schema (matches Python Skills)
// ============================================================================

export const SkillsSchema = z.object({
  languages: z.string(), // String, NOT array! "Python, JavaScript, Java"
  frameworks: z.string(), // "React, Django, Flask"
  developerTools: z.string(), // "Git, Docker, AWS"
  libraries: z.string(), // "NumPy, Pandas, TensorFlow"
})

export type Skills = z.infer<typeof SkillsSchema>

// ============================================================================
// Complete Resume Data Schema (matches Python ResumeData)
// ============================================================================

export const ResumeDataSchema = z.object({
  basicInfo: BasicInfoSchema,
  education: z.array(EducationItemSchema).min(1, "At least one education entry required"),
  experience: z.array(ExperienceItemSchema),
  projects: z.array(ProjectItemSchema),
  skills: SkillsSchema,
})

export type ResumeData = z.infer<typeof ResumeDataSchema>

// ============================================================================
// Partial Schema for Incremental Parsing
// ============================================================================

export const PartialResumeDataSchema = ResumeDataSchema.partial({
  education: true,
  experience: true,
  projects: true,
  skills: true,
}).extend({
  basicInfo: BasicInfoSchema.partial(),
})

export type PartialResumeData = z.infer<typeof PartialResumeDataSchema>

// ============================================================================
// Validation Helper Functions
// ============================================================================

/**
 * Validates complete resume data before sending to Python backend.
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
    basicInfo: {
      fullName: partial.basicInfo?.fullName || 'Unknown',
      phone: partial.basicInfo?.phone || '',
      email: partial.basicInfo?.email || '',
      linkedin: partial.basicInfo?.linkedin || '',
      github: partial.basicInfo?.github || '',
      website: partial.basicInfo?.website || null,
    },
    education: partial.education || [],
    experience: partial.experience || [],
    projects: partial.projects || [],
    skills: partial.skills || {
      languages: '',
      frameworks: '',
      developerTools: '',
      libraries: '',
    },
  }
}

// ============================================================================
// Type Guards
// ============================================================================

export function isValidResumeData(data: unknown): data is ResumeData {
  return ResumeDataSchema.safeParse(data).success
}

export function isValidBasicInfo(data: unknown): data is BasicInfo {
  return BasicInfoSchema.safeParse(data).success
}

export function isValidEducationItem(data: unknown): data is EducationItem {
  return EducationItemSchema.safeParse(data).success
}

export function isValidExperienceItem(data: unknown): data is ExperienceItem {
  return ExperienceItemSchema.safeParse(data).success
}

export function isValidProjectItem(data: unknown): data is ProjectItem {
  return ProjectItemSchema.safeParse(data).success
}

export function isValidSkills(data: unknown): data is Skills {
  return SkillsSchema.safeParse(data).success
}
