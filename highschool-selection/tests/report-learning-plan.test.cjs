const test = require("node:test");
const assert = require("node:assert/strict");
const planner = require("../shared/report-learning-plan.js");

function validatedReport() {
  return {
    questionCount: 6,
    correctCount: 3,
    score: 9.4,
    totalPoints: 20.2,
    items: [
      { number: 1, state: "correct", points: 2.7, domain: "수와 연산" },
      { number: 2, state: "wrong", points: 4.2, domain: "기하" },
      { number: 3, state: "wrong", points: 2.7, domain: "수와 연산" },
      { number: 4, state: "correct", points: 3.4, domain: "기하" },
      { number: 5, state: "wrong", points: 3.9, domain: "기하" },
      { number: 6, state: "correct", points: 3.3, domain: "자료와 가능성" }
    ]
  };
}

test("builds point and domain score aggregates from O/X results", () => {
  const plan = planner.buildPlan(validatedReport());
  assert.deepEqual(plan.byPoints, [
    { label: "2.7점", earnedPoints: 2.7, totalPoints: 5.4, rate: 50, correctCount: 1, questionCount: 2 },
    { label: "3.3점", earnedPoints: 3.3, totalPoints: 3.3, rate: 100, correctCount: 1, questionCount: 1 },
    { label: "3.4점", earnedPoints: 3.4, totalPoints: 3.4, rate: 100, correctCount: 1, questionCount: 1 },
    { label: "3.9점", earnedPoints: 0, totalPoints: 3.9, rate: 0, correctCount: 0, questionCount: 1 },
    { label: "4.2점", earnedPoints: 0, totalPoints: 4.2, rate: 0, correctCount: 0, questionCount: 1 }
  ]);
  assert.deepEqual(plan.byDomain, [
    { label: "수와 연산", earnedPoints: 2.7, totalPoints: 5.4, rate: 50, correctCount: 1, questionCount: 2 },
    { label: "기하", earnedPoints: 3.4, totalPoints: 11.5, rate: 29.6, correctCount: 1, questionCount: 3 },
    { label: "자료와 가능성", earnedPoints: 3.3, totalPoints: 3.3, rate: 100, correctCount: 1, questionCount: 1 }
  ]);
});

test("starts with up to three actual wrong items ordered by lower points then number", () => {
  const plan = planner.buildPlan(validatedReport());
  assert.deepEqual(plan.priorityNumbers, [3, 5, 2]);
  assert.deepEqual(plan.stages[0], {
    title: "1단계 · 되찾을 점수부터",
    message: "선택한 오답을 해설 없이 다시 풀고, 사용한 식·표·그림의 이유를 설명해 보세요.",
    itemNumbers: [3, 5, 2],
    targetScore: 20.2
  });
  assert.equal(plan.stages[1].targetScore, null);
  assert.equal(plan.stages[2].targetScore, null);
  assert.deepEqual(plan.stages[1].itemNumbers, []);
  assert.deepEqual(plan.stages[2].itemNumbers, []);
  assert.match(plan.stages[1].message, /선생님과 확인/);
  assert.match(plan.stages[2].message, /선생님과 정/);
});

test("uses only the current score plus selected wrong-item points for stage one", () => {
  const report = validatedReport();
  report.items.push({ number: 7, state: "wrong", points: 10, domain: "문자와 식" });
  report.questionCount = 7;
  report.totalPoints = 30.2;
  const plan = planner.buildPlan(report);
  assert.deepEqual(plan.priorityNumbers, [3, 5, 2]);
  assert.equal(plan.stages[0].targetScore, 20.2);
  assert.equal(plan.totalPoints, 30.2);
});

test("does not invent priority items or later-stage targets when there are no wrong answers", () => {
  const report = {
    questionCount: 2,
    correctCount: 2,
    score: 5,
    totalPoints: 5,
    items: [
      { number: 1, state: "correct", points: 2, domain: "수와 연산" },
      { number: 2, state: "correct", points: 3, domain: "기하" }
    ]
  };
  const plan = planner.buildPlan(report);
  assert.deepEqual(plan.priorityNumbers, []);
  assert.equal(plan.stages[0].targetScore, 5);
  assert.deepEqual(plan.stages.map(stage => stage.itemNumbers), [[], [], []]);
  assert.deepEqual(plan.stages.map(stage => stage.targetScore), [5, null, null]);
});

test("is deterministic and does not mutate its input", () => {
  const report = validatedReport();
  const before = structuredClone(report);
  const first = planner.buildPlan(report);
  const second = planner.buildPlan(report);
  assert.deepEqual(report, before);
  assert.deepEqual(first, second);
  assert.notStrictEqual(first.priorityNumbers, first.stages[0].itemNumbers);
});

test("fails closed on non-finite points and totals", () => {
  const badPoints = validatedReport();
  badPoints.items[0].points = Number.NaN;
  assert.throws(() => planner.buildPlan(badPoints), /배점/);

  const badScore = validatedReport();
  badScore.score = Number.POSITIVE_INFINITY;
  assert.throws(() => planner.buildPlan(badScore), /현재 점수/);

  const badTotal = validatedReport();
  badTotal.totalPoints = "not-a-number";
  assert.throws(() => planner.buildPlan(badTotal), /만점/);
});

test("rejects null, boolean, and numeric-string score values instead of coercing them", () => {
  const nullPoints = validatedReport();
  nullPoints.items[0].points = null;
  assert.throws(() => planner.buildPlan(nullPoints), /배점/);

  const booleanEarned = validatedReport();
  booleanEarned.items[1].earnedPoints = false;
  assert.throws(() => planner.buildPlan(booleanEarned), /득점/);

  const stringScore = validatedReport();
  stringScore.score = "9.4";
  assert.throws(() => planner.buildPlan(stringScore), /현재 점수/);

  const stringTotal = validatedReport();
  stringTotal.totalPoints = "20.2";
  assert.throws(() => planner.buildPlan(stringTotal), /만점/);
});

test("does not treat earnedPoints as partial credit under the current O/X contract", () => {
  const correctExact = validatedReport();
  correctExact.items[0].earnedPoints = 2.7;
  const wrongExact = validatedReport();
  wrongExact.items[1].earnedPoints = 0;
  assert.equal(planner.buildPlan(correctExact).score, 9.4);
  assert.equal(planner.buildPlan(wrongExact).score, 9.4);

  const partial = validatedReport();
  partial.items[1].earnedPoints = 2.1;
  partial.score = 11.5;
  assert.throws(() => planner.buildPlan(partial), /O\/X 채점 결과/);

  const nonFinite = validatedReport();
  nonFinite.items[1].earnedPoints = Number.NaN;
  assert.throws(() => planner.buildPlan(nonFinite), /득점/);
});

test("rejects inconsistent report totals, counts, and item-number order", () => {
  const wrongScore = validatedReport();
  wrongScore.score = 10;
  assert.throws(() => planner.buildPlan(wrongScore), /점수 합계/);

  const wrongQuestionCount = validatedReport();
  wrongQuestionCount.questionCount = 5;
  assert.throws(() => planner.buildPlan(wrongQuestionCount), /문항 수/);

  const duplicate = validatedReport();
  duplicate.items[1].number = 1;
  assert.throws(() => planner.buildPlan(duplicate), /문항 번호/);

  const outOfOrder = validatedReport();
  [outOfOrder.items[0], outOfOrder.items[1]] = [outOfOrder.items[1], outOfOrder.items[0]];
  assert.throws(() => planner.buildPlan(outOfOrder), /문항 번호/);
});

test("exposes the browser UMD name", () => {
  assert.equal(globalThis.HIGHSELECT_REPORT_LEARNING_PLAN, planner);
  assert.equal(typeof planner.buildPlan, "function");
});
