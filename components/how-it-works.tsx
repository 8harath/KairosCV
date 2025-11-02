"use client"

import { Upload, Brain, Target, FileCheck, Download } from "lucide-react"

const steps = [
  {
    icon: Upload,
    title: "UPLOAD",
    subtitle: "Your Resume",
    description: "Drag & drop your PDF. Any format works—polished or rough draft.",
    number: "01"
  },
  {
    icon: Brain,
    title: "AI ANALYZES",
    subtitle: "Content",
    description: "Gemini-powered engine extracts experience, skills, and achievements.",
    number: "02"
  },
  {
    icon: Target,
    title: "TAILOR",
    subtitle: "To Role",
    description: "Add job details. AI rephrases content to match industry standards.",
    number: "03"
  },
  {
    icon: FileCheck,
    title: "FORMAT",
    subtitle: "Professionally",
    description: "LaTeX compilation ensures perfect spacing and typography.",
    number: "04"
  },
  {
    icon: Download,
    title: "DOWNLOAD",
    subtitle: "& Apply",
    description: "Get your ATS-friendly resume ready to submit immediately.",
    number: "05"
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-block neu-badge mb-6">
            <span>THE PROCESS</span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-black mb-6" style={{fontFamily: 'var(--font-space-grotesk)'}}>
            HOW IT <span className="relative inline-block">
              WORKS
              <span className="absolute -bottom-2 left-0 w-full h-3 bg-[#FFD700] -z-10"></span>
            </span>
          </h2>
          <p className="text-xl font-medium max-w-2xl mx-auto">
            Five simple steps. Zero manual formatting. 100% professional results.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-5 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isAccent = index === 2 // Highlight middle step

            return (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 -right-4 w-8 h-[3px] bg-black dark:bg-white z-0" />
                )}

                {/* Step Card */}
                <div className={`${isAccent ? 'neu-card bg-[#FFD700] border-black' : 'neu-card'} p-6 h-full flex flex-col relative`}
                     style={isAccent ? {boxShadow: '6px 6px 0px #000000'} : {}}>
                  {/* Number Badge */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-black dark:bg-white border-[3px] border-black dark:border-white flex items-center justify-center"
                       style={{boxShadow: '4px 4px 0px var(--border)'}}>
                    <span className="text-white dark:text-black font-black text-lg" style={{fontFamily: 'var(--font-space-grotesk)'}}>
                      {step.number}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="mb-6">
                    <div className={`w-16 h-16 ${isAccent ? 'bg-black' : 'bg-black dark:bg-white'} border-[3px] border-black dark:border-white flex items-center justify-center`}>
                      <Icon className={`w-8 h-8 ${isAccent ? 'text-white' : 'text-white dark:text-black'}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <h3 className="font-black text-2xl mb-1" style={{fontFamily: 'var(--font-space-grotesk)'}}>
                      {step.title}
                    </h3>
                    <p className="font-bold text-lg mb-3 opacity-70">
                      {step.subtitle}
                    </p>
                    <p className="text-sm font-medium leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg font-bold mb-4 uppercase tracking-wide">
            Ready to transform your resume?
          </p>
          <a href="/upload" className="neu-btn-accent text-lg inline-flex items-center gap-2">
            START NOW - IT'S FREE
          </a>
        </div>
      </div>
    </section>
  )
}
