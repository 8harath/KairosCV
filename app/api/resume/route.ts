import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ResumeDocument } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resumeId = searchParams.get('resumeId');
    const userId = searchParams.get('userId');

    if (!resumeId && !userId) {
      return NextResponse.json({ error: "Resume ID or User ID is required" }, { status: 400 });
    }

    const db = await getDatabase();
    const resumesCollection = db.collection<ResumeDocument>("resumes");

    let resume: ResumeDocument | null = null;

    if (resumeId) {
      // Get specific resume by ID
      resume = await resumesCollection.findOne({ _id: resumeId });
    } else if (userId) {
      // Get latest resume for user
      resume = await resumesCollection.findOne(
        { userId },
        { sort: { createdAt: -1 } }
      );
    }

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      resume: {
        _id: resume._id,
        userId: resume.userId,
        originalFileName: resume.originalFileName,
        extractedText: resume.extractedText,
        structuredData: resume.structuredData,
        processedResume: resume.processedResume,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
        status: resume.status,
      },
    }, { status: 200 });

  } catch (error) {
    console.error("Get resume error:", error);
    return NextResponse.json({ 
      error: "Failed to retrieve resume",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resumeId = searchParams.get('resumeId');

    if (!resumeId) {
      return NextResponse.json({ error: "Resume ID is required" }, { status: 400 });
    }

    const db = await getDatabase();
    const resumesCollection = db.collection<ResumeDocument>("resumes");

    const result = await resumesCollection.deleteOne({ _id: resumeId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Resume deleted successfully",
    }, { status: 200 });

  } catch (error) {
    console.error("Delete resume error:", error);
    return NextResponse.json({ 
      error: "Failed to delete resume",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
