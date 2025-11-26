"""
Error Handlers Module

Provides structured error responses with consistent error codes,
messages, and logging for the KairosCV backend API.

Error Code Format: ERR_<CATEGORY>_<SPECIFIC>
Categories: VALIDATION, FILE, LATEX, AI, SYSTEM
"""

import logging
from typing import Optional, Dict, Any
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)

# Error Code Constants
class ErrorCodes:
    """Structured error codes for API responses"""

    # Validation Errors (400)
    VALIDATION_INVALID_JSON = "ERR_VALIDATION_INVALID_JSON"
    VALIDATION_MISSING_FIELD = "ERR_VALIDATION_MISSING_FIELD"
    VALIDATION_INVALID_EMAIL = "ERR_VALIDATION_INVALID_EMAIL"
    VALIDATION_INVALID_DATE = "ERR_VALIDATION_INVALID_DATE"
    VALIDATION_INVALID_FORMAT = "ERR_VALIDATION_INVALID_FORMAT"

    # File Errors (400, 413, 415)
    FILE_TOO_LARGE = "ERR_FILE_TOO_LARGE"
    FILE_UNSUPPORTED_TYPE = "ERR_FILE_UNSUPPORTED_TYPE"
    FILE_CORRUPTED = "ERR_FILE_CORRUPTED"
    FILE_EMPTY = "ERR_FILE_EMPTY"
    FILE_READ_ERROR = "ERR_FILE_READ_ERROR"

    # LaTeX Compilation Errors (500)
    LATEX_COMPILATION_FAILED = "ERR_LATEX_COMPILATION_FAILED"
    LATEX_TEMPLATE_ERROR = "ERR_LATEX_TEMPLATE_ERROR"
    LATEX_TIMEOUT = "ERR_LATEX_TIMEOUT"
    LATEX_MISSING_PDFLATEX = "ERR_LATEX_MISSING_PDFLATEX"

    # AI/LLM Errors (500, 503)
    AI_API_ERROR = "ERR_AI_API_ERROR"
    AI_TIMEOUT = "ERR_AI_TIMEOUT"
    AI_RATE_LIMIT = "ERR_AI_RATE_LIMIT"
    AI_INVALID_RESPONSE = "ERR_AI_INVALID_RESPONSE"

    # System Errors (500, 503)
    SYSTEM_DISK_FULL = "ERR_SYSTEM_DISK_FULL"
    SYSTEM_OUT_OF_MEMORY = "ERR_SYSTEM_OUT_OF_MEMORY"
    SYSTEM_TIMEOUT = "ERR_SYSTEM_TIMEOUT"
    SYSTEM_INTERNAL_ERROR = "ERR_SYSTEM_INTERNAL_ERROR"

    # Resource Errors (404, 429)
    RESOURCE_NOT_FOUND = "ERR_RESOURCE_NOT_FOUND"
    RATE_LIMIT_EXCEEDED = "ERR_RATE_LIMIT_EXCEEDED"


class APIError(Exception):
    """Base exception class for API errors"""

    def __init__(
        self,
        error_code: str,
        message: str,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        details: Optional[Dict[str, Any]] = None
    ):
        self.error_code = error_code
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)

    def to_dict(self) -> Dict[str, Any]:
        """Convert error to dictionary for JSON response"""
        response = {
            "error": {
                "code": self.error_code,
                "message": self.message,
                "status": self.status_code
            }
        }
        if self.details:
            response["error"]["details"] = self.details
        return response


# Specific Error Classes
class ValidationError(APIError):
    """Validation-related errors"""
    def __init__(self, message: str, error_code: str = ErrorCodes.VALIDATION_INVALID_FORMAT, details: Optional[Dict] = None):
        super().__init__(
            error_code=error_code,
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST,
            details=details
        )


class FileError(APIError):
    """File-related errors"""
    def __init__(self, message: str, error_code: str = ErrorCodes.FILE_READ_ERROR, details: Optional[Dict] = None):
        super().__init__(
            error_code=error_code,
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST,
            details=details
        )


class LaTeXError(APIError):
    """LaTeX compilation errors"""
    def __init__(self, message: str, error_code: str = ErrorCodes.LATEX_COMPILATION_FAILED, details: Optional[Dict] = None):
        super().__init__(
            error_code=error_code,
            message=message,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            details=details
        )


class AIError(APIError):
    """AI/LLM service errors"""
    def __init__(self, message: str, error_code: str = ErrorCodes.AI_API_ERROR, details: Optional[Dict] = None):
        super().__init__(
            error_code=error_code,
            message=message,
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            details=details
        )


class SystemError(APIError):
    """System-level errors"""
    def __init__(self, message: str, error_code: str = ErrorCodes.SYSTEM_INTERNAL_ERROR, details: Optional[Dict] = None):
        super().__init__(
            error_code=error_code,
            message=message,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            details=details
        )


# Error Response Builders
def create_error_response(
    error_code: str,
    message: str,
    status_code: int = 500,
    details: Optional[Dict[str, Any]] = None,
    log_error: bool = True
) -> JSONResponse:
    """
    Create a structured error response

    Args:
        error_code: Error code (e.g., ERR_VALIDATION_INVALID_JSON)
        message: Human-readable error message
        status_code: HTTP status code
        details: Additional error details
        log_error: Whether to log the error

    Returns:
        JSONResponse with structured error
    """
    error_response = {
        "error": {
            "code": error_code,
            "message": message,
            "status": status_code
        }
    }

    if details:
        error_response["error"]["details"] = details

    if log_error:
        logger.error(
            f"API Error: {error_code} - {message}",
            extra={"details": details} if details else {}
        )

    return JSONResponse(
        status_code=status_code,
        content=error_response
    )


def handle_validation_error(field: str, issue: str, value: Any = None) -> ValidationError:
    """Handle validation errors with structured details"""
    details = {
        "field": field,
        "issue": issue
    }
    if value is not None:
        details["provided_value"] = str(value)

    return ValidationError(
        message=f"Validation failed for field '{field}': {issue}",
        error_code=ErrorCodes.VALIDATION_MISSING_FIELD if "required" in issue.lower() else ErrorCodes.VALIDATION_INVALID_FORMAT,
        details=details
    )


def handle_file_error(filename: str, issue: str, error_code: str = ErrorCodes.FILE_READ_ERROR) -> FileError:
    """Handle file errors with structured details"""
    return FileError(
        message=f"File error for '{filename}': {issue}",
        error_code=error_code,
        details={"filename": filename, "issue": issue}
    )


def handle_latex_error(
    error_message: str,
    latex_log: Optional[str] = None,
    error_code: str = ErrorCodes.LATEX_COMPILATION_FAILED
) -> LaTeXError:
    """Handle LaTeX compilation errors with log details"""
    details = {"error_message": error_message}
    if latex_log:
        # Extract last 500 chars of log for debugging
        details["latex_log_excerpt"] = latex_log[-500:] if len(latex_log) > 500 else latex_log

    return LaTeXError(
        message=f"LaTeX compilation failed: {error_message}",
        error_code=error_code,
        details=details
    )


def handle_ai_error(
    service: str,
    error_message: str,
    error_code: str = ErrorCodes.AI_API_ERROR
) -> AIError:
    """Handle AI service errors"""
    return AIError(
        message=f"{service} error: {error_message}",
        error_code=error_code,
        details={"service": service, "error": error_message}
    )


def handle_system_error(
    component: str,
    error_message: str,
    error_code: str = ErrorCodes.SYSTEM_INTERNAL_ERROR
) -> SystemError:
    """Handle system-level errors"""
    return SystemError(
        message=f"System error in {component}: {error_message}",
        error_code=error_code,
        details={"component": component, "error": error_message}
    )


# Exception Handlers for FastAPI
async def api_error_handler(request, exc: APIError):
    """FastAPI exception handler for APIError"""
    logger.error(
        f"API Error: {exc.error_code} - {exc.message}",
        extra={"details": exc.details, "path": request.url.path}
    )
    return JSONResponse(
        status_code=exc.status_code,
        content=exc.to_dict()
    )


async def general_exception_handler(request, exc: Exception):
    """FastAPI exception handler for unexpected exceptions"""
    logger.exception(
        f"Unexpected error: {str(exc)}",
        extra={"path": request.url.path}
    )
    return create_error_response(
        error_code=ErrorCodes.SYSTEM_INTERNAL_ERROR,
        message="An unexpected error occurred. Please try again later.",
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        details={"error_type": type(exc).__name__}
    )


# Validation Helpers
def validate_required_fields(data: Dict[str, Any], required_fields: list[str]) -> None:
    """
    Validate that required fields are present and non-empty

    Args:
        data: Dictionary to validate
        required_fields: List of required field names

    Raises:
        ValidationError: If any required field is missing or empty
    """
    for field in required_fields:
        if field not in data:
            raise handle_validation_error(field, "Field is required")

        value = data[field]
        if value is None or (isinstance(value, str) and not value.strip()):
            raise handle_validation_error(field, "Field cannot be empty", value)


def validate_email(email: str, field_name: str = "email") -> None:
    """
    Validate email format

    Args:
        email: Email address to validate
        field_name: Name of the field for error messages

    Raises:
        ValidationError: If email is invalid
    """
    import re
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, email):
        raise handle_validation_error(
            field_name,
            "Invalid email format",
            email
        )


def validate_date_format(date_str: str, field_name: str = "date") -> None:
    """
    Validate date format (YYYY-MM or YYYY)

    Args:
        date_str: Date string to validate
        field_name: Name of the field for error messages

    Raises:
        ValidationError: If date format is invalid
    """
    import re
    # Accept YYYY-MM, YYYY, or "Present"
    if date_str.lower() in ["present", "current", ""]:
        return

    date_pattern = r'^\d{4}(-\d{2})?$'
    if not re.match(date_pattern, date_str):
        raise handle_validation_error(
            field_name,
            "Invalid date format. Expected YYYY-MM or YYYY",
            date_str
        )


# Timeout Handler
def handle_timeout_error(operation: str, timeout_seconds: int) -> SystemError:
    """Handle timeout errors"""
    return SystemError(
        message=f"Operation '{operation}' timed out after {timeout_seconds} seconds",
        error_code=ErrorCodes.SYSTEM_TIMEOUT,
        details={"operation": operation, "timeout": timeout_seconds}
    )


# Disk Space Handler
def check_disk_space(min_free_mb: int = 100) -> None:
    """
    Check if sufficient disk space is available

    Args:
        min_free_mb: Minimum free space in MB

    Raises:
        SystemError: If disk space is insufficient
    """
    import shutil
    total, used, free = shutil.disk_usage("/")
    free_mb = free / (1024 * 1024)

    if free_mb < min_free_mb:
        raise SystemError(
            message=f"Insufficient disk space: {free_mb:.2f}MB free, {min_free_mb}MB required",
            error_code=ErrorCodes.SYSTEM_DISK_FULL,
            details={
                "free_mb": round(free_mb, 2),
                "required_mb": min_free_mb,
                "total_mb": round(total / (1024 * 1024), 2)
            }
        )
