import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getSupabaseCookieAdapter } from "@/lib/supabase/cookies"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function PATCH(request: NextRequest) {
  const supabase = createSupabaseServerClient(await getSupabaseCookieAdapter())
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { avatar_url } = body

  if (typeof avatar_url !== "string" || (!avatar_url.startsWith("dicebear:") && !avatar_url.startsWith("preset:"))) {
    return NextResponse.json({ error: "Invalid avatar value" }, { status: 400 })
  }

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url, updated_at: new Date().toISOString() })
    .eq("id", user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, avatar_url })
}
