"use client"

import { useEffect, useState } from "react"
import LoadingDocumentTransform from "./LoadingDocumentTransform"

/**
 * Main loading screen animation for the application
 * Features the document transform animation with soft brutalism styling
 */
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
      <div className="relative text-center">
        {/* Document Transform Animation */}
        <LoadingDocumentTransform />

        {/* KAIROSCV text animation */}
        <div className="mt-8">
          <div className="inline-block">
            {"KAIROSCV".split("").map((letter, idx) => (
              <span
                key={idx}
                className={`inline-block text-3xl md:text-4xl font-black text-primary tracking-wide loading-letter ${
                  idx < lettersVisible ? "letter-visible" : "letter-hidden"
                }`}
                style={{
                  fontFamily: "var(--font-display)",
                  letterSpacing: "0.1em",
                  animationDelay: `${idx * 0.1}s`,
                }}
              >
                {letter}
              </span>
            ))}
          </div>

          {/* Animated progress bar */}
          <div className="mt-6 w-64 h-2 bg-gray-10 mx-auto rounded-full overflow-hidden">
            <div className="h-full bg-accent animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
