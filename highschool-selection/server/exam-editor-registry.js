"use strict";

const fs = require("node:fs");
const path = require("node:path");
const editorCore = require("../data/exam-editor-core.js");
const questionBankCore = require("../data/question-bank-core.js");
const sourceLineage = require("../data/source-lineage.js");

const SCHEMA_VERSION = "highselect-private-exam-editor-registry/v1";

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

function optionalToken(value, label) {
  if (value == null || value === "") return null;
  return token(value, label);
}

function normalizeSingleAnswerAudit(value, key) {
  exactKeys(value, new Set(["status", "validOutcomeCount", "evidenceCode"]), `candidates.${key}.singleAnswerAudit`);
  const count = Number(value.validOutcomeCount);
  if (!Number.isSafeInteger(count) || count < 0) fail(`candidates.${key}.singleAnswerAudit.validOutcomeCount is invalid`);
  return Object.freeze({
    status: clean(value.status),
    validOutcomeCount: count,
    evidenceCode: optionalToken(value.evidenceCode, `candidates.${key}.singleAnswerAudit.evidenceCode`)
  });
}

function normalizeFigureAudit(value, key) {
  exactKeys(value, new Set([
    "required", "status", "evidenceVisible", "hiddenStateConstrained", "positionUnambiguous", "contrastSufficient"
  ]), `candidates.${key}.figureAudit`);
  return Object.freeze({
    required: value.required === true,
    status: clean(value.status),
    evidenceVisible: value.evidenceVisible === true,
    hiddenStateConstrained: value.hiddenStateConstrained === true,
    positionUnambiguous: value.positionUnambiguous === true,
    contrastSufficient: value.contrastSufficient === true
  });
}

function normalizeCandidate(value, key) {
  exactKeys(value, new Set([
    "id", "itemVersionId", "mode", "writer", "curriculum", "provenance", "answerVerification",
    "inputType", "generationKind", "difficultyBand", "variant", "lineage", "userApproval",
    "singleAnswerAudit", "figureAudit", "reviewStatus", "typeCode", "domainGroup"
  ]), `candidates.${key}`);
  const itemId = token(value.id, `candidates.${key}.id`);
  if (itemId !== key) fail(`candidates.${key}.id does not match key`);
  const mode = clean(value.mode).toUpperCase();
  if (!questionBankCore.PROGRAM_MODES.includes(mode)) fail(`candidates.${key}.mode is invalid`);
  const candidate = {
    id: itemId,
    itemVersionId: token(value.itemVersionId, `candidates.${key}.itemVersionId`),
    mode,
    writer: clean(value.writer),
    curriculum: questionBankCore.createCurriculumPath(value.curriculum),
    provenance: questionBankCore.createProvenanceRecord(Object.assign({ mode }, value.provenance)),
    answerVerification: questionBankCore.createAnswerVerification(value.answerVerification),
    typeCode: token(value.typeCode, `candidates.${key}.typeCode`),
    difficultyBand: clean(value.difficultyBand),
    domainGroup: value.domainGroup == null || value.domainGroup === "" ? null : clean(value.domainGroup),
    inputType: clean(value.inputType),
    generationKind: clean(value.generationKind),
    variant: questionBankCore.createVariantRecord(Object.assign({ mode }, value.variant)),
    lineage: sourceLineage.createQuestionLineage(Object.assign({ mode }, value.lineage)),
    userApproval: sourceLineage.createUserApproval(Object.assign({ mode }, value.userApproval)),
    singleAnswerAudit: normalizeSingleAnswerAudit(value.singleAnswerAudit, key),
    figureAudit: normalizeFigureAudit(value.figureAudit, key),
    reviewStatus: clean(value.reviewStatus)
  };
  if (!questionBankCore.DIFFICULTY_BANDS.includes(candidate.difficultyBand)) fail(`candidates.${key}.difficultyBand is invalid`);
  if (candidate.domainGroup !== null && !["algebra", "geometry"].includes(candidate.domainGroup)) fail(`candidates.${key}.domainGroup is invalid`);
  if (!questionBankCore.INPUT_TYPES.includes(candidate.inputType)) fail(`candidates.${key}.inputType is invalid`);
  if (!questionBankCore.GENERATION_KINDS.includes(candidate.generationKind)) fail(`candidates.${key}.generationKind is invalid`);
  if (!questionBankCore.REVIEW_STATUSES.includes(candidate.reviewStatus)) fail(`candidates.${key}.reviewStatus is invalid`);
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
  if (candidate.lineage.relation !== relation.relationship) fail(`relations.${key} candidate lineage does not match`);
  if (source.variant.familyId !== candidate.variant.familyId) fail(`relations.${key} question family does not match`);
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
  function searchEntries(options, unlimited) {
    const opts = options || {};
    const scopeKey = clean(opts.scopeKey).replace(/\/+$/, "");
    const scopeKeys = Array.isArray(opts.scopeKeys)
      ? Array.from(new Set(opts.scopeKeys.map(function (value) { return clean(value).replace(/\/+$/, ""); }).filter(Boolean)))
      : (scopeKey ? [scopeKey] : []);
    const query = clean(opts.query).toLowerCase();
    const mode = clean(opts.mode).toUpperCase();
    const sourceItemId = clean(opts.sourceItemId);
    const sourceItemVersionId = clean(opts.sourceItemVersionId);
    const relationship = clean(opts.relationship);
    const originalOnly = opts.originalOnly === true;
    if (!scopeKeys.length) return [];
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
    const limit = unlimited ? Number.POSITIVE_INFINITY : Math.min(100, Math.max(1, Number(opts.limit) || 30));
    return Object.values(data.candidates).filter(function (candidate) {
      if (editorCore.validateCandidate(candidate).length) return false;
      if (mode && candidate.mode !== mode) return false;
      if (originalOnly && candidate.lineage.relation !== "original") return false;
      if (scopeKeys.length && !scopeKeys.some(function (selectedScope) {
        return candidate.curriculum.key === selectedScope || candidate.curriculum.key.startsWith(`${selectedScope}/`);
      })) return false;
      if ((sourceItemId || relationship) && !relationByCandidate.has(candidate.id)) return false;
      if (query && !`${candidate.id} ${candidate.typeCode} ${candidate.curriculum.key}`.toLowerCase().includes(query)) return false;
      return true;
    }).sort(function (left, right) {
      return left.curriculum.key.localeCompare(right.curriculum.key) || left.typeCode.localeCompare(right.typeCode) || left.id.localeCompare(right.id);
    }).slice(0, limit).map(function (candidate) {
      const relation = relationByCandidate.get(candidate.id);
      return { candidate, relation: relation || null };
    });
  }
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
      return searchEntries(options, false);
    },
    searchAll(options) {
      return searchEntries(options, true);
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
