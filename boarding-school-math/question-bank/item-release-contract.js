(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDItemReleaseContract = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const SCHEMA_VERSION = "gfield-item-bank-v1";
  const VISIBILITY_CLASSES = Object.freeze(["public-practice", "authenticated-assessment", "teacher-only"]);
  const RESPONSE_TYPES = Object.freeze(["multiple-choice", "numeric", "short-answer", "constructed-response"]);
  const DIFFICULTIES = Object.freeze(["foundation", "core", "advanced"]);
  const ASSESSMENT_PURPOSES = Object.freeze(["unit-screener", "course-placement", "competition-benchmark"]);
  const RIGHTS_MODES = Object.freeze([
    "owned_original", "permissive_reviewed", "private_licensed", "noncommercial_reference",
    "permission_required", "provenance_review"
  ]);
  const REVIEW_TYPES = Object.freeze([
    "math-correctness", "age-appropriateness", "answer-uniqueness", "translation-ko", "translation-en",
    "translation-zh-Hans", "rights", "asset-rights", "scoring-rubric", "visual-evidence"
  ]);
  const PUBLIC_ITEM_FIELDS = Object.freeze([
    "schemaVersion", "itemId", "itemVersion", "publicRevisionId", "publicPayloadSha256", "visibilityClass",
    "programId", "targetGrade", "domainId", "clusterId", "skillId", "difficulty", "responseType", "maxPoints",
    "assessmentBinding", "promptBlocks", "options", "assets", "responseUi", "rightsRecordId"
  ]);
  const ASSESSMENT_BINDING_FIELDS = Object.freeze([
    "blueprintId", "blueprintVersion", "blueprintContractSha256", "purpose", "slotId", "unitId", "standardRange"
  ]);
  const PRIVATE_SPEC_FIELDS = Object.freeze([
    "schemaVersion", "scoringSpecId", "specVersion", "itemId", "itemVersion", "publicPayloadSha256",
    "privateSpecSha256", "scoringMode", "maxPoints", "answer", "normalizationVersion", "solutionRef",
    "rubricId", "rubricVersion", "rubricSha256", "state"
  ]);
  const RIGHTS_FIELDS = Object.freeze([
    "schemaVersion", "rightsRecordId", "rightsVersion", "rightsRecordSha256", "itemId", "itemVersion", "assetId", "mode", "originType",
    "authority", "sourceTitle", "sourceUrl", "documentRevision", "sourceLocator", "licenseId", "licenseUrl",
    "permissionRecordId", "allowedScopes", "translationAllowed", "derivativeAllowed", "expiresAt", "attribution",
    "reviewedBy", "reviewedAt", "decision"
  ]);
  const REVIEW_FIELDS = Object.freeze([
    "schemaVersion", "reviewId", "reviewRecordSha256", "type", "decision", "authorId", "reviewerId", "reviewerRole", "reviewedAt",
    "itemId", "itemVersion", "reviewedPublicHash", "reviewedPrivateHash", "reviewedRubricHash", "rightsRecordId", "reviewedRightsHash", "locale", "evidenceRef"
  ]);
  const RUBRIC_FIELDS = Object.freeze([
    "schemaVersion", "rubricId", "rubricVersion", "rubricSha256", "itemId", "itemVersion", "publicPayloadSha256",
    "privateSpecSha256", "maxPoints", "allowedPointIncrements", "criteria", "humanReviewRequired",
    "secondReviewPolicy", "state"
  ]);
  const CRITERION_FIELDS = Object.freeze(["criterionId", "maxPoints", "levels", "requiredEvidence", "errorCodes"]);
  const LEVEL_FIELDS = Object.freeze(["points", "observableEvidenceByLocale"]);
  const MAX_ARRAY_ENTRIES = 1000;
  const FORBIDDEN_STUDENT_KEYS = new Set([
    "answer", "answerkey", "correctoption", "iscorrect", "solution", "rubric", "tolerance",
    "acceptedalternatives", "errormapping", "privatespecsha256", "scoringspecid", "distractorrationale",
    "reviewernotes", "awardedpoints"
  ]);

  function fail(message) { throw new Error(message); }
  function isRecord(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
  }
  function requireRecord(value, field) {
    if (!isRecord(value)) fail(`${field} must be a plain object`);
    const ownKeys = Reflect.ownKeys(value);
    if (ownKeys.some(function (key) { return typeof key !== "string"; })) fail(`${field} must not contain symbol fields`);
    ownKeys.forEach(function (key) {
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (!descriptor || !Object.prototype.hasOwnProperty.call(descriptor, "value") || descriptor.enumerable !== true) {
        fail(`${field}.${key} must be an enumerable data field`);
      }
    });
  }
  function requireText(value, field, pattern) {
    if (typeof value !== "string" || !value || value !== value.trim()) fail(`${field} must be a non-blank trimmed string`);
    if (pattern && !pattern.test(value)) fail(`${field} is invalid`);
  }
  function assertKnownFields(value, allowed, field) {
    requireRecord(value, field);
    const extra = Object.keys(value).filter(function (key) { return !allowed.includes(key); });
    if (extra.length) fail(`${field} has unsupported fields: ${extra.join(", ")}`);
  }
  function requireHash(value, field) { requireText(value, field, /^[a-f0-9]{64}$/); }
  function requireHttpsUrl(value, field) {
    requireText(value, field);
    let parsed;
    try { parsed = new URL(value); } catch (error) { fail(`${field} must be a valid HTTPS URL`); }
    if (parsed.protocol !== "https:" || !parsed.hostname || parsed.username || parsed.password) fail(`${field} must be a valid HTTPS URL`);
  }
  function greatestCommonDivisor(left, right) {
    let a = left < 0n ? -left : left;
    let b = right < 0n ? -right : right;
    while (b) { const next = a % b; a = b; b = next; }
    return a;
  }
  function requireCanonicalNumeric(value, field) {
    requireText(value, field);
    if (/^(?:0|-?[1-9]\d*)$/.test(value)) return;
    if (/^-?(?:0|[1-9]\d*)\.\d*[1-9]$/.test(value)) return;
    const fraction = value.match(/^(-?[1-9]\d*)\/([1-9]\d*)$/);
    if (fraction && BigInt(fraction[2]) > 1n && greatestCommonDivisor(BigInt(fraction[1]), BigInt(fraction[2])) === 1n) return;
    fail(`${field} must be a canonical finite integer, decimal, or reduced fraction`);
  }
  function requireTimestamp(value, field) {
    requireText(value, field, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/);
    const parsed = new Date(value);
    const normalized = value.includes(".") ? value : value.replace("Z", ".000Z");
    if (Number.isNaN(parsed.getTime()) || parsed.toISOString() !== normalized) fail(`${field} is not a real timestamp`);
  }
  function validateGrade(value, field) {
    if (value === "K") return;
    if (!Number.isInteger(value) || value < 1 || value > 8) fail(`${field} must be K or grade 1-8`);
  }
  function validateLocales(value, field) {
    requireRecord(value, field);
    ["ko", "en"].forEach(function (locale) { requireText(value[locale], `${field}.${locale}`); });
    Object.keys(value).forEach(function (locale) {
      if (!["ko", "en", "zh-Hans"].includes(locale)) fail(`${field}.${locale} is not supported`);
      requireText(value[locale], `${field}.${locale}`);
    });
  }
  function assertNoStudentLeak(value, path, seen) {
    const visited = seen || new Set();
    if (typeof value === "string" && /(?:정답|답은|correct\s+answer|answer\s+is|answers?\s*[:：-]\s*(?:option\s+|choice\s+)?[A-Z0-9]|正确答案|答案是|(?:choose|select|pick)\s+(?:option|choice)\s+[A-Z]|(?:선택지|보기)\s*[A-Z가-힣0-9]+\s*(?:를|을)?\s*(?:고르|선택))/i.test(value)) {
      fail(`${path} contains obvious answer-revealing text`);
    }
    if (value == null || typeof value === "string" || typeof value === "boolean") return true;
    if (typeof value === "number") {
      if (!Number.isFinite(value)) fail(`${path} must contain finite JSON numbers only`);
      return true;
    }
    if (typeof value !== "object") fail(`${path} must contain JSON-safe values only`);
    if (visited.has(value)) fail(`${path} must not contain circular references`);
    visited.add(value);
    if (Array.isArray(value)) {
      assertDenseArray(value, path);
      value.forEach(function (entry, index) { assertNoStudentLeak(entry, `${path}[${index}]`, visited); });
    } else {
      requireRecord(value, path);
      Object.keys(value).forEach(function (key) {
        if (FORBIDDEN_STUDENT_KEYS.has(key.toLowerCase())) fail(`${path}.${key} is private scoring data`);
        assertNoStudentLeak(value[key], `${path}.${key}`, visited);
      });
    }
    visited.delete(value);
    return true;
  }
  function assertDenseArray(value, field, maxLength) {
    if (!Array.isArray(value)) fail(`${field} must be an array`);
    if (Object.getPrototypeOf(value) !== Array.prototype) fail(`${field} must be a plain array`);
    const limit = maxLength == null ? MAX_ARRAY_ENTRIES : maxLength;
    if (!Number.isSafeInteger(value.length) || value.length > limit) fail(`${field} cannot exceed ${limit} entries`);
    const ownKeys = Reflect.ownKeys(value);
    if (ownKeys.some(function (key) { return typeof key !== "string"; })) fail(`${field} must not contain symbol fields`);
    const extra = ownKeys.filter(function (key) {
      if (key === "length") return false;
      if (!/^(?:0|[1-9]\d*)$/.test(key)) return true;
      const index = Number(key);
      return !Number.isSafeInteger(index) || index >= value.length || String(index) !== key;
    });
    if (extra.length) fail(`${field} contains unsupported array fields: ${extra.join(", ")}`);
    for (let index = 0; index < value.length; index += 1) {
      if (!Object.prototype.hasOwnProperty.call(value, index)) fail(`${field} must not contain sparse entries`);
      const descriptor = Object.getOwnPropertyDescriptor(value, String(index));
      if (!descriptor || !Object.prototype.hasOwnProperty.call(descriptor, "value") || descriptor.enumerable !== true) {
        fail(`${field}[${index}] must be an enumerable data field`);
      }
    }
  }

  function validatePromptBlock(block, index) {
    const field = `publicItem.promptBlocks[${index}]`;
    requireRecord(block, field);
    if (block.type === "text") {
      assertKnownFields(block, ["type", "valueByLocale"], field);
      validateLocales(block.valueByLocale, `${field}.valueByLocale`);
    } else if (block.type === "math") {
      assertKnownFields(block, ["type", "latex"], field);
      requireText(block.latex, `${field}.latex`);
    } else if (block.type === "diagram") {
      assertKnownFields(block, ["type", "assetId"], field);
      requireText(block.assetId, `${field}.assetId`, /^ast-bnk-[a-z0-9]{16}$/);
    } else fail(`${field}.type is invalid`);
  }

  function validateAssessmentBinding(binding) {
    requireRecord(binding, "publicItem.assessmentBinding");
    assertKnownFields(binding, ASSESSMENT_BINDING_FIELDS, "publicItem.assessmentBinding");
    requireText(binding.blueprintId, "publicItem.assessmentBinding.blueprintId", /^asm-bdg-[a-z0-9-]{4,64}$/);
    if (!Number.isInteger(binding.blueprintVersion) || binding.blueprintVersion < 1) {
      fail("publicItem.assessmentBinding.blueprintVersion must be positive");
    }
    requireHash(binding.blueprintContractSha256, "publicItem.assessmentBinding.blueprintContractSha256");
    if (!ASSESSMENT_PURPOSES.includes(binding.purpose)) fail("publicItem.assessmentBinding.purpose is invalid");
    requireText(binding.slotId, "publicItem.assessmentBinding.slotId", /^slot-bdg-[a-z0-9-]{4,64}$/);
    requireText(binding.unitId, "publicItem.assessmentBinding.unitId", /^[a-z0-9][a-z0-9-]{2,63}$/);
    requireText(binding.standardRange, "publicItem.assessmentBinding.standardRange", /^(?:K|[1-8])\.[A-Z]{1,4}\.[A-Z]\.\d+(?:-\d+)?$/);
  }

  function validatePublicItem(item) {
    requireRecord(item, "publicItem");
    assertKnownFields(item, PUBLIC_ITEM_FIELDS, "publicItem");
    assertNoStudentLeak(item, "publicItem");
    if (item.schemaVersion !== SCHEMA_VERSION) fail("publicItem.schemaVersion is unsupported");
    requireText(item.itemId, "publicItem.itemId", /^qst-bnk-[a-z0-9]{16}$/);
    if (!Number.isInteger(item.itemVersion) || item.itemVersion < 1) fail("publicItem.itemVersion must be positive");
    requireText(item.publicRevisionId, "publicItem.publicRevisionId", /^rev-bnk-[a-z0-9]{16}$/);
    requireHash(item.publicPayloadSha256, "publicItem.publicPayloadSha256");
    if (!VISIBILITY_CLASSES.includes(item.visibilityClass)) fail("publicItem.visibilityClass is invalid");
    requireText(item.programId, "publicItem.programId", /^[a-z0-9][a-z0-9-]{2,63}$/);
    validateGrade(item.targetGrade, "publicItem.targetGrade");
    requireText(item.domainId, "publicItem.domainId", /^G(?:K|[1-8])-[A-Z]{1,4}$/);
    requireText(item.clusterId, "publicItem.clusterId", /^(?:K|[1-8])\.[A-Z]{1,4}\.[A-Z]$/);
    const clusterParts = item.clusterId.split(".");
    if (clusterParts[0] !== String(item.targetGrade) || item.domainId !== `G${String(item.targetGrade)}-${clusterParts[1]}`) {
      fail("publicItem grade, domain, and cluster must describe the same CCSS lineage");
    }
    requireText(item.skillId, "publicItem.skillId", /^[a-z0-9][a-z0-9:-]{2,127}$/);
    if (!DIFFICULTIES.includes(item.difficulty)) fail("publicItem.difficulty is invalid");
    if (!RESPONSE_TYPES.includes(item.responseType)) fail("publicItem.responseType is invalid");
    if (!Number.isInteger(item.maxPoints) || item.maxPoints < 1 || item.maxPoints > 4) fail("publicItem.maxPoints must be 1-4");
    if (item.visibilityClass === "authenticated-assessment") validateAssessmentBinding(item.assessmentBinding);
    else if (item.assessmentBinding != null) fail("only authenticated-assessment items may contain assessmentBinding");
    assertDenseArray(item.promptBlocks, "publicItem.promptBlocks");
    if (!item.promptBlocks.length) fail("publicItem.promptBlocks is required");
    item.promptBlocks.forEach(validatePromptBlock);
    assertDenseArray(item.options, "publicItem.options");
    item.options.forEach(function (option, index) {
      const field = `publicItem.options[${index}]`;
      requireRecord(option, field);
      assertKnownFields(option, ["optionId", "labelByLocale"], field);
      requireText(option.optionId, `${field}.optionId`, /^[A-Z][A-Z0-9]{0,7}$/);
      validateLocales(option.labelByLocale, `${field}.labelByLocale`);
    });
    if (new Set(item.options.map(function (option) { return option.optionId; })).size !== item.options.length) fail("publicItem option ids contain duplicates");
    if (item.responseType === "multiple-choice" && (item.options.length < 2 || item.options.length > 6)) fail("multiple-choice requires 2-6 options");
    if (item.responseType !== "multiple-choice" && item.options.length) fail("only multiple-choice may contain options");
    assertDenseArray(item.assets, "publicItem.assets");
    item.assets.forEach(function (asset, index) {
      const field = `publicItem.assets[${index}]`;
      requireRecord(asset, field);
      assertKnownFields(asset, ["assetId", "sha256", "mimeType", "altByLocale", "rightsRecordId"], field);
      requireText(asset.assetId, `${field}.assetId`, /^ast-bnk-[a-z0-9]{16}$/);
      requireHash(asset.sha256, `${field}.sha256`);
      if (!["image/svg+xml", "image/png", "image/webp"].includes(asset.mimeType)) fail(`${field}.mimeType is invalid`);
      validateLocales(asset.altByLocale, `${field}.altByLocale`);
      requireText(asset.rightsRecordId, `${field}.rightsRecordId`, /^rgt-bnk-[a-z0-9]{16}$/);
    });
    const assetIds = item.assets.map(function (asset) { return asset.assetId; });
    if (new Set(assetIds).size !== assetIds.length) fail("publicItem asset ids contain duplicates");
    item.promptBlocks.filter(function (block) { return block.type === "diagram"; }).forEach(function (block) {
      if (!assetIds.includes(block.assetId)) fail("diagram block must reference a declared asset");
    });
    assetIds.forEach(function (assetId) {
      if (!item.promptBlocks.some(function (block) { return block.type === "diagram" && block.assetId === assetId; })) {
        fail("every declared asset must be referenced by a diagram block");
      }
    });
    requireRecord(item.responseUi, "publicItem.responseUi");
    assertKnownFields(item.responseUi, ["inputKind", "displayUnit", "inputHintByLocale"], "publicItem.responseUi");
    if (!["choice", "number", "text", "workpad"].includes(item.responseUi.inputKind)) fail("publicItem.responseUi.inputKind is invalid");
    const expectedInput = { "multiple-choice": "choice", numeric: "number", "short-answer": "text", "constructed-response": "workpad" }[item.responseType];
    if (item.responseUi.inputKind !== expectedInput) fail("publicItem.responseUi.inputKind must match responseType");
    if (item.responseUi.displayUnit != null) requireText(item.responseUi.displayUnit, "publicItem.responseUi.displayUnit");
    if (item.responseUi.inputHintByLocale != null) validateLocales(item.responseUi.inputHintByLocale, "publicItem.responseUi.inputHintByLocale");
    requireText(item.rightsRecordId, "publicItem.rightsRecordId", /^rgt-bnk-[a-z0-9]{16}$/);
    return true;
  }

  function validatePrivateSpec(spec, item) {
    requireRecord(spec, "privateSpec");
    assertKnownFields(spec, PRIVATE_SPEC_FIELDS, "privateSpec");
    if (spec.schemaVersion !== SCHEMA_VERSION) fail("privateSpec.schemaVersion is unsupported");
    requireText(spec.scoringSpecId, "privateSpec.scoringSpecId", /^scr-bnk-[a-z0-9]{16}$/);
    if (!Number.isInteger(spec.specVersion) || spec.specVersion < 1) fail("privateSpec.specVersion must be positive");
    if (spec.itemId !== item.itemId || spec.itemVersion !== item.itemVersion || spec.publicPayloadSha256 !== item.publicPayloadSha256) {
      fail("privateSpec must match the exact public item revision");
    }
    requireHash(spec.privateSpecSha256, "privateSpec.privateSpecSha256");
    if (!["automatic", "teacher"].includes(spec.scoringMode)) fail("privateSpec.scoringMode is invalid");
    if (spec.maxPoints !== item.maxPoints) fail("privateSpec.maxPoints must match publicItem.maxPoints");
    if (item.responseType === "constructed-response" && spec.scoringMode !== "teacher") fail("constructed response must be teacher scored");
    if (spec.scoringMode === "automatic") {
      requireRecord(spec.answer, "privateSpec.answer");
      assertKnownFields(spec.answer, ["kind", "value", "acceptedAlternatives", "tolerance", "unitRule"], "privateSpec.answer");
      if (!["option-id", "numeric-exact"].includes(spec.answer.kind)) fail("privateSpec.answer.kind is invalid for automatic scoring");
      requireText(spec.answer.value, "privateSpec.answer.value");
      requireText(spec.normalizationVersion, "privateSpec.normalizationVersion");
      assertDenseArray(spec.answer.acceptedAlternatives, "privateSpec.answer.acceptedAlternatives");
      spec.answer.acceptedAlternatives.forEach(function (answer, index) { requireText(answer, `privateSpec.answer.acceptedAlternatives[${index}]`); });
      if (spec.answer.kind === "option-id") {
        if (item.responseType !== "multiple-choice") fail("option-id scoring requires a multiple-choice item");
        if (!item.options.some(function (option) { return option.optionId === spec.answer.value; })) fail("correct option must exist in publicItem.options");
        if (spec.answer.acceptedAlternatives.length || spec.answer.tolerance != null || spec.answer.unitRule != null) fail("option-id scoring cannot use numeric alternatives, tolerance, or unit rules");
      } else {
        if (item.responseType !== "numeric") fail("numeric-exact scoring requires a numeric item");
        requireCanonicalNumeric(spec.answer.value, "privateSpec.answer.value");
        if (spec.answer.acceptedAlternatives.length) fail("numeric-exact equivalence belongs in the versioned normalizer, not acceptedAlternatives");
        if (spec.answer.tolerance != null) fail("numeric-exact scoring cannot use a tolerance");
        if (spec.answer.unitRule != null) requireText(spec.answer.unitRule, "privateSpec.answer.unitRule");
      }
    } else if (spec.answer != null) fail("teacher-scored specs must use a private rubric rather than an answer field");
    if (spec.scoringMode === "teacher") {
      requireText(spec.rubricId, "privateSpec.rubricId", /^rub-bnk-[a-z0-9]{16}$/);
      if (!Number.isInteger(spec.rubricVersion) || spec.rubricVersion < 1) fail("privateSpec.rubricVersion must be positive");
      requireHash(spec.rubricSha256, "privateSpec.rubricSha256");
    } else if (spec.rubricId != null || spec.rubricVersion != null || spec.rubricSha256 != null) {
      fail("automatic scoring must not declare a rubric revision");
    }
    requireText(spec.solutionRef, "privateSpec.solutionRef");
    if (spec.state !== "in-review") fail("privateSpec.state must remain in-review until server release");
    return true;
  }

  function validateRubric(rubric, item, spec) {
    if (spec.scoringMode !== "teacher") {
      if (rubric != null) fail("automatic scoring must not include a rubric");
      return true;
    }
    requireRecord(rubric, "rubric");
    assertKnownFields(rubric, RUBRIC_FIELDS, "rubric");
    if (rubric.schemaVersion !== SCHEMA_VERSION || rubric.rubricId !== spec.rubricId || rubric.rubricVersion !== spec.rubricVersion) {
      fail("rubric identity must match privateSpec");
    }
    requireHash(rubric.rubricSha256, "rubric.rubricSha256");
    if (rubric.rubricSha256 !== spec.rubricSha256) fail("rubric hash must match privateSpec");
    if (rubric.itemId !== item.itemId || rubric.itemVersion !== item.itemVersion ||
        rubric.publicPayloadSha256 !== item.publicPayloadSha256 || rubric.privateSpecSha256 !== spec.privateSpecSha256) {
      fail("rubric must match the exact public and private revisions");
    }
    if (rubric.maxPoints !== item.maxPoints) fail("rubric.maxPoints must match the item");
    assertDenseArray(rubric.allowedPointIncrements, "rubric.allowedPointIncrements");
    if (!rubric.allowedPointIncrements.length) fail("rubric.allowedPointIncrements is required");
    rubric.allowedPointIncrements.forEach(function (points) {
      if (typeof points !== "number" || !Number.isFinite(points) || points < 0 || points > rubric.maxPoints) fail("rubric point increments are invalid");
    });
    if (!rubric.allowedPointIncrements.includes(0) || !rubric.allowedPointIncrements.includes(rubric.maxPoints)) fail("rubric increments must include zero and maxPoints");
    if (new Set(rubric.allowedPointIncrements).size !== rubric.allowedPointIncrements.length) fail("rubric point increments contain duplicates");
    assertDenseArray(rubric.criteria, "rubric.criteria");
    if (!rubric.criteria.length) fail("rubric.criteria is required");
    rubric.criteria.forEach(function (criterion, criterionIndex) {
      const field = `rubric.criteria[${criterionIndex}]`;
      requireRecord(criterion, field);
      assertKnownFields(criterion, CRITERION_FIELDS, field);
      requireText(criterion.criterionId, `${field}.criterionId`, /^[a-z][a-z0-9-]{1,31}$/);
      if (typeof criterion.maxPoints !== "number" || !Number.isFinite(criterion.maxPoints) || criterion.maxPoints <= 0) fail(`${field}.maxPoints is invalid`);
      assertDenseArray(criterion.levels, `${field}.levels`);
      if (criterion.levels.length < 2) fail(`${field}.levels requires at least two levels`);
      criterion.levels.forEach(function (level, levelIndex) {
        const levelField = `${field}.levels[${levelIndex}]`;
        requireRecord(level, levelField);
        assertKnownFields(level, LEVEL_FIELDS, levelField);
        if (!rubric.allowedPointIncrements.includes(level.points) || level.points > criterion.maxPoints) fail(`${levelField}.points is invalid`);
        validateLocales(level.observableEvidenceByLocale, `${levelField}.observableEvidenceByLocale`);
      });
      if (new Set(criterion.levels.map(function (level) { return level.points; })).size !== criterion.levels.length) fail(`${field}.levels contains duplicate point values`);
      if (!criterion.levels.some(function (level) { return level.points === 0; }) ||
          !criterion.levels.some(function (level) { return level.points === criterion.maxPoints; })) {
        fail(`${field}.levels must include zero and criterion maxPoints`);
      }
      assertDenseArray(criterion.requiredEvidence, `${field}.requiredEvidence`);
      if (!criterion.requiredEvidence.length) fail(`${field}.requiredEvidence is required`);
      criterion.requiredEvidence.forEach(function (entry, index) { requireText(entry, `${field}.requiredEvidence[${index}]`); });
      assertDenseArray(criterion.errorCodes, `${field}.errorCodes`);
      if (!criterion.errorCodes.length) fail(`${field}.errorCodes is required`);
      criterion.errorCodes.forEach(function (entry, index) { requireText(entry, `${field}.errorCodes[${index}]`, /^[a-z][a-z0-9-]{1,63}$/); });
    });
    if (new Set(rubric.criteria.map(function (criterion) { return criterion.criterionId; })).size !== rubric.criteria.length) fail("rubric criterion ids contain duplicates");
    const criterionTotal = rubric.criteria.reduce(function (sum, criterion) { return sum + criterion.maxPoints; }, 0);
    if (criterionTotal !== rubric.maxPoints) fail("rubric criterion points must sum to maxPoints");
    if (rubric.humanReviewRequired !== true) fail("rubric.humanReviewRequired must be true");
    if (rubric.secondReviewPolicy !== "boundary-and-high-stakes-required") fail("rubric.secondReviewPolicy is invalid");
    if (rubric.state !== "in-review") fail("rubric.state must remain in-review until server release");
    return true;
  }

  function validateRightsRecord(record, item, asset) {
    requireRecord(record, "rightsRecord");
    assertKnownFields(record, RIGHTS_FIELDS, "rightsRecord");
    if (record.schemaVersion !== SCHEMA_VERSION) fail("rightsRecord.schemaVersion is unsupported");
    const expectedRightsId = asset ? asset.rightsRecordId : item.rightsRecordId;
    if (record.rightsRecordId !== expectedRightsId) fail("rightsRecord id must match its item or asset target");
    if (record.itemId !== item.itemId || record.itemVersion !== item.itemVersion) fail("rightsRecord must match the item revision");
    if ((asset && record.assetId !== asset.assetId) || (!asset && record.assetId != null)) fail("rightsRecord.assetId must match its target");
    if (!Number.isInteger(record.rightsVersion) || record.rightsVersion < 1) fail("rightsRecord.rightsVersion must be positive");
    requireHash(record.rightsRecordSha256, "rightsRecord.rightsRecordSha256");
    if (!RIGHTS_MODES.includes(record.mode)) fail("rightsRecord.mode is invalid");
    ["originType", "authority", "sourceTitle", "documentRevision", "sourceLocator", "reviewedBy"].forEach(function (field) { requireText(record[field], `rightsRecord.${field}`); });
    if (record.sourceUrl != null) requireHttpsUrl(record.sourceUrl, "rightsRecord.sourceUrl");
    if (record.licenseId != null) requireText(record.licenseId, "rightsRecord.licenseId");
    if (record.licenseUrl != null) requireHttpsUrl(record.licenseUrl, "rightsRecord.licenseUrl");
    if (record.permissionRecordId != null) requireText(record.permissionRecordId, "rightsRecord.permissionRecordId");
    if (record.attribution != null) requireText(record.attribution, "rightsRecord.attribution");
    assertDenseArray(record.allowedScopes, "rightsRecord.allowedScopes");
    if (!record.allowedScopes.length) fail("rightsRecord.allowedScopes is required");
    record.allowedScopes.forEach(function (scope) {
      if (!["web-public", "authenticated", "print", "translation", "derivative"].includes(scope)) fail(`rightsRecord scope is invalid: ${scope}`);
    });
    if (new Set(record.allowedScopes).size !== record.allowedScopes.length) fail("rightsRecord.allowedScopes contains duplicates");
    if (typeof record.translationAllowed !== "boolean" || typeof record.derivativeAllowed !== "boolean") fail("rightsRecord translation and derivative flags are required");
    requireTimestamp(record.reviewedAt, "rightsRecord.reviewedAt");
    if (record.expiresAt != null) requireTimestamp(record.expiresAt, "rightsRecord.expiresAt");
    if (record.decision !== "approved") fail("rightsRecord.decision must be approved");
    if (record.mode === "permission_required" || record.mode === "provenance_review" || record.mode === "noncommercial_reference") {
      fail(`rights mode ${record.mode} cannot release an item`);
    }
    if (record.mode === "permissive_reviewed" && (!record.licenseId || !record.licenseUrl)) fail("permissive rights require a license id and URL");
    if (record.mode === "private_licensed" && !record.permissionRecordId && (!record.licenseId || !record.licenseUrl)) {
      fail("private licensed rights require a license or permission record");
    }
    if (item.visibilityClass === "public-practice" && !["owned_original", "permissive_reviewed"].includes(record.mode)) fail("public practice requires reviewed public rights");
    const requiredScope = item.visibilityClass === "public-practice" ? "web-public" : "authenticated";
    if (!record.allowedScopes.includes(requiredScope)) fail(`rightsRecord must allow ${requiredScope}`);
    if (!record.translationAllowed || !record.allowedScopes.includes("translation")) fail("bilingual item release requires translation rights");
    if (record.originType !== "gfield-authored" && (!record.derivativeAllowed || !record.allowedScopes.includes("derivative"))) {
      fail("adapted source release requires derivative rights");
    }
    return true;
  }

  function validateReview(record, item, privateSpec, rightsById) {
    requireRecord(record, "reviewRecord");
    assertKnownFields(record, REVIEW_FIELDS, "reviewRecord");
    if (record.schemaVersion !== SCHEMA_VERSION) fail("reviewRecord.schemaVersion is unsupported");
    requireText(record.reviewId, "reviewRecord.reviewId", /^rvw-bnk-[a-z0-9]{16}$/);
    requireHash(record.reviewRecordSha256, "reviewRecord.reviewRecordSha256");
    if (!REVIEW_TYPES.includes(record.type)) fail("reviewRecord.type is invalid");
    if (record.decision !== "approved") fail("reviewRecord.decision must be approved");
    ["authorId", "reviewerId", "reviewerRole", "evidenceRef"].forEach(function (field) { requireText(record[field], `reviewRecord.${field}`); });
    requireTimestamp(record.reviewedAt, "reviewRecord.reviewedAt");
    if (record.itemId !== item.itemId || record.itemVersion !== item.itemVersion) fail("reviewRecord must match the item revision");
    if (record.reviewedPublicHash !== item.publicPayloadSha256) fail("reviewRecord public hash does not match");
    if (record.authorId === record.reviewerId) fail(`${record.type} requires an independent reviewer`);
    const roleByType = {
      "math-correctness": "math-reviewer", "answer-uniqueness": "math-reviewer",
      "age-appropriateness": "curriculum-reviewer", "translation-ko": "translator-reviewer",
      "translation-en": "translator-reviewer", "translation-zh-Hans": "translator-reviewer",
      rights: "rights-reviewer", "asset-rights": "rights-reviewer", "scoring-rubric": "scoring-reviewer",
      "visual-evidence": "visual-reviewer"
    };
    if (record.reviewerRole !== roleByType[record.type]) fail(`reviewerRole does not match ${record.type}`);
    if (["math-correctness", "answer-uniqueness", "scoring-rubric"].includes(record.type) && record.reviewedPrivateHash !== privateSpec.privateSpecSha256) {
      fail(`${record.type} private hash does not match`);
    }
    if (record.type === "scoring-rubric") {
      if (record.reviewedRubricHash !== privateSpec.rubricSha256) fail("scoring review rubric hash does not match");
    } else if (record.reviewedRubricHash != null) fail("only scoring-rubric review may bind a rubric hash");
    if (record.type.startsWith("translation-") && record.locale !== record.type.slice("translation-".length)) fail("translation review locale does not match its type");
    if (!record.type.startsWith("translation-") && record.locale != null) fail("non-translation review must not declare a locale");
    if (["rights", "asset-rights"].includes(record.type)) {
      requireText(record.rightsRecordId, "reviewRecord.rightsRecordId", /^rgt-bnk-[a-z0-9]{16}$/);
      const reviewedRights = rightsById && rightsById.get(record.rightsRecordId);
      if (!reviewedRights || record.reviewedRightsHash !== reviewedRights.rightsRecordSha256) fail("rights review hash does not match a supplied rights record");
      if (record.type === "rights" && reviewedRights.assetId != null) fail("item rights review cannot target an asset");
      if (record.type === "asset-rights" && reviewedRights.assetId == null) fail("asset rights review must target an asset");
    } else if (record.rightsRecordId != null || record.reviewedRightsHash != null) fail("non-rights review must not declare rights bindings");
    return true;
  }

  function requiredReviewTypes(item) {
    const required = ["math-correctness", "age-appropriateness", "answer-uniqueness", "translation-ko", "translation-en", "rights", "scoring-rubric"];
    if (item.promptBlocks.some(function (block) { return block.type === "diagram"; })) required.push("visual-evidence", "asset-rights");
    const hasChinese = JSON.stringify(item).includes('"zh-Hans"');
    if (hasChinese) required.push("translation-zh-Hans");
    return required;
  }

  function evaluateStructuralEligibility(bundle) {
    requireRecord(bundle, "releaseBundle");
    assertKnownFields(bundle, ["publicItem", "privateSpec", "rubric", "rightsRecord", "assetRightsRecords", "reviews"], "releaseBundle");
    validatePublicItem(bundle.publicItem);
    validatePrivateSpec(bundle.privateSpec, bundle.publicItem);
    validateRubric(bundle.rubric, bundle.publicItem, bundle.privateSpec);
    validateRightsRecord(bundle.rightsRecord, bundle.publicItem);
    assertDenseArray(bundle.assetRightsRecords, "releaseBundle.assetRightsRecords");
    if (bundle.assetRightsRecords.length !== bundle.publicItem.assets.length) fail("every asset requires exactly one supplied rights record");
    bundle.publicItem.assets.forEach(function (asset) {
      const matches = bundle.assetRightsRecords.filter(function (record) { return record.rightsRecordId === asset.rightsRecordId; });
      if (matches.length !== 1) fail(`asset ${asset.assetId} requires exactly one rights record`);
      validateRightsRecord(matches[0], bundle.publicItem, asset);
    });
    const allRights = [bundle.rightsRecord].concat(bundle.assetRightsRecords);
    if (new Set(allRights.map(function (record) { return record.rightsRecordId; })).size !== allRights.length) fail("rights record ids contain duplicates");
    const rightsById = new Map(allRights.map(function (record) { return [record.rightsRecordId, record]; }));
    assertDenseArray(bundle.reviews, "releaseBundle.reviews");
    bundle.reviews.forEach(function (review) { validateReview(review, bundle.publicItem, bundle.privateSpec, rightsById); });
    if (new Set(bundle.reviews.map(function (review) { return review.reviewId; })).size !== bundle.reviews.length) fail("review ids contain duplicates");
    requiredReviewTypes(bundle.publicItem).forEach(function (type) {
      if (!bundle.reviews.some(function (review) { return review.type === type; })) fail(`missing required review: ${type}`);
    });
    bundle.publicItem.assets.forEach(function (asset) {
      if (!bundle.reviews.some(function (review) { return review.type === "asset-rights" && review.rightsRecordId === asset.rightsRecordId; })) {
        fail(`asset ${asset.assetId} is missing its rights review`);
      }
    });
    allRights.forEach(function (record) {
      if (record.expiresAt && new Date(record.expiresAt) <= new Date(record.reviewedAt)) fail("rightsRecord expires before or at its review time");
    });
    return Object.freeze({
      state: "structurally-ready-for-authenticated-signer-verification",
      itemId: bundle.publicItem.itemId,
      itemVersion: bundle.publicItem.itemVersion,
      visibilityClass: bundle.publicItem.visibilityClass,
      publicPayloadSha256: bundle.publicItem.publicPayloadSha256,
      privateSpecSha256: bundle.privateSpec.privateSpecSha256,
      automaticRelease: false,
      requiresAuthenticatedSigner: true,
      requiresAuthenticatedDelivery: bundle.publicItem.visibilityClass !== "public-practice",
      requiresCryptographicSignature: true,
      requiredSignerChecks: Object.freeze([
        "canonical-public-private-rights-rubric-review-sha256", "trusted-current-time-rights-expiry",
        "database-author-reviewer-role-and-evidence", "asset-byte-hash-and-sanitization", "answer-leakage-scan",
        "release-manifest-signature"
      ])
    });
  }

  function buildLockedGitHubPublicPracticeCandidate(bundle) {
    const decision = evaluateStructuralEligibility(bundle);
    if (bundle.publicItem.visibilityClass !== "public-practice") fail("GitHub public candidate accepts public-practice items only");
    return Object.freeze({
      itemId: bundle.publicItem.itemId,
      itemVersion: bundle.publicItem.itemVersion,
      publicPayloadSha256: bundle.publicItem.publicPayloadSha256,
      state: "locked-awaiting-verified-signed-public-release-manifest",
      structuralEligibility: decision.state,
      publicPayloadIncluded: false,
      automaticExport: false
    });
  }

  function buildLockedBlueprintCandidate(bundle, purpose) {
    const decision = evaluateStructuralEligibility(bundle);
    if (!ASSESSMENT_PURPOSES.includes(purpose)) fail("assessment purpose is invalid");
    if (bundle.publicItem.visibilityClass !== "authenticated-assessment") {
      fail("student blueprint candidates must use authenticated-assessment visibility");
    }
    if (bundle.publicItem.visibilityClass === "authenticated-assessment" && purpose !== bundle.publicItem.assessmentBinding.purpose) {
      fail("assessment purpose must match the signed public item binding");
    }
    const assessmentBinding = bundle.publicItem.assessmentBinding == null ? null : Object.freeze({
      blueprintId: bundle.publicItem.assessmentBinding.blueprintId,
      blueprintVersion: bundle.publicItem.assessmentBinding.blueprintVersion,
      blueprintContractSha256: bundle.publicItem.assessmentBinding.blueprintContractSha256,
      purpose: bundle.publicItem.assessmentBinding.purpose,
      slotId: bundle.publicItem.assessmentBinding.slotId,
      unitId: bundle.publicItem.assessmentBinding.unitId,
      standardRange: bundle.publicItem.assessmentBinding.standardRange
    });
    return Object.freeze({
      itemId: bundle.publicItem.itemId,
      purpose,
      assessmentBinding,
      itemVersion: bundle.publicItem.itemVersion,
      publicRevisionId: bundle.publicItem.publicRevisionId,
      publicPayloadSha256: bundle.publicItem.publicPayloadSha256,
      scoringSpecId: bundle.privateSpec.scoringSpecId,
      scoringSpecVersion: bundle.privateSpec.specVersion,
      privateSpecSha256: bundle.privateSpec.privateSpecSha256,
      rubricId: bundle.privateSpec.rubricId,
      rubricVersion: bundle.privateSpec.rubricVersion,
      rubricSha256: bundle.privateSpec.rubricSha256,
      rightsRecordId: bundle.rightsRecord.rightsRecordId,
      rightsVersion: bundle.rightsRecord.rightsVersion,
      rightsRecordSha256: bundle.rightsRecord.rightsRecordSha256,
      visibilityClass: bundle.publicItem.visibilityClass,
      releaseId: null,
      releaseManifestId: null,
      assetRevisionBindings: Object.freeze(bundle.publicItem.assets.map(function (asset) {
        const rights = bundle.assetRightsRecords.find(function (record) { return record.rightsRecordId === asset.rightsRecordId; });
        return Object.freeze({
          assetId: asset.assetId,
          assetSha256: asset.sha256,
          rightsRecordId: rights.rightsRecordId,
          rightsVersion: rights.rightsVersion,
          rightsRecordSha256: rights.rightsRecordSha256
        });
      })),
      reviewBindings: Object.freeze(bundle.reviews.map(function (review) {
        return Object.freeze({
          reviewId: review.reviewId,
          reviewRecordSha256: review.reviewRecordSha256,
          type: review.type,
          reviewedPublicHash: review.reviewedPublicHash,
          reviewedPrivateHash: review.reviewedPrivateHash,
          reviewedRubricHash: review.reviewedRubricHash,
          rightsRecordId: review.rightsRecordId,
          reviewedRightsHash: review.reviewedRightsHash
        });
      })),
      skillId: bundle.publicItem.skillId,
      domainId: bundle.publicItem.domainId,
      maxPoints: bundle.publicItem.maxPoints,
      responseType: bundle.publicItem.responseType,
      difficulty: bundle.publicItem.difficulty,
      scoringMode: bundle.privateSpec.scoringMode,
      reviewState: "pending-authenticated-signer-verification",
      structuralEligibility: decision.state
    });
  }

  return Object.freeze({
    SCHEMA_VERSION,
    VISIBILITY_CLASSES,
    RESPONSE_TYPES,
    DIFFICULTIES,
    ASSESSMENT_PURPOSES,
    RIGHTS_MODES,
    REVIEW_TYPES,
    validatePublicItem,
    validatePrivateSpec,
    validateRubric,
    validateRightsRecord,
    validateReview,
    requiredReviewTypes,
    evaluateStructuralEligibility,
    buildLockedGitHubPublicPracticeCandidate,
    buildLockedBlueprintCandidate
  });
});
