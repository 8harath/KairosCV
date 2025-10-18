import { type NextRequest, NextResponse } from "next/server";
import { processResumeWithAI } from "@/lib/gemini";
import { getDatabase } from "@/lib/mongodb";
import { ResumeDocument } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeId, jobDescription } = body;

    if (!resumeId) {
      return NextResponse.json({ error: "Resume ID is required" }, { status: 400 });
    }

    // Get resume from MongoDB
    const db = await getDatabase();
    const resumesCollection = db.collection<ResumeDocument>("resumes");
    
    const resume = await resumesCollection.findOne({ _id: resumeId });
    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    if (!resume.extractedText) {
      return NextResponse.json({ error: "No extracted text found" }, { status: 400 });
    }

    // Update status to processing
    await resumesCollection.updateOne(
      { _id: resumeId },
      { 
        $set: { 
          status: "processing",
          updatedAt: new Date()
        }
      }
    );

    try {
      // Process with AI
      const processedResume = await processResumeWithAI(
        resume.extractedText,
        jobDescription
      );

      // Update resume with processed data
      await resumesCollection.updateOne(
        { _id: resumeId },
        { 
          $set: { 
            processedResume,
            status: "completed",
            updatedAt: new Date()
          }
        }
      );

      return NextResponse.json({
        success: true,
        resumeId,
        processedResume,
        message: "Resume processed successfully",
      }, { status: 200 });

    } catch (aiError) {
      // Update status to error
      await resumesCollection.updateOne(
        { _id: resumeId },
        { 
          $set: { 
            status: "error",
            updatedAt: new Date()
          }
        }
      );

      console.error("AI processing error:", aiError);
      return NextResponse.json({ 
        error: "Failed to process resume with AI",
        details: aiError instanceof Error ? aiError.message : "Unknown AI error"
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Process error:", error);
    return NextResponse.json({ 
      error: "Failed to process resume",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
