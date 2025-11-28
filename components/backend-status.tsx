"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { checkBackendHealth, getStatusMessage, getStatusColor, type BackendHealth } from "@/lib/services/backend-health"

export default function BackendStatus() {
  const [health, setHealth] = useState<BackendHealth | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check backend health on mount
    const checkHealth = async () => {
      setIsLoading(true)
      const healthStatus = await checkBackendHealth()
      setHealth(healthStatus)
      setIsLoading(false)
    }

    checkHealth()

    // Refresh health check every 60 seconds
    const interval = setInterval(checkHealth, 60000)

    return () => clearInterval(interval)
  }, [])

  if (isLoading || !health) {
    return (
      <Badge variant="outline" className="text-xs">
        ⟳ Checking backend...
      </Badge>
    )
  }

  const variant = getStatusColor(health)
  const message = getStatusMessage(health)

  return (
    <Badge variant={variant} className="text-xs" title={health.message}>
      {message}
    </Badge>
  )
}
