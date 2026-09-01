"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { assertSafe } = require("./build-saengsu-legacy-candidate-db.cjs");

const ANSWER_STATUSES = new Set(["verified", "disputed", "blocked"]);
const TYPE_DECISIONS = new Set([
  "merge_existing",
  "alias_existing",
  "alias_internal_group",
  "keep_separate",
  "new_type",
  "excluded",
  "locked"
]);

function fail(message) { throw new TypeError(message); }
function clean(value) { return String(value == null ? "" : value).trim(); }
function readJson(filePath) { return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8")); }

function canonicalQuestionId(value) {
  return clean(value)
    .replace(/^SM-R01-Q/i, "SM-LEGACY-R01-Q")
    .replace(/^SM-R02-Q/i, "SM-LEGACY-R02-Q");
}

function indexUnique(items, key, label) {
  if (!Array.isArray(items)) fail(`${label} must be an array`);
  const indexed = new Map();
  items.forEach((item, index) => {
    const id = clean(item && item[key]);
    if (!id) fail(`${label}[${index}].${key} is required`);
    if (indexed.has(id)) fail(`${label} contains duplicate ${key}: ${id}`);
    indexed.set(id, item);
  });
  return indexed;
}

function normalizeAnswerReview(review, questionId) {
  const rawStatus = clean(review.status || review.verificationStatus);
  const hasAmbiguity = review.ambiguity === true || Boolean(review.ambiguity && review.ambiguity.hasAmbiguity === true);
  const status = rawStatus === "locked"
    ? (review.officialAnswerMatch === false ? "disputed" : "blocked")
    : rawStatus;
  if (!ANSWER_STATUSES.has(status)) fail(`${questionId} answer review status is invalid`);
  const independentAuditShape = Object.prototype.hasOwnProperty.call(review, "officialAnswerMatch");
  const result = {
    status,
    verifier: clean(review.verifier) || "independent_math_review",
    reviewedAt: clean(review.reviewedAt) || null,
    officialKeyMatch: review.officialKeyMatch === true || review.officialAnswerMatch === true,
    singleAnswerConfirmed: review.singleAnswerConfirmed === true || (independentAuditShape && status === "verified" && !hasAmbiguity),
    diagramObservabilityConfirmed: review.diagramObservabilityConfirmed === true || Boolean(review.diagramDependency && review.diagramDependency.visibleEnough === true),
    evidenceLocator: clean(review.evidenceLocator) || null
  };
  if (status === "verified") {
    if (!result.officialKeyMatch) fail(`${questionId} verified review must match the official key`);
    if (!result.singleAnswerConfirmed) fail(`${questionId} verified review must confirm a single answer`);
    if (!result.evidenceLocator) fail(`${questionId} verified review requires an evidence locator`);
  }
  return result;
}

function normalizeTypeReview(review, candidateTypeId) {
  const rawDecision = clean(review.decision || review.recommendedDecision);
  const decision = rawDecision === "keep_separate_related" ? "keep_separate"
    : rawDecision === "locked/excluded" ? "excluded"
      : rawDecision;
  if (!TYPE_DECISIONS.has(decision)) fail(`${candidateTypeId} type review decision is invalid`);
  let target = review.target && typeof review.target === "object" ? {
    sourceBankId: clean(review.target.sourceBankId),
    sourceTypeId: clean(review.target.sourceTypeId)
  } : null;
  const targetTypeId = clean(review.targetTypeId);
  if (!target && targetTypeId) {
    const sourceBankId = clean(review.targetDefinition && review.targetDefinition.sourceBankId)
      || (targetTypeId.startsWith("DP-TYP-") ? "DOLPA-ORIGINAL"
        : targetTypeId.startsWith("SH-TYP-") ? "HWANGSO-MIDDLE"
          : targetTypeId.startsWith("typ-sh-") ? "HWANGSO-HIGH-R01"
            : targetTypeId.startsWith("CM") ? "COMMON-TYPE-INDEX"
              : targetTypeId.startsWith("SMTYPE-") ? "SAENGSU-CM1-LEGACY"
                : "");
    if (!sourceBankId) fail(`${candidateTypeId} target source bank cannot be inferred`);
    target = { sourceBankId, sourceTypeId: targetTypeId };
  }
  if (["merge_existing", "alias_existing"].includes(decision)) {
    if (!target || !target.sourceBankId || !target.sourceTypeId) fail(`${candidateTypeId} ${decision} requires a target`);
  }
  const internalGroupId = clean(review.internalGroupId || review.internalCanonicalGroupId)
    || (decision === "alias_internal_group" && target && target.sourceBankId === "SAENGSU-CM1-LEGACY"
      ? `representative:${target.sourceTypeId}`
      : null);
  if (decision === "alias_internal_group" && !internalGroupId) fail(`${candidateTypeId} alias_internal_group requires an internal group`);
  return {
    decision,
    target: target && target.sourceBankId && target.sourceTypeId ? target : null,
    internalGroupId,
    confidence: Number.isFinite(Number(review.confidence)) ? Number(review.confidence) : null,
    reviewer: clean(review.reviewer) || "taxonomy_review",
    reviewedAt: clean(review.reviewedAt) || null,
    evidenceLocator: clean(review.evidenceLocator) || null
  };
}

function applyReviewGates(candidateDb, answerLedger, typeLedger) {
  if (!candidateDb || candidateDb.schemaVersion !== "highselect-private-saengsu-candidate-db/v1") fail("candidate DB schema is invalid");
  const questions = Array.isArray(candidateDb.questions) ? candidateDb.questions : [];
  const types = Array.isArray(candidateDb.types) ? candidateDb.types : [];
  const questionIds = new Set(questions.map(item => item.questionId));
  const typeIds = new Set(types.map(item => item.candidateTypeId));
  const answerLedgers = (Array.isArray(answerLedger) ? answerLedger : [answerLedger]).filter(Boolean);
  const answerReviews = answerLedgers.flatMap(ledger => ((ledger && (ledger.reviews || ledger.questions)) || []).map(review => ({
      ...review,
      questionId: canonicalQuestionId(review.questionId),
      reviewedAt: clean(review.reviewedAt) || clean(ledger && (ledger.createdAt || ledger.generatedAt || ledger.verifiedAt)),
      evidenceLocator: clean(review.evidenceLocator) || `${clean(ledger && (ledger.auditId || ledger.verificationId)) || clean(ledger && ledger.schemaVersion) || "saengsu-independent-answer-review"}|${clean(review.questionId)}`
    })));
  const answerById = indexUnique(answerReviews, "questionId", "answer reviews");
  const typeLedgers = (Array.isArray(typeLedger) ? typeLedger : [typeLedger]).filter(Boolean);
  const typeReviews = typeLedgers.flatMap(ledger => ((ledger && ledger.reviews) || []).map(review => ({
    ...review,
    decision: review.decision || review.recommendedDecision,
    reviewedAt: clean(review.reviewedAt) || clean(ledger && (ledger.generatedAt || ledger.createdAt)),
    evidenceLocator: clean(review.evidenceLocator) || `${clean(ledger && ledger.schemaVersion) || "saengsu-type-review"}|${clean(review.candidateTypeId)}`
  })));
  const typeById = indexUnique(typeReviews, "candidateTypeId", "type reviews");
  answerById.forEach((value, id) => { if (!questionIds.has(id)) fail(`answer review references an unknown question: ${id}`); });
  typeById.forEach((value, id) => { if (!typeIds.has(id)) fail(`type review references an unknown type: ${id}`); });

  const reviewedQuestions = questions.map(question => {
    const rawReview = answerById.get(question.questionId);
    const answerVerification = rawReview ? normalizeAnswerReview(rawReview, question.questionId) : {
      status: "blocked",
      verifier: null,
      reviewedAt: null,
      officialKeyMatch: false,
      singleAnswerConfirmed: false,
      diagramObservabilityConfirmed: false,
      evidenceLocator: null
    };
    return {
      ...question,
      responseEvidence: {
        ...question.responseEvidence,
        independentCorrectnessVerified: answerVerification.status === "verified",
        singleAnswerConfirmed: answerVerification.status === "verified" && answerVerification.singleAnswerConfirmed,
        diagramObservabilityConfirmed: answerVerification.status === "verified" && answerVerification.diagramObservabilityConfirmed
      },
      answerVerification,
      usageApproved: false,
      releaseStatus: "locked"
    };
  });

  const reviewedTypes = types.map(type => {
    const rawReview = typeById.get(type.candidateTypeId);
    if (!rawReview) return { ...type, canonicalMergeStatus: "pending", canonicalTarget: null, taxonomyReview: null };
    const review = normalizeTypeReview(rawReview, type.candidateTypeId);
    return {
      ...type,
      canonicalMergeStatus: review.decision,
      canonicalTarget: ["merge_existing", "alias_existing"].includes(review.decision) ? review.target : null,
      canonicalInternalGroupId: review.internalGroupId,
      taxonomyReview: review
    };
  });

  const answerCounts = Object.fromEntries(Array.from(ANSWER_STATUSES, status => [status, reviewedQuestions.filter(item => item.answerVerification.status === status).length]));
  const typeCounts = Object.fromEntries(Array.from(TYPE_DECISIONS, decision => [decision, reviewedTypes.filter(item => item.canonicalMergeStatus === decision).length]));
  typeCounts.pending = reviewedTypes.filter(item => item.canonicalMergeStatus === "pending").length;
  const output = {
    ...candidateDb,
    reviewGateVersion: "saengsu-review-gates/v1",
    summary: {
      ...candidateDb.summary,
      answerVerification: answerCounts,
      typeReview: typeCounts,
      usageApprovedCount: 0
    },
    types: reviewedTypes,
    questions: reviewedQuestions
  };
  assertSafe(output, "reviewed candidate DB");
  return output;
}

function writeJsonAtomic(filePath, value) {
  const resolved = path.resolve(filePath);
  const temporary = `${resolved}.tmp-${process.pid}`;
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  fs.renameSync(temporary, resolved);
}

function main(args) {
  if (args.length !== 4) throw new Error("usage: node apply-saengsu-review-gates.cjs <candidate-db.json> <answer-ledger.json> <type-ledger.json> <output.json>");
  const answerLedgers = args[1].split(",").map(clean).filter(Boolean).map(readJson);
  const typeLedgers = args[2].split(",").map(clean).filter(Boolean).map(readJson);
  const output = applyReviewGates(readJson(args[0]), answerLedgers, typeLedgers);
  writeJsonAtomic(args[3], output);
  process.stdout.write(`${JSON.stringify({ outputPath: path.resolve(args[3]), summary: output.summary }, null, 2)}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ ANSWER_STATUSES, TYPE_DECISIONS, applyReviewGates });
