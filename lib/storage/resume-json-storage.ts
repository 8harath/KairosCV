/**
 * Resume JSON Storage
 *
 * Stores extracted resume data as JSON files for:
 * 1. Debugging and verification
 * 2. Data integrity checks
 * 3. Re-processing without re-parsing
 * 4. Audit trail
 */

import fs from "fs-extra"
import path from "path"
import { ResumeData } from "../schemas/resume-schema"

// Storage directory for JSON files
const JSON_STORAGE_DIR = path.join(process.cwd(), "uploads", "json")

/**
 * Initialize JSON storage directory
 */
export async function initJSONStorage(): Promise<void> {
  await fs.ensureDir(JSON_STORAGE_DIR)
}

/**
 * Save extracted resume data as JSON
 */
export async function saveResumeJSON(
  fileId: string,
  data: ResumeData
): Promise<string> {
  await initJSONStorage()

  const jsonPath = path.join(JSON_STORAGE_DIR, `${fileId}.json`)

  // Add metadata
  const jsonData = {
    ...data,
    _metadata: {
      fileId,
      extractedAt: new Date().toISOString(),
      version: "1.0",
    },
  }

  await fs.writeJSON(jsonPath, jsonData, { spaces: 2 })

  console.log(`📄 Resume JSON saved: ${jsonPath}`)

  return jsonPath
}

/**
 * Load resume JSON from storage
 */
export async function loadResumeJSON(fileId: string): Promise<ResumeData | null> {
  const jsonPath = path.join(JSON_STORAGE_DIR, `${fileId}.json`)

  if (!(await fs.pathExists(jsonPath))) {
    return null
  }

  const jsonData = await fs.readJSON(jsonPath)

  // Remove metadata before returning
  const { _metadata, ...resumeData } = jsonData

  return resumeData as ResumeData
}

/**
 * Check if resume JSON exists
 */
export async function resumeJSONExists(fileId: string): Promise<boolean> {
  const jsonPath = path.join(JSON_STORAGE_DIR, `${fileId}.json`)
  return await fs.pathExists(jsonPath)
}

/**
 * Delete resume JSON
 */
export async function deleteResumeJSON(fileId: string): Promise<void> {
  const jsonPath = path.join(JSON_STORAGE_DIR, `${fileId}.json`)

  if (await fs.pathExists(jsonPath)) {
    await fs.remove(jsonPath)
    console.log(`🗑️  Deleted JSON: ${jsonPath}`)
  }
}

/**
 * Get path to JSON file
 */
export function getResumeJSONPath(fileId: string): string {
  return path.join(JSON_STORAGE_DIR, `${fileId}.json`)
}
