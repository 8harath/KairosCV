"use client"

import type React from "react"
import { useRef } from "react"
import { UploadCloud } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void
  disabled: boolean
}

export default function FileUploader({ onFileSelect, disabled }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    // Reset input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = ""
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
      toast({ title: "Invalid file type", description: "Please upload a PDF, DOCX, or TXT file.", variant: "destructive" })
      return
    }

    if (file.size > maxSize) {
      toast({ title: "File too large", description: "Maximum file size is 5MB.", variant: "destructive" })
      return
    }

    onFileSelect(file)
  }

  return (
    <div
      className={`upload-zone ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
      onDragOver={handleDragOver}
      onDragLeave={(e) => e.preventDefault()}
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

      <div className="mx-auto max-w-sm">
        <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm font-medium text-foreground">Drop your resume here</p>
        <p className="mt-1 text-xs text-muted-foreground">or click to browse. PDF, DOCX, TXT up to 5MB.</p>
      </div>
    </div>
  )
}
