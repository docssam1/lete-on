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
  const match = /^([a-z0-9-]+):(\d+):(exclude|mission)$/.exec(String(value || ""));
  if (!match) fail(`Invalid decision: ${value}`);
  return { sourceMemoryId: match[1], page: Number(match[2]), resolution: match[3] };
}

function applyReviews(base, decisions) {
  const result = JSON.parse(JSON.stringify(base));
  const reviewPages = Array.isArray(result.visualReviewPages) ? result.visualReviewPages : [];
  const decisionKeys = new Set();

  for (const decision of decisions) {
    const decisionKey = `${decision.sourceMemoryId}:${decision.page}`;
    if (decisionKeys.has(decisionKey)) fail(`Duplicate decision: ${decisionKey}`);
    decisionKeys.add(decisionKey);
    const source = (result.sources || []).find(entry => entry.privateSourceMemoryId === decision.sourceMemoryId);
    if (!source) fail(`Source not found: ${decision.sourceMemoryId}`);
    if (!Number.isSafeInteger(decision.page) || decision.page < 1 || decision.page > source.pageCount) {
      fail(`Page outside source: ${decisionKey}`);
    }
    const excludedAt = (result.excludedPageCandidates || []).findIndex(entry =>
      entry.privateSourceMemoryId === decision.sourceMemoryId && entry.page === decision.page
    );
    if (excludedAt < 0) fail(`Excluded candidate not found: ${decisionKey}`);

    if (decision.resolution === "exclude") {
      result.excludedPageCandidates[excludedAt] = {
        ...result.excludedPageCandidates[excludedAt],
        reason: "visual-confirmed-non-question",
        reviewStatus: "visual_verified"
      };
      reviewPages.push({
        privateSourceMemoryId: decision.sourceMemoryId,
        sourceRef: source.sourceRef,
        page: decision.page,
        resolution: "verified_non_question",
        evidenceLocator: `PDF p.${decision.page}`
      });
      continue;
    }

    result.excludedPageCandidates.splice(excludedAt, 1);
    const pageItems = result.items.filter(item => item.sourceRef === source.sourceRef && item.locator.page === decision.page);
    let nextSlot = pageItems.reduce((max, item) => Math.max(max, item.locator.slot), 0) + 1;
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
  result.counts = {
    ...result.counts,
    questionCandidates: result.items.length,
    excludedPageCandidates: result.excludedPageCandidates.length,
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
    const decisions = [];
    for (let index = 0; index < args.length; index += 1) {
      if (args[index] === "--decision" && args[index + 1]) decisions.push(parseDecision(args[index + 1]));
    }
    if (!basePath || !outputPath || decisions.length === 0) {
      fail("Usage: node apply-private-layout-review.cjs --base <index.json> --output <reviewed.json> --decision <source:page:exclude|mission> [...]");
    }
    const result = applyReviews(readJson(path.resolve(basePath)), decisions);
    const resolvedOutput = path.resolve(outputPath);
    fs.mkdirSync(path.dirname(resolvedOutput), { recursive: true });
    fs.writeFileSync(resolvedOutput, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    process.stdout.write(`${JSON.stringify(result.counts)}\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exit(1);
  }
}

module.exports = Object.freeze({ applyReviews, missionAnchors, parseDecision });
