#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const core = require("../data/question-bank-core.js");
const itemIndex = require("../data/question-item-index.js");

function fail(message) {
  throw new Error(message);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function getArg(args, name) {
  const at = args.indexOf(name);
  return at >= 0 ? args[at + 1] : null;
}

function normalizedBox(x, y, width, height) {
  return { x, y, width, height };
}

function missionAnchors() {
  const anchors = [];
  const tops = [0.19, 0.435, 0.68];
  let order = 1;
  for (let column = 0; column < 2; column += 1) {
    for (let row = 0; row < 3; row += 1) {
      anchors.push({
        kind: "mission",
        printedLabelHint: String(column * 3 + row + 1),
        layoutOrder: order++,
        box: normalizedBox(column === 0 ? 0.035 : 0.51, tops[row], 0.455, 0.235)
      });
    }
  }
  return anchors;
}

function parseDecision(value) {
  const match = /^([a-z0-9-]+):(\d+):(exclude|mission|mission6)$/.exec(String(value || ""));
  if (!match) fail(`Invalid decision: ${value}`);
  return {
    sourceMemoryId: match[1],
    page: Number(match[2]),
    resolution: match[3] === "mission" ? "mission6" : match[3]
  };
}

function normalizeDecisionRecord(value) {
  if (!value || typeof value !== "object") fail("Decision record must be an object");
  const sourceMemoryId = String(value.sourceMemoryId || "");
  const page = Number(value.page);
  const resolution = value.resolution === "mission" ? "mission6" : value.resolution;
  if (!/^[a-z0-9-]+$/.test(sourceMemoryId) || !Number.isSafeInteger(page) || page < 1) {
    fail(`Invalid decision record: ${JSON.stringify(value)}`);
  }
  if (!new Set(["exclude", "mission6"]).has(resolution)) {
    fail(`Invalid decision resolution: ${resolution}`);
  }
  return { sourceMemoryId, page, resolution };
}

function decisionsFromManifest(manifest, base) {
  if (!manifest || manifest.schemaVersion !== 1 || !Array.isArray(manifest.decisions) || manifest.decisions.length === 0) {
    fail("Decision manifest must use schemaVersion 1 and contain decisions");
  }
  const baseSources = new Map((base.sources || []).map(source => [source.privateSourceMemoryId, source]));
  const fingerprints = new Map();
  for (const source of manifest.sources || []) {
    if (fingerprints.has(source.privateSourceMemoryId)) fail(`Duplicate manifest source: ${source.privateSourceMemoryId}`);
    fingerprints.set(source.privateSourceMemoryId, source.sourceFingerprint);
  }
  const decisions = manifest.decisions.map(normalizeDecisionRecord);
  for (const decision of decisions) {
    const source = baseSources.get(decision.sourceMemoryId);
    if (!source) fail(`Manifest source not found in index: ${decision.sourceMemoryId}`);
    if (fingerprints.get(decision.sourceMemoryId) !== source.sourceFingerprint) {
      fail(`Manifest source fingerprint mismatch: ${decision.sourceMemoryId}`);
    }
  }
  return decisions;
}

function createDecisionManifest(base, decisions) {
  const sources = new Map((base.sources || []).map(source => [source.privateSourceMemoryId, source]));
  const normalized = decisions.map(normalizeDecisionRecord);
  const usedSourceIds = Array.from(new Set(normalized.map(decision => decision.sourceMemoryId))).sort();
  return {
    schemaVersion: 1,
    status: "visual-review-decision",
    sources: usedSourceIds.map(sourceMemoryId => {
      const source = sources.get(sourceMemoryId);
      if (!source) fail(`Decision source not found in index: ${sourceMemoryId}`);
      return { privateSourceMemoryId: sourceMemoryId, sourceFingerprint: source.sourceFingerprint };
    }),
    decisions: normalized.sort((a, b) =>
      a.sourceMemoryId.localeCompare(b.sourceMemoryId) || a.page - b.page || a.resolution.localeCompare(b.resolution)
    )
  };
}

function validateReviewInput(result) {
  if (result.status !== "draft" || !result.policy || result.policy.releaseLocked !== true) {
    fail("Review input must remain draft and release locked");
  }
  const sourceIds = new Set();
  const sourceRefs = new Set();
  for (const source of result.sources || []) {
    if (sourceIds.has(source.privateSourceMemoryId)) fail(`Duplicate private source: ${source.privateSourceMemoryId}`);
    if (sourceRefs.has(source.sourceRef)) fail(`Duplicate source ref: ${source.sourceRef}`);
    sourceIds.add(source.privateSourceMemoryId);
    sourceRefs.add(source.sourceRef);
    if (!/^[0-9a-f]{64}$/.test(String(source.sourceFingerprint || ""))) {
      fail(`Invalid source fingerprint: ${source.sourceRef}`);
    }
    const expectedRef = core.createSharedBankId("source", `sha256:${source.sourceFingerprint}`);
    if (source.sourceRef !== expectedRef) fail(`Source fingerprint mismatch: ${source.sourceRef}`);
  }
  for (const [name, queue] of [
    ["excluded", result.excludedPageCandidates],
    ["unresolved", result.unresolvedPages],
    ["visual review", result.visualReviewPages]
  ]) {
    const seen = new Set();
    for (const entry of queue || []) {
      const key = `${entry.privateSourceMemoryId}:${entry.page}`;
      if (seen.has(key)) fail(`Duplicate ${name} page: ${key}`);
      seen.add(key);
    }
  }
}

function queueLocation(result, sourceMemoryId, page) {
  const matches = [];
  for (const [name, queue] of [
    ["excluded", result.excludedPageCandidates || []],
    ["unresolved", result.unresolvedPages || []]
  ]) {
    const index = queue.findIndex(entry =>
      entry.privateSourceMemoryId === sourceMemoryId && entry.page === page
    );
    if (index >= 0) matches.push({ name, queue, index, entry: queue[index] });
  }
  if (matches.length > 1) fail(`Page appears in multiple review queues: ${sourceMemoryId}:${page}`);
  return matches[0] || null;
}

function applyReviews(base, decisions) {
  const result = JSON.parse(JSON.stringify(base));
  validateReviewInput(result);
  const reviewPages = Array.isArray(result.visualReviewPages) ? result.visualReviewPages : [];
  const decisionKeys = new Set();

  for (const decision of decisions) {
    const resolution = decision.resolution === "mission" ? "mission6" : decision.resolution;
    const decisionKey = `${decision.sourceMemoryId}:${decision.page}`;
    if (decisionKeys.has(decisionKey)) fail(`Duplicate decision: ${decisionKey}`);
    decisionKeys.add(decisionKey);
    const source = (result.sources || []).find(entry => entry.privateSourceMemoryId === decision.sourceMemoryId);
    if (!source) fail(`Source not found: ${decision.sourceMemoryId}`);
    if (!Number.isSafeInteger(decision.page) || decision.page < 1 || decision.page > source.pageCount) {
      fail(`Page outside source: ${decisionKey}`);
    }
    if (reviewPages.some(entry =>
      entry.privateSourceMemoryId === decision.sourceMemoryId && entry.page === decision.page
    )) fail(`Page already visually reviewed: ${decisionKey}`);
    const location = queueLocation(result, decision.sourceMemoryId, decision.page);
    if (!location) fail(`Review candidate not found: ${decisionKey}`);

    if (resolution === "exclude") {
      const verified = {
        sourceRef: source.sourceRef,
        privateSourceMemoryId: decision.sourceMemoryId,
        page: decision.page,
        reason: "visual-confirmed-non-question",
        reviewStatus: "visual_verified"
      };
      location.queue.splice(location.index, 1);
      result.excludedPageCandidates.push(verified);
      reviewPages.push({
        privateSourceMemoryId: decision.sourceMemoryId,
        sourceRef: source.sourceRef,
        page: decision.page,
        resolution: "verified_non_question",
        evidenceLocator: `PDF p.${decision.page}`
      });
      continue;
    }

    if (resolution !== "mission6") fail(`Unsupported visual resolution: ${decision.resolution}`);
    location.queue.splice(location.index, 1);
    const pageItems = result.items.filter(item => item.sourceRef === source.sourceRef && item.locator.page === decision.page);
    if (pageItems.length > 0) fail(`Mission6 review requires an empty page index: ${decisionKey}`);
    let nextSlot = 1;
    for (const anchor of missionAnchors()) {
      const slot = nextSlot++;
      const locatorKey = itemIndex.createLocatorKey(source.sourceFingerprint, decision.page, slot);
      const entry = itemIndex.createItemIndexEntry({
        id: core.createSharedBankId("question", locatorKey),
        sourceRef: source.sourceRef,
        locator: { page: decision.page, slot, kind: anchor.kind, box: anchor.box },
        discoveryStatus: "visual_verified",
        curriculum: null,
        classificationStatus: "pending",
        answerStatus: "missing",
        reuse: core.PROGRAM_MODES,
        releaseStatus: "locked"
      });
      result.items.push({
        ...entry,
        privateRef: {
          sourceMemoryId: decision.sourceMemoryId,
          printedLabelHint: anchor.printedLabelHint,
          layoutOrder: anchor.layoutOrder,
          layoutKind: "mission-six-cell",
          discoveryConfidence: "visual_verified",
          evidenceLocator: `PDF p.${decision.page}, Mission ${anchor.printedLabelHint}`
        }
      });
    }
    reviewPages.push({
      privateSourceMemoryId: decision.sourceMemoryId,
      sourceRef: source.sourceRef,
      page: decision.page,
      resolution: "verified_mission_six_cell",
      evidenceLocator: `PDF p.${decision.page}, Mission 1-6`
    });
  }

  const ids = new Set();
  const slots = new Set();
  for (const item of result.items) {
    if (ids.has(item.id)) fail(`Duplicate id after review: ${item.id}`);
    ids.add(item.id);
    const slotKey = `${item.sourceRef}:${item.locator.page}:${item.locator.slot}`;
    if (slots.has(slotKey)) fail(`Duplicate locator after review: ${slotKey}`);
    slots.add(slotKey);
  }
  result.generatedAt = new Date().toISOString();
  result.status = "draft";
  result.visualReviewPages = reviewPages;
  result.excludedPageCandidates.sort((a, b) => a.sourceRef.localeCompare(b.sourceRef) || a.page - b.page);
  result.unresolvedPages.sort((a, b) => a.sourceRef.localeCompare(b.sourceRef) || a.page - b.page);
  result.counts = {
    ...result.counts,
    questionCandidates: result.items.length,
    excludedPageCandidates: result.excludedPageCandidates.length,
    unresolvedPages: result.unresolvedPages.length,
    visuallyVerified: result.items.filter(item => item.discoveryStatus === "visual_verified").length,
    verifiedExcludedPages: result.excludedPageCandidates.filter(page => page.reviewStatus === "visual_verified").length
  };
  return result;
}

if (require.main === module) {
  try {
    const args = process.argv.slice(2);
    const basePath = getArg(args, "--base");
    const outputPath = getArg(args, "--output");
    const decisionFile = getArg(args, "--decision-file");
    const recordDecisionsPath = getArg(args, "--record-decisions");
    const decisions = [];
    for (let index = 0; index < args.length; index += 1) {
      if (args[index] === "--decision" && args[index + 1]) decisions.push(parseDecision(args[index + 1]));
    }
    if (!basePath || !outputPath || (!decisionFile && decisions.length === 0)) {
      fail("Usage: node apply-private-layout-review.cjs --base <index.json> --output <reviewed.json> [--decision-file <private-review.json>] [--decision <source:page:exclude|mission6> ...]");
    }
    const base = readJson(path.resolve(basePath));
    if (decisionFile) decisions.push(...decisionsFromManifest(readJson(path.resolve(decisionFile)), base));
    if (recordDecisionsPath) {
      const resolvedRecord = path.resolve(recordDecisionsPath);
      fs.mkdirSync(path.dirname(resolvedRecord), { recursive: true });
      fs.writeFileSync(resolvedRecord, `${JSON.stringify(createDecisionManifest(base, decisions), null, 2)}\n`, "utf8");
    }
    const result = applyReviews(base, decisions);
    const resolvedOutput = path.resolve(outputPath);
    fs.mkdirSync(path.dirname(resolvedOutput), { recursive: true });
    fs.writeFileSync(resolvedOutput, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    process.stdout.write(`${JSON.stringify(result.counts)}\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exit(1);
  }
}

module.exports = Object.freeze({
  applyReviews,
  createDecisionManifest,
  decisionsFromManifest,
  missionAnchors,
  normalizeDecisionRecord,
  parseDecision,
  queueLocation,
  validateReviewInput
});
