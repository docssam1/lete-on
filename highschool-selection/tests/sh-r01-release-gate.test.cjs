const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const security = require(path.join(root, "shared", "review-security.js"));
const review = require(path.join(root, "data", "review-only", "sh-r01-inventory.js"));
const gate = require(path.join(root, "shared", "sh-r01-release-gate.js"));
require(path.join(root, "data", "catalog.js"));
const exam = globalThis.HIGHSELECT_CATALOG.exams.find(item => item.id === security.EXAM_ID);

function packet(resolved) {
  return {
    examId: security.EXAM_ID,
    roundCode: security.ROUND_CODE,
    reviewVersion: "rv-20260822-fastlane",
    examChecks: {
      responseSchemaStatus: resolved ? "verified" : "pending",
      scoringPolicyStatus: resolved ? "verified" : "pending",
      printAuditStatus: resolved ? "passed" : "pending",
      signedAssetStatus: resolved ? "verified" : "pending"
    },
    items: review.inventory.items.map(item => ({
      itemId: item.id,
      number: item.number,
      answerStatus: resolved ? "verified" : "pending",
      classificationStatus: resolved ? "verified" : "pending",
      visualStatus: resolved ? "passed" : "pending",
      sourceFingerprintMatched: resolved,
      correctionArtifactMatched: resolved || !review.inventory.releaseBlockerSummary.items.includes(item.number),
      resolutionStatus: resolved ? (item.number === 3 ? "replacement_verified" : "agent_verified") : "pending"
    }))
  };
}

function inventoryWithExecutedCorrections() {
  return {
    ...review.inventory,
    agentDecisionSummary: {
      ...review.inventory.agentDecisionSummary,
      items: review.inventory.agentDecisionSummary.items.map(decision => ({
        ...decision,
        executionStatus: decision.disposition === "replace" ? "replacement_verified" : "agent_verified"
      }))
    }
  };
}

function inventoryWithPendingCorrections() {
  return {
    ...review.inventory,
    agentDecisionSummary: {
      ...review.inventory.agentDecisionSummary,
      items: review.inventory.agentDecisionSummary.items.map(decision => ({
        ...decision,
        executionStatus: decision.number === 3 ? "replacement_verified" : "pending"
      }))
    }
  };
}

test("current SH-R01 remains locked after classification and correction audits while item gates are pending", () => {
  const current = gate.evaluate(exam, review.inventory, packet(false), null);
  assert.equal(current.counts.itemCount, 40);
  assert.equal(current.counts.releaseBlockerPendingCount, 9);
  assert.equal(current.counts.correctionExecutionPendingCount, 0);
  assert.equal(current.counts.classificationPendingCount, 0);
  assert.equal(current.counts.unresolvedItemCount, 40);
  assert.deepEqual(current.releaseBlockerPendingItems, [3, 4, 8, 10, 11, 30, 33, 34, 39]);
  assert.deepEqual(current.correctionExecutionPendingItems, []);
  assert.deepEqual(current.classificationPendingItems, []);
  assert.equal(review.inventory.classificationReviewSummary.agentVerified, 12);
  assert.equal(current.readyForFinalConfirmation, false);
  assert.equal(current.canPromoteCatalog, false);
  assert.equal(current.canServeStudents, false);
});

test("Q3 must use a verified replacement while the eight keep decisions require agent verification", () => {
  const wrong = packet(true);
  wrong.items[2].resolutionStatus = "agent_verified";
  const q3 = gate.evaluate(exam, review.inventory, wrong, null);
  assert.deepEqual(q3.releaseBlockerPendingItems, [3]);
  assert.equal(q3.readyForFinalConfirmation, false);

  const correct = packet(true);
  correct.items[3].resolutionStatus = "replacement_verified";
  const q4 = gate.evaluate(exam, review.inventory, correct, null);
  assert.deepEqual(q4.releaseBlockerPendingItems, [4]);
  assert.equal(q4.readyForFinalConfirmation, false);
});

test("all agent resolutions lead to one final exam confirmation, never forty owner approvals", () => {
  const resolved = packet(true);
  const readyInventory = inventoryWithExecutedCorrections();
  const readiness = gate.evaluate(exam, readyInventory, resolved, null);
  assert.equal(readiness.readyForFinalConfirmation, true);
  assert.equal(readiness.finalConfirmed, false);
  assert.equal(readiness.canServeStudents, false);

  const confirmation = gate.buildFinalConfirmationRequest(exam, readyInventory, resolved);
  assert.deepEqual(confirmation, {
    examId: security.EXAM_ID,
    roundCode: security.ROUND_CODE,
    reviewVersion: resolved.reviewVersion,
    confirmation: "confirmed",
    itemCount: 40,
    activeItemCount: 40,
    excludedItemCount: 0
  });

  const preRelease = gate.evaluate(exam, readyInventory, resolved, confirmation);
  assert.equal(preRelease.canPromoteCatalog, true);
  assert.equal(preRelease.canServeStudents, false);

  const releasedExam = Object.assign({}, exam, {
    answerStatus: "verified",
    classificationStatus: "verified",
    releaseStatus: "released"
  });
  const released = gate.evaluate(releasedExam, readyInventory, resolved, confirmation);
  assert.equal(released.finalConfirmed, true);
  assert.equal(released.canServeStudents, true);
});

test("response schema, scoring, print, and signed assets are mandatory whole-exam gates", () => {
  const resolved = packet(true);
  const readyInventory = inventoryWithExecutedCorrections();
  const fields = ["responseSchemaStatus", "scoringPolicyStatus", "printAuditStatus", "signedAssetStatus"];
  fields.forEach(field => {
    const broken = packet(true);
    broken.examChecks[field] = "pending";
    const result = gate.evaluate(exam, readyInventory, broken, null);
    assert.equal(result.readyForFinalConfirmation, false, field);
    assert.equal(result.examChecksReady, false, field);
  });
  assert.equal(gate.evaluate(exam, readyInventory, resolved, null).examChecksReady, true);
});

test("status rows cannot bypass pending correction executions or missing protected artifacts", () => {
  const resolved = packet(true);
  const pendingExecution = gate.evaluate(exam, inventoryWithPendingCorrections(), resolved, null);
  assert.equal(pendingExecution.readyForFinalConfirmation, false);
  assert.deepEqual(pendingExecution.correctionExecutionPendingItems, [4, 8, 10, 11, 30, 33, 34, 39]);

  const readyInventory = inventoryWithExecutedCorrections();
  resolved.items[3].correctionArtifactMatched = false;
  const missingArtifact = gate.evaluate(exam, readyInventory, resolved, null);
  assert.equal(missingArtifact.readyForFinalConfirmation, false);
  assert.ok(missingArtifact.unresolvedItems.includes(4));
  assert.ok(missingArtifact.releaseBlockerPendingItems.includes(4));

  resolved.items[3].resolutionStatus = "scoring_excluded";
  const excludedWithoutArtifact = gate.evaluate(exam, readyInventory, resolved, null);
  assert.equal(excludedWithoutArtifact.readyForFinalConfirmation, false);
  assert.ok(excludedWithoutArtifact.releaseBlockerPendingItems.includes(4));
});

test("a safely excluded uncertain item changes the final scoring denominator explicitly", () => {
  const resolved = packet(true);
  const readyInventory = inventoryWithExecutedCorrections();
  resolved.items[7].answerStatus = "blocked";
  resolved.items[7].classificationStatus = "blocked";
  resolved.items[7].resolutionStatus = "scoring_excluded";
  const readiness = gate.evaluate(exam, readyInventory, resolved, null);
  assert.equal(readiness.readyForFinalConfirmation, true);
  assert.equal(readiness.counts.activeItemCount, 39);
  assert.equal(readiness.counts.excludedItemCount, 1);
  assert.deepEqual(gate.buildFinalConfirmationRequest(exam, readyInventory, resolved), {
    examId: security.EXAM_ID,
    roundCode: security.ROUND_CODE,
    reviewVersion: resolved.reviewVersion,
    confirmation: "confirmed",
    itemCount: 40,
    activeItemCount: 39,
    excludedItemCount: 1
  });
});

test("release status and admin UI expose no answers, originals, or private locations", () => {
  const resolved = packet(true);
  const confirmation = gate.buildFinalConfirmationRequest(exam, inventoryWithExecutedCorrections(), resolved);
  const leaked = Object.assign({}, confirmation, { sourcePath: "G:\\private\\source.pdf" });
  assert.ok(gate.validateFinalConfirmation(leaked, resolved, { itemCount: 40, activeItemCount: 40, excludedItemCount: 0 }).some(issue => issue.includes("forbidden") || issue.includes("private_location")));

  const html = fs.readFileSync(path.join(root, "admin", "review.html"), "utf8");
  const page = fs.readFileSync(path.join(root, "shared", "review-page.js"), "utf8");
  assert.match(html, /최종 1회 확인/);
  assert.match(html, /sh-r01-release-gate\.js/);
  assert.match(page, /buildFinalConfirmationRequest/);
  assert.equal(/correctAnswer|answerKey|questionText|sourcePath|pdfUrl/.test(html + page), false);
  assert.equal(/사용자 승인|data-decision="approve"/.test(html + page), false);
});
