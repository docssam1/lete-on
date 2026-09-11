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
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(questionBankDir, "tmp", "source-6-2-fraction-division-e5-exploration-browser-audit");
const sourceItemId = "6-2-u1-e5-exploration";
const difficultyNames = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const expected = new Map([
  ["3:7:5:8:127:116", { firstFactor: "7:3", thirdFactor: "8:5", difference: "11:15", sumDifference: 11, height: 15, lengths: "35:92:24" }],
  ["2:5:3:7:123:120", { firstFactor: "5:2", thirdFactor: "7:3", difference: "1:6", sumDifference: 3, height: 18, lengths: "45:78:42" }],
  ["4:9:5:12:128:131", { firstFactor: "9:4", thirdFactor: "12:5", difference: "3:20", sumDifference: 3, height: 20, lengths: "45:83:48" }]
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
    if (fs.statSync(file).size < 15000 || inkPixels(file) < 5000) fail(`${label}: ${name}가 비었거나 세 막대 관계와 계산이 충분히 인쇄되지 않았습니다.`);
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
      answerLeak: answer ? 0 : document.querySelectorAll("#problemView [data-answer-source],#problemView .source62-rod-water-board.is-solved,#problemView .source62-rod-water-solution").length,
      items: items.map(item => {
        const board = item.querySelector(".source62-rod-water-board");
        const boardBox = board?.getBoundingClientRect();
        const panels = [...item.querySelectorAll(".source62-rod-water-board,.source62-rod-water-solution")];
        const fractions = [...item.querySelectorAll(".math-fraction")];
        const evidence = item.querySelector("[data-source62-fraction-e5-exploration-kind]");
        const text = (item.innerText || "").replace(/\s+/g, " ").trim();
        return {
          itemVisible: visible(item), itemOutside: outside(item), boardVisible: visible(board), boardOutside: outside(board), boardWidth: boardBox?.width || 0,
          panelOverflow: panels.filter(panel => panel.scrollWidth > panel.clientWidth + 1 || [...panel.querySelectorAll("*")].some(child => child.getBoundingClientRect().right > panel.getBoundingClientRect().right + 1)).length,
          structure: board?.dataset.source62E5ExplorationStructure || "", values: board?.dataset.source62E5ExplorationValues || "",
          firstFactor: board?.dataset.firstFactor || "", thirdFactor: board?.dataset.thirdFactor || "", difference: board?.dataset.factorDifference || "", sumDifference: Number(board?.dataset.sumDifference || 0), height: Number(board?.dataset.waterHeight || 0), lengths: board?.dataset.rodLengths || "",
          rowCount: item.querySelectorAll(".source61-math-row").length, solvedCount: item.querySelectorAll(".source62-rod-water-board.is-solved").length, solutionCount: item.querySelectorAll(".source62-rod-water-solution").length,
          fractionCount: fractions.length, thinBars: fractions.filter(fraction => { const top = fraction.firstElementChild; return !top || parseFloat(getComputedStyle(top).borderBottomWidth) < 1 || top.getBoundingClientRect().width < 8; }).length,
          source: evidence?.dataset.sourceItem || "", kind: evidence?.dataset.source62FractionE5ExplorationKind || "", candidateCount: Number(evidence?.dataset.candidateCount || 0), difficulty: evidence?.dataset.difficultyDesign || "",
          answerSource: item.querySelector(".source62-e5-exploration-answer")?.dataset.answerSource || "",
          fontsValid: panels.every(panel => { const font = getComputedStyle(panel).fontFamily; return font.includes("Pretendard") && font.includes("Malgun Gothic") && font.includes("Arial"); }),
          text, rawFraction: /\b\d+\s*\/\s*\d+\b/.test(text), invalid: /undefined|null|NaN|Infinity|SyntaxError/.test(text)
        };
      })
    };
  }, answerView);
  const label = `${viewportLabel}/${difficulty}/${answerView ? "답" : "문제"}`;
  if (state.overflow || state.items.length !== 3) fail(`${label}: 화면 넘침 또는 고정 문항 수 오류입니다.`);
  for (const [index, item] of state.items.entries()) {
    const expectedItem = expected.get(item.values);
    if (!item.itemVisible || item.itemOutside || !item.boardVisible || item.boardOutside || item.boardWidth < 280 || item.panelOverflow) fail(`${label}/${index + 1}: 세 막대 관계표가 화면 밖이거나 잘렸습니다.`);
    if (item.structure !== "three-rods-submerged-fractions" || !expectedItem || item.firstFactor !== expectedItem?.firstFactor || item.thirdFactor !== expectedItem?.thirdFactor || item.difference !== expectedItem?.difference || item.sumDifference !== expectedItem?.sumDifference || item.height !== expectedItem?.height || item.lengths !== expectedItem?.lengths) fail(`${label}/${index + 1}: 문제와 답의 잠긴 비·길이 합·물 높이 자료가 다릅니다.`);
    if (item.fractionCount < 4 || item.thinBars || !item.fontsValid) fail(`${label}/${index + 1}: 세로 분수·길이 단위 또는 공통 글꼴이 빠졌습니다.`);
    if (item.source !== sourceItemId || item.kind !== "three-rods-submerged-water-height" || item.candidateCount !== 1 || item.difficulty !== difficultyNames[String(difficulty)] || item.rawFraction || item.invalid) fail(`${label}/${index + 1}: 원문·단일 답·난이도 또는 분수 표시가 다릅니다.`);
    if (answerView) {
      if (item.solvedCount !== 1 || item.solutionCount !== 1 || item.rowCount !== 13 || item.answerSource !== sourceItemId || !item.text.includes(`${expectedItem.height}cm`) || !item.text.includes("다시 확인")) fail(`${label}/${index + 1}: 답의 세 막대 길이와 독립 계산표가 없습니다.`);
    } else if (item.solvedCount || item.solutionCount || item.rowCount !== 4 || item.answerSource || state.answerLeak || !item.text.includes("막대 ㉠, ㉡, ㉢") || !item.text.includes("물의 높이")) fail(`${label}/${index + 1}: 원문 조건이 빠졌거나 풀이·답이 노출되었습니다.`);
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
    for (let index = 0; index < 3; index += 1) if (problem.items[index]?.values !== answer.items[index]?.values || problem.items[index]?.height !== answer.items[index]?.height || problem.items[index]?.lengths !== answer.items[index]?.lengths) fail(`${viewportLabel}/${difficulty}/${index + 1}: 문제와 답의 세 막대 자료가 다릅니다.`);
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
  fs.writeFileSync(path.join(outputDir, "audit-result.txt"), `${failures.length ? "실패" : "통과"}: 개념탐구 5 원문 세 막대 관계·세로 분수·단일 답·문제/답 자료 일치·넘침; 화면 ${screenshots}장, A4 ${pdfs}개 ${renderedPages}쪽\n${failures.join("\n")}\n`, "utf8");
  if (failures.length) throw new Error([...new Set(failures)].join("\n"));
  console.log(`6-2 개념탐구 5 브라우저·인쇄 감사 통과: 화면 ${screenshots}장 · A4 ${pdfs}개 전 ${renderedPages}쪽`);
})().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
