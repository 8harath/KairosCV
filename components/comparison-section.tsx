"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ResumeComparison from "./resume-comparison"
import DownloadOptions from "./download-options"
import { Eye, Download, ArrowLeft } from "lucide-react"

interface ComparisonSectionProps {
  onStepChange: (step: "hero" | "upload" | "processing" | "preview" | "comparison") => void
}

export default function ComparisonSection({ onStepChange }: ComparisonSectionProps) {
  const [activeTab, setActiveTab] = useState("comparison")

  // Mock data for comparison
  const originalResume = {
    title: "Original Resume",
    content: `JOHN SMITH
john.smith@email.com | (555) 123-4567

PROFESSIONAL SUMMARY
Experienced developer with 5+ years of experience in web development.

EXPERIENCE
Senior Software Engineer - Tech Corp (2021 - Present)
- Worked on various projects
- Improved performance
- Mentored team members

Full Stack Developer - StartUp Inc (2019 - 2021)
- Built applications
- Fixed bugs
- Worked with databases

SKILLS
React, Node.js, JavaScript, CSS, HTML, SQL, Git

EDUCATION
B.S. Computer Science - State University (2019)`,
    highlights: ["Contact Info", "Experience", "Skills", "Education"],
  }

  const tailoredResume = {
    title: "Tailored Resume",
    content: `JOHN SMITH
john.smith@email.com | (555) 123-4567 | linkedin.com/in/johnsmith

PROFESSIONAL SUMMARY
Results-driven Full Stack Engineer with 5+ years of proven expertise building scalable web applications using React, Node.js, and cloud technologies. Demonstrated track record of delivering high-impact solutions and mentoring engineering teams.

EXPERIENCE
Senior Software Engineer - Tech Corp (2021 - Present)
- Architected and led development of microservices platform serving 1M+ users, reducing latency by 40%
- Mentored 5+ junior developers, establishing best practices for code quality and system design
- Implemented CI/CD pipelines using Docker and Kubernetes, improving deployment frequency by 60%

Full Stack Developer - StartUp Inc (2019 - 2021)
- Developed and maintained React applications with Node.js backends, serving 100K+ active users
- Optimized database queries and implemented caching strategies, improving application performance by 40%
- Collaborated with product team to deliver 15+ features, maintaining 99.9% uptime

TECHNICAL SKILLS
Frontend: React, TypeScript, CSS, HTML5, Redux
Backend: Node.js, Express, GraphQL, REST APIs
Databases: PostgreSQL, MongoDB, Redis
Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD
Tools: Git, GitHub, Jira, VS Code

EDUCATION
B.S. Computer Science - State University (2019)
Relevant Coursework: Data Structures, Algorithms, Database Design, Software Engineering`,
    highlights: [
      "Quantified achievements",
      "Technical keywords",
      "Action verbs",
      "ATS optimized",
      "Role-specific skills",
    ],
  }

  const handleDownload = (format: "pdf" | "docx" | "txt") => {
    console.log(`Downloading resume as ${format}`)
    // In a real app, this would trigger actual download
  }

  return (
    <section className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Your Tailored Resume</h1>
          <p className="text-slate-600 dark:text-slate-300">See how we've optimized your resume for your target role</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Side-by-Side Comparison
            </TabsTrigger>
            <TabsTrigger value="download" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download
            </TabsTrigger>
          </TabsList>

          <TabsContent value="comparison" className="space-y-6">
            <ResumeComparison original={originalResume} tailored={tailoredResume} />

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <h3 className="font-semibold text-green-900 dark:text-green-300 mb-3">Key Improvements Made:</h3>
              <ul className="space-y-2 text-sm text-green-800 dark:text-green-400">
                <li>✓ Added quantifiable metrics and impact numbers to all achievements</li>
                <li>✓ Incorporated target role keywords (React, Node.js, AWS, Docker, Kubernetes)</li>
                <li>✓ Restructured experience descriptions with strong action verbs</li>
                <li>✓ Added dedicated technical skills section for ATS optimization</li>
                <li>✓ Enhanced professional summary to highlight relevant expertise</li>
                <li>✓ Improved formatting for better readability and ATS compatibility</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => onStepChange("preview")}
                className="flex-1 px-6 py-3 glass dark:glass-dark text-slate-900 dark:text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Details
              </button>
              <button
                onClick={() => setActiveTab("download")}
                className="flex-1 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Resume
              </button>
            </div>
          </TabsContent>

          <TabsContent value="download">
            <DownloadOptions
              resumeContent={tailoredResume.content}
              fileName="tailored-resume"
              onDownload={handleDownload}
            />

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setActiveTab("comparison")}
                className="flex-1 px-6 py-3 glass dark:glass-dark text-slate-900 dark:text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                Back to Comparison
              </button>
              <button
                onClick={() => onStepChange("hero")}
                className="flex-1 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                Process Another Resume
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
