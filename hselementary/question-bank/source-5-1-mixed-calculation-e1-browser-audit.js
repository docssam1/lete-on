"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { chromium } = require("playwright");

global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-1");
const unit = semester?.units.find(item => item.id === "5-1-u1");
const inventory = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "5-1-unit-1-mixed-calculation.json"), "utf8"));
const baseUrl = process.env.HSE_URL || "http://127.0.0.1:8878/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(os.tmpdir(), "lete-on-hse-5-1-mixed-calculation-e1-browser-audit");
const failures = [];
let screenshotCount = 0;
let pdfCount = 0;

const fail = message => failures.push(message);
const slug = value => String(value).replaceAll(/[^\p{L}\p{N}_-]+/gu, "_");
const inventoryById = new Map(inventory.items.map(item => [item.sourceItemId, item]));
const types = unit ? unit.subunits.flatMap(subunit => subunit.types.map(type => ({ ...type, subunitName: subunit.name }))) : [];
const readyTypes = types.filter(type => inventoryById.get(type.sourceItemId)?.implementationStatus === "ready");
const e1ReadyTypes = readyTypes.filter(type => inventoryById.get(type.sourceItemId)?.exploration === 1);
const lockedTypes = types.filter(type => inventoryById.get(type.sourceItemId)?.implementationStatus === "review-locked");

function auditInventory() {
  if (!semester || !unit) return fail("5-1 1단원 자연수의 혼합 계산을 찾지 못했습니다.");
  const learnerFit = inventory.learnerFit;
  const learnerCriteria = learnerFit?.criteria || {};
  if (learnerFit?.gateId !== "learner-fit" || learnerFit?.learner_stage !== "5학년 1학기 심화 문제은행") fail("learner-fit 단계 또는 학습자 기준이 정확하지 않습니다.");
  for (const criterion of ["language", "representations", "prerequisites", "reasoning-load", "response-mode"]) {
    if (!String(learnerCriteria[criterion] || "").trim()) fail(`learner-fit ${criterion} 기준이 없습니다.`);
  }
  if (inventory.items.length !== 44 || types.length !== 44) fail(`원문·교육과정 유형은 각각 44개여야 하나 ${inventory.items.length}, ${types.length}개입니다.`);
  if (readyTypes.length !== 21 || lockedTypes.length !== 23) fail(`공개 21개·검수 대기 23개여야 하나 ${readyTypes.length}, ${lockedTypes.length}개입니다.`);
  if (e1ReadyTypes.length !== 11) fail(`개념탐구 1의 공개 유형은 11개여야 하나 ${e1ReadyTypes.length}개입니다.`);
  const sourceIds = new Set();
  for (const type of types) {
    if (!type.sourceItemId || sourceIds.has(type.sourceItemId)) fail(`${type.id}: 원문 ID가 비었거나 중복됩니다.`);
    sourceIds.add(type.sourceItemId);
    const source = inventoryById.get(type.sourceItemId);
    if (!source) {
      fail(`${type.id}: 원문 분류표에 없는 유형입니다.`);
      continue;
    }
    if (type.label !== source.typeLabel || type.name !== source.typeLabel) fail(`${type.id}: 유형명이 원문 분류표와 다릅니다.`);
    if (type.sourceItemLabel !== source.sourceItemLabel || type.sourceSection !== source.sourceSection || type.sourcePdfPage !== source.sourcePdfPage || type.sourcePrintedPage !== source.sourcePrintedPage) fail(`${type.id}: 원문 이름 또는 위치가 분류표와 다릅니다.`);
    const shouldLock = source.implementationStatus === "review-locked";
    if (type.reviewLocked !== shouldLock) fail(`${type.id}: 검수 대기 상태가 분류표와 다릅니다.`);
    if (shouldLock && (!type.reviewReason || api.generatorKey(type))) fail(`${type.id}: 잠금 사유가 없거나 생성기가 열려 있습니다.`);
    const expectedGenerator = source.exploration === 1 ? "mixedCalculationE1" : source.exploration === 2 ? "mixedCalculationE2" : "";
    if (!shouldLock && (!expectedGenerator || type.reviewLocked || api.generatorKey(type) !== expectedGenerator)) fail(`${type.id}: 공개 유형의 생성기 연결이 다릅니다.`);
    if (!shouldLock && !["single-value", "ordered", "named-value"].includes(inventory.resultContracts?.[type.sourceItemId])) fail(`${type.id}: 공개 유형의 답 형식 계약이 없습니다.`);
  }
  for (const subunit of unit.subunits) {
    const variants = subunit.types.map(type => type.variant).join(",");
    if (subunit.types.length !== 11 || variants !== "0,1,2,3,4,5,6,7,8,9,10") fail(`${subunit.name}: 개념탐구 본문·예제 4개·Mission 6개 구조가 아닙니다.`);
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
  const catalogCount = await page.locator("[data-preview-type-id]").count();
  if (catalogCount !== 44) fail(`${label}: 목록에 44유형 대신 ${catalogCount}유형이 보입니다.`);
  for (const type of types) {
    const row = page.locator(`[data-preview-type-id="${type.id}"]`);
    if (await row.count() !== 1) {
      fail(`${label} ${type.id}: 유형 행이 없습니다.`);
      continue;
    }
    await row.scrollIntoViewIfNeeded();
    await row.click();
    const preview = page.locator("#typePreviewPopover:not([hidden])");
    await preview.waitFor({ state: "visible" });
    const state = await page.evaluate(({ typeId, mobile }) => {
      const rect = node => {
        const box = node?.getBoundingClientRect();
        return box ? { left: box.left, right: box.right, top: box.top, bottom: box.bottom, width: box.width, height: box.height } : null;
      };
      const row = document.querySelector(`[data-preview-type-id="${typeId}"]`);
      const popover = document.querySelector("#typePreviewPopover:not([hidden])");
      const tree = document.querySelector(".tree-pane");
      const rowBox = rect(row);
      const previewBox = rect(popover);
      const treeBox = rect(tree);
      const overlap = (a, b) => Boolean(a && b && a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1);
      return {
        rowBox,
        previewBox,
        overlapsRow: overlap(rowBox, previewBox),
        overlapsTree: !mobile && overlap(treeBox, previewBox),
        belowRow: !mobile || Boolean(rowBox && previewBox && previewBox.top >= rowBox.bottom - 1),
        inViewport: Boolean(previewBox && previewBox.left >= -1 && previewBox.right <= innerWidth + 1 && previewBox.top >= -1),
        footerVisible: Boolean(document.querySelector(".selection-footer:not([hidden])") && getComputedStyle(document.querySelector(".selection-footer")).display !== "none"),
        expanded: row?.getAttribute("aria-expanded") === "true",
        text: popover?.innerText || "",
        questionVisible: Boolean(popover?.querySelector(".type-preview-question")),
        documentOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      };
    }, { typeId: type.id, mobile: viewport.width <= 700 });
    if (!state.expanded || !state.inViewport || state.documentOverflow) fail(`${label} ${type.id}: 미리보기 상태·화면 위치·가로 폭이 올바르지 않습니다.`);
    if (viewport.width <= 700) {
      if (!state.belowRow || state.overlapsRow || state.footerVisible) fail(`${label} ${type.id}: 미리보기가 누른 유형 아래에 놓이지 않거나 하단 바가 가립니다.`);
    } else if (state.overlapsRow || state.overlapsTree) fail(`${label} ${type.id}: 미리보기가 유형 목록을 가립니다.`);
    const source = inventoryById.get(type.sourceItemId);
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
    const finite = !/\b(?:undefined|null|NaN|Infinity)\b/.test(document.body.innerText || "");
    return {
      count: items.length,
      finite,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1 || items.some(item => item.scrollWidth > item.clientWidth + 1),
      empty: items.some(item => !(item.textContent || "").trim()),
      zeroUnits: items.some(item => /\b\d+\s*(?:m|cm)\s+0\s*(?:cm|mm)\b/.test(item.textContent || "")),
      rawFraction: items.some(item => /(?:\d+|□|[가-힣])\s*\/\s*(?:\d+|□|[가-힣])/.test(item.textContent || ""))
    };
  }, selector);
  const problemState = await inspect("#problemView .question-item");
  if (problemState.count !== 3 || !problemState.finite || problemState.overflow || problemState.empty || problemState.zeroUnits || problemState.rawFraction) fail(`${label} ${type.id}: 문제 화면의 3문항·표기·폭 검사에 실패했습니다. ${JSON.stringify(problemState)}`);
  await page.screenshot({ path: path.join(outputDir, `${slug(type.sourceItemId)}-${label}-problem.png`), fullPage: true });
  screenshotCount += 1;

  if (label === "desktop") {
    await page.emulateMedia({ media: "print" });
    const printProblem = await inspect("#problemView .question-item");
    const pageOverflow = await page.evaluate(() => [...document.querySelectorAll("#problemView .print-page")].some(printPage => [...printPage.querySelectorAll(".question-item,.equation")].some(node => node.scrollWidth > node.clientWidth + 1)));
    if (printProblem.overflow || pageOverflow) fail(`A4 ${type.id}: 문제 또는 식이 인쇄 폭을 벗어납니다.`);
    const problemPdf = path.join(outputDir, `${slug(type.sourceItemId)}-a4-problem.pdf`);
    await page.pdf({ path: problemPdf, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (fs.statSync(problemPdf).size < 5000) fail(`A4 ${type.id}: 문제 PDF가 비어 있을 수 있습니다.`);
    pdfCount += 1;
    await page.emulateMedia({ media: "screen" });
  }

  await page.click("#solutionTab");
  const solutionState = await inspect("#solutionView .solution-item");
  if (solutionState.count !== 3 || !solutionState.finite || solutionState.overflow || solutionState.empty || solutionState.zeroUnits || solutionState.rawFraction) fail(`${label} ${type.id}: 풀이 화면의 3문항·표기·폭 검사에 실패했습니다. ${JSON.stringify(solutionState)}`);
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
  for (const type of e1ReadyTypes) {
    await inspectReview(browser, type, { width: 1280, height: 900 }, "desktop");
    await inspectReview(browser, type, { width: 390, height: 844 }, "mobile");
  }
  await browser.close();
  if (failures.length) {
    console.error(`5-1 자연수의 혼합 계산 브라우저·인쇄 감사 실패: ${failures.length}건`);
    console.error(failures.slice(0, 100).join("\n"));
    process.exit(1);
  }
  console.log(`5-1 자연수의 혼합 계산 개념탐구 1 브라우저·인쇄 감사 통과: 원문 44유형 · 단원 공개 21 · 잠금 23 · 개념탐구 1 공개 11 · PC/모바일 ${screenshotCount}장 · A4 ${pdfCount}개 · ${outputDir}`);
})().catch(error => {
  console.error(`5-1 자연수의 혼합 계산 브라우저·인쇄 감사 예외: ${error.stack || error}`);
  process.exit(1);
});
