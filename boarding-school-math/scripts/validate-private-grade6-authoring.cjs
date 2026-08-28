#!/usr/bin/env node
"use strict";

/*
 * Local-only preflight for unreviewed Grade 6 authoring drafts.
 *
 * This file deliberately validates shape, lineage, visibility, and release
 * boundaries only. It never creates a release, prints prompt/answer content,
 * or treats author verification as independent approval.
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");
const { spawnSync } = require("child_process");
const placement = require("../assessment/grade6-placement-plan.js");
const contract = require("../question-bank/item-release-contract.js");
const delivery = require("../shared/learning-delivery-contract.js");

const DRAFT_SCHEMA_VERSION = "gfield-private-authoring-draft-v1";
const DRAFT_STATE = "draft-pending-independent-review";
const PRIVATE_ITEM_KEYS = new Set([
  "slotId", "itemId", "clusterId", "domainId", "skillId", "standardIds", "difficulty", "responseType",
  "publicDraft", "privateDraft", "verification", "rightsDraft", "assetDrafts"
]);
const PUBLIC_DRAFT_KEYS = new Set(["promptBlocks", "options", "assets", "responseUi"]);
const ASSET_DRAFT_KEYS = new Set(["assetId", "sourcePath", "rightsDraft"]);
const VERIFICATION_KEYS = new Set(["state", "reviewPending", "methods", "candidateCheck"]);
const VERIFICATION_METHOD_KEYS = new Set(["methodId", "evidenceByLocale"]);
const CANDIDATE_CHECK_KEYS = new Set(["kind", "totalCandidates", "validAnswerCount"]);
const ERROR_SIGNAL_KEYS = new Set(["code", "observedValue", "errorType", "rationaleByLocale"]);
const LOCAL_PENDING_RIGHTS_DECISIONS = new Set([
  "pending-independent-review", "draft-pending-independent-rights-review"
]);

class ValidationError extends Error {
  constructor(code, reference) {
    super(code);
    this.code = code;
    this.reference = reference;
  }
}

function fail(code, reference) {
  throw new ValidationError(code, reference);
}

function isRecord(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function nonBlankText(value) {
  return typeof value === "string" && value.trim() === value && value.length > 0;
}

function assert(condition, code, reference) {
  if (!condition) fail(code, reference);
}

function assertRecord(value, code, reference) {
  assert(isRecord(value), code, reference);
}

function assertDenseArray(value, code, reference) {
  assert(Array.isArray(value), code, reference);
  for (let index = 0; index < value.length; index += 1) {
    assert(Object.prototype.hasOwnProperty.call(value, index), code, reference);
  }
}

function assertOnlyKeys(value, allowed, code, reference) {
  assertRecord(value, code, reference);
  assert(Object.keys(value).every(function (key) { return allowed.has(key); }), code, reference);
}

function localId(item, fileName, index) {
  if (item && typeof item.itemId === "string" && /^qst-bnk-[a-z0-9]{16}$/.test(item.itemId)) return item.itemId;
  return `${fileName}#${index + 1}`;
}

function requireLocales(value, code, reference) {
  assertRecord(value, code, reference);
  ["ko", "en"].forEach(function (locale) {
    assert(nonBlankText(value[locale]), code, reference);
  });
  Object.keys(value).forEach(function (locale) {
    assert(["ko", "en", "zh-Hans"].includes(locale) && nonBlankText(value[locale]), code, reference);
  });
}

function syntheticPublicItem(item, expectedSlot) {
  const suffix = item.itemId.slice("qst-bnk-".length);
  return {
    schemaVersion: contract.SCHEMA_VERSION,
    itemId: item.itemId,
    itemVersion: 1,
    publicRevisionId: `rev-bnk-${suffix}`,
    publicPayloadSha256: "0".repeat(64),
    visibilityClass: "authenticated-assessment",
    programId: "us-core-k8",
    targetGrade: 6,
    domainId: item.domainId,
    clusterId: item.clusterId,
    skillId: item.skillId,
    difficulty: item.difficulty,
    responseType: item.responseType,
    maxPoints: 1,
    assessmentBinding: {
      blueprintId: placement.plan.id,
      blueprintVersion: placement.plan.blueprintVersion,
      blueprintContractSha256: placement.plan.blueprintContractSha256,
      purpose: placement.plan.purpose,
      slotId: item.slotId,
      unitId: expectedSlot.unitId,
      standardRange: expectedSlot.standardRange
    },
    promptBlocks: item.publicDraft.promptBlocks,
    options: item.publicDraft.options,
    assets: item.publicDraft.assets,
    responseUi: item.publicDraft.responseUi,
    rightsRecordId: `rgt-bnk-${suffix}`
  };
}

function requireExactBilingualLocales(value, code, reference) {
  assertRecord(value, code, reference);
  assert(Object.keys(value).length === 2 && Object.keys(value).every(function (locale) {
    return ["ko", "en"].includes(locale) && nonBlankText(value[locale]);
  }), code, reference);
}

function validateStandardIds(item, expectedSlot, reference) {
  assertDenseArray(item.standardIds, "STANDARD_IDS_INVALID", reference);
  assert(item.standardIds.length > 0, "STANDARD_IDS_INVALID", reference);
  const rangeMatch = expectedSlot.standardRange.match(/^((?:K|[1-8])\.[A-Z]{1,4}\.[A-Z]\.)(\d+)(?:-(\d+))?$/);
  assert(!!rangeMatch, "PLAN_STANDARD_RANGE_INVALID", reference);
  const first = Number(rangeMatch[2]);
  const last = Number(rangeMatch[3] || rangeMatch[2]);
  item.standardIds.forEach(function (standardId) {
    assert(nonBlankText(standardId), "STANDARD_IDS_INVALID", reference);
    const standardMatch = standardId.match(/^((?:K|[1-8])\.[A-Z]{1,4}\.[A-Z]\.)(\d+)(?:[a-z])?$/);
    assert(!!standardMatch && standardMatch[1] === rangeMatch[1], "STANDARD_ID_LINEAGE_MISMATCH", reference);
    const standardNumber = Number(standardMatch[2]);
    assert(standardNumber >= first && standardNumber <= last, "STANDARD_ID_OUTSIDE_SLOT_RANGE", reference);
  });
  assert(new Set(item.standardIds).size === item.standardIds.length, "STANDARD_IDS_DUPLICATE", reference);
}

function validateAutomaticAnswer(item, publicItem, reference) {
  const answer = item.privateDraft.answer;
  assertRecord(answer, "AUTO_ANSWER_MISSING", reference);
  const suffix = item.itemId.slice("qst-bnk-".length);
  const privateSpec = {
    schemaVersion: contract.SCHEMA_VERSION,
    scoringSpecId: `scr-bnk-${suffix}`,
    specVersion: 1,
    itemId: item.itemId,
    itemVersion: 1,
    publicPayloadSha256: publicItem.publicPayloadSha256,
    privateSpecSha256: "1".repeat(64),
    scoringMode: "automatic",
    maxPoints: 1,
    answer: {
      kind: answer.kind,
      value: answer.value,
      acceptedAlternatives: [],
      tolerance: null,
      unitRule: null
    },
    normalizationVersion: answer.kind === "numeric-exact" ? "rational-v1" : "option-id-v1",
    solutionRef: `local-draft:${item.itemId}`,
    rubricId: null,
    rubricVersion: null,
    rubricSha256: null,
    errorSignals: item.privateDraft.errorSignals,
    defaultErrorType: item.privateDraft.defaultErrorType,
    state: "in-review"
  };
  try {
    contract.validatePrivateSpec(privateSpec, publicItem);
  } catch (error) {
    fail("AUTOMATIC_SCORING_CONTRACT", reference);
  }
  if (item.responseType === "multiple-choice") {
    const expectedWrongOptions = publicItem.options.map(function (option) { return option.optionId; }).filter(function (optionId) {
      return optionId !== answer.value;
    }).sort();
    const mappedWrongOptions = item.privateDraft.errorSignals.map(function (signal) { return signal.observedValue; }).sort();
    assert(expectedWrongOptions.length === mappedWrongOptions.length && expectedWrongOptions.every(function (optionId, index) {
      return optionId === mappedWrongOptions[index];
    }), "MC_ERROR_SIGNAL_COVERAGE_INVALID", reference);
  }
}

function validatePointIncrements(points, reference) {
  assertDenseArray(points, "TEACHER_RUBRIC_POINTS_INVALID", reference);
  assert(points.length >= 2, "TEACHER_RUBRIC_POINTS_INVALID", reference);
  points.forEach(function (point) {
    assert(typeof point === "number" && Number.isFinite(point) && point >= 0 && point <= 1, "TEACHER_RUBRIC_POINTS_INVALID", reference);
  });
  assert(new Set(points).size === points.length && points.includes(0) && points.includes(1), "TEACHER_RUBRIC_POINTS_INVALID", reference);
}

function validateDraftCriterion(criterion, reference) {
  assertRecord(criterion, "TEACHER_RUBRIC_CRITERION_INVALID", reference);
  assert(typeof criterion.criterionId === "string" && /^[a-z][a-z0-9-]{1,31}$/.test(criterion.criterionId), "TEACHER_RUBRIC_CRITERION_INVALID", reference);
  assert(criterion.maxPoints === 1, "TEACHER_RUBRIC_CRITERION_INVALID", reference);
  if (criterion.levels != null) {
    assertDenseArray(criterion.levels, "TEACHER_RUBRIC_CRITERION_INVALID", reference);
    assert(criterion.levels.length >= 2, "TEACHER_RUBRIC_CRITERION_INVALID", reference);
    const awarded = [];
    criterion.levels.forEach(function (level) {
      assertRecord(level, "TEACHER_RUBRIC_CRITERION_INVALID", reference);
      assert(typeof level.points === "number" && level.points >= 0 && level.points <= 1, "TEACHER_RUBRIC_CRITERION_INVALID", reference);
      requireLocales(level.observableEvidenceByLocale, "TEACHER_RUBRIC_CRITERION_INVALID", reference);
      awarded.push(level.points);
    });
    assert(new Set(awarded).size === awarded.length && awarded.includes(0) && awarded.includes(1), "TEACHER_RUBRIC_CRITERION_INVALID", reference);
  } else {
    requireLocales(criterion.pointOneByLocale, "TEACHER_RUBRIC_CRITERION_INVALID", reference);
    requireLocales(criterion.pointZeroByLocale, "TEACHER_RUBRIC_CRITERION_INVALID", reference);
  }
  if (criterion.requiredEvidence != null) {
    assertDenseArray(criterion.requiredEvidence, "TEACHER_RUBRIC_CRITERION_INVALID", reference);
    assert(criterion.requiredEvidence.length > 0 && criterion.requiredEvidence.every(nonBlankText), "TEACHER_RUBRIC_CRITERION_INVALID", reference);
  }
  if (criterion.errorCodes != null) {
    assertDenseArray(criterion.errorCodes, "TEACHER_RUBRIC_CRITERION_INVALID", reference);
    assert(criterion.errorCodes.length > 0 && criterion.errorCodes.every(function (code) { return delivery.SCORING_ERROR_TYPES.includes(code); }), "TEACHER_RUBRIC_CRITERION_INVALID", reference);
  }
}

function validateTeacherDraft(item, publicItem, reference) {
  assert(!Object.prototype.hasOwnProperty.call(item.privateDraft, "answer"), "TEACHER_ANSWER_FIELD_FORBIDDEN", reference);
  requireLocales(item.privateDraft.expectedResponseByLocale, "TEACHER_REFERENCE_MISSING", reference);
  const rubric = item.privateDraft.rubricDraft;
  assertRecord(rubric, "TEACHER_RUBRIC_MISSING", reference);
  assert(rubric.maxPoints === 1, "TEACHER_RUBRIC_NOT_MIGRATION_READY", reference);
  validatePointIncrements(rubric.allowedPointIncrements, reference);
  assert(rubric.humanReviewRequired === true && rubric.secondReviewPolicy === "boundary-and-high-stakes-required", "TEACHER_RUBRIC_NOT_MIGRATION_READY", reference);
  assertDenseArray(rubric.criteria, "TEACHER_RUBRIC_CRITERION_INVALID", reference);
  assert(rubric.criteria.length > 0, "TEACHER_RUBRIC_CRITERION_INVALID", reference);
  rubric.criteria.forEach(function (criterion) { validateDraftCriterion(criterion, reference); });
  const signalTypes = Array.from(new Set(item.privateDraft.errorSignals.map(function (signal) { return signal.errorType; }))).sort();
  const rubricTypes = Array.from(new Set(rubric.criteria.flatMap(function (criterion) { return criterion.errorCodes; }))).sort();
  assert(signalTypes.length === rubricTypes.length && signalTypes.every(function (type, index) { return type === rubricTypes[index]; }), "TEACHER_ERROR_TAXONOMY_MISMATCH", reference);
  const suffix = item.itemId.slice("qst-bnk-".length);
  try {
    contract.validatePrivateSpec({
      schemaVersion: contract.SCHEMA_VERSION,
      scoringSpecId: `scr-bnk-${suffix}`,
      specVersion: 1,
      itemId: item.itemId,
      itemVersion: 1,
      publicPayloadSha256: publicItem.publicPayloadSha256,
      privateSpecSha256: "1".repeat(64),
      scoringMode: "teacher",
      maxPoints: 1,
      answer: null,
      normalizationVersion: null,
      solutionRef: `local-draft:${item.itemId}`,
      rubricId: `rub-bnk-${suffix}`,
      rubricVersion: 1,
      rubricSha256: "2".repeat(64),
      errorSignals: item.privateDraft.errorSignals,
      defaultErrorType: item.privateDraft.defaultErrorType,
      state: "in-review"
    }, publicItem);
  } catch (error) {
    fail("TEACHER_SCORING_CONTRACT", reference);
  }
}

function validateRightsDraft(rightsDraft, reference) {
  assertRecord(rightsDraft, "RIGHTS_DRAFT_MISSING", reference);
  assert(rightsDraft.mode === "owned_original", "RIGHTS_MODE_NOT_OWNED_ORIGINAL", reference);
  assert(rightsDraft.originType === "gfield-authored", "RIGHTS_ORIGIN_NOT_GFIELD_AUTHORED", reference);
  assert(rightsDraft.authority === "GFIELD", "RIGHTS_AUTHORITY_INVALID", reference);
  assert(rightsDraft.translationAllowed === true && rightsDraft.derivativeAllowed === true, "RIGHTS_TRANSLATION_OR_DERIVATIVE_MISSING", reference);
  assert(LOCAL_PENDING_RIGHTS_DECISIONS.has(rightsDraft.decision), "RIGHTS_DRAFT_STATE_INVALID", reference);
  assert(rightsDraft.externalSourceUsed !== true && rightsDraft.contestWordingUsed !== true, "EXTERNAL_OR_CONTEST_WORDING_FORBIDDEN", reference);
  if (rightsDraft.allowedScopes != null) {
    assertDenseArray(rightsDraft.allowedScopes, "RIGHTS_SCOPES_INVALID", reference);
    ["authenticated", "print", "translation", "derivative"].forEach(function (scope) {
      assert(rightsDraft.allowedScopes.includes(scope), "RIGHTS_SCOPE_MISSING", reference);
    });
  }
}

function validateSvgBytes(bytes, reference) {
  const source = bytes.toString("utf8");
  assert(bytes.length === Buffer.byteLength(source, "utf8") && source.length > 0, "ASSET_SVG_ENCODING_INVALID", reference);
  assert(/^\s*(?:<\?xml[^>]*>\s*)?<svg\b/i.test(source) && /<\/svg>\s*$/i.test(source), "ASSET_SVG_ROOT_INVALID", reference);
  assert(!/(?:<!DOCTYPE|<!ENTITY|<script\b|<foreignObject\b|<iframe\b|<object\b|<embed\b|<image\b|<style\b)/i.test(source), "ASSET_SVG_ACTIVE_CONTENT_FORBIDDEN", reference);
  assert(!/\son[a-z]+\s*=/i.test(source), "ASSET_SVG_EVENT_HANDLER_FORBIDDEN", reference);
  assert(!/(?:href|xlink:href)\s*=\s*["'](?!#)/i.test(source), "ASSET_SVG_EXTERNAL_REFERENCE_FORBIDDEN", reference);
  assert(!/url\s*\(/i.test(source), "ASSET_SVG_EXTERNAL_REFERENCE_FORBIDDEN", reference);
}

function validateAssetBytes(bytes, mimeType, reference) {
  if (mimeType === "image/svg+xml") {
    validateSvgBytes(bytes, reference);
    return;
  }
  if (mimeType === "image/png") {
    assert(bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), "ASSET_MAGIC_BYTES_INVALID", reference);
    return;
  }
  if (mimeType === "image/webp") {
    assert(bytes.length >= 12 && bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP", "ASSET_MAGIC_BYTES_INVALID", reference);
    return;
  }
  fail("ASSET_MIME_TYPE_INVALID", reference);
}

function validateAssetDrafts(item, directory, reference) {
  const publicAssets = item.publicDraft.assets;
  assertDenseArray(publicAssets, "PUBLIC_ASSETS_INVALID", reference);
  const drafts = item.assetDrafts == null ? [] : item.assetDrafts;
  assertDenseArray(drafts, "ASSET_DRAFTS_INVALID", reference);
  assert(drafts.length === publicAssets.length, "ASSET_DRAFT_COUNT_MISMATCH", reference);
  const publicById = new Map(publicAssets.map(function (asset) { return [asset.assetId, asset]; }));
  assert(publicById.size === publicAssets.length, "ASSET_ID_DUPLICATE", reference);
  const usedSourcePaths = [];
  drafts.forEach(function (draft) {
    assertOnlyKeys(draft, ASSET_DRAFT_KEYS, "ASSET_DRAFT_FIELDS_INVALID", reference);
    const asset = publicById.get(draft.assetId);
    assert(!!asset, "ASSET_DRAFT_ID_MISMATCH", reference);
    assert(nonBlankText(draft.sourcePath) && /^assets\/ast-bnk-[a-z0-9]{16}\.(?:svg|png|webp)$/.test(draft.sourcePath), "ASSET_SOURCE_PATH_INVALID", reference);
    const expectedExtension = { "image/svg+xml": ".svg", "image/png": ".png", "image/webp": ".webp" }[asset.mimeType];
    assert(expectedExtension && draft.sourcePath === `assets/${asset.assetId}${expectedExtension}`, "ASSET_SOURCE_NAME_MISMATCH", reference);
    const fullPath = path.resolve(directory, ...draft.sourcePath.split("/"));
    const relative = path.relative(directory, fullPath);
    assert(relative && !relative.startsWith("..") && !path.isAbsolute(relative), "ASSET_SOURCE_PATH_INVALID", reference);
    let stat;
    let bytes;
    try {
      stat = fs.lstatSync(fullPath);
      bytes = fs.readFileSync(fullPath);
    } catch (error) {
      fail("ASSET_SOURCE_NOT_READABLE", reference);
    }
    assert(stat.isFile() && !stat.isSymbolicLink() && bytes.length > 0 && bytes.length <= 512 * 1024, "ASSET_SOURCE_FILE_INVALID", reference);
    validateAssetBytes(bytes, asset.mimeType, reference);
    assert(crypto.createHash("sha256").update(bytes).digest("hex") === asset.sha256, "ASSET_HASH_MISMATCH", reference);
    validateRightsDraft(draft.rightsDraft, reference);
    usedSourcePaths.push(draft.sourcePath);
  });
  assert(new Set(usedSourcePaths).size === usedSourcePaths.length, "ASSET_SOURCE_DUPLICATE", reference);
  return usedSourcePaths;
}

function validateErrorSignal(signal, reference) {
  assertOnlyKeys(signal, ERROR_SIGNAL_KEYS, "ERROR_SIGNAL_INVALID", reference);
  assert(typeof signal.code === "string" && /^[a-z][a-z0-9-]{1,63}$/.test(signal.code), "ERROR_SIGNAL_INVALID", reference);
  assert(nonBlankText(signal.observedValue), "ERROR_SIGNAL_INVALID", reference);
  assert(delivery.SCORING_ERROR_TYPES.includes(signal.errorType), "ERROR_SIGNAL_TYPE_INVALID", reference);
  requireExactBilingualLocales(signal.rationaleByLocale, "ERROR_SIGNAL_INVALID", reference);
}

function validateEvidenceDraft(item, reference) {
  const privateDraft = item.privateDraft;
  ["solutionByLocale", "uniquenessProofByLocale", "difficultyRationaleByLocale"].forEach(function (field) {
    requireLocales(privateDraft[field], "PRIVATE_EVIDENCE_MISSING", reference);
  });
  assertDenseArray(privateDraft.errorSignals, "ERROR_SIGNALS_MISSING", reference);
  assert(privateDraft.errorSignals.length > 0, "ERROR_SIGNALS_INVALID", reference);
  assert(Object.prototype.hasOwnProperty.call(privateDraft, "defaultErrorType"), "DEFAULT_ERROR_TYPE_MISSING", reference);
  assert(delivery.SCORING_ERROR_TYPES.includes(privateDraft.defaultErrorType), "DEFAULT_ERROR_TYPE_INVALID", reference);
  assert(privateDraft.errorSignals.some(function (signal) {
    return signal.errorType === privateDraft.defaultErrorType;
  }), "DEFAULT_ERROR_TYPE_NOT_REVIEWED", reference);
  privateDraft.errorSignals.forEach(function (signal) { validateErrorSignal(signal, reference); });
  assert(new Set(privateDraft.errorSignals.map(function (signal) { return signal.code; })).size === privateDraft.errorSignals.length, "ERROR_SIGNAL_CODE_DUPLICATE", reference);
  assert(new Set(privateDraft.errorSignals.map(function (signal) { return signal.observedValue; })).size === privateDraft.errorSignals.length, "ERROR_SIGNAL_OBSERVED_VALUE_DUPLICATE", reference);
  validateVerification(item, reference);
}

function validateVerification(item, reference) {
  const verification = item.verification;
  assertOnlyKeys(verification, VERIFICATION_KEYS, "AUTHOR_VERIFICATION_FIELDS_INVALID", reference);
  assert(verification.state === "author-verified-pending-independent-review" && verification.reviewPending === true, "AUTHOR_VERIFICATION_STATE_INVALID", reference);
  assertDenseArray(verification.methods, "AUTHOR_VERIFICATION_METHODS_INVALID", reference);
  assert(verification.methods.length >= 2 && verification.methods.length <= 4, "AUTHOR_VERIFICATION_METHODS_INVALID", reference);
  verification.methods.forEach(function (method) {
    assertOnlyKeys(method, VERIFICATION_METHOD_KEYS, "AUTHOR_VERIFICATION_METHOD_INVALID", reference);
    assert(typeof method.methodId === "string" && /^[a-z][a-z0-9-]{2,63}$/.test(method.methodId), "AUTHOR_VERIFICATION_METHOD_INVALID", reference);
    requireLocales(method.evidenceByLocale, "AUTHOR_VERIFICATION_METHOD_INVALID", reference);
  });
  assert(new Set(verification.methods.map(function (method) { return method.methodId; })).size === verification.methods.length, "AUTHOR_VERIFICATION_METHODS_NOT_INDEPENDENT", reference);
  if (item.responseType === "multiple-choice") {
    assertRecord(verification.candidateCheck, "CANDIDATE_CHECK_REQUIRED", reference);
  }
  if (verification.candidateCheck != null) {
    assertOnlyKeys(verification.candidateCheck, CANDIDATE_CHECK_KEYS, "CANDIDATE_CHECK_INVALID", reference);
    assert(verification.candidateCheck.kind === "finite-enumeration", "CANDIDATE_CHECK_INVALID", reference);
    assert(Number.isInteger(verification.candidateCheck.totalCandidates) && verification.candidateCheck.totalCandidates > 0, "CANDIDATE_CHECK_INVALID", reference);
    assert(verification.candidateCheck.validAnswerCount === 1, "CANDIDATE_CHECK_NOT_UNIQUE", reference);
    if (item.responseType === "multiple-choice") {
      assert(verification.candidateCheck.totalCandidates === item.publicDraft.options.length, "CANDIDATE_CHECK_OPTION_COUNT_MISMATCH", reference);
    }
  }
}

function validateItem(item, expectedSlot, fileName, index, directory, usedAssetFiles) {
  const reference = localId(item, fileName, index);
  assertOnlyKeys(item, PRIVATE_ITEM_KEYS, "DRAFT_ITEM_FIELDS_INVALID", reference);
  assert(item.slotId === expectedSlot.slotId, "SLOT_ID_INVALID", reference);
  assert(typeof item.itemId === "string" && /^qst-bnk-[a-z0-9]{16}$/.test(item.itemId), "ITEM_ID_INVALID", reference);
  ["clusterId", "domainId", "skillId", "difficulty", "responseType"].forEach(function (field) {
    assert(item[field] === expectedSlot[field], "PLAN_LINEAGE_MISMATCH", reference);
  });
  validateStandardIds(item, expectedSlot, reference);
  assertOnlyKeys(item.publicDraft, PUBLIC_DRAFT_KEYS, "PUBLIC_DRAFT_FIELDS_INVALID", reference);
  assertDenseArray(item.publicDraft.promptBlocks, "PUBLIC_PROMPT_BLOCKS_INVALID", reference);
  assert(item.publicDraft.promptBlocks.length > 0, "PUBLIC_PROMPT_BLOCKS_INVALID", reference);
  assertDenseArray(item.publicDraft.options, "PUBLIC_OPTIONS_INVALID", reference);
  assertDenseArray(item.publicDraft.assets, "PUBLIC_ASSETS_INVALID", reference);
  assertRecord(item.publicDraft.responseUi, "PUBLIC_RESPONSE_UI_INVALID", reference);
  let publicItem;
  try {
    publicItem = syntheticPublicItem(item, expectedSlot);
    contract.validatePublicItem(publicItem);
  } catch (error) {
    fail("PUBLIC_DELIVERY_CONTRACT", reference);
  }
  validateAssetDrafts(item, directory, reference).forEach(function (sourcePath) { usedAssetFiles.add(sourcePath); });

  assertRecord(item.privateDraft, "PRIVATE_DRAFT_MISSING", reference);
  validateEvidenceDraft(item, reference);
  if (expectedSlot.scoringMode === "automatic") validateAutomaticAnswer(item, publicItem, reference);
  else validateTeacherDraft(item, publicItem, reference);
  validateRightsDraft(item.rightsDraft, reference);
}

function sourceFiles(directory) {
  assert(fs.existsSync(directory), "PRIVATE_AUTHORING_DIRECTORY_MISSING", "private-authoring");
  const files = [];
  fs.readdirSync(directory, { withFileTypes: true }).forEach(function (entry) {
    if (entry.isDirectory() && !entry.isSymbolicLink() && ["assets", "preview"].includes(entry.name)) return;
    assert(entry.isFile() && !entry.isSymbolicLink(), "UNEXPECTED_PRIVATE_AUTHORING_PATH", entry.name);
    assert(/^grade6-[a-z-]+-drafts\.cjs$/.test(entry.name), "UNEXPECTED_PRIVATE_AUTHORING_PATH", entry.name);
    files.push(entry.name);
  });
  return files.sort();
}

function previewFiles(directory) {
  const previewDirectory = path.join(directory, "preview");
  if (!fs.existsSync(previewDirectory)) return [];
  const directoryStat = fs.lstatSync(previewDirectory);
  assert(directoryStat.isDirectory() && !directoryStat.isSymbolicLink(), "PRIVATE_PREVIEW_DIRECTORY_INVALID", "preview");
  return fs.readdirSync(previewDirectory, { withFileTypes: true }).map(function (entry) {
    assert(entry.isFile() && !entry.isSymbolicLink() && entry.name === "student.html", "UNEXPECTED_PRIVATE_PREVIEW_PATH", entry.name);
    return `preview/${entry.name}`;
  });
}

function assetFiles(directory) {
  const assetDirectory = path.join(directory, "assets");
  if (!fs.existsSync(assetDirectory)) return [];
  const directoryStat = fs.lstatSync(assetDirectory);
  assert(directoryStat.isDirectory() && !directoryStat.isSymbolicLink(), "PRIVATE_ASSET_DIRECTORY_INVALID", "assets");
  return fs.readdirSync(assetDirectory, { withFileTypes: true }).map(function (entry) {
    assert(entry.isFile() && !entry.isSymbolicLink() && /^ast-bnk-[a-z0-9]{16}\.(?:svg|png|webp)$/.test(entry.name), "UNEXPECTED_PRIVATE_ASSET_PATH", entry.name);
    return `assets/${entry.name}`;
  }).sort();
}

function assertGitIgnored(directory, files) {
  const root = path.resolve(__dirname, "..");
  const gitRootResult = spawnSync("git", ["rev-parse", "--show-toplevel"], { cwd: root, encoding: "utf8" });
  assert(gitRootResult.status === 0 && nonBlankText(gitRootResult.stdout.trim()), "GIT_IGNORE_CHECK_UNAVAILABLE", "private-authoring");
  const gitRoot = gitRootResult.stdout.trim();
  files.forEach(function (fileName) {
    const fullPath = path.join(directory, fileName);
    const relativePath = path.relative(root, fullPath).split(path.sep).join("/");
    const result = spawnSync("git", ["check-ignore", "-v", "--", relativePath], { cwd: root, encoding: "utf8" });
    assert(result.status === 0, "PRIVATE_DRAFT_NOT_GIT_IGNORED", fileName);
    const match = String(result.stdout || "").trim().match(/^(.+):(\d+):([^\t]+)\t/);
    assert(!!match, "PRIVATE_DRAFT_IGNORE_RULE_UNVERIFIABLE", fileName);
    const sourcePath = path.isAbsolute(match[1]) ? match[1] : path.resolve(gitRoot, match[1]);
    assert(path.resolve(sourcePath) === path.resolve(root, ".gitignore") && match[3] === "private-authoring/", "PRIVATE_DRAFT_IGNORE_NOT_REPOSITORY_RULE", fileName);
  });
}

function loadPack(fullPath, fileName) {
  let source;
  try {
    source = fs.readFileSync(fullPath, "utf8");
  } catch (error) {
    fail("DRAFT_FILE_NOT_READABLE", fileName);
  }
  assert(source.length > 0 && source.length <= 1024 * 1024, "DRAFT_FILE_SIZE_INVALID", fileName);
  const sandbox = Object.create(null);
  const moduleRecord = Object.create(null);
  moduleRecord.exports = null;
  sandbox.module = moduleRecord;
  sandbox.exports = moduleRecord.exports;
  let pack;
  try {
    vm.runInNewContext(source, sandbox, {
      filename: fileName,
      timeout: 250,
      codeGeneration: { strings: false, wasm: false }
    });
    pack = JSON.parse(JSON.stringify(moduleRecord.exports));
  } catch (error) {
    fail("DRAFT_FILE_NOT_LOADABLE", fileName);
  }
  assertRecord(pack, "DRAFT_PACK_INVALID", fileName);
  assert(pack.schemaVersion === DRAFT_SCHEMA_VERSION, "DRAFT_SCHEMA_INVALID", fileName);
  assert(pack.programId === placement.plan.programId && pack.targetGrade === placement.plan.targetGrade && pack.purpose === placement.plan.purpose, "DRAFT_PACK_SCOPE_INVALID", fileName);
  assert(pack.state === DRAFT_STATE, "DRAFT_PACK_STATE_INVALID", fileName);
  assertDenseArray(pack.items, "DRAFT_ITEMS_INVALID", fileName);
  return pack;
}

function validateDirectory(directory) {
  const resolvedDirectory = path.resolve(directory);
  const files = sourceFiles(resolvedDirectory);
  const assets = assetFiles(resolvedDirectory);
  const previews = previewFiles(resolvedDirectory);
  assert(files.length > 0, "PRIVATE_AUTHORING_PACKS_MISSING", "private-authoring");
  assertGitIgnored(resolvedDirectory, files.concat(assets, previews));
  const expectedBySlot = new Map(placement.plan.slots.map(function (slot) { return [slot.slotId, slot]; }));
  const seenSlots = new Set();
  const seenIds = new Set();
  const usedAssetFiles = new Set();
  let itemCount = 0;
  files.forEach(function (fileName) {
    const pack = loadPack(path.join(resolvedDirectory, fileName), fileName);
    pack.items.forEach(function (item, index) {
      const reference = localId(item, fileName, index);
      assert(!seenSlots.has(item && item.slotId), "DUPLICATE_SLOT", reference);
      assert(!seenIds.has(item && item.itemId), "DUPLICATE_ITEM_ID", reference);
      const expectedSlot = expectedBySlot.get(item && item.slotId);
      assert(expectedSlot, "UNKNOWN_SLOT", reference);
      validateItem(item, expectedSlot, fileName, index, resolvedDirectory, usedAssetFiles);
      seenSlots.add(item.slotId);
      seenIds.add(item.itemId);
      itemCount += 1;
    });
  });
  assert(itemCount === placement.plan.plannedItemCount, "PLANNED_ITEM_COUNT_MISMATCH", "private-authoring");
  assert(seenSlots.size === expectedBySlot.size, "GRADE6_SLOTS_INCOMPLETE", "private-authoring");
  assert(assets.length === usedAssetFiles.size && assets.every(function (assetPath) { return usedAssetFiles.has(assetPath); }), "PRIVATE_ASSET_ORPHAN_OR_MISSING", "private-authoring");
  return Object.freeze({ fileCount: files.length, itemCount, state: DRAFT_STATE });
}

function loadStudentPreviewItems(directory) {
  const resolvedDirectory = path.resolve(directory);
  validateDirectory(resolvedDirectory);
  const bySlot = new Map();
  sourceFiles(resolvedDirectory).forEach(function (fileName) {
    const pack = loadPack(path.join(resolvedDirectory, fileName), fileName);
    pack.items.forEach(function (item) {
      const assetSourceById = new Map((item.assetDrafts || []).map(function (draft) { return [draft.assetId, draft.sourcePath]; }));
      bySlot.set(item.slotId, {
        slotId: item.slotId,
        itemId: item.itemId,
        domainId: item.domainId,
        clusterId: item.clusterId,
        standardIds: item.standardIds.slice(),
        difficulty: item.difficulty,
        responseType: item.responseType,
        promptBlocks: item.publicDraft.promptBlocks.map(function (block) { return Object.assign({}, block); }),
        options: item.publicDraft.options.map(function (option) { return Object.assign({}, option); }),
        assets: item.publicDraft.assets.map(function (asset) {
          return Object.assign({}, asset, { previewSourcePath: assetSourceById.get(asset.assetId) });
        }),
        responseUi: Object.assign({}, item.publicDraft.responseUi)
      });
    });
  });
  return placement.plan.slots.map(function (slot) {
    const item = bySlot.get(slot.slotId);
    assert(!!item, "PRIVATE_PREVIEW_SLOT_MISSING", slot.slotId);
    return JSON.parse(JSON.stringify(item));
  });
}

function main() {
  const directory = process.argv[2] || path.resolve(__dirname, "..", "private-authoring");
  try {
    const result = validateDirectory(directory);
    process.stdout.write(`PRIVATE_GRADE6_DRAFT_PREFLIGHT_OK files=${result.fileCount} items=${result.itemCount} state=${result.state}\n`);
  } catch (error) {
    if (error instanceof ValidationError) {
      process.stderr.write(`PRIVATE_GRADE6_DRAFT_PREFLIGHT_FAILED code=${error.code} ref=${error.reference}\n`);
      process.exitCode = 1;
      return;
    }
    process.stderr.write("PRIVATE_GRADE6_DRAFT_PREFLIGHT_FAILED code=UNEXPECTED_VALIDATOR_ERROR ref=validator\n");
    process.exitCode = 1;
  }
}

if (require.main === module) main();

module.exports = Object.freeze({
  DRAFT_SCHEMA_VERSION,
  DRAFT_STATE,
  syntheticPublicItem,
  validateStandardIds,
  validateAssetDrafts,
  validateErrorSignal,
  validateEvidenceDraft,
  validateVerification,
  loadStudentPreviewItems,
  validateDirectory
});
