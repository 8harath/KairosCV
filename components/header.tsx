"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu } from "lucide-react"
import Navigation from "@/components/navigation"
import AuthButtons from "@/components/auth-buttons"
import ThemeToggle from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"

const mobileLinks = [
  { href: "/", label: "Home" },
  { href: "/optimize", label: "Optimize" },
  { href: "/dashboard", label: "Dashboard" },
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
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/78 backdrop-blur-xl">
      <div className="container flex h-[72px] items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
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
                  <p className="text-sm text-muted-foreground">Resume optimization workspace.</p>
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
          ) : null}

          <Link href="/" className="flex items-center gap-3 rounded-2xl transition-opacity hover:opacity-80">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card">
              <span className="text-sm font-semibold text-foreground">K</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">KairosCV</div>
              <div className="text-xs text-muted-foreground">Resume optimization workspace</div>
            </div>
          </Link>
        </div>

        {isAuthenticated ? <Navigation /> : <div className="hidden md:block" />}

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AuthButtons />
        </div>
      </div>
    </header>
  )
}
