begin;

-- A published exam always points at one immutable delivery revision. Assets are
-- immutable within that revision; replacing content requires a new revision.
alter table public.hf_mock_exams
  add column current_revision integer not null default 1
    constraint hf_mock_exams_current_revision_check
    check (current_revision between 1 and 32767);

alter table public.hf_mock_assets
  add column revision integer not null default 1
    constraint hf_mock_assets_revision_check
    check (revision between 1 and 32767),
  add column sha256 text not null
    constraint hf_mock_assets_sha256_check
    check (sha256 ~ '^[0-9a-f]{64}$'),
  add column byte_size bigint not null
    constraint hf_mock_assets_byte_size_check
    check (byte_size between 1 and 104857600);

create unique index hf_mock_assets_revision_singleton_idx
  on public.hf_mock_assets(mock_exam_id, revision, asset_kind)
  where asset_kind in ('manifest', 'answer');

create index hf_mock_assets_exam_revision_kind_idx
  on public.hf_mock_assets(mock_exam_id, revision, asset_kind);

create unique index hf_mock_assets_identity_revision_idx
  on public.hf_mock_assets(id, mock_exam_id, revision);

-- Attempts bind to the exact problem manifest that was delivered. The browser
-- never writes these columns directly.
alter table public.hf_mock_attempts
  add column manifest_revision integer not null
    constraint hf_mock_attempts_manifest_revision_check
    check (manifest_revision between 1 and 32767),
  add column manifest_asset_id uuid not null
    references public.hf_mock_assets(id) on delete restrict,
  add column grading_mode text not null default 'self_reported'
    constraint hf_mock_attempts_grading_mode_check
    check (grading_mode = 'self_reported'),
  add column answers_viewed_at timestamptz,
  add column submission_event_id uuid,
  add column submission_digest text,
  add column wrong_question_keys text[] not null default '{}'::text[],
  add column wrong_type_keys text[] not null default '{}'::text[];

alter table public.hf_mock_attempts
  add constraint hf_mock_attempts_manifest_binding_fk
  foreign key (manifest_asset_id, mock_exam_id, manifest_revision)
  references public.hf_mock_assets(id, mock_exam_id, revision)
  on delete restrict;

alter table public.hf_mock_attempts
  drop constraint hf_mock_attempts_status_check,
  add constraint hf_mock_attempts_status_check
    check (status in ('in_progress', 'grading', 'submitted', 'review_pending')),
  add constraint hf_mock_attempts_marks_object_check
    check (jsonb_typeof(marks) = 'object'),
  add constraint hf_mock_attempts_answers_viewed_check
    check (
      answers_viewed_at is null
      or answers_viewed_at >= started_at
    ),
  add constraint hf_mock_attempts_grading_state_check
    check (
      (status = 'in_progress' and answers_viewed_at is null)
      or (status = 'grading' and answers_viewed_at is not null)
      or status in ('submitted', 'review_pending')
    ),
  add constraint hf_mock_attempts_submission_digest_check
    check (
      submission_digest is null
      or submission_digest ~ '^[0-9a-f]{64}$'
    ),
  add constraint hf_mock_attempts_submission_fields_check
    check (
      status <> 'submitted'
      or (
        submission_event_id is not null
        and submission_digest is not null
        and submitted_at is not null
      )
    );

create index hf_mock_attempts_manifest_asset_idx
  on public.hf_mock_attempts(manifest_asset_id);

create index hf_mock_attempts_exam_revision_idx
  on public.hf_mock_attempts(mock_exam_id, manifest_revision);

create unique index hf_mock_attempts_active_exam_idx
  on public.hf_mock_attempts(student_id, mock_exam_id)
  where status in ('in_progress', 'grading');

create unique index hf_mock_attempts_submission_event_idx
  on public.hf_mock_attempts(student_id, submission_event_id)
  where submission_event_id is not null;

create or replace function hf_private.valid_mock_question_keys(p_value text[])
returns boolean
language sql
immutable
security invoker
set search_path = ''
as $$
  select
    p_value is not null
    and cardinality(p_value) <= 100
    and array_position(p_value, null) is null
    and not exists (
      select 1
      from unnest(p_value) as item(value)
      where item.value !~ '^premier:(utilization|final|last)-[0-9]{2}:q[0-9]{2}$'
    )
    and cardinality(p_value) = (
      select count(distinct item.value)::integer
      from unnest(p_value) as item(value)
    );
$$;

create or replace function hf_private.valid_mock_type_keys(p_value text[])
returns boolean
language sql
immutable
security invoker
set search_path = ''
as $$
  select
    p_value is not null
    and cardinality(p_value) <= 100
    and array_position(p_value, null) is null
    and not exists (
      select 1
      from unnest(p_value) as item(value)
      where item.value !~ '^[a-z][a-z0-9-]{1,79}$'
    )
    and cardinality(p_value) = (
      select count(distinct item.value)::integer
      from unnest(p_value) as item(value)
    );
$$;

alter table public.hf_mock_attempts
  add constraint hf_mock_attempts_wrong_question_keys_check
    check (hf_private.valid_mock_question_keys(wrong_question_keys)),
  add constraint hf_mock_attempts_wrong_type_keys_check
    check (hf_private.valid_mock_type_keys(wrong_type_keys));

-- The service-only RPCs repeat the authorization check. This keeps a future
-- Edge refactor from accidentally turning the service key into an IDOR path.
-- Product bundles must provision one active hf_mock_entitlements row for each
-- included exam; a generic product entitlement is intentionally not a pass.
create or replace function hf_private.has_active_mock_access(
  p_student_id uuid,
  p_mock_exam_id uuid
)
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select
    exists (
      select 1
      from public.hf_students as student
      where student.id = p_student_id
        and student.account_status = 'active'
        and student.auth_change_id is null
    )
    and exists (
      select 1
      from public.hf_mock_exams as exam
      where exam.id = p_mock_exam_id
        and exam.status = 'published'
        and exam.published_at <= now()
    )
    and exists (
      select 1
      from public.hf_mock_entitlements as entitlement
      where entitlement.student_id = p_student_id
        and entitlement.mock_exam_id = p_mock_exam_id
        and entitlement.revoked_at is null
        and entitlement.starts_at <= now()
        and (entitlement.expires_at is null or entitlement.expires_at > now())
    );
$$;

create or replace function public.hf_begin_mock_attempt(
  p_student_id uuid,
  p_mock_exam_id uuid,
  p_manifest_asset_id uuid,
  p_manifest_revision integer,
  p_question_count integer,
  p_load_event_id uuid
)
returns table(
  attempt_id uuid,
  attempt_no smallint,
  server_seed bigint,
  manifest_revision integer,
  status text,
  started_at timestamptz
)
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
  v_attempt public.hf_mock_attempts%rowtype;
  v_next_attempt integer;
  v_seed bigint;
begin
  if current_user <> 'service_role' then
    raise exception 'service role required' using errcode = '42501';
  end if;
  if p_student_id is null or p_mock_exam_id is null
     or p_manifest_asset_id is null or p_load_event_id is null
     or p_manifest_revision not between 1 and 32767
     or p_question_count not between 1 and 100 then
    raise exception 'invalid attempt request' using errcode = '22023';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_student_id::text || ':' || p_mock_exam_id::text, 0)
  );

  if not hf_private.has_active_mock_access(p_student_id, p_mock_exam_id) then
    raise exception 'active mock entitlement required' using errcode = '42501';
  end if;
  if not exists (
    select 1
    from public.hf_mock_exams as exam
    where exam.id = p_mock_exam_id
      and exam.current_revision = p_manifest_revision
  ) or not exists (
    select 1
    from public.hf_mock_assets as asset
    where asset.id = p_manifest_asset_id
      and asset.mock_exam_id = p_mock_exam_id
      and asset.revision = p_manifest_revision
      and asset.asset_kind = 'manifest'
  ) then
    raise exception 'published manifest revision mismatch' using errcode = '22023';
  end if;

  select attempt.*
  into v_attempt
  from public.hf_mock_attempts as attempt
  where attempt.student_id = p_student_id
    and attempt.client_event_id = p_load_event_id
  for update;

  if found then
    if v_attempt.status not in ('in_progress', 'grading', 'submitted') then
      raise exception 'load event attempt is not available' using errcode = '55000';
    end if;
    if v_attempt.mock_exam_id <> p_mock_exam_id
       or v_attempt.manifest_asset_id <> p_manifest_asset_id
       or v_attempt.manifest_revision <> p_manifest_revision
       or v_attempt.question_count <> p_question_count then
      raise exception 'load event idempotency conflict' using errcode = '23505';
    end if;
    return query select
      v_attempt.id, v_attempt.attempt_no, v_attempt.seed,
      v_attempt.manifest_revision, v_attempt.status, v_attempt.started_at;
    return;
  end if;

  select attempt.*
  into v_attempt
  from public.hf_mock_attempts as attempt
  where attempt.student_id = p_student_id
    and attempt.mock_exam_id = p_mock_exam_id
    and attempt.status in ('in_progress', 'grading')
  for update;

  if found then
    if v_attempt.manifest_asset_id <> p_manifest_asset_id
       or v_attempt.manifest_revision <> p_manifest_revision
       or v_attempt.question_count <> p_question_count then
      raise exception 'active attempt is bound to another revision' using errcode = '55000';
    end if;
    return query select
      v_attempt.id, v_attempt.attempt_no, v_attempt.seed,
      v_attempt.manifest_revision, v_attempt.status, v_attempt.started_at;
    return;
  end if;

  -- Losing sessionStorage or receiving a fresh client event must never spend
  -- another paid attempt. Resume the latest compatible submitted attempt. Any
  -- other history requires a future explicit retake action, which this RPC
  -- intentionally does not implement.
  select attempt.*
  into v_attempt
  from public.hf_mock_attempts as attempt
  where attempt.student_id = p_student_id
    and attempt.mock_exam_id = p_mock_exam_id
  order by attempt.attempt_no desc
  limit 1
  for update;

  if found then
    if v_attempt.status = 'submitted'
       and v_attempt.manifest_asset_id = p_manifest_asset_id
       and v_attempt.manifest_revision = p_manifest_revision
       and v_attempt.question_count = p_question_count then
      return query select
        v_attempt.id, v_attempt.attempt_no, v_attempt.seed,
        v_attempt.manifest_revision, v_attempt.status, v_attempt.started_at;
      return;
    end if;
    raise exception 'explicit retake required' using errcode = '55000';
  end if;

  select coalesce(max(attempt.attempt_no), 0) + 1
  into v_next_attempt
  from public.hf_mock_attempts as attempt
  where attempt.student_id = p_student_id
    and attempt.mock_exam_id = p_mock_exam_id;

  -- Defense in depth: this entry point may create only the first attempt.
  -- Attempts 2 and 3 require a future, explicit retake RPC.
  if v_next_attempt <> 1 then
    raise exception 'explicit retake required' using errcode = '55000';
  end if;

  -- Keep the seed comfortably inside JavaScript's exact integer range.
  v_seed := pg_catalog.hashtextextended(pg_catalog.gen_random_uuid()::text, 0)
    & 2147483647::bigint;

  insert into public.hf_mock_attempts(
    student_id, mock_exam_id, attempt_no, seed, question_count,
    manifest_revision, manifest_asset_id, grading_mode, client_event_id
  ) values (
    p_student_id, p_mock_exam_id, v_next_attempt::smallint, v_seed,
    p_question_count::smallint, p_manifest_revision, p_manifest_asset_id,
    'self_reported', p_load_event_id
  )
  returning * into v_attempt;

  return query select
    v_attempt.id, v_attempt.attempt_no, v_attempt.seed,
    v_attempt.manifest_revision, v_attempt.status, v_attempt.started_at;
end;
$$;

create or replace function public.hf_reveal_mock_answers(
  p_student_id uuid,
  p_attempt_id uuid
)
returns table(
  attempt_id uuid,
  mock_exam_id uuid,
  manifest_revision integer,
  status text,
  answers_viewed_at timestamptz
)
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
  v_attempt public.hf_mock_attempts%rowtype;
begin
  if current_user <> 'service_role' then
    raise exception 'service role required' using errcode = '42501';
  end if;
  if p_student_id is null or p_attempt_id is null then
    raise exception 'invalid answer request' using errcode = '22023';
  end if;

  select attempt.*
  into v_attempt
  from public.hf_mock_attempts as attempt
  where attempt.id = p_attempt_id
    and attempt.student_id = p_student_id;
  if not found then
    raise exception 'attempt not available' using errcode = '42501';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(v_attempt.student_id::text || ':' || v_attempt.mock_exam_id::text, 0)
  );
  select attempt.*
  into v_attempt
  from public.hf_mock_attempts as attempt
  where attempt.id = p_attempt_id
    and attempt.student_id = p_student_id
  for update;

  if not hf_private.has_active_mock_access(p_student_id, v_attempt.mock_exam_id) then
    raise exception 'active mock entitlement required' using errcode = '42501';
  end if;
  if not exists (
    select 1
    from public.hf_mock_assets as asset
    where asset.id = v_attempt.manifest_asset_id
      and asset.mock_exam_id = v_attempt.mock_exam_id
      and asset.revision = v_attempt.manifest_revision
      and asset.asset_kind = 'manifest'
  ) or not exists (
    select 1
    from public.hf_mock_assets as asset
    where asset.mock_exam_id = v_attempt.mock_exam_id
      and asset.revision = v_attempt.manifest_revision
      and asset.asset_kind = 'answer'
  ) then
    raise exception 'answer revision is not available' using errcode = '55000';
  end if;
  if v_attempt.status not in ('in_progress', 'grading', 'submitted') then
    raise exception 'attempt cannot reveal answers' using errcode = '55000';
  end if;

  if v_attempt.status = 'in_progress' then
    update public.hf_mock_attempts as attempt
    set status = 'grading',
        answers_viewed_at = coalesce(attempt.answers_viewed_at, clock_timestamp())
    where attempt.id = v_attempt.id
    returning * into v_attempt;
  elsif v_attempt.status = 'submitted' and v_attempt.answers_viewed_at is null then
    -- A video-guided direct submission may reveal answers afterwards. Preserve
    -- the submitted receipt and grading result; only record the reveal gate.
    update public.hf_mock_attempts as attempt
    set answers_viewed_at = clock_timestamp()
    where attempt.id = v_attempt.id
    returning * into v_attempt;
  elsif v_attempt.status = 'grading' and v_attempt.answers_viewed_at is null then
    raise exception 'attempt answer state is invalid' using errcode = '55000';
  end if;

  return query select
    v_attempt.id, v_attempt.mock_exam_id, v_attempt.manifest_revision,
    v_attempt.status, v_attempt.answers_viewed_at;
end;
$$;

create or replace function public.hf_submit_mock_attempt(
  p_student_id uuid,
  p_attempt_id uuid,
  p_submission_event_id uuid,
  p_submission_digest text,
  p_marks jsonb,
  p_correct_count integer,
  p_wrong_question_keys text[],
  p_wrong_type_keys text[]
)
returns table(
  attempt_id uuid,
  attempt_no smallint,
  status text,
  correct_count smallint,
  question_count smallint,
  score smallint,
  wrong_question_keys text[],
  wrong_type_keys text[],
  submitted_at timestamptz
)
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
  v_attempt public.hf_mock_attempts%rowtype;
  v_derived_correct integer;
  v_derived_wrong integer;
begin
  if current_user <> 'service_role' then
    raise exception 'service role required' using errcode = '42501';
  end if;
  if p_student_id is null or p_attempt_id is null or p_submission_event_id is null
     or p_submission_digest !~ '^[0-9a-f]{64}$'
     or p_marks is null or jsonb_typeof(p_marks) <> 'object'
     or octet_length(p_marks::text) > 65536
     or not hf_private.valid_mock_question_keys(p_wrong_question_keys)
     or not hf_private.valid_mock_type_keys(p_wrong_type_keys) then
    raise exception 'invalid submission request' using errcode = '22023';
  end if;

  select attempt.*
  into v_attempt
  from public.hf_mock_attempts as attempt
  where attempt.id = p_attempt_id
    and attempt.student_id = p_student_id;
  if not found then
    raise exception 'attempt not available' using errcode = '42501';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(v_attempt.student_id::text || ':' || v_attempt.mock_exam_id::text, 0)
  );
  select attempt.*
  into v_attempt
  from public.hf_mock_attempts as attempt
  where attempt.id = p_attempt_id
    and attempt.student_id = p_student_id
  for update;

  if not hf_private.has_active_mock_access(p_student_id, v_attempt.mock_exam_id) then
    raise exception 'active mock entitlement required' using errcode = '42501';
  end if;
  if not exists (
    select 1
    from public.hf_mock_assets as asset
    join public.hf_mock_exams as exam on exam.id = asset.mock_exam_id
    where asset.id = v_attempt.manifest_asset_id
      and asset.mock_exam_id = v_attempt.mock_exam_id
      and asset.revision = v_attempt.manifest_revision
      and asset.asset_kind = 'manifest'
      and exam.status = 'published'
      and exam.published_at <= now()
  ) then
    raise exception 'attempt manifest revision mismatch' using errcode = '55000';
  end if;

  if v_attempt.status = 'submitted' then
    if v_attempt.submission_event_id = p_submission_event_id
       and v_attempt.submission_digest = p_submission_digest
       and v_attempt.marks = p_marks
       and v_attempt.correct_count = p_correct_count
       and v_attempt.wrong_question_keys = p_wrong_question_keys
       and v_attempt.wrong_type_keys = p_wrong_type_keys then
      return query select
        v_attempt.id, v_attempt.attempt_no, v_attempt.status,
        v_attempt.correct_count, v_attempt.question_count, v_attempt.score,
        v_attempt.wrong_question_keys, v_attempt.wrong_type_keys,
        v_attempt.submitted_at;
      return;
    end if;
    raise exception 'submission idempotency conflict' using errcode = '23505';
  end if;

  if not (
    (v_attempt.status = 'in_progress' and v_attempt.answers_viewed_at is null)
    or (v_attempt.status = 'grading' and v_attempt.answers_viewed_at is not null)
  ) then
    raise exception 'attempt cannot be submitted from current grading state' using errcode = '55000';
  end if;
  if (select count(*) from pg_catalog.jsonb_object_keys(p_marks)) <> v_attempt.question_count
     or exists (
       select 1
       from generate_series(1, v_attempt.question_count) as expected(number)
       where not (p_marks ? expected.number::text)
     )
     or exists (
       select 1
       from jsonb_each(p_marks) as mark(key, value)
       where jsonb_typeof(mark.value) <> 'string'
          or mark.value #>> '{}' not in ('o', 'x')
     ) then
    raise exception 'marks must contain one O/X value per question' using errcode = '22023';
  end if;

  select
    count(*) filter (where mark.value #>> '{}' = 'o'),
    count(*) filter (where mark.value #>> '{}' = 'x')
  into v_derived_correct, v_derived_wrong
  from jsonb_each(p_marks) as mark(key, value);

  if p_correct_count <> v_derived_correct
     or cardinality(p_wrong_question_keys) <> v_derived_wrong then
    raise exception 'derived grading values do not match marks' using errcode = '22023';
  end if;
  if exists (
    select 1
    from public.hf_mock_attempts as attempt
    where attempt.student_id = p_student_id
      and attempt.submission_event_id = p_submission_event_id
      and attempt.id <> v_attempt.id
  ) then
    raise exception 'submission event already used' using errcode = '23505';
  end if;

  update public.hf_mock_attempts as attempt
  set marks = p_marks,
      correct_count = p_correct_count::smallint,
      wrong_question_keys = p_wrong_question_keys,
      wrong_type_keys = p_wrong_type_keys,
      submission_event_id = p_submission_event_id,
      submission_digest = p_submission_digest,
      status = 'submitted',
      submitted_at = clock_timestamp()
  where attempt.id = v_attempt.id
  returning * into v_attempt;

  return query select
    v_attempt.id, v_attempt.attempt_no, v_attempt.status,
    v_attempt.correct_count, v_attempt.question_count, v_attempt.score,
    v_attempt.wrong_question_keys, v_attempt.wrong_type_keys,
    v_attempt.submitted_at;
end;
$$;

-- Asset reads remain RLS-scoped. Answer metadata is visible only after the
-- owner has atomically revealed answers for the exact manifest revision.
drop policy hf_mock_exams_entitled_select on public.hf_mock_exams;
create policy hf_mock_exams_entitled_select
on public.hf_mock_exams for select to authenticated
using (
  status = 'published'
  and published_at <= now()
  and (select hf_private.is_active_student())
  and exists (
    select 1 from public.hf_mock_entitlements as entitlement
    where entitlement.student_id = (select auth.uid())
      and entitlement.mock_exam_id = hf_mock_exams.id
      and entitlement.revoked_at is null
      and entitlement.starts_at <= now()
      and (entitlement.expires_at is null or entitlement.expires_at > now())
  )
);

drop policy hf_mock_assets_entitled_select on public.hf_mock_assets;
create policy hf_mock_assets_entitled_select
on public.hf_mock_assets for select to authenticated
using (
  (select hf_private.is_active_student())
  and exists (
    select 1
    from public.hf_mock_exams as exam
    where exam.id = hf_mock_assets.mock_exam_id
      and exam.status = 'published'
      and exam.published_at <= now()
      and exists (
        select 1 from public.hf_mock_entitlements as entitlement
        where entitlement.student_id = (select auth.uid())
          and entitlement.mock_exam_id = exam.id
          and entitlement.revoked_at is null
          and entitlement.starts_at <= now()
          and (entitlement.expires_at is null or entitlement.expires_at > now())
      )
      and (
        (
          hf_mock_assets.asset_kind in ('manifest', 'question', 'cover')
          and hf_mock_assets.revision = exam.current_revision
        )
        or (
          hf_mock_assets.asset_kind in ('answer', 'explanation')
          and exists (
            select 1
            from public.hf_mock_attempts as attempt
            where attempt.student_id = (select auth.uid())
              and attempt.mock_exam_id = exam.id
              and attempt.manifest_revision = hf_mock_assets.revision
              and attempt.answers_viewed_at is not null
              and attempt.status in ('grading', 'submitted')
          )
        )
      )
  )
);

-- Data API writes remain forbidden even if auto-exposure settings change.
revoke insert, update, delete, truncate on table
  public.hf_mock_exams,
  public.hf_mock_entitlements,
  public.hf_mock_assets,
  public.hf_mock_attempts
from public, anon, authenticated;

-- Authenticated callers may prove an asset row through RLS, but storage
-- bucket/object paths remain visible only to the service role.
revoke select on table public.hf_mock_assets from authenticated;
grant select (
  id, mock_exam_id, asset_kind, mime_type, created_at,
  revision, sha256, byte_size
) on public.hf_mock_assets to authenticated;

revoke execute on function hf_private.valid_mock_question_keys(text[])
from public, anon, authenticated;
revoke execute on function hf_private.valid_mock_type_keys(text[])
from public, anon, authenticated;
revoke execute on function hf_private.has_active_mock_access(uuid, uuid)
from public, anon, authenticated;
grant execute on function hf_private.valid_mock_question_keys(text[]) to service_role;
grant execute on function hf_private.valid_mock_type_keys(text[]) to service_role;
grant execute on function hf_private.has_active_mock_access(uuid, uuid) to service_role;

revoke execute on function public.hf_begin_mock_attempt(uuid, uuid, uuid, integer, integer, uuid)
from public, anon, authenticated;
revoke execute on function public.hf_reveal_mock_answers(uuid, uuid)
from public, anon, authenticated;
revoke execute on function public.hf_submit_mock_attempt(uuid, uuid, uuid, text, jsonb, integer, text[], text[])
from public, anon, authenticated;
grant execute on function public.hf_begin_mock_attempt(uuid, uuid, uuid, integer, integer, uuid)
to service_role;
grant execute on function public.hf_reveal_mock_answers(uuid, uuid)
to service_role;
grant execute on function public.hf_submit_mock_attempt(uuid, uuid, uuid, text, jsonb, integer, text[], text[])
to service_role;

commit;
