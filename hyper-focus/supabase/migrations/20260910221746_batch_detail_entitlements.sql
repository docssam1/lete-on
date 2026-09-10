-- Reconcile the 19 Challenge keys renamed with the latest question revisions.
-- Their meanings changed in several slots, so stale grants are never guessed or
-- transferred automatically. The migration stops for manual review if any exist.
begin;

create temporary table hf_detail_permission_key_migration (
  old_key text primary key,
  new_key text unique not null,
  old_label text not null,
  new_label text not null
) on commit drop;

insert into hf_detail_permission_key_migration(old_key, new_key, old_label, new_label) values
  ('challenge-bank-balance-weight-order', 'challenge-bank-mock-balance-substitution-pictures', '수평 저울의 무게 바꾸기', '수평 저울의 무게 바꾸기'),
  ('challenge-bank-animal-race-order', 'challenge-bank-mock-dice-target-bottom', '조건을 연결해 순서 찾기', '주사위 굴리기'),
  ('challenge-bank-priority-length-units', 'challenge-bank-mock-object-length-equivalence', '물건으로 길이 비교', '물건으로 길이 비교'),
  ('challenge-bank-r3-main-9', 'challenge-bank-r3-main-9-shortest-path-grid', '겹치지 않게 같은 도형 연결', '조건이 있는 길의 가짓수'),
  ('challenge-bank-r3-main-15', 'challenge-bank-r3-main-15-checker-stack-count', '빈칸 수를 구해 비교하기', '쌓기나무 채우기'),
  ('challenge-bank-r3-main-18', 'challenge-bank-r3-main-18-tetra-cube-hole-count', '두 시점에서 마주 보는 면', '길쭉한 블록 세기'),
  ('challenge-bank-r3-extra-1', 'challenge-bank-r3-extra-1-congruent-marked-partition', '패턴블록으로 채우기', '조건에 맞게 같은 모양으로 나누기'),
  ('challenge-bank-r3-extra-3', 'challenge-bank-r3-extra-3-block-build-count', '서로 다른 세 수 고르기', '길쭉한 블록 세기'),
  ('challenge-bank-r3-extra-4', 'challenge-bank-r3-extra-4-object-length-equivalence', '물건으로 길이 비교', '물건으로 길이 비교'),
  ('challenge-bank-r3-extra-6', 'challenge-bank-r3-extra-6-stack-box-fill', '길쭉한 블록 세기', '쌓기나무 채우기'),
  ('challenge-bank-r4-main-12', 'challenge-bank-r4-main-12-block-build-count', '길쭉한 블록 세기', '길쭉한 블록 세기'),
  ('challenge-bank-r4-main-17', 'challenge-bank-r4-main-17-balance-substitution-pictures', '빈칸 수를 구해 비교하기', '수평 저울의 무게 바꾸기'),
  ('challenge-bank-r4-main-18', 'challenge-bank-r4-main-18-congruent-marked-partition', '대각선이 있는 길이 비교', '조건에 맞게 같은 모양으로 나누기'),
  ('challenge-bank-r4-extra-1', 'challenge-bank-r4-extra-1-object-length-equivalence', '늘어나는 색의 배열', '물건으로 길이 비교'),
  ('challenge-bank-r4-extra-2', 'challenge-bank-r4-extra-2-checker-stack-count', '두 시점에서 마주 보는 면', '쌓기나무 채우기'),
  ('challenge-bank-r4-extra-3', 'challenge-bank-r4-extra-3-tetra-cube-hole-count', '모든 칸을 한 번씩 지나기', '길쭉한 블록 세기'),
  ('challenge-bank-r4-extra-4', 'challenge-bank-r4-extra-4-shortest-path-grid', '기호를 넣어 참인 식 만들기', '조건이 있는 길의 가짓수'),
  ('challenge-bank-r4-extra-5', 'challenge-bank-r4-extra-5-stack-box-fill', '조각으로 모양 채우기', '쌓기나무 채우기'),
  ('challenge-bank-r4-extra-6', 'challenge-bank-r4-extra-6-simple-path-network', '주사위 굴리기', '조건이 있는 길의 가짓수');

lock table public.hf_permission_catalog in share row exclusive mode;
lock table public.hf_entitlements in share row exclusive mode;

do $$
declare
  v_exact_old integer;
begin
  select count(*) into v_exact_old
  from public.hf_permission_catalog as permission
  join hf_detail_permission_key_migration as migration
    on migration.old_key = permission.permission_key
   and migration.old_label = permission.label
   and permission.description = 'Hyper Focus > 챌린지 대비 / bank';
  if v_exact_old <> 19 then
    raise exception 'challenge catalog drift: expected 19 exact old rows, got %', v_exact_old using errcode = '55000';
  end if;

  if exists (
    select 1
    from hf_detail_permission_key_migration as migration
    join public.hf_permission_catalog as permission
      on permission.permission_key = migration.new_key
    where permission.label <> migration.new_label
       or permission.description <> 'Hyper Focus > 챌린지 대비 / bank'
  ) then
    raise exception 'challenge current-key collision' using errcode = '55000';
  end if;

  if exists (
    select 1
    from public.hf_entitlements as entitlement
    join hf_detail_permission_key_migration as migration
      on migration.old_key = entitlement.permission_key
  ) then
    raise exception 'stale challenge entitlements require manual review' using errcode = '55000';
  end if;
end;
$$;

insert into public.hf_permission_catalog(permission_key, label, description)
select migration.new_key, migration.new_label, 'Hyper Focus > 챌린지 대비 / bank'
from hf_detail_permission_key_migration as migration
on conflict (permission_key) do update
set label = excluded.label,
    description = excluded.description;

delete from public.hf_permission_catalog as permission
using hf_detail_permission_key_migration as migration
where permission.permission_key = migration.old_key;

do $$
declare
  v_current integer;
  v_old integer;
  v_total integer;
  v_bank integer;
begin
  select count(*) into v_current
  from hf_detail_permission_key_migration as migration
  join public.hf_permission_catalog as permission
    on permission.permission_key = migration.new_key
   and permission.label = migration.new_label
   and permission.description = 'Hyper Focus > 챌린지 대비 / bank';
  select count(*) into v_old
  from hf_detail_permission_key_migration as migration
  join public.hf_permission_catalog as permission
    on permission.permission_key = migration.old_key;
  select count(*) into v_total
  from public.hf_permission_catalog
  where permission_key like 'challenge-%';
  select count(*) into v_bank
  from public.hf_permission_catalog
  where permission_key like 'challenge-bank-%';

  if v_current <> 19 or v_old <> 0 or v_total <> 110 or v_bank <> 104 then
    raise exception 'challenge permission catalog parity check failed: current=%, old=%, total=%, bank=%',
      v_current, v_old, v_total, v_bank using errcode = '55000';
  end if;
  if exists (
    select 1
    from hf_detail_permission_key_migration as migration
    join public.hf_entitlements as entitlement
      on entitlement.permission_key = migration.old_key
  ) then
    raise exception 'stale challenge entitlement remained after reconciliation' using errcode = '55000';
  end if;
end;
$$;

-- Apply a bounded set of student entitlement changes in one database transaction.
-- The caller remains responsible for authenticating the administrator and
-- restricting the permission-key namespace before invoking this service-role RPC.
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
begin
  if v_count < 1
     or v_count > 160
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
    select 1
    from public.hf_students as student
    where student.id = p_student_id
  ) then
    raise exception 'student not found' using errcode = '23503';
  end if;

  if true = any(p_enabled) and not exists (
    select 1
    from public.hf_students as student
    where student.id = p_student_id
      and student.account_status = 'active'
  ) then
    raise exception 'student not active' using errcode = '55000';
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

  for v_index in 1..v_count loop
    perform public.hf_set_student_entitlement(
      p_student_id,
      p_permission_keys[v_index],
      p_enabled[v_index],
      p_granted_by
    );
  end loop;

  return v_count;
end;
$$;

revoke execute on function public.hf_set_student_entitlements_batch(uuid, text[], boolean[], uuid)
from public, anon, authenticated;
grant execute on function public.hf_set_student_entitlements_batch(uuid, text[], boolean[], uuid)
to service_role;

commit;
