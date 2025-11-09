import path from 'path';
import { fileURLToPath } from 'url';
import { extractTextFromPDF, cleanupFile } from '../services/pdfParser.js';
import { enhanceResume } from '../services/geminiService.js';
import { generatePDF } from '../services/pdfGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Process uploaded resume: extract, enhance, and generate new PDF
 */
export async function processResume(req, res) {
  let uploadedFilePath = null;
  let generatedFilePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    uploadedFilePath = req.file.path;

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
    generatedFilePath = path.join(__dirname, '../../uploads', outputFilename);

    await generatePDF(enhancedData, generatedFilePath);

    // Step 4: Clean up uploaded file
    await cleanupFile(uploadedFilePath);

    // Step 5: Return response with enhanced data and download link
    res.json({
      success: true,
      message: 'Resume enhanced successfully',
      data: enhancedData,
      downloadUrl: `/api/download/${outputFilename}`,
      filename: outputFilename
    });

  } catch (error) {
    console.error('Error processing resume:', error);

    // Clean up files on error
    if (uploadedFilePath) await cleanupFile(uploadedFilePath);
    if (generatedFilePath) await cleanupFile(generatedFilePath);

    res.status(500).json({
      error: 'Failed to process resume',
      message: error.message
    });
  }
}

/**
 * Download generated PDF
 */
export async function downloadResume(req, res) {
  try {
    const { filename } = req.params;

    // Security: prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    const filePath = path.join(__dirname, '../../uploads', filename);

    // Check if file exists
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        if (!res.headersSent) {
          res.status(404).json({ error: 'File not found' });
        }
      }
    });

  } catch (error) {
    console.error('Error in download:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
}
