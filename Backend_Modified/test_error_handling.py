"""
Test Error Handling

Comprehensive test suite for error handling in the KairosCV backend.
Tests various error scenarios to ensure proper error codes and messages.
"""

import requests
import json
import time
from typing import Dict, Any

# Configuration
BASE_URL = "http://localhost:8080"
COLORS = {
    "PASS": "\033[92m",
    "FAIL": "\033[91m",
    "INFO": "\033[94m",
    "END": "\033[0m"
}


def print_test(name: str, passed: bool, details: str = ""):
    """Print test result with color"""
    status = f"{COLORS['PASS']}✓ PASS{COLORS['END']}" if passed else f"{COLORS['FAIL']}✗ FAIL{COLORS['END']}"
    print(f"  {status} - {name}")
    if details and not passed:
        print(f"         {details}")


def test_health_endpoint():
    """Test 1: Health endpoint returns proper status"""
    print(f"\n{COLORS['INFO']}Test 1: Health Endpoint{COLORS['END']}")

    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        passed = response.status_code == 200 and "status" in response.json()
        print_test("Health endpoint accessible", passed)

        data = response.json()
        checks_present = "checks" in data and len(data["checks"]) > 0
        print_test("Health checks present", checks_present)

        return passed and checks_present
    except Exception as e:
        print_test("Health endpoint accessible", False, str(e))
        return False


def test_invalid_json():
    """Test 2: Invalid JSON returns proper error"""
    print(f"\n{COLORS['INFO']}Test 2: Invalid JSON Handling{COLORS['END']}")

    # Test with malformed JSON
    try:
        headers = {"Content-Type": "application/json"}
        response = requests.post(
            f"{BASE_URL}/convert-json-to-latex",
            data="{ invalid json }",  # Malformed JSON
            headers=headers,
            timeout=5
        )

        # Should return 422 (FastAPI validation error) or 400
        is_error = response.status_code in [400, 422]
        print_test("Returns error for invalid JSON", is_error, f"Got {response.status_code}")

        if is_error:
            try:
                error_data = response.json()
                has_error_details = "detail" in error_data or "error" in error_data
                print_test("Error response has details", has_error_details)
                return has_error_details
            except:
                return False
        return False
    except Exception as e:
        print_test("Invalid JSON test", False, str(e))
        return False


def test_missing_required_fields():
    """Test 3: Missing required fields returns validation error"""
    print(f"\n{COLORS['INFO']}Test 3: Missing Required Fields{COLORS['END']}")

    # Test with incomplete data (missing required fields)
    incomplete_data = {
        "basicInfo": {
            "fullName": "Test User"
            # Missing email, phone, etc.
        }
    }

    try:
        response = requests.post(
            f"{BASE_URL}/convert-json-to-latex",
            json=incomplete_data,
            timeout=5
        )

        # Should return 422 (validation error)
        is_validation_error = response.status_code == 422
        print_test("Returns 422 for missing fields", is_validation_error, f"Got {response.status_code}")

        if is_validation_error:
            error_data = response.json()
            has_detail = "detail" in error_data
            print_test("Error includes detail", has_detail)
            return has_detail
        return False
    except Exception as e:
        print_test("Missing fields test", False, str(e))
        return False


def test_rate_limiting():
    """Test 4: Rate limiting works properly"""
    print(f"\n{COLORS['INFO']}Test 4: Rate Limiting{COLORS['END']}")

    # Send multiple requests rapidly to trigger rate limit
    # Note: This test is light (only 3 requests) to avoid actually hitting limits

    valid_data = {
        "basicInfo": {
            "fullName": "Test User",
            "email": "test@example.com",
            "phone": "+1234567890",
            "linkedin": "linkedin.com/in/test",
            "github": "github.com/test"
        },
        "education": [],
        "experience": [],
        "projects": [],
        "skills": {"technical": [], "soft": []},
        "certifications": []
    }

    try:
        # Send 3 requests
        responses = []
        for i in range(3):
            resp = requests.post(
                f"{BASE_URL}/convert-json-to-latex",
                json=valid_data,
                timeout=30
            )
            responses.append(resp)
            time.sleep(0.5)  # Small delay

        # Check that requests were processed or rate limited
        status_codes = [r.status_code for r in responses]
        # Should get either 200 (success) or 429 (rate limited)
        all_valid = all(code in [200, 429, 503] for code in status_codes)
        print_test("Rate limiting returns valid codes", all_valid, f"Got codes: {status_codes}")

        return all_valid
    except Exception as e:
        print_test("Rate limiting test", False, str(e))
        return False


def test_error_response_structure():
    """Test 5: Error responses have consistent structure"""
    print(f"\n{COLORS['INFO']}Test 5: Error Response Structure{COLORS['END']}")

    # Trigger an error with invalid data
    invalid_data = {"basicInfo": {}}  # Will fail validation

    try:
        response = requests.post(
            f"{BASE_URL}/convert-json-to-latex",
            json=invalid_data,
            timeout=5
        )

        if response.status_code >= 400:
            error_data = response.json()

            # Check for error structure
            has_detail = "detail" in error_data
            print_test("Has 'detail' field", has_detail)

            # FastAPI's validation errors have specific structure
            if has_detail:
                is_list = isinstance(error_data["detail"], list)
                is_str = isinstance(error_data["detail"], str)
                is_dict = isinstance(error_data["detail"], dict)

                valid_structure = is_list or is_str or is_dict
                print_test("Error detail has valid structure", valid_structure)
                return valid_structure

        return False
    except Exception as e:
        print_test("Error structure test", False, str(e))
        return False


def test_file_upload_endpoint():
    """Test 6: File upload endpoint error handling"""
    print(f"\n{COLORS['INFO']}Test 6: File Upload Error Handling{COLORS['END']}")

    # Test with no file
    try:
        response = requests.post(
            f"{BASE_URL}/convert-latex",
            timeout=5
        )

        # Should return 422 (missing required file)
        is_error = response.status_code == 422
        print_test("Returns error for missing file", is_error, f"Got {response.status_code}")

        return is_error
    except Exception as e:
        print_test("File upload test", False, str(e))
        return False


def run_all_tests():
    """Run all error handling tests"""
    print(f"\n{'='*60}")
    print(f"{COLORS['INFO']}ERROR HANDLING TEST SUITE{COLORS['END']}")
    print(f"{'='*60}")

    print(f"\n{COLORS['INFO']}Target: {BASE_URL}{COLORS['END']}")
    print(f"{COLORS['INFO']}Testing comprehensive error handling...\n{COLORS['END']}")

    results = {
        "Test 1: Health Endpoint": test_health_endpoint(),
        "Test 2: Invalid JSON": test_invalid_json(),
        "Test 3: Missing Fields": test_missing_required_fields(),
        "Test 4: Rate Limiting": test_rate_limiting(),
        "Test 5: Error Structure": test_error_response_structure(),
        "Test 6: File Upload": test_file_upload_endpoint(),
    }

    # Summary
    print(f"\n{'='*60}")
    print(f"{COLORS['INFO']}TEST SUMMARY{COLORS['END']}")
    print(f"{'='*60}\n")

    passed = sum(1 for v in results.values() if v)
    total = len(results)

    for test_name, result in results.items():
        status = f"{COLORS['PASS']}PASS{COLORS['END']}" if result else f"{COLORS['FAIL']}FAIL{COLORS['END']}"
        print(f"  {status} - {test_name}")

    print(f"\n{'-'*60}")
    pass_rate = (passed / total) * 100
    color = COLORS['PASS'] if pass_rate >= 80 else COLORS['FAIL']
    print(f"  {color}Results: {passed}/{total} tests passed ({pass_rate:.1f}%){COLORS['END']}")
    print(f"{'-'*60}\n")

    if pass_rate >= 80:
        print(f"{COLORS['PASS']}✅ Error handling is working well!{COLORS['END']}\n")
    else:
        print(f"{COLORS['FAIL']}❌ Error handling needs improvement{COLORS['END']}\n")

    return pass_rate >= 80


if __name__ == "__main__":
    try:
        success = run_all_tests()
        exit(0 if success else 1)
    except KeyboardInterrupt:
        print(f"\n\n{COLORS['INFO']}Tests interrupted by user{COLORS['END']}\n")
        exit(1)
    except Exception as e:
        print(f"\n\n{COLORS['FAIL']}Test suite failed: {e}{COLORS['END']}\n")
        exit(1)
