"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, Download, RefreshCw } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ExtractionPreview from "@/components/extraction-preview"
import JobDetailsForm, { type JobDetails } from "@/components/job-details-form"
import { Eye, FileText } from "lucide-react"
import { ResumeDocument, ProcessedResume } from "@/lib/types"

export default function PreviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const resumeId = searchParams.get('resumeId')
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null)
  const [resume, setResume] = useState<ResumeDocument | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResume = async () => {
      if (!resumeId) {
        setError("No resume ID provided")
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/resume?resumeId=${resumeId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch resume")
        }
        
        const data = await response.json()
        setResume(data.resume)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load resume")
      } finally {
        setIsLoading(false)
      }
    }

    fetchResume()
  }, [resumeId])

  const handleJobDetailsSubmit = async (details: JobDetails) => {
    setJobDetails(details)
    setIsGenerating(true)

    try {
      // Reprocess resume with job details
      const response = await fetch("/api/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeId: resumeId,
          jobDescription: `${details.title} at ${details.company}: ${details.description}`,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to reprocess resume")
      }

      const result = await response.json()
      setResume(prev => prev ? { ...prev, processedResume: result.processedResume } : null)
      
      setTimeout(() => {
        setIsGenerating(false)
        router.push(`/comparison?resumeId=${resumeId}`)
      }, 2000)
    } catch (error) {
      console.error("Reprocessing error:", error)
      setIsGenerating(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!resumeId) return

    try {
      const response = await fetch(`/api/generate-pdf?resumeId=${resumeId}`)
      if (!response.ok) {
        throw new Error("Failed to generate PDF")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${resume?.originalFileName.replace(/\.[^/.]+$/, "")}_optimized.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Download error:", error)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-slate-600 dark:text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-300">Loading resume...</p>
        </div>
      </main>
    )
  }

  if (error || !resume) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || "Resume not found"}</p>
          <Link
            href="/upload"
            className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            Upload New Resume
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Back button */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          href="/upload"
          className="flex items-center gap-2 px-4 py-2 rounded-full glass dark:glass-dark text-slate-900 dark:text-white hover:glass-hover transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <section className="min-h-screen py-20 px-4 pt-24">
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
                <Link
                  href="/upload"
                  className="flex-1 px-6 py-3 glass dark:glass-dark text-slate-900 dark:text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 text-center"
                >
                  Upload Different File
                </Link>
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
    </main>
  )
}
