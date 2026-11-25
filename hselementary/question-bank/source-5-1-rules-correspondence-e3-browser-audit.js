"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { chromium } = require("playwright");

global.window = {};
require("./curriculum.js");
require("./generators.js");
// 2026-11-24: 11-22 공개 등록으로 이 단원의 잠금 유형이 원문 생성기(orig51…)로 공개되었다(잠금 0).
// 브라우저와 같은 상태(공개 여부·생성기·바뀐 유형 이름)를 보도록 공개 등록 파일과 원문 생성기를 함께 읽는다.
require("./source-lower-release-20261122-registry.js");
require("./source-lower-release-20261122.js");
require("./source-lock-reasons-20261122.js");
require("./source-5-1-a-original.js");
const releaseKey = type => window.HSE_LOWER_RELEASE_20261122?.[type.id]?.key;

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
// 2026-11-24: 아래 5항목은 예전 잠금 항목이었고 11-22 공개 등록으로 원문 생성기(orig51U3E3…)로 공개되었다.
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

// 2026-11-24: 쉬움 '풀이 도움:'·어려움 '다시 확인하세요.'는 생성기의 난이도 계약이다. 학생 화면에서는 problem-hint-policy.js(11-23/24)가
// 원문에 없는 안내로 지우므로, 이 감사의 문항 화면은 정책을 끄고 생성기 계약을 본다(HSE_KEEP_HINT_POLICY=1이면 정책을 켜고 이 두 문구 검사만 건너뜀).
const keepHintPolicy = process.env.HSE_KEEP_HINT_POLICY === "1";
async function disableHintPolicy(page) {
  if (keepHintPolicy) return;
  await page.route(/\/problem-hint-policy\.js(?:\?|$)/, route => route.fulfill({ status: 200, contentType: "application/javascript; charset=utf-8", body: "/* problem hint policy disabled for the generator contract audit */" }));
}

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
      // 2026-11-24: 공개 등록 원문 생성기는 문장이 같고 그림(SVG)만 다를 수 있어 반복 판정에 그림 내용도 넣는다.
      prompts: nodes.map(node => { const prompt = node.querySelector(".question-prompt"); return prompt ? `${prompt.innerText.trim()}|${[...prompt.querySelectorAll("svg")].map(svg => svg.innerHTML).join("|")}` : ""; }).filter(Boolean),
      tags: nodes.map(node => node.querySelector("[data-correspondence-e3-kind]")?.getAttribute("data-result-contract") || ""),
      sourceIds: nodes.map(node => node.querySelector("[data-source-item-id]")?.getAttribute("data-source-item-id") || "")
    };
  }, [selector, hiddenSelector]);
}

async function inspectType(browser, type, viewport, viewportLabel, difficulty) {
  const page = await browser.newPage({ viewport });
  const key = `${type.sourceItemId}-${viewportLabel}-${difficulty}`;
  page.on("pageerror", error => fail(`${key}: ${error.message}`));
  await disableHintPolicy(page);
  await page.goto(`${baseUrl}?type=${type.id}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });

  let state = await inspectView(page, "#problemView .question-item", "#solutionView");
  if (broken(state) || !state.hiddenViewHidden || new Set(state.prompts).size !== state.prompts.length) fail(`${key}: 문제 화면이 비었거나 겹치거나 가로로 넘치거나 정답과 분리되지 않았습니다.`);
  // 2026-11-24: 공개 등록 원문 생성기(orig51…)로 옮겨진 유형은 correspondenceE3의 숨은 태그·난이도 문구가 없다.
  // 이 유형은 세 문항이 원문 묶음(data-source-item-id)으로 나오는지와 화면 공통 검사만 한다.
  const released = Boolean(releaseKey(type));
  if (released && state.sourceIds.some(id => id !== type.sourceItemId)) fail(`${key}: 원문 생성기 문항의 원문 묶음 표지가 다릅니다.`);
  if (!released && state.tags.some(contract => contract !== "single-value")) fail(`${key}: 문제의 단일 정답 계약 태그가 없습니다.`);
  if (!released && !keepHintPolicy && difficulty === -1 && !state.text.includes("풀이 도움:")) fail(`${key}: 쉬움 안내가 보이지 않습니다.`);
  if (!released && difficulty === 0 && (state.text.includes("풀이 도움:") || state.text.includes("다시 확인하세요."))) fail(`${key}: 기준 문제에 난이도 안내가 섞였습니다.`);
  if (!released && !keepHintPolicy && difficulty === 1 && !state.text.includes("다시 확인하세요.")) fail(`${key}: 어려움 안내가 보이지 않습니다.`);
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
  if (types.length !== 41 || e3.length !== 10 || ready.length !== 10 || locked.length !== 0) fail(`E3 구성은 전체 41·공개 10·잠금 0이어야 합니다: ${types.length}/${ready.length}/${locked.length}`);
  if (unitReady.length !== 41 || unitLocked.length !== 0) fail(`U3 전체 상태는 공개 41·잠금 0이어야 합니다: ${unitReady.length}/${unitLocked.length}`);
  if (ready.some(type => !expectedReadyIds.has(type.sourceItemId) && !(expectedLockedIds.has(type.sourceItemId) && releaseKey(type)))) fail("E3 공개 원문 항목 구성이 다릅니다(예전 잠금 5항목은 공개 등록 원문 생성기여야 함).");
  for (const type of ready) if (api.generatorKey(type) !== (expectedLockedIds.has(type.sourceItemId) ? releaseKey(type) : "correspondenceE3")) fail(`${type.sourceItemId}: 공개 생성기 연결이 다릅니다.`);
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

  if (screenshots !== 122 || pdfs !== 60) fail(`검수 산출물 수가 다릅니다: 화면 ${screenshots}, A4 ${pdfs}`);
  if (failures.length) throw new Error(failures.join("\n"));
  console.log(`5-1 규칙과 대응 개념탐구 3 브라우저 감사 통과: 공개 10/잠금 0 · PC·모바일 ${screenshots}화면 · A4 ${pdfs}파일 · ${outputDir}`);
})().catch(error => {
  console.error(`5-1 규칙과 대응 개념탐구 3 브라우저 감사 실패: ${error.stack || error}`);
  process.exit(1);
});
