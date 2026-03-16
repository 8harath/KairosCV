"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bell,
  ChevronRight,
  FileText,
  Home,
  LayoutDashboard,
  Menu,
  Settings,
  Sparkles,
} from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import ThemeToggle from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface WorkspaceShellProps {
  title: string
  description: string
  children: ReactNode
  actions?: ReactNode
  userLabel?: string
}

const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/optimize", label: "Optimize", icon: Sparkles },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/intent", label: "Intent", icon: FileText },
  { href: "/contact", label: "Contact", icon: Bell },
]

function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-1.5" aria-label="Workspace navigation">
      {navigationItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href
        return (
          <Link key={href} href={href} className="workspace-nav-link" data-active={isActive}>
            <Icon className="h-4 w-4" />
            <span>{label}</span>
            {isActive ? <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" /> : null}
          </Link>
        )
      })}
    </nav>
  )
}

export default function WorkspaceShell({
  title,
  description,
  children,
  actions,
  userLabel,
}: WorkspaceShellProps) {
  return (
    <div className="workspace-shell">
      <aside className="workspace-sidebar">
        <Link href="/" className="mb-8 flex items-center gap-3 rounded-2xl px-3 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card">
            <Home className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">KairosCV</div>
            <div className="text-xs text-muted-foreground">Resume workspace</div>
          </div>
        </Link>

        <div className="mb-5 px-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Workspace</p>
        </div>

        <SidebarNav />

        <div className="mt-auto rounded-2xl border border-border/80 bg-card/85 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Account</p>
          <p className="mt-2 text-sm font-medium text-foreground">{userLabel || "Signed in workspace"}</p>
          <p className="mt-1 text-sm text-muted-foreground">Manage resume generations, downloads, and account preferences.</p>
        </div>
      </aside>

      <div className="workspace-main">
        <div className="workspace-topbar">
          <div className="container flex items-center justify-between gap-4 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">Open navigation</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[88vw] max-w-xs border-r border-border bg-background p-0">
                  <SheetHeader className="border-b border-border px-5 py-5">
                    <SheetTitle className="text-left text-base">KairosCV</SheetTitle>
                    <p className="text-sm text-muted-foreground">A quieter workspace for ATS-ready resumes.</p>
                  </SheetHeader>
                  <div className="px-4 py-5">
                    <SidebarNav />
                  </div>
                </SheetContent>
              </Sheet>

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Workspace</p>
                <h1 className="mt-1 truncate text-2xl font-semibold md:text-3xl">{title}</h1>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
              </div>
            </div>

            <div className={cn("flex items-center gap-3", actions ? "" : "hidden md:flex")}>
              <ThemeToggle />
              {actions}
            </div>
          </div>
        </div>

        <div className="workspace-content">
          <div className="workspace-page">{children}</div>
        </div>
      </div>
    </div>
  )
}
