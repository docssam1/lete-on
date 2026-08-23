begin;

create schema if not exists hf_private;
revoke all on schema hf_private from public, anon, authenticated;

create table public.hf_students (
  id uuid primary key references auth.users(id) on delete restrict,
  login_handle text not null unique
    check (login_handle ~ '^[a-z0-9]{4,12}$'),
  display_name text not null
    check (char_length(btrim(display_name)) between 1 and 80),
  login_name_key text not null
    check (
      char_length(login_name_key) between 1 and 120
      and login_name_key = lower(login_name_key)
      and login_name_key !~ '[[:space:]]'
    ),
  login_version integer not null default 1 check (login_version > 0),
  credentials_rotated_at timestamptz not null default now(),
  auth_change_id uuid,
  auth_change_started_at timestamptz,
  auth_change_version integer,
  auth_change_status text
    check (auth_change_status in ('active', 'suspended', 'archived')),
  student_type text not null
    check (student_type in ('internal', 'online')),
  account_status text not null default 'active'
    check (account_status in ('active', 'suspended', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (
      auth_change_id is null
      and auth_change_started_at is null
      and auth_change_version is null
      and auth_change_status is null
    )
    or (
      auth_change_id is not null
      and auth_change_started_at is not null
      and auth_change_version is not null
      and auth_change_version = login_version + 1
      and auth_change_status is not null
    )
  )
);

create index hf_students_status_idx
  on public.hf_students(account_status);

create table public.hf_admin_accounts (
  user_id uuid primary key references auth.users(id) on delete restrict,
  role text not null check (role in ('admin', 'content_editor')),
  account_status text not null default 'active'
    check (account_status in ('active', 'suspended', 'archived')),
  authorization_changed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function hf_private.is_staff(p_roles text[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    coalesce((select auth.jwt() -> 'app_metadata' ->> 'hf_role'), '') = any(p_roles)
    and coalesce((select auth.jwt() ->> 'aal'), '') = 'aal2'
    and exists (
      select 1
      from public.hf_admin_accounts a
      join auth.sessions sess
        on sess.id = nullif((select auth.jwt() ->> 'session_id'), '')::uuid
       and sess.user_id = a.user_id
      where a.user_id = (select auth.uid())
        and a.account_status = 'active'
        and sess.created_at >= a.authorization_changed_at
        and a.role = coalesce((select auth.jwt() -> 'app_metadata' ->> 'hf_role'), '')
    );
$$;

create or replace function hf_private.is_active_student()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    coalesce((select auth.jwt() -> 'app_metadata' ->> 'hf_role'), '') = 'student'
    and not coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false)
    and exists (
      select 1
      from public.hf_students s
      join auth.sessions sess
        on sess.id = nullif((select auth.jwt() ->> 'session_id'), '')::uuid
       and sess.user_id = s.id
      where s.id = (select auth.uid())
        and s.account_status = 'active'
        and s.auth_change_id is null
        and sess.created_at >= s.credentials_rotated_at
        and s.login_version = coalesce(
          ((select auth.jwt() -> 'app_metadata' ->> 'hf_login_version'))::integer,
          0
        )
    );
$$;

create or replace function public.hf_begin_student_auth_change(
  p_student_id uuid,
  p_expected_version integer,
  p_operation_id uuid,
  p_account_status text default null
)
returns table(pending_login_version integer, operation_started_at timestamptz)
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
  v_now timestamptz := clock_timestamp();
begin
  if p_operation_id is null then
    raise exception 'operation id required' using errcode = '22023';
  end if;
  if p_account_status is not null
     and p_account_status not in ('active', 'suspended', 'archived') then
    raise exception 'invalid account status' using errcode = '22023';
  end if;

  return query
  update public.hf_students as student
  set
    auth_change_id = p_operation_id,
    auth_change_started_at = v_now,
    auth_change_version = student.login_version + 1,
    auth_change_status = coalesce(p_account_status, student.account_status)
  where student.id = p_student_id
    and student.login_version = p_expected_version
    and (
      student.auth_change_id is null
      or student.auth_change_started_at < v_now - interval '15 minutes'
    )
  returning student.auth_change_version, student.auth_change_started_at;
end;
$$;

create or replace function public.hf_complete_student_auth_change(
  p_student_id uuid,
  p_operation_id uuid,
  p_pending_version integer
)
returns table(new_login_version integer, rotated_at timestamptz)
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
  v_now timestamptz := clock_timestamp();
begin
  return query
  update public.hf_students as student
  set
    login_version = student.auth_change_version,
    credentials_rotated_at = v_now,
    account_status = student.auth_change_status,
    auth_change_id = null,
    auth_change_started_at = null,
    auth_change_version = null,
    auth_change_status = null
  where student.id = p_student_id
    and student.auth_change_id = p_operation_id
    and student.auth_change_version = p_pending_version
  returning student.login_version, student.credentials_rotated_at;
end;
$$;

create or replace function public.hf_cancel_student_auth_change(
  p_student_id uuid,
  p_operation_id uuid,
  p_pending_version integer
)
returns boolean
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
  v_changed integer;
begin
  update public.hf_students as student
  set
    auth_change_id = null,
    auth_change_started_at = null,
    auth_change_version = null,
    auth_change_status = null
  where student.id = p_student_id
    and student.auth_change_id = p_operation_id
    and student.auth_change_version = p_pending_version;
  get diagnostics v_changed = row_count;
  return v_changed = 1;
end;
$$;

create table public.hf_permission_catalog (
  permission_key text primary key,
  label text not null,
  description text not null default ''
);

insert into public.hf_permission_catalog(permission_key, label, description) values
  ('hyperfocus', 'Hyper Focus 문항 진단', '54개 유형 진단과 기본 맞춤 문제'),
  ('hyperfocus-extra', '유형별 추가 문제', '난이도별 무료 2문항을 넘는 추가 문제'),
  ('mock', '온라인 모의고사', '승인된 프리미어 모의고사'),
  ('vip', 'VIP 라운지', '자료실·설명회·칼럼·교육 매거진'),
  ('problem-bank', '맞춤 문제은행', '선택 유형·난이도 자동 시험지');

create table public.hf_entitlements (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.hf_students(id) on delete restrict,
  permission_key text not null references public.hf_permission_catalog(permission_key),
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  granted_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  check (expires_at is null or expires_at > starts_at),
  check (revoked_at is null or revoked_at >= created_at)
);

create unique index hf_entitlements_current_state_idx
  on public.hf_entitlements(student_id, permission_key);

create index hf_entitlements_lookup_idx
  on public.hf_entitlements(student_id, permission_key, starts_at, expires_at)
  where revoked_at is null;

create index hf_entitlements_granted_by_idx
  on public.hf_entitlements(granted_by);

create or replace function public.hf_set_student_entitlement(
  p_student_id uuid,
  p_permission_key text,
  p_enabled boolean,
  p_granted_by uuid
)
returns boolean
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
  v_now timestamptz := clock_timestamp();
begin
  if p_enabled is null
     or not exists (
       select 1 from public.hf_permission_catalog as permission
       where permission.permission_key = p_permission_key
     ) then
    raise exception 'invalid permission' using errcode = '22023';
  end if;

  if p_enabled then
    insert into public.hf_entitlements(
      student_id, permission_key, starts_at, expires_at, revoked_at, granted_by
    )
    select p_student_id, requested.permission_key, v_now, null, null, p_granted_by
    from unnest(
      case
        when p_permission_key in ('hyperfocus-extra', 'problem-bank')
          then array[p_permission_key, 'hyperfocus']::text[]
        else array[p_permission_key]::text[]
      end
    ) as requested(permission_key)
    on conflict (student_id, permission_key) do update
    set
      starts_at = excluded.starts_at,
      expires_at = null,
      revoked_at = null,
      granted_by = excluded.granted_by;
  else
    update public.hf_entitlements as entitlement
    set
      revoked_at = greatest(v_now, entitlement.created_at),
      granted_by = p_granted_by
    where entitlement.student_id = p_student_id
      and entitlement.permission_key = any(
        case
          when p_permission_key = 'hyperfocus'
            then array['hyperfocus', 'hyperfocus-extra', 'problem-bank']::text[]
          else array[p_permission_key]::text[]
        end
      );
  end if;
  return true;
end;
$$;

create or replace function public.hf_valid_type_ids(
  p_ids smallint[],
  p_max_count integer
)
returns boolean
language sql
immutable
strict
security invoker
set search_path = ''
as $$
  select
    cardinality(p_ids) <= p_max_count
    and coalesce(
      (select bool_and(x between 1 and 54)
       from unnest(p_ids) as u(x)),
      true
    )
    and cardinality(p_ids) = (
      select count(distinct x)::integer
      from unnest(p_ids) as u(x)
    );
$$;

create table public.hf_diagnosis_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.hf_students(id) on delete restrict,
  attempt_no smallint not null check (attempt_no between 1 and 3),
  wrong_type_ids smallint[] not null default '{}'::smallint[],
  wrong_count smallint generated always as (
    cardinality(wrong_type_ids)::smallint
  ) stored,
  rate smallint generated always as (
    round(((54 - cardinality(wrong_type_ids))::numeric * 100) / 54)::smallint
  ) stored,
  record_mode text not null default 'supabase-auth-v1'
    check (record_mode in ('supabase-auth-v1', 'legacy-import')),
  client_submission_id uuid not null,
  submitted_at timestamptz not null default now(),
  unique(student_id, attempt_no),
  unique(student_id, client_submission_id),
  check (public.hf_valid_type_ids(wrong_type_ids, 54)),
  check (cardinality(wrong_type_ids) <= 20 or record_mode = 'legacy-import')
);

create index hf_diagnosis_student_time_idx
  on public.hf_diagnosis_attempts(student_id, submitted_at desc);

create or replace function public.hf_submit_diagnosis(
  p_attempt_no smallint,
  p_wrong_type_ids smallint[],
  p_client_submission_id uuid
)
returns table(
  attempt_no smallint,
  wrong_type_ids smallint[],
  rate smallint,
  submitted_at timestamptz
)
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_student_id uuid := auth.uid();
  v_existing public.hf_diagnosis_attempts%rowtype;
  v_expected_attempt smallint;
begin
  if v_student_id is null or not hf_private.is_active_student() then
    raise exception 'active student session required' using errcode = '42501';
  end if;
  if p_attempt_no is null
     or p_attempt_no not between 1 and 3
     or p_client_submission_id is null
     or public.hf_valid_type_ids(p_wrong_type_ids, 20) is not true then
    raise exception 'invalid diagnosis submission' using errcode = '22023';
  end if;
  if not exists (
    select 1
    from public.hf_entitlements as entitlement
    where entitlement.student_id = v_student_id
      and entitlement.permission_key = 'hyperfocus'
      and entitlement.revoked_at is null
      and entitlement.starts_at <= now()
      and (entitlement.expires_at is null or entitlement.expires_at > now())
  ) then
    raise exception 'active hyperfocus entitlement required' using errcode = '42501';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(v_student_id::text, 0)
  );

  select attempt.*
  into v_existing
  from public.hf_diagnosis_attempts as attempt
  where attempt.student_id = v_student_id
    and attempt.client_submission_id = p_client_submission_id;
  if found then
    if v_existing.attempt_no <> p_attempt_no
       or v_existing.wrong_type_ids <> p_wrong_type_ids then
      raise exception 'submission id payload mismatch' using errcode = '23505';
    end if;
    return query select
      v_existing.attempt_no,
      v_existing.wrong_type_ids,
      v_existing.rate,
      v_existing.submitted_at;
    return;
  end if;

  select (count(*) + 1)::smallint
  into v_expected_attempt
  from public.hf_diagnosis_attempts as attempt
  where attempt.student_id = v_student_id;
  if p_attempt_no <> v_expected_attempt then
    raise exception 'diagnosis attempts must be sequential' using errcode = '23505';
  end if;

  return query
  insert into public.hf_diagnosis_attempts(
    student_id, attempt_no, wrong_type_ids, record_mode, client_submission_id
  ) values (
    v_student_id, p_attempt_no, p_wrong_type_ids,
    'supabase-auth-v1', p_client_submission_id
  )
  returning
    hf_diagnosis_attempts.attempt_no,
    hf_diagnosis_attempts.wrong_type_ids,
    hf_diagnosis_attempts.rate,
    hf_diagnosis_attempts.submitted_at;
end;
$$;

create or replace function public.hf_import_legacy_diagnosis(
  p_source_id uuid,
  p_source_kind text,
  p_attempts jsonb
)
returns table(import_status text, imported_count smallint)
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_student_id uuid := auth.uid();
  v_attempt_count integer;
  v_distinct_attempt_count integer;
  v_min_attempt integer;
  v_max_attempt integer;
  v_existing_status text;
  v_existing_count smallint;
  v_all_ids_valid boolean;
begin
  if v_student_id is null or not hf_private.is_active_student() then
    raise exception 'active student session required' using errcode = '42501';
  end if;
  if not exists (
    select 1
    from public.hf_entitlements as entitlement
    where entitlement.student_id = v_student_id
      and entitlement.permission_key = 'hyperfocus'
      and entitlement.revoked_at is null
      and entitlement.starts_at <= now()
      and (entitlement.expires_at is null or entitlement.expires_at > now())
  ) then
    raise exception 'active hyperfocus entitlement required' using errcode = '42501';
  end if;
  if p_source_id is null
     or p_source_kind is null
     or p_source_kind not in ('approval-code-v1', 'phone-local-v1') then
    raise exception 'invalid legacy source' using errcode = '22023';
  end if;
  if p_attempts is null
     or jsonb_typeof(p_attempts) <> 'array'
     or jsonb_array_length(p_attempts) not between 1 and 3 then
    raise exception 'invalid legacy attempts' using errcode = '22023';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(v_student_id::text, 0)
  );

  select receipt.status, receipt.attempt_count
  into v_existing_status, v_existing_count
  from public.hf_legacy_import_receipts as receipt
  where receipt.student_id = v_student_id
    and receipt.source_kind = p_source_kind;
  if found then
    return query select v_existing_status, v_existing_count;
    return;
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_attempts) as source(item)
    where jsonb_typeof(source.item) <> 'object'
       or coalesce(source.item ->> 'attempt', '') !~ '^[1-3]$'
       or jsonb_typeof(source.item -> 'wrongIds') is distinct from 'array'
  ) then
    raise exception 'invalid legacy attempt shape' using errcode = '22023';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_attempts) as source(item)
    where jsonb_array_length(source.item -> 'wrongIds') > 54
       or exists (
         select 1
         from jsonb_array_elements(source.item -> 'wrongIds') as wrong(value)
         where jsonb_typeof(wrong.value) <> 'number'
            or wrong.value::text !~ '^[0-9]+$'
       )
  ) then
    raise exception 'invalid legacy wrong ids' using errcode = '22023';
  end if;

  select
    count(*),
    count(distinct (source.item ->> 'attempt')::integer),
    min((source.item ->> 'attempt')::integer),
    max((source.item ->> 'attempt')::integer)
  into v_attempt_count, v_distinct_attempt_count, v_min_attempt, v_max_attempt
  from jsonb_array_elements(p_attempts) as source(item);

  if v_attempt_count <> v_distinct_attempt_count
     or v_min_attempt <> 1
     or v_max_attempt <> v_attempt_count then
    raise exception 'legacy attempts must be sequential' using errcode = '22023';
  end if;

  with incoming as (
    select array(
      select wrong.value::text::smallint
      from jsonb_array_elements(source.item -> 'wrongIds') as wrong(value)
      order by wrong.value::text::integer
    ) as wrong_type_ids
    from jsonb_array_elements(p_attempts) as source(item)
  )
  select bool_and(public.hf_valid_type_ids(incoming.wrong_type_ids, 54))
  into v_all_ids_valid
  from incoming;
  if v_all_ids_valid is not true then
    raise exception 'legacy wrong ids are invalid' using errcode = '22023';
  end if;

  if exists (
    select 1 from public.hf_diagnosis_attempts as attempt
    where attempt.student_id = v_student_id
  ) then
    insert into public.hf_legacy_import_receipts(
      student_id, source_id, source_kind, attempt_count, status, review_note
    ) values (
      v_student_id, p_source_id, p_source_kind, v_attempt_count, 'review_pending',
      '중앙 응시 기록과 겹쳐 자동으로 덮어쓰지 않았습니다.'
    );
    return query select 'review_pending'::text, 0::smallint;
    return;
  end if;

  insert into public.hf_diagnosis_attempts(
    student_id, attempt_no, wrong_type_ids, record_mode,
    client_submission_id, submitted_at
  )
  select
    v_student_id,
    (source.item ->> 'attempt')::smallint,
    array(
      select wrong.value::text::smallint
      from jsonb_array_elements(source.item -> 'wrongIds') as wrong(value)
      order by wrong.value::text::integer
    ),
    'legacy-import',
    gen_random_uuid(),
    clock_timestamp() - make_interval(secs => v_attempt_count - (source.item ->> 'attempt')::integer)
  from jsonb_array_elements(p_attempts) as source(item)
  order by (source.item ->> 'attempt')::integer;

  insert into public.hf_legacy_import_receipts(
    student_id, source_id, source_kind, attempt_count, status
  ) values (
    v_student_id, p_source_id, p_source_kind, v_attempt_count, 'imported'
  );
  return query select 'imported'::text, v_attempt_count::smallint;
end;
$$;

create table public.hf_mock_exams (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  series text not null check (series in ('utilization', 'final', 'last')),
  round_no smallint not null check (round_no > 0),
  title text not null,
  status text not null default 'review_pending'
    check (status in ('review_pending', 'reviewed', 'published', 'locked', 'archived')),
  published_at timestamptz,
  answers_released_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(series, round_no),
  check (status <> 'published' or published_at is not null)
);

create table public.hf_mock_entitlements (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.hf_students(id) on delete restrict,
  mock_exam_id uuid not null references public.hf_mock_exams(id) on delete restrict,
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  granted_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  check (expires_at is null or expires_at > starts_at),
  check (revoked_at is null or revoked_at >= created_at)
);

create unique index hf_mock_entitlements_current_state_idx
  on public.hf_mock_entitlements(student_id, mock_exam_id);

create index hf_mock_entitlements_lookup_idx
  on public.hf_mock_entitlements(student_id, mock_exam_id, starts_at, expires_at)
  where revoked_at is null;

create index hf_mock_entitlements_exam_idx
  on public.hf_mock_entitlements(mock_exam_id);

create index hf_mock_entitlements_granted_by_idx
  on public.hf_mock_entitlements(granted_by);

create table public.hf_mock_assets (
  id uuid primary key default gen_random_uuid(),
  mock_exam_id uuid not null references public.hf_mock_exams(id) on delete cascade,
  asset_kind text not null
    check (asset_kind in ('manifest', 'question', 'answer', 'explanation', 'cover')),
  bucket_id text not null default 'hf-mock-private'
    check (bucket_id = 'hf-mock-private'),
  object_path text not null unique
    check (
      object_path <> ''
      and left(object_path, 1) <> '/'
      and object_path !~ '(^|/)\.{1,2}(/|$)'
    ),
  mime_type text,
  created_at timestamptz not null default now()
);

create index hf_mock_assets_exam_idx
  on public.hf_mock_assets(mock_exam_id);

create table public.hf_mock_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.hf_students(id) on delete restrict,
  mock_exam_id uuid not null references public.hf_mock_exams(id) on delete restrict,
  attempt_no smallint not null check (attempt_no between 1 and 3),
  seed bigint not null check (seed >= 0),
  question_count smallint not null check (question_count between 1 and 100),
  correct_count smallint not null default 0
    check (correct_count >= 0 and correct_count <= question_count),
  score smallint generated always as (
    round((correct_count::numeric * 100) / question_count)::smallint
  ) stored,
  wrong_type_ids smallint[] not null default '{}'::smallint[],
  marks jsonb not null default '{}'::jsonb,
  status text not null default 'in_progress'
    check (status in ('in_progress', 'submitted', 'review_pending')),
  client_event_id uuid not null,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(student_id, client_event_id),
  unique(student_id, mock_exam_id, attempt_no),
  check (public.hf_valid_type_ids(wrong_type_ids, 54)),
  check (octet_length(marks::text) <= 65536),
  check (submitted_at is null or submitted_at >= started_at),
  check (status <> 'submitted' or submitted_at is not null)
);

create index hf_mock_attempts_student_time_idx
  on public.hf_mock_attempts(student_id, started_at desc);
create index hf_mock_attempts_exam_idx
  on public.hf_mock_attempts(mock_exam_id);

create table public.hf_vip_contents (
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  kind text not null check (kind in ('resources', 'seminar', 'column', 'magazine')),
  title text not null,
  summary text not null default '',
  content_date date,
  tags text[] not null default '{}'::text[],
  body_html text not null default '',
  status text not null default 'review_pending'
    check (status in ('draft', 'review_pending', 'reviewed', 'published', 'archived')),
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (status <> 'published' or published_at is not null)
);

create index hf_vip_contents_status_kind_idx
  on public.hf_vip_contents(status, kind, content_date desc);

create index hf_vip_contents_created_by_idx
  on public.hf_vip_contents(created_by);

create index hf_vip_contents_updated_by_idx
  on public.hf_vip_contents(updated_by);

create table public.hf_vip_assets (
  id uuid primary key default gen_random_uuid(),
  content_id text not null references public.hf_vip_contents(id) on delete cascade,
  asset_kind text not null check (asset_kind in ('cover', 'video', 'pdf', 'page', 'attachment')),
  page_no smallint,
  bucket_id text not null default 'hf-vip-private'
    check (bucket_id = 'hf-vip-private'),
  object_path text not null unique
    check (
      object_path <> ''
      and left(object_path, 1) <> '/'
      and object_path !~ '(^|/)\.{1,2}(/|$)'
    ),
  mime_type text,
  created_at timestamptz not null default now(),
  check (
    (asset_kind = 'page' and page_no is not null and page_no > 0)
    or (asset_kind <> 'page' and page_no is null)
  )
);

create index hf_vip_assets_content_idx
  on public.hf_vip_assets(content_id);

create unique index hf_vip_assets_non_page_unique_idx
  on public.hf_vip_assets(content_id, asset_kind)
  where page_no is null and asset_kind <> 'attachment';

create unique index hf_vip_assets_page_unique_idx
  on public.hf_vip_assets(content_id, asset_kind, page_no)
  where page_no is not null;

create table public.hf_vip_relations (
  content_id text not null references public.hf_vip_contents(id) on delete cascade,
  related_content_id text not null references public.hf_vip_contents(id) on delete cascade,
  sort_order smallint not null default 0,
  primary key(content_id, related_content_id),
  check (content_id <> related_content_id)
);

create index hf_vip_relations_reverse_idx
  on public.hf_vip_relations(related_content_id);

create table public.hf_legacy_import_receipts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.hf_students(id) on delete restrict,
  source_id uuid not null,
  source_kind text not null check (source_kind in ('approval-code-v1', 'phone-local-v1', 'mock-local-v1')),
  attempt_count smallint not null default 0 check (attempt_count between 0 and 3),
  status text not null check (status in ('imported', 'review_pending', 'rejected')),
  review_note text not null default '' check (char_length(review_note) <= 240),
  created_at timestamptz not null default now(),
  unique(student_id, source_id),
  unique(student_id, source_kind)
);

create or replace function hf_private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = statement_timestamp();
  return new;
end;
$$;

create or replace function hf_private.set_admin_authorization_changed_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if old.role is distinct from new.role
     or old.account_status is distinct from new.account_status then
    new.authorization_changed_at = clock_timestamp();
  end if;
  return new;
end;
$$;

create trigger hf_students_set_updated_at
before update on public.hf_students
for each row execute function hf_private.set_updated_at();

create trigger hf_admin_accounts_set_updated_at
before update on public.hf_admin_accounts
for each row execute function hf_private.set_updated_at();

create trigger hf_admin_accounts_set_authorization_changed_at
before update on public.hf_admin_accounts
for each row execute function hf_private.set_admin_authorization_changed_at();

create trigger hf_mock_exams_set_updated_at
before update on public.hf_mock_exams
for each row execute function hf_private.set_updated_at();

create trigger hf_mock_attempts_set_updated_at
before update on public.hf_mock_attempts
for each row execute function hf_private.set_updated_at();

create trigger hf_vip_contents_set_updated_at
before update on public.hf_vip_contents
for each row execute function hf_private.set_updated_at();

create index hf_legacy_receipts_student_idx
  on public.hf_legacy_import_receipts(student_id, created_at desc);

create table public.hf_asset_url_events (
  user_id uuid not null references auth.users(id) on delete cascade,
  requested_at timestamptz not null default now()
);

create index hf_asset_url_events_user_time_idx
  on public.hf_asset_url_events(user_id, requested_at desc);

create or replace function public.hf_consume_asset_url_quota(p_user_id uuid)
returns boolean
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  recent_count integer;
begin
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_user_id::text, 0)
  );

  delete from public.hf_asset_url_events
  where user_id = p_user_id
    and requested_at < statement_timestamp() - interval '5 minutes';

  select count(*)::integer
  into recent_count
  from public.hf_asset_url_events
  where user_id = p_user_id
    and requested_at >= statement_timestamp() - interval '1 minute';

  if recent_count >= 30 then
    return false;
  end if;

  insert into public.hf_asset_url_events(user_id) values (p_user_id);
  return true;
end;
$$;

alter table public.hf_students enable row level security;
alter table public.hf_admin_accounts enable row level security;
alter table public.hf_permission_catalog enable row level security;
alter table public.hf_entitlements enable row level security;
alter table public.hf_diagnosis_attempts enable row level security;
alter table public.hf_mock_exams enable row level security;
alter table public.hf_mock_entitlements enable row level security;
alter table public.hf_mock_assets enable row level security;
alter table public.hf_mock_attempts enable row level security;
alter table public.hf_vip_contents enable row level security;
alter table public.hf_vip_assets enable row level security;
alter table public.hf_vip_relations enable row level security;
alter table public.hf_legacy_import_receipts enable row level security;
alter table public.hf_asset_url_events enable row level security;

create policy hf_students_own_select
on public.hf_students for select to authenticated
using (
  (select auth.uid()) = id
  and (select hf_private.is_active_student())
);

create policy hf_students_admin_select
on public.hf_students for select to authenticated
using (
  (select hf_private.is_staff(array['admin']))
);

create policy hf_admin_accounts_own_select
on public.hf_admin_accounts for select to authenticated
using (
  user_id = (select auth.uid())
  and (select hf_private.is_staff(array['admin', 'content_editor']))
);

create policy hf_permission_catalog_select
on public.hf_permission_catalog for select to authenticated
using (true);

create policy hf_entitlements_own_active_select
on public.hf_entitlements for select to authenticated
using (
  (select auth.uid()) = student_id
  and revoked_at is null
  and starts_at <= now()
  and (expires_at is null or expires_at > now())
  and (select hf_private.is_active_student())
);

create policy hf_entitlements_admin_select
on public.hf_entitlements for select to authenticated
using (
  (select hf_private.is_staff(array['admin']))
);

create policy hf_diagnosis_own_select
on public.hf_diagnosis_attempts for select to authenticated
using (
  (select auth.uid()) = student_id
  and (select hf_private.is_active_student())
  and exists (
    select 1 from public.hf_entitlements e
    where e.student_id = (select auth.uid())
      and e.permission_key = 'hyperfocus'
      and e.revoked_at is null
      and e.starts_at <= now()
      and (e.expires_at is null or e.expires_at > now())
  )
);

create policy hf_diagnosis_admin_select
on public.hf_diagnosis_attempts for select to authenticated
using (
  (select hf_private.is_staff(array['admin']))
);

create policy hf_mock_entitlements_own_active_select
on public.hf_mock_entitlements for select to authenticated
using (
  (select auth.uid()) = student_id
  and revoked_at is null
  and starts_at <= now()
  and (expires_at is null or expires_at > now())
  and (select hf_private.is_active_student())
);

create policy hf_mock_entitlements_admin_select
on public.hf_mock_entitlements for select to authenticated
using (
  (select hf_private.is_staff(array['admin']))
);

create policy hf_mock_exams_entitled_select
on public.hf_mock_exams for select to authenticated
using (
  status = 'published'
  and published_at <= now()
  and (
    exists (
      select 1 from public.hf_entitlements e
      where e.student_id = (select auth.uid())
        and e.permission_key = 'mock'
        and e.revoked_at is null
        and e.starts_at <= now()
        and (e.expires_at is null or e.expires_at > now())
    )
    or exists (
      select 1 from public.hf_mock_entitlements me
      where me.student_id = (select auth.uid())
        and me.mock_exam_id = hf_mock_exams.id
        and me.revoked_at is null
        and me.starts_at <= now()
        and (me.expires_at is null or me.expires_at > now())
    )
  )
);

create policy hf_mock_exams_admin_select
on public.hf_mock_exams for select to authenticated
using (
  (select hf_private.is_staff(array['admin']))
);

create policy hf_mock_assets_entitled_select
on public.hf_mock_assets for select to authenticated
using (
  exists (
    select 1 from public.hf_mock_exams e
    where e.id = hf_mock_assets.mock_exam_id
      and (
        hf_mock_assets.asset_kind in ('manifest', 'question', 'cover')
        or (
          hf_mock_assets.asset_kind in ('answer', 'explanation')
          and (
            (e.answers_released_at is not null and e.answers_released_at <= now())
            or exists (
              select 1
              from public.hf_mock_attempts a
              where a.student_id = (select auth.uid())
                and a.mock_exam_id = e.id
                and a.status = 'submitted'
            )
          )
        )
      )
  )
);

create policy hf_mock_assets_admin_select
on public.hf_mock_assets for select to authenticated
using (
  (select hf_private.is_staff(array['admin']))
);

create policy hf_mock_attempts_own_select
on public.hf_mock_attempts for select to authenticated
using (
  (select auth.uid()) = student_id
  and (select hf_private.is_active_student())
);

create policy hf_mock_attempts_admin_select
on public.hf_mock_attempts for select to authenticated
using (
  (select hf_private.is_staff(array['admin']))
);

create policy hf_vip_contents_entitled_select
on public.hf_vip_contents for select to authenticated
using (
  status = 'published'
  and published_at <= now()
  and exists (
    select 1 from public.hf_entitlements e
    where e.student_id = (select auth.uid())
      and e.permission_key = 'vip'
      and e.revoked_at is null
      and e.starts_at <= now()
      and (e.expires_at is null or e.expires_at > now())
  )
);

create policy hf_vip_contents_admin_select
on public.hf_vip_contents for select to authenticated
using (
  (select hf_private.is_staff(array['admin', 'content_editor']))
);

create policy hf_vip_assets_entitled_select
on public.hf_vip_assets for select to authenticated
using (
  exists (
    select 1 from public.hf_vip_contents c where c.id = content_id
  )
);

create policy hf_vip_assets_admin_select
on public.hf_vip_assets for select to authenticated
using (
  (select hf_private.is_staff(array['admin', 'content_editor']))
);

create policy hf_vip_relations_entitled_select
on public.hf_vip_relations for select to authenticated
using (
  exists (
    select 1
    from public.hf_vip_contents source_content
    join public.hf_vip_contents target_content
      on target_content.id = related_content_id
    where source_content.id = content_id
  )
);

create policy hf_vip_relations_admin_select
on public.hf_vip_relations for select to authenticated
using (
  (select hf_private.is_staff(array['admin', 'content_editor']))
);

create policy hf_legacy_receipts_own_select
on public.hf_legacy_import_receipts for select to authenticated
using (
  (select auth.uid()) = student_id
  and (select hf_private.is_active_student())
  and exists (
    select 1 from public.hf_entitlements e
    where e.student_id = (select auth.uid())
      and e.permission_key = 'hyperfocus'
      and e.revoked_at is null
      and e.starts_at <= now()
      and (e.expires_at is null or e.expires_at > now())
  )
);

create policy hf_legacy_receipts_admin_select
on public.hf_legacy_import_receipts for select to authenticated
using (
  (select hf_private.is_staff(array['admin']))
);

revoke all on table
  public.hf_students,
  public.hf_admin_accounts,
  public.hf_permission_catalog,
  public.hf_entitlements,
  public.hf_diagnosis_attempts,
  public.hf_mock_exams,
  public.hf_mock_entitlements,
  public.hf_mock_assets,
  public.hf_mock_attempts,
  public.hf_vip_contents,
  public.hf_vip_assets,
  public.hf_vip_relations,
  public.hf_legacy_import_receipts,
  public.hf_asset_url_events
from public, anon, authenticated;

grant usage on schema public to authenticated, service_role;
grant usage on schema hf_private to authenticated, service_role;

grant select on table
  public.hf_students,
  public.hf_admin_accounts,
  public.hf_permission_catalog,
  public.hf_entitlements,
  public.hf_diagnosis_attempts,
  public.hf_mock_exams,
  public.hf_mock_entitlements,
  public.hf_mock_assets,
  public.hf_mock_attempts,
  public.hf_vip_contents,
  public.hf_vip_assets,
  public.hf_vip_relations,
  public.hf_legacy_import_receipts
to authenticated;

grant select, insert, update, delete on table
  public.hf_students,
  public.hf_admin_accounts,
  public.hf_permission_catalog,
  public.hf_entitlements,
  public.hf_diagnosis_attempts,
  public.hf_mock_exams,
  public.hf_mock_entitlements,
  public.hf_mock_assets,
  public.hf_mock_attempts,
  public.hf_vip_contents,
  public.hf_vip_assets,
  public.hf_vip_relations,
  public.hf_legacy_import_receipts,
  public.hf_asset_url_events
to service_role;

revoke execute on function public.hf_valid_type_ids(smallint[], integer)
from public, anon;
grant execute on function public.hf_valid_type_ids(smallint[], integer)
to authenticated, service_role;

revoke execute on function public.hf_begin_student_auth_change(uuid, integer, uuid, text)
from public, anon, authenticated;
grant execute on function public.hf_begin_student_auth_change(uuid, integer, uuid, text)
to service_role;

revoke execute on function public.hf_complete_student_auth_change(uuid, uuid, integer)
from public, anon, authenticated;
grant execute on function public.hf_complete_student_auth_change(uuid, uuid, integer)
to service_role;

revoke execute on function public.hf_cancel_student_auth_change(uuid, uuid, integer)
from public, anon, authenticated;
grant execute on function public.hf_cancel_student_auth_change(uuid, uuid, integer)
to service_role;

revoke execute on function public.hf_import_legacy_diagnosis(uuid, text, jsonb)
from public, anon;
grant execute on function public.hf_import_legacy_diagnosis(uuid, text, jsonb)
to authenticated, service_role;

revoke execute on function public.hf_submit_diagnosis(smallint, smallint[], uuid)
from public, anon;
grant execute on function public.hf_submit_diagnosis(smallint, smallint[], uuid)
to authenticated, service_role;

revoke execute on function public.hf_set_student_entitlement(uuid, text, boolean, uuid)
from public, anon, authenticated;
grant execute on function public.hf_set_student_entitlement(uuid, text, boolean, uuid)
to service_role;

revoke execute on function public.hf_consume_asset_url_quota(uuid)
from public, anon, authenticated;
grant execute on function public.hf_consume_asset_url_quota(uuid)
to service_role;

revoke execute on function hf_private.is_staff(text[]) from public, anon;
grant execute on function hf_private.is_staff(text[]) to authenticated, service_role;

revoke execute on function hf_private.is_active_student() from public, anon;
grant execute on function hf_private.is_active_student() to authenticated, service_role;

revoke execute on function hf_private.set_updated_at() from public, anon, authenticated;
grant execute on function hf_private.set_updated_at() to service_role;
revoke execute on function hf_private.set_admin_authorization_changed_at() from public, anon, authenticated;
grant execute on function hf_private.set_admin_authorization_changed_at() to service_role;

insert into storage.buckets
  (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'hf-vip-private',
    'hf-vip-private',
    false,
    524288000,
    array['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'video/mp4']
  ),
  (
    'hf-mock-private',
    'hf-mock-private',
    false,
    104857600,
    array['application/json', 'application/pdf', 'image/jpeg', 'image/png', 'image/webp']
  )
on conflict (id) do update
set
  name = excluded.name,
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- storage.objects intentionally has no student policy. Files are served only
-- through a short-lived signed URL created by an authenticated Edge Function.

commit;
