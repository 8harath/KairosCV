# KairosCV

> **AI-Powered Resume Optimization Platform**

Transform any resume format into ATS-optimized PDFs with intelligent content enhancement powered by Google Gemini AI.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Overview

**KairosCV** is a modern web application that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS). Upload your resume in any format (PDF, DOCX, or TXT), and let AI enhance your content with professional formatting and ATS-friendly design.

### Key Features

- **Multi-Format Support** - Upload PDF, DOCX, or TXT files
- **AI-Powered Enhancement** - Google Gemini 1.5 Flash optimizes your content
- **Real-Time Processing** - Server-Sent Events (SSE) provide live progress updates
- **ATS-Optimized Output** - Professional templates designed for maximum parsing success
- **Instant Preview** - View and download your optimized resume immediately
- **Privacy-First** - All processing happens server-side; files are automatically cleaned up

---

## Tech Stack

### Core Framework
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - Latest React with concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development

### AI & Processing
- **[Google Gemini API](https://ai.google.dev/)** - AI-powered content enhancement
- **[Puppeteer](https://pptr.dev/)** - Headless Chrome for PDF generation
- **[Handlebars](https://handlebarsjs.com/)** - HTML template rendering

### Parsing & Validation
- **[pdf-parse](https://www.npmjs.com/package/pdf-parse)** - PDF text extraction
- **[mammoth](https://www.npmjs.com/package/mammoth)** - DOCX to HTML conversion
- **[Zod](https://zod.dev/)** - Schema validation and type inference

### UI Components
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library

### Testing & Dev Tools
- **[Vitest](https://vitest.dev/)** - Fast unit testing framework
- **[pnpm](https://pnpm.io/)** - Efficient package management

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.17.0 ([Download](https://nodejs.org/))
- **pnpm** >= 8.0.0 ([Install](https://pnpm.io/installation))
- **Google Gemini API Key** ([Get one](https://ai.google.dev/))

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/8harath/KairosCV.git
cd KairosCV
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Copy the example environment file and add your API keys:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Google Gemini API key:

```env
# Google Gemini API Configuration
GOOGLE_GEMINI_API_KEY=your-actual-api-key-here
GEMINI_MODEL=gemini-1.5-flash
GEMINI_TEMPERATURE=0.3
GEMINI_MAX_TOKENS=2048

# Application Settings
NODE_ENV=development
MAX_FILE_SIZE=5242880  # 5MB
UPLOAD_DIR=uploads
OUTPUT_DIR=outputs

# Puppeteer Configuration
PUPPETEER_EXECUTABLE_PATH=
PUPPETEER_HEADLESS=true
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

### Basic Workflow

1. **Upload Resume** - Drag and drop or click to select your resume file (PDF, DOCX, or TXT)
2. **AI Processing** - Watch real-time progress as AI analyzes and enhances your content
3. **Preview & Download** - View the optimized resume and download as PDF

### Supported File Formats

| Format | Extension | Max Size |
|--------|-----------|----------|
| PDF    | `.pdf`    | 5 MB     |
| Word   | `.docx`   | 5 MB     |
| Text   | `.txt`    | 5 MB     |

### What Gets Enhanced?

- **Contact Information** - Formatted for ATS parsing
- **Professional Summary** - AI-optimized for impact
- **Work Experience** - Bullet points enhanced with action verbs and metrics
- **Skills** - Organized and categorized
- **Education** - Properly structured for ATS
- **Formatting** - Clean, professional layout with optimal spacing

---

## Project Structure

```
KairosCV/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── upload/route.ts       # File upload endpoint
│   │   ├── stream/[fileId]/      # SSE progress streaming
│   │   ├── download/[fileId]/    # PDF download
│   │   └── health/route.ts       # Health check
│   ├── page.tsx                  # Main UI
│   └── layout.tsx                # App layout
├── lib/                          # Core Business Logic
│   ├── ai/                       # Gemini API integration
│   ├── parsers/                  # Resume file parsers
│   ├── pdf/                      # PDF generation with Puppeteer
│   ├── schemas/                  # Zod validation schemas
│   ├── templates/                # Handlebars HTML templates
│   ├── resume-processor.ts       # Main processing pipeline
│   └── file-storage.ts           # File I/O utilities
├── components/                   # React UI Components
│   ├── file-uploader.tsx         # Drag-and-drop uploader
│   ├── progress-tracker.tsx      # Real-time progress display
│   ├── results-panel.tsx         # Preview and download UI
│   └── ...
├── hooks/                        # Custom React Hooks
│   └── use-resume-optimizer.ts   # Main processing hook
├── __tests__/                    # Unit & Integration Tests
├── test-files/                   # Sample resumes for testing
├── public/                       # Static assets
└── uploads/                      # Temporary file storage (gitignored)
```

---

## Development

### Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
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

# Type checking
npx tsc --noEmit
```

### Code Quality Standards

This project follows strict TypeScript and Next.js best practices:

- **Type Safety** - All functions have explicit type definitions
- **Error Handling** - Comprehensive try-catch with user-friendly messages
- **Performance** - Optimized for low memory usage (<400MB)
- **Security** - Input validation, file sanitization, no secrets in code
- **Accessibility** - WCAG-compliant UI components

### Adding a New Feature

1. Read existing code patterns in the relevant directory
2. Define TypeScript types/interfaces first
3. Implement with proper error handling
4. Add unit tests
5. Update documentation

See [CLAUDE.md](CLAUDE.md) for detailed development guidelines.

---

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test lib/parsers/pdf-parser.test.ts

# Run with coverage
pnpm test --coverage

# Run tests in watch mode
pnpm test --watch
```

### Test Coverage

Current test coverage includes:
- **Parsers** - PDF, DOCX, TXT extraction
- **Validation** - File type, size, schema validation
- **Processing** - Resume section detection and extraction
- **Templates** - HTML rendering with Handlebars
- **Error Scenarios** - Malformed files, network failures, AI API errors

See [TESTING_GUIDE.md](TESTING_GUIDE.md) and [TEST_COVERAGE.md](TEST_COVERAGE.md) for details.

---

## Deployment

### Deploy to Render.com

This project is optimized for deployment on Render.com's free tier.

#### Prerequisites
- Render.com account ([Sign up](https://render.com/))
- GitHub repository connected to Render

#### Steps

1. **Create New Web Service** on Render dashboard
2. **Connect your GitHub repo** (KairosCV)
3. **Configure build settings:**
   - **Build Command:** `pnpm install && pnpm build`
   - **Start Command:** `pnpm start`
   - **Environment:** Node
4. **Add environment variables** in Render dashboard:
   ```
   GOOGLE_GEMINI_API_KEY=your-api-key
   NODE_ENV=production
   PUPPETEER_EXECUTABLE_PATH=/opt/render/.cache/puppeteer/chrome
   ```
5. **Deploy** - Render will automatically build and deploy

#### Performance on Free Tier
- Cold start: ~10-15 seconds
- Processing time: 30-60 seconds per resume
- Memory usage: ~350MB (within 512MB limit)

See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) for detailed instructions.

---

## Architecture

### Data Flow

```
┌─────────────┐
│ User Upload │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ File Validation │ (Type, size, magic numbers)
└──────┬──────────┘
       │
       ▼
┌──────────────┐
│ Parse Resume │ (PDF/DOCX/TXT → Text)
└──────┬───────┘
       │
       ▼
┌─────────────────┐
│ Extract Sections│ (Contact, Experience, Skills, etc.)
└──────┬──────────┘
       │
       ▼
┌───────────────────┐
│ AI Enhancement    │ (Gemini API)
└──────┬────────────┘
       │
       ▼
┌────────────────────┐
│ HTML Template      │ (Handlebars)
└──────┬─────────────┘
       │
       ▼
┌────────────────────┐
│ PDF Generation     │ (Puppeteer)
└──────┬─────────────┘
       │
       ▼
┌─────────────┐
│ Download PDF│
└─────────────┘

     ↑
     │ (SSE Progress Updates)
     └─────────────────────┐
```

### Why This Stack?

- **Next.js 16** - Server-side rendering, API routes, and excellent DX
- **TypeScript** - Catches errors at compile time, not production
- **Gemini API** - Fast, cost-effective AI with 1M token context
- **Puppeteer** - Industry-standard for high-quality PDF generation
- **Zod** - Runtime validation ensures data integrity

---

## Performance Targets

| Metric               | Target  | Status |
|---------------------|---------|--------|
| File Upload          | <2s     | ✅     |
| Parsing (PDF)        | <5s     | ✅     |
| AI Enhancement       | <30s    | ⏳     |
| PDF Generation       | <10s    | ⏳     |
| **Total Time**       | **<60s**| ⏳     |
| Memory Usage         | <400MB  | ⏳     |

---

## Roadmap

### MVP (Current)
- [x] Multi-format resume upload
- [x] Basic parsing (PDF, DOCX, TXT)
- [x] AI-powered content enhancement
- [x] Professional PDF generation
- [x] Real-time progress tracking
- [x] Render.com deployment

### Phase 2 (Next)
- [ ] Multiple resume templates (Harvard, Deedy, etc.)
- [ ] Custom template builder
- [ ] Resume scoring and feedback
- [ ] ATS compatibility checker
- [ ] Job description matching

### Phase 3 (Future)
- [ ] User accounts and history
- [ ] Resume version control
- [ ] Cover letter generation
- [ ] LinkedIn profile optimization
- [ ] Interview prep recommendations

---

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow existing code patterns
   - Add tests for new features
   - Update documentation
4. **Commit with conventional commits**
   ```bash
   git commit -m "feat(parser): add LinkedIn PDF support"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
**Scopes:** `parser`, `ai`, `pdf`, `ui`, `api`, `deploy`

See [CLAUDE.md](CLAUDE.md) for detailed contribution guidelines.

---

## Documentation

- **[CLAUDE.md](CLAUDE.md)** - AI agent performance optimization guide
- **[MVP_ROADMAP_AND_RISK_ANALYSIS.md](MVP_ROADMAP_AND_RISK_ANALYSIS.md)** - Product roadmap and risks
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - How to write and run tests
- **[TEST_COVERAGE.md](TEST_COVERAGE.md)** - Current test coverage report
- **[RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)** - Deployment instructions
- **[EDGE_CASES_HANDLED.md](EDGE_CASES_HANDLED.md)** - Edge case documentation

---

## Troubleshooting

### Common Issues

**1. Puppeteer fails to launch**
```bash
# Install Chromium dependencies (Linux)
sudo apt-get install -y chromium-browser
```

**2. "Module not found" errors**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
```

**3. Gemini API errors**
- Check your API key is valid
- Verify you're not hitting rate limits (60 requests/minute)
- Ensure GOOGLE_GEMINI_API_KEY is set correctly

**4. Memory issues during PDF generation**
- Enable browser pooling (already implemented)
- Reduce concurrent processing
- Monitor with `process.memoryUsage()`

---

## Security

### Reporting Vulnerabilities

If you discover a security vulnerability, please email **security@kairoscv.com** instead of using the issue tracker.

### Security Measures

- File type validation with magic number verification
- Input sanitization to prevent XSS
- Size limits on uploads (5MB max)
- Temporary file cleanup
- No secrets in source code
- Rate limiting on API endpoints

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **[Jake's Resume](https://github.com/jakegut/resume)** - Inspiration for LaTeX template design
- **[Google Gemini](https://ai.google.dev/)** - Powering AI enhancements
- **[Vercel](https://vercel.com/)** - Next.js framework creators
- **[Render.com](https://render.com/)** - Simple cloud hosting

---

## Contact

**Project Maintainer:** Bharath
**Repository:** [https://github.com/8harath/KairosCV](https://github.com/8harath/KairosCV)
**Issues:** [GitHub Issues](https://github.com/8harath/KairosCV/issues)

---

<div align="center">

**Made with ❤️ by developers, for job seekers**

[Website](https://kairoscv.onrender.com) • [Documentation](CLAUDE.md) • [Report Bug](https://github.com/8harath/KairosCV/issues) • [Request Feature](https://github.com/8harath/KairosCV/issues)

</div>
