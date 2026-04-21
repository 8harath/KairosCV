"use client"

import { useEffect } from "react"
import { X } from "lucide-react"

interface TemplatePreviewModalProps {
  variant: string
  name: string
  onClose: () => void
}

export default function TemplatePreviewModal({ variant, name, onClose }: TemplatePreviewModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col bg-background rounded-lg shadow-2xl w-full max-w-2xl"
        style={{ height: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <div>
            <span className="text-sm font-semibold text-foreground">{name} Template</span>
            <span className="ml-2 text-xs text-muted-foreground">Sample resume — Alex Johnson</span>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close preview"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden rounded-b-lg">
          <iframe
            src={`/samples/${variant}-sample.html`}
            className="w-full h-full border-none"
            title={`${name} template sample resume`}
            sandbox="allow-same-origin"
          />
        </div>
      </div>
    </div>
  )
}
