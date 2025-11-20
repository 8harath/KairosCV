"use client"

import { CheckIcon } from "@/components/icons"

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

  const currentStageIndex = stages.indexOf(stage)

  return (
    <div className="card">
      <div className="mb-6 border-b-2 border-primary pb-4">
        <h2>Processing Your Resume</h2>
        <p className="text-sm text-muted-foreground mt-2">
          This usually takes less than 60 seconds
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {stages.map((s, idx) => {
          const isCompleted = currentStageIndex > idx
          const isActive = stage === s
          const isPending = currentStageIndex < idx

          return (
            <div key={s} className="flex items-center gap-4">
              {/* Stage Dot */}
              <div
                className={`stage-dot ${isCompleted ? "completed" : isActive ? "active" : ""}`}
              >
                {isCompleted ? (
                  <CheckIcon className="w-5 h-5 animate-in zoom-in" />
                ) : (
                  <span className="text-sm font-black">{idx + 1}</span>
                )}
              </div>

              {/* Connecting Line */}
              {idx < stages.length - 1 && (
                <div className={`stage-line ${isCompleted ? "completed" : ""}`} />
              )}

              {/* Stage Info */}
              <div className="flex-1">
                <p className={`font-bold text-sm ${isPending ? "text-muted-foreground" : ""}`}>
                  {stageLabels[s]}
                </p>
                {isActive && (
                  <p className="text-muted-foreground text-xs mt-1 animate-in fade-in">
                    {stageMessages[s]}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-bold">Overall Progress</p>
          <p className="text-sm font-black">{Math.round(progress)}%</p>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}>
            <span className="sr-only">{Math.round(progress)}% complete</span>
          </div>
        </div>
      </div>

      {message && (
        <p className="text-center text-muted-foreground text-sm mt-6 animate-in fade-in">
          {message}
        </p>
      )}
    </div>
  )
}
