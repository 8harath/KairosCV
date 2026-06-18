"use client"

import { useEffect, useState } from "react"

/**
 * Animated ATS-readiness gauge for the landing hero.
 * Counts the number up and draws the arc in sync on mount.
 * The only client island on an otherwise CSS-driven page.
 */
export default function ScoreGauge({ value = 92 }: { value?: number }) {
  const [progress, setProgress] = useState(0) // 0..1, drives both arc + number

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      setProgress(1)
      return
    }

    let raf = 0
    let startTs = 0
    const duration = 1500
    const delay = 350

    const step = (now: number) => {
      if (!startTs) startTs = now
      const t = Math.min(1, Math.max(0, (now - startTs - delay) / duration))
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      setProgress(eased)
      if (t < 1) raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  const r = 54
  const stroke = 9
  const size = (r + stroke) * 2
  const circumference = 2 * Math.PI * r
  const arc = circumference * 0.75 // 270° dial
  const display = Math.round(progress * value)
  const dashOffset = arc - (display / 100) * arc

  return (
    <div className="relative flex flex-col items-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-[135deg]"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arc} ${circumference}`}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--signal)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arc} ${circumference}`}
          strokeDashoffset={dashOffset}
        />
      </svg>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="lp-mono text-5xl font-semibold leading-none tracking-tight text-foreground tabular-nums">
          {display}
        </span>
        <span className="lp-mono mt-1.5 text-[11px] text-muted-foreground">/ 100</span>
      </div>

      <span className="lp-kicker mt-3" aria-label={`ATS readiness ${value} out of 100`}>
        ATS readiness
      </span>
    </div>
  )
}
