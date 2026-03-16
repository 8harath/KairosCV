"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"
import { signOutWithSupabase } from "@/lib/supabase/auth"

interface AuthState {
  email: string
}

function actionButtonClassName(isPrimary: boolean): string {
  return [
    "inline-flex items-center justify-center border px-3 py-2 font-bold text-[11px] uppercase tracking-[0.14em] transition-all",
    isPrimary
      ? "border-primary bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(0,0,0,0.16)] hover:translate-y-[-1px]"
      : "border-border bg-white/90 text-foreground hover:bg-secondary hover:translate-y-[-1px]",
  ].join(" ")
}

export default function AuthButtons() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<AuthState | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()

    let isMounted = true
    void supabase.auth.getUser().then(({ data }) => {
      if (!isMounted) {
        return
      }

      setUser(data.user?.email ? { email: data.user.email } : null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user?.email ? { email: session.user.email } : null)
      setLoading(false)
      router.refresh()
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [router])

  if (loading) {
    return <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Auth</div>
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2 max-md:flex-col max-md:items-stretch">
        {pathname !== "/login" ? (
          <Link href="/login" className={actionButtonClassName(false)}>
            Log In
          </Link>
        ) : null}
        {pathname !== "/signup" ? (
          <Link href="/signup" className={actionButtonClassName(true)}>
            Sign Up
          </Link>
        ) : null}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 max-md:flex-col max-md:items-stretch">
      <Link href="/dashboard" className={actionButtonClassName(false)}>
        Dashboard
      </Link>
      <button
        type="button"
        onClick={async () => {
          await signOutWithSupabase()
          router.push("/")
          router.refresh()
        }}
        className={actionButtonClassName(true)}
      >
        Sign Out
      </button>
    </div>
  )
}
