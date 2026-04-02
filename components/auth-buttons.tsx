"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogOut, Settings } from "lucide-react"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"
import { signOutWithSupabase } from "@/lib/supabase/auth"
import { AvatarDisplay } from "@/components/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

    const handleAvatarChanged = (e: Event) => {
      const detail = (e as CustomEvent).detail as string
      setUser((prev) => prev ? { ...prev, avatarUrl: detail } : prev)
    }
    window.addEventListener("avatar-changed", handleAvatarChanged)

    return () => {
      isMounted = false
      subscription.unsubscribe()
      window.removeEventListener("avatar-changed", handleAvatarChanged)
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-secondary outline-none">
          <AvatarDisplay avatarUrl={user.avatarUrl} email={user.email} name={user.name} size="sm" />
          <span className="hidden max-w-[140px] truncate text-sm text-foreground md:block">
            {user.name || user.email}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <p className="text-sm font-medium text-foreground">{user.name || "Account"}</p>
          <p className="text-xs font-normal text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex w-full items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await signOutWithSupabase()
            router.push("/")
            router.refresh()
          }}
          className="text-muted-foreground focus:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
