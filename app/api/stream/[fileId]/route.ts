import { NextRequest } from "next/server"
import { processResume, ProcessingProgress } from "@/lib/resume-processor"
import { getFileMetadata, resolveUploadedFile } from "@/lib/file-storage"
import { isValidFileId } from "@/lib/security/file-id"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params
  if (!isValidFileId(fileId)) {
    return new Response(
      JSON.stringify({ error: "Invalid file id" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }

  // Get file metadata
  const metadata = await getFileMetadata(fileId)
  if (!metadata) {
    return new Response(
      JSON.stringify({ error: "File not found" }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }
    )
  }

  // Create a readable stream for Server-Sent Events
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        const message = `data: ${JSON.stringify(data)}\n\n`
        controller.enqueue(encoder.encode(message))
      }

      try {
        try {
          const resolvedUpload = await resolveUploadedFile(fileId, metadata.filename, metadata.storage)
          if (resolvedUpload.cleanup) {
            await resolvedUpload.cleanup().catch((error) => {
              console.warn("Failed to clean up temporary upload during preflight:", error)
            })
          }
        } catch {
          send({ stage: "error", progress: 0, message: "File not found", error: "File was not uploaded correctly" })
          controller.close()
          return
        }

        // Capture confidence score from progress updates
        let confidenceScore: ProcessingProgress["confidence"] = undefined

        // Process resume and stream progress updates
        for await (const progress of processResume(fileId, metadata.type, metadata.filename)) {
          // Capture confidence score when available
          if (progress.confidence) {
            confidenceScore = progress.confidence
          }

          // Don't send the "complete" stage from processor yet
          if (progress.stage !== "complete") {
            send(progress)
          }
        }

        // Always send final completion message with download URL and confidence
        send({
          stage: "complete",
          progress: 100,
          message: "Resume optimization complete!",
          download_url: `/api/download/${fileId}`,
          confidence: confidenceScore, // Include confidence score in final message
        })

        // Small delay to ensure message is sent before closing
        await new Promise(resolve => setTimeout(resolve, 100))
        controller.close()
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        send({
          stage: "error",
          progress: 0,
          message: "Processing failed",
          error: errorMessage,
        })
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no", // Disable nginx buffering
    },
  })
}

