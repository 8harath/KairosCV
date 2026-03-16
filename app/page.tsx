import Link from "next/link"
import { ArrowRight, CircleCheckBig, FileText, ShieldCheck } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <>
      <Header />
      <main className="page-shell">
        <section className="pt-32 pb-14 md:pt-44 md:pb-20">
          <div className="container mx-auto px-4">
            <div className="hero-grid section-frame mx-auto max-w-6xl overflow-hidden border-2 px-5 py-8 md:px-10 md:py-12">
              <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
                <div className="max-w-4xl">
                  <div className="section-header-kicker mb-5">ATS resume workspace</div>
                  <h1 className="mb-6 max-w-4xl text-4xl font-black md:text-6xl lg:text-7xl">
                    Build a resume that reads cleanly to both recruiters and machines.
                  </h1>
                  <p className="mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
                    KairosCV turns messy source resumes into sharp, ATS-optimized outputs with AI-assisted structure, stronger phrasing, and a cleaner final layout.
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <Link href="/optimize" className="btn-hero inline-flex items-center justify-center gap-2">
                      <FileText className="h-5 w-5" />
                      Optimize Your Resume
                    </Link>
                    <Link href="/signup" className="btn-secondary inline-flex items-center justify-center gap-2">
                      Sign Up Free
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <div className="surface-panel-strong bg-white/88 p-5 md:p-6">
                  <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Live system</span>
                    <span className="section-header-kicker">3 free daily generations</span>
                  </div>
                  <div className="space-y-4">
                    <div className="metric-tile">
                      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">Input</p>
                      <p className="mt-2 flex items-start gap-2 text-sm text-foreground"><FileText className="mt-0.5 h-4 w-4 shrink-0" />PDF, DOCX, or raw text uploads with inconsistent formatting.</p>
                    </div>
                    <div className="metric-tile">
                      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">Processing</p>
                      <p className="mt-2 flex items-start gap-2 text-sm text-foreground"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />LLM extraction, content cleanup, structured sections, and ATS-safe formatting.</p>
                    </div>
                    <div className="metric-tile">
                      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">Output</p>
                      <p className="mt-2 flex items-start gap-2 text-sm text-foreground"><CircleCheckBig className="mt-0.5 h-4 w-4 shrink-0" />Professional PDF output with a calmer, account-backed workflow across devices.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <div className="mb-10 max-w-2xl">
                <div className="section-header-kicker mb-4">Process</div>
                <h2 className="mb-4 text-3xl font-black md:text-5xl">A compact workflow that feels obvious on first use.</h2>
                <p className="text-muted-foreground">
                  The interface guides users from raw resume upload to finished output without burying them in settings.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <div className="card-interactive bg-white/86">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="section-header-kicker">Step 1</div>
                    <span className="text-sm font-black uppercase tracking-[0.14em] text-muted-foreground">Upload</span>
                  </div>
                  <h3 className="mb-3 text-2xl font-black">Drop in your current resume</h3>
                  <p>Start with whatever you already have. PDFs, DOCX files, and plain text all work.</p>
                </div>

                <div className="card-interactive bg-white/86">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="section-header-kicker">Step 2</div>
                    <span className="text-sm font-black uppercase tracking-[0.14em] text-muted-foreground">Refine</span>
                  </div>
                  <h3 className="mb-3 text-2xl font-black">Let the model restructure it</h3>
                  <p>KairosCV extracts messy content, deduplicates details, and strengthens the final wording.</p>
                </div>

                <div className="card-interactive bg-white/86">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="section-header-kicker">Step 3</div>
                    <span className="text-sm font-black uppercase tracking-[0.14em] text-muted-foreground">Export</span>
                  </div>
                  <h3 className="mb-3 text-2xl font-black">Download and keep iterating</h3>
                  <p>Review the generated output, store your versions, and come back from desktop or phone.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl section-frame border-2 p-6 md:p-10">
              <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                  <div className="section-header-kicker mb-4">Why it feels better</div>
                  <h2 className="mb-4 text-3xl font-black md:text-5xl">Bold enough to feel premium, quiet enough to stay readable.</h2>
                </div>
                <p className="max-w-xl text-sm md:text-base">
                  The product should feel like a focused writing tool, not a noisy AI toy. These surfaces are designed to keep attention on the resume itself.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <div className="surface-panel p-6">
                  <h3 className="mb-3 text-xl font-black">Minimal by default</h3>
                  <p>Cleaner spacing, calmer cards, and stronger hierarchy make the product easier to trust.</p>
                </div>
                <div className="surface-panel p-6">
                  <h3 className="mb-3 text-xl font-black">Privacy first</h3>
                  <p>Auth-backed accounts and storage migration move the app toward a real product architecture.</p>
                </div>
                <div className="surface-panel p-6">
                  <h3 className="mb-3 text-xl font-black">Mobile-ready</h3>
                  <p>Primary actions stack cleanly on phones while keeping the desktop experience spacious and composed.</p>
                </div>
                <div className="surface-panel p-6">
                  <h3 className="mb-3 text-xl font-black">Structured AI output</h3>
                  <p>LLM extraction and normalization are built to handle duplication, missing sections, and messy formatting.</p>
                </div>
                <div className="surface-panel p-6">
                  <h3 className="mb-3 text-xl font-black">Resume history</h3>
                  <p>Google sign-in and dashboard patterns now support a clearer path to persistent resume management.</p>
                </div>
                <div className="surface-panel p-6">
                  <h3 className="mb-3 text-xl font-black">Open and inspectable</h3>
                  <p>It keeps the bold monochrome identity, but now behaves more like a polished productivity app.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="section-frame mx-auto max-w-4xl border-2 px-6 py-8 text-center md:px-10 md:py-12">
              <div className="section-header-kicker mb-4">Start now</div>
              <h2 className="mb-5 text-3xl font-black md:text-5xl">Use the cleaner flow, then refine the resume itself.</h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                Sign in, upload your draft, and turn scattered experience into a sharper resume that reads well on every screen.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/optimize" className="btn inline-flex items-center justify-center gap-2">
                  <FileText className="h-4 w-4" />
                  Get Started Now
                </Link>
                <Link href="/dashboard" className="btn-secondary inline-flex items-center justify-center gap-2">
                  Open Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
