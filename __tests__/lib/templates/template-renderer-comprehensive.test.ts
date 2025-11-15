import { describe, it, expect } from "vitest"
import {
  renderJakesResume,
} from "../../../lib/templates/template-renderer"
import type { ParsedResume } from "../../../lib/parsers/enhanced-parser"

describe("Template Renderer - Type Safety", () => {
  const mockResumeComplete: ParsedResume = {
    contact: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+15551234567",
      linkedin: "linkedin.com/in/johndoe",
      github: "github.com/johndoe",
      website: "johndoe.com",
      location: "San Francisco, CA"
    },
    summary: "Experienced software engineer with 5 years of expertise",
    experience: [
      {
        company: "Google",
        title: "Senior Software Engineer",
        startDate: "Jan 2020",
        endDate: "Present",
        location: "Mountain View, CA",
        bullets: ["Developed scalable microservices", "Led team of 5 engineers"]
      }
    ],
    education: [
      {
        institution: "MIT",
        degree: "Bachelor of Science",
        field: "Computer Science",
        startDate: "Sep 2014",
        endDate: "Jun 2018",
        location: "Cambridge, MA",
        gpa: "3.8"
      }
    ],
    skills: {
      languages: ["JavaScript", "Python", "Go"],
      frameworks: ["React", "Node.js", "Django"],
      tools: ["Git", "Docker", "Kubernetes"],
      databases: ["PostgreSQL", "MongoDB"]
    },
    projects: [
      {
        name: "E-commerce Platform",
        description: "Full-stack web application",
        technologies: ["React", "Node.js", "PostgreSQL"],
        bullets: ["Built RESTful API", "Implemented payment processing"],
        startDate: "Jan 2021",
        endDate: "Dec 2021",
        link: "example.com/project",
        github: "github.com/user/project"
      }
    ],
    certifications: ["AWS Certified Solutions Architect", "Google Cloud Professional"]
  }

  describe("HTML Generation - Null Safety", () => {
    it("should handle undefined contact fields", () => {
      const resume: ParsedResume = {
        contact: {
          name: "John Doe",
          email: "john@example.com",
          phone: "",
          linkedin: "",
          github: "",
          website: "",
          location: ""
        },
        experience: [],
        education: [],
        skills: { languages: [], frameworks: [], tools: [], databases: [] },
        projects: [],
        certifications: []
      }

      const html = renderJakesResume(resume)
      expect(html).toContain("John Doe")
      expect(html).toContain("john@example.com")
      expect(html).not.toContain("undefined")
      expect(html).not.toContain("null")
    })

    it("should handle null/undefined bullets array", () => {
      const resume: ParsedResume = {
        contact: { name: "Test" },
        experience: [
          {
            company: "Company",
            title: "Title",
            startDate: "2020",
            endDate: "2021",
            location: "Location",
            bullets: null as any // Simulate malformed data
          }
        ],
        education: [],
        skills: { languages: [], frameworks: [], tools: [], databases: [] },
        projects: [],
        certifications: []
      }

      expect(() => renderJakesResume(resume)).not.toThrow()
    })

    it("should handle non-string bullets", () => {
      const resume: ParsedResume = {
        contact: { name: "Test" },
        experience: [
          {
            company: "Company",
            title: "Title",
            startDate: "2020",
            endDate: "2021",
            location: "Location",
            bullets: [123, null, undefined, "Valid bullet"] as any
          }
        ],
        education: [],
        skills: { languages: [], frameworks: [], tools: [], databases: [] },
        projects: [],
        certifications: []
      }

      const html = renderJakesResume(resume)
      expect(html).toContain("Valid bullet")
      expect(html).not.toContain("123")
      expect(html).not.toContain("null")
      expect(html).not.toContain("undefined")
    })

    it("should handle undefined skills object", () => {
      const resume: ParsedResume = {
        contact: { name: "Test" },
        experience: [],
        education: [],
        skills: undefined as any,
        projects: [],
        certifications: []
      }

      expect(() => renderJakesResume(resume)).not.toThrow()
    })

    it("should handle null arrays in skills", () => {
      const resume: ParsedResume = {
        contact: { name: "Test" },
        experience: [],
        education: [],
        skills: {
          languages: null as any,
          frameworks: undefined as any,
          tools: ["Git"],
          databases: []
        },
        projects: [],
        certifications: []
      }

      expect(() => renderJakesResume(resume)).not.toThrow()
      const html = renderJakesResume(resume)
      expect(html).toContain("Git")
    })

    it("should handle missing project fields", () => {
      const resume: ParsedResume = {
        contact: { name: "Test" },
        experience: [],
        education: [],
        skills: { languages: [], frameworks: [], tools: [], databases: [] },
        projects: [
          {
            name: "Project",
            bullets: ["Work done"],
            // Missing description, technologies, dates, links
          } as any
        ],
        certifications: []
      }

      const html = renderJakesResume(resume)
      expect(html).toContain("Project")
      expect(html).toContain("Work done")
      expect(html).not.toContain("undefined")
    })

    it("should handle empty education entry", () => {
      const resume: ParsedResume = {
        contact: { name: "Test" },
        experience: [],
        education: [
          null as any,
          {
            institution: "MIT",
            degree: "BS",
            field: "CS",
            startDate: "2014",
            endDate: "2018"
          }
        ],
        skills: { languages: [], frameworks: [], tools: [], databases: [] },
        projects: [],
        certifications: []
      }

      expect(() => renderJakesResume(resume)).not.toThrow()
      const html = renderJakesResume(resume)
      expect(html).toContain("MIT")
    })

    it("should handle certifications as mixed types", () => {
      const resume: ParsedResume = {
        contact: { name: "Test" },
        experience: [],
        education: [],
        skills: { languages: [], frameworks: [], tools: [], databases: [] },
        projects: [],
        certifications: ["AWS Cert", 123, null, undefined, "GCP Cert"] as any
      }

      const html = renderJakesResume(resume)
      expect(html).toContain("AWS Cert")
      expect(html).toContain("GCP Cert")
      expect(html).not.toContain("123")
    })
  })

  describe("HTML Escaping", () => {
    it("should escape HTML special characters in text", () => {
      const resume: ParsedResume = {
        contact: {
          name: "John <script>alert('xss')</script> Doe"
        },
        experience: [],
        education: [],
        skills: { languages: [], frameworks: [], tools: [], databases: [] },
        projects: [],
        certifications: []
      }

      const html = renderJakesResume(resume)
      expect(html).toContain("&lt;script&gt;")
      expect(html).not.toContain("<script>alert")
    })

    it("should escape ampersands", () => {
      const resume: ParsedResume = {
        contact: { name: "Test" },
        experience: [
          {
            company: "R&D Company",
            title: "Engineer",
            startDate: "2020",
            endDate: "2021",
            location: "CA",
            bullets: ["Research & Development"]
          }
        ],
        education: [],
        skills: { languages: [], frameworks: [], tools: [], databases: [] },
        projects: [],
        certifications: []
      }

      const html = renderJakesResume(resume)
      expect(html).toContain("&amp;")
    })

    it("should escape quotes", () => {
      const resume: ParsedResume = {
        contact: { name: "Test" },
        experience: [
          {
            company: 'Company "Best Corp"',
            title: "Engineer",
            startDate: "2020",
            endDate: "2021",
            location: "CA",
            bullets: ['Worked on "Project Alpha"']
          }
        ],
        education: [],
        skills: { languages: [], frameworks: [], tools: [], databases: [] },
        projects: [],
        certifications: []
      }

      const html = renderJakesResume(resume)
      expect(html).toContain("&quot;")
    })
  })

  describe("Complete Resume Rendering", () => {
    it("should render complete resume with all sections", () => {
      const html = renderJakesResume(mockResumeComplete, "Professional summary here")

      // Contact section
      expect(html).toContain("John Doe")
      expect(html).toContain("john@example.com")
      expect(html).toContain("linkedin.com/in/johndoe")

      // Summary
      expect(html).toContain("Professional summary here")

      // Experience
      expect(html).toContain("Google")
      expect(html).toContain("Senior Software Engineer")
      expect(html).toContain("Developed scalable microservices")

      // Education
      expect(html).toContain("MIT")
      expect(html).toContain("Bachelor of Science")
      expect(html).toContain("Computer Science")
      expect(html).toContain("3.8")

      // Skills
      expect(html).toContain("JavaScript")
      expect(html).toContain("React")
      expect(html).toContain("Docker")
      expect(html).toContain("PostgreSQL")

      // Projects
      expect(html).toContain("E-commerce Platform")
      expect(html).toContain("Built RESTful API")

      // Certifications
      expect(html).toContain("AWS Certified Solutions Architect")
    })

    it("should render minimal resume without crashing", () => {
      const minimal: ParsedResume = {
        contact: { name: "Minimal Person" },
        experience: [],
        education: [],
        skills: { languages: [], frameworks: [], tools: [], databases: [] },
        projects: [],
        certifications: []
      }

      const html = renderJakesResume(minimal)
      expect(html).toContain("Minimal Person")
      expect(html).toBeDefined()
      expect(html.length).toBeGreaterThan(100)
    })
  })

  describe("New Comprehensive Sections", () => {
    it("should render awards section", () => {
      const resume: ParsedResume = {
        ...mockResumeComplete,
        awards: [
          { name: "Employee of the Year", issuer: "Google", date: "2021", description: "Top performer" },
          { name: "Dean's List", issuer: "MIT" }
        ]
      }

      const html = renderJakesResume(resume)
      expect(html).toContain("Employee of the Year")
      expect(html).toContain("Dean's List")
    })

    it("should render publications section", () => {
      const resume: ParsedResume = {
        ...mockResumeComplete,
        publications: [
          {
            title: "Machine Learning in Production",
            authors: ["John Doe", "Jane Smith"],
            venue: "IEEE Conference",
            date: "2022"
          }
        ]
      }

      const html = renderJakesResume(resume)
      expect(html).toContain("Machine Learning in Production")
      expect(html).toContain("John Doe, Jane Smith")
    })

    it("should render language proficiency section", () => {
      const resume: ParsedResume = {
        ...mockResumeComplete,
        languageProficiency: [
          { language: "Spanish", proficiency: "Fluent", certification: "DELE C1" },
          { language: "French", proficiency: "Intermediate" }
        ]
      }

      const html = renderJakesResume(resume)
      expect(html).toContain("Spanish")
      expect(html).toContain("Fluent")
      expect(html).toContain("French")
    })

    it("should render volunteer section", () => {
      const resume: ParsedResume = {
        ...mockResumeComplete,
        volunteer: [
          {
            organization: "Code for Good",
            role: "Volunteer Developer",
            location: "San Francisco",
            startDate: "Jan 2021",
            endDate: "Present",
            bullets: ["Built nonprofit websites", "Mentored students"]
          }
        ]
      }

      const html = renderJakesResume(resume)
      expect(html).toContain("Code for Good")
      expect(html).toContain("Volunteer Developer")
      expect(html).toContain("Built nonprofit websites")
    })

    it("should render hobbies section", () => {
      const resume: ParsedResume = {
        ...mockResumeComplete,
        hobbies: [
          { name: "Photography", description: "Landscape and portrait" },
          { name: "Hiking" }
        ]
      }

      const html = renderJakesResume(resume)
      expect(html).toContain("Photography")
      expect(html).toContain("Landscape and portrait")
      expect(html).toContain("Hiking")
    })

    it("should render references section", () => {
      const resume: ParsedResume = {
        ...mockResumeComplete,
        references: ["Available upon request"]
      }

      const html = renderJakesResume(resume)
      expect(html).toContain("Available upon request")
    })

    it("should render custom sections", () => {
      const resume: ParsedResume = {
        ...mockResumeComplete,
        customSections: [
          {
            heading: "Patents",
            content: ["US Patent 123456 - Machine Learning System", "US Patent 789012 - Data Processing"]
          }
        ]
      }

      const html = renderJakesResume(resume)
      expect(html).toContain("Patents")
      expect(html).toContain("US Patent 123456")
    })

    it("should handle empty new sections gracefully", () => {
      const resume: ParsedResume = {
        ...mockResumeComplete,
        awards: [],
        publications: [],
        languageProficiency: [],
        volunteer: [],
        hobbies: [],
        references: [],
        customSections: []
      }

      expect(() => renderJakesResume(resume)).not.toThrow()
    })

    it("should filter out invalid entries in new sections", () => {
      const resume: ParsedResume = {
        ...mockResumeComplete,
        awards: [null, { name: "Valid Award" }, undefined] as any,
        hobbies: [{ name: null }, { name: "Valid Hobby" }] as any
      }

      const html = renderJakesResume(resume)
      expect(html).toContain("Valid Award")
      expect(html).toContain("Valid Hobby")
      expect(html).not.toContain("null")
      expect(html).not.toContain("undefined")
    })
  })

  describe("Date Formatting", () => {
    it("should display dates in right-aligned format", () => {
      const html = renderJakesResume(mockResumeComplete)

      // Check that dates are rendered
      expect(html).toContain("Jan 2020")
      expect(html).toContain("Present")
      expect(html).toContain("Sep 2014")
      expect(html).toContain("Jun 2018")

      // Check CSS classes for positioning
      expect(html).toContain('class="entry-date"')
    })

    it("should handle missing dates gracefully", () => {
      const resume: ParsedResume = {
        contact: { name: "Test" },
        experience: [
          {
            company: "Company",
            title: "Title",
            startDate: "",
            endDate: "",
            location: "Location",
            bullets: ["Work"]
          }
        ],
        education: [],
        skills: { languages: [], frameworks: [], tools: [], databases: [] },
        projects: [],
        certifications: []
      }

      const html = renderJakesResume(resume)
      expect(html).toContain("Company")
      expect(html).not.toContain("undefined – undefined")
    })
  })

  describe("Template Compression", () => {
    it("should use compressed spacing in CSS", () => {
      const html = renderJakesResume(mockResumeComplete)

      // Check for compressed font sizes
      expect(html).toContain("font-size: 9.5pt") // Body
      expect(html).toContain("font-size: 16pt") // Header

      // Check for compressed spacing
      expect(html).toContain("margin-bottom: 0.08in") // Header
      expect(html).toContain("margin-bottom: 0.06in") // Section

      // Check for compressed padding
      expect(html).toContain("padding: 0.35in 0.5in") // Body
    })
  })

  describe("Edge Cases - Robustness", () => {
    it("should handle resume with only contact info", () => {
      const resume: ParsedResume = {
        contact: {
          name: "John Doe",
          email: "john@example.com"
        },
        experience: [],
        education: [],
        skills: { languages: [], frameworks: [], tools: [], databases: [] },
        projects: [],
        certifications: []
      }

      const html = renderJakesResume(resume)
      expect(html).toContain("John Doe")
      expect(html.length).toBeGreaterThan(100)
    })

    it("should handle very long content", () => {
      const longBullet = "A".repeat(500)
      const resume: ParsedResume = {
        contact: { name: "Test" },
        experience: [
          {
            company: "Company",
            title: "Title",
            startDate: "2020",
            endDate: "2021",
            location: "Location",
            bullets: [longBullet]
          }
        ],
        education: [],
        skills: { languages: [], frameworks: [], tools: [], databases: [] },
        projects: [],
        certifications: []
      }

      expect(() => renderJakesResume(resume)).not.toThrow()
      const html = renderJakesResume(resume)
      expect(html).toContain("A".repeat(100))
    })

    it("should handle special unicode characters", () => {
      const resume: ParsedResume = {
        contact: {
          name: "José González",
          location: "São Paulo, Brazil"
        },
        experience: [],
        education: [],
        skills: {
          languages: ["日本語", "中文", "العربية"],
          frameworks: [],
          tools: [],
          databases: []
        },
        projects: [],
        certifications: []
      }

      const html = renderJakesResume(resume)
      expect(html).toContain("José González")
      expect(html).toContain("São Paulo")
      expect(html).toContain("日本語")
    })
  })
})
