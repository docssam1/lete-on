(function (root) {
  "use strict";

  const EDGE_FUNCTION = "secure-mock";
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const EXAM_ID_RE = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|premier-(?:utilization|final|last)-\d{2})$/i;
  const EXAM_SLUG_RE = /^premier-(utilization|final|last)-(\d{2})$/;
  const QUESTION_KEY_RE = /^premier:(utilization|final|last)-(\d{2}):q(\d{2})$/;
  const TYPE_KEY_RE = /^[a-z][a-z0-9-]{1,79}$/;
  const AREA_KEYS = new Set([
    "arithmetic", "spatial", "pattern", "logic", "combinatorics", "measurement"
  ]);
  const LOAD_ID_PREFIX = "hf-secure-mock:load:v1:";
  const SUBMISSION_ID_PREFIX = "hf-secure-mock:submission:v1:";
  const RETAKE_ID_PREFIX = "hf-secure-mock:retake:v1:";
  const examContexts = new Map();
  const attemptContexts = new Map();

  const CLIENT_FORBIDDEN_KEYS = new Set([
    "approvalcode", "name", "student", "studentid", "userid", "score", "correctcount",
    "questioncount", "wrongtypeids", "wrongtypekeys", "wrongquestionkeys", "answer", "answers"
  ]);
  const PROBLEM_FORBIDDEN_KEYS = new Set([
    "answer", "answers", "answertext", "answertype", "answercandidate", "answercandidates",
    "correct", "correctanswer", "correctanswers", "gradingkey", "scoringkey", "score",
    "solution", "solutions", "explanation", "explanations",
    "source", "sourcepath", "sourceurl", "sourceuri", "sourcefile", "sourcefilename",
    "sourcememoryrecordid", "sourcepointer", "originalpath", "originalurl",
    "privateurl", "assetid", "asseturl", "questionasseturl", "objectpath", "bucketid",
    "path", "filepath", "fileurl", "fileuri", "localpath", "pdf", "pdfpath",
    "href", "src", "url", "uri", "html", "problemhtml", "bodyhtml", "content",
    "proto", "prototype", "constructor"
  ]);
  const TRANSPORT_FORBIDDEN_KEYS = new Set([
    "source", "sourcepath", "sourceurl", "sourceuri", "sourcefile", "sourcefilename",
    "sourcememoryrecordid", "sourcepointer", "originalpath", "originalurl", "privateurl", "asseturl",
    "questionasseturl", "objectpath", "bucketid", "path", "filepath", "fileurl",
    "fileuri", "localpath", "pdf", "pdfpath", "href", "src", "url", "uri",
    "proto", "prototype", "constructor"
  ]);
  const SERVER_ERROR_CODES = new Map([
    ["authentication_required", "HF_SECURE_MOCK_AUTH_REQUIRED"],
    ["request_not_allowed", "HF_SECURE_MOCK_REQUEST_NOT_ALLOWED"],
    ["invalid_request", "HF_SECURE_MOCK_INVALID_REQUEST"],
    ["exam_not_available", "HF_SECURE_MOCK_EXAM_NOT_AVAILABLE"],
    ["entitlement_required", "HF_SECURE_MOCK_ENTITLEMENT_REQUIRED"],
    ["attempt_not_available", "HF_SECURE_MOCK_ATTEMPT_NOT_AVAILABLE"],
    ["attempt_conflict", "HF_SECURE_MOCK_ATTEMPT_CONFLICT"],
    ["attempt_limit_reached", "HF_SECURE_MOCK_ATTEMPT_LIMIT"],
    ["submission_conflict", "HF_SECURE_MOCK_SUBMISSION_CONFLICT"],
    ["revision_conflict", "HF_SECURE_MOCK_REVISION_CONFLICT"],
    ["answers_not_available", "HF_SECURE_MOCK_ANSWERS_NOT_AVAILABLE"],
    ["asset_not_available", "HF_SECURE_MOCK_ASSET_NOT_AVAILABLE"],
    ["asset_unavailable", "HF_SECURE_MOCK_ASSET_UNAVAILABLE"],
    ["too_many_requests", "HF_SECURE_MOCK_RATE_LIMITED"],
    ["server_not_ready", "HF_SECURE_MOCK_SERVER_NOT_READY"]
  ]);

  function failure(code, message, details) {
    const error = new Error(message);
    Object.defineProperty(error, "code", { value: code, enumerable: true });
    if (details && typeof details === "object") {
      Object.entries(details).forEach(([key, value]) => {
        Object.defineProperty(error, key, { value, enumerable: true });
      });
    }
    return error;
  }

  function normalizedKey(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  function assertPlainObject(value, code, message) {
    if (!value || typeof value !== "object" || Array.isArray(value)
      || Object.prototype.toString.call(value) !== "[object Object]") throw failure(code, message);
    return value;
  }

  function assertNoLeakingString(value, trail) {
    const text = String(value || "");
    const lower = text.toLowerCase();
    if (
      /(?:https?:)?\/\//i.test(text)
      || /\b(?:file|blob|data):/i.test(text)
      || /(?:^|[\s"'(])(?:[a-z]:[\\/]|\\\\)/i.test(text)
      || /(?:^|[\s"'(])\/(?:users|home|var|private|tmp)\//i.test(text)
      || lower.includes("/storage/v1/object")
      || lower.includes(".source-memory")
      || lower.includes("tmp/pdfs")
      || /(?:^|[\\/])[^\\/\s]+\.pdf(?:$|[?#\s])/i.test(text)
      || /(?:sb_secret_|service[_-]?role)/i.test(text)
    ) {
      throw failure("HF_SECURE_MOCK_RESPONSE_LEAK", `보호 응답에 비공개 경로 또는 주소가 포함되어 있습니다: ${trail}`);
    }
  }

  function inspectObject(value, trail, forbiddenKeys, options) {
    if (typeof value === "string") {
      assertNoLeakingString(value, trail);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((entry, index) => inspectObject(entry, `${trail}[${index}]`, forbiddenKeys, options));
      return;
    }
    if (!value || typeof value !== "object") return;
    Object.entries(value).forEach(([key, entry]) => {
      const normalized = normalizedKey(key);
      const koreanSecret = /정답|해설|원본.?경로|파일.?경로|비공개.?주소/.test(key);
      if (
        forbiddenKeys.has(normalized) || koreanSecret
        || normalized.endsWith("path") || normalized.endsWith("url") || normalized.endsWith("uri")
        || (options?.rejectAnswerPrefixes && (normalized.startsWith("answer") || normalized.startsWith("solution")))
      ) {
        throw failure(
          options?.code || "HF_SECURE_MOCK_RESPONSE_SECRET_FIELD",
          `보호 응답에 허용되지 않는 필드가 있습니다: ${trail}.${key}`,
          { field: key }
        );
      }
      inspectObject(entry, `${trail}.${key}`, forbiddenKeys, options);
    });
  }

  function assertAllowedKeys(value, allowedKeys, trail, code, forbidClientSensitive) {
    assertPlainObject(value, code || "HF_SECURE_MOCK_INVALID_REQUEST", "보안형 모의고사 요청 형식이 올바르지 않습니다.");
    Object.keys(value).forEach(key => {
      const normalized = normalizedKey(key);
      if (!allowedKeys.has(key) || (forbidClientSensitive !== false && CLIENT_FORBIDDEN_KEYS.has(normalized))) {
        throw failure(
          code || "HF_SECURE_MOCK_CLIENT_FIELD_FORBIDDEN",
          `허용되지 않는 필드가 있습니다: ${trail}.${key}`,
          { field: key }
        );
      }
    });
  }

  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.freeze(value);
    Object.values(value).forEach(deepFreeze);
    return value;
  }

  function assertFeatureEnabled() {
    const config = root.GFIELD_HF_SUPABASE_CONFIG;
    if (config?.enabled !== true) {
      throw failure("HF_SECURE_MOCK_SUPABASE_DISABLED", "Hyper Focus 원격 학습이 아직 활성화되지 않았습니다.");
    }
    if (config?.features?.secureMockDelivery !== true) {
      throw failure("HF_SECURE_MOCK_FEATURE_DISABLED", "보안형 온라인 모의고사는 검수 대기 상태입니다.");
    }
    const bridge = root.GFieldHFSupabase;
    if (!bridge || typeof bridge.enabled !== "function" || bridge.enabled() !== true || typeof bridge.ready !== "function") {
      throw failure("HF_SECURE_MOCK_CLIENT_UNAVAILABLE", "보안형 모의고사 연결을 확인하지 못했습니다.");
    }
    return bridge;
  }

  async function requireClient() {
    const bridge = assertFeatureEnabled();
    let client;
    try {
      client = await bridge.ready();
    } catch (_) {
      throw failure("HF_SECURE_MOCK_CLIENT_UNAVAILABLE", "Supabase 클라이언트 연결을 준비하지 못했습니다.");
    }
    if (!client?.functions || typeof client.functions.invoke !== "function") {
      throw failure("HF_SECURE_MOCK_CLIENT_UNAVAILABLE", "Supabase Edge Function 연결이 준비되지 않았습니다.");
    }
    return client;
  }

  function publicServerError(value) {
    const candidate = typeof value === "string" ? value : value?.code;
    const normalized = String(candidate || "").trim().toLowerCase();
    return SERVER_ERROR_CODES.get(normalized) || "HF_SECURE_MOCK_EDGE_FAILED";
  }

  function publicServerMessage(code) {
    const messages = {
      HF_SECURE_MOCK_AUTH_REQUIRED: "승인번호 로그인이 필요합니다.",
      HF_SECURE_MOCK_REQUEST_NOT_ALLOWED: "허용되지 않은 모의고사 요청입니다.",
      HF_SECURE_MOCK_INVALID_REQUEST: "모의고사 요청 형식이 올바르지 않습니다.",
      HF_SECURE_MOCK_EXAM_NOT_AVAILABLE: "이용할 수 있는 모의고사가 아닙니다.",
      HF_SECURE_MOCK_ENTITLEMENT_REQUIRED: "이 모의고사의 학습 권한이 없습니다.",
      HF_SECURE_MOCK_ATTEMPT_NOT_AVAILABLE: "이용할 수 있는 응시 기록이 아닙니다.",
      HF_SECURE_MOCK_ATTEMPT_CONFLICT: "기존 응시 기록과 요청이 일치하지 않습니다.",
      HF_SECURE_MOCK_ATTEMPT_LIMIT: "이 모의고사는 최대 3회까지 응시할 수 있습니다.",
      HF_SECURE_MOCK_SUBMISSION_CONFLICT: "이미 저장된 제출 내용과 현재 표시가 다릅니다.",
      HF_SECURE_MOCK_REVISION_CONFLICT: "문제와 답안의 판본이 일치하지 않습니다.",
      HF_SECURE_MOCK_ANSWERS_NOT_AVAILABLE: "정답은 아직 확인할 수 없습니다.",
      HF_SECURE_MOCK_ASSET_NOT_AVAILABLE: "문제 그림이 준비되지 않았습니다.",
      HF_SECURE_MOCK_ASSET_UNAVAILABLE: "문제 그림을 안전하게 전송하지 못했습니다.",
      HF_SECURE_MOCK_RATE_LIMITED: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
      HF_SECURE_MOCK_SERVER_NOT_READY: "보안형 모의고사 서버가 아직 준비되지 않았습니다.",
      HF_SECURE_MOCK_EDGE_FAILED: "보안형 모의고사 서버 요청을 완료하지 못했습니다."
    };
    return messages[code] || messages.HF_SECURE_MOCK_EDGE_FAILED;
  }

  async function invoke(action, fields) {
    const client = await requireClient();
    const body = { action, ...(fields || {}) };
    let result;
    try {
      result = await client.functions.invoke(EDGE_FUNCTION, { body });
    } catch (_) {
      throw failure("HF_SECURE_MOCK_EDGE_FAILED", publicServerMessage("HF_SECURE_MOCK_EDGE_FAILED"));
    }
    const data = result?.data;
    const error = result?.error;
    let serverError = data?.error;
    if (!serverError && error?.context) {
      try {
        const contextResponse = typeof error.context.clone === "function" ? error.context.clone() : error.context;
        if (typeof contextResponse?.json === "function") serverError = (await contextResponse.json())?.error;
      } catch (_) {}
    }
    if (error || serverError) {
      const code = publicServerError(serverError || error);
      throw failure(code, publicServerMessage(code));
    }
    return assertPlainObject(data, "HF_SECURE_MOCK_EDGE_RESPONSE_INVALID", "보안형 모의고사 서버 응답 형식이 올바르지 않습니다.");
  }

  function requireSessionStorage() {
    const storage = root.sessionStorage;
    if (!storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function") {
      throw failure("HF_SECURE_MOCK_SESSION_STORAGE_UNAVAILABLE", "중복 제출을 막는 브라우저 저장소를 사용할 수 없습니다.");
    }
    return storage;
  }

  function randomUuid() {
    if (typeof root.crypto?.randomUUID !== "function") {
      throw failure("HF_SECURE_MOCK_RANDOM_UNAVAILABLE", "안전한 요청 식별자를 만들 수 없습니다.");
    }
    return root.crypto.randomUUID();
  }

  function stableSessionUuid(key, requestedValue) {
    const storage = requireSessionStorage();
    let stored;
    try {
      stored = storage.getItem(key);
    } catch (_) {
      throw failure("HF_SECURE_MOCK_SESSION_STORAGE_UNAVAILABLE", "중복 제출을 막는 브라우저 저장소를 읽을 수 없습니다.");
    }
    if (stored && !UUID_RE.test(stored)) {
      throw failure("HF_SECURE_MOCK_SESSION_ID_INVALID", "브라우저의 응시 식별자가 손상되었습니다.");
    }
    if (requestedValue != null && !UUID_RE.test(String(requestedValue))) {
      throw failure("HF_SECURE_MOCK_SESSION_ID_INVALID", "요청한 응시 식별자가 올바르지 않습니다.");
    }
    if (stored && requestedValue != null && stored !== String(requestedValue)) {
      throw failure("HF_SECURE_MOCK_SESSION_ID_CONFLICT", "기존 응시 식별자와 요청이 일치하지 않습니다.");
    }
    const value = stored || String(requestedValue || randomUuid());
    if (!stored) {
      try {
        storage.setItem(key, value);
      } catch (_) {
        throw failure("HF_SECURE_MOCK_SESSION_STORAGE_UNAVAILABLE", "중복 제출을 막는 응시 식별자를 저장할 수 없습니다.");
      }
    }
    return value;
  }

  function validateExamId(value) {
    const examId = String(value || "").trim().toLowerCase();
    if (!EXAM_ID_RE.test(examId)) throw failure("HF_SECURE_MOCK_INVALID_EXAM", "모의고사 식별자가 올바르지 않습니다.");
    return examId;
  }

  function validateUuid(value, code, message) {
    const id = String(value || "");
    if (!UUID_RE.test(id)) throw failure(code, message);
    return id;
  }

  function validatePositiveInteger(value, code, message, maximum) {
    const number = Number(value);
    if (!Number.isSafeInteger(number) || number < 1 || (maximum && number > maximum)) throw failure(code, message);
    return number;
  }

  function validateServerSeed(value) {
    const seed = Number(value);
    if (!Number.isSafeInteger(seed) || seed < 0) {
      throw failure("HF_SECURE_MOCK_SERVER_SEED_INVALID", "서버 문제지 번호가 올바르지 않습니다.");
    }
    return seed;
  }

  function safePlainText(value, maximumLength, code, label, allowEmpty) {
    if (typeof value !== "string") throw failure(code, `${label} 형식이 올바르지 않습니다.`);
    const text = value.trim();
    if (
      (!allowEmpty && !text) || text.length > maximumLength
      || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text)
      || /<\/?[a-z][a-z0-9:-]*[\s/>]|<!--|<!doctype|<\?/i.test(text)
    ) {
      throw failure(code, `${label}에 허용되지 않는 문자가 있거나 길이가 올바르지 않습니다.`);
    }
    return text;
  }

  function safeTimestamp(value, code, label, allowNull) {
    if (allowNull && value == null) return null;
    const timestamp = safePlainText(value, 64, code, label, false);
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/.test(timestamp)
      || !Number.isFinite(Date.parse(timestamp))) {
      throw failure(code, `${label} 형식이 올바르지 않습니다.`);
    }
    return timestamp;
  }

  function normalizeAnswerValue(value, trail, state, depth) {
    const currentState = state || { nodes: 0 };
    const currentDepth = depth || 0;
    currentState.nodes += 1;
    if (currentState.nodes > 500 || currentDepth > 10) {
      throw failure("HF_SECURE_MOCK_ANSWER_MANIFEST_INVALID", `${trail}: 정답 데이터가 너무 복잡합니다.`);
    }
    if (typeof value === "string") {
      const text = safePlainText(
        value,
        2000,
        "HF_SECURE_MOCK_ANSWER_MANIFEST_INVALID",
        `${trail} 정답 값`,
        false
      );
      assertNoLeakingString(text, trail);
      return text;
    }
    if (typeof value === "number") {
      if (!Number.isFinite(value) || Math.abs(value) > Number.MAX_SAFE_INTEGER) {
        throw failure("HF_SECURE_MOCK_ANSWER_MANIFEST_INVALID", `${trail}: 정답 숫자가 올바르지 않습니다.`);
      }
      return value;
    }
    if (typeof value === "boolean") return value;
    if (Array.isArray(value)) {
      if (!value.length || value.length > 100) {
        throw failure("HF_SECURE_MOCK_ANSWER_MANIFEST_INVALID", `${trail}: 정답 배열의 길이가 올바르지 않습니다.`);
      }
      return value.map((entry, index) => normalizeAnswerValue(entry, `${trail}[${index}]`, currentState, currentDepth + 1));
    }
    if (value && typeof value === "object" && Object.prototype.toString.call(value) === "[object Object]") {
      const keys = Object.keys(value);
      if (!keys.length || keys.length > 50) {
        throw failure("HF_SECURE_MOCK_ANSWER_MANIFEST_INVALID", `${trail}: 정답 객체의 크기가 올바르지 않습니다.`);
      }
      const normalized = {};
      keys.forEach(key => {
        const compact = normalizedKey(key);
        if (!key || key.length > 80 || /[<>\u0000-\u001f]/.test(key)
          || TRANSPORT_FORBIDDEN_KEYS.has(compact)) {
          throw failure("HF_SECURE_MOCK_ANSWER_MANIFEST_INVALID", `${trail}: 정답 객체에 허용되지 않는 항목이 있습니다.`);
        }
        normalized[key] = normalizeAnswerValue(value[key], `${trail}.${key}`, currentState, currentDepth + 1);
      });
      return normalized;
    }
    throw failure("HF_SECURE_MOCK_ANSWER_MANIFEST_INVALID", `${trail}: 정답 값 형식이 올바르지 않습니다.`);
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  function validateSignedQuestionUrl(value) {
    let signed;
    let project;
    try {
      signed = new URL(String(value || ""));
      project = new URL(String(root.GFIELD_HF_SUPABASE_CONFIG?.projectUrl || ""));
    } catch (_) {
      throw failure("HF_SECURE_MOCK_SIGNED_URL_INVALID", "서명된 문제 그림 주소가 올바르지 않습니다.");
    }
    const marker = "/storage/v1/object/sign/hf-mock-private/";
    if (
      signed.protocol !== "https:" || signed.origin !== project.origin || signed.username || signed.password
      || !signed.pathname.startsWith(marker) || !signed.searchParams.get("token")
      || signed.pathname.length <= marker.length || signed.hash
      || [...signed.searchParams.keys()].some(key => key !== "token")
      || /%(?:2e|2f|5c)/i.test(signed.pathname) || signed.pathname.includes("\\")
    ) {
      throw failure("HF_SECURE_MOCK_SIGNED_URL_INVALID", "서명된 문제 그림 주소가 안전 계약과 다릅니다.");
    }
    return signed.href;
  }

  function normalizeExamSummary(value, expectedRevision) {
    const row = assertPlainObject(value, "HF_SECURE_MOCK_EXAM_CONTRACT_INVALID", "공개 모의고사 정보가 올바르지 않습니다.");
    const safeExamFields = { ...row };
    delete safeExamFields.answersReleasedAt;
    inspectObject(safeExamFields, "exam", PROBLEM_FORBIDDEN_KEYS, {
      rejectAnswerPrefixes: true,
      code: "HF_SECURE_MOCK_RESPONSE_SECRET_FIELD"
    });
    assertAllowedKeys(
      row,
      new Set([
        "id", "title", "series", "roundNo", "status", "revision", "publishedAt", "answersReleasedAt"
      ]),
      "exam",
      "HF_SECURE_MOCK_EXAM_CONTRACT_INVALID",
      false
    );
    const slug = String(row.id || "").toLowerCase();
    const match = EXAM_SLUG_RE.exec(slug);
    const roundNo = Number(row.roundNo);
    const revision = validatePositiveInteger(
      row.revision,
      "HF_SECURE_MOCK_REVISION_INVALID",
      "회차 revision이 올바르지 않습니다.",
      32767
    );
    if (
      !match || row.status !== "published" || row.series !== match[1]
      || !Number.isInteger(roundNo) || roundNo !== Number(match[2])
      || (expectedRevision != null && revision !== expectedRevision)
    ) {
      throw failure("HF_SECURE_MOCK_EXAM_CONTRACT_INVALID", "공개 모의고사 정보가 안전 계약과 다릅니다.");
    }
    const title = safePlainText(row.title, 200, "HF_SECURE_MOCK_EXAM_CONTRACT_INVALID", "모의고사 제목", false);
    const publishedAt = safeTimestamp(
      row.publishedAt,
      "HF_SECURE_MOCK_EXAM_CONTRACT_INVALID",
      "공개 시각",
      false
    );
    if (Date.parse(publishedAt) > Date.now()) {
      throw failure("HF_SECURE_MOCK_EXAM_CONTRACT_INVALID", "아직 공개되지 않은 모의고사는 불러올 수 없습니다.");
    }
    const answersReleasedAt = safeTimestamp(
      row.answersReleasedAt,
      "HF_SECURE_MOCK_EXAM_CONTRACT_INVALID",
      "정답 공개 시각",
      true
    );
    return Object.freeze({
      id: slug,
      slug,
      series: row.series,
      roundNo,
      title,
      status: "published",
      revision,
      publishedAt,
      answersReleasedAt
    });
  }

  async function listExams() {
    assertFeatureEnabled();
    if (arguments.length) {
      throw failure("HF_SECURE_MOCK_CLIENT_FIELD_FORBIDDEN", "모의고사 목록 요청에는 학생 정보를 넣을 수 없습니다.");
    }
    const data = await invoke("listExams");
    assertAllowedKeys(data, new Set(["exams"]), "response", "HF_SECURE_MOCK_EDGE_RESPONSE_INVALID", false);
    if (!Array.isArray(data.exams)) {
      throw failure("HF_SECURE_MOCK_EXAM_CONTRACT_INVALID", "모의고사 목록 응답 형식이 올바르지 않습니다.");
    }
    return Object.freeze(data.exams.map(row => normalizeExamSummary(row)));
  }

  function normalizeQuestion(rawQuestion, index, exam, manifestRevision) {
    const trail = `response.questions[${index}]`;
    const question = assertPlainObject(rawQuestion, "HF_SECURE_MOCK_QUESTION_CONTRACT_INVALID", `${trail}: 문항 형식이 올바르지 않습니다.`);
    const signedAssetUrl = question.signedAssetUrl;
    const safeFields = { ...question };
    delete safeFields.signedAssetUrl;
    inspectObject(safeFields, trail, PROBLEM_FORBIDDEN_KEYS, {
      rejectAnswerPrefixes: true,
      code: "HF_SECURE_MOCK_RESPONSE_SECRET_FIELD"
    });
    assertAllowedKeys(
      question,
      new Set([
        "number", "questionKey", "revision", "areaKey", "areaLabel", "typeKey", "typeTitle",
        "typeId", "typeCode", "difficultyLabel", "prompt", "releaseStatus", "scoringEligible", "lockReasons",
        "signedAssetUrl", "assetAlt", "mimeType"
      ]),
      trail,
      "HF_SECURE_MOCK_QUESTION_CONTRACT_INVALID",
      false
    );
    const verified = question.releaseStatus === "verified" && question.scoringEligible === true
      && Array.isArray(question.lockReasons) && question.lockReasons.length === 0;
    const excluded = question.releaseStatus === "excluded" && question.scoringEligible === false
      && Array.isArray(question.lockReasons) && question.lockReasons.length > 0
      && question.lockReasons.every(reason => /^[a-z][a-z0-9_-]{1,79}$/.test(String(reason)));
    if (!verified && !excluded) {
      throw failure("HF_SECURE_MOCK_QUESTION_LOCKED", `${trail}: 공개 가능한 검증 상태가 아닙니다.`);
    }
    const questionKey = String(question.questionKey || "");
    const match = QUESTION_KEY_RE.exec(questionKey);
    const expectedNumber = String(index + 1).padStart(2, "0");
    const expectedRound = String(exam.roundNo).padStart(2, "0");
    if (
      question.number !== index + 1 || !match || match[1] !== exam.series
      || match[2] !== expectedRound || match[3] !== expectedNumber
      || question.revision !== manifestRevision
    ) {
      throw failure("HF_SECURE_MOCK_QUESTION_ID_INVALID", `${trail}: questionKey와 revision이 회차·순서와 맞지 않습니다.`);
    }
    const typeId = question.typeId == null ? null : Number(question.typeId);
    if (
      !AREA_KEYS.has(question.areaKey) || !TYPE_KEY_RE.test(String(question.typeKey || ""))
      || (typeId != null && (!Number.isInteger(typeId) || typeId < 1 || typeId > 54))
      || !["image/jpeg", "image/png", "image/webp"].includes(question.mimeType)
    ) {
      throw failure("HF_SECURE_MOCK_QUESTION_CONTRACT_INVALID", `${trail}: 문항 분류·문장·대체 설명이 올바르지 않습니다.`);
    }
    const areaLabel = safePlainText(question.areaLabel, 100, "HF_SECURE_MOCK_QUESTION_CONTRACT_INVALID", `${trail} 영역명`, false);
    const typeTitle = safePlainText(question.typeTitle, 200, "HF_SECURE_MOCK_QUESTION_CONTRACT_INVALID", `${trail} 유형명`, false);
    const prompt = safePlainText(question.prompt, 10000, "HF_SECURE_MOCK_QUESTION_CONTRACT_INVALID", `${trail} 문제 문장`, false);
    const assetAlt = safePlainText(question.assetAlt, 500, "HF_SECURE_MOCK_QUESTION_CONTRACT_INVALID", `${trail} 그림 설명`, false);
    const typeCode = safePlainText(
      question.typeCode,
      80,
      "HF_SECURE_MOCK_QUESTION_CONTRACT_INVALID",
      `${trail} 유형 코드`,
      true
    );
    const difficultyLabel = safePlainText(
      question.difficultyLabel,
      40,
      "HF_SECURE_MOCK_QUESTION_CONTRACT_INVALID",
      `${trail} 난이도`,
      true
    );
    const imageUrl = validateSignedQuestionUrl(signedAssetUrl);
    const alt = escapeHtml(assetAlt);
    const problemHtml = `<img class="hf-secure-question-asset" src="${escapeHtml(imageUrl)}" alt="${alt}" loading="eager" decoding="async" referrerpolicy="no-referrer">`;
    return {
      number: question.number,
      questionKey,
      revision: manifestRevision,
      areaKey: question.areaKey,
      areaLabel,
      typeKey: question.typeKey,
      typeTitle,
      typeId,
      typeCode,
      difficultyLabel,
      prompt,
      releaseStatus: question.releaseStatus,
      scoringEligible: question.scoringEligible,
      lockReasons: question.lockReasons.slice(),
      problemHtml,
      sourceMode: "secure-edge-asset"
    };
  }

  function normalizePageQuestion(rawQuestion, index, exam, manifestRevision) {
    const trail = `response.questions[${index}]`;
    const question = assertPlainObject(rawQuestion, "HF_SECURE_MOCK_QUESTION_CONTRACT_INVALID", `${trail}: 문항 형식이 올바르지 않습니다.`);
    inspectObject(question, trail, PROBLEM_FORBIDDEN_KEYS, {
      rejectAnswerPrefixes: true,
      code: "HF_SECURE_MOCK_RESPONSE_SECRET_FIELD"
    });
    assertAllowedKeys(
      question,
      new Set([
        "number", "questionKey", "revision", "areaKey", "areaLabel", "typeKey", "typeTitle",
        "typeId", "typeCode", "difficultyLabel", "prompt", "releaseStatus", "scoringEligible", "lockReasons"
      ]),
      trail,
      "HF_SECURE_MOCK_QUESTION_CONTRACT_INVALID",
      false
    );
    const verified = question.releaseStatus === "verified" && question.scoringEligible === true
      && Array.isArray(question.lockReasons) && question.lockReasons.length === 0;
    const excluded = question.releaseStatus === "excluded" && question.scoringEligible === false
      && Array.isArray(question.lockReasons) && question.lockReasons.length > 0
      && question.lockReasons.every(reason => /^[a-z][a-z0-9_-]{1,79}$/.test(String(reason)));
    if (!verified && !excluded) {
      throw failure("HF_SECURE_MOCK_QUESTION_LOCKED", `${trail}: 공개 가능한 검증 상태가 아닙니다.`);
    }
    const questionKey = String(question.questionKey || "");
    const match = QUESTION_KEY_RE.exec(questionKey);
    const expectedNumber = String(index + 1).padStart(2, "0");
    const expectedRound = String(exam.roundNo).padStart(2, "0");
    const typeId = question.typeId == null ? null : Number(question.typeId);
    if (
      question.number !== index + 1 || !match || match[1] !== exam.series
      || match[2] !== expectedRound || match[3] !== expectedNumber
      || question.revision !== manifestRevision || !AREA_KEYS.has(question.areaKey)
      || !TYPE_KEY_RE.test(String(question.typeKey || ""))
      || (typeId != null && (!Number.isInteger(typeId) || typeId < 1 || typeId > 54))
    ) {
      throw failure("HF_SECURE_MOCK_QUESTION_ID_INVALID", `${trail}: 문항 식별자와 분류가 회차·순서에 맞지 않습니다.`);
    }
    return {
      number: question.number,
      questionKey,
      revision: manifestRevision,
      areaKey: question.areaKey,
      areaLabel: safePlainText(question.areaLabel, 100, "HF_SECURE_MOCK_QUESTION_CONTRACT_INVALID", `${trail} 영역명`, false),
      typeKey: question.typeKey,
      typeTitle: safePlainText(question.typeTitle, 200, "HF_SECURE_MOCK_QUESTION_CONTRACT_INVALID", `${trail} 유형명`, false),
      typeId,
      typeCode: safePlainText(question.typeCode, 80, "HF_SECURE_MOCK_QUESTION_CONTRACT_INVALID", `${trail} 유형 코드`, true),
      difficultyLabel: safePlainText(question.difficultyLabel, 40, "HF_SECURE_MOCK_QUESTION_CONTRACT_INVALID", `${trail} 난이도`, true),
      prompt: safePlainText(question.prompt, 10000, "HF_SECURE_MOCK_QUESTION_CONTRACT_INVALID", `${trail} 문제 문장`, false),
      releaseStatus: question.releaseStatus,
      scoringEligible: question.scoringEligible,
      lockReasons: question.lockReasons.slice(),
      problemHtml: "",
      sourceMode: "secure-page-image"
    };
  }

  function normalizePage(rawPage, index) {
    const trail = `response.pages[${index}]`;
    const page = assertPlainObject(rawPage, "HF_SECURE_MOCK_PAGE_CONTRACT_INVALID", `${trail}: 시험지 쪽 형식이 올바르지 않습니다.`);
    const signedAssetUrl = page.signedAssetUrl;
    const safeFields = { ...page };
    delete safeFields.signedAssetUrl;
    inspectObject(safeFields, trail, PROBLEM_FORBIDDEN_KEYS, {
      rejectAnswerPrefixes: true,
      code: "HF_SECURE_MOCK_RESPONSE_SECRET_FIELD"
    });
    assertAllowedKeys(page, new Set(["number", "assetAlt", "mimeType", "signedAssetUrl"]), trail, "HF_SECURE_MOCK_PAGE_CONTRACT_INVALID", false);
    if (page.number !== index + 1 || !["image/jpeg", "image/png", "image/webp"].includes(page.mimeType)) {
      throw failure("HF_SECURE_MOCK_PAGE_CONTRACT_INVALID", `${trail}: 시험지 쪽 순서나 형식이 올바르지 않습니다.`);
    }
    return Object.freeze({
      number: page.number,
      assetAlt: safePlainText(page.assetAlt, 500, "HF_SECURE_MOCK_PAGE_CONTRACT_INVALID", `${trail} 설명`, false),
      mimeType: page.mimeType,
      signedAssetUrl: validateSignedQuestionUrl(signedAssetUrl)
    });
  }

  function normalizeExamResponse(data, requestedExamId, loadEventId) {
    const allowedTop = new Set([
      "exam", "attemptId", "attemptNo", "serverSeed", "manifestRevision", "questions",
      "attemptStatus", "title", "durationMinutes", "subtitle", "description", "questionCount",
      "signedUrlExpiresIn", "deliveryMode", "pages", "sourceQuestionCount"
    ]);
    assertAllowedKeys(data, allowedTop, "response", "HF_SECURE_MOCK_EDGE_RESPONSE_INVALID", false);
    inspectObject({ subtitle: data.subtitle, description: data.description }, "response", PROBLEM_FORBIDDEN_KEYS, {
      rejectAnswerPrefixes: true,
      code: "HF_SECURE_MOCK_RESPONSE_SECRET_FIELD"
    });
    const attemptId = validateUuid(data.attemptId, "HF_SECURE_MOCK_ATTEMPT_INVALID", "서버 응시 식별자가 올바르지 않습니다.");
    const attemptNo = validatePositiveInteger(data.attemptNo, "HF_SECURE_MOCK_ATTEMPT_INVALID", "응시 차수가 올바르지 않습니다.", 3);
    const manifestRevision = validatePositiveInteger(
      data.manifestRevision,
      "HF_SECURE_MOCK_REVISION_INVALID",
      "문제 manifest revision이 올바르지 않습니다.",
      32767
    );
    const exam = normalizeExamSummary(data.exam, manifestRevision);
    if (!UUID_RE.test(requestedExamId) && exam.id !== requestedExamId) {
      throw failure("HF_SECURE_MOCK_EXAM_MISMATCH", "요청한 회차와 서버 문제지가 다릅니다.");
    }
    const serverSeed = validateServerSeed(data.serverSeed);
    if (!["in_progress", "grading", "submitted"].includes(data.attemptStatus)) {
      throw failure("HF_SECURE_MOCK_ATTEMPT_INVALID", "서버 응시 상태가 올바르지 않습니다.");
    }
    const deliveryMode = data.deliveryMode == null ? "question_images" : data.deliveryMode;
    if (!["question_images", "page_images"].includes(deliveryMode)) {
      throw failure("HF_SECURE_MOCK_EXAM_CONTRACT_INVALID", "시험지 전달 방식이 올바르지 않습니다.");
    }
    if (!Array.isArray(data.questions) || !data.questions.length || data.questions.length > 100) {
      throw failure("HF_SECURE_MOCK_QUESTION_CONTRACT_INVALID", "서버 문제지의 문항 수가 올바르지 않습니다.");
    }
    const questions = data.questions.map((question, index) => deliveryMode === "page_images"
      ? normalizePageQuestion(question, index, exam, manifestRevision)
      : normalizeQuestion(question, index, exam, manifestRevision));
    const pages = deliveryMode === "page_images"
      ? (Array.isArray(data.pages) ? data.pages.map(normalizePage) : [])
      : [];
    if ((deliveryMode === "page_images" && (pages.length < 1 || pages.length > 20))
      || (deliveryMode === "question_images" && data.pages != null && (!Array.isArray(data.pages) || data.pages.length))) {
      throw failure("HF_SECURE_MOCK_PAGE_CONTRACT_INVALID", "시험지 쪽 수가 올바르지 않습니다.");
    }
    const compoundKeys = questions.map(question => `${question.questionKey}@${question.revision}`);
    if (new Set(compoundKeys).size !== compoundKeys.length) {
      throw failure("HF_SECURE_MOCK_QUESTION_ID_INVALID", "서버 문제지에 중복 문항이 있습니다.");
    }
    const scoringQuestions = questions.filter(question => question.scoringEligible);
    if (!scoringQuestions.length || data.questionCount !== scoringQuestions.length
      || data.sourceQuestionCount !== questions.length) {
      throw failure("HF_SECURE_MOCK_QUESTION_CONTRACT_INVALID", "서버 문제지의 채점 문항 수 요약이 실제 문항과 다릅니다.");
    }
    const signedUrlExpiresIn = validatePositiveInteger(
      data.signedUrlExpiresIn,
      "HF_SECURE_MOCK_SIGNED_URL_INVALID",
      "서명 주소 만료 시간이 올바르지 않습니다.",
      3600
    );
    const durationMinutes = data.durationMinutes == null ? null : Number(data.durationMinutes);
    if (durationMinutes != null && (!Number.isInteger(durationMinutes) || durationMinutes < 1 || durationMinutes > 300)) {
      throw failure("HF_SECURE_MOCK_EXAM_CONTRACT_INVALID", "권장 시간이 올바르지 않습니다.");
    }
    const manifestTitle = safePlainText(
      data.title,
      200,
      "HF_SECURE_MOCK_EXAM_CONTRACT_INVALID",
      "문제지 제목",
      false
    );
    if (manifestTitle !== exam.title) {
      throw failure("HF_SECURE_MOCK_EXAM_MISMATCH", "목록과 문제지의 제목이 일치하지 않습니다.");
    }
    const subtitle = safePlainText(
      typeof data.subtitle === "string" ? data.subtitle : `${questions.length}문항`,
      300,
      "HF_SECURE_MOCK_EXAM_CONTRACT_INVALID",
      "문제지 부제",
      false
    );
    const description = safePlainText(
      typeof data.description === "string" ? data.description : "",
      1000,
      "HF_SECURE_MOCK_EXAM_CONTRACT_INVALID",
      "문제지 설명",
      true
    );
    const document = deepFreeze({
      id: exam.id,
      status: "published",
      title: exam.title,
      subtitle,
      description,
      durationMinutes,
      attemptId,
      attemptNo,
      attemptStatus: data.attemptStatus,
      manifestRevision,
      serverSeed,
      seed: serverSeed,
      questionCount: scoringQuestions.length,
      sourceQuestionCount: questions.length,
      signedUrlExpiresIn,
      deliveryMode,
      pages,
      questions
    });
    const context = Object.freeze({ exam, document, loadEventId });
    examContexts.set(exam.id, context);
    attemptContexts.set(attemptId, context);
    return document;
  }

  async function loadExam(examIdValue) {
    assertFeatureEnabled();
    if (arguments.length > 1) {
      throw failure("HF_SECURE_MOCK_CLIENT_FIELD_FORBIDDEN", "문제지 번호는 서버가 정하므로 브라우저에서 보낼 수 없습니다.");
    }
    const examId = validateExamId(examIdValue);
    const loadEventId = stableSessionUuid(`${LOAD_ID_PREFIX}${examId}`);
    const data = await invoke("loadExam", { examId, loadEventId });
    return normalizeExamResponse(data, examId, loadEventId);
  }

  function normalizeRetakeResponse(data, requestedExamId) {
    assertAllowedKeys(
      data,
      new Set(["exam", "attemptId", "attemptNo", "attemptStatus", "manifestRevision"]),
      "response",
      "HF_SECURE_MOCK_EDGE_RESPONSE_INVALID",
      false
    );
    const manifestRevision = validatePositiveInteger(
      data.manifestRevision,
      "HF_SECURE_MOCK_REVISION_INVALID",
      "새 응시의 문제 revision이 올바르지 않습니다.",
      32767
    );
    const exam = normalizeExamSummary(data.exam, manifestRevision);
    if (!UUID_RE.test(requestedExamId) && exam.id !== requestedExamId) {
      throw failure("HF_SECURE_MOCK_EXAM_MISMATCH", "요청한 회차와 새 응시 회차가 다릅니다.");
    }
    const attemptId = validateUuid(data.attemptId, "HF_SECURE_MOCK_ATTEMPT_INVALID", "새 응시 식별자가 올바르지 않습니다.");
    const attemptNo = validatePositiveInteger(data.attemptNo, "HF_SECURE_MOCK_ATTEMPT_INVALID", "새 응시 차수가 올바르지 않습니다.", 3);
    if (attemptNo < 2 || !["in_progress", "grading"].includes(data.attemptStatus)) {
      throw failure("HF_SECURE_MOCK_ATTEMPT_INVALID", "명시적으로 시작한 재응시 상태가 올바르지 않습니다.");
    }
    examContexts.delete(exam.id);
    attemptContexts.clear();
    try {
      sessionStorage.removeItem(`${LOAD_ID_PREFIX}${exam.id}`);
      sessionStorage.removeItem(`${RETAKE_ID_PREFIX}${exam.id}`);
    } catch (_) {}
    return deepFreeze({ exam, attemptId, attemptNo, attemptStatus: data.attemptStatus, manifestRevision });
  }

  async function startNewAttempt(examIdValue) {
    assertFeatureEnabled();
    if (arguments.length !== 1) {
      throw failure("HF_SECURE_MOCK_CLIENT_FIELD_FORBIDDEN", "재응시는 회차만 지정할 수 있습니다.");
    }
    const examId = validateExamId(examIdValue);
    const retakeEventId = stableSessionUuid(`${RETAKE_ID_PREFIX}${examId}`);
    const data = await invoke("startNewAttempt", { examId, retakeEventId });
    return normalizeRetakeResponse(data, examId);
  }

  function requireAttemptContext(value) {
    const attemptId = validateUuid(value, "HF_SECURE_MOCK_ATTEMPT_INVALID", "응시 식별자가 올바르지 않습니다.");
    const context = attemptContexts.get(attemptId);
    if (!context) {
      throw failure("HF_SECURE_MOCK_EXAM_NOT_LOADED", "같은 화면에서 문제지를 먼저 안전하게 불러와야 합니다.");
    }
    return { attemptId, context };
  }

  function normalizeAnswerResponse(data, attemptId, context) {
    assertAllowedKeys(
      data,
      new Set(["attemptId", "attemptStatus", "manifestRevision", "answersViewedAt", "answers"]),
      "response",
      "HF_SECURE_MOCK_EDGE_RESPONSE_INVALID",
      false
    );
    if (String(data.attemptId || "") !== attemptId || data.manifestRevision !== context.document.manifestRevision) {
      throw failure("HF_SECURE_MOCK_ANSWER_MISMATCH", "문제와 보호 답안의 응시 또는 revision이 다릅니다.");
    }
    const scoringQuestions = context.document.questions.filter(question => question.scoringEligible);
    if (!Array.isArray(data.answers) || data.answers.length !== scoringQuestions.length) {
      throw failure("HF_SECURE_MOCK_ANSWER_MISMATCH", "문제와 보호 답안의 문항 수가 다릅니다.");
    }
    if (!["grading", "submitted"].includes(data.attemptStatus)) {
      throw failure("HF_SECURE_MOCK_ANSWER_MISMATCH", "보호 답안을 볼 수 있는 응시 상태가 아닙니다.");
    }
    const answersViewedAt = safeTimestamp(
      data.answersViewedAt,
      "HF_SECURE_MOCK_ANSWER_MISMATCH",
      "정답 확인 시각",
      false
    );
    const answers = data.answers.map((entry, index) => {
      const trail = `response.answers[${index}]`;
      assertPlainObject(entry, "HF_SECURE_MOCK_ANSWER_MANIFEST_INVALID", `${trail}: 답안 형식이 올바르지 않습니다.`);
      inspectObject(entry, trail, TRANSPORT_FORBIDDEN_KEYS, {
        rejectAnswerPrefixes: false,
        code: "HF_SECURE_MOCK_RESPONSE_SECRET_FIELD"
      });
      assertAllowedKeys(
        entry,
        new Set(["questionKey", "revision", "answerType", "answer", "answerText", "answerCandidates", "verificationStatus"]),
        trail,
        "HF_SECURE_MOCK_ANSWER_MANIFEST_INVALID",
        false
      );
      const question = scoringQuestions[index];
      if (entry.questionKey !== question.questionKey || entry.revision !== question.revision) {
        throw failure("HF_SECURE_MOCK_ANSWER_MISMATCH", `${trail}: 문제와 연결되지 않는 답안입니다.`);
      }
      if (entry.verificationStatus !== "verified" || !/^[a-z][a-z0-9_-]{1,79}$/.test(String(entry.answerType || ""))) {
        throw failure("HF_SECURE_MOCK_ANSWER_NOT_VERIFIED", `${trail}: 검증 완료되지 않은 답안입니다.`);
      }
      if (!Object.prototype.hasOwnProperty.call(entry, "answer")
        || !Array.isArray(entry.answerCandidates) || entry.answerCandidates.length !== 1) {
        throw failure("HF_SECURE_MOCK_ANSWER_NOT_UNIQUE", `${trail}: 정답 후보가 하나로 확정되지 않았습니다.`);
      }
      const answer = normalizeAnswerValue(entry.answer, `${trail}.answer`);
      const candidate = normalizeAnswerValue(entry.answerCandidates[0], `${trail}.answerCandidates[0]`);
      if (JSON.stringify(candidate) !== JSON.stringify(answer)) {
        throw failure("HF_SECURE_MOCK_ANSWER_NOT_UNIQUE", `${trail}: 정답 후보가 하나로 확정되지 않았습니다.`);
      }
      const answerText = safePlainText(
        typeof entry.answerText === "string" ? entry.answerText : String(answer),
        2000,
        "HF_SECURE_MOCK_ANSWER_MANIFEST_INVALID",
        `${trail} 정답 표시`,
        false
      );
      return {
        questionKey: entry.questionKey,
        revision: entry.revision,
        answerType: entry.answerType,
        answer,
        answerText,
        answerCandidates: [candidate],
        verificationStatus: "verified"
      };
    });
    return deepFreeze({
      attemptId,
      attemptStatus: data.attemptStatus,
      manifestRevision: context.document.manifestRevision,
      answersViewedAt,
      answers
    });
  }

  async function loadAnswers(attemptIdValue) {
    assertFeatureEnabled();
    if (arguments.length !== 1) {
      throw failure("HF_SECURE_MOCK_CLIENT_FIELD_FORBIDDEN", "정답 요청에는 응시 식별자만 사용할 수 있습니다.");
    }
    const { attemptId, context } = requireAttemptContext(attemptIdValue);
    const data = await invoke("loadAnswers", { attemptId });
    return normalizeAnswerResponse(data, attemptId, context);
  }

  function normalizeMarks(value, questions) {
    const marks = assertPlainObject(value, "HF_SECURE_MOCK_ATTEMPT_INVALID", "O/X 표시 형식이 올바르지 않습니다.");
    const expectedKeys = questions.map(question => String(question.number));
    const actualKeys = Object.keys(marks).sort((left, right) => Number(left) - Number(right));
    if (actualKeys.length !== expectedKeys.length || actualKeys.some((key, index) => key !== expectedKeys[index])) {
      throw failure("HF_SECURE_MOCK_ATTEMPT_INCOMPLETE", "모든 문항의 O/X 표시가 필요합니다.");
    }
    const normalized = {};
    expectedKeys.forEach(key => {
      if (marks[key] !== "o" && marks[key] !== "x") {
        throw failure("HF_SECURE_MOCK_ATTEMPT_INVALID", "채점 표시는 O 또는 X만 사용할 수 있습니다.");
      }
      normalized[key] = marks[key];
    });
    return normalized;
  }

  function normalizeSaveResponse(data, attemptId, submissionId, context, marks) {
    const allowed = new Set([
      "attemptId", "submissionId", "status", "attemptNo", "manifestRevision", "correctCount",
      "questionCount", "score", "wrongQuestionKeys", "wrongTypeKeys", "submittedAt"
    ]);
    assertAllowedKeys(data, allowed, "response", "HF_SECURE_MOCK_EDGE_RESPONSE_INVALID", false);
    inspectObject(data, "response", TRANSPORT_FORBIDDEN_KEYS, {
      rejectAnswerPrefixes: true,
      code: "HF_SECURE_MOCK_RESPONSE_SECRET_FIELD"
    });
    if (
      data.attemptId !== attemptId || data.submissionId !== submissionId || data.status !== "submitted"
      || data.manifestRevision !== context.document.manifestRevision
    ) {
      throw failure("HF_SECURE_MOCK_SAVE_RESPONSE_INVALID", "서버 응시 저장 응답이 현재 문제지와 다릅니다.");
    }
    const scoringQuestions = context.document.questions.filter(question => question.scoringEligible);
    const questionCount = scoringQuestions.length;
    const correctCount = Object.values(marks).filter(mark => mark === "o").length;
    const expectedScore = Math.round(correctCount * 100 / questionCount);
    if (
      data.questionCount !== questionCount || data.correctCount !== correctCount || data.score !== expectedScore
      || data.attemptNo !== context.document.attemptNo
    ) {
      throw failure("HF_SECURE_MOCK_SAVE_RESPONSE_INVALID", "서버가 계산한 채점 결과가 현재 O/X 표시와 다릅니다.");
    }
    const expectedWrongQuestionKeys = scoringQuestions
      .filter(question => marks[String(question.number)] === "x")
      .map(question => question.questionKey);
    if (!Array.isArray(data.wrongQuestionKeys)
      || JSON.stringify(data.wrongQuestionKeys) !== JSON.stringify(expectedWrongQuestionKeys)
      || !Array.isArray(data.wrongTypeKeys)
      || data.wrongTypeKeys.some(key => !TYPE_KEY_RE.test(String(key)))) {
      throw failure("HF_SECURE_MOCK_SAVE_RESPONSE_INVALID", "서버가 계산한 오답 진단 결과가 안전 계약과 다릅니다.");
    }
    const expectedTypeKeys = [...new Set(scoringQuestions
      .filter(question => marks[String(question.number)] === "x")
      .map(question => question.typeKey))];
    if (JSON.stringify(data.wrongTypeKeys) !== JSON.stringify(expectedTypeKeys)) {
      throw failure("HF_SECURE_MOCK_SAVE_RESPONSE_INVALID", "서버가 계산한 약점 유형이 현재 O/X 표시와 다릅니다.");
    }
    const submittedAt = safeTimestamp(
      data.submittedAt,
      "HF_SECURE_MOCK_SAVE_RESPONSE_INVALID",
      "제출 시각",
      false
    );
    return deepFreeze({
      attemptId,
      submissionId,
      status: "submitted",
      attemptNo: data.attemptNo,
      manifestRevision: data.manifestRevision,
      correctCount,
      questionCount,
      score: expectedScore,
      wrongQuestionKeys: expectedWrongQuestionKeys,
      wrongTypeKeys: expectedTypeKeys,
      submittedAt
    });
  }

  async function saveAttempt(payload) {
    assertFeatureEnabled();
    assertAllowedKeys(payload, new Set(["attemptId", "submissionId", "marks"]), "request", "HF_SECURE_MOCK_CLIENT_FIELD_FORBIDDEN", true);
    const { attemptId, context } = requireAttemptContext(payload.attemptId);
    const marks = normalizeMarks(payload.marks, context.document.questions.filter(question => question.scoringEligible));
    const submissionId = stableSessionUuid(`${SUBMISSION_ID_PREFIX}${attemptId}`, payload.submissionId);
    const data = await invoke("saveAttempt", { attemptId, submissionId, marks });
    return normalizeSaveResponse(data, attemptId, submissionId, context, marks);
  }

  root.GFieldHFSecureMock = Object.freeze({
    listExams,
    loadExam,
    loadAnswers,
    saveAttempt,
    startNewAttempt
  });
})(typeof window !== "undefined" ? window : globalThis);
