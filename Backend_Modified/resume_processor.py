# /backend/resume_processor.py
import os
import logging
import datetime
import json

# LangChain imports
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableSequence
from langchain_core.exceptions import OutputParserException

# Custom prompt imports
from prompts import RESUME_TAILORING_PROMPT, LATEX_CONVERSION_PROMPT, LATEX_TEMPLATE

# Data mapping imports
from latex_data_mapper import map_resume_data_to_latex, validate_latex_output
from models import ResumeData

logger = logging.getLogger(__name__)

# --- LangChain Setup Function ---


def setup_resume_tailoring_chain(
    model_name: str = None,
    temperature: float = 0.7,
) -> tuple[RunnableSequence, RunnableSequence]:
    """
    Initializes the model, loads prompts, sets up
    parsers, and returns both the resume tailoring and LaTeX conversion chains.
    """
    # Get configuration from environment variables
    api_key = os.getenv("GROQ_API_KEY")
    model_name = model_name or os.getenv("GROQ_MODEL", "llama-3.1-70b-versatile")

    if not api_key:
        logger.error("GROQ_API_KEY environment variable not set")
        raise ValueError("GROQ_API_KEY environment variable is required")

    # Initialize the model
    try:
        logger.info(f"Initializing Groq model: {model_name}...")
        llm = ChatGroq(
            model=model_name,
            groq_api_key=api_key,
            temperature=temperature,
        )
        logger.info("Groq model initialized successfully.")
    except Exception as e:
        logger.error(f"Error initializing Groq model: {e}", exc_info=True)
        raise RuntimeError(f"Could not initialize Groq model: {e}")

    # 4. Create Prompt Templates
    resume_prompt = ChatPromptTemplate.from_template(RESUME_TAILORING_PROMPT)
    latex_prompt = ChatPromptTemplate.from_template(LATEX_CONVERSION_PROMPT)

    # 5. Define Output Parser
    output_parser = StrOutputParser()

    # 6. Create and return both LangChain Chains
    logger.info("Creating processing chains...")
    resume_chain = resume_prompt | llm | output_parser
    latex_chain = latex_prompt | llm | output_parser
    logger.info("LangChain chains created.")
    return resume_chain, latex_chain


# --- Core Tailoring Function ---
async def generate_tailored_resume(
    resume_content: str, job_description: str, chain: RunnableSequence
) -> str:
    """
    Takes original resume text, job description text, and a pre-configured
    LangChain chain, and returns a tailored resume string (asynchronously).
    """
    logger.info("Processing resume tailoring...")
    if not resume_content or not job_description:
        logger.error("Attempted to tailor resume with empty content.")
        raise ValueError("Resume content and job description cannot be empty.")

    try:
        # Use chain.ainvoke for async operation within FastAPI
        tailored_resume = await chain.ainvoke(
            {"resume_content": resume_content, "job_description": job_description}
        )
        logger.info(
            f"Processing successful (Output length: {len(tailored_resume)})."
        )

        if not isinstance(tailored_resume, str) or not tailored_resume.strip():
            logger.error("Processing returned empty or non-string output.")
            raise RuntimeError("Failed to generate valid resume text.")

        if len(tailored_resume) < 100:  # Arbitrary short length check
            logger.warning(
                f"Output seems very short ({len(tailored_resume)} chars). Possible error."
            )
            # Example check for refusal patterns
            refusal_patterns = [
                "provide the content",
                "ready to help",
                "cannot fulfill",
                "i need the resume",
            ]
            if any(p in tailored_resume.lower() for p in refusal_patterns):
                logger.error(
                    "Response indicates it didn't process the input correctly."
                )
                raise RuntimeError(
                    "Failed to process the input resume/JD. Please check the input data."
                )

        return tailored_resume.strip()  # Return stripped text

    except OutputParserException as ope:
        logger.error(f"An error occurred parsing the output: {ope}", exc_info=True)
        raise RuntimeError(f"Failed to parse output: {ope}")
    except Exception as e:
        # Catch specific API errors if possible (e.g., RateLimitError, AuthenticationError)
        logger.error(
            f"An error occurred during LangChain chain invocation: {e}", exc_info=True
        )
        raise RuntimeError(f"Processing failed: {e}")


# --- LaTeX Conversion Function (Direct Data Mapping) ---
async def generate_latex_resume(resume_content: str, chain: RunnableSequence) -> str:
    """
    Generate LaTeX resume from JSON data using direct template mapping.

    This function now uses latex_data_mapper for reliable, deterministic conversion
    instead of relying on AI generation. This ensures:
    - Consistent formatting
    - Proper character escaping
    - No AI hallucination
    - Faster processing

    Args:
        resume_content: JSON string containing resume data (must match ResumeData schema)
        chain: RunnableSequence (not used in direct mapping, kept for API compatibility)

    Returns:
        Complete LaTeX document as string

    Raises:
        ValueError: If resume_content is invalid JSON or doesn't match schema
        RuntimeError: If LaTeX generation fails
    """
    if not resume_content:
        logger.error("Attempted to convert empty resume content")
        raise ValueError("Resume content cannot be empty")

    try:
        # Parse JSON input
        logger.info("Parsing resume JSON data...")
        try:
            resume_dict = json.loads(resume_content)
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON: {e}")
            raise ValueError(f"Invalid JSON format: {str(e)}")

        # Validate against Pydantic model
        logger.info("Validating resume data against schema...")
        try:
            resume_data = ResumeData(**resume_dict)
        except Exception as e:
            logger.error(f"Schema validation failed: {e}")
            raise ValueError(f"Resume data doesn't match expected schema: {str(e)}")

        # Map data to LaTeX template using direct injection
        logger.info("Mapping resume data to LaTeX template...")
        latex_document = map_resume_data_to_latex(resume_data, LATEX_TEMPLATE)

        # Validate generated LaTeX
        is_valid, errors = validate_latex_output(latex_document)
        if not is_valid:
            logger.warning(f"LaTeX validation warnings: {errors}")
            # Continue anyway - these are warnings, not blocking errors

        logger.info(f"Successfully generated LaTeX document ({len(latex_document)} characters)")
        return latex_document

    except ValueError:
        # Re-raise ValueError as-is (already formatted)
        raise
    except Exception as e:
        logger.error(f"Error during LaTeX generation: {e}", exc_info=True)
        raise RuntimeError(f"LaTeX generation failed: {str(e)}")


# --- AI-Based LaTeX Conversion (Fallback/Alternative) ---
async def generate_latex_resume_with_ai(resume_content: str, chain: RunnableSequence) -> str:
    """
    ALTERNATIVE: AI-based LaTeX conversion using LangChain.

    This is the original implementation that uses AI to convert resume text to LaTeX.
    Use this when:
    - Input is plain text (not structured JSON)
    - Want AI enhancement during conversion
    - Need flexible format handling

    For structured JSON data, use generate_latex_resume() instead (faster, more reliable).

    Args:
        resume_content: Plain text resume content
        chain: LangChain RunnableSequence for conversion

    Returns:
        LaTeX document as string
    """
    if not resume_content:
        logger.error("Attempted to convert empty resume content")
        raise ValueError("Resume content cannot be empty")

    try:
        # Use AI to convert text to LaTeX
        latex_resume = await chain.ainvoke(
            {"resume_content": resume_content, "latex_template": LATEX_TEMPLATE}
        )

        # Basic validation
        if not isinstance(latex_resume, str):
            raise RuntimeError("Model output is not a string")

        # Only remove markdown code block markers, preserve all LaTeX content
        if latex_resume.startswith("```latex\n"):
            latex_resume = latex_resume[8:]  # Remove ```latex\n prefix
        if latex_resume.endswith("\n```"):
            latex_resume = latex_resume[:-4]  # Remove ```\n suffix

        return latex_resume

    except Exception as e:
        logger.error(f"Error during AI LaTeX conversion: {e}", exc_info=True)
        raise RuntimeError(f"AI LaTeX conversion failed: {e}")
