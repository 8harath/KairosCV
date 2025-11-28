/**
 * Backend Health Check Service
 *
 * Checks the health status of the Python backend to determine:
 * - If LaTeX PDF engine is available (pdflatex)
 * - If Groq API is configured
 * - Overall backend availability
 */

export interface BackendHealth {
  status: 'healthy' | 'degraded' | 'unavailable'
  pdflatex: boolean
  groq_api: boolean
  message: string
  timestamp?: number
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'
const HEALTH_CACHE_TTL = 30000 // 30 seconds

let healthCache: { data: BackendHealth | null; timestamp: number } = {
  data: null,
  timestamp: 0
}

/**
 * Check backend health with caching
 * @param forceRefresh - Force a fresh health check ignoring cache
 * @returns Backend health status
 */
export async function checkBackendHealth(forceRefresh = false): Promise<BackendHealth> {
  const now = Date.now()

  // Return cached result if available and not expired
  if (!forceRefresh && healthCache.data && (now - healthCache.timestamp) < HEALTH_CACHE_TTL) {
    return healthCache.data
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5s timeout

    const response = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const health: BackendHealth = {
        status: 'unavailable',
        pdflatex: false,
        groq_api: false,
        message: `Backend returned ${response.status}: ${response.statusText}`,
        timestamp: now
      }
      healthCache = { data: health, timestamp: now }
      return health
    }

    const data = await response.json()

    // Parse health check response
    const pdflatexOk = data.checks?.pdflatex?.status === 'ok'
    const groqOk = data.checks?.groq_api?.status === 'configured'
    const overallStatus = data.status // 'healthy' or 'degraded'

    const health: BackendHealth = {
      status: overallStatus === 'healthy' ? 'healthy' : pdflatexOk ? 'healthy' : 'degraded',
      pdflatex: pdflatexOk,
      groq_api: groqOk,
      message: pdflatexOk
        ? 'Professional LaTeX PDF engine available'
        : groqOk
        ? 'Backend available (LaTeX engine unavailable, using fallback)'
        : 'Backend available with limited features',
      timestamp: now
    }

    // Cache the result
    healthCache = { data: health, timestamp: now }

    return health

  } catch (error) {
    const isTimeout = error instanceof Error && error.name === 'AbortError'

    const health: BackendHealth = {
      status: 'unavailable',
      pdflatex: false,
      groq_api: false,
      message: isTimeout
        ? 'Backend connection timeout (>5s)'
        : 'Backend connection failed - check if server is running',
      timestamp: now
    }

    // Cache failure for shorter duration (10s)
    healthCache = { data: health, timestamp: now - HEALTH_CACHE_TTL + 10000 }

    return health
  }
}

/**
 * Get user-friendly status message
 */
export function getStatusMessage(health: BackendHealth): string {
  switch (health.status) {
    case 'healthy':
      return '✓ Professional LaTeX PDF Engine Active'
    case 'degraded':
      return '⚠ Using Standard PDF Generator'
    case 'unavailable':
      return '○ Backend Offline - Limited Features'
    default:
      return 'Checking backend status...'
  }
}

/**
 * Get status color for UI
 */
export function getStatusColor(health: BackendHealth): 'success' | 'warning' | 'destructive' {
  switch (health.status) {
    case 'healthy':
      return 'success'
    case 'degraded':
      return 'warning'
    case 'unavailable':
      return 'destructive'
    default:
      return 'warning'
  }
}

/**
 * Clear health cache (useful for testing or forcing refresh)
 */
export function clearHealthCache(): void {
  healthCache = { data: null, timestamp: 0 }
}
