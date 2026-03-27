import { createHash } from "crypto"
import fs from "fs-extra"
import os from "os"
import path from "path"
import { getSafeExtension } from "./security/file-validation"
import { downloadUploadedFileFromSupabase, saveGeneratedPDFToSupabase, downloadGeneratedPDFFromSupabase } from "./storage/supabase-storage"
import { shouldUseSupabaseStorage, isSupabaseConfigured } from "./config/env"

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

// Save generated PDF (routes to Supabase or local filesystem)
export async function saveGeneratedPDF(fileId: string, pdfBuffer: Buffer): Promise<string> {
  if (shouldUseSupabaseStorage()) {
    const { bucket, path: storagePath } = await saveGeneratedPDFToSupabase(fileId, pdfBuffer)
    // Update the processing_jobs row with output location
    await updateJobOutput(fileId, bucket, storagePath)
    return storagePath
  }

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
  userId?: string | null
  jobDescription?: string | null
  templateId?: string | null
  uploadedAt: Date
  storage?: {
    bucket: string
    path: string
  }
  output?: {
    bucket: string
    path: string
  }
}

// Get metadata file path (local fallback)
function getMetadataFilePath(fileId: string): string {
  return path.join(UPLOADS_DIR, `${fileId}.meta.json`)
}

export function getResumeJSONPath(fileId: string): string {
  return path.join(JSON_DIR, `${fileId}.json`)
}

function getEmailHash(email: string): string {
  return createHash("sha256").update(email).digest("hex")
}

// Save file metadata — Supabase DB or local filesystem
export async function saveFileMetadata(metadata: FileMetadata): Promise<void> {
  if (shouldUseSupabaseStorage() && isSupabaseConfigured()) {
    const { getSupabaseServiceRoleClient } = await import("./supabase/server")
    const supabase = getSupabaseServiceRoleClient()

    const email = metadata.email || `guest-${metadata.fileId}@kairoscv.local`
    const emailHash = getEmailHash(email)

    const insertData: Record<string, unknown> = {
      id: metadata.fileId,
      email,
      email_hash: emailHash,
      original_filename: metadata.filename,
      mime_type: metadata.type,
      input_bucket: metadata.storage?.bucket || "resume-inputs",
      input_path: metadata.storage?.path || `local/${metadata.fileId}`,
      status: "queued",
      stage: "queued",
      progress: 0,
    }
    if (metadata.userId) insertData.user_id = metadata.userId
    if (metadata.jobDescription) insertData.job_description = metadata.jobDescription
    if (metadata.templateId) insertData.template_id = metadata.templateId

    const { error } = await supabase.from("processing_jobs").insert(insertData)

    if (error) {
      console.error("Failed to save metadata to Supabase:", error)
      throw new Error(`Supabase metadata insert failed: ${error.message}`)
    }
    return
  }

  // Local filesystem fallback
  await ensureUploadDirectories()
  const metadataPath = getMetadataFilePath(metadata.fileId)
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2))
}

// Get file metadata — from Supabase DB or local filesystem
export async function getFileMetadata(fileId: string): Promise<FileMetadata | null> {
  if (shouldUseSupabaseStorage() && isSupabaseConfigured()) {
    try {
      const { getSupabaseServiceRoleClient } = await import("./supabase/server")
      const supabase = getSupabaseServiceRoleClient()

      const { data, error } = await supabase
        .from("processing_jobs")
        .select("id, original_filename, mime_type, email, user_id, job_description, template_id, input_bucket, input_path, output_bucket, output_path, created_at")
        .eq("id", fileId)
        .single()

      if (error || !data) {
        return null
      }

      return {
        fileId: data.id,
        filename: data.original_filename,
        size: 0,
        type: data.mime_type,
        email: data.email,
        userId: data.user_id || null,
        jobDescription: data.job_description || null,
        templateId: data.template_id || null,
        uploadedAt: new Date(data.created_at),
        storage: {
          bucket: data.input_bucket,
          path: data.input_path,
        },
        output: data.output_bucket && data.output_path
          ? { bucket: data.output_bucket, path: data.output_path }
          : undefined,
      }
    } catch (error) {
      console.error("Error reading metadata from Supabase:", error)
      return null
    }
  }

  // Local filesystem fallback
  try {
    const metadataPath = getMetadataFilePath(fileId)
    if (!(await fileExists(metadataPath))) {
      return null
    }
    const data = await fs.readFile(metadataPath, 'utf-8')
    const metadata = JSON.parse(data)
    metadata.uploadedAt = new Date(metadata.uploadedAt)
    return metadata
  } catch (error) {
    console.error('Error reading metadata:', error)
    return null
  }
}

// Update processing job status
export async function updateJobStatus(
  fileId: string,
  status: string,
  stage?: string,
  progress?: number,
  errorMessage?: string
): Promise<void> {
  if (!shouldUseSupabaseStorage() || !isSupabaseConfigured()) return

  try {
    const { getSupabaseServiceRoleClient } = await import("./supabase/server")
    const supabase = getSupabaseServiceRoleClient()

    const update: Record<string, unknown> = { status }
    if (stage !== undefined) update.stage = stage
    if (progress !== undefined) update.progress = progress
    if (errorMessage !== undefined) update.error_message = errorMessage
    if (status === "processing" && !update.started_at) update.started_at = new Date().toISOString()
    if (status === "completed") update.completed_at = new Date().toISOString()

    await supabase.from("processing_jobs").update(update).eq("id", fileId)
  } catch (error) {
    console.warn("Failed to update job status:", error)
  }
}

// Update processing job with output PDF location
async function updateJobOutput(fileId: string, outputBucket: string, outputPath: string): Promise<void> {
  if (!shouldUseSupabaseStorage() || !isSupabaseConfigured()) return

  try {
    const { getSupabaseServiceRoleClient } = await import("./supabase/server")
    const supabase = getSupabaseServiceRoleClient()

    await supabase
      .from("processing_jobs")
      .update({
        output_bucket: outputBucket,
        output_path: outputPath,
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", fileId)
  } catch (error) {
    console.warn("Failed to update job output:", error)
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

// Download generated PDF (from Supabase or local)
export async function downloadGeneratedPDF(fileId: string, output?: FileMetadata["output"]): Promise<Buffer> {
  // Try Supabase storage first
  if (output?.bucket && output?.path) {
    return downloadGeneratedPDFFromSupabase(output.bucket, output.path)
  }

  // Fall back to local filesystem
  const localPath = getGeneratedFilePath(fileId)
  if (await fileExists(localPath)) {
    return await fs.readFile(localPath)
  }

  throw new Error("Generated PDF not found in local or remote storage")
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
  // On Vercel with Supabase, no local cleanup needed — Supabase handles expiry via expires_at column
  if (shouldUseSupabaseStorage()) return

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
