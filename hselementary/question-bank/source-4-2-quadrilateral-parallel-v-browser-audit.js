"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const baseUrl = process.env.HSE_URL || "http://127.0.0.1:8878/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(process.cwd(), "tmp", "4-2-quadrilateral-parallel-v-browser-audit");
const typeId = "4-2-u4-t2-4";
const hash = value => [...value].reduce((sum, character) => Math.imul(sum ^ character.charCodeAt(0), 16777619), 2166136261) >>> 0;
const exactConcernSeed = 297;
const exactConcernNow = (exactConcernSeed - 1000003 - hash(typeId)) >>> 0;
fs.mkdirSync(outputDir, { recursive: true });

const near = (actual, expected, tolerance = 0.3) => Math.abs(actual - expected) <= tolerance;

const inspect = async (browser, viewport, label, failures) => {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  page.on("pageerror", error => failures.push(`${label}: 브라우저 오류 ${error.message}`));
  await page.addInitScript(now => { Date.now = () => now; }, exactConcernNow);
  await page.goto(`${baseUrl}?type=${typeId}&review=1`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
  const state = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    items: [...document.querySelectorAll(".question-item")].map(item => {
      const prompt = item.querySelector(".question-prompt");
      const svg = prompt?.querySelector(".parallel-v-exterior");
      const line = node => ["x1", "y1", "x2", "y2"].map(name => Number(node.getAttribute(name)));
      const mark = group => {
        const path = group.querySelector(".parallel-v-angle-arc");
        const text = group.querySelector("text");
        const pathBounds = path?.getBoundingClientRect();
        const textBounds = text?.getBoundingClientRect();
        const style = path ? getComputedStyle(path) : null;
        return {
          role: group.getAttribute("data-angle-role") || "",
          value: Number(group.getAttribute("data-angle-value")),
          center: (group.getAttribute("data-arc-center") || "").split(",").map(Number),
          start: Number(group.getAttribute("data-arc-start")),
          span: Number(group.getAttribute("data-arc-span")),
          arcRadius: Number(group.getAttribute("data-arc-radius")),
          labelRadius: Number(group.getAttribute("data-label-radius")),
          label: [Number(text?.getAttribute("x")), Number(text?.getAttribute("y"))],
          labelText: text?.textContent || "",
          pathLength: path?.getTotalLength() || 0,
          pathVisible: Boolean(pathBounds && pathBounds.width >= 1 && pathBounds.height >= 1 && pathBounds.width + pathBounds.height >= 6 && style && style.stroke !== "none" && Number.parseFloat(style.strokeWidth) >= 1.5),
          labelVisible: Boolean(textBounds && textBounds.width >= 8 && textBounds.height >= 8)
        };
      };
      const bounds = svg?.getBoundingClientRect();
      return {
        text: prompt?.textContent?.replace(/\s+/g, " ").trim() || "",
        data: (svg?.getAttribute("data-parallel-v-angles") || "").split(",").map(Number),
        bases: [...(svg?.querySelectorAll(".parallel-v-base") || [])].map(line),
        rays: [...(svg?.querySelectorAll(".parallel-v-ray") || [])].map(line),
        marks: [...(svg?.querySelectorAll(".parallel-v-angle-mark") || [])].map(mark),
        visible: Boolean(bounds && bounds.width >= 250 && bounds.height >= 130),
        itemOverflow: item.scrollWidth > item.clientWidth + 1,
        answerVisible: Boolean(item.querySelector(".answer-line")?.getBoundingClientRect().height)
      };
    })
  }));
  if (state.overflow) failures.push(`${label}: 문서에 가로 넘침이 있습니다.`);
  if (state.items.length !== 3) failures.push(`${label}: 문제는 3개여야 하나 ${state.items.length}개입니다.`);
  if (state.items[0]?.data.join(",") !== "54,58,68,112") failures.push(`${label} 1번: 사용자 지적 사례 54°, 58°가 고정 재현되지 않았습니다.`);
  state.items.forEach((item, index) => {
    const [leftAngle, vertexAngle, rightInterior, answer] = item.data;
    if (leftAngle + vertexAngle + rightInterior !== 180 || answer !== leftAngle + vertexAngle) failures.push(`${label} ${index + 1}번: 삼각형 세 각 또는 바깥각 자료가 맞지 않습니다.`);
    if (item.bases.length !== 2 || item.rays.length !== 2 || item.bases.some(base => !near(base[1], base[3], 0.01))) failures.push(`${label} ${index + 1}번: 두 평행선이 수평으로 그려지지 않았습니다.`);
    const rendered = item.rays.map(([x1, y1, x2, y2]) => Math.atan2(Math.abs(y2 - y1), Math.abs(x2 - x1)) * 180 / Math.PI);
    if (!near(rendered[0], leftAngle) || !near(rendered[1], rightInterior)) failures.push(`${label} ${index + 1}번: SVG 빗선 각도를 역산한 값이 주어진 각과 다릅니다.`);
    const marks = Object.fromEntries(item.marks.map(mark => [mark.role, mark]));
    const expectedMarks = {
      "left-exterior": { value: leftAngle, start: 180 - leftAngle, span: leftAngle, label: `${leftAngle}°`, region: ([x, y], [cx, cy]) => x < cx && y < cy },
      "vertex-interior": { value: vertexAngle, start: rightInterior, span: vertexAngle, label: `${vertexAngle}°`, region: ([, y], [, cy]) => y < cy },
      "right-exterior": { value: answer, start: 180 + rightInterior, span: answer, label: "㉠", region: ([x, y], [cx, cy]) => x > cx && y > cy }
    };
    if (item.marks.length !== 3) failures.push(`${label} ${index + 1}번: 원문에 있는 세 각호가 모두 표시되지 않았습니다.`);
    Object.entries(expectedMarks).forEach(([role, expected]) => {
      const mark = marks[role];
      if (!mark) {
        failures.push(`${label} ${index + 1}번: ${role} 각 표시가 없습니다.`);
        return;
      }
      if (mark.value !== expected.value || !near(mark.start, expected.start, 0.01) || !near(mark.span, expected.span, 0.01)) failures.push(`${label} ${index + 1}번: ${role} 각호의 방향 또는 크기가 원문과 다릅니다.`);
      const midpoint = (mark.start + mark.span / 2) * Math.PI / 180;
      const expectedLabel = [mark.center[0] + mark.labelRadius * Math.cos(midpoint), mark.center[1] - mark.labelRadius * Math.sin(midpoint)];
      if (!near(mark.label[0], expectedLabel[0]) || !near(mark.label[1], expectedLabel[1]) || !expected.region(mark.label, mark.center)) failures.push(`${label} ${index + 1}번: ${role} 숫자 또는 물음 표시가 해당 각 안에 있지 않습니다.`);
      if (mark.labelText !== expected.label || mark.pathLength < 12 || !mark.pathVisible || !mark.labelVisible) failures.push(`${label} ${index + 1}번: ${role} 각호나 글자가 화면에서 선명하게 보이지 않습니다.`);
    });
    if (![`${leftAngle}°`, `${vertexAngle}°`, "㉠", "직선 가와 나는 서로 평행"].every(token => item.text.includes(token))) failures.push(`${label} ${index + 1}번: 원문 조건이나 각도 표시가 없습니다.`);
    if (!item.visible || item.itemOverflow || !item.answerVisible) failures.push(`${label} ${index + 1}번: 그림 또는 답안 칸이 작거나 잘립니다.`);
  });
  await page.screenshot({ path: path.join(outputDir, `${label}-problem.png`), fullPage: true });
  await page.click("#solutionTab");
  const solutions = await page.evaluate(() => [...document.querySelectorAll(".solution-item")].map(item => item.textContent?.replace(/\s+/g, " ").trim() || ""));
  if (solutions.length !== 3 || solutions.some(text => !["삼각형의 오른쪽 안쪽 각", "㉠=180-"].every(token => text.includes(token)))) failures.push(`${label}: 세 풀이의 보각 계산이 없습니다.`);
  await page.screenshot({ path: path.join(outputDir, `${label}-solution.png`), fullPage: true });
  if (label === "desktop") {
    await page.emulateMedia({ media: "print" });
    await page.pdf({ path: path.join(outputDir, "a4-solution.pdf"), format: "A4", printBackground: true, preferCSSPageSize: true });
    await page.emulateMedia({ media: "screen" });
    await page.click("#problemTab");
    await page.emulateMedia({ media: "print" });
    const printItems = await page.evaluate(() => [...document.querySelectorAll(".question-item")].map(item => {
      const svg = item.querySelector(".parallel-v-exterior");
      const itemBounds = item.getBoundingClientRect();
      const svgBounds = svg?.getBoundingClientRect();
      const marks = [...(svg?.querySelectorAll(".parallel-v-angle-mark") || [])].map(group => {
        const path = group.querySelector(".parallel-v-angle-arc");
        const text = group.querySelector("text");
        const pathBounds = path?.getBoundingClientRect();
        const textBounds = text?.getBoundingClientRect();
        return Boolean(pathBounds && pathBounds.width >= 1 && pathBounds.height >= 1 && textBounds && textBounds.width >= 8 && textBounds.height >= 8);
      });
      return {
        svgInside: Boolean(svgBounds && svgBounds.left >= itemBounds.left - 1 && svgBounds.right <= itemBounds.right + 1 && svgBounds.top >= itemBounds.top - 1 && svgBounds.bottom <= itemBounds.bottom + 1),
        markCount: marks.length,
        marksVisible: marks.every(Boolean)
      };
    }));
    if (printItems.length !== 3 || printItems.some(item => !item.svgInside || item.markCount !== 3 || !item.marksVisible)) failures.push("A4 문제지: 세 각호·글자 또는 그림이 문항 영역에서 잘립니다.");
    await page.pdf({ path: path.join(outputDir, "a4-problem.pdf"), format: "A4", printBackground: true, preferCSSPageSize: true });
    await page.emulateMedia({ media: "screen" });
  }
  await page.close();
};

(async () => {
  const failures = [];
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  await inspect(browser, { width: 1280, height: 900 }, "desktop", failures);
  await inspect(browser, { width: 375, height: 812 }, "mobile", failures);
  await browser.close();
  if (failures.length) {
    console.error(`4-2 사각형 평행선 브이 바깥각 브라우저 감사 실패: ${failures.length}건`);
    console.error(failures.join("\n"));
    process.exit(1);
  }
  console.log(`4-2 사각형 평행선 브이 바깥각 브라우저 감사 통과: PC·모바일 문제/풀이 4화면 · A4 문제/풀이 2파일 · ${outputDir}`);
})().catch(error => { console.error(error); process.exit(1); });
