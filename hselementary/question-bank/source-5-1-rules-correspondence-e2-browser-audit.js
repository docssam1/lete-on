"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { chromium } = require("playwright");
global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const unit = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-1")?.units.find(item => item.id === "5-1-u3");
const types = unit?.subunits.flatMap(item => item.types) || [];
const e2 = types.filter(type => type.sourceItemId?.startsWith("5-1-u3-e2-"));
const ready = e2.filter(type => !type.reviewLocked);
const locked = e2.filter(type => type.reviewLocked);
const baseUrl = process.env.HSE_URL || "http://127.0.0.1:8878/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(os.tmpdir(), "lete-on-hse-5-1-rules-correspondence-e2-browser-audit");
const failures = [];
let screenshots = 0;
let pdfs = 0;
const fail = message => failures.push(message);
const broken = state => state.empty || state.overflow || /undefined|null|NaN|Infinity|\$\{/.test(state.text);

async function inspectCatalog(browser, viewport, label) {
  const page = await browser.newPage({ viewport });
  page.on("pageerror", error => fail(`${label}: ${error.message}`));
  await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 90000 });
  await page.click('#gradeFilter [data-grade="5"]');
  await page.click('#termFilter [data-term="1"]');
  await page.selectOption("#unitFilter", "5-1-u3");
  if (await page.locator("[data-preview-type-id]").count() !== 41) fail(`${label}: 규칙과 대응 41개 유형이 보이지 않습니다.`);
  for (const type of types) {
    const row = page.locator(`[data-preview-type-id="${type.id}"]`);
    await row.scrollIntoViewIfNeeded();
    await row.click();
    const popover = page.locator("#typePreviewPopover:not([hidden])");
    await popover.waitFor({ state: "visible" });
    const state = await page.evaluate(id => {
      const pop = document.querySelector("#typePreviewPopover:not([hidden])")?.getBoundingClientRect();
      const rowRect = document.querySelector(`[data-preview-type-id="${id}"]`)?.getBoundingClientRect();
      return {
        text: document.querySelector("#typePreviewPopover:not([hidden])")?.innerText || "",
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        coversRow: Boolean(pop && rowRect && pop.top < rowRect.bottom && pop.bottom > rowRect.top && pop.left < rowRect.right && pop.right > rowRect.left)
      };
    }, type.id);
    if (state.overflow || state.coversRow || !state.text.includes(type.label)) fail(`${label} ${type.sourceItemId}: 미리보기가 목록을 가리거나 내용이 없습니다.`);
    if (type.reviewLocked ? !state.text.includes("검수 대기") : !state.text.includes("대표 문제")) fail(`${label} ${type.sourceItemId}: 공개·잠금 미리보기 표시가 다릅니다.`);
    await page.locator("[data-close-type-preview]").click();
  }
  await page.screenshot({ path: path.join(outputDir, `catalog-${label}.png`), fullPage: true });
  screenshots += 1;
  await page.close();
}

async function inspectView(page, selector) {
  return page.evaluate(selected => {
    const nodes = [...document.querySelectorAll(selected)];
    return {
      text: document.body.innerText,
      empty: nodes.length === 0 || nodes.some(node => !node.innerText.trim()),
      overflow: document.documentElement.scrollWidth > innerWidth + 1 || nodes.some(node => node.scrollWidth > node.clientWidth + 1)
    };
  }, selector);
}

async function inspectType(browser, type, viewport, viewportLabel, difficulty) {
  const page = await browser.newPage({ viewport });
  const key = `${type.sourceItemId}-${viewportLabel}-${difficulty}`;
  page.on("pageerror", error => fail(`${key}: ${error.message}`));
  await page.goto(`${baseUrl}?type=${type.id}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
  let state = await inspectView(page, "#problemView .question-item");
  if (broken(state)) fail(`${key}: 문제 화면이 비었거나 넘칩니다.`);
  await page.screenshot({ path: path.join(outputDir, `${key}-problem.png`), fullPage: true });
  screenshots += 1;
  if (viewportLabel === "desktop") {
    await page.emulateMedia({ media: "print" });
    const file = path.join(outputDir, `${key}-problem.pdf`);
    await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (fs.statSync(file).size < 5000) fail(`${key}: A4 문제 PDF가 비었습니다.`);
    pdfs += 1;
    await page.emulateMedia({ media: "screen" });
  }
  await page.click("#solutionTab");
  state = await inspectView(page, "#solutionView .solution-item");
  if (broken(state)) fail(`${key}: 풀이 화면이 비었거나 넘칩니다.`);
  await page.screenshot({ path: path.join(outputDir, `${key}-solution.png`), fullPage: true });
  screenshots += 1;
  if (viewportLabel === "desktop") {
    await page.emulateMedia({ media: "print" });
    const file = path.join(outputDir, `${key}-solution.pdf`);
    await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (fs.statSync(file).size < 5000) fail(`${key}: A4 풀이 PDF가 비었습니다.`);
    pdfs += 1;
  }
  await page.close();
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  if (types.length !== 41 || e2.length !== 10 || ready.length !== 8 || locked.length !== 2) fail(`E2 구성은 전체 41·공개 8·잠금 2여야 합니다: ${types.length}/${ready.length}/${locked.length}`);
  for (const type of ready) if (api.generatorKey(type) !== "correspondenceE2") fail(`${type.sourceItemId}: 공개 생성기 연결이 다릅니다.`);
  for (const type of locked) if (api.generatorKey(type)) fail(`${type.sourceItemId}: 잠금 유형에 생성기가 연결되어 있습니다.`);
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  await inspectCatalog(browser, { width: 1280, height: 900 }, "desktop");
  await inspectCatalog(browser, { width: 390, height: 844 }, "mobile");
  for (const difficulty of [-1, 0, 1]) for (const type of ready) {
    await inspectType(browser, type, { width: 1280, height: 900 }, "desktop", difficulty);
    await inspectType(browser, type, { width: 390, height: 844 }, "mobile", difficulty);
  }
  await browser.close();
  if (screenshots !== 98 || pdfs !== 48) fail(`검수 산출물 수가 다릅니다: 화면 ${screenshots}, A4 ${pdfs}`);
  if (failures.length) throw new Error(failures.join("\n"));
  console.log(`5-1 규칙과 대응 개념탐구 2 브라우저 감사 통과: 공개 8/잠금 2 · PC·모바일 ${screenshots}화면 · A4 ${pdfs}파일`);
})().catch(error => {
  console.error(`5-1 규칙과 대응 개념탐구 2 브라우저 감사 실패: ${error.stack || error}`);
  process.exit(1);
});
