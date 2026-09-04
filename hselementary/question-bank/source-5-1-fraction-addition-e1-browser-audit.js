"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-1");
const unit = semester?.units.find(item => item.id === "5-1-u5");
const addition = unit?.subunits.find(item => item.id === "5-1-u5-s1");
const types = addition?.types || [];
const baseUrl = process.env.HSE_URL || "http://127.0.0.1:8878/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(__dirname, "tmp", "5-1-fraction-addition-e1-browser-audit");
const failures = [];
let screenshots = 0;
let pdfs = 0;

const expectedIds = [
  "5-1-u5-e1-exploration-proper-addition",
  "5-1-u5-e1-exploration-mixed-addition",
  "5-1-u5-e1-example-1-1-1",
  "5-1-u5-e1-example-1-1-2",
  "5-1-u5-e1-example-1-1-3",
  "5-1-u5-e1-example-1-2",
  "5-1-u5-e1-example-1-3",
  "5-1-u5-e1-example-1-4",
  "5-1-u5-e1-mission-1-proper-two-term",
  "5-1-u5-e1-mission-1-mixed-two-term",
  "5-1-u5-e1-mission-1-proper-three-term",
  "5-1-u5-e1-mission-2",
  "5-1-u5-e1-mission-3",
  "5-1-u5-e1-mission-4",
  "5-1-u5-e1-mission-5",
  "5-1-u5-e1-mission-6"
];

const fail = message => failures.push(message);
const keyFor = (type, viewport, difficulty) => `${type.sourceItemId}-${viewport}-difficulty-${difficulty}`;

function verifyCatalogContract() {
  if (!unit || !addition) fail("5-1 5단원 분수의 덧셈 소단원을 찾지 못했습니다.");
  if (types.length !== 16) fail(`분수의 덧셈 유형 수가 16개가 아닙니다: ${types.length}`);
  if (types.filter(type => type.reviewLocked).length) fail("분수의 덧셈 E1에는 잠금 유형이 없어야 합니다.");
  if (expectedIds.some((id, index) => types[index]?.sourceItemId !== id)) fail("16개 원문 유형의 순서 또는 출처 ID가 다릅니다.");
  for (const type of types) {
    if (api.generatorKey(type) !== "fractionAdditionE1") fail(`${type.sourceItemId}: 전용 생성기가 연결되지 않았습니다.`);
    if (!type.sourceVerified || type.sourceTier !== "advanced") fail(`${type.sourceItemId}: 심화 원문 확인 상태가 다릅니다.`);
  }
}

function listenForPageErrors(page, label) {
  page.on("pageerror", error => fail(`${label}: 브라우저 오류 ${error.message}`));
  page.on("console", message => {
    const text = message.text();
    if (message.type() === "error" && !/ERR_NETWORK_ACCESS_DENIED|Failed to load resource:.*404/.test(text)) {
      fail(`${label}: 콘솔 오류 ${text}`);
    }
  });
}

async function chooseUnit(page) {
  await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 90000 });
  await page.click('#gradeFilter [data-grade="5"]');
  await page.click('#termFilter [data-term="1"]');
  await page.selectOption("#unitFilter", "5-1-u5");
}

async function inspectCatalog(browser, viewport, label) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  listenForPageErrors(page, `${label} 목록`);
  await chooseUnit(page);

  const ids = await page.locator("[data-preview-type-id]").evaluateAll(rows => rows
    .map(row => row.dataset.previewTypeId)
    .filter(id => id && ["5-1-u5-t1", ...Array.from({ length: 15 }, (_, index) => `5-1-u5-t1-${index + 2}`)].includes(id)));
  if (ids.length !== 16 || new Set(ids).size !== 16 || types.some(type => !ids.includes(type.id))) {
    fail(`${label} 목록: 16개 원문 유형이 각각 한 줄로 보이지 않습니다.`);
  }

  for (const type of types) {
    const row = page.locator(`[data-preview-type-id="${type.id}"]`);
    if (await row.count() !== 1) {
      fail(`${label} ${type.sourceItemId}: 목록 행을 찾지 못했습니다.`);
      continue;
    }
    if (await row.locator("input[data-type-id]").isDisabled()) fail(`${label} ${type.sourceItemId}: 공개 유형 체크가 비활성화되었습니다.`);
    await row.scrollIntoViewIfNeeded();
    await row.click();
    const popover = page.locator("#typePreviewPopover:not([hidden])");
    await popover.waitFor({ state: "visible" });
    const state = await page.evaluate(id => {
      const popover = document.querySelector("#typePreviewPopover:not([hidden])");
      const row = document.querySelector(`[data-preview-type-id="${id}"]`);
      const rect = element => element?.getBoundingClientRect();
      const intersects = (a, b) => a && b && a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1;
      const clips = element => {
        if (!element) return true;
        const style = getComputedStyle(element);
        return (["hidden", "clip"].includes(style.overflowX) && element.scrollWidth > element.clientWidth + 1)
          || (["hidden", "clip"].includes(style.overflowY) && element.scrollHeight > element.clientHeight + 1);
      };
      const controlCovered = control => {
        const controlRect = rect(control);
        if (!controlRect || !popover || !intersects(rect(popover), controlRect)) return false;
        const x = Math.max(0, Math.min(innerWidth - 1, controlRect.left + controlRect.width / 2));
        const y = Math.max(0, Math.min(innerHeight - 1, controlRect.top + controlRect.height / 2));
        return document.elementFromPoint(x, y)?.closest("#typePreviewPopover") === popover;
      };
      return {
        text: popover?.innerText || "",
        pageOverflow: document.documentElement.scrollWidth > innerWidth + 1,
        clipped: clips(popover),
        coversSelectedRow: intersects(rect(popover), rect(row)),
        coversControl: [document.querySelector("#generateButton"), document.querySelector("#questionCountInput"), document.querySelector("#difficultyFilter")].some(controlCovered)
      };
    }, type.id);
    if (!state.text.includes(type.label)) fail(`${label} ${type.sourceItemId}: 미리보기 제목이 다릅니다.`);
    if (!state.text.includes("대표 문제")) fail(`${label} ${type.sourceItemId}: 대표 문제가 보이지 않습니다.`);
    if (state.pageOverflow || state.clipped || state.coversSelectedRow || state.coversControl) {
      fail(`${label} ${type.sourceItemId}: 미리보기가 잘리거나 선택 행·조작 버튼을 가립니다.`);
    }
    await page.locator("[data-close-type-preview]").click();
  }
  await page.screenshot({ path: path.join(outputDir, `catalog-${label}.png`), fullPage: true });
  screenshots += 1;
  await page.close();
}

async function renderedState(page, selector) {
  return page.evaluate(selected => {
    const nodes = [...document.querySelectorAll(selected)];
    const clipped = element => {
      const style = getComputedStyle(element);
      return (["hidden", "clip"].includes(style.overflowX) && element.scrollWidth > element.clientWidth + 1)
        || (["hidden", "clip"].includes(style.overflowY) && element.scrollHeight > element.clientHeight + 1);
    };
    const checkNodes = [
      ...nodes,
      ...nodes.flatMap(node => [...node.querySelectorAll(".question-prompt, .solution-item p, .equation, .number-cards, .sequence, .math-mixed-number")]),
      ...[...document.querySelectorAll(".print-page")]
    ];
    const fractions = nodes.flatMap(node => [...node.querySelectorAll(".math-fraction")]);
    const fractionBad = fractions.some(fraction => {
      const [numerator, denominator] = fraction.children;
      if (!numerator || !denominator) return true;
      const top = numerator.getBoundingClientRect();
      const bottom = denominator.getBoundingClientRect();
      return top.width < 1 || bottom.width < 1 || top.bottom > bottom.top + 1;
    });
    const expectedRows = nodes.map(node => node.querySelector("header b")?.textContent.trim() || "");
    const mixed = [...document.querySelectorAll(".math-mixed-number")].map(node => {
      const first = node.children[0];
      const fraction = node.querySelector(":scope > .math-fraction");
      return {
        symbol: first?.textContent.trim() || "",
        directFraction: Boolean(fraction),
        numerator: fraction?.children[0]?.textContent.trim() || "",
        denominator: fraction?.children[1]?.textContent.trim() || ""
      };
    });
    return {
      count: nodes.length,
      empty: nodes.some(node => !node.innerText.trim()),
      pageOverflow: document.documentElement.scrollWidth > innerWidth + 1,
      clipped: checkNodes.some(clipped),
      broken: /undefined|null|NaN|Infinity|\$\{/.test(document.body.innerText),
      fractionCount: fractions.length,
      fractionBad,
      prompts: nodes.map(node => node.querySelector(".question-prompt")?.innerText.replace(/\s+/g, " ").trim() || ""),
      answers: nodes.map(node => node.querySelector("header strong")?.innerText.replace(/\s+/g, " ").trim() || ""),
      rows: expectedRows,
      solutionVisible: !document.querySelector("#solutionView")?.hidden && getComputedStyle(document.querySelector("#solutionView")).display !== "none",
      solutionLeak: document.querySelectorAll("#problemView .solution-item").length > 0,
      cardCount: document.querySelectorAll(".number-cards .number-card").length,
      groupedEquation: [...document.querySelectorAll(".equation")].some(node => node.innerText.includes("1/2") || node.querySelectorAll(".math-fraction").length >= 8),
      mixed
    };
  }, selector);
}

function reportState(state, type, key, view) {
  if (state.pageOverflow) fail(`${key} ${view}: 가로 넘침이 있습니다.`);
  if (state.count !== 3 || state.empty) fail(`${key} ${view}: 생성 문항 3개가 모두 보이지 않습니다.`);
  if (state.clipped) fail(`${key} ${view}: 가로 또는 세로로 잘린 수식·문항 상자가 있습니다.`);
  if (state.broken) fail(`${key} ${view}: 깨진 값이 보입니다.`);
  const needsFraction = view.includes("문제")
    ? type.sourceItemId !== "5-1-u5-e1-example-1-2"
    : type.sourceItemId !== "5-1-u5-e1-example-1-4";
  if (needsFraction && (state.fractionCount < 1 || state.fractionBad)) fail(`${key} ${view}: 분수의 분자·분모가 세로 구조로 보이지 않습니다.`);
}

function checkSourceSpecificLayout(type, state, key, view) {
  if (type.sourceItemId === "5-1-u5-e1-example-1-2" && view.includes("문제") && state.cardCount !== 18) {
    fail(`${key} ${view}: 수 카드 6장이 독립된 카드 모양으로 보이지 않습니다.`);
  }
  if (["5-1-u5-e1-example-1-1-3", "5-1-u5-e1-mission-6"].includes(type.sourceItemId) && view.includes("문제") && !state.groupedEquation) {
    fail(`${key} ${view}: 긴 분모별 묶음 수열의 수식 구조를 찾지 못했습니다.`);
  }
  if (type.sourceItemId === "5-1-u5-e1-mission-3" && view.includes("문제")) {
    const symbols = state.mixed.filter(item => item.symbol === "㉠");
    if (!symbols.length || symbols.some(item => !item.directFraction || item.numerator.includes("㉠") || !item.numerator || !item.denominator)) {
      fail(`${key} ${view}: ㉠이 분자에 들어가거나 대분수의 분수 부분과 분리되어 보입니다.`);
    }
  }
}

async function inspectType(browser, type, viewport, viewportLabel, difficulty) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  const key = keyFor(type, viewportLabel, difficulty);
  page.setDefaultTimeout(60000);
  listenForPageErrors(page, key);
  await page.goto(`${baseUrl}?type=${encodeURIComponent(type.id)}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });

  const selected = await page.evaluate(() => ({
    count: document.querySelector("#selectedTypeCount")?.textContent.trim(),
    reviewRows: document.querySelectorAll("#reviewSelectedTypes > div").length,
    questionRows: document.querySelectorAll("#reviewQuestionList a").length
  }));
  if (selected.count !== "1" || selected.reviewRows !== 1 || selected.questionRows !== 3) {
    fail(`${key}: 한 유형만 선택했을 때의 선택 목록 또는 문항 수가 다릅니다.`);
  }

  let state = await renderedState(page, "#problemView .question-item");
  reportState(state, type, key, "문제");
  if (state.solutionVisible || state.solutionLeak) fail(`${key} 문제: 정답·풀이가 문제 화면에 섞였습니다.`);
  checkSourceSpecificLayout(type, state, key, "문제");
  await page.screenshot({ path: path.join(outputDir, `${key}-problem.png`), fullPage: true });
  screenshots += 1;

  if (difficulty === 0 && viewportLabel === "desktop") {
    await page.emulateMedia({ media: "print" });
    state = await renderedState(page, "#problemView .question-item");
    reportState(state, type, key, "A4 문제");
    if (state.solutionVisible || state.solutionLeak) fail(`${key} A4 문제: 정답·풀이가 문제지에 섞였습니다.`);
    checkSourceSpecificLayout(type, state, key, "A4 문제");
    const pdf = path.join(outputDir, `${type.sourceItemId}-problem.pdf`);
    await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (!fs.existsSync(pdf) || fs.statSync(pdf).size < 5000) fail(`${key} A4 문제: PDF 생성이 비정상입니다.`);
    pdfs += 1;
    await page.emulateMedia({ media: "screen" });
  }

  await page.click("#solutionTab");
  state = await renderedState(page, "#solutionView .solution-item");
  reportState(state, type, key, "정답·풀이");
  if (!state.solutionVisible) fail(`${key} 정답·풀이: 정답 탭이 열리지 않습니다.`);
  if (state.rows.join(",") !== "1,2,3" || state.answers.some(answer => !answer)) {
    fail(`${key} 정답·풀이: 생성 문항마다 정확히 한 줄의 정답·풀이가 없습니다.`);
  }
  checkSourceSpecificLayout(type, state, key, "정답·풀이");
  await page.screenshot({ path: path.join(outputDir, `${key}-solution.png`), fullPage: true });
  screenshots += 1;

  if (difficulty === 0 && viewportLabel === "desktop") {
    await page.emulateMedia({ media: "print" });
    state = await renderedState(page, "#solutionView .solution-item");
    reportState(state, type, key, "A4 정답·풀이");
    if (state.rows.join(",") !== "1,2,3") fail(`${key} A4 정답·풀이: 문항별 정답 행 수가 다릅니다.`);
    checkSourceSpecificLayout(type, state, key, "A4 정답·풀이");
    const pdf = path.join(outputDir, `${type.sourceItemId}-solution.pdf`);
    await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (!fs.existsSync(pdf) || fs.statSync(pdf).size < 5000) fail(`${key} A4 정답·풀이: PDF 생성이 비정상입니다.`);
    pdfs += 1;
  }
  await page.close();
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  verifyCatalogContract();
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  try {
    await inspectCatalog(browser, { width: 1440, height: 900 }, "desktop");
    await inspectCatalog(browser, { width: 390, height: 844 }, "mobile");
    for (const difficulty of [-1, 0, 1]) {
      for (const type of types) {
        await inspectType(browser, type, { width: 1440, height: 900 }, "desktop", difficulty);
        await inspectType(browser, type, { width: 390, height: 844 }, "mobile", difficulty);
      }
    }
  } finally {
    await browser.close();
  }
  if (screenshots !== 194 || pdfs !== 32) fail(`검수 산출물 수가 다릅니다: 화면 ${screenshots}/194, A4 ${pdfs}/32`);
  if (failures.length) throw new Error(failures.join("\n"));
  console.log(`5-1 분수의 덧셈 E1 브라우저·A4 감사 통과: 16유형 · 난이도 3단계 · PC/모바일 화면 ${screenshots}장 · A4 문제·정답 ${pdfs}개 · ${outputDir}`);
})().catch(error => {
  console.error(`5-1 분수의 덧셈 E1 브라우저·A4 감사 실패: ${error.stack || error}`);
  process.exit(1);
});
