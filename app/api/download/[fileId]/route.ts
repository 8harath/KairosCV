import { NextResponse } from "next/server"
import { cleanupFileArtifacts, getFileMetadata, downloadGeneratedPDF, getGeneratedFilePath, fileExists } from "@/lib/file-storage"
import { isValidFileId } from "@/lib/security/file-id"
import { isAuthBypassed, isPaywallEnabled, shouldUseSupabaseStorage } from "@/lib/config/env"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getSupabaseCookieAdapter } from "@/lib/supabase/cookies"
import { getPlanStatusByEmail } from "@/lib/payments/plan-service"
import { createGeneratedPDFSignedUrl } from "@/lib/storage/supabase-storage"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request, { params }: { params: Promise<{ fileId: string }> }) {
  const { fileId } = await params
  if (!isValidFileId(fileId)) {
    return NextResponse.json({ error: "Invalid file id" }, { status: 400 })
  }

  try {
    // Auth check
    let userEmail: string | null = null
    let userId: string | null = null
    if (!isAuthBypassed()) {
      const supabase = createSupabaseServerClient(await getSupabaseCookieAdapter())
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      userId = user.id
      userEmail = user.email ?? null
    }

    // Check if this is a preview request (inline) or download request
    const url = new URL(request.url)
    const isPreview = url.searchParams.get('preview') === 'true'

    // Get file metadata
    const metadata = await getFileMetadata(fileId)
    if (!metadata) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    if (!isAuthBypassed() && metadata.userId && metadata.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Paywall gate: full downloads of a preview-flagged job require a pro plan.
    // Inline previews always allowed (client renders them blurred). The flag
    // only exists on metadata if the upload exceeded the free trial limit.
    if (metadata.preview && !isPreview && isPaywallEnabled()) {
      const planEmail = userEmail ?? metadata.email ?? null
      const planStatus = await getPlanStatusByEmail(planEmail)
      if (!planStatus.isPro) {
        return NextResponse.json(
          {
            error: "Upgrade required to download the full PDF.",
            paywall: { required: true },
          },
          { status: 402 },
        )
      }
    }

    if (shouldUseSupabaseStorage() && metadata.output?.bucket && metadata.output?.path) {
      const signedUrl = await createGeneratedPDFSignedUrl(metadata.output.bucket, metadata.output.path)
      return NextResponse.redirect(signedUrl)
    }

    let pdfBuffer: Buffer

    // Try Supabase storage first (if output location is set), then local filesystem
    if (metadata.output?.bucket && metadata.output?.path) {
      pdfBuffer = await downloadGeneratedPDF(fileId, metadata.output)
    } else {
      // Local filesystem fallback
      const pdfPath = getGeneratedFilePath(fileId)
      if (!(await fileExists(pdfPath))) {
        return NextResponse.json(
          { error: "Generated PDF not found. The file may still be processing." },
          { status: 404 }
        )
      }
      const { readFile } = await import("fs-extra")
      pdfBuffer = await readFile(pdfPath)
    }

    if (!isPreview) {
      await cleanupFileArtifacts(fileId, metadata.filename)
    }

    // Set Content-Disposition based on preview mode
    const disposition = isPreview
      ? 'inline'
      : `attachment; filename="optimized_resume_${fileId}.pdf"`

    return new NextResponse(new Uint8Array(pdfBuffer), {
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
