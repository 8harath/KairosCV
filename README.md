# KairosCV

> **AI-Powered Resume Optimization Platform**

Transform any resume into an ATS-optimized, single-page PDF with intelligent content enhancement powered by Groq AI (with Google Gemini as fallback).

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Overview

**KairosCV** is a full-stack web application that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS). Upload your resume in PDF, DOCX, or TXT format and receive an AI-enhanced, professionally formatted PDF — guaranteed to fit on exactly one page.

### Key Features

- **Multi-Format Upload** — PDF, DOCX, and TXT files supported
- **AI-Powered Enhancement** — Groq (primary) or Google Gemini (fallback) rewrites and strengthens your content
- **Exact Single-Page Output** — Puppeteer scale fitting ensures the PDF always fills one full page with no clipping
- **Three Professional Templates** — Professional (LaTeX-inspired), Modern (blue accents), Classic (traditional serif)
- **Real-Time Progress** — Server-Sent Events stream live processing updates
- **User Accounts** — Supabase Auth with email/password login and signup
- **Resume Dashboard** — View and re-download all previously generated resumes
- **Profile & Avatars** — Settings page with 30+ DiceBear avatar styles
- **Fair Usage** — 3 free generations per rolling 24-hour window
- **Privacy-First** — Files are processed server-side and cleaned up after download

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19, Radix UI, Tailwind CSS |
| AI | Groq (primary) · Google Gemini (fallback) |
| PDF Generation | Puppeteer / puppeteer-core |
| Templates | Custom HTML + Handlebars |
| Auth & Storage | Supabase (Auth, Storage, Postgres) |
| Parsing | pdf-parse, mammoth, unpdf |
| Validation | Zod |
| Package Manager | pnpm |

---

## Prerequisites

- **Node.js** >= 18.17.0
- **pnpm** >= 8.0.0 — [install](https://pnpm.io/installation)
- **Groq API Key** — [get one](https://console.groq.com/) (or a Google Gemini key as fallback)
- **Supabase project** — [create one](https://supabase.com/) (optional for local no-auth mode)

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/8harath/KairosCV.git
cd KairosCV
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create `.env.local` in the project root:

```env
# ── AI ────────────────────────────────────────────
# Groq is the primary provider. Gemini is used as fallback if GROQ_API_KEY is absent.
GROQ_API_KEY=your-groq-api-key
GOOGLE_GEMINI_API_KEY=your-gemini-api-key   # optional fallback
GEMINI_MODEL=gemini-1.5-flash
GEMINI_TEMPERATURE=0.3
GEMINI_MAX_TOKENS=2048

# ── App ───────────────────────────────────────────
NODE_ENV=development
MAX_FILE_SIZE=5242880
UPLOAD_DIR=uploads

# ── Auth / Trial limits ───────────────────────────
# Set DISABLE_AUTH=true to skip login for local development
DISABLE_AUTH=true
NEXT_PUBLIC_DISABLE_AUTH=true
ENABLE_TRIAL_LIMIT=false
TRIAL_LIMIT=3
TRIAL_WINDOW_HOURS=24

# ── Supabase (required in production) ────────────
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_INPUT_BUCKET=resume-inputs
SUPABASE_OUTPUT_BUCKET=resume-outputs
SUPABASE_JSON_BUCKET=resume-json
USE_SUPABASE_STORAGE=false
USE_SUPABASE_TRIALS=false

# ── Puppeteer ─────────────────────────────────────
# Leave empty locally — the app auto-detects your Chrome installation.
PUPPETEER_EXECUTABLE_PATH=
# Required on Vercel — URL to a hosted Sparticuz Chromium pack.
CHROMIUM_BINARY_URL=
```

### 4. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Usage

### Workflow

1. **Upload** — drag and drop your resume (PDF, DOCX, or TXT, up to 5 MB)
2. **Watch** — real-time progress bar tracks parsing → AI enhancement → PDF generation
3. **Download** — get a professionally formatted, ATS-ready PDF

### Supported Input Formats

| Format | Extension | Max Size |
|--------|-----------|----------|
| PDF | `.pdf` | 5 MB |
| Word | `.docx` | 5 MB |
| Plain text | `.txt` | 5 MB |

### Resume Templates

| ID | Name | Style |
|----|------|-------|
| `professional` | Professional | LaTeX/CMU Serif — clean academic layout |
| `modern` | Modern | Inter sans-serif with blue accents |
| `classic` | Classic | Georgia serif with horizontal rules |

### What Gets Enhanced

- Contact information formatted for ATS parsing
- Work experience bullets rewritten with action verbs and metrics
- Skills organized into categories (Languages, Frameworks, Tools, Databases)
- Education structured correctly for ATS
- Optional summary, certifications, awards, publications, volunteer work, and custom sections

---

## Project Structure

```
KairosCV/
├── app/
│   ├── api/
│   │   ├── upload/route.ts          # File upload
│   │   ├── stream/[fileId]/route.ts # SSE progress
│   │   ├── download/[fileId]/route.ts
│   │   ├── json/[fileId]/route.ts   # Parsed resume JSON
│   │   ├── resume/[id]/route.ts     # Saved resume management
│   │   ├── profile/route.ts         # User profile API
│   │   └── health/route.ts
│   ├── auth/                        # Login / signup / callback
│   ├── dashboard/                   # Resume history
│   ├── optimize/                    # Main upload & processing UI
│   ├── settings/                    # Profile & avatar settings
│   ├── contact/                     # Contact form (EmailJS)
│   └── layout.tsx / page.tsx
├── lib/
│   ├── ai/                          # Gemini service, field classification
│   ├── parsers/                     # PDF, DOCX, TXT enhanced parsers
│   ├── pdf/
│   │   └── pdf-generator.ts         # Puppeteer PDF generation + scale fitting
│   ├── templates/
│   │   ├── jakes-resume-improved.html  # Professional template
│   │   ├── modern.html
│   │   ├── classic.html
│   │   └── template-renderer.ts
│   ├── schemas/resume-schema.ts     # Zod resume schema
│   ├── storage/                     # Supabase + local file storage
│   ├── supabase/                    # Supabase client helpers
│   ├── trials/                      # Usage limiting logic
│   └── resume-processor.ts          # Main processing pipeline
├── components/                      # React UI components
│   ├── file-uploader.tsx
│   ├── progress-tracker.tsx
│   ├── results-panel.tsx
│   ├── header.tsx / navigation.tsx
│   └── ...
└── __tests__/                       # Vitest unit tests
```

---

## Development

### Scripts

```bash
pnpm dev          # Development server (http://localhost:3000)
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # ESLint
pnpm test         # Vitest (watch mode)
pnpm test:run     # Vitest (CI / single run)
pnpm test:ui      # Vitest with browser UI
npx tsc --noEmit  # Type checking
```

---

## Deployment

### Render.com

1. Create a **Web Service** and connect your GitHub repo
2. **Build command:** `pnpm install && pnpm build`
3. **Start command:** `pnpm start`
4. Add environment variables in the Render dashboard (see `.env.local` above)
5. Set `PUPPETEER_EXECUTABLE_PATH=/opt/render/.cache/puppeteer/chrome`

See [docs/RENDER_DEPLOYMENT.md](docs/RENDER_DEPLOYMENT.md) for full instructions.

### Vercel

1. Set Node.js runtime to **20 or 22**
2. Set `CHROMIUM_BINARY_URL` to a hosted [Sparticuz Chromium](https://github.com/Sparticuz/chromium) pack URL
3. Leave `PUPPETEER_EXECUTABLE_PATH` empty — the app detects the Vercel environment automatically
4. Deploy the `main` branch

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for full instructions.

---

## Architecture

### Processing Pipeline

```
Upload (PDF / DOCX / TXT)
        │
        ▼
File Validation  ──────────────────────────────┐
        │                                      │
        ▼                                   SSE events
Parse → Extract Sections                    streamed to
        │                                   the browser
        ▼
Gemini AI Enhancement
        │
        ▼
HTML Template Rendering  (Professional / Modern / Classic)
        │
        ▼
Puppeteer PDF Generation
  ├── Viewport set to 720 px (print content width)
  ├── Measure scrollHeight
  ├── Compute scale = 960 px / scrollHeight
  └── Generate PDF — always exactly one page
        │
        ▼
Download link returned
```

---

## Security

- File type validated with magic-number checks (not just extension)
- All uploaded content is sanitized before HTML rendering (XSS prevention)
- 5 MB upload limit enforced on both client and server
- Temporary files cleaned up after download or expiry
- API keys stored in environment variables — never in source code
- Supabase Row Level Security for per-user data isolation

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit using [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat(pdf): add landscape template option
   fix(parser): handle empty education section
   ```
4. Push and open a Pull Request against `main`

**Scopes:** `parser`, `ai`, `pdf`, `ui`, `api`, `auth`, `deploy`

---

## Documentation

Additional guides are in the [`docs/`](docs/) directory:

| File | Description |
|------|-------------|
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Vercel deployment guide |
| [RENDER_DEPLOYMENT.md](docs/RENDER_DEPLOYMENT.md) | Render.com deployment guide |
| [SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) | Supabase project setup |
| [EMAILJS_SETUP.md](docs/EMAILJS_SETUP.md) | Contact form (EmailJS) setup |
| [TESTING_GUIDE.md](docs/TESTING_GUIDE.md) | Running and writing tests |
| [TEST_COVERAGE.md](docs/TEST_COVERAGE.md) | Test coverage reference |
| [EXTRACTION_PIPELINE.md](docs/EXTRACTION_PIPELINE.md) | Resume parsing pipeline deep-dive |
| [EDGE_CASES_HANDLED.md](docs/EDGE_CASES_HANDLED.md) | Known edge cases and how they are handled |

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Acknowledgments

- [Jake's Resume](https://github.com/jakegut/resume) — inspiration for the Professional template design
- [Groq](https://groq.com/) — fast AI inference for content enhancement
- [Google Gemini](https://ai.google.dev/) — AI fallback provider
- [Sparticuz Chromium](https://github.com/Sparticuz/chromium) — serverless Chromium for PDF generation
- [Supabase](https://supabase.com/) — auth and storage

---

<div align="center">

**Made with ❤️ by developers, for job seekers**

[Report Bug](https://github.com/8harath/KairosCV/issues) · [Request Feature](https://github.com/8harath/KairosCV/issues)

</div>
