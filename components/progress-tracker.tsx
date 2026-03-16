"use client"

import { CheckCircle2, FileOutput, FileText, LoaderCircle, Sparkles, WandSparkles } from "lucide-react"

interface ProgressTrackerProps {
  progress: number
  stage: string
  message: string
}

const stages = [
  { key: "uploading", label: "Upload", icon: FileText, helper: "Receiving your source resume." },
  { key: "parsing", label: "Parse", icon: FileText, helper: "Extracting and organizing the content." },
  { key: "enhancing", label: "Enhance", icon: Sparkles, helper: "Improving structure and bullet quality." },
  { key: "generating", label: "Generate", icon: WandSparkles, helper: "Building the polished resume output." },
  { key: "compiling", label: "Compile", icon: FileOutput, helper: "Preparing the final PDF for review." },
]

export default function ProgressTracker({ progress, stage, message }: ProgressTrackerProps) {
  const currentStageIndex = stages.findIndex((item) => item.key === stage)

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="surface-panel-strong p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">Processing</p>
            <h2 className="mt-3 text-balance">Your resume is moving through the optimization pipeline.</h2>
          </div>
          <div className="pill-badge">
            <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
            {Math.round(progress)}%
          </div>
        </div>

        <div className="mt-8 progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="mt-8 space-y-4">
          {stages.map(({ key, label, icon: Icon, helper }, index) => {
            const isCompleted = currentStageIndex > index
            const isActive = stage === key

            return (
              <div key={key} className="flex items-start gap-4 rounded-2xl border border-border/70 bg-card/70 px-4 py-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isCompleted ? "bg-secondary text-success" : isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                  {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Icon className={`h-5 w-5 ${isActive ? "" : ""}`} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <span className="text-xs text-muted-foreground">{isCompleted ? "Done" : isActive ? "In progress" : "Pending"}</span>
                  </div>
                  <p className="mt-1 text-sm">{isActive && message ? message : helper}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <aside className="space-y-4">
        <div className="surface-panel p-5">
          <p className="text-sm font-medium text-foreground">Expected time</p>
          <p className="mt-3 text-sm">Most resumes finish in under a minute, depending on file complexity and AI processing time.</p>
        </div>
        <div className="surface-panel p-5">
          <p className="text-sm font-medium text-foreground">What we handle</p>
          <p className="mt-3 text-sm">Section detection, cleanup, stronger phrasing, and export into a more ATS-friendly final format.</p>
        </div>
      </aside>
    </div>
  )
}
