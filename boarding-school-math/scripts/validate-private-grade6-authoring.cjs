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
const { spawnSync } = require("child_process");
const placement = require("../assessment/grade6-placement-plan.js");
const contract = require("../question-bank/item-release-contract.js");

const DRAFT_SCHEMA_VERSION = "gfield-private-authoring-draft-v1";
const DRAFT_STATE = "draft-pending-independent-review";
const PRIVATE_ITEM_KEYS = new Set([
  "slotId", "itemId", "clusterId", "domainId", "skillId", "standardIds", "difficulty", "responseType",
  "publicDraft", "privateDraft", "verification", "rightsDraft"
]);
const PUBLIC_DRAFT_KEYS = new Set(["promptBlocks", "options", "responseUi"]);
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

function syntheticPublicItem(item) {
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
    promptBlocks: item.publicDraft.promptBlocks,
    options: item.publicDraft.options,
    assets: [],
    responseUi: item.publicDraft.responseUi,
    rightsRecordId: `rgt-bnk-${suffix}`
  };
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
    state: "in-review"
  };
  try {
    contract.validatePrivateSpec(privateSpec, publicItem);
  } catch (error) {
    fail("AUTOMATIC_SCORING_CONTRACT", reference);
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
    assert(criterion.errorCodes.length > 0 && criterion.errorCodes.every(function (code) { return typeof code === "string" && /^[a-z][a-z0-9-]{1,63}$/.test(code); }), "TEACHER_RUBRIC_CRITERION_INVALID", reference);
  }
}

function validateTeacherDraft(item, reference) {
  assert(!Object.prototype.hasOwnProperty.call(item.privateDraft, "answer"), "TEACHER_ANSWER_FIELD_FORBIDDEN", reference);
  requireLocales(item.privateDraft.expectedResponseByLocale, "TEACHER_REFERENCE_MISSING", reference);
  const rubric = item.privateDraft.rubricDraft;
  assertRecord(rubric, "TEACHER_RUBRIC_MISSING", reference);
  assert(rubric.maxPoints === 1, "TEACHER_RUBRIC_NOT_MIGRATION_READY", reference);
  validatePointIncrements(rubric.allowedPointIncrements, reference);
  assert(rubric.humanReviewRequired === true && rubric.secondReviewPolicy === "boundary-and-high-stakes-required", "TEACHER_RUBRIC_NOT_MIGRATION_READY", reference);
  if (rubric.criteria != null) {
    assertDenseArray(rubric.criteria, "TEACHER_RUBRIC_CRITERION_INVALID", reference);
    assert(rubric.criteria.length > 0, "TEACHER_RUBRIC_CRITERION_INVALID", reference);
    rubric.criteria.forEach(function (criterion) { validateDraftCriterion(criterion, reference); });
  } else {
    requireLocales(rubric.onePointCriterionByLocale, "TEACHER_RUBRIC_NOT_MIGRATION_READY", reference);
    requireLocales(rubric.zeroPointCriterionByLocale, "TEACHER_RUBRIC_NOT_MIGRATION_READY", reference);
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

function validateErrorSignal(signal, reference) {
  if (nonBlankText(signal)) return;
  const allowed = new Set(["code", "observedValue", "rationaleByLocale"]);
  assertOnlyKeys(signal, allowed, "ERROR_SIGNAL_INVALID", reference);
  assert(typeof signal.code === "string" && /^[a-z][a-z0-9-]{1,63}$/.test(signal.code), "ERROR_SIGNAL_INVALID", reference);
  assert(nonBlankText(signal.observedValue), "ERROR_SIGNAL_INVALID", reference);
  requireLocales(signal.rationaleByLocale, "ERROR_SIGNAL_INVALID", reference);
}

function validateEvidenceDraft(item, reference) {
  const privateDraft = item.privateDraft;
  ["solutionByLocale", "uniquenessProofByLocale", "difficultyRationaleByLocale"].forEach(function (field) {
    requireLocales(privateDraft[field], "PRIVATE_EVIDENCE_MISSING", reference);
  });
  assertDenseArray(privateDraft.errorSignals, "ERROR_SIGNALS_MISSING", reference);
  assert(privateDraft.errorSignals.length > 0, "ERROR_SIGNALS_INVALID", reference);
  privateDraft.errorSignals.forEach(function (signal) { validateErrorSignal(signal, reference); });
  assertRecord(item.verification, "AUTHOR_VERIFICATION_MISSING", reference);
  assert(Object.keys(item.verification).length > 0, "AUTHOR_VERIFICATION_EMPTY", reference);
  assert(nonBlankText(item.verification.kind) || nonBlankText(item.verification.method), "AUTHOR_VERIFICATION_METHOD_MISSING", reference);
}

function validateItem(item, expectedSlot, fileName, index) {
  const reference = localId(item, fileName, index);
  assertOnlyKeys(item, PRIVATE_ITEM_KEYS, "DRAFT_ITEM_FIELDS_INVALID", reference);
  assert(item.slotId === expectedSlot.slotId, "SLOT_ID_INVALID", reference);
  assert(typeof item.itemId === "string" && /^qst-bnk-[a-z0-9]{16}$/.test(item.itemId), "ITEM_ID_INVALID", reference);
  ["clusterId", "domainId", "skillId", "difficulty", "responseType"].forEach(function (field) {
    assert(item[field] === expectedSlot[field], "PLAN_LINEAGE_MISMATCH", reference);
  });
  if (item.standardIds != null) {
    assertDenseArray(item.standardIds, "STANDARD_IDS_INVALID", reference);
    assert(item.standardIds.length > 0 && item.standardIds.every(nonBlankText), "STANDARD_IDS_INVALID", reference);
  }
  assertOnlyKeys(item.publicDraft, PUBLIC_DRAFT_KEYS, "PUBLIC_DRAFT_FIELDS_INVALID", reference);
  assertDenseArray(item.publicDraft.promptBlocks, "PUBLIC_PROMPT_BLOCKS_INVALID", reference);
  assert(item.publicDraft.promptBlocks.length > 0, "PUBLIC_PROMPT_BLOCKS_INVALID", reference);
  assertDenseArray(item.publicDraft.options, "PUBLIC_OPTIONS_INVALID", reference);
  assertRecord(item.publicDraft.responseUi, "PUBLIC_RESPONSE_UI_INVALID", reference);
  let publicItem;
  try {
    publicItem = syntheticPublicItem(item);
    contract.validatePublicItem(publicItem);
  } catch (error) {
    fail("PUBLIC_DELIVERY_CONTRACT", reference);
  }

  assertRecord(item.privateDraft, "PRIVATE_DRAFT_MISSING", reference);
  validateEvidenceDraft(item, reference);
  if (expectedSlot.scoringMode === "automatic") validateAutomaticAnswer(item, publicItem, reference);
  else validateTeacherDraft(item, reference);
  validateRightsDraft(item.rightsDraft, reference);
}

function sourceFiles(directory) {
  assert(fs.existsSync(directory), "PRIVATE_AUTHORING_DIRECTORY_MISSING", "private-authoring");
  const files = [];
  fs.readdirSync(directory, { withFileTypes: true }).forEach(function (entry) {
    assert(entry.isFile() && !entry.isSymbolicLink(), "UNEXPECTED_PRIVATE_AUTHORING_PATH", entry.name);
    assert(/^grade6-[a-z-]+-drafts\.cjs$/.test(entry.name), "UNEXPECTED_PRIVATE_AUTHORING_PATH", entry.name);
    files.push(entry.name);
  });
  return files.sort();
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
  assert(files.length > 0, "PRIVATE_AUTHORING_PACKS_MISSING", "private-authoring");
  assertGitIgnored(resolvedDirectory, files);
  const expectedBySlot = new Map(placement.plan.slots.map(function (slot) { return [slot.slotId, slot]; }));
  const seenSlots = new Set();
  const seenIds = new Set();
  let itemCount = 0;
  files.forEach(function (fileName) {
    const pack = loadPack(path.join(resolvedDirectory, fileName), fileName);
    pack.items.forEach(function (item, index) {
      const reference = localId(item, fileName, index);
      assert(!seenSlots.has(item && item.slotId), "DUPLICATE_SLOT", reference);
      assert(!seenIds.has(item && item.itemId), "DUPLICATE_ITEM_ID", reference);
      const expectedSlot = expectedBySlot.get(item && item.slotId);
      assert(expectedSlot, "UNKNOWN_SLOT", reference);
      validateItem(item, expectedSlot, fileName, index);
      seenSlots.add(item.slotId);
      seenIds.add(item.itemId);
      itemCount += 1;
    });
  });
  assert(itemCount === placement.plan.plannedItemCount, "PLANNED_ITEM_COUNT_MISMATCH", "private-authoring");
  assert(seenSlots.size === expectedBySlot.size, "GRADE6_SLOTS_INCOMPLETE", "private-authoring");
  return Object.freeze({ fileCount: files.length, itemCount, state: DRAFT_STATE });
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

module.exports = Object.freeze({ DRAFT_SCHEMA_VERSION, DRAFT_STATE, validateDirectory });
