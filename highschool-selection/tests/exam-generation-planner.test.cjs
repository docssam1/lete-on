const test = require("node:test");
const assert = require("node:assert/strict");
const planner = require("../data/exam-generation-planner.js");

function candidate(index, difficultyBand, inputType, familyId) {
  return {
    itemId: `item-${index}`,
    itemVersionId: `v${index}`,
    curriculumPath: `M2-1/U${index}/D${index}`,
    typeCode: `TYPE_${index}`,
    familyId: familyId || `family-${index}`,
    difficultyBand,
    inputType,
    score: 2
  };
}

function pool() {
  const result = [];
  let index = 1;
  for (const difficulty of planner.DIFFICULTIES) {
    for (let count = 0; count < 8; count += 1) result.push(candidate(index++, difficulty, "single_choice"));
    for (let count = 0; count < 8; count += 1) result.push(candidate(index++, difficulty, "input"));
  }
  return result;
}

function options(overrides = {}) {
  return {
    questionCount: 20,
    seed: 42,
    difficultyWeights: { lowered: 20, standard: 50, raised: 30 },
    responseWeights: { objective: 40, subjective: 60 },
    maxPerFamily: 1,
    ...overrides
  };
}

test("allocates exact counts by largest remainder", () => {
  assert.deepEqual(planner.allocate(7, { lowered: 1, standard: 1, raised: 1 }, planner.DIFFICULTIES), {
    lowered: 3, standard: 2, raised: 2
  });
});

test("creates a deterministic plan with exact difficulty and response ratios", () => {
  const first = planner.planExam(pool(), options());
  const second = planner.planExam(pool().reverse(), options());
  assert.deepEqual(first, second);
  assert.deepEqual(first.summary.difficulty, { lowered: 4, standard: 10, raised: 6 });
  assert.deepEqual(first.summary.response, { objective: 8, subjective: 12 });
  assert.equal(first.items.length, 20);
  assert.equal(new Set(first.items.map(item => item.itemId)).size, 20);
  assert.deepEqual(first.items.map(item => item.order), Array.from({ length: 20 }, (_, index) => index + 1));
});

test("a different seed changes order without changing the requested mix", () => {
  const first = planner.planExam(pool(), options({ seed: 11 }));
  const second = planner.planExam(pool(), options({ seed: 12 }));
  assert.notDeepEqual(first.items.map(item => item.itemId), second.items.map(item => item.itemId));
  assert.deepEqual(first.summary.difficulty, second.summary.difficulty);
  assert.deepEqual(first.summary.response, second.summary.response);
});

test("fails closed when a requested ratio or family cap cannot be met", () => {
  assert.throws(() => planner.planExam([
    candidate(1, "lowered", "input"),
    candidate(2, "standard", "input"),
    candidate(3, "raised", "input")
  ], options({ questionCount: 3, responseWeights: { objective: 1, subjective: 0 } })), /cannot satisfy/);
  assert.throws(() => planner.planExam([
    candidate(1, "lowered", "input", "same"),
    candidate(2, "standard", "input", "same"),
    candidate(3, "raised", "input", "same")
  ], options({ questionCount: 3, responseWeights: { objective: 0, subjective: 1 } })), /family diversity/);
});

test("rejects unsupported answer formats and duplicate item ids", () => {
  assert.throws(() => planner.planExam([candidate(1, "standard", "essay")], options({ questionCount: 1 })), /inputType/);
  assert.throws(() => planner.planExam([
    candidate(1, "standard", "input"),
    candidate(1, "standard", "input")
  ], options({ questionCount: 1 })), /duplicate itemId/);
});
