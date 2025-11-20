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
    \textbf{\Huge \scshape [FULL_NAME]} \\ \vspace{1pt}
    \small [PHONE] $|$ \href{mailto:[EMAIL]}{[EMAIL]} $|$
    \href{[LINKEDIN]}{LinkedIn} $|$
    \href{[GITHUB]}{GitHub}
\end{center}

% EDUCATION
\section{Education}
  \resumeSubHeadingListStart
    % Education items will be inserted here by AI
  \resumeSubHeadingListEnd

% EXPERIENCE
\section{Experience}
  \resumeSubHeadingListStart
    % Experience items will be inserted here by AI
  \resumeSubHeadingListEnd

% PROJECTS
\section{Projects}
    \resumeSubHeadingListStart
      % Project items will be inserted here by AI
    \resumeSubHeadingListEnd

% TECHNICAL SKILLS
\section{Technical Skills}
 \begin{itemize}[leftmargin=0.15in, label={}]
    \small{\item{
     \textbf{Languages}{: [LANGUAGES]} \\
     \textbf{Frameworks}{: [FRAMEWORKS]} \\
     \textbf{Developer Tools}{: [TOOLS]} \\
     \textbf{Libraries}{: [LIBRARIES]} \\
    }}
 \end{itemize}

\end{document}
"""
