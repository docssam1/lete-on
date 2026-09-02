import assert from "node:assert/strict";
import { goldenBellBookById } from "./golden-bell-data.js";
import { guidedConceptPrintSummary, guidedConceptVisual } from "./golden-bell-guided-experiences.js";

const book = goldenBellBookById("book-02");
const expectedIds = ["addition-matrix", "balance-order", "dual-shape-color-pattern", "diamond-number-promise"];
const lessons = expectedIds.map((id) => book.lessons.find((lesson) => lesson.id === id));

function strings(value) {
  if (typeof value === "string") return [value];
  if (!value || typeof value !== "object") return [];
  return Object.values(value).flatMap(strings);
}

assert.equal(lessons.filter(Boolean).length, expectedIds.length, "Book 2 lesson IDs are incomplete");
assert.ok(lessons.every((lesson) => lesson.experience?.kind === "guided-concept"), "all Book 2 lessons must be guided-concept");

const families = lessons.map((lesson) => lesson.experience.family);
assert.equal(new Set(families).size, lessons.length, "guided families must be unique");

for (const lesson of lessons) {
  const experience = lesson.experience;
  assert.equal(experience.beats.length, 4, `${lesson.id}: beats must be exactly 4`);
  assert.ok(lesson.sourceTypeIds?.length, `${lesson.id}: sourceTypeIds must not be empty`);
  assert.equal(experience.check.options.filter((option) => option === experience.check.answer).length, 1, `${lesson.id}: check answer must occur exactly once`);

  const finalVisual = guidedConceptVisual(experience, experience.beats.length - 1);
  const printSummary = guidedConceptPrintSummary(experience);
  assert.ok(finalVisual.trim(), `${lesson.id}: final visual is empty`);
  assert.ok(printSummary.trim(), `${lesson.id}: print summary is empty`);

  const protectedText = [lesson.original, lesson.extension].flatMap(strings);
  assert.ok(!protectedText.includes(experience.check.prompt), `${lesson.id}: check prompt leaks original/extension text`);
  assert.ok(!protectedText.includes(experience.check.answer), `${lesson.id}: check answer leaks original/extension answer`);

  if (lesson.id === "balance-order") {
    for (const item of experience.model.order) assert.ok(finalVisual.includes(item), `${lesson.id}: final order omits ${item}`);
  }
  if (lesson.id === "dual-shape-color-pattern") {
    assert.equal((finalVisual.match(/<span>/g) || []).length, 6, `${lesson.id}: final visual must contain 6 terms`);
    assert.match(finalVisual, /모양 주기\s*3/);
    assert.match(finalVisual, /색 주기\s*2/);
  }
  if (lesson.id === "diamond-number-promise") {
    assert.match(finalVisual, /위\s*-\s*왼쪽\s*-\s*아래\s*=\s*오른쪽/, `${lesson.id}: reverse rule is missing`);
  }
}

console.log("BOOK02_GUIDED_AUDIT_OK");
