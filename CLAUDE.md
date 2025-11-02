\# AI Agent Memory Document - Resume Optimizer Project



\## 📌 Project Context Summary



\*\*Project Name:\*\* AI-Powered Resume Optimization Platform  

\*\*Status:\*\* Design Complete, Ready for Implementation  

\*\*Goal:\*\* Build an MVP web application that converts any resume format into ATS-optimized PDFs using Jake's Resume Template



---



\## 🎯 Core Objectives



When an AI agent assists with this project, the primary goals are:



1\. \*\*Parse heterogeneous resume inputs\*\* (PDF, DOCX, TXT) regardless of formatting

2\. \*\*Extract structured data\*\* (contact, experience, education, skills, projects)

3\. \*\*Enhance content\*\* using Gemini API for professional, ATS-optimized language

4\. \*\*Generate consistent output\*\* using Jake's Resume LaTeX template

5\. \*\*Provide real-time feedback\*\* via WebSocket progress updates

6\. \*\*Deploy as functional MVP\*\* accessible via public URL



---



\## 🏗️ Technical Architecture



\### Stack Overview

```

Frontend:  React 18 (Vite) + WebSocket client

Backend:   FastAPI (Python 3.11+) + WebSocket server

AI:        Google Gemini 1.5 Flash API (free tier)

Parser:    PyMuPDF + python-docx + pdfplumber

LaTeX:     Tectonic (Docker containerized)

Deploy:    Render.com (free tier)

Storage:   Temporary filesystem (no database for MVP)

```



\### System Data Flow

```

User Upload → FastAPI Endpoint → File Validation → 

Parser Module → Gemini Enhancement → LaTeX Template Population → 

Tectonic Compilation → PDF Output → Download Link

```



\### Real-time Communication

```

WebSocket Connection → Progress Updates (20%, 50%, 80%, 100%) → 

Stages: Parsing → AI Enhancement → Formatting → Complete

```



---



\## 🗂️ Project File Structure



```

resume-optimizer/

├── backend/

│   ├── app/

│   │   ├── main.py                 # FastAPI application entry

│   │   ├── routers/

│   │   │   ├── upload.py           # POST /api/upload

│   │   │   ├── websocket.py        # WS /ws/optimize

│   │   │   └── download.py         # GET /api/download/{id}

│   │   ├── services/

│   │   │   ├── parser.py           # Main parsing orchestrator

│   │   │   ├── pdf\_parser.py       # PDF-specific parsing

│   │   │   ├── docx\_parser.py      # DOCX-specific parsing

│   │   │   ├── gemini\_agent.py     # AI enhancement logic

│   │   │   ├── latex\_compiler.py   # Tectonic wrapper

│   │   │   └── template.py         # Jake's template handler

│   │   ├── models/

│   │   │   └── resume\_schema.py    # Pydantic data models

│   │   └── utils/

│   │       ├── validators.py       # Security checks

│   │       └── helpers.py          # Utility functions

│   ├── templates/

│   │   └── jakes\_resume.tex        # LaTeX template file

│   ├── requirements.txt

│   └── Dockerfile

│

├── frontend/

│   ├── src/

│   │   ├── components/

│   │   │   ├── FileUploader.jsx    # Drag-drop interface

│   │   │   ├── ProgressBar.jsx     # Real-time progress

│   │   │   └── PDFViewer.jsx       # Preview component

│   │   ├── hooks/

│   │   │   └── useWebSocket.js     # WebSocket hook

│   │   ├── App.jsx

│   │   ├── App.css

│   │   └── main.jsx

│   ├── package.json

│   └── vite.config.js

│

├── render.yaml                      # Deployment configuration

└── README.md

```



---



\## 🔑 Critical Implementation Details



\### 1. Resume Parser Requirements



\*\*Input Handling:\*\*

\- Accept PDF, DOCX, TXT formats

\- Handle poorly formatted resumes gracefully (best-effort extraction)

\- No rejection of malformed inputs



\*\*Section Detection Logic:\*\*

```python

SECTION\_PATTERNS = {

&nbsp;   'contact': r'(email|phone|linkedin|github)',

&nbsp;   'experience': r'(experience|employment|work history)',

&nbsp;   'education': r'(university|college|bachelor|master)',

&nbsp;   'skills': r'(skills|technologies|competencies)',

&nbsp;   'projects': r'(projects|portfolio)'

}

```



\*\*Output Schema:\*\*

```python

{

&nbsp;   "contact": {

&nbsp;       "name": str,

&nbsp;       "email": str,

&nbsp;       "phone": str,

&nbsp;       "linkedin": str,

&nbsp;       "github": str

&nbsp;   },

&nbsp;   "experience": \[

&nbsp;       {

&nbsp;           "company": str,

&nbsp;           "title": str,

&nbsp;           "start\_date": str,

&nbsp;           "end\_date": str,

&nbsp;           "bullets": \[str]

&nbsp;       }

&nbsp;   ],

&nbsp;   "education": \[...],

&nbsp;   "skills": {

&nbsp;       "languages": \[str],

&nbsp;       "frameworks": \[str],

&nbsp;       "tools": \[str]

&nbsp;   },

&nbsp;   "projects": \[...]

}

```



---



\### 2. Gemini API Integration Specifications



\*\*Model:\*\* `gemini-1.5-flash`  

\*\*Temperature:\*\* 0.3 (for consistency)  

\*\*Max Tokens:\*\* 2048



\*\*Bullet Point Enhancement Prompt:\*\*

```

You are an expert resume writer specializing in ATS optimization.



Task: Rewrite this experience bullet point following these strict rules:

1\. Start with a strong action verb (past tense for previous roles)

2\. Include specific metrics, numbers, or percentages

3\. Highlight tangible impact or business results

4\. Use industry-standard terminology

5\. Keep under 150 characters

6\. Make it achievement-focused, not task-focused



Job Context: {job\_title} at {company}

Original Bullet: {original\_text}



Return ONLY the rewritten bullet point, no explanations.

```



\*\*Skills Extraction Prompt:\*\*

```

Extract and categorize all technical skills from this resume text.



Rules:

1\. Separate into: Programming Languages, Frameworks/Libraries, Tools/Platforms, Databases

2\. Use standard naming conventions (e.g., "JavaScript" not "java script")

3\. Remove duplicates

4\. Infer related skills (e.g., Redux mentioned → include React)

5\. Return JSON with categorized arrays



Resume Text:

{resume\_text}



Output format:

{

&nbsp; "languages": \["Python", "JavaScript"],

&nbsp; "frameworks": \["React", "Django"],

&nbsp; "tools": \["Docker", "Git"],

&nbsp; "databases": \["PostgreSQL"]

}

```



\*\*API Call Strategy:\*\*

\- Implement exponential backoff for rate limits

\- Cache common enhancements (using text hash as key)

\- Batch process multiple bullets when possible

\- Timeout: 30 seconds per request



---



\### 3. Jake's Resume Template Details



\*\*LaTeX Template Structure:\*\*



Key sections in order:

1\. \*\*Header\*\* - Name and contact info (centered, large)

2\. \*\*Experience\*\* - Job entries with bullets

3\. \*\*Education\*\* - Degrees and institutions

4\. \*\*Projects\*\* - Personal/academic projects

5\. \*\*Technical Skills\*\* - Categorized skills list



\*\*Dynamic Placeholders:\*\*

```latex

{{NAME}}              → Contact name

{{EMAIL}}             → Email address

{{PHONE}}             → Phone number

{{LINKEDIN}}          → LinkedIn profile

{{GITHUB}}            → GitHub profile

{{EXPERIENCE\_ITEMS}}  → Generated experience entries

{{EDUCATION\_ITEMS}}   → Generated education entries

{{PROJECT\_ITEMS}}     → Generated project entries

{{LANGUAGES}}         → Comma-separated language list

{{FRAMEWORKS}}        → Comma-separated framework list

{{TOOLS}}             → Comma-separated tools list

```



\*\*Experience Item Template:\*\*

```latex

\\resumeSubheading

&nbsp; {{TITLE}}{{DATE\_RANGE}}

&nbsp; {{COMPANY}}{{LOCATION}}

&nbsp; \\resumeItemListStart

&nbsp;   \\resumeItem{{{BULLET\_1}}}

&nbsp;   \\resumeItem{{{BULLET\_2}}}

&nbsp;   ...

&nbsp; \\resumeItemListEnd

```



\*\*Important:\*\* All user-provided text must be LaTeX-escaped:

```python

ESCAPE\_MAP = {

&nbsp;   '\\\\': r'\\textbackslash{}',

&nbsp;   '{': r'\\{',

&nbsp;   '}': r'\\}',

&nbsp;   '$': r'\\$',

&nbsp;   '\&': r'\\\&',

&nbsp;   '%': r'\\%',

&nbsp;   '#': r'\\#',

&nbsp;   '\_': r'\\\_',

&nbsp;   '~': r'\\textasciitilde{}',

&nbsp;   '^': r'\\textasciicircum{}'

}

```



---



\### 4. WebSocket Communication Protocol



\*\*Connection Flow:\*\*

```

1\. Frontend connects: ws://domain.com/ws/optimize

2\. Send file\_id: {"file\_id": "uuid"}

3\. Receive progress updates every stage

4\. Close on completion or error

```



\*\*Message Format:\*\*

```json

{

&nbsp; "stage": "parsing|enhancing|generating|compiling|complete|error",

&nbsp; "progress": 0-100,

&nbsp; "message": "Human-readable status",

&nbsp; "download\_url": "/api/download/{id}" (only on complete)

}

```



\*\*Progress Stages:\*\*

\- `upload\_complete`: 10%

\- `parsing\_started`: 20%

\- `parsing\_complete`: 35%

\- `ai\_enhancement\_started`: 40%

\- `ai\_enhancement\_complete`: 70%

\- `latex\_generation`: 80%

\- `pdf\_compilation`: 90%

\- `complete`: 100%



---



\### 5. LaTeX Compilation (Tectonic)



\*\*Docker Setup:\*\*

```dockerfile

FROM python:3.11-slim



\# Install Tectonic

RUN apt-get update \&\& apt-get install -y wget fontconfig \&\& \\

&nbsp;   wget -qO- https://drop-sh.fullyjustified.net | sh \&\& \\

&nbsp;   mv tectonic /usr/local/bin/



WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt



COPY . .

CMD \["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

```



\*\*Compilation Command:\*\*

```bash

tectonic --outdir /tmp resume.tex

```



\*\*Error Handling:\*\*

\- Timeout after 60 seconds

\- Capture stderr for debugging

\- Return user-friendly error messages

\- Log full LaTeX output



---



\## 🚀 Development Workflow



\### Phase 1: Backend Core (Days 1-5)



\*\*Priority 1: Parser Module\*\*

```python

\# Goal: Extract data from any resume format

\# Files: parser.py, pdf\_parser.py, docx\_parser.py

\# Test: Parse 10+ diverse resume samples successfully

```



\*\*Priority 2: Gemini Integration\*\*

```python

\# Goal: Enhance bullet points and extract skills

\# File: gemini\_agent.py

\# Test: Transform weak bullets into strong ones

\# Example: "Worked on API" → "Architected RESTful API serving 10K+ requests/day"

```



\*\*Priority 3: LaTeX System\*\*

```python

\# Goal: Generate and compile PDFs from data

\# Files: template.py, latex\_compiler.py, jakes\_resume.tex

\# Test: Compile sample data to PDF successfully

```



---



\### Phase 2: API Layer (Days 6-7)



\*\*Endpoints to Build:\*\*



1\. \*\*POST /api/upload\*\*

&nbsp;  - Accept multipart/form-data

&nbsp;  - Validate file type and size

&nbsp;  - Return unique file\_id

&nbsp;  - Save to uploads/ directory



2\. \*\*WebSocket /ws/optimize\*\*

&nbsp;  - Accept file\_id

&nbsp;  - Run full optimization pipeline

&nbsp;  - Send progress updates

&nbsp;  - Return download URL on success



3\. \*\*GET /api/download/{file\_id}\*\*

&nbsp;  - Serve optimized PDF

&nbsp;  - Set proper headers (Content-Type: application/pdf)

&nbsp;  - Clean up temp files after 1 hour



\*\*FastAPI Main App:\*\*

```python

from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()



\# Enable CORS for frontend

app.add\_middleware(

&nbsp;   CORSMiddleware,

&nbsp;   allow\_origins=\["\*"],

&nbsp;   allow\_methods=\["\*"],

&nbsp;   allow\_headers=\["\*"]

)



\# Include routers

app.include\_router(upload.router)

app.include\_router(websocket.router)

app.include\_router(download.router)



@app.get("/health")

def health():

&nbsp;   return {"status": "healthy"}

```



---



\### Phase 3: Frontend (Days 8-10)



\*\*React Components:\*\*



1\. \*\*FileUploader.jsx\*\*

&nbsp;  - Drag-and-drop zone

&nbsp;  - File validation (client-side)

&nbsp;  - Visual feedback on hover



2\. \*\*ProgressBar.jsx\*\*

&nbsp;  - Dynamic width based on progress percentage

&nbsp;  - Stage name display

&nbsp;  - Status message



3\. \*\*App.jsx\*\*

&nbsp;  - Main orchestration

&nbsp;  - WebSocket connection management

&nbsp;  - Error handling and display



\*\*WebSocket Hook Pattern:\*\*

```javascript

const { connect, progress, stage, message, downloadUrl, error } = useWebSocket(wsUrl);



// Usage

connect(fileId); // Start optimization

// Hook automatically updates progress, stage, message

// On complete, downloadUrl becomes available

```



---



\### Phase 4: Testing (Days 11-12)



\*\*Test Coverage Required:\*\*



1\. \*\*Parser Tests\*\*

&nbsp;  - PDF with standard formatting ✓

&nbsp;  - PDF with unusual layout ✓

&nbsp;  - DOCX with tables ✓

&nbsp;  - Plain text resume ✓

&nbsp;  - Minimal resume (missing sections) ✓



2\. \*\*Gemini Tests\*\*

&nbsp;  - Bullet enhancement quality ✓

&nbsp;  - Skills extraction accuracy ✓

&nbsp;  - Grammar correction ✓



3\. \*\*LaTeX Tests\*\*

&nbsp;  - Special character escaping ✓

&nbsp;  - Multi-page resumes ✓

&nbsp;  - Long bullet points (wrapping) ✓



4\. \*\*End-to-End Test\*\*

&nbsp;  - Upload → Optimize → Download flow ✓

&nbsp;  - WebSocket reconnection ✓

&nbsp;  - Error scenarios (invalid file, API failure) ✓



---



\### Phase 5: Deployment (Days 13-14)



\*\*Render Configuration:\*\*



1\. \*\*Backend Service\*\*

&nbsp;  - Type: Web Service (Docker)

&nbsp;  - Build: Use Dockerfile

&nbsp;  - Environment: GEMINI\_API\_KEY (secret)

&nbsp;  - Health Check: /health endpoint



2\. \*\*Frontend Service\*\*

&nbsp;  - Type: Static Site

&nbsp;  - Build Command: `npm install \&\& npm run build`

&nbsp;  - Publish Directory: `dist/`

&nbsp;  - Environment: VITE\_API\_URL, VITE\_WS\_URL



\*\*render.yaml:\*\*

```yaml

services:

&nbsp; - type: web

&nbsp;   name: resume-optimizer-backend

&nbsp;   env: docker

&nbsp;   dockerfilePath: ./backend/Dockerfile

&nbsp;   envVars:

&nbsp;     - key: GEMINI\_API\_KEY

&nbsp;       sync: false



&nbsp; - type: web

&nbsp;   name: resume-optimizer-frontend

&nbsp;   env: static

&nbsp;   buildCommand: cd frontend \&\& npm install \&\& npm run build

&nbsp;   staticPublishPath: ./frontend/dist

```



---



\## 💡 Common AI Agent Instructions



\### When Starting a New Coding Session



\*\*Instruction Template:\*\*

```

I'm working on the Resume Optimizer project (see attached memory document).



Current task: \[Specific component/feature]

Files to work on: \[List specific files]

Expected outcome: \[What success looks like]



Please:

1\. Review the architecture in the memory doc

2\. Implement \[specific feature] following the patterns shown

3\. Include error handling and validation

4\. Add comments for complex logic

5\. Provide testing instructions



Context from memory doc: \[Paste relevant section]

```



---



\### When Debugging Issues



\*\*Instruction Template:\*\*

```

I'm encountering an issue in the Resume Optimizer project.



Component: \[Parser/Gemini/LaTeX/Frontend]

Error message: \[Exact error]

What I've tried: \[Previous attempts]



Please:

1\. Identify the root cause

2\. Suggest a fix with code example

3\. Explain why the issue occurred

4\. Provide prevention strategies



Relevant architecture: \[Paste relevant section from memory doc]

```



---



\### When Adding New Features



\*\*Instruction Template:\*\*

```

I want to add \[feature] to the Resume Optimizer.



Current architecture: \[Paste system flow]

Feature requirements: \[Describe what it should do]

Integration point: \[Where it fits in the pipeline]



Please:

1\. Design the feature architecture

2\. List files that need modification

3\. Provide implementation code

4\. Update relevant documentation

5\. Suggest testing approach



Maintain consistency with: \[Reference existing patterns]

```



---



\## 🎯 Key Success Criteria



An AI agent successfully assists with this project when:



✅ \*\*Code follows established patterns\*\* from the architecture

✅ \*\*All components integrate\*\* via the defined interfaces

✅ \*\*Error handling is robust\*\* (never crashes on bad input)

✅ \*\*Real-time updates work\*\* smoothly via WebSocket

✅ \*\*LaTeX output is consistent\*\* with Jake's template

✅ \*\*Deployment works\*\* on first attempt to Render

✅ \*\*User experience is smooth\*\* (clear progress, good errors)



---



\## 🔧 Environment Variables Reference



```bash

\# Backend (.env)

GEMINI\_API\_KEY=your-api-key-here

ENVIRONMENT=development|production

MAX\_FILE\_SIZE=5242880  # 5MB in bytes

UPLOAD\_DIR=uploads/

OUTPUT\_DIR=outputs/



\# Frontend (.env.production)

VITE\_API\_URL=https://resume-optimizer-backend.onrender.com

VITE\_WS\_URL=wss://resume-optimizer-backend.onrender.com

```



---



\## 📚 Quick Reference Commands



\### Development

```bash

\# Start backend

cd backend

source venv/bin/activate

uvicorn app.main:app --reload



\# Start frontend

cd frontend

npm run dev



\# Run tests

pytest tests/ -v



\# Build Docker image

docker build -t resume-optimizer .

```



\### Deployment

```bash

\# Deploy to Render

render deploy



\# Set environment variable

render env set GEMINI\_API\_KEY=your-key



\# View logs

render logs

```



---



\## 🚨 Critical Reminders for AI Agents



1\. \*\*Always escape LaTeX special characters\*\* in user input

2\. \*\*Never reject malformed resumes\*\* - attempt best-effort parsing

3\. \*\*Include progress updates\*\* at every major step

4\. \*\*Handle Gemini API failures gracefully\*\* with retries

5\. \*\*Validate file uploads\*\* before processing (type, size, magic numbers)

6\. \*\*Clean up temporary files\*\* after processing

7\. \*\*Use async/await\*\* for I/O operations

8\. \*\*Test with diverse resume formats\*\* before declaring success



---



\## 📖 Design Decisions \& Rationale



\### Why FastAPI over Flask/Django?

\- Native WebSocket support

\- Automatic API documentation (Swagger)

\- Type validation via Pydantic

\- Fast async performance



\### Why Tectonic over pdflatex?

\- Self-contained (no manual package installation)

\- Automatic dependency resolution

\- Faster compilation

\- Easier Docker integration



\### Why React over Vue/Angular?

\- Large ecosystem of components

\- Simple WebSocket integration

\- Vite for fast development

\- Easier for capstone-level project



\### Why No Database for MVP?

\- Simplifies deployment

\- No authentication needed

\- Stateless processing

\- Files auto-cleanup after 1 hour



\### Why Gemini over GPT-4?

\- Free tier available

\- Good performance for this task

\- Simpler API integration

\- Lower latency than GPT-4



---



\## 🎓 Learning Notes for Future Development



\### Potential Improvements Post-MVP



1\. \*\*Add user authentication\*\* (Firebase Auth)

2\. \*\*Store resume history\*\* (MongoDB)

3\. \*\*Multiple template support\*\* (Modern, Creative, ATS)

4\. \*\*Job description matching\*\* (keyword optimization)

5\. \*\*ATS score calculator\*\* (percentage match)

6\. \*\*Side-by-side comparison\*\* (before/after)

7\. \*\*Export to DOCX\*\* (python-docx generation)

8\. \*\*Collaborative editing\*\* (real-time with Socket.io)



\### Scalability Considerations



If scaling beyond MVP:

\- Add Redis for caching Gemini responses

\- Use S3 for file storage (not local filesystem)

\- Implement job queue (Celery/Bull) for async processing

\- Add rate limiting per user/IP

\- Use CDN for frontend static assets

\- Horizontal scaling with load balancer



---



\## 🤖 AI Agent Collaboration Protocol



\### When Multiple Agents Work on This Project



\*\*Agent A (Backend):\*\*

\- Owns: Parser, Gemini integration, LaTeX compilation

\- Interfaces: REST API endpoints, WebSocket protocol

\- Artifacts: Python files, Dockerfile, requirements.txt



\*\*Agent B (Frontend):\*\*

\- Owns: React components, WebSocket client, UI/UX

\- Interfaces: API consumption, WebSocket messages

\- Artifacts: JSX files, CSS, package.json



\*\*Shared Contract:\*\*

\- API endpoints (paths, methods, payloads)

\- WebSocket message format

\- Resume data schema (Pydantic models)

\- Progress stage definitions



\*\*Communication:\*\*

\- Update memory doc when changing interfaces

\- Test integration after each major change

\- Document any deviations from original design



---



\## 📝 Version History



\*\*v1.0\*\* (November 2025)

\- Initial design and architecture

\- Complete implementation roadmap

\- AI agent memory structure



\*\*Maintained by:\*\* Capstone Project Team  

\*\*Last Updated:\*\* November 2, 2025



---



\## 🔗 External Resources



\- \[Jake's Resume Template](https://github.com/jakegut/resume)

\- \[FastAPI Documentation](https://fastapi.tiangolo.com/)

\- \[Gemini API Docs](https://ai.google.dev/docs)

\- \[Tectonic Documentation](https://tectonic-typesetting.github.io/)

\- \[React Documentation](https://react.dev/)

\- \[Render Deployment Guide](https://render.com/docs)



---



\*\*END OF AI AGENT MEMORY DOCUMENT\*\*



This document should be provided to AI assistants when:

\- Starting a new development session

\- Debugging issues

\- Adding features

\- Deploying the application

\- Answering questions about architecture

\- Reviewing code for consistency



Keep this document updated as the project evolves.

