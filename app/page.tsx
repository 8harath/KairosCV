import { ArrowRight, CheckCircle2, FileText, ShieldCheck } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/Footer"

const highlights = [
  {
    title: "Supported formats",
    description: "Upload PDF, DOCX, or TXT files up to 5MB.",
    icon: FileText,
  },
  {
    title: "ATS-focused output",
    description: "Content is improved and exported as a professional PDF.",
    icon: ShieldCheck,
  },
  {
    title: "Google access",
    description: "One secure flow handles both new users and returning users.",
    icon: CheckCircle2,
  },
]

export default function Home() {
  return (
    <>
      <Header />
      <main className="page-shell">
        <section className="container py-14 md:py-20">
          <div className="section-frame overflow-hidden p-6 md:p-10 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_340px] lg:items-center">
              <div>
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[28px] border border-border bg-card text-2xl font-semibold text-foreground shadow-[0_6px_20px_rgba(15,23,42,0.08)] md:h-[88px] md:w-[88px] md:text-3xl">
                    K
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground md:text-lg">KairosCV</p>
                    <p className="text-sm text-muted-foreground">Resume optimization workspace</p>
                  </div>
                </div>
                <div className="section-header-kicker">Production-ready resume workflow</div>
                <h1 className="mt-5 max-w-4xl text-balance">Turn an existing resume into a cleaner, ATS-ready PDF.</h1>
                <p className="mt-5 max-w-2xl text-base md:text-lg">
                  Upload your draft, let KairosCV improve structure and phrasing, and download a polished version from one secure workspace.
                </p>

                <div className="mt-8">
                  <a href="/auth/login" className="btn-hero">
                    Continue with Google
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>

                <div className="mt-8 flex flex-wrap gap-2">
                  <span className="pill-badge">3 free generations</span>
                  <span className="pill-badge">Google sign-in</span>
                  <span className="pill-badge">PDF, DOCX, TXT</span>
                </div>
              </div>

              <div className="surface-panel p-5 md:p-6">
                <p className="text-sm font-medium text-foreground">What you get</p>
                <div className="mt-6 space-y-3">
                  {highlights.map(({ title, description, icon: Icon }) => (
                    <div key={title} className="metric-tile flex items-start gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-secondary text-foreground">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
