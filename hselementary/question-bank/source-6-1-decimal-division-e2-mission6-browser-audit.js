"use strict";

const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const root = path.resolve(__dirname, "../..");
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(__dirname, "tmp", "decimal-division-e2-mission6-browser-audit");
const sourceItemId = "6-1-u3-e2-mission-6";
const generatorKey = "sourceGrade6DecimalDivisionE2Mission6";
const expectedPools = [
  [3, 6, 10, 2, 3.2, 3, 2.1, 5, 8, 3.5, 1.5, 1.125],
  [4, 6.5, 9.2, 2, 2.4, 3, 1.8, 6, 7.2, 3.6, 1.6, 1.28],
  [5, 7, 12.4, 3, 3.6, 4, 2.4, 8, 9.6, 4.8, 2, 2]
];
const failures = [];
let screenshots = 0;
let pdfs = 0;
let renderedPdfPages = 0;
const fail = message => failures.push(message);
const close = (left, right, tolerance = 1e-4) => Math.abs(Number(left) - Number(right)) <= tolerance;
const attr = (markup, name) => String(markup).match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const svgFrom = markup => String(markup).match(/<svg class="[^"]*source61-e2m6-diagram[\s\S]*?<\/svg>/)?.[0] || "";
const parsePoints = value => Object.fromEntries(String(value).split(";").filter(Boolean).map(entry => {
  const [name, coordinate] = entry.split(":");
  const [x, y] = coordinate.split(",").map(Number);
  return [name, { x, y }];
}));

function startServer() {
  const server = http.createServer((request, response) => {
    const requestPath = decodeURIComponent((request.url || "/").split("?")[0]);
    const relative = requestPath === "/" ? "/hselementary/question-bank/index.html" : requestPath;
    const filePath = path.resolve(root, `.${relative}`);
    if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      response.writeHead(404); response.end("not found"); return;
    }
    const type = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".json": "application/json" }[path.extname(filePath)] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": `${type}; charset=utf-8`, "Cache-Control": "no-store" });
    fs.createReadStream(filePath).pipe(response);
  });
  return new Promise(resolve => server.listen(0, "127.0.0.1", () => resolve({ server, baseUrl: `http://127.0.0.1:${server.address().port}` })));
}

function buildGenerator() {
  global.window = {};
  delete require.cache[require.resolve("./generators.js")];
  delete require.cache[require.resolve("./source-grade6-decimal-e2-mission6.js")];
  require("./generators.js");
  require("./source-grade6-decimal-e2-mission6.js");
  return window.HSE_GENERATORS;
}

function generatedForPool(api, difficulty, poolIndex) {
  for (let seed = 61032400; seed < 61033000; seed += 1) {
    const generated = api.generate({ sourceItemId, generatorKey, reviewLocked: false }, 0, difficulty, seed, 0);
    if (generated.verifiedPoolIndex === poolIndex) return generated;
  }
  throw new Error(`고정 문항 ${poolIndex}을 만드는 seed를 찾지 못했습니다.`);
}

function inspectContract(generated, poolIndex, difficulty) {
  const label = `난이도 ${difficulty} / 문항 ${poolIndex}`;
  const problemSvg = svgFrom(generated.prompt);
  const answerSvg = svgFrom(generated.answerVisual);
  const values = attr(problemSvg, "data-source61-e2m6-values").split(",").map(Number);
  if (generated.generator !== generatorKey || generated.sourceItemId !== sourceItemId || generated.generationMode !== "fixed-verified-pool" || generated.verifiedVariantCount !== 3 || generated.verifiedPoolIndex !== poolIndex) fail(`${label}: 생성기·원문·고정 문항 계약이 다릅니다.`);
  if (values.length !== 12 || values.some((value, index) => !close(value, expectedPools[poolIndex][index])) || attr(problemSvg, "data-source61-e2m6-values") !== attr(answerSvg, "data-source61-e2m6-values")) fail(`${label}: 문제·답 값 자료가 고정 문항과 다릅니다.`);
  if (attr(problemSvg, "data-source61-e2m6-points") !== attr(answerSvg, "data-source61-e2m6-points")) fail(`${label}: 문제와 답의 점 좌표가 다릅니다.`);
  const points = parsePoints(attr(problemSvg, "data-source61-e2m6-points"));
  if (!points.ITL || !points.ITA || !points.ITR || !points.IRL || !points.IRR || !points.FTL || !points.FTA || !points.FTR || !points.FRL || !points.FRR || !points.OT) fail(`${label}: 이동 전후 필수 점이 없습니다.`);
  else {
    if (!(points.ITL.x < points.ITA.x && points.ITA.x < points.ITR.x && points.ITR.x < points.IRL.x && points.IRL.x < points.IRR.x)) fail(`${label}: 처음 삼각형·간격·직사각형의 좌우 순서가 다릅니다.`);
    if (!close(points.ITA.x, (points.ITL.x + points.ITR.x) / 2) || !close(points.ITL.y, points.ITR.y) || !close(points.IRL.y, points.IRR.y)) fail(`${label}: 직각이등변삼각형 또는 기준선 좌표가 다릅니다.`);
    if (!close(points.FRL.x, points.OT.x) || !close(points.FRL.y, points.FTR.y) || !(points.OT.y < points.FRL.y)) fail(`${label}: 이동 뒤 직사각형 왼쪽 변과 겹친 삼각형이 다릅니다.`);
  }
  if (problemSvg.includes("source61-e2m6-overlap") || problemSvg.includes("is-final") || !answerSvg.includes("source61-e2m6-overlap is-solved") || !answerSvg.includes("source61-e2m6-rectangle is-final")) fail(`${label}: 문제와 답의 이동·겹침 표시가 분리되지 않았습니다.`);
  if (!String(generated.answerVisual).includes(`data-answer-source="${sourceItemId}"`)) fail(`${label}: 답 그림의 원문 연결이 없습니다.`);
}

async function inspectMarkup(page, generated, view, viewportName, difficulty, poolIndex) {
  const html = view === "problem"
    ? `<main class="question-pages"><section class="print-page print-page--single"><div class="question-grid"><article class="question-item"><div class="question-prompt">${generated.prompt}</div></article></div></section></main>`
    : `<main class="answer-pages"><section class="print-page answer-page"><div class="solution-list"><article class="solution-item"><div class="solution-answer-visual">${generated.answerVisual}</div><p>${generated.solution}</p></article></div></section></main>`;
  await page.evaluate(content => { document.body.innerHTML = content; }, html);
  await page.waitForTimeout(60);
  const state = await page.evaluate(() => {
    const item = document.querySelector(".question-item,.solution-item");
    const svg = document.querySelector("svg.source61-e2m6-diagram");
    const itemBox = item?.getBoundingClientRect();
    const svgBox = svg?.getBoundingClientRect();
    const bbox = svg?.getBBox();
    const viewBox = svg?.viewBox?.baseVal;
    const texts = svg ? [...svg.querySelectorAll("text")].map(node => { const box = node.getBBox(); const screen = node.getBoundingClientRect(); const style = getComputedStyle(node); return { text: node.textContent || "", x: box.x, y: box.y, right: box.x + box.width, bottom: box.y + box.height, width: box.width, height: box.height, screenHeight: screen.height, size: parseFloat(style.fontSize), font: style.fontFamily }; }) : [];
    const overlaps = [];
    texts.forEach((left, index) => texts.slice(index + 1).forEach((right, offset) => {
      const width = Math.min(left.right, right.right) - Math.max(left.x, right.x);
      const height = Math.min(left.bottom, right.bottom) - Math.max(left.y, right.y);
      if (width > 1 && height > 1) overlaps.push(`${index}:${index + offset + 1}`);
    }));
    return {
      bodyText: document.body.innerText || "",
      item: itemBox ? { left: itemBox.left, right: itemBox.right, scrollWidth: item.scrollWidth, clientWidth: item.clientWidth } : null,
      svg: svgBox ? { left: svgBox.left, right: svgBox.right, width: svgBox.width, height: svgBox.height } : null,
      bbox: bbox ? { x: bbox.x, y: bbox.y, right: bbox.x + bbox.width, bottom: bbox.y + bbox.height } : null,
      viewBox: viewBox ? { width: viewBox.width, height: viewBox.height } : null,
      overflow: document.documentElement.scrollWidth > innerWidth + 2,
      texts, overlaps,
      phase: svg?.dataset.source61E2m6Phase || "",
      model: svg?.dataset.source61E2m6Model || "",
      points: svg?.dataset.source61E2m6Points || "",
      pool: svg?.dataset.pool || "",
      rectangleCount: svg?.querySelectorAll(".source61-e2m6-rectangle").length || 0,
      triangleCount: svg?.querySelectorAll(".source61-e2m6-triangle").length || 0,
      rightAngleCount: svg?.querySelectorAll(".source61-e2m6-right-angle").length || 0,
      overlapCount: svg?.querySelectorAll(".source61-e2m6-overlap.is-solved").length || 0,
      finalCount: svg?.querySelectorAll(".source61-e2m6-rectangle.is-final").length || 0,
      finalTriangleCount: svg?.querySelectorAll(".source61-e2m6-triangle.is-final").length || 0,
      resultCount: svg?.querySelectorAll(".source61-e2m6-result").length || 0,
      answerSource: document.querySelector("[data-answer-source]")?.dataset.answerSource || ""
    };
  });
  const label = `${viewportName} / 난이도 ${difficulty} / 문항 ${poolIndex} / ${view}`;
  const viewportWidth = await page.evaluate(() => innerWidth);
  if (!state.item || state.overflow || state.item.scrollWidth > state.item.clientWidth + 2 || state.item.left < -2 || state.item.right > viewportWidth + 2) fail(`${label}: 화면 가로 넘침 또는 문항 잘림`);
  if (!state.svg || !state.bbox || !state.viewBox || state.svg.width < 250 || state.svg.height < 130 || state.bbox.x < -1 || state.bbox.y < -1 || state.bbox.right > state.viewBox.width + 1 || state.bbox.bottom > state.viewBox.height + 1) fail(`${label}: 그림이 비었거나 viewBox 밖으로 잘립니다.`);
  if (state.model !== "opposing-moving-shapes-overlap" || state.triangleCount !== (view === "problem" ? 1 : 2) || state.rightAngleCount !== (view === "problem" ? 1 : 2)) fail(`${label}: 직사각형·직각이등변삼각형 구조가 없습니다.`);
  if (state.texts.some(text => !text.text.trim() || text.width <= 0 || text.height <= 0 || text.size < 15 || !text.font.includes("Malgun Gothic"))) fail(`${label}: 도형 글자가 공통 글꼴·15px 이상 조건을 만족하지 않습니다.`);
  const minimumScreenTextHeight = viewportName === "mobile" ? 8 : 14;
  if (state.texts.some(text => text.screenHeight < minimumScreenTextHeight)) fail(`${label}: 실제 화면에서 도형 글자가 너무 작습니다(최소 ${Math.min(...state.texts.map(text => text.screenHeight)).toFixed(1)}px).`);
  if (state.overlaps.length) fail(`${label}: 도형 안의 글자끼리 겹칩니다(${state.overlaps.join(",")}).`);
  if (/undefined|null|NaN|Infinity|\b\d+\s*\/\s*\d+\b/.test(state.bodyText)) fail(`${label}: 깨진 값 또는 슬래시 분수가 보입니다.`);
  if (view === "problem" && (state.phase !== "problem" || state.pool !== String(poolIndex) || state.rectangleCount !== 1 || state.overlapCount || state.finalCount || state.finalTriangleCount || state.resultCount || state.answerSource)) fail(`${label}: 문제 화면에 답 전용 이동·겹침 표시가 노출됩니다.`);
  if (view === "answer" && (state.phase !== "answer" || state.pool !== String(poolIndex) || state.rectangleCount !== 2 || state.overlapCount !== 1 || state.finalCount !== 1 || state.finalTriangleCount !== 1 || state.resultCount !== 1 || state.answerSource !== sourceItemId)) fail(`${label}: 답 화면의 이동 뒤 두 도형·겹침·결과 표시가 다릅니다.`);
  return state;
}

async function capture(page, filename, label) {
  const file = path.join(outputDir, filename);
  await page.screenshot({ path: file, fullPage: true, timeout: 120000 });
  if (!fs.existsSync(file) || fs.statSync(file).size < 3000) fail(`${label}: 화면 캡처가 비었습니다.`);
  screenshots += 1;
}

async function renderPdf(pdfPath, expectedPages, label) {
  try {
    const info = execFileSync("pdfinfo", [pdfPath], { encoding: "utf8" });
    const pageCount = Number(info.match(/^Pages:\s+(\d+)/m)?.[1] || 0);
    if (pageCount !== expectedPages) fail(`${label}: A4 PDF가 ${pageCount}쪽입니다. ${expectedPages}쪽이어야 합니다.`);
    const base = pdfPath.replace(/\.pdf$/, "-page");
    execFileSync("pdftoppm", ["-png", pdfPath, base], { stdio: "ignore" });
    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      const png = `${base}-${pageNumber}.png`;
      if (!fs.existsSync(png) || fs.statSync(png).size < 5000) fail(`${label}: A4 ${pageNumber}쪽 렌더가 비었습니다.`);
      else renderedPdfPages += 1;
    }
  } catch (error) { fail(`${label}: A4 렌더 실패 (${error.message})`); }
}

async function captureA4(page, filename, label, expectedPages) {
  await page.emulateMedia({ media: "print" });
  const pdf = path.join(outputDir, filename);
  await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
  if (!fs.existsSync(pdf) || fs.statSync(pdf).size < 4000) fail(`${label}: A4 PDF가 비었습니다.`);
  pdfs += 1;
  await renderPdf(pdf, expectedPages, label);
  await page.emulateMedia({ media: "screen" });
}

async function inspectActualRoute(browser, baseUrl, viewportName, viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  const pageErrors = [];
  page.on("pageerror", error => pageErrors.push(error.message));
  try {
    await page.goto(`${baseUrl}/hselementary/question-bank/index.html?type=${sourceItemId}&review=1&difficulty=0`, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(200);
    const routeState = await page.evaluate(expectedId => ({
      worksheetHidden: document.querySelector("#worksheet")?.hidden !== false,
      selectedCount: document.querySelectorAll(".tree-type input:checked").length,
      matchingCount: [...document.querySelectorAll(".tree-type")].filter(node => node.textContent?.includes("도형을 움직인 뒤 겹친 부분의 넓이 구하기")).length,
      disabledMatchingCount: [...document.querySelectorAll(".tree-type")].filter(node => node.textContent?.includes("도형을 움직인 뒤 겹친 부분의 넓이 구하기") && node.querySelector("input")?.disabled).length,
      query: location.search,
      expectedId
    }), sourceItemId);
    if (routeState.worksheetHidden) {
      fail(`실제 앱 / ${viewportName}: URL 자동 열기 실패 ${JSON.stringify(routeState)} / 브라우저 오류 ${pageErrors.join(" | ") || "없음"}`);
      return;
    }
    const check = async view => page.evaluate(expectedView => {
      const isProblem = expectedView === "problem";
      const active = document.querySelector(isProblem ? "#problemView" : "#solutionView");
      const inactive = document.querySelector(isProblem ? "#solutionView" : "#problemView");
      const items = [...(active?.querySelectorAll(isProblem ? ".question-item" : ".solution-item") || [])];
      const diagrams = [...(active?.querySelectorAll("svg.source61-e2m6-diagram") || [])];
      return {
        itemCount: items.length, pageCount: active?.querySelectorAll(".print-page").length || 0, diagramCount: diagrams.length,
        activeHidden: Boolean(active?.hidden), inactiveHidden: !inactive?.hidden,
        sourceCount: isProblem ? diagrams.filter(svg => svg.dataset.source61E2m6Phase === "problem").length : [...active.querySelectorAll("[data-answer-source]")].filter(node => node.dataset.answerSource === "6-1-u3-e2-mission-6").length,
        solvedCount: active?.querySelectorAll(".source61-e2m6-overlap.is-solved").length || 0,
        overflow: document.documentElement.scrollWidth > innerWidth + 2,
        clipped: [...items, ...diagrams].some(node => { const box = node.getBoundingClientRect(); return box.left < -2 || box.right > innerWidth + 2 || node.scrollWidth > node.clientWidth + 2; })
      };
    }, view);
    const problem = await check("problem");
    if (problem.itemCount !== 3 || problem.pageCount !== 3 || problem.diagramCount !== 3 || problem.sourceCount !== 3 || problem.solvedCount || problem.activeHidden || problem.inactiveHidden || problem.overflow || problem.clipped) fail(`실제 앱 / ${viewportName} / 문제: 3문항·3쪽·경계 또는 답 분리가 다릅니다 (${JSON.stringify(problem)}).`);
    await capture(page, `actual-${viewportName}-problem.png`, `실제 앱 / ${viewportName} / 문제`);
    if (viewportName === "desktop") await captureA4(page, "actual-problem-a4.pdf", "실제 앱 / 문제 A4", 3);
    await page.click("#solutionTab");
    await page.waitForTimeout(80);
    const answer = await check("answer");
    if (answer.itemCount !== 3 || answer.pageCount !== 3 || answer.diagramCount !== 3 || answer.sourceCount !== 3 || answer.solvedCount !== 3 || answer.activeHidden || answer.inactiveHidden || answer.overflow || answer.clipped) fail(`실제 앱 / ${viewportName} / 답: 3문항·3쪽·경계 또는 답 표시가 다릅니다 (${JSON.stringify(answer)}).`);
    await capture(page, `actual-${viewportName}-answer.png`, `실제 앱 / ${viewportName} / 답`);
    if (viewportName === "desktop") await captureA4(page, "actual-answer-a4.pdf", "실제 앱 / 답 A4", 3);
  } catch (error) { fail(`실제 앱 / ${viewportName}: ${error.message}`); }
  finally { await page.close(); }
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const api = buildGenerator();
  const { server, baseUrl } = await startServer();
  let browser;
  try {
    browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--disable-quic"] });
    await inspectActualRoute(browser, baseUrl, "desktop", { width: 1440, height: 900 });
    await inspectActualRoute(browser, baseUrl, "mobile", { width: 390, height: 844 });
    for (let poolIndex = 0; poolIndex < 3; poolIndex += 1) for (const difficulty of [-1, 0, 1]) {
      const generated = generatedForPool(api, difficulty, poolIndex);
      inspectContract(generated, poolIndex, difficulty);
      let problemPoints = "";
      for (const [viewportName, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
        const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
        try {
          await page.goto(`${baseUrl}/hselementary/question-bank/index.html`, { waitUntil: "domcontentloaded" });
          for (const view of ["problem", "answer"]) {
            const state = await inspectMarkup(page, generated, view, viewportName, difficulty, poolIndex);
            if (view === "problem") problemPoints = state.points;
            else if (state.points !== problemPoints) fail(`${viewportName} / 난이도 ${difficulty} / 문항 ${poolIndex}: 문제와 답의 실제 점 자료가 다릅니다.`);
            await capture(page, `pool-${poolIndex}-${difficulty}-${viewportName}-${view}.png`, `${viewportName} / ${view}`);
          }
          if (difficulty === 0 && viewportName === "desktop") {
            for (const view of ["problem", "answer"]) {
              await inspectMarkup(page, generated, view, viewportName, difficulty, poolIndex);
              await captureA4(page, `pool-${poolIndex}-${view}-a4.pdf`, `${view} / 문항 ${poolIndex} / A4`, 1);
            }
          }
        } finally { await page.close(); }
      }
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  if (screenshots !== 40) fail(`화면 캡처가 ${screenshots}장입니다. 40장이어야 합니다.`);
  if (pdfs !== 8 || renderedPdfPages !== 12) fail(`A4 PDF/렌더가 ${pdfs}/${renderedPdfPages}개입니다. 8/12이어야 합니다.`);
  const summary = `${failures.length ? "실패" : "통과"}: 6-1-u3-e2-mission-6 3문항×3난이도×PC1440/mobile390 문제·답, 이동 전후 점·선분·직각 표시·교집합·문제/답 좌표 동일·15px 글꼴·겹침/잘림·실제 앱 3문항 3쪽·A4 검사; 화면 ${screenshots}장, A4 ${pdfs}개, 렌더 ${renderedPdfPages}쪽\n${failures.join("\n")}\n`;
  fs.writeFileSync(path.join(outputDir, "audit-result.txt"), summary, "utf8");
  console.log(`결과 폴더: ${outputDir}`);
  console.log(summary);
  if (failures.length) process.exitCode = 1;
})().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
