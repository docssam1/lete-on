"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const root = path.resolve(__dirname, "../..");
const outputDir = path.join(__dirname, "tmp", "decimal-division-e1-mission4-browser-audit");
const sourceItemId = "6-1-u3-e1-mission-4";
const failures = [];
let screenshots = 0;
let pdfs = 0;

const fail = message => failures.push(message);
const startServer = () => {
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
};

const buildGenerator = () => {
  global.window = {};
  ["./source-inventory-grade6.js", "./curriculum.js", "./generators.js", "./source-grade6-decimal-e1-mission4.js"].forEach(file => {
    delete require.cache[require.resolve(file)];
    require(file);
  });
  return window.HSE_GENERATORS;
};

const generatedForPool = (api, difficulty, targetPool) => {
  for (let seed = 610300; seed < 611300; seed += 1) {
    const generated = api.generate({ sourceItemId, generatorKey: "sourceGrade6DecimalDivisionE1Mission4", variant: 0 }, 0, difficulty, seed, 0);
    if (generated.verifiedPoolIndex === targetPool) return generated;
  }
  throw new Error(`고정 문항 ${targetPool}을 생성할 시드를 찾지 못했습니다.`);
};

async function inspect(page, generated, view, viewportName, difficulty, poolIndex) {
  const html = view === "problem"
    ? `<main class="question-pages"><section class="question-item"><div class="question-prompt">${generated.prompt}</div></section></main>`
    : `<main class="answer-pages"><section class="solution-item"><div class="solution-answer-visual">${generated.answerVisual}</div><div class="solution-explanation">${generated.solution}</div></section></main>`;
  await page.evaluate(content => { document.body.innerHTML = content; }, html);
  await page.waitForTimeout(80);
  const state = await page.evaluate(() => {
    const item = document.querySelector(".question-item,.solution-item");
    const board = document.querySelector(".source61-long-division");
    const grid = document.querySelector(".source61-division-grid");
    const bracket = document.querySelector(".source61-division-bracket");
    const cells = [...document.querySelectorAll(".source61-division-cell")];
    const lines = [...document.querySelectorAll(".source61-division-line")];
    const rect = node => {
      const box = node?.getBoundingClientRect();
      return box ? { left: box.left, right: box.right, top: box.top, bottom: box.bottom, width: box.width, height: box.height } : null;
    };
    const cellRects = cells.map(cell => ({ box: rect(cell), text: cell.textContent || "", font: getComputedStyle(cell).fontFamily, size: parseFloat(getComputedStyle(cell).fontSize) }));
    const overlaps = [];
    cellRects.forEach((left, leftIndex) => cellRects.slice(leftIndex + 1).forEach((right, offset) => {
      const intersectionWidth = Math.min(left.box.right, right.box.right) - Math.max(left.box.left, right.box.left);
      const intersectionHeight = Math.min(left.box.bottom, right.box.bottom) - Math.max(left.box.top, right.box.top);
      if (intersectionWidth > 1 && intersectionHeight > 1) overlaps.push(`${leftIndex}:${leftIndex + offset + 1}`);
    }));
    const bracketStyle = bracket ? getComputedStyle(bracket) : null;
    return {
      bodyText: document.body.innerText || "",
      viewportWidth: innerWidth,
      documentOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      itemOverflow: item ? item.scrollWidth > item.clientWidth + 2 : true,
      item: rect(item),
      board: rect(board),
      grid: rect(grid),
      cells: cellRects,
      overlaps,
      lineCount: lines.length,
      visibleLines: lines.filter(line => parseFloat(getComputedStyle(line).borderBottomWidth) >= 1).length,
      bracketVisible: Boolean(bracketStyle && parseFloat(bracketStyle.borderTopWidth) >= 1 && parseFloat(bracketStyle.borderLeftWidth) >= 1),
      symbolCount: document.querySelectorAll(".source61-division-cell.is-symbol").length,
      solvedCount: document.querySelectorAll(".source61-long-division.is-solved").length,
      resultCount: document.querySelectorAll(".source61-division-result").length,
      phase: board?.dataset.source61DivisionPhase || "",
      pool: board?.dataset.pool || "",
      answerSource: document.querySelector("[data-answer-source]")?.dataset.answerSource || ""
    };
  });
  const label = `${viewportName} / 난이도 ${difficulty} / 문항 ${poolIndex} / ${view}`;
  if (state.documentOverflow || state.itemOverflow || !state.item || state.item.left < -2 || state.item.right > state.viewportWidth + 2) fail(`${label}: 화면 가로 넘침`);
  if (!state.board || state.board.width < 220 || state.board.height < 250 || !state.grid || state.grid.width < 200 || state.grid.height < 220) fail(`${label}: 세로셈 판이 너무 작거나 보이지 않습니다.`);
  if (state.cells.length !== 20 || state.cells.some(cell => !cell.text.trim() || cell.box.width < 8 || cell.box.height < 14 || cell.size < 18 || !cell.font.includes("Malgun Gothic"))) {
    const widths = state.cells.map(cell => Math.round(cell.box.width));
    const heights = state.cells.map(cell => Math.round(cell.box.height));
    fail(`${label}: 숫자·기호 칸의 크기 또는 공통 글꼴이 다릅니다. 칸 ${state.cells.length}, 최소 ${Math.min(...widths)}×${Math.min(...heights)}, 글자 ${Math.min(...state.cells.map(cell => cell.size))}px, 글꼴 ${state.cells[0]?.font || "없음"}`);
  }
  if (state.overlaps.length) fail(`${label}: 숫자·기호 칸 겹침 ${state.overlaps.join(",")}`);
  if (state.lineCount !== 3 || state.visibleLines !== 3 || !state.bracketVisible) fail(`${label}: 나눗셈 괄호 또는 빼기선이 분명하지 않습니다.`);
  if (/undefined|null|NaN|Infinity/.test(state.bodyText)) fail(`${label}: 깨진 값이 표시됩니다.`);
  if (view === "problem") {
    if (state.phase !== "problem" || state.pool !== String(poolIndex) || state.symbolCount !== 13 || state.solvedCount || state.resultCount || state.answerSource) fail(`${label}: 문제·답 분리 또는 기호 자리 수가 다릅니다.`);
  } else if (state.phase !== "answer" || state.pool !== String(poolIndex) || state.symbolCount || state.solvedCount !== 1 || state.resultCount !== 1 || state.answerSource !== sourceItemId) {
    fail(`${label}: 답 세로셈의 숫자·결과·출처 연결이 다릅니다.`);
  }
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
          for (const view of ["problem", "answer"]) {
            await inspect(page, generated, view, viewportName, difficulty, poolIndex);
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
  const summary = `${failures.length ? "실패" : "통과"}: Mission 4 3문항×3난이도×PC/모바일 문제·답; 숫자 칸·소수점·나눗셈 괄호·빼기선·가로 넘침·A4 검사; 화면 ${screenshots}장, A4 ${pdfs}개\n${failures.join("\n")}\n`;
  fs.writeFileSync(path.join(outputDir, "audit-result.txt"), summary, "utf8");
  console.log(summary);
  if (failures.length) process.exitCode = 1;
})().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
