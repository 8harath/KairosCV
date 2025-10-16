"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ExtractionPreview from "./extraction-preview"
import JobDetailsForm, { type JobDetails } from "./job-details-form"
import { Eye, FileText } from "lucide-react"

interface PreviewSectionProps {
  onStepChange: (step: "hero" | "upload" | "processing" | "preview" | "comparison") => void
  extractedData?: any
}

export default function PreviewSection({ onStepChange, extractedData }: PreviewSectionProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null)

  // Mock extracted data
  const mockExtractedData = extractedData || {
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    summary:
      "Experienced Full Stack Developer with 5+ years of expertise in building scalable web applications using React, Node.js, and cloud technologies.",
    experience: [
      {
        title: "Senior Software Engineer",
        company: "Tech Corp",
        duration: "2021 - Present",
        description: "Led development of microservices architecture serving 1M+ users. Mentored junior developers.",
      },
      {
        title: "Full Stack Developer",
        company: "StartUp Inc",
        duration: "2019 - 2021",
        description: "Built and maintained React applications with Node.js backends. Improved performance by 40%.",
      },
    ],
    skills: ["React", "Node.js", "TypeScript", "AWS", "Docker", "PostgreSQL", "GraphQL", "Git"],
    education: [
      {
        degree: "B.S. Computer Science",
        school: "State University",
        year: "2019",
      },
    ],
  }

  const handleJobDetailsSubmit = (details: JobDetails) => {
    setJobDetails(details)
    setIsGenerating(true)

    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false)
      onStepChange("comparison")
    }, 3000)
  }

  return (
    <section className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Review & Tailor</h1>
          <p className="text-slate-600 dark:text-slate-300">
            We've extracted your resume information. Now let's tailor it for your target role.
          </p>
        </div>

        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Extracted Data
            </TabsTrigger>
            <TabsTrigger value="tailor" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Job Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-6">
            <ExtractionPreview data={mockExtractedData} isLoading={false} />
            <div className="flex gap-4">
              <button
                onClick={() => onStepChange("upload")}
                className="flex-1 px-6 py-3 glass dark:glass-dark text-slate-900 dark:text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                Upload Different File
              </button>
              <button
                onClick={() => document.querySelector('[value="tailor"]')?.click()}
                className="flex-1 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                Continue to Job Details
              </button>
            </div>
          </TabsContent>

          <TabsContent value="tailor">
            <JobDetailsForm onSubmit={handleJobDetailsSubmit} isLoading={isGenerating} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
