import Link from "next/link"
import { redirect } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/Footer"
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

  return (
    <>
      <Header />
      <main className="page-shell pt-32 md:pt-40">
        <section className="container mx-auto px-4 py-12">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="section-header-kicker mb-3">
                Dashboard
              </div>
              <h1 className="text-4xl font-black">
                {profile?.full_name || user.user_metadata.full_name || "Welcome back"}
              </h1>
              <p className="mt-3 text-muted-foreground">
                Signed in as {profile?.email || user.email}. Your current free plan includes {profile?.trial_limit ?? 3} generations every 24 hours.
              </p>
            </div>

            <Link
              href="/optimize"
              className="btn inline-flex items-center justify-center text-sm"
            >
              Generate Resume
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="metric-tile">
              <p className="text-xs font-black uppercase text-muted-foreground">Account</p>
              <p className="mt-3 text-lg font-black">{profile?.email || user.email}</p>
              <p className="mt-2 text-sm text-muted-foreground">Google authentication is active through Supabase.</p>
            </div>

            <div className="metric-tile">
              <p className="text-xs font-black uppercase text-muted-foreground">Plan</p>
              <p className="mt-3 text-lg font-black">Free Trial</p>
              <p className="mt-2 text-sm text-muted-foreground">3 resume generations every 24 hours.</p>
            </div>

            <div className="metric-tile">
              <p className="text-xs font-black uppercase text-muted-foreground">Storage</p>
              <p className="mt-3 text-lg font-black">{resumes?.length ?? 0} saved records</p>
              <p className="mt-2 text-sm text-muted-foreground">Your generated resume history will appear here as storage cutover completes.</p>
            </div>
          </div>

          <div className="surface-panel-strong mt-10 p-6 md:p-8">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black">Recent Resumes</h2>
              <Link href="/optimize" className="soft-link">
                Start New
              </Link>
            </div>

            {resumes && resumes.length > 0 ? (
              <div className="space-y-4">
                {resumes.map((resume) => (
                  <div key={resume.id} className="surface-panel p-4">
                    <p className="font-black">{resume.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{resume.original_filename}</p>
                    <p className="mt-1 text-xs uppercase text-muted-foreground">
                      Created {new Date(resume.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-border bg-white/70 p-6 text-sm text-muted-foreground">
                No saved resumes yet. Generate your first ATS-optimized resume from the optimizer.
              </div>
            )}
          </div>
        </section>
        <Footer />
      </main>
    </>
  )
}
