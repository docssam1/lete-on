"use strict";

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

function validateStudent(student, index) {
  if (!student || typeof student !== "object") fail(`students[${index}] is invalid`);
  const studentId = clean(student.studentId);
  const name = clean(student.name);
  if (!/^[A-Za-z0-9_-]{3,120}$/.test(studentId)) fail(`students[${index}].studentId is invalid`);
  if (!name || name.length > 80) fail(`students[${index}].name is invalid`);
  if (!/^scrypt-v1\$[^$]+\$[^$]+$/.test(String(student.approvalCodeHash || ""))) fail(`students[${index}].approvalCodeHash is invalid`);
  const grants = Array.isArray(student.grants) ? Array.from(new Set(student.grants.map(clean).filter(Boolean))) : [];
  return Object.freeze({ studentId, name, approvalCodeHash: String(student.approvalCodeHash), role: student.role === "admin" ? "admin" : "student", grants });
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
  const students = (Array.isArray(raw.students) ? raw.students : []).map(validateStudent);
  const ids = new Set();
  const names = new Set();
  students.forEach(function (student) {
    if (ids.has(student.studentId)) fail("duplicate studentId");
    if (names.has(student.name)) fail("duplicate student name");
    ids.add(student.studentId);
    names.add(student.name);
  });
  const exams = {};
  Object.entries(raw.exams || {}).forEach(function (entry) { exams[entry[0]] = validateExam(entry[0], entry[1]); });
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

module.exports = { RELEASE_FIELDS, normalize, load, isReleased, createLoader };
