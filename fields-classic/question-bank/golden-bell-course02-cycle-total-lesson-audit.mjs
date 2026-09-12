import assert from "node:assert/strict";
import { COURSE02_A1_CYCLE_TOTAL_LESSON, course02CycleTotalAnswer, course02CycleTotalConceptMarkup, course02CycleTotalModel } from "./golden-bell-course02-cycle-total-lesson.js";

const lesson = COURSE02_A1_CYCLE_TOTAL_LESSON;
const items = [...lesson.original.items, lesson.extension, ...lesson.similarPractice];
const serialized = JSON.stringify(lesson);

assert.equal(lesson.experience.tracks.length, 2);
assert.equal(lesson.experience.tracks.every((track) => track.beats.length === 4), true);
assert.equal(lesson.original.items.length, 4);
assert.equal(lesson.similarPractice.length, 5);
assert.equal(items.length, 10);
assert.equal(new Set(items.map((item) => item.id)).size, 10);
assert.equal(new Set(items.map((item) => item.answerRef)).size, 10);
assert.equal(/(?:[A-Z]:[\\/]|\.pdf|\.pptx?|teacherAnswer|officialAnswer|workedSolution)/i.test(serialized), false);
assert.equal(/"(?:answer|solution|correctAnswer)"\s*:/i.test(serialized), false);

const expected = ["검은 돌 / 18개", "검은 돌 / 13개", 186, 300, "흰 돌 / 33개", 261, "검은 돌 / 18개", 411, "흰 돌 / 1개", 417];
for (const [index, item] of items.entries()) assert.equal(course02CycleTotalAnswer(item.visual), expected[index], item.id);

for (let total = 1; total <= 500; total++) {
  const differenceVisual = { kind: "course02-cycle-total", task: "difference", cycle: ["흰 돌", "검은 돌", "검은 돌", "흰 돌", "검은 돌"], total };
  const model = course02CycleTotalModel(differenceVisual);
  const direct = differenceVisual.cycle.concat(...Array.from({ length: Math.ceil(total / 5) - 1 }, () => differenceVisual.cycle)).slice(0, total);
  const white = direct.filter((value) => value === "흰 돌").length;
  const black = direct.length - white;
  assert.deepEqual(model.counts, { "흰 돌": white, "검은 돌": black });
  assert.equal(white + black, total);

  const sumVisual = { kind: "course02-cycle-total", task: "sum", cycle: [4, 7, 2, 5], total };
  const sumModel = course02CycleTotalModel(sumVisual);
  const directSum = Array.from({ length: total }, (_, index) => sumVisual.cycle[index % sumVisual.cycle.length]).reduce((sum, value) => sum + value, 0);
  assert.equal(sumModel.sum, directSum);
}

for (const track of lesson.experience.tracks) {
  const problem = course02CycleTotalConceptMarkup(track.beats[0].visual);
  assert.equal((problem.match(/data-cycle-part="full"/g) || []).length, 2);
  assert.equal((problem.match(/data-cycle-part="partial"/g) || []).length, 1);
  assert.match(problem, /첫째 마디/);
  assert.match(problem, /둘째 마디/);
  assert.match(problem, /다음 2개/);
  assert.equal(problem.includes(String(course02CycleTotalAnswer(track.beats[0].visual))), false, "problem must not reveal answer");
  const verify = course02CycleTotalConceptMarkup(track.beats.at(-1).visual);
  assert.match(verify, /cycle-total-answer/);
  assert.equal(verify.includes("undefined"), false);
  assert.equal(verify.includes("NaN"), false);
}

console.log(`COURSE02_A1_CYCLE_TOTAL_AUDIT_OK items=${items.length} tracks=${lesson.experience.tracks.length} enumerated=1000`);
