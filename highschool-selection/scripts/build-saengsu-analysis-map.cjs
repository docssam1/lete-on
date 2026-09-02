"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { assertSafe } = require("./build-saengsu-legacy-candidate-db.cjs");

const OUTPUT_SCHEMA = "highselect-private-saengsu-analysis-map/v1";
const ANSWER_STATUSES = ["verified", "disputed", "blocked"];
const TAXONOMY_STATUSES = ["merge_existing", "alias_existing", "alias_internal_group", "keep_separate", "new_type", "excluded", "pending"];

function fail(message) { throw new TypeError(message); }
function clean(value) { return String(value == null ? "" : value).trim(); }
function countBy(items, key) {
  return Object.fromEntries(Array.from(new Set(items.map(key).filter(Boolean))).sort().map(value => [value, items.filter(item => key(item) === value).length]));
}

function orderedBuckets(items, key) {
  return Object.entries(countBy(items, key)).map(([label, questionCount]) => ({ label, questionCount }));
}

function buildAnalysisMap(candidateDb) {
  if (!candidateDb || candidateDb.schemaVersion !== "highselect-private-saengsu-candidate-db/v1") fail("candidate DB schema is invalid");
  const questions = Array.isArray(candidateDb.questions) ? candidateDb.questions : [];
  const types = Array.isArray(candidateDb.types) ? candidateDb.types : [];
  const policy = candidateDb.representativePolicy;
  if (!policy || !Array.isArray(policy.range) || policy.range.length !== 3 || policy.questionCount !== 30) fail("representative policy is invalid");
  if (questions.length !== 60 || types.length !== 60) fail("analysis requires 60 candidate questions and 60 candidate types");
  if (!questions.every(question => question.releaseStatus === "locked" && question.usageApproved === false)) fail("analysis requires release-locked candidates");
  const currentRange = questions.filter(question => question.withinCurrentRange === true);
  const excluded = questions.filter(question => question.withinCurrentRange !== true);
  const answerCounts = Object.fromEntries(ANSWER_STATUSES.map(status => [status, questions.filter(question => clean(question.answerVerification && question.answerVerification.status) === status).length]));
  const taxonomyCounts = Object.fromEntries(TAXONOMY_STATUSES.map(status => [status, types.filter(type => clean(type.canonicalMergeStatus) === status).length]));
  if (currentRange.length + excluded.length !== questions.length) fail("range analysis is inconsistent");
  if (Object.values(answerCounts).reduce((sum, value) => sum + value, 0) !== questions.length) fail("answer verification analysis is incomplete");
  if (Object.values(taxonomyCounts).reduce((sum, value) => sum + value, 0) !== types.length) fail("taxonomy analysis is incomplete");

  const output = {
    schemaVersion: OUTPUT_SCHEMA,
    analysisOnly: true,
    sourceRole: "legacy_reference_candidates",
    officialCurrentExam: false,
    representativePolicy: {
      range: policy.range.slice(),
      questionCount: policy.questionCount,
      domainBalance: { ...policy.domainBalance },
      timeMinutes: policy.timeMinutes,
      referenceCutline: { ...policy.referenceCutline },
      operationalCutline: null,
      cutlineStatus: policy.cutlineStatus,
      difficultyDirection: policy.difficultyDirection,
      publicLabel: policy.publicLabel,
      forbiddenLabel: policy.forbiddenLabel
    },
    observedReferenceMap: {
      currentRangeQuestionCount: currentRange.length,
      excludedQuestionCount: excluded.length,
      bySemester: orderedBuckets(currentRange, question => clean(question.curriculum && question.curriculum.semesters && question.curriculum.semesters.join(" + "))),
      byDomain: orderedBuckets(currentRange, question => clean(question.curriculum && question.curriculum.primaryDomain)),
      byMajorUnit: orderedBuckets(currentRange, question => clean(question.curriculum && question.curriculum.majorUnit)),
      byDifficultyAction: orderedBuckets(currentRange, question => clean(question.difficultyAction)),
      byStructureUse: orderedBuckets(currentRange, question => clean(question.structureUse)),
      taxonomyStatus: taxonomyCounts
    },
    verification: {
      answerStatus: answerCounts,
      releaseLockedQuestionCount: questions.filter(question => question.releaseStatus === "locked").length,
      usageApprovedQuestionCount: questions.filter(question => question.usageApproved === true).length
    },
    representativeReadiness: {
      canCompose: false,
      canServe: false,
      status: "locked",
      blockers: [
        "구판 참고 자료이므로 현행 공식 시험으로 단정할 수 없습니다.",
        "독립 답 검증이 완료되지 않은 문항이 남아 있습니다.",
        "학습 적합성·난도·출제 승인 검수가 아직 없습니다."
      ]
    }
  };
  assertSafe(output, "saengsu analysis map");
  return output;
}

function writeJsonAtomic(filePath, value) {
  const resolved = path.resolve(filePath);
  const temporary = `${resolved}.tmp-${process.pid}`;
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  fs.renameSync(temporary, resolved);
}

if (require.main === module) {
  const [inputPath, outputPath] = process.argv.slice(2);
  if (!inputPath || !outputPath) throw new Error("usage: node build-saengsu-analysis-map.cjs <candidate-db.json> <output.json>");
  const candidateDb = JSON.parse(fs.readFileSync(path.resolve(inputPath), "utf8"));
  const output = buildAnalysisMap(candidateDb);
  writeJsonAtomic(outputPath, output);
  process.stdout.write(`${JSON.stringify({ outputPath: path.resolve(outputPath), currentRangeQuestionCount: output.observedReferenceMap.currentRangeQuestionCount, canCompose: output.representativeReadiness.canCompose })}\n`);
}

module.exports = Object.freeze({ OUTPUT_SCHEMA, buildAnalysisMap });
