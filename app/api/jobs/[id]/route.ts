import { NextResponse } from "next/server"
import { isAuthBypassed, isSupabaseConfigured, shouldUseSupabaseStorage } from "@/lib/config/env"
import { isValidFileId } from "@/lib/security/file-id"
import { createSupabaseServerClient, getSupabaseServiceRoleClient } from "@/lib/supabase/server"
import { getSupabaseCookieAdapter } from "@/lib/supabase/cookies"
import { getFileMetadata } from "@/lib/file-storage"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!isValidFileId(id)) {
    return NextResponse.json({ error: "Invalid job id" }, { status: 400 })
  }

  let userId: string | null = null
  if (!isAuthBypassed()) {
    const supabase = createSupabaseServerClient(await getSupabaseCookieAdapter())
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    userId = user.id
  }

  if (shouldUseSupabaseStorage() && isSupabaseConfigured()) {
    const serviceClient = getSupabaseServiceRoleClient()
    const { data, error } = await serviceClient
      .from("processing_jobs")
      .select("id, user_id, status, stage, progress, confidence, error_message, output_path, json_path, created_at, started_at, completed_at")
      .eq("id", id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }
    if (!isAuthBypassed() && data.user_id && data.user_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json({
      id: data.id,
      status: data.status,
      stage: data.stage,
      progress: data.progress,
      error: data.error_message,
      confidence: data.confidence,
      download_url: data.output_path ? `/api/download/${data.id}` : null,
      json_available: Boolean(data.json_path),
      created_at: data.created_at,
      started_at: data.started_at,
      completed_at: data.completed_at,
    })
  }

  const metadata = await getFileMetadata(id)
  if (!metadata) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 })
  }
  if (!isAuthBypassed() && metadata.userId && metadata.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json({
    id,
    status: metadata.output ? "completed" : "queued",
    stage: metadata.output ? "complete" : "queued",
    progress: metadata.output ? 100 : 0,
    error: null,
    confidence: null,
    download_url: metadata.output ? `/api/download/${id}` : null,
    json_available: Boolean(metadata.json),
    created_at: metadata.uploadedAt.toISOString(),
    started_at: null,
    completed_at: null,
  })
}
