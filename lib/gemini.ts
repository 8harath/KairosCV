import { GoogleGenerativeAI } from '@google/generative-ai';
import { StructuredResumeData } from './types';

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

export const extractStructuredDataFromResume = async (
  extractedText: string
): Promise<StructuredResumeData> => {
  const prompt = `
    Analyze this resume text and extract structured information. 
    
    Resume Text:
    ${extractedText}
    
    Extract the following information and return it as a JSON object:
    {
      "name": "Full Name (if available)",
      "phone": "Phone number (if available)",
      "email": "Email address (if available)",
      "location": "City, State/Country (if available)",
      "summary": "Professional summary or objective",
      "experience": [
        {
          "title": "Job title",
          "company": "Company name",
          "duration": "Start date - End date",
          "location": "Location (if mentioned)",
          "description": "Job description",
          "achievements": ["Key achievement 1", "Key achievement 2"]
        }
      ],
      "education": [
        {
          "degree": "Degree name (e.g., B.S. Computer Science)",
          "school": "School/University name",
          "year": "Year of graduation",
          "major": "Major/Specialization",
          "gpa": "GPA (if mentioned)"
        }
      ],
      "skills": ["Skill 1", "Skill 2", "Skill 3"],
      "languages": ["Language 1", "Language 2"],
      "certifications": [
        {
          "name": "Certification name",
          "issuer": "Issuing organization",
          "year": "Year obtained",
          "expiry": "Expiry date (if applicable)"
        }
      ],
      "projects": [
        {
          "name": "Project name",
          "description": "Project description",
          "technologies": ["Tech 1", "Tech 2"],
          "link": "Project URL (if available)"
        }
      ],
      "linkedIn": "LinkedIn profile URL",
      "portfolio": "Portfolio website URL"
    }
    
    Important rules:
    - Only include fields that are actually present in the resume
    - If a field is not found, omit it (don't use "N/A" or placeholder text)
    - Be accurate with dates and names
    - Extract as much detail as possible for experience and education sections
    - Return valid JSON only, no additional text
  `;

  try {
    console.log("Calling Gemini to extract structured data...");
    console.log("Text length:", extractedText.length);
    
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("Gemini extraction response length:", text.length);
    console.log("Gemini extraction response preview:", text.substring(0, 200));
    
    // Extract JSON from the response - handle markdown code blocks
    let jsonText = text;
    
    // Remove markdown code blocks if present
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim();
      console.log("Found markdown code block, extracted JSON");
    }
    
    // Find JSON object
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No valid JSON found in AI response. Response was:", text.substring(0, 500));
      // Return a minimal structured data object as fallback
      return {
        name: "Extracted from resume",
        summary: extractedText.substring(0, 300),
        skills: []
      } as StructuredResumeData;
    }
    
    console.log("Found JSON match, length:", jsonMatch[0].length);
    const parsedResponse: StructuredResumeData = JSON.parse(jsonMatch[0]);
    console.log("Parsed structured data successfully");
    
    return parsedResponse;
  } catch (error) {
    console.error('Error extracting structured data:', error);
    
    // Return a fallback structured data object instead of throwing
    console.log("Returning fallback structured data");
    return {
      name: "Extracted from resume",
      summary: extractedText.substring(0, 300),
      skills: []
    } as StructuredResumeData;
  }
};

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
    
    console.log("Gemini raw response length:", text.length);
    console.log("Gemini raw response preview:", text.substring(0, 200));
    
    // Extract JSON from the response - handle markdown code blocks
    let jsonText = text;
    
    // Remove markdown code blocks if present
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim();
      console.log("Found markdown code block");
    }
    
    // Find JSON object
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No valid JSON found in AI response");
      console.error("Response preview:", text.substring(0, 500));
      // Return fallback
      return {
        sections: [
          {
            title: "Summary",
            content: extractedText.substring(0, 500),
            relevance: 1.0
          }
        ],
        summary: extractedText.substring(0, 200),
        optimized: false
      };
    }
    
    const parsedResponse = JSON.parse(jsonMatch[0]);
    console.log("Parsed Gemini response successfully");
    
    return parsedResponse;
  } catch (error) {
    console.error('Error processing resume with AI:', error);
    
    // Return fallback instead of throwing
    return {
      sections: [
        {
          title: "Summary",
          content: extractedText.substring(0, 500),
          relevance: 1.0
        }
      ],
      summary: extractedText.substring(0, 200),
      optimized: false
    };
  }
};
