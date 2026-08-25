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
const { createStore: createDraftStore } = require("./exam-draft-store.js");
const { buildReport } = require("./report-builder.js");
const security = require("./security.js");
const draftCore = require("../data/exam-draft-core.js");
const candidateQuery = require("../data/exam-candidate-query.js");
const bankCore = require("../data/question-bank-core.js");

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
  return { config, user };
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

function requireAdmin(context) {
  if (context.user.role !== "admin") throw new HttpError(403, "관리자 권한이 필요합니다.");
  return context;
}

function materializeDraftRecord(record) {
  if (!record || typeof record !== "object" || !Array.isArray(record.placements)) throw new Error("exam draft record is invalid");
  const draft = draftCore.createExamDraft(record.draft);
  const placements = record.placements.map(function (placement) {
    return draftCore.createExamPlacement({
      id: placement && placement.id, draftId: placement && placement.draftId, mode: placement && placement.mode, writer: placement && placement.writer,
      item: placement && placement.item, order: placement && placement.order, points: placement && placement.points, scopeVersion: placement && placement.scopeVersion,
      revision: placement && placement.revision, replacementHistory: placement && placement.replacementHistory
    }, draft);
  });
  return { draft, placements };
}

function publicDraft(record) {
  const clean = materializeDraftRecord(record);
  const validation = draftCore.validateExamDraft(clean.draft, clean.placements);
  return { draft: clean.draft, placements: clean.placements, validation };
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
  const scorer = opts.scorer || privateScorer.createAdapter({ data: opts.privateScorer, scorerPath: opts.privateScorerPath });
  const store = opts.store || createStore({ filePath: opts.attemptStorePath });
  const draftStore = opts.draftStore || createDraftStore({ filePath: opts.examDraftStorePath });
  const staticRoot = path.resolve(opts.staticRoot || path.join(__dirname, ".."));
  const configuredOrigin = String(opts.publicOrigin || process.env.HIGHSELECT_PUBLIC_ORIGIN || "").trim();
  const dummyApprovalHash = security.hashApprovalCode("INVALID-APPROVAL-CODE", Buffer.alloc(16, 0).toString("base64url"));

  async function api(request, response, pathname, url) {
    if (request.method === "POST" && pathname === "/session") {
      const body = await readJson(request, 32 * 1024);
      const name = security.clean(body.name);
      const code = security.cleanApprovalCode(body.approvalCode);
      const config = loadConfig();
      const user = config.students.find(function (item) { return item.name === name; });
      const approvalMatches = security.verifyApprovalCode(code, user ? user.approvalCodeHash : dummyApprovalHash);
      if (!user || !approvalMatches) throw new HttpError(401, "이름 또는 승인번호를 확인해 주세요.");
      const issuedAtMs = now();
      const token = security.signSession({ studentId: user.studentId, iat: issuedAtMs, exp: issuedAtMs + sessionSeconds * 1000 }, sessionSecret);
      sendJson(response, 200, {
        name: user.name,
        studentId: user.role === "admin" ? "" : user.studentId,
        role: user.role,
        access: user.role === "admin" ? Object.keys(config.exams) : user.grants.slice(),
        issuedAt: new Date(issuedAtMs).toISOString()
      }, { "Set-Cookie": security.sessionCookie(token, { name: cookieName, secure: cookieSecure, maxAgeSeconds: sessionSeconds }) });
      return true;
    }

    let match = pathname.match(/^\/admin\/exam-drafts\/([^/]+)\/scope$/);
    if (match) {
      requireAdmin(currentUser(request, loadConfig, sessionSecret, cookieName, now));
      if (request.method !== "POST") throw new HttpError(405, "허용되지 않은 요청입니다.");
      const record = await draftStore.get(decodeURIComponent(match[1]));
      if (!record) throw new HttpError(404, "시험 초안을 찾을 수 없습니다.");
      const cleanRecord = publicDraft(record);
      const body = await readJson(request, 64 * 1024);
      const changed = draftCore.changeDraftScope(cleanRecord.draft, cleanRecord.placements, body.scope);
      const next = { draft: changed.draft, placements: changed.placements };
      await draftStore.save(next); sendJson(response, 200, publicDraft(next)); return true;
    }

    match = pathname.match(/^\/admin\/exam-drafts\/([^/]+)\/placements\/([^/]+)\/replace$/);
    if (match) {
      const context = requireAdmin(currentUser(request, loadConfig, sessionSecret, cookieName, now));
      if (request.method !== "POST") throw new HttpError(405, "허용되지 않은 요청입니다.");
      const record = await draftStore.get(decodeURIComponent(match[1]));
      if (!record) throw new HttpError(404, "시험 초안을 찾을 수 없습니다.");
      const cleanRecord = publicDraft(record);
      const placementId = decodeURIComponent(match[2]);
      const placement = cleanRecord.placements.find(function (item) { return item.id === placementId; });
      if (!placement) throw new HttpError(404, "배치를 찾을 수 없습니다.");
      const body = await readJson(request, 32 * 1024);
      const configuredCandidates = (context.config.examDraftCandidates || []).filter(function (candidate) { return candidate.mode === cleanRecord.draft.mode; });
      const candidate = configuredCandidates.find(function (item) { return item.itemId === String(body.itemId || ""); });
      if (!candidate) throw new HttpError(404, "검증된 후보를 찾을 수 없습니다.");
      if (cleanRecord.placements.some(function (item) { return item.id !== placementId && item.item.itemId === candidate.itemId; })) throw new HttpError(409, "같은 후보가 이미 다른 배치에 있습니다.");
      const replaced = draftCore.replacePlacement(cleanRecord.draft, placement, candidate, {
        reasonCode: body.reasonCode, sameFamily: body.sameFamily, sameDetailType: body.sameDetailType, sameCoreConditions: body.sameCoreConditions,
        sameSolutionStructure: body.sameSolutionStructure, difficultyReviewed: body.difficultyReviewed, reviewer: bankCore.WRITER
      });
      const next = { draft: cleanRecord.draft, placements: cleanRecord.placements.map(function (item) { return item.id === placementId ? replaced : item; }) };
      await draftStore.save(next); sendJson(response, 200, publicDraft(next)); return true;
    }

    match = pathname.match(/^\/admin\/exam-drafts\/([^/]+)\/placements\/batch$/);
    if (match) {
      const context = requireAdmin(currentUser(request, loadConfig, sessionSecret, cookieName, now));
      if (request.method !== "POST") throw new HttpError(405, "허용되지 않은 요청입니다.");
      const record = await draftStore.get(decodeURIComponent(match[1]));
      if (!record) throw new HttpError(404, "시험 초안을 찾을 수 없습니다.");
      const cleanRecord = publicDraft(record);
      const body = await readJson(request, 64 * 1024);
      if (!Array.isArray(body.itemIds) || body.itemIds.length < 1 || body.itemIds.length > 100) throw new HttpError(400, "추가할 후보 목록이 올바르지 않습니다.");
      const itemIds = body.itemIds.map(function (itemId) { return String(itemId || ""); });
      if (new Set(itemIds).size !== itemIds.length) throw new HttpError(400, "같은 후보를 한 번만 선택해 주세요.");
      const configuredCandidates = (context.config.examDraftCandidates || []).filter(function (candidate) { return candidate.mode === cleanRecord.draft.mode; });
      let placements = cleanRecord.placements;
      itemIds.forEach(function (itemId) {
        const candidate = configuredCandidates.find(function (item) { return item.itemId === itemId; });
        if (!candidate) throw new HttpError(404, "검증된 후보를 찾을 수 없습니다.");
        placements = draftCore.appendPlacement(cleanRecord.draft, placements, candidate, body.points);
      });
      const next = { draft: cleanRecord.draft, placements };
      await draftStore.save(next); sendJson(response, 200, publicDraft(next)); return true;
    }

    match = pathname.match(/^\/admin\/exam-drafts(?:\/([^/]+))?(?:\/(candidates|placements))?$/);
    if (match) {
      const context = requireAdmin(currentUser(request, loadConfig, sessionSecret, cookieName, now));
      const draftId = match[1] ? decodeURIComponent(match[1]) : "";
      const action = match[2] || "";
      if (!draftId && !action && request.method === "GET") {
        const records = await draftStore.list();
        sendJson(response, 200, records.map(function (record) { return publicDraft(record); }));
        return true;
      }
      if (!draftId && !action && request.method === "POST") {
        const body = await readJson(request, 64 * 1024);
        const mode = String(body.mode || "").toUpperCase();
        if (!bankCore.PROGRAM_MODES.includes(mode)) throw new HttpError(400, "시험 모드가 올바르지 않습니다.");
        const draft = draftCore.createExamDraft({
          id: bankCore.createNeutralId("examDraft", mode, `draft:${crypto.randomUUID()}`), mode, writer: bankCore.WRITER,
          title: body.title, scope: body.scope, status: "draft", scopeVersion: 1
        });
        const record = { draft, placements: [] };
        await draftStore.save(record);
        sendJson(response, 201, publicDraft(record));
        return true;
      }
      const record = await draftStore.get(draftId);
      if (!record) throw new HttpError(404, "시험 초안을 찾을 수 없습니다.");
      const cleanRecord = publicDraft(record);
      if (!action && request.method === "GET") { sendJson(response, 200, cleanRecord); return true; }
      const configuredCandidates = (context.config.examDraftCandidates || []).filter(function (candidate) { return candidate.mode === cleanRecord.draft.mode; });
      if (action === "candidates" && request.method === "GET") {
        const candidates = candidateQuery.queryCandidates(cleanRecord.draft, configuredCandidates, {
          sort: url.searchParams.get("sort") || "item_id", pathKey: url.searchParams.get("pathKey"), difficultyBand: url.searchParams.get("difficultyBand"),
          responseType: url.searchParams.get("responseType"), typeId: url.searchParams.get("typeId")
        });
        sendJson(response, 200, { candidates, facets: candidateQuery.candidateFacets(cleanRecord.draft, configuredCandidates) });
        return true;
      }
      if (action === "placements" && request.method === "POST") {
        const body = await readJson(request, 32 * 1024);
        const itemId = String(body.itemId || "");
        const candidate = configuredCandidates.find(function (item) { return item.itemId === itemId; });
        if (!candidate) throw new HttpError(404, "검증된 후보를 찾을 수 없습니다.");
        const placements = draftCore.appendPlacement(cleanRecord.draft, cleanRecord.placements, candidate, body.points);
        const next = { draft: cleanRecord.draft, placements };
        await draftStore.save(next); sendJson(response, 200, publicDraft(next)); return true;
      }
      throw new HttpError(405, "허용되지 않은 요청입니다.");
    }

    match = pathname.match(/^\/admin\/exam-drafts\/([^/]+)\/placements\/([^/]+)$/);
    if (match) {
      requireAdmin(currentUser(request, loadConfig, sessionSecret, cookieName, now));
      if (request.method !== "DELETE") throw new HttpError(405, "허용되지 않은 요청입니다.");
      const record = await draftStore.get(decodeURIComponent(match[1]));
      if (!record) throw new HttpError(404, "시험 초안을 찾을 수 없습니다.");
      const cleanRecord = publicDraft(record);
      const next = { draft: cleanRecord.draft, placements: draftCore.removePlacement(cleanRecord.draft, cleanRecord.placements, decodeURIComponent(match[2])) };
      await draftStore.save(next); sendJson(response, 200, publicDraft(next)); return true;
    }

    match = pathname.match(/^\/admin\/exam-drafts\/([^/]+)\/reorder$/);
    if (match) {
      requireAdmin(currentUser(request, loadConfig, sessionSecret, cookieName, now));
      if (request.method !== "POST") throw new HttpError(405, "허용되지 않은 요청입니다.");
      const body = await readJson(request, 32 * 1024); const record = await draftStore.get(decodeURIComponent(match[1]));
      if (!record) throw new HttpError(404, "시험 초안을 찾을 수 없습니다.");
      const cleanRecord = publicDraft(record);
      const next = { draft: cleanRecord.draft, placements: draftCore.reorderPlacements(cleanRecord.draft, cleanRecord.placements, body.placementIds) };
      await draftStore.save(next); sendJson(response, 200, publicDraft(next)); return true;
    }

    match = pathname.match(/^\/exams\/([^/]+)\/(pages|response-schema|attempts)$/);
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
