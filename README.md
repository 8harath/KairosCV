# KairosCV - AI-Powered Resume Optimization Platform

> Transform any resume into ATS-optimized, professional PDFs using LaTeX and AI

[![Status](https://img.shields.io/badge/status-active%20development-green)](https://github.com/yourusername/KairosCV)
[![Backend](https://img.shields.io/badge/backend-FastAPI%20%2B%20LaTeX-blue)](./Backend_Modified)
[![Frontend](https://img.shields.io/badge/frontend-Next.js%2016-black)](./app)
[![AI](https://img.shields.io/badge/AI-Groq%20%2B%20Gemini-purple)](./lib/ai)

## 🎯 Project Overview

KairosCV is a hybrid full-stack application that leverages both Next.js (frontend) and FastAPI (backend) to deliver professional resume optimization:

- **Upload** any resume format (PDF, DOCX, TXT)
- **Extract** content using AI-powered parsers
- **Enhance** with AI optimization (Groq + Gemini)
- **Generate** professional LaTeX PDFs (Jake's Resume template)
- **Download** ATS-optimized resumes in seconds

## 🏗️ Architecture

### Technology Stack

**Frontend (Next.js 16):**
- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **UI:** React 19 + Radix UI + Tailwind CSS
- **AI (Parsing):** Google Gemini 1.5 Flash
- **Validation:** Zod schemas

**Backend (Python) - Main Backend:**
- **Framework:** FastAPI
- **Language:** Python 3.11+
- **AI (Enhancement):** Groq (llama-3.3-70b-versatile via LangChain)
- **PDF Generation:** LaTeX (pdflatex) with Jake's Resume template
- **Data Mapping:** Direct template injection (no AI hallucination)
- **Validation:** Pydantic models

### Data Flow

```
User Upload
    ↓
Next.js API (File Upload)
    ↓
Enhanced Parser (Gemini AI)
    ↓
Data Transformation
    ↓
Python Backend API (/convert-json-to-latex)
    ↓
Groq AI Enhancement
    ↓
LaTeX Template Injection
    ↓
pdflatex Compilation
    ↓
Professional PDF Download
```

**Fallback:** If Python backend is unavailable, system falls back to Puppeteer-based PDF generation.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (for frontend)
- **Python** 3.11+ (for backend)
- **pnpm** (package manager)
- **LaTeX** (texlive for PDF compilation)
- **API Keys:** Groq API key (free), Gemini API key (free)

### Installation

#### 1. Clone Repository

```bash
git clone https://github.com/yourusername/KairosCV.git
cd KairosCV
```

#### 2. Frontend Setup

```bash
# Install dependencies
pnpm install

# Create environment file
cp .env.example .env.local

# Add your Gemini API key to .env.local
echo "GEMINI_API_KEY=your-gemini-key" >> .env.local
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:8080" >> .env.local
echo "NEXT_PUBLIC_USE_PYTHON_BACKEND=true" >> .env.local

# Run development server
pnpm dev
```

Frontend will be available at `http://localhost:3000`

#### 3. Backend Setup

```bash
# Navigate to backend directory
cd Backend_Modified

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Add your Groq API key
echo "GROQ_API_KEY=your-groq-key" >> .env
echo "GROQ_MODEL=llama-3.3-70b-versatile" >> .env

# Install LaTeX (if not already installed)
# Ubuntu/Debian:
sudo apt-get update && sudo apt-get install texlive-latex-base texlive-fonts-recommended texlive-latex-extra

# macOS:
brew install --cask basictex

# Run backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8080
```

Backend will be available at `http://localhost:8080`

### Get API Keys

1. **Groq API Key** (Free):
   - Go to https://console.groq.com
   - Sign up (no credit card required)
   - Create API key

2. **Gemini API Key** (Free):
   - Go to https://ai.google.dev/
   - Get API key from Google AI Studio

## 📁 Project Structure

```
KairosCV/
├── app/                          # Next.js Frontend
│   ├── api/
│   │   ├── upload/route.ts       # File upload endpoint
│   │   ├── stream/[fileId]/route.ts  # SSE progress streaming
│   │   └── download/[fileId]/route.ts # PDF download
│   └── page.tsx                  # Main UI
├── lib/                          # Frontend Libraries
│   ├── resume-processor.ts       # Main processing pipeline
│   ├── parsers/                  # PDF/DOCX/TXT parsers
│   ├── ai/gemini-service.ts      # Gemini AI integration
│   ├── services/backend-api.ts   # Backend API client
│   ├── mappers/                  # Data transformers
│   └── schemas/                  # Zod validation schemas
├── Backend_Modified/             # **MAIN BACKEND (Python)**
│   ├── main.py                   # FastAPI application
│   ├── resume_processor.py       # LangChain + Groq integration
│   ├── latex_data_mapper.py      # Direct LaTeX template injection
│   ├── latex_converter.py        # PDF compilation (pdflatex)
│   ├── models.py                 # Pydantic schemas
│   ├── prompts.py                # LangChain prompts
│   ├── requirements.txt          # Python dependencies
│   ├── Dockerfile                # Docker configuration
│   └── .env                      # Environment variables
├── components/                   # React UI components
├── uploads/                      # Temporary file storage
├── render.yaml                   # Multi-service deployment config
└── README.md                     # This file
```

## 🧪 Testing

### Frontend Tests

```bash
pnpm test
pnpm test:ui  # Vitest UI
```

### Backend Tests

```bash
cd Backend_Modified
pytest
```

### End-to-End Test

1. Start both frontend and backend
2. Upload a test resume at `http://localhost:3000`
3. Verify PDF generation completes
4. Download and inspect the PDF

## 🚢 Deployment

### Deploy to Render.com

The application is configured for multi-service deployment on Render:

1. **Fork/Clone** this repository to your GitHub
2. **Create Render Account** at https://render.com
3. **Connect Repository** in Render dashboard
4. **Add Environment Variables:**
   - Frontend: `GEMINI_API_KEY`, `NEXT_PUBLIC_BACKEND_URL`
   - Backend: `GROQ_API_KEY`
5. **Deploy** using `render.yaml` configuration

The `render.yaml` file configures:
- Python backend (Docker runtime with LaTeX)
- Next.js frontend
- Environment variables
- Health checks

### Manual Deployment

See detailed deployment instructions in:
- `30_DAY_IMPLEMENTATION_PLAN.md` (Days 22-30)
- `CLAUDE.md` (Deployment section)

## 📊 Performance

| Metric | Target | Current Status |
|--------|--------|----------------|
| PDF Generation | <10s | ✅ <1s (LaTeX) |
| File Upload | <2s | ✅ |
| AI Enhancement | <30s | ✅ |
| Total Time | <60s | ✅ <15s |
| Memory Usage | <400MB | ✅ |

## 💰 Cost Analysis

| Component | Cost | Notes |
|-----------|------|-------|
| Groq API | **$0/month** | Free tier (generous limits) |
| Gemini API | **$0/month** | Free tier |
| Render.com | **$0-7/month** | Free tier or Starter plan |
| **Total** | **$0-7/month** | Much cheaper than Vertex AI! |

## 🎯 Current Status (Day 8/30)

- ✅ **Week 1 Complete:** Backend setup, LaTeX templates, Groq integration
- 🔄 **Week 2:** Schema alignment, frontend integration
- ⏳ **Week 3:** Full integration testing
- ⏳ **Week 4:** Deployment and launch

See `PROGRESS_LOG.md` for detailed progress tracking.

## 📖 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - AI agent optimization guide
- **[30_DAY_IMPLEMENTATION_PLAN.md](./30_DAY_IMPLEMENTATION_PLAN.md)** - Complete development roadmap
- **[Backend_Modified/DAY_8_COMPLETION_REPORT.md](./Backend_Modified/DAY_8_COMPLETION_REPORT.md)** - Latest backend progress
- **[Backend_Modified/PROGRESS_LOG.md](./Backend_Modified/PROGRESS_LOG.md)** - Daily progress log

## 🤝 Contributing

This is currently a 3-person team project. Branch naming convention:

- `main` - Production-ready code
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `backend-integration-no-auth` - Current active branch

## 📝 License

[Add your license here]

## 🙏 Acknowledgments

- **Jake's Resume** - LaTeX template inspiration: https://github.com/jakegut/resume
- **Groq** - Fast, affordable LLM API
- **Google Gemini** - Resume parsing AI
- **LangChain** - AI orchestration framework

## 📞 Support

For issues or questions:
1. Check existing documentation
2. Review `CLAUDE.md` guide
3. Open an issue on GitHub
4. Contact the development team

---

**Last Updated:** November 26, 2025
**Version:** 1.0.0
**Status:** Active Development
**Git Account:** Verified (8harath)
