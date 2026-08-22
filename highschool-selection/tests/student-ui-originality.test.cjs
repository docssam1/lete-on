"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const read = relative => fs.readFileSync(path.join(root, relative), "utf8");

test("student operational pages use neutral program identity", () => {
  const operational = [
    "login.html",
    "library.html",
    "exam.html",
    "report.html",
    "shared/auth.js",
    "shared/exam-page.js",
    "shared/report-page.js"
  ].map(read).join("\n");
  ["생각하는황소", "돌파수학", "원수학", "이든수학", "깊은생각", "생수수학"].forEach(name => {
    assert.doesNotMatch(operational, new RegExp(name));
  });
  assert.match(read("library.html"), /program\.shortName/);
});

test("promotion names evidence sources while operations remain separate", () => {
  const promotion = read("promo/index.html");
  assert.match(promotion, /검색 결과와 원본으로 확인한 시험 유형/);
  assert.match(promotion, /근거 표기/);
  assert.match(promotion, /public-exam-profiles\.js/);
});

test("diagnostic hierarchy exposes every required student axis", () => {
  const page = read("shared/report-page.js");
  [
    "총점과 문항별 결과",
    "문항별 ○/×",
    "영역별 수행률",
    "학년·학기별 수행률",
    "단원별 수행률",
    "세부 유형별 수행률",
    "난이도별 수행률",
    "취약 유형 우선순위",
    "지금 먼저 보완할 내용"
  ].forEach(label => assert.match(page, new RegExp(label)));
  assert.match(page, /item-dot[\s\S]*<small>\$\{item\.number\}<\/small>/);
});

test("viewer preserves the protected original page image", () => {
  const css = read("shared/app.css");
  const viewer = read("shared/exam-page.js");
  assert.match(css, /\.paper-page img \{ width: 100%; height: auto; display: block; \}/);
  assert.doesNotMatch(css, /\.paper-page img[^}]*filter\s*:/);
  assert.match(viewer, /validateManifest/);
  assert.match(viewer, /referrerPolicy = "no-referrer"/);
  assert.doesNotMatch(viewer, /\.pdf(?:\?|"|'|`)/i);
});

test("print report keeps the overview readable before detail pages", () => {
  const css = read("shared/app.css");
  assert.match(css, /@media print/);
  assert.match(css, /\.axis-grid \{ grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.report-comments \{ break-before: page; \}/);
  assert.match(css, /\.prescription-panel \{ break-before: page; \}/);
  assert.match(css, /\.item-detail \{ break-before: page; \}/);
});

test("diagnostic report is readable on a phone without shrinking result tables", () => {
  const css = read("shared/app.css");
  assert.match(css, /@media \(max-width: 620px\)/);
  assert.match(css, /\.overview-score \{ grid-template-columns: 1fr; \}/);
  assert.match(css, /\.axis-grid, \.priority-list \{ grid-template-columns: 1fr; \}/);
  assert.match(css, /\.table-scroll \{ overflow-x: auto; -webkit-overflow-scrolling: touch; \}/);
  assert.match(css, /\.data-table \{ min-width: 620px; \}/);
});
