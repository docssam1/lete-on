const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..", "..");
const migrationDirectory = path.join(repoRoot, "supabase", "migrations");

function migrationText() {
  const matches = fs.readdirSync(migrationDirectory).filter(function (name) {
    return /^\d+_highselect_user_exam_library\.sql$/.test(name);
  });
  assert.equal(matches.length, 1, "exactly one CLI-created user exam library migration is required");
  return fs.readFileSync(path.join(migrationDirectory, matches[0]), "utf8");
}

test("migration separates plans, assignments, entitlements, and compact recipes", () => {
  const sql = migrationText();
  [
    "hs_user_exam_plan_definitions",
    "hs_user_exam_plan_assignments",
    "hs_user_exam_entitlements",
    "hs_user_exam_recipes"
  ].forEach(function (table) {
    assert.match(sql, new RegExp(`create table public\\.${table}\\b`, "i"));
    assert.match(sql, new RegExp(`alter table public\\.${table} force row level security`, "i"));
  });
  assert.match(sql, /max_saved_exam_count integer/i);
  assert.match(sql, /max_recent_exam_count integer/i);
  assert.match(sql, /temporary_retention_days integer/i);
  assert.match(sql, /recipe jsonb not null/i);
  assert.doesNotMatch(sql, /\b(question_text|answer_text|solution_text|pdf_url|source_path)\s+(text|jsonb|bytea)/i);
});

test("all-learning, academy-all, and academy-semester grants stay distinct", () => {
  const sql = migrationText();
  assert.match(sql, /scope_kind in \('academy_semester', 'academy_all', 'all_learning'\)/i);
  assert.match(sql, /entitlement\.scope_kind = 'all_learning' and new\.generation_mode = 'learning'/i);
  assert.match(sql, /entitlement\.scope_kind = 'academy_all'[\s\S]+entitlement\.academy_code = new\.academy_code/i);
  assert.match(sql, /entitlement\.scope_kind = 'academy_semester'[\s\S]+entitlement\.semester_code = new\.semester_code/i);
  assert.match(sql, /generation_mode = 'academy_prep'[\s\S]+academy_code is not null/i);
});

test("authenticated clients cannot bypass the private inventory gate when writing recipes", () => {
  const sql = migrationText();
  assert.match(sql, /revoke all on table public\.hs_user_exam_recipes from public, anon, authenticated/i);
  assert.match(sql, /grant select, delete on table public\.hs_user_exam_recipes to authenticated/i);
  assert.doesNotMatch(sql, /grant\s+(?:select,\s*)?(?:insert|update)[^;]*on table public\.hs_user_exam_recipes to authenticated/i);
  assert.match(sql, /grant select, insert, update, delete on table public\.hs_user_exam_recipes to service_role/i);
  assert.match(sql, /for select to authenticated using \(auth\.uid\(\) is not null and owner_id = auth\.uid\(\)\)/i);
  assert.match(sql, /for insert to authenticated with check \(auth\.uid\(\) is not null and owner_id = auth\.uid\(\)\)/i);
  assert.match(sql, /for update to authenticated using \(auth\.uid\(\) is not null and owner_id = auth\.uid\(\)\)[\s\S]+with check \(auth\.uid\(\) is not null and owner_id = auth\.uid\(\)\)/i);
  assert.match(sql, /for delete to authenticated using \(auth\.uid\(\) is not null and owner_id = auth\.uid\(\)\)/i);
  assert.doesNotMatch(sql, /grant\s+.+\s+to anon/i);
});

test("migration blocks protected payloads and prunes temporary overflow", () => {
  const sql = migrationText();
  assert.match(sql, /hs_user_exam_json_is_safe/i);
  assert.match(sql, /key_name not in \('schemaVersion', 'seed', 'selectionSnapshot', 'items', 'layout'\)/i);
  assert.match(sql, /key_name not in \('itemId', 'itemVersionId', 'order', 'score'\)/i);
  assert.match(sql, /key_name not in \('scopeKeys', 'difficultyWeights', 'responseWeights', 'questionCount', 'maxPerFamily', 'domainQuotas'\)/i);
  assert.match(sql, /new\.created_at := now\(\)/i);
  assert.match(sql, /row_number\(\) over \(order by updated_at desc, id desc\)/i);
  assert.match(sql, /ranked\.position > recent_limit/i);
  assert.match(sql, /pg_advisory_xact_lock/i);
  assert.match(sql, /candidate \?& array\['schemaVersion', 'seed', 'selectionSnapshot', 'items'\]/i);
  assert.match(sql, /conditions \?& array\['scopeKeys', 'difficultyWeights', 'responseWeights', 'questionCount', 'maxPerFamily'\]/i);
  assert.match(sql, /scope\.value #>> '\{\}' ~ '\(\^\|\/\)\[\.\]\[\.\]\?\(\/\|\$\)'/i);
  assert.match(sql, /\(conditions->>'questionCount'\)::integer <> item_count/i);
  assert.match(sql, /array\['algebra', 'geometry'\]/i);
  assert.match(sql, /conditions->'domainQuotas'->>'algebra'[\s\S]+conditions->'domainQuotas'->>'geometry'/i);
  assert.match(sql, /coalesce\(\(select array_agg\(key order by key\)[\s\S]+array\[\]::text\[\]\)/i);
  assert.match(sql, /create schema if not exists private/i);
  assert.match(sql, /create or replace function private\.hs_user_exam_delete_expired\(\)/i);
  assert.doesNotMatch(sql, /security definer[\s\S]{0,120}set search_path = pg_catalog, public/i);
  assert.match(sql, /hs-user-exam-expiry-hourly/i);
  assert.match(sql, /select private\.hs_user_exam_delete_expired\(\)/i);
  assert.match(sql, /create extension if not exists pg_cron with schema pg_catalog/i);
  assert.match(sql, /grant usage on schema cron to postgres/i);
  assert.match(sql, /grant all privileges on all tables in schema cron to postgres/i);
  assert.match(sql, /old\.status = 'temporary' and old\.expires_at <= now\(\) and new\.status = 'saved'/i);
  assert.match(sql, /expired temporary exam cannot be saved/i);
});
