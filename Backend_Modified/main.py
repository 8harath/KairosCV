# /backend/main.py
import os
import sys
import logging
import time
import json
import shutil
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from fastapi import (
    FastAPI,
    File,
    UploadFile,
    Form,
    HTTPException,
    Request,
    Header,
    status,
    Response,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Import from project modules
from models import (
    TailoredResumeResponse,
    MessageResponse,
    ResumeData,
    JsonToLatexResponse,
)
from utils import extract_text_from_file
from resume_processor import (
    setup_resume_tailoring_chain,
    generate_tailored_resume,
    generate_latex_resume,
)
from latex_converter import convert_latex_to_pdf
from pdf_metadata import add_pdf_metadata
from file_cleanup import cleanup_all, get_cleanup_stats
from error_handlers import (
    APIError,
    ValidationError,
    FileError,
    LaTeXError,
    AIError,
    SystemError,
    ErrorCodes,
    api_error_handler,
    general_exception_handler,
    validate_required_fields,
    check_disk_space,
    handle_timeout_error,
)

# --- Initial Setup ---

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger(__name__)

# --- Initialize LangChain Chains (on startup) ---
resume_tailoring_chain = None
latex_conversion_chain = None

try:
    logger.info("Setting up LangChain chains on application startup...")
    resume_tailoring_chain, latex_conversion_chain = setup_resume_tailoring_chain(
        model_name=None  # Set model name here
    )
    logger.info("LangChain chains setup complete.")
except Exception as e:
    logger.critical(
        f"FATAL: Failed to initialize LangChain chains on startup: {e}", exc_info=True
    )
    sys.exit(f"Startup failed: Could not initialize LangChain: {e}")

# --- FastAPI Application Instance ---
app = FastAPI(
    title="KairosCV - AI Resume Optimization API",
    description="""
## AI-Powered Resume Optimization Platform

KairosCV converts any resume format into ATS-optimized PDFs using LaTeX and AI enhancement.

### Features

* **Resume Tailoring**: Customize resumes for specific job descriptions using AI
* **JSON to PDF**: Convert structured resume data to professional LaTeX PDFs
* **File Conversion**: Upload PDF/DOCX/MD files for LaTeX conversion
* **Rate Limiting**: IP-based rate limiting to prevent abuse
* **Health Monitoring**: Comprehensive health checks for all dependencies

### Tech Stack

* **Backend**: FastAPI + Python 3.11+
* **AI**: Groq (llama-3.3-70b-versatile via LangChain)
* **PDF Generation**: LaTeX (pdflatex) + Jake's Resume Template
* **Rate Limiting**: SlowAPI

### Error Handling

All endpoints return structured error responses with error codes and details.
See the [Error Codes Documentation](#/errors) for complete list.

### Rate Limits

* `/tailor`: 10 requests/minute (AI-intensive)
* `/convert-json-to-latex`: 15 requests/minute (core feature)
* `/convert-latex`: 15 requests/minute (file processing)

Exceeding rate limits returns HTTP 429 with retry-after header.

### Links

* [GitHub Repository](https://github.com/8harath/KairosCV)
* [Documentation](https://github.com/8harath/KairosCV#readme)
""",
    version="0.3.0",
    contact={
        "name": "KairosCV Team",
        "url": "https://github.com/8harath/KairosCV",
        "email": "support@kairoscv.com"
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
    docs_url="/docs",  # Swagger UI
    redoc_url="/redoc",  # ReDoc alternative
    openapi_tags=[
        {
            "name": "Status",
            "description": "Health checks and system status"
        },
        {
            "name": "Resume",
            "description": "Resume processing and PDF generation endpoints"
        }
    ]
)

# --- Rate Limiting ---
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# --- Error Handlers ---
app.add_exception_handler(APIError, api_error_handler)
app.add_exception_handler(Exception, general_exception_handler)

# --- CORS Middleware ---
# Configure allowed origins based on environment
PRODUCTION = os.getenv("PRODUCTION", "false").lower() == "true"

if PRODUCTION:
    # Production: Specific domains only
    origins = [
        os.getenv("FRONTEND_URL", "https://kairoscv.onrender.com"),
        "https://kairoscv.com",  # Add your production domain
    ]
    logger.info(f"CORS enabled for production origins: {origins}")
else:
    # Development: Allow common dev servers
    origins = [
        "http://localhost:3000",      # Next.js dev server
        "http://127.0.0.1:3000",      # Alternative localhost
        "http://localhost:5173",      # Vite dev server
        "http://localhost:8000",      # Alternative dev server
        "http://localhost:8080",      # Alternative dev server
    ]
    logger.info(f"CORS enabled for development origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,  # No auth cookies
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

# --- Startup/Shutdown Events ---

@app.on_event("startup")
async def startup_event():
    """Run cleanup on application startup"""
    logger.info("Running startup cleanup...")
    try:
        stats = cleanup_all(
            pdf_max_age_hours=24,  # Clean PDFs older than 24 hours
            latex_max_age_hours=1,  # Clean LaTeX files older than 1 hour
            dry_run=False
        )
        logger.info(f"Startup cleanup complete: {stats}")
    except Exception as e:
        logger.error(f"Startup cleanup failed: {e}")
        # Don't fail startup if cleanup fails


# --- API Endpoints ---


@app.get(
    "/health",
    tags=["Status"],
    summary="System Health Check",
    description="""
    Comprehensive health check that verifies all critical dependencies.

    **Checks Performed:**
    - pdflatex availability and version
    - Groq API configuration
    - Disk space monitoring (warns if <100MB)
    - Output directory statistics

    **Status Values:**
    - `healthy`: All systems operational
    - `degraded`: Some non-critical issues detected

    **Use Cases:**
    - Monitoring and alerting
    - Pre-deployment validation
    - Debugging deployment issues
    """,
    response_description="Health status with detailed component checks",
    responses={
        200: {
            "description": "Health check completed",
            "content": {
                "application/json": {
                    "example": {
                        "status": "healthy",
                        "timestamp": 1764157314.56,
                        "checks": {
                            "pdflatex": {
                                "status": "ok",
                                "version": "pdfTeX 3.141592653"
                            },
                            "groq_api": {
                                "status": "configured",
                                "key_length": 56,
                                "model": "llama-3.3-70b-versatile"
                            },
                            "disk_space": {
                                "status": "ok",
                                "free_mb": 14178.81,
                                "total_mb": 32077.81,
                                "used_percent": 50.64
                            },
                            "directories": {
                                "status": "ok",
                                "generated_pdfs": {"files": 5, "size_mb": 1.2},
                                "latex_output": {"files": 0, "size_mb": 0.0}
                            }
                        }
                    }
                }
            }
        }
    }
)
async def health_check():
    """
    Enhanced health check endpoint that verifies all critical dependencies.
    """
    import subprocess
    import shutil as sh

    health_status = {
        "status": "healthy",
        "timestamp": time.time(),
        "checks": {}
    }

    # Check pdflatex availability
    try:
        result = subprocess.run(
            ['pdflatex', '--version'],
            capture_output=True,
            timeout=5,
            text=True
        )
        pdflatex_ok = result.returncode == 0
        if pdflatex_ok:
            # Extract version from first line
            version_line = result.stdout.split('\n')[0] if result.stdout else "Unknown"
            health_status["checks"]["pdflatex"] = {
                "status": "ok",
                "version": version_line
            }
        else:
            health_status["checks"]["pdflatex"] = {"status": "error", "message": "pdflatex not found"}
            health_status["status"] = "degraded"
    except subprocess.TimeoutExpired:
        health_status["checks"]["pdflatex"] = {"status": "error", "message": "timeout"}
        health_status["status"] = "degraded"
    except Exception as e:
        health_status["checks"]["pdflatex"] = {"status": "error", "message": str(e)}
        health_status["status"] = "degraded"

    # Check Groq API configuration
    groq_api_key = os.getenv('GROQ_API_KEY')
    if groq_api_key and len(groq_api_key) > 0:
        health_status["checks"]["groq_api"] = {
            "status": "configured",
            "key_length": len(groq_api_key),
            "model": os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
        }
    else:
        health_status["checks"]["groq_api"] = {"status": "missing", "message": "GROQ_API_KEY not set"}
        health_status["status"] = "degraded"

    # Check disk space
    try:
        total, used, free = sh.disk_usage("/")
        health_status["checks"]["disk_space"] = {
            "status": "ok" if free > 100 * 1024 * 1024 else "low",  # Warn if < 100MB
            "free_mb": round(free / (1024 * 1024), 2),
            "total_mb": round(total / (1024 * 1024), 2),
            "used_percent": round((used / total) * 100, 2)
        }
        if free < 100 * 1024 * 1024:  # Less than 100MB free
            health_status["status"] = "degraded"
    except Exception as e:
        health_status["checks"]["disk_space"] = {"status": "error", "message": str(e)}

    # Check output directories
    try:
        dir_stats = get_cleanup_stats()

        health_status["checks"]["directories"] = {
            "status": "ok",
            "generated_pdfs": {
                "files": dir_stats["generated_pdfs"]["file_count"],
                "size_mb": round(dir_stats["generated_pdfs"].get("size_mb", 0), 2)
            },
            "latex_output": {
                "files": dir_stats["latex_output"]["file_count"],
                "size_mb": round(dir_stats["latex_output"].get("size_mb", 0), 2)
            }
        }
    except Exception as e:
        health_status["checks"]["directories"] = {"status": "error", "message": str(e)}

    return health_status


@app.post("/tailor", tags=["Resume"], response_model=TailoredResumeResponse)
@limiter.limit("10/minute")  # Max 10 resume tailoring requests per minute per IP
async def tailor_resume_endpoint(
    request: Request,
    job_description: str = Form(
        ..., min_length=50, description="The full text of the job description."
    ),
    resume_file: UploadFile = File(
        ..., description="The user's resume file (PDF, DOCX, MD, TXT)."
    ),
):
    """
    Receives a job description and a resume file, tailors the resume,
    and returns the result. (No authentication required)
    """
    start_time = time.time()
    logger.info(f"Received tailor request for file '{resume_file.filename}'.")

    if not resume_file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Filename cannot be empty."
        )

    try:
        original_resume_text = await extract_text_from_file(resume_file)
        logger.info(
            f"Extracted {len(original_resume_text)} chars from '{resume_file.filename}'."
        )

        if not resume_tailoring_chain:
            logger.critical("Resume tailoring chain is not available.")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Resume processing service temporarily unavailable.",
            )

        modified_resume_text = await generate_tailored_resume(
            resume_content=original_resume_text,
            job_description=job_description,
            chain=resume_tailoring_chain,
        )
        logger.info(f"Successfully generated tailored resume.")

        end_time = time.time()
        processing_time_ms = (end_time - start_time) * 1000
        logger.info(f"Request completed in {processing_time_ms:.2f} ms.")

        return TailoredResumeResponse(
            filename=resume_file.filename,
            original_content_length=len(original_resume_text),
            job_description_length=len(job_description),
            tailored_resume_text=modified_resume_text,
        )

    except HTTPException as he:
        raise he
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except RuntimeError as re:
        logger.error(f"Runtime error during processing: {re}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(re)
        )
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred.",
        )


@app.post("/convert-latex", tags=["Resume"])
@limiter.limit("15/minute")  # Max 15 conversion requests per minute per IP
async def convert_to_latex_endpoint(
    request: Request,
    resume_file: UploadFile = File(
        ..., description="The user's resume file (PDF, DOCX, MD, DOC)."
    ),
) -> Response:
    """
    Converts a resume file to LaTeX format and returns a compiled PDF.
    No authentication required.
    """
    logger.info(f"Received convert-latex request for file '{resume_file.filename}'")

    # Parse file and convert to LaTeX
    try:
        if not resume_file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Filename cannot be empty.",
            )
        if not resume_file.filename.lower().endswith((".pdf", ".md", ".docx", ".doc")):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only PDF, Markdown (.md), DOCX, and DOC files are supported.",
            )
        original_resume_text = await extract_text_from_file(resume_file)
        latex_resume_text = await generate_latex_resume(
            resume_content=original_resume_text, chain=latex_conversion_chain
        )
        pdf_content, pdf_filename = await convert_latex_to_pdf(latex_resume_text)

        # Save PDF locally (no Supabase upload)
        output_dir = os.path.join(os.getcwd(), "generated_pdfs")
        os.makedirs(output_dir, exist_ok=True)
        local_pdf_path = os.path.join(os.getcwd(), "latex_output", pdf_filename)
        output_pdf_path = os.path.join(output_dir, pdf_filename)

        # Copy PDF to generated_pdfs directory
        shutil.copy(local_pdf_path, output_pdf_path)
        logger.info(f"PDF saved to {output_pdf_path}")

        # Generate download URL
        download_url = f"/download/{pdf_filename}"

        # Clean up latex_output files
        latex_output_dir = os.path.join(os.getcwd(), "latex_output")
        base_name, _ = os.path.splitext(pdf_filename)
        for ext in [".pdf", ".tex", ".aux", ".log", ".out"]:
            file_path = os.path.join(latex_output_dir, f"{base_name}{ext}")
            try:
                if os.path.isfile(file_path):
                    os.remove(file_path)
            except Exception as cleanup_err:
                logger.warning(f"Failed to delete {file_path}: {cleanup_err}")

        logger.info(f"Successfully converted resume to PDF: {pdf_filename}")
        return {
            "message": "Resume converted successfully.",
            "pdf_filename": pdf_filename,
            "download_url": download_url
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error in convert-latex endpoint: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@app.post("/convert-json-to-latex", tags=["Resume"], response_model=JsonToLatexResponse)
@limiter.limit("15/minute")  # Max 15 PDF generation requests per minute per IP
async def convert_json_to_latex_endpoint(
    request: Request,
    resume_data: ResumeData,  # Expect ResumeData model as request body
) -> JsonToLatexResponse:
    """
    Converts structured JSON resume data to LaTeX format and returns a compiled PDF.
    No authentication required.
    """
    start_time = time.time()
    logger.info("Received convert-json-to-latex request.")

    # Check disk space before processing
    try:
        check_disk_space(min_free_mb=50)  # Require at least 50MB free
    except SystemError as disk_err:
        logger.error(f"Disk space check failed: {disk_err}")
        raise disk_err

    if not latex_conversion_chain:
        logger.critical("LaTeX conversion chain is not available.")
        raise AIError(
            message="Resume processing service temporarily unavailable",
            error_code=ErrorCodes.AI_API_ERROR
        )

    try:
        # Convert Pydantic model to JSON string to be used as resume_content
        # The LATEX_CONVERSION_PROMPT expects a string, so we provide the JSON as a string.
        resume_content_json_string = resume_data.model_dump_json(indent=2)
        logger.info(
            f"Successfully converted input JSON data to string. Length: {len(resume_content_json_string)}"
        )

        latex_resume_text = await generate_latex_resume(
            resume_content=resume_content_json_string,  # Pass the JSON string here
            chain=latex_conversion_chain,
        )
        logger.info(
            f"Successfully generated LaTeX from JSON data. LaTeX length: {len(latex_resume_text)}"
        )

        pdf_content, pdf_filename = await convert_latex_to_pdf(latex_resume_text)
        logger.info(f"Successfully compiled LaTeX to PDF: {pdf_filename}")

        # Save PDF locally (no Supabase upload)
        latex_output_dir = os.path.join(os.getcwd(), "latex_output")
        os.makedirs(latex_output_dir, exist_ok=True)
        local_pdf_path = os.path.join(latex_output_dir, pdf_filename)

        # Copy to generated_pdfs directory
        output_dir = os.path.join(os.getcwd(), "generated_pdfs")
        os.makedirs(output_dir, exist_ok=True)
        output_pdf_path = os.path.join(output_dir, pdf_filename)

        if os.path.exists(local_pdf_path):
            shutil.copy(local_pdf_path, output_pdf_path)
        else:
            # Fallback: write pdf_content directly
            with open(output_pdf_path, "wb") as f_pdf:
                f_pdf.write(pdf_content)

        logger.info(f"PDF saved to {output_pdf_path}")

        # Add metadata to PDF
        try:
            add_pdf_metadata(output_pdf_path, resume_data)
            logger.info(f"Added metadata to PDF: {pdf_filename}")
        except Exception as meta_err:
            logger.warning(f"Failed to add metadata to PDF: {meta_err}")
            # Continue anyway - metadata is nice-to-have

        # Generate download URL
        download_url = f"/download/{pdf_filename}"

        # Clean up latex_output files
        base_name, _ = os.path.splitext(pdf_filename)
        extensions_to_clean = [".pdf", ".tex", ".aux", ".log", ".out"]
        for ext in extensions_to_clean:
            file_to_clean_path = os.path.join(latex_output_dir, f"{base_name}{ext}")
            try:
                if os.path.isfile(file_to_clean_path):
                    os.remove(file_to_clean_path)
                    logger.info(f"Cleaned up file: {file_to_clean_path}")
            except Exception as cleanup_err:
                logger.warning(f"Failed to delete {file_to_clean_path}: {cleanup_err}")

        end_time = time.time()
        processing_time_ms = (end_time - start_time) * 1000
        logger.info(
            f"Request /convert-json-to-latex completed in {processing_time_ms:.2f} ms."
        )

        return JsonToLatexResponse(
            message="Resume converted successfully from JSON.",
            resume_link=download_url,
            pdf_filename=pdf_filename
        )

    except HTTPException as he:
        logger.error(
            f"HTTPException in /convert-json-to-latex: {he.detail}",
            exc_info=True,
        )
        raise he
    except ValueError as ve:  # For Pydantic validation errors or other value errors
        logger.error(
            f"ValueError in /convert-json-to-latex: {str(ve)}",
            exc_info=True,
        )
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except RuntimeError as re:
        logger.error(
            f"RuntimeError in /convert-json-to-latex: {str(re)}",
            exc_info=True,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(re)
        )
    except Exception as e:
        logger.error(
            f"Unexpected error in /convert-json-to-latex: {e}",
            exc_info=True,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during JSON to LaTeX conversion.",
        )


@app.get("/download/{pdf_filename}", tags=["Resume"])
async def download_pdf(pdf_filename: str):
    """Download generated PDF file"""
    pdf_path = os.path.join(os.getcwd(), "generated_pdfs", pdf_filename)

    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="PDF not found")

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=pdf_filename
    )


if __name__ == "__main__":
    import uvicorn

    port = 8080  # Configure port here
    host = "127.0.0.1"  # Configure host here
    log_level = "info"  # Configure log level here

    logger.info(
        f"Starting Uvicorn server locally on {host}:{port} with log level {log_level}..."
    )
    uvicorn.run("main:app", host=host, port=port, log_level=log_level, reload=True)
