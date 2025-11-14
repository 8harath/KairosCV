/**
 * Test script to verify resume extraction
 */
import { parseResumeEnhanced } from "./lib/parsers/enhanced-parser"

// Sample resume text similar to user's format
const sampleResumeText = `
Bharath K
9008099880 | bharath.k@gmail.com | LinkedIn | Bangalore, IN

PROFESSIONAL SUMMARY
A highly motivated Computer Science student with a strong foundation in full-stack
development and AI/ML, demonstrated through practical experience building interactive
UIs, optimizing backend performance, and developing AI-driven solutions.

EDUCATION
Jain (Deemed-to-be University) Bangalore, IND
Bachelor of Computer Application Expected May 2027
Major in Computer Science; Minors in Data Analysis
Cumulative GPA: 8.9

EXPERIENCE
GenXReality Hyderabad, IND
Dec 2024 – Present
● Built a full-stack website with interactive UI and optimized backend performance.
● Developed text-to-3D generation using AI models

Monospace Jaipur, IND
Jan 2025 – March 2025
● Used Hugging Face models and LiDAR to develop 2D-to-3D conversion
● Integrated Stable Diffusion for prompt-based image generation

1M1B Bangalore, IND
Nov 2024 – March 2025
● Collected and analyzed sustainability data on emissions and fuel
● Created a custom Tableau dashboard to visualize data and propose AI-driven sustainability solutions.

PROJECTS
Automated Document Generation using Fine-Tuned LLaMA Aug 2024
● Fine-tuned LLaMA on past assignment datasets to generate academic documents for various topics.

Online Voting System with Full-Stack Implementation Nov 2024
● Developed a secure online voting system using HTML, CSS, JavaScript, Python, and SQL.

TECHNICAL SKILLS
Languages: Python, JavaScript, Java, SQL
Frameworks & Libraries: React, Node.js, Django, TensorFlow
Tools & Technologies: Docker, Git, AWS, Tableau
Databases: PostgreSQL, MongoDB
`

console.log("Testing resume extraction...\n")
const parsed = parseResumeEnhanced(sampleResumeText)

console.log("=== CONTACT INFO ===")
console.log(`Name: ${parsed.contact.name || 'NOT EXTRACTED'}`)
console.log(`Email: ${parsed.contact.email || 'NOT EXTRACTED'}`)
console.log(`Phone: ${parsed.contact.phone || 'NOT EXTRACTED'}`)
console.log(`Location: ${parsed.contact.location || 'NOT EXTRACTED'}`)

console.log("\n=== EXPERIENCE ===")
console.log(`Found ${parsed.experience.length} experience entries`)
parsed.experience.forEach((exp, i) => {
  console.log(`\n${i + 1}. ${exp.title} at ${exp.company}`)
  console.log(`   Dates: ${exp.startDate} - ${exp.endDate}`)
  console.log(`   Location: ${exp.location}`)
  console.log(`   Bullets: ${exp.bullets.length} bullets`)
  exp.bullets.forEach((bullet, j) => {
    console.log(`      ${j + 1}. ${bullet.substring(0, 60)}${bullet.length > 60 ? '...' : ''}`)
  })
})

console.log("\n=== EDUCATION ===")
console.log(`Found ${parsed.education.length} education entries`)
parsed.education.forEach((edu, i) => {
  console.log(`\n${i + 1}. ${edu.institution}`)
  console.log(`   Degree: ${edu.degree}`)
  console.log(`   Field: ${edu.field}`)
  console.log(`   GPA: ${edu.gpa || 'N/A'}`)
})

console.log("\n=== PROJECTS ===")
console.log(`Found ${parsed.projects.length} project entries`)
parsed.projects.forEach((proj, i) => {
  console.log(`\n${i + 1}. ${proj.name}`)
  console.log(`   Bullets: ${proj.bullets.length} bullets`)
  proj.bullets.forEach((bullet, j) => {
    console.log(`      ${j + 1}. ${bullet.substring(0, 60)}${bullet.length > 60 ? '...' : ''}`)
  })
})

// Validate results
let hasIssues = false

if (!parsed.contact.name) {
  console.log("\n❌ ISSUE: Name not extracted")
  hasIssues = true
}

if (parsed.experience.length === 0) {
  console.log("\n❌ ISSUE: No experience entries found")
  hasIssues = true
} else {
  parsed.experience.forEach((exp, i) => {
    if (exp.bullets.length === 0) {
      console.log(`\n❌ ISSUE: Experience ${i + 1} (${exp.company}) has no bullets`)
      hasIssues = true
    }
  })
}

if (parsed.projects.length === 0) {
  console.log("\n❌ ISSUE: No projects found")
  hasIssues = true
} else {
  parsed.projects.forEach((proj, i) => {
    if (proj.bullets.length === 0) {
      console.log(`\n❌ ISSUE: Project ${i + 1} (${proj.name}) has no bullets`)
      hasIssues = true
    }
  })
}

if (!hasIssues) {
  console.log("\n✅ ALL EXTRACTION TESTS PASSED!")
} else {
  console.log("\n❌ EXTRACTION HAS ISSUES - See above")
  process.exit(1)
}
