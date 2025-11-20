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
    { href: "/contact", label: "Contact" },
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-4" aria-label="Main navigation">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                border-2 border-primary px-6 py-2 font-bold text-sm uppercase
                transition-all duration-200
                ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-foreground hover:translate-x-[-2px] hover:translate-y-[-2px]"
                }
              `}
              style={{
                boxShadow: isActive
                  ? "0px 0px 0px currentColor"
                  : "0px 0px 0px currentColor",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.boxShadow = "4px 4px 0px var(--foreground)"
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.boxShadow = "0px 0px 0px currentColor"
                }
              }}
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
          className="border-2 border-primary px-4 py-2 font-bold text-sm uppercase bg-background"
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? "Close" : "Menu"}
        </button>

        {isMobileMenuOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-background border-2 border-primary z-50 animate-in fade-in slide-in-from-bottom-3">
            <nav className="flex flex-col" aria-label="Mobile navigation">
              {links.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      border-b-2 border-primary px-6 py-4 font-bold text-sm uppercase
                      transition-all duration-200
                      ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-background text-foreground hover:bg-secondary"
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
