#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const bankRoot = path.resolve(__dirname, "..");
const projectRoot = path.resolve(bankRoot, "..", "..");
const schema = require("../data/schema.js");
const registry = require("../data/type-registry.js");
const pageIndex = require("../data/source-page-index.js");
const issues = [];
const pilotNumbers = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]);
const releaseLockedNumbers = new Set();
const eligibleNumbers = new Set([...pilotNumbers].filter(number => !releaseLockedNumbers.has(number)));
const sourceBundleConflictNumbers = new Set();
const evidenceConflictNumbers = new Set([25, 39]);
const releaseNotes = new Map();
const expectedReviewedPages = {
  "diagnostic-similar-q01-p01": ["problem", 1, 4],
  "diagnostic-similar-q01-p02": ["problem", 5, 8],
  "diagnostic-similar-q01-p03": ["problem", 9, 10],
  "diagnostic-similar-q01-p04": ["quick-answer", 1, 10],
  "diagnostic-similar-q01-p05": ["solution", 1, 8],
  "diagnostic-similar-q01-p06": ["solution", 9, 10],
  "diagnostic-similar-q02-p01": ["problem", 1, 4],
  "diagnostic-similar-q02-p02": ["problem", 5, 8],
  "diagnostic-similar-q02-p03": ["quick-answer", 1, 8],
  "diagnostic-similar-q02-p04": ["solution", 1, 8],
  "diagnostic-similar-q03-p01": ["problem", 1, 4],
  "diagnostic-similar-q03-p02": ["problem", 5, 8],
  "diagnostic-similar-q03-p03": ["problem", 9, 10],
  "diagnostic-similar-q03-p04": ["quick-answer", 1, 10],
  "diagnostic-similar-q03-p05": ["solution", 1, 10],
  "diagnostic-similar-q04-p01": ["problem", 1, 4],
  "diagnostic-similar-q04-p02": ["problem", 5, 8],
  "diagnostic-similar-q04-p03": ["problem", 9, 12],
  "diagnostic-similar-q04-p04": ["problem", 13, 15],
  "diagnostic-similar-q04-p05": ["quick-answer", 1, 15],
  "diagnostic-similar-q04-p06": ["solution", 1, 9],
  "diagnostic-similar-q04-p07": ["solution", 10, 15],
  "diagnostic-similar-q05-p01": ["problem", 1, 4],
  "diagnostic-similar-q05-p02": ["problem", 5, 8],
  "diagnostic-similar-q05-p03": ["problem", 9, 10],
  "diagnostic-similar-q05-p04": ["quick-answer", 1, 10],
  "diagnostic-similar-q05-p05": ["solution", 1, 6],
  "diagnostic-similar-q05-p06": ["solution", 7, 10],
  "diagnostic-similar-q06-p01": ["problem", 1, 4],
  "diagnostic-similar-q06-p02": ["quick-answer", 1, 4],
  "diagnostic-similar-q06-p03": ["solution", 1, 4],
  "diagnostic-similar-q07-p01": ["problem", 1, 4],
  "diagnostic-similar-q07-p02": ["problem", 5, 8],
  "diagnostic-similar-q07-p03": ["problem", 9, 10],
  "diagnostic-similar-q07-p04": ["quick-answer", 1, 10],
  "diagnostic-similar-q07-p05": ["solution", 1, 7],
  "diagnostic-similar-q07-p06": ["solution", 8, 10],
  "diagnostic-similar-q08-p01": ["problem", 1, 4],
  "diagnostic-similar-q08-p02": ["problem", 5, 6],
  "diagnostic-similar-q08-p03": ["quick-answer", 1, 6],
  "diagnostic-similar-q08-p04": ["solution", 1, 6],
  "diagnostic-similar-q09-p01": ["problem", 1, 4],
  "diagnostic-similar-q09-p02": ["problem", 5, 8],
  "diagnostic-similar-q09-p03": ["problem", 9, 10],
  "diagnostic-similar-q09-p04": ["quick-answer", 1, 10],
  "diagnostic-similar-q09-p05": ["solution", 1, 9],
  "diagnostic-similar-q09-p06": ["solution", 10, 10],
  "diagnostic-similar-q10-p01": ["problem", 1, 4],
  "diagnostic-similar-q10-p02": ["problem", 5, 8],
  "diagnostic-similar-q10-p03": ["problem", 9, 10],
  "diagnostic-similar-q10-p04": ["quick-answer", 1, 10],
  "diagnostic-similar-q10-p05": ["solution", 1, 7],
  "diagnostic-similar-q10-p06": ["solution", 8, 10],
  "diagnostic-similar-q11-p01": ["problem", 1, 4],
  "diagnostic-similar-q11-p02": ["problem", 5, 5],
  "diagnostic-similar-q11-p03": ["quick-answer", 1, 5],
  "diagnostic-similar-q11-p04": ["solution", 1, 5],
  "diagnostic-similar-q12-p01": ["problem", 1, 4],
  "diagnostic-similar-q12-p02": ["problem", 5, 5],
  "diagnostic-similar-q12-p03": ["quick-answer", 1, 5],
  "diagnostic-similar-q12-p04": ["solution", 1, 5],
  "diagnostic-similar-q13-p01": ["problem", 1, 4],
  "diagnostic-similar-q13-p02": ["problem", 5, 8],
  "diagnostic-similar-q13-p03": ["problem", 9, 10],
  "diagnostic-similar-q13-p04": ["quick-answer", 1, 10],
  "diagnostic-similar-q13-p05": ["solution", 1, 8],
  "diagnostic-similar-q13-p06": ["solution", 9, 10],
  "diagnostic-similar-q14-p01": ["problem", 1, 4],
  "diagnostic-similar-q14-p02": ["problem", 5, 8],
  "diagnostic-similar-q14-p03": ["problem", 9, 10],
  "diagnostic-similar-q14-p04": ["quick-answer", 1, 10],
  "diagnostic-similar-q14-p05": ["solution", 1, 10],
  "diagnostic-similar-q15-p01": ["problem", 1, 4],
  "diagnostic-similar-q15-p02": ["problem", 5, 8],
  "diagnostic-similar-q15-p03": ["problem", 9, 11],
  "diagnostic-similar-q15-p04": ["quick-answer", 1, 11],
  "diagnostic-similar-q15-p05": ["solution", 1, 8],
  "diagnostic-similar-q15-p06": ["solution", 9, 11],
  "diagnostic-similar-q16-p01": ["problem", 1, 4],
  "diagnostic-similar-q16-p02": ["problem", 5, 5],
  "diagnostic-similar-q16-p03": ["quick-answer", 1, 5],
  "diagnostic-similar-q16-p04": ["solution", 1, 5],
  "diagnostic-similar-q17-p01": ["problem", 1, 4],
  "diagnostic-similar-q17-p02": ["problem", 5, 6],
  "diagnostic-similar-q17-p03": ["quick-answer", 1, 6],
  "diagnostic-similar-q17-p04": ["solution", 1, 6],
  "diagnostic-similar-q18-p01": ["problem", 1, 4],
  "diagnostic-similar-q18-p02": ["problem", 5, 8],
  "diagnostic-similar-q18-p03": ["problem", 9, 10],
  "diagnostic-similar-q18-p04": ["quick-answer", 1, 10],
  "diagnostic-similar-q18-p05": ["solution", 1, 9],
  "diagnostic-similar-q18-p06": ["solution", 10, 10],
  "diagnostic-similar-q19-p01": ["problem", 1, 4],
  "diagnostic-similar-q19-p02": ["problem", 5, 7],
  "diagnostic-similar-q19-p03": ["quick-answer", 1, 7],
  "diagnostic-similar-q19-p04": ["solution", 1, 7],
  "diagnostic-similar-q20-p01": ["problem", 1, 4],
  "diagnostic-similar-q20-p02": ["problem", 5, 5],
  "diagnostic-similar-q20-p03": ["quick-answer", 1, 5],
  "diagnostic-similar-q20-p04": ["solution", 1, 5],
  "diagnostic-similar-q21-p01": ["problem", 1, 3],
  "diagnostic-similar-q21-p02": ["quick-answer", 1, 3],
  "diagnostic-similar-q21-p03": ["solution", 1, 3],
  "diagnostic-similar-q22-p01": ["problem", 1, 2],
  "diagnostic-similar-q22-p02": ["quick-answer", 1, 2],
  "diagnostic-similar-q22-p03": ["solution", 1, 2],
  "diagnostic-similar-q23-p01": ["problem", 1, 4],
  "diagnostic-similar-q23-p02": ["problem", 5, 8],
  "diagnostic-similar-q23-p03": ["problem", 9, 10],
  "diagnostic-similar-q23-p04": ["quick-answer", 1, 10],
  "diagnostic-similar-q23-p05": ["solution", 1, 7],
  "diagnostic-similar-q23-p06": ["solution", 8, 10],
  "diagnostic-similar-q24-p01": ["problem", 1, 4],
  "diagnostic-similar-q24-p02": ["problem", 5, 6],
  "diagnostic-similar-q24-p03": ["quick-answer", 1, 6],
  "diagnostic-similar-q24-p04": ["solution", 1, 5],
  "diagnostic-similar-q24-p05": ["solution", 6, 6],
  "diagnostic-similar-q25-p01": ["problem", 1, 4],
  "diagnostic-similar-q25-p02": ["blank", null, null],
  "diagnostic-similar-q25-p03": ["answer-solution", 1, 4],
  "diagnostic-similar-q25-p04": ["blank", null, null],
  "diagnostic-similar-q26-p01": ["problem", 1, 4],
  "diagnostic-similar-q26-p02": ["problem", 5, 5],
  "diagnostic-similar-q26-p03": ["quick-answer", 1, 5],
  "diagnostic-similar-q26-p04": ["solution", 1, 5],
  "diagnostic-similar-q27-p01": ["problem", 1, 4],
  "diagnostic-similar-q27-p02": ["blank", null, null],
  "diagnostic-similar-q27-p03": ["answer-solution", 1, 4],
  "diagnostic-similar-q27-p04": ["blank", null, null],
  "diagnostic-similar-q28-p01": ["problem", 1, 5],
  "diagnostic-similar-q28-p02": ["problem", 6, 11],
  "diagnostic-similar-q28-p03": ["problem", 12, 15],
  "diagnostic-similar-q28-p04": ["blank", null, null],
  "diagnostic-similar-q28-p05": ["answer-solution", 1, 15, { answer: [1, 15], solution: [1, 7] }],
  "diagnostic-similar-q28-p06": ["solution", 7, 15],
  "diagnostic-similar-q28-p07": ["solution", 15, 15],
  "diagnostic-similar-q28-p08": ["blank", null, null],
  "diagnostic-similar-q29-p01": ["problem", 1, 4],
  "diagnostic-similar-q29-p02": ["problem", 5, 7],
  "diagnostic-similar-q29-p03": ["quick-answer", 1, 7],
  "diagnostic-similar-q29-p04": ["solution", 1, 7],
  "diagnostic-similar-q30-p01": ["problem", 1, 4],
  "diagnostic-similar-q30-p02": ["problem", 5, 9],
  "diagnostic-similar-q30-p03": ["problem", 10, 13],
  "diagnostic-similar-q30-p04": ["blank", null, null],
  "diagnostic-similar-q30-p05": ["answer-solution", 1, 13, { answer: [1, 13], solution: [1, 6] }],
  "diagnostic-similar-q30-p06": ["solution", 6, 12],
  "diagnostic-similar-q30-p07": ["solution", 13, 13],
  "diagnostic-similar-q30-p08": ["blank", null, null],
  "diagnostic-similar-q31-p01": ["problem", 1, 2],
  "diagnostic-similar-q31-p02": ["quick-answer", 1, 2],
  "diagnostic-similar-q31-p03": ["solution", 1, 2],
  "diagnostic-similar-q32-p01": ["problem", 1, 4],
  "diagnostic-similar-q32-p02": ["problem", 5, 8],
  "diagnostic-similar-q32-p03": ["problem", 9, 12],
  "diagnostic-similar-q32-p04": ["problem", 13, 15],
  "diagnostic-similar-q32-p05": ["quick-answer", 1, 15],
  "diagnostic-similar-q32-p06": ["solution", 1, 7],
  "diagnostic-similar-q32-p07": ["solution", 8, 15],
  "diagnostic-similar-q33-p01": ["problem", 1, 6],
  "diagnostic-similar-q33-p02": ["problem", 7, 12],
  "diagnostic-similar-q33-p03": ["answer-solution", 1, 12, { answer: [1, 12], solution: [1, 10] }],
  "diagnostic-similar-q33-p04": ["solution", 10, 12],
  "diagnostic-similar-q34-p01": ["problem", 1, 4],
  "diagnostic-similar-q34-p02": ["problem", 5, 5],
  "diagnostic-similar-q34-p03": ["quick-answer", 1, 5],
  "diagnostic-similar-q34-p04": ["solution", 1, 5],
  "diagnostic-similar-q35-p01": ["problem", 1, 4],
  "diagnostic-similar-q35-p02": ["problem", 5, 5],
  "diagnostic-similar-q35-p03": ["quick-answer", 1, 5],
  "diagnostic-similar-q35-p04": ["solution", 1, 5],
  "diagnostic-similar-q36-p01": ["problem", 1, 4],
  "diagnostic-similar-q36-p02": ["problem", 5, 6],
  "diagnostic-similar-q36-p03": ["quick-answer", 1, 6],
  "diagnostic-similar-q36-p04": ["solution", 1, 6],
  "diagnostic-similar-q37-p01": ["problem", 1, 2],
  "diagnostic-similar-q37-p02": ["quick-answer", 1, 2],
  "diagnostic-similar-q37-p03": ["solution", 1, 2],
  "diagnostic-similar-q38-p01": ["problem", 1, 4],
  "diagnostic-similar-q38-p02": ["problem", 5, 6],
  "diagnostic-similar-q38-p03": ["quick-answer", 1, 6],
  "diagnostic-similar-q38-p04": ["solution", 1, 5],
  "diagnostic-similar-q38-p05": ["solution", 6, 6],
  "diagnostic-similar-q39-p01": ["problem", 1, 4],
  "diagnostic-similar-q39-p02": ["problem", 5, 7],
  "diagnostic-similar-q39-p03": ["quick-answer", 1, 7],
  "diagnostic-similar-q39-p04": ["solution", 1, 7],
  "diagnostic-similar-q40-p01": ["problem", 1, 4],
  "diagnostic-similar-q40-p02": ["problem", 5, 6],
  "diagnostic-similar-q40-p03": ["quick-answer", 1, 6],
  "diagnostic-similar-q40-p04": ["solution", 1, 6]
};

function check(condition, message) {
  if (!condition) issues.push(message);
}

function uniqueCount(values) {
  return new Set(values).size;
}

function loadDiagnosticData() {
  const source = fs.readFileSync(path.join(projectRoot, "hsmiddle", "data.js"), "utf8");
  const context = { window: {} };
  vm.runInNewContext(source, context, { filename: "hsmiddle/data.js" });
  return context.window.HSMIDDLE_DATA;
}

function loadCatalog(data) {
  const source = fs.readFileSync(path.join(bankRoot, "catalog.js"), "utf8");
  const context = { window: {
    HSMIDDLE_DATA: { questions: data.questions, similarPages: data.similarPages },
    HSMIDDLE_QUESTION_TYPE_REGISTRY: registry,
    HSMIDDLE_SOURCE_PAGE_INDEX: pageIndex,
    HSMIDDLE_QUESTION_ITEM_INDEX: { items: [] }
  } };
  vm.runInNewContext(source, context, { filename: "hsmiddle/question-bank/catalog.js" });
  return context.window.HSMIDDLE_BANK.createCatalog();
}

function verifyPublicText() {
  const files = [
    path.join(bankRoot, "data", "schema.js"),
    path.join(bankRoot, "data", "type-registry.js"),
    path.join(bankRoot, "data", "source-page-index.js"),
    path.join(bankRoot, "data", "source-page-fingerprints.json")
  ];
  const itemIndexFile = path.join(bankRoot, "data", "item-index.js");
  if (fs.existsSync(itemIndexFile)) files.push(itemIndexFile);
  const forbidden = /[A-Za-z]:[\/\\]|\/Users\/|studentCode|students *:/;
  files.forEach(function (file) {
    check(!forbidden.test(fs.readFileSync(file, "utf8")), `public text has protected data: ${path.basename(file)}`);
  });
}

function verifyPng(page) {
  const file = path.join(projectRoot, page.assetPath);
  check(fs.existsSync(file), `missing asset: ${page.assetPath}`);
  if (!fs.existsSync(file)) return;
  const bytes = fs.readFileSync(file);
  const isPng = bytes.length >= 24 && bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71;
  check(isPng, `not a PNG: ${page.assetPath}`);
  if (!isPng) return;
  check(bytes.readUInt32BE(16) === 1075 && bytes.readUInt32BE(20) === 1521, `wrong PNG size: ${page.assetPath}`);
}

const data = loadDiagnosticData();
const catalog = loadCatalog(data);
const questions = Array.isArray(data.questions) ? data.questions : [];
const pageCounts = Array.isArray(data.similarPages) ? data.similarPages : [];
const types = registry.types || [];
const pages = pageIndex.pages || [];

check(registry.schemaVersion === schema.SCHEMA_VERSION, "type registry schema mismatch");
check(pageIndex.schemaVersion === schema.SCHEMA_VERSION, "page index schema mismatch");
check(questions.length === 40, "diagnostic row count must be 40");
check(catalog.length === 40, "catalog row count must be 40");
check(types.length === 40, "type count must be 40");
check(pages.length === 191, "page count must be 191");
check(uniqueCount(types.map(function (type) { return type.typeId; })) === types.length, "duplicate type ID");
check(uniqueCount(types.map(function (type) { return type.diagnosticNumber; })) === types.length, "one representative type is required per diagnostic number");
check(uniqueCount(types.map(function (type) { return type.legacyTitle; })) === 39, "legacy titles should preserve the single q13/q17 duplicate");
check(uniqueCount(types.map(function (type) { return type.title; })) === 40, "normalized detail type names must be unique");
check(uniqueCount(pages.map(function (page) { return page.assetId; })) === pages.length, "duplicate asset ID");
check(uniqueCount(pages.map(function (page) { return page.assetPath; })) === pages.length, "duplicate asset path");

for (let number = 1; number <= 40; number += 1) {
  const question = questions[number - 1];
  const catalogItem = catalog[number - 1];
  const type = types.find(function (entry) { return entry.diagnosticNumber === number; });
  const typePages = pages.filter(function (entry) { return entry.diagnosticNumber === number; });
  const folder = `q${String(number).padStart(2, "0")}`;

  check(Array.isArray(question) && Number(question[0]) === number, `missing diagnostic row: q${String(number).padStart(2, "0")}`);
  check(catalogItem && catalogItem.number === number, `missing catalog row: q${String(number).padStart(2, "0")}`);
  check(Boolean(type), `missing type: q${String(number).padStart(2, "0")}`);
  if (type && question && catalogItem) {
    check(type.typeId === `diagnostic-similar-q${String(number).padStart(2, "0")}`, `wrong type ID: q${String(number).padStart(2, "0")}`);
    check(type.sourceExamId === "diagnostic-similar", `wrong source exam: q${String(number).padStart(2, "0")}`);
    check(type.legacyTitle === question[5], `wrong legacy type title: q${String(number).padStart(2, "0")}`);
    check(typeof type.title === "string" && type.title.length > 0, `missing detail type title: q${String(number).padStart(2, "0")}`);
    check(type.semester === question[3] && type.area === question[4] && type.difficulty === question[2], `wrong diagnostic mapping: q${String(number).padStart(2, "0")}`);
    check(type.unit === catalogItem.unit, `wrong catalog unit: q${String(number).padStart(2, "0")}`);
    check(schema.RESPONSE_CONTRACTS.includes(type.defaultResponseContract), `wrong default response contract: q${String(number).padStart(2, "0")}`);
    check(type.responseContractScope === "item", `response contract must be item-scoped: q${String(number).padStart(2, "0")}`);
    check(type.representative === true, `representative flag missing: q${String(number).padStart(2, "0")}`);
    check(schema.WORK_STATUSES.includes(type.workStatus), `wrong work status: q${String(number).padStart(2, "0")}`);
    check(schema.EVIDENCE_STATUSES.includes(type.evidenceStatus), `wrong evidence status: q${String(number).padStart(2, "0")}`);
    check(schema.RELEASE_STATUSES.includes(type.releaseStatus), `wrong release status: q${String(number).padStart(2, "0")}`);
    check(type.workStatus === (pilotNumbers.has(number) ? "complete" : "pending"), `wrong type progress: q${String(number).padStart(2, "0")}`);
    check(type.sourceReviewStatus === (pilotNumbers.has(number) ? "verified" : "draft"), `wrong source review state: q${String(number).padStart(2, "0")}`);
    check(type.evidenceStatus === (evidenceConflictNumbers.has(number) ? "conflict" : eligibleNumbers.has(number) ? "verified" : "draft"), `wrong type evidence gate: q${String(number).padStart(2, "0")}`);
    check(type.releaseStatus === (eligibleNumbers.has(number) ? "eligible" : "locked"), `wrong type release gate: q${String(number).padStart(2, "0")}`);
    check(type.sourceBundleStatus === (sourceBundleConflictNumbers.has(number) ? "conflict" : pilotNumbers.has(number) ? "verified" : "draft"), `wrong source bundle state: q${String(number).padStart(2, "0")}`);
    check(type.releaseNote === (releaseNotes.get(number) || null), `wrong release note: q${String(number).padStart(2, "0")}`);
  }

  const expectedPages = Number(pageCounts[number - 1]);
  check(typePages.length === expectedPages, `wrong page count: ${folder}`);
  check(uniqueCount(typePages.map(function (page) { return page.pageNumber; })) === expectedPages, `duplicate page number: ${folder}`);
  for (let pageNumber = 1; pageNumber <= expectedPages; pageNumber += 1) {
    const page = typePages.find(function (entry) { return entry.pageNumber === pageNumber; });
    const expectedPath = `hsmiddle/assets/similar/${folder}/page-${pageNumber}.png`;
    check(Boolean(page), `missing index page: ${expectedPath}`);
    if (!page) continue;
    check(page.assetId === `diagnostic-similar-${folder}-p${String(pageNumber).padStart(2, "0")}`, `wrong asset ID: ${expectedPath}`);
    check(page.sourceExamId === "diagnostic-similar" && page.assetPath === expectedPath, `wrong page path: ${expectedPath}`);
    check(schema.PAGE_ROLES.includes(page.role), `wrong page role: ${expectedPath}`);
    check(schema.WORK_STATUSES.includes(page.workStatus), `wrong page work state: ${expectedPath}`);
    check(schema.EVIDENCE_STATUSES.includes(page.evidenceStatus), `wrong page evidence state: ${expectedPath}`);
    check(schema.RELEASE_STATUSES.includes(page.releaseStatus), `wrong page release state: ${expectedPath}`);
    const reviewed = expectedReviewedPages[page.assetId];
    if (reviewed) {
      check(page.role === reviewed[0], `wrong reviewed page role: ${expectedPath}`);
      if (reviewed[0] === "blank") {
        check(page.itemRange === null, `blank source page must not claim an item range: ${expectedPath}`);
      } else {
        check(page.itemRange && page.itemRange.from === reviewed[1] && page.itemRange.to === reviewed[2], `wrong reviewed item range: ${expectedPath}`);
        if (reviewed[3]) {
          check(page.answerItemRange && page.answerItemRange.from === reviewed[3].answer[0] && page.answerItemRange.to === reviewed[3].answer[1], `wrong reviewed answer range: ${expectedPath}`);
          check(page.solutionItemRange && page.solutionItemRange.from === reviewed[3].solution[0] && page.solutionItemRange.to === reviewed[3].solution[1], `wrong reviewed solution range: ${expectedPath}`);
        }
      }
      check(page.workStatus === "complete" && page.evidenceStatus === "verified", `wrong reviewed page state: ${expectedPath}`);
      check(page.releaseStatus === (eligibleNumbers.has(number) && reviewed[0] !== "blank" ? "eligible" : "locked"), `wrong reviewed page release gate: ${expectedPath}`);
    } else {
      check(page.role === "unreviewed" && page.itemRange === null, `unreviewed page has inferred content: ${expectedPath}`);
      check(page.workStatus === "pending" && page.evidenceStatus === "draft" && page.releaseStatus === "locked", `wrong pending page state: ${expectedPath}`);
    }
    verifyPng(page);
  }
}

const type13 = types.find(function (type) { return type.diagnosticNumber === 13; });
const type17 = types.find(function (type) { return type.diagnosticNumber === 17; });
check(type13 && type17 && type13.typeId !== type17.typeId, "q13 and q17 must be separate detail types");
check(type13 && type17 && type13.title !== type17.title, "q13 and q17 need different Korean detail names");
check(type13 && type17 && type13.conceptFamilyId === type17.conceptFamilyId, "q13 and q17 must retain the shared multiples concept");
const type7 = types.find(function (type) { return type.diagnosticNumber === 7; });
const type27 = types.find(function (type) { return type.diagnosticNumber === 27; });
check(type7 && type27 && type7.typeId !== type27.typeId, "q07 and q27 must retain separate source type IDs");
check(type7 && type27 && type7.conceptFamilyId === "fractional-clock-drift" && type27.conceptFamilyId === type7.conceptFamilyId, "q07 and q27 must share the clock-drift concept family");

verifyPublicText();

if (issues.length) {
  console.error(`FAIL question-bank structure audit (${issues.length})`);
  issues.forEach(function (issue) { console.error(`- ${issue}`); });
  process.exit(1);
}

console.log("PASS question-bank structure audit: type=40 page=191 reviewedPage=191 eligiblePage=183 lockedReviewedPage=8 pendingPage=0 folder=q01-q40 png=1075x1521 blankPages=q25:2,q27:2,q28:2,q30:2 q06=learner-fit-verified q25=unit-correction-resolved q39=solution-cycle-correction-resolved sourceBundleConflict=0");
