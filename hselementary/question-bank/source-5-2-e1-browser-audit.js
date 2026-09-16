"use strict";

const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");

const questionBankDir = __dirname;
const repoRoot = path.resolve(questionBankDir, "..", "..");
const playwrightPath = process.env.HSE_PLAYWRIGHT_PATH
  || path.join(process.env.USERPROFILE || "", ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "node", "node_modules", "playwright");
const { chromium } = require(playwrightPath);
const outputDir = process.env.HSE_SCREENSHOT_DIR
  || path.join(os.tmpdir(), "lete-on-hse-5-2-e1-browser-audit");
const configuredUrl = String(process.env.HSE_URL || "").trim();
const failures = [];
const findings = [];
let screenshots = 0;
let pdfs = 0;
let previewChecks = 0;
let visitedStates = 0;

global.window = {};
require("./source-inventory-5-2.js");
require("./curriculum.js");
require("./generators.js");
require("./source-5-2-e1.js");
require("./source-5-2-u2-e2.js");
require("./source-5-2-u2-e3.js");
require("./source-5-2-u2-e4.js");

const generatorApi = window.HSE_GENERATORS;
const inventory = window.HSE_SOURCE_INVENTORY_52;
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-2");
const sourceTypes = semester?.units
  .flatMap(unit => unit.subunits.flatMap(subunit => subunit.types))
  .filter(type => String(type.sourceItemId || "").startsWith("5-2-")) || [];
const publicTypes = sourceTypes.filter(type => !type.reviewLocked);
const lockedTypes = sourceTypes.filter(type => type.reviewLocked);
const expectedSourceIds = new Set((inventory?.items || []).map(item => item.sourceItemId));
const expectedReady = 68;
const expectedLocked = 38;
const difficultyOffsets = [-1, 0, 1];
const typeFilter = String(process.env.HSE_TYPE_FILTER || "").trim();
const auditedPublicTypes = typeFilter
  ? publicTypes.filter(type => type.sourceItemId === typeFilter || type.id === typeFilter)
  : publicTypes;
const expectedGeneratorKey = sourceItemId => {
  if (/^5-2-u2-e2-/.test(sourceItemId)) return "sourceGrade5Semester2Exploration2";
  if (/^5-2-u2-e3-/.test(sourceItemId)) return "sourceGrade5Semester2Unit2Exploration3";
  if (/^5-2-u2-e4-/.test(sourceItemId)) return "sourceGrade5Semester2Exploration4";
  return "sourceGrade5Semester2Exploration1";
};

function fail(message) {
  if (failures.length < 240) failures.push(message);
}

function compact(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function hasBrokenText(value) {
  return /undefined|null|NaN|Infinity|SyntaxError|\$\{/.test(String(value || ""));
}

function safePath(urlPath) {
  const relative = decodeURIComponent(String(urlPath || "/").split("?")[0]).replace(/^\/+/, "");
  const resolved = path.resolve(repoRoot, relative || "index.html");
  return resolved === repoRoot || resolved.startsWith(repoRoot + path.sep) ? resolved : null;
}

function contentType(file) {
  return ({
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".woff": "font/woff",
    ".woff2": "font/woff2"
  })[path.extname(file).toLowerCase()] || "application/octet-stream";
}

async function startReadOnlyServer() {
  const server = http.createServer((request, response) => {
    let file = safePath(request.url);
    if (file && fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }
    response.writeHead(200, { "Content-Type": contentType(file), "Cache-Control": "no-store" });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  return { server, url: `http://127.0.0.1:${server.address().port}/hselementary/question-bank/` };
}

function verifyCatalogContract() {
  if (!inventory || !Array.isArray(inventory.items)) fail("5-2 원문 목록을 불러오지 못했습니다.");
  if (!semester) fail("5-2 교육과정 학기를 찾지 못했습니다.");
  if (sourceTypes.length !== 106) fail(`5-2 원문 항목은 106개여야 하나 ${sourceTypes.length}개입니다.`);
  if ((inventory.items || []).length !== 106) fail(`5-2 원문 색인은 106개여야 하나 ${(inventory.items || []).length}개입니다.`);
  if (publicTypes.length !== expectedReady || lockedTypes.length !== expectedLocked) {
    fail(`5-2 공개·잠금 수가 다릅니다: 공개 ${publicTypes.length}/${expectedReady}, 잠금 ${lockedTypes.length}/${expectedLocked}`);
  }
  if (typeFilter && auditedPublicTypes.length !== 1) fail(`선택 검사 유형 ${typeFilter}을 공개 목록에서 하나로 찾지 못했습니다.`);
  const ids = sourceTypes.map(type => type.sourceItemId);
  if (new Set(ids).size !== ids.length) fail("5-2 교육과정에 중복된 원문 항목 ID가 있습니다.");
  if (ids.some(id => !expectedSourceIds.has(id)) || expectedSourceIds.size !== ids.length) fail("5-2 원문 색인과 교육과정 항목이 1:1로 맞지 않습니다.");
  for (const type of sourceTypes) {
    const item = inventory.items.find(candidate => candidate.sourceItemId === type.sourceItemId);
    if (!item) continue;
    if (Boolean(type.reviewLocked) !== Boolean(item.reviewLocked)) fail(`${type.sourceItemId}: 목록과 교육과정의 공개·잠금 상태가 다릅니다.`);
    if (type.sourcePdfPage !== item.sourcePdfPage || type.sourcePrintedPage !== item.sourcePrintedPage) fail(`${type.sourceItemId}: 원본 페이지 연결이 다릅니다.`);
    if (type.label !== item.typeLabel) fail(`${type.sourceItemId}: 세부 유형명이 원문 색인과 다릅니다.`);
  }
  for (const type of publicTypes) {
    const expectedKey = expectedGeneratorKey(type.sourceItemId);
    if (generatorApi.generatorKey(type) !== expectedKey) fail(`${type.sourceItemId}: 공개 생성기 연결이 ${expectedKey}와 다릅니다.`);
    if (!type.sourceVerified || type.verifiedVariantCount !== 3 || type.generationMode !== "fixed-verified-pool") fail(`${type.sourceItemId}: 공개 검증 메타데이터가 부족합니다.`);
    for (const difficulty of difficultyOffsets) {
      const generated = generatorApi.generate(type, 0, difficulty, 5202000 + difficulty + type.sourceItemId.length, type.variant || 0);
      if (!generated || generated.sourceItemId !== type.sourceItemId || generated.answerCandidateCount === 0) fail(`${type.sourceItemId}: 난이도 ${difficulty} 생성 결과가 없습니다.`);
      if (generated?.verifiedVariantCount !== 3 || generated?.generationMode !== "fixed-verified-pool") fail(`${type.sourceItemId}: 난이도 ${difficulty} 고정 검증 묶음 연결이 다릅니다.`);
    }
  }
  for (const type of lockedTypes) {
    if (generatorApi.generatorKey(type)) fail(`${type.sourceItemId}: 잠금 유형에 생성기가 연결되어 있습니다.`);
    try {
      if (generatorApi.generate(type, 0, 0, 5202001, type.variant || 0)) fail(`${type.sourceItemId}: 잠금 유형이 문제를 생성했습니다.`);
    } catch (_) {
      // 잠금 유형은 생성 거부와 빈 결과 모두 허용한다.
    }
  }
}

async function inspectCatalog(browser, baseUrl, viewport, label) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  page.on("pageerror", error => fail(`${label} 목록: 브라우저 오류 ${error.message}`));
  page.on("console", message => {
    if (message.type() === "error" && !/ERR_NETWORK_ACCESS_DENIED|Failed to load resource:.*(?:404|ERR_)/.test(message.text())) {
      fail(`${label} 목록: 콘솔 오류 ${message.text()}`);
    }
  });
  await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#typeList [data-preview-type-id]").first().waitFor({ state: "visible", timeout: 30000 });
  await page.click('#gradeFilter [data-grade="5"]');
  await page.click('#termFilter [data-term="2"]');
  await page.locator("#typeList [data-preview-type-id]").first().waitFor({ state: "visible", timeout: 30000 });
  const rows = page.locator("#typeList [data-preview-type-id]");
  const rowIds = await rows.evaluateAll(elements => elements.map(element => element.dataset.previewTypeId));
  const targetRowIds = rowIds.filter(id => expectedSourceIds.has(id));
  if (targetRowIds.length !== 106 || new Set(targetRowIds).size !== 106) fail(`${label} 목록: 5-2 원문 항목 106개가 고유하게 보이지 않습니다 (${targetRowIds.length}/${rowIds.length}).`);
  for (const type of sourceTypes) {
    const row = page.locator(`[data-preview-type-id="${type.id}"]`);
    if (await row.count() !== 1) {
      fail(`${label} ${type.sourceItemId}: 목록 행을 찾지 못했습니다.`);
      continue;
    }
    const checkbox = row.locator("input[data-type-id]");
    if (type.reviewLocked !== (await checkbox.isDisabled())) fail(`${label} ${type.sourceItemId}: 체크박스 공개·잠금 상태가 다릅니다.`);
    await row.scrollIntoViewIfNeeded();
    await row.click();
    const popover = page.locator("#typePreviewPopover:not([hidden])");
    await popover.waitFor({ state: "visible" });
    const state = await page.evaluate(id => {
      const compact = value => String(value || "").replace(/\s+/g, " ").trim();
      const selected = document.querySelector(`[data-preview-type-id="${id}"]`);
      const preview = document.querySelector("#typePreviewPopover:not([hidden])");
      const selectedBox = selected?.getBoundingClientRect();
      const previewBox = preview?.getBoundingClientRect();
      return {
        text: compact(preview?.innerText),
        rowExpanded: selected?.getAttribute("aria-expanded") === "true",
        pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        coversSelectedRow: Boolean(selectedBox && previewBox && previewBox.left < selectedBox.right && previewBox.right > selectedBox.left && previewBox.top < selectedBox.bottom && previewBox.bottom > selectedBox.top),
        outsideViewport: Boolean(previewBox && (previewBox.left < -1 || previewBox.right > innerWidth + 1))
      };
    }, type.id);
    previewChecks += 1;
    if (!state.rowExpanded || state.pageOverflow || state.coversSelectedRow || state.outsideViewport || !state.text.includes(type.label)) {
      fail(`${label} ${type.sourceItemId}: 미리보기 위치·제목·행 가리기 검사 실패 ${JSON.stringify(state)}`);
    }
    const statusText = type.reviewLocked ? "검수 대기" : "대표 문제";
    if (!state.text.includes(statusText)) fail(`${label} ${type.sourceItemId}: 미리보기 공개·잠금 표시가 다릅니다.`);
    await page.locator("[data-close-type-preview]").click();
  }
  await page.screenshot({ path: path.join(outputDir, `5-2-catalog-${label}.png`), fullPage: true, timeout: 120000 });
  screenshots += 1;
  await page.close();
}

function rect(element) {
  const box = element.getBoundingClientRect();
  return { left: box.left, right: box.right, top: box.top, bottom: box.bottom, width: box.width, height: box.height };
}

async function collectViewState(page, rootSelector, itemSelector, type, label) {
  return page.evaluate(({ rootSelector: root, itemSelector: item, visualRequired, answerVisualRequired }) => {
    const compact = value => String(value || "").replace(/\s+/g, " ").trim();
    const rect = element => {
      const box = element.getBoundingClientRect();
      return { left: box.left, right: box.right, top: box.top, bottom: box.bottom, width: box.width, height: box.height };
    };
    const rootElement = document.querySelector(root);
    const entries = [...document.querySelectorAll(`${root} ${item}`)];
    const inside = (inner, outer, tolerance = 2) => inner.left >= outer.left - tolerance && inner.right <= outer.right + tolerance && inner.top >= outer.top - tolerance && inner.bottom <= outer.bottom + tolerance;
    const visible = element => {
      const box = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return box.width >= 4 && box.height >= 4 && style.display !== "none" && style.visibility !== "hidden";
    };
    const visualReport = (entry, entryBox) => [...entry.querySelectorAll("svg, table, .source52-card-row, .source52-equation, .source52-math-board")].map(element => ({
      tag: element.tagName.toLowerCase(),
      box: rect(element),
      visible: visible(element),
      inside: inside(rect(element), entryBox, 3),
      scrollOverflow: element.scrollWidth > element.clientWidth + 1
    }));
    const fractionReport = [...document.querySelectorAll(`${root} .math-fraction`)].map(fraction => {
      const numerator = fraction.children[0];
      const denominator = fraction.children[1];
      const top = numerator?.getBoundingClientRect();
      const bottom = denominator?.getBoundingClientRect();
      const parent = fraction.getBoundingClientRect();
      return {
        valid: Boolean(top && bottom && top.width > 0 && bottom.width > 0 && top.bottom <= bottom.top + 1),
        centered: Boolean(top && bottom && Math.abs((top.left + top.right) / 2 - (bottom.left + bottom.right) / 2) <= 1.5),
        overlap: Boolean(top && bottom && top.bottom > bottom.top + 1)
      };
    });
    const itemReports = entries.map(entry => {
      const entryBox = rect(entry);
      const visuals = visualReport(entry, entryBox);
      return {
        text: compact(entry.innerText),
        overflow: entry.scrollWidth > entry.clientWidth + 1,
        visible: visible(entry),
        visualCount: visuals.length,
        visuals,
        answerVisualCount: entry.querySelectorAll(".solution-answer-visual svg, .solution-answer-visual table, .solution-answer-visual .source52-answer-visual").length,
        answer: compact(entry.querySelector("header strong")?.innerText),
        prompt: compact(entry.querySelector(".question-prompt")?.innerText),
        solution: compact(entry.querySelector("p")?.innerText)
      };
    });
    return {
      rootVisible: Boolean(rootElement && !rootElement.hidden && rootElement.getBoundingClientRect().height > 0),
      documentOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      broken: /undefined|null|NaN|Infinity|SyntaxError|\$\{/.test(document.body.innerText),
      itemReports,
      fractions: fractionReport,
      hasRequiredVisual: root !== "#problemView" || !visualRequired || itemReports.every(item => item.visualCount > 0 && item.visuals.every(visual => visual.visible && visual.inside && !visual.scrollOverflow)),
      hasRequiredAnswerVisual: !answerVisualRequired || itemReports.every(item => item.answerVisualCount > 0),
      problemHasSolutionItems: document.querySelectorAll("#problemView .solution-item").length > 0,
      solutionIsHidden: root === "#problemView" ? document.querySelector("#solutionView")?.hidden === true : false
    };
  }, {
    rootSelector,
    itemSelector,
    visualRequired: Boolean(type.problemVisualRequired),
    answerVisualRequired: Boolean(type.answerVisualRequired)
  });
}

function reportView(state, type, label) {
  const prefix = `${type.sourceItemId} ${label}`;
  if (!state.rootVisible || state.itemReports.length !== 3) fail(`${prefix}: 세 문항이 모두 표시되지 않았습니다 (${state.itemReports.length}).`);
  if (state.documentOverflow) fail(`${prefix}: 화면 가로 넘침이 있습니다.`);
  if (state.broken || state.itemReports.some(item => hasBrokenText(item.text))) fail(`${prefix}: 깨진 텍스트가 있습니다.`);
  if (state.itemReports.some(item => !item.visible || item.overflow)) fail(`${prefix}: 문항이 비어 있거나 잘렸습니다.`);
  if (!state.hasRequiredVisual) fail(`${prefix}: 필수 시각 요소가 없거나 문항 밖으로 나갔습니다.`);
  if (state.itemReports.some(item => item.visuals.some(visual => !visual.visible || !visual.inside || visual.scrollOverflow))) fail(`${prefix}: 시각 요소 표시·잘림 검사를 통과하지 못했습니다.`);
  if (state.fractions.some(fraction => !fraction.valid || !fraction.centered || fraction.overlap)) fail(`${prefix}: 분수 DOM 분자·분모 정렬이 맞지 않습니다.`);
}

function reportProblem(state, type, label, difficulty) {
  reportView(state, type, `${label} 문제 난이도 ${difficulty}`);
  const prompts = state.itemReports.map(item => item.prompt);
  if (new Set(prompts).size !== 3) fail(`${type.sourceItemId} ${label} 문제 난이도 ${difficulty}: 세 문항이 중복됩니다.`);
  if (state.problemHasSolutionItems || !state.solutionIsHidden) fail(`${type.sourceItemId} ${label} 문제 난이도 ${difficulty}: 문제 화면에 정답·풀이가 노출됩니다.`);
}

function reportSolution(state, type, label, difficulty) {
  reportView(state, type, `${label} 정답·풀이 난이도 ${difficulty}`);
  if (!state.hasRequiredAnswerVisual) fail(`${type.sourceItemId} ${label} 정답·풀이 난이도 ${difficulty}: 필수 정답 그림이 없습니다.`);
  const answers = state.itemReports.map(item => item.answer);
  if (answers.some(answer => !answer)) fail(`${type.sourceItemId} ${label} 정답·풀이 난이도 ${difficulty}: 정답이 비어 있습니다.`);
  if (state.itemReports.some(item => !item.solution)) fail(`${type.sourceItemId} ${label} 정답·풀이 난이도 ${difficulty}: 풀이가 비어 있습니다.`);
}

async function saveScreenshot(page, filename) {
  await page.screenshot({ path: path.join(outputDir, `${filename}.png`), fullPage: true, timeout: 120000 });
  screenshots += 1;
}

async function savePdf(page, filename) {
  const file = path.join(outputDir, `${filename}.pdf`);
  await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
  if (!fs.existsSync(file) || fs.statSync(file).size < 5000) fail(`${filename}: A4 PDF가 비었거나 생성되지 않았습니다.`);
  pdfs += 1;
}

async function inspectPublicType(browser, baseUrl, type, difficulty) {
  const key = `${type.sourceItemId}-difficulty-${difficulty}`;
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await desktopContext.newPage();
  page.setDefaultTimeout(60000);
  page.on("pageerror", error => fail(`${key}: 브라우저 오류 ${error.message}`));
  page.on("console", message => {
    if (message.type() === "error" && !/ERR_NETWORK_ACCESS_DENIED|Failed to load resource:.*(?:404|ERR_)/.test(message.text())) fail(`${key}: 콘솔 오류 ${message.text()}`);
  });
  await page.goto(`${baseUrl}?type=${encodeURIComponent(type.id)}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible", timeout: 30000 });
  const expectedDesign = difficulty < 0 ? "guided-source" : difficulty > 0 ? "independent-source" : "source";
  const designState = await page.locator("#problemView [data-difficulty-design]").evaluateAll(nodes => [...new Set(nodes.map(node => node.dataset.difficultyDesign))]);
  if (designState.length !== 1 || designState[0] !== expectedDesign) fail(`${key}: 난이도 설계 표시가 ${expectedDesign}과 다릅니다 (${designState.join(",")}).`);
  let state = await collectViewState(page, "#problemView", ".question-item", type, "desktop");
  reportProblem(state, type, "desktop", difficulty);
  await saveScreenshot(page, `${key}-desktop-problem`);
  await page.setViewportSize({ width: 794, height: 1123 });
  await page.emulateMedia({ media: "print" });
  state = await collectViewState(page, "#problemView", ".question-item", type, "A4");
  reportProblem(state, type, "A4", difficulty);
  await savePdf(page, `${key}-A4-problem`);
  await page.emulateMedia({ media: "screen" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.locator("#solutionTab").click();
  state = await collectViewState(page, "#solutionView", ".solution-item", type, "desktop");
  reportSolution(state, type, "desktop", difficulty);
  await saveScreenshot(page, `${key}-desktop-solution`);
  await page.setViewportSize({ width: 794, height: 1123 });
  await page.emulateMedia({ media: "print" });
  state = await collectViewState(page, "#solutionView", ".solution-item", type, "A4");
  reportSolution(state, type, "A4", difficulty);
  await savePdf(page, `${key}-A4-solution`);
  await page.close();
  await desktopContext.close();

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const mobile = await mobileContext.newPage();
  mobile.setDefaultTimeout(60000);
  mobile.on("pageerror", error => fail(`${key} mobile: 브라우저 오류 ${error.message}`));
  mobile.on("console", message => {
    if (message.type() === "error" && !/ERR_NETWORK_ACCESS_DENIED|Failed to load resource:.*(?:404|ERR_)/.test(message.text())) fail(`${key} mobile: 콘솔 오류 ${message.text()}`);
  });
  await mobile.goto(`${baseUrl}?type=${encodeURIComponent(type.id)}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await mobile.locator("#worksheet:not([hidden])").waitFor({ state: "visible", timeout: 30000 });
  state = await collectViewState(mobile, "#problemView", ".question-item", type, "mobile");
  reportProblem(state, type, "mobile", difficulty);
  await saveScreenshot(mobile, `${key}-mobile-problem`);
  await mobile.locator("#solutionTab").click();
  state = await collectViewState(mobile, "#solutionView", ".solution-item", type, "mobile");
  reportSolution(state, type, "mobile", difficulty);
  await saveScreenshot(mobile, `${key}-mobile-solution`);
  visitedStates += 6;
  findings.push({ sourceItemId: type.sourceItemId, difficulty, states: 6 });
  await mobile.close();
  await mobileContext.close();
}

async function inspectLockedRoutes(browser, baseUrl) {
  for (const type of lockedTypes) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    page.setDefaultTimeout(60000);
    await page.goto(`${baseUrl}?type=${encodeURIComponent(type.id)}&review=1&difficulty=0`, { waitUntil: "domcontentloaded", timeout: 90000 });
    const state = await page.evaluate(() => ({
      worksheetVisible: !document.querySelector("#worksheet")?.hidden,
      generateDisabled: document.querySelector("#generateButton")?.disabled === true,
      selectedCount: document.querySelector("#selectedTypeCount")?.textContent,
      pending: document.querySelector(`[data-preview-type-id]`)?.classList.contains("is-pending")
    }));
    if (state.worksheetVisible || !state.generateDisabled || state.selectedCount !== "0") fail(`${type.sourceItemId}: 잠금 생성 경로가 차단되지 않았습니다.`);
    await page.close();
  }
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  verifyCatalogContract();
  const localServer = configuredUrl ? null : await startReadOnlyServer();
  const baseUrl = configuredUrl || localServer.url;
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe"
  });
  try {
    await inspectCatalog(browser, baseUrl, { width: 1440, height: 900 }, "desktop");
    await inspectCatalog(browser, baseUrl, { width: 390, height: 844 }, "mobile");
    await inspectLockedRoutes(browser, baseUrl);
    for (const difficulty of difficultyOffsets) {
      for (const type of auditedPublicTypes) await inspectPublicType(browser, baseUrl, type, difficulty);
    }
  } finally {
    await browser.close();
    if (localServer) await new Promise(resolve => localServer.server.close(resolve));
  }
  const expectedScreenshots = 2 + auditedPublicTypes.length * difficultyOffsets.length * 4;
  const expectedPdfs = auditedPublicTypes.length * difficultyOffsets.length * 2;
  const detail = {
    sourceTypes: sourceTypes.length,
    publicTypes: publicTypes.length,
    auditedPublicTypes: auditedPublicTypes.length,
    lockedTypes: lockedTypes.length,
    previewChecks,
    visitedStates,
    screenshots,
    pdfs,
    expectedScreenshots,
    expectedPdfs,
    failures,
    findings
  };
  fs.writeFileSync(path.join(outputDir, "audit-detail.json"), JSON.stringify(detail, null, 2));
  if (screenshots !== expectedScreenshots) fail(`스크린샷 수가 다릅니다: ${screenshots}/${expectedScreenshots}`);
  if (pdfs !== expectedPdfs) fail(`A4 PDF 수가 다릅니다: ${pdfs}/${expectedPdfs}`);
  if (previewChecks !== 212) fail(`미리보기 검사 수가 다릅니다: ${previewChecks}/212`);
  if (failures.length) throw new Error(failures.join("\n"));
  console.log(`5-2 원문형 1·2단원 브라우저·A4 감사 통과: 원문 106 · 공개 ${publicTypes.length} · 이번 화면 검사 ${auditedPublicTypes.length} · 잠금 ${lockedTypes.length} · 난이도 3 · 미리보기 ${previewChecks}회 · 상태 ${visitedStates}회 · 화면 ${screenshots}장 · A4 ${pdfs}파일 · ${outputDir}`);
})().catch(error => {
  console.error(`5-2 원문형 1·2단원 브라우저·A4 감사 실패: ${error.stack || error}`);
  process.exitCode = 1;
});
