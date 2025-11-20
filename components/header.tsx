import Link from "next/link"
import Navigation from "@/components/navigation"

export default function Header() {
  return (
    <header className="border-b-2 border-primary py-6 md:py-8 mb-8 md:mb-12 sticky top-0 bg-background z-40">
      <div className="container">
        <div className="flex flex-col gap-6">
          {/* Logo and Beta Badge */}
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="hover:opacity-80 transition-opacity group">
              <h2 className="text-2xl md:text-3xl font-black mb-0 group-hover:translate-x-[-2px] transition-transform">
                KairosCV
              </h2>
              <p className="text-muted-foreground mt-1 text-xs md:text-sm">
                AI-Powered Resume Optimization
              </p>
            </Link>
            <div className="border-2 border-primary px-3 md:px-4 py-1 md:py-2 font-bold text-xs uppercase bg-primary text-primary-foreground">
              BETA
            </div>
          </div>

          {/* Navigation */}
          <div className="relative">
            <Navigation />
          </div>
        </div>
      </div>
    </header>
  )
}
