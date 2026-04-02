"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu } from "lucide-react"
import AuthButtons from "@/components/auth-buttons"
import ThemeToggle from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"

const navLinks = [
  { href: "/optimize", label: "Optimize" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/settings", label: "Settings" },
  { href: "/contact", label: "Contact" },
]

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    let isMounted = true

    void supabase.auth.getUser().then(({ data }) => {
      if (!isMounted) return
      setIsAuthenticated(Boolean(data.user))
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session?.user))
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="container flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[260px] border-r border-border bg-background p-0">
                <SheetHeader className="border-b border-border px-5 py-4">
                  <SheetTitle className="text-left text-sm font-semibold">KairosCV</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile navigation">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          ) : null}

          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-xs font-semibold text-foreground">
              K
            </div>
            <span className="text-sm font-semibold text-foreground">KairosCV</span>
          </Link>
        </div>

        {isAuthenticated ? (
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : null}

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AuthButtons />
        </div>
      </div>
    </header>
  )
}
