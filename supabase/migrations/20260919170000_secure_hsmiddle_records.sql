create table if not exists public.hsm_access_accounts (
  student_name text primary key,
  code_hash text not null,
  permissions jsonb not null default '[]'::jsonb,
  is_admin boolean not null default false,
  active boolean not null default true,
  updated_at timestamptz not null default now(),
  constraint hsm_access_accounts_name_valid check (
    length(btrim(student_name)) between 1 and 80
    and student_name !~ '[[:cntrl:]]'
  ),
  constraint hsm_access_accounts_code_hash_valid check (code_hash ~ '^\$2[aby]\$[0-9]{2}\$[./A-Za-z0-9]{53}$'),
  constraint hsm_access_accounts_permissions_array check (jsonb_typeof(permissions) = 'array')
);
alter table public.hsm_access_accounts enable row level security;

create table if not exists public.hsm_access_sessions (
  token_hash text primary key,
  student_name text not null references public.hsm_access_accounts(student_name) on delete cascade,
  expires_at timestamptz not null,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint hsm_access_sessions_token_hash_valid check (token_hash ~ '^[a-f0-9]{64}$')
);
alter table public.hsm_access_sessions enable row level security;
create index if not exists hsm_access_sessions_expiry_idx on public.hsm_access_sessions(expires_at);

alter table public.hsm_attempts add column if not exists client_id text;
create unique index if not exists hsm_attempts_client_id_uidx
  on public.hsm_attempts(student, round, client_id)
  where client_id is not null;

create or replace function public.hsm_authenticate(p_name text, p_code text)
returns table(student_name text, permissions jsonb, is_admin boolean)
language sql
security definer
set search_path = ''
as $$
  select account.student_name, account.permissions, account.is_admin
  from public.hsm_access_accounts account
  where account.student_name = btrim(p_name)
    and account.active
    and account.code_hash = extensions.crypt(upper(btrim(p_code)), account.code_hash)
  limit 1;
$$;

create or replace function public.hsm_upsert_access_account(
  p_name text,
  p_code text,
  p_permissions jsonb,
  p_is_admin boolean default false
)
returns table(student_name text, permissions jsonb, is_admin boolean, active boolean, updated_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
  existing public.hsm_access_accounts%rowtype;
begin
  select account.* into existing from public.hsm_access_accounts account where account.student_name = btrim(p_name);
  if existing.student_name is null and coalesce(length(btrim(p_code)), 0) < 6 then
    raise exception 'code_required';
  end if;
  if jsonb_typeof(p_permissions) <> 'array' then
    raise exception 'permissions_invalid';
  end if;
  return query
  insert into public.hsm_access_accounts as account(student_name, code_hash, permissions, is_admin, active, updated_at)
  values (
    btrim(p_name),
    case when coalesce(length(btrim(p_code)), 0) >= 6 then extensions.crypt(upper(btrim(p_code)), extensions.gen_salt('bf', 12)) else existing.code_hash end,
    p_permissions,
    p_is_admin,
    true,
    now()
  )
  on conflict (student_name) do update set
    code_hash = excluded.code_hash,
    permissions = excluded.permissions,
    is_admin = case when account.is_admin then true else excluded.is_admin end,
    active = true,
    updated_at = now()
  returning account.student_name, account.permissions, account.is_admin, account.active, account.updated_at;
end;
$$;

revoke all on public.hsm_access_accounts from public, anon, authenticated;
revoke all on public.hsm_access_sessions from public, anon, authenticated;

grant select, insert, update, delete on public.hsm_access_accounts to service_role;
grant select, insert, update, delete on public.hsm_access_sessions to service_role;
grant select, insert, update, delete on public.hsm_students to service_role;
grant select, insert, update, delete on public.hsm_attempts to service_role;
revoke all on function public.hsm_authenticate(text, text) from public, anon, authenticated;
revoke all on function public.hsm_upsert_access_account(text, text, jsonb, boolean) from public, anon, authenticated;
grant execute on function public.hsm_authenticate(text, text) to service_role;
grant execute on function public.hsm_upsert_access_account(text, text, jsonb, boolean) to service_role;

comment on table public.hsm_access_accounts is 'HSMIDDLE server-only approval accounts. Never expose code_hash through the Data API.';
comment on table public.hsm_access_sessions is 'HSMIDDLE short-lived server-only browser sessions.';
