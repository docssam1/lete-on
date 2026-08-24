"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { URL } = require("node:url");
const examSecurity = require("../shared/exam-security.js");
const contracts = require("./exam-contracts.js");
const privateConfig = require("./private-config.js");
const privateScorer = require("./private-scorer.js");
const { createStore } = require("./attempt-store.js");
const { buildReport } = require("./report-builder.js");
const security = require("./security.js");

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

const MIME = Object.freeze({
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
});

function readJson(request, limit) {
  return new Promise(function (resolve, reject) {
    const chunks = [];
    let size = 0;
    request.on("data", function (chunk) {
      size += chunk.length;
      if (size > limit) { reject(new HttpError(413, "요청 데이터가 너무 큽니다.")); request.destroy(); return; }
      chunks.push(chunk);
    });
    request.on("end", function () {
      try { resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {}); }
      catch (_) { reject(new HttpError(400, "요청 형식이 올바르지 않습니다.")); }
    });
    request.on("error", reject);
  });
}

function setSecurityHeaders(response) {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "no-referrer");
  response.setHeader("X-Frame-Options", "DENY");
}

function sendJson(response, status, data, extraHeaders) {
  setSecurityHeaders(response);
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  Object.entries(extraHeaders || {}).forEach(function (entry) { response.setHeader(entry[0], entry[1]); });
  response.end(JSON.stringify(data));
}

function publicOrigin(request, configured) {
  if (configured) {
    const url = new URL(configured);
    if (url.protocol !== "https:") throw new Error("HIGHSELECT_PUBLIC_ORIGIN must use https");
    return url.origin;
  }
  const host = String(request.headers["x-forwarded-host"] || request.headers.host || "").trim();
  if (!host || /[\s/\\]/.test(host)) throw new HttpError(503, "공개 이미지 주소가 설정되지 않았습니다.");
  return `https://${host}`;
}

function currentUser(request, loadConfig, secret, cookieName, now) {
  const cookies = security.parseCookies(request.headers.cookie);
  const token = security.verifySession(cookies[cookieName], secret, now());
  if (!token) throw new HttpError(401, "로그인이 필요합니다.");
  const config = loadConfig();
  const user = config.students.find(function (item) { return item.studentId === token.studentId; });
  if (!user) throw new HttpError(401, "승인 정보가 변경되었습니다. 다시 로그인해 주세요.");
  if (token.authVersion !== security.approvalVersion(user.approvalCodeHash, secret)) throw new HttpError(401, "승인 정보가 변경되었습니다. 다시 로그인해 주세요.");
  if (privateConfig.isStudentExpired(user, now())) throw new HttpError(401, "승인 기간이 만료되었습니다.");
  return { config, user };
}

function requireAdmin(context) {
  if (!context || !context.user || context.user.role !== "admin") throw new HttpError(403, "관리자 권한이 필요합니다.");
  return context;
}

function requestOrigin(request) {
  const host = String(request.headers["x-forwarded-host"] || request.headers.host || "").trim();
  if (!host || /[\s/\\]/.test(host)) throw new HttpError(403, "관리자 변경 요청의 출처를 확인할 수 없습니다.");
  const forwardedProtocol = String(request.headers["x-forwarded-proto"] || "").split(",")[0].trim().toLowerCase();
  const protocol = forwardedProtocol || (request.socket && request.socket.encrypted ? "https" : "http");
  if (protocol !== "http" && protocol !== "https") throw new HttpError(403, "관리자 변경 요청의 출처를 확인할 수 없습니다.");
  return `${protocol}://${host}`;
}

function requireAdminMutation(request, expectsJson, configuredOrigin) {
  const suppliedOrigin = String(request.headers.origin || "").trim();
  const expectedOrigin = configuredOrigin || requestOrigin(request);
  if (!suppliedOrigin || suppliedOrigin !== expectedOrigin) throw new HttpError(403, "관리자 변경 요청의 출처를 확인할 수 없습니다.");
  if (request.headers["x-highselect-admin"] !== "1") throw new HttpError(403, "관리자 변경 요청을 확인할 수 없습니다.");
  if (expectsJson && !/^application\/json(?:;|$)/i.test(String(request.headers["content-type"] || ""))) {
    throw new HttpError(415, "JSON 요청만 허용됩니다.");
  }
}

function publicGrant(student) {
  return {
    id: student.studentId,
    studentName: student.name,
    examIds: student.grants.slice(),
    expiresAt: student.expiresAt || null
  };
}

function writableConfig(config, students) {
  return {
    schemaVersion: config.schemaVersion,
    students: students.map(function (student) {
      return {
        studentId: student.studentId,
        name: student.name,
        approvalCodeHash: student.approvalCodeHash,
        role: student.role,
        grants: student.grants.slice(),
        expiresAt: student.expiresAt || null
      };
    }),
    exams: Object.fromEntries(Object.entries(config.exams).map(function (entry) { return [entry[0], Object.assign({}, entry[1])]; }))
  };
}

function requireExamAccess(context, examId) {
  const exam = contracts.getExamContract(examId);
  if (!exam) throw new HttpError(404, "시험을 찾을 수 없습니다.");
  if (context.user.role !== "admin" && !context.user.grants.includes(examId)) throw new HttpError(403, "이 시험은 개별 승인이 필요합니다.");
  const privateExam = context.config.exams[examId];
  if (!privateExam || !privateConfig.isReleased(privateExam)) throw new HttpError(423, "시험 검수와 전체 확인이 끝나지 않았습니다.");
  if (Number(privateExam.pageCount) !== exam.pageCount || Number(privateExam.questionCount) !== exam.questionCount) throw new HttpError(503, "시험 자산 구성이 공개 계약과 일치하지 않습니다.");
  return { exam, privateExam };
}

function pagePath(privateExam, pageNumber) {
  const fileName = `page-${String(pageNumber).padStart(2, "0")}.png`;
  const root = path.resolve(privateExam.pageAssetRoot);
  const resolved = path.resolve(root, fileName);
  if (path.dirname(resolved) !== root) throw new HttpError(500, "시험지 자산 경로가 올바르지 않습니다.");
  if (fs.existsSync(root) && fs.existsSync(resolved)) {
    const realRoot = fs.realpathSync(root);
    const realFile = fs.realpathSync(resolved);
    if (path.dirname(realFile) !== realRoot) throw new HttpError(500, "시험지 자산 경로가 올바르지 않습니다.");
  }
  return resolved;
}

function createApp(options) {
  const opts = options || {};
  const sessionSecret = String(opts.sessionSecret || process.env.HIGHSELECT_SESSION_SECRET || "");
  const assetSecret = String(opts.assetSecret || process.env.HIGHSELECT_ASSET_SIGNING_SECRET || sessionSecret);
  if (sessionSecret.length < 32 || assetSecret.length < 32) throw new Error("session and asset signing secrets must be at least 32 characters");
  const cookieName = String(opts.cookieName || "highselect_session");
  const sessionSeconds = Math.max(300, Number(opts.sessionSeconds || 43200));
  const assetTtlSeconds = Math.min(900, Math.max(60, Number(opts.assetTtlSeconds || 600)));
  const cookieSecure = opts.cookieSecure === undefined ? process.env.HIGHSELECT_COOKIE_SECURE !== "false" : opts.cookieSecure !== false;
  const now = typeof opts.now === "function" ? opts.now : Date.now;
  const loadConfig = opts.loadConfig || privateConfig.createLoader({ config: opts.privateConfig, configPath: opts.privateConfigPath });
  const saveConfig = opts.saveConfig || privateConfig.createWriter({ configPath: opts.privateConfigPath });
  const scorer = opts.scorer || privateScorer.createAdapter({ data: opts.privateScorer, scorerPath: opts.privateScorerPath });
  const store = opts.store || createStore({ filePath: opts.attemptStorePath });
  const staticRoot = path.resolve(opts.staticRoot || path.join(__dirname, ".."));
  const configuredOrigin = String(opts.publicOrigin || process.env.HIGHSELECT_PUBLIC_ORIGIN || "").trim();
  const dummyApprovalHash = security.hashApprovalCode("INVALID-APPROVAL-CODE", Buffer.alloc(16, 0).toString("base64url"));

  function persistMutation(mutate) {
    if (!saveConfig) throw new HttpError(503, "비공개 승인 설정의 안전한 저장 경로가 연결되지 않았습니다.");
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const latest = loadConfig();
      const mutation = mutate(latest);
      try {
        const saved = saveConfig(writableConfig(latest, mutation.students), privateConfig.revision(latest));
        return { saved, value: mutation.value };
      } catch (error) {
        if (error && (error.code === "CONFIG_BUSY" || error.code === "CONFIG_CONFLICT")) continue;
        throw error;
      }
    }
    throw new HttpError(409, "승인 정보가 동시에 변경되었습니다. 새로고침 후 다시 시도해 주세요.");
  }

  async function api(request, response, pathname, url) {
    if (request.method === "POST" && pathname === "/session") {
      const body = await readJson(request, 32 * 1024);
      const name = security.clean(body.name);
      const code = security.cleanApprovalCode(body.approvalCode);
      const config = loadConfig();
      const namedUsers = config.students.filter(function (item) { return item.name === name; });
      if (!namedUsers.length) security.verifyApprovalCode(code, dummyApprovalHash);
      const matchedUsers = namedUsers.filter(function (item) { return security.verifyApprovalCode(code, item.approvalCodeHash); });
      const user = matchedUsers.length === 1 ? matchedUsers[0] : null;
      if (!user || privateConfig.isStudentExpired(user, now())) throw new HttpError(401, "이름 또는 승인번호를 확인해 주세요.");
      const issuedAtMs = now();
      const token = security.signSession({
        studentId: user.studentId,
        authVersion: security.approvalVersion(user.approvalCodeHash, sessionSecret),
        iat: issuedAtMs,
        exp: issuedAtMs + sessionSeconds * 1000
      }, sessionSecret);
      sendJson(response, 200, {
        name: user.name,
        studentId: user.role === "admin" ? "" : user.studentId,
        role: user.role,
        access: user.role === "admin" ? Object.keys(config.exams) : user.grants.slice(),
        issuedAt: new Date(issuedAtMs).toISOString()
      }, { "Set-Cookie": security.sessionCookie(token, { name: cookieName, secure: cookieSecure, maxAgeSeconds: sessionSeconds }) });
      return true;
    }

    if (pathname === "/admin/access-grants" || pathname.startsWith("/admin/access-grants/")) {
      const context = requireAdmin(currentUser(request, loadConfig, sessionSecret, cookieName, now));
      if (request.method === "GET" && pathname === "/admin/access-grants") {
        sendJson(response, 200, context.config.students.filter(function (student) { return student.role !== "admin"; }).map(publicGrant));
        return true;
      }
      if (request.method === "POST" && pathname === "/admin/access-grants") {
        requireAdminMutation(request, true, configuredOrigin);
        const body = await readJson(request, 64 * 1024);
        const studentName = security.clean(body.studentName);
        const approvalCode = security.cleanApprovalCode(body.approvalCode);
        const examIds = Array.isArray(body.examIds) ? Array.from(new Set(body.examIds.map(security.clean).filter(Boolean))) : [];
        const expiresAt = body.expiresAt == null || body.expiresAt === "" ? null : security.clean(body.expiresAt);
        if (!studentName || studentName.length > 80 || approvalCode.length < 6 || approvalCode.length > 80 || !examIds.length) {
          throw new HttpError(400, "이름, 승인번호, 허용 시험을 확인해 주세요.");
        }
        if (expiresAt && !privateConfig.isValidExpiryDate(expiresAt)) {
          throw new HttpError(400, "만료일 형식이 올바르지 않습니다.");
        }
        const studentId = `student_${crypto.randomUUID().replace(/-/g, "")}`;
        const approvalCodeHash = security.hashApprovalCode(approvalCode);
        const student = {
          studentId,
          name: studentName,
          approvalCodeHash,
          role: "student",
          grants: examIds,
          expiresAt
        };
        const result = persistMutation(function (latest) {
          examIds.forEach(function (examId) {
            if (!contracts.getExamContract(examId) || !latest.exams[examId]) throw new HttpError(400, "등록되지 않은 시험은 승인할 수 없습니다.");
          });
          if (latest.students.some(function (item) { return item.name === studentName && security.verifyApprovalCode(approvalCode, item.approvalCodeHash); })) {
            throw new HttpError(409, "같은 이름과 승인번호가 이미 사용 중입니다.");
          }
          return { students: latest.students.concat(student), value: studentId };
        });
        const stored = result.saved.students.find(function (item) { return item.studentId === result.value; });
        sendJson(response, 201, publicGrant(stored));
        return true;
      }
      const grantMatch = pathname.match(/^\/admin\/access-grants\/([^/]+)$/);
      if (request.method === "PUT" && grantMatch) {
        requireAdminMutation(request, true, configuredOrigin);
        const grantId = decodeURIComponent(grantMatch[1]);
        const body = await readJson(request, 64 * 1024);
        const studentName = security.clean(body.studentName);
        const approvalCode = security.cleanApprovalCode(body.approvalCode);
        const examIds = Array.isArray(body.examIds) ? Array.from(new Set(body.examIds.map(security.clean).filter(Boolean))) : [];
        const expiresAt = body.expiresAt == null || body.expiresAt === "" ? null : security.clean(body.expiresAt);
        if (!studentName || studentName.length > 80 || approvalCode.length < 6 || approvalCode.length > 80 || !examIds.length) {
          throw new HttpError(400, "이름, 승인번호, 허용 시험을 확인해 주세요.");
        }
        if (expiresAt && !privateConfig.isValidExpiryDate(expiresAt)) throw new HttpError(400, "만료일 형식이 올바르지 않습니다.");
        const approvalCodeHash = security.hashApprovalCode(approvalCode);
        const result = persistMutation(function (latest) {
          const targetIndex = latest.students.findIndex(function (student) { return student.studentId === grantId; });
          if (targetIndex < 0 || latest.students[targetIndex].role === "admin") throw new HttpError(404, "승인을 찾을 수 없습니다.");
          examIds.forEach(function (examId) {
            if (!contracts.getExamContract(examId) || !latest.exams[examId]) throw new HttpError(400, "등록되지 않은 시험은 승인할 수 없습니다.");
          });
          if (latest.students.some(function (item) { return item.studentId !== grantId && item.name === studentName && security.verifyApprovalCode(approvalCode, item.approvalCodeHash); })) {
            throw new HttpError(409, "같은 이름과 승인번호가 이미 사용 중입니다.");
          }
          const students = latest.students.slice();
          students[targetIndex] = { studentId: grantId, name: studentName, approvalCodeHash, role: "student", grants: examIds, expiresAt };
          return { students, value: grantId };
        });
        const stored = result.saved.students.find(function (item) { return item.studentId === result.value; });
        sendJson(response, 200, publicGrant(stored));
        return true;
      }
      if (request.method === "DELETE" && grantMatch) {
        requireAdminMutation(request, false, configuredOrigin);
        const grantId = decodeURIComponent(grantMatch[1]);
        const result = persistMutation(function (latest) {
          const target = latest.students.find(function (student) { return student.studentId === grantId; });
          if (!target || target.role === "admin") throw new HttpError(404, "승인을 찾을 수 없습니다.");
          return { students: latest.students.filter(function (student) { return student.studentId !== grantId; }), value: grantId };
        });
        if (result.saved.students.some(function (student) { return student.studentId === grantId; })) throw new HttpError(500, "승인 취소를 저장하지 못했습니다.");
        sendJson(response, 200, { ok: true });
        return true;
      }
      throw new HttpError(405, "허용되지 않은 요청입니다.");
    }

    let match = pathname.match(/^\/exams\/([^/]+)\/(pages|response-schema|attempts)$/);
    if (match) {
      const examId = decodeURIComponent(match[1]);
      const action = match[2];
      const context = currentUser(request, loadConfig, sessionSecret, cookieName, now);
      const granted = requireExamAccess(context, examId);
      if (action === "pages" && request.method === "GET") {
        const expires = Math.floor(now() / 1000) + assetTtlSeconds;
        const subject = security.opaqueSubject(context.user.studentId, assetSecret);
        const origin = publicOrigin(request, configuredOrigin);
        const pages = [];
        for (let number = 1; number <= granted.exam.pageCount; number += 1) {
          const asset = pagePath(granted.privateExam, number);
          if (!fs.existsSync(asset) || !fs.statSync(asset).isFile()) throw new HttpError(503, "검증된 시험지 페이지 자산이 준비되지 않았습니다.");
          const signature = security.signPageAsset({ subject, examId, pageNumber: number, expires }, assetSecret);
          pages.push({ number, url: `${origin}/page-assets/${encodeURIComponent(examId)}/page-${String(number).padStart(2, "0")}.png?sub=${subject}&exp=${expires}&sig=${encodeURIComponent(signature)}`, mimeType: "image/png" });
        }
        sendJson(response, 200, { examId, studentId: context.user.studentId, expiresAt: new Date(expires * 1000).toISOString(), pages });
        return true;
      }
      if (action === "response-schema" && request.method === "GET") {
        const schema = contracts.responseSchemaFor(examId, context.user.studentId);
        if (!schema) throw new HttpError(404, "답안 입력 구성을 찾을 수 없습니다.");
        sendJson(response, 200, schema);
        return true;
      }
      if (action === "attempts" && request.method === "POST") {
        const schema = contracts.responseSchemaFor(examId, context.user.studentId);
        if (!schema) throw new HttpError(404, "답안 입력 구성을 찾을 수 없습니다.");
        const body = await readJson(request, 256 * 1024);
        let answers;
        try { answers = examSecurity.validateAttemptAnswers(body.answers, schema.questions); }
        catch (error) { throw new HttpError(400, error.message); }
        const scored = await scorer.score(examId, answers, schema);
        if (scored.classificationStatus !== "verified" || scored.items.length !== granted.exam.questionCount) throw new HttpError(503, "검증된 채점·분류 구성이 완전하지 않습니다.");
        const attemptId = `att_${crypto.randomUUID()}`;
        const submittedAt = new Date(now()).toISOString();
        const report = buildReport({ attemptId, studentId: context.user.studentId, exam: granted.exam, submittedAt, scored });
        await store.save({ attemptId, studentId: context.user.studentId, examId, submittedAt, report });
        sendJson(response, 201, { attemptId });
        return true;
      }
      throw new HttpError(405, "허용되지 않은 요청입니다.");
    }

    match = pathname.match(/^\/attempts\/([^/]+)\/report$/);
    if (match) {
      if (request.method !== "GET") throw new HttpError(405, "허용되지 않은 요청입니다.");
      const context = currentUser(request, loadConfig, sessionSecret, cookieName, now);
      const attemptId = decodeURIComponent(match[1]);
      const record = await store.get(attemptId);
      if (!record || record.studentId !== context.user.studentId) throw new HttpError(404, "분석지를 찾을 수 없습니다.");
      requireExamAccess(context, record.examId);
      sendJson(response, 200, record.report);
      return true;
    }

    match = pathname.match(/^\/page-assets\/([^/]+)\/page-(\d{2})\.png$/);
    if (match) {
      if (request.method !== "GET" && request.method !== "HEAD") throw new HttpError(405, "허용되지 않은 요청입니다.");
      const examId = decodeURIComponent(match[1]);
      const pageNumber = Number(match[2]);
      const context = currentUser(request, loadConfig, sessionSecret, cookieName, now);
      const granted = requireExamAccess(context, examId);
      if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > granted.exam.pageCount) throw new HttpError(404, "시험지 페이지를 찾을 수 없습니다.");
      const expires = Number(url.searchParams.get("exp"));
      const subject = String(url.searchParams.get("sub") || "");
      const signature = String(url.searchParams.get("sig") || "");
      const currentSeconds = Math.floor(now() / 1000);
      if (!Number.isInteger(expires) || expires <= currentSeconds || expires > currentSeconds + assetTtlSeconds + 5) throw new HttpError(403, "시험지 페이지 링크가 만료되었습니다.");
      const expectedSubject = security.opaqueSubject(context.user.studentId, assetSecret);
      if (subject !== expectedSubject || !security.verifyPageAsset({ subject, examId, pageNumber, expires }, signature, assetSecret)) throw new HttpError(403, "시험지 페이지 서명이 올바르지 않습니다.");
      const asset = pagePath(granted.privateExam, pageNumber);
      if (!fs.existsSync(asset) || !fs.statSync(asset).isFile()) throw new HttpError(404, "시험지 페이지를 찾을 수 없습니다.");
      setSecurityHeaders(response);
      response.statusCode = 200;
      response.setHeader("Content-Type", "image/png");
      response.setHeader("Cache-Control", "private, no-store");
      response.setHeader("Content-Disposition", `inline; filename="exam-page-${String(pageNumber).padStart(2, "0")}.png"`);
      if (request.method === "HEAD") response.end();
      else fs.createReadStream(asset).pipe(response);
      return true;
    }
    return false;
  }

  function staticFile(request, response, pathname) {
    if (request.method !== "GET" && request.method !== "HEAD") return false;
    let relative;
    try { relative = decodeURIComponent(pathname); } catch (_) { throw new HttpError(400, "주소가 올바르지 않습니다."); }
    if (relative === "/") relative = "/index.html";
    if (/\.pdf$/i.test(relative) || /(?:^|\/)server(?:\/|$)/i.test(relative) || /(?:^|\/)tests(?:\/|$)/i.test(relative) || relative.includes("\\") || relative.includes("\0")) throw new HttpError(404, "파일을 찾을 수 없습니다.");
    const resolved = path.resolve(staticRoot, `.${relative}`);
    if (resolved !== staticRoot && !resolved.startsWith(staticRoot + path.sep)) throw new HttpError(404, "파일을 찾을 수 없습니다.");
    if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) return false;
    const extension = path.extname(resolved).toLowerCase();
    if (!MIME[extension]) throw new HttpError(404, "파일을 찾을 수 없습니다.");
    setSecurityHeaders(response);
    response.statusCode = 200;
    response.setHeader("Content-Type", MIME[extension]);
    response.setHeader("Cache-Control", extension === ".html" ? "no-cache" : "public, max-age=300");
    if (request.method === "HEAD") response.end();
    else fs.createReadStream(resolved).pipe(response);
    return true;
  }

  return async function handler(request, response) {
    try {
      const url = new URL(request.url, "http://localhost");
      if (await api(request, response, url.pathname, url)) return;
      if (staticFile(request, response, url.pathname)) return;
      throw new HttpError(404, "요청한 주소를 찾을 수 없습니다.");
    } catch (error) {
      if (response.headersSent) { response.destroy(); return; }
      const status = Number(error.status) || 500;
      sendJson(response, status, { message: status >= 500 ? "서버 구성을 확인해 주세요." : error.message });
    }
  };
}

module.exports = { createApp, HttpError };
