import Link from "next/link"
import { ArrowRight, Equal, Hourglass, Shield } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/Footer"

const beliefs = [
  {
    title: "Skills over formatting games",
    description: "Job seekers should not lose opportunities because their document misses an arbitrary ATS convention.",
    icon: Equal,
  },
  {
    title: "Time should go to growth",
    description: "Formatting should not consume the time people need for learning, interviewing, and building.",
    icon: Hourglass,
  },
  {
    title: "Access should stay equitable",
    description: "Professional-looking resumes should not require expensive software or insider knowledge.",
    icon: Shield,
  },
]

export default function IntentPage() {
  return (
    <>
      <Header />
      <main className="page-shell">
        <section className="container py-14 md:py-20">
          <div className="mx-auto max-w-5xl space-y-6">
            <div className="section-frame p-8 md:p-10">
              <div className="section-header-kicker">Intent</div>
              <h1 className="mt-5 text-balance">The goal is to reduce resume friction, not add more software theater around it.</h1>
              <p className="mt-4 max-w-3xl text-base">
                KairosCV exists because too much hiring flow is still shaped by formatting rituals instead of substance. We use automation to remove that burden and give users a cleaner path from raw experience to a professional, ATS-friendly resume.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="surface-panel-strong p-6 md:p-8">
                <blockquote className="rounded-2xl border border-border bg-secondary/50 p-5 text-lg font-medium leading-8 text-foreground">
                  “No one should be judged by a piece of paper. If systems still do it, the software should at least absorb the formatting burden for them.”
                </blockquote>

                <div className="mt-6 space-y-4">
                  <p>
                    The point is not to make resumes look flashy. It is to make them readable, structured, and accessible enough that automated filters stop becoming the first unfair barrier.
                  </p>
                  <p>
                    That is why the application now leans into a calmer, productivity-oriented interface. The UI should support clear work, not compete with it.
                  </p>
                </div>
              </div>

              <aside className="surface-panel p-5">
                <p className="text-sm font-medium text-foreground">What the product should feel like</p>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <li>Quiet enough to trust on first use.</li>
                  <li>Clear enough to understand without onboarding.</li>
                  <li>Responsive enough to work on desktop and tablet.</li>
                </ul>
              </aside>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {beliefs.map(({ title, description, icon: Icon }) => (
                <div key={title} className="card-interactive">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-5 text-xl">{title}</h2>
                  <p className="mt-3 text-sm">{description}</p>
                </div>
              ))}
            </div>

            <div className="section-frame p-8 md:p-10">
              <h2 className="text-balance">The software handles the structure. The user keeps the voice and the substance.</h2>
              <p className="mt-4 max-w-2xl text-base">
                That balance is what we’re aiming for across extraction, editing, and export. The UI redesign is part of that same goal: fewer distractions, better hierarchy, and interfaces that behave like real tools.
              </p>
              <Link href="/optimize" className="btn mt-8">
                Optimize your resume
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  )
}
