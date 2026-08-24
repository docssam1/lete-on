const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");

const { createApp } = require("../server/app.js");
const { hashApprovalCode } = require("../server/security.js");
const inventory = require("../data/review-only/sh-r01-inventory.js").inventory;

const SECRET = "review-test-session-secret-with-at-least-32-characters";
const EXAM_ID = "sh-selection-r01";
const NOW = Date.parse("2026-08-24T03:00:00.000Z");
const PUBLIC_ORIGIN = "https://assets.example.test";

function config(root) {
  return {
    schemaVersion: "highselect-private-config/v1",
    students: [
      { studentId: "admin_review", name: "검수관리자", approvalCodeHash: hashApprovalCode("ADMIN-REVIEW", Buffer.alloc(16, 3).toString("base64url")), role: "admin", grants: [] },
      { studentId: "student_locked", name: "잠금학생", approvalCodeHash: hashApprovalCode("STUDENT-LOCK", Buffer.alloc(16, 4).toString("base64url")), grants: [EXAM_ID] }
    ],
    exams: {
      [EXAM_ID]: {
        pageAssetRoot: root,
        pageCount: 8,
        questionCount: 40,
        sourceStatus: "audited",
        releaseStatus: "review_pending",
        answerStatus: "verified",
        classificationStatus: "verified",
        responseSchemaStatus: "verified",
        scoringPolicyStatus: "verified",
        printAuditStatus: "passed",
        signedAssetsStatus: "verified",
        assetPolicy: "signed-page-images",
        finalRoundConfirmation: false
      }
    }
  };
}

function privateReviews(root, resolved) {
  const evidence = ["problem", "source-key", "independent-audit"].map((role, index) => {
    const assetPath = path.join(root, `q3-${role}.png`);
    fs.writeFileSync(assetPath, Buffer.from([137, 80, 78, 71, index]));
    return { role, assetPath, mimeType: "image/png" };
  });
  return {
    schemaVersion: "highselect-private-reviews/v1",
    reviews: {
      [EXAM_ID]: {
        examId: EXAM_ID,
        roundCode: "SH-R01",
        reviewVersion: "rv-test-20260824",
        examChecks: {
          responseSchemaStatus: "verified",
          scoringPolicyStatus: "verified",
          printAuditStatus: "passed",
          signedAssetStatus: "verified"
        },
        items: inventory.items.map(item => ({
          itemId: item.id,
          number: item.number,
          answerStatus: "verified",
          classificationStatus: "verified",
          visualStatus: "passed",
          sourceFingerprintMatched: true,
          correctionArtifactMatched: true,
          resolutionStatus: resolved ? (item.number === 3 ? "replacement_verified" : "agent_verified") : "pending",
          scoringExclusionAllowed: item.number === 8,
          evidencePanels: item.number === 3 ? evidence : []
        })),
        finalConfirmation: null
      }
    }
  };
}

async function start(resolved = false, mutateConfig) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "highselect-review-api-"));
  const privateConfig = config(root);
  if (typeof mutateConfig === "function") mutateConfig(privateConfig);
  const app = createApp({
    sessionSecret: SECRET,
    assetSecret: `${SECRET}-asset`,
    privateConfig,
    privateReviews: privateReviews(root, resolved),
    privateScorer: { schemaVersion: "highselect-private-scorer/v1", exams: {} },
    publicOrigin: PUBLIC_ORIGIN,
    cookieSecure: false,
    now: () => NOW,
    staticRoot: path.join(__dirname, "..")
  });
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  return { server, root, base: `http://127.0.0.1:${server.address().port}` };
}

async function login(base, name, approvalCode) {
  const response = await fetch(`${base}/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, approvalCode })
  });
  return { response, cookie: String(response.headers.get("set-cookie") || "").split(";")[0] };
}

function mutationHeaders(cookie, origin) {
  return { Cookie: cookie, Origin: origin, "Content-Type": "application/json", "X-Highselect-Admin": "1" };
}

test("review status is admin-only, no-store, and contains no answers or private paths", async t => {
  const env = await start();
  t.after(() => { env.server.close(); fs.rmSync(env.root, { recursive: true, force: true }); });
  assert.equal((await fetch(`${env.base}/admin/exam-reviews/${EXAM_ID}`)).status, 401);
  const student = await login(env.base, "잠금학생", "STUDENT-LOCK");
  assert.equal((await fetch(`${env.base}/admin/exam-reviews/${EXAM_ID}`, { headers: { Cookie: student.cookie } })).status, 403);
  const admin = await login(env.base, "검수관리자", "ADMIN-REVIEW");
  const response = await fetch(`${env.base}/admin/exam-reviews/${EXAM_ID}`, { headers: { Cookie: admin.cookie } });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const packet = await response.json();
  assert.equal(packet.items.length, 40);
  assert.equal(packet.items.every(item => item.resolutionStatus === "pending"), true);
  assert.equal(/answerKey|correctAnswer|sourcePath|assetPath|scoringExclusionAllowed/.test(JSON.stringify(packet)), false);
});

test("item resolution enforces current evidence, correction plan, CSRF headers, and one-way pending state", async t => {
  const env = await start();
  t.after(() => { env.server.close(); fs.rmSync(env.root, { recursive: true, force: true }); });
  const admin = await login(env.base, "검수관리자", "ADMIN-REVIEW");
  const packet = await (await fetch(`${env.base}/admin/exam-reviews/${EXAM_ID}`, { headers: { Cookie: admin.cookie } })).json();
  const q3 = packet.items[2];
  const baseBody = { examId: EXAM_ID, itemId: q3.itemId, number: 3, reviewVersion: packet.reviewVersion };
  const csrf = await fetch(`${env.base}/admin/exam-reviews/${EXAM_ID}/items/3/resolution`, {
    method: "POST", headers: { Cookie: admin.cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ ...baseBody, decision: "replacement_verified", resolutionStatus: "replacement_verified" })
  });
  assert.equal(csrf.status, 403);
  const wrongPlan = await fetch(`${env.base}/admin/exam-reviews/${EXAM_ID}/items/3/resolution`, {
    method: "POST", headers: mutationHeaders(admin.cookie, PUBLIC_ORIGIN),
    body: JSON.stringify({ ...baseBody, decision: "agent_verify", resolutionStatus: "agent_verified" })
  });
  assert.equal(wrongPlan.status, 409);
  const accepted = await fetch(`${env.base}/admin/exam-reviews/${EXAM_ID}/items/3/resolution`, {
    method: "POST", headers: mutationHeaders(admin.cookie, PUBLIC_ORIGIN),
    body: JSON.stringify({ ...baseBody, decision: "replacement_verified", resolutionStatus: "replacement_verified" })
  });
  assert.equal(accepted.status, 200);
  assert.equal((await accepted.json()).items[2].resolutionStatus, "replacement_verified");
  const duplicate = await fetch(`${env.base}/admin/exam-reviews/${EXAM_ID}/items/3/resolution`, {
    method: "POST", headers: mutationHeaders(admin.cookie, PUBLIC_ORIGIN),
    body: JSON.stringify({ ...baseBody, decision: "replacement_verified", resolutionStatus: "replacement_verified" })
  });
  assert.equal(duplicate.status, 409);
});

test("final confirmation requires the complete round and never releases the student exam automatically", async t => {
  const pendingEnv = await start(false);
  t.after(() => { pendingEnv.server.close(); fs.rmSync(pendingEnv.root, { recursive: true, force: true }); });
  const pendingAdmin = await login(pendingEnv.base, "검수관리자", "ADMIN-REVIEW");
  const blocked = await fetch(`${pendingEnv.base}/admin/exam-reviews/${EXAM_ID}/final-confirmation`, {
    method: "POST", headers: mutationHeaders(pendingAdmin.cookie, PUBLIC_ORIGIN),
    body: JSON.stringify({ examId: EXAM_ID, roundCode: "SH-R01", reviewVersion: "rv-test-20260824", confirmation: "confirmed", itemCount: 40, activeItemCount: 40, excludedItemCount: 0 })
  });
  assert.equal(blocked.status, 409);

  const unboundEnv = await start(true, value => { delete value.exams[EXAM_ID].sourceStatus; });
  t.after(() => { unboundEnv.server.close(); fs.rmSync(unboundEnv.root, { recursive: true, force: true }); });
  const unboundAdmin = await login(unboundEnv.base, "검수관리자", "ADMIN-REVIEW");
  const unbound = await fetch(`${unboundEnv.base}/admin/exam-reviews/${EXAM_ID}/final-confirmation`, {
    method: "POST", headers: mutationHeaders(unboundAdmin.cookie, PUBLIC_ORIGIN),
    body: JSON.stringify({ examId: EXAM_ID, roundCode: "SH-R01", reviewVersion: "rv-test-20260824", confirmation: "confirmed", itemCount: 40, activeItemCount: 40, excludedItemCount: 0 })
  });
  assert.equal(unbound.status, 409);

  const env = await start(true);
  t.after(() => { env.server.close(); fs.rmSync(env.root, { recursive: true, force: true }); });
  const admin = await login(env.base, "검수관리자", "ADMIN-REVIEW");
  const confirmed = await fetch(`${env.base}/admin/exam-reviews/${EXAM_ID}/final-confirmation`, {
    method: "POST", headers: mutationHeaders(admin.cookie, PUBLIC_ORIGIN),
    body: JSON.stringify({ examId: EXAM_ID, roundCode: "SH-R01", reviewVersion: "rv-test-20260824", confirmation: "confirmed", itemCount: 40, activeItemCount: 40, excludedItemCount: 0 })
  });
  assert.equal(confirmed.status, 200);
  assert.equal((await confirmed.json()).finalConfirmation.confirmation, "confirmed");
  const student = await login(env.base, "잠금학생", "STUDENT-LOCK");
  const stillLocked = await fetch(`${env.base}/exams/${EXAM_ID}/response-schema`, { headers: { Cookie: student.cookie } });
  assert.equal(stillLocked.status, 423);
});

test("evidence endpoint returns three short-lived signed images and rejects a tampered signature", async t => {
  const env = await start();
  t.after(() => { env.server.close(); fs.rmSync(env.root, { recursive: true, force: true }); });
  const admin = await login(env.base, "검수관리자", "ADMIN-REVIEW");
  const response = await fetch(`${env.base}/admin/exam-reviews/${EXAM_ID}/items/3/evidence`, { headers: { Cookie: admin.cookie } });
  assert.equal(response.status, 200);
  const packet = await response.json();
  assert.deepEqual(packet.panels.map(panel => panel.role), ["problem", "source-key", "independent-audit"]);
  assert.equal(/assetPath|sourcePath|answer/.test(JSON.stringify(packet)), false);
  const signed = new URL(packet.panels[0].url);
  const valid = await fetch(`${env.base}${signed.pathname}${signed.search}`, { headers: { Cookie: admin.cookie } });
  assert.equal(valid.status, 200);
  assert.equal(valid.headers.get("cache-control"), "private, no-store");
  signed.searchParams.set("sig", "tampered");
  const tampered = await fetch(`${env.base}${signed.pathname}${signed.search}`, { headers: { Cookie: admin.cookie } });
  assert.equal(tampered.status, 403);
});
