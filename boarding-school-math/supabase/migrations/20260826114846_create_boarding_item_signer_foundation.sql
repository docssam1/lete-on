begin;

-- These tables deliberately stay in the public schema so the authenticated
-- Edge Function can access them through the Data API with the server secret.
-- They are never browser-readable: RLS is enabled and client grants are
-- explicitly revoked below.
create table public.gfield_math_private_item_revisions (
  item_id text not null check (item_id ~ '^qst-bnk-[a-z0-9]{16}$'),
  item_version integer not null check (item_version >= 1),
  author_user_id uuid not null references auth.users(id) on delete restrict,
  program_id text not null check (program_id ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
  target_grade text not null check (target_grade ~ '^(K|[1-8])$'),
  visibility_class text not null check (visibility_class in ('public-practice', 'authenticated-assessment', 'teacher-only')),
  public_payload jsonb not null check (jsonb_typeof(public_payload) = 'object'),
  private_scoring_payload jsonb not null check (jsonb_typeof(private_scoring_payload) = 'object'),
  rubric_payload jsonb check (rubric_payload is null or jsonb_typeof(rubric_payload) = 'object'),
  public_payload_sha256 text not null check (public_payload_sha256 ~ '^[a-f0-9]{64}$'),
  private_scoring_sha256 text not null check (private_scoring_sha256 ~ '^[a-f0-9]{64}$'),
  rubric_sha256 text check (rubric_sha256 is null or rubric_sha256 ~ '^[a-f0-9]{64}$'),
  release_state text not null default 'draft' check (release_state in ('draft', 'in-review', 'signed', 'withdrawn')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (item_id, item_version),
  check ((rubric_payload is null and rubric_sha256 is null) or (rubric_payload is not null and rubric_sha256 is not null))
);

create table public.gfield_math_private_rights_records (
  rights_record_id text not null check (rights_record_id ~ '^rgt-bnk-[a-z0-9]{16}$'),
  rights_version integer not null check (rights_version >= 1),
  item_id text not null,
  item_version integer not null,
  asset_id text check (asset_id is null or asset_id ~ '^ast-bnk-[a-z0-9]{16}$'),
  rights_payload jsonb not null check (jsonb_typeof(rights_payload) = 'object'),
  rights_record_sha256 text not null check (rights_record_sha256 ~ '^[a-f0-9]{64}$'),
  decision text not null check (decision in ('draft', 'approved', 'rejected', 'withdrawn')),
  expires_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete restrict,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (rights_record_id, rights_version),
  foreign key (item_id, item_version) references public.gfield_math_private_item_revisions(item_id, item_version) on delete restrict,
  check ((decision = 'approved' and reviewed_by is not null and reviewed_at is not null) or decision <> 'approved')
);

create table public.gfield_math_private_item_rights_bindings (
  item_id text not null,
  item_version integer not null,
  asset_key text not null check (asset_key = '__item__' or asset_key ~ '^ast-bnk-[a-z0-9]{16}$'),
  rights_record_id text not null,
  rights_version integer not null,
  created_at timestamptz not null default now(),
  primary key (item_id, item_version, asset_key),
  foreign key (item_id, item_version) references public.gfield_math_private_item_revisions(item_id, item_version) on delete restrict,
  foreign key (rights_record_id, rights_version) references public.gfield_math_private_rights_records(rights_record_id, rights_version) on delete restrict
);

create table public.gfield_math_private_review_records (
  review_id text primary key check (review_id ~ '^rvw-bnk-[a-z0-9]{16}$'),
  item_id text not null,
  item_version integer not null,
  review_type text not null check (review_type in (
    'math-correctness', 'age-appropriateness', 'answer-uniqueness', 'translation-ko', 'translation-en',
    'translation-zh-Hans', 'rights', 'asset-rights', 'scoring-rubric', 'visual-evidence'
  )),
  review_payload jsonb not null check (jsonb_typeof(review_payload) = 'object'),
  review_record_sha256 text not null check (review_record_sha256 ~ '^[a-f0-9]{64}$'),
  decision text not null check (decision in ('draft', 'approved', 'rejected', 'withdrawn')),
  reviewer_user_id uuid not null references auth.users(id) on delete restrict,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  foreign key (item_id, item_version) references public.gfield_math_private_item_revisions(item_id, item_version) on delete restrict,
  check ((decision = 'approved' and reviewed_at is not null) or decision <> 'approved')
);

create table public.gfield_math_private_release_manifests (
  release_id text primary key check (release_id ~ '^rel-bnk-[a-z0-9]{16}$'),
  item_id text not null,
  item_version integer not null,
  manifest_payload jsonb not null check (jsonb_typeof(manifest_payload) = 'object'),
  manifest_sha256 text not null check (manifest_sha256 ~ '^[a-f0-9]{64}$'),
  signature_base64url text not null check (signature_base64url ~ '^[A-Za-z0-9_-]+$'),
  signing_key_id text not null check (char_length(btrim(signing_key_id)) between 1 and 120),
  signed_by uuid not null references auth.users(id) on delete restrict,
  signed_at timestamptz not null default now(),
  release_state text not null default 'signed' check (release_state in ('signed', 'withdrawn')),
  unique (item_id, item_version),
  foreign key (item_id, item_version) references public.gfield_math_private_item_revisions(item_id, item_version) on delete restrict
);

create index gfield_math_private_item_release_state_idx
  on public.gfield_math_private_item_revisions (release_state, program_id, target_grade);
create index gfield_math_private_rights_item_idx
  on public.gfield_math_private_rights_records (item_id, item_version, decision);
create index gfield_math_private_item_rights_bindings_item_idx
  on public.gfield_math_private_item_rights_bindings (item_id, item_version);
create index gfield_math_private_review_item_idx
  on public.gfield_math_private_review_records (item_id, item_version, decision, review_type);

create or replace function public.gfield_math_prevent_signed_release_mutation()
returns trigger
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'delete' then
    raise exception 'immutable GFIELD release records cannot be deleted';
  end if;
  if old.release_state in ('signed', 'withdrawn') then
    raise exception 'signed or withdrawn GFIELD release records cannot be changed';
  end if;
  return new;
end;
$$;

create trigger gfield_math_private_item_revisions_immutable_after_sign
before update or delete on public.gfield_math_private_item_revisions
for each row execute function public.gfield_math_prevent_signed_release_mutation();

create trigger gfield_math_private_release_manifests_immutable
before update or delete on public.gfield_math_private_release_manifests
for each row execute function public.gfield_math_prevent_signed_release_mutation();

create or replace function public.gfield_math_prevent_private_evidence_mutation()
returns trigger
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
begin
  raise exception 'private GFIELD rights and review records are append-only; create a new revision instead';
end;
$$;

create trigger gfield_math_private_rights_records_append_only
before update or delete on public.gfield_math_private_rights_records
for each row execute function public.gfield_math_prevent_private_evidence_mutation();

create trigger gfield_math_private_review_records_append_only
before update or delete on public.gfield_math_private_review_records
for each row execute function public.gfield_math_prevent_private_evidence_mutation();

create trigger gfield_math_private_item_rights_bindings_append_only
before update or delete on public.gfield_math_private_item_rights_bindings
for each row execute function public.gfield_math_prevent_private_evidence_mutation();

-- The signer calls this as service_role after it has authenticated an active
-- administrator and verified every hash and review.  Keeping the insert and
-- state transition in this invoker-security RPC makes the release atomic;
-- it does not grant a browser role any ability to finalize a release.
create or replace function public.gfield_math_commit_signed_release(
  p_release_id text,
  p_item_id text,
  p_item_version integer,
  p_manifest_payload jsonb,
  p_manifest_sha256 text,
  p_signature_base64url text,
  p_signing_key_id text,
  p_signed_by uuid,
  p_signed_at timestamptz
)
returns boolean
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
begin
  update public.gfield_math_private_item_revisions
     set release_state = 'signed', updated_at = p_signed_at
   where item_id = p_item_id
     and item_version = p_item_version
     and release_state = 'in-review';
  if not found then
    raise exception 'GFIELD item revision was not ready to sign';
  end if;

  insert into public.gfield_math_private_release_manifests (
    release_id, item_id, item_version, manifest_payload, manifest_sha256,
    signature_base64url, signing_key_id, signed_by, signed_at, release_state
  ) values (
    p_release_id, p_item_id, p_item_version, p_manifest_payload, p_manifest_sha256,
    p_signature_base64url, p_signing_key_id, p_signed_by, p_signed_at, 'signed'
  );
  return true;
end;
$$;

alter table public.gfield_math_private_item_revisions enable row level security;
alter table public.gfield_math_private_rights_records enable row level security;
alter table public.gfield_math_private_item_rights_bindings enable row level security;
alter table public.gfield_math_private_review_records enable row level security;
alter table public.gfield_math_private_release_manifests enable row level security;

revoke all on table public.gfield_math_private_item_revisions from anon, authenticated;
revoke all on table public.gfield_math_private_rights_records from anon, authenticated;
revoke all on table public.gfield_math_private_item_rights_bindings from anon, authenticated;
revoke all on table public.gfield_math_private_review_records from anon, authenticated;
revoke all on table public.gfield_math_private_release_manifests from anon, authenticated;
revoke all on function public.gfield_math_prevent_signed_release_mutation() from public, anon, authenticated;
revoke all on function public.gfield_math_prevent_private_evidence_mutation() from public, anon, authenticated;
revoke all on function public.gfield_math_commit_signed_release(text, text, integer, jsonb, text, text, text, uuid, timestamptz) from public, anon, authenticated;

grant all on table public.gfield_math_private_item_revisions to service_role;
grant all on table public.gfield_math_private_rights_records to service_role;
grant all on table public.gfield_math_private_item_rights_bindings to service_role;
grant all on table public.gfield_math_private_review_records to service_role;
grant all on table public.gfield_math_private_release_manifests to service_role;
grant execute on function public.gfield_math_commit_signed_release(text, text, integer, jsonb, text, text, text, uuid, timestamptz) to service_role;

comment on table public.gfield_math_private_item_revisions is
  'Private answer-bearing item revisions. Browser roles have no grants; authenticated delivery and signing use a verified server function.';
comment on table public.gfield_math_private_rights_records is
  'Immutable-version rights evidence for an item or one asset. Browser roles have no grants.';
comment on table public.gfield_math_private_item_rights_bindings is
  'Exact immutable item-to-rights revision bindings. Browser roles have no grants.';
comment on table public.gfield_math_private_review_records is
  'Independent review evidence bound to exact item revisions. Browser roles have no grants.';
comment on table public.gfield_math_private_release_manifests is
  'Server-signed immutable release manifests. Browser roles have no direct access.';

commit;
