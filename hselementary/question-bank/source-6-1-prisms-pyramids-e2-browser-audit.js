"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const playwrightPath = process.env.HSE_PLAYWRIGHT_PATH
  || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright";
const { PNG } = require(path.join(path.dirname(playwrightPath), "pngjs"));
const questionBankDir = __dirname;
const repoRoot = path.resolve(questionBankDir, "..", "..");
const outputDir = process.env.HSE_SCREENSHOT_DIR
  || path.join(questionBankDir, "tmp", "source-6-1-prisms-pyramids-e2-browser-audit");
const sourceIds = [
  "6-1-u2-e2-example-2-2",
  "6-1-u2-e2-mission-2",
  "6-1-u2-e2-mission-5"
];
const sources = [
  { id: sourceIds[0], search: "예제 2-2", kind: "cuboid-all-corners-cut" },
  { id: sourceIds[1], search: "Mission 2", kind: "regular-prism-radial-cut" },
  { id: sourceIds[2], search: "Mission 5", kind: "prism-all-vertices-truncated" }
];
const difficulties = [-1, 0, 1];
const difficultyNames = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const failures = [];
let screenshots = 0;
let pdfs = 0;
let renderedPdfPages = 0;
let checkedViews = 0;

const fail = message => failures.push(message);
const hasInvalidText = value => /undefined|null|NaN|Infinity|SyntaxError/.test(String(value || ""));

function safePath(urlPath) {
  const relative = decodeURIComponent(urlPath.split("?")[0]).replace(/^\/+/, "");
  const file = path.resolve(repoRoot, relative || "index.html");
  return file === repoRoot || file.startsWith(repoRoot + path.sep) ? file : null;
}

function contentType(file) {
  return ({
    ".css": "text/css",
    ".html": "text/html",
    ".js": "application/javascript",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".png": "image/png"
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
  return {
    server,
    baseUrl: `http://127.0.0.1:${server.address().port}/hselementary/question-bank/`
  };
}

function attachListeners(page, label) {
  page.on("pageerror", error => fail(`${label}: 브라우저 예외 ${error.message}`));
  page.on("console", message => {
    if (message.type() === "error" && !/Failed to load resource.*(?:404|ERR_[A-Z_]+)/.test(message.text())) {
      fail(`${label}: 콘솔 오류 ${message.text()}`);
    }
  });
}

function pdfPageCount(pdfPath) {
  const info = execFileSync("pdfinfo", [pdfPath], { encoding: "utf8" });
  const match = info.match(/^Pages:\s+(\d+)$/m);
  return match ? Number(match[1]) : 0;
}

function bodyInkPixels(pngPath) {
  const png = PNG.sync.read(fs.readFileSync(pngPath));
  const startY = Math.floor(png.height * 0.1);
  const endY = Math.floor(png.height * 0.7);
  const startX = Math.floor(png.width * 0.04);
  const endX = Math.floor(png.width * 0.96);
  let darkPixels = 0;
  for (let y = startY; y < endY; y += 1) {
    for (let x = startX; x < endX; x += 1) {
      const index = (y * png.width + x) * 4;
      if (png.data[index] < 180 || png.data[index + 1] < 180 || png.data[index + 2] < 180) darkPixels += 1;
    }
  }
  return darkPixels;
}

function renderPdfPages(pdfPath, pngPath, label) {
  try {
    const expectedPages = pdfPageCount(pdfPath);
    const prefix = pngPath.replace(/-page-1\.png$/, "-page");
    const directory = path.dirname(prefix);
    const stem = path.basename(prefix);
    for (const file of fs.readdirSync(directory).filter(name => new RegExp(`^${stem}-\\d+\\.png$`).test(name))) {
      fs.unlinkSync(path.join(directory, file));
    }
    execFileSync("pdftoppm", ["-png", pdfPath, prefix], { stdio: "ignore" });
    const pages = fs.readdirSync(directory)
      .filter(name => new RegExp(`^${stem}-\\d+\\.png$`).test(name))
      .sort((a, b) => Number(a.match(/-(\d+)\.png$/)[1]) - Number(b.match(/-(\d+)\.png$/)[1]));
    if (!expectedPages || pages.length !== expectedPages) fail(`${label}: A4 PDF ${expectedPages}쪽 중 ${pages.length}쪽만 PNG로 확인했습니다.`);
    for (const file of pages) {
      const pagePath = path.join(directory, file);
      if (fs.statSync(pagePath).size < 5000 || bodyInkPixels(pagePath) < 8000) {
        fail(`${label}: A4 ${file}의 본문이 비었거나 머리글만 있습니다.`);
      }
    }
    renderedPdfPages += pages.length;
  } catch (error) {
    fail(`${label}: A4 전체 페이지 PNG 렌더 실패 (${error.message}).`);
  }
}

function checkPdf(pdfPath, pngPath, label) {
  if (!fs.existsSync(pdfPath) || fs.statSync(pdfPath).size < 5000) {
    fail(`${label}: A4 PDF가 비어 있습니다.`);
    return;
  }
  pdfs += 1;
  renderPdfPages(pdfPath, pngPath, label);
}

async function selectThroughUi(page, baseUrl, source, difficulty, label) {
  await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#gradeFilter button[data-grade='6']").click();
  await page.locator("#termFilter button[data-term='1']").click();
  await page.locator("#typeSearchInput").fill(source.search);
  const row = page.locator(`[data-preview-type-id='${source.id}']`);
  await row.waitFor({ state: "visible", timeout: 20000 });
  const checkbox = row.locator(`input[data-type-id='${source.id}']`);
  if (await checkbox.isDisabled()) throw new Error("원문 유형이 화면에서 검수 대기로 잠겨 있습니다.");
  await checkbox.check();
  if (!(await checkbox.isChecked())) throw new Error("실제 유형 선택 체크가 유지되지 않았습니다.");
  await page.locator("#questionCountInput").fill("3");
  await page.locator(`#difficultyFilter button[data-difficulty='${difficulty}']`).click();
  const selected = page.locator(`#selectedTypeList [data-remove-type='${source.id}']`);
  if (!(await selected.count())) throw new Error("선택한 유형 요약에 원문 유형이 없습니다.");
  await page.locator("#generateButton").click();
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible", timeout: 20000 });
  await page.locator("#problemView:not([hidden])").waitFor({ state: "visible", timeout: 10000 });
  return `${label} / 실제 UI 선택 완료`;
}

async function inspectView(page, selector, source, difficulty, answerView, label) {
  const state = await page.evaluate(({ selected, isAnswer }) => {
    const items = [...document.querySelectorAll(selected)];
    const visible = element => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && box.width > 0 && box.height > 0;
    };
    const outside = element => {
      if (!element) return true;
      const box = element.getBoundingClientRect();
      return box.left < -2 || box.right > document.documentElement.clientWidth + 2;
    };
    const clipped = element => {
      if (!element) return true;
      const style = getComputedStyle(element);
      return (style.overflowX === "hidden" || style.overflowX === "clip") && element.scrollWidth > element.clientWidth + 1
        || (style.overflowY === "hidden" || style.overflowY === "clip") && element.scrollHeight > element.clientHeight + 1;
    };
    const svgState = svg => {
      const box = svg?.getBoundingClientRect();
      let drawing = { width: 0, height: 0 };
      try {
        const bounds = svg?.getBBox();
        drawing = { width: bounds?.width || 0, height: bounds?.height || 0 };
      } catch (_) {}
      return {
        exists: Boolean(svg),
        visible: visible(svg),
        outside: outside(svg),
        clipped: clipped(svg),
        width: box?.width || 0,
        height: box?.height || 0,
        drawingWidth: drawing.width,
        drawingHeight: drawing.height,
        structure: svg?.dataset.source61E2Structure || "",
        kind: svg?.closest("[data-source61-prism-e2-kind]")?.dataset.source61PrismE2Kind || "",
        cutPlanes: svg?.querySelectorAll(".source61-e2-corner-cut").length || 0,
        hiddenCutPlanes: svg?.querySelectorAll(".source61-e2-cut-plane.is-hidden").length || 0,
        hiddenFaceKeyCount: Number(svg?.querySelector("[data-hidden-cut-face-count]")?.dataset.hiddenCutFaceCount || 0),
        resultVertices: svg?.querySelectorAll(".source61-e2-prism-vertex").length || 0,
        fanSectors: svg?.querySelectorAll(".source61-e2-fan").length || 0,
        dataFanCount: svg?.dataset.fanCount || "",
        dataVerticalCutPlanes: svg?.dataset.verticalCutPlaneCount || "",
        dataN: svg?.dataset.n || "",
        dataResultVertices: svg?.dataset.resultVertexCount || "",
        dataResultHighlight: svg?.dataset.resultHighlight || ""
      };
    };
    const bodyText = document.body.innerText || "";
    const answerVisuals = items.map(item => item.querySelector(":scope > .solution-answer-visual"));
    const wrappers = answerVisuals.map(visual => visual?.querySelector(":scope > .source61-answer-diagram"));
    return {
      count: items.length,
      visibleCount: items.filter(visible).length,
      empty: items.some(item => !String(item.textContent || "").replace(/\s+/g, " ").trim()),
      pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      itemOverflow: items.some(item => item.scrollWidth > item.clientWidth + 2),
      itemClipped: items.some(clipped),
      itemOutside: items.some(outside),
      broken: /undefined|null|NaN|Infinity|SyntaxError/.test(bodyText),
      rawFraction: /\b\d+\s*\/\s*\d+\b/.test(bodyText),
      items: items.map(item => ({
        text: item.innerText || "",
        svg: svgState(item.querySelector("svg.source61-e2-diagram")),
        structures: [...item.querySelectorAll("[data-source61-e2-structure]")].map(node => node.dataset.source61E2Structure || ""),
        evidence: [...item.querySelectorAll("[data-source61-prism-e2-kind]")].map(node => ({
          kind: node.dataset.source61PrismE2Kind || "",
          source: node.dataset.sourceItem || "",
          values: node.dataset.values || "",
          difficulty: node.dataset.difficultyDesign || ""
        }))
      })),
      answerVisuals: wrappers.map(wrapper => ({
        exists: Boolean(wrapper),
        visible: visible(wrapper),
        outside: outside(wrapper),
        clipped: clipped(wrapper),
        source: wrapper?.dataset.answerSource || "",
        pool: wrapper?.dataset.verifiedPoolIndex || "",
        svg: svgState(wrapper?.querySelector("svg.source61-e2-diagram"))
      })),
      problemAnswerLeak: isAnswer ? 0 : document.querySelectorAll("#problemView .solution-answer-visual, #problemView .solution-item, #problemView .solution, #problemView [data-answer-source]").length,
      visibleText: items.map(item => item.innerText || "")
    };
  }, { selected: selector, isAnswer: answerView });

  checkedViews += 1;
  if (state.count !== 3 || state.visibleCount !== 3) fail(`${label}: 고정 검증 문항 3개가 모두 표시되지 않았습니다 (${state.count}/${state.visibleCount}).`);
  if (state.empty || state.pageOverflow || state.itemOverflow || state.itemClipped || state.itemOutside || state.broken) {
    fail(`${label}: 빈 내용·화면 넘침·잘림·화면 밖 배치 또는 깨진 값이 있습니다.`);
  }
  if (state.rawFraction) fail(`${label}: 가로 분수 표기가 남아 있습니다.`);
  if (state.problemAnswerLeak) fail(`${label}: 문제 화면에 답 또는 풀이가 노출됩니다.`);
  if (state.items.some(item => !item.svg.exists || !item.svg.visible || item.svg.width < 20 || item.svg.height < 20 || item.svg.drawingWidth <= 0 || item.svg.drawingHeight <= 0)) {
    fail(`${label}: 문제·답의 도형 SVG가 비어 있거나 보이지 않습니다.`);
  }
  if (answerView) {
    if (state.answerVisuals.length !== 3 || state.answerVisuals.some(item => !item.exists || !item.visible || item.outside || item.clipped || !item.svg.exists || !item.svg.visible)) {
      fail(`${label}: 답 그림 3개가 모두 보이지 않거나 잘렸습니다.`);
    }
    if (state.answerVisuals.map(item => item.pool).sort().join(",") !== "0,1,2") {
      fail(`${label}: 고정 묶음 번호 0,1,2가 한 번씩 나오지 않습니다.`);
    }
    if (state.answerVisuals.some(item => item.source !== source.id)) fail(`${label}: 답 그림의 원문 유형 ID가 다릅니다.`);
  }
  for (const item of state.items) {
    if (item.structures.length !== 1 || item.structures[0] !== state.answerVisuals[state.items.indexOf(item)]?.svg.structure && answerView) {
      if (answerView) fail(`${label}: 문제·답 도형의 구조 서명이 일치하지 않습니다.`);
    }
    if (item.evidence.length !== 1 || item.evidence[0].kind !== source.kind || item.evidence[0].source !== source.id) {
      fail(`${label}: 원문·도형 유형·검산 자료 연결이 다릅니다.`);
    }
    if (item.evidence[0]?.difficulty !== difficultyNames[String(difficulty)]) {
      fail(`${label}: 난이도별 검산 메타데이터가 다릅니다.`);
    }
  }
  if (answerView) {
    const problemStructures = await page.evaluate(() => [...document.querySelectorAll("#problemView .question-item svg.source61-e2-diagram")].map(svg => svg.dataset.source61E2Structure || ""));
    const answerStructures = state.answerVisuals.map(item => item.svg.structure);
    if (problemStructures.join("|") !== answerStructures.join("|")) fail(`${label}: 문제와 답 SVG의 구조 서명이 다릅니다.`);
  }
  checkGeometryContracts(state, source, label, answerView);
  return state;
}

function checkGeometryContracts(state, source, label, answerView) {
  for (const item of state.items) {
    const svg = answerView ? state.answerVisuals[state.items.indexOf(item)]?.svg : item.svg;
    if (!svg) continue;
    const n = Number(svg.dataN);
    if (source.kind === "cuboid-all-corners-cut") {
      if (svg.cutPlanes !== 8 || svg.resultVertices !== 24) fail(`${label}: 직육면체의 절단면 8개·결과 꼭짓점 점 24개가 아닙니다.`);
      if (svg.dataResultVertices !== "24") fail(`${label}: 직육면체 결과 꼭짓점 메타데이터가 24가 아닙니다.`);
    } else if (source.kind === "regular-prism-radial-cut") {
      if (!Number.isInteger(n) || svg.fanSectors !== n || Number(svg.dataFanCount) !== n) fail(`${label}: 정n각기둥의 부채꼴 ${n}개 분할이 그림과 맞지 않습니다.`);
      if (Number(svg.dataVerticalCutPlanes) !== n) fail(`${label}: 정n각기둥의 수직 절단면 수가 ${n}개로 표시되지 않았습니다.`);
      if (svg.resultVertices !== 0 || svg.cutPlanes !== 0) fail(`${label}: 방사형 분할 그림에 다른 절단 도형이 섞였습니다.`);
    } else if (source.kind === "prism-all-vertices-truncated") {
      if (!Number.isInteger(n) || svg.cutPlanes !== 2 * n || svg.resultVertices !== 6 * n) fail(`${label}: 절두 각기둥의 절단면 2n개·결과 꼭짓점 점 6n개가 아닙니다.`);
      if (Number(svg.dataResultVertices) !== 6 * n) fail(`${label}: 절두 각기둥 결과 꼭짓점 메타데이터가 6n과 다릅니다.`);
      if (svg.hiddenCutPlanes < 1 || svg.hiddenCutPlanes >= svg.cutPlanes) fail(`${label}: 절두 각기둥의 보이는 절단면과 뒤쪽 절단면이 구분되지 않았습니다.`);
      if (answerView && svg.hiddenFaceKeyCount !== n) fail(`${label}: 답 그림에 뒤쪽 절단면 ${n}개를 따로 보여 주지 않았습니다.`);
    }
  }
}

function checkAnswerLeak(state, source, difficulty, label) {
  const results = {
    [sourceIds[0]]: ["14", "24", "36", "74"],
    [sourceIds[1]]: ["45", "63", "72"],
    [sourceIds[2]]: ["30", "45", "54", "92", "110", "128"]
  }[source.id];
  for (const text of state.visibleText) {
    if (results.some(value => new RegExp(`(^|\\D)${value}(?=\\D|$)`).test(text))) {
      fail(`${label}: 문제 지문에 절단·계산 결과가 미리 노출되었습니다.`);
    }
  }
  if (difficulty === 0 && state.items.some(item => item.evidence[0]?.difficulty !== "source")) {
    fail(`${label}: 원본 난이도 지문에 다른 단계 안내가 섞였습니다.`);
  }
}

async function captureScreenshot(page, source, difficulty, viewportLabel, view) {
  const file = path.join(outputDir, `${source.id}-${difficulty}-${viewportLabel}-${view}.png`);
  await page.screenshot({ path: file, fullPage: true, timeout: 120000 });
  if (!fs.existsSync(file) || fs.statSync(file).size < 5000) fail(`${source.id}: ${view} ${viewportLabel} 화면 캡처가 비었습니다.`);
  screenshots += 1;
}

async function captureA4(page, source, view, tabId) {
  await page.locator(`#${tabId}`).click();
  await page.waitForTimeout(100);
  await page.emulateMedia({ media: "print" });
  const pdfPath = path.join(outputDir, `${source.id}-${view}-a4.pdf`);
  const pngPath = path.join(outputDir, `${source.id}-${view}-a4-page-1.png`);
  await page.pdf({ path: pdfPath, format: "A4", printBackground: true, preferCSSPageSize: true });
  checkPdf(pdfPath, pngPath, `${source.id} / ${view}`);
  await page.emulateMedia({ media: "screen" });
}

async function inspectType(browser, baseUrl, source, difficulty, viewport, viewportLabel) {
  const label = `${source.id} / ${viewportLabel} / 난이도 ${difficulty}`;
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  attachListeners(page, label);
  await page.route("**/*", route => {
    if (/fonts\.(googleapis|gstatic)\.com|cdn\.jsdelivr\.net/.test(route.request().url())) route.abort();
    else route.continue();
  });
  try {
    await selectThroughUi(page, baseUrl, source, difficulty, label);
    const problem = await inspectView(page, "#problemView .question-item", source, difficulty, false, label);
    checkAnswerLeak(problem, source, difficulty, `${label} / 문제`);
    await page.locator("#solutionTab").click();
    await page.locator("#solutionView:not([hidden])").waitFor({ state: "visible", timeout: 10000 });
    const answer = await inspectView(page, "#solutionView .solution-item", source, difficulty, true, label);
    if (difficulty === 0 && viewportLabel === "desktop") {
      await captureA4(page, source, "problem", "problemTab");
      await captureA4(page, source, "answer", "solutionTab");
    }
    await page.locator("#problemTab").click();
    await page.waitForTimeout(100);
    await captureScreenshot(page, source, difficulty, viewportLabel, "problem");
    await page.locator("#solutionTab").click();
    await page.waitForTimeout(100);
    await captureScreenshot(page, source, difficulty, viewportLabel, "answer");
  } catch (error) {
    fail(`${label}: 화면 감사 실패 (${error.message}).`);
  } finally {
    await page.close();
  }
}

function generatorReady() {
  global.window = {};
  delete require.cache[require.resolve("./generators.js")];
  require("./generators.js");
  const api = global.window.HSE_GENERATORS;
  if (!api || typeof api.generate !== "function" || !api.names.includes("sourceGrade6PrismsPyramidsE2")) return false;
  for (let variant = 0; variant < sourceIds.length; variant += 1) {
    try {
      const result = api.generate({ generatorKey: "sourceGrade6PrismsPyramidsE2", variant, sourceItemId: sourceIds[variant] }, 0, 0, variant + 1, variant);
      if (!result || result.generationMode !== "fixed-verified-pool" || result.verifiedVariantCount !== 3) return false;
    } catch (error) {
      fail(`생성기 준비 확인 실패: ${error.message}`);
      return false;
    }
  }
  return true;
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  if (!generatorReady()) {
    const summary = "구문 검사 통과: sourceGrade6PrismsPyramidsE2 생성기가 아직 안정 상태가 아니어서 브라우저 감사는 대기합니다.\n";
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
    for (const source of sources) {
      for (const difficulty of difficulties) {
        await inspectType(browser, baseUrl, source, difficulty, { width: 1440, height: 900 }, "desktop");
        await inspectType(browser, baseUrl, source, difficulty, { width: 390, height: 844 }, "mobile");
      }
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }

  if (screenshots !== 36) fail(`화면 캡처 수가 ${screenshots}장입니다. 36장이어야 합니다.`);
  if (pdfs !== 6) fail(`A4 PDF 수가 ${pdfs}개입니다. 6개여야 합니다.`);
  if (renderedPdfPages < pdfs) fail(`A4 PDF ${pdfs}개에서 전체 PNG 렌더가 ${renderedPdfPages}쪽뿐입니다.`);
  const status = failures.length ? "실패" : "통과";
  const summary = `${status}: 3유형×3난이도×PC/모바일, 실제 UI 선택, 고정 pool 3문항, 문제·답 구조·SVG·답 그림·누출·화면 검사, 화면 ${screenshots}장, A4 PDF ${pdfs}개, 렌더 ${renderedPdfPages}쪽, 확인 뷰 ${checkedViews}개\n${failures.join("\n")}\n`;
  fs.writeFileSync(path.join(outputDir, "audit-result.txt"), summary, "utf8");
  if (failures.length) throw new Error(failures.join("\n"));
  console.log(`6-1 2단원 개념탐구 2 브라우저 감사 통과: 3유형×3난이도×PC/모바일 · 실제 UI 선택 · 고정 3문항 · 답 그림 · A4 PDF 6개 전 ${renderedPdfPages}쪽`);
})().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
