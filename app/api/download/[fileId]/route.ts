import { NextResponse } from "next/server"
import { cleanupFileArtifacts, getGeneratedFilePath, fileExists, getFileMetadata } from "@/lib/file-storage"
import { readFile } from "fs-extra"
import { isValidFileId } from "@/lib/security/file-id"

export async function GET(request: Request, { params }: { params: Promise<{ fileId: string }> }) {
  const { fileId } = await params
  if (!isValidFileId(fileId)) {
    return NextResponse.json({ error: "Invalid file id" }, { status: 400 })
  }

  try {
    // Check if this is a preview request (inline) or download request
    const url = new URL(request.url)
    const isPreview = url.searchParams.get('preview') === 'true'

    // Get file metadata
    const metadata = await getFileMetadata(fileId)
    if (!metadata) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Check if generated PDF exists
    const pdfPath = getGeneratedFilePath(fileId)

    if (!(await fileExists(pdfPath))) {
      return NextResponse.json(
        { error: "Generated PDF not found. The file may still be processing." },
        { status: 404 }
      )
    }

    // Read and return the PDF
    const pdfBuffer = await readFile(pdfPath)

    if (!isPreview) {
      await cleanupFileArtifacts(fileId, metadata.filename)
    }

    // Set Content-Disposition based on preview mode
    const disposition = isPreview
      ? 'inline'
      : `attachment; filename="optimized_resume_${fileId}.pdf"`

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": disposition,
        "Content-Length": pdfBuffer.length.toString(),
        "Cache-Control": "private, no-store, max-age=0",
      },
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json(
      { error: "Failed to download PDF" },
      { status: 500 }
    )
  }
}
