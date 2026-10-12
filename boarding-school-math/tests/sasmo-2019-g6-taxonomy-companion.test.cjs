"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const taxonomy = require("../competition/sasmo-2019-g6-taxonomy-companion.js");
const catalog = require("../competition/sasmo-mock-catalog.js");

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map(function (key) { return `${JSON.stringify(key)}:${stableJson(value[key])}`; }).join(",")}}`;
  }
  return JSON.stringify(value);
}

function fingerprint(companion) {
  const payload = Object.fromEntries(Object.entries(companion).filter(function (entry) { return entry[0] !== "taxonomyFingerprintSha256"; }));
  return crypto.createHash("sha256").update(stableJson(payload)).digest("hex");
}

test("the answer-free taxonomy companion is source-bound, fingerprinted, and release-locked", function () {
  const companion = taxonomy.COMPANION;
  const form = catalog.getForm(taxonomy.FORM_ID);
  assert.equal(taxonomy.validateCompanion(companion), true);
  assert.equal(companion.sourceFingerprintSha256, form.sourceFingerprintSha256);
  assert.equal(companion.taxonomyFingerprintSha256, taxonomy.TAXONOMY_FINGERPRINT_SHA256);
  assert.equal(fingerprint(companion), companion.taxonomyFingerprintSha256);
  assert.deepEqual(companion.releaseLocks, { domainDiagnosis: true, automaticPrescription: true, sourceLinkedWorkbook: true });
  assert.equal(companion.items.length, 25);
  assert.equal(Object.isFrozen(companion), true);
  assert.equal(Object.isFrozen(companion.items), true);
  assert.equal(Object.isFrozen(companion.items[0].diagnosticEligibility), true);
  assert.doesNotMatch(JSON.stringify(companion), /answerValue|privateScoring|sourceLocator|publishedSolutionLocator|sourcePageUrl|studentResponse|correctOption|[A-Z]:\\/i);
});

test("pending classification and diagnostic-review states stay explicit and fail closed", function () {
  const items = taxonomy.COMPANION.items;
  assert.deepEqual(items.filter(function (item) { return item.classificationState === "pending"; }).map(function (item) { return item.questionNumber; }), [15]);
  assert.deepEqual(items.filter(function (item) { return item.diagnosticEligibility.state === "review-required"; }).map(function (item) { return item.questionNumber; }), [9, 15, 21]);
  assert.deepEqual(items.filter(function (item) { return item.diagnosticEligibility.state === "score-only"; }).map(function (item) { return item.questionNumber; }), [19]);
  assert.equal(items[6].gfieldContentAxis, "number-operations");
  assert.equal(items[6].diagnosticEligibility.state, "eligible");
  assert.deepEqual(items[8].diagnosticEligibility.reasonCodes, ["language-determinacy-review"]);
  assert.equal(items[10].gfieldContentAxis, "number-operations");
  assert.equal(items[10].diagnosticEligibility.state, "eligible");
  assert.deepEqual(items[14].diagnosticEligibility.reasonCodes, ["nonunique-rule"]);
  assert.deepEqual(items[18].diagnosticEligibility.reasonCodes, ["nonunique-rule"]);
  assert.deepEqual(items[20].diagnosticEligibility.reasonCodes, ["whole-number-zero-scope-review"]);

  const unlocked = structuredClone(taxonomy.COMPANION);
  unlocked.releaseLocks.domainDiagnosis = false;
  assert.throws(function () { taxonomy.validateCompanion(unlocked); }, /release locks/);
  const missingReason = structuredClone(taxonomy.COMPANION);
  missingReason.items[8].diagnosticEligibility.reasonCodes = [];
  assert.throws(function () { taxonomy.validateCompanion(missingReason); }, /review reason/);
  const answerBearing = structuredClone(taxonomy.COMPANION);
  answerBearing.items[0].answerValue = "forbidden";
  assert.throws(function () { taxonomy.validateCompanion(answerBearing); }, /unsupported fields/);

  const zeroFingerprint = structuredClone(taxonomy.COMPANION);
  zeroFingerprint.taxonomyFingerprintSha256 = "0".repeat(64);
  assert.throws(function () { taxonomy.validateCompanion(zeroFingerprint); }, /identity/);
  const changedClassification = structuredClone(taxonomy.COMPANION);
  changedClassification.items[0].gfieldContentAxis = "geometry-spatial";
  assert.throws(function () { taxonomy.validateCompanion(changedClassification); }, /fingerprint mismatch/);
  const sparseStrands = structuredClone(taxonomy.COMPANION);
  sparseStrands.items[0].officialSyllabusStrands = Array(1);
  assert.throws(function () { taxonomy.validateCompanion(sparseStrands); }, /officialSyllabusStrands is invalid/);
  const sparseMethods = structuredClone(taxonomy.COMPANION);
  sparseMethods.items[0].reasoningMethods = Array(1);
  assert.throws(function () { taxonomy.validateCompanion(sparseMethods); }, /reasoningMethods is invalid/);
});

test("the reviewed eligible migration count is 10, 0, 5, 5, 1 and totals 21", function () {
  const counts = Object.fromEntries(taxonomy.GFIELD_CONTENT_AXES.map(function (axis) { return [axis, 0]; }));
  taxonomy.COMPANION.items.forEach(function (item) {
    if (item.diagnosticEligibility.state !== "eligible") return;
    assert.ok(item.gfieldContentAxis, `reviewed migration axis missing for Q${item.questionNumber}`);
    counts[item.gfieldContentAxis] += 1;
  });
  assert.deepEqual(counts, {
    "number-operations": 10,
    "patterns-algebra": 0,
    "geometry-spatial": 5,
    "combinatorics-logic": 5,
    "data-probability": 1
  });
  assert.equal(Object.values(counts).reduce(function (sum, count) { return sum + count; }, 0), 21);
});

test("the draft companion is not imported by scoring, reporting, or planning runtimes", function () {
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
    "learning-plan.js"
  ].forEach(function (relativePath) {
    const source = fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
    assert.doesNotMatch(source, /sasmo-2019-g6-taxonomy-companion/);
  });
});

test("the review-only companion has no browser global or load-time side effect", function () {
  const source = fs.readFileSync(path.resolve(__dirname, "../competition/sasmo-2019-g6-taxonomy-companion.js"), "utf8");
  const browserContext = {};
  vm.runInNewContext(source, browserContext, { filename: "sasmo-2019-g6-taxonomy-companion.js" });
  assert.deepEqual(Object.keys(browserContext), []);
});
