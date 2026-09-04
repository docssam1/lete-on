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
const e4 = types.filter(type => type.sourceItemId?.startsWith("5-1-u3-e4-"));
const ready = e4.filter(type => !type.reviewLocked);
const locked = e4.filter(type => type.reviewLocked);
const expectedSourceItemIds = new Set([
  "5-1-u3-e4-exploration",
  "5-1-u3-e4-example-4-1",
  "5-1-u3-e4-example-4-2",
  "5-1-u3-e4-example-4-3",
  "5-1-u3-e4-mission-1",
  "5-1-u3-e4-mission-2",
  "5-1-u3-e4-mission-3",
  "5-1-u3-e4-mission-4",
  "5-1-u3-e4-mission-5",
  "5-1-u3-e4-mission-6"
]);
const orderedVariants = new Set([1, 2, 3]);
const baseUrl = process.env.HSE_URL || "http://127.0.0.1:8896/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(os.tmpdir(), "lete-on-hse-5-1-rules-correspondence-e4-browser-audit");
const failures = [];
let screenshots = 0;
let pdfs = 0;

const fail = message => failures.push(message);
const intersects = (first, second) => first && second && first.left < second.right && first.right > second.left && first.top < second.bottom && first.bottom > second.top;
const brokenText = text => /undefined|null|NaN|Infinity|\\$\\{/.test(text);

async function inspectCatalog(browser, viewport, label) {
  const page = await browser.newPage({ viewport });
  page.on("pageerror", error => fail(`${label}: ${error.message}`));
  await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 90000 });
  await page.click('#gradeFilter [data-grade="5"]');
  await page.click('#termFilter [data-term="1"]');
  await page.selectOption("#unitFilter", "5-1-u3");

  if (await page.locator("[data-preview-type-id]").count() !== 41) fail(`${label}: 규칙과 대응 41개 유형이 보이지 않습니다.`);
  for (const type of e4) {
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
    if (state.overflow || state.coversRow || !state.text.includes(type.label) || brokenText(state.text)) fail(`${label} ${type.sourceItemId}: 미리보기가 비었거나 겹치거나 가로로 넘치거나 시각 문구가 깨졌습니다.`);
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
    const visible = node => Boolean(node) && !node.hidden && getComputedStyle(node).display !== "none" && getComputedStyle(node).visibility !== "hidden";
    const hasOwnText = node => [...node.childNodes].some(child => child.nodeType === Node.TEXT_NODE && child.textContent.trim());
    const overlaps = (first, second) => first && second && first.left < second.right && first.right > second.left && first.top < second.bottom && first.bottom > second.top;
    const visualText = nodes.flatMap(node => [...node.querySelectorAll(".question-prompt, .question-answer, .solution-explanation, header, h1, h2, h3, h4, p, li, td, th, button, label, .tag")]).filter(node => visible(node) && (hasOwnText(node) || node.children.length === 0));
    const clippedText = visualText.some(node => node.clientWidth > 0 && node.scrollWidth > node.clientWidth + 1);
    const headers = nodes.flatMap(node => [...node.querySelectorAll("header")]);
    const headerOverlap = headers.some(header => {
      const children = [...header.children].filter(visible).map(child => child.getBoundingClientRect());
      return children.some((first, index) => children.slice(index + 1).some(second => overlaps(first, second)));
    });
    const blocks = nodes.flatMap(node => [...node.children]).filter(visible).map(node => ({ node, rect: node.getBoundingClientRect() }));
    const blockOverlap = blocks.some(({ node, rect }, index) => blocks.slice(index + 1).some(other => {
      if (node.parentElement !== other.node.parentElement || node.contains(other.node) || other.node.contains(node)) return false;
      return rect.width > 1 && rect.height > 1 && other.rect.width > 1 && other.rect.height > 1 && overlaps(rect, other.rect);
    }));
    return {
      text: document.body.innerText,
      empty: nodes.length === 0 || nodes.some(node => !node.innerText.trim()),
      overflow: document.documentElement.scrollWidth > innerWidth + 1 || nodes.some(node => node.scrollWidth > node.clientWidth + 1),
      clippedText,
      overlap: headerOverlap || blockOverlap,
      hiddenViewHidden: document.querySelector(hidden)?.hidden === true,
      prompts: nodes.map(node => node.querySelector(".question-prompt")?.innerText.trim()).filter(Boolean),
      tags: nodes.map(node => node.querySelector("[data-correspondence-e4-kind]")?.getAttribute("data-result-contract") || "")
    };
  }, [selector, hiddenSelector]);
}

function invalidView(state) {
  return state.empty || state.overflow || state.clippedText || state.overlap || brokenText(state.text);
}

async function inspectType(browser, type, viewport, viewportLabel, difficulty) {
  const page = await browser.newPage({ viewport });
  const key = `${type.sourceItemId}-variant-${type.variant}-${viewportLabel}-${difficulty}`;
  page.on("pageerror", error => fail(`${key}: ${error.message}`));
  await page.goto(`${baseUrl}?type=${type.id}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });

  const expectedContract = orderedVariants.has(type.variant) ? "ordered" : "single-value";
  let state = await inspectView(page, "#problemView .question-item", "#solutionView");
  if (invalidView(state) || !state.hiddenViewHidden || new Set(state.prompts).size !== state.prompts.length) fail(`${key}: 문제 화면이 비었거나, 텍스트가 잘리거나, 가로로 넘치거나, 겹치거나, 답안과 분리되지 않았습니다.`);
  if (state.tags.some(contract => contract !== expectedContract)) fail(`${key}: 문제의 ${expectedContract} 답 계약 태그가 없습니다.`);
  if (difficulty === -1 && !state.text.includes("풀이 도움:")) fail(`${key}: 쉬움 시각 문구가 보이지 않습니다.`);
  if (difficulty === 0 && (state.text.includes("풀이 도움:") || state.text.includes("구한 값을 처음 조건에"))) fail(`${key}: 기준 문제에 난이도 시각 문구가 섞였습니다.`);
  if (difficulty === 1 && !state.text.includes("구한 값을 처음 조건에")) fail(`${key}: 어려움 시각 문구가 보이지 않습니다.`);
  await page.screenshot({ path: path.join(outputDir, `${key}-problem.png`), fullPage: true });
  screenshots += 1;

  if (viewportLabel === "desktop") {
    await page.emulateMedia({ media: "print" });
    state = await inspectView(page, "#problemView .question-item", "#solutionView");
    if (invalidView(state) || !state.hiddenViewHidden) fail(`${key}: A4 문제에 빈 화면, 텍스트 잘림, 가로 넘침, 겹침 또는 답안 혼입이 있습니다.`);
    const file = path.join(outputDir, `${key}-problem.pdf`);
    await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (fs.statSync(file).size < 5000) fail(`${key}: A4 문제 PDF가 비었습니다.`);
    pdfs += 1;
    await page.emulateMedia({ media: "screen" });
  }

  await page.click("#solutionTab");
  state = await inspectView(page, "#solutionView .solution-item", "#problemView");
  if (invalidView(state) || !state.hiddenViewHidden) fail(`${key}: 정답·풀이 화면이 비었거나, 텍스트가 잘리거나, 가로로 넘치거나, 겹치거나, 문제와 분리되지 않았습니다.`);
  await page.screenshot({ path: path.join(outputDir, `${key}-solution.png`), fullPage: true });
  screenshots += 1;

  if (viewportLabel === "desktop") {
    await page.emulateMedia({ media: "print" });
    state = await inspectView(page, "#solutionView .solution-item", "#problemView");
    if (invalidView(state) || !state.hiddenViewHidden) fail(`${key}: A4 정답·풀이에 빈 화면, 텍스트 잘림, 가로 넘침, 겹침 또는 문제 혼입이 있습니다.`);
    const file = path.join(outputDir, `${key}-solution.pdf`);
    await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (fs.statSync(file).size < 5000) fail(`${key}: A4 정답·풀이 PDF가 비었습니다.`);
    pdfs += 1;
  }
  await page.close();
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const variants = [...ready.map(type => type.variant)].sort((left, right) => left - right);
  if (types.length !== 41 || e4.length !== 10 || ready.length !== 10 || locked.length !== 0) fail(`E4 구성은 전체 41·공개 10·잠금 0이어야 합니다: ${types.length}/${ready.length}/${locked.length}`);
  if (e4.some(type => !expectedSourceItemIds.has(type.sourceItemId)) || expectedSourceItemIds.size !== e4.length) fail("E4 원문 항목 구성이 다릅니다.");
  if (variants.join(",") !== "0,1,2,3,4,5,6,7,8,9") fail(`E4 변형은 0~9여야 합니다: ${variants.join(",")}`);
  for (const type of ready) if (api.generatorKey(type) !== "correspondenceE4") fail(`${type.sourceItemId}: 공개 생성기 연결이 다릅니다.`);
  for (const type of locked) if (api.generatorKey(type)) fail(`${type.sourceItemId}: 잠금 유형에 생성기가 연결되어 있습니다.`);

  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  await inspectCatalog(browser, { width: 1440, height: 960 }, "desktop");
  await inspectCatalog(browser, { width: 390, height: 844 }, "mobile");
  for (const difficulty of [-1, 0, 1]) for (const type of ready) {
    await inspectType(browser, type, { width: 1440, height: 960 }, "desktop", difficulty);
    await inspectType(browser, type, { width: 390, height: 844 }, "mobile", difficulty);
  }
  await browser.close();

  if (screenshots !== 122 || pdfs !== 60) fail(`검수 산출물 수가 다릅니다: 화면 ${screenshots}, A4 ${pdfs}`);
  if (failures.length) throw new Error(failures.join("\n"));
  console.log(`5-1 규칙과 대응 개념탐구 4 브라우저 감사 통과: 변형 0~9 · PC 1440·모바일 390 ${screenshots}화면 · A4 문제·답안 ${pdfs}파일 · ${outputDir}`);
})().catch(error => {
  console.error(`5-1 규칙과 대응 개념탐구 4 브라우저 감사 실패: ${error.stack || error}`);
  process.exit(1);
});
