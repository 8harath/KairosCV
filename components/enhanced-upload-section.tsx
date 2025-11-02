"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, AlertCircle, CheckCircle } from "lucide-react"
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
      formData.append("userId", "anonymous")

      // Upload file
      setProcessingStatus("uploading")
      setProgress(25)

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        try {
          const errorData = await uploadResponse.json()
          console.error("Upload error response:", errorData)
          throw new Error(errorData.error || "Upload failed")
        } catch (jsonError) {
          console.error("Failed to parse error response:", jsonError)
          throw new Error("Upload failed - server error")
        }
      }

      let uploadResult;
      try {
        uploadResult = await uploadResponse.json()
        console.log("Upload successful:", uploadResult)
      } catch (jsonError) {
        console.error("Failed to parse upload response:", jsonError)
        throw new Error("Failed to parse server response")
      }

      setProgress(100)
      setProcessingStatus("complete")

      // Store the resume ID for the preview page
      localStorage.setItem("currentResumeId", uploadResult.resumeId)

      if (onFileProcessed) {
        onFileProcessed({
          name: selectedFile.name,
          content: uploadResult.extractedText?.substring(0, 200) || "Processing complete",
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
    <section className="min-h-screen flex items-center justify-center py-20 px-4 neu-grid-bg">
      <div className="max-w-3xl w-full">
        {processingStatus === "idle" ? (
          <>
            <div className="mb-12 text-center">
              <div className="inline-block neu-badge-accent mb-6">
                <span>STEP 01</span>
              </div>
              <h2 className="text-5xl sm:text-6xl font-black mb-4" style={{fontFamily: 'var(--font-space-grotesk)'}}>
                UPLOAD YOUR RESUME
              </h2>
              <p className="text-xl font-medium">Drag and drop or click to browse</p>
            </div>

            {/* Upload Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative p-16 border-[4px] border-dashed transition-all duration-300 cursor-pointer ${
                isDragging
                  ? "border-black dark:border-white bg-[#FFD700] scale-105"
                  : "border-black dark:border-white bg-white dark:bg-black hover:bg-[#FFD700] hover:scale-105"
              }`}
              style={{
                boxShadow: isDragging ? '10px 10px 0px var(--border)' : '6px 6px 0px var(--border)'
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-black dark:bg-white border-[3px] border-black dark:border-white flex items-center justify-center mb-6"
                     style={{boxShadow: '4px 4px 0px var(--border)'}}>
                  <Upload className="w-12 h-12 text-white dark:text-black" />
                </div>
                <p className="text-2xl font-black mb-2" style={{fontFamily: 'var(--font-space-grotesk)'}}>
                  DROP YOUR RESUME HERE
                </p>
                <p className="text-lg font-medium opacity-70">
                  or click to browse (PDF or DOCX)
                </p>
              </div>
            </div>

            {/* File info */}
            <div className="mt-8 flex items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-bold text-sm uppercase">Max 10MB</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-bold text-sm uppercase">PDF & DOCX</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-bold text-sm uppercase">100% Secure</span>
              </div>
            </div>
          </>
        ) : processingStatus === "error" ? (
          <div className="text-center">
            <div className="mb-8 inline-flex justify-center">
              <div className="w-24 h-24 bg-[#FF4444] border-[3px] border-black dark:border-white flex items-center justify-center"
                   style={{boxShadow: '6px 6px 0px var(--border)'}}>
                <AlertCircle className="w-12 h-12 text-white" />
              </div>
            </div>
            <h3 className="text-4xl font-black mb-4" style={{fontFamily: 'var(--font-space-grotesk)'}}>
              UPLOAD FAILED
            </h3>
            <p className="text-xl font-medium mb-8 max-w-md mx-auto">{errorMessage}</p>
            <button
              onClick={handleRetry}
              className="neu-btn text-lg"
            >
              TRY AGAIN
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
