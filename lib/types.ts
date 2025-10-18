export interface ResumeDocument {
  _id?: string;
  userId: string;
  originalFileName: string;
  extractedText: string;
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
