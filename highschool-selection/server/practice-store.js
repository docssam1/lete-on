"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const questionBankCore = require("../data/question-bank-core.js");
const practiceCore = require("../data/practice-bank-core.js");

const SCHEMA_VERSION = "highselect-private-practice/v1";

function fail(message) { throw new Error(message); }
function clean(value) { return String(value == null ? "" : value).trim(); }
function serializable(value) { return JSON.parse(JSON.stringify(value)); }

function requiredToken(value, label) {
  const token = clean(value);
  if (!token || token.length > 180 || !/^[A-Za-z0-9._:-]+$/.test(token)) fail(`${label} is invalid`);
  return token;
}

function normalizePlan(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail("practice plan is invalid");
  practiceCore.assertPracticeMetadataOnly(value);
  const plan = serializable(value);
  const allowed = new Set([
    "id", "mode", "learnerId", "writer", "policyId", "policyVersion", "plannedAt",
    "releaseStatus", "eligible", "issues", "items", "summary", "approval"
  ]);
  Object.keys(plan).forEach(function (field) { if (!allowed.has(field)) fail(`practice plan.${field} is not allowed`); });
  const mode = clean(plan.mode).toUpperCase();
  if (!questionBankCore.PROGRAM_MODES.includes(mode)) fail("practice plan mode is invalid");
  if (!questionBankCore.isNeutralId(plan.id, "practiceSet", mode)) fail("practice plan id is invalid");
  if (!questionBankCore.isNeutralId(plan.learnerId, "learner", mode)) fail("practice learner id is invalid");
  if (!questionBankCore.isNeutralId(plan.policyId, "policy", mode)) fail("practice policy id is invalid");
  if (plan.writer !== questionBankCore.WRITER) fail("practice plan writer is invalid");
  if (!Number.isSafeInteger(plan.policyVersion) || plan.policyVersion < 1) fail("practice policy version is invalid");
  if (!Number.isFinite(Date.parse(plan.plannedAt))) fail("practice plannedAt is invalid");
  if (!["blocked", "approval_required", "released"].includes(plan.releaseStatus)) fail("practice release status is invalid");
  if (typeof plan.eligible !== "boolean") fail("practice eligibility is invalid");
  if (plan.eligible !== (plan.releaseStatus !== "blocked")) fail("practice eligibility does not match release status");
  if (!Array.isArray(plan.items) || !Array.isArray(plan.issues)) fail("practice plan collections are invalid");
  const questionIds = new Set();
  const familyIds = new Set();
  plan.items.forEach(function (item, index) {
    if (!item || typeof item !== "object" || Array.isArray(item)) fail(`practice plan.items[${index}] is invalid`);
    const itemAllowed = new Set([
      "position", "questionId", "familyId", "relation", "difficultyBand", "curriculumKey",
      "detailCode", "masteryBefore", "dueAt", "scheduledReason"
    ]);
    Object.keys(item).forEach(function (field) { if (!itemAllowed.has(field)) fail(`practice plan.items[${index}].${field} is not allowed`); });
    if (item.position !== index + 1) fail(`practice plan.items[${index}].position is invalid`);
    if (!questionBankCore.isNeutralId(item.questionId, "question", mode)) fail(`practice plan.items[${index}].questionId is invalid`);
    if (!questionBankCore.isNeutralId(item.familyId, "question", mode)) fail(`practice plan.items[${index}].familyId is invalid`);
    if (questionIds.has(item.questionId) || familyIds.has(item.familyId)) fail("practice plan repeats a question or family");
    questionIds.add(item.questionId); familyIds.add(item.familyId);
    if (!practiceCore.RELATION_ORDER.includes(item.relation)) fail(`practice plan.items[${index}].relation is invalid`);
    if (!questionBankCore.DIFFICULTY_BANDS.includes(item.difficultyBand)) fail(`practice plan.items[${index}].difficultyBand is invalid`);
    if (!practiceCore.MASTERY_STATUSES.includes(item.masteryBefore)) fail(`practice plan.items[${index}].masteryBefore is invalid`);
    if (!["initial", "spaced_reattempt"].includes(item.scheduledReason)) fail(`practice plan.items[${index}].scheduledReason is invalid`);
    if (!Number.isFinite(Date.parse(item.dueAt))) fail(`practice plan.items[${index}].dueAt is invalid`);
    if (!/^[A-Z0-9_/-]{7,160}$/.test(clean(item.curriculumKey))) fail(`practice plan.items[${index}].curriculumKey is invalid`);
    if (!/^[A-Z0-9][A-Z0-9_-]{0,31}$/.test(clean(item.detailCode))) fail(`practice plan.items[${index}].detailCode is invalid`);
  });
  if (plan.eligible && plan.items.length === 0) fail("eligible practice plan is empty");
  plan.issues.forEach(function (issue, index) {
    if (!issue || typeof issue !== "object" || Array.isArray(issue)) fail(`practice plan.issues[${index}] is invalid`);
    const keys = Object.keys(issue).sort();
    if (keys.length !== 2 || keys[0] !== "code" || keys[1] !== "context") fail(`practice plan.issues[${index}] fields are invalid`);
    requiredToken(issue.code, `practice plan.issues[${index}].code`);
    if (!clean(issue.context) || clean(issue.context).length > 80) fail(`practice plan.issues[${index}].context is invalid`);
  });
  if (!plan.summary || typeof plan.summary !== "object" || Array.isArray(plan.summary)) fail("practice plan summary is invalid");
  const summaryAllowed = new Set([
    "requestedCount", "selectedCount", "distinctFamilies", "distinctDetails",
    "blockedCandidateCount", "blockedFamilyCount", "byMastery", "byDifficulty", "byRelation"
  ]);
  Object.keys(plan.summary).forEach(function (field) { if (!summaryAllowed.has(field)) fail(`practice plan.summary.${field} is not allowed`); });
  ["requestedCount", "selectedCount", "distinctFamilies", "distinctDetails", "blockedCandidateCount", "blockedFamilyCount"].forEach(function (field) {
    if (!Number.isSafeInteger(plan.summary[field]) || plan.summary[field] < 0) fail(`practice plan.summary.${field} is invalid`);
  });
  if (plan.summary.selectedCount !== plan.items.length || plan.summary.distinctFamilies !== familyIds.size) fail("practice plan summary does not match items");
  ["byMastery", "byDifficulty", "byRelation"].forEach(function (field) {
    const counter = plan.summary[field];
    if (!counter || typeof counter !== "object" || Array.isArray(counter)) fail(`practice plan.summary.${field} is invalid`);
    Object.values(counter).forEach(function (count) { if (!Number.isSafeInteger(count) || count < 0) fail(`practice plan.summary.${field} count is invalid`); });
  });
  if (plan.releaseStatus === "released") {
    const approval = practiceCore.createPracticeSetApproval(Object.assign({ mode }, plan.approval));
    if (approval.practiceSetId !== plan.id || approval.status !== "approved") fail("practice release approval is invalid");
  } else if (Object.prototype.hasOwnProperty.call(plan, "approval")) {
    fail("unreleased practice plan cannot contain approval");
  }
  return Object.freeze(plan);
}

function normalizeRecord(value, key) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(`sets.${key} is invalid`);
  const allowed = new Set(["practiceSetId", "studentId", "plan", "approval"]);
  Object.keys(value).forEach(function (field) {
    if (!allowed.has(field)) fail(`sets.${key}.${field} is not allowed`);
  });
  const practiceSetId = requiredToken(value.practiceSetId, `sets.${key}.practiceSetId`);
  const studentId = requiredToken(value.studentId, `sets.${key}.studentId`);
  const plan = normalizePlan(value.plan);
  if (practiceSetId !== key || plan.id !== key) fail(`sets.${key} identity does not match`);
  let approval = null;
  if (value.approval != null) {
    const candidate = value.approval;
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) fail(`sets.${key}.approval is invalid`);
    const approvalAllowed = new Set(["approvalId", "decisionVersion", "approvedAt", "approvedBy"]);
    Object.keys(candidate).forEach(function (field) {
      if (!approvalAllowed.has(field)) fail(`sets.${key}.approval.${field} is not allowed`);
    });
    approval = Object.freeze({
      approvalId: requiredToken(candidate.approvalId, `sets.${key}.approval.approvalId`),
      decisionVersion: Number(candidate.decisionVersion),
      approvedAt: clean(candidate.approvedAt),
      approvedBy: requiredToken(candidate.approvedBy, `sets.${key}.approval.approvedBy`)
    });
    if (!questionBankCore.isNeutralId(approval.approvalId, "approval", plan.mode)) fail(`sets.${key}.approval.approvalId is invalid`);
    if (!Number.isSafeInteger(approval.decisionVersion) || approval.decisionVersion < 1) fail(`sets.${key}.approval.decisionVersion is invalid`);
    if (!Number.isFinite(Date.parse(approval.approvedAt))) fail(`sets.${key}.approval.approvedAt is invalid`);
    if (plan.releaseStatus !== "released" || plan.approval.id !== approval.approvalId || plan.approval.decisionVersion !== approval.decisionVersion) {
      fail(`sets.${key}.approval does not match released plan`);
    }
  } else if (plan.releaseStatus === "released") {
    fail(`sets.${key}.approval is required`);
  }
  return Object.freeze({ practiceSetId, studentId, plan, approval });
}

function normalize(raw) {
  if (!raw || typeof raw !== "object" || raw.schemaVersion !== SCHEMA_VERSION) fail("private practice schemaVersion is invalid");
  const allowed = new Set(["schemaVersion", "sets"]);
  Object.keys(raw).forEach(function (field) { if (!allowed.has(field)) fail(`private practice.${field} is not allowed`); });
  if (!raw.sets || typeof raw.sets !== "object" || Array.isArray(raw.sets)) fail("private practice sets are invalid");
  const sets = {};
  Object.entries(raw.sets).forEach(function (entry) { sets[entry[0]] = normalizeRecord(entry[1], entry[0]); });
  return Object.freeze({ schemaVersion: SCHEMA_VERSION, sets: Object.freeze(sets) });
}

function revision(root) {
  return crypto.createHash("sha256").update(JSON.stringify(normalize(root))).digest("base64url");
}

function emptyRoot() { return { schemaVersion: SCHEMA_VERSION, sets: {} }; }

function createMemoryStore(initial) {
  let root = normalize(initial || emptyRoot());
  return {
    read(practiceSetId) {
      const record = root.sets[practiceSetId];
      return record ? { record, revision: revision(root) } : null;
    },
    put(record) {
      const normalized = normalizeRecord(record, record && record.practiceSetId);
      const current = root.sets[normalized.practiceSetId];
      if (current) {
        if (JSON.stringify(current) !== JSON.stringify(normalized)) { const conflict = new Error("practice set changed"); conflict.code = "PRACTICE_CONFLICT"; throw conflict; }
        return { record: current, revision: revision(root) };
      }
      root = normalize({ schemaVersion: SCHEMA_VERSION, sets: Object.assign({}, serializable(root.sets), { [normalized.practiceSetId]: normalized }) });
      return { record: root.sets[normalized.practiceSetId], revision: revision(root) };
    },
    update(practiceSetId, expectedRevision, mutate) {
      if (revision(root) !== expectedRevision) { const conflict = new Error("practice store changed"); conflict.code = "PRACTICE_CONFLICT"; throw conflict; }
      const current = root.sets[practiceSetId];
      if (!current) return null;
      const next = normalizeRecord(mutate(serializable(current)), practiceSetId);
      root = normalize({ schemaVersion: SCHEMA_VERSION, sets: Object.assign({}, serializable(root.sets), { [practiceSetId]: next }) });
      return { record: root.sets[practiceSetId], revision: revision(root) };
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
            if (error && error.code === "EEXIST") { const busy = new Error("practice store is busy"); busy.code = "PRACTICE_BUSY"; throw busy; }
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
    read(practiceSetId) {
      const root = load();
      return root.sets[practiceSetId] ? { record: root.sets[practiceSetId], revision: revision(root) } : null;
    },
    put(record) {
      const normalized = normalizeRecord(record, record && record.practiceSetId);
      const next = writeMutation(function (root) {
        const current = root.sets[normalized.practiceSetId];
        if (current && JSON.stringify(current) !== JSON.stringify(normalized)) { const conflict = new Error("practice set changed"); conflict.code = "PRACTICE_CONFLICT"; throw conflict; }
        if (current) return root;
        return { schemaVersion: SCHEMA_VERSION, sets: Object.assign({}, serializable(root.sets), { [normalized.practiceSetId]: normalized }) };
      });
      return { record: next.sets[normalized.practiceSetId], revision: revision(next) };
    },
    update(practiceSetId, expectedRevision, mutate) {
      let result = null;
      const next = writeMutation(function (root) {
        if (revision(root) !== expectedRevision) { const conflict = new Error("practice store changed"); conflict.code = "PRACTICE_CONFLICT"; throw conflict; }
        const current = root.sets[practiceSetId];
        if (!current) return root;
        result = normalizeRecord(mutate(serializable(current)), practiceSetId);
        return { schemaVersion: SCHEMA_VERSION, sets: Object.assign({}, serializable(root.sets), { [practiceSetId]: result }) };
      });
      return result ? { record: next.sets[practiceSetId], revision: revision(next) } : null;
    }
  };
}

function createStore(options) {
  const opts = options || {};
  if (opts.data) return createMemoryStore(opts.data);
  const filePath = clean(opts.filePath || process.env.HIGHSELECT_PRIVATE_PRACTICE_PATH);
  if (!filePath) return null;
  return createFileStore(filePath, opts.staleLockMs);
}

module.exports = { SCHEMA_VERSION, normalize, revision, createStore };
