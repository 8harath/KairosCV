import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer()

    // In a real implementation, you would:
    // 1. Save the file to storage (Vercel Blob, S3, etc.)
    // 2. Process the PDF to extract text
    // 3. Return the extracted data

    // Mock response for now
    const mockExtractedData = {
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      extractedData: {
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+1 (555) 123-4567",
        summary: "Experienced Full Stack Developer with 5+ years of expertise",
        experience: [
          {
            title: "Senior Software Engineer",
            company: "Tech Corp",
            duration: "2021 - Present",
            description: "Led development of microservices architecture",
          },
        ],
        skills: ["React", "Node.js", "TypeScript", "AWS", "Docker"],
        education: [
          {
            degree: "B.S. Computer Science",
            school: "State University",
            year: "2019",
          },
        ],
      },
    }

    return NextResponse.json(mockExtractedData, { status: 200 })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to process file" }, { status: 500 })
  }
}
