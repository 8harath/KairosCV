"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import Navigation from "@/components/navigation"
import AuthButtons from "@/components/auth-buttons"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const mobileLinks = [
  { href: "/", label: "Home" },
  { href: "/intent", label: "Intent" },
  { href: "/optimize", label: "Optimize" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/contact", label: "Contact" },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/78 backdrop-blur-xl">
      <div className="container flex h-[72px] items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[88vw] max-w-xs border-r border-border bg-background p-0">
              <SheetHeader className="border-b border-border px-5 py-5">
                <SheetTitle className="text-left text-base">KairosCV</SheetTitle>
                <p className="text-sm text-muted-foreground">ATS resume optimization with a calmer workspace feel.</p>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile navigation">
                {mobileLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-3 rounded-2xl transition-opacity hover:opacity-80">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card">
              <span className="text-sm font-semibold text-foreground">K</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">KairosCV</div>
              <div className="text-xs text-muted-foreground">AI resume workspace</div>
            </div>
          </Link>
        </div>

        <Navigation />

        <div className="flex items-center gap-3">
          <div className="hidden rounded-full border border-border bg-white/90 px-3 py-1 text-xs font-medium text-muted-foreground lg:inline-flex">
            3 free generations
          </div>
          <AuthButtons />
        </div>
      </div>
    </header>
  )
}
