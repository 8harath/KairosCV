import Link from "next/link"
import Header from "@/components/header"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Main Headline */}
          <div className="mb-12 md:mb-16">
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-widest uppercase">
              STOP WASTING TIME ON ATS
            </h1>
            <div className="border-l-4 border-primary pl-6 mb-8">
              <p className="text-xl md:text-2xl font-bold mb-4">
                Your skills matter. Not the formatting.
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                KairosCV automatically transforms your resume into an ATS-optimized PDF using AI.
                Focus on your experience, we&apos;ll handle the rest.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link
              href="/optimize"
              className="btn text-center"
            >
              OPTIMIZE YOUR RESUME
            </Link>
            <Link
              href="/intent"
              className="btn-secondary text-center border-3 border-primary px-6 py-3 font-bold uppercase tracking-wide transition-all duration-100 hover:bg-secondary"
              style={{ boxShadow: "4px 4px 0px currentColor" }}
            >
              LEARN MORE
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card">
              <div className="text-4xl font-black mb-4">01</div>
              <h3 className="text-xl font-bold mb-3">UPLOAD</h3>
              <p className="text-sm text-muted-foreground">
                Drop your resume in any format—PDF, DOCX, or TXT. We handle the rest.
              </p>
            </div>

            <div className="card">
              <div className="text-4xl font-black mb-4">02</div>
              <h3 className="text-xl font-bold mb-3">AI ENHANCE</h3>
              <p className="text-sm text-muted-foreground">
                Our AI analyzes and enhances your content for maximum ATS compatibility.
              </p>
            </div>

            <div className="card">
              <div className="text-4xl font-black mb-4">03</div>
              <h3 className="text-xl font-bold mb-3">DOWNLOAD</h3>
              <p className="text-sm text-muted-foreground">
                Get your professionally formatted, ATS-optimized resume in seconds.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-16 pt-16 border-t-3 border-primary">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-black mb-2">FREE</div>
                <p className="text-sm text-muted-foreground uppercase">Always Free</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-black mb-2">&lt;60s</div>
                <p className="text-sm text-muted-foreground uppercase">Processing Time</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-black mb-2">AI</div>
                <p className="text-sm text-muted-foreground uppercase">Powered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-3 border-primary py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 KairosCV. Built with purpose.
            </p>
            <div className="flex gap-4">
              <Link href="/intent" className="text-sm hover:text-primary transition-colors">
                INTENT
              </Link>
              <Link href="/contact" className="text-sm hover:text-primary transition-colors">
                CONTACT
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
