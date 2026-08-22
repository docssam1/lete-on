const test = require("node:test");
const assert = require("node:assert/strict");
const contracts = require("../server/exam-contracts.js");
const privateConfig = require("../server/private-config.js");

const EXAM_ID = "dp-common1-entry-202405";

test("DP common math 1 first sale mock is wired without an inferred cutline", () => {
  const contract = contracts.getExamContract(EXAM_ID);
  assert.equal(contract.examId, EXAM_ID);
  assert.equal(contract.title, "DP 공통수학1 입학 1차 모의고사");
  assert.equal(contract.deliveryRole, "first-sale-mock");
  assert.equal(contract.formProfile, "sale-mock-a4-v1");
  assert.equal(contract.questionCount, 30);
  assert.equal(contract.pageCount, 10);
  assert.equal(contract.operationalScorePolicy.totalPoints, 30);
  assert.equal(contract.cutlinePolicy, null);
  const schema = contracts.responseSchemaFor(EXAM_ID, "student-DP-CM1");
  assert.equal(schema.examId, EXAM_ID);
  assert.equal(schema.questions.length, 30);
});

test("DP common math 1 remains locked until the owner confirms the whole round", () => {
  const normalized = privateConfig.normalize({
    schemaVersion: "highselect-private-config/v1",
    students: [],
    exams: {
      [EXAM_ID]: {
        pageAssetRoot: "C:/private/dp-common1/pages",
        pageCount: 10,
        questionCount: 30,
        releaseStatus: "review_pending",
        answerStatus: "verified",
        classificationStatus: "verified",
        responseSchemaStatus: "verified",
        scoringPolicyStatus: "verified",
        printAuditStatus: "passed",
        signedAssetsStatus: "verified",
        finalRoundConfirmation: false
      }
    }
  });
  assert.equal(privateConfig.isReleased(normalized.exams[EXAM_ID]), false);
});
