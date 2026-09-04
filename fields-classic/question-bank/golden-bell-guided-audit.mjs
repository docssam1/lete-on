import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js";
import {
  guidedConceptPrintSummary,
  guidedConceptVisual
} from "./golden-bell-guided-experiences.js";

const expectedIds = [
  "mirror-reflection",
  "digital-turn-flip",
  "fold-one-cut",
  "equal-line-sums",
  "equal-line-placement",
  "gakuro-sum-grid",
  "number-inference",
  "preference-logic",
  "relative-order-running",
  "book1-equalize-transfer"
];
const failures = [];

function fail(message) {
  failures.push(message);
}

function collectValues(value, key, result = []) {
  if (!value || typeof value !== "object") return result;
  if (Object.prototype.hasOwnProperty.call(value, key) && typeof value[key] === "string") {
    result.push(value[key]);
  }
  for (const child of Object.values(value)) collectValues(child, key, result);
  return result;
}

function collectText(value, result = []) {
  if (typeof value === "string") result.push(value);
  else if (value && typeof value === "object") {
    for (const child of Object.values(value)) collectText(child, result);
  }
  return result;
}

function assertNotCopied(lesson, experience) {
  const originalPromptAnswers = [
    ...collectValues(lesson.original, "prompt"),
    ...collectValues(lesson.original, "answer")
  ];
  const extensionPromptAnswers = [
    ...collectValues(lesson.extension, "prompt"),
    ...collectValues(lesson.extension, "answer")
  ];
  const guidedPromptAnswers = [experience.check.prompt, experience.check.answer];
  for (const value of guidedPromptAnswers) {
    if (originalPromptAnswers.includes(value)) {
      fail(`${lesson.id}: guided check value copies original prompt/answer: ${value}`);
    }
    if (extensionPromptAnswers.includes(value)) {
      fail(`${lesson.id}: guided check value copies extension prompt/answer: ${value}`);
    }
  }
}

function audit() {
  const book = GOLDEN_BELL_BOOKS.find((candidate) => candidate.id === "book-01");
  if (!book) {
    fail("book-01 is missing");
    return;
  }

  const guidedLessons = book.lessons.filter((lesson) => lesson.experience?.kind === "guided-concept");
  const actualIds = guidedLessons.map((lesson) => lesson.id);
  if (guidedLessons.length !== expectedIds.length) {
    fail(`book-01 guided-concept count is ${guidedLessons.length}; expected ${expectedIds.length}`);
  }
  for (const id of expectedIds) {
    if (!actualIds.includes(id)) fail(`book-01 missing guided-concept: ${id}`);
  }
  if (new Set(actualIds).size !== actualIds.length) fail("book-01 guided-concept IDs are not unique");

  const families = new Set();
  for (const lesson of guidedLessons) {
    const experience = lesson.experience;
    const label = lesson.id;
    if (!experience.family) fail(`${label}: family is empty`);
    else if (families.has(experience.family)) fail(`${label}: family is duplicated: ${experience.family}`);
    else families.add(experience.family);
    if (!Array.isArray(lesson.sourceTypeIds) || lesson.sourceTypeIds.length === 0) {
      fail(`${label}: sourceTypeIds is empty`);
    }
    if (!Array.isArray(experience.beats) || experience.beats.length < 3) {
      fail(`${label}: beats has fewer than 3 entries`);
    }
    if (!experience.check || typeof experience.check.prompt !== "string" || !experience.check.prompt.trim()) {
      fail(`${label}: check prompt is empty`);
      continue;
    }
    if (typeof experience.check.answer !== "string" || !experience.check.answer.trim()) {
      fail(`${label}: check answer is empty`);
    }
    const answerCount = Array.isArray(experience.check.options)
      ? experience.check.options.filter((option) => option === experience.check.answer).length
      : 0;
    if (answerCount !== 1) fail(`${label}: check answer occurs ${answerCount} times in options; expected 1`);

    let finalVisual = "";
    try {
      finalVisual = guidedConceptVisual(experience, experience.beats.length - 1);
    } catch (error) {
      fail(`${label}: final visual threw: ${error.message}`);
    }
    if (typeof finalVisual !== "string" || !finalVisual.trim()) fail(`${label}: final visual is empty`);

    let printSummary = "";
    try {
      printSummary = guidedConceptPrintSummary(experience);
    } catch (error) {
      fail(`${label}: print summary threw: ${error.message}`);
    }
    if (typeof printSummary !== "string" || !printSummary.trim()) fail(`${label}: print summary is empty`);
    if (!lesson.original || !lesson.extension) fail(`${label}: original or extension is missing`);
    assertNotCopied(lesson, experience);
  }

  if (families.size !== guidedLessons.length) fail("guided-concept families are not all unique");
  if (failures.length) {
    throw new Error(`guided audit failed (${failures.length})\n- ${failures.join("\n- ")}`);
  }
  console.log(`golden-bell guided audit passed: book-01 ${guidedLessons.length} guided concepts, unique families, visuals and print summaries verified`);
}

try {
  audit();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
