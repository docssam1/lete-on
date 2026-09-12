"use strict";

// Independent browser and print audit for 5-1 U6 E1. It owns only its own
// evidence folder and never changes curriculum, generators, inventory, or Git.
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const playwrightPath = process.env.HSE_PLAYWRIGHT_PATH
  || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright";
const { chromium } = require(playwrightPath);

const questionBankDir = __dirname;
const repoRoot = path.resolve(questionBankDir, "..", "..");
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(questionBankDir, "tmp", "5-1-polygon-perimeter-e1-browser-audit");
const summaryPath = path.join(outputDir, "audit-result.txt");
const sourceIds = [
  "5-1-u6-e1-exploration", "5-1-u6-e1-example-1-1", "5-1-u6-e1-example-1-2", "5-1-u6-e1-example-1-3",
  "5-1-u6-e1-example-1-4", "5-1-u6-e1-mission-1", "5-1-u6-e1-mission-2", "5-1-u6-e1-mission-3",
  "5-1-u6-e1-mission-4", "5-1-u6-e1-mission-5", "5-1-u6-e1-mission-6"
];
const publicVariants = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
const failures = [];
let screenshots = 0;
let pdfs = 0;
let generatorParseable = true;

// The first source item owns the base type ID; following items are numbered 2-11.
const typeIdForVariant = variant => variant === 0 ? "5-1-u6-t1" : `5-1-u6-t1-${variant + 1}`;

function fail(message) {
  failures.push(message);
}

function normalize(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function safePath(urlPath) {
  const relative = decodeURIComponent(urlPath.split("?")[0]).replace(/^\/+/, "");
  const file = path.resolve(repoRoot, relative || "index.html");
  return file.startsWith(repoRoot + path.sep) || file === repoRoot ? file : null;
}

function contentType(file) {
  return ({ ".css": "text/css", ".html": "text/html", ".js": "application/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png" })[path.extname(file)] || "application/octet-stream";
}

async function startReadOnlyServer() {
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
  const address = server.address();
  return { server, baseUrl: `http://127.0.0.1:${address.port}/hselementary/question-bank/` };
}

function renderPdfPreview(pdfPath, pngPath) {
  try {
    execFileSync("pdftoppm", ["-f", "1", "-l", "1", "-png", "-singlefile", pdfPath, pngPath.replace(/\.png$/, "")], { stdio: "ignore" });
    if (!fs.existsSync(pngPath) || fs.statSync(pngPath).size < 5000) fail(`${path.basename(pdfPath)}: A4 PDF 1쪽 렌더가 비정상입니다.`);
  } catch (error) {
    fail(`${path.basename(pdfPath)}: A4 PDF 렌더에 실패했습니다 (${error.message}).`);
  }
}

async function captureScreenshot(page, file) {
  await page.screenshot({ path: file, fullPage: true, timeout: 120000 });
  screenshots += 1;
}

function staticPreflight() {
  const generatorPath = path.join(questionBankDir, "generators.js");
  try {
    execFileSync(process.execPath, ["--check", generatorPath], { stdio: "pipe" });
  } catch (error) {
    generatorParseable = false;
    const detail = String(error.stderr || error.message).replace(/\r?\n/g, " ").replace(/\s+/g, " ").trim();
    fail(`생성기 파싱 실패: ${detail}`);
  }

  global.window = {};
  try {
    require("./curriculum.js");
    const semester = window.HSE_CURRICULUM?.semesters?.find(item => item.id === "5-1");
    const unit = semester?.units?.find(item => item.id === "5-1-u6");
    const types = unit?.subunits?.flatMap(item => item.types || []).filter(type => type.sourceItemId?.startsWith("5-1-u6-e1-")) || [];
    if (types.length !== 11) fail(`교육과정 E1 유형 수가 11개가 아닙니다: ${types.length}`);
    const ids = types.map(type => type.sourceItemId);
    if (ids.join("|") !== sourceIds.join("|")) fail(`교육과정 E1 원문 유형 순서가 다릅니다: ${ids.join(", ")}`);
    for (const type of types) {
      const expectedLocked = type.variant === 10;
      if (Boolean(type.reviewLocked) !== expectedLocked) fail(`${type.sourceItemId}: 공개/검수대기 상태가 계약과 다릅니다.`);
    }
  } catch (error) {
    fail(`교육과정 읽기 실패: ${error.message}`);
  } finally {
    delete global.window;
  }
}

function attachRuntimeListeners(page, key) {
  page.on("pageerror", error => fail(`${key}: 브라우저 예외 ${error.message}`));
  page.on("console", message => {
    if (message.type() === "error" && !/Failed to load resource.*(?:404|ERR_[A-Z_]+)/.test(message.text())) fail(`${key}: 콘솔 오류 ${message.text()}`);
  });
}

async function blockExternalFontRequest(page) {
  // The audit validates local application output. It must not wait on the
  // optional CDN font import before judging geometry and answer diagrams.
  await page.route("https://cdn.jsdelivr.net/**", route => route.abort());
}

async function collectViewState(page, selector) {
  return page.evaluate(selected => {
    const normalizeText = value => String(value || "").replace(/\s+/g, " ").trim();
    const visible = element => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && box.width > 0 && box.height > 0;
    };
    const svgNodeVisible = node => {
      const style = getComputedStyle(node);
      return style.display !== "none" && style.visibility !== "hidden";
    };
    const clipped = element => {
      if (!element) return true;
      const style = getComputedStyle(element);
      return (["hidden", "clip"].includes(style.overflowX) && element.scrollWidth > element.clientWidth + 1)
        || (["hidden", "clip"].includes(style.overflowY) && element.scrollHeight > element.clientHeight + 1);
    };
    const intersections = (left, right) => Math.max(0, Math.min(left.right, right.right) - Math.max(left.left, right.left)) * Math.max(0, Math.min(left.bottom, right.bottom) - Math.max(left.top, right.top));
    const items = [...document.querySelectorAll(selected)];
    const diagrams = items.flatMap(item => [...item.querySelectorAll("svg.polygon-perimeter-e1")]);
    const badSvg = diagrams.filter(svg => {
      if (!visible(svg) || clipped(svg) || !svg.getAttribute("viewBox")) return true;
      return [...svg.querySelectorAll("line, polygon, text")].some(node => !svgNodeVisible(node));
    });
    const labels = diagrams.flatMap(svg => [...svg.querySelectorAll(".perimeter-e1-label")]).map(label => {
      const style = getComputedStyle(label);
      return { text: normalizeText(label.textContent), segment: label.dataset.labelSegment, cell: label.dataset.labelCell, font: `${style.fontFamily}|${style.fontSize}`, box: label.getBoundingClientRect().toJSON() };
    });
    const lineRoles = diagrams.flatMap(svg => [...svg.querySelectorAll("line")]).map(line => ({ role: line.dataset.segmentRole, dash: getComputedStyle(line).strokeDasharray, stroke: getComputedStyle(line).stroke, className: line.getAttribute("class") || "" }));
    const colorRegions = diagrams.flatMap(svg => [...svg.querySelectorAll("polygon[data-region]")]).map(region => ({ name: region.dataset.region, fill: getComputedStyle(region).fill, box: region.getBoundingClientRect().toJSON() }));
    const answerVisuals = items.map(item => {
      const visual = item.querySelector(":scope > .solution-answer-visual");
      const wrapper = visual?.querySelector(".verified-answer-diagram");
      const visualBox = visual?.getBoundingClientRect();
      const answerSvgs = visual ? [...visual.querySelectorAll("svg.polygon-perimeter-e1")] : [];
      const invalidSvgs = answerSvgs.filter(svg => {
        if (!visible(svg) || clipped(svg) || !svg.getAttribute("viewBox")) return true;
        const svgBox = svg.getBoundingClientRect();
        const outside = !visualBox || svgBox.left < visualBox.left - 1 || svgBox.right > visualBox.right + 1
          || svgBox.top < visualBox.top - 1 || svgBox.bottom > visualBox.bottom + 1;
        const ink = [...svg.querySelectorAll("path, line, polygon, polyline, rect, circle, ellipse, text")]
          .some(node => svgNodeVisible(node) && node.getBoundingClientRect().width > 0 && node.getBoundingClientRect().height > 0);
        return outside || !ink || [...svg.querySelectorAll("line, polygon, text")].some(node => !svgNodeVisible(node));
      });
      return {
        exists: Boolean(visual),
        visible: visible(visual),
        clipped: clipped(visual),
        escaped: Boolean(visualBox && (visualBox.left < -1 || visualBox.right > innerWidth + 1)),
        source: wrapper?.dataset.answerSource || "",
        poolIndex: wrapper?.dataset.verifiedPoolIndex || "",
        svgCount: answerSvgs.length,
        invalidSvgCount: invalidSvgs.length,
        caption: normalizeText(visual?.querySelector(".solution-answer-caption")?.textContent)
      };
    });
    const overlaps = items.flatMap(item => {
      const elements = [...item.querySelectorAll(":scope > header, :scope > .question-prompt, :scope > .answer-line, :scope > p")].filter(visible);
      const result = [];
      for (let i = 0; i < elements.length; i += 1) for (let j = i + 1; j < elements.length; j += 1) {
        const a = elements[i].getBoundingClientRect(), b = elements[j].getBoundingClientRect();
        if (intersections(a, b) > 4) result.push([elements[i].className, elements[j].className]);
      }
      return result;
    });
    return {
      count: items.length,
      empty: items.some(item => !normalizeText(item.innerText)),
      pageOverflow: document.documentElement.scrollWidth > innerWidth + 1,
      clipped: items.some(clipped),
      overlaps,
      broken: /undefined|null|NaN|Infinity|SyntaxError/.test(document.body.innerText),
      solutionVisible: visible(document.querySelector("#solutionView")),
      solutionLeak: document.querySelectorAll("#problemView .solution-item").length > 0,
      answerCount: document.querySelectorAll("#solutionView .solution-item header strong").length,
      diagramCounts: items.map(item => item.querySelectorAll("svg.polygon-perimeter-e1").length),
      answerVisuals,
      diagrams: diagrams.map(svg => ({
        kind: svg.dataset.geometryKind, expected: svg.dataset.measureExpected, grid: svg.dataset.grid, marked: svg.dataset.markedCells,
        smallRects: svg.dataset.smallRects, squareCount: svg.dataset.squareCount, overlapCount: svg.dataset.overlapCount,
        targetSegment: svg.dataset.targetSegment, targetOrientation: svg.dataset.targetOrientation, originalTriangle: svg.dataset.originalTriangle,
        hexagon: svg.dataset.hexagon, hiddenSegments: svg.dataset.hiddenSegments, cellLayout: svg.dataset.cellLayout,
        cellPerimeters: svg.dataset.cellPerimeters,
        labels: [...svg.querySelectorAll(".perimeter-e1-label")].map(label => ({ text: normalizeText(label.textContent), segment: label.dataset.labelSegment, cell: label.dataset.labelCell })),
        roles: [...svg.querySelectorAll("line")].map(line => line.dataset.segmentRole),
        regions: [...svg.querySelectorAll("polygon[data-region]")].map(region => region.dataset.region)
      })),
      badSvgCount: badSvg.length,
      labels,
      lineRoles,
      colorRegions,
      text: normalizeText(document.body.innerText)
    };
  }, selector);
}

function assertCore(state, key, view) {
  if (state.count !== 3 || state.empty) fail(`${key} ${view}: 문제 3개를 실제 생성하지 못했습니다.`);
  if (state.pageOverflow) fail(`${key} ${view}: 가로 넘침이 있습니다.`);
  if (state.clipped) fail(`${key} ${view}: 문항 또는 인쇄 영역이 잘립니다.`);
  if (state.overlaps.length) fail(`${key} ${view}: 문항 요소가 겹칩니다.`);
  if (state.broken) fail(`${key} ${view}: 깨진 런타임 값이 보입니다.`);
  if (state.badSvgCount) fail(`${key} ${view}: SVG viewBox 안의 선, 색칠, 또는 라벨이 잘렸습니다.`);
}

function assertLinesAndMeasures(state, key) {
  const fonts = new Set(state.labels.map(label => label.font));
  if (state.labels.some(label => /cm|m/.test(label.text) && !/^(?:[\d.]+|□|㉠|㉡|[\d.]+[+×÷-][\d.]+)(?:cm|m)/.test(label.text))) fail(`${key}: 길이 값과 단위 표기가 분리되었거나 비일관적입니다.`);
  if (fonts.size > 2) fail(`${key}: 길이 라벨 글꼴 또는 크기가 일관되지 않습니다.`);
  const originals = state.lineRoles.filter(line => line.role === "original");
  const divisions = state.lineRoles.filter(line => line.role === "division");
  if (originals.length && originals.some(line => line.className !== "original" || line.dash === "none")) fail(`${key}: 원래 도형 점선이 구분되지 않습니다.`);
  if (divisions.length && divisions.some(line => line.className !== "crease" || line.dash === "none")) fail(`${key}: 안쪽 분할선 점선이 구분되지 않습니다.`);
  if (state.lineRoles.some(line => line.role === "outer" && (line.className || line.dash !== "none"))) fail(`${key}: 최종 도형 실선이 구분되지 않습니다.`);
}

function assertAnswerVisuals(answerState, problemState, sourceItemId, key, view) {
  const visuals = answerState.answerVisuals;
  if (visuals.length !== problemState.count) fail(`${key} ${view}: 정답 그림 묶음 수가 문제 수와 다릅니다.`);
  if (visuals.some(visual => !visual.exists || !visual.visible || visual.clipped || visual.escaped)) fail(`${key} ${view}: 정답 그림 영역이 없거나 잘리거나 화면 밖으로 나갑니다.`);
  if (visuals.some((visual, index) => visual.svgCount !== problemState.diagramCounts[index])) fail(`${key} ${view}: 정답 SVG 수가 같은 번호의 문제 SVG 수와 다릅니다.`);
  if (visuals.some(visual => !visual.svgCount || visual.invalidSvgCount || !visual.caption)) fail(`${key} ${view}: 정답 그림이 비어 있거나 보이지 않는 도형 요소가 있습니다.`);
  if (visuals.some(visual => visual.source !== sourceItemId || !/^(?:0|1|2)$/.test(visual.poolIndex))) fail(`${key} ${view}: 정답 그림의 원문 유형 또는 고정 묶음 표지가 다릅니다.`);
}

function assertVariant(state, variant, key) {
  const diagrams = state.diagrams;
  if (diagrams.length < 3) {
    fail(`${key}: 도형 SVG가 없습니다.`);
    return;
  }
  if (variant === 0) {
    const pairs = [0, 2, 4].map(index => diagrams.slice(index, index + 2));
    if (diagrams.length !== 6 || !diagrams.every(diagram => diagram.smallRects?.split(";").length === 4) || pairs.some(pair => pair.length !== 2 || pair.reduce((count, diagram) => count + diagram.regions.length, 0) < 3)) fail(`${key}: 개념탐구 두 배치의 합동 직사각형 4개와 색칠 영역이 모두 보이지 않습니다.`);
  }
  if (variant === 1) {
    if (diagrams.length !== 3 || diagrams.some(diagram => diagram.kind !== "right-angle-outline" || diagram.targetSegment || !diagram.expected || diagram.hiddenSegments !== "9;10")) fail(`${key}: 예제 1-1의 숨은 두 길이 검사를 통과하지 못했습니다.`);
  }
  if (variant === 2 && (diagrams.length !== 3 || diagrams.some(diagram => diagram.squareCount !== "3" || diagram.overlapCount !== "2" || diagram.regions.filter(region => region.startsWith("overlap-")).length !== 2))) fail(`${key}: 예제 1-2의 세 정사각형과 두 겹침 색칠이 보이지 않습니다.`);
  if (variant === 3 && (diagrams.length !== 3 || diagrams.some(diagram => diagram.grid !== "3x4" || diagram.roles.filter(role => role === "division").length !== 5))) fail(`${key}: 예제 1-3의 3열×4행 안쪽 분할선이 맞지 않습니다.`);
  if (variant === 4) {
    if (diagrams.length !== 3 || diagrams.some(diagram => !diagram.originalTriangle || !diagram.hexagon || diagram.labels.filter(label => /cm$/.test(label.text)).length < 3)) fail(`${key}: 예제 1-4의 점선 원래 정삼각형, 실선 육각형 또는 길이 라벨이 맞지 않습니다.`);
  }
  if (variant === 5 && (diagrams.length !== 3 || diagrams.some(diagram => !(diagram.targetSegment === "3" && diagram.targetOrientation === "vertical" && diagram.labels.some(label => label.text === "□cm" && label.segment === "3"))))) fail(`${key}: Mission 1의 □가 위쪽 홈 세로선에 없습니다.`);
  if (variant === 7) {
    if (diagrams.length !== 3 || diagrams.some(diagram => !["㉠", "㉡"].every(text => diagram.labels.some(label => label.text === text)) || diagram.labels.filter(label => /cm(?:×2)?$/.test(label.text)).length < 4)) fail(`${key}: Mission 3의 길이 및 ㉠/㉡ 라벨이 모두 보이지 않습니다.`);
  }
  if (variant === 8 && (diagrams.length !== 3 || diagrams.some(diagram => !(diagram.grid === "3x4" && diagram.marked === "1:1;1:2" && diagram.regions.length === 2)))) fail(`${key}: Mission 4의 정사각형 3열×4행 및 가운데 열 두 칸 색칠이 맞지 않습니다.`);
  if (variant === 9) {
    if (diagrams.length !== 3 || diagrams.some(diagram => {
      const labels = new Map(diagram.labels.map(label => [label.cell, label.text]));
      return diagram.cellLayout !== "가,다;나,라" || labels.get("0:0") !== "가" || labels.get("1:0") !== "다" || labels.get("0:1") !== "나" || labels.get("1:1") !== "라";
    })) fail(`${key}: Mission 5의 가·다/나·라 배치가 맞지 않습니다.`);
  }
}

async function inspectLocked(page, baseUrl) {
  const key = "Mission 6 검수대기";
  attachRuntimeListeners(page, key);
  await blockExternalFontRequest(page);
  await page.goto(`${baseUrl}?difficulty=0`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#gradeFilter [data-grade='5']").click();
  await page.locator("#termFilter [data-term='1']").click();
  await page.selectOption("#unitFilter", "5-1-u6");
  await page.locator(`input[data-type-id='${typeIdForVariant(10)}']`).waitFor({ state: "attached" });
  const state = await page.evaluate(() => ({
    worksheet: !document.querySelector("#worksheet")?.hidden,
    selected: String(document.querySelector("#selectedTypeCount")?.textContent || "").replace(/\s+/g, " ").trim(),
    questions: document.querySelectorAll("#problemView .question-item").length,
    disabled: document.querySelector("input[data-type-id='5-1-u6-t1-11']")?.disabled === true,
    buttonDisabled: document.querySelector("#generateButton")?.disabled === true
  }));
  if (!generatorParseable) fail(`${key}: 생성기 파싱 실패로 UI 잠금 상태를 판정할 수 없습니다.`);
  else if (state.worksheet || !/^0개?$/.test(state.selected) || state.questions || !state.disabled || !state.buttonDisabled) fail(`${key}: UI에서 생성 가능하거나 직접 생성되었습니다.`);
  await captureScreenshot(page, path.join(outputDir, "mission-6-locked-desktop.png"));
}

async function inspectFixedPoolCap(page, baseUrl) {
  const key = "검증 3문항 고정 묶음";
  attachRuntimeListeners(page, key);
  await blockExternalFontRequest(page);
  await page.goto(`${baseUrl}?difficulty=0`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#gradeFilter [data-grade='5']").click();
  await page.locator("#termFilter [data-term='1']").click();
  await page.selectOption("#unitFilter", "5-1-u6");
  await page.locator(`input[data-type-id='${typeIdForVariant(0)}']`).check();
  await page.locator("#questionCountInput").fill("12");
  const summary = await page.evaluate(() => ({
    side: document.querySelector("#selectedQuestionCount")?.textContent.trim(),
    bottom: document.querySelector("#selectedQuestionSummary")?.textContent.trim(),
    selected: document.querySelector("#selectedTypeList")?.textContent.replace(/\s+/g, " ").trim()
  }));
  if (summary.side !== "3" || summary.bottom !== "3문항" || !/검증 문항 3개/.test(summary.selected || "")) fail(`${key}: 선택 화면에 실제 보유 문항 수가 표시되지 않습니다.`);
  await page.locator("#generateButton").click();
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible", timeout: 12000 });
  await page.locator("#solutionTab").click();
  const generated = await page.evaluate(() => ({
    questions: document.querySelectorAll("#solutionView .solution-item").length,
    poolIndexes: [...document.querySelectorAll("#solutionView [data-verified-pool-index]")].map(node => node.dataset.verifiedPoolIndex)
  }));
  if (generated.questions !== 3 || new Set(generated.poolIndexes).size !== 3 || !["0", "1", "2"].every(index => generated.poolIndexes.includes(index))) {
    fail(`${key}: 12문항 요청을 서로 다른 검증 문항 3개로 제한하지 못했습니다.`);
  }
}

async function inspectType(browser, baseUrl, type, viewport, viewportLabel, difficulty) {
  const key = `${type.sourceItemId}-${viewportLabel}-${difficulty}`;
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  attachRuntimeListeners(page, key);
  await blockExternalFontRequest(page);
  try {
    await page.goto(`${baseUrl}?type=${encodeURIComponent(type.id)}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible", timeout: 12000 });
    let state = await collectViewState(page, "#problemView .question-item");
    assertCore(state, key, "문제");
    if (state.solutionVisible || state.solutionLeak) fail(`${key} 문제: 정답·풀이가 문제지에 섞였습니다.`);
    assertLinesAndMeasures(state, key);
    assertVariant(state, type.variant, key);
    const problemState = state;
    await captureScreenshot(page, path.join(outputDir, `${key}-problem.png`));

    if (viewportLabel === "desktop") {
      await page.emulateMedia({ media: "print" });
      state = await collectViewState(page, "#problemView .question-item");
      assertCore(state, key, "A4 문제");
      const pdf = path.join(outputDir, `${key}-problem.pdf`);
      await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
      if (!fs.existsSync(pdf) || fs.statSync(pdf).size < 5000) fail(`${key} A4 문제 PDF가 비정상입니다.`);
      else renderPdfPreview(pdf, path.join(outputDir, `${key}-problem-pdf-page-1.png`));
      pdfs += 1;
      await page.emulateMedia({ media: "screen" });
    }

    await page.click("#solutionTab");
    state = await collectViewState(page, "#solutionView .solution-item");
    assertCore(state, key, "정답·풀이");
    if (!state.solutionVisible || state.answerCount !== 3) fail(`${key} 정답·풀이: 정답 3개와 풀이가 분리되어 보이지 않습니다.`);
    assertAnswerVisuals(state, problemState, type.sourceItemId, key, "정답·풀이");
    await captureScreenshot(page, path.join(outputDir, `${key}-solution.png`));

    if (viewportLabel === "desktop") {
      await page.emulateMedia({ media: "print" });
      state = await collectViewState(page, "#solutionView .solution-item");
      assertCore(state, key, "A4 정답·풀이");
      assertAnswerVisuals(state, problemState, type.sourceItemId, key, "A4 정답·풀이");
      const pdf = path.join(outputDir, `${key}-solution.pdf`);
      await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
      if (!fs.existsSync(pdf) || fs.statSync(pdf).size < 5000) fail(`${key} A4 정답·풀이 PDF가 비정상입니다.`);
      else renderPdfPreview(pdf, path.join(outputDir, `${key}-solution-pdf-page-1.png`));
      pdfs += 1;
    }
  } catch (error) {
    fail(`${key}: 생성 또는 화면 대기 실패 (${error.message})`);
    await captureScreenshot(page, path.join(outputDir, `${key}-runtime-failure.png`)).catch(() => { screenshots += 1; });
  } finally {
    await page.close();
  }
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  staticPreflight();
  const { server, baseUrl } = await startReadOnlyServer();
  const browser = await chromium.launch({ headless: true, args: ["--disable-quic"], executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  try {
    const lockPage = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    await inspectLocked(lockPage, baseUrl);
    await lockPage.close();
    const capPage = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    await inspectFixedPoolCap(capPage, baseUrl);
    await capPage.close();
    const types = sourceIds.slice(0, 10).map((sourceItemId, variant) => ({ sourceItemId, variant, id: typeIdForVariant(variant) }));
    const runs = generatorParseable ? [-1, 0, 1].flatMap(difficulty => types.flatMap(type => [
      [type, { width: 1440, height: 900 }, "desktop", difficulty],
      [type, { width: 390, height: 844 }, "mobile", difficulty]
    ])) : [[types[0], { width: 1440, height: 900 }, "desktop", 0]];
    for (const [type, viewport, viewportLabel, difficulty] of runs) {
      await inspectType(browser, baseUrl, type, viewport, viewportLabel, difficulty);
    }
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  const expectedScreenshots = 121;
  const expectedPdfs = 60;
  if (!failures.length && (screenshots !== expectedScreenshots || pdfs !== expectedPdfs)) fail(`산출물 수가 다릅니다: 화면 ${screenshots}/${expectedScreenshots}, PDF ${pdfs}/${expectedPdfs}`);
  const summary = `${failures.length ? "실패" : "통과"}: 화면 ${screenshots}장, A4 PDF ${pdfs}개\n${failures.join("\n")}\n`;
  fs.writeFileSync(summaryPath, summary, "utf8");
  if (failures.length) throw new Error(failures.join("\n"));
  console.log(`5-1 6단원 개념탐구 1 다각형의 둘레 브라우저 감사 통과: 공개 10유형 x 3난이도, PC/모바일 ${screenshots}장, A4 ${pdfs}개, ${outputDir}`);
})().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
