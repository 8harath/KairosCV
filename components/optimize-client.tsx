"use client"

import { useEffect, useState } from "react"
import { ArrowRight, ChevronDown, ChevronUp, Loader2, X } from "lucide-react"
import FileUploader from "@/components/file-uploader"
import ProgressTracker from "@/components/progress-tracker"
import ResultsPanel from "@/components/results-panel"
import { useResumeOptimizer } from "@/hooks/use-resume-optimizer"
import { toast } from "@/hooks/use-toast"

// ---------------------------------------------------------------------------
// TemplateThumbnail — tiny CSS-drawn resume preview for the template picker
// ---------------------------------------------------------------------------
function TemplateThumbnail({ variant }: { variant: "professional" | "modern" | "classic" }) {
  const accentColor =
    variant === "modern" ? "#2563eb" : variant === "classic" ? "#000" : "#000"
  const headingFont =
    variant === "professional" ? "Georgia, serif" : variant === "modern" ? "Arial, sans-serif" : "Georgia, serif"
  const isModern = variant === "modern"
  const isClassic = variant === "classic"

  return (
    <div
      aria-hidden
      style={{
        width: "100%",
        aspectRatio: "8.5 / 11",
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 2,
        padding: "6% 7%",
        overflow: "hidden",
        fontFamily: headingFont,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* Name block */}
      <div style={{ textAlign: isModern ? "left" : "center" }}>
        <div style={{
          height: 5,
          background: "#1a1a1a",
          borderRadius: 1,
          width: isModern ? "70%" : "60%",
          margin: isModern ? undefined : "0 auto",
        }} />
        {isModern && (
          <div style={{ height: 1.5, background: accentColor, marginTop: 3, width: "100%" }} />
        )}
        {isClassic && (
          <div style={{ height: 1, background: "#000", marginTop: 2, width: "80%", margin: "2px auto 0" }} />
        )}
        <div style={{ height: 2.5, background: "#ccc", borderRadius: 1, width: "50%", marginTop: 3, ...(isModern ? {} : { margin: "3px auto 0" }) }} />
      </div>

      {/* Sections */}
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ marginTop: 4 }}>
          <div style={{
            height: 2.5,
            background: isModern ? accentColor : "#1a1a1a",
            borderRadius: 1,
            width: "35%",
            marginBottom: 2,
          }} />
          {isClassic && (
            <div style={{ height: 0.5, background: "#000", marginBottom: 2 }} />
          )}
          {[0, 1, 2].map((j) => (
            <div key={j} style={{
              height: 1.5,
              background: "#e5e7eb",
              borderRadius: 1,
              width: `${68 - j * 12}%`,
              marginBottom: 1.5,
            }} />
          ))}
        </div>
      ))}
    </div>
  )
}

interface OptimizeClientProps {
  authBypassed: boolean
}

export default function OptimizeClient({ authBypassed }: OptimizeClientProps) {
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [showJD, setShowJD] = useState(true)
  const [templateId, setTemplateId] = useState("professional")
  const [format, setFormat] = useState<"letter" | "a4">("letter")
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { progress, stage, message, downloadUrl, error, isProcessing, fileId, confidence, elapsed, startProcessing, cleanup } = useResumeOptimizer()

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

    setPdfUrl(null)
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      if (jobDescription.trim()) {
        formData.append("jobDescription", jobDescription.trim())
      }
      if (templateId !== "professional") {
        formData.append("templateId", templateId)
      }
      if (format !== "letter") {
        formData.append("format", format)
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

        <div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowJD(!showJD)}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {showJD ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              Paste a job description to tailor your resume
              <span className="ml-1 rounded bg-primary/10 px-1.5 py-0.5 text-xs font-semibold text-primary">Recommended</span>
            </button>
          </div>
          {showJD && (
            <div className="mt-2">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value.slice(0, 2000))}
                placeholder="Paste the job description here. We'll tailor your resume bullets and keywords to match the role."
                rows={5}
                maxLength={2000}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-y"
              />
              <p className="mt-1 text-right text-xs text-muted-foreground tabular-nums">
                {jobDescription.length} / 2000
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Template</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "professional", name: "Professional", desc: "LaTeX serif", thumbnail: "professional" },
              { id: "modern",       name: "Modern",       desc: "Sans-serif",  thumbnail: "modern" },
              { id: "classic",      name: "Classic",      desc: "Traditional", thumbnail: "classic" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplateId(t.id)}
                className={`rounded-md border p-2 text-left transition-colors ${
                  templateId === t.id
                    ? "border-foreground bg-muted"
                    : "border-border hover:border-foreground/40"
                }`}
              >
                {/* Mini CSS resume thumbnail */}
                <TemplateThumbnail variant={t.thumbnail as "professional" | "modern" | "classic"} />
                <p className="mt-1.5 text-xs font-medium text-foreground">{t.name}</p>
                <p className="text-[10px] text-muted-foreground">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Paper size</label>
          <div className="flex gap-2">
            {([
              { id: "letter", label: "Letter", sub: "8.5 × 11 in (US)" },
              { id: "a4",     label: "A4",     sub: "210 × 297 mm (Intl)" },
            ] as const).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFormat(f.id)}
                className={`flex-1 rounded-md border px-3 py-2 text-left transition-colors ${
                  format === f.id
                    ? "border-foreground bg-muted"
                    : "border-border hover:border-foreground/40"
                }`}
              >
                <p className="text-sm font-medium text-foreground">{f.label}</p>
                <p className="text-xs text-muted-foreground">{f.sub}</p>
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
    return <ProgressTracker progress={progress} stage={stage} message={message} elapsed={elapsed} />
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

  return (
    <ResultsPanel
      pdfUrl={pdfUrl}
      downloadUrl={downloadUrl}
      fileId={fileId}
      onReset={handleReset}
      confidence={confidence}
      jobDescription={jobDescription || null}
    />
  )
}
