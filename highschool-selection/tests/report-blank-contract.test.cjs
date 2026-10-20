"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const scorer = require("../server/private-scorer.js");
const { buildReport } = require("../server/report-builder.js");
const security = require("../shared/report-security.js");
const learning = require("../shared/report-learning-plan.js");

const EXAM_ID = "synthetic-blank-contract";
const exam = { id: EXAM_ID, examId: EXAM_ID, title: "검사용 시험", questionCount: 3,
  releaseStatus: "released", answerStatus: "verified", classificationStatus: "verified" };
const schema = { questions: [1, 2, 3].map(number => ({ number, responseType: "input" })) };
const data = { schemaVersion: "highselect-private-scorer/v1", exams: {
  [EXAM_ID]: { gradingVersion: "synthetic-v1", classificationStatus: "verified",
    items: [1, 2, 3].map(number => ({ number, responseType: "input",
      answerSpec: { type: "input", answers: ["42"] },
      classification: { points: 1, domain: number === 2 ? "기하" : "대수", gradeBand: "중3",
        semester: "1학기", majorUnit: number === 2 ? "기하" : "문자와 식",
        minorUnit: number === 2 ? "도형의 성질" : "인수분해", detailType: `유형 ${number}`,
        difficulty: "standard", evidence: [`synthetic-source:q${number}`] }
    })) }
} };

async function reportFor(values) {
  const answers = values.map((value, index) => ({ responseType: "input", value, number: index + 1 }));
  const scored = await scorer.createAdapter({ data }).score(EXAM_ID, answers, schema);
  const raw = buildReport({ attemptId: "synthetic-attempt", studentId: "synthetic-student", exam,
    submittedAt: "2026-09-30T00:00:00Z", scored });
  const validated = security.validateReport(raw, { attemptId: "synthetic-attempt",
    session: { studentId: "synthetic-student" }, exams: [exam] });
  return { raw, validated, plan: learning.buildPlan(validated) };
}

test("빈 답은 채점·학기별 집계·학부모 처방 끝까지 미응시로 남는다", async () => {
  const { raw, validated, plan } = await reportFor(["42", "", "41"]);
  assert.deepEqual(raw.items.map(item => item.state), ["correct", "blank", "wrong"]);
  assert.deepEqual([validated.correctCount, validated.wrongCount, validated.blankCount], [1, 1, 1]);
  assert.equal(validated.score, 1);
  assert.deepEqual(validated.byTermUnit.map(row => [row.label, row.wrongNumbers, row.blankNumbers]), [
    ["중3 · 1학기 · 문자와 식 · 인수분해", [3], []],
    ["중3 · 1학기 · 기하 · 도형의 성질", [], [2]]
  ]);
  assert.deepEqual(validated.weakPriorities.flatMap(item => item.evidence), [3]);
  assert.deepEqual(validated.comments.find(item => item.type === "unattempted").evidence.itemNumbers, [2]);
  assert.deepEqual(plan.priorityNumbers, [3]);
  assert.deepEqual(plan.unattemptedNumbers, [2]);
  assert.equal(plan.stages[0].targetScore, 2);
  assert.equal(JSON.stringify(validated).includes('"answers"'), false);
});

test("전부 미응시이면 오답 약점이나 가상의 회복 점수를 만들지 않는다", async () => {
  const { raw, validated, plan } = await reportFor(["", "", ""]);
  assert.deepEqual(raw.items.map(item => item.state), ["blank", "blank", "blank"]);
  assert.deepEqual([validated.correctCount, validated.wrongCount, validated.blankCount], [0, 0, 3]);
  assert.deepEqual(validated.weakPriorities, []);
  assert.equal(validated.comments.some(item => item.type === "weakness" || item.type === "item-prescription"), false);
  assert.deepEqual(plan.priorityNumbers, []);
  assert.deepEqual(plan.stages[0].itemNumbers, [1, 2, 3]);
  assert.equal(plan.stages[0].targetScore, null);
});

test("미응시 수나 미응시 코멘트를 조작하면 분석지를 거부한다", async () => {
  const { raw } = await reportFor(["42", "", "41"]);
  const context = { attemptId: "synthetic-attempt", session: { studentId: "synthetic-student" }, exams: [exam] };
  const alteredCount = structuredClone(raw);
  alteredCount.blankCount = 0;
  assert.throws(() => security.validateReport(alteredCount, context), /미응시 합계/);
  const alteredEvidence = structuredClone(raw);
  alteredEvidence.comments.find(item => item.type === "unattempted").evidence.itemNumbers = [3];
  assert.throws(() => security.validateReport(alteredEvidence, context), /미응시 안내/);
});
