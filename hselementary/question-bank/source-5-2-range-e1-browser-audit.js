"use strict";

// Run against unchanged index bytes in fresh browser contexts. All nonlocal
// requests are intercepted, and evidence must stay outside this repository.
// Before a PDF-producing run, invoke the PDF skill's artifact-operation marker.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");

const repo = path.resolve(__dirname, "../..");
const output = process.env.MAC_CHECK_OUTPUT || process.env.HSE_SCREENSHOT_DIR;
assert(output && path.isAbsolute(output), "Set an absolute private evidence directory");
const outputRelative = path.relative(repo, path.resolve(output));
assert(outputRelative.startsWith("..") || path.isAbsolute(outputRelative), "Evidence must be outside the repository");
const createPDF = process.env.HSE_CREATE_PDF !== "0";
const origin = "http://127.0.0.1:8909";
const base = `${origin}/hselementary/question-bank/`;
const ids = ["exploration", "example-1-1", "example-1-2", "example-1-3", "example-1-4"].map(suffix => `5-2-u1-e1-${suffix}`);
const widths = [1280, 375, 320];
const difficulties = [-1, 0, 1];
const selectors = { problem: "#problemView", solution: "#solutionView", "answer-key": "#answerKeyView" };
const coreFiles = ["index.html", "curriculum.js", "generators.js", "app.js", "styles.css", "source-5-2-range-e1.js", "source-5-2-range-e1.css"];
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const hashes = () => Object.fromEntries(coreFiles.map(file => [file, sha(fs.readFileSync(path.join(__dirname, file)))]));
const servedHashes = new Map();
const result = {
  status: "running", actualHttpTested: false, liveExternalRequests: 0,
  existingBrowserProfilesUsed: false, freshContexts: 0, states: [], mixed: [], regression: [], previews: [],
  pdfs: [], screenshots: [], negativeControls: [], localMissing: [], externalBlocked: {}, pageErrors: []
};

async function isolatedPage(browser, width) {
  const context = await browser.newContext({ viewport: { width, height: 1000 }, deviceScaleFactor: 1, serviceWorkers: "block" });
  result.freshContexts++;
  await context.route("**/*", async route => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) {
      const key = `${url.origin}${url.pathname}`;
      result.externalBlocked[key] = (result.externalBlocked[key] || 0) + 1;
      return route.fulfill({ status: 200, contentType: "text/plain", body: "" });
    }
    const file = path.resolve(repo, `.${decodeURIComponent(url.pathname)}${url.pathname.endsWith("/") ? "index.html" : ""}`);
    const relative = path.relative(repo, file);
    if (relative.startsWith("..") || path.isAbsolute(relative)) return route.fulfill({ status: 403, body: "Outside fixture root" });
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
      result.localMissing.push(url.pathname);
      return route.fulfill({ status: 404, body: "Missing local fixture" });
    }
    const realRelative = path.relative(repo, fs.realpathSync(file));
    if (realRelative.startsWith("..") || path.isAbsolute(realRelative)) return route.fulfill({ status: 403, body: "Outside fixture root" });
    const body = fs.readFileSync(file), digest = sha(body);
    if (servedHashes.has(file)) assert.equal(digest, servedHashes.get(file), `Fixture changed while reading ${relative}`);
    servedHashes.set(file, digest);
    const contentType = ({ ".html": "text/html; charset=utf-8", ".js": "application/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".woff2": "font/woff2" })[path.extname(file)] || "application/octet-stream";
    return route.fulfill({ contentType, body });
  });
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  const errors = [], dialogs = [];
  page.on("pageerror", error => { errors.push(error.message); result.pageErrors.push(error.message); });
  page.on("dialog", async dialog => { dialogs.push(dialog.message()); await dialog.dismiss(); });
  await page.addInitScript(() => { window.__auditPrintCalls = 0; window.print = () => { window.__auditPrintCalls++; }; });
  return { context, page, errors, dialogs };
}

async function loaded(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.querySelectorAll("#worksheet img,#typePreviewPopover img,#solutionViewer img")].map(image => image.decode()));
  });
}

async function renderedQuestions(page, expectedIds, difficulty) {
  const questions = await page.locator("#problemView .question-item").evaluateAll((items, args) => {
    const normalize = text => String(text).replace(/\s+/g, " ").trim();
    const textOf = html => { const element = document.createElement("div"); element.innerHTML = html; return normalize(element.textContent); };
    return items.map(item => {
      const marker = item.querySelector(".source52-range-question");
      if (!marker) return { error: "Missing source marker" };
      const id = marker.dataset.sourceItem, variant = Number(marker.dataset.poolIndex);
      const q = window.HSE_SOURCE_52_RANGE_E1.getQuestion(id, variant, args.difficulty);
      const type = window.HSE_CURRICULUM.semesters.flatMap(s => s.units.flatMap(u => u.subunits.flatMap(g => g.types))).find(t => t.id === id);
      const registered = window.HSE_GENERATORS.generate(type, 1, args.difficulty, 1, variant);
      return {
        id, variant, number: Number(item.querySelector("header b").textContent),
        offset: Number(marker.dataset.difficultyOffset), model: q.questionModel, answerModel: q.answerModel,
        answer: normalize(q.answer), solutionText: textOf(q.solution),
        correctPrompt: normalize(marker.textContent) === textOf(q.prompt),
        registered: Boolean(registered && registered.sourceItemId === id && registered.verifiedPoolIndex === variant),
        text: normalize(marker.textContent), visualRequired: q.answerVisualRequired, poolCount: q.verifiedVariantCount,
        mode: q.generationMode
      };
    });
  }, { difficulty });
  assert.equal(questions.length, expectedIds.length * 3, "Every selected type must contribute three questions");
  assert.equal(new Set(questions.map(q => q.text)).size, questions.length, "A worksheet must have no repeated prompts");
  for (const id of expectedIds) {
    const owned = questions.filter(q => q.id === id);
    assert.deepEqual(owned.map(q => q.variant).sort(), [0, 1, 2], `${id}: use each finite variant exactly once`);
    for (const q of owned) {
      assert(q.registered && q.correctPrompt, `${id}: actual index output differs from registered generator`);
      assert.equal(q.offset, difficulty);
      assert.equal(q.poolCount, 3);
      assert.equal(q.mode, "fixed-verified-pool");
    }
  }
  return questions;
}

async function inspectView(page, mode, questions, printing = false) {
  const report = await page.locator(selectors[mode]).evaluate((root, args) => {
    const issues = [], normalize = text => String(text).replace(/\s+/g, " ").trim();
    const visible = element => { const b = element.getBoundingClientRect(); return b.width > 0 && b.height > 0 && getComputedStyle(element).visibility !== "hidden"; };
    const inspectBox = (element, boundary, label) => {
      const b = element.getBoundingClientRect(), p = boundary.getBoundingClientRect();
      if (b.width <= 0 || b.height <= 0) issues.push(`${label}: empty`);
      if (b.left < p.left - 1.5 || b.right > p.right + 1.5 || element.scrollWidth > element.clientWidth + 2) issues.push(`${label}: horizontal clipping`);
      if (args.printing && (b.top < p.top - 1.5 || b.bottom > p.bottom + 1.5)) issues.push(`${label}: print boundary`);
    };
    if (root.hidden || !visible(root)) issues.push("Active view is hidden");
    if (!args.printing && document.documentElement.scrollWidth > innerWidth + 1) issues.push("Viewport overflow");
    const text = root.innerText;
    if (/undefined|null|NaN|Infinity|\$\{|교집합|합집합|포함.?배제|부등식|정의역|치역|순열|조합|\bfloor\b|\bceil\b/.test(text)) issues.push("Broken value or unexplained advanced terminology");
    const itemSelector = args.mode === "problem" ? ".question-item" : args.mode === "solution" ? ".solution-item" : ".answer-key-grid > div";
    const items = [...root.querySelectorAll(itemSelector)];
    if (items.length !== args.questions.length) issues.push("Wrong rendered question count");
    for (let index = 0; index < items.length; index++) {
      const item = items[index], q = args.questions[index];
      if (!q) continue;
      inspectBox(item, item.closest(".print-page,.answer-key-page") || root, `item ${index + 1}`);
      if (args.mode === "solution") {
        if (normalize(item.querySelector("header strong")?.textContent) !== q.answer) issues.push(`item ${index + 1}: wrong answer text`);
        if (normalize(item.querySelector(".source52-range-solution")?.textContent) !== q.solutionText) issues.push(`item ${index + 1}: missing solution steps`);
      } else if (args.mode === "answer-key") {
        if (normalize(item.querySelector("span")?.textContent) !== q.answer) issues.push(`item ${index + 1}: answer-only mismatch`);
      }
      if (args.mode !== "answer-key") {
        const content = args.mode === "problem" ? item.querySelector(".source52-range-question") : item.querySelector(".source52-range-solution");
        if (!content) issues.push(`item ${index + 1}: missing readable content`);
        else if (parseFloat(getComputedStyle(content).fontSize) < (args.printing ? 10 : 12)) issues.push(`item ${index + 1}: text too small`);
      }
    }
    if (args.mode === "problem" && root.querySelector(".source52-range-interval,.source52-range-endpoint,[data-phase=answer],.source52-range-solution")) issues.push("Student prompt contains the solved number line or solution");
    const diagrams = [...root.querySelectorAll("svg.source52-range-line")];
    const graphicalQuestions = args.questions.filter(q => q.visualRequired);
    if (diagrams.length !== graphicalQuestions.length) issues.push("Missing or extra number line");
    diagrams.forEach((svg, index) => {
      const q = graphicalQuestions[index], model = q?.model;
      if (!model) return;
      const vb = svg.viewBox.baseVal;
      inspectBox(svg, svg.closest(".question-item,.solution-item,figure") || root, `line ${index + 1}`);
      const labels = [...svg.querySelectorAll(".source52-range-tick text")];
      const tickValues = labels.map(t => Number(t.textContent));
      if (tickValues.length < 3 || !tickValues.every(Number.isFinite)) issues.push("Invalid number-line tick labels");
      for (let i = 1; i < tickValues.length; i++) if (tickValues[i] !== tickValues[i - 1] + 1) issues.push("Nonconsecutive number-line ticks");
      labels.forEach((label, n) => {
        const b = label.getBBox();
        if (b.x < vb.x - .5 || b.y < vb.y - .5 || b.x + b.width > vb.x + vb.width + .5 || b.y + b.height > vb.y + vb.height + .5) issues.push("Number label outside SVG viewBox");
        const actual = label.getBoundingClientRect();
        if (actual.height < (args.printing ? 8 : 10)) issues.push("Number-line label too small");
        labels.slice(n + 1).forEach(other => {
          const o = other.getBoundingClientRect();
          if (actual.left < o.right - .5 && actual.right > o.left + .5 && actual.top < o.bottom - .5 && actual.bottom > o.top + .5) issues.push("Overlapping number-line labels");
        });
      });
      const phase = args.mode === "problem" ? "question" : "answer";
      if (svg.dataset.phase !== phase || !svg.getAttribute("aria-label")) issues.push("Wrong SVG phase or missing accessible label");
      if (args.mode === "problem") return;
      const segments = [...svg.querySelectorAll(".source52-range-interval")];
      const endpoints = [...svg.querySelectorAll(".source52-range-endpoint")];
      if (segments.length !== 1 || endpoints.length !== 2) { issues.push("Range must be one continuous segment with exactly two endpoints"); return; }
      const lowerLabel = labels.find(t => Number(t.textContent) === model.lower), upperLabel = labels.find(t => Number(t.textContent) === model.upper);
      if (!lowerLabel || !upperLabel) { issues.push("Endpoint tick is missing"); return; }
      const x1 = Number(lowerLabel.getAttribute("x")), x2 = Number(upperLabel.getAttribute("x"));
      const segment = segments[0], y = Number(segment.getAttribute("y1"));
      if (Math.abs(Number(segment.getAttribute("x1")) - x1) > .01 || Math.abs(Number(segment.getAttribute("x2")) - x2) > .01 || Number(segment.getAttribute("y2")) !== y || x2 <= x1) issues.push("Segment is not aligned with its endpoint ticks");
      if (!model.naturalNumbersOnly && !q.answerModel.continuous) issues.push("Continuous range was replaced by a natural-number answer");
      const style = getComputedStyle(segment);
      if (style.stroke === "none" || parseFloat(style.strokeWidth) <= 0 || !["none", "0px"].includes(style.strokeDasharray)) issues.push("Range segment is not a visible continuous line");
      const sorted = endpoints.sort((a, b) => Number(a.getAttribute("cx")) - Number(b.getAttribute("cx")));
      sorted.forEach((point, side) => {
        const expectedX = side ? x2 : x1, included = side ? model.upperIncluded : model.lowerIncluded;
        const fill = getComputedStyle(point).fill;
        if (Math.abs(Number(point.getAttribute("cx")) - expectedX) > .01 || Number(point.getAttribute("cy")) !== y) issues.push("Endpoint circle is not on its boundary");
        if (point.classList.contains("is-closed") !== included || point.classList.contains("is-open") === included) issues.push("Endpoint inclusion marker is wrong");
        if (included ? fill === "none" || fill === "rgb(255, 255, 255)" : fill !== "rgb(255, 255, 255)") issues.push("Open/filled endpoint styling is wrong");
      });
    });
    const pages = [...root.querySelectorAll(".print-page,.answer-key-page")];
    if (args.printing) pages.forEach((sheet, i) => {
      const b = sheet.getBoundingClientRect();
      if (b.width > 210 * 96 / 25.4 + 2 || b.height > 297 * 96 / 25.4 + 2) issues.push(`print sheet ${i + 1}: exceeds A4`);
    });
    return { issues: [...new Set(issues)], items: items.length, diagrams: diagrams.length, layoutPages: pages.length, localStorageKeys: Object.keys(localStorage), sessionStorageKeys: Object.keys(sessionStorage) };
  }, { mode, questions, printing });
  assert.deepEqual(report.issues, [], `${mode}: ${JSON.stringify(report.issues)}`);
  assert.deepEqual(report.localStorageKeys, [], "Audit must not create persistent student data");
  assert.deepEqual(report.sessionStorageKeys, [], "Audit must not create session data");
  return report;
}

async function screenshot(page, mode, stem) {
  const name = `${stem}-${mode}.png`;
  await page.locator(selectors[mode]).screenshot({ path: path.join(output, name) });
  assert(fs.statSync(path.join(output, name)).size > 2000, "Screenshot is unexpectedly empty");
  result.screenshots.push(name);
}

async function verifyVisualGuards(page, mode, questions) {
  if (mode === "problem") {
    await page.locator("#problemView svg.source52-range-line").first().evaluate(svg => {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("class", "source52-range-interval");
      line.setAttribute("data-audit-negative-control", "answer-leak");
      svg.append(line);
    });
    try { await assert.rejects(inspectView(page, mode, questions), /Student prompt contains/); }
    finally { await page.locator('[data-audit-negative-control="answer-leak"]').evaluate(element => element.remove()); }
    result.negativeControls.push("Student answer-mark leakage rejected");
  } else {
    const endpoint = page.locator("#solutionView .source52-range-endpoint.is-open").first();
    const originalClass = await endpoint.getAttribute("class");
    await endpoint.evaluate(element => { element.classList.remove("is-open"); element.classList.add("is-closed"); element.dataset.auditNegativeControl = "endpoint"; });
    try { await assert.rejects(inspectView(page, mode, questions), /Endpoint inclusion marker is wrong/); }
    finally { await page.locator('[data-audit-negative-control="endpoint"]').evaluate((element, oldClass) => { element.setAttribute("class", oldClass); delete element.dataset.auditNegativeControl; }, originalClass); }
    result.negativeControls.push("Wrong endpoint inclusion rejected");
  }
  await inspectView(page, mode, questions);
}

async function printView(page, mode, questions, stem, savePDF) {
  await page.evaluate(() => { dispatchEvent(new Event("afterprint")); window.__auditPrintCalls = 0; });
  await page.locator("#printMenuButton").click();
  await page.locator(`button[data-print-mode="${mode}"]`).click();
  await page.waitForFunction(() => window.__auditPrintCalls === 1);
  await loaded(page);
  const screen = await inspectView(page, mode, questions);
  if (mode === "answer-key") await screenshot(page, mode, stem);
  if (savePDF) {
    const screenViewport = page.viewportSize();
    // Match the A4 page width while inspecting print CSS; emulateMedia alone
    // retains the desktop viewport and would misreport page containment.
    await page.setViewportSize({ width: Math.ceil(210 * 96 / 25.4), height: Math.ceil(297 * 96 / 25.4) });
    await page.emulateMedia({ media: "print" });
    const layout = await inspectView(page, mode, questions, true);
    const file = `${stem}-${mode}.pdf`;
    await page.pdf({ path: path.join(output, file), format: "A4", preferCSSPageSize: true, printBackground: true });
    const data = fs.readFileSync(path.join(output, file)), text = data.toString("latin1");
    const pageCount = (text.match(/\/Type\s*\/Page\b/g) || []).length;
    const mediaBoxes = [...text.matchAll(/\/MediaBox\s*\[\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\]/g)];
    assert(data.length > 3000 && pageCount >= 1, "A4 PDF must contain pages and content");
    assert.equal(pageCount, layout.layoutPages, "PDF has unexpected extra/blank pages or split worksheet content");
    assert(mediaBoxes.length > 0 && mediaBoxes.every(m => Math.abs(Number(m[3]) - Number(m[1]) - 595.28) < 2 && Math.abs(Number(m[4]) - Number(m[2]) - 841.89) < 2), "PDF must use A4 media boxes");
    result.pdfs.push({ file, mode, questions: questions.length, pages: pageCount, bytes: data.length, sha256: sha(data) });
    await page.emulateMedia({ media: "screen" });
    await page.setViewportSize(screenViewport);
  }
  await page.evaluate(() => dispatchEvent(new Event("afterprint")));
  return screen;
}

async function inspectSingle(browser, id, difficulty, width) {
  const { context, page, errors, dialogs } = await isolatedPage(browser, width);
  const stem = `${id}-d${difficulty + 1}-w${width}`;
  try {
    await page.goto(`${base}?type=${id}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded" });
    await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
    await loaded(page);
    const questions = await renderedQuestions(page, [id], difficulty);
    const problem = await inspectView(page, "problem", questions);
    if (id === ids[0] && difficulty === -1 && width === 1280) await verifyVisualGuards(page, "problem", questions);
    await screenshot(page, "problem", stem);
    if (width === 1280 && createPDF) await printView(page, "problem", questions, stem, true);
    await page.locator("#solutionTab").click();
    const solution = await inspectView(page, "solution", questions);
    if (id === ids[0] && difficulty === -1 && width === 1280) await verifyVisualGuards(page, "solution", questions);
    await screenshot(page, "solution", stem);
    if (width === 1280 && createPDF) await printView(page, "solution", questions, stem, true);
    const answerKey = await printView(page, "answer-key", questions, stem, width === 1280 && createPDF);
    await page.locator("#backButton").click();
    await page.locator("#questionCountInput").fill("120");
    assert.equal(await page.locator("#selectedQuestionCount").textContent(), "3", "Single-type selection must stop at the verified capacity");
    await page.locator("#generateButton").click();
    await loaded(page);
    await renderedQuestions(page, [id], difficulty);
    assert.deepEqual(errors, []);
    assert.deepEqual(dialogs, []);
    result.states.push({ id, difficulty, width, finiteCapacity: 3, variants: questions.map(q => q.variant), problem, solution, answerKey });
  } finally { await context.close(); }
}

async function inspectMixed(browser, width) {
  const { context, page, errors, dialogs } = await isolatedPage(browser, width);
  try {
    await page.goto(base, { waitUntil: "domcontentloaded" });
    await page.locator('#gradeFilter [data-grade="5"]').click();
    await page.locator('#termFilter [data-term="2"]').click();
    await page.locator("#unitFilter").selectOption("5-2-u1");
    for (const id of ids) {
      const row = page.locator(`[data-preview-type-id="${id}"]`);
      assert.equal(await row.locator("input").isDisabled(), false, `${id}: verified type should be selectable`);
      await row.locator(".tree-type-copy").click();
      await page.locator("#typePreviewPopover").waitFor({ state: "visible" });
      assert.equal(await page.locator("#typePreviewPopover .source52-range-question").getAttribute("data-source-item"), id);
      assert.equal(await page.locator("#typePreviewPopover .source52-range-interval,#typePreviewPopover .source52-range-endpoint").count(), 0);
      result.previews.push({ id, width });
      await page.locator("[data-close-type-preview]").click();
      await row.locator("input").check();
    }
    await page.locator("#questionCountInput").fill("120");
    assert.equal(await page.locator("#selectedTypeCount").textContent(), "5");
    assert.equal(await page.locator("#selectedQuestionCount").textContent(), "15", "All five types must stop at fifteen distinct variants");
    await page.locator("#generateButton").click();
    await loaded(page);
    const questions = await renderedQuestions(page, ids, 0);
    await inspectView(page, "problem", questions);
    await page.locator("#solutionTab").click();
    await inspectView(page, "solution", questions);
    await printView(page, "answer-key", questions, `mixed-w${width}`, false);
    assert.deepEqual(errors, []);
    assert.deepEqual(dialogs, []);
    result.mixed.push({ width, difficulty: 0, count: questions.length, finiteCapacity: 15 });
  } finally { await context.close(); }
}

async function inspectExisting(browser, width) {
  const { context, page, errors, dialogs } = await isolatedPage(browser, width);
  const id = "6-2-u3-e1-exploration";
  try {
    await page.goto(`${base}?type=${id}&review=1&difficulty=0`, { waitUntil: "domcontentloaded" });
    await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
    await loaded(page);
    assert.equal(await page.locator("#problemView .question-item").count(), 3);
    await page.locator("#solutionTab").click();
    assert.equal(await page.locator("#solutionView .solution-item").count(), 3);
    const state = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth + 1, invalid: /undefined|null|NaN|Infinity/.test(document.querySelector("#solutionView").innerText), figures: document.querySelectorAll("#solutionView svg,#solutionView img").length }));
    assert.equal(state.overflow, false);
    assert.equal(state.invalid, false);
    assert(state.figures >= 3);
    assert.deepEqual(errors, []);
    assert.deepEqual(dialogs, []);
    result.regression.push({ id, width, ...state });
  } finally { await context.close(); }
}

async function run() {
  fs.mkdirSync(output, { recursive: true });
  result.assetHashes = hashes();
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  try {
    for (const id of ids) for (const difficulty of difficulties) for (const width of widths) await inspectSingle(browser, id, difficulty, width);
    for (const width of widths) await inspectMixed(browser, width);
    for (const width of [1280, 375]) await inspectExisting(browser, width);
    assert.equal(result.states.length, 45);
    assert.equal(result.pdfs.length, createPDF ? 45 : 0);
    assert.equal(result.freshContexts, 50);
    assert.equal(result.negativeControls.length, 2);
    assert.deepEqual(result.pageErrors, []);
    assert.deepEqual(result.localMissing, []);
    assert.deepEqual(hashes(), result.assetHashes, "Core product assets changed during audit");
    for (const [file, digest] of servedHashes) assert.equal(sha(fs.readFileSync(file)), digest, `Served asset changed: ${path.relative(repo, file)}`);
    result.servedAssetCount = servedHashes.size;
    result.status = "passed";
    console.log(JSON.stringify({ status: result.status, states: result.states.length, pdfs: result.pdfs.length, pdfPages: result.pdfs.reduce((n, p) => n + p.pages, 0), mixed: result.mixed.length, regression: result.regression.length, freshContexts: result.freshContexts }));
  } catch (error) {
    result.status = "failed";
    result.error = error.stack || String(error);
    throw error;
  } finally {
    await browser.close();
    fs.writeFileSync(path.join(output, "browser-audit.json"), JSON.stringify(result, null, 2) + "\n");
  }
}

module.exports = { run };
if (require.main === module) run().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
