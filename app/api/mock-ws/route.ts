import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { fileId } = await request.json()

  // Simulate processing stages
  const stages = [
    { stage: "parsing", progress: 20, message: "Parsing resume..." },
    { stage: "parsing", progress: 35, message: "Resume parsed" },
    { stage: "enhancing", progress: 50, message: "Enhancing with AI..." },
    { stage: "enhancing", progress: 70, message: "Content enhanced" },
    { stage: "generating", progress: 80, message: "Generating PDF..." },
    { stage: "compiling", progress: 95, message: "Compiling..." },
    { stage: "complete", progress: 100, message: "Complete!", download_url: `/api/download/${fileId}` },
  ]

  return NextResponse.json({ stages })
}
