"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const baseUrl = process.env.HSE_URL || "http://127.0.0.1:8878/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(process.cwd(), "tmp", "4-2-quadrilateral-two-angles-browser-audit");
const typeId = "4-2-u4-t1-9";
fs.mkdirSync(outputDir, { recursive: true });

const near = (actual, expected, tolerance = 0.25) => Math.abs(actual - expected) <= tolerance;

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
      const svg = prompt?.querySelector(".perpendicular-two-unknown");
      const bounds = svg?.getBoundingClientRect();
      const lineData = line => line ? ["x1", "y1", "x2", "y2"].map(name => Number(line.getAttribute(name))) : [];
      return {
        text: prompt?.textContent?.replace(/\s+/g, " ").trim() || "",
        data: (svg?.getAttribute("data-perpendicular-angles") || "").split(",").map(Number),
        bases: [...(svg?.querySelectorAll(".perpendicular-base") || [])].map(lineData),
        slants: [...(svg?.querySelectorAll(".perpendicular-slant") || [])].map(lineData),
        rightMark: Boolean(svg?.querySelector(".perpendicular-right-mark")),
        center: Boolean(svg?.querySelector(".perpendicular-center")),
        svgVisible: Boolean(bounds && bounds.width >= 230 && bounds.height >= 145),
        overflow: Boolean(item.scrollWidth > item.clientWidth + 1 || prompt?.scrollWidth > prompt?.clientWidth + 1),
        answerVisible: Boolean(item.querySelector(".answer-line")?.getBoundingClientRect().height)
      };
    })
  }));

  if (state.documentOverflow) failures.push(`${label}: 문서에 가로 넘침이 있습니다.`);
  if (state.items.length !== 3) failures.push(`${label}: 문제는 3개여야 하나 ${state.items.length}개입니다.`);
  state.items.forEach((item, index) => {
    const [leftGiven, rightGiven, firstTarget, secondTarget] = item.data;
    if (![leftGiven, rightGiven, firstTarget, secondTarget].every(Number.isFinite)) {
      failures.push(`${label} ${index + 1}번: 각도 자료가 없습니다.`);
      return;
    }
    if (firstTarget !== 90 - rightGiven || secondTarget !== 90 - leftGiven) failures.push(`${label} ${index + 1}번: 두 미지각과 주어진 각의 합이 직각이 아닙니다.`);
    if (item.bases.length !== 2 || item.slants.length !== 2 || !item.rightMark || !item.center) failures.push(`${label} ${index + 1}번: 수직선·빗선·직각 표시가 빠졌습니다.`);

    const [horizontal, vertical] = item.bases;
    if (!horizontal || !near(horizontal[1], horizontal[3]) || !vertical || !near(vertical[0], vertical[2])) failures.push(`${label} ${index + 1}번: 직선 가와 나가 가로·세로 수직으로 그려지지 않았습니다.`);
    const renderedAngles = item.slants.map(([x1, y1, x2, y2]) => Math.atan2(Math.abs(y2 - y1), Math.abs(x2 - x1)) * 180 / Math.PI);
    if (renderedAngles.length !== 2 || !near(renderedAngles[0], leftGiven) || !near(renderedAngles[1], rightGiven)) failures.push(`${label} ${index + 1}번: 빗선 좌표에서 역산한 각이 ${leftGiven}°, ${rightGiven}°와 다릅니다.`);

    const tokens = ["직선 가", "직선 나", `${leftGiven}°`, `${rightGiven}°`, "㉠", "㉡"];
    if (!tokens.every(token => item.text.includes(token))) failures.push(`${label} ${index + 1}번: 원문 조건이나 각도 표시가 없습니다.`);
    if (!item.svgVisible || item.overflow || !item.answerVisible) failures.push(`${label} ${index + 1}번: 각도 그림 또는 답안 칸이 작거나 잘립니다.`);
  });
  await page.screenshot({ path: path.join(outputDir, `${label}-problem.png`), fullPage: true });

  await page.click("#solutionTab");
  const solutions = await page.evaluate(() => [...document.querySelectorAll(".solution-item")].map(item => ({
    text: item.textContent?.replace(/\s+/g, " ").trim() || "",
    answer: item.querySelector("header strong")?.textContent?.trim() || ""
  })));
  if (solutions.length !== 3) failures.push(`${label}: 풀이는 3개여야 하나 ${solutions.length}개입니다.`);
  solutions.forEach((solution, index) => {
    if (!solution.answer || !["직각은 90°", "㉠=90-", "㉡=90-"].every(token => solution.text.includes(token))) failures.push(`${label} ${index + 1}번: 두 각의 정답 또는 뺄셈 풀이가 없습니다.`);
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
    console.error(`4-2 사각형 수직선 사이 두 각 브라우저 감사 실패: ${failures.length}건`);
    console.error(failures.join("\n"));
    process.exit(1);
  }
  console.log(`4-2 사각형 수직선 사이 두 각 브라우저 감사 통과: PC·모바일 문제/풀이 4화면 · ${outputDir}`);
})().catch(error => {
  console.error(error);
  process.exit(1);
});
