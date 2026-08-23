#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const core = require("../data/question-bank-core.js");
const indexSchema = require("../data/question-item-index.js");

const FORBIDDEN_KEYS = new Set([
  "prompt", "answer", "solution", "explanation", "ocrtext", "sourcetext",
  "path", "localpath", "downloadpath", "downloadurl", "filename", "filepath",
  "drivepath", "privatelocation", "url", "uri", "root", "directory", "dirname",
  "content", "rawtext", "fulltext", "excerpt", "pageimage", "base64", "blob", "binary"
]);
const PRIVATE_LOCATION_PATTERN = /(?:\b[a-z]:[\\/]|\\\\|file:\/\/|https?:\/\/|\/(?:Users|home|mnt)\/)/i;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function scanForbidden(value, trail, findings, privateLocations) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => scanForbidden(entry, `${trail}[${index}]`, findings, privateLocations));
    return;
  }
  if (typeof value === "string") {
    if (PRIVATE_LOCATION_PATTERN.test(value)) privateLocations.push(trail);
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, entry] of Object.entries(value)) {
    const normalizedKey = key.replace(/[-_]/g, "").toLowerCase();
    if (FORBIDDEN_KEYS.has(normalizedKey)) {
      findings.push(`${trail}.${key}`);
    }
    scanForbidden(entry, `${trail}.${key}`, findings, privateLocations);
  }
}

function validatePageQueue(entries, label, sourceByRef, errors) {
  const seen = new Set();
  for (const entry of entries || []) {
    const key = `${entry.sourceRef}:${entry.page}`;
    if (seen.has(key)) errors.push(`duplicate ${label} page: ${key}`);
    seen.add(key);
    const source = sourceByRef.get(entry.sourceRef);
    if (!source) {
      errors.push(`${label} page missing source: ${key}`);
      continue;
    }
    if (entry.privateSourceMemoryId !== source.privateSourceMemoryId) {
      errors.push(`${label} private source mismatch: ${key}`);
    }
    if (!Number.isSafeInteger(entry.page) || entry.page < 1 || entry.page > source.pageCount) {
      errors.push(`${label} page outside source: ${key}`);
    }
  }
}

function audit(candidate, predecessor) {
  const errors = [];
  const ids = new Set();
  const slots = new Set();
  const sourceByRef = new Map();
  if (candidate.schemaVersion !== indexSchema.INDEX_SCHEMA_VERSION) {
    errors.push(`schemaVersion must be ${indexSchema.INDEX_SCHEMA_VERSION}`);
  }
  if (candidate.status !== "draft") errors.push("status must remain draft");
  if (!candidate.policy || candidate.policy.releaseLocked !== true) {
    errors.push("policy.releaseLocked must remain true");
  }

  const privateSourceIds = new Set();
  for (const source of candidate.sources || []) {
    if (sourceByRef.has(source.sourceRef)) errors.push(`duplicate sourceRef: ${source.sourceRef}`);
    sourceByRef.set(source.sourceRef, source);
    if (!/^[0-9a-f]{64}$/.test(String(source.sourceFingerprint || ""))) {
      errors.push(`invalid source fingerprint: ${source.sourceRef}`);
    } else {
      const expectedRef = core.createSharedBankId("source", `sha256:${source.sourceFingerprint}`);
      if (source.sourceRef !== expectedRef) errors.push(`sourceRef fingerprint mismatch: ${source.sourceRef}`);
    }
    if (!source.privateSourceMemoryId || privateSourceIds.has(source.privateSourceMemoryId)) {
      errors.push(`duplicate or missing private source id: ${source.sourceRef}`);
    }
    privateSourceIds.add(source.privateSourceMemoryId);
    if (!Number.isSafeInteger(source.pageCount) || source.pageCount < 1) {
      errors.push(`invalid source pageCount: ${source.sourceRef}`);
    }
  }

  for (const item of candidate.items || []) {
    if (ids.has(item.id)) errors.push(`duplicate id: ${item.id}`);
    ids.add(item.id);
    const slotKey = `${item.sourceRef}:${item.locator && item.locator.page}:${item.locator && item.locator.slot}`;
    if (slots.has(slotKey)) errors.push(`duplicate locator slot: ${slotKey}`);
    slots.add(slotKey);
    const source = sourceByRef.get(item.sourceRef);
    if (!source) errors.push(`missing source: ${item.id}`);
    if (source && (!item.privateRef || item.privateRef.sourceMemoryId !== source.privateSourceMemoryId)) {
      errors.push(`private source mismatch: ${item.id}`);
    }
    if (source && (!Number.isSafeInteger(item.locator.page) || item.locator.page < 1 || item.locator.page > source.pageCount)) {
      errors.push(`page outside source: ${item.id}`);
    }
    try {
      indexSchema.createItemIndexEntry({
        id: item.id,
        sourceRef: item.sourceRef,
        locator: item.locator,
        discoveryStatus: item.discoveryStatus,
        curriculum: item.curriculum,
        classificationStatus: item.classificationStatus,
        answerStatus: item.answerStatus,
        reuse: item.reuse,
        releaseStatus: item.releaseStatus
      });
    } catch (error) {
      errors.push(`${item.id}: ${error.message}`);
    }
  }

  validatePageQueue(candidate.unresolvedPages, "unresolved", sourceByRef, errors);
  validatePageQueue(candidate.excludedPageCandidates, "excluded", sourceByRef, errors);
  validatePageQueue(candidate.layoutPages, "layout", sourceByRef, errors);

  const forbidden = [];
  const privateLocations = [];
  scanForbidden(candidate, "$", forbidden, privateLocations);
  if (forbidden.length) errors.push(`forbidden private index keys: ${forbidden.join(", ")}`);
  if (privateLocations.length) errors.push(`private path or URL strings: ${privateLocations.join(", ")}`);
  if (candidate.counts && candidate.counts.questionCandidates !== (candidate.items || []).length) {
    errors.push("questionCandidates count mismatch");
  }
  const rejectedIds = new Set();
  const itemById = new Map((candidate.items || []).map(item => [item.id, item]));
  for (const entry of candidate.rejectedCandidates || []) {
    if (rejectedIds.has(entry.id)) errors.push(`duplicate rejected candidate: ${entry.id}`);
    rejectedIds.add(entry.id);
    const item = itemById.get(entry.id);
    if (!item) {
      errors.push(`rejected candidate item missing: ${entry.id}`);
      continue;
    }
    if (entry.sourceRef !== item.sourceRef || entry.page !== item.locator.page) {
      errors.push(`rejected candidate locator mismatch: ${entry.id}`);
    }
    const source = sourceByRef.get(item.sourceRef);
    if (!source || entry.privateSourceMemoryId !== source.privateSourceMemoryId) {
      errors.push(`rejected candidate source mismatch: ${entry.id}`);
    }
    if (entry.reason !== "visual-rejected-layout-anchor" || entry.reviewStatus !== "visual_verified") {
      errors.push(`rejected candidate lacks visual decision: ${entry.id}`);
    }
    if (item.discoveryStatus !== "layout_candidate" || item.releaseStatus !== "locked" ||
        item.classificationStatus !== "pending" || item.answerStatus !== "missing") {
      errors.push(`rejected candidate state changed: ${entry.id}`);
    }
    const review = (candidate.visualReviewPages || []).find(page =>
      page.privateSourceMemoryId === entry.privateSourceMemoryId && page.page === entry.page &&
      page.resolution === "verified_mission_six_cell_replacing_candidates"
    );
    if (!review || !Array.isArray(review.rejectedCandidateIds) || !review.rejectedCandidateIds.includes(entry.id)) {
      errors.push(`rejected candidate visual decision missing: ${entry.id}`);
    }
  }
  const hasRejectedRegistry = Array.isArray(candidate.rejectedCandidates);
  if (hasRejectedRegistry && candidate.counts && candidate.counts.rejectedCandidates !== rejectedIds.size) {
    errors.push("rejectedCandidates count mismatch");
  }
  if (hasRejectedRegistry && candidate.counts &&
      candidate.counts.activeQuestionCandidates !== (candidate.items || []).length - rejectedIds.size) {
    errors.push("activeQuestionCandidates count mismatch");
  }
  if (candidate.counts && candidate.counts.unresolvedPages !== (candidate.unresolvedPages || []).length) {
    errors.push("unresolvedPages count mismatch");
  }
  if (candidate.counts && candidate.counts.excludedPageCandidates !== (candidate.excludedPageCandidates || []).length) {
    errors.push("excludedPageCandidates count mismatch");
  }

  let preservedPredecessorItems = 0;
  if (predecessor) {
    const predecessorSources = new Map((predecessor.sources || []).map(source => [source.sourceRef, source]));
    for (const [sourceRef, oldSource] of predecessorSources) {
      const currentSource = sourceByRef.get(sourceRef);
      if (!currentSource) errors.push(`predecessor source missing: ${sourceRef}`);
      else if (JSON.stringify(currentSource) !== JSON.stringify(oldSource)) {
        errors.push(`predecessor source changed: ${sourceRef}`);
      }
    }
    for (const [key, value] of Object.entries(predecessor.policy || {})) {
      if (!candidate.policy || candidate.policy[key] !== value) errors.push(`predecessor policy changed: ${key}`);
    }
    if (predecessor.curriculumVersion != null && candidate.curriculumVersion !== predecessor.curriculumVersion) {
      errors.push("predecessor curriculumVersion changed");
    }
    const candidateById = new Map((candidate.items || []).map(item => [item.id, item]));
    for (const oldItem of predecessor.items || []) {
      const current = candidateById.get(oldItem.id);
      if (!current) {
        errors.push(`predecessor id missing: ${oldItem.id}`);
        continue;
      }
      if (JSON.stringify(current) !== JSON.stringify(oldItem)) {
        errors.push(`predecessor item changed: ${oldItem.id}`);
        continue;
      }
      preservedPredecessorItems += 1;
    }
  }

  return {
    ok: errors.length === 0,
    counts: {
      sources: sourceByRef.size,
      items: (candidate.items || []).length,
      uniqueIds: ids.size,
      uniqueLocatorSlots: slots.size,
      preservedPredecessorItems,
      unresolvedPages: (candidate.unresolvedPages || []).length,
      excludedPageCandidates: (candidate.excludedPageCandidates || []).length,
      rejectedCandidates: rejectedIds.size,
      activeQuestionCandidates: (candidate.items || []).length - rejectedIds.size
    },
    errors
  };
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const at = args.indexOf("--index");
  const predecessorAt = args.indexOf("--predecessor");
  if (at < 0 || !args[at + 1]) {
    process.stderr.write("Usage: node audit-private-question-index.cjs --index <index.json> [--predecessor <v1.json>]\n");
    process.exit(1);
  }
  const result = audit(
    readJson(path.resolve(args[at + 1])),
    predecessorAt >= 0 && args[predecessorAt + 1] ? readJson(path.resolve(args[predecessorAt + 1])) : null
  );
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.ok) process.exit(1);
}

module.exports = Object.freeze({ audit, scanForbidden, validatePageQueue });
