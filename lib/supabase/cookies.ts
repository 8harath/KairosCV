import { cookies } from "next/headers"

export async function getSupabaseCookieAdapter() {
  const cookieStore = await cookies()

  return {
    getAll() {
      return cookieStore.getAll()
    },
    setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
      for (const cookie of cookiesToSet) {
        cookieStore.set(cookie.name, cookie.value, cookie.options ?? {})
      }
    },
  }
}
