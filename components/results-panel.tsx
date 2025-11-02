"use client"

interface ResultsPanelProps {
  pdfUrl: string | null
  downloadUrl: string | null
  onReset: () => void
}

export default function ResultsPanel({ pdfUrl, downloadUrl, onReset }: ResultsPanelProps) {
  return (
    <div className="space-y-6">
      {pdfUrl && (
        <div className="card">
          <div className="mb-6 border-b-3 border-primary pb-4">
            <h2>Optimized Resume Ready</h2>
          </div>

          <div className="pdf-preview">
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-96 md:h-[600px] border-3 border-primary"
              title="Optimized Resume PDF"
            />
          </div>

          <div className="mt-6 p-4 bg-secondary border-2 border-primary">
            <p className="text-sm font-bold mb-3">Optimization Complete:</p>
            <ul className="text-sm space-y-2">
              <li>✓ ATS-optimized formatting</li>
              <li>✓ Enhanced bullet points with action verbs</li>
              <li>✓ Improved keyword density</li>
              <li>✓ Professional LaTeX rendering</li>
            </ul>
          </div>
        </div>
      )}

      <div className="flex gap-4 justify-center flex-wrap md:flex-nowrap">
        <button className="btn flex-1" onClick={onReset}>
          Optimize Another Resume
        </button>

        {downloadUrl && (
          <a href={downloadUrl} download className="btn btn-secondary flex-1 text-center">
            Download PDF
          </a>
        )}
      </div>
    </div>
  )
}
