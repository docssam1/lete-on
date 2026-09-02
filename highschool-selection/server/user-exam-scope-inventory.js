"use strict";

const fs = require("node:fs");
const path = require("node:path");

const SCHEMA_VERSION = "highselect-private-user-exam-scope-inventory/v1";
const MODES = new Set(["academy_prep", "learning"]);
const CODE = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
const SCOPE = /^[A-Za-z0-9._:-]+(?:\/[A-Za-z0-9._:-]+)*$/;

function fail(message) { throw new Error(message); }
function clean(value) { return String(value == null ? "" : value).trim(); }
function exactKeys(value, allowed, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(`${label} is invalid`);
  Object.keys(value).forEach(function (key) {
    if (!allowed.has(key)) fail(`${label}.${key} is not allowed`);
  });
}
function code(value, label, nullable) {
  if (nullable && value == null) return null;
  const result = clean(value);
  if (!CODE.test(result)) fail(`${label} is invalid`);
  return result;
}
function scope(value, label) {
  const result = clean(value).replace(/\/+$/, "");
  if (!result || result.length > 320 || !SCOPE.test(result)) fail(`${label} is invalid`);
  if (result.split("/").some(function (segment) { return segment === "." || segment === ".."; })) fail(`${label} cannot contain relative path segments`);
  return result;
}
function targetKey(mode, academyId, semesterId) {
  return `${mode}:${academyId || "*"}:${semesterId}`;
}
function isWithin(value, roots) {
  return roots.some(function (root) { return value === root || value.startsWith(`${root}/`); });
}

function normalize(raw) {
  exactKeys(raw, new Set(["schemaVersion", "targets"]), "scope inventory");
  if (raw.schemaVersion !== SCHEMA_VERSION) fail("scope inventory schemaVersion is invalid");
  if (!Array.isArray(raw.targets) || !raw.targets.length) fail("scope inventory targets are required");
  const targets = {};
  raw.targets.forEach(function (entry, index) {
    const label = `scope inventory targets[${index}]`;
    exactKeys(entry, new Set(["generationMode", "academyId", "semesterId", "scopeKeys", "status"]), label);
    const generationMode = clean(entry.generationMode);
    if (!MODES.has(generationMode)) fail(`${label}.generationMode is invalid`);
    const academyId = code(entry.academyId, `${label}.academyId`, true);
    if (generationMode === "academy_prep" && academyId === null) fail(`${label}.academyId is required`);
    if (generationMode === "learning" && academyId !== null) fail(`${label}.academyId must be null`);
    const semesterId = code(entry.semesterId, `${label}.semesterId`, false);
    if (entry.status !== "approved") fail(`${label}.status must be approved`);
    if (!Array.isArray(entry.scopeKeys) || !entry.scopeKeys.length || entry.scopeKeys.length > 1000) {
      fail(`${label}.scopeKeys are required`);
    }
    const scopeKeys = Array.from(new Set(entry.scopeKeys.map(function (value, scopeIndex) {
      return scope(value, `${label}.scopeKeys[${scopeIndex}]`);
    }))).sort();
    const key = targetKey(generationMode, academyId, semesterId);
    if (targets[key]) fail("scope inventory cannot contain duplicate targets");
    targets[key] = Object.freeze({ generationMode, academyId, semesterId, scopeKeys: Object.freeze(scopeKeys), status: "approved" });
  });
  return Object.freeze({ schemaVersion: SCHEMA_VERSION, targets: Object.freeze(targets) });
}

function create(raw) {
  const data = normalize(raw);
  return Object.freeze({
    requireTarget(generationModeInput, academyIdInput, semesterIdInput, requestedScopesInput) {
      const generationMode = clean(generationModeInput);
      const academyId = academyIdInput == null ? null : clean(academyIdInput);
      const semesterId = clean(semesterIdInput);
      const target = data.targets[targetKey(generationMode, academyId, semesterId)];
      if (!target) fail("academy-semester scope is not approved");
      if (!Array.isArray(requestedScopesInput) || !requestedScopesInput.length) fail("requested scopeKeys are required");
      const requestedScopes = requestedScopesInput.map(function (value, index) {
        return scope(value, `requested scopeKeys[${index}]`);
      });
      requestedScopes.forEach(function (requested) {
        if (!isWithin(requested, target.scopeKeys)) fail("requested scopeKey is outside the approved academy-semester scope");
      });
      return Object.freeze({ target, requestedScopes: Object.freeze(requestedScopes) });
    },
    assertItemScope(curriculumPathInput, approvedTarget, requestedScopes) {
      const curriculumPath = scope(curriculumPathInput, "candidate curriculumPath");
      if (!isWithin(curriculumPath, approvedTarget.scopeKeys)) fail("candidate is outside the approved academy-semester scope");
      if (!isWithin(curriculumPath, requestedScopes)) fail("candidate is outside the requested scopeKeys");
      return true;
    }
  });
}

function createLoader(options) {
  const opts = options || {};
  if (opts.data) {
    const inventory = create(opts.data);
    return function () { return inventory; };
  }
  const filePath = clean(opts.filePath || process.env.HIGHSELECT_PRIVATE_USER_EXAM_SCOPE_INVENTORY_PATH);
  if (!filePath) return null;
  const resolved = path.resolve(filePath);
  return function () { return create(JSON.parse(fs.readFileSync(resolved, "utf8"))); };
}

module.exports = { SCHEMA_VERSION, normalize, create, createLoader };
