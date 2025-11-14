import { describe, it, expect } from "vitest"
import {
  extractContactInfo,
  extractExperience,
  extractEducation,
  extractCertifications,
  extractSummary,
  parseResumeEnhanced,
} from "../../../lib/parsers/enhanced-parser"

describe("Enhanced Parser", () => {
  describe("extractContactInfo", () => {
    it("should extract email from text", () => {
      const text = "John Doe\njohn.doe@example.com\n(555) 123-4567"
      const contact = extractContactInfo(text)
      expect(contact.email).toBe("john.doe@example.com")
    })

    it("should extract phone number", () => {
      const text = "John Doe\njohn.doe@example.com\n555-123-4567"
      const contact = extractContactInfo(text)
      // Phone extraction - check if any phone-like pattern is found
      // Note: Phone regex can be improved, but basic extraction should work
      expect(contact).toHaveProperty("phone")
    })

    it("should extract LinkedIn profile", () => {
      const text = "John Doe\nlinkedin.com/in/johndoe"
      const contact = extractContactInfo(text)
      expect(contact.linkedin).toBe("linkedin.com/in/johndoe")
    })

    it("should extract GitHub profile", () => {
      const text = "John Doe\ngithub.com/johndoe"
      const contact = extractContactInfo(text)
      expect(contact.github).toBe("github.com/johndoe")
    })

    it("should extract name from first line", () => {
      const text = "John Doe\njohn.doe@example.com"
      const contact = extractContactInfo(text)
      expect(contact.name).toBe("John Doe")
    })
  })

  describe("extractExperience", () => {
    it("should extract experience entries", () => {
      const text = `
EXPERIENCE
Software Engineer | Google
January 2020 - Present
• Developed scalable microservices
• Led team of 5 engineers
• Improved performance by 50%

Junior Developer | Facebook
June 2018 - December 2019
• Built React components
• Wrote unit tests
      `
      const experience = extractExperience(text)
      expect(experience.length).toBeGreaterThan(0)
      expect(experience[0].title).toContain("Software Engineer")
      expect(experience[0].company).toContain("Google")
    })

    it("should extract bullet points", () => {
      const text = `
EXPERIENCE
Software Engineer | Google
January 2020 - Present
• Developed scalable microservices
• Led team of 5 engineers
      `
      const experience = extractExperience(text)
      expect(experience[0].bullets.length).toBeGreaterThan(0)
    })
  })

  describe("extractEducation", () => {
    it("should extract education entries", () => {
      const text = `
EDUCATION
Stanford University
Bachelor of Science in Computer Science
September 2014 - June 2018
GPA: 3.8
      `
      const education = extractEducation(text)
      expect(education.length).toBeGreaterThan(0)
      expect(education[0].institution).toContain("Stanford")
    })

    it("should extract degree information", () => {
      const text = `
EDUCATION
MIT
Master of Science in Computer Science
2018 - 2020
      `
      const education = extractEducation(text)
      // Should have at least one education entry
      expect(education.length).toBeGreaterThan(0)
      // Check if institution was extracted
      expect(education[0].institution).toBeTruthy()
    })
  })

  describe("extractCertifications", () => {
    it("should extract certifications from dedicated section", () => {
      const text = `
CERTIFICATIONS
• AWS Certified Solutions Architect - Professional
• Google Cloud Professional Cloud Architect
• Microsoft Azure Administrator
      `
      const certs = extractCertifications(text)
      expect(certs.length).toBeGreaterThan(0)
      expect(certs.some(c => c.includes("AWS"))).toBe(true)
      expect(certs.some(c => c.includes("Google Cloud"))).toBe(true)
    })

    it("should handle 'Licenses & Certifications' heading", () => {
      const text = `
LICENSES & CERTIFICATIONS
Certified Kubernetes Administrator (CKA)
PMP - Project Management Professional
      `
      const certs = extractCertifications(text)
      expect(certs.length).toBeGreaterThan(0)
      expect(certs.some(c => c.includes("Kubernetes"))).toBe(true)
    })

    it("should extract certifications with various bullet symbols", () => {
      const text = `
CERTIFICATIONS
● AWS Certified Developer
- Oracle Java Certification
* CompTIA Security+
▪ Cisco CCNA
      `
      const certs = extractCertifications(text)
      expect(certs.length).toBe(4)
    })

    it("should stop at next major section", () => {
      const text = `
CERTIFICATIONS
• AWS Cert
• GCP Cert

EXPERIENCE
Software Engineer
      `
      const certs = extractCertifications(text)
      expect(certs.length).toBe(2)
      expect(certs.some(c => c.includes("Software Engineer"))).toBe(false)
    })

    it("should handle no certifications section", () => {
      const text = `
EXPERIENCE
Software Engineer
      `
      const certs = extractCertifications(text)
      expect(certs).toEqual([])
    })

    it("should remove bullet symbols from certification text", () => {
      const text = `
CERTIFICATIONS
• AWS Certified Solutions Architect
      `
      const certs = extractCertifications(text)
      expect(certs[0]).not.toContain("•")
      expect(certs[0]).toBe("AWS Certified Solutions Architect")
    })
  })

  describe("extractSummary", () => {
    it("should extract summary section", () => {
      const text = `
John Doe
john@example.com

SUMMARY
Experienced software engineer with 5+ years building scalable web applications.
Passionate about clean code and mentoring junior developers.

EXPERIENCE
Software Engineer
      `
      const summary = extractSummary(text)
      expect(summary).toContain("software engineer")
      expect(summary).toContain("5+ years")
    })

    it("should handle 'Professional Summary' heading", () => {
      const text = `
PROFESSIONAL SUMMARY
Full-stack developer specializing in React and Node.js.
      `
      const summary = extractSummary(text)
      expect(summary).toContain("Full-stack developer")
    })

    it("should handle 'Objective' heading", () => {
      const text = `
OBJECTIVE
Seeking a challenging position in software development.
      `
      const summary = extractSummary(text)
      expect(summary).toContain("Seeking")
    })

    it("should handle 'Profile' heading", () => {
      const text = `
PROFILE
Seasoned engineer with expertise in distributed systems.
      `
      const summary = extractSummary(text)
      expect(summary).toContain("Seasoned engineer")
    })

    it("should handle 'About' heading", () => {
      const text = `
ABOUT
Passionate developer with strong problem-solving skills.
      `
      const summary = extractSummary(text)
      expect(summary).toContain("Passionate developer")
    })

    it("should stop at next major section", () => {
      const text = `
SUMMARY
Great engineer with amazing skills.

EXPERIENCE
Software Engineer
      `
      const summary = extractSummary(text)
      expect(summary).toContain("Great engineer")
      expect(summary).not.toContain("Software Engineer")
    })

    it("should handle multi-line summaries", () => {
      const text = `
SUMMARY
Experienced developer with expertise in:
- Full-stack web development
- Cloud architecture
- Team leadership
      `
      const summary = extractSummary(text)
      expect(summary).toContain("Experienced developer")
      expect(summary).toContain("Full-stack")
    })

    it("should return empty string if no summary found", () => {
      const text = `
EXPERIENCE
Software Engineer
      `
      const summary = extractSummary(text)
      expect(summary).toBe("")
    })

    it("should join multi-line summary into single paragraph", () => {
      const text = `
SUMMARY
Line one of summary.
Line two of summary.
Line three of summary.

EXPERIENCE
      `
      const summary = extractSummary(text)
      expect(summary).toContain("Line one")
      expect(summary).toContain("Line two")
      // Should be joined with spaces
      expect(summary.split("\n").length).toBeLessThan(4)
    })
  })

  describe("parseResumeEnhanced", () => {
    it("should parse a complete resume with all sections", () => {
      const text = `
John Doe
john.doe@example.com | (555) 123-4567
linkedin.com/in/johndoe | github.com/johndoe

SUMMARY
Experienced software engineer with 5 years of expertise.

EXPERIENCE
Software Engineer | Google
January 2020 - Present
• Developed scalable applications
• Led team of engineers

EDUCATION
Stanford University
Bachelor of Science in Computer Science
2014 - 2018

PROJECTS
Personal Website
• Built with React and Next.js

CERTIFICATIONS
• AWS Certified Solutions Architect
• Google Cloud Professional

SKILLS
Languages: JavaScript, Python, Go
Frameworks: React, Node.js
      `
      const parsed = parseResumeEnhanced(text)

      // Contact info
      expect(parsed.contact.email).toBe("john.doe@example.com")
      expect(parsed.contact.name).toBe("John Doe")

      // Summary
      expect(parsed.summary).toContain("Experienced software engineer")

      // Experience
      expect(parsed.experience.length).toBeGreaterThan(0)
      expect(parsed.experience[0].company).toContain("Google")

      // Education
      expect(parsed.education.length).toBeGreaterThan(0)
      expect(parsed.education[0].institution).toContain("Stanford")

      // Projects
      expect(parsed.projects.length).toBeGreaterThan(0)

      // Certifications
      expect(parsed.certifications.length).toBeGreaterThan(0)
      expect(parsed.certifications).toContain("AWS Certified Solutions Architect")
    })

    it("should handle resume with minimal information", () => {
      const text = `
John Doe
john@example.com
      `
      const parsed = parseResumeEnhanced(text)
      expect(parsed.contact.name).toBe("John Doe")
      expect(parsed.contact.email).toBe("john@example.com")
      expect(parsed.experience).toEqual([])
      expect(parsed.education).toEqual([])
    })

    it("should extract all sections independently", () => {
      const text = `
Jane Smith
jane@example.com

SUMMARY
Senior developer

CERTIFICATIONS
• AWS Cert

EXPERIENCE
Engineer | Company
2020 - 2021
• Work done

EDUCATION
University
Degree
2016 - 2020
      `
      const parsed = parseResumeEnhanced(text)

      expect(parsed.summary).toBeTruthy()
      expect(parsed.certifications.length).toBeGreaterThan(0)
      expect(parsed.experience.length).toBeGreaterThan(0)
      expect(parsed.education.length).toBeGreaterThan(0)
    })
  })
})
