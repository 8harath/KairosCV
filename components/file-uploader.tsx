"use client"

import type React from "react"
import { useRef, useState } from "react"
import { CheckCircle2, Info, Upload } from "lucide-react"

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
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (!disabled) {
      const file = e.dataTransfer.files[0]
      if (file) {
        handleFile(file)
      }
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
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
    <div className="card">
      <div className="mb-6 border-b-2 border-primary pb-4">
        <h2>Upload Your Resume</h2>
        <p className="mt-2 text-sm text-muted-foreground">Supports PDF, DOCX, and TXT formats</p>
      </div>

      <div
        className={`upload-zone ${isDragging ? "dragging" : ""} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
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
          <div>
            <div className="mb-6 flex items-center justify-center gap-3">
              <div
                className="flex h-16 w-16 items-center justify-center border-2 border-success bg-white"
                style={{ boxShadow: "0 10px 22px rgba(0,0,0,0.08)" }}
              >
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
            </div>
            <h3 className="mb-3 text-xl font-black">{fileName}</h3>
            <div className="mb-4 inline-flex items-center gap-2 border border-success bg-success/10 px-4 py-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <p className="text-sm font-bold text-success">Ready to optimize</p>
            </div>
            {!disabled ? <p className="mt-4 text-xs text-muted-foreground">Click to select a different file</p> : null}
          </div>
        ) : (
          <div>
            <div className="upload-icon mx-auto mb-6 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center border-2 border-primary bg-white">
                <Upload className="h-9 w-9 stroke-[2.2]" />
              </div>
            </div>
            <h3 className="mb-3 text-lg font-bold">Drag & Drop Your Resume</h3>
            <p className="mb-6 text-sm text-muted-foreground">or click to browse your files</p>

            <div className="mb-6 flex flex-wrap justify-center gap-3">
              <span className="badge-neutral">PDF</span>
              <span className="badge-neutral">DOCX</span>
              <span className="badge-neutral">TXT</span>
            </div>

            <div className="mt-6 border-t-2 border-dashed border-gray-30 pt-6">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Info className="h-4 w-4" />
                <span>Maximum file size: 5MB</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
