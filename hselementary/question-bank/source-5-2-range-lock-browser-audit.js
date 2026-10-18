"use strict";

// Actual index bytes, fresh nonpersistent contexts, and no backend access.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { chromium } = require("playwright");
const repoRoot = path.resolve(__dirname, "..", "..");
const output = process.env.MAC_CHECK_OUTPUT || process.env.HSE_SCREENSHOT_DIR;
assert(output && path.isAbsolute(output), "An absolute private evidence directory is required");
fs.mkdirSync(output, { recursive: true });
const origin = "http://127.0.0.1:8909";
const base = `${origin}/hselementary/question-bank/`;
// Representative legacy locks; exact preservation of all 124 is checked by the classification audit.
const ids = ["5-2-u1-t1", "5-2-u2-t1", "5-2-u3-t1", "5-2-u4-t1", "5-2-u5-t1"];
const assets = ["index.html", "curriculum.js", "generators.js", "app.js"];
const hashes = () => Object.fromEntries(assets.map(file => [file, crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname, file))).digest("hex")]));
const before = hashes();
const result = { status: "running", freshContexts: 0, lockStates: [], regression: [], externalBlocked: {}, localMissing: [], assetHashes: before };

async function isolatedPage(browser, width) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, serviceWorkers: "block" });
  result.freshContexts++;
  // Read-only file routing provides the unmodified product files, even without a preload.
  await context.route("**/*", async route => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) {
      result.externalBlocked[url.origin + url.pathname] = (result.externalBlocked[url.origin + url.pathname] || 0) + 1;
      return route.fulfill({ status: 200, contentType: "text/plain", body: "" });
    }
    const file = path.resolve(repoRoot, "." + decodeURIComponent(url.pathname) + (url.pathname.endsWith("/") ? "index.html" : ""));
    const relative = path.relative(repoRoot, file);
    if (relative.startsWith("..") || path.isAbsolute(relative)) return route.fulfill({ status: 403, body: "Outside fixture root" });
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
      result.localMissing.push(url.pathname);
      return route.fulfill({ status: 404, body: "Missing local file" });
    }
    const contentType = ({ ".html": "text/html; charset=utf-8", ".js": "application/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2" })[path.extname(file)] || "application/octet-stream";
    return route.fulfill({ contentType, body: fs.readFileSync(file) });
  });
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  return { context, page, errors };
}

async function inspectLocked(browser, id, width) {
  const { context, page, errors } = await isolatedPage(browser, width);
  try {
    await page.goto(`${base}?type=${id}&review=1`, { waitUntil: "domcontentloaded" });
    await page.locator("#typeList .tree-type").first().waitFor();
    assert.equal(await page.locator("#worksheet").evaluate(node => node.hidden), true, "Locked direct URL must not open a worksheet");
    assert.equal(await page.locator("#problemView .question-item").count(), 0);
    await page.locator('#gradeFilter [data-grade="5"]').click();
    await page.locator('#termFilter [data-term="2"]').click();
    await page.locator("#unitFilter").selectOption(id.split("-t")[0]);
    const row = page.locator(`[data-preview-type-id="${id}"]`);
    assert.equal(await row.count(), 1);
    assert.equal(await row.locator("input").isDisabled(), true);
    await row.scrollIntoViewIfNeeded();
    await row.locator(".tree-type-copy").click();
    const preview = page.locator("#typePreviewPopover");
    await preview.waitFor({ state: "visible" });
    const state = await page.evaluate(id => {
      const type = window.HSE_CURRICULUM.semesters.flatMap(s => s.units.flatMap(u => u.subunits.flatMap(g => g.types))).find(t => t.id === id);
      const popover = document.querySelector("#typePreviewPopover");
      const box = popover.getBoundingClientRect();
      return { id, text: popover.innerText, previewQuestions: popover.querySelectorAll(".type-preview-question").length, questionCount: document.querySelectorAll("#problemView .question-item").length, selectedCount: document.querySelector("#selectedTypeCount").textContent, locked: type.reviewLocked, verified: type.sourceVerified, key: window.HSE_GENERATORS.generatorKey(type), generated: window.HSE_GENERATORS.generate(type, 0, 0, 1, 0), overflow: document.documentElement.scrollWidth > innerWidth + 1, popoverBounds: { left: box.left, right: box.right, top: box.top, bottom: box.bottom }, localStorageKeys: Object.keys(localStorage), sessionStorageKeys: Object.keys(sessionStorage) };
    }, id);
    assert.match(state.text, /검수 대기/);
    assert.match(state.text, /원본의 개별 문항/);
    assert.equal(state.previewQuestions, 0);
    assert.equal(state.questionCount, 0);
    assert.equal(parseInt(state.selectedCount, 10), 0);
    assert.equal(state.locked, true);
    assert.equal(state.verified, false);
    assert.equal(state.key, "");
    assert.equal(state.generated, null);
    assert.equal(state.overflow, false);
    assert(state.popoverBounds.left >= -1 && state.popoverBounds.right <= width + 1, "Lock reason must fit the viewport");
    assert.deepEqual(errors, []);
    const screenshot = `${id}-${width}-locked.png`;
    await page.screenshot({ path: path.join(output, screenshot), fullPage: true });
    result.lockStates.push({ ...state, width, screenshot });
  } finally { await context.close(); }
}

async function inspectExisting(browser, width) {
  const id = "6-2-u3-e1-exploration";
  const { context, page, errors } = await isolatedPage(browser, width);
  try {
    await page.goto(`${base}?type=${id}&review=1&difficulty=0`, { waitUntil: "domcontentloaded" });
    await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
    const problems = await page.locator("#problemView .question-item").count();
    assert.equal(problems, 3, "Existing fixed pool still generates three questions");
    await page.locator("#solutionTab").click();
    const solutions = await page.locator("#solutionView .solution-item").count();
    assert.equal(solutions, 3);
    const state = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth + 1, invalid: /undefined|null|NaN|Infinity/.test(document.querySelector("#solutionView").innerText), answerFigures: document.querySelectorAll("#solutionView svg, #solutionView img").length }));
    assert.equal(state.overflow, false);
    assert.equal(state.invalid, false);
    assert(state.answerFigures >= 3, "Existing answer figures remain available");
    assert.deepEqual(errors, []);
    const screenshot = `${id}-${width}-regression.png`;
    await page.screenshot({ path: path.join(output, screenshot), fullPage: true });
    result.regression.push({ id, width, problems, solutions, ...state, screenshot });
  } finally { await context.close(); }
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  try {
    for (const id of ids) for (const width of [1280, 375, 320]) await inspectLocked(browser, id, width);
    for (const width of [1280, 375]) await inspectExisting(browser, width);
    assert.equal(result.lockStates.length, 15);
    assert.equal(result.freshContexts, 17);
    assert.deepEqual(result.localMissing, []);
    assert.deepEqual(hashes(), before, "Product assets changed during audit; rerun final files");
    result.status = "passed";
    console.log("5-2 lock browser audit passed: 15 legacy locked direct-URL states; 2 existing Grade 6 regressions; 17 fresh contexts; no live backend access.");
  } finally {
    await browser.close();
    fs.writeFileSync(path.join(output, "lock-browser-audit.json"), JSON.stringify(result, null, 2) + "\n");
  }
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
