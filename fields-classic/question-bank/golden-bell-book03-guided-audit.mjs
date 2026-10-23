import assert from "node:assert/strict";
import { goldenBellBookById } from "./golden-bell-data.js";
import { guidedConceptPrintSummary, guidedConceptVisual } from "./golden-bell-guided-experiences.js";
import { readFile } from "node:fs/promises";

// 2026-09-05 정답 보호 이후 공개 데이터의 확인 문제에는 답 대신 answerRef만 있다. 비공개 답 파일을 주면 답이 보기에 꼭 한 번 나오는지도 본다.
const privateRecords = process.env.FIELDS_PRIVATE_ANSWER_BANK
  ? JSON.parse(await readFile(process.env.FIELDS_PRIVATE_ANSWER_BANK, "utf8")).books?.["book-03"] : null;

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
  assert.ok(experience.check?.prompt?.trim() && /^\/books\/book-03\//u.test(experience.check?.answerRef || ""), `${lesson.id}: concept check missing`);
  assert.equal(Object.hasOwn(experience.check, "answer"), false, `${lesson.id}: check answer must not be public`);
  assert.equal(new Set(experience.check.options).size, experience.check.options.length, `${lesson.id}: check options must be distinct`);
  const privateCheck = privateRecords?.[experience.check.answerRef]?.answer;
  if (privateCheck !== undefined) assert.equal(experience.check.options.filter((option) => [privateCheck].flat().map(String).includes(option)).length, 1, `${lesson.id}: check answer is not unique`);
  const visual = guidedConceptVisual(experience, experience.beats.length - 1);
  const summary = guidedConceptPrintSummary(experience);
  assert.ok(text(visual), `${lesson.id}: final guided visual is empty`);
  assert.ok(text(summary), `${lesson.id}: print summary is empty`);
  assert.ok(/guided|book03|visual|svg|grid|line|cryptarithm|square|fraction|area|distance/i.test(visual), `${lesson.id}: visual summary has no rendered model`);
  assert.ok(summary.includes("개념 순서"), `${lesson.id}: print summary lacks concept sequence`);
}

console.log(`BOOK03_GUIDED_AUDIT_OK: ${book.lessons.length} lessons with visual and print summaries`);
