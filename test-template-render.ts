/**
 * Test script to verify template rendering
 */
import { renderJakesResume } from "./lib/templates/template-renderer"
import type { ParsedResume } from "./lib/parsers/enhanced-parser"

// Create sample resume data
const sampleResume: ParsedResume = {
  contact: {
    name: "Bharath K",
    email: "bharath.k@example.com",
    phone: "9008099880",
    linkedin: "linkedin.com/in/bharathk",
    github: "github.com/bharathk",
    website: "",
    location: "Bangalore, IN"
  },
  experience: [
    {
      title: "Software Developer",
      company: "Tech Company",
      location: "Bangalore, IN",
      startDate: "Jan 2024",
      endDate: "Present",
      bullets: [
        "Developed full-stack web applications",
        "Improved performance by 50%"
      ]
    }
  ],
  education: [
    {
      institution: "Jain University",
      degree: "Bachelor of Computer Applications",
      field: "Computer Science",
      location: "Bangalore, IN",
      startDate: "Aug 2024",
      endDate: "May 2027",
      gpa: "8.9"
    }
  ],
  skills: {
    languages: ["Python", "JavaScript", "SQL"],
    frameworks: ["React", "Node.js"],
    tools: ["Docker", "Git"],
    databases: ["PostgreSQL", "MongoDB"]
  },
  projects: [
    {
      name: "AI Resume Builder",
      description: "Built an AI-powered resume optimization tool",
      technologies: ["React", "Node.js", "Gemini AI"],
      bullets: [
        "Implemented AI-powered resume parsing",
        "Integrated Gemini API for content enhancement"
      ]
    }
  ],
  certifications: ["AWS Certified Developer", "Google Cloud Associate"]
}

const summary = "Highly motivated developer with strong skills in full-stack development and AI/ML."

// Render the template
console.log("Rendering template...")
const html = renderJakesResume(sampleResume, summary)

// Check for template code artifacts
const hasTemplateCode = html.includes('{{#if') || html.includes('{{/if}}') || html.includes('{{#')
const hasYourName = html.includes('Your Name') && !html.includes('Bharath K')

console.log("\n=== TEMPLATE RENDERING TEST ===")
console.log(`✓ HTML generated: ${html.length} characters`)
console.log(`✓ Contains name: ${html.includes('Bharath K') ? 'YES' : 'NO'}`)
console.log(`✓ Contains email: ${html.includes('bharath.k@example.com') ? 'YES' : 'NO'}`)
console.log(`✓ Contains phone: ${html.includes('9008099880') ? 'YES' : 'NO'}`)
console.log(`✓ Contains summary: ${html.includes(summary) ? 'YES' : 'NO'}`)
console.log(`✓ Contains experience: ${html.includes('Software Developer') ? 'YES' : 'NO'}`)
console.log(`✓ Contains education: ${html.includes('Jain University') ? 'YES' : 'NO'}`)
console.log(`✓ Contains skills: ${html.includes('Python') ? 'YES' : 'NO'}`)
console.log(`✓ Contains projects: ${html.includes('AI Resume Builder') ? 'YES' : 'NO'}`)
console.log(`\n✗ Has template code artifacts: ${hasTemplateCode ? 'FAIL' : 'PASS'}`)
console.log(`✗ Has "Your Name" placeholder: ${hasYourName ? 'FAIL' : 'PASS'}`)

if (hasTemplateCode) {
  console.log("\n⚠️  WARNING: Template code found in output!")
  const matches = html.match(/\{\{[^}]+\}\}/g)
  if (matches) {
    console.log("Template artifacts found:", matches.slice(0, 10))
  }
}

if (hasYourName) {
  console.log("\n⚠️  WARNING: 'Your Name' placeholder found in output!")
}

// Save output to file for inspection
import fs from "fs"
fs.writeFileSync("/tmp/test-output.html", html)
console.log("\n✓ HTML saved to /tmp/test-output.html for inspection")

if (!hasTemplateCode && !hasYourName) {
  console.log("\n✅ ALL TESTS PASSED!")
} else {
  console.log("\n❌ TESTS FAILED - Template rendering issues detected")
  process.exit(1)
}
