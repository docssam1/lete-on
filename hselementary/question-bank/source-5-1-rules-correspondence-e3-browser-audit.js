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
const e3 = types.filter(type => type.sourceItemId?.startsWith("5-1-u3-e3-"));
const ready = e3.filter(type => !type.reviewLocked);
const locked = e3.filter(type => type.reviewLocked);
const expectedReadyIds = new Set([
  "5-1-u3-e3-exploration",
  "5-1-u3-e3-mission-1",
  "5-1-u3-e3-mission-2",
  "5-1-u3-e3-mission-3",
  "5-1-u3-e3-mission-4"
]);
const expectedLockedIds = new Set([
  "5-1-u3-e3-example-3-1",
  "5-1-u3-e3-example-3-2",
  "5-1-u3-e3-example-3-3",
  "5-1-u3-e3-mission-5",
  "5-1-u3-e3-mission-6"
]);
const baseUrl = process.env.HSE_URL || "http://127.0.0.1:8896/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(os.tmpdir(), "lete-on-hse-5-1-rules-correspondence-e3-browser-audit");
const failures = [];
let screenshots = 0;
let pdfs = 0;

const fail = message => failures.push(message);
const intersects = (first, second) => first && second && first.left < second.right && first.right > second.left && first.top < second.bottom && first.bottom > second.top;
const broken = state => state.empty || state.overflow || state.overlap || /undefined|null|NaN|Infinity|\\$\\{/.test(state.text);

async function inspectCatalog(browser, viewport, label) {
  const page = await browser.newPage({ viewport });
  page.on("pageerror", error => fail(`${label}: ${error.message}`));
  await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 90000 });
  await page.click('#gradeFilter [data-grade="5"]');
  await page.click('#termFilter [data-term="1"]');
  await page.selectOption("#unitFilter", "5-1-u3");

  if (await page.locator("[data-preview-type-id]").count() !== 41) fail(`${label}: 규칙과 대응 41개 유형이 보이지 않습니다.`);
  for (const type of e3) {
    const row = page.locator(`[data-preview-type-id="${type.id}"]`);
    if (await row.count() !== 1) {
      fail(`${label} ${type.sourceItemId}: 유형 행이 하나가 아닙니다.`);
      continue;
    }
    await row.scrollIntoViewIfNeeded();
    await row.click();
    const popover = page.locator("#typePreviewPopover:not([hidden])");
    await popover.waitFor({ state: "visible" });
    const state = await page.evaluate(id => {
      const popoverNode = document.querySelector("#typePreviewPopover:not([hidden])");
      const rowNode = document.querySelector(`[data-preview-type-id="${id}"]`);
      const popoverRect = popoverNode?.getBoundingClientRect();
      const rowRect = rowNode?.getBoundingClientRect();
      return {
        text: popoverNode?.innerText || "",
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        coversRow: Boolean(popoverRect && rowRect && popoverRect.top < rowRect.bottom && popoverRect.bottom > rowRect.top && popoverRect.left < rowRect.right && popoverRect.right > rowRect.left),
        generatedQuestionCount: popoverNode?.querySelectorAll(".type-preview-question").length || 0
      };
    }, type.id);
    if (state.overflow || state.coversRow || !state.text.includes(type.label)) fail(`${label} ${type.sourceItemId}: 미리보기가 비었거나 겹치거나 가로로 넘칩니다.`);
    if (type.reviewLocked) {
      if (!state.text.includes("검수 대기") || state.generatedQuestionCount !== 0) fail(`${label} ${type.sourceItemId}: 잠금 유형이 생성 문제로 노출됩니다.`);
    } else if (!state.text.includes("대표 문제") || state.generatedQuestionCount !== 1) {
      fail(`${label} ${type.sourceItemId}: 공개 유형의 대표 문제가 보이지 않습니다.`);
    }
    await page.locator("[data-close-type-preview]").click();
  }

  await page.screenshot({ path: path.join(outputDir, `catalog-${label}.png`), fullPage: true });
  screenshots += 1;
  await page.close();
}

async function inspectView(page, selector, hiddenSelector) {
  return page.evaluate(([selected, hidden]) => {
    const nodes = [...document.querySelectorAll(selected)];
    const visible = node => Boolean(node) && !node.hidden && getComputedStyle(node).display !== "none";
    const headers = nodes.flatMap(node => [...node.querySelectorAll("header")]);
    const overlap = headers.some(header => {
      const children = [...header.children].filter(visible).map(child => child.getBoundingClientRect());
      return children.some((first, index) => children.slice(index + 1).some(second => first.left < second.right && first.right > second.left && first.top < second.bottom && first.bottom > second.top));
    });
    return {
      text: document.body.innerText,
      empty: nodes.length === 0 || nodes.some(node => !node.innerText.trim()),
      overflow: document.documentElement.scrollWidth > innerWidth + 1 || nodes.some(node => node.scrollWidth > node.clientWidth + 1),
      overlap,
      hiddenViewHidden: document.querySelector(hidden)?.hidden === true,
      prompts: nodes.map(node => node.querySelector(".question-prompt")?.innerText.trim()).filter(Boolean),
      tags: nodes.map(node => node.querySelector("[data-correspondence-e3-kind]")?.getAttribute("data-result-contract") || "")
    };
  }, [selector, hiddenSelector]);
}

async function inspectType(browser, type, viewport, viewportLabel, difficulty) {
  const page = await browser.newPage({ viewport });
  const key = `${type.sourceItemId}-${viewportLabel}-${difficulty}`;
  page.on("pageerror", error => fail(`${key}: ${error.message}`));
  await page.goto(`${baseUrl}?type=${type.id}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });

  let state = await inspectView(page, "#problemView .question-item", "#solutionView");
  if (broken(state) || !state.hiddenViewHidden || new Set(state.prompts).size !== state.prompts.length) fail(`${key}: 문제 화면이 비었거나 겹치거나 가로로 넘치거나 정답과 분리되지 않았습니다.`);
  if (state.tags.some(contract => contract !== "single-value")) fail(`${key}: 문제의 단일 정답 계약 태그가 없습니다.`);
  if (difficulty === -1 && !state.text.includes("풀이 도움:")) fail(`${key}: 쉬움 안내가 보이지 않습니다.`);
  if (difficulty === 0 && (state.text.includes("풀이 도움:") || state.text.includes("다시 확인하세요."))) fail(`${key}: 기준 문제에 난이도 안내가 섞였습니다.`);
  if (difficulty === 1 && !state.text.includes("다시 확인하세요.")) fail(`${key}: 어려움 안내가 보이지 않습니다.`);
  await page.screenshot({ path: path.join(outputDir, `${key}-problem.png`), fullPage: true });
  screenshots += 1;

  if (viewportLabel === "desktop") {
    await page.emulateMedia({ media: "print" });
    const file = path.join(outputDir, `${key}-problem.pdf`);
    if ((await inspectView(page, "#problemView .question-item", "#solutionView")).overflow) fail(`${key}: A4 문제에 가로 넘침이 있습니다.`);
    await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (fs.statSync(file).size < 5000) fail(`${key}: A4 문제 PDF가 비었습니다.`);
    pdfs += 1;
    await page.emulateMedia({ media: "screen" });
  }

  await page.click("#solutionTab");
  state = await inspectView(page, "#solutionView .solution-item", "#problemView");
  if (broken(state) || !state.hiddenViewHidden) fail(`${key}: 정답·풀이 화면이 비었거나 겹치거나 가로로 넘치거나 문제와 분리되지 않았습니다.`);
  await page.screenshot({ path: path.join(outputDir, `${key}-solution.png`), fullPage: true });
  screenshots += 1;

  if (viewportLabel === "desktop") {
    await page.emulateMedia({ media: "print" });
    const file = path.join(outputDir, `${key}-solution.pdf`);
    if ((await inspectView(page, "#solutionView .solution-item", "#problemView")).overflow) fail(`${key}: A4 정답·풀이에 가로 넘침이 있습니다.`);
    await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (fs.statSync(file).size < 5000) fail(`${key}: A4 정답·풀이 PDF가 비었습니다.`);
    pdfs += 1;
  }
  await page.close();
}

async function inspectLockedRoute(browser, type, viewport, viewportLabel) {
  const page = await browser.newPage({ viewport });
  const key = `${type.sourceItemId}-${viewportLabel}`;
  page.on("pageerror", error => fail(`${key}: ${error.message}`));
  await page.goto(`${baseUrl}?type=${type.id}&review=1&difficulty=0`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(200);
  const state = await page.evaluate(() => ({
    worksheetVisible: !document.querySelector("#worksheet")?.hidden,
    generatedProblems: document.querySelectorAll("#problemView .question-item").length,
    generatedSolutions: document.querySelectorAll("#solutionView .solution-item").length,
    generatorTags: document.querySelectorAll("[data-correspondence-e3-kind]").length,
    overflow: document.documentElement.scrollWidth > innerWidth + 1
  }));
  if (state.worksheetVisible || state.generatedProblems || state.generatedSolutions || state.generatorTags || state.overflow) fail(`${key}: 잠금 유형이 화면 또는 생성 경로로 노출됩니다.`);
  await page.close();
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const unitReady = types.filter(type => !type.reviewLocked && api.generatorKey(type));
  const unitLocked = types.filter(type => type.reviewLocked || !api.generatorKey(type));
  if (types.length !== 41 || e3.length !== 10 || ready.length !== 5 || locked.length !== 5) fail(`E3 구성은 전체 41·공개 5·잠금 5여야 합니다: ${types.length}/${ready.length}/${locked.length}`);
  if (unitReady.length !== 30 || unitLocked.length !== 11) fail(`U3 전체 상태는 공개 30·잠금 11이어야 합니다: ${unitReady.length}/${unitLocked.length}`);
  if (ready.some(type => !expectedReadyIds.has(type.sourceItemId)) || locked.some(type => !expectedLockedIds.has(type.sourceItemId))) fail("E3 공개·잠금 원문 항목 구성이 다릅니다.");
  for (const type of ready) if (api.generatorKey(type) !== "correspondenceE3") fail(`${type.sourceItemId}: 공개 생성기 연결이 다릅니다.`);
  for (const type of locked) if (api.generatorKey(type)) fail(`${type.sourceItemId}: 잠금 유형에 생성기가 연결되어 있습니다.`);

  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  await inspectCatalog(browser, { width: 1440, height: 960 }, "desktop");
  await inspectCatalog(browser, { width: 390, height: 844 }, "mobile");
  for (const difficulty of [-1, 0, 1]) for (const type of ready) {
    await inspectType(browser, type, { width: 1440, height: 960 }, "desktop", difficulty);
    await inspectType(browser, type, { width: 390, height: 844 }, "mobile", difficulty);
  }
  for (const type of locked) {
    await inspectLockedRoute(browser, type, { width: 1440, height: 960 }, "desktop");
    await inspectLockedRoute(browser, type, { width: 390, height: 844 }, "mobile");
  }
  await browser.close();

  if (screenshots !== 62 || pdfs !== 30) fail(`검수 산출물 수가 다릅니다: 화면 ${screenshots}, A4 ${pdfs}`);
  if (failures.length) throw new Error(failures.join("\n"));
  console.log(`5-1 규칙과 대응 개념탐구 3 브라우저 감사 통과: 공개 5/잠금 5 · PC·모바일 ${screenshots}화면 · A4 ${pdfs}파일 · 잠금 경로 10건 차단 · ${outputDir}`);
})().catch(error => {
  console.error(`5-1 규칙과 대응 개념탐구 3 브라우저 감사 실패: ${error.stack || error}`);
  process.exit(1);
});
