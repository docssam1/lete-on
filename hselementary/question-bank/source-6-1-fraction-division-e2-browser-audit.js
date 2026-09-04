"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const playwrightPath = process.env.HSE_PLAYWRIGHT_PATH
  || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright";

const questionBankDir = __dirname;
const repoRoot = path.resolve(questionBankDir, "..", "..");
const outputDir = process.env.HSE_SCREENSHOT_DIR
  || path.join(questionBankDir, "tmp", "6-1-fraction-division-e2-browser-audit");
const sourceIds = [
  "6-1-u1-e2-exploration-2", "6-1-u1-e2-example-1", "6-1-u1-e2-example-2",
  "6-1-u1-e2-example-3", "6-1-u1-e2-example-4", "6-1-u1-e2-mission-1",
  "6-1-u1-e2-mission-2", "6-1-u1-e2-mission-3", "6-1-u1-e2-mission-4",
  "6-1-u1-e2-mission-5", "6-1-u1-e2-mission-6"
];
const representativeVariants = new Set([0, 1, 3, 7, 10]);
const fractionalVariants = new Set([0, 1, 2, 3, 5, 6, 7, 8, 9, 10]);
const unitByVariant = new Map([
  [0, "kg"], [1, "cm"], [4, "L"], [5, "kg"], [6, "L"], [7, "cm"], [9, "m"], [10, "분"]
]);
const failures = [];
let screenshots = 0;
let pdfs = 0;
let checkedPages = 0;
const fail = message => failures.push(message);

function safePath(urlPath) {
  const relative = decodeURIComponent(urlPath.split("?")[0]).replace(/^\/+/, "");
  const file = path.resolve(repoRoot, relative || "index.html");
  return file.startsWith(repoRoot + path.sep) || file === repoRoot ? file : null;
}

function contentType(file) {
  return ({
    ".css": "text/css", ".html": "text/html", ".js": "application/javascript",
    ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png"
  })[path.extname(file)] || "application/octet-stream";
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
    if (message.type() === "error" && !/Failed to load resource.*(?:404|ERR_[A-Z_]+)/.test(message.text())) {
      fail(`${label}: 콘솔 오류 ${message.text()}`);
    }
  });
}

function renderPdf(pdfPath, pngPath, label) {
  try {
    execFileSync("pdftoppm", ["-f", "1", "-l", "1", "-png", "-singlefile", pdfPath, pngPath.replace(/\.png$/, "")], { stdio: "ignore" });
    if (!fs.existsSync(pngPath) || fs.statSync(pngPath).size < 5000) fail(`${label}: A4 첫 쪽 PNG가 비었습니다.`);
  } catch (error) {
    fail(`${label}: A4 PNG 렌더 실패 (${error.message}).`);
  }
}

async function inspectView(page, selector, label, answerView, variant) {
  const state = await page.evaluate(({ selected, isAnswer, fractional }) => {
    const items = [...document.querySelectorAll(selected)];
    const visible = element => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && box.width > 0 && box.height > 0;
    };
    const hasClipping = element => {
      if (!element) return true;
      const style = getComputedStyle(element);
      return (["hidden", "clip"].includes(style.overflowX) && element.scrollWidth > element.clientWidth + 1)
        || (["hidden", "clip"].includes(style.overflowY) && element.scrollHeight > element.clientHeight + 1);
    };
    const escaped = element => {
      if (!element) return false;
      const box = element.getBoundingClientRect();
      return box.left < -1 || box.right > innerWidth + 1;
    };
    const visuals = items.map(item => item.querySelector(":scope > .solution-answer-visual"));
    const wrappers = visuals.map(visual => visual?.querySelector(":scope > .source61-answer-diagram"));
    const bodyText = document.body.innerText || "";
    return {
      count: items.length,
      visibleCount: items.filter(visible).length,
      empty: items.some(item => !String(item.textContent || "").replace(/\s+/g, " ").trim()),
      pageOverflow: document.documentElement.scrollWidth > innerWidth + 1,
      itemOverflow: items.some(item => item.scrollWidth > item.clientWidth + 1 || item.scrollHeight > item.clientHeight + 1),
      clipped: items.some(hasClipping),
      escaped: items.some(escaped),
      broken: /undefined|null|NaN|Infinity|SyntaxError/.test(bodyText),
      rawSlashFraction: /\b\d+\s*\/\s*\d+\b/.test(bodyText.replace(/<[^>]+>/g, " ")),
      fractionCount: items.map(item => item.querySelectorAll(".math-fraction").length),
      mixedCount: items.map(item => item.querySelectorAll(".math-mixed-number").length),
      unitTextCount: items.map(item => item.textContent.split(/\s+/).filter(Boolean).length),
      answerVisuals: visuals.map((visual, index) => ({
        exists: Boolean(visual && wrappers[index]),
        visible: visible(visual),
        clipped: hasClipping(visual),
        escaped: escaped(visual),
        source: wrappers[index]?.dataset.answerSource || "",
        pool: wrappers[index]?.dataset.verifiedPoolIndex || ""
      })),
      problemAnswerLeak: document.querySelectorAll("#problemView .solution-answer-visual, #problemView .solution-item, #problemView .solution, #problemView [data-answer-source]").length,
      diagramCount: items.map(item => item.querySelectorAll("svg.source61-e2-diagram").length),
      diagramTexts: items.map(item => [...item.querySelectorAll("svg.source61-e2-diagram")].map(svg => svg.textContent.trim()).join(" ")),
      diagramMarkup: items.map(item => [...item.querySelectorAll("svg.source61-e2-diagram")].map(svg => svg.outerHTML).join("\n")),
      answerPoolSet: wrappers.map(wrapper => wrapper?.dataset.verifiedPoolIndex || "").sort().join(","),
      visibleText: items.map(item => item.innerText || "")
    };
  }, { selected: selector, isAnswer: answerView, fractional: fractionalVariants.has(variant) });

  checkedPages += 1;
  if (state.count !== 3 || state.visibleCount !== 3) fail(`${label}: count=12 요청 후 고정 묶음 3문항이 아닙니다 (${state.count}/${state.visibleCount}).`);
  if (state.empty || state.pageOverflow || state.itemOverflow || state.clipped || state.escaped || state.broken) {
    fail(`${label}: 빈 내용·가로 넘침·잘림·겹침 또는 깨진 값이 있습니다.`);
  }
  if (state.rawSlashFraction) fail(`${label}: 가로 분수 표기가 남아 있습니다.`);
  if (fractionalVariants.has(variant) && state.fractionCount.every(count => count < 1)) {
    fail(`${label}: 분수가 필요한 유형인데 공통 세로 분수가 하나도 표시되지 않았습니다.`);
  }
  if (!answerView && state.problemAnswerLeak) fail(`${label}: 문제 화면에 답 또는 풀이가 노출됩니다.`);
  if (answerView) {
    if (state.answerVisuals.length !== 3 || state.answerVisuals.some(item => !item.exists || !item.visible || item.clipped || item.escaped)) {
      fail(`${label}: 답 그림 3개 중 비거나 잘린 것이 있습니다.`);
    }
    if (state.answerPoolSet !== "0,1,2") fail(`${label}: 고정 묶음 번호가 0,1,2로 한 번씩 나오지 않습니다 (${state.answerPoolSet}).`);
    if (state.answerVisuals.some(item => item.source !== sourceIds[variant])) fail(`${label}: 답 그림의 원문 유형 연결이 다릅니다.`);
  }
  return state;
}

function checkSquare(state, label) {
  for (const markup of state.diagramMarkup) {
    const rects = (markup.match(/<rect\b/g) || []).length;
    if (rects < 6) fail(`${label}: 정사각형을 5등분한 답 도형의 칸 수가 부족합니다 (${rects}).`);
  }
  if (state.diagramCount.some(count => count < 1)) fail(`${label}: 정사각형 문제 또는 답 도형이 없습니다.`);
}

function checkNumberLine(state, label, answerView) {
  const expected = ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ"];
  if (state.diagramCount.some(count => count < 1)) fail(`${label}: 수직선 문제 또는 답 도형이 없습니다.`);
  for (const markup of state.diagramMarkup) {
    if (!markup.includes('data-point-order="ㄱ,ㄴ,ㄷ,ㄹ,ㅁ"')) fail(`${label}: 수직선 점 순서 데이터가 없습니다.`);
    const labels = [...markup.matchAll(/<text\b[^>]*>([^<]*)<\/text>/g)].map(match => match[1]).join("");
    if (!expected.every(point => labels.includes(point))) fail(`${label}: 수직선 점 ㄱ·ㄴ·ㄷ·ㄹ·ㅁ이 모두 보이지 않습니다.`);
    if (answerView && (!markup.includes('data-target-point="ㅁ"') || !markup.includes("source61-e2-target-point is-solved"))) {
      fail(`${label}: 답 수직선에서 점 ㅁ 위치 또는 답 강조가 없습니다.`);
    }
    if (!answerView && /ㅁ\s*=/.test(markup)) fail(`${label}: 문제 도형에 점 ㅁ의 답 숫자가 노출됩니다.`);
  }
}

function checkEqualAreaTriangles(state, label, answerView) {
  if (state.diagramCount.some(count => count < 1)) fail(`${label}: 같은 넓이 삼각형 문제 또는 답 도형이 없습니다.`);
  for (const markup of state.diagramMarkup) {
    if ((markup.match(/<polygon\b/g) || []).length < 2) fail(`${label}: 두 삼각형이 모두 그려지지 않았습니다.`);
    if ((markup.match(/cm/g) || []).length < 3) fail(`${label}: 두 밑변과 주어진 높이 표시가 부족합니다.`);
    if (answerView && !markup.includes("source61-e2-target is-solved")) fail(`${label}: 정답 높이가 강조되지 않았습니다.`);
    if (!answerView && /구한 높이/.test(markup)) fail(`${label}: 문제 도형에 정답 높이 표기가 노출됩니다.`);
  }
}

async function renderRepresentativePages(page, baseUrl, sourceItemId, variant) {
  const label = `${sourceItemId} / PC / 원본 난이도`;
  for (const [tabId, viewName] of [["problemTab", "problem"], ["solutionTab", "answer"]]) {
    await page.locator(`#${tabId}`).click();
    await page.waitForTimeout(100);
    await page.emulateMedia({ media: "print" });
    const pdfPath = path.join(outputDir, `${sourceItemId}-${viewName}-a4.pdf`);
    const pngPath = path.join(outputDir, `${sourceItemId}-${viewName}-a4-page-1.png`);
    await page.pdf({ path: pdfPath, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (!fs.existsSync(pdfPath) || fs.statSync(pdfPath).size < 5000) fail(`${label}: ${viewName} A4 PDF가 비었습니다.`);
    else renderPdf(pdfPath, pngPath, label);
    pdfs += 1;
    await page.emulateMedia({ media: "screen" });
  }
  await page.locator("#problemTab").click();
  await page.waitForTimeout(100);
  await page.screenshot({ path: path.join(outputDir, `${sourceItemId}-desktop-problem.png`), fullPage: true, timeout: 120000 });
  screenshots += 1;
  await page.locator("#solutionTab").click();
  await page.waitForTimeout(100);
  await page.screenshot({ path: path.join(outputDir, `${sourceItemId}-desktop-answer.png`), fullPage: true, timeout: 120000 });
  screenshots += 1;
}

async function inspectType(browser, baseUrl, variant, difficulty, viewport, viewportLabel) {
  const sourceItemId = sourceIds[variant];
  const label = `${sourceItemId} / ${viewportLabel} / 난이도 ${difficulty}`;
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  attachListeners(page, label);
  await page.route("https://cdn.jsdelivr.net/**", route => route.abort());
  try {
    await page.goto(`${baseUrl}?type=${encodeURIComponent(sourceItemId)}&review=1&difficulty=${difficulty}&count=12`, {
      waitUntil: "domcontentloaded", timeout: 90000
    });
    await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible", timeout: 20000 });
    const problem = await inspectView(page, "#problemView .question-item", label, false, variant);
    if (unitByVariant.has(variant) && problem.visibleText.some(text => !text.includes(unitByVariant.get(variant)))) {
      fail(`${label}: 문제의 ${unitByVariant.get(variant)} 단위가 보이지 않습니다.`);
    }
    if (variant === 1) checkSquare(problem, `${label} / 문제`);
    if (variant === 3) checkNumberLine(problem, `${label} / 문제`, false);
    if (variant === 7) checkEqualAreaTriangles(problem, `${label} / 문제`, false);
    await page.locator("#solutionTab").click();
    await page.locator("#solutionView:not([hidden])").waitFor({ state: "visible", timeout: 10000 });
    const answer = await inspectView(page, "#solutionView .solution-item", label, true, variant);
    if (variant === 1) checkSquare(answer, `${label} / 답`);
    if (variant === 3) checkNumberLine(answer, `${label} / 답`, true);
    if (variant === 7) checkEqualAreaTriangles(answer, `${label} / 답`, true);
    if (representativeVariants.has(variant) && difficulty === 0 && viewportLabel === "desktop") {
      await renderRepresentativePages(page, baseUrl, sourceItemId, variant);
    }
    if (representativeVariants.has(variant) && difficulty === 0 && viewportLabel === "mobile") {
      await page.locator("#problemTab").click();
      await page.waitForTimeout(100);
      await page.screenshot({ path: path.join(outputDir, `${sourceItemId}-mobile-problem.png`), fullPage: true, timeout: 120000 });
      screenshots += 1;
      await page.locator("#solutionTab").click();
      await page.waitForTimeout(100);
      await page.screenshot({ path: path.join(outputDir, `${sourceItemId}-mobile-answer.png`), fullPage: true, timeout: 120000 });
      screenshots += 1;
    }
  } catch (error) {
    fail(`${label}: 화면 검사 실패 (${error.message}).`);
  } finally {
    await page.close();
  }
}

function ensureGeneratorIsReady() {
  global.window = {};
  require("./generators.js");
  const api = global.window.HSE_GENERATORS;
  if (!api || typeof api.generate !== "function") return false;
  try {
    const result = api.generate({ generatorKey: "sourceGrade6FractionDivisionE2", variant: 0, sourceItemId: sourceIds[0] }, 0, 0, 1, 0);
    if (!result || result.generationMode !== "fixed-verified-pool") return false;
    return true;
  } catch (error) {
    fail(`E2 생성기 준비 검사 실패: ${error.message}`);
    return false;
  }
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  if (!ensureGeneratorIsReady()) {
    const summary = "구문 검사 통과: E2 생성기가 아직 없어 브라우저 감사는 대기합니다. 생성기 준비 후 같은 명령으로 다시 실행하세요.\n";
    fs.writeFileSync(path.join(outputDir, "audit-result.txt"), summary, "utf8");
    console.log(summary.trim());
    return;
  }

  const { server, baseUrl } = await startServer();
  let browser;
  try {
    const { chromium } = require(playwrightPath);
    browser = await chromium.launch({
      headless: true,
      executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe",
      args: ["--disable-quic"]
    });
    for (let variant = 0; variant < sourceIds.length; variant += 1) {
      for (const difficulty of [-1, 0, 1]) {
        await inspectType(browser, baseUrl, variant, difficulty, { width: 1440, height: 900 }, "desktop");
        await inspectType(browser, baseUrl, variant, difficulty, { width: 390, height: 844 }, "mobile");
      }
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }

  const status = failures.length ? "실패" : "통과";
  const summary = `${status}: 11유형×3난이도×PC/모바일, 문제·답 분리, 고정 pool 3문항, 답 그림, 수식·단위, 도형별 계약, 화면 ${screenshots}장, A4 PDF ${pdfs}개, 감사 페이지 ${checkedPages}개\n${failures.join("\n")}\n`;
  fs.writeFileSync(path.join(outputDir, "audit-result.txt"), summary, "utf8");
  if (failures.length) throw new Error(failures.join("\n"));
  console.log(`6-1 1단원 개념탐구 2 브라우저 감사 통과: 11유형×3난이도×PC/모바일 · 고정 3문항 · 답 그림 · 도형 계약 · 화면 ${screenshots}장 · A4 PDF ${pdfs}개`);
})().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
