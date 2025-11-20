# Backend Modifications for No-Auth Approach

**Date Created:** November 18, 2025
**Purpose:** Document all modifications needed to convert Backend_Suggested/ to anonymous access (no authentication)
**Target Directory:** Backend_Modified/

---

## 📋 Overview

This document tracks all modifications needed to strip authentication from the FastAPI backend while maintaining core LaTeX PDF generation functionality.

---

## 🗑️ Files to DELETE (Move to Backend_Modified/unused/)

The following files will be moved to the `unused/` directory:

### 1. auth_utils.py
**Reason:** JWT authentication logic - not needed for anonymous access
**Dependencies:** Used in main.py line 40

### 2. auth.py
**Reason:** HTTPBearer scheme dependencies - not needed
**Dependencies:** Used in main.py line 38

### 3. usage.py
**Reason:** Supabase user usage tracking - not needed (or replace with IP-based)
**Dependencies:** Used in main.py lines 41-42
**Alternative:** Could implement simple IP-based rate limiting later

### 4. supabase_utils.py
**Reason:** Supabase storage and database integration - will use local filesystem
**Dependencies:** Used in main.py line 42
**Alternative:** Local file storage in generated_pdfs/ directory

### 5. email_service.py
**Reason:** Email notifications via Resend - not needed for anonymous users
**Dependencies:** Used in main.py line 43

### 6. email_templates.py
**Reason:** Email templates - not needed
**Dependencies:** Used by email_service.py

### 7. payments.py
**Reason:** Stripe payment webhooks - not needed for free MVP
**Dependencies:** Not currently imported in main.py (safe to delete)

---

## ✏️ Files to MODIFY

### 1. main.py (CRITICAL - Many Changes)

**Changes Required:**

#### Remove Imports (Lines to DELETE):
```python
# Line 22: from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
# Line 38: from auth import bearer_scheme
# Line 40: from auth_utils import get_user_id_from_jwt
# Line 41: from usage import check_user_usage_limits, increment_user_usage
# Line 42: from supabase_utils import upload_pdf_to_bucket, insert_resume_record
# Line 43: from email_service import send_resume_conversion_notification
```

#### Add New Imports:
```python
from fastapi.responses import FileResponse  # For PDF download endpoint
import os
```

#### Modify /tailor Endpoint (Lines 99-189):
- **Remove:** `credentials` parameter (line 101)
- **Remove:** `get_user_id_from_jwt()` call (line 114)
- **Remove:** `check_user_usage_limits()` call (lines 118-131)
- **Remove:** `increment_user_usage()` call (line 166)
- **Keep:** Core processing logic

#### Modify /convert-latex Endpoint (Lines 192-302):
- **Remove:** `credentials` parameter (line 194)
- **Remove:** All auth/usage code
- **Remove:** `upload_pdf_to_bucket()` call (line 241)
- **Remove:** `insert_resume_record()` call (line 244)
- **Remove:** Email notification code (lines 247-259)
- **Replace:** Supabase upload with local storage
- **Add:** Local download URL

**New Logic:**
```python
# Save PDF locally
output_dir = os.path.join(os.getcwd(), 'generated_pdfs')
os.makedirs(output_dir, exist_ok=True)
local_pdf_path = os.path.join(output_dir, pdf_filename)
# PDF already saved by convert_latex_to_pdf in latex_output/
# Copy to generated_pdfs/
import shutil
shutil.copy(
    os.path.join(os.getcwd(), 'latex_output', pdf_filename),
    local_pdf_path
)
download_url = f"/download/{pdf_filename}"
```

#### Modify /convert-json-to-latex Endpoint (Lines 305-479):
- **Remove:** `credentials` parameter (line 308)
- **Remove:** All auth/usage code
- **Remove:** Supabase upload (line 384)
- **Remove:** Database insert (line 388)
- **Remove:** Email notification (lines 393-406)
- **Replace:** With local storage logic (same as above)

#### Add NEW Endpoint: /download/{pdf_filename}
```python
@app.get("/download/{pdf_filename}", tags=["Resume"])
async def download_pdf(pdf_filename: str):
    """Download generated PDF file"""
    pdf_path = os.path.join(os.getcwd(), 'generated_pdfs', pdf_filename)

    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="PDF not found")

    return FileResponse(
        path=pdf_path,
        media_type='application/pdf',
        filename=pdf_filename
    )
```

---

### 2. models.py (Minor Changes)

**Changes Required:**

#### Modify JsonToLatexResponse (Line 71-74):
```python
# BEFORE
class JsonToLatexResponse(BaseModel):
    message: str = Field(default="Resume converted successfully from JSON.")
    resume_link: str | None = None
    pdf_filename: str | None = None

# AFTER
class ConversionResponse(BaseModel):
    message: str = Field(default="Resume converted successfully.")
    pdf_filename: str
    download_url: str  # Local download URL like /download/resume_123.pdf
```

#### Keep These Models:
- ✅ ResumeData
- ✅ BasicInfo
- ✅ EducationItem
- ✅ ExperienceItem
- ✅ ProjectItem
- ✅ Skills
- ✅ MessageResponse
- ✅ TailoredResumeResponse

#### Remove/Simplify:
- ❌ User model (lines 11-15) - not needed, but harmless to keep

---

### 3. requirements.txt (Remove Dependencies)

**Dependencies to REMOVE (comment out or delete):**

```bash
# Authentication & Database
# supabase==2.15.0          # Line 111
# storage3==0.11.3          # Line 108
# postgrest==1.0.1          # Line 72
# gotrue==2.12.0            # Line 33
# realtime==2.4.2           # Line 95
# supafunc==0.9.4           # Line 112

# Email Service
# resend==2.15.0            # Line 128

# Payments
# stripe==12.0.0            # Line 110

# JWT
# PyJWT==2.10.1             # Line 84
```

**Keep These (Core Dependencies):**
- ✅ fastapi==0.115.12
- ✅ uvicorn==0.34.0
- ✅ langchain==0.3.23
- ✅ langchain-google-vertexai==2.0.25
- ✅ pdflatex==0.1.3
- ✅ python-docx==1.1.2
- ✅ PyMuPDF==1.25.5
- ✅ python-multipart==0.0.20
- ✅ pydantic==2.11.2
- ✅ python-dotenv==1.1.0
- ✅ All google-* packages (for Vertex AI)

---

### 4. prompts.py (WRITE FROM SCRATCH)

**Current State:** EMPTY (lines 1-10)

**Required Additions:**

```python
"""Module containing prompt templates for resume processing"""

RESUME_TAILORING_PROMPT = """You are an expert resume writer and career coach. Your task is to tailor a resume to match a specific job description while maintaining 100% truthfulness.

RULES:
1. Do NOT add false information or skills
2. Emphasize relevant experiences and skills
3. Reorder bullet points to highlight matching qualifications
4. Use keywords from the job description naturally
5. Maintain professional tone
6. Keep all dates and facts accurate

RESUME:
{resume_content}

JOB DESCRIPTION:
{job_description}

Return the tailored resume in plain text format, clearly structured with sections.
"""

LATEX_CONVERSION_PROMPT = """You are an expert LaTeX formatter for professional resumes. Convert the following resume data into clean, ATS-optimized LaTeX code.

REQUIREMENTS:
- Use the template structure provided below
- Escape ALL special LaTeX characters: & % $ # _ { } ~ ^ \\
- Format dates consistently as "Month Year" (e.g., "Jan 2022")
- Use proper LaTeX syntax and commands
- Ensure output compiles with pdflatex
- Keep bullet points concise and impactful
- Include all sections: Contact, Education, Experience, Projects, Skills
- Use \\href for all URLs

RESUME CONTENT (JSON format):
{resume_content}

LATEX TEMPLATE STRUCTURE:
{latex_template}

Return ONLY the complete LaTeX code. Start with \\documentclass and end with \\end{{document}}.
Do NOT use markdown code blocks or explanations.
"""

LATEX_TEMPLATE = r"""
\\documentclass[letterpaper,11pt]{{article}}

\\usepackage{{latexsym}}
\\usepackage[empty]{{fullpage}}
\\usepackage{{titlesec}}
\\usepackage{{marvosym}}
\\usepackage[usenames,dvipsnames]{{color}}
\\usepackage{{verbatim}}
\\usepackage{{enumitem}}
\\usepackage[hidelinks]{{hyperref}}
\\usepackage{{fancyhdr}}
\\usepackage[english]{{babel}}
\\usepackage{{tabularx}}

\\pagestyle{{fancy}}
\\fancyhf{{}}
\\fancyfoot{{}}
\\renewcommand{{\\headrulewidth}}{{0pt}}
\\renewcommand{{\\footrulewidth}}{{0pt}}

% Adjust margins
\\addtolength{{\\oddsidemargin}}{{-0.5in}}
\\addtolength{{\\evensidemargin}}{{-0.5in}}
\\addtolength{{\\textwidth}}{{1in}}
\\addtolength{{\\topmargin}}{{-.5in}}
\\addtolength{{\\textheight}}{{1.0in}}

\\urlstyle{{same}}

\\raggedbottom
\\raggedright
\\setlength{{\\tabcolsep}}{{0in}}

% Sections formatting
\\titleformat{{\\section}}{{
  \\vspace{{-4pt}}\\scshape\\raggedright\\large
}}{{}}{{0em}}{{}}[\\color{{black}}\\titlerule \\vspace{{-5pt}}]

% Custom commands
\\newcommand{{\\resumeItem}}[1]{{
  \\item\\small{{
    {{#1 \\vspace{{-2pt}}}}
  }}
}}

\\newcommand{{\\resumeSubheading}}[4]{{
  \\vspace{{-2pt}}\\item
    \\begin{{tabular*}}{{0.97\\textwidth}}[t]{{l@{{\\extracolsep{{\\fill}}}}r}}
      \\textbf{{#1}} & #2 \\\\
      \\textit{{\\small#3}} & \\textit{{\\small #4}} \\\\
    \\end{{tabular*}}\\vspace{{-7pt}}
}}

\\newcommand{{\\resumeSubItem}}[1]{{\\resumeItem{{#1}}\\vspace{{-4pt}}}}

\\renewcommand{{\\labelitemii}}{{$\\vcenter{{\\hbox{{\\tiny$\\bullet$}}}}$}}

\\newcommand{{\\resumeSubHeadingListStart}}{{\\begin{{itemize}}[leftmargin=0.15in, label={{}}]}}
\\newcommand{{\\resumeSubHeadingListEnd}}{{\\end{{itemize}}}}
\\newcommand{{\\resumeItemListStart}}{{\\begin{{itemize}}}}
\\newcommand{{\\resumeItemListEnd}}{{\\end{{itemize}}\\vspace{{-5pt}}}}

\\begin{{document}}

% CONTACT INFORMATION
\\begin{{center}}
    \\textbf{{\\Huge \\scshape [FULL_NAME]}} \\\\ \\vspace{{1pt}}
    \\small [PHONE] $|$ \\href{{mailto:[EMAIL]}}{{[EMAIL]}} $|$
    \\href{{[LINKEDIN]}}{{LinkedIn}} $|$
    \\href{{[GITHUB]}}{{GitHub}}
\\end{{center}}

% EDUCATION
\\section{{Education}}
  \\resumeSubHeadingListStart
    % Education items will be inserted here by AI
  \\resumeSubHeadingListEnd

% EXPERIENCE
\\section{{Experience}}
  \\resumeSubHeadingListStart
    % Experience items will be inserted here by AI
  \\resumeSubHeadingListEnd

% PROJECTS
\\section{{Projects}}
    \\resumeSubHeadingListStart
      % Project items will be inserted here by AI
    \\resumeSubHeadingListEnd

% TECHNICAL SKILLS
\\section{{Technical Skills}}
 \\begin{{itemize}}[leftmargin=0.15in, label={{}}]
    \\small{{\\item{{
     \\textbf{{Languages}}{{: [LANGUAGES]}} \\\\
     \\textbf{{Frameworks}}{{: [FRAMEWORKS]}} \\\\
     \\textbf{{Developer Tools}}{{: [TOOLS]}} \\\\
     \\textbf{{Libraries}}{{: [LIBRARIES]}} \\\\
    }}}}
 \\end{{itemize}}

\\end{{document}}
"""
```

---

### 5. resume_processor.py (Minor Changes)

**Changes Required:**

#### Update Model Initialization (Lines 36-44):
```python
# BEFORE (Line 63)
model_name=None  # Set model name here

# AFTER
# Get from environment variables
import os
project = os.getenv("VERTEX_AI_PROJECT")
location = os.getenv("VERTEX_AI_LOCATION", "us-central1")
model_name = model_name or os.getenv("VERTEX_AI_MODEL", "gemini-1.5-flash-001")

if not project:
    raise ValueError("VERTEX_AI_PROJECT environment variable not set")

llm = ChatVertexAI(
    model_name=model_name,
    project=project,
    location=location,
    temperature=temperature,
)
```

---

### 6. .env File (CREATE NEW)

**Create:** `Backend_Modified/.env`

```bash
# Google Cloud Vertex AI
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
VERTEX_AI_PROJECT=your-gcp-project-id
VERTEX_AI_LOCATION=us-central1
VERTEX_AI_MODEL=gemini-1.5-flash-001

# App Settings
PORT=8080
HOST=0.0.0.0
LOG_LEVEL=info

# Output Directories
LATEX_OUTPUT_DIR=latex_output
PDF_OUTPUT_DIR=generated_pdfs
```

---

## 📊 Summary of Changes

### Files Deleted: 7
- auth_utils.py
- auth.py
- usage.py
- supabase_utils.py
- email_service.py
- email_templates.py
- payments.py

### Files Modified: 5
- ✏️ main.py (major changes - remove auth, add download endpoint)
- ✏️ models.py (minor - update response model)
- ✏️ requirements.txt (remove 8 dependencies)
- ✏️ prompts.py (write from scratch)
- ✏️ resume_processor.py (minor - env var handling)

### Files Created: 1
- 📄 .env (new file)

### Files Unchanged: 5
- ✅ latex_converter.py
- ✅ latex_utils.py
- ✅ utils.py
- ✅ Dockerfile
- ✅ readme.md

---

## 🔍 None Placeholders Found

### auth_utils.py
- Line 6: `secret = None  # Set Supabase JWKS secret here`
  - **Action:** FILE DELETED

### usage.py
- Line 5: `SUPABASE_URL = None`
- Line 6: `SUPABASE_KEY = None`
  - **Action:** FILE DELETED

### prompts.py
- Line 4: `RESUME_TAILORING_PROMPT = ""`
- Line 6: `LATEX_CONVERSION_PROMPT = ""`
- Line 9: `LATEX_TEMPLATE = ""`
  - **Action:** WRITE PROMPTS (documented above)

### main.py
- Line 63: `model_name=None  # Set model name here`
  - **Action:** Use environment variable

---

## ✅ Day 2 Checklist (Tomorrow)

Based on this analysis, Day 2 tasks will be:

1. Move deleted files to `Backend_Modified/unused/`
2. Apply all modifications to `main.py`
3. Update `models.py`
4. Write prompts in `prompts.py`
5. Update `requirements.txt`
6. Update `resume_processor.py`
7. Create `.env` file
8. Test syntax with `python3 -m py_compile main.py`

---

**Document Version:** 1.0
**Last Updated:** November 18, 2025
**Status:** Analysis Complete - Ready for Day 2 Implementation
