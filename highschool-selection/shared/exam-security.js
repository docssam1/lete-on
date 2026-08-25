(function (root) {
  "use strict";

  const IMAGE_MIMES = new Set(["image/png", "image/jpeg", "image/webp"]);
  const RESPONSE_TYPES = new Set(["input", "multi_input", "ordered_list", "unordered_set", "self_check"]);
  const LEGACY_RESPONSE_TYPES = new Set(["ox"]);
  const SAFE_ANSWER_IMAGE_KEYS = new Set(["answerimageurl", "answerimagemimetype", "answerimageexpiresat", "singleanswerverified"]);

  function fail(message) { throw new Error(message); }
  function cleanHost(value) { return String(value || "").trim().toLowerCase(); }
  function normalizedKey(value) { return String(value || "").replace(/[-_]/g, "").toLowerCase(); }
  function isPrivateKey(key) {
    const value = normalizedKey(key);
    if (SAFE_ANSWER_IMAGE_KEYS.has(value)) return false;
    return value.includes("answer") || /^(?:solution|explanation|rubric)(?:data|digest|hash|html|key|spec|text|value)?$/.test(value);
  }
  function assertNoAnswerLeak(value, path) {
    if (!value || typeof value !== "object") return;
    Object.keys(value).forEach(function (key) {
      const nextPath = path.concat(key);
      if (isPrivateKey(key)) {
        fail("답안 입력 응답에 비공개 정보가 포함되어 있습니다.");
      }
      assertNoAnswerLeak(value[key], nextPath);
    });
  }
  function canonicalResponseType(value) {
    const type = String(value || "").trim().toLowerCase();
    return type === "ox" ? "self_check" : type;
  }
  function shortText(value, fallback, maxLength) {
    const text = String(value == null ? "" : value).trim() || fallback;
    if (!text || text.length > maxLength) fail("복수 답안 칸 구성이 올바르지 않습니다.");
    return text;
  }
  function safeId(value, fallback) {
    const id = shortText(value, fallback, 60);
    if (!/^[A-Za-z0-9_-]+$/.test(id)) fail("복수 답안 칸 식별자가 올바르지 않습니다.");
    return id;
  }
  function validateFields(fields) {
    if (!Array.isArray(fields) || fields.length < 2 || fields.length > 20) fail("복수 답안 칸 구성이 올바르지 않습니다.");
    const seen = new Set();
    const groupLabels = new Map();
    return fields.map(function (field, index) {
      if (!field || typeof field !== "object") fail("복수 답안 칸 구성이 올바르지 않습니다.");
      const slotId = safeId(field.slotId || field.id, `slot-${index + 1}`);
      if (seen.has(slotId)) fail("복수 답안 칸 식별자가 중복되었습니다.");
      seen.add(slotId);
      const result = { slotId, label: shortText(field.label, String(index + 1), 40) };
      if (field.groupLabel && !(field.groupId || field.group)) fail("복수 답안 그룹 식별자가 필요합니다.");
      if (field.groupId || field.group) {
        result.groupId = safeId(field.groupId || field.group, "");
        if (field.groupLabel) result.groupLabel = shortText(field.groupLabel, "", 40);
        const previous = groupLabels.get(result.groupId);
        if (previous !== undefined && previous !== (result.groupLabel || "")) fail("복수 답안 그룹 이름이 일치하지 않습니다.");
        groupLabels.set(result.groupId, result.groupLabel || "");
      }
      return result;
    });
  }

  function validateSignedImageUrl(rawUrl, mimeType, expiresAt, runtime, now, label) {
    const hosts = new Set((runtime.assetHosts || []).map(cleanHost).filter(Boolean));
    if (!hosts.size) fail("허용된 시험지 이미지 서버가 설정되지 않았습니다.");
    if (!IMAGE_MIMES.has(String(mimeType || "").toLowerCase())) fail(`${label} 이미지 형식이 올바르지 않습니다.`);
    const expires = Date.parse(expiresAt || "");
    const maxTtl = Math.max(1, Number(runtime.maxPageUrlTtlSeconds || 0)) * 1000;
    if (!Number.isFinite(expires) || expires <= now || expires - now > maxTtl) fail(`${label} 이미지 링크의 유효시간이 올바르지 않습니다.`);
    let url;
    try { url = new URL(String(rawUrl || "")); } catch (_) { fail(`${label} 이미지 주소가 올바르지 않습니다.`); }
    if (url.protocol !== "https:" || !hosts.has(cleanHost(url.hostname))) fail(`허용되지 않은 ${label} 이미지 주소입니다.`);
    if (/\.pdf(?:$|[?#])/i.test(url.pathname + url.search + url.hash)) fail("PDF 직접 경로는 사용할 수 없습니다.");
    return url.href;
  }

  function validateManifest(manifest, exam, session, runtime, nowMs) {
    if (!manifest || typeof manifest !== "object") fail("시험지 페이지 응답이 올바르지 않습니다.");
    if (!exam || manifest.examId !== exam.id) fail("시험지 식별자가 일치하지 않습니다.");
    if (!runtime || runtime.assetMode !== "signed-page-images") fail("서명 이미지 전달 정책이 설정되지 않았습니다.");
    if (!session || !session.studentId || manifest.studentId !== session.studentId) fail("학생별 페이지 권한이 일치하지 않습니다.");

    const now = Number.isFinite(nowMs) ? nowMs : Date.now();
    const list = Array.isArray(manifest.pages) ? manifest.pages : [];
    if (!Number.isInteger(exam.pageCount) || list.length !== exam.pageCount) fail("학생용 문제 페이지 수가 일치하지 않습니다.");

    const seen = new Set();
    return list.map(function (page, index) {
      if (!page || page.number !== index + 1 || seen.has(page.number)) fail("시험지 페이지 순서가 올바르지 않습니다.");
      seen.add(page.number);
      const url = validateSignedImageUrl(page.url, page.mimeType, manifest.expiresAt, runtime, now, "시험지");
      return { number: page.number, url, mimeType: String(page.mimeType).toLowerCase() };
    });
  }

  function validateResponseSchema(schema, exam, session, runtime, nowMs) {
    if (!schema || typeof schema !== "object" || schema.examId !== exam.id) fail("답안 입력 구성의 시험 식별자가 일치하지 않습니다.");
    if (!session || !session.studentId || schema.studentId !== session.studentId) fail("학생별 답안 입력 권한이 일치하지 않습니다.");
    assertNoAnswerLeak(schema, []);
    const list = Array.isArray(schema.questions) ? schema.questions : [];
    if (!Number.isInteger(exam.questionCount) || list.length !== exam.questionCount) fail("답안 입력 문항 수가 일치하지 않습니다.");
    return list.map(function (question, index) {
      const suppliedType = String(question && question.responseType || "").trim().toLowerCase();
      const responseType = canonicalResponseType(suppliedType);
      if (!question || question.number !== index + 1 || (!RESPONSE_TYPES.has(responseType) && !LEGACY_RESPONSE_TYPES.has(suppliedType))) fail("답안 입력 문항 구성이 올바르지 않습니다.");
      if (responseType === "multi_input") return { number: question.number, responseType, fields: validateFields(question.fields) };
      if (responseType === "self_check") {
        if (question.selfCheck !== true || question.singleAnswerVerified !== true || !question.answerImageUrl) fail("그림 확인형 문항의 단일 정답 검증이 완료되지 않았습니다.");
        const answerImageUrl = validateSignedImageUrl(question.answerImageUrl, question.answerImageMimeType, question.answerImageExpiresAt, runtime || {}, Number.isFinite(nowMs) ? nowMs : Date.now(), "정답");
        return {
          number: question.number,
          responseType,
          selfCheck: true,
          singleAnswerVerified: true,
          answerImageUrl,
          answerImageMimeType: String(question.answerImageMimeType).toLowerCase(),
          answerImageExpiresAt: String(question.answerImageExpiresAt)
        };
      }
      return { number: question.number, responseType };
    });
  }

  function learnerText(value) {
    if (typeof value !== "string" || value.length > 1000) fail("제출 답안 형식이 올바르지 않습니다.");
    return value.trim();
  }
  function validateAttemptAnswers(answers, questions) {
    const schema = Array.isArray(questions) ? questions : [];
    if (!Array.isArray(answers) || answers.length !== schema.length) fail("제출 답안 문항 수가 일치하지 않습니다.");
    return answers.map(function (answer, index) {
      const question = schema[index];
      const responseType = canonicalResponseType(answer && answer.responseType);
      if (!answer || answer.number !== question.number || responseType !== question.responseType) fail("제출 답안 문항 구성이 일치하지 않습니다.");
      if (responseType === "multi_input") {
        const fields = question.fields || [];
        if (!Array.isArray(answer.value) || !Array.isArray(answer.slotIds) || !Array.isArray(answer.groupIds) ||
          answer.value.length !== fields.length || answer.slotIds.length !== fields.length || answer.groupIds.length !== fields.length) {
          fail("복수 답안 슬롯 구성이 일치하지 않습니다.");
        }
        fields.forEach(function (field, fieldIndex) {
          if (String(answer.slotIds[fieldIndex]) !== field.slotId || (answer.groupIds[fieldIndex] || null) !== (field.groupId || null)) fail("복수 답안 슬롯 구성이 일치하지 않습니다.");
        });
        return {
          number: answer.number,
          responseType,
          value: answer.value.map(learnerText),
          slotIds: answer.slotIds.map(String),
          groupIds: answer.groupIds.map(function (value) { return value == null ? null : String(value); })
        };
      }
      if (responseType === "ordered_list" || responseType === "unordered_set") {
        if (!Array.isArray(answer.value) || answer.value.length > 50) fail("목록 답안 형식이 올바르지 않습니다.");
        const values = answer.value.map(learnerText).filter(Boolean);
        if (responseType === "unordered_set") values.sort(function (a, b) {
          const left = a.toLowerCase(), right = b.toLowerCase();
          return left < right ? -1 : (left > right ? 1 : (a < b ? -1 : (a > b ? 1 : 0)));
        });
        return { number: answer.number, responseType, value: values };
      }
      if (responseType === "self_check") {
        const value = learnerText(answer.value).toLowerCase();
        if (value !== "" && value !== "o" && value !== "x") fail("자기 확인 답안 형식이 올바르지 않습니다.");
        return { number: answer.number, responseType, value };
      }
      return { number: answer.number, responseType, value: learnerText(answer.value) };
    });
  }

  root.HIGHSELECT_EXAM_SECURITY = { validateManifest, validateResponseSchema, validateAttemptAnswers };
  if (typeof module !== "undefined" && module.exports) module.exports = root.HIGHSELECT_EXAM_SECURITY;
})(typeof window !== "undefined" ? window : globalThis);
