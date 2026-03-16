"use client"

import { CheckCircle2, CircleDashed, FileOutput, FileText, Sparkles, WandSparkles } from "lucide-react"

interface ProgressTrackerProps {
  progress: number
  stage: string
  message: string
}

export default function ProgressTracker({ progress, stage, message }: ProgressTrackerProps) {
  const stages = ["uploading", "parsing", "enhancing", "generating", "compiling"]
  const stageLabels: Record<string, string> = {
    uploading: "Upload",
    parsing: "Parse",
    enhancing: "AI Enhance",
    generating: "Generate",
    compiling: "Compile",
  }
  const stageMessages: Record<string, string> = {
    uploading: "Uploading your resume...",
    parsing: "Extracting resume content...",
    enhancing: "AI is enhancing your content...",
    generating: "Generating optimized document...",
    compiling: "Compiling final PDF...",
  }
  const stageIcons = [FileText, Sparkles, WandSparkles, FileOutput, CircleDashed]

  const currentStageIndex = stages.indexOf(stage)

  return (
    <div className="card">
      <div className="mb-6 border-b-2 border-primary pb-4">
        <h2>Processing Your Resume</h2>
        <p className="mt-2 text-sm text-muted-foreground">This usually takes less than 60 seconds</p>
      </div>

      <div className="mb-8 border border-border bg-white/70 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">Current stage</p>
            <p className="mt-2 text-base font-black">{stageLabels[stage] || "Working"}</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-black">
            <CircleDashed className="h-4 w-4" />
            {Math.round(progress)}%
          </div>
        </div>
      </div>

      <div className="mb-8 space-y-5">
        {stages.map((s, idx) => {
          const isCompleted = currentStageIndex > idx
          const isActive = stage === s
          const isPending = currentStageIndex < idx
          const Icon = stageIcons[idx]

          return (
            <div key={s} className="flex items-start gap-4">
              <div
                className={`flex h-11 w-11 items-center justify-center border-2 ${
                  isCompleted
                    ? "border-success bg-white text-success"
                    : isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-white text-muted-foreground"
                }`}
              >
                {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>

              <div className="flex-1 pt-2">
                <p
                  className={`text-sm font-bold ${
                    isPending ? "text-muted-foreground" : isActive ? "text-primary" : ""
                  }`}
                >
                  {stageLabels[s]}
                </p>
                {isActive ? <p className="mt-1 text-xs text-muted-foreground">{stageMessages[s]}</p> : null}
                {isCompleted ? <p className="mt-1 text-xs font-semibold text-success">Complete</p> : null}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 border-2 border-primary bg-secondary p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-bold">Overall Progress</p>
          <p className="text-sm font-black">{Math.round(progress)}%</p>
        </div>
        <div className="relative h-4 overflow-hidden border-3 border-primary bg-white">
          <div className="relative h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {message ? <p className="mt-6 text-center text-sm font-medium text-muted-foreground">{message}</p> : null}
    </div>
  )
}
