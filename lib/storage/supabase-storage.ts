import { randomUUID } from "crypto"
import path from "path"
import fs from "fs-extra"
import os from "os"
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
