import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container flex flex-col gap-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; 2026 KairosCV</p>
        <div className="flex gap-4">
          <Link href="/optimize" className="hover:text-foreground">Optimize</Link>
          <Link href="/intent" className="hover:text-foreground">About</Link>
          <Link href="/contact" className="hover:text-foreground">Contact</Link>
        </div>
      </div>
    </footer>
  )
}
