const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const inventory = require(path.join(root, "data", "review-only", "sh-r01-inventory.js")).inventory;
const security = require(path.join(root, "shared", "review-summary-security.js"));

test("round summary combines exactly nine remediations and twelve classification audits", () => {
  const summary = security.createSummary(inventory);
  assert.deepEqual(security.validateSummary(summary, inventory), []);
  assert.equal(summary.items.length, 21);
  assert.equal(summary.blockedCount, 9);
  assert.equal(summary.classificationCount, 12);
  assert.deepEqual(summary.items.filter(row => row.queue === "blocked").map(row => row.number), [3, 4, 8, 10, 11, 30, 33, 34, 39]);
  assert.deepEqual(summary.items.filter(row => row.queue === "classification").map(row => row.number), [2, 6, 9, 14, 18, 21, 23, 24, 27, 28, 29, 36]);
  assert.equal(summary.items.find(row => row.number === 3).action, "replace");
  assert.equal(summary.items.find(row => row.number === 3).label, "동형 교체·독립검산 완료");
  assert.equal(summary.items.find(row => row.number === 3).protectedArtifactStatus, "verified");
  assert.equal(summary.items.find(row => row.number === 3).status, "agent-reviewed");
  assert.equal(summary.items.find(row => row.number === 4).label, "채점 키 교정");
  assert.equal(summary.items.find(row => row.number === 4).status, "agent-reviewed");
  assert.equal(summary.items.filter(row => [8, 10, 11].includes(row.number)).every(row => row.label === "독립검산 답 적용"), true);
  assert.equal(summary.items.find(row => row.number === 30).label, "원문 오기 교정");
  assert.equal(summary.items.find(row => row.number === 33).label, "풀이 오기 교정");
  assert.equal(summary.items.find(row => row.number === 34).label, "풀이 오기 교정");
  assert.equal(summary.items.find(row => row.number === 39).label, "표 레이아웃 보정");
  assert.equal(summary.originalPreserved, true);
  assert.equal(summary.protectedValuesIncluded, false);
});

test("change-log summary cannot request a final decision without the full release gate", () => {
  const summary = security.createSummary(inventory);
  const packet = security.createPendingRoundPacket();
  assert.equal(security.canRequestRoundApproval(summary, packet, inventory), false);
  assert.equal(security.canRequestRoundApproval(summary, packet, inventory, { readyForFinalConfirmation: true }), false);
  assert.throws(() => security.buildRoundDecisionRequest(summary, packet, inventory, "approve", { readyForFinalConfirmation: true }));
  assert.throws(() => security.buildRoundDecisionRequest(summary, packet, inventory, "exclude"));
  const leakedSummary = { ...summary, correctAnswer: "hidden" };
  assert.ok(security.validateSummary(leakedSummary, inventory).some(issue => issue.includes("forbidden")));
  const leakedPacket = { ...packet, privateLocation: "G:\\private\\source.pdf" };
  assert.ok(security.validateRoundPacket(leakedPacket).some(issue => issue.includes("private_location")));
});

test("round approval never releases or assembles the exam by itself", () => {
  const summary = security.createSummary(inventory);
  const approved = { ...security.createPendingRoundPacket(), decision: "approved" };
  const gate = security.evaluateReleaseGate(summary, approved, inventory);
  assert.equal(gate.canAssemble, false);
  assert.equal(gate.canRelease, false);
  assert.ok(gate.issues.includes("release.full_item_gate_required"));
  assert.ok(gate.issues.includes("release.final_print_proof_required"));
});

test("summary UI is admin-only and keeps answers, originals, and private paths out", () => {
  const html = fs.readFileSync(path.join(root, "admin", "review-summary.html"), "utf8");
  const page = fs.readFileSync(path.join(root, "shared", "review-summary-page.js"), "utf8");
  const combined = html + page;
  assert.match(html, /검수 변경이력 한 번에 확인/);
  assert.match(html, /차단 해소 9문항/);
  assert.match(html, /분류 검수 12문항/);
  assert.match(page, /requireAdmin/);
  assert.match(page, /HIGHSELECT_SH_R01_RELEASE_GATE/);
  assert.match(page, /buildFinalConfirmationRequest/);
  assert.equal(page.includes("/round-decision"), false);
  assert.match(page, /final-confirmation/);
  assert.match(page, /X-Highselect-Admin/);
  assert.match(page, /보호 산출물 확인/);
  assert.equal(/localStorage\.setItem|sessionStorage\.setItem|[A-Za-z]:[\\/]|file:\/\//.test(combined), false);
  ["questionText", "correctAnswer", "sourcePath", "pdfUrl", "downloadUrl"].forEach(term => {
    assert.equal(combined.includes(term), false, `${term} must not appear in the summary UI`);
  });
});
