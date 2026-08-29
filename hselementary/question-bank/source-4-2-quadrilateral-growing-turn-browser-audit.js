"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const baseUrl = process.env.HSE_URL || "http://127.0.0.1:8878/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(process.cwd(), "tmp", "4-2-quadrilateral-growing-turn-browser-audit");
const typeId = "4-2-u4-t1-8";
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
      const svg = prompt?.querySelector(".growing-counterclockwise");
      const bounds = svg?.getBoundingClientRect();
      return {
        text: prompt?.textContent?.replace(/\s+/g, " ").trim() || "",
        data: (svg?.getAttribute("data-growing-turn") || "").split(",").map(Number),
        segments: svg?.querySelectorAll(":scope > line").length || 0,
        rightMarks: svg?.querySelectorAll(".growing-right-mark").length || 0,
        turnArrow: Boolean(svg?.querySelector(".growing-turn-arrow")),
        svgVisible: Boolean(bounds && bounds.width >= 230 && bounds.height >= 140),
        overflow: Boolean(item.scrollWidth > item.clientWidth + 1 || prompt?.scrollWidth > prompt?.clientWidth + 1),
        answerVisible: Boolean(item.querySelector(".answer-line")?.getBoundingClientRect().height)
      };
    })
  }));

  if (state.documentOverflow) failures.push(`${label}: 문서에 가로 넘침이 있습니다.`);
  if (state.items.length !== 3) failures.push(`${label}: 문제는 3개여야 하나 ${state.items.length}개입니다.`);
  state.items.forEach((item, index) => {
    const [startLength, increment, drawCount, storedAnswer] = item.data;
    let horizontalPosition = 0;
    for (let step = 1; step <= drawCount; step += 2) horizontalPosition += (step % 4 === 1 ? 1 : -1) * (startLength + step * increment);
    if (![startLength, increment, drawCount, storedAnswer].every(Number.isFinite) || storedAnswer !== Math.abs(horizontalPosition)) failures.push(`${label} ${index + 1}번: 회전 자료와 정답이 맞지 않습니다.`);
    if (drawCount % 2 !== 0 || item.segments !== 3 || item.rightMarks !== 2 || !item.turnArrow) failures.push(`${label} ${index + 1}번: 처음 세 선분·직각·반시계 표시가 맞지 않습니다.`);
    if (!["반시계 방향", `수선을 ${drawCount}번`, `${startLength}cm`, `${startLength + increment}cm`, `${startLength + 2 * increment}cm`].every(token => item.text.includes(token))) failures.push(`${label} ${index + 1}번: 원문 규칙이나 처음 세 길이 표시가 없습니다.`);
    if (!item.svgVisible || item.overflow || !item.answerVisible) failures.push(`${label} ${index + 1}번: 선분 그림 또는 답안 칸이 작거나 잘립니다.`);
  });
  await page.screenshot({ path: path.join(outputDir, `${label}-problem.png`), fullPage: true });

  await page.click("#solutionTab");
  const solutions = await page.evaluate(() => [...document.querySelectorAll(".solution-item")].map(item => ({
    text: item.textContent?.replace(/\s+/g, " ").trim() || "",
    answer: item.querySelector("header strong")?.textContent?.trim() || ""
  })));
  if (solutions.length !== 3) failures.push(`${label}: 풀이는 3개여야 하나 ${solutions.length}개입니다.`);
  solutions.forEach((solution, index) => {
    if (!solution.answer || !["오른쪽", "왼쪽", "두 평행선 사이의 거리"].every(token => solution.text.includes(token))) failures.push(`${label} ${index + 1}번: 정답 또는 방향별 풀이가 없습니다.`);
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
    console.error(`4-2 사각형 길이 증가 수선 브라우저 감사 실패: ${failures.length}건`);
    console.error(failures.join("\n"));
    process.exit(1);
  }
  console.log(`4-2 사각형 길이 증가 수선 브라우저 감사 통과: PC·모바일 문제/풀이 4화면 · ${outputDir}`);
})().catch(error => {
  console.error(error);
  process.exit(1);
});
