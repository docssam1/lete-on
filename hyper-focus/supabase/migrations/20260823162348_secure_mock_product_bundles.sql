begin;

-- Product access is deliberately expressed as a fixed server-side bundle key.
-- The browser never supplies exam UUIDs or an exam list. A grant is accepted
-- only when every expected round exists with its exact series and round number.
-- Entitlements may be provisioned before publication; the secure delivery RLS
-- independently requires published status before any exam or asset is visible.
create or replace function public.hf_set_student_mock_bundle(
  p_student_id uuid,
  p_bundle_key text,
  p_enabled boolean,
  p_starts_at timestamptz,
  p_expires_at timestamptz,
  p_granted_by uuid
)
returns table(
  bundle_key text,
  enabled boolean,
  changed_count integer,
  mock_menu_active boolean,
  effective_starts_at timestamptz,
  effective_expires_at timestamptz
)
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
  v_now timestamptz := clock_timestamp();
  v_starts_at timestamptz := coalesce(p_starts_at, v_now);
  v_slugs text[];
  v_series text;
  v_expected_count integer;
  v_catalog_count integer := 0;
  v_changed_count integer := 0;
  v_remaining_count integer := 0;
  v_menu_starts_at timestamptz;
  v_menu_expires_at timestamptz;
  v_has_unbounded_expiry boolean := false;
  v_menu_active boolean := false;
begin
  if p_enabled is null or p_granted_by is null then
    raise exception 'invalid bundle request' using errcode = '22023';
  end if;

  if p_bundle_key = 'premier-utilization' then
    v_series := 'utilization';
    v_slugs := array[
      'premier-utilization-01', 'premier-utilization-02',
      'premier-utilization-03', 'premier-utilization-04',
      'premier-utilization-05', 'premier-utilization-06',
      'premier-utilization-07', 'premier-utilization-08'
    ]::text[];
  elsif p_bundle_key = 'premier-final' then
    v_series := 'final';
    v_slugs := array[
      'premier-final-01', 'premier-final-02', 'premier-final-03'
    ]::text[];
  elsif p_bundle_key = 'premier-last' then
    v_series := 'last';
    v_slugs := array[
      'premier-last-01', 'premier-last-02',
      'premier-last-03', 'premier-last-04'
    ]::text[];
  end if;

  if v_slugs is null then
    raise exception 'unknown mock product bundle' using errcode = '22023';
  end if;
  v_expected_count := cardinality(v_slugs);

  if p_enabled and p_expires_at is not null and p_expires_at <= v_starts_at then
    raise exception 'bundle expiry must follow its start' using errcode = '22023';
  end if;

  -- All bundle changes for one student serialize on the profile row. This also
  -- makes the generic menu permission recomputation safe under concurrent
  -- grants and revocations.
  perform 1
  from public.hf_students as student
  where student.id = p_student_id
  for update;
  if not found then
    raise exception 'student not found' using errcode = '23503';
  end if;

  if p_enabled then
    select count(*)
    into v_catalog_count
    from public.hf_mock_exams as exam
    where exam.slug = any(v_slugs)
      and exam.series = v_series
      and exam.round_no = array_position(v_slugs, exam.slug);
    if v_catalog_count <> v_expected_count then
      raise exception 'mock product bundle catalog is incomplete'
        using errcode = '55000';
    end if;

    insert into public.hf_mock_entitlements(
      student_id, mock_exam_id, starts_at, expires_at, revoked_at, granted_by
    )
    select
      p_student_id, exam.id, v_starts_at, p_expires_at, null, p_granted_by
    from public.hf_mock_exams as exam
    where exam.slug = any(v_slugs)
      and exam.series = v_series
      and exam.round_no = array_position(v_slugs, exam.slug)
    order by array_position(v_slugs, exam.slug)
    on conflict (student_id, mock_exam_id) do update
    set
      starts_at = excluded.starts_at,
      expires_at = excluded.expires_at,
      revoked_at = null,
      granted_by = excluded.granted_by;
    get diagnostics v_changed_count = row_count;
    -- Recheck after the write so a concurrent trusted catalog edit cannot
    -- commit a partial product grant between validation and INSERT.
    if v_changed_count <> v_expected_count then
      raise exception 'mock product bundle catalog changed during grant'
        using errcode = '55000';
    end if;
  else
    -- Revocation uses the same immutable slug map but does not require an exam
    -- to remain published. Already revoked rows keep their original audit time.
    update public.hf_mock_entitlements as entitlement
    set
      revoked_at = greatest(v_now, entitlement.created_at),
      granted_by = p_granted_by
    from public.hf_mock_exams as exam
    where entitlement.student_id = p_student_id
      and entitlement.mock_exam_id = exam.id
      and exam.slug = any(v_slugs)
      and entitlement.revoked_at is null;
    get diagnostics v_changed_count = row_count;
  end if;

  -- `mock` controls only library/menu visibility. Secure exam and asset access
  -- remains authorized exclusively by hf_mock_entitlements. Recompute the menu
  -- window from every remaining current or scheduled per-exam entitlement so a
  -- later-starting bundle is not accidentally hidden after another is revoked.
  select
    count(*),
    min(entitlement.starts_at),
    bool_or(entitlement.expires_at is null),
    max(entitlement.expires_at)
  into
    v_remaining_count,
    v_menu_starts_at,
    v_has_unbounded_expiry,
    v_menu_expires_at
  from public.hf_mock_entitlements as entitlement
  where entitlement.student_id = p_student_id
    and entitlement.revoked_at is null
    and (entitlement.expires_at is null or entitlement.expires_at > v_now);

  if v_remaining_count > 0 then
    if v_has_unbounded_expiry then
      v_menu_expires_at := null;
    end if;
    insert into public.hf_entitlements(
      student_id, permission_key, starts_at, expires_at, revoked_at, granted_by
    ) values (
      p_student_id, 'mock', v_menu_starts_at, v_menu_expires_at, null, p_granted_by
    )
    on conflict (student_id, permission_key) do update
    set
      starts_at = excluded.starts_at,
      expires_at = excluded.expires_at,
      revoked_at = null,
      granted_by = excluded.granted_by;
    v_menu_active := v_menu_starts_at <= v_now
      and (v_menu_expires_at is null or v_menu_expires_at > v_now);
  else
    update public.hf_entitlements as entitlement
    set
      revoked_at = greatest(v_now, entitlement.created_at),
      granted_by = p_granted_by
    where entitlement.student_id = p_student_id
      and entitlement.permission_key = 'mock'
      and entitlement.revoked_at is null;
    v_menu_starts_at := null;
    v_menu_expires_at := null;
    v_menu_active := false;
  end if;

  return query select
    p_bundle_key,
    p_enabled,
    v_changed_count,
    v_menu_active,
    v_menu_starts_at,
    v_menu_expires_at;
end;
$$;

revoke execute on function public.hf_set_student_mock_bundle(
  uuid, text, boolean, timestamptz, timestamptz, uuid
)
from public, anon, authenticated;
grant execute on function public.hf_set_student_mock_bundle(
  uuid, text, boolean, timestamptz, timestamptz, uuid
)
to service_role;

commit;
