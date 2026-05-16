# KairosCV Production Deployment Guide

This guide reflects the current production architecture: Next.js, Supabase Auth/Postgres/Storage, Groq or Gemini for AI, Puppeteer/Chromium for PDF generation, and Razorpay for Pro unlocks.

## Required Infrastructure

1. Create a Supabase project.
2. Run `supabase/bootstrap_kairoscv.sql` in the Supabase SQL editor.
3. Run `supabase/payments.sql` after the bootstrap script.
4. Confirm these private Supabase Storage buckets exist:
   - `resume-inputs`
   - `resume-outputs`
   - `resume-json`
5. Enable the Google provider in Supabase Auth.
6. Add production and preview callback URLs in Supabase Auth, including:
   - `https://YOUR_DOMAIN/auth/callback`
   - local development callback URLs when needed.
7. Configure Razorpay keys and the webhook endpoint:
   - `https://YOUR_DOMAIN/api/payments/webhook`

## Production Environment Variables

Set these in the hosting provider:

```env
NODE_ENV=production

DISABLE_AUTH=false
NEXT_PUBLIC_DISABLE_AUTH=false
ENABLE_TRIAL_LIMIT=true
TRIAL_LIMIT=3
TRIAL_WINDOW_HOURS=24

USE_SUPABASE_STORAGE=true
USE_SUPABASE_TRIALS=true
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_INPUT_BUCKET=resume-inputs
SUPABASE_OUTPUT_BUCKET=resume-outputs
SUPABASE_JSON_BUCKET=resume-json

GROQ_API_KEY=...
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_FAST_MODEL=llama-3.1-8b-instant
GOOGLE_GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash

RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=...
PRO_PRICE_PAISE=19900
PRO_CURRENCY=INR
PRO_PLAN_LABEL=KairosCV Pro (Lifetime)
DISABLE_PAYWALL=false

CHROMIUM_BINARY_URL=...
PUPPETEER_HEADLESS=true
ENABLE_DEBUG_JSON=false
NEXT_PUBLIC_ENABLE_DEBUG_TOOLS=false
```

For Vercel, `CHROMIUM_BINARY_URL` may use the default from `lib/config/env.ts`, but explicitly setting it is safer for reproducible deployments.

## Build And Verification

Run these before every production release:

```bash
pnpm install --frozen-lockfile
npx tsc --noEmit
pnpm test:run
pnpm build
```

Expected runtime smoke tests:

1. `/api/health` returns `supabaseConfigured: true`, `useSupabaseStorage: true`, and `useSupabaseTrials: true`.
2. A signed-in user can upload a PDF/DOCX/TXT file and receives both `file_id` and `job_id`.
3. `/api/jobs/{job_id}` returns status, stage, progress, and a download URL when complete.
4. `/api/download/{job_id}` rejects unauthenticated or non-owner requests.
5. Trial exhaustion returns a locked preview and Razorpay unlock enables full download.
6. Dashboard lists generated resumes from Supabase `generated_resumes`.

## Production Data Model Notes

- Source files are stored under user-scoped paths in `resume-inputs`.
- Generated PDFs are stored under user-scoped paths in `resume-outputs`.
- Extracted JSON is stored under user-scoped paths in `resume-json`.
- `processing_jobs` is the durable job state table.
- `generated_resumes` is the user-facing resume history table.
- `trial_events`, `user_plans`, and `payment_events` must remain server-controlled.

## Operational Notes

- Keep Supabase buckets private.
- Use signed URLs for generated PDF access.
- Keep `SUPABASE_SERVICE_ROLE_KEY`, AI keys, and Razorpay secrets server-only.
- Local filesystem fallback is for development only.
- The current processing path still starts from the SSE stream route; job progress is persisted in Supabase and exposed through `/api/jobs/[id]`. For higher traffic, move processing to a queue-backed worker while preserving the same `processing_jobs` contract.
