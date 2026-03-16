"use client"

import { useEffect, useState } from "react"
import { Mail, Sparkles } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/Footer"
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
  const authBypassed = process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_DISABLE_AUTH === "true"
  const { progress, stage, message, downloadUrl, error, isProcessing, fileId, startProcessing, cleanup } = useResumeOptimizer()

  useEffect(() => {
    if (error) {
      toast({
        title: "Processing error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error])

  useEffect(() => {
    if (downloadUrl && !isProcessing) {
      setPdfUrl(downloadUrl)
    }
  }, [downloadUrl, isProcessing])

  const handleFileSelect = async (selectedFile: File | null) => {
    if (!selectedFile) {
      setFile(null)
      return
    }

    const typedEmail = email.trim().toLowerCase()
    if (typedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(typedEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
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
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("email", normalizedEmail)

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.detail || "Upload failed")
      }

      const uploadData = await uploadResponse.json()
      const uploadedFileId = uploadData.file_id

      startProcessing(uploadedFileId)

      const remainingTrials = uploadData?.trial?.remaining
      toast({
        title: "Resume uploaded",
        description:
          typeof remainingTrials === "number"
            ? `Processing started. ${remainingTrials} free trial(s) remaining in this 24-hour window.`
            : authBypassed
              ? "Processing started in local auth bypass mode."
              : "Processing started successfully.",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
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

  return (
    <>
      <Header />
      <main className="page-shell">
        <section className="container py-12 md:py-16">
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="section-frame p-6 md:p-8">
              <div className="section-header-kicker">Optimizer</div>
              <h1 className="mt-5 text-balance">Upload a draft and let KairosCV reshape it into a clearer, ATS-ready resume.</h1>
              <p className="mt-4 max-w-3xl text-base">
                The flow is intentionally simple: add your file, follow the progress states, review the preview, and download the final PDF. No noisy controls, no overexplained interface.
              </p>
            </div>

            {!isProcessing && !pdfUrl && !error ? (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                <div className="space-y-4">
                  {!authBypassed ? (
                    <label className="input-surface block">
                      <span className="field-label flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        Email for trial tracking
                      </span>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                        required
                      />
                      <p className="mt-3 text-sm text-muted-foreground">Each account gets 3 free resume generations in a 24-hour window.</p>
                    </label>
                  ) : null}
                  <FileUploader onFileSelect={handleFileSelect} disabled={isProcessing} />
                </div>

                <aside className="space-y-4">
                  <div className="surface-panel p-5">
                    <p className="text-sm font-medium text-foreground">What happens next</p>
                    <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                      <li>1. Resume content is parsed and normalized.</li>
                      <li>2. The model improves structure and phrasing.</li>
                      <li>3. A professional PDF is generated for download.</li>
                    </ul>
                  </div>
                  <div className="surface-panel p-5">
                    <div className="flex items-center gap-2 text-foreground">
                      <Sparkles className="h-4 w-4" />
                      <p className="text-sm font-medium">Supported inputs</p>
                    </div>
                    <p className="mt-3 text-sm">PDF, DOCX, and plain text up to 5MB.</p>
                  </div>
                </aside>
              </div>
            ) : isProcessing ? (
              <ProgressTracker progress={progress} stage={stage} message={message} />
            ) : error ? (
              <div className="empty-state">
                <h2 className="text-xl">Something interrupted processing</h2>
                <p className="mx-auto mt-3 max-w-md text-sm">{error}</p>
                <button onClick={handleReset} className="btn mt-6">
                  Try again
                </button>
              </div>
            ) : (
              <ResultsPanel pdfUrl={pdfUrl} downloadUrl={downloadUrl} fileId={fileId} onReset={handleReset} />
            )}
          </div>
        </section>
        <Footer />
      </main>
    </>
  )
}
