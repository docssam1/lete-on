const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const migrationDir = path.join(__dirname, "..", "supabase", "migrations");
const migrationName = fs.readdirSync(migrationDir).find(function (name) {
  return name.endsWith("_create_gfield_math_private_accounts.sql");
});
const sql = fs.readFileSync(path.join(migrationDir, migrationName), "utf8");

test("migration was created by the Supabase timestamp convention", function () {
  assert.match(migrationName, /^\d{14}_create_gfield_math_private_accounts\.sql$/);
});

test("every public student table enables RLS and removes anonymous grants", function () {
  ["gfield_math_accounts", "gfield_math_student_state"].forEach(function (table) {
    assert.match(sql, new RegExp(`alter table public\\.${table} enable row level security`, "i"));
    assert.match(sql, new RegExp(`revoke all on table public\\.${table} from anon, authenticated`, "i"));
  });
});

test("student state policies are owner-scoped for select insert and update", function () {
  assert.match(sql, /for select\s+to authenticated\s+using \(\(select auth\.uid\(\)\) = owner_id\)/i);
  assert.match(sql, /for insert\s+to authenticated\s+with check \(\(select auth\.uid\(\)\) = owner_id\)/i);
  assert.match(sql, /for update\s+to authenticated\s+using \(\(select auth\.uid\(\)\) = owner_id\)\s+with check \(\(select auth\.uid\(\)\) = owner_id\)/i);
});

test("authorization does not trust user metadata or an authenticated role alone", function () {
  assert.doesNotMatch(sql, /user_metadata|raw_user_meta_data/i);
  assert.doesNotMatch(sql, /to authenticated\s+(?:using\s*\(\s*true\s*\)|with check\s*\(\s*true\s*\))/i);
});

test("staff access is explicitly routed through a verified server function", function () {
  assert.match(sql, /Staff access must use a verified server function/i);
  assert.doesNotMatch(sql, /grant\s+(?:all|select|insert|update|delete)[^;]*gfield_math_accounts[^;]*anon/i);
});
