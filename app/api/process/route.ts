import { type NextRequest, NextResponse } from "next/server";
import { processResumeWithAI } from "@/lib/gemini";
import { getDatabase } from "@/lib/mongodb";
import { ResumeDocument } from "@/lib/types";
import { ObjectId } from "mongodb";

// Increase timeout for AI processing
export const maxDuration = 60; // 60 seconds for AI processing

export async function POST(request: NextRequest) {
  try {
    console.log("Process API called");
    const body = await request.json();
    const { resumeId, jobDescription } = body;

    console.log("Resume ID:", resumeId);
    console.log("Job Description:", jobDescription);

    if (!resumeId) {
      return NextResponse.json({ error: "Resume ID is required" }, { status: 400 });
    }

    // Get resume from MongoDB
    console.log("Connecting to MongoDB...");
    const db = await getDatabase();
    const resumesCollection = db.collection<ResumeDocument>("resumes");
    
    // Convert string ID to ObjectId
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(resumeId);
      console.log("Converted to ObjectId:", objectId);
    } catch (error) {
      console.error("Invalid ObjectId format:", error);
      return NextResponse.json({ error: "Invalid resume ID format" }, { status: 400 });
    }
    
    console.log("Finding resume in database...");
    const resume = await resumesCollection.findOne({ _id: objectId } as any);
    if (!resume) {
      console.error("Resume not found for ID:", resumeId);
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    console.log("Resume found:", resume.originalFileName);

    if (!resume.extractedText) {
      console.error("No extracted text found");
      return NextResponse.json({ error: "No extracted text found" }, { status: 400 });
    }

    console.log("Extracted text length:", resume.extractedText.length);

    // Update status to processing
    console.log("Updating status to processing...");
    await resumesCollection.updateOne(
      { _id: objectId } as any,
      { 
        $set: { 
          status: "processing",
          updatedAt: new Date()
        }
      }
    );

    try {
      // Process with AI
      console.log("Processing with Gemini AI...");
      const processedResume = await processResumeWithAI(
        resume.extractedText,
        jobDescription
      );

      console.log("AI processing complete");

      // Update resume with processed data
      console.log("Updating database with processed data...");
      await resumesCollection.updateOne(
        { _id: objectId } as any,
        { 
          $set: { 
            processedResume,
            status: "completed",
            updatedAt: new Date()
          }
        }
      );

      console.log("Database updated successfully");

      return NextResponse.json({
        success: true,
        resumeId,
        processedResume,
        message: "Resume processed successfully",
      }, { status: 200 });

    } catch (aiError) {
      console.error("AI processing error:", aiError);
      // Update status to error
      await resumesCollection.updateOne(
        { _id: objectId } as any,
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
