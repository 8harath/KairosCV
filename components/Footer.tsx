import Link from "next/link"

const footerLinks = [
  { href: "/optimize", label: "Optimize" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/intent", label: "Intent" },
  { href: "/contact", label: "Contact" },
]

export default function Footer() {
  return (
    <footer className="border-t border-border/70 bg-background/70 backdrop-blur">
      <div className="container py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <div className="text-sm font-semibold text-foreground">KairosCV</div>
            <p className="mt-3 text-sm text-muted-foreground">
              A focused workspace for turning raw resume content into ATS-optimized, professionally formatted outputs.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl border border-transparent px-3 py-2 text-sm text-muted-foreground hover:border-border hover:bg-white hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-border/70 pt-5 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>Designed for clarity, accessibility, and calmer resume workflows.</p>
          <p>&copy; 2026 KairosCV</p>
        </div>
      </div>
    </footer>
  )
}
