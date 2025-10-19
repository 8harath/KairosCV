"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import ProcessingStatus from "./processing-status"

interface EnhancedUploadSectionProps {
  onFileProcessed?: (fileData: { name: string; content: string }) => void
}

export default function EnhancedUploadSection({ onFileProcessed }: EnhancedUploadSectionProps) {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<
    "idle" | "uploading" | "analyzing" | "extracting" | "complete" | "error"
  >("idle")
  const [progress, setProgress] = useState(0)
  const [file, setFile] = useState<File | null>(null)
  const [errorMessage, setErrorMessage] = useState("")
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

  const handleFile = async (selectedFile: File) => {
    // Validate file
    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setErrorMessage("Please upload a PDF or DOCX file")
      setProcessingStatus("error")
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMessage("File size must be less than 10MB")
      setProcessingStatus("error")
      return
    }

    setFile(selectedFile)
    setErrorMessage("")
    setProcessingStatus("uploading")
    setProgress(0)

    try {
      // Create FormData for upload
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("userId", "anonymous") // You can implement user auth later

      // Upload file
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        console.error("Upload error response:", errorData)
        throw new Error(errorData.error || "Upload failed")
      }

      const uploadResult = await uploadResponse.json()
      console.log("Upload successful:", uploadResult)
      setProgress(50)
      setProcessingStatus("analyzing")

      // Process with AI
      const processResponse = await fetch("/api/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeId: uploadResult.resumeId,
          jobDescription: "", // Optional job description
        }),
      })

      if (!processResponse.ok) {
        const errorData = await processResponse.json()
        console.error("Process error response:", errorData)
        throw new Error(errorData.error || "Processing failed")
      }

      const processResult = await processResponse.json()
      console.log("Processing successful:", processResult)
      setProgress(100)
      setProcessingStatus("complete")

      // Store the resume ID for the preview page
      localStorage.setItem("currentResumeId", uploadResult.resumeId)

      if (onFileProcessed) {
        onFileProcessed({
          name: selectedFile.name,
          content: processResult.processedResume?.summary || "Processing complete",
        })
      }

      setTimeout(() => {
        router.push(`/preview?resumeId=${uploadResult.resumeId}`)
      }, 1500)

    } catch (error) {
      console.error("File processing error:", error)
      setErrorMessage(error instanceof Error ? error.message : "Processing failed")
      setProcessingStatus("error")
    }
  }

  const handleRetry = () => {
    setProcessingStatus("idle")
    setProgress(0)
    setFile(null)
    setErrorMessage("")
  }

  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="max-w-2xl w-full">
        {processingStatus === "idle" ? (
          <>
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
                accept=".pdf,.docx"
                onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center">
                <Upload className="w-16 h-16 text-slate-600 dark:text-slate-300 mb-4" />
                <p className="text-lg font-semibold text-slate-900 dark:text-white">Drop your resume here</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">or click to browse (PDF or DOCX)</p>
              </div>
            </div>

            {/* File info */}
            <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
              <p>Maximum file size: 10MB • PDF or DOCX format</p>
            </div>
          </>
        ) : processingStatus === "error" ? (
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <AlertCircle className="w-16 h-16 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Upload Failed</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">{errorMessage}</p>
            <button
              onClick={handleRetry}
              className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        ) : (
          <ProcessingStatus
            status={processingStatus as "uploading" | "analyzing" | "extracting" | "complete" | "error"}
            progress={Math.round(progress)}
            message={errorMessage}
          />
        )}
      </div>
    </section>
  )
}
