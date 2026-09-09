"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "admin.html"), "utf8");
const app = fs.readFileSync(path.join(root, "admin-app.js"), "utf8");
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

function endpointMutationWindow(endpoint) {
  const candidates = [];
  let offset = 0;
  while (offset < app.length) {
    const index = app.indexOf(endpoint, offset);
    if (index < 0) break;
    candidates.push(app.slice(Math.max(0, index - 900), Math.min(app.length, index + 1800)));
    offset = index + endpoint.length;
  }
  return candidates.find(source => /action\s*:\s*["']set["']/u.test(source)) || "";
}

function assertExactMutationContract(endpoint) {
  const source = endpointMutationWindow(endpoint);
  assert.ok(source, `${endpoint} set 저장 경로가 필요합니다.`);
  assert.match(source, /studentId\s*:/u, `${endpoint} 요청은 학생 ID를 보내야 합니다.`);
  assert.match(source, /permissionKey\s*:/u, `${endpoint} 요청은 권한 키를 보내야 합니다.`);
  assert.match(source, /enabled\s*:/u, `${endpoint} 요청은 목표 상태를 보내야 합니다.`);

  const hasInlineValidation = [
    /(?:data|result|response)\?*\.ok\s*!==\s*true/u,
    /(?:data|result|response)\.studentId\s*!==/u,
    /(?:data|result|response)\.permissionKey\s*!==/u,
    /(?:data|result|response)\.enabled\s*!==/u
  ].every(pattern => pattern.test(source));
  const callsSharedValidator = /assertExactSetResponse\s*\(/u.test(source);
  assert.ok(
    hasInlineValidation || callsSharedValidator,
    `${endpoint} 응답의 ok, studentId, permissionKey, enabled를 정확히 검증해야 합니다.`
  );
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

// Each catalog stays on its own deployed endpoint and every mutation response is bound
// back to the requested student/key/state instead of trusting a generic 200 response.
assertExactMutationContract("challenge-access");
assertExactMutationContract("hyperfocus-type-access");
assert.match(
  app,
  /function\s+assertExactSetResponse\s*\([^)]*\)\s*\{[\s\S]{0,900}\.ok\s*!==\s*true[\s\S]{0,900}\.studentId\s*!==[\s\S]{0,900}\.permissionKey\s*!==[\s\S]{0,900}\.enabled\s*!==/u,
  "공유 저장 응답 검증기는 ok, 학생, 권한 키, 목표 상태를 모두 대조해야 합니다."
);

// HF type changes precede the mode switch. Otherwise a partially completed save can
// activate individual mode before the student's selected type set is ready.
assert.match(
  app,
  /\[\s*\.\.\.[A-Za-z_$][\w$]*\.map\([^)]*=>[^)]*\.key\)\s*,\s*[A-Za-z_$][\w$]*\.modeKey\s*\]/u,
  "HF 변경 목록은 54개 유형 키 뒤에 modeKey를 두어 모드를 마지막에 저장해야 합니다."
);
assert.match(app, /for\s*\(\s*const\s+edit\s+of\s+[A-Za-z_$][\w$]*\s*\)/u, "권한 변경은 확인 가능한 순서로 저장해야 합니다.");

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
