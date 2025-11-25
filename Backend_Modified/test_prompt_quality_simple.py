#!/usr/bin/env python3
"""
Day 9: Simple Prompt Quality Testing

Tests LaTeX generation and compilation without async complexity
"""

import os
import json
import time
import subprocess
from pathlib import Path

# Import backend modules
from latex_data_mapper import map_resume_data_to_latex
from prompts import LATEX_TEMPLATE
from models import ResumeData

# Colors
GREEN = '\033[92m'
RED = '\033[91m'
BLUE = '\033[94m'
RESET = '\033[0m'


def compile_latex(tex_path: str) -> tuple[bool, str]:
    """Compile LaTeX file to PDF using pdflatex"""
    try:
        # Change to latex_output directory
        output_dir = os.path.dirname(tex_path)
        tex_file = os.path.basename(tex_path)

        # Run pdflatex
        result = subprocess.run(
            ['pdflatex', '-interaction=nonstopmode', tex_file],
            cwd=output_dir,
            capture_output=True,
            timeout=30
        )

        # Check if PDF was created
        pdf_path = tex_path.replace('.tex', '.pdf')
        if os.path.exists(pdf_path):
            return True, pdf_path
        else:
            return False, f"pdflatex returned {result.returncode}"

    except subprocess.TimeoutExpired:
        return False, "Compilation timeout (>30s)"
    except Exception as e:
        return False, str(e)


def test_resume(filepath: str, test_num: int) -> dict:
    """Test single resume"""
    print(f"\n{BLUE}Test {test_num}: {Path(filepath).name}{RESET}")

    result = {
        "file": Path(filepath).name,
        "success": False,
        "time": 0,
        "pdf_size": 0,
        "errors": []
    }

    try:
        # Load and validate
        with open(filepath) as f:
            resume_dict = json.load(f)
        resume_data = ResumeData(**resume_dict)
        name = resume_data.basicInfo.fullName
        print(f"  ✓ Loaded: {name}")

        # Generate LaTeX
        start_time = time.time()
        latex_code = map_resume_data_to_latex(resume_data, LATEX_TEMPLATE)

        # Validate LaTeX structure
        if not latex_code.startswith('\\documentclass'):
            result["errors"].append("Missing \\documentclass")
        if '\\begin{document}' not in latex_code:
            result["errors"].append("Missing \\begin{document}")
        if '\\end{document}' not in latex_code:
            result["errors"].append("Missing \\end{document}")

        print(f"  ✓ Generated LaTeX ({len(latex_code)} chars)")

        # Save LaTeX file
        os.makedirs('latex_output', exist_ok=True)
        tex_filename = f"test_{test_num}_{Path(filepath).stem}.tex"
        tex_path = os.path.join('latex_output', tex_filename)

        with open(tex_path, 'w') as f:
            f.write(latex_code)
        print(f"  ✓ Saved: {tex_filename}")

        # Compile to PDF
        success, pdf_path_or_error = compile_latex(tex_path)

        end_time = time.time()
        result["time"] = round(end_time - start_time, 3)

        if success:
            result["success"] = True
            result["pdf_size"] = os.path.getsize(pdf_path_or_error)
            print(f"  {GREEN}✓ PDF compiled ({result['pdf_size']/1024:.1f} KB, {result['time']}s){RESET}")
        else:
            result["errors"].append(f"Compilation failed: {pdf_path_or_error}")
            print(f"  {RED}✗ Compilation failed: {pdf_path_or_error}{RESET}")

    except Exception as e:
        result["errors"].append(str(e))
        print(f"  {RED}✗ Error: {e}{RESET}")

    return result


def main():
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}DAY 9: PROMPT QUALITY TESTING{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")

    # Find test files
    test_files = sorted(Path("test_datasets").glob("*.json"))
    print(f"Found {len(test_files)} test resumes\n")

    # Run tests
    results = []
    for i, filepath in enumerate(test_files, 1):
        result = test_resume(str(filepath), i)
        results.append(result)

    # Summary
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}SUMMARY{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")

    total = len(results)
    successful = sum(1 for r in results if r["success"])
    success_rate = (successful / total * 100) if total > 0 else 0

    print(f"Total:      {total}")
    print(f"Success:    {GREEN}{successful}{RESET}")
    print(f"Failed:     {RED}{total - successful}{RESET}")
    print(f"Rate:       {success_rate:.1f}%")

    if successful > 0:
        avg_time = sum(r["time"] for r in results if r["success"]) / successful
        avg_size = sum(r["pdf_size"] for r in results if r["success"]) / successful
        print(f"Avg Time:   {avg_time:.3f}s")
        print(f"Avg Size:   {avg_size/1024:.1f} KB")

    # Target check
    print(f"\n{BLUE}TARGET:{RESET}")
    if success_rate >= 95:
        print(f"{GREEN}✓ Success rate: {success_rate:.1f}% >= 95%{RESET}")
    else:
        print(f"{RED}✗ Success rate: {success_rate:.1f}% < 95%{RESET}")
        print(f"  Need: {95 - success_rate:.1f}% more")

    # Save results
    with open("test_results_day9.json", 'w') as f:
        json.dump({
            "total": total,
            "successful": successful,
            "success_rate": success_rate,
            "results": results
        }, f, indent=2)

    print(f"\n{BLUE}{'='*60}{RESET}\n")


if __name__ == "__main__":
    main()
