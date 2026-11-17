-- 레이키즈(sm/) 전용 계정 — 원장 2026-11-17 「이메일 인증 받아 가입 하도록」
-- 보호자 이메일 인증(Supabase Auth) 뒤 아이를 등록하고 승인번호를 정한다. 승인번호는 해시로만 둔다.
-- 표는 서버 함수(sm-auth, service_role)만 쓴다: RLS를 켜고 정책을 두지 않는다(anon·authenticated는 읽고 쓸 수 없음).
create table if not exists public.sm_accounts (
  child_name text primary key,
  parent_user_id uuid not null references auth.users(id) on delete cascade,
  parent_email text not null,
  code_hash text not null,
  active boolean not null default true,
  consent_version text not null,
  consent_at timestamptz not null,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists sm_accounts_parent_idx on public.sm_accounts(parent_user_id);

create table if not exists public.sm_sessions (
  token_hash text primary key,
  child_name text not null references public.sm_accounts(child_name) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists sm_sessions_child_idx on public.sm_sessions(child_name);
create index if not exists sm_sessions_expiry_idx on public.sm_sessions(expires_at);

create table if not exists public.sm_login_failures (
  child_name text primary key references public.sm_accounts(child_name) on delete cascade,
  fails integer not null default 0,
  first_at timestamptz not null default now(),
  locked_until timestamptz
);

alter table public.sm_accounts enable row level security;
alter table public.sm_sessions enable row level security;
alter table public.sm_login_failures enable row level security;
revoke all on public.sm_accounts, public.sm_sessions, public.sm_login_failures from anon, authenticated;
-- 이 프로젝트는 새 표에 service_role 권한이 자동으로 붙지 않는다(20261114130000 참고)
grant select, insert, update, delete on table public.sm_accounts, public.sm_sessions, public.sm_login_failures to service_role;
