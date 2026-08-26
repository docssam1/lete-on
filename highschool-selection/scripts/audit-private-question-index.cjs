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
const REVIEWED_LABEL_PATTERN = /^(?:[1-9]\d*|개념탐구 [1-9]\d*|예제 [1-9]\d*-[1-9]\d*|[1-9]\d* \([1-9]\d*\)-\([1-9]\d*\))$/;
const CANONICAL_PROGRAM_MODES = Object.freeze([...core.PROGRAM_MODES].sort());
const MANUAL_REVIEW_RESOLUTIONS = new Set([
  "verified_manual_items",
  "verified_manual_items_replacing_candidates"
]);

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

function isReplaceableLockedCandidate(item) {
  return new Set(["layout_candidate", "ocr_candidate"]).has(item.discoveryStatus) &&
    item.releaseStatus === "locked" && item.classificationStatus === "pending" &&
    item.answerStatus === "missing";
}

function isReviewedLabel(value) {
  const label = String(value == null ? "" : value).trim();
  return Boolean(label) && label.length <= 64 && !/[\x00-\x1f\x7f]/.test(label) &&
    !PRIVATE_LOCATION_PATTERN.test(label) && REVIEWED_LABEL_PATTERN.test(label);
}

function validateExactKeys(value, allowedKeys, label, errors) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    errors.push(`${label} must be an object`);
    return false;
  }
  const actual = Object.keys(value).sort();
  const expected = [...allowedKeys].sort();
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) {
    errors.push(`${label} has unknown or missing keys`);
    return false;
  }
  return true;
}

function hasBoundVisualReview(candidate, source, item) {
  if (!source || !item || !item.locator || !item.privateRef) return false;
  const reviews = (candidate.visualReviewPages || []).filter(review =>
    review.sourceRef === item.sourceRef && review.page === item.locator.page &&
    review.privateSourceMemoryId === source.privateSourceMemoryId
  );
  if (reviews.length !== 1) return false;
  const review = reviews[0];
  if (MANUAL_REVIEW_RESOLUTIONS.has(review.resolution)) {
    return item.privateRef.layoutKind === "manual-reviewed-item" &&
      Array.isArray(review.itemIds) && review.itemIds.includes(item.id);
  }
  const isVariable = review.resolution === "verified_mission_variable_cell";
  const isMissionSix = new Set([
    "verified_mission_six_cell",
    "verified_mission_six_cell_replacing_candidates"
  ]).has(review.resolution);
  if (!isVariable && !isMissionSix) return false;
  const expectedLayoutKind = isVariable ? "mission-variable-cell" : "mission-six-cell";
  const order = item.privateRef.layoutOrder;
  if (item.privateRef.layoutKind !== expectedLayoutKind || !Number.isSafeInteger(order) || order < 1 ||
      !Number.isSafeInteger(review.itemCount) || order > review.itemCount ||
      item.privateRef.printedLabelHint !== String(order)) return false;
  const expectedId = core.createSharedBankId(
    "question",
    indexSchema.createLocatorKey(source.sourceFingerprint, item.locator.page, item.locator.slot)
  );
  return item.id === expectedId;
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
      const expectedId = core.createSharedBankId(
        "question",
        indexSchema.createLocatorKey(source.sourceFingerprint, review.page, expected)
      );
      if (item.id !== expectedId) errors.push(`variable Mission id mismatch: ${item.id}`);
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

function validateManualReviews(candidate, sourceByRef, errors) {
  const unresolvedKeys = new Set((candidate.unresolvedPages || []).map(entry => `${entry.sourceRef}:${entry.page}`));
  const excludedKeys = new Set((candidate.excludedPageCandidates || []).map(entry => `${entry.sourceRef}:${entry.page}`));
  const layoutKeys = new Set((candidate.layoutPages || []).map(entry => `${entry.sourceRef}:${entry.page}`));
  const rejectedIds = new Set((candidate.rejectedCandidates || []).map(entry => entry.id));
  const continuationByKey = new Map();
  for (const fragment of candidate.continuationFragments || []) {
    const key = `${fragment.sourceRef}:${fragment.fragmentPage}:${fragment.printedLabelHint}`;
    validateExactKeys(fragment, [
      "sourceRef", "privateSourceMemoryId", "reviewPage", "fragmentPage",
      "printedLabelHint", "continuationFrom", "reviewStatus", "evidenceLocator"
    ], `continuation fragment ${key}`, errors);
    if (continuationByKey.has(key)) errors.push(`duplicate continuation fragment: ${key}`);
    continuationByKey.set(key, fragment);
    const source = sourceByRef.get(fragment.sourceRef);
    if (!source) {
      errors.push(`continuation fragment missing source: ${key}`);
      continue;
    }
    if (fragment.privateSourceMemoryId !== source.privateSourceMemoryId) {
      errors.push(`continuation fragment private source mismatch: ${key}`);
    }
    const from = fragment.continuationFrom || {};
    validateExactKeys(from, ["page", "printedLabelHint"], `continuationFrom ${key}`, errors);
    if (!Number.isSafeInteger(fragment.reviewPage) || fragment.reviewPage < 1 ||
        !Number.isSafeInteger(fragment.fragmentPage) || fragment.fragmentPage < 1 ||
        fragment.fragmentPage > source.pageCount ||
        !Number.isSafeInteger(from.page) || from.page < 1 || from.page >= fragment.fragmentPage) {
      errors.push(`continuation fragment page linkage invalid: ${key}`);
    }
    if (fragment.reviewPage !== fragment.fragmentPage) {
      errors.push(`continuation fragment must belong to its reviewed page: ${key}`);
    }
    if (!isReviewedLabel(fragment.printedLabelHint) || !isReviewedLabel(from.printedLabelHint)) {
      errors.push(`continuation fragment label invalid: ${key}`);
    }
    if (fragment.reviewStatus !== "visual_verified") {
      errors.push(`continuation fragment lacks visual verification: ${key}`);
    }
    if (fragment.evidenceLocator !==
        `PDF p.${fragment.fragmentPage}, continuation of p.${from.page} item ${from.printedLabelHint}`) {
      errors.push(`continuation fragment evidence mismatch: ${key}`);
    }
    const targets = (candidate.items || []).filter(item =>
      item.sourceRef === fragment.sourceRef && item.locator && item.locator.page === from.page &&
      item.privateRef && item.privateRef.printedLabelHint === from.printedLabelHint &&
      !rejectedIds.has(item.id)
    );
    if (targets.length !== 1 || (targets[0] && (targets[0].discoveryStatus !== "visual_verified" ||
          !targets[0].privateRef || targets[0].privateRef.discoveryConfidence !== "visual_verified")) ||
        (targets[0] && !hasBoundVisualReview(candidate, source, targets[0]))) {
      errors.push(`continuation fragment target must be one active item: ${key}`);
    }
  }

  const manualReviewKeys = new Set();
  for (const review of candidate.visualReviewPages || []) {
    if (!MANUAL_REVIEW_RESOLUTIONS.has(review.resolution)) continue;
    const key = `${review.sourceRef}:${review.page}`;
    const replacesCandidates = review.resolution === "verified_manual_items_replacing_candidates";
    validateExactKeys(review, [
      "privateSourceMemoryId", "sourceRef", "page", "resolution", "itemCount",
      "itemIds", "continuationKeys", "evidenceLocator",
      ...(replacesCandidates ? ["rejectedCandidateIds"] : [])
    ], `manual visual review ${key}`, errors);
    manualReviewKeys.add(key);
    const source = sourceByRef.get(review.sourceRef);
    if (!source) continue;
    if (unresolvedKeys.has(key) || excludedKeys.has(key) || layoutKeys.has(key)) {
      errors.push(`manual review remains in a pending page queue: ${key}`);
    }
    if (!Number.isSafeInteger(review.itemCount) || review.itemCount < 0 || review.itemCount > 12 ||
        !Array.isArray(review.itemIds) || review.itemIds.length !== review.itemCount ||
        new Set(review.itemIds).size !== review.itemIds.length) {
      errors.push(`manual review item registry invalid: ${key}`);
    }
    if (review.itemCount === 0 && (!Array.isArray(review.continuationKeys) || review.continuationKeys.length === 0)) {
      errors.push(`manual review must contain an item or continuation: ${key}`);
    }
    const pageItems = (candidate.items || []).filter(item =>
      item.sourceRef === review.sourceRef && item.locator && item.locator.page === review.page
    );
    const reviewRejectedIds = new Set(
      Array.isArray(review.rejectedCandidateIds) ? review.rejectedCandidateIds : []
    );
    if (replacesCandidates && (reviewRejectedIds.size === 0 ||
        reviewRejectedIds.size !== (review.rejectedCandidateIds || []).length)) {
      errors.push(`manual replacement rejected registry invalid: ${key}`);
    }
    const rejectedPageItems = pageItems.filter(item => reviewRejectedIds.has(item.id));
    const items = pageItems.filter(item => !reviewRejectedIds.has(item.id)).filter(item =>
      item.privateRef && item.privateRef.layoutKind === "manual-reviewed-item"
    ).sort((left, right) => left.privateRef.layoutOrder - right.privateRef.layoutOrder);
    const unregisteredPageItems = pageItems.filter(item =>
      !reviewRejectedIds.has(item.id) &&
      (!item.privateRef || item.privateRef.layoutKind !== "manual-reviewed-item")
    );
    if (pageItems.length !== review.itemCount + reviewRejectedIds.size ||
        rejectedPageItems.length !== reviewRejectedIds.size ||
        unregisteredPageItems.length !== 0 || items.length !== review.itemCount) {
      errors.push(`manual review itemCount mismatch: ${key}`);
    }
    if (!replacesCandidates && reviewRejectedIds.size !== 0) {
      errors.push(`manual review cannot reject existing candidates: ${key}`);
    }
    const expectedRejectedCandidateIds = [...rejectedPageItems]
      .sort((left, right) => left.locator.slot - right.locator.slot)
      .map(item => item.id);
    if (replacesCandidates &&
        JSON.stringify(review.rejectedCandidateIds) !== JSON.stringify(expectedRejectedCandidateIds)) {
      errors.push(`manual replacement rejectedCandidateIds mismatch: ${key}`);
    }
    const pageRejectedRegistry = (candidate.rejectedCandidates || []).filter(entry =>
      entry.sourceRef === review.sourceRef && entry.page === review.page &&
      entry.reason === "visual-confirmed-manual-replacement"
    );
    const registryRejectedIds = new Set(pageRejectedRegistry.map(entry => entry.id));
    if (replacesCandidates && (registryRejectedIds.size !== reviewRejectedIds.size ||
        Array.from(reviewRejectedIds).some(id => !registryRejectedIds.has(id)))) {
      errors.push(`manual replacement rejectedCandidates mismatch: ${key}`);
    }
    const firstManualSlot = replacesCandidates
      ? rejectedPageItems.reduce((max, item) => Math.max(max, item.locator.slot), 0) + 1
      : 1;
    const labels = new Set();
    items.forEach((item, index) => {
      const expected = index + 1;
      const expectedSlot = firstManualSlot + index;
      validateExactKeys(item, [
        "id", "sourceRef", "locator", "discoveryStatus", "curriculum",
        "classificationStatus", "answerStatus", "reuse", "releaseStatus", "privateRef"
      ], `manual item ${item.id}`, errors);
      validateExactKeys(item.locator, ["page", "slot", "kind", "box"], `manual item locator ${item.id}`, errors);
      validateExactKeys(item.locator && item.locator.box, [
        "x", "y", "width", "height"
      ], `manual item box ${item.id}`, errors);
      validateExactKeys(item.privateRef, [
        "sourceMemoryId", "printedLabelHint", "layoutOrder", "layoutKind",
        "discoveryConfidence", "evidenceLocator"
      ], `manual item privateRef ${item.id}`, errors);
      if (!new Set(["concept", "example", "exercise", "unknown"]).has(item.locator.kind) || !item.locator.box) {
        errors.push(`manual review locator invalid: ${item.id}`);
      }
      if (!item.locator.box || !(item.locator.box.width > 0) || !(item.locator.box.height > 0)) {
        errors.push(`manual review box must have positive area: ${item.id}`);
      }
      if (!isReviewedLabel(item.privateRef.printedLabelHint) || labels.has(item.privateRef.printedLabelHint)) {
        errors.push(`manual review label invalid or duplicate: ${item.id}`);
      }
      labels.add(item.privateRef.printedLabelHint);
      if (item.privateRef.layoutOrder !== expected || item.locator.slot !== expectedSlot) {
        errors.push(`manual review order or slot mismatch: ${item.id}`);
      }
      if (item.discoveryStatus !== "visual_verified" ||
          item.privateRef.discoveryConfidence !== "visual_verified" ||
          item.privateRef.sourceMemoryId !== source.privateSourceMemoryId) {
        errors.push(`manual review lacks bound visual verification: ${item.id}`);
      }
      if (item.curriculum !== null || item.classificationStatus !== "pending" ||
          item.answerStatus !== "missing" || item.releaseStatus !== "locked" ||
          JSON.stringify(item.reuse) !== JSON.stringify(CANONICAL_PROGRAM_MODES)) {
        errors.push(`manual review protected item state mismatch: ${item.id}`);
      }
      const expectedId = core.createSharedBankId(
        "question",
        indexSchema.createLocatorKey(source.sourceFingerprint, review.page, expectedSlot)
      );
      if (item.id !== expectedId) errors.push(`manual review id mismatch: ${item.id}`);
      if (item.privateRef.evidenceLocator !== `PDF p.${review.page}, item ${item.privateRef.printedLabelHint}`) {
        errors.push(`manual review evidence mismatch: ${item.id}`);
      }
    });
    const expectedItemIds = items.map(item => item.id);
    if (!Array.isArray(review.itemIds) ||
        JSON.stringify(review.itemIds) !== JSON.stringify(expectedItemIds)) {
      errors.push(`manual review itemIds mismatch: ${key}`);
    }
    for (let left = 0; left < items.length; left += 1) {
      for (let right = left + 1; right < items.length; right += 1) {
        if (items[left].locator.box && items[right].locator.box &&
            boxesOverlap(items[left].locator.box, items[right].locator.box)) {
          errors.push(`manual review boxes overlap: ${key}`);
        }
      }
    }
    for (const fragment of continuationByKey.values()) {
      if (fragment.sourceRef === review.sourceRef && fragment.fragmentPage === review.page &&
          labels.has(fragment.printedLabelHint)) {
        errors.push(`manual item and continuation labels overlap: ${key}:${fragment.printedLabelHint}`);
      }
    }
    const expectedContinuationKeys = new Set(
      Array.from(continuationByKey.entries())
        .filter(([, fragment]) => fragment.sourceRef === review.sourceRef && fragment.reviewPage === review.page)
        .map(([continuationKey]) => continuationKey)
    );
    if (!Array.isArray(review.continuationKeys) ||
        review.continuationKeys.length !== new Set(review.continuationKeys).size ||
        review.continuationKeys.some(continuationKey => !expectedContinuationKeys.has(continuationKey)) ||
        expectedContinuationKeys.size !== new Set(review.continuationKeys || []).size) {
      errors.push(`manual review continuation registry mismatch: ${key}`);
    }
    const expectedReviewEvidence = replacesCandidates
      ? `PDF p.${review.page}, visually reviewed manual replacement items ${review.itemCount}`
      : `PDF p.${review.page}, visually reviewed manual items ${review.itemCount}`;
    if (review.evidenceLocator !== expectedReviewEvidence) {
      errors.push(`manual review evidence mismatch: ${key}`);
    }
  }

  for (const item of candidate.items || []) {
    if (!item.privateRef || item.privateRef.layoutKind !== "manual-reviewed-item") continue;
    const key = `${item.sourceRef}:${item.locator && item.locator.page}`;
    if (!manualReviewKeys.has(key)) errors.push(`manual item visual decision missing: ${item.id}`);
  }
  for (const [key, fragment] of continuationByKey) {
    const reviews = (candidate.visualReviewPages || []).filter(review =>
      MANUAL_REVIEW_RESOLUTIONS.has(review.resolution) && review.sourceRef === fragment.sourceRef &&
      review.page === fragment.reviewPage && Array.isArray(review.continuationKeys) &&
      review.continuationKeys.includes(key)
    );
    if (reviews.length !== 1) errors.push(`continuation fragment visual decision missing: ${key}`);
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
  validateManualReviews(candidate, sourceByRef, errors);

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
    validateExactKeys(entry, [
      "id", "sourceRef", "privateSourceMemoryId", "page", "reason", "reviewStatus"
    ], `rejected candidate ${entry.id}`, errors);
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
    const isMissionReplacement = entry.reason === "visual-rejected-layout-anchor";
    const isManualReplacement = entry.reason === "visual-confirmed-manual-replacement";
    const isNonQuestionReplacement = entry.reason === "visual-confirmed-non-question-replacement";
    if ((!isMissionReplacement && !isManualReplacement && !isNonQuestionReplacement) ||
        entry.reviewStatus !== "visual_verified") {
      errors.push(`rejected candidate lacks visual decision: ${entry.id}`);
    }
    if (!isReplaceableLockedCandidate(item)) {
      errors.push(`rejected candidate state changed: ${entry.id}`);
    }
    const expectedResolution = isManualReplacement
      ? "verified_manual_items_replacing_candidates"
      : isNonQuestionReplacement
        ? "verified_non_question_replacing_candidates"
        : "verified_mission_six_cell_replacing_candidates";
    const review = (candidate.visualReviewPages || []).find(page =>
      page.privateSourceMemoryId === entry.privateSourceMemoryId && page.page === entry.page &&
      page.sourceRef === entry.sourceRef && page.resolution === expectedResolution
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
  if (candidate.counts && candidate.counts.layoutCandidatePages != null &&
      candidate.counts.layoutCandidatePages !== (candidate.layoutPages || []).length) {
    errors.push("layoutCandidatePages count mismatch");
  }
  if (candidate.counts && candidate.counts.addedLayoutCandidates != null &&
      candidate.counts.addedLayoutCandidates !==
      (candidate.items || []).filter(item => item.discoveryStatus === "layout_candidate").length) {
    errors.push("addedLayoutCandidates count mismatch");
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
  const continuationCount = (candidate.continuationFragments || []).length;
  const manualVerifiedCount = (candidate.items || []).filter(item =>
    item.privateRef && item.privateRef.layoutKind === "manual-reviewed-item"
  ).length;
  if ((manualVerifiedCount > 0 || continuationCount > 0) &&
      (!candidate.counts || candidate.counts.continuationFragments !== continuationCount)) {
    errors.push("continuationFragments count mismatch");
  }
  if ((manualVerifiedCount > 0 || continuationCount > 0) &&
      (!candidate.counts || candidate.counts.manualVerified !== manualVerifiedCount)) {
    errors.push("manualVerified count mismatch");
  }

  const manualReplacementReviews = (candidate.visualReviewPages || []).filter(review =>
    review.resolution === "verified_manual_items_replacing_candidates"
  );
  const nonQuestionReplacementReviews = (candidate.visualReviewPages || []).filter(review =>
    review.resolution === "verified_non_question_replacing_candidates"
  );
  for (const review of nonQuestionReplacementReviews) {
    const key = `${review.sourceRef}:${review.page}`;
    validateExactKeys(review, [
      "privateSourceMemoryId", "sourceRef", "page", "resolution",
      "rejectedCandidateIds", "evidenceLocator"
    ], `non-question replacement review ${key}`, errors);
    const excludedMatches = (candidate.excludedPageCandidates || []).filter(entry =>
      entry.sourceRef === review.sourceRef && entry.privateSourceMemoryId === review.privateSourceMemoryId &&
      entry.page === review.page && entry.reason === "visual-confirmed-non-question" &&
      entry.reviewStatus === "visual_verified"
    );
    if (excludedMatches.length !== 1) {
      errors.push(`non-question replacement exclusion mismatch: ${key}`);
    }
    const pageItemIds = (candidate.items || []).filter(item =>
      item.sourceRef === review.sourceRef && item.locator && item.locator.page === review.page
    ).sort((left, right) => left.locator.slot - right.locator.slot).map(item => item.id);
    if (!Array.isArray(review.rejectedCandidateIds) ||
        JSON.stringify(review.rejectedCandidateIds) !== JSON.stringify(pageItemIds)) {
      errors.push(`non-question replacement registry mismatch: ${key}`);
    }
    if ((candidate.unresolvedPages || []).some(entry =>
      entry.sourceRef === review.sourceRef && entry.page === review.page
    ) || (candidate.layoutPages || []).some(entry =>
      entry.sourceRef === review.sourceRef && entry.page === review.page
    )) errors.push(`non-question replacement remains queued: ${key}`);
    if (review.evidenceLocator !== `PDF p.${review.page}`) {
      errors.push(`non-question replacement evidence mismatch: ${key}`);
    }
  }
  if (manualReplacementReviews.length > 0 && !predecessor) {
    errors.push("manual replacement audit requires a predecessor index");
  }
  if (nonQuestionReplacementReviews.length > 0 && !predecessor) {
    errors.push("non-question replacement audit requires a predecessor index");
  }
  if (predecessor) {
    const predecessorItemById = new Map((predecessor.items || []).map(item => [item.id, item]));
    const predecessorReplacementReviews = new Map(
      (predecessor.visualReviewPages || [])
        .filter(review => review.resolution === "verified_manual_items_replacing_candidates")
        .map(review => [`${review.sourceRef}:${review.page}`, review])
    );
    const currentReplacementReviews = new Map(
      manualReplacementReviews.map(review => [`${review.sourceRef}:${review.page}`, review])
    );
    for (const [key, oldReview] of predecessorReplacementReviews) {
      const currentReview = currentReplacementReviews.get(key);
      if (!currentReview || JSON.stringify(currentReview) !== JSON.stringify(oldReview)) {
        errors.push(`manual replacement predecessor review changed: ${key}`);
      }
    }
    for (const review of manualReplacementReviews) {
      const key = `${review.sourceRef}:${review.page}`;
      const oldReview = predecessorReplacementReviews.get(key);
      if (oldReview) continue;
      const predecessorPendingMatches = [
        ...(predecessor.unresolvedPages || []),
        ...(predecessor.excludedPageCandidates || [])
      ].filter(entry =>
        entry.privateSourceMemoryId === review.privateSourceMemoryId && entry.page === review.page &&
        entry.sourceRef === review.sourceRef
      );
      const predecessorLayoutFallbackMatches = (predecessor.layoutPages || []).filter(entry =>
        entry.privateSourceMemoryId === review.privateSourceMemoryId && entry.page === review.page &&
        entry.sourceRef === review.sourceRef && entry.coverageStatus === "candidate_full" &&
        entry.reviewStatus === "pending"
      );
      const predecessorQueueMatches = predecessorPendingMatches.length > 0
        ? predecessorPendingMatches
        : predecessorLayoutFallbackMatches;
      if (predecessorQueueMatches.length !== 1) {
        errors.push(`manual replacement predecessor queue mismatch: ${key}`);
      }
      const predecessorPageReviews = (predecessor.visualReviewPages || []).filter(entry =>
        entry.sourceRef === review.sourceRef && entry.page === review.page
      );
      if (predecessorPageReviews.length > 0) {
        errors.push(`manual replacement predecessor page already reviewed: ${key}`);
      }
      const predecessorPageItems = (predecessor.items || []).filter(item =>
        item.sourceRef === review.sourceRef && item.locator && item.locator.page === review.page
      ).sort((left, right) => left.locator.slot - right.locator.slot);
      const expectedRejectedIds = predecessorPageItems.map(item => item.id);
      if (JSON.stringify(review.rejectedCandidateIds) !== JSON.stringify(expectedRejectedIds)) {
        errors.push(`manual replacement predecessor registry mismatch: ${key}`);
      }
      const predecessorRejectedIds = new Set(
        (predecessor.rejectedCandidates || []).map(entry => entry.id)
      );
      if ((review.rejectedCandidateIds || []).some(id => predecessorRejectedIds.has(id))) {
        errors.push(`manual replacement predecessor candidate already rejected: ${key}`);
      }
      for (const id of Array.isArray(review.rejectedCandidateIds) ? review.rejectedCandidateIds : []) {
        const oldItem = predecessorItemById.get(id);
        const currentItem = itemById.get(id);
        if (!oldItem || !currentItem || JSON.stringify(oldItem) !== JSON.stringify(currentItem)) {
          errors.push(`manual replacement predecessor item mismatch: ${id}`);
        }
      }
    }

    const predecessorNonQuestionReviews = new Map(
      (predecessor.visualReviewPages || [])
        .filter(review => review.resolution === "verified_non_question_replacing_candidates")
        .map(review => [`${review.sourceRef}:${review.page}`, review])
    );
    const currentNonQuestionReviews = new Map(
      nonQuestionReplacementReviews.map(review => [`${review.sourceRef}:${review.page}`, review])
    );
    for (const [key, oldReview] of predecessorNonQuestionReviews) {
      const currentReview = currentNonQuestionReviews.get(key);
      if (!currentReview || JSON.stringify(currentReview) !== JSON.stringify(oldReview)) {
        errors.push(`non-question replacement predecessor review changed: ${key}`);
      }
    }
    for (const review of nonQuestionReplacementReviews) {
      const key = `${review.sourceRef}:${review.page}`;
      if (predecessorNonQuestionReviews.has(key)) continue;
      const predecessorLayoutMatches = (predecessor.layoutPages || []).filter(entry =>
        entry.privateSourceMemoryId === review.privateSourceMemoryId && entry.page === review.page &&
        entry.sourceRef === review.sourceRef && entry.coverageStatus === "candidate_full" &&
        entry.reviewStatus === "pending"
      );
      if (predecessorLayoutMatches.length !== 1) {
        errors.push(`non-question replacement predecessor queue mismatch: ${key}`);
      }
      if ((predecessor.visualReviewPages || []).some(entry =>
        entry.sourceRef === review.sourceRef && entry.page === review.page
      )) errors.push(`non-question replacement predecessor page already reviewed: ${key}`);
      const predecessorPageItems = (predecessor.items || []).filter(item =>
        item.sourceRef === review.sourceRef && item.locator && item.locator.page === review.page
      ).sort((left, right) => left.locator.slot - right.locator.slot);
      const expectedRejectedIds = predecessorPageItems.map(item => item.id);
      if (JSON.stringify(review.rejectedCandidateIds) !== JSON.stringify(expectedRejectedIds)) {
        errors.push(`non-question replacement predecessor registry mismatch: ${key}`);
      }
      const predecessorRejectedIds = new Set(
        (predecessor.rejectedCandidates || []).map(entry => entry.id)
      );
      if ((review.rejectedCandidateIds || []).some(id => predecessorRejectedIds.has(id))) {
        errors.push(`non-question replacement predecessor candidate already rejected: ${key}`);
      }
      if (predecessorPageItems.some(item => !isReplaceableLockedCandidate(item))) {
        errors.push(`non-question replacement predecessor state mismatch: ${key}`);
      }
      for (const oldItem of predecessorPageItems) {
        const currentItem = itemById.get(oldItem.id);
        if (!currentItem || JSON.stringify(currentItem) !== JSON.stringify(oldItem)) {
          errors.push(`non-question replacement predecessor item mismatch: ${oldItem.id}`);
        }
      }
    }
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

module.exports = Object.freeze({
  audit,
  boxesOverlap,
  isReviewedLabel,
  scanForbidden,
  validateManualReviews,
  validatePageQueue,
  validateVariableMissionReviews
});
