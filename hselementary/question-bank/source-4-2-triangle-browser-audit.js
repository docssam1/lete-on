"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

global.window = {};
require("./curriculum.js");

const baseUrl = process.env.HSE_URL || "http://127.0.0.1:8878/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(process.cwd(), "tmp", "4-2-triangle-browser-audit");
const expectedSourceTypes = Number(process.env.HSE_EXPECTED_SOURCE_TYPES || 31);
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "4-2");
const unit = semester.units.find(item => item.id === "4-2-u2");
const sourceTypes = unit.subunits
  .flatMap(subunit => subunit.types)
  .filter(type => type.sourceItemId?.startsWith("4-2-triangle-") && type.generatorKey && !type.reviewLocked);

fs.mkdirSync(outputDir, { recursive: true });

async function inspectQuestion(browser, type, viewport, label, failures) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  page.on("pageerror", error => failures.push(`${label} ${type.id}: 브라우저 오류 ${error.message}`));
  page.on("console", message => {
    if (message.type() === "error" && !message.text().includes("Failed to load resource")) failures.push(`${label} ${type.id}: 콘솔 오류 ${message.text()}`);
  });

  const url = `${baseUrl}?type=${encodeURIComponent(type.id)}&review=1`;
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });

  const state = await page.evaluate(() => {
    const clipped = element => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const clipsX = ["hidden", "clip", "auto", "scroll"].includes(style.overflowX);
      const clipsY = ["hidden", "clip", "auto", "scroll"].includes(style.overflowY);
      return (clipsX && element.scrollWidth > element.clientWidth + 1) || (clipsY && element.scrollHeight > element.clientHeight + 1);
    };
    const fractionOverlap = root => [...root.querySelectorAll(".math-fraction")].some(fraction => {
      const numerator = fraction.children[0]?.getBoundingClientRect();
      const denominator = fraction.children[1]?.getBoundingClientRect();
      return !numerator || !denominator || numerator.bottom > denominator.top + 0.5;
    });
    const svgState = root => [...root.querySelectorAll("svg")].map(svg => {
      const box = svg.getBoundingClientRect();
      const drawable = svg.querySelector("path, polygon, polyline, line, circle, ellipse, rect, text, image, use");
      const labels = [...svg.querySelectorAll("text")].map(text => {
        let rect;
        try { rect = text.getBBox(); } catch { rect = { x: 0, y: 0, width: 0, height: 0 }; }
        return { text: text.textContent?.replace(/\s+/g, " ").trim() || "", left: rect.x, right: rect.x + rect.width, top: rect.y, bottom: rect.y + rect.height };
      }).filter(label => label.right > label.left && label.bottom > label.top);
      const labelOverlap = (() => {
        for (let left = 0; left < labels.length; left += 1) for (let right = left + 1; right < labels.length; right += 1) {
          const a = labels[left];
          const b = labels[right];
          const width = Math.min(a.right, b.right) - Math.max(a.left, b.left);
          const height = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          if (width > 2 && height > 2) return `${a.text || "표기"} / ${b.text || "표기"}`;
        }
        return "";
      })();
      return { empty: !drawable || box.width < 2 || box.height < 2, clipped: clipped(svg), labelOverlap };
    });
    const questions = [...document.querySelectorAll(".question-item")];
    const promptSignatures = questions.map(question => {
      const prompt = question.querySelector(".question-prompt");
      return `${prompt?.textContent?.replace(/\s+/g, " ").trim() || ""}\n${prompt?.innerHTML?.replace(/\s+/g, " ").trim() || ""}`;
    });
    return {
      documentOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      questionCount: questions.length,
      uniquePromptCount: new Set(promptSignatures.filter(signature => signature.trim())).size,
      questions: questions.map(question => {
        const prompt = question.querySelector(".question-prompt");
        const answer = question.querySelector(".answer-line");
        return {
          promptText: prompt?.textContent?.replace(/\s+/g, " ").trim() || "",
          questionOverflow: clipped(question),
          promptOverflow: clipped(prompt),
          answerVisible: Boolean(answer && answer.getBoundingClientRect().width > 0 && answer.getBoundingClientRect().height > 0 && answer.textContent?.trim()),
          fractionOverlap: fractionOverlap(question),
          svgs: svgState(question)
        };
      })
    };
  });

  if (state.documentOverflow) failures.push(`${label} ${type.id}: 문서에 가로 넘침이 있습니다.`);
  if (state.questionCount !== 3) failures.push(`${label} ${type.id}: 생성된 문제 수가 ${state.questionCount}개입니다. 3개여야 합니다.`);
  if (state.uniquePromptCount < 2) failures.push(`${label} ${type.id}: 세 문제의 문구가 충분히 달라지지 않았습니다.`);
  state.questions.forEach((question, index) => {
    const number = index + 1;
    if (!question.promptText) failures.push(`${label} ${type.id} ${number}번: 문제 내용이 비었습니다.`);
    if (question.questionOverflow) failures.push(`${label} ${type.id} ${number}번: 문항 상자가 잘립니다.`);
    if (question.promptOverflow) failures.push(`${label} ${type.id} ${number}번: 문제 내용이 잘립니다.`);
    if (!question.answerVisible) failures.push(`${label} ${type.id} ${number}번: 답안 표시가 보이지 않습니다.`);
    if (question.fractionOverlap) failures.push(`${label} ${type.id} ${number}번: 세로 분수의 분자와 분모가 겹칩니다.`);
    question.svgs.forEach((svg, svgIndex) => {
      if (svg.empty) failures.push(`${label} ${type.id} ${number}번: ${svgIndex + 1}번째 SVG가 비어 있거나 크기가 없습니다.`);
      if (svg.clipped) failures.push(`${label} ${type.id} ${number}번: ${svgIndex + 1}번째 SVG가 잘립니다.`);
      if (svg.labelOverlap) failures.push(`${label} ${type.id} ${number}번: SVG 수학 표기가 겹칩니다. (${svg.labelOverlap})`);
    });
  });

  await page.click("#solutionTab");
  const solutionState = await page.evaluate(() => {
    const clipped = element => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const clipsX = ["hidden", "clip", "auto", "scroll"].includes(style.overflowX);
      const clipsY = ["hidden", "clip", "auto", "scroll"].includes(style.overflowY);
      return (clipsX && element.scrollWidth > element.clientWidth + 1) || (clipsY && element.scrollHeight > element.clientHeight + 1);
    };
    const fractionOverlap = root => [...root.querySelectorAll(".math-fraction")].some(fraction => {
      const numerator = fraction.children[0]?.getBoundingClientRect();
      const denominator = fraction.children[1]?.getBoundingClientRect();
      return !numerator || !denominator || numerator.bottom > denominator.top + 0.5;
    });
    const solutions = [...document.querySelectorAll(".solution-item")];
    return solutions.map(solution => ({
      text: solution.textContent?.replace(/\s+/g, " ").trim() || "",
      answer: solution.querySelector("header strong")?.textContent?.replace(/\s+/g, " ").trim() || "",
      overflow: clipped(solution),
      fractionOverlap: fractionOverlap(solution)
    }));
  });
  if (solutionState.length !== 3) failures.push(`${label} ${type.id}: 정답·풀이가 ${solutionState.length}개입니다. 3개여야 합니다.`);
  solutionState.forEach((solution, index) => {
    const number = index + 1;
    if (!solution.text || !solution.answer) failures.push(`${label} ${type.id} ${number}번: 정답·풀이 또는 답안 표시가 비었습니다.`);
    if (solution.overflow) failures.push(`${label} ${type.id} ${number}번: 정답·풀이 상자가 잘립니다.`);
    if (solution.fractionOverlap) failures.push(`${label} ${type.id} ${number}번: 풀이의 세로 분수가 겹칩니다.`);
  });

  if (type === sourceTypes[0] || type === sourceTypes[sourceTypes.length - 1]) {
    await page.screenshot({ path: path.join(outputDir, `${type.sourceItemId}-${label}.png`), fullPage: true });
  }
  await page.close();
}

(async () => {
  const failures = [];
  if (sourceTypes.length !== expectedSourceTypes) failures.push(`현재 공개된 4-2 삼각형 원문 유형은 ${expectedSourceTypes}개여야 하나 ${sourceTypes.length}개입니다.`);
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined
  });
  for (const type of sourceTypes) {
    await inspectQuestion(browser, type, { width: 1280, height: 900 }, "desktop", failures);
    await inspectQuestion(browser, type, { width: 375, height: 812 }, "mobile", failures);
  }
  await browser.close();

  if (failures.length) {
    console.error(`4-2 삼각형 브라우저 감사 실패: ${failures.length}건`);
    console.error(failures.join("\n"));
    process.exit(1);
  }
  console.log(`4-2 삼각형 브라우저 감사 통과: 원문 ${sourceTypes.length}유형 · PC/모바일 ${sourceTypes.length * 2}화면 · 세 문제·도형 SVG·수학 표기·답안 표시 확인 · ${outputDir}`);
})().catch(error => {
  console.error(error);
  process.exit(1);
});
