import HeroSection from "@/components/hero-section"
import HowItWorks from "@/components/how-it-works"
import AboutSection from "@/components/about-section"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-black neu-grid-bg">
      <HeroSection />
      <HowItWorks />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
