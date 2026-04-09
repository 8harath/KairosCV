"use client"

import { useState } from "react"
import { Download, Eye, FileText, Trash2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ResumeEntry {
  id: string
  job_id: string | null
  title: string
  original_filename: string
  created_at: string
}

interface ResumeListProps {
  initialResumes: ResumeEntry[]
}

export default function ResumeList({ initialResumes }: ResumeListProps) {
  const [resumes, setResumes] = useState(initialResumes)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handlePreview = (resume: ResumeEntry) => {
    const fileId = resume.job_id || resume.id
    window.open(`/api/download/${fileId}?preview=true`, "_blank")
  }

  const getDownloadUrl = (resume: ResumeEntry) => {
    const fileId = resume.job_id || resume.id
    return `/api/download/${fileId}`
  }

  const handleDelete = async (resume: ResumeEntry) => {
    if (deletingId) return

    setDeletingId(resume.id)
    try {
      const response = await fetch(`/api/resume/${resume.id}`, { method: "DELETE" })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Delete failed")
      }
      setResumes((prev) => prev.filter((r) => r.id !== resume.id))
      toast({ title: "Resume deleted" })
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  if (resumes.length === 0) {
    return null
  }

  return (
    <div className="mt-4 divide-y divide-border">
      {resumes.map((resume) => (
        <div key={resume.id} className="flex items-center justify-between gap-4 py-3">
          <button
            onClick={() => handlePreview(resume)}
            className="flex min-w-0 items-center gap-3 text-left hover:opacity-80 transition-opacity"
          >
            <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{resume.title || resume.original_filename}</p>
              <p className="truncate text-xs text-muted-foreground">
                {new Date(resume.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </button>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => handlePreview(resume)}
              className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Preview PDF"
            >
              <Eye className="h-4 w-4" />
            </button>
            <a
              href={getDownloadUrl(resume)}
              download
              className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Download PDF"
            >
              <Download className="h-4 w-4" />
            </a>
            <button
              onClick={() => handleDelete(resume)}
              disabled={deletingId === resume.id}
              className="rounded-md p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors disabled:opacity-50"
              aria-label="Delete resume"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
