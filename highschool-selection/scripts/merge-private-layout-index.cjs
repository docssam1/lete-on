#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const core = require("../data/question-bank-core.js");
const itemIndex = require("../data/question-item-index.js");

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function getArg(args, name) {
  const at = args.indexOf(name);
  return at >= 0 ? args[at + 1] : null;
}

function boxesOverlap(a, b) {
  if (!a || !b) return false;
  const xOverlap = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
  const yOverlap = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
  const smaller = Math.min(a.width * a.height, b.width * b.height);
  return smaller > 0 && (xOverlap * yOverlap) / smaller >= 0.55;
}

function pageKey(entry) {
  return `${entry.sourceRef}:${entry.page}`;
}

function keyedPageRegistry(entries, label) {
  const registry = new Map();
  for (const entry of entries || []) {
    const key = pageKey(entry);
    if (registry.has(key)) fail(`Duplicate ${label} page: ${key}`);
    registry.set(key, JSON.parse(JSON.stringify(entry)));
  }
  return registry;
}

function mergeIndex(base, layout) {
  const items = base.items.map(item => JSON.parse(JSON.stringify(item)));
  const bySourcePage = new Map();
  for (const item of items) {
    const key = `${item.sourceRef}:${item.locator.page}`;
    const list = bySourcePage.get(key) || [];
    list.push(item);
    bySourcePage.set(key, list);
  }

  const newItems = [];
  const unresolvedByPage = keyedPageRegistry(base.unresolvedPages, "unresolved");
  const excludedByPage = keyedPageRegistry(base.excludedPageCandidates, "excluded");
  const layoutByPage = keyedPageRegistry(base.layoutPages, "layout");

  for (const source of layout.sources || []) {
    const baseSource = (base.sources || []).find(entry => entry.sourceFingerprint === source.sourceFingerprint);
    if (!baseSource) fail(`Layout source not present in base index: ${source.sourceFingerprint}`);
    for (const page of source.pages || []) {
      const pageKey = `${baseSource.sourceRef}:${page.page}`;
      if (!Number.isSafeInteger(page.page) || page.page < 1 || page.page > baseSource.pageCount) {
        fail(`Layout page outside source: ${pageKey}`);
      }
      const existing = bySourcePage.get(pageKey) || [];
      unresolvedByPage.delete(pageKey);
      excludedByPage.delete(pageKey);
      layoutByPage.delete(pageKey);
      if (page.disposition === "excluded_candidate") {
        excludedByPage.set(pageKey, {
          sourceRef: baseSource.sourceRef,
          privateSourceMemoryId: source.sourceMemoryId,
          page: page.page,
          reason: page.reason,
          reviewStatus: "pending"
        });
        continue;
      }
      if (page.disposition !== "layout_candidate" || !Array.isArray(page.anchors) || page.anchors.length === 0) {
        unresolvedByPage.set(pageKey, {
          sourceRef: baseSource.sourceRef,
          privateSourceMemoryId: source.sourceMemoryId,
          page: page.page,
          reason: page.reason || "layout-anchor-not-found"
        });
        continue;
      }

      let nextSlot = existing.reduce((max, item) => Math.max(max, item.locator.slot), 0) + 1;
      let added = 0;
      for (const anchor of page.anchors) {
        if (existing.some(item => boxesOverlap(item.locator.box, anchor.box))) continue;
        const slot = nextSlot++;
        const locatorKey = itemIndex.createLocatorKey(source.sourceFingerprint, page.page, slot);
        const entry = itemIndex.createItemIndexEntry({
          id: core.createSharedBankId("question", locatorKey),
          sourceRef: baseSource.sourceRef,
          locator: { page: page.page, slot, kind: anchor.kind, box: anchor.box },
          discoveryStatus: "layout_candidate",
          curriculum: null,
          classificationStatus: "pending",
          answerStatus: "missing",
          reuse: core.PROGRAM_MODES,
          releaseStatus: "locked"
        });
        const privateItem = {
          ...entry,
          privateRef: {
            sourceMemoryId: source.sourceMemoryId,
            printedLabelHint: anchor.printedLabelHint || null,
            layoutOrder: anchor.layoutOrder,
            layoutKind: page.layoutKind,
            discoveryConfidence: "candidate_only"
          }
        };
        items.push(privateItem);
        existing.push(privateItem);
        newItems.push(privateItem);
        added += 1;
      }
      layoutByPage.set(pageKey, {
        sourceRef: baseSource.sourceRef,
        privateSourceMemoryId: source.sourceMemoryId,
        page: page.page,
        layoutKind: page.layoutKind,
        detectedAnchors: page.anchors.length,
        addedCandidates: added,
        coverageStatus: page.coverageStatus || "unknown",
        reviewStatus: "pending"
      });
      if (page.coverageStatus === "partial") {
        unresolvedByPage.set(pageKey, {
          sourceRef: baseSource.sourceRef,
          privateSourceMemoryId: source.sourceMemoryId,
          page: page.page,
          reason: "partial-layout-coverage"
        });
      } else if (added === 0 && existing.length === 0) {
        unresolvedByPage.set(pageKey, {
          sourceRef: baseSource.sourceRef,
          privateSourceMemoryId: source.sourceMemoryId,
          page: page.page,
          reason: "layout-candidates-overlapped-or-empty"
        });
      }
      bySourcePage.set(pageKey, existing);
    }
  }

  const byPageOrder = (a, b) => a.sourceRef.localeCompare(b.sourceRef) || a.page - b.page;
  const unresolvedPages = Array.from(unresolvedByPage.values()).sort(byPageOrder);
  const excludedPageCandidates = Array.from(excludedByPage.values()).sort(byPageOrder);
  const layoutPages = Array.from(layoutByPage.values()).sort(byPageOrder);

  const seen = new Set();
  for (const item of items) {
    if (seen.has(item.id)) fail(`Duplicate question id: ${item.id}`);
    seen.add(item.id);
    if (item.releaseStatus !== "locked" || item.curriculum !== null || item.classificationStatus !== "pending") {
      fail(`Unsafe candidate state: ${item.id}`);
    }
  }

  return {
    ...base,
    schemaVersion: itemIndex.INDEX_SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    status: "draft",
    predecessorSchemaVersion: base.schemaVersion,
    policy: {
      ...base.policy,
      layoutDetectionIsDiscoveryOnly: true,
      exclusionsRequireVisualReview: true
    },
    counts: {
      ...base.counts,
      questionCandidates: items.length,
      addedLayoutCandidates: newItems.length,
      layoutCandidatePages: layoutPages.length,
      excludedPageCandidates: excludedPageCandidates.length,
      unresolvedPages: unresolvedPages.length,
      visuallyVerified: items.filter(item => item.discoveryStatus === "visual_verified").length,
      curriculumApproved: 0,
      answerVerified: 0,
      verifiedExcludedPages: excludedPageCandidates.filter(page => page.reviewStatus === "visual_verified").length
    },
    items,
    layoutPages,
    excludedPageCandidates,
    unresolvedPages
  };
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const basePath = getArg(args, "--base");
  const layoutPath = getArg(args, "--layout");
  const outputPath = getArg(args, "--output");
  if (!basePath || !layoutPath || !outputPath) {
    fail("Usage: node merge-private-layout-index.cjs --base <v1.json> --layout <layout.json> --output <v2.json>");
  }
  const result = mergeIndex(readJson(path.resolve(basePath)), readJson(path.resolve(layoutPath)));
  const resolvedOutput = path.resolve(outputPath);
  fs.mkdirSync(path.dirname(resolvedOutput), { recursive: true });
  fs.writeFileSync(resolvedOutput, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(result.counts)}\n`);
}

module.exports = Object.freeze({ boxesOverlap, keyedPageRegistry, mergeIndex });
