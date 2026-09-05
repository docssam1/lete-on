"use strict";

// Read-only browser audit for the public Grade 6 source taxonomy. It writes
// screenshots and a result note only under tmp/, and never changes bank data.
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const playwrightPath = process.env.HSE_PLAYWRIGHT_PATH
  || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright";
const { chromium } = require(playwrightPath);

const questionBankDir = __dirname;
const repoRoot = path.resolve(questionBankDir, "..", "..");
const catalogPath = path.join(questionBankDir, "source-inventory-grade6.js");
const curriculumPath = path.join(questionBankDir, "curriculum.js");
const indexPath = path.join(questionBankDir, "index.html");
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(questionBankDir, "tmp", "source-inventory-grade6-browser-audit");
const summaryPath = path.join(outputDir, "audit-result.txt");
const detailPath = path.join(outputDir, "audit-detail.json");
const failures = [];
const findings = [];
let screenshots = 0;
let pdfs = 0;

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
  return ({
    ".css": "text/css", ".html": "text/html", ".js": "application/javascript",
    ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png"
  })[path.extname(file)] || "application/octet-stream";
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
  return { server, baseUrl: `http://127.0.0.1:${server.address().port}/hselementary/question-bank/` };
}

async function screenshot(page, name, locator) {
  const file = path.join(outputDir, name);
  if (locator) await locator.screenshot({ path: file, timeout: 120000 });
  else await page.screenshot({ path: file, fullPage: true, timeout: 120000 });
  screenshots += 1;
  return file;
}

function renderPdfPreview(pdfPath, pngPath) {
  try {
    execFileSync("pdftoppm", ["-f", "1", "-l", "1", "-png", "-singlefile", pdfPath, pngPath.replace(/\.png$/, "")], { stdio: "ignore" });
    if (!fs.existsSync(pngPath) || fs.statSync(pngPath).size < 5000) fail(`${path.basename(pdfPath)}: A4 첫 페이지 렌더가 비정상입니다.`);
  } catch (error) {
    fail(`${path.basename(pdfPath)}: A4 PDF 렌더에 실패했습니다 (${error.message}).`);
  }
}

function staticPreflight() {
  const catalogText = fs.readFileSync(catalogPath, "utf8");
  const indexText = fs.readFileSync(indexPath, "utf8");
  const sourceIndex = indexText.indexOf("./source-inventory-grade6.js");
  const curriculumIndex = indexText.indexOf("./curriculum.js");
  if (!catalogText.includes("HSE_SOURCE_INVENTORY_GRADE6")) fail("6학년 원문 분류표 전역 변수가 없습니다.");
  if (sourceIndex < 0 || curriculumIndex < 0 || sourceIndex > curriculumIndex) fail("source-inventory-grade6.js가 curriculum.js보다 먼저 로드되지 않습니다.");
}

function attachRuntimeListeners(page, label) {
  page.on("pageerror", error => fail(`${label}: 브라우저 예외 ${error.message}`));
  page.on("console", message => {
    if (message.type() === "error" && !/Failed to load resource.*(?:404|ERR_[A-Z_]+)/.test(message.text())) {
      fail(`${label}: 콘솔 오류 ${message.text()}`);
    }
  });
}

async function blockExternalFontRequest(page) {
  await page.route("https://cdn.jsdelivr.net/**", route => route.abort());
}

async function openUnit(page, baseUrl, semester, unitId) {
  await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator(`#gradeFilter [data-grade='6']`).click();
  await page.locator(`#termFilter [data-term='${semester.split("-")[1]}']`).click();
  await page.locator("#unitFilter").selectOption(unitId);
  await page.locator("#typeList .tree-unit.is-open").waitFor({ state: "visible", timeout: 15000 });
}

async function collectUnitState(page, semester, unitId) {
  return page.evaluate(({ targetSemester, targetUnit }) => {
    const inventory = window.HSE_SOURCE_INVENTORY_GRADE6;
    const expected = (inventory?.items || []).filter(item => item.semester === targetSemester && `${targetSemester}-u${item.unit}` === targetUnit);
    const expectedIds = new Set(expected.map(item => item.sourceItemId));
    const expectedById = new Map(expected.map(item => [item.sourceItemId, item]));
    const rows = [...document.querySelectorAll("#typeList [data-preview-type-id]")];
    const sourceRows = rows.filter(row => expectedIds.has(row.dataset.previewTypeId));
    const sourceGroups = [...document.querySelectorAll("#typeList .tree-subunit")]
      .filter(group => /^개념탐구 \d+ 원문 유형$/.test(group.querySelector(".tree-subunit-head strong")?.textContent.trim() || ""));
    const legacyGroup = [...document.querySelectorAll("#typeList .tree-subunit")]
      .find(group => group.querySelector(".tree-subunit-head strong")?.textContent.trim() === "기존 생성 문제");
    const legacyInputs = legacyGroup ? [...legacyGroup.querySelectorAll("input[data-type-id]")] : [];
    const sourceState = sourceRows.map(row => {
      const input = row.querySelector("input[data-type-id]");
      return {
        id: row.dataset.previewTypeId,
        expectedLocked: expectedById.get(row.dataset.previewTypeId)?.reviewLocked !== false,
        disabled: input?.disabled === true,
        checked: input?.checked === true,
        pending: row.classList.contains("is-pending"),
        state: row.querySelector(".tree-type-state")?.textContent.trim() || ""
      };
    });
    return {
      expectedCount: expected.length,
      expectedIds: [...expectedIds],
      sourceRows: sourceState,
      sourceGroupCount: sourceGroups.length,
      groupLabels: sourceGroups.map(group => group.querySelector(".tree-subunit-head strong")?.textContent.trim() || ""),
      legacyExists: Boolean(legacyGroup),
      legacyCount: legacyInputs.length,
      legacyReadyIds: legacyInputs.filter(input => !input.disabled).map(input => input.dataset.typeId),
      selectedCount: String(document.querySelector("#selectedTypeCount")?.textContent || "").replace(/\s+/g, " ").trim(),
      generateDisabled: document.querySelector("#generateButton")?.disabled === true,
      pageOverflow: document.documentElement.scrollWidth > innerWidth + 1
    };
  }, { targetSemester: semester, targetUnit: unitId });
}

function assertUnitState(state, semester, unitId, viewport) {
  const label = `${semester} ${unitId} ${viewport}`;
  if (!state.expectedCount) fail(`${label}: 원문 분류표에 유형이 없습니다.`);
  if (state.sourceRows.length !== state.expectedCount) fail(`${label}: 화면 원문 유형 ${state.sourceRows.length}개, 분류표 ${state.expectedCount}개입니다.`);
  if (new Set(state.sourceRows.map(row => row.id)).size !== state.sourceRows.length) fail(`${label}: 화면 원문 유형 ID가 중복됩니다.`);
  if (state.sourceRows.some(row => row.checked || (row.expectedLocked ? (!row.disabled || !row.pending || row.state !== "검수 대기") : (row.disabled || row.pending || row.state !== "생성 가능")))) fail(`${label}: 원문 유형의 검증 상태와 선택 가능 상태가 다릅니다.`);
  if (state.sourceGroupCount === 0 || state.groupLabels.some(labelText => !/^개념탐구 \d+ 원문 유형$/.test(labelText))) fail(`${label}: 개념탐구별 원문 유형 묶음이 보이지 않습니다.`);
  if (!state.legacyExists || !state.legacyCount) fail(`${label}: 기존 생성 문제 묶음이 없습니다.`);
  if (!state.legacyReadyIds.length) fail(`${label}: 기존 생성 문제 묶음에 선택·생성 가능한 문제가 없습니다.`);
  if (state.selectedCount !== "0" || !state.generateDisabled) fail(`${label}: 유형을 고르기 전 선택 수 또는 생성 버튼 상태가 다릅니다.`);
  if (state.pageOverflow) fail(`${label}: 원문 유형 화면에 가로 넘침이 있습니다.`);
}

async function inspectLockedPreview(page, semester, unitId, viewport) {
  const sourceRow = page.locator("#typeList [data-preview-type-id]").filter({ has: page.locator("input[disabled]") }).first();
  await sourceRow.click();
  const popover = page.locator("#typePreviewPopover");
  await popover.waitFor({ state: "visible", timeout: 10000 });
  const result = await page.evaluate(() => {
    const popover = document.querySelector("#typePreviewPopover");
    const panel = document.querySelector(".selection-panel");
    const style = getComputedStyle(popover);
    const box = popover.getBoundingClientRect();
    const anchor = document.querySelector(".tree-type.is-previewing");
    const anchorBox = anchor?.getBoundingClientRect();
    return {
      text: String(popover?.textContent || "").replace(/\s+/g, " ").trim(),
      hidden: popover?.hidden,
      position: style.position,
      inPanel: Boolean(popover?.closest(".selection-panel")),
      width: box.width,
      left: box.left,
      right: box.right,
      top: box.top,
      anchorBottom: anchorBox?.bottom || 0,
      footerVisible: getComputedStyle(document.querySelector(".selection-footer")).display !== "none",
      pageOverflow: document.documentElement.scrollWidth > innerWidth + 1,
      viewportWidth: innerWidth,
      bodyPreviewOpen: document.body.classList.contains("is-type-preview-open"),
      panelVisible: Boolean(panel && panel.getBoundingClientRect().width > 0)
    };
  });
  const label = `${semester} ${unitId} ${viewport} 잠금 미리보기`;
  if (result.hidden || !result.inPanel || !result.panelVisible || result.position === "fixed" || !result.bodyPreviewOpen) fail(`${label}: 미리보기가 본문 안의 정적 영역으로 열리지 않았습니다.`);
  if (!/검수 대기/.test(result.text)) fail(`${label}: 잠금 사유가 보이지 않습니다.`);
  if (/undefined|null|NaN|Infinity/.test(result.text)) fail(`${label}: 원문 정보에 깨진 값이 표시됩니다.`);
  if (result.width <= 0 || result.left < -1 || result.right > result.viewportWidth + 1 || result.pageOverflow) fail(`${label}: 미리보기가 화면을 가리거나 가로 넘침을 만듭니다.`);
  if (viewport === "mobile" && result.top + 1 < result.anchorBottom) fail(`${label}: 모바일 미리보기가 선택한 유형 위를 덮습니다.`);
  await screenshot(page, `${semester}-${unitId}-${viewport}-locked-preview.png`);
  await popover.locator("[data-close-type-preview]").click();
  if (!(await popover.isHidden())) fail(`${label}: 닫기 동작이 되지 않습니다.`);
}

async function inspectUnit(browser, baseUrl, semester, unitNumber, viewport, viewportLabel) {
  const unitId = `${semester}-u${unitNumber}`;
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  attachRuntimeListeners(page, `${semester} ${unitId} ${viewportLabel}`);
  await blockExternalFontRequest(page);
  try {
    await openUnit(page, baseUrl, semester, unitId);
    const state = await collectUnitState(page, semester, unitId);
    assertUnitState(state, semester, unitId, viewportLabel);
    findings.push({ semester, unitId, viewport: viewportLabel, sourceTypes: state.sourceRows.length, sourceGroups: state.sourceGroupCount, legacyTypes: state.legacyCount, legacyReady: state.legacyReadyIds.length });
    await screenshot(page, `${semester}-${unitId}-${viewportLabel}-catalog.png`, page.locator("#catalogPanel"));
    await inspectLockedPreview(page, semester, unitId, viewportLabel);
    return state.legacyReadyIds[0] || "";
  } catch (error) {
    fail(`${semester} ${unitId} ${viewportLabel}: 화면 검사 실패 (${error.message})`);
    await screenshot(page, `${semester}-${unitId}-${viewportLabel}-failure.png`).catch(() => {});
    return "";
  } finally {
    await page.close();
  }
}

async function inspectGeneratedWorksheet(browser, baseUrl, typeId, viewport, label, createPdf) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  attachRuntimeListeners(page, `기존 생성 문제 ${label}`);
  await blockExternalFontRequest(page);
  try {
    await page.goto(`${baseUrl}?type=${encodeURIComponent(typeId)}&review=1&difficulty=0`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible", timeout: 20000 });
    const problem = await page.evaluate(() => {
      const compact = value => String(value || "").replace(/\s+/g, " ").trim();
      return {
        questions: document.querySelectorAll("#problemView .question-item").length,
        visible: !document.querySelector("#problemView")?.hidden,
        nonEmpty: [...document.querySelectorAll("#problemView .question-item")].every(item => compact(item.textContent).length > 0),
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        broken: /undefined|null|NaN|Infinity|SyntaxError/.test(document.body.innerText)
      };
    });
    if (problem.questions !== 3 || !problem.visible || !problem.nonEmpty || problem.overflow || problem.broken) fail(`기존 생성 문제 ${label}: 문제 화면이 비었거나 가로 넘침 또는 깨진 값이 있습니다.`);
    await screenshot(page, `legacy-${label}-problem.png`);
    if (createPdf) {
      await page.emulateMedia({ media: "print" });
      const pdf = path.join(outputDir, `legacy-${label}-problem-a4.pdf`);
      await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
      if (!fs.existsSync(pdf) || fs.statSync(pdf).size < 5000) fail(`기존 생성 문제 ${label}: A4 문제 PDF가 비정상입니다.`);
      else renderPdfPreview(pdf, path.join(outputDir, `legacy-${label}-problem-a4-page-1.png`));
      pdfs += 1;
      await page.emulateMedia({ media: "screen" });
    }
    await page.locator("#solutionTab").click();
    const solution = await page.evaluate(() => {
      const compact = value => String(value || "").replace(/\s+/g, " ").trim();
      return {
        answers: document.querySelectorAll("#solutionView .solution-item").length,
        visible: !document.querySelector("#solutionView")?.hidden,
        nonEmpty: [...document.querySelectorAll("#solutionView .solution-item")].every(item => compact(item.textContent).length > 0),
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        broken: /undefined|null|NaN|Infinity|SyntaxError/.test(document.body.innerText)
      };
    });
    if (solution.answers !== 3 || !solution.visible || !solution.nonEmpty || solution.overflow || solution.broken) fail(`기존 생성 문제 ${label}: 정답·풀이 화면이 비었거나 가로 넘침 또는 깨진 값이 있습니다.`);
    await screenshot(page, `legacy-${label}-solution.png`);
    if (createPdf) {
      await page.emulateMedia({ media: "print" });
      const pdf = path.join(outputDir, `legacy-${label}-solution-a4.pdf`);
      await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
      if (!fs.existsSync(pdf) || fs.statSync(pdf).size < 5000) fail(`기존 생성 문제 ${label}: A4 정답 PDF가 비정상입니다.`);
      else renderPdfPreview(pdf, path.join(outputDir, `legacy-${label}-solution-a4-page-1.png`));
      pdfs += 1;
    }
  } catch (error) {
    fail(`기존 생성 문제 ${label}: 화면 검사 실패 (${error.message})`);
    await screenshot(page, `legacy-${label}-failure.png`).catch(() => {});
  } finally {
    await page.close();
  }
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  staticPreflight();
  const { server, baseUrl } = await startReadOnlyServer();
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe",
    args: ["--disable-quic"]
  });
  try {
    let representativeLegacyType = "";
    for (const [semester, unit] of [["6-1", 1], ["6-1", 2], ["6-1", 3], ["6-1", 4], ["6-1", 5], ["6-1", 6], ["6-2", 1], ["6-2", 2], ["6-2", 3], ["6-2", 4], ["6-2", 5], ["6-2", 6]]) {
      const desktopLegacy = await inspectUnit(browser, baseUrl, semester, unit, { width: 1440, height: 900 }, "desktop");
      const mobileLegacy = await inspectUnit(browser, baseUrl, semester, unit, { width: 390, height: 844 }, "mobile");
      representativeLegacyType ||= desktopLegacy || mobileLegacy;
    }
    if (!representativeLegacyType) {
      fail("6학년 전체에서 실제로 열 수 있는 기존 생성 문제를 찾지 못했습니다.");
    } else {
      await inspectGeneratedWorksheet(browser, baseUrl, representativeLegacyType, { width: 1440, height: 900 }, "desktop", true);
      await inspectGeneratedWorksheet(browser, baseUrl, representativeLegacyType, { width: 390, height: 844 }, "mobile", false);
    }
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  const sourceTotal = findings.reduce((total, item) => total + (item.viewport === "desktop" ? item.sourceTypes : 0), 0);
  if (sourceTotal !== 633) fail(`PC 화면에서 확인한 원문 유형 합계가 ${sourceTotal}개입니다. 633개여야 합니다.`);
  fs.writeFileSync(detailPath, JSON.stringify({ sourceTotal, screenshots, pdfs, findings, failures }, null, 2), "utf8");
  const summary = `${failures.length ? "실패" : "통과"}: 6학년 원문 ${sourceTotal}/633유형, 화면 ${screenshots}장, A4 PDF ${pdfs}개\n${failures.join("\n")}\n`;
  fs.writeFileSync(summaryPath, summary, "utf8");
  if (failures.length) throw new Error(failures.join("\n"));
  console.log(`6학년 원문 세부 유형 브라우저 감사 통과: 633유형 중 생성 가능 148·잠금 485, 12단원 기존 생성 문제 선택·생성 확인, 화면 ${screenshots}장, A4 PDF ${pdfs}개`);
})().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
