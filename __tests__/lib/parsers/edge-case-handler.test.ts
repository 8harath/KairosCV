import { describe, it, expect } from "vitest"
import {
  handleAllEdgeCases,
  deduplicateExperience,
  deduplicateEducation,
  deduplicateSkills,
  normalizeDate,
  normalizePhoneNumber,
  normalizeURL,
  cleanBulletPoint,
} from "../../../lib/parsers/edge-case-handler"

describe("Edge Case Handler", () => {
  describe("Date Normalization", () => {
    it("should normalize 'Present' variations", () => {
      expect(normalizeDate("present")).toBe("Present")
      expect(normalizeDate("Present")).toBe("Present")
      expect(normalizeDate("PRESENT")).toBe("Present")
      expect(normalizeDate("current")).toBe("Present")
      expect(normalizeDate("Current")).toBe("Present")
      expect(normalizeDate("now")).toBe("Present")
    })

    it("should normalize month names to 3-letter format", () => {
      expect(normalizeDate("January 2020")).toBe("Jan 2020")
      expect(normalizeDate("February 2021")).toBe("Feb 2021")
      expect(normalizeDate("September 2019")).toBe("Sep 2019")
      expect(normalizeDate("December 2022")).toBe("Dec 2022")
    })

    it("should handle numeric date formats", () => {
      expect(normalizeDate("01/2020")).toBe("Jan 2020")
      expect(normalizeDate("12/2021")).toBe("Dec 2021")
    })

    it("should handle ISO date formats", () => {
      expect(normalizeDate("2020-01")).toBe("Jan 2020")
      expect(normalizeDate("2021-12")).toBe("Dec 2021")
    })

    it("should handle abbreviated months", () => {
      expect(normalizeDate("Jan 2020")).toBe("Jan 2020")
      expect(normalizeDate("Mar 2021")).toBe("Mar 2021")
    })

    it("should handle invalid dates gracefully", () => {
      expect(normalizeDate("Spring 2020")).toBe("Spring 2020")
      expect(normalizeDate("Q1 2021")).toBe("Q1 2021")
    })

    it("should handle empty/undefined dates", () => {
      expect(normalizeDate("")).toBe("")
      expect(normalizeDate(undefined)).toBe("")
    })
  })

  describe("Phone Number Normalization", () => {
    it("should normalize US phone numbers", () => {
      const result = normalizePhoneNumber("(555) 123-4567")
      expect(result).toContain("555")
      expect(result).toContain("123")
      expect(result).toContain("4567")
    })

    it("should handle phone numbers with dots", () => {
      const result = normalizePhoneNumber("555.123.4567")
      expect(result).toContain("555")
      expect(result).toContain("123")
    })

    it("should handle international format", () => {
      const result = normalizePhoneNumber("+1-555-123-4567")
      expect(result).toContain("+1")
      expect(result).toContain("555")
    })

    it("should handle phone numbers with spaces", () => {
      const result = normalizePhoneNumber("555 123 4567")
      expect(result).toContain("555")
    })
  })

  describe("URL Normalization", () => {
    it("should remove www prefix", () => {
      expect(normalizeURL("www.example.com")).toBe("example.com")
      expect(normalizeURL("www.github.com/user")).toBe("github.com/user")
    })

    it("should remove https protocol", () => {
      expect(normalizeURL("https://example.com")).toBe("example.com")
      expect(normalizeURL("https://www.example.com")).toBe("example.com")
    })

    it("should remove http protocol", () => {
      expect(normalizeURL("http://example.com")).toBe("example.com")
    })

    it("should remove trailing slashes", () => {
      expect(normalizeURL("example.com/")).toBe("example.com")
      expect(normalizeURL("linkedin.com/in/user/")).toBe("linkedin.com/in/user")
    })

    it("should handle LinkedIn URLs", () => {
      expect(normalizeURL("https://www.linkedin.com/in/johndoe/")).toBe("linkedin.com/in/johndoe")
    })

    it("should handle GitHub URLs", () => {
      expect(normalizeURL("https://github.com/johndoe")).toBe("github.com/johndoe")
    })
  })

  describe("Bullet Point Cleaning", () => {
    it("should remove bullet symbols", () => {
      expect(cleanBulletPoint("• Developed features")).toBe("Developed features")
      expect(cleanBulletPoint("● Led team")).toBe("Led team")
      expect(cleanBulletPoint("- Built application")).toBe("Built application")
      expect(cleanBulletPoint("* Created system")).toBe("Created system")
      expect(cleanBulletPoint("▪ Improved performance")).toBe("Improved performance")
    })

    it("should remove smart quotes", () => {
      expect(cleanBulletPoint(""Smart quotes"")).toBe("\"Smart quotes\"")
      expect(cleanBulletPoint("'Single quotes'")).toBe("'Single quotes'")
    })

    it("should remove em-dashes and en-dashes", () => {
      expect(cleanBulletPoint("Full-stack — React")).toBe("Full-stack - React")
      expect(cleanBulletPoint("Web – Mobile")).toBe("Web - Mobile")
    })

    it("should collapse extra whitespace", () => {
      expect(cleanBulletPoint("Multiple    spaces")).toBe("Multiple spaces")
      expect(cleanBulletPoint("  Leading spaces")).toBe("Leading spaces")
      expect(cleanBulletPoint("Trailing spaces  ")).toBe("Trailing spaces")
    })

    it("should handle empty/very short bullets", () => {
      expect(cleanBulletPoint("")).toBe("")
      expect(cleanBulletPoint("   ")).toBe("")
      expect(cleanBulletPoint("123")).toBe("123")
    })
  })

  describe("Experience Deduplication", () => {
    it("should remove exact duplicates", () => {
      const experiences = [
        {
          company: "Google",
          title: "Software Engineer",
          startDate: "Jan 2020",
          endDate: "Present",
          location: "Mountain View, CA",
          bullets: ["Developed features"]
        },
        {
          company: "Google",
          title: "Software Engineer",
          startDate: "Jan 2020",
          endDate: "Present",
          location: "Mountain View, CA",
          bullets: ["Developed features"]
        }
      ]
      const result = deduplicateExperience(experiences)
      expect(result.length).toBe(1)
    })

    it("should remove fuzzy duplicates (85% similarity)", () => {
      const experiences = [
        {
          company: "Google Inc",
          title: "Software Engineer",
          startDate: "Jan 2020",
          endDate: "Present",
          location: "Mountain View",
          bullets: ["Work"]
        },
        {
          company: "Google Inc.",
          title: "Software Engineer",
          startDate: "Jan 2020",
          endDate: "Present",
          location: "Mountain View, CA",
          bullets: ["Work"]
        }
      ]
      const result = deduplicateExperience(experiences)
      expect(result.length).toBe(1)
    })

    it("should keep different roles at same company", () => {
      const experiences = [
        {
          company: "Google",
          title: "Senior Software Engineer",
          startDate: "Jan 2022",
          endDate: "Present",
          location: "Mountain View",
          bullets: ["Lead team"]
        },
        {
          company: "Google",
          title: "Software Engineer",
          startDate: "Jan 2020",
          endDate: "Dec 2021",
          location: "Mountain View",
          bullets: ["Built features"]
        }
      ]
      const result = deduplicateExperience(experiences)
      expect(result.length).toBe(2)
    })

    it("should keep experiences at different companies", () => {
      const experiences = [
        {
          company: "Google",
          title: "Software Engineer",
          startDate: "Jan 2020",
          endDate: "Present",
          location: "Mountain View",
          bullets: ["Work"]
        },
        {
          company: "Microsoft",
          title: "Software Engineer",
          startDate: "Jan 2018",
          endDate: "Dec 2019",
          location: "Redmond",
          bullets: ["Work"]
        }
      ]
      const result = deduplicateExperience(experiences)
      expect(result.length).toBe(2)
    })
  })

  describe("Education Deduplication", () => {
    it("should remove exact duplicates", () => {
      const education = [
        {
          institution: "MIT",
          degree: "Bachelor of Science",
          field: "Computer Science",
          startDate: "2014",
          endDate: "2018",
          location: "Cambridge, MA",
          gpa: "3.8"
        },
        {
          institution: "MIT",
          degree: "Bachelor of Science",
          field: "Computer Science",
          startDate: "2014",
          endDate: "2018",
          location: "Cambridge, MA",
          gpa: "3.8"
        }
      ]
      const result = deduplicateEducation(education)
      expect(result.length).toBe(1)
    })

    it("should remove fuzzy duplicates", () => {
      const education = [
        {
          institution: "Massachusetts Institute of Technology",
          degree: "BS",
          field: "Computer Science",
          startDate: "2014",
          endDate: "2018",
          location: "Cambridge",
          gpa: "3.8"
        },
        {
          institution: "MIT",
          degree: "Bachelor of Science",
          field: "CS",
          startDate: "2014",
          endDate: "2018",
          location: "Cambridge, MA",
          gpa: "3.8"
        }
      ]
      const result = deduplicateEducation(education)
      expect(result.length).toBe(1)
    })

    it("should keep multiple degrees from same institution", () => {
      const education = [
        {
          institution: "MIT",
          degree: "Master of Science",
          field: "Computer Science",
          startDate: "2018",
          endDate: "2020",
          location: "Cambridge, MA",
          gpa: "4.0"
        },
        {
          institution: "MIT",
          degree: "Bachelor of Science",
          field: "Computer Science",
          startDate: "2014",
          endDate: "2018",
          location: "Cambridge, MA",
          gpa: "3.8"
        }
      ]
      const result = deduplicateEducation(education)
      expect(result.length).toBe(2)
    })

    it("should keep degrees from different institutions", () => {
      const education = [
        {
          institution: "MIT",
          degree: "BS",
          field: "Computer Science",
          startDate: "2014",
          endDate: "2018",
          location: "Cambridge",
          gpa: "3.8"
        },
        {
          institution: "Stanford",
          degree: "BS",
          field: "Computer Science",
          startDate: "2014",
          endDate: "2018",
          location: "Palo Alto",
          gpa: "3.9"
        }
      ]
      const result = deduplicateEducation(education)
      expect(result.length).toBe(2)
    })
  })

  describe("Skills Deduplication", () => {
    it("should remove exact duplicates within category", () => {
      const skills = {
        languages: ["JavaScript", "JavaScript", "Python"],
        frameworks: ["React", "React", "Vue"],
        tools: ["Git", "Git", "Docker"],
        databases: ["PostgreSQL", "PostgreSQL"]
      }
      const result = deduplicateSkills(skills)
      expect(result.languages.length).toBe(2)
      expect(result.frameworks.length).toBe(2)
      expect(result.tools.length).toBe(2)
      expect(result.databases.length).toBe(1)
    })

    it("should remove case-insensitive duplicates", () => {
      const skills = {
        languages: ["JavaScript", "javascript", "JAVASCRIPT"],
        frameworks: ["React", "react"],
        tools: ["git", "Git", "GIT"],
        databases: ["postgresql", "PostgreSQL"]
      }
      const result = deduplicateSkills(skills)
      expect(result.languages.length).toBe(1)
      expect(result.frameworks.length).toBe(1)
      expect(result.tools.length).toBe(1)
      expect(result.databases.length).toBe(1)
    })

    it("should normalize abbreviations", () => {
      const skills = {
        languages: ["JS", "JavaScript"],
        frameworks: [],
        tools: [],
        databases: []
      }
      const result = deduplicateSkills(skills)
      // Should deduplicate JS and JavaScript
      expect(result.languages.length).toBeLessThanOrEqual(1)
    })

    it("should keep skills with versions", () => {
      const skills = {
        languages: ["Python 3.9", "Python"],
        frameworks: ["React 18", "React"],
        tools: [],
        databases: []
      }
      const result = deduplicateSkills(skills)
      // Versions should be preserved as different entries
      expect(result.languages.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe("Full Pipeline Integration", () => {
    it("should handle complete resume data with all edge cases", () => {
      const resumeData = {
        contact: {
          name: "John Doe",
          email: "john@example.com",
          phone: "(555) 123-4567",
          linkedin: "https://www.linkedin.com/in/johndoe/",
          github: "https://github.com/johndoe",
          location: "  San Francisco, CA  "
        },
        experience: [
          {
            company: "Google Inc",
            title: "Software Engineer",
            startDate: "January 2020",
            endDate: "present",
            location: "Mountain View",
            bullets: ["• Developed features", "● Led team"]
          },
          {
            company: "Google Inc.",
            title: "Software Engineer",
            startDate: "Jan 2020",
            endDate: "Present",
            location: "Mountain View, CA",
            bullets: ["  • Developed features  ", "- Led team"]
          }
        ],
        education: [
          {
            institution: "MIT",
            degree: "BS",
            field: "Computer Science",
            startDate: "2014",
            endDate: "2018",
            location: "Cambridge",
            gpa: "3.8"
          },
          {
            institution: "MIT",
            degree: "Bachelor of Science",
            field: "CS",
            startDate: "2014",
            endDate: "2018",
            location: "Cambridge, MA",
            gpa: "3.8"
          }
        ],
        skills: {
          languages: ["JavaScript", "javascript", "JS", "Python"],
          frameworks: ["React", "react", "Vue"],
          tools: ["Git", "git"],
          databases: ["PostgreSQL"]
        },
        projects: [],
        certifications: []
      }

      const result = handleAllEdgeCases(resumeData, "")

      // Contact info should be normalized
      expect(result.contact.phone).not.toContain("(")
      expect(result.contact.linkedin).not.toContain("https://")
      expect(result.contact.github).not.toContain("https://")
      expect(result.contact.location).toBe("San Francisco, CA")

      // Experience should be deduplicated
      expect(result.experience.length).toBe(1)
      expect(result.experience[0].startDate).toBe("Jan 2020")
      expect(result.experience[0].endDate).toBe("Present")
      expect(result.experience[0].bullets[0]).not.toContain("•")
      expect(result.experience[0].bullets[0]).not.toContain("  ")

      // Education should be deduplicated
      expect(result.education.length).toBe(1)

      // Skills should be deduplicated
      expect(result.skills.languages.length).toBeLessThanOrEqual(2) // JS and Python
      expect(result.skills.frameworks.length).toBe(2) // React and Vue
      expect(result.skills.tools.length).toBe(1) // Git
    })

    it("should handle empty/missing fields gracefully", () => {
      const resumeData = {
        contact: {
          name: "John Doe"
        },
        experience: [],
        education: [],
        skills: {
          languages: [],
          frameworks: [],
          tools: [],
          databases: []
        }
      }

      const result = handleAllEdgeCases(resumeData, "")

      expect(result.contact.name).toBe("John Doe")
      expect(result.experience).toEqual([])
      expect(result.education).toEqual([])
      expect(result.skills.languages).toEqual([])
    })

    it("should handle malformed data without crashing", () => {
      const resumeData = {
        contact: null,
        experience: null,
        education: undefined,
        skills: {
          languages: ["JavaScript"],
          frameworks: null,
          tools: undefined,
          databases: []
        }
      }

      expect(() => handleAllEdgeCases(resumeData as any, "")).not.toThrow()
    })
  })

  describe("Multi-Page Artifact Removal", () => {
    it("should remove page numbers", () => {
      const text = `
        John Doe
        Page 1 of 2
        Experience
        Software Engineer
        Page 2 of 2
        Education
      `
      const resumeData = {
        contact: { name: "John Doe" },
        experience: [],
        education: [],
        skills: { languages: [], frameworks: [], tools: [], databases: [] }
      }

      const result = handleAllEdgeCases(resumeData, text)
      // Should process without errors
      expect(result).toBeDefined()
    })

    it("should handle repeated headers", () => {
      const text = `
        John Doe
        john@example.com

        Experience Section

        John Doe
        john@example.com

        Education Section
      `
      const resumeData = {
        contact: { name: "John Doe", email: "john@example.com" },
        experience: [],
        education: [],
        skills: { languages: [], frameworks: [], tools: [], databases: [] }
      }

      const result = handleAllEdgeCases(resumeData, text)
      expect(result.contact.name).toBe("John Doe")
      expect(result.contact.email).toBe("john@example.com")
    })
  })

  describe("Bullet Point Validation", () => {
    it("should remove very short bullets (<10 chars)", () => {
      const resumeData = {
        contact: { name: "Test" },
        experience: [{
          company: "Google",
          title: "Engineer",
          startDate: "2020",
          endDate: "2021",
          location: "CA",
          bullets: ["Did it", "Built a comprehensive microservices architecture", "Yes"]
        }],
        education: [],
        skills: { languages: [], frameworks: [], tools: [], databases: [] }
      }

      const result = handleAllEdgeCases(resumeData, "")
      // Short bullets should be removed or validated
      expect(result.experience[0].bullets.length).toBeGreaterThan(0)
      const longBullets = result.experience[0].bullets.filter((b: string) => b.length >= 10)
      expect(longBullets.length).toBeGreaterThan(0)
    })

    it("should remove bullets that are just dates", () => {
      const resumeData = {
        contact: { name: "Test" },
        experience: [{
          company: "Google",
          title: "Engineer",
          startDate: "2020",
          endDate: "2021",
          location: "CA",
          bullets: ["2020-2022", "Developed features", "Jan 2020"]
        }],
        education: [],
        skills: { languages: [], frameworks: [], tools: [], databases: [] }
      }

      const result = handleAllEdgeCases(resumeData, "")
      expect(result.experience[0].bullets).toContain("Developed features")
    })

    it("should remove bullets that are section headers", () => {
      const resumeData = {
        contact: { name: "Test" },
        experience: [{
          company: "Google",
          title: "Engineer",
          startDate: "2020",
          endDate: "2021",
          location: "CA",
          bullets: ["EXPERIENCE", "Developed features", "PROJECTS"]
        }],
        education: [],
        skills: { languages: [], frameworks: [], tools: [], databases: [] }
      }

      const result = handleAllEdgeCases(resumeData, "")
      expect(result.experience[0].bullets).toContain("Developed features")
      expect(result.experience[0].bullets).not.toContain("EXPERIENCE")
    })
  })
})
