const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");

const { createApp } = require("../server/app.js");
const { hashApprovalCode } = require("../server/security.js");
const editorCore = require("../data/exam-editor-core.js");
const questionBankCore = require("../data/question-bank-core.js");
const sourceLineage = require("../data/source-lineage.js");
const draftStoreModule = require("../server/exam-draft-store.js");
const editorRegistryModule = require("../server/exam-editor-registry.js");

const SECRET = "exam-editor-server-test-secret-with-32-characters";

function makeQuestion(index, overrides = {}) {
  const mode = "SH";
  const relation = overrides.relation || "original";
  const questionId = questionBankCore.createNeutralId("question", mode, `editor-server:item-${index}`);
  const originalQuestionId = relation === "original" ? questionId : overrides.originalQuestionId;
  const familyId = overrides.familyId || originalQuestionId;
  const questionTypeId = overrides.questionTypeId || questionBankCore.createNeutralId("type", mode, `editor-server:type-${index}`);
  const lineage = sourceLineage.createQuestionLineage({
    mode,
    id: questionBankCore.createNeutralId("lineage", mode, `editor-server:lineage-${index}`),
    sourceExamId: questionBankCore.createNeutralId("exam", mode, "editor-server:source-exam"),
    originalQuestionId,
    questionId,
    questionTypeId,
    relation,
    sourceAsset: sourceLineage.createSourceAssetReference({
      sourceAssetId: questionBankCore.createNeutralId("source", mode, `editor-server:asset-${index}`),
      sourceFingerprint: `sha256:${String(index).padStart(64, "0")}`,
      pageNumber: index,
      itemLocator: { code: `S${index}` },
      assetVariant: relation
    })
  });
  const approvalStatus = overrides.approvalStatus || "approved";
  return {
    id: questionId,
    itemVersionId: `editor-server-${index}-v1`,
    mode,
    writer: "T",
    curriculum: questionBankCore.createCurriculumPath({
      grade: "G10",
      major: overrides.major || "M01",
      minor: overrides.minor || `S${index}`,
      detail: overrides.detail || `D${index}`
    }),
    provenance: questionBankCore.createProvenanceRecord({
      mode,
      role: "internal-variant",
      status: "cleared",
      referenceId: questionBankCore.createNeutralId("source", mode, `editor-server:source-${index}`)
    }),
    answerVerification: questionBankCore.createAnswerVerification({ status: "verified", reviewCount: 2 }),
    inputType: "input",
    generationKind: "parameterized",
    difficultyBand: "raised",
    variant: questionBankCore.createVariantRecord({ mode, familyId, band: "raised" }),
    lineage,
    userApproval: sourceLineage.createUserApproval({
      mode,
      id: questionBankCore.createNeutralId("approval", mode, `editor-server:approval-${index}`),
      questionId,
      status: approvalStatus,
      decisionVersion: 1
    }),
    singleAnswerAudit: { status: "passed", validOutcomeCount: 1, evidenceCode: `SERVER-${index}` },
    figureAudit: { required: false, status: "not_required" },
    reviewStatus: "approved",
    typeCode: overrides.typeCode || "ALG_NUMBER_PATTERN"
  };
}

function createRegistryFixture() {
  const q1 = makeQuestion(201);
  const q2 = makeQuestion(202, {
    relation: "twin",
    originalQuestionId: q1.id,
    familyId: q1.id,
    questionTypeId: q1.lineage.questionTypeId
  });
  const q3 = makeQuestion(203, { major: "M02", typeCode: "GEO_SOLID" });
  const locked = makeQuestion(204, { approvalStatus: "pending" });
  return {
    q1, q2, q3, locked,
    evidenceId: "ev_q1_q2",
    data: {
    schemaVersion: "highselect-private-exam-editor-registry/v1",
    candidates: {
      [q1.id]: q1,
      [q2.id]: q2,
      [q3.id]: q3,
      [locked.id]: locked
    },
    relations: {
      ev_q1_q2: {
        evidenceId: "ev_q1_q2",
        status: "approved",
        relationship: "twin",
        sourceItemId: q1.id,
        sourceItemVersionId: q1.itemVersionId,
        candidateItemId: q2.id,
        candidateItemVersionId: q2.itemVersionId,
        familyMatched: true,
        detailMatched: true,
        solutionStructureMatched: true,
        difficultyCompatible: true
      }
    }
    }
  };
}

const REGISTRY = createRegistryFixture();

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
    privateExamEditorRegistry: REGISTRY.data,
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
    assert.equal(/answer|solution|explanation|sourcepath|storagepath|pdfurl|fingerprint|itemlocator|bbox|pagenumber/i.test(key), false, `private key leaked: ${key}`);
    assertNoPrivateFields(child);
  });
}

test("registry rejects legacy status-only projections instead of trusting release labels", () => {
  assert.throws(() => editorRegistryModule.normalize({
    schemaVersion: editorRegistryModule.SCHEMA_VERSION,
    candidates: {
      q_legacy: {
        itemId: "q_legacy",
        itemVersionId: "q_legacy-v1",
        curriculumPath: "G10/M01/S01/D01",
        releaseStatus: "approved",
        answerStatus: "verified",
        userApprovalStatus: "approved"
      }
    },
    relations: {}
  }), /is not allowed/);
});

test("candidate search is admin-only, release-gated and metadata-only", async t => {
  const env = await start();
  t.after(() => env.server.close());

  assert.equal((await fetch(`${env.base}/admin/exam-editor/candidates`)).status, 401);
  const student = await login(env.base, "일반학생", "STUDENT-EDITOR");
  assert.equal((await fetch(`${env.base}/admin/exam-editor/candidates`, { headers: { Cookie: student.cookie } })).status, 403);

  const admin = await login(env.base);
  const response = await fetch(`${env.base}/admin/exam-editor/candidates?scopeKey=G10%2FM01&limit=10`, {
    headers: { Cookie: admin.cookie }
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const packet = await response.json();
  assert.deepEqual(packet.items.map(item => item.itemId).sort(), [REGISTRY.q1.id, REGISTRY.q2.id].sort());
  assert.equal(packet.items.every(item => item.eligible === true), true);
  assertNoPrivateFields(packet);
  assert.equal(JSON.stringify(packet).includes(REGISTRY.locked.id), false);

  const related = await fetch(`${env.base}/admin/exam-editor/candidates?sourceItemId=${encodeURIComponent(REGISTRY.q1.id)}&sourceItemVersionId=${encodeURIComponent(REGISTRY.q1.itemVersionId)}&relationship=twin`, {
    headers: { Cookie: admin.cookie }
  });
  assert.equal(related.status, 200);
  const relatedPacket = await related.json();
  assert.deepEqual(relatedPacket.items.map(item => [item.itemId, item.replacement.evidenceId]), [[REGISTRY.q2.id, REGISTRY.evidenceId]]);
  assertNoPrivateFields(relatedPacket);

  assert.equal((await fetch(`${env.base}/admin/exam-editor/candidates?unknown=1`, { headers: { Cookie: admin.cookie } })).status, 400);
  assert.equal((await fetch(`${env.base}/admin/exam-editor/candidates?sourceItemId=${encodeURIComponent(REGISTRY.q1.id)}&relationship=twin`, { headers: { Cookie: admin.cookie } })).status, 400);
});

test("draft editing enforces origin, revision CAS, item versions and server-side replacement evidence", async t => {
  const env = await start();
  t.after(() => env.server.close());
  const admin = await login(env.base);

  const createBody = {
    profileId: "profile_hs_selection",
    targetId: "target_mock_r01",
    durationMinutes: 60,
    scopeKeys: ["G10/M01"]
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

  const listResponse = await fetch(`${env.base}/admin/exam-editor/drafts`, { headers: { Cookie: admin.cookie } });
  assert.equal(listResponse.status, 200);
  const listed = await listResponse.json();
  assert.deepEqual(listed.items.map(item => [item.draftId, item.revision, item.itemCount]), [[created.draftId, 1, 0]]);
  assertNoPrivateFields(listed);

  const draftUrl = `${env.base}/admin/exam-editor/drafts/${encodeURIComponent(created.draftId)}`;
  const addResponse = await fetch(draftUrl, {
    method: "PATCH",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({
      expectedRevision: 1,
      operation: { kind: "add", placementId: "placement_001", itemId: REGISTRY.q1.id, itemVersionId: REGISTRY.q1.itemVersionId, score: 2, selectionKind: "manual" }
    })
  });
  assert.equal(addResponse.status, 200);
  const added = await addResponse.json();
  assert.equal(added.record.draft.revision, 2);
  assert.equal(added.record.draft.placements[0].itemVersionId, REGISTRY.q1.itemVersionId);

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
      operation: { kind: "replace", placementId: "placement_001", itemId: REGISTRY.q2.id, itemVersionId: `${REGISTRY.q2.itemVersionId}-stale`, relationship: "twin", evidenceId: REGISTRY.evidenceId }
    })
  });
  assert.equal(badVersion.status, 404);

  const forgedEvidence = await fetch(draftUrl, {
    method: "PATCH",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({
      expectedRevision: 2,
      operation: {
        kind: "replace", placementId: "placement_001", itemId: REGISTRY.q2.id, itemVersionId: REGISTRY.q2.itemVersionId,
        relationship: "twin", evidenceId: REGISTRY.evidenceId, solutionStructureMatched: true
      }
    })
  });
  assert.equal(forgedEvidence.status, 400);

  const replacedResponse = await fetch(draftUrl, {
    method: "PATCH",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({
      expectedRevision: 2,
      operation: { kind: "replace", placementId: "placement_001", itemId: REGISTRY.q2.id, itemVersionId: REGISTRY.q2.itemVersionId, relationship: "twin", evidenceId: REGISTRY.evidenceId }
    })
  });
  assert.equal(replacedResponse.status, 200);
  const replaced = await replacedResponse.json();
  assert.equal(replaced.record.draft.revision, 3);
  assert.equal(replaced.record.draft.placements[0].itemId, REGISTRY.q2.id);
  assert.equal(replaced.record.draft.placements[0].replacementHistory[0].evidenceId, REGISTRY.evidenceId);
  assertNoPrivateFields(replaced);

  const readinessResponse = await fetch(`${draftUrl}/readiness`, { headers: { Cookie: admin.cookie } });
  assert.equal(readinessResponse.status, 200);
  const readiness = await readinessResponse.json();
  assert.equal(readiness.eligible, true);
  assert.deepEqual(readiness.projection.entries.map(entry => [entry.number, entry.itemId, entry.itemVersionId]), [[1, REGISTRY.q2.id, REGISTRY.q2.itemVersionId]]);
  assertNoPrivateFields(readiness);
});

test("locked candidates cannot be inserted even when their identifier is known", async t => {
  const env = await start();
  t.after(() => env.server.close());
  const admin = await login(env.base);
  const createdResponse = await fetch(`${env.base}/admin/exam-editor/drafts`, {
    method: "POST",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({ profileId: "profile_hs", targetId: "target_hs", durationMinutes: 50, scopeKeys: ["G10/M01"] })
  });
  const created = await createdResponse.json();
  const response = await fetch(`${env.base}/admin/exam-editor/drafts/${created.draftId}`, {
    method: "PATCH",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({
      expectedRevision: 1,
      operation: { kind: "add", placementId: "placement_locked", itemId: REGISTRY.locked.id, itemVersionId: REGISTRY.locked.itemVersionId, score: 1, selectionKind: "manual" }
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
    scopeKeys: ["G10/M01"],
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
