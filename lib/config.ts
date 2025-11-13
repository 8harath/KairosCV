/**
 * Application configuration
 *
 * This file centralizes all environment-based configuration.
 * All environment variables are accessed through this module for consistency.
 */

import {
  GEMINI_MODEL,
  GEMINI_TEMPERATURE,
  GEMINI_MAX_OUTPUT_TOKENS,
  UPLOAD_DIR,
  GENERATED_DIR,
  MAX_FILE_SIZE,
} from "./constants"

/**
 * Environment type
 */
export type Environment = "development" | "production" | "test"

/**
 * Application configuration interface
 */
interface AppConfig {
  // Environment
  env: Environment
  isDevelopment: boolean
  isProduction: boolean
  isTest: boolean

  // Server
  port: number
  host: string

  // AI Service
  gemini: {
    apiKey: string
    model: string
    temperature: number
    maxOutputTokens: number
    isConfigured: boolean
  }

  // File Storage
  storage: {
    uploadDir: string
    generatedDir: string
    maxFileSize: number
  }

  // Features
  features: {
    aiEnhancement: boolean
    debugMode: boolean
  }
}

/**
 * Get environment variable with fallback
 */
function getEnvVar(key: string, defaultValue: string = ""): string {
  return process.env[key] || defaultValue
}

/**
 * Get environment variable as number
 */
function getEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key]
  return value ? parseInt(value, 10) : defaultValue
}

/**
 * Get environment variable as boolean
 */
function getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
  const value = process.env[key]
  if (!value) return defaultValue
  return value.toLowerCase() === "true" || value === "1"
}

/**
 * Determine current environment
 */
function getEnvironment(): Environment {
  const env = getEnvVar("NODE_ENV", "development")
  if (env === "production") return "production"
  if (env === "test") return "test"
  return "development"
}

/**
 * Application configuration object
 *
 * All configuration values should be accessed through this object.
 * Do not access process.env directly elsewhere in the application.
 */
export const config: AppConfig = {
  // Environment
  env: getEnvironment(),
  isDevelopment: getEnvironment() === "development",
  isProduction: getEnvironment() === "production",
  isTest: getEnvironment() === "test",

  // Server
  port: getEnvNumber("PORT", 3000),
  host: getEnvVar("HOST", "0.0.0.0"),

  // AI Service
  gemini: {
    apiKey: getEnvVar("GEMINI_API_KEY", ""),
    model: getEnvVar("GEMINI_MODEL", GEMINI_MODEL),
    temperature: GEMINI_TEMPERATURE,
    maxOutputTokens: GEMINI_MAX_OUTPUT_TOKENS,
    isConfigured: !!getEnvVar("GEMINI_API_KEY"),
  },

  // File Storage
  storage: {
    uploadDir: getEnvVar("UPLOAD_DIR", UPLOAD_DIR),
    generatedDir: GENERATED_DIR,
    maxFileSize: getEnvNumber("MAX_FILE_SIZE", MAX_FILE_SIZE),
  },

  // Features
  features: {
    aiEnhancement: getEnvBoolean("ENABLE_AI_ENHANCEMENT", true),
    debugMode: getEnvBoolean("DEBUG_MODE", false),
  },
}

/**
 * Validate required configuration
 *
 * Call this on application startup to ensure all required
 * configuration is present.
 */
export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Warn if Gemini API key is not configured
  if (!config.gemini.isConfigured) {
    errors.push("GEMINI_API_KEY is not set. AI enhancement features will be disabled.")
  }

  // Add more validation as needed

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Log configuration on startup (safe for production)
 *
 * This logs configuration in a safe way that doesn't expose secrets.
 */
export function logConfig(): void {
  if (config.isDevelopment) {
    console.log("=== KairosCV Configuration ===")
    console.log(`Environment: ${config.env}`)
    console.log(`Port: ${config.port}`)
    console.log(`Gemini Configured: ${config.gemini.isConfigured}`)
    console.log(`AI Enhancement: ${config.features.aiEnhancement}`)
    console.log(`Debug Mode: ${config.features.debugMode}`)
    console.log("==============================")
  }
}

/**
 * Get API base URL based on environment
 */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    // Client-side
    return ""
  }
  // Server-side
  return config.isProduction
    ? `https://${config.host}`
    : `http://localhost:${config.port}`
}

/**
 * Get WebSocket URL based on environment
 */
export function getWebSocketUrl(): string {
  if (typeof window !== "undefined") {
    // Client-side
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    return `${protocol}//${window.location.host}`
  }
  // Server-side
  return config.isProduction ? `wss://${config.host}` : `ws://localhost:${config.port}`
}

export default config
