"use strict";

const fs = require("node:fs");
const path = require("node:path");

const local = require("../assessment/private-grade6-local-runtime.cjs");
const clinicPaths = require("../learning/clinic-paths.js");
const planEngine = require("../learning/learner-plan-engine.js");

const root = path.resolve(__dirname, "..");
const privateDirectory = path.resolve(process.argv[2] || path.join(root, "private-authoring"));
const outputPath = process.argv[3] ? path.resolve(process.argv[3]) : null;
const EXPECTED_PENDING_WORKBOOKS = new Set(["6.SP.B"]);

function fail(message) { throw new Error(message); }
function sortedObject(source) {
  return Object.fromEntries(Object.keys(source).sort().map(function (key) { return [key, source[key]]; }));
}
function errorTypesFor(item) {
  const draft = item.privateDraft || {};
  return Array.from(new Set((draft.errorSignals || []).map(function (signal) { return signal.errorType; }).concat(draft.defaultErrorType || []).filter(Boolean))).sort();
}
function buildPlan(item, errorType) {
  return planEngine.buildPlan({
    goalId: "school-g6",
    startDate: "2026-10-03",
    targetDate: "2026-11-28",
    availability: { studyDaysPerWeek: 4, minutesPerDay: 45 },
    priorities: [{ label: item.clusterId, clusterId: item.clusterId, errorType: errorType, difficulty: item.difficulty }]
  });
}

const items = local.loadPrivateAuthoring(privateDirectory).items;
if (items.length !== 42) fail(`expected 42 private Grade 6 items, received ${items.length}`);

const clusters = {};
const errorTypeCoverage = {};
let conceptRoutes = 0;
let workbookRoutes = 0;
let reviewedErrorProfiles = 0;

items.forEach(function (item) {
  const route = clinicPaths.routeFor(item.clusterId, { fromDiagnostic: true, workbookCompleted: false });
  if (route.source !== "diagnostic-reviewed-route" || route.concept.state !== "available" || !route.concept.url.includes("from=diagnostic")) fail(`concept route is incomplete for ${item.clusterId}`);
  conceptRoutes += 1;
  const cluster = clusters[item.clusterId] || { itemCount: 0, conceptState: route.concept.state, workbookState: route.workbook.state, errorProfileChecks: 0 };
  cluster.itemCount += 1;
  if (route.workbook.state === "available") workbookRoutes += 1;
  else if (!EXPECTED_PENDING_WORKBOOKS.has(item.clusterId)) fail(`unexpected workbook gap for ${item.clusterId}`);

  const types = errorTypesFor(item);
  if (!types.length) fail(`missing error profile for ${item.clusterId}`);
  types.forEach(function (errorType) {
    const plan = buildPlan(item, errorType);
    if (plan.priorities[0].errorType !== errorType || plan.today.blocks.length !== 5 || plan.today.blocks.reduce(function (sum, block) { return sum + block.minutes; }, 0) !== 45) fail(`daily plan contract failed for ${item.clusterId} ${errorType}`);
    errorTypeCoverage[errorType] = (errorTypeCoverage[errorType] || 0) + 1;
    cluster.errorProfileChecks += 1;
    reviewedErrorProfiles += 1;
  });
  clusters[item.clusterId] = cluster;
});

const pendingClusters = Object.keys(clusters).filter(function (clusterId) { return clusters[clusterId].workbookState !== "available"; });
if (pendingClusters.some(function (clusterId) { return !EXPECTED_PENDING_WORKBOOKS.has(clusterId); })) fail("unapproved workbook gap found");
if (Array.from(EXPECTED_PENDING_WORKBOOKS).some(function (clusterId) { return !pendingClusters.includes(clusterId); })) fail("expected workbook gap changed; review the audit contract");

const report = {
  schemaVersion: "gfield-grade6-prescription-chain-audit-v1",
  generatedAt: new Date().toISOString(),
  sourceState: "private-authoring-read-only",
  privacy: {
    includesQuestionText: false,
    includesStudentResponses: false,
    includesAnswers: false,
    includesSolutions: false
  },
  counts: {
    items: items.length,
    conceptRoutes: conceptRoutes,
    workbookRoutes: workbookRoutes,
    workbookPendingItems: items.length - workbookRoutes,
    reviewedErrorProfiles: reviewedErrorProfiles
  },
  errorTypeCoverage: sortedObject(errorTypeCoverage),
  clusters: sortedObject(clusters),
  pending: pendingClusters.map(function (clusterId) {
    return {
      clusterId: clusterId,
      itemCount: clusters[clusterId].itemCount,
      state: "locked-pending-independent-36-item-workbook-review",
      reason: "A reviewed cluster-specific workbook is not available; a bridge workbook is not treated as mastery evidence."
    };
  }),
  result: pendingClusters.length ? "verified-with-explicit-locked-gap" : "verified-complete"
};

const json = `${JSON.stringify(report, null, 2)}\n`;
if (outputPath) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, json, "utf8");
}
process.stdout.write(json);
