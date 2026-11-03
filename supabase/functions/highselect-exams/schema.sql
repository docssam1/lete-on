-- Isolated launch runtime. No existing HS accounts, entitlements or results are changed.
create table if not exists public.highselect_students (
 id uuid primary key default gen_random_uuid(), name text not null check (length(name) between 1 and 80),
 code_hash text not null, code_salt text not null, active boolean not null default true, is_test boolean not null default false,
 exam_grants text[] not null default '{}', expires_at timestamptz not null,
 created_at timestamptz not null default now(), created_by uuid references auth.users(id)
);
create table if not exists public.highselect_sessions (
 token_hash text primary key, student_id uuid not null references public.highselect_students(id),
 expires_at timestamptz not null, created_at timestamptz not null default now()
);
create table if not exists public.highselect_attempts (
 id uuid primary key default gen_random_uuid(), student_id uuid not null references public.highselect_students(id),
 exam_id text not null, exam_version text not null, mode text not null check(mode in ('released','pilot')),
 responses jsonb not null, report jsonb not null, revision integer not null default 1, review_history jsonb not null default '[]'::jsonb, created_at timestamptz not null default now()
);
create index if not exists highselect_attempt_student_idx on public.highselect_attempts(student_id,created_at desc);
create table if not exists public.highselect_login_limits (
 key text primary key, count integer not null, window_start timestamptz not null
);
alter table public.highselect_students enable row level security;
alter table public.highselect_sessions enable row level security;
alter table public.highselect_attempts enable row level security;
alter table public.highselect_login_limits enable row level security;
revoke all on public.highselect_students,public.highselect_sessions,public.highselect_attempts,public.highselect_login_limits from public,anon,authenticated;
grant all on public.highselect_students,public.highselect_sessions,public.highselect_attempts,public.highselect_login_limits to service_role;
create or replace function public.highselect_take_login_attempt(limit_key text)
returns boolean language sql security invoker set search_path = '' as $$
 with attempt as (
 insert into public.highselect_login_limits as t(key,count,window_start)
 values(limit_key,1,now()) on conflict(key) do update set
 count=case when t.window_start < now()-interval '15 minutes' then 1 else t.count+1 end,
 window_start=case when t.window_start < now()-interval '15 minutes' then now() else t.window_start end
 returning count
 ) select count<=case when limit_key like 'ip:%' then 120 else 10 end from attempt;
$$;
revoke all on function public.highselect_take_login_attempt(text) from public,anon,authenticated;
grant execute on function public.highselect_take_login_attempt(text) to service_role;
