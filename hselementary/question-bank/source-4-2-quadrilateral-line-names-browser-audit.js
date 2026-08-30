"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const baseUrl = process.env.HSE_URL || "http://127.0.0.1:8878/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(process.cwd(), "tmp", "4-2-quadrilateral-line-names-browser-audit");
const typeId = "4-2-u4-t1-10";
fs.mkdirSync(outputDir, { recursive: true });

const near = (actual, expected, tolerance = 0.02) => Math.abs(actual - expected) <= tolerance;
const direction = line => {
  const dx = line[2] - line[0];
  const dy = line[3] - line[1];
  const length = Math.hypot(dx, dy);
  return [dx / length, dy / length];
};
const parallel = (left, right) => near(Math.abs(left[0] * right[1] - left[1] * right[0]), 0);
const perpendicular = (left, right) => near(left[0] * right[0] + left[1] * right[1], 0);
const pointLineDistance = (point, line) => {
  const [x1, y1, x2, y2] = line;
  return Math.abs((y2 - y1) * point[0] - (x2 - x1) * point[1] + x2 * y1 - y2 * x1) / Math.hypot(y2 - y1, x2 - x1);
};

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
      const svg = prompt?.querySelector(".line-name-condition");
      const bounds = svg?.getBoundingClientRect();
      const lineData = line => ["x1", "y1", "x2", "y2"].map(name => Number(line.getAttribute(name)));
      return {
        text: prompt?.textContent?.replace(/\s+/g, " ").trim() || "",
        roleLabels: (svg?.getAttribute("data-role-labels") || "").split(","),
        uniqueCount: Number(svg?.getAttribute("data-unique-assignments")),
        lines: Object.fromEntries([...(svg?.querySelectorAll(".line-name-main") || [])].map(line => [line.getAttribute("data-line-role"), lineData(line)])),
        slots: [...(svg?.querySelectorAll(".line-name-slot") || [])].map(slot => ({ role: slot.getAttribute("data-slot-role"), index: Number(slot.getAttribute("data-slot-index")), value: slot.querySelector(".line-name-slot-value")?.textContent || "" })),
        rightMarks: svg?.querySelectorAll(".line-name-right-mark").length || 0,
        concurrent: svg?.querySelector(".line-name-concurrent") ? [Number(svg.querySelector(".line-name-concurrent").getAttribute("cx")), Number(svg.querySelector(".line-name-concurrent").getAttribute("cy"))] : [],
        svgVisible: Boolean(bounds && bounds.width >= 250 && bounds.height >= 170),
        overflow: Boolean(item.scrollWidth > item.clientWidth + 1 || prompt?.scrollWidth > prompt?.clientWidth + 1),
        answerVisible: Boolean(item.querySelector(".answer-line")?.getBoundingClientRect().height)
      };
    })
  }));

  if (state.documentOverflow) failures.push(`${label}: 문서에 가로 넘침이 있습니다.`);
  if (state.items.length !== 3) failures.push(`${label}: 문제는 3개여야 하나 ${state.items.length}개입니다.`);
  state.items.forEach((item, index) => {
    const [aLabel, mLabel, nLabel, rLabel, dLabel] = item.roleLabels;
    if (item.roleLabels.length !== 5 || new Set(item.roleLabels).size !== 5 || item.uniqueCount !== 1) failures.push(`${label} ${index + 1}번: 다섯 이름 또는 유일한 배치 자료가 맞지 않습니다.`);
    if (Object.keys(item.lines).sort().join("") !== "ADMNR" || item.slots.map(slot => slot.role).sort().join("") !== "DMNR" || item.slots.map(slot => slot.index).join("") !== "1234" || item.slots.some(slot => slot.value)) failures.push(`${label} ${index + 1}번: 다섯 직선이나 네 빈칸이 맞지 않습니다.`);
    const vectors = Object.fromEntries(Object.entries(item.lines).map(([role, line]) => [role, direction(line)]));
    if (!parallel(vectors.A, vectors.M) || !perpendicular(vectors.M, vectors.R) || !perpendicular(vectors.D, vectors.N)) failures.push(`${label} ${index + 1}번: SVG 좌표의 평행·수직 관계가 조건과 다릅니다.`);
    if (!item.concurrent.length || ["A", "D", "R"].some(role => pointLineDistance(item.concurrent, item.lines[role]) > 0.15)) failures.push(`${label} ${index + 1}번: 가 역할·다 역할·라 역할 직선이 한 점에서 만나지 않습니다.`);
    const conditions = [`직선 ${mLabel}에 대한 수선은 직선 ${rLabel}`, `직선 ${nLabel}와 직선 ${dLabel}는 수직`, `직선 ${aLabel}와 직선 ${mLabel}는 만나지`, `직선 ${aLabel}, ${dLabel}, ${rLabel}는 한 점`];
    if (!conditions.every(condition => item.text.includes(condition)) || item.rightMarks !== 2) failures.push(`${label} ${index + 1}번: 네 조건 또는 두 직각 표시가 빠졌습니다.`);
    if (!item.svgVisible || item.overflow || !item.answerVisible) failures.push(`${label} ${index + 1}번: 직선 그림 또는 답안 칸이 작거나 잘립니다.`);
  });
  await page.screenshot({ path: path.join(outputDir, `${label}-problem.png`), fullPage: true });

  await page.click("#solutionTab");
  const solutions = await page.evaluate(() => [...document.querySelectorAll(".solution-item")].map(item => {
    const svg = item.querySelector(".line-name-condition");
    return {
      text: item.textContent?.replace(/\s+/g, " ").trim() || "",
      answer: item.querySelector("header strong")?.textContent?.trim() || "",
      filled: [...(svg?.querySelectorAll(".line-name-slot-value") || [])].map(node => node.textContent || "")
    };
  }));
  if (solutions.length !== 3) failures.push(`${label}: 풀이는 3개여야 하나 ${solutions.length}개입니다.`);
  solutions.forEach((solution, index) => {
    if (!solution.answer || solution.filled.length !== 4 || solution.filled.some(value => !value) || !["가능한 이름 배치 24가지", "배치는 1개"].every(token => solution.text.includes(token))) failures.push(`${label} ${index + 1}번: 완성 그림이나 유일성 풀이가 없습니다.`);
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
    console.error(`4-2 사각형 직선 이름 조건 브라우저 감사 실패: ${failures.length}건`);
    console.error(failures.join("\n"));
    process.exit(1);
  }
  console.log(`4-2 사각형 직선 이름 조건 브라우저 감사 통과: PC·모바일 문제/풀이 4화면 · ${outputDir}`);
})().catch(error => {
  console.error(error);
  process.exit(1);
});
