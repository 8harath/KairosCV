"use client"

import { useEffect, useState } from "react"

export default function LoadingAnimation() {
  const [scanPosition, setScanPosition] = useState(0)
  const [checkmarks, setCheckmarks] = useState<number[]>([])

  useEffect(() => {
    // Animate scanning line
    const scanInterval = setInterval(() => {
      setScanPosition((prev) => (prev >= 100 ? 0 : prev + 2))
    }, 30)

    // Add checkmarks progressively
    const checkmarkTimers = [
      setTimeout(() => setCheckmarks([1]), 400),
      setTimeout(() => setCheckmarks([1, 2]), 800),
      setTimeout(() => setCheckmarks([1, 2, 3]), 1200),
    ]

    return () => {
      clearInterval(scanInterval)
      checkmarkTimers.forEach(clearTimeout)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-8">
        {/* Document Icon with Scanning Effect */}
        <div className="relative">
          {/* Main Document */}
          <div className="w-48 h-64 border-4 border-primary bg-card relative overflow-hidden">
            {/* Document Header Lines */}
            <div className="absolute top-6 left-6 right-6 space-y-3">
              <div className="h-4 border-2 border-primary bg-primary w-3/4" />
              <div className="h-3 border-2 border-primary bg-gray-10 w-full" />
              <div className="h-3 border-2 border-primary bg-gray-10 w-5/6" />
            </div>

            {/* Document Content Lines */}
            <div className="absolute top-24 left-6 right-6 space-y-2">
              {[1, 2, 3, 4, 5].map((line) => (
                <div key={line} className="flex items-center gap-2">
                  {checkmarks.includes(line % 3 + 1) ? (
                    <div className="w-3 h-3 border-2 border-primary bg-primary flex-shrink-0 animate-check-pop" />
                  ) : (
                    <div className="w-3 h-3 border-2 border-gray-30 flex-shrink-0" />
                  )}
                  <div className="h-2 border border-gray-30 bg-gray-05 flex-1" />
                </div>
              ))}
            </div>

            {/* Scanning Line */}
            <div
              className="absolute left-0 right-0 h-1 bg-primary"
              style={{
                top: `${scanPosition}%`,
                boxShadow: "0 0 8px rgba(0, 0, 0, 0.3)",
                transition: "top 30ms linear",
              }}
            />

            {/* Corner Fold */}
            <div className="absolute top-0 right-0 w-0 h-0 border-l-[24px] border-l-transparent border-t-[24px] border-t-primary" />
          </div>

          {/* Processing Indicator */}
          <div className="absolute -bottom-4 -right-4 w-12 h-12 border-3 border-primary bg-card flex items-center justify-center animate-spin-slow">
            <div className="w-6 h-6 border-2 border-primary bg-primary" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h2 className="text-2xl font-black mb-2">OPTIMIZING</h2>
          <div className="flex gap-1 justify-center">
            <span className="w-2 h-2 bg-primary animate-pulse" />
            <span className="w-2 h-2 bg-primary animate-pulse" style={{ animationDelay: "0.2s" }} />
            <span className="w-2 h-2 bg-primary animate-pulse" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
      </div>
    </div>
  )
}

