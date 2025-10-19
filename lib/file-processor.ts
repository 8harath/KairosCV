export interface ExtractedText {
  text: string;
  fileName: string;
  fileType: 'pdf' | 'docx';
}

export const extractTextFromPDF = async (buffer: Buffer): Promise<string> => {
  try {
    // Use dynamic import to prevent build-time issues with pdf-parse
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

export const extractTextFromDOCX = async (buffer: Buffer): Promise<string> => {
  try {
    // Use dynamic import to prevent build-time issues
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw new Error('Failed to extract text from DOCX');
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
