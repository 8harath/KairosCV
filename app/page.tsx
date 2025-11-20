import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/Footer"
import { ArrowRightIcon, UploadIcon, SparklesIcon, FileIcon } from "@/components/icons"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <div className="mb-12 md:mb-16 animate-in fade-in">
            <h1 className="mb-6">
              Land Your Dream Job.
              <br />
              <span className="text-4xl sm:text-5xl md:text-6xl font-normal text-muted-foreground">
                Let AI Handle the Rest.
              </span>
            </h1>
            <p className="text-lead max-w-2xl mx-auto mb-8">
              Transform any resume into an ATS-optimized PDF in under 60 seconds.
              Focus on your skills, we&apos;ll handle the formatting.
            </p>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16 justify-center items-center">
            <Link href="/optimize" className="btn-hero inline-flex items-center gap-2">
              Optimize Your Resume Now
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
            <Link href="/intent" className="text-sm font-semibold underline hover:no-underline transition-all">
              See how it works →
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-16">
            <div className="card-interactive group text-center animate-in fade-in delay-100">
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <UploadIcon className="w-16 h-16 stroke-2" />
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-black text-white font-black flex items-center justify-center text-sm border-2 border-black">
                    1
                  </span>
                </div>
              </div>
              <h3 className="mb-3">Upload</h3>
              <p className="text-sm">
                Drop your resume in any format—PDF, DOCX, or TXT. Instant processing.
              </p>
            </div>

            <div className="card-interactive group text-center animate-in fade-in delay-200">
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <SparklesIcon className="w-16 h-16 stroke-2" />
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-black text-white font-black flex items-center justify-center text-sm border-2 border-black">
                    2
                  </span>
                </div>
              </div>
              <h3 className="mb-3">AI Enhance</h3>
              <p className="text-sm">
                Our AI analyzes and enhances your content for maximum ATS compatibility.
              </p>
            </div>

            <div className="card-interactive group text-center animate-in fade-in delay-300">
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <FileIcon className="w-16 h-16 stroke-2" />
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-black text-white font-black flex items-center justify-center text-sm border-2 border-black">
                    3
                  </span>
                </div>
              </div>
              <h3 className="mb-3">Download</h3>
              <p className="text-sm">
                Get your professionally formatted, ATS-optimized resume in seconds.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-16 pt-16 border-t-2 border-primary">
            <div className="grid grid-cols-3 gap-6 md:gap-12 text-center">
              <div className="animate-in zoom-in delay-100">
                <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-2">Free</div>
                <p className="text-xs sm:text-sm text-muted-foreground">Always Free</p>
              </div>
              <div className="animate-in zoom-in delay-200">
                <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-2">{"<60s"}</div>
                <p className="text-xs sm:text-sm text-muted-foreground">Processing Time</p>
              </div>
              <div className="animate-in zoom-in delay-300">
                <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-2">AI</div>
                <p className="text-xs sm:text-sm text-muted-foreground">Powered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
