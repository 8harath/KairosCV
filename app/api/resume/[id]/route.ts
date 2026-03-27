import { NextResponse } from "next/server"
import { isAuthBypassed } from "@/lib/config/env"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getSupabaseCookieAdapter } from "@/lib/supabase/cookies"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (isAuthBypassed()) {
    return NextResponse.json({ error: "Not available in dev mode" }, { status: 400 })
  }

  const supabase = createSupabaseServerClient(await getSupabaseCookieAdapter())
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // RLS ensures only own rows can be deleted
  const { error } = await supabase
    .from("generated_resumes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
