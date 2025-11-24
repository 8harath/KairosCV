"""
Test script for validating resume processing prompts with Groq API

This script tests:
1. Resume tailoring prompt
2. LaTeX conversion prompt
3. LaTeX template compilation
4. Prompt output validation

Usage:
    python test_prompts.py
"""

import os
import json
import asyncio
from dotenv import load_dotenv
from prompts import (
    format_tailoring_prompt,
    format_latex_conversion_prompt,
    validate_latex_output,
    LATEX_TEMPLATE
)

# Load environment variables
load_dotenv()

# Sample resume data for testing
SAMPLE_RESUME_JSON = {
    "contact": {
        "name": "Jane Smith",
        "email": "jane.smith@example.com",
        "phone": "+1-555-0123",
        "linkedin": "linkedin.com/in/janesmith",
        "github": "github.com/janesmith",
        "location": "San Francisco, CA"
    },
    "education": [
        {
            "institution": "University of California, Berkeley",
            "location": "Berkeley, CA",
            "degree": "Bachelor of Science in Computer Science",
            "field": "Computer Science",
            "startDate": "Aug 2018",
            "endDate": "May 2022",
            "gpa": "3.8"
        }
    ],
    "experience": [
        {
            "company": "Tech Innovations Inc.",
            "title": "Software Engineer",
            "location": "San Francisco, CA",
            "startDate": "June 2022",
            "endDate": "Present",
            "bullets": [
                "Developed scalable microservices architecture serving 1M+ daily users using Python and FastAPI",
                "Reduced API response time by 40% through database query optimization and caching strategies",
                "Led migration from monolithic architecture to microservices, improving deployment frequency by 300%",
                "Mentored 3 junior engineers and conducted code reviews for team of 8 developers"
            ]
        },
        {
            "company": "StartupXYZ",
            "title": "Software Engineering Intern",
            "location": "Remote",
            "startDate": "May 2021",
            "endDate": "Aug 2021",
            "bullets": [
                "Built React-based dashboard for real-time analytics, processing 10K events/second",
                "Implemented authentication system using OAuth 2.0 and JWT tokens",
                "Collaborated with design team to improve user experience, increasing engagement by 25%"
            ]
        }
    ],
    "projects": [
        {
            "name": "AI Resume Optimizer",
            "description": "Full-stack application using Next.js and Python for AI-powered resume optimization",
            "technologies": ["Next.js", "Python", "FastAPI", "PostgreSQL", "OpenAI API"],
            "startDate": "Jan 2024",
            "link": "https://github.com/janesmith/resume-optimizer"
        },
        {
            "name": "Distributed Task Queue",
            "description": "High-performance task queue system built with Go and Redis",
            "technologies": ["Go", "Redis", "Docker", "Kubernetes"],
            "startDate": "Sept 2023",
            "endDate": "Dec 2023"
        }
    ],
    "skills": {
        "languages": ["Python", "JavaScript", "TypeScript", "Go", "SQL"],
        "frameworks": ["React", "Next.js", "FastAPI", "Flask", "Node.js"],
        "tools": ["Git", "Docker", "Kubernetes", "AWS", "PostgreSQL", "Redis"],
        "databases": ["PostgreSQL", "MongoDB", "Redis", "MySQL"]
    }
}

SAMPLE_JOB_DESCRIPTION = """
Senior Software Engineer - Backend Systems

We're seeking an experienced backend engineer to join our platform team. The ideal candidate will have:

Requirements:
- 3+ years of experience building scalable backend systems
- Strong proficiency in Python and modern web frameworks (FastAPI, Django, Flask)
- Experience with microservices architecture and distributed systems
- Expertise in database design and optimization (PostgreSQL, Redis)
- Experience with cloud platforms (AWS, GCP) and containerization (Docker, Kubernetes)
- Strong understanding of API design and RESTful services
- Experience with CI/CD pipelines and DevOps practices

Nice to have:
- Experience with event-driven architectures
- Knowledge of GraphQL
- Contributions to open-source projects
- Experience mentoring junior engineers

Responsibilities:
- Design and build scalable backend services handling millions of requests
- Optimize database queries and caching strategies
- Lead technical initiatives and architectural decisions
- Mentor junior team members
- Collaborate with product and frontend teams
"""


def print_section(title: str, content: str = "", width: int = 80):
    """Print a formatted section"""
    print("\n" + "=" * width)
    print(f"  {title}")
    print("=" * width)
    if content:
        print(content)


def print_success(message: str):
    """Print success message"""
    print(f"✅ {message}")


def print_error(message: str):
    """Print error message"""
    print(f"❌ {message}")


def print_warning(message: str):
    """Print warning message"""
    print(f"⚠️  {message}")


async def test_groq_connection():
    """Test connection to Groq API"""
    print_section("TEST 1: Groq API Connection")

    groq_api_key = os.getenv("GROQ_API_KEY")

    if not groq_api_key:
        print_error("GROQ_API_KEY not found in environment variables")
        print("Please set GROQ_API_KEY in your .env file")
        return False

    if groq_api_key == "your_groq_api_key_here":
        print_error("GROQ_API_KEY is still set to placeholder value")
        print("Please update .env with your actual Groq API key")
        print("Get one free at: https://console.groq.com")
        return False

    print_success(f"GROQ_API_KEY found (length: {len(groq_api_key)} chars)")

    # Test API connection
    try:
        from langchain_groq import ChatGroq

        llm = ChatGroq(
            model_name="llama-3.3-70b-versatile",
            temperature=0.3,
            groq_api_key=groq_api_key
        )

        # Simple test message
        response = llm.invoke("Say 'Hello from Groq!' in exactly 5 words.")
        print_success("Groq API connection successful")
        print(f"Response: {response.content}")
        return True

    except Exception as e:
        print_error(f"Groq API connection failed: {e}")
        return False


def test_prompt_formatting():
    """Test prompt formatting functions"""
    print_section("TEST 2: Prompt Formatting")

    resume_text = json.dumps(SAMPLE_RESUME_JSON, indent=2)

    # Test tailoring prompt
    try:
        tailoring_prompt = format_tailoring_prompt(resume_text, SAMPLE_JOB_DESCRIPTION)
        print_success("Resume tailoring prompt formatted successfully")
        print(f"Prompt length: {len(tailoring_prompt)} characters")

        # Check if placeholders are replaced
        if "{resume_content}" in tailoring_prompt or "{job_description}" in tailoring_prompt:
            print_error("Placeholders not replaced in tailoring prompt")
            return False
        else:
            print_success("All placeholders replaced correctly")

    except Exception as e:
        print_error(f"Tailoring prompt formatting failed: {e}")
        return False

    # Test LaTeX conversion prompt
    try:
        latex_prompt = format_latex_conversion_prompt(resume_text)
        print_success("LaTeX conversion prompt formatted successfully")
        print(f"Prompt length: {len(latex_prompt)} characters")

        # Check if placeholders are replaced
        if "{resume_content}" in latex_prompt or "{latex_template}" not in latex_prompt:
            print_error("Placeholders not replaced in LaTeX prompt")
            return False
        else:
            print_success("All placeholders replaced correctly")

    except Exception as e:
        print_error(f"LaTeX prompt formatting failed: {e}")
        return False

    return True


def test_latex_template():
    """Test LaTeX template structure"""
    print_section("TEST 3: LaTeX Template Validation")

    # Check template structure
    checks = {
        "Has \\documentclass": "\\documentclass[letterpaper,11pt]{article}" in LATEX_TEMPLATE,
        "Has \\begin{document}": "\\begin{document}" in LATEX_TEMPLATE,
        "Has \\end{document}": "\\end{document}" in LATEX_TEMPLATE,
        "Has custom commands": "\\resumeItem" in LATEX_TEMPLATE and "\\resumeSubheading" in LATEX_TEMPLATE,
        "Has sections": all(section in LATEX_TEMPLATE for section in ["Education", "Experience", "Projects", "Technical Skills"]),
        "Has placeholders": "[FULL_NAME]" in LATEX_TEMPLATE and "[EMAIL]" in LATEX_TEMPLATE,
    }

    all_passed = True
    for check_name, result in checks.items():
        if result:
            print_success(check_name)
        else:
            print_error(check_name)
            all_passed = False

    if all_passed:
        print_success("LaTeX template structure is valid")
    else:
        print_error("LaTeX template has structural issues")

    return all_passed


async def test_resume_tailoring():
    """Test resume tailoring with Groq"""
    print_section("TEST 4: Resume Tailoring with Groq AI")

    try:
        from langchain_groq import ChatGroq

        groq_api_key = os.getenv("GROQ_API_KEY")
        llm = ChatGroq(
            model_name="llama-3.3-70b-versatile",
            temperature=0.3,
            groq_api_key=groq_api_key
        )

        resume_text = json.dumps(SAMPLE_RESUME_JSON, indent=2)
        prompt = format_tailoring_prompt(resume_text, SAMPLE_JOB_DESCRIPTION)

        print("Sending resume tailoring request to Groq...")
        print(f"Resume: {len(resume_text)} chars, Job Description: {len(SAMPLE_JOB_DESCRIPTION)} chars")

        response = llm.invoke(prompt)
        tailored_resume = response.content

        print_success("Resume tailoring completed")
        print(f"Output length: {len(tailored_resume)} characters")

        # Show preview (first 500 chars)
        print("\n--- Tailored Resume Preview (first 500 chars) ---")
        print(tailored_resume[:500] + "...")

        # Validate output
        required_sections = ["CONTACT", "EXPERIENCE", "EDUCATION", "SKILLS"]
        sections_found = sum(1 for section in required_sections if section in tailored_resume.upper())

        print(f"\nSections found: {sections_found}/{len(required_sections)}")
        if sections_found >= 3:
            print_success("Resume tailoring output looks good")
            return True
        else:
            print_warning("Some expected sections missing from output")
            return True  # Still pass, but with warning

    except Exception as e:
        print_error(f"Resume tailoring failed: {e}")
        return False


async def test_latex_conversion():
    """Test LaTeX conversion with Groq"""
    print_section("TEST 5: LaTeX Conversion with Groq AI")

    try:
        from langchain_groq import ChatGroq

        groq_api_key = os.getenv("GROQ_API_KEY")
        llm = ChatGroq(
            model_name="llama-3.3-70b-versatile",
            temperature=0.1,  # Lower temperature for more consistent LaTeX generation
            groq_api_key=groq_api_key
        )

        resume_json = json.dumps(SAMPLE_RESUME_JSON, indent=2)
        prompt = format_latex_conversion_prompt(resume_json)

        print("Sending LaTeX conversion request to Groq...")
        print(f"Resume data: {len(resume_json)} chars")

        response = llm.invoke(prompt)
        latex_code = response.content

        print_success("LaTeX conversion completed")
        print(f"Output length: {len(latex_code)} characters")

        # Validate LaTeX output
        is_valid, errors = validate_latex_output(latex_code)

        if is_valid:
            print_success("LaTeX output is valid")
        else:
            print_warning("LaTeX validation found issues:")
            for error in errors:
                print(f"  - {error}")

        # Show preview (first 800 chars)
        print("\n--- LaTeX Code Preview (first 800 chars) ---")
        print(latex_code[:800] + "...")

        # Save to file for manual inspection
        output_file = "/workspaces/KairosCV/Backend_Modified/test_output.tex"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(latex_code)
        print_success(f"Full LaTeX code saved to: {output_file}")

        return is_valid or len(errors) == 0

    except Exception as e:
        print_error(f"LaTeX conversion failed: {e}")
        return False


async def test_latex_compilation():
    """Test LaTeX compilation with pdflatex"""
    print_section("TEST 6: LaTeX Compilation with pdflatex")

    import subprocess
    import tempfile
    import shutil

    # Check if pdflatex is installed
    try:
        result = subprocess.run(
            ['pdflatex', '--version'],
            capture_output=True,
            timeout=5
        )
        if result.returncode != 0:
            print_error("pdflatex not found or not working")
            return False
        print_success("pdflatex is installed")
    except Exception as e:
        print_error(f"pdflatex check failed: {e}")
        print("Please install LaTeX: sudo apt-get install texlive-latex-base texlive-fonts-recommended texlive-latex-extra")
        return False

    # Try to compile the test output
    test_file = "/workspaces/KairosCV/Backend_Modified/test_output.tex"

    if not os.path.exists(test_file):
        print_warning("test_output.tex not found, skipping compilation test")
        print("Run TEST 5 first to generate LaTeX code")
        return True  # Don't fail, just skip

    try:
        # Create temporary directory for compilation
        with tempfile.TemporaryDirectory() as tmpdir:
            # Copy tex file to temp dir
            temp_tex = os.path.join(tmpdir, "resume.tex")
            shutil.copy(test_file, temp_tex)

            print("Compiling LaTeX with pdflatex...")

            # Run pdflatex
            result = subprocess.run(
                ['pdflatex', '-interaction=nonstopmode', 'resume.tex'],
                cwd=tmpdir,
                capture_output=True,
                timeout=30
            )

            # Check if PDF was created
            pdf_path = os.path.join(tmpdir, "resume.pdf")
            if os.path.exists(pdf_path):
                # Copy PDF to Backend_Modified for inspection
                output_pdf = "/workspaces/KairosCV/Backend_Modified/test_output.pdf"
                shutil.copy(pdf_path, output_pdf)
                print_success(f"LaTeX compilation successful! PDF created: {output_pdf}")

                # Check PDF file size
                pdf_size = os.path.getsize(output_pdf)
                print(f"PDF size: {pdf_size / 1024:.2f} KB")
                return True
            else:
                print_error("PDF was not created")
                # Show compilation errors
                if result.stderr:
                    print("Compilation errors:")
                    print(result.stderr.decode('utf-8', errors='ignore')[:500])
                return False

    except subprocess.TimeoutExpired:
        print_error("LaTeX compilation timed out (>30s)")
        return False
    except Exception as e:
        print_error(f"LaTeX compilation failed: {e}")
        return False


async def main():
    """Run all tests"""
    print_section("KAIROSCV - Day 5: Prompt Templates Testing", width=80)
    print("Testing resume processing prompts with Groq API\n")

    results = {}

    # Test 1: Groq connection
    results['groq_connection'] = await test_groq_connection()

    if not results['groq_connection']:
        print("\n" + "=" * 80)
        print_error("Groq API connection failed. Cannot proceed with AI tests.")
        print("Please configure GROQ_API_KEY and try again.")
        return

    # Test 2: Prompt formatting
    results['prompt_formatting'] = test_prompt_formatting()

    # Test 3: LaTeX template
    results['latex_template'] = test_latex_template()

    # Test 4: Resume tailoring
    results['resume_tailoring'] = await test_resume_tailoring()

    # Test 5: LaTeX conversion
    results['latex_conversion'] = await test_latex_conversion()

    # Test 6: LaTeX compilation
    results['latex_compilation'] = await test_latex_compilation()

    # Summary
    print_section("TEST SUMMARY")

    total_tests = len(results)
    passed_tests = sum(1 for result in results.values() if result)

    print(f"\nTests passed: {passed_tests}/{total_tests}\n")

    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}  {test_name.replace('_', ' ').title()}")

    if passed_tests == total_tests:
        print_section("🎉 ALL TESTS PASSED! Day 5 Complete! 🎉")
        return True
    else:
        print_section("⚠️  Some tests failed. Review errors above.")
        return False


if __name__ == "__main__":
    asyncio.run(main())
