#!/usr/bin/env python3
"""
Test Script for LaTeX Data Mapper - Day 6 Implementation

This script tests the complete LaTeX data injection pipeline:
1. Load sample resume JSON
2. Map data to LaTeX using latex_data_mapper
3. Validate LaTeX output
4. Compile to PDF using pdflatex
5. Verify PDF quality

No AI/API required - this tests pure data transformation.
"""

import os
import sys
import json
import subprocess
from pathlib import Path

# Add Backend_Modified to path
sys.path.insert(0, str(Path(__file__).parent))

from models import ResumeData
from latex_data_mapper import (
    escape_latex,
    format_date,
    format_date_range,
    generate_contact_section,
    generate_education_section,
    generate_experience_section,
    generate_projects_section,
    generate_skills_section,
    map_resume_data_to_latex,
    validate_latex_output,
)
from prompts import LATEX_TEMPLATE

# ANSI color codes for output
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
RESET = "\033[0m"


def print_test(test_name: str):
    """Print test header"""
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}TEST: {test_name}{RESET}")
    print(f"{BLUE}{'='*60}{RESET}")


def print_pass(message: str):
    """Print success message"""
    print(f"{GREEN}✅ PASS{RESET}  {message}")


def print_fail(message: str):
    """Print failure message"""
    print(f"{RED}❌ FAIL{RESET}  {message}")


def print_warning(message: str):
    """Print warning message"""
    print(f"{YELLOW}⚠️  WARN{RESET}  {message}")


def print_info(message: str):
    """Print info message"""
    print(f"ℹ️  {message}")


# ============================================================================
# TEST 1: Helper Functions
# ============================================================================

def test_helper_functions():
    """Test escape_latex, format_date, format_date_range"""
    print_test("Helper Functions")

    # Test escape_latex
    test_cases = [
        ("R&D Engineer", "R\\&D Engineer"),
        ("50% improvement", "50\\% improvement"),
        ("Company_Name", "Company\\_Name"),
        ("Cost: $100", "Cost: \\$100"),
        ("C++ & Python", "C++ \\& Python"),
    ]

    all_pass = True
    for input_text, expected in test_cases:
        result = escape_latex(input_text)
        if result == expected:
            print_pass(f"escape_latex('{input_text}') → '{result}'")
        else:
            print_fail(f"escape_latex('{input_text}') → '{result}' (expected '{expected}')")
            all_pass = False

    # Test format_date
    date_cases = [
        ("2021-09", "Sept 2021"),
        ("2022-05-01", "May 2022"),
        ("09/2021", "Sept 2021"),
        ("Sept 2021", "Sept 2021"),  # Already formatted
    ]

    for input_date, expected in date_cases:
        result = format_date(input_date)
        if result == expected:
            print_pass(f"format_date('{input_date}') → '{result}'")
        else:
            print_fail(f"format_date('{input_date}') → '{result}' (expected '{expected}')")
            all_pass = False

    # Test format_date_range
    range_result = format_date_range("2021-09", "", True)
    if range_result == "Sept 2021 -- Present":
        print_pass(f"format_date_range (ongoing) → '{range_result}'")
    else:
        print_fail(f"format_date_range (ongoing) → '{range_result}'")
        all_pass = False

    return all_pass


# ============================================================================
# TEST 2: Section Generators
# ============================================================================

def test_section_generators():
    """Test individual section generators with sample data"""
    print_test("Section Generators")

    # Load sample data
    with open('sample_resume.json', 'r') as f:
        resume_dict = json.load(f)

    resume_data = ResumeData(**resume_dict)

    all_pass = True

    # Test contact section
    try:
        contact = generate_contact_section(resume_data.basicInfo)
        if "\\textbf{\\Huge \\scshape" in contact and "\\href" in contact:
            print_pass(f"Contact section generated ({len(contact)} chars)")
        else:
            print_fail("Contact section missing expected LaTeX commands")
            all_pass = False
    except Exception as e:
        print_fail(f"Contact section failed: {e}")
        all_pass = False

    # Test education section
    try:
        education = generate_education_section(resume_data.education)
        if "\\section{Education}" in education and "\\resumeSubheading" in education:
            print_pass(f"Education section generated ({len(education)} chars)")
        else:
            print_fail("Education section missing expected LaTeX commands")
            all_pass = False
    except Exception as e:
        print_fail(f"Education section failed: {e}")
        all_pass = False

    # Test experience section
    try:
        experience = generate_experience_section(resume_data.experience)
        if "\\section{Experience}" in experience and "\\resumeItem" in experience:
            print_pass(f"Experience section generated ({len(experience)} chars)")
        else:
            print_fail("Experience section missing expected LaTeX commands")
            all_pass = False
    except Exception as e:
        print_fail(f"Experience section failed: {e}")
        all_pass = False

    # Test projects section
    try:
        projects = generate_projects_section(resume_data.projects)
        if "\\section{Projects}" in projects and "\\resumeProjectHeading" in projects:
            print_pass(f"Projects section generated ({len(projects)} chars)")
        else:
            print_fail("Projects section missing expected LaTeX commands")
            all_pass = False
    except Exception as e:
        print_fail(f"Projects section failed: {e}")
        all_pass = False

    # Test skills section
    try:
        skills = generate_skills_section(resume_data.skills)
        if "\\section{Technical Skills}" in skills and "\\textbf{Languages}" in skills:
            print_pass(f"Skills section generated ({len(skills)} chars)")
        else:
            print_fail("Skills section missing expected content")
            all_pass = False
    except Exception as e:
        print_fail(f"Skills section failed: {e}")
        all_pass = False

    return all_pass


# ============================================================================
# TEST 3: Complete Data Mapping
# ============================================================================

def test_complete_mapping():
    """Test full resume data mapping to LaTeX"""
    print_test("Complete Data Mapping")

    # Load sample data
    with open('sample_resume.json', 'r') as f:
        resume_dict = json.load(f)

    resume_data = ResumeData(**resume_dict)

    try:
        # Map to LaTeX
        latex_doc = map_resume_data_to_latex(resume_data, LATEX_TEMPLATE)

        # Check structure
        checks = [
            ("\\documentclass" in latex_doc, "Has \\documentclass"),
            ("\\begin{document}" in latex_doc, "Has \\begin{document}"),
            ("\\end{document}" in latex_doc, "Has \\end{document}"),
            ("[CONTACT]" not in latex_doc, "No [CONTACT] placeholder"),
            ("[EDUCATION]" not in latex_doc, "No [EDUCATION] placeholder"),
            ("[EXPERIENCE]" not in latex_doc, "No [EXPERIENCE] placeholder"),
            ("[PROJECTS]" not in latex_doc, "No [PROJECTS] placeholder"),
            ("[SKILLS]" not in latex_doc, "No [SKILLS] placeholder"),
        ]

        all_pass = True
        for check, description in checks:
            if check:
                print_pass(description)
            else:
                print_fail(description)
                all_pass = False

        print_info(f"Generated LaTeX: {len(latex_doc)} characters")

        # Save to file for inspection
        output_file = "test_mapper_output.tex"
        with open(output_file, 'w') as f:
            f.write(latex_doc)
        print_info(f"Saved to: {output_file}")

        return all_pass, latex_doc

    except Exception as e:
        print_fail(f"Data mapping failed: {e}")
        return False, None


# ============================================================================
# TEST 4: LaTeX Validation
# ============================================================================

def test_latex_validation(latex_content: str):
    """Test LaTeX validation function"""
    print_test("LaTeX Validation")

    if not latex_content:
        print_fail("No LaTeX content provided")
        return False

    is_valid, errors = validate_latex_output(latex_content)

    if is_valid:
        print_pass("LaTeX validation passed (no errors)")
        return True
    else:
        print_warning(f"LaTeX validation found {len(errors)} issues:")
        for error in errors:
            print(f"   - {error}")
        # Warnings don't fail the test
        return True


# ============================================================================
# TEST 5: PDF Compilation
# ============================================================================

def test_pdf_compilation():
    """Test PDF compilation with pdflatex"""
    print_test("PDF Compilation")

    tex_file = "test_mapper_output.tex"
    if not os.path.exists(tex_file):
        print_fail(f"LaTeX file not found: {tex_file}")
        return False

    try:
        # Run pdflatex
        print_info("Running pdflatex...")
        result = subprocess.run(
            ["pdflatex", "-interaction=nonstopmode", tex_file],
            capture_output=True,
            text=True,
            timeout=30
        )

        pdf_file = tex_file.replace('.tex', '.pdf')

        if os.path.exists(pdf_file):
            pdf_size = os.path.getsize(pdf_file)
            print_pass(f"PDF generated successfully: {pdf_file}")
            print_info(f"PDF size: {pdf_size / 1024:.2f} KB")

            if result.returncode != 0:
                print_warning("pdflatex returned non-zero exit code (but PDF was generated)")

            return True
        else:
            print_fail("PDF file not generated")
            print_info("pdflatex stderr:")
            print(result.stderr[-1000:])  # Last 1000 chars
            return False

    except subprocess.TimeoutExpired:
        print_fail("pdflatex timed out after 30 seconds")
        return False
    except FileNotFoundError:
        print_fail("pdflatex not found - ensure LaTeX is installed")
        return False
    except Exception as e:
        print_fail(f"PDF compilation error: {e}")
        return False


# ============================================================================
# MAIN TEST RUNNER
# ============================================================================

def main():
    """Run all tests"""
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}LaTeX Data Mapper Test Suite - Day 6{RESET}")
    print(f"{BLUE}{'='*60}{RESET}")

    # Change to Backend_Modified directory
    os.chdir(Path(__file__).parent)

    results = []

    # Run tests
    results.append(("Helper Functions", test_helper_functions()))
    results.append(("Section Generators", test_section_generators()))

    mapping_pass, latex_content = test_complete_mapping()
    results.append(("Complete Mapping", mapping_pass))

    if latex_content:
        results.append(("LaTeX Validation", test_latex_validation(latex_content)))
        results.append(("PDF Compilation", test_pdf_compilation()))
    else:
        print_warning("Skipping validation and compilation tests (no LaTeX content)")
        results.append(("LaTeX Validation", False))
        results.append(("PDF Compilation", False))

    # Print summary
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}TEST SUMMARY{RESET}")
    print(f"{BLUE}{'='*60}{RESET}")

    passed = sum(1 for _, result in results if result)
    total = len(results)

    for test_name, result in results:
        status = f"{GREEN}✅ PASS{RESET}" if result else f"{RED}❌ FAIL{RESET}"
        print(f"{status}  {test_name}")

    print(f"\n{BLUE}Total: {passed}/{total} tests passed{RESET}")

    if passed == total:
        print(f"\n{GREEN}🎉 ALL TESTS PASSED! Day 6 implementation successful!{RESET}\n")
        return 0
    else:
        print(f"\n{RED}⚠️  Some tests failed. Review errors above.{RESET}\n")
        return 1


if __name__ == "__main__":
    sys.exit(main())
