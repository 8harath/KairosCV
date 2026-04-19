#!/bin/sh
# Validates that all required and recommended environment variables are set.
# Run before `docker compose up` or in CI to catch missing config early.
#
# Usage: ./scripts/check-env.sh

set -e

ERRORS=0
WARNINGS=0

require() {
  var_name="$1"
  eval val="\$$var_name"
  if [ -z "$val" ]; then
    echo "  [ERROR] $var_name is not set (required)" >&2
    ERRORS=$((ERRORS + 1))
  else
    echo "  [OK]    $var_name"
  fi
}

recommend() {
  var_name="$1"
  note="$2"
  eval val="\$$var_name"
  if [ -z "$val" ]; then
    echo "  [WARN]  $var_name is not set — $note" >&2
    WARNINGS=$((WARNINGS + 1))
  else
    echo "  [OK]    $var_name"
  fi
}

echo ""
echo "=== KairosCV environment check ==="
echo ""

echo "── LLM (at least one required) ─────────────────────"
recommend GROQ_API_KEY          "primary LLM provider (recommended)"
recommend GOOGLE_GEMINI_API_KEY "fallback LLM provider"

if [ -z "$GROQ_API_KEY" ] && [ -z "$GOOGLE_GEMINI_API_KEY" ] && [ -z "$GEMINI_API_KEY" ]; then
  echo "  [ERROR] No LLM API key set — resume processing will fail" >&2
  ERRORS=$((ERRORS + 1))
fi

echo ""
echo "── Supabase (required when USE_SUPABASE_STORAGE=true) ──"
if [ "$USE_SUPABASE_STORAGE" = "true" ]; then
  require NEXT_PUBLIC_SUPABASE_URL
  require NEXT_PUBLIC_SUPABASE_ANON_KEY
  require SUPABASE_SERVICE_ROLE_KEY
else
  echo "  [SKIP]  Supabase storage disabled (USE_SUPABASE_STORAGE=false)"
fi

echo ""
echo "── Puppeteer / Chromium ─────────────────────────────"
recommend PUPPETEER_EXECUTABLE_PATH "needed in Docker; auto-detected in local dev"

echo ""
echo "── Optional enhancements ───────────────────────────"
recommend LANGCHAIN_API_KEY "enables LangSmith tracing for agent pipeline"

echo ""
echo "==================================="
echo "  Errors:   $ERRORS"
echo "  Warnings: $WARNINGS"
echo "==================================="
echo ""

if [ "$ERRORS" -gt 0 ]; then
  echo "Fix the errors above before starting the application." >&2
  exit 1
fi

echo "Environment looks good."
exit 0
