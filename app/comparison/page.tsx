"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ResumeComparison from "@/components/resume-comparison"
import DownloadOptions from "@/components/download-options"
import { Eye, Download, ArrowLeft, ChevronLeft, RefreshCw } from "lucide-react"
import { ResumeDocument } from "@/lib/types"

export default function ComparisonPage() {
  const searchParams = useSearchParams()
  const resumeId = searchParams.get('resumeId')
  
  const [activeTab, setActiveTab] = useState("comparison")
  const [resume, setResume] = useState<ResumeDocument | null>(null)
  const [isLoading, setIsLoading] = useState(true)
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

  const handleDownload = async (format: "pdf" | "docx" | "txt") => {
    if (!resumeId) return

    try {
      if (format === "pdf") {
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
      } else {
        // For other formats, you could implement additional endpoints
        console.log(`Downloading resume as ${format}`)
      }
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

  if (error || !resume || !resume.processedResume) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || "Resume not found or not processed"}</p>
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

  // Prepare data for comparison
  const originalResume = {
    title: "Original Resume",
    content: resume.extractedText,
    highlights: ["Raw extracted text", "Unprocessed content"],
  }

  const tailoredResume = {
    title: "AI-Optimized Resume",
    content: resume.processedResume.sections
      .map(section => `${section.title}\n${section.content}`)
      .join('\n\n'),
    highlights: [
      "AI-optimized content",
      "Relevance-scored sections",
      "Professional formatting",
      "ATS-friendly structure",
    ],
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Back button */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          href={`/preview?resumeId=${resumeId}`}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass dark:glass-dark text-slate-900 dark:text-white hover:glass-hover transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <section className="min-h-screen py-20 px-4 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Your Tailored Resume</h1>
            <p className="text-slate-600 dark:text-slate-300">
              See how we've optimized your resume for your target role
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="comparison" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Side-by-Side Comparison
              </TabsTrigger>
              <TabsTrigger value="download" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </TabsTrigger>
            </TabsList>

            <TabsContent value="comparison" className="space-y-6">
              <ResumeComparison original={originalResume} tailored={tailoredResume} />

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h3 className="font-semibold text-green-900 dark:text-green-300 mb-3">Key Improvements Made:</h3>
                <ul className="space-y-2 text-sm text-green-800 dark:text-green-400">
                  <li>✓ Added quantifiable metrics and impact numbers to all achievements</li>
                  <li>✓ Incorporated target role keywords (React, Node.js, AWS, Docker, Kubernetes)</li>
                  <li>✓ Restructured experience descriptions with strong action verbs</li>
                  <li>✓ Added dedicated technical skills section for ATS optimization</li>
                  <li>✓ Enhanced professional summary to highlight relevant expertise</li>
                  <li>✓ Improved formatting for better readability and ATS compatibility</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Link
                  href={`/preview?resumeId=${resumeId}`}
                  className="flex-1 px-6 py-3 glass dark:glass-dark text-slate-900 dark:text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Details
                </Link>
                <button
                  onClick={() => setActiveTab("download")}
                  className="flex-1 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Resume
                </button>
              </div>
            </TabsContent>

            <TabsContent value="download">
              <DownloadOptions
                resumeContent={tailoredResume.content}
                fileName="tailored-resume"
                onDownload={handleDownload}
              />

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setActiveTab("comparison")}
                  className="flex-1 px-6 py-3 glass dark:glass-dark text-slate-900 dark:text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Back to Comparison
                </button>
                <Link
                  href="/"
                  className="flex-1 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 text-center"
                >
                  Process Another Resume
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  )
}
