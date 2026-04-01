"use client"

import { useEffect, useState } from "react"
import { ArrowRight, ChevronDown, ChevronUp, Loader2, X } from "lucide-react"
import FileUploader from "@/components/file-uploader"
import ProgressTracker from "@/components/progress-tracker"
import ResultsPanel from "@/components/results-panel"
import { Input } from "@/components/ui/input"
import { useResumeOptimizer } from "@/hooks/use-resume-optimizer"
import { toast } from "@/hooks/use-toast"

interface OptimizeClientProps {
  authBypassed: boolean
}

export default function OptimizeClient({ authBypassed }: OptimizeClientProps) {
  const [file, setFile] = useState<File | null>(null)
  const [email, setEmail] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [showJD, setShowJD] = useState(false)
  const [templateId, setTemplateId] = useState("professional")
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
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

  useEffect(() => {
    if (isProcessing && stage) {
      setIsUploading(false)
    }
  }, [isProcessing, stage])

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) {
      setFile(null)
      return
    }

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
  }

  const handleOptimize = async () => {
    if (!file) return

    const typedEmail = email.trim().toLowerCase()
    if (!authBypassed && typedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(typedEmail)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" })
      return
    }

    const normalizedEmail = typedEmail || `guest-${Date.now()}@kairoscv.local`

    setPdfUrl(null)
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("email", normalizedEmail)
      if (jobDescription.trim()) {
        formData.append("jobDescription", jobDescription.trim())
      }
      if (templateId !== "professional") {
        formData.append("templateId", templateId)
      }

      const uploadResponse = await fetch("/api/upload", { method: "POST", body: formData })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.detail || errorData.error || "Upload failed")
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

  if (showUploadForm) {
    return (
      <div className="space-y-6">
        {!authBypassed ? (
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Email</label>
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

        <div>
          <button
            type="button"
            onClick={() => setShowJD(!showJD)}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {showJD ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            Paste a job description to tailor your resume (optional)
          </button>
          {showJD && (
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here. We'll tailor your resume to match the role's keywords and requirements."
              rows={5}
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-y"
            />
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Template</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "professional", name: "Professional", desc: "LaTeX-style serif" },
              { id: "modern", name: "Modern", desc: "Clean sans-serif" },
              { id: "classic", name: "Classic", desc: "Traditional formal" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplateId(t.id)}
                className={`rounded-md border px-3 py-2.5 text-left transition-colors ${
                  templateId === t.id
                    ? "border-foreground bg-muted"
                    : "border-border hover:border-foreground/40"
                }`}
              >
                <p className="text-sm font-medium text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <FileUploader onFileSelect={handleFileSelect} disabled={isProcessing || isUploading} />

        {file && (
          <div className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(0)} KB
                {jobDescription.trim() ? " · Job description attached" : ""}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4 shrink-0">
              <button
                onClick={() => setFile(null)}
                className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
              <button
                onClick={handleOptimize}
                className="btn inline-flex items-center gap-2"
              >
                Optimize
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (isUploading && !isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-sm font-medium text-foreground">Uploading your resume...</p>
        <p className="mt-1 text-xs text-muted-foreground">This usually takes a few seconds.</p>
      </div>
    )
  }

  if (isProcessing) {
    return <ProgressTracker progress={progress} stage={stage} message={message} />
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-lg font-medium text-foreground">Something went wrong</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{error}</p>
        <button onClick={handleReset} className="btn mt-6">Try again</button>
      </div>
    )
  }

  return <ResultsPanel pdfUrl={pdfUrl} downloadUrl={downloadUrl} fileId={fileId} onReset={handleReset} />
}
