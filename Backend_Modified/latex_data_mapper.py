"""
LaTeX Data Mapper - Maps resume JSON data to LaTeX template format

This module provides functions to convert structured resume data (from models.py)
into properly formatted LaTeX sections for Jake's Resume template.

Key Features:
- LaTeX character escaping
- Date range formatting
- Section generation (contact, education, experience, projects, skills)
- Robust error handling for missing/optional fields
"""

import re
import logging
from typing import Dict, List, Any
from models import ResumeData, BasicInfo, EducationItem, ExperienceItem, ProjectItem, Skills

logger = logging.getLogger(__name__)


# ============================================================================
# HELPER FUNCTIONS - Character Escaping & Formatting
# ============================================================================

def escape_latex(text: str) -> str:
    """
    Escape special LaTeX characters to prevent compilation errors.

    Critical LaTeX special characters:
    & % $ # _ { } ~ ^ \

    Args:
        text: Raw text that may contain special characters

    Returns:
        LaTeX-safe escaped text

    Example:
        >>> escape_latex("R&D @ Company_Name 50% faster")
        "R\\&D @ Company\\_Name 50\\% faster"
    """
    if not text:
        return ""

    # Order matters! Replace backslash first to avoid double-escaping
    replacements = [
        ('\\', r'\textbackslash{}'),  # Must be first
        ('&', r'\&'),
        ('%', r'\%'),
        ('$', r'\$'),
        ('#', r'\#'),
        ('_', r'\_'),
        ('{', r'\{'),
        ('}', r'\}'),
        ('~', r'\textasciitilde{}'),
        ('^', r'\^{}'),
    ]

    for char, replacement in replacements:
        text = text.replace(char, replacement)

    return text


def format_date(date_str: str) -> str:
    """
    Format date string for LaTeX resume (e.g., "Sept 2021", "May 2024").

    Handles various input formats:
    - ISO format: "2021-09-01" → "Sept 2021"
    - Human format: "September 2021" → "Sept 2021"
    - Short format: "09/2021" → "Sept 2021"
    - Already formatted: "Sept 2021" → "Sept 2021" (pass through)

    Args:
        date_str: Date in various formats

    Returns:
        Formatted date string (e.g., "Sept 2021")
    """
    if not date_str:
        return ""

    # Month abbreviations (Jake's Resume style)
    month_map = {
        '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
        '05': 'May', '06': 'June', '07': 'July', '08': 'Aug',
        '09': 'Sept', '10': 'Oct', '11': 'Nov', '12': 'Dec',
        'january': 'Jan', 'february': 'Feb', 'march': 'Mar',
        'april': 'Apr', 'may': 'May', 'june': 'June',
        'july': 'July', 'august': 'Aug', 'september': 'Sept',
        'october': 'Oct', 'november': 'Nov', 'december': 'Dec',
    }

    # If already in correct format (e.g., "Sept 2021"), return as-is
    if re.match(r'^(Jan|Feb|Mar|Apr|May|June|July|Aug|Sept|Oct|Nov|Dec)\.?\s+\d{4}$', date_str):
        return date_str

    # Try ISO format: "2021-09-01" or "2021-09"
    iso_match = re.match(r'^(\d{4})-(\d{2})(?:-\d{2})?$', date_str)
    if iso_match:
        year, month = iso_match.groups()
        month_abbr = month_map.get(month, 'Jan')
        return f"{month_abbr} {year}"

    # Try "MM/YYYY" or "MM-YYYY" format
    slash_match = re.match(r'^(\d{1,2})[/-](\d{4})$', date_str)
    if slash_match:
        month, year = slash_match.groups()
        month = month.zfill(2)  # Pad to 2 digits
        month_abbr = month_map.get(month, 'Jan')
        return f"{month_abbr} {year}"

    # Try "Month YYYY" format (case-insensitive)
    word_match = re.match(r'^(\w+)\s+(\d{4})$', date_str, re.IGNORECASE)
    if word_match:
        month, year = word_match.groups()
        month_abbr = month_map.get(month.lower(), month[:4].capitalize())
        return f"{month_abbr} {year}"

    # Fallback: return original string
    logger.warning(f"Could not parse date format: {date_str}")
    return date_str


def format_date_range(start: str, end: str, is_present: bool) -> str:
    """
    Format date range for LaTeX resume (e.g., "Sept 2021 -- Present").

    Args:
        start: Start date string
        end: End date string (may be empty if is_present=True)
        is_present: Boolean indicating if this is an ongoing position/education

    Returns:
        Formatted date range (e.g., "Sept 2021 -- Present")

    Examples:
        >>> format_date_range("2021-09", "", True)
        "Sept 2021 -- Present"
        >>> format_date_range("2018-09", "2022-05", False)
        "Sept 2018 -- May 2022"
    """
    start_formatted = format_date(start)

    if is_present:
        return f"{start_formatted} -- Present"
    elif end:
        end_formatted = format_date(end)
        return f"{start_formatted} -- {end_formatted}"
    else:
        return start_formatted


# ============================================================================
# SECTION GENERATORS
# ============================================================================

def generate_contact_section(basic_info: BasicInfo) -> str:
    """
    Generate LaTeX contact section (name, phone, email, links).

    Format:
        JOHN DOE
        +1-555-0123 | john.doe@example.com | LinkedIn | GitHub

    Args:
        basic_info: BasicInfo object with contact details

    Returns:
        LaTeX code for contact section
    """
    name = escape_latex(basic_info.fullName) if basic_info.fullName else "NAME NOT PROVIDED"
    phone = escape_latex(basic_info.phone) if basic_info.phone else ""
    email = basic_info.email if basic_info.email else ""

    # Build contact line parts
    contact_parts = []

    if phone:
        contact_parts.append(phone)

    if email:
        contact_parts.append(f"\\href{{mailto:{email}}}{{{email}}}")

    if basic_info.linkedin:
        linkedin_url = basic_info.linkedin
        # Remove protocol if present
        linkedin_display = linkedin_url.replace('https://', '').replace('http://', '')
        linkedin_display = linkedin_display.replace('www.', '')
        contact_parts.append(f"\\href{{{linkedin_url}}}{{LinkedIn: {escape_latex(linkedin_display)}}}")

    if basic_info.github:
        github_url = basic_info.github
        github_display = github_url.replace('https://', '').replace('http://', '')
        github_display = github_display.replace('www.', '')
        contact_parts.append(f"\\href{{{github_url}}}{{GitHub: {escape_latex(github_display)}}}")

    if basic_info.website:
        website_url = basic_info.website
        website_display = website_url.replace('https://', '').replace('http://', '')
        website_display = website_display.replace('www.', '')
        contact_parts.append(f"\\href{{{website_url}}}{{{escape_latex(website_display)}}}")

    contact_line = " $|$ ".join(contact_parts)

    latex_code = f"""\\begin{{center}}
    \\textbf{{\\Huge \\scshape {name}}} \\\\ \\vspace{{1pt}}
    \\small {contact_line}
\\end{{center}}"""

    return latex_code


def generate_education_section(education: List[EducationItem]) -> str:
    """
    Generate LaTeX education section.

    Format for each item:
        University Name                                      City, State
        Bachelor of Science in Computer Science              Sept 2018 -- May 2022

    Args:
        education: List of EducationItem objects

    Returns:
        LaTeX code for education section
    """
    if not education:
        logger.warning("No education items provided")
        return ""

    items = []
    for edu in education:
        institution = escape_latex(edu.institution) if edu.institution else "Institution"
        location = escape_latex(edu.location) if edu.location else ""
        degree = escape_latex(edu.degree) if edu.degree else "Degree"

        # Add minor if present
        if edu.minor:
            degree += f", Minor in {escape_latex(edu.minor)}"

        dates = format_date_range(
            edu.startDate or "",
            edu.endDate or "",
            edu.isPresent
        )

        item = f"""    \\resumeSubheading
      {{{institution}}}{{{location}}}
      {{{degree}}}{{{dates}}}"""
        items.append(item)

    section = "\\section{Education}\n  \\resumeSubHeadingListStart\n"
    section += "\n".join(items)
    section += "\n  \\resumeSubHeadingListEnd"

    return section


def generate_experience_section(experience: List[ExperienceItem]) -> str:
    """
    Generate LaTeX experience section.

    Format for each item:
        Company Name                                         City, State
        Job Title                                            Sept 2022 -- Present
        - Bullet point 1
        - Bullet point 2

    Args:
        experience: List of ExperienceItem objects

    Returns:
        LaTeX code for experience section
    """
    if not experience:
        logger.warning("No experience items provided")
        return ""

    items = []
    for exp in experience:
        organization = escape_latex(exp.organization) if exp.organization else "Organization"
        location = escape_latex(exp.location) if exp.location else ""
        job_title = escape_latex(exp.jobTitle) if exp.jobTitle else "Job Title"
        dates = format_date_range(
            exp.startDate or "",
            exp.endDate or "",
            exp.isPresent
        )

        # Start item
        item = f"""    \\resumeSubheading
      {{{organization}}}{{{location}}}
      {{{job_title}}}{{{dates}}}
      \\resumeItemListStart"""

        # Add bullet points
        if exp.description:
            for bullet in exp.description:
                escaped_bullet = escape_latex(bullet)
                item += f"\n        \\resumeItem{{{escaped_bullet}}}"

        item += "\n      \\resumeItemListEnd"
        items.append(item)

    section = "\\section{Experience}\n  \\resumeSubHeadingListStart\n"
    section += "\n".join(items)
    section += "\n  \\resumeSubHeadingListEnd"

    return section


def generate_projects_section(projects: List[ProjectItem]) -> str:
    """
    Generate LaTeX projects section.

    Format for each item:
        Project Name | Technologies
        - Description line 1
        - Description line 2

    Args:
        projects: List of ProjectItem objects

    Returns:
        LaTeX code for projects section
    """
    if not projects:
        logger.warning("No project items provided")
        return ""

    items = []
    for project in projects:
        name = escape_latex(project.name) if project.name else "Project Name"
        technologies = escape_latex(project.technologies) if project.technologies else ""

        # Format: "Project Name | Technologies"
        header = f"\\textbf{{{name}}}"
        if technologies:
            header += f" $|$ \\emph{{{technologies}}}"

        item = f"    \\resumeProjectHeading\n      {{{header}}}{{}}"
        item += "\n      \\resumeItemListStart"

        # Add description bullets
        if project.description:
            for bullet in project.description:
                escaped_bullet = escape_latex(bullet)
                item += f"\n        \\resumeItem{{{escaped_bullet}}}"

        item += "\n      \\resumeItemListEnd"
        items.append(item)

    section = "\\section{Projects}\n  \\resumeSubHeadingListStart\n"
    section += "\n".join(items)
    section += "\n  \\resumeSubHeadingListEnd"

    return section


def generate_skills_section(skills: Skills) -> str:
    """
    Generate LaTeX technical skills section.

    Format:
        Technical Skills
        Languages: Python, Java, JavaScript, C++
        Frameworks: React, Node.js, Django, Flask
        Developer Tools: Git, Docker, AWS, VS Code
        Libraries: NumPy, Pandas, TensorFlow, PyTorch

    Args:
        skills: Skills object with categorized skills

    Returns:
        LaTeX code for skills section
    """
    if not skills:
        logger.warning("No skills provided")
        return ""

    skill_items = []

    if skills.languages:
        skill_items.append(f"    \\resumeItem{{\\textbf{{Languages}}: {escape_latex(skills.languages)}}}")

    if skills.frameworks:
        skill_items.append(f"    \\resumeItem{{\\textbf{{Frameworks}}: {escape_latex(skills.frameworks)}}}")

    if skills.developerTools:
        skill_items.append(f"    \\resumeItem{{\\textbf{{Developer Tools}}: {escape_latex(skills.developerTools)}}}")

    if skills.libraries:
        skill_items.append(f"    \\resumeItem{{\\textbf{{Libraries}}: {escape_latex(skills.libraries)}}}")

    if not skill_items:
        logger.warning("All skill fields are empty")
        return ""

    section = "\\section{Technical Skills}\n \\begin{itemize}[leftmargin=0.15in, label={}]\n    \\small{\\item{\n"
    section += "\n".join(skill_items)
    section += "\n    }}\n \\end{itemize}"

    return section


# ============================================================================
# MAIN MAPPING FUNCTION
# ============================================================================

def map_resume_data_to_latex(resume_data: ResumeData, latex_template: str) -> str:
    """
    Main function to map ResumeData to LaTeX document.

    This function:
    1. Generates each section (contact, education, experience, projects, skills)
    2. Replaces placeholders in the LaTeX template
    3. Returns complete LaTeX document ready for compilation

    Args:
        resume_data: ResumeData object (from models.py)
        latex_template: LaTeX template string with placeholders

    Returns:
        Complete LaTeX document as string

    Raises:
        ValueError: If resume_data is invalid or template is missing placeholders
    """
    logger.info("Mapping resume data to LaTeX template...")

    try:
        # Generate all sections
        contact = generate_contact_section(resume_data.basicInfo)
        education = generate_education_section(resume_data.education)
        experience = generate_experience_section(resume_data.experience)
        projects = generate_projects_section(resume_data.projects)
        skills = generate_skills_section(resume_data.skills)

        # Replace placeholders in template
        latex_doc = latex_template
        latex_doc = latex_doc.replace('[CONTACT]', contact)
        latex_doc = latex_doc.replace('[EDUCATION]', education)
        latex_doc = latex_doc.replace('[EXPERIENCE]', experience)
        latex_doc = latex_doc.replace('[PROJECTS]', projects)
        latex_doc = latex_doc.replace('[SKILLS]', skills)

        # Validate that all placeholders were replaced
        remaining_placeholders = re.findall(r'\[([A-Z_]+)\]', latex_doc)
        if remaining_placeholders:
            logger.warning(f"Unreplaced placeholders found: {remaining_placeholders}")

        logger.info("Successfully mapped resume data to LaTeX")
        return latex_doc

    except Exception as e:
        logger.error(f"Error mapping resume data to LaTeX: {e}", exc_info=True)
        raise ValueError(f"Failed to map resume data: {str(e)}")


# ============================================================================
# VALIDATION FUNCTIONS
# ============================================================================

def validate_latex_output(latex_content: str) -> tuple[bool, list[str]]:
    r"""
    Validate generated LaTeX content for common issues.

    Checks:
    - Document structure (\documentclass, \begin{document}, \end{document})
    - Unescaped special characters
    - Balanced braces
    - Remaining placeholders

    Args:
        latex_content: Generated LaTeX code

    Returns:
        Tuple of (is_valid, list_of_errors)
    """
    errors = []

    # Check document structure
    if '\\documentclass' not in latex_content:
        errors.append("Missing \\documentclass declaration")

    if '\\begin{document}' not in latex_content:
        errors.append("Missing \\begin{document}")

    if '\\end{document}' not in latex_content:
        errors.append("Missing \\end{document}")

    # Check for unescaped special characters (basic check)
    # This regex looks for special chars NOT preceded by backslash
    unescaped_chars = re.findall(r'(?<!\\)[&%$#_{}]', latex_content)
    if unescaped_chars:
        errors.append(f"Possible unescaped characters found: {set(unescaped_chars)}")

    # Check balanced braces (simple count)
    open_braces = latex_content.count('{')
    close_braces = latex_content.count('}')
    if open_braces != close_braces:
        errors.append(f"Unbalanced braces: {open_braces} open, {close_braces} close")

    # Check for unreplaced placeholders
    placeholders = re.findall(r'\[([A-Z_]+)\]', latex_content)
    if placeholders:
        errors.append(f"Unreplaced placeholders: {placeholders}")

    is_valid = len(errors) == 0
    return is_valid, errors
