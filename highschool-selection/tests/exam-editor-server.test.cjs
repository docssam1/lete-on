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
const dolpaDbBuilder = require("../scripts/build-dolpa-question-db.cjs");
const dolpaLedgerCore = require("../scripts/build-dolpa-work-ledger.cjs");

const SECRET = "exam-editor-server-test-secret-with-32-characters";

function makeQuestion(index, overrides = {}) {
  const mode = overrides.mode || "SH";
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
  const crossMode = makeQuestion(205, { mode: "WM" });
  const outside = makeQuestion(206, { major: "M03", typeCode: "GEO_OUTSIDE_SCOPE" });
  return {
    q1, q2, q3, locked, crossMode, outside,
    evidenceId: "ev_q1_q2",
    data: {
    schemaVersion: "highselect-private-exam-editor-registry/v1",
    candidates: {
      [q1.id]: q1,
      [q2.id]: q2,
      [q3.id]: q3,
      [locked.id]: locked,
      [crossMode.id]: crossMode,
      [outside.id]: outside
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

function academyQuestionDb() {
  const semester = "중2-1";
  const unit = "일차함수";
  const typeLabel = "두 직선의 교점 구하기";
  return dolpaDbBuilder.buildDatabase({
    taxonomyVersion: "dolpa-kr-math-v1",
    sources: [{ sourceId: "DP-SRC-AAAAAAAAAAAA", sourceFingerprint: "a".repeat(64) }],
    questions: [{
      questionId: "DP-Q-AAAAAAAAAAAA-001", sourceId: "DP-SRC-AAAAAAAAAAAA", paperId: "DP-PAPER-A", paperTitle: "A", number: 1,
      sourceRelation: "original", curriculum: { semester, domain: "함수", unit },
      type: { typeId: dolpaLedgerCore.stableTypeId(semester, unit, typeLabel), label: typeLabel, methodTags: [], methodReviewStatus: "pending" },
      difficulty: { band: null, status: "pending", evidence: [] }, classificationStatus: "verified", evidence: ["paper.a"]
    }]
  }, null, "1".repeat(64));
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

async function start(privateExamDrafts = { schemaVersion: "highselect-private-exam-drafts/v1", drafts: {} }) {
  const app = createApp({
    sessionSecret: SECRET,
    assetSecret: `${SECRET}-asset`,
    privateConfig: privateConfig(),
    privateScorer: { schemaVersion: "highselect-private-scorer/v1", exams: {} },
    privateExamEditorRegistry: REGISTRY.data,
    privateAcademyQuestionDb: academyQuestionDb(),
    privateExamDrafts,
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

test("candidate registry fails closed without scope and searches an explicit scope union", () => {
  const registry = editorRegistryModule.createRegistry(REGISTRY.data);
  assert.deepEqual(registry.search({ mode: "SH", originalOnly: true }).map(entry => entry.candidate.id), []);
  assert.deepEqual(registry.search({
    mode: "SH",
    scopeKeys: ["G10/M01", "G10/M02"],
    originalOnly: true,
    limit: 10
  }).map(entry => entry.candidate.id), [REGISTRY.q1.id, REGISTRY.q3.id]);
});

test("candidate search is admin-only, release-gated and metadata-only", async t => {
  const env = await start();
  t.after(() => env.server.close());

  assert.equal((await fetch(`${env.base}/admin/exam-editor/candidates`)).status, 401);
  const student = await login(env.base, "일반학생", "STUDENT-EDITOR");
  assert.equal((await fetch(`${env.base}/admin/exam-editor/candidates`, { headers: { Cookie: student.cookie } })).status, 403);

  const admin = await login(env.base);
  const statusResponse = await fetch(`${env.base}/admin/exam-editor/status`, { headers: { Cookie: admin.cookie } });
  assert.equal(statusResponse.status, 200);
  assert.deepEqual(await statusResponse.json(), { ready: true });
  const createDraft = async function (mode, scopeKeys = ["G10/M01"]) {
    const response = await fetch(`${env.base}/admin/exam-editor/drafts`, {
      method: "POST",
      headers: adminHeaders(admin.cookie, env.base),
      body: JSON.stringify({ mode, profileId: `profile_${mode}`, targetId: `target_${mode}`, durationMinutes: 60, scopeKeys })
    });
    assert.equal(response.status, 201);
    return (await response.json()).draftId;
  };
  const emptyScope = await fetch(`${env.base}/admin/exam-editor/drafts`, {
    method: "POST",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({ mode: "SH", profileId: "profile_empty", targetId: "target_empty", durationMinutes: 60, scopeKeys: [] })
  });
  assert.equal(emptyScope.status, 400);
  const slashOnlyScope = await fetch(`${env.base}/admin/exam-editor/drafts`, {
    method: "POST",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({ mode: "SH", profileId: "profile_slash", targetId: "target_slash", durationMinutes: 60, scopeKeys: ["/"] })
  });
  assert.equal(slashOnlyScope.status, 400);

  const shDraftId = await createDraft("SH", ["G10/M01", "G10/M02"]);
  const response = await fetch(`${env.base}/admin/exam-editor/candidates?draftId=${encodeURIComponent(shDraftId)}&scopeKey=G10%2FM01&limit=10`, {
    headers: { Cookie: admin.cookie }
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const packet = await response.json();
  assert.deepEqual(packet.items.map(item => item.itemId), [REGISTRY.q1.id]);
  assert.equal(packet.items.every(item => item.eligible === true), true);
  assertNoPrivateFields(packet);
  assert.equal(JSON.stringify(packet).includes(REGISTRY.locked.id), false);

  const originals = await fetch(`${env.base}/admin/exam-editor/candidates?draftId=${encodeURIComponent(shDraftId)}&scopeKey=G10%2FM01&limit=10`, {
    headers: { Cookie: admin.cookie }
  });
  assert.equal(originals.status, 200);
  assert.deepEqual((await originals.json()).items.map(item => item.itemId), [REGISTRY.q1.id]);

  const allDraftScopes = await fetch(`${env.base}/admin/exam-editor/candidates?draftId=${encodeURIComponent(shDraftId)}&limit=10`, {
    headers: { Cookie: admin.cookie }
  });
  assert.equal(allDraftScopes.status, 200);
  assert.deepEqual((await allDraftScopes.json()).items.map(item => item.itemId), [REGISTRY.q1.id, REGISTRY.q3.id]);
  assert.equal((await fetch(`${env.base}/admin/exam-editor/candidates?draftId=${encodeURIComponent(shDraftId)}&scopeKey=G10%2FM03`, {
    headers: { Cookie: admin.cookie }
  })).status, 400);
  assert.equal((await fetch(`${env.base}/admin/exam-editor/candidates?draftId=${encodeURIComponent(shDraftId)}&scopeKey=%2F`, {
    headers: { Cookie: admin.cookie }
  })).status, 400);

  const seedAdd = await fetch(`${env.base}/admin/exam-editor/drafts/${encodeURIComponent(shDraftId)}`, {
    method: "PATCH",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({ expectedRevision: 1, operation: { kind: "add", placementId: "search_source", itemId: REGISTRY.q1.id, itemVersionId: REGISTRY.q1.itemVersionId, score: 1, selectionKind: "manual" } })
  });
  assert.equal(seedAdd.status, 200);
  const related = await fetch(`${env.base}/admin/exam-editor/candidates?draftId=${encodeURIComponent(shDraftId)}&sourceItemId=${encodeURIComponent(REGISTRY.q1.id)}&sourceItemVersionId=${encodeURIComponent(REGISTRY.q1.itemVersionId)}&relationship=twin`, {
    headers: { Cookie: admin.cookie }
  });
  assert.equal(related.status, 200);
  const relatedPacket = await related.json();
  assert.deepEqual(relatedPacket.items.map(item => [item.itemId, item.replacement.evidenceId]), [[REGISTRY.q2.id, REGISTRY.evidenceId]]);
  assertNoPrivateFields(relatedPacket);

  const wmDraftId = await createDraft("WM");
  const otherMode = await fetch(`${env.base}/admin/exam-editor/candidates?draftId=${encodeURIComponent(wmDraftId)}&scopeKey=G10%2FM01`, {
    headers: { Cookie: admin.cookie }
  });
  assert.equal(otherMode.status, 200);
  assert.deepEqual((await otherMode.json()).items.map(item => item.itemId), [REGISTRY.crossMode.id]);

  assert.equal((await fetch(`${env.base}/admin/exam-editor/candidates?draftId=${encodeURIComponent(shDraftId)}&unknown=1`, { headers: { Cookie: admin.cookie } })).status, 400);
  assert.equal((await fetch(`${env.base}/admin/exam-editor/candidates?mode=SH`, { headers: { Cookie: admin.cookie } })).status, 400);
  assert.equal((await fetch(`${env.base}/admin/exam-editor/candidates`, { headers: { Cookie: admin.cookie } })).status, 400);
  assert.equal((await fetch(`${env.base}/admin/exam-editor/candidates?draftId=draft_missing`, { headers: { Cookie: admin.cookie } })).status, 404);
  assert.equal((await fetch(`${env.base}/admin/exam-editor/candidates?draftId=${encodeURIComponent(shDraftId)}&sourceItemId=${encodeURIComponent(REGISTRY.q1.id)}&relationship=twin`, { headers: { Cookie: admin.cookie } })).status, 400);
  assert.equal((await fetch(`${env.base}/admin/exam-editor/candidates?draftId=${encodeURIComponent(wmDraftId)}&sourceItemId=${encodeURIComponent(REGISTRY.q1.id)}&sourceItemVersionId=${encodeURIComponent(REGISTRY.q1.itemVersionId)}&relationship=twin`, { headers: { Cookie: admin.cookie } })).status, 409);
});

test("academy profile catalog is admin-only and returns safe classified Dolpa rows", async t => {
  const env = await start();
  t.after(() => env.server.close());
  assert.equal((await fetch(`${env.base}/admin/question-bank/catalog?profiles=DP_STANDARD`)).status, 401);
  const student = await login(env.base, "일반학생", "STUDENT-EDITOR");
  assert.equal((await fetch(`${env.base}/admin/question-bank/catalog?profiles=DP_STANDARD`, { headers: { Cookie: student.cookie } })).status, 403);
  const admin = await login(env.base);
  const response = await fetch(`${env.base}/admin/question-bank/catalog?profiles=DP_STANDARD&q=${encodeURIComponent("교점")}&limit=100`, {
    headers: { Cookie: admin.cookie }
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const packet = await response.json();
  assert.equal(packet.count, 1);
  assert.equal(packet.items[0].majorUnit, "함수");
  assert.equal(packet.items[0].minorUnit, "일차함수");
  assert.equal(packet.items[0].profiles[0].label, "돌파형");
  assertNoPrivateFields(packet);
  assert.equal(JSON.stringify(packet).includes("DP-SRC"), false);
  assert.equal((await fetch(`${env.base}/admin/question-bank/catalog?profiles=WM_DUAL`, { headers: { Cookie: admin.cookie } })).status, 200);
  assert.equal((await fetch(`${env.base}/admin/question-bank/catalog?profiles=UNKNOWN`, { headers: { Cookie: admin.cookie } })).status, 400);
  assert.equal((await fetch(`${env.base}/admin/question-bank/catalog?profiles=DP_STANDARD&unknown=1`, { headers: { Cookie: admin.cookie } })).status, 400);
});

test("draft editing enforces origin, revision CAS, item versions and server-side replacement evidence", async t => {
  const env = await start();
  t.after(() => env.server.close());
  const admin = await login(env.base);

  const createBody = {
    mode: "SH",
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

  const missingMode = await fetch(`${env.base}/admin/exam-editor/drafts`, {
    method: "POST",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({ ...createBody, mode: undefined })
  });
  assert.equal(missingMode.status, 400);

  const createdResponse = await fetch(`${env.base}/admin/exam-editor/drafts`, {
    method: "POST",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify(createBody)
  });
  assert.equal(createdResponse.status, 201);
  const created = await createdResponse.json();
  assert.equal(created.draft.revision, 1);
  assert.equal(created.draft.mode, "SH");
  assert.deepEqual(created.draft.placements, []);
  assert.deepEqual(created.selectedItems, []);
  assertNoPrivateFields(created);

  const listResponse = await fetch(`${env.base}/admin/exam-editor/drafts`, { headers: { Cookie: admin.cookie } });
  assert.equal(listResponse.status, 200);
  const listed = await listResponse.json();
  assert.deepEqual(listed.items.map(item => [item.draftId, item.revision, item.itemCount]), [[created.draftId, 1, 0]]);
  assertNoPrivateFields(listed);

  const draftUrl = `${env.base}/admin/exam-editor/drafts/${encodeURIComponent(created.draftId)}`;
  const zeroScoreAsNew = await fetch(draftUrl, {
    method: "PATCH",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({
      expectedRevision: 1,
      operation: { kind: "add", placementId: "placement_zero", itemId: REGISTRY.q1.id, itemVersionId: REGISTRY.q1.itemVersionId, score: 0, selectionKind: "manual" }
    })
  });
  assert.equal(zeroScoreAsNew.status, 409);

  const relatedAsNew = await fetch(draftUrl, {
    method: "PATCH",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({
      expectedRevision: 1,
      operation: { kind: "add", placementId: "placement_related", itemId: REGISTRY.q2.id, itemVersionId: REGISTRY.q2.itemVersionId, score: 2, selectionKind: "manual" }
    })
  });
  assert.equal(relatedAsNew.status, 409);

  const crossModeAsNew = await fetch(draftUrl, {
    method: "PATCH",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({
      expectedRevision: 1,
      operation: { kind: "add", placementId: "placement_cross_mode", itemId: REGISTRY.crossMode.id, itemVersionId: REGISTRY.crossMode.itemVersionId, score: 2, selectionKind: "manual" }
    })
  });
  assert.equal(crossModeAsNew.status, 409);

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
  assert.deepEqual(added.record.selectedItems.map(item => item.itemId), [REGISTRY.q1.id]);

  const zeroScoreEdit = await fetch(draftUrl, {
    method: "PATCH",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({ expectedRevision: 2, operation: { kind: "set_score", placementId: "placement_001", score: 0 } })
  });
  assert.equal(zeroScoreEdit.status, 409);

  const scoreResponse = await fetch(draftUrl, {
    method: "PATCH",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({
      expectedRevision: 2,
      operation: { kind: "set_score", placementId: "placement_001", score: 4.5 }
    })
  });
  assert.equal(scoreResponse.status, 200);
  const scored = await scoreResponse.json();
  assert.equal(scored.record.draft.revision, 3);
  assert.equal(scored.record.draft.placements[0].score, 4.5);

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
      expectedRevision: 3,
      operation: { kind: "replace", placementId: "placement_001", itemId: REGISTRY.q2.id, itemVersionId: `${REGISTRY.q2.itemVersionId}-stale`, relationship: "twin", evidenceId: REGISTRY.evidenceId }
    })
  });
  assert.equal(badVersion.status, 404);

  const forgedEvidence = await fetch(draftUrl, {
    method: "PATCH",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({
      expectedRevision: 3,
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
      expectedRevision: 3,
      operation: { kind: "replace", placementId: "placement_001", itemId: REGISTRY.q2.id, itemVersionId: REGISTRY.q2.itemVersionId, relationship: "twin", evidenceId: REGISTRY.evidenceId }
    })
  });
  assert.equal(replacedResponse.status, 200);
  const replaced = await replacedResponse.json();
  assert.equal(replaced.record.draft.revision, 4);
  assert.equal(replaced.record.draft.placements[0].itemId, REGISTRY.q2.id);
  assert.equal(replaced.record.draft.placements[0].replacementHistory[0].evidenceId, REGISTRY.evidenceId);
  assertNoPrivateFields(replaced);

  const readinessResponse = await fetch(`${draftUrl}/readiness`, { headers: { Cookie: admin.cookie } });
  assert.equal(readinessResponse.status, 200);
  const readiness = await readinessResponse.json();
  assert.equal(readiness.eligible, false);
  assert.equal(readiness.projection, null);
  assert.ok(readiness.issues.includes("draft.original.minimum"));
  assertNoPrivateFields(readiness);

  const restoredResponse = await fetch(draftUrl, {
    method: "PATCH",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({
      expectedRevision: 4,
      operation: {
        kind: "replace", placementId: "placement_001", itemId: REGISTRY.q1.id, itemVersionId: REGISTRY.q1.itemVersionId,
        relationship: "manual", reasonCode: "restore_original"
      }
    })
  });
  assert.equal(restoredResponse.status, 200);
  const restored = await restoredResponse.json();
  assert.equal(restored.record.draft.revision, 5);
  assert.equal(restored.record.draft.placements[0].itemId, REGISTRY.q1.id);

  const finalReadiness = await (await fetch(`${draftUrl}/readiness`, { headers: { Cookie: admin.cookie } })).json();
  assert.equal(finalReadiness.eligible, true);
  assert.deepEqual(finalReadiness.projection.entries.map(entry => [entry.number, entry.itemId, entry.itemVersionId]), [[1, REGISTRY.q1.id, REGISTRY.q1.itemVersionId]]);
});

test("locked candidates cannot be inserted even when their identifier is known", async t => {
  const env = await start();
  t.after(() => env.server.close());
  const admin = await login(env.base);
  const createdResponse = await fetch(`${env.base}/admin/exam-editor/drafts`, {
    method: "POST",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({ mode: "SH", profileId: "profile_hs", targetId: "target_hs", durationMinutes: 50, scopeKeys: ["G10/M01"] })
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

test("stored drafts without a scope are preserved read-only and fail closed", async t => {
  const draftId = "draft_scope001";
  const timestamp = "2026-08-24T00:00:00.000Z";
  const env = await start({
    schemaVersion: "highselect-private-exam-drafts/v1",
    drafts: {
      [draftId]: {
        draftId,
        createdBy: "admin_editor",
        updatedBy: "admin_editor",
        createdAt: timestamp,
        updatedAt: timestamp,
        draft: {
          draftId,
          revision: 1,
          mode: "SH",
          profileId: "profile_scope_missing",
          targetId: "target_scope_missing",
          durationMinutes: 60,
          scopeKeys: ["/"],
          sortMode: "user",
          viewMode: "question",
          placements: []
        }
      }
    }
  });
  t.after(() => env.server.close());
  const admin = await login(env.base);
  const draftResponse = await fetch(`${env.base}/admin/exam-editor/drafts/${draftId}`, { headers: { Cookie: admin.cookie } });
  assert.equal(draftResponse.status, 200);
  const packet = await draftResponse.json();
  assert.equal(packet.migrationRequired, true);
  assert.equal(packet.draft.mode, "SH");
  assert.deepEqual(packet.draft.scopeKeys, ["/"]);

  assert.equal((await fetch(`${env.base}/admin/exam-editor/candidates?draftId=${draftId}`, { headers: { Cookie: admin.cookie } })).status, 409);
  assert.equal((await fetch(`${env.base}/admin/exam-editor/drafts/${draftId}/readiness`, { headers: { Cookie: admin.cookie } })).status, 409);
  const mutation = await fetch(`${env.base}/admin/exam-editor/drafts/${draftId}`, {
    method: "PATCH",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({ expectedRevision: 1, operation: { kind: "set_view_mode", viewMode: "question_answer" } })
  });
  assert.equal(mutation.status, 409);
});

test("file draft store persists atomically and rejects stale revisions and live locks", t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "highselect-exam-drafts-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const filePath = path.join(root, "drafts.json");
  const store = draftStoreModule.createStore({ filePath });
  const draft = editorCore.createDraft({
    draftId: "draft_file_001",
    mode: "SH",
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

test("legacy draft files remain readable and preserved until their program mode is explicitly migrated", t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "highselect-legacy-exam-drafts-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const filePath = path.join(root, "drafts.json");
  const timestamp = "2026-08-24T00:00:00.000Z";
  const legacyDraftId = "draft_legacy_001";
  fs.writeFileSync(filePath, JSON.stringify({
    schemaVersion: draftStoreModule.SCHEMA_VERSION,
    drafts: {
      [legacyDraftId]: {
        draftId: legacyDraftId,
        createdBy: "admin_legacy",
        updatedBy: "admin_legacy",
        createdAt: timestamp,
        updatedAt: timestamp,
        draft: {
          draftId: legacyDraftId,
          revision: 1,
          profileId: "profile_legacy",
          targetId: "target_legacy",
          durationMinutes: 60,
          scopeKeys: ["G10/M01"],
          sortMode: "user",
          viewMode: "question",
          placements: [{
            placementId: "legacy_placement_1",
            itemId: REGISTRY.q1.id,
            itemVersionId: REGISTRY.q1.itemVersionId,
            order: 1,
            score: 0,
            locked: false,
            selectionKind: "manual",
            replacementHistory: []
          }]
        }
      }
    }
  }, null, 2), "utf8");

  const store = draftStoreModule.createStore({ filePath });
  const legacy = store.read(legacyDraftId);
  assert.equal(legacy.migrationRequired, true);
  assert.equal(legacy.draft.mode, undefined);
  assert.equal(legacy.draft.placements[0].score, 0);
  assert.throws(() => store.update(legacyDraftId, 1, record => record), error => error && error.code === "EXAM_DRAFT_MIGRATION_REQUIRED");

  const newDraft = editorCore.createDraft({
    draftId: "draft_new_after_legacy",
    mode: "SH",
    profileId: "profile_new",
    targetId: "target_new",
    durationMinutes: 60,
    scopeKeys: ["G10/M01"],
    placements: []
  });
  store.create({
    draftId: newDraft.draftId,
    createdBy: "admin_new",
    updatedBy: "admin_new",
    createdAt: timestamp,
    updatedAt: timestamp,
    draft: newDraft
  });
  assert.equal(store.read(newDraft.draftId).draft.mode, "SH");
  assert.equal(store.read(legacyDraftId).migrationRequired, true);
  const persisted = JSON.parse(fs.readFileSync(filePath, "utf8"));
  assert.ok(persisted.drafts[legacyDraftId]);
  assert.equal(Object.hasOwn(persisted.drafts[legacyDraftId].draft, "mode"), false);
});
