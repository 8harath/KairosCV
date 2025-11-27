"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/Footer"
import LoadingAnimation from "@/components/loading-animation"

export default function Home() {
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    // Show loading animation for 1.5 seconds on initial mount
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (isInitialLoading) {
    return <LoadingAnimation />
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <section className="pt-32 md:pt-40 pb-20 md:pb-32">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6">
                Transform Your Resume
                <br />
                <span className="text-primary">Get Past ATS</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                AI-powered resume optimization that helps you stand out. Upload your resume, and we'll
                transform it into an ATS-friendly format that gets you noticed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/optimize"
                  className="border-4 border-primary px-8 py-4 font-black text-lg uppercase bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                >
                  Optimize Your Resume
                </Link>
                <Link
                  href="/intent"
                  className="border-4 border-primary px-8 py-4 font-black text-lg uppercase bg-background text-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black text-center mb-4">
                How It Works
              </h2>
              <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
                Get your ATS-optimized resume in three simple steps
              </p>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="border-4 border-primary p-8 bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="border-2 border-primary bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-black text-2xl mb-6">
                    1
                  </div>
                  <h3 className="text-2xl font-black mb-4">Upload Resume</h3>
                  <p className="text-muted-foreground">
                    Upload your existing resume in PDF, DOCX, or TXT format. Our system accepts all
                    standard formats.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="border-4 border-primary p-8 bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="border-2 border-primary bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-black text-2xl mb-6">
                    2
                  </div>
                  <h3 className="text-2xl font-black mb-4">AI Enhancement</h3>
                  <p className="text-muted-foreground">
                    Our AI analyzes and enhances your content, optimizing bullet points and formatting
                    for maximum ATS compatibility.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="border-4 border-primary p-8 bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="border-2 border-primary bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-black text-2xl mb-6">
                    3
                  </div>
                  <h3 className="text-2xl font-black mb-4">Download & Apply</h3>
                  <p className="text-muted-foreground">
                    Get your optimized resume in seconds. Download and start applying with confidence
                    that you'll pass ATS screening.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black text-center mb-16">
                Why Choose KairosCV?
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Feature 1 */}
                <div className="border-2 border-primary p-6">
                  <h3 className="text-xl font-black mb-3">100% Free</h3>
                  <p className="text-muted-foreground">
                    No hidden costs, no subscriptions. Optimize your resume completely free, forever.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="border-2 border-primary p-6">
                  <h3 className="text-xl font-black mb-3">Privacy First</h3>
                  <p className="text-muted-foreground">
                    We don't store your data. Your resume is processed and immediately deleted from our
                    servers.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="border-2 border-primary p-6">
                  <h3 className="text-xl font-black mb-3">Lightning Fast</h3>
                  <p className="text-muted-foreground">
                    Get your optimized resume in under 60 seconds. No waiting, no hassle.
                  </p>
                </div>

                {/* Feature 4 */}
                <div className="border-2 border-primary p-6">
                  <h3 className="text-xl font-black mb-3">AI-Powered</h3>
                  <p className="text-muted-foreground">
                    Powered by advanced AI that understands what recruiters and ATS systems are looking for.
                  </p>
                </div>

                {/* Feature 5 */}
                <div className="border-2 border-primary p-6">
                  <h3 className="text-xl font-black mb-3">ATS Optimized</h3>
                  <p className="text-muted-foreground">
                    Formatted to pass through Applicant Tracking Systems with high compatibility scores.
                  </p>
                </div>

                {/* Feature 6 */}
                <div className="border-2 border-primary p-6">
                  <h3 className="text-xl font-black mb-3">Open Source</h3>
                  <p className="text-muted-foreground">
                    Built transparently. Check our code, contribute, or self-host if you prefer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-black mb-6">
                Ready to Stand Out?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of job seekers who've optimized their resumes with KairosCV.
              </p>
              <Link
                href="/optimize"
                className="inline-block border-4 border-primary px-8 py-4 font-black text-lg uppercase bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                Get Started Now
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
