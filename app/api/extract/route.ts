import { type NextRequest, NextResponse } from "next/server"
import { extractStructuredDataFromResume } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fileContent, resumeId } = body

    if (!fileContent) {
      return NextResponse.json({ error: "No file content provided" }, { status: 400 })
    }

    // Extract structured data using Gemini
    console.log("Extracting structured data with Gemini...");
    const structuredData = await extractStructuredDataFromResume(fileContent);

    const extractedData = {
      success: true,
      data: structuredData,
      extractionConfidence: 0.95,
    }

    return NextResponse.json(extractedData, { status: 200 })
  } catch (error) {
    console.error("Extraction error:", error)
    return NextResponse.json({ 
      error: "Failed to extract resume data",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
