import { randomUUID } from "crypto"
import path from "path"
import { getSupabaseInputBucket } from "@/lib/config/env"
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
  contentType: string
): Promise<StoredUpload> {
  const bucket = getSupabaseInputBucket()
  const safeFilename = sanitizeFilename(filename)
  const objectPath = `uploads/${fileId}/${randomUUID()}-${safeFilename}`
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
