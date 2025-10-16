"use client"

import { Upload, Brain, Target, FileCheck, Download } from "lucide-react"

const steps = [
  {
    icon: Upload,
    title: "Upload Your Resume",
    description: "Simply drag and drop your PDF or click to browse. We accept any format—well-designed or rough draft.",
  },
  {
    icon: Brain,
    title: "AI Analyzes Your Content",
    description: "Our Gemini-powered engine extracts your experience, skills, and achievements with precision.",
  },
  {
    icon: Target,
    title: "Tailor to Your Target Role",
    description: "Provide job details and description. Our AI rephrases your content to match industry expectations.",
  },
  {
    icon: FileCheck,
    title: "Professional Formatting",
    description:
      "LaTeX compilation ensures pixel-perfect spacing, typography, and structure—no manual formatting needed.",
  },
  {
    icon: Download,
    title: "Download & Apply",
    description: "Get your polished, ATS-friendly resume ready to submit immediately.",
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-white dark:bg-slate-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">How It Works</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">Five simple steps to transform your resume</p>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative">
                <div className="glass dark:glass-dark p-6 rounded-2xl h-full flex flex-col items-center text-center hover:shadow-xl transition-all duration-300">
                  <div className="w-14 h-14 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-white dark:text-slate-900" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-slate-300 to-transparent dark:from-slate-600" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
