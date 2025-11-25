"""
File Cleanup Utilities

Automatic cleanup of old generated PDFs and temporary files
to prevent disk space issues in production.
"""

import os
import time
import logging
from pathlib import Path
from typing import List, Tuple

logger = logging.getLogger(__name__)


def cleanup_old_files(
    directory: str,
    max_age_hours: int = 24,
    file_pattern: str = "*.pdf",
    dry_run: bool = False
) -> Tuple[int, int]:
    """
    Delete files older than specified age from directory.

    Args:
        directory: Directory to clean up
        max_age_hours: Maximum file age in hours (default: 24)
        file_pattern: Glob pattern for files to clean (default: "*.pdf")
        dry_run: If True, log what would be deleted without actually deleting

    Returns:
        Tuple[int, int]: (files_deleted, bytes_freed)

    Raises:
        FileNotFoundError: If directory doesn't exist
    """

    if not os.path.exists(directory):
        raise FileNotFoundError(f"Directory not found: {directory}")

    if not os.path.isdir(directory):
        raise ValueError(f"Not a directory: {directory}")

    now = time.time()
    max_age_seconds = max_age_hours * 3600
    files_deleted = 0
    bytes_freed = 0

    # Use Path for better glob support
    directory_path = Path(directory)

    try:
        for file_path in directory_path.glob(file_pattern):
            if not file_path.is_file():
                continue

            try:
                file_age_seconds = now - file_path.stat().st_mtime
                file_size = file_path.stat().st_size

                if file_age_seconds > max_age_seconds:
                    if dry_run:
                        logger.info(
                            f"[DRY RUN] Would delete: {file_path.name} "
                            f"(age: {file_age_seconds/3600:.1f}h, size: {file_size/1024:.1f}KB)"
                        )
                    else:
                        file_path.unlink()
                        files_deleted += 1
                        bytes_freed += file_size
                        logger.info(
                            f"Deleted old file: {file_path.name} "
                            f"(age: {file_age_seconds/3600:.1f}h, size: {file_size/1024:.1f}KB)"
                        )

            except (OSError, PermissionError) as e:
                logger.error(f"Failed to process {file_path}: {e}")
                continue

    except Exception as e:
        logger.error(f"Error during cleanup of {directory}: {e}")
        raise

    if not dry_run and files_deleted > 0:
        logger.info(
            f"Cleanup complete: {files_deleted} files deleted, "
            f"{bytes_freed/1024/1024:.2f}MB freed from {directory}"
        )
    elif dry_run:
        logger.info(f"Dry run complete for {directory}")

    return files_deleted, bytes_freed


def cleanup_generated_pdfs(max_age_hours: int = 24, dry_run: bool = False) -> Tuple[int, int]:
    """
    Clean up old PDFs from generated_pdfs directory.

    Args:
        max_age_hours: Maximum file age in hours (default: 24)
        dry_run: If True, log what would be deleted without deleting

    Returns:
        Tuple[int, int]: (files_deleted, bytes_freed)
    """

    pdf_dir = os.path.join(os.getcwd(), "generated_pdfs")

    if not os.path.exists(pdf_dir):
        logger.warning(f"PDF directory doesn't exist: {pdf_dir}")
        return 0, 0

    return cleanup_old_files(pdf_dir, max_age_hours, "*.pdf", dry_run)


def cleanup_latex_output(max_age_hours: int = 1, dry_run: bool = False) -> Tuple[int, int]:
    """
    Clean up old files from latex_output directory.

    LaTeX temporary files (.tex, .aux, .log, .out) can be cleaned up
    more aggressively since they're regenerated on each request.

    Args:
        max_age_hours: Maximum file age in hours (default: 1)
        dry_run: If True, log what would be deleted without deleting

    Returns:
        Tuple[int, int]: (files_deleted, bytes_freed)
    """

    latex_dir = os.path.join(os.getcwd(), "latex_output")

    if not os.path.exists(latex_dir):
        logger.warning(f"LaTeX directory doesn't exist: {latex_dir}")
        return 0, 0

    total_deleted = 0
    total_freed = 0

    # Clean up different file types
    file_patterns = ["*.tex", "*.aux", "*.log", "*.out", "*.pdf"]

    for pattern in file_patterns:
        deleted, freed = cleanup_old_files(latex_dir, max_age_hours, pattern, dry_run)
        total_deleted += deleted
        total_freed += freed

    return total_deleted, total_freed


def cleanup_all(
    pdf_max_age_hours: int = 24,
    latex_max_age_hours: int = 1,
    dry_run: bool = False
) -> dict:
    """
    Run cleanup on all directories.

    Args:
        pdf_max_age_hours: Max age for PDFs (default: 24 hours)
        latex_max_age_hours: Max age for LaTeX files (default: 1 hour)
        dry_run: If True, don't actually delete files

    Returns:
        dict: Cleanup statistics
    """

    logger.info(
        f"Starting cleanup (PDF: {pdf_max_age_hours}h, LaTeX: {latex_max_age_hours}h, "
        f"dry_run: {dry_run})"
    )

    # Clean PDFs
    pdf_deleted, pdf_freed = cleanup_generated_pdfs(pdf_max_age_hours, dry_run)

    # Clean LaTeX files
    latex_deleted, latex_freed = cleanup_latex_output(latex_max_age_hours, dry_run)

    stats = {
        "pdf_files_deleted": pdf_deleted,
        "pdf_bytes_freed": pdf_freed,
        "latex_files_deleted": latex_deleted,
        "latex_bytes_freed": latex_freed,
        "total_files_deleted": pdf_deleted + latex_deleted,
        "total_bytes_freed": pdf_freed + latex_freed,
        "total_mb_freed": (pdf_freed + latex_freed) / 1024 / 1024
    }

    logger.info(
        f"Cleanup complete: {stats['total_files_deleted']} files, "
        f"{stats['total_mb_freed']:.2f}MB freed"
    )

    return stats


def get_directory_size(directory: str) -> int:
    """
    Calculate total size of all files in directory.

    Args:
        directory: Directory path

    Returns:
        int: Total size in bytes
    """

    if not os.path.exists(directory):
        return 0

    total_size = 0
    try:
        for dirpath, dirnames, filenames in os.walk(directory):
            for filename in filenames:
                filepath = os.path.join(dirpath, filename)
                if os.path.isfile(filepath):
                    total_size += os.path.getsize(filepath)
    except Exception as e:
        logger.error(f"Error calculating directory size for {directory}: {e}")

    return total_size


def get_cleanup_stats() -> dict:
    """
    Get current statistics about directories that will be cleaned.

    Returns:
        dict: Statistics about files and sizes
    """

    stats = {
        "generated_pdfs": {
            "path": os.path.join(os.getcwd(), "generated_pdfs"),
            "exists": False,
            "size_bytes": 0,
            "file_count": 0
        },
        "latex_output": {
            "path": os.path.join(os.getcwd(), "latex_output"),
            "exists": False,
            "size_bytes": 0,
            "file_count": 0
        }
    }

    for key, info in stats.items():
        path = info["path"]
        if os.path.exists(path):
            info["exists"] = True
            info["size_bytes"] = get_directory_size(path)
            info["file_count"] = len([f for f in os.listdir(path) if os.path.isfile(os.path.join(path, f))])
            info["size_mb"] = info["size_bytes"] / 1024 / 1024

    return stats
