"use client"

interface ProgressTrackerProps {
  progress: number
  stage: string
  message: string
}

export default function ProgressTracker({ progress, stage, message }: ProgressTrackerProps) {
  const stages = ["uploading", "parsing", "enhancing", "generating", "compiling"]
  const stageMessages: Record<string, string> = {
    uploading: "Uploading file...",
    parsing: "Parsing resume content...",
    enhancing: "AI Enhancement in progress...",
    generating: "Generating optimized document...",
    compiling: "Compiling PDF...",
  }

  const currentStageIndex = stages.indexOf(stage)

  return (
    <div className="card">
      <div className="mb-6 border-b-3 border-primary pb-4">
        <h2>Processing Your Resume</h2>
      </div>

      <div className="space-y-6">
        {stages.map((s, idx) => (
          <div key={s} className="stage-indicator">
            <div className={`stage-dot ${currentStageIndex > idx ? "completed" : stage === s ? "active" : ""}`}>
              {currentStageIndex > idx ? "✓" : idx + 1}
            </div>
            <div className="flex-1">
              <p className="font-semibold capitalize">{s.replace("_", " ")}</p>
              {stage === s && <p className="text-muted-foreground text-sm">{stageMessages[s] || message}</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-semibold">Progress</p>
          <p className="text-sm font-bold">{Math.round(progress)}%</p>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <p className="text-center text-muted-foreground text-sm mt-6">{message || "Processing your resume..."}</p>
    </div>
  )
}
