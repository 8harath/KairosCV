import Link from "next/link"
import Navigation from "@/components/navigation"

export default function Header() {
  return (
    <header className="border-b-3 border-primary py-6 md:py-8 mb-8 md:mb-12">
      <div className="container">
        <div className="flex flex-col gap-6">
          {/* Logo and Beta Badge */}
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <h1 className="text-3xl md:text-4xl font-black">KairosCV</h1>
              <p className="text-muted-foreground mt-1 text-sm md:text-base">AI-Powered ATS Resume Optimization</p>
            </Link>
            <div className="border-2 border-primary px-3 md:px-4 py-1 md:py-2 font-bold text-xs md:text-sm uppercase">
              BETA
            </div>
          </div>

          {/* Navigation */}
          <Navigation />
        </div>
      </div>
    </header>
  )
}
