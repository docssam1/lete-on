"use strict";

const GENERATION_MODES = new Set(["academy_prep", "learning"]);
const LIBRARY_STATES = new Set(["temporary", "saved"]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CODE = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
const ITEM_TOKEN = /^[A-Za-z0-9._:-]{1,180}$/;
const SCOPE_KEY = /^[A-Za-z0-9._:-]+(?:\/[A-Za-z0-9._:-]+)*$/;

function fail(message) { throw new TypeError(message); }
function invariant(condition, message) { if (!condition) fail(message); }

function plainObject(value, field) {
  invariant(value && typeof value === "object" && !Array.isArray(value), `${field} must be an object`);
  const prototype = Object.getPrototypeOf(value);
  invariant(prototype === Object.prototype || prototype === null, `${field} must be plain data`);
  return value;
}

function exactKeys(value, allowed, required, field) {
  plainObject(value, field);
  Object.keys(value).forEach(function (key) {
    invariant(allowed.has(key), `${field}.${key} is not allowed`);
  });
  required.forEach(function (key) {
    invariant(Object.prototype.hasOwnProperty.call(value, key), `${field}.${key} is required`);
  });
}

function uuid(value, field, nullable) {
  if (nullable && (value == null || value === "")) return null;
  invariant(typeof value === "string" && UUID.test(value), `${field} must be a UUID`);
  return value.toLowerCase();
}

function code(value, field, nullable) {
  if (nullable && (value == null || value === "")) return null;
  invariant(typeof value === "string" && CODE.test(value), `${field} is invalid`);
  return value;
}

function enumValue(value, allowed, field) {
  invariant(typeof value === "string" && allowed.has(value), `${field} is invalid`);
  return value;
}

function timestamp(value, field) {
  invariant(typeof value === "string" && value.trim(), `${field} must be a database timestamp`);
  const parsed = new Date(value);
  invariant(Number.isFinite(parsed.getTime()), `${field} must be a database timestamp`);
  return parsed.toISOString();
}

function normalizeWeights(value, labels, field) {
  exactKeys(value, new Set(labels), new Set(labels), field);
  let total = 0;
  const result = {};
  labels.forEach(function (label) {
    const weight = value[label];
    invariant(typeof weight === "number" && Number.isFinite(weight) && weight >= 0 && weight <= 1000,
      `${field}.${label} must be between 0 and 1000`);
    result[label] = weight;
    total += weight;
  });
  invariant(total > 0, `${field} must contain a positive weight`);
  return result;
}

function normalizeConditions(value) {
  const field = "selectionSnapshot.conditions";
  const requiredKeys = new Set(["scopeKeys", "difficultyWeights", "responseWeights", "questionCount", "maxPerFamily"]);
  const allowedKeys = new Set([...requiredKeys, "domainQuotas"]);
  exactKeys(value, allowedKeys, requiredKeys, field);
  invariant(Array.isArray(value.scopeKeys) && value.scopeKeys.length >= 1 && value.scopeKeys.length <= 100,
    `${field}.scopeKeys must contain between 1 and 100 keys`);
  const scopeKeys = value.scopeKeys.map(function (scope, index) {
    invariant(typeof scope === "string" && SCOPE_KEY.test(scope), `${field}.scopeKeys[${index}] is invalid`);
    invariant(scope.split("/").every(function (segment) { return segment !== "." && segment !== ".."; }),
      `${field}.scopeKeys[${index}] cannot contain relative path segments`);
    return scope;
  });
  invariant(Number.isSafeInteger(value.questionCount) && value.questionCount >= 1 && value.questionCount <= 100,
    `${field}.questionCount must be between 1 and 100`);
  invariant(Number.isSafeInteger(value.maxPerFamily) && value.maxPerFamily >= 1 && value.maxPerFamily <= 10,
    `${field}.maxPerFamily must be between 1 and 10`);
  let domainQuotas = null;
  if (value.domainQuotas != null) {
    const quotaKeys = new Set(["algebra", "geometry"]);
    exactKeys(value.domainQuotas, quotaKeys, quotaKeys, `${field}.domainQuotas`);
    invariant(Number.isSafeInteger(value.domainQuotas.algebra) && value.domainQuotas.algebra > 0 && value.domainQuotas.algebra <= 100, `${field}.domainQuotas.algebra is invalid`);
    invariant(Number.isSafeInteger(value.domainQuotas.geometry) && value.domainQuotas.geometry > 0 && value.domainQuotas.geometry <= 100, `${field}.domainQuotas.geometry is invalid`);
    invariant(value.domainQuotas.algebra + value.domainQuotas.geometry === value.questionCount, `${field}.domainQuotas must sum to questionCount`);
    domainQuotas = { algebra: value.domainQuotas.algebra, geometry: value.domainQuotas.geometry };
  }
  return {
    scopeKeys,
    difficultyWeights: normalizeWeights(value.difficultyWeights, ["lowered", "standard", "raised"], `${field}.difficultyWeights`),
    responseWeights: normalizeWeights(value.responseWeights, ["objective", "subjective"], `${field}.responseWeights`),
    questionCount: value.questionCount,
    maxPerFamily: value.maxPerFamily,
    domainQuotas
  };
}

function normalizeItems(value) {
  invariant(Array.isArray(value) && value.length >= 1 && value.length <= 100,
    "recipe.items must contain between 1 and 100 items");
  const itemIds = new Set();
  const orders = new Set();
  const items = value.map(function (item, index) {
    const field = `recipe.items[${index}]`;
    const keys = new Set(["itemId", "itemVersionId", "order", "score"]);
    exactKeys(item, keys, keys, field);
    invariant(typeof item.itemId === "string" && ITEM_TOKEN.test(item.itemId), `${field}.itemId is invalid`);
    invariant(typeof item.itemVersionId === "string" && ITEM_TOKEN.test(item.itemVersionId), `${field}.itemVersionId is invalid`);
    invariant(Number.isSafeInteger(item.order) && item.order >= 1 && item.order <= 100, `${field}.order must be between 1 and 100`);
    invariant(typeof item.score === "number" && Number.isFinite(item.score) && item.score > 0 && item.score <= 1000,
      `${field}.score must be greater than 0 and at most 1000`);
    invariant(!itemIds.has(item.itemId), "recipe.items cannot contain duplicate itemId values");
    invariant(!orders.has(item.order), "recipe.items cannot contain duplicate order values");
    itemIds.add(item.itemId);
    orders.add(item.order);
    return { itemId: item.itemId, itemVersionId: item.itemVersionId, order: item.order, score: item.score };
  }).sort(function (left, right) { return left.order - right.order; });
  items.forEach(function (item, index) {
    invariant(item.order === index + 1, "recipe.items order must be contiguous from 1");
  });
  return items;
}

function normalizeLayout(value) {
  if (value == null) return null;
  const keys = new Set(["paperSize", "columns", "itemsPerPage", "fontScale"]);
  exactKeys(value, keys, new Set(), "recipe.layout");
  const result = {};
  if (Object.prototype.hasOwnProperty.call(value, "paperSize")) {
    invariant(value.paperSize === "A4", "recipe.layout.paperSize must be A4");
    result.paperSize = "A4";
  }
  if (Object.prototype.hasOwnProperty.call(value, "columns")) {
    invariant(value.columns === 1 || value.columns === 2, "recipe.layout.columns must be 1 or 2");
    result.columns = value.columns;
  }
  if (Object.prototype.hasOwnProperty.call(value, "itemsPerPage")) {
    invariant(Number.isSafeInteger(value.itemsPerPage) && value.itemsPerPage >= 1 && value.itemsPerPage <= 6,
      "recipe.layout.itemsPerPage must be between 1 and 6");
    result.itemsPerPage = value.itemsPerPage;
  }
  if (Object.prototype.hasOwnProperty.call(value, "fontScale")) {
    invariant(typeof value.fontScale === "number" && Number.isFinite(value.fontScale)
      && value.fontScale >= 0.8 && value.fontScale <= 1.4,
    "recipe.layout.fontScale must be between 0.8 and 1.4");
    result.fontScale = value.fontScale;
  }
  return result;
}

function normalizeTarget(generationMode, selectionSnapshot) {
  const keys = new Set(["academyId", "semesterId", "conditions"]);
  exactKeys(selectionSnapshot, keys, keys, "selectionSnapshot");
  const academyId = code(selectionSnapshot.academyId, "selectionSnapshot.academyId", true);
  const semesterId = code(selectionSnapshot.semesterId, "selectionSnapshot.semesterId", false);
  if (generationMode === "academy_prep") {
    invariant(academyId !== null, "academy_prep requires selectionSnapshot.academyId");
  }
  return { academyId, semesterId, conditions: normalizeConditions(selectionSnapshot.conditions) };
}

function normalizeCompactRecipe(value) {
  const allowed = new Set(["schemaVersion", "seed", "selectionSnapshot", "items", "layout"]);
  const required = new Set(["schemaVersion", "seed", "selectionSnapshot", "items"]);
  exactKeys(value, allowed, required, "row.recipe");
  invariant(value.schemaVersion === 1, "row.recipe.schemaVersion must be 1");
  invariant(Number.isSafeInteger(value.seed) && value.seed >= 0 && value.seed <= 0xffffffff,
    "row.recipe.seed must be an unsigned 32-bit integer");
  exactKeys(value.selectionSnapshot, new Set(["conditions"]), new Set(["conditions"]), "row.recipe.selectionSnapshot");
  let layout = null;
  if (Object.prototype.hasOwnProperty.call(value, "layout")) {
    invariant(value.layout != null, "row.recipe.layout must be an object when present");
    layout = normalizeLayout(value.layout);
  }
  const conditions = normalizeConditions(value.selectionSnapshot.conditions);
  const items = normalizeItems(value.items);
  invariant(conditions.questionCount === items.length,
    "row.recipe selection questionCount must match items length");
  return {
    schemaVersion: 1,
    seed: value.seed,
    selectionSnapshot: { conditions },
    items,
    layout
  };
}

function toInsertRow(recipeInput, authUserId, options) {
  const allowed = new Set([
    "examId", "ownerId", "state", "createdAt", "updatedAt", "expiresAt", "generationMode",
    "selectionSnapshot", "seed", "parentExamId", "items", "layout"
  ]);
  const required = new Set([
    "examId", "ownerId", "state", "createdAt", "updatedAt", "expiresAt", "generationMode",
    "selectionSnapshot", "seed", "parentExamId", "items", "layout"
  ]);
  exactKeys(recipeInput, allowed, required, "recipe");
  const ownerId = uuid(authUserId, "authUserId", false);
  const examId = uuid(recipeInput.examId, "recipe.examId", false);
  const parentExamId = uuid(recipeInput.parentExamId, "recipe.parentExamId", true);
  const state = enumValue(recipeInput.state, LIBRARY_STATES, "recipe.state");
  const generationMode = enumValue(recipeInput.generationMode, GENERATION_MODES, "recipe.generationMode");
  const target = normalizeTarget(generationMode, recipeInput.selectionSnapshot);
  invariant(Number.isSafeInteger(recipeInput.seed) && recipeInput.seed >= 0 && recipeInput.seed <= 0xffffffff,
    "recipe.seed must be an unsigned 32-bit integer");
  const items = normalizeItems(recipeInput.items);
  invariant(target.conditions.questionCount === items.length,
    "selectionSnapshot.conditions.questionCount must match recipe.items length");
  const layout = normalizeLayout(recipeInput.layout);
  const opts = options == null ? {} : plainObject(options, "options");
  exactKeys(opts, new Set(["title"]), new Set(), "options");
  const title = opts.title == null ? "" : String(opts.title);
  invariant(title.length <= 120, "options.title is too long");

  const compact = {
    schemaVersion: 1,
    seed: recipeInput.seed,
    selectionSnapshot: { conditions: target.conditions },
    items
  };
  if (layout !== null) compact.layout = layout;

  return {
    id: examId,
    owner_id: ownerId,
    parent_exam_id: parentExamId,
    status: state,
    generation_mode: generationMode,
    title,
    academy_code: target.academyId,
    semester_code: target.semesterId,
    recipe: compact
  };
}

function fromRow(rowInput) {
  const row = plainObject(rowInput, "row");
  const examId = uuid(row.id, "row.id", false);
  const ownerId = uuid(row.owner_id, "row.owner_id", false);
  const parentExamId = uuid(row.parent_exam_id, "row.parent_exam_id", true);
  const state = enumValue(row.status, LIBRARY_STATES, "row.status");
  const generationMode = enumValue(row.generation_mode, GENERATION_MODES, "row.generation_mode");
  const academyId = code(row.academy_code, "row.academy_code", true);
  const semesterId = code(row.semester_code, "row.semester_code", false);
  if (generationMode === "academy_prep") invariant(academyId !== null, "academy_prep requires row.academy_code");
  const compact = normalizeCompactRecipe(row.recipe);
  const createdAt = timestamp(row.created_at, "row.created_at");
  const updatedAt = timestamp(row.updated_at, "row.updated_at");
  invariant(Date.parse(updatedAt) >= Date.parse(createdAt), "row.updated_at cannot precede row.created_at");
  let expiresAt = null;
  if (state === "temporary") {
    expiresAt = timestamp(row.expires_at, "row.expires_at");
    invariant(Date.parse(expiresAt) > Date.parse(updatedAt), "temporary row must expire after row.updated_at");
  } else {
    invariant(row.expires_at == null, "saved row cannot have row.expires_at");
  }
  return {
    examId,
    ownerId,
    state,
    createdAt,
    updatedAt,
    expiresAt,
    generationMode,
    selectionSnapshot: {
      academyId,
      semesterId,
      conditions: compact.selectionSnapshot.conditions
    },
    seed: compact.seed,
    parentExamId,
    items: compact.items,
    layout: compact.layout
  };
}

module.exports = { toInsertRow, fromRow };
