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
        <div className="card">
          <div className="mb-6 border-b-3 border-primary pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center border-2 border-primary bg-white">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h2>Optimized Resume Ready</h2>
                <p className="mt-1 text-sm text-muted-foreground">Your polished output is ready to review and download.</p>
              </div>
            </div>
          </div>

          <div className="pdf-preview">
            <iframe
              src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="h-96 w-full border-3 border-primary md:h-[600px]"
              title="Optimized Resume PDF"
            />
          </div>

          <div className="mt-6 border-2 border-primary bg-secondary p-4">
            <p className="mb-3 text-sm font-bold">Optimization Complete:</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                ATS-optimized formatting
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Enhanced bullet points with stronger phrasing
              </li>
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Improved keyword density and structure
              </li>
              <li className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Final PDF ready for download
              </li>
            </ul>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap justify-center gap-4 md:flex-nowrap">
        <button className="btn flex-1 inline-flex items-center justify-center gap-2" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
          Optimize Another Resume
        </button>

        {downloadUrl ? (
          <a
            href={downloadUrl}
            download
            className="btn btn-secondary flex-1 inline-flex items-center justify-center gap-2 text-center"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </a>
        ) : null}
      </div>

      {showDebugTools ? <ExtractedDataViewer fileId={fileId} /> : null}
    </div>
  )
}
