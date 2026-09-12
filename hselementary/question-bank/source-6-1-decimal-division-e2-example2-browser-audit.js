"use strict";

const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const root = path.resolve(__dirname, "../..");
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(__dirname, "tmp", "decimal-division-e2-example2-browser-audit");
const sourceItemId = "6-1-u3-e2-example-2";
const generatorKey = "sourceGrade6DecimalDivisionE2Example2";
const expectedSides = [2.4, 3.6, 4.2];
const failures = [];
let screenshots = 0;
let pdfs = 0;
let renderedPdfPages = 0;
const fail = message => failures.push(message);
const close = (left, right, tolerance = 1e-3) => Math.abs(Number(left) - Number(right)) <= tolerance;
const attr = (markup, name) => String(markup).match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const svgFrom = markup => String(markup).match(/<svg class="[^"]*source61-e2ex2-diagram[\s\S]*?<\/svg>/)?.[0] || "";
const parsePoints = value => Object.fromEntries(String(value).split(";").filter(Boolean).map(entry => {
  const [name, coordinate] = entry.split(":");
  const [x, y] = coordinate.split(",").map(Number);
  return [name, { x, y }];
}));
const pointText = point => `${Number(point.x).toFixed(4)},${Number(point.y).toFixed(4)}`;
const parsePathPoints = value => [...String(value).matchAll(/[ML](-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)].map(match => ({ x: Number(match[1]), y: Number(match[2]) }));
const expectedLabelOffsets = {
  "ㄱ": { point: "G", dx: -13, dy: -12 },
  "ㄴ": { point: "N", dx: -13, dy: 14 },
  "ㄷ": { point: "D", dx: 15, dy: -11 },
  "ㄹ": { point: "R", dx: 15, dy: -7 }
};

function sourceRecord() {
  return window.HSE_SOURCE_INVENTORY_GRADE6?.items?.find(item => item.sourceItemId === sourceItemId);
}

function buildGenerator() {
  global.window = {};
  ["./source-inventory-grade6.js", "./curriculum.js", "./generators.js", "./source-grade6-decimal-e2-example2.js"].forEach(file => {
    delete require.cache[require.resolve(file)];
    require(file);
  });
  return window.HSE_GENERATORS;
}

function generatedForPool(api, difficulty, targetPool) {
  for (let seed = 61032200; seed < 61033200; seed += 1) {
    const generated = api.generate({ sourceItemId, generatorKey, reviewLocked: false }, 0, difficulty, seed, 0);
    if (generated.verifiedPoolIndex === targetPool) return generated;
  }
  throw new Error(`고정 문항 ${targetPool}을 생성할 시드를 찾지 못했습니다.`);
}

function injectExample2Script(html) {
  const sourceScript = '<script defer src="./source-grade6-decimal-e2-example2.js?browser-audit=20260909"></script>';
  const appScript = /(<script defer src="\.\/app\.js[^>]*><\/script>)/;
  if (!appScript.test(html)) throw new Error("앱 스크립트 삽입 위치를 찾지 못했습니다.");
  return html.replace(appScript, `${sourceScript}$1`);
}

function startServer() {
  const server = http.createServer((request, response) => {
    const requestPath = decodeURIComponent((request.url || "/").split("?")[0]);
    const relative = requestPath === "/" ? "/hselementary/question-bank/index.html" : requestPath;
    const filePath = path.resolve(root, `.${relative}`);
    if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      response.writeHead(404); response.end("not found"); return;
    }
    const extension = path.extname(filePath);
    const types = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".json": "application/json" };
    response.writeHead(200, { "Content-Type": `${types[extension] || "application/octet-stream"}; charset=utf-8`, "Cache-Control": "no-store" });
    if (filePath.endsWith(`${path.sep}hselementary${path.sep}question-bank${path.sep}index.html`)) {
      response.end(injectExample2Script(fs.readFileSync(filePath, "utf8")));
    } else {
      fs.createReadStream(filePath).pipe(response);
    }
  });
  return new Promise(resolve => server.listen(0, "127.0.0.1", () => resolve({ server, baseUrl: `http://127.0.0.1:${server.address().port}` })));
}

function inspectSourceContract(api) {
  const record = sourceRecord();
  if (!record) return fail(`${sourceItemId}: 실제 원장 항목이 없습니다.`);
  if (record.sourceVerified !== true || record.sourceSection !== "example" || record.sourceItemLabel !== "예제 2-2") fail(`${sourceItemId}: 원본 확인 상태·구분·문항명이 실제 원장과 다릅니다.`);
  if (record.typeLabel !== "정사각형 세 개를 이어 만든 사각형의 넓이 구하기") fail(`${sourceItemId}: 원본 유형명이 다릅니다.`);
  if (record.problemVisualRequired !== true || record.answerVisualRequired !== true) fail(`${sourceItemId}: 문제·답 그림 필수 계약이 없습니다.`);
  if (!api?.names?.includes(generatorKey) || record.generatorKey !== generatorKey || record.reviewLocked !== false || record.answerVisualStatus !== "verified" || record.verifiedVariantCount !== 3) fail(`${sourceItemId}: 생성기·잠금·답 그림·3문항 계약이 앱 메모리에서 완성되지 않았습니다.`);
}

function inspectCoordinates(generated, poolIndex, label) {
  const problemSvg = svgFrom(generated.prompt);
  const answerSvg = svgFrom(generated.answerVisual);
  const problemPoints = parsePoints(attr(problemSvg, "data-source61-e2ex2-points"));
  const answerPoints = parsePoints(attr(answerSvg, "data-source61-e2ex2-points"));
  const side = expectedSides[poolIndex];
  const requiredPoints = ["A", "G", "N", "D", "R", "L", "U"];
  if (JSON.stringify(problemPoints) !== JSON.stringify(answerPoints)) fail(`${label}: 문제와 답의 점 자료가 다릅니다.`);
  if (attr(problemSvg, "data-target-order") !== "G-N-D-R" || attr(answerSvg, "data-target-order") !== "G-N-D-R") fail(`${label}: 목표 점 순서가 G-N-D-R이 아닙니다.`);
  if (requiredPoints.some(point => !problemPoints[point])) fail(`${label}: 필수 교점·선분 끝점 자료가 없습니다.`);
  if (!problemSvg.includes('data-source61-e2ex2-model="three-joined-squares-two-segments"')) fail(`${label}: 세 정사각형·두 선분 모델 표시가 없습니다.`);
  if (problemSvg.match(/source61-e2ex2-divider/g)?.length !== 1 || problemSvg.match(/source61-e2ex2-segment/g)?.length !== 1) fail(`${label}: 세 정사각형 또는 두 선분의 구조가 없습니다.`);
  const p = problemPoints;
  const squareSide = p.G.x - p.A.x;
  if (!close(squareSide, 125) || !close(p.N.x, p.G.x) || !close(p.R.x, p.D.x) || !close(p.D.x - p.G.x, squareSide) || !close(p.U.x - p.A.x, squareSide * 3) || !close(p.D.y - p.A.y, squareSide)) fail(`${label}: 세 정사각형의 같은 변·이어 붙인 위치가 다릅니다.`);
  if (!close(p.G.y, p.A.y + squareSide / 3) || !close(p.N.y, p.A.y + squareSide / 2) || !close(p.R.y, p.A.y + squareSide * 2 / 3) || !close(p.D.y, p.A.y + squareSide)) fail(`${label}: 네 교점의 위치 비율이 원본과 다릅니다.`);
  if (p.L.x !== p.D.x || p.L.y !== p.D.y || !close(p.U.x, p.A.x + squareSide * 3) || !close(p.U.y, p.A.y + squareSide)) fail(`${label}: 두 선분의 끝점이 원본 구조와 다릅니다.`);
  const target = [p.G, p.N, p.D, p.R];
  const polygonPoints = (problemSvg.match(/<polygon[^>]*class="source61-e2ex2-target[^>]*points="([^"]*)"/) || [])[1]?.split(" ").map(value => {
    const [x, y] = value.split(",").map(Number); return { x, y };
  }) || [];
  if (polygonPoints.length !== 4 || polygonPoints.some((point, index) => !close(point.x, target[index].x) || !close(point.y, target[index].y))) fail(`${label}: ㄱ-ㄴ-ㄷ-ㄹ 사각형의 점 순서 또는 좌표가 다릅니다.`);
  const segmentPath = (problemSvg.match(/<path class="source61-e2ex2-segment" d="([^"]*)"/) || [])[1] || "";
  const segmentPoints = parsePathPoints(segmentPath);
  if (segmentPoints.length !== 4 || !close(segmentPoints[0].x, p.A.x) || !close(segmentPoints[0].y, p.A.y) || !close(segmentPoints[1].x, p.U.x) || !close(segmentPoints[1].y, p.U.y) || !close(segmentPoints[2].x, p.A.x) || !close(segmentPoints[2].y, p.A.y) || !close(segmentPoints[3].x, p.L.x) || !close(segmentPoints[3].y, p.L.y)) fail(`${label}: 두 선분의 시작·끝점이 다릅니다.`);
  const labels = [...problemSvg.matchAll(/<text class="source61-e2ex2-point-label" x="([^"]+)" y="([^"]+)">([^<]+)<\/text>/g)].map(match => ({ x: Number(match[1]), y: Number(match[2]), text: match[3] }));
  if (labels.length !== 4 || labels.map(labelEntry => labelEntry.text).join("") !== "ㄱㄴㄷㄹ") fail(`${label}: 네 교점의 한글 라벨이 정확히 네 개·ㄱㄴㄷㄹ 순서가 아닙니다.`);
  labels.forEach(labelEntry => {
    const expected = expectedLabelOffsets[labelEntry.text];
    const point = p[expected.point];
    if (!point || !close(labelEntry.x, point.x + expected.dx) || !close(labelEntry.y, point.y + expected.dy)) fail(`${label}: ${labelEntry.text} 라벨이 해당 교점의 정해진 위치에 있지 않습니다.`);
  });
  if (!close(Number(attr(problemSvg, "data-source61-e2ex2-side")), side) || !close(Number(attr(answerSvg, "data-source61-e2ex2-side")), side)) fail(`${label}: 고정 문항의 변 길이가 다릅니다.`);
  if (attr(problemSvg, "data-source61-e2ex2-phase") !== "problem" || attr(answerSvg, "data-source61-e2ex2-phase") !== "answer") fail(`${label}: 문제·답 단계 표시가 다릅니다.`);
  if (attr(problemSvg, "data-pool") !== String(poolIndex) || attr(answerSvg, "data-pool") !== String(poolIndex)) fail(`${label}: 문제·답 고정 문항 번호가 다릅니다.`);
  if (problemSvg.includes("is-solved") || (answerSvg.match(/source61-e2ex2-target is-solved/g) || []).length !== 1 || !String(generated.answerVisual).includes(`data-answer-source="${sourceItemId}"`)) fail(`${label}: 답 전용 강조가 문제와 분리되지 않았습니다.`);
}

async function inspectMarkup(page, generated, view, viewportName, difficulty, poolIndex) {
  const html = view === "problem"
    ? `<main class="question-pages"><section class="print-page print-page--single"><div class="question-grid"><article class="question-item"><div class="question-prompt">${generated.prompt}</div></article></div></section></main>`
    : `<main class="answer-pages"><section class="print-page answer-page"><div class="solution-list"><article class="solution-item"><div class="solution-answer-visual">${generated.answerVisual}</div><p class="solution-explanation">${generated.solution}</p></article></div></section></main>`;
  await page.evaluate(content => { document.body.innerHTML = content; }, html);
  await page.waitForTimeout(60);
  const state = await page.evaluate(() => {
    const item = document.querySelector(".question-item,.solution-item");
    const svg = document.querySelector("svg.source61-e2ex2-diagram");
    const rect = node => { const box = node?.getBoundingClientRect(); return box ? { left: box.left, right: box.right, top: box.top, bottom: box.bottom, width: box.width, height: box.height } : null; };
    const texts = svg ? [...svg.querySelectorAll("text")].map(node => { const box = node.getBBox(); const style = getComputedStyle(node); return { text: node.textContent || "", x: box.x, y: box.y, right: box.x + box.width, bottom: box.y + box.height, width: box.width, height: box.height, size: parseFloat(style.fontSize), font: style.fontFamily }; }) : [];
    const overlaps = [];
    texts.forEach((left, leftIndex) => texts.slice(leftIndex + 1).forEach((right, offset) => { const width = Math.min(left.right, right.right) - Math.max(left.x, right.x); const height = Math.min(left.bottom, right.bottom) - Math.max(left.y, right.y); if (width > 1 && height > 1) overlaps.push(`${leftIndex}:${leftIndex + offset + 1}`); }));
    const svgBox = svg?.getBBox();
    const viewBox = svg?.viewBox?.baseVal;
    const itemBox = item?.getBoundingClientRect();
    return {
      bodyText: document.body.innerText || "",
      viewportWidth: innerWidth,
      documentOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      itemOverflow: item ? item.scrollWidth > item.clientWidth + 2 : true,
      item: itemBox ? { left: itemBox.left, right: itemBox.right } : null,
      svg: rect(svg),
      svgBox: svgBox ? { x: svgBox.x, y: svgBox.y, right: svgBox.x + svgBox.width, bottom: svgBox.y + svgBox.height, width: svgBox.width, height: svgBox.height } : null,
      viewBox: viewBox ? { width: viewBox.width, height: viewBox.height } : null,
      texts,
      overlaps,
      problemPointData: svg?.dataset.source61E2ex2Points || "",
      target: svg?.dataset.targetOrder || "",
      squareModel: svg?.dataset.source61E2ex2Model || "",
      phase: svg?.dataset.source61E2ex2Phase || "",
      pool: svg?.dataset.pool || "",
      rectCount: svg?.querySelectorAll(".source61-e2ex2-square-strip").length || 0,
      dividerCount: svg?.querySelectorAll(".source61-e2ex2-divider").length || 0,
      segmentCount: svg?.querySelectorAll(".source61-e2ex2-segment").length || 0,
      targetCount: svg?.querySelectorAll(".source61-e2ex2-target").length || 0,
      solvedCount: svg?.querySelectorAll(".source61-e2ex2-target.is-solved").length || 0,
      resultCount: svg?.querySelectorAll(".source61-e2ex2-result").length || 0,
      answerSource: document.querySelector("[data-answer-source]")?.dataset.answerSource || ""
    };
  });
  const label = `${viewportName} / 난이도 ${difficulty} / 문항 ${poolIndex} / ${view}`;
  if (!state.item || state.documentOverflow || state.itemOverflow || state.item.left < -2 || state.item.right > state.viewportWidth + 2) fail(`${label}: 화면 가로 넘침 또는 문항 잘림`);
  if (!state.svg || !state.svgBox || !state.viewBox || state.svg.width < 250 || state.svg.height < 120 || state.svgBox.x < -1 || state.svgBox.y < -1 || state.svgBox.right > state.viewBox.width + 1 || state.svgBox.bottom > state.viewBox.height + 1) fail(`${label}: 그림이 비었거나 viewBox 밖으로 잘립니다. 화면 ${Math.round(state.svg?.width || 0)}×${Math.round(state.svg?.height || 0)}, 내용 ${Math.round(state.svgBox?.width || 0)}×${Math.round(state.svgBox?.height || 0)}, viewBox ${Math.round(state.viewBox?.width || 0)}×${Math.round(state.viewBox?.height || 0)}`);
  if (state.rectCount !== 1 || state.dividerCount !== 1 || state.segmentCount !== 1 || state.targetCount !== 1 || state.squareModel !== "three-joined-squares-two-segments" || state.target !== "G-N-D-R") fail(`${label}: 세 정사각형·두 선분·목표 구조가 실제 화면에 없습니다.`);
  if (state.texts.some(text => !text.text.trim() || text.width <= 0 || text.height <= 0 || text.size < 15 || !text.font.includes("Malgun Gothic"))) fail(`${label}: 모든 도형 글자가 공통 글꼴·15px 이상 조건을 만족하지 않습니다. 최소 ${Math.min(...state.texts.map(text => text.size))}px, 글꼴 ${state.texts[0]?.font || "없음"}`);
  if (state.overlaps.length) fail(`${label}: 도형 안의 글자끼리 겹칩니다(${state.overlaps.join(",")}).`);
  if (/undefined|null|NaN|Infinity|\b\d+\s*\/\s*\d+\b/.test(state.bodyText)) fail(`${label}: 깨진 값 또는 슬래시 분수가 보입니다.`);
  if (view === "problem" && (state.phase !== "problem" || state.pool !== String(poolIndex) || state.solvedCount || state.resultCount || state.answerSource)) fail(`${label}: 문제 화면에 답 전용 표시가 노출됩니다.`);
  if (view === "answer" && (state.phase !== "answer" || state.pool !== String(poolIndex) || state.solvedCount !== 1 || state.resultCount !== 1 || state.answerSource !== sourceItemId)) fail(`${label}: 답 화면의 강조·결과·출처 연결이 다릅니다.`);
  return state;
}

async function capture(page, filename, label) {
  await page.screenshot({ path: path.join(outputDir, filename), fullPage: true, timeout: 120000 });
  if (!fs.existsSync(path.join(outputDir, filename)) || fs.statSync(path.join(outputDir, filename)).size < 3000) fail(`${label}: 화면 캡처가 비었습니다.`);
  screenshots += 1;
}

function commandPath(command, fallback) {
  return process.env[command] || fallback;
}

async function captureA4(page, filename, label) {
  await page.emulateMedia({ media: "print" });
  const pdfPath = path.join(outputDir, filename);
  await page.pdf({ path: pdfPath, format: "A4", printBackground: true, preferCSSPageSize: true });
  if (!fs.existsSync(pdfPath) || fs.statSync(pdfPath).size < 3000) fail(`${label}: A4 PDF가 비었습니다.`);
  pdfs += 1;
  try {
    const info = execFileSync(commandPath("HSE_PDFINFO", "pdftoppm"), commandPath("HSE_PDFINFO", "pdftoppm") === "pdftoppm" ? ["-f", "1", "-l", "1", "-png", "-singlefile", pdfPath, path.join(outputDir, filename.replace(/\.pdf$/, "-page"))] : [pdfPath], { encoding: "utf8", stdio: "pipe" });
    if (commandPath("HSE_PDFINFO", "pdftoppm") !== "pdftoppm" && !/Pages:\s+1/.test(info)) fail(`${label}: A4 PDF가 한 쪽이 아닙니다.`);
    const pngPath = path.join(outputDir, filename.replace(/\.pdf$/, "-page.png"));
    if (commandPath("HSE_PDFINFO", "pdftoppm") === "pdftoppm" && (!fs.existsSync(pngPath) || fs.statSync(pngPath).size < 5000)) fail(`${label}: A4 렌더 페이지가 비었습니다.`);
    renderedPdfPages += 1;
  } catch (error) {
    fail(`${label}: A4 페이지 검사가 실패했습니다 (${error.message}).`);
  }
  await page.emulateMedia({ media: "screen" });
}

async function captureActualA4(page, filename, label, view) {
  await page.emulateMedia({ media: "print" });
  const printState = await page.evaluate(expectedView => {
    const isProblem = expectedView === "problem";
    const active = document.querySelector(isProblem ? "#problemView" : "#solutionView");
    const inactive = document.querySelector(isProblem ? "#solutionView" : "#problemView");
    const items = [...(active?.querySelectorAll(isProblem ? ".question-item" : ".solution-item") || [])];
    const issues = [];
    if (!active || active.hidden || !inactive || !inactive.hidden) issues.push("문제·답 인쇄 영역 분리 실패");
    items.forEach((item, index) => {
      const sheet = item.closest(".print-page");
      const itemBox = item.getBoundingClientRect();
      const sheetBox = sheet?.getBoundingClientRect();
      if (!sheet || !sheetBox) issues.push(`${index + 1}번 문항의 인쇄 페이지가 없습니다.`);
      else if (itemBox.left < sheetBox.left - 1 || itemBox.right > sheetBox.right + 1 || itemBox.top < sheetBox.top - 1 || itemBox.bottom > sheetBox.bottom + 1) issues.push(`${index + 1}번 문항 페이지 경계 이탈`);
      if (item.scrollWidth > item.clientWidth + 2) issues.push(`${index + 1}번 문항 가로 넘침`);
    });
    return { itemCount: items.length, pageCount: active?.querySelectorAll(".print-page").length || 0, issues };
  }, view);
  if (printState.itemCount !== 3 || printState.pageCount !== 3 || printState.issues.length) fail(`${label}: 실제 A4 페이지 검사 ${printState.issues.join(", ") || `문항/쪽 ${printState.itemCount}/${printState.pageCount}`}`);
  const pdfPath = path.join(outputDir, filename);
  await page.pdf({ path: pdfPath, format: "A4", printBackground: true, preferCSSPageSize: true });
  if (!fs.existsSync(pdfPath) || fs.statSync(pdfPath).size < 5000) fail(`${label}: 실제 A4 PDF가 비었습니다.`);
  pdfs += 1;
  try {
    const info = execFileSync("pdfinfo", [pdfPath], { encoding: "utf8" });
    const pageCount = Number(info.match(/^Pages:\s+(\d+)/m)?.[1] || 0);
    if (pageCount !== 3) fail(`${label}: 실제 A4 PDF가 ${pageCount}쪽입니다. 3쪽이어야 합니다.`);
    const pngBase = path.join(outputDir, filename.replace(/\.pdf$/, "-page"));
    execFileSync("pdftoppm", ["-png", pdfPath, pngBase], { stdio: "ignore" });
    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      const pngPath = `${pngBase}-${pageNumber}.png`;
      if (!fs.existsSync(pngPath) || fs.statSync(pngPath).size < 5000) fail(`${label}: 실제 A4 ${pageNumber}쪽 렌더가 비었습니다.`);
      else renderedPdfPages += 1;
    }
  } catch (error) {
    fail(`${label}: 실제 A4 페이지 검사가 실패했습니다 (${error.message}).`);
  }
  await page.emulateMedia({ media: "screen" });
}

async function inspectAppRoute(browser, baseUrl, viewportName, viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  const route = `${baseUrl}/hselementary/question-bank/index.html?type=${encodeURIComponent(sourceItemId)}&review=1&difficulty=0`;
  try {
    await page.goto(route, { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.waitForTimeout(180);
    const problemState = await page.evaluate(() => ({
      worksheetOpen: document.querySelector("#worksheet")?.hidden === false,
      problemCount: document.querySelectorAll("#problemView .question-item").length,
      pageCount: document.querySelectorAll("#problemView .print-page").length,
      diagramCount: document.querySelectorAll("#problemView svg.source61-e2ex2-diagram").length,
      sourceCount: [...document.querySelectorAll("#problemView svg.source61-e2ex2-diagram")].filter(svg => svg.dataset.source61E2ex2Phase === "problem").length,
      targetOrders: [...document.querySelectorAll("#problemView svg.source61-e2ex2-diagram")].map(svg => svg.dataset.targetOrder),
      overflow: document.documentElement.scrollWidth > innerWidth + 2,
      clipped: [...document.querySelectorAll("#problemView .question-item,#problemView svg.source61-e2ex2-diagram")].some(node => { const box = node.getBoundingClientRect(); return box.left < -2 || box.right > innerWidth + 2 || node.scrollWidth > node.clientWidth + 2; })
    }));
    if (!problemState.worksheetOpen || problemState.problemCount !== 3 || problemState.pageCount !== 3 || problemState.diagramCount !== 3 || problemState.sourceCount !== 3 || problemState.targetOrders.some(order => order !== "G-N-D-R") || problemState.overflow || problemState.clipped) fail(`실제 앱 URL / ${viewportName}: Example2 문제 3개·3쪽 또는 화면 경계가 다릅니다 (${JSON.stringify(problemState)}).`);
    await capture(page, `actual-${viewportName}-problem.png`, `실제 앱 URL / ${viewportName} / 문제`);
    if (viewportName === "desktop") await captureActualA4(page, "actual-problem-a4.pdf", "실제 앱 URL / 문제", "problem");
    await page.click("#solutionTab");
    await page.waitForTimeout(80);
    const answerState = await page.evaluate(() => ({
      answerCount: document.querySelectorAll("#solutionView .solution-item").length,
      pageCount: document.querySelectorAll("#solutionView .print-page").length,
      diagramCount: document.querySelectorAll("#solutionView svg.source61-e2ex2-diagram").length,
      solvedCount: document.querySelectorAll("#solutionView .source61-e2ex2-target.is-solved").length,
      sourceCount: [...document.querySelectorAll("#solutionView [data-answer-source]")].filter(node => node.dataset.answerSource === "6-1-u3-e2-example-2").length,
      overflow: document.documentElement.scrollWidth > innerWidth + 2,
      clipped: [...document.querySelectorAll("#solutionView .solution-item,#solutionView svg.source61-e2ex2-diagram")].some(node => { const box = node.getBoundingClientRect(); return box.left < -2 || box.right > innerWidth + 2 || node.scrollWidth > node.clientWidth + 2; })
    }));
    if (answerState.answerCount !== 3 || answerState.pageCount !== 3 || answerState.diagramCount !== 3 || answerState.solvedCount !== 3 || answerState.sourceCount !== 3 || answerState.overflow || answerState.clipped) fail(`실제 앱 URL / ${viewportName}: 정답·풀이 3개·3쪽 또는 화면 경계가 다릅니다 (${JSON.stringify(answerState)}).`);
    await capture(page, `actual-${viewportName}-answer.png`, `실제 앱 URL / ${viewportName} / 답`);
    if (viewportName === "desktop") await captureActualA4(page, "actual-answer-a4.pdf", "실제 앱 URL / 답", "answer");
  } catch (error) {
    fail(`실제 앱 URL: 라우트 검사 실패 (${error.message}).`);
  } finally {
    await page.close();
  }
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const api = buildGenerator();
  inspectSourceContract(api);
  const { server, baseUrl } = await startServer();
  let browser;
  try {
    browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--disable-quic"] });
    await inspectAppRoute(browser, baseUrl, "desktop", { width: 1440, height: 900 });
    await inspectAppRoute(browser, baseUrl, "mobile", { width: 390, height: 844 });
    for (let poolIndex = 0; poolIndex < 3; poolIndex += 1) {
      for (const difficulty of [-1, 0, 1]) {
        const generated = generatedForPool(api, difficulty, poolIndex);
        const generatedLabel = `난이도 ${difficulty} / 문항 ${poolIndex}`;
        if (generated.generator !== generatorKey || generated.sourceItemId !== sourceItemId || generated.generationMode !== "fixed-verified-pool" || generated.verifiedVariantCount !== 3) fail(`${generatedLabel}: 생성기·원문·고정 3문항 계약이 다릅니다.`);
        inspectCoordinates(generated, poolIndex, generatedLabel);
        const problemSvg = svgFrom(generated.prompt);
        const answerSvg = svgFrom(generated.answerVisual);
        if (attr(problemSvg, "data-source61-e2ex2-points") !== attr(answerSvg, "data-source61-e2ex2-points")) fail(`${generatedLabel}: 문제와 답의 좌표 문자열이 다릅니다.`);
        for (const [viewportName, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
          const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
          try {
            await page.goto(`${baseUrl}/hselementary/question-bank/index.html`, { waitUntil: "domcontentloaded" });
            let problemState;
            for (const view of ["problem", "answer"]) {
              const state = await inspectMarkup(page, generated, view, viewportName, difficulty, poolIndex);
              if (view === "problem") problemState = state;
              else if (state.problemPointData !== problemState.problemPointData) fail(`${viewportName} / 난이도 ${difficulty} / 문항 ${poolIndex}: 문제와 답의 점 데이터가 다릅니다.`);
              await capture(page, `pool-${poolIndex}-${difficulty}-${viewportName}-${view}.png`, `${viewportName} / 난이도 ${difficulty} / 문항 ${poolIndex} / ${view}`);
            }
            if (difficulty === 0 && viewportName === "desktop") {
              for (const view of ["problem", "answer"]) {
                await inspectMarkup(page, generated, view, viewportName, difficulty, poolIndex);
                await captureA4(page, `pool-${poolIndex}-${view}-a4.pdf`, `${view} / 문항 ${poolIndex} / A4`);
              }
            }
          } finally {
            await page.close();
          }
        }
      }
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  if (screenshots !== 40) fail(`화면 캡처가 ${screenshots}장입니다. 40장이어야 합니다.`);
  if (pdfs !== 8 || renderedPdfPages !== 12) fail(`A4 PDF/렌더가 ${pdfs}/${renderedPdfPages}개입니다. 8/12이어야 합니다.`);
  const summary = `${failures.length ? "실패" : "통과"}: 6-1-u3-e2-example-2 3문항×3난이도×PC1440/mobile390 문제·답, 세 정사각형·두 선분·G-N-D-R 라벨 좌표·문제/답 좌표 동일·답 전용 강조·15px 공통 글꼴·겹침/잘림/넘침·실제 앱 3문항 3쪽·A4 검사; 화면 ${screenshots}장, A4 ${pdfs}개, 렌더 ${renderedPdfPages}쪽\n${failures.join("\n")}\n`;
  fs.writeFileSync(path.join(outputDir, "audit-result.txt"), summary, "utf8");
  console.log(`결과 폴더: ${outputDir}`);
  console.log(summary);
  if (failures.length) process.exitCode = 1;
})().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
