"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import FileUploader from "@/components/file-uploader"
import ProgressTracker from "@/components/progress-tracker"
import ResultsPanel from "@/components/results-panel"
import LoadingAnimation from "@/components/loading-animation"
import { useResumeOptimizer } from "@/hooks/use-resume-optimizer"

export default function Home() {
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const { progress, stage, message, downloadUrl, error, isProcessing, startProcessing, cleanup } = useResumeOptimizer()

  useEffect(() => {
    // Show loading animation for 1.5 seconds on initial mount
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleFileSelect = async (selectedFile: File | null) => {
    if (!selectedFile) {
      setFile(null)
      return
    }

    // Validate file
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ]
    const validExtensions = [".pdf", ".docx", ".txt"]
    const fileName = selectedFile.name.toLowerCase()
    const hasValidExtension = validExtensions.some((ext) => fileName.endsWith(ext))

    if (!validTypes.includes(selectedFile.type) && !hasValidExtension) {
      return
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      return
    }

    setFile(selectedFile)
    setPdfUrl(null)

    try {
      // Upload file
      const formData = new FormData()
      formData.append("file", selectedFile)

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.detail || "Upload failed")
      }

      const uploadData = await uploadResponse.json()
      const fileId = uploadData.file_id

      // Start processing simulation
      startProcessing(fileId)

      // Simulate PDF availability after processing
      setTimeout(() => {
        setPdfUrl(`/placeholder.svg?height=800&width=600&query=resume`)
      }, 9000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      console.error("[v0] Error:", errorMessage)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPdfUrl(null)
    cleanup()
  }

  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  if (isInitialLoading) {
    return <LoadingAnimation />
  }

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      role="main"
      itemScope
      itemType="https://schema.org/WebApplication"
    >
      <Header />

      <div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
        <section aria-labelledby="upload-section">
          {!isProcessing && !pdfUrl ? (
            <FileUploader onFileSelect={handleFileSelect} disabled={isProcessing} />
          ) : isProcessing ? (
            <ProgressTracker progress={progress} stage={stage} message={message} />
          ) : (
            <ResultsPanel pdfUrl={pdfUrl} downloadUrl={downloadUrl} onReset={handleReset} />
          )}
        </section>
      </div>
    </main>
  )
}
