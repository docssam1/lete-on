"use strict";

// Private, metadata-only storage for the administrator exam editor.  Canonical
// question records remain in the question bank; drafts only remember which IDs
// were placed, in what order, and how a placement was replaced.
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const questionBankCore = require("../data/question-bank-core.js");
const examOutputSettings = require("../data/exam-output-settings.js");

const SCHEMA_VERSION = "highselect-private-exam-drafts/v1";
const EDITABLE_DRAFT_FIELDS = Object.freeze([
  "draftId", "profileId", "targetId", "durationMinutes", "scopeKeys", "sortMode", "viewMode", "placements"
]);
const SORT_MODES = Object.freeze(["user", "type_asc", "difficulty_asc", "objective_subjective", "random"]);
const VIEW_MODES = Object.freeze(["question", "question_answer", "question_solution_answer"]);
const SELECTION_KINDS = Object.freeze(["recommended", "manual", "twin", "similar"]);
const RELATIONSHIPS = Object.freeze(["manual", "twin", "similar"]);
const FORBIDDEN_KEYS = new Set([
  "answer", "answers", "answerspec", "answerkey", "correctanswer", "solution", "explanation",
  "questiontext", "prompt", "stem", "content", "html", "body", "sourcepath", "storagepath",
  "filepath", "path", "url", "uri", "pdfurl", "downloadurl", "storageurl", "originalurl"
]);

function fail(message) { throw new Error(message); }
function clean(value) { return String(value == null ? "" : value).trim(); }
function serializable(value) { return JSON.parse(JSON.stringify(value)); }
function own(object, key) { return Object.prototype.hasOwnProperty.call(object, key); }

function token(value, label, maxLength) {
  const normalized = clean(value);
  if (!normalized || normalized.length > (maxLength || 180) || !/^[A-Za-z0-9._:-]+$/.test(normalized)) fail(`${label} is invalid`);
  return normalized;
}

function timestamp(value, label) {
  const normalized = clean(value);
  if (!Number.isFinite(Date.parse(normalized))) fail(`${label} is invalid`);
  return normalized;
}

function rejectContent(value, label) {
  if (Array.isArray(value)) {
    value.forEach(function (item, index) { rejectContent(item, `${label}[${index}]`); });
    return;
  }
  if (!value || typeof value !== "object") return;
  Object.entries(value).forEach(function (entry) {
    const key = entry[0];
    if (FORBIDDEN_KEYS.has(key.toLowerCase())) fail(`${label}.${key} is not allowed`);
    rejectContent(entry[1], `${label}.${key}`);
  });
}

function isQuestionId(value) {
  return questionBankCore.isNeutralId(value, "question") || questionBankCore.isSharedBankId(value, "question");
}

function normalizeScopeKeys(value) {
  if (!Array.isArray(value) || value.length > 160) fail("draft scopeKeys is invalid");
  const keys = value.map(function (item, index) {
    const key = clean(item).replace(/\/+$/, "");
    if (!key || key.length > 160 || key.includes("..") || key.includes("\\")) fail(`draft scopeKeys[${index}] is invalid`);
    return key;
  });
  if (new Set(keys).size !== keys.length) fail("draft scopeKeys must be unique");
  return Object.freeze(keys);
}

function normalizeHistory(value, label) {
  if (!Array.isArray(value) || value.length > 100) fail(`${label} is invalid`);
  return Object.freeze(value.map(function (entry, index) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) fail(`${label}[${index}] is invalid`);
    const allowed = new Set(["fromItemId", "toItemId", "relationship", "reasonCode"]);
    Object.keys(entry).forEach(function (key) { if (!allowed.has(key)) fail(`${label}[${index}].${key} is not allowed`); });
    rejectContent(entry, `${label}[${index}]`);
    if (!isQuestionId(entry.fromItemId) || !isQuestionId(entry.toItemId)) fail(`${label}[${index}] question ID is invalid`);
    if (!RELATIONSHIPS.includes(entry.relationship)) fail(`${label}[${index}].relationship is invalid`);
    return Object.freeze({
      fromItemId: clean(entry.fromItemId),
      toItemId: clean(entry.toItemId),
      relationship: entry.relationship,
      reasonCode: token(entry.reasonCode, `${label}[${index}].reasonCode`, 80)
    });
  }));
}

function normalizePlacements(value) {
  if (!Array.isArray(value) || value.length > 250) fail("draft placements is invalid");
  const placementIds = new Set();
  const itemIds = new Set();
  return Object.freeze(value.map(function (entry, index) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) fail(`draft placements[${index}] is invalid`);
    const allowed = new Set(["placementId", "itemId", "order", "score", "locked", "selectionKind", "replacementHistory"]);
    Object.keys(entry).forEach(function (key) { if (!allowed.has(key)) fail(`draft placements[${index}].${key} is not allowed`); });
    rejectContent(entry, `draft placements[${index}]`);
    const placementId = token(entry.placementId, `draft placements[${index}].placementId`, 160);
    const itemId = clean(entry.itemId);
    if (!isQuestionId(itemId)) fail(`draft placements[${index}].itemId is invalid`);
    if (placementIds.has(placementId) || itemIds.has(itemId)) fail("draft placements repeat an ID");
    if (!Number.isSafeInteger(entry.order) || entry.order !== index + 1) fail(`draft placements[${index}].order is invalid`);
    if (!Number.isFinite(entry.score) || entry.score < 0 || entry.score > 1000) fail(`draft placements[${index}].score is invalid`);
    if (typeof entry.locked !== "boolean" || !SELECTION_KINDS.includes(entry.selectionKind)) fail(`draft placements[${index}] selection metadata is invalid`);
    placementIds.add(placementId);
    itemIds.add(itemId);
    return Object.freeze({
      placementId,
      itemId,
      order: index + 1,
      score: Number(entry.score),
      locked: entry.locked,
      selectionKind: entry.selectionKind,
      replacementHistory: normalizeHistory(entry.replacementHistory, `draft placements[${index}].replacementHistory`)
    });
  }));
}

function normalizeRecord(value, key) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(`drafts.${key} is invalid`);
  const allowed = new Set(EDITABLE_DRAFT_FIELDS.concat(["outputSettings", "createdAt", "updatedAt", "updatedBy"]));
  Object.keys(value).forEach(function (field) { if (!allowed.has(field)) fail(`drafts.${key}.${field} is not allowed`); });
  rejectContent(value, `drafts.${key}`);
  const draftId = token(value.draftId, `drafts.${key}.draftId`);
  const profileId = clean(value.profileId).toUpperCase();
  if (!questionBankCore.PROGRAM_MODES.includes(profileId)) fail(`drafts.${key}.profileId is invalid`);
  if (draftId !== key) fail(`drafts.${key} identity does not match`);
  if (!Number.isSafeInteger(value.durationMinutes) || value.durationMinutes < 1 || value.durationMinutes > 600) fail(`drafts.${key}.durationMinutes is invalid`);
  if (!SORT_MODES.includes(value.sortMode) || !VIEW_MODES.includes(value.viewMode)) fail(`drafts.${key} display settings are invalid`);
  const placements = normalizePlacements(value.placements);
  return Object.freeze({
    draftId,
    profileId,
    targetId: token(value.targetId, `drafts.${key}.targetId`),
    durationMinutes: value.durationMinutes,
    scopeKeys: normalizeScopeKeys(value.scopeKeys),
    sortMode: value.sortMode,
    viewMode: value.viewMode,
    placements,
    outputSettings: value.outputSettings == null ? null : examOutputSettings.createOutputSettings(value.outputSettings),
    createdAt: timestamp(value.createdAt, `drafts.${key}.createdAt`),
    updatedAt: timestamp(value.updatedAt, `drafts.${key}.updatedAt`),
    updatedBy: token(value.updatedBy, `drafts.${key}.updatedBy`)
  });
}

function normalize(raw) {
  if (!raw || typeof raw !== "object" || raw.schemaVersion !== SCHEMA_VERSION) fail("private exam draft schemaVersion is invalid");
  const allowed = new Set(["schemaVersion", "drafts"]);
  Object.keys(raw).forEach(function (field) { if (!allowed.has(field)) fail(`private exam drafts.${field} is not allowed`); });
  if (!raw.drafts || typeof raw.drafts !== "object" || Array.isArray(raw.drafts)) fail("private exam drafts collection is invalid");
  const drafts = {};
  Object.entries(raw.drafts).forEach(function (entry) { drafts[entry[0]] = normalizeRecord(entry[1], entry[0]); });
  return Object.freeze({ schemaVersion: SCHEMA_VERSION, drafts: Object.freeze(drafts) });
}

function revision(root) { return crypto.createHash("sha256").update(JSON.stringify(normalize(root))).digest("base64url"); }
function emptyRoot() { return { schemaVersion: SCHEMA_VERSION, drafts: {} }; }
function conflict(message) { const error = new Error(message); error.code = "EXAM_DRAFT_CONFLICT"; return error; }

function createMemoryStore(initial) {
  let root = normalize(initial || emptyRoot());
  function snapshot(record) { return record ? serializable(record) : record; }
  return {
    list() { return { drafts: Object.values(root.drafts).map(snapshot), revision: revision(root) }; },
    read(draftId) { const draft = root.drafts[draftId]; return draft ? { draft: snapshot(draft), revision: revision(root) } : null; },
    create(draft) {
      const normalized = normalizeRecord(draft, draft && draft.draftId);
      const current = root.drafts[normalized.draftId];
      if (current) {
        if (JSON.stringify(current) !== JSON.stringify(normalized)) throw conflict("exam draft changed");
        return { draft: snapshot(current), revision: revision(root) };
      }
      root = normalize({ schemaVersion: SCHEMA_VERSION, drafts: Object.assign({}, serializable(root.drafts), { [normalized.draftId]: normalized }) });
      return { draft: snapshot(root.drafts[normalized.draftId]), revision: revision(root) };
    },
    update(draftId, expectedRevision, mutate) {
      if (revision(root) !== expectedRevision) throw conflict("exam draft store changed");
      const current = root.drafts[draftId];
      if (!current) return null;
      const next = normalizeRecord(mutate(snapshot(current)), draftId);
      root = normalize({ schemaVersion: SCHEMA_VERSION, drafts: Object.assign({}, serializable(root.drafts), { [draftId]: next }) });
      return { draft: snapshot(root.drafts[draftId]), revision: revision(root) };
    },
    remove(draftId, expectedRevision) {
      if (revision(root) !== expectedRevision) throw conflict("exam draft store changed");
      if (!root.drafts[draftId]) return null;
      const drafts = serializable(root.drafts);
      delete drafts[draftId];
      root = normalize({ schemaVersion: SCHEMA_VERSION, drafts });
      return { revision: revision(root) };
    }
  };
}

function createFileStore(filePath, staleLockMs) {
  const resolved = path.resolve(filePath);
  const lockPath = `${resolved}.lock`;
  const staleAfterMs = Math.max(60 * 1000, Number(staleLockMs || 5 * 60 * 1000));
  function load() { return fs.existsSync(resolved) ? normalize(JSON.parse(fs.readFileSync(resolved, "utf8"))) : normalize(emptyRoot()); }
  function processExists(pid) { try { process.kill(pid, 0); return true; } catch (error) { return !error || error.code !== "ESRCH"; } }
  function reclaimStaleLock() {
    let stat; try { stat = fs.statSync(lockPath); } catch (_) { return true; }
    if (Date.now() - stat.mtimeMs <= staleAfterMs) return false;
    let owner = null; try { owner = JSON.parse(fs.readFileSync(lockPath, "utf8")); } catch (_) {}
    if (owner && Number.isInteger(Number(owner.pid)) && processExists(Number(owner.pid))) return false;
    const quarantine = `${lockPath}.stale.${crypto.randomUUID()}`;
    try { fs.renameSync(lockPath, quarantine); fs.unlinkSync(quarantine); return true; } catch (_) { return false; }
  }
  function writeMutation(action) {
    fs.mkdirSync(path.dirname(resolved), { recursive: true });
    let lockHandle;
    const temporary = `${resolved}.${process.pid}.${crypto.randomUUID()}.tmp`;
    try {
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try { lockHandle = fs.openSync(lockPath, "wx", 0o600); fs.writeFileSync(lockHandle, JSON.stringify({ pid: process.pid }), "utf8"); break; }
        catch (error) {
          if (!error || error.code !== "EEXIST" || attempt || !reclaimStaleLock()) {
            if (error && error.code === "EEXIST") { const busy = new Error("exam draft store is busy"); busy.code = "EXAM_DRAFT_BUSY"; throw busy; }
            throw error;
          }
        }
      }
      const next = normalize(action(load()));
      fs.writeFileSync(temporary, `${JSON.stringify(next, null, 2)}\n`, { encoding: "utf8", mode: 0o600, flag: "wx" });
      fs.renameSync(temporary, resolved);
      return next;
    } finally {
      try { fs.unlinkSync(temporary); } catch (_) {}
      if (lockHandle !== undefined) { try { fs.closeSync(lockHandle); } catch (_) {} try { fs.unlinkSync(lockPath); } catch (_) {} }
    }
  }
  return {
    list() { const root = load(); return { drafts: Object.values(root.drafts).map(serializable), revision: revision(root) }; },
    read(draftId) { const root = load(); return root.drafts[draftId] ? { draft: serializable(root.drafts[draftId]), revision: revision(root) } : null; },
    create(draft) {
      const normalized = normalizeRecord(draft, draft && draft.draftId);
      const root = writeMutation(function (current) {
        const existing = current.drafts[normalized.draftId];
        if (existing && JSON.stringify(existing) !== JSON.stringify(normalized)) throw conflict("exam draft changed");
        return existing ? current : { schemaVersion: SCHEMA_VERSION, drafts: Object.assign({}, serializable(current.drafts), { [normalized.draftId]: normalized }) };
      });
      return { draft: serializable(root.drafts[normalized.draftId]), revision: revision(root) };
    },
    update(draftId, expectedRevision, mutate) {
      let changed = false;
      const root = writeMutation(function (current) {
        if (revision(current) !== expectedRevision) throw conflict("exam draft store changed");
        const existing = current.drafts[draftId];
        if (!existing) return current;
        changed = true;
        const next = normalizeRecord(mutate(serializable(existing)), draftId);
        return { schemaVersion: SCHEMA_VERSION, drafts: Object.assign({}, serializable(current.drafts), { [draftId]: next }) };
      });
      return changed ? { draft: serializable(root.drafts[draftId]), revision: revision(root) } : null;
    },
    remove(draftId, expectedRevision) {
      let removed = false;
      const root = writeMutation(function (current) {
        if (revision(current) !== expectedRevision) throw conflict("exam draft store changed");
        if (!own(current.drafts, draftId)) return current;
        removed = true;
        const drafts = serializable(current.drafts); delete drafts[draftId];
        return { schemaVersion: SCHEMA_VERSION, drafts };
      });
      return removed ? { revision: revision(root) } : null;
    }
  };
}

function createStore(options) {
  const opts = options || {};
  if (opts.data) return createMemoryStore(opts.data);
  const filePath = clean(opts.filePath || process.env.HIGHSELECT_PRIVATE_EXAM_DRAFT_PATH);
  return filePath ? createFileStore(filePath, opts.staleLockMs) : null;
}

module.exports = { SCHEMA_VERSION, EDITABLE_DRAFT_FIELDS, normalize, revision, createStore };
