"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { webcrypto } = require("node:crypto");

const hyperFocusRoot = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(hyperFocusRoot, "secure-mock.js"), "utf8");
const edgeSource = fs.readFileSync(
  path.join(hyperFocusRoot, "supabase", "functions", "secure-mock", "index.ts"),
  "utf8"
);
const PROJECT_URL = "https://uqtkxhchtbcizzteuvsq.supabase.co";
const ATTEMPT_ID = "11111111-1111-4111-8111-111111111111";

function examSummary(overrides = {}) {
  return {
    id: "premier-utilization-01",
    title: "프리미어 활용 모의고사 1회",
    series: "utilization",
    roundNo: 1,
    status: "published",
    revision: 7,
    publishedAt: "2026-08-01T00:00:00+00:00",
    answersReleasedAt: null,
    ...overrides
  };
}

function question(number, overrides = {}) {
  const typeKey = number === 1 ? "number-card-pairing" : "order-reasoning";
  return {
    number,
    questionKey: `premier:utilization-01:q${String(number).padStart(2, "0")}`,
    revision: 7,
    areaKey: number === 1 ? "arithmetic" : "logic",
    areaLabel: number === 1 ? "수와 연산" : "논리와 관계",
    typeKey,
    typeTitle: number === 1 ? "수 카드 짝짓기" : "순서 추론",
    typeId: number,
    typeCode: `P-U01-${String(number).padStart(2, "0")}`,
    difficultyLabel: number === 1 ? "기본" : "응용",
    prompt: number === 1 ? "3 < 5인지 확인하고 조건을 만족하는 수를 구하세요." : "조건에 맞는 순서를 구하세요.",
    releaseStatus: "verified",
    scoringEligible: true,
    lockReasons: [],
    signedAssetUrl: `${PROJECT_URL}/storage/v1/object/sign/hf-mock-private/utilization/01/q${String(number).padStart(2, "0")}.png?token=question-${number}`,
    assetAlt: number === 1 ? "숫자 카드 \"그림\"" : "순서 조건 그림",
    mimeType: "image/png",
    ...overrides
  };
}

function loadExamResponse(overrides = {}) {
  return {
    exam: examSummary(),
    attemptId: ATTEMPT_ID,
    attemptNo: 1,
    attemptStatus: "in_progress",
    serverSeed: 2481,
    manifestRevision: 7,
    title: "프리미어 활용 모의고사 1회",
    questions: [question(1), question(2)],
    durationMinutes: 20,
    subtitle: "20분 · 2문항",
    description: "검증을 통과한 프리미어 모의고사입니다.",
    questionCount: 2,
    sourceQuestionCount: 2,
    signedUrlExpiresIn: 900,
    ...overrides
  };
}

function pageQuestion(number, overrides = {}) {
  const value = question(number, overrides);
  delete value.signedAssetUrl;
  delete value.assetAlt;
  delete value.mimeType;
  return value;
}

function page(number, overrides = {}) {
  return {
    number,
    signedAssetUrl: `${PROJECT_URL}/storage/v1/object/sign/hf-mock-private/utilization/01/page_${String(number).padStart(3, "0")}.webp?token=page-${number}`,
    assetAlt: `프리미어 활용 모의고사 1회 ${number}쪽`,
    mimeType: "image/webp",
    ...overrides
  };
}

function pageExamResponse(overrides = {}) {
  return loadExamResponse({
    deliveryMode: "page_images",
    pages: [page(1), page(2)],
    questions: [pageQuestion(1), pageQuestion(2)],
    ...overrides
  });
}

function answerResponse(overrides = {}) {
  return {
    attemptId: ATTEMPT_ID,
    attemptStatus: "grading",
    manifestRevision: 7,
    answersViewedAt: "2026-08-24T03:00:00+00:00",
    answers: [
      {
        questionKey: "premier:utilization-01:q01",
        revision: 7,
        answerType: "number",
        answer: 4,
        answerText: "4",
        answerCandidates: [4],
        verificationStatus: "verified"
      },
      {
        questionKey: "premier:utilization-01:q02",
        revision: 7,
        answerType: "text",
        answer: "민수",
        answerText: "민수",
        answerCandidates: ["민수"],
        verificationStatus: "verified"
      }
    ],
    ...overrides
  };
}

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  const writes = [];
  return {
    values,
    writes,
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); writes.push([key, String(value)]); },
    removeItem(key) { values.delete(key); }
  };
}

function harness(options = {}) {
  const featureEnabled = options.featureEnabled !== false;
  const supabaseEnabled = options.supabaseEnabled !== false;
  const storage = options.storage || memoryStorage();
  const calls = [];
  let firstSaveFailed = false;
  const responses = {
    listExams: { exams: [examSummary()] },
    loadExam: loadExamResponse(),
    loadAnswers: answerResponse(),
    startNewAttempt: {
      exam: examSummary(),
      attemptId: "22222222-2222-4222-8222-222222222222",
      attemptNo: 2,
      attemptStatus: "in_progress",
      manifestRevision: 7
    },
    ...(options.responses || {})
  };
  const client = {
    functions: {
      async invoke(name, invokeOptions) {
        const body = JSON.parse(JSON.stringify(invokeOptions.body));
        calls.push({ name, body });
        if (options.edgeError) return { data: options.edgeError.data || null, error: options.edgeError.error || null };
        if (body.action === "saveAttempt") {
          if (options.failFirstSave && !firstSaveFailed) {
            firstSaveFailed = true;
            return { data: null, error: { code: "FunctionsFetchError" } };
          }
          const marks = body.marks;
          const correctCount = Object.values(marks).filter(mark => mark === "o").length;
          const wrongQuestionKeys = [];
          const wrongTypeKeys = [];
          if (marks["1"] === "x") { wrongQuestionKeys.push("premier:utilization-01:q01"); wrongTypeKeys.push("number-card-pairing"); }
          if (marks["2"] === "x") { wrongQuestionKeys.push("premier:utilization-01:q02"); wrongTypeKeys.push("order-reasoning"); }
          const defaultSave = {
            attemptId: body.attemptId,
            submissionId: body.submissionId,
            status: "submitted",
            attemptNo: 1,
            manifestRevision: 7,
            correctCount,
            questionCount: 2,
            score: Math.round(correctCount * 100 / 2),
            wrongQuestionKeys,
            wrongTypeKeys,
            submittedAt: "2026-08-24T03:01:00+00:00"
          };
          const response = typeof options.saveResponse === "function"
            ? options.saveResponse(defaultSave, body)
            : options.saveResponse || defaultSave;
          return { data: response, error: null };
        }
        const response = typeof responses[body.action] === "function"
          ? responses[body.action](body)
          : responses[body.action];
        return { data: response, error: null };
      }
    }
  };
  const context = {
    console,
    crypto: webcrypto,
    URL,
    sessionStorage: storage,
    GFIELD_HF_SUPABASE_CONFIG: {
      enabled: supabaseEnabled,
      projectUrl: PROJECT_URL,
      features: { secureMockDelivery: featureEnabled }
    },
    GFieldHFSupabase: {
      enabled: () => supabaseEnabled,
      ready: async () => client
    }
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(source, context, { filename: "secure-mock.js" });
  return { api: context.GFieldHFSecureMock, calls, storage, context };
}

async function rejectsCode(promise, code) {
  await assert.rejects(promise, error => {
    assert.equal(error.code, code, error.stack);
    return true;
  });
}

async function load(h) {
  return h.api.loadExam("premier-utilization-01");
}

async function testFeatureGateHasNoSideEffects() {
  const h = harness({ featureEnabled: false });
  assert.deepEqual(Object.keys(h.api).sort(), ["listExams", "loadAnswers", "loadExam", "saveAttempt", "startNewAttempt"]);
  assert(Object.isFrozen(h.api));
  await rejectsCode(h.api.listExams(), "HF_SECURE_MOCK_FEATURE_DISABLED");
  await rejectsCode(h.api.loadExam("premier-utilization-01"), "HF_SECURE_MOCK_FEATURE_DISABLED");
  await rejectsCode(h.api.loadAnswers(ATTEMPT_ID), "HF_SECURE_MOCK_FEATURE_DISABLED");
  await rejectsCode(h.api.startNewAttempt("premier-utilization-01"), "HF_SECURE_MOCK_FEATURE_DISABLED");
  await rejectsCode(h.api.saveAttempt({}), "HF_SECURE_MOCK_FEATURE_DISABLED");
  assert.equal(h.calls.length, 0);
  assert.equal(h.storage.writes.length, 0, "feature off 상태에서 sessionStorage를 변경하면 안 됩니다.");
}

async function testRetakeRequiresExplicitDedicatedAction() {
  const h = harness();
  const result = await h.api.startNewAttempt("premier-utilization-01");
  assert.equal(result.attemptNo, 2);
  assert.equal(result.attemptStatus, "in_progress");
  const call = h.calls.at(-1);
  assert.equal(call.body.action, "startNewAttempt");
  assert.deepEqual(Object.keys(call.body).sort(), ["action", "examId", "retakeEventId"]);
  assert.match(call.body.retakeEventId, /^[0-9a-f-]{36}$/i);
  assert.equal(h.storage.values.has("hf-secure-mock:retake:v1:premier-utilization-01"), false,
    "성공한 재응시 키는 다음 명시적 재응시를 위해 제거해야 합니다.");
}

async function testEdgeOnlyPayloadContractsAndLocalImageMarkup() {
  const h = harness();
  const exams = await h.api.listExams();
  assert.equal(exams.length, 1);
  assert.equal(exams[0].id, "premier-utilization-01");
  const document = await load(h);
  assert.equal(document.attemptId, ATTEMPT_ID);
  assert.equal(document.manifestRevision, 7);
  assert.equal(document.serverSeed, 2481);
  assert.equal(document.seed, 2481);
  assert.equal(document.questions.length, 2);
  assert.equal(document.questions[0].prompt, "3 < 5인지 확인하고 조건을 만족하는 수를 구하세요.");
  assert.match(document.questions[0].problemHtml, /^<img class="hf-secure-question-asset"/);
  assert.match(document.questions[0].problemHtml, /alt="숫자 카드 &quot;그림&quot;"/);
  assert.doesNotMatch(document.questions[0].problemHtml, /<script/i);

  assert.deepEqual(h.calls[0], { name: "secure-mock", body: { action: "listExams" } });
  assert.equal(h.calls[1].name, "secure-mock");
  assert.deepEqual(Object.keys(h.calls[1].body).sort(), ["action", "examId", "loadEventId"]);
  assert.equal(h.calls[1].body.action, "loadExam");
  assert.equal(h.calls[1].body.examId, "premier-utilization-01");
  assert.match(h.calls[1].body.loadEventId, /^[0-9a-f-]{36}$/i);
  ["approvalCode", "name", "studentId", "score", "correctCount", "questionCount", "wrongTypeIds"]
    .forEach(key => assert(!Object.prototype.hasOwnProperty.call(h.calls[1].body, key)));

  assert.doesNotMatch(source, /\.from\s*\(/);
  assert.doesNotMatch(source, /\.rpc\s*\(/);
  assert.doesNotMatch(source, /GFieldHFSupabase[\s\S]{0,80}signedAssetUrl/);
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.match(source, /functions\.invoke\(EDGE_FUNCTION/);

  const catalog = harness({
    responses: {
      listExams: {
        exams: [
          examSummary(),
          examSummary({
            id: "premier-final-01",
            title: "프리미어 파이널 모의고사 1회",
            series: "final"
          })
        ]
      }
    }
  });
  const twoExams = await catalog.api.listExams();
  assert.deepEqual(Array.from(twoExams, exam => exam.id), ["premier-utilization-01", "premier-final-01"]);
}

async function testRetryIdentifiersAreStable() {
  const h = harness();
  await load(h);
  await load(h);
  const loadCalls = h.calls.filter(call => call.body.action === "loadExam");
  assert.equal(loadCalls.length, 2);
  assert.equal(loadCalls[0].body.loadEventId, loadCalls[1].body.loadEventId);

  const first = await h.api.saveAttempt({ attemptId: ATTEMPT_ID, marks: { 1: "o", 2: "x" } });
  const second = await h.api.saveAttempt({ attemptId: ATTEMPT_ID, marks: { 1: "o", 2: "x" } });
  assert.equal(first.submissionId, second.submissionId);
  const saves = h.calls.filter(call => call.body.action === "saveAttempt");
  assert.equal(saves.length, 2);
  assert.equal(saves[0].body.submissionId, saves[1].body.submissionId);
  assert.deepEqual(Object.keys(saves[0].body).sort(), ["action", "attemptId", "marks", "submissionId"]);
  assert.deepEqual(saves[0].body.marks, { 1: "o", 2: "x" });

  const responseLoss = harness({ failFirstSave: true });
  await load(responseLoss);
  await rejectsCode(
    responseLoss.api.saveAttempt({ attemptId: ATTEMPT_ID, marks: { 1: "o", 2: "x" } }),
    "HF_SECURE_MOCK_EDGE_FAILED"
  );
  await responseLoss.api.saveAttempt({ attemptId: ATTEMPT_ID, marks: { 1: "o", 2: "x" } });
  const retriedSaves = responseLoss.calls.filter(call => call.body.action === "saveAttempt");
  assert.equal(retriedSaves.length, 2);
  assert.equal(retriedSaves[0].body.submissionId, retriedSaves[1].body.submissionId);
}

async function testSecurePageImageContract() {
  const h = harness({ responses: { loadExam: pageExamResponse() } });
  const document = await load(h);
  assert.equal(document.deliveryMode, "page_images");
  assert.equal(document.pages.length, 2);
  assert.equal(document.pages[0].number, 1);
  assert.match(document.pages[0].signedAssetUrl, /\/storage\/v1\/object\/sign\/hf-mock-private\//);
  assert.equal(document.questions[0].problemHtml, "");
  assert.equal(document.questions[0].sourceMode, "secure-page-image");

  const wrongOrigin = pageExamResponse({ pages: [page(1, { signedAssetUrl: "https://example.test/page.webp?token=x" }), page(2)] });
  await rejectsCode(load(harness({ responses: { loadExam: wrongOrigin } })), "HF_SECURE_MOCK_SIGNED_URL_INVALID");

  const missingPages = pageExamResponse({ pages: [] });
  await rejectsCode(load(harness({ responses: { loadExam: missingPages } })), "HF_SECURE_MOCK_PAGE_CONTRACT_INVALID");
}

async function testClientCannotSubmitDerivedOrIdentityFields() {
  const h = harness();
  await load(h);
  const forbidden = {
    attemptId: ATTEMPT_ID,
    marks: { 1: "o", 2: "x" },
    score: 50,
    correctCount: 1,
    questionCount: 2,
    wrongTypeIds: [2],
    studentId: "22222222-2222-4222-8222-222222222222",
    approvalCode: "GF-NOT-ALLOWED"
  };
  await rejectsCode(h.api.saveAttempt(forbidden), "HF_SECURE_MOCK_CLIENT_FIELD_FORBIDDEN");
  await rejectsCode(
    h.api.saveAttempt({ attemptId: ATTEMPT_ID, marks: { 1: "o" } }),
    "HF_SECURE_MOCK_ATTEMPT_INCOMPLETE"
  );
  await rejectsCode(h.api.loadExam("premier-utilization-01", 1234), "HF_SECURE_MOCK_CLIENT_FIELD_FORBIDDEN");
  await rejectsCode(h.api.listExams({ studentId: ATTEMPT_ID }), "HF_SECURE_MOCK_CLIENT_FIELD_FORBIDDEN");
  assert.equal(h.calls.filter(call => call.body.action === "saveAttempt").length, 0);
}

async function testProblemResponseSecurityGates() {
  for (const releaseStatus of ["locked", "review_pending"]) {
    const response = loadExamResponse({ questions: [question(1, { releaseStatus, scoringEligible: false, lockReasons: ["source_review_excluded"] }), question(2)] });
    await rejectsCode(
      load(harness({ responses: { loadExam: response } })),
      "HF_SECURE_MOCK_QUESTION_LOCKED"
    );
  }

  const excluded = pageExamResponse({
    questions: [
      pageQuestion(1, { releaseStatus: "excluded", scoringEligible: false, lockReasons: ["source_review_excluded"] }),
      pageQuestion(2)
    ],
    questionCount: 1,
    sourceQuestionCount: 2
  });
  const excludedDocument = await load(harness({ responses: { loadExam: excluded } }));
  assert.equal(excludedDocument.questions[0].scoringEligible, false);
  assert.equal(excludedDocument.questionCount, 1);

  const secretCases = [
    { metadata: { answerCandidates: [4] } },
    { sourcePath: "C:\\private-test\\sample.pdf" },
    { problemHtml: "<script>alert(1)</script>" },
    { nested: { privateUrl: "relative/private.png" } }
  ];
  for (const leaked of secretCases) {
    const response = loadExamResponse({ questions: [question(1, leaked), question(2)] });
    await rejectsCode(
      load(harness({ responses: { loadExam: response } })),
      "HF_SECURE_MOCK_RESPONSE_SECRET_FIELD"
    );
  }

  const wrongRevision = loadExamResponse({ questions: [question(1, { revision: 8 }), question(2)] });
  await rejectsCode(
    load(harness({ responses: { loadExam: wrongRevision } })),
    "HF_SECURE_MOCK_QUESTION_ID_INVALID"
  );

  const unknownSummary = loadExamResponse({ exam: examSummary({ internalNote: "hidden" }) });
  await rejectsCode(
    load(harness({ responses: { loadExam: unknownSummary } })),
    "HF_SECURE_MOCK_EXAM_CONTRACT_INVALID"
  );

  const unknownTop = loadExamResponse({ internalNote: "hidden" });
  await rejectsCode(
    load(harness({ responses: { loadExam: unknownTop } })),
    "HF_SECURE_MOCK_EDGE_RESPONSE_INVALID"
  );

  const unknownQuestion = loadExamResponse({ questions: [question(1, { internalNote: "hidden" }), question(2)] });
  await rejectsCode(
    load(harness({ responses: { loadExam: unknownQuestion } })),
    "HF_SECURE_MOCK_QUESTION_CONTRACT_INVALID"
  );

  const draft = loadExamResponse({ exam: examSummary({ status: "draft" }) });
  await rejectsCode(
    load(harness({ responses: { loadExam: draft } })),
    "HF_SECURE_MOCK_EXAM_CONTRACT_INVALID"
  );

  const wrongArea = loadExamResponse({ questions: [question(1, { areaKey: "unknown" }), question(2)] });
  await rejectsCode(
    load(harness({ responses: { loadExam: wrongArea } })),
    "HF_SECURE_MOCK_QUESTION_CONTRACT_INVALID"
  );

  for (const signedAssetUrl of [
    "https://example.test/storage/v1/object/sign/hf-mock-private/q1.png?token=x",
    `${PROJECT_URL}/storage/v1/object/public/hf-mock-private/q1.png?token=x`,
    `${PROJECT_URL}/storage/v1/object/sign/hf-mock-private/q1.png`,
    `${PROJECT_URL}/storage/v1/object/sign/hf-mock-private/q1.png?token=x&download=1`,
    `${PROJECT_URL}/storage/v1/object/sign/hf-mock-private/%2e%2e/q1.png?token=x`,
    `${PROJECT_URL}/storage/v1/object/sign/hf-mock-private/q1.png?token=x#private`
  ]) {
    const response = loadExamResponse({ questions: [question(1, { signedAssetUrl }), question(2)] });
    await rejectsCode(
      load(harness({ responses: { loadExam: response } })),
      "HF_SECURE_MOCK_SIGNED_URL_INVALID"
    );
  }
}

async function testAnswersMustMatchExactQuestionRevisionAndUniqueCandidate() {
  const h = harness();
  await load(h);
  const answers = await h.api.loadAnswers(ATTEMPT_ID);
  assert.equal(answers.answers.length, 2);
  assert.equal(answers.answers[0].answer, 4);
  const call = h.calls.find(entry => entry.body.action === "loadAnswers");
  assert.deepEqual(call, { name: "secure-mock", body: { action: "loadAnswers", attemptId: ATTEMPT_ID } });

  const mismatch = answerResponse();
  mismatch.answers[1].revision = 8;
  const bad = harness({ responses: { loadAnswers: mismatch } });
  await load(bad);
  await rejectsCode(bad.api.loadAnswers(ATTEMPT_ID), "HF_SECURE_MOCK_ANSWER_MISMATCH");

  const multiple = answerResponse();
  multiple.answers[0].answerCandidates = [4, 5];
  const ambiguous = harness({ responses: { loadAnswers: multiple } });
  await load(ambiguous);
  await rejectsCode(ambiguous.api.loadAnswers(ATTEMPT_ID), "HF_SECURE_MOCK_ANSWER_NOT_UNIQUE");

  const unknown = answerResponse();
  unknown.answers[0].internalNote = "hidden";
  const unknownField = harness({ responses: { loadAnswers: unknown } });
  await load(unknownField);
  await rejectsCode(unknownField.api.loadAnswers(ATTEMPT_ID), "HF_SECURE_MOCK_ANSWER_MANIFEST_INVALID");

  const inequality = answerResponse();
  inequality.answers[0].answer = "3 < 5";
  inequality.answers[0].answerCandidates = ["3 < 5"];
  inequality.answers[0].answerText = "3 < 5";
  const mathematical = harness({ responses: { loadAnswers: inequality } });
  await load(mathematical);
  const mathematicalAnswers = await mathematical.api.loadAnswers(ATTEMPT_ID);
  assert.equal(mathematicalAnswers.answers[0].answerText, "3 < 5");

  const markup = answerResponse();
  markup.answers[0].answer = "<img src=x onerror=alert(1)>";
  markup.answers[0].answerCandidates = ["<img src=x onerror=alert(1)>"];
  markup.answers[0].answerText = "<img src=x onerror=alert(1)>";
  const markupAnswer = harness({ responses: { loadAnswers: markup } });
  await load(markupAnswer);
  await rejectsCode(markupAnswer.api.loadAnswers(ATTEMPT_ID), "HF_SECURE_MOCK_ANSWER_MANIFEST_INVALID");

  const prototypePayload = answerResponse();
  const poisoned = JSON.parse('{"__proto__":{"polluted":true}}');
  prototypePayload.answers[0].answer = poisoned;
  prototypePayload.answers[0].answerCandidates = [poisoned];
  prototypePayload.answers[0].answerText = "보호 정답";
  const prototypeAnswer = harness({ responses: { loadAnswers: prototypePayload } });
  await load(prototypeAnswer);
  await rejectsCode(prototypeAnswer.api.loadAnswers(ATTEMPT_ID), "HF_SECURE_MOCK_RESPONSE_SECRET_FIELD");
  assert.equal({}.polluted, undefined);
}

async function testSaveResponseIsServerDerivedAndCrossChecked() {
  const h = harness();
  await load(h);
  const receipt = await h.api.saveAttempt({ attemptId: ATTEMPT_ID, marks: { 1: "o", 2: "x" } });
  assert.equal(receipt.status, "submitted");
  assert.equal(receipt.correctCount, 1);
  assert.equal(receipt.questionCount, 2);
  assert.equal(receipt.score, 50);
  assert.deepEqual(Array.from(receipt.wrongQuestionKeys), ["premier:utilization-01:q02"]);
  assert.deepEqual(Array.from(receipt.wrongTypeKeys), ["order-reasoning"]);

  const forgedServer = harness({ saveResponse: (value) => ({ ...value, score: 100 }) });
  await load(forgedServer);
  await rejectsCode(
    forgedServer.api.saveAttempt({ attemptId: ATTEMPT_ID, marks: { 1: "o", 2: "x" } }),
    "HF_SECURE_MOCK_SAVE_RESPONSE_INVALID"
  );
}

async function testBackendErrorsNeverEchoPrivateMessages() {
  const secretMessage = "C:\\private-test\\answer.pdf service_role test-credential";
  const h = harness({ edgeError: { data: { error: "entitlement_required", detail: secretMessage } } });
  await assert.rejects(h.api.listExams(), error => {
    assert.equal(error.code, "HF_SECURE_MOCK_ENTITLEMENT_REQUIRED");
    assert(!error.message.includes("private"));
    assert(!error.message.includes("service_role"));
    return true;
  });
}

function extractFunctionBody(name) {
  const start = edgeSource.indexOf(`async function ${name}(`);
  assert.notEqual(start, -1, `Edge function ${name}가 없습니다.`);
  const next = edgeSource.indexOf("\nasync function ", start + 1);
  return edgeSource.slice(start, next === -1 ? edgeSource.length : next);
}

function testCheckedInEdgeContractMatchesClient() {
  const listBody = extractFunctionBody("listExams");
  const loadBody = extractFunctionBody("loadExam");
  const answerBody = extractFunctionBody("loadAnswers");
  const retakeBody = extractFunctionBody("startNewAttempt");
  const saveBody = extractFunctionBody("saveAttempt");

  const normalizeExamStart = edgeSource.indexOf("function normalizeExam(");
  const normalizeExamEnd = edgeSource.indexOf("\nasync function resolveExam", normalizeExamStart);
  assert.notEqual(normalizeExamStart, -1, "Edge exam normalizer가 없습니다.");
  const normalizeExamBody = edgeSource.slice(normalizeExamStart, normalizeExamEnd);
  ["publishedAt", "answersReleasedAt", "revision"]
    .forEach(field => assert.match(normalizeExamBody, new RegExp(`\\b${field}\\b`)));
  assert.match(listBody, /data\.map\(row => normalizeExam\(row as JsonObject\)\)/);
  [
    "exam", "attemptId", "attemptNo", "attemptStatus", "serverSeed", "manifestRevision", "title",
    "subtitle", "description", "durationMinutes", "questionCount", "signedUrlExpiresIn", "deliveryMode", "pages", "questions"
  ].forEach(field => assert.match(loadBody, new RegExp(`\\b${field}\\b`)));
  ["attemptId", "attemptStatus", "manifestRevision", "answersViewedAt", "answers"]
    .forEach(field => assert.match(answerBody, new RegExp(`\\b${field}\\b`)));
  ["exam", "attemptId", "attemptNo", "attemptStatus", "manifestRevision"]
    .forEach(field => assert.match(retakeBody, new RegExp(`\\b${field}\\b`)));
  [
    "attemptId", "submissionId", "attemptNo", "status", "manifestRevision", "correctCount",
    "questionCount", "score", "wrongQuestionKeys", "wrongTypeKeys", "submittedAt"
  ].forEach(field => assert.match(saveBody, new RegExp(`\\b${field}\\b`)));
  assert.match(
    saveBody,
    /return\s*\{[\s\S]*?attemptId:[\s\S]*?submissionId,[\s\S]*?manifestRevision:[\s\S]*?submittedAt:/,
    "saveAttempt 영수증은 요청 submissionId와 manifestRevision을 되돌려줘야 합니다."
  );

  assert.match(loadBody, /requireExactKeys\(payload, \["action", "examId", "loadEventId"\]\)/);
  assert.match(answerBody, /requireExactKeys\(payload, \["action", "attemptId"\]\)/);
  assert.match(retakeBody, /requireExactKeys\(payload, \["action", "examId", "retakeEventId"\]\)/);
  assert.match(saveBody, /requireExactKeys\(payload, \["action", "attemptId", "submissionId", "marks"\]\)/);
}

async function main() {
  await testFeatureGateHasNoSideEffects();
  await testRetakeRequiresExplicitDedicatedAction();
  await testEdgeOnlyPayloadContractsAndLocalImageMarkup();
  await testRetryIdentifiersAreStable();
  await testSecurePageImageContract();
  await testClientCannotSubmitDerivedOrIdentityFields();
  await testProblemResponseSecurityGates();
  await testAnswersMustMatchExactQuestionRevisionAndUniqueCandidate();
  await testSaveResponseIsServerDerivedAndCrossChecked();
  await testBackendErrorsNeverEchoPrivateMessages();
  testCheckedInEdgeContractMatchesClient();
  console.log("Hyper Focus secure mock Edge contract QA: PASS");
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
