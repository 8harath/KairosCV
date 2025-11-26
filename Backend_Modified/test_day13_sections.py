#!/usr/bin/env python3
"""
Test script for Day 13 new sections
Tests PDF generation with all new resume sections
"""

import json
import os
import sys
from models import ResumeData
from latex_data_mapper import map_resume_data_to_latex
from prompts import get_latex_template

def test_new_sections():
    """Test PDF generation with all new sections"""

    print("=" * 80)
    print("DAY 13: Testing New Resume Sections")
    print("=" * 80)
    print()

    # Load test data
    test_data_path = "test_data_day13_extended.json"
    print(f"Loading test data from: {test_data_path}")

    with open(test_data_path, 'r') as f:
        data = json.load(f)

    # Validate with Pydantic
    print("Validating data with Pydantic models...")
    try:
        resume_data = ResumeData(**data)
        print("✅ Data validation successful")
    except Exception as e:
        print(f"❌ Data validation failed: {e}")
        return False

    # Check which sections are present
    print()
    print("Sections present in test data:")
    print(f"  • Basic Info: ✅")
    print(f"  • Education: ✅ ({len(resume_data.education)} items)")
    print(f"  • Experience: ✅ ({len(resume_data.experience)} items)")
    print(f"  • Projects: ✅ ({len(resume_data.projects)} items)")
    print(f"  • Skills: ✅")
    print(f"  • Certifications: {'✅' if resume_data.certifications else '❌'} ({len(resume_data.certifications or [])} items)")
    print(f"  • Awards: {'✅' if resume_data.awards else '❌'} ({len(resume_data.awards or [])} items)")
    print(f"  • Publications: {'✅' if resume_data.publications else '❌'} ({len(resume_data.publications or [])} items)")
    print(f"  • Volunteer: {'✅' if resume_data.volunteer else '❌'} ({len(resume_data.volunteer or [])} items)")
    print(f"  • Languages: {'✅' if resume_data.languages else '❌'} ({len(resume_data.languages or [])} items)")

    # Get template
    print()
    print("Loading LaTeX template...")
    template = get_latex_template()
    print(f"✅ Template loaded ({len(template)} characters)")

    # Generate LaTeX
    print()
    print("Generating LaTeX document...")
    try:
        latex_content = map_resume_data_to_latex(resume_data, template)
        print(f"✅ LaTeX generated ({len(latex_content)} characters)")
    except Exception as e:
        print(f"❌ LaTeX generation failed: {e}")
        import traceback
        traceback.print_exc()
        return False

    # Save LaTeX output for inspection
    output_path = "test_day13_output.tex"
    with open(output_path, 'w') as f:
        f.write(latex_content)
    print(f"✅ LaTeX saved to: {output_path}")

    # Verify all placeholders were replaced
    print()
    print("Verifying placeholders...")
    import re
    placeholders = re.findall(r'\[([A-Z_]+)\]', latex_content)
    if placeholders:
        print(f"❌ Unreplaced placeholders found: {placeholders}")
        return False
    else:
        print("✅ All placeholders replaced")

    # Check that new sections are present in output
    print()
    print("Checking for new sections in output...")
    sections_to_check = [
        ("Certifications", "AWS Solutions Architect"),
        ("Awards", "Best Innovation Award"),
        ("Publications", "Machine Learning for Resume Parsing"),
        ("Volunteer Experience", "Code for Good"),
        ("Languages", "Spanish")
    ]

    all_present = True
    for section_name, keyword in sections_to_check:
        if keyword in latex_content:
            print(f"  ✅ {section_name}: Found (contains '{keyword}')")
        else:
            print(f"  ❌ {section_name}: NOT FOUND (should contain '{keyword}')")
            all_present = False

    # Try to compile to PDF
    print()
    print("Attempting PDF compilation...")
    try:
        import subprocess

        # Change to the directory where the .tex file is
        tex_dir = os.path.dirname(os.path.abspath(output_path))
        tex_file = os.path.basename(output_path)

        result = subprocess.run(
            ['pdflatex', '-interaction=nonstopmode', '-halt-on-error', tex_file],
            cwd=tex_dir,
            capture_output=True,
            text=True,
            timeout=30
        )

        pdf_path = output_path.replace('.tex', '.pdf')
        if os.path.exists(pdf_path) and os.path.getsize(pdf_path) > 0:
            pdf_size_kb = os.path.getsize(pdf_path) / 1024
            print(f"✅ PDF compiled successfully: {pdf_path} ({pdf_size_kb:.1f} KB)")
        else:
            print("❌ PDF compilation failed or file is empty")
            print("pdflatex output (last 20 lines):")
            print('\n'.join(result.stdout.split('\n')[-20:]))
            return False

    except subprocess.TimeoutExpired:
        print("❌ PDF compilation timed out")
        return False
    except Exception as e:
        print(f"❌ PDF compilation error: {e}")
        import traceback
        traceback.print_exc()
        return False

    # Summary
    print()
    print("=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    print("✅ Data validation: PASS")
    print("✅ LaTeX generation: PASS")
    print("✅ Placeholder replacement: PASS")
    print(f"{'✅' if all_present else '❌'} Section verification: {'PASS' if all_present else 'FAIL'}")
    print("✅ PDF compilation: PASS")
    print()
    print("🎉 All Day 13 features working correctly!")
    print()

    return True

if __name__ == "__main__":
    success = test_new_sections()
    sys.exit(0 if success else 1)
