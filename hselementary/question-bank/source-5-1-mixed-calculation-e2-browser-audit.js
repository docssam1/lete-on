"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { chromium } = require("playwright");

global.window = {};
require("./source-inventory-4-1.js");
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const inventory = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "5-1-unit-1-mixed-calculation.json"), "utf8"));
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-1");
const unit = semester?.units.find(item => item.id === "5-1-u1");
const baseUrl = process.env.HSE_URL || "http://127.0.0.1:8891/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(os.tmpdir(), "lete-on-hse-5-1-mixed-calculation-e2-browser-audit");
const failures = [];
let screenshotCount = 0;
let pdfCount = 0;
const inventoryById = new Map(inventory.items.map(item => [item.sourceItemId, item]));
const types = unit ? unit.subunits.flatMap(subunit => subunit.types.map(type => ({ ...type, subunitName: subunit.name }))) : [];
const readyTypes = types.filter(type => inventoryById.get(type.sourceItemId)?.implementationStatus === "ready");
const lockedTypes = types.filter(type => inventoryById.get(type.sourceItemId)?.implementationStatus === "review-locked");
const e2ReadyTypes = readyTypes.filter(type => inventoryById.get(type.sourceItemId)?.exploration === 2);
const e2LockedTypes = lockedTypes.filter(type => inventoryById.get(type.sourceItemId)?.exploration === 2);

const fail = message => failures.push(message);
const slug = value => String(value).replaceAll(/[^\p{L}\p{N}_-]+/gu, "_");
const rectsOverlap = (a, b) => Boolean(a && b && a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1);

function auditInventory() {
  if (!semester || !unit) return fail("5-1 1단원 자연수의 혼합 계산을 찾지 못했습니다.");
  if (inventory.items.length !== 44 || types.length !== 44) fail(`원문·교육과정 유형은 각각 44개여야 하나 ${inventory.items.length}, ${types.length}개입니다.`);
  if (readyTypes.length !== 32 || lockedTypes.length !== 12) fail(`단원은 공개 32개·잠금 12개여야 하나 ${readyTypes.length}, ${lockedTypes.length}개입니다.`);
  if (e2ReadyTypes.length !== 10 || e2LockedTypes.length !== 1) fail(`개념탐구 2는 공개 10개·잠금 1개여야 하나 ${e2ReadyTypes.length}, ${e2LockedTypes.length}개입니다.`);
  for (const type of types) {
    const source = inventoryById.get(type.sourceItemId);
    if (!source) {
      fail(`${type.id}: 원문 분류표에 없는 유형입니다.`);
      continue;
    }
    if (type.label !== source.typeLabel || type.name !== source.typeLabel) fail(`${type.id}: 유형명이 원문 분류표와 다릅니다.`);
    const shouldLock = source.implementationStatus === "review-locked";
    if (type.reviewLocked !== shouldLock) fail(`${type.id}: 잠금 상태가 원문 분류표와 다릅니다.`);
    if (source.exploration === 2) {
      if (type.variant === 7) {
        if (!shouldLock || api.generatorKey(type)) fail(`${type.id}: Mission 3은 잠금이고 생성기가 없어야 합니다.`);
      } else if (shouldLock || api.generatorKey(type) !== "mixedCalculationE2") fail(`${type.id}: 개념탐구 2 공개 생성기 연결이 다릅니다.`);
    }
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
  if (await page.locator("[data-preview-type-id]").count() !== 44) fail(`${label}: 목록에 44유형이 보이지 않습니다.`);
  for (const type of types) {
    const row = page.locator(`[data-preview-type-id="${type.id}"]`);
    if (await row.count() !== 1) {
      fail(`${label} ${type.id}: 유형 행이 없습니다.`);
      continue;
    }
    await row.scrollIntoViewIfNeeded();
    await row.click();
    const popover = page.locator("#typePreviewPopover:not([hidden])");
    await popover.waitFor({ state: "visible" });
    const state = await page.evaluate(({ typeId, mobile }) => {
      const box = selector => {
        const node = document.querySelector(selector);
        const rect = node?.getBoundingClientRect();
        return rect ? { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom } : null;
      };
      const rowBox = box(`[data-preview-type-id="${typeId}"]`);
      const popoverBox = box("#typePreviewPopover:not([hidden])");
      const treeBox = box(".tree-pane");
      const footer = document.querySelector(".selection-footer:not([hidden])");
      return {
        rowBox, popoverBox, treeBox,
        belowRow: !mobile || Boolean(rowBox && popoverBox && popoverBox.top >= rowBox.bottom - 1),
        footerVisible: Boolean(footer && getComputedStyle(footer).display !== "none"),
        expanded: document.querySelector(`[data-preview-type-id="${typeId}"]`)?.getAttribute("aria-expanded") === "true",
        inViewport: Boolean(popoverBox && popoverBox.left >= -1 && popoverBox.right <= innerWidth + 1 && popoverBox.top >= -1),
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        text: document.querySelector("#typePreviewPopover:not([hidden])")?.innerText || "",
        questionVisible: Boolean(document.querySelector("#typePreviewPopover:not([hidden]) .type-preview-question"))
      };
    }, { typeId: type.id, mobile: viewport.width <= 700 });
    const source = inventoryById.get(type.sourceItemId);
    if (!state.expanded || !state.inViewport || state.overflow) fail(`${label} ${type.id}: 미리보기 위치 또는 가로 폭이 올바르지 않습니다.`);
    if (viewport.width <= 700) {
      if (!state.belowRow || rectsOverlap(state.rowBox, state.popoverBox) || state.footerVisible) fail(`${label} ${type.id}: 모바일 미리보기가 행 아래에 놓이지 않거나 하단 바가 가립니다.`);
    } else if (rectsOverlap(state.rowBox, state.popoverBox) || rectsOverlap(state.treeBox, state.popoverBox)) fail(`${label} ${type.id}: PC 미리보기가 목록을 가립니다.`);
    if (!state.text.includes(type.label) || !state.text.includes(`교재 ${source.sourcePrintedPage}쪽`)) fail(`${label} ${type.id}: 유형명 또는 원문 쪽수가 미리보기에 없습니다.`);
    if (source.implementationStatus === "ready" && !state.questionVisible) fail(`${label} ${type.id}: 공개 유형의 대표 문제가 없습니다.`);
    if (source.implementationStatus === "review-locked" && (!state.text.includes("검수 대기") || !state.text.includes(type.reviewReason))) fail(`${label} ${type.id}: 잠금 사유가 정확히 표시되지 않습니다.`);
    await page.locator("[data-close-type-preview]").click();
  }
  await page.screenshot({ path: path.join(outputDir, `catalog-${label}.png`), fullPage: true });
  screenshotCount += 1;
  await page.close();
}

async function inspectReview(browser, type, viewport, label) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  listen(page, `${label} ${type.id}`);
  await page.goto(`${baseUrl}?type=${encodeURIComponent(type.id)}&review=1`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
  const inspect = async selector => page.evaluate(viewSelector => {
    const items = [...document.querySelectorAll(viewSelector)];
    return {
      count: items.length,
      finite: !/\b(?:undefined|null|NaN|Infinity)\b/.test(document.body.innerText || ""),
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1 || items.some(item => item.scrollWidth > item.clientWidth + 1),
      empty: items.some(item => !(item.textContent || "").trim())
    };
  }, selector);
  const problemState = await inspect("#problemView .question-item");
  if (problemState.count !== 3 || !problemState.finite || problemState.overflow || problemState.empty) fail(`${label} ${type.id}: 문제 화면 상태가 올바르지 않습니다. ${JSON.stringify(problemState)}`);
  if (type.variant === 10) {
    const tape = await page.evaluate(() => {
      const svg = document.querySelector("[data-tape-model]");
      const values = svg?.getAttribute("data-tape-model")?.split(",").map(Number) || [];
      const labels = [...(svg?.querySelectorAll("text") || [])].map(node => {
        const box = node.getBBox();
        const rendered = node.getBoundingClientRect();
        return {
          text: node.textContent,
          fontSize: Number.parseFloat(getComputedStyle(node).fontSize),
          box: { x: box.x, y: box.y, width: box.width, height: box.height },
          rendered: { width: rendered.width, height: rendered.height }
        };
      });
      const viewBox = svg?.viewBox.baseVal;
      return { values, labels, viewBox: viewBox ? { width: viewBox.width, height: viewBox.height } : null, rectCount: svg?.querySelectorAll("rect").length || 0 };
    });
    const [length, width, overlap, count, overlapCount, totalLength] = tape.values;
    const labelsFit = tape.labels.every(label => label.box.x >= -1 && label.box.y >= -1 && label.box.x + label.box.width <= (tape.viewBox?.width || 0) + 1 && label.box.y + label.box.height <= (tape.viewBox?.height || 0) + 1);
    const labelsReadable = tape.labels.every(item => item.fontSize >= 8.5 && item.rendered.width > 2 && item.rendered.height > 2);
    const labelText = tape.labels.map(item => item.text).join(" ");
    const requiredLabels = [`길이 ${length}cm`, `폭 ${width}cm`, `겹친 길이 ${overlap}cm`, `테이프 ${count}장`, `겹친 곳 ${overlapCount}곳`];
    const labelsComplete = requiredLabels.every(text => labelText.includes(text));
    if (!(length > overlap && overlap > 0 && width > 0 && count - 1 === overlapCount && totalLength === length * count - overlap * overlapCount && tape.rectCount >= 8 && labelsFit && labelsReadable && labelsComplete)) fail(`${label} ${type.id}: 테이프 길이·폭·겹친 길이·장수 또는 SVG 표시가 불완전합니다. ${JSON.stringify({ tape, labelsFit, labelsReadable, labelsComplete })}`);
  }
  await page.screenshot({ path: path.join(outputDir, `${slug(type.sourceItemId)}-${label}-problem.png`), fullPage: true });
  screenshotCount += 1;
  if (label === "desktop") {
    await page.emulateMedia({ media: "print" });
    const printProblem = await inspect("#problemView .question-item");
    if (printProblem.overflow) fail(`A4 ${type.id}: 문제 또는 그림이 인쇄 폭을 벗어납니다.`);
    const problemPdf = path.join(outputDir, `${slug(type.sourceItemId)}-a4-problem.pdf`);
    await page.pdf({ path: problemPdf, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (fs.statSync(problemPdf).size < 5000) fail(`A4 ${type.id}: 문제 PDF가 비어 있을 수 있습니다.`);
    pdfCount += 1;
    await page.emulateMedia({ media: "screen" });
  }
  await page.click("#solutionTab");
  const solutionState = await inspect("#solutionView .solution-item");
  if (solutionState.count !== 3 || !solutionState.finite || solutionState.overflow || solutionState.empty) fail(`${label} ${type.id}: 풀이 화면 상태가 올바르지 않습니다. ${JSON.stringify(solutionState)}`);
  await page.screenshot({ path: path.join(outputDir, `${slug(type.sourceItemId)}-${label}-solution.png`), fullPage: true });
  screenshotCount += 1;
  if (label === "desktop") {
    await page.emulateMedia({ media: "print" });
    const printSolution = await inspect("#solutionView .solution-item");
    if (printSolution.overflow) fail(`A4 ${type.id}: 풀이가 인쇄 폭을 벗어납니다.`);
    const solutionPdf = path.join(outputDir, `${slug(type.sourceItemId)}-a4-solution.pdf`);
    await page.pdf({ path: solutionPdf, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (fs.statSync(solutionPdf).size < 5000) fail(`A4 ${type.id}: 풀이 PDF가 비어 있을 수 있습니다.`);
    pdfCount += 1;
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
  for (const type of e2ReadyTypes) {
    await inspectReview(browser, type, { width: 1280, height: 900 }, "desktop");
    await inspectReview(browser, type, { width: 390, height: 844 }, "mobile");
  }
  await browser.close();
  if (failures.length) {
    console.error(`5-1 자연수의 혼합 계산 개념탐구 2 브라우저·인쇄 감사 실패: ${failures.length}건`);
    console.error(failures.slice(0, 100).join("\n"));
    process.exit(1);
  }
  console.log(`5-1 자연수의 혼합 계산 개념탐구 2 브라우저·인쇄 감사 통과: 원문 44유형 · 단원 공개 32 · 잠금 12 · 개념탐구 2 공개 10 · PC/모바일 ${screenshotCount}장 · A4 ${pdfCount}개 · ${outputDir}`);
})().catch(error => {
  console.error(`5-1 자연수의 혼합 계산 개념탐구 2 브라우저·인쇄 감사 예외: ${error.stack || error}`);
  process.exit(1);
});
