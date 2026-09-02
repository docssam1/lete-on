"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const libraryCore = require("../data/user-exam-library-core.js");

const SCHEMA_VERSION = "highselect-private-user-exam-library/v1";

function fail(message) { throw new Error(message); }
function clean(value) { return String(value == null ? "" : value).trim(); }
function serializable(value) { return JSON.parse(JSON.stringify(value)); }

function token(value, label) {
  const result = clean(value);
  if (!result || result.length > 180 || !/^[A-Za-z0-9._:-]+$/.test(result)) fail(`${label} is invalid`);
  return result;
}

function exactKeys(value, allowed, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(`${label} is invalid`);
  Object.keys(value).forEach(function (key) {
    if (!allowed.has(key)) fail(`${label}.${key} is not allowed`);
  });
}

function normalizeAssignment(value, key) {
  exactKeys(value, new Set(["ownerId", "planId", "entitlements", "updatedAt"]), `assignments.${key}`);
  const ownerId = token(value.ownerId, `assignments.${key}.ownerId`);
  if (ownerId !== key) fail(`assignments.${key}.ownerId does not match key`);
  const updatedAt = new Date(value.updatedAt);
  if (!Number.isFinite(updatedAt.getTime())) fail(`assignments.${key}.updatedAt is invalid`);
  return Object.freeze({
    ownerId,
    planId: token(value.planId, `assignments.${key}.planId`),
    entitlements: libraryCore.normalizeEntitlements(value.entitlements),
    updatedAt: updatedAt.toISOString()
  });
}

function normalize(raw) {
  exactKeys(raw, new Set(["schemaVersion", "plans", "assignments", "exams"]), "user exam library");
  if (raw.schemaVersion !== SCHEMA_VERSION) fail("user exam library schemaVersion is invalid");
  exactKeys(raw.plans, new Set(Object.keys(raw.plans || {})), "plans");
  exactKeys(raw.assignments, new Set(Object.keys(raw.assignments || {})), "assignments");
  exactKeys(raw.exams, new Set(Object.keys(raw.exams || {})), "exams");

  const plans = {};
  Object.entries(raw.plans || {}).forEach(function ([key, value]) {
    const plan = libraryCore.createLibraryPlan(value);
    if (plan.planId !== key) fail(`plans.${key}.planId does not match key`);
    plans[key] = plan;
  });

  const assignments = {};
  Object.entries(raw.assignments || {}).forEach(function ([key, value]) {
    const assignment = normalizeAssignment(value, key);
    if (!plans[assignment.planId]) fail(`assignments.${key}.planId is unknown`);
    assignments[key] = assignment;
  });

  const exams = {};
  Object.entries(raw.exams || {}).forEach(function ([key, value]) {
    const recipe = libraryCore.normalizeUserExamRecipe(value);
    if (recipe.examId !== key) fail(`exams.${key}.examId does not match key`);
    if (!assignments[recipe.ownerId]) fail(`exams.${key}.ownerId has no assignment`);
    exams[key] = recipe;
  });

  return Object.freeze({
    schemaVersion: SCHEMA_VERSION,
    plans: Object.freeze(plans),
    assignments: Object.freeze(assignments),
    exams: Object.freeze(exams)
  });
}

function emptyRoot() {
  return { schemaVersion: SCHEMA_VERSION, plans: {}, assignments: {}, exams: {} };
}

function assignmentContext(root, ownerIdInput) {
  const ownerId = token(ownerIdInput, "ownerId");
  const assignment = root.assignments[ownerId];
  if (!assignment) {
    const error = new Error("user exam library assignment is missing");
    error.code = "USER_EXAM_ACCESS_MISSING";
    throw error;
  }
  return { ownerId, assignment, plan: root.plans[assignment.planId] };
}

function ownerExams(root, ownerId) {
  return Object.values(root.exams).filter(function (recipe) { return recipe.ownerId === ownerId; });
}

function pruneTemporary(root, context, nowInput) {
  const now = new Date(nowInput == null ? Date.now() : nowInput);
  if (!Number.isFinite(now.getTime())) fail("prune time is invalid");
  const active = ownerExams(root, context.ownerId).filter(function (recipe) {
    return recipe.state === "temporary" && !libraryCore.isExpired(recipe, now);
  }).sort(function (left, right) {
    return right.updatedAt.localeCompare(left.updatedAt) || left.examId.localeCompare(right.examId);
  });
  const keep = new Set(active.slice(0, context.plan.maxRecentExamCount).map(function (recipe) { return recipe.examId; }));
  const exams = {};
  Object.entries(root.exams).forEach(function ([examId, recipe]) {
    if (recipe.ownerId !== context.ownerId || recipe.state === "saved" || keep.has(examId)) exams[examId] = recipe;
  });
  return Object.assign({}, root, { exams });
}

function createMemoryStore(initial) {
  let root = normalize(initial || emptyRoot());

  function replace(next) {
    root = normalize(next);
    return root;
  }

  return {
    snapshot() { return root; },
    assignment(ownerId) {
      const context = assignmentContext(root, ownerId);
      return Object.freeze({ plan: context.plan, assignment: context.assignment });
    },
    list(ownerIdInput, at) {
      const context = assignmentContext(root, ownerIdInput);
      const visible = ownerExams(root, context.ownerId).filter(function (recipe) {
        return recipe.state === "saved" || !libraryCore.isExpired(recipe, at);
      }).sort(function (left, right) {
        return right.updatedAt.localeCompare(left.updatedAt) || left.examId.localeCompare(right.examId);
      });
      return Object.freeze(visible);
    },
    read(ownerIdInput, examIdInput, at) {
      const context = assignmentContext(root, ownerIdInput);
      const examId = token(examIdInput, "examId");
      const recipe = root.exams[examId];
      if (!recipe || recipe.ownerId !== context.ownerId) return null;
      if (recipe.state === "temporary" && libraryCore.isExpired(recipe, at)) return null;
      return recipe;
    },
    create(ownerIdInput, recipeInput, at) {
      const context = assignmentContext(root, ownerIdInput);
      const recipe = libraryCore.normalizeUserExamRecipe(recipeInput);
      if (recipe.ownerId !== context.ownerId) fail("recipe ownerId does not match session owner");
      if (root.exams[recipe.examId]) {
        const error = new Error("user exam already exists");
        error.code = "USER_EXAM_CONFLICT";
        throw error;
      }
      libraryCore.assertEntitled(context.assignment.entitlements, recipe);
      libraryCore.assertTemporaryRetention(context.plan, recipe);
      if (recipe.state === "saved") libraryCore.assertSavedCapacity(context.plan, ownerExams(root, context.ownerId), recipe.examId);
      const next = serializable(root);
      next.exams[recipe.examId] = recipe;
      replace(pruneTemporary(normalize(next), context, at == null ? recipe.updatedAt : at));
      return root.exams[recipe.examId] || null;
    },
    save(ownerIdInput, examIdInput, savedAt) {
      const context = assignmentContext(root, ownerIdInput);
      const examId = token(examIdInput, "examId");
      const recipe = root.exams[examId];
      if (!recipe || recipe.ownerId !== context.ownerId) return null;
      const saved = libraryCore.saveExam(recipe, context.plan, context.assignment.entitlements, ownerExams(root, context.ownerId), savedAt);
      const next = serializable(root);
      next.exams[examId] = saved;
      replace(next);
      return root.exams[examId];
    },
    remove(ownerIdInput, examIdInput) {
      const context = assignmentContext(root, ownerIdInput);
      const examId = token(examIdInput, "examId");
      const recipe = root.exams[examId];
      if (!recipe || recipe.ownerId !== context.ownerId) return false;
      const next = serializable(root);
      delete next.exams[examId];
      replace(next);
      return true;
    },
    setAssignment(assignmentInput) {
      const ownerId = token(assignmentInput && assignmentInput.ownerId, "assignment.ownerId");
      const next = serializable(root);
      next.assignments[ownerId] = assignmentInput;
      replace(next);
      return root.assignments[ownerId];
    }
  };
}

function createFileStore(filePath) {
  const resolved = path.resolve(filePath);
  const lockPath = `${resolved}.lock`;
  function load() {
    return fs.existsSync(resolved) ? normalize(JSON.parse(fs.readFileSync(resolved, "utf8"))) : normalize(emptyRoot());
  }
  function mutate(action) {
    fs.mkdirSync(path.dirname(resolved), { recursive: true });
    const temporary = `${resolved}.${process.pid}.${crypto.randomUUID()}.tmp`;
    let lockHandle;
    try {
      try { lockHandle = fs.openSync(lockPath, "wx", 0o600); }
      catch (error) {
        if (error && error.code === "EEXIST") {
          const busy = new Error("user exam library store is busy");
          busy.code = "USER_EXAM_BUSY";
          throw busy;
        }
        throw error;
      }
      const memory = createMemoryStore(load());
      const result = action(memory);
      const next = memory.snapshot();
      const handle = fs.openSync(temporary, "wx", 0o600);
      try {
        fs.writeFileSync(handle, `${JSON.stringify(next, null, 2)}\n`, "utf8");
        fs.fsyncSync(handle);
      } finally { fs.closeSync(handle); }
      fs.renameSync(temporary, resolved);
      return result;
    } finally {
      try { fs.unlinkSync(temporary); } catch (_) {}
      if (lockHandle !== undefined) {
        try { fs.closeSync(lockHandle); } catch (_) {}
        try { fs.unlinkSync(lockPath); } catch (_) {}
      }
    }
  }
  return {
    snapshot() { return load(); },
    assignment(ownerId) { return createMemoryStore(load()).assignment(ownerId); },
    list(ownerId, at) { return createMemoryStore(load()).list(ownerId, at); },
    read(ownerId, examId, at) { return createMemoryStore(load()).read(ownerId, examId, at); },
    create(ownerId, recipe, at) { return mutate(function (store) { return store.create(ownerId, recipe, at); }); },
    save(ownerId, examId, savedAt) { return mutate(function (store) { return store.save(ownerId, examId, savedAt); }); },
    remove(ownerId, examId) { return mutate(function (store) { return store.remove(ownerId, examId); }); },
    setAssignment(assignment) { return mutate(function (store) { return store.setAssignment(assignment); }); }
  };
}

function createStore(options) {
  const opts = options || {};
  if (opts.data) return createMemoryStore(opts.data);
  const filePath = clean(opts.filePath || process.env.HIGHSELECT_PRIVATE_USER_EXAM_LIBRARY_PATH);
  return filePath ? createFileStore(filePath) : null;
}

module.exports = { SCHEMA_VERSION, normalize, emptyRoot, createMemoryStore, createFileStore, createStore };
