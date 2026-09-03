#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const pageIndex = require("../data/source-page-index.js");

const bankRoot = path.resolve(__dirname, "..");
const projectRoot = path.resolve(bankRoot, "..", "..");
const manifestPath = path.join(bankRoot, "data", "source-page-fingerprints.json");
const bundleVerificationPath = path.join(bankRoot, "data", "source-pdf-bundle-verification.json");

function fingerprint(page) {
  const file = path.join(projectRoot, page.assetPath);
  const bytes = fs.readFileSync(file);
  return {
    assetId: page.assetId,
    assetPath: page.assetPath,
    bytes: bytes.length,
    sha256: crypto.createHash("sha256").update(bytes).digest("hex")
  };
}

const actual = {
  schemaVersion: pageIndex.schemaVersion,
  algorithm: "sha256",
  assets: pageIndex.pages.map(fingerprint)
};

if (process.argv.includes("--update")) {
  fs.writeFileSync(manifestPath, `${JSON.stringify(actual, null, 2)}\n`, "utf8");
  console.log(`UPDATED source page fingerprints: assets=${actual.assets.length}`);
  process.exit(0);
}

if (!fs.existsSync(manifestPath)) {
  console.error("FAIL source page fingerprint audit: manifest is missing; run with --update after source review");
  process.exit(1);
}

const expected = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const bundleVerification = JSON.parse(fs.readFileSync(bundleVerificationPath, "utf8"));
const issues = [];
if (expected.schemaVersion !== actual.schemaVersion) issues.push("schema version mismatch");
if (expected.algorithm !== "sha256") issues.push("fingerprint algorithm must be sha256");
if (!Array.isArray(expected.assets) || expected.assets.length !== 191) issues.push("fingerprint manifest must contain 191 assets");
if (bundleVerification.sourcePdfCount !== 40) issues.push("source bundle must contain 40 PDFs");
if (bundleVerification.sourcePdfPageCount !== 191 || bundleVerification.assetPageCount !== 191 || bundleVerification.exactRenderedPageMatches !== 191) {
  issues.push("source PDF, rendered page, and asset totals must all be 191");
}
if (bundleVerification.render.algorithm !== "sha256" || bundleVerification.render.dpi !== 130) issues.push("source bundle render contract changed");
if (bundleVerification.printedFooterPageTotalsAuthoritative !== false) issues.push("printed footer totals must not override PDF page counts");
if (!Array.isArray(bundleVerification.types) || bundleVerification.types.length !== 40) issues.push("source bundle must record 40 type PDFs");
const pdfTypesByNumber = new Map((bundleVerification.types || []).map(entry => [entry.number, entry]));
for (let number = 1; number <= 40; number += 1) {
  const sourcePdf = pdfTypesByNumber.get(number);
  const indexedPages = pageIndex.pages.filter(page => page.diagnosticNumber === number).length;
  if (!sourcePdf) {
    issues.push(`source PDF verification missing q${String(number).padStart(2, "0")}`);
    continue;
  }
  if (sourcePdf.pdfPages !== indexedPages) issues.push(`source PDF page count differs from indexed assets q${String(number).padStart(2, "0")}`);
  if (!/^[0-9a-f]{64}$/.test(sourcePdf.pdfSha256)) issues.push(`invalid source PDF sha256 q${String(number).padStart(2, "0")}`);
}

const expectedById = new Map((expected.assets || []).map(asset => [asset.assetId, asset]));
actual.assets.forEach(function (asset) {
  const saved = expectedById.get(asset.assetId);
  if (!saved) {
    issues.push(`missing fingerprint: ${asset.assetId}`);
    return;
  }
  if (saved.assetPath !== asset.assetPath) issues.push(`path changed: ${asset.assetId}`);
  if (saved.bytes !== asset.bytes) issues.push(`byte size changed: ${asset.assetId}`);
  if (saved.sha256 !== asset.sha256) issues.push(`sha256 changed: ${asset.assetId}`);
});

if (new Set((expected.assets || []).map(asset => asset.assetId)).size !== (expected.assets || []).length) {
  issues.push("duplicate fingerprint asset ID");
}

if (issues.length) {
  console.error(`FAIL source page fingerprint audit (${issues.length})`);
  issues.forEach(issue => console.error(`- ${issue}`));
  process.exit(1);
}

console.log("PASS source page fingerprint audit: sourcePdf=40 sourcePdfPage=191 assets=191 exactRenderedPageMatch=191 algorithm=sha256 drift=0 footerTotal=non-authoritative");
