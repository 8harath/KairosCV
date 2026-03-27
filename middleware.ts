import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

const PROTECTED_PATHS = ["/dashboard", "/settings", "/optimize"]

function createSupabaseMiddlewareClient(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) return null

  let response = NextResponse.next({ request })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value)
        }
        response = NextResponse.next({ request })
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options)
        }
      },
    },
  })

  return { supabase, getResponse: () => response }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip auth check if auth is disabled (local dev)
  if (process.env.NEXT_PUBLIC_DISABLE_AUTH === "true") {
    return NextResponse.next()
  }

  const client = createSupabaseMiddlewareClient(request)
  if (!client) return NextResponse.next()

  const { supabase, getResponse } = client
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect authenticated users from landing page to dashboard
  if (pathname === "/" && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Redirect authenticated users from login to dashboard
  if (pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Protect routes — redirect unauthenticated users to login
  const isProtected = PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))
  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return getResponse()
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*", "/settings/:path*", "/optimize/:path*"],
}
