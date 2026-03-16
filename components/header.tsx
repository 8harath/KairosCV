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
    <header className={`fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
      <div className="container mx-auto px-4 pt-3 md:pt-5">
        <div className="section-frame border-2 px-4 py-3 md:px-5 md:py-4">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between gap-6">
          {/* Left: Logo */}
          <Link href="/" className="group flex-shrink-0 transition-opacity hover:opacity-80">
            <h2 className="mb-0 text-xl font-black tracking-[-0.04em] lg:text-2xl">
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
            <div className="border border-border bg-secondary px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-foreground">
              Refined beta
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex md:hidden items-center justify-between gap-4 relative">
          <Navigation />

          <Link href="/" className="absolute left-1/2 -translate-x-1/2 transition-opacity hover:opacity-80">
            <h2 className="mb-0 text-lg font-black tracking-[-0.04em]">
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
      </div>
    </header>
  )
}
