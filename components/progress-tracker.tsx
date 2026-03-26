"use client"

import { CheckCircle2, FileOutput, FileText, Loader2, Sparkles, WandSparkles } from "lucide-react"

interface ProgressTrackerProps {
  progress: number
  stage: string
  message: string
}

const stages = [
  { key: "uploading", label: "Upload", icon: FileText },
  { key: "parsing", label: "Parse", icon: FileText },
  { key: "enhancing", label: "Enhance", icon: Sparkles },
  { key: "generating", label: "Generate", icon: WandSparkles },
  { key: "compiling", label: "Compile", icon: FileOutput },
]

export default function ProgressTracker({ progress, stage, message }: ProgressTrackerProps) {
  const currentStageIndex = stages.findIndex((item) => item.key === stage)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Processing</h2>
          <p className="mt-1 text-sm text-muted-foreground">Your resume is being optimized.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          {Math.round(progress)}%
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
                {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
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
    </div>
  )
}
