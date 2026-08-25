const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../data/question-bank-core.js");
const drafts = require("../data/exam-draft-core.js");
const query = require("../data/exam-candidate-query.js");

const mode = "SH";
const draft = drafts.createExamDraft({
  id: core.createNeutralId("examDraft", mode, "candidate-query"), mode, writer: "T", title: "Candidate query",
  scope: { curriculumVersion: "2022-revised", paths: [{ grade: "G09", major: "ALG", minor: "EQ", detail: "LIN" }] }, status: "draft", scopeVersion: 1
});
function candidate(key, responseType, difficultyBand) {
  return {
    itemId: core.createSharedBankId("question", `item:${key}`), mode: "BNK", familyId: core.createSharedBankId("question", `family:${key}`),
    typeId: core.createSharedBankId("type", `type:${key}`), curriculum: { grade: "G09", major: "ALG", minor: "EQ", detail: "LIN" }, responseType,
    classificationVerified: true, answerVerified: true, rightsVerified: true, releaseEligible: true, lineageRelation: "original", difficultyBand,
    coreConditionVerified: true, solutionStructureVerified: true
  };
}

test("candidate query filters and sorts safe metadata without question content", () => {
  const source = [candidate("b", "single_choice", "raised"), candidate("a", "input", "standard")];
  const result = query.queryCandidates(draft, source, { responseType: "input", sort: "difficulty" });
  assert.equal(result.length, 1);
  assert.equal(result[0].responseType, "input");
  assert.equal(Object.hasOwn(result[0], "answer"), false);
  assert.throws(() => query.queryCandidates(draft, source, { sort: "question_text" }), /sort/);
  assert.deepEqual(query.candidateFacets(draft, source).responseTypes, ["input", "single_choice"]);
});
