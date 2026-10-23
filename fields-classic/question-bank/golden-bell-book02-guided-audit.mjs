import assert from "node:assert/strict";
import { goldenBellBookById } from "./golden-bell-data.js";
import { guidedConceptPrintSummary, guidedConceptVisual } from "./golden-bell-guided-experiences.js";
import { readFile } from "node:fs/promises";

const privateRecords = process.env.FIELDS_PRIVATE_ANSWER_BANK
  ? JSON.parse(await readFile(process.env.FIELDS_PRIVATE_ANSWER_BANK, "utf8")).books?.["book-02"] : null;

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
  // 2026-09-05 정답 보호 이후 공개 데이터에는 확인 문제 답이 없고 answerRef만 있다. 보기는 서로 달라야 하고,
  // 비공개 답 파일(FIELDS_PRIVATE_ANSWER_BANK)을 주면 답이 보기에 꼭 한 번 나오는지도 본다.
  assert.equal(Object.hasOwn(experience.check, "answer"), false, `${lesson.id}: check answer must not be public`);
  assert.match(experience.check.answerRef || "", /^\/books\/book-02\//u, `${lesson.id}: check answerRef missing`);
  assert.equal(new Set(experience.check.options).size, experience.check.options.length, `${lesson.id}: check options must be distinct`);
  const privateCheck = privateRecords?.[experience.check.answerRef]?.answer;
  if (privateCheck !== undefined) assert.equal(experience.check.options.filter((option) => [privateCheck].flat().map(String).includes(option)).length, 1, `${lesson.id}: check answer must occur exactly once`);

  const finalVisual = guidedConceptVisual(experience, experience.beats.length - 1);
  const printSummary = guidedConceptPrintSummary(experience);
  assert.ok(finalVisual.trim(), `${lesson.id}: final visual is empty`);
  assert.ok(printSummary.trim(), `${lesson.id}: print summary is empty`);

  const protectedText = [lesson.original, lesson.extension].flatMap(strings);
  assert.ok(!protectedText.includes(experience.check.prompt), `${lesson.id}: check prompt leaks original/extension text`);
  if (privateCheck !== undefined) assert.ok(!protectedText.includes(String(privateCheck)), `${lesson.id}: check answer leaks original/extension answer`);

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
