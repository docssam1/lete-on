import assert from "node:assert/strict";
import { goldenBellBookById } from "./golden-bell-data.js";
import { guidedConceptPrintSummary, guidedConceptVisual } from "./golden-bell-guided-experiences.js";

const book = goldenBellBookById("book-03");
const expected = [
  ["six-multiple-equations", "six-bundle-equation", "constant-step-number-sequence"],
  ["multiple-comparison", "multiple-direction", "unit-length-multiple"],
  ["basic-vertical-cryptarithm", "vertical-cryptarithm-carry", "cryptarithm-single-double"],
  ["magic-square-targets", "magic-line-target", "magic-square-three-target"]
];

const lessons = expected.map(([id]) => book.lessons.find((lesson) => lesson.id === id));
assert.equal(lessons.filter(Boolean).length, expected.length, "Book 3 lesson IDs are incomplete");

function strings(value) {
  if (typeof value === "string") return [value];
  if (!value || typeof value !== "object") return [];
  return Object.values(value).flatMap(strings);
}

function visualText(visual) {
  return String(visual).replace(/<[^>]*>/g, " ").replace(/&times;/g, "×");
}

for (const [index, lesson] of lessons.entries()) {
  const [id, family, sourceTypeId] = expected[index];
  const experience = lesson.experience;
  assert.equal(lesson.id, id);
  assert.equal(experience?.kind, "guided-concept", `${id}: must be guided-concept`);
  assert.equal(experience.family, family, `${id}: family mismatch`);
  assert.deepEqual(lesson.sourceTypeIds, [sourceTypeId], `${id}: sourceTypeIds mismatch`);
  assert.equal(experience.beats.length, 4, `${id}: beats must be exactly 4`);

  const options = experience.check.options;
  const answer = experience.check.answer;
  assert.equal(options.filter((option) => option === answer).length, 1, `${id}: approved answer must occur once`);

  const finalVisual = guidedConceptVisual(experience, experience.beats.length - 1);
  const printSummary = guidedConceptPrintSummary(experience);
  assert.ok(finalVisual.trim(), `${id}: final visual is empty`);
  assert.ok(printSummary.trim(), `${id}: final print summary is empty`);

  const protectedText = [lesson.original, lesson.extension].flatMap(strings);
  assert.ok(!protectedText.includes(experience.check.prompt), `${id}: check prompt leaks original/extension text`);
  const protectedQuestionPairs = (lesson.original.items || []).map((item) => [item.prompt || lesson.original.prompt, item.answer]);
  protectedQuestionPairs.push([lesson.extension.prompt, lesson.extension.answer]);
  assert.equal(protectedQuestionPairs.some(([prompt, protectedAnswer]) => prompt === experience.check.prompt && JSON.stringify(protectedAnswer) === JSON.stringify(answer)), false, `${id}: check duplicates a protected source question-answer pair`);

  const text = visualText(finalVisual);
  if (id === "six-multiple-equations") {
    assert.ok(text.includes("6×6") || /6\s*개/.test(text), `${id}: final must show 6×6 or six-bundle grouping`);
  }
  if (id === "multiple-comparison") {
    assert.match(text, /12\s*÷\s*3\s*=\s*4/, `${id}: final must show 12÷3=4`);
    assert.match(text, /기준/, `${id}: final must identify the reference direction`);
    assert.match(text, /비교/, `${id}: final must identify the comparison direction`);
  }
  if (id === "basic-vertical-cryptarithm") {
    assert.match(finalVisual, /vertical|세로/i, `${id}: vertical structure class is missing`);
    assert.match(text, /4\s*\+\s*4\s*\+\s*4\s*=\s*12/, `${id}: carry equation is missing`);
    assert.match(text, /받아올림/, `${id}: carry indication is missing`);
  }
  if (id === "magic-square-targets") {
    assert.match(text, /3\s*[x×]\s*3/, `${id}: 3x3 structure is missing`);
    assert.match(text, /9\s*칸/, `${id}: nine-cell structure is missing`);
    assert.match(text, /합(?:은|이)?\s*15/, `${id}: target sum 15 is missing`);
    assert.match(text, /빈칸(?:은|이|\s)*3/, `${id}: target 3 is missing`);
    const original = lesson.original.items.find((item) => item.id === "magic-1-first");
    assert.deepEqual(original?.answer, ["12", "16"], `${id}: approved original answer [12,16] must remain unchanged`);
  }
}

console.log("BOOK03_GUIDED_AUDIT_OK");
