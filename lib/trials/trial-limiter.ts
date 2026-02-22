import fs from "fs-extra"
import path from "path"
import { createHash } from "crypto"

const TRIAL_LIMIT = 2
const TRIAL_WINDOW_MS = 12 * 60 * 60 * 1000
const TRIALS_DIR = path.join(process.cwd(), "uploads", "trials")

interface TrialRecord {
  email: string
  attempts: number[]
}

export interface TrialResult {
  allowed: boolean
  remaining: number
  resetAt: string
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function getEmailHash(email: string): string {
  return createHash("sha256").update(email).digest("hex")
}

function getTrialFilePath(normalizedEmail: string): string {
  return path.join(TRIALS_DIR, `${getEmailHash(normalizedEmail)}.json`)
}

async function loadRecord(normalizedEmail: string): Promise<TrialRecord> {
  await fs.ensureDir(TRIALS_DIR)
  const pathToRecord = getTrialFilePath(normalizedEmail)
  if (!(await fs.pathExists(pathToRecord))) {
    return { email: normalizedEmail, attempts: [] }
  }

  const record = (await fs.readJson(pathToRecord)) as TrialRecord
  return { email: normalizedEmail, attempts: Array.isArray(record.attempts) ? record.attempts : [] }
}

async function saveRecord(record: TrialRecord): Promise<void> {
  await fs.ensureDir(TRIALS_DIR)
  const pathToRecord = getTrialFilePath(record.email)
  await fs.writeJson(pathToRecord, record, { spaces: 2 })
}

export async function consumeTrial(email: string): Promise<TrialResult> {
  const normalized = normalizeEmail(email)
  const now = Date.now()
  const record = await loadRecord(normalized)
  const recentAttempts = record.attempts.filter((timestamp) => now - timestamp < TRIAL_WINDOW_MS)

  if (recentAttempts.length >= TRIAL_LIMIT) {
    const oldest = Math.min(...recentAttempts)
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(oldest + TRIAL_WINDOW_MS).toISOString(),
    }
  }

  recentAttempts.push(now)
  await saveRecord({ email: normalized, attempts: recentAttempts })

  const resetBase = Math.min(...recentAttempts)
  return {
    allowed: true,
    remaining: Math.max(TRIAL_LIMIT - recentAttempts.length, 0),
    resetAt: new Date(resetBase + TRIAL_WINDOW_MS).toISOString(),
  }
}
