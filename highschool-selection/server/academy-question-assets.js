"use strict";

const fs = require("node:fs");
const path = require("node:path");

const SCHEMA_VERSION = "highselect-private-question-page-assets/v1";
const SOURCE_PATTERN = /^DP-SRC-[A-F0-9]{12}$/;

function clean(value) { return String(value == null ? "" : value).trim(); }

function inside(root, child) {
  return child.startsWith(root + path.sep);
}

function createLoader(options) {
  const opts = options || {};
  if (typeof opts.load === "function") return opts.load;
  const rootText = clean(opts.root || process.env.HIGHSELECT_PRIVATE_ACADEMY_ASSET_ROOT);
  if (!rootText) return null;
  const root = path.resolve(rootText);
  const manifestCache = new Map();
  return function loadQuestionPage(sourceId, pageNumber) {
    const source = clean(sourceId);
    const page = Number(pageNumber);
    if (!SOURCE_PATTERN.test(source) || !Number.isSafeInteger(page) || page < 1 || page > 999) return null;
    const sourceRoot = path.resolve(root, source);
    if (!inside(root, sourceRoot)) return null;
    const manifestPath = path.resolve(sourceRoot, "manifest.json");
    if (!inside(sourceRoot, manifestPath) || !fs.existsSync(manifestPath)) return null;
    let manifest;
    try {
      const stat = fs.statSync(manifestPath);
      const cached = manifestCache.get(source);
      if (cached && cached.size === stat.size && cached.mtimeMs === stat.mtimeMs) manifest = cached.manifest;
      else {
        manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
        manifestCache.set(source, { size: stat.size, mtimeMs: stat.mtimeMs, manifest });
      }
    } catch (_) { return null; }
    if (!manifest || manifest.schemaVersion !== SCHEMA_VERSION || manifest.sourceId !== source || !Array.isArray(manifest.assets)) return null;
    const entry = manifest.assets.find(asset => asset && asset.pageNumber === page);
    if (!entry || !clean(entry.assetId) || path.basename(clean(entry.fileName)) !== clean(entry.fileName) || !/^[a-f0-9]{64}$/.test(clean(entry.sha256))) return null;
    const assetPath = path.resolve(sourceRoot, entry.fileName);
    if (!inside(sourceRoot, assetPath) || path.extname(assetPath).toLowerCase() !== ".png") return null;
    if (!fs.existsSync(assetPath) || !fs.statSync(assetPath).isFile()) return null;
    const realSourceRoot = fs.realpathSync(sourceRoot);
    const realAssetPath = fs.realpathSync(assetPath);
    if (!inside(realSourceRoot, realAssetPath)) return null;
    return Object.freeze({
      assetKey: clean(entry.assetId),
      assetRevision: `sha256:${entry.sha256}`,
      assetPath,
      mimeType: "image/png"
    });
  };
}

module.exports = Object.freeze({ SCHEMA_VERSION, createLoader });
