import { type NextRequest, NextResponse } from "next/server"
import { saveUploadedFile, saveFileMetadata } from "@/lib/file-storage"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ detail: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ]
    const fileName = file.name.toLowerCase()
    const validExtensions = [".pdf", ".docx", ".txt"]
    const hasValidExtension = validExtensions.some((ext) => fileName.endsWith(ext))

    if (!allowedTypes.includes(file.type) && !hasValidExtension) {
      return NextResponse.json({ detail: "Invalid file type. Allowed: PDF, DOCX, TXT" }, { status: 400 })
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ detail: "File too large. Maximum size: 5MB" }, { status: 400 })
    }

    // Generate a unique file ID using crypto
    const fileId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    // Save file to filesystem
    await saveUploadedFile(fileId, file)

    // Save file metadata
    await saveFileMetadata({
      fileId,
      filename: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
    })

    return NextResponse.json({
      file_id: fileId,
      filename: file.name,
      size: file.size,
      message: "File uploaded successfully",
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ detail: "Upload failed. Please try again." }, { status: 500 })
  }
}
