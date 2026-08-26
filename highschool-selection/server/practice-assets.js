"use strict";

const fs = require("node:fs");
const path = require("node:path");
const core = require("../data/question-bank-core.js");

const SCHEMA_VERSION = "highselect-private-practice-assets/v1";
const MIME = new Set(["image/png", "image/jpeg", "image/webp"]);

function fail(message) { throw new Error(message); }
function clean(value) { return String(value == null ? "" : value).trim(); }
function token(value, label) {
  const result = clean(value);
  if (!result || result.length > 160 || !/^[A-Za-z0-9._:-]+$/.test(result)) fail(`${label} is invalid`);
  return result;
}

function normalizeAsset(value, questionId) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(`assets.${questionId} is invalid`);
  const allowed = new Set(["assetKey", "assetPath", "mimeType", "assetRevision"]);
  Object.keys(value).forEach(function (field) { if (!allowed.has(field)) fail(`assets.${questionId}.${field} is not allowed`); });
  if (!core.isNeutralId(questionId, "question")) fail(`assets.${questionId} question id is invalid`);
  const originalPath = clean(value.assetPath);
  if (!path.isAbsolute(originalPath)) fail(`assets.${questionId}.assetPath must be absolute`);
  const mimeType = clean(value.mimeType).toLowerCase();
  if (!MIME.has(mimeType)) fail(`assets.${questionId}.mimeType is invalid`);
  const assetRevision = clean(value.assetRevision).toLowerCase();
  if (!/^sha256:[0-9a-f]{64}$/.test(assetRevision)) fail(`assets.${questionId}.assetRevision is invalid`);
  return Object.freeze({
    assetKey: token(value.assetKey, `assets.${questionId}.assetKey`),
    assetPath: path.resolve(originalPath),
    mimeType,
    assetRevision
  });
}

function normalize(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw) || raw.schemaVersion !== SCHEMA_VERSION) fail("private practice assets schemaVersion is invalid");
  const allowed = new Set(["schemaVersion", "assets"]);
  Object.keys(raw).forEach(function (field) { if (!allowed.has(field)) fail(`private practice assets.${field} is not allowed`); });
  if (!raw.assets || typeof raw.assets !== "object" || Array.isArray(raw.assets)) fail("private practice assets are invalid");
  const assets = {};
  Object.entries(raw.assets).forEach(function (entry) { assets[entry[0]] = normalizeAsset(entry[1], entry[0]); });
  return Object.freeze({ schemaVersion: SCHEMA_VERSION, assets: Object.freeze(assets) });
}

function createLoader(options) {
  const opts = options || {};
  if (opts.data) {
    const loaded = normalize(opts.data);
    return function loadAsset(questionId) { return loaded.assets[questionId] || null; };
  }
  const filePath = clean(opts.filePath || process.env.HIGHSELECT_PRIVATE_PRACTICE_ASSETS_PATH);
  if (!filePath) return null;
  return function loadAsset(questionId) {
    const loaded = normalize(JSON.parse(fs.readFileSync(filePath, "utf8")));
    return loaded.assets[questionId] || null;
  };
}

module.exports = { SCHEMA_VERSION, normalize, createLoader };
