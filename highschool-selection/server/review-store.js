"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const SCHEMA_VERSION = "highselect-private-reviews/v1";
const EXAM_CHECKS = Object.freeze({
  responseSchemaStatus: new Set(["pending", "verified", "blocked"]),
  scoringPolicyStatus: new Set(["pending", "verified", "blocked"]),
  printAuditStatus: new Set(["pending", "passed", "blocked"]),
  signedAssetStatus: new Set(["pending", "verified", "blocked"])
});
const ANSWER_STATES = new Set(["pending", "verified", "blocked"]);
const REVIEW_STATES = new Set(["pending", "verified", "blocked"]);
const VISUAL_STATES = new Set(["pending", "passed", "blocked"]);
const RESOLUTION_STATES = new Set(["pending", "agent_verified", "replacement_verified", "scoring_excluded"]);
const EVIDENCE_ROLES = new Set(["problem", "source-key", "independent-audit"]);
const EVIDENCE_MIME = new Set(["image/png", "image/jpeg", "image/webp"]);

function fail(message) { throw new Error(message); }
function clean(value) { return String(value == null ? "" : value).trim(); }
function rejectUnknownKeys(value, allowed, label) {
  Object.keys(value).forEach(function (key) {
    if (!allowed.has(key)) fail(`${label}.${key} is not allowed`);
  });
}
function requiredToken(value, label) {
  const token = clean(value);
  if (!token || token.length > 160 || !/^[A-Za-z0-9._:-]+$/.test(token)) fail(`${label} is invalid`);
  return token;
}

function normalizeEvidencePanel(panel, label) {
  if (!panel || typeof panel !== "object" || Array.isArray(panel)) fail(`${label} is invalid`);
  rejectUnknownKeys(panel, new Set(["role", "assetPath", "mimeType"]), label);
  const role = clean(panel.role);
  const assetPath = path.resolve(clean(panel.assetPath));
  const mimeType = clean(panel.mimeType).toLowerCase();
  if (!EVIDENCE_ROLES.has(role)) fail(`${label}.role is invalid`);
  if (!path.isAbsolute(clean(panel.assetPath))) fail(`${label}.assetPath must be absolute`);
  if (!EVIDENCE_MIME.has(mimeType)) fail(`${label}.mimeType is invalid`);
  return Object.freeze({ role, assetPath, mimeType });
}

function normalizeItem(item, index) {
  const label = `items[${index}]`;
  if (!item || typeof item !== "object" || Array.isArray(item)) fail(`${label} is invalid`);
  rejectUnknownKeys(item, new Set([
    "itemId", "number", "answerStatus", "classificationStatus", "visualStatus",
    "sourceFingerprintMatched", "correctionArtifactMatched", "resolutionStatus",
    "scoringExclusionAllowed", "evidencePanels"
  ]), label);
  const itemId = requiredToken(item.itemId, `${label}.itemId`);
  const number = Number(item.number);
  if (!Number.isSafeInteger(number) || number < 1 || number > 500) fail(`${label}.number is invalid`);
  if (!ANSWER_STATES.has(item.answerStatus)) fail(`${label}.answerStatus is invalid`);
  if (!REVIEW_STATES.has(item.classificationStatus)) fail(`${label}.classificationStatus is invalid`);
  if (!VISUAL_STATES.has(item.visualStatus)) fail(`${label}.visualStatus is invalid`);
  if (!RESOLUTION_STATES.has(item.resolutionStatus)) fail(`${label}.resolutionStatus is invalid`);
  if (typeof item.sourceFingerprintMatched !== "boolean") fail(`${label}.sourceFingerprintMatched is invalid`);
  if (typeof item.correctionArtifactMatched !== "boolean") fail(`${label}.correctionArtifactMatched is invalid`);
  if (typeof item.scoringExclusionAllowed !== "boolean") fail(`${label}.scoringExclusionAllowed is invalid`);
  const panels = Array.isArray(item.evidencePanels)
    ? item.evidencePanels.map(function (panel, panelIndex) { return normalizeEvidencePanel(panel, `${label}.evidencePanels[${panelIndex}]`); })
    : [];
  if (panels.length && (panels.length !== 3 || new Set(panels.map(function (panel) { return panel.role; })).size !== 3)) {
    fail(`${label}.evidencePanels must contain three unique roles`);
  }
  return Object.freeze({
    itemId,
    number,
    answerStatus: item.answerStatus,
    classificationStatus: item.classificationStatus,
    visualStatus: item.visualStatus,
    sourceFingerprintMatched: item.sourceFingerprintMatched,
    correctionArtifactMatched: item.correctionArtifactMatched,
    resolutionStatus: item.resolutionStatus,
    scoringExclusionAllowed: item.scoringExclusionAllowed,
    evidencePanels: Object.freeze(panels)
  });
}

function normalizeConfirmation(value, examId, roundCode, reviewVersion) {
  if (value == null) return null;
  if (!value || typeof value !== "object" || Array.isArray(value)) fail("finalConfirmation is invalid");
  rejectUnknownKeys(value, new Set([
    "examId", "roundCode", "reviewVersion", "confirmation", "itemCount",
    "activeItemCount", "excludedItemCount", "confirmedAt", "confirmedBy"
  ]), "finalConfirmation");
  if (value.examId !== examId || value.roundCode !== roundCode || value.reviewVersion !== reviewVersion || value.confirmation !== "confirmed") {
    fail("finalConfirmation identity is invalid");
  }
  const itemCount = Number(value.itemCount);
  const activeItemCount = Number(value.activeItemCount);
  const excludedItemCount = Number(value.excludedItemCount);
  if (![itemCount, activeItemCount, excludedItemCount].every(Number.isSafeInteger)
      || itemCount < 1 || activeItemCount < 0 || excludedItemCount < 0
      || activeItemCount + excludedItemCount !== itemCount) fail("finalConfirmation counts are invalid");
  const confirmedAt = clean(value.confirmedAt);
  const confirmedBy = requiredToken(value.confirmedBy, "finalConfirmation.confirmedBy");
  if (!confirmedAt || !Number.isFinite(Date.parse(confirmedAt))) fail("finalConfirmation.confirmedAt is invalid");
  return Object.freeze({
    examId, roundCode, reviewVersion, confirmation: "confirmed",
    itemCount, activeItemCount, excludedItemCount, confirmedAt, confirmedBy
  });
}

function normalizeReview(review, key) {
  if (!review || typeof review !== "object" || Array.isArray(review)) fail(`reviews.${key} is invalid`);
  rejectUnknownKeys(review, new Set(["examId", "roundCode", "reviewVersion", "examChecks", "items", "finalConfirmation"]), `reviews.${key}`);
  const examId = requiredToken(review.examId, `reviews.${key}.examId`);
  const roundCode = requiredToken(review.roundCode, `reviews.${key}.roundCode`);
  const reviewVersion = requiredToken(review.reviewVersion, `reviews.${key}.reviewVersion`);
  if (examId !== key) fail(`reviews.${key}.examId does not match key`);
  const examChecks = review.examChecks;
  if (!examChecks || typeof examChecks !== "object" || Array.isArray(examChecks)) fail(`reviews.${key}.examChecks is invalid`);
  rejectUnknownKeys(examChecks, new Set(Object.keys(EXAM_CHECKS)), `reviews.${key}.examChecks`);
  const normalizedChecks = {};
  Object.entries(EXAM_CHECKS).forEach(function (entry) {
    if (!entry[1].has(examChecks[entry[0]])) fail(`reviews.${key}.examChecks.${entry[0]} is invalid`);
    normalizedChecks[entry[0]] = examChecks[entry[0]];
  });
  const items = (Array.isArray(review.items) ? review.items : []).map(normalizeItem);
  if (!items.length) fail(`reviews.${key}.items is empty`);
  const numbers = new Set();
  const ids = new Set();
  items.forEach(function (item) {
    if (numbers.has(item.number) || ids.has(item.itemId)) fail(`reviews.${key}.items contains duplicates`);
    numbers.add(item.number); ids.add(item.itemId);
  });
  return Object.freeze({
    examId, roundCode, reviewVersion,
    examChecks: Object.freeze(normalizedChecks),
    items: Object.freeze(items),
    finalConfirmation: normalizeConfirmation(review.finalConfirmation, examId, roundCode, reviewVersion)
  });
}

function normalize(raw) {
  if (!raw || typeof raw !== "object" || raw.schemaVersion !== SCHEMA_VERSION) fail("private review schemaVersion is invalid");
  rejectUnknownKeys(raw, new Set(["schemaVersion", "reviews"]), "private reviews");
  const reviews = {};
  Object.entries(raw.reviews || {}).forEach(function (entry) { reviews[entry[0]] = normalizeReview(entry[1], entry[0]); });
  return Object.freeze({ schemaVersion: SCHEMA_VERSION, reviews: Object.freeze(reviews) });
}

function serializable(root) {
  return JSON.parse(JSON.stringify(root));
}
function revision(root) {
  return crypto.createHash("sha256").update(JSON.stringify(normalize(root))).digest("base64url");
}

function createMemoryStore(initial) {
  let root = normalize(initial);
  return {
    read(examId) {
      const review = root.reviews[examId];
      return review ? { review, revision: revision(root) } : null;
    },
    update(examId, expectedRevision, mutate) {
      if (revision(root) !== expectedRevision) { const error = new Error("private review changed"); error.code = "REVIEW_CONFLICT"; throw error; }
      const current = root.reviews[examId];
      if (!current) return null;
      const nextReview = normalizeReview(mutate(serializable(current)), examId);
      root = normalize({ schemaVersion: SCHEMA_VERSION, reviews: Object.assign({}, serializable(root.reviews), { [examId]: nextReview }) });
      return { review: root.reviews[examId], revision: revision(root) };
    }
  };
}

function createFileStore(filePath, staleLockMs) {
  const resolved = path.resolve(clean(filePath));
  const lockPath = `${resolved}.lock`;
  const staleAfterMs = Math.max(60 * 1000, Number(staleLockMs || 5 * 60 * 1000));
  function load() { return normalize(JSON.parse(fs.readFileSync(resolved, "utf8"))); }
  function processExists(pid) {
    if (!Number.isInteger(pid) || pid < 1) return false;
    try { process.kill(pid, 0); return true; }
    catch (error) { return !error || error.code !== "ESRCH"; }
  }
  function reclaimStaleLock() {
    let stat;
    try { stat = fs.statSync(lockPath); } catch (_) { return true; }
    if (Date.now() - stat.mtimeMs <= staleAfterMs) return false;
    let owner = null;
    try { owner = JSON.parse(fs.readFileSync(lockPath, "utf8")); } catch (_) {}
    if (owner && processExists(Number(owner.pid))) return false;
    const quarantine = `${lockPath}.stale.${crypto.randomUUID()}`;
    try { fs.renameSync(lockPath, quarantine); } catch (_) { return false; }
    try { fs.unlinkSync(quarantine); } catch (_) {}
    return true;
  }
  return {
    read(examId) {
      const root = load();
      return root.reviews[examId] ? { review: root.reviews[examId], revision: revision(root) } : null;
    },
    update(examId, expectedRevision, mutate) {
      let lockHandle;
      const temporary = `${resolved}.${process.pid}.${crypto.randomUUID()}.tmp`;
      try {
        for (let lockAttempt = 0; lockAttempt < 2; lockAttempt += 1) {
          try {
            lockHandle = fs.openSync(lockPath, "wx", 0o600);
            fs.writeFileSync(lockHandle, JSON.stringify({ pid: process.pid, createdAt: new Date().toISOString() }), "utf8");
            fs.fsyncSync(lockHandle);
            break;
          } catch (error) {
            if (!error || error.code !== "EEXIST" || lockAttempt > 0 || !reclaimStaleLock()) {
              if (error && error.code === "EEXIST") { const busy = new Error("private review is busy"); busy.code = "REVIEW_BUSY"; throw busy; }
              throw error;
            }
          }
        }
        const root = load();
        if (revision(root) !== expectedRevision) { const conflict = new Error("private review changed"); conflict.code = "REVIEW_CONFLICT"; throw conflict; }
        const current = root.reviews[examId];
        if (!current) return null;
        const nextReview = normalizeReview(mutate(serializable(current)), examId);
        const nextRoot = normalize({ schemaVersion: SCHEMA_VERSION, reviews: Object.assign({}, serializable(root.reviews), { [examId]: nextReview }) });
        const handle = fs.openSync(temporary, "wx", 0o600);
        try { fs.writeFileSync(handle, `${JSON.stringify(nextRoot, null, 2)}\n`, "utf8"); fs.fsyncSync(handle); }
        finally { fs.closeSync(handle); }
        fs.renameSync(temporary, resolved);
        return { review: nextRoot.reviews[examId], revision: revision(nextRoot) };
      } finally {
        try { fs.unlinkSync(temporary); } catch (_) {}
        if (lockHandle !== undefined) { try { fs.closeSync(lockHandle); } catch (_) {} try { fs.unlinkSync(lockPath); } catch (_) {} }
      }
    }
  };
}

function createStore(options) {
  const opts = options || {};
  if (opts.data) return createMemoryStore(opts.data);
  const filePath = clean(opts.filePath || process.env.HIGHSELECT_PRIVATE_REVIEW_PATH);
  if (!filePath) return null;
  return createFileStore(filePath, opts.staleLockMs);
}

module.exports = { SCHEMA_VERSION, normalize, revision, createStore };
