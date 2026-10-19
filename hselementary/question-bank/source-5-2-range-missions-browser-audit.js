"use strict";

// Real local index bytes, isolated browser contexts, private output directory.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const repo = path.resolve(__dirname, "../..");
const output = process.env.MAC_CHECK_OUTPUT;
assert(output && path.isAbsolute(output) && path.relative(repo, output).startsWith(".."), "Use a private absolute evidence directory");
const origin = "http://127.0.0.1:8909";
const base = `${origin}/hselementary/question-bank/`;
const ids = Array.from({ length: 6 }, (_, i) => `5-2-u1-e1-mission-${i + 1}`);
const widths = [1280, 375, 320], difficulties = [-1, 0, 1];
const selectors = { problem: "#problemView", solution: "#solutionView", "answer-key": "#answerKeyView" };
const coreFiles = ["index.html", "curriculum.js", "generators.js", "app.js", "styles.css", "source-5-2-range-missions.js", "source-5-2-range-missions.css"];
const digest = value => crypto.createHash("sha256").update(value).digest("hex");
const hashes = () => Object.fromEntries(coreFiles.map(file => [file, digest(fs.readFileSync(path.join(__dirname, file)))]));
const served = new Map();
const result = { status: "running", states: [], pdfs: [], screenshots: [], mixed: [], regression: [], negativeControls: [], pageErrors: [], localMissing: [], externalBlocked: {}, freshContexts: 0 };

async function isolatedPage(browser, width) {
  const context = await browser.newContext({ viewport: { width, height: 1000 }, deviceScaleFactor: 1, serviceWorkers: "block" });
  result.freshContexts++;
  await context.route("**/*", route => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) { result.externalBlocked[url.origin] = (result.externalBlocked[url.origin] || 0) + 1; return route.fulfill({ status: 200, contentType: "text/plain", body: "" }); }
    const file = path.resolve(repo, `.${decodeURIComponent(url.pathname)}${url.pathname.endsWith("/") ? "index.html" : ""}`);
    const relative = path.relative(repo, file);
    if (relative.startsWith("..") || path.isAbsolute(relative)) return route.fulfill({ status: 403, body: "outside fixture" });
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { result.localMissing.push(url.pathname); return route.fulfill({ status: 404, body: "missing" }); }
    const realRelative = path.relative(repo, fs.realpathSync(file));
    if (realRelative.startsWith("..") || path.isAbsolute(realRelative)) return route.fulfill({ status: 403, body: "outside fixture" });
    const body = fs.readFileSync(file), hash = digest(body);
    if (served.has(file)) assert.equal(hash, served.get(file), `Fixture changed: ${relative}`);
    served.set(file, hash);
    const contentType = ({ ".html": "text/html; charset=utf-8", ".js": "application/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".woff2": "font/woff2" })[path.extname(file)] || "application/octet-stream";
    return route.fulfill({ contentType, body });
  });
  const page = await context.newPage(), errors = [];
  page.setDefaultTimeout(30000);
  page.on("pageerror", error => { errors.push(error.message); result.pageErrors.push(error.message); });
  await page.addInitScript(() => { window.__auditPrintCalls = 0; window.print = () => window.__auditPrintCalls++; });
  return { context, page, errors };
}

async function rendered(page, expected, difficulty) {
  const questions = await page.locator("#problemView .question-item").evaluateAll((items, args) => {
    const norm = s => String(s).replace(/\s+/g, " ").trim();
    const plain = s => { const e = document.createElement("div"); e.innerHTML = s; return norm(e.textContent); };
    return items.map(item => {
      const marker = item.querySelector(".source52-mission-question");
      if (!marker) return { error: "missing marker" };
      const id = marker.dataset.sourceItem, variant = Number(marker.dataset.poolIndex);
      const q = window.HSE_SOURCE_52_RANGE_MISSIONS.getQuestion(id, variant, args.difficulty);
      const type = window.HSE_CURRICULUM.semesters.flatMap(s => s.units.flatMap(u => u.subunits.flatMap(g => g.types))).find(t => t.id === id);
      const registered = window.HSE_GENERATORS.generate(type, 1, args.difficulty, 1, variant);
      return { id, variant, offset: Number(marker.dataset.difficultyOffset), answer: norm(q.answer), solution: plain(q.solution),
        prompt: norm(marker.textContent), correctPrompt: norm(marker.textContent) === plain(q.prompt),
        registered: Boolean(registered && registered.sourceItemId === id && registered.verifiedPoolIndex === variant),
        poolCount: q.verifiedVariantCount, mode: q.generationMode, cardCount: marker.querySelectorAll(".source52-mission-card").length };
    });
  }, { difficulty });
  assert.equal(questions.length, expected.length * 3);
  assert.equal(new Set(questions.map(q => q.prompt)).size, questions.length, "Duplicate student prompts");
  for (const id of expected) {
    const owned = questions.filter(q => q.id === id);
    assert.deepEqual(owned.map(q => q.variant).sort(), [0, 1, 2]);
    for (const q of owned) {
      assert(q.registered && q.correctPrompt && q.offset === difficulty && q.poolCount === 3 && q.mode === "fixed-verified-pool");
      assert.equal(q.cardCount, id.endsWith("mission-4") ? 6 : 0);
    }
  }
  return questions;
}

async function inspect(page, mode, questions, printing = false) {
  const report = await page.locator(selectors[mode]).evaluate((root, args) => {
    const issues = [], norm = s => String(s).replace(/\s+/g, " ").trim();
    const visible = e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && getComputedStyle(e).visibility !== "hidden"; };
    if (root.hidden || !visible(root)) issues.push("active view hidden");
    if (!args.printing && document.documentElement.scrollWidth > innerWidth + 1) issues.push("viewport overflow");
    const invalid = root.innerText.match(/undefined|null|NaN|Infinity|\$\{|교집합|합집합|포함.?배제|부등식|정의역|치역|순열|조합|\bfloor\b|\bceil\b/);
    if (invalid) issues.push(`broken or advanced wording: ${invalid[0]}`);
    const items = [...root.querySelectorAll(args.mode === "problem" ? ".question-item" : args.mode === "solution" ? ".solution-item" : ".answer-key-grid > div")];
    if (items.length !== args.questions.length) issues.push("wrong item count");
    items.forEach((item, i) => {
      const q = args.questions[i]; if (!q) return;
      const b = item.getBoundingClientRect(), p = (item.closest(".print-page,.answer-key-page") || root).getBoundingClientRect();
      if (b.width <= 0 || b.height <= 0 || b.left < p.left - 1.5 || b.right > p.right + 1.5 || item.scrollWidth > item.clientWidth + 2) issues.push(`item ${i + 1} clipped`);
      if (args.printing && (b.top < p.top - 1.5 || b.bottom > p.bottom + 1.5)) issues.push(`item ${i + 1} print boundary`);
      if (args.mode === "problem") {
        const content = item.querySelector(".source52-mission-question");
        if (!content || norm(content.textContent) !== q.prompt || item.querySelector(".source52-mission-solution")) issues.push(`item ${i + 1} problem mismatch or solution leak`);
        if (content && parseFloat(getComputedStyle(content).fontSize) < (args.printing ? 10 : 12)) issues.push(`item ${i + 1} small type`);
      } else if (args.mode === "solution") {
        const content = item.querySelector(".source52-mission-solution");
        if (norm(item.querySelector("header strong")?.textContent) !== q.answer || !content || norm(content.textContent) !== q.solution) issues.push(`item ${i + 1} solution mismatch`);
        if (content && parseFloat(getComputedStyle(content).fontSize) < (args.printing ? 10 : 12)) issues.push(`item ${i + 1} small type`);
      } else if (norm(item.querySelector("span")?.textContent) !== q.answer) issues.push(`item ${i + 1} answer mismatch`);
    });
    if (args.mode === "problem" && root.querySelector("[data-phase=answer],.source52-mission-solution")) issues.push("solution in problem view");
    if (args.printing) [...root.querySelectorAll(".print-page,.answer-key-page")].forEach((sheet, i) => {
      const b = sheet.getBoundingClientRect();
      if (b.width > 210 * 96 / 25.4 + 2 || b.height > 297 * 96 / 25.4 + 2) issues.push(`sheet ${i + 1} oversized`);
    });
    return { issues: [...new Set(issues)], items: items.length, layoutPages: root.querySelectorAll(".print-page,.answer-key-page").length,
      localStorageKeys: Object.keys(localStorage), sessionStorageKeys: Object.keys(sessionStorage) };
  }, { mode, questions, printing });
  assert.deepEqual(report.issues, [], `${mode}: ${JSON.stringify(report.issues)}`);
  assert.deepEqual(report.localStorageKeys, []); assert.deepEqual(report.sessionStorageKeys, []);
  return report;
}

async function printView(page, mode, questions, stem, savePDF) {
  await page.evaluate(() => { dispatchEvent(new Event("afterprint")); window.__auditPrintCalls = 0; });
  await page.locator("#printMenuButton").click();
  await page.locator(`button[data-print-mode="${mode}"]`).click();
  await page.waitForFunction(() => window.__auditPrintCalls === 1);
  await inspect(page, mode, questions);
  if (savePDF) {
    const viewport = page.viewportSize();
    await page.setViewportSize({ width: Math.ceil(210 * 96 / 25.4), height: Math.ceil(297 * 96 / 25.4) });
    await page.emulateMedia({ media: "print" });
    const layout = await inspect(page, mode, questions, true);
    const file = `${stem}-${mode}.pdf`, target = path.join(output, file);
    await page.pdf({ path: target, format: "A4", preferCSSPageSize: true, printBackground: true });
    const data = fs.readFileSync(target), latin = data.toString("latin1");
    const pages = (latin.match(/\/Type\s*\/Page\b/g) || []).length;
    const boxes = [...latin.matchAll(/\/MediaBox\s*\[\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\]/g)];
    assert(data.length > 3000 && pages > 0 && pages === layout.layoutPages, `${file}: unexpected PDF pages`);
    assert(boxes.length && boxes.every(b => Math.abs(Number(b[3]) - Number(b[1]) - 595.28) < 2 && Math.abs(Number(b[4]) - Number(b[2]) - 841.89) < 2), `${file}: not A4`);
    result.pdfs.push({ file, mode, pages, bytes: data.length, sha256: digest(data) });
    await page.emulateMedia({ media: "screen" });
    await page.setViewportSize(viewport);
  }
  await page.evaluate(() => dispatchEvent(new Event("afterprint")));
}

async function single(browser, id, difficulty, width) {
  const { context, page, errors } = await isolatedPage(browser, width);
  const stem = `${id}-d${difficulty + 1}-w${width}`;
  try {
    await page.goto(`${base}?type=${id}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded" });
    await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
    await page.evaluate(() => document.fonts.ready);
    const questions = await rendered(page, [id], difficulty);
    const problem = await inspect(page, "problem", questions);
    if (id === ids[0] && difficulty === -1 && width === 1280) {
      await page.locator("#problemView .source52-mission-question").first().evaluate(e => e.insertAdjacentHTML("beforeend", '<span class="source52-mission-solution" data-negative="1">leak</span>'));
      await assert.rejects(inspect(page, "problem", questions), /solution leak/);
      await page.locator('[data-negative="1"]').evaluate(e => e.remove());
      result.negativeControls.push("student solution leak rejected");
      await inspect(page, "problem", questions);
    }
    if (width === 375 && difficulty === 0) {
      const file = `${stem}-problem.png`;
      await page.locator(selectors.problem).screenshot({ path: path.join(output, file) });
      assert(fs.statSync(path.join(output, file)).size > 2000);
      result.screenshots.push(file);
    }
    if (width === 1280) await printView(page, "problem", questions, stem, true);
    await page.locator("#solutionTab").click();
    const solution = await inspect(page, "solution", questions);
    if (width === 375 && difficulty === 0) {
      const file = `${stem}-solution.png`;
      await page.locator(selectors.solution).screenshot({ path: path.join(output, file) });
      assert(fs.statSync(path.join(output, file)).size > 2000);
      result.screenshots.push(file);
    }
    if (width === 1280) await printView(page, "solution", questions, stem, true);
    await printView(page, "answer-key", questions, stem, width === 1280);
    await page.locator("#backButton").click();
    await page.locator("#questionCountInput").fill("120");
    assert.equal(await page.locator("#selectedQuestionCount").textContent(), "3");
    await page.locator("#generateButton").click();
    await rendered(page, [id], difficulty);
    assert.deepEqual(errors, []);
    result.states.push({ id, difficulty, width, variants: questions.map(q => q.variant), problem, solution });
  } finally { await context.close(); }
}

async function mixed(browser, width) {
  const { context, page, errors } = await isolatedPage(browser, width);
  try {
    await page.goto(base, { waitUntil: "domcontentloaded" });
    await page.locator('#gradeFilter [data-grade="5"]').click();
    await page.locator('#termFilter [data-term="2"]').click();
    await page.locator("#unitFilter").selectOption("5-2-u1");
    for (const id of ids) {
      const row = page.locator(`[data-preview-type-id="${id}"]`);
      assert.equal(await row.locator("input").isDisabled(), false);
      await row.locator(".tree-type-copy").click();
      await page.locator("#typePreviewPopover").waitFor({ state: "visible" });
      assert.equal(await page.locator("#typePreviewPopover .source52-mission-question").getAttribute("data-source-item"), id);
      await page.locator("[data-close-type-preview]").click();
      await row.locator("input").check();
    }
    await page.locator("#questionCountInput").fill("120");
    assert.equal(await page.locator("#selectedTypeCount").textContent(), "6");
    assert.equal(await page.locator("#selectedQuestionCount").textContent(), "18");
    await page.locator("#generateButton").click();
    const questions = await rendered(page, ids, 0);
    await inspect(page, "problem", questions);
    await page.locator("#solutionTab").click();
    await inspect(page, "solution", questions);
    await printView(page, "answer-key", questions, `mixed-w${width}`, false);
    assert.deepEqual(errors, []);
    result.mixed.push({ width, count: questions.length });
  } finally { await context.close(); }
}

async function regression(browser, width) {
  const { context, page, errors } = await isolatedPage(browser, width);
  try {
    for (const id of ["5-2-u1-e1-exploration", "6-2-u3-e1-exploration"]) {
      await page.goto(`${base}?type=${id}&review=1&difficulty=0`, { waitUntil: "domcontentloaded" });
      await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
      assert.equal(await page.locator("#problemView .question-item").count(), 3);
      await page.locator("#solutionTab").click();
      assert.equal(await page.locator("#solutionView .solution-item").count(), 3);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      result.regression.push({ id, width });
    }
    assert.deepEqual(errors, []);
  } finally { await context.close(); }
}

async function run() {
  fs.mkdirSync(output, { recursive: true });
  result.assetHashes = hashes();
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  try {
    for (const id of ids) for (const difficulty of difficulties) for (const width of widths) await single(browser, id, difficulty, width);
    for (const width of widths) await mixed(browser, width);
    for (const width of [1280, 375]) await regression(browser, width);
    assert.equal(result.states.length, 54); assert.equal(result.pdfs.length, 54);
    assert.equal(result.mixed.length, 3); assert.equal(result.regression.length, 4);
    assert.equal(result.negativeControls.length, 1);
    assert.deepEqual(result.pageErrors, []); assert.deepEqual(result.localMissing, []);
    assert.deepEqual(hashes(), result.assetHashes);
    for (const [file, hash] of served) assert.equal(digest(fs.readFileSync(file)), hash, `Served asset changed: ${file}`);
    result.servedAssetCount = served.size;
    result.status = "passed";
    console.log(JSON.stringify({ status: result.status, states: result.states.length, pdfs: result.pdfs.length, pdfPages: result.pdfs.reduce((n, p) => n + p.pages, 0), mixed: result.mixed.length, regression: result.regression.length }));
  } catch (error) { result.status = "failed"; result.error = error.stack || String(error); throw error; }
  finally { await browser.close(); fs.writeFileSync(path.join(output, "browser-audit.json"), JSON.stringify(result, null, 2) + "\n"); }
}
if (require.main === module) run().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
module.exports = { run };
