"use strict";

// Browser-only independent audit for 5-1 U5 E4. This file deliberately
// avoids changing generator, curriculum, inventory, release state, or Git.
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { chromium } = require("playwright");

global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-1");
const unit = semester?.units.find(item => item.id === "5-1-u5");
const e4 = unit?.subunits.find(item => item.types?.some(type => type.sourceItemId?.startsWith("5-1-u5-e4-")));
const types = e4?.types || [];
const publicVariants = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 11]);
const lockedVariants = new Set([0, 10]);
const baseUrl = process.env.HSE_URL || "http://127.0.0.1:8878/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(__dirname, "tmp", "5-1-unit-fraction-e4-browser-audit");
const summaryPath = path.join(outputDir, "audit-result.txt");
const failures = [];
let screenshots = 0;
let pdfs = 0;

const fail = message => failures.push(message);
const keyFor = (type, viewport, difficulty) => `${type.sourceItemId}-${viewport}-difficulty-${difficulty}`;
const normalize = value => String(value || "").replace(/\s+/g, " ").trim();

function verifyCatalogContract() {
  if (!unit || !e4) fail("5-1 5단원 단위분수와 부분분수 소단원을 찾지 못했습니다.");
  if (types.length !== 12) fail(`E4 유형 수가 12개가 아닙니다: ${types.length}`);
  const variants = types.map(type => type.variant).sort((a, b) => a - b);
  if (variants.join(",") !== "0,1,2,3,4,5,6,7,8,9,10,11") fail(`E4 원문 분기 목록이 다릅니다: ${variants.join(",")}`);
  for (const type of types) {
    if (!type.sourceItemId?.startsWith("5-1-u5-e4-")) fail(`${type.id}: E4 이외의 유형이 섞였습니다.`);
    if (publicVariants.has(type.variant) && api.generatorKey(type) !== "unitFractionE4") fail(`${type.sourceItemId}: 전용 생성기가 연결되지 않았습니다.`);
    if (!type.sourceVerified || type.sourceTier !== "advanced") fail(`${type.sourceItemId}: 심화 원문 확인 표기가 다릅니다.`);
    if (publicVariants.has(type.variant) && type.reviewLocked) fail(`${type.sourceItemId}: 공개 유형이 잠겨 있습니다.`);
    if (lockedVariants.has(type.variant) && !type.reviewLocked) fail(`${type.sourceItemId}: 다중 답 원문 유형이 공개되어 있습니다.`);
  }
}

function listen(page, label) {
  page.on("pageerror", error => fail(`${label}: 브라우저 오류 ${error.message}`));
  page.on("console", message => {
    const text = message.text();
    if (message.type() === "error" && !/ERR_NETWORK_ACCESS_DENIED|ERR_QUIC_PROTOCOL_ERROR|Failed to load resource:.*404/.test(text)) fail(`${label}: 콘솔 오류 ${text}`);
  });
}

async function chooseUnit(page) {
  await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 90000 });
  await page.click('#gradeFilter [data-grade="5"]');
  await page.click('#termFilter [data-term="1"]');
  await page.selectOption("#unitFilter", "5-1-u5");
}

function clipState(element) {
  if (!element) return true;
  const style = getComputedStyle(element);
  return (["hidden", "clip"].includes(style.overflowX) && element.scrollWidth > element.clientWidth + 1)
    || (["hidden", "clip"].includes(style.overflowY) && element.scrollHeight > element.clientHeight + 1);
}

async function renderedState(page, selector) {
  return page.evaluate(selected => {
    const clips = element => {
      if (!element) return true;
      const style = getComputedStyle(element);
      return (["hidden", "clip"].includes(style.overflowX) && element.scrollWidth > element.clientWidth + 1)
        || (["hidden", "clip"].includes(style.overflowY) && element.scrollHeight > element.clientHeight + 1);
    };
    const nodes = [...document.querySelectorAll(selected)];
    const fractions = nodes.flatMap(node => [...node.querySelectorAll(".math-fraction")]);
    const fractionBad = fractions.some(fraction => {
      const [numerator, denominator] = fraction.children;
      if (!numerator || !denominator) return true;
      const top = numerator.getBoundingClientRect();
      const bottom = denominator.getBoundingClientRect();
      const box = fraction.getBoundingClientRect();
      return top.width < 1 || bottom.width < 1 || box.width < 1 || top.bottom > bottom.top + 1;
    });
    const mixedBad = nodes.flatMap(node => [...node.querySelectorAll(".math-mixed-number")]).some(mixed => {
      const fraction = mixed.querySelector(":scope > .math-fraction");
      if (!fraction) return true;
      const box = mixed.getBoundingClientRect();
      const fractionBox = fraction.getBoundingClientRect();
      return fractionBox.width < 1 || fractionBox.top < box.top - 2 || fractionBox.bottom > box.bottom + 2;
    });
    const answerNodes = nodes.flatMap(node => [...node.querySelectorAll("header strong")]);
    const answerMath = answerNodes.map(answer => ({
      text: answer.innerText,
      html: answer.innerHTML,
      fractionCount: answer.querySelectorAll(".math-fraction").length,
      mixedCount: answer.querySelectorAll(".math-mixed-number").length
    }));
    const checks = [
      ...nodes,
      ...nodes.flatMap(node => [...node.querySelectorAll(".question-prompt, .solution-item p, .equation, .number-cards, .digit-card, .math-fraction, .math-mixed-number")]),
      ...document.querySelectorAll(".print-page")
    ];
    return {
      count: nodes.length,
      empty: nodes.some(node => !node.innerText.trim()),
      pageOverflow: document.documentElement.scrollWidth > innerWidth + 1,
      clipped: checks.some(clips),
      broken: /undefined|null|NaN|Infinity|\$\{/.test(document.body.innerText),
      fractionCount: fractions.length,
      fractionBad,
      mixedBad,
      solutionVisible: !document.querySelector("#solutionView")?.hidden && getComputedStyle(document.querySelector("#solutionView")).display !== "none",
      solutionLeak: document.querySelectorAll("#problemView .solution-item").length > 0,
      answerMath,
      promptHtml: nodes.map(node => node.querySelector(".question-prompt")?.innerHTML || ""),
      promptText: nodes.map(node => node.querySelector(".question-prompt")?.innerText || ""),
      cards: nodes.flatMap(node => [...node.querySelectorAll(".number-cards .digit-card")]).map(card => ({ text: card.innerText, clipped: clips(card) }))
    };
  }, selector);
}

function assertCoreState(state, type, key, view) {
  if (state.pageOverflow) fail(`${key} ${view}: 가로 넘침이 있습니다.`);
  if (state.count !== 3 || state.empty) fail(`${key} ${view}: 생성 문항 3개가 모두 보이지 않습니다.`);
  if (state.clipped) fail(`${key} ${view}: 수식·문항 상자가 잘립니다.`);
  if (state.broken) fail(`${key} ${view}: 깨진 값이 보입니다.`);
  const answerOnlyNumber = new Set([2, 3, 7, 8, 9]).has(type.variant);
  if ((!answerOnlyNumber && state.fractionCount < 1) || state.fractionBad) fail(`${key} ${view}: 분수의 분자·분모 기준선 또는 크기가 비정상입니다.`);
  if (state.mixedBad) fail(`${key} ${view}: 대분수의 자연수와 분수 부분 기준선이 맞지 않습니다.`);
}

function assertAnswerNotation(state, key) {
  for (const [index, answer] of state.answerMath.entries()) {
    const compact = normalize(answer.text);
    const rawFraction = /\b\d+\s*\/\s*\d+\b/.test(compact);
    const rawMixed = /\b\d+\s+\d+\s*\/\s*\d+\b/.test(compact);
    if (rawFraction && answer.fractionCount < 1) fail(`${key} 정답 ${index + 1}: 저장된 분수가 math-fraction 요소로 바뀌지 않았습니다.`);
    if (rawMixed && answer.mixedCount < 1) fail(`${key} 정답 ${index + 1}: 저장된 대분수가 math-mixed-number 요소로 바뀌지 않았습니다.`);
  }
}

function assertSourceShape(state, type, key, difficulty) {
  if (type.variant === 2) {
    for (const html of state.promptHtml) {
      const denominators = [...html.matchAll(/class="math-fraction"[^>]*><span>1<\/span><span>([^<]+)<\/span>/g)].map(match => match[1]);
      if (!["가", "나", "다"].every(symbol => denominators.includes(symbol))) fail(`${key}: 예제 4-1의 세 분모가 가·나·다로 표시되지 않았습니다.`);
      if (denominators.some(denominator => /^\d+$/.test(denominator))) fail(`${key}: 예제 4-1에 실제 분모 답이 문제 화면에 보입니다.`);
    }
  }
  if (type.variant === 4) {
    for (const html of state.promptHtml) {
      const denominators = [...html.matchAll(/class="math-fraction"[^>]*><span>1<\/span><span>(\d+)<\/span>/g)].map(match => Number(match[1]));
      if (denominators.length < 3) fail(`${key}: 예제 4-3의 짝지은 분모 세 항이 모두 보이지 않습니다.`);
      for (let index = 1; index < denominators.length; index += 1) {
        const previousBase = Math.sqrt(denominators[index - 1] + 1) - 1;
        const base = Math.sqrt(denominators[index] + 1) - 1;
        if (Number.isInteger(previousBase) && Number.isInteger(base) && base - previousBase !== 2) fail(`${key}: 예제 4-3 분모 짝의 증가 간격이 두 칸이 아닙니다.`);
      }
    }
  }
  if (type.variant === 7) {
    for (const html of state.promptHtml) {
      const terms = [...html.matchAll(/class="math-fraction"[^>]*><span>1<\/span><span>\d+<\/span>/g)];
      if (terms.length !== 4) fail(`${key}: Mission 2에 원문 분수 차 네 항이 모두 보이지 않습니다.`);
    }
  }
  if (type.variant === 11) {
    if (state.cards.length !== 18) fail(`${key}: 여섯 장 수 카드가 문항 3개에 각각 보이지 않습니다.`);
    for (let index = 0; index < state.cards.length; index += 6) {
      const group = state.cards.slice(index, index + 6);
      if (group.length !== 6 || new Set(group.map(card => normalize(card.text))).size !== 6) fail(`${key}: 여섯 장 수 카드가 중복되었거나 빠졌습니다.`);
      if (group.some(card => card.clipped)) fail(`${key}: 여섯 장 수 카드 중 잘린 카드가 있습니다.`);
    }
  }
}

async function inspectCatalog(browser, viewport, label) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  listen(page, `${label} 목록`);
  await chooseUnit(page);
  const ids = await page.locator("[data-preview-type-id]").evaluateAll(rows => rows.map(row => row.dataset.previewTypeId));
  for (const type of types.filter(type => publicVariants.has(type.variant))) {
    const row = page.locator(`[data-preview-type-id="${type.id}"]`);
    if (!ids.includes(type.id) || await row.count() !== 1) {
      fail(`${label} ${type.sourceItemId}: 공개 유형 목록 행을 찾지 못했습니다.`);
      continue;
    }
    await row.scrollIntoViewIfNeeded();
    await row.click();
    const popover = page.locator("#typePreviewPopover:not([hidden])");
    await popover.waitFor({ state: "visible" });
    const state = await page.evaluate(id => {
      const popover = document.querySelector("#typePreviewPopover:not([hidden])");
      const row = document.querySelector(`[data-preview-type-id="${id}"]`);
      const rect = element => element?.getBoundingClientRect();
      const overlaps = (a, b) => a && b && a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1;
      const clips = element => {
        if (!element) return true;
        const style = getComputedStyle(element);
        return (["hidden", "clip"].includes(style.overflowX) && element.scrollWidth > element.clientWidth + 1)
          || (["hidden", "clip"].includes(style.overflowY) && element.scrollHeight > element.clientHeight + 1);
      };
      const covered = control => {
        const box = rect(control);
        if (!popover || !box || !overlaps(rect(popover), box)) return false;
        return document.elementFromPoint(Math.max(0, Math.min(innerWidth - 1, box.left + box.width / 2)), Math.max(0, Math.min(innerHeight - 1, box.top + box.height / 2)))?.closest("#typePreviewPopover") === popover;
      };
      return {
        text: popover?.innerText || "",
        pageOverflow: document.documentElement.scrollWidth > innerWidth + 1,
        clipped: clips(popover),
        coversRow: overlaps(rect(popover), rect(row)),
        coversControl: [document.querySelector("#generateButton"), document.querySelector("#questionCountInput"), document.querySelector("#difficultyFilter")].some(covered)
      };
    }, type.id);
    if (!state.text.includes(type.label) || !state.text.includes("대표 문제")) fail(`${label} ${type.sourceItemId}: 미리보기 제목 또는 대표 문제가 보이지 않습니다.`);
    if (state.pageOverflow || state.clipped || state.coversRow || state.coversControl) fail(`${label} ${type.sourceItemId}: 미리보기가 화면·선택 행·조작 버튼을 가립니다.`);
    await page.locator("[data-close-type-preview]").click();
  }
  await page.screenshot({ path: path.join(outputDir, `catalog-${label}.png`), fullPage: true });
  screenshots += 1;
  await page.close();
}

async function inspectLocked(browser, type) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  listen(page, `${type.sourceItemId} 잠금`);
  await page.goto(`${baseUrl}?type=${encodeURIComponent(type.id)}&review=1&difficulty=0`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(300);
  const state = await page.evaluate(() => ({
    worksheet: !document.querySelector("#worksheet")?.hidden,
    selected: document.querySelector("#selectedTypeCount")?.textContent.trim(),
    questions: document.querySelectorAll("#problemView .question-item").length,
    lockedRows: [...document.querySelectorAll("input[data-type-id]")].filter(input => input.disabled).length
  }));
  if (state.worksheet || state.selected !== "0" || state.questions !== 0 || state.lockedRows < 2) fail(`${type.sourceItemId}: 잠금 유형이 UI에서 출제 가능한 상태입니다.`);
  await page.close();
}

async function renderPdfPreview(pdfPath, pngPath) {
  try {
    execFileSync("pdftoppm", ["-f", "1", "-l", "1", "-png", "-singlefile", pdfPath, pngPath.replace(/\.png$/, "")], { stdio: "ignore" });
    if (!fs.existsSync(pngPath) || fs.statSync(pngPath).size < 5000) fail(`${path.basename(pdfPath)}: A4 PDF 렌더 PNG가 비정상입니다.`);
  } catch (error) {
    fail(`${path.basename(pdfPath)}: A4 PDF 렌더를 만들지 못했습니다 (${error.message}).`);
  }
}

async function inspectType(browser, type, viewport, viewportLabel, difficulty) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  const key = keyFor(type, viewportLabel, difficulty);
  listen(page, key);
  await page.goto(`${baseUrl}?type=${encodeURIComponent(type.id)}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
  const selected = await page.evaluate(() => ({ count: document.querySelector("#selectedTypeCount")?.textContent.trim(), rows: document.querySelectorAll("#reviewSelectedTypes > div").length, questions: document.querySelectorAll("#reviewQuestionList a").length }));
  if (selected.count !== "1" || selected.rows !== 1 || selected.questions !== 3) fail(`${key}: 한 유형의 3문항 화면을 만들지 못했습니다.`);

  let state = await renderedState(page, "#problemView .question-item");
  assertCoreState(state, type, key, "문제");
  if (state.solutionVisible || state.solutionLeak) fail(`${key} 문제: 정답·풀이가 문제 화면에 섞였습니다.`);
  assertSourceShape(state, type, key, difficulty);
  await page.screenshot({ path: path.join(outputDir, `${key}-problem.png`), fullPage: true });
  screenshots += 1;

  if (viewportLabel === "desktop") {
    await page.emulateMedia({ media: "print" });
    state = await renderedState(page, "#problemView .question-item");
    assertCoreState(state, type, key, "A4 문제");
    if (state.solutionVisible || state.solutionLeak) fail(`${key} A4 문제: 정답·풀이가 문제지에 섞였습니다.`);
    assertSourceShape(state, type, key, difficulty);
    const pdf = path.join(outputDir, `${key}-problem.pdf`);
    const png = path.join(outputDir, `${key}-problem-a4.png`);
    await page.screenshot({ path: png, fullPage: true });
    screenshots += 1;
    await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (!fs.existsSync(pdf) || fs.statSync(pdf).size < 5000) fail(`${key} A4 문제: PDF 생성이 비정상입니다.`);
    else await renderPdfPreview(pdf, path.join(outputDir, `${key}-problem-pdf-page-1.png`));
    pdfs += 1;
    await page.emulateMedia({ media: "screen" });
  }

  await page.click("#solutionTab");
  state = await renderedState(page, "#solutionView .solution-item");
  assertCoreState(state, type, key, "정답·풀이");
  if (!state.solutionVisible || state.answerMath.length !== 3 || state.answerMath.some(answer => !normalize(answer.text))) fail(`${key} 정답·풀이: 세 문항의 정답이 모두 보이지 않습니다.`);
  assertAnswerNotation(state, key);
  await page.screenshot({ path: path.join(outputDir, `${key}-solution.png`), fullPage: true });
  screenshots += 1;

  if (viewportLabel === "desktop") {
    await page.emulateMedia({ media: "print" });
    state = await renderedState(page, "#solutionView .solution-item");
    assertCoreState(state, type, key, "A4 정답·풀이");
    if (state.answerMath.length !== 3 || state.answerMath.some(answer => !normalize(answer.text))) fail(`${key} A4 정답·풀이: 세 문항의 정답이 모두 보이지 않습니다.`);
    assertAnswerNotation(state, key);
    const pdf = path.join(outputDir, `${key}-solution.pdf`);
    const png = path.join(outputDir, `${key}-solution-a4.png`);
    await page.screenshot({ path: png, fullPage: true });
    screenshots += 1;
    await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (!fs.existsSync(pdf) || fs.statSync(pdf).size < 5000) fail(`${key} A4 정답·풀이: PDF 생성이 비정상입니다.`);
    else await renderPdfPreview(pdf, path.join(outputDir, `${key}-solution-pdf-page-1.png`));
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
    for (const type of types.filter(type => lockedVariants.has(type.variant))) await inspectLocked(browser, type);
    for (const difficulty of [-1, 0, 1]) {
      for (const type of types.filter(type => publicVariants.has(type.variant))) {
        await inspectType(browser, type, { width: 1440, height: 900 }, "desktop", difficulty);
        await inspectType(browser, type, { width: 390, height: 844 }, "mobile", difficulty);
      }
    }
  } finally {
    await browser.close();
  }
  if (screenshots !== 182 || pdfs !== 60) fail(`검수 산출물 수가 다릅니다: 화면 ${screenshots}/182, A4 ${pdfs}/60`);
  if (failures.length) {
    fs.writeFileSync(summaryPath, `실패:\n${failures.join("\n")}\n`, "utf8");
    throw new Error(failures.join("\n"));
  }
  fs.writeFileSync(summaryPath, `통과: 화면 ${screenshots}장 · A4 PDF ${pdfs}개\n`, "utf8");
  console.log(`5-1 5단원 E4 단위분수와 부분분수 브라우저·A4 감사 통과: 공개 10유형 · 난이도 3단계 · PC/모바일 화면 ${screenshots}장 · A4 문제·정답 ${pdfs}개 · ${outputDir}`);
})().catch(error => {
  console.error(`5-1 5단원 E4 단위분수와 부분분수 브라우저·A4 감사 실패: ${error.stack || error}`);
  process.exit(1);
});
