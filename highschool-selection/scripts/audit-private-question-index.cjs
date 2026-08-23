#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const indexSchema = require("../data/question-item-index.js");

const FORBIDDEN_KEYS = new Set([
  "prompt", "answer", "solution", "explanation", "ocrText", "sourceText",
  "path", "localPath", "downloadPath", "downloadUrl", "fileName"
]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function scanForbidden(value, trail, findings) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => scanForbidden(entry, `${trail}[${index}]`, findings));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, entry] of Object.entries(value)) {
    if (FORBIDDEN_KEYS.has(key)) findings.push(`${trail}.${key}`);
    scanForbidden(entry, `${trail}.${key}`, findings);
  }
}

function audit(candidate, predecessor) {
  const errors = [];
  const ids = new Set();
  const slots = new Set();
  const sourceByRef = new Map((candidate.sources || []).map(source => [source.sourceRef, source]));
  if (candidate.schemaVersion !== indexSchema.INDEX_SCHEMA_VERSION) {
    errors.push(`schemaVersion must be ${indexSchema.INDEX_SCHEMA_VERSION}`);
  }

  for (const item of candidate.items || []) {
    if (ids.has(item.id)) errors.push(`duplicate id: ${item.id}`);
    ids.add(item.id);
    const slotKey = `${item.sourceRef}:${item.locator && item.locator.page}:${item.locator && item.locator.slot}`;
    if (slots.has(slotKey)) errors.push(`duplicate locator slot: ${slotKey}`);
    slots.add(slotKey);
    const source = sourceByRef.get(item.sourceRef);
    if (!source) errors.push(`missing source: ${item.id}`);
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

  const forbidden = [];
  scanForbidden(candidate, "$", forbidden);
  if (forbidden.length) errors.push(`forbidden private index keys: ${forbidden.join(", ")}`);
  if (candidate.counts && candidate.counts.questionCandidates !== (candidate.items || []).length) {
    errors.push("questionCandidates count mismatch");
  }
  if (candidate.counts && candidate.counts.unresolvedPages !== (candidate.unresolvedPages || []).length) {
    errors.push("unresolvedPages count mismatch");
  }
  if (candidate.counts && candidate.counts.excludedPageCandidates !== (candidate.excludedPageCandidates || []).length) {
    errors.push("excludedPageCandidates count mismatch");
  }

  let preservedPredecessorItems = 0;
  if (predecessor) {
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
      excludedPageCandidates: (candidate.excludedPageCandidates || []).length
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

module.exports = Object.freeze({ audit });
