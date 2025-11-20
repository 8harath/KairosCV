"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "HOME" },
    { href: "/intent", label: "INTENT" },
    { href: "/optimize", label: "OPTIMIZE" },
    { href: "/contact", label: "CONTACT" },
  ]

  return (
    <nav className="flex flex-wrap gap-3 md:gap-4" aria-label="Main navigation">
      {links.map((link) => {
        const isActive = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`
              border-3 border-primary px-4 py-2 font-bold text-xs md:text-sm uppercase
              transition-all duration-100
              ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground hover:bg-secondary"
              }
            `}
            style={{
              boxShadow: isActive ? "3px 3px 0px currentColor" : "0px 0px 0px currentColor",
            }}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
