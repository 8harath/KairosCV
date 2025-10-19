import { type NextRequest, NextResponse } from "next/server";
import { generatePDFFromResume } from "@/lib/pdf-generator";
import { getDatabase } from "@/lib/mongodb";
import { ResumeDocument } from "@/lib/types";

// Increase timeout for PDF generation
export const maxDuration = 60; // 60 seconds for PDF generation

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeId } = body;

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

    if (!resume.processedResume) {
      return NextResponse.json({ 
        error: "Resume has not been processed yet" 
      }, { status: 400 });
    }

    // Generate PDF
    const pdfBuffer = await generatePDFFromResume(resume.processedResume);

    // Return PDF as base64 for frontend download
    const pdfBase64 = pdfBuffer.toString('base64');

    return NextResponse.json({
      success: true,
      pdfData: pdfBase64,
      fileName: `${resume.originalFileName.replace(/\.[^/.]+$/, "")}_optimized.pdf`,
      message: "PDF generated successfully",
    }, { status: 200 });

  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json({ 
      error: "Failed to generate PDF",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resumeId = searchParams.get('resumeId');

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

    if (!resume.processedResume) {
      return NextResponse.json({ 
        error: "Resume has not been processed yet" 
      }, { status: 400 });
    }

    // Generate PDF
    const pdfBuffer = await generatePDFFromResume(resume.processedResume);

    // Return PDF directly as download
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${resume.originalFileName.replace(/\.[^/.]+$/, "")}_optimized.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json({ 
      error: "Failed to generate PDF",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
