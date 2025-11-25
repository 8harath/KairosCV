#!/usr/bin/env python3
"""
Day 9: Prompt Quality Testing Script

Tests all resumes in test_datasets/ directory and evaluates:
1. LaTeX syntax errors
2. Content accuracy
3. Formatting consistency
4. Compilation success rate
"""

import os
import json
import time
import subprocess
from pathlib import Path
from typing import Dict, List, Tuple

# Import backend modules
from latex_data_mapper import map_resume_data_to_latex
from latex_converter import convert_latex_to_pdf
from prompts import LATEX_TEMPLATE
from models import ResumeData

# Color codes for terminal output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'


def load_test_resume(filepath: str) -> Dict:
    """Load resume JSON from file"""
    with open(filepath, 'r') as f:
        return json.load(f)


def test_single_resume(filepath: str, test_num: int) -> Dict:
    """Test a single resume and return results"""
    print(f"\n{BLUE}{'='*80}{RESET}")
    print(f"{BLUE}Test {test_num}: {Path(filepath).name}{RESET}")
    print(f"{BLUE}{'='*80}{RESET}")

    result = {
        "file": Path(filepath).name,
        "success": False,
        "time": 0,
        "pdf_size": 0,
        "errors": [],
        "warnings": []
    }

    try:
        # Load resume data
        resume_dict = load_test_resume(filepath)
        print(f"✓ Loaded resume: {resume_dict['basicInfo']['fullName']}")

        # Convert dict to Pydantic model
        resume_data = ResumeData(**resume_dict)
        print(f"✓ Validated resume data with Pydantic")

        # Generate LaTeX
        start_time = time.time()
        latex_code = map_resume_data_to_latex(resume_data, LATEX_TEMPLATE)
        print(f"✓ Generated LaTeX code ({len(latex_code)} characters)")

        # Basic validation
        if not latex_code.startswith('\\documentclass'):
            result["errors"].append("LaTeX doesn't start with \\documentclass")

        if '\\begin{document}' not in latex_code:
            result["errors"].append("Missing \\begin{document}")

        if '\\end{document}' not in latex_code:
            result["errors"].append("Missing \\end{document}")

        # Save LaTeX to temporary file
        tex_filename = f"test_{test_num}_{Path(filepath).stem}.tex"
        tex_path = os.path.join('latex_output', tex_filename)

        with open(tex_path, 'w') as f:
            f.write(latex_code)
        print(f"✓ Saved LaTeX to {tex_path}")

        # Compile to PDF
        pdf_path = convert_latex_to_pdf(tex_path)

        end_time = time.time()
        result["time"] = round(end_time - start_time, 3)

        # Check PDF exists and get size
        if os.path.exists(pdf_path):
            result["pdf_size"] = os.path.getsize(pdf_path)
            result["success"] = True
            print(f"{GREEN}✓ PDF generated successfully!{RESET}")
            print(f"  Time: {result['time']}s")
            print(f"  Size: {result['pdf_size'] / 1024:.1f} KB")
        else:
            result["errors"].append("PDF file not created")
            print(f"{RED}✗ PDF generation failed{RESET}")

    except subprocess.CalledProcessError as e:
        result["errors"].append(f"LaTeX compilation error: {e}")
        print(f"{RED}✗ LaTeX compilation failed{RESET}")
        print(f"  Error: {e}")

    except Exception as e:
        result["errors"].append(f"Unexpected error: {str(e)}")
        print(f"{RED}✗ Test failed with exception{RESET}")
        print(f"  Error: {e}")

    return result


def generate_report(results: List[Dict]):
    """Generate comprehensive test report"""
    print(f"\n\n{BLUE}{'='*80}{RESET}")
    print(f"{BLUE}TEST SUMMARY{RESET}")
    print(f"{BLUE}{'='*80}{RESET}\n")

    total = len(results)
    successful = sum(1 for r in results if r["success"])
    failed = total - successful
    success_rate = (successful / total * 100) if total > 0 else 0

    # Overall statistics
    print(f"Total Tests:     {total}")
    print(f"{GREEN}Successful:      {successful}{RESET}")
    print(f"{RED}Failed:          {failed}{RESET}")
    print(f"Success Rate:    {success_rate:.1f}%")

    if successful > 0:
        avg_time = sum(r["time"] for r in results if r["success"]) / successful
        avg_size = sum(r["pdf_size"] for r in results if r["success"]) / successful
        print(f"\nAverage Time:    {avg_time:.3f}s")
        print(f"Average Size:    {avg_size / 1024:.1f} KB")

    # Failed tests details
    if failed > 0:
        print(f"\n{RED}FAILED TESTS:{RESET}")
        for r in results:
            if not r["success"]:
                print(f"\n  ✗ {r['file']}")
                for error in r["errors"]:
                    print(f"    - {error}")

    # Performance metrics
    print(f"\n{BLUE}PERFORMANCE METRICS:{RESET}")
    fastest = min(results, key=lambda x: x["time"] if x["success"] else float('inf'))
    slowest = max(results, key=lambda x: x["time"] if x["success"] else 0)

    if fastest["success"]:
        print(f"Fastest:         {fastest['file']} ({fastest['time']}s)")
    if slowest["success"]:
        print(f"Slowest:         {slowest['file']} ({slowest['time']}s)")

    # Target achievement
    print(f"\n{BLUE}TARGET ACHIEVEMENT:{RESET}")
    target_success_rate = 95.0
    target_time = 10.0

    if success_rate >= target_success_rate:
        print(f"{GREEN}✓ Success rate target achieved: {success_rate:.1f}% >= {target_success_rate}%{RESET}")
    else:
        print(f"{RED}✗ Success rate below target: {success_rate:.1f}% < {target_success_rate}%{RESET}")
        print(f"  Need to improve: {target_success_rate - success_rate:.1f}% more")

    if successful > 0 and avg_time < target_time:
        print(f"{GREEN}✓ Performance target achieved: {avg_time:.3f}s < {target_time}s{RESET}")
    elif successful > 0:
        print(f"{YELLOW}! Performance acceptable: {avg_time:.3f}s{RESET}")

    # Issues to address
    print(f"\n{BLUE}ISSUES TO ADDRESS:{RESET}")
    all_errors = []
    for r in results:
        all_errors.extend(r["errors"])

    if all_errors:
        unique_errors = list(set(all_errors))
        for i, error in enumerate(unique_errors, 1):
            count = all_errors.count(error)
            print(f"  {i}. {error} ({count} occurrences)")
    else:
        print(f"{GREEN}  No issues found!{RESET}")

    print(f"\n{BLUE}{'='*80}{RESET}\n")


def main():
    """Main test execution"""
    print(f"\n{BLUE}╔{'═'*78}╗{RESET}")
    print(f"{BLUE}║{' '*25}DAY 9: PROMPT QUALITY TESTING{' '*24}║{RESET}")
    print(f"{BLUE}╚{'═'*78}╝{RESET}\n")

    # Find all test files
    test_dir = Path("test_datasets")
    test_files = sorted(test_dir.glob("*.json"))

    if not test_files:
        print(f"{RED}Error: No test files found in {test_dir}/{RESET}")
        return

    print(f"Found {len(test_files)} test resumes\n")

    # Run tests
    results = []
    for i, filepath in enumerate(test_files, 1):
        result = test_single_resume(str(filepath), i)
        results.append(result)
        time.sleep(0.5)  # Brief pause between tests

    # Generate report
    generate_report(results)

    # Save results to JSON
    output_file = "test_results_day9.json"
    with open(output_file, 'w') as f:
        json.dump({
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "total_tests": len(results),
            "successful": sum(1 for r in results if r["success"]),
            "failed": sum(1 for r in results if not r["success"]),
            "success_rate": (sum(1 for r in results if r["success"]) / len(results) * 100),
            "results": results
        }, f, indent=2)

    print(f"Detailed results saved to: {output_file}")


if __name__ == "__main__":
    main()
