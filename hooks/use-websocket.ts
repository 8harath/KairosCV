"use client"

import { useEffect, useRef } from "react"

interface Message {
  stage: string
  progress: number
  message: string
  download_url?: string
  error?: string
}

interface UseWebSocketOptions {
  onMessage?: (data: Message) => void
  onError?: (error: Event) => void
  onClose?: () => void
}

export function useWebSocket(url: string, options: UseWebSocketOptions = {}) {
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    wsRef.current = new WebSocket(url)

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        options.onMessage?.(data)
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error)
      }
    }

    wsRef.current.onerror = (error) => {
      options.onError?.(error)
    }

    wsRef.current.onclose = () => {
      options.onClose?.()
    }

    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close()
      }
    }
  }, [url, options])

  return wsRef.current
}
