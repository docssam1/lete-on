"use strict";

const crypto = require("node:crypto");
const util = require("node:util");
const taxonomy = require("./sasmo-2019-g6-taxonomy-companion.js");
const scoringCatalog = require("./sasmo-mock-catalog.js");
const conceptLessons = require("../learning/grade6-concept-lessons.js");
const clinicPaths = require("../learning/clinic-paths.js");
const ratioWorkbook = require("../learning/grade6-rp-a-unit-workbook.js");

/*
 * Answer-free, review-only bridge for two ratio prerequisites.
 *
 * This file does not assign work, diagnose an error, expose contest content,
 * or claim that the existing Grade 6 workbook is SASMO transfer practice.
 */
const SCHEMA_VERSION = "gfield-sasmo-learning-bridge-review-v1";
const BRIDGE_VERSION = "sasmo-2019-g6-ratio-prerequisite-review-20261009-2";
const BRIDGE_FINGERPRINT_SHA256 = "126bfe28e3fc55f6846c6c91a01ee3b716f503f592981fb5b5fa15130780d6dc";
const MATCH_KIND = "prerequisite";
const ASSIGNMENT_STATE = "locked";
const OBSERVATION_CONFIRMATION = "teacher-work-review-required";

const ROUTES = [
  {
    questionNumber: 7,
    formSkillId: "relational-coin-equations",
    taxonomyAxis: "number-operations",
    matchKind: MATCH_KIND,
    clusterId: "6.RP.A",
    conceptLessonId: "g6-concept-6-rp-a-v1",
    workbookPackId: "gfield-grade6-rp-a-unit-workbook-v1",
    prerequisiteWorkbookItemIds: ["rpa-w06", "rpa-w07", "rpa-w08", "rpa-w09", "rpa-w11"],
    prerequisiteUnitRecheckItemIds: ["rpa-r01", "rpa-r03"],
    transferSkillContract: "common-unit-ratio-from-linked-quantities-average-and-difference",
    candidateObservationIds: ["unequal-scaling", "average-total-confusion"],
    observationConfirmation: OBSERVATION_CONFIRMATION,
    studentUse: "prerequisite-concept-and-practice-only",
    teacherUse: "inspect-written-model-before-any-assignment",
    transferResourceState: "missing",
    delayedRecheckState: "missing",
    assignmentState: ASSIGNMENT_STATE
  },
  {
    questionNumber: 20,
    formSkillId: "multi-ratio-total",
    taxonomyAxis: "number-operations",
    matchKind: MATCH_KIND,
    clusterId: "6.RP.A",
    conceptLessonId: "g6-concept-6-rp-a-v1",
    workbookPackId: "gfield-grade6-rp-a-unit-workbook-v1",
    prerequisiteWorkbookItemIds: ["rpa-w08", "rpa-w09", "rpa-w12", "rpa-w28"],
    prerequisiteUnitRecheckItemIds: ["rpa-r03"],
    transferSkillContract: "normalize-multiple-part-to-remainder-ratios-to-one-whole",
    candidateObservationIds: ["part-total-confusion", "incompatible-reference-mixing"],
    observationConfirmation: OBSERVATION_CONFIRMATION,
    studentUse: "prerequisite-concept-and-practice-only",
    teacherUse: "inspect-common-whole-model-before-any-assignment",
    transferResourceState: "missing",
    delayedRecheckState: "missing",
    assignmentState: ASSIGNMENT_STATE
  }
];

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.keys(value).forEach(function (key) { deepFreeze(value[key]); });
  return Object.freeze(value);
}

function record(value) {
  if (!value || typeof value !== "object" || Array.isArray(value) || util.types.isProxy(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function enumerableDataKeys(value, label) {
  const keys = Reflect.ownKeys(value);
  if (keys.some(function (key) { return typeof key !== "string"; })) throw new Error(`${label} must not contain symbol fields`);
  keys.forEach(function (key) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor || !("value" in descriptor) || !descriptor.enumerable) throw new Error(`${label} must contain enumerable data fields only`);
  });
  return keys;
}

function denseArray(value, label, expectedLength) {
  if (!Array.isArray(value) || util.types.isProxy(value) || Object.getPrototypeOf(value) !== Array.prototype) throw new Error(`${label} must be a plain array`);
  if (expectedLength !== undefined && value.length !== expectedLength) throw new Error(`${label} must contain exactly ${expectedLength} items`);
  const keys = Reflect.ownKeys(value);
  const expectedKeys = Array.from({ length: value.length }, function (_, index) { return String(index); }).concat("length");
  if (keys.length !== expectedKeys.length || expectedKeys.some(function (key) { return !keys.includes(key); })) {
    throw new Error(`${label} must be dense and must not contain side fields`);
  }
  for (let index = 0; index < value.length; index += 1) {
    const descriptor = Object.getOwnPropertyDescriptor(value, String(index));
    if (!descriptor || !("value" in descriptor) || !descriptor.enumerable) throw new Error(`${label} must contain dense data items`);
  }
}

function assertJsonSafe(value, label, seen) {
  if (value === null || typeof value === "string" || typeof value === "boolean" || (typeof value === "number" && Number.isFinite(value))) return;
  if (!value || typeof value !== "object") throw new Error(`${label} must contain JSON-safe values only`);
  if (util.types.isProxy(value)) throw new Error(`${label} must not be a Proxy`);
  const visited = seen || new Set();
  if (visited.has(value)) throw new Error(`${label} must not contain circular references`);
  visited.add(value);
  if (Array.isArray(value)) {
    denseArray(value, label);
    for (let index = 0; index < value.length; index += 1) {
      const descriptor = Object.getOwnPropertyDescriptor(value, String(index));
      assertJsonSafe(descriptor.value, `${label}[${index}]`, visited);
    }
  } else {
    if (!record(value)) throw new Error(`${label} must be a plain record`);
    enumerableDataKeys(value, label).forEach(function (key) {
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      assertJsonSafe(descriptor.value, `${label}.${key}`, visited);
    });
  }
  visited.delete(value);
}

function onlyKeys(value, allowed, label) {
  if (!record(value)) throw new Error(`${label} has unsupported fields`);
  const keys = enumerableDataKeys(value, label);
  if (keys.some(function (key) { return !allowed.includes(key); })) {
    throw new Error(`${label} has unsupported fields`);
  }
}

function denseStrings(value, label) {
  denseArray(value, label);
  if (!value.length) throw new Error(`${label} must be a non-empty array`);
  const seen = new Set();
  for (let index = 0; index < value.length; index += 1) {
    if (typeof value[index] !== "string" || !value[index].trim()) {
      throw new Error(`${label} must contain dense non-blank strings`);
    }
    if (seen.has(value[index])) throw new Error(`${label} must not contain duplicates`);
    seen.add(value[index]);
  }
}

function canonicalJson(value) {
  if (Array.isArray(value)) {
    denseArray(value, "canonical array");
    const items = [];
    for (let index = 0; index < value.length; index += 1) items.push(canonicalJson(value[index]));
    return `[${items.join(",")}]`;
  }
  if (value && typeof value === "object") {
    if (!record(value)) throw new Error("canonical object must be a plain record");
    const keys = enumerableDataKeys(value, "canonical object").sort();
    const fields = [];
    keys.forEach(function (key) { fields.push(`${JSON.stringify(key)}:${canonicalJson(value[key])}`); });
    return `{${fields.join(",")}}`;
  }
  if (value === null || typeof value === "string" || typeof value === "boolean" || (typeof value === "number" && Number.isFinite(value))) return JSON.stringify(value);
  throw new Error("canonical value must be JSON-safe");
}

function fingerprintPayload(value) {
  return Object.fromEntries(Object.entries(value).filter(function (entry) { return entry[0] !== "bridgeFingerprintSha256"; }));
}

function fingerprintBridge(value) {
  assertJsonSafe(value, "bridge");
  return crypto.createHash("sha256").update(canonicalJson(fingerprintPayload(value)), "utf8").digest("hex");
}

function validateBridge(value) {
  assertJsonSafe(value, "bridge");
  onlyKeys(value, ["schemaVersion", "bridgeVersion", "bridgeFingerprintSha256", "formId", "taxonomyVersion", "taxonomyFingerprintSha256", "automaticPrescription", "releaseLocks", "routes"], "bridge");
  if (value.schemaVersion !== SCHEMA_VERSION || value.bridgeVersion !== BRIDGE_VERSION || value.bridgeFingerprintSha256 !== BRIDGE_FINGERPRINT_SHA256) throw new Error("bridge identity is invalid");
  if (value.formId !== taxonomy.FORM_ID || value.taxonomyVersion !== taxonomy.TAXONOMY_VERSION || value.taxonomyFingerprintSha256 !== taxonomy.TAXONOMY_FINGERPRINT_SHA256) throw new Error("taxonomy binding is invalid");
  if (value.automaticPrescription !== false) throw new Error("automatic prescription must remain disabled");
  onlyKeys(value.releaseLocks, ["domainDiagnosis", "automaticPrescription", "sourceLinkedWorkbook"], "releaseLocks");
  if (Object.values(value.releaseLocks).some(function (state) { return state !== true; })) throw new Error("all release locks must remain closed");
  denseArray(value.routes, "routes", 2);
  const routeNumbers = [];
  for (let index = 0; index < value.routes.length; index += 1) {
    const route = value.routes[index];
    onlyKeys(route, ["questionNumber", "formSkillId", "taxonomyAxis", "matchKind", "clusterId", "conceptLessonId", "workbookPackId", "prerequisiteWorkbookItemIds", "prerequisiteUnitRecheckItemIds", "transferSkillContract", "candidateObservationIds", "observationConfirmation", "studentUse", "teacherUse", "transferResourceState", "delayedRecheckState", "assignmentState"], `routes[${index}]`);
    if (!Number.isInteger(route.questionNumber)) throw new Error(`routes[${index}].questionNumber is invalid`);
    routeNumbers.push(route.questionNumber);
    ["formSkillId", "taxonomyAxis", "clusterId", "conceptLessonId", "workbookPackId", "transferSkillContract", "studentUse", "teacherUse"].forEach(function (field) {
      if (typeof route[field] !== "string" || !route[field].trim()) throw new Error(`routes[${index}].${field} is invalid`);
    });
    if (route.matchKind !== MATCH_KIND || route.observationConfirmation !== OBSERVATION_CONFIRMATION || route.transferResourceState !== "missing" || route.delayedRecheckState !== "missing" || route.assignmentState !== ASSIGNMENT_STATE) throw new Error(`routes[${index}] safety state is invalid`);
    denseStrings(route.prerequisiteWorkbookItemIds, `routes[${index}].prerequisiteWorkbookItemIds`);
    denseStrings(route.prerequisiteUnitRecheckItemIds, `routes[${index}].prerequisiteUnitRecheckItemIds`);
    denseStrings(route.candidateObservationIds, `routes[${index}].candidateObservationIds`);

    const taxonomyItem = taxonomy.COMPANION.items[route.questionNumber - 1];
    const scoringItem = scoringCatalog.getForm(value.formId).items[route.questionNumber - 1];
    if (!taxonomyItem || taxonomyItem.questionNumber !== route.questionNumber || taxonomyItem.diagnosticEligibility.state !== "eligible" || taxonomyItem.gfieldContentAxis !== route.taxonomyAxis) throw new Error(`routes[${index}] is not bound to an eligible taxonomy item`);
    if (!scoringItem || scoringItem.questionNumber !== route.questionNumber || scoringItem.skillId !== route.formSkillId) throw new Error(`routes[${index}] scoring skill binding is invalid`);

    const concept = conceptLessons.lessons.find(function (lesson) { return lesson.lessonId === route.conceptLessonId; });
    if (!concept || concept.publicationState !== "public-original-learning-content" || concept.lineage.clusterId !== route.clusterId) throw new Error(`routes[${index}] concept binding is invalid`);
    const workbookPath = clinicPaths.workbookByCluster[route.clusterId];
    if (!workbookPath || workbookPath.packId !== route.workbookPackId || ratioWorkbook.pack.id !== route.workbookPackId || ratioWorkbook.pack.clusterId !== route.clusterId) throw new Error(`routes[${index}] workbook binding is invalid`);
    const workbookIds = new Set(ratioWorkbook.pack.workbookItems.map(function (item) { return item.id; }));
    const recheckIds = new Set(ratioWorkbook.pack.recheckItems.map(function (item) { return item.id; }));
    for (let itemIndex = 0; itemIndex < route.prerequisiteWorkbookItemIds.length; itemIndex += 1) {
      if (!workbookIds.has(route.prerequisiteWorkbookItemIds[itemIndex])) throw new Error(`routes[${index}] prerequisite item binding is invalid`);
    }
    for (let itemIndex = 0; itemIndex < route.prerequisiteUnitRecheckItemIds.length; itemIndex += 1) {
      if (!recheckIds.has(route.prerequisiteUnitRecheckItemIds[itemIndex])) throw new Error(`routes[${index}] prerequisite item binding is invalid`);
    }
  }
  if (JSON.stringify(routeNumbers) !== "[7,20]") throw new Error("only the reviewed Q7 and Q20 ratio routes are allowed");
  const serialized = JSON.stringify(value);
  if (/answerValue|correctOption|privateScoring|sourceLocator|publishedSolutionLocator|sourcePageUrl|studentResponse|problemText|optionText/i.test(serialized)) throw new Error("answer-free bridge boundary failed");
  if (fingerprintBridge(value) !== BRIDGE_FINGERPRINT_SHA256) throw new Error("bridge fingerprint mismatch");
  return true;
}

const BRIDGE = deepFreeze({
  schemaVersion: SCHEMA_VERSION,
  bridgeVersion: BRIDGE_VERSION,
  bridgeFingerprintSha256: BRIDGE_FINGERPRINT_SHA256,
  formId: taxonomy.FORM_ID,
  taxonomyVersion: taxonomy.TAXONOMY_VERSION,
  taxonomyFingerprintSha256: taxonomy.TAXONOMY_FINGERPRINT_SHA256,
  automaticPrescription: false,
  releaseLocks: {
    domainDiagnosis: true,
    automaticPrescription: true,
    sourceLinkedWorkbook: true
  },
  routes: ROUTES
});

validateBridge(BRIDGE);

module.exports = Object.freeze({
  SCHEMA_VERSION,
  BRIDGE_VERSION,
  BRIDGE_FINGERPRINT_SHA256,
  MATCH_KIND,
  ASSIGNMENT_STATE,
  OBSERVATION_CONFIRMATION,
  BRIDGE,
  fingerprintBridge,
  validateBridge
});
