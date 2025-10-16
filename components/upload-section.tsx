"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, FileText, Loader } from "lucide-react"

interface UploadSectionProps {
  onStepChange: (step: "hero" | "upload" | "processing" | "preview" | "comparison") => void
}

export default function UploadSection({ onStepChange }: UploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [file, setFile] = useState<File | null>(null)
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
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFile = (selectedFile: File) => {
    if (selectedFile.type === "application/pdf") {
      setFile(selectedFile)
      setIsProcessing(true)
      // Simulate processing
      setTimeout(() => {
        setIsProcessing(false)
        onStepChange("preview")
      }, 2000)
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="max-w-2xl w-full">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Upload Your Resume</h2>
          <p className="text-slate-600 dark:text-slate-300">Drag and drop your PDF or click to browse</p>
        </div>

        {/* Upload Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative p-12 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
            isDragging
              ? "glass-hover border-slate-400 dark:border-slate-500 bg-slate-50 dark:bg-slate-900/50"
              : "glass dark:glass-dark border-dashed border-slate-300 dark:border-slate-600"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center">
            {isProcessing ? (
              <>
                <Loader className="w-16 h-16 text-slate-600 dark:text-slate-300 mb-4 animate-spin" />
                <p className="text-lg font-semibold text-slate-900 dark:text-white">Analyzing your resume...</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">This may take a moment</p>
              </>
            ) : file ? (
              <>
                <FileText className="w-16 h-16 text-slate-600 dark:text-slate-300 mb-4" />
                <p className="text-lg font-semibold text-slate-900 dark:text-white">{file.name}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Ready to enhance</p>
              </>
            ) : (
              <>
                <Upload className="w-16 h-16 text-slate-600 dark:text-slate-300 mb-4" />
                <p className="text-lg font-semibold text-slate-900 dark:text-white">Drop your resume here</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">or click to browse (PDF only)</p>
              </>
            )}
          </div>
        </div>

        {/* File info */}
        <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>Maximum file size: 10MB • PDF format only</p>
        </div>
      </div>
    </section>
  )
}
