"use client"

import { useCallback, useEffect, useState } from "react"

export interface PaywallConfig {
  enabled: boolean
  configured: boolean
  keyId: string | null
  amountPaise: number
  currency: string
  label: string
}

export interface PlanStatusResponse {
  plan: "free" | "pro"
  isPro: boolean
  currentPeriodEnd: string | null
  unlockedAt: string | null
  paywall: PaywallConfig
}

const FALLBACK: PlanStatusResponse = {
  plan: "free",
  isPro: false,
  currentPeriodEnd: null,
  unlockedAt: null,
  paywall: {
    enabled: false,
    configured: false,
    keyId: null,
    amountPaise: 19900,
    currency: "INR",
    label: "KairosCV Pro",
  },
}

export function usePlanStatus(emailHint?: string | null) {
  const [status, setStatus] = useState<PlanStatusResponse>(FALLBACK)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const url = emailHint
        ? `/api/payments/status?email=${encodeURIComponent(emailHint)}`
        : "/api/payments/status"
      const res = await fetch(url, { cache: "no-store" })
      if (!res.ok) {
        throw new Error(`Plan status request failed: ${res.status}`)
      }
      const data = (await res.json()) as PlanStatusResponse
      setStatus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load plan status")
    } finally {
      setLoading(false)
    }
  }, [emailHint])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { status, loading, error, refresh }
}
