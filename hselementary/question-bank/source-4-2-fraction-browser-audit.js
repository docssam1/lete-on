"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

global.window = {};
require("./curriculum.js");

const baseUrl = process.env.HSE_URL || "http://127.0.0.1:8878/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(process.cwd(), "tmp", "4-2-fraction-browser-audit");
const expectedSourceTypes = Number(process.env.HSE_EXPECTED_SOURCE_TYPES || 66);
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "4-2");
const unit = semester.units.find(item => item.id === "4-2-u1");
const sourceTypes = unit.subunits.flatMap(subunit => subunit.types).filter(type => type.sourceItemId?.startsWith("4-2-fraction-"));

fs.mkdirSync(outputDir, { recursive: true });

async function inspectQuestion(browser, type, viewport, label, failures) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  page.on("pageerror", error => failures.push(`${label} ${type.id}: 브라우저 오류 ${error.message}`));
  page.on("console", message => {
    if (message.type() === "error") failures.push(`${label} ${type.id}: 콘솔 오류 ${message.text()}`);
  });

  const url = `${baseUrl}?type=${encodeURIComponent(type.id)}&review=1`;
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });

  const state = await page.evaluate(() => {
    const question = document.querySelector(".question-item");
    const prompt = question?.querySelector(".question-prompt");
    const promptTexts = [...document.querySelectorAll(".question-item .question-prompt")]
      .map(item => item.textContent?.replace(/\s+/g, " ").trim())
      .filter(Boolean);
    const fractions = [...(question?.querySelectorAll(".math-fraction") || [])];
    const fractionOverlap = fractions.some(fraction => {
      const numerator = fraction.children[0]?.getBoundingClientRect();
      const denominator = fraction.children[1]?.getBoundingClientRect();
      return !numerator || !denominator || numerator.bottom > denominator.top + 0.5;
    });
    const clipped = element => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const clipsX = ["hidden", "clip", "auto", "scroll"].includes(style.overflowX);
      const clipsY = ["hidden", "clip", "auto", "scroll"].includes(style.overflowY);
      return (clipsX && element.scrollWidth > element.clientWidth + 1) || (clipsY && element.scrollHeight > element.clientHeight + 1);
    };
    return {
      documentOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      questionOverflow: clipped(question),
      promptOverflow: clipped(prompt),
      promptMetrics: prompt ? `${prompt.scrollWidth}x${prompt.scrollHeight}/${prompt.clientWidth}x${prompt.clientHeight}` : "missing",
      fractionCount: fractions.length,
      fractionOverlap,
      answerVisible: Boolean(question?.querySelector(".answer-line")),
      uniquePromptCount: new Set(promptTexts).size,
      questionText: prompt?.textContent?.trim() || ""
    };
  });

  if (state.documentOverflow) failures.push(`${label} ${type.id}: 문서에 가로 넘침이 있습니다.`);
  if (state.questionOverflow) failures.push(`${label} ${type.id}: 문제 상자가 잘립니다.`);
  if (state.promptOverflow) failures.push(`${label} ${type.id}: 문제 내용이 잘립니다. (${state.promptMetrics})`);
  if (!state.fractionCount) failures.push(`${label} ${type.id}: 세로 분수가 렌더되지 않았습니다.`);
  if (state.fractionOverlap) failures.push(`${label} ${type.id}: 분자와 분모가 겹칩니다.`);
  if (!state.answerVisible) failures.push(`${label} ${type.id}: 정답 영역이 보이지 않습니다.`);
  if (state.uniquePromptCount < 2) failures.push(`${label} ${type.id}: 같은 유형의 세 문제가 모두 같습니다.`);
  if (!state.questionText) failures.push(`${label} ${type.id}: 문제 내용이 비었습니다.`);

  await page.click("#solutionTab");
  const solutionState = await page.evaluate(() => {
    const solution = document.querySelector(".solution-item");
    const fractions = [...(solution?.querySelectorAll(".math-fraction") || [])];
    const fractionOverlap = fractions.some(fraction => {
      const numerator = fraction.children[0]?.getBoundingClientRect();
      const denominator = fraction.children[1]?.getBoundingClientRect();
      return !numerator || !denominator || numerator.bottom > denominator.top + 0.5;
    });
    return {
      present: Boolean(solution),
      overflow: Boolean(solution && (() => {
        const style = getComputedStyle(solution);
        const clipsX = ["hidden", "clip", "auto", "scroll"].includes(style.overflowX);
        const clipsY = ["hidden", "clip", "auto", "scroll"].includes(style.overflowY);
        return (clipsX && solution.scrollWidth > solution.clientWidth + 1) || (clipsY && solution.scrollHeight > solution.clientHeight + 1);
      })()),
      fractionOverlap,
      text: solution?.textContent?.trim() || ""
    };
  });
  if (!solutionState.present || !solutionState.text) failures.push(`${label} ${type.id}: 정답·풀이가 비었습니다.`);
  if (solutionState.overflow) failures.push(`${label} ${type.id}: 정답·풀이 상자가 잘립니다.`);
  if (solutionState.fractionOverlap) failures.push(`${label} ${type.id}: 풀이의 분자와 분모가 겹칩니다.`);

  if (type === sourceTypes[0] || type === sourceTypes[sourceTypes.length - 1]) {
    await page.screenshot({ path: path.join(outputDir, `${type.sourceItemId}-${label}.png`), fullPage: true });
  }
  await page.close();
}

(async () => {
  const failures = [];
  if (sourceTypes.length !== expectedSourceTypes) failures.push(`현재 공개된 4-2 분수 원문 유형은 ${expectedSourceTypes}개여야 하나 ${sourceTypes.length}개입니다.`);
  const browser = await chromium.launch({ headless: true });
  for (const type of sourceTypes) {
    await inspectQuestion(browser, type, { width: 1440, height: 900 }, "desktop", failures);
    await inspectQuestion(browser, type, { width: 390, height: 844 }, "mobile", failures);
  }
  await browser.close();

  if (failures.length) {
    console.error(`4-2 분수 브라우저 감사 실패: ${failures.length}건`);
    console.error(failures.join("\n"));
    process.exit(1);
  }
  console.log(`4-2 분수 브라우저 감사 통과: 원문 ${sourceTypes.length}유형 · PC/모바일 ${sourceTypes.length * 2}화면 · 가로 넘침·잘림·분수 겹침 0 · ${outputDir}`);
})().catch(error => {
  console.error(error);
  process.exit(1);
});
