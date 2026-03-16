import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getSupabaseCookieAdapter } from "@/lib/supabase/cookies"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const nextPath = requestUrl.searchParams.get("next") || "/dashboard"

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", requestUrl.origin))
  }

  const supabase = createSupabaseServerClient(await getSupabaseCookieAdapter())
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(new URL("/login?error=oauth_callback_failed", requestUrl.origin))
  }

  return NextResponse.redirect(new URL(nextPath, requestUrl.origin))
}
