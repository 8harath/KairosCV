"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogOut } from "lucide-react"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"
import { signOutWithSupabase } from "@/lib/supabase/auth"
import { AvatarDisplay } from "@/components/avatar"
import { Button } from "@/components/ui/button"

interface AuthState {
  email: string
  name?: string
  avatarUrl?: string
}

export default function AuthButtons() {
  const router = useRouter()
  const [user, setUser] = useState<AuthState | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    let isMounted = true

    void (async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!isMounted || !authUser?.email) {
        if (isMounted) setLoading(false)
        return
      }

      // Fetch profile for avatar
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", authUser.id)
        .maybeSingle()

      if (isMounted) {
        setUser({
          email: authUser.email,
          name: profile?.full_name || authUser.user_metadata?.full_name || "",
          avatarUrl: profile?.avatar_url || null,
        })
        setLoading(false)
      }
    })()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        setUser({
          email: session.user.email,
          name: session.user.user_metadata?.full_name || "",
        })
      } else {
        setUser(null)
      }
      setLoading(false)
      router.refresh()
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [router])

  if (loading) {
    return <div className="h-7 w-7 animate-pulse rounded-full bg-secondary" />
  }

  if (!user) {
    return (
      <Link href="/auth/login" className="btn text-sm">
        Sign in
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/dashboard" className="hidden items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-secondary md:flex">
        <AvatarDisplay avatarUrl={user.avatarUrl} email={user.email} name={user.name} size="sm" />
        <span className="max-w-[140px] truncate text-sm text-foreground">{user.name || user.email}</span>
      </Link>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={async () => {
          await signOutWithSupabase()
          router.push("/")
          router.refresh()
        }}
      >
        <LogOut className="h-3.5 w-3.5" />
        <span className="sr-only">Sign out</span>
      </Button>
    </div>
  )
}
