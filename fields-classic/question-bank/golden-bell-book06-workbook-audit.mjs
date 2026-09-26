import assert from "node:assert/strict";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-library.js";
import { BOOK06_WORKBOOK_FAMILIES } from "./golden-bell-book06-workbook.js";
import { book06GuidedResult, renderBook06Guided } from "./golden-bell-book06-guided.js";

const PHASES = Object.freeze(["given", "organize", "calculate", "verify"]);
const TARGETS = Object.freeze([
  ["number-line-unit-distance", "book06-number-line"],
  ["rectangle-missing-side", "book06-missing-side"],
  ["inclusive-range-count", "book06-range-count"],
  ["number-and-digit-count", "book06-number-digit-count"],
  ["equal-share-source", "book06-equal-share"],
  ["number-line-ratio-source", "book06-distance-ratio"],
  ["fraction-balance-source", "book06-equivalent-ratio"],
  ["perimeter-source", "book06-perimeter-half"],
  ["multiplication-source", "book06-partial-product"],
  ["consecutive-source", "book06-inclusive-sequence"],
  ["digit-sign-source", "book06-digit-occurrence"]
]);

function independentAnswer(lesson) {
  const model = lesson.experience.model;
  switch (lesson.id) {
    case "number-line-unit-distance": return (model.end - model.start) / model.intervals;
    case "rectangle-missing-side": return model.perimeter / 2 - model.knownSide;
    case "inclusive-range-count": return model.end - model.start + 1;
    case "number-and-digit-count": return model.values.length;
    case "equal-share-source": return model.total / model.groups;
    case "number-line-ratio-source": return model.distance / model.intervals;
    case "fraction-balance-source": return model.left[1] * model.known / model.left[0];
    case "perimeter-source": return model.perimeter / 2 - model.knownSide;
    case "multiplication-source": return model.multiplicand * model.multiplier;
    case "consecutive-source": return model.end - model.start + 1;
    case "digit-sign-source": {
      let total = 0;
      for (let value = model.start; value <= model.end; value += 1) {
        total += [...String(value)].filter((digit) => Number(digit) === model.digit).length;
      }
      return total;
    }
    default: throw new Error(`${lesson.id}: independent answer branch missing`);
  }
}

function optionIncludes(options, answer) {
  return options.some((option) => String(option).replace(/[^\d.-]/gu, "") === String(answer));
}

const book = GOLDEN_BELL_BOOKS.find((item) => item.id === "book-06");
assert.ok(book, "book-06 is missing");
assert.equal(book.book06WorkbookVersion, 2, "workbook enhancement did not run");
assert.deepEqual(book.dailyPractice, { problemCount: 22, estimatedMinutes: 30 });
assert.equal(book.lessons.length, TARGETS.length);
assert.equal(BOOK06_WORKBOOK_FAMILIES.size, TARGETS.length);

let frameCount = 0;
let practiceCount = 0;

for (const [lessonId, family] of TARGETS) {
  const lesson = book.lessons.find((candidate) => candidate.id === lessonId);
  assert.ok(lesson, `${lessonId}: lesson missing`);
  assert.equal(lesson.experience.kind, "guided-concept", `${lessonId}: guided concept missing`);
  assert.equal(lesson.experience.family, family, `${lessonId}: family mismatch`);
  assert.match(lesson.experience.learnerStage, /필즈 더 클래식 1과정 6권/u, `${lessonId}: learner stage missing`);
  assert.doesNotMatch(lesson.representativeConcept, /원본 문장|복제하지 않고|확인된 수치/u, `${lessonId}: production note leaked into learner copy`);
  assert.doesNotMatch(JSON.stringify(lesson.experience.beats), /조건의 수와 단위를 먼저|계산 관계에 맞게/u, `${lessonId}: generic animation copy remains`);
  assert.deepEqual(lesson.experience.beats.map((beat) => beat.phase), PHASES, `${lessonId}: phase order mismatch`);

  const expected = independentAnswer(lesson);
  const result = book06GuidedResult(lesson.experience);
  assert.equal(result.answer, expected, `${lessonId}: renderer math differs from independent calculation`);
  assert.ok(optionIncludes(lesson.experience.check.options, expected), `${lessonId}: check options do not contain the verified answer`);

  const frames = lesson.experience.beats.map((beat, index) => renderBook06Guided(lesson.experience, beat, index));
  assert.equal(new Set(frames).size, PHASES.length, `${lessonId}: repeated semantic frame`);
  frames.forEach((html, index) => {
    const phase = PHASES[index];
    assert.match(html, new RegExp(`data-book06-family="${family}"`, "u"));
    assert.match(html, new RegExp(`data-book06-phase="${phase}"`, "u"));
    assert.doesNotMatch(html, /\b(?:NaN|undefined|null)\b/u, `${lessonId}/${phase}: invalid token`);
    if (phase === "given") assert.match(html, /data-color-role="given"/u);
    if (["organize", "calculate"].includes(phase)) assert.match(html, /data-color-role="action"/u);
    if (phase === "calculate") assert.match(html, /data-book06-expression/u, `${lessonId}: unresolved calculation frame missing`);
    if (phase === "verify") {
      assert.match(html, /data-color-role="verify"/u);
      assert.match(html, new RegExp(`data-book06-answer="${expected}"`, "u"), `${lessonId}: final answer marker mismatch`);
      assert.match(html, /data-book06-check="[^"]+"/u, `${lessonId}: independent check missing`);
    } else {
      assert.doesNotMatch(html, /data-book06-(?:answer|check)=/u, `${lessonId}/${phase}: answer leaked before verification`);
    }
  });
  frameCount += frames.length;

  const items = [lesson.extension, ...lesson.similarPractice];
  assert.equal(items.length, 2, `${lessonId}: pending variants must not be graded`);
  assert.equal(new Set(items.map((item) => item.id || `${lesson.id}:extension`)).size, 2, `${lessonId}: duplicate practice id`);
  assert.ok(items.every((item) => item.visual?.kind === "book6" && item.visual.subtype !== "expression"), `${lessonId}: practice must use a mathematical visual, not a bare expression`);
  if (lessonId === "multiplication-source") {
    assert.ok(items.every((item) => item.visual.partials.every((part) => typeof part === "string" && part.includes("×"))), `${lessonId}: the area model must not reveal calculated partial products`);
  }
  const added = lesson.pendingPractice[0];
  assert.ok(added, `${lessonId}: pending variant draft missing`);
  assert.ok(!added.answerRef, `${lessonId}: pending variant must not reuse another question's answer reference`);
  assert.equal(new Set(items.map((item) => item.answerRef)).size, items.length, `${lessonId}: answers must be bound to distinct questions`);
  assert.ok(added.visual && added.prompt, `${lessonId}: representation variant is incomplete`);
  assert.ok(!Object.hasOwn(added, "answer") && !Object.hasOwn(added, "solution") && !Object.hasOwn(added, "explanation"), `${lessonId}: protected answer data leaked into public practice`);
  if (["rectangle-missing-side", "inclusive-range-count", "number-and-digit-count"].includes(lessonId)) {
    assert.equal(lesson.original.printMode, "paged", `${lessonId}: dense source questions need a separate page`);
    assert.equal(lesson.original.separateConceptPrint, true, `${lessonId}: concept sheet was not separated`);
    assert.equal(new Set(lesson.original.items.map((item) => item.printGroup)).size, 1, `${lessonId}: source questions should stay together on one sheet`);
    assert.ok(lesson.original.items.every((item) => item.visual?.kind === "book6"), `${lessonId}: a source item lost its own visual`);
    assert.equal(new Set(lesson.original.items.map((item) => JSON.stringify(item.visual))).size, lesson.original.items.length, `${lessonId}: source visuals were repeated across different questions`);
  }
  practiceCount += items.length;
}

assert.equal(practiceCount, book.dailyPractice.problemCount, "book practice total disagrees with lesson items");
console.log(`GOLDEN_BELL_BOOK06_WORKBOOK_AUDIT_OK lessons=${TARGETS.length} frames=${frameCount} practice=${practiceCount} pending=11 answerLeak=0 protectedRefs=distinct conceptMath=pass`);
