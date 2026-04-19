#!/bin/sh
# Container entrypoint — runs as the nextjs user before exec'ing the app.
# Validates required environment variables and ensures runtime directories
# exist before the Next.js server starts.

set -e

# ── Required env var check ────────────────────────────────────────────────
check_required() {
  var_name="$1"
  eval val="\$$var_name"
  if [ -z "$val" ]; then
    echo "[entrypoint] ERROR: Required environment variable '$var_name' is not set." >&2
    exit 1
  fi
}

# Warn (not fail) when no LLM key is configured — app can still start
# but resume processing will fail at runtime.
if [ -z "$GROQ_API_KEY" ] && [ -z "$GOOGLE_GEMINI_API_KEY" ] && [ -z "$GEMINI_API_KEY" ]; then
  echo "[entrypoint] WARNING: No LLM API key set (GROQ_API_KEY / GOOGLE_GEMINI_API_KEY)." >&2
  echo "[entrypoint]          Resume processing will fail until a key is provided." >&2
fi

# ── Runtime directory setup ───────────────────────────────────────────────
mkdir -p /app/uploads/generated /app/uploads/json

echo "[entrypoint] Starting KairosCV (NODE_ENV=${NODE_ENV:-development})..."

# Hand off to the CMD supplied by the Dockerfile (node server.js)
exec "$@"
