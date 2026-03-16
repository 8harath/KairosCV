# Supabase Changes And Production Readiness Guide

This document explains:

1. What to change in Supabase
2. What to change in the KairosCV app
3. How to move from the current mixed local/Supabase state to a production-ready Vercel + Supabase deployment

It is written for the current branch: `feat/supabase-gemini-prod-5-phase-plan`.

## 1. Target Production Architecture

For a production deployment using only Vercel, Supabase, and Gemini, the system should look like this:

1. Vercel hosts the Next.js app and API routes.
2. Supabase Auth manages login, sessions, and Google sign-in.
3. Supabase Postgres stores users, trial usage, job records, and resume metadata.
4. Supabase Storage stores uploaded source resumes, intermediate artifacts, generated JSON, and final PDFs.
5. Gemini is called only from server-side code.

Avoid using the local filesystem for anything important in production.

## 2. Current State Of This Branch

What is already in progress:

1. Supabase SDK dependencies are installed.
2. Server and browser Supabase helpers exist.
3. Trial limits can be routed through Supabase by feature flag.
4. Upload storage has a Supabase helper and an upload route feature flag.
5. Trial defaults are now `3` generations per `24` hours.

What is still not fully production-ready:

1. The main processing pipeline still depends on local files.
2. Download and JSON retrieval still depend on local files.
3. User authentication UI and session handling are not yet wired to Supabase Auth.
4. Resume history is not yet modeled as user-owned Supabase records.
5. Processing jobs are not yet fully persisted and driven from Postgres.

## 3. Supabase Changes You Should Make

### 3.1 Create Core Tables

You should have these tables at minimum:

1. `processing_jobs`
2. `trial_events`
3. `generated_resumes`
4. `profiles`
5. `llm_task_runs`

Suggested responsibilities:

1. `profiles`
   - Mirrors `auth.users`
   - Stores display name, avatar URL, onboarding state, and plan information
2. `processing_jobs`
   - Tracks each upload and generation attempt
   - Stores status, stage, progress, error messages, and storage paths
3. `generated_resumes`
   - Stores the durable resume records users see in the dashboard
   - References the source job and owning user
4. `trial_events`
   - Stores atomic trial usage records
5. `llm_task_runs`
   - Stores task-level logging for Gemini calls

### 3.2 Enable RLS

Turn on Row Level Security for all user-facing tables.

Recommended policies:

1. `profiles`
   - Users can read and update only their own profile row
2. `generated_resumes`
   - Users can read only their own generated resumes
3. `processing_jobs`
   - Users can read only their own jobs
   - Inserts and updates should generally happen through server code using the service role key
4. `trial_events`
   - Keep server-only
5. `llm_task_runs`
   - Keep server-only

### 3.3 Create Storage Buckets

Use private buckets:

1. `resume-inputs`
2. `resume-outputs`
3. `resume-json`
4. Optional: `resume-tex`

Recommendations:

1. Keep buckets private
2. Use short-lived signed URLs for downloads
3. Store files under paths scoped by user ID and job ID

Example path layout:

```text
resume-inputs/{user_id}/{job_id}/source.pdf
resume-json/{user_id}/{job_id}/resume.json
resume-outputs/{user_id}/{job_id}/resume.pdf
```

### 3.4 Use RPC For Trial Accounting

Trial usage should be atomic across Vercel instances. Keep using an RPC such as:

1. `consume_trial_attempt(email_hash, limit, window_hours)`

Do not track trial usage in local JSON files in production.

### 3.5 Configure Google Auth

In Supabase Auth:

1. Enable Google provider
2. Add localhost redirect URLs
3. Add Vercel production redirect URLs
4. Add preview deployment redirect URLs if you test on previews

### 3.6 Add A Profiles Trigger

Add a trigger so every new auth user gets a profile row automatically.

Suggested shape:

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  trial_limit int not null default 3,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Then add a function and trigger on `auth.users` insert.

## 4. Application Changes You Should Make

### 4.1 Authentication

Add these app-level pieces:

1. `app/auth/callback/route.ts`
2. Sign-in button for Google auth
3. Session-aware dashboard layout
4. Middleware or server checks for protected routes

Expected flow:

1. User visits landing page
2. Clicks Google sign in
3. Supabase returns to `/auth/callback`
4. Session is established
5. Dashboard loads user data from Supabase

### 4.2 Dashboard Data Model

The dashboard should be driven by Postgres, not by scanning local files.

Each dashboard row should show:

1. Resume title or original filename
2. Status
3. Creation time
4. Download link
5. Optional score or ATS notes

### 4.3 Upload Route

Production upload route responsibilities:

1. Validate mime type, extension, and magic bytes
2. Resolve the authenticated user
3. Check remaining trials using Supabase RPC
4. Upload the source file to Supabase Storage
5. Create a `processing_jobs` row
6. Return `job_id`, remaining credits, and initial status

The route should not rely on local disk.

### 4.4 Processing Pipeline

The processor should be refactored so it:

1. Reads source files from Supabase Storage
2. Writes structured JSON to Supabase Storage
3. Writes final PDF to Supabase Storage
4. Updates `processing_jobs` progress in Postgres
5. Creates `generated_resumes` rows when complete

### 4.5 Download Route

The download route should:

1. Verify the caller owns the resume
2. Generate a short-lived signed URL for the output PDF
3. Return or redirect to that URL

### 4.6 Resume History

Add a route or server action that fetches a user’s past resumes from `generated_resumes`.

Recommended fields:

1. `id`
2. `user_id`
3. `job_id`
4. `title`
5. `original_filename`
6. `pdf_bucket`
7. `pdf_path`
8. `json_bucket`
9. `json_path`
10. `created_at`

## 5. Vercel Compatibility Notes

These rules are important:

1. Do not depend on persistent local files.
2. Do not depend on a custom long-lived WebSocket server.
3. Do not depend on LaTeX binaries being installed in the runtime.
4. Keep Gemini calls server-side only.
5. Use polling or SSE backed by database state.

If you keep LaTeX as the final renderer, move compilation to a separate worker/runtime that explicitly supports it. If you want a simpler Vercel-only deployment, prefer HTML-to-PDF.

## 6. Recommended Rollout Plan

### Phase 1: Supabase Foundation

1. Add env vars
2. Add Supabase clients
3. Create tables
4. Create buckets
5. Enable trial RPC

Exit criteria:

1. Health route confirms Supabase is configured
2. Trial RPC works
3. Test file upload to Storage works

### Phase 2: Supabase Trials

1. Enable `USE_SUPABASE_TRIALS=true`
2. Verify 3-credit enforcement per user
3. Confirm credits remain consistent across redeploys

Exit criteria:

1. Trial usage is no longer stored locally
2. Multiple Vercel instances cannot bypass limits

### Phase 3: Supabase Auth

1. Add Google login
2. Add callback route
3. Protect dashboard
4. Create `profiles`

Exit criteria:

1. Users can sign in and sign out
2. Sessions persist correctly
3. Dashboard becomes user-specific

### Phase 4: Job Persistence

1. Create `processing_jobs` rows on upload
2. Save source files to Storage
3. Move progress tracking to Postgres

Exit criteria:

1. Upload route is fully storage-backed
2. Progress survives redeploys

### Phase 5: Output Persistence

1. Store generated JSON in Storage
2. Store final PDFs in Storage
3. Add signed download flow
4. Add resume history

Exit criteria:

1. Users can re-download old resumes anytime
2. Resume history is visible in dashboard

### Phase 6: Hardening

1. Add structured logging
2. Add rate limiting
3. Add cleanup/retention
4. Add error observability
5. Add tests for auth, upload, trial, and download flows

Exit criteria:

1. Security boundaries are verified
2. Observability is in place
3. Recovery from failure is documented

## 7. Minimal Environment Variables For Production

```env
NODE_ENV=production
GOOGLE_GEMINI_API_KEY=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

ENABLE_TRIAL_LIMIT=true
TRIAL_LIMIT=3
TRIAL_WINDOW_HOURS=24

USE_SUPABASE_TRIALS=true
USE_SUPABASE_STORAGE=true

SUPABASE_INPUT_BUCKET=resume-inputs
SUPABASE_OUTPUT_BUCKET=resume-outputs
SUPABASE_JSON_BUCKET=resume-json
```

## 8. Production Readiness Checklist

Before launch, confirm:

1. Google login works in localhost, preview, and production
2. Trial usage is enforced in Supabase
3. Uploads no longer rely on local files
4. Processing jobs survive redeploys
5. Generated PDFs are stored in Supabase Storage
6. Resume history is user-specific
7. Signed downloads work
8. RLS policies are enabled and tested
9. Service role key is never exposed to the client
10. Error logging is in place
11. Rate limiting exists for upload and auth endpoints
12. Data retention policy is defined

## 9. Recommended Next Implementation Steps

From this branch, the best next code changes are:

1. Add Supabase auth callback and sign-in flow
2. Add `profiles` and `generated_resumes` tables
3. Refactor upload route to create `processing_jobs`
4. Refactor processor to read/write only through Supabase Storage
5. Replace download route with signed URL delivery

That sequence will move KairosCV from a local-file MVP toward a real Vercel + Supabase production app without introducing extra infrastructure.
