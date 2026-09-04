import assert from "node:assert/strict";
import { goldenBellBookById } from "./golden-bell-data.js";
import { guidedConceptPrintSummary, guidedConceptVisual } from "./golden-bell-guided-experiences.js";

const book = goldenBellBookById("book-03");
const expectedIds = [
  "unit-area-shapes", "six-multiple-equations", "fraction-shading",
  "equal-partition-fractions", "tape-length-midpoints", "overlapping-distance",
  "multiple-comparison", "basic-vertical-cryptarithm", "cryptarithm-repeated",
  "cryptarithm-mixed", "cryptarithm-linked", "magic-card-binary", "magic-square-targets"
];
assert.deepEqual(book.lessons.map((lesson) => lesson.id), expectedIds, "Book 3 lesson order is incomplete or changed");
assert.equal(book.lessons.length, 13, "Book 3 must have 13 guided lessons");

function text(value) {
  return String(value ?? "").replace(/<[^>]*>/g, " ").replace(/&times;/g, "x").trim();
}

for (const lesson of book.lessons) {
  const experience = lesson.experience;
  assert.equal(experience?.kind, "guided-concept", `${lesson.id}: must be guided-concept`);
  assert.ok(experience.title?.trim() && experience.hint?.trim(), `${lesson.id}: title/hint missing`);
  assert.ok(Array.isArray(experience.beats) && experience.beats.length >= 2, `${lesson.id}: guided beats missing`);
  assert.ok(experience.check?.prompt?.trim() && experience.check?.answer !== undefined, `${lesson.id}: concept check missing`);
  assert.equal(experience.check.options?.filter((option) => option === experience.check.answer).length, 1, `${lesson.id}: check answer is not unique`);
  const visual = guidedConceptVisual(experience, experience.beats.length - 1);
  const summary = guidedConceptPrintSummary(experience);
  assert.ok(text(visual), `${lesson.id}: final guided visual is empty`);
  assert.ok(text(summary), `${lesson.id}: print summary is empty`);
  assert.ok(/guided|book03|visual|svg|grid|line|cryptarithm|square|fraction|area|distance/i.test(visual), `${lesson.id}: visual summary has no rendered model`);
  assert.ok(summary.includes("개념 순서"), `${lesson.id}: print summary lacks concept sequence`);
}

console.log(`BOOK03_GUIDED_AUDIT_OK: ${book.lessons.length} lessons with visual and print summaries`);
