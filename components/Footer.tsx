import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t-2 border-primary mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-black text-2xl mb-2">KairosCV</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered resume optimization for job seekers
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold text-sm uppercase mb-3">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/optimize" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Optimize Resume
                </Link>
              </li>
              <li>
                <Link href="/intent" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust */}
          <div>
            <h4 className="font-bold text-sm uppercase mb-3">Trust</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="font-bold">✓</span> 100% Free
              </li>
              <li className="flex items-center gap-2">
                <span className="font-bold">✓</span> No Data Storage
              </li>
              <li className="flex items-center gap-2">
                <span className="font-bold">✓</span> Privacy First
              </li>
              <li className="flex items-center gap-2">
                <span className="font-bold">✓</span> Open Source
              </li>
            </ul>
          </div>

          {/* Stats */}
          <div>
            <h4 className="font-bold text-sm uppercase mb-3">Why Choose Us</h4>
            <ul className="space-y-2">
              <li>
                <div className="font-black text-xl">{"<60s"}</div>
                <div className="text-xs text-muted-foreground">Processing Time</div>
              </li>
              <li className="mt-3">
                <div className="font-black text-xl">AI</div>
                <div className="text-xs text-muted-foreground">Powered Enhancement</div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 KairosCV. Built with purpose.
          </p>
          <div className="flex gap-6">
            <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors uppercase">
              Home
            </Link>
            <Link href="/intent" className="text-xs text-muted-foreground hover:text-foreground transition-colors uppercase">
              Intent
            </Link>
            <Link href="/contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors uppercase">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
