"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { buildCandidateDb, assertSafe } = require("../scripts/build-saengsu-legacy-candidate-db.cjs");

function question(number, options) {
  const values = options || {};
  return {
    number,
    currentRange: values.currentRange !== false,
    semester: values.currentRange === false ? "중2-1" : "중2-2",
    domain: values.domain || (number % 2 ? "대수" : "기하"),
    majorUnit: "대단원",
    minorUnit: "소단원",
    fineType: `세부유형 ${number}`,
    difficulty: values.difficulty || "심화",
    answerKeyPresent: true,
    solutionPresent: true,
    structureUse: values.currentRange === false ? "exclude" : "adapt",
    difficultyAction: values.currentRange === false ? "review" : "raise"
  };
}
function audit(kind, overrides) {
  const questions = Array.from({ length: 30 }, (_, index) => question(index + 1));
  Object.entries(overrides || {}).forEach(([number, values]) => { questions[Number(number) - 1] = question(Number(number), values); });
  if (kind === "r02") {
    return { questions: questions.map((item) => ({
      number: item.number,
      withinCurrentRange: item.currentRange,
      semesters: [item.semester],
      primaryDomain: item.domain,
      largeUnit: item.majorUnit,
      smallUnit: item.minorUnit,
      detailType: item.fineType,
      difficulty: item.difficulty,
      answerPresent: true,
      explanationPresent: true,
      structureUse: item.structureUse,
      difficultyAction: item.difficultyAction
    })) };
  }
  return { questions };
}
function profile() {
  return {
    profileId: "SM_CM1_ENTRY_STANDARD",
    academyStyleId: "SM_STANDARD",
    publicLabel: "생수형 대비 추정 구성",
    forbiddenLabel: "생수 공식 기출",
    currentExam: { range: ["중2-2", "중3-1", "중3-2"], questionCount: 30, timeMinutes: 180, passCount: 20, domainBalance: { "대수": 15, "기하": 15 } },
    difficultyDecision: { direction: "higher_than_2022_legacy_samples" },
    combinedAudit: { questionCount: 60, withinCurrentRange: 58, withinCurrentRangeDomainCounts: { "대수": 29, "기하": 29 } }
  };
}

test("builds a locked metadata-only SM candidate DB with two-axis review state", () => {
  const r01 = audit("r01", { 1: { currentRange: false, domain: "대수" } });
  const r02 = audit("r02", { 2: { currentRange: false, domain: "기하" } });
  const output = buildCandidateDb({ r01, r02, profile: profile() });
  assert.equal(output.summary.paperCount, 2);
  assert.equal(output.summary.questionCount, 60);
  assert.equal(output.summary.currentRangeCount, 58);
  assert.equal(output.summary.excludedCount, 2);
  assert.equal(output.summary.usageApprovedCount, 0);
  assert.deepEqual(output.summary.structureUse, { retain: 0, adapt: 58, exclude: 2 });
  assert.deepEqual(output.summary.difficultyAction, { retain: 0, raise: 58, review: 2 });
  assert.equal(output.questions.every((item) => item.releaseStatus === "locked"), true);
  assert.equal(output.questions.every((item) => item.responseEvidence.independentCorrectnessVerified === false), true);
  assert.deepEqual(output.representativePolicy.referenceCutline, { score: 20, total: 30, status: "public_reference_only" });
  assert.equal(output.representativePolicy.operationalCutline, null);
  assert.equal(output.representativePolicy.cutlineStatus, "locked_non_operational");
  assert.equal(Object.prototype.hasOwnProperty.call(output.representativePolicy, "passCount"), false);
  assertSafe(output, "output");
  const serialized = JSON.stringify(output);
  ["questionText", "answerKey", "sourcePath", "C:\\\\Users", "G:\\\\"].forEach((term) => assert.equal(serialized.includes(term), false));
});

test("rejects incomplete numbering, unexcluded out-of-range items, and profile drift", () => {
  const r01 = audit("r01", { 1: { currentRange: false, domain: "대수" } });
  const r02 = audit("r02", { 2: { currentRange: false, domain: "기하" } });
  r01.questions[0].structureUse = "adapt";
  assert.throws(() => buildCandidateDb({ r01, r02, profile: profile() }), /must be excluded/);
  r01.questions[0].structureUse = "exclude";
  r02.questions.pop();
  assert.throws(() => buildCandidateDb({ r01, r02, profile: profile() }), /must contain 30 questions/);
  r02.questions.push(audit("r02").questions[29]);
  const drifted = profile();
  drifted.combinedAudit.withinCurrentRange = 59;
  assert.throws(() => buildCandidateDb({ r01, r02, profile: drifted }), /profile and audit totals disagree/);
});

test("rejects protected payload keys and absolute paths", () => {
  assert.throws(() => assertSafe({ questionText: "protected" }, "candidate"), /forbidden/);
  assert.throws(() => assertSafe({ answer_key: "protected" }, "candidate"), /forbidden/);
  assert.throws(() => assertSafe({ question_body: "protected" }, "candidate"), /forbidden/);
  assert.throws(() => assertSafe({ note: "C:\\Users\\user\\private.pdf" }, "candidate"), /path-like/);
  assert.throws(() => assertSafe({ note: "../private/source.pdf" }, "candidate"), /path-like/);
});

test("rejects a current-range question tagged with an out-of-range semester", () => {
  const r01 = audit("r01");
  const r02 = audit("r02");
  r01.questions[0].semester = "중2-1";
  assert.throws(() => buildCandidateDb({ r01, r02, profile: profile() }), /outside the current range/);
});
