import assert from "node:assert/strict";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-library.js";
import { faithfulQuestion, FAITHFUL_LESSONS, goldenBellPracticeItems } from "./golden-bell-faithful-practice.js";
import { faithfulConcept } from "./golden-bell-faithful-concepts.js";

for (const [lessonId, metadata] of Object.entries(FAITHFUL_LESSONS)) {
  const book = GOLDEN_BELL_BOOKS.find((entry) => entry.id === metadata.bookId);
  const lesson = book.lessons.find((entry) => entry.id === lessonId);
  const source = lesson.original.items[0].visual;
  assert.equal(goldenBellPracticeItems(lesson, book.id).length, 1, "Unready packets must not reveal incompatible old variants");
  for (let variant = 0; variant <= 3; variant++) {
    const item = faithfulQuestion(lessonId, variant);
    assert.equal(item.structureKey, lesson.original.structureKey);
    assert.equal(item.visual.subtype, source.subtype);
    assert.ok(!JSON.stringify(item).match(/"(?:answer|solution|explanation)":/u));
    assert.ok(!item.answerRef.startsWith("/books/"));
    if (source.subtype === "checkerboard-products") {
      assert.deepEqual(item.visual.active, source.active);
      assert.deepEqual(item.visual.cardPool, source.cardPool);
      assert.deepEqual(item.visual.revealed, source.revealed);
      assert.deepEqual(item.visual.cells, source.cells);
    }
    if (source.subtype === "source-table-logic") {
      assert.equal(item.visual.places.length, 4);
      assert.equal(item.visual.targetPosition, source.targetPosition);
      assert.deepEqual(item.visual.conditions.map((condition) => condition.type), source.conditions.map((condition) => condition.type));
    }
    if (source.subtype === "vertical") {
      const structure = (v) => [v.top, v.bottom, v.result].map((value) => value.replace(/\d/gu, "#"));
      assert.deepEqual(structure(item.visual), structure(source));
      assert.equal(item.visual.operator, source.operator);
    }
    if (source.subtype === "source-balance-equations") {
      assert.deepEqual(item.visual.equations.map((eq) => [Object.keys(eq.left), Object.keys(eq.right)]), source.equations.map((eq) => [Object.keys(eq.left), Object.keys(eq.right)]));
      assert.deepEqual(item.visual.target, source.target);
    }
  }
  const example = faithfulConcept(lessonId);
  assert.equal(example.beats.length, 4);
  assert.deepEqual(example.beats[0].visual, example.visual);
  assert.equal(new Set(example.beats.map((beat) => JSON.stringify(beat.visual))).size, 4);
}
console.log("FAITHFUL_STRUCTURE_OK lessons=5 questions=20 sourceTopology=pass publicAnswers=none");
