-- Serialize each student's detail changes and verify the final entitlement state.
create or replace function public.hf_set_student_entitlements_batch(
  p_student_id uuid,
  p_permission_keys text[],
  p_enabled boolean[],
  p_granted_by uuid
)
returns integer
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
  v_count integer := coalesce(cardinality(p_permission_keys), 0);
  v_index integer;
  v_scope text;
  v_scope_count integer;
  v_student_status text;
  v_verify_now timestamptz;
begin
  if v_count < 1
     or v_count > 110
     or p_enabled is null
     or cardinality(p_enabled) <> v_count
     or array_position(p_permission_keys, null) is not null
     or array_position(p_enabled, null) is not null
     or exists (
       select 1
       from unnest(p_permission_keys) as requested(permission_key)
       where requested.permission_key = ''
     )
     or (
       select count(distinct requested.permission_key)
       from unnest(p_permission_keys) as requested(permission_key)
     ) <> v_count then
    raise exception 'invalid entitlement batch' using errcode = '22023';
  end if;

  if not exists (
    select 1 from unnest(p_permission_keys) as requested(permission_key)
    where requested.permission_key not like 'challenge-%'
  ) then
    v_scope := 'challenge';
    select count(*) into v_scope_count
    from public.hf_permission_catalog
    where permission_key like 'challenge-%';
    if v_scope_count <> 110 then
      raise exception 'challenge permission catalog mismatch' using errcode = 'P0001';
    end if;
  elsif not exists (
    select 1 from unnest(p_permission_keys) as requested(permission_key)
    where requested.permission_key not like 'hyperfocus-bank-%'
  ) then
    v_scope := 'hf';
    if v_count > 55 then
      raise exception 'invalid HF entitlement batch' using errcode = '22023';
    end if;
    select count(*) into v_scope_count
    from public.hf_permission_catalog
    where permission_key like 'hyperfocus-bank-%';
    if v_scope_count <> 55 then
      raise exception 'HF permission catalog mismatch' using errcode = 'P0001';
    end if;
  else
    raise exception 'mixed or invalid entitlement scope' using errcode = '22023';
  end if;

  if exists (
    select 1
    from unnest(p_permission_keys) as requested(permission_key)
    left join public.hf_permission_catalog as permission
      on permission.permission_key = requested.permission_key
    where permission.permission_key is null
  ) then
    raise exception 'permission catalog not installed' using errcode = '22023';
  end if;

  select student.account_status into v_student_status
  from public.hf_students as student
  where student.id = p_student_id
  for update;
  if not found then
    raise exception 'student not found' using errcode = '23503';
  end if;
  if true = any(p_enabled) and v_student_status <> 'active' then
    raise exception 'student not active' using errcode = '55000';
  end if;

  for v_index in 1..v_count loop
    perform public.hf_set_student_entitlement(
      p_student_id,
      p_permission_keys[v_index],
      p_enabled[v_index],
      p_granted_by
    );
  end loop;

  v_verify_now := clock_timestamp();
  if exists (
    select 1
    from unnest(p_permission_keys, p_enabled) as requested(permission_key, enabled)
    where (
      requested.enabled
      and not exists (
        select 1
        from public.hf_entitlements as entitlement
        where entitlement.student_id = p_student_id
          and entitlement.permission_key = requested.permission_key
          and entitlement.revoked_at is null
          and entitlement.starts_at <= v_verify_now
          and (entitlement.expires_at is null or entitlement.expires_at > v_verify_now)
      )
    ) or (
      not requested.enabled
      and exists (
        select 1
        from public.hf_entitlements as entitlement
        where entitlement.student_id = p_student_id
          and entitlement.permission_key = requested.permission_key
          and entitlement.revoked_at is null
          and entitlement.starts_at <= v_verify_now
          and (entitlement.expires_at is null or entitlement.expires_at > v_verify_now)
      )
    )
  ) then
    raise exception 'entitlement batch postcondition failed for %', v_scope using errcode = 'P0002';
  end if;

  return v_count;
end;
$$;

revoke execute on function public.hf_set_student_entitlements_batch(uuid, text[], boolean[], uuid)
from public, anon, authenticated;
grant execute on function public.hf_set_student_entitlements_batch(uuid, text[], boolean[], uuid)
to service_role;
