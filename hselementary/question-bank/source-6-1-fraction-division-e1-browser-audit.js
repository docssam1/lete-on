"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const playwrightPath = process.env.HSE_PLAYWRIGHT_PATH
  || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright";
const { chromium } = require(playwrightPath);

const questionBankDir = __dirname;
const repoRoot = path.resolve(questionBankDir, "..", "..");
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(questionBankDir, "tmp", "6-1-fraction-division-e1-browser-audit");
const sourceIds = [
  "6-1-u1-e1-example-1", "6-1-u1-e1-example-2", "6-1-u1-e1-example-3", "6-1-u1-e1-example-4",
  "6-1-u1-e1-mission-1", "6-1-u1-e1-mission-2", "6-1-u1-e1-mission-3", "6-1-u1-e1-mission-4",
  "6-1-u1-e1-mission-5", "6-1-u1-e1-mission-6"
];
const failures = [];
let screenshots = 0;
let pdfs = 0;
const fail = message => failures.push(message);

function safePath(urlPath) {
  const relative = decodeURIComponent(urlPath.split("?")[0]).replace(/^\/+/, "");
  const file = path.resolve(repoRoot, relative || "index.html");
  return file.startsWith(repoRoot + path.sep) || file === repoRoot ? file : null;
}

function contentType(file) {
  return ({ ".css": "text/css", ".html": "text/html", ".js": "application/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png" })[path.extname(file)] || "application/octet-stream";
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

function attachListeners(page, label) {
  page.on("pageerror", error => fail(`${label}: 브라우저 예외 ${error.message}`));
  page.on("console", message => {
    if (message.type() === "error" && !/Failed to load resource.*(?:404|ERR_[A-Z_]+)/.test(message.text())) fail(`${label}: 콘솔 오류 ${message.text()}`);
  });
}

async function inspectView(page, selector, label, expectSolution) {
  const state = await page.evaluate(({ selected, answerView }) => {
    const items = [...document.querySelectorAll(selected)];
    const visible = element => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && box.width > 0 && box.height > 0;
    };
    const clipped = element => {
      const style = getComputedStyle(element);
      return (["hidden", "clip"].includes(style.overflowX) && element.scrollWidth > element.clientWidth + 1)
        || (["hidden", "clip"].includes(style.overflowY) && element.scrollHeight > element.clientHeight + 1);
    };
    const escaped = element => {
      const box = element.getBoundingClientRect();
      return box.left < -1 || box.right > innerWidth + 1;
    };
    const visuals = answerView ? items.map(item => item.querySelector(":scope > .solution-answer-visual")) : [];
    const wrappers = visuals.map(visual => visual?.querySelector(".source61-answer-diagram"));
    return {
      count: items.length,
      visibleCount: items.filter(visible).length,
      empty: items.some(item => !String(item.textContent || "").replace(/\s+/g, " ").trim()),
      pageOverflow: document.documentElement.scrollWidth > innerWidth + 1,
      clipped: items.some(clipped),
      escaped: items.some(escaped),
      broken: /undefined|null|NaN|Infinity|SyntaxError/.test(document.body.innerText),
      mathBoards: items.map(item => item.querySelectorAll(".source61-math-board").length),
      fractionCount: items.map(item => item.querySelectorAll(".math-fraction").length),
      answerVisuals: visuals.map((visual, index) => ({
        exists: Boolean(visual && wrappers[index]),
        visible: visible(visual),
        clipped: visual ? clipped(visual) : true,
        escaped: visual ? escaped(visual) : true,
        source: wrappers[index]?.dataset.answerSource || "",
        pool: wrappers[index]?.dataset.verifiedPoolIndex || ""
      })),
      problemAnswerLeak: document.querySelectorAll("#problemView .solution-answer-visual, #problemView .solution-item").length,
      problemGeometry: document.querySelectorAll("#problemView svg.source61-area-ratio").length,
      answerGeometry: document.querySelectorAll("#solutionView svg.source61-area-ratio").length,
      solvedSegments: document.querySelectorAll("#solutionView .source61-target.is-solved").length,
      pointLabelSets: [...document.querySelectorAll(`${selected} svg.source61-area-ratio`)].map(svg => [...svg.querySelectorAll(".source61-point")].map(node => node.textContent.trim()).join(""))
    };
  }, { selected: selector, answerView: expectSolution });
  if (state.count !== 3 || state.visibleCount !== 3) fail(`${label}: 고정 묶음이 화면에 3문항으로 보이지 않습니다 (${state.count}/${state.visibleCount}).`);
  if (state.empty || state.pageOverflow || state.clipped || state.escaped || state.broken) fail(`${label}: 빈 내용·잘림·가로 넘침 또는 깨진 값이 있습니다.`);
  if (state.mathBoards.some(count => count < 1)) fail(`${label}: 문제 또는 답의 시각 자료가 비었습니다.`);
  if (expectSolution && state.fractionCount.some(count => count < 1)) fail(`${label}: 답과 풀이의 분수가 공통 세로 분수로 표시되지 않았습니다.`);
  if (!expectSolution && state.problemAnswerLeak) fail(`${label}: 문제 화면에 답이나 풀이가 노출됩니다.`);
  if (expectSolution) {
    if (state.answerVisuals.length !== 3 || state.answerVisuals.some(item => !item.exists || !item.visible || item.clipped || item.escaped)) fail(`${label}: 답 그림 3개 중 비거나 잘린 것이 있습니다.`);
    const pools = state.answerVisuals.map(item => item.pool).sort().join(",");
    if (pools !== "0,1,2") fail(`${label}: 검증 묶음 번호가 0,1,2로 한 번씩 나오지 않습니다 (${pools}).`);
    if (state.answerVisuals.some(item => item.source !== label.split(" / ")[0])) fail(`${label}: 답 그림의 원문 유형 연결이 다릅니다.`);
  }
  return state;
}

function renderPdf(pdfPath, pngPath) {
  try {
    execFileSync("pdftoppm", ["-f", "1", "-l", "1", "-png", "-singlefile", pdfPath, pngPath.replace(/\.png$/, "")], { stdio: "ignore" });
    if (!fs.existsSync(pngPath) || fs.statSync(pngPath).size < 5000) fail(`${path.basename(pdfPath)}: A4 첫 쪽 그림이 비었습니다.`);
  } catch (error) {
    fail(`${path.basename(pdfPath)}: A4 렌더 실패 (${error.message}).`);
  }
}

async function inspectType(browser, baseUrl, sourceItemId, variant, difficulty, viewport, viewportLabel) {
  const label = `${sourceItemId} / ${viewportLabel} / 난이도 ${difficulty}`;
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  attachListeners(page, label);
  await page.route("https://cdn.jsdelivr.net/**", route => route.abort());
  try {
    await page.goto(`${baseUrl}?type=${encodeURIComponent(sourceItemId)}&review=1&difficulty=${difficulty}&count=12`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible", timeout: 20000 });
    const problem = await inspectView(page, "#problemView .question-item", label, false);
    if (variant === 2 && (problem.problemGeometry !== 3 || problem.pointLabelSets.some(labels => labels !== "ㄱㄴㅁㄷㄹ"))) fail(`${label}: 문제 도형 3개의 점 이름 또는 분할 구조가 다릅니다.`);
    if (difficulty === 0) {
      await page.screenshot({ path: path.join(outputDir, `${sourceItemId}-${viewportLabel}-problem.png`), fullPage: true, timeout: 120000 });
      screenshots += 1;
    }
    await page.locator("#solutionTab").click();
    await page.locator("#solutionView:not([hidden])").waitFor({ state: "visible", timeout: 10000 });
    const solution = await inspectView(page, "#solutionView .solution-item", label, true);
    if (variant === 2 && (solution.answerGeometry !== 3 || solution.solvedSegments !== 3 || solution.pointLabelSets.some(labels => labels !== "ㄱㄴㅁㄷㄹ"))) fail(`${label}: 답 도형 3개의 점 이름, 분할선 또는 정답 선분 강조가 다릅니다.`);
    if (difficulty === 0) {
      await page.screenshot({ path: path.join(outputDir, `${sourceItemId}-${viewportLabel}-solution.png`), fullPage: true, timeout: 120000 });
      screenshots += 1;
    }
    if (viewportLabel === "desktop" && difficulty === 0 && [0, 2].includes(variant)) {
      for (const [tab, filename] of [["problemTab", "problem"], ["solutionTab", "solution"]]) {
        await page.locator(`#${tab}`).click();
        await page.emulateMedia({ media: "print" });
        const pdfPath = path.join(outputDir, `${sourceItemId}-${filename}-a4.pdf`);
        const pngPath = path.join(outputDir, `${sourceItemId}-${filename}-a4-page-1.png`);
        await page.pdf({ path: pdfPath, format: "A4", printBackground: true, preferCSSPageSize: true });
        if (!fs.existsSync(pdfPath) || fs.statSync(pdfPath).size < 5000) fail(`${label}: ${filename} A4 PDF가 비었습니다.`);
        else renderPdf(pdfPath, pngPath);
        pdfs += 1;
        await page.emulateMedia({ media: "screen" });
      }
    }
  } catch (error) {
    fail(`${label}: 화면 검사 실패 (${error.message})`);
  } finally {
    await page.close();
  }
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const { server, baseUrl } = await startServer();
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--disable-quic"] });
  try {
    for (let variant = 0; variant < sourceIds.length; variant += 1) {
      for (const difficulty of [-1, 0, 1]) {
        await inspectType(browser, baseUrl, sourceIds[variant], variant, difficulty, { width: 1440, height: 900 }, "desktop");
        await inspectType(browser, baseUrl, sourceIds[variant], variant, difficulty, { width: 390, height: 844 }, "mobile");
      }
    }
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  const summary = `${failures.length ? "실패" : "통과"}: 10유형×3난이도×PC/모바일, 화면 ${screenshots}장, A4 PDF ${pdfs}개\n${failures.join("\n")}\n`;
  fs.writeFileSync(path.join(outputDir, "audit-result.txt"), summary, "utf8");
  if (failures.length) throw new Error(failures.join("\n"));
  console.log(`6-1 1단원 첫째 탐구 브라우저 감사 통과: 10유형×3난이도×PC/모바일 · 문제/답 그림 · 고정 묶음 3개 · 화면 ${screenshots}장 · A4 PDF ${pdfs}개`);
})().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
