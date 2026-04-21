"use client"

import { BarChart2, CheckCircle2, FileOutput, FileText, Loader2, Sparkles, WandSparkles } from "lucide-react"

// Empirical baseline: typical end-to-end processing takes ~45 seconds.
const BASELINE_SECONDS = 45

interface ProgressTrackerProps {
  progress: number
  stage: string
  message: string
  elapsed?: number
}

const stages = [
  { key: "parsing",    label: "Parse",    icon: FileText,     matches: ["parsing"] },
  { key: "extraction", label: "Extract",  icon: WandSparkles, matches: ["extraction", "verified", "retry_extraction"] },
  { key: "enhancing",  label: "Enhance",  icon: Sparkles,     matches: ["enhancing", "tailoring"] },
  { key: "scoring",    label: "Score",    icon: BarChart2,    matches: ["scoring"] },
  { key: "generating", label: "Generate", icon: FileOutput,   matches: ["generating", "complete"] },
]

function formatSeconds(s: number): string {
  if (s < 60) return `${s}s`
  return `${Math.floor(s / 60)}m ${s % 60}s`
}

export default function ProgressTracker({ progress, stage, message, elapsed = 0 }: ProgressTrackerProps) {
  // Match the raw pipeline stage key against each visual stage's matches[] list.
  // Returns -1 when stage is empty/unknown, leaving all rows in pending state.
  const currentStageIndex = stages.findIndex((s) => s.matches.includes(stage))

  // Estimate remaining time: use progress % as the primary signal when available,
  // fall back to elapsed vs baseline when progress is still 0.
  const remaining =
    progress > 5
      ? Math.max(0, Math.round(((100 - progress) / progress) * elapsed))
      : Math.max(0, BASELINE_SECONDS - elapsed)

  const showEta = elapsed > 3 && progress < 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Processing</h2>
          <p className="mt-1 text-sm text-muted-foreground">Your resume is being optimized.</p>
        </div>
        <div className="flex flex-col items-end gap-0.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            {Math.round(progress)}%
          </div>
          {showEta && (
            <span className="text-xs tabular-nums">
              ~{formatSeconds(remaining)} remaining
            </span>
          )}
        </div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="space-y-2">
        {stages.map(({ key, label, icon: Icon }, index) => {
          const isCompleted = currentStageIndex > index
          const isActive = stage === key

          return (
            <div
              key={key}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                isActive ? "bg-secondary" : ""
              }`}
            >
              <div className={`flex h-7 w-7 items-center justify-center rounded-md ${
                isCompleted ? "bg-success/10 text-success" :
                isActive ? "bg-primary text-primary-foreground" :
                "bg-secondary text-muted-foreground"
              }`}>
                {isCompleted
                ? <CheckCircle2 className="h-4 w-4" />
                : isActive
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <Icon className="h-4 w-4" />
              }
              </div>
              <span className={isActive ? "font-medium text-foreground" : isCompleted ? "text-foreground" : "text-muted-foreground"}>
                {label}
              </span>
              {isActive && message ? (
                <span className="ml-auto text-xs text-muted-foreground">{message}</span>
              ) : null}
              {isCompleted ? (
                <span className="ml-auto text-xs text-muted-foreground">Done</span>
              ) : null}
            </div>
          )
        })}
      </div>

      {elapsed > 0 && (
        <p className="text-center text-xs text-muted-foreground tabular-nums">
          {formatSeconds(elapsed)} elapsed
        </p>
      )}
    </div>
  )
}
