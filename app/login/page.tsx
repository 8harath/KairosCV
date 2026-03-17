import { ArrowRight, CheckCircle2, FileText, ShieldCheck } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/Footer"

interface LoginPageProps {
  searchParams?: Promise<{
    error?: string
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const hasError = Boolean(params?.error)

  return (
    <>
      <Header />
      <main className="page-shell">
        <section className="container py-14 md:py-20">
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="section-frame p-8 md:p-10">
              <div className="section-header-kicker">Google access</div>
              <h1 className="mt-5 text-balance">Sign in once and start optimizing resumes.</h1>
              <p className="mt-4 max-w-xl text-base">
                KairosCV uses a single Google sign-in flow for both new and returning users, so access stays simple and consistent.
              </p>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                <div className="surface-panel p-5">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <h2 className="mt-4 text-lg">Upload</h2>
                  <p className="mt-2 text-sm">PDF, DOCX, and TXT are supported.</p>
                </div>
                <div className="surface-panel p-5">
                  <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                  <h2 className="mt-4 text-lg">Secure access</h2>
                  <p className="mt-2 text-sm">Google authentication is handled through Supabase.</p>
                </div>
                <div className="surface-panel p-5">
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                  <h2 className="mt-4 text-lg">Workspace</h2>
                  <p className="mt-2 text-sm">Track usage and return to generated resumes.</p>
                </div>
              </div>
            </div>

            <div className="surface-panel-strong p-6 md:p-8">
              <p className="text-sm font-medium text-foreground">Continue with Google</p>
              <p className="mt-2 text-sm">Your Google account is used for both sign up and login.</p>
              {hasError ? (
                <div className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-foreground">
                  Sign-in could not be completed. Please try again.
                </div>
              ) : null}
              <a href="/auth/login" className="btn mt-6 w-full">
                Sign in with Google
                <ArrowRight className="h-4 w-4" />
              </a>
              <p className="mt-6 text-sm text-muted-foreground">New users are created automatically after Google authentication.</p>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  )
}
