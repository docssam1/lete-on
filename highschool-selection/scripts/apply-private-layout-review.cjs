#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const core = require("../data/question-bank-core.js");
const itemIndex = require("../data/question-item-index.js");

const REVIEWED_LABEL_PATTERN = /^(?:[1-9]\d*|개념탐구 [1-9]\d*|예제 [1-9]\d*-[1-9]\d*|[1-9]\d* \([1-9]\d*\)-\([1-9]\d*\))$/;
const MANUAL_REVIEW_RESOLUTIONS = new Set([
  "verified_manual_items",
  "verified_manual_items_replacing_candidates"
]);

function fail(message) {
  throw new Error(message);
}

function validateInputKeys(value, allowedKeys, requiredKeys, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail(`${label} must be an object`);
  }
  const allowed = new Set(allowedKeys);
  const actual = Object.keys(value);
  const unknown = actual.filter(key => !allowed.has(key));
  const missing = requiredKeys.filter(key => !Object.prototype.hasOwnProperty.call(value, key));
  if (unknown.length > 0 || missing.length > 0) {
    fail(`${label} has unknown or missing keys`);
  }
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

function reviewedLabel(value, field) {
  const label = String(value == null ? "" : value).trim();
  if (!label || label.length > 64 || /[\x00-\x1f\x7f]/.test(label) ||
      /(?:\b[a-z]:[\\/]|\\\\|file:\/\/|https?:\/\/|\/(?:Users|home|mnt)\/)/i.test(label) ||
      !REVIEWED_LABEL_PATTERN.test(label)) {
    fail(`${field} does not match the reviewed label grammar`);
  }
  return label;
}

function validateManualLabelDisjoint(anchors, continuations) {
  const itemLabels = new Set(anchors.map(anchor => anchor.printedLabelHint));
  for (const fragment of continuations) {
    if (itemLabels.has(fragment.printedLabelHint)) {
      fail(`manual item and continuation labels must be disjoint: ${fragment.printedLabelHint}`);
    }
  }
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
  const match = /^([a-z0-9-]+):(\d+):(exclude|exclude_replace_candidates|mission|mission6|mission6_replace_candidates)$/.exec(String(value || ""));
  if (!match) fail(`Invalid decision: ${value}`);
  return {
    sourceMemoryId: match[1],
    page: Number(match[2]),
    resolution: match[3] === "mission" ? "mission6" : match[3]
  };
}

function normalizedMissionAnchors(value) {
  if (!Array.isArray(value) || value.length < 3 || value.length > 5) {
    fail("mission_variable requires three to five reviewed anchors");
  }
  const anchors = value.map((anchor, index) => {
    if (!anchor || !anchor.box || typeof anchor.box !== "object") {
      fail("mission_variable anchors require exact reviewed boxes");
    }
    validateInputKeys(
      anchor,
      ["kind", "printedLabelHint", "layoutOrder", "box"],
      ["printedLabelHint", "layoutOrder", "box"],
      "mission_variable anchor"
    );
    if (Object.prototype.hasOwnProperty.call(anchor, "kind") && anchor.kind !== "mission") {
      fail("mission_variable anchor kind must remain mission");
    }
    validateInputKeys(anchor.box, ["x", "y", "width", "height"], ["x", "y", "width", "height"],
      "mission_variable anchor box");
    if (!(Number(anchor.box.width) > 0) || !(Number(anchor.box.height) > 0)) {
      fail("mission_variable anchor boxes must have positive area");
    }
    const printedLabelHint = String(anchor && anchor.printedLabelHint || "");
    const layoutOrder = Number(anchor && anchor.layoutOrder);
    if (printedLabelHint !== String(index + 1) || layoutOrder !== index + 1) {
      fail("mission_variable anchors must use sequential labels and layoutOrder");
    }
    const locator = itemIndex.createLocator({
      page: 1,
      slot: index + 1,
      kind: "mission",
      box: anchor.box
    });
    return {
      kind: "mission",
      printedLabelHint,
      layoutOrder,
      box: { ...locator.box }
    };
  });
  for (let left = 0; left < anchors.length; left += 1) {
    for (let right = left + 1; right < anchors.length; right += 1) {
      if (boxesOverlap(anchors[left].box, anchors[right].box)) {
        fail("mission_variable anchor boxes must not overlap");
      }
    }
  }
  return anchors;
}

function normalizedManualAnchors(value) {
  if (!Array.isArray(value) || value.length > 12) {
    fail("manual_items requires zero to twelve reviewed anchors");
  }
  const labels = new Set();
  const anchors = value.map((anchor, index) => {
    if (!anchor || !anchor.box || typeof anchor.box !== "object") {
      fail("manual_items anchors require exact reviewed boxes");
    }
    validateInputKeys(
      anchor,
      ["kind", "printedLabelHint", "layoutOrder", "box"],
      ["kind", "printedLabelHint", "layoutOrder", "box"],
      "manual_items anchor"
    );
    validateInputKeys(anchor.box, ["x", "y", "width", "height"], ["x", "y", "width", "height"],
      "manual_items anchor box");
    if (!(Number(anchor.box.width) > 0) || !(Number(anchor.box.height) > 0)) {
      fail("manual_items anchor boxes must have positive area");
    }
    const layoutOrder = Number(anchor.layoutOrder);
    if (layoutOrder !== index + 1) fail("manual_items anchors must use sequential layoutOrder");
    const kind = String(anchor.kind || "");
    if (!new Set(["concept", "example", "exercise", "unknown"]).has(kind)) {
      fail(`manual_items anchor kind is not allowed: ${kind}`);
    }
    const locator = itemIndex.createLocator({ page: 1, slot: index + 1, kind, box: anchor.box });
    const printedLabelHint = reviewedLabel(anchor.printedLabelHint, "manual_items printedLabelHint");
    if (labels.has(printedLabelHint)) fail(`duplicate manual_items label: ${printedLabelHint}`);
    labels.add(printedLabelHint);
    return {
      kind,
      printedLabelHint,
      layoutOrder,
      box: { ...locator.box }
    };
  });
  for (let left = 0; left < anchors.length; left += 1) {
    for (let right = left + 1; right < anchors.length; right += 1) {
      if (boxesOverlap(anchors[left].box, anchors[right].box)) {
        fail("manual_items anchor boxes must not overlap");
      }
    }
  }
  return anchors;
}

function normalizedContinuations(value, decisionPage) {
  if (value == null) return [];
  if (!Array.isArray(value) || value.length > 4) {
    fail("manual_items continuations must contain at most four reviewed fragments");
  }
  const seen = new Set();
  return value.map(fragment => {
    validateInputKeys(
      fragment,
      ["fragmentPage", "printedLabelHint", "continuationFrom"],
      ["fragmentPage", "printedLabelHint", "continuationFrom"],
      "manual_items continuation"
    );
    validateInputKeys(
      fragment.continuationFrom,
      ["page", "printedLabelHint"],
      ["page", "printedLabelHint"],
      "manual_items continuationFrom"
    );
    const fragmentPage = Number(fragment && fragment.fragmentPage);
    const fromPage = Number(fragment && fragment.continuationFrom && fragment.continuationFrom.page);
    if (!Number.isSafeInteger(fragmentPage) || fragmentPage < 1 ||
        !Number.isSafeInteger(fromPage) || fromPage < 1 || fromPage >= fragmentPage) {
      fail("manual_items continuation pages must be positive and forward-linked");
    }
    if (fragmentPage !== Number(decisionPage)) {
      fail("manual_items continuation fragment must be on the reviewed page");
    }
    const printedLabelHint = reviewedLabel(fragment.printedLabelHint, "continuation printedLabelHint");
    const fromLabel = reviewedLabel(
      fragment.continuationFrom.printedLabelHint,
      "continuationFrom printedLabelHint"
    );
    const key = `${fragmentPage}:${printedLabelHint}`;
    if (seen.has(key)) fail(`duplicate manual_items continuation: ${key}`);
    seen.add(key);
    return {
      fragmentPage,
      printedLabelHint,
      continuationFrom: { page: fromPage, printedLabelHint: fromLabel }
    };
  });
}

function normalizeDecisionRecord(value) {
  if (!value || typeof value !== "object") fail("Decision record must be an object");
  const sourceMemoryId = String(value.sourceMemoryId || "");
  const page = Number(value.page);
  const resolution = value.resolution === "mission" ? "mission6" : value.resolution;
  if (!/^[a-z0-9-]+$/.test(sourceMemoryId) || !Number.isSafeInteger(page) || page < 1) {
    fail(`Invalid decision record: ${JSON.stringify(value)}`);
  }
  if (!new Set([
    "exclude", "exclude_replace_candidates", "mission6", "mission6_replace_candidates", "mission_variable",
    "manual_items", "manual_items_replace_candidates"
  ]).has(resolution)) {
    fail(`Invalid decision resolution: ${resolution}`);
  }
  const customResolution = resolution === "mission_variable" ||
    new Set(["manual_items", "manual_items_replace_candidates"]).has(resolution);
  validateInputKeys(
    value,
    customResolution
      ? resolution === "mission_variable"
        ? ["sourceMemoryId", "page", "resolution", "anchors"]
        : ["sourceMemoryId", "page", "resolution", "anchors", "continuations"]
      : ["sourceMemoryId", "page", "resolution"],
    customResolution
      ? ["sourceMemoryId", "page", "resolution", "anchors"]
      : ["sourceMemoryId", "page", "resolution"],
    "decision record"
  );
  if (resolution === "mission_variable") {
    return { sourceMemoryId, page, resolution, anchors: normalizedMissionAnchors(value.anchors) };
  }
  if (new Set(["manual_items", "manual_items_replace_candidates"]).has(resolution)) {
    const anchors = normalizedManualAnchors(value.anchors);
    const continuations = normalizedContinuations(value.continuations, page);
    validateManualLabelDisjoint(anchors, continuations);
    if (anchors.length === 0 && continuations.length === 0) {
      fail("manual_items requires at least one reviewed anchor or continuation");
    }
    return { sourceMemoryId, page, resolution, anchors, continuations };
  }
  if (value.anchors != null) fail(`${resolution} decisions cannot include custom anchors`);
  if (value.continuations != null) fail(`${resolution} decisions cannot include continuations`);
  return { sourceMemoryId, page, resolution };
}

function decisionsFromManifest(manifest, base) {
  if (!manifest || manifest.schemaVersion !== 1 || !Array.isArray(manifest.decisions) || manifest.decisions.length === 0) {
    fail("Decision manifest must use schemaVersion 1 and contain decisions");
  }
  validateInputKeys(
    manifest,
    ["schemaVersion", "status", "sources", "decisions"],
    ["schemaVersion", "sources", "decisions"],
    "decision manifest"
  );
  if (Object.prototype.hasOwnProperty.call(manifest, "status") &&
      manifest.status !== "visual-review-decision") {
    fail("Decision manifest status must be visual-review-decision");
  }
  if (!Array.isArray(manifest.sources) || manifest.sources.length === 0) {
    fail("Decision manifest must contain bound sources");
  }
  const baseSources = new Map((base.sources || []).map(source => [source.privateSourceMemoryId, source]));
  const fingerprints = new Map();
  for (const source of manifest.sources || []) {
    validateInputKeys(
      source,
      ["privateSourceMemoryId", "sourceFingerprint"],
      ["privateSourceMemoryId", "sourceFingerprint"],
      "manifest source"
    );
    if (!/^[a-z0-9-]+$/.test(String(source.privateSourceMemoryId || "")) ||
        !/^[0-9a-f]{64}$/.test(String(source.sourceFingerprint || ""))) {
      fail("Manifest source metadata is invalid");
    }
    if (fingerprints.has(source.privateSourceMemoryId)) fail(`Duplicate manifest source: ${source.privateSourceMemoryId}`);
    fingerprints.set(source.privateSourceMemoryId, source.sourceFingerprint);
  }
  const decisions = manifest.decisions.map(normalizeDecisionRecord);
  const usedSourceIds = new Set(decisions.map(decision => decision.sourceMemoryId));
  if (fingerprints.size !== usedSourceIds.size ||
      Array.from(fingerprints.keys()).some(sourceMemoryId => !usedSourceIds.has(sourceMemoryId))) {
    fail("Manifest sources must exactly match decision sources");
  }
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
    ["layout", result.layoutPages],
    ["visual review", result.visualReviewPages]
  ]) {
    const seen = new Set();
    for (const entry of queue || []) {
      const key = `${entry.privateSourceMemoryId}:${entry.page}`;
      if (seen.has(key)) fail(`Duplicate ${name} page: ${key}`);
      seen.add(key);
    }
  }
  const rejectedIds = new Set();
  for (const entry of result.rejectedCandidates || []) {
    if (rejectedIds.has(entry.id)) fail(`Duplicate rejected candidate: ${entry.id}`);
    rejectedIds.add(entry.id);
  }
  const continuationKeys = new Set();
  for (const entry of result.continuationFragments || []) {
    const key = `${entry.sourceRef}:${entry.fragmentPage}:${entry.printedLabelHint}`;
    if (continuationKeys.has(key)) fail(`Duplicate continuation fragment: ${key}`);
    continuationKeys.add(key);
  }
}

function queueLocation(result, sourceMemoryId, page, { allowLayoutFallback = false } = {}) {
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
  if (matches.length === 1) return matches[0];
  if (!allowLayoutFallback) return null;

  const layoutQueue = result.layoutPages || [];
  const layoutIndex = layoutQueue.findIndex(entry =>
    entry.privateSourceMemoryId === sourceMemoryId && entry.page === page &&
    entry.coverageStatus === "candidate_full" && entry.reviewStatus === "pending"
  );
  return layoutIndex >= 0
    ? { name: "layout", queue: layoutQueue, index: layoutIndex, entry: layoutQueue[layoutIndex] }
    : null;
}

function hasBoundVisualReview(reviewPages, source, item) {
  if (!source || !item || !item.locator || !item.privateRef) return false;
  const reviews = (reviewPages || []).filter(review =>
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
    itemIndex.createLocatorKey(source.sourceFingerprint, item.locator.page, item.locator.slot)
  );
  return item.id === expectedId;
}

function applyReviews(base, decisions) {
  const result = JSON.parse(JSON.stringify(base));
  validateReviewInput(result);
  const reviewPages = Array.isArray(result.visualReviewPages) ? result.visualReviewPages : [];
  const rejectedCandidates = Array.isArray(result.rejectedCandidates) ? result.rejectedCandidates : [];
  const continuationFragments = Array.isArray(result.continuationFragments) ? result.continuationFragments : [];
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
    const location = queueLocation(result, decision.sourceMemoryId, decision.page, {
      // A detector can incorrectly mark a partially indexed page as candidate_full,
      // leaving it outside the unresolved queue. Only a complete manual replacement
      // or a visual non-question replacement may use that protected fallback.
      allowLayoutFallback: new Set([
        "exclude_replace_candidates", "manual_items_replace_candidates"
      ]).has(resolution)
    });
    if (!location) fail(`Review candidate not found: ${decisionKey}`);

    if (new Set(["exclude", "exclude_replace_candidates"]).has(resolution)) {
      const pageItems = result.items.filter(item =>
        item.sourceRef === source.sourceRef && item.locator.page === decision.page
      ).sort((left, right) => left.locator.slot - right.locator.slot);
      const replacesCandidates = resolution === "exclude_replace_candidates";
      if (replacesCandidates && pageItems.length === 0) {
        fail(`Non-question replacement requires existing candidates: ${decisionKey}`);
      }
      if (replacesCandidates && pageItems.some(item =>
        item.discoveryStatus !== "layout_candidate" || item.releaseStatus !== "locked" ||
        item.classificationStatus !== "pending" || item.answerStatus !== "missing"
      )) fail(`Non-question replacement found a non-candidate item: ${decisionKey}`);
      if (replacesCandidates && pageItems.some(item =>
        rejectedCandidates.some(entry => entry.id === item.id)
      )) fail(`Non-question replacement found an already rejected candidate: ${decisionKey}`);
      if (replacesCandidates) {
        for (const item of pageItems) {
          rejectedCandidates.push({
            id: item.id,
            sourceRef: source.sourceRef,
            privateSourceMemoryId: decision.sourceMemoryId,
            page: decision.page,
            reason: "visual-confirmed-non-question-replacement",
            reviewStatus: "visual_verified"
          });
        }
      }
      const verified = {
        sourceRef: source.sourceRef,
        privateSourceMemoryId: decision.sourceMemoryId,
        page: decision.page,
        reason: "visual-confirmed-non-question",
        reviewStatus: "visual_verified"
      };
      location.queue.splice(location.index, 1);
      const layoutAt = (result.layoutPages || []).findIndex(entry =>
        entry.privateSourceMemoryId === decision.sourceMemoryId && entry.page === decision.page
      );
      if (layoutAt >= 0) result.layoutPages.splice(layoutAt, 1);
      result.excludedPageCandidates.push(verified);
      reviewPages.push({
        privateSourceMemoryId: decision.sourceMemoryId,
        sourceRef: source.sourceRef,
        page: decision.page,
        resolution: replacesCandidates
          ? "verified_non_question_replacing_candidates"
          : "verified_non_question",
        ...(replacesCandidates ? { rejectedCandidateIds: pageItems.map(item => item.id) } : {}),
        evidenceLocator: `PDF p.${decision.page}`
      });
      continue;
    }

    if (!new Set([
      "mission6", "mission6_replace_candidates", "mission_variable",
      "manual_items", "manual_items_replace_candidates"
    ]).has(resolution)) {
      fail(`Unsupported visual resolution: ${decision.resolution}`);
    }
    location.queue.splice(location.index, 1);
    const layoutAt = (result.layoutPages || []).findIndex(entry =>
      entry.privateSourceMemoryId === decision.sourceMemoryId && entry.page === decision.page
    );
    if (layoutAt >= 0) result.layoutPages.splice(layoutAt, 1);
    const pageItems = result.items.filter(item => item.sourceRef === source.sourceRef && item.locator.page === decision.page);
    if (new Set(["manual_items", "manual_items_replace_candidates"]).has(resolution)) {
      const replacesCandidates = resolution === "manual_items_replace_candidates";
      if (!replacesCandidates && pageItems.length > 0) {
        fail(`Manual item review requires an empty page index: ${decisionKey}`);
      }
      if (replacesCandidates && pageItems.length === 0) {
        fail(`Manual item replacement requires existing candidates: ${decisionKey}`);
      }
      if (replacesCandidates && pageItems.some(item =>
        item.discoveryStatus !== "layout_candidate" || item.releaseStatus !== "locked" ||
        item.classificationStatus !== "pending" || item.answerStatus !== "missing"
      )) fail(`Manual item replacement found a non-candidate item: ${decisionKey}`);
      if (replacesCandidates && pageItems.some(item =>
        rejectedCandidates.some(entry => entry.id === item.id)
      )) fail(`Manual item replacement found an already rejected candidate: ${decisionKey}`);
      const reviewedAnchors = normalizedManualAnchors(decision.anchors);
      const reviewedContinuations = normalizedContinuations(decision.continuations, decision.page);
      validateManualLabelDisjoint(reviewedAnchors, reviewedContinuations);
      if (reviewedAnchors.length === 0 && reviewedContinuations.length === 0) {
        fail(`Manual item review is empty: ${decisionKey}`);
      }
      const orderedPageItems = [...pageItems].sort((left, right) => left.locator.slot - right.locator.slot);
      if (replacesCandidates) {
        for (const item of orderedPageItems) {
          rejectedCandidates.push({
            id: item.id,
            sourceRef: item.sourceRef,
            privateSourceMemoryId: decision.sourceMemoryId,
            page: decision.page,
            reason: "visual-confirmed-manual-replacement",
            reviewStatus: "visual_verified"
          });
        }
      }
      const itemIds = [];
      let nextManualSlot = replacesCandidates
        ? orderedPageItems.reduce((max, item) => Math.max(max, item.locator.slot), 0) + 1
        : 1;
      for (const anchor of reviewedAnchors) {
        const slot = nextManualSlot++;
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
            layoutKind: "manual-reviewed-item",
            discoveryConfidence: "visual_verified",
            evidenceLocator: `PDF p.${decision.page}, item ${anchor.printedLabelHint}`
          }
        });
        itemIds.push(entry.id);
      }

      const continuationKeys = [];
      for (const fragment of reviewedContinuations) {
        if (fragment.fragmentPage > source.pageCount || fragment.continuationFrom.page > source.pageCount) {
          fail(`Manual continuation page outside source: ${decisionKey}`);
        }
        const targets = result.items.filter(item =>
          item.sourceRef === source.sourceRef && item.locator.page === fragment.continuationFrom.page &&
          item.privateRef && item.privateRef.printedLabelHint === fragment.continuationFrom.printedLabelHint &&
          !rejectedCandidates.some(entry => entry.id === item.id)
        );
        if (targets.length !== 1) {
          fail(`Manual continuation must link one exact starting item: ${decisionKey}`);
        }
        if (targets[0].discoveryStatus !== "visual_verified" || !targets[0].privateRef ||
            targets[0].privateRef.discoveryConfidence !== "visual_verified") {
          fail(`Manual continuation requires a visually verified starting item: ${targets[0].id}`);
        }
        if (!hasBoundVisualReview(reviewPages, source, targets[0])) {
          fail(`Manual continuation requires a review-bound starting item: ${targets[0].id}`);
        }
        const continuationKey = `${source.sourceRef}:${fragment.fragmentPage}:${fragment.printedLabelHint}`;
        if (continuationFragments.some(entry =>
          `${entry.sourceRef}:${entry.fragmentPage}:${entry.printedLabelHint}` === continuationKey
        )) fail(`Duplicate manual continuation after review: ${continuationKey}`);
        continuationFragments.push({
          sourceRef: source.sourceRef,
          privateSourceMemoryId: decision.sourceMemoryId,
          reviewPage: decision.page,
          fragmentPage: fragment.fragmentPage,
          printedLabelHint: fragment.printedLabelHint,
          continuationFrom: {
            page: fragment.continuationFrom.page,
            printedLabelHint: fragment.continuationFrom.printedLabelHint
          },
          reviewStatus: "visual_verified",
          evidenceLocator: `PDF p.${fragment.fragmentPage}, continuation of p.${fragment.continuationFrom.page} item ${fragment.continuationFrom.printedLabelHint}`
        });
        continuationKeys.push(continuationKey);
      }
      reviewPages.push({
        privateSourceMemoryId: decision.sourceMemoryId,
        sourceRef: source.sourceRef,
        page: decision.page,
        resolution: replacesCandidates
          ? "verified_manual_items_replacing_candidates"
          : "verified_manual_items",
        ...(replacesCandidates ? { rejectedCandidateIds: orderedPageItems.map(item => item.id) } : {}),
        itemCount: reviewedAnchors.length,
        itemIds,
        continuationKeys,
        evidenceLocator: replacesCandidates
          ? `PDF p.${decision.page}, visually reviewed manual replacement items ${reviewedAnchors.length}`
          : `PDF p.${decision.page}, visually reviewed manual items ${reviewedAnchors.length}`
      });
      continue;
    }
    if (new Set(["mission6", "mission_variable"]).has(resolution) && pageItems.length > 0) {
      fail(`Mission review requires an empty page index: ${decisionKey}`);
    }
    if (resolution === "mission6_replace_candidates") {
      if (pageItems.length === 0) fail(`Mission6 replacement requires existing candidates: ${decisionKey}`);
      if (pageItems.some(item =>
        item.discoveryStatus !== "layout_candidate" || item.releaseStatus !== "locked" ||
        item.classificationStatus !== "pending" || item.answerStatus !== "missing"
      )) fail(`Mission6 replacement found a non-candidate item: ${decisionKey}`);
      for (const item of pageItems) {
        if (rejectedCandidates.some(entry => entry.id === item.id)) {
          fail(`Candidate already rejected: ${item.id}`);
        }
        rejectedCandidates.push({
          id: item.id,
          sourceRef: item.sourceRef,
          privateSourceMemoryId: decision.sourceMemoryId,
          page: decision.page,
          reason: "visual-rejected-layout-anchor",
          reviewStatus: "visual_verified"
        });
      }
    }
    let nextSlot = pageItems.reduce((max, item) => Math.max(max, item.locator.slot), 0) + 1;
    const reviewedAnchors = resolution === "mission_variable"
      ? normalizedMissionAnchors(decision.anchors)
      : missionAnchors();
    for (const anchor of reviewedAnchors) {
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
          layoutKind: resolution === "mission_variable" ? "mission-variable-cell" : "mission-six-cell",
          discoveryConfidence: "visual_verified",
          evidenceLocator: `PDF p.${decision.page}, Mission ${anchor.printedLabelHint}`
        }
      });
    }
    reviewPages.push({
      privateSourceMemoryId: decision.sourceMemoryId,
      sourceRef: source.sourceRef,
      page: decision.page,
      resolution: resolution === "mission6"
        ? "verified_mission_six_cell"
        : resolution === "mission6_replace_candidates"
          ? "verified_mission_six_cell_replacing_candidates"
          : "verified_mission_variable_cell",
      rejectedCandidateIds: resolution === "mission6_replace_candidates" ? pageItems.map(item => item.id) : [],
      itemCount: reviewedAnchors.length,
      evidenceLocator: `PDF p.${decision.page}, Mission 1-${reviewedAnchors.length}`
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
  result.rejectedCandidates = rejectedCandidates.sort((a, b) => a.id.localeCompare(b.id));
  result.continuationFragments = continuationFragments.sort((a, b) =>
    a.sourceRef.localeCompare(b.sourceRef) || a.fragmentPage - b.fragmentPage ||
    a.printedLabelHint.localeCompare(b.printedLabelHint)
  );
  result.excludedPageCandidates.sort((a, b) => a.sourceRef.localeCompare(b.sourceRef) || a.page - b.page);
  result.unresolvedPages.sort((a, b) => a.sourceRef.localeCompare(b.sourceRef) || a.page - b.page);
  result.counts = {
    ...result.counts,
    questionCandidates: result.items.length,
    activeQuestionCandidates: result.items.length - result.rejectedCandidates.length,
    rejectedCandidates: result.rejectedCandidates.length,
    continuationFragments: result.continuationFragments.length,
    excludedPageCandidates: result.excludedPageCandidates.length,
    unresolvedPages: result.unresolvedPages.length,
    addedLayoutCandidates: result.items.filter(item => item.discoveryStatus === "layout_candidate").length,
    layoutCandidatePages: (result.layoutPages || []).length,
    visuallyVerified: result.items.filter(item => item.discoveryStatus === "visual_verified").length,
    manualVerified: result.items.filter(item =>
      item.privateRef && item.privateRef.layoutKind === "manual-reviewed-item"
    ).length,
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
      fail("Usage: node apply-private-layout-review.cjs --base <index.json> --output <reviewed.json> [--decision-file <fingerprint-bound private-review.json; supports replacement decisions>] [--decision <source:page:exclude|exclude_replace_candidates|mission6|mission6_replace_candidates> ...]");
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
  normalizedContinuations,
  normalizedManualAnchors,
  normalizedMissionAnchors,
  normalizeDecisionRecord,
  parseDecision,
  queueLocation,
  validateReviewInput
});
