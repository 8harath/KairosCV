"use client"

import type React from "react"
import { useRef, useState } from "react"
import { CheckCircle2, UploadCloud } from "lucide-react"

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
    <div
      className={`upload-zone ${isDragging ? "dragging" : ""} ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
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
        <div className="mx-auto max-w-sm">
          <CheckCircle2 className="mx-auto h-8 w-8 text-success" />
          <p className="mt-3 text-sm font-medium text-foreground">{fileName}</p>
          <p className="mt-1 text-xs text-muted-foreground">Ready to process. Click to replace.</p>
        </div>
      ) : (
        <div className="mx-auto max-w-sm">
          <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium text-foreground">Drop your resume here</p>
          <p className="mt-1 text-xs text-muted-foreground">or click to browse. PDF, DOCX, TXT up to 5MB.</p>
        </div>
      )}
    </div>
  )
}
