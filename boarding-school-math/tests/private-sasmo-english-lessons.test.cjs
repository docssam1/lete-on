"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const validator = require("../scripts/validate-private-sasmo-english-lessons.cjs");
const renderer = require("../scripts/render-private-sasmo-english-lessons.cjs");

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
  return {
    schemaVersion: validator.SCHEMA_VERSION,
    packId: "sasmo-2019-g6-english-review-v1",
    language: "en",
    deliveryState: validator.DELIVERY_STATE,
    paperBinding: { programId: "sasmo", year: 2019, levelId: "G6", intakeFingerprintSha256: "a".repeat(64) },
    lessonPattern: "concept-visual-solve-mistake-retry",
    lessons: Array.from({ length: 25 }, function (_value, index) { return lesson(index); })
  };
}

test("private English lesson pack requires all 25 answer-bound verified lessons", function () {
  const result = validator.validateLessonPack(pack(), intakePack());
  assert.equal(result.lessonCount, 25);
  const broken = structuredClone(pack());
  broken.lessons[23].finalAnswer.value = "999";
  assert.throws(function () { validator.validateLessonPack(broken, intakePack()); }, /LESSON_ANSWER_MISMATCH/u);
});

test("student and teacher review documents stay distinct and include usable controls", function () {
  const sourcePack = pack();
  const sourceIntake = intakePack();
  const student = renderer.documentHtml(sourcePack, sourceIntake, "student");
  const teacher = renderer.documentHtml(sourcePack, sourceIntake, "teacher");
  assert.match(student, /SASMO English Review Studio/u);
  assert.match(student, /Reveal verified answer/u);
  assert.match(student, /@media\(max-width:820px\)/u);
  assert.doesNotMatch(student, /Teacher note/u);
  assert.match(teacher, /Teacher note/u);
  assert.match(teacher, /Likely error family/u);
});
