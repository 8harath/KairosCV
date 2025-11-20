import Link from "next/link"
import Header from "@/components/header"

export default function IntentPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          {/* Page Title */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-widest uppercase">
              INTENT
            </h1>
            <div className="w-24 h-1 bg-primary"></div>
          </div>

          {/* Philosophy Content */}
          <div className="space-y-8">
            {/* Main Philosophy */}
            <div className="card">
              <h2 className="text-2xl md:text-3xl font-black mb-6 uppercase">
                THE PHILOSOPHY
              </h2>
              <div className="space-y-6 text-lg leading-relaxed">
                <p className="border-l-4 border-primary pl-6 py-2">
                  <strong>No one should be judged by a piece of paper.</strong>
                </p>
                <p>
                  The same principle applies to resumes. Your skills, experience, and potential are what truly matter—not how they&apos;re formatted on a page.
                </p>
                <p>
                  Just as we&apos;re taught never to judge a book by its cover, the same holds true for talent. A person&apos;s worth shouldn&apos;t be measured by their ability to satisfy an arbitrary Applicant Tracking System.
                </p>
              </div>
            </div>

            {/* The Problem */}
            <div className="border-3 border-primary p-6 bg-secondary">
              <h3 className="text-xl font-bold mb-4 uppercase">THE PROBLEM</h3>
              <p className="text-base leading-relaxed">
                Job seekers spend countless hours tweaking fonts, margins, and keywords—not to showcase their abilities, but to appease automated systems. This is time that could be spent honing skills, building projects, or preparing for interviews.
              </p>
            </div>

            {/* Our Solution */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4 uppercase">OUR SOLUTION</h3>
              <p className="text-base leading-relaxed mb-4">
                <strong>We automate the formatting game.</strong> KairosCV uses AI to transform any resume into an ATS-optimized format, allowing you to focus on what matters: your actual qualifications and achievements.
              </p>
              <p className="text-base leading-relaxed">
                The real value and insights lie within your experience. Our goal is to ensure those insights shine through, regardless of formatting constraints.
              </p>
            </div>

            {/* Vision */}
            <div className="border-l-4 border-primary pl-6 py-4">
              <h3 className="text-xl font-bold mb-4 uppercase">OUR VISION</h3>
              <p className="text-base leading-relaxed">
                We&apos;re working toward a future where talent is evaluated on merit alone. While we can&apos;t change hiring systems overnight, we can level the playing field by making ATS optimization accessible to everyone—instantly and for free.
              </p>
            </div>

            {/* Core Beliefs */}
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <div className="border-3 border-primary p-6">
                <div className="text-3xl font-black mb-3">01</div>
                <h4 className="text-lg font-bold mb-2 uppercase">Skills Over Style</h4>
                <p className="text-sm text-muted-foreground">
                  Your abilities and experience should speak for themselves, not your choice of serif font.
                </p>
              </div>

              <div className="border-3 border-primary p-6">
                <div className="text-3xl font-black mb-3">02</div>
                <h4 className="text-lg font-bold mb-2 uppercase">Time Well Spent</h4>
                <p className="text-sm text-muted-foreground">
                  Every hour spent formatting is an hour not spent learning, building, or growing.
                </p>
              </div>

              <div className="border-3 border-primary p-6">
                <div className="text-3xl font-black mb-3">03</div>
                <h4 className="text-lg font-bold mb-2 uppercase">Equal Access</h4>
                <p className="text-sm text-muted-foreground">
                  Professional resume optimization shouldn&apos;t require expensive tools or expertise.
                </p>
              </div>

              <div className="border-3 border-primary p-6">
                <div className="text-3xl font-black mb-3">04</div>
                <h4 className="text-lg font-bold mb-2 uppercase">AI for Good</h4>
                <p className="text-sm text-muted-foreground">
                  Technology should empower people, not create more barriers to opportunity.
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="card bg-primary text-primary-foreground mt-12 text-center">
              <h3 className="text-2xl font-black mb-4 uppercase">
                READY TO FOCUS ON WHAT MATTERS?
              </h3>
              <p className="mb-6 text-base">
                Let KairosCV handle the formatting. You handle the talent.
              </p>
              <Link href="/optimize" className="inline-block bg-background text-foreground border-3 border-background px-8 py-3 font-bold uppercase tracking-wide hover:bg-secondary transition-all duration-100">
                OPTIMIZE YOUR RESUME
              </Link>
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
              <Link href="/" className="text-sm hover:text-primary transition-colors">
                HOME
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
