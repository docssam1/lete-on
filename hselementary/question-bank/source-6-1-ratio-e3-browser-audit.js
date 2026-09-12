"use strict";

const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const root = path.resolve(__dirname, "../..");
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(os.tmpdir(), "source-6-1-ratio-e3-browser-audit");
const sourceIds = [
  "6-1-u4-e3-exploration-3-1", "6-1-u4-e3-example-3-1", "6-1-u4-e3-example-3-2", "6-1-u4-e3-example-3-3",
  "6-1-u4-e3-example-3-4", "6-1-u4-e3-mission-1", "6-1-u4-e3-mission-2", "6-1-u4-e3-mission-3",
  "6-1-u4-e3-mission-4", "6-1-u4-e3-mission-5", "6-1-u4-e3-mission-6"
];
const difficulties = [-1, 0, 1];
const failures = [];
let screenshots = 0;
let pdfs = 0;
let renderedPdfPages = 0;
let expectedPdfPages = 0;
const fail = message => failures.push(message);
const hasCommonMathFont = font => /Pretendard|Malgun Gothic|Arial|Noto Sans KR|sans-serif/i.test(String(font || ""));

function startServer() {
  const server = http.createServer((request, response) => {
    const requestPath = decodeURIComponent((request.url || "/").split("?")[0]);
    let relative = requestPath === "/" ? "/hselementary/question-bank/index.html" : requestPath;
    if (relative.endsWith("/")) relative += "index.html";
    const filePath = path.resolve(root, `.${relative}`);
    if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      response.writeHead(404); response.end("not found"); return;
    }
    const types = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".json": "application/json" };
    response.writeHead(200, { "Content-Type": `${types[path.extname(filePath)] || "application/octet-stream"}; charset=utf-8`, "Cache-Control": "no-store" });
    fs.createReadStream(filePath).pipe(response);
  });
  return new Promise(resolve => server.listen(0, "127.0.0.1", () => resolve({ server, baseUrl: `http://127.0.0.1:${server.address().port}` })));
}

function buildGenerator() {
  global.window = {};
  delete require.cache[require.resolve("./generators.js")];
  require("./generators.js");
  return window.HSE_GENERATORS;
}

async function inspect(page, generated, sourceId, difficulty, view, viewportName) {
  const content = view === "problem"
    ? `<main class="question-pages"><section class="question-item"><div class="question-prompt">${generated.prompt}</div></section></main>`
    : `<main class="answer-pages"><section class="solution-item"><div class="solution-answer-visual">${generated.answerVisual}</div><div class="solution-explanation">${generated.solution}</div></section></main>`;
  await page.evaluate(html => { document.body.innerHTML = html; }, content);
  await page.emulateMedia({ media: "screen" });
  await page.waitForTimeout(40);
  const state = await page.evaluate(() => {
    const item = document.querySelector(".question-item,.solution-item");
    const diagrams = [...document.querySelectorAll("svg.source61-ratio-e3-diagram")];
    const texts = diagrams.flatMap(svg => [...svg.querySelectorAll("text")].map(node => ({ box: node.getBoundingClientRect(), text: node.textContent })));
    const overlaps = [];
    texts.forEach((left, index) => texts.slice(index + 1).forEach((right, offset) => {
      if (left.box.left < right.box.right - 1 && left.box.right > right.box.left + 1 && left.box.top < right.box.bottom - 1 && left.box.bottom > right.box.top + 1) overlaps.push(`${index}:${index + offset + 1}`);
    }));
    const box = item?.getBoundingClientRect();
    const svg = diagrams[0];
    return {
      text: document.body.innerText || "",
      item: item ? { x: box.x, right: box.right, scrollWidth: item.scrollWidth, clientWidth: item.clientWidth } : null,
      pageOverflow: document.documentElement.scrollWidth > innerWidth + 2,
      overlaps,
      diagrams: diagrams.map(node => ({ structure: node.dataset.source61RatioE3Structure || "", values: node.dataset.source61RatioE3Values || "", width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height, bbox: (() => { try { const b = node.getBBox(); return { width: b.width, height: b.height }; } catch (_) { return { width: 0, height: 0 }; } })(), font: getComputedStyle(node.querySelector("text") || node).fontFamily })),
      resultCount: document.querySelectorAll(".source61-e4-result-label,[data-result-highlight]").length,
      hasAnswerVisual: Boolean(document.querySelector(".solution-answer-visual")),
      source: document.querySelector("[data-answer-source]")?.dataset.answerSource || "",
      marker: document.querySelector("[data-source61-ratio-e3-kind]")?.dataset.sourceItem || ""
    };
  });
  const label = `${sourceId} / ${viewportName} / 난이도 ${difficulty} / ${view}`;
  const width = await page.evaluate(() => innerWidth);
  if (!state.item || state.pageOverflow || state.item.scrollWidth > state.item.clientWidth + 2 || state.item.x < -2 || state.item.right > width + 2) fail(`${label}: 가로 넘침 또는 화면 밖 문항`);
  if (state.diagrams.length !== 1 || state.diagrams.some(svg => svg.width <= 0 || svg.height <= 0 || svg.bbox.width <= 0 || svg.bbox.height <= 0 || !svg.structure || !svg.values)) fail(`${label}: 빈 그림 또는 자료 속성 누락`);
  if (state.overlaps.length) fail(`${label}: SVG 글자 겹침 ${state.overlaps.join(",")}`);
  if (/undefined|null|NaN|Infinity|\$\{[^}]+\}|순열|조합|일차식|절댓값/.test(state.text)) fail(`${label}: 깨진 값 또는 학년 밖 표현`);
  if (/<span\b|&lt;span\b|math-mixed-number/.test(state.text)) fail(`${label}: 정답 또는 본문에 HTML 수식 코드가 글자로 보입니다.`);
  if (view === "problem") {
    if (state.resultCount || state.hasAnswerVisual) fail(`${label}: 문제 화면에 정답 강조 또는 답 자료가 노출되었습니다.`);
  } else {
    if (state.source !== sourceId || state.marker !== sourceId || state.resultCount < 1) fail(`${label}: 답 자료의 source 또는 정답 강조가 없습니다.`);
    if (state.diagrams.some(svg => !hasCommonMathFont(svg.font))) fail(`${label}: 공통 수학 글꼴이 없습니다.`);
  }
  return state;
}

async function capture(page, filename, label) {
  const file = path.join(outputDir, filename);
  await page.screenshot({ path: file, fullPage: true, timeout: 120000 });
  if (!fs.existsSync(file) || fs.statSync(file).size < 2000) fail(`${label}: 화면 캡처가 비었습니다.`);
  screenshots += 1;
}

async function captureA4(page, filename, label, view) {
  await page.emulateMedia({ media: "print" });
  const printState = await page.evaluate(expectedView => {
    const isProblem = expectedView === "problem";
    const active = document.querySelector(isProblem ? "#problemView" : "#solutionView");
    const inactive = document.querySelector(isProblem ? "#solutionView" : "#problemView");
    const items = [...(active?.querySelectorAll(isProblem ? ".question-item" : ".solution-item") || [])];
    const issues = [];
    const viewportWidth = document.documentElement.clientWidth;
    if (!active || active.hidden || !inactive || !inactive.hidden) issues.push("문제·답 인쇄 영역 분리 실패");
    if (document.documentElement.scrollWidth > viewportWidth + 2) issues.push("인쇄 가로 넘침");
    items.forEach((item, index) => {
      const itemBox = item.getBoundingClientRect();
      const page = item.closest(".print-page");
      const pageBox = page?.getBoundingClientRect();
      if (!page || !pageBox) {
        issues.push(`${index + 1}번 문항의 인쇄 페이지가 없습니다.`);
        return;
      }
      if (itemBox.left < pageBox.left - 1 || itemBox.right > pageBox.right + 1 || itemBox.top < pageBox.top - 1 || itemBox.bottom > pageBox.bottom + 1) issues.push(`${index + 1}번 문항 페이지 경계 이탈`);
      if (item.scrollWidth > item.clientWidth + 2) issues.push(`${index + 1}번 문항 가로 넘침`);
      item.querySelectorAll("svg.source61-ratio-e3-diagram").forEach(svg => {
        const box = svg.getBoundingClientRect();
        if (box.left < pageBox.left - 1 || box.right > pageBox.right + 1 || box.top < pageBox.top - 1 || box.bottom > pageBox.bottom + 1) issues.push(`${index + 1}번 그림 페이지 경계 이탈`);
      });
    });
    return { itemCount: items.length, issues };
  }, view);
  if (printState.itemCount !== 3 || printState.issues.length) fail(`${label}: A4 인쇄 검사 ${printState.issues.join(", ") || "문항 수 오류"}`);
  const pdf = path.join(outputDir, filename);
  await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
  if (!fs.existsSync(pdf) || fs.statSync(pdf).size < 2000) fail(`${label}: A4 PDF가 비었습니다.`);
  pdfs += 1;
  const pngBase = path.join(outputDir, filename.replace(/\.pdf$/, "-page"));
  try {
    const info = execFileSync("pdfinfo", [pdf], { encoding: "utf8" });
    const pageCount = Number(info.match(/^Pages:\s+(\d+)/m)?.[1] || 0);
    if (!pageCount) throw new Error("PDF 쪽수를 읽지 못했습니다.");
    expectedPdfPages += pageCount;
    execFileSync("pdftoppm", ["-png", pdf, pngBase], { stdio: "ignore" });
    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      const rendered = `${pngBase}-${pageNumber}.png`;
      if (!fs.existsSync(rendered) || fs.statSync(rendered).size < 5000) fail(`${label}: A4 ${pageNumber}쪽 렌더가 비었습니다.`);
      else renderedPdfPages += 1;
    }
  } catch (error) { fail(`${label}: A4 렌더 실패 (${error.message})`); }
  await page.emulateMedia({ media: "screen" });
}

async function inspectActualRoute(page, sourceId, viewportName, view) {
  const state = await page.evaluate(expected => {
    const expectedSourceId = expected.sourceId;
    const viewName = expected.view;
    const problemView = document.querySelector("#problemView");
    const solutionView = document.querySelector("#solutionView");
    const isProblem = viewName === "problem";
    const itemSelector = isProblem ? ".question-item" : ".solution-item";
    const items = [...document.querySelectorAll(itemSelector)];
    const diagrams = items.flatMap(item => [...item.querySelectorAll("svg.source61-ratio-e3-diagram")]);
    const markers = items.flatMap(item => [...item.querySelectorAll("[data-source-item]")]);
    const texts = diagrams.flatMap((svg, svgIndex) => [...svg.querySelectorAll("text")].map(node => ({
      svgIndex,
      text: node.textContent || "",
      box: node.getBoundingClientRect()
    })));
    const overlaps = [];
    texts.forEach((left, index) => texts.slice(index + 1).forEach((right, offset) => {
      if (left.svgIndex !== right.svgIndex) return;
      if (left.box.left < right.box.right - 1 && left.box.right > right.box.left + 1 && left.box.top < right.box.bottom - 1 && left.box.bottom > right.box.top + 1) {
        overlaps.push(`${left.svgIndex}:${index}:${index + offset + 1}`);
      }
    }));
    const itemBoxes = items.map(item => {
      const box = item.getBoundingClientRect();
      return { x: box.x, right: box.right, top: box.top, bottom: box.bottom, width: box.width, height: box.height, scrollWidth: item.scrollWidth, clientWidth: item.clientWidth };
    });
    const diagramBoxes = diagrams.map(svg => {
      const box = svg.getBoundingClientRect();
      let bbox = { width: 0, height: 0 };
      try { const measured = svg.getBBox(); bbox = { width: measured.width, height: measured.height }; } catch (_) { /* no-op */ }
      return {
        x: box.x,
        right: box.right,
        width: box.width,
        height: box.height,
        bbox,
        structure: svg.dataset.source61RatioE3Structure || "",
        values: svg.dataset.source61RatioE3Values || "",
        solved: svg.hasAttribute("data-result-highlight"),
        font: getComputedStyle(svg.querySelector("text") || svg).fontFamily
      };
    });
    const sourceCount = markers.filter(node => node.dataset.sourceItem === expectedSourceId).length;
    const answerNodes = items.flatMap(item => [...item.querySelectorAll(".source61-ratio-e3-answer")]);
    return {
      itemCount: items.length,
      diagramCount: diagrams.length,
      sourceCount,
      answerVisualCount: answerNodes.length,
      answerSourceCount: answerNodes.filter(node => node.dataset.answerSource === expectedSourceId).length,
      resultCount: diagrams.filter(svg => svg.hasAttribute("data-result-highlight")).length,
      hiddenProblem: Boolean(problemView?.hidden),
      hiddenSolution: Boolean(solutionView?.hidden),
      pageOverflow: document.documentElement.scrollWidth > innerWidth + 2,
      bodyText: document.body.innerText || "",
      answerHeaderMarkup: items.map(item => item.querySelector("header strong")?.innerHTML || ""),
      answerHeaderText: items.map(item => item.querySelector("header strong")?.textContent || ""),
      answerMathFractionCount: items.reduce((total, item) => total + item.querySelectorAll("header strong .math-fraction").length, 0),
      itemBoxes,
      diagramBoxes,
      overlaps,
      data: diagramBoxes.map(diagram => `${diagram.structure}|${diagram.values}`),
      fontSet: [...new Set(diagramBoxes.map(diagram => diagram.font))]
    };
  }, { sourceId, view });
  const label = `${sourceId} / ${viewportName} / 실제 경로 ${view}`;
  const width = await page.evaluate(() => innerWidth);
  const visibleExpectation = view === "problem" ? { hiddenProblem: false, hiddenSolution: true } : { hiddenProblem: true, hiddenSolution: false };
  if (state.itemCount !== 3 || state.diagramCount !== 3 || state.sourceCount !== 3) fail(`${label}: 실제 경로의 3문항·3그림·원문 ID 연결이 다릅니다.`);
  if (view === "problem" && (state.answerVisualCount !== 0 || state.resultCount !== 0)) fail(`${label}: 문제 화면에 답 그림 또는 정답 표시가 노출되었습니다.`);
  if (view === "answer" && (state.answerVisualCount !== 3 || state.answerSourceCount !== 3 || state.resultCount !== 3)) fail(`${label}: 실제 경로의 답 그림 3개 또는 정답 표시가 없습니다.`);
  if (state.hiddenProblem !== visibleExpectation.hiddenProblem || state.hiddenSolution !== visibleExpectation.hiddenSolution) fail(`${label}: 문제와 정답 화면이 분리되지 않았습니다.`);
  if (state.pageOverflow || state.itemBoxes.some(box => box.x < -2 || box.right > width + 2 || box.scrollWidth > box.clientWidth + 2)) fail(`${label}: 가로 넘침 또는 화면 밖 문항`);
  if (state.diagramBoxes.some(svg => svg.width <= 0 || svg.height <= 0 || svg.bbox.width <= 0 || svg.bbox.height <= 0 || svg.x < -2 || svg.right > width + 2 || !svg.structure || !svg.values)) fail(`${label}: 빈 그림, 잘린 그림 또는 자료 속성 누락`);
  if (view === "problem" && state.diagramBoxes.some(svg => svg.solved)) fail(`${label}: 문제 그림에 data-result-highlight가 있습니다.`);
  if (view === "answer" && state.diagramBoxes.some(svg => !svg.solved)) fail(`${label}: 답 그림에 data-result-highlight가 없습니다.`);
  if (state.overlaps.length) fail(`${label}: SVG 글자 겹침 ${state.overlaps.join(",")}`);
  if (/undefined|null|NaN|Infinity|\$\{[^}]+\}|순열|조합|일차식|절댓값/.test(state.bodyText)) fail(`${label}: 깨진 값 또는 학년 밖 표현`);
  if (/<span\b|&lt;span\b|math-mixed-number/.test(state.bodyText) || state.answerHeaderText.some(text => /<span\b|math-mixed-number/.test(text))) fail(`${label}: 정답 칸에 HTML 수식 코드가 글자로 보입니다.`);
  if (view === "answer" && sourceId === sourceIds[0] && state.answerMathFractionCount !== 3) fail(`${label}: 분수 정답 3개가 공통 세로 분수로 표시되지 않았습니다.`);
  if (state.fontSet.some(font => !hasCommonMathFont(font)) || state.fontSet.length > 1) fail(`${label}: 공통 수학 글꼴이 일관되지 않습니다.`);
  return state;
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const api = buildGenerator();
  const { server, baseUrl } = await startServer();
  let browser;
  try {
    browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--disable-quic"] });
    for (const sourceId of sourceIds) for (const [viewportName, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
      await page.goto(`${baseUrl}/hselementary/question-bank/?type=${sourceId}&review=1`, { waitUntil: "networkidle", timeout: 90000 });
      await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible", timeout: 90000 });
      await page.waitForTimeout(120);
      const problem = await inspectActualRoute(page, sourceId, viewportName, "problem");
      await capture(page, `${sourceId}-${viewportName}-actual-problem.png`, `${sourceId} 실제 경로 문제`);
      const answerTab = page.getByText("정답·풀이", { exact: true });
      if (await answerTab.count() !== 1) {
        fail(`${sourceId} / ${viewportName}: 실제 경로의 정답·풀이 탭이 없습니다.`);
      } else {
        await answerTab.click();
        await page.waitForTimeout(120);
        const answer = await inspectActualRoute(page, sourceId, viewportName, "answer");
        if (problem.data.join("\n") !== answer.data.join("\n")) fail(`${sourceId} / ${viewportName}: 실제 경로 문제·답 그림의 자료가 다릅니다.`);
        await capture(page, `${sourceId}-${viewportName}-actual-answer.png`, `${sourceId} 실제 경로 답`);
      }
      if (viewportName === "desktop") {
        await page.getByText("문제", { exact: true }).click();
        await page.waitForTimeout(40);
        await captureA4(page, `${sourceId}-actual-problem-a4.pdf`, `${sourceId} 실제 경로 문제 A4`, "problem");
        await page.getByText("정답·풀이", { exact: true }).click();
        await page.waitForTimeout(40);
        await captureA4(page, `${sourceId}-actual-answer-a4.pdf`, `${sourceId} 실제 경로 답 A4`, "answer");
      }
      await page.close();
    }
    for (let variant = 0; variant < sourceIds.length; variant += 1) for (const difficulty of difficulties) {
      const generated = api.generate({ sourceItemId: sourceIds[variant], generatorKey: "sourceGrade6RatioE3", reviewLocked: false }, 0, difficulty, 612000 + variant * 10000 + (difficulty + 1) * 100 + 17, variant);
      for (const [viewportName, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
        const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
        await page.goto(`${baseUrl}/hselementary/question-bank/index.html`, { waitUntil: "domcontentloaded", timeout: 90000 });
        const problem = await inspect(page, generated, sourceIds[variant], difficulty, "problem", viewportName);
        await capture(page, `${sourceIds[variant]}-${difficulty}-${viewportName}-problem.png`, `${sourceIds[variant]} 문제`);
        const answer = await inspect(page, generated, sourceIds[variant], difficulty, "answer", viewportName);
        await capture(page, `${sourceIds[variant]}-${difficulty}-${viewportName}-answer.png`, `${sourceIds[variant]} 답`);
        if (problem.diagrams[0]?.structure !== answer.diagrams[0]?.structure || problem.diagrams[0]?.values !== answer.diagrams[0]?.values) fail(`${sourceIds[variant]} / ${viewportName} / 난이도 ${difficulty}: 문제·답 자료가 다릅니다.`);
        await page.close();
      }
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  if (screenshots !== 176 || pdfs !== 22 || expectedPdfPages < pdfs || renderedPdfPages !== expectedPdfPages) fail(`산출물 수 ${screenshots}/${pdfs}/${renderedPdfPages}/${expectedPdfPages}, 화면 176장·PDF 22개·PDF 전쪽 렌더여야 합니다.`);
  const summary = `${failures.length ? "실패" : "통과"}: 실제 주소 11유형×PC1440/mobile390 문제·답, 실제 주소 A4 문제·답, 11유형×3난이도 직접 생성 문제·답, 문제·답 SVG 자료 일치·정답 표시·겹침·글꼴·넘침·A4 전쪽 렌더 검사; 화면 ${screenshots}장, A4 ${pdfs}개, 렌더 ${renderedPdfPages}/${expectedPdfPages}쪽\n${failures.join("\n")}\n`;
  fs.writeFileSync(path.join(outputDir, "audit-result.txt"), summary, "utf8");
  console.log(`결과 폴더: ${outputDir}`);
  console.log(summary);
  if (failures.length) process.exitCode = 1;
})().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
