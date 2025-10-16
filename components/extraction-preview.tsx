"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Briefcase, Award, Mail, Phone } from "lucide-react"

interface ExtractedData {
  name?: string
  email?: string
  phone?: string
  summary?: string
  experience?: Array<{
    title: string
    company: string
    duration: string
    description: string
  }>
  skills?: string[]
  education?: Array<{
    degree: string
    school: string
    year: string
  }>
}

interface ExtractionPreviewProps {
  data: ExtractedData
  isLoading?: boolean
}

export default function ExtractionPreview({ data, isLoading = false }: ExtractionPreviewProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      {(data.name || data.email || data.phone) && (
        <Card className="p-6 glass dark:glass-dark border-0">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Contact Information
          </h3>
          <div className="space-y-3">
            {data.name && (
              <div className="flex items-center gap-3">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Name:</span>
                <span className="text-slate-900 dark:text-white">{data.name}</span>
              </div>
            )}
            {data.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-slate-900 dark:text-white">{data.email}</span>
              </div>
            )}
            {data.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-slate-900 dark:text-white">{data.phone}</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Professional Summary */}
      {data.summary && (
        <Card className="p-6 glass dark:glass-dark border-0">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Professional Summary</h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{data.summary}</p>
        </Card>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <Card className="p-6 glass dark:glass-dark border-0">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Experience ({data.experience.length})
          </h3>
          <div className="space-y-4">
            {data.experience.map((exp, idx) => (
              <div key={idx} className="pb-4 border-b border-slate-200 dark:border-slate-700 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{exp.title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{exp.company}</p>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-500">{exp.duration}</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">{exp.description}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <Card className="p-6 glass dark:glass-dark border-0">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Skills ({data.skills.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <Card className="p-6 glass dark:glass-dark border-0">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Education</h3>
          <div className="space-y-3">
            {data.education.map((edu, idx) => (
              <div key={idx} className="pb-3 border-b border-slate-200 dark:border-slate-700 last:border-0 last:pb-0">
                <p className="font-semibold text-slate-900 dark:text-white">{edu.degree}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{edu.school}</p>
                <p className="text-xs text-slate-500 dark:text-slate-500">{edu.year}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
