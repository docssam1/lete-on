"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "admin.html"), "utf8");
const app = fs.readFileSync(path.join(root, "admin-app.js"), "utf8");
const adminEdge = fs.readFileSync(path.join(root, "supabase", "functions", "admin-students", "index.ts"), "utf8");
const batchMigration = fs.readFileSync(
  path.join(root, "supabase", "migrations", "20260910221746_batch_detail_entitlements.sql"),
  "utf8"
);
const hardenBatchMigration = fs.readFileSync(
  path.join(root, "supabase", "migrations", "20260910223500_harden_batch_detail_entitlements.sql"),
  "utf8"
);
const challengeCatalog = require(path.join(root, "challenge", "access-catalog.js"));
const hfCatalog = require(path.join(root, "type-access-catalog.js"));

new vm.Script(app, { filename: "admin-app.js" });

function scriptSources(source) {
  return [...source.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/giu)]
    .map(match => match[1].split("?")[0]);
}

function assertBefore(items, first, second, message) {
  const firstIndex = items.indexOf(first);
  const secondIndex = items.indexOf(second);
  assert.ok(firstIndex >= 0, `${first} 스크립트가 필요합니다.`);
  assert.ok(secondIndex >= 0, `${second} 스크립트가 필요합니다.`);
  assert.ok(firstIndex < secondIndex, message);
}

// The unified page replaces navigation hops with one student-scoped approval center.
assert.doesNotMatch(html, /href=["']\.\/challenge\/admin\.html(?:\?[^"']*)?["']/iu);
assert.doesNotMatch(html, /href=["']\.\/type-admin\.html(?:\?[^"']*)?["']/iu);
assert.match(html, /<dialog\b[^>]*\bid=["']approvalCenter["']/iu);
assert.match(html, /role=["']tablist["']/iu);
assert.match(html, /data-approval-tab=["']challenge["']/iu);
assert.match(html, /data-approval-tab=["']hf["']/iu);
assert.match(html, /id=["']approvalChallengeSelectAll["'][^>]*>[\s\S]{0,80}전체유형 선택/iu);
assert.match(html, /id=["']approvalHfSelectAll["'][^>]*>[\s\S]{0,80}전체유형 선택/iu);
assert.match(html, /data-approval-close/iu);

const scripts = scriptSources(html);
assertBefore(scripts, "./challenge/access-catalog.js", "./admin-app.js", "Challenge 카탈로그는 관리자 앱보다 먼저 로드해야 합니다.");
assertBefore(scripts, "./type-access-catalog.js", "./admin-app.js", "HF 유형 카탈로그는 관리자 앱보다 먼저 로드해야 합니다.");

// Catalog cardinality is part of the product approval contract.
const challengeRows = challengeCatalog.list();
const challengeBank = challengeRows.filter(entry => entry.kind === "bank");
assert.equal(challengeRows.length, 110, "Challenge 승인은 개념 2 + 모의 4 + 유형 104여야 합니다.");
assert.equal(challengeRows.filter(entry => entry.kind === "concept").length, 2);
assert.equal(challengeRows.filter(entry => entry.kind === "mock").length, 4);
assert.equal(challengeBank.length, 104);
assert.equal(challengeBank.filter(entry => entry.section === "main").length, 80);
assert.equal(challengeBank.filter(entry => entry.section === "extra").length, 24);
assert.equal(new Set(challengeRows.map(entry => entry.key)).size, 110, "Challenge 권한 키는 모두 고유해야 합니다.");

const hfRows = hfCatalog.list();
assert.equal(hfRows.length, 54, "HF 문제은행은 54유형이어야 합니다.");
assert.equal(hfCatalog.keys().length, 55, "HF 권한은 54유형과 개별 승인 모드 1개여야 합니다.");
assert.ok(hfCatalog.keys().includes(hfCatalog.modeKey));
assert.equal(new Set(hfCatalog.keys()).size, 55, "HF 유형/모드 권한 키는 모두 고유해야 합니다.");

// One save action sends the full delta to the already authenticated unified admin endpoint.
// The browser must not issue one Edge request per permission.
const batchStart = app.indexOf("async function setApprovalBatch");
assert.ok(batchStart >= 0, "세부 권한 일괄 저장 함수가 필요합니다.");
const batchWindow = app.slice(batchStart, batchStart + 1800);
assert.match(batchWindow, /invokeApproval\(\s*["']admin-students["']/u);
assert.match(batchWindow, /action\s*:\s*["']set_detail_entitlements["']/u);
assert.match(batchWindow, /studentId\s*:/u);
assert.match(batchWindow, /scope\s*[,}]/u);
assert.match(batchWindow, /changes\s*:/u);
assert.doesNotMatch(app, /invokeApproval\(\s*["'](?:challenge-access|hyperfocus-type-access)["']/u);
assert.match(
  app,
  /function\s+assertExactBatchResponse\s*\([^)]*\)\s*\{[\s\S]{0,1400}\.ok\s*!==\s*true[\s\S]{0,1400}\.studentId\s*!==[\s\S]{0,1400}\.scope\s*!==[\s\S]{0,1400}\.changedCount\s*!==[\s\S]{0,1400}\.permissionKey\s*!==[\s\S]{0,1400}\.enabled\s*!==/u,
  "일괄 저장 응답은 ok, 학생, 영역, 개수, 각 권한 키와 목표 상태를 모두 대조해야 합니다."
);
assert.match(app, /await\s+setApprovalBatch\s*\(\s*target\s*,\s*scope\s*,\s*edits\s*,\s*requestEpoch\s*\)/u);

// Server-side validation is bounded and scoped before one atomic service-role RPC.
assert.match(adminEdge, /MAX_DETAIL_BATCH_CHANGES\s*=\s*110/u);
assert.match(adminEdge, /DETAIL_SCOPE_LIMITS[^\n]*challenge:\s*110[^\n]*hf:\s*55/u);
assert.match(adminEdge, /readJsonObject\(request,\s*16384\)/u);
assert.match(adminEdge, /action\s*===\s*["']set_detail_entitlements["']/u);
assert.match(adminEdge, /new Set\(permissionKeys\)\.size\s*!==\s*permissionKeys\.length/u);
assert.match(adminEdge, /isDetailPermissionForScope\(scope,\s*change\.permissionKey\)/u);
assert.match(adminEdge, /rpc\(\s*["']hf_set_student_entitlements_batch["']/u);
assert.match(adminEdge, /changed\s*!==\s*changes\.length/u);

assert.match(batchMigration, /create or replace function public\.hf_set_student_entitlements_batch/u);
assert.match(batchMigration, /for v_index in 1\.\.v_count loop[\s\S]*public\.hf_set_student_entitlement/u);
assert.match(batchMigration, /revoke execute on function public\.hf_set_student_entitlements_batch[\s\S]*from public, anon, authenticated/u);
assert.match(batchMigration, /grant execute on function public\.hf_set_student_entitlements_batch[\s\S]*to service_role/u);
assert.match(batchMigration, /challenge permission catalog parity check failed/u);
assert.match(hardenBatchMigration, /v_count\s*>\s*110/u);
assert.match(hardenBatchMigration, /v_count\s*>\s*55/u);
assert.match(hardenBatchMigration, /where permission_key like 'challenge-%'[\s\S]{0,180}v_scope_count\s*<>\s*110/u);
assert.match(hardenBatchMigration, /where permission_key like 'hyperfocus-bank-%'[\s\S]{0,180}v_scope_count\s*<>\s*55/u);
assert.match(hardenBatchMigration, /select student\.account_status into v_student_status[\s\S]{0,220}for update/u);
assert.match(hardenBatchMigration, /entitlement batch postcondition failed/u);

// HF type changes precede the mode switch. Otherwise a partially completed save can
// activate individual mode before the student's selected type set is ready.
assert.match(
  app,
  /\[\s*\.\.\.[A-Za-z_$][\w$]*\.map\([^)]*=>[^)]*\.key\)\s*,\s*[A-Za-z_$][\w$]*\.modeKey\s*\]/u,
  "HF 변경 목록은 54개 유형 키 뒤에 modeKey를 두어 모드를 마지막에 저장해야 합니다."
);

// Suspended/archived students are visible for audit but cannot be mutated.
assert.match(app, /status\s*!==\s*["']active["']/u, "세부 승인 입력은 active 학생에게만 열려야 합니다.");
assert.match(
  app,
  /disabled\s*=\s*[^;\n]*(?:status\s*!==\s*["']active["']|!\s*[A-Za-z_$][\w$]*Active)/u,
  "비활성 학생의 세부 승인 컨트롤을 실제로 disabled 처리해야 합니다."
);

// Closing or switching away must not silently discard staged approvals.
assert.match(
  app,
  /confirm\s*\(\s*[`"'][\s\S]{0,220}(?:저장하지 않은|저장되지 않은|변경한 승인)[\s\S]{0,220}[`"']\s*\)/u,
  "미저장 변경이 있으면 닫기 전에 확인해야 합니다."
);
assert.match(app, /data-approval-close|\[data-approval-close\]/u, "모든 닫기 버튼에 미저장 확인 경로를 연결해야 합니다.");

console.log("Hyper Focus unified admin approvals contract: PASS");
