import assert from "node:assert/strict";
import { COURSE02_A1_POLYGON_LESSON, course02PolygonConceptMarkup } from "./golden-bell-course02-polygon-lesson.js";

const lesson = COURSE02_A1_POLYGON_LESSON;
const forbiddenKeys = /(?:^|\.)(answer|solution|correctAnswer|officialAnswer|workedAnswer|workedSolution)(?:$|[.:])/i;
const forbiddenSource = /(?:[A-Z]:[\\/]|(?:\.pdf|\.pptx?|\.png)\b|sourceFile|sourcePath|sourcePage|teacherAnswer)/i;
const allItems = [...lesson.original.items, lesson.extension, ...lesson.similarPractice];

assert.equal(lesson.experience.kind, "course-concept");
assert.equal(lesson.experience.tracks.length, 2);
assert.equal(lesson.experience.tracks.every((track) => track.beats.length === 4), true);
assert.equal(lesson.learnerStage, "필즈 더 클래식 2과정 A1; 연령 미확정");
assert.equal(lesson.original.items.length, 4);
assert.equal(lesson.similarPractice.length, 5);
assert.equal(allItems.length, 10);
assert.equal(new Set(allItems.map((item) => item.id)).size, 10);
assert.equal(allItems.every((item) => Object.keys(item).includes("answerRef")), true);
assert.equal(allItems.every((item) => item.answerMode === "input" && item.inputMode === "numeric"), true);
assert.equal(allItems.every((item) => /몇 (?:개|개씩)/.test(item.prompt)), true);

const walk = (value, path = "root") => {
  if (value && typeof value === "object") for (const [key, child] of Object.entries(value)) {
    assert.equal(forbiddenKeys.test(`${path}.${key}`), false, `forbidden key ${path}.${key}`);
    walk(child, `${path}.${key}`);
  } else if (typeof value === "string") {
    assert.equal(forbiddenSource.test(value), false, `source-like value at ${path}`);
  }
};
walk(lesson);
assert.equal(allItems.every((item) => Object.keys(item).filter((key) => key.toLowerCase().includes("answer") && !["answerRef", "answerMode"].includes(key)).length === 0), true);

const pointCount = (sides, pointsPerSide) => sides * (pointsPerSide - 1);
const inverse = (sides, total) => total % sides === 0 ? total / sides + 1 : null;
const regularCases = allItems.filter(({ visual }) => visual.kind === "regular-polygon-points");
assert.equal(regularCases.every(({ visual }) => visual.sides >= 3 && visual.pointsPerSide >= 2), true);
assert.equal(regularCases.every(({ visual }) => pointCount(visual.sides, visual.pointsPerSide) > 0), true);
const transferCases = allItems.filter(({ visual }) => visual.kind === "polygon-transfer");
assert.equal(transferCases.every(({ visual }) => visual.fromSides >= 3 && visual.toSides >= 3 && visual.fromPointsPerSide >= 2), true);
assert.equal(transferCases.every(({ visual }) => inverse(visual.toSides, pointCount(visual.fromSides, visual.fromPointsPerSide)) !== null), true);
assert.equal(inverse(4, 21), null, "a non-divisible transfer must remain unavailable");

for (const visual of [...lesson.experience.tracks.flatMap((track) => track.beats.map((beat) => beat.visual)), ...allItems.map((item) => item.visual)]) {
  const markup = course02PolygonConceptMarkup(visual);
  assert.ok(markup.length > 100);
  assert.equal(markup.includes("undefined"), false);
  assert.equal(markup.includes("NaN"), false);
  assert.equal(markup.includes("<svg"), true);
  assert.equal(markup.includes("<circle"), true);
}
const problemMarkup = course02PolygonConceptMarkup({ kind: "regular-polygon-points", sides: 3, pointsPerSide: 4, phase: "problem" });
assert.equal(/=\s*9/.test(problemMarkup), false);
const transferProblem = course02PolygonConceptMarkup({ kind: "polygon-transfer", fromSides: 3, fromPointsPerSide: 7, toSides: 6, phase: "problem" });
assert.equal(transferProblem.match(/<circle/g)?.length, 18, "target polygon must not reveal its point placement");
const verifyMarkup = course02PolygonConceptMarkup({ kind: "regular-polygon-points", sides: 3, pointsPerSide: 4, phase: "verify" });
assert.equal(/=\s*9/.test(verifyMarkup), true);
assert.equal(/<svg[^>]*>/.test(verifyMarkup), true);
console.log(`COURSE02_A1_POLYGON_AUDIT_OK items=${allItems.length} tracks=${lesson.experience.tracks.length}`);
