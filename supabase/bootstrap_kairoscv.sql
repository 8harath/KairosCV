-- KairosCV Supabase bootstrap
-- Run this in the Supabase SQL editor for the current production-ready branch.
--
-- What this script sets up:
-- 1. Core tables for profiles, jobs, resume history, prompts, and trial usage
-- 2. A trigger to create profile rows from auth.users
-- 3. A trial-consumption RPC aligned with the app's 3-free-generations / 24-hour window
-- 4. Private storage buckets
-- 5. RLS policies for user-owned data and storage objects
--
-- What this script does NOT set up:
-- 1. Google provider enablement in Supabase Auth
-- 2. Vercel environment variables
-- 3. Supabase project API keys

begin;

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  trial_limit int not null default 3,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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
  job_description text null,
  template_id text null,
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

create table if not exists public.generated_resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid null references public.processing_jobs(id) on delete set null,
  title text not null,
  original_filename text not null,
  pdf_bucket text not null default 'resume-outputs',
  pdf_path text not null,
  json_bucket text null default 'resume-json',
  json_path text null,
  template_name text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists generated_resumes_user_created_idx
  on public.generated_resumes (user_id, created_at desc);

create table if not exists public.trial_events (
  id bigserial primary key,
  user_id uuid null references auth.users(id) on delete set null,
  email_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists trial_events_email_time_idx
  on public.trial_events (email_hash, created_at desc);

create table if not exists public.llm_task_runs (
  id bigserial primary key,
  job_id uuid not null references public.processing_jobs(id) on delete cascade,
  task_name text not null,
  model text not null,
  prompt_version text not null,
  status text not null check (status in ('ok', 'error', 'fallback')),
  latency_ms int null,
  input_chars int null,
  output_chars int null,
  error_message text null,
  created_at timestamptz not null default now()
);

create index if not exists llm_task_runs_job_created_idx
  on public.llm_task_runs (job_id, created_at desc);

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

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute procedure public.touch_updated_at();

drop trigger if exists generated_resumes_touch_updated_at on public.generated_resumes;
create trigger generated_resumes_touch_updated_at
  before update on public.generated_resumes
  for each row execute procedure public.touch_updated_at();

create or replace function public.consume_trial_attempt(
  p_email_hash text,
  p_limit int default 3,
  p_window_hours int default 24,
  p_user_id uuid default null
)
returns table (
  allowed boolean,
  remaining int,
  reset_at timestamptz
)
language plpgsql
security definer
set search_path = public
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

  insert into public.trial_events(user_id, email_hash)
  values (p_user_id, p_email_hash);

  select count(*), min(created_at)
  into v_count, v_oldest
  from public.trial_events
  where email_hash = p_email_hash
    and created_at > now() - make_interval(hours => p_window_hours);

  return query
  select true, greatest(p_limit - v_count, 0), v_oldest + make_interval(hours => p_window_hours);
end;
$$;

insert into storage.buckets (id, name, public)
values
  ('resume-inputs', 'resume-inputs', false),
  ('resume-outputs', 'resume-outputs', false),
  ('resume-json', 'resume-json', false)
on conflict (id) do nothing;

alter table public.profiles enable row level security;
alter table public.processing_jobs enable row level security;
alter table public.generated_resumes enable row level security;
alter table public.trial_events enable row level security;
alter table public.llm_task_runs enable row level security;
alter table public.llm_prompts enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "generated_resumes_select_own" on public.generated_resumes;
create policy "generated_resumes_select_own"
  on public.generated_resumes
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "generated_resumes_insert_own" on public.generated_resumes;
create policy "generated_resumes_insert_own"
  on public.generated_resumes
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "generated_resumes_delete_own" on public.generated_resumes;
create policy "generated_resumes_delete_own"
  on public.generated_resumes
  for delete
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "processing_jobs_select_own" on public.processing_jobs;
create policy "processing_jobs_select_own"
  on public.processing_jobs
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "storage_input_select_own" on storage.objects;
create policy "storage_input_select_own"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'resume-inputs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "storage_input_insert_own" on storage.objects;
create policy "storage_input_insert_own"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'resume-inputs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "storage_input_update_own" on storage.objects;
create policy "storage_input_update_own"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'resume-inputs'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'resume-inputs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "storage_input_delete_own" on storage.objects;
create policy "storage_input_delete_own"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'resume-inputs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "storage_output_select_own" on storage.objects;
create policy "storage_output_select_own"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'resume-outputs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "storage_json_select_own" on storage.objects;
create policy "storage_json_select_own"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'resume-json'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

revoke all on public.trial_events from anon, authenticated;
revoke all on public.llm_task_runs from anon, authenticated;
revoke all on public.llm_prompts from anon, authenticated;

commit;
