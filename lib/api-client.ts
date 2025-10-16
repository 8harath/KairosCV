// API client utilities for frontend

export async function uploadResume(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to upload resume")
  }

  return response.json()
}

export async function extractResumeData(fileContent: string) {
  const response = await fetch("/api/extract", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileContent }),
  })

  if (!response.ok) {
    throw new Error("Failed to extract resume data")
  }

  return response.json()
}

export async function tailorResume(resumeData: any, jobDetails: any) {
  const response = await fetch("/api/tailor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resumeData, jobDetails }),
  })

  if (!response.ok) {
    throw new Error("Failed to tailor resume")
  }

  return response.json()
}

export async function submitContactForm(data: {
  name: string
  email: string
  subject: string
  message: string
}) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to submit contact form")
  }

  return response.json()
}

export async function downloadResume(resumeContent: string, format: "pdf" | "docx" | "txt", fileName: string) {
  const response = await fetch("/api/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resumeContent, format, fileName }),
  })

  if (!response.ok) {
    throw new Error("Failed to prepare download")
  }

  return response.json()
}
