import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/Footer"

export default function SignupPage() {
  return (
    <>
      <Header />
      <main className="page-shell pt-32 md:pt-40">
        <section className="container mx-auto px-4 py-16">
          <div className="surface-panel-strong hero-grid mx-auto max-w-4xl overflow-hidden p-6 md:p-8">
            <div className="mb-8">
              <div className="section-header-kicker mb-3">
                Sign Up
              </div>
              <h1 className="text-4xl font-black md:text-5xl">Create your KairosCV account</h1>
              <p className="mt-4 max-w-2xl text-muted-foreground">
                Use Google to start generating ATS-optimized resumes, manage your profile, and unlock your trial credits.
              </p>
            </div>

            <a
              href="/auth/login"
              className="btn inline-flex w-full items-center justify-center text-base md:w-auto"
            >
              Sign Up With Google
            </a>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="surface-panel p-4">
                <p className="font-black">1</p>
                <p className="mt-2 text-sm text-muted-foreground">Connect your Google account securely through Supabase Auth.</p>
              </div>
              <div className="surface-panel p-4">
                <p className="font-black">2</p>
                <p className="mt-2 text-sm text-muted-foreground">Get 3 free generations in each 24-hour window.</p>
              </div>
              <div className="surface-panel p-4">
                <p className="font-black">3</p>
                <p className="mt-2 text-sm text-muted-foreground">Manage future resumes from your dashboard.</p>
              </div>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Already have access?{" "}
              <Link href="/login" className="font-bold underline">
                Log in here
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
