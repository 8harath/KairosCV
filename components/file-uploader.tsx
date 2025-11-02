"use client"

import type React from "react"

import { useState, useRef } from "react"

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
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
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
      <div className="mb-6 border-b-3 border-primary pb-4">
        <h2>Upload Your Resume</h2>
      </div>

      <div
        className={`upload-zone ${isDragging ? "dragging" : ""} ${disabled ? "opacity-50" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        style={{ cursor: disabled ? "not-allowed" : "pointer" }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileInput}
          style={{ display: "none" }}
          disabled={disabled}
        />

        <div className="upload-icon">📄</div>

        {fileName ? (
          <>
            <h3 className="mb-1">✓ {fileName}</h3>
            <p className="text-muted-foreground text-sm">Click to change file</p>
          </>
        ) : (
          <>
            <h3 className="mb-2">Drag & Drop Your Resume</h3>
            <p className="text-muted-foreground mb-3">or click to browse</p>
            <p className="text-muted-foreground text-xs md:text-sm">Supports PDF, DOCX, TXT (Max 5MB)</p>
          </>
        )}
      </div>

      {fileName && !disabled && (
        <button
          className="btn w-full mt-6 font-bold uppercase"
          onClick={() => {
            // File is already being processed through onFileSelect
          }}
        >
          Processing...
        </button>
      )}
    </div>
  )
}
