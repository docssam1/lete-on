import assert from "node:assert/strict";
import { repeatingPatternModel, equalQuotientRemainderModel } from "./course-learning-models.js";

let patternCases = 0;
for (let length = 2; length <= 8; length += 1) {
  const cycle = Array.from({ length }, (_, index) => `shape-${index % 3}`);
  const stream = [];
  while (stream.length < 500) stream.push(...cycle);
  for (let position = 1; position <= 500; position += 1) {
    const model = repeatingPatternModel({ cycle, position });
    assert.equal(model.answer, stream[position - 1]);
    assert.equal(model.groupStart + model.slot - 1, position);
    assert.ok(model.slot >= 1 && model.slot <= length);
    assert.equal(model.quotient * length + model.remainder, position);
    patternCases += 1;
  }
  const model = repeatingPatternModel({ cycle, position: length });
  model.cycle[0] = "changed";
  assert.notEqual(cycle[0], "changed");
}

let divisionCases = 0;
for (let divisor = 2; divisor <= 60; divisor += 1) {
  // Independent enumeration uses actual integer division, not the model formula.
  const all = [];
  for (let number = 1; number <= 4000; number += 1) {
    if (Math.floor(number / divisor) === number % divisor) all.push(number);
  }
  for (const [minimum, maximum] of [[1, 4000], [1, 1], [5, 17], [20, 200], [100, 1000], [3990, 4000]]) {
    const model = equalQuotientRemainderModel({ divisor, minimum, maximum });
    const expected = all.filter((number) => number >= minimum && number <= maximum);
    assert.deepEqual(model.candidates.map((item) => item.number), expected);
    assert.equal(model.count, expected.length);
    assert.equal(model.first, expected.length ? model.candidates[0].quotient : null);
    divisionCases += 1;
  }
}
assert.equal(equalQuotientRemainderModel({ divisor: 1000 }).count, 999);
assert.equal(repeatingPatternModel({ cycle: ["a", "b", "c"], position: 1000000 }).answer, "a");
for (const position of [0, -1, 1.5, NaN, Infinity, "3", 1000001]) {
  assert.throws(() => repeatingPatternModel({ cycle: ["a", "b"], position }));
}
for (const cycle of [[], ["a"], [null, "b"], [" ", "b"], "ab", Array(9).fill("a")]) {
  assert.throws(() => repeatingPatternModel({ cycle, position: 1 }));
}
for (const divisor of [0, 1, -1, 2.5, NaN, Infinity, "3", 1001]) {
  assert.throws(() => equalQuotientRemainderModel({ divisor }));
}
assert.throws(() => equalQuotientRemainderModel({ divisor: 4, minimum: 20, maximum: 10 }));
assert.throws(() => equalQuotientRemainderModel({ divisor: 4, minimum: 0 }));
console.log(JSON.stringify({ status: "COURSE_LEARNING_MODELS_OK", patternCases, divisionCases }));
