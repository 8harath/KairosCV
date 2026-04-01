import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getSupabaseCookieAdapter } from "@/lib/supabase/cookies"
import { isAuthBypassed } from "@/lib/config/env"
import WorkspaceShell from "@/components/workspace-shell"
import OptimizeClient from "@/components/optimize-client"

export const dynamic = "force-dynamic"

export default async function OptimizePage() {
  const authBypassed = isAuthBypassed()

  let email = ""
  let displayName = ""
  let avatarUrl: string | null = null

  if (!authBypassed) {
    const supabase = createSupabaseServerClient(await getSupabaseCookieAdapter())
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login")
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email, avatar_url")
      .eq("id", user.id)
      .maybeSingle()

    email = profile?.email || user.email || ""
    displayName = profile?.full_name || user.user_metadata?.full_name || ""
    avatarUrl = profile?.avatar_url || null
  }

  return (
    <WorkspaceShell
      title="Optimize"
      description="Upload a draft. We'll restructure, improve phrasing, and generate a clean PDF."
      userLabel={email}
      avatarUrl={avatarUrl}
      userName={displayName}
    >
      <OptimizeClient authBypassed={authBypassed} />
    </WorkspaceShell>
  )
}
