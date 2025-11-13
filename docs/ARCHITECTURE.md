# KairosCV Architecture

This document provides a detailed technical overview of the KairosCV system architecture, design decisions, and data flow.

## 📋 Table of Contents

- [System Overview](#system-overview)
- [Technology Stack](#technology-stack)
- [Architecture Patterns](#architecture-patterns)
- [Data Flow](#data-flow)
- [Component Architecture](#component-architecture)
- [API Design](#api-design)
- [AI Integration](#ai-integration)
- [File Management](#file-management)
- [Performance Considerations](#performance-considerations)
- [Security](#security)
- [Scalability](#scalability)

---

## 🎯 System Overview

KairosCV is a full-stack web application built with Next.js that transforms resumes into ATS-optimized PDFs using AI. The system follows a modern, serverless architecture with real-time communication via WebSockets.

### Key Characteristics

- **Server-Side Rendering**: Next.js App Router with React Server Components
- **API Routes**: Serverless functions handling file upload, processing, and download
- **Real-Time Updates**: WebSocket-based progress tracking
- **AI-Powered**: Google Gemini API for intelligent content enhancement
- **Type-Safe**: Full TypeScript implementation with strict mode
- **Stateless**: No database required for MVP (filesystem-based storage)

---

## 🛠️ Technology Stack

### Frontend Layer

```
┌─────────────────────────────────────┐
│         Next.js 16 (App Router)     │
│  ┌───────────────────────────────┐  │
│  │    React 19 Components        │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │  Radix UI + shadcn/ui   │  │  │
│  │  │  Tailwind CSS 4.1       │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Key Libraries:**
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **Lucide React**: Icon library
- **WebSocket (native)**: Real-time communication

### Backend Layer

```
┌─────────────────────────────────────┐
│      Next.js API Routes             │
│  ┌───────────────────────────────┐  │
│  │   Business Logic Layer        │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │  Resume Processor       │  │  │
│  │  │  AI Service (Gemini)    │  │  │
│  │  │  PDF Generator          │  │  │
│  │  │  File Storage           │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Key Libraries:**
- **pdf-parse**: PDF text extraction
- **mammoth**: DOCX text extraction
- **Puppeteer**: PDF generation
- **Google Generative AI**: Gemini integration

---

## 🏗️ Architecture Patterns

### 1. Layered Architecture

```
┌─────────────────────────────────────┐
│     Presentation Layer              │  (React Components, UI)
├─────────────────────────────────────┤
│     API Layer                       │  (Next.js API Routes)
├─────────────────────────────────────┤
│     Business Logic Layer            │  (Services, Processors)
├─────────────────────────────────────┤
│     Data Layer                      │  (File Storage, External APIs)
└─────────────────────────────────────┘
```

### 2. Service-Oriented Design

Each major functionality is encapsulated in a service module:

- **AI Service** (`lib/ai/gemini-service.ts`): AI operations
- **Resume Processor** (`lib/resume-processor.ts`): Processing pipeline
- **PDF Generator** (`lib/pdf/pdf-generator.ts`): PDF creation
- **File Storage** (`lib/file-storage.ts`): File management

### 3. Configuration Management

Centralized configuration in `lib/config.ts`:

```typescript
import { config } from '@/lib/config'

// All env vars accessed through config object
const apiKey = config.gemini.apiKey
const maxFileSize = config.storage.maxFileSize
```

### 4. Type-Driven Development

Central type definitions in `lib/types.ts`:

```typescript
import type { ParsedResume, ContactInfo } from '@/lib/types'
```

---

## 📊 Data Flow

### Complete Processing Pipeline

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. Upload File
       ↓
┌─────────────────────┐
│  POST /api/upload   │
│  - Validate file    │
│  - Save to disk     │
│  - Return file_id   │
└──────┬──────────────┘
       │ 2. file_id
       ↓
┌─────────────────────┐
│   WS Connection     │
│  /api/stream        │
└──────┬──────────────┘
       │ 3. Start Processing
       ↓
┌─────────────────────────────────────┐
│     Resume Processor Pipeline       │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Stage 1: File Parsing      │   │
│  │  - Read file from disk      │   │
│  │  - Extract raw text         │   │
│  │  Progress: 10-20%           │   │
│  └────────────┬────────────────┘   │
│               │                     │
│  ┌────────────↓────────────────┐   │
│  │  Stage 2: AI Extraction     │   │
│  │  - Gemini: Structure data   │   │
│  │  - Extract all sections     │   │
│  │  Progress: 30-50%           │   │
│  └────────────┬────────────────┘   │
│               │                     │
│  ┌────────────↓────────────────┐   │
│  │  Stage 3: AI Enhancement    │   │
│  │  - Enhance bullet points    │   │
│  │  - Generate summary         │   │
│  │  Progress: 50-70%           │   │
│  └────────────┬────────────────┘   │
│               │                     │
│  ┌────────────↓────────────────┐   │
│  │  Stage 4: PDF Generation    │   │
│  │  - Render template          │   │
│  │  - Puppeteer: Create PDF    │   │
│  │  - Save to disk             │   │
│  │  Progress: 80-100%          │   │
│  └────────────┬────────────────┘   │
└───────────────┼─────────────────────┘
                │ 4. Progress Updates (WS)
                ↓
         ┌─────────────┐
         │   Browser   │
         │  - Display  │
         │  - Progress │
         └──────┬──────┘
                │ 5. Download Request
                ↓
         ┌──────────────────┐
         │ GET /api/download│
         │  - Stream PDF    │
         └──────────────────┘
```

### Progress Stages

| Stage | Progress | Description | Duration |
|-------|----------|-------------|----------|
| **Parsing** | 10-30% | Extract text from file | ~2s |
| **Enhancing** | 30-70% | AI extraction & enhancement | ~10-15s |
| **Generating** | 70-90% | PDF creation | ~3-5s |
| **Complete** | 100% | Ready for download | - |

---

## 🧩 Component Architecture

### Frontend Components

```
app/page.tsx (Main App)
├── Header
├── FileUploader
│   ├── DropZone
│   └── FileValidation
├── ProgressTracker
│   ├── ProgressBar
│   ├── StageIndicator
│   └── MessageDisplay
└── ResultsPanel
    ├── PDFPreview
    └── DownloadButton
```

### Custom Hooks

```typescript
// useResumeOptimizer: Main processing hook
const {
  progress,
  stage,
  message,
  downloadUrl,
  error,
  isProcessing,
  startProcessing,
  cleanup
} = useResumeOptimizer()

// useWebSocket: WebSocket connection management
const {
  isConnected,
  lastMessage,
  sendMessage,
  disconnect
} = useWebSocket(url)
```

---

## 🔌 API Design

### RESTful Endpoints

#### POST /api/upload

Upload a resume file.

**Request:**
```typescript
Content-Type: multipart/form-data
Body: FormData { file: File }
```

**Response:**
```typescript
{
  file_id: string      // Unique identifier
  filename: string     // Original filename
  size: number        // File size in bytes
  message: string     // Success message
}
```

**Validation:**
- File type: PDF, DOCX, or TXT
- Max size: 5MB
- File content: Non-empty

#### GET /api/download/[fileId]

Download the optimized PDF.

**Response:**
```typescript
Content-Type: application/pdf
Content-Disposition: attachment; filename="optimized_resume.pdf"
Body: PDF Buffer
```

#### GET /api/health

Health check endpoint.

**Response:**
```typescript
{
  status: "ok" | "error"
  timestamp: string
  gemini: boolean  // Is Gemini configured?
}
```

### WebSocket Protocol

#### Connection: /api/stream

**Client → Server:**
```typescript
{
  type: "start",
  fileId: string
}
```

**Server → Client (Progress):**
```typescript
{
  type: "progress",
  data: {
    stage: ProcessingStage,
    progress: number,      // 0-100
    message: string
  }
}
```

**Server → Client (Complete):**
```typescript
{
  type: "complete",
  data: {
    download_url: string,
    file_id: string
  }
}
```

**Server → Client (Error):**
```typescript
{
  type: "error",
  data: {
    error: string
  }
}
```

---

## 🤖 AI Integration

### Gemini Service Architecture

```
┌─────────────────────────────────────┐
│      Gemini Service                 │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  extractCompleteResumeData  │   │
│  │  - Primary extraction       │   │
│  │  - Structures all data      │   │
│  └─────────────┬───────────────┘   │
│                │                     │
│  ┌─────────────↓───────────────┐   │
│  │  enhanceExtractedData       │   │
│  │  - Improve bullet points    │   │
│  │  - Generate summary         │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Retry with Backoff         │   │
│  │  - Exponential delays       │   │
│  │  - Max 3 attempts           │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### AI Prompts

#### 1. Complete Data Extraction

**Purpose**: Extract all resume information into structured JSON

**Key Instructions:**
- Extract name and contact info
- Parse all experience entries with dates
- Identify education history
- Categorize technical skills
- Extract projects and certifications

**Output**: Structured JSON matching `ParsedResume` interface

#### 2. Bullet Point Enhancement

**Purpose**: Transform basic statements into achievement-focused bullets

**Key Rules:**
- Start with action verbs
- Include metrics/numbers
- Highlight impact
- Keep under 150 characters
- Achievement-focused, not task-focused

#### 3. Summary Generation

**Purpose**: Create compelling professional summary

**Key Elements:**
- Highlight strengths
- Mention experience
- List relevant skills
- Focus on value/impact

---

## 📁 File Management

### Storage Structure

```
uploads/
├── {fileId}.pdf          # Uploaded files
├── {fileId}.docx
├── {fileId}.txt
└── generated/
    └── {fileId}.pdf      # Generated PDFs
```

### File Lifecycle

```
1. Upload → Save to uploads/ with random ID
2. Process → Read from uploads/
3. Generate → Save PDF to uploads/generated/
4. Download → Stream from uploads/generated/
5. Cleanup → Delete after 1 hour (future enhancement)
```

### File ID Generation

```typescript
// Cryptographically secure random ID
const fileId = crypto.randomUUID()
// Or fallback:
const fileId = Math.random().toString(36).substring(2, 15) +
               Math.random().toString(36).substring(2, 15)
```

---

## ⚡ Performance Considerations

### Optimization Strategies

1. **Async Processing**
   - All I/O operations are async
   - Non-blocking file operations
   - Parallel AI requests where possible

2. **Streaming**
   - WebSocket for real-time updates
   - Stream PDF downloads
   - Chunked responses

3. **Caching** (Future Enhancement)
   - Cache common AI responses
   - Redis for session data
   - CDN for static assets

4. **Resource Management**
   - Puppeteer instances pooled
   - File cleanup after processing
   - Memory-efficient file handling

### Performance Metrics

| Operation | Target Time | Actual (Avg) |
|-----------|-------------|--------------|
| File Upload | < 1s | ~500ms |
| Text Extraction | < 2s | ~1-2s |
| AI Processing | < 15s | ~10-15s |
| PDF Generation | < 5s | ~3-5s |
| **Total** | **< 25s** | **~15-20s** |

---

## 🔒 Security

### Input Validation

```typescript
// File validation
- Type checking (MIME type + extension)
- Size limits (5MB max)
- Content validation
- Sanitization before processing
```

### Environment Security

```typescript
// Sensitive data
- API keys in environment variables
- No secrets in code
- .env files in .gitignore
```

### API Security

```typescript
// Request validation
- File type validation
- Size limits enforced
- Error messages don't leak info
- Rate limiting (future)
```

### LaTeX Injection Prevention

```typescript
// Escape special characters
const escapeMap = {
  '\\': '\\textbackslash{}',
  '{': '\\{',
  '}': '\\}',
  '$': '\\$',
  '&': '\\&',
  '%': '\\%',
  '#': '\\#',
  '_': '\\_',
  '~': '\\textasciitilde{}',
  '^': '\\textasciicircum{}'
}
```

---

## 📈 Scalability

### Current Limitations (MVP)

- Filesystem-based storage
- Single-server deployment
- Synchronous processing per request
- No user authentication

### Scaling Strategy (Future)

#### Horizontal Scaling

```
┌────────────────┐
│  Load Balancer │
└───────┬────────┘
        │
    ┌───┴───┬────────┬────────┐
    ↓       ↓        ↓        ↓
┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│ App 1 │ │ App 2 │ │ App 3 │ │ App N │
└───┬───┘ └───┬───┘ └───┬───┘ └───┬───┘
    │         │          │          │
    └─────────┴──────────┴──────────┘
              ↓
    ┌─────────────────┐
    │  Shared Storage │
    │  (S3 / R2)      │
    └─────────────────┘
```

#### Job Queue System

```
┌────────┐     ┌───────────┐     ┌─────────┐
│ Upload │ ──→ │ Job Queue │ ──→ │ Workers │
└────────┘     │ (Redis)   │     │ (N)     │
               └───────────┘     └─────────┘
```

#### Caching Layer

```
┌─────────┐
│  Redis  │
│  Cache  │
└─────────┘
    │
    ├── AI Response Cache
    ├── Session Data
    └── Rate Limiting
```

---

## 🔄 Future Enhancements

### Short Term

- [ ] Add Redis caching for AI responses
- [ ] Implement job queue for async processing
- [ ] Add rate limiting
- [ ] File cleanup job (remove old files)

### Medium Term

- [ ] User authentication & sessions
- [ ] Resume history storage
- [ ] Multiple template support
- [ ] Batch processing

### Long Term

- [ ] Microservices architecture
- [ ] Multi-region deployment
- [ ] Real-time collaboration
- [ ] Mobile app

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Google Gemini API](https://ai.google.dev/docs)
- [Puppeteer Documentation](https://pptr.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Last Updated**: 2025-11-13
**Version**: 1.0.0
