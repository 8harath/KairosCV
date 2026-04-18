"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Download, Info, RotateCcw } from "lucide-react"
import ExtractedDataViewer from "./extracted-data-viewer"
import type { ConfidenceSummary } from "@/hooks/use-resume-optimizer"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SECTION_LABELS: Record<string, string> = {
  contact: "Contact",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
}

function levelColor(level: ConfidenceSummary["level"]) {
  switch (level) {
    case "excellent": return { bg: "bg-green-500/10", text: "text-green-600", ring: "ring-green-500/30" }
    case "good":      return { bg: "bg-blue-500/10",  text: "text-blue-600",  ring: "ring-blue-500/30" }
    case "fair":      return { bg: "bg-yellow-500/10",text: "text-yellow-600",ring: "ring-yellow-500/30" }
    case "poor":      return { bg: "bg-red-500/10",   text: "text-red-600",   ring: "ring-red-500/30" }
  }
}

function ScoreBar({ score }: { score: number }) {
  const pct = Math.round(score)
  const color = pct >= 75 ? "bg-green-500" : pct >= 60 ? "bg-yellow-500" : "bg-red-500"
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-7 text-right text-xs tabular-nums text-muted-foreground">{pct}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ConfidenceCard
// ---------------------------------------------------------------------------

function ConfidenceCard({ confidence }: { confidence: ConfidenceSummary }) {
  const colors = levelColor(confidence.level)
  const topSuggestions = confidence.suggestions.slice(0, 4)

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4">
      {/* Header row */}
      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ring-2 ${colors.bg} ${colors.ring}`}>
          <span className={`text-lg font-bold tabular-nums ${colors.text}`}>{Math.round(confidence.overall)}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Resume Quality Score</p>
          <p className={`text-xs font-medium capitalize ${colors.text}`}>{confidence.level}</p>
        </div>
      </div>

      {/* Per-section bars */}
      <div className="space-y-2">
        {Object.entries(confidence.sections).map(([key, val]) => (
          <div key={key} className="grid grid-cols-[80px_1fr] items-center gap-2">
            <span className="text-xs text-muted-foreground">{SECTION_LABELS[key] ?? key}</span>
            <ScoreBar score={val.score} />
          </div>
        ))}
      </div>

      {/* Improvement suggestions */}
      {topSuggestions.length > 0 && (
        <div className="space-y-1.5 border-t border-border pt-3">
          <p className="text-xs font-medium text-foreground">Suggestions to improve</p>
          {topSuggestions.map((s, i) => (
            <div key={i} className="flex gap-2 text-xs text-muted-foreground">
              <Info className="mt-0.5 h-3 w-3 shrink-0 text-yellow-500" />
              <span>{s}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// ResultsPanel
// ---------------------------------------------------------------------------

interface ResultsPanelProps {
  pdfUrl: string | null
  downloadUrl: string | null
  fileId: string | null
  onReset: () => void
  confidence?: ConfidenceSummary | null
  jobDescription?: string | null
}

export default function ResultsPanel({
  pdfUrl,
  downloadUrl,
  fileId,
  onReset,
  confidence,
  jobDescription,
}: ResultsPanelProps) {
  const previewUrl = downloadUrl ? `${downloadUrl}?preview=true` : pdfUrl
  const showDebugTools = process.env.NEXT_PUBLIC_ENABLE_DEBUG_TOOLS === "true"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Your resume is ready</h2>
        <p className="mt-1 text-sm text-muted-foreground">Preview the result below, then download or start over.</p>
      </div>

      {previewUrl ? (
        <div className="pdf-preview">
          <iframe
            src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            className="h-[450px] w-full md:h-[650px]"
            title="Optimized Resume PDF"
          />
        </div>
      ) : (
        <div className="empty-state">
          <p className="text-sm text-muted-foreground">Preparing preview...</p>
        </div>
      )}

      <div className="flex gap-3">
        <button className="btn-secondary flex-1" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
          Start over
        </button>
        {downloadUrl ? (
          <a href={downloadUrl} download className="btn flex-1 text-center">
            <Download className="h-4 w-4" />
            Download PDF
          </a>
        ) : null}
      </div>

      {confidence && <ConfidenceCard confidence={confidence} />}

      {jobDescription && fileId && (
        <KeywordMatchCard fileId={fileId} jobDescription={jobDescription} />
      )}

      {showDebugTools ? <ExtractedDataViewer fileId={fileId} /> : null}
    </div>
  )
}

// ---------------------------------------------------------------------------
// KeywordMatchCard — lazy-fetches resume JSON and compares to JD keywords
// ---------------------------------------------------------------------------

const STOPWORDS = new Set([
  "a","an","the","and","or","but","in","on","at","to","for","of","with",
  "is","are","was","were","be","been","being","have","has","had","do","does",
  "did","will","would","could","should","may","might","shall","can","that",
  "this","these","those","it","its","we","you","your","our","their","they",
  "he","she","his","her","from","by","as","up","out","if","about","into",
  "through","during","before","after","above","below","between","each","more",
  "most","other","some","such","no","not","only","same","so","than","too",
  "very","just","also","both","all","any","few","who","which","when","where",
])

function extractKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w))
  return [...new Set(words)]
}

function KeywordMatchCard({ fileId, jobDescription }: { fileId: string; jobDescription: string }) {
  const [matched, setMatched] = useState<string[]>([])
  const [missed, setMissed] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!fileId || !jobDescription) return
    let cancelled = false

    async function run() {
      try {
        const res = await fetch(`/api/json/${fileId}`)
        if (!res.ok) { setLoading(false); return }
        const data = await res.json()
        const resumeText = JSON.stringify(data).toLowerCase()

        const jdKeywords = extractKeywords(jobDescription)
        const hit: string[] = []
        const miss: string[] = []

        for (const kw of jdKeywords) {
          if (resumeText.includes(kw)) hit.push(kw)
          else miss.push(kw)
        }

        if (!cancelled) {
          setMatched(hit)
          setMissed(miss.slice(0, 12))
          setLoading(false)
        }
      } catch {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => { cancelled = true }
  }, [fileId, jobDescription])

  if (loading) return null
  if (matched.length === 0 && missed.length === 0) return null

  const total = matched.length + missed.length
  const pct = total > 0 ? Math.round((matched.length / total) * 100) : 0

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">Keyword Match</p>
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
          pct >= 70 ? "bg-green-500/10 text-green-600" :
          pct >= 40 ? "bg-yellow-500/10 text-yellow-600" :
                      "bg-red-500/10 text-red-600"
        }`}>
          {pct}% matched
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${pct >= 70 ? "bg-green-500" : pct >= 40 ? "bg-yellow-500" : "bg-red-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        {matched.length} of {total} keywords from your job description appear in the resume.
      </p>

      {missed.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-foreground">Missing keywords to consider adding</p>
          <div className="flex flex-wrap gap-1.5">
            {missed.map((kw) => (
              <span key={kw} className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {matched.length > 0 && (
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3 w-3 text-green-500" />
          <p className="text-xs font-medium text-foreground">{matched.length} keywords already matched</p>
        </div>
      )}
    </div>
  )
}
