"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, Copy, Check } from "lucide-react"
import { useState } from "react"

interface DownloadOptionsProps {
  resumeContent: string
  fileName?: string
  onDownload?: (format: "pdf" | "docx" | "txt") => void
}

export default function DownloadOptions({ resumeContent, fileName = "resume", onDownload }: DownloadOptionsProps) {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null)

  const handleCopy = (format: string) => {
    navigator.clipboard.writeText(resumeContent)
    setCopiedFormat(format)
    setTimeout(() => setCopiedFormat(null), 2000)
  }

  const handleDownload = (format: "pdf" | "docx" | "txt") => {
    if (onDownload) {
      onDownload(format)
    } else {
      // Default download behavior
      const element = document.createElement("a")
      const file = new Blob([resumeContent], { type: "text/plain" })
      element.href = URL.createObjectURL(file)
      element.download = `${fileName}.${format === "txt" ? "txt" : format}`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
  }

  const downloadOptions = [
    {
      format: "pdf" as const,
      title: "PDF",
      description: "Professional PDF format",
      icon: FileText,
      color: "text-red-600 dark:text-red-400",
    },
    {
      format: "docx" as const,
      title: "Word Document",
      description: "Editable Word format",
      icon: FileText,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      format: "txt" as const,
      title: "Plain Text",
      description: "Simple text format",
      icon: FileText,
      color: "text-slate-600 dark:text-slate-400",
    },
  ]

  return (
    <Card className="p-8 glass dark:glass-dark border-0">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <Download className="w-6 h-6" />
          Download Your Resume
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          Choose your preferred format and download your tailored resume
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {downloadOptions.map((option) => {
          const Icon = option.icon
          const isCopied = copiedFormat === option.format

          return (
            <div
              key={option.format}
              className="p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-slate-900 dark:hover:border-white transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <Icon className={`w-6 h-6 ${option.color}`} />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{option.title}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{option.description}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleDownload(option.format)}
                  className="flex-1 px-3 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold text-sm hover:shadow-lg transition-all duration-300"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <Button
                  onClick={() => handleCopy(option.format)}
                  variant="outline"
                  className="px-3 py-2 rounded-lg text-sm"
                >
                  {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-900 dark:text-blue-300">
          <span className="font-semibold">📋 Pro Tip:</span> PDF format is recommended for most applications as it
          preserves formatting. Use Word format if you need to make further edits.
        </p>
      </div>
    </Card>
  )
}
