import Link from "next/link"
import { redirect } from "next/navigation"
import { Plus, Sparkles } from "lucide-react"
import Header from "@/components/header"
import ResumeList from "@/components/resume-list"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getSupabaseCookieAdapter } from "@/lib/supabase/cookies"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Dashboard | KairosCV",
  description: "Your resume optimization workspace",
}

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
    .select("full_name, email, avatar_url, trial_limit, created_at")
    .eq("id", user.id)
    .maybeSingle()

  const { data: resumes } = await supabase
    .from("generated_resumes")
    .select("id, job_id, title, original_filename, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  const displayName = profile?.full_name || user.user_metadata.full_name || "Welcome"
  const email = profile?.email || user.email || ""
  const trialLimit = profile?.trial_limit ?? 3
  const resumeCount = resumes?.length ?? 0

  return (
    <>
      <Header />
      <main className="container py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">{displayName}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{email}</p>
          </div>
          <Link href="/optimize" className="btn inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New resume
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="surface-panel p-5">
            <p className="text-xs font-medium text-muted-foreground">Generations left</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{trialLimit}</p>
            <p className="mt-1 text-xs text-muted-foreground">per 24-hour window</p>
          </div>
          <div className="surface-panel p-5">
            <p className="text-xs font-medium text-muted-foreground">Resumes created</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{resumeCount}</p>
            <p className="mt-1 text-xs text-muted-foreground">in your workspace</p>
          </div>
          <div className="surface-panel p-5">
            <p className="text-xs font-medium text-muted-foreground">Plan</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">Free</p>
            <p className="mt-1 text-xs text-muted-foreground">
              since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "recently"}
            </p>
          </div>
        </div>

        {/* Onboarding banner for new users */}
        {resumeCount === 0 && (
          <div className="mt-6 rounded-md border border-border bg-muted/30 p-6">
            <h2 className="text-sm font-semibold text-foreground">Welcome to KairosCV</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              You have {trialLimit} free resume generations per 24-hour window. Upload your first resume to get started.
            </p>
            <Link href="/optimize" className="btn mt-4 inline-flex items-center gap-2">
              Get started
            </Link>
          </div>
        )}

        {/* Recent resumes */}
        <div className="mt-6 surface-panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-foreground">Recent resumes</h2>
            <Link href="/optimize" className="text-sm text-muted-foreground hover:text-foreground">
              Create new
            </Link>
          </div>

          {resumes && resumes.length > 0 ? (
            <ResumeList initialResumes={resumes} />
          ) : (
            <div className="mt-6 py-8 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-muted-foreground/50" />
              <p className="mt-3 text-sm font-medium text-foreground">No resumes yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Upload a resume to get started.
              </p>
              <Link href="/optimize" className="btn mt-4 inline-flex">
                Create first resume
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
