"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = relative => fs.readFileSync(path.join(root, relative), "utf8");

const bundleMigration = read("supabase/migrations/20260823162348_secure_mock_product_bundles.sql");
const secureMigration = read("supabase/migrations/20260823151425_secure_mock_delivery_v1.sql");
const initialMigration = read("supabase/migrations/20260823070755_initial_hyper_focus_auth.sql");
const adminEdge = read("supabase/functions/admin-students/index.ts");

const expected = {
  "premier-utilization": Array.from({ length: 8 }, (_, index) => `premier-utilization-${String(index + 1).padStart(2, "0")}`),
  "premier-final": Array.from({ length: 3 }, (_, index) => `premier-final-${String(index + 1).padStart(2, "0")}`),
  "premier-last": Array.from({ length: 4 }, (_, index) => `premier-last-${String(index + 1).padStart(2, "0")}`)
};

function sqlBundleSlugs(bundleKey) {
  const next = bundleKey === "premier-utilization"
    ? "premier-final"
    : bundleKey === "premier-final" ? "premier-last" : null;
  const start = bundleMigration.indexOf(`p_bundle_key = '${bundleKey}'`);
  assert.notEqual(start, -1, `${bundleKey} SQL mapping missing`);
  const end = next ? bundleMigration.indexOf(`p_bundle_key = '${next}'`, start) : bundleMigration.indexOf("end if;", start);
  const block = bundleMigration.slice(start, end);
  return Array.from(block.matchAll(/'(premier-(?:utilization|final|last)-\d{2})'/g), match => match[1]);
}

function edgeBundleSlugs(bundleKey) {
  const quoted = `"${bundleKey}"`;
  const start = adminEdge.indexOf(quoted);
  assert.notEqual(start, -1, `${bundleKey} Edge mapping missing`);
  const nextKey = bundleKey === "premier-utilization"
    ? "premier-final"
    : bundleKey === "premier-final" ? "premier-last" : null;
  const end = nextKey ? adminEdge.indexOf(`"${nextKey}"`, start + quoted.length) : adminEdge.indexOf("});", start);
  const block = adminEdge.slice(start, end);
  return Array.from(block.matchAll(/"(premier-(?:utilization|final|last)-\d{2})"/g), match => match[1]);
}

for (const [bundleKey, slugs] of Object.entries(expected)) {
  assert.deepEqual(sqlBundleSlugs(bundleKey), slugs, `${bundleKey} SQL must map every exact round once`);
  assert.deepEqual(edgeBundleSlugs(bundleKey), slugs, `${bundleKey} Edge catalog must match SQL`);
}

const rpc = bundleMigration.slice(
  bundleMigration.indexOf("create or replace function public.hf_set_student_mock_bundle"),
  bundleMigration.indexOf("revoke execute on function public.hf_set_student_mock_bundle")
);
assert.match(rpc, /security invoker/);
assert.match(rpc, /set search_path = ''/);
assert.match(rpc, /from public\.hf_students[\s\S]*for update/);
assert.match(rpc, /exam\.series = v_series/);
assert.match(rpc, /exam\.round_no = array_position\(v_slugs, exam\.slug\)/);
assert.match(rpc, /mock product bundle catalog is incomplete/);
assert.match(rpc, /get diagnostics v_changed_count = row_count;[\s\S]*if v_changed_count <> v_expected_count then[\s\S]*mock product bundle catalog changed during grant/,
  "카탈로그 검증과 INSERT 사이의 동시 변경은 부분 권한을 커밋하지 않아야 합니다.");
assert.match(rpc, /insert into public\.hf_mock_entitlements[\s\S]*on conflict \(student_id, mock_exam_id\) do update/);
assert.match(rpc, /revoked_at = null/);
assert.match(rpc, /expires_at = excluded\.expires_at/);
assert.match(rpc, /update public\.hf_mock_entitlements[\s\S]*exam\.slug = any\(v_slugs\)[\s\S]*entitlement\.revoked_at is null/);
assert.match(rpc, /revoked_at = greatest\(v_now, entitlement\.created_at\)/);
assert.match(rpc, /permission_key, starts_at, expires_at, revoked_at, granted_by[\s\S]*p_student_id, 'mock'/);
assert.match(rpc, /v_remaining_count > 0/);
assert.match(rpc, /permission_key = 'mock'[\s\S]*entitlement\.revoked_at is null/);
assert.doesNotMatch(rpc, /p_(?:exam|mock_exam)_(?:id|ids|list)/i);
assert.doesNotMatch(rpc, /uuid\[\]|jsonb/);
assert.doesNotMatch(rpc, /exam\.status = 'published'/, "bundle may be pre-provisioned before publication");
assert.match(
  bundleMigration,
  /revoke execute on function public\.hf_set_student_mock_bundle\([\s\S]*from public, anon, authenticated;/
);
assert.match(
  bundleMigration,
  /grant execute on function public\.hf_set_student_mock_bundle\([\s\S]*to service_role;/
);
assert.doesNotMatch(
  bundleMigration,
  /grant execute on function public\.hf_set_student_mock_bundle\([\s\S]*to (?:anon|authenticated)/
);
assert.match(initialMigration, /slug text not null unique/);
assert.match(initialMigration, /unique\(series, round_no\)/);

assert.doesNotMatch(adminEdge, /claims\?\.aal !== "aal2"/);
assert.match(adminEdge, /await service\s*\.from\("hf_admin_accounts"\)/);
assert.match(adminEdge, /issuedAtMs < authorizationChangedAtMs/);
assert.match(adminEdge, /const MOCK_BUNDLE_ACTION_FIELDS = new Set\(\["action", "studentId", "bundleKey", "enabled"\]\)/);
assert.match(adminEdge, /Object\.keys\(payload\)\.some\(key => !MOCK_BUNDLE_ACTION_FIELDS\.has\(key\)\)/);
assert.match(adminEdge, /if \(action === "set_mock_bundle"\)/);
assert.match(adminEdge, /service\.rpc\("hf_set_student_mock_bundle"/);
assert.match(adminEdge, /p_bundle_key: bundleKey/);
assert.match(adminEdge, /p_starts_at: null/);
assert.match(adminEdge, /p_expires_at: null/);
assert.match(adminEdge, /mockBundles: mockBundleStates/);
assert.match(adminEdge, /"full" \| "partial" \| "none" \| "catalog_error"/);
assert.match(adminEdge, /activeCount, expectedCount/);
assert.match(adminEdge, /const PERMISSIONS = new Set\(\["hyperfocus", "hyperfocus-extra", "vip", "problem-bank"\]\)/);
const actionBlock = adminEdge.slice(
  adminEdge.indexOf('if (action === "set_mock_bundle")'),
  adminEdge.indexOf('return json(request, 400, { error: "invalid_action" })')
);
assert.doesNotMatch(actionBlock, /payload\.(?:exam|mockExam)(?:Id|Ids|Uuid|Uuids|List)/i);
assert.doesNotMatch(actionBlock, /examIds|mockExamIds|examUuids/i);

const accessFunction = secureMigration.slice(
  secureMigration.indexOf("create or replace function hf_private.has_active_mock_access"),
  secureMigration.indexOf("create or replace function public.hf_begin_mock_attempt")
);
assert.match(accessFunction, /from public\.hf_mock_entitlements/);
assert.match(accessFunction, /exam\.status = 'published'/);
assert.match(accessFunction, /exam\.published_at <= now\(\)/);
assert.doesNotMatch(accessFunction, /from public\.hf_entitlements/);
const entitledPolicies = secureMigration.slice(
  secureMigration.indexOf("drop policy hf_mock_exams_entitled_select"),
  secureMigration.indexOf("revoke all on function public.hf_begin_mock_attempt")
);
assert.match(entitledPolicies, /from public\.hf_mock_entitlements/);
assert.match(entitledPolicies, /status = 'published'/);
assert.match(entitledPolicies, /published_at <= now\(\)/);
assert.doesNotMatch(entitledPolicies, /from public\.hf_entitlements/);

console.log("Secure mock product bundle contract QA: PASS (8 + 3 + 4 rounds)");
