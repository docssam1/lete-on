"use strict";

const fs = require("node:fs");
const path = require("node:path");
const core = require("../data/question-bank-core.js");

const SCHEMA_VERSION = "highselect-private-user-exam-assets/v1";
const MIME = new Set(["image/png", "image/jpeg", "image/webp"]);

function fail(message) { throw new Error(message); }
function clean(value) { return String(value == null ? "" : value).trim(); }

function token(value, label) {
  const result = clean(value);
  if (!result || result.length > 180 || !/^[A-Za-z0-9._:-]+$/.test(result)) fail(`${label} is invalid`);
  return result;
}

function normalizeAsset(value, itemId) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(`assets.${itemId} is invalid`);
  const allowed = new Set(["assetKey", "itemVersionId", "assetPath", "mimeType", "assetRevision"]);
  Object.keys(value).forEach(function (field) {
    if (!allowed.has(field)) fail(`assets.${itemId}.${field} is not allowed`);
  });
  if (!core.isNeutralId(itemId, "question")) fail(`assets.${itemId} question id is invalid`);
  const originalPath = clean(value.assetPath);
  if (!path.isAbsolute(originalPath)) fail(`assets.${itemId}.assetPath must be absolute`);
  const mimeType = clean(value.mimeType).toLowerCase();
  if (!MIME.has(mimeType)) fail(`assets.${itemId}.mimeType is invalid`);
  const assetRevision = clean(value.assetRevision).toLowerCase();
  if (!/^sha256:[0-9a-f]{64}$/.test(assetRevision)) fail(`assets.${itemId}.assetRevision is invalid`);
  return Object.freeze({
    assetKey: token(value.assetKey, `assets.${itemId}.assetKey`),
    itemVersionId: token(value.itemVersionId, `assets.${itemId}.itemVersionId`),
    assetPath: path.resolve(originalPath),
    mimeType,
    assetRevision
  });
}

function normalize(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw) || raw.schemaVersion !== SCHEMA_VERSION) {
    fail("private user exam assets schemaVersion is invalid");
  }
  const allowed = new Set(["schemaVersion", "assets"]);
  Object.keys(raw).forEach(function (field) {
    if (!allowed.has(field)) fail(`private user exam assets.${field} is not allowed`);
  });
  if (!raw.assets || typeof raw.assets !== "object" || Array.isArray(raw.assets)) fail("private user exam assets are invalid");
  const assets = {};
  Object.entries(raw.assets).forEach(function ([itemId, value]) {
    assets[itemId] = normalizeAsset(value, itemId);
  });
  return Object.freeze({ schemaVersion: SCHEMA_VERSION, assets: Object.freeze(assets) });
}

function createLoader(options) {
  const opts = options || {};
  function fromData(raw) {
    const loaded = normalize(raw);
    return function loadAsset(itemId, itemVersionId) {
      const asset = loaded.assets[clean(itemId)] || null;
      return asset && asset.itemVersionId === clean(itemVersionId) ? asset : null;
    };
  }
  if (opts.data) return fromData(opts.data);
  const filePath = clean(opts.filePath || process.env.HIGHSELECT_PRIVATE_USER_EXAM_ASSETS_PATH);
  if (!filePath) return null;
  const resolved = path.resolve(filePath);
  return function loadAsset(itemId, itemVersionId) {
    const loaded = normalize(JSON.parse(fs.readFileSync(resolved, "utf8")));
    const asset = loaded.assets[clean(itemId)] || null;
    return asset && asset.itemVersionId === clean(itemVersionId) ? asset : null;
  };
}

module.exports = Object.freeze({ SCHEMA_VERSION, normalize, createLoader });
