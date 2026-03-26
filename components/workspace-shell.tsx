"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronRight,
  LayoutDashboard,
  Menu,
  Settings,
  Sparkles,
} from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import ThemeToggle from "@/components/theme-toggle"
import { AvatarDisplay } from "@/components/avatar"
import { Button } from "@/components/ui/button"

interface WorkspaceShellProps {
  title: string
  description: string
  children: ReactNode
  actions?: ReactNode
  userLabel?: string
  avatarUrl?: string | null
  userName?: string
}

const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/optimize", label: "Optimize", icon: Sparkles },
  { href: "/settings", label: "Settings", icon: Settings },
]

function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-0.5" aria-label="Workspace navigation">
      {navigationItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href
        return (
          <Link key={href} href={href} className="workspace-nav-link" data-active={isActive}>
            <Icon className="h-4 w-4" />
            <span>{label}</span>
            {isActive ? <ChevronRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" /> : null}
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
  avatarUrl,
  userName,
}: WorkspaceShellProps) {
  return (
    <div className="workspace-shell">
      <aside className="workspace-sidebar">
        <Link href="/" className="mb-6 flex items-center gap-2.5 px-3 py-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-xs font-semibold text-foreground">
            K
          </div>
          <span className="text-sm font-semibold text-foreground">KairosCV</span>
        </Link>

        <SidebarNav />

        <div className="mt-auto flex items-center gap-3 rounded-lg px-3 py-3">
          <AvatarDisplay avatarUrl={avatarUrl} email={userLabel} name={userName} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{userName || userLabel || "Account"}</p>
            {userName && userLabel ? (
              <p className="truncate text-xs text-muted-foreground">{userLabel}</p>
            ) : null}
          </div>
        </div>
      </aside>

      <div className="workspace-main">
        <div className="workspace-topbar">
          <div className="container flex items-center justify-between gap-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">Open navigation</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[260px] border-r border-border bg-background p-0">
                  <SheetHeader className="border-b border-border px-5 py-4">
                    <SheetTitle className="text-left text-sm font-semibold">KairosCV</SheetTitle>
                  </SheetHeader>
                  <div className="px-4 py-4">
                    <SidebarNav />
                  </div>
                </SheetContent>
              </Sheet>

              <div className="min-w-0">
                <h1 className="truncate text-lg font-semibold text-foreground">{title}</h1>
                <p className="truncate text-sm text-muted-foreground">{description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
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
