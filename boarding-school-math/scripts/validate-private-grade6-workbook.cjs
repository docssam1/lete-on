#!/usr/bin/env node
"use strict";

/*
 * Local-only preflight for Grade 6 instructional workbook drafts.
 *
 * The draft root must be explicit and outside this Git worktree. The public
 * repository contains this validator and no workbook prompt, answer, teacher
 * guide, asset, PDF, or export. A structural pass is never a rights, math,
 * translation, or release approval.
 */

const fs = require("node:fs");
const path = require("node:path");
const registry = require("../curriculum/us-k8-content-registry.js");
const resourcePlans = require("../resources/k8-resource-plan.js");

const SCHEMA_VERSION = "gfield-private-workbook-draft-v1";
const CONFIDENTIALITY_MARKER = "GFIELD_PRIVATE_WORKBOOK_DO_NOT_COMMIT";
const DRAFT_STATE = "draft-pending-independent-review";
const PRODUCTION_STATE = "local-draft-no-pdf-or-download";
const LOCAL_BINDING_STATE = "candidate-not-public-bound";
const REQUIRED_REVIEWS = Object.freeze([
  "math-correctness", "age-appropriateness", "answer-uniqueness",
  "translation-ko", "translation-en", "translation-zh-Hans", "rights"
]);
const PACK_KEYS = new Set([
  "schemaVersion", "confidentiality", "packId", "packVersion", "programId", "targetGrade", "unitId", "clusterId",
  "skillId", "resourcePlanId", "cadenceProfileId", "state", "coverageState", "deliveryState", "localePolicy",
  "frontMatter", "studentSections", "teacherArtifacts", "homeStudyPlan", "assessmentPlaceholders", "closingMatter",
  "rightsDraft", "verification", "layoutPlan"
]);
const LOCALE_POLICY_KEYS = new Set(["required", "included"]);
const FRONT_MATTER_KEYS = new Set(["titleByLocale", "learningTargetsByLocale", "howToUseByLocale"]);
const CLOSING_MATTER_KEYS = new Set(["glossaryByLocale", "retentionNoticeByLocale"]);
const HOME_BLOCK_KEYS = new Set(["blockId", "week", "sequence", "minutes", "componentIds"]);
const SECTION_KEYS = new Set([
  "sectionId", "sectionVersion", "audience", "titleByLocale", "resourceBinding", "productionState", "components"
]);
const ARTIFACT_KEYS = new Set([
  "artifactId", "artifactVersion", "audience", "titleByLocale", "resourceBinding", "productionState", "components",
  "lessonSegments", "answerReferences"
]);
const BINDING_KEYS = new Set([
  "resourcePlanItemId", "courseId", "unitId", "skillId", "sessionId", "audience", "levelId", "testType",
  "resourceType", "bindingState"
]);
const STUDENT_COMPONENT_KEYS = new Set([
  "componentId", "componentType", "sequence", "contentByLocale", "responseMode", "teacherReferenceId"
]);
const TEACHER_COMPONENT_KEYS = new Set(["componentId", "componentType", "sequence", "contentByLocale"]);
const SEGMENT_KEYS = new Set(["segmentId", "sequence", "minutes", "instructionByLocale"]);
const REFERENCE_KEYS = new Set([
  "referenceId", "componentId", "responseMode", "expectedResponse", "solutionByLocale", "uniquenessProofByLocale",
  "arithmeticCheck"
]);
const PLACEHOLDER_KEYS = new Set([
  "resourcePlanItemId", "sessionId", "levelId", "testType", "resourceType", "status"
]);
const RIGHTS_KEYS = new Set([
  "mode", "originType", "authority", "translationAllowed", "derivativeAllowed", "externalSourceUsed",
  "contestWordingUsed", "decision"
]);
const VERIFICATION_KEYS = new Set([
  "authorMathCheck", "authorTranslationCheck", "authorRightsCheck", "requiredReviews", "releaseState"
]);
const LAYOUT_KEYS = new Set([
  "studentTargetPages", "teacherTargetPages", "frontMatterPages", "closingPages", "studentSectionLayouts",
  "teacherArtifactLayouts"
]);
const LAYOUT_ENTRY_KEYS = new Set(["id", "startPage", "endPage"]);
const RESPONSE_MODES = new Set(["ratio-canonical", "numeric-exact", "comparison-symbol-exact"]);
const TEACHING_COMPONENT_TYPES = new Set(["concept-summary", "worked-example"]);
const ANSWER_REVEALING_TEXT = /(?:정답|답|correct\s+answer|\bans(?:wer)?|正确答案|答案|答|결과|result|结果|풀이|solution|解答)/iu;
const ANSWER_VALUE_LABEL = /(?:correct\s+answer|\bans(?:wer)?|정답|답|正确答案|答案|答|결과|result|结果|풀이|solution|解答)/giu;
const ANSWER_VALUE_GRAMMAR_CONNECTOR = /^\s*(?:은|는|is|are|equals?|是|为)\s*/iu;
const ANSWER_VALUE_SEPARATOR = /^(?:[\s\p{P}\p{S}\p{C}\p{M}\p{Z}])+/u;
const ANSWER_VALUE_WRAPPER = /^(?:[\[("“‘]+\s*)+/u;
const HTML_TAG = /<[A-Za-z/!][^>]*>/u;
const HTML_ENTITY = /&(?:#(?:x[0-9a-f]+|\d+)|[a-z][a-z0-9]+);/iu;
const SAFE_STUDENT_TEX_COMMANDS = new Set([
  "boxed", "cdot", "displaystyle", "div", "dfrac", "frac", "left", "mathit", "mathbf", "mathrm", "mathsf", "mathtt",
  "operatorname", "overline", "right", "sqrt", "text", "tfrac", "times", "underline"
]);
const SAFE_COMPARISON_PROMPT_MATH_SYMBOLS = new Set(["+", "-", "/", "|"]);
const RESPONSE_TEXT_LOCALE_PATTERNS = Object.freeze({
  en: /^[\p{Script=Latin}\p{Script=Common}\p{Script=Inherited}]*$/u,
  ko: /^[\p{Script=Hangul}\p{Script=Han}\p{Script=Latin}\p{Script=Common}\p{Script=Inherited}]*$/u,
  "zh-Hans": /^[\p{Script=Han}\p{Script=Latin}\p{Script=Common}\p{Script=Inherited}]*$/u
});

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

function assert(condition, code, reference) {
  if (!condition) fail(code, reference);
}

function isRecord(value) {
  return !!value && typeof value === "object" && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;
}

function nonBlankText(value) {
  return typeof value === "string" && value.length > 0 && value.trim() === value;
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
  const keys = Object.getOwnPropertyNames(value);
  assert(
    Object.getOwnPropertySymbols(value).length === 0 &&
    keys.every(function (key) {
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      return allowed.has(key) && descriptor && Object.prototype.hasOwnProperty.call(descriptor, "value");
    }),
  code, reference);
}

function assertExactDataKeys(value, expected, code, reference) {
  assertOnlyKeys(value, new Set(expected), code, reference);
  assert(Object.getOwnPropertyNames(value).length === expected.length, code, reference);
}

function ownDataValue(value, key, code, reference) {
  const descriptor = Object.getOwnPropertyDescriptor(value, key);
  assert(descriptor && Object.prototype.hasOwnProperty.call(descriptor, "value"), code, reference);
  return descriptor.value;
}

function assertId(value, prefix, code, reference) {
  assert(typeof value === "string" && new RegExp(`^${prefix}[a-z0-9][a-z0-9-]{3,79}$`).test(value), code, reference);
}

function requireLocales(value, policy, code, reference) {
  assertOnlyKeys(value, new Set(policy.included), code, reference);
  policy.required.forEach(function (locale) { assert(nonBlankText(value[locale]), code, reference); });
  policy.included.forEach(function (locale) { assert(nonBlankText(value[locale]), code, reference); });
}

function requireStudentVisibleLocales(value, policy, code, reference) {
  requireLocales(value, policy, code, reference);
  Object.entries(value).forEach(function (entry) {
    assertStudentVisibleTextIsNeutral(entry[1], entry[0], reference);
  });
}

function normalizeForAnswerLeakScan(value) {
  return String(value)
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\\(?:boxed|text|mathrm|displaystyle)\s*\{([^{}]*)\}/gu, "$1")
    .replace(/\\colon\b/gu, ":")
    .replace(/\\(?:longrightarrow|rightarrow|longmapsto|mapsto|implies|to)\b/gu, " ")
    .replace(/\\[a-z]+\*?/giu, " ")
    .replace(/[\\${}]/gu, " ")
    .replace(/[\p{C}\p{M}]/gu, "")
    .replace(/[\u2010-\u2015\u2212\u2796\uFE58\uFE63\uFF0D]/gu, "-")
    .replace(/[\u2044\u2215\u29F8\uFF0F]/gu, "/")
    .replace(/\s+/gu, " ")
    .replace(/[\u2236\u22EE\uA789\uFE13\uFE55\uFF1A]/gu, ":")
    .replace(/\s*([:/])\s*/gu, "$1")
    .replace(/([+-])\s*(?=[0-9])/gu, "$1")
    .trim();
}

function normalizeForAnswerLabelScan(value) {
  // A TeX spacing command such as `\\!` is visually a zero/negative-width
  // separator. Text-display commands are likewise absent to a reader, so
  // retain their payload for the label scan.
  const labelNormalized = String(value)
    .normalize("NFKC")
    .replace(/\\(?:boxed|text|mathrm|mathit|mathbf|mathsf|mathtt|operatorname)\s*\{([^{}]*)\}/giu, "$1");
  return normalizeForAnswerLeakScan(labelNormalized).replace(/[\p{P}\p{S}\p{C}\p{M}\p{Z}]/gu, "");
}

function assertStudentVisibleTextSyntax(content, locale, reference) {
  const value = String(content);
  const compatibilityNormalized = value.normalize("NFKC");
  // Student-visible text may keep TeX in an explicitly non-response worked
  // example, but it never accepts HTML/entity recovery or invisible controls.
  assert(!HTML_TAG.test(value) && !HTML_ENTITY.test(value) && !/&/u.test(value) &&
    !HTML_TAG.test(compatibilityNormalized) && !HTML_ENTITY.test(compatibilityNormalized) && !/&/u.test(compatibilityNormalized),
  "STUDENT_MARKUP_UNSUPPORTED", reference);
  [value, compatibilityNormalized].forEach(function (candidate) {
    // Worked examples may use a deliberately small mathematical TeX subset.
    // Every other command (including invisible/layout or Unicode-escape
    // commands) is rejected rather than trying to blacklist all renderers.
    const matcher = /\\([A-Za-z]+)\*?/gu;
    let match;
    while ((match = matcher.exec(candidate))) {
      assert(SAFE_STUDENT_TEX_COMMANDS.has(match[1].toLowerCase()), "STUDENT_TEX_UNSUPPORTED", reference);
    }
    assert(!/\\(?![A-Za-z])/u.test(candidate), "STUDENT_TEX_UNSUPPORTED", reference);
  });
  assert(!/[\p{C}\p{M}]/u.test(value) && !/[\p{C}\p{M}]/u.test(compatibilityNormalized), "STUDENT_CHARACTER_UNSUPPORTED", reference);
  if (locale != null) {
    const allowed = RESPONSE_TEXT_LOCALE_PATTERNS[locale];
    assert(allowed && allowed.test(value) && allowed.test(compatibilityNormalized), "STUDENT_CHARACTER_UNSUPPORTED", reference);
  }
}

function assertStudentAnswerLabelAbsent(value, reference) {
  const normalizedContent = normalizeForAnswerLeakScan(value);
  const compactLabelContent = normalizeForAnswerLabelScan(value);
  assert(!ANSWER_REVEALING_TEXT.test(normalizedContent) && !ANSWER_REVEALING_TEXT.test(compactLabelContent), "STUDENT_ANSWER_LEAK", reference);
  return normalizedContent;
}

function assertStudentVisibleTextIsNeutral(content, locale, reference) {
  assertStudentVisibleTextSyntax(content, locale, reference);
  assertStudentAnswerLabelAbsent(content, reference);
}

function assertStudentNeutralId(value, prefix, code, reference) {
  assertId(value, prefix, code, reference);
  assertStudentAnswerLabelAbsent(value, reference);
}

function assertResponseStudentTextSyntax(content, locale, reference) {
  // Response blocks are deliberately plain text. Reject every ampersand rather
  // than trying to mirror browser-specific named/numeric entity recovery
  // rules, including semicolon-less numeric forms such as `&#115`.
  assertStudentVisibleTextSyntax(content, locale, reference);
  const value = String(content);
  const compatibilityNormalized = value.normalize("NFKC");
  assert(!/[\\]/u.test(value) && !/[\\]/u.test(compatibilityNormalized), "STUDENT_TEX_UNSUPPORTED", reference);
}

function answerValueBoundary(nextCharacter) {
  return nextCharacter === "" || /\s/u.test(nextCharacter) || ",.;!?%()]}\"'”’".includes(nextCharacter);
}

function disclosedResponseStartsCandidate(candidate, normalizedResponse) {
  if (candidate.startsWith(normalizedResponse)) {
    return answerValueBoundary(candidate.slice(normalizedResponse.length, normalizedResponse.length + 1));
  }
  const ratio = /^([1-9][0-9]*):([1-9][0-9]*)$/.exec(normalizedResponse);
  if (!ratio) return false;
  const ratioWithVariantSeparator = new RegExp(`^${ratio[1]}(?:[\\s\\p{P}\\p{S}])+${ratio[2]}`, "u");
  const match = ratioWithVariantSeparator.exec(candidate);
  return !!match && answerValueBoundary(candidate.slice(match[0].length, match[0].length + 1));
}

function containsStandaloneExpectedResponse(normalizedContent, normalizedResponse) {
  // A response-bearing student string must never contain the exact canonical
  // response as a visible token. Looking only after a small list of labels is
  // not sufficient: an author can disclose a value bare or after a synonym
  // such as "final value". Only digits and joined numeric notation can make
  // a numeric occurrence part of a larger condition: Hangul, Han, and Latin
  // text may attach directly to a visible number and must not shield a leak.
  let index = normalizedContent.indexOf(normalizedResponse);
  while (index !== -1) {
    const before = index === 0 ? "" : normalizedContent[index - 1];
    const afterIndex = index + normalizedResponse.length;
    const after = afterIndex >= normalizedContent.length ? "" : normalizedContent[afterIndex];
    const beforeNeighbor = index < 2 ? "" : normalizedContent[index - 2];
    const afterNeighbor = afterIndex + 1 >= normalizedContent.length ? "" : normalizedContent[afterIndex + 1];
    const joinsNumericTokenBefore = ".,:/".includes(before) && /[0-9]/u.test(beforeNeighbor);
    const joinsNumericTokenAfter = ".,:/".includes(after) && /[0-9]/u.test(afterNeighbor);
    const numericContinuation = /\p{N}/u.test(after) || joinsNumericTokenAfter;
    const positiveEquivalentPrefix = before === "+";
    const negativeZeroEquivalentPrefix = before === "-" && normalizedResponse === "0";
    if ((positiveEquivalentPrefix || negativeZeroEquivalentPrefix) && !numericContinuation) return true;
    const distinctNegativePrefix = before === "-" && normalizedResponse !== "0";
    const embedded = /\p{N}/u.test(before) || /\p{N}/u.test(after) || joinsNumericTokenBefore || joinsNumericTokenAfter || distinctNegativePrefix;
    if (!embedded) return true;
    index = normalizedContent.indexOf(normalizedResponse, index + 1);
  }
  return false;
}

function assertStudentContentDoesNotRevealAnswer(content, expectedResponse, reference, locale) {
  const normalizedContent = assertStudentAnswerLabelAbsent(content, reference);
  // Response-bearing student blocks accept plain text only until content is
  // separated into validated text and math blocks with an explicit allowlist.
  assertResponseStudentTextSyntax(content, locale, reference);
  const normalizedResponse = normalizeForAnswerLeakScan(expectedResponse);
  assert(nonBlankText(normalizedResponse), "STUDENT_ANSWER_LEAK", reference);
  if (["<", ">"].includes(normalizedResponse)) {
    const hasUnsupportedMathSymbol = Array.from(normalizedContent).some(function (symbol) {
      return /\p{Sm}/u.test(symbol) && !SAFE_COMPARISON_PROMPT_MATH_SYMBOLS.has(symbol);
    });
    assert(!hasUnsupportedMathSymbol, "STUDENT_ANSWER_LEAK", reference);
  } else {
    assert(!containsStandaloneExpectedResponse(normalizedContent, normalizedResponse), "STUDENT_ANSWER_LEAK", reference);
  }
  ANSWER_VALUE_LABEL.lastIndex = 0;
  let label;
  while ((label = ANSWER_VALUE_LABEL.exec(normalizedContent))) {
    let candidate = normalizedContent.slice(label.index + label[0].length);
    candidate = candidate.replace(ANSWER_VALUE_GRAMMAR_CONNECTOR, "").replace(ANSWER_VALUE_SEPARATOR, "").replace(ANSWER_VALUE_WRAPPER, "");
    assert(!disclosedResponseStartsCandidate(candidate, normalizedResponse), "STUDENT_ANSWER_LEAK", reference);
  }
}

function validateLocalePolicy(policy, reference) {
  assertOnlyKeys(policy, LOCALE_POLICY_KEYS, "LOCALE_POLICY_INVALID", reference);
  assertDenseArray(policy.required, "LOCALE_POLICY_INVALID", reference);
  assertDenseArray(policy.included, "LOCALE_POLICY_INVALID", reference);
  assert(JSON.stringify(policy.required) === JSON.stringify(["ko", "en"]), "LOCALE_POLICY_INVALID", reference);
  assert(policy.included.length >= 2 && policy.included.length <= 3, "LOCALE_POLICY_INVALID", reference);
  assert(policy.included[0] === "ko" && policy.included[1] === "en", "LOCALE_POLICY_INVALID", reference);
  if (policy.included.length === 3) assert(policy.included[2] === "zh-Hans", "LOCALE_POLICY_INVALID", reference);
  assert(new Set(policy.included).size === policy.included.length, "LOCALE_POLICY_INVALID", reference);
}

function localReference(value, fallback) {
  return value && typeof value === "string" ? value : fallback;
}

function standardUnit(pack, reference) {
  const unit = registry.units.find(function (candidate) { return candidate.unitId === pack.unitId; });
  assert(unit && unit.grade === 6, "WORKBOOK_UNIT_NOT_GRADE6", reference);
  const expectedSkillId = registry.skillIdForCluster(unit.clusterId);
  assert(pack.clusterId === unit.clusterId && pack.skillId === expectedSkillId, "WORKBOOK_LINEAGE_INVALID", reference);
  assert(pack.programId === registry.COURSE_ID && pack.targetGrade === 6, "WORKBOOK_LINEAGE_INVALID", reference);
  return unit;
}

function validateRightsDraft(rights, reference) {
  assertOnlyKeys(rights, RIGHTS_KEYS, "WORKBOOK_RIGHTS_DRAFT_INVALID", reference);
  assert(rights.mode === "owned_original" && rights.originType === "gfield-authored" && rights.authority === "GFIELD", "WORKBOOK_RIGHTS_DRAFT_INVALID", reference);
  assert(rights.translationAllowed === true && rights.derivativeAllowed === true, "WORKBOOK_RIGHTS_DRAFT_INVALID", reference);
  assert(rights.externalSourceUsed === false && rights.contestWordingUsed === false, "WORKBOOK_RIGHTS_DRAFT_INVALID", reference);
  assert(rights.decision === "pending-independent-review", "WORKBOOK_RIGHTS_DRAFT_INVALID", reference);
}

function validateVerification(verification, reference) {
  assertOnlyKeys(verification, VERIFICATION_KEYS, "WORKBOOK_VERIFICATION_INVALID", reference);
  ["authorMathCheck", "authorTranslationCheck", "authorRightsCheck"].forEach(function (field) {
    assert(verification[field] === "complete-not-independent", "WORKBOOK_VERIFICATION_INVALID", reference);
  });
  assertDenseArray(verification.requiredReviews, "WORKBOOK_VERIFICATION_INVALID", reference);
  assert(JSON.stringify(verification.requiredReviews) === JSON.stringify(REQUIRED_REVIEWS), "WORKBOOK_VERIFICATION_INVALID", reference);
  assert(verification.releaseState === "not-eligible", "WORKBOOK_VERIFICATION_INVALID", reference);
}

function validateFrontMatter(frontMatter, policy, reference) {
  assertOnlyKeys(frontMatter, FRONT_MATTER_KEYS, "FRONT_MATTER_INVALID", reference);
  ["titleByLocale", "learningTargetsByLocale", "howToUseByLocale"].forEach(function (field) {
    requireStudentVisibleLocales(frontMatter[field], policy, "FRONT_MATTER_INVALID", reference);
  });
}

function validateClosingMatter(closingMatter, policy, reference) {
  assertOnlyKeys(closingMatter, CLOSING_MATTER_KEYS, "CLOSING_MATTER_INVALID", reference);
  ["glossaryByLocale", "retentionNoticeByLocale"].forEach(function (field) {
    requireStudentVisibleLocales(closingMatter[field], policy, "CLOSING_MATTER_INVALID", reference);
  });
}

function findResource(plan, binding, reference) {
  assertOnlyKeys(binding, BINDING_KEYS, "RESOURCE_BINDING_INVALID", reference);
  const candidates = (plan.resourcesByAudience[binding.audience] || []).filter(function (resource) {
    return resource.resourcePlanItemId === binding.resourcePlanItemId;
  });
  assert(candidates.length === 1, "RESOURCE_BINDING_INVALID", reference);
  const resource = candidates[0];
  ["courseId", "unitId", "skillId", "sessionId", "audience", "levelId", "testType", "resourceType"].forEach(function (field) {
    assert(binding[field] === resource[field], "RESOURCE_BINDING_INVALID", reference);
  });
  assert(binding.bindingState === LOCAL_BINDING_STATE, "RESOURCE_BINDING_INVALID", reference);
  assert(resource.bindingState === resourcePlans.PLAN_STATES.unbound, "PUBLIC_RESOURCE_ALREADY_BOUND", reference);
  assert(resource.deliveryRequirement === (resource.audience === "student" ? "authenticated-student-only" : "authenticated-teacher-or-admin-only"), "RESOURCE_DELIVERY_BOUNDARY_INVALID", reference);
  return resource;
}

function componentCounts(components) {
  const counts = new Map();
  components.forEach(function (component) {
    counts.set(component.componentType, (counts.get(component.componentType) || 0) + 1);
  });
  return counts;
}

function assertPlannedComponentCounts(components, resource, reference) {
  const actual = componentCounts(components);
  const planned = new Map(resource.plannedComponents.map(function (component) { return [component.componentType, component.plannedCount]; }));
  assert(actual.size === planned.size, "PLANNED_COMPONENT_COUNT_MISMATCH", reference);
  planned.forEach(function (count, componentType) {
    assert(actual.get(componentType) === count, "PLANNED_COMPONENT_COUNT_MISMATCH", reference);
  });
}

function validateStudentComponent(component, policy, reference) {
  assertOnlyKeys(component, STUDENT_COMPONENT_KEYS, "STUDENT_COMPONENT_INVALID", reference);
  assertStudentNeutralId(component.componentId, "cmp-dft-", "STUDENT_COMPONENT_INVALID", reference);
  assert(Number.isInteger(component.sequence) && component.sequence > 0 && component.sequence <= 100, "STUDENT_COMPONENT_INVALID", reference);
  requireStudentVisibleLocales(component.contentByLocale, policy, "STUDENT_COMPONENT_INVALID", reference);
  const isTeachingBlock = TEACHING_COMPONENT_TYPES.has(component.componentType);
  if (isTeachingBlock) {
    assert(component.responseMode === null && component.teacherReferenceId === null, "STUDENT_COMPONENT_INVALID", reference);
  } else {
    assert(RESPONSE_MODES.has(component.responseMode), "STUDENT_COMPONENT_INVALID", reference);
    assertStudentNeutralId(component.teacherReferenceId, "ref-dft-", "STUDENT_COMPONENT_INVALID", reference);
    Object.entries(component.contentByLocale).forEach(function (entry) {
      const locale = entry[0];
      const content = entry[1];
      assertResponseStudentTextSyntax(content, locale, reference);
      assertStudentAnswerLabelAbsent(content, reference);
    });
  }
}

function validateStudentSection(section, plan, policy, seenSectionIds, seenComponentIds, expectedResources) {
  const reference = localReference(section && section.sectionId, "student-section");
  assertOnlyKeys(section, SECTION_KEYS, "STUDENT_SECTION_INVALID", reference);
  assertStudentNeutralId(section.sectionId, "sct-dft-", "STUDENT_SECTION_INVALID", reference);
  assert(!seenSectionIds.has(section.sectionId), "DUPLICATE_STUDENT_SECTION", reference);
  seenSectionIds.add(section.sectionId);
  assert(section.sectionVersion === 1 && section.audience === "student" && section.productionState === PRODUCTION_STATE, "STUDENT_SECTION_INVALID", reference);
  requireStudentVisibleLocales(section.titleByLocale, policy, "STUDENT_SECTION_INVALID", reference);
  const resource = findResource(plan, section.resourceBinding, reference);
  assert(resource.audience === "student", "STUDENT_SECTION_INVALID", reference);
  assert(expectedResources.has(resource.resourcePlanItemId), "STUDENT_RESOURCE_NOT_IN_SCOPE", reference);
  assertDenseArray(section.components, "STUDENT_SECTION_INVALID", reference);
  assertPlannedComponentCounts(section.components, resource, reference);
  const sequences = [];
  section.components.forEach(function (component) {
    validateStudentComponent(component, policy, localReference(component && component.componentId, reference));
    assert(!seenComponentIds.has(component.componentId), "DUPLICATE_STUDENT_COMPONENT", component.componentId);
    seenComponentIds.add(component.componentId);
    sequences.push(component.sequence);
  });
  assert(JSON.stringify(sequences.sort(function (left, right) { return left - right; })) === JSON.stringify(section.components.map(function (_component, index) { return index + 1; })), "STUDENT_COMPONENT_SEQUENCE_INVALID", reference);
  return Object.freeze({ resource, section });
}

function validateTeacherComponent(component, policy, reference) {
  assertOnlyKeys(component, TEACHER_COMPONENT_KEYS, "TEACHER_COMPONENT_INVALID", reference);
  assertId(component.componentId, "tcmp-dft-", "TEACHER_COMPONENT_INVALID", reference);
  assert(Number.isInteger(component.sequence) && component.sequence > 0 && component.sequence <= 100, "TEACHER_COMPONENT_INVALID", reference);
  requireLocales(component.contentByLocale, policy, "TEACHER_COMPONENT_INVALID", reference);
}

function validateLessonSegments(segments, artifact, policy, reference) {
  assertDenseArray(segments, "LESSON_SEGMENTS_INVALID", reference);
  if (artifact.resourceBinding.resourceType !== "lesson-plan") {
    assert(segments.length === 0, "LESSON_SEGMENTS_INVALID", reference);
    return;
  }
  assert(segments.length >= 4 && segments.length <= 8, "LESSON_SEGMENTS_INVALID", reference);
  const ids = new Set();
  const sequences = [];
  let totalMinutes = 0;
  segments.forEach(function (segment) {
    assertOnlyKeys(segment, SEGMENT_KEYS, "LESSON_SEGMENTS_INVALID", reference);
    assertId(segment.segmentId, "seg-dft-", "LESSON_SEGMENTS_INVALID", reference);
    assert(!ids.has(segment.segmentId), "LESSON_SEGMENTS_INVALID", reference);
    ids.add(segment.segmentId);
    assert(Number.isInteger(segment.sequence) && segment.sequence > 0, "LESSON_SEGMENTS_INVALID", reference);
    assert(Number.isInteger(segment.minutes) && segment.minutes >= 5 && segment.minutes <= 30, "LESSON_SEGMENTS_INVALID", reference);
    requireLocales(segment.instructionByLocale, policy, "LESSON_SEGMENTS_INVALID", reference);
    sequences.push(segment.sequence);
    totalMinutes += segment.minutes;
  });
  assert(JSON.stringify(sequences.sort(function (left, right) { return left - right; })) === JSON.stringify(segments.map(function (_segment, index) { return index + 1; })), "LESSON_SEGMENTS_INVALID", reference);
  assert(totalMinutes === resourcePlans.GRADE6_CADENCE.minutesPerSession, "LESSON_MINUTES_INVALID", reference);
}

function positiveInteger(value) {
  return Number.isSafeInteger(value) && value > 0 && value <= 1000000000;
}

function nonNegativeInteger(value) {
  return Number.isSafeInteger(value) && value >= 0 && value <= 1000000000;
}

function signedInteger(value) {
  return Number.isSafeInteger(value) && Math.abs(value) <= 1000000000;
}

function greatestCommonDivisor(left, right) {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b) {
    const next = a % b;
    a = b;
    b = next;
  }
  return a;
}

function greatestCommonDivisorBigInt(left, right) {
  let a = left < 0n ? -left : left;
  let b = right < 0n ? -right : right;
  while (b !== 0n) {
    const next = a % b;
    a = b;
    b = next;
  }
  return a;
}

function canonicalSignedRational(numerator, denominator, reference) {
  assert(denominator > 0n, "ARITHMETIC_CHECK_INVALID", reference);
  if (numerator === 0n) return "0";
  const negative = numerator < 0n;
  const absoluteNumerator = negative ? -numerator : numerator;
  const divisor = greatestCommonDivisorBigInt(absoluteNumerator, denominator);
  const reducedNumerator = absoluteNumerator / divisor;
  const reducedDenominator = denominator / divisor;
  const magnitude = reducedDenominator === 1n ? String(reducedNumerator) : `${reducedNumerator}/${reducedDenominator}`;
  return negative ? `-${magnitude}` : magnitude;
}

function canonicalRational(numerator, denominator, reference) {
  assert(numerator >= 0n, "ARITHMETIC_CHECK_INVALID", reference);
  return canonicalSignedRational(numerator, denominator, reference);
}

function signedRationalParts(numerator, denominator, reference) {
  assert(signedInteger(numerator) && positiveInteger(denominator), "ARITHMETIC_CHECK_INVALID", reference);
  return Object.freeze({ numerator: BigInt(numerator), denominator: BigInt(denominator) });
}

function compareSignedRationals(left, right) {
  const difference = left.numerator * right.denominator - right.numerator * left.denominator;
  return difference < 0n ? -1 : difference > 0n ? 1 : 0;
}

function canonicalSignedRationalDistance(left, right, reference) {
  const numerator = left.numerator * right.denominator - right.numerator * left.denominator;
  const absoluteNumerator = numerator < 0n ? -numerator : numerator;
  return canonicalSignedRational(absoluteNumerator, left.denominator * right.denominator, reference);
}

function canonicalSignedRationalOpposite(check, reference) {
  assertExactDataKeys(check, ["kind", "numerator", "denominator"], "ARITHMETIC_CHECK_INVALID", reference);
  const value = signedRationalParts(check.numerator, check.denominator, reference);
  return canonicalSignedRational(-value.numerator, value.denominator, reference);
}

function canonicalSignedRationalAbsoluteValue(check, reference) {
  assertExactDataKeys(check, ["kind", "numerator", "denominator"], "ARITHMETIC_CHECK_INVALID", reference);
  const value = signedRationalParts(check.numerator, check.denominator, reference);
  return canonicalSignedRational(value.numerator < 0n ? -value.numerator : value.numerator, value.denominator, reference);
}

function canonicalSignedRationalOperation(check, reference) {
  const operation = ownDataValue(check, "operation", "ARITHMETIC_CHECK_INVALID", reference);
  if (["identity", "opposite", "absolute-value"].includes(operation)) {
    assertExactDataKeys(check, ["kind", "operation", "numerator", "denominator"], "ARITHMETIC_CHECK_INVALID", reference);
    const value = signedRationalParts(check.numerator, check.denominator, reference);
    if (operation === "identity") return canonicalSignedRational(value.numerator, value.denominator, reference);
    if (operation === "opposite") return canonicalSignedRational(-value.numerator, value.denominator, reference);
    return canonicalSignedRational(value.numerator < 0n ? -value.numerator : value.numerator, value.denominator, reference);
  }
  if (operation === "axis-distance") {
    assertExactDataKeys(check, [
      "kind", "operation", "axis",
      "firstXNumerator", "firstXDenominator", "firstYNumerator", "firstYDenominator",
      "secondXNumerator", "secondXDenominator", "secondYNumerator", "secondYDenominator"
    ], "ARITHMETIC_CHECK_INVALID", reference);
    assert(["horizontal", "vertical"].includes(check.axis), "ARITHMETIC_CHECK_INVALID", reference);
    const firstX = signedRationalParts(check.firstXNumerator, check.firstXDenominator, reference);
    const firstY = signedRationalParts(check.firstYNumerator, check.firstYDenominator, reference);
    const secondX = signedRationalParts(check.secondXNumerator, check.secondXDenominator, reference);
    const secondY = signedRationalParts(check.secondYNumerator, check.secondYDenominator, reference);
    if (check.axis === "horizontal") {
      assert(compareSignedRationals(firstY, secondY) === 0, "ARITHMETIC_CHECK_INVALID", reference);
      return canonicalSignedRationalDistance(firstX, secondX, reference);
    }
    assert(compareSignedRationals(firstX, secondX) === 0, "ARITHMETIC_CHECK_INVALID", reference);
    return canonicalSignedRationalDistance(firstY, secondY, reference);
  }
  assert(["minimum", "maximum", "distance"].includes(operation), "ARITHMETIC_CHECK_INVALID", reference);
  assertExactDataKeys(check, [
    "kind", "operation", "leftNumerator", "leftDenominator", "rightNumerator", "rightDenominator"
  ], "ARITHMETIC_CHECK_INVALID", reference);
  const left = signedRationalParts(check.leftNumerator, check.leftDenominator, reference);
  const right = signedRationalParts(check.rightNumerator, check.rightDenominator, reference);
  const comparison = compareSignedRationals(left, right);
  if (operation === "minimum") return canonicalSignedRational((comparison <= 0 ? left : right).numerator, (comparison <= 0 ? left : right).denominator, reference);
  if (operation === "maximum") return canonicalSignedRational((comparison >= 0 ? left : right).numerator, (comparison >= 0 ? left : right).denominator, reference);
  assert(left.numerator === 0n || right.numerator === 0n, "ARITHMETIC_CHECK_INVALID", reference);
  return canonicalSignedRationalDistance(left, right, reference);
}

function canonicalSignedRationalComparison(check, reference) {
  assertExactDataKeys(check, [
    "kind", "basis", "leftNumerator", "leftDenominator", "rightNumerator", "rightDenominator"
  ], "ARITHMETIC_CHECK_INVALID", reference);
  assert(["signed-value", "absolute-magnitude"].includes(check.basis), "ARITHMETIC_CHECK_INVALID", reference);
  const left = signedRationalParts(check.leftNumerator, check.leftDenominator, reference);
  const right = signedRationalParts(check.rightNumerator, check.rightDenominator, reference);
  const leftCompared = check.basis === "absolute-magnitude" && left.numerator < 0n
    ? Object.freeze({ numerator: -left.numerator, denominator: left.denominator }) : left;
  const rightCompared = check.basis === "absolute-magnitude" && right.numerator < 0n
    ? Object.freeze({ numerator: -right.numerator, denominator: right.denominator }) : right;
  const comparison = compareSignedRationals(leftCompared, rightCompared);
  assert(comparison !== 0, "ARITHMETIC_CHECK_INVALID", reference);
  return comparison < 0 ? "<" : ">";
}

function powerOfTen(exponent, reference) {
  assert(Number.isInteger(exponent) && exponent >= 0 && exponent <= 12, "ARITHMETIC_CHECK_INVALID", reference);
  return 10n ** BigInt(exponent);
}

function canonicalDecimalFromScaled(coefficient, scale, reference) {
  assert(typeof coefficient === "bigint" && coefficient >= 0n && Number.isInteger(scale) && scale >= 0 && scale <= 12, "ARITHMETIC_CHECK_INVALID", reference);
  if (coefficient === 0n) return "0";
  let normalizedCoefficient = coefficient;
  let normalizedScale = scale;
  while (normalizedScale > 0 && normalizedCoefficient % 10n === 0n) {
    normalizedCoefficient /= 10n;
    normalizedScale -= 1;
  }
  const digits = String(normalizedCoefficient).padStart(normalizedScale + 1, "0");
  const whole = normalizedScale === 0 ? digits : digits.slice(0, -normalizedScale);
  const fractional = normalizedScale === 0 ? "" : digits.slice(-normalizedScale);
  assert(whole.length <= 12 && fractional.length <= 8, "ARITHMETIC_CHECK_INVALID", reference);
  return normalizedScale === 0 ? whole : `${whole}.${fractional}`;
}

function parseCanonicalDecimal(value, maximumScale, reference) {
  assert(typeof value === "string" && /^(?:0|[1-9][0-9]{0,5})(?:\.[0-9]+)?$/u.test(value), "ARITHMETIC_CHECK_INVALID", reference);
  const parts = value.split(".");
  const fractional = parts[1] || "";
  assert(fractional.length <= maximumScale, "ARITHMETIC_CHECK_INVALID", reference);
  const coefficient = BigInt(`${parts[0]}${fractional}`);
  assert(canonicalDecimalFromScaled(coefficient, fractional.length, reference) === value, "ARITHMETIC_CHECK_INVALID", reference);
  return Object.freeze({ coefficient, scale: fractional.length });
}

function canonicalTerminatingDecimal(numerator, denominator, reference) {
  assert(numerator >= 0n && denominator > 0n, "ARITHMETIC_CHECK_INVALID", reference);
  if (numerator === 0n) return "0";
  const divisor = greatestCommonDivisorBigInt(numerator, denominator);
  const reducedNumerator = numerator / divisor;
  const reducedDenominator = denominator / divisor;
  let remainingDenominator = reducedDenominator;
  let powersOfTwo = 0;
  let powersOfFive = 0;
  while (remainingDenominator % 2n === 0n) {
    remainingDenominator /= 2n;
    powersOfTwo += 1;
  }
  while (remainingDenominator % 5n === 0n) {
    remainingDenominator /= 5n;
    powersOfFive += 1;
  }
  assert(remainingDenominator === 1n, "ARITHMETIC_CHECK_INVALID", reference);
  const scale = Math.max(powersOfTwo, powersOfFive);
  assert(scale <= 8, "ARITHMETIC_CHECK_INVALID", reference);
  const scaledCoefficient = reducedNumerator * (powerOfTen(scale, reference) / reducedDenominator);
  return canonicalDecimalFromScaled(scaledCoefficient, scale, reference);
}

function canonicalDecimalOperation(check, reference) {
  assertExactDataKeys(check, ["kind", "operation", "left", "right"], "ARITHMETIC_CHECK_INVALID", reference);
  assert(["add", "subtract", "multiply", "divide"].includes(check.operation), "ARITHMETIC_CHECK_INVALID", reference);
  const maximumScale = check.operation === "multiply" ? 2 : check.operation === "divide" ? 3 : 3;
  const left = parseCanonicalDecimal(check.left, maximumScale, reference);
  const right = parseCanonicalDecimal(check.right, check.operation === "divide" ? 2 : maximumScale, reference);
  if (check.operation === "add" || check.operation === "subtract") {
    const scale = Math.max(left.scale, right.scale);
    const leftCoefficient = left.coefficient * powerOfTen(scale - left.scale, reference);
    const rightCoefficient = right.coefficient * powerOfTen(scale - right.scale, reference);
    assert(check.operation !== "subtract" || leftCoefficient >= rightCoefficient, "ARITHMETIC_CHECK_INVALID", reference);
    return canonicalDecimalFromScaled(check.operation === "add" ? leftCoefficient + rightCoefficient : leftCoefficient - rightCoefficient, scale, reference);
  }
  if (check.operation === "multiply") {
    return canonicalDecimalFromScaled(left.coefficient * right.coefficient, left.scale + right.scale, reference);
  }
  assert(right.coefficient > 0n, "ARITHMETIC_CHECK_INVALID", reference);
  return canonicalTerminatingDecimal(
    left.coefficient * powerOfTen(right.scale, reference),
    powerOfTen(left.scale, reference) * right.coefficient,
    reference
  );
}

function canonicalWholeGcf(check, reference) {
  assertExactDataKeys(check, ["kind", "left", "right"], "ARITHMETIC_CHECK_INVALID", reference);
  assert(Number.isSafeInteger(check.left) && Number.isSafeInteger(check.right) && check.left >= 1 && check.left <= 100 && check.right >= 1 && check.right <= 100, "ARITHMETIC_CHECK_INVALID", reference);
  return String(greatestCommonDivisor(check.left, check.right));
}

function canonicalWholeLcm(check, reference) {
  assertExactDataKeys(check, ["kind", "left", "right"], "ARITHMETIC_CHECK_INVALID", reference);
  assert(Number.isSafeInteger(check.left) && Number.isSafeInteger(check.right) && check.left >= 1 && check.left <= 12 && check.right >= 1 && check.right <= 12, "ARITHMETIC_CHECK_INVALID", reference);
  return String((check.left / greatestCommonDivisor(check.left, check.right)) * check.right);
}

function canonicalAnswer(check, reference) {
  assertRecord(check, "ARITHMETIC_CHECK_INVALID", reference);
  const kind = ownDataValue(check, "kind", "ARITHMETIC_CHECK_INVALID", reference);
  if (kind === "ratio-canonical") {
    assertExactDataKeys(check, ["kind", "left", "right"], "ARITHMETIC_CHECK_INVALID", reference);
    assert(positiveInteger(check.left) && positiveInteger(check.right), "ARITHMETIC_CHECK_INVALID", reference);
    const divisor = greatestCommonDivisor(check.left, check.right);
    return `${check.left / divisor}:${check.right / divisor}`;
  }
  if (kind === "whole-quotient") {
    assertExactDataKeys(check, ["kind", "total", "groups"], "ARITHMETIC_CHECK_INVALID", reference);
    assert(positiveInteger(check.total) && positiveInteger(check.groups) && check.total % check.groups === 0, "ARITHMETIC_CHECK_INVALID", reference);
    return String(check.total / check.groups);
  }
  if (kind === "whole-product") {
    assertExactDataKeys(check, ["kind", "perGroup", "groups"], "ARITHMETIC_CHECK_INVALID", reference);
    assert(positiveInteger(check.perGroup) && positiveInteger(check.groups) && check.perGroup * check.groups <= 1000000000, "ARITHMETIC_CHECK_INVALID", reference);
    return String(check.perGroup * check.groups);
  }
  if (kind === "whole-percent") {
    assertExactDataKeys(check, ["kind", "part", "whole"], "ARITHMETIC_CHECK_INVALID", reference);
    assert(positiveInteger(check.part) && positiveInteger(check.whole) && check.part <= check.whole && (100 * check.part) % check.whole === 0, "ARITHMETIC_CHECK_INVALID", reference);
    return String((100 * check.part) / check.whole);
  }
  if (kind === "percent-of-whole") {
    assertExactDataKeys(check, ["kind", "whole", "percent"], "ARITHMETIC_CHECK_INVALID", reference);
    assert(positiveInteger(check.whole) && positiveInteger(check.percent) && check.percent <= 100 && (check.whole * check.percent) % 100 === 0, "ARITHMETIC_CHECK_INVALID", reference);
    return String((check.whole * check.percent) / 100);
  }
  if (kind === "rational-quotient") {
    assertExactDataKeys(check, [
      "kind", "dividendNumerator", "dividendDenominator", "divisorNumerator", "divisorDenominator"
    ], "ARITHMETIC_CHECK_INVALID", reference);
    assert(
      nonNegativeInteger(check.dividendNumerator) && positiveInteger(check.dividendDenominator) &&
      positiveInteger(check.divisorNumerator) && positiveInteger(check.divisorDenominator),
      "ARITHMETIC_CHECK_INVALID", reference
    );
    return canonicalRational(
      BigInt(check.dividendNumerator) * BigInt(check.divisorDenominator),
      BigInt(check.dividendDenominator) * BigInt(check.divisorNumerator),
      reference
    );
  }
  if (kind === "signed-rational-operation") return canonicalSignedRationalOperation(check, reference);
  if (kind === "signed-rational-comparison") return canonicalSignedRationalComparison(check, reference);
  if (kind === "decimal-operation") return canonicalDecimalOperation(check, reference);
  if (kind === "greatest-common-factor") return canonicalWholeGcf(check, reference);
  if (kind === "least-common-multiple") return canonicalWholeLcm(check, reference);
  fail("ARITHMETIC_CHECK_INVALID", reference);
}

function validateAnswerReference(answerReference, componentMap, policy, artifact, seenReferenceIds) {
  const reference = localReference(answerReference && answerReference.referenceId, artifact.artifactId);
  assertOnlyKeys(answerReference, REFERENCE_KEYS, "ANSWER_REFERENCE_INVALID", reference);
  assertId(answerReference.referenceId, "ref-dft-", "ANSWER_REFERENCE_INVALID", reference);
  assert(!seenReferenceIds.has(answerReference.referenceId), "DUPLICATE_ANSWER_REFERENCE", reference);
  seenReferenceIds.add(answerReference.referenceId);
  const component = componentMap.get(answerReference.componentId);
  assert(component, "ANSWER_REFERENCE_COMPONENT_UNKNOWN", reference);
  assert(component.component.responseMode === answerReference.responseMode, "ANSWER_REFERENCE_MODE_MISMATCH", reference);
  assert(component.section.resourceBinding.sessionId === artifact.resourceBinding.sessionId, "ANSWER_REFERENCE_SESSION_MISMATCH", reference);
  assert(RESPONSE_MODES.has(answerReference.responseMode), "ANSWER_REFERENCE_INVALID", reference);
  assert(nonBlankText(answerReference.expectedResponse), "ANSWER_REFERENCE_INVALID", reference);
  requireLocales(answerReference.solutionByLocale, policy, "ANSWER_REFERENCE_INVALID", reference);
  requireLocales(answerReference.uniquenessProofByLocale, policy, "ANSWER_REFERENCE_INVALID", reference);
  const expected = canonicalAnswer(answerReference.arithmeticCheck, reference);
  assert(answerReference.expectedResponse === expected, "ANSWER_REFERENCE_CALCULATION_MISMATCH", reference);
  if (answerReference.responseMode === "ratio-canonical") assert(answerReference.arithmeticCheck.kind === "ratio-canonical", "ANSWER_REFERENCE_MODE_MISMATCH", reference);
  if (answerReference.responseMode === "comparison-symbol-exact") assert(answerReference.arithmeticCheck.kind === "signed-rational-comparison", "ANSWER_REFERENCE_MODE_MISMATCH", reference);
  if (answerReference.responseMode === "numeric-exact") assert(!["ratio-canonical", "signed-rational-comparison"].includes(answerReference.arithmeticCheck.kind), "ANSWER_REFERENCE_MODE_MISMATCH", reference);
  Object.entries(component.component.contentByLocale).forEach(function (entry) {
    assertStudentContentDoesNotRevealAnswer(entry[1], answerReference.expectedResponse, reference, entry[0]);
  });
  return component;
}

function validateTeacherArtifact(artifact, plan, policy, seenArtifactIds, expectedResources) {
  const reference = localReference(artifact && artifact.artifactId, "teacher-artifact");
  assertOnlyKeys(artifact, ARTIFACT_KEYS, "TEACHER_ARTIFACT_INVALID", reference);
  assertId(artifact.artifactId, "art-dft-", "TEACHER_ARTIFACT_INVALID", reference);
  assert(!seenArtifactIds.has(artifact.artifactId), "DUPLICATE_TEACHER_ARTIFACT", reference);
  seenArtifactIds.add(artifact.artifactId);
  assert(artifact.artifactVersion === 1 && artifact.audience === "teacher" && artifact.productionState === PRODUCTION_STATE, "TEACHER_ARTIFACT_INVALID", reference);
  requireLocales(artifact.titleByLocale, policy, "TEACHER_ARTIFACT_INVALID", reference);
  const resource = findResource(plan, artifact.resourceBinding, reference);
  assert(resource.audience === "teacher" && expectedResources.has(resource.resourcePlanItemId), "TEACHER_RESOURCE_NOT_IN_SCOPE", reference);
  assertDenseArray(artifact.components, "TEACHER_ARTIFACT_INVALID", reference);
  assertPlannedComponentCounts(artifact.components, resource, reference);
  const componentIds = new Set();
  const sequences = [];
  artifact.components.forEach(function (component) {
    validateTeacherComponent(component, policy, localReference(component && component.componentId, reference));
    assert(!componentIds.has(component.componentId), "DUPLICATE_TEACHER_COMPONENT", reference);
    componentIds.add(component.componentId);
    sequences.push(component.sequence);
  });
  assert(JSON.stringify(sequences.sort(function (left, right) { return left - right; })) === JSON.stringify(artifact.components.map(function (_component, index) { return index + 1; })), "TEACHER_COMPONENT_SEQUENCE_INVALID", reference);
  validateLessonSegments(artifact.lessonSegments, artifact, policy, reference);
  assertDenseArray(artifact.answerReferences, "TEACHER_ARTIFACT_INVALID", reference);
  if (["assignment-builder"].includes(resource.resourceType)) assert(artifact.answerReferences.length === 0, "TEACHER_ARTIFACT_INVALID", reference);
  return Object.freeze({ resource, artifact });
}

function validateAssessmentPlaceholders(placeholders, plan, reference) {
  assertDenseArray(placeholders, "ASSESSMENT_PLACEHOLDERS_INVALID", reference);
  const expected = plan.resourcesByAudience.student.filter(function (resource) {
    return resource.signedItemRequired && ["quiz", "test"].includes(resource.resourceType);
  });
  assert(placeholders.length === expected.length, "ASSESSMENT_PLACEHOLDERS_INVALID", reference);
  const expectedById = new Map(expected.map(function (resource) { return [resource.resourcePlanItemId, resource]; }));
  const seen = new Set();
  placeholders.forEach(function (placeholder) {
    assertOnlyKeys(placeholder, PLACEHOLDER_KEYS, "ASSESSMENT_PLACEHOLDERS_INVALID", reference);
    const resource = expectedById.get(placeholder.resourcePlanItemId);
    assert(resource && !seen.has(resource.resourcePlanItemId), "ASSESSMENT_PLACEHOLDERS_INVALID", reference);
    seen.add(resource.resourcePlanItemId);
    ["sessionId", "levelId", "testType", "resourceType"].forEach(function (field) {
      assert(placeholder[field] === resource[field], "ASSESSMENT_PLACEHOLDERS_INVALID", reference);
    });
    assert(placeholder.status === "not-authored-in-workbook-pack", "ASSESSMENT_PLACEHOLDERS_INVALID", reference);
  });
}

function validateHomeStudyPlan(homeStudyPlan, componentMap, reference) {
  assertDenseArray(homeStudyPlan, "HOME_STUDY_PLAN_INVALID", reference);
  assert(homeStudyPlan.length === resourcePlans.GRADE6_CADENCE.homeBlocksPerWeek * resourcePlans.GRADE6_CADENCE.weeksPerUnit, "HOME_STUDY_PLAN_INVALID", reference);
  const blockIds = new Set();
  const sequences = [];
  const weeks = new Map();
  const assignedComponents = new Set();
  homeStudyPlan.forEach(function (block) {
    assertOnlyKeys(block, HOME_BLOCK_KEYS, "HOME_STUDY_PLAN_INVALID", reference);
    assertStudentNeutralId(block.blockId, "hbk-dft-", "HOME_STUDY_PLAN_INVALID", reference);
    assert(!blockIds.has(block.blockId), "HOME_STUDY_PLAN_INVALID", reference);
    blockIds.add(block.blockId);
    assert(Number.isInteger(block.week) && block.week >= 1 && block.week <= resourcePlans.GRADE6_CADENCE.weeksPerUnit, "HOME_STUDY_PLAN_INVALID", reference);
    assert(Number.isInteger(block.sequence) && block.sequence > 0, "HOME_STUDY_PLAN_INVALID", reference);
    assert(block.minutes === resourcePlans.GRADE6_CADENCE.minutesPerHomeBlock, "HOME_STUDY_PLAN_INVALID", reference);
    assertDenseArray(block.componentIds, "HOME_STUDY_PLAN_INVALID", reference);
    assert(block.componentIds.length >= 2 && block.componentIds.length <= 3, "HOME_STUDY_PLAN_INVALID", reference);
    block.componentIds.forEach(function (componentId) {
      const component = componentMap.get(componentId);
      assert(component && component.component.responseMode !== null && !assignedComponents.has(componentId), "HOME_STUDY_PLAN_INVALID", reference);
      assignedComponents.add(componentId);
    });
    sequences.push(block.sequence);
    weeks.set(block.week, (weeks.get(block.week) || 0) + 1);
  });
  assert(JSON.stringify(sequences.sort(function (left, right) { return left - right; })) === JSON.stringify(homeStudyPlan.map(function (_block, index) { return index + 1; })), "HOME_STUDY_PLAN_INVALID", reference);
  for (let week = 1; week <= resourcePlans.GRADE6_CADENCE.weeksPerUnit; week += 1) {
    assert(weeks.get(week) === resourcePlans.GRADE6_CADENCE.homeBlocksPerWeek, "HOME_STUDY_PLAN_INVALID", reference);
  }
}

function validateLayouts(layoutPlan, sections, artifacts, reference) {
  assertOnlyKeys(layoutPlan, LAYOUT_KEYS, "LAYOUT_PLAN_INVALID", reference);
  ["studentTargetPages", "teacherTargetPages", "frontMatterPages", "closingPages"].forEach(function (field) {
    assert(Number.isInteger(layoutPlan[field]) && layoutPlan[field] >= 0 && layoutPlan[field] <= 100, "LAYOUT_PLAN_INVALID", reference);
  });
  assert(layoutPlan.studentTargetPages >= 8 && layoutPlan.teacherTargetPages >= 4, "LAYOUT_PLAN_INVALID", reference);
  function validateEntries(entries, expectedIds, startPage, finalPage, code) {
    assertDenseArray(entries, code, reference);
    assert(entries.length === expectedIds.size, code, reference);
    const ids = new Set();
    let nextPage = startPage;
    entries.forEach(function (entry) {
      assertOnlyKeys(entry, LAYOUT_ENTRY_KEYS, code, reference);
      assert(typeof entry.id === "string" && expectedIds.has(entry.id) && !ids.has(entry.id), code, reference);
      ids.add(entry.id);
      assert(Number.isInteger(entry.startPage) && Number.isInteger(entry.endPage) && entry.startPage === nextPage && entry.endPage >= entry.startPage, code, reference);
      nextPage = entry.endPage + 1;
    });
    assert(nextPage === finalPage + 1, code, reference);
  }
  validateEntries(
    layoutPlan.studentSectionLayouts,
    new Set(sections.map(function (entry) { return entry.section.sectionId; })),
    layoutPlan.frontMatterPages + 1,
    layoutPlan.studentTargetPages - layoutPlan.closingPages,
    "STUDENT_LAYOUT_INVALID"
  );
  validateEntries(
    layoutPlan.teacherArtifactLayouts,
    new Set(artifacts.map(function (entry) { return entry.artifact.artifactId; })),
    1,
    layoutPlan.teacherTargetPages,
    "TEACHER_LAYOUT_INVALID"
  );
}

function instructionalStudentResources(plan) {
  return plan.resourcesByAudience.student.filter(function (resource) {
    return resource.testType === "guided-practice" && ["concept-workbook", "guided-practice", "homework"].includes(resource.resourceType);
  });
}

function instructionalTeacherResources(plan) {
  const instructionalSessions = new Set(instructionalStudentResources(plan).map(function (resource) { return resource.sessionId; }));
  return plan.resourcesByAudience.teacher.filter(function (resource) {
    return instructionalSessions.has(resource.sessionId) && ["lesson-plan", "solution-guide", "assignment-builder", "answer-key"].includes(resource.resourceType);
  });
}

function validatePack(pack, fileName) {
  const reference = localReference(pack && pack.packId, fileName);
  assertOnlyKeys(pack, PACK_KEYS, "WORKBOOK_PACK_FIELDS_INVALID", reference);
  assert(pack.schemaVersion === SCHEMA_VERSION && pack.confidentiality === CONFIDENTIALITY_MARKER, "WORKBOOK_PACK_SCHEMA_INVALID", reference);
  assertId(pack.packId, "wbk-dft-", "WORKBOOK_PACK_ID_INVALID", reference);
  assert(pack.packVersion === 1 && pack.state === DRAFT_STATE && pack.deliveryState === "locked", "WORKBOOK_PACK_STATE_INVALID", reference);
  assert(["partial", "plan-complete"].includes(pack.coverageState), "WORKBOOK_PACK_STATE_INVALID", reference);
  validateLocalePolicy(pack.localePolicy, reference);
  validateFrontMatter(pack.frontMatter, pack.localePolicy, reference);
  validateClosingMatter(pack.closingMatter, pack.localePolicy, reference);
  const unit = standardUnit(pack, reference);
  const plan = resourcePlans.buildUnitPlan(unit.unitId);
  assert(pack.resourcePlanId === plan.planId && pack.cadenceProfileId === resourcePlans.GRADE6_CADENCE.cadenceProfileId, "WORKBOOK_PLAN_BINDING_INVALID", reference);
  validateRightsDraft(pack.rightsDraft, reference);
  validateVerification(pack.verification, reference);
  assertDenseArray(pack.studentSections, "STUDENT_SECTIONS_INVALID", reference);
  assertDenseArray(pack.teacherArtifacts, "TEACHER_ARTIFACTS_INVALID", reference);

  const expectedStudent = new Map(instructionalStudentResources(plan).map(function (resource) { return [resource.resourcePlanItemId, resource]; }));
  const expectedTeacher = new Map(instructionalTeacherResources(plan).map(function (resource) { return [resource.resourcePlanItemId, resource]; }));
  const seenSectionIds = new Set();
  const seenComponentIds = new Set();
  const seenStudentResources = new Set();
  const sections = pack.studentSections.map(function (section) {
    const result = validateStudentSection(section, plan, pack.localePolicy, seenSectionIds, seenComponentIds, expectedStudent);
    assert(!seenStudentResources.has(result.resource.resourcePlanItemId), "DUPLICATE_STUDENT_RESOURCE", result.section.sectionId);
    seenStudentResources.add(result.resource.resourcePlanItemId);
    return result;
  });
  if (pack.coverageState === "plan-complete") assert(seenStudentResources.size === expectedStudent.size, "INSTRUCTIONAL_COVERAGE_INCOMPLETE", reference);
  else assert(seenStudentResources.size > 0 && seenStudentResources.size < expectedStudent.size, "PARTIAL_COVERAGE_STATE_INVALID", reference);

  const seenArtifactIds = new Set();
  const seenTeacherResources = new Set();
  const artifacts = pack.teacherArtifacts.map(function (artifact) {
    const result = validateTeacherArtifact(artifact, plan, pack.localePolicy, seenArtifactIds, expectedTeacher);
    assert(!seenTeacherResources.has(result.resource.resourcePlanItemId), "DUPLICATE_TEACHER_RESOURCE", result.artifact.artifactId);
    seenTeacherResources.add(result.resource.resourcePlanItemId);
    return result;
  });
  if (pack.coverageState === "plan-complete") assert(seenTeacherResources.size === expectedTeacher.size, "TEACHER_COVERAGE_INCOMPLETE", reference);
  else assert(seenTeacherResources.size > 0 && seenTeacherResources.size < expectedTeacher.size, "PARTIAL_COVERAGE_STATE_INVALID", reference);

  const componentMap = new Map();
  sections.forEach(function (entry) {
    entry.section.components.forEach(function (component) { componentMap.set(component.componentId, Object.freeze({ component, section: entry.section })); });
  });
  validateHomeStudyPlan(pack.homeStudyPlan, componentMap, reference);
  const seenReferenceIds = new Set();
  const referencedComponents = new Set();
  artifacts.forEach(function (entry) {
    entry.artifact.answerReferences.forEach(function (answerReference) {
      const component = validateAnswerReference(answerReference, componentMap, pack.localePolicy, entry.artifact, seenReferenceIds);
      assert(component.component.teacherReferenceId === answerReference.referenceId, "ANSWER_REFERENCE_LINK_MISMATCH", answerReference.referenceId);
      assert(!referencedComponents.has(answerReference.componentId), "DUPLICATE_COMPONENT_ANSWER_REFERENCE", answerReference.referenceId);
      referencedComponents.add(answerReference.componentId);
    });
  });
  sections.forEach(function (entry) {
    entry.section.components.forEach(function (component) {
      if (component.responseMode === null) return;
      assert(referencedComponents.has(component.componentId), "MISSING_TEACHER_ANSWER_REFERENCE", component.componentId);
    });
  });
  validateAssessmentPlaceholders(pack.assessmentPlaceholders, plan, reference);
  validateLayouts(pack.layoutPlan, sections, artifacts, reference);
  return Object.freeze({ sectionCount: sections.length, componentCount: componentMap.size, artifactCount: artifacts.length });
}

function isInside(candidate, parent) {
  const relative = path.relative(parent, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function assertNoReparsePointInPath(absolutePath) {
  const parsed = path.parse(absolutePath);
  let current = parsed.root;
  const parts = absolutePath.slice(parsed.root.length).split(path.sep).filter(Boolean);
  parts.forEach(function (part) {
    current = path.join(current, part);
    const stat = fs.lstatSync(current);
    assert(stat.isDirectory() && !stat.isSymbolicLink(), "PRIVATE_WORKBOOK_ROOT_UNSAFE", "root");
  });
}

function gitMarkerExists(directory) {
  try {
    fs.lstatSync(path.join(directory, ".git"));
    return true;
  } catch (error) {
    if (error && error.code === "ENOENT") return false;
    fail("PRIVATE_WORKBOOK_ROOT_UNSAFE", "root");
  }
}

function assertOutsideAnyGitWorktree(absolutePath) {
  let current = absolutePath;
  while (true) {
    // Git-discoverable normal repositories and linked worktrees are represented
    // by a `.git` directory or file. A private authoring root cannot live
    // beneath either one, even when it is outside this public repository.
    assert(!gitMarkerExists(current), "PRIVATE_WORKBOOK_ROOT_INSIDE_GIT_WORKTREE", "root");
    const parent = path.dirname(current);
    if (parent === current) return;
    current = parent;
  }
}

function parseRoot(args) {
  assert(args.length === 2 && args[0] === "--root" && path.isAbsolute(args[1]), "PRIVATE_WORKBOOK_ROOT_REQUIRED", "command");
  return args[1];
}

function sourceFiles(root) {
  const rootStat = fs.lstatSync(root);
  assert(rootStat.isDirectory() && !rootStat.isSymbolicLink(), "PRIVATE_WORKBOOK_ROOT_UNSAFE", "root");
  const files = [];
  fs.readdirSync(root, { withFileTypes: true }).forEach(function (entry) {
    assert(entry.isFile() && !entry.isSymbolicLink(), "PRIVATE_WORKBOOK_PATH_UNSAFE", entry.name);
    assert(/^grade6-[a-z0-9-]+-workbook-draft\.json$/.test(entry.name), "PRIVATE_WORKBOOK_FILE_NAME_INVALID", entry.name);
    files.push(entry.name);
  });
  assert(files.length > 0, "PRIVATE_WORKBOOK_PACKS_MISSING", "root");
  return files.sort();
}

function assertNoDuplicateJsonKeys(source, reference) {
  const containers = [];
  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (character === "\"") {
      const start = index;
      let closed = false;
      index += 1;
      while (index < source.length) {
        const current = source[index];
        if (current === "\\") {
          index += 1;
          assert(index < source.length, "PRIVATE_WORKBOOK_JSON_INVALID", reference);
          index += 1;
          continue;
        }
        if (current === "\"") {
          closed = true;
          break;
        }
        assert(current.charCodeAt(0) > 0x1f, "PRIVATE_WORKBOOK_JSON_INVALID", reference);
        index += 1;
      }
      assert(closed, "PRIVATE_WORKBOOK_JSON_INVALID", reference);
      let next = index + 1;
      while (next < source.length && /[\t\n\r ]/u.test(source[next])) next += 1;
      const keys = containers[containers.length - 1];
      if (source[next] === ":" && keys instanceof Set) {
        let key;
        try {
          key = JSON.parse(source.slice(start, index + 1));
        } catch (_error) {
          fail("PRIVATE_WORKBOOK_JSON_INVALID", reference);
        }
        assert(!keys.has(key), "PRIVATE_WORKBOOK_JSON_DUPLICATE_KEY", reference);
        keys.add(key);
      }
      continue;
    }
    if (character === "{") containers.push(new Set());
    else if (character === "[") containers.push(null);
    else if (character === "}" || character === "]") containers.pop();
  }
}

function loadPack(root, fileName) {
  const reference = fileName;
  const fullPath = path.join(root, fileName);
  const stat = fs.lstatSync(fullPath);
  assert(stat.isFile() && !stat.isSymbolicLink() && stat.size > 0 && stat.size <= 1024 * 1024, "PRIVATE_WORKBOOK_FILE_UNSAFE", reference);
  let value;
  try {
    const source = fs.readFileSync(fullPath, "utf8");
    assertNoDuplicateJsonKeys(source, reference);
    value = JSON.parse(source);
  } catch (_error) {
    if (_error instanceof ValidationError) throw _error;
    fail("PRIVATE_WORKBOOK_JSON_INVALID", reference);
  }
  assertRecord(value, "PRIVATE_WORKBOOK_JSON_INVALID", reference);
  return value;
}

function validateDirectory(rootArgument) {
  if (process.env.CI && process.env.GFIELD_ALLOW_PRIVATE_WORKBOOK_PREFLIGHT !== "1") {
    fail("PRIVATE_WORKBOOK_PREFLIGHT_BLOCKED_IN_CI", "command");
  }
  const projectRoot = path.resolve(__dirname, "..");
  const repoRoot = path.resolve(projectRoot, "..");
  assert(fs.existsSync(rootArgument), "PRIVATE_WORKBOOK_ROOT_MISSING", "root");
  const lexicalRoot = path.resolve(rootArgument);
  assert(!isInside(lexicalRoot, repoRoot), "PRIVATE_WORKBOOK_ROOT_INSIDE_REPOSITORY", "root");
  assertNoReparsePointInPath(lexicalRoot);
  const root = fs.realpathSync(lexicalRoot);
  assert(!isInside(root, repoRoot), "PRIVATE_WORKBOOK_ROOT_INSIDE_REPOSITORY", "root");
  assertOutsideAnyGitWorktree(root);
  const files = sourceFiles(root);
  const packIds = new Set();
  const unitIds = new Set();
  let totals = { packs: 0, sections: 0, components: 0, artifacts: 0 };
  files.forEach(function (fileName) {
    const pack = loadPack(root, fileName);
    const result = validatePack(pack, fileName);
    assert(!packIds.has(pack.packId), "DUPLICATE_WORKBOOK_PACK", fileName);
    assert(!unitIds.has(pack.unitId), "DUPLICATE_WORKBOOK_UNIT", fileName);
    packIds.add(pack.packId);
    unitIds.add(pack.unitId);
    totals = {
      packs: totals.packs + 1,
      sections: totals.sections + result.sectionCount,
      components: totals.components + result.componentCount,
      artifacts: totals.artifacts + result.artifactCount
    };
  });
  return Object.freeze(totals);
}

function main() {
  try {
    const root = parseRoot(process.argv.slice(2));
    const result = validateDirectory(root);
    process.stdout.write(`PRIVATE_GRADE6_WORKBOOK_PREFLIGHT_OK packs=${result.packs} sections=${result.sections} components=${result.components} teacherArtifacts=${result.artifacts} state=${DRAFT_STATE}\n`);
  } catch (error) {
    if (error instanceof ValidationError) {
      process.stderr.write(`PRIVATE_GRADE6_WORKBOOK_PREFLIGHT_FAILED code=${error.code} ref=${error.reference}\n`);
      process.exitCode = 1;
      return;
    }
    process.stderr.write("PRIVATE_GRADE6_WORKBOOK_PREFLIGHT_FAILED code=UNEXPECTED_VALIDATOR_ERROR ref=validator\n");
    process.exitCode = 1;
  }
}

if (require.main === module) main();

module.exports = Object.freeze({
  SCHEMA_VERSION,
  CONFIDENTIALITY_MARKER,
  DRAFT_STATE,
  assertResponseStudentTextSyntax,
  assertStudentContentDoesNotRevealAnswer,
  assertNoDuplicateJsonKeys,
  canonicalAnswer,
  validatePack,
  validateDirectory
});
