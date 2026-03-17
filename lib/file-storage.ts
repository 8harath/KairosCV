import fs from "fs-extra"
import os from "os"
import path from "path"
import { getSafeExtension } from "./security/file-validation"
import { downloadUploadedFileFromSupabase } from "./storage/supabase-storage"

export function getUploadsBaseDir(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    return path.join(os.tmpdir(), "kairoscv", "uploads")
  }

  return path.join(process.cwd(), "uploads")
}

const UPLOADS_DIR = getUploadsBaseDir()
const GENERATED_DIR = path.join(UPLOADS_DIR, "generated")
const JSON_DIR = path.join(UPLOADS_DIR, "json")

// Ensure directories exist
export async function ensureUploadDirectories() {
  await fs.ensureDir(UPLOADS_DIR)
  await fs.ensureDir(GENERATED_DIR)
  await fs.ensureDir(JSON_DIR)
}

// Get file path for uploaded file
export function getUploadFilePath(fileId: string, extension: string): string {
  return path.join(UPLOADS_DIR, `${fileId}${extension}`)
}

// Get file path for generated PDF
export function getGeneratedFilePath(fileId: string): string {
  return path.join(GENERATED_DIR, `${fileId}.pdf`)
}

// Save uploaded file
export async function saveUploadedFile(fileId: string, filename: string, buffer: Buffer): Promise<string> {
  await ensureUploadDirectories()

  const extension = getSafeExtension(filename) || ".txt"
  const filePath = getUploadFilePath(fileId, extension)

  await fs.writeFile(filePath, buffer)

  return filePath
}

// Check if file exists
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

// Read file as buffer
export async function readFile(filePath: string): Promise<Buffer> {
  return await fs.readFile(filePath)
}

// Save generated PDF
export async function saveGeneratedPDF(fileId: string, pdfBuffer: Buffer): Promise<string> {
  await ensureUploadDirectories()
  
  const filePath = getGeneratedFilePath(fileId)
  await fs.writeFile(filePath, pdfBuffer)
  
  return filePath
}

// Get file metadata
export interface FileMetadata {
  fileId: string
  filename: string
  size: number
  type: string
  email?: string
  uploadedAt: Date
  storage?: {
    bucket: string
    path: string
  }
}

// Get metadata file path
function getMetadataFilePath(fileId: string): string {
  return path.join(UPLOADS_DIR, `${fileId}.meta.json`)
}

export function getResumeJSONPath(fileId: string): string {
  return path.join(JSON_DIR, `${fileId}.json`)
}

// Save file metadata to disk
export async function saveFileMetadata(metadata: FileMetadata): Promise<void> {
  await ensureUploadDirectories()
  const metadataPath = getMetadataFilePath(metadata.fileId)
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2))
}

// Get file metadata from disk
export async function getFileMetadata(fileId: string): Promise<FileMetadata | null> {
  try {
    const metadataPath = getMetadataFilePath(fileId)
    if (!(await fileExists(metadataPath))) {
      return null
    }
    const data = await fs.readFile(metadataPath, 'utf-8')
    const metadata = JSON.parse(data)
    // Convert uploadedAt back to Date object
    metadata.uploadedAt = new Date(metadata.uploadedAt)
    return metadata
  } catch (error) {
    console.error('Error reading metadata:', error)
    return null
  }
}

export async function resolveUploadedFile(
  fileId: string,
  originalFilename: string,
  storage?: FileMetadata["storage"]
): Promise<{ filePath: string; cleanup?: () => Promise<void> }> {
  const extension = getSafeExtension(originalFilename) || ".txt"
  const localPath = getUploadFilePath(fileId, extension)

  if (await fileExists(localPath)) {
    return { filePath: localPath }
  }

  if (storage?.bucket && storage?.path) {
    return downloadUploadedFileFromSupabase(storage.bucket, storage.path, fileId, extension)
  }

  throw new Error("Uploaded file not found in local or remote storage")
}

export async function cleanupFileArtifacts(fileId: string, originalFilename: string): Promise<void> {
  const extension = getSafeExtension(originalFilename) || ".txt"
  const sourcePath = getUploadFilePath(fileId, extension)
  const generatedPath = getGeneratedFilePath(fileId)
  const metadataPath = getMetadataFilePath(fileId)
  const jsonPath = getResumeJSONPath(fileId)

  await Promise.allSettled([
    fs.remove(sourcePath),
    fs.remove(generatedPath),
    fs.remove(metadataPath),
    fs.remove(jsonPath),
  ])
}

export async function cleanupExpiredArtifacts(maxAgeHours = 24): Promise<void> {
  await ensureUploadDirectories()

  const metadataFiles = await fs.readdir(UPLOADS_DIR)
  const metadataJsonFiles = metadataFiles.filter((name) => name.endsWith(".meta.json"))
  const now = Date.now()
  const maxAgeMs = maxAgeHours * 60 * 60 * 1000

  for (const filename of metadataJsonFiles) {
    const fileId = filename.replace(".meta.json", "")
    try {
      const metadataPath = path.join(UPLOADS_DIR, filename)
      const metadataRaw = await fs.readFile(metadataPath, "utf-8")
      const metadata = JSON.parse(metadataRaw) as { uploadedAt?: string; filename?: string }

      const uploadedAt = metadata.uploadedAt ? new Date(metadata.uploadedAt).getTime() : 0
      if (!uploadedAt || now - uploadedAt > maxAgeMs) {
        await cleanupFileArtifacts(fileId, metadata.filename || `${fileId}.txt`)
      }
    } catch (error) {
      console.warn(`Failed cleanup for ${fileId}:`, error)
    }
  }
}

