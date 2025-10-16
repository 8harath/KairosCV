"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, ArrowRight } from "lucide-react"

interface JobDetailsFormProps {
  onSubmit: (details: JobDetails) => void
  isLoading?: boolean
}

export interface JobDetails {
  jobTitle: string
  company: string
  jobDescription: string
  keyRequirements: string
  targetSkills: string
}

export default function JobDetailsForm({ onSubmit, isLoading = false }: JobDetailsFormProps) {
  const [formData, setFormData] = useState<JobDetails>({
    jobTitle: "",
    company: "",
    jobDescription: "",
    keyRequirements: "",
    targetSkills: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.jobTitle && formData.company && formData.jobDescription) {
      onSubmit(formData)
    }
  }

  const isFormValid = formData.jobTitle && formData.company && formData.jobDescription

  return (
    <Card className="p-8 glass dark:glass-dark border-0">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <Target className="w-6 h-6" />
          Tailor Your Resume
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          Tell us about the job you're applying for so we can optimize your resume
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            placeholder="e.g., Senior Software Engineer"
            className="w-full px-4 py-3 rounded-lg glass dark:glass-dark text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
            required
          />
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
            Company <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g., Google, Microsoft, Startup Inc."
            className="w-full px-4 py-3 rounded-lg glass dark:glass-dark text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
            required
          />
        </div>

        {/* Job Description */}
        <div>
          <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
            Job Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            placeholder="Paste the full job description here..."
            rows={6}
            className="w-full px-4 py-3 rounded-lg glass dark:glass-dark text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white resize-none"
            required
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            The more details you provide, the better we can tailor your resume
          </p>
        </div>

        {/* Key Requirements */}
        <div>
          <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
            Key Requirements (Optional)
          </label>
          <textarea
            name="keyRequirements"
            value={formData.keyRequirements}
            onChange={handleChange}
            placeholder="e.g., 5+ years experience, React, Node.js, AWS..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg glass dark:glass-dark text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white resize-none"
          />
        </div>

        {/* Target Skills */}
        <div>
          <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
            Target Skills (Optional)
          </label>
          <input
            type="text"
            name="targetSkills"
            value={formData.targetSkills}
            onChange={handleChange}
            placeholder="e.g., React, TypeScript, AWS, Docker (comma-separated)"
            className="w-full px-4 py-3 rounded-lg glass dark:glass-dark text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="w-full px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin">⏳</span>
              Generating Tailored Resume...
            </>
          ) : (
            <>
              Generate Tailored Resume
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          <span className="font-semibold">💡 Pro Tip:</span> The more specific you are about the job requirements, the
          better we can tailor your resume to match the role and increase your chances of getting past ATS systems.
        </p>
      </div>
    </Card>
  )
}
