const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");

const { createApp } = require("../server/app.js");
const { hashApprovalCode } = require("../server/security.js");
const editorCore = require("../data/exam-editor-core.js");
const draftStoreModule = require("../server/exam-draft-store.js");

const SECRET = "exam-editor-server-test-secret-with-32-characters";

function candidate(itemId, overrides = {}) {
  return Object.assign({
    itemId,
    itemVersionId: `${itemId}-v1`,
    curriculumPath: "2022/HS/ALGEBRA/NUMBER",
    typeCode: "ALG_NUMBER_PATTERN",
    difficultyBand: "raised",
    inputType: "input",
    figureRequired: false,
    figureStatus: "verified",
    releaseStatus: "approved",
    classificationStatus: "verified",
    answerStatus: "verified",
    singleAnswerStatus: "verified",
    userApprovalStatus: "approved"
  }, overrides);
}

function registryData() {
  return {
    schemaVersion: "highselect-private-exam-editor-registry/v1",
    candidates: {
      q_001: candidate("q_001"),
      q_002: candidate("q_002"),
      q_003: candidate("q_003", { curriculumPath: "2022/HS/GEOMETRY/SOLID", typeCode: "GEO_SOLID" }),
      q_locked: candidate("q_locked", { userApprovalStatus: "pending" })
    },
    relations: {
      ev_q1_q2: {
        evidenceId: "ev_q1_q2",
        status: "approved",
        relationship: "twin",
        sourceItemId: "q_001",
        sourceItemVersionId: "q_001-v1",
        candidateItemId: "q_002",
        candidateItemVersionId: "q_002-v1",
        familyMatched: true,
        detailMatched: true,
        solutionStructureMatched: true,
        difficultyCompatible: true
      }
    }
  };
}

function privateConfig() {
  return {
    schemaVersion: "highselect-private-config/v1",
    students: [
      {
        studentId: "admin_editor",
        name: "편집관리자",
        approvalCodeHash: hashApprovalCode("ADMIN-EDITOR", Buffer.alloc(16, 1).toString("base64url")),
        role: "admin",
        grants: []
      },
      {
        studentId: "student_editor",
        name: "일반학생",
        approvalCodeHash: hashApprovalCode("STUDENT-EDITOR", Buffer.alloc(16, 2).toString("base64url")),
        role: "student",
        grants: []
      }
    ],
    exams: {}
  };
}

async function start() {
  const app = createApp({
    sessionSecret: SECRET,
    assetSecret: `${SECRET}-asset`,
    privateConfig: privateConfig(),
    privateScorer: { schemaVersion: "highselect-private-scorer/v1", exams: {} },
    privateExamEditorRegistry: registryData(),
    privateExamDrafts: { schemaVersion: "highselect-private-exam-drafts/v1", drafts: {} },
    cookieSecure: false,
    staticRoot: path.join(__dirname, "..")
  });
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  return { server, base: `http://127.0.0.1:${server.address().port}` };
}

async function login(base, name = "편집관리자", approvalCode = "ADMIN-EDITOR") {
  const response = await fetch(`${base}/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, approvalCode })
  });
  return { response, cookie: String(response.headers.get("set-cookie") || "").split(";")[0] };
}

function adminHeaders(cookie, origin) {
  return { Cookie: cookie, Origin: origin, "Content-Type": "application/json", "X-Highselect-Admin": "1" };
}

function assertNoPrivateFields(value) {
  if (!value || typeof value !== "object") return;
  Object.entries(value).forEach(function ([key, child]) {
    assert.equal(/answer|solution|explanation|sourcepath|storagepath|pdfurl/i.test(key), false, `private key leaked: ${key}`);
    assertNoPrivateFields(child);
  });
}

test("candidate search is admin-only, release-gated and metadata-only", async t => {
  const env = await start();
  t.after(() => env.server.close());

  assert.equal((await fetch(`${env.base}/admin/exam-editor/candidates`)).status, 401);
  const student = await login(env.base, "일반학생", "STUDENT-EDITOR");
  assert.equal((await fetch(`${env.base}/admin/exam-editor/candidates`, { headers: { Cookie: student.cookie } })).status, 403);

  const admin = await login(env.base);
  const response = await fetch(`${env.base}/admin/exam-editor/candidates?scopeKey=2022%2FHS%2FALGEBRA&limit=10`, {
    headers: { Cookie: admin.cookie }
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const packet = await response.json();
  assert.deepEqual(packet.items.map(item => item.itemId), ["q_001", "q_002"]);
  assert.equal(packet.items.every(item => item.eligible === true), true);
  assertNoPrivateFields(packet);
  assert.equal(JSON.stringify(packet).includes("q_locked"), false);

  const related = await fetch(`${env.base}/admin/exam-editor/candidates?sourceItemId=q_001&sourceItemVersionId=q_001-v1&relationship=twin`, {
    headers: { Cookie: admin.cookie }
  });
  assert.equal(related.status, 200);
  const relatedPacket = await related.json();
  assert.deepEqual(relatedPacket.items.map(item => [item.itemId, item.replacement.evidenceId]), [["q_002", "ev_q1_q2"]]);
  assertNoPrivateFields(relatedPacket);

  assert.equal((await fetch(`${env.base}/admin/exam-editor/candidates?unknown=1`, { headers: { Cookie: admin.cookie } })).status, 400);
  assert.equal((await fetch(`${env.base}/admin/exam-editor/candidates?sourceItemId=q_001&relationship=twin`, { headers: { Cookie: admin.cookie } })).status, 400);
});

test("draft editing enforces origin, revision CAS, item versions and server-side replacement evidence", async t => {
  const env = await start();
  t.after(() => env.server.close());
  const admin = await login(env.base);

  const createBody = {
    profileId: "profile_hs_selection",
    targetId: "target_mock_r01",
    durationMinutes: 60,
    scopeKeys: ["2022/HS/ALGEBRA"]
  };
  const csrfBlocked = await fetch(`${env.base}/admin/exam-editor/drafts`, {
    method: "POST",
    headers: { Cookie: admin.cookie, "Content-Type": "application/json" },
    body: JSON.stringify(createBody)
  });
  assert.equal(csrfBlocked.status, 403);

  const createdResponse = await fetch(`${env.base}/admin/exam-editor/drafts`, {
    method: "POST",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify(createBody)
  });
  assert.equal(createdResponse.status, 201);
  const created = await createdResponse.json();
  assert.equal(created.draft.revision, 1);
  assert.deepEqual(created.draft.placements, []);
  assertNoPrivateFields(created);

  const draftUrl = `${env.base}/admin/exam-editor/drafts/${encodeURIComponent(created.draftId)}`;
  const addResponse = await fetch(draftUrl, {
    method: "PATCH",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({
      expectedRevision: 1,
      operation: { kind: "add", placementId: "placement_001", itemId: "q_001", itemVersionId: "q_001-v1", score: 2, selectionKind: "manual" }
    })
  });
  assert.equal(addResponse.status, 200);
  const added = await addResponse.json();
  assert.equal(added.record.draft.revision, 2);
  assert.equal(added.record.draft.placements[0].itemVersionId, "q_001-v1");

  const staleResponse = await fetch(draftUrl, {
    method: "PATCH",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({ expectedRevision: 1, operation: { kind: "move", placementId: "placement_001", toIndex: 0 } })
  });
  assert.equal(staleResponse.status, 409);

  const badVersion = await fetch(draftUrl, {
    method: "PATCH",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({
      expectedRevision: 2,
      operation: { kind: "replace", placementId: "placement_001", itemId: "q_002", itemVersionId: "q_002-v2", relationship: "twin", evidenceId: "ev_q1_q2" }
    })
  });
  assert.equal(badVersion.status, 404);

  const forgedEvidence = await fetch(draftUrl, {
    method: "PATCH",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({
      expectedRevision: 2,
      operation: {
        kind: "replace", placementId: "placement_001", itemId: "q_002", itemVersionId: "q_002-v1",
        relationship: "twin", evidenceId: "ev_q1_q2", solutionStructureMatched: true
      }
    })
  });
  assert.equal(forgedEvidence.status, 400);

  const replacedResponse = await fetch(draftUrl, {
    method: "PATCH",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({
      expectedRevision: 2,
      operation: { kind: "replace", placementId: "placement_001", itemId: "q_002", itemVersionId: "q_002-v1", relationship: "twin", evidenceId: "ev_q1_q2" }
    })
  });
  assert.equal(replacedResponse.status, 200);
  const replaced = await replacedResponse.json();
  assert.equal(replaced.record.draft.revision, 3);
  assert.equal(replaced.record.draft.placements[0].itemId, "q_002");
  assert.equal(replaced.record.draft.placements[0].replacementHistory[0].evidenceId, "ev_q1_q2");
  assertNoPrivateFields(replaced);

  const readinessResponse = await fetch(`${draftUrl}/readiness`, { headers: { Cookie: admin.cookie } });
  assert.equal(readinessResponse.status, 200);
  const readiness = await readinessResponse.json();
  assert.equal(readiness.eligible, true);
  assert.deepEqual(readiness.projection.entries.map(entry => [entry.number, entry.itemId, entry.itemVersionId]), [[1, "q_002", "q_002-v1"]]);
  assertNoPrivateFields(readiness);
});

test("locked candidates cannot be inserted even when their identifier is known", async t => {
  const env = await start();
  t.after(() => env.server.close());
  const admin = await login(env.base);
  const createdResponse = await fetch(`${env.base}/admin/exam-editor/drafts`, {
    method: "POST",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({ profileId: "profile_hs", targetId: "target_hs", durationMinutes: 50, scopeKeys: ["2022/HS/ALGEBRA"] })
  });
  const created = await createdResponse.json();
  const response = await fetch(`${env.base}/admin/exam-editor/drafts/${created.draftId}`, {
    method: "PATCH",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({
      expectedRevision: 1,
      operation: { kind: "add", placementId: "placement_locked", itemId: "q_locked", itemVersionId: "q_locked-v1", score: 1, selectionKind: "manual" }
    })
  });
  assert.equal(response.status, 409);
  const current = await (await fetch(`${env.base}/admin/exam-editor/drafts/${created.draftId}`, { headers: { Cookie: admin.cookie } })).json();
  assert.equal(current.draft.revision, 1);
  assert.deepEqual(current.draft.placements, []);
});

test("file draft store persists atomically and rejects stale revisions and live locks", t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "highselect-exam-drafts-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const filePath = path.join(root, "drafts.json");
  const store = draftStoreModule.createStore({ filePath });
  const draft = editorCore.createDraft({
    draftId: "draft_file_001",
    profileId: "profile_file",
    targetId: "target_file",
    durationMinutes: 60,
    scopeKeys: ["2022/HS/ALGEBRA"],
    placements: []
  });
  const created = store.create({
    draftId: draft.draftId,
    createdBy: "admin_file",
    updatedBy: "admin_file",
    createdAt: "2026-08-25T00:00:00.000Z",
    updatedAt: "2026-08-25T00:00:00.000Z",
    draft
  });
  assert.equal(created.draft.revision, 1);

  const updated = store.update(draft.draftId, 1, function (record) {
    record.updatedAt = "2026-08-25T00:01:00.000Z";
    record.draft = editorCore.setViewMode(record.draft, "question_answer");
    return record;
  });
  assert.equal(updated.draft.revision, 2);
  assert.equal(store.read(draft.draftId).draft.viewMode, "question_answer");
  assert.throws(() => store.update(draft.draftId, 1, record => record), error => error && error.code === "EXAM_DRAFT_CONFLICT");
  assert.deepEqual(fs.readdirSync(root).sort(), ["drafts.json"]);

  fs.writeFileSync(`${filePath}.lock`, JSON.stringify({ pid: process.pid, createdAt: new Date().toISOString() }), "utf8");
  assert.throws(() => store.update(draft.draftId, 2, record => record), error => error && error.code === "EXAM_DRAFT_BUSY");
  fs.unlinkSync(`${filePath}.lock`);
});
