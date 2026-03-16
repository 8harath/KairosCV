"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ChevronDown, LogOut, LayoutDashboard, UserRound } from "lucide-react"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"
import { signOutWithSupabase } from "@/lib/supabase/auth"
import { Button } from "@/components/ui/button"

interface AuthState {
  email: string
}

function getInitial(email: string): string {
  return email.charAt(0).toUpperCase()
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
      if (!isMounted) return
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
    return <div className="hidden text-sm text-muted-foreground md:block">Loading...</div>
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        {pathname !== "/login" ? (
          <Link href="/login">
            <Button variant="ghost" className="hidden sm:inline-flex">
              Log in
            </Button>
          </Link>
        ) : null}
        {pathname !== "/signup" ? (
          <Link href="/signup">
            <Button>Get started</Button>
          </Link>
        ) : null}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/dashboard">
        <Button variant="outline" className="hidden md:inline-flex">
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Button>
      </Link>

      <div className="hidden items-center gap-3 rounded-full border border-border bg-white/90 px-2 py-1.5 md:flex">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-foreground">
          {getInitial(user.email)}
        </div>
        <div className="max-w-[180px] truncate text-sm text-foreground">{user.email}</div>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={async () => {
          await signOutWithSupabase()
          router.push("/")
          router.refresh()
        }}
      >
        <LogOut className="h-4 w-4" />
        <span className="sr-only">Sign out</span>
      </Button>

      <Link href="/dashboard" className="md:hidden">
        <Button variant="outline" size="icon">
          <UserRound className="h-4 w-4" />
          <span className="sr-only">Open dashboard</span>
        </Button>
      </Link>
    </div>
  )
}
