"use client"

import { Sparkles, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

interface HeroSectionProps {
  onGetStarted?: () => void
}

export default function HeroSection({ onGetStarted }: HeroSectionProps = {}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4">
      {/* Decorative geometric shapes */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-[#FFD700] border-[3px] border-black dark:border-white transform rotate-12 animate-float" />
      <div className="absolute bottom-40 left-10 w-24 h-24 bg-white dark:bg-black border-[3px] border-black dark:border-white transform -rotate-6"
           style={{boxShadow: '6px 6px 0px #000000'}} />
      <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-black dark:bg-white transform rotate-45" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div
          className={`mb-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="inline-flex items-center gap-2 neu-badge-accent">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs">AI-POWERED RESUME ENHANCEMENT</span>
          </div>
        </div>

        {/* Main Headline */}
        <h1
          className={`text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight mb-8 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{fontFamily: 'var(--font-space-grotesk)'}}
        >
          <span className="inline-block transform -rotate-1">YOUR SKILLS</span>
          <br />
          <span className="inline-block transform rotate-1">DESERVE BETTER</span>
          <br />
          <span className="inline-block relative">
            THAN BAD
            <span className="absolute -bottom-3 left-0 w-full h-4 bg-[#FFD700] -z-10"></span>
          </span>{" "}
          <span className="inline-block transform -rotate-1">FORMATTING</span>
        </h1>

        {/* Subheadline */}
        <p
          className={`text-xl sm:text-2xl font-medium text-black dark:text-white mb-12 max-w-3xl mx-auto transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          Upload your PDF → AI extracts & enhances → Download professionally formatted resume.
          <span className="font-bold"> No manual formatting needed.</span>
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-6 justify-center mb-16 transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <Link
            href="/upload"
            className="neu-btn-accent text-lg group inline-flex items-center justify-center gap-2"
          >
            GET STARTED FREE
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#how-it-works"
            className="neu-btn text-lg inline-flex items-center justify-center"
          >
            HOW IT WORKS
          </Link>
        </div>

        {/* Stats */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto transition-all duration-700 delay-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
          <div className="neu-card p-6">
            <div className="text-4xl font-black mb-2" style={{fontFamily: 'var(--font-space-grotesk)'}}>
              30 SEC
            </div>
            <div className="text-sm font-bold uppercase tracking-wide">Average Processing</div>
          </div>
          <div className="neu-card p-6 bg-[#FFD700] border-black" style={{boxShadow: '6px 6px 0px #000000'}}>
            <div className="text-4xl font-black mb-2" style={{fontFamily: 'var(--font-space-grotesk)'}}>
              100%
            </div>
            <div className="text-sm font-bold uppercase tracking-wide">ATS Compatible</div>
          </div>
          <div className="neu-card p-6">
            <div className="text-4xl font-black mb-2" style={{fontFamily: 'var(--font-space-grotesk)'}}>
              FREE
            </div>
            <div className="text-sm font-bold uppercase tracking-wide">No Credit Card</div>
          </div>
        </div>
      </div>
    </section>
  )
}
