/**
 * Application-wide constants
 *
 * This file contains all magic numbers, strings, and configuration values
 * used throughout the application. Centralizing constants makes the code
 * more maintainable and easier to configure.
 */

// ============================================================================
// File Upload Constraints
// ============================================================================

/**
 * Maximum allowed file size for uploads (5MB in bytes)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024

/**
 * Allowed MIME types for file uploads
 */
export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
] as const

/**
 * Allowed file extensions
 */
export const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".txt"] as const

/**
 * Human-readable file type names for error messages
 */
export const ALLOWED_FILE_TYPES_DISPLAY = "PDF, DOCX, or TXT"

// ============================================================================
// AI Configuration
// ============================================================================

/**
 * Gemini model to use for AI operations
 */
export const GEMINI_MODEL = "gemini-2.5-flash"

/**
 * Temperature setting for AI generation (lower = more consistent)
 */
export const GEMINI_TEMPERATURE = 0.3

/**
 * Maximum output tokens for AI generation
 */
export const GEMINI_MAX_OUTPUT_TOKENS = 2048

/**
 * Maximum retries for AI API calls
 */
export const AI_MAX_RETRIES = 3

/**
 * Initial delay for retry backoff (ms)
 */
export const AI_RETRY_INITIAL_DELAY = 1000

/**
 * Maximum character length for enhanced bullet points
 */
export const MAX_BULLET_LENGTH = 150

// ============================================================================
// Processing Stages
// ============================================================================

/**
 * Processing stage progress percentages
 */
export const PROGRESS_STAGES = {
  UPLOAD_COMPLETE: 10,
  PARSING_STARTED: 20,
  PARSING_COMPLETE: 30,
  AI_ENHANCEMENT_STARTED: 40,
  AI_ENHANCEMENT_PROGRESS: 50,
  AI_ENHANCEMENT_COMPLETE: 70,
  LATEX_GENERATION: 80,
  PDF_COMPILATION: 95,
  COMPLETE: 100,
} as const

/**
 * Stage names for display
 */
export const STAGE_NAMES = {
  idle: "Ready",
  uploading: "Uploading",
  parsing: "Parsing Resume",
  enhancing: "AI Enhancement",
  generating: "Generating PDF",
  compiling: "Finalizing",
  complete: "Complete",
  error: "Error",
} as const

/**
 * Stage messages for user feedback
 */
export const STAGE_MESSAGES = {
  parsing: "Reading resume file...",
  parsing_complete: "Text extraction complete",
  enhancing: "Analyzing resume with AI...",
  enhancing_progress: "Enhancing content for ATS optimization...",
  enhancing_bullets: "Optimizing bullet points...",
  generating: "Generating optimized PDF...",
  compiling: "Finalizing...",
  complete: "Resume optimization complete!",
} as const

// ============================================================================
// Resume Section Patterns
// ============================================================================

/**
 * Common patterns for detecting resume sections
 */
export const SECTION_PATTERNS = {
  contact: /email|phone|linkedin|github/i,
  experience: /experience|employment|work history/i,
  education: /university|college|bachelor|master|education/i,
  skills: /skills|technologies|competencies/i,
  projects: /projects|portfolio/i,
  certifications: /certifications|certificates|licenses/i,
} as const

// ============================================================================
// PDF Generation
// ============================================================================

/**
 * Default PDF format
 */
export const DEFAULT_PDF_FORMAT = "letter"

/**
 * PDF generation timeout (ms)
 */
export const PDF_GENERATION_TIMEOUT = 30000

/**
 * Puppeteer navigation timeout (ms)
 */
export const PUPPETEER_NAVIGATION_TIMEOUT = 30000

// ============================================================================
// File Storage
// ============================================================================

/**
 * Upload directory path
 */
export const UPLOAD_DIR = "uploads"

/**
 * Generated files subdirectory
 */
export const GENERATED_DIR = "generated"

/**
 * File cleanup time (1 hour in ms)
 */
export const FILE_CLEANUP_TIME = 60 * 60 * 1000

// ============================================================================
// Error Messages
// ============================================================================

/**
 * Standard error messages for consistency
 */
export const ERROR_MESSAGES = {
  NO_FILE: "No file provided",
  INVALID_FILE_TYPE: `Invalid file type. Allowed: ${ALLOWED_FILE_TYPES_DISPLAY}`,
  FILE_TOO_LARGE: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
  UPLOAD_FAILED: "Upload failed. Please try again.",
  FILE_NOT_FOUND: "Uploaded file not found",
  PROCESSING_FAILED: "Processing failed. Please try again.",
  EXTRACTION_FAILED: "Failed to extract resume data. Please check your resume format.",
  PDF_GENERATION_FAILED: "PDF generation failed. Please try again.",
  GEMINI_NOT_CONFIGURED: "AI service not configured",
  WEBSOCKET_CONNECTION_FAILED: "Failed to establish connection",
} as const

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  FILE_UPLOADED: "File uploaded successfully",
  PROCESSING_COMPLETE: "Resume optimization complete!",
  DOWNLOAD_READY: "Your optimized resume is ready for download",
} as const

// ============================================================================
// WebSocket Configuration
// ============================================================================

/**
 * WebSocket reconnection delay (ms)
 */
export const WS_RECONNECT_DELAY = 2000

/**
 * Maximum WebSocket reconnection attempts
 */
export const WS_MAX_RECONNECT_ATTEMPTS = 3

/**
 * WebSocket ping interval (ms)
 */
export const WS_PING_INTERVAL = 30000

// ============================================================================
// Default Values
// ============================================================================

/**
 * Default professional summary when AI is not available
 */
export const DEFAULT_SUMMARY = "Experienced professional with a proven track record of success."

/**
 * Default name placeholder
 */
export const DEFAULT_NAME = "Your Name"

/**
 * Default location placeholder
 */
export const DEFAULT_LOCATION = "City, State"

// ============================================================================
// Validation Patterns
// ============================================================================

/**
 * Email validation regex
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Phone number validation regex (flexible format)
 */
export const PHONE_REGEX = /^[\d\s\-\+\(\)]+$/

/**
 * URL validation regex
 */
export const URL_REGEX = /^https?:\/\/.+/i
