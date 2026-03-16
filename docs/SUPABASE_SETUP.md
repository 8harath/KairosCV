# Supabase Setup For KairosCV

This branch is being migrated toward a Vercel + Supabase architecture. The current implementation adds the first production-safe layer:

1. Supabase clients
2. Supabase-backed upload storage behind a feature flag
3. Supabase-backed trial accounting behind a feature flag
4. A 3-generation free trial model

The rest of the processing pipeline still has local-file fallbacks until the download and worker paths are migrated.

## 1. Create A Supabase Project

1. Go to the Supabase dashboard.
2. Create a new project.
3. Copy the following values from `Project Settings -> API`:
   - `Project URL`
   - `anon public key`
   - `service_role key`

## 2. Create Storage Buckets

Create these private buckets:

1. `resume-inputs`
2. `resume-outputs`
3. `resume-json`

Keep all three private. The server should use signed URLs for user downloads later in the migration.

## 3. Run The Initial SQL

Run this in the Supabase SQL editor:

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
  status text not null check (status in ('queued', 'processing', 'completed', 'failed', 'expired')),
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

create table if not exists public.trial_events (
  id bigserial primary key,
  email_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists trial_events_email_time_idx
  on public.trial_events (email_hash, created_at desc);

create or replace function public.consume_trial_attempt(
  p_email_hash text,
  p_limit int default 3,
  p_window_hours int default 24
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

## 4. Configure Google Auth

1. In Supabase, open `Authentication -> Providers`.
2. Enable Google.
3. Create Google OAuth credentials in Google Cloud.
4. Add your Supabase callback URL to the Google OAuth app.
5. Add your local and production site URLs to Supabase Auth redirect settings.

Recommended local redirect:

```text
http://localhost:3000/auth/callback
```

Recommended Vercel redirect:

```text
https://your-vercel-domain.vercel.app/auth/callback
```

## 5. Add Local Environment Variables

Copy `.env.example` to `.env.local` and set:

```env
GOOGLE_GEMINI_API_KEY=your-gemini-key

NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

ENABLE_TRIAL_LIMIT=true
TRIAL_LIMIT=3
TRIAL_WINDOW_HOURS=24

USE_SUPABASE_STORAGE=false
USE_SUPABASE_TRIALS=true
```

Use `USE_SUPABASE_STORAGE=false` for now unless you are also migrating the processing/download path in the same release. Trial accounting can move first safely.

## 6. Add Vercel Environment Variables

Set the same values in Vercel:

1. `GOOGLE_GEMINI_API_KEY`
2. `NEXT_PUBLIC_SUPABASE_URL`
3. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. `SUPABASE_SERVICE_ROLE_KEY`
5. `ENABLE_TRIAL_LIMIT=true`
6. `TRIAL_LIMIT=3`
7. `TRIAL_WINDOW_HOURS=24`
8. `USE_SUPABASE_STORAGE=false`
9. `USE_SUPABASE_TRIALS=true`

## 7. Rollout Recommendation

Use this order:

1. Enable Supabase trial accounting first.
2. Add Supabase Auth and Google sign-in next.
3. Move upload storage and processing jobs to Supabase.
4. Move download and resume history to Supabase.
5. Remove the remaining local filesystem dependencies.

That sequence keeps the app stable while you migrate toward a fully Vercel-safe architecture.
