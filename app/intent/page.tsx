import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/Footer"

export const metadata = {
  title: "About | KairosCV",
  description: "Why KairosCV exists and our approach to resume optimization",
}

export default function IntentPage() {
  return (
    <>
      <Header />
      <main className="page-shell">
        <section className="container py-10 md:py-14">
          <div className="mx-auto max-w-2xl space-y-8">
            <div>
              <h1 className="text-2xl font-semibold text-foreground md:text-3xl">Why KairosCV</h1>
              <p className="mt-3 text-muted-foreground">
                Too much hiring flow is shaped by formatting rituals instead of substance. KairosCV automates the formatting so you can focus on what matters.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-secondary/20 p-5">
              <p className="text-base font-medium leading-relaxed text-foreground">
                "No one should be judged by a piece of paper. If systems still do it, the software should at least absorb the formatting burden."
              </p>
            </div>

            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                The point is not to make resumes look flashy. It is to make them readable, structured, and accessible enough that automated filters stop being the first unfair barrier.
              </p>
              <p>
                Job seekers should not lose opportunities because their document misses an arbitrary ATS convention. Professional-looking resumes should not require expensive software or insider knowledge.
              </p>
              <p>
                KairosCV uses AI to improve structure and phrasing, then outputs a clean PDF that works with applicant tracking systems. The UI stays out of the way.
              </p>
            </div>

            <div className="border-t border-border pt-6">
              <Link href="/optimize" className="btn">
                Try it now
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
