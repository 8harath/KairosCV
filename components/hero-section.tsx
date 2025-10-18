"use client"

import { ChevronDown, Sparkles, ArrowRight } from "lucide-react"
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-30 dark:opacity-10">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-200 to-transparent dark:from-slate-700 dark:to-transparent" />
        <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-slate-300 dark:text-slate-700"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating orbs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-slate-200 dark:bg-slate-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-slate-300 dark:bg-slate-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo/Badge */}
        <div
          className={`mb-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass dark:glass-dark">
            <Sparkles className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              AI-Powered Resume Enhancement
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <h1
          className={`text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
            Your Skills Deserve Better Than Bad Formatting
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className={`text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          AI-powered resume enhancement that puts your talent first. Upload your PDF, get a professionally formatted,
          job-tailored resume in seconds.
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <Link
            href="/upload"
            className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="px-8 py-4 glass dark:glass-dark text-slate-900 dark:text-white rounded-full font-semibold text-lg hover:glass-hover transition-all duration-300">
            Learn More
          </button>
        </div>

        {/* Scroll indicator */}
        <div
          className={`flex justify-center transition-all duration-700 delay-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
          <div className="animate-bounce">
            <ChevronDown className="w-6 h-6 text-slate-400 dark:text-slate-500" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  )
}
