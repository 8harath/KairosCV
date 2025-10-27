import { type NextRequest, NextResponse } from "next/server";
import { extractTextFromFile } from "@/lib/file-processor";
import { getDatabase } from "@/lib/mongodb";
import { ResumeDocument } from "@/lib/types";

export const maxDuration = 30; // 30 seconds for file processing (increased to 60 in production)

export async function POST(request: NextRequest) {
  try {
    console.log("=== Upload API called ===");
    
    // Parse form data
    let formData;
    try {
      formData = await request.formData();
    } catch (error) {
      console.error("Failed to parse form data:", error);
      return NextResponse.json({ 
        success: false,
        error: "Failed to parse form data",
        details: error instanceof Error ? error.message : "Unknown error"
      }, { status: 400 });
    }
    
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    console.log("File received:", file?.name, "Size:", file?.size);

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "Only PDF and DOCX files are supported" 
      }, { status: 400 });
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        error: "File size exceeds 10MB limit" 
      }, { status: 400 });
    }

    // Convert file to buffer
    console.log("Converting file to buffer...");
    let buffer;
    try {
      buffer = Buffer.from(await file.arrayBuffer());
      console.log("Buffer created successfully, size:", buffer.length);
    } catch (error) {
      console.error("Failed to convert file to buffer:", error);
      return NextResponse.json({ 
        success: false,
        error: "Failed to process file",
        details: error instanceof Error ? error.message : "Unknown error"
      }, { status: 500 });
    }

    // Extract text from file
    console.log("Extracting text from file...");
    let extractedData;
    try {
      extractedData = await extractTextFromFile(buffer, file.name);
      console.log("Extracted text length:", extractedData.text.length);
    } catch (error) {
      console.error("Failed to extract text from file:", error);
      return NextResponse.json({ 
        success: false,
        error: "Failed to extract text from file. The file may be corrupted or in an unsupported format.",
        details: error instanceof Error ? error.message : "Unknown error"
      }, { status: 500 });
    }

    // Skip AI processing during upload for faster response
    // AI processing will happen separately via /api/process
    console.log("Skipping Gemini AI processing for now - will process separately");
    const structuredData = {
      name: "Extracted from PDF",
      summary: extractedData.text.substring(0, 500) + "...",
      extractedText: extractedData.text
    };

    // Save to MongoDB
    console.log("Connecting to MongoDB...");
    let result;
    try {
      const db = await getDatabase();
      const resumesCollection = db.collection<ResumeDocument>("resumes");

      const resumeDoc: ResumeDocument = {
        userId: userId || "anonymous",
        originalFileName: file.name,
        extractedText: extractedData.text,
        structuredData: structuredData || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "uploaded",
      };

      console.log("Saving to MongoDB...");
      result = await resumesCollection.insertOne(resumeDoc);
      console.log("Saved with ID:", result.insertedId.toString());
    } catch (dbError) {
      console.error("Failed to save to MongoDB:", dbError);
      // Return the data even if DB save fails
      return NextResponse.json({
        success: true,
        resumeId: "temp-" + Date.now(),
        fileName: file.name,
        extractedText: extractedData.text.substring(0, 1000),
        structuredData: structuredData,
        message: "File processed successfully (not saved to database)",
        warning: dbError instanceof Error ? dbError.message : "Database error"
      }, { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const responseData = {
      success: true,
      resumeId: result.insertedId.toString(),
      fileName: file.name,
      extractedText: extractedData.text.substring(0, 1000), // Limit response size
      structuredData: structuredData,
      message: "File uploaded and processed successfully",
    };

    console.log("=== Returning success response ===");
    return NextResponse.json(responseData, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error("=== Upload error ===", error);
    const errorResponse = { 
      success: false,
      error: "Failed to process file",
      details: error instanceof Error ? error.message : "Unknown error"
    };
    
    console.log("=== Returning error response ===", errorResponse);
    return NextResponse.json(errorResponse, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
}
