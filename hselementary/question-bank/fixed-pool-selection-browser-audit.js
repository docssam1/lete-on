"use strict";

// Browser regression audit for per-type fixed-pool selection in the worksheet UI.
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH
  || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const questionBankDir = __dirname;
const repoRoot = path.resolve(questionBankDir, "..", "..");
const indexPath = path.join(questionBankDir, "index.html");
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(os.tmpdir(), "fixed-pool-selection-browser-audit");
const targetTypeIds = ["4-2-u4-t3", "4-2-u4-t3-2", "4-2-u4-t3-3"];
const failures = [];
let screenshots = 0;

function fail(message) {
  failures.push(message);
}

function contentType(file) {
  return ({
    ".css": "text/css", ".html": "text/html", ".js": "application/javascript",
    ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png"
  })[path.extname(file)] || "application/octet-stream";
}

function startReadOnlyServer() {
  const server = http.createServer((request, response) => {
    const relative = decodeURIComponent((request.url || "/").split("?")[0]).replace(/^\/+/, "");
    let file = path.resolve(repoRoot, relative || "index.html");
    if (file.startsWith(repoRoot + path.sep) && fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!file.startsWith(repoRoot + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }
    response.writeHead(200, { "Content-Type": `${contentType(file)}; charset=utf-8`, "Cache-Control": "no-store" });
    fs.createReadStream(file).pipe(response);
  });
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve({ server, baseUrl: `http://127.0.0.1:${server.address().port}/hselementary/question-bank/` }));
  });
}

function staticPreflight() {
  const indexText = fs.readFileSync(indexPath, "utf8");
  const requiredScripts = [
    "./source-inventory-4-2-quadrilateral.js",
    "./curriculum.js",
    "./generators.js",
    "./source-4-2-parallel-angle.js",
    "./source-4-2-parallel-angle-chain-one.js"
  ];
  let previousIndex = -1;
  for (const script of requiredScripts) {
    const scriptIndex = indexText.indexOf(script);
    if (scriptIndex < 0) fail(`${script}가 index.html에 없습니다.`);
    if (scriptIndex <= previousIndex) fail(`생성기 로드 순서가 잘못되었습니다: ${script}`);
    previousIndex = scriptIndex;
  }
  for (const file of requiredScripts) {
    if (!fs.existsSync(path.join(questionBankDir, file.slice(2)))) fail(`${file} 파일이 없습니다.`);
  }
  const appText = fs.readFileSync(path.join(questionBankDir, "app.js"), "utf8");
  if (!appText.includes("typePoolIndices.size + attempt")) fail("app.js에 유형별 fixed-pool variant 선택이 없습니다.");
  if (!appText.includes("fallbackVariant")) fail("app.js에 fixed-pool fallback variant가 없습니다.");
}

function attachRuntimeListeners(page, label) {
  page.on("pageerror", error => fail(`${label}: 브라우저 예외 ${error.message}`));
  page.on("console", message => {
    if (message.type() === "error" && !/Failed to load resource.*(?:404|ERR_[A-Z_]+)/.test(message.text())) {
      fail(`${label}: 콘솔 오류 ${message.text()}`);
    }
  });
}

async function screenshot(page, name) {
  await page.screenshot({ path: path.join(outputDir, name), fullPage: true, timeout: 120000 });
  screenshots += 1;
}

async function selectTargetTypes(page) {
  await page.goto(`${page.__auditBaseUrl}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#gradeFilter [data-grade='4']").click();
  await page.locator("#termFilter [data-term='2']").click();
  await page.locator("#unitFilter").selectOption("4-2-u4");
  for (const typeId of targetTypeIds) {
    await page.locator(`#typeList input[data-type-id='${typeId}']`).check();
  }
}

function validateWorksheet(state, label) {
  if (!state.worksheetVisible || state.questions !== 9) fail(`${label}: 9문항 worksheet가 열리지 않았습니다.`);
  if (state.typeCount !== 3) fail(`${label}: 선택 유형 수가 3개가 아닙니다.`);
  if (state.records.some(record => !record.source || !Number.isInteger(record.pool))) fail(`${label}: 원문 ID 또는 pool index가 누락되었습니다.`);
  const grouped = new Map();
  state.records.forEach(record => grouped.set(record.source, [...(grouped.get(record.source) || []), record.pool]));
  if (grouped.size !== 3 || [...grouped.values()].some(pools => pools.length !== 3 || new Set(pools).size !== 3 || [...new Set(pools)].sort((a, b) => a - b).join(",") !== "0,1,2")) {
    fail(`${label}: 유형별 고정풀 3개가 고유하지 않습니다: ${JSON.stringify([...grouped])}`);
  }
  if (state.overflow || state.broken) fail(`${label}: 화면에 가로 넘침 또는 깨진 값이 있습니다.`);
}

async function readWorksheet(page) {
  return page.evaluate(() => {
    const compact = value => String(value || "").replace(/\s+/g, " ").trim();
    const records = [...document.querySelectorAll("#problemView .question-item")].map(item => {
      const marker = item.querySelector("[data-source-item][data-pool-index]");
      return { source: marker?.getAttribute("data-source-item") || "", pool: Number(marker?.getAttribute("data-pool-index")) };
    });
    return {
      worksheetVisible: !document.querySelector("#worksheet")?.hidden,
      questions: records.length,
      records,
      typeCount: Number.parseInt(document.querySelector("#selectedTypeCount")?.textContent || "0", 10),
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      broken: /undefined|null|NaN|Infinity|SyntaxError/.test(document.body.innerText),
      meta: compact(document.querySelector("#worksheetMeta")?.textContent)
    };
  });
}

async function inspectViewport(browser, baseUrl, viewport, label) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.__auditBaseUrl = baseUrl;
  page.setDefaultTimeout(60000);
  attachRuntimeListeners(page, label);
  try {
    await selectTargetTypes(page);
    await page.locator("#questionCountInput").fill("40");
    const cap = await page.evaluate(() => ({ requested: document.querySelector("#questionCountInput")?.value, planned: document.querySelector("#selectedQuestionCount")?.textContent }));
    if (cap.requested !== "40" || cap.planned !== "9") fail(`${label}: fixed-pool 용량 초과 cap이 9문항이 아닙니다 (${JSON.stringify(cap)}).`);
    await page.locator("#questionCountInput").fill("9");
    await page.locator("#generateButton").click();
    await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible", timeout: 20000 });
    const first = await readWorksheet(page);
    validateWorksheet(first, `${label} 최초 생성`);
    await screenshot(page, `${label}-generated.png`);
    await page.locator("#newProblemButton").click();
    await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible", timeout: 20000 });
    const regenerated = await readWorksheet(page);
    validateWorksheet(regenerated, `${label} 새 문제`);
    await screenshot(page, `${label}-regenerated.png`);
  } catch (error) {
    fail(`${label}: 화면 검사 실패 (${error.message})`);
    await screenshot(page, `${label}-failure.png`).catch(() => {});
  } finally {
    await page.close();
  }
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  staticPreflight();
  global.window = {};
  const inventory = require("./source-inventory-4-2-quadrilateral.js");
  require("./curriculum.js");
  require("./generators.js");
  require("./source-4-2-parallel-angle.js");
  require("./source-4-2-parallel-angle-chain-one.js");
  const allTypes = window.HSE_CURRICULUM.semesters.flatMap(semester => (semester.units || []).flatMap(unit => (unit.subunits || []).flatMap(subunit => subunit.types || [])));
  const targetTypes = targetTypeIds.map(id => allTypes.find(type => type.id === id));
  if (targetTypes.some(type => !type || type.generationMode !== "fixed-verified-pool" || type.reviewLocked)) fail("브라우저 회귀 대상 3유형이 모두 공개 fixed-verified-pool이 아닙니다.");
  if (targetTypes.some(type => !inventory.items.some(item => item.sourceItemId === type.sourceItemId && item.implementationStatus === "ready"))) fail("대상 유형이 사각형 source inventory의 ready 항목과 연결되지 않았습니다.");
  const { server, baseUrl } = await startReadOnlyServer();
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--disable-quic"] });
  try {
    await inspectViewport(browser, baseUrl, { width: 1440, height: 900 }, "desktop");
    await inspectViewport(browser, baseUrl, { width: 390, height: 844 }, "mobile");
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  const result = { targetTypeIds, screenshots, failures };
  fs.writeFileSync(path.join(outputDir, "audit-result.json"), JSON.stringify(result, null, 2), "utf8");
  if (failures.length) throw new Error(failures.join("\n"));
  console.log(`fixed-pool selection browser audit passed: 3 types x 3 unique pools, cap 9, regeneration clean, ${screenshots} screenshots at ${outputDir}`);
})().catch(error => {
  console.error(`fixed-pool selection browser audit failed\n${error.stack || error}`);
  process.exit(1);
});
