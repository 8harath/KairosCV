# 30-Day Backend Integration Plan (No Authentication)

**Project:** KairosCV - LaTeX Backend Integration
**Duration:** 30 Days (Full-Time: ~8 hours/day)
**Approach:** Anonymous Access (No Auth Required)
**Goal:** Integrate FastAPI backend with Next.js frontend for LaTeX PDF generation
**Start Date:** [Your Start Date]
**Target Completion:** [Start Date + 30 days]

---

## 🎯 Project Overview

### What We're Building

You'll integrate the FastAPI backend to provide **professional LaTeX PDF generation** while maintaining **anonymous access** (no login required). This reduces complexity and costs while delivering superior PDF quality.

### Key Modifications for No-Auth Approach

1. **Remove Authentication** - Disable JWT checks, Supabase auth
2. **Remove Usage Limits** - No user tracking (optional: IP-based limits)
3. **Remove Email Service** - No user email notifications
4. **Keep LaTeX Generation** - Core feature we want
5. **Simplify Storage** - Local filesystem instead of Supabase (or basic S3)

### Expected Outcomes

- ✅ Professional LaTeX PDFs (superior to Puppeteer)
- ✅ Anonymous usage (no signup friction)
- ✅ Lower costs (~$7-25/month vs. $50-200)
- ✅ Simpler codebase (no auth layer)
- ✅ Faster development (skip 15+ hours of auth work)

---

## 📊 High-Level Milestones

| Week | Milestone | Completion |
|------|-----------|------------|
| **Week 1 (Days 1-7)** | Backend Setup & Configuration | 25% |
| **Week 2 (Days 8-14)** | Prompt Engineering & LaTeX Templates | 50% |
| **Week 3 (Days 15-21)** | Frontend Integration & API Layer | 75% |
| **Week 4 (Days 22-30)** | Testing, Debugging, Deployment | 100% |

---

## 🗓️ Detailed Daily Plan

---

## **WEEK 1: Backend Setup & Configuration**

### **Day 1: Environment Setup & Backend Analysis**

**Daily Goal:** Set up development environment and understand backend architecture

**Time Breakdown:**

- **09:00 - 10:00** (1h) - Morning Setup
  - [ ] Create new branch: `git checkout -b backend-integration-no-auth`
  - [ ] Backup current working code: `git tag pre-backend-integration`
  - [ ] Review BACKEND_INTEGRATION_ANALYSIS.md thoroughly
  - [ ] Create daily progress log: `PROGRESS_LOG.md`

- **10:00 - 11:30** (1.5h) - Backend Code Analysis
  - [ ] Read through all Backend_Suggested/ files
  - [ ] Identify all auth-related code to remove
  - [ ] List all dependencies in requirements.txt
  - [ ] Document all `None` placeholders that need values

- **11:30 - 12:00** (0.5h) - Break

- **12:00 - 14:00** (2h) - Modification Planning
  - [ ] Create `Backend_Modified/` directory (clean version)
  - [ ] Copy all backend files to Backend_Modified/
  - [ ] Document required changes in `BACKEND_MODIFICATIONS.md`:
    ```markdown
    # Files to Modify
    - main.py: Remove auth dependencies
    - auth_utils.py: DELETE (not needed)
    - usage.py: DELETE or simplify to IP-based limits
    - supabase_utils.py: DELETE or replace with local storage
    - email_service.py: DELETE (no emails for anonymous users)
    - models.py: Simplify (remove user-related fields)
    ```

- **14:00 - 15:00** (1h) - Lunch Break

- **15:00 - 17:00** (2h) - Python Environment Setup
  - [ ] Install Python 3.11: `python3 --version`
  - [ ] Create virtual environment:
    ```bash
    cd Backend_Modified
    python3 -m venv venv
    source venv/bin/activate
    ```
  - [ ] Install dependencies (test for errors):
    ```bash
    pip install --upgrade pip
    pip install -r requirements.txt
    ```
  - [ ] Document any installation errors
  - [ ] Verify imports work:
    ```bash
    python3 -c "import fastapi; import langchain_google_vertexai; print('OK')"
    ```

- **17:00 - 18:00** (1h) - LaTeX Installation
  - [ ] Install TexLive (platform-specific):
    ```bash
    # Ubuntu/Debian
    sudo apt-get update
    sudo apt-get install texlive-latex-base texlive-fonts-recommended texlive-latex-extra

    # macOS
    brew install --cask basictex
    eval "$(/usr/libexec/path_helper)"
    sudo tlmgr update --self
    sudo tlmgr install collection-fontsrecommended
    ```
  - [ ] Verify installation: `pdflatex --version`
  - [ ] Test basic compilation:
    ```bash
    echo '\documentclass{article}\begin{document}Hello\end{document}' > test.tex
    pdflatex test.tex
    ls test.pdf  # Should exist
    ```

**End of Day Checklist:**
- [ ] Environment is set up
- [ ] All dependencies installed
- [ ] LaTeX working
- [ ] Backend code analyzed
- [ ] Modification plan documented

**Expected Issues:**
- LaTeX installation might take 30-60 minutes (large download)
- Some Python packages might have dependency conflicts
- pdflatex might not be in PATH (restart terminal)

---

### **Day 2: Backend Modifications - Remove Auth**

**Daily Goal:** Strip out all authentication and user management code

**Time Breakdown:**

- **09:00 - 10:00** (1h) - Code Cleanup Planning
  - [ ] List all files that import auth_utils
  - [ ] List all files that import supabase_utils
  - [ ] List all files that import usage.py
  - [ ] Create backup: `cp -r Backend_Modified Backend_Modified_backup`

- **10:00 - 12:00** (2h) - Modify main.py (Part 1)
  - [ ] Open `Backend_Modified/main.py`
  - [ ] Remove imports:
    ```python
    # DELETE THESE LINES
    from auth_utils import get_user_id_from_jwt
    from usage import check_user_usage_limits, increment_user_usage
    from supabase_utils import upload_pdf_to_bucket, insert_resume_record
    from email_service import send_resume_conversion_notification
    from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
    ```
  - [ ] Remove HTTPBearer from all endpoint signatures
  - [ ] Save modified file

- **12:00 - 13:00** (1h) - Lunch Break

- **13:00 - 15:00** (2h) - Modify main.py (Part 2)
  - [ ] Remove auth check from `/convert-json-to-latex`:
    ```python
    # BEFORE (lines 306-308)
    async def convert_json_to_latex_endpoint(
        resume_data: ResumeData,
        credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
    )

    # AFTER
    async def convert_json_to_latex_endpoint(
        resume_data: ResumeData,
    )
    ```
  - [ ] Remove all lines with:
    - `user_id = get_user_id_from_jwt(...)`
    - `check_user_usage_limits(...)`
    - `increment_user_usage(...)`
    - `insert_resume_record(...)`
    - `send_resume_conversion_notification(...)`
  - [ ] Comment out Supabase upload, use local storage instead:
    ```python
    # Save PDF locally instead of Supabase
    output_dir = os.path.join(os.getcwd(), 'generated_pdfs')
    os.makedirs(output_dir, exist_ok=True)
    local_pdf_path = os.path.join(output_dir, pdf_filename)
    # PDF already saved by convert_latex_to_pdf
    public_url = f"/api/download/{pdf_filename}"  # Local download endpoint
    ```

- **15:00 - 15:30** (0.5h) - Break

- **15:30 - 17:30** (2h) - Delete Unused Files & Clean Up
  - [ ] Delete files (move to `Backend_Modified/unused/`):
    ```bash
    mkdir -p unused
    mv auth_utils.py unused/
    mv usage.py unused/
    mv supabase_utils.py unused/
    mv email_service.py unused/
    mv email_templates.py unused/
    mv payments.py unused/
    ```
  - [ ] Clean up imports in remaining files
  - [ ] Search for any remaining references:
    ```bash
    grep -r "supabase" *.py
    grep -r "auth_utils" *.py
    grep -r "get_user_id" *.py
    ```

- **17:30 - 18:00** (0.5h) - Test Syntax
  - [ ] Run Python syntax check:
    ```bash
    python3 -m py_compile main.py
    python3 -m py_compile resume_processor.py
    python3 -m py_compile latex_converter.py
    python3 -m py_compile models.py
    ```
  - [ ] Document any errors in PROGRESS_LOG.md

**End of Day Checklist:**
- [ ] Auth code removed from main.py
- [ ] Unused files archived
- [ ] No import errors
- [ ] Backend still compiles

**Expected Issues:**
- Missed references to deleted modules (use grep to find)
- Type hints might break (remove user-related types)

---

### **Day 3: Simplify Models & Add Download Endpoint**

**Daily Goal:** Update data models and create PDF download endpoint

**Time Breakdown:**

- **09:00 - 10:30** (1.5h) - Simplify models.py
  - [ ] Open `Backend_Modified/models.py`
  - [ ] Remove `User` model (not needed)
  - [ ] Keep only:
    - `ResumeData` (main input model)
    - `JsonToLatexResponse` (output model)
    - `MessageResponse` (health check)
  - [ ] Add new response model:
    ```python
    class ConversionResponse(BaseModel):
        message: str = "Resume converted successfully"
        pdf_filename: str
        download_url: str
    ```

- **10:30 - 12:00** (1.5h) - Add Download Endpoint to main.py
  - [ ] Add new endpoint:
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
  - [ ] Test endpoint design (don't run yet, no PDFs exist)

- **12:00 - 13:00** (1h) - Lunch Break

- **13:00 - 15:00** (2h) - Update Response Format
  - [ ] Modify `/convert-json-to-latex` to return new format:
    ```python
    return ConversionResponse(
        message="Resume converted successfully from JSON.",
        pdf_filename=pdf_filename,
        download_url=f"/download/{pdf_filename}"
    )
    ```
  - [ ] Remove Supabase public_url references
  - [ ] Update all response types in function signatures

- **15:00 - 15:30** (0.5h) - Break

- **15:30 - 17:00** (1.5h) - Clean Up Error Handling
  - [ ] Review all try-catch blocks
  - [ ] Remove user-specific error messages
  - [ ] Simplify logging (no user_id references)
  - [ ] Add generic error responses:
    ```python
    except Exception as e:
        logger.error(f"Conversion error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="PDF generation failed. Please try again."
        )
    ```

- **17:00 - 18:00** (1h) - Update requirements.txt
  - [ ] Remove unused dependencies:
    ```bash
    # Comment out or remove these lines
    # supabase==2.15.0
    # storage3==0.11.3
    # resend==2.15.0
    # stripe==12.0.0
    # PyJWT==2.10.1
    ```
  - [ ] Keep essential ones:
    ```
    fastapi==0.115.12
    uvicorn==0.34.0
    langchain==0.3.23
    langchain-google-vertexai==2.0.25
    pdflatex==0.1.3
    python-docx==1.1.2
    PyMuPDF==1.25.5
    python-multipart==0.0.20
    pydantic==2.11.2
    ```
  - [ ] Reinstall:
    ```bash
    pip uninstall supabase storage3 resend stripe PyJWT -y
    pip install -r requirements.txt
    ```

**End of Day Checklist:**
- [ ] Models simplified
- [ ] Download endpoint added
- [ ] Dependencies cleaned up
- [ ] No auth-related code remains

**Expected Issues:**
- FileResponse import might be missing (add: `from fastapi.responses import FileResponse`)

---

### **Day 4: Configure Vertex AI & Test LangChain**

**Daily Goal:** Set up Google Cloud Vertex AI for resume processing

**Time Breakdown:**

- **09:00 - 10:30** (1.5h) - Google Cloud Project Setup
  - [ ] Go to: https://console.cloud.google.com
  - [ ] Create new project: "kairoscv-backend"
  - [ ] Enable Vertex AI API:
    - Navigate to "APIs & Services" > "Library"
    - Search "Vertex AI API"
    - Click "Enable"
  - [ ] Enable billing (required for Vertex AI)
  - [ ] Note project ID (e.g., "kairoscv-backend-123456")

- **10:30 - 12:00** (1.5h) - Service Account Creation
  - [ ] Go to "IAM & Admin" > "Service Accounts"
  - [ ] Click "Create Service Account"
  - [ ] Name: "kairoscv-backend-sa"
  - [ ] Grant roles:
    - "Vertex AI User"
    - "Vertex AI Service Agent"
  - [ ] Click "Create Key" > JSON
  - [ ] Download JSON file (e.g., `kairoscv-backend-sa-key.json`)
  - [ ] Move to safe location:
    ```bash
    mkdir -p ~/.gcp
    mv ~/Downloads/kairoscv-*.json ~/.gcp/kairoscv-sa-key.json
    chmod 600 ~/.gcp/kairoscv-sa-key.json
    ```

- **12:00 - 13:00** (1h) - Lunch Break

- **13:00 - 14:30** (1.5h) - Environment Variables Setup
  - [ ] Create `.env` file in Backend_Modified/:
    ```bash
    # Google Cloud Vertex AI
    GOOGLE_APPLICATION_CREDENTIALS=/Users/yourname/.gcp/kairoscv-sa-key.json
    VERTEX_AI_PROJECT=kairoscv-backend-123456
    VERTEX_AI_LOCATION=us-central1
    VERTEX_AI_MODEL=gemini-1.5-flash-001

    # App Settings
    PORT=8080
    HOST=0.0.0.0
    LOG_LEVEL=info

    # LaTeX Output
    LATEX_OUTPUT_DIR=latex_output
    PDF_OUTPUT_DIR=generated_pdfs
    ```
  - [ ] Load env vars in main.py:
    ```python
    from dotenv import load_dotenv
    load_dotenv()  # Add at top of file
    ```
  - [ ] Install python-dotenv if missing:
    ```bash
    pip install python-dotenv
    ```

- **14:30 - 16:00** (1.5h) - Update resume_processor.py
  - [ ] Open `resume_processor.py`
  - [ ] Update model initialization (lines 36-44):
    ```python
    project = os.getenv("VERTEX_AI_PROJECT")
    location = os.getenv("VERTEX_AI_LOCATION", "us-central1")
    model_name = model_name or os.getenv("VERTEX_AI_MODEL", "gemini-1.5-flash-001")

    if not project:
        raise ValueError("VERTEX_AI_PROJECT not set in environment")

    llm = ChatVertexAI(
        model_name=model_name,
        project=project,
        location=location,
        temperature=temperature,
    )
    ```

- **16:00 - 16:30** (0.5h) - Break

- **16:30 - 18:00** (1.5h) - Test Vertex AI Connection
  - [ ] Create test script `test_vertex_ai.py`:
    ```python
    import os
    from dotenv import load_dotenv
    from langchain_google_vertexai import ChatVertexAI

    load_dotenv()

    project = os.getenv("VERTEX_AI_PROJECT")
    location = os.getenv("VERTEX_AI_LOCATION")

    print(f"Testing Vertex AI connection...")
    print(f"Project: {project}")
    print(f"Location: {location}")

    try:
        llm = ChatVertexAI(
            model_name="gemini-1.5-flash-001",
            project=project,
            location=location,
            temperature=0.3,
        )

        result = llm.invoke("Say 'Hello from Vertex AI!' in one sentence.")
        print(f"✅ Success: {result.content}")
    except Exception as e:
        print(f"❌ Error: {e}")
    ```
  - [ ] Run test:
    ```bash
    python3 test_vertex_ai.py
    ```
  - [ ] Fix any authentication errors
  - [ ] Document successful connection

**End of Day Checklist:**
- [ ] GCP project created
- [ ] Vertex AI enabled
- [ ] Service account configured
- [ ] Test connection successful
- [ ] Environment variables set

**Expected Issues:**
- Billing must be enabled (use free $300 credit)
- Service account permissions might be wrong (re-check roles)
- Environment variable path issues (use absolute paths)
- First API call might take 30-60 seconds (cold start)

---

### **Day 5: Write Prompt Templates**

**Daily Goal:** Create AI prompts for resume processing and LaTeX conversion

**Time Breakdown:**

- **09:00 - 10:00** (1h) - Research & Planning
  - [ ] Review existing Next.js prompts in `lib/ai/gemini-service.ts`
  - [ ] Study Jake's Resume LaTeX template: https://github.com/jakegut/resume
  - [ ] Download Jake's template files for reference
  - [ ] Read LaTeX resume best practices

- **10:00 - 12:00** (2h) - Write LATEX_CONVERSION_PROMPT
  - [ ] Open `Backend_Modified/prompts.py`
  - [ ] Write comprehensive conversion prompt:
    ```python
    LATEX_CONVERSION_PROMPT = """You are an expert LaTeX resume formatter. Convert the following resume data into professional LaTeX code.

Requirements:
- Use a clean, ATS-friendly layout (similar to Jake's Resume template)
- Maintain all original content exactly as provided
- Format dates consistently (Month Year)
- Use proper LaTeX syntax and escaping
- Include all sections: Contact, Education, Experience, Projects, Skills
- Use professional fonts and spacing
- Ensure output compiles with pdflatex

Resume Content (JSON format):
{resume_content}

LaTeX Template Structure:
{latex_template}

Return ONLY the complete LaTeX code, no markdown formatting, no explanations.
The output should start with \\documentclass and end with \\end{{document}}.
"""
    ```

- **12:00 - 13:00** (1h) - Lunch Break

- **13:00 - 15:00** (2h) - Create LATEX_TEMPLATE
  - [ ] Write base LaTeX template (simplified Jake's Resume):
    ```python
    LATEX_TEMPLATE = r"""
\documentclass[letterpaper,11pt]{article}

\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}

\pagestyle{fancy}
\fancyhf{}
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

% Adjust margins
\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-.5in}
\addtolength{\textheight}{1.0in}

\urlstyle{same}

\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

% Sections formatting
\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

% Custom commands
\newcommand{\resumeItem}[1]{
  \item\small{
    {#1 \vspace{-2pt}}
  }
}

\newcommand{\resumeSubheading}[4]{
  \vspace{-2pt}\item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & #2 \\
      \textit{\small#3} & \textit{\small #4} \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeSubItem}[1]{\resumeItem{#1}\vspace{-4pt}}

\renewcommand{\labelitemii}{$\vcenter{\hbox{\tiny$\bullet$}}$}

\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.15in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}

\begin{document}

% CONTACT INFORMATION
\begin{center}
    \textbf{\Huge \scshape [Full Name]} \\ \vspace{1pt}
    \small [Phone] $|$ \href{mailto:[Email]}{[Email]} $|$
    \href{[LinkedIn]}{LinkedIn} $|$
    \href{[GitHub]}{GitHub}
\end{center}

% EDUCATION
\section{Education}
  \resumeSubHeadingListStart
    % Education items will be inserted here
  \resumeSubHeadingListEnd

% EXPERIENCE
\section{Experience}
  \resumeSubHeadingListStart
    % Experience items will be inserted here
  \resumeSubHeadingListEnd

% PROJECTS
\section{Projects}
    \resumeSubHeadingListStart
      % Project items will be inserted here
    \resumeSubHeadingListEnd

% SKILLS
\section{Technical Skills}
 \begin{itemize}[leftmargin=0.15in, label={}]
    \small{\item{
     \textbf{Languages}{: [Languages]} \\
     \textbf{Frameworks}{: [Frameworks]} \\
     \textbf{Developer Tools}{: [Tools]} \\
     \textbf{Libraries}{: [Libraries]} \\
    }}
 \end{itemize}

\end{document}
"""
    ```
  - [ ] Save and test LaTeX compilation:
    ```bash
    echo "$LATEX_TEMPLATE" > test_template.tex
    # Replace placeholders with dummy data
    sed -i 's/\[Full Name\]/John Doe/g' test_template.tex
    pdflatex test_template.tex
    # Check if PDF was created
    ```

- **15:00 - 15:30** (0.5h) - Break

- **15:30 - 17:00** (1.5h) - Write RESUME_TAILORING_PROMPT (Optional)
  - [ ] Add tailoring prompt (for future job matching feature):
    ```python
    RESUME_TAILORING_PROMPT = """You are an expert resume writer. Tailor the following resume to match the job description while maintaining 100% truthfulness.

Instructions:
- Emphasize relevant skills and experiences
- Reorder bullet points to highlight matching qualifications
- Use keywords from the job description naturally
- Do NOT add false information or skills
- Maintain professional tone
- Keep all dates and facts accurate

Original Resume:
{resume_content}

Job Description:
{job_description}

Return the tailored resume in plain text format, structured clearly with sections.
"""
    ```

- **17:00 - 18:00** (1h) - Test Prompts with Vertex AI
  - [ ] Create test script `test_prompts.py`:
    ```python
    from resume_processor import setup_resume_tailoring_chain, generate_latex_resume
    import json

    # Test data
    sample_resume = {
        "basicInfo": {
            "fullName": "Jane Smith",
            "email": "jane@example.com",
            "phone": "+1-234-567-8900",
            "linkedin": "linkedin.com/in/janesmith",
            "github": "github.com/janesmith"
        },
        "skills": {
            "languages": "Python, JavaScript",
            "frameworks": "React, FastAPI",
            "developerTools": "Git, Docker",
            "libraries": "NumPy, Pandas"
        },
        "experience": [],
        "education": [],
        "projects": []
    }

    print("Testing LaTeX conversion...")
    _, latex_chain = setup_resume_tailoring_chain()
    result = await generate_latex_resume(
        json.dumps(sample_resume, indent=2),
        latex_chain
    )
    print(result[:500])  # Print first 500 chars
    ```
  - [ ] Run async test properly
  - [ ] Verify LaTeX code is generated

**End of Day Checklist:**
- [ ] LATEX_CONVERSION_PROMPT written
- [ ] LATEX_TEMPLATE created and tested
- [ ] Prompts tested with Vertex AI
- [ ] LaTeX output verified

**Expected Issues:**
- Prompt engineering requires iteration (test multiple times)
- LaTeX special characters need escaping (%, $, &, #, etc.)
- Template might not compile first try (fix syntax errors)

---

### **Day 6: Implement LaTeX Data Injection**

**Daily Goal:** Build logic to inject resume data into LaTeX template

**Time Breakdown:**

- **09:00 - 10:30** (1.5h) - Create LaTeX Helper Module
  - [ ] Create new file `Backend_Modified/latex_data_mapper.py`:
    ```python
    """Maps resume JSON data to LaTeX template format"""
    import re
    from typing import Dict, List, Any

    def escape_latex(text: str) -> str:
        """Escape special LaTeX characters"""
        replacements = {
            '&': r'\&',
            '%': r'\%',
            '$': r'\$',
            '#': r'\#',
            '_': r'\_',
            '{': r'\{',
            '}': r'\}',
            '~': r'\textasciitilde{}',
            '^': r'\^{}',
            '\\': r'\textbackslash{}',
        }
        for char, replacement in replacements.items():
            text = text.replace(char, replacement)
        return text

    def format_date_range(start: str, end: str, is_present: bool) -> str:
        """Format date range for LaTeX"""
        if is_present:
            return f"{start} -- Present"
        elif end:
            return f"{start} -- {end}"
        else:
            return start

    def generate_contact_section(basic_info: Dict) -> str:
        """Generate LaTeX contact section"""
        name = escape_latex(basic_info.get('fullName', ''))
        phone = escape_latex(basic_info.get('phone', ''))
        email = basic_info.get('email', '')
        linkedin = basic_info.get('linkedin', '')
        github = basic_info.get('github', '')

        return f"""\\begin{{center}}
    \\textbf{{\\Huge \\scshape {name}}} \\\\ \\vspace{{1pt}}
    \\small {phone} $|$ \\href{{mailto:{email}}}{{{email}}} $|$
    \\href{{https://{linkedin}}}{{LinkedIn}} $|$
    \\href{{https://{github}}}{{GitHub}}
\\end{{center}}"""

    # Add more helper functions for education, experience, etc.
    ```
  - [ ] Implement all section generators

- **10:30 - 12:00** (1.5h) - Build Complete Mapper
  - [ ] Add functions for each section:
    ```python
    def generate_education_section(education: List[Dict]) -> str:
        """Generate LaTeX education section"""
        if not education:
            return ""

        items = []
        for edu in education:
            institution = escape_latex(edu.get('institution', ''))
            location = escape_latex(edu.get('location', ''))
            degree = escape_latex(edu.get('degree', ''))
            dates = format_date_range(
                edu.get('startDate', ''),
                edu.get('endDate', ''),
                edu.get('isPresent', False)
            )

            item = f"""    \\resumeSubheading
      {{{institution}}}{{{location}}}
      {{{degree}}}{{{dates}}}"""
            items.append(item)

        return "\\section{Education}\n  \\resumeSubHeadingListStart\n" + \
               "\n".join(items) + "\n  \\resumeSubHeadingListEnd"

    # Similar for experience, projects, skills...
    ```

- **12:00 - 13:00** (1h) - Lunch Break

- **13:00 - 15:00** (2h) - Integrate with resume_processor.py
  - [ ] Update `generate_latex_resume()` function:
    ```python
    async def generate_latex_resume(resume_content: str, chain: RunnableSequence) -> str:
        """
        Generate LaTeX resume from JSON data.
        Uses direct template mapping instead of AI generation for reliability.
        """
        import json
        from latex_data_mapper import (
            generate_contact_section,
            generate_education_section,
            generate_experience_section,
            generate_projects_section,
            generate_skills_section
        )

        # Parse JSON input
        try:
            resume_data = json.loads(resume_content)
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON: {e}")

        # Generate each section
        contact = generate_contact_section(resume_data.get('basicInfo', {}))
        education = generate_education_section(resume_data.get('education', []))
        experience = generate_experience_section(resume_data.get('experience', []))
        projects = generate_projects_section(resume_data.get('projects', []))
        skills = generate_skills_section(resume_data.get('skills', {}))

        # Combine into full LaTeX document
        latex_doc = LATEX_TEMPLATE.replace('[CONTACT]', contact)
        latex_doc = latex_doc.replace('[EDUCATION]', education)
        latex_doc = latex_doc.replace('[EXPERIENCE]', experience)
        latex_doc = latex_doc.replace('[PROJECTS]', projects)
        latex_doc = latex_doc.replace('[SKILLS]', skills)

        return latex_doc
    ```
  - [ ] Update LATEX_TEMPLATE with placeholders

- **15:00 - 15:30** (0.5h) - Break

- **15:30 - 17:30** (2h) - Testing & Debugging
  - [ ] Create comprehensive test:
    ```python
    # test_latex_generation.py
    import json
    from latex_data_mapper import *

    test_data = {
        "basicInfo": {
            "fullName": "John Doe",
            "phone": "+1-555-0123",
            "email": "john.doe@example.com",
            "linkedin": "linkedin.com/in/johndoe",
            "github": "github.com/johndoe"
        },
        "education": [
            {
                "institution": "University of Example",
                "location": "City, ST",
                "degree": "B.S. in Computer Science",
                "startDate": "Sept 2018",
                "endDate": "May 2022",
                "isPresent": False
            }
        ],
        "experience": [
            {
                "organization": "Tech Corp",
                "jobTitle": "Software Engineer",
                "location": "Remote",
                "startDate": "June 2022",
                "endDate": "",
                "isPresent": True,
                "description": [
                    "Built scalable web applications",
                    "Improved performance by 50%"
                ]
            }
        ],
        # ... more sections
    }

    # Test each section
    print(generate_contact_section(test_data['basicInfo']))
    print(generate_education_section(test_data['education']))
    # etc.
    ```
  - [ ] Run tests and fix LaTeX syntax errors
  - [ ] Test full document compilation

- **17:30 - 18:00** (0.5h) - Document Edge Cases
  - [ ] List handled edge cases:
    - Empty sections
    - Missing optional fields
    - Special characters in text
    - Very long bullet points
    - No end date (current position)
  - [ ] Add validation logic

**End of Day Checklist:**
- [ ] LaTeX data mapper created
- [ ] All section generators working
- [ ] Full LaTeX document generation successful
- [ ] Test PDF compiles without errors

**Expected Issues:**
- LaTeX escaping is tricky (test thoroughly with special chars)
- Date formatting inconsistencies
- Long text might overflow LaTeX margins

---

### **Day 7: Backend Testing & Bug Fixes**

**Daily Goal:** End-to-end testing of backend, fix all issues

**Time Breakdown:**

- **09:00 - 10:00** (1h) - Start Backend Server
  - [ ] Activate virtual environment:
    ```bash
    cd Backend_Modified
    source venv/bin/activate
    ```
  - [ ] Start server:
    ```bash
    uvicorn main:app --reload --host 0.0.0.0 --port 8080
    ```
  - [ ] Verify server starts without errors
  - [ ] Check health endpoint:
    ```bash
    curl http://localhost:8080/health
    # Expected: {"message": "API is running!"}
    ```

- **10:00 - 11:30** (1.5h) - Test with Postman/Insomnia
  - [ ] Install Postman or Insomnia
  - [ ] Create test request for `/convert-json-to-latex`:
    ```json
    POST http://localhost:8080/convert-json-to-latex
    Content-Type: application/json

    {
      "basicInfo": {
        "fullName": "Test User",
        "email": "test@example.com",
        "phone": "+1-555-0100",
        "linkedin": "linkedin.com/in/testuser",
        "github": "github.com/testuser"
      },
      "education": [],
      "experience": [],
      "projects": [],
      "skills": {
        "languages": "Python, JavaScript",
        "frameworks": "React, FastAPI",
        "developerTools": "Git, Docker",
        "libraries": "NumPy, Pandas"
      }
    }
    ```
  - [ ] Send request and check response
  - [ ] Verify PDF is created in `generated_pdfs/`
  - [ ] Download and open PDF

- **11:30 - 12:00** (0.5h) - Break

- **12:00 - 14:00** (2h) - Debug Common Errors
  - [ ] Test error scenarios:
    - Invalid JSON
    - Missing required fields
    - Empty data
    - Special characters (test: "O'Brien", "Smith & Co.", "$100K")
  - [ ] Fix LaTeX compilation errors:
    - Check `latex_output/*.log` files
    - Common issues: unescaped characters, missing packages
  - [ ] Add better error messages

- **14:00 - 15:00** (1h) - Lunch Break

- **15:00 - 16:30** (1.5h) - Performance Testing
  - [ ] Test with large resume (20+ experiences, 10+ projects)
  - [ ] Measure response time:
    ```bash
    time curl -X POST http://localhost:8080/convert-json-to-latex \
      -H "Content-Type: application/json" \
      -d @test_large_resume.json
    ```
  - [ ] Target: < 10 seconds total
  - [ ] Optimize if needed (cache templates, parallel processing)

- **16:30 - 17:30** (1h) - Add Logging & Monitoring
  - [ ] Enhance logging in main.py:
    ```python
    import time

    @app.post("/convert-json-to-latex")
    async def convert_json_to_latex_endpoint(resume_data: ResumeData):
        start_time = time.time()
        logger.info(f"Received conversion request")

        try:
            # ... existing code ...

            end_time = time.time()
            duration = end_time - start_time
            logger.info(f"Conversion completed in {duration:.2f}s")

            return response
        except Exception as e:
            logger.error(f"Conversion failed after {time.time() - start_time:.2f}s: {e}")
            raise
    ```
  - [ ] Test logging output

- **17:30 - 18:00** (0.5h) - Week 1 Review
  - [ ] Update PROGRESS_LOG.md with all completed tasks
  - [ ] List remaining issues (if any)
  - [ ] Document workarounds for known bugs
  - [ ] Commit all changes:
    ```bash
    git add Backend_Modified/
    git commit -m "Week 1: Backend setup complete - no auth, LaTeX working"
    ```

**End of Week 1 Checklist:**
- [ ] ✅ Backend running locally
- [ ] ✅ LaTeX PDF generation working
- [ ] ✅ All dependencies installed
- [ ] ✅ Prompts and templates complete
- [ ] ✅ Error handling robust
- [ ] ✅ Code committed to Git

**Expected Issues:**
- pdflatex compilation might fail on first try (check logs)
- Memory issues with large resumes (increase timeout)
- Missing LaTeX packages (install texlive-latex-extra)

---

## **WEEK 2: Prompt Engineering & LaTeX Refinement**

### **Day 8: LaTeX Template Refinement**

**Daily Goal:** Polish LaTeX template to match Jake's Resume quality

**Time Breakdown:**

- **09:00 - 10:30** (1.5h) - Study Jake's Resume
  - [ ] Clone Jake's repo:
    ```bash
    git clone https://github.com/jakegut/resume.git
    cd resume
    ```
  - [ ] Compile Jake's resume:
    ```bash
    pdflatex resume.tex
    open resume.pdf  # or xdg-open on Linux
    ```
  - [ ] Analyze structure:
    - Margins and spacing
    - Font sizes
    - Section formatting
    - Bullet point styles
  - [ ] Take notes on differences from your template

- **10:30 - 12:00** (1.5h) - Update LATEX_TEMPLATE
  - [ ] Copy Jake's preamble (packages, formatting commands)
  - [ ] Adjust margins to match exactly
  - [ ] Update custom commands (resumeItem, resumeSubheading)
  - [ ] Test compilation

- **12:00 - 13:00** (1h) - Lunch Break

- **13:00 - 15:00** (2h) - Fine-Tune Section Formatting
  - [ ] Education section: match Jake's style
  - [ ] Experience section: bullet points, spacing
  - [ ] Projects section: format technologies list
  - [ ] Skills section: categorization
  - [ ] Test with real resume data

- **15:00 - 15:30** (0.5h) - Break

- **15:30 - 17:00** (1.5h) - Handle Edge Cases in LaTeX
  - [ ] Very long bullet points (> 200 chars)
  - [ ] Unicode characters (émojis, special symbols)
  - [ ] URLs with special characters
  - [ ] Multiple page resumes (add page numbering)
  - [ ] Add overflow handling

- **17:00 - 18:00** (1h) - Visual Comparison
  - [ ] Generate PDF with your template
  - [ ] Generate PDF with Jake's template (manually)
  - [ ] Compare side-by-side
  - [ ] Iterate until 95%+ similar

**End of Day Checklist:**
- [ ] Template matches Jake's Resume quality
- [ ] All edge cases handled
- [ ] PDFs compile consistently

---

### **Day 9: AI Prompt Optimization**

**Daily Goal:** Optimize prompts for better AI-generated content

**Time Breakdown:**

- **09:00 - 11:00** (2h) - Test Current Prompts
  - [ ] Create test dataset (10 different resume JSONs)
  - [ ] Run conversions with current prompts
  - [ ] Evaluate output quality:
    - LaTeX syntax errors?
    - Content accuracy?
    - Formatting consistency?
  - [ ] Document issues

- **11:00 - 12:00** (1h) - Improve LATEX_CONVERSION_PROMPT
  - [ ] Add more specific instructions:
    ```python
    LATEX_CONVERSION_PROMPT = """...

    CRITICAL REQUIREMENTS:
    - Escape ALL special characters: & % $ # _ { } ~ ^ \\
    - Use \\href for all URLs
    - Format dates as "Month Year" (e.g., "Jan 2022")
    - Keep bullet points under 200 characters
    - Use \\textbf for bold, \\textit for italic
    - DO NOT use markdown syntax

    ..."""
    ```
  - [ ] Test improvements

- **12:00 - 13:00** (1h) - Lunch Break

- **13:00 - 15:00** (2h) - Implement Fallback Strategy
  - [ ] Add try-catch in generate_latex_resume:
    ```python
    try:
        # Try AI-based generation first
        latex_code = await chain.ainvoke(...)
        # Validate output
        if not latex_code.startswith('\\documentclass'):
            raise ValueError("Invalid LaTeX output")
    except Exception as e:
        logger.warning(f"AI generation failed: {e}, using template mapping")
        # Fallback to direct template mapping
        latex_code = generate_from_template(resume_data)
    ```
  - [ ] Test both paths

- **15:00 - 16:00** (1h) - Add Validation
  - [ ] Create LaTeX validator:
    ```python
    def validate_latex(latex_code: str) -> tuple[bool, list[str]]:
        """Validate LaTeX code for common errors"""
        errors = []

        if not latex_code.startswith('\\documentclass'):
            errors.append("Missing \\documentclass")

        if '\\begin{document}' not in latex_code:
            errors.append("Missing \\begin{document}")

        if '\\end{document}' not in latex_code:
            errors.append("Missing \\end{document}")

        # Check for unescaped special chars
        import re
        unescaped = re.findall(r'(?<!\\)[&%$#_{}~^]', latex_code)
        if unescaped:
            errors.append(f"Unescaped characters: {set(unescaped)}")

        return (len(errors) == 0, errors)
    ```
  - [ ] Integrate into pipeline

- **16:00 - 18:00** (2h) - Benchmark & Optimize
  - [ ] Test 20 different resumes
  - [ ] Measure success rate
  - [ ] Target: 95%+ successful compilations
  - [ ] Fix common failure patterns

**End of Day Checklist:**
- [ ] Prompts optimized
- [ ] Validation added
- [ ] High success rate achieved

---

### **Day 10: Add Optional Features**

**Daily Goal:** Implement nice-to-have features

**Time Breakdown:**

- **09:00 - 11:00** (2h) - Add PDF Metadata
  - [ ] Install PyPDF2 or pypdf:
    ```bash
    pip install pypdf
    ```
  - [ ] Add metadata to generated PDFs:
    ```python
    from pypdf import PdfReader, PdfWriter

    def add_pdf_metadata(pdf_path: str, resume_data: dict):
        """Add metadata to PDF for better organization"""
        reader = PdfReader(pdf_path)
        writer = PdfWriter()

        for page in reader.pages:
            writer.add_page(page)

        writer.add_metadata({
            '/Author': resume_data['basicInfo']['fullName'],
            '/Title': f"{resume_data['basicInfo']['fullName']} - Resume",
            '/Subject': 'Professional Resume',
            '/Creator': 'KairosCV',
            '/Producer': 'LaTeX + KairosCV Backend'
        })

        with open(pdf_path, 'wb') as f:
            writer.write(f)
    ```
  - [ ] Integrate into conversion pipeline

- **11:00 - 12:00** (1h) - Add File Cleanup
  - [ ] Implement automatic cleanup of old files:
    ```python
    import os
    import time

    def cleanup_old_pdfs(max_age_hours=24):
        """Delete PDFs older than max_age_hours"""
        pdf_dir = 'generated_pdfs'
        now = time.time()

        for filename in os.listdir(pdf_dir):
            filepath = os.path.join(pdf_dir, filename)
            file_age = now - os.path.getmtime(filepath)

            if file_age > max_age_hours * 3600:
                os.remove(filepath)
                logger.info(f"Cleaned up old file: {filename}")
    ```
  - [ ] Add scheduled cleanup (run on startup + periodic)

- **12:00 - 13:00** (1h) - Lunch Break

- **13:00 - 14:30** (1.5h) - Add Basic Rate Limiting (IP-based)
  - [ ] Install slowapi:
    ```bash
    pip install slowapi
    ```
  - [ ] Add to main.py:
    ```python
    from slowapi import Limiter, _rate_limit_exceeded_handler
    from slowapi.util import get_remote_address
    from slowapi.errors import RateLimitExceeded

    limiter = Limiter(key_func=get_remote_address)
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    @app.post("/convert-json-to-latex")
    @limiter.limit("10/minute")  # Max 10 requests per minute per IP
    async def convert_json_to_latex_endpoint(
        request: Request,
        resume_data: ResumeData
    ):
        # ... existing code ...
    ```

- **14:30 - 16:00** (1.5h) - Add CORS Configuration
  - [ ] Update main.py CORS settings:
    ```python
    from fastapi.middleware.cors import CORSMiddleware

    # For development
    origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",  # Vite dev server
    ]

    # For production (update later)
    if os.getenv("PRODUCTION"):
        origins.append("https://yourdomain.com")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=False,  # No auth cookies
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type"],
    )
    ```

- **16:00 - 17:00** (1h) - Add Health Check Details
  - [ ] Enhance health endpoint:
    ```python
    @app.get("/health")
    async def health_check():
        """Detailed health check"""
        import subprocess

        # Check pdflatex
        try:
            result = subprocess.run(
                ['pdflatex', '--version'],
                capture_output=True,
                timeout=5
            )
            pdflatex_ok = result.returncode == 0
        except:
            pdflatex_ok = False

        # Check Vertex AI
        vertex_ai_ok = bool(os.getenv('VERTEX_AI_PROJECT'))

        status = "healthy" if (pdflatex_ok and vertex_ai_ok) else "degraded"

        return {
            "status": status,
            "pdflatex": "ok" if pdflatex_ok else "error",
            "vertex_ai": "configured" if vertex_ai_ok else "missing",
            "timestamp": time.time()
        }
    ```

- **17:00 - 18:00** (1h) - Testing & Documentation
  - [ ] Test all new features
  - [ ] Update README with new endpoints
  - [ ] Document rate limits

**End of Day Checklist:**
- [ ] PDF metadata added
- [ ] Cleanup implemented
- [ ] Rate limiting working
- [ ] CORS configured

---

### **Day 11-14: Buffer & Polish**

**Daily Goal:** Polish backend, fix bugs, prepare for frontend integration

I'll create a condensed plan for these days:

**Day 11: Error Handling & Edge Cases** (8 hours)
- Comprehensive error testing
- Add error codes and messages
- Handle malformed JSON gracefully
- Test timeout scenarios

**Day 12: Performance Optimization** (8 hours)
- Profile slow operations
- Add caching for templates
- Optimize LaTeX compilation
- Test concurrency (multiple requests)

**Day 13: Documentation** (8 hours)
- Write API documentation (OpenAPI/Swagger)
- Create usage examples
- Document deployment process
- Write troubleshooting guide

**Day 14: Final Backend Testing** (8 hours)
- End-to-end testing
- Load testing (Apache Bench or similar)
- Fix any remaining bugs
- Prepare for deployment

---

## **WEEK 3: Frontend Integration**

### **Day 15: Frontend Analysis & Planning**

**Daily Goal:** Understand current frontend, plan integration points

**Time Breakdown:**

- **09:00 - 10:30** (1.5h) - Current Frontend Review
  - [ ] Read `app/page.tsx` - main UI flow
  - [ ] Read `app/api/upload/route.ts` - file upload
  - [ ] Read `app/api/stream/[fileId]/route.ts` - SSE streaming
  - [ ] Read `lib/resume-processor.ts` - current processing
  - [ ] Read `hooks/use-resume-optimizer.ts` - state management
  - [ ] Document current data flow

- **10:30 - 12:00** (1.5h) - Integration Design
  - [ ] Design hybrid approach:
    ```
    User uploads file
    → Frontend parses & extracts data (Gemini AI)
    → Convert to ParsedResume format
    → Send to backend /convert-json-to-latex
    → Get PDF download URL
    → Show to user
    ```
  - [ ] Identify files to modify
  - [ ] Plan backward compatibility (keep Puppeteer as fallback)

- **12:00 - 13:00** (1h) - Lunch Break

- **13:00 - 15:00** (2h) - Create Integration Layer
  - [ ] Create new file `lib/services/backend-api.ts`:
    ```typescript
    // Backend API client
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

    export interface BackendResumeData {
      basicInfo: {
        fullName: string
        email: string
        phone: string
        linkedin: string
        github: string
        website?: string
      }
      education: Array<{
        id: string
        institution: string
        location: string
        degree: string
        minor?: string
        startDate: string
        endDate?: string
        isPresent: boolean
      }>
      // ... rest of schema
    }

    export interface BackendResponse {
      message: string
      pdf_filename: string
      download_url: string
    }

    export async function generatePDFWithBackend(
      data: BackendResumeData
    ): Promise<BackendResponse> {
      const response = await fetch(`${BACKEND_URL}/convert-json-to-latex`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Backend generation failed')
      }

      return await response.json()
    }

    export async function downloadPDFFromBackend(
      filename: string
    ): Promise<Blob> {
      const response = await fetch(`${BACKEND_URL}/download/${filename}`)

      if (!response.ok) {
        throw new Error('PDF download failed')
      }

      return await response.blob()
    }
    ```

- **15:00 - 15:30** (0.5h) - Break

- **15:30 - 17:30** (2h) - Data Transformation Layer
  - [ ] Create `lib/mappers/resume-to-backend.ts`:
    ```typescript
    import { ParsedResume } from '@/lib/parsers/enhanced-parser'
    import { BackendResumeData } from '@/lib/services/backend-api'

    export function mapParsedResumeToBackend(
      parsed: ParsedResume
    ): BackendResumeData {
      return {
        basicInfo: {
          fullName: parsed.contact.name,
          email: parsed.contact.email,
          phone: parsed.contact.phone,
          linkedin: parsed.contact.linkedin,
          github: parsed.contact.github,
          website: parsed.contact.website,
        },
        education: parsed.education.map((edu, idx) => ({
          id: `edu_${idx}`,
          institution: edu.institution,
          location: edu.location,
          degree: edu.degree,
          minor: edu.fieldOfStudy,
          startDate: edu.startDate,
          endDate: edu.endDate,
          isPresent: edu.current || false,
        })),
        experience: parsed.experience.map((exp, idx) => ({
          id: `exp_${idx}`,
          organization: exp.company,
          jobTitle: exp.title,
          location: exp.location,
          startDate: exp.startDate,
          endDate: exp.endDate,
          isPresent: exp.current || false,
          description: exp.bullets,
        })),
        projects: parsed.projects.map((proj, idx) => ({
          id: `proj_${idx}`,
          name: proj.name,
          technologies: proj.technologies.join(', '),
          startDate: proj.startDate || '2024',
          endDate: proj.endDate,
          isPresent: false,
          description: proj.description,
        })),
        skills: {
          languages: parsed.skills.languages.join(', '),
          frameworks: parsed.skills.frameworks.join(', '),
          developerTools: parsed.skills.tools.join(', '),
          libraries: parsed.skills.databases.join(', '),
        },
      }
    }
    ```
  - [ ] Add validation

- **17:30 - 18:00** (0.5h) - Environment Setup
  - [ ] Add to `.env.local`:
    ```bash
    NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
    NEXT_PUBLIC_USE_BACKEND=true
    ```
  - [ ] Create `.env.example` update

**End of Day Checklist:**
- [ ] Integration plan documented
- [ ] Backend API client created
- [ ] Data mapper implemented
- [ ] Environment configured

---

### **Day 16: Modify Resume Processor**

**Daily Goal:** Integrate backend into main processing pipeline

**Time Breakdown:**

- **09:00 - 11:00** (2h) - Update resume-processor.ts
  - [ ] Open `lib/resume-processor.ts`
  - [ ] Add backend integration at PDF generation stage:
    ```typescript
    // Around line 398 (after enhancement complete)
    const USE_BACKEND = process.env.NEXT_PUBLIC_USE_BACKEND === 'true'

    if (USE_BACKEND) {
      yield {
        stage: "generating",
        progress: 80,
        message: "Generating professional LaTeX PDF via backend..."
      }

      try {
        // Convert to backend format
        const backendData = mapParsedResumeToBackend(parsedResume)

        // Call backend
        const backendResponse = await generatePDFWithBackend(backendData)

        // Download PDF from backend
        const pdfBlob = await downloadPDFFromBackend(backendResponse.pdf_filename)
        const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer())

        // Save locally for download
        await saveGeneratedPDF(fileId, pdfBuffer)

        yield {
          stage: "complete",
          progress: 100,
          message: "LaTeX PDF generated successfully!"
        }
      } catch (error) {
        console.error('Backend generation failed:', error)
        // Fallback to Puppeteer
        yield {
          stage: "generating",
          progress: 85,
          message: "Backend unavailable, using fallback generator..."
        }
        const pdfBuffer = await generatePDF(parsedResume, summary)
        await saveGeneratedPDF(fileId, pdfBuffer)
      }
    } else {
      // Original Puppeteer path
      const pdfBuffer = await generatePDF(parsedResume, summary)
      await saveGeneratedPDF(fileId, pdfBuffer)
    }
    ```

- **11:00 - 12:00** (1h) - Add Error Handling
  - [ ] Handle network errors
  - [ ] Handle timeout errors (set 30s timeout)
  - [ ] Add retry logic (1 retry with 2s delay)
  - [ ] Log all errors for debugging

- **12:00 - 13:00** (1h) - Lunch Break

- **13:00 - 15:00** (2h) - Testing Integration
  - [ ] Start backend: `cd Backend_Modified && uvicorn main:app --reload`
  - [ ] Start frontend: `pnpm dev`
  - [ ] Upload test resume
  - [ ] Verify backend is called
  - [ ] Check PDF quality
  - [ ] Compare with Puppeteer output

- **15:00 - 15:30** (0.5h) - Break

- **15:30 - 17:00** (1.5h) - Add Backend Health Check
  - [ ] Create `lib/services/backend-health.ts`:
    ```typescript
    export async function checkBackendHealth(): Promise<boolean> {
      try {
        const response = await fetch(`${BACKEND_URL}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000), // 5s timeout
        })

        if (!response.ok) return false

        const data = await response.json()
        return data.status === 'healthy'
      } catch (error) {
        console.error('Backend health check failed:', error)
        return false
      }
    }
    ```
  - [ ] Call on app startup
  - [ ] Disable backend if unhealthy

- **17:00 - 18:00** (1h) - Add User Feedback
  - [ ] Show "Using professional LaTeX engine" message when backend is used
  - [ ] Show "Using standard engine" when Puppeteer is used
  - [ ] Add toggle in UI (optional: let user choose)

**End of Day Checklist:**
- [ ] Backend integrated into pipeline
- [ ] Fallback working
- [ ] Error handling robust
- [ ] User feedback clear

---

### **Day 17-18: UI Updates & Testing**

**Day 17: UI Improvements** (8 hours)
- Add "PDF Quality" selector (Standard vs. Professional)
- Show backend status indicator
- Improve progress messages
- Add download button for both versions
- Polish UI/UX

**Day 18: Frontend Testing** (8 hours)
- Test with 20+ different resumes
- Test error scenarios (backend down, timeout, etc.)
- Test edge cases (empty sections, special characters)
- Cross-browser testing
- Mobile responsiveness

---

### **Day 19-21: End-to-End Testing**

**Day 19: Integration Testing** (8 hours)
- Test full flow: Upload → Process → Backend → Download
- Test both paths (backend + Puppeteer fallback)
- Performance testing (measure time differences)
- Memory usage testing
- Concurrent uploads

**Day 20: Quality Assurance** (8 hours)
- Visual PDF comparison (LaTeX vs. Puppeteer)
- ATS compatibility testing (use Jobscan.co)
- Print quality testing
- Font rendering testing
- Multi-page resume testing

**Day 21: Bug Fixes & Polish** (8 hours)
- Fix all identified bugs
- Optimize slow operations
- Improve error messages
- Code cleanup and refactoring
- Documentation updates

---

## **WEEK 4: Deployment & Launch**

### **Day 22: Deployment Preparation**

**Daily Goal:** Prepare both services for production deployment

**Time Breakdown:**

- **09:00 - 11:00** (2h) - Dockerize Backend
  - [ ] Update `Backend_Modified/Dockerfile`:
    ```dockerfile
    FROM python:3.11-slim

    ENV DEBIAN_FRONTEND=noninteractive \
        PYTHONUNBUFFERED=1

    # Install LaTeX and system dependencies
    RUN apt-get update && apt-get install -y --no-install-recommends \
        texlive-latex-base \
        texlive-fonts-recommended \
        texlive-latex-extra \
        && apt-get clean && rm -rf /var/lib/apt/lists/*

    WORKDIR /app

    COPY requirements.txt .
    RUN pip install --no-cache-dir --upgrade pip && \
        pip install --no-cache-dir -r requirements.txt

    COPY . .

    # Create output directories
    RUN mkdir -p latex_output generated_pdfs

    EXPOSE 8080

    CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
    ```
  - [ ] Test Docker build locally:
    ```bash
    docker build -t kairoscv-backend .
    docker run -p 8080:8080 --env-file .env kairoscv-backend
    ```

- **11:00 - 12:00** (1h) - Create render.yaml
  - [ ] Create `Backend_Modified/render.yaml`:
    ```yaml
    services:
      - type: web
        name: kairoscv-backend
        runtime: docker
        repo: https://github.com/yourusername/KairosCV
        rootDir: Backend_Modified
        dockerfilePath: ./Dockerfile
        envVars:
          - key: VERTEX_AI_PROJECT
            sync: false
          - key: VERTEX_AI_LOCATION
            value: us-central1
          - key: VERTEX_AI_MODEL
            value: gemini-1.5-flash-001
          - key: GOOGLE_APPLICATION_CREDENTIALS
            sync: false
          - fromGroup: backend-secrets
        healthCheckPath: /health
        autoDeploy: false
    ```

- **12:00 - 13:00** (1h) - Lunch Break

- **13:00 - 15:00** (2h) - Environment Variables Management
  - [ ] Create production .env template
  - [ ] Document all required env vars
  - [ ] Set up Render environment groups:
    - `backend-secrets`: VERTEX_AI_PROJECT, GOOGLE_APPLICATION_CREDENTIALS
  - [ ] Upload service account JSON securely

- **15:00 - 16:00** (1h) - Frontend Production Config
  - [ ] Update `next.config.mjs`:
    ```javascript
    const config = {
      env: {
        NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
        NEXT_PUBLIC_USE_BACKEND: process.env.NEXT_PUBLIC_USE_BACKEND,
      },
      // ... rest
    }
    ```
  - [ ] Set Render env vars for frontend

- **16:00 - 18:00** (2h) - Security Hardening
  - [ ] Add rate limiting config for production
  - [ ] Disable debug logging in production
  - [ ] Add request size limits
  - [ ] Sanitize error messages (no stack traces to users)
  - [ ] Add security headers

**End of Day Checklist:**
- [ ] Dockerfile working
- [ ] render.yaml configured
- [ ] Environment variables documented
- [ ] Security measures in place

---

### **Day 23: Deploy Backend to Render**

**Daily Goal:** Deploy backend to production

**Time Breakdown:**

- **09:00 - 10:00** (1h) - Render Setup
  - [ ] Create Render account (if not exists)
  - [ ] Link GitHub repository
  - [ ] Create new Web Service
  - [ ] Select Docker runtime
  - [ ] Choose free tier (or paid if needed)

- **10:00 - 11:30** (1.5h) - Configure Deployment
  - [ ] Set root directory: `Backend_Modified`
  - [ ] Set build command: (Auto-detected from Dockerfile)
  - [ ] Set start command: (Auto-detected from Dockerfile)
  - [ ] Add all environment variables
  - [ ] Upload service account JSON as file

- **11:30 - 12:00** (0.5h) - Initial Deploy
  - [ ] Click "Deploy"
  - [ ] Monitor build logs
  - [ ] Wait for deployment (15-30 minutes for LaTeX install)

- **12:00 - 13:00** (1h) - Lunch Break (while deployment completes)

- **13:00 - 14:30** (1.5h) - Post-Deployment Testing
  - [ ] Get deployed URL: `https://kairoscv-backend.onrender.com`
  - [ ] Test health endpoint:
    ```bash
    curl https://kairoscv-backend.onrender.com/health
    ```
  - [ ] Test PDF generation:
    ```bash
    curl -X POST https://kairoscv-backend.onrender.com/convert-json-to-latex \
      -H "Content-Type: application/json" \
      -d @test_resume.json
    ```
  - [ ] Download and verify PDF

- **14:30 - 16:00** (1.5h) - Troubleshooting
  - [ ] Check Render logs for errors
  - [ ] Common issues:
    - pdflatex not found (check Dockerfile)
    - Service account auth failed (check file upload)
    - Out of memory (upgrade to paid tier)
    - Timeout (increase timeout settings)
  - [ ] Fix and redeploy if needed

- **16:00 - 17:00** (1h) - Performance Testing
  - [ ] Test response times from different locations
  - [ ] Load testing (10 concurrent requests)
  - [ ] Check resource usage in Render dashboard
  - [ ] Verify auto-scaling works (if enabled)

- **17:00 - 18:00** (1h) - Monitoring Setup
  - [ ] Enable Render metrics
  - [ ] Set up uptime monitoring (UptimeRobot)
  - [ ] Configure alerts for downtime
  - [ ] Set up log aggregation

**End of Day Checklist:**
- [ ] Backend deployed and running
- [ ] Health check passing
- [ ] PDF generation working
- [ ] Monitoring enabled

**Expected Issues:**
- Build might fail first time (LaTeX installation issues)
- Memory limits on free tier (upgrade if needed)
- Cold start times ~30s (first request after idle)

---

### **Day 24: Deploy Frontend with Backend Integration**

**Daily Goal:** Deploy frontend pointing to production backend

**Time Breakdown:**

- **09:00 - 10:00** (1h) - Update Frontend Config
  - [ ] Update `.env.production`:
    ```bash
    NEXT_PUBLIC_BACKEND_URL=https://kairoscv-backend.onrender.com
    NEXT_PUBLIC_USE_BACKEND=true
    GOOGLE_GEMINI_API_KEY=your-key
    ```
  - [ ] Commit changes to main branch

- **10:00 - 11:00** (1h) - Deploy to Render
  - [ ] Push to GitHub
  - [ ] Render auto-deploys frontend
  - [ ] Monitor build logs
  - [ ] Wait for deployment (~5-10 minutes)

- **11:00 - 12:00** (1h) - Initial Testing
  - [ ] Visit deployed site
  - [ ] Upload test resume
  - [ ] Verify backend is called (check Network tab)
  - [ ] Download and check PDF quality
  - [ ] Test fallback (temporarily stop backend)

- **12:00 - 13:00** (1h) - Lunch Break

- **13:00 - 15:00** (2h) - Comprehensive Testing
  - [ ] Test from different devices (phone, tablet, laptop)
  - [ ] Test different browsers (Chrome, Firefox, Safari)
  - [ ] Test edge cases (large files, special characters)
  - [ ] Test error scenarios
  - [ ] Verify all features working

- **15:00 - 16:30** (1.5h) - Performance Optimization
  - [ ] Check Lighthouse scores
  - [ ] Optimize images
  - [ ] Enable caching
  - [ ] Minify assets
  - [ ] Test Core Web Vitals

- **16:30 - 18:00** (1.5h) - Final Adjustments
  - [ ] Fix any bugs found
  - [ ] Optimize user flow
  - [ ] Improve error messages
  - [ ] Polish UI details
  - [ ] Update documentation

**End of Day Checklist:**
- [ ] Frontend deployed
- [ ] Backend integration working
- [ ] All features functional
- [ ] Performance optimized

---

### **Day 25-27: Testing & Bug Fixes**

**Day 25: User Acceptance Testing** (8 hours)
- Invite beta testers (5-10 people)
- Collect feedback
- Document all issues
- Prioritize bugs
- Start fixing critical bugs

**Day 26: Bug Fixing** (8 hours)
- Fix all critical bugs
- Fix major bugs
- Address minor issues
- Improve UX based on feedback
- Re-test after fixes

**Day 27: Final Testing** (8 hours)
- Complete regression testing
- Test all user flows
- Performance testing
- Security testing
- Documentation updates

---

### **Day 28: Launch Preparation**

**Daily Goal:** Final checks and launch prep

**Time Breakdown:**

- **09:00 - 11:00** (2h) - Final Code Review
  - [ ] Review all modified code
  - [ ] Remove debug logs
  - [ ] Check for TODO comments
  - [ ] Ensure consistent code style
  - [ ] Update comments and documentation

- **11:00 - 12:00** (1h) - Documentation
  - [ ] Update README.md
  - [ ] Create USER_GUIDE.md
  - [ ] Document API endpoints
  - [ ] Create troubleshooting guide
  - [ ] Write deployment guide

- **12:00 - 13:00** (1h) - Lunch Break

- **13:00 - 15:00** (2h) - Backup & Rollback Plan
  - [ ] Create production backup
  - [ ] Document rollback procedure
  - [ ] Test rollback process
  - [ ] Create incident response plan

- **15:00 - 16:00** (1h) - Analytics Setup
  - [ ] Add Google Analytics (if desired)
  - [ ] Set up conversion tracking
  - [ ] Monitor backend metrics
  - [ ] Track error rates

- **16:00 - 18:00** (2h) - Final Checks
  - [ ] Complete pre-launch checklist
  - [ ] Test all critical paths
  - [ ] Verify monitoring
  - [ ] Check backup systems
  - [ ] Team walkthrough

**End of Day Checklist:**
- [ ] All documentation complete
- [ ] Rollback plan tested
- [ ] Analytics configured
- [ ] Ready for launch

---

### **Day 29: Soft Launch**

**Daily Goal:** Launch to limited audience, monitor closely

**Time Breakdown:**

- **09:00 - 10:00** (1h) - Pre-Launch Meeting
  - [ ] Review launch checklist
  - [ ] Assign monitoring responsibilities
  - [ ] Confirm rollback triggers
  - [ ] Set up communication channel (Slack/Discord)

- **10:00 - 10:30** (0.5h) - **LAUNCH** 🚀
  - [ ] Make site public (remove "Coming Soon" if present)
  - [ ] Announce to small group (friends, colleagues)
  - [ ] Monitor first users in real-time

- **10:30 - 12:00** (1.5h) - Active Monitoring
  - [ ] Watch Render logs
  - [ ] Monitor error rates
  - [ ] Check response times
  - [ ] Track conversion funnel
  - [ ] Respond to issues immediately

- **12:00 - 13:00** (1h) - Lunch Break

- **13:00 - 15:00** (2h) - User Support
  - [ ] Answer user questions
  - [ ] Fix urgent bugs
  - [ ] Collect feedback
  - [ ] Document common issues

- **15:00 - 17:00** (2h) - Expand Audience
  - [ ] Post on Twitter/LinkedIn
  - [ ] Share on Reddit (r/resumes, r/jobs)
  - [ ] Share on ProductHunt (optional)
  - [ ] Email wider circle

- **17:00 - 18:00** (1h) - End of Day Review
  - [ ] Analyze metrics
  - [ ] List action items
  - [ ] Plan tomorrow's fixes
  - [ ] Celebrate wins! 🎉

**End of Day Checklist:**
- [ ] Site live and stable
- [ ] First users successful
- [ ] No critical issues
- [ ] Monitoring working

---

### **Day 30: Optimization & Handoff**

**Daily Goal:** Optimize based on real usage, document learnings

**Time Breakdown:**

- **09:00 - 11:00** (2h) - Data Analysis
  - [ ] Review usage patterns
  - [ ] Identify bottlenecks
  - [ ] Check error logs
  - [ ] Analyze user behavior
  - [ ] Calculate costs

- **11:00 - 12:00** (1h) - Quick Optimizations
  - [ ] Fix most common errors
  - [ ] Optimize slow endpoints
  - [ ] Improve user messaging
  - [ ] Deploy fixes

- **12:00 - 13:00** (1h) - Lunch Break

- **13:00 - 15:00** (2h) - Documentation Finalization
  - [ ] Write post-mortem document
  - [ ] Document lessons learned
  - [ ] Update maintenance guide
  - [ ] Create runbook for common issues
  - [ ] Finalize cost analysis

- **15:00 - 16:00** (1h) - Future Planning
  - [ ] Create roadmap for next features
  - [ ] Prioritize improvements
  - [ ] Document technical debt
  - [ ] Plan authentication integration (for later)

- **16:00 - 17:30** (1.5h) - Knowledge Transfer
  - [ ] Create video walkthrough
  - [ ] Document codebase structure
  - [ ] Explain architecture decisions
  - [ ] Share access credentials securely

- **17:30 - 18:00** (0.5h) - **Project Complete!** ✅
  - [ ] Final commit
  - [ ] Tag release: `git tag v1.0.0-backend-integration`
  - [ ] Backup all code
  - [ ] Update PROGRESS_LOG.md
  - [ ] Celebrate! 🎊

**End of Day Checklist:**
- [ ] All documentation complete
- [ ] Production stable
- [ ] Team trained
- [ ] Handoff complete

---

## ⚠️ Potential Problems & Solutions

### Problem 1: LaTeX Installation Fails on Render

**Likelihood:** Medium
**Impact:** High (Blocks deployment)

**Symptoms:**
- Docker build fails with "pdflatex: command not found"
- Build times out (> 15 minutes)

**Solutions:**
1. **Use smaller LaTeX distribution:**
   ```dockerfile
   RUN apt-get install texlive-latex-base texlive-fonts-recommended
   # Skip texlive-latex-extra if too large
   ```

2. **Pre-build Docker image:**
   - Build image locally
   - Push to Docker Hub
   - Use in Render: `FROM yourusername/kairoscv-backend:latest`

3. **Alternative: Use Tectonic (smaller LaTeX engine):**
   ```dockerfile
   RUN cargo install tectonic
   ```

**Prevention:**
- Test Docker build locally before deploying
- Monitor build times
- Have fallback ready (Puppeteer-only mode)

---

### Problem 2: Backend Exceeds Free Tier Memory (512MB)

**Likelihood:** High
**Impact:** Medium (Service crashes under load)

**Symptoms:**
- "Out of memory" errors in logs
- Service restarts frequently
- Slow response times

**Solutions:**
1. **Upgrade to paid tier ($7/month for 2GB RAM)**

2. **Optimize memory usage:**
   ```python
   # Clean up after each conversion
   import gc

   @app.post("/convert-json-to-latex")
   async def convert_json_to_latex_endpoint(resume_data: ResumeData):
       try:
           # ... conversion logic ...
           return response
       finally:
           gc.collect()  # Force garbage collection
   ```

3. **Limit concurrent requests:**
   ```python
   from fastapi import BackgroundTasks

   MAX_CONCURRENT = 2
   current_processing = 0

   @app.post("/convert-json-to-latex")
   async def convert_json_to_latex_endpoint(...):
       global current_processing

       if current_processing >= MAX_CONCURRENT:
           raise HTTPException(429, "Server busy, please try again")

       current_processing += 1
       try:
           # ... process ...
       finally:
           current_processing -= 1
   ```

**Prevention:**
- Load test before launch
- Monitor memory usage
- Set up alerts for high memory

---

### Problem 3: Vertex AI Quota Exceeded

**Likelihood:** Medium (if app goes viral)
**Impact:** High (AI features stop working)

**Symptoms:**
- "Quota exceeded" errors from Vertex AI
- 429 status codes
- Users can't generate resumes

**Solutions:**
1. **Request quota increase:**
   - Go to GCP Console → IAM & Admin → Quotas
   - Request increase for "Vertex AI API requests per minute"

2. **Implement caching:**
   ```python
   from functools import lru_cache

   @lru_cache(maxsize=100)
   def generate_latex_for_data(resume_json: str) -> str:
       # Only call AI if not in cache
       return ai_generated_latex
   ```

3. **Fall back to template-based generation:**
   ```python
   try:
       latex = await generate_with_ai(resume_data)
   except QuotaExceeded:
       logger.warning("Quota exceeded, using template")
       latex = generate_from_template(resume_data)
   ```

**Prevention:**
- Monitor quota usage daily
- Set up billing alerts
- Have template fallback ready

---

### Problem 4: CORS Errors (Backend ↔ Frontend)

**Likelihood:** High
**Impact:** Medium (Frontend can't call backend)

**Symptoms:**
- "CORS policy blocked" errors in browser console
- Requests fail with status 0
- No data returned

**Solutions:**
1. **Verify CORS configuration in main.py:**
   ```python
   origins = [
       "http://localhost:3000",
       "https://yourdomain.com",
       "https://kairoscv.onrender.com",  # Add your frontend URL
   ]

   app.add_middleware(
       CORSMiddleware,
       allow_origins=origins,
       allow_credentials=False,
       allow_methods=["GET", "POST"],
       allow_headers=["*"],  # Be permissive for debugging
   )
   ```

2. **Temporary workaround (dev only):**
   ```python
   allow_origins=["*"]  # Allow all origins
   ```

3. **Check request headers:**
   - Ensure `Content-Type: application/json`
   - Remove unnecessary headers

**Prevention:**
- Test CORS in development
- Document frontend URLs
- Use environment variables for origins

---

### Problem 5: Cold Start Latency (30-60 seconds)

**Likelihood:** High (on free tier)
**Impact:** Low-Medium (Poor UX for first user)

**Symptoms:**
- First request takes 30-60s
- Subsequent requests are fast
- "Server warming up" messages

**Solutions:**
1. **Upgrade to paid tier** (always-on instances)

2. **Implement keep-alive pings:**
   ```python
   # Scheduled task to ping every 10 minutes
   import asyncio

   async def keep_alive():
       while True:
           await asyncio.sleep(600)  # 10 min
           requests.get(f"{BACKEND_URL}/health")
   ```

3. **Show user feedback:**
   ```typescript
   // Frontend
   if (isFirstRequest) {
       toast({
           title: "Warming up servers...",
           description: "This may take 30 seconds on first use."
       })
   }
   ```

**Prevention:**
- Set user expectations
- Consider paid tier if budget allows
- Cache results to reduce backend calls

---

### Problem 6: Special Characters Break LaTeX

**Likelihood:** High
**Impact:** Medium (PDFs fail to compile)

**Symptoms:**
- pdflatex errors in logs
- Missing PDF output
- Weird characters in PDF

**Solutions:**
1. **Strict escaping in latex_data_mapper.py:**
   ```python
   def escape_latex(text: str) -> str:
       # Comprehensive escaping
       text = text.replace('\\', r'\textbackslash{}')
       text = text.replace('&', r'\&')
       text = text.replace('%', r'\%')
       text = text.replace('$', r'\$')
       text = text.replace('#', r'\#')
       text = text.replace('_', r'\_')
       text = text.replace('{', r'\{')
       text = text.replace('}', r'\}')
       text = text.replace('~', r'\textasciitilde{}')
       text = text.replace('^', r'\^{}')
       text = text.replace('<', r'\textless{}')
       text = text.replace('>', r'\textgreater{}')
       return text
   ```

2. **Validate input:**
   ```python
   def sanitize_resume_data(data: dict) -> dict:
       # Remove or replace problematic characters
       # before processing
       return cleaned_data
   ```

3. **Test with problematic data:**
   - Names: O'Brien, José García, 李明
   - Companies: AT&T, Procter & Gamble
   - Symbols: $100K salary, C++ developer

**Prevention:**
- Comprehensive escaping function
- Unit tests for special characters
- Validate all user input

---

### Problem 7: Data Loss (Missing Fields After Conversion)

**Likelihood:** Medium
**Impact:** High (User data not preserved)

**Symptoms:**
- Certifications missing from PDF
- Awards not showing
- Custom sections ignored

**Solutions:**
1. **Extend backend schema to match frontend:**
   ```python
   # In models.py, add missing fields
   class ResumeData(BaseModel):
       basicInfo: BasicInfo
       education: list[EducationItem]
       experience: list[ExperienceItem]
       projects: list[ProjectItem]
       skills: Skills
       certifications: list[CertificationItem] = []  # ADD
       awards: list[AwardItem] = []  # ADD
       # ... etc
   ```

2. **Update mapper to include all fields:**
   ```typescript
   // In resume-to-backend.ts
   certifications: parsed.certifications || [],
   awards: parsed.awards || [],
   ```

3. **Gracefully handle missing sections:**
   ```python
   # In latex_data_mapper.py
   if resume_data.get('certifications'):
       latex += generate_certifications_section(resume_data['certifications'])
   ```

**Prevention:**
- Schema validation tests
- Full data round-trip tests
- Document schema differences

---

### Problem 8: Cost Overruns

**Likelihood:** Medium (if app gets popular)
**Impact:** High (Budget exceeded)

**Symptoms:**
- Unexpected bills from GCP, Render
- Vertex AI costs > $50/month
- Storage costs increasing

**Solutions:**
1. **Set billing alerts:**
   - GCP: Set budget alerts at $25, $50, $100
   - Render: Monitor usage dashboard daily

2. **Implement usage limits:**
   ```python
   # IP-based daily limits
   from collections import defaultdict
   import time

   usage_tracker = defaultdict(list)

   def check_rate_limit(ip: str, max_per_day: int = 10):
       now = time.time()
       usage = usage_tracker[ip]

       # Remove old entries (>24h)
       usage = [t for t in usage if now - t < 86400]

       if len(usage) >= max_per_day:
           raise HTTPException(429, "Daily limit reached")

       usage.append(now)
       usage_tracker[ip] = usage
   ```

3. **Optimize API usage:**
   - Cache Vertex AI responses
   - Reduce prompt sizes
   - Use batch processing

**Prevention:**
- Daily cost monitoring
- Usage analytics
- Budget planning

---

### Problem 9: Frontend Build Fails After Backend Changes

**Likelihood:** Low
**Impact:** Medium (Deployment blocked)

**Symptoms:**
- TypeScript errors
- Import errors
- Type mismatches

**Solutions:**
1. **Keep types in sync:**
   ```typescript
   // Create shared types file
   // types/backend.ts
   export interface BackendResumeData {
       // ... match Python Pydantic models exactly
   }
   ```

2. **Add validation:**
   ```typescript
   import { z } from 'zod'

   const BackendResponseSchema = z.object({
       message: z.string(),
       pdf_filename: z.string(),
       download_url: z.string(),
   })

   // Validate response
   const validated = BackendResponseSchema.parse(response)
   ```

3. **Test builds locally:**
   ```bash
   pnpm build
   # Fix errors before pushing
   ```

**Prevention:**
- Type checking in CI/CD
- Schema validation tests
- Shared type definitions

---

### Problem 10: Users Confused by Two PDF Options

**Likelihood:** Medium
**Impact:** Low (UX issue)

**Symptoms:**
- Users ask "which PDF should I download?"
- Confusion about differences
- Support requests

**Solutions:**
1. **Clear labeling:**
   ```tsx
   <Button>
     Download Professional PDF (LaTeX)
     <span className="text-xs">Recommended for job applications</span>
   </Button>

   <Button variant="secondary">
     Download Standard PDF
     <span className="text-xs">Faster generation</span>
   </Button>
   ```

2. **Default to best option:**
   - Only show LaTeX version by default
   - Hide Puppeteer option unless backend fails
   - Remove choice entirely (LaTeX only)

3. **Add help text:**
   - Tooltip explaining differences
   - Link to FAQ
   - Visual comparison

**Prevention:**
- User testing before launch
- Clear documentation
- Single recommended path

---

## 📊 Daily Progress Tracking

Create a simple progress tracker:

```markdown
# PROGRESS_LOG.md

## Week 1: Backend Setup
- [x] Day 1: Environment setup ✅
- [x] Day 2: Remove auth code ✅
- [x] Day 3: Simplify models ✅
- [x] Day 4: Vertex AI config ✅
- [x] Day 5: Write prompts ✅
- [ ] Day 6: LaTeX data injection (in progress)
- [ ] Day 7: Backend testing

## Notes
- Day 1: LaTeX install took 45 mins (larger than expected)
- Day 2: Found extra auth references in utils.py (fixed)
- Day 5: Prompt needed 3 iterations to work properly

## Blockers
- None currently

## Next Week Focus
- Frontend integration
```

---

## 💰 Cost Savings vs. Full Backend

| Component | With Auth | Without Auth | Savings |
|-----------|-----------|--------------|---------|
| Supabase | $25/mo | $0 | $25 |
| Email (Resend) | $20/mo | $0 | $20 |
| Development Time | 60 hours | 40 hours | 20 hours |
| **Total Monthly** | **$50-200** | **$7-25** | **$43-175** |
| **Setup Cost** | **$3,000** | **$2,000** | **$1,000** |

---

## 🎯 Success Criteria

By Day 30, you should have:

- [x] ✅ Backend deployed and running on Render
- [x] ✅ LaTeX PDF generation working (95%+ success rate)
- [x] ✅ Frontend integrated with backend
- [x] ✅ Fallback to Puppeteer working
- [x] ✅ Anonymous access (no auth required)
- [x] ✅ Production monitoring in place
- [x] ✅ Documentation complete
- [x] ✅ Cost under $25/month
- [x] ✅ Response time < 10 seconds
- [x] ✅ Professional-quality PDFs

---

## 📝 Final Notes

### When This Plan Works Best

- ✅ You can dedicate 6-8 hours/day consistently
- ✅ You have basic Python and TypeScript knowledge
- ✅ You're comfortable with debugging
- ✅ You have $25-50/month budget
- ✅ You can Google errors and find solutions

### When to Adjust the Plan

- ⏳ **If you're part-time:** Double the timeline (60 days)
- 🆘 **If you get stuck:** Ask for help early (don't waste 4 hours on one error)
- 💸 **If costs are too high:** Disable Vertex AI, use template-only mode
- 🐛 **If bugs pile up:** Add buffer days for bug fixing

### Most Important Advice

1. **Test incrementally** - Don't wait until Day 30 to test
2. **Commit often** - Push to Git daily
3. **Document issues** - Keep PROGRESS_LOG.md updated
4. **Ask for help** - When stuck > 1 hour
5. **Celebrate wins** - Mark each completed day

---

## 🚀 Let's Get Started!

Your journey begins on **Day 1**. Good luck! 🎉

**Remember:** This is a marathon, not a sprint. Pace yourself, take breaks, and enjoy the process of building something awesome!

---

**Document End**

*Last Updated: 2025-11-16*
*Version: 1.0*
*Status: Ready for Implementation*
