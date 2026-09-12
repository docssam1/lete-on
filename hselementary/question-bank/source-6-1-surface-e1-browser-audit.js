"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const root = path.resolve(__dirname, "../..");
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(require("node:os").tmpdir(), "source-6-1-surface-e1-browser-audit");
const ids = ["exploration", "example-1", "example-2", "example-3", "example-4", "mission-1", "mission-2", "mission-3", "mission-6"].map(kind => `6-1-u6-e1-${kind}`);
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

async function capture(page, filename, label) {
  const target = path.join(outputDir, filename);
  await page.screenshot({ path: target, fullPage: true, timeout: 120000 });
  if (!fs.existsSync(target) || fs.statSync(target).size < 2000) fail(`${label}: 화면 캡처가 비었습니다.`);
  screenshots += 1;
}

async function captureA4(page, filename, label) {
  await page.emulateMedia({ media: "print" });
  const target = path.join(outputDir, filename);
  await page.pdf({ path: target, format: "A4", printBackground: true, preferCSSPageSize: true });
  if (!fs.existsSync(target) || fs.statSync(target).size < 3000) fail(`${label}: A4 PDF가 비었습니다.`);
  pdfs += 1;
  try {
    const pngBase = path.join(outputDir, filename.replace(/\.pdf$/, "-page"));
    execFileSync("pdftoppm", ["-f", "1", "-l", "1", "-png", "-singlefile", target, pngBase], { stdio: "ignore" });
    if (!fs.existsSync(`${pngBase}.png`) || fs.statSync(`${pngBase}.png`).size < 5000) fail(`${label}: A4 렌더 페이지가 비었습니다.`);
    else renderedPdfPages += 1;
  } catch (error) {
    fail(`${label}: A4 렌더 실패 (${error.message})`);
  }
  await page.emulateMedia({ media: "screen" });
}

async function inspectView(page, selector, sourceId, difficulty, viewportName, mode) {
  const state = await page.evaluate(viewSelector => {
    const root = document.querySelector(viewSelector);
    const items = [...(root?.querySelectorAll(".question-item,.solution-item") || [])];
    const diagrams = [...(root?.querySelectorAll("svg.source61-surface-e1-diagram") || [])];
    const itemStates = items.map(item => {
      const rect = item.getBoundingClientRect();
      const itemDiagrams = [...item.querySelectorAll("svg.source61-surface-e1-diagram")];
      return {
        rect: { left: rect.left, right: rect.right, width: rect.width, height: rect.height },
        overflow: item.scrollWidth > item.clientWidth + 2,
        diagrams: itemDiagrams.map(svg => ({
          model: svg.dataset.model || "",
          removed: svg.dataset.removed || "",
          grid: svg.querySelectorAll(".source61-surface-e1-grid-line").length,
          bbox: (() => { const box = svg.getBoundingClientRect(); return { left: box.left, right: box.right, width: box.width, height: box.height }; })(),
          geometry: (() => {
            const box = svg.getBBox();
            const view = svg.viewBox.baseVal;
            return {
              x: box.x, y: box.y, right: box.x + box.width, bottom: box.y + box.height,
              width: box.width, height: box.height,
              viewX: view.x, viewY: view.y, viewRight: view.x + view.width, viewBottom: view.y + view.height,
              viewWidth: view.width, viewHeight: view.height
            };
          })(),
          holes: svg.querySelectorAll(".source61-surface-e1-hole").length,
          faces: {
            top: svg.querySelectorAll('[data-visual-element="top-face"],.source61-surface-e1-tunnel-face.top').length,
            front: svg.querySelectorAll('[data-visual-element="front-face"],.source61-surface-e1-tunnel-face.front').length,
            side: svg.querySelectorAll('[data-visual-element="side-face"],.source61-surface-e1-tunnel-face.side').length
          },
          layerMaps: svg.classList.contains("source61-surface-e1-layer-map") ? 1 : 0,
          fraction: svg.querySelectorAll(".source61-surface-e1-fraction-result").length,
          slashText: [...svg.querySelectorAll("text")].some(node => node.textContent.includes("/"))
        }))
      };
    });
    return {
      text: root?.innerText || "",
      itemStates,
      diagramCount: diagrams.length,
      problemAnswerMarker: root?.querySelectorAll(".source61-surface-e1-result").length || 0,
      hiddenAnswerData: root?.querySelectorAll("[data-surface-answer]").length || 0,
      arrangementLabels: root?.querySelectorAll(".source61-surface-e1-comparison strong,.source61-surface-e1-label").length || 0,
      pageOverflow: document.documentElement.scrollWidth > innerWidth + 2,
      ready: Boolean(root && !root.hidden)
    };
  }, selector);
  const label = `${sourceId} / ${viewportName} / 난이도 ${difficulty} / ${mode}`;
  if (!state.ready || state.itemStates.length !== 3) fail(`${label}: 3문항 화면이 열리지 않았습니다.`);
  if (state.pageOverflow || state.itemStates.some(item => item.overflow || item.rect.left < -2 || item.rect.right > (viewportName === "mobile" ? 390 : 1440) + 2)) fail(`${label}: 문항 가로 넘침 또는 화면 밖 배치`);
  if (!state.diagramCount || state.itemStates.some(item => !item.diagrams.length || item.diagrams.some(svg => svg.bbox.width <= 0 || svg.bbox.height <= 0 || svg.bbox.left < -2 || svg.bbox.right > (viewportName === "mobile" ? 390 : 1440) + 2))) fail(`${label}: 빈 그림 또는 잘린 그림`);
  if (state.itemStates.some(item => item.diagrams.some(svg => svg.geometry.x < svg.geometry.viewX - 1 || svg.geometry.y < svg.geometry.viewY - 1 || svg.geometry.right > svg.geometry.viewRight + 1 || svg.geometry.bottom > svg.geometry.viewBottom + 1))) fail(`${label}: SVG 내부 도형이 viewBox 밖으로 잘렸습니다.`);
  if (state.itemStates.some(item => item.diagrams.some(svg => svg.geometry.width < svg.geometry.viewWidth * 0.28 || svg.geometry.height < svg.geometry.viewHeight * 0.2))) fail(`${label}: 문제 그림이 너무 작아 구조를 읽기 어렵습니다.`);
  if (/undefined|null|NaN|Infinity|\$\{[^}]+\}/.test(state.text)) fail(`${label}: 깨진 값이 있습니다.`);
  if (state.hiddenAnswerData) fail(`${label}: 그림 속 숨은 답 데이터가 있습니다.`);
  if (state.itemStates.some(item => item.diagrams.some(svg => svg.model !== "three-layer-map" && (!svg.faces.top || !svg.faces.front || !svg.faces.side)))) fail(`${label}: 입체의 윗면·앞면·오른쪽 면 중 보이지 않는 면이 있습니다.`);
  if (mode === "problem") {
    if (state.problemAnswerMarker || state.text.includes("답:")) fail(`${label}: 문제에 답 표시가 노출되었습니다.`);
    if ((sourceId.endsWith("example-1") || sourceId.endsWith("mission-1")) && state.arrangementLabels) fail(`${label}: 가장 큰·작은 경우의 답 그림이 문제에 노출되었습니다.`);
  } else if (state.itemStates.some(item => item.diagrams.some(svg => svg.fraction && svg.slashText))) fail(`${label}: SVG 분수가 slash 문자열로 표시됩니다.`);
  if ((sourceId.endsWith("example-3") || sourceId.endsWith("mission-3")) && state.itemStates.some(item => item.diagrams.some(svg => svg.model !== "continuous-centered-three-tunnels" || svg.holes !== 3))) fail(`${label}: 세 방향의 가운데 구멍이 모두 보이지 않습니다.`);
  if (sourceId.endsWith("exploration") && mode === "답" && state.itemStates.some(item => !item.diagrams.some(svg => svg.layerMaps === 1))) fail(`${label}: 남은 쌓기나무의 층별 위치 그림이 없습니다.`);
  return state;
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const { server, baseUrl } = await startServer();
  let browser;
  try {
    browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--disable-quic"] });
    for (const sourceId of ids) for (const difficulty of [-1, 0, 1]) {
      for (const [viewportName, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
        const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
        await page.goto(`${baseUrl}/hselementary/question-bank/index.html?type=${encodeURIComponent(sourceId)}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded", timeout: 90000 });
        await page.locator("#problemView").waitFor({ state: "visible", timeout: 90000 });
        const problem = await inspectView(page, "#problemView", sourceId, difficulty, viewportName, "문제");
        await capture(page, `${sourceId}-${difficulty}-${viewportName}-problem.png`, `${sourceId} 문제`);
        await page.click("#solutionTab");
        await page.locator("#solutionView").waitFor({ state: "visible", timeout: 90000 });
        const answer = await inspectView(page, "#solutionView", sourceId, difficulty, viewportName, "답");
        await capture(page, `${sourceId}-${difficulty}-${viewportName}-answer.png`, `${sourceId} 답`);
        if (!sourceId.endsWith("exploration") && !sourceId.endsWith("example-1") && !sourceId.endsWith("mission-1")) {
          const problemModels = problem.itemStates.flatMap(item => item.diagrams.map(svg => `${svg.model}|${svg.removed}`)).sort();
          const answerModels = answer.itemStates.flatMap(item => item.diagrams.map(svg => `${svg.model}|${svg.removed}`)).sort();
          if (problemModels.join("\n") !== answerModels.join("\n")) fail(`${sourceId} / ${viewportName} / 난이도 ${difficulty}: 문제·답 그림의 좌표 모델이 다릅니다.`);
        }
        if (viewportName === "desktop") {
          await page.click("#problemTab");
          await page.locator("#problemView").waitFor({ state: "visible" });
          await captureA4(page, `${sourceId}-${difficulty}-problem-a4.pdf`, `${sourceId} 문제`);
          await page.click("#solutionTab");
          await page.locator("#solutionView").waitFor({ state: "visible" });
          await captureA4(page, `${sourceId}-${difficulty}-answer-a4.pdf`, `${sourceId} 답`);
        }
        await page.close();
      }
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  if (screenshots !== 108) fail(`화면 캡처 ${screenshots}장, 108장이어야 합니다.`);
  if (pdfs !== 54 || renderedPdfPages !== 54) fail(`A4 PDF/렌더 ${pdfs}/${renderedPdfPages}, 54/54이어야 합니다.`);
  const summary = `${failures.length ? "실패" : "통과"}: 6-1 겉넓이 E1 공개 후보 9유형×3난이도×PC1440/mobile390 문제·답, 문제/답 도형 모델·SVG 내부 잘림·답 누출·분할선·가로 넘침 검사; 화면 ${screenshots}장, A4 ${pdfs}개, 렌더 ${renderedPdfPages}쪽\n${failures.join("\n")}\n`;
  fs.writeFileSync(path.join(outputDir, "audit-result.txt"), summary, "utf8");
  console.log(`결과 폴더: ${outputDir}`);
  console.log(summary);
  if (failures.length) process.exitCode = 1;
})().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
