"use client"

import { DownloadIcon, CheckIcon } from "@/components/icons"
import Badge from "@/components/Badge"

interface ResultsPanelProps {
  pdfUrl: string | null
  downloadUrl: string | null
  onReset: () => void
}

export default function ResultsPanel({ pdfUrl, downloadUrl, onReset }: ResultsPanelProps) {
  // Use downloadUrl with preview parameter for iframe
  const previewUrl = downloadUrl ? `${downloadUrl}?preview=true` : pdfUrl

  return (
    <div className="space-y-6">
      {/* Success Celebration */}
      <div className="card-elevated bg-primary text-primary-foreground text-center animate-in zoom-in">
        <div className="text-6xl mb-4 animate-in zoom-in delay-100">🎉</div>
        <h2 className="text-white mb-2">Your Resume is Ready!</h2>
        <p className="text-lg opacity-90">Optimized and ATS-approved</p>
      </div>

      {/* Preview Section */}
      {previewUrl && (
        <div className="card animate-in fade-in delay-200">
          <div className="mb-6 border-b-2 border-primary pb-4">
            <h3 className="text-xl font-bold">Preview Your Optimized Resume</h3>
          </div>

          <div className="relative">
            <div className="pdf-preview">
              <iframe
                src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-96 md:h-[600px] border-2 border-primary"
                title="Optimized Resume PDF"
              />
            </div>

            {/* Floating Badges */}
            <div className="absolute top-4 right-4 space-y-2 hidden md:block">
              <Badge variant="success" className="block">
                ✓ ATS Score: 95%
              </Badge>
              <Badge variant="success" className="block">
                ✓ Keywords: Optimized
              </Badge>
              <Badge variant="success" className="block">
                ✓ Format: Clean
              </Badge>
            </div>
          </div>

          {/* Improvements List */}
          <div className="mt-6 p-6 bg-secondary border-2 border-primary">
            <p className="font-bold mb-4 flex items-center gap-2">
              <CheckIcon className="w-5 h-5" />
              What We Optimized:
            </p>
            <ul className="grid sm:grid-cols-2 gap-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-success font-bold">✓</span>
                <span>ATS-friendly formatting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success font-bold">✓</span>
                <span>Enhanced action verbs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success font-bold">✓</span>
                <span>Keyword optimization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success font-bold">✓</span>
                <span>Professional layout</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {downloadUrl && (
          <a
            href={downloadUrl}
            download
            className="btn-hero flex-1 text-center inline-flex items-center justify-center gap-2"
          >
            <DownloadIcon className="w-5 h-5" />
            Download Your Optimized Resume
          </a>
        )}
      </div>

      <div className="text-center">
        <button onClick={onReset} className="btn-ghost">
          Optimize Another Resume
        </button>
      </div>
    </div>
  )
}
