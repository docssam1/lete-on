"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const root = path.resolve(__dirname, "../..");
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(require("node:os").tmpdir(), "source-6-1-decimal-division-e2-browser-audit");
const sourceIds = [
  "6-1-u3-e2-exploration-1", "6-1-u3-e2-example-1", "6-1-u3-e2-example-3", "6-1-u3-e2-mission-1",
  "6-1-u3-e2-mission-2", "6-1-u3-e2-mission-3", "6-1-u3-e2-mission-4", "6-1-u3-e2-mission-5"
];
const lockedIds = ["6-1-u3-e2-example-2", "6-1-u3-e2-example-4", "6-1-u3-e2-mission-6"];
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
  require("./generators.js");
  return window.HSE_GENERATORS;
}

function svgMarkup(markup) {
  return String(markup).match(/<svg class="[^"]*source61-decimal-e2-diagram[\s\S]*?<\/svg>/)?.[0] || "";
}

async function inspect(page, generated, sourceId, difficulty, view, viewportName) {
  const content = view === "problem"
    ? `<main class="question-pages"><section class="question-item"><div class="question-prompt">${generated.prompt}</div></section></main>`
    : `<main class="answer-pages"><section class="solution-item"><div class="solution-answer-visual">${generated.answerVisual}</div><div class="solution-explanation">${generated.solution}</div></section></main>`;
  await page.evaluate(html => { document.body.innerHTML = html; }, content);
  await page.waitForTimeout(40);
  const state = await page.evaluate(() => {
    const item = document.querySelector(".question-item,.solution-item");
    const svgs = [...document.querySelectorAll("svg.source61-decimal-e2-diagram")];
    const overlaps = [];
    svgs.forEach((svg, svgIndex) => {
      const texts = [...svg.querySelectorAll("text")].map(node => ({ node, box: node.getBoundingClientRect() }));
      texts.forEach((left, leftIndex) => texts.slice(leftIndex + 1).forEach((right, offset) => {
        const overlap = left.box.left < right.box.right - 1 && left.box.right > right.box.left + 1 && left.box.top < right.box.bottom - 1 && left.box.bottom > right.box.top + 1;
        if (overlap) overlaps.push(`${svgIndex}:${leftIndex}:${leftIndex + offset + 1}`);
      }));
    });
    const boxes = svgs.map(svg => ({
      rect: (() => { const box = svg.getBoundingClientRect(); return { x: box.x, y: box.y, width: box.width, height: box.height }; })(),
      bbox: (() => { try { const box = svg.getBBox(); return { x: box.x, y: box.y, width: box.width, height: box.height }; } catch (_) { return { width: 0, height: 0 }; } })(),
      font: getComputedStyle(svg.querySelector("text") || svg).fontFamily,
      structure: svg.dataset.source61E2Structure || "",
      values: svg.dataset.source61E2Values || ""
    }));
    const itemBox = item?.getBoundingClientRect();
    return {
      bodyText: document.body.innerText || "",
      item: item ? { x: itemBox.x, right: itemBox.right, width: itemBox.width, height: itemBox.height, scrollWidth: item.scrollWidth, clientWidth: item.clientWidth } : null,
      pageOverflow: document.documentElement.scrollWidth > innerWidth + 2,
      svgs: boxes,
      overlaps,
      problemLeak: document.querySelectorAll(".source61-decimal-e2-answer,[data-answer-source],[data-result-highlight]").length,
      answer: document.querySelector(".source61-decimal-e2-answer")?.dataset || null,
      resultCount: document.querySelectorAll("svg.source61-decimal-e2-diagram[data-result-highlight]").length
    };
  });
  const label = `${sourceId} / ${viewportName} / 난이도 ${difficulty} / ${view}`;
  if (!state.item || state.pageOverflow || state.item.scrollWidth > state.item.clientWidth + 2 || state.item.x < -2 || state.item.right > (await page.evaluate(() => innerWidth)) + 2) fail(`${label}: 가로 넘침 또는 화면 밖 문항`);
  if (state.svgs.length !== 1 || state.svgs.some(svg => svg.rect.width <= 0 || svg.rect.height <= 0 || svg.bbox.width <= 0 || svg.bbox.height <= 0 || !svg.structure || !svg.values)) fail(`${label}: 빈 그림 또는 SVG 자료가 있습니다.`);
  if (state.overlaps.length) fail(`${label}: SVG 글자 겹침 ${state.overlaps.join(",")}`);
  if (/undefined|null|NaN|Infinity|순열|조합|일차식|절댓값|\$\{[^}]+\}/.test(state.bodyText)) fail(`${label}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
  if (view === "problem") {
    if (!state.item || state.problemLeak) fail(`${label}: 문제 화면에 답 전용 정보가 노출됩니다.`);
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
  try {
    const pngBase = path.join(outputDir, filename.replace(/\.pdf$/, "-page"));
    execFileSync("pdftoppm", ["-f", "1", "-l", "1", "-png", "-singlefile", pdf, pngBase], { stdio: "ignore" });
    const png = `${pngBase}.png`;
    if (!fs.existsSync(png) || fs.statSync(png).size < 5000) fail(`${label}: A4 렌더 페이지가 비었습니다.`);
    else renderedPdfPages += 1;
  } catch (error) {
    fail(`${label}: A4 렌더 실패 (${error.message})`);
  }
  await page.emulateMedia({ media: "screen" });
}

async function inspectAppRouting(browser, baseUrl, sourceId, shouldOpen) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  try {
    await page.goto(`${baseUrl}/hselementary/question-bank/index.html?type=${encodeURIComponent(sourceId)}&review=1&difficulty=0`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.waitForTimeout(120);
    const state = await page.evaluate(() => ({
      worksheetHidden: document.querySelector("#worksheet")?.hidden !== false,
      problemCount: document.querySelectorAll("#problemView .question-item").length,
      e2DiagramCount: document.querySelectorAll("#problemView svg.source61-decimal-e2-diagram").length,
      enabled: [...document.querySelectorAll(".tree-type input")].some(input => !input.disabled)
    }));
    if (shouldOpen && (state.worksheetHidden || state.problemCount !== 3 || state.e2DiagramCount !== 3)) fail(`${sourceId}: 실제 앱 URL 라우팅 후 3문항·E2 그림이 열리지 않습니다.`);
    if (!shouldOpen && !state.worksheetHidden) fail(`${sourceId}: 잠금 유형이 실제 앱에서 열렸습니다.`);
  } catch (error) {
    fail(`${sourceId}: 실제 앱 라우팅 검사 실패 (${error.message})`);
  } finally {
    await page.close();
  }
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const api = buildGenerator();
  const { server, baseUrl } = await startServer();
  let browser;
  try {
    browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--disable-quic"] });
    for (const sourceId of sourceIds) await inspectAppRouting(browser, baseUrl, sourceId, true);
    for (const sourceId of lockedIds) await inspectAppRouting(browser, baseUrl, sourceId, false);
    for (let variant = 0; variant < sourceIds.length; variant += 1) {
      for (const difficulty of [-1, 0, 1]) {
        const generated = api.generate({ sourceItemId: sourceIds[variant], reviewLocked: false }, 0, difficulty, 610320 + variant * 100000 + (difficulty + 1) * 1000 + 17, variant);
        for (const [viewportName, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
          const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
          await page.goto(`${baseUrl}/hselementary/question-bank/index.html`, { waitUntil: "domcontentloaded" });
          const problem = await inspect(page, generated, sourceIds[variant], difficulty, "problem", viewportName);
          await capture(page, `${sourceIds[variant]}-${difficulty}-${viewportName}-problem.png`, `${sourceIds[variant]} problem`);
          await inspect(page, generated, sourceIds[variant], difficulty, "answer", viewportName);
          await capture(page, `${sourceIds[variant]}-${difficulty}-${viewportName}-answer.png`, `${sourceIds[variant]} answer`);
          const answerSvg = svgMarkup(generated.answerVisual);
          if (problem.svgs[0]?.values !== answerSvg.match(/data-source61-e2-values="([^"]*)"/)?.[1]) fail(`${sourceIds[variant]} / ${viewportName} / 난이도 ${difficulty}: 문제·답 SVG 자료가 다릅니다.`);
          if (viewportName === "desktop" && difficulty === 0) {
            await inspect(page, generated, sourceIds[variant], difficulty, "problem", viewportName);
            await captureA4(page, `${sourceIds[variant]}-problem-a4.pdf`, `${sourceIds[variant]} problem`);
            await inspect(page, generated, sourceIds[variant], difficulty, "answer", viewportName);
            await captureA4(page, `${sourceIds[variant]}-answer-a4.pdf`, `${sourceIds[variant]} answer`);
          }
          await page.close();
        }
      }
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  if (screenshots !== 96) fail(`화면 캡처 ${screenshots}장, 96장이어야 합니다.`);
  if (pdfs !== 16 || renderedPdfPages !== 16) fail(`A4 PDF/렌더 ${pdfs}/${renderedPdfPages}, 16/16이어야 합니다.`);
  const summary = `${failures.length ? "실패" : "통과"}: E2 8유형×3난이도×PC1440/mobile390 문제·답, SVG 동일 자료·답 강조·글꼴·글자 겹침·가로 넘침 검사; 화면 ${screenshots}장, A4 ${pdfs}개, 렌더 ${renderedPdfPages}쪽\n${failures.join("\n")}\n`;
  fs.writeFileSync(path.join(outputDir, "audit-result.txt"), summary, "utf8");
  console.log(`결과 폴더: ${outputDir}`);
  console.log(summary);
  if (failures.length) process.exitCode = 1;
})().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
