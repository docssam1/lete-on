"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const editorCore = require("../data/exam-editor-core.js");

const SCHEMA_VERSION = "highselect-private-exam-drafts/v1";

function fail(message) { throw new Error(message); }
function clean(value) { return String(value == null ? "" : value).trim(); }
function serializable(value) { return JSON.parse(JSON.stringify(value)); }

function token(value, label) {
  const result = clean(value);
  if (!result || result.length > 180 || !/^[A-Za-z0-9._:-]+$/.test(result)) fail(`${label} is invalid`);
  return result;
}

function normalizeRecord(value, key) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(`drafts.${key} is invalid`);
  const allowed = new Set(["draftId", "createdBy", "updatedBy", "createdAt", "updatedAt", "draft"]);
  Object.keys(value).forEach(function (field) { if (!allowed.has(field)) fail(`drafts.${key}.${field} is not allowed`); });
  const draftId = token(value.draftId, `drafts.${key}.draftId`);
  if (draftId !== key) fail(`drafts.${key}.draftId does not match key`);
  const createdAt = clean(value.createdAt);
  const updatedAt = clean(value.updatedAt);
  if (!Number.isFinite(Date.parse(createdAt)) || !Number.isFinite(Date.parse(updatedAt))) fail(`drafts.${key} timestamp is invalid`);
  const draft = editorCore.createDraft(serializable(value.draft));
  if (draft.draftId !== draftId) fail(`drafts.${key}.draft identity does not match`);
  return Object.freeze({
    draftId,
    createdBy: token(value.createdBy, `drafts.${key}.createdBy`),
    updatedBy: token(value.updatedBy, `drafts.${key}.updatedBy`),
    createdAt,
    updatedAt,
    draft
  });
}

function normalize(raw) {
  if (!raw || typeof raw !== "object" || raw.schemaVersion !== SCHEMA_VERSION) fail("private exam drafts schemaVersion is invalid");
  const allowed = new Set(["schemaVersion", "drafts"]);
  Object.keys(raw).forEach(function (field) { if (!allowed.has(field)) fail(`private exam drafts.${field} is not allowed`); });
  if (!raw.drafts || typeof raw.drafts !== "object" || Array.isArray(raw.drafts)) fail("private exam drafts are invalid");
  const drafts = {};
  Object.entries(raw.drafts).forEach(function (entry) { drafts[entry[0]] = normalizeRecord(entry[1], entry[0]); });
  return Object.freeze({ schemaVersion: SCHEMA_VERSION, drafts: Object.freeze(drafts) });
}

function emptyRoot() { return { schemaVersion: SCHEMA_VERSION, drafts: {} }; }

function createMemoryStore(initial) {
  let root = normalize(initial || emptyRoot());
  return {
    read(draftId) {
      return root.drafts[draftId] || null;
    },
    create(record) {
      const normalized = normalizeRecord(record, record && record.draftId);
      if (root.drafts[normalized.draftId]) { const error = new Error("exam draft already exists"); error.code = "EXAM_DRAFT_CONFLICT"; throw error; }
      root = normalize({ schemaVersion: SCHEMA_VERSION, drafts: Object.assign({}, serializable(root.drafts), { [normalized.draftId]: normalized }) });
      return root.drafts[normalized.draftId];
    },
    update(draftId, expectedRevision, mutate) {
      const current = root.drafts[draftId];
      if (!current) return null;
      if (current.draft.revision !== expectedRevision) { const error = new Error("exam draft revision changed"); error.code = "EXAM_DRAFT_CONFLICT"; throw error; }
      const nextRecord = normalizeRecord(mutate(serializable(current)), draftId);
      root = normalize({ schemaVersion: SCHEMA_VERSION, drafts: Object.assign({}, serializable(root.drafts), { [draftId]: nextRecord }) });
      return root.drafts[draftId];
    }
  };
}

function createFileStore(filePath, staleLockMs) {
  const resolved = path.resolve(filePath);
  const lockPath = `${resolved}.lock`;
  const staleAfterMs = Math.max(60 * 1000, Number(staleLockMs || 5 * 60 * 1000));
  function load() { return fs.existsSync(resolved) ? normalize(JSON.parse(fs.readFileSync(resolved, "utf8"))) : normalize(emptyRoot()); }
  function processExists(pid) {
    if (!Number.isInteger(pid) || pid < 1) return false;
    try { process.kill(pid, 0); return true; } catch (error) { return !error || error.code !== "ESRCH"; }
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
  function writeMutation(action) {
    fs.mkdirSync(path.dirname(resolved), { recursive: true });
    let lockHandle;
    const temporary = `${resolved}.${process.pid}.${crypto.randomUUID()}.tmp`;
    try {
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          lockHandle = fs.openSync(lockPath, "wx", 0o600);
          fs.writeFileSync(lockHandle, JSON.stringify({ pid: process.pid, createdAt: new Date().toISOString() }), "utf8");
          fs.fsyncSync(lockHandle);
          break;
        } catch (error) {
          if (!error || error.code !== "EEXIST" || attempt > 0 || !reclaimStaleLock()) {
            if (error && error.code === "EEXIST") { const busy = new Error("exam draft store is busy"); busy.code = "EXAM_DRAFT_BUSY"; throw busy; }
            throw error;
          }
        }
      }
      const next = normalize(action(load()));
      const handle = fs.openSync(temporary, "wx", 0o600);
      try { fs.writeFileSync(handle, `${JSON.stringify(next, null, 2)}\n`, "utf8"); fs.fsyncSync(handle); } finally { fs.closeSync(handle); }
      fs.renameSync(temporary, resolved);
      return next;
    } finally {
      try { fs.unlinkSync(temporary); } catch (_) {}
      if (lockHandle !== undefined) { try { fs.closeSync(lockHandle); } catch (_) {} try { fs.unlinkSync(lockPath); } catch (_) {} }
    }
  }
  return {
    read(draftId) { return load().drafts[draftId] || null; },
    create(record) {
      const normalized = normalizeRecord(record, record && record.draftId);
      const next = writeMutation(function (root) {
        if (root.drafts[normalized.draftId]) { const error = new Error("exam draft already exists"); error.code = "EXAM_DRAFT_CONFLICT"; throw error; }
        return { schemaVersion: SCHEMA_VERSION, drafts: Object.assign({}, serializable(root.drafts), { [normalized.draftId]: normalized }) };
      });
      return next.drafts[normalized.draftId];
    },
    update(draftId, expectedRevision, mutate) {
      let result = null;
      const next = writeMutation(function (root) {
        const current = root.drafts[draftId];
        if (!current) return root;
        if (current.draft.revision !== expectedRevision) { const error = new Error("exam draft revision changed"); error.code = "EXAM_DRAFT_CONFLICT"; throw error; }
        result = normalizeRecord(mutate(serializable(current)), draftId);
        return { schemaVersion: SCHEMA_VERSION, drafts: Object.assign({}, serializable(root.drafts), { [draftId]: result }) };
      });
      return result ? next.drafts[draftId] : null;
    }
  };
}

function createStore(options) {
  const opts = options || {};
  if (opts.data) return createMemoryStore(opts.data);
  const filePath = clean(opts.filePath || process.env.HIGHSELECT_PRIVATE_EXAM_DRAFTS_PATH);
  if (!filePath) return null;
  return createFileStore(filePath, opts.staleLockMs);
}

module.exports = { SCHEMA_VERSION, normalize, createStore };
