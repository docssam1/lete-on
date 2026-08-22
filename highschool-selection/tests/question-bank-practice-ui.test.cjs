const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const schemaSource = fs.readFileSync(path.join(root, "data", "question-bank-schema.js"), "utf8");
const pageSource = fs.readFileSync(path.join(root, "question-bank", "index.html"), "utf8");
const context = { globalThis: {} };
vm.runInNewContext(schemaSource, context);
const bank = context.globalThis.HIGHSELECT_QUESTION_BANK;

test("practice bank keeps SH middle cumulative taxonomy inside a multi-track selector", () => {
  assert.deepEqual(Array.from(bank.curriculum.middle, item => item.id), ["M1", "M2", "M3"]);
  assert.equal(pageSource.includes("출제 모드와 목표 과정을 고릅니다"), true);
  assert.equal(pageSource.includes("scope-exam"), true);
  assert.equal(pageSource.includes("elementary-cumulative"), true);
  assert.equal(pageSource.includes("middle-cumulative"), true);
  assert.equal(pageSource.includes("selection-tracks.js"), true);
  assert.equal(pageSource.includes("academy-mode"), true);
  assert.equal(pageSource.includes("academy-target"), true);
  assert.equal(pageSource.includes("Scorecard Blueprint"), true);
  assert.equal(pageSource.includes("Type Blueprint"), true);
});

test("academy profiles select report axes and type priorities without publishing source material", () => {
  assert.deepEqual(Array.from(bank.academyProfiles, profile => profile.id), ["SH", "DP", "WM", "ED", "DG", "SM"]);
  const dp = bank.academyProfiles.find(profile => profile.id === "DP");
  const linearFunctionTransfer = dp.targets.find(target => target.id === "middle-linear-function-transfer");
  assert.equal(linearFunctionTransfer.scopeKey, "middle1-1-to-linear-function");
  assert.equal(linearFunctionTransfer.scopeKind, "terminal-unit");
  assert.equal(linearFunctionTransfer.terminalUnit.course, "중2-1");
  assert.equal(linearFunctionTransfer.terminalUnit.unit, "일차함수");
  assert.equal(linearFunctionTransfer.usage, "question-bank-only");
  assert.equal(linearFunctionTransfer.label, "일차함수까지 편입");
  assert.equal(pageSource.includes("{label:'일차함수',state:'종료 단원'}"), true);
  assert.equal(pageSource.includes("target.usage==='question-bank-only'"), true);
  assert.equal(pageSource.includes("특정 원본 회차나 커트라인을 연결하지 않습니다"), true);
  const transfer = dp.targets.find(target => target.id === "middle2-2-transfer");
  assert.equal(transfer.scopeKey, "middle1-1-to-middle2-2");
  assert.equal(transfer.scopeKind, "terminal-unit");
  assert.equal(transfer.terminalUnit.unit, "전 과정");
  assert.equal(transfer.state, "verified-original");
  assert.equal(transfer.label, "중2-2 전 과정까지 편입 1차");
  assert.equal(transfer.difficultyPlan, "기준 우선 · 올림 유형으로 변별");
  assert.equal(dp.targets.some(target => target.id === "director-transfer"), true);
  assert.equal(dp.targets.find(target => target.id === "director-transfer").difficultyPlan.includes("올림 우선"), true);
  assert.equal(dp.typeEmphasis.includes("그래프 해석"), true);
  assert.equal(dp.scorePolicy.includes("원본 배점·컷"), true);
});

test("practice bank is student-session gated and exposes no admin route", () => {
  assert.equal(pageSource.includes("../shared/runtime.js"), true);
  assert.equal(pageSource.includes("../shared/auth.js"), true);
  assert.equal(pageSource.includes("HIGHSELECT_AUTH.requireSession('../login.html')"), true);
  assert.equal(pageSource.includes("../admin/"), false);
  assert.equal(pageSource.includes("승인 관리"), false);
});

test("repeat practice keeps original, twin, similar, and mastery stages", () => {
  assert.deepEqual(Array.from(bank.practice.stages, item => item.id), ["original", "twin", "similar", "mastery"]);
  assert.deepEqual(Array.from(bank.practice.bands, item => item.id), ["lowered", "standard", "raised"]);
  assert.equal(bank.practice.releaseRules.some(rule => rule.includes("같은 수치만 반복하지 않음")), true);
  assert.equal(bank.practice.releaseRules.some(rule => rule.includes("최근 풀이 이력")), true);
  assert.equal(pageSource.includes("exam.releaseStatus==='released'"), true);
  assert.equal(pageSource.includes("exam.classificationStatus==='verified'"), true);
  assert.equal(pageSource.includes("exam.answerStatus==='verified'"), true);
  assert.equal(pageSource.includes("쌍둥이·유사문제가 모두 승인되기 전에는 이 시험의 연습 세트를 열지 않습니다"), true);
});

test("practice page exposes no original, answer, or private path payload", () => {
  const serialized = schemaSource + "\n" + pageSource;
  ["questionText", "answerKey", "correctAnswer", "G:\\\\", "C:\\\\Users", ".pdf"].forEach(term => {
    assert.equal(serialized.includes(term), false, `${term} must stay private`);
  });
  assert.equal(pageSource.includes("hsmiddle/data.js"), false, "hsmiddle student and answer data must not be imported");
});
