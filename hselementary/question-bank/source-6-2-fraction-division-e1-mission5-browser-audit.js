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
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(questionBankDir, "tmp", "source-6-2-fraction-division-e1-mission5-browser-audit");
const sourceItemId = "6-2-u1-e1-mission-5";
const difficultyNames = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const expectedSums = new Set(["39", "33", "36"]);
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
    if (fs.statSync(file).size < 5000 || inkPixels(file) < 1200) fail(`${label}: ${name}가 비었습니다.`);
  }
  renderedPages += rendered.length;
}

async function inspect(page, difficulty, answerView, viewportLabel) {
  const state = await page.evaluate(({ answer, sourceId }) => {
    const items = [...document.querySelectorAll(answer ? "#solutionView .solution-item" : "#problemView .question-item")];
    const visible = element => element && getComputedStyle(element).display !== "none" && element.getBoundingClientRect().width > 0 && element.getBoundingClientRect().height > 0;
    const outside = element => {
      const box = element?.getBoundingClientRect();
      return !box || box.left < -2 || box.right > document.documentElement.clientWidth + 2 || box.top < -2;
    };
    return {
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      answerLeak: answer ? 0 : document.querySelectorAll("#problemView [data-answer-source],#problemView .source62-natural-range-solution").length,
      items: items.map(item => {
        const board = item.querySelector(".source62-natural-range-board");
        const expression = item.querySelector(".source62-natural-range-expression");
        const solution = item.querySelector(".source62-natural-range-solution");
        const evidence = item.querySelector("[data-source62-fraction-e1-mission5-kind]");
        return {
          itemVisible: visible(item),
          itemOutside: outside(item),
          boardVisible: visible(board),
          boardOutside: outside(board),
          boardWidth: board?.getBoundingClientRect().width || 0,
          expressionOverflow: expression ? expression.scrollWidth > expression.clientWidth + 1 : true,
          structure: board?.dataset.source62E1Mission5Structure || "",
          expression: board?.dataset.source62E1Mission5Expression || "",
          blankFractions: item.querySelectorAll(".source62-range-blank-fraction").length,
          fractionCount: item.querySelectorAll(".math-fraction").length,
          solutionVisible: answer ? visible(solution) : !solution,
          solutionOutside: answer ? outside(solution) : false,
          solutionRows: solution?.querySelectorAll(".source61-math-row").length || 0,
          font: board ? getComputedStyle(board).fontFamily : "",
          source: evidence?.dataset.sourceItem || "",
          kind: evidence?.dataset.source62FractionE1Mission5Kind || "",
          difficulty: evidence?.dataset.difficultyDesign || "",
          candidates: evidence?.dataset.candidates || "",
          sum: evidence?.dataset.sum || "",
          answerSource: item.querySelector(".source62-e1-mission5-answer")?.dataset.answerSource || "",
          visibleCandidates: answer ? (item.innerText || "").includes(`가능한 수: ${(evidence?.dataset.candidates || "").split(",").join(", ")}`) : false,
          rawFraction: /\b\d+\s*\/\s*\d+\b/.test(item.innerText || ""),
          invalid: /undefined|null|NaN|Infinity|SyntaxError/.test(item.innerText || "")
        };
      }),
      sourceId
    };
  }, { answer: answerView, sourceId: sourceItemId });
  const label = `${viewportLabel}/${difficulty}/${answerView ? "답" : "문제"}`;
  if (state.overflow || state.items.length !== 3) fail(`${label}: 화면 넘침 또는 고정 문항 수 오류입니다.`);
  for (const [index, item] of state.items.entries()) {
    if (!item.itemVisible || item.itemOutside || !item.boardVisible || item.boardOutside || item.boardWidth < 250 || item.expressionOverflow) fail(`${label}/${index + 1}: 문항이나 세 나눗셈식이 화면 밖이거나 잘렸습니다.`);
    if (item.structure !== "fraction-division-natural-number-range" || !item.expression || item.blankFractions !== 1 || item.fractionCount < 3) fail(`${label}/${index + 1}: 원본의 부등식·분모 빈칸 구조가 다릅니다.`);
    if (!item.font.includes("Pretendard") || !item.font.includes("Malgun Gothic") || !item.font.includes("Arial")) fail(`${label}/${index + 1}: 공통 수식 글꼴이 아닙니다.`);
    if (item.source !== state.sourceId || item.kind !== "fraction-division-natural-number-range" || item.difficulty !== difficultyNames[String(difficulty)] || item.rawFraction || item.invalid) fail(`${label}/${index + 1}: 원문·유형·난이도 또는 분수 표시가 다릅니다.`);
    if (answerView) {
      if (!item.solutionVisible || item.solutionOutside || item.solutionRows !== 5 || item.answerSource !== state.sourceId || !expectedSums.has(item.sum) || !item.visibleCandidates) fail(`${label}/${index + 1}: 답 풀이표나 가능한 자연수 전수 표시가 다릅니다.`);
    } else if (!item.solutionVisible || state.answerLeak) fail(`${label}/${index + 1}: 문제에 답이 노출되었습니다.`);
  }
  return state;
}

async function screenshot(page, difficulty, viewportLabel, view) {
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
    await screenshot(page, difficulty, viewportLabel, "problem");
    await page.locator("#solutionTab").click();
    await page.locator("#solutionView:not([hidden])").waitFor({ state: "visible" });
    const answer = await inspect(page, difficulty, true, viewportLabel);
    await screenshot(page, difficulty, viewportLabel, "answer");
    for (let index = 0; index < 3; index += 1) if (problem.items[index]?.expression !== answer.items[index]?.expression) fail(`${viewportLabel}/${difficulty}/${index + 1}: 문제와 답의 부등식 수가 다릅니다.`);
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
    browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--disable-quic"] });
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
  fs.writeFileSync(path.join(outputDir, "audit-result.txt"), `${failures.length ? "실패" : "통과"}: Mission 5 부등호·분모 빈칸·전수 나열·넘침·답 누출; 화면 ${screenshots}장, A4 ${pdfs}개 ${renderedPages}쪽\n${failures.join("\n")}\n`, "utf8");
  if (failures.length) throw new Error([...new Set(failures)].join("\n"));
  console.log(`6-2 Mission 5 브라우저·인쇄 감사 통과: 화면 ${screenshots}장 · A4 ${pdfs}개 전 ${renderedPages}쪽`);
})().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
