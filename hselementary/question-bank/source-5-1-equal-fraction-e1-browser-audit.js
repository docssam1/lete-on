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
const unit = semester?.units.find(item => item.id === "5-1-u4");
const types = unit?.subunits.flatMap(subunit => subunit.types) || [];
const e1 = types.filter(type => type.sourceItemId?.startsWith("5-1-u4-e1-"));
const publicTypes = e1.filter(type => !type.reviewLocked);
const lockedTypes = e1.filter(type => type.reviewLocked);
const baseUrl = process.env.HSE_URL || "http://127.0.0.1:8878/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(os.tmpdir(), "lete-on-hse-5-1-equal-fraction-e1-browser-audit");
const failures = [];
let screenshots = 0;
let pdfs = 0;

const fail = message => failures.push(message);
const hasBrokenText = text => /undefined|null|NaN|Infinity|\$\{/.test(text);

function verifyCatalogContract() {
  const expectedIds = [
    "5-1-u4-e1-exploration",
    "5-1-u4-e1-example-1-1",
    "5-1-u4-e1-example-1-2",
    "5-1-u4-e1-example-1-3",
    "5-1-u4-e1-example-1-4",
    "5-1-u4-e1-mission-1",
    "5-1-u4-e1-mission-2",
    "5-1-u4-e1-mission-3",
    "5-1-u4-e1-mission-4",
    "5-1-u4-e1-mission-5",
    "5-1-u4-e1-mission-6"
  ];
  if (!unit) fail("5-1 U4 약분과 통분 단원을 찾지 못했습니다.");
  if (e1.length !== 11 || publicTypes.length !== 10 || lockedTypes.length !== 1) {
    fail(`U4 E1 구성은 11항목(공개 10/잠금 1)이어야 합니다: ${e1.length}/${publicTypes.length}/${lockedTypes.length}`);
  }
  if (expectedIds.some((id, index) => e1[index]?.sourceItemId !== id)) fail("U4 E1 원문 항목 순서가 다릅니다.");
  for (const type of publicTypes) {
    if (api.generatorKey(type) !== "equalFractionE1") fail(`${type.sourceItemId}: 공개 유형의 생성기 연결이 다릅니다.`);
  }
  for (const type of lockedTypes) {
    if (api.generatorKey(type)) fail(`${type.sourceItemId}: 잠금 유형에 생성기가 연결되어 있습니다.`);
    try {
      const generated = api.generate(type, 0, 0, 20260904, type.variant);
      if (generated) fail(`${type.sourceItemId}: 잠금 유형이 API에서 문제를 생성했습니다.`);
    } catch (_) {
      // A generator may reject a locked type; both rejection and no result are valid blocks.
    }
  }
}

async function inspectCatalog(browser, viewport, label) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  page.on("pageerror", error => fail(`${label} 목록: 브라우저 오류 ${error.message}`));
  page.on("console", message => {
    const text = message.text();
    if (message.type() === "error" && !text.includes("ERR_NETWORK_ACCESS_DENIED") && !text.includes("Failed to load resource: the server responded with a status of 404")) fail(`${label} 목록: 콘솔 오류 ${text}`);
  });
  await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 90000 });
  await page.click('#gradeFilter [data-grade="5"]');
  await page.click('#termFilter [data-term="1"]');
  await page.selectOption("#unitFilter", "5-1-u4");

  const visibleE1 = await page.locator("[data-preview-type-id]").evaluateAll(rows => rows
    .filter(row => row.dataset.previewTypeId?.startsWith("5-1-u4-t1"))
    .map(row => row.dataset.previewTypeId));
  if (visibleE1.length !== 11 || new Set(visibleE1).size !== 11) fail(`${label} 목록: U4 E1 유형 11개가 보이지 않습니다.`);

  for (const type of e1) {
    const row = page.locator(`[data-preview-type-id="${type.id}"]`);
    if (await row.count() !== 1) {
      fail(`${label} ${type.sourceItemId}: 목록 행을 찾지 못했습니다.`);
      continue;
    }
    const checkbox = row.locator("input[data-type-id]");
    if (type.reviewLocked && !(await checkbox.isDisabled())) fail(`${label} ${type.sourceItemId}: 잠금 체크박스가 활성화되어 있습니다.`);
    if (!type.reviewLocked && await checkbox.isDisabled()) fail(`${label} ${type.sourceItemId}: 공개 체크박스가 비활성화되어 있습니다.`);

    await row.scrollIntoViewIfNeeded();
    await row.click();
    const popover = page.locator("#typePreviewPopover:not([hidden])");
    await popover.waitFor({ state: "visible" });
    const state = await page.evaluate(id => {
      const popover = document.querySelector("#typePreviewPopover:not([hidden])");
      const row = document.querySelector(`[data-preview-type-id="${id}"]`);
      const popoverRect = popover?.getBoundingClientRect();
      const rowRect = row?.getBoundingClientRect();
      const clipped = element => {
        if (!element) return true;
        const style = getComputedStyle(element);
        const clipsX = ["hidden", "clip", "auto", "scroll"].includes(style.overflowX);
        const clipsY = ["hidden", "clip", "auto", "scroll"].includes(style.overflowY);
        return (clipsX && element.scrollWidth > element.clientWidth + 1) || (clipsY && element.scrollHeight > element.clientHeight + 1);
      };
      return {
        text: popover?.innerText || "",
        pageOverflow: document.documentElement.scrollWidth > innerWidth + 1,
        coversSelectedRow: Boolean(popoverRect && rowRect && popoverRect.top < rowRect.bottom && popoverRect.bottom > rowRect.top && popoverRect.left < rowRect.right && popoverRect.right > rowRect.left)
      };
    }, type.id);
    if (state.pageOverflow || state.coversSelectedRow || !state.text.includes(type.label)) {
      fail(`${label} ${type.sourceItemId}: 미리보기가 선택 행을 가리거나 넘치거나 제목이 없습니다.`);
    }
    if (type.reviewLocked ? !state.text.includes("검수 대기") : !state.text.includes("대표 문제")) {
      fail(`${label} ${type.sourceItemId}: 미리보기 공개·잠금 상태가 다릅니다.`);
    }
    await page.locator("[data-close-type-preview]").click();
  }

  await page.screenshot({ path: path.join(outputDir, `catalog-${label}.png`), fullPage: true });
  screenshots += 1;
  await page.close();
}

async function inspectLockedRoute(browser) {
  const type = lockedTypes[0];
  if (!type) return;
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  await page.goto(`${baseUrl}?type=${encodeURIComponent(type.id)}&review=1&difficulty=0`, { waitUntil: "domcontentloaded", timeout: 90000 });
  const state = await page.evaluate(id => ({
    worksheetVisible: !document.querySelector("#worksheet")?.hidden,
    generateDisabled: document.querySelector("#generateButton")?.disabled === true,
    selectedCount: document.querySelector("#selectedTypeCount")?.textContent
  }), type.id);
  if (state.worksheetVisible || !state.generateDisabled || state.selectedCount !== "0") {
    fail(`${type.sourceItemId}: 잠금 유형의 화면 생성 경로가 차단되지 않았습니다.`);
  }
  await page.close();
}

async function inspectView(page, selector) {
  return page.evaluate(selected => {
    const nodes = [...document.querySelectorAll(selected)];
    const clipped = element => {
      const style = getComputedStyle(element);
      const clipsX = ["hidden", "clip", "auto", "scroll"].includes(style.overflowX);
      const clipsY = ["hidden", "clip", "auto", "scroll"].includes(style.overflowY);
      return (clipsX && element.scrollWidth > element.clientWidth + 1) || (clipsY && element.scrollHeight > element.clientHeight + 1);
    };
    const childOverlap = node => {
      const children = [...node.children].filter(child => child.getBoundingClientRect().width > 0 && child.getBoundingClientRect().height > 0);
      return children.some((child, index) => children.slice(index + 1).some(other => {
        const left = child.getBoundingClientRect();
        const right = other.getBoundingClientRect();
        return left.left < right.right - .5 && left.right > right.left + .5 && left.top < right.bottom - .5 && left.bottom > right.top + .5;
      }));
    };
    const fractions = nodes.flatMap(node => [...node.querySelectorAll(".question-prompt .math-fraction")]);
    const badFraction = fractions.some(fraction => {
      const [numerator, denominator] = fraction.children;
      if (!numerator || !denominator) return true;
      const top = numerator.getBoundingClientRect();
      const bottom = denominator.getBoundingClientRect();
      return top.width <= 0 || top.height <= 0 || bottom.width <= 0 || bottom.height <= 0 || top.bottom > bottom.top + .75;
    });
    return {
      pageOverflow: document.documentElement.scrollWidth > innerWidth + 1,
      empty: nodes.length !== 3 || nodes.some(node => !node.innerText.trim()),
      clipped: nodes.some(node => clipped(node)),
      overlap: nodes.some(node => childOverlap(node)),
      broken: /undefined|null|NaN|Infinity|\$\{/.test(document.body.innerText),
      prompts: nodes.map(node => node.querySelector(".question-prompt")?.innerText.replace(/\s+/g, " ").trim() || ""),
      answers: nodes.map(node => node.querySelector("header strong")?.innerText.replace(/\s+/g, " ").trim() || ""),
      fractionCount: fractions.length,
      badFraction,
      solutionVisible: !document.querySelector("#solutionView")?.hidden && getComputedStyle(document.querySelector("#solutionView")).display !== "none",
      solutionItemsInProblem: document.querySelectorAll("#problemView .solution-item").length
    };
  }, selector);
}

function reportViewFailures(state, key, view) {
  if (state.pageOverflow) fail(`${key} ${view}: 가로 넘침이 있습니다.`);
  if (state.empty) fail(`${key} ${view}: 세 문제 중 비어 있거나 누락된 문항이 있습니다.`);
  if (state.clipped) fail(`${key} ${view}: 문항 상자가 잘립니다.`);
  if (state.overlap) fail(`${key} ${view}: 문항 내부 요소가 겹칩니다.`);
  if (state.broken || hasBrokenText(state.prompts.join(" "))) fail(`${key} ${view}: 깨진 텍스트가 있습니다.`);
}

async function inspectPublicType(browser, type, viewport, viewportLabel, difficulty) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  const key = `${type.sourceItemId}-${viewportLabel}-difficulty-${difficulty}`;
  page.setDefaultTimeout(60000);
  page.on("pageerror", error => fail(`${key}: 브라우저 오류 ${error.message}`));
  page.on("console", message => {
    const text = message.text();
    if (message.type() === "error" && !text.includes("ERR_NETWORK_ACCESS_DENIED") && !text.includes("Failed to load resource: the server responded with a status of 404")) fail(`${key}: 콘솔 오류 ${text}`);
  });
  await page.goto(`${baseUrl}?type=${encodeURIComponent(type.id)}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });

  let state = await inspectView(page, "#problemView .question-item");
  reportViewFailures(state, key, "문제");
  if (new Set(state.prompts).size !== 3) fail(`${key} 문제: 세 문제가 고유하지 않습니다.`);
  if (!state.fractionCount || state.badFraction) fail(`${key} 문제: 분수 지문의 세로 분수 DOM이 없거나 분자·분모가 겹칩니다.`);
  if (state.solutionVisible || state.solutionItemsInProblem) fail(`${key} 문제: 정답·풀이가 문제 화면에 새어 나옵니다.`);
  await page.screenshot({ path: path.join(outputDir, `${key}-problem.png`), fullPage: true });
  screenshots += 1;

  if (viewportLabel === "desktop") {
    await page.emulateMedia({ media: "print" });
    state = await inspectView(page, "#problemView .question-item");
    reportViewFailures(state, key, "A4 문제");
    if (state.solutionVisible || state.solutionItemsInProblem) fail(`${key} A4 문제: 정답·풀이가 인쇄 문제에 보입니다.`);
    const file = path.join(outputDir, `${key}-problem.pdf`);
    await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (!fs.existsSync(file) || fs.statSync(file).size < 5000) fail(`${key} A4 문제: PDF가 비었거나 생성되지 않았습니다.`);
    pdfs += 1;
    await page.emulateMedia({ media: "screen" });
  }

  await page.click("#solutionTab");
  state = await inspectView(page, "#solutionView .solution-item");
  reportViewFailures(state, key, "정답·풀이");
  if (new Set(state.answers).size !== 3 || state.answers.some(answer => !answer)) fail(`${key} 정답·풀이: 세 정답이 고유하지 않거나 비었습니다.`);
  await page.screenshot({ path: path.join(outputDir, `${key}-solution.png`), fullPage: true });
  screenshots += 1;

  if (viewportLabel === "desktop") {
    await page.emulateMedia({ media: "print" });
    state = await inspectView(page, "#solutionView .solution-item");
    reportViewFailures(state, key, "A4 정답·풀이");
    const file = path.join(outputDir, `${key}-solution.pdf`);
    await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (!fs.existsSync(file) || fs.statSync(file).size < 5000) fail(`${key} A4 정답·풀이: PDF가 비었거나 생성되지 않았습니다.`);
    pdfs += 1;
  }
  await page.close();
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  verifyCatalogContract();
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  await inspectCatalog(browser, { width: 1440, height: 900 }, "desktop");
  await inspectCatalog(browser, { width: 390, height: 844 }, "mobile");
  await inspectLockedRoute(browser);
  for (const difficulty of [-1, 0, 1]) {
    for (const type of publicTypes) {
      await inspectPublicType(browser, type, { width: 1440, height: 900 }, "desktop", difficulty);
      await inspectPublicType(browser, type, { width: 390, height: 844 }, "mobile", difficulty);
    }
  }
  await browser.close();
  if (screenshots !== 122 || pdfs !== 60) fail(`감사 산출물 수가 다릅니다: 화면 ${screenshots}/122, A4 ${pdfs}/60`);
  if (failures.length) throw new Error(failures.join("\n"));
  console.log(`5-1 크기가 같은 분수 U4 E1 브라우저·A4 감사 통과: 공개 10/잠금 1 · 난이도 3 · PC·모바일 60회 · 화면 ${screenshots}장 · A4 ${pdfs}파일 · ${outputDir}`);
})().catch(error => {
  console.error(`5-1 크기가 같은 분수 U4 E1 브라우저·A4 감사 실패: ${error.stack || error}`);
  process.exit(1);
});
