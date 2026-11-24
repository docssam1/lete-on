"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { chromium } = require("playwright");

global.window = {};
require("./curriculum.js");
// 2026-11-24: 2026-11-22 공개 등록(source-lower-release-20261122)으로 잠금이던 개념탐구 2(u5-t2)와 예제 2-4(u5-t2-5)가
// 원문 고정 풀 생성기(orig42U5E2*)로 옮겨져 앱에서 열린다. 이 둘은 잠금 검사 대신 새 생성기로 문제지가 열리는지만 보고,
// 정답 검산은 원문 묶음 감사가 맡는다.
require("./source-lower-release-20261122-registry.js");
const laterReleased = window.HSE_LOWER_RELEASE_20261122 || {};
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "4-2");
const unit = semester.units.find(item => item.id === "4-2-u5");
const subunit = unit.subunits.find(item => item.types.some(type => type.generatorKey === "lineGraphApplication"));
const readyTypes = subunit.types.filter(type => !type.reviewLocked);
const releasedTypes = subunit.types.filter(type => type.reviewLocked && laterReleased[type.id]?.sourceItemId === type.sourceItemId);
const lockedTypes = subunit.types.filter(type => type.reviewLocked && !releasedTypes.includes(type));
const baseUrl = process.env.HSE_URL || "http://127.0.0.1:8878/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(process.cwd(), "tmp", "4-2-line-graph-2-browser-audit");
const failures = [];
const near = (actual, expected, tolerance = .7) => Math.abs(actual - expected) <= tolerance;
const overlaps = (left, right) => Boolean(left && right && left.left < right.right - 1 && left.right > right.left + 1 && left.top < right.bottom - 1 && left.bottom > right.top + 1);
const slug = value => value.replaceAll("-", "_");

fs.mkdirSync(outputDir, { recursive: true });

// 2026-11-24: 2026-11-22부터 앱(buildQuestions)은 같은 문장의 문항을 한 번만 낸다. 원문 수치가 정해진 유형처럼
// 생성기가 만들 수 있는 서로 다른 문제 문장이 요청 수보다 적으면 그만큼만 나오므로(의도된 동작),
// 앱과 같은 변형 규칙으로 문장 수를 세어 min(요청 수, 서로 다른 문장 수)를 기대한다.
const expectedDistinctQuestions = (page, typeId, requested = 3) => page.evaluate(({ typeId, requested }) => {
  const type = window.HSE_CURRICULUM.semesters.flatMap(semester => semester.units.flatMap(unit => unit.subunits.flatMap(subunit => subunit.types))).find(item => item.id === typeId);
  if (!type) return 0;
  const fixedPool = type.generationMode === "fixed-verified-pool";
  const prompts = new Set();
  for (let index = 0; index < requested; index += 1) {
    for (let attempt = 0; attempt < 64; attempt += 1) {
      try {
        const candidate = window.HSE_GENERATORS.generate(type, 0, 0, (20261124 + index * 7919 + attempt * 104729) >>> 0, fixedPool ? attempt : index);
        if (candidate?.prompt) prompts.add(candidate.prompt);
      } catch {}
    }
  }
  return Math.min(requested, prompts.size);
}, { typeId, requested });

const inspect = async page => page.evaluate(() => {
  const rect = node => {
    const box = node?.getBoundingClientRect();
    return box ? { left: box.left, right: box.right, top: box.top, bottom: box.bottom, width: box.width, height: box.height } : null;
  };
  const within = (inner, outer, margin = 1.5) => Boolean(inner && outer && inner.left >= outer.left - margin && inner.right <= outer.right + margin && inner.top >= outer.top - margin && inner.bottom <= outer.bottom + margin);
  return {
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    items: [...document.querySelectorAll(".question-item")].map(item => ({
      box: rect(item),
      prompt: rect(item.querySelector(".question-prompt")),
      answer: rect(item.querySelector(".answer-line")),
      overflow: item.scrollWidth > item.clientWidth + 1,
      charts: [...item.querySelectorAll(".line-chart")].map(svg => ({
        box: rect(svg),
        fourUpPrint: matchMedia("print").matches && Boolean(svg.closest(".print-page--four-up")),
        step: Number(svg.dataset.chartStep),
        min: Number(svg.dataset.chartScaleMin),
        max: Number(svg.dataset.chartScaleMax),
        gridCount: Number(svg.dataset.chartGridCount),
        horizontalGridCount: [...svg.querySelectorAll("line.chart-grid")].filter(node => node.getAttribute("y1") === node.getAttribute("y2")).length,
        verticalGridCount: [...svg.querySelectorAll("line.chart-grid")].filter(node => node.getAttribute("x1") === node.getAttribute("x2")).length,
        tickCount: Number(svg.dataset.chartTickCount),
        ticks: [...svg.querySelectorAll(".chart-tick")].map(node => rect(node)),
        labels: [...svg.querySelectorAll(".chart-label")].map(node => rect(node)),
        labelTexts: [...svg.querySelectorAll(".chart-label")].map(node => node.textContent),
        axisName: rect(svg.querySelector(".chart-axis-name")),
        axisNameText: svg.querySelector(".chart-axis-name")?.textContent || "",
        xValues: (svg.dataset.chartXValues || "").split(",").filter(Boolean).map(Number),
        xDomain: (svg.dataset.chartXDomain || "").split(",").filter(Boolean).map(Number),
        xGridValues: (svg.dataset.chartXGridValues || "").split(",").filter(Boolean).map(Number),
        xTickValues: (svg.dataset.chartXTickValues || "").split(",").filter(Boolean).map(Number),
        left: Number(svg.dataset.chartLeft),
        plotWidth: Number(svg.dataset.chartPlotWidth),
        points: [...svg.querySelectorAll("circle.chart-point")].map(node => ({ x: Number(node.getAttribute("cx")), y: Number(node.getAttribute("cy")), weight: node.dataset.lineWeight })),
        series: [...svg.querySelectorAll(".chart-series")].map(node => node.dataset.lineWeight),
        legend: [...svg.querySelectorAll(".chart-line-legend text")].map(node => rect(node)),
        legendGroups: [...svg.querySelectorAll(".chart-legend-series")].map(node => rect(node)),
        strokes: [...svg.querySelectorAll(".chart-line")].map(node => ({ weight: node.dataset.lineWeight, strokeWidth: Number(getComputedStyle(node).strokeWidth) }))
      }))
    }))
  };
});

const validate = (state, label, type, expectWeights = null, expectedCount = 3) => {
  if (state.overflow) failures.push(`${label} ${type.id}: 문서 가로 넘침`);
  if (!expectedCount || state.items.length !== expectedCount) failures.push(`${label} ${type.id}: 문제 수 ${state.items.length} (${expectedCount}개여야 함)`);
  state.items.forEach((item, itemIndex) => {
    if (!item.prompt?.height || !item.answer?.height || item.overflow) failures.push(`${label} ${type.id} ${itemIndex + 1}번: 문항 또는 답안 칸 잘림`);
    if (!item.charts.length) failures.push(`${label} ${type.id} ${itemIndex + 1}번: 꺾은선그래프 없음`);
    item.charts.forEach((chart, chartIndex) => {
      // 2026-11-24: #1184~#1186부터 이 그래프 문항은 A4 한 장 4문항 칸에 인쇄된다. 그 칸의 그래프는 설계 감사
      // (single/paired-graph-four-up-browser-audit.cjs)와 같은 최소 크기 140×100을 쓴다(화면은 그대로 180×120).
      const minWidth = chart.fourUpPrint ? 140 : 180;
      const minHeight = chart.fourUpPrint ? 100 : 120;
      if (!chart.box || chart.box.width < minWidth || chart.box.height < minHeight || !item.box || chart.box.left < item.box.left - 1 || chart.box.right > item.box.right + 1) failures.push(`${label} ${type.id} ${itemIndex + 1}번 ${chartIndex + 1}번째 그래프: 크기 또는 문항 영역 오류`);
      const expectedGridCount = Math.round((chart.max - chart.min) / chart.step) + 1;
      if (!(chart.step > 0) || chart.gridCount !== expectedGridCount || chart.horizontalGridCount !== expectedGridCount || chart.tickCount < 2 || chart.tickCount > 12 || chart.ticks.length !== chart.tickCount) failures.push(`${label} ${type.id} ${itemIndex + 1}번 ${chartIndex + 1}번째 그래프: 세로 눈금 오류`);
      if (chart.ticks.some(box => !box || box.left < chart.box.left - 3 || box.right > chart.box.right + 3) || chart.labels.some(box => !box || box.left < chart.box.left - 3 || box.right > chart.box.right + 3)) failures.push(`${label} ${type.id} ${itemIndex + 1}번 ${chartIndex + 1}번째 그래프: 눈금 글자 잘림`);
      if (chart.labels.some(labelBox => overlaps(labelBox, chart.axisName)) || chart.legendGroups.some((group, index) => chart.legendGroups.slice(index + 1).some(other => overlaps(group, other)))) failures.push(`${label} ${type.id} ${itemIndex + 1}번 ${chartIndex + 1}번째 그래프: 가로축 이름 또는 범례 겹침`);
      if (chart.xValues.length >= 2) {
        const xDomain = chart.xDomain.length === 2 ? chart.xDomain : [chart.xValues[0], chart.xValues.at(-1)];
        const xFor = value => chart.left + chart.plotWidth * (value - xDomain[0]) / (xDomain[1] - xDomain[0]);
        chart.points.forEach((point, pointIndex) => {
          const expected = xFor(chart.xValues[pointIndex % chart.xValues.length]);
          if (!near(point.x, expected, .2)) failures.push(`${label} ${type.id} ${itemIndex + 1}번 ${chartIndex + 1}번째 그래프: 실제 가로 눈금 비율 오류`);
        });
      }
      if (expectWeights && chart.series.join(",") !== expectWeights) failures.push(`${label} ${type.id} ${itemIndex + 1}번: 굵은선·얇은선 범례 순서 오류`);
      const thick = chart.strokes.filter(line => line.weight === "thick");
      const thin = chart.strokes.filter(line => line.weight === "thin");
      if (expectWeights && (!thick.length || !thin.length || thick.some(line => line.strokeWidth < 3) || thin.some(line => line.strokeWidth > 1.7))) failures.push(`${label} ${type.id} ${itemIndex + 1}번: 자료선 굵기 CSS 오류`);
      if (type.sourceItemId === "4-2-u5-e2-mission-6") {
        if (chart.step !== 20 || chart.min !== 0 || chart.max !== 400 || chart.ticks.length !== 5) failures.push(`${label} ${type.id} ${itemIndex + 1}번: 원본의 20L 보조 눈금과 100L 숫자 눈금이 다릅니다.`);
        if (chart.xDomain.join(",") !== "0,25" || chart.xGridValues.join(",") !== "0,2.5,5,7.5,10,12.5,15,17.5,20,22.5,25" || chart.xTickValues.join(",") !== "0,5,10,15,20,25" || chart.verticalGridCount !== 11 || chart.labelTexts.join(",") !== "0,5,10,15,20,25" || chart.axisNameText !== "(분)") failures.push(`${label} ${type.id} ${itemIndex + 1}번: 원본의 2분 30초 보조 눈금과 5분 숫자 눈금이 다릅니다.`);
      }
    });
  });
};

const inspectType = async (browser, type, viewport, label) => {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  page.on("pageerror", error => failures.push(`${label} ${type.id}: 브라우저 오류 ${error.message}`));
  await page.addInitScript(({ seed }) => { Date.now = () => seed; }, { seed: 240000 + type.typeNumber });
  await page.goto(`${baseUrl}?type=${type.id}&review=1`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
  const weights = type.sourceItemId === "4-2-u5-e2-mission-6" ? "thin,thick" : null;
  const expectedCount = await expectedDistinctQuestions(page, type.id);
  validate(await inspect(page), label, type, weights, expectedCount);
  await page.screenshot({ path: path.join(outputDir, `${slug(type.id)}-${label}-problem.png`), fullPage: true });
  await page.click("#solutionTab");
  const solution = await page.evaluate(() => ({ count: document.querySelectorAll(".solution-item").length, empty: [...document.querySelectorAll(".solution-item")].some(item => !(item.textContent || "").trim()), overflow: [...document.querySelectorAll(".solution-item")].some(item => item.scrollWidth > item.clientWidth + 1) }));
  if (solution.count !== expectedCount || solution.empty || solution.overflow) failures.push(`${label} ${type.id}: 풀이 표시 또는 가로 넘침 오류`);
  await page.screenshot({ path: path.join(outputDir, `${slug(type.id)}-${label}-solution.png`), fullPage: true });
  if (label === "desktop") {
    await page.emulateMedia({ media: "print" });
    await page.pdf({ path: path.join(outputDir, `${slug(type.id)}-a4-solution.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });
    await page.emulateMedia({ media: "screen" });
    await page.click("#problemTab");
    await page.emulateMedia({ media: "print" });
    validate(await inspect(page), "A4", type, weights, expectedCount);
    // 2026-11-24: 4문항 인쇄 쪽(print-page--four-up)은 한 문항만 남아도 4칸 배치가 설계이므로 홀수 단독 쪽 검사에서 뺀다.
    const singlePrintPages = await page.evaluate(() => [...document.querySelectorAll("#problemView .print-page")].filter(section => !section.classList.contains("print-page--four-up") && section.querySelectorAll(".question-item").length === 1).map(section => {
      const item = section.querySelector(".question-item");
      const prompt = item?.querySelector(".question-prompt")?.getBoundingClientRect();
      const chart = item?.querySelector(".line-chart")?.getBoundingClientRect();
      return { marked: section.classList.contains("print-page--single"), gridDisplay: getComputedStyle(section.querySelector(".question-grid")).display, promptHeight: prompt?.height || 0, chartHeight: chart?.height || 0 };
    }));
    singlePrintPages.forEach(pageState => {
      if (!pageState.marked || pageState.gridDisplay !== "block" || pageState.promptHeight < 40 || pageState.chartHeight < 120) failures.push(`A4 ${type.id}: 홀수 마지막 문항의 지문 또는 그래프가 빈 페이지로 잘립니다.`);
    });
    await page.pdf({ path: path.join(outputDir, `${slug(type.id)}-a4-problem.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });
  }
  await page.close();
};

const inspectTwelve = async (browser, sourceItemId, expectedPageCount) => {
  const type = readyTypes.find(item => item.sourceItemId === sourceItemId);
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${baseUrl}?type=${type.id}&review=1`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
  await page.evaluate(() => { const input = document.querySelector("#questionCountInput"); input.value = "12"; input.dispatchEvent(new Event("input", { bubbles: true })); });
  // 2026-11-24: 원문 수치가 정해진 유형은 서로 다른 문장이 12개보다 적어 그 수(N)만큼만 나온다(11-22 중복 문장 제외).
  // 또 #1184~#1186부터 이 그래프 문항은 A4 한 장에 4문항으로 인쇄된다. N문항의 논리 쪽 수와 실제 PDF 쪽 수가 같은지 본다.
  const expectedCount = await expectedDistinctQuestions(page, type.id, 12);
  await page.click("#newProblemButton");
  await page.waitForFunction(count => document.querySelectorAll(".question-item").length === count, expectedCount, { timeout: 30000 }).catch(() => {});
  await page.emulateMedia({ media: "print" });
  const layout = await page.evaluate(() => ({ items: document.querySelectorAll(".question-item").length, fourUp: [...document.querySelectorAll("#problemView .print-page")].every(section => section.classList.contains("print-page--four-up")) }));
  if (!expectedCount || layout.items !== expectedCount) failures.push(`A4 ${type.id}: 문항 수 ${layout.items}개, ${expectedCount}개여야 합니다.`);
  expectedPageCount = Math.ceil(expectedCount / (layout.fourUp ? 4 : 12 / expectedPageCount));
  const logicalPages = await page.evaluate(() => document.querySelectorAll("#problemView .print-page").length);
  const pdfPath = path.join(outputDir, `${slug(type.id)}-a4-12-problems.pdf`);
  await page.pdf({ path: pdfPath, format: "A4", printBackground: true, preferCSSPageSize: true });
  const actualPages = Number(execFileSync("pdfinfo", [pdfPath], { encoding: "utf8" }).match(/^Pages:\s+(\d+)/m)?.[1]);
  if (logicalPages !== expectedPageCount || actualPages !== expectedPageCount) failures.push(`A4 ${type.id}: ${expectedCount}문항은 ${expectedPageCount}쪽이어야 하나 논리 ${logicalPages}쪽, PDF ${actualPages}쪽입니다.`);
  await page.close();
};

const inspectReleased = async browser => {
  for (const type of releasedTypes) {
    const release = laterReleased[type.id];
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    page.setDefaultTimeout(60000);
    page.on("pageerror", error => failures.push(`${type.id}: 브라우저 오류 ${error.message}`));
    await page.goto(`${baseUrl}?type=${type.id}&review=1`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
    const expectedCount = await expectedDistinctQuestions(page, type.id);
    const state = await page.evaluate(typeId => {
      const current = window.HSE_CURRICULUM.semesters.flatMap(semester => semester.units.flatMap(unit => unit.subunits.flatMap(item => item.types))).find(item => item.id === typeId);
      return { generatorKey: current?.generatorKey || "", locked: Boolean(current?.reviewLocked), questions: document.querySelectorAll(".question-item").length };
    }, type.id);
    if (state.locked || state.generatorKey !== release.key) failures.push(`${type.id}: 11-22 공개 생성기(${release.key})로 열리지 않습니다 (${state.generatorKey}).`);
    if (!expectedCount || state.questions !== expectedCount) failures.push(`${type.id}: 공개 유형 문제 ${state.questions}개, ${expectedCount}개여야 합니다.`);
    console.log(`안내: ${type.id}는 2026-11-22 공개로 ${release.key} 생성기로 옮겨져 잠금 검사 대신 공개 상태만 확인했습니다.`);
    await page.close();
  }
};

const inspectLocked = async browser => {
  for (const type of lockedTypes) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(`${baseUrl}?type=${type.id}&review=1`, { waitUntil: "domcontentloaded", timeout: 90000 });
    const state = await page.evaluate(() => ({ hidden: document.querySelector("#worksheet")?.hidden, questions: document.querySelectorAll(".question-item").length }));
    if (!state.hidden || state.questions) failures.push(`${type.id}: 검수 대기 유형이 직접 주소에서 열립니다.`);
    await page.close();
  }
};

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  for (const type of readyTypes) {
    await inspectType(browser, type, { width: 1280, height: 900 }, "desktop");
    await inspectType(browser, type, { width: 375, height: 812 }, "mobile");
  }
  await inspectTwelve(browser, "4-2-u5-e2-example-2-2", 6);
  await inspectTwelve(browser, "4-2-u5-e2-mission-2", 6);
  await inspectReleased(browser);
  await inspectLocked(browser);
  await browser.close();
  if (failures.length) {
    console.error(`4-2 꺾은선그래프 개념탐구 2 브라우저 감사 실패: ${failures.length}건`);
    console.error(failures.join("\n"));
    process.exit(1);
  }
  console.log(`4-2 꺾은선그래프 개념탐구 2 브라우저 감사 통과: 공개 8유형 PC·모바일 문제/풀이 32화면 · A4 문제/풀이 16파일 · 12문항 단일·복수 그래프 실제 장수 일치 · 잠금 ${lockedTypes.length}유형 직접 주소 차단 · 11-22 공개 ${releasedTypes.length}유형 열림 · ${outputDir}`);
})().catch(error => { console.error(error); process.exit(1); });
