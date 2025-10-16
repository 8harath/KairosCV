import HeroSection from "@/components/hero-section"
import HowItWorks from "@/components/how-it-works"
import AboutSection from "@/components/about-section"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <HeroSection />
      <HowItWorks />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
