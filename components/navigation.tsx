"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export default function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const links = [
    { href: "/", label: "Home" },
    { href: "/intent", label: "Intent" },
    { href: "/optimize", label: "Optimize" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-2 border border-border bg-white/75 p-1 shadow-[0_8px_24px_rgba(0,0,0,0.06)] backdrop-blur" aria-label="Main navigation">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                border px-4 py-2 font-bold text-xs uppercase tracking-[0.14em]
                transition-all duration-200
                ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-[0_10px_20px_rgba(0,0,0,0.16)]"
                    : "border-transparent bg-transparent text-foreground hover:border-border hover:bg-white"
                }
              `}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="border border-border bg-white/92 px-4 py-2 font-bold text-xs uppercase tracking-[0.14em] shadow-[0_8px_20px_rgba(0,0,0,0.08)] backdrop-blur"
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? "Close" : "Menu"}
        </button>

        {isMobileMenuOpen && (
          <div className="absolute left-0 right-0 top-full mt-3 overflow-hidden border border-border bg-white/96 shadow-[0_18px_40px_rgba(0,0,0,0.12)] backdrop-blur z-50 animate-in fade-in slide-in-from-bottom-3">
            <nav className="flex flex-col" aria-label="Mobile navigation">
              {links.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      border-b border-border px-5 py-4 font-bold text-xs uppercase tracking-[0.16em]
                      transition-all duration-200
                      ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-transparent text-foreground hover:bg-secondary"
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </div>
    </>
  )
}
