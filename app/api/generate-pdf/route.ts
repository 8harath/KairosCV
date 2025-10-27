import { type NextRequest, NextResponse } from "next/server";
import { generatePDFFromResume } from "@/lib/pdf-generator";
import { generateSimplePDF, generateTextResume } from "@/lib/simple-pdf-generator";
import { getDatabase } from "@/lib/mongodb";
import { ResumeDocument } from "@/lib/types";
import { ObjectId } from "mongodb";

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
    
    // Convert string to ObjectId
    const objectId = new ObjectId(resumeId);
    const resume = await resumesCollection.findOne({ _id: objectId } as any);
    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    if (!resume.processedResume) {
      return NextResponse.json({ 
        error: "Resume has not been processed yet" 
      }, { status: 400 });
    }

    try {
      // Try Puppeteer PDF generation first
      const pdfBuffer = await generatePDFFromResume(resume.processedResume);
      const pdfBase64 = pdfBuffer.toString('base64');

      return NextResponse.json({
        success: true,
        pdfData: pdfBase64,
        fileName: `${resume.originalFileName.replace(/\.[^/.]+$/, "")}_optimized.pdf`,
        message: "PDF generated successfully",
      }, { status: 200 });

    } catch (puppeteerError) {
      console.warn("Puppeteer PDF generation failed, using fallback:", puppeteerError);
      
      // Fallback: Generate HTML content for client-side PDF conversion
      const htmlContent = await generateSimplePDF(resume.processedResume);
      const textContent = generateTextResume(resume.processedResume);

      return NextResponse.json({
        success: true,
        fallback: true,
        htmlContent: htmlContent,
        textContent: textContent,
        fileName: `${resume.originalFileName.replace(/\.[^/.]+$/, "")}_optimized`,
        message: "PDF generation using fallback method",
      }, { status: 200 });
    }

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
    
    // Convert string to ObjectId
    const objectId = new ObjectId(resumeId);
    const resume = await resumesCollection.findOne({ _id: objectId } as any);
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
