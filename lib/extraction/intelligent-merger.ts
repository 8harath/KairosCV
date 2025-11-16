/**
 * Intelligent Extraction Merger
 *
 * Combines text-based and vision-based extraction results
 * to ensure ZERO data loss and maximum information capture
 */

import { ResumeData } from "../schemas/resume-schema"
import { VisualExtractionResult } from "../parsers/visual-extractor-enhanced"

export interface MergedExtractionResult {
  data: ResumeData
  sources: {
    fromText: string[]
    fromVision: string[]
    merged: string[]
  }
  completeness: number
}

/**
 * Intelligently merge text and visual extraction results
 */
export function mergeExtractions(
  textExtraction: any,
  visualExtraction: VisualExtractionResult
): MergedExtractionResult {
  console.log("🔄 Merging text and visual extractions...")

  const sources = {
    fromText: [] as string[],
    fromVision: [] as string[],
    merged: [] as string[],
  }

  // Start with text extraction as base
  const merged: any = JSON.parse(JSON.stringify(textExtraction))

  const visualData = visualExtraction.structuredData

  // Merge contact information
  if (visualData.contact) {
    for (const [key, value] of Object.entries(visualData.contact)) {
      if (value && (!merged.contact?.[key] || merged.contact[key].length < (value as string).length)) {
        merged.contact = merged.contact || {}
        merged.contact[key] = value
        sources.fromVision.push(`contact.${key}`)
      }
    }
  }

  // Merge experience with bullet points
  if (visualData.experience && Array.isArray(visualData.experience)) {
    merged.experience = merged.experience || []

    for (const visualExp of visualData.experience) {
      // Find matching experience in text extraction
      const matchingExp = merged.experience.find((exp: any) =>
        exp.company?.toLowerCase().includes(visualExp.company?.toLowerCase()) ||
        visualExp.company?.toLowerCase().includes(exp.company?.toLowerCase())
      )

      if (matchingExp) {
        // Merge bullets
        const existingBullets = new Set(matchingExp.bullets || [])
        const newBullets = (visualExp.bullets || []).filter((b: string) => !existingBullets.has(b))

        if (newBullets.length > 0) {
          matchingExp.bullets = [...(matchingExp.bullets || []), ...newBullets]
          sources.fromVision.push(`experience.${visualExp.company}.bullets`)
        }

        // Fill missing fields
        for (const [key, value] of Object.entries(visualExp)) {
          if (value && !matchingExp[key]) {
            matchingExp[key] = value
          }
        }
      } else {
        // New experience not in text extraction
        merged.experience.push(visualExp)
        sources.fromVision.push(`experience.${visualExp.company}`)
      }
    }
  }

  // Merge education
  if (visualData.education && Array.isArray(visualData.education)) {
    merged.education = merged.education || []

    for (const visualEdu of visualData.education) {
      const matchingEdu = merged.education.find((edu: any) =>
        edu.institution?.toLowerCase().includes(visualEdu.institution?.toLowerCase())
      )

      if (matchingEdu) {
        // Merge details
        if (visualEdu.details && Array.isArray(visualEdu.details)) {
          matchingEdu.honors = [...new Set([...(matchingEdu.honors || []), ...visualEdu.details])]
        }

        for (const [key, value] of Object.entries(visualEdu)) {
          if (value && !matchingEdu[key]) {
            matchingEdu[key] = value
          }
        }
      } else {
        merged.education.push(visualEdu)
        sources.fromVision.push(`education.${visualEdu.institution}`)
      }
    }
  }

  // Merge skills
  if (visualData.skills) {
    merged.skills = merged.skills || { languages: [], frameworks: [], tools: [], databases: [] }

    const mergeSkillArray = (category: string, visualSkills: string[]) => {
      if (visualSkills && Array.isArray(visualSkills)) {
        const existing = new Set(merged.skills[category] || [])
        const newSkills = visualSkills.filter(s => !existing.has(s))
        if (newSkills.length > 0) {
          merged.skills[category] = [...(merged.skills[category] || []), ...newSkills]
          sources.fromVision.push(`skills.${category}`)
        }
      }
    }

    mergeSkillArray('languages', visualData.skills.languages)
    mergeSkillArray('frameworks', visualData.skills.frameworks)
    mergeSkillArray('tools', visualData.skills.tools)

    // Handle technical and other categories
    if (visualData.skills.technical) {
      mergeSkillArray('languages', visualData.skills.technical)
    }
    if (visualData.skills.other) {
      mergeSkillArray('tools', visualData.skills.other)
    }
  }

  // Merge projects
  if (visualData.projects && Array.isArray(visualData.projects)) {
    merged.projects = merged.projects || []

    for (const visualProj of visualData.projects) {
      const matchingProj = merged.projects.find((proj: any) =>
        proj.name?.toLowerCase() === visualProj.name?.toLowerCase()
      )

      if (matchingProj) {
        // Merge bullets and technologies
        if (visualProj.bullets) {
          const existingBullets = new Set(matchingProj.bullets || [])
          const newBullets = visualProj.bullets.filter((b: string) => !existingBullets.has(b))
          if (newBullets.length > 0) {
            matchingProj.bullets = [...(matchingProj.bullets || []), ...newBullets]
          }
        }

        if (visualProj.technologies) {
          matchingProj.technologies = [...new Set([...(matchingProj.technologies || []), ...visualProj.technologies])]
        }

        for (const [key, value] of Object.entries(visualProj)) {
          if (value && !matchingProj[key]) {
            matchingProj[key] = value
          }
        }
      } else {
        merged.projects.push(visualProj)
        sources.fromVision.push(`projects.${visualProj.name}`)
      }
    }
  }

  // Add visual elements metadata
  merged._visualMetadata = {
    bulletPoints: visualExtraction.visualElements.bulletPoints.length,
    italicText: visualExtraction.visualElements.italicText.length,
    boldText: visualExtraction.visualElements.boldText.length,
    smallText: visualExtraction.visualElements.smallText.length,
    layout: visualExtraction.visualElements.layout,
  }

  // Merge other arrays (certifications, awards, etc.)
  const mergeSimpleArrays = (field: string) => {
    if (visualData[field] && Array.isArray(visualData[field])) {
      merged[field] = [...new Set([...(merged[field] || []), ...visualData[field]])]
      if (visualData[field].length > 0) {
        sources.fromVision.push(field)
      }
    }
  }

  mergeSimpleArrays('certifications')
  mergeSimpleArrays('awards')
  mergeSimpleArrays('languages')
  mergeSimpleArrays('volunteer')
  mergeSimpleArrays('publications')

  // Calculate completeness
  const textFields = countFields(textExtraction)
  const mergedFields = countFields(merged)
  const completeness = Math.round((mergedFields / Math.max(mergedFields, textFields + 10)) * 100)

  console.log("✅ Merge complete:")
  console.log(`   - Fields from text: ${textFields}`)
  console.log(`   - Fields from vision: ${sources.fromVision.length}`)
  console.log(`   - Total fields: ${mergedFields}`)
  console.log(`   - Completeness: ${completeness}%`)

  return {
    data: merged,
    sources,
    completeness,
  }
}

/**
 * Count non-empty fields in resume data
 */
function countFields(data: any): number {
  let count = 0

  const countObject = (obj: any) => {
    if (!obj) return
    for (const value of Object.values(obj)) {
      if (Array.isArray(value)) {
        count += value.length
      } else if (value && typeof value === 'object') {
        countObject(value)
      } else if (value) {
        count++
      }
    }
  }

  countObject(data)
  return count
}

/**
 * Extract all bullet points from visual data
 */
export function extractAllBulletPoints(visualExtraction: VisualExtractionResult): string[] {
  const bullets = new Set<string>()

  // From visual elements
  visualExtraction.visualElements.bulletPoints.forEach(b => bullets.add(b))

  // From structured data
  const data = visualExtraction.structuredData

  if (data.experience) {
    data.experience.forEach((exp: any) => {
      if (exp.bullets) {
        exp.bullets.forEach((b: string) => bullets.add(b))
      }
    })
  }

  if (data.projects) {
    data.projects.forEach((proj: any) => {
      if (proj.bullets) {
        proj.bullets.forEach((b: string) => bullets.add(b))
      }
    })
  }

  return Array.from(bullets)
}
