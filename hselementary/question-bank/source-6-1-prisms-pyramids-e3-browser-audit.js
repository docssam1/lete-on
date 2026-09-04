"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const questionBankDir = __dirname;
const repoRoot = path.resolve(questionBankDir, "..", "..");
const playwrightPath = process.env.HSE_PLAYWRIGHT_PATH
  || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright";
const { PNG } = require(path.join(path.dirname(playwrightPath), "pngjs"));
const outputDir = process.env.HSE_SCREENSHOT_DIR
  || path.join(questionBankDir, "tmp", "source-6-1-prisms-pyramids-e3-browser-audit");
const sources = [
  { id: "6-1-u2-e3-example-3-1", search: "예제 3-1", kind: "pyramid-edge-from-counts" },
  { id: "6-1-u2-e3-mission-1", search: "Mission 1", kind: "prism-pyramid-edge-product" },
  { id: "6-1-u2-e3-mission-5", search: "Mission 5", kind: "pyramid-edge-marks" },
  { id: "6-1-u2-e3-mission-6", search: "Mission 6", kind: "paper-solids-edge-difference" }
];
const difficulties = [-1, 0, 1];
const difficultyNames = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const expectedAnswers = {
  "6-1-u2-e3-example-3-1": ["20개", "24개", "28개"],
  "6-1-u2-e3-mission-1": ["864", "1014", "1176"],
  "6-1-u2-e3-mission-5": ["157개", "173개", "189개"],
  "6-1-u2-e3-mission-6": ["3cm", "4cm", "5cm"]
};
const failures = [];
let screenshots = 0;
let pdfs = 0;
let renderedPages = 0;
let checkedViews = 0;
const fail = message => failures.push(message);

function safePath(urlPath) {
  const relative = decodeURIComponent(urlPath.split("?")[0]).replace(/^\/+/, "");
  const file = path.resolve(repoRoot, relative || "index.html");
  return file === repoRoot || file.startsWith(repoRoot + path.sep) ? file : null;
}
function contentType(file) {
  return ({ ".css": "text/css", ".html": "text/html", ".js": "application/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png" })[path.extname(file)] || "application/octet-stream";
}
async function startServer() {
  const server = http.createServer((request, response) => {
    let file = safePath(request.url || "/");
    if (file && fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404); response.end("Not found"); return; }
    response.writeHead(200, { "Content-Type": `${contentType(file)}; charset=utf-8`, "Cache-Control": "no-store" });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  return { server, baseUrl: `http://127.0.0.1:${server.address().port}/hselementary/question-bank/` };
}
function attachListeners(page, label) {
  page.on("pageerror", error => fail(`${label}: 브라우저 예외 ${error.message}`));
  page.on("console", message => { if (message.type() === "error" && !/Failed to load resource.*(?:404|ERR_[A-Z_]+)/.test(message.text())) fail(`${label}: 콘솔 오류 ${message.text()}`); });
}
function bodyInkPixels(file) {
  const png = PNG.sync.read(fs.readFileSync(file));
  let count = 0;
  for (let y = Math.floor(png.height * .1); y < Math.floor(png.height * .72); y += 1) for (let x = Math.floor(png.width * .04); x < Math.floor(png.width * .96); x += 1) {
    const i = (y * png.width + x) * 4;
    if (png.data[i] < 180 || png.data[i + 1] < 180 || png.data[i + 2] < 180) count += 1;
  }
  return count;
}
function renderPdf(pdfPath, prefix, label) {
  try {
    const info = execFileSync("pdfinfo", [pdfPath], { encoding: "utf8" });
    const expected = Number(info.match(/^Pages:\s+(\d+)$/m)?.[1] || 0);
    const dir = path.dirname(prefix), stem = path.basename(prefix);
    execFileSync("pdftoppm", ["-png", pdfPath, prefix], { stdio: "ignore" });
    const files = fs.readdirSync(dir).filter(name => new RegExp(`^${stem}-\\d+\\.png$`).test(name)).sort((a, b) => Number(a.match(/-(\d+)\.png$/)[1]) - Number(b.match(/-(\d+)\.png$/)[1]));
    if (files.length !== expected) fail(`${label}: PDF ${expected}쪽 중 ${files.length}쪽만 렌더되었습니다.`);
    for (const file of files) if (fs.statSync(path.join(dir, file)).size < 5000 || bodyInkPixels(path.join(dir, file)) < 8000) fail(`${label}: ${file} 본문이 비어 있습니다.`);
    renderedPages += files.length;
  } catch (error) { fail(`${label}: A4 렌더 실패 ${error.message}`); }
}
async function choose(page, baseUrl, source, difficulty) {
  await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#gradeFilter button[data-grade='6']").click();
  await page.locator("#termFilter button[data-term='1']").click();
  await page.locator("#typeSearchInput").fill(source.search);
  const row = page.locator(`[data-preview-type-id='${source.id}']`);
  await row.waitFor({ state: "visible", timeout: 20000 });
  const checkbox = row.locator(`input[data-type-id='${source.id}']`);
  if (await checkbox.isDisabled()) throw new Error("원문 확인 유형이 잠겨 있습니다.");
  await checkbox.check();
  await page.locator("#questionCountInput").fill("3");
  await page.locator(`#difficultyFilter button[data-difficulty='${difficulty}']`).click();
  if (!(await page.locator(`#selectedTypeList [data-remove-type='${source.id}']`).count())) throw new Error("선택 요약에 유형이 없습니다.");
  await page.locator("#generateButton").click();
  await page.locator("#problemView:not([hidden])").waitFor({ state: "visible", timeout: 20000 });
}
async function inspect(page, source, difficulty, answerView, label) {
  const state = await page.evaluate(({ answer }) => {
    const selector = answer ? "#solutionView .solution-item" : "#problemView .question-item";
    const items = [...document.querySelectorAll(selector)];
    const readable = element => { const style = getComputedStyle(element); const box = element.getBoundingClientRect(); return style.display !== "none" && style.visibility !== "hidden" && box.width > 0 && box.height > 0; };
    const svgState = svg => {
      const box = svg?.getBoundingClientRect();
      let drawing = { width: 0, height: 0 };
      try { const b = svg?.getBBox(); drawing = { width: b?.width || 0, height: b?.height || 0 }; } catch (_) {}
      return {
        exists: Boolean(svg), visible: Boolean(svg && readable(svg)), outside: Boolean(svg && (box.left < -2 || box.right > document.documentElement.clientWidth + 2)),
        drawingWidth: drawing.width, drawingHeight: drawing.height, structure: svg?.dataset.source61E3Structure || "", viewBox: svg?.getAttribute("viewBox") || "",
        signature: [svg?.dataset.source61E3Structure || "", svg?.dataset.paperTriangle || "", svg?.dataset.paperRectangle || "", svg?.dataset.paperSquare || "", svg?.dataset.edgeLengthCm || "", svg?.dataset.markIntervalCm || ""].join("|"),
        paperTriangle: svg?.dataset.paperTriangle || "", paperTriangleValueCount: svg?.dataset.paperTriangle?.split(",").filter(Boolean).length || 0, paperTrianglePointCount: svg?.querySelector("polygon")?.getAttribute("points")?.trim().split(/\s+/).length || 0,
        pool: svg?.closest("[data-verified-pool-index]")?.dataset.verifiedPoolIndex || "",
        baseSides: svg?.dataset.baseSides || "", pyramidEdges: svg?.dataset.pyramidEdgeCount || "", innerDots: svg?.querySelectorAll(".source61-e3-mark.is-result").length || 0,
        answerVertices: svg?.querySelectorAll(".source61-e3-answer-vertex").length || 0, prismEdges: svg?.querySelectorAll('[data-solid-edge="triangular-prism"]').length || 0,
        pyramidEdgeLines: svg?.querySelectorAll('[data-solid-edge="square-pyramid"]').length || 0, prismVertices: svg?.querySelectorAll('[data-solid-vertex="triangular-prism"]').length || 0,
        pyramidVertices: svg?.querySelectorAll('[data-solid-vertex="square-pyramid"]').length || 0
      };
    };
    return {
      count: items.length,
      text: items.map(item => item.innerText || ""),
      svgs: items.map(item => svgState(item.querySelector("svg.source61-e3-diagram"))),
      evidence: items.map(item => [...item.querySelectorAll("[data-source61-prism-e3-kind]")].map(node => ({ kind: node.dataset.source61PrismE3Kind || "", source: node.dataset.sourceItem || "", difficulty: node.dataset.difficultyDesign || "" }))),
      problemAnswerLeak: document.querySelectorAll("#problemView .solution-answer-visual,#problemView [data-answer-source],#problemView .solution-item,#problemView .source61-e3-result-label,#problemView .source61-e3-answer-edge,#problemView .source61-e3-mark.is-result,#problemView [data-solved='true']").length,
      pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      body: document.body.innerText || ""
    };
  }, { answer: answerView });
  checkedViews += 1;
  if (state.count !== 3) fail(`${label}: 문항 수 ${state.count}, 3이어야 합니다.`);
  if (state.pageOverflow || /undefined|null|NaN|Infinity|SyntaxError/.test(state.body)) fail(`${label}: 화면 넘침 또는 깨진 값이 있습니다.`);
  if (state.svgs.some(svg => !svg.exists || !svg.visible || svg.outside || svg.drawingWidth <= 0 || svg.drawingHeight <= 0)) fail(`${label}: E3 도형이 보이지 않거나 화면 밖입니다.`);
  if (!answerView && state.problemAnswerLeak) fail(`${label}: 문제 화면에 답·풀이가 노출되었습니다.`);
  for (let i = 0; i < state.svgs.length; i += 1) {
    const svg = state.svgs[i];
    const evidence = state.evidence[i]?.length === 1 && state.evidence[i][0].kind === source.kind && state.evidence[i][0].source === source.id && state.evidence[i][0].difficulty === difficultyNames[String(difficulty)];
    if (!evidence) fail(`${label}: source ID·유형·난이도 메타데이터가 맞지 않습니다.`);
    if (answerView && !svg.structure) fail(`${label}: 답 그림 구조 서명이 없습니다.`);
    if (!answerView && source.id.startsWith("6-1-u2-e3-example-3-1") && (svg.baseSides !== "unknown" || (svg.pyramidEdges && svg.pyramidEdges !== "unknown"))) fail(`${label}: 문제 그림에 실제 n각형 수가 누출되었습니다.`);
    if (!answerView && source.id === "6-1-u2-e3-mission-5" && svg.innerDots !== 0) fail(`${label}: Mission5 문제에 안쪽 점이 보입니다.`);
    if (answerView && source.id === "6-1-u2-e3-mission-5" && (svg.innerDots !== [19, 21, 23][Number(svg.pool)] || svg.answerVertices !== 5)) fail(`${label}: Mission5 답의 안쪽 점 또는 꼭짓점 수가 다릅니다.`);
    if (!answerView && source.id === "6-1-u2-e3-mission-6" && (svg.prismEdges || svg.pyramidEdgeLines)) fail(`${label}: Mission6 문제에 완성 입체가 노출되었습니다.`);
    if (answerView && source.id === "6-1-u2-e3-mission-6" && (svg.prismEdges !== 9 || svg.prismVertices !== 6 || svg.pyramidEdgeLines !== 8 || svg.pyramidVertices !== 5)) fail(`${label}: Mission6 답의 모서리·꼭짓점 수가 다릅니다.`);
    if (answerView && source.id === "6-1-u2-e3-example-3-1" && (svg.baseSides !== String([10, 12, 14][Number(svg.pool)]) || svg.pyramidEdges !== String([20, 24, 28][Number(svg.pool)]))) fail(`${label}: Example3-1 답의 모서리 수가 pool과 다릅니다.`);
    if (answerView && source.id === "6-1-u2-e3-mission-1" && (svg.baseSides !== String([12, 13, 14][Number(svg.pool)]) || svg.pyramidEdges !== String([24, 26, 28][Number(svg.pool)]))) fail(`${label}: Mission1 답의 모서리 수가 pool과 다릅니다.`);
    if (source.id === "6-1-u2-e3-mission-6" && (svg.paperTrianglePointCount !== 3 || svg.paperTriangleValueCount !== 3)) fail(`${label}: Mission6 첫 삼각형의 점 또는 data-paper-triangle이 맞지 않습니다.`);
    if (source.id === "6-1-u2-e3-mission-6" && ((answerView && svg.viewBox !== "0 0 330 305") || (!answerView && svg.viewBox !== "0 0 330 112"))) fail(`${label}: Mission6 viewBox가 문제/답 기준과 다릅니다.`);
  }
  if (answerView) {
    if (state.svgs.map(svg => svg.pool).sort().join(",") !== "0,1,2") fail(`${label}: 답 그림 pool 0,1,2가 한 번씩 나오지 않습니다.`);
    const problemStructures = await page.evaluate(() => [...document.querySelectorAll("#problemView svg.source61-e3-diagram")].map(svg => svg.dataset.source61E3Structure || ""));
    if (problemStructures.join("|") !== state.svgs.map(svg => svg.structure).join("|")) fail(`${label}: 문제와 답의 SVG 구조 서명이 다릅니다.`);
    const problemSignatures = await page.evaluate(() => [...document.querySelectorAll("#problemView svg.source61-e3-diagram")].map(svg => [svg.dataset.source61E3Structure || "", svg.dataset.paperTriangle || "", svg.dataset.paperRectangle || "", svg.dataset.paperSquare || "", svg.dataset.edgeLengthCm || "", svg.dataset.markIntervalCm || ""].join("|")));
    if (problemSignatures.join("|") !== state.svgs.map(svg => svg.signature).join("|")) fail(`${label}: 문제와 답의 data object 서명이 다릅니다.`);
  }
  return state;
}
async function capture(page, source, difficulty, viewport, view) {
  const file = path.join(outputDir, `${source.id}-${difficulty}-${viewport}-${view}.png`);
  await page.screenshot({ path: file, fullPage: true, timeout: 120000 });
  if (!fs.existsSync(file) || fs.statSync(file).size < 5000) fail(`${source.id}: ${view}/${viewport} 캡처가 비었습니다.`);
  screenshots += 1;
}
async function captureA4(page, source, view, tab) {
  await page.locator(`#${tab}`).click();
  await page.emulateMedia({ media: "print" });
  const pdf = path.join(outputDir, `${source.id}-${view}-a4.pdf`);
  await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
  pdfs += 1;
  renderPdf(pdf, pdf.replace(/\.pdf$/, "-page"), `${source.id}/${view}`);
  await page.emulateMedia({ media: "screen" });
}
async function inspectType(browser, baseUrl, source, difficulty, viewport, viewportLabel) {
  const label = `${source.id}/${viewportLabel}/난이도${difficulty}`;
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  attachListeners(page, label);
  try {
    await choose(page, baseUrl, source, difficulty);
    const problem = await inspect(page, source, difficulty, false, label);
    await page.locator("#solutionTab").click();
    await page.locator("#solutionView:not([hidden])").waitFor({ state: "visible", timeout: 10000 });
    const answer = await inspect(page, source, difficulty, true, label);
    if (difficulty === 0 && viewportLabel === "desktop") { await captureA4(page, source, "problem", "problemTab"); await captureA4(page, source, "answer", "solutionTab"); }
    await page.locator("#problemTab").click(); await capture(page, source, difficulty, viewportLabel, "problem");
    await page.locator("#solutionTab").click(); await capture(page, source, difficulty, viewportLabel, "answer");
    for (const svg of answer.svgs) { const pool = Number(svg.pool); if (!Number.isInteger(pool) || !answer.text[answer.svgs.indexOf(svg)].includes(expectedAnswers[source.id][pool])) fail(`${label}: pool ${pool} 공식 답이 예상과 다릅니다.`); }
  } catch (error) { fail(`${label}: 브라우저 감사 실패 ${error.message}`); }
  finally { await page.close(); }
}
function generatorReady() {
  global.window = {};
  delete require.cache[require.resolve("./generators.js")];
  require("./generators.js");
  const api = global.window.HSE_GENERATORS;
  if (!api?.names?.includes("sourceGrade6PrismsPyramidsE3")) { fail("E3 생성기가 등록되지 않았습니다."); return false; }
  for (let variant = 0; variant < 4; variant += 1) for (let pool = 0; pool < 3; pool += 1) {
    try {
      const result = api.generate({ generatorKey: "sourceGrade6PrismsPyramidsE3", variant, sourceItemId: sources[variant].id }, 0, 0, 9000 + pool, pool);
      if (result.generationMode !== "fixed-verified-pool" || result.verifiedVariantCount !== 3 || result.sourceItemId !== sources[variant].id) fail(`생성기 variant ${variant}/${pool} 계약이 맞지 않습니다.`);
    } catch (error) { fail(`생성기 준비 실패 ${variant}/${pool}: ${error.message}`); }
  }
  return true;
}
(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  if (!generatorReady()) throw new Error(failures.join("\n"));
  const { server, baseUrl } = await startServer();
  let browser;
  try {
    const { chromium } = require(playwrightPath);
    browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--disable-quic"] });
    for (const source of sources) for (const difficulty of difficulties) {
      await inspectType(browser, baseUrl, source, difficulty, { width: 1440, height: 900 }, "desktop");
      await inspectType(browser, baseUrl, source, difficulty, { width: 390, height: 844 }, "mobile");
    }
  } finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); }
  if (screenshots !== 48) fail(`화면 캡처 ${screenshots}장, 48장이어야 합니다.`);
  if (pdfs !== 8) fail(`A4 PDF ${pdfs}개, 8개이어야 합니다.`);
  if (renderedPages < pdfs) fail(`A4 PDF ${pdfs}개의 전체 페이지 렌더가 부족합니다.`);
  const summary = `${failures.length ? "실패" : "통과"}: E3 4유형×3난이도×PC/모바일, 3문항 고정 pool, 문제·답 그림 구조·누출·메타데이터·A4 전체 페이지 검사; 화면 ${screenshots}장, A4 ${pdfs}개, PNG ${renderedPages}쪽, 확인 뷰 ${checkedViews}개\n${failures.join("\n")}\n`;
  fs.writeFileSync(path.join(outputDir, "audit-result.txt"), summary, "utf8");
  if (failures.length) throw new Error(failures.join("\n"));
  console.log(`6-1 2단원 개념탐구 3 E3 브라우저 감사 통과: 4유형×3난이도 · 화면 48장 · A4 8개 전 페이지 ${renderedPages}쪽`);
})().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
