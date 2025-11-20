"use client"

import type React from "react"
import { useState, useRef } from "react"
import { UploadIcon, CheckIcon } from "@/components/icons"

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
    const maxSize = 5 * 1024 * 1024

    if (!allowedTypes.includes(file.type)) {
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
      </div>

      <div
        className={`upload-zone ${isDragging ? "dragging" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload resume file"
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
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
          <div className="animate-in slide-in-from-bottom-3">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-success border-2 border-success flex items-center justify-center">
                <CheckIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="mb-2 font-black">{fileName}</h3>
            <p className="text-muted-foreground text-sm">File ready to process</p>
            {!disabled && (
              <p className="text-muted-foreground text-xs mt-2">Click to change file</p>
            )}
          </div>
        ) : (
          <>
            <div className="upload-icon mx-auto mb-6">
              <UploadIcon className="w-16 h-16 stroke-2" />
            </div>
            <h3 className="mb-3 font-bold">Drag & Drop Your Resume</h3>
            <p className="text-muted-foreground mb-4">or click to browse files</p>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
              <span className="badge-neutral">PDF</span>
              <span className="badge-neutral">DOCX</span>
              <span className="badge-neutral">TXT</span>
            </div>
            <p className="text-muted-foreground text-xs mt-4">Maximum file size: 5MB</p>
          </>
        )}
      </div>
    </div>
  )
}
