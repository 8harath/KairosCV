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
  const [fileId, setFileId] = useState<string | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  const startProcessing = useCallback((fileId: string) => {
    setIsProcessing(true)
    setError(null)
    setProgress(0)
    setStage("")
    setMessage("Initializing...")
    setDownloadUrl(null)
    setFileId(fileId)

    // Close existing connection if any
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    // Create EventSource for Server-Sent Events
    const eventSource = new EventSource(`/api/stream/${fileId}`)
    eventSourceRef.current = eventSource

    eventSource.onmessage = (event) => {
      try {
        const update: ProcessingUpdate = JSON.parse(event.data)

        setProgress(update.progress)
        setStage(update.stage)
        setMessage(update.message)

        if (update.download_url) {
          setDownloadUrl(update.download_url)
        }

        if (update.error) {
          setError(update.error)
          setIsProcessing(false)
          eventSource.close()
        }

        if (update.stage === "complete") {
          setIsProcessing(false)
          eventSource.close()
        }

        if (update.stage === "error") {
          setError(update.error || "Processing failed")
          setIsProcessing(false)
          eventSource.close()
        }
      } catch (err) {
        console.error("Failed to parse SSE message:", err)
        setError("Failed to process update")
        setIsProcessing(false)
        eventSource.close()
      }
    }

    eventSource.onerror = (err) => {
      console.error("EventSource error:", err)
      setError("Connection error. Please try again.")
      setIsProcessing(false)
      eventSource.close()
    }
  }, [])

  const cleanup = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
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
    fileId,
    startProcessing,
    cleanup,
  }
}
