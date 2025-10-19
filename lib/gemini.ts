import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini API key - embedded directly
const GEMINI_API_KEY = 'AIzaSyDq3kph1f98FvpaGiigOY2p8mqHcFFe3OE';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export interface ResumeSection {
  title: string;
  content: string;
  relevance: number; // 0-1 score
}

export interface ProcessedResume {
  sections: ResumeSection[];
  summary: string;
  optimized: boolean;
}

export const processResumeWithAI = async (
  extractedText: string,
  jobDescription?: string
): Promise<ProcessedResume> => {
  const prompt = `
    Analyze this resume text and optimize it for ${jobDescription ? `the following job: ${jobDescription}` : 'general professional use'}.
    
    Resume Text:
    ${extractedText}
    
    Please:
    1. Identify and extract key sections (Experience, Education, Skills, etc.)
    2. Rate each section's relevance (0-1 scale)
    3. Remove or minimize irrelevant sections
    4. Rewrite content to be more impactful and ATS-friendly
    5. Provide a brief summary of the candidate
    
    Return your response as a JSON object with this structure:
    {
      "sections": [
        {
          "title": "Section Name",
          "content": "Optimized content...",
          "relevance": 0.9
        }
      ],
      "summary": "Brief candidate summary",
      "optimized": true
    }
  `;

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("Gemini raw response:", text);
    
    // Extract JSON from the response - handle markdown code blocks
    let jsonText = text;
    
    // Remove markdown code blocks if present
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim();
    }
    
    // Find JSON object
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No valid JSON found in AI response:", text);
      throw new Error('No valid JSON found in AI response');
    }
    
    const parsedResponse = JSON.parse(jsonMatch[0]);
    console.log("Parsed Gemini response:", parsedResponse);
    
    return parsedResponse;
  } catch (error) {
    console.error('Error processing resume with AI:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to process resume with AI: ${error.message}`);
    }
    throw new Error('Failed to process resume with AI');
  }
};
