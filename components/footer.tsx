"use client"

import { Github, Linkedin, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-black border-t-[4px] border-black dark:border-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="font-black text-3xl mb-4" style={{fontFamily: 'var(--font-space-grotesk)'}}>
              KAIROSCV
            </h3>
            <p className="font-medium text-sm leading-relaxed">
              AI-powered resume enhancement. Free. Fast. Professional.
            </p>
          </div>
          <div>
            <h4 className="font-bold uppercase text-sm mb-6 tracking-wider">Product</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <a href="#" className="neu-underline">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="neu-underline">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="neu-underline">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase text-sm mb-6 tracking-wider">Company</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <a href="#" className="neu-underline">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="neu-underline">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="neu-underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase text-sm mb-6 tracking-wider">Connect</h4>
            <div className="flex gap-4">
              <a
                href="https://github.com/8harath/KairosCV"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-black dark:bg-white border-[3px] border-black dark:border-white flex items-center justify-center hover:translate-x-1 hover:translate-y-1 transition-transform"
                style={{boxShadow: '4px 4px 0px var(--border)'}}
              >
                <Github className="w-6 h-6 text-white dark:text-black" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-black dark:bg-white border-[3px] border-black dark:border-white flex items-center justify-center hover:translate-x-1 hover:translate-y-1 transition-transform"
                style={{boxShadow: '4px 4px 0px var(--border)'}}
              >
                <Linkedin className="w-6 h-6 text-white dark:text-black" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-black dark:bg-white border-[3px] border-black dark:border-white flex items-center justify-center hover:translate-x-1 hover:translate-y-1 transition-transform"
                style={{boxShadow: '4px 4px 0px var(--border)'}}
              >
                <Mail className="w-6 h-6 text-white dark:text-black" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t-[3px] border-black dark:border-white pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-bold text-sm uppercase tracking-wide">
              © 2025 KAIROSCV - BUILT BY STUDENTS, FOR EVERYONE
            </p>
            <div className="flex gap-6 text-sm font-bold">
              <a href="#" className="neu-underline">PRIVACY</a>
              <a href="#" className="neu-underline">TERMS</a>
              <a href="#" className="neu-underline">COOKIES</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
