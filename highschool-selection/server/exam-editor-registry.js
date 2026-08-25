"use strict";

const fs = require("node:fs");
const path = require("node:path");
const editorCore = require("../data/exam-editor-core.js");

const SCHEMA_VERSION = "highselect-private-exam-editor-registry/v1";
const INPUT_TYPES = new Set(["single_choice", "multi_choice", "ox", "input", "multi_input", "ordered_list", "unordered_set"]);
const DIFFICULTY_BANDS = new Set(["lowered", "standard", "raised"]);

function fail(message) { throw new Error(message); }
function clean(value) { return String(value == null ? "" : value).trim(); }

function exactKeys(value, allowed, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(`${label} is invalid`);
  Object.keys(value).forEach(function (key) {
    if (!allowed.has(key)) fail(`${label}.${key} is not allowed`);
  });
}

function token(value, label) {
  const result = clean(value);
  if (!result || result.length > 180 || !/^[A-Za-z0-9._:-]+$/.test(result)) fail(`${label} is invalid`);
  return result;
}

function curriculumPath(value, label) {
  const result = clean(value).replace(/\/+$/, "");
  if (!result || result.length > 180 || result.includes("..") || result.includes("\\")) fail(`${label} is invalid`);
  return result;
}

function normalizeCandidate(value, key) {
  exactKeys(value, new Set([
    "itemId", "itemVersionId", "curriculumPath", "typeCode", "difficultyBand", "inputType",
    "figureRequired", "figureStatus", "releaseStatus", "classificationStatus", "answerStatus",
    "singleAnswerStatus", "userApprovalStatus"
  ]), `candidates.${key}`);
  const itemId = token(value.itemId, `candidates.${key}.itemId`);
  if (itemId !== key) fail(`candidates.${key}.itemId does not match key`);
  const candidate = {
    itemId,
    itemVersionId: token(value.itemVersionId, `candidates.${key}.itemVersionId`),
    curriculumPath: curriculumPath(value.curriculumPath, `candidates.${key}.curriculumPath`),
    typeCode: token(value.typeCode, `candidates.${key}.typeCode`),
    difficultyBand: clean(value.difficultyBand),
    inputType: clean(value.inputType),
    figureRequired: value.figureRequired === true,
    figureStatus: clean(value.figureStatus),
    releaseStatus: clean(value.releaseStatus),
    classificationStatus: clean(value.classificationStatus),
    answerStatus: clean(value.answerStatus),
    singleAnswerStatus: clean(value.singleAnswerStatus),
    userApprovalStatus: clean(value.userApprovalStatus)
  };
  if (!DIFFICULTY_BANDS.has(candidate.difficultyBand)) fail(`candidates.${key}.difficultyBand is invalid`);
  if (!INPUT_TYPES.has(candidate.inputType)) fail(`candidates.${key}.inputType is invalid`);
  return Object.freeze(candidate);
}

function normalizeRelation(value, key, candidates) {
  exactKeys(value, new Set([
    "evidenceId", "status", "relationship", "sourceItemId", "sourceItemVersionId",
    "candidateItemId", "candidateItemVersionId", "familyMatched", "detailMatched",
    "solutionStructureMatched", "difficultyCompatible"
  ]), `relations.${key}`);
  const relation = {
    evidenceId: token(value.evidenceId, `relations.${key}.evidenceId`),
    status: clean(value.status),
    relationship: clean(value.relationship),
    sourceItemId: token(value.sourceItemId, `relations.${key}.sourceItemId`),
    sourceItemVersionId: token(value.sourceItemVersionId, `relations.${key}.sourceItemVersionId`),
    candidateItemId: token(value.candidateItemId, `relations.${key}.candidateItemId`),
    candidateItemVersionId: token(value.candidateItemVersionId, `relations.${key}.candidateItemVersionId`),
    familyMatched: value.familyMatched === true,
    detailMatched: value.detailMatched === true,
    solutionStructureMatched: value.solutionStructureMatched === true,
    difficultyCompatible: value.difficultyCompatible === true
  };
  if (relation.evidenceId !== key) fail(`relations.${key}.evidenceId does not match key`);
  if (!editorCore.RELATIONSHIPS.includes(relation.relationship) || relation.relationship === "manual") fail(`relations.${key}.relationship is invalid`);
  const source = candidates[relation.sourceItemId];
  const candidate = candidates[relation.candidateItemId];
  if (!source || source.itemVersionId !== relation.sourceItemVersionId) fail(`relations.${key} source version is invalid`);
  if (!candidate || candidate.itemVersionId !== relation.candidateItemVersionId) fail(`relations.${key} candidate version is invalid`);
  return Object.freeze(relation);
}

function normalize(raw) {
  exactKeys(raw, new Set(["schemaVersion", "candidates", "relations"]), "registry");
  if (raw.schemaVersion !== SCHEMA_VERSION) fail("registry schemaVersion is invalid");
  if (!raw.candidates || typeof raw.candidates !== "object" || Array.isArray(raw.candidates)) fail("registry candidates are invalid");
  if (!raw.relations || typeof raw.relations !== "object" || Array.isArray(raw.relations)) fail("registry relations are invalid");
  const candidates = {};
  Object.entries(raw.candidates).forEach(function (entry) { candidates[entry[0]] = normalizeCandidate(entry[1], entry[0]); });
  const relations = {};
  Object.entries(raw.relations).forEach(function (entry) { relations[entry[0]] = normalizeRelation(entry[1], entry[0], candidates); });
  return Object.freeze({ schemaVersion: SCHEMA_VERSION, candidates: Object.freeze(candidates), relations: Object.freeze(relations) });
}

function createRegistry(raw) {
  const data = normalize(raw);
  return Object.freeze({
    getCandidate(itemId, itemVersionId) {
      const candidate = data.candidates[clean(itemId)];
      if (!candidate || (itemVersionId && candidate.itemVersionId !== clean(itemVersionId))) return null;
      return candidate;
    },
    getReplacementEvidence(evidenceId) {
      return data.relations[clean(evidenceId)] || null;
    },
    search(options) {
      const opts = options || {};
      const scopeKey = clean(opts.scopeKey).replace(/\/+$/, "");
      const query = clean(opts.query).toLowerCase();
      const sourceItemId = clean(opts.sourceItemId);
      const sourceItemVersionId = clean(opts.sourceItemVersionId);
      const relationship = clean(opts.relationship);
      const relationByCandidate = new Map();
      if (sourceItemId || relationship) {
        Object.values(data.relations).forEach(function (relation) {
          if (relation.status !== "approved") return;
          if (sourceItemId && relation.sourceItemId !== sourceItemId) return;
          if (sourceItemVersionId && relation.sourceItemVersionId !== sourceItemVersionId) return;
          if (relationship && relation.relationship !== relationship) return;
          relationByCandidate.set(relation.candidateItemId, relation);
        });
      }
      const limit = Math.min(100, Math.max(1, Number(opts.limit) || 30));
      return Object.values(data.candidates).filter(function (candidate) {
        if (editorCore.validateCandidate(candidate).length) return false;
        if (scopeKey && !(candidate.curriculumPath === scopeKey || candidate.curriculumPath.startsWith(`${scopeKey}/`))) return false;
        if ((sourceItemId || relationship) && !relationByCandidate.has(candidate.itemId)) return false;
        if (query && !`${candidate.itemId} ${candidate.typeCode} ${candidate.curriculumPath}`.toLowerCase().includes(query)) return false;
        return true;
      }).sort(function (left, right) {
        return left.curriculumPath.localeCompare(right.curriculumPath) || left.typeCode.localeCompare(right.typeCode) || left.itemId.localeCompare(right.itemId);
      }).slice(0, limit).map(function (candidate) {
        const relation = relationByCandidate.get(candidate.itemId);
        return { candidate, relation: relation || null };
      });
    }
  });
}

function createLoader(options) {
  const opts = options || {};
  if (opts.data) {
    const registry = createRegistry(opts.data);
    return function () { return registry; };
  }
  const filePath = clean(opts.filePath || process.env.HIGHSELECT_PRIVATE_EXAM_EDITOR_REGISTRY_PATH);
  if (!filePath) return null;
  const resolved = path.resolve(filePath);
  return function () { return createRegistry(JSON.parse(fs.readFileSync(resolved, "utf8"))); };
}

module.exports = { SCHEMA_VERSION, normalize, createRegistry, createLoader };
