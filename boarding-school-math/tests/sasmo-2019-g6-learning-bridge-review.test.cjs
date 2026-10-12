"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const bridge = require("../competition/sasmo-2019-g6-learning-bridge-review.cjs");
const taxonomy = require("../competition/sasmo-2019-g6-taxonomy-companion.js");

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value).sort().map(function (key) { return `${JSON.stringify(key)}:${stableJson(value[key])}`; }).join(",")}}`;
  return JSON.stringify(value);
}

function independentFingerprint(value) {
  const payload = Object.fromEntries(Object.entries(value).filter(function (entry) { return entry[0] !== "bridgeFingerprintSha256"; }));
  return crypto.createHash("sha256").update(stableJson(payload), "utf8").digest("hex");
}

test("the ratio bridge is taxonomy-bound, answer-free, frozen, and release-locked", function () {
  const value = bridge.BRIDGE;
  assert.equal(bridge.validateBridge(value), true);
  assert.equal(value.formId, taxonomy.FORM_ID);
  assert.equal(value.taxonomyVersion, taxonomy.TAXONOMY_VERSION);
  assert.equal(value.taxonomyFingerprintSha256, taxonomy.TAXONOMY_FINGERPRINT_SHA256);
  assert.equal(bridge.fingerprintBridge(value), bridge.BRIDGE_FINGERPRINT_SHA256);
  assert.equal(independentFingerprint(value), bridge.BRIDGE_FINGERPRINT_SHA256);
  assert.equal(value.automaticPrescription, false);
  assert.deepEqual(value.releaseLocks, { domainDiagnosis: true, automaticPrescription: true, sourceLinkedWorkbook: true });
  assert.deepEqual(value.routes.map(function (route) { return route.questionNumber; }), [7, 20]);
  value.routes.forEach(function (route) {
    assert.equal(route.taxonomyAxis, "number-operations");
    assert.equal(route.matchKind, "prerequisite");
    assert.equal(route.clusterId, "6.RP.A");
    assert.equal(route.transferResourceState, "missing");
    assert.equal(route.delayedRecheckState, "missing");
    assert.equal(route.assignmentState, "locked");
    assert.equal(route.observationConfirmation, "teacher-work-review-required");
  });
  assert.equal(Object.isFrozen(value), true);
  assert.equal(Object.isFrozen(value.routes), true);
  assert.equal(Object.isFrozen(value.routes[0].prerequisiteWorkbookItemIds), true);
  assert.doesNotMatch(JSON.stringify(value), /answerValue|correctOption|privateScoring|sourceLocator|publishedSolutionLocator|sourcePageUrl|studentResponse|problemText|optionText|[A-Z]:\\/i);
});

test("the bridge rejects automatic assignment, non-eligible items, content changes, and sparse references", function () {
  const automatic = structuredClone(bridge.BRIDGE);
  automatic.automaticPrescription = true;
  assert.throws(function () { bridge.validateBridge(automatic); }, /automatic prescription/);

  const nonEligible = structuredClone(bridge.BRIDGE);
  nonEligible.routes[0].questionNumber = 9;
  assert.throws(function () { bridge.validateBridge(nonEligible); }, /eligible taxonomy item|scoring skill binding/);

  const unlocked = structuredClone(bridge.BRIDGE);
  unlocked.routes[0].transferResourceState = "available";
  assert.throws(function () { bridge.validateBridge(unlocked); }, /safety state/);

  const answerBearing = structuredClone(bridge.BRIDGE);
  answerBearing.routes[0].answerValue = "forbidden";
  assert.throws(function () { bridge.validateBridge(answerBearing); }, /unsupported fields/);

  const zeroFingerprint = structuredClone(bridge.BRIDGE);
  zeroFingerprint.bridgeFingerprintSha256 = "0".repeat(64);
  assert.throws(function () { bridge.validateBridge(zeroFingerprint); }, /identity/);

  const changedContract = structuredClone(bridge.BRIDGE);
  changedContract.routes[0].transferSkillContract = "different-contract";
  assert.throws(function () { bridge.validateBridge(changedContract); }, /fingerprint mismatch/);

  const sparse = structuredClone(bridge.BRIDGE);
  sparse.routes[0].prerequisiteWorkbookItemIds = Array(1);
  assert.throws(function () { bridge.validateBridge(sparse); }, /dense/);

  const methodOverride = structuredClone(bridge.BRIDGE);
  methodOverride.routes[0].transferSkillContract = "different-contract";
  methodOverride.routes.map = function () { return bridge.BRIDGE.routes; };
  assert.throws(function () { bridge.validateBridge(methodOverride); }, /side fields/);
  assert.throws(function () { bridge.fingerprintBridge(methodOverride); }, /side fields/);

  const arraySideField = structuredClone(bridge.BRIDGE);
  arraySideField.routes[0].prerequisiteWorkbookItemIds.answerValue = "forbidden";
  assert.throws(function () { bridge.validateBridge(arraySideField); }, /side fields/);

  const symbolSideField = structuredClone(bridge.BRIDGE);
  symbolSideField.routes[0][Symbol("answerValue")] = "forbidden";
  assert.throws(function () { bridge.validateBridge(symbolSideField); }, /symbol fields/);
  assert.throws(function () { bridge.fingerprintBridge(symbolSideField); }, /symbol fields|side fields/);

  const accessorField = structuredClone(bridge.BRIDGE);
  let getterCalls = 0;
  Object.defineProperty(accessorField.routes[0], "teacherUse", { enumerable: true, get: function () { getterCalls += 1; return bridge.BRIDGE.routes[0].teacherUse; } });
  assert.throws(function () { bridge.validateBridge(accessorField); }, /enumerable data fields/);
  assert.equal(getterCalls, 0);
  assert.throws(function () { bridge.fingerprintBridge(accessorField); }, /enumerable data fields/);
  assert.equal(getterCalls, 0);

  const hiddenArrayField = structuredClone(bridge.BRIDGE);
  Object.defineProperty(hiddenArrayField.routes, "toJSON", { enumerable: false, value: function () { return []; } });
  assert.throws(function () { bridge.validateBridge(hiddenArrayField); }, /side fields/);
  assert.throws(function () { bridge.fingerprintBridge(hiddenArrayField); }, /side fields/);

  const customPrototype = structuredClone(bridge.BRIDGE);
  Object.setPrototypeOf(customPrototype.routes, Object.create(Array.prototype));
  assert.throws(function () { bridge.validateBridge(customPrototype); }, /plain array/);
  assert.throws(function () { bridge.fingerprintBridge(customPrototype); }, /plain array/);

  const circular = structuredClone(bridge.BRIDGE);
  circular.routes[0].candidateObservationIds[0] = circular;
  assert.throws(function () { bridge.validateBridge(circular); }, /JSON-safe|circular|dense non-blank strings/);
  assert.throws(function () { bridge.fingerprintBridge(circular); }, /circular/);

  const parsedClone = JSON.parse(JSON.stringify(bridge.BRIDGE));
  assert.equal(bridge.validateBridge(parsedClone), true);
  assert.equal(bridge.fingerprintBridge(parsedClone), bridge.BRIDGE_FINGERPRINT_SHA256);

  const proxiedBridge = new Proxy(structuredClone(bridge.BRIDGE), {});
  assert.throws(function () { bridge.validateBridge(proxiedBridge); }, /Proxy/);
  assert.throws(function () { bridge.fingerprintBridge(proxiedBridge); }, /Proxy/);

  const nestedProxy = structuredClone(bridge.BRIDGE);
  nestedProxy.routes[0] = new Proxy(nestedProxy.routes[0], {});
  assert.throws(function () { bridge.validateBridge(nestedProxy); }, /Proxy/);
  assert.throws(function () { bridge.fingerprintBridge(nestedProxy); }, /Proxy/);
});

test("the review bridge is not loaded by scoring, diagnosis, planning, or learner pages", function () {
  const projectRoot = path.resolve(__dirname, "..");
  [
    "competition/sasmo-mock-catalog.js",
    "assessment/sasmo-mock-readiness.js",
    "assessment/sasmo-local-paper-session.js",
    "shared/gmap-local-learning-record.js",
    "scripts/analyze-private-sasmo-mock.cjs",
    "sasmo-real-paper.html",
    "sasmo-real-paper.js",
    "learning-plan.html",
    "learning-plan.js",
    "concept-learning.html",
    "concept-learning.js",
    "unit-workbook.html",
    "unit-workbook.js"
  ].forEach(function (relativePath) {
    const source = fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
    assert.doesNotMatch(source, /sasmo-2019-g6-learning-bridge-review/);
  });
});
