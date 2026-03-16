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
      <main className="min-h-screen bg-background text-foreground pt-32 md:pt-40">
        <section className="container mx-auto px-4 py-12">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-block border-2 border-primary bg-primary px-3 py-1 text-xs font-black uppercase text-primary-foreground">
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
              className="inline-flex items-center justify-center border-4 border-primary bg-primary px-6 py-4 text-sm font-black uppercase text-primary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            >
              Generate Resume
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="border-4 border-primary p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-xs font-black uppercase text-muted-foreground">Account</p>
              <p className="mt-3 text-lg font-black">{profile?.email || user.email}</p>
              <p className="mt-2 text-sm text-muted-foreground">Google authentication is active through Supabase.</p>
            </div>

            <div className="border-4 border-primary p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-xs font-black uppercase text-muted-foreground">Plan</p>
              <p className="mt-3 text-lg font-black">Free Trial</p>
              <p className="mt-2 text-sm text-muted-foreground">3 resume generations every 24 hours.</p>
            </div>

            <div className="border-4 border-primary p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-xs font-black uppercase text-muted-foreground">Storage</p>
              <p className="mt-3 text-lg font-black">{resumes?.length ?? 0} saved records</p>
              <p className="mt-2 text-sm text-muted-foreground">Your generated resume history will appear here as storage cutover completes.</p>
            </div>
          </div>

          <div className="mt-10 border-4 border-primary bg-background p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black">Recent Resumes</h2>
              <Link href="/optimize" className="text-sm font-black uppercase underline">
                Start New
              </Link>
            </div>

            {resumes && resumes.length > 0 ? (
              <div className="space-y-4">
                {resumes.map((resume) => (
                  <div key={resume.id} className="border-2 border-primary p-4">
                    <p className="font-black">{resume.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{resume.original_filename}</p>
                    <p className="mt-1 text-xs uppercase text-muted-foreground">
                      Created {new Date(resume.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-primary p-6 text-sm text-muted-foreground">
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
