"use client"

import { useState, useRef, useCallback } from "react"

interface ProcessingUpdate {
  stage: string
  progress: number
  message: string
  download_url?: string
  error?: string
}

export function useResumeOptimizer() {
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const startProcessing = useCallback((fileId: string) => {
    setIsProcessing(true)
    setError(null)
    setProgress(0)
    setStage("")
    setMessage("Initializing...")

    // Simulate processing with progressive updates
    const processingStages: ProcessingUpdate[] = [
      { stage: "parsing", progress: 15, message: "Parsing resume content..." },
      { stage: "parsing", progress: 35, message: "Extracting sections and formatting..." },
      { stage: "enhancing", progress: 45, message: "Enhancing content with AI..." },
      { stage: "enhancing", progress: 65, message: "Optimizing bullet points for ATS..." },
      { stage: "generating", progress: 75, message: "Generating optimized document..." },
      { stage: "compiling", progress: 85, message: "Compiling to PDF..." },
      { stage: "compiling", progress: 95, message: "Finalizing..." },
      {
        stage: "complete",
        progress: 100,
        message: "Resume optimization complete!",
        download_url: `/api/download/${fileId}`,
      },
    ]

    let stageIndex = 0

    const processNextStage = () => {
      if (stageIndex < processingStages.length) {
        const update = processingStages[stageIndex]
        setProgress(update.progress)
        setStage(update.stage)
        setMessage(update.message)

        if (update.download_url) {
          setDownloadUrl(update.download_url)
        }

        if (update.stage === "complete") {
          setIsProcessing(false)
        }

        stageIndex++
        timeoutRef.current = setTimeout(processNextStage, 1200)
      }
    }

    processNextStage()
  }, [])

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (wsRef.current) {
      wsRef.current.close()
    }
    setIsProcessing(false)
  }, [])

  return {
    progress,
    stage,
    message,
    downloadUrl,
    error,
    isProcessing,
    startProcessing,
    cleanup,
  }
}
