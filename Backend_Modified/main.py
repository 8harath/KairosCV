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
    title="AI Resume Tailoring API",
    description="Tailors resumes based on job descriptions using AI.",
    version="0.2.0",
)

# --- CORS Middleware ---
origins = ["*"]  # Configure allowed origins here

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Endpoints ---


@app.get("/health", tags=["Status"], response_model=MessageResponse)
async def health_check():
    """Simple health check endpoint."""
    return {"message": "API is running!"}


@app.post("/tailor", tags=["Resume"], response_model=TailoredResumeResponse)
async def tailor_resume_endpoint(
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
async def convert_to_latex_endpoint(
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
async def convert_json_to_latex_endpoint(
    resume_data: ResumeData,  # Expect ResumeData model as request body
) -> JsonToLatexResponse:
    """
    Converts structured JSON resume data to LaTeX format and returns a compiled PDF.
    No authentication required.
    """
    start_time = time.time()
    logger.info("Received convert-json-to-latex request.")

    if not latex_conversion_chain:
        logger.critical("LaTeX conversion chain is not available.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Resume processing service temporarily unavailable.",
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
