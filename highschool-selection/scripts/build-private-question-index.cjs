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

const args = process.argv.slice(2);
const inputAt = args.indexOf("--input");
const outputAt = args.indexOf("--output");
if (inputAt < 0 || outputAt < 0 || !args[inputAt + 1] || !args[outputAt + 1]) {
  fail("Usage: node build-private-question-index.cjs --input <discovery.json> --output <private-index.json>");
}
const inputPath = path.resolve(args[inputAt + 1]);
const outputPath = path.resolve(args[outputAt + 1]);
const discovery = JSON.parse(fs.readFileSync(inputPath, "utf8").replace(/^\uFEFF/, ""));
const items = [];
const unresolvedPages = [];
const sources = [];

for (const book of discovery.books || []) {
  if (!/^[0-9a-f]{64}$/.test(book.sourceFingerprint)) fail("Invalid source fingerprint");
  const sourceRef = core.createSharedBankId("source", `sha256:${book.sourceFingerprint}`);
  sources.push({
    sourceRef,
    privateSourceMemoryId: book.sourceMemoryId,
    sourceFingerprint: book.sourceFingerprint,
    pageCount: book.pageCount
  });
  for (const page of book.pages || []) {
    const anchors = Array.isArray(page.anchors) ? page.anchors : [];
    if (page.missionLayout || (page.textLength > 80 && anchors.length === 0)) {
      unresolvedPages.push({
        sourceRef,
        privateSourceMemoryId: book.sourceMemoryId,
        page: page.page,
        reason: page.missionLayout ? "mission-layout-requires-visual-segmentation" : "content-without-stable-anchor"
      });
    }
    const sorted = anchors.slice().sort((a, b) => a.y - b.y || a.x - b.x);
    sorted.forEach((anchor, offset) => {
      const slot = offset + 1;
      const next = sorted[offset + 1];
      const x = Math.max(0, Number(anchor.x) / Number(page.width));
      const y = Math.max(0, Number(anchor.y) / Number(page.height));
      const endY = next ? Number(next.y) / Number(page.height) : 0.94;
      const width = Math.min(0.98 - x, 0.9);
      const height = Math.max(0.02, Math.min(0.94 - y, endY - y));
      const locatorKey = itemIndex.createLocatorKey(book.sourceFingerprint, page.page, slot);
      const entry = itemIndex.createItemIndexEntry({
        id: core.createSharedBankId("question", locatorKey),
        sourceRef,
        locator: { page: page.page, slot, kind: anchor.kind || "unknown", box: { x, y, width, height } },
        discoveryStatus: "ocr_candidate",
        curriculum: null,
        classificationStatus: "pending",
        answerStatus: "missing",
        reuse: core.PROGRAM_MODES,
        releaseStatus: "locked"
      });
      items.push({
        ...entry,
        privateRef: {
          sourceMemoryId: book.sourceMemoryId,
          printedLabelHint: anchor.label || null
        }
      });
    });
  }
}

const seen = new Set();
for (const item of items) {
  if (seen.has(item.id)) fail(`Duplicate question id: ${item.id}`);
  seen.add(item.id);
}

const result = {
  schemaVersion: itemIndex.INDEX_SCHEMA_VERSION,
  generatedAt: new Date().toISOString(),
  status: "draft",
  curriculumVersion: "2022-revised",
  policy: {
    ocrIsDiscoveryOnly: true,
    originalsModified: false,
    answersInIndex: false,
    releaseLocked: true
  },
  counts: {
    sources: sources.length,
    questionCandidates: items.length,
    unresolvedPages: unresolvedPages.length,
    visuallyVerified: 0,
    curriculumApproved: 0,
    answerVerified: 0
  },
  sources,
  items,
  unresolvedPages
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
process.stdout.write(`${JSON.stringify(result.counts)}\n`);
