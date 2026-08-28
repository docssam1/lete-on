begin;

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;
create extension if not exists supabase_vault cascade;

-- Executable cross-runtime golden vector. This public test key proves that
-- PostgreSQL and the Edge WebCrypto helper build identical UTF-8 material and
-- Base64URL HMAC output before any release function is installed.
do $gfield_release_commit_hmac_golden$
declare
  v_manifest_sha text := repeat('a', 64);
  v_signature text := repeat('A', 86);
  v_key_id text := 'gfield-boarding-ed25519-v1';
  v_signed_by text := '123e4567-e89b-42d3-a456-426614174000';
  v_signed_at text := '2026-08-28T12:34:56.789Z';
  v_manifest_json text := '{"itemId":"qst-bnk-g6rp01draft001","label":"수학 π"}';
  v_material text;
  v_proof text;
begin
  v_material :=
    octet_length(convert_to(v_manifest_sha, 'UTF8'))::text || ':' || v_manifest_sha ||
    octet_length(convert_to(v_signature, 'UTF8'))::text || ':' || v_signature ||
    octet_length(convert_to(v_key_id, 'UTF8'))::text || ':' || v_key_id ||
    octet_length(convert_to(v_signed_by, 'UTF8'))::text || ':' || v_signed_by ||
    octet_length(convert_to(v_signed_at, 'UTF8'))::text || ':' || v_signed_at ||
    octet_length(convert_to(v_manifest_json, 'UTF8'))::text || ':' || v_manifest_json;
  v_proof := rtrim(
    translate(
      encode(
        extensions.hmac(
          v_material,
          'gfield-release-proof-test-key-0123456789abcdef',
          'sha256'
        ),
        'base64'
      ),
      '+/', '-_'
    ),
    '='
  );
  if v_proof <> '6SY-ZRFr3HOISOUegXnre5_DoiFgr6lpHvAb1kUYSw8' then
    raise exception 'GFIELD release commit HMAC golden vector mismatch';
  end if;
end;
$gfield_release_commit_hmac_golden$;

-- The table-touching definer is deliberately outside every API-exposed
-- schema. The public RPC below is a permission-preserving invoker wrapper.
create schema if not exists gfield_math_internal;
revoke all on schema gfield_math_internal from public, anon, authenticated, service_role;
grant usage on schema gfield_math_internal to service_role;

-- The release-commit secret is readable and mutable only by database owners.
-- Supabase grants service_role direct Vault table/function privileges by
-- default, including secret mutation. Direct Vault access associated with an
-- API service key must not be able to replace this HMAC authority, so this
-- signer requires a dedicated project whose Edge functions do not need direct
-- Vault SQL access. The service role is still part of the wider signing TCB
-- because Supabase Auth Admin can act on user accounts.
revoke all on schema vault from public, anon, authenticated, service_role;
revoke all privileges on all tables in schema vault from public, anon, authenticated, service_role;
revoke all privileges on all sequences in schema vault from public, anon, authenticated, service_role;
revoke all privileges on all functions in schema vault from public, anon, authenticated, service_role;

-- The migration role becomes the owner of the internal definer below. Preserve
-- only the exact Vault read privileges that definer needs after PUBLIC access
-- is removed.
do $gfield_vault_owner_access$
begin
  execute format('grant usage on schema vault to %I', current_user);
  execute format(
    'grant select on table vault.decrypted_secrets to %I',
    current_user
  );
  if not has_schema_privilege(current_user, 'vault', 'USAGE')
     or not has_table_privilege(
       current_user,
       'vault.decrypted_secrets',
       'SELECT'
     ) then
    raise exception 'GFIELD internal definer owner lacks required Vault read access';
  end if;
end;
$gfield_vault_owner_access$;

-- Fail the migration if direct or inherited privileges survive the revokes.
do $gfield_vault_acl_gate$
declare
  v_role text;
begin
  foreach v_role in array array['anon', 'authenticated', 'service_role']::text[]
  loop
    if has_schema_privilege(v_role, 'vault', 'USAGE')
       or has_schema_privilege(v_role, 'vault', 'CREATE')
       or exists (
         select 1
           from pg_class c
           join pg_namespace n on n.oid = c.relnamespace
          where n.nspname = 'vault'
            and c.relkind in ('r', 'p', 'v', 'm', 'f')
            and (
              has_table_privilege(v_role, c.oid, 'SELECT')
              or has_table_privilege(v_role, c.oid, 'INSERT')
              or has_table_privilege(v_role, c.oid, 'UPDATE')
              or has_table_privilege(v_role, c.oid, 'DELETE')
              or has_table_privilege(v_role, c.oid, 'TRUNCATE')
              or has_table_privilege(v_role, c.oid, 'REFERENCES')
              or has_table_privilege(v_role, c.oid, 'TRIGGER')
            )
       )
       or exists (
         select 1
           from pg_class c
           join pg_namespace n on n.oid = c.relnamespace
          where n.nspname = 'vault'
            and c.relkind = 'S'
            and (
              has_sequence_privilege(v_role, c.oid, 'USAGE')
              or has_sequence_privilege(v_role, c.oid, 'SELECT')
              or has_sequence_privilege(v_role, c.oid, 'UPDATE')
            )
       )
       or exists (
         select 1
           from pg_proc p
           join pg_namespace n on n.oid = p.pronamespace
          where n.nspname = 'vault'
            and has_function_privilege(v_role, p.oid, 'EXECUTE')
       ) then
      raise exception 'GFIELD Vault ACL gate failed for role %', v_role;
    end if;
  end loop;
end;
$gfield_vault_acl_gate$;

-- Existing staging databases may already have the original review-type check.
-- Extend it so a human review bound to both public and private hashes is
-- mandatory for student-payload answer-leak safety.
alter table public.gfield_math_private_review_records
  drop constraint if exists gfield_math_private_review_records_review_type_check;
alter table public.gfield_math_private_review_records
  add constraint gfield_math_private_review_records_review_type_check
  check (review_type in (
    'math-correctness', 'age-appropriateness', 'answer-uniqueness',
    'translation-ko', 'translation-en', 'translation-zh-Hans', 'rights',
    'asset-rights', 'scoring-rubric', 'visual-evidence',
    'student-payload-safety'
  ));

-- Reviewer specialties are server-managed authorization, not values that a
-- review JSON document may grant to itself. No browser role can read or write
-- this table. An active generic teacher/admin account and an active specialty
-- credential are both required by the signer.
create table public.gfield_math_reviewer_credentials (
  user_id uuid not null references public.gfield_math_accounts(user_id) on delete restrict,
  reviewer_role text not null check (reviewer_role in (
    'math-reviewer', 'curriculum-reviewer', 'translator-reviewer',
    'rights-reviewer', 'scoring-reviewer', 'visual-reviewer',
    'security-reviewer'
  )),
  credential_version integer not null check (credential_version >= 1),
  status text not null default 'active' check (status = 'active'),
  credential_ref text not null check (char_length(btrim(credential_ref)) between 1 and 240),
  approved_by uuid not null references public.gfield_math_accounts(user_id) on delete restrict,
  approved_at timestamptz not null,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, reviewer_role, credential_version),
  check (expires_at is null or expires_at > approved_at)
);

create index gfield_math_reviewer_credentials_status_idx
  on public.gfield_math_reviewer_credentials (status, reviewer_role, expires_at);

create table public.gfield_math_reviewer_credential_revocations (
  user_id uuid not null,
  reviewer_role text not null,
  credential_version integer not null,
  revoked_by uuid not null references public.gfield_math_accounts(user_id) on delete restrict,
  revoked_at timestamptz not null default clock_timestamp(),
  reason text not null check (char_length(btrim(reason)) between 1 and 240),
  created_at timestamptz not null default now(),
  primary key (user_id, reviewer_role, credential_version),
  foreign key (user_id, reviewer_role, credential_version)
    references public.gfield_math_reviewer_credentials(
      user_id, reviewer_role, credential_version
    ) on delete restrict
);

alter table public.gfield_math_reviewer_credentials enable row level security;
alter table public.gfield_math_reviewer_credential_revocations enable row level security;
revoke all on table public.gfield_math_reviewer_credentials from anon, authenticated;
revoke all on table public.gfield_math_reviewer_credential_revocations from anon, authenticated;

-- The Edge signer can read and append private evidence, but cannot mutate or
-- truncate it. Only the checked SECURITY DEFINER commit function below can
-- change an item to signed or insert a release manifest.
revoke all on table public.gfield_math_private_item_revisions from service_role;
revoke all on table public.gfield_math_private_rights_records from service_role;
revoke all on table public.gfield_math_private_item_rights_bindings from service_role;
revoke all on table public.gfield_math_private_review_records from service_role;
revoke all on table public.gfield_math_private_release_manifests from service_role;
revoke all on table public.gfield_math_reviewer_credentials from service_role;
revoke all on table public.gfield_math_reviewer_credential_revocations from service_role;

grant select, insert on table public.gfield_math_private_item_revisions to service_role;
grant select, insert on table public.gfield_math_private_rights_records to service_role;
grant select, insert on table public.gfield_math_private_item_rights_bindings to service_role;
grant select, insert on table public.gfield_math_private_review_records to service_role;
grant select on table public.gfield_math_private_release_manifests to service_role;
grant select on table public.gfield_math_reviewer_credentials to service_role;
grant select on table public.gfield_math_reviewer_credential_revocations to service_role;

create trigger gfield_math_reviewer_credentials_append_only
before update or delete on public.gfield_math_reviewer_credentials
for each row execute function public.gfield_math_prevent_private_evidence_mutation();

create trigger gfield_math_reviewer_credential_revocations_append_only
before update or delete on public.gfield_math_reviewer_credential_revocations
for each row execute function public.gfield_math_prevent_private_evidence_mutation();

create function public.gfield_math_reject_future_private_evidence()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog, pg_temp
as $$
begin
  if (to_jsonb(new)->>'reviewed_at')::timestamptz > clock_timestamp() + interval '5 seconds' then
    raise exception 'GFIELD review evidence cannot be future-dated';
  end if;
  return new;
end;
$$;

create trigger gfield_math_private_rights_records_no_future_review
before insert on public.gfield_math_private_rights_records
for each row execute function public.gfield_math_reject_future_private_evidence();

create trigger gfield_math_private_review_records_no_future_review
before insert on public.gfield_math_private_review_records
for each row execute function public.gfield_math_reject_future_private_evidence();

create function public.gfield_math_validate_reviewer_credential_insert()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog, pg_temp
as $$
begin
  if new.approved_at > clock_timestamp() + interval '5 seconds' then
    raise exception 'GFIELD reviewer credential approval cannot be future-dated';
  end if;
  if new.approved_by = new.user_id or not exists (
    select 1
      from public.gfield_math_accounts a
     where a.user_id = new.approved_by
       and a.role = 'admin'
       and a.status = 'active'
  ) then
    raise exception 'GFIELD reviewer credential requires an independent active administrator';
  end if;
  return new;
end;
$$;

create trigger gfield_math_reviewer_credentials_validate_insert
before insert on public.gfield_math_reviewer_credentials
for each row execute function public.gfield_math_validate_reviewer_credential_insert();

create function public.gfield_math_stamp_reviewer_credential_revocation()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog, pg_temp
as $$
begin
  if new.revoked_by = new.user_id or not exists (
    select 1
      from public.gfield_math_accounts a
     where a.user_id = new.revoked_by
       and a.role = 'admin'
       and a.status = 'active'
  ) then
    raise exception 'GFIELD reviewer credential revocation requires an independent active administrator';
  end if;
  new.revoked_at := clock_timestamp();
  new.created_at := new.revoked_at;
  return new;
end;
$$;

create trigger gfield_math_reviewer_credential_revocations_stamp_insert
before insert on public.gfield_math_reviewer_credential_revocations
for each row execute function public.gfield_math_stamp_reviewer_credential_revocation();

create function public.gfield_math_prevent_presigned_item_insert()
returns trigger
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
begin
  if new.release_state in ('signed', 'withdrawn') then
    raise exception 'a GFIELD item must pass the signed-release commit function';
  end if;
  return new;
end;
$$;

create trigger gfield_math_private_item_revisions_no_presigned_insert
before insert on public.gfield_math_private_item_revisions
for each row execute function public.gfield_math_prevent_presigned_item_insert();

comment on table public.gfield_math_reviewer_credentials is
  'Immutable versioned reviewer specialty authorization. Review payload role labels are never authority by themselves.';
comment on table public.gfield_math_reviewer_credential_revocations is
  'Append-only revocations for immutable reviewer specialty credential versions.';

-- Remove the earlier commit function so no service path can finalize a row
-- using only item id/version/state after the signer has released its snapshot.
revoke execute on function public.gfield_math_commit_signed_release(
  text, text, integer, jsonb, text, text, text, uuid, timestamptz
) from service_role;
drop function public.gfield_math_commit_signed_release(
  text, text, integer, jsonb, text, text, text, uuid, timestamptz
);

-- The exact item snapshot, reviewer accounts, immutable evidence, versioned
-- specialty credentials, revocations, and current database time are checked
-- again in one transaction. Reviewer/account rows and credential parents are
-- row-locked so a concurrent suspension or revocation cannot race the commit.
create function gfield_math_internal.commit_signed_release(
  p_release_id text,
  p_item_id text,
  p_item_version integer,
  p_expected_author_user_id uuid,
  p_expected_program_id text,
  p_expected_target_grade text,
  p_expected_visibility_class text,
  p_expected_public_payload jsonb,
  p_expected_private_scoring_payload jsonb,
  p_expected_rubric_payload jsonb,
  p_expected_public_payload_sha256 text,
  p_expected_private_scoring_sha256 text,
  p_expected_rubric_sha256 text,
  p_manifest_payload jsonb,
  p_manifest_sha256 text,
  p_manifest_canonical_json text,
  p_signature_base64url text,
  p_signing_key_id text,
  p_signed_by uuid,
  p_signed_at timestamptz,
  p_commit_proof_base64url text
)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, pg_temp
as $$
declare
  v_binding jsonb;
  v_expected_rights_count bigint;
  v_manifest_count bigint;
  v_distinct_count bigint;
  v_required_type text;
  v_review_type text;
  v_expected_role text;
  v_reviewer_id uuid;
  v_reviewed_at timestamptz;
  v_credential_version integer;
  v_authorized_at timestamptz;
  v_commit_secret text;
  v_commit_material text;
  v_expected_commit_proof text;
begin
  if jsonb_typeof(p_manifest_payload) is distinct from 'object'
     or (select count(*) from jsonb_object_keys(p_manifest_payload)) <> 12
     or not (p_manifest_payload ?& array[
       'schemaVersion', 'releaseId', 'itemId', 'itemVersion',
       'visibilityClass', 'publicPayloadSha256', 'privateScoringSha256',
       'rubricSha256', 'rightsBindings', 'reviewBindings', 'signedAt',
       'signedBy'
     ])
     or jsonb_typeof(p_manifest_payload->'rightsBindings') is distinct from 'array'
     or jsonb_typeof(p_manifest_payload->'reviewBindings') is distinct from 'array'
     or (p_manifest_payload->>'schemaVersion') is distinct from 'gfield-boarding-release-manifest-v1'
     or (p_manifest_payload->>'releaseId') is distinct from p_release_id
     or (p_manifest_payload->>'itemId') is distinct from p_item_id
     or (p_manifest_payload->>'itemVersion')::integer is distinct from p_item_version
     or (p_manifest_payload->>'visibilityClass') is distinct from p_expected_visibility_class
     or (p_manifest_payload->>'publicPayloadSha256') is distinct from p_expected_public_payload_sha256
     or (p_manifest_payload->>'privateScoringSha256') is distinct from p_expected_private_scoring_sha256
     or (p_manifest_payload->>'rubricSha256') is distinct from p_expected_rubric_sha256
     or (p_manifest_payload->>'signedBy')::uuid is distinct from p_signed_by
     or (p_manifest_payload->>'signedAt')::timestamptz is distinct from p_signed_at
     or p_signed_at > clock_timestamp() + interval '5 seconds'
     or p_signed_at < clock_timestamp() - interval '5 minutes'
     or jsonb_array_length(p_manifest_payload->'rightsBindings') < 1
     or jsonb_array_length(p_manifest_payload->'reviewBindings') < 1 then
    raise exception 'GFIELD signed manifest identity or shape is invalid';
  end if;

  if p_manifest_sha256 !~ '^[a-f0-9]{64}$'
     or p_signature_base64url !~ '^[A-Za-z0-9_-]{86}$'
     or p_signing_key_id !~ '^[A-Za-z0-9._:-]{1,120}$'
     or p_commit_proof_base64url !~ '^[A-Za-z0-9_-]{43}$'
     or p_manifest_canonical_json is null
     or p_manifest_canonical_json = ''
     or p_manifest_canonical_json <> btrim(p_manifest_canonical_json)
     or p_manifest_canonical_json::jsonb is distinct from p_manifest_payload then
    raise exception 'GFIELD release commit proof input is invalid';
  end if;

  select d.decrypted_secret
    into v_commit_secret
    from vault.decrypted_secrets d
   where d.name = 'gfield_boarding_release_commit_hmac_v1';
  if v_commit_secret is null
     or v_commit_secret ~ '[^!-~]'
     or octet_length(convert_to(v_commit_secret, 'UTF8')) not between 32 and 512 then
    raise exception 'GFIELD release commit proof is not configured';
  end if;

  v_commit_material :=
    octet_length(convert_to(p_manifest_sha256, 'UTF8'))::text || ':' || p_manifest_sha256 ||
    octet_length(convert_to(p_signature_base64url, 'UTF8'))::text || ':' || p_signature_base64url ||
    octet_length(convert_to(p_signing_key_id, 'UTF8'))::text || ':' || p_signing_key_id ||
    octet_length(convert_to(p_signed_by::text, 'UTF8'))::text || ':' || p_signed_by::text ||
    octet_length(convert_to(p_manifest_payload->>'signedAt', 'UTF8'))::text || ':' || (p_manifest_payload->>'signedAt') ||
    octet_length(convert_to(p_manifest_canonical_json, 'UTF8'))::text || ':' || p_manifest_canonical_json;
  v_expected_commit_proof := rtrim(
    translate(
      encode(extensions.hmac(v_commit_material, v_commit_secret, 'sha256'), 'base64'),
      '+/', '-_'
    ),
    '='
  );
  if v_expected_commit_proof is distinct from p_commit_proof_base64url then
    raise exception 'GFIELD release commit proof is invalid';
  end if;

  -- Lock the exact item revision first. This is both the item snapshot CAS and
  -- the serialization point for two attempts to sign the same revision.
  perform 1
    from public.gfield_math_private_item_revisions i
   where i.item_id = p_item_id
     and i.item_version = p_item_version
     and i.author_user_id = p_expected_author_user_id
     and i.program_id = p_expected_program_id
     and i.target_grade = p_expected_target_grade
     and i.visibility_class = p_expected_visibility_class
     and i.public_payload = p_expected_public_payload
     and i.private_scoring_payload = p_expected_private_scoring_payload
     and i.rubric_payload is not distinct from p_expected_rubric_payload
     and i.public_payload_sha256 = p_expected_public_payload_sha256
     and i.private_scoring_sha256 = p_expected_private_scoring_sha256
     and i.rubric_sha256 is not distinct from p_expected_rubric_sha256
     and i.release_state = 'in-review'
     for update;
  if not found then
    raise exception 'GFIELD item revision changed after verification or was not ready to sign';
  end if;

  perform 1
    from public.gfield_math_accounts a
   where a.user_id = p_signed_by
     and a.role = 'admin'
     and a.status = 'active'
     for update;
  if not found then
    raise exception 'GFIELD signing administrator is no longer active';
  end if;

  select count(*) into v_expected_rights_count
    from public.gfield_math_private_item_rights_bindings b
   where b.item_id = p_item_id and b.item_version = p_item_version;
  select count(*), count(distinct entry->>'assetKey')
    into v_manifest_count, v_distinct_count
    from jsonb_array_elements(p_manifest_payload->'rightsBindings') as e(entry);
  if v_manifest_count <> v_expected_rights_count
     or v_distinct_count <> v_manifest_count then
    raise exception 'GFIELD rights manifest does not bind the exact item rights set';
  end if;

  for v_binding in
    select entry
      from jsonb_array_elements(p_manifest_payload->'rightsBindings') as e(entry)
  loop
    if jsonb_typeof(v_binding) is distinct from 'object'
       or (select count(*) from jsonb_object_keys(v_binding)) <> 11
       or not (v_binding ?& array[
         'assetKey', 'rightsRecordId', 'rightsVersion',
         'rightsRecordSha256', 'reviewerUserId', 'reviewerRole',
         'reviewedAt', 'reviewerCredentialVersion', 'credentialApprovedBy',
         'credentialApprovedAt', 'credentialExpiresAt'
       ])
       or v_binding->>'reviewerRole' <> 'rights-reviewer' then
      raise exception 'GFIELD rights manifest binding is invalid';
    end if;
    v_reviewer_id := (v_binding->>'reviewerUserId')::uuid;
    v_reviewed_at := (v_binding->>'reviewedAt')::timestamptz;
    v_credential_version := (v_binding->>'reviewerCredentialVersion')::integer;
    if v_reviewed_at > p_signed_at or v_reviewed_at > clock_timestamp() then
      raise exception 'GFIELD rights review evidence cannot be future-dated';
    end if;

    perform 1
      from public.gfield_math_private_item_rights_bindings b
      join public.gfield_math_private_rights_records r
        on r.rights_record_id = b.rights_record_id
       and r.rights_version = b.rights_version
     where b.item_id = p_item_id
       and b.item_version = p_item_version
       and b.asset_key = v_binding->>'assetKey'
       and b.rights_record_id = v_binding->>'rightsRecordId'
       and b.rights_version = (v_binding->>'rightsVersion')::integer
       and r.item_id = p_item_id
       and r.item_version = p_item_version
       and r.rights_record_sha256 = v_binding->>'rightsRecordSha256'
       and r.decision = 'approved'
       and r.reviewed_by = v_reviewer_id
       and r.reviewed_at = v_reviewed_at
       and (r.expires_at is null or r.expires_at > clock_timestamp())
       and (
         (b.asset_key = '__item__' and r.asset_id is null)
         or (b.asset_key <> '__item__' and r.asset_id = b.asset_key)
       );
    if not found then
      raise exception 'GFIELD rights evidence changed, expired, or is incomplete';
    end if;

    perform 1
      from public.gfield_math_accounts a
     where a.user_id = v_reviewer_id
       and a.user_id <> p_expected_author_user_id
       and a.role in ('teacher', 'admin')
       and a.status = 'active'
       for update;
    if not found then
      raise exception 'GFIELD rights reviewer is no longer authorized';
    end if;

    -- Locking the credential parent conflicts with the foreign-key key-share
    -- lock used by a concurrent revocation insert. A revocation that started
    -- first completes before the fresh revocation query below; one that starts
    -- later waits until this signed-release transaction finishes.
    perform 1
      from public.gfield_math_reviewer_credentials c
     where c.user_id = v_reviewer_id
       and c.reviewer_role = 'rights-reviewer'
       and c.credential_version = v_credential_version
       and c.status = 'active'
       and c.approved_by = (v_binding->>'credentialApprovedBy')::uuid
       and c.approved_at = (v_binding->>'credentialApprovedAt')::timestamptz
       and c.approved_at <= v_reviewed_at
       and c.approved_at <= p_signed_at
       and c.approved_at <= clock_timestamp()
       and (
         (c.expires_at is null and v_binding->>'credentialExpiresAt' is null)
         or (
           c.expires_at = (v_binding->>'credentialExpiresAt')::timestamptz
           and c.expires_at > v_reviewed_at
           and c.expires_at > clock_timestamp()
         )
       )
       for update;
    if not found then
      raise exception 'GFIELD rights reviewer credential is invalid or expired';
    end if;
    perform 1
      from public.gfield_math_accounts a
     where a.user_id = (v_binding->>'credentialApprovedBy')::uuid
       and a.user_id <> v_reviewer_id
       and a.role = 'admin'
       and a.status = 'active'
       for update;
    if not found then
      raise exception 'GFIELD rights reviewer credential approver is no longer authorized';
    end if;
    if exists (
      select 1
        from public.gfield_math_reviewer_credential_revocations x
       where x.user_id = v_reviewer_id
         and x.reviewer_role = 'rights-reviewer'
         and x.credential_version = v_credential_version
    ) then
      raise exception 'GFIELD rights reviewer credential was revoked';
    end if;
  end loop;

  select count(*), count(distinct entry->>'reviewId')
    into v_manifest_count, v_distinct_count
    from jsonb_array_elements(p_manifest_payload->'reviewBindings') as e(entry);
  if v_distinct_count <> v_manifest_count then
    raise exception 'GFIELD review manifest contains duplicate review evidence';
  end if;

  for v_binding in
    select entry
      from jsonb_array_elements(p_manifest_payload->'reviewBindings') as e(entry)
  loop
    if jsonb_typeof(v_binding) is distinct from 'object'
       or (select count(*) from jsonb_object_keys(v_binding)) <> 10
       or not (v_binding ?& array[
         'reviewId', 'type', 'reviewRecordSha256', 'reviewerUserId',
         'reviewerRole', 'reviewedAt', 'reviewerCredentialVersion',
         'credentialApprovedBy', 'credentialApprovedAt',
         'credentialExpiresAt'
       ]) then
      raise exception 'GFIELD review manifest binding is invalid';
    end if;
    v_review_type := v_binding->>'type';
    v_expected_role := case
      when v_review_type in ('math-correctness', 'answer-uniqueness') then 'math-reviewer'
      when v_review_type = 'age-appropriateness' then 'curriculum-reviewer'
      when v_review_type in ('translation-ko', 'translation-en', 'translation-zh-Hans') then 'translator-reviewer'
      when v_review_type in ('rights', 'asset-rights') then 'rights-reviewer'
      when v_review_type = 'scoring-rubric' then 'scoring-reviewer'
      when v_review_type = 'visual-evidence' then 'visual-reviewer'
      when v_review_type = 'student-payload-safety' then 'security-reviewer'
      else null
    end;
    if v_expected_role is null or v_binding->>'reviewerRole' <> v_expected_role then
      raise exception 'GFIELD review specialty binding is invalid';
    end if;
    v_reviewer_id := (v_binding->>'reviewerUserId')::uuid;
    v_reviewed_at := (v_binding->>'reviewedAt')::timestamptz;
    v_credential_version := (v_binding->>'reviewerCredentialVersion')::integer;
    if v_reviewed_at > p_signed_at or v_reviewed_at > clock_timestamp() then
      raise exception 'GFIELD review evidence cannot be future-dated';
    end if;

    perform 1
      from public.gfield_math_private_review_records r
     where r.review_id = v_binding->>'reviewId'
       and r.item_id = p_item_id
       and r.item_version = p_item_version
       and r.review_type = v_review_type
       and r.review_record_sha256 = v_binding->>'reviewRecordSha256'
       and r.decision = 'approved'
       and r.reviewer_user_id = v_reviewer_id
       and r.reviewed_at = v_reviewed_at
       and r.review_payload->>'schemaVersion' = 'gfield-item-bank-v1'
       and r.review_payload->>'reviewId' = r.review_id
       and r.review_payload->>'reviewRecordSha256' = r.review_record_sha256
       and r.review_payload->>'type' = r.review_type
       and r.review_payload->>'decision' = 'approved'
       and (r.review_payload->>'authorId')::uuid = p_expected_author_user_id
       and (r.review_payload->>'reviewerId')::uuid = r.reviewer_user_id
       and r.review_payload->>'reviewerRole' = v_expected_role
       and (r.review_payload->>'reviewedAt')::timestamptz = r.reviewed_at
       and r.review_payload->>'itemId' = p_item_id
       and (r.review_payload->>'itemVersion')::integer = p_item_version
       and r.review_payload->>'reviewedPublicHash' = p_expected_public_payload_sha256;
    if not found then
      raise exception 'GFIELD review evidence changed or is incomplete';
    end if;

    if v_review_type in (
      'math-correctness', 'answer-uniqueness', 'scoring-rubric',
      'student-payload-safety'
    ) and (
      select r.review_payload->>'reviewedPrivateHash'
        from public.gfield_math_private_review_records r
       where r.review_id = v_binding->>'reviewId'
    ) is distinct from p_expected_private_scoring_sha256 then
      raise exception 'GFIELD review does not bind the private scoring revision';
    end if;
    if v_review_type = 'scoring-rubric' and (
      select r.review_payload->>'reviewedRubricHash'
        from public.gfield_math_private_review_records r
       where r.review_id = v_binding->>'reviewId'
    ) is distinct from p_expected_rubric_sha256 then
      raise exception 'GFIELD scoring review does not bind the rubric revision';
    end if;
    if v_review_type in ('rights', 'asset-rights') and not exists (
      select 1
        from public.gfield_math_private_review_records r,
             jsonb_array_elements(p_manifest_payload->'rightsBindings') as e(rb)
       where r.review_id = v_binding->>'reviewId'
         and rb->>'rightsRecordId' = r.review_payload->>'rightsRecordId'
         and rb->>'rightsRecordSha256' = r.review_payload->>'reviewedRightsHash'
    ) then
      raise exception 'GFIELD rights review does not bind manifest rights evidence';
    end if;

    perform 1
      from public.gfield_math_accounts a
     where a.user_id = v_reviewer_id
       and a.user_id <> p_expected_author_user_id
       and a.role in ('teacher', 'admin')
       and a.status = 'active'
       for update;
    if not found then
      raise exception 'GFIELD review account is no longer authorized';
    end if;

    perform 1
      from public.gfield_math_reviewer_credentials c
     where c.user_id = v_reviewer_id
       and c.reviewer_role = v_expected_role
       and c.credential_version = v_credential_version
       and c.status = 'active'
       and c.approved_by = (v_binding->>'credentialApprovedBy')::uuid
       and c.approved_at = (v_binding->>'credentialApprovedAt')::timestamptz
       and c.approved_at <= v_reviewed_at
       and c.approved_at <= p_signed_at
       and c.approved_at <= clock_timestamp()
       and (
         (c.expires_at is null and v_binding->>'credentialExpiresAt' is null)
         or (
           c.expires_at = (v_binding->>'credentialExpiresAt')::timestamptz
           and c.expires_at > v_reviewed_at
           and c.expires_at > clock_timestamp()
         )
       )
       for update;
    if not found then
      raise exception 'GFIELD reviewer credential is invalid or expired';
    end if;
    perform 1
      from public.gfield_math_accounts a
     where a.user_id = (v_binding->>'credentialApprovedBy')::uuid
       and a.user_id <> v_reviewer_id
       and a.role = 'admin'
       and a.status = 'active'
       for update;
    if not found then
      raise exception 'GFIELD reviewer credential approver is no longer authorized';
    end if;
    if exists (
      select 1
        from public.gfield_math_reviewer_credential_revocations x
       where x.user_id = v_reviewer_id
         and x.reviewer_role = v_expected_role
         and x.credential_version = v_credential_version
    ) then
      raise exception 'GFIELD reviewer credential was revoked';
    end if;
  end loop;

  foreach v_required_type in array array[
    'math-correctness', 'age-appropriateness', 'answer-uniqueness',
    'translation-ko', 'translation-en', 'rights', 'scoring-rubric',
    'student-payload-safety'
  ]::text[]
  loop
    if not exists (
      select 1
        from jsonb_array_elements(p_manifest_payload->'reviewBindings') as e(entry)
       where entry->>'type' = v_required_type
    ) then
      raise exception 'GFIELD required review type is missing';
    end if;
  end loop;

  if jsonb_typeof(p_expected_public_payload->'assets') is distinct from 'array' then
    raise exception 'GFIELD public asset list is invalid';
  end if;
  if jsonb_array_length(p_expected_public_payload->'assets') <> 0 then
    raise exception 'GFIELD asset bytes are not yet server-verifiable';
  end if;
  if p_expected_public_payload::text like '%"zh-Hans"%' and not exists (
    select 1
      from jsonb_array_elements(p_manifest_payload->'reviewBindings') as e(entry)
     where entry->>'type' = 'translation-zh-Hans'
  ) then
    raise exception 'GFIELD Chinese translation review is missing';
  end if;

  -- Re-evaluate all immutable expiries and revocations at one final database
  -- timestamp after every mutable authorization row has been locked.
  v_authorized_at := clock_timestamp();
  for v_binding in
    select entry
      from jsonb_array_elements(p_manifest_payload->'rightsBindings') as e(entry)
    union all
    select entry
      from jsonb_array_elements(p_manifest_payload->'reviewBindings') as e(entry)
  loop
    if exists (
      select 1
        from public.gfield_math_reviewer_credentials c
       where c.user_id = (v_binding->>'reviewerUserId')::uuid
         and c.reviewer_role = v_binding->>'reviewerRole'
         and c.credential_version = (v_binding->>'reviewerCredentialVersion')::integer
         and c.expires_at is not null
         and c.expires_at <= v_authorized_at
    ) or exists (
      select 1
        from public.gfield_math_reviewer_credential_revocations x
       where x.user_id = (v_binding->>'reviewerUserId')::uuid
         and x.reviewer_role = v_binding->>'reviewerRole'
         and x.credential_version = (v_binding->>'reviewerCredentialVersion')::integer
    ) then
      raise exception 'GFIELD reviewer authorization expired before commit';
    end if;
  end loop;
  for v_binding in
    select entry
      from jsonb_array_elements(p_manifest_payload->'rightsBindings') as e(entry)
  loop
    if exists (
      select 1
        from public.gfield_math_private_rights_records r
       where r.rights_record_id = v_binding->>'rightsRecordId'
         and r.rights_version = (v_binding->>'rightsVersion')::integer
         and r.expires_at is not null
         and r.expires_at <= v_authorized_at
    ) then
      raise exception 'GFIELD rights authorization expired before commit';
    end if;
  end loop;

  update public.gfield_math_private_item_revisions
     set release_state = 'signed', updated_at = p_signed_at
   where item_id = p_item_id
     and item_version = p_item_version
     and author_user_id = p_expected_author_user_id
     and program_id = p_expected_program_id
     and target_grade = p_expected_target_grade
     and visibility_class = p_expected_visibility_class
     and public_payload = p_expected_public_payload
     and private_scoring_payload = p_expected_private_scoring_payload
     and rubric_payload is not distinct from p_expected_rubric_payload
     and public_payload_sha256 = p_expected_public_payload_sha256
     and private_scoring_sha256 = p_expected_private_scoring_sha256
     and rubric_sha256 is not distinct from p_expected_rubric_sha256
     and release_state = 'in-review';
  if not found then
    raise exception 'GFIELD item revision changed after verification or was not ready to sign';
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

revoke all on function gfield_math_internal.commit_signed_release(
  text, text, integer, uuid, text, text, text, jsonb, jsonb, jsonb,
  text, text, text, jsonb, text, text, text, text, uuid, timestamptz, text
) from public, anon, authenticated, service_role;
grant execute on function gfield_math_internal.commit_signed_release(
  text, text, integer, uuid, text, text, text, jsonb, jsonb, jsonb,
  text, text, text, jsonb, text, text, text, text, uuid, timestamptz, text
) to service_role;

create function public.gfield_math_commit_signed_release(
  p_release_id text,
  p_item_id text,
  p_item_version integer,
  p_expected_author_user_id uuid,
  p_expected_program_id text,
  p_expected_target_grade text,
  p_expected_visibility_class text,
  p_expected_public_payload jsonb,
  p_expected_private_scoring_payload jsonb,
  p_expected_rubric_payload jsonb,
  p_expected_public_payload_sha256 text,
  p_expected_private_scoring_sha256 text,
  p_expected_rubric_sha256 text,
  p_manifest_payload jsonb,
  p_manifest_sha256 text,
  p_manifest_canonical_json text,
  p_signature_base64url text,
  p_signing_key_id text,
  p_signed_by uuid,
  p_signed_at timestamptz,
  p_commit_proof_base64url text
)
returns boolean
language sql
security invoker
set search_path = pg_catalog, pg_temp
as $$
  select gfield_math_internal.commit_signed_release(
    p_release_id,
    p_item_id,
    p_item_version,
    p_expected_author_user_id,
    p_expected_program_id,
    p_expected_target_grade,
    p_expected_visibility_class,
    p_expected_public_payload,
    p_expected_private_scoring_payload,
    p_expected_rubric_payload,
    p_expected_public_payload_sha256,
    p_expected_private_scoring_sha256,
    p_expected_rubric_sha256,
    p_manifest_payload,
    p_manifest_sha256,
    p_manifest_canonical_json,
    p_signature_base64url,
    p_signing_key_id,
    p_signed_by,
    p_signed_at,
    p_commit_proof_base64url
  );
$$;

revoke all on function public.gfield_math_commit_signed_release(
  text, text, integer, uuid, text, text, text, jsonb, jsonb, jsonb,
  text, text, text, jsonb, text, text, text, text, uuid, timestamptz, text
) from public, anon, authenticated;
grant execute on function public.gfield_math_commit_signed_release(
  text, text, integer, uuid, text, text, text, jsonb, jsonb, jsonb,
  text, text, text, jsonb, text, text, text, text, uuid, timestamptz, text
) to service_role;

comment on function gfield_math_internal.commit_signed_release(
  text, text, integer, uuid, text, text, text, jsonb, jsonb, jsonb,
  text, text, text, jsonb, text, text, text, text, uuid, timestamptz, text
) is
  'Uses a Vault-backed HMAC proof, then atomically revalidates and row-locks the exact release evidence before commit.';

comment on function public.gfield_math_commit_signed_release(
  text, text, integer, uuid, text, text, text, jsonb, jsonb, jsonb,
  text, text, text, jsonb, text, text, text, text, uuid, timestamptz, text
) is
  'SECURITY INVOKER RPC wrapper for the non-exposed GFIELD signed-release commit function.';

commit;
