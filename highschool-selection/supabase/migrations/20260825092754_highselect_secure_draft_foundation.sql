begin;

-- This foundation holds only approved operational metadata. Original questions,
-- answer values, solutions, source URLs, and private asset paths do not belong here.
create schema if not exists highselect_private;
revoke all on schema highselect_private from public;

create or replace function highselect_private.valid_scope(value jsonb)
returns boolean
language plpgsql
immutable
set search_path = pg_catalog
as $$
declare
  path_value jsonb;
begin
  if jsonb_typeof(value) <> 'object'
     or jsonb_object_length(value) <> 2
     or not (value ? 'curriculumVersion' and value ? 'paths')
     or jsonb_typeof(value -> 'curriculumVersion') <> 'string'
     or jsonb_typeof(value -> 'paths') <> 'array'
     or jsonb_array_length(value -> 'paths') not between 1 and 20 then
    return false;
  end if;
  for path_value in select * from jsonb_array_elements(value -> 'paths') loop
    if jsonb_typeof(path_value) <> 'object'
       or jsonb_object_length(path_value) <> 4
       or not (path_value ? 'grade' and path_value ? 'major' and path_value ? 'minor' and path_value ? 'detail')
       or jsonb_typeof(path_value -> 'grade') <> 'string'
       or jsonb_typeof(path_value -> 'major') <> 'string'
       or jsonb_typeof(path_value -> 'minor') <> 'string'
       or jsonb_typeof(path_value -> 'detail') <> 'string' then
      return false;
    end if;
  end loop;
  return true;
exception when others then
  return false;
end;
$$;

create or replace function highselect_private.valid_constraints(value jsonb)
returns boolean
language plpgsql
immutable
set search_path = pg_catalog
as $$
declare
  question_count integer;
  total_points numeric;
  max_per_family integer;
begin
  if jsonb_typeof(value) <> 'object'
     or jsonb_object_length(value) <> 3
     or not (value ? 'questionCount' and value ? 'totalPoints' and value ? 'maxPerFamily')
     or jsonb_typeof(value -> 'questionCount') <> 'number'
     or jsonb_typeof(value -> 'totalPoints') <> 'number'
     or jsonb_typeof(value -> 'maxPerFamily') <> 'number' then
    return false;
  end if;
  question_count := (value ->> 'questionCount')::integer;
  total_points := (value ->> 'totalPoints')::numeric;
  max_per_family := (value ->> 'maxPerFamily')::integer;
  return question_count between 1 and 100
    and total_points > 0 and total_points <= 1000
    and max_per_family between 1 and 10;
exception when others then
  return false;
end;
$$;

create table public.hs_staff_accounts (
  auth_user_id uuid primary key references auth.users(id) on delete restrict,
  status text not null check (status in ('active', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.hs_exam_draft_candidates (
  item_id text primary key check (item_id ~ '^qst-bnk-[a-z0-9]{16}$'),
  mode text not null check (mode in ('SH', 'DP', 'WM', 'ED', 'DG', 'SM')),
  family_id text not null check (family_id ~ '^qst-bnk-[a-z0-9]{16}$'),
  type_id text not null check (type_id ~ '^typ-bnk-[a-z0-9]{16}$'),
  grade text not null check (grade ~ '^[A-Z0-9]{2,12}$'),
  major text not null check (major ~ '^[A-Z0-9]{2,12}$'),
  minor text not null check (minor ~ '^[A-Z0-9]{2,12}$'),
  detail text not null check (detail ~ '^[A-Z0-9]{2,12}$'),
  response_type text not null check (response_type in ('input', 'multi_input', 'single_choice', 'multi_choice', 'ox', 'ordered_list', 'unordered_set', 'figure_select', 'construction')),
  classification_verified boolean not null default false,
  answer_verified boolean not null default false,
  rights_verified boolean not null default false,
  release_eligible boolean not null default false,
  lineage_relation text not null check (lineage_relation in ('original', 'twin', 'similar')),
  difficulty_band text not null check (difficulty_band in ('lowered', 'standard', 'raised')),
  core_condition_verified boolean not null default false,
  solution_structure_verified boolean not null default false,
  registered_at timestamptz not null default now(),
  registered_by uuid references auth.users(id) on delete restrict
);

create table public.hs_exam_drafts (
  id text primary key check (id ~ '^drf-(sh|dp|wm|ed|dg|sm)-[a-f0-9]{16}$'),
  mode text not null check (mode in ('SH', 'DP', 'WM', 'ED', 'DG', 'SM')),
  title text not null check (char_length(title) between 1 and 160),
  scope jsonb not null check (highselect_private.valid_scope(scope)),
  constraints jsonb not null check (highselect_private.valid_constraints(constraints)),
  status text not null check (status in ('draft', 'review_required', 'approved')),
  scope_version integer not null check (scope_version >= 1),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.hs_exam_draft_placements (
  id text primary key check (id ~ '^plc-(sh|dp|wm|ed|dg|sm)-[a-f0-9]{16}$'),
  draft_id text not null references public.hs_exam_drafts(id) on delete cascade,
  item_id text not null references public.hs_exam_draft_candidates(item_id) on delete restrict,
  sort_order integer not null check (sort_order between 1 and 100),
  points numeric(8, 2) not null check (points > 0 and points <= 1000),
  scope_version integer not null check (scope_version >= 1),
  revision integer not null default 1 check (revision >= 1),
  scope_state text not null check (scope_state in ('in_scope', 'out_of_scope', 'classification_required')),
  verification_state text not null check (verification_state in ('verified', 'review_required')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (draft_id, item_id),
  unique (draft_id, sort_order)
);

create table public.hs_exam_draft_replacements (
  id bigint generated always as identity primary key,
  placement_id text not null references public.hs_exam_draft_placements(id) on delete cascade,
  revision integer not null check (revision >= 2),
  from_item_id text not null references public.hs_exam_draft_candidates(item_id) on delete restrict,
  to_item_id text not null references public.hs_exam_draft_candidates(item_id) on delete restrict,
  reason_code text not null check (reason_code ~ '^[A-Z_]{3,48}$'),
  reviewer_id uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (placement_id, revision),
  check (from_item_id <> to_item_id)
);

create table public.hs_exam_draft_audit (
  draft_id text not null references public.hs_exam_drafts(id) on delete cascade,
  sequence integer not null check (sequence between 1 and 1000),
  action text not null check (action ~ '^[A-Z_]{3,48}$'),
  actor_id uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (draft_id, sequence)
);

create index hs_exam_draft_candidates_mode_scope_idx on public.hs_exam_draft_candidates (mode, grade, major, minor, detail);
create index hs_exam_draft_placements_draft_order_idx on public.hs_exam_draft_placements (draft_id, sort_order);
create index hs_exam_draft_audit_recent_idx on public.hs_exam_draft_audit (draft_id, created_at desc);

alter table public.hs_staff_accounts enable row level security;
alter table public.hs_exam_draft_candidates enable row level security;
alter table public.hs_exam_drafts enable row level security;
alter table public.hs_exam_draft_placements enable row level security;
alter table public.hs_exam_draft_replacements enable row level security;
alter table public.hs_exam_draft_audit enable row level security;

revoke all on table public.hs_staff_accounts from anon, authenticated;
revoke all on table public.hs_exam_draft_candidates from anon, authenticated;
revoke all on table public.hs_exam_drafts from anon, authenticated;
revoke all on table public.hs_exam_draft_placements from anon, authenticated;
revoke all on table public.hs_exam_draft_replacements from anon, authenticated;
revoke all on table public.hs_exam_draft_audit from anon, authenticated;

comment on schema highselect_private is 'Validation helpers only. The schema is not exposed through the Data API.';
comment on table public.hs_exam_draft_candidates is 'Verified metadata only. Original problem, answer, solution, source and asset path columns are prohibited.';
comment on table public.hs_exam_drafts is 'Private administrator assembly metadata. Access is through a verified Edge Function, not direct browser tables.';

commit;
