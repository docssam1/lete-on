#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const intake = require("./validate-private-sasmo-diagnostic.cjs");

const SCHEMA_VERSION = "gfield-private-sasmo-question-media-v1";

function fail(code, reference) { const error = new Error(`${code}: ${reference}`); error.code = code; error.reference = reference; throw error; }
function record(value) { return !!value && typeof value === "object" && !Array.isArray(value); }
function text(value, code, reference, pattern) { if (typeof value !== "string" || value !== value.trim() || !value || (pattern && !pattern.test(value))) fail(code, reference); }
function onlyKeys(value, keys, code, reference) { if (!record(value) || Object.keys(value).some(function (key) { return !keys.includes(key); })) fail(code, reference); }
function inside(parent, child) { const relative = path.relative(parent, child); return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative)); }
function sha256(bytes) { return crypto.createHash("sha256").update(bytes).digest("hex"); }

function pngInfo(bytes, reference) {
  const signature = Buffer.from([137,80,78,71,13,10,26,10]);
  if (bytes.length < 33 || !bytes.subarray(0, 8).equals(signature) || bytes.toString("ascii", 12, 16) !== "IHDR") fail("QUESTION_MEDIA_PNG_INVALID", reference);
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (width < 700 || width > 4000 || height < 300 || height > 5000) fail("QUESTION_MEDIA_DIMENSIONS_INVALID", reference);
  return Object.freeze({ width, height });
}

function validateMediaPack(pack, intakePack, mediaRoot) {
  onlyKeys(pack, ["schemaVersion","packId","language","rightsState","sourceFingerprintSha256","assetDirectory","items"], "QUESTION_MEDIA_PACK_INVALID", "pack");
  if (pack.schemaVersion !== SCHEMA_VERSION || pack.language !== "en-US" || pack.rightsState !== "private-reference-only") fail("QUESTION_MEDIA_IDENTITY_INVALID", "pack");
  text(pack.packId, "QUESTION_MEDIA_IDENTITY_INVALID", "pack.packId", /^sasmo-[0-9]{4}-g(?:[2-9]|10)-question-media-v[0-9]+$/u);
  if (pack.sourceFingerprintSha256 !== intakePack.paper.sourceFingerprintSha256) fail("QUESTION_MEDIA_SOURCE_MISMATCH", "pack.sourceFingerprintSha256");
  text(pack.assetDirectory, "QUESTION_MEDIA_DIRECTORY_INVALID", "pack.assetDirectory", /^[a-z0-9-]+(?:\/[a-z0-9-]+)*$/u);
  if (!Array.isArray(pack.items) || pack.items.length !== 25) fail("QUESTION_MEDIA_COUNT_INVALID", "pack.items");
  const assetRoot = path.resolve(mediaRoot, pack.assetDirectory);
  if (!inside(mediaRoot, assetRoot) || !fs.existsSync(assetRoot) || !fs.statSync(assetRoot).isDirectory()) fail("QUESTION_MEDIA_DIRECTORY_INVALID", pack.assetDirectory);
  const intakeItems = new Map(intakePack.items.map(function (item) { return [item.itemId, item]; }));
  const assets = new Map();
  pack.items.forEach(function (item, index) {
    const reference = `pack.items[${index}]`;
    onlyKeys(item, ["itemId","questionNumber","sourcePage","assetFile","altText","spokenPrompt"], "QUESTION_MEDIA_ITEM_INVALID", reference);
    const expectedId = `sasmo-${intakePack.paper.year}-${intakePack.paper.levelId.toLowerCase()}-q${String(index + 1).padStart(2,"0")}`;
    if (item.itemId !== expectedId || item.questionNumber !== index + 1 || !intakeItems.has(item.itemId)) fail("QUESTION_MEDIA_ITEM_BINDING_INVALID", reference);
    const locator = intakeItems.get(item.itemId).sourceLocator;
    const pageMatch = /:p([0-9]+):q[0-9]+$/u.exec(locator);
    if (!pageMatch || item.sourcePage !== Number(pageMatch[1])) fail("QUESTION_MEDIA_PAGE_MISMATCH", reference);
    text(item.assetFile, "QUESTION_MEDIA_FILE_INVALID", `${reference}.assetFile`, /^sasmo-[0-9]{4}-g(?:[2-9]|10)-q[0-9]{2}\.png$/u);
    text(item.altText, "QUESTION_MEDIA_ALT_INVALID", `${reference}.altText`, /^.{25,500}$/su);
    text(item.spokenPrompt, "QUESTION_MEDIA_NARRATION_INVALID", `${reference}.spokenPrompt`, /^.{25,1200}$/su);
    if (/\b(?:the answer is|correct answer|option [a-e] is correct)\b/iu.test(item.spokenPrompt)) fail("QUESTION_MEDIA_ANSWER_LEAK", reference);
    const assetPath = path.resolve(assetRoot, item.assetFile);
    if (!inside(assetRoot, assetPath)) fail("QUESTION_MEDIA_FILE_INVALID", reference);
    const stat = fs.lstatSync(assetPath);
    if (!stat.isFile() || stat.isSymbolicLink() || stat.size < 10 * 1024 || stat.size > 5 * 1024 * 1024) fail("QUESTION_MEDIA_FILE_INVALID", reference);
    const bytes = fs.readFileSync(assetPath);
    const dimensions = pngInfo(bytes, reference);
    assets.set(item.itemId, Object.freeze({ ...item, assetPath, assetSha256: sha256(bytes), width: dimensions.width, height: dimensions.height, dataUri: `data:image/png;base64,${bytes.toString("base64")}` }));
  });
  return Object.freeze({ packId: pack.packId, itemCount: pack.items.length, assets });
}

function loadAndValidate(options) {
  const mediaRoot = intake.assertExternalPrivateRoot(options.mediaRoot);
  text(options.mediaFile, "QUESTION_MEDIA_FILE_INVALID", "mediaFile", /^sasmo-[0-9]{4}-g(?:[2-9]|10)-question-media\.json$/u);
  const mediaPath = path.resolve(mediaRoot, options.mediaFile);
  if (!inside(mediaRoot, mediaPath)) fail("QUESTION_MEDIA_FILE_INVALID", options.mediaFile);
  let pack;
  try { pack = JSON.parse(fs.readFileSync(mediaPath, "utf8")); } catch (_error) { fail("QUESTION_MEDIA_JSON_INVALID", options.mediaFile); }
  return Object.freeze({ pack, validation: validateMediaPack(pack, options.intakePack, mediaRoot) });
}

if (require.main === module) {
  try {
    const args = process.argv;
    function arg(name) { const index = args.indexOf(name); if (index < 0 || !args[index + 1]) fail("QUESTION_MEDIA_COMMAND_INVALID", name); return args[index + 1]; }
    const intakePack = intake.loadPrivatePack(arg("--intake-root"), arg("--intake-file")).pack;
    const result = loadAndValidate({ mediaRoot: arg("--media-root"), mediaFile: arg("--media-file"), intakePack }).validation;
    console.log(`PASS private SASMO question media: ${result.packId}, ${result.itemCount} source images and narrations`);
  } catch (error) { console.error(`BLOCKED private SASMO question media: ${error.code || "INVALID"} ${error.reference || ""}`.trim()); process.exitCode = 2; }
}

module.exports = Object.freeze({ SCHEMA_VERSION, validateMediaPack, loadAndValidate });
