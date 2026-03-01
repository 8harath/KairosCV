# KairosCV Production Readiness Plan (Supabase + Gemini Backend)

This document is a full implementation guide to take the current KairosCV codebase from local-file MVP to a production-ready architecture using Supabase for data/storage and Gemini as the backend for all LLM tasks.

## 1. Goals

1. Replace ephemeral filesystem usage with durable cloud storage and database state.
2. Centralize all LLM work behind a backend layer (no client-side model access).
3. Add security, observability, rate limits, retries, and failure recovery.
4. Make processing reliable under production load and deploy-safe.

## 2. Current State in This Repo

The current code already has strong parsing and LLM workflows, but core runtime state is file-based:

- Uploads, generated PDFs, metadata, and cleanup logic: `lib/file-storage.ts`
- Trial limit state stored in local JSON files: `lib/trials/trial-limiter.ts`
- Extracted JSON stored in local files: `lib/storage/resume-json-storage.ts`
- Upload route writes files to disk: `app/api/upload/route.ts`
- Stream route depends on local metadata/files: `app/api/stream/[fileId]/route.ts`
- Download route reads/deletes local artifacts: `app/api/download/[fileId]/route.ts`
- JSON debug route reads local extracted JSON: `app/api/json/[fileId]/route.ts`

Why this is not production-safe:

1. Filesystem is ephemeral on most managed platforms.
2. Horizontal scaling breaks local file assumptions.
3. Trial limits can be bypassed across instances.
4. There is no durable job table for resumable processing/status.

## 3. Target Architecture

Use Supabase as the system of record:

1. Supabase Postgres for job state, trial usage, LLM audit, prompt versions.
2. Supabase Storage buckets for input resumes, generated PDFs, debug JSON.
3. Gemini API called only by server-side code (`app/api` + worker service).
4. Background worker processes queued jobs and updates progress in DB.
5. Frontend reads progress from job status API (or Supabase Realtime).

High-level flow:

1. User uploads resume -> server validates -> file stored in Supabase Storage.
2. Server creates `processing_jobs` row with `queued` status.
3. Worker claims queued job, runs parse + extraction + enhancement + PDF.
4. Worker stores outputs in Storage and writes metadata/confidence to DB.
5. Frontend polls job status and downloads via signed URL when complete.

## 4. Supabase Setup

### 4.1 Create project and buckets

Create three private buckets:

1. `resume-inputs`
2. `resume-outputs`
3. `resume-json`

Keep all private and serve via short-lived signed URLs.

### 4.2 Database schema (initial migration)

Create a migration file with tables and indexes like below.

```sql
create extension if not exists pgcrypto;

create table if not exists public.processing_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references auth.users(id) on delete set null,
  email text not null,
  email_hash text not null,
  original_filename text not null,
  mime_type text not null,
  input_bucket text not null default 'resume-inputs',
  input_path text not null,
  output_bucket text null default 'resume-outputs',
  output_path text null,
  json_bucket text null default 'resume-json',
  json_path text null,
  status text not null check (status in ('queued','processing','completed','failed','expired')),
  stage text not null default 'queued',
  progress int not null default 0 check (progress >= 0 and progress <= 100),
  confidence jsonb null,
  error_message text null,
  created_at timestamptz not null default now(),
  started_at timestamptz null,
  completed_at timestamptz null,
  expires_at timestamptz not null default now() + interval '24 hours'
);

create index if not exists processing_jobs_status_created_idx
  on public.processing_jobs (status, created_at);

create index if not exists processing_jobs_email_hash_created_idx
  on public.processing_jobs (email_hash, created_at desc);

create table if not exists public.llm_task_runs (
  id bigserial primary key,
  job_id uuid not null references public.processing_jobs(id) on delete cascade,
  task_name text not null,
  model text not null,
  prompt_version text not null,
  status text not null check (status in ('ok','error','fallback')),
  latency_ms int null,
  input_chars int null,
  output_chars int null,
  error_message text null,
  created_at timestamptz not null default now()
);

create index if not exists llm_task_runs_job_created_idx
  on public.llm_task_runs (job_id, created_at desc);

create table if not exists public.trial_events (
  id bigserial primary key,
  email_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists trial_events_email_time_idx
  on public.trial_events (email_hash, created_at desc);

create table if not exists public.llm_prompts (
  id bigserial primary key,
  task_name text not null,
  version text not null,
  system_prompt text not null,
  template_prompt text not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  unique(task_name, version)
);
```

### 4.3 Trial limit RPC (server-side atomic check)

Use a SQL function so trial usage is atomic across all app instances.

```sql
create or replace function public.consume_trial_attempt(
  p_email_hash text,
  p_limit int default 2,
  p_window_hours int default 12
)
returns table (
  allowed boolean,
  remaining int,
  reset_at timestamptz
)
language plpgsql
security definer
as $$
declare
  v_count int;
  v_oldest timestamptz;
begin
  select count(*), min(created_at)
  into v_count, v_oldest
  from public.trial_events
  where email_hash = p_email_hash
    and created_at > now() - make_interval(hours => p_window_hours);

  if v_count >= p_limit then
    return query
    select false, 0, v_oldest + make_interval(hours => p_window_hours);
    return;
  end if;

  insert into public.trial_events(email_hash) values (p_email_hash);

  select count(*), min(created_at)
  into v_count, v_oldest
  from public.trial_events
  where email_hash = p_email_hash
    and created_at > now() - make_interval(hours => p_window_hours);

  return query
  select true, greatest(p_limit - v_count, 0), v_oldest + make_interval(hours => p_window_hours);
end;
$$;
```

### 4.4 RLS and access model

Recommended:

1. Enable RLS on all tables.
2. Client app uses `anon` key only.
3. Server routes and worker use `service_role` key.
4. End users only access their own rows if auth is enabled.

If you stay email-only initially, keep direct DB access server-only and return data via controlled API routes.

## 5. Environment Variables

Add to `.env.example` and deployment secrets:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_INPUT_BUCKET=resume-inputs
SUPABASE_OUTPUT_BUCKET=resume-outputs
SUPABASE_JSON_BUCKET=resume-json

# Gemini
GOOGLE_GEMINI_API_KEY=
GEMINI_PRIMARY_MODEL=gemini-2.5-flash
GEMINI_FALLBACK_MODEL=gemini-2.0-flash
GEMINI_TEMPERATURE=0.2
GEMINI_MAX_TOKENS=2048
LLM_TIMEOUT_MS=45000
LLM_MAX_RETRIES=3

# Processing
JOB_TTL_HOURS=24
MAX_CONCURRENT_JOBS=3
ENABLE_DEBUG_JSON=false
```

## 6. Package Additions

Install:

```bash
pnpm add @supabase/supabase-js @supabase/ssr
```

Optional for better logging/metrics:

```bash
pnpm add pino
```

## 7. File-by-File Migration Plan

### 7.1 New infrastructure files

Add:

1. `lib/supabase/server.ts` (service-role client for API/worker)
2. `lib/supabase/browser.ts` (client-side anon client if needed)
3. `lib/storage/supabase-storage.ts` (upload/download/signed URL helpers)
4. `lib/jobs/job-repository.ts` (create/update/fetch processing jobs)
5. `lib/trials/supabase-trial-limiter.ts` (RPC wrapper around `consume_trial_attempt`)
6. `lib/ai/llm-orchestrator.ts` (single entry for all Gemini tasks + logging to `llm_task_runs`)

### 7.2 Replace existing file-based modules

Migrate these:

1. `lib/file-storage.ts` -> move to Supabase Storage APIs.
2. `lib/storage/resume-json-storage.ts` -> write/read JSON from `resume-json` bucket and job row.
3. `lib/trials/trial-limiter.ts` -> use Supabase RPC + email hash.

### 7.3 API route updates

1. `app/api/upload/route.ts`
2. `app/api/stream/[fileId]/route.ts`
3. `app/api/download/[fileId]/route.ts`
4. `app/api/json/[fileId]/route.ts`

Required changes:

1. `upload`: validate, store input in bucket, create `processing_jobs` row.
2. `stream`: stream progress from DB job updates or replace with polling endpoint.
3. `download`: generate signed URL for `output_path` and optionally proxy download.
4. `json`: for debug mode, return signed URL or proxied JSON from `json_path`.

### 7.4 Processing pipeline integration

`lib/resume-processor.ts` should:

1. Read input file from Supabase Storage (not local path).
2. Process with existing extraction pipeline.
3. Save generated PDF and extracted JSON back to buckets.
4. Update `processing_jobs` fields (`status`, `stage`, `progress`, `confidence`, `error_message`).

## 8. Gemini Backend for All LLM Tasks

Keep all model calls server-side only. Do not expose Gemini API key to browser.

Tasks currently in code that should route through one orchestrator:

1. `extractCompleteResumeData`
2. `enhanceBulletPoint` / `enhanceBulletPoints`
3. `extractSkills`
4. `generateSummary`
5. `classifyField`
6. `validateFieldPlacement`
7. `categorizeSkillsBatch`
8. `verifyDataCompleteness`
9. `verifyField`
10. `researchMissingField`

Orchestrator requirements:

1. Structured retries with exponential backoff.
2. Timeout guard per task.
3. Strict JSON parsing with Zod validation.
4. Prompt version lookup from `llm_prompts`.
5. Run logging in `llm_task_runs`.
6. Model fallback if primary returns transient failure.

## 9. Job Worker Design

Do not run heavy LLM/PDF work directly in long-lived request handlers in production.

Recommended approach:

1. API upload route only enqueues.
2. Separate worker process claims `queued` jobs (`for update skip locked` semantics via RPC or SQL).
3. Worker updates progress checkpoints (10, 25, 50, 75, 100).
4. Worker marks job `completed` or `failed`.

Worker can be:

1. A separate Render service/container.
2. A cron-triggered runner with claim loop.
3. Supabase Edge Function if runtime constraints are acceptable.

## 10. Security Hardening

Required:

1. Keep `SUPABASE_SERVICE_ROLE_KEY` and `GOOGLE_GEMINI_API_KEY` server-only.
2. Private storage buckets + signed URLs with short TTL.
3. Keep current file signature/MIME checks in upload path.
4. Add request-level rate limiting (IP + email hash).
5. Redact PII from logs where possible.
6. Define retention policy (`JOB_TTL_HOURS`) and scheduled cleanup.

Recommended:

1. Add CAPTCHA for anonymous uploads.
2. Add malware scan for uploads before processing.
3. Add auth for persistent user history and stronger data access controls.

## 11. Observability and Reliability

Add monitoring for:

1. Upload success/failure rate.
2. Queue depth and oldest queued job age.
3. LLM task latency and failure rate by `task_name`.
4. PDF generation success rate.
5. Trial-limit hits (429 frequency).

Operational safeguards:

1. Circuit breaker when Gemini failures spike.
2. Idempotent retry behavior (same job should not duplicate outputs).
3. Dead-letter handling for jobs that fail N times.
4. Alerting on sustained queue backlog or high fail rate.

## 12. Sequential 5-Phase Implementation Plan

Execute phases in order. Do not start the next phase until the current phase exit criteria are met.

### Phase 1 - Supabase Foundation (Schema + Storage + Clients)

Goal: establish durable infrastructure without changing user-visible behavior.

Implementation:

1. Add Supabase dependencies and environment variables.
2. Add `lib/supabase/server.ts` and `lib/supabase/browser.ts`.
3. Create Postgres schema (`processing_jobs`, `trial_events`, `llm_task_runs`, `llm_prompts`).
4. Create private buckets (`resume-inputs`, `resume-outputs`, `resume-json`).
5. Add `lib/storage/supabase-storage.ts` and `lib/jobs/job-repository.ts`.
6. Keep local file path as fallback behind a feature flag (`USE_SUPABASE_STORAGE`).

Exit criteria:

1. Health endpoint still passes.
2. A test file can be written/read/deleted from each Supabase bucket.
3. A test row can be created and updated in `processing_jobs`.

### Phase 2 - Ingress and Trial Limits (Upload Path Cutover)

Goal: make uploads and trial accounting production-safe and instance-safe.

Implementation:

1. Add `consume_trial_attempt` RPC in Supabase.
2. Add `lib/trials/supabase-trial-limiter.ts`.
3. Refactor `app/api/upload/route.ts` to use Supabase-backed trial + storage + job creation.
4. Keep existing file and email validation behavior.
5. Upload input file to `resume-inputs`.
6. Create a `processing_jobs` row with `queued` status.
7. Return job id and trial state in the upload response.
8. Stop writing upload metadata/files to local disk in this route.

Exit criteria:

1. Upload API works across redeploys/restarts.
2. Trial limit remains consistent across multiple instances.
3. No new upload artifacts are written under local `uploads/`.

### Phase 3 - Processing Worker (LLM + PDF Pipeline Cutover)

Goal: move heavy processing to durable background execution.

Implementation:

1. Add worker process that claims queued jobs and marks `processing`.
2. Refactor `lib/resume-processor.ts` I/O to pull input from Supabase Storage.
3. Store generated PDF in `resume-outputs` and extracted JSON in `resume-json`.
4. Persist progress/stage/confidence/errors in `processing_jobs`.
5. Add retry policy for transient Gemini/PDF failures and terminal failure state.

Exit criteria:

1. End-to-end job succeeds without local filesystem dependency.
2. Failed jobs are marked with actionable `error_message`.
3. Output PDF and JSON are retrievable from Supabase paths in job row.

### Phase 4 - Delivery APIs (Progress + Download + Debug JSON)

Goal: switch user-facing retrieval endpoints to Supabase-backed state.

Implementation:

1. Refactor `app/api/stream/[fileId]/route.ts` to read progress from `processing_jobs`.
2. Refactor `app/api/download/[fileId]/route.ts` to issue signed URL or proxy from `resume-outputs`.
3. Refactor `app/api/json/[fileId]/route.ts` to read from `resume-json` with debug guard.
4. Add TTL handling and expiration status updates for stale jobs.

Exit criteria:

1. UI progress reflects DB-backed status accurately.
2. Download works after restart/redeploy.
3. Debug JSON endpoint behavior matches `ENABLE_DEBUG_JSON` policy.

### Phase 5 - Hardening and Operations

Goal: production reliability, security, and operational readiness.

Implementation:

1. Introduce `lib/ai/llm-orchestrator.ts` for centralized Gemini calls.
2. Add prompt versioning (`llm_prompts`) and task run logs (`llm_task_runs`).
3. Add rate limiting, log redaction, and retention cleanup jobs.
4. Add monitoring/alerts for queue depth, fail rates, and latency.
5. Run load and failure-injection tests; finalize runbooks.

Exit criteria:

1. Alerts fire correctly for queue backlog and high failure rates.
2. PII-safe logs and retention cleanup are verified.
3. Launch checklist in Section 13 is fully complete.

## 13. Production Launch Checklist

1. Supabase buckets are private and policies tested.
2. RLS enabled and verified on all production tables.
3. Upload -> queue -> process -> download works after app restart/redeploy.
4. Trial limit enforced consistently across multiple instances.
5. Gemini key never appears in client bundles or logs.
6. Failed jobs show actionable error messages in DB and UI.
7. Cleanup job removes expired artifacts and rows.
8. Load test completed for expected concurrency.
9. On-call runbook exists for queue stuck/failure spikes.

## 14. Immediate Next Steps for This Repo

1. Add Supabase dependencies and env variables.
2. Implement `lib/supabase/server.ts` and `lib/storage/supabase-storage.ts`.
3. Replace `lib/trials/trial-limiter.ts` with Supabase RPC version.
4. Refactor `app/api/upload/route.ts` to store uploads in Supabase and enqueue DB jobs.
5. Add worker process for `lib/resume-processor.ts` execution against queued jobs.

Once these are done, the current extraction/LLM pipeline can stay mostly intact while gaining production-grade durability, scalability, and control.
