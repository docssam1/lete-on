"use strict";

/*
 * Local-only Grade 6 diagnostic runtime.
 *
 * The authored prompts and scoring material are deliberately loaded from the
 * ignored private-authoring directory at runtime. Nothing private is embedded
 * in this tracked module, written to disk, or returned on student routes.
 */

const crypto = require("node:crypto");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { TextDecoder } = require("node:util");
const vm = require("node:vm");

const placement = require("./grade6-placement-plan.js");
const engine = require("./diagnostic-engine.js");
const reports = require("./report-projections.js");
const roadmaps = require("./grade6-roadmap-projection.js");
const privateValidator = require("../scripts/validate-private-grade6-authoring.cjs");

const API_PREFIX = "/api/grade6-local";
const DEFAULT_MAX_BODY_BYTES = 128 * 1024;
const MAX_RESPONSE_BYTES = 10 * 1024;
const MAX_NUMERIC_BYTES = 128;
const STRICT_UTF8_DECODER = new TextDecoder("utf-8", { fatal: true });
const PRIVATE_PATH_SEGMENTS = new Set(["private-authoring", "private-workbook-authoring"]);
const ERROR_TYPES = new Set(engine.ERROR_TYPES);
const MIME_TYPES = Object.freeze({
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp"
});

class RuntimeError extends Error {
  constructor(statusCode, code, message) {
    super(message || code);
    this.name = "RuntimeError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

function fail(statusCode, code, message) {
  throw new RuntimeError(statusCode, code, message);
}

function isRecord(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function onlyKeys(value, allowed, field) {
  if (!isRecord(value)) fail(400, "INVALID_REQUEST", `${field} must be an object`);
  const unexpected = Object.keys(value).filter(function (key) { return !allowed.includes(key); });
  if (unexpected.length) fail(400, "UNSUPPORTED_FIELDS", `${field} has unsupported fields`);
}

function denseArray(value, field) {
  if (!Array.isArray(value)) fail(400, "INVALID_REQUEST", `${field} must be an array`);
  for (let index = 0; index < value.length; index += 1) {
    if (!Object.prototype.hasOwnProperty.call(value, index)) fail(400, "INVALID_REQUEST", `${field} must be dense`);
  }
  return value;
}

function timingSafeTextEqual(left, right) {
  if (typeof left !== "string" || typeof right !== "string") return false;
  const leftBytes = Buffer.from(left, "utf8");
  const rightBytes = Buffer.from(right, "utf8");
  return leftBytes.length === rightBytes.length && crypto.timingSafeEqual(leftBytes, rightBytes);
}

function normalizeTimestamp(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error("Clock returned an invalid time");
  return date.toISOString();
}

function gcd(left, right) {
  let a = left < 0n ? -left : left;
  let b = right < 0n ? -right : right;
  while (b) {
    const next = a % b;
    a = b;
    b = next;
  }
  return a || 1n;
}

function parseExactRational(raw) {
  if (typeof raw !== "string") return null;
  const text = raw.trim();
  if (!text || Buffer.byteLength(text, "utf8") > MAX_NUMERIC_BYTES) return null;
  let numerator;
  let denominator;
  const fraction = text.match(/^([+-]?\d+)\s*\/\s*([+-]?\d+)$/);
  const decimal = text.match(/^([+-]?)(?:(\d+)(?:\.(\d*))?|\.(\d+))$/);
  try {
    if (fraction) {
      numerator = BigInt(fraction[1]);
      denominator = BigInt(fraction[2]);
    } else if (decimal) {
      const whole = decimal[2] || "0";
      const fractional = decimal[3] != null ? decimal[3] : (decimal[4] || "");
      const digits = whole + fractional;
      numerator = BigInt((decimal[1] || "") + digits);
      denominator = 10n ** BigInt(fractional.length);
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
  if (denominator === 0n) return null;
  if (denominator < 0n) {
    numerator = -numerator;
    denominator = -denominator;
  }
  const divisor = gcd(numerator, denominator);
  return Object.freeze({ numerator: numerator / divisor, denominator: denominator / divisor });
}

function rationalEqual(left, right) {
  const normalizedLeft = parseExactRational(left);
  const normalizedRight = parseExactRational(right);
  return !!normalizedLeft && !!normalizedRight &&
    normalizedLeft.numerator === normalizedRight.numerator &&
    normalizedLeft.denominator === normalizedRight.denominator;
}

function validateSvg(bytes) {
  const source = bytes.toString("utf8");
  if (bytes.length !== Buffer.byteLength(source, "utf8") ||
      !/^\s*(?:<\?xml[^>]*>\s*)?<svg\b/i.test(source) || !/<\/svg>\s*$/i.test(source)) {
    fail(500, "PRIVATE_ASSET_INVALID", "Private SVG is invalid");
  }
  if (/(?:<!DOCTYPE|<!ENTITY|<script\b|<foreignObject\b|<iframe\b|<object\b|<embed\b|<image\b|<style\b)/i.test(source) ||
      /\son[a-z]+\s*=/i.test(source) || /(?:href|xlink:href)\s*=\s*["'](?!#)/i.test(source) || /url\s*\(/i.test(source)) {
    fail(500, "PRIVATE_ASSET_ACTIVE_CONTENT", "Private SVG contains forbidden active content");
  }
}

function privatePackFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).filter(function (entry) {
    return entry.isFile() && !entry.isSymbolicLink() && /^grade6-[a-z-]+-drafts\.cjs$/.test(entry.name);
  }).map(function (entry) { return entry.name; }).sort();
}

function loadPack(fullPath, fileName) {
  const source = fs.readFileSync(fullPath, "utf8");
  if (!source || source.length > 1024 * 1024) throw new Error(`Private pack is invalid: ${fileName}`);
  const moduleRecord = Object.create(null);
  moduleRecord.exports = null;
  const sandbox = Object.create(null);
  sandbox.module = moduleRecord;
  sandbox.exports = moduleRecord.exports;
  vm.runInNewContext(source, sandbox, {
    filename: fileName,
    timeout: 250,
    codeGeneration: { strings: false, wasm: false }
  });
  return clone(moduleRecord.exports);
}

function loadPrivateAuthoring(directory) {
  const resolvedDirectory = path.resolve(directory);
  privateValidator.validateDirectory(resolvedDirectory);
  const bySlot = new Map();
  privatePackFiles(resolvedDirectory).forEach(function (fileName) {
    const pack = loadPack(path.join(resolvedDirectory, fileName), fileName);
    denseArray(pack.items, "private pack items").forEach(function (item) {
      if (bySlot.has(item.slotId)) throw new Error(`Duplicate private slot: ${item.slotId}`);
      bySlot.set(item.slotId, item);
    });
  });
  const items = placement.plan.slots.map(function (slot) {
    const item = bySlot.get(slot.slotId);
    if (!item) throw new Error(`Private item missing for ${slot.slotId}`);
    return item;
  });
  if (items.length !== 42) throw new Error("Private Grade 6 runtime requires exactly 42 items");
  return Object.freeze({ directory: resolvedDirectory, items: Object.freeze(items) });
}

function publicItem(item) {
  const slotNumber = placement.plan.slots.findIndex(function (slot) { return slot.slotId === item.slotId; }) + 1;
  if (slotNumber < 1) throw new Error(`Private item does not resolve to a placement slot: ${item.slotId}`);
  return Object.freeze({
    slotNumber,
    slotId: item.slotId,
    itemId: item.itemId,
    domainId: item.domainId,
    clusterId: item.clusterId,
    standardIds: Object.freeze(item.standardIds.slice()),
    difficulty: item.difficulty,
    responseType: item.responseType,
    promptBlocks: Object.freeze(clone(item.publicDraft.promptBlocks)),
    options: Object.freeze(clone(item.publicDraft.options)),
    assets: Object.freeze(item.publicDraft.assets.map(function (asset) {
      return Object.freeze(Object.assign({}, clone(asset), {
        url: `${API_PREFIX}/assets/${asset.assetId}`
      }));
    })),
    responseUi: Object.freeze(clone(item.publicDraft.responseUi))
  });
}

function blueprintFor(items) {
  return Object.freeze({
    schemaVersion: engine.SCHEMA_VERSION,
    id: placement.plan.id,
    programId: placement.plan.programId,
    targetGrade: placement.plan.targetGrade,
    version: placement.plan.blueprintVersion,
    purpose: placement.plan.purpose,
    items: Object.freeze(placement.plan.slots.map(function (slot, index) {
      const item = items[index];
      return Object.freeze({
        itemId: item.itemId,
        unitId: slot.unitId,
        clusterId: slot.clusterId,
        standardRange: slot.standardRange,
        skillId: slot.skillId,
        domainId: slot.domainId,
        maxPoints: slot.maxPoints,
        responseType: slot.responseType,
        difficulty: slot.difficulty,
        scoringMode: slot.scoringMode,
        // The placement engine accepts only approved evidence. This is an
        // in-memory QA adapter after private preflight, never a release grant.
        reviewState: "approved"
      });
    }))
  });
}

function localPolicy() {
  return Object.freeze({
    id: "pol-bdg-grade6-local-v1",
    version: 1,
    owner: "GFIELD local teacher review",
    schoolId: "sch-bdg-0000000000000001",
    programId: placement.plan.programId,
    targetGrade: 6,
    effectiveFrom: "2020-01-01",
    claimsNationalOfficialCut: false,
    teacherReviewRequired: true,
    bands: Object.freeze([
      Object.freeze({ id: "developing", minPercent: 0 }),
      Object.freeze({ id: "approaching", minPercent: 60 }),
      Object.freeze({ id: "ready", minPercent: 80 })
    ]),
    promotionReview: Object.freeze({ minimumBandId: "ready", minDomainPercent: 70, maxPrerequisiteGaps: 0 }),
    evidenceRequired: Object.freeze(["diagnostic", "unit-mastery", "retention-check", "teacher-review"])
  });
}

function createGrade6LocalRuntime(options) {
  const settings = options || {};
  if (settings.qaOnly !== true) {
    throw new Error("Pending-review Grade 6 authoring may run only with an explicit qaOnly acknowledgement");
  }
  const projectRoot = path.resolve(settings.projectRoot || path.resolve(__dirname, ".."));
  const privateDirectory = path.resolve(settings.privateDirectory || path.join(projectRoot, "private-authoring"));
  const authoring = loadPrivateAuthoring(privateDirectory);
  const items = authoring.items;
  const itemById = new Map(items.map(function (item) { return [item.itemId, item]; }));
  const blueprint = blueprintFor(items);
  const policy = localPolicy();
  engine.validateBlueprint(blueprint);
  engine.validatePolicy(policy);

  const teacherPin = settings.teacherPin || crypto.randomBytes(6).toString("base64url").toUpperCase();
  if (typeof teacherPin !== "string" || teacherPin.length < 8 || teacherPin.length > 64) {
    throw new Error("teacherPin must be an 8-64 character server-only secret");
  }
  const clock = typeof settings.now === "function" ? settings.now : function () { return new Date(); };
  const randomBytes = typeof settings.randomBytes === "function"
    ? settings.randomBytes
    : function secureRandomBytes(size) { return crypto.randomBytes(size); };
  const attempts = new Map();
  let generatedCounter = 0;

  function randomHex(bytes) {
    const value = randomBytes(bytes, generatedCounter++);
    if (!Buffer.isBuffer(value) || value.length < bytes) throw new Error("randomBytes returned insufficient entropy");
    return value.subarray(0, bytes).toString("hex");
  }

  function newId(prefix) {
    let id;
    do { id = `${prefix}${randomHex(8)}`; } while (attempts.has(id));
    return id;
  }

  function getAttempt(attemptId) {
    if (typeof attemptId !== "string" || !/^att-bdg-[a-f0-9]{16}$/.test(attemptId)) {
      fail(400, "INVALID_ATTEMPT_ID", "attemptId is invalid");
    }
    const attempt = attempts.get(attemptId);
    if (!attempt) fail(404, "ATTEMPT_NOT_FOUND", "Attempt not found");
    return attempt;
  }

  function requireStudent(attempt, token) {
    if (!timingSafeTextEqual(token, attempt.studentToken)) fail(403, "STUDENT_TOKEN_REJECTED", "Student token rejected");
  }

  function requireTeacher(pin) {
    if (!timingSafeTextEqual(pin, teacherPin)) fail(403, "TEACHER_PIN_REJECTED", "Teacher PIN rejected");
  }

  function start(body) {
    onlyKeys(body, ["action"], "start request");
    if (body.action !== "start") fail(400, "INVALID_ACTION", "Invalid action");
    const attemptId = newId("att-bdg-");
    const studentToken = randomHex(24);
    attempts.set(attemptId, {
      attemptId,
      studentToken,
      learnerId: `lrm-bdg-${randomHex(8)}`,
      status: "in-progress",
      responses: new Map(),
      automaticResults: null,
      completedAt: null,
      finalized: null
    });
    return Object.freeze({
      attemptId,
      studentToken,
      items: Object.freeze(items.map(publicItem)),
      counts: Object.freeze({ total: 42, automatic: 32, teacherReview: 10 }),
      deliveryState: "local-qa-only-pending-independent-review"
    });
  }

  function save(body, studentToken) {
    onlyKeys(body, ["action", "attemptId", "responses"], "save request");
    if (body.action !== "save") fail(400, "INVALID_ACTION", "Invalid action");
    const attempt = getAttempt(body.attemptId);
    requireStudent(attempt, studentToken);
    if (attempt.status !== "in-progress") fail(409, "ATTEMPT_NOT_EDITABLE", "Attempt is not editable");
    const updates = denseArray(body.responses, "responses");
    if (!updates.length || updates.length > 42) fail(400, "INVALID_RESPONSES", "responses must contain 1-42 items");
    const seen = new Set();
    updates.forEach(function (response, index) {
      onlyKeys(response, ["itemId", "value"], `responses[${index}]`);
      if (!itemById.has(response.itemId) || seen.has(response.itemId)) fail(400, "INVALID_RESPONSE_ITEM", "Response item is invalid");
      if (typeof response.value !== "string" || Buffer.byteLength(response.value, "utf8") > MAX_RESPONSE_BYTES) {
        fail(400, "INVALID_RESPONSE_VALUE", "Response value must be a bounded string");
      }
      seen.add(response.itemId);
    });
    updates.forEach(function (response) { attempt.responses.set(response.itemId, response.value); });
    return Object.freeze({ attemptId: attempt.attemptId, status: attempt.status, savedCount: attempt.responses.size });
  }

  function automaticResult(item, rawValue) {
    const spec = item.privateDraft;
    const answer = spec.answer;
    const normalized = rawValue.trim();
    const correct = answer.kind === "option-id"
      ? normalized === answer.value
      : rationalEqual(normalized, answer.value);
    if (correct) return Object.freeze({ itemId: item.itemId, awardedPoints: 1, errorType: null, scoringReview: null });
    const signal = spec.errorSignals.find(function (candidate) {
      return answer.kind === "option-id"
        ? normalized === candidate.observedValue
        : normalized === candidate.observedValue.trim() || rationalEqual(normalized, candidate.observedValue);
    });
    return Object.freeze({
      itemId: item.itemId,
      awardedPoints: 0,
      errorType: signal ? signal.errorType : spec.defaultErrorType,
      scoringReview: null
    });
  }

  function submit(body, studentToken) {
    onlyKeys(body, ["action", "attemptId"], "submit request");
    if (body.action !== "submit") fail(400, "INVALID_ACTION", "Invalid action");
    const attempt = getAttempt(body.attemptId);
    requireStudent(attempt, studentToken);
    if (attempt.status !== "in-progress") fail(409, "ATTEMPT_ALREADY_SUBMITTED", "Attempt has already been submitted");
    const missing = items.filter(function (item) {
      return !attempt.responses.has(item.itemId) || !attempt.responses.get(item.itemId).trim();
    });
    if (missing.length) fail(409, "INCOMPLETE_ATTEMPT", `All 42 responses are required; ${missing.length} missing`);
    attempt.automaticResults = items.filter(function (item) {
      return !["short-answer", "constructed-response"].includes(item.responseType);
    }).map(function (item) { return automaticResult(item, attempt.responses.get(item.itemId)); });
    attempt.completedAt = normalizeTimestamp(clock());
    attempt.status = "pending-teacher-review";
    return Object.freeze({
      attemptId: attempt.attemptId,
      status: attempt.status,
      automaticScoredCount: attempt.automaticResults.length,
      teacherReviewCount: 10
    });
  }

  function studentResult(attemptId, studentToken) {
    const attempt = getAttempt(attemptId);
    requireStudent(attempt, studentToken);
    const result = {
      attemptId: attempt.attemptId,
      status: attempt.status,
      automaticScoredCount: attempt.automaticResults ? attempt.automaticResults.length : 0,
      teacherReviewCount: 10
    };
    if (attempt.finalized) {
      result.studentReport = attempt.finalized.studentReport;
      result.studentRoadmap = attempt.finalized.studentRoadmap;
    }
    return Object.freeze(result);
  }

  function teacherOpen(body) {
    onlyKeys(body, ["action", "attemptId", "pin"], "teacher-open request");
    if (body.action !== "teacher-open") fail(400, "INVALID_ACTION", "Invalid action");
    requireTeacher(body.pin);
    const attempt = getAttempt(body.attemptId);
    if (attempt.status === "in-progress") fail(409, "ATTEMPT_NOT_SUBMITTED", "Attempt has not been submitted");
    const teacherItems = items.filter(function (item) { return ["short-answer", "constructed-response"].includes(item.responseType); });
    return Object.freeze({
      attemptId: attempt.attemptId,
      status: attempt.status,
      summary: Object.freeze({
        totalItemCount: 42,
        automaticScoredCount: 32,
        teacherReviewCount: 10,
        automaticEarnedPoints: attempt.automaticResults.reduce(function (sum, result) { return sum + result.awardedPoints; }, 0)
      }),
      queue: Object.freeze(teacherItems.map(function (item) {
        return Object.freeze({
          item: publicItem(item),
          itemId: item.itemId,
          responseType: item.responseType,
          response: attempt.responses.get(item.itemId),
          expectedResponseByLocale: clone(item.privateDraft.expectedResponseByLocale),
          rubricDraft: clone(item.privateDraft.rubricDraft),
          solutionByLocale: clone(item.privateDraft.solutionByLocale),
          errorSignals: clone(item.privateDraft.errorSignals),
          defaultErrorType: item.privateDraft.defaultErrorType
        });
      }))
    });
  }

  function teacherFinalize(body) {
    onlyKeys(body, ["action", "attemptId", "pin", "reviews"], "teacher-finalize request");
    if (body.action !== "teacher-finalize") fail(400, "INVALID_ACTION", "Invalid action");
    requireTeacher(body.pin);
    const attempt = getAttempt(body.attemptId);
    if (attempt.status !== "pending-teacher-review") fail(409, "ATTEMPT_NOT_REVIEWABLE", "Attempt is not awaiting teacher review");
    const reviews = denseArray(body.reviews, "reviews");
    const teacherItems = items.filter(function (item) { return ["short-answer", "constructed-response"].includes(item.responseType); });
    if (reviews.length !== teacherItems.length) fail(400, "INCOMPLETE_TEACHER_REVIEW", "Exactly 10 teacher reviews are required");
    const teacherById = new Map(teacherItems.map(function (item) { return [item.itemId, item]; }));
    const seen = new Set();
    reviews.forEach(function (review, index) {
      onlyKeys(review, ["itemId", "awardedPoints", "errorType"], `reviews[${index}]`);
      const item = teacherById.get(review.itemId);
      if (!item || seen.has(review.itemId)) fail(400, "INVALID_TEACHER_REVIEW_ITEM", "Teacher review item is invalid");
      const increments = item.privateDraft.rubricDraft.allowedPointIncrements;
      if (typeof review.awardedPoints !== "number" || !Number.isFinite(review.awardedPoints) || !increments.includes(review.awardedPoints)) {
        fail(400, "INVALID_AWARDED_POINTS", "Teacher awarded points are invalid");
      }
      if (review.awardedPoints === 1 && review.errorType != null) fail(400, "UNEXPECTED_ERROR_TYPE", "Full credit cannot have an error type");
      const allowedErrors = new Set(item.privateDraft.errorSignals.map(function (signal) { return signal.errorType; }));
      allowedErrors.add(item.privateDraft.defaultErrorType);
      if (review.awardedPoints < 1 && (!ERROR_TYPES.has(review.errorType) || !allowedErrors.has(review.errorType))) {
        fail(400, "INVALID_ERROR_TYPE", "Lost points require a reviewed error type");
      }
      seen.add(review.itemId);
    });

    const reviewedAt = normalizeTimestamp(clock());
    const reviewerId = `gmt-${randomHex(8)}`;
    const teacherResults = reviews.map(function (review) {
      return Object.freeze({
        itemId: review.itemId,
        awardedPoints: review.awardedPoints,
        errorType: review.awardedPoints === 1 ? null : review.errorType,
        scoringReview: Object.freeze({
          reviewId: `grd-bdg-${randomHex(8)}`,
          reviewerId,
          reviewedAt,
          attemptId: attempt.attemptId,
          itemId: review.itemId
        })
      });
    });
    const resultById = new Map(attempt.automaticResults.concat(teacherResults).map(function (result) { return [result.itemId, result]; }));
    const engineAttempt = Object.freeze({
      id: attempt.attemptId,
      blueprintId: blueprint.id,
      blueprintVersion: blueprint.version,
      learnerId: attempt.learnerId,
      schoolId: policy.schoolId,
      policyId: policy.id,
      policyVersion: policy.version,
      completedAt: attempt.completedAt,
      itemResults: Object.freeze(blueprint.items.map(function (item) { return resultById.get(item.itemId); }))
    });
    const teacherEvidence = Object.freeze({
      recordId: `evd-bdg-${randomHex(8)}`,
      type: "teacher-review",
      learnerId: attempt.learnerId,
      schoolId: policy.schoolId,
      programId: blueprint.programId,
      attemptId: attempt.attemptId,
      blueprintId: blueprint.id,
      blueprintVersion: blueprint.version,
      policyId: policy.id,
      policyVersion: policy.version,
      verifiedAt: reviewedAt,
      verifiedBy: reviewerId
    });
    const analysis = engine.analyzeAttempt(blueprint, engineAttempt, policy, { "teacher-review": teacherEvidence });
    const finalized = Object.freeze({
      studentReport: reports.buildStudentReport(analysis),
      studentRoadmap: roadmaps.buildStudentRoadmap(analysis),
      teacherReport: reports.buildTeacherReport(analysis),
      teacherRoadmap: roadmaps.buildTeacherRoadmap(analysis)
    });
    attempt.finalized = finalized;
    attempt.status = "finalized-school-review-required";
    return finalized;
  }

  function getAsset(assetId) {
    if (typeof assetId !== "string" || !/^ast-bnk-[a-z0-9]{16}$/.test(assetId)) fail(404, "ASSET_NOT_FOUND", "Asset not found");
    let match = null;
    items.some(function (item) {
      const publicAsset = item.publicDraft.assets.find(function (asset) { return asset.assetId === assetId; });
      const draft = (item.assetDrafts || []).find(function (candidate) { return candidate.assetId === assetId; });
      if (!publicAsset || !draft) return false;
      match = { publicAsset, draft };
      return true;
    });
    if (!match) fail(404, "ASSET_NOT_FOUND", "Asset not found");
    const assetRoot = path.resolve(privateDirectory, "assets");
    const sourcePath = path.resolve(privateDirectory, ...match.draft.sourcePath.split("/"));
    const relative = path.relative(assetRoot, sourcePath);
    if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) fail(500, "PRIVATE_ASSET_PATH_INVALID", "Private asset path is invalid");
    const stat = fs.lstatSync(sourcePath);
    if (!stat.isFile() || stat.isSymbolicLink() || stat.size < 1 || stat.size > 512 * 1024) fail(500, "PRIVATE_ASSET_INVALID", "Private asset is invalid");
    const bytes = fs.readFileSync(sourcePath);
    const actualHash = crypto.createHash("sha256").update(bytes).digest("hex");
    if (!timingSafeTextEqual(actualHash, match.publicAsset.sha256)) fail(500, "PRIVATE_ASSET_HASH_MISMATCH", "Private asset hash mismatch");
    if (match.publicAsset.mimeType === "image/svg+xml") validateSvg(bytes);
    else fail(500, "PRIVATE_ASSET_MIME_REJECTED", "Private asset MIME type is not allowed by this runtime");
    return Object.freeze({ bytes, mimeType: match.publicAsset.mimeType, sha256: actualHash });
  }

  return Object.freeze({
    start,
    save,
    submit,
    studentResult,
    teacherOpen,
    teacherFinalize,
    getAsset,
    counts: Object.freeze({ total: 42, automatic: 32, teacherReview: 10 }),
    releaseGate: Object.freeze({
      qaOnly: true,
      authoringState: "draft-pending-independent-review",
      pendingItemCount: 42,
      studentOperationAuthorized: false
    }),
    publicItems: Object.freeze(items.map(publicItem))
  });
}

function securityHeaders(extra) {
  return Object.assign({
    "Cache-Control": "no-store, max-age=0",
    "Content-Security-Policy": "default-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'; object-src 'none'",
    "Cross-Origin-Resource-Policy": "same-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY"
  }, extra || {});
}

function sendJson(response, statusCode, value, headOnly) {
  const bytes = Buffer.from(JSON.stringify(value), "utf8");
  response.writeHead(statusCode, securityHeaders({
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": bytes.length
  }));
  response.end(headOnly ? undefined : bytes);
}

function readJson(request, maxBodyBytes) {
  return new Promise(function (resolve, reject) {
    if (!/^application\/json(?:\s*;|$)/i.test(String(request.headers["content-type"] || ""))) {
      reject(new RuntimeError(415, "JSON_CONTENT_TYPE_REQUIRED", "Content-Type must be application/json"));
      return;
    }
    let size = 0;
    let tooLarge = false;
    const chunks = [];
    request.on("data", function (chunk) {
      if (tooLarge) return;
      size += chunk.length;
      if (size > maxBodyBytes) {
        tooLarge = true;
        chunks.length = 0;
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", function () {
      if (tooLarge) {
        reject(new RuntimeError(413, "REQUEST_TOO_LARGE", "Request body is too large"));
        return;
      }
      try {
        const source = STRICT_UTF8_DECODER.decode(Buffer.concat(chunks));
        const value = JSON.parse(source);
        if (!isRecord(value)) throw new Error("not an object");
        resolve(value);
      } catch (error) {
        reject(new RuntimeError(400, "INVALID_JSON", "Request body must be one JSON object"));
      }
    });
    request.on("error", reject);
  });
}

function loopbackRequest(request) {
  const remote = request.socket && request.socket.remoteAddress;
  return remote === "127.0.0.1" || remote === "::1" || remote === "::ffff:127.0.0.1";
}

function requireLoopbackAuthority(request, privateDelivery) {
  const port = request.socket && request.socket.localPort;
  const host = typeof request.headers.host === "string" ? request.headers.host.toLowerCase() : "";
  const allowedHosts = new Set([
    `127.0.0.1:${port}`,
    `localhost:${port}`,
    `[::1]:${port}`
  ]);
  if (!Number.isInteger(port) || !allowedHosts.has(host)) {
    fail(403, "HOST_REJECTED", "Loopback Host rejected");
  }
  if (!privateDelivery) return;
  const origin = request.headers.origin;
  if (origin != null && origin !== `http://${host}`) {
    fail(403, "ORIGIN_REJECTED", "Loopback Origin rejected");
  }
  const fetchSite = request.headers["sec-fetch-site"];
  if (fetchSite != null && fetchSite !== "same-origin") {
    fail(403, "FETCH_SITE_REJECTED", "Cross-site private delivery rejected");
  }
}

function safeStaticPath(root, pathname) {
  let decoded;
  try { decoded = decodeURIComponent(pathname); } catch (error) { fail(400, "INVALID_PATH", "Path is invalid"); }
  if (decoded.includes("\\") || decoded.includes("\0")) fail(400, "INVALID_PATH", "Path is invalid");
  const segments = decoded.split("/").filter(Boolean);
  if (segments.some(function (segment) { return PRIVATE_PATH_SEGMENTS.has(segment.toLowerCase()) || segment === "." || segment === ".." || segment.startsWith("."); })) {
    fail(404, "NOT_FOUND", "Not found");
  }
  const candidate = path.resolve(root, ...segments);
  const relative = path.relative(root, candidate);
  if (relative.startsWith("..") || path.isAbsolute(relative)) fail(404, "NOT_FOUND", "Not found");
  return candidate;
}

function createHttpHandler(options) {
  const settings = options || {};
  const runtime = settings.runtime || createGrade6LocalRuntime(settings);
  const staticRoot = path.resolve(settings.staticRoot || settings.projectRoot || path.resolve(__dirname, ".."));
  const maxBodyBytes = settings.maxBodyBytes || DEFAULT_MAX_BODY_BYTES;
  return async function grade6LocalHandler(request, response) {
    try {
      if (!loopbackRequest(request)) fail(403, "LOOPBACK_ONLY", "Local requests only");
      const url = new URL(request.url, "http://127.0.0.1");
      const pathname = url.pathname;
      requireLoopbackAuthority(request, pathname === API_PREFIX || pathname.startsWith(`${API_PREFIX}/assets/`));
      if (pathname === API_PREFIX) {
        if (request.method === "GET") {
          const action = url.searchParams.get("action");
          const keys = Array.from(url.searchParams.keys());
          if (action === "health" && keys.length === 1) {
            sendJson(response, 200, { status: "ok", scope: "grade6-local", counts: runtime.counts, releaseGate: runtime.releaseGate });
            return;
          }
          if (action === "student-result" && keys.length === 2 && url.searchParams.has("attemptId")) {
            sendJson(response, 200, runtime.studentResult(url.searchParams.get("attemptId"), request.headers["x-gfield-student-token"]));
            return;
          }
          fail(400, "INVALID_ACTION", "GET action is not allowed");
        }
        if (request.method !== "POST") fail(405, "METHOD_NOT_ALLOWED", "API method is not allowed");
        if (url.search) fail(400, "QUERY_NOT_ALLOWED", "POST API does not accept query parameters");
        const body = await readJson(request, maxBodyBytes);
        const actions = new Set(["start", "save", "submit", "teacher-open", "teacher-finalize"]);
        if (!actions.has(body.action)) fail(400, "INVALID_ACTION", "POST action is not allowed");
        let result;
        if (body.action === "start") result = runtime.start(body);
        else if (body.action === "save") result = runtime.save(body, request.headers["x-gfield-student-token"]);
        else if (body.action === "submit") result = runtime.submit(body, request.headers["x-gfield-student-token"]);
        else if (body.action === "teacher-open") result = runtime.teacherOpen(body);
        else result = runtime.teacherFinalize(body);
        sendJson(response, 200, result);
        return;
      }
      if (pathname.startsWith(`${API_PREFIX}/assets/`)) {
        if (!new Set(["GET", "HEAD"]).has(request.method)) fail(405, "METHOD_NOT_ALLOWED", "Asset method is not allowed");
        if (url.search) fail(400, "QUERY_NOT_ALLOWED", "Asset route does not accept query parameters");
        const assetId = pathname.slice(`${API_PREFIX}/assets/`.length);
        const asset = runtime.getAsset(assetId);
        response.writeHead(200, securityHeaders({
          "Content-Type": asset.mimeType,
          "Content-Length": asset.bytes.length,
          "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
          "ETag": `\"sha256-${asset.sha256}\"`
        }));
        response.end(request.method === "HEAD" ? undefined : asset.bytes);
        return;
      }
      if (!new Set(["GET", "HEAD"]).has(request.method)) fail(405, "METHOD_NOT_ALLOWED", "Static method is not allowed");
      let filePath = safeStaticPath(staticRoot, pathname);
      let stat;
      try { stat = fs.lstatSync(filePath); } catch (error) { fail(404, "NOT_FOUND", "Not found"); }
      if (stat.isDirectory()) {
        filePath = path.join(filePath, "index.html");
        try { stat = fs.lstatSync(filePath); } catch (error) { fail(404, "NOT_FOUND", "Not found"); }
      }
      if (!stat.isFile() || stat.isSymbolicLink()) fail(404, "NOT_FOUND", "Not found");
      const realRoot = fs.realpathSync(staticRoot);
      const realFile = fs.realpathSync(filePath);
      const relative = path.relative(realRoot, realFile);
      if (relative.startsWith("..") || path.isAbsolute(relative)) fail(404, "NOT_FOUND", "Not found");
      const bytes = fs.readFileSync(realFile);
      response.writeHead(200, securityHeaders({
        "Content-Type": MIME_TYPES[path.extname(realFile).toLowerCase()] || "application/octet-stream",
        "Content-Length": bytes.length
      }));
      response.end(request.method === "HEAD" ? undefined : bytes);
    } catch (error) {
      if (response.headersSent || response.destroyed) return;
      const safeError = error instanceof RuntimeError ? error : new RuntimeError(500, "LOCAL_RUNTIME_ERROR", "Local runtime error");
      sendJson(response, safeError.statusCode, { error: safeError.message, code: safeError.code });
    }
  };
}

function createGrade6LocalServer(options) {
  return http.createServer(createHttpHandler(options));
}

module.exports = Object.freeze({
  API_PREFIX,
  DEFAULT_MAX_BODY_BYTES,
  RuntimeError,
  parseExactRational,
  rationalEqual,
  loadPrivateAuthoring,
  createGrade6LocalRuntime,
  createHttpHandler,
  createGrade6LocalServer
});
