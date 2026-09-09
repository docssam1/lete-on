"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const root = path.resolve(__dirname, "../..");
const outputDir = path.join(__dirname, "tmp", "decimal-division-e1-mission3-browser-audit");
const sourceItemId = "6-1-u3-e1-mission-3";
const failures = [];
let screenshots = 0;
let pdfs = 0;
const fail = message => failures.push(message);

function startServer() {
  const server = http.createServer((request, response) => {
    const requestPath = decodeURIComponent((request.url || "/").split("?")[0]);
    const relative = requestPath === "/" ? "/hselementary/question-bank/index.html" : requestPath;
    const filePath = path.resolve(root, `.${relative}`);
    if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      response.writeHead(404); response.end("not found"); return;
    }
    const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };
    response.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "application/octet-stream" });
    fs.createReadStream(filePath).pipe(response);
  });
  return new Promise(resolve => server.listen(0, "127.0.0.1", () => resolve({ server, baseUrl: `http://127.0.0.1:${server.address().port}` })));
}

function buildGenerator() {
  global.window = {};
  ["./source-inventory-grade6.js", "./curriculum.js", "./generators.js", "./source-grade6-decimal-e1-mission4.js", "./source-grade6-decimal-e1-mission3.js"].forEach(file => {
    delete require.cache[require.resolve(file)];
    require(file);
  });
  return window.HSE_GENERATORS;
}

function generatedForPool(api, difficulty, targetPool) {
  for (let seed = 610300; seed < 611300; seed += 1) {
    const generated = api.generate({ sourceItemId, generatorKey: "sourceGrade6DecimalDivisionE1Mission3", variant: 0 }, 0, difficulty, seed, 0);
    if (generated.verifiedPoolIndex === targetPool) return generated;
  }
  throw new Error(`고정 문항 ${targetPool}을 생성할 시드를 찾지 못했습니다.`);
}

async function inspect(page, generated, view, viewportName, difficulty, poolIndex) {
  const html = view === "problem"
    ? `<main class="question-pages"><section class="question-item"><div class="question-prompt">${generated.prompt}</div></section></main>`
    : `<main class="answer-pages"><section class="solution-item"><div class="solution-answer-visual">${generated.answerVisual}</div><div class="solution-explanation">${generated.solution}</div></section></main>`;
  await page.evaluate(content => { document.body.innerHTML = content; }, html);
  await page.waitForTimeout(80);
  const state = await page.evaluate(() => {
    const item = document.querySelector(".question-item,.solution-item");
    const svg = document.querySelector("svg.source61-e1m3-diagram");
    const rect = node => {
      const box = node?.getBoundingClientRect();
      return box ? { left: box.left, right: box.right, top: box.top, bottom: box.bottom, width: box.width, height: box.height } : null;
    };
    const textBoxes = svg ? [...svg.querySelectorAll("text")].map(node => {
      const box = node.getBBox();
      const style = getComputedStyle(node);
      return { text: node.textContent || "", x: box.x, y: box.y, right: box.x + box.width, bottom: box.y + box.height, width: box.width, height: box.height, font: style.fontFamily, size: parseFloat(style.fontSize) };
    }) : [];
    const overlaps = [];
    textBoxes.forEach((left, leftIndex) => textBoxes.slice(leftIndex + 1).forEach((right, offset) => {
      const width = Math.min(left.right, right.right) - Math.max(left.x, right.x);
      const height = Math.min(left.bottom, right.bottom) - Math.max(left.y, right.y);
      if (width > 1 && height > 1) overlaps.push(`${leftIndex}:${leftIndex + offset + 1}`);
    }));
    const svgBox = svg?.getBBox();
    const viewBox = svg?.viewBox?.baseVal;
    const strokeWidths = svg ? [...svg.querySelectorAll(".source61-e1m3-parallelogram,.source61-e1m3-square,.source61-e1m3-shared,.source61-e1m3-height,.source61-e1m3-right-angle")].map(node => parseFloat(getComputedStyle(node).strokeWidth)) : [];
    return {
      bodyText: document.body.innerText || "",
      viewportWidth: innerWidth,
      documentOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      itemOverflow: item ? item.scrollWidth > item.clientWidth + 2 : true,
      item: rect(item),
      svg: rect(svg),
      svgBox: svgBox ? { x: svgBox.x, y: svgBox.y, right: svgBox.x + svgBox.width, bottom: svgBox.y + svgBox.height, width: svgBox.width, height: svgBox.height } : null,
      viewBox: viewBox ? { width: viewBox.width, height: viewBox.height } : null,
      textBoxes,
      overlaps,
      strokeWidths,
      points: svg?.dataset.source61E1m3Points || "",
      segments: svg?.dataset.source61E1m3Segments || "",
      shared: svg?.dataset.sharedSegment || "",
      phase: svg?.dataset.source61E1m3Phase || "",
      pool: svg?.dataset.pool || "",
      polygons: svg?.querySelectorAll("polygon").length || 0,
      rightAngles: svg?.querySelectorAll(".source61-e1m3-right-angle").length || 0,
      heightLines: svg?.querySelectorAll(".source61-e1m3-height").length || 0,
      blanks: svg?.querySelectorAll(".source61-e1m3-blank").length || 0,
      solvedTargets: svg?.querySelectorAll(".source61-e1m3-target.is-solved").length || 0,
      results: svg?.querySelectorAll(".source61-e1m3-result").length || 0,
      answerSource: document.querySelector("[data-answer-source]")?.dataset.answerSource || ""
    };
  });
  const label = `${viewportName} / 난이도 ${difficulty} / 문항 ${poolIndex} / ${view}`;
  if (state.documentOverflow || state.itemOverflow || !state.item || state.item.left < -2 || state.item.right > state.viewportWidth + 2) fail(`${label}: 화면 가로 넘침`);
  const renderedContent = state.svg && state.svgBox && state.viewBox
    ? { width: state.svgBox.width * state.svg.width / state.viewBox.width, height: state.svgBox.height * state.svg.height / state.viewBox.height }
    : null;
  const minimumContent = viewportName === "mobile" ? { width: 250, height: 95 } : { width: 380, height: 145 };
  if (!state.svg || state.svg.width < 300 || state.svg.height < 160 || !renderedContent || renderedContent.width < minimumContent.width || renderedContent.height < minimumContent.height) fail(`${label}: 도형이 너무 작거나 보이지 않습니다. 화면 ${Math.round(state.svg?.width || 0)}×${Math.round(state.svg?.height || 0)}, 실제 내용 ${Math.round(renderedContent?.width || 0)}×${Math.round(renderedContent?.height || 0)}`);
  if (state.svgBox && (state.svgBox.x < -1 || state.svgBox.y < -1 || state.svgBox.right > 521 || state.svgBox.bottom > 291)) fail(`${label}: 도형이나 글자가 viewBox 밖으로 잘립니다.`);
  if (state.polygons !== 2 || state.rightAngles !== 5 || state.heightLines !== 1 || state.shared !== "B-C" || !state.points || state.segments !== "A-B;B-C;C-D;D-A;B-E;E-F;F-C;A-H") fail(`${label}: 공유변·직각·높이·점선분 구조가 다릅니다.`);
  if (state.strokeWidths.some(width => !Number.isFinite(width) || width < 1.5)) fail(`${label}: 외곽선·점선·직각 표시가 너무 얇습니다.`);
  if (state.textBoxes.some(box => !box.text.trim() || box.width <= 0 || box.height <= 0 || box.size < 15 || !box.font.includes("Malgun Gothic"))) fail(`${label}: 길이 글자나 단위의 크기·공통 글꼴이 다릅니다. 최소 ${Math.min(...state.textBoxes.map(box => box.size))}px, 글꼴 ${state.textBoxes[0]?.font || "없음"}`);
  if (state.overlaps.length) fail(`${label}: 도형 글자끼리 겹칩니다(${state.overlaps.join(",")}).`);
  if (/undefined|null|NaN|Infinity|\b\d+\s*\/\s*\d+\b/.test(state.bodyText)) fail(`${label}: 깨진 값 또는 슬래시 분수가 보입니다.`);
  if (view === "problem") {
    if (state.phase !== "problem" || state.pool !== String(poolIndex) || state.blanks !== 1 || state.solvedTargets || state.results || state.answerSource) fail(`${label}: 문제에 답이 노출되거나 높이 빈칸이 없습니다.`);
  } else if (state.phase !== "answer" || state.pool !== String(poolIndex) || state.blanks || state.solvedTargets !== 1 || state.results !== 1 || state.answerSource !== sourceItemId) {
    fail(`${label}: 답 도형의 높이·결과·출처 연결이 다릅니다.`);
  }
  return state;
}

async function capture(page, filename, label) {
  await page.screenshot({ path: filename, fullPage: true, timeout: 120000 });
  if (!fs.existsSync(filename) || fs.statSync(filename).size < 3000) fail(`${label}: 화면 캡처가 비었습니다.`);
  screenshots += 1;
}

async function capturePdf(page, filename, label) {
  await page.emulateMedia({ media: "print" });
  await page.pdf({ path: filename, format: "A4", printBackground: true, preferCSSPageSize: true });
  if (!fs.existsSync(filename) || fs.statSync(filename).size < 3000) fail(`${label}: A4 PDF가 비었습니다.`);
  pdfs += 1;
  await page.emulateMedia({ media: "screen" });
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const api = buildGenerator();
  const { server, baseUrl } = await startServer();
  let browser;
  try {
    browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--disable-quic"] });
    for (let poolIndex = 0; poolIndex < 3; poolIndex += 1) {
      for (const difficulty of [-1, 0, 1]) {
        const generated = generatedForPool(api, difficulty, poolIndex);
        for (const [viewportName, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
          const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
          await page.goto(`${baseUrl}/hselementary/question-bank/index.html`, { waitUntil: "domcontentloaded" });
          let problemState;
          for (const view of ["problem", "answer"]) {
            const state = await inspect(page, generated, view, viewportName, difficulty, poolIndex);
            if (view === "problem") problemState = state;
            else if (state.points !== problemState.points || state.segments !== problemState.segments) fail(`${viewportName} / 난이도 ${difficulty} / 문항 ${poolIndex}: 문제와 답의 점·선분이 다릅니다.`);
            await capture(page, path.join(outputDir, `pool-${poolIndex}-${difficulty}-${viewportName}-${view}.png`), `${poolIndex}/${difficulty}/${viewportName}/${view}`);
          }
          if (difficulty === 0 && viewportName === "desktop") {
            for (const view of ["problem", "answer"]) {
              await inspect(page, generated, view, viewportName, difficulty, poolIndex);
              await capturePdf(page, path.join(outputDir, `pool-${poolIndex}-${view}-a4.pdf`), `${poolIndex}/${view}/A4`);
            }
          }
          await page.close();
        }
      }
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  if (screenshots !== 36) fail(`화면 캡처가 ${screenshots}장입니다. 36장이어야 합니다.`);
  if (pdfs !== 6) fail(`A4 PDF가 ${pdfs}개입니다. 6개여야 합니다.`);
  const summary = `${failures.length ? "실패" : "통과"}: Mission 3 3문항×3난이도×PC/모바일 문제·답; 공유변·직각·높이·글자 위치·선 굵기·가로 넘침·A4 검사; 화면 ${screenshots}장, A4 ${pdfs}개\n${failures.join("\n")}\n`;
  fs.writeFileSync(path.join(outputDir, "audit-result.txt"), summary, "utf8");
  console.log(summary);
  if (failures.length) process.exitCode = 1;
})().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
