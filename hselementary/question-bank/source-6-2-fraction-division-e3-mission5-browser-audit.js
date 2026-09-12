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
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(questionBankDir, "tmp", "source-6-2-fraction-division-e3-mission5-browser-audit");
const sourceItemId = "6-2-u1-e3-mission-5";
const difficultyNames = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const expected = new Map([
  ["12:4", { product: "48", count: 10, pairs: "48:1|24:2|16:3|12:4|8:6|6:8|4:12|3:16|2:24|1:48", answer: "10개" }],
  ["18:5", { product: "90", count: 12, pairs: "90:1|45:2|30:3|18:5|15:6|10:9|9:10|6:15|5:18|3:30|2:45|1:90", answer: "12개" }],
  ["20:6", { product: "120", count: 16, pairs: "120:1|60:2|40:3|30:4|24:5|20:6|15:8|12:10|10:12|8:15|6:20|5:24|4:30|3:40|2:60|1:120", answer: "16개" }]
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
    if (fs.statSync(file).size < 20000 || inkPixels(file) < 12000) fail(`${label}: ${name}가 비었거나 식·순서쌍·풀이가 충분히 인쇄되지 않았습니다.`);
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
      answerLeak: answer ? 0 : document.querySelectorAll("#problemView [data-answer-source],#problemView .source62-natural-pair-list,#problemView .source62-natural-pair-board.is-solved,#problemView .source62-natural-pair-solution").length,
      items: items.map(item => {
        const board = item.querySelector(".source62-natural-pair-board");
        const boardBox = board?.getBoundingClientRect();
        const descendants = board ? [...board.querySelectorAll(":scope > *,.source62-natural-pair-conditions > span,.source62-natural-pair-list > span")] : [];
        const fractions = [...item.querySelectorAll(".math-fraction")];
        const evidence = item.querySelector("[data-source62-fraction-e3-mission5-kind]");
        const text = (item.innerText || "").replace(/\s+/g, " ").trim();
        return {
          itemVisible: visible(item), itemOutside: outside(item), boardVisible: visible(board), boardOutside: outside(board),
          boardWidth: boardBox?.width || 0, boardOverflow: board ? board.scrollWidth > board.clientWidth + 1 : true,
          clippedDescendants: boardBox ? descendants.filter(element => { const box = element.getBoundingClientRect(); return box.left < boardBox.left - 1 || box.right > boardBox.right + 1; }).length : 1,
          structure: board?.dataset.source62E3Mission5Structure || "",
          expression: board?.dataset.source62E3Mission5Expression || "",
          product: board?.dataset.product || "",
          pairCount: Number(board?.dataset.pairCount || 0),
          pairs: board?.dataset.pairs || "",
          conditionCount: item.querySelectorAll(".source62-natural-pair-conditions > span").length,
          equationCount: item.querySelectorAll(".source62-natural-pair-equation").length,
          fractionCount: fractions.length,
          thinBars: fractions.filter(fraction => { const top = fraction.firstElementChild; return !top || parseFloat(getComputedStyle(top).borderBottomWidth) < 1 || top.getBoundingClientRect().width < 8; }).length,
          pairCells: item.querySelectorAll(".source62-natural-pair-list > span").length,
          solvedCount: item.querySelectorAll(".source62-natural-pair-board.is-solved").length,
          solutionRows: item.querySelectorAll(".source62-natural-pair-solution .source61-math-row").length,
          font: board ? getComputedStyle(board).fontFamily : "",
          source: evidence?.dataset.sourceItem || "",
          kind: evidence?.dataset.source62FractionE3Mission5Kind || "",
          candidateCount: Number(evidence?.dataset.candidateCount || 0),
          difficulty: evidence?.dataset.difficultyDesign || "",
          evidencePairs: evidence?.dataset.pairs || "",
          answerSource: item.querySelector(".source62-e3-mission5-answer")?.dataset.answerSource || "",
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
    const row = expected.get(item.expression);
    if (!item.itemVisible || item.itemOutside || !item.boardVisible || item.boardOutside || item.boardWidth < 280 || item.boardOverflow || item.clippedDescendants) fail(`${label}/${index + 1}: 원문 식·조건·순서쌍 표가 화면 밖이거나 잘렸습니다.`);
    if (item.structure !== "natural-pair-count-from-fraction-division" || !row || item.product !== row?.product || item.pairCount !== row?.count || item.pairs !== row?.pairs || item.evidencePairs !== row?.pairs) fail(`${label}/${index + 1}: 문제와 답의 자연수 순서쌍 자료가 다릅니다.`);
    if (item.conditionCount !== 2 || item.equationCount !== 1 || item.fractionCount < 1 || item.thinBars) fail(`${label}/${index + 1}: 원문 식·자연수·순서 조건 또는 분수선이 빠졌습니다.`);
    if (!item.font.includes("Pretendard") || !item.font.includes("Malgun Gothic") || !item.font.includes("Arial")) fail(`${label}/${index + 1}: 식과 순서쌍 표의 공통 글꼴이 아닙니다.`);
    if (item.source !== sourceItemId || item.kind !== "natural-pair-count-from-fraction-division" || item.candidateCount !== 1 || item.difficulty !== difficultyNames[String(difficulty)] || item.rawFraction || item.invalid) fail(`${label}/${index + 1}: 원문·단일 답·난이도 또는 분수 표시가 다릅니다.`);
    if (answerView) {
      if (item.solvedCount !== 1 || item.pairCells !== row.count || item.solutionRows !== 3 || item.answerSource !== sourceItemId || !item.text.includes(row.answer)) fail(`${label}/${index + 1}: 답의 전체 순서쌍 표와 세 확인 단계가 다릅니다.`);
    } else if (item.solvedCount || item.pairCells || item.solutionRows || item.answerSource || state.answerLeak || item.text.includes(row.answer)) fail(`${label}/${index + 1}: 문제에 순서쌍 목록이나 답이 노출되었습니다.`);
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
    for (let index = 0; index < 3; index += 1) if (problem.items[index]?.expression !== answer.items[index]?.expression || problem.items[index]?.pairs !== answer.items[index]?.pairs) fail(`${viewportLabel}/${difficulty}/${index + 1}: 문제와 답의 식·순서쌍 자료가 다릅니다.`);
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
  fs.writeFileSync(path.join(outputDir, "audit-result.txt"), `${failures.length ? "실패" : "통과"}: Mission 5 원문 식·분수선·순서·전체 자연수 순서쌍·답 누출·넘침; 화면 ${screenshots}장, A4 ${pdfs}개 ${renderedPages}쪽\n${failures.join("\n")}\n`, "utf8");
  if (failures.length) throw new Error([...new Set(failures)].join("\n"));
  console.log(`6-2 Mission 5 브라우저·인쇄 감사 통과: 화면 ${screenshots}장 · A4 ${pdfs}개 전 ${renderedPages}쪽`);
})().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
