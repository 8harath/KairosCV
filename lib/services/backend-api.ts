/**
 * Backend API Client
 *
 * Connects Next.js frontend to Python FastAPI backend
 * running on localhost:8080 (dev) or production URL
 */

interface BasicInfo {
  fullName: string
  phone: string
  email: string
  linkedin: string
  github: string
  website?: string | null
}

interface EducationItem {
  id: string
  institution: string
  location: string
  degree: string
  minor?: string | null
  startDate: string
  endDate?: string | null
  isPresent: boolean
}

interface ExperienceItem {
  id: string
  organization: string
  jobTitle: string
  location: string
  startDate: string
  endDate?: string | null
  isPresent: boolean
  description: string[]
}

interface ProjectItem {
  id: string
  name: string
  technologies: string
  startDate: string
  endDate?: string | null
  isPresent: boolean
  description: string[]
}

interface Skills {
  languages: string
  frameworks: string
  developerTools: string
  libraries: string
}

export interface ResumeData {
  basicInfo: BasicInfo
  education: EducationItem[]
  experience: ExperienceItem[]
  projects: ProjectItem[]
  skills: Skills
}

export interface PDFResponse {
  message: string
  resume_link: string
  pdf_filename: string
}

export interface HealthResponse {
  message: string
}

export class BackendAPIClient {
  private baseUrl: string

  constructor() {
    // Use environment variable or default to localhost:8080
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'
  }

  /**
   * Convert resume data to LaTeX PDF using Python backend
   */
  async convertResumeToLatex(data: ResumeData): Promise<PDFResponse> {
    const response = await fetch(`${this.baseUrl}/convert-json-to-latex`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }))
      throw new Error(errorData.detail || `Failed to convert resume: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Download PDF file from Python backend
   */
  async downloadPDF(filename: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/download/${filename}`)

    if (!response.ok) {
      throw new Error(`Failed to download PDF: ${response.statusText}`)
    }

    return response.blob()
  }

  /**
   * Health check for Python backend
   */
  async healthCheck(): Promise<HealthResponse> {
    const response = await fetch(`${this.baseUrl}/health`)

    if (!response.ok) {
      throw new Error(`Backend health check failed: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get the base URL of the backend
   */
  getBaseUrl(): string {
    return this.baseUrl
  }
}

// Export singleton instance
export const backendAPI = new BackendAPIClient()
