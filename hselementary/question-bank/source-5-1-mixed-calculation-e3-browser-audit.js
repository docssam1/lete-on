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
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-1");
const unit = semester?.units.find(item => item.id === "5-1-u1");
const baseUrl = process.env.HSE_URL || "http://127.0.0.1:8891/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(os.tmpdir(), "lete-on-hse-5-1-mixed-calculation-e3-browser-audit");
const failures = [];
let screenshots = 0;
let pdfs = 0;
const byId = new Map(inventory.items.map(item => [item.sourceItemId, item]));
const types = unit ? unit.subunits.flatMap(subunit => subunit.types) : [];
const ready = types.filter(type => byId.get(type.sourceItemId)?.implementationStatus === "ready");
const locked = types.filter(type => byId.get(type.sourceItemId)?.implementationStatus === "review-locked");
const e3 = ready.filter(type => byId.get(type.sourceItemId)?.exploration === 3);
const fail = message => failures.push(message);
const slug = value => String(value).replaceAll(/[^\p{L}\p{N}_-]+/gu, "_");
const overlap = (a, b) => Boolean(a && b && a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1);

function auditInventory() {
  if (!unit || types.length !== 44 || inventory.items.length !== 44) fail("원문·교육과정 유형은 각각 44개여야 합니다.");
  if (ready.length !== 32 || locked.length !== 12 || e3.length !== 11) fail(`공개 32·잠금 12·개념탐구 3 공개 11유형이 아닙니다: ${ready.length}, ${locked.length}, ${e3.length}`);
  for (const type of types) {
    const source = byId.get(type.sourceItemId);
    if (!source || type.label !== source.typeLabel || type.name !== source.typeLabel || type.reviewLocked !== (source.implementationStatus === "review-locked")) fail(`${type.id}: 원문 분류표 연결 또는 잠금 상태가 다릅니다.`);
    if (source?.exploration === 3 && (!api.generatorKey(type) || api.generatorKey(type) !== "mixedCalculationE3" || type.reviewLocked)) fail(`${type.id}: 개념탐구 3 생성기 연결이 다릅니다.`);
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
  if (await page.locator("[data-preview-type-id]").count() !== 44) fail(`${label}: 목록 44유형이 보이지 않습니다.`);
  for (const type of types) {
    const row = page.locator(`[data-preview-type-id="${type.id}"]`);
    await row.scrollIntoViewIfNeeded();
    await row.click();
    const popover = page.locator("#typePreviewPopover:not([hidden])");
    await popover.waitFor({ state: "visible" });
    const state = await page.evaluate(({ id, mobile }) => {
      const rect = selector => { const node = document.querySelector(selector); const box = node?.getBoundingClientRect(); return box && { left: box.left, right: box.right, top: box.top, bottom: box.bottom }; };
      const popover = rect("#typePreviewPopover:not([hidden])");
      const row = rect(`[data-preview-type-id="${id}"]`);
      return { popover, row, tree: rect(".tree-pane"), expanded: document.querySelector(`[data-preview-type-id="${id}"]`)?.getAttribute("aria-expanded") === "true", overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1, inViewport: Boolean(popover && popover.left >= -1 && popover.right <= innerWidth + 1 && popover.top >= -1), below: !mobile || Boolean(popover && row && popover.top >= row.bottom - 1), text: document.querySelector("#typePreviewPopover:not([hidden])")?.innerText || "", question: Boolean(document.querySelector("#typePreviewPopover:not([hidden]) .type-preview-question")) };
    }, { id: type.id, mobile: viewport.width <= 700 });
    const source = byId.get(type.sourceItemId);
    if (!state.expanded || state.overflow || !state.inViewport || overlap(state.row, state.popover) || (! (viewport.width <= 700) && overlap(state.tree, state.popover)) || !state.below) fail(`${label} ${type.id}: 목록 미리보기가 비가림 또는 가로 넘침 상태입니다.`);
    if (!state.text.includes(type.label) || !state.text.includes(`교재 ${source.sourcePrintedPage}쪽`) || (source.implementationStatus === "ready" && !state.question)) fail(`${label} ${type.id}: 미리보기 내용이 불완전합니다.`);
    await page.locator("[data-close-type-preview]").click();
  }
  await page.screenshot({ path: path.join(outputDir, `catalog-${label}.png`), fullPage: true });
  screenshots += 1;
  await page.close();
}

async function inspectReview(browser, type, viewport, label) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  listen(page, `${label} ${type.id}`);
  await page.goto(`${baseUrl}?type=${encodeURIComponent(type.id)}&review=1`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
  const inspect = selector => page.evaluate(view => {
    const nodes = [...document.querySelectorAll(view)];
    return { count: nodes.length, empty: nodes.some(node => !(node.textContent || "").trim()), bad: /\b(?:undefined|null|NaN|Infinity)\b/.test(document.body.innerText || ""), overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1 || nodes.some(node => node.scrollWidth > node.clientWidth + 1) };
  }, selector);
  const problem = await inspect("#problemView .question-item");
  if (problem.count !== 3 || problem.empty || problem.bad || problem.overflow) fail(`${label} ${type.id}: 문제 3문항·표기·가로 폭 검사가 실패했습니다.`);
  if (type.variant === 6) {
    const model = await page.evaluate(() => {
      const svg = document.querySelector(".mixed-e3-rectangle-square");
      const text = [...(svg?.querySelectorAll("text") || [])].map(node => {
        const box = node.getBBox();
        return { text: node.textContent, box: { x: box.x, y: box.y, width: box.width, height: box.height }, fontSize: Number.parseFloat(getComputedStyle(node).fontSize) };
      });
      return { exists: Boolean(svg), rows: svg?.getAttribute("data-rows"), cols: svg?.getAttribute("data-cols"), long: Number(svg?.getAttribute("data-small-long")), short: Number(svg?.getAttribute("data-small-short")), perimeter: Number(svg?.getAttribute("data-small-perimeter")), side: Number(svg?.getAttribute("data-big-side")), dashed: svg?.querySelectorAll('line[stroke-dasharray]').length || 0, rects: svg?.querySelectorAll("rect").length || 0, aria: svg?.getAttribute("aria-label") || "", text, viewBox: svg?.viewBox.baseVal ? { width: svg.viewBox.baseVal.width, height: svg.viewBox.baseVal.height } : null };
    });
    const readable = model.text.every(item => item.fontSize >= 14 && item.box.width > 2 && item.box.height > 2 && item.box.x >= -1 && item.box.y >= -1 && item.box.x + item.box.width <= (model.viewBox?.width || 0) + 1 && item.box.y + item.box.height <= (model.viewBox?.height || 0) + 1);
    if (!(model.exists && model.rows === "4" && model.cols === "2" && model.long === model.short * 2 && model.perimeter === 2 * (model.long + model.short) && model.side === model.long * 2 && model.side === model.short * 4 && model.dashed === 4 && model.rects === 1 && /2열 4행/.test(model.aria) && readable)) fail(`${label} ${type.id}: Mission 2 SVG의 글자·점선·실선·2×4 데이터 모델 검사가 실패했습니다. ${JSON.stringify(model)}`);
  }
  await page.screenshot({ path: path.join(outputDir, `${slug(type.sourceItemId)}-${label}-problem.png`), fullPage: true });
  screenshots += 1;
  if (label === "desktop") {
    await page.emulateMedia({ media: "print" });
    if ((await inspect("#problemView .question-item")).overflow) fail(`A4 ${type.id}: 문제 또는 SVG가 인쇄 폭을 벗어납니다.`);
    const output = path.join(outputDir, `${slug(type.sourceItemId)}-a4-problem.pdf`);
    await page.pdf({ path: output, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (fs.statSync(output).size < 5000) fail(`A4 ${type.id}: 문제 PDF가 비어 있을 수 있습니다.`);
    pdfs += 1;
    await page.emulateMedia({ media: "screen" });
  }
  await page.click("#solutionTab");
  const solution = await inspect("#solutionView .solution-item");
  if (solution.count !== 3 || solution.empty || solution.bad || solution.overflow) fail(`${label} ${type.id}: 풀이 3문항·표기·가로 폭 검사가 실패했습니다.`);
  await page.screenshot({ path: path.join(outputDir, `${slug(type.sourceItemId)}-${label}-solution.png`), fullPage: true });
  screenshots += 1;
  if (label === "desktop") {
    await page.emulateMedia({ media: "print" });
    if ((await inspect("#solutionView .solution-item")).overflow) fail(`A4 ${type.id}: 풀이가 인쇄 폭을 벗어납니다.`);
    const output = path.join(outputDir, `${slug(type.sourceItemId)}-a4-solution.pdf`);
    await page.pdf({ path: output, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (fs.statSync(output).size < 5000) fail(`A4 ${type.id}: 풀이 PDF가 비어 있을 수 있습니다.`);
    pdfs += 1;
  }
  await page.close();
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  auditInventory();
  if (failures.length) throw new Error(failures.join("\n"));
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  await inspectCatalog(browser, { width: 1440, height: 900 }, "desktop");
  await inspectCatalog(browser, { width: 390, height: 844 }, "mobile");
  for (const type of e3) {
    await inspectReview(browser, type, { width: 1280, height: 900 }, "desktop");
    await inspectReview(browser, type, { width: 390, height: 844 }, "mobile");
  }
  await browser.close();
  if (failures.length) throw new Error(failures.join("\n"));
  console.log(`5-1 자연수의 혼합 계산 개념탐구 3 브라우저·인쇄 감사 통과: 전체 44 · 공개 32/잠금 12 · E3 공개 11 · PC/모바일 ${screenshots}장 · A4 ${pdfs}개`);
})().catch(error => {
  console.error(`5-1 자연수의 혼합 계산 개념탐구 3 브라우저·인쇄 감사 실패: ${error.stack || error}`);
  process.exit(1);
});
