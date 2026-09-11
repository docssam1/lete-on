"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const questionBankDir = __dirname;
const repoRoot = path.resolve(questionBankDir, "..", "..");
const playwrightPath = process.env.HSE_PLAYWRIGHT_PATH || path.join(process.env.USERPROFILE || "", ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "node", "node_modules", "playwright");
const { chromium } = require(playwrightPath);
const { PNG } = require(path.join(path.dirname(playwrightPath), "pngjs"));
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(questionBankDir, "tmp", "source-6-2-fraction-division-e4-example4-browser-audit");
const sourceItemId = "6-2-u1-e4-example-4";
const difficultyNames = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const expected = new Map([
  ["8:7:2:5:21:5:7:2:10:1", { firstSpeed: "20:7", secondSpeed: "6:5", firstArrival: "7:2", secondArrival: "25:3", minutes: "290", answer: "지선이 4시간 50분 먼저" }],
  ["5:3:1:4:18:5:3:2:10:1", { firstSpeed: "20:3", secondSpeed: "12:5", firstArrival: "3:2", secondArrival: "25:6", minutes: "160", answer: "지선이 2시간 40분 먼저" }],
  ["15:8:1:2:4:1:3:2:12:1", { firstSpeed: "15:4", secondSpeed: "8:3", firstArrival: "16:5", secondArrival: "9:2", minutes: "78", answer: "지선이 1시간 18분 먼저" }]
]);
const failures = [];
let screenshots = 0;
let pdfs = 0;
let renderedPages = 0;
const fail = message => failures.push(message);

function safePath(urlPath) {
  const relative = decodeURIComponent(urlPath.split("?")[0]).replace(/^\/+/, "");
  const file = path.resolve(repoRoot, relative || "index.html");
  return file === repoRoot || file.startsWith(`${repoRoot}${path.sep}`) ? file : null;
}

async function startServer() {
  const server = http.createServer((request, response) => {
    let file = safePath(request.url || "/");
    if (file && fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    const type = ({ ".css": "text/css", ".html": "text/html", ".js": "application/javascript", ".json": "application/json", ".png": "image/png" })[path.extname(file)] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": `${type}; charset=utf-8`, "Cache-Control": "no-store" });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  return { server, baseUrl: `http://127.0.0.1:${server.address().port}/hselementary/question-bank/` };
}

function inkPixels(file) {
  const png = PNG.sync.read(fs.readFileSync(file));
  let count = 0;
  for (let y = 0; y < png.height; y += 1) for (let x = 0; x < png.width; x += 1) {
    const offset = (y * png.width + x) * 4;
    if (png.data[offset] < 190 || png.data[offset + 1] < 190 || png.data[offset + 2] < 190) count += 1;
  }
  return count;
}

function renderPdf(pdf, label) {
  const pages = Number(execFileSync("pdfinfo", [pdf], { encoding: "utf8" }).match(/^Pages:\s+(\d+)$/m)?.[1] || 0);
  const prefix = pdf.replace(/\.pdf$/, "-page");
  execFileSync("pdftoppm", ["-png", pdf, prefix], { stdio: "ignore" });
  const rendered = fs.readdirSync(outputDir).filter(name => name.startsWith(path.basename(prefix)) && name.endsWith(".png")).sort();
  if (!pages || rendered.length !== pages) fail(`${label}: A4 ${pages}쪽 중 ${rendered.length}쪽만 렌더했습니다.`);
  for (const name of rendered) {
    const file = path.join(outputDir, name);
    if (fs.statSync(file).size < 20000 || inkPixels(file) < 10000) fail(`${label}: ${name}가 비었거나 두 사람의 거리·시간 계산이 충분히 인쇄되지 않았습니다.`);
  }
  renderedPages += rendered.length;
}

async function inspect(page, difficulty, answerView, viewportLabel) {
  const state = await page.evaluate(answer => {
    const items = [...document.querySelectorAll(answer ? "#solutionView .solution-item" : "#problemView .question-item")];
    const visible = element => element && getComputedStyle(element).display !== "none" && element.getBoundingClientRect().width > 0 && element.getBoundingClientRect().height > 0;
    const outside = element => {
      const box = element?.getBoundingClientRect();
      return !box || box.left < -2 || box.right > document.documentElement.clientWidth + 2 || box.top < -2;
    };
    return {
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      answerLeak: answer ? 0 : document.querySelectorAll("#problemView [data-answer-source],#problemView .source62-travel-time-board.is-solved,#problemView .source62-travel-time-solution").length,
      items: items.map(item => {
        const board = item.querySelector(".source62-travel-time-board");
        const boardBox = board?.getBoundingClientRect();
        const expressions = [...item.querySelectorAll(".math-inline-expression")];
        const fractions = [...item.querySelectorAll(".math-fraction")];
        const evidence = item.querySelector("[data-source62-fraction-e4-example4-kind]");
        const text = (item.innerText || "").replace(/\s+/g, " ").trim();
        return {
          itemVisible: visible(item), itemOutside: outside(item), boardVisible: visible(board), boardOutside: outside(board),
          boardWidth: boardBox?.width || 0, boardOverflow: board ? board.scrollWidth > board.clientWidth + 1 : true,
          clippedRows: boardBox ? [...board.querySelectorAll(".source61-math-row")].filter(element => { const box = element.getBoundingClientRect(); return box.left < boardBox.left - 1 || box.right > boardBox.right + 1; }).length : 1,
          structure: board?.dataset.source62E4Example4Structure || "",
          values: board?.dataset.source62E4Example4Values || "",
          firstSpeed: board?.dataset.firstSpeed || "",
          secondSpeed: board?.dataset.secondSpeed || "",
          firstArrival: board?.dataset.firstArrival || "",
          secondArrival: board?.dataset.secondArrival || "",
          minutes: board?.dataset.answerMinutes || "",
          rowCount: item.querySelectorAll(".source61-math-row").length,
          solvedCount: item.querySelectorAll(".source62-travel-time-board.is-solved").length,
          solutionCount: item.querySelectorAll(".source62-travel-time-solution").length,
          fractionCount: fractions.length,
          thinBars: fractions.filter(fraction => { const top = fraction.firstElementChild; return !top || parseFloat(getComputedStyle(top).borderBottomWidth) < 1 || top.getBoundingClientRect().width < 8; }).length,
          expressionCount: expressions.length,
          brokenExpressions: expressions.filter(expression => getComputedStyle(expression).display !== "inline-flex" || getComputedStyle(expression).whiteSpace !== "nowrap" || expression.getClientRects().length !== 1).length,
          unitCount: item.querySelectorAll(".math-unit").length,
          source: evidence?.dataset.sourceItem || "",
          kind: evidence?.dataset.source62FractionE4Example4Kind || "",
          candidateCount: Number(evidence?.dataset.candidateCount || 0),
          difficulty: evidence?.dataset.difficultyDesign || "",
          answerSource: item.querySelector(".source62-e4-example4-answer")?.dataset.answerSource || "",
          font: board ? getComputedStyle(board).fontFamily : "",
          text,
          rawFraction: /\b\d+\s*\/\s*\d+\b/.test(text),
          invalid: /undefined|null|NaN|Infinity|SyntaxError/.test(text)
        };
      })
    };
  }, answerView);
  const label = `${viewportLabel}/${difficulty}/${answerView ? "답" : "문제"}`;
  if (state.overflow || state.items.length !== 3) fail(`${label}: 화면 넘침 또는 고정 문항 수 오류입니다.`);
  for (const [index, item] of state.items.entries()) {
    const expectedItem = expected.get(item.values);
    if (!item.itemVisible || item.itemOutside || !item.boardVisible || item.boardOutside || item.boardWidth < 280 || item.boardOverflow || item.clippedRows) fail(`${label}/${index + 1}: 두 사람의 거리·시간 계산판이 화면 밖이거나 잘렸습니다.`);
    if (item.structure !== "compare-constant-speeds" || !expectedItem || item.firstSpeed !== expectedItem?.firstSpeed || item.secondSpeed !== expectedItem?.secondSpeed || item.firstArrival !== expectedItem?.firstArrival || item.secondArrival !== expectedItem?.secondArrival || item.minutes !== expectedItem?.minutes) fail(`${label}/${index + 1}: 문제와 답의 두 사람 거리·시간 자료가 다릅니다.`);
    if (item.fractionCount < 5 || item.thinBars || item.expressionCount < 10 || item.brokenExpressions || item.unitCount < 10) fail(`${label}/${index + 1}: 세로 분수·단위 또는 줄바꿈되지 않는 수식 묶음이 빠졌습니다.`);
    if (!item.font.includes("Pretendard") || !item.font.includes("Malgun Gothic") || !item.font.includes("Arial")) fail(`${label}/${index + 1}: 계산판의 공통 글꼴이 아닙니다.`);
    if (item.source !== sourceItemId || item.kind !== "compare-constant-speeds" || item.candidateCount !== 1 || item.difficulty !== difficultyNames[String(difficulty)] || item.rawFraction || item.invalid) fail(`${label}/${index + 1}: 원문·단일 답·난이도 또는 분수 표시가 다릅니다.`);
    if (answerView) {
      if (item.solvedCount !== 1 || item.solutionCount !== 1 || item.rowCount !== 15 || item.answerSource !== sourceItemId || item.fractionCount < 20 || item.unitCount < 18 || !item.text.includes(expectedItem.answer)) fail(`${label}/${index + 1}: 답의 두 속력·두 도착 시간·시간 차·배수 계산이 없습니다.`);
    } else if (item.solvedCount || item.solutionCount || item.rowCount !== 5 || item.answerSource || state.answerLeak || item.text.includes(expectedItem.answer) || !item.text.includes("일정한 빠르기")) fail(`${label}/${index + 1}: 문제 조건이 빠졌거나 풀이·답이 노출되었습니다.`);
  }
  return state;
}

async function capture(page, difficulty, viewportLabel, view) {
  const file = path.join(outputDir, `${sourceItemId}-${difficulty}-${viewportLabel}-${view}.png`);
  await page.screenshot({ path: file, fullPage: true, timeout: 120000 });
  if (fs.statSync(file).size < 5000 || inkPixels(file) < 1200) fail(`${viewportLabel}/${difficulty}/${view}: 캡처가 비었습니다.`);
  screenshots += 1;
}

async function inspectType(browser, baseUrl, difficulty, viewport, viewportLabel) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  page.on("pageerror", error => fail(`${viewportLabel}/${difficulty}: ${error.message}`));
  await page.route("**/*", route => /fonts\.(googleapis|gstatic)\.com|cdn\.jsdelivr\.net/.test(route.request().url()) ? route.abort() : route.continue());
  try {
    await page.goto(`${baseUrl}?type=${sourceItemId}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible", timeout: 20000 });
    const problem = await inspect(page, difficulty, false, viewportLabel);
    await capture(page, difficulty, viewportLabel, "problem");
    await page.locator("#solutionTab").click();
    await page.locator("#solutionView:not([hidden])").waitFor({ state: "visible" });
    const answer = await inspect(page, difficulty, true, viewportLabel);
    await capture(page, difficulty, viewportLabel, "answer");
    for (let index = 0; index < 3; index += 1) if (problem.items[index]?.values !== answer.items[index]?.values || problem.items[index]?.minutes !== answer.items[index]?.minutes) fail(`${viewportLabel}/${difficulty}/${index + 1}: 문제와 답의 두 사람 자료가 다릅니다.`);
    if (difficulty === 0 && viewportLabel === "desktop") for (const [view, tab] of [["problem", "problemTab"], ["answer", "solutionTab"]]) {
      await page.locator(`#${tab}`).click();
      await page.emulateMedia({ media: "print" });
      const pdf = path.join(outputDir, `${sourceItemId}-${view}-a4.pdf`);
      await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
      renderPdf(pdf, view);
      pdfs += 1;
      await page.emulateMedia({ media: "screen" });
    }
  } catch (error) {
    fail(`${viewportLabel}/${difficulty}: 화면 검사 실패 (${error.message})`);
  } finally {
    await page.close();
  }
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const { server, baseUrl } = await startServer();
  let browser;
  try {
    browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || path.join(process.env.PROGRAMFILES || "C:/Program Files", "Google", "Chrome", "Application", "chrome.exe"), args: ["--disable-quic"] });
    for (const difficulty of [-1, 0, 1]) {
      await inspectType(browser, baseUrl, difficulty, { width: 1440, height: 900 }, "desktop");
      await inspectType(browser, baseUrl, difficulty, { width: 390, height: 844 }, "mobile");
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  if (screenshots !== 12) fail(`화면 캡처가 ${screenshots}장입니다.`);
  if (pdfs !== 2 || renderedPages < 2) fail(`A4 검사가 부족합니다: PDF ${pdfs}개, 그림 ${renderedPages}쪽.`);
  fs.writeFileSync(path.join(outputDir, "audit-result.txt"), `${failures.length ? "실패" : "통과"}: 예제 4-4 원문 두 사람 거리·시간·세로 분수·독립 계산·답 누출·넘침; 화면 ${screenshots}장, A4 ${pdfs}개 ${renderedPages}쪽\n${failures.join("\n")}\n`, "utf8");
  if (failures.length) throw new Error([...new Set(failures)].join("\n"));
  console.log(`6-2 예제 4-4 브라우저·인쇄 감사 통과: 화면 ${screenshots}장 · A4 ${pdfs}개 전 ${renderedPages}쪽`);
})().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
