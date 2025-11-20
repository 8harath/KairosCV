import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/Footer"
import { ArrowRightIcon } from "@/components/icons"

export default function IntentPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Page Title */}
          <div className="mb-12 animate-in fade-in">
            <h1 className="mb-4">Our Intent</h1>
            <div className="w-24 h-1 bg-primary"></div>
          </div>

          {/* Philosophy Content */}
          <div className="space-y-8">
            {/* Main Philosophy */}
            <div className="card animate-in fade-in delay-100">
              <h2 className="mb-6">
                The Philosophy
              </h2>
              <div className="space-y-6">
                <blockquote className="border-l-4 border-primary pl-6 py-2 text-xl font-bold">
                  "No one should be judged by a piece of paper."
                </blockquote>
                <p>
                  The same principle applies to resumes. Your skills, experience, and potential are what truly matter—not how they&apos;re formatted on a page.
                </p>
                <p>
                  Just as we&apos;re taught never to judge a book by its cover, the same holds true for talent. A person&apos;s worth shouldn&apos;t be measured by their ability to satisfy an arbitrary Applicant Tracking System.
                </p>
              </div>
            </div>

            {/* The Problem */}
            <div className="border-2 border-primary p-6 bg-secondary animate-in fade-in delay-200">
              <h3 className="mb-4">The Problem</h3>
              <p className="text-base leading-relaxed">
                Job seekers spend countless hours tweaking fonts, margins, and keywords—not to showcase their abilities, but to appease automated systems. This is time that could be spent honing skills, building projects, or preparing for interviews.
              </p>
            </div>

            {/* Our Solution */}
            <div className="card animate-in fade-in delay-300">
              <h3 className="mb-4">Our Solution</h3>
              <p className="text-base leading-relaxed mb-4">
                <strong>We automate the formatting game.</strong> KairosCV uses AI to transform any resume into an ATS-optimized format, allowing you to focus on what matters: your actual qualifications and achievements.
              </p>
              <p className="text-base leading-relaxed">
                The real value and insights lie within your experience. Our goal is to ensure those insights shine through, regardless of formatting constraints.
              </p>
            </div>

            {/* Vision */}
            <div className="border-l-4 border-primary pl-6 py-4 animate-in fade-in delay-100">
              <h3 className="mb-4">Our Vision</h3>
              <p className="text-base leading-relaxed">
                We&apos;re working toward a future where talent is evaluated on merit alone. While we can&apos;t change hiring systems overnight, we can level the playing field by making ATS optimization accessible to everyone—instantly and for free.
              </p>
            </div>

            {/* Core Beliefs */}
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <div className="border-2 border-primary p-6 hover:translate-y-[-4px] transition-transform">
                <div className="text-3xl font-black mb-3">01</div>
                <h4 className="font-bold mb-2">Skills Over Style</h4>
                <p className="text-sm text-muted-foreground">
                  Your abilities and experience should speak for themselves, not your choice of serif font.
                </p>
              </div>

              <div className="border-2 border-primary p-6 hover:translate-y-[-4px] transition-transform">
                <div className="text-3xl font-black mb-3">02</div>
                <h4 className="font-bold mb-2">Time Well Spent</h4>
                <p className="text-sm text-muted-foreground">
                  Every hour spent formatting is an hour not spent learning, building, or growing.
                </p>
              </div>

              <div className="border-2 border-primary p-6 hover:translate-y-[-4px] transition-transform">
                <div className="text-3xl font-black mb-3">03</div>
                <h4 className="font-bold mb-2">Equal Access</h4>
                <p className="text-sm text-muted-foreground">
                  Professional resume optimization shouldn&apos;t require expensive tools or expertise.
                </p>
              </div>

              <div className="border-2 border-primary p-6 hover:translate-y-[-4px] transition-transform">
                <div className="text-3xl font-black mb-3">04</div>
                <h4 className="font-bold mb-2">AI for Good</h4>
                <p className="text-sm text-muted-foreground">
                  Technology should empower people, not create more barriers to opportunity.
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="card-elevated bg-primary text-primary-foreground mt-12 text-center">
              <h3 className="text-white mb-4">
                Ready to Focus on What Matters?
              </h3>
              <p className="mb-6 text-base opacity-90">
                Let KairosCV handle the formatting. You handle the talent.
              </p>
              <Link
                href="/optimize"
                className="inline-flex items-center gap-2 bg-background text-foreground border-3 border-background px-8 py-3 font-bold uppercase tracking-wide hover:translate-y-[-2px] transition-all duration-200"
                style={{ boxShadow: "4px 4px 0px rgba(0,0,0,0.2)" }}
              >
                Optimize Your Resume
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
