-- Verified source exams can exclude ambiguous questions while preserving their
-- original page and question numbers. Marks are therefore a validated sparse
-- set of original numbers, not an artificial 1..question_count sequence.
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

  select attempt.* into v_attempt
  from public.hf_mock_attempts as attempt
  where attempt.id = p_attempt_id and attempt.student_id = p_student_id;
  if not found then
    raise exception 'attempt not available' using errcode = '42501';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(v_attempt.student_id::text || ':' || v_attempt.mock_exam_id::text, 0)
  );
  select attempt.* into v_attempt
  from public.hf_mock_attempts as attempt
  where attempt.id = p_attempt_id and attempt.student_id = p_student_id
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
       from jsonb_each(p_marks) as mark(key, value)
       where mark.key !~ '^(?:[1-9]|[1-9][0-9]|100)$'
          or jsonb_typeof(mark.value) <> 'string'
          or mark.value #>> '{}' not in ('o', 'x')
     ) then
    raise exception 'marks must contain one O/X value per scoring question' using errcode = '22023';
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
    select 1 from public.hf_mock_attempts as attempt
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

-- A reload never spends a paid attempt. Attempts 2 and 3 exist only after the
-- student confirms a dedicated retake action carrying an idempotency UUID.
create or replace function public.hf_start_mock_retake(
  p_student_id uuid,
  p_mock_exam_id uuid,
  p_manifest_asset_id uuid,
  p_manifest_revision integer,
  p_question_count integer,
  p_retake_event_id uuid
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
  v_latest public.hf_mock_attempts%rowtype;
  v_next_attempt integer;
  v_seed bigint;
begin
  if current_user <> 'service_role' then
    raise exception 'service role required' using errcode = '42501';
  end if;
  if p_student_id is null or p_mock_exam_id is null or p_manifest_asset_id is null
     or p_retake_event_id is null or p_manifest_revision not between 1 and 32767
     or p_question_count not between 1 and 100 then
    raise exception 'invalid retake request' using errcode = '22023';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_student_id::text || ':' || p_mock_exam_id::text, 0)
  );
  if not hf_private.has_active_mock_access(p_student_id, p_mock_exam_id) then
    raise exception 'active mock entitlement required' using errcode = '42501';
  end if;
  if not exists (
    select 1 from public.hf_mock_exams as exam
    where exam.id = p_mock_exam_id and exam.current_revision = p_manifest_revision
  ) or not exists (
    select 1 from public.hf_mock_assets as asset
    where asset.id = p_manifest_asset_id
      and asset.mock_exam_id = p_mock_exam_id
      and asset.revision = p_manifest_revision
      and asset.asset_kind = 'manifest'
  ) then
    raise exception 'published manifest revision mismatch' using errcode = '22023';
  end if;

  select attempt.* into v_attempt
  from public.hf_mock_attempts as attempt
  where attempt.student_id = p_student_id
    and attempt.client_event_id = p_retake_event_id
  for update;
  if found then
    if v_attempt.mock_exam_id <> p_mock_exam_id
       or v_attempt.manifest_asset_id <> p_manifest_asset_id
       or v_attempt.manifest_revision <> p_manifest_revision
       or v_attempt.question_count <> p_question_count
       or v_attempt.attempt_no < 2 then
      raise exception 'retake event idempotency conflict' using errcode = '23505';
    end if;
    return query select v_attempt.id, v_attempt.attempt_no, v_attempt.seed,
      v_attempt.manifest_revision, v_attempt.status, v_attempt.started_at;
    return;
  end if;

  select attempt.* into v_attempt
  from public.hf_mock_attempts as attempt
  where attempt.student_id = p_student_id
    and attempt.mock_exam_id = p_mock_exam_id
    and attempt.status in ('in_progress', 'grading')
  order by attempt.attempt_no desc limit 1 for update;
  if found then
    if v_attempt.manifest_asset_id <> p_manifest_asset_id
       or v_attempt.manifest_revision <> p_manifest_revision
       or v_attempt.question_count <> p_question_count then
      raise exception 'active attempt is bound to another revision' using errcode = '55000';
    end if;
    return query select v_attempt.id, v_attempt.attempt_no, v_attempt.seed,
      v_attempt.manifest_revision, v_attempt.status, v_attempt.started_at;
    return;
  end if;

  select attempt.* into v_latest
  from public.hf_mock_attempts as attempt
  where attempt.student_id = p_student_id and attempt.mock_exam_id = p_mock_exam_id
  order by attempt.attempt_no desc limit 1 for update;
  if not found or v_latest.status <> 'submitted' then
    raise exception 'completed previous attempt required' using errcode = '55000';
  end if;
  v_next_attempt := v_latest.attempt_no + 1;
  if v_next_attempt not between 2 and 3 then
    raise exception 'retake limit reached' using errcode = '55000';
  end if;

  v_seed := pg_catalog.hashtextextended(pg_catalog.gen_random_uuid()::text, 0)
    & 2147483647::bigint;
  insert into public.hf_mock_attempts(
    student_id, mock_exam_id, attempt_no, seed, question_count,
    manifest_revision, manifest_asset_id, grading_mode, client_event_id
  ) values (
    p_student_id, p_mock_exam_id, v_next_attempt::smallint, v_seed,
    p_question_count::smallint, p_manifest_revision, p_manifest_asset_id,
    'self_reported', p_retake_event_id
  ) returning * into v_attempt;

  return query select v_attempt.id, v_attempt.attempt_no, v_attempt.seed,
    v_attempt.manifest_revision, v_attempt.status, v_attempt.started_at;
end;
$$;

revoke all on function public.hf_start_mock_retake(uuid, uuid, uuid, integer, integer, uuid) from public;
revoke all on function public.hf_start_mock_retake(uuid, uuid, uuid, integer, integer, uuid) from anon;
revoke all on function public.hf_start_mock_retake(uuid, uuid, uuid, integer, integer, uuid) from authenticated;
grant execute on function public.hf_start_mock_retake(uuid, uuid, uuid, integer, integer, uuid) to service_role;
