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
const reviewStoreModule = require("./review-store.js");
const reviewSecurity = require("../shared/review-security.js");
const releaseGate = require("../shared/sh-r01-release-gate.js");
const reviewInventory = require("../data/review-only/sh-r01-inventory.js").inventory;
const selectionTracks = require("../data/selection-tracks.js");
const questionBankCore = require("../data/question-bank-core.js");
const practiceCore = require("../data/practice-bank-core.js");
const practicePlanner = require("../shared/practice-set-planner.js");
const practiceRegistryModule = require("./practice-registry.js");
const practiceStoreModule = require("./practice-store.js");
const practiceAssetsModule = require("./practice-assets.js");
const examEditorCore = require("../data/exam-editor-core.js");
const examEditorRegistryModule = require("./exam-editor-registry.js");
const examDraftStoreModule = require("./exam-draft-store.js");

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
  ".webp": "image/webp",
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

function publicReview(review) {
  const packet = {
    examId: review.examId,
    roundCode: review.roundCode,
    reviewVersion: review.reviewVersion,
    examChecks: Object.assign({}, review.examChecks),
    items: review.items.map(function (item) {
      return {
        itemId: item.itemId,
        number: item.number,
        answerStatus: item.answerStatus,
        classificationStatus: item.classificationStatus,
        visualStatus: item.visualStatus,
        sourceFingerprintMatched: item.sourceFingerprintMatched,
        correctionArtifactMatched: item.correctionArtifactMatched,
        resolutionStatus: item.resolutionStatus
      };
    })
  };
  if (review.finalConfirmation) {
    packet.finalConfirmation = {
      examId: review.finalConfirmation.examId,
      roundCode: review.finalConfirmation.roundCode,
      reviewVersion: review.finalConfirmation.reviewVersion,
      confirmation: review.finalConfirmation.confirmation,
      itemCount: review.finalConfirmation.itemCount,
      activeItemCount: review.finalConfirmation.activeItemCount,
      excludedItemCount: review.finalConfirmation.excludedItemCount
    };
  }
  return packet;
}

function exactKeys(value, allowed, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new HttpError(400, `${label} 형식이 올바르지 않습니다.`);
  const unknown = Object.keys(value).filter(function (key) { return !allowed.has(key); });
  if (unknown.length) throw new HttpError(400, `${label}에 허용되지 않은 항목이 있습니다.`);
}

function reviewExamProfile(privateExam, contract) {
  return {
    id: contract.examId,
    questionCount: contract.questionCount,
    pageCount: contract.pageCount,
    sourceStatus: privateExam.sourceStatus,
    answerStatus: privateExam.answerStatus,
    classificationStatus: privateExam.classificationStatus,
    releaseStatus: privateExam.releaseStatus,
    assetPolicy: privateExam.assetPolicy
  };
}

function evidenceExtension(mimeType) {
  return ({ "image/png": ".png", "image/jpeg": ".jpg", "image/webp": ".webp" })[mimeType] || "";
}

function practiceSignatureInput(record, item, asset, subject, expires) {
  return {
    subject,
    examId: `practice:${record.practiceSetId}:${record.approval.decisionVersion}:${asset.assetKey}:${asset.assetRevision}`,
    pageNumber: item.position,
    expires
  };
}

function validImageMagic(buffer, mimeType) {
  if (mimeType === "image/png") return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (mimeType === "image/jpeg") return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (mimeType === "image/webp") return buffer.length >= 12 && buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
  return false;
}

async function readVerifiedPracticeAsset(asset) {
  if (!asset) return null;
  let handle;
  try {
    handle = await fs.promises.open(asset.assetPath, "r");
    const stat = await handle.stat();
    if (!stat.isFile() || stat.size < 3 || stat.size > 25 * 1024 * 1024) return null;
    const buffer = await handle.readFile();
    if (!validImageMagic(buffer, asset.mimeType)) return null;
    const digest = Buffer.from(await crypto.webcrypto.subtle.digest("SHA-256", buffer)).toString("hex");
    return asset.assetRevision === `sha256:${digest}` ? buffer : null;
  } catch (_) {
    return null;
  } finally {
    if (handle) { try { await handle.close(); } catch (_) {} }
  }
}

function reviewSignatureInput(review, item, panel, subject, expires) {
  return {
    subject,
    examId: `review:${review.examId}:${review.reviewVersion}:${panel.role}`,
    pageNumber: item.number,
    expires
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
  const reviewStore = opts.reviewStore || reviewStoreModule.createStore({ data: opts.privateReviews, filePath: opts.privateReviewPath });
  const loadPracticeMode = opts.loadPracticeMode || practiceRegistryModule.createLoader({
    data: opts.privatePracticeRegistry,
    filePath: opts.privatePracticeRegistryPath
  });
  const practiceStore = opts.practiceStore || practiceStoreModule.createStore({
    data: opts.privatePracticeStore,
    filePath: opts.privatePracticeStorePath
  });
  const loadPracticeAsset = opts.loadPracticeAsset || practiceAssetsModule.createLoader({
    data: opts.privatePracticeAssets,
    filePath: opts.privatePracticeAssetsPath
  });
  const loadExamEditorRegistry = opts.loadExamEditorRegistry || examEditorRegistryModule.createLoader({
    data: opts.privateExamEditorRegistry,
    filePath: opts.privateExamEditorRegistryPath
  });
  const examDraftStore = opts.examDraftStore || examDraftStoreModule.createStore({
    data: opts.privateExamDrafts,
    filePath: opts.privateExamDraftsPath
  });
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

  function readReview(examId) {
    if (!reviewStore) throw new HttpError(503, "비공개 시험 검수 저장소가 연결되지 않았습니다.");
    const state = reviewStore.read(examId);
    if (!state) throw new HttpError(404, "시험 검수 상태를 찾을 수 없습니다.");
    return state;
  }

  function persistReview(examId, mutate) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const current = readReview(examId);
      try {
        const saved = reviewStore.update(examId, current.revision, mutate);
        if (!saved) throw new HttpError(404, "시험 검수 상태를 찾을 수 없습니다.");
        return saved.review;
      } catch (error) {
        if (error && (error.code === "REVIEW_BUSY" || error.code === "REVIEW_CONFLICT")) continue;
        throw error;
      }
    }
    throw new HttpError(409, "시험 검수 상태가 동시에 변경되었습니다. 새로고침 후 다시 시도해 주세요.");
  }

  function requirePracticeInfrastructure() {
    if (!loadPracticeMode || !practiceStore) throw new HttpError(503, "비공개 반복연습 저장소가 연결되지 않았습니다.");
  }

  function requireExamEditorInfrastructure() {
    if (!loadExamEditorRegistry || !examDraftStore) throw new HttpError(503, "비공개 시험지 편집 저장소가 연결되지 않았습니다.");
    let registry;
    try { registry = loadExamEditorRegistry(); }
    catch (_) { throw new HttpError(503, "검수된 시험지 후보 목록을 확인해 주세요."); }
    if (!registry) throw new HttpError(503, "검수된 시험지 후보 목록이 연결되지 않았습니다.");
    return registry;
  }

  function publicEditorCandidate(entry) {
    const candidate = entry.candidate;
    const result = {
      itemId: candidate.id,
      itemVersionId: candidate.itemVersionId,
      curriculumPath: candidate.curriculum.key,
      typeCode: candidate.typeCode,
      difficultyBand: candidate.difficultyBand,
      inputType: candidate.inputType,
      figureRequired: candidate.figureAudit.required === true,
      eligible: true
    };
    if (entry.relation) {
      result.replacement = {
        evidenceId: entry.relation.evidenceId,
        relationship: entry.relation.relationship
      };
    }
    return result;
  }

  function publicExamDraft(record) {
    return {
      draftId: record.draftId,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      draft: record.draft
    };
  }

  function publicExamDraftSummary(record) {
    return {
      draftId: record.draftId,
      profileId: record.draft.profileId,
      targetId: record.draft.targetId,
      durationMinutes: record.draft.durationMinutes,
      scopeKeys: record.draft.scopeKeys,
      revision: record.draft.revision,
      itemCount: record.draft.placements.length,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    };
  }

  function editorMetadata(draft, registry) {
    return Object.fromEntries(draft.placements.map(function (placement) {
      return [placement.itemId, registry.getCandidate(placement.itemId, placement.itemVersionId)];
    }).filter(function (entry) { return Boolean(entry[1]); }));
  }

  function editorCandidate(registry, itemId, itemVersionId) {
    const candidate = registry.getCandidate(itemId, itemVersionId);
    if (!candidate) throw new HttpError(404, "현재 버전의 검수된 문항 후보를 찾을 수 없습니다.");
    return candidate;
  }

  function applyEditorOperation(draft, operation, registry) {
    if (!operation || typeof operation !== "object" || Array.isArray(operation)) throw new HttpError(400, "시험지 편집 작업 형식이 올바르지 않습니다.");
    const kind = security.clean(operation.kind);
    const operationFields = {
      add: new Set(["kind", "placementId", "itemId", "itemVersionId", "index", "score", "locked", "selectionKind"]),
      remove: new Set(["kind", "placementId"]),
      move: new Set(["kind", "placementId", "toIndex"]),
      replace: new Set(["kind", "placementId", "itemId", "itemVersionId", "relationship", "reasonCode", "evidenceId"]),
      change_scope: new Set(["kind", "scopeKeys"]),
      sort: new Set(["kind", "mode", "seed"]),
      set_view: new Set(["kind", "viewMode"])
    };
    if (!operationFields[kind]) throw new HttpError(400, "지원하지 않는 시험지 편집 작업입니다.");
    exactKeys(operation, operationFields[kind], "시험지 편집 작업");
    try {
      if (kind === "add") {
        if (!operation.placementId || !["manual", "recommended"].includes(operation.selectionKind || "manual")) {
          throw new HttpError(400, "문항 추가 정보가 올바르지 않습니다.");
        }
        return { draft: examEditorCore.addItem(draft, {
          placementId: security.clean(operation.placementId),
          candidate: editorCandidate(registry, operation.itemId, operation.itemVersionId),
          questionsByItemId: editorMetadata(draft, registry),
          index: operation.index,
          score: operation.score,
          locked: operation.locked,
          selectionKind: operation.selectionKind || "manual"
        }), reconciliation: null };
      }
      if (kind === "remove") {
        return { draft: examEditorCore.removePlacement(draft, security.clean(operation.placementId)), reconciliation: null };
      }
      if (kind === "move") {
        return { draft: examEditorCore.movePlacement(draft, security.clean(operation.placementId), operation.toIndex), reconciliation: null };
      }
      if (kind === "replace") {
        const relationship = security.clean(operation.relationship || "manual");
        let evidence = null;
        if (relationship !== "manual") {
          evidence = registry.getReplacementEvidence(operation.evidenceId);
          if (!evidence) throw new HttpError(409, "현재 문항과 후보 문항의 검수된 교체 근거를 찾을 수 없습니다.");
        } else if (operation.evidenceId != null) {
          throw new HttpError(400, "직접 교체에는 유사문항 근거를 지정할 수 없습니다.");
        }
        return { draft: examEditorCore.replacePlacement(draft, {
          placementId: security.clean(operation.placementId),
          candidate: editorCandidate(registry, operation.itemId, operation.itemVersionId),
          questionsByItemId: editorMetadata(draft, registry),
          relationship,
          reasonCode: security.clean(operation.reasonCode || "user_selected"),
          replacementEvidence: evidence
        }), reconciliation: null };
      }
      if (kind === "change_scope") {
        const result = examEditorCore.changeScope(draft, operation.scopeKeys, editorMetadata(draft, registry));
        return { draft: result.draft, reconciliation: result.reconciliation };
      }
      if (kind === "sort") {
        return {
          draft: examEditorCore.sortPlacements(draft, operation.mode, editorMetadata(draft, registry), { seed: operation.seed }),
          reconciliation: null
        };
      }
      if (kind === "set_view") {
        return { draft: examEditorCore.setViewMode(draft, operation.viewMode), reconciliation: null };
      }
      throw new HttpError(400, "지원하지 않는 시험지 편집 작업입니다.");
    } catch (error) {
      if (error instanceof HttpError) throw error;
      if (error instanceof TypeError) throw new HttpError(409, "현재 시험지 상태와 편집 조건이 일치하지 않습니다.");
      throw error;
    }
  }

  function requireStudentPracticeMode(context, mode) {
    if (context.user.role !== "student") throw new HttpError(403, "학생 계정에서만 반복연습을 계획할 수 있습니다.");
    const allowed = context.user.grants.some(function (examId) {
      const exam = contracts.getExamContract(examId);
      const privateExam = context.config.exams[examId];
      return exam && exam.programCode === mode && privateExam && privateConfig.isReleased(privateExam);
    });
    if (!allowed) throw new HttpError(403, "이 과정의 반복연습 승인이 필요합니다.");
  }

  function practiceLearnerId(studentId, mode) {
    const subject = security.opaqueSubject(studentId, sessionSecret);
    return questionBankCore.createNeutralId("learner", mode, `student:${subject}`);
  }

  function practicePlanTime() {
    return `${new Date(now()).toISOString().slice(0, 10)}T00:00:00.000Z`;
  }

  function readPracticeSet(practiceSetId) {
    requirePracticeInfrastructure();
    const state = practiceStore.read(practiceSetId);
    if (!state) throw new HttpError(404, "반복연습 계획을 찾을 수 없습니다.");
    return state;
  }

  function persistPracticeSet(practiceSetId, mutate) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const current = readPracticeSet(practiceSetId);
      try {
        const saved = practiceStore.update(practiceSetId, current.revision, mutate);
        if (!saved) throw new HttpError(404, "반복연습 계획을 찾을 수 없습니다.");
        return saved.record;
      } catch (error) {
        if (error && (error.code === "PRACTICE_BUSY" || error.code === "PRACTICE_CONFLICT")) continue;
        throw error;
      }
    }
    throw new HttpError(409, "반복연습 계획이 동시에 변경되었습니다. 새로고침 후 다시 시도해 주세요.");
  }

  function requireCurrentPracticePlan(record) {
    const registry = loadPracticeMode(record.plan.mode);
    if (!registry) throw new HttpError(423, "이 과정의 검수된 반복연습 문항이 더 이상 준비되어 있지 않습니다.");
    let rebuilt;
    try {
      rebuilt = practicePlanner.buildPracticeSetPlan({
        mode: record.plan.mode,
        learnerId: record.plan.learnerId,
        policy: registry.policy,
        candidates: registry.candidates,
        history: [],
        asOf: record.plan.plannedAt
      });
    } catch (_) {
      throw new HttpError(503, "검수된 반복연습 문항 구성을 확인해 주세요.");
    }
    const storedBase = JSON.parse(JSON.stringify(record.plan));
    if (storedBase.releaseStatus === "released") {
      storedBase.releaseStatus = "approval_required";
      delete storedBase.approval;
    }
    if (JSON.stringify(rebuilt) !== JSON.stringify(storedBase)) {
      throw new HttpError(409, "반복연습 문항 구성이 계획 이후 변경되어 다시 계획해야 합니다.");
    }
    return rebuilt;
  }

  async function api(request, response, pathname, url) {
    if (request.method === "GET" && pathname === "/selection-tracks") {
      sendJson(response, 200, selectionTracks.trackDefinitions.map(function (track) {
        return {
          trackId: track.id,
          label: track.label,
          targetStage: track.targetStage,
          admissionKind: track.admissionKind
        };
      }));
      return true;
    }

    const programTracksMatch = pathname.match(/^\/programs\/([^/]+)\/selection-tracks$/);
    if (request.method === "GET" && programTracksMatch) {
      const programCode = decodeURIComponent(programTracksMatch[1]).trim().toUpperCase();
      const bindings = selectionTracks.getProgramTracks(programCode);
      if (!bindings.length) throw new HttpError(404, "선발 과정 정보를 찾을 수 없습니다.");
      sendJson(response, 200, {
        programCode,
        tracks: bindings.map(function (binding) {
          return {
            trackId: binding.trackId,
            scopeKey: binding.scopeKey,
            scopeLabel: binding.scopeLabel,
            evidenceStatus: binding.evidenceStatus
          };
        })
      });
      return true;
    }

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

    if (request.method === "POST" && pathname === "/practice-sets/plan") {
      requirePracticeInfrastructure();
      const context = currentUser(request, loadConfig, sessionSecret, cookieName, now);
      const body = await readJson(request, 16 * 1024);
      exactKeys(body, new Set(["mode"]), "반복연습 계획");
      const mode = String(body.mode == null ? "" : body.mode).trim().toUpperCase();
      if (!questionBankCore.PROGRAM_MODES.includes(mode)) throw new HttpError(400, "반복연습 과정 코드가 올바르지 않습니다.");
      requireStudentPracticeMode(context, mode);
      const registry = loadPracticeMode(mode);
      if (!registry) throw new HttpError(423, "이 과정의 검수된 반복연습 문항이 아직 준비되지 않았습니다.");
      const learnerId = practiceLearnerId(context.user.studentId, mode);
      let plan;
      try {
        plan = practicePlanner.buildPracticeSetPlan({
          mode,
          learnerId,
          policy: registry.policy,
          candidates: registry.candidates,
          history: [],
          asOf: practicePlanTime()
        });
        practiceCore.assertPracticeMetadataOnly(plan);
      } catch (_) {
        throw new HttpError(503, "검수된 반복연습 문항 구성을 확인해 주세요.");
      }
      let stored;
      try {
        stored = practiceStore.put({ practiceSetId: plan.id, studentId: context.user.studentId, plan, approval: null }).record;
      } catch (error) {
        if (error && (error.code === "PRACTICE_BUSY" || error.code === "PRACTICE_CONFLICT")) {
          throw new HttpError(409, "반복연습 계획이 동시에 변경되었습니다. 다시 시도해 주세요.");
        }
        throw error;
      }
      sendJson(response, 201, stored.plan);
      return true;
    }

    const practiceApproveMatch = pathname.match(/^\/practice-sets\/([^/]+)\/approve$/);
    if (request.method === "POST" && practiceApproveMatch) {
      requirePracticeInfrastructure();
      const context = requireAdmin(currentUser(request, loadConfig, sessionSecret, cookieName, now));
      requireAdminMutation(request, true, configuredOrigin);
      const practiceSetId = decodeURIComponent(practiceApproveMatch[1]);
      const body = await readJson(request, 16 * 1024);
      exactKeys(body, new Set(["decisionVersion"]), "반복연습 승인");
      const decisionVersion = Number(body.decisionVersion);
      if (!Number.isSafeInteger(decisionVersion) || decisionVersion < 1) throw new HttpError(400, "반복연습 승인 버전이 올바르지 않습니다.");
      const current = readPracticeSet(practiceSetId).record;
      if (current.plan.learnerId !== practiceLearnerId(current.studentId, current.plan.mode)) {
        throw new HttpError(409, "반복연습 계획의 학생 결속 정보를 확인할 수 없습니다.");
      }
      const owner = context.config.students.find(function (student) { return student.studentId === current.studentId; });
      const ownerStillAuthorized = owner && owner.role === "student" && !privateConfig.isStudentExpired(owner, now()) && owner.grants.some(function (examId) {
        const exam = contracts.getExamContract(examId);
        const privateExam = context.config.exams[examId];
        return exam && exam.programCode === current.plan.mode && privateExam && privateConfig.isReleased(privateExam);
      });
      if (!ownerStillAuthorized) throw new HttpError(409, "학생의 현재 과정 승인을 확인할 수 없습니다.");
      if (current.plan.releaseStatus === "blocked") throw new HttpError(423, "차단된 반복연습 계획은 승인할 수 없습니다.");
      if (current.plan.releaseStatus === "released") {
        if (!current.approval || current.approval.decisionVersion !== decisionVersion) throw new HttpError(409, "이미 다른 승인 버전으로 확정된 반복연습 계획입니다.");
        sendJson(response, 200, current.plan);
        return true;
      }
      requireCurrentPracticePlan(current);
      const approvalId = questionBankCore.createNeutralId("approval", current.plan.mode, `practice:${practiceSetId}:${decisionVersion}`);
      let released;
      try {
        released = practicePlanner.releasePracticeSet(current.plan, {
          id: approvalId,
          practiceSetId,
          status: "approved",
          decisionVersion
        });
      } catch (_) {
        throw new HttpError(409, "반복연습 계획의 승인 조건이 일치하지 않습니다.");
      }
      const saved = persistPracticeSet(practiceSetId, function (record) {
        if (record.plan.releaseStatus !== "approval_required") return record;
        return {
          practiceSetId: record.practiceSetId,
          studentId: record.studentId,
          plan: released,
          approval: {
            approvalId,
            decisionVersion,
            approvedAt: new Date(now()).toISOString(),
            approvedBy: context.user.studentId
          }
        };
      });
      if (saved.plan.releaseStatus !== "released" || !saved.approval || saved.approval.decisionVersion !== decisionVersion) {
        throw new HttpError(409, "반복연습 계획의 승인 상태가 변경되었습니다.");
      }
      sendJson(response, 200, saved.plan);
      return true;
    }

    const practiceDeliveryMatch = pathname.match(/^\/practice-sets\/([^/]+)\/(pages|attempts)$/);
    if (practiceDeliveryMatch) {
      const context = currentUser(request, loadConfig, sessionSecret, cookieName, now);
      const practiceSetId = decodeURIComponent(practiceDeliveryMatch[1]);
      const action = practiceDeliveryMatch[2];
      const record = readPracticeSet(practiceSetId).record;
      if (context.user.role !== "student" || record.studentId !== context.user.studentId) throw new HttpError(404, "반복연습 계획을 찾을 수 없습니다.");
      if (record.plan.learnerId !== practiceLearnerId(record.studentId, record.plan.mode)) throw new HttpError(409, "반복연습 계획의 학생 결속 정보를 확인할 수 없습니다.");
      requireStudentPracticeMode(context, record.plan.mode);
      if (record.plan.releaseStatus !== "released" || !record.approval) throw new HttpError(423, "관리자 승인이 끝난 반복연습 계획만 열 수 있습니다.");
      requireCurrentPracticePlan(record);
      if (action === "pages" && request.method === "GET") {
        if (!loadPracticeAsset) throw new HttpError(423, "검수된 반복연습 페이지 자산이 아직 연결되지 않았습니다.");
        const expires = Math.floor(now() / 1000) + assetTtlSeconds;
        const subject = security.opaqueSubject(context.user.studentId, assetSecret);
        const origin = publicOrigin(request, configuredOrigin);
        const pages = [];
        for (const item of record.plan.items) {
          const asset = loadPracticeAsset(item.questionId);
          if (!await readVerifiedPracticeAsset(asset)) {
            throw new HttpError(423, "검수된 반복연습 페이지 자산이 완전하지 않습니다.");
          }
          const extension = evidenceExtension(asset.mimeType);
          if (!extension) throw new HttpError(423, "검수된 반복연습 페이지 형식이 올바르지 않습니다.");
          const signature = security.signPageAsset(practiceSignatureInput(record, item, asset, subject, expires), assetSecret);
          pages.push({
            number: item.position,
            url: `${origin}/practice-assets/${encodeURIComponent(record.practiceSetId)}/item-${String(item.position).padStart(3, "0")}${extension}?sub=${subject}&exp=${expires}&dv=${record.approval.decisionVersion}&sig=${encodeURIComponent(signature)}`,
            mimeType: asset.mimeType
          });
        }
        sendJson(response, 200, {
          practiceSetId: record.practiceSetId,
          learnerId: record.plan.learnerId,
          expiresAt: new Date(expires * 1000).toISOString(),
          pages
        });
        return true;
      }
      if (action === "attempts" && request.method === "POST") {
        throw new HttpError(423, "검수된 반복연습 채점 구성이 아직 연결되지 않았습니다.");
      }
      throw new HttpError(405, "허용되지 않은 요청입니다.");
    }

    if (request.method === "GET" && pathname === "/admin/exam-editor/candidates") {
      requireAdmin(currentUser(request, loadConfig, sessionSecret, cookieName, now));
      const registry = requireExamEditorInfrastructure();
      const allowedSearchKeys = new Set(["scopeKey", "q", "limit", "sourceItemId", "sourceItemVersionId", "relationship"]);
      for (const key of url.searchParams.keys()) {
        if (!allowedSearchKeys.has(key)) throw new HttpError(400, "후보 검색 조건에 허용되지 않은 항목이 있습니다.");
      }
      const limitText = url.searchParams.get("limit");
      const limit = limitText == null ? 30 : Number(limitText);
      if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) throw new HttpError(400, "후보 검색 개수가 올바르지 않습니다.");
      const relationship = security.clean(url.searchParams.get("relationship"));
      const sourceItemId = security.clean(url.searchParams.get("sourceItemId"));
      const sourceItemVersionId = security.clean(url.searchParams.get("sourceItemVersionId"));
      if (relationship && !["twin", "similar"].includes(relationship)) throw new HttpError(400, "유사문항 관계가 올바르지 않습니다.");
      if ((relationship || sourceItemId || sourceItemVersionId) && (!relationship || !sourceItemId || !sourceItemVersionId)) {
        throw new HttpError(400, "유사문항 검색에는 원문 문항과 버전, 관계가 모두 필요합니다.");
      }
      const items = registry.search({
        scopeKey: url.searchParams.get("scopeKey"),
        query: url.searchParams.get("q"),
        limit,
        sourceItemId,
        sourceItemVersionId,
        relationship
      }).map(publicEditorCandidate);
      sendJson(response, 200, { items, count: items.length });
      return true;
    }

    if (pathname === "/admin/exam-editor/drafts" && request.method === "GET") {
      requireAdmin(currentUser(request, loadConfig, sessionSecret, cookieName, now));
      requireExamEditorInfrastructure();
      const items = examDraftStore.list().map(publicExamDraftSummary).sort(function (left, right) {
        return right.updatedAt.localeCompare(left.updatedAt) || left.draftId.localeCompare(right.draftId);
      });
      sendJson(response, 200, { items, count: items.length });
      return true;
    }

    if (pathname === "/admin/exam-editor/drafts" && request.method === "POST") {
      const context = requireAdmin(currentUser(request, loadConfig, sessionSecret, cookieName, now));
      requireAdminMutation(request, true, configuredOrigin);
      requireExamEditorInfrastructure();
      const body = await readJson(request, 32 * 1024);
      exactKeys(body, new Set(["profileId", "targetId", "durationMinutes", "scopeKeys"]), "시험지 초안");
      const draftId = `draft_${crypto.randomUUID().replace(/-/g, "")}`;
      let draft;
      try {
        draft = examEditorCore.createDraft({
          draftId,
          profileId: security.clean(body.profileId),
          targetId: security.clean(body.targetId),
          durationMinutes: body.durationMinutes,
          scopeKeys: body.scopeKeys,
          placements: []
        });
      } catch (_) {
        throw new HttpError(400, "시험지 초안 설정이 올바르지 않습니다.");
      }
      const timestamp = new Date(now()).toISOString();
      let record;
      try {
        record = examDraftStore.create({
          draftId,
          createdBy: context.user.studentId,
          updatedBy: context.user.studentId,
          createdAt: timestamp,
          updatedAt: timestamp,
          draft
        });
      } catch (error) {
        if (error && (error.code === "EXAM_DRAFT_BUSY" || error.code === "EXAM_DRAFT_CONFLICT")) {
          throw new HttpError(409, "시험지 초안이 동시에 변경되었습니다. 다시 시도해 주세요.");
        }
        throw error;
      }
      sendJson(response, 201, publicExamDraft(record));
      return true;
    }

    const editorDraftMatch = pathname.match(/^\/admin\/exam-editor\/drafts\/([^/]+)(?:\/(readiness))?$/);
    if (editorDraftMatch) {
      const context = requireAdmin(currentUser(request, loadConfig, sessionSecret, cookieName, now));
      const registry = requireExamEditorInfrastructure();
      const draftId = decodeURIComponent(editorDraftMatch[1]);
      const action = editorDraftMatch[2] || "draft";
      const current = examDraftStore.read(draftId);
      if (!current) throw new HttpError(404, "시험지 초안을 찾을 수 없습니다.");
      if (request.method === "GET" && action === "draft") {
        sendJson(response, 200, publicExamDraft(current));
        return true;
      }
      if (request.method === "GET" && action === "readiness") {
        const readiness = examEditorCore.evaluateDraftReadiness(current.draft, editorMetadata(current.draft, registry));
        sendJson(response, 200, {
          draftId: current.draftId,
          revision: current.draft.revision,
          eligible: readiness.eligible,
          issues: readiness.issues,
          projection: readiness.projection
        });
        return true;
      }
      if (request.method === "PATCH" && action === "draft") {
        requireAdminMutation(request, true, configuredOrigin);
        const body = await readJson(request, 32 * 1024);
        exactKeys(body, new Set(["expectedRevision", "operation"]), "시험지 편집 요청");
        const expectedRevision = Number(body.expectedRevision);
        if (!Number.isSafeInteger(expectedRevision) || expectedRevision < 1) throw new HttpError(400, "시험지 편집 버전이 올바르지 않습니다.");
        let reconciliation = null;
        let record;
        try {
          record = examDraftStore.update(draftId, expectedRevision, function (latest) {
            const applied = applyEditorOperation(latest.draft, body.operation, registry);
            reconciliation = applied.reconciliation;
            latest.updatedBy = context.user.studentId;
            latest.updatedAt = new Date(now()).toISOString();
            latest.draft = applied.draft;
            return latest;
          });
        } catch (error) {
          if (error instanceof HttpError) throw error;
          if (error && (error.code === "EXAM_DRAFT_BUSY" || error.code === "EXAM_DRAFT_CONFLICT")) {
            throw new HttpError(409, "시험지 초안이 다른 화면에서 변경되었습니다. 새로고침 후 다시 시도해 주세요.");
          }
          throw error;
        }
        if (!record) throw new HttpError(404, "시험지 초안을 찾을 수 없습니다.");
        sendJson(response, 200, { record: publicExamDraft(record), reconciliation });
        return true;
      }
      throw new HttpError(405, "허용되지 않은 요청입니다.");
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

    if (pathname === `/admin/exam-reviews/${reviewSecurity.EXAM_ID}` || pathname.startsWith(`/admin/exam-reviews/${reviewSecurity.EXAM_ID}/`)) {
      const context = requireAdmin(currentUser(request, loadConfig, sessionSecret, cookieName, now));
      const examId = reviewSecurity.EXAM_ID;
      const contract = contracts.getExamContract(examId);
      const privateExam = context.config.exams[examId];
      if (!contract || !privateExam) throw new HttpError(404, "시험 검수 상태를 찾을 수 없습니다.");
      if (request.method === "GET" && pathname === `/admin/exam-reviews/${examId}`) {
        const packet = publicReview(readReview(examId).review);
        const issues = reviewSecurity.validateStatusPacket(packet, reviewInventory);
        if (issues.length) throw new HttpError(503, "시험 검수 상태의 구조가 현재 문항 목록과 일치하지 않습니다.");
        sendJson(response, 200, packet);
        return true;
      }
      const resolutionMatch = pathname.match(new RegExp(`^/admin/exam-reviews/${examId}/items/(\\d+)/resolution$`));
      if (request.method === "POST" && resolutionMatch) {
        requireAdminMutation(request, true, configuredOrigin);
        const number = Number(resolutionMatch[1]);
        const body = await readJson(request, 32 * 1024);
        exactKeys(body, new Set(["examId", "itemId", "number", "reviewVersion", "decision", "resolutionStatus"]), "문항 검수 요청");
        const current = readReview(examId).review;
        const packet = publicReview(current);
        const item = reviewInventory.items.find(function (candidate) { return candidate.number === number; });
        const status = packet.items.find(function (candidate) { return candidate.number === number; });
        if (!item || !status || body.number !== number) throw new HttpError(404, "검수 문항을 찾을 수 없습니다.");
        let expected;
        try { expected = reviewSecurity.buildResolutionRequest(packet, reviewInventory, number, body.decision); }
        catch (_) { throw new HttpError(409, "현재 검수 근거로는 이 문항을 처리할 수 없습니다."); }
        if (Object.keys(expected).some(function (key) { return body[key] !== expected[key]; })) throw new HttpError(409, "검수 버전 또는 문항 식별자가 변경되었습니다.");
        const planned = (reviewInventory.agentDecisionSummary.items || []).find(function (decision) { return decision.number === number; });
        if (body.decision === "replacement_verified" && (!planned || planned.disposition !== "replace")) {
          throw new HttpError(409, "대체 검증 대상으로 확정된 문항이 아닙니다.");
        }
        if (body.decision === "agent_verify" && planned && planned.disposition === "replace") {
          throw new HttpError(409, "이 문항은 검증된 대체 문항으로 처리해야 합니다.");
        }
        const privateItem = current.items.find(function (candidate) { return candidate.number === number; });
        if (body.decision === "scoring_excluded" && (!privateItem || privateItem.scoringExclusionAllowed !== true)) {
          throw new HttpError(409, "검증된 채점 제외 정책에 포함되지 않은 문항입니다.");
        }
        const saved = persistReview(examId, function (review) {
          const latestPacket = publicReview(review);
          let latestExpected;
          try { latestExpected = reviewSecurity.buildResolutionRequest(latestPacket, reviewInventory, number, body.decision); }
          catch (_) { throw new HttpError(409, "현재 검수 근거로는 이 문항을 처리할 수 없습니다."); }
          if (Object.keys(latestExpected).some(function (key) { return body[key] !== latestExpected[key]; })) {
            throw new HttpError(409, "검수 버전 또는 문항 식별자가 변경되었습니다.");
          }
          const target = review.items.find(function (candidate) { return candidate.number === number; });
          if (!target || target.itemId !== body.itemId || target.resolutionStatus !== "pending") throw new HttpError(409, "문항 검수 상태가 변경되었습니다.");
          if (body.decision === "scoring_excluded" && target.scoringExclusionAllowed !== true) {
            throw new HttpError(409, "검증된 채점 제외 정책에 포함되지 않은 문항입니다.");
          }
          target.resolutionStatus = body.resolutionStatus;
          return review;
        });
        sendJson(response, 200, publicReview(saved));
        return true;
      }
      if (request.method === "POST" && pathname === `/admin/exam-reviews/${examId}/final-confirmation`) {
        requireAdminMutation(request, true, configuredOrigin);
        const body = await readJson(request, 32 * 1024);
        exactKeys(body, new Set(["examId", "roundCode", "reviewVersion", "confirmation", "itemCount", "activeItemCount", "excludedItemCount"]), "최종 확인 요청");
        const current = readReview(examId).review;
        const packet = publicReview(current);
        const examProfile = reviewExamProfile(privateExam, contract);
        if (examProfile.sourceStatus !== "audited" || examProfile.answerStatus !== "verified"
            || examProfile.classificationStatus !== "verified" || examProfile.assetPolicy !== "signed-page-images") {
          throw new HttpError(409, "원본·답안·분류·보호 자산 정책 검수가 끝나지 않았습니다.");
        }
        let expected;
        try { expected = releaseGate.buildFinalConfirmationRequest(examProfile, reviewInventory, packet); }
        catch (_) { throw new HttpError(409, "모든 문항과 시험 전체 검수가 끝나지 않았습니다."); }
        if (Object.keys(expected).some(function (key) { return body[key] !== expected[key]; })) throw new HttpError(409, "최종 확인 대상 또는 검수 버전이 변경되었습니다.");
        const saved = persistReview(examId, function (review) {
          if (review.finalConfirmation) throw new HttpError(409, "최종 확인 상태가 변경되었습니다.");
          let latestExpected;
          try { latestExpected = releaseGate.buildFinalConfirmationRequest(examProfile, reviewInventory, publicReview(review)); }
          catch (_) { throw new HttpError(409, "모든 문항과 시험 전체 검수가 끝나지 않았습니다."); }
          if (Object.keys(latestExpected).some(function (key) { return body[key] !== latestExpected[key]; })) {
            throw new HttpError(409, "최종 확인 대상 또는 검수 버전이 변경되었습니다.");
          }
          review.finalConfirmation = Object.assign({}, body, {
            confirmedAt: new Date(now()).toISOString(),
            confirmedBy: context.user.studentId
          });
          return review;
        });
        sendJson(response, 200, { ok: true, finalConfirmation: publicReview(saved).finalConfirmation });
        return true;
      }
      const evidenceMatch = pathname.match(new RegExp(`^/admin/exam-reviews/${examId}/items/(\\d+)/evidence$`));
      if (request.method === "GET" && evidenceMatch) {
        const number = Number(evidenceMatch[1]);
        const review = readReview(examId).review;
        const item = review.items.find(function (candidate) { return candidate.number === number; });
        if (!item || item.sourceFingerprintMatched !== true || item.evidencePanels.length !== 3) {
          throw new HttpError(423, "검증된 보호 근거 이미지가 준비되지 않았습니다.");
        }
        item.evidencePanels.forEach(function (panel) {
          if (!fs.existsSync(panel.assetPath) || !fs.statSync(panel.assetPath).isFile()) throw new HttpError(503, "보호 근거 이미지가 준비되지 않았습니다.");
        });
        const expires = Math.floor(now() / 1000) + assetTtlSeconds;
        const subject = security.opaqueSubject(context.user.studentId, assetSecret);
        const origin = publicOrigin(request, configuredOrigin);
        const panels = item.evidencePanels.map(function (panel) {
          const signature = security.signPageAsset(reviewSignatureInput(review, item, panel, subject, expires), assetSecret);
          return {
            role: panel.role,
            url: `${origin}/review-assets/${encodeURIComponent(examId)}/${number}/${encodeURIComponent(panel.role)}${evidenceExtension(panel.mimeType)}?sub=${subject}&exp=${expires}&rv=${encodeURIComponent(review.reviewVersion)}&sig=${encodeURIComponent(signature)}`,
            mimeType: panel.mimeType
          };
        });
        sendJson(response, 200, {
          examId, roundCode: review.roundCode, reviewVersion: review.reviewVersion,
          itemId: item.itemId, number, expiresAt: new Date(expires * 1000).toISOString(),
          sourceFingerprintMatched: true, panels
        });
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
    match = pathname.match(/^\/practice-assets\/([^/]+)\/item-(\d{3})(\.png|\.jpg|\.webp)$/);
    if (match) {
      if (request.method !== "GET" && request.method !== "HEAD") throw new HttpError(405, "허용되지 않은 요청입니다.");
      if (!loadPracticeAsset) throw new HttpError(404, "반복연습 페이지를 찾을 수 없습니다.");
      const practiceSetId = decodeURIComponent(match[1]);
      const position = Number(match[2]);
      const context = currentUser(request, loadConfig, sessionSecret, cookieName, now);
      const record = readPracticeSet(practiceSetId).record;
      if (context.user.role !== "student" || record.studentId !== context.user.studentId) throw new HttpError(404, "반복연습 페이지를 찾을 수 없습니다.");
      if (record.plan.learnerId !== practiceLearnerId(record.studentId, record.plan.mode)) throw new HttpError(409, "반복연습 계획의 학생 결속 정보를 확인할 수 없습니다.");
      requireStudentPracticeMode(context, record.plan.mode);
      if (record.plan.releaseStatus !== "released" || !record.approval) throw new HttpError(423, "관리자 승인이 끝난 반복연습 계획만 열 수 있습니다.");
      requireCurrentPracticePlan(record);
      const item = record.plan.items.find(function (candidate) { return candidate.position === position; });
      const asset = item && loadPracticeAsset(item.questionId);
      const expires = Number(url.searchParams.get("exp"));
      const subject = String(url.searchParams.get("sub") || "");
      const decisionVersion = Number(url.searchParams.get("dv"));
      const signature = String(url.searchParams.get("sig") || "");
      const currentSeconds = Math.floor(now() / 1000);
      if (!item || !asset || evidenceExtension(asset.mimeType) !== match[3]) throw new HttpError(404, "반복연습 페이지를 찾을 수 없습니다.");
      if (!Number.isInteger(expires) || expires <= currentSeconds || expires > currentSeconds + assetTtlSeconds + 5
          || decisionVersion !== record.approval.decisionVersion) {
        throw new HttpError(403, "반복연습 페이지 링크가 만료되었습니다.");
      }
      const expectedSubject = security.opaqueSubject(context.user.studentId, assetSecret);
      if (subject !== expectedSubject || !security.verifyPageAsset(practiceSignatureInput(record, item, asset, subject, expires), signature, assetSecret)) {
        throw new HttpError(403, "반복연습 페이지 서명이 올바르지 않습니다.");
      }
      const assetBytes = await readVerifiedPracticeAsset(asset);
      if (!assetBytes) throw new HttpError(404, "반복연습 페이지를 찾을 수 없습니다.");
      setSecurityHeaders(response);
      response.statusCode = 200;
      response.setHeader("Content-Type", asset.mimeType);
      response.setHeader("Cache-Control", "private, no-store");
      response.setHeader("Content-Disposition", `inline; filename="practice-item-${String(position).padStart(3, "0")}${match[3]}"`);
      if (request.method === "HEAD") response.end();
      else response.end(assetBytes);
      return true;
    }
    match = pathname.match(/^\/review-assets\/([^/]+)\/(\d+)\/(problem|source-key|independent-audit)(\.png|\.jpg|\.webp)$/);
    if (match) {
      if (request.method !== "GET" && request.method !== "HEAD") throw new HttpError(405, "허용되지 않은 요청입니다.");
      const context = requireAdmin(currentUser(request, loadConfig, sessionSecret, cookieName, now));
      const examId = decodeURIComponent(match[1]);
      const number = Number(match[2]);
      const role = match[3];
      const review = readReview(examId).review;
      const item = review.items.find(function (candidate) { return candidate.number === number; });
      const panel = item && item.evidencePanels.find(function (candidate) { return candidate.role === role; });
      const expires = Number(url.searchParams.get("exp"));
      const subject = String(url.searchParams.get("sub") || "");
      const reviewVersion = String(url.searchParams.get("rv") || "");
      const signature = String(url.searchParams.get("sig") || "");
      const currentSeconds = Math.floor(now() / 1000);
      if (!item || !panel || item.sourceFingerprintMatched !== true || evidenceExtension(panel.mimeType) !== match[4]) throw new HttpError(404, "보호 근거 이미지를 찾을 수 없습니다.");
      if (reviewVersion !== review.reviewVersion || !Number.isInteger(expires) || expires <= currentSeconds || expires > currentSeconds + assetTtlSeconds + 5) {
        throw new HttpError(403, "보호 근거 이미지 링크가 만료되었습니다.");
      }
      const expectedSubject = security.opaqueSubject(context.user.studentId, assetSecret);
      if (subject !== expectedSubject || !security.verifyPageAsset(reviewSignatureInput(review, item, panel, subject, expires), signature, assetSecret)) {
        throw new HttpError(403, "보호 근거 이미지 서명이 올바르지 않습니다.");
      }
      if (!fs.existsSync(panel.assetPath) || !fs.statSync(panel.assetPath).isFile()) throw new HttpError(404, "보호 근거 이미지를 찾을 수 없습니다.");
      setSecurityHeaders(response);
      response.statusCode = 200;
      response.setHeader("Content-Type", panel.mimeType);
      response.setHeader("Cache-Control", "private, no-store");
      response.setHeader("Content-Disposition", `inline; filename="review-${number}-${role}${match[4]}"`);
      if (request.method === "HEAD") response.end();
      else fs.createReadStream(panel.assetPath).pipe(response);
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
