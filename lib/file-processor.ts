export interface ExtractedText {
  text: string;
  fileName: string;
  fileType: 'pdf' | 'docx';
}

export const extractTextFromPDF = async (buffer: Buffer): Promise<string> => {
  try {
    // Use dynamic import to prevent build-time issues with pdf-parse
    // pdf-parse is a CommonJS module, so we need to handle both .default and direct export
    const pdfParseModule = await import('pdf-parse');
    const pdfParse = pdfParseModule.default || pdfParseModule;

    if (typeof pdfParse !== 'function') {
      console.error('pdf-parse module loaded but is not a function:', typeof pdfParse);
      throw new Error('pdf-parse module failed to load correctly');
    }

    console.log('Parsing PDF buffer of size:', buffer.length);
    const data = await pdfParse(buffer);
    console.log('PDF parsed successfully. Text length:', data.text?.length || 0, 'Pages:', data.numpages);

    if (!data.text || data.text.trim().length === 0) {
      console.warn('PDF parsed but no text was extracted. This might be a scanned/image-based PDF.');
      return 'No text could be extracted from this PDF. It may be a scanned document or contain only images.';
    }

    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const extractTextFromDOCX = async (buffer: Buffer): Promise<string> => {
  try {
    // Use dynamic import to prevent build-time issues
    const mammoth = await import('mammoth');
    console.log('Parsing DOCX buffer of size:', buffer.length);
    const result = await mammoth.extractRawText({ buffer });
    console.log('DOCX parsed successfully. Text length:', result.value?.length || 0);

    if (!result.value || result.value.trim().length === 0) {
      console.warn('DOCX parsed but no text was extracted.');
      return 'No text could be extracted from this DOCX file.';
    }

    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    throw new Error(`Failed to extract text from DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const extractTextFromFile = async (
  buffer: Buffer,
  fileName: string
): Promise<ExtractedText> => {
  const fileExtension = fileName.toLowerCase().split('.').pop();
  
  let text: string;
  let fileType: 'pdf' | 'docx';

  switch (fileExtension) {
    case 'pdf':
      text = await extractTextFromPDF(buffer);
      fileType = 'pdf';
      break;
    case 'docx':
      text = await extractTextFromDOCX(buffer);
      fileType = 'docx';
      break;
    default:
      throw new Error(`Unsupported file type: ${fileExtension}`);
  }

  return {
    text,
    fileName,
    fileType,
  };
};
