"""
Module containing prompt templates for resume processing

This module provides comprehensive prompt templates for:
1. Resume tailoring to match job descriptions
2. LaTeX conversion with ATS optimization
3. Complete LaTeX template based on Jake's Resume

All prompts are optimized for use with Groq API (Llama 3.3 70B model)
"""

# ============================================================================
# RESUME TAILORING PROMPT
# ============================================================================

RESUME_TAILORING_PROMPT = """You are an expert resume writer and career coach with 15+ years of experience. Your task is to tailor a resume to match a specific job description while maintaining 100% truthfulness and professional integrity.

🎯 OBJECTIVE:
Transform the provided resume to highlight relevant experiences, skills, and achievements that align with the target job description, without fabricating or exaggerating any information.

📋 MANDATORY RULES:
1. ✅ TRUTHFULNESS: Do NOT add false information, skills you don't have proof of, or experiences that didn't happen
2. ✅ REORDERING: Reorder bullet points to put the most relevant achievements first
3. ✅ KEYWORD OPTIMIZATION: Naturally incorporate keywords from the job description (use exact terminology)
4. ✅ EMPHASIS: Highlight transferable skills and relevant accomplishments
5. ✅ METRICS: Preserve all existing numbers, percentages, and quantifiable achievements
6. ✅ DATES: Keep all dates and timelines exactly as provided
7. ✅ TONE: Maintain professional, confident, action-oriented language
8. ✅ CONSISTENCY: Use consistent verb tense (past tense for previous roles, present for current)

🔍 ANALYSIS APPROACH:
1. First, identify the top 5 keywords/requirements from the job description
2. Find matching experiences in the resume that demonstrate those requirements
3. Rewrite bullet points to emphasize relevance using job description terminology
4. Reorder sections and bullet points by relevance (most relevant first)
5. Ensure each bullet point follows the STAR method (Situation, Task, Action, Result)

📝 FORMATTING REQUIREMENTS:
- Start each bullet point with a strong action verb (Led, Built, Implemented, Achieved, etc.)
- Include specific metrics and outcomes when available
- Keep bullet points concise (ideally 1-2 lines, max 150 characters)
- Use parallel structure across all bullet points
- Avoid personal pronouns (I, me, my)
- Use industry-standard terminology and acronyms

🚫 WHAT NOT TO DO:
- Don't add certifications, skills, or technologies not in the original resume
- Don't inflate job titles or responsibilities
- Don't change employment dates or tenure
- Don't invent projects or achievements
- Don't use clichés ("team player", "hard worker", "detail-oriented" without context)
- Don't remove important technical skills, even if not in job description

📥 INPUT DATA:

ORIGINAL RESUME:
{resume_content}

TARGET JOB DESCRIPTION:
{job_description}

📤 OUTPUT FORMAT:
Return the tailored resume in clean plain text format with clear section headings:

CONTACT INFORMATION
[Preserve exactly as provided]

PROFESSIONAL SUMMARY (if applicable)
[2-3 sentence summary emphasizing fit for target role]

EXPERIENCE
[Reordered and rewritten bullet points, most relevant first]

EDUCATION
[Reordered if multiple degrees, highlight relevant coursework/honors]

TECHNICAL SKILLS
[Reorganized to prioritize job-relevant skills]

PROJECTS (if applicable)
[Reordered and rewritten to highlight relevant technologies]

CERTIFICATIONS (if applicable)
[Prioritize relevant certifications]

AWARDS & ACHIEVEMENTS (if applicable)
[Include if relevant to target role]

🎯 FINAL CHECK:
Before returning, verify:
✓ Every statement is truthful and verifiable
✓ Most relevant information appears first in each section
✓ Job description keywords are naturally incorporated
✓ All metrics and achievements are preserved
✓ Dates and facts remain unchanged
✓ Professional tone throughout

Return ONLY the tailored resume text. Do not include explanations, metadata, or commentary."""

# ============================================================================
# LATEX CONVERSION PROMPT
# ============================================================================

LATEX_CONVERSION_PROMPT = """You are a world-class LaTeX expert specializing in professional resume formatting. Your task is to convert structured resume data into clean, ATS-optimized LaTeX code that compiles perfectly with pdflatex.

🎯 OBJECTIVE:
Generate production-ready LaTeX code that creates a professional, scannable resume optimized for both Applicant Tracking Systems (ATS) and human readers.

📋 CRITICAL REQUIREMENTS:

1. ✅ USE THE PROVIDED TEMPLATE STRUCTURE EXACTLY
   - The template below is based on Jake's Resume (industry standard)
   - Do NOT modify the preamble, packages, or custom commands
   - Fill in the placeholders with actual resume data

2. ✅ ESCAPE ALL SPECIAL LATEX CHARACTERS:
   - & must be \\&
   - % must be \\%
   - $ must be \\$
   - # must be \\#
   - _ must be \\_
   - {{ and }} must be \\{{ and \\}}
   - ~ must be \\textasciitilde{{}}
   - ^ must be \\^{{}}
   - \\ must be \\textbackslash{{}}

3. ✅ DATE FORMATTING:
   - Use "Month Year" format (e.g., "Jan 2022", "June 2023")
   - For current positions: "Month Year -- Present"
   - For completed positions: "Month Year -- Month Year"
   - Abbreviate months: Jan, Feb, Mar, Apr, May, June, July, Aug, Sept, Oct, Nov, Dec

4. ✅ URL HANDLING:
   - Use \\href{{url}}{{display text}} for all clickable links
   - Email: \\href{{mailto:email@example.com}}{{email@example.com}}
   - LinkedIn: \\href{{https://linkedin.com/in/username}}{{linkedin.com/in/username}}
   - GitHub: \\href{{https://github.com/username}}{{github.com/username}}
   - Portfolio: \\href{{https://example.com}}{{example.com}}

5. ✅ SECTION STRUCTURE:
   Use these exact custom commands from the template:
   - \\resumeSubheading{{Title}}{{Date}}{{Subtitle}}{{Location}} for work/education entries
   - \\resumeProjectHeading{{\\textbf{{Project Name}} $|$ \\emph{{Technologies}}}}{{Date}} for projects
   - \\resumeItem{{Bullet point text}} for individual achievements
   - \\resumeItemListStart and \\resumeItemListEnd to wrap bullet lists

6. ✅ FORMATTING BEST PRACTICES:
   - Use \\textbf{{}} for bold text (job titles, company names, project names)
   - Use \\emph{{}} or \\textit{{}} for italic text (degree names, technologies)
   - Keep bullet points concise (1-2 lines maximum)
   - Ensure consistent spacing and alignment
   - Limit to one page if possible (two pages max)

7. ✅ ATS OPTIMIZATION:
   - Use standard section headings: Education, Experience, Projects, Technical Skills
   - Avoid complex tables, graphics, or custom fonts
   - Use simple, semantic LaTeX commands
   - Include \\pdfgentounicode=1 for text extraction compatibility

📥 INPUT DATA (JSON format):
{resume_content}

📋 LATEX TEMPLATE STRUCTURE TO USE:
{latex_template}

🔧 IMPLEMENTATION INSTRUCTIONS:

1. Start with the exact preamble from the template (packages, margins, custom commands)
2. Replace [PLACEHOLDERS] with actual data from the JSON input
3. Build each section methodically:

   CONTACT SECTION:
   - Extract: name, phone, email, linkedin, github, website
   - Format with \\href for all URLs

   EDUCATION SECTION:
   - Use \\resumeSubheading for each degree
   - Format: Institution, Location, Degree, Dates
   - Include GPA if >= 3.5, honors, relevant coursework

   EXPERIENCE SECTION:
   - Use \\resumeSubheading for each position
   - Format: Job Title, Dates, Company Name, Location
   - Use \\resumeItemListStart/End for bullet points
   - Each bullet uses \\resumeItem{{text}}

   PROJECTS SECTION:
   - Use \\resumeProjectHeading for each project
   - Format: Project Name | Technologies, Dates
   - Include GitHub links with \\href if available

   SKILLS SECTION:
   - Categorize: Languages, Frameworks, Developer Tools, Libraries
   - Use \\textbf{{Category}}: items separated by commas

4. Ensure proper escaping of ALL special characters
5. Verify all braces are balanced
6. End with \\end{{document}}

📤 OUTPUT REQUIREMENTS:

✅ Return ONLY the complete LaTeX code
✅ Start with \\documentclass[letterpaper,11pt]{{article}}
✅ End with \\end{{document}}
✅ NO markdown code blocks (no ``` or ```latex)
✅ NO explanatory text or comments
✅ NO placeholder text - use actual data from JSON
✅ ALL special characters properly escaped
✅ Proper indentation for readability

🚫 COMMON MISTAKES TO AVOID:
❌ Forgetting to escape &, %, $, #, _, {{, }}
❌ Using curly braces without escaping: {{skill}} instead of \\{{skill\\}}
❌ Missing \\href for URLs
❌ Inconsistent date formats
❌ Unbalanced braces
❌ Including markdown formatting in output
❌ Adding explanatory comments in the LaTeX code

🎯 QUALITY CHECKLIST:
Before returning, verify:
✓ All special characters are escaped
✓ All URLs use \\href
✓ Dates follow "Month Year" format
✓ Custom commands (\\resumeItem, \\resumeSubheading) are used correctly
✓ Document starts with \\documentclass and ends with \\end{{document}}
✓ All braces are balanced
✓ No placeholder text remains
✓ Code will compile with pdflatex without errors

Return ONLY the LaTeX code, nothing else."""

# ============================================================================
# LATEX TEMPLATE - Based on Jake's Resume (Industry Standard)
# ============================================================================

LATEX_TEMPLATE = r"""
%-------------------------
% Resume in LaTeX
% Based on Jake's Resume Template
% License: MIT
% ATS-Optimized for Maximum Compatibility
%-------------------------

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
\input{glyphtounicode}

%----------FONT OPTIONS----------
% sans-serif
% \usepackage[sfdefault]{FiraSans}
% \usepackage[sfdefault]{roboto}
% \usepackage[sfdefault]{noto-sans}
% \usepackage[default]{sourcesanspro}

% serif
% \usepackage{CormorantGaramond}
% \usepackage{charter}

\pagestyle{fancy}
\fancyhf{} % clear all header and footer fields
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

% Ensure that generate pdf is machine readable/ATS parsable
\pdfgentounicode=1

%-------------------------
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

\newcommand{\resumeSubSubheading}[2]{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \textit{\small#1} & \textit{\small #2} \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeProjectHeading}[2]{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \small#1 & #2 \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeSubItem}[1]{\resumeItem{#1}\vspace{-4pt}}

\renewcommand\labelitemii{$\vcenter{\hbox{\tiny$\bullet$}}$}

\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.15in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%


\begin{document}

%----------HEADING----------
% \begin{tabular*}{\textwidth}{l@{\extracolsep{\fill}}r}
%   \textbf{\href{http://sourabhbajaj.com/}{\Large Sourabh Bajaj}} & Email : \href{mailto:sourabh@sourabhbajaj.com}{sourabh@sourabhbajaj.com}\\
%   \href{http://sourabhbajaj.com/}{http://www.sourabhbajaj.com} & Mobile : +1-123-456-7890 \\
% \end{tabular*}

\begin{center}
    \textbf{\Huge \scshape [FULL_NAME]} \\ \vspace{1pt}
    \small [PHONE] $|$ \href{mailto:[EMAIL]}{\underline{[EMAIL]}} $|$
    \href{[LINKEDIN_URL]}{\underline{linkedin.com/in/[LINKEDIN_USERNAME]}} $|$
    \href{[GITHUB_URL]}{\underline{github.com/[GITHUB_USERNAME]}}
\end{center}


%-----------EDUCATION-----------
\section{Education}
  \resumeSubHeadingListStart
    \resumeSubheading
      {[UNIVERSITY_NAME]}{[CITY, STATE]}
      {[DEGREE] in [MAJOR]; GPA: [GPA]}{[START_DATE] -- [END_DATE]}

    % ADDITIONAL EDUCATION ENTRIES
    % \resumeSubheading
    %   {Second Institution}{City, State}
    %   {Degree Name}{Start Date -- End Date}

  \resumeSubHeadingListEnd


%-----------EXPERIENCE-----------
\section{Experience}
  \resumeSubHeadingListStart

    \resumeSubheading
      {[JOB_TITLE]}{[START_DATE] -- [END_DATE]}
      {[COMPANY_NAME]}{[CITY, STATE]}
      \resumeItemListStart
        \resumeItem{[ACHIEVEMENT_BULLET_1]}
        \resumeItem{[ACHIEVEMENT_BULLET_2]}
        \resumeItem{[ACHIEVEMENT_BULLET_3]}
        \resumeItem{[ACHIEVEMENT_BULLET_4]}
      \resumeItemListEnd

    % ADDITIONAL EXPERIENCE ENTRIES
    % \resumeSubheading
    %   {Second Job Title}{Start Date -- End Date}
    %   {Company Name}{City, State}
    %   \resumeItemListStart
    %     \resumeItem{Achievement bullet point}
    %     \resumeItem{Another achievement}
    %   \resumeItemListEnd

  \resumeSubHeadingListEnd


%-----------PROJECTS-----------
\section{Projects}
    \resumeSubHeadingListStart

      \resumeProjectHeading
          {\textbf{[PROJECT_NAME]} $|$ \emph{[TECHNOLOGIES_USED]}}{[START_DATE] -- [END_DATE]}
          \resumeItemListStart
            \resumeItem{[PROJECT_ACHIEVEMENT_1]}
            \resumeItem{[PROJECT_ACHIEVEMENT_2]}
            \resumeItem{[PROJECT_ACHIEVEMENT_3]}
          \resumeItemListEnd

      % ADDITIONAL PROJECT ENTRIES
      % \resumeProjectHeading
      %     {\textbf{Second Project} $|$ \emph{Python, Flask, PostgreSQL}}{Jan 2023 -- Mar 2023}
      %     \resumeItemListStart
      %       \resumeItem{Built a web application that...}
      %       \resumeItem{Implemented features including...}
      %     \resumeItemListEnd

    \resumeSubHeadingListEnd


%-----------TECHNICAL SKILLS-----------
\section{Technical Skills}
 \begin{itemize}[leftmargin=0.15in, label={}]
    \small{\item{
     \textbf{Languages}{: [PROGRAMMING_LANGUAGES]} \\
     \textbf{Frameworks}{: [FRAMEWORKS_AND_LIBRARIES]} \\
     \textbf{Developer Tools}{: [TOOLS_AND_PLATFORMS]} \\
     \textbf{Libraries}{: [ADDITIONAL_LIBRARIES]}
    }}
 \end{itemize}


%-------------------------------------------
\end{document}
"""

# ============================================================================
# HELPER FUNCTIONS FOR PROMPT FORMATTING
# ============================================================================

def format_tailoring_prompt(resume_content: str, job_description: str) -> str:
    """
    Format the resume tailoring prompt with actual content.

    Args:
        resume_content: The original resume text or JSON
        job_description: The target job description

    Returns:
        Formatted prompt ready for LLM
    """
    return RESUME_TAILORING_PROMPT.format(
        resume_content=resume_content,
        job_description=job_description
    )


def format_latex_conversion_prompt(resume_content: str) -> str:
    """
    Format the LaTeX conversion prompt with actual content.

    Args:
        resume_content: The resume data (JSON format)

    Returns:
        Formatted prompt ready for LLM with template included
    """
    return LATEX_CONVERSION_PROMPT.format(
        resume_content=resume_content,
        latex_template=LATEX_TEMPLATE
    )


def get_latex_template() -> str:
    """
    Get the LaTeX template for direct use (without AI processing).

    Returns:
        The complete LaTeX template string
    """
    return LATEX_TEMPLATE


# ============================================================================
# VALIDATION HELPERS
# ============================================================================

def validate_latex_output(latex_code: str) -> tuple[bool, list[str]]:
    """
    Validate LaTeX output for common errors.

    Args:
        latex_code: Generated LaTeX code

    Returns:
        Tuple of (is_valid, list_of_errors)
    """
    errors = []

    # Check for required document structure
    if not latex_code.strip().startswith('\\documentclass'):
        errors.append("Missing \\documentclass at start")

    if '\\begin{document}' not in latex_code:
        errors.append("Missing \\begin{document}")

    if '\\end{document}' not in latex_code:
        errors.append("Missing \\end{document}")

    # Check for unescaped special characters (basic check)
    # This is a heuristic - some legitimate uses may trigger false positives
    import re

    # Look for standalone special chars (not escaped)
    # This is simplified - real check would need to parse LaTeX properly
    standalone_special = re.findall(r'(?<!\\)[&%$#_{}~^]', latex_code)
    if standalone_special:
        errors.append(f"Possibly unescaped special characters found: {set(standalone_special)}")

    # Check for balanced braces (simplified)
    open_braces = latex_code.count('{')
    close_braces = latex_code.count('}')
    if open_braces != close_braces:
        errors.append(f"Unbalanced braces: {open_braces} open, {close_braces} close")

    # Check for placeholder text
    if '[FULL_NAME]' in latex_code or '[EMAIL]' in latex_code:
        errors.append("Template placeholders found - data not properly inserted")

    return (len(errors) == 0, errors)


# ============================================================================
# EXPORTS
# ============================================================================

__all__ = [
    'RESUME_TAILORING_PROMPT',
    'LATEX_CONVERSION_PROMPT',
    'LATEX_TEMPLATE',
    'format_tailoring_prompt',
    'format_latex_conversion_prompt',
    'get_latex_template',
    'validate_latex_output',
]
