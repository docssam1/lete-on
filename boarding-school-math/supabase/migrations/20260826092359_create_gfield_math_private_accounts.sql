begin;

-- This is the replacement destination for public name/code-based math records.
-- Auth users are provisioned outside the browser. Authorization is stored in
-- this server-managed table, never in user-editable profile claims.
create table public.gfield_math_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  public_id text not null unique check (public_id ~ '^gmt-[a-z0-9]{16}$'),
  display_name text not null check (char_length(btrim(display_name)) between 1 and 80),
  role text not null check (role in ('student', 'teacher', 'admin')),
  status text not null default 'active' check (status in ('active', 'suspended')),
  grade text check (grade is null or grade ~ '^(K|[1-9]|1[0-2])$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.gfield_math_student_state (
  owner_id uuid not null references auth.users(id) on delete cascade,
  program_id text not null check (program_id ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
  state jsonb not null default '{}'::jsonb check (jsonb_typeof(state) = 'object'),
  version integer not null default 1 check (version >= 1),
  updated_at timestamptz not null default now(),
  primary key (owner_id, program_id)
);

create index gfield_math_accounts_role_status_idx
  on public.gfield_math_accounts (role, status);
create index gfield_math_student_state_updated_idx
  on public.gfield_math_student_state (owner_id, updated_at desc);

alter table public.gfield_math_accounts enable row level security;
alter table public.gfield_math_student_state enable row level security;

revoke all on table public.gfield_math_accounts from anon, authenticated;
revoke all on table public.gfield_math_student_state from anon, authenticated;

-- New Data API behavior requires explicit grants in addition to RLS.
grant select on table public.gfield_math_accounts to authenticated;
grant select, insert, update on table public.gfield_math_student_state to authenticated;

create policy gfield_math_accounts_read_self
on public.gfield_math_accounts
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy gfield_math_student_state_read_self
on public.gfield_math_student_state
for select
to authenticated
using ((select auth.uid()) = owner_id);

create policy gfield_math_student_state_insert_self
on public.gfield_math_student_state
for insert
to authenticated
with check ((select auth.uid()) = owner_id);

create policy gfield_math_student_state_update_self
on public.gfield_math_student_state
for update
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

comment on table public.gfield_math_accounts is
  'Server-managed GFIELD math identities and roles. The browser may read only its own row.';
comment on table public.gfield_math_student_state is
  'Authenticated owner-scoped diagnostic, roadmap and learning state. Staff access must use a verified server function.';

commit;
