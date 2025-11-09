import { IncomingForm } from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import { extractTextFromPDF } from '../../server/services/pdfParser.js';
import { enhanceResume } from '../../server/services/geminiService.js';
import { generatePDF } from '../../server/services/pdfGenerator.js';

// Disable body parsing, we'll handle it ourselves
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let uploadedFilePath = null;
  let generatedFilePath = null;

  try {
    // Parse form data
    const form = new IncomingForm({
      uploadDir: '/tmp',
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Get the uploaded file
    const file = files.resume?.[0] || files.resume;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Validate file type
    if (!file.mimetype || file.mimetype !== 'application/pdf') {
      await fs.unlink(file.filepath);
      return res.status(400).json({ error: 'Only PDF files are allowed' });
    }

    uploadedFilePath = file.filepath;

    // Step 1: Extract text from PDF
    console.log('Extracting text from PDF...');
    const extractedText = await extractTextFromPDF(uploadedFilePath);

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('Could not extract text from PDF. The file may be empty or corrupted.');
    }

    // Step 2: Enhance with Gemini AI
    console.log('Enhancing resume with AI...');
    const enhancedData = await enhanceResume(extractedText);

    // Step 3: Generate new PDF
    console.log('Generating enhanced PDF...');
    const timestamp = Date.now();
    const outputFilename = `enhanced-resume-${timestamp}.pdf`;
    generatedFilePath = path.join('/tmp', outputFilename);

    await generatePDF(enhancedData, generatedFilePath);

    // Step 4: Read the generated PDF and convert to base64
    const pdfBuffer = await fs.readFile(generatedFilePath);
    const pdfBase64 = pdfBuffer.toString('base64');

    // Step 5: Clean up uploaded file
    if (uploadedFilePath) {
      try {
        await fs.unlink(uploadedFilePath);
      } catch (e) {
        console.error('Error cleaning up uploaded file:', e);
      }
    }

    // Step 6: Clean up generated file
    if (generatedFilePath) {
      try {
        await fs.unlink(generatedFilePath);
      } catch (e) {
        console.error('Error cleaning up generated file:', e);
      }
    }

    // Return response with enhanced data and PDF as base64
    return res.status(200).json({
      success: true,
      message: 'Resume enhanced successfully',
      data: enhancedData,
      pdfBase64: pdfBase64,
      filename: outputFilename
    });

  } catch (error) {
    console.error('Error processing resume:', error);

    // Clean up files on error
    if (uploadedFilePath) {
      try {
        await fs.unlink(uploadedFilePath);
      } catch (e) {
        console.error('Error cleaning up uploaded file:', e);
      }
    }
    if (generatedFilePath) {
      try {
        await fs.unlink(generatedFilePath);
      } catch (e) {
        console.error('Error cleaning up generated file:', e);
      }
    }

    return res.status(500).json({
      error: 'Failed to process resume',
      message: error.message
    });
  }
}
