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
    <div className="card animate-in fade-in">
      <div className="mb-6 border-b-2 border-primary pb-4">
        <h2>Upload Your Resume</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Supports PDF, DOCX, and TXT formats
        </p>
      </div>

      <div
        className={`upload-zone transition-all duration-300 ${isDragging ? "dragging" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
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
          <div className="animate-in zoom-in">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-success border-3 border-success flex items-center justify-center relative animate-success-pop"
                   style={{ boxShadow: "4px 4px 0px var(--foreground)" }}>
                <CheckIcon className="w-8 h-8 text-white" />
                {/* Success pulse effect */}
                <div className="absolute inset-0 border-3 border-success animate-ping opacity-75" />
              </div>
            </div>
            <h3 className="mb-3 font-black text-xl">{fileName}</h3>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 border-2 border-success mb-4">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <p className="text-success text-sm font-bold">Ready to optimize</p>
            </div>
            {!disabled && (
              <p className="text-muted-foreground text-xs mt-4 hover:text-primary transition-colors cursor-pointer">
                Click to select a different file
              </p>
            )}
          </div>
        ) : (
          <div className="transition-all duration-300">
            <div className="upload-icon mx-auto mb-6 transition-transform duration-300 hover:scale-110">
              <UploadIcon className="w-20 h-20 stroke-2" />
            </div>
            <h3 className="mb-3 font-bold text-lg">Drag & Drop Your Resume</h3>
            <p className="text-muted-foreground mb-6 text-sm">or click to browse your files</p>

            {/* File type badges with hover effect */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <span className="badge-neutral transition-all duration-200 hover:bg-primary hover:text-white hover:scale-105">
                PDF
              </span>
              <span className="badge-neutral transition-all duration-200 hover:bg-primary hover:text-white hover:scale-105">
                DOCX
              </span>
              <span className="badge-neutral transition-all duration-200 hover:bg-primary hover:text-white hover:scale-105">
                TXT
              </span>
            </div>

            {/* Info section */}
            <div className="mt-6 pt-6 border-t-2 border-dashed border-gray-30">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Maximum file size: 5MB</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
