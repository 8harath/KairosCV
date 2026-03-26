import Link from "next/link"
import { ArrowRight, FileText, Sparkles, Zap } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <>
      <Header />
      <main className="page-shell">
        <section className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium text-muted-foreground">Resume optimization</p>
            <h1 className="mt-4 text-balance">
              Turn your resume into a cleaner, ATS-ready PDF
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
              Upload a draft. KairosCV restructures content, improves phrasing, and exports a polished document in seconds.
            </p>

            <div className="mt-8 flex items-center justify-center gap-3">
              <Link href="/auth/login" className="btn-hero">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/intent" className="btn-secondary">
                Learn more
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="pill-badge">3 free generations</span>
              <span className="pill-badge">Google sign-in</span>
              <span className="pill-badge">PDF, DOCX, TXT</span>
            </div>
          </div>
        </section>

        <section className="container pb-16 md:pb-24">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
              <div className="bg-card p-6">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <h3 className="mt-3 text-sm font-medium text-foreground">Parse any format</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Upload PDF, DOCX, or TXT. Content is extracted and normalized automatically.
                </p>
              </div>
              <div className="bg-card p-6">
                <Sparkles className="h-5 w-5 text-muted-foreground" />
                <h3 className="mt-3 text-sm font-medium text-foreground">AI enhancement</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Bullet points are strengthened. Structure is cleaned up. Tone stays consistent.
                </p>
              </div>
              <div className="bg-card p-6">
                <Zap className="h-5 w-5 text-muted-foreground" />
                <h3 className="mt-3 text-sm font-medium text-foreground">Professional output</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Download a clean, single-page PDF built for ATS systems and human reviewers.
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
