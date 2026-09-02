-- Read-only checks for a local or preview database after applying the migration.

select c.relname, c.relrowsecurity, c.relforcerowsecurity
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in (
    'hs_user_exam_plan_definitions',
    'hs_user_exam_plan_assignments',
    'hs_user_exam_entitlements',
    'hs_user_exam_recipes'
  )
order by c.relname;

select grantee, table_name, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name like 'hs_user_exam_%'
  and grantee in ('anon', 'authenticated', 'service_role')
order by grantee, table_name, privilege_type;

select tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public' and tablename like 'hs_user_exam_%'
order by tablename, cmd, policyname;

-- Expected: safe_recipe=true and every blocked column=false.
select
  public.hs_user_exam_json_is_safe(
    '{
      "schemaVersion": 1,
      "seed": 42,
      "selectionSnapshot": {
        "conditions": {
          "scopeKeys": ["M2-1/U1"],
          "difficultyWeights": {"lowered": 20, "standard": 50, "raised": 30},
          "responseWeights": {"objective": 40, "subjective": 60},
          "questionCount": 2,
          "maxPerFamily": 1
        }
      },
      "items": [
        {"itemId":"Q-1","itemVersionId":"v1","order":1,"score":2},
        {"itemId":"Q-2","itemVersionId":"v3","order":2,"score":2}
      ],
      "layout":{"paperSize":"A4","columns":2,"itemsPerPage":4,"fontScale":1}
    }'::jsonb
  ) as safe_recipe,
  public.hs_user_exam_json_is_safe('{"officialAnswer":"12"}'::jsonb) as answer_blocked,
  public.hs_user_exam_json_is_safe('{"content":"protected"}'::jsonb) as content_blocked,
  public.hs_user_exam_json_is_safe('{"correctChoice":3}'::jsonb) as choice_blocked,
  public.hs_user_exam_json_is_safe('{"nested":{"question_text":"protected"}}'::jsonb) as text_blocked,
  public.hs_user_exam_json_is_safe('{"asset":"C:\\private\\paper.pdf"}'::jsonb) as local_path_blocked,
  public.hs_user_exam_json_is_safe('{"asset":"/Users/private/paper.png"}'::jsonb) as unix_path_blocked;

-- Expected: zero rows for each integrity query.
select table_name, column_name
from information_schema.columns
where table_schema = 'public'
  and table_name like 'hs_user_exam_%'
  and regexp_replace(lower(column_name), '[^a-z0-9]', '', 'g')
      ~ '(questiontext|questionbody|answer|solution|sourcepath|originalpath|filepath|filename|pdf|scanpage)';

select recipe_row.id, pg_column_size(recipe_row.recipe) as bytes, plan.max_recipe_bytes
from public.hs_user_exam_recipes recipe_row
join public.hs_user_exam_plan_assignments assignment on assignment.user_id = recipe_row.owner_id
join public.hs_user_exam_plan_definitions plan on plan.plan_code = assignment.plan_code
where pg_column_size(recipe_row.recipe) > plan.max_recipe_bytes;

select saved.owner_id, count(*) as saved_count, plan.max_saved_exam_count
from public.hs_user_exam_recipes saved
join public.hs_user_exam_plan_assignments assignment on assignment.user_id = saved.owner_id
join public.hs_user_exam_plan_definitions plan on plan.plan_code = assignment.plan_code
where saved.status = 'saved'
group by saved.owner_id, plan.max_saved_exam_count
having count(*) > plan.max_saved_exam_count;

select id, owner_id, expires_at
from public.hs_user_exam_recipes
where status = 'temporary' and expires_at <= now();

select child.id, child.owner_id, child.parent_exam_id, parent.owner_id as parent_owner_id
from public.hs_user_exam_recipes child
join public.hs_user_exam_recipes parent on parent.id = child.parent_exam_id
where child.owner_id <> parent.owner_id;

select recipe_row.id, recipe_row.owner_id
from public.hs_user_exam_recipes recipe_row
where not exists (
  select 1
  from public.hs_user_exam_entitlements entitlement
  where entitlement.user_id = recipe_row.owner_id
    and entitlement.is_enabled
    and entitlement.valid_from <= now()
    and (entitlement.valid_until is null or entitlement.valid_until > now())
    and (
      (entitlement.scope_kind = 'all_learning' and recipe_row.generation_mode = 'learning')
      or
      (entitlement.scope_kind = 'academy_all'
        and recipe_row.academy_code is not null
        and entitlement.academy_code = recipe_row.academy_code)
      or
      (entitlement.scope_kind = 'academy_semester'
        and recipe_row.academy_code is not null
        and entitlement.academy_code = recipe_row.academy_code
        and entitlement.semester_code = recipe_row.semester_code)
    )
);

select tablename, indexname, indexdef
from pg_indexes
where schemaname = 'public' and tablename like 'hs_user_exam_%'
order by tablename, indexname;

select
  count(*) as total_rows,
  count(*) filter (where status = 'saved') as saved_rows,
  count(*) filter (where status = 'temporary') as temporary_rows,
  coalesce(sum(pg_column_size(recipe)), 0) as total_recipe_bytes,
  coalesce(max(pg_column_size(recipe)), 0) as largest_recipe_bytes
from public.hs_user_exam_recipes;
