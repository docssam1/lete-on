"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const baseUrl = process.env.HSE_URL || "http://127.0.0.1:8878/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(process.cwd(), "tmp", "4-2-quadrilateral-robot-browser-audit");
const typeId = "4-2-u4-t1-6";
fs.mkdirSync(outputDir, { recursive: true });

const inspect = async (browser, viewport, label, failures) => {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  page.on("pageerror", error => failures.push(`${label}: 브라우저 오류 ${error.message}`));

  await page.goto(`${baseUrl}?type=${typeId}&review=1`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });

  const problemState = await page.evaluate(() => {
    const items = [...document.querySelectorAll(".question-item")];
    return {
      documentOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      items: items.map(item => {
        const prompt = item.querySelector(".question-prompt");
        const svg = prompt?.querySelector(".robot-right-turn");
        const path = svg?.querySelector(".robot-path")?.getAttribute("points") || "";
        const points = path.trim().split(/\s+/).map(point => point.split(",").map(Number));
        let dot = Number.NaN;
        if (points.length === 3) {
          const fromVertexToStart = [points[0][0] - points[1][0], points[0][1] - points[1][1]];
          const fromVertexToEnd = [points[2][0] - points[1][0], points[2][1] - points[1][1]];
          dot = fromVertexToStart[0] * fromVertexToEnd[0] + fromVertexToStart[1] * fromVertexToEnd[1];
        }
        const bounds = svg?.getBoundingClientRect();
        return {
          text: prompt?.textContent?.replace(/\s+/g, " ").trim() || "",
          data: svg?.getAttribute("data-robot-path") || "",
          rightMark: Boolean(svg?.querySelector(".robot-right-mark")),
          dot,
          svgVisible: Boolean(bounds && bounds.width >= 220 && bounds.height >= 140),
          overflow: Boolean(item.scrollWidth > item.clientWidth + 1 || prompt?.scrollWidth > prompt?.clientWidth + 1),
          answerVisible: Boolean(item.querySelector(".answer-line")?.getBoundingClientRect().height)
        };
      })
    };
  });

  if (problemState.documentOverflow) failures.push(`${label}: 문서에 가로 넘침이 있습니다.`);
  if (problemState.items.length !== 3) failures.push(`${label}: 문제는 3개여야 하나 ${problemState.items.length}개입니다.`);
  problemState.items.forEach((item, index) => {
    const values = item.data.split(",").map(Number);
    if (values.length !== 6 || values.some(value => !Number.isFinite(value))) failures.push(`${label} ${index + 1}번: 검산 자료가 없습니다.`);
    if (!["출발점", "도착점", "왼쪽 90°"].every(token => item.text.includes(token))) failures.push(`${label} ${index + 1}번: 출발·도착·회전 표시가 없습니다.`);
    if (!item.rightMark || Math.abs(item.dot) > 1) failures.push(`${label} ${index + 1}번: 두 선분이 화면에서 정확히 수직이 아닙니다.`);
    if (!item.svgVisible || item.overflow) failures.push(`${label} ${index + 1}번: 로봇 경로 그림이 작거나 잘립니다.`);
    if (!item.answerVisible) failures.push(`${label} ${index + 1}번: 답안 칸이 보이지 않습니다.`);
  });
  await page.screenshot({ path: path.join(outputDir, `${label}-problem.png`), fullPage: true });

  await page.click("#solutionTab");
  const solutions = await page.evaluate(() => [...document.querySelectorAll(".solution-item")].map(item => ({
    text: item.textContent?.replace(/\s+/g, " ").trim() || "",
    answer: item.querySelector("header strong")?.textContent?.trim() || ""
  })));
  if (solutions.length !== 3) failures.push(`${label}: 풀이는 3개여야 하나 ${solutions.length}개입니다.`);
  solutions.forEach((solution, index) => {
    if (!solution.answer || !["이동 시간", "회전 시간", "90°"].every(token => solution.text.includes(token))) failures.push(`${label} ${index + 1}번: 정답 또는 두 단계 풀이가 없습니다.`);
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
    console.error(`4-2 사각형 로봇 브라우저 감사 실패: ${failures.length}건`);
    console.error(failures.join("\n"));
    process.exit(1);
  }
  console.log(`4-2 사각형 로봇 브라우저 감사 통과: PC·모바일 문제/풀이 4화면 · ${outputDir}`);
})().catch(error => {
  console.error(error);
  process.exit(1);
});
