"use client"

import { useState, useRef, useCallback, useEffect } from "react"

export interface ConfidenceSummary {
  overall: number
  level: "excellent" | "good" | "fair" | "poor"
  suggestions: string[]
  sections: {
    contact: { score: number; issues: string[] }
    experience: { score: number; issues: string[] }
    education: { score: number; issues: string[] }
    skills: { score: number; issues: string[] }
    projects: { score: number; issues: string[] }
  }
}

interface ProcessingUpdate {
  stage: string
  progress: number
  message: string
  download_url?: string
  error?: string
  confidence?: ConfidenceSummary
}

export function useResumeOptimizer() {
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [fileId, setFileId] = useState<string | null>(null)
  const [confidence, setConfidence] = useState<ConfidenceSummary | null>(null)
  const [elapsed, setElapsed] = useState(0)

  const eventSourceRef = useRef<EventSource | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    startTimeRef.current = null
  }, [])

  const startProcessing = useCallback((id: string) => {
    setIsProcessing(true)
    setError(null)
    setProgress(0)
    setStage("")
    setMessage("Initializing...")
    setDownloadUrl(null)
    setFileId(id)
    setConfidence(null)
    setElapsed(0)

    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    // Start elapsed-time counter
    startTimeRef.current = Date.now()
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - (startTimeRef.current ?? Date.now())) / 1000))
    }, 1000)

    const eventSource = new EventSource(`/api/stream/${id}`)
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

        if (update.confidence) {
          setConfidence(update.confidence)
        }

        if (update.error) {
          setError(update.error)
          setIsProcessing(false)
          stopTimer()
          eventSource.close()
        }

        if (update.stage === "complete") {
          setIsProcessing(false)
          stopTimer()
          eventSource.close()
        }

        if (update.stage === "error") {
          setError(update.error || "Processing failed")
          setIsProcessing(false)
          stopTimer()
          eventSource.close()
        }
      } catch (err) {
        console.error("Failed to parse SSE message:", err)
        setError("Failed to process update")
        setIsProcessing(false)
        stopTimer()
        eventSource.close()
      }
    }

    eventSource.onerror = (err) => {
      console.error("EventSource error:", err)
      setError("Connection error. Please try again.")
      setIsProcessing(false)
      stopTimer()
      eventSource.close()
    }
  }, [stopTimer])

  const cleanup = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    stopTimer()
    setIsProcessing(false)
  }, [stopTimer])

  // Safety: clear timer on unmount
  useEffect(() => () => { stopTimer() }, [stopTimer])

  return {
    progress,
    stage,
    message,
    downloadUrl,
    error,
    isProcessing,
    fileId,
    confidence,
    elapsed,
    startProcessing,
    cleanup,
  }
}
