import { type NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { cleanupExpiredArtifacts, saveUploadedFile, saveFileMetadata } from "@/lib/file-storage"
import { getSafeExtension, isAllowedMimeType, isValidFileSignature } from "@/lib/security/file-validation"
import { consumeTrial, isValidEmail, normalizeEmail } from "@/lib/trials"
import { isAuthBypassed, isTrialLimitEnabled, shouldUseSupabaseStorage } from "@/lib/config/env"
import { saveUploadedFileToSupabase } from "@/lib/storage/supabase-storage"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    // Opportunistic garbage collection for stale files.
    void cleanupExpiredArtifacts().catch((error) => {
      console.warn("Background cleanup failed:", error)
    })

    const formData = await request.formData()
    const rawFile = formData.get("file")
    const file = rawFile instanceof File ? rawFile : null
    const emailValue = formData.get("email")
    const providedEmail = typeof emailValue === "string" ? normalizeEmail(emailValue) : ""
    const authBypassed = isAuthBypassed()
    const emailRequired = !authBypassed
    const email = providedEmail || `guest-${randomUUID()}@kairoscv.local`

    if (!file) {
      return NextResponse.json({ detail: "No file provided" }, { status: 400 })
    }
    if (emailRequired && !isValidEmail(providedEmail)) {
      return NextResponse.json({ detail: "A valid email is required." }, { status: 400 })
    }

    let trial:
      | {
          allowed: boolean
          remaining: number
          resetAt: string
        }
      | undefined

    if (isTrialLimitEnabled()) {
      trial = await consumeTrial(email)
      if (!trial.allowed) {
        return NextResponse.json(
          {
            detail: "Free trial limit reached. You can try again after the reset time.",
            trial: {
              remaining: trial.remaining,
              resetAt: trial.resetAt,
            },
          },
          { status: 429 }
        )
      }
    }

    const extension = getSafeExtension(file.name)
    if (!extension || !isAllowedMimeType(file.type)) {
      return NextResponse.json({ detail: "Invalid file type. Allowed: PDF, DOCX, TXT" }, { status: 400 })
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ detail: "File too large. Maximum size: 5MB" }, { status: 400 })
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer())
    if (!isValidFileSignature(fileBuffer, extension)) {
      return NextResponse.json({ detail: "Invalid file content for selected type." }, { status: 400 })
    }

    // Generate a cryptographically secure file identifier.
    const fileId = randomUUID()
    const usingSupabaseStorage = shouldUseSupabaseStorage()
    let storage:
      | {
          bucket: string
          path: string
        }
      | undefined

    if (usingSupabaseStorage) {
      storage = await saveUploadedFileToSupabase(fileId, file.name, fileBuffer, file.type)
    } else {
      // Save file to filesystem until the full processing pipeline is migrated.
      await saveUploadedFile(fileId, file.name, fileBuffer)
    }

    await saveFileMetadata({
      fileId,
      filename: file.name,
      size: file.size,
      type: file.type,
      email,
      uploadedAt: new Date(),
      storage,
    })

    return NextResponse.json({
      file_id: fileId,
      filename: file.name,
      size: file.size,
      trial: trial
        ? {
            remaining: trial.remaining,
            resetAt: trial.resetAt,
          }
        : undefined,
      auth_bypassed: authBypassed,
      storage_mode: usingSupabaseStorage ? "supabase" : "local",
      message: "File uploaded successfully",
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ detail: "Upload failed. Please try again." }, { status: 500 })
  }
}
