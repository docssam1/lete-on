const test = require("node:test");
const assert = require("node:assert/strict");
const planner = require("../data/exam-generation-planner.js");

function candidate(index, difficultyBand, inputType, familyId, domainGroup) {
  return {
    itemId: `item-${index}`,
    itemVersionId: `v${index}`,
    curriculumPath: `M2-1/U${index}/D${index}`,
    typeCode: `TYPE_${index}`,
    familyId: familyId || `family-${index}`,
    domainGroup: domainGroup || null,
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

test("reassigns an earlier cell deterministically when greedy family selection would fail", () => {
  const candidates = [
    candidate(1, "standard", "single_choice", "shared"),
    candidate(2, "standard", "single_choice", "objective-only"),
    candidate(3, "standard", "input", "shared")
  ];
  const planned = planner.planExam(candidates, options({
    questionCount: 2,
    difficultyWeights: { lowered: 0, standard: 1, raised: 0 },
    responseWeights: { objective: 1, subjective: 1 },
    maxPerFamily: 1,
    seed: 7
  }));
  assert.deepEqual(new Set(planned.items.map(item => item.itemId)), new Set(["item-2", "item-3"]));
  assert.equal(planned.summary.familyCount, 2);
});

test("rejects unsupported answer formats and duplicate item ids", () => {
  assert.throws(() => planner.planExam([candidate(1, "standard", "essay")], options({ questionCount: 1 })), /inputType/);
  assert.throws(() => planner.planExam([
    candidate(1, "standard", "input"),
    candidate(1, "standard", "input")
  ], options({ questionCount: 1 })), /duplicate itemId/);
});

test("enforces an exact algebra and geometry split together with difficulty and response quotas", () => {
  const candidates = [];
  let index = 1;
  for (const domain of ["algebra", "geometry"]) {
    for (const difficulty of planner.DIFFICULTIES) {
      for (let count = 0; count < 10; count += 1) candidates.push(candidate(index++, difficulty, "single_choice", null, domain));
      for (let count = 0; count < 10; count += 1) candidates.push(candidate(index++, difficulty, "input", null, domain));
    }
  }
  const planned = planner.planExam(candidates, options({
    questionCount: 30,
    difficultyWeights: { lowered: 20, standard: 50, raised: 30 },
    responseWeights: { objective: 40, subjective: 60 },
    domainQuotas: { algebra: 15, geometry: 15 }
  }));
  const byId = new Map(candidates.map(item => [item.itemId, item]));
  const counts = planned.items.reduce((result, item) => {
    const domain = byId.get(item.itemId).domainGroup;
    result[domain] += 1;
    return result;
  }, { algebra: 0, geometry: 0 });
  assert.deepEqual(counts, { algebra: 15, geometry: 15 });
  assert.deepEqual(planned.summary.domain, { algebra: 15, geometry: 15 });
  assert.deepEqual(planned.summary.difficulty, { lowered: 6, standard: 15, raised: 9 });
  assert.deepEqual(planned.summary.response, { objective: 12, subjective: 18 });
});

test("fails closed when the exact domain split cannot be satisfied", () => {
  const candidates = pool().map((item, index) => ({ ...item, domainGroup: index < 5 ? "geometry" : "algebra" }));
  assert.throws(() => planner.planExam(candidates, options({
    questionCount: 20,
    domainQuotas: { algebra: 10, geometry: 10 }
  })), /domain, difficulty, response, and family quotas/);
});
