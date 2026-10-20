"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
require(path.join(root, "data", "catalog.js"));
require(path.join(root, "data", "academy-engagement.js"));
const policy = require(path.join(root, "data", "standard-exam-policy.js"));
const serverPolicy = require(path.join(root, "server", "standard-exam-policy.js"));

test("every advertised preparation course has an explicit standard-exam policy", () => {
  const audit = policy.auditAll(global.HIGHSELECT_ACADEMY_ENGAGEMENT, global.HIGHSELECT_CATALOG);
  assert.equal(audit.eligible, true, audit.issues.join("\n"));
  assert.equal(audit.rows.length, global.HIGHSELECT_ACADEMY_ENGAGEMENT.programs.reduce((sum, program) => sum + program.courses.length, 0));
  assert.ok(audit.rows.every(row => row.required === true));
  assert.ok(audit.rows.every(row => row.blueprint));
});

test("a course cannot be sold or applied to before every standard exam gate passes", () => {
  const current = policy.resolve("SH", "high-selection", global.HIGHSELECT_CATALOG);
  assert.equal(current.standardExamId, "sh-selection-r01");
  assert.equal(current.canApply, false);
  assert.equal(current.canSell, false);
  assert.deepEqual(current.responseMix, {
    objective: 0,
    shortAnswer: 40,
    writtenSolution: 0,
    status: "verified",
    basis: "40문항 응답 형식 검수"
  });
  assert.equal(current.progress.targetQuestionCount, 40);
  assert.equal(current.progress.reviewedQuestionCount, 40);
  assert.equal(current.progress.releasedQuestionCount, 0);
  assert.deepEqual(current.blockers, ["최종 공개 승인"]);

  const approvedCatalog = {
    exams: [{
      id: "sh-selection-r01",
      title: "approved standard",
      questionCount: 40,
      sourceStatus: "audited",
      answerStatus: "verified",
      classificationStatus: "verified",
      releaseStatus: "released"
    }]
  };
  const approved = policy.resolve("SH", "high-selection", approvedCatalog);
  assert.equal(approved.state, "ready");
  assert.equal(approved.canApply, true);
  assert.equal(approved.canSell, true);
  assert.equal(approved.progress.releasedQuestionCount, 40);
});

test("verified response ratios are separated from unconfirmed or historical observations", () => {
  const dolpa = policy.resolve("DP", "common1-basic", global.HIGHSELECT_CATALOG);
  assert.equal(dolpa.responseMixLabel, "객관식 19 · 주관식 11 · 서술형 0");
  assert.equal(dolpa.gates.responseMix, true);
  assert.equal(dolpa.progress.reviewedQuestionCount, 0);
  assert.ok(dolpa.blockers.includes("독립 정답 검산"));

  const won = policy.resolve("WM", "middle21-basic", global.HIGHSELECT_CATALOG);
  assert.equal(won.responseMixLabel, "객관식·주관식·서술형 비율 확인 필요");
  assert.equal(won.gates.responseMix, false);
  assert.equal(won.gates.sourceDiversity, false);
  assert.equal(won.sourceDiversity.minimumSourceFamilies, 8);
  assert.equal(won.sourceDiversity.maximumItemsPerSourceFamily, 6);
  assert.ok(won.blockers.includes("여덟 출처 이상을 섞은 원수학 최상위 구성"));

  const eden = policy.resolve("ED", "high-advance", global.HIGHSELECT_CATALOG);
  assert.match(eden.responseMixLabel, /참고 사례$/);
  assert.equal(eden.gates.responseMix, false);
});

test("WM source diversity requires at least eight families and every core source", () => {
  const families = ["HS_G7", "SW_G7", "LIMITED_G7_OOP", "SUPERMATH_G7_OOP", "MATHGOD_G7_OOP", "DD_HIGH_G7", "AG_G7_OOP", "BL_G7_2025"];
  const balanced = families.flatMap(sourceFamilyId => Array.from({ length: 5 }, () => ({ sourceFamilyId })));
  const verified = policy.validateSourceDiversity(balanced, policy.courseBlueprints.WM["middle21-basic"].sourceDiversity, 40);
  assert.equal(verified.verified, true, verified.issues.join("\n"));
  assert.equal(verified.sourceFamilyCount, 8);
  assert.deepEqual(Array.from(verified.sourceFamilies, row => row.count), [5, 5, 5, 5, 5, 5, 5, 5]);

  const oneBook = Array.from({ length: 40 }, () => ({ sourceFamilyId: "AG_G7_OOP" }));
  const rejected = policy.validateSourceDiversity(oneBook, policy.courseBlueprints.WM["middle21-basic"].sourceDiversity, 40);
  assert.equal(rejected.verified, false);
  assert.ok(rejected.issues.some(issue => /출처군 1\/8/.test(issue)));
  assert.ok(rejected.issues.some(issue => /AG_G7_OOP 40\/6/.test(issue)));
  assert.ok(rejected.issues.some(issue => /필수 출처 누락: LIMITED_G7_OOP/.test(issue)));
});

test("the server rejects course opening even if a client tries to bypass the disabled button", () => {
  assert.throws(
    () => serverPolicy.assertCourseOpen("DP", "common1-basic"),
    error => error && error.code === "standard_exam_not_ready" && error.statusCode === 409
  );
  assert.equal(serverPolicy.auditConfiguration().eligible, true);
});

test("Mathflat imports remain private candidates until the full gate list and owner approval pass", () => {
  const mathflat = policy.sourceIntake.mathflat;
  assert.equal(mathflat.visibility, "private");
  assert.equal(mathflat.role, "supplemental-private-candidate");
  assert.equal(mathflat.states[0], "candidate_locked");
  assert.equal(mathflat.states.at(-1), "included");
  assert.ok(mathflat.requiredGates.includes("independent-answer"));
  assert.ok(mathflat.requiredGates.includes("response-mix"));
  assert.ok(mathflat.requiredGates.includes("single-answer-visibility"));
  assert.ok(mathflat.requiredGates.includes("learner-fit"));
  assert.ok(mathflat.requiredGates.includes("owner-approval"));
  assert.ok(mathflat.requiredGates.includes("desktop-mobile-a4"));
});

test("public and member pages share the same standard-exam policy module", () => {
  const promo = fs.readFileSync(path.join(root, "promo", "index.html"), "utf8");
  const library = fs.readFileSync(path.join(root, "library.html"), "utf8");
  const editor = fs.readFileSync(path.join(root, "admin", "exam-editor.html"), "utf8");
  for (const html of [promo, library]) {
    assert.match(html, /data\/academy-engagement\.js/);
    assert.match(html, /data\/standard-exam-policy\.js/);
    assert.match(html, /standardPolicy\.resolve/);
  }
  assert.match(promo, /academy-launcher/);
  assert.match(promo, /표준 시험지 승인 전에는 신청·판매를 열지 않습니다/);
  assert.match(library, /수강 대비 강좌/);
  assert.match(library, /standard\.responseMixLabel/);
  assert.match(library, /standard\.progress\.reviewedQuestionCount/);
  assert.match(library, /standard\.blockers/);
  assert.match(editor, /과정별 표준 시험지/);
  assert.match(editor, /standard-coverage-grid/);
  assert.match(editor, /data\/standard-exam-policy\.js/);
});
