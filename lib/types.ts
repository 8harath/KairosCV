export interface StructuredResumeData {
  name?: string;
  phone?: string;
  email?: string;
  location?: string;
  summary?: string;
  experience?: ExperienceItem[];
  education?: EducationItem[];
  skills?: string[];
  languages?: string[];
  certifications?: CertificationItem[];
  projects?: ProjectItem[];
  linkedIn?: string;
  portfolio?: string;
}

export interface ExperienceItem {
  title: string;
  company: string;
  duration: string;
  location?: string;
  description: string;
  achievements?: string[];
}

export interface EducationItem {
  degree: string;
  school: string;
  year: string;
  major?: string;
  gpa?: string;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  year: string;
  expiry?: string;
}

export interface ProjectItem {
  name: string;
  description: string;
  technologies?: string[];
  link?: string;
}

export interface ResumeDocument {
  _id?: string;
  userId: string;
  originalFileName: string;
  extractedText: string;
  structuredData?: StructuredResumeData;
  processedResume?: ProcessedResume;
  createdAt: Date;
  updatedAt: Date;
  status: 'uploaded' | 'processing' | 'completed' | 'error';
}

export interface ProcessedResume {
  sections: ResumeSection[];
  summary: string;
  optimized: boolean;
}

export interface ResumeSection {
  title: string;
  content: string;
  relevance: number;
}

export interface User {
  _id?: string;
  email: string;
  name: string;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface JobDetails {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  location?: string;
  salary?: string;
}
