"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const SCHEMA_VERSION = "highselect-private-saengsu-candidate-db/v1";
const FORBIDDEN_KEY_NAMES = new Set([
  "questiontext", "questionbody", "prompt", "stem", "answer", "answerkey", "answers",
  "solution", "solutions", "rawtext", "sourcepath", "originalpath", "filepath",
  "downloadurl", "storageurl", "pageimage"
]);
const PATH_LIKE = /(?:[A-Za-z]:[\\/]|\\\\|\/(?:Users|home)\/|(?:^|[\\/])\.\.(?:[\\/]|$)|\.(?:pdf|hwp|hwpx|docx?|png|jpe?g)(?:$|[?#]))/i;

function fail(message) { throw new TypeError(message); }
function clean(value) { return String(value == null ? "" : value).trim(); }
function required(value, label) {
  const result = clean(value);
  if (!result) fail(`${label} is required`);
  return result;
}
function integer(value, label, minimum, maximum) {
  const result = Number(value);
  if (!Number.isSafeInteger(result) || result < minimum || result > maximum) fail(`${label} is invalid`);
  return result;
}
function array(value) { return Array.isArray(value) ? value.map(clean).filter(Boolean) : []; }
function stableTypeId(parts) {
  return `SMTYPE-${crypto.createHash("sha256").update(JSON.stringify(parts.map(clean))).digest("hex").slice(0, 16).toUpperCase()}`;
}
function normalizedKey(value) { return clean(value).replace(/[^A-Za-z0-9]/g, "").toLowerCase(); }
function assertSafe(value, label) {
  if (Array.isArray(value)) return value.forEach((entry, index) => assertSafe(entry, `${label}[${index}]`));
  if (!value || typeof value !== "object") {
    if (typeof value === "string" && PATH_LIKE.test(value)) fail(`${label} contains a path-like value`);
    return;
  }
  Object.entries(value).forEach(([key, entry]) => {
    if (FORBIDDEN_KEY_NAMES.has(normalizedKey(key))) fail(`${label}.${key} is forbidden`);
    assertSafe(entry, `${label}.${key}`);
  });
}

function normalizeQuestion(raw, paper) {
  const number = integer(raw.number, `${paper.paperId}.question.number`, 1, 30);
  const semesters = array(raw.semesters).length ? array(raw.semesters) : [required(raw.semester, `${paper.paperId}.Q${number}.semester`)];
  const primaryDomain = required(raw.primaryDomain || raw.domain, `${paper.paperId}.Q${number}.primaryDomain`);
  if (!["대수", "기하"].includes(primaryDomain)) fail(`${paper.paperId}.Q${number}.primaryDomain is invalid`);
  const majorUnit = required(raw.largeUnit || raw.majorUnit, `${paper.paperId}.Q${number}.majorUnit`);
  const minorUnit = required(raw.smallUnit || raw.minorUnit, `${paper.paperId}.Q${number}.minorUnit`);
  const detailType = required(raw.detailType || raw.fineType, `${paper.paperId}.Q${number}.detailType`);
  const legacyDifficulty = required(raw.difficulty, `${paper.paperId}.Q${number}.difficulty`);
  if (!["기본", "심화", "최상"].includes(legacyDifficulty)) fail(`${paper.paperId}.Q${number}.difficulty is invalid`);
  const structureUse = required(raw.structureUse, `${paper.paperId}.Q${number}.structureUse`);
  const difficultyAction = required(raw.difficultyAction, `${paper.paperId}.Q${number}.difficultyAction`);
  if (!["retain", "adapt", "exclude"].includes(structureUse)) fail(`${paper.paperId}.Q${number}.structureUse is invalid`);
  if (!["retain", "raise", "review"].includes(difficultyAction)) fail(`${paper.paperId}.Q${number}.difficultyAction is invalid`);
  const withinCurrentRange = raw.withinCurrentRange == null ? Boolean(raw.currentRange) : Boolean(raw.withinCurrentRange);
  if (!withinCurrentRange && structureUse !== "exclude") fail(`${paper.paperId}.Q${number} must be excluded outside the current range`);
  if (withinCurrentRange && structureUse === "exclude") fail(`${paper.paperId}.Q${number} cannot be excluded inside the current range`);
  const currentSemesters = new Set(["중2-2", "중3-1", "중3-2"]);
  if (withinCurrentRange && semesters.some((semester) => !currentSemesters.has(semester))) fail(`${paper.paperId}.Q${number}.semesters is outside the current range`);
  const curriculum = Object.freeze({
    semesters: Object.freeze(semesters),
    primaryDomain,
    majorUnit,
    minorUnit,
    detailType,
    secondaryUnits: Object.freeze(array(raw.secondaryUnits)),
    prerequisiteUnits: Object.freeze(array(raw.prerequisiteUnits)),
    curriculumStatus: clean(raw.curriculumStatus) || (withinCurrentRange ? "verified" : "excluded_or_review")
  });
  const candidateTypeId = stableTypeId([primaryDomain, majorUnit, minorUnit, detailType]);
  return Object.freeze({
    questionId: `${paper.paperId}-Q${String(number).padStart(2, "0")}`,
    paperId: paper.paperId,
    questionNumber: number,
    sourceLocator: Object.freeze({ sourceId: paper.sourceId, questionNumber: number }),
    candidateTypeId,
    curriculum,
    withinCurrentRange,
    legacyDifficulty,
    structureUse,
    difficultyAction,
    targetDifficultyBand: difficultyAction === "retain" && legacyDifficulty === "최상" ? "raised" : "review_required",
    responseEvidence: Object.freeze({
      keySectionPresent: Boolean(raw.answerPresent == null ? raw.answerKeyPresent : raw.answerPresent),
      explanationPresent: Boolean(raw.explanationPresent == null ? raw.solutionPresent : raw.explanationPresent),
      independentCorrectnessVerified: false
    }),
    academyCompatibility: Object.freeze([
      Object.freeze({ profileId: "SM_STANDARD", state: withinCurrentRange && structureUse !== "exclude" ? "candidate" : "excluded", evidence: "2022_legacy_mock_reference" })
    ]),
    usageApproved: false,
    releaseStatus: "locked"
  });
}

function buildCandidateDb(input) {
  if (!input || typeof input !== "object") fail("input is required");
  const papers = [
    { paperId: "SM-LEGACY-R01", sourceId: "saengsu-cm1-entry-legacy-r01", audit: input.r01 },
    { paperId: "SM-LEGACY-R02", sourceId: "saengsu-cm1-entry-legacy-r02", audit: input.r02 }
  ];
  const profile = input.profile;
  if (!profile || profile.profileId !== "SM_CM1_ENTRY_STANDARD") fail("profile is invalid");
  const questions = papers.flatMap((paper) => {
    if (!paper.audit || !Array.isArray(paper.audit.questions) || paper.audit.questions.length !== 30) fail(`${paper.paperId} must contain 30 questions`);
    const normalized = paper.audit.questions.map((question) => normalizeQuestion(question, paper));
    const numbers = normalized.map((question) => question.questionNumber).sort((a, b) => a - b);
    if (numbers.some((number, index) => number !== index + 1)) fail(`${paper.paperId} question numbers must be 1..30 exactly once`);
    return normalized;
  });
  const types = new Map();
  questions.forEach((question) => {
    const existing = types.get(question.candidateTypeId);
    if (existing && existing.detailType !== question.curriculum.detailType) fail("candidate type hash collision");
    if (!existing) types.set(question.candidateTypeId, Object.freeze({
      candidateTypeId: question.candidateTypeId,
      primaryDomain: question.curriculum.primaryDomain,
      majorUnit: question.curriculum.majorUnit,
      minorUnit: question.curriculum.minorUnit,
      detailType: question.curriculum.detailType,
      canonicalMergeStatus: "pending"
    }));
  });
  const summary = Object.freeze({
    paperCount: papers.length,
    questionCount: questions.length,
    currentRangeCount: questions.filter((question) => question.withinCurrentRange).length,
    excludedCount: questions.filter((question) => !question.withinCurrentRange).length,
    candidateCount: questions.filter((question) => question.academyCompatibility[0].state === "candidate").length,
    usageApprovedCount: questions.filter((question) => question.usageApproved).length,
    typeCount: types.size,
    currentRangeDomainCounts: Object.freeze({
      algebra: questions.filter((question) => question.withinCurrentRange && question.curriculum.primaryDomain === "대수").length,
      geometry: questions.filter((question) => question.withinCurrentRange && question.curriculum.primaryDomain === "기하").length
    }),
    structureUse: Object.freeze(Object.fromEntries(["retain", "adapt", "exclude"].map((key) => [key, questions.filter((question) => question.structureUse === key).length]))),
    difficultyAction: Object.freeze(Object.fromEntries(["retain", "raise", "review"].map((key) => [key, questions.filter((question) => question.difficultyAction === key).length])))
  });
  if (summary.questionCount !== profile.combinedAudit.questionCount || summary.currentRangeCount !== profile.combinedAudit.withinCurrentRange) fail("profile and audit totals disagree");
  if (summary.currentRangeDomainCounts.algebra !== profile.combinedAudit.withinCurrentRangeDomainCounts["대수"] || summary.currentRangeDomainCounts.geometry !== profile.combinedAudit.withinCurrentRangeDomainCounts["기하"]) fail("profile and current-range domain totals disagree");
  const output = Object.freeze({
    schemaVersion: SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    profileId: profile.profileId,
    academyStyleId: profile.academyStyleId,
    sourceRole: "legacy_reference_candidates",
    officialCurrentExam: false,
    representativePolicy: Object.freeze({
      range: Object.freeze(profile.currentExam.range.slice()),
      questionCount: profile.currentExam.questionCount,
      domainBalance: Object.freeze({ algebra: profile.currentExam.domainBalance["대수"], geometry: profile.currentExam.domainBalance["기하"] }),
      timeMinutes: profile.currentExam.timeMinutes,
      referenceCutline: Object.freeze({ score: profile.currentExam.passCount, total: profile.currentExam.questionCount, status: "public_reference_only" }),
      operationalCutline: null,
      cutlineStatus: "locked_non_operational",
      difficultyDirection: profile.difficultyDecision.direction,
      publicLabel: profile.publicLabel,
      forbiddenLabel: profile.forbiddenLabel
    }),
    summary,
    types: Object.freeze(Array.from(types.values()).sort((left, right) => left.candidateTypeId.localeCompare(right.candidateTypeId))),
    questions: Object.freeze(questions)
  });
  assertSafe(output, "output");
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
  const [r01Path, r02Path, profilePath, outputPath] = process.argv.slice(2);
  if (!r01Path || !r02Path || !profilePath || !outputPath) {
    console.error("usage: node build-saengsu-legacy-candidate-db.cjs <r01-audit.json> <r02-audit.json> <profile.json> <output.json>");
    process.exit(2);
  }
  const read = (filePath) => JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
  const output = buildCandidateDb({ r01: read(r01Path), r02: read(r02Path), profile: read(profilePath) });
  writeJsonAtomic(outputPath, output);
  console.log(JSON.stringify({ outputPath: path.resolve(outputPath), summary: output.summary }, null, 2));
}

module.exports = { SCHEMA_VERSION, buildCandidateDb, assertSafe };
