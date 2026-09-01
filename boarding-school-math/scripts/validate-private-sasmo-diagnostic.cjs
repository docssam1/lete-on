#!/usr/bin/env node
"use strict";

/*
 * Local-only SASMO year-paper intake preflight.
 *
 * This validator accepts a teacher's private, authorised intake record. It
 * never reads contest PDFs, prints prompts or answers, or creates a public
 * release. Its job is to make a full 25-question diagnostic impossible to
 * score until every source page, answer proof, classification, and answer
 * contract has been recorded.
 */

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const diagnostic = require("../competition/sasmo-diagnostic-foundation.js");
const program = require("../competition/sasmo-program-architecture.js");

const SCHEMA_VERSION = "gfield-private-sasmo-diagnostic-v1";
const REFERENCE_SCHEMA_VERSION = "gfield-private-sasmo-diagnostic-v2";
const ITEM_COUNT = 25;
const RESPONSE_TYPES = new Set(["multiple-choice", "numeric-exact", "short-response"]);
const ANSWER_KINDS = new Set(["option-id", "numeric-exact", "short-text"]);
const ERROR_TYPE_IDS = new Set([
  "prerequisite-gap", "conceptual-misunderstanding", "procedure-error", "representation-error",
  "reasoning-error", "careless-error", "time-management"
]);

class ValidationError extends Error {
  constructor(code, reference) {
    super(`${code}: ${reference}`);
    this.code = code;
    this.reference = reference;
  }
}

function fail(code, reference) { throw new ValidationError(code, reference); }
function isRecord(value) { return !!value && typeof value === "object" && !Array.isArray(value); }
function isText(value) { return typeof value === "string" && value.trim() === value && value.length > 0; }
function assert(condition, code, reference) { if (!condition) fail(code, reference); }
function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }

function isInside(parent, child) {
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function containsGitMarker(directory) {
  let current = path.resolve(directory);
  while (true) {
    if (fs.existsSync(path.join(current, ".git"))) return true;
    const parent = path.dirname(current);
    if (parent === current) return false;
    current = parent;
  }
}

function assertExternalPrivateRoot(directory, projectRoot = path.resolve(__dirname, "..")) {
  const root = path.resolve(directory);
  assert(fs.existsSync(root) && fs.statSync(root).isDirectory(), "PRIVATE_ROOT_MISSING", root);
  assert(!isInside(projectRoot, root), "PRIVATE_ROOT_INSIDE_REPOSITORY", root);
  assert(!containsGitMarker(root), "PRIVATE_ROOT_GIT_DISCOVERABLE", root);
  return root;
}

function assertOnlyKeys(value, keys, code, reference) {
  assert(isRecord(value), code, reference);
  assert(Object.keys(value).every(function (key) { return keys.includes(key); }), code, reference);
}

function validateProof(proof, reference) {
  assertOnlyKeys(proof, ["answerProof", "officialLocator", "independentSolverIds", "solversAgree"], "ANSWER_PROOF_SHAPE_INVALID", reference);
  assert(diagnostic.ANSWER_PROOF_IDS.includes(proof.answerProof), "ANSWER_PROOF_INVALID", reference);
  if (proof.answerProof === "unverified") fail("ANSWER_PROOF_UNVERIFIED", reference);
  if (proof.answerProof.startsWith("official-")) {
    assert(isText(proof.officialLocator), "OFFICIAL_ANSWER_LOCATOR_MISSING", reference);
    assert(proof.independentSolverIds === undefined && proof.solversAgree === undefined, "OFFICIAL_PROOF_MIXED_WITH_SOLVERS", reference);
    return;
  }
  assert(proof.answerProof === "independent-dual-solve", "ANSWER_PROOF_INVALID", reference);
  assert(Array.isArray(proof.independentSolverIds) && proof.independentSolverIds.length === 2, "INDEPENDENT_SOLVERS_INVALID", reference);
  assert(proof.independentSolverIds.every(isText) && new Set(proof.independentSolverIds).size === 2, "INDEPENDENT_SOLVERS_INVALID", reference);
  assert(proof.solversAgree === true, "INDEPENDENT_SOLVERS_DISAGREE", reference);
  assert(proof.officialLocator === undefined, "INDEPENDENT_PROOF_MIXED_WITH_OFFICIAL", reference);
}

function validatePrivateAnswer(scoring, responseType, reference) {
  assertOnlyKeys(scoring, ["answerKind", "answerValue"], "PRIVATE_SCORING_SHAPE_INVALID", reference);
  assert(ANSWER_KINDS.has(scoring.answerKind) && isText(scoring.answerValue), "PRIVATE_SCORING_INVALID", reference);
  if (responseType === "multiple-choice") assert(scoring.answerKind === "option-id" && /^[A-E]$/.test(scoring.answerValue), "PRIVATE_SCORING_RESPONSE_MISMATCH", reference);
  if (responseType === "numeric-exact") assert(scoring.answerKind === "numeric-exact", "PRIVATE_SCORING_RESPONSE_MISMATCH", reference);
  if (responseType === "short-response") assert(scoring.answerKind === "short-text", "PRIVATE_SCORING_RESPONSE_MISMATCH", reference);
}

function validateItem(item, paper, index) {
  const reference = `item ${index + 1}`;
  assertOnlyKeys(item, ["itemId", "sourceLocator", "axisId", "skillId", "responseType", "primaryErrorType", "answerProof", "privateScoring"], "ITEM_SHAPE_INVALID", reference);
  assert(item.itemId === `sasmo-${paper.year}-${paper.levelId.toLowerCase()}-q${String(index + 1).padStart(2, "0")}`, "ITEM_ID_SEQUENCE_INVALID", reference);
  assert(isText(item.sourceLocator), "ITEM_SOURCE_LOCATOR_MISSING", reference);
  assert(program.AXIS_IDS.includes(item.axisId), "ITEM_AXIS_INVALID", reference);
  assert(isText(item.skillId), "ITEM_SKILL_INVALID", reference);
  assert(RESPONSE_TYPES.has(item.responseType), "ITEM_RESPONSE_TYPE_INVALID", reference);
  assert(ERROR_TYPE_IDS.has(item.primaryErrorType), "ITEM_ERROR_TYPE_INVALID", reference);
  validateProof(item.answerProof, reference);
  validatePrivateAnswer(item.privateScoring, item.responseType, reference);
}

function validatePackV1(pack) {
  assertOnlyKeys(pack, ["schemaVersion", "paper", "items"], "PACK_SHAPE_INVALID", "pack");
  assert(pack.schemaVersion === SCHEMA_VERSION, "PACK_SCHEMA_INVALID", "pack");
  assertOnlyKeys(pack.paper, ["programId", "year", "levelId", "sourcePageUrl", "sourceFingerprintSha256"], "PAPER_SHAPE_INVALID", "paper");
  assert(pack.paper.programId === "sasmo", "PAPER_PROGRAM_INVALID", "paper");
  const source = diagnostic.getYearSource(pack.paper.year);
  assert(!!source, "PAPER_YEAR_UNVERIFIED", "paper");
  assert(diagnostic.LEVEL_IDS.includes(pack.paper.levelId), "PAPER_LEVEL_UNVERIFIED", "paper");
  assert(source.sourcePageUrl === pack.paper.sourcePageUrl, "PAPER_SOURCE_URL_MISMATCH", "paper");
  assert(/^[a-f0-9]{64}$/.test(pack.paper.sourceFingerprintSha256), "PAPER_FINGERPRINT_INVALID", "paper");
  assert(Array.isArray(pack.items) && pack.items.length === ITEM_COUNT, "PAPER_ITEM_COUNT_INVALID", "items");
  pack.items.forEach(function (item, index) { validateItem(item, pack.paper, index); });
  const itemIds = pack.items.map(function (item) { return item.itemId; });
  assert(new Set(itemIds).size === ITEM_COUNT, "ITEM_IDS_DUPLICATE", "items");
  return Object.freeze({
    valid: true,
    year: pack.paper.year,
    levelId: pack.paper.levelId,
    itemCount: ITEM_COUNT,
    intakeFingerprint: sha256(JSON.stringify({
      year: pack.paper.year,
      levelId: pack.paper.levelId,
      sourceFingerprintSha256: pack.paper.sourceFingerprintSha256,
      itemIds
    }))
  });
}

/*
 * v2 records an actual paper obtained from a third-party public reference
 * without pretending that the download is an organizer-authorized student
 * delivery asset. The answer may be used only after the published solution
 * and an independently recorded method agree. Prompts and source files stay
 * outside Git; this validator never reads them.
 */
function validateReferenceProof(proof, reference) {
  assertOnlyKeys(proof, ["answerProof", "publishedSolutionLocator", "independentSolveMethod", "independentSolveConfirmed"], "REFERENCE_ANSWER_PROOF_SHAPE_INVALID", reference);
  assert(proof.answerProof === "published-solution-plus-independent", "REFERENCE_ANSWER_PROOF_INVALID", reference);
  assert(isText(proof.publishedSolutionLocator), "PUBLISHED_SOLUTION_LOCATOR_MISSING", reference);
  assert(isText(proof.independentSolveMethod), "INDEPENDENT_SOLVE_METHOD_MISSING", reference);
  assert(proof.independentSolveConfirmed === true, "INDEPENDENT_SOLVE_NOT_CONFIRMED", reference);
}

function validateReferenceItem(item, paper, index) {
  const reference = `item ${index + 1}`;
  assertOnlyKeys(item, ["itemId", "sourceLocator", "axisId", "skillId", "responseType", "primaryErrorType", "answerProof", "privateScoring"], "REFERENCE_ITEM_SHAPE_INVALID", reference);
  assert(item.itemId === `sasmo-${paper.year}-${paper.levelId.toLowerCase()}-q${String(index + 1).padStart(2, "0")}`, "ITEM_ID_SEQUENCE_INVALID", reference);
  assert(isText(item.sourceLocator), "ITEM_SOURCE_LOCATOR_MISSING", reference);
  assert(program.AXIS_IDS.includes(item.axisId), "ITEM_AXIS_INVALID", reference);
  assert(isText(item.skillId), "ITEM_SKILL_INVALID", reference);
  assert(RESPONSE_TYPES.has(item.responseType), "ITEM_RESPONSE_TYPE_INVALID", reference);
  assert(ERROR_TYPE_IDS.has(item.primaryErrorType), "ITEM_ERROR_TYPE_INVALID", reference);
  validateReferenceProof(item.answerProof, reference);
  validatePrivateAnswer(item.privateScoring, item.responseType, reference);
}

function validateReferencePack(pack) {
  assertOnlyKeys(pack, ["schemaVersion", "paper", "items"], "REFERENCE_PACK_SHAPE_INVALID", "pack");
  assert(pack.schemaVersion === REFERENCE_SCHEMA_VERSION, "REFERENCE_PACK_SCHEMA_INVALID", "pack");
  assertOnlyKeys(pack.paper, ["programId", "year", "levelId", "sourceType", "sourcePageUrl", "sourceFingerprintSha256", "rightsState"], "REFERENCE_PAPER_SHAPE_INVALID", "paper");
  assert(pack.paper.programId === "sasmo", "PAPER_PROGRAM_INVALID", "paper");
  assert(Number.isInteger(pack.paper.year) && pack.paper.year >= 2014 && pack.paper.year <= 2025, "PAPER_YEAR_INVALID", "paper");
  assert(diagnostic.LEVEL_IDS.includes(pack.paper.levelId), "PAPER_LEVEL_UNVERIFIED", "paper");
  assert(pack.paper.sourceType === "third-party-public-reference", "REFERENCE_SOURCE_TYPE_INVALID", "paper");
  assert(isText(pack.paper.sourcePageUrl) && /^https:\/\//.test(pack.paper.sourcePageUrl), "PAPER_SOURCE_URL_INVALID", "paper");
  assert(/^[a-f0-9]{64}$/.test(pack.paper.sourceFingerprintSha256), "PAPER_FINGERPRINT_INVALID", "paper");
  assert(pack.paper.rightsState === "private-reference-only", "REFERENCE_RIGHTS_STATE_INVALID", "paper");
  assert(Array.isArray(pack.items) && pack.items.length === ITEM_COUNT, "PAPER_ITEM_COUNT_INVALID", "items");
  pack.items.forEach(function (item, index) { validateReferenceItem(item, pack.paper, index); });
  const itemIds = pack.items.map(function (item) { return item.itemId; });
  assert(new Set(itemIds).size === ITEM_COUNT, "ITEM_IDS_DUPLICATE", "items");
  return Object.freeze({
    valid: true,
    year: pack.paper.year,
    levelId: pack.paper.levelId,
    itemCount: ITEM_COUNT,
    sourceType: pack.paper.sourceType,
    rightsState: pack.paper.rightsState,
    deliveryState: "intake-only",
    intakeFingerprint: sha256(JSON.stringify({
      year: pack.paper.year,
      levelId: pack.paper.levelId,
      sourceFingerprintSha256: pack.paper.sourceFingerprintSha256,
      itemIds
    }))
  });
}

function validatePack(pack) {
  if (isRecord(pack) && pack.schemaVersion === REFERENCE_SCHEMA_VERSION) return validateReferencePack(pack);
  return validatePackV1(pack);
}

function readOnlyJson(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  try { return JSON.parse(source); } catch (error) { fail("PRIVATE_PACK_JSON_INVALID", path.basename(filePath)); }
}

function loadPrivatePack(directory, fileName) {
  const root = assertExternalPrivateRoot(directory);
  assert(typeof fileName === "string" && /^sasmo-(2019|2020)-g(?:[2-9]|10)-diagnostic\.json$/.test(fileName), "PRIVATE_PACK_FILENAME_INVALID", String(fileName));
  const target = path.resolve(root, fileName);
  assert(isInside(root, target) && fs.existsSync(target) && fs.statSync(target).isFile(), "PRIVATE_PACK_MISSING", fileName);
  const pack = readOnlyJson(target);
  return Object.freeze({ pack, validation: validatePack(pack) });
}

function publicManifest(pack) {
  const validation = validatePack(pack);
  const referenceOnly = validation.sourceType === "third-party-public-reference";
  return Object.freeze({
    schemaVersion: "gfield-sasmo-private-intake-manifest-v1",
    programId: "sasmo",
    year: validation.year,
    levelId: validation.levelId,
    itemCount: validation.itemCount,
    intakeFingerprint: validation.intakeFingerprint,
    deliveryState: validation.deliveryState || "ready-for-private-intake",
    referenceOnly,
    items: Object.freeze(pack.items.map(function (item) {
      const manifestItem = {
        itemId: item.itemId,
        axisId: item.axisId,
        skillId: item.skillId,
        responseType: item.responseType,
        primaryErrorType: item.primaryErrorType
      };
      if (!referenceOnly) {
        manifestItem.sourceLocator = item.sourceLocator;
        manifestItem.answerProof = item.answerProof.answerProof;
      }
      return Object.freeze(manifestItem);
    }))
  });
}

if (require.main === module) {
  const rootFlag = process.argv.indexOf("--root");
  const fileFlag = process.argv.indexOf("--file");
  if (rootFlag < 0 || fileFlag < 0 || !process.argv[rootFlag + 1] || !process.argv[fileFlag + 1]) {
    console.error("Usage: node scripts/validate-private-sasmo-diagnostic.cjs --root <external-private-root> --file <sasmo-year-grade-diagnostic.json>");
    process.exitCode = 2;
  } else {
    try {
      const result = loadPrivatePack(process.argv[rootFlag + 1], process.argv[fileFlag + 1]).validation;
      console.log(`PASS private SASMO intake: ${result.year} ${result.levelId}, ${result.itemCount} verified item records`);
    } catch (error) {
      console.error(`BLOCKED private SASMO intake: ${error.code || "INVALID"} ${error.reference || ""}`.trim());
      process.exitCode = 2;
    }
  }
}

module.exports = Object.freeze({
  SCHEMA_VERSION,
  REFERENCE_SCHEMA_VERSION,
  ITEM_COUNT,
  ValidationError,
  assertExternalPrivateRoot,
  validatePack,
  loadPrivatePack,
  publicManifest
});
