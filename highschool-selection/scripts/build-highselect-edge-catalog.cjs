"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const catalogModule = require("../server/academy-question-catalog.js");

const SCHEMA_VERSION = "highselect-private-edge-catalog/v1";
const DEFAULT_PROFILES = Object.freeze(["SM_STANDARD"]);
const FORBIDDEN_KEYS = new Set([
  "answer", "answerKey", "correctAnswer", "solution", "solutionText", "questionText",
  "prompt", "sourcePath", "sourceUrl", "pdfUrl", "assetPath", "page", "locator"
]);

function clean(value) { return String(value == null ? "" : value).trim(); }

function rejectProtectedPayload(value, trail) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => rejectProtectedPayload(item, `${trail}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") {
    if (typeof value === "string" && /(?:[A-Za-z]:[\\/]|file:\/\/|https?:\/\/)/i.test(value)) {
      throw new Error(`${trail} contains a protected path or URL`);
    }
    return;
  }
  Object.entries(value).forEach(([key, item]) => {
    const safeReviewFlag = key === "locator" && trail.endsWith(".reviewChecks") && typeof item === "boolean";
    if (FORBIDDEN_KEYS.has(key) && !safeReviewFlag) throw new Error(`${trail}.${key} is prohibited`);
    rejectProtectedPayload(item, `${trail}.${key}`);
  });
}

function buildSnapshot(index, options) {
  const opts = options || {};
  const profileIds = Array.from(new Set((opts.profileIds || DEFAULT_PROFILES).map(clean).filter(Boolean)));
  if (!profileIds.length) throw new Error("at least one academy profile is required");
  const catalog = catalogModule.createProjectCatalog(index);
  const profileMap = new Map(catalog.profiles().map(profile => [profile.profileId, profile]));
  const unknown = profileIds.filter(profileId => !profileMap.has(profileId));
  if (unknown.length) throw new Error(`unknown academy profiles: ${unknown.join(", ")}`);

  const itemsById = new Map();
  profileIds.forEach(profileId => {
    catalog.search({ profileIds: [profileId], includeCandidates: true, limit: 300 }).forEach(item => {
      if (!itemsById.has(item.questionId)) itemsById.set(item.questionId, item);
    });
  });
  const output = {
    schemaVersion: SCHEMA_VERSION,
    snapshotRevision: clean(opts.snapshotRevision || "private-index"),
    profiles: profileIds.map(profileId => profileMap.get(profileId)),
    representativeAnalyses: catalog.analyses(profileIds),
    items: Array.from(itemsById.values())
  };
  rejectProtectedPayload(output, "snapshot");
  return output;
}

function writeJsonAtomic(filePath, value) {
  const resolved = path.resolve(filePath);
  const temporary = `${resolved}.tmp-${process.pid}`;
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  fs.renameSync(temporary, resolved);
}

if (require.main === module) {
  const [inputPath, outputPath, profilesText, revisionText] = process.argv.slice(2);
  if (!inputPath || !outputPath) {
    throw new Error("usage: node build-highselect-edge-catalog.cjs <project-index.json> <catalog.json> [profileIds] [revision]");
  }
  const sourceBytes = fs.readFileSync(path.resolve(inputPath));
  const sourceHash = crypto.createHash("sha256").update(sourceBytes).digest("hex").toUpperCase();
  const snapshot = buildSnapshot(JSON.parse(sourceBytes.toString("utf8")), {
    profileIds: clean(profilesText).split(",").filter(Boolean),
    snapshotRevision: revisionText || "private-index"
  });
  writeJsonAtomic(outputPath, snapshot);
  process.stdout.write(`${JSON.stringify({
    outputPath: path.resolve(outputPath),
    sourceHash,
    profiles: snapshot.profiles.map(profile => profile.profileId),
    itemCount: snapshot.items.length,
    analysisCount: snapshot.representativeAnalyses.length
  })}\n`);
}

module.exports = Object.freeze({ SCHEMA_VERSION, DEFAULT_PROFILES, FORBIDDEN_KEYS, rejectProtectedPayload, buildSnapshot });
