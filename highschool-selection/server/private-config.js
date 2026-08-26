"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { clean } = require("./security.js");

const RELEASE_FIELDS = Object.freeze({
  releaseStatus: "released",
  answerStatus: "verified",
  classificationStatus: "verified",
  responseSchemaStatus: "verified",
  scoringPolicyStatus: "verified",
  printAuditStatus: "passed",
  signedAssetsStatus: "verified"
});

function fail(message) { throw new Error(message); }

function rejectUnknownKeys(value, allowed, label) {
  Object.keys(value).forEach(function (key) {
    if (!allowed.has(key)) fail(`${label}.${key} is not allowed`);
  });
}

function isValidExpiryDate(value) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;
  const year = Number(match[1]), month = Number(match[2]), day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function normalizeExpiry(value, label) {
  const expiresAt = clean(value);
  if (!expiresAt) return null;
  if (!isValidExpiryDate(expiresAt)) fail(`${label} is invalid`);
  return expiresAt;
}

function validateStudent(student, index) {
  if (!student || typeof student !== "object") fail(`students[${index}] is invalid`);
  rejectUnknownKeys(student, new Set(["studentId", "name", "approvalCodeHash", "role", "grants", "expiresAt"]), `students[${index}]`);
  const studentId = clean(student.studentId);
  const name = clean(student.name);
  if (!/^[A-Za-z0-9_-]{3,120}$/.test(studentId)) fail(`students[${index}].studentId is invalid`);
  if (!name || name.length > 80) fail(`students[${index}].name is invalid`);
  if (!/^scrypt-v1\$[^$]+\$[^$]+$/.test(String(student.approvalCodeHash || ""))) fail(`students[${index}].approvalCodeHash is invalid`);
  const grants = Array.isArray(student.grants) ? Array.from(new Set(student.grants.map(clean).filter(Boolean))) : [];
  const role = student.role === "admin" ? "admin" : "student";
  const expiresAt = role === "admin" ? null : normalizeExpiry(student.expiresAt, `students[${index}].expiresAt`);
  return Object.freeze({ studentId, name, approvalCodeHash: String(student.approvalCodeHash), role, grants, expiresAt });
}

function validateExam(examId, exam) {
  if (!exam || typeof exam !== "object") fail(`exams.${examId} is invalid`);
  const pageAssetRoot = clean(exam.pageAssetRoot);
  if (!path.isAbsolute(pageAssetRoot)) fail(`exams.${examId}.pageAssetRoot must be absolute`);
  return Object.freeze(Object.assign({}, exam, {
    pageAssetRoot,
    finalRoundConfirmation: exam.finalRoundConfirmation === true
  }));
}

function normalize(raw) {
  if (!raw || typeof raw !== "object" || raw.schemaVersion !== "highselect-private-config/v1") fail("private config schemaVersion is invalid");
  rejectUnknownKeys(raw, new Set(["schemaVersion", "students", "exams"]), "private config");
  const students = (Array.isArray(raw.students) ? raw.students : []).map(validateStudent);
  const ids = new Set();
  students.forEach(function (student) {
    if (ids.has(student.studentId)) fail("duplicate studentId");
    ids.add(student.studentId);
  });
  const exams = {};
  Object.entries(raw.exams || {}).forEach(function (entry) { exams[entry[0]] = validateExam(entry[0], entry[1]); });
  students.forEach(function (student, index) {
    student.grants.forEach(function (examId) {
      if (!Object.prototype.hasOwnProperty.call(exams, examId)) fail(`students[${index}].grants contains an unknown exam`);
    });
  });
  return Object.freeze({ schemaVersion: raw.schemaVersion, students: Object.freeze(students), exams: Object.freeze(exams) });
}

function load(configPath) {
  const resolved = path.resolve(clean(configPath));
  return normalize(JSON.parse(fs.readFileSync(resolved, "utf8")));
}

function isReleased(exam) {
  if (!exam || exam.finalRoundConfirmation !== true) return false;
  return Object.keys(RELEASE_FIELDS).every(function (key) { return exam[key] === RELEASE_FIELDS[key]; });
}

function createLoader(options) {
  const opts = options || {};
  if (opts.config) {
    const fixed = normalize(opts.config);
    return function () { return fixed; };
  }
  const configPath = clean(opts.configPath || process.env.HIGHSELECT_PRIVATE_CONFIG_PATH);
  if (!configPath) return function () { throw new Error("HIGHSELECT_PRIVATE_CONFIG_PATH is not configured"); };
  return function () { return load(configPath); };
}

function createWriter(options) {
  const opts = options || {};
  const configPath = clean(opts.configPath || process.env.HIGHSELECT_PRIVATE_CONFIG_PATH);
  if (!configPath) return null;
  const resolved = path.resolve(configPath);
  const lockPath = `${resolved}.lock`;
  const staleLockMs = Math.max(60 * 1000, Number(opts.staleLockMs || 5 * 60 * 1000));
  function processExists(pid) {
    if (!Number.isInteger(pid) || pid < 1) return false;
    try { process.kill(pid, 0); return true; }
    catch (error) { return !error || error.code !== "ESRCH"; }
  }
  function reclaimStaleLock() {
    let stat;
    try { stat = fs.statSync(lockPath); } catch (_) { return true; }
    if (Date.now() - stat.mtimeMs <= staleLockMs) return false;
    let owner = null;
    try { owner = JSON.parse(fs.readFileSync(lockPath, "utf8")); } catch (_) {}
    if (owner && processExists(Number(owner.pid))) return false;
    const quarantine = `${lockPath}.stale.${crypto.randomUUID()}`;
    try { fs.renameSync(lockPath, quarantine); }
    catch (_) { return false; }
    try { fs.unlinkSync(quarantine); } catch (_) {}
    return true;
  }
  return function (candidate, expectedRevision) {
    const normalized = normalize(candidate);
    const temporary = `${resolved}.${process.pid}.${crypto.randomUUID()}.tmp`;
    let lockHandle;
    let temporaryHandle;
    try {
      for (let lockAttempt = 0; lockAttempt < 2; lockAttempt += 1) {
        try {
          lockHandle = fs.openSync(lockPath, "wx", 0o600);
          fs.writeFileSync(lockHandle, JSON.stringify({ pid: process.pid, createdAt: new Date().toISOString() }), "utf8");
          fs.fsyncSync(lockHandle);
          break;
        } catch (error) {
          if (!error || error.code !== "EEXIST" || lockAttempt > 0 || !reclaimStaleLock()) {
            if (error && error.code === "EEXIST") {
              const busy = new Error("private config is busy");
              busy.code = "CONFIG_BUSY";
              throw busy;
            }
            throw error;
          }
        }
      }
      if (expectedRevision && revision(load(resolved)) !== expectedRevision) {
        const conflict = new Error("private config changed");
        conflict.code = "CONFIG_CONFLICT";
        throw conflict;
      }
      temporaryHandle = fs.openSync(temporary, "wx", 0o600);
      fs.writeFileSync(temporaryHandle, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
      fs.fsyncSync(temporaryHandle);
      fs.closeSync(temporaryHandle);
      temporaryHandle = undefined;
      fs.renameSync(temporary, resolved);
    } catch (error) {
      if (temporaryHandle !== undefined) {
        try { fs.closeSync(temporaryHandle); } catch (_) {}
      }
      try { fs.unlinkSync(temporary); } catch (_) {}
      throw error;
    } finally {
      if (lockHandle !== undefined) {
        try { fs.closeSync(lockHandle); } catch (_) {}
        try { fs.unlinkSync(lockPath); } catch (_) {}
      }
    }
    return normalized;
  };
}

function revision(config) {
  const normalized = normalize(config);
  return crypto.createHash("sha256").update(JSON.stringify(normalized)).digest("base64url");
}

function isStudentExpired(student, nowMs) {
  if (!student || student.role === "admin" || !student.expiresAt) return false;
  const endOfDayKorea = Date.parse(`${student.expiresAt}T23:59:59.999+09:00`);
  return !Number.isFinite(endOfDayKorea) || endOfDayKorea < Number(nowMs == null ? Date.now() : nowMs);
}

module.exports = { RELEASE_FIELDS, normalize, load, isReleased, createLoader, createWriter, revision, isStudentExpired, isValidExpiryDate };
