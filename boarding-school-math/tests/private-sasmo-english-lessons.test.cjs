"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const validator = require("../scripts/validate-private-sasmo-english-lessons.cjs");
const renderer = require("../scripts/render-private-sasmo-english-lessons.cjs");
const mediaValidator = require("../scripts/validate-private-sasmo-question-media.cjs");

function intakePack() {
  return {
    paper: { year: 2019, levelId: "G6", sourceFingerprintSha256: "a".repeat(64) },
    items: Array.from({ length: 25 }, function (_value, index) {
      return {
        itemId: `sasmo-2019-g6-q${String(index + 1).padStart(2, "0")}`,
        axisId: "number-operations", skillId: `skill-${index + 1}`, primaryErrorType: "reasoning-error",
        privateScoring: { answerKind: "numeric-exact", answerValue: String(index + 1) }
      };
    })
  };
}

function lesson(index) {
  return {
    itemId: `sasmo-2019-g6-q${String(index + 1).padStart(2, "0")}`,
    questionNumber: index + 1,
    title: `Verified lesson title ${index + 1}`,
    conceptGoal: "Understand the mathematical structure before choosing a procedure.",
    priorKnowledge: "Recall the prerequisite idea and connect it to the current representation.",
    visualModel: { kind: "equation-flow", caption: "Follow the quantities from the known information to the unknown result.", tokens: ["known quantity", "unknown quantity"] },
    steps: [
      { label: "Represent", explanation: "Translate the contest information into a precise mathematical representation.", math: "known -> model" },
      { label: "Solve", explanation: "Use the selected relationship to calculate the required quantity carefully.", math: "model -> result" },
      { label: "Check", explanation: "Substitute the result and confirm that every original condition still holds.", math: "result -> verified" }
    ],
    whyItWorks: "The representation preserves the original relationships, so a valid operation produces an equivalent result.",
    commonMistake: "Do not select a procedure from a keyword without checking what every number represents.",
    tryAgain: "Cover the solution, rebuild the representation, and explain why each operation is allowed.",
    finalAnswer: { kind: "numeric-exact", value: String(index + 1), display: String(index + 1) },
    teacherNote: "Ask the learner to explain the representation before checking the final calculation.",
    verification: { publishedSolutionMatched: true, independentMethodMatched: true, sourceDiagramRequired: false }
  };
}

function pack() {
  const value = {
    schemaVersion: validator.SCHEMA_VERSION,
    packId: "sasmo-2019-g6-english-review-v1",
    language: "en",
    deliveryState: validator.DELIVERY_STATE,
    paperBinding: { programId: "sasmo", year: 2019, levelId: "G6", intakeFingerprintSha256: "a".repeat(64) },
    lessonPattern: "concept-visual-solve-mistake-retry",
    lessons: Array.from({ length: 25 }, function (_value, index) { return lesson(index); })
  };
  value.lessons[8].reviewBoundary = { state: "review-required", reasonCode: "language-determinacy-review", notice: "The printed wording can imply a unique minimum even though several digits tie for the minimum frequency." };
  value.lessons[14].reviewBoundary = { state: "review-required", reasonCode: "nonunique-rule", notice: "The printed solution uses one rule, but the completed source cells do not determine every unseen input pair uniquely." };
  value.lessons[18].reviewBoundary = { state: "score-only", reasonCode: "nonunique-rule", notice: "The calendar interpretation matches the printed key, but a finite sequence does not determine one unique rule." };
  value.lessons[20].reviewBoundary = { state: "review-required", reasonCode: "whole-number-zero-scope-review", notice: "The printed key assumes positive integers, but the prompt says whole numbers without explicitly excluding zero." };
  return value;
}

function mediaPack() {
  return {
    schemaVersion: mediaValidator.SCHEMA_VERSION,
    packId: "sasmo-2019-g6-question-media-v1",
    language: "en-US",
    rightsState: "private-reference-only",
    sourceFingerprintSha256: "a".repeat(64),
    assetDirectory: "question-images/sasmo-2019-g6",
    items: Array.from({ length: 25 }, function (_value, index) {
      const number = index + 1;
      return { itemId: `sasmo-2019-g6-q${String(number).padStart(2,"0")}`, questionNumber: number, sourcePage: Math.floor(index / 2) + 3, assetFile: `sasmo-2019-g6-q${String(number).padStart(2,"0")}.png`, altText: `Verified source problem image for question ${number}, including all printed choices.`, spokenPrompt: `Read the complete verified source wording for question ${number} before studying the explanation.` };
    })
  };
}

function imageIndexPack(sourceMedia) {
  return {
    schemaVersion: mediaValidator.IMAGE_INDEX_SCHEMA_VERSION,
    sourceFingerprintSha256: "a".repeat(64),
    sourceFile: "SASMO_2019_G6_Problem_Set.pdf",
    renderScale: 2.4,
    rightsState: "private-reference-only",
    records: sourceMedia.items.map(function (item) { return { itemId: item.itemId, questionNumber: item.questionNumber, sourcePage: item.sourcePage, assetFile: item.assetFile, assetSha256: String(item.questionNumber).padStart(64,"0"), width: 1308, height: 800, byteLength: 20000 }; })
  };
}

function mediaAssets(sourceMedia) {
  return new Map(sourceMedia.items.map(function (item) {
    return [item.itemId, Object.freeze({ ...item, assetSha256: String(item.questionNumber).padStart(64,"0"), width: 1308, height: 800, byteLength: 20000, dataUri: "data:image/png;base64,iVBORw0KGgo=" })];
  }));
}

test("private English lesson pack requires all 25 answer-bound verified lessons", function () {
  const result = validator.validateLessonPack(pack(), intakePack());
  assert.equal(result.lessonCount, 25);
  assert.deepEqual(result.reviewBoundaryQuestionNumbers, [9, 15, 19, 21]);
  const broken = structuredClone(pack());
  broken.lessons[23].finalAnswer.value = "999";
  assert.throws(function () { validator.validateLessonPack(broken, intakePack()); }, /LESSON_ANSWER_MISMATCH/u);
  const missingBoundary = structuredClone(pack());
  delete missingBoundary.lessons[8].reviewBoundary;
  assert.throws(function () { validator.validateLessonPack(missingBoundary, intakePack()); }, /LESSON_REVIEW_BOUNDARY_INVALID/u);
  const unexpectedBoundary = structuredClone(pack());
  unexpectedBoundary.lessons[0].reviewBoundary = structuredClone(unexpectedBoundary.lessons[8].reviewBoundary);
  assert.throws(function () { validator.validateLessonPack(unexpectedBoundary, intakePack()); }, /LESSON_REVIEW_BOUNDARY_UNEXPECTED/u);
});

test("student and teacher review documents stay distinct and include usable controls", function () {
  const sourcePack = pack();
  const sourceIntake = intakePack();
  const assets = mediaAssets(mediaPack());
  const imageIndexSha256 = mediaValidator.VERIFIED_IMAGE_INDEX_SHA256["sasmo-2019-g6-question-media-v1"];
  const student = renderer.documentHtml(sourcePack, sourceIntake, "student", assets, imageIndexSha256);
  const teacher = renderer.documentHtml(sourcePack, sourceIntake, "teacher", assets, imageIndexSha256);
  assert.match(student, /SASMO English Review Studio/u);
  assert.match(student, /gfield-private-review-pack-id" content="sasmo-2019-g6-english-review-v1/u);
  assert.match(student, /gfield-private-review-audience" content="student/u);
  assert.match(teacher, /gfield-private-review-audience" content="teacher/u);
  assert.match(student, new RegExp(`gfield-source-image-index-sha256" content="${imageIndexSha256}`, "u"));
  assert.equal((student.match(/class="actual-problem"/gu) || []).length, 25);
  assert.equal((student.match(/class="question-image-frame"/gu) || []).length, 25);
  assert.equal((student.match(/class="zoom-control"/gu) || []).length, 25);
  assert.equal((student.match(/src="data:image\/png;base64,/gu) || []).length, 25);
  assert.equal((student.match(/data-source-sha256="[a-f0-9]{64}"/gu) || []).length, 25);
  assert.ok(student.indexOf("Read the actual problem") < student.indexOf("<h3>Concept</h3>"));
  assert.match(student, /question-image-frame\.is-zoomed img/u);
  assert.match(student, /\.actual-problem\{padding:4mm;margin:0 0 7mm;break-inside:auto;page-break-inside:auto\}/u);
  assert.match(student, /\.actual-problem-head\{break-after:avoid;page-break-after:avoid\}/u);
  assert.doesNotMatch(student, /assetPath/u);
  assert.match(student, /Reveal verified answer/u);
  assert.equal((student.match(/class="review-boundary"/gu) || []).length, 4);
  assert.equal((student.match(/>Reveal printed-key answer<\/button>/gu) || []).length, 4);
  assert.equal((student.match(/Historical printed-key answer/gu) || []).length, 4);
  assert.match(student, /data-review-reason="language-determinacy-review"/u);
  assert.match(student, /data-review-reason="whole-number-zero-scope-review"/u);
  assert.match(student, /@media\(max-width:820px\)/u);
  assert.match(student, /new URLSearchParams\(window\.location\.search\)\.get\('q'\)/u);
  assert.match(student, /url\.searchParams\.set\('q', String\(current \+ 1\)\)/u);
  assert.match(student, /show\(routeQuestionNumber\(requestedQuestion\) - 1, false, false\)/u);
  assert.doesNotMatch(student, /Teacher note/u);
  assert.match(teacher, /Teacher note/u);
  assert.match(teacher, /Likely error family/u);
  assert.throws(function () { renderer.documentHtml(sourcePack, sourceIntake, "student", new Map(), imageIndexSha256); }, /LESSON_RENDER_MEDIA_COUNT_INVALID/u);
  assert.throws(function () { renderer.documentHtml(sourcePack, sourceIntake, "student", assets, "unbound-index"); }, /LESSON_RENDER_MEDIA_INDEX_INVALID/u);
});

test("question deep links accept only an existing 1-based lesson number", function () {
  assert.equal(renderer.normalizeQuestionNumber("1"), 1);
  assert.equal(renderer.normalizeQuestionNumber("21"), 21);
  assert.equal(renderer.normalizeQuestionNumber("25"), 25);
  assert.equal(renderer.normalizeQuestionNumber("0"), 1);
  assert.equal(renderer.normalizeQuestionNumber("26"), 1);
  assert.equal(renderer.normalizeQuestionNumber("2.5"), 1);
  assert.equal(renderer.normalizeQuestionNumber(" 6 "), 1);
  assert.equal(renderer.normalizeQuestionNumber("06"), 1);
  assert.equal(renderer.normalizeQuestionNumber("3", 2), 1);
});

test("immutable question-image index binds every source page, filename, dimension, and hash", function () {
  const sourceMedia = mediaPack();
  const sourceIndex = imageIndexPack(sourceMedia);
  const records = mediaValidator.validateImageIndex(sourceIndex, sourceMedia, intakePack());
  assert.equal(records.size, 25);
  assert.equal(records.get("sasmo-2019-g6-q21").assetFile, "sasmo-2019-g6-q21.png");
  const wrongFile = structuredClone(sourceIndex);
  wrongFile.records[5].assetFile = "sasmo-2019-g6-q07.png";
  assert.throws(function () { mediaValidator.validateImageIndex(wrongFile, sourceMedia, intakePack()); }, /QUESTION_MEDIA_INDEX_BINDING_INVALID/u);
  const wrongHash = structuredClone(sourceIndex);
  wrongHash.records[20].assetSha256 = "not-a-source-hash";
  assert.throws(function () { mediaValidator.validateImageIndex(wrongHash, sourceMedia, intakePack()); }, /QUESTION_MEDIA_INDEX_HASH_INVALID/u);
});
