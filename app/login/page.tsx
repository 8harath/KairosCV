import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/Footer"

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-foreground pt-32 md:pt-40">
        <section className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-2xl border-4 border-primary bg-background p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-8">
              <div className="mb-3 inline-block border-2 border-primary bg-primary px-3 py-1 text-xs font-black uppercase text-primary-foreground">
                Login
              </div>
              <h1 className="text-4xl font-black">Access Your Resume Dashboard</h1>
              <p className="mt-4 text-muted-foreground">
                Sign in with Google to save generated resumes, track your free credits, and access your dashboard from any device.
              </p>
            </div>

            <a
              href="/auth/login"
              className="inline-flex w-full items-center justify-center border-4 border-primary bg-primary px-6 py-4 text-lg font-black uppercase text-primary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            >
              Continue With Google
            </a>

            <div className="mt-6 border-2 border-primary p-4 text-sm">
              <p className="font-bold uppercase">What you get</p>
              <p className="mt-2 text-muted-foreground">
                3 free resume generations every 24 hours, plus a persistent dashboard for download history once storage migration is completed.
              </p>
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
