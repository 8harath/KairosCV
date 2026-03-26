"use client"

import { Download, RotateCcw } from "lucide-react"
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

      {showDebugTools ? <ExtractedDataViewer fileId={fileId} /> : null}
    </div>
  )
}
