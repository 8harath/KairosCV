"use client"

import { CheckCircle2, Loader, AlertCircle } from "lucide-react"

interface ProcessingStatusProps {
  status: "uploading" | "analyzing" | "extracting" | "complete" | "error"
  progress?: number
  message?: string
}

export default function ProcessingStatus({ status, progress = 0, message }: ProcessingStatusProps) {
  const statusConfig = {
    uploading: {
      icon: Loader,
      title: "Uploading Resume",
      description: "Preparing your file for analysis...",
      color: "text-blue-600 dark:text-blue-400",
    },
    analyzing: {
      icon: Loader,
      title: "Analyzing Content",
      description: "Our AI is reading your resume...",
      color: "text-purple-600 dark:text-purple-400",
    },
    extracting: {
      icon: Loader,
      title: "Extracting Information",
      description: "Identifying skills, experience, and achievements...",
      color: "text-indigo-600 dark:text-indigo-400",
    },
    complete: {
      icon: CheckCircle2,
      title: "Analysis Complete",
      description: "Your resume is ready for enhancement",
      color: "text-green-600 dark:text-green-400",
    },
    error: {
      icon: AlertCircle,
      title: "Processing Error",
      description: message || "Something went wrong. Please try again.",
      color: "text-red-600 dark:text-red-400",
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`mb-4 ${config.color}`}>
        {status === "uploading" || status === "analyzing" || status === "extracting" ? (
          <Icon className="w-16 h-16 animate-spin" />
        ) : (
          <Icon className="w-16 h-16" />
        )}
      </div>

      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{config.title}</h3>
      <p className="text-slate-600 dark:text-slate-300 mb-6">{config.description}</p>

      {(status === "uploading" || status === "analyzing" || status === "extracting") && (
        <div className="w-full max-w-xs">
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-2">{progress}%</p>
        </div>
      )}
    </div>
  )
}
