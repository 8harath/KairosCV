"""
LaTeX Template Cache

In-memory caching system for LaTeX templates to reduce file I/O operations
and improve PDF generation performance.

Features:
- Lazy loading with TTL (Time To Live)
- Memory-efficient storage
- Cache invalidation
- Statistics tracking
"""

import time
import logging
from typing import Dict, Optional, Any
from pathlib import Path
from threading import Lock

logger = logging.getLogger(__name__)


class TemplateCache:
    """Thread-safe in-memory cache for LaTeX templates"""

    def __init__(self, ttl_seconds: int = 3600):
        """
        Initialize template cache

        Args:
            ttl_seconds: Time-to-live for cached templates (default: 1 hour)
        """
        self.ttl_seconds = ttl_seconds
        self._cache: Dict[str, Dict[str, Any]] = {}
        self._lock = Lock()
        self._stats = {
            "hits": 0,
            "misses": 0,
            "evictions": 0,
            "loads": 0
        }
        logger.info(f"Template cache initialized with TTL={ttl_seconds}s")

    def get(self, key: str, loader_func: callable = None) -> Optional[str]:
        """
        Get template from cache or load it

        Args:
            key: Cache key (usually file path)
            loader_func: Function to load template if not cached

        Returns:
            Template content or None if not found
        """
        with self._lock:
            # Check if key exists in cache
            if key in self._cache:
                entry = self._cache[key]

                # Check if entry has expired
                if time.time() - entry["timestamp"] < self.ttl_seconds:
                    self._stats["hits"] += 1
                    logger.debug(f"Cache HIT: {key}")
                    return entry["content"]
                else:
                    # Entry expired, remove it
                    del self._cache[key]
                    self._stats["evictions"] += 1
                    logger.debug(f"Cache EVICTION (expired): {key}")

            # Cache miss
            self._stats["misses"] += 1
            logger.debug(f"Cache MISS: {key}")

            # Load template if loader function provided
            if loader_func:
                try:
                    content = loader_func()
                    self.set(key, content)
                    return content
                except Exception as e:
                    logger.error(f"Failed to load template '{key}': {e}")
                    return None

            return None

    def set(self, key: str, content: str) -> None:
        """
        Store template in cache

        Args:
            key: Cache key
            content: Template content
        """
        with self._lock:
            self._cache[key] = {
                "content": content,
                "timestamp": time.time(),
                "size_bytes": len(content.encode('utf-8'))
            }
            self._stats["loads"] += 1
            logger.debug(f"Cache SET: {key} ({len(content)} chars)")

    def invalidate(self, key: str) -> bool:
        """
        Remove template from cache

        Args:
            key: Cache key to invalidate

        Returns:
            True if key was in cache, False otherwise
        """
        with self._lock:
            if key in self._cache:
                del self._cache[key]
                self._stats["evictions"] += 1
                logger.info(f"Cache INVALIDATE: {key}")
                return True
            return False

    def clear(self) -> None:
        """Clear all cached templates"""
        with self._lock:
            count = len(self._cache)
            self._cache.clear()
            self._stats["evictions"] += count
            logger.info(f"Cache CLEAR: Removed {count} entries")

    def get_stats(self) -> Dict[str, Any]:
        """
        Get cache statistics

        Returns:
            Dictionary with cache statistics
        """
        with self._lock:
            total_requests = self._stats["hits"] + self._stats["misses"]
            hit_rate = (self._stats["hits"] / total_requests * 100) if total_requests > 0 else 0

            total_size_bytes = sum(entry["size_bytes"] for entry in self._cache.values())

            return {
                "hits": self._stats["hits"],
                "misses": self._stats["misses"],
                "evictions": self._stats["evictions"],
                "loads": self._stats["loads"],
                "total_requests": total_requests,
                "hit_rate_percent": round(hit_rate, 2),
                "current_entries": len(self._cache),
                "total_size_bytes": total_size_bytes,
                "total_size_mb": round(total_size_bytes / (1024 * 1024), 2),
                "ttl_seconds": self.ttl_seconds
            }

    def get_cached_keys(self) -> list[str]:
        """Get list of all cached keys"""
        with self._lock:
            return list(self._cache.keys())


# Global template cache instance
_global_cache: Optional[TemplateCache] = None


def get_template_cache(ttl_seconds: int = 3600) -> TemplateCache:
    """
    Get or create global template cache instance

    Args:
        ttl_seconds: TTL for cache entries (only used if creating new cache)

    Returns:
        Global TemplateCache instance
    """
    global _global_cache
    if _global_cache is None:
        _global_cache = TemplateCache(ttl_seconds=ttl_seconds)
    return _global_cache


def load_template_file(file_path: str) -> str:
    """
    Load template file from disk

    Args:
        file_path: Path to template file

    Returns:
        Template content

    Raises:
        FileNotFoundError: If template file doesn't exist
        IOError: If file cannot be read
    """
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"Template file not found: {file_path}")

    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        logger.info(f"Loaded template from disk: {file_path} ({len(content)} chars)")
        return content
    except Exception as e:
        logger.error(f"Error reading template file '{file_path}': {e}")
        raise IOError(f"Failed to read template: {e}")


def get_cached_template(file_path: str, cache: Optional[TemplateCache] = None) -> str:
    """
    Get template from cache or load from disk

    Args:
        file_path: Path to template file
        cache: Template cache instance (uses global if None)

    Returns:
        Template content
    """
    if cache is None:
        cache = get_template_cache()

    return cache.get(file_path, lambda: load_template_file(file_path))


# Example usage
if __name__ == "__main__":
    # Configure logging
    logging.basicConfig(level=logging.INFO)

    # Create cache instance
    cache = TemplateCache(ttl_seconds=60)

    # Simulate loading templates
    print("\n=== Template Cache Demo ===\n")

    # First access - cache miss, loads from "disk"
    def load_sample():
        return "\\documentclass{article}\n\\begin{document}\nHello World\n\\end{document}"

    template1 = cache.get("template1.tex", load_sample)
    print(f"Template 1 loaded: {len(template1)} chars\n")

    # Second access - cache hit
    template1_again = cache.get("template1.tex")
    print(f"Template 1 (cached): {len(template1_again)} chars\n")

    # Different template - cache miss
    template2 = cache.get("template2.tex", load_sample)
    print(f"Template 2 loaded: {len(template2)} chars\n")

    # Get statistics
    stats = cache.get_stats()
    print("=== Cache Statistics ===")
    print(f"Hits: {stats['hits']}")
    print(f"Misses: {stats['misses']}")
    print(f"Hit Rate: {stats['hit_rate_percent']}%")
    print(f"Current Entries: {stats['current_entries']}")
    print(f"Total Size: {stats['total_size_mb']} MB")
    print(f"TTL: {stats['ttl_seconds']}s\n")

    # Clear cache
    cache.clear()
    print(f"Cache cleared. Remaining entries: {len(cache.get_cached_keys())}")
