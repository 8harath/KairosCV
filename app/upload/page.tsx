"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import EnhancedUploadSection from "@/components/enhanced-upload-section"

export default function UploadPage() {
  const [processedFile, setProcessedFile] = useState<{ name: string; content: string } | null>(null)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Back button */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-full glass dark:glass-dark text-slate-900 dark:text-white hover:glass-hover transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <div className="pt-24 pb-12">
        <EnhancedUploadSection onFileProcessed={setProcessedFile} />
      </div>
    </main>
  )
}
