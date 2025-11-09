# Kai - AI-Powered Resume Enhancement Tool

Transform mediocre resumes into professional, polished documents using AI.

## Overview

Kai is a web-based application that takes poorly formatted resumes, extracts the information, uses Google's Gemini API to enhance and rephrase the content, and outputs a professionally formatted resume available for download as a PDF.

## Tech Stack

### Frontend
- **React** with Vite
- **Tailwind CSS** for styling
- Modern, responsive UI

### Backend
- **Node.js** with Express
- **Multer** for file upload handling
- **pdf-parse** for PDF text extraction
- **pdfkit** or **puppeteer** for PDF generation

### AI Integration
- **Google Gemini API** for content enhancement

## Features (MVP)

1. **Resume Upload** - Accept PDF file uploads
2. **Text Extraction** - Parse PDF and extract resume content
3. **AI Enhancement** - Use Gemini API to improve and rephrase content
4. **Format Application** - Apply clean, professional resume template
5. **Preview** - Show formatted resume before download
6. **PDF Download** - Generate and download enhanced resume as PDF

## Project Structure

```
kai/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Main application pages
│   │   ├── services/      # API communication
│   │   └── utils/         # Helper functions
│   ├── public/            # Static assets
│   └── package.json
├── server/                # Node.js backend
│   ├── routes/           # API endpoints
│   ├── controllers/      # Business logic
│   ├── services/         # AI & PDF processing services
│   ├── middleware/       # Upload, error handling
│   ├── utils/            # Helper functions
│   └── package.json
├── uploads/              # Temporary upload storage
├── README.md
└── .env.example
```

## Implementation Plan

### Phase 1: Project Setup ✓
- [x] Initialize project structure
- [ ] Initialize React app with Vite
- [ ] Set up Express server with CORS
- [ ] Configure environment variables
- [ ] Install dependencies

### Phase 2: File Upload & Parsing
- [ ] Create upload endpoint with multer
- [ ] Implement PDF text extraction
- [ ] Add error handling for unsupported files
- [ ] Test with sample resumes

### Phase 3: Gemini Integration
- [ ] Set up Gemini API client
- [ ] Create prompts for resume enhancement
- [ ] Parse AI responses into structured data
- [ ] Handle API errors and rate limits

### Phase 4: Resume Formatting
- [ ] Design clean resume template (HTML/CSS)
- [ ] Map extracted + enhanced data to template
- [ ] Implement preview functionality
- [ ] Make template responsive

### Phase 5: PDF Generation
- [ ] Convert formatted HTML to PDF
- [ ] Add download functionality
- [ ] Clean up temporary files
- [ ] Optimize PDF quality

### Phase 6: Polish & Testing
- [ ] Add loading states and user feedback
- [ ] Implement comprehensive error handling
- [ ] Add input validation
- [ ] Test complete user flow
- [ ] Fix bugs and edge cases

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload PDF resume |
| POST | `/api/enhance` | Send text to Gemini, get enhanced version |
| POST | `/api/generate-pdf` | Generate formatted PDF |
| GET | `/api/download/:id` | Download generated PDF |

## Resume Data Structure

```javascript
{
  personalInfo: {
    name: String,
    email: String,
    phone: String,
    location: String,
    linkedin: String,
    github: String
  },
  summary: String,
  experience: [{
    title: String,
    company: String,
    duration: String,
    description: String,
    bullets: [String]
  }],
  education: [{
    degree: String,
    institution: String,
    year: String,
    gpa: String
  }],
  skills: {
    technical: [String],
    soft: [String],
    tools: [String]
  },
  projects: [{
    name: String,
    description: String,
    technologies: [String],
    link: String
  }]
}
```

## Gemini Prompt Strategy

The AI will be instructed to:
- Improve clarity and conciseness
- Use strong action verbs and quantifiable achievements
- Fix grammar, spelling, and formatting issues
- Maintain truthfulness (no fabrication of experience)
- Return structured JSON matching our data format
- Optimize for ATS compatibility

## Environment Variables

Create a `.env` file in the server directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
NODE_ENV=development
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=application/pdf
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository
```bash
cd kai
```

2. Install server dependencies
```bash
cd server
npm install
```

3. Install client dependencies
```bash
cd ../client
npm install
```

4. Set up environment variables
```bash
cd ../server
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

5. Start the development servers

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

## Future Enhancements (Post-MVP)

- [ ] Support for DOCX and plain text input
- [ ] Multiple resume templates to choose from
- [ ] ATS (Applicant Tracking System) score and optimization
- [ ] Resume analysis and feedback
- [ ] User accounts to save multiple versions
- [ ] Cover letter generation
- [ ] Export to multiple formats (LaTeX, DOCX, etc.)
- [ ] LinkedIn profile integration
- [ ] Batch processing for multiple resumes

## Development Notes

### Key Libraries to Install

**Client:**
```bash
npm install react react-dom
npm install -D vite @vitejs/plugin-react tailwindcss postcss autoprefixer
```

**Server:**
```bash
npm install express cors dotenv multer pdf-parse @google/generative-ai
npm install -D nodemon
```

**PDF Generation (choose one):**
- Option 1: `npm install pdfkit` (lighter, programmatic)
- Option 2: `npm install puppeteer` (heavier, HTML to PDF)

## Contributing

This is a capstone project. Contributions, suggestions, and feedback are welcome!

## License

MIT License

---

**Built with ❤️ for making job applications easier**
