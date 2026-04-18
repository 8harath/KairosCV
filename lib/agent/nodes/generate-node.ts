import { generatePDF } from "@/lib/resume-processor"
import { saveGeneratedPDF } from "@/lib/file-storage"
import type { ParsedResume } from "@/lib/parsers/enhanced-parser"
import type { ResumeAgentStateType } from "../state"

/**
 * Generate Node — renders the Puppeteer PDF and saves it to storage.
 */
export async function generateNode(
  state: ResumeAgentStateType
): Promise<Partial<ResumeAgentStateType>> {
  const data = state.enhancedData
  if (!data) {
    return {
      error: "No enhanced data available for PDF generation",
      stage: "generating",
      progress: 96,
      message: "PDF generation failed — no resume data",
    }
  }

  try {
    // Infer skills from projects if skills section is empty
    const skills = data.skills ?? { languages: [], frameworks: [], tools: [], databases: [] }
    const hasSkills =
      (skills.languages?.length ?? 0) > 0 ||
      (skills.frameworks?.length ?? 0) > 0 ||
      (skills.tools?.length ?? 0) > 0 ||
      (skills.databases?.length ?? 0) > 0

    if (!hasSkills && (data.projects?.length ?? 0) > 0) {
      const inferred = new Set<string>()
      for (const proj of data.projects ?? []) {
        (proj.technologies ?? []).forEach(t => inferred.add(t))
      }
      if (inferred.size > 0) {
        skills.tools = [...inferred]
      }
    }

    // Build ParsedResume for the template renderer
    const parsedResume: ParsedResume = {
      contact: {
        name: data.contact?.name ?? "Your Name",
        email: data.contact?.email ?? "",
        phone: data.contact?.phone ?? "",
        linkedin: data.contact?.linkedin ?? "",
        github: data.contact?.github ?? "",
        website: data.contact?.website ?? "",
        location: data.contact?.location ?? "",
      },
      summary: data.summary,
      experience: (data.experience ?? []).map(e => ({
        title: e.title ?? "",
        company: e.company ?? "",
        startDate: e.startDate ?? "",
        endDate: e.endDate ?? "",
        location: e.location ?? "",
        bullets: e.bullets ?? [],
      })),
      education: (data.education ?? []).map(e => ({
        degree: e.degree ?? "",
        institution: e.institution ?? "",
        field: "",
        location: "",
        startDate: e.startDate ?? "",
        endDate: e.endDate ?? "",
        gpa: e.gpa,
        honors: e.honors
          ? (Array.isArray(e.honors) ? e.honors : [e.honors])
          : undefined,
      })),
      skills: {
        languages: skills.languages ?? [],
        frameworks: skills.frameworks ?? [],
        tools: skills.tools ?? [],
        databases: skills.databases ?? [],
      },
      projects: (data.projects ?? []).map(p => ({
        name: p.name ?? "",
        description: p.description ?? "",
        technologies: p.technologies ?? [],
        url: p.url,
        github: p.github,
        bullets: p.bullets ?? [],
      })),
      certifications: data.certifications ?? [],
      awards: data.awards as ParsedResume["awards"],
      publications: data.publications as ParsedResume["publications"],
      languageProficiency: data.languageProficiency as ParsedResume["languageProficiency"],
      volunteer: data.volunteer as ParsedResume["volunteer"],
      hobbies: data.hobbies as ParsedResume["hobbies"],
      references: data.references as ParsedResume["references"],
      customSections: data.customSections as ParsedResume["customSections"],
    }

    const pdfBuffer = await generatePDF(
      parsedResume,
      data.summary,
      state.templateId,
      state.paperFormat
    )

    await saveGeneratedPDF(state.fileId, pdfBuffer)

    return {
      pdfSaved: true,
      stage: "complete",
      progress: 100,
      message: "Resume optimization complete!",
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error"
    return {
      error: `PDF generation failed: ${msg}`,
      stage: "generating",
      progress: 96,
      message: "PDF generation failed",
    }
  }
}
