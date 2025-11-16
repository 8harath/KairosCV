/**
 * Multi-Layer Extraction Pipeline
 *
 * Implements a comprehensive extraction strategy with multiple verification layers:
 * Layer 1: Raw text extraction (PDF/DOCX/TXT)
 * Layer 2: Structured data extraction (Gemini AI)
 * Layer 2.5: Visual extraction and intelligent merging (Gemini Vision 2.0)
 * Layer 3: Field classification and validation
 * Layer 4: Completeness verification
 * Layer 4.5: Field verification and research
 * Layer 5: Data normalization and cleanup
 */

import { extractCompleteResumeData } from "../ai/gemini-service"
import {
  verifyDataCompleteness,
  validateFieldPlacement,
  categorizeSkillsBatch,
} from "../ai/field-classifier"
import { PartialResumeData, ResumeData, fillDefaults, safeValidateResumeData } from "../schemas/resume-schema"
import { saveResumeJSON } from "../storage/resume-json-storage"
import { extractCompleteResumeVisually, isVisualExtractionAvailable } from "../parsers/visual-extractor-enhanced"
import { mergeExtractions } from "./intelligent-merger"
import { getUploadFilePath } from "../file-storage"

export interface ExtractionResult {
  data: ResumeData
  verification: {
    complete: boolean
    missingContent: string[]
    confidence: number
  }
  layers: {
    layer1_extraction: boolean
    layer2_structuring: boolean
    layer2_5_visual: boolean
    layer3_classification: boolean
    layer4_verification: boolean
    layer4_5_field_research: boolean
    layer5_normalization: boolean
  }
}

/**
 * Extract resume data with multi-layer verification
 */
export async function extractWithVerification(
  rawText: string,
  fileId: string,
  onProgress?: (stage: string, progress: number, message: string) => void
): Promise<ExtractionResult> {
  const layers = {
    layer1_extraction: false,
    layer2_structuring: false,
    layer2_5_visual: false,
    layer3_classification: false,
    layer4_verification: false,
    layer4_5_field_research: false,
    layer5_normalization: false,
  }

  try {
    // ========================================================================
    // LAYER 1: Raw Text Extraction (already done, passed as parameter)
    // ========================================================================
    onProgress?.("extraction", 10, "Raw text extracted successfully")
    layers.layer1_extraction = true

    // ========================================================================
    // LAYER 2: Structured Data Extraction (Gemini AI)
    // ========================================================================
    onProgress?.("extraction", 30, "Extracting structured data with AI...")

    let extractedData = await extractCompleteResumeData(rawText)

    // Fallback to regex-based parser if AI extraction fails
    if (!extractedData) {
      console.warn("⚠️  AI extraction failed, using fallback parser...")
      onProgress?.("extraction", 40, "AI unavailable, using fallback parser...")

      const { parseResumeEnhanced } = await import('../parsers/enhanced-parser')
      const parsedFallback = parseResumeEnhanced(rawText)

      // Convert to expected format
      extractedData = {
        contact: parsedFallback.contact,
        summary: parsedFallback.summary,
        experience: parsedFallback.experience,
        education: parsedFallback.education,
        skills: parsedFallback.skills,
        projects: parsedFallback.projects,
        certifications: parsedFallback.certifications?.map(cert => ({
          name: cert,
          issuer: "",
          date: "",
        })) || [],
        awards: parsedFallback.awards,
        publications: parsedFallback.publications,
        languageProficiency: parsedFallback.languageProficiency,
        volunteer: parsedFallback.volunteer,
        hobbies: parsedFallback.hobbies,
        references: parsedFallback.references,
        customSections: parsedFallback.customSections,
      }

      console.log("✅ Fallback parser completed")
    }

    console.log("✅ Layer 2: Structured data extracted")
    layers.layer2_structuring = true

    // ========================================================================
    // LAYER 2.5: Visual Extraction and Intelligent Merging
    // ========================================================================
    onProgress?.("extraction", 45, "🎨 Extracting visual elements (bullets, formatting)...")

    // Get PDF file path from fileId
    const pdfPath = getUploadFilePath(fileId)

    // Check if visual extraction is available and file is PDF
    if (isVisualExtractionAvailable() && pdfPath.toLowerCase().endsWith('.pdf')) {
      try {
        console.log("🎨 Starting comprehensive visual extraction...")

        const visualExtraction = await extractCompleteResumeVisually(pdfPath, rawText)

        console.log(`✅ Visual extraction complete: ${visualExtraction.visualElements.bulletPoints.length} bullets found`)

        // Merge text and visual extractions
        onProgress?.("extraction", 48, "Merging text and visual extractions...")

        const merged = mergeExtractions(extractedData, visualExtraction)

        console.log(`✅ Merge complete: ${merged.sources.fromVision.length} items from vision`)
        console.log(`   Completeness: ${merged.completeness}%`)

        // Use merged data going forward
        extractedData = merged.data

        layers.layer2_5_visual = true
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error'
        console.warn(`⚠️  Visual extraction failed: ${errorMsg}`)
        console.log('⚠️  Continuing with text-only extraction')
        layers.layer2_5_visual = false
      }
    } else {
      const reason = !isVisualExtractionAvailable()
        ? 'Gemini Vision API not configured'
        : 'Not a PDF file'
      console.log(`⏭️  Layer 2.5: Skipped (${reason})`)
      layers.layer2_5_visual = false
    }

    onProgress?.("extraction", 50, "Validating field classifications...")

    // ========================================================================
    // LAYER 3: Field Classification and Validation (Skip if AI unavailable)
    // ========================================================================

    const { isGeminiConfigured } = await import('../ai/gemini-service')

    if (isGeminiConfigured()) {
      // Validate contact name
      if (extractedData.contact?.name) {
        const nameValidation = await validateFieldPlacement(
          "name",
          extractedData.contact.name,
          "person's full name"
        )

        if (!nameValidation.isCorrect && nameValidation.suggestedField) {
          console.warn(
            `⚠️  Name field might be incorrect. Suggested: ${nameValidation.suggestedField}`
          )
        }
      }

      // Validate and categorize skills if they exist
      if (extractedData.skills) {
        const allSkills = [
          ...(extractedData.skills.languages || []),
          ...(extractedData.skills.frameworks || []),
          ...(extractedData.skills.tools || []),
          ...(extractedData.skills.databases || []),
        ]

        if (allSkills.length > 0) {
          onProgress?.("extraction", 60, "Categorizing technical skills...")

          const categorized = await categorizeSkillsBatch(allSkills)

          // Update skills with correct categorization
          extractedData.skills = {
            languages: categorized.languages,
            frameworks: categorized.frameworks,
            tools: categorized.tools,
            databases: categorized.databases,
          }

          console.log("✅ Layer 3: Skills categorized correctly")
        }
      }

      // Validate experience entries
      if (extractedData.experience && extractedData.experience.length > 0) {
        for (const exp of extractedData.experience) {
          // Validate company name
          if (exp.company) {
            const companyValidation = await validateFieldPlacement(
              "company",
              exp.company,
              "company name"
            )

            if (!companyValidation.isCorrect) {
              console.warn(
                `⚠️  Company field might be incorrect: "${exp.company}"`
              )
            }
          }

          // Validate job title
          if (exp.title) {
            const titleValidation = await validateFieldPlacement(
              "title",
              exp.title,
              "job title"
            )

            if (!titleValidation.isCorrect) {
              console.warn(`⚠️  Job title might be incorrect: "${exp.title}"`)
            }
          }
        }
      }

      console.log("✅ Layer 3: Field classification validated")
    } else {
      console.log("⏭️  Layer 3: Skipped (AI unavailable)")
    }

    layers.layer3_classification = true

    onProgress?.("extraction", 75, "Verifying data completeness...")

    // ========================================================================
    // LAYER 4: Completeness Verification (Skip if AI unavailable)
    // ========================================================================

    let completenessCheck = {
      complete: true,
      missingContent: [] as string[],
      confidence: 0.8,
    }

    if (isGeminiConfigured()) {
      completenessCheck = await verifyDataCompleteness(rawText, extractedData)

      if (!completenessCheck.complete) {
        console.warn("⚠️  Data extraction might be incomplete:")
        completenessCheck.missingContent.forEach((item, index) => {
          console.warn(`   ${index + 1}. ${item}`)
        })

        // Re-extract if confidence is low and missing content is significant
        if (completenessCheck.confidence < 0.7 && completenessCheck.missingContent.length > 3) {
          console.log("🔄 Attempting second extraction pass...")
          onProgress?.("extraction", 78, "Re-extracting missing content...")

          const secondExtraction = await extractCompleteResumeData(rawText)

          if (secondExtraction) {
            // Merge missing content from second extraction
            extractedData = mergeExtractions(extractedData, secondExtraction)
            console.log("✅ Second extraction pass completed")
          }
        }
      } else {
        console.log(`✅ Layer 4: Data completeness verified (${(completenessCheck.confidence * 100).toFixed(0)}% confidence)`)
      }
    } else {
      console.log("⏭️  Layer 4: Skipped (AI unavailable)")
    }

    layers.layer4_verification = true

    onProgress?.("extraction", 80, "Verifying and researching fields...")

    // ========================================================================
    // LAYER 4.5: Field Verification and Research (NEW)
    // ========================================================================

    const { verifyAndResearchResumeData, isVerificationAvailable } = await import('../ai/field-verifier')

    let researchedData = extractedData

    if (isVerificationAvailable()) {
      console.log("🔍 Starting field verification and research...")

      researchedData = await verifyAndResearchResumeData(
        extractedData,
        rawText,
        (progress) => {
          // Forward verification progress to user
          const progressPercent = 80 + (progress.progress / 100) * 10 // Map to 80-90%
          const statusEmoji = {
            verifying: "🔍",
            researching: "🔎",
            found: "✅",
            not_found: "❌",
            valid: "✓",
            invalid: "⚠️"
          }[progress.status] || "🔍"

          onProgress?.(
            "verification",
            Math.round(progressPercent),
            `${statusEmoji} ${progress.message}`
          )
        }
      )

      console.log("✅ Field verification and research complete")
      layers.layer4_5_field_research = true
    } else {
      console.log("⏭️  Layer 4.5: Skipped (AI unavailable)")
      onProgress?.("extraction", 85, "Skipping verification (AI unavailable)")
      layers.layer4_5_field_research = false
    }

    onProgress?.("extraction", 90, "Normalizing and cleaning data...")

    // ========================================================================
    // LAYER 5: Data Normalization and Cleanup
    // ========================================================================

    // Fill in defaults for missing required fields
    const normalizedData = fillDefaults(researchedData as PartialResumeData)

    // Validate with Zod schema
    const validation = safeValidateResumeData(normalizedData)

    if (!validation.success) {
      console.warn("⚠️  Validation warnings:", validation.errors)
    }

    const finalData = validation.data || normalizedData

    console.log("✅ Layer 5: Data normalized and validated")
    layers.layer5_normalization = true

    // ========================================================================
    // Save JSON to storage for debugging and audit
    // ========================================================================
    onProgress?.("extraction", 95, "Saving extracted data to JSON...")

    await saveResumeJSON(fileId, finalData)

    onProgress?.("extraction", 100, "Extraction complete!")

    return {
      data: finalData,
      verification: completenessCheck,
      layers,
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error"
    console.error("❌ Multi-layer extraction failed:", errorMsg)

    throw new Error(`Extraction failed at layer: ${JSON.stringify(layers)} - ${errorMsg}`)
  }
}

/**
 * Merge two extraction results to recover missing data
 */
function mergeExtractions(primary: any, secondary: any): any {
  return {
    contact: {
      name: primary.contact?.name || secondary.contact?.name || "",
      email: primary.contact?.email || secondary.contact?.email || "",
      phone: primary.contact?.phone || secondary.contact?.phone || "",
      linkedin: primary.contact?.linkedin || secondary.contact?.linkedin || "",
      github: primary.contact?.github || secondary.contact?.github || "",
      website: primary.contact?.website || secondary.contact?.website || "",
      location: primary.contact?.location || secondary.contact?.location || "",
    },
    summary: primary.summary || secondary.summary,
    experience: mergArrays(primary.experience, secondary.experience, "company"),
    education: mergArrays(primary.education, secondary.education, "institution"),
    skills: {
      languages: [...new Set([...(primary.skills?.languages || []), ...(secondary.skills?.languages || [])])],
      frameworks: [...new Set([...(primary.skills?.frameworks || []), ...(secondary.skills?.frameworks || [])])],
      tools: [...new Set([...(primary.skills?.tools || []), ...(secondary.skills?.tools || [])])],
      databases: [...new Set([...(primary.skills?.databases || []), ...(secondary.skills?.databases || [])])],
    },
    projects: mergArrays(primary.projects, secondary.projects, "name"),
    certifications: mergArrays(primary.certifications, secondary.certifications, "name"),
    awards: mergArrays(primary.awards, secondary.awards, "name"),
    publications: mergArrays(primary.publications, secondary.publications, "title"),
    languageProficiency: mergArrays(primary.languageProficiency, secondary.languageProficiency, "language"),
    volunteer: mergArrays(primary.volunteer, secondary.volunteer, "organization"),
    hobbies: mergArrays(primary.hobbies, secondary.hobbies, "name"),
    references: [...new Set([...(primary.references || []), ...(secondary.references || [])])],
    customSections: mergArrays(primary.customSections, secondary.customSections, "heading"),
  }
}

/**
 * Merge two arrays of objects, avoiding duplicates based on a key field
 */
function mergArrays(arr1: any[] | undefined, arr2: any[] | undefined, keyField: string): any[] {
  const primary = arr1 || []
  const secondary = arr2 || []

  // Get keys from primary array
  const existingKeys = new Set(primary.map((item) => item[keyField]?.toLowerCase()))

  // Add items from secondary that don't exist in primary
  const merged = [...primary]

  for (const item of secondary) {
    const key = item[keyField]?.toLowerCase()
    if (key && !existingKeys.has(key)) {
      merged.push(item)
    }
  }

  return merged
}
