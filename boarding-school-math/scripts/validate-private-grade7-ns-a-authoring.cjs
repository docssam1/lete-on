#!/usr/bin/env node
"use strict";

// Local structural preflight only. Never approves mathematics, independent
// reviews, authenticated delivery, or release; never prints private content.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { plan } = require("../assessment/grade7-ns-a-screener-plan.js");
const { manifest } = require("../assessment/grade7-ns-a-screener-authoring-manifest.js");
const contract = require("../question-bank/item-release-contract.js");

const SCHEMA_VERSION = "gfield-private-grade7-nsa-draft-v1";
const CONFIDENTIALITY_MARKER = "GFIELD_PRIVATE_ASSESSMENT_DO_NOT_COMMIT";
const DRAFT_STATE = "draft-pending-independent-review";
const PACK_FILE = "grade7-ns-a-screener-draft.json";
const REPOSITORY_ROOT = path.resolve(__dirname, "../..");
const LOCALES = ["ko", "en", "zh-Hans"];
const MAX_BYTES = 1024 * 1024;
const ITEM_ID = /^qst-bnk-[a-z0-9]{16}$/;
const ASSET_ID = /^ast-bnk-[a-z0-9]{16}$/;
const ITEM_FIELDS = ["slotId", "itemId", "itemVersion", "unitId", "clusterId", "domainId", "skillId", "standardIds", "standardFocus", "difficulty", "responseType", "scoringMode", "maxPoints", "publicDraft", "privateDraft", "verification", "rightsDraft", "sourceFidelityEvidence", "learnerFitEvidence", "itemIndependenceEvidence", "numberLineModel", "assetDrafts"];

class ValidationError extends Error {
  constructor(code, reference = "pack") {
    super(code);
    this.code = code;
    this.reference = ITEM_ID.test(reference) ? reference : "pack";
  }
}
function assert(condition, code, reference) { if (!condition) throw new ValidationError(code, reference); }
function record(value) { return !!value && typeof value === "object" && !Array.isArray(value) && [Object.prototype, null].includes(Object.getPrototypeOf(value)); }
function text(value) { return typeof value === "string" && value.length > 0 && value === value.trim() && value.length <= 32768; }
function keys(value, allowed, code, ref, required = allowed) {
  assert(record(value) && Object.keys(value).every(key => allowed.includes(key)) && required.every(key => Object.hasOwn(value, key)), code, ref);
}
function array(value, code, ref, minimum = 0, maximum = 1000) {
  assert(Array.isArray(value) && value.length >= minimum && value.length <= maximum && Object.keys(value).length === value.length, code, ref);
}
function locales(value, code, ref, expected = LOCALES) {
  keys(value, expected, code, ref);
  expected.forEach(locale => assert(text(value[locale]), code, ref));
}
function unique(values, code, ref) { assert(new Set(values).size === values.length, code, ref); }
function guardShared(fn, code, ref) { try { fn(); } catch (_) { throw new ValidationError(code, ref); } }
function byLocale() { return { ko: "", en: "", "zh-Hans": "" }; }
function rightsSkeleton() {
  return { mode: "owned_original", originType: "gfield-authored", authority: "GFIELD", translationAllowed: true, derivativeAllowed: true, externalSourceUsed: false, contestWordingUsed: false, decision: "pending-independent-review" };
}

function createDraftSkeleton(author) {
  return {
    schemaVersion: SCHEMA_VERSION, confidentialityMarker: CONFIDENTIALITY_MARKER,
    packId: "pack-bdg-grade7-nsa-draft-v1", revision: 1,
    programId: plan.programId, targetGrade: plan.targetGrade, purpose: plan.purpose,
    planId: plan.id, planContractSha256: plan.planContractSha256,
    state: DRAFT_STATE, deliveryState: "locked",
    author: author || { actorId: "", provider: "", model: "", environment: "" },
    items: plan.slots.map((slot, index) => {
      const entry = manifest.entries[index];
      const privateDraft = {
        solutionByLocale: byLocale(), uniquenessProofByLocale: byLocale(), difficultyRationaleByLocale: byLocale(),
        errorSignals: [], defaultErrorType: ""
      };
      if (slot.scoringMode === "automatic") privateDraft.answer = { kind: slot.responseType === "numeric" ? "numeric-exact" : "option-id", value: "" };
      else {
        privateDraft.expectedResponseByLocale = byLocale();
        privateDraft.rubricDraft = { maxPoints: 1, allowedPointIncrements: [0, 1], criteria: [], humanReviewRequired: true, secondReviewPolicy: "boundary-and-high-stakes-required" };
      }
      return {
        slotId: slot.slotId, itemId: "", itemVersion: 1,
        unitId: slot.unitId, clusterId: slot.clusterId, domainId: slot.domainId, skillId: slot.skillId,
        standardIds: [slot.standardFocus], standardFocus: slot.standardFocus,
        difficulty: slot.difficulty, responseType: slot.responseType, scoringMode: slot.scoringMode, maxPoints: slot.maxPoints,
        publicDraft: { promptBlocks: [{ type: "text", valueByLocale: byLocale() }], options: [], assets: [], responseUi: { inputKind: { "multiple-choice": "choice", numeric: "number", "short-answer": "text", "constructed-response": "workpad" }[slot.responseType] } },
        privateDraft,
        verification: { state: "author-verified-pending-independent-review", reviewPending: true, methods: entry.proofMethods.map(methodId => ({ methodId, evidenceByLocale: byLocale() })), candidateCheck: slot.responseType === "multiple-choice" ? { kind: "finite-enumeration", totalCandidates: 0, validAnswerCount: 1 } : null },
        rightsDraft: rightsSkeleton(),
        sourceFidelityEvidence: { standardFocus: slot.standardFocus, sourceLocator: slot.sourceLocator, mathematicalAction: slot.mathematicalAction, evidenceTarget: slot.evidenceTarget, evidenceByLocale: byLocale() },
        learnerFitEvidence: { learnerStage: plan.learnerStage, reviewPending: true, criteria: plan.learnerFitGate.criteria.map(criterionId => ({ criterionId, evidenceByLocale: byLocale() })) },
        itemIndependenceEvidence: { origin: entry.contentOriginRequirement, workbookItemsReused: false, reviewPending: true, evidenceByLocale: byLocale() },
        numberLineModel: null, assetDrafts: []
      };
    })
  };
}

function validateRights(value, ref) {
  const expected = rightsSkeleton();
  keys(value, Object.keys(expected), "RIGHTS_DRAFT_INVALID", ref);
  Object.entries(expected).forEach(([key, expectedValue]) => assert(value[key] === expectedValue, "RIGHTS_DRAFT_INVALID", ref));
}

function syntheticEnvelopes(item) {
  // These placeholder hashes and version are confined to shape validation.
  // No signed form, release bundle, or approved item is created or returned.
  const suffix = item.itemId.slice(8);
  const publicItem = {
    schemaVersion: contract.SCHEMA_VERSION, itemId: item.itemId, itemVersion: item.itemVersion,
    publicRevisionId: `rev-bnk-${suffix}`, publicPayloadSha256: "0".repeat(64), visibilityClass: "authenticated-assessment",
    programId: plan.programId, targetGrade: 7, domainId: item.domainId, clusterId: item.clusterId,
    skillId: item.skillId, difficulty: item.difficulty, responseType: item.responseType, maxPoints: 1,
    assessmentBinding: { blueprintId: plan.id, blueprintVersion: 1, blueprintContractSha256: plan.planContractSha256, purpose: plan.purpose, slotId: item.slotId, unitId: item.unitId, standardRange: "7.NS.A.1-3" },
    ...item.publicDraft, rightsRecordId: `rgt-bnk-${suffix}`
  };
  const teacher = item.scoringMode === "teacher";
  const answer = item.privateDraft.answer;
  const privateSpec = {
    schemaVersion: contract.SCHEMA_VERSION, scoringSpecId: `scr-bnk-${suffix}`, specVersion: 1,
    itemId: item.itemId, itemVersion: item.itemVersion, publicPayloadSha256: publicItem.publicPayloadSha256,
    privateSpecSha256: "1".repeat(64), scoringMode: item.scoringMode, maxPoints: 1,
    answer: teacher ? null : { ...answer, acceptedAlternatives: [], tolerance: null, unitRule: null },
    normalizationVersion: teacher ? null : answer.kind === "numeric-exact" ? "rational-v1" : "option-id-v1",
    solutionRef: `local-draft:${item.itemId}`, rubricId: teacher ? `rub-bnk-${suffix}` : null,
    rubricVersion: teacher ? 1 : null, rubricSha256: teacher ? "2".repeat(64) : null,
    errorSignals: item.privateDraft.errorSignals, defaultErrorType: item.privateDraft.defaultErrorType, state: "in-review"
  };
  const rubric = teacher ? {
    schemaVersion: contract.SCHEMA_VERSION, rubricId: privateSpec.rubricId, rubricVersion: 1, rubricSha256: privateSpec.rubricSha256,
    itemId: item.itemId, itemVersion: item.itemVersion, publicPayloadSha256: publicItem.publicPayloadSha256,
    privateSpecSha256: privateSpec.privateSpecSha256, ...item.privateDraft.rubricDraft, state: "in-review"
  } : null;
  return { publicItem, privateSpec, rubric };
}

function validatePrivateDraft(item) {
  const ref = item.itemId;
  const common = ["solutionByLocale", "uniquenessProofByLocale", "difficultyRationaleByLocale", "errorSignals", "defaultErrorType"];
  keys(item.privateDraft, common.concat(item.scoringMode === "teacher" ? ["expectedResponseByLocale", "rubricDraft"] : ["answer"]), "PRIVATE_DRAFT_INVALID", ref);
  common.slice(0, 3).forEach(field => locales(item.privateDraft[field], "PRIVATE_LOCALES_INVALID", ref));
  if (item.scoringMode === "teacher") {
    locales(item.privateDraft.expectedResponseByLocale, "PRIVATE_LOCALES_INVALID", ref);
    const rubric = item.privateDraft.rubricDraft;
    keys(rubric, ["maxPoints", "allowedPointIncrements", "criteria", "humanReviewRequired", "secondReviewPolicy"], "TEACHER_RUBRIC_INVALID", ref);
    assert(rubric.maxPoints === 1 && rubric.humanReviewRequired === true && rubric.secondReviewPolicy === "boundary-and-high-stakes-required", "TEACHER_RUBRIC_INVALID", ref);
    array(rubric.criteria, "TEACHER_RUBRIC_INVALID", ref, 1);
    rubric.criteria.forEach(criterion => {
      array(criterion.levels, "TEACHER_RUBRIC_INVALID", ref, 2);
      criterion.levels.forEach(level => locales(level.observableEvidenceByLocale, "RUBRIC_LOCALES_INVALID", ref));
    });
    const rubricErrors = [...new Set(rubric.criteria.flatMap(criterion => criterion.errorCodes))].sort();
    array(item.privateDraft.errorSignals, "ERROR_SIGNALS_INVALID", ref, 1);
    const signalErrors = [...new Set(item.privateDraft.errorSignals.map(signal => signal.errorType))].sort();
    assert(JSON.stringify(rubricErrors) === JSON.stringify(signalErrors), "TEACHER_ERROR_TAXONOMY_MISMATCH", ref);
  } else keys(item.privateDraft.answer, ["kind", "value"], "AUTOMATIC_ANSWER_INVALID", ref);
  const envelopes = syntheticEnvelopes(item);
  guardShared(() => contract.validatePublicItem(envelopes.publicItem), "PUBLIC_DELIVERY_CONTRACT_INVALID", ref);
  guardShared(() => contract.validatePrivateSpec(envelopes.privateSpec, envelopes.publicItem), "PRIVATE_SCORING_CONTRACT_INVALID", ref);
  guardShared(() => contract.validateRubric(envelopes.rubric, envelopes.publicItem, envelopes.privateSpec), "TEACHER_RUBRIC_INVALID", ref);
}

function rational(value, ref) {
  assert(typeof value === "string" && value.length <= 80 && /^(?:-?(?:0|[1-9]\d*)(?:\.\d+)?|-?[1-9]\d*\/[1-9]\d*)$/.test(value), "NUMBER_LINE_RATIONAL_INVALID", ref);
  if (value.includes("/")) return value.split("/").map(BigInt);
  const [whole, decimals = ""] = value.split(".");
  return [BigInt(whole + decimals), 10n ** BigInt(decimals.length)];
}
function compare(a, b) { const difference = a[0] * b[1] - b[0] * a[1]; return difference < 0n ? -1 : difference > 0n ? 1 : 0; }
function add(a, b) { return [a[0] * b[1] + b[0] * a[1], a[1] * b[1]]; }
function validateNumberLine(item, slot) {
  const ref = item.itemId;
  const required = slot.visualRequirement === "calculated-number-line-required";
  if (item.numberLineModel === null) { assert(!required, "NUMBER_LINE_REQUIRED", ref); return; }
  const model = item.numberLineModel;
  keys(model, ["minimum", "maximum", "tickStep", "points", "movements", "studentTargetMarkerPresent"], "NUMBER_LINE_MODEL_INVALID", ref);
  assert(item.publicDraft.promptBlocks.some(block => block.type === "diagram"), "NUMBER_LINE_DIAGRAM_REQUIRED", ref);
  assert(model.studentTargetMarkerPresent === false, "NUMBER_LINE_TARGET_MARKER_FORBIDDEN", ref);
  const minimum = rational(model.minimum, ref), maximum = rational(model.maximum, ref), step = rational(model.tickStep, ref);
  assert(compare(minimum, maximum) < 0 && step[0] > 0n, "NUMBER_LINE_RANGE_INVALID", ref);
  const span = add(maximum, [-minimum[0], minimum[1]]);
  const tickNumerator = span[0] * step[1], tickDenominator = span[1] * step[0];
  assert(tickNumerator % tickDenominator === 0n && tickNumerator / tickDenominator <= 100n, "NUMBER_LINE_TICKS_INVALID", ref);
  array(model.points, "NUMBER_LINE_POINTS_INVALID", ref, 0, 100);
  array(model.movements, "NUMBER_LINE_MOVEMENTS_INVALID", ref, 0, 20);
  assert(model.points.length + model.movements.length > 0, "NUMBER_LINE_GIVENS_REQUIRED", ref);
  function inRange(value) { assert(compare(minimum, value) <= 0 && compare(value, maximum) <= 0, "NUMBER_LINE_GIVEN_OUTSIDE_RANGE", ref); }
  model.points.forEach(point => { keys(point, ["label", "value"], "NUMBER_LINE_POINTS_INVALID", ref); assert(text(point.label), "NUMBER_LINE_POINTS_INVALID", ref); inRange(rational(point.value, ref)); });
  unique(model.points.map(point => point.label), "NUMBER_LINE_POINTS_INVALID", ref);
  model.movements.forEach(movement => { keys(movement, ["start", "displacement"], "NUMBER_LINE_MOVEMENTS_INVALID", ref); const start = rational(movement.start, ref); inRange(start); inRange(add(start, rational(movement.displacement, ref))); });
}

function validateEvidence(item, slot, entry) {
  const ref = item.itemId;
  const source = item.sourceFidelityEvidence;
  keys(source, ["standardFocus", "sourceLocator", "mathematicalAction", "evidenceTarget", "evidenceByLocale"], "SOURCE_FIDELITY_INVALID", ref);
  ["standardFocus", "sourceLocator", "mathematicalAction", "evidenceTarget"].forEach(field => assert(source[field] === slot[field], "SOURCE_FIDELITY_INVALID", ref));
  locales(source.evidenceByLocale, "SOURCE_FIDELITY_INVALID", ref);
  const fit = item.learnerFitEvidence;
  keys(fit, ["learnerStage", "reviewPending", "criteria"], "LEARNER_FIT_INVALID", ref);
  assert(fit.learnerStage === plan.learnerStage && fit.reviewPending === true, "LEARNER_FIT_INVALID", ref);
  array(fit.criteria, "LEARNER_FIT_INVALID", ref, 5, 5);
  fit.criteria.forEach(criterion => { keys(criterion, ["criterionId", "evidenceByLocale"], "LEARNER_FIT_INVALID", ref); locales(criterion.evidenceByLocale, "LEARNER_FIT_INVALID", ref); });
  assert(JSON.stringify(fit.criteria.map(criterion => criterion.criterionId).sort()) === JSON.stringify(plan.learnerFitGate.criteria.slice().sort()), "LEARNER_FIT_INVALID", ref);
  const independence = item.itemIndependenceEvidence;
  keys(independence, ["origin", "workbookItemsReused", "reviewPending", "evidenceByLocale"], "ITEM_INDEPENDENCE_INVALID", ref);
  assert(independence.origin === entry.contentOriginRequirement && independence.workbookItemsReused === false && independence.reviewPending === true, "ITEM_INDEPENDENCE_INVALID", ref);
  locales(independence.evidenceByLocale, "ITEM_INDEPENDENCE_INVALID", ref);
  const verification = item.verification;
  keys(verification, ["state", "reviewPending", "methods", "candidateCheck"], "AUTHOR_VERIFICATION_INVALID", ref);
  assert(verification.state === "author-verified-pending-independent-review" && verification.reviewPending === true, "AUTHOR_VERIFICATION_INVALID", ref);
  array(verification.methods, "AUTHOR_VERIFICATION_INVALID", ref, 2, 20);
  verification.methods.forEach(method => { keys(method, ["methodId", "evidenceByLocale"], "AUTHOR_VERIFICATION_INVALID", ref); assert(text(method.methodId) && /^[a-z][a-z0-9-]{2,79}$/.test(method.methodId), "AUTHOR_VERIFICATION_INVALID", ref); locales(method.evidenceByLocale, "AUTHOR_VERIFICATION_INVALID", ref); });
  unique(verification.methods.map(method => method.methodId), "AUTHOR_VERIFICATION_INVALID", ref);
  assert(entry.proofMethods.every(methodId => verification.methods.some(method => method.methodId === methodId)), "REQUIRED_PROOF_METHOD_MISSING", ref);
  if (item.responseType === "multiple-choice") {
    keys(verification.candidateCheck, ["kind", "totalCandidates", "validAnswerCount"], "CANDIDATE_CHECK_INVALID", ref);
    assert(verification.candidateCheck.kind === "finite-enumeration" && verification.candidateCheck.totalCandidates === item.publicDraft.options.length && verification.candidateCheck.validAnswerCount === 1, "CANDIDATE_CHECK_INVALID", ref);
  } else assert(verification.candidateCheck === null, "CANDIDATE_CHECK_INVALID", ref);
}

function validateAssetMetadata(item) {
  const ref = item.itemId;
  array(item.assetDrafts, "ASSET_DRAFTS_INVALID", ref);
  assert(item.assetDrafts.length === item.publicDraft.assets.length, "ASSET_DRAFTS_INVALID", ref);
  unique(item.assetDrafts.map(asset => asset.assetId), "ASSET_DRAFTS_INVALID", ref);
  item.assetDrafts.forEach(draft => {
    keys(draft, ["assetId", "sourcePath", "rightsDraft"], "ASSET_DRAFTS_INVALID", ref);
    const asset = item.publicDraft.assets.find(candidate => candidate.assetId === draft.assetId);
    const extension = asset && { "image/svg+xml": "svg", "image/png": "png", "image/webp": "webp" }[asset.mimeType];
    assert(ASSET_ID.test(draft.assetId) && extension && draft.sourcePath === `assets/${draft.assetId}.${extension}`, "ASSET_DRAFTS_INVALID", ref);
    validateRights(draft.rightsDraft, ref);
  });
}

function validatePack(pack) {
  keys(pack, ["schemaVersion", "confidentialityMarker", "packId", "revision", "programId", "targetGrade", "purpose", "planId", "planContractSha256", "state", "deliveryState", "author", "items"], "PACK_FIELDS_INVALID");
  assert(pack.schemaVersion === SCHEMA_VERSION && pack.confidentialityMarker === CONFIDENTIALITY_MARKER, "PACK_SCHEMA_INVALID");
  assert(typeof pack.packId === "string" && /^pack-bdg-[a-z0-9-]{4,64}$/.test(pack.packId) && Number.isSafeInteger(pack.revision) && pack.revision > 0, "PACK_IDENTITY_INVALID");
  assert(pack.programId === plan.programId && pack.targetGrade === 7 && pack.purpose === plan.purpose && pack.planId === plan.id && pack.planContractSha256 === plan.planContractSha256, "PACK_PLAN_LINEAGE_INVALID");
  assert(pack.state === DRAFT_STATE && pack.deliveryState === "locked", "PACK_RELEASE_STATE_INVALID");
  keys(pack.author, ["actorId", "provider", "model", "environment"], "AUTHOR_INVALID");
  Object.values(pack.author).forEach(value => assert(text(value), "AUTHOR_INVALID"));
  array(pack.items, "PLANNED_ITEM_COUNT_INVALID", "pack", 18, 18);
  const slots = new Map(plan.slots.map((slot, index) => [slot.slotId, { slot, entry: manifest.entries[index] }]));
  const seenSlots = new Set(), seenIds = new Set(), assetIds = new Set();
  pack.items.forEach(item => {
    const ref = item && item.itemId;
    keys(item, ITEM_FIELDS, "ITEM_FIELDS_INVALID", ref);
    assert(typeof item.itemId === "string" && ITEM_ID.test(item.itemId) && Number.isSafeInteger(item.itemVersion) && item.itemVersion > 0, "ITEM_IDENTITY_INVALID", ref);
    assert(!seenIds.has(item.itemId) && !seenSlots.has(item.slotId), "DUPLICATE_ITEM_OR_SLOT", ref);
    const found = slots.get(item.slotId);
    assert(found, "UNKNOWN_SLOT", ref);
    const { slot, entry } = found;
    ["unitId", "clusterId", "domainId", "skillId", "standardFocus", "difficulty", "responseType", "scoringMode", "maxPoints"].forEach(field => assert(item[field] === slot[field], "ITEM_PLAN_LINEAGE_INVALID", ref));
    assert(Array.isArray(item.standardIds) && item.standardIds.length === 1 && item.standardIds[0] === slot.standardFocus, "ITEM_STANDARD_FOCUS_INVALID", ref);
    keys(item.publicDraft, ["promptBlocks", "options", "assets", "responseUi"], "PUBLIC_DRAFT_INVALID", ref);
    array(item.publicDraft.promptBlocks, "PUBLIC_DRAFT_INVALID", ref, 1);
    array(item.publicDraft.options, "PUBLIC_DRAFT_INVALID", ref);
    array(item.publicDraft.assets, "PUBLIC_DRAFT_INVALID", ref);
    item.publicDraft.promptBlocks.forEach(block => { assert(record(block), "PUBLIC_DRAFT_INVALID", ref); if (block.type === "text") locales(block.valueByLocale, "PUBLIC_LOCALES_INVALID", ref); });
    item.publicDraft.options.forEach(option => { assert(record(option), "PUBLIC_DRAFT_INVALID", ref); locales(option.labelByLocale, "PUBLIC_LOCALES_INVALID", ref); });
    item.publicDraft.assets.forEach(asset => { assert(record(asset), "PUBLIC_DRAFT_INVALID", ref); locales(asset.altByLocale, "PUBLIC_LOCALES_INVALID", ref); assert(!assetIds.has(asset.assetId), "DUPLICATE_ASSET_ID", ref); assetIds.add(asset.assetId); });
    if (item.publicDraft.responseUi && item.publicDraft.responseUi.inputHintByLocale != null) locales(item.publicDraft.responseUi.inputHintByLocale, "PUBLIC_LOCALES_INVALID", ref);
    LOCALES.forEach(locale => unique(item.publicDraft.options.map(option => option.labelByLocale[locale].normalize("NFKC").replace(/\s+/g, " ")), "DUPLICATE_OPTION_LABEL", ref));
    validatePrivateDraft(item);
    validateRights(item.rightsDraft, ref);
    validateEvidence(item, slot, entry);
    validateNumberLine(item, slot);
    validateAssetMetadata(item);
    seenIds.add(item.itemId); seenSlots.add(item.slotId);
  });
  return Object.freeze({ itemCount: 18, automaticCount: 14, teacherCount: 4, state: DRAFT_STATE, deliveryState: "locked", independentReviewApproved: false, mathematicsVerified: false, studentOperationAuthorized: false, assetBytesVerified: false });
}

function inside(candidate, parent) { const relative = path.relative(parent, candidate); return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative)); }
function assertNoSymlinkPath(candidate) {
  let current = path.parse(candidate).root;
  candidate.slice(current.length).split(path.sep).filter(Boolean).forEach(part => {
    current = path.join(current, part);
    let stat; try { stat = fs.lstatSync(current); } catch (_) { throw new ValidationError("PRIVATE_PATH_UNAVAILABLE"); }
    assert(stat.isDirectory() && !stat.isSymbolicLink(), "PRIVATE_PATH_UNSAFE");
  });
}
function assertExternalRoot(rootArgument) {
  assert(typeof rootArgument === "string" && path.isAbsolute(rootArgument), "EXTERNAL_ROOT_REQUIRED");
  const lexical = path.resolve(rootArgument);
  assert(!inside(lexical, REPOSITORY_ROOT), "PRIVATE_ROOT_INSIDE_REPOSITORY");
  assertNoSymlinkPath(lexical);
  const root = fs.realpathSync(lexical);
  assert(!inside(root, fs.realpathSync(REPOSITORY_ROOT)), "PRIVATE_ROOT_INSIDE_REPOSITORY");
  for (let current = root; ; current = path.dirname(current)) {
    try { fs.lstatSync(path.join(current, ".git")); throw new ValidationError("PRIVATE_ROOT_INSIDE_GIT"); }
    catch (error) { if (!error || error.code !== "ENOENT") throw error instanceof ValidationError ? error : new ValidationError("PRIVATE_PATH_UNSAFE"); }
    if (current === path.dirname(current)) break;
  }
  return root;
}

function readBounded(filePath, limit, ref) {
  let descriptor;
  try {
    const stat = fs.lstatSync(filePath);
    assert(stat.isFile() && !stat.isSymbolicLink() && stat.size > 0 && stat.size <= limit, "PRIVATE_FILE_UNSAFE", ref);
    descriptor = fs.openSync(filePath, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
    const opened = fs.fstatSync(descriptor);
    assert(opened.isFile() && opened.ino === stat.ino && opened.dev === stat.dev, "PRIVATE_FILE_UNSAFE", ref);
    const buffer = Buffer.alloc(limit + 1);
    let size = 0, bytes;
    do { bytes = fs.readSync(descriptor, buffer, size, buffer.length - size, null); size += bytes; } while (bytes > 0 && size < buffer.length);
    assert(size > 0 && size <= limit, "PRIVATE_FILE_UNSAFE", ref);
    return buffer.subarray(0, size);
  } catch (error) { throw error instanceof ValidationError ? error : new ValidationError("PRIVATE_FILE_UNREADABLE", ref); }
  finally { if (descriptor !== undefined) fs.closeSync(descriptor); }
}

function parseStrictJson(source) {
  const containers = [];
  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (character === '"') {
      const start = index;
      let closed = false;
      for (index += 1; index < source.length; index += 1) {
        if (source[index] === "\\") { index += 1; continue; }
        if (source[index] === '"') { closed = true; break; }
      }
      assert(closed, "PRIVATE_JSON_INVALID");
      let next = index + 1;
      while (next < source.length && /[\t\n\r ]/.test(source[next])) next += 1;
      const container = containers[containers.length - 1];
      if (source[next] === ":" && container instanceof Set) {
        let key; try { key = JSON.parse(source.slice(start, index + 1)); } catch (_) { throw new ValidationError("PRIVATE_JSON_INVALID"); }
        assert(!container.has(key), "PRIVATE_JSON_DUPLICATE_KEY"); container.add(key);
      }
    } else if (character === "{" || character === "[") {
      containers.push(character === "{" ? new Set() : null);
      assert(containers.length <= 64, "PRIVATE_JSON_TOO_DEEP");
    } else if (character === "}" || character === "]") containers.pop();
  }
  try { return JSON.parse(source); } catch (_) { throw new ValidationError("PRIVATE_JSON_INVALID"); }
}

function validateAssetBytes(bytes, asset, ref) {
  assert(crypto.createHash("sha256").update(bytes).digest("hex") === asset.sha256, "ASSET_HASH_MISMATCH", ref);
  if (asset.mimeType === "image/svg+xml") {
    const svg = bytes.toString("utf8");
    assert(Buffer.from(svg, "utf8").equals(bytes) && /^\s*(?:<\?xml[^>]*>\s*)?<svg\b/i.test(svg) && /<\/svg>\s*$/i.test(svg), "ASSET_SVG_INVALID", ref);
    validateStaticSvg(svg, ref);
  } else if (asset.mimeType === "image/png") assert(bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), "ASSET_BYTES_INVALID", ref);
  else assert(bytes.length >= 12 && bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP", "ASSET_BYTES_INVALID", ref);
}

function validateStaticSvg(svg, ref) {
  // This intentionally small static-diagram subset rejects script/SMIL,
  // foreign namespaces, links, images, CSS, and unquoted attributes. Matching
  // only literal <script> would miss namespace-qualified active SVG elements.
  const elements = new Set(["svg", "g", "defs", "marker", "path", "line", "rect", "circle", "ellipse", "polyline", "polygon", "text", "tspan", "title", "desc"]);
  const attributes = new Set(["xmlns", "viewBox", "width", "height", "x", "y", "x1", "y1", "x2", "y2", "cx", "cy", "r", "rx", "ry", "d", "points", "fill", "fill-opacity", "fill-rule", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin", "stroke-dasharray", "stroke-dashoffset", "stroke-opacity", "opacity", "transform", "id", "font-family", "font-size", "font-weight", "font-style", "text-anchor", "dominant-baseline", "alignment-baseline", "dy", "dx", "letter-spacing", "marker-start", "marker-mid", "marker-end", "markerWidth", "markerHeight", "refX", "refY", "orient", "markerUnits", "preserveAspectRatio", "vector-effect", "role", "aria-label"]);
  const withoutDeclaration = svg.replace(/^\s*<\?xml\s+version\s*=\s*["']1\.0["'](?:\s+encoding\s*=\s*["']UTF-8["'])?\s*\?>/i, "");
  assert(!/<!|<\?/.test(withoutDeclaration), "ASSET_SVG_UNSAFE", ref);
  for (const match of withoutDeclaration.matchAll(/<([^>]+)>/g)) {
    const tag = match[1].match(/^(\/)?([A-Za-z][A-Za-z0-9:.-]*)([\s\S]*?)\/?\s*$/);
    assert(tag && elements.has(tag[2]), "ASSET_SVG_UNSAFE", ref);
    let remainder = tag[3].trim();
    if (tag[1]) { assert(remainder === "", "ASSET_SVG_UNSAFE", ref); continue; }
    const seen = new Set();
    while (remainder) {
      const attribute = remainder.match(/^([A-Za-z][A-Za-z0-9:.-]*)\s*=\s*(["'])([^<>]*?)\2(?:\s+|$)/);
      assert(attribute && attributes.has(attribute[1]) && !seen.has(attribute[1]), "ASSET_SVG_UNSAFE", ref);
      // XML entities and CSS escapes can disguise a resource URL before the
      // renderer decodes it. Attribute values in this static subset are literal;
      // ordinary escaped text remains permitted in SVG text nodes.
      assert(!/[&\\]/.test(attribute[3]), "ASSET_SVG_UNSAFE", ref);
      seen.add(attribute[1]);
      if (attribute[1] === "xmlns") assert(attribute[3] === "http://www.w3.org/2000/svg", "ASSET_SVG_UNSAFE", ref);
      if (/url\s*\(/i.test(attribute[3])) assert(/^url\(#[A-Za-z][A-Za-z0-9_.-]*\)$/.test(attribute[3]) && ["marker-start", "marker-mid", "marker-end"].includes(attribute[1]), "ASSET_SVG_UNSAFE", ref);
      remainder = remainder.slice(attribute[0].length);
    }
  }
}

function validateDirectory(rootArgument) {
  const root = assertExternalRoot(rootArgument);
  const bytes = readBounded(path.join(root, PACK_FILE), MAX_BYTES);
  const source = bytes.toString("utf8");
  assert(Buffer.from(source, "utf8").equals(bytes), "PRIVATE_JSON_ENCODING_INVALID");
  const pack = parseStrictJson(source);
  const result = validatePack(pack);
  pack.items.forEach(item => item.assetDrafts.forEach(draft => {
    assertNoSymlinkPath(path.join(root, "assets"));
    const asset = item.publicDraft.assets.find(candidate => candidate.assetId === draft.assetId);
    validateAssetBytes(readBounded(path.join(root, draft.sourcePath), 512 * 1024, item.itemId), asset, item.itemId);
  }));
  return Object.freeze({ ...result, assetBytesVerified: true });
}

function main(args = process.argv.slice(2)) {
  try {
    assert(args.length === 2 && args[0] === "--root", "EXTERNAL_ROOT_REQUIRED");
    const result = validateDirectory(args[1]);
    process.stdout.write(`PRIVATE_GRADE7_NSA_PREFLIGHT_OK items=${result.itemCount} automatic=${result.automaticCount} teacher=${result.teacherCount} state=${result.state} delivery=locked independentReviewApproved=false mathematicsVerified=false\n`);
  } catch (error) {
    const safe = error instanceof ValidationError ? error : new ValidationError("UNEXPECTED_VALIDATOR_ERROR");
    process.stderr.write(`PRIVATE_GRADE7_NSA_PREFLIGHT_FAILED code=${safe.code} ref=${safe.reference}\n`);
    process.exitCode = 1;
  }
}
if (require.main === module) main();
module.exports = Object.freeze({ SCHEMA_VERSION, CONFIDENTIALITY_MARKER, DRAFT_STATE, PACK_FILE, ValidationError, createDraftSkeleton, validatePack, validateDirectory, assertExternalRoot, parseStrictJson });
