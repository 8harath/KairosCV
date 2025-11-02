"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import FileUploader from "@/components/file-uploader"
import ProgressTracker from "@/components/progress-tracker"
import ResultsPanel from "@/components/results-panel"
import LoadingAnimation from "@/components/loading-animation"
import { useResumeOptimizer } from "@/hooks/use-resume-optimizer"
import { toast } from "@/hooks/use-toast"

export default function Home() {
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const { progress, stage, message, downloadUrl, error, isProcessing, startProcessing, cleanup } = useResumeOptimizer()

  // Display errors from processing
  useEffect(() => {
    if (error) {
      toast({
        title: "Processing error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error])

  // Update PDF URL when download URL is available
  useEffect(() => {
    if (downloadUrl && !isProcessing) {
      // Set PDF URL for preview when download is ready
      setPdfUrl(downloadUrl)
    }
  }, [downloadUrl, isProcessing])

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
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOCX, or TXT file.",
        variant: "destructive",
      })
      return
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB. Please choose a smaller file.",
        variant: "destructive",
      })
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

      // Start processing
      startProcessing(fileId)

      toast({
        title: "File uploaded",
        description: "Your resume is being processed...",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      console.error("[v0] Error:", errorMessage)
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      })
      setFile(null)
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
          {!isProcessing && !pdfUrl && !error ? (
            <FileUploader onFileSelect={handleFileSelect} disabled={isProcessing} />
          ) : isProcessing ? (
            <ProgressTracker progress={progress} stage={stage} message={message} />
          ) : error ? (
            <div className="text-center space-y-4">
              <p className="text-destructive">{error}</p>
              <button onClick={handleReset} className="btn">
                Try Again
              </button>
            </div>
          ) : (
            <ResultsPanel pdfUrl={pdfUrl} downloadUrl={downloadUrl} onReset={handleReset} />
          )}
        </section>
      </div>
    </main>
  )
}
