const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const http = require("node:http");
const contracts = require("../server/exam-contracts.js");
const privateConfig = require("../server/private-config.js");
const privateScorer = require("../server/private-scorer.js");
const { createApp } = require("../server/app.js");
const { hashApprovalCode } = require("../server/security.js");
const schemaModule = require("../data/review-only/dp-cm1-basic-entry-r01-response-schema.js");
const answerLayout = require("../data/review-only/dp-cm1-basic-entry-r01-format.js");

const EXAM_ID = "dp-common1-basic-entry-mock-r01";

test("new DP CM1 answer layout preserves the reviewed choice and written question numbers", () => {
  assert.equal(answerLayout.examId, EXAM_ID);
  assert.equal(answerLayout.items.length, 30);
  assert.deepEqual(answerLayout.items.filter(item => item.responseFormatCandidate === "single_choice").map(item => item.number),
    [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 14, 18, 22, 23, 24, 25, 26, 30]);
  assert.equal(answerLayout.items.filter(item => item.responseFormatCandidate === "short_answer").length, 11);
  assert.doesNotMatch(JSON.stringify(answerLayout), /answerSpec|correctAnswer|solution|sourceQuestionId/i);
});

test("new DP CM1 28+2 review packet has its own 15-page contract", () => {
  const old = contracts.getExamContract("dp-common1-entry-202405");
  const current = contracts.getExamContract(EXAM_ID);
  assert.equal(old.pageCount, 10);
  assert.equal(current.pageCount, 15);
  assert.equal(current.questionCount, 30);
  assert.equal(current.title, "돌파 공통수학1 기본반 입학 모의고사 1회");
  assert.equal(current.responseSchemaVersion, schemaModule.SCHEMA_VERSION);
  assert.equal(current.cutlinePolicy, null);
  const schema = contracts.responseSchemaFor(EXAM_ID, "student-DP-CM1-R01");
  assert.deepEqual(schemaModule.validate(schema), []);
  assert.equal(schema.questions.length, 30);
  assert.equal(schema.questions.every(row => row.responseType === "input"), true);
  assert.equal(JSON.stringify(schema).includes("DP-Q-"), false);
  assert.equal(JSON.stringify(schema).includes("answer"), false);
});

test("new DP CM1 review packet cannot release before the explicit final confirmation", () => {
  const normalized = privateConfig.normalize({
    schemaVersion: "highselect-private-config/v1",
    students: [],
    exams: {
      [EXAM_ID]: {
        pageAssetRoot: path.join(os.tmpdir(), "dp-cm1-basic-entry-r01", "pages"),
        pageCount: 15,
        questionCount: 30,
        releaseStatus: "review_pending",
        answerStatus: "verified",
        classificationStatus: "pending",
        responseSchemaStatus: "verified",
        scoringPolicyStatus: "pending",
        printAuditStatus: "passed",
        signedAssetsStatus: "pending",
        finalRoundConfirmation: false
      }
    }
  });
  assert.equal(privateConfig.isReleased(normalized.exams[EXAM_ID]), false);
});

test("new DP CM1 scorer rejects an unbound or reordered private answer list", () => {
  const items = schemaModule.questions.map(question => ({
    number: question.number,
    responseType: question.responseType,
    answerSpec: { type: "input", answers: ["1"] },
    classification: {
      points: 1, domain: "대수", gradeBand: "중3", semester: "2학기",
      majorUnit: "대수", minorUnit: "식의 계산", detailType: "기본 연산",
      difficulty: question.number === 29 ? "advanced" : "standard",
      evidence: ["private review pending"]
    }
  }));
  const raw = {
    schemaVersion: "highselect-private-scorer/v1",
    exams: { [EXAM_ID]: { gradingVersion: "review-v1", classificationStatus: "verified", items } }
  };
  assert.throws(() => privateScorer.normalize(raw), /source item order does not match/);
  items[0].sourceQuestionId = "wrong-source-item";
  assert.throws(() => privateScorer.normalize(raw), /source item order does not match/);
});

test("report and UI recognize advanced as a separate difficulty", () => {
  const reportPage = fs.readFileSync(path.join(__dirname, "..", "shared", "report-page.js"), "utf8");
  assert.match(reportPage, /advanced:\s*"심화"/);
  assert.match(privateScorer.normalize({
    schemaVersion: "highselect-private-scorer/v1",
    exams: {
      "test-advanced": {
        gradingVersion: "review-v1", classificationStatus: "verified",
        items: [{
          number: 1, responseType: "input", answerSpec: { type: "input", answers: ["1"] },
          classification: {
            points: 1, domain: "기하", gradeBand: "중3", semester: "2학기",
            majorUnit: "기하", minorUnit: "삼각비", detailType: "복합 추론",
            difficulty: "advanced", evidence: ["source comparison"]
          }
        }]
      }
    }
  }).exams["test-advanced"].items[0].classification.difficulty, /^advanced$/);
});

test("15-page signed delivery and answerless schema work only behind the simulated full release gate", async t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dp-cm1-r01-pages-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (let number = 1; number <= 15; number += 1) {
    fs.writeFileSync(path.join(root, `page-${String(number).padStart(2, "0")}.png`), Buffer.from([137, 80, 78, 71, number]));
  }
  const config = {
    schemaVersion: "highselect-private-config/v1",
    students: [{
      studentId: "student-dp-r01", name: "검사학생",
      approvalCodeHash: hashApprovalCode("DP-R01-CODE", Buffer.alloc(16, 4).toString("base64url")),
      grants: [EXAM_ID]
    }],
    exams: { [EXAM_ID]: {
      pageAssetRoot: root, pageCount: 15, questionCount: 30,
      releaseStatus: "released", answerStatus: "verified", classificationStatus: "verified",
      responseSchemaStatus: "verified", scoringPolicyStatus: "verified", printAuditStatus: "passed",
      signedAssetsStatus: "verified", finalRoundConfirmation: true
    } }
  };
  const app = createApp({
    sessionSecret: "dp-r01-session-secret-with-at-least-32-characters",
    assetSecret: "dp-r01-asset-secret-with-at-least-32-characters",
    privateConfig: config,
    privateScorer: { schemaVersion: "highselect-private-scorer/v1", exams: {} },
    publicOrigin: "https://assets.example.test",
    cookieSecure: false,
    staticRoot: path.join(__dirname, "..")
  });
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  t.after(() => server.close());
  const base = `http://127.0.0.1:${server.address().port}`;
  const login = await fetch(`${base}/session`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "검사학생", approvalCode: "DP-R01-CODE" })
  });
  assert.equal(login.status, 200);
  const cookie = String(login.headers.get("set-cookie") || "").split(";")[0];
  const pagesResponse = await fetch(`${base}/exams/${EXAM_ID}/pages`, { headers: { Cookie: cookie } });
  assert.equal(pagesResponse.status, 200, await pagesResponse.clone().text());
  const pages = await pagesResponse.json();
  assert.equal(pages.pages.length, 15);
  assert.deepEqual(pages.pages.map(page => page.number), Array.from({ length: 15 }, (_, i) => i + 1));
  assert.equal(JSON.stringify(pages).includes(root), false);
  assert.equal(JSON.stringify(pages).includes("answer"), false);
  const signed = new URL(pages.pages[14].url);
  const image = await fetch(`${base}${signed.pathname}${signed.search}`, { headers: { Cookie: cookie } });
  assert.equal(image.status, 200);
  assert.equal(image.headers.get("cache-control"), "private, no-store");
  signed.searchParams.set("sig", "tampered");
  const rejected = await fetch(`${base}${signed.pathname}${signed.search}`, { headers: { Cookie: cookie } });
  assert.equal(rejected.status, 403);
  const schemaResponse = await fetch(`${base}/exams/${EXAM_ID}/response-schema`, { headers: { Cookie: cookie } });
  assert.equal(schemaResponse.status, 200);
  const schema = await schemaResponse.json();
  assert.equal(schema.questions.length, 30);
  assert.deepEqual(schemaModule.validate(schema), []);
  assert.equal(JSON.stringify(schema).includes("answer"), false);
});
