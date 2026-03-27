"use client"

import { useEffect, useState } from "react"
import { Loader2, Mail } from "lucide-react"
import Header from "@/components/header"
import FileUploader from "@/components/file-uploader"
import ProgressTracker from "@/components/progress-tracker"
import ResultsPanel from "@/components/results-panel"
import { Input } from "@/components/ui/input"
import { useResumeOptimizer } from "@/hooks/use-resume-optimizer"
import { toast } from "@/hooks/use-toast"

export default function OptimizePage() {
  const [file, setFile] = useState<File | null>(null)
  const [email, setEmail] = useState("")
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const authBypassed = process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_DISABLE_AUTH === "true"
  const { progress, stage, message, downloadUrl, error, isProcessing, fileId, startProcessing, cleanup } = useResumeOptimizer()

  useEffect(() => {
    if (error) {
      toast({ title: "Processing error", description: error, variant: "destructive" })
      setIsUploading(false)
    }
  }, [error])

  useEffect(() => {
    if (downloadUrl && !isProcessing) {
      setPdfUrl(downloadUrl)
      setIsUploading(false)
    }
  }, [downloadUrl, isProcessing])

  // Clear uploading state once SSE stream starts
  useEffect(() => {
    if (isProcessing && stage) {
      setIsUploading(false)
    }
  }, [isProcessing, stage])

  const handleFileSelect = async (selectedFile: File | null) => {
    if (!selectedFile) {
      setFile(null)
      return
    }

    const typedEmail = email.trim().toLowerCase()
    if (typedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(typedEmail)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" })
      return
    }

    const normalizedEmail = typedEmail || `guest-${Date.now()}@kairoscv.local`
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ]
    const validExtensions = [".pdf", ".docx", ".txt"]
    const fileName = selectedFile.name.toLowerCase()
    const hasValidExtension = validExtensions.some((ext) => fileName.endsWith(ext))

    if (!validTypes.includes(selectedFile.type) && !hasValidExtension) {
      toast({ title: "Invalid file type", description: "Please upload a PDF, DOCX, or TXT file.", variant: "destructive" })
      return
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 5MB.", variant: "destructive" })
      return
    }

    setFile(selectedFile)
    setPdfUrl(null)
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("email", normalizedEmail)

      const uploadResponse = await fetch("/api/upload", { method: "POST", body: formData })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.detail || "Upload failed")
      }

      const uploadData = await uploadResponse.json()
      startProcessing(uploadData.file_id)

      const remainingTrials = uploadData?.trial?.remaining
      toast({
        title: "Processing started",
        description:
          typeof remainingTrials === "number"
            ? `${remainingTrials} generation(s) remaining in this window.`
            : "Your resume is being optimized.",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      toast({ title: "Upload failed", description: errorMessage, variant: "destructive" })
      setFile(null)
      setIsUploading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPdfUrl(null)
    setIsUploading(false)
    cleanup()
  }

  useEffect(() => {
    return () => { cleanup() }
  }, [cleanup])

  const showUploadForm = !isUploading && !isProcessing && !pdfUrl && !error

  return (
    <>
      <Header />
      <main className="page-shell">
        <section className="container py-10 md:py-14">
          <div className="mx-auto max-w-3xl">
            {showUploadForm ? (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground md:text-3xl">Optimize your resume</h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Upload a draft. We'll restructure, improve phrasing, and generate a clean PDF.
                  </p>
                </div>

                {!authBypassed ? (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                    />
                    <p className="mt-1.5 text-xs text-muted-foreground">Used for trial tracking. 3 free generations per 24 hours.</p>
                  </div>
                ) : null}

                <FileUploader onFileSelect={handleFileSelect} disabled={isProcessing || isUploading} />
              </div>
            ) : isUploading && !isProcessing ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="mt-4 text-sm font-medium text-foreground">Uploading your resume...</p>
                <p className="mt-1 text-xs text-muted-foreground">This usually takes a few seconds.</p>
              </div>
            ) : isProcessing ? (
              <ProgressTracker progress={progress} stage={stage} message={message} />
            ) : error ? (
              <div className="py-12 text-center">
                <h2 className="text-lg font-medium text-foreground">Something went wrong</h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{error}</p>
                <button onClick={handleReset} className="btn mt-6">
                  Try again
                </button>
              </div>
            ) : (
              <ResultsPanel pdfUrl={pdfUrl} downloadUrl={downloadUrl} fileId={fileId} onReset={handleReset} />
            )}
          </div>
        </section>
      </main>
    </>
  )
}
