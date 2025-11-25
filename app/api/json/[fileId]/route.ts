/**
 * API Endpoint: View Extracted JSON Data
 *
 * GET /api/json/[fileId]
 * Returns the extracted resume JSON for inspection and debugging
 */

import { NextRequest, NextResponse } from "next/server"
import { loadResumeJSON, resumeJSONExists } from "@/lib/storage/resume-json-storage"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      )
    }

    // Check if JSON exists
    const exists = await resumeJSONExists(fileId)

    if (!exists) {
      return NextResponse.json(
        { error: "Resume JSON not found. The file may not have been processed yet." },
        { status: 404 }
      )
    }

    // Load the JSON data
    const resumeData = await loadResumeJSON(fileId)

    if (!resumeData) {
      return NextResponse.json(
        { error: "Failed to load resume JSON" },
        { status: 500 }
      )
    }

    // Return with pretty formatting
    return new NextResponse(JSON.stringify(resumeData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Error retrieving resume JSON:", error)

    return NextResponse.json(
      {
        error: "Failed to retrieve resume JSON",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
