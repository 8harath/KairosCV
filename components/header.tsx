"use client"

import Link from "next/link"
import Navigation from "@/components/navigation"
import { useEffect, useState } from "react"
import AuthButtons from "@/components/auth-buttons"

export default function Header() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Show header when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <header className={`border-b-2 border-primary py-4 md:py-6 fixed top-0 left-0 right-0 bg-background z-40 transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
      <div className="container mx-auto px-4">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between gap-6">
          {/* Left: Logo */}
          <Link href="/" className="hover:opacity-80 transition-opacity group flex-shrink-0">
            <h2 className="text-xl lg:text-2xl font-black mb-0 group-hover:translate-x-[-2px] transition-transform">
              KairosCV
            </h2>
          </Link>

          {/* Center: Navigation */}
          <div className="flex-1 flex items-center justify-center">
            <Navigation />
          </div>

          {/* Right: Auth + Badge */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <AuthButtons />
            <div className="border-2 border-primary px-3 py-1.5 font-black text-xs uppercase bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
              BETA
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex md:hidden items-center justify-between gap-4 relative">
          <Navigation />

          <Link href="/" className="hover:opacity-80 transition-opacity group absolute left-1/2 -translate-x-1/2">
            <h2 className="text-xl font-black mb-0 group-hover:translate-x-[-2px] transition-transform">
              KairosCV
            </h2>
          </Link>

          <div className="flex items-center gap-2">
            <AuthButtons />
            <div className="border-2 border-primary px-2 py-1 font-bold text-[10px] uppercase bg-primary text-primary-foreground">
              BETA
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
