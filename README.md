# KairosCV

> AI-Powered Resume Optimization Platform

Transform any resume format into ATS-optimized PDFs using Google's Gemini AI and modern web technologies.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.17.0-brightgreen)](https://nodejs.org)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

KairosCV is an intelligent resume optimization platform that leverages AI to transform resumes into ATS-friendly formats. Upload your resume in PDF, DOCX, or TXT format, and get back a professionally formatted, keyword-optimized PDF designed to pass Applicant Tracking Systems.

### What Makes KairosCV Different?

- **AI-Powered Enhancement**: Uses Google Gemini to intelligently improve bullet points with metrics and impact-focused language
- **Heterogeneous Input Support**: Accepts resumes in any format or structure
- **ATS Optimization**: Outputs follow industry best practices for ATS compatibility
- **Real-Time Processing**: WebSocket-based progress updates for transparent processing
- **Zero-Setup Template**: Based on Jake's Resume template, proven effective for technical roles

---

## ✨ Features

### Core Functionality

- 📄 **Multi-Format Support**: Upload PDF, DOCX, or TXT resumes
- 🤖 **AI-Powered Parsing**: Intelligent extraction of resume sections regardless of formatting
- 🎯 **Content Enhancement**: Transform weak bullet points into achievement-focused statements
- 📊 **Skills Categorization**: Automatically organize technical skills into languages, frameworks, tools, and databases
- 📝 **Professional Summaries**: Generate compelling professional summaries
- 📋 **Consistent Output**: All resumes formatted using Jake's Resume template
- ⚡ **Real-Time Updates**: Live progress tracking via WebSocket
- 🔒 **Secure Processing**: Files automatically cleaned up after processing

### Technical Features

- **Type-Safe**: Full TypeScript implementation with strict typing
- **Modern Stack**: Built on Next.js 16 with React 19
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Accessible**: WCAG compliant UI components
- **Production Ready**: Comprehensive error handling and logging
- **Testable**: Full test coverage with Vitest

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 16.0 (App Router)
- **UI Library**: React 19.2
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod

### Backend

- **Runtime**: Node.js ≥ 18.17.0
- **API**: Next.js API Routes
- **WebSocket**: ws (native WebSocket implementation)
- **AI Service**: Google Gemini 2.5 Flash
- **File Parsing**:
  - PDF: pdf-parse
  - DOCX: mammoth
  - TXT: native fs
- **PDF Generation**: Puppeteer + pdf-lib

### Development Tools

- **Package Manager**: pnpm ≥ 8.0.0
- **Testing**: Vitest
- **Type Checking**: TypeScript
- **Code Quality**: ESLint

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18.17.0 or higher
- **pnpm**: Version 8.0.0 or higher
- **Gemini API Key**: Get yours at [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/KairosCV.git
   cd KairosCV
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Gemini API key:

   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Quick Test

1. Upload a sample resume (PDF, DOCX, or TXT)
2. Watch the real-time progress as AI processes your resume
3. Download the optimized PDF

---

## 📁 Project Structure

```
KairosCV/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── upload/              # File upload endpoint
│   │   ├── download/            # PDF download endpoint
│   │   ├── stream/              # WebSocket streaming
│   │   └── health/              # Health check
│   ├── page.tsx                 # Main application page
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
│
├── components/                   # React components
│   ├── file-uploader.tsx        # Drag-and-drop upload
│   ├── progress-tracker.tsx     # Real-time progress display
│   ├── results-panel.tsx        # Results and download
│   ├── header.tsx               # Application header
│   └── ui/                      # shadcn/ui components
│
├── lib/                         # Core business logic
│   ├── ai/
│   │   └── gemini-service.ts    # AI enhancement service
│   ├── parsers/
│   │   └── enhanced-parser.ts   # Resume parsing logic
│   ├── pdf/
│   │   └── pdf-generator.ts     # PDF generation
│   ├── templates/
│   │   └── template-renderer.ts # Template rendering
│   ├── config.ts                # App configuration
│   ├── constants.ts             # Constants and magic values
│   ├── types.ts                 # TypeScript type definitions
│   ├── file-storage.ts          # File management
│   ├── resume-processor.ts      # Main processing pipeline
│   └── utils.ts                 # Utility functions
│
├── hooks/                       # Custom React hooks
│   ├── use-resume-optimizer.ts  # Resume processing hook
│   └── use-websocket.ts         # WebSocket connection hook
│
├── __tests__/                   # Test files
│   └── lib/                     # Unit tests
│
├── public/                      # Static assets
├── uploads/                     # Uploaded files (gitignored)
│   └── generated/               # Generated PDFs
│
├── .env.example                 # Environment template
├── .env.local                   # Your environment (gitignored)
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── next.config.mjs              # Next.js config
└── README.md                    # This file
```

---

## 🏗️ Architecture

### Data Flow

```
1. File Upload
   ↓
2. WebSocket Connection Established
   ↓
3. Parse Resume (PDF/DOCX/TXT → Raw Text)
   ↓
4. AI Extraction (Raw Text → Structured Data)
   ↓
5. AI Enhancement (Improve Bullet Points + Generate Summary)
   ↓
6. PDF Generation (Structured Data → Formatted PDF)
   ↓
7. Download Ready
```

### Key Components

#### Resume Processing Pipeline

The `resume-processor.ts` module orchestrates the entire processing flow:

1. **File Parsing**: Extracts raw text from uploaded files
2. **AI Extraction**: Uses Gemini to structure the resume data
3. **AI Enhancement**: Improves content for ATS optimization
4. **PDF Generation**: Renders the optimized resume using Puppeteer

#### AI Service

The `gemini-service.ts` module handles all AI operations:

- **extractCompleteResumeData()**: Primary extraction method
- **enhanceExtractedData()**: Improves bullet points and generates summaries
- **extractSkills()**: Categorizes technical skills
- **generateSummary()**: Creates professional summaries

#### WebSocket Communication

Real-time progress updates are sent via WebSocket:

```typescript
{
  stage: "parsing" | "enhancing" | "generating" | "complete",
  progress: 0-100,
  message: "Human-readable status"
}
```

---

## ⚙️ Configuration

### Environment Variables

See `.env.example` for all available configuration options.

#### Required

- `GEMINI_API_KEY`: Your Google Gemini API key

#### Optional

- `NODE_ENV`: Environment mode (default: development)
- `PORT`: Server port (default: 3000)
- `GEMINI_MODEL`: AI model to use (default: gemini-2.5-flash)
- `ENABLE_AI_ENHANCEMENT`: Enable/disable AI features (default: true)
- `DEBUG_MODE`: Enable verbose logging (default: false)

### Configuration Files

- **`lib/config.ts`**: Centralized configuration management
- **`lib/constants.ts`**: Application constants and magic values
- **`lib/types.ts`**: TypeScript type definitions

---

## 💻 Development

### Available Scripts

```bash
# Development server with hot reload
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Run tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests once (CI mode)
pnpm test:run

# Lint code
pnpm lint
```

### Development Workflow

1. **Make changes** to your code
2. **Run tests** to ensure nothing breaks
3. **Test locally** with `pnpm dev`
4. **Build** with `pnpm build` to check for type errors
5. **Commit** your changes

### Code Style Guidelines

- Use **TypeScript** for all new code
- Follow **functional programming** principles where possible
- Add **JSDoc comments** for all exported functions
- Keep functions **small and focused**
- Use **meaningful variable names**
- Extract **magic numbers** to `constants.ts`
- Create **reusable types** in `types.ts`

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:ui

# Run tests once (for CI)
pnpm test:run
```

### Test Structure

Tests are located in `__tests__/` and mirror the `lib/` structure:

```
__tests__/
└── lib/
    ├── ai/
    ├── parsers/
    └── templates/
```

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest'
import { yourFunction } from '@/lib/your-module'

describe('yourFunction', () => {
  it('should do something', () => {
    const result = yourFunction('input')
    expect(result).toBe('expected output')
  })
})
```

---

## 🚢 Deployment

### Deployment Options

KairosCV can be deployed to any platform that supports Next.js:

- **Vercel** (Recommended)
- **Render**
- **Railway**
- **AWS Amplify**
- **Digital Ocean App Platform**

### Deploying to Vercel

1. **Push to GitHub**

   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Configure environment variables
   - Deploy

3. **Set Environment Variables**
   - Add `GEMINI_API_KEY` in Vercel dashboard
   - Configure any other optional variables

### Deploying to Render

See `RENDER_DEPLOYMENT.md` for detailed instructions.

### Environment-Specific Configuration

Set these environment variables in your hosting platform:

- `GEMINI_API_KEY`: Your API key
- `NODE_ENV`: Set to `production`
- Any other variables from `.env.example`

---

## 📚 API Documentation

### POST /api/upload

Upload a resume file.

**Request:**
```
Content-Type: multipart/form-data
Body: { file: File }
```

**Response:**
```json
{
  "file_id": "unique-file-id",
  "filename": "resume.pdf",
  "size": 12345,
  "message": "File uploaded successfully"
}
```

### WS /api/stream

WebSocket endpoint for processing updates.

**Messages:**
```json
{
  "type": "progress",
  "data": {
    "stage": "parsing",
    "progress": 50,
    "message": "Processing resume..."
  }
}
```

### GET /api/download/[fileId]

Download optimized PDF.

**Response:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="optimized_resume.pdf"
```

---

## 🤝 Contributing

We welcome contributions! See `CONTRIBUTING.md` for guidelines.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`pnpm test`)
5. Commit (`git commit -m 'Add amazing feature'`)
6. Push (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Jake's Resume Template**: The foundation for our PDF output
- **Google Gemini**: AI-powered content enhancement
- **shadcn/ui**: Beautiful, accessible UI components
- **Next.js Team**: Amazing framework and developer experience

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/KairosCV/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/KairosCV/discussions)
- **Documentation**: See `/docs` folder for additional guides

---

## 🗺️ Roadmap

### Current Version (v1.0)
- ✅ Multi-format resume parsing
- ✅ AI-powered enhancement
- ✅ PDF generation
- ✅ Real-time progress tracking

### Future Enhancements
- 🔄 Multiple template options
- 🎯 Job description matching
- 📊 ATS score calculator
- 👥 User authentication
- 💾 Resume history storage
- 🌐 Multi-language support
- 📱 Mobile app

---

<div align="center">

**Built with ❤️ by the KairosCV Team**

[Website](https://kairoscv.com) • [Documentation](./docs) • [Report Bug](https://github.com/yourusername/KairosCV/issues)

</div>
