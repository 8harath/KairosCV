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
    "border-2 border-primary px-4 py-2 font-bold text-xs uppercase transition-all",
    isPrimary
      ? "bg-primary text-primary-foreground hover:translate-x-[-2px] hover:translate-y-[-2px]"
      : "bg-background text-foreground hover:translate-x-[-2px] hover:translate-y-[-2px]",
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
    return <div className="text-xs font-bold uppercase text-muted-foreground">Auth loading</div>
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
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
    <div className="flex items-center gap-2">
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
