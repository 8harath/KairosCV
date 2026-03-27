import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getSupabaseCookieAdapter } from "@/lib/supabase/cookies"
import WorkspaceShell from "@/components/workspace-shell"
import SettingsClient from "@/components/settings-client"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Settings | KairosCV",
  description: "Manage your KairosCV account and preferences",
}

export default async function SettingsPage() {
  const supabase = createSupabaseServerClient(await getSupabaseCookieAdapter())
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, avatar_url, trial_limit, created_at")
    .eq("id", user.id)
    .maybeSingle()

  const email = profile?.email || user.email || ""
  const displayName = profile?.full_name || user.user_metadata?.full_name || ""
  const trialLimit = profile?.trial_limit ?? 3

  return (
    <WorkspaceShell
      title="Settings"
      description="Manage your profile and account."
      userLabel={email}
      avatarUrl={profile?.avatar_url}
      userName={displayName}
    >
      <SettingsClient
        email={email}
        displayName={displayName}
        avatarUrl={profile?.avatar_url || null}
        trialLimit={trialLimit}
        memberSince={profile?.created_at || user.created_at || ""}
      />
    </WorkspaceShell>
  )
}
