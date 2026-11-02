-- Roadmap review only. Provision credentials privately, never in migrations.
-- These identities cannot access member profiles, contacts or admin APIs.
create table public.roadmap_review_accounts (
 user_id uuid primary key default gen_random_uuid(),
 username text not null unique check(username=lower(username) and username ~ '^[a-z0-9_.-]{1,64}$'),
 code_hash text not null check(code_hash ~ '^\$2[aby]\$[0-9]{2}\$[./A-Za-z0-9]{53}$'),
 active boolean not null default true,
 session_version integer not null default 1,
 updated_at timestamptz not null default now()
);
create table public.roadmap_review_sessions (
 token_hash text primary key check(token_hash ~ '^[a-f0-9]{64}$'),
 user_id uuid not null references public.roadmap_review_accounts(user_id) on delete cascade,
 session_version integer not null,
 expires_at timestamptz not null,
 created_at timestamptz not null default now()
);
create index roadmap_review_session_owner on public.roadmap_review_sessions(user_id);
create index roadmap_review_session_expiry on public.roadmap_review_sessions(expires_at);
alter table public.roadmap_review_accounts enable row level security;
alter table public.roadmap_review_sessions enable row level security;
revoke all on public.roadmap_review_accounts, public.roadmap_review_sessions from public,anon,authenticated;
grant all on public.roadmap_review_accounts, public.roadmap_review_sessions to service_role;

create function public.roadmap_review_verify_code(p_username text,p_code text)
returns uuid language plpgsql security invoker set search_path='' as $$
declare a public.roadmap_review_accounts; candidate text;
begin
 select * into a from public.roadmap_review_accounts where username=lower(p_username) and active;
 candidate:=extensions.crypt(p_code,coalesce(a.code_hash,'$2a$10$0N8D6wslGiJ9a0iD2EwAY.TpTmgYOrJu0bA3eSIhyE8NC7LkC9M7u'));
 if a.user_id is not null and candidate=a.code_hash then return a.user_id; end if;
 return null;
end;
$$;
revoke all on function public.roadmap_review_verify_code(text,text) from public,anon,authenticated;
grant execute on function public.roadmap_review_verify_code(text,text) to service_role;
