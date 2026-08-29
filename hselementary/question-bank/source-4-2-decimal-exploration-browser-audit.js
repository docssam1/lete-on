"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const baseUrl = process.env.HSE_URL || "http://127.0.0.1:8878/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(process.cwd(), "tmp", "4-2-decimal-exploration-browser-audit");
const typeId = "4-2-u3-t1-7";
fs.mkdirSync(outputDir, { recursive: true });

const inspect = async (browser, viewport, label, failures) => {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  page.on("pageerror", error => failures.push(`${label}: 브라우저 오류 ${error.message}`));
  page.on("console", message => {
    if (message.type() === "error" && !message.text().includes("Failed to load resource")) failures.push(`${label}: 콘솔 오류 ${message.text()}`);
  });

  await page.goto(`${baseUrl}?type=${typeId}&review=1`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });

  const questionState = await page.evaluate(() => {
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
    const items = [...document.querySelectorAll(".question-item")];
    return {
      documentOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      items: items.map(item => {
        const prompt = item.querySelector(".question-prompt");
        const text = prompt?.textContent?.replace(/\s+/g, " ").trim() || "";
        return {
          text,
          fractionCount: prompt?.querySelectorAll(".math-fraction").length || 0,
          fractionOverlap: fractionOverlap(prompt),
          overflow: clipped(item) || clipped(prompt),
          answerVisible: Boolean(item.querySelector(".answer-line")?.getBoundingClientRect().height)
        };
      })
    };
  });

  if (questionState.documentOverflow) failures.push(`${label}: 문서에 가로 넘침이 있습니다.`);
  if (questionState.items.length !== 3) failures.push(`${label}: 문제는 3개여야 하나 ${questionState.items.length}개입니다.`);
  if (new Set(questionState.items.map(item => item.text)).size < 2) failures.push(`${label}: 세 문제의 수치가 충분히 달라지지 않았습니다.`);
  questionState.items.forEach((item, index) => {
    if (!item.text.includes("아버지") || !item.text.includes("kg") || !item.text.includes("g")) failures.push(`${label} ${index + 1}번: 원문 핵심 조건이나 단위가 없습니다.`);
    if (item.text.includes("1/10")) failures.push(`${label} ${index + 1}번: 일반 문자열 분수가 남아 있습니다.`);
    if (item.fractionCount !== 1 || item.fractionOverlap) failures.push(`${label} ${index + 1}번: 세로 분수 표시가 없거나 겹칩니다.`);
    if (item.overflow) failures.push(`${label} ${index + 1}번: 문제 상자 또는 내용이 잘립니다.`);
    if (!item.answerVisible) failures.push(`${label} ${index + 1}번: 답안 칸이 보이지 않습니다.`);
  });
  await page.screenshot({ path: path.join(outputDir, `${label}-problem.png`), fullPage: true });

  await page.click("#solutionTab");
  const solutionState = await page.evaluate(() => [...document.querySelectorAll(".solution-item")].map(item => {
    const fractions = [...item.querySelectorAll(".math-fraction")];
    const fractionOverlap = fractions.some(fraction => {
      const numerator = fraction.children[0]?.getBoundingClientRect();
      const denominator = fraction.children[1]?.getBoundingClientRect();
      return !numerator || !denominator || numerator.bottom > denominator.top + 0.5;
    });
    return {
      text: item.textContent?.replace(/\s+/g, " ").trim() || "",
      answer: item.querySelector("header strong")?.textContent?.trim() || "",
      fractionCount: fractions.length,
      fractionOverlap
    };
  }));
  if (solutionState.length !== 3) failures.push(`${label}: 풀이는 3개여야 하나 ${solutionState.length}개입니다.`);
  solutionState.forEach((item, index) => {
    if (!item.text || !item.answer) failures.push(`${label} ${index + 1}번: 정답 또는 풀이가 비었습니다.`);
    if (item.fractionCount !== 1 || item.fractionOverlap) failures.push(`${label} ${index + 1}번: 풀이의 세로 분수가 없거나 겹칩니다.`);
  });
  await page.screenshot({ path: path.join(outputDir, `${label}-solution.png`), fullPage: true });
  await page.close();
};

(async () => {
  const failures = [];
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  await inspect(browser, { width: 1280, height: 900 }, "desktop", failures);
  await inspect(browser, { width: 375, height: 812 }, "mobile", failures);
  await browser.close();
  if (failures.length) {
    console.error(`4-2 소수 개념탐구 브라우저 감사 실패: ${failures.length}건`);
    console.error(failures.join("\n"));
    process.exit(1);
  }
  console.log(`4-2 소수 개념탐구 브라우저 감사 통과: PC·모바일 문제/풀이 4화면 · ${outputDir}`);
})().catch(error => {
  console.error(error);
  process.exit(1);
});
