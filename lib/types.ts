/**
 * Central type definitions for the KairosCV application
 *
 * This file contains all shared TypeScript interfaces and types used across the application.
 * Centralizing types ensures consistency and makes refactoring easier.
 */

// ============================================================================
// Contact Information
// ============================================================================

/**
 * Contact information for a resume
 */
export interface ContactInfo {
  name: string
  email: string
  phone: string
  linkedin: string
  github: string
  location: string
}

// ============================================================================
// Skills
// ============================================================================

/**
 * Categorized technical skills
 */
export interface SkillsCategories {
  languages: string[]
  frameworks: string[]
  tools: string[]
  databases: string[]
}

// ============================================================================
// Experience
// ============================================================================

/**
 * A single work experience entry
 */
export interface ExperienceEntry {
  title: string
  company: string
  startDate: string
  endDate: string
  location: string
  bullets: string[]
}

/**
 * Enhanced bullet point with original and AI-improved versions
 */
export interface EnhancedBulletPoint {
  original: string
  enhanced: string
}

// ============================================================================
// Education
// ============================================================================

/**
 * A single education entry
 */
export interface EducationEntry {
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa?: string
  location: string
}

// ============================================================================
// Projects
// ============================================================================

/**
 * A single project entry
 */
export interface ProjectEntry {
  name: string
  description: string
  technologies: string[]
  bullets: string[]
  url?: string
}

// ============================================================================
// Complete Resume Data
// ============================================================================

/**
 * Complete parsed resume structure
 */
export interface ParsedResume {
  contact: ContactInfo
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: SkillsCategories
  projects: ProjectEntry[]
  certifications: string[]
  summary?: string
}

/**
 * Basic resume data structure (legacy compatibility)
 */
export interface ResumeData {
  text: string
  sections: {
    [key: string]: string[]
  }
  skills: string[]
  experience: string[]
  education: string[]
}

// ============================================================================
// Processing & Progress
// ============================================================================

/**
 * Processing stage types
 */
export type ProcessingStage =
  | "idle"
  | "uploading"
  | "parsing"
  | "enhancing"
  | "generating"
  | "compiling"
  | "complete"
  | "error"

/**
 * Processing progress information
 */
export interface ProcessingProgress {
  stage: ProcessingStage
  progress: number
  message: string
}

// ============================================================================
// File Management
// ============================================================================

/**
 * File metadata
 */
export interface FileMetadata {
  fileId: string
  filename: string
  size: number
  type: string
  uploadedAt: Date
}

/**
 * Allowed file types for upload
 */
export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
] as const

/**
 * Allowed file extensions
 */
export const ALLOWED_FILE_EXTENSIONS = [".pdf", ".docx", ".txt"] as const

// ============================================================================
// API Responses
// ============================================================================

/**
 * Upload API response
 */
export interface UploadResponse {
  file_id: string
  filename: string
  size: number
  message: string
}

/**
 * Error response
 */
export interface ErrorResponse {
  detail: string
  status?: number
}

/**
 * WebSocket message types
 */
export interface WebSocketMessage {
  type: "progress" | "complete" | "error"
  data: ProcessingProgress | { download_url: string } | { error: string }
}

// ============================================================================
// PDF Generation Options
// ============================================================================

/**
 * PDF generation options for Puppeteer
 */
export interface PDFGenerationOptions {
  format?: "letter" | "a4"
  printBackground?: boolean
  margin?: {
    top?: string
    right?: string
    bottom?: string
    left?: string
  }
}
