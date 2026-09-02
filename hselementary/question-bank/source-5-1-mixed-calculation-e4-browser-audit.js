"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { chromium } = require("playwright");

global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const inventory = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "5-1-unit-1-mixed-calculation.json"), "utf8"));
const unit = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-1")?.units.find(item => item.id === "5-1-u1");
const allTypes = unit ? unit.subunits.flatMap(item => item.types) : [];
const e4 = allTypes.filter(type => type.sourceItemId.startsWith("5-1-u1-e4-"));
const byId = new Map(inventory.items.map(item => [item.sourceItemId, item]));
const baseUrl = process.env.HSE_URL || "http://127.0.0.1:8891/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(os.tmpdir(), "lete-on-hse-5-1-mixed-calculation-e4-browser-audit");
const failures = [];
let screenshots = 0;
let pdfs = 0;
const fail = message => failures.push(message);
const slug = value => String(value).replaceAll(/[^\p{L}\p{N}_-]+/gu, "_");
const overlaps = (a, b) => Boolean(a && b && a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1);

function auditInventory() {
  const ready = allTypes.filter(type => byId.get(type.sourceItemId)?.implementationStatus === "ready");
  const locked = allTypes.filter(type => byId.get(type.sourceItemId)?.implementationStatus === "review-locked");
  if (!unit || allTypes.length !== 45 || inventory.items.length !== 45 || ready.length !== 44 || locked.length !== 1) fail("5-1 1단원 45유형·공개 44·잠금 1 구조가 아닙니다.");
  if (e4.length !== 12) fail(`개념탐구 4가 12유형이 아닙니다: ${e4.length}`);
  for (const type of e4) {
    const source = byId.get(type.sourceItemId);
    if (!source || source.implementationStatus !== "ready" || type.reviewLocked || api.generatorKey(type) !== "mixedCalculationE4" || !inventory.resultContracts[type.sourceItemId]) fail(`${type.id}: E4 원문·생성기·답 형식 연결이 다릅니다.`);
  }
}

function listen(page, label) {
  page.on("pageerror", error => fail(`${label}: 브라우저 오류 ${error.message}`));
  page.on("console", message => {
    if (message.type() === "error" && !/ERR_NETWORK_ACCESS_DENIED|Failed to load resource/.test(message.text())) fail(`${label}: 콘솔 오류 ${message.text()}`);
  });
}

async function inspectCatalog(browser, viewport, label) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  listen(page, label);
  await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 90000 });
  await page.click('#gradeFilter [data-grade="5"]');
  await page.click('#termFilter [data-term="1"]');
  await page.selectOption("#unitFilter", "5-1-u1");
  if (await page.locator("[data-preview-type-id]").count() !== 45) fail(`${label}: 목록의 45유형이 보이지 않습니다.`);
  for (const type of allTypes) {
    const row = page.locator(`[data-preview-type-id="${type.id}"]`);
    await row.scrollIntoViewIfNeeded();
    await row.click();
    const preview = page.locator("#typePreviewPopover:not([hidden])");
    await preview.waitFor({ state: "visible" });
    const state = await page.evaluate(({ id, mobile }) => {
      const rect = selector => {
        const box = document.querySelector(selector)?.getBoundingClientRect();
        return box && { left: box.left, right: box.right, top: box.top, bottom: box.bottom };
      };
      return {
        preview: rect("#typePreviewPopover:not([hidden])"), row: rect(`[data-preview-type-id="${id}"]`), tree: rect(".tree-pane"),
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        inView: (() => { const box = rect("#typePreviewPopover:not([hidden])"); return Boolean(box && box.left >= -1 && box.right <= innerWidth + 1 && box.top >= -1); })(),
        below: !mobile || (() => { const box = rect("#typePreviewPopover:not([hidden])"); const source = rect(`[data-preview-type-id="${id}"]`); return Boolean(box && source && box.top >= source.bottom - 1); })(),
        text: document.querySelector("#typePreviewPopover:not([hidden])")?.innerText || ""
      };
    }, { id: type.id, mobile: viewport.width <= 700 });
    const source = byId.get(type.sourceItemId);
    if (state.overflow || !state.inView || !state.below || overlaps(state.row, state.preview) || (viewport.width > 700 && overlaps(state.tree, state.preview)) || !state.text.includes(type.label) || !state.text.includes(`교재 ${source.sourcePrintedPage}쪽`)) fail(`${label} ${type.id}: 목록 미리보기가 가리거나 내용이 빠졌습니다.`);
    await page.locator("[data-close-type-preview]").click();
  }
  await page.screenshot({ path: path.join(outputDir, `catalog-${label}.png`), fullPage: true });
  screenshots += 1;
  await page.close();
}

async function inspectReview(browser, type, viewport, label, difficulty) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  const difficultyLabel = ({ "-1": "easy", "0": "standard", "1": "hard" })[String(difficulty)];
  const auditLabel = `${label}-${difficultyLabel}`;
  listen(page, `${auditLabel} ${type.id}`);
  await page.goto(`${baseUrl}?type=${encodeURIComponent(type.id)}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
  const inspect = async selector => page.evaluate(view => {
    const nodes = [...document.querySelectorAll(view)];
    const measured = [...document.querySelectorAll(`${view} .equation, ${view} .number-card`)].map(node => {
      const box = node.getBoundingClientRect();
      return { width: box.width, height: box.height, left: box.left, right: box.right, font: Number.parseFloat(getComputedStyle(node).fontSize) };
    });
    const headers = [...document.querySelectorAll(`${view} header span, ${view} header strong`)].map(node => {
      const box = node.getBoundingClientRect();
      return { width: box.width, height: box.height, text: node.textContent || "" };
    });
    return { count: nodes.length, empty: nodes.some(node => !(node.textContent || "").trim()), bad: /\b(?:undefined|null|NaN|Infinity)\b/.test(document.body.innerText || ""), overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1 || nodes.some(node => node.scrollWidth > node.clientWidth + 1), measured, headers };
  }, selector);
  const validate = (state, stage) => {
    if (state.count !== 3 || state.empty || state.bad || state.overflow) fail(`${auditLabel} ${type.id}: ${stage} 3문항·표기·가로 폭 검사가 실패했습니다.`);
    if (state.measured.some(item => item.width < 2 || item.height < 2 || item.left < -1 || item.right > viewport.width + 1 || item.font < 12)) fail(`${auditLabel} ${type.id}: ${stage} 식 또는 카드 글자가 잘리거나 작습니다.`);
    if (state.headers.some(item => item.text.includes("<br>") || item.width < 80 || item.height > item.width * 2.5)) fail(`${auditLabel} ${type.id}: ${stage} 머리글이 세로로 눌리거나 줄바꿈 문자가 그대로 보입니다.`);
  };
  validate(await inspect("#problemView .question-item"), "문제");
  await page.screenshot({ path: path.join(outputDir, `${slug(type.sourceItemId)}-${auditLabel}-problem.png`), fullPage: true }); screenshots += 1;
  if (label === "desktop") {
    await page.emulateMedia({ media: "print" });
    validate(await inspect("#problemView .question-item"), "A4 문제");
    const file = path.join(outputDir, `${slug(type.sourceItemId)}-${difficultyLabel}-a4-problem.pdf`);
    await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (fs.statSync(file).size < 5000) fail(`A4 ${type.id}: 문제 PDF가 비어 있습니다.`);
    pdfs += 1;
    await page.emulateMedia({ media: "screen" });
  }
  await page.click("#solutionTab");
  validate(await inspect("#solutionView .solution-item"), "풀이");
  await page.screenshot({ path: path.join(outputDir, `${slug(type.sourceItemId)}-${auditLabel}-solution.png`), fullPage: true }); screenshots += 1;
  if (label === "desktop") {
    await page.emulateMedia({ media: "print" });
    validate(await inspect("#solutionView .solution-item"), "A4 풀이");
    const file = path.join(outputDir, `${slug(type.sourceItemId)}-${difficultyLabel}-a4-solution.pdf`);
    await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (fs.statSync(file).size < 5000) fail(`A4 ${type.id}: 풀이 PDF가 비어 있습니다.`);
    pdfs += 1;
  }
  await page.close();
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  auditInventory();
  if (failures.length) throw new Error(failures.join("\n"));
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  await inspectCatalog(browser, { width: 1280, height: 900 }, "desktop");
  await inspectCatalog(browser, { width: 390, height: 844 }, "mobile");
  for (const difficulty of [-1, 0, 1]) for (const type of e4) {
    await inspectReview(browser, type, { width: 1280, height: 900 }, "desktop", difficulty);
    await inspectReview(browser, type, { width: 390, height: 844 }, "mobile", difficulty);
  }
  await browser.close();
  if (failures.length) throw new Error(failures.join("\n"));
  console.log(`5-1 자연수의 혼합 계산 개념탐구 4 브라우저·인쇄 감사 통과: 전체 45 · 공개 44/잠금 1 · E4 공개 12 · PC/모바일 ${screenshots}장 · A4 ${pdfs}개`);
})().catch(error => { console.error(`5-1 자연수의 혼합 계산 개념탐구 4 브라우저·인쇄 감사 실패: ${error.stack || error}`); process.exit(1); });
