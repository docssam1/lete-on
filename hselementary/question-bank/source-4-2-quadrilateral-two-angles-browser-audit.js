"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const baseUrl = process.env.HSE_URL || "http://127.0.0.1:8878/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(process.cwd(), "tmp", "4-2-quadrilateral-two-angles-browser-audit");
const typeId = "4-2-u4-t1-9";
fs.mkdirSync(outputDir, { recursive: true });

// 2026-11-24: 이 감사는 generators.js의 옛 quadPerpParallelDistance 경로(perpendicular-two-unknown 그림)를 검사했다. 2026-09-24(b3c1e06fc)부터
// 이 유형은 원문 검증 풀 생성기 sourceGrade4AdvancedPerpendicularParallel(source-4-2-perpendicular-parallel.js)로 옮겨졌고,
// 그 그림·정답은 source-4-2-perpendicular-parallel-audit.js·-browser-audit.js가 검사한다. 지금 옛 경로를 쓰는 유형은 없다.
// 유형이 옮겨져 있으면 안내를 남기고, 지금 화면에도 해당하는 것(문항 수, 그림, 넘침, 답 칸, 풀이 수·정답)만 확인한다.
// 유형이 다시 옛 생성기를 쓰면 아래 원래 검사를 그대로 한다.
const legacyGeneratorKey = "quadPerpParallelDistance";
const currentGeneratorKey = page => page.evaluate(id => window.HSE_CURRICULUM.semesters.flatMap(semester => semester.units.flatMap(unit => unit.subunits.flatMap(subunit => subunit.types))).find(type => type.id === id)?.generatorKey || "", typeId);
const expectedDistinctQuestions = (page, requested = 3) => page.evaluate(({ id, requested }) => {
  const type = window.HSE_CURRICULUM.semesters.flatMap(semester => semester.units.flatMap(unit => unit.subunits.flatMap(subunit => subunit.types))).find(item => item.id === id);
  if (!type) return 0;
  const fixedPool = type.generationMode === "fixed-verified-pool";
  const prompts = new Set();
  for (let index = 0; index < requested; index += 1) for (let attempt = 0; attempt < 64; attempt += 1) {
    try {
      const candidate = window.HSE_GENERATORS.generate(type, 0, 0, (20261124 + index * 7919 + attempt * 104729) >>> 0, fixedPool ? attempt : index);
      if (candidate?.prompt) prompts.add(candidate.prompt);
    } catch {}
  }
  return Math.min(requested, prompts.size);
}, { id: typeId, requested });
const inspectMovedType = async (page, label, failures, generatorKey) => {
  console.log(`안내: ${typeId}는 옛 ${legacyGeneratorKey} 경로에서 ${generatorKey} 생성기로 옮겨져, 옛 그림 검사 대신 공통 화면 검사만 합니다 (${label}).`);
  const expectedCount = await expectedDistinctQuestions(page);
  const state = await page.evaluate(() => ({
    documentOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    items: [...document.querySelectorAll(".question-item")].map(item => {
      const prompt = item.querySelector(".question-prompt");
      const itemBox = item.getBoundingClientRect();
      const figures = [...(prompt?.querySelectorAll("svg") || [])].map(svg => svg.getBoundingClientRect());
      return {
        text: prompt?.textContent?.replace(/\s+/g, " ").trim() || "",
        figureVisible: figures.length > 0 && figures.every(box => box.width >= 120 && box.height >= 80 && box.left >= itemBox.left - 1 && box.right <= itemBox.right + 1),
        overflow: Boolean(item.scrollWidth > item.clientWidth + 1 || prompt?.scrollWidth > prompt?.clientWidth + 1),
        answerVisible: Boolean(item.querySelector(".answer-line")?.getBoundingClientRect().height)
      };
    })
  }));
  if (state.documentOverflow) failures.push(`${label}: 문서에 가로 넘침이 있습니다.`);
  if (!expectedCount || state.items.length !== expectedCount) failures.push(`${label}: 문제는 ${expectedCount}개여야 하나 ${state.items.length}개입니다.`);
  state.items.forEach((item, index) => {
    if (!item.text || /undefined|NaN|null/.test(item.text)) failures.push(`${label} ${index + 1}번: 문제 문장이 비었거나 깨졌습니다.`);
    if (!item.figureVisible || item.overflow || !item.answerVisible) failures.push(`${label} ${index + 1}번: 그림 또는 답안 칸이 작거나 잘립니다.`);
  });
  await page.screenshot({ path: path.join(outputDir, `${label}-problem.png`), fullPage: true });
  await page.click("#solutionTab");
  const solutions = await page.evaluate(() => [...document.querySelectorAll(".solution-item")].map(item => ({
    text: item.textContent?.replace(/\s+/g, " ").trim() || "",
    answer: item.querySelector("header strong")?.textContent?.trim() || ""
  })));
  if (solutions.length !== state.items.length) failures.push(`${label}: 풀이는 ${state.items.length}개여야 하나 ${solutions.length}개입니다.`);
  solutions.forEach((solution, index) => {
    if (!solution.answer || !solution.text || /undefined|NaN/.test(solution.text)) failures.push(`${label} ${index + 1}번: 정답 또는 풀이가 없습니다.`);
  });
  await page.screenshot({ path: path.join(outputDir, `${label}-solution.png`), fullPage: true });
  if (label !== "desktop") return;
  await page.emulateMedia({ media: "print" });
  await page.pdf({ path: path.join(outputDir, "a4-solution.pdf"), format: "A4", printBackground: true, preferCSSPageSize: true });
  await page.emulateMedia({ media: "screen" });
  await page.click("#problemTab");
  await page.emulateMedia({ media: "print" });
  const printItems = await page.evaluate(() => [...document.querySelectorAll(".question-item")].map(item => {
    const itemBox = item.getBoundingClientRect();
    return [...item.querySelectorAll(".question-prompt svg")].every(svg => {
      const box = svg.getBoundingClientRect();
      return box.width > 0 && box.height > 0 && box.left >= itemBox.left - 1 && box.right <= itemBox.right + 1 && box.top >= itemBox.top - 1 && box.bottom <= itemBox.bottom + 1;
    });
  }));
  if (printItems.length !== state.items.length || printItems.some(inside => !inside)) failures.push("A4 문제지: 그림이 문항 영역에서 잘립니다.");
  await page.pdf({ path: path.join(outputDir, "a4-problem.pdf"), format: "A4", printBackground: true, preferCSSPageSize: true });
  await page.emulateMedia({ media: "screen" });
};

const near = (actual, expected, tolerance = 0.25) => Math.abs(actual - expected) <= tolerance;

const inspect = async (browser, viewport, label, failures) => {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  page.on("pageerror", error => failures.push(`${label}: 브라우저 오류 ${error.message}`));
  await page.goto(`${baseUrl}?type=${typeId}&review=1`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
  const generatorKey = await currentGeneratorKey(page);
  if (generatorKey !== legacyGeneratorKey) {
    await inspectMovedType(page, label, failures, generatorKey);
    await page.close();
    return;
  }

  const state = await page.evaluate(() => ({
    documentOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    items: [...document.querySelectorAll(".question-item")].map(item => {
      const prompt = item.querySelector(".question-prompt");
      const svg = prompt?.querySelector(".perpendicular-two-unknown");
      const bounds = svg?.getBoundingClientRect();
      const lineData = line => line ? ["x1", "y1", "x2", "y2"].map(name => Number(line.getAttribute(name))) : [];
      const markData = group => {
        const path = group.querySelector(".perpendicular-angle-arc");
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
          labelRadius: Number(group.getAttribute("data-label-radius")),
          label: [Number(text?.getAttribute("x")), Number(text?.getAttribute("y"))],
          labelText: text?.textContent || "",
          pathLength: path?.getTotalLength() || 0,
          pathVisible: Boolean(pathBounds && pathBounds.width >= 1 && pathBounds.height >= 1 && pathBounds.width + pathBounds.height >= 6 && style && style.stroke !== "none" && Number.parseFloat(style.strokeWidth) >= 1.5),
          labelVisible: Boolean(textBounds && textBounds.width >= 8 && textBounds.height >= 8)
        };
      };
      return {
        text: prompt?.textContent?.replace(/\s+/g, " ").trim() || "",
        data: (svg?.getAttribute("data-perpendicular-angles") || "").split(",").map(Number),
        bases: [...(svg?.querySelectorAll(".perpendicular-base") || [])].map(lineData),
        slants: [...(svg?.querySelectorAll(".perpendicular-slant") || [])].map(lineData),
        marks: [...(svg?.querySelectorAll(".perpendicular-angle-mark") || [])].map(markData),
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
    const marks = Object.fromEntries(item.marks.map(mark => [mark.role, mark]));
    const expectedMarks = {
      "left-given": { value: leftGiven, start: 180, span: leftGiven, label: `${leftGiven}°`, region: ([x, y], [cx, cy]) => x < cx && y > cy },
      "right-given": { value: rightGiven, start: 360 - rightGiven, span: rightGiven, label: `${rightGiven}°`, region: ([x, y], [cx, cy]) => x > cx && y > cy },
      "target-left": { value: firstTarget, start: 90, span: firstTarget, label: "㉠", region: ([x, y], [cx, cy]) => x < cx && y < cy },
      "target-right": { value: secondTarget, start: leftGiven, span: secondTarget, label: "㉡", region: ([x, y], [cx, cy]) => x > cx && y < cy }
    };
    if (item.marks.length !== 4) failures.push(`${label} ${index + 1}번: 원문에 있는 네 각호가 모두 표시되지 않았습니다.`);
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
      if (mark.labelText !== expected.label || mark.pathLength < 7 || !mark.pathVisible || !mark.labelVisible) failures.push(`${label} ${index + 1}번: ${role} 각호나 글자가 화면에서 선명하게 보이지 않습니다.`);
    });

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
  if (label === "desktop") {
    await page.emulateMedia({ media: "print" });
    await page.pdf({ path: path.join(outputDir, "a4-solution.pdf"), format: "A4", printBackground: true, preferCSSPageSize: true });
    await page.emulateMedia({ media: "screen" });
    await page.click("#problemTab");
    await page.emulateMedia({ media: "print" });
    const printItems = await page.evaluate(() => [...document.querySelectorAll(".question-item")].map(item => {
      const svg = item.querySelector(".perpendicular-two-unknown");
      const itemBounds = item.getBoundingClientRect();
      const svgBounds = svg?.getBoundingClientRect();
      const marks = [...(svg?.querySelectorAll(".perpendicular-angle-mark") || [])].map(group => {
        const path = group.querySelector(".perpendicular-angle-arc");
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
    if (printItems.length !== 3 || printItems.some(item => !item.svgInside || item.markCount !== 4 || !item.marksVisible)) failures.push("A4 문제지: 네 각호·글자 또는 그림이 문항 영역에서 잘립니다.");
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
    console.error(`4-2 사각형 수직선 사이 두 각 브라우저 감사 실패: ${failures.length}건`);
    console.error(failures.join("\n"));
    process.exit(1);
  }
  console.log(`4-2 사각형 수직선 사이 두 각 브라우저 감사 통과: PC·모바일 문제/풀이 4화면 · A4 문제/풀이 2파일 · ${outputDir}`);
})().catch(error => {
  console.error(error);
  process.exit(1);
});
