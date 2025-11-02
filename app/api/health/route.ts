import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    message: "Resume Optimizer API is running",
  })
}
