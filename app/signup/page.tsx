import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/Footer"

export default function SignupPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-foreground pt-32 md:pt-40">
        <section className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-2xl border-4 border-primary bg-background p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-8">
              <div className="mb-3 inline-block border-2 border-primary bg-primary px-3 py-1 text-xs font-black uppercase text-primary-foreground">
                Sign Up
              </div>
              <h1 className="text-4xl font-black">Create Your KairosCV Account</h1>
              <p className="mt-4 text-muted-foreground">
                Use Google to start generating ATS-optimized resumes, manage your profile, and unlock your trial credits.
              </p>
            </div>

            <a
              href="/auth/login"
              className="inline-flex w-full items-center justify-center border-4 border-primary bg-primary px-6 py-4 text-lg font-black uppercase text-primary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            >
              Sign Up With Google
            </a>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="border-2 border-primary p-4">
                <p className="font-black">1</p>
                <p className="mt-2 text-sm text-muted-foreground">Connect your Google account securely through Supabase Auth.</p>
              </div>
              <div className="border-2 border-primary p-4">
                <p className="font-black">2</p>
                <p className="mt-2 text-sm text-muted-foreground">Get 3 free generations in each 24-hour window.</p>
              </div>
              <div className="border-2 border-primary p-4">
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
