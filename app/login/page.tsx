import Link from "next/link"
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/Footer"

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="page-shell">
        <section className="container py-14 md:py-20">
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="section-frame p-8 md:p-10">
              <div className="section-header-kicker">Welcome back</div>
              <h1 className="mt-5 text-balance">Access your resume workspace.</h1>
              <p className="mt-4 max-w-xl text-base">
                Sign in with Google to continue your resume generations, track free credits, and keep everything connected across devices.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                <span className="pill-badge">Google auth with Supabase</span>
                <span className="pill-badge">3 free generations</span>
                <span className="pill-badge">Dashboard access</span>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-2">
                <div className="surface-panel p-5">
                  <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                  <h2 className="mt-4 text-lg">Consistent access</h2>
                  <p className="mt-2 text-sm">Your account keeps the workspace stable whether you return on desktop, tablet, or phone.</p>
                </div>
                <div className="surface-panel p-5">
                  <Sparkles className="h-5 w-5 text-muted-foreground" />
                  <h2 className="mt-4 text-lg">Quieter workflow</h2>
                  <p className="mt-2 text-sm">A cleaner interface reduces friction when you just want to upload, refine, and export.</p>
                </div>
              </div>
            </div>

            <div className="surface-panel-strong p-6 md:p-8">
              <p className="text-sm font-medium text-foreground">Continue with Google</p>
              <p className="mt-2 text-sm">We use Supabase Auth for a simple sign-in flow and a faster route back into your dashboard.</p>
              <a href="/auth/login" className="btn mt-6 w-full">
                Sign in with Google
                <ArrowRight className="h-4 w-4" />
              </a>

              <div className="subtle-divider mt-6" />

              <p className="mt-6 text-sm text-muted-foreground">
                Need an account? Google sign-in will create it automatically. You can also head to{" "}
                <Link href="/signup" className="font-medium text-foreground underline underline-offset-4">
                  sign up
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  )
}
