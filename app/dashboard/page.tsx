import Link from "next/link"
import { redirect } from "next/navigation"
import { Clock3, FileClock, FolderOpen, Sparkles } from "lucide-react"
import WorkspaceShell from "@/components/workspace-shell"
import { Button } from "@/components/ui/button"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getSupabaseCookieAdapter } from "@/lib/supabase/cookies"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
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

  const { data: resumes } = await supabase
    .from("generated_resumes")
    .select("id, title, original_filename, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  const displayName = profile?.full_name || user.user_metadata.full_name || "Welcome back"
  const email = profile?.email || user.email || ""

  return (
    <WorkspaceShell
      title={displayName}
      description={`Signed in as ${email}. Your free plan includes ${profile?.trial_limit ?? 3} resume generations every 24 hours.`}
      userLabel={email}
      actions={
        <Link href="/optimize">
          <Button>
            <Sparkles className="h-4 w-4" />
            New resume
          </Button>
        </Link>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="surface-panel p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Plan</p>
              <p className="text-sm text-muted-foreground">Free workspace</p>
            </div>
          </div>
          <p className="mt-4 text-2xl font-semibold text-foreground">{profile?.trial_limit ?? 3}</p>
          <p className="mt-1 text-sm">Generations available per 24-hour cycle.</p>
        </div>

        <div className="surface-panel p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary">
              <FolderOpen className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Saved resumes</p>
              <p className="text-sm text-muted-foreground">Recent generation history</p>
            </div>
          </div>
          <p className="mt-4 text-2xl font-semibold text-foreground">{resumes?.length ?? 0}</p>
          <p className="mt-1 text-sm">Records available in your workspace right now.</p>
        </div>

        <div className="surface-panel p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary">
              <Clock3 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Member since</p>
              <p className="text-sm text-muted-foreground">Account creation</p>
            </div>
          </div>
          <p className="mt-4 text-lg font-semibold text-foreground">
            {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "Recently"}
          </p>
          <p className="mt-1 text-sm">Google authentication is active through Supabase Auth.</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="surface-panel-strong p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">Recent resumes</p>
              <p className="mt-1 text-sm">Keep track of the latest generated outputs and return to them when needed.</p>
            </div>
            <Link href="/optimize" className="soft-link">
              Start new
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            {resumes && resumes.length > 0 ? (
              resumes.map((resume) => (
                <div key={resume.id} className="rounded-2xl border border-border/80 bg-card px-4 py-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{resume.title}</p>
                      <p className="truncate text-sm text-muted-foreground">{resume.original_filename}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{new Date(resume.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <FileClock className="mx-auto h-10 w-10 text-muted-foreground" />
                <h2 className="mt-4 text-xl">No resume history yet</h2>
                <p className="mx-auto mt-2 max-w-md text-sm">
                  Generate your first ATS-optimized resume to start building a clearer, persistent workspace.
                </p>
                <Link href="/optimize" className="btn mt-6">
                  Create first resume
                </Link>
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="surface-panel p-5">
            <p className="text-sm font-medium text-foreground">Workspace notes</p>
            <p className="mt-3 text-sm">
              Supabase-backed trial tracking is active. Storage migration is still being completed, so the dashboard is prepared for fuller history views as persistence expands.
            </p>
          </div>
          <div className="surface-panel p-5">
            <p className="text-sm font-medium text-foreground">Next best action</p>
            <p className="mt-3 text-sm">Upload a new resume draft, review the generated PDF, and save the strongest version for future applications.</p>
          </div>
        </aside>
      </div>
    </WorkspaceShell>
  )
}
