import { redirect } from "next/navigation"
import { Bell, CreditCard, ShieldCheck, UserRound } from "lucide-react"
import WorkspaceShell from "@/components/workspace-shell"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getSupabaseCookieAdapter } from "@/lib/supabase/cookies"

export const dynamic = "force-dynamic"

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
    .select("full_name, email, trial_limit, created_at")
    .eq("id", user.id)
    .maybeSingle()

  const email = profile?.email || user.email || ""

  return (
    <WorkspaceShell
      title="Settings"
      description="Manage account details, trial limits, and the product defaults that matter today."
      userLabel={email}
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-6">
          <section className="surface-panel-strong p-6 md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary">
                <UserRound className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Profile</p>
                <p className="text-sm text-muted-foreground">Current account identity from Supabase Auth.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="metric-tile">
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Full name</p>
                <p className="mt-2 text-sm font-medium text-foreground">{profile?.full_name || user.user_metadata.full_name || "Not set yet"}</p>
              </div>
              <div className="metric-tile">
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Email</p>
                <p className="mt-2 text-sm font-medium text-foreground">{email}</p>
              </div>
            </div>
          </section>

          <section className="surface-panel p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary">
                <CreditCard className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Free plan</p>
                <p className="text-sm text-muted-foreground">Current usage model in production.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="metric-tile">
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Trial limit</p>
                <p className="mt-2 text-sm font-medium text-foreground">{profile?.trial_limit ?? 3} generations</p>
              </div>
              <div className="metric-tile">
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Window</p>
                <p className="mt-2 text-sm font-medium text-foreground">24 hours</p>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="surface-panel p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">Authentication</p>
            </div>
            <p className="mt-3 text-sm">Google sign-in is enabled through Supabase Auth and your session is currently active.</p>
          </div>

          <div className="surface-panel p-5">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">Roadmap note</p>
            </div>
            <p className="mt-3 text-sm">This page is ready for future controls like notification preferences, storage settings, and resume defaults.</p>
          </div>
        </aside>
      </div>
    </WorkspaceShell>
  )
}
