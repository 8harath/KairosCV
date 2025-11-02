"use client"

import { useEffect, useState } from "react"

export default function LoadingAnimation() {
  const [lettersVisible, setLettersVisible] = useState(0)

  useEffect(() => {
    // Animate letters one by one
    const letterInterval = setInterval(() => {
      setLettersVisible((prev) => {
        if (prev >= 8) {
          clearInterval(letterInterval)
          return 8
        }
        return prev + 1
      })
    }, 100)

    return () => clearInterval(letterInterval)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="relative">
        {/* Animated geometric shapes */}
        <div className="relative w-64 h-64">
          {/* Outer square */}
          <div className="absolute inset-0 border-3 border-primary bg-secondary animate-pulse-neobrutal" />

          {/* Middle square */}
          <div className="absolute inset-8 border-3 border-primary bg-primary animate-pulse-neobrutal-delay-1" />

          {/* Inner square */}
          <div className="absolute inset-16 border-3 border-primary bg-secondary animate-pulse-neobrutal-delay-2" />

          {/* Animated rectangles */}
          <div className="absolute top-2 left-2 w-12 h-4 border-2 border-primary bg-primary animate-slide-neobrutal" />
          <div className="absolute bottom-2 right-2 w-12 h-4 border-2 border-primary bg-primary animate-slide-neobrutal-delay" />
        </div>

        {/* KAIROSCV text animation */}
        <div className="mt-12 text-center">
          <div className="inline-block">
            {"KAIROSCV".split("").map((letter, idx) => (
              <span
                key={idx}
                className={`inline-block text-4xl md:text-5xl font-black text-primary tracking-widest loading-letter ${
                  idx < lettersVisible ? "letter-visible" : "letter-hidden"
                }`}
                style={{
                  fontFamily: "var(--font-display)",
                  letterSpacing: "0.15em",
                  animationDelay: `${idx * 0.1}s`,
                }}
              >
                {letter}
              </span>
            ))}
          </div>
          <div className="mt-4 w-48 h-2 border-2 border-primary bg-primary mx-auto loading-bar" />
        </div>
      </div>
    </div>
  )
}

