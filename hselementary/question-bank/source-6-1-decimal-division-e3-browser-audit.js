"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const root = path.resolve(__dirname, "../..");
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(require("node:os").tmpdir(), "source-6-1-decimal-division-e3-browser-audit");
const sourceIds = [
  "6-1-u3-e3-exploration-1", "6-1-u3-e3-example-1", "6-1-u3-e3-example-2", "6-1-u3-e3-example-3",
  "6-1-u3-e3-example-4", "6-1-u3-e3-mission-1", "6-1-u3-e3-mission-2", "6-1-u3-e3-mission-3",
  "6-1-u3-e3-mission-4", "6-1-u3-e3-mission-5", "6-1-u3-e3-mission-6"
];
const failures = [];
let screenshots = 0;
let pdfs = 0;
let renderedPdfPages = 0;
const fail = message => failures.push(message);

function startServer() {
  const server = http.createServer((request, response) => {
    const requestPath = decodeURIComponent((request.url || "/").split("?")[0]);
    const relative = requestPath === "/" ? "/hselementary/question-bank/index.html" : requestPath;
    const filePath = path.resolve(root, `.${relative}`);
    if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) { response.writeHead(404); response.end("not found"); return; }
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

function svgMarkup(markup) { return String(markup).match(/<svg class="[^"]*source61-decimal-e3-diagram[\s\S]*?<\/svg>/)?.[0] || ""; }

async function inspect(page, generated, sourceId, difficulty, view, viewportName) {
  const content = view === "problem"
    ? `<main class="question-pages"><section class="question-item"><div class="question-prompt">${generated.prompt}</div></section></main>`
    : `<main class="answer-pages"><section class="solution-item"><div class="solution-answer-visual">${generated.answerVisual}</div><div class="solution-explanation">${generated.solution}</div></section></main>`;
  await page.evaluate(html => { document.body.innerHTML = html; }, content);
  await page.waitForTimeout(35);
  const state = await page.evaluate(() => {
    const item = document.querySelector(".question-item,.solution-item");
    const svgs = [...document.querySelectorAll("svg.source61-decimal-e3-diagram")];
    const overlaps = [];
    svgs.forEach((svg, svgIndex) => {
      const texts = [...svg.querySelectorAll("text")].map(node => ({ box: node.getBoundingClientRect() }));
      texts.forEach((left, index) => texts.slice(index + 1).forEach((right, offset) => {
        if (left.box.left < right.box.right - 1 && left.box.right > right.box.left + 1 && left.box.top < right.box.bottom - 1 && left.box.bottom > right.box.top + 1) overlaps.push(`${svgIndex}:${index}:${index + offset + 1}`);
      }));
    });
    const itemBox = item?.getBoundingClientRect();
    return {
      bodyText: document.body.innerText || "",
      item: item ? { x: itemBox.x, right: itemBox.right, scrollWidth: item.scrollWidth, clientWidth: item.clientWidth } : null,
      pageOverflow: document.documentElement.scrollWidth > innerWidth + 2,
      overlaps,
      svgs: svgs.map(svg => { const box = svg.getBoundingClientRect(); return { x: box.x, right: box.right, width: box.width, height: box.height, structure: svg.dataset.source61E3Structure || "", values: svg.dataset.source61E3Values || "", bbox: (() => { try { const b = svg.getBBox(); return { width: b.width, height: b.height }; } catch (_) { return { width: 0, height: 0 }; } })(), font: getComputedStyle(svg.querySelector("text") || svg).fontFamily }; }),
      answer: document.querySelector(".source61-decimal-e3-answer")?.dataset || null,
      resultCount: document.querySelectorAll("svg.source61-decimal-e3-diagram[data-result-highlight]").length,
      problemResultRows: document.querySelectorAll(".source61-e3-result,[data-result-highlight],.source61-decimal-e3-answer").length
    };
  });
  const label = `${sourceId} / ${viewportName} / 난이도 ${difficulty} / ${view}`;
  const width = await page.evaluate(() => innerWidth);
  if (!state.item || state.pageOverflow || state.item.scrollWidth > state.item.clientWidth + 2 || state.item.x < -2 || state.item.right > width + 2) fail(`${label}: 가로 넘침 또는 화면 밖 문항`);
  if (state.svgs.length !== 1 || state.svgs.some(svg => svg.width <= 0 || svg.height <= 0 || svg.bbox.width <= 0 || svg.bbox.height <= 0 || !svg.structure || !svg.values)) fail(`${label}: 빈 그림 또는 자료 속성 누락`);
  if (state.overlaps.length) fail(`${label}: SVG 글자 겹침 ${state.overlaps.join(",")}`);
  if (/undefined|null|NaN|Infinity|\$\{[^}]+\}|순열|조합|일차식|절댓값/.test(state.bodyText)) fail(`${label}: 깨진 값 또는 학년 밖 표현`);
  if (view === "problem") {
    if (state.problemResultRows || /조건을 만족하는 답 표시|가능한 N →|답 숫자 →/.test(state.bodyText)) fail(`${label}: 문제 화면에 생성된 답 또는 결과 줄이 보입니다.`);
  } else {
    if (!state.answer || state.answer.answerSource !== sourceId || state.answer.verifiedPoolIndex === undefined || state.resultCount !== 1) fail(`${label}: 답 source/pool 또는 결과 강조가 없습니다.`);
    if (state.svgs.some(svg => !svg.font.includes("Pretendard") || !svg.font.includes("Malgun Gothic") || !svg.font.includes("Arial"))) fail(`${label}: 공통 수학 글꼴이 없습니다.`);
  }
  return state;
}

async function capture(page, filename, label) {
  const file = path.join(outputDir, filename);
  await page.screenshot({ path: file, fullPage: true, timeout: 120000 });
  if (!fs.existsSync(file) || fs.statSync(file).size < 2000) fail(`${label}: 화면 캡처가 비었습니다.`);
  screenshots += 1;
}

async function captureA4(page, filename, label) {
  await page.emulateMedia({ media: "print" });
  const pdf = path.join(outputDir, filename);
  await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
  if (!fs.existsSync(pdf) || fs.statSync(pdf).size < 2000) fail(`${label}: A4 PDF가 비었습니다.`);
  pdfs += 1;
  const pngBase = path.join(outputDir, filename.replace(/\.pdf$/, "-page"));
  try {
    execFileSync("pdftoppm", ["-f", "1", "-l", "1", "-png", "-singlefile", pdf, pngBase], { stdio: "ignore" });
    if (!fs.existsSync(`${pngBase}.png`) || fs.statSync(`${pngBase}.png`).size < 5000) fail(`${label}: A4 렌더 페이지가 비었습니다.`);
    else renderedPdfPages += 1;
  } catch (error) { fail(`${label}: A4 렌더 실패 (${error.message})`); }
  await page.emulateMedia({ media: "screen" });
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const api = buildGenerator();
  const { server, baseUrl } = await startServer();
  let browser;
  try {
    browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--disable-quic"] });
    for (const sourceId of sourceIds) {
      const routePage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      await routePage.goto(`${baseUrl}/hselementary/question-bank/index.html?type=${encodeURIComponent(sourceId)}&review=1&difficulty=0`, { waitUntil: "domcontentloaded", timeout: 90000 });
      await routePage.waitForTimeout(100);
      const route = await routePage.evaluate(() => ({ open: document.querySelector("#worksheet")?.hidden === false, count: document.querySelectorAll("#problemView .question-item").length, diagrams: document.querySelectorAll("#problemView svg.source61-decimal-e3-diagram").length }));
      if (!route.open || route.count !== 3 || route.diagrams !== 3) fail(`${sourceId}: 실제 앱 URL에서 E3 3문항이 열리지 않습니다.`);
      await routePage.close();
    }
    const viewports = [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]];
    for (let variant = 0; variant < sourceIds.length; variant += 1) for (const difficulty of [-1, 0, 1]) {
      const generated = api.generate({ sourceItemId: sourceIds[variant], reviewLocked: false }, 0, difficulty, 610330 + variant * 100000 + (difficulty + 1) * 1000 + 17, variant);
      for (const [viewportName, viewport] of viewports) {
        const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
        await page.goto(`${baseUrl}/hselementary/question-bank/index.html`, { waitUntil: "domcontentloaded", timeout: 90000 });
        const problem = await inspect(page, generated, sourceIds[variant], difficulty, "problem", viewportName);
        await capture(page, `${sourceIds[variant]}-${difficulty}-${viewportName}-problem.png`, `${sourceIds[variant]} problem`);
        const answer = await inspect(page, generated, sourceIds[variant], difficulty, "answer", viewportName);
        await capture(page, `${sourceIds[variant]}-${difficulty}-${viewportName}-answer.png`, `${sourceIds[variant]} answer`);
        if (problem.svgs[0]?.structure !== answer.svgs[0]?.structure || problem.svgs[0]?.values !== answer.svgs[0]?.values) fail(`${sourceIds[variant]} / ${viewportName} / 난이도 ${difficulty}: 문제·답 SVG 자료가 다릅니다.`);
        if (viewportName === "desktop" && difficulty === 0) {
          await inspect(page, generated, sourceIds[variant], difficulty, "problem", viewportName);
          await captureA4(page, `${sourceIds[variant]}-problem-a4.pdf`, `${sourceIds[variant]} problem`);
          await inspect(page, generated, sourceIds[variant], difficulty, "answer", viewportName);
          await captureA4(page, `${sourceIds[variant]}-answer-a4.pdf`, `${sourceIds[variant]} answer`);
        }
        await page.close();
      }
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  const summary = `${failures.length ? "실패" : "통과"}: E3 11유형×3난이도×PC1440/mobile390 문제·답, 결과 누출·동일 자료·글꼴·글자 겹침·가로 넘침 검사; 화면 ${screenshots}장, A4 ${pdfs}개, 렌더 ${renderedPdfPages}쪽\n${failures.join("\n")}\n`;
  fs.writeFileSync(path.join(outputDir, "audit-result.txt"), summary, "utf8");
  console.log(`결과 폴더: ${outputDir}`);
  console.log(summary);
  if (screenshots !== 132) fail(`화면 캡처 ${screenshots}장, 132장이어야 합니다.`);
  if (pdfs !== 22 || renderedPdfPages !== 22) fail(`A4 PDF/렌더 ${pdfs}/${renderedPdfPages}, 22/22이어야 합니다.`);
  if (failures.length) process.exitCode = 1;
})().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
