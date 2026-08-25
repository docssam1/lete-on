const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const { createApp } = require("../server/app.js");
const { hashApprovalCode } = require("../server/security.js");
const schemaModule = require("../data/review-only/sh-r01-response-schema.js");
const reportSecurity = require("../shared/report-security.js");
const examSecurity = require("../shared/exam-security.js");
const bankCore = require("../data/question-bank-core.js");

const EXAM_ID = "sh-selection-r01";
const SECRET = "test-session-secret-with-at-least-32-characters";

function privateConfig(root, released = true) {
  return {
    schemaVersion: "highselect-private-config/v1",
    students: [
      { studentId: "student_a", name: "테스트학생", approvalCodeHash: hashApprovalCode("PASS-001", Buffer.alloc(16, 1).toString("base64url")), grants: [EXAM_ID] },
      { studentId: "student_b", name: "잠금학생", approvalCodeHash: hashApprovalCode("PASS-002", Buffer.alloc(16, 2).toString("base64url")), grants: [] },
      { studentId: "admin_a", name: "관리자", approvalCodeHash: hashApprovalCode("ADMIN-001", Buffer.alloc(16, 3).toString("base64url")), role: "admin", grants: [] }
    ],
    exams: {
      [EXAM_ID]: {
        pageAssetRoot: root,
        pageCount: 8,
        questionCount: 40,
        releaseStatus: released ? "released" : "review_pending",
        answerStatus: "verified",
        classificationStatus: "verified",
        responseSchemaStatus: "verified",
        scoringPolicyStatus: "verified",
        printAuditStatus: "passed",
        signedAssetsStatus: "verified",
        finalRoundConfirmation: true
      }
    },
    examDraftCandidates: [{
      itemId: bankCore.createSharedBankId("question", "builder-item-a"), mode: "SH", familyId: bankCore.createSharedBankId("question", "builder-family-a"),
      typeId: bankCore.createSharedBankId("type", "builder-type-a"), curriculum: { grade: "G09", major: "ALG", minor: "EQ", detail: "LIN" }, responseType: "input",
      classificationVerified: true, answerVerified: true, rightsVerified: true, releaseEligible: true, lineageRelation: "original", difficultyBand: "standard",
      coreConditionVerified: true, solutionStructureVerified: true
    }, {
      itemId: bankCore.createSharedBankId("question", "builder-item-b"), mode: "SH", familyId: bankCore.createSharedBankId("question", "builder-family-a"),
      typeId: bankCore.createSharedBankId("type", "builder-type-a"), curriculum: { grade: "G09", major: "ALG", minor: "EQ", detail: "LIN" }, responseType: "single_choice",
      classificationVerified: true, answerVerified: true, rightsVerified: true, releaseEligible: true, lineageRelation: "twin", difficultyBand: "standard",
      coreConditionVerified: true, solutionStructureVerified: true
    }]
  };
}

function answerSpec(question) {
  if (question.responseType === "multi_input") {
    return {
      type: "multi_input",
      slots: question.fields.map(field => ({ slotId: field.slotId, groupId: field.groupId, answer: "ok" }))
    };
  }
  if (question.responseType === "ordered_list" || question.responseType === "unordered_set") {
    return { type: question.responseType, answers: ["ok"] };
  }
  return { type: "input", answers: ["ok"] };
}

function privateScorer() {
  return {
    schemaVersion: "highselect-private-scorer/v1",
    exams: {
      [EXAM_ID]: {
        gradingVersion: "ops-score-v1",
        classificationStatus: "verified",
        items: schemaModule.questions.map(question => ({
          number: question.number,
          responseType: question.responseType,
          answerSpec: answerSpec(question)
        }))
      }
    }
  };
}

function makePages() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "highselect-pages-"));
  for (let number = 1; number <= 8; number += 1) {
    fs.writeFileSync(path.join(root, `page-${String(number).padStart(2, "0")}.png`), Buffer.from([137, 80, 78, 71, number]));
  }
  return root;
}

async function start(options = {}) {
  const root = options.root || makePages();
  const app = createApp({
    sessionSecret: SECRET,
    assetSecret: `${SECRET}-asset`,
    privateConfig: options.config || privateConfig(root, options.released !== false),
    privateScorer: privateScorer(),
    publicOrigin: "https://assets.example.test",
    cookieSecure: true,
    staticRoot: path.join(__dirname, "..")
  });
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  return { server, base: `http://127.0.0.1:${address.port}`, root };
}

async function login(base, name = "테스트학생", approvalCode = "PASS-001") {
  const response = await fetch(`${base}/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, approvalCode })
  });
  return { response, cookie: String(response.headers.get("set-cookie") || "").split(";")[0] };
}

function safeWalk(value) {
  if (!value || typeof value !== "object") return;
  for (const [key, item] of Object.entries(value)) {
    assert.equal(/answer|solution|explanation|sourcepath|storagepath|pdfurl/i.test(key), false, `private key leaked: ${key}`);
    safeWalk(item);
  }
}

function safeBuilderWalk(value) {
  if (!value || typeof value !== "object") return;
  for (const [key, item] of Object.entries(value)) {
    assert.equal(/^(answer|answers|answerSpec|answerKey|correctAnswer|solution|explanation|sourcePath|storagePath|pdfUrl)$/i.test(key), false, `private builder key leaked: ${key}`);
    safeBuilderWalk(item);
  }
}

function payloadFrom(schema) {
  return schema.questions.map(question => {
    if (question.responseType === "multi_input") return {
      number: question.number,
      responseType: question.responseType,
      value: question.fields.map(() => "ok"),
      slotIds: question.fields.map(field => field.slotId),
      groupIds: question.fields.map(field => field.groupId || null)
    };
    if (question.responseType === "ordered_list" || question.responseType === "unordered_set") {
      return { number: question.number, responseType: question.responseType, value: ["ok"] };
    }
    return { number: question.number, responseType: question.responseType, value: "ok" };
  });
}

test("name and approval-number login issues a secure HttpOnly session and returns only per-exam grants", async t => {
  const env = await start();
  t.after(() => env.server.close());
  const wrong = await login(env.base, "테스트학생", "WRONG");
  assert.equal(wrong.response.status, 401);
  const success = await login(env.base);
  assert.equal(success.response.status, 200);
  const data = await success.response.json();
  assert.deepEqual(data.access, [EXAM_ID]);
  assert.equal(data.studentId, "student_a");
  const header = success.response.headers.get("set-cookie");
  assert.match(header, /HttpOnly/i);
  assert.match(header, /Secure/i);
  assert.match(header, /SameSite=Lax/i);
  assert.doesNotMatch(header, /PASS-001/);
});

test("unapproved exams stay locked even though the catalog can remain visible", async t => {
  const env = await start();
  t.after(() => env.server.close());
  const auth = await login(env.base, "잠금학생", "PASS-002");
  const response = await fetch(`${env.base}/exams/${EXAM_ID}/pages`, { headers: { Cookie: auth.cookie } });
  assert.equal(response.status, 403);
});

test("page manifest contains only short-lived signed images and a tampered signature is rejected", async t => {
  const env = await start();
  t.after(() => env.server.close());
  const auth = await login(env.base);
  const response = await fetch(`${env.base}/exams/${EXAM_ID}/pages`, { headers: { Cookie: auth.cookie } });
  assert.equal(response.status, 200);
  const manifest = await response.json();
  assert.equal(manifest.pages.length, 8);
  assert.equal(manifest.studentId, "student_a");
  assert.equal(examSecurity.validateManifest(manifest, { id: EXAM_ID, pageCount: 8 }, { studentId: "student_a" }, {
    assetMode: "signed-page-images",
    assetHosts: ["assets.example.test"],
    maxPageUrlTtlSeconds: 900
  }).length, 8);
  manifest.pages.forEach((page, index) => {
    const url = new URL(page.url);
    assert.equal(url.protocol, "https:");
    assert.equal(url.hostname, "assets.example.test");
    assert.equal(page.number, index + 1);
    assert.equal(page.mimeType, "image/png");
    assert.doesNotMatch(url.pathname + url.search, /\.pdf|highselect-pages|^[A-Za-z]:|\\/i);
  });
  const signed = new URL(manifest.pages[0].url);
  const valid = await fetch(`${env.base}${signed.pathname}${signed.search}`, { headers: { Cookie: auth.cookie } });
  assert.equal(valid.status, 200);
  assert.equal(valid.headers.get("cache-control"), "private, no-store");
  signed.searchParams.set("sig", "tampered");
  const tampered = await fetch(`${env.base}${signed.pathname}${signed.search}`, { headers: { Cookie: auth.cookie } });
  assert.equal(tampered.status, 403);
});

test("SH-R01 completes login, schema, submission and no-store diagnostic report without answer leakage", async t => {
  const env = await start();
  t.after(() => env.server.close());
  const auth = await login(env.base);
  const schemaResponse = await fetch(`${env.base}/exams/${EXAM_ID}/response-schema`, { headers: { Cookie: auth.cookie } });
  assert.equal(schemaResponse.status, 200);
  const schema = await schemaResponse.json();
  assert.equal(schema.questions.length, 40);
  assert.deepEqual(schema.questions.reduce((counts, q) => { counts[q.responseType] = (counts[q.responseType] || 0) + 1; return counts; }, {}), {
    input: 33,
    multi_input: 3,
    unordered_set: 3,
    ordered_list: 1
  });
  safeWalk(schema);

  const submit = await fetch(`${env.base}/exams/${EXAM_ID}/attempts`, {
    method: "POST",
    headers: { Cookie: auth.cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ answers: payloadFrom(schema) })
  });
  assert.equal(submit.status, 201);
  const { attemptId } = await submit.json();
  assert.match(attemptId, /^att_[0-9a-f-]+$/);

  const reportResponse = await fetch(`${env.base}/attempts/${attemptId}/report`, { headers: { Cookie: auth.cookie } });
  assert.equal(reportResponse.status, 200);
  assert.equal(reportResponse.headers.get("cache-control"), "no-store");
  const report = await reportResponse.json();
  safeWalk(report);
  assert.equal(report.score, 40);
  assert.equal(report.totalPoints, 40);
  assert.equal(report.cutlineDecision, null);
  const validated = reportSecurity.validateReport(report, {
    attemptId,
    session: { studentId: "student_a" },
    catalog: { exams: [{ id: EXAM_ID, title: "황소 고등 선발 대비 1회", questionCount: 40, programId: "SH", curriculumVersion: "2022-revised", releaseStatus: "released", answerStatus: "verified", classificationStatus: "verified" }] },
    cutlinePolicies: { referenceCutlines: [], examAssignments: [] }
  });
  assert.equal(validated.score, 40);
  assert.equal(validated.cutline.available, false);
});

test("all student endpoints fail closed before the full private release gate is complete", async t => {
  const root = makePages();
  const env = await start({ root, config: privateConfig(root, false) });
  t.after(() => env.server.close());
  const auth = await login(env.base);
  const response = await fetch(`${env.base}/exams/${EXAM_ID}/response-schema`, { headers: { Cookie: auth.cookie } });
  assert.equal(response.status, 423);
});

test("the isolated server never exposes a PDF through its static route", async t => {
  const env = await start();
  t.after(() => env.server.close());
  const response = await fetch(`${env.base}/private-source.pdf`);
  assert.equal(response.status, 404);
});

test("admin draft builder lists only safe candidates and supports placement add, reorder, and removal", async t => {
  const env = await start();
  t.after(() => env.server.close());
  const auth = await login(env.base, "관리자", "ADMIN-001");
  const created = await fetch(`${env.base}/admin/exam-drafts`, {
    method: "POST", headers: { Cookie: auth.cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "SH", title: "관리자 초안", scope: { curriculumVersion: "2022-revised", paths: [{ grade: "G09", major: "ALG", minor: "EQ", detail: "LIN" }] } })
  });
  assert.equal(created.status, 201);
  const draft = await created.json();
  safeBuilderWalk(draft);
  const candidates = await fetch(`${env.base}/admin/exam-drafts/${encodeURIComponent(draft.draft.id)}/candidates?sort=response_type`, { headers: { Cookie: auth.cookie } });
  assert.equal(candidates.status, 200);
  const candidatePayload = await candidates.json();
  assert.equal(candidatePayload.candidates.length, 2);
  assert.equal(candidatePayload.candidates[0].responseType, "input");
  safeBuilderWalk(candidatePayload);
  const added = await fetch(`${env.base}/admin/exam-drafts/${encodeURIComponent(draft.draft.id)}/placements`, {
    method: "POST", headers: { Cookie: auth.cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ itemId: candidatePayload.candidates[0].itemId, points: 3 })
  });
  assert.equal(added.status, 200);
  const withPlacement = await added.json();
  assert.equal(withPlacement.placements.length, 1);
  const changedScope = await fetch(`${env.base}/admin/exam-drafts/${encodeURIComponent(draft.draft.id)}/scope`, {
    method: "POST", headers: { Cookie: auth.cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ scope: { curriculumVersion: "2022-revised", paths: [{ grade: "G09", major: "ALG", minor: "EQ", detail: "LIN" }] } })
  });
  assert.equal(changedScope.status, 200);
  assert.equal((await changedScope.json()).draft.scopeVersion, 2);
  const replacementCandidate = candidatePayload.candidates.find(candidate => candidate.lineageRelation === "twin");
  const replaced = await fetch(`${env.base}/admin/exam-drafts/${encodeURIComponent(draft.draft.id)}/placements/${encodeURIComponent(withPlacement.placements[0].id)}/replace`, {
    method: "POST", headers: { Cookie: auth.cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ itemId: replacementCandidate.itemId, reasonCode: "SOURCE_CORRECTION", sameFamily: true, sameDetailType: true, sameCoreConditions: true, sameSolutionStructure: true, difficultyReviewed: true })
  });
  assert.equal(replaced.status, 200);
  assert.equal((await replaced.json()).placements[0].item.itemId, replacementCandidate.itemId);
  const reordered = await fetch(`${env.base}/admin/exam-drafts/${encodeURIComponent(draft.draft.id)}/reorder`, {
    method: "POST", headers: { Cookie: auth.cookie, "Content-Type": "application/json" }, body: JSON.stringify({ placementIds: [withPlacement.placements[0].id] })
  });
  assert.equal(reordered.status, 200);
  const removed = await fetch(`${env.base}/admin/exam-drafts/${encodeURIComponent(draft.draft.id)}/placements/${encodeURIComponent(withPlacement.placements[0].id)}`, { method: "DELETE", headers: { Cookie: auth.cookie } });
  assert.equal(removed.status, 200);
  assert.equal((await removed.json()).placements.length, 0);
  const batch = await fetch(`${env.base}/admin/exam-drafts/${encodeURIComponent(draft.draft.id)}/placements/batch`, {
    method: "POST", headers: { Cookie: auth.cookie, "Content-Type": "application/json" }, body: JSON.stringify({ itemIds: [candidatePayload.candidates[0].itemId], points: 2 })
  });
  assert.equal(batch.status, 200);
  assert.equal((await batch.json()).placements[0].points, 2);
  const preview = await fetch(`${env.base}/admin/exam-drafts/${encodeURIComponent(draft.draft.id)}/output-preview?questionsPerPage=5`, { headers: { Cookie: auth.cookie } });
  assert.equal(preview.status, 200);
  const previewPayload = await preview.json();
  assert.equal(previewPayload.pages.length, 1);
  assert.equal(previewPayload.answerResponseLayout[0].responseType, candidatePayload.candidates[0].responseType);
  safeBuilderWalk(previewPayload);
  const student = await login(env.base);
  const forbidden = await fetch(`${env.base}/admin/exam-drafts`, { headers: { Cookie: student.cookie } });
  assert.equal(forbidden.status, 403);
});
