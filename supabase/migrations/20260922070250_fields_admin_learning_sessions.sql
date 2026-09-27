-- Timestamp matches the applied remote migration ledger.
begin;

alter table public.fields_access_sessions
  add column admin_user_id uuid references auth.users(id) on delete cascade;
alter table public.fields_access_sessions alter column student_name drop not null;
alter table public.fields_access_sessions
  add constraint fields_access_sessions_single_identity
  check (num_nonnulls(student_name, admin_user_id) = 1);
create index fields_access_sessions_admin_user_idx
  on public.fields_access_sessions(admin_user_id) where admin_user_id is not null;

-- Preserve student accounts, existing sessions, RLS and service-only access.
alter table public.fields_access_sessions enable row level security;
revoke all on public.fields_access_sessions from anon, authenticated;

commit;
