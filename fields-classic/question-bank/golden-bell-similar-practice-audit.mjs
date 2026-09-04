import assert from "node:assert/strict";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js";
import { GOLDEN_BELL_SIMILAR_GENERATOR_MAP } from "./golden-bell-similar-practice.js";

function canonical(answer) {
  const value = String(Array.isArray(answer) ? answer[0] : answer).replace(/\s+/gu, "");
  return value.match(/^(-?\d+(?:\.\d+)?)(?:개|명|장|m|cm|일|번)(?:뒤)?$/u)?.[1] || value;
}

let lessonCount = 0;
let addedCount = 0;
let generatedCount = 0;

assert.equal(GOLDEN_BELL_BOOKS.length, 10, "Golden Bell must cover ten books");
for (const book of GOLDEN_BELL_BOOKS) {
  assert.equal(book.lessons.length, 4, `${book.id}: expected four concepts`);
  assert.deepEqual(book.dailyPractice, { problemCount: 8, estimatedMinutes: 30 }, `${book.id}: daily practice summary mismatch`);
  for (const lesson of book.lessons) {
    const items = [lesson.extension, ...(lesson.similarPractice || [])];
    assert.equal(items.length, 2, `${book.id}/${lesson.id}: expected two additional-learning problems`);
    const similar = items[1];
    assert.ok(similar.id.endsWith(":extension:2"), `${book.id}/${lesson.id}: stable similar-practice id missing`);
    assert.equal(similar.structureKey, lesson.extension.structureKey, `${book.id}/${lesson.id}: similar problem changed the source structure`);
    assert.ok(similar.story?.trim(), `${book.id}/${lesson.id}: story missing`);
    assert.ok(similar.prompt?.trim(), `${book.id}/${lesson.id}: prompt missing`);
    assert.ok(similar.visual?.kind, `${book.id}/${lesson.id}: visual missing`);
    assert.ok(similar.explanation?.trim().length >= 12, `${book.id}/${lesson.id}: worked solution is too short`);
    assert.notEqual(canonical(similar.answer), canonical(lesson.extension.answer), `${book.id}/${lesson.id}: similar answer repeats the source answer`);
    assert.notEqual(`${similar.story}|${similar.prompt}`, `${lesson.extension.story}|${lesson.extension.prompt}`, `${book.id}/${lesson.id}: similar problem repeats the source problem`);
    if (similar.generatorId) {
      generatedCount += 1;
      assert.equal(similar.generatorId, GOLDEN_BELL_SIMILAR_GENERATOR_MAP[lesson.id], `${book.id}/${lesson.id}: generator provenance mismatch`);
    }
    lessonCount += 1;
    addedCount += lesson.similarPractice.length;
  }
}

assert.equal(lessonCount, 40, "expected forty Golden Bell concepts");
assert.equal(addedCount, 40, "expected forty new similar-practice problems");
assert.equal(generatedCount, 24, "expected twenty-four bank-generated problems");
console.log(`GOLDEN_BELL_SIMILAR_OK books=10 lessons=${lessonCount} added=${addedCount} generated=${generatedCount} daily=8/30min`);
