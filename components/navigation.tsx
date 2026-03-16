"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Compass, LayoutDashboard, Mail, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "Home", icon: Compass },
  { href: "/optimize", label: "Optimize", icon: Sparkles },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/contact", label: "Contact", icon: Mail },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="hidden items-center gap-1 rounded-2xl border border-border/80 bg-white/80 p-1 backdrop-blur md:flex" aria-label="Primary navigation">
      {links.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
              isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
