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
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(questionBankDir, "tmp", "source-6-2-fraction-division-e4-mission4-browser-audit");
const sourceItemId = "6-2-u1-e4-mission-4";
const difficultyNames = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const expected = new Map([
  ["9:10:9:5:2:3:12:5", { firstRate: "1:2", secondRate: "5:18", firstTotal: "2:1", secondTotal: "18:5", minutes: 96, answer: "1시간 36분" }],
  ["3:4:3:2:5:8:5:2", { firstRate: "1:2", secondRate: "1:4", firstTotal: "2:1", secondTotal: "4:1", minutes: 120, answer: "2시간" }],
  ["7:8:7:3:5:6:10:3", { firstRate: "3:8", secondRate: "1:4", firstTotal: "8:3", secondTotal: "4:1", minutes: 80, answer: "1시간 20분" }]
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
    if (fs.statSync(file).size < 15000 || inkPixels(file) < 5000) fail(`${label}: ${name}가 비었거나 산 높이 비와 시간 계산이 충분히 인쇄되지 않았습니다.`);
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
      answerLeak: answer ? 0 : document.querySelectorAll("#problemView [data-answer-source],#problemView .source62-climb-time-board.is-solved,#problemView .source62-climb-time-solution").length,
      items: items.map(item => {
        const board = item.querySelector(".source62-climb-time-board");
        const boardBox = board?.getBoundingClientRect();
        const panels = [...item.querySelectorAll(".source62-climb-time-board,.source62-climb-time-solution")];
        const expressions = [...item.querySelectorAll(".math-inline-expression")];
        const fractions = [...item.querySelectorAll(".math-fraction")];
        const evidence = item.querySelector("[data-source62-fraction-e4-mission4-kind]");
        const text = (item.innerText || "").replace(/\s+/g, " ").trim();
        return {
          itemVisible: visible(item), itemOutside: outside(item), boardVisible: visible(board), boardOutside: outside(board), boardWidth: boardBox?.width || 0,
          panelOverflow: panels.filter(panel => panel.scrollWidth > panel.clientWidth + 1 || [...panel.querySelectorAll(".source61-math-row")].some(row => { const box = row.getBoundingClientRect(); const parent = panel.getBoundingClientRect(); return box.left < parent.left - 1 || box.right > parent.right + 1; })).length,
          structure: board?.dataset.source62E4Mission4Structure || "",
          values: board?.dataset.source62E4Mission4Values || "",
          firstRate: board?.dataset.firstPerHour || "",
          secondRate: board?.dataset.secondPerHour || "",
          firstTotal: board?.dataset.firstTotal || "",
          secondTotal: board?.dataset.secondTotal || "",
          minutes: Number(board?.dataset.answerMinutes || 0),
          rowCount: item.querySelectorAll(".source61-math-row").length,
          solvedCount: item.querySelectorAll(".source62-climb-time-board.is-solved").length,
          solutionCount: item.querySelectorAll(".source62-climb-time-solution").length,
          fractionCount: fractions.length,
          thinBars: fractions.filter(fraction => { const top = fraction.firstElementChild; return !top || parseFloat(getComputedStyle(top).borderBottomWidth) < 1 || top.getBoundingClientRect().width < 8; }).length,
          expressionCount: expressions.length,
          brokenExpressions: expressions.filter(expression => getComputedStyle(expression).display !== "inline-flex" || getComputedStyle(expression).whiteSpace !== "nowrap" || expression.getClientRects().length !== 1).length,
          unitCount: item.querySelectorAll(".math-unit").length,
          source: evidence?.dataset.sourceItem || "",
          kind: evidence?.dataset.source62FractionE4Mission4Kind || "",
          candidateCount: Number(evidence?.dataset.candidateCount || 0),
          difficulty: evidence?.dataset.difficultyDesign || "",
          answerSource: item.querySelector(".source62-e4-mission4-answer")?.dataset.answerSource || "",
          fontsValid: panels.every(panel => { const font = getComputedStyle(panel).fontFamily; return font.includes("Pretendard") && font.includes("Malgun Gothic") && font.includes("Arial"); }),
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
    if (!item.itemVisible || item.itemOutside || !item.boardVisible || item.boardOutside || item.boardWidth < 280 || item.panelOverflow) fail(`${label}/${index + 1}: 산 오르기 자료판이 화면 밖이거나 잘렸습니다.`);
    if (item.structure !== "mountain-climb-time-difference" || !expectedItem || item.firstRate !== expectedItem?.firstRate || item.secondRate !== expectedItem?.secondRate || item.firstTotal !== expectedItem?.firstTotal || item.secondTotal !== expectedItem?.secondTotal || item.minutes !== expectedItem?.minutes) fail(`${label}/${index + 1}: 문제와 답의 두 사람 높이 비·시간 자료가 다릅니다.`);
    if (item.fractionCount < 8 || item.thinBars || item.expressionCount < 6 || item.brokenExpressions || item.unitCount < 4 || !item.fontsValid) fail(`${label}/${index + 1}: 세로 분수·시간 단위·공통 글꼴 또는 줄바꿈되지 않는 수식 묶음이 빠졌습니다.`);
    if (item.source !== sourceItemId || item.kind !== "mountain-climb-time-difference" || item.candidateCount !== 1 || item.difficulty !== difficultyNames[String(difficulty)] || item.rawFraction || item.invalid) fail(`${label}/${index + 1}: 원문·단일 답·난이도 또는 분수 표시가 다릅니다.`);
    if (answerView) {
      if (item.solvedCount !== 1 || item.solutionCount !== 1 || item.rowCount !== 14 || item.answerSource !== sourceItemId || item.fractionCount < 18 || item.unitCount < 10 || !item.text.includes("다른 방법") || !item.text.includes(expectedItem.answer)) fail(`${label}/${index + 1}: 답의 두 사람 정상 시간과 두 독립 계산이 없습니다.`);
    } else if (item.solvedCount || item.solutionCount || item.rowCount !== 4 || item.answerSource || state.answerLeak || !item.text.includes("동시에") || !item.text.includes("정상")) fail(`${label}/${index + 1}: 문제 조건이 빠졌거나 풀이·답이 노출되었습니다.`);
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
    for (let index = 0; index < 3; index += 1) if (problem.items[index]?.values !== answer.items[index]?.values || problem.items[index]?.minutes !== answer.items[index]?.minutes) fail(`${viewportLabel}/${difficulty}/${index + 1}: 문제와 답의 산 높이 비·시간 자료가 다릅니다.`);
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
  fs.writeFileSync(path.join(outputDir, "audit-result.txt"), `${failures.length ? "실패" : "통과"}: Mission 4 원문 산 높이 비·세로 분수·단위·독립 계산·답 누출·넘침; 화면 ${screenshots}장, A4 ${pdfs}개 ${renderedPages}쪽\n${failures.join("\n")}\n`, "utf8");
  if (failures.length) throw new Error([...new Set(failures)].join("\n"));
  console.log(`6-2 Mission 4 브라우저·인쇄 감사 통과: 화면 ${screenshots}장 · A4 ${pdfs}개 전 ${renderedPages}쪽`);
})().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
