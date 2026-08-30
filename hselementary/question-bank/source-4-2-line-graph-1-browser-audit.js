"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { chromium } = require("playwright");

const baseUrl = process.env.HSE_URL || "http://127.0.0.1:8878/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(process.cwd(), "tmp", "4-2-line-graph-1-browser-audit");
const readyTypeIds = Array.from({ length: 10 }, (_, index) => `4-2-u5-t1${index ? `-${index + 1}` : ""}`);
const lockedTypeIds = [];
const near = (actual, expected, tolerance = 0.7) => Math.abs(actual - expected) <= tolerance;
const slug = value => value.replaceAll("-", "_");

fs.mkdirSync(outputDir, { recursive: true });

const inspectCharts = async page => page.evaluate(() => {
  const rect = node => {
    const bounds = node?.getBoundingClientRect();
    return bounds ? { left: bounds.left, right: bounds.right, top: bounds.top, bottom: bounds.bottom, width: bounds.width, height: bounds.height } : null;
  };
  const inside = (inner, outer, tolerance = 1.5) => Boolean(inner && outer && inner.left >= outer.left - tolerance && inner.right <= outer.right + tolerance && inner.top >= outer.top - tolerance && inner.bottom <= outer.bottom + tolerance);
  const overlaps = (left, right) => Boolean(left && right && left.left < right.right - 1 && left.right > right.left + 1 && left.top < right.bottom - 1 && left.bottom > right.top + 1);

  return {
    documentOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    items: [...document.querySelectorAll(".question-item")].map(item => {
      const itemBounds = rect(item);
      const prompt = item.querySelector(".question-prompt");
      const charts = [...item.querySelectorAll(".line-chart, .bar-chart")].map(svg => {
        const svgBounds = rect(svg);
        const kind = svg.dataset.chartKind;
        const step = Number(svg.dataset.chartStep);
        const scaleMin = Number(svg.dataset.chartScaleMin || 0);
        const scaleMax = Number(svg.dataset.chartScaleMax);
        const top = Number(svg.dataset.chartTop);
        const plotHeight = Number(svg.dataset.chartPlotHeight);
        const values = (svg.dataset.chartValues || "").split(";").filter(Boolean).map(series => series.split(",").map(Number));
        const circles = [...svg.querySelectorAll("circle.chart-point")].map(node => ({ value: Number(node.dataset.chartValue), cy: Number(node.getAttribute("cy")) }));
        const hidden = [...svg.querySelectorAll(".chart-question")].map(node => ({ text: node.textContent, bounds: rect(node), index: Number(node.dataset.chartHiddenIndex) }));
        const ticks = [...svg.querySelectorAll(".chart-tick")].map(node => ({ text: node.textContent, bounds: rect(node) }));
        const labels = [...svg.querySelectorAll(".chart-label")].map(node => ({ text: node.textContent, bounds: rect(node) }));
        const legendLabels = [...svg.querySelectorAll(".chart-line-legend text")].map(node => ({ text: node.textContent, bounds: rect(node) }));
        const legendGroups = [...svg.querySelectorAll(".chart-legend-series")].map(node => rect(node));
        const axisName = rect(svg.querySelector(".chart-axis-name"));
        const lineWeights = [...svg.querySelectorAll(".chart-series")].map(node => node.dataset.lineWeight);
        const horizontalGridCount = [...svg.querySelectorAll("line.chart-grid")].filter(node => node.getAttribute("y1") === node.getAttribute("y2")).length;
        const verticalGridCount = [...svg.querySelectorAll("line.chart-grid")].filter(node => node.getAttribute("x1") === node.getAttribute("x2")).length;
        const strokes = [...svg.querySelectorAll(".chart-line")].map(node => ({ weight: node.dataset.lineWeight, strokeWidth: Number(getComputedStyle(node).strokeWidth) }));
        const legendOverlap = legendLabels.some((entry, index) => legendLabels.slice(index + 1).some(other => overlaps(entry.bounds, other.bounds)));
        const legendGroupOverlap = legendGroups.some((entry, index) => legendGroups.slice(index + 1).some(other => overlaps(entry, other)));
        const axisLabelOverlap = labels.some(entry => overlaps(entry.bounds, axisName));
        const tickOverlap = ticks.some((entry, index) => ticks.slice(index + 1).some(other => overlaps(entry.bounds, other.bounds)));
        const expectedY = value => top + plotHeight - (value - scaleMin) / (scaleMax - scaleMin) * plotHeight;
        return {
          kind,
          step,
          scaleMin,
          scaleMax,
          gridCount: Number(svg.dataset.chartGridCount),
          tickCount: Number(svg.dataset.chartTickCount),
          horizontalGridCount,
          verticalGridCount,
          values,
          visible: Boolean(svgBounds && svgBounds.width >= 180 && svgBounds.height >= 120),
          insideItem: inside(svgBounds, itemBounds),
          ticksInside: ticks.every(entry => inside(entry.bounds, svgBounds, 3)),
          labelsInside: labels.every(entry => inside(entry.bounds, svgBounds, 3)),
          legendsInside: legendLabels.every(entry => inside(entry.bounds, svgBounds, 3)),
          legendOverlap,
          legendGroupOverlap,
          axisLabelOverlap,
          tickOverlap,
          lineWeights,
          strokes,
          ticks: ticks.map(entry => entry.text),
          labelTexts: labels.map(entry => entry.text),
          axisNameText: svg.querySelector(".chart-axis-name")?.textContent || "",
          hidden,
          circleMismatch: kind === "line" ? circles.filter(circle => Math.abs(circle.cy - expectedY(circle.value)) > 0.2).length : 0
        };
      });
      return {
        charts,
        itemOverflow: item.scrollWidth > item.clientWidth + 1,
        promptVisible: Boolean(rect(prompt)?.height),
        answerVisible: Boolean(rect(item.querySelector(".answer-line"))?.height)
      };
    })
  };
});

const validateState = (state, label, typeId, failures) => {
  if (state.documentOverflow) failures.push(`${label} ${typeId}: 문서 가로 넘침`);
  if (state.items.length !== 3) failures.push(`${label} ${typeId}: 문제 수 ${state.items.length}`);
  state.items.forEach((item, itemIndex) => {
    if (!item.promptVisible || !item.answerVisible || item.itemOverflow) failures.push(`${label} ${typeId} ${itemIndex + 1}번: 문항 또는 답안 칸 잘림`);
    if (!item.charts.length) failures.push(`${label} ${typeId} ${itemIndex + 1}번: 그래프 없음`);
    item.charts.forEach((chart, chartIndex) => {
      if (!chart.visible || !chart.insideItem) failures.push(`${label} ${typeId} ${itemIndex + 1}번 ${chartIndex + 1}번째 그래프: 크기 또는 문항 영역 이탈`);
      if (!Number.isFinite(chart.step) || chart.step <= 0 || !Number.isFinite(chart.scaleMax) || chart.scaleMax <= chart.scaleMin) failures.push(`${label} ${typeId} ${itemIndex + 1}번 ${chartIndex + 1}번째 그래프: 눈금 자료 오류`);
      if (!chart.ticksInside || !chart.labelsInside || !chart.legendsInside || chart.legendOverlap || chart.legendGroupOverlap || chart.axisLabelOverlap || chart.tickOverlap) failures.push(`${label} ${typeId} ${itemIndex + 1}번 ${chartIndex + 1}번째 그래프: 눈금·항목·범례 겹침 또는 잘림`);
      if (chart.circleMismatch) failures.push(`${label} ${typeId} ${itemIndex + 1}번 ${chartIndex + 1}번째 그래프: 점 좌표 ${chart.circleMismatch}개 불일치`);
      if (chart.kind === "line") {
        const expectedGridCount = Math.round((chart.scaleMax - chart.scaleMin) / chart.step) + 1;
        if (chart.gridCount !== expectedGridCount || chart.horizontalGridCount !== expectedGridCount) failures.push(`${label} ${typeId} ${itemIndex + 1}번 ${chartIndex + 1}번째 그래프: 보조 눈금선 수 불일치`);
        if (chart.tickCount < 2 || chart.tickCount > 12 || chart.ticks.length !== chart.tickCount) failures.push(`${label} ${typeId} ${itemIndex + 1}번 ${chartIndex + 1}번째 그래프: 숫자 눈금 수 불일치`);
      }
      if (chart.hidden.some(hidden => hidden.text !== "?" || !hidden.bounds || hidden.bounds.width < 5 || hidden.bounds.height < 8)) failures.push(`${label} ${typeId} ${itemIndex + 1}번: 숨긴 값 물음표가 선명하지 않음`);
      if (typeId === "4-2-u5-t1-10") {
        const thick = chart.strokes.filter(line => line.weight === "thick");
        const thin = chart.strokes.filter(line => line.weight === "thin");
        if (chart.lineWeights.join(",") !== "thick,thin") failures.push(`${label} ${typeId} ${itemIndex + 1}번: 아이스크림 굵은선·초콜릿 얇은선 범례가 다릅니다.`);
        if (!thick.length || !thin.length || thick.some(line => line.strokeWidth < 3) || thin.some(line => line.strokeWidth > 1.7)) failures.push(`${label} ${typeId} ${itemIndex + 1}번: 굵은선·얇은선의 실제 두께가 구별되지 않습니다.`);
        if (chart.step !== 10 || chart.scaleMin !== 200 || chart.scaleMax !== 350 || chart.ticks.join(",") !== "200,250,300,350") failures.push(`${label} ${typeId} ${itemIndex + 1}번: 원본의 10개 단위 보조 눈금과 50개 단위 숫자 눈금이 다릅니다.`);
        if (chart.verticalGridCount !== 4 || chart.labelTexts.join(",") !== "6,8,10,12" || chart.axisNameText !== "(월)") failures.push(`${label} ${typeId} ${itemIndex + 1}번: 원본의 월 눈금 표시가 다릅니다.`);
      }
    });
  });
};

const inspectReadyType = async (browser, typeId, viewport, label, failures) => {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  page.on("pageerror", error => failures.push(`${label} ${typeId}: 브라우저 오류 ${error.message}`));
  await page.addInitScript(({ seed }) => { Date.now = () => seed; }, { seed: 1729 + readyTypeIds.indexOf(typeId) * 1009 });
  await page.goto(`${baseUrl}?type=${typeId}&review=1`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
  validateState(await inspectCharts(page), label, typeId, failures);
  await page.screenshot({ path: path.join(outputDir, `${slug(typeId)}-${label}-problem.png`), fullPage: true });

  await page.click("#solutionTab");
  const solutionState = await page.evaluate(() => ({
    count: document.querySelectorAll(".solution-item").length,
    empty: [...document.querySelectorAll(".solution-item")].some(item => !(item.textContent || "").trim()),
    overflow: [...document.querySelectorAll(".solution-item")].some(item => item.scrollWidth > item.clientWidth + 1),
    chartCount: document.querySelectorAll(".solution-item .line-chart, .solution-item .bar-chart").length
  }));
  if (solutionState.count !== 3 || solutionState.empty || solutionState.overflow) failures.push(`${label} ${typeId}: 풀이 3개 또는 풀이 영역 표시 오류`);
  await page.screenshot({ path: path.join(outputDir, `${slug(typeId)}-${label}-solution.png`), fullPage: true });

  if (label === "desktop") {
    await page.emulateMedia({ media: "print" });
    const solutionPrint = await page.evaluate(() => [...document.querySelectorAll(".solution-item")].every(item => item.scrollWidth <= item.clientWidth + 1));
    if (!solutionPrint) failures.push(`A4 ${typeId}: 풀이 영역 넘침`);
    await page.pdf({ path: path.join(outputDir, `${slug(typeId)}-a4-solution.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });
    await page.emulateMedia({ media: "screen" });
    await page.click("#problemTab");
    await page.emulateMedia({ media: "print" });
    validateState(await inspectCharts(page), "A4", typeId, failures);
    const singlePrintPages = await page.evaluate(() => [...document.querySelectorAll("#problemView .print-page")].filter(section => section.querySelectorAll(".question-item").length === 1).map(section => {
      const item = section.querySelector(".question-item");
      const prompt = item?.querySelector(".question-prompt")?.getBoundingClientRect();
      const chart = item?.querySelector(".line-chart, .bar-chart")?.getBoundingClientRect();
      return { marked: section.classList.contains("print-page--single"), gridDisplay: getComputedStyle(section.querySelector(".question-grid")).display, promptHeight: prompt?.height || 0, chartHeight: chart?.height || 0 };
    }));
    singlePrintPages.forEach(pageState => {
      if (!pageState.marked || pageState.gridDisplay !== "block" || pageState.promptHeight < 40 || pageState.chartHeight < 120) failures.push(`A4 ${typeId}: 홀수 마지막 문항의 지문 또는 그래프가 빈 페이지로 잘립니다.`);
    });
    const multiGraphPrint = await page.evaluate(() => [...document.querySelectorAll(".question-item")].map((item, index) => {
      const hasMultipleGraphs = item.querySelectorAll(".graph-figure").length > 1;
      const grid = item.closest(".question-grid");
      return {
        hasMultipleGraphs,
        gridDisplay: grid ? getComputedStyle(grid).display : "",
        questionsInPage: item.closest(".print-page")?.querySelectorAll(".question-item").length || 0,
        index
      };
    }));
    multiGraphPrint.filter(item => item.hasMultipleGraphs).forEach(item => {
      if (item.gridDisplay !== "block" || item.questionsInPage !== 1) failures.push(`A4 ${typeId} ${item.index + 1}번: 그래프가 두 개인 문항의 한 장 한 문항 배치가 적용되지 않음`);
    });
    await page.pdf({ path: path.join(outputDir, `${slug(typeId)}-a4-problem.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });
  }
  await page.close();
};

const inspectLockedTypes = async (browser, failures) => {
  for (const typeId of lockedTypeIds) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(`${baseUrl}?type=${typeId}&review=1`, { waitUntil: "domcontentloaded", timeout: 90000 });
    const state = await page.evaluate(() => ({
      worksheetHidden: document.querySelector("#worksheet")?.hidden,
      questionCount: document.querySelectorAll(".question-item").length
    }));
    if (!state.worksheetHidden || state.questionCount) failures.push(`${typeId}: 검수 대기 유형이 직접 주소에서 열림`);
    await page.close();
  }
};

const inspectLongPrint = async (browser, typeId, expectedQuestionsPerPage, failures) => {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.setDefaultTimeout(60000);
  await page.addInitScript(() => { Date.now = () => 86420; });
  await page.goto(`${baseUrl}?type=${typeId}&review=1`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
  await page.evaluate(() => {
    const input = document.querySelector("#questionCountInput");
    input.value = "12";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.click("#newProblemButton");
  await page.locator(".question-item").nth(11).waitFor({ state: "visible" });
  await page.emulateMedia({ media: "print" });
  const pageCounts = await page.evaluate(() => [...document.querySelectorAll("#problemView .print-page")].map(section => section.querySelectorAll(".question-item").length));
  const expectedPageCount = 12 / expectedQuestionsPerPage;
  if (pageCounts.length !== expectedPageCount || pageCounts.some(count => count !== expectedQuestionsPerPage)) failures.push(`A4 ${typeId}: 12문항 논리 페이지가 ${pageCounts.join(",")}로 나뉨`);
  const pdfPath = path.join(outputDir, `${slug(typeId)}-a4-12-problems.pdf`);
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(100);
  await page.pdf({ path: pdfPath, format: "A4", printBackground: true, preferCSSPageSize: true });
  const info = execFileSync("pdfinfo", [pdfPath], { encoding: "utf8" });
  const actualPageCount = Number(info.match(/^Pages:\s+(\d+)/m)?.[1]);
  if (actualPageCount !== expectedPageCount) failures.push(`A4 ${typeId}: 논리 ${expectedPageCount}쪽이 실제 PDF ${actualPageCount}쪽으로 분리됨`);
  await page.close();
};

(async () => {
  const failures = [];
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  for (const typeId of readyTypeIds) {
    await inspectReadyType(browser, typeId, { width: 1280, height: 900 }, "desktop", failures);
    await inspectReadyType(browser, typeId, { width: 375, height: 812 }, "mobile", failures);
  }
  await inspectLongPrint(browser, "4-2-u5-t1-5", 2, failures);
  await inspectLongPrint(browser, "4-2-u5-t1-8", 1, failures);
  await inspectLockedTypes(browser, failures);
  await browser.close();
  if (failures.length) {
    console.error(`4-2 꺾은선그래프 개념탐구 1 브라우저 감사 실패: ${failures.length}건`);
    console.error(failures.join("\n"));
    process.exit(1);
  }
  console.log(`4-2 꺾은선그래프 개념탐구 1 브라우저 감사 통과: 공개 10유형 PC·모바일 문제/풀이 40화면 · A4 문제/풀이 20파일 · 12문항 A4 단일·복수 그래프 실제 장수 일치 · 굵은선·얇은선 범례 확인 · ${outputDir}`);
})().catch(error => { console.error(error); process.exit(1); });
