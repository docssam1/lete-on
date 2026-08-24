const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const path = require("node:path");

const { createApp } = require("../server/app.js");
const { hashApprovalCode } = require("../server/security.js");
const core = require("../data/question-bank-core.js");
const practiceCore = require("../data/practice-bank-core.js");
const sourceLineage = require("../data/source-lineage.js");
const practiceStoreModule = require("../server/practice-store.js");

const SECRET = "practice-runtime-secret-with-at-least-32-characters";
const MODE = "SH";
const EXAM_ID = "sh-selection-r01";
const FIXED_NOW = Date.parse("2026-08-24T03:00:00.000Z");

function makeQuestion(relation, difficultyBand) {
  const familyId = core.createNeutralId("question", MODE, "runtime:practice:family:01");
  const questionId = relation === "original"
    ? familyId
    : core.createNeutralId("question", MODE, `runtime:practice:${relation}:${difficultyBand}:01`);
  const sourceAsset = sourceLineage.createSourceAssetReference({
    sourceAssetId: core.createNeutralId("source", MODE, `runtime:practice:asset:${relation}:${difficultyBand}:01`),
    sourceFingerprint: `sha256:${"1".padStart(64, "0")}`,
    pageNumber: 1,
    itemLocator: { code: "P01" },
    assetVariant: relation
  });
  return {
    id: questionId,
    mode: MODE,
    writer: "T",
    points: 1,
    curriculum: core.createCurriculumPath({ grade: "G10", major: "M01", minor: "S01", detail: "D01" }),
    provenance: core.createProvenanceRecord({
      mode: MODE,
      role: "internal-variant",
      status: "cleared",
      referenceId: core.createNeutralId("source", MODE, `runtime:practice:source:${relation}:${difficultyBand}:01`)
    }),
    answerVerification: core.createAnswerVerification({ status: "verified", reviewCount: 2 }),
    inputType: "input",
    generationKind: "parameterized",
    difficultyBand,
    variant: core.createVariantRecord({ mode: MODE, familyId, band: difficultyBand }),
    lineage: sourceLineage.createQuestionLineage({
      mode: MODE,
      id: core.createNeutralId("lineage", MODE, `runtime:practice:lineage:${relation}:${difficultyBand}:01`),
      sourceExamId: core.createNeutralId("exam", MODE, "runtime:practice:source-exam:01"),
      originalQuestionId: familyId,
      questionId,
      questionTypeId: core.createNeutralId("type", MODE, "runtime:practice:type:01"),
      relation,
      sourceAsset
    }),
    userApproval: sourceLineage.createUserApproval({
      mode: MODE,
      id: core.createNeutralId("approval", MODE, `runtime:practice:question-approval:${relation}:${difficultyBand}:01`),
      questionId,
      status: "approved",
      decisionVersion: 1
    }),
    singleAnswerAudit: { status: "passed", validOutcomeCount: 1, evidenceCode: "RUNTIME-PRACTICE-01" },
    figureAudit: { required: false, status: "not_required" },
    reviewStatus: "approved"
  };
}

function registry() {
  return {
    schemaVersion: "highselect-private-practice-registry/v1",
    modes: {
      SH: {
        policy: practiceCore.createPracticePolicy({
          id: core.createNeutralId("policy", MODE, "runtime:practice:policy:1"),
          mode: MODE,
          version: 1,
          setSize: 1,
          maxPerDetail: 1,
          minDistinctDetails: 1,
          exactRepeatCooldownDays: 7
        }),
        candidates: [
          makeQuestion("original", "standard"),
          makeQuestion("twin", "lowered"),
          makeQuestion("similar", "raised")
        ]
      }
    }
  };
}

function config(released = true) {
  return {
    schemaVersion: "highselect-private-config/v1",
    students: [
      { studentId: "student_practice", name: "연습학생", approvalCodeHash: hashApprovalCode("PRACTICE-001"), role: "student", grants: [EXAM_ID] },
      { studentId: "student_other", name: "다른학생", approvalCodeHash: hashApprovalCode("PRACTICE-003"), role: "student", grants: [EXAM_ID] },
      { studentId: "student_locked", name: "잠금학생", approvalCodeHash: hashApprovalCode("PRACTICE-002"), role: "student", grants: [] },
      { studentId: "admin_practice", name: "운영관리자", approvalCodeHash: hashApprovalCode("ADMIN-001"), role: "admin", grants: [] }
    ],
    exams: {
      [EXAM_ID]: {
        pageAssetRoot: path.join(__dirname, "missing-private-pages"),
        pageCount: 8,
        questionCount: 40,
        releaseStatus: released ? "released" : "review_pending",
        answerStatus: "verified",
        classificationStatus: "verified",
        responseSchemaStatus: "verified",
        scoringPolicyStatus: "verified",
        printAuditStatus: "passed",
        signedAssetsStatus: "verified",
        finalRoundConfirmation: released
      }
    }
  };
}

async function start(options = {}) {
  const app = createApp({
    sessionSecret: SECRET,
    assetSecret: `${SECRET}-asset`,
    privateConfig: config(options.released !== false),
    privateScorer: { schemaVersion: "highselect-private-scorer/v1", exams: {} },
    privatePracticeRegistry: registry(),
    privatePracticeStore: { schemaVersion: "highselect-private-practice/v1", sets: {} },
    practiceStore: options.practiceStore,
    cookieSecure: false,
    now: () => FIXED_NOW,
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
  return { response, cookie: String(response.headers.get("set-cookie") || "").split(";")[0] };
}

function adminHeaders(cookie, origin) {
  return { Cookie: cookie, Origin: origin, "Content-Type": "application/json", "X-Highselect-Admin": "1" };
}

function assertPublicMetadata(value) {
  practiceCore.assertPracticeMetadataOnly(value);
  const serialized = JSON.stringify(value);
  ["student_practice", "sourceFingerprint", "sourceAsset", "questionText", "correctAnswer", "solution", "C:\\", "G:\\"].forEach(token => {
    assert.equal(serialized.includes(token), false, `private practice value leaked: ${token}`);
  });
}

test("practice planning derives learner, candidates, and history on the server", async t => {
  const env = await start();
  t.after(() => env.server.close());
  assert.equal((await fetch(`${env.base}/practice-sets/plan`, { method: "POST" })).status, 401);

  const locked = await login(env.base, "잠금학생", "PRACTICE-002");
  const noGrant = await fetch(`${env.base}/practice-sets/plan`, {
    method: "POST",
    headers: { Cookie: locked.cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ mode: MODE })
  });
  assert.equal(noGrant.status, 403);

  const student = await login(env.base, "연습학생", "PRACTICE-001");
  const injected = await fetch(`${env.base}/practice-sets/plan`, {
    method: "POST",
    headers: { Cookie: student.cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ mode: MODE, learnerId: core.createNeutralId("learner", MODE, "hostile:learner:001") })
  });
  assert.equal(injected.status, 400);

  const firstResponse = await fetch(`${env.base}/practice-sets/plan`, {
    method: "POST",
    headers: { Cookie: student.cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "sh" })
  });
  assert.equal(firstResponse.status, 201);
  assert.equal(firstResponse.headers.get("cache-control"), "no-store");
  const first = await firstResponse.json();
  assert.equal(first.mode, MODE);
  assert.equal(first.releaseStatus, "approval_required");
  assert.equal(first.eligible, true);
  assert.equal(first.items.length, 1);
  assert.equal(core.isNeutralId(first.learnerId, "learner", MODE), true);
  assertPublicMetadata(first);

  const repeatedResponse = await fetch(`${env.base}/practice-sets/plan`, {
    method: "POST",
    headers: { Cookie: student.cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ mode: MODE })
  });
  assert.equal(repeatedResponse.status, 201);
  assert.deepEqual(await repeatedResponse.json(), first);
});

test("an unreleased exam grant never becomes practice access", async t => {
  const env = await start({ released: false });
  t.after(() => env.server.close());
  const student = await login(env.base, "연습학생", "PRACTICE-001");
  const response = await fetch(`${env.base}/practice-sets/plan`, {
    method: "POST",
    headers: { Cookie: student.cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ mode: MODE })
  });
  assert.equal(response.status, 403);
});

test("only an administrator can release an eligible practice plan with CSRF protection", async t => {
  const env = await start();
  t.after(() => env.server.close());
  const student = await login(env.base, "연습학생", "PRACTICE-001");
  const plannedResponse = await fetch(`${env.base}/practice-sets/plan`, {
    method: "POST",
    headers: { Cookie: student.cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ mode: MODE })
  });
  const plan = await plannedResponse.json();

  const pagesBeforeApproval = await fetch(`${env.base}/practice-sets/${encodeURIComponent(plan.id)}/pages`, {
    headers: { Cookie: student.cookie }
  });
  assert.equal(pagesBeforeApproval.status, 423);

  const studentApproval = await fetch(`${env.base}/practice-sets/${encodeURIComponent(plan.id)}/approve`, {
    method: "POST",
    headers: { Cookie: student.cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ decisionVersion: 1 })
  });
  assert.equal(studentApproval.status, 403);

  const admin = await login(env.base, "운영관리자", "ADMIN-001");
  const noCsrf = await fetch(`${env.base}/practice-sets/${encodeURIComponent(plan.id)}/approve`, {
    method: "POST",
    headers: { Cookie: admin.cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ decisionVersion: 1 })
  });
  assert.equal(noCsrf.status, 403);

  const approvedResponse = await fetch(`${env.base}/practice-sets/${encodeURIComponent(plan.id)}/approve`, {
    method: "POST",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({ decisionVersion: 1 })
  });
  assert.equal(approvedResponse.status, 200);
  const approved = await approvedResponse.json();
  assert.equal(approved.releaseStatus, "released");
  assert.equal(approved.approval.status, "approved");
  assert.equal(approved.approval.decisionVersion, 1);
  assert.equal(approved.approval.reviewer, "T");
  assertPublicMetadata(approved);

  const pagesWithoutAssets = await fetch(`${env.base}/practice-sets/${encodeURIComponent(plan.id)}/pages`, {
    headers: { Cookie: student.cookie }
  });
  assert.equal(pagesWithoutAssets.status, 423);
  const attemptsWithoutScorer = await fetch(`${env.base}/practice-sets/${encodeURIComponent(plan.id)}/attempts`, {
    method: "POST",
    headers: { Cookie: student.cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ results: [] })
  });
  assert.equal(attemptsWithoutScorer.status, 423);

  const conflictingVersion = await fetch(`${env.base}/practice-sets/${encodeURIComponent(plan.id)}/approve`, {
    method: "POST",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({ decisionVersion: 2 })
  });
  assert.equal(conflictingVersion.status, 409);
});

test("administrator approval rejects a store record rebound to another student", async t => {
  const store = practiceStoreModule.createStore({ data: { schemaVersion: "highselect-private-practice/v1", sets: {} } });
  const env = await start({ practiceStore: store });
  t.after(() => env.server.close());
  const student = await login(env.base, "연습학생", "PRACTICE-001");
  const plannedResponse = await fetch(`${env.base}/practice-sets/plan`, {
    method: "POST",
    headers: { Cookie: student.cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ mode: MODE })
  });
  const plan = await plannedResponse.json();
  const state = store.read(plan.id);
  store.update(plan.id, state.revision, value => ({ ...value, studentId: "student_other" }));

  const admin = await login(env.base, "운영관리자", "ADMIN-001");
  const response = await fetch(`${env.base}/practice-sets/${encodeURIComponent(plan.id)}/approve`, {
    method: "POST",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({ decisionVersion: 1 })
  });
  assert.equal(response.status, 409);
});
