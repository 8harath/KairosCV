"""
PDF Metadata Management

Adds professional metadata to generated PDF resumes for better
organization and searchability.
"""

import os
import logging
from datetime import datetime
from pypdf import PdfReader, PdfWriter
from models import ResumeData

logger = logging.getLogger(__name__)


def add_pdf_metadata(pdf_path: str, resume_data: ResumeData) -> str:
    """
    Add metadata to generated PDF file.

    Metadata includes:
    - Author: Candidate's full name
    - Title: "{Name} - Resume"
    - Subject: Professional Resume
    - Creator: KairosCV
    - Producer: LaTeX + KairosCV Backend
    - Creation Date: Current timestamp

    Args:
        pdf_path: Path to the PDF file
        resume_data: Resume data containing candidate information

    Returns:
        str: Path to the PDF file (same as input)

    Raises:
        FileNotFoundError: If PDF file doesn't exist
        Exception: If metadata addition fails
    """

    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF file not found: {pdf_path}")

    try:
        # Read existing PDF
        reader = PdfReader(pdf_path)
        writer = PdfWriter()

        # Copy all pages
        for page in reader.pages:
            writer.add_page(page)

        # Extract candidate name
        candidate_name = resume_data.basicInfo.fullName

        # Add comprehensive metadata
        metadata = {
            '/Author': candidate_name,
            '/Title': f"{candidate_name} - Professional Resume",
            '/Subject': 'Professional Resume - ATS Optimized',
            '/Creator': 'KairosCV - AI Resume Optimizer',
            '/Producer': 'LaTeX (pdflatex) + KairosCV Backend',
            '/Keywords': 'resume, cv, professional, ATS-optimized',
            '/CreationDate': datetime.now().strftime("D:%Y%m%d%H%M%S"),
        }

        writer.add_metadata(metadata)

        # Write back to same file
        with open(pdf_path, 'wb') as output_file:
            writer.write(output_file)

        logger.info(f"Added metadata to PDF: {pdf_path}")
        logger.debug(f"Metadata: Author={candidate_name}")

        return pdf_path

    except Exception as e:
        logger.error(f"Failed to add metadata to {pdf_path}: {e}")
        # Don't fail the entire process if metadata fails
        # Just log the error and return the original path
        return pdf_path


def get_pdf_metadata(pdf_path: str) -> dict:
    """
    Read metadata from PDF file.

    Args:
        pdf_path: Path to the PDF file

    Returns:
        dict: Metadata dictionary with keys like Author, Title, Subject

    Raises:
        FileNotFoundError: If PDF file doesn't exist
    """

    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF file not found: {pdf_path}")

    try:
        reader = PdfReader(pdf_path)
        metadata = reader.metadata

        # Convert to standard dict and decode values
        metadata_dict = {}
        if metadata:
            for key, value in metadata.items():
                # Remove leading slash from keys
                clean_key = key.lstrip('/')
                metadata_dict[clean_key] = str(value) if value else None

        return metadata_dict

    except Exception as e:
        logger.error(f"Failed to read metadata from {pdf_path}: {e}")
        return {}


def validate_pdf_metadata(pdf_path: str, expected_author: str) -> bool:
    """
    Validate that PDF has correct metadata.

    Args:
        pdf_path: Path to the PDF file
        expected_author: Expected author name

    Returns:
        bool: True if metadata is correct, False otherwise
    """

    try:
        metadata = get_pdf_metadata(pdf_path)

        # Check critical fields
        has_author = metadata.get('Author') == expected_author
        has_creator = 'KairosCV' in metadata.get('Creator', '')
        has_producer = 'LaTeX' in metadata.get('Producer', '')

        return has_author and has_creator and has_producer

    except Exception as e:
        logger.error(f"Failed to validate metadata for {pdf_path}: {e}")
        return False
