begin;

create table public.hs_user_exam_plan_definitions (
  plan_code text primary key,
  display_name text not null,
  max_saved_exam_count integer not null default 10,
  max_recent_exam_count integer not null default 10,
  max_recipe_bytes integer not null default 65536,
  temporary_retention_days integer not null default 7,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hs_user_exam_plan_code_format check (plan_code ~ '^[a-z][a-z0-9_]{1,39}$'),
  constraint hs_user_exam_plan_display_name_length check (char_length(display_name) between 1 and 80),
  constraint hs_user_exam_plan_saved_limit check (max_saved_exam_count between 1 and 1000),
  constraint hs_user_exam_plan_recent_limit check (max_recent_exam_count between 1 and 100),
  constraint hs_user_exam_plan_recipe_limit check (max_recipe_bytes between 1024 and 262144),
  constraint hs_user_exam_plan_retention_limit check (temporary_retention_days between 1 and 365)
);

create table public.hs_user_exam_plan_assignments (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan_code text not null references public.hs_user_exam_plan_definitions(plan_code),
  assignment_status text not null default 'active',
  valid_from timestamptz not null default now(),
  valid_until timestamptz,
  assigned_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hs_user_exam_assignment_status check (assignment_status in ('active', 'suspended')),
  constraint hs_user_exam_assignment_window check (valid_until is null or valid_until > valid_from)
);

create table public.hs_user_exam_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scope_kind text not null,
  academy_code text,
  semester_code text,
  is_enabled boolean not null default true,
  valid_from timestamptz not null default now(),
  valid_until timestamptz,
  granted_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hs_user_exam_entitlement_scope check (scope_kind in ('academy_semester', 'academy_all', 'all_learning')),
  constraint hs_user_exam_entitlement_target check (
    (scope_kind = 'all_learning' and academy_code is null and semester_code is null)
    or
    (scope_kind = 'academy_all'
      and academy_code is not null
      and semester_code is null
      and academy_code ~ '^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$')
    or
    (scope_kind = 'academy_semester'
      and academy_code is not null
      and semester_code is not null
      and academy_code ~ '^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$'
      and semester_code ~ '^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$')
  ),
  constraint hs_user_exam_entitlement_window check (valid_until is null or valid_until > valid_from)
);

create table public.hs_user_exam_recipes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  parent_exam_id uuid references public.hs_user_exam_recipes(id) on delete set null,
  status text not null default 'temporary',
  generation_mode text not null,
  title text not null default '',
  academy_code text,
  semester_code text not null,
  recipe jsonb not null,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hs_user_exam_recipe_status check (status in ('temporary', 'saved')),
  constraint hs_user_exam_recipe_generation_mode check (generation_mode in ('academy_prep', 'learning')),
  constraint hs_user_exam_recipe_title_length check (char_length(title) <= 120),
  constraint hs_user_exam_recipe_target check (
    semester_code ~ '^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$'
    and (
      (generation_mode = 'academy_prep'
        and academy_code is not null
        and academy_code ~ '^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$')
      or
      (generation_mode = 'learning'
        and (academy_code is null or academy_code ~ '^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$'))
    )
  ),
  constraint hs_user_exam_recipe_lifecycle check (
    (status = 'saved' and expires_at is null)
    or
    (status = 'temporary' and expires_at is not null)
  ),
  constraint hs_user_exam_recipe_object check (jsonb_typeof(recipe) = 'object'),
  constraint hs_user_exam_recipe_hard_size_limit check (pg_column_size(recipe) <= 262144),
  constraint hs_user_exam_recipe_not_self_parent check (parent_exam_id is null or parent_exam_id <> id)
);

create or replace function public.hs_user_exam_json_is_safe(candidate jsonb)
returns boolean
language plpgsql
immutable
parallel safe
set search_path = pg_catalog, public
as $$
declare
  item jsonb;
  conditions jsonb;
  layout_options jsonb;
  item_count integer;
begin
  if candidate is null or jsonb_typeof(candidate) <> 'object' then return false; end if;
  if not (candidate ?& array['schemaVersion', 'seed', 'selectionSnapshot', 'items']) then return false; end if;
  if exists (
    select 1 from jsonb_object_keys(candidate) as key_name
    where key_name not in ('schemaVersion', 'seed', 'selectionSnapshot', 'items', 'layout')
  ) then return false; end if;
  if candidate->>'schemaVersion' <> '1' or jsonb_typeof(candidate->'schemaVersion') <> 'number' then return false; end if;
  if jsonb_typeof(candidate->'seed') <> 'number'
     or candidate->>'seed' !~ '^[0-9]+$'
     or (candidate->>'seed')::numeric > 4294967295 then return false; end if;

  if jsonb_typeof(candidate->'selectionSnapshot') <> 'object' then return false; end if;
  if not ((candidate->'selectionSnapshot') ? 'conditions') then return false; end if;
  if exists (
    select 1 from jsonb_object_keys(candidate->'selectionSnapshot') as key_name
    where key_name <> 'conditions'
  ) then return false; end if;
  conditions := candidate->'selectionSnapshot'->'conditions';
  if conditions is null or jsonb_typeof(conditions) <> 'object' then return false; end if;
  if not (conditions ?& array['scopeKeys', 'difficultyWeights', 'responseWeights', 'questionCount', 'maxPerFamily']) then return false; end if;
  if exists (
    select 1 from jsonb_object_keys(conditions) as key_name
    where key_name not in ('scopeKeys', 'difficultyWeights', 'responseWeights', 'questionCount', 'maxPerFamily', 'domainQuotas')
  ) then return false; end if;
  if jsonb_typeof(conditions->'scopeKeys') <> 'array'
     or jsonb_array_length(conditions->'scopeKeys') < 1
     or jsonb_array_length(conditions->'scopeKeys') > 100
     or exists (
       select 1 from jsonb_array_elements(conditions->'scopeKeys') as scope(value)
       where jsonb_typeof(scope.value) <> 'string'
          or scope.value #>> '{}' !~ '^[A-Za-z0-9._:-]+(/[A-Za-z0-9._:-]+)*$'
          or scope.value #>> '{}' ~ '(^|/)[.][.]?(/|$)'
     ) then return false; end if;
  if jsonb_typeof(conditions->'difficultyWeights') <> 'object'
     or coalesce((select array_agg(key order by key) from jsonb_object_keys(conditions->'difficultyWeights') as key), array[]::text[])
        <> array['lowered', 'raised', 'standard']
     or exists (
       select 1 from jsonb_each(conditions->'difficultyWeights') as weight(key, value)
       where jsonb_typeof(weight.value) <> 'number'
          or weight.value #>> '{}' !~ '^[0-9]+([.][0-9]+)?$'
          or (weight.value #>> '{}')::numeric < 0
          or (weight.value #>> '{}')::numeric > 1000
     ) then return false; end if;
  if jsonb_typeof(conditions->'responseWeights') <> 'object'
     or coalesce((select array_agg(key order by key) from jsonb_object_keys(conditions->'responseWeights') as key), array[]::text[])
        <> array['objective', 'subjective']
     or exists (
       select 1 from jsonb_each(conditions->'responseWeights') as weight(key, value)
       where jsonb_typeof(weight.value) <> 'number'
          or weight.value #>> '{}' !~ '^[0-9]+([.][0-9]+)?$'
          or (weight.value #>> '{}')::numeric < 0
          or (weight.value #>> '{}')::numeric > 1000
     ) then return false; end if;
  if jsonb_typeof(conditions->'questionCount') <> 'number'
     or conditions->>'questionCount' !~ '^[0-9]+$'
     or (conditions->>'questionCount')::integer not between 1 and 100 then return false; end if;
  if conditions ? 'domainQuotas' and conditions->'domainQuotas' <> 'null'::jsonb then
    if jsonb_typeof(conditions->'domainQuotas') <> 'object'
       or coalesce((select array_agg(key order by key) from jsonb_object_keys(conditions->'domainQuotas') as key), array[]::text[])
          <> array['algebra', 'geometry']
       or exists (
         select 1 from jsonb_each(conditions->'domainQuotas') as quota(key, value)
         where jsonb_typeof(quota.value) <> 'number'
            or quota.value #>> '{}' !~ '^[0-9]+$'
            or (quota.value #>> '{}')::integer not between 1 and 100
       )
       or ((conditions->'domainQuotas'->>'algebra')::integer + (conditions->'domainQuotas'->>'geometry')::integer)
          <> (conditions->>'questionCount')::integer then return false; end if;
  end if;
  if jsonb_typeof(conditions->'maxPerFamily') <> 'number'
     or conditions->>'maxPerFamily' !~ '^[0-9]+$'
     or (conditions->>'maxPerFamily')::integer not between 1 and 10 then return false; end if;

  if jsonb_typeof(candidate->'items') <> 'array' then return false; end if;
  item_count := jsonb_array_length(candidate->'items');
  if item_count < 1 or item_count > 100 then return false; end if;
  if (conditions->>'questionCount')::integer <> item_count then return false; end if;
  for item in select value from jsonb_array_elements(candidate->'items')
  loop
    if jsonb_typeof(item) <> 'object'
       or exists (
         select 1 from jsonb_object_keys(item) as key_name
         where key_name not in ('itemId', 'itemVersionId', 'order', 'score')
       )
       or (select count(*) from jsonb_object_keys(item)) <> 4
       or jsonb_typeof(item->'itemId') <> 'string'
       or item->>'itemId' !~ '^[A-Za-z0-9._:-]{1,180}$'
       or jsonb_typeof(item->'itemVersionId') <> 'string'
       or item->>'itemVersionId' !~ '^[A-Za-z0-9._:-]{1,180}$'
       or jsonb_typeof(item->'order') <> 'number'
       or item->>'order' !~ '^[0-9]+$'
       or (item->>'order')::integer not between 1 and 100
       or jsonb_typeof(item->'score') <> 'number'
       or item->>'score' !~ '^[0-9]+([.][0-9]+)?$'
       or (item->>'score')::numeric <= 0
       or (item->>'score')::numeric > 1000 then
      return false;
    end if;
  end loop;
  if (select count(distinct value->>'itemId') from jsonb_array_elements(candidate->'items')) <> item_count then return false; end if;
  if exists (
    select 1 from generate_series(1, item_count) as expected(position)
    where not exists (
      select 1 from jsonb_array_elements(candidate->'items') as recipe_item(value)
      where (recipe_item.value->>'order')::integer = expected.position
    )
  ) then return false; end if;

  layout_options := candidate->'layout';
  if layout_options is not null then
    if jsonb_typeof(layout_options) <> 'object'
       or exists (
         select 1 from jsonb_object_keys(layout_options) as key_name
         where key_name not in ('paperSize', 'columns', 'itemsPerPage', 'fontScale')
       ) then return false; end if;
    if layout_options ? 'paperSize'
       and (jsonb_typeof(layout_options->'paperSize') <> 'string' or layout_options->>'paperSize' not in ('A4')) then return false; end if;
    if layout_options ? 'columns'
       and (jsonb_typeof(layout_options->'columns') <> 'number' or layout_options->>'columns' !~ '^[12]$') then return false; end if;
    if layout_options ? 'itemsPerPage'
       and (jsonb_typeof(layout_options->'itemsPerPage') <> 'number' or layout_options->>'itemsPerPage' !~ '^[1-6]$') then return false; end if;
    if layout_options ? 'fontScale'
       and (jsonb_typeof(layout_options->'fontScale') <> 'number'
         or layout_options->>'fontScale' !~ '^[0-9]+([.][0-9]+)?$'
         or (layout_options->>'fontScale')::numeric not between 0.8 and 1.4) then return false; end if;
  end if;
  return true;
end;
$$;

alter table public.hs_user_exam_recipes
  add constraint hs_user_exam_recipe_safe_payload
  check (public.hs_user_exam_json_is_safe(recipe));

create or replace function public.hs_user_exam_validate_recipe_write()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog, public, auth
as $$
declare
  assigned_plan public.hs_user_exam_plan_definitions%rowtype;
  saved_exam_count bigint;
  parent_owner uuid;
begin
  if tg_op = 'INSERT' then
    new.created_at := now();
  else
    if new.owner_id <> old.owner_id then raise exception 'owner_id cannot be changed'; end if;
    if new.created_at <> old.created_at then raise exception 'created_at cannot be changed'; end if;
    if old.status = 'temporary' and old.expires_at <= now() and new.status = 'saved' then
      raise exception 'expired temporary exam cannot be saved';
    end if;
  end if;

  select definition.*
    into assigned_plan
    from public.hs_user_exam_plan_assignments assignment
    join public.hs_user_exam_plan_definitions definition on definition.plan_code = assignment.plan_code
   where assignment.user_id = new.owner_id
     and assignment.assignment_status = 'active'
     and assignment.valid_from <= now()
     and (assignment.valid_until is null or assignment.valid_until > now())
     and definition.is_active;
  if not found then raise exception 'an active exam-library plan assignment is required'; end if;

  perform pg_advisory_xact_lock(hashtextextended(new.owner_id::text, 1818072147));

  if pg_column_size(new.recipe) > assigned_plan.max_recipe_bytes then
    raise exception 'recipe exceeds the assigned plan size limit';
  end if;

  if new.parent_exam_id is not null then
    select owner_id into parent_owner from public.hs_user_exam_recipes where id = new.parent_exam_id;
    if not found or parent_owner <> new.owner_id then
      raise exception 'parent exam must exist and belong to the same owner';
    end if;
  end if;

  if not exists (
    select 1
      from public.hs_user_exam_entitlements entitlement
     where entitlement.user_id = new.owner_id
       and entitlement.is_enabled
       and entitlement.valid_from <= now()
       and (entitlement.valid_until is null or entitlement.valid_until > now())
       and (
         (entitlement.scope_kind = 'all_learning' and new.generation_mode = 'learning')
         or
         (entitlement.scope_kind = 'academy_all'
           and new.academy_code is not null
           and entitlement.academy_code = new.academy_code)
         or
         (entitlement.scope_kind = 'academy_semester'
           and new.academy_code is not null
           and entitlement.academy_code = new.academy_code
           and entitlement.semester_code = new.semester_code)
       )
  ) then
    raise exception 'an active learning entitlement is required';
  end if;

  if new.status = 'temporary' then
    new.expires_at := new.created_at + make_interval(days => assigned_plan.temporary_retention_days);
    if new.expires_at <= now() then raise exception 'temporary exam is already expired'; end if;
  else
    new.expires_at := null;
    select count(*) into saved_exam_count
      from public.hs_user_exam_recipes existing
     where existing.owner_id = new.owner_id
       and existing.status = 'saved'
       and existing.id <> new.id;
    if saved_exam_count >= assigned_plan.max_saved_exam_count then raise exception 'saved exam limit reached'; end if;
  end if;

  new.updated_at := now();
  return new;
end;
$$;

create or replace function public.hs_user_exam_prune_temporary()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog, public, auth
as $$
declare
  recent_limit integer;
begin
  select definition.max_recent_exam_count
    into recent_limit
    from public.hs_user_exam_plan_assignments assignment
    join public.hs_user_exam_plan_definitions definition on definition.plan_code = assignment.plan_code
   where assignment.user_id = new.owner_id;

  delete from public.hs_user_exam_recipes expired
   where expired.owner_id = new.owner_id
     and expired.status = 'temporary'
     and expired.expires_at <= now();

  with ranked as (
    select id,
           row_number() over (order by updated_at desc, id desc) as position
      from public.hs_user_exam_recipes
     where owner_id = new.owner_id and status = 'temporary'
  )
  delete from public.hs_user_exam_recipes overflow
   using ranked
   where overflow.id = ranked.id and ranked.position > recent_limit;
  return new;
end;
$$;

create or replace function public.hs_user_exam_touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create or replace function private.hs_user_exam_delete_expired()
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  deleted_count bigint;
begin
  delete from public.hs_user_exam_recipes
   where status = 'temporary' and expires_at <= now();
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

create trigger hs_user_exam_recipes_validate_write
before insert or update on public.hs_user_exam_recipes
for each row execute function public.hs_user_exam_validate_recipe_write();
create trigger hs_user_exam_recipes_prune_temporary
after insert or update on public.hs_user_exam_recipes
for each row when (new.status = 'temporary') execute function public.hs_user_exam_prune_temporary();

create trigger hs_user_exam_plan_definitions_touch_updated_at before update on public.hs_user_exam_plan_definitions
for each row execute function public.hs_user_exam_touch_updated_at();
create trigger hs_user_exam_plan_assignments_touch_updated_at before update on public.hs_user_exam_plan_assignments
for each row execute function public.hs_user_exam_touch_updated_at();
create trigger hs_user_exam_entitlements_touch_updated_at before update on public.hs_user_exam_entitlements
for each row execute function public.hs_user_exam_touch_updated_at();

create index hs_user_exam_assignments_plan_idx on public.hs_user_exam_plan_assignments(plan_code, assignment_status, valid_until);
create index hs_user_exam_entitlements_owner_lookup_idx on public.hs_user_exam_entitlements(user_id, is_enabled, valid_until, scope_kind);
create unique index hs_user_exam_entitlements_all_learning_active_uidx on public.hs_user_exam_entitlements(user_id)
  where scope_kind = 'all_learning' and is_enabled;
create unique index hs_user_exam_entitlements_academy_all_active_uidx on public.hs_user_exam_entitlements(user_id, academy_code)
  where scope_kind = 'academy_all' and is_enabled;
create unique index hs_user_exam_entitlements_academy_semester_active_uidx on public.hs_user_exam_entitlements(user_id, academy_code, semester_code)
  where scope_kind = 'academy_semester' and is_enabled;
create index hs_user_exam_recipes_owner_status_updated_idx on public.hs_user_exam_recipes(owner_id, status, updated_at desc);
create index hs_user_exam_recipes_expiring_temporary_idx on public.hs_user_exam_recipes(expires_at) where status = 'temporary';
create index hs_user_exam_recipes_owner_academy_semester_idx on public.hs_user_exam_recipes(owner_id, academy_code, semester_code)
  where academy_code is not null;
create index hs_user_exam_recipes_parent_idx on public.hs_user_exam_recipes(parent_exam_id) where parent_exam_id is not null;

alter table public.hs_user_exam_plan_definitions enable row level security;
alter table public.hs_user_exam_plan_assignments enable row level security;
alter table public.hs_user_exam_entitlements enable row level security;
alter table public.hs_user_exam_recipes enable row level security;
alter table public.hs_user_exam_plan_definitions force row level security;
alter table public.hs_user_exam_plan_assignments force row level security;
alter table public.hs_user_exam_entitlements force row level security;
alter table public.hs_user_exam_recipes force row level security;

revoke all on table public.hs_user_exam_plan_definitions from public, anon, authenticated;
revoke all on table public.hs_user_exam_plan_assignments from public, anon, authenticated;
revoke all on table public.hs_user_exam_entitlements from public, anon, authenticated;
revoke all on table public.hs_user_exam_recipes from public, anon, authenticated;
grant select on table public.hs_user_exam_plan_definitions to authenticated;
grant select on table public.hs_user_exam_plan_assignments to authenticated;
grant select on table public.hs_user_exam_entitlements to authenticated;
-- Recipe creation and save transitions must pass the private server inventory gate.
-- Authenticated browser clients may read/delete only their own rows; service_role performs validated writes.
grant select, delete on table public.hs_user_exam_recipes to authenticated;
grant select, insert, update, delete on table public.hs_user_exam_plan_definitions to service_role;
grant select, insert, update, delete on table public.hs_user_exam_plan_assignments to service_role;
grant select, insert, update, delete on table public.hs_user_exam_entitlements to service_role;
grant select, insert, update, delete on table public.hs_user_exam_recipes to service_role;

revoke all on function public.hs_user_exam_json_is_safe(jsonb) from public;
grant execute on function public.hs_user_exam_json_is_safe(jsonb) to authenticated, service_role;
revoke all on function public.hs_user_exam_validate_recipe_write() from public, anon, authenticated;
grant execute on function public.hs_user_exam_validate_recipe_write() to service_role;
revoke all on function public.hs_user_exam_prune_temporary() from public, anon, authenticated;
grant execute on function public.hs_user_exam_prune_temporary() to service_role;
revoke all on function public.hs_user_exam_touch_updated_at() from public, anon, authenticated;
grant execute on function public.hs_user_exam_touch_updated_at() to service_role;
revoke all on function private.hs_user_exam_delete_expired() from public, anon, authenticated;
grant usage on schema private to service_role;
grant execute on function private.hs_user_exam_delete_expired() to service_role;

create policy hs_user_exam_plan_definitions_select_active on public.hs_user_exam_plan_definitions
for select to authenticated using (is_active);
create policy hs_user_exam_plan_assignments_select_own on public.hs_user_exam_plan_assignments
for select to authenticated using (auth.uid() is not null and user_id = auth.uid());
create policy hs_user_exam_entitlements_select_own on public.hs_user_exam_entitlements
for select to authenticated using (auth.uid() is not null and user_id = auth.uid());
create policy hs_user_exam_recipes_select_own on public.hs_user_exam_recipes
for select to authenticated using (auth.uid() is not null and owner_id = auth.uid());
create policy hs_user_exam_recipes_insert_own on public.hs_user_exam_recipes
for insert to authenticated with check (auth.uid() is not null and owner_id = auth.uid());
create policy hs_user_exam_recipes_update_own on public.hs_user_exam_recipes
for update to authenticated using (auth.uid() is not null and owner_id = auth.uid())
with check (auth.uid() is not null and owner_id = auth.uid());
create policy hs_user_exam_recipes_delete_own on public.hs_user_exam_recipes
for delete to authenticated using (auth.uid() is not null and owner_id = auth.uid());

comment on table public.hs_user_exam_recipes is
  'User-owned compact exam recipes only. Never stores question text, answers, source paths, scans, or PDFs.';
comment on column public.hs_user_exam_recipes.recipe is
  'Stable question and version IDs, ordering, scores, filters, and layout only.';

create extension if not exists pg_cron with schema pg_catalog;
grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;
select cron.schedule(
  'hs-user-exam-expiry-hourly',
  '17 * * * *',
  'select private.hs_user_exam_delete_expired()'
);

commit;
