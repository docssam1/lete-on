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

function boxesOverlap(left, right) {
  const overlapWidth = Math.max(
    0,
    Math.min(left.x + left.width, right.x + right.width) - Math.max(left.x, right.x)
  );
  const overlapHeight = Math.max(
    0,
    Math.min(left.y + left.height, right.y + right.height) - Math.max(left.y, right.y)
  );
  return overlapWidth * overlapHeight > 0.000001;
}

function validateVariableMissionReviews(candidate, sourceByRef, errors) {
  const reviewByPage = new Map();
  const unresolvedKeys = new Set((candidate.unresolvedPages || []).map(entry => `${entry.sourceRef}:${entry.page}`));
  const excludedKeys = new Set((candidate.excludedPageCandidates || []).map(entry => `${entry.sourceRef}:${entry.page}`));
  const layoutKeys = new Set((candidate.layoutPages || []).map(entry => `${entry.sourceRef}:${entry.page}`));
  for (const review of candidate.visualReviewPages || []) {
    const key = `${review.sourceRef}:${review.page}`;
    if (reviewByPage.has(key)) errors.push(`duplicate visual review page: ${key}`);
    reviewByPage.set(key, review);
    const source = sourceByRef.get(review.sourceRef);
    if (!source) {
      errors.push(`visual review page missing source: ${key}`);
      continue;
    }
    if (review.privateSourceMemoryId !== source.privateSourceMemoryId) {
      errors.push(`visual review private source mismatch: ${key}`);
    }
    if (!Number.isSafeInteger(review.page) || review.page < 1 || review.page > source.pageCount) {
      errors.push(`visual review page outside source: ${key}`);
    }
    if (review.resolution !== "verified_mission_variable_cell") continue;

    if (unresolvedKeys.has(key) || excludedKeys.has(key) || layoutKeys.has(key)) {
      errors.push(`variable Mission remains in a pending page queue: ${key}`);
    }

    if (!Number.isSafeInteger(review.itemCount) || review.itemCount < 3 || review.itemCount > 5) {
      errors.push(`variable Mission itemCount must be three to five: ${key}`);
    }
    if (!Array.isArray(review.rejectedCandidateIds) || review.rejectedCandidateIds.length !== 0) {
      errors.push(`variable Mission cannot reject existing candidates: ${key}`);
    }
    const pageItems = (candidate.items || []).filter(item =>
      item.sourceRef === review.sourceRef && item.locator && item.locator.page === review.page
    );
    const items = pageItems.filter(item =>
      item.privateRef && item.privateRef.layoutKind === "mission-variable-cell"
    ).sort((left, right) => left.privateRef.layoutOrder - right.privateRef.layoutOrder);
    if (pageItems.length !== review.itemCount || items.length !== review.itemCount) {
      errors.push(`variable Mission itemCount mismatch: ${key}`);
    }
    items.forEach((item, index) => {
      const expected = index + 1;
      if (item.locator.kind !== "mission" || !item.locator.box) {
        errors.push(`variable Mission locator invalid: ${item.id}`);
      }
      if (!item.locator.box || !(item.locator.box.width > 0) || !(item.locator.box.height > 0)) {
        errors.push(`variable Mission box must have positive area: ${item.id}`);
      }
      if (item.discoveryStatus !== "visual_verified" ||
          item.privateRef.discoveryConfidence !== "visual_verified") {
        errors.push(`variable Mission lacks visual verification: ${item.id}`);
      }
      if (item.privateRef.sourceMemoryId !== source.privateSourceMemoryId) {
        errors.push(`variable Mission private source mismatch: ${item.id}`);
      }
      if (item.privateRef.layoutOrder !== expected || item.privateRef.printedLabelHint !== String(expected)) {
        errors.push(`variable Mission order or label mismatch: ${item.id}`);
      }
      if (item.locator.slot !== expected) {
        errors.push(`variable Mission slot mismatch: ${item.id}`);
      }
      if (item.privateRef.evidenceLocator !== `PDF p.${review.page}, Mission ${expected}`) {
        errors.push(`variable Mission evidence mismatch: ${item.id}`);
      }
    });
    if (review.evidenceLocator !== `PDF p.${review.page}, Mission 1-${review.itemCount}`) {
      errors.push(`variable Mission review evidence mismatch: ${key}`);
    }
    for (let left = 0; left < items.length; left += 1) {
      for (let right = left + 1; right < items.length; right += 1) {
        if (items[left].locator.box && items[right].locator.box &&
            boxesOverlap(items[left].locator.box, items[right].locator.box)) {
          errors.push(`variable Mission boxes overlap: ${key}`);
        }
      }
    }
  }

  for (const item of candidate.items || []) {
    if (!item.privateRef || item.privateRef.layoutKind !== "mission-variable-cell") continue;
    const key = `${item.sourceRef}:${item.locator && item.locator.page}`;
    const review = reviewByPage.get(key);
    if (!review || review.resolution !== "verified_mission_variable_cell") {
      errors.push(`variable Mission visual decision missing: ${item.id}`);
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
  validateVariableMissionReviews(candidate, sourceByRef, errors);

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
  if (candidate.counts && candidate.counts.visuallyVerified != null &&
      candidate.counts.visuallyVerified !== (candidate.items || []).filter(item => item.discoveryStatus === "visual_verified").length) {
    errors.push("visuallyVerified count mismatch");
  }
  if (candidate.counts && candidate.counts.verifiedExcludedPages != null &&
      candidate.counts.verifiedExcludedPages !== (candidate.excludedPageCandidates || []).filter(page => page.reviewStatus === "visual_verified").length) {
    errors.push("verifiedExcludedPages count mismatch");
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

module.exports = Object.freeze({ audit, boxesOverlap, scanForbidden, validatePageQueue, validateVariableMissionReviews });
