import assert from "node:assert/strict";
import { COUNTERFEIT_KIND, COURSE02_A1_COUNTERFEIT_LESSON, counterfeitConceptMarkup } from "./golden-bell-course02-counterfeit-lesson.js";

const lesson = COURSE02_A1_COUNTERFEIT_LESSON;
const items = [...lesson.original.items, lesson.extension, ...lesson.similarPractice];
const forbiddenKey = /(?:^|\.)(answer|solution|correctAnswer|officialAnswer|workedAnswer|workedSolution)(?:$|[.:])/i;
const forbiddenSource = /(?:[A-Z]:[\\/]|(?:\.pdf|\.pptx?|\.png)\b|sourceFile|sourcePath|sourcePage|teacherAnswer)/i;
assert.equal(lesson.experience.tracks.length, 2);
assert.equal(lesson.experience.tracks.every((track) => track.beats.length >= 4), true);
assert.equal(lesson.original.items.length, 4);
assert.equal(lesson.similarPractice.length + 1, 6);
assert.equal(items.length, 10);
assert.equal(new Set(items.map((item) => item.id)).size, items.length);
assert.equal(items.every((item) => item.answerMode === "input" && item.inputMode === "numeric" && item.answerRef), true);
assert.equal(items.every((item) => item.answerRef === `/course23/course-02-a1/${item.id}`), true);
assert.equal(lesson.dailyPractice.similar, 5);

const walk = (value, path = "root") => {
  if (value && typeof value === "object") for (const [key, child] of Object.entries(value)) { assert.equal(forbiddenKey.test(`${path}.${key}`), false, `${path}.${key}`); walk(child, `${path}.${key}`); }
  else if (typeof value === "string") assert.equal(forbiddenSource.test(value), false, `${path} contains private/source wording`);
};
walk(lesson);

const candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const weigh = (left, right, counterfeit) => {
  const mass = (set) => set.reduce((sum, value) => sum + (value === counterfeit ? 0 : 1), 0);
  return Math.sign(mass(right) - mass(left));
};
const signatures = (counterfeit) => {
  const first = weigh([1, 2, 3], [4, 5, 6], counterfeit);
  const pool = first === 0 ? [7, 8, 9] : first > 0 ? [1, 2, 3] : [4, 5, 6];
  const second = weigh([pool[0]], [pool[1]], counterfeit);
  return { first, pool, second, final: second === 0 ? pool[2] : second > 0 ? pool[0] : pool[1] };
};
const outcomes = candidates.map(signatures);
assert.equal(new Set(outcomes.map((entry) => `${entry.first}:${entry.second}:${entry.final}`)).size, 9);
assert.equal(outcomes.every((entry, index) => entry.final === index + 1), true);
assert.equal(Math.ceil(Math.log2(9)), 4, "binary lower bound is not the relevant ternary weighing bound");
assert.equal(Math.ceil(Math.log(9) / Math.log(3) - 1e-10), 2, "minimum ternary comparisons must be two");

for (const visual of [...lesson.experience.tracks.flatMap((track) => track.beats.map((beat) => beat.visual)), ...items.map((item) => item.visual)]) {
  const markup = counterfeitConceptMarkup(visual);
  assert.ok(markup.includes("course02-counterfeit-visual"));
  if (visual.compare) assert.ok(markup.includes("course02-counterfeit-scale"));
  assert.equal(markup.includes("undefined"), false);
  assert.equal(markup.includes("NaN"), false);
  assert.equal((markup.match(/course02-counterfeit-pan/g) || []).length <= 2, true);
}
assert.equal(JSON.stringify(lesson).includes("workedSolution"), false);
console.log(`COURSE02_COUNTERFEIT_AUDIT_OK items=${items.length} tracks=${lesson.experience.tracks.length} minimumWeighings=2 uniqueOutcomes=9`);
