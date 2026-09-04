import assert from "node:assert/strict";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js";

const lesson = GOLDEN_BELL_BOOKS
  .find((book) => book.id === "book-04")
  ?.lessons.find((candidate) => candidate.id === "hidden-cube-count");

assert.ok(lesson, "book-04 hidden-cube lesson is missing");
assert.match(lesson.sourceLocator, /16~19쪽/u, "source-backed concept slide range changed");
assert.equal(lesson.experience.kind, "progressive-concept", "hidden-cube concept must use the shared animation pipeline");
assert.equal(lesson.experience.beats.length, 3, "height, total, and hidden-count scenes are required");
assert.deepEqual(lesson.experience.beats.map((beat) => beat.visual?.phase), ["height", "total", "hidden"], "source explanation order changed");
assert.ok(lesson.experience.beats.every((beat) => beat.visual?.kind === "book04-hidden-cube-concept"), "a concept scene is missing its geometry renderer");

assert.equal(lesson.original.mode, "paged", "each source item must keep its own answer area");
assert.equal(lesson.original.sourceQuestionCount, 3, "source activity 02 must contain three questions");
assert.equal(lesson.original.items.length, 3, "source activity 02 question count changed");
assert.deepEqual(lesson.original.items.map((item) => item.printGroup), [1, 1, 1], "the three source questions must share one A4 page with separate answer rows");

function referenceMetrics(map) {
  const occupied = new Set();
  map.forEach((row, z) => row.forEach((height, x) => {
    for (let y = 0; y < height; y += 1) occupied.add(`${x},${y},${z}`);
  }));
  let hidden = 0;
  for (const key of occupied) {
    const [x, y, z] = key.split(",").map(Number);
    const coveredTop = occupied.has(`${x},${y + 1},${z}`);
    const coveredFront = map.slice(z + 1).some((row) => Number(row[x] || 0) > y);
    const coveredRight = map[z].slice(x + 1).some((height) => Number(height || 0) > y);
    if (coveredTop && coveredFront && coveredRight) hidden += 1;
  }
  const total = occupied.size;
  return { total, visible: total - hidden, hidden };
}

const expectedAnswers = ["1", "2", "4"];
for (const [index, item] of lesson.original.items.entries()) {
  const prefix = `book-04/hidden-cube-count/${item.id}`;
  const scene = item.visual?.scenes?.[0];
  assert.ok(scene, `${prefix}: source visual missing`);
  assert.equal(item.visual.topLabels, true, `${prefix}: top-face height labels missing`);
  assert.deepEqual(referenceMetrics(scene.map), scene.expected, `${prefix}: diagram and source counts disagree`);
  assert.equal(item.answer, expectedAnswers[index], `${prefix}: approved answer changed`);
  assert.equal(Number(item.answer), scene.expected.hidden, `${prefix}: answer is not determined by the diagram`);
  assert.match(item.solution, /전체.*보이는.*(?:빼|뺍)/u, `${prefix}: worked solution is incomplete`);
  assert.equal(item.answerMode, "input", `${prefix}: answer must be written below the question`);
  assert.equal(item.inputMode, "numeric", `${prefix}: numeric response mode changed`);
}

for (const beat of lesson.experience.beats) {
  assert.deepEqual(referenceMetrics(beat.visual.map), beat.visual.expected, `${beat.id}: animation diagram and explanation counts disagree`);
}

console.log("GOLDEN_BELL_BOOK04_HIDDEN_OK scenes=3 sourceItems=3 answers=1,2,4 topLabels=pass printPages=1");
