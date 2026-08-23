"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { webcrypto } = require("node:crypto");

const root = path.resolve(__dirname, "..");
const read = relative => fs.readFileSync(path.join(root, relative), "utf8");

function checkInlineScripts(relative) {
  const html = read(relative);
  const pattern = new RegExp("<script(?![^>]*\\bsrc=)[^>]*>([\\s\\S]*?)<\\/script>", "gi");
  const blocks = Array.from(html.matchAll(pattern));
  blocks.forEach((match, index) => {
    new vm.Script(match[1], { filename: `${relative}#inline-${index + 1}` });
  });
  return blocks.length;
}

function storage() {
  const values = new Map();
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key)
  };
}

async function testLegacyAuth() {
  const context = {
    console,
    crypto: webcrypto,
    TextEncoder,
    Uint8Array,
    btoa,
    sessionStorage: storage(),
    GFIELD_HF_DATA: {
      students: ["테스트학생"],
      studentCode: { 테스트학생: "GFABC234" },
      studentType: { 테스트학생: "online" },
      access: { 테스트학생: ["hyperfocus"] }
    }
  };
  context.window = context;
  vm.runInNewContext(read("portal-auth.js"), context, { filename: "portal-auth.js" });
  const auth = context.GFieldHFPortalAuth;
  const signedIn = await auth.signIn("테스트 학생", "gf-abc234");
  assert.equal(signedIn.name, "테스트학생");
  assert.equal(signedIn.backend, "legacy");
  assert.equal(auth.current().type, "online");
  assert.equal(context.sessionStorage.getItem("gfield_hf_code"), "GFABC234");
  const parsedCode = auth.parseApprovalCode("GF-ABCD-EFGH-JK23-MNPQ-RSTV");
  assert.equal(parsedCode.handle, "abcd");
  assert.equal(parsedCode.formatted, "GF-ABCD-EFGH-JK23-MNPQ-RSTV");
  assert.equal(auth.parseApprovalCode("GF-TOO-SHORT"), null);
  const password = await auth.deriveStudentPassword("테스트 학생", "GFABCDEFGHJK23MNPQRSTV");
  assert.match(password, /^[A-Za-z0-9_-]{43}Aa1!$/);
  await auth.signOut();
  assert.equal(auth.current(), null);
}

function testStaticSecurityContracts() {
  const publicConfig = read("supabase-config.js");
  assert.match(publicConfig, /enabled:\s*false/);
  assert.match(publicConfig, /https:\/\/uqtkxhchtbcizzteuvsq\.supabase\.co/);
  assert.match(publicConfig, /sb_publishable_[A-Za-z0-9_-]+/);
  assert.match(publicConfig, /adminEmail:\s*"docssam1@gmail\.com"/);
  assert.match(publicConfig, /@supabase\/supabase-js@2\.112\.3/);
  assert.doesNotMatch(publicConfig, /sb_(?:secret|service_role)_[A-Za-z0-9]|SUPABASE_(?:SECRET|SERVICE_ROLE)_KEY\s*[:=]/i);

  const client = read("supabase-client.js");
  assert.match(client, /sessionStorage/);
  assert.match(client, /detectSessionInUrl:\s*false/);
  assert.doesNotMatch(client, /SUPABASE_SERVICE_ROLE_KEY|SUPABASE_SECRET_KEY/);

  const migration = read("supabase/migrations/20260823070755_initial_hyper_focus_auth.sql");
  const tables = [
    "hf_students", "hf_admin_accounts", "hf_permission_catalog", "hf_entitlements",
    "hf_diagnosis_attempts", "hf_mock_exams", "hf_mock_entitlements", "hf_mock_assets",
    "hf_mock_attempts", "hf_vip_contents", "hf_vip_assets", "hf_vip_relations",
    "hf_legacy_import_receipts", "hf_asset_url_events"
  ];
  tables.forEach(table => assert.match(migration, new RegExp(`alter table public\\.${table} enable row level security;`)));
  assert.match(migration, /hf_private\.is_active_student/);
  assert.match(migration, /credentials_rotated_at/);
  assert.match(migration, /auth\.sessions/);
  assert.match(migration, /session_id/);
  assert.match(migration, /hf_begin_student_auth_change/);
  assert.match(migration, /hf_complete_student_auth_change/);
  assert.match(migration, /hf_cancel_student_auth_change/);
  assert.match(migration, /auth_change_started_at\s*<\s*v_now\s*-\s*interval '15 minutes'/);
  assert.match(migration, /and s\.auth_change_id is null/);
  assert.match(migration, /auth_change_version is not null/);
  assert.match(migration, /clock_timestamp\(\)/);
  assert.match(migration, /hf_import_legacy_diagnosis/);
  assert.match(migration, /hf_submit_diagnosis/);
  assert.match(migration, /diagnosis attempts must be sequential/);
  assert.match(migration, /jsonb_typeof\(source\.item -> 'wrongIds'\) is distinct from 'array'/);
  assert.match(migration, /active hyperfocus entitlement required/);
  assert.match(migration, /create policy hf_diagnosis_own_select[\s\S]*permission_key = 'hyperfocus'/);
  assert.match(migration, /pg_advisory_xact_lock/);
  assert.match(migration, /unique\(student_id, source_kind\)/);
  assert.match(migration, /hf_private\.is_staff/);
  assert.match(migration, /authorization_changed_at/);
  assert.match(migration, /set_admin_authorization_changed_at/);
  assert.match(migration, /hf_set_student_entitlement/);
  assert.match(migration, /answers_released_at/);
  assert.match(migration, /storage\.objects intentionally has no student policy/);
  assert.doesNotMatch(migration, /grant\s+all\s+on\s+table/i);
  assert.doesNotMatch(migration, /grant\s+insert,\s*update\s+on\s+table\s+public\.hf_mock_attempts\s+to\s+authenticated/i);
  assert.doesNotMatch(migration, /grant\s+insert\s+on\s+table\s+public\.hf_diagnosis_attempts\s+to\s+authenticated/i);
  assert.doesNotMatch(migration, /source_fingerprint|details\s+jsonb/i);

  const advisorHardening = read("supabase/migrations/20260823102500_harden_advisor_findings.sql");
  assert.match(advisorHardening, /add column id uuid primary key/);
  assert.match(advisorHardening, /hf_entitlements_permission_key_idx/);
  assert.match(advisorHardening, /hf_asset_url_events_no_client_access/);

  const signedAsset = read("supabase/functions/signed-asset-url/index.ts");
  assert.match(signedAsset, /assetId/);
  assert.match(signedAsset, /hf_consume_asset_url_quota/);
  assert.match(signedAsset, /createSignedUrl/);
  assert.match(signedAsset, /SUPABASE_PUBLISHABLE_KEYS/);
  assert.match(signedAsset, /SUPABASE_SECRET_KEYS/);
  assert.match(signedAsset, /request\.body\.getReader\(\)/);
  assert.doesNotMatch(signedAsset, /console\.(log|error)/);

  const adminEdge = read("supabase/functions/admin-students/index.ts");
  assert.match(adminEdge, /claims\?\.aal\s*!==\s*"aal2"/);
  assert.match(adminEdge, /oneTimeApprovalCode/);
  assert.match(adminEdge, /hf_login_version/);
  assert.match(adminEdge, /hf_begin_student_auth_change/);
  assert.match(adminEdge, /hf_complete_student_auth_change/);
  assert.match(adminEdge, /hf_cancel_student_auth_change/);
  assert.match(adminEdge, /hf_auth_change_id/);
  assert.match(adminEdge, /auth\.admin\.getUserById/);
  assert.match(adminEdge, /authErrorIsDefinitiveRejection/);
  assert.match(adminEdge, /typeof payload\.enabled !== "boolean"/);
  assert.match(
    adminEdge,
    /const \{ data: staff, error: staffError \} = await userClient\s*\.from\("hf_admin_accounts"\)/
  );
  assert.match(adminEdge, /hf_set_student_entitlement/);
  assert.match(adminEdge, /authData\.user\.app_metadata\?\.hf_role/);
  assert.match(adminEdge, /SUPABASE_PUBLISHABLE_KEYS/);
  assert.match(adminEdge, /SUPABASE_SECRET_KEYS/);
  assert.match(adminEdge, /randomChars\(16\)/);
  assert.match(adminEdge, /request\.body\.getReader\(\)/);
  assert.doesNotMatch(adminEdge, /console\.(log|error)/);

  const diagnosis = read("diagnosis.html");
  assert.match(diagnosis, /hf_import_legacy_diagnosis/);
  assert.match(diagnosis, /hf_submit_diagnosis/);
  assert.doesNotMatch(diagnosis, /from\('hf_diagnosis_attempts'\)\.insert/);
  assert.match(diagnosis, /gfield_hf_approval_/);
  assert.match(diagnosis, /approvalHistories\.length===1/);
  assert.match(diagnosis, /기존 기기 기록은 삭제하지 않습니다/);
  assert.doesNotMatch(diagnosis, /p_(?:phone|approval_code)\s*:/i);

  const adminMfa = read("admin-mfa.html");
  assert.match(adminMfa, /mfa\.unenroll/);

  const adminBootstrap = read("supabase/bootstrap-admin.ts");
  assert.match(adminBootstrap, /Deno\.env\.get/);
  assert.match(adminBootstrap, /HF_ADMIN_EMAIL/);
  assert.match(adminBootstrap, /HF_ADMIN_PASSWORD/);
  assert.match(adminBootstrap, /adminPassword\.length < 16/);
  assert.match(adminBootstrap, /auth\.admin\.createUser/);
  assert.match(adminBootstrap, /email_confirm:\s*true/);
  assert.match(adminBootstrap, /app_metadata:\s*\{ hf_role: "admin" \}/);
  assert.match(adminBootstrap, /from\("hf_admin_accounts"\)\.upsert/);
  assert.doesNotMatch(adminBootstrap, /sb_secret_[A-Za-z0-9_-]{8,}/);

  const adminBootstrapWrapper = read("supabase/bootstrap-admin-local.ps1");
  assert.match(adminBootstrapWrapper, /Read-Host[\s\S]*-AsSecureString/);
  assert.match(adminBootstrapWrapper, /\^sb_secret_/);
  assert.match(adminBootstrapWrapper, /PreviousEnvironment/);
  assert.match(adminBootstrapWrapper, /SetEnvironmentVariable/);
  assert.match(adminBootstrapWrapper, /ZeroFreeBSTR/);
  assert.doesNotMatch(adminBootstrapWrapper, /sb_secret_[A-Za-z0-9_-]{8,}/);

  const adminBootstrapLauncher = read("supabase/run-bootstrap-admin.cmd");
  assert.match(adminBootstrapLauncher, /-ExecutionPolicy Bypass/);
  assert.match(adminBootstrapLauncher, /bootstrap-admin-local\.ps1/);
  assert.match(adminBootstrapLauncher, /docssam1@gmail\.com/);
  assert.doesNotMatch(adminBootstrapLauncher, /sb_secret_[A-Za-z0-9_-]{8,}/);

  const viewer = read("mock/viewer.html");
  assert.match(viewer, /secureMockDelivery/);
  assert.match(viewer, /GFieldHFSecureMock/);
  assert.match(viewer, /검수 대기/);
  assert.match(viewer, /if\(remoteMode\)params\.delete\('student'\)/);

  const mockIndex = read("mock/index.html");
  assert.match(mockIndex, /GFieldHFPortalAuth\.canAccess\(portalSession,'mock'\)/);
  assert.match(mockIndex, /if\(remoteMode\)exam=await secureMock\.loadExam/);
  assert.match(mockIndex, /secureMock\.saveAttempt/);
  assert.match(mockIndex, /온라인 모의고사 · 검수 대기/);
  assert.ok(
    mockIndex.indexOf("if(!secureMockEnabled") < mockIndex.indexOf("await enter();"),
    "remote mock lock must run before starting the exam"
  );
}

async function main() {
  ["diagnosis.html", "mock/viewer.html", "admin-mfa.html", "mock/index.html"].forEach(file => {
    const count = checkInlineScripts(file);
    assert.ok(count > 0, `${file} inline script missing`);
  });
  await testLegacyAuth();
  testStaticSecurityContracts();
  console.log("Hyper Focus Supabase foundation QA: PASS");
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
