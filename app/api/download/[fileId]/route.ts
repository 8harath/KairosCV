import { NextResponse } from "next/server"
import { getGeneratedFilePath, fileExists, getFileMetadata } from "@/lib/file-storage"
import { readFile } from "fs-extra"

export async function GET(request: Request, { params }: { params: { fileId: string } }) {
  const { fileId } = params

  try {
    // Get file metadata
    const metadata = getFileMetadata(fileId)
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

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="optimized_resume_${fileId}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
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
