import { randomUUID } from "crypto"
import path from "path"
import fs from "fs-extra"
import os from "os"
import { getSupabaseInputBucket, getSupabaseJsonBucket, getSupabaseOutputBucket } from "@/lib/config/env"
import { getSupabaseServiceRoleClient } from "@/lib/supabase/server"

export interface StoredUpload {
  bucket: string
  path: string
}

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]+/g, "-")
}

export async function saveUploadedFileToSupabase(
  fileId: string,
  filename: string,
  buffer: Buffer,
  contentType: string,
  ownerId?: string | null
): Promise<StoredUpload> {
  const bucket = getSupabaseInputBucket()
  const safeFilename = sanitizeFilename(filename)
  const ownerFolder = ownerId || "system"
  const objectPath = `${ownerFolder}/uploads/${fileId}/${randomUUID()}-${safeFilename}`
  const supabase = getSupabaseServiceRoleClient()

  const { error } = await supabase.storage.from(bucket).upload(objectPath, buffer, {
    contentType,
    upsert: false,
  })

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`)
  }

  return {
    bucket,
    path: objectPath,
  }
}

export function getStorageFilename(storagePath: string): string {
  return path.basename(storagePath)
}

// Save generated PDF to Supabase Storage
export async function saveGeneratedPDFToSupabase(
  fileId: string,
  pdfBuffer: Buffer,
  ownerId?: string | null
): Promise<StoredUpload> {
  const bucket = getSupabaseOutputBucket()
  const ownerFolder = ownerId || "system"
  const objectPath = `${ownerFolder}/outputs/${fileId}/${fileId}.pdf`
  const supabase = getSupabaseServiceRoleClient()

  const { error } = await supabase.storage.from(bucket).upload(objectPath, pdfBuffer, {
    contentType: "application/pdf",
    upsert: true,
  })

  if (error) {
    throw new Error(`Supabase PDF upload failed: ${error.message}`)
  }

  return {
    bucket,
    path: objectPath,
  }
}

export async function saveResumeJSONToSupabase(
  fileId: string,
  jsonData: unknown,
  ownerId?: string | null
): Promise<StoredUpload> {
  const bucket = getSupabaseJsonBucket()
  const ownerFolder = ownerId || "system"
  const objectPath = `${ownerFolder}/json/${fileId}/${fileId}.json`
  const supabase = getSupabaseServiceRoleClient()
  const buffer = Buffer.from(JSON.stringify(jsonData, null, 2))

  const { error } = await supabase.storage.from(bucket).upload(objectPath, buffer, {
    contentType: "application/json",
    upsert: true,
  })

  if (error) {
    throw new Error(`Supabase JSON upload failed: ${error.message}`)
  }

  return { bucket, path: objectPath }
}

export async function downloadResumeJSONFromSupabase(
  bucket: string,
  storagePath: string
): Promise<unknown> {
  const supabase = getSupabaseServiceRoleClient()
  const { data, error } = await supabase.storage.from(bucket).download(storagePath)

  if (error || !data) {
    throw new Error(`Supabase JSON download failed: ${error?.message || "Unknown error"}`)
  }

  return JSON.parse(Buffer.from(await data.arrayBuffer()).toString("utf-8"))
}

export async function createGeneratedPDFSignedUrl(
  bucket: string,
  storagePath: string,
  expiresInSeconds = 300
): Promise<string> {
  const supabase = getSupabaseServiceRoleClient()
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(storagePath, expiresInSeconds)

  if (error || !data?.signedUrl) {
    throw new Error(`Supabase signed URL failed: ${error?.message || "Unknown error"}`)
  }

  return data.signedUrl
}

// Download generated PDF from Supabase Storage
export async function downloadGeneratedPDFFromSupabase(
  bucket: string,
  storagePath: string
): Promise<Buffer> {
  const supabase = getSupabaseServiceRoleClient()
  const { data, error } = await supabase.storage.from(bucket).download(storagePath)

  if (error || !data) {
    throw new Error(`Supabase PDF download failed: ${error?.message || "Unknown error"}`)
  }

  return Buffer.from(await data.arrayBuffer())
}

export async function downloadUploadedFileFromSupabase(
  bucket: string,
  storagePath: string,
  fileId: string,
  extension: string
): Promise<{ filePath: string; cleanup: () => Promise<void> }> {
  const supabase = getSupabaseServiceRoleClient()
  const { data, error } = await supabase.storage.from(bucket).download(storagePath)

  if (error || !data) {
    throw new Error(`Supabase download failed: ${error?.message || "Unknown error"}`)
  }

  const tempDir = path.join(os.tmpdir(), "kairoscv", "supabase-inputs")
  await fs.ensureDir(tempDir)

  const safeExtension = extension.startsWith(".") ? extension : `.${extension}`
  const filePath = path.join(tempDir, `${fileId}${safeExtension}`)
  const buffer = Buffer.from(await data.arrayBuffer())

  await fs.writeFile(filePath, buffer)

  return {
    filePath,
    cleanup: async () => {
      await fs.remove(filePath)
    },
  }
}
