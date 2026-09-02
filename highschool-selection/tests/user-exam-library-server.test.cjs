const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const path = require("node:path");

const { createApp } = require("../server/app.js");
const { hashApprovalCode } = require("../server/security.js");
const questionBankCore = require("../data/question-bank-core.js");
const sourceLineage = require("../data/source-lineage.js");

const SECRET = "user-exam-library-server-secret-at-least-32-characters";
const NOW = Date.parse("2026-08-30T12:00:00.000Z");

function makeQuestion(index, mode, approvalStatus = "approved", options = {}) {
  const difficultyBand = options.difficultyBand || "standard";
  const inputType = options.inputType || "input";
  const questionId = questionBankCore.createNeutralId("question", mode, `user-library:item-${index}`);
  const lineage = sourceLineage.createQuestionLineage({
    mode,
    id: questionBankCore.createNeutralId("lineage", mode, `user-library:lineage-${index}`),
    sourceExamId: questionBankCore.createNeutralId("exam", mode, "user-library:source-exam"),
    originalQuestionId: questionId,
    questionId,
    questionTypeId: questionBankCore.createNeutralId("type", mode, `user-library:type-${index}`),
    relation: "original",
    sourceAsset: sourceLineage.createSourceAssetReference({
      sourceAssetId: questionBankCore.createNeutralId("source", mode, `user-library:asset-${index}`),
      sourceFingerprint: `sha256:${String(index).padStart(64, "0")}`,
      pageNumber: index,
      itemLocator: { code: `U${index}` },
      assetVariant: "original"
    })
  });
  return {
    id: questionId,
    itemVersionId: `user-library-${index}-v1`,
    mode,
    writer: "T",
    curriculum: questionBankCore.createCurriculumPath({ grade: "G8", major: "M01", minor: `S${index}`, detail: `D${index}` }),
    provenance: questionBankCore.createProvenanceRecord({
      mode,
      role: "internal-variant",
      status: "cleared",
      referenceId: questionBankCore.createNeutralId("source", mode, `user-library:source-${index}`)
    }),
    answerVerification: questionBankCore.createAnswerVerification({ status: "verified", reviewCount: 2 }),
    inputType,
    generationKind: "parameterized",
    difficultyBand,
    variant: questionBankCore.createVariantRecord({ mode, familyId: questionId, band: difficultyBand }),
    lineage,
    userApproval: sourceLineage.createUserApproval({
      mode,
      id: questionBankCore.createNeutralId("approval", mode, `user-library:approval-${index}`),
      questionId,
      status: approvalStatus,
      decisionVersion: 1
    }),
    singleAnswerAudit: { status: "passed", validOutcomeCount: 1, evidenceCode: `USER-LIBRARY-${index}` },
    figureAudit: { required: false, status: "not_required" },
    reviewStatus: "approved",
    typeCode: `TYPE_${index}`,
    domainGroup: options.domainGroup || null
  };
}

const DP_ONE = makeQuestion(1, "DP");
const DP_TWO = makeQuestion(2, "DP");
const WM_ONE = makeQuestion(3, "WM");
const LOCKED = makeQuestion(4, "DP", "pending");
const AUTO_DP = ["lowered", "standard", "raised"].flatMap(function (difficultyBand, difficultyIndex) {
  return ["single_choice", "input"].flatMap(function (inputType, inputIndex) {
    return [0, 1].map(function (offset) {
      const index = 10 + difficultyIndex * 4 + inputIndex * 2 + offset;
      return makeQuestion(index, "DP", "approved", { difficultyBand, inputType });
    });
  });
});
const AUTO_SM = ["algebra", "geometry"].flatMap(function (domainGroup, domainIndex) {
  return ["lowered", "standard", "raised"].flatMap(function (difficultyBand, difficultyIndex) {
    return ["single_choice", "input"].flatMap(function (inputType, inputIndex) {
      return [0, 1, 2, 3].map(function (offset) {
        const index = 100 + domainIndex * 40 + difficultyIndex * 8 + inputIndex * 4 + offset;
        return makeQuestion(index, "SM", "approved", { difficultyBand, inputType, domainGroup });
      });
    });
  });
});

function registry() {
  return {
    schemaVersion: "highselect-private-exam-editor-registry/v1",
    candidates: Object.fromEntries([DP_ONE, DP_TWO, WM_ONE, LOCKED, ...AUTO_DP, ...AUTO_SM].map(item => [item.id, item])),
    relations: {}
  };
}

function privateConfig() {
  return {
    schemaVersion: "highselect-private-config/v1",
    students: [
      {
        studentId: "admin_library",
        name: "보관함관리자",
        approvalCodeHash: hashApprovalCode("ADMIN-LIBRARY", Buffer.alloc(16, 1).toString("base64url")),
        role: "admin",
        grants: []
      },
      {
        studentId: "student_one",
        name: "학생하나",
        approvalCodeHash: hashApprovalCode("STUDENT-ONE", Buffer.alloc(16, 2).toString("base64url")),
        role: "student",
        grants: []
      },
      {
        studentId: "student_two",
        name: "학생둘",
        approvalCodeHash: hashApprovalCode("STUDENT-TWO", Buffer.alloc(16, 3).toString("base64url")),
        role: "student",
        grants: []
      }
    ],
    exams: {}
  };
}

function libraryData() {
  return {
    schemaVersion: "highselect-private-user-exam-library/v1",
    plans: {
      basic: { planId: "basic", maxSavedExamCount: 1, maxRecentExamCount: 5, temporaryRetentionDays: 7 },
      plus: { planId: "plus", maxSavedExamCount: 3, maxRecentExamCount: 10, temporaryRetentionDays: 14 }
    },
    assignments: {
      student_one: {
        ownerId: "student_one",
        planId: "basic",
        entitlements: [
          { kind: "academy_semester", academyId: "DP", semesterId: "M2-1" },
          { kind: "academy_semester", academyId: "SM", semesterId: "CM1" }
        ],
        updatedAt: "2026-08-30T00:00:00Z"
      },
      student_two: {
        ownerId: "student_two",
        planId: "basic",
        entitlements: [{ kind: "all_learning" }],
        updatedAt: "2026-08-30T00:00:00Z"
      }
    },
    exams: {}
  };
}

function selectionConditions(scopeKeys, questionCount, overrides = {}) {
  return {
    scopeKeys,
    difficultyWeights: { lowered: 0, standard: 1, raised: 0 },
    responseWeights: { objective: 0, subjective: 1 },
    questionCount,
    maxPerFamily: 1,
    ...overrides
  };
}

function scopeInventory() {
  return {
    schemaVersion: "highselect-private-user-exam-scope-inventory/v1",
    targets: [
      { generationMode: "academy_prep", academyId: "DP", semesterId: "M2-1", scopeKeys: ["G8/M01"], status: "approved" },
      { generationMode: "academy_prep", academyId: "SM", semesterId: "CM1", scopeKeys: ["G8/M01"], status: "approved" },
      { generationMode: "learning", academyId: null, semesterId: "M2-1", scopeKeys: ["G8/M01"], status: "approved" }
    ]
  };
}

async function start(options = {}) {
  const app = createApp({
    sessionSecret: SECRET,
    assetSecret: `${SECRET}-asset`,
    privateConfig: privateConfig(),
    privateScorer: { schemaVersion: "highselect-private-scorer/v1", exams: {} },
    privateExamEditorRegistry: options.registry || registry(),
    privateExamDrafts: { schemaVersion: "highselect-private-exam-drafts/v1", drafts: {} },
    privateUserExamLibrary: libraryData(),
    privateUserExamScopeInventory: Object.prototype.hasOwnProperty.call(options, "scopeInventory")
      ? options.scopeInventory
      : scopeInventory(),
    cookieSecure: false,
    now: () => NOW,
    staticRoot: path.join(__dirname, "..")
  });
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  return { server, base: `http://127.0.0.1:${server.address().port}` };
}

async function login(base, name, approvalCode) {
  const response = await fetch(`${base}/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, approvalCode })
  });
  assert.equal(response.status, 200);
  return String(response.headers.get("set-cookie") || "").split(";")[0];
}

function userHeaders(cookie, origin) {
  return { Cookie: cookie, Origin: origin, "Content-Type": "application/json" };
}

function adminHeaders(cookie, origin) {
  return { ...userHeaders(cookie, origin), "X-Highselect-Admin": "1" };
}

function createBody(overrides = {}) {
  return {
    generationMode: "academy_prep",
    selectionSnapshot: {
      academyId: "DP", semesterId: "M2-1",
      conditions: selectionConditions([DP_ONE.curriculum.key], 1)
    },
    seed: 101,
    parentExamId: null,
    items: [{ itemId: DP_ONE.id, itemVersionId: DP_ONE.itemVersionId, order: 1, score: 1 }],
    ...overrides
  };
}

function generateBody(overrides = {}) {
  return {
    generationMode: "academy_prep",
    academyId: "DP",
    semesterId: "M2-1",
    scopeKeys: AUTO_DP.map(item => item.curriculum.key),
    questionCount: 6,
    difficultyWeights: { lowered: 1, standard: 1, raised: 1 },
    responseWeights: { objective: 1, subjective: 1 },
    maxPerFamily: 1,
    seed: 404,
    layout: { columns: 2, itemsPerPage: 4 },
    ...overrides
  };
}

async function createExam(base, cookie, body = createBody()) {
  return fetch(`${base}/user-exam-library/exams`, {
    method: "POST",
    headers: userHeaders(cookie, base),
    body: JSON.stringify(body)
  });
}

function assertNoPrivateFields(value) {
  if (!value || typeof value !== "object") return;
  Object.entries(value).forEach(function ([key, child]) {
    assert.equal(/questiontext|prompt|answer|solution|explanation|sourcepath|filepath|pdfurl|storageurl|fingerprint|itemlocator/i.test(key), false, `private key leaked: ${key}`);
    assertNoPrivateFields(child);
  });
}

test("user access and admin assignment APIs enforce their roles", async t => {
  const env = await start();
  t.after(() => env.server.close());
  const student = await login(env.base, "학생하나", "STUDENT-ONE");
  const admin = await login(env.base, "보관함관리자", "ADMIN-LIBRARY");

  const access = await fetch(`${env.base}/user-exam-library/access`, { headers: { Cookie: student } });
  assert.equal(access.status, 200);
  assert.equal((await access.json()).plan.maxSavedExamCount, 1);

  assert.equal((await fetch(`${env.base}/admin/user-exam-library/users/student_one`, { headers: { Cookie: student } })).status, 403);
  const before = await fetch(`${env.base}/admin/user-exam-library/users/student_one`, { headers: { Cookie: admin } });
  assert.equal(before.status, 200);
  assert.equal((await before.json()).plan.planId, "basic");

  const updated = await fetch(`${env.base}/admin/user-exam-library/users/student_one`, {
    method: "PUT",
    headers: adminHeaders(admin, env.base),
    body: JSON.stringify({ planId: "plus", entitlements: [{ kind: "academy_all", academyId: "WM" }] })
  });
  assert.equal(updated.status, 200);
  const packet = await updated.json();
  assert.equal(packet.plan.planId, "plus");
  assert.deepEqual(packet.entitlements, [{ kind: "academy_all", academyId: "WM" }]);
});

test("user exam creation fails closed when the approved scope inventory is not connected", async t => {
  const env = await start({ scopeInventory: null });
  t.after(() => env.server.close());
  const student = await login(env.base, "학생하나", "STUDENT-ONE");
  const response = await createExam(env.base, student);
  assert.equal(response.status, 503);
  assert.match((await response.json()).message, /서버 구성/);
});

test("create/list/read use server identities and approved current item versions only", async t => {
  const env = await start();
  t.after(() => env.server.close());
  const student = await login(env.base, "학생하나", "STUDENT-ONE");

  const csrf = await fetch(`${env.base}/user-exam-library/exams`, {
    method: "POST", headers: { Cookie: student, "Content-Type": "application/json" }, body: JSON.stringify(createBody())
  });
  assert.equal(csrf.status, 403);

  const createdResponse = await createExam(env.base, student);
  assert.equal(createdResponse.status, 201);
  const created = await createdResponse.json();
  assert.match(created.examId, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.equal(created.ownerId, "student_one");
  assert.equal(created.createdAt, "2026-08-30T12:00:00.000Z");
  assert.equal(created.expiresAt, "2026-09-06T12:00:00.000Z");
  assert.deepEqual(created.items, [{ itemId: DP_ONE.id, itemVersionId: DP_ONE.itemVersionId, order: 1, score: 1 }]);
  assertNoPrivateFields(created);

  const list = await (await fetch(`${env.base}/user-exam-library/exams`, { headers: { Cookie: student } })).json();
  assert.equal(list.count, 1);
  const read = await fetch(`${env.base}/user-exam-library/exams/${created.examId}`, { headers: { Cookie: student } });
  assert.equal(read.status, 200);
  assert.equal((await read.json()).examId, created.examId);

  assert.equal((await createExam(env.base, student, createBody({ items: [{ itemId: DP_ONE.id, itemVersionId: "old-version", order: 1, score: 1 }] }))).status, 409);
  assert.equal((await createExam(env.base, student, createBody({ items: [{ itemId: LOCKED.id, itemVersionId: LOCKED.itemVersionId, order: 1, score: 1 }] }))).status, 409);
});

test("academy mode matching and explicit entitlements fail closed", async t => {
  const env = await start();
  t.after(() => env.server.close());
  const student = await login(env.base, "학생하나", "STUDENT-ONE");

  const wrongMode = await createExam(env.base, student, createBody({
    items: [{ itemId: WM_ONE.id, itemVersionId: WM_ONE.itemVersionId, order: 1, score: 1 }]
  }));
  assert.equal(wrongMode.status, 409);

  const wrongSemester = await createExam(env.base, student, createBody({
    selectionSnapshot: { academyId: "DP", semesterId: "M1-2", conditions: selectionConditions([DP_ONE.curriculum.key], 1) }
  }));
  assert.equal(wrongSemester.status, 403);
  assert.match((await wrongSemester.json()).message, /이용 권한/);

  const forbiddenMetadata = await createExam(env.base, student, createBody({
    selectionSnapshot: { academyId: "DP", semesterId: "M2-1", conditions: { ...selectionConditions([DP_ONE.curriculum.key], 1), answerKey: "private" } }
  }));
  assert.equal(forbiddenMetadata.status, 400);
  const disguisedPath = await createExam(env.base, student, createBody({
    selectionSnapshot: { academyId: "DP", semesterId: "M2-1", conditions: { ...selectionConditions([DP_ONE.curriculum.key], 1), note: "..\\private\\source.pdf" } }
  }));
  assert.equal(disguisedPath.status, 400);
  const disguisedKey = await createExam(env.base, student, createBody({
    selectionSnapshot: {
      academyId: "DP", semesterId: "M2-1",
      conditions: { ...selectionConditions([DP_ONE.curriculum.key], 1), "official-answer": "12" }
    }
  }));
  assert.equal(disguisedKey.status, 400);

  const mismatchedScope = await createExam(env.base, student, createBody({
    selectionSnapshot: {
      academyId: "DP", semesterId: "M2-1",
      conditions: selectionConditions([AUTO_DP[0].curriculum.key], 1)
    }
  }));
  assert.equal(mismatchedScope.status, 409);
});

test("cross-owner reads are 404 and delete requires same-origin mutation", async t => {
  const env = await start();
  t.after(() => env.server.close());
  const one = await login(env.base, "학생하나", "STUDENT-ONE");
  const two = await login(env.base, "학생둘", "STUDENT-TWO");
  const created = await (await createExam(env.base, one)).json();

  assert.equal((await fetch(`${env.base}/user-exam-library/exams/${created.examId}`, { headers: { Cookie: two } })).status, 404);
  assert.equal((await fetch(`${env.base}/user-exam-library/exams/${created.examId}`, { method: "DELETE", headers: { Cookie: one } })).status, 403);
  const removed = await fetch(`${env.base}/user-exam-library/exams/${created.examId}`, {
    method: "DELETE", headers: { Cookie: one, Origin: env.base }
  });
  assert.equal(removed.status, 200);
  assert.equal((await removed.json()).removed, true);
  assert.equal((await fetch(`${env.base}/user-exam-library/exams/${created.examId}`, { headers: { Cookie: one } })).status, 404);
});

test("save limit is enforced and similar creation requires explicit approved items", async t => {
  const env = await start();
  t.after(() => env.server.close());
  const student = await login(env.base, "학생하나", "STUDENT-ONE");
  const parent = await (await createExam(env.base, student)).json();
  const saved = await fetch(`${env.base}/user-exam-library/exams/${parent.examId}/save`, {
    method: "POST", headers: userHeaders(student, env.base), body: "{}"
  });
  assert.equal(saved.status, 200);
  assert.equal((await saved.json()).state, "saved");

  const second = await (await createExam(env.base, student, createBody({
    seed: 202,
    selectionSnapshot: {
      academyId: "DP", semesterId: "M2-1",
      conditions: selectionConditions([DP_TWO.curriculum.key], 1)
    },
    items: [{ itemId: DP_TWO.id, itemVersionId: DP_TWO.itemVersionId, order: 1, score: 2 }]
  }))).json();
  const overLimit = await fetch(`${env.base}/user-exam-library/exams/${second.examId}/save`, {
    method: "POST", headers: userHeaders(student, env.base), body: "{}"
  });
  assert.equal(overLimit.status, 409);

  const noAutomaticItems = await createExam(env.base, student, createBody({ parentExamId: parent.examId, seed: 303, items: [] }));
  assert.equal(noAutomaticItems.status, 400);
  const childResponse = await createExam(env.base, student, createBody({
    parentExamId: parent.examId,
    seed: 303,
    selectionSnapshot: {
      academyId: "DP", semesterId: "M2-1",
      conditions: selectionConditions([DP_TWO.curriculum.key], 1)
    },
    items: [{ itemId: DP_TWO.id, itemVersionId: DP_TWO.itemVersionId, order: 1, score: 2 }]
  }));
  assert.equal(childResponse.status, 201);
  const child = await childResponse.json();
  assert.equal(child.parentExamId, parent.examId);
  assert.equal(child.seed, 303);
  assert.deepEqual(child.items.map(item => item.itemId), [DP_TWO.id]);

  const editorStatus = await fetch(`${env.base}/admin/exam-editor/status`, { headers: { Cookie: await login(env.base, "보관함관리자", "ADMIN-LIBRARY") } });
  assert.equal(editorStatus.status, 200);
});

test("all_learning permits academy-free learning recipes but does not generate items", async t => {
  const env = await start();
  t.after(() => env.server.close());
  const student = await login(env.base, "학생둘", "STUDENT-TWO");
  const response = await createExam(env.base, student, createBody({
    generationMode: "learning",
    selectionSnapshot: { academyId: null, semesterId: "M2-1", conditions: selectionConditions([WM_ONE.curriculum.key], 1) },
    items: [{ itemId: WM_ONE.id, itemVersionId: WM_ONE.itemVersionId, order: 1, score: 1 }]
  }));
  assert.equal(response.status, 201);
  assert.equal((await response.json()).selectionSnapshot.academyId, null);
  assert.equal((await createExam(env.base, student, createBody({
    generationMode: "learning",
    selectionSnapshot: { academyId: null, semesterId: "M2-1", conditions: selectionConditions([WM_ONE.curriculum.key], 1, { questionCount: 1 }) },
    items: []
  }))).status, 400);
});

test("automatic generation preserves its snapshot and is deterministic with exact ratios", async t => {
  const env = await start();
  t.after(() => env.server.close());
  const student = await login(env.base, "학생하나", "STUDENT-ONE");

  async function generate(body) {
    return fetch(`${env.base}/user-exam-library/generate`, {
      method: "POST",
      headers: userHeaders(student, env.base),
      body: JSON.stringify(body)
    });
  }

  const firstResponse = await generate(generateBody());
  const secondResponse = await generate(generateBody());
  assert.equal(firstResponse.status, 201);
  assert.equal(secondResponse.status, 201);
  const first = await firstResponse.json();
  const second = await secondResponse.json();
  assert.deepEqual(first.items, second.items);
  assert.equal(first.items.length, 6);
  assert.deepEqual(first.layout, { columns: 2, itemsPerPage: 4 });

  const byId = new Map(AUTO_DP.map(item => [item.id, item]));
  const difficultyCounts = { lowered: 0, standard: 0, raised: 0 };
  const responseCounts = { objective: 0, subjective: 0 };
  first.items.forEach(function (item) {
    const candidate = byId.get(item.itemId);
    assert.ok(candidate, "automatic output must come from the approved registry pool");
    difficultyCounts[candidate.difficultyBand] += 1;
    responseCounts[candidate.inputType === "single_choice" ? "objective" : "subjective"] += 1;
  });
  assert.deepEqual(difficultyCounts, { lowered: 2, standard: 2, raised: 2 });
  assert.deepEqual(responseCounts, { objective: 3, subjective: 3 });
  assertNoPrivateFields(first);
});

test("automatic generation returns 403 for missing entitlement and 409 for too few candidates", async t => {
  const env = await start();
  t.after(() => env.server.close());
  const student = await login(env.base, "학생하나", "STUDENT-ONE");

  async function generate(body) {
    return fetch(`${env.base}/user-exam-library/generate`, {
      method: "POST",
      headers: userHeaders(student, env.base),
      body: JSON.stringify(body)
    });
  }

  const forbidden = await generate(generateBody({ semesterId: "M1-2" }));
  assert.equal(forbidden.status, 403);
  assert.match((await forbidden.json()).message, /이용 권한/);

  const shortage = await generate(generateBody({
    scopeKeys: [AUTO_DP[0].curriculum.key],
    questionCount: 2,
    difficultyWeights: { lowered: 1, standard: 0, raised: 0 },
    responseWeights: { objective: 1, subjective: 0 }
  }));
  assert.equal(shortage.status, 409);
  assert.match((await shortage.json()).message, /문항이 부족/);
});

test("SM automatic generation persists and enforces the exact algebra 15 and geometry 15 split", async t => {
  const env = await start();
  t.after(() => env.server.close());
  const student = await login(env.base, "학생하나", "STUDENT-ONE");
  const response = await fetch(`${env.base}/user-exam-library/generate`, {
    method: "POST",
    headers: userHeaders(student, env.base),
    body: JSON.stringify(generateBody({
      academyId: "SM",
      semesterId: "CM1",
      scopeKeys: ["G8/M01"],
      questionCount: 30,
      difficultyWeights: { lowered: 20, standard: 50, raised: 30 },
      responseWeights: { objective: 40, subjective: 60 },
      domainQuotas: { algebra: 15, geometry: 15 },
      seed: 15015
    }))
  });
  assert.equal(response.status, 201);
  const generated = await response.json();
  assert.deepEqual(generated.selectionSnapshot.conditions.domainQuotas, { algebra: 15, geometry: 15 });
  const byId = new Map(AUTO_SM.map(item => [item.id, item]));
  const domains = { algebra: 0, geometry: 0 };
  generated.items.forEach(function (item) { domains[byId.get(item.itemId).domainGroup] += 1; });
  assert.deepEqual(domains, { algebra: 15, geometry: 15 });
});

test("similar generation links its parent and deterministically excludes every parent item", async t => {
  const env = await start();
  t.after(() => env.server.close());
  const student = await login(env.base, "학생하나", "STUDENT-ONE");
  const parentResponse = await fetch(`${env.base}/user-exam-library/generate`, {
    method: "POST",
    headers: userHeaders(student, env.base),
    body: JSON.stringify(generateBody())
  });
  assert.equal(parentResponse.status, 201);
  const parent = await parentResponse.json();

  async function similar() {
    return fetch(`${env.base}/user-exam-library/exams/${parent.examId}/similar`, {
      method: "POST",
      headers: userHeaders(student, env.base),
      body: JSON.stringify({ derivationIndex: 1 })
    });
  }
  const firstResponse = await similar();
  const secondResponse = await similar();
  assert.equal(firstResponse.status, 201);
  assert.equal(secondResponse.status, 201);
  const first = await firstResponse.json();
  const second = await secondResponse.json();
  assert.equal(first.parentExamId, parent.examId);
  assert.equal(first.seed, second.seed);
  assert.deepEqual(first.items, second.items);
  assert.deepEqual(first.selectionSnapshot, parent.selectionSnapshot);
  assert.deepEqual(first.layout, parent.layout);
  const parentIds = new Set(parent.items.map(item => item.itemId));
  assert.equal(first.items.some(item => parentIds.has(item.itemId)), false);
});

test("similar generation searches beyond the first 100 candidates before excluding the parent", async t => {
  const candidates = Array.from({ length: 205 }, function (_, index) {
    return makeQuestion(300 + index, "DP", "approved", { difficultyBand: "standard", inputType: "input" });
  });
  const largeRegistry = {
    schemaVersion: "highselect-private-exam-editor-registry/v1",
    candidates: Object.fromEntries(candidates.map(item => [item.id, item])),
    relations: {}
  };
  const env = await start({ registry: largeRegistry });
  t.after(() => env.server.close());
  const student = await login(env.base, "학생하나", "STUDENT-ONE");
  const body = generateBody({
    scopeKeys: ["G8/M01"],
    questionCount: 100,
    difficultyWeights: { lowered: 0, standard: 1, raised: 0 },
    responseWeights: { objective: 0, subjective: 1 }
  });
  const parentResponse = await fetch(`${env.base}/user-exam-library/generate`, {
    method: "POST", headers: userHeaders(student, env.base), body: JSON.stringify(body)
  });
  assert.equal(parentResponse.status, 201);
  const parent = await parentResponse.json();
  const childResponse = await fetch(`${env.base}/user-exam-library/exams/${parent.examId}/similar`, {
    method: "POST", headers: userHeaders(student, env.base), body: JSON.stringify({ derivationIndex: 1 })
  });
  assert.equal(childResponse.status, 201);
  const child = await childResponse.json();
  assert.equal(child.items.length, 100);
  const parentIds = new Set(parent.items.map(item => item.itemId));
  assert.equal(child.items.some(item => parentIds.has(item.itemId)), false);
});
