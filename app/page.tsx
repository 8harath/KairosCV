import Link from "next/link"
import {
  ArrowRight,
  FolderKanban,
  LayoutPanelTop,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/Footer"

const features = [
  {
    title: "A calmer workflow",
    description: "Upload once, track progress clearly, and review the final resume in a focused workspace.",
    icon: Workflow,
  },
  {
    title: "ATS-ready structure",
    description: "Messy source resumes are normalized into clean, scannable sections that stay readable.",
    icon: ShieldCheck,
  },
  {
    title: "Account-backed history",
    description: "Sign in with Google, keep your generated outputs organized, and return from any device.",
    icon: FolderKanban,
  },
]

const steps = [
  "Upload a PDF, DOCX, or raw text resume.",
  "Let the model extract and improve the content.",
  "Review the generated PDF and keep iterating from your dashboard.",
]

export default function Home() {
  return (
    <>
      <Header />
      <main className="page-shell">
        <section className="container py-14 md:py-20">
          <div className="section-frame overflow-hidden p-6 md:p-10 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_360px] lg:items-center">
              <div>
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[28px] border border-border bg-card text-2xl font-semibold text-foreground shadow-[0_6px_20px_rgba(15,23,42,0.08)] md:h-[88px] md:w-[88px] md:text-3xl">
                    K
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground md:text-lg">KairosCV</p>
                    <p className="text-sm text-muted-foreground">ATS resume workspace</p>
                  </div>
                </div>
                <div className="section-header-kicker">KairosCV workspace</div>
                <h1 className="mt-5 max-w-4xl text-balance">
                  Build ATS-optimized resumes in a workspace that feels quiet, clear, and usable.
                </h1>
                <p className="mt-5 max-w-2xl text-base md:text-lg">
                  KairosCV transforms raw resume content into sharper, professionally formatted outputs with AI-assisted structure, stronger phrasing, and cleaner export flows.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="/optimize" className="btn-hero">
                    <Sparkles className="h-4 w-4" />
                    Start optimizing
                  </Link>
                  <Link href="/signup" className="btn-secondary">
                    Create account
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap gap-2">
                  <span className="pill-badge">3 free generations</span>
                  <span className="pill-badge">Google sign-in</span>
                  <span className="pill-badge">Responsive workspace</span>
                </div>
              </div>

              <div className="surface-panel p-5 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">System overview</p>
                    <p className="mt-1 text-sm text-muted-foreground">A simple flow built for speed and readability.</p>
                  </div>
                  <LayoutPanelTop className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className="mt-6 space-y-3">
                  {steps.map((step, index) => (
                    <div key={step} className="metric-tile flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-foreground">
                        {index + 1}
                      </div>
                      <p className="text-sm text-foreground">{step}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-border/80 bg-secondary/60 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Designed for trust</p>
                  <p className="mt-2 text-sm text-foreground">
                    Clear states, accessible controls, and quieter surfaces make the product feel closer to a productivity tool than an AI demo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container pb-6 md:pb-10">
          <div className="grid gap-4 md:grid-cols-3">
            {features.map(({ title, description, icon: Icon }) => (
              <div key={title} className="card-interactive">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-xl">{title}</h2>
                <p className="mt-3 text-sm">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container py-8 md:py-10">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="section-frame p-6 md:p-8">
              <div className="section-header-kicker">How it works</div>
              <h2 className="mt-4 max-w-2xl text-balance">A workflow that stays simple on desktop and still feels natural on smaller screens.</h2>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="surface-panel p-5">
                  <p className="text-sm font-medium text-foreground">Upload</p>
                  <p className="mt-2 text-sm">Support for PDF, DOCX, and TXT files keeps the entry point lightweight.</p>
                </div>
                <div className="surface-panel p-5">
                  <p className="text-sm font-medium text-foreground">Refine</p>
                  <p className="mt-2 text-sm">The model extracts sections, reduces duplication, and strengthens weak bullets.</p>
                </div>
                <div className="surface-panel p-5">
                  <p className="text-sm font-medium text-foreground">Export</p>
                  <p className="mt-2 text-sm">Preview the resume, download the PDF, and return later from your dashboard.</p>
                </div>
              </div>
            </div>

            <div className="surface-panel-strong p-6">
              <div className="section-header-kicker">Why it lands</div>
              <h3 className="mt-4">Minimal by default.</h3>
              <p className="mt-3 text-sm">
                The interface now emphasizes hierarchy, whitespace, and soft contrast so attention stays on the content and the next action.
              </p>
              <Link href="/intent" className="soft-link mt-6">
                Read the product intent
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="container py-10 md:py-14">
          <div className="section-frame p-8 text-center md:p-12">
            <div className="section-header-kicker">Start free</div>
            <h2 className="mt-4 text-balance">Turn a rough draft into a clearer, ATS-ready resume in one pass.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base">
              Sign in with Google, upload your current draft, and let KairosCV handle the structure while you focus on the actual story you want to tell.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/signup" className="btn">
                Create your workspace
              </Link>
              <Link href="/login" className="btn-secondary">
                Log in
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
