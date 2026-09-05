create table if not exists public.fields_access_accounts (
  student_name text primary key,
  code_hash text not null unique,
  permissions jsonb not null default '[]'::jsonb,
  student_type text not null default 'online',
  active boolean not null default true,
  updated_at timestamptz not null default now()
);
alter table public.fields_access_accounts enable row level security;

create table if not exists public.fields_access_sessions (
  token_hash text primary key,
  student_name text not null references public.fields_access_accounts(student_name) on delete cascade,
  expires_at timestamptz not null,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
alter table public.fields_access_sessions enable row level security;
create index if not exists fields_access_sessions_expiry_idx on public.fields_access_sessions(expires_at);

create table if not exists public.golden_bell_answer_books (
  book_id text primary key check (book_id ~ '^book-[0-9]{2}$'),
  payload jsonb not null,
  payload_sha256 text not null,
  updated_at timestamptz not null default now()
);
alter table public.golden_bell_answer_books enable row level security;

revoke all on public.fields_access_accounts from anon, authenticated;
revoke all on public.fields_access_sessions from anon, authenticated;
revoke all on public.golden_bell_answer_books from anon, authenticated;
grant select, insert, update, delete on public.fields_access_accounts to service_role;
grant select, insert, update, delete on public.fields_access_sessions to service_role;
grant select, insert, update, delete on public.golden_bell_answer_books to service_role;
