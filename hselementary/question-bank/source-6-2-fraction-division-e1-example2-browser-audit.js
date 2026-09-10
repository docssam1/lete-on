"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const questionBankDir = __dirname;
const repoRoot = path.resolve(questionBankDir, "..", "..");
const playwrightPath = process.env.HSE_PLAYWRIGHT_PATH || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright";
const { chromium } = require(playwrightPath);
const { PNG } = require(path.join(path.dirname(playwrightPath), "pngjs"));
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(questionBankDir, "tmp", "source-6-2-fraction-division-e1-example2-browser-audit");
const sourceItemId = "6-2-u1-e1-example-2";
const difficultyNames = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const expectedAnswers = new Set(["3/2", "5/3", "7/4"]);
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

function contentType(file) {
  return ({ ".css": "text/css", ".html": "text/html", ".js": "application/javascript", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml" })[path.extname(file)] || "application/octet-stream";
}

async function startServer() {
  const server = http.createServer((request, response) => {
    let file = safePath(request.url || "/");
    if (file && fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }
    response.writeHead(200, { "Content-Type": `${contentType(file)}; charset=utf-8`, "Cache-Control": "no-store" });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  return { server, baseUrl: `http://127.0.0.1:${server.address().port}/hselementary/question-bank/` };
}

function inkPixels(pngPath) {
  const png = PNG.sync.read(fs.readFileSync(pngPath));
  let count = 0;
  for (let y = Math.floor(png.height * .04); y < Math.floor(png.height * .96); y += 1) for (let x = Math.floor(png.width * .03); x < Math.floor(png.width * .97); x += 1) {
    const offset = (y * png.width + x) * 4;
    if (png.data[offset] < 190 || png.data[offset + 1] < 190 || png.data[offset + 2] < 190) count += 1;
  }
  return count;
}

function renderPdf(pdfPath, prefix, label) {
  const expectedPages = Number(execFileSync("pdfinfo", [pdfPath], { encoding: "utf8" }).match(/^Pages:\s+(\d+)$/m)?.[1] || 0);
  execFileSync("pdftoppm", ["-png", pdfPath, prefix], { stdio: "ignore" });
  const directory = path.dirname(prefix);
  const stem = path.basename(prefix);
  const pages = fs.readdirSync(directory).filter(name => new RegExp(`^${stem}-\\d+\\.png$`).test(name)).sort();
  if (!expectedPages || pages.length !== expectedPages) fail(`${label}: A4 ${expectedPages}쪽 중 ${pages.length}쪽만 그림으로 확인했습니다.`);
  for (const page of pages) {
    const file = path.join(directory, page);
    if (fs.statSync(file).size < 5000 || inkPixels(file) < 1200) fail(`${label}: ${page}가 비었거나 읽을 내용이 없습니다.`);
  }
  renderedPages += pages.length;
}

async function selectType(page, baseUrl, difficulty) {
  await page.goto(`${baseUrl}?type=${encodeURIComponent(sourceItemId)}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible", timeout: 20000 });
  await page.locator("#problemView:not([hidden])").waitFor({ state: "visible", timeout: 10000 });
}

async function inspectView(page, difficulty, answerView, viewportLabel) {
  const state = await page.evaluate(({ isAnswer, sourceId }) => {
    const selector = isAnswer ? "#solutionView .solution-item" : "#problemView .question-item";
    const items = [...document.querySelectorAll(selector)];
    const visible = element => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && box.width > 0 && box.height > 0;
    };
    const outside = element => {
      const box = element?.getBoundingClientRect();
      return !box || box.left < -2 || box.right > document.documentElement.clientWidth + 2 || box.top < -2;
    };
    const clipped = element => {
      if (!element) return true;
      const style = getComputedStyle(element);
      return ((style.overflowX === "hidden" || style.overflowX === "clip") && element.scrollWidth > element.clientWidth + 1)
        || ((style.overflowY === "hidden" || style.overflowY === "clip") && element.scrollHeight > element.clientHeight + 1);
    };
    return {
      pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      answerLeak: isAnswer ? 0 : document.querySelectorAll("#problemView [data-answer-source],#problemView .source62-e1-example2-board.is-solved").length,
      items: items.map(item => {
        const board = item.querySelector(".source62-e1-example2-board");
        const boardBox = board?.getBoundingClientRect();
        const evidence = item.querySelector("[data-source62-fraction-e1-example2-kind]");
        const rows = [...(board?.querySelectorAll(".source61-math-row") || [])];
        return {
          itemVisible: visible(item),
          itemOutside: outside(item),
          itemClipped: clipped(item),
          boardVisible: visible(board),
          boardOutside: outside(board),
          boardClipped: clipped(board),
          boardWidth: boardBox?.width || 0,
          structure: board?.dataset.source62E1Example2Structure || "",
          geometry: board?.dataset.source62E1Example2Geometry || "",
          rowCount: rows.length,
          rowOverflow: rows.some(row => row.scrollWidth > row.clientWidth + 1),
          blankCount: board?.querySelectorAll(".source62-equation-blank").length || 0,
          solved: Boolean(board?.classList.contains("is-solved")),
          font: board ? getComputedStyle(board).fontFamily : "",
          source: evidence?.dataset.sourceItem || "",
          kind: evidence?.dataset.source62FractionE1Example2Kind || "",
          difficulty: evidence?.dataset.difficultyDesign || "",
          values: evidence?.dataset.values || "",
          answerSource: item.querySelector(".source62-e1-example2-answer")?.dataset.answerSource || "",
          mathFractions: item.querySelectorAll(".math-fraction").length,
          rawFraction: /\b\d+\s*\/\s*\d+\b/.test(item.innerText || ""),
          invalid: /undefined|null|NaN|Infinity|SyntaxError/.test(item.innerText || "")
        };
      }),
      sourceId
    };
  }, { isAnswer: answerView, sourceId: sourceItemId });
  const label = `${viewportLabel} / 난이도 ${difficulty} / ${answerView ? "답" : "문제"}`;
  if (state.pageOverflow || state.items.length !== 3) fail(`${label}: 화면이 가로로 넘치거나 고정 문항 3개가 모두 보이지 않습니다.`);
  for (const [index, item] of state.items.entries()) {
    if (!item.itemVisible || item.itemOutside || item.itemClipped || !item.boardVisible || item.boardOutside || item.boardClipped || item.boardWidth < 250 || item.rowOverflow) fail(`${label} ${index + 1}: 문항이나 두 식이 비었거나 화면 밖·잘림 상태입니다.`);
    if (item.structure !== "equal-result-blank-divisor" || !item.geometry || item.blankCount !== 1 || item.rowCount !== (answerView ? 3 : 2)) fail(`${label} ${index + 1}: 두 식·빈칸·답 행 구조가 원본 계약과 다릅니다.`);
    if (!item.font.includes("Pretendard") || !item.font.includes("Malgun Gothic") || !item.font.includes("Arial")) fail(`${label} ${index + 1}: 수식 글꼴이 공통 글꼴로 고정되지 않았습니다.`);
    if (item.source !== sourceItemId || item.kind !== "equal-results-blank-divisor" || item.difficulty !== difficultyNames[String(difficulty)]) fail(`${label} ${index + 1}: 원문·유형·난이도 연결이 다릅니다.`);
    if (item.rawFraction || item.invalid || item.mathFractions < (answerView ? 8 : 5)) fail(`${label} ${index + 1}: 가로 분수·깨진 값이 있거나 세로 분수 표시가 부족합니다.`);
    if (answerView) {
      const values = item.values.split(",").map(Number);
      if (!item.solved || item.answerSource !== sourceItemId || !expectedAnswers.has(`${values[12]}/${values[13]}`)) fail(`${label} ${index + 1}: 답 식의 원문 연결·계산 결과가 다릅니다.`);
    } else if (item.solved || state.answerLeak) fail(`${label} ${index + 1}: 문제에 답이 노출되었습니다.`);
  }
  return state;
}

async function capture(page, difficulty, viewportLabel, view) {
  const file = path.join(outputDir, `${sourceItemId}-${difficulty}-${viewportLabel}-${view}.png`);
  await page.screenshot({ path: file, fullPage: true, timeout: 120000 });
  if (!fs.existsSync(file) || fs.statSync(file).size < 5000 || inkPixels(file) < 1200) fail(`${viewportLabel}/${difficulty}/${view}: 화면 캡처가 비었습니다.`);
  screenshots += 1;
}

async function captureA4(page, view, tabId) {
  await page.locator(`#${tabId}`).click();
  await page.waitForTimeout(150);
  await page.emulateMedia({ media: "print" });
  const pdf = path.join(outputDir, `${sourceItemId}-${view}-a4.pdf`);
  await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
  if (!fs.existsSync(pdf) || fs.statSync(pdf).size < 5000) fail(`${view}: A4 PDF가 비었습니다.`);
  else renderPdf(pdf, pdf.replace(/\.pdf$/, "-page"), view);
  pdfs += 1;
  await page.emulateMedia({ media: "screen" });
}

async function inspectType(browser, baseUrl, difficulty, viewport, viewportLabel) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  page.on("pageerror", error => fail(`${viewportLabel}/${difficulty}: 브라우저 예외 ${error.message}`));
  page.on("console", message => {
    if (message.type() === "error" && !/Failed to load resource.*(?:404|ERR_[A-Z_]+)/.test(message.text())) fail(`${viewportLabel}/${difficulty}: 화면 오류 ${message.text()}`);
  });
  await page.route("**/*", route => /fonts\.(googleapis|gstatic)\.com|cdn\.jsdelivr\.net/.test(route.request().url()) ? route.abort() : route.continue());
  try {
    await selectType(page, baseUrl, difficulty);
    const problem = await inspectView(page, difficulty, false, viewportLabel);
    await capture(page, difficulty, viewportLabel, "problem");
    await page.locator("#solutionTab").click();
    await page.locator("#solutionView:not([hidden])").waitFor({ state: "visible", timeout: 10000 });
    const answer = await inspectView(page, difficulty, true, viewportLabel);
    await capture(page, difficulty, viewportLabel, "answer");
    for (let index = 0; index < 3; index += 1) if (problem.items[index]?.geometry !== answer.items[index]?.geometry) fail(`${viewportLabel}/${difficulty}/${index + 1}: 문제와 답의 두 식 자료가 다릅니다.`);
    if (difficulty === 0 && viewportLabel === "desktop") {
      await captureA4(page, "problem", "problemTab");
      await captureA4(page, "answer", "solutionTab");
    }
  } catch (error) {
    fail(`${viewportLabel}/${difficulty}: 브라우저 감사 실패 (${error.message})`);
  } finally {
    await page.close();
  }
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const { server, baseUrl } = await startServer();
  let browser;
  try {
    browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--disable-quic"] });
    for (const difficulty of [-1, 0, 1]) {
      await inspectType(browser, baseUrl, difficulty, { width: 1440, height: 900 }, "desktop");
      await inspectType(browser, baseUrl, difficulty, { width: 390, height: 844 }, "mobile");
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  if (screenshots !== 12) fail(`화면 캡처가 ${screenshots}장입니다. 12장이어야 합니다.`);
  if (pdfs !== 2 || renderedPages < 2) fail(`A4 검사 결과가 부족합니다: PDF ${pdfs}개, 그림 ${renderedPages}쪽.`);
  fs.writeFileSync(path.join(outputDir, "audit-result.txt"), `${failures.length ? "실패" : "통과"}: 예제 1-2 3난이도 PC/모바일 문제·답, 두 식·분수·넘침·답 누출 검사; 화면 ${screenshots}장, A4 ${pdfs}개 ${renderedPages}쪽\n${failures.join("\n")}\n`, "utf8");
  if (failures.length) throw new Error([...new Set(failures)].join("\n"));
  console.log(`6-2 예제 1-2 브라우저·인쇄 감사 통과: 3난이도×PC/모바일×문제/답 · 화면 12장 · A4 2개 전 ${renderedPages}쪽`);
})().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
