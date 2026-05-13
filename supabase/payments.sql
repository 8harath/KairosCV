-- KairosCV payments migration
-- Adds Razorpay-backed paywall: lifetime "pro" plan unlock for users who exceed
-- the free trial limit. Soft paywall: free users still get a preview after the
-- limit, but full results require an unlock.
--
-- Run after bootstrap_kairoscv.sql in the Supabase SQL editor.

begin;

-- Pro plan ownership keyed by hashed email so guests + authenticated users
-- can both be tracked. user_id stays null for guest unlocks.
create table if not exists public.user_plans (
  email_hash text primary key,
  user_id uuid null references auth.users(id) on delete set null,
  email text null,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  current_period_end timestamptz null,
  razorpay_customer_id text null,
  razorpay_order_id text null,
  razorpay_payment_id text null,
  amount_paise int null,
  currency text null default 'INR',
  unlocked_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_plans_user_id_idx on public.user_plans (user_id);
create index if not exists user_plans_plan_idx on public.user_plans (plan);

-- Audit trail for every payment attempt (created, captured, failed, refunded).
create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  email_hash text not null,
  user_id uuid null references auth.users(id) on delete set null,
  email text null,
  razorpay_order_id text null,
  razorpay_payment_id text null,
  razorpay_signature text null,
  event_type text not null,
  status text not null,
  amount_paise int null,
  currency text null default 'INR',
  raw_payload jsonb null,
  created_at timestamptz not null default now()
);

create index if not exists payment_events_email_hash_idx
  on public.payment_events (email_hash, created_at desc);
create index if not exists payment_events_order_idx
  on public.payment_events (razorpay_order_id);

-- RPC: is this email currently on a pro plan?
create or replace function public.is_pro_user(p_email_hash text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_plan text;
  v_period_end timestamptz;
begin
  select plan, current_period_end
    into v_plan, v_period_end
    from public.user_plans
   where email_hash = p_email_hash;

  if v_plan is null then
    return false;
  end if;

  if v_plan <> 'pro' then
    return false;
  end if;

  -- Lifetime unlock leaves current_period_end null. Subscription model would
  -- check expiry; both shapes supported.
  if v_period_end is not null and v_period_end < now() then
    return false;
  end if;

  return true;
end;
$$;

grant execute on function public.is_pro_user(text) to anon, authenticated, service_role;

-- RPC: mark a user as pro after a verified payment. Called from the server
-- with the service-role key only; rows mutated via this function should never
-- be reachable from anon/authenticated contexts.
create or replace function public.mark_user_pro(
  p_email_hash text,
  p_email text,
  p_user_id uuid,
  p_razorpay_order_id text,
  p_razorpay_payment_id text,
  p_amount_paise int,
  p_currency text,
  p_period_end timestamptz
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_plans (
    email_hash,
    user_id,
    email,
    plan,
    current_period_end,
    razorpay_order_id,
    razorpay_payment_id,
    amount_paise,
    currency,
    unlocked_at,
    updated_at
  ) values (
    p_email_hash,
    p_user_id,
    p_email,
    'pro',
    p_period_end,
    p_razorpay_order_id,
    p_razorpay_payment_id,
    p_amount_paise,
    coalesce(p_currency, 'INR'),
    now(),
    now()
  )
  on conflict (email_hash) do update
  set plan = 'pro',
      user_id = coalesce(excluded.user_id, public.user_plans.user_id),
      email = coalesce(excluded.email, public.user_plans.email),
      current_period_end = excluded.current_period_end,
      razorpay_order_id = excluded.razorpay_order_id,
      razorpay_payment_id = excluded.razorpay_payment_id,
      amount_paise = excluded.amount_paise,
      currency = excluded.currency,
      unlocked_at = coalesce(public.user_plans.unlocked_at, now()),
      updated_at = now();
end;
$$;

grant execute on function public.mark_user_pro(text, text, uuid, text, text, int, text, timestamptz)
  to service_role;

alter table public.user_plans enable row level security;
alter table public.payment_events enable row level security;

drop policy if exists "user_plans self read" on public.user_plans;
create policy "user_plans self read"
  on public.user_plans
  for select
  to authenticated
  using (user_id = auth.uid());

-- No insert/update policy for anon/authenticated — mutations only happen via
-- the security-definer RPCs above (server with service-role key).

commit;
