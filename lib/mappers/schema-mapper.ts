/**
 * Schema Mapper
 *
 * Transforms data between different schema formats
 * Ensures compatibility between frontend and Python backend schemas
 */

import { ResumeData } from '../services/backend-api'

/**
 * Transform any input data to match Python backend schema exactly
 *
 * Python backend expects (from Backend_Modified/models.py):
 * - basicInfo.fullName (not "name")
 * - experience[].organization (not "company")
 * - experience[].jobTitle (not "title")
 * - skills.languages as string (not array)
 * - technologies as string (not array)
 */
export function transformToBackendSchema(data: any): ResumeData {
  return {
    basicInfo: {
      fullName: data.basicInfo?.fullName || data.basicInfo?.name || '',
      phone: data.basicInfo?.phone || '',
      email: data.basicInfo?.email || '',
      linkedin: data.basicInfo?.linkedin || '',
      github: data.basicInfo?.github || '',
      website: data.basicInfo?.website || null,
    },
    education: (data.education || []).map((edu: any, index: number) => ({
      id: edu.id || `edu-${index}`,
      institution: edu.institution || '',
      location: edu.location || '',
      degree: edu.degree || '',
      minor: edu.minor || null,
      startDate: edu.startDate || '',
      endDate: edu.endDate || null,
      isPresent: edu.isPresent || false,
    })),
    experience: (data.experience || []).map((exp: any, index: number) => ({
      id: exp.id || `exp-${index}`,
      organization: exp.organization || exp.company || '',
      jobTitle: exp.jobTitle || exp.title || '',
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || null,
      isPresent: exp.isPresent || false,
      description: Array.isArray(exp.description) ? exp.description : [],
    })),
    projects: (data.projects || []).map((proj: any, index: number) => ({
      id: proj.id || `proj-${index}`,
      name: proj.name || '',
      technologies: Array.isArray(proj.technologies)
        ? proj.technologies.join(', ')
        : (proj.technologies || ''),
      startDate: proj.startDate || '',
      endDate: proj.endDate || null,
      isPresent: proj.isPresent || false,
      description: Array.isArray(proj.description) ? proj.description : [],
    })),
    skills: {
      languages: Array.isArray(data.skills?.languages)
        ? data.skills.languages.join(', ')
        : (data.skills?.languages || ''),
      frameworks: Array.isArray(data.skills?.frameworks)
        ? data.skills.frameworks.join(', ')
        : (data.skills?.frameworks || ''),
      developerTools: Array.isArray(data.skills?.developerTools)
        ? data.skills.developerTools.join(', ')
        : (data.skills?.developerTools || ''),
      libraries: Array.isArray(data.skills?.libraries)
        ? data.skills.libraries.join(', ')
        : (data.skills?.libraries || ''),
    },
  }
}

/**
 * Validate that data has all required fields for Python backend
 */
export function validateBackendData(data: ResumeData): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Required fields
  if (!data.basicInfo.fullName) errors.push('Full name is required')
  if (!data.basicInfo.phone) errors.push('Phone is required')
  if (!data.basicInfo.email) errors.push('Email is required')
  if (!data.basicInfo.linkedin) errors.push('LinkedIn is required')
  if (!data.basicInfo.github) errors.push('GitHub is required')

  // At least one education item
  if (!data.education || data.education.length === 0) {
    errors.push('At least one education entry is required')
  }

  // At least one experience item
  if (!data.experience || data.experience.length === 0) {
    errors.push('At least one experience entry is required')
  }

  // Skills required
  if (!data.skills?.languages) errors.push('Languages skill is required')

  return {
    valid: errors.length === 0,
    errors,
  }
}
