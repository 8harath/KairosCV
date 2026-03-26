"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, User } from "lucide-react"
import { AvatarDisplay, AvatarPicker } from "@/components/avatar"
import { signOutWithSupabase } from "@/lib/supabase/auth"
import { toast } from "@/hooks/use-toast"

interface SettingsClientProps {
  email: string
  displayName: string
  avatarUrl: string | null
  trialLimit: number
  memberSince: string
}

export default function SettingsClient({
  email,
  displayName,
  avatarUrl,
  trialLimit,
  memberSince,
}: SettingsClientProps) {
  const router = useRouter()
  const [currentAvatar, setCurrentAvatar] = useState(avatarUrl)
  const [saving, setSaving] = useState(false)

  const handleAvatarSelect = async (newAvatar: string) => {
    setCurrentAvatar(newAvatar)
    setSaving(true)
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar_url: newAvatar }),
      })
      if (!res.ok) throw new Error("Failed to update avatar")
      toast({ title: "Avatar updated" })
      router.refresh()
    } catch {
      toast({ title: "Failed to update avatar", variant: "destructive" })
      setCurrentAvatar(avatarUrl)
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await signOutWithSupabase()
    router.push("/")
    router.refresh()
  }

  const formattedDate = memberSince
    ? new Date(memberSince).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently"

  return (
    <div className="space-y-6">
      {/* Profile section */}
      <div className="surface-panel p-6">
        <div className="flex items-start gap-5">
          <AvatarDisplay
            avatarUrl={currentAvatar}
            email={email}
            name={displayName}
            size="lg"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-medium text-foreground">
              {displayName || "No name set"}
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">{email}</p>
            <p className="mt-1 text-xs text-muted-foreground">Member since {formattedDate}</p>
          </div>
        </div>
      </div>

      {/* Avatar picker */}
      <div className="surface-panel p-6">
        <AvatarPicker
          currentAvatar={currentAvatar}
          name={displayName}
          email={email}
          onSelect={handleAvatarSelect}
        />
        {saving ? (
          <p className="mt-3 text-xs text-muted-foreground">Saving...</p>
        ) : null}
      </div>

      {/* Plan & limits */}
      <div className="surface-panel p-6">
        <h3 className="text-sm font-medium text-foreground">Plan</h3>
        <p className="mt-1 text-sm text-muted-foreground">Free plan with trial-based usage.</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-secondary/30 px-4 py-3">
            <p className="text-xs font-medium text-muted-foreground">Generations per cycle</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{trialLimit}</p>
          </div>
          <div className="rounded-lg bg-secondary/30 px-4 py-3">
            <p className="text-xs font-medium text-muted-foreground">Reset window</p>
            <p className="mt-1 text-lg font-semibold text-foreground">24 hours</p>
          </div>
        </div>
      </div>

      {/* Sign out */}
      <div className="surface-panel p-6">
        <h3 className="text-sm font-medium text-foreground">Account</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Signed in with Google via Supabase Auth.
        </p>
        <button
          onClick={handleSignOut}
          className="btn-secondary mt-4"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  )
}
