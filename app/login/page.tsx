import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/Footer"

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="page-shell pt-32 md:pt-40">
        <section className="container mx-auto px-4 py-16">
          <div className="surface-panel-strong hero-grid mx-auto max-w-4xl overflow-hidden p-6 md:p-8">
            <div className="mb-8">
              <div className="section-header-kicker mb-3">
                Login
              </div>
              <h1 className="text-4xl font-black md:text-5xl">Access your resume workspace</h1>
              <p className="mt-4 max-w-2xl text-muted-foreground">
                Sign in with Google to save generated resumes, track your free credits, and access your dashboard from any device.
              </p>
            </div>

            <a
              href="/auth/login"
              className="btn inline-flex w-full items-center justify-center text-base md:w-auto"
            >
              Continue With Google
            </a>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="surface-panel p-4 text-sm">
                <p className="font-bold uppercase tracking-[0.12em]">What you get</p>
                <p className="mt-2 text-muted-foreground">
                  3 free resume generations every 24 hours, plus a persistent dashboard for download history once storage migration is completed.
                </p>
              </div>
              <div className="surface-panel p-4 text-sm">
                <p className="font-bold uppercase tracking-[0.12em]">Why sign in</p>
                <p className="mt-2 text-muted-foreground">
                  Keep the experience synced across devices and build toward stored resume history and reusable profile context.
                </p>
              </div>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Need an account? Your Google sign-in creates it automatically. You can also visit{" "}
              <Link href="/signup" className="font-bold underline">
                Sign Up
              </Link>
              .
            </p>
          </div>
        </section>
        <Footer />
      </main>
    </>
  )
}
