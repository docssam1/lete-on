"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { chromium } = require("playwright");
global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const unit = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-1")?.units.find(item => item.id === "5-1-u2");
const types = unit?.subunits.flatMap(item => item.types) || [];
const e8 = types.filter(type => type.sourceItemId.startsWith("5-1-u2-e8-"));
const ready = e8.filter(type => !type.reviewLocked);
const locked = e8.filter(type => type.reviewLocked);
const baseUrl = process.env.HSE_URL || "http://127.0.0.1:8878/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(os.tmpdir(), "lete-on-hse-5-1-factor-multiple-e8-browser-audit");
const failures = [];
let screenshots = 0;
let pdfs = 0;
const fail = message => failures.push(message);
const contracts = {
  0: "ordered", 1: "set", 2: "single-value", 3: "single-value", 4: "single-value",
  5: "single-value", 6: "single-value", 7: "set", 8: "ordered", 9: "single-value"
};

function isBroken(state) {
  return state.empty || state.overflow || /undefined|null|NaN|Infinity|\$\{/.test(state.text);
}

async function catalog(browser, viewport, label) {
  const page = await browser.newPage({ viewport });
  page.on("pageerror", error => fail(`${label}: ${error.message}`));
  await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 90000 });
  await page.click('#gradeFilter [data-grade="5"]');
  await page.click('#termFilter [data-term="1"]');
  await page.selectOption("#unitFilter", "5-1-u2");
  if (await page.locator("[data-preview-type-id]").count() !== 96) fail(`${label}: 약수와 배수 96개 유형이 보이지 않습니다.`);
  for (const type of e8) {
    const row = page.locator(`[data-preview-type-id="${type.id}"]`);
    await row.scrollIntoViewIfNeeded();
    await row.click();
    const popover = page.locator("#typePreviewPopover:not([hidden])");
    await popover.waitFor({ state: "visible" });
    const state = await page.evaluate(id => {
      const popoverRect = document.querySelector("#typePreviewPopover:not([hidden])")?.getBoundingClientRect();
      const rowRect = document.querySelector(`[data-preview-type-id="${id}"]`)?.getBoundingClientRect();
      return {
        text: document.querySelector("#typePreviewPopover:not([hidden])")?.innerText || "",
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        coversRow: Boolean(popoverRect && rowRect && popoverRect.top < rowRect.bottom && popoverRect.bottom > rowRect.top && popoverRect.left < rowRect.right && popoverRect.right > rowRect.left)
      };
    }, type.id);
    if (state.overflow || state.coversRow || !state.text.includes(type.label)) fail(`${label} ${type.id}: 목록을 가리는 미리보기 또는 빈 내용입니다.`);
    if (type.reviewLocked ? !state.text.includes("검수 대기") : !state.text.includes("대표 문제")) fail(`${label} ${type.id}: 공개·잠금 상태가 미리보기에 맞지 않습니다.`);
    await page.locator("[data-close-type-preview]").click();
  }
  await page.screenshot({ path: path.join(outputDir, `catalog-${label}.png`), fullPage: true });
  screenshots += 1;
  await page.close();
}

async function inspectView(page, selector) {
  return page.evaluate(selected => {
    const nodes = [...document.querySelectorAll(selected)];
    const prompts = nodes.map(node => node.querySelector(".question-prompt")?.innerText.trim()).filter(Boolean);
    return {
      text: document.body.innerText,
      empty: nodes.length === 0 || nodes.some(node => !node.innerText.trim()),
      overflow: document.documentElement.scrollWidth > innerWidth + 1 || nodes.some(node => node.scrollWidth > node.clientWidth + 1),
      prompts,
      mathFractions: nodes.reduce((total, node) => total + node.querySelectorAll(".math-fraction").length, 0),
      evidence: nodes.map(node => node.querySelector('[data-factor-multiple-e8-kind]')?.getAttribute("data-result-contract") || "")
    };
  }, selector);
}

async function review(browser, type, viewport, label, difficulty) {
  const page = await browser.newPage({ viewport });
  const key = `${type.sourceItemId}-${label}-${difficulty}`;
  page.on("pageerror", error => fail(`${key}: ${error.message}`));
  await page.goto(`${baseUrl}?type=${type.id}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
  let state = await inspectView(page, "#problemView .question-item");
  if (isBroken(state) || new Set(state.prompts).size !== state.prompts.length) fail(`${key}: 문제 화면이 비었거나 넘치거나 같은 문항이 반복됩니다.`);
  if (state.evidence.some(contract => contract !== contracts[type.variant])) fail(`${key}: 숨은 답 형식 계약이 유형 계약과 다릅니다.`);
  if (difficulty === -1 && !state.text.includes("풀이 도움:")) fail(`${key}: 쉬움 실마리가 보이지 않습니다.`);
  if (difficulty === 0 && (state.text.includes("풀이 도움:") || state.text.includes("다시 확인하세요."))) fail(`${key}: 보통 문항에 난이도 안내가 섞였습니다.`);
  if (difficulty === 1 && !state.text.includes("다시 확인하세요.")) fail(`${key}: 어려움 재확인 문구가 보이지 않습니다.`);
  await page.screenshot({ path: path.join(outputDir, `${key}-problem.png`), fullPage: true });
  screenshots += 1;
  if (label === "desktop") {
    await page.emulateMedia({ media: "print" });
    const file = path.join(outputDir, `${key}-problem.pdf`);
    if ((await inspectView(page, "#problemView .question-item")).overflow) fail(`${key}: A4 문제 폭을 벗어납니다.`);
    await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (fs.statSync(file).size < 5000) fail(`${key}: A4 문제 PDF가 비었습니다.`);
    pdfs += 1;
    await page.emulateMedia({ media: "screen" });
  }
  await page.click("#solutionTab");
  state = await inspectView(page, "#solutionView .solution-item");
  if (isBroken(state)) fail(`${key}: 풀이 화면이 비었거나 넘칩니다.`);
  await page.screenshot({ path: path.join(outputDir, `${key}-solution.png`), fullPage: true });
  screenshots += 1;
  if (label === "desktop") {
    await page.emulateMedia({ media: "print" });
    const file = path.join(outputDir, `${key}-solution.pdf`);
    if ((await inspectView(page, "#solutionView .solution-item")).overflow) fail(`${key}: A4 풀이 폭을 벗어납니다.`);
    await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (fs.statSync(file).size < 5000) fail(`${key}: A4 풀이 PDF가 비었습니다.`);
    pdfs += 1;
  }
  await page.close();
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  if (types.length !== 96 || e8.length !== 11 || ready.length !== 10 || locked.length !== 1 || locked[0]?.variant !== 10) fail("E8 공개 10·잠금 1 구성이 다릅니다.");
  for (const type of ready) if (api.generatorKey(type) !== "factorMultipleE8") fail(`${type.id}: 공개 유형 생성기가 factorMultipleE8가 아닙니다.`);
  for (const type of locked) if (api.generatorKey(type)) fail(`${type.id}: 잠금 유형이 생성기에 연결되었습니다.`);
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  await catalog(browser, { width: 1280, height: 900 }, "desktop");
  await catalog(browser, { width: 390, height: 844 }, "mobile");
  for (const difficulty of [-1, 0, 1]) for (const type of ready) {
    await review(browser, type, { width: 1280, height: 900 }, "desktop", difficulty);
    await review(browser, type, { width: 390, height: 844 }, "mobile", difficulty);
  }
  await browser.close();
  if (screenshots !== 122 || pdfs !== 60) fail(`검수 산출물 수가 다릅니다: 화면 ${screenshots}, A4 ${pdfs}`);
  if (failures.length) throw new Error(failures.join("\n"));
  console.log(`5-1 약수와 배수 개념탐구 8 브라우저 감사 통과: 공개 10/잠금 1 · PC·모바일 ${screenshots}화면 · A4 ${pdfs}파일 · ${outputDir}`);
})().catch(error => {
  console.error(`5-1 약수와 배수 개념탐구 8 브라우저 감사 실패: ${error.stack || error}`);
  process.exit(1);
});
