import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getSupabaseCookieAdapter } from "@/lib/supabase/cookies"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const origin = requestUrl.origin
  const headerStore = await headers()
  const forwardedHost = headerStore.get("x-forwarded-host")
  const forwardedProto = headerStore.get("x-forwarded-proto") ?? "https"
  const baseUrl = forwardedHost ? `${forwardedProto}://${forwardedHost}` : origin
  const redirectTo = `${baseUrl}/auth/callback`

  const supabase = createSupabaseServerClient(await getSupabaseCookieAdapter())
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  })

  if (error || !data.url) {
    return NextResponse.redirect(new URL("/login?error=oauth_start_failed", baseUrl))
  }

  return NextResponse.redirect(data.url)
}
