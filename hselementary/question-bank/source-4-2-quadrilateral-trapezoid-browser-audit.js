"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const baseUrl = process.env.HSE_URL || "http://127.0.0.1:8878/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(process.cwd(), "tmp", "4-2-quadrilateral-trapezoid-browser-audit");
const typeId = "4-2-u4-t1-7";
fs.mkdirSync(outputDir, { recursive: true });

const inspect = async (browser, viewport, label, failures) => {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  page.on("pageerror", error => failures.push(`${label}: 브라우저 오류 ${error.message}`));
  await page.goto(`${baseUrl}?type=${typeId}&review=1`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });

  const state = await page.evaluate(() => ({
    documentOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    items: [...document.querySelectorAll(".question-item")].map(item => {
      const prompt = item.querySelector(".question-prompt");
      const svg = prompt?.querySelector(".parallel-trapezoid-height");
      const points = (svg?.querySelector("polygon")?.getAttribute("points") || "").trim().split(/\s+/).map(point => point.split(",").map(Number));
      const data = (svg?.getAttribute("data-trapezoid-distance") || "").split(",").map(Number);
      const bounds = svg?.getBoundingClientRect();
      return {
        text: prompt?.textContent?.replace(/\s+/g, " ").trim() || "",
        data,
        points,
        angleMarks: svg?.querySelectorAll(".trapezoid-angle-mark").length || 0,
        svgVisible: Boolean(bounds && bounds.width >= 240 && bounds.height >= 130),
        overflow: Boolean(item.scrollWidth > item.clientWidth + 1 || prompt?.scrollWidth > prompt?.clientWidth + 1),
        answerVisible: Boolean(item.querySelector(".answer-line")?.getBoundingClientRect().height)
      };
    })
  }));

  if (state.documentOverflow) failures.push(`${label}: 문서에 가로 넘침이 있습니다.`);
  if (state.items.length !== 3) failures.push(`${label}: 문제는 3개여야 하나 ${state.items.length}개입니다.`);
  state.items.forEach((item, index) => {
    const [top, bottom, leftAngle, rightAngle, answer] = item.data;
    if (![top, bottom, leftAngle, rightAngle, answer].every(Number.isFinite) || answer !== (bottom - top) / 2) failures.push(`${label} ${index + 1}번: 길이 자료와 정답이 맞지 않습니다.`);
    if (leftAngle !== 45 || rightAngle !== 45 || item.angleMarks !== 2) failures.push(`${label} ${index + 1}번: 45도 표시가 두 곳에 없습니다.`);
    if (item.points.length !== 4) failures.push(`${label} ${index + 1}번: 사다리꼴 꼭짓점이 네 개가 아닙니다.`);
    if (item.points.length === 4) {
      const [topLeft, topRight, bottomRight, bottomLeft] = item.points;
      const visualHeight = bottomLeft[1] - topLeft[1];
      const leftRun = topLeft[0] - bottomLeft[0];
      const rightRun = bottomRight[0] - topRight[0];
      if (Math.abs(topLeft[1] - topRight[1]) > 0.1 || Math.abs(bottomLeft[1] - bottomRight[1]) > 0.1) failures.push(`${label} ${index + 1}번: 위아래 변이 화면에서 평행하지 않습니다.`);
      if (Math.abs(leftRun - visualHeight) > 0.2 || Math.abs(rightRun - visualHeight) > 0.2) failures.push(`${label} ${index + 1}번: 양쪽 기울기가 화면에서 45도가 아닙니다.`);
    }
    if (!["서로 평행", "45°", `${top}cm`, `${bottom}cm`].every(token => item.text.includes(token))) failures.push(`${label} ${index + 1}번: 원문 핵심 조건이나 길이 표시가 없습니다.`);
    if (!item.svgVisible || item.overflow || !item.answerVisible) failures.push(`${label} ${index + 1}번: 사다리꼴 그림 또는 답안 칸이 작거나 잘립니다.`);
  });
  await page.screenshot({ path: path.join(outputDir, `${label}-problem.png`), fullPage: true });

  await page.click("#solutionTab");
  const solutions = await page.evaluate(() => [...document.querySelectorAll(".solution-item")].map(item => ({
    text: item.textContent?.replace(/\s+/g, " ").trim() || "",
    answer: item.querySelector("header strong")?.textContent?.trim() || ""
  })));
  if (solutions.length !== 3) failures.push(`${label}: 풀이는 3개여야 하나 ${solutions.length}개입니다.`);
  solutions.forEach((solution, index) => {
    if (!solution.answer || !["길이 차", "÷2", "평행선 사이의 거리"].every(token => solution.text.includes(token))) failures.push(`${label} ${index + 1}번: 정답 또는 두 단계 풀이가 없습니다.`);
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
    console.error(`4-2 사각형 45도 사다리꼴 브라우저 감사 실패: ${failures.length}건`);
    console.error(failures.join("\n"));
    process.exit(1);
  }
  console.log(`4-2 사각형 45도 사다리꼴 브라우저 감사 통과: PC·모바일 문제/풀이 4화면 · ${outputDir}`);
})().catch(error => {
  console.error(error);
  process.exit(1);
});
