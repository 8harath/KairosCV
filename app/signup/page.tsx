import Link from "next/link"
import { ArrowRight, CheckCircle2, LayoutDashboard, Sparkles } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/Footer"

const steps = [
  {
    title: "Connect",
    description: "Use Google sign-in through Supabase Auth for a clean, low-friction account setup.",
    icon: CheckCircle2,
  },
  {
    title: "Generate",
    description: "Start with 3 free resume generations in each 24-hour window.",
    icon: Sparkles,
  },
  {
    title: "Manage",
    description: "Keep your work organized from a dashboard built for ongoing edits and downloads.",
    icon: LayoutDashboard,
  },
]

export default function SignupPage() {
  return (
    <>
      <Header />
      <main className="page-shell">
        <section className="container py-14 md:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="section-frame grid gap-8 p-8 md:p-10 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div>
                <div className="section-header-kicker">Create workspace</div>
                <h1 className="mt-5 text-balance">Start using KairosCV with a cleaner account experience.</h1>
                <p className="mt-4 max-w-2xl text-base">
                  The product is designed like a lightweight productivity tool: calm surfaces, obvious actions, and enough structure to keep resume work organized.
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  {steps.map(({ title, description, icon: Icon }) => (
                    <div key={title} className="surface-panel p-5">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <h2 className="mt-4 text-lg">{title}</h2>
                      <p className="mt-2 text-sm">{description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="surface-panel-strong p-6 md:p-8">
                <p className="text-sm font-medium text-foreground">Start with Google</p>
                <p className="mt-2 text-sm">We’ll create your account and send you straight into the workspace.</p>
                <a href="/auth/login" className="btn mt-6 w-full">
                  Continue with Google
                  <ArrowRight className="h-4 w-4" />
                </a>

                <div className="mt-6 rounded-2xl border border-border bg-secondary/50 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Included</p>
                  <p className="mt-2 text-sm text-foreground">3 free resume generations per 24 hours and a dashboard ready for history, downloads, and future account settings.</p>
                </div>

                <p className="mt-6 text-sm text-muted-foreground">
                  Already have access?{" "}
                  <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
                    Log in here
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  )
}
