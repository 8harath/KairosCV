import Link from "next/link"
import { ArrowRight, Check, FileOutput, ScanLine, Sparkles } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/Footer"
import ScoreGauge from "@/components/landing/score-gauge"

const checks = [
  { label: "keywords matched", value: "48 / 52" },
  { label: "structure", value: "ATS-clean" },
  { label: "length", value: "1 page" },
]

const stages = [
  {
    index: "01",
    name: "Parse",
    icon: ScanLine,
    desc: "Extract and normalize content from PDF, DOCX, or TXT — layout noise stripped out.",
  },
  {
    index: "02",
    name: "Enhance",
    icon: Sparkles,
    desc: "Strengthen every bullet, restructure sections, and hold your original tone.",
  },
  {
    index: "03",
    name: "Export",
    icon: FileOutput,
    desc: "Render a single-page, applicant-tracking-clean PDF in seconds.",
  },
]

const specs = [
  { value: "3", label: "Free generations" },
  { value: "<30s", label: "To export" },
  { value: "3", label: "File formats" },
  { value: "1", label: "Page output" },
]

export default function Home() {
  return (
    <>
      <Header />
      <main className="page-shell">
        {/* ── Hero ───────────────────────────────────────────── */}
        <section className="lp-grid border-b border-border">
          <div className="container relative z-10 grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <div className="lp-reveal lp-d1 flex items-center gap-2.5">
                <span className="lp-dot" />
                <span className="lp-kicker">AI résumé compiler</span>
              </div>

              <h1 className="lp-display lp-reveal lp-d2 mt-6 text-foreground">
                Résumés, <span className="text-signal">recompiled</span> to pass the ATS.
              </h1>

              <p className="lp-reveal lp-d3 mt-6 max-w-xl text-[15px] leading-7 text-muted-foreground md:text-base">
                Upload a draft. KairosCV parses it, strengthens every line, and exports a clean
                single-page PDF engineered for applicant tracking systems — in seconds.
              </p>

              <div className="lp-reveal lp-d4 mt-9 flex flex-wrap items-center gap-3">
                <Link href="/login" className="lp-btn-signal">
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/intent" className="lp-btn-ghost">
                  How it works
                </Link>
              </div>

              <div className="lp-reveal lp-d5 mt-7 flex flex-wrap items-center gap-x-3 gap-y-2">
                {["3 free generations", "Google sign-in", "PDF · DOCX · TXT"].map((item) => (
                  <span
                    key={item}
                    className="lp-mono rounded-md border border-border bg-card px-2.5 py-1 text-[11px] tracking-tight text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Instrument readout panel */}
            <div className="lp-panel lp-ticks lp-reveal lp-d4 relative overflow-hidden p-5 sm:p-7">
              <span className="lp-scanline" />

              <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="lp-dot lp-dot-live" />
                  <span className="lp-mono text-[13px] text-foreground">resume_final_v3.pdf</span>
                </div>
                <span className="lp-mono inline-flex items-center rounded-md border border-signal px-2 py-0.5 text-[10px] tracking-[0.18em] text-signal">
                  READY
                </span>
              </div>

              <div className="grid items-center gap-6 py-8 sm:grid-cols-[auto_1fr] sm:gap-8">
                <ScoreGauge value={92} />
                <ul className="space-y-3.5">
                  {checks.map((c) => (
                    <li key={c.label} className="flex items-center justify-between gap-3">
                      <span className="lp-mono text-[12px] text-muted-foreground">{c.label}</span>
                      <span className="lp-mono inline-flex items-center gap-1.5 text-[13px] text-foreground">
                        <Check className="h-3.5 w-3.5 text-signal" strokeWidth={2.5} />
                        {c.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-border pt-4">
                <div className="lp-mono mb-2 flex items-center justify-between text-[10px] tracking-[0.18em] text-muted-foreground">
                  <span>OPTIMIZED</span>
                  <span>100%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-full rounded-full bg-signal" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Before / After diff ────────────────────────────── */}
        <section className="border-b border-border">
          <div className="container py-16 md:py-20">
            <div className="mx-auto max-w-3xl">
              <p className="lp-kicker">Before / after</p>
              <h2 className="mt-3 max-w-2xl text-balance text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                What the optimizer does to a single line.
              </h2>

              <div className="lp-panel lp-ticks mt-8 overflow-hidden">
                <div className="lp-mono flex items-center gap-2 border-b border-border px-4 py-2.5 text-[11px] text-muted-foreground">
                  <span className="text-foreground">experience</span>
                  <span className="text-border">/</span>
                  <span>bullet_07</span>
                </div>

                <div className="lp-diff px-4 py-4">
                  <div className="lp-diff-row lp-diff-del rounded px-2 py-1.5">
                    <span className="lp-diff-mark-del select-none">-</span>
                    <span>Responsible for managing the team and handling various projects.</span>
                  </div>
                  <div className="lp-diff-row lp-diff-add mt-1.5 rounded px-2 py-1.5">
                    <span className="lp-diff-mark-add select-none">+</span>
                    <span>
                      Led an 8-engineer team to ship 12 projects, cutting delivery time by 35%.
                    </span>
                  </div>
                </div>

                <div className="lp-mono flex flex-wrap gap-x-4 gap-y-1.5 border-t border-border px-4 py-3 text-[11px] text-muted-foreground">
                  <span>weak verb → quantified impact</span>
                  <span className="text-border">·</span>
                  <span>passive → active voice</span>
                  <span className="text-border">·</span>
                  <span className="text-signal">+3 ATS keywords</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pipeline ───────────────────────────────────────── */}
        <section className="border-b border-border">
          <div className="container py-16 md:py-20">
            <p className="lp-kicker">Pipeline</p>
            <h2 className="mt-3 max-w-2xl text-balance text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Three stages. One clean file.
            </h2>

            <div className="relative mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
              {stages.map((stage) => {
                const Icon = stage.icon
                return (
                  <div key={stage.index} className="group relative bg-card p-6 md:p-7">
                    <div className="flex items-center justify-between">
                      <span className="lp-mono text-[13px] tracking-[0.1em] text-muted-foreground">
                        {stage.index}
                      </span>
                      <Icon
                        className="h-5 w-5 text-muted-foreground transition-colors duration-200 group-hover:text-signal"
                        strokeWidth={1.75}
                      />
                    </div>
                    <h3 className="mt-5 text-base font-semibold tracking-tight text-foreground">
                      {stage.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{stage.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Spec strip ─────────────────────────────────────── */}
        <section className="border-b border-border">
          <div className="container py-12">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4">
              {specs.map((spec) => (
                <div key={spec.label} className="bg-card px-5 py-6 text-center sm:py-7">
                  <div className="lp-mono text-3xl font-semibold tracking-tight text-foreground tabular-nums md:text-4xl">
                    {spec.value}
                  </div>
                  <div className="lp-kicker mt-2.5">{spec.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA band ───────────────────────────────────────── */}
        <section className="lp-grid border-b border-border">
          <div className="container relative z-10 py-20 md:py-28">
            <div className="lp-panel lp-ticks mx-auto max-w-3xl px-6 py-14 text-center sm:px-10">
              <p className="lp-kicker">Ready when you are</p>
              <h2 className="mx-auto mt-4 max-w-xl text-balance text-3xl font-semibold tracking-tight text-foreground md:text-[2.5rem] md:leading-[1.05]">
                Recompile your résumé in the next minute.
              </h2>
              <div className="mt-9 flex justify-center">
                <Link href="/login" className="lp-btn-signal">
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <p className="lp-mono mt-6 text-[11px] tracking-tight text-muted-foreground">
                No card required · Google sign-in · 3 free generations
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
