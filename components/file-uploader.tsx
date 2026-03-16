"use client"

import type React from "react"
import { useRef, useState } from "react"
import { CheckCircle2, FileText, Info, UploadCloud } from "lucide-react"

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void
  disabled: boolean
}

export default function FileUploader({ onFileSelect, disabled }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (!disabled) {
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleFile = (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ]
    const validExtensions = [".pdf", ".docx", ".txt"]
    const lowerName = file.name.toLowerCase()
    const hasValidExtension = validExtensions.some((extension) => lowerName.endsWith(extension))
    const maxSize = 5 * 1024 * 1024

    if (!allowedTypes.includes(file.type) && !hasValidExtension) {
      alert("Invalid file type. Please upload PDF, DOCX, or TXT.")
      return
    }

    if (file.size > maxSize) {
      alert("File too large. Maximum size is 5MB.")
      return
    }

    setFileName(file.name)
    onFileSelect(file)
  }

  return (
    <div className="surface-panel-strong p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-foreground">Resume upload</p>
          <p className="mt-2 text-sm">Drop in your current draft and KairosCV will handle extraction, cleanup, and formatting.</p>
        </div>
        <div className="pill-badge">PDF, DOCX, TXT</div>
      </div>

      <div
        className={`upload-zone mt-6 ${isDragging ? "dragging" : ""} ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload resume file"
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault()
            fileInputRef.current?.click()
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileInput}
          className="sr-only"
          disabled={disabled}
          aria-label="Choose file"
        />

        {fileName ? (
          <div className="mx-auto max-w-md">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-card">
              <CheckCircle2 className="h-7 w-7 text-success" />
            </div>
            <h2 className="mt-5 text-xl">{fileName}</h2>
            <p className="mt-2 text-sm">Your file is ready to process.</p>
            {!disabled ? <p className="mt-4 text-sm text-muted-foreground">Click to replace it with a different file.</p> : null}
          </div>
        ) : (
          <div className="mx-auto max-w-md">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-card">
              <UploadCloud className="h-7 w-7 text-foreground" />
            </div>
            <h2 className="mt-5 text-xl">Drop your resume here</h2>
            <p className="mt-2 text-sm">Or click to browse files from your device.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <span className="pill-badge"><FileText className="h-3.5 w-3.5" /> PDF</span>
              <span className="pill-badge"><FileText className="h-3.5 w-3.5" /> DOCX</span>
              <span className="pill-badge"><FileText className="h-3.5 w-3.5" /> TXT</span>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              Maximum file size: 5MB
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
