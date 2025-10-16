"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"

interface ResumeVersion {
  title: string
  content: string
  highlights?: string[]
}

interface ResumeComparisonProps {
  original: ResumeVersion
  tailored: ResumeVersion
}

export default function ResumeComparison({ original, tailored }: ResumeComparisonProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Original Resume */}
      <Card className="p-6 glass dark:glass-dark border-0">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{original.title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Your original resume</p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 mb-4 max-h-96 overflow-y-auto">
          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono">{original.content}</p>
        </div>

        {original.highlights && original.highlights.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Key Sections:</p>
            <div className="flex flex-wrap gap-2">
              {original.highlights.map((highlight, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {highlight}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Tailored Resume */}
      <Card className="p-6 glass dark:glass-dark border-0 ring-2 ring-slate-900 dark:ring-white">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{tailored.title}</h3>
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Optimized for your target role</p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 mb-4 max-h-96 overflow-y-auto">
          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono">{tailored.content}</p>
        </div>

        {tailored.highlights && tailored.highlights.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Optimizations:</p>
            <div className="flex flex-wrap gap-2">
              {tailored.highlights.map((highlight, idx) => (
                <Badge
                  key={idx}
                  className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                >
                  {highlight}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
