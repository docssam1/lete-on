const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../data/question-bank-core.js");
const drafts = require("../data/exam-draft-core.js");
const preview = require("../data/exam-output-preview.js");

const mode = "SH";
const draft = drafts.createExamDraft({ id: core.createNeutralId("examDraft", mode, "output-preview"), mode, writer: "T", title: "Output preview", scope: { curriculumVersion: "2022-revised", paths: [{ grade: "G09", major: "ALG", minor: "EQ", detail: "LIN" }] }, constraints: { questionCount: 1, totalPoints: 3, maxPerFamily: 1 }, status: "draft", scopeVersion: 1 });
const candidate = { itemId: core.createSharedBankId("question", "output-item"), mode, familyId: core.createSharedBankId("question", "output-family"), typeId: core.createSharedBankId("type", "output-type"), curriculum: { grade: "G09", major: "ALG", minor: "EQ", detail: "LIN" }, responseType: "input", classificationVerified: true, answerVerified: true, rightsVerified: true, releaseEligible: true, lineageRelation: "original", difficultyBand: "standard", coreConditionVerified: true, solutionStructureVerified: true };

test("output preview exposes only question ordering, points, and response formats", () => {
  const placements = drafts.appendPlacement(draft, [], candidate, 3);
  const result = preview.build(draft, placements, { questionsPerPage: 5 });
  assert.equal(result.eligibleForProduction, true);
  assert.deepEqual(result.pages[0].questions[0], { number: 1, placementId: placements[0].id, points: 3, responseType: "input" });
  (function safeWalk(value) { if (!value || typeof value !== "object") return; Object.entries(value).forEach(function (entry) { assert.equal(/^(answer|answers|answerSpec|answerKey|correctAnswer|solution|explanation|questionText|pdfUrl|sourcePath|storagePath)$/i.test(entry[0]), false, `protected key leaked: ${entry[0]}`); safeWalk(entry[1]); }); })(result);
  assert.throws(() => preview.build(draft, placements, { questionsPerPage: 0 }), /questionsPerPage/);
});
