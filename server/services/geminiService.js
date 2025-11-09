import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Enhance resume content using Gemini AI
 * @param {string} resumeText - Raw text extracted from resume
 * @returns {Promise<Object>} Structured and enhanced resume data
 */
export async function enhanceResume(resumeText) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are a professional resume writer. Analyze the following resume text and enhance it.

IMPORTANT INSTRUCTIONS:
1. Improve clarity, conciseness, and professionalism
2. Use strong action verbs and quantifiable achievements where possible
3. Fix grammar, spelling, and formatting issues
4. Do NOT fabricate information - only enhance what's provided
5. Return ONLY valid JSON (no markdown, no code blocks, no extra text)
6. Optimize for ATS (Applicant Tracking System) compatibility

Resume text:
${resumeText}

Return the enhanced resume in this EXACT JSON structure:
{
  "personalInfo": {
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "phone number",
    "location": "City, State",
    "linkedin": "LinkedIn URL or empty string",
    "github": "GitHub URL or empty string"
  },
  "summary": "Enhanced professional summary (2-3 sentences)",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Start Date - End Date",
      "description": "Brief role description",
      "bullets": ["Achievement 1", "Achievement 2"]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "School Name",
      "year": "Graduation Year",
      "gpa": "GPA if mentioned, otherwise empty string"
    }
  ],
  "skills": {
    "technical": ["skill1", "skill2"],
    "soft": ["skill1", "skill2"],
    "tools": ["tool1", "tool2"]
  },
  "projects": [
    {
      "name": "Project Name",
      "description": "Enhanced project description",
      "technologies": ["tech1", "tech2"],
      "link": "project link or empty string"
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up response - remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Parse JSON response
    const enhancedData = JSON.parse(text);

    return enhancedData;
  } catch (error) {
    console.error('Error enhancing resume with Gemini:', error);
    throw new Error('Failed to enhance resume: ' + error.message);
  }
}
