"use client"

import { Download, FileText, RotateCcw, ShieldCheck, Sparkles } from "lucide-react"
import ExtractedDataViewer from "./extracted-data-viewer"

interface ResultsPanelProps {
  pdfUrl: string | null
  downloadUrl: string | null
  fileId: string | null
  onReset: () => void
}

export default function ResultsPanel({ pdfUrl, downloadUrl, fileId, onReset }: ResultsPanelProps) {
  const previewUrl = downloadUrl ? `${downloadUrl}?preview=true` : pdfUrl
  const showDebugTools = process.env.NEXT_PUBLIC_ENABLE_DEBUG_TOOLS === "true"

  return (
    <div className="space-y-6">
      {previewUrl ? (
        <div className="surface-panel-strong p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="section-header-kicker">Completed</div>
              <h2 className="mt-4 text-balance">Your optimized resume is ready to review.</h2>
              <p className="mt-3 text-sm">Preview the document below, then download it or start a new pass with a different draft.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="pill-badge"><ShieldCheck className="h-3.5 w-3.5" /> ATS-friendly structure</span>
              <span className="pill-badge"><Sparkles className="h-3.5 w-3.5" /> Improved phrasing</span>
            </div>
          </div>

          <div className="pdf-preview mt-8">
            <iframe
              src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="h-[420px] w-full md:h-[700px]"
              title="Optimized Resume PDF"
            />
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="metric-tile">
              <p className="text-sm font-medium text-foreground">Formatting</p>
              <p className="mt-2 text-sm">Cleaner layout and hierarchy built for ATS scanning and human readability.</p>
            </div>
            <div className="metric-tile">
              <p className="text-sm font-medium text-foreground">Language</p>
              <p className="mt-2 text-sm">Stronger bullet phrasing and a more consistent tone across sections.</p>
            </div>
            <div className="metric-tile">
              <p className="text-sm font-medium text-foreground">Output</p>
              <p className="mt-2 text-sm">A final PDF ready for direct download and application use.</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="btn-secondary flex-1" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
          Optimize another
        </button>

        {downloadUrl ? (
          <a href={downloadUrl} download className="btn flex-1 text-center">
            <Download className="h-4 w-4" />
            Download PDF
          </a>
        ) : null}
      </div>

      {!previewUrl ? (
        <div className="empty-state">
          <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-4 text-xl">Preparing preview</h2>
          <p className="mx-auto mt-2 max-w-md text-sm">The generated file is almost ready. If it does not appear, try downloading directly or restarting the flow.</p>
        </div>
      ) : null}

      {showDebugTools ? <ExtractedDataViewer fileId={fileId} /> : null}
    </div>
  )
}
