import { type NextRequest, NextResponse } from "next/server";
import { extractTextFromFile } from "@/lib/file-processor";
import { extractStructuredDataFromResume } from "@/lib/gemini";
import { getDatabase } from "@/lib/mongodb";
import { ResumeDocument } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    console.log("Upload API called");
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    console.log("File received:", file?.name, "Size:", file?.size);

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
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
    const buffer = Buffer.from(await file.arrayBuffer());

    // Extract text from file
    console.log("Extracting text from file...");
    const extractedData = await extractTextFromFile(buffer, file.name);
    console.log("Extracted text length:", extractedData.text.length);

    // Extract structured data using Gemini
    console.log("Extracting structured data with Gemini...");
    let structuredData = null;
    try {
      structuredData = await extractStructuredDataFromResume(extractedData.text);
      console.log("Structured data extracted successfully");
    } catch (geminiError) {
      console.error("Failed to extract structured data with Gemini:", geminiError);
      // Continue without structured data - the text extraction was successful
    }

    // Save to MongoDB
    console.log("Connecting to MongoDB...");
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
    const result = await resumesCollection.insertOne(resumeDoc);
    console.log("Saved with ID:", result.insertedId.toString());

    return NextResponse.json({
      success: true,
      resumeId: result.insertedId.toString(),
      fileName: file.name,
      extractedText: extractedData.text,
      structuredData: structuredData,
      message: "File uploaded and processed successfully",
    }, { status: 200 });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ 
      error: "Failed to process file",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
