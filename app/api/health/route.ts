import { NextResponse } from "next/server"
import {
  isSupabaseConfigured,
  shouldUseSupabaseStorage,
  shouldUseSupabaseTrials,
} from "@/lib/config/env"

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    message: "Resume Optimizer API is running",
    integrations: {
      supabaseConfigured: isSupabaseConfigured(),
      useSupabaseStorage: shouldUseSupabaseStorage(),
      useSupabaseTrials: shouldUseSupabaseTrials(),
    },
  })
}
