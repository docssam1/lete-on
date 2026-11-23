"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const test = require("node:test");
const { chromium } = require("playwright");
const model = require("../shared/boarding-study-plan.js");
let browser, server, base;

test.before(async function () {
  const root = path.resolve(__dirname, "..");
  server = http.createServer(function (req, res) {
    const file = path.resolve(root, "." + new URL(req.url, "http://localhost").pathname);
    if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.writeHead(404); res.end(); return;
    }
    const ext = path.extname(file);
    res.setHeader("Content-Type", ({ ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".webp": "image/webp" })[ext] || "application/octet-stream");
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(function (resolve) { server.listen(0, "127.0.0.1", resolve); });
  base = "http://127.0.0.1:" + server.address().port;
  browser = await chromium.launch({ headless: true, executablePath: process.env.GFIELD_CHROME_EXECUTABLE });
});
test.after(async function () {
  if (browser) await browser.close();
  if (server) await new Promise(function (resolve) { server.close(resolve); });
});

async function untranslated(page, selector) {
  return page.locator(selector || "body").evaluate(function (root) {
    const found = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.parentElement.getClientRects().length && !node.parentElement.closest("script,style,select,[data-content-original]") && /[가-힣]/.test(node.data)) found.push(node.data.trim());
    }
    return Array.from(new Set(found));
  });
}
async function settled(page) {
  await page.evaluate(function () { GFIELDContentI18n.refresh(); });
}

test("full grade roadmap explanations switch languages while keeping the selected stage and course", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  await page.goto(base + "/boarding-roadmap.html?grade=7&locale=en#grade-map");
  await page.locator("#stage-list button").nth(2).click();
  const selected = await page.locator('#stage-list button[aria-pressed="true"]').getAttribute("aria-label");
  assert.ok(selected);
  await page.locator("#study-locale").selectOption("zh-Hans");
  await settled(page);
  assert.equal(await page.locator('#stage-list button[aria-pressed="true"]').count(), 1);
  assert.deepEqual(await untranslated(page), []);
  assert.equal(await page.locator("html").getAttribute("lang"), "zh-Hans");
  for (const locale of ["en", "zh-Hans"]) {
    for (const grade of [3, 6, 8, 9, 10, 11, 12]) {
      await page.goto(base + "/boarding-roadmap.html?grade=" + grade + "&locale=" + locale + "#grade-map");
      await settled(page);
      assert.deepEqual(await untranslated(page), [], locale + " Grade " + grade);
      assert.equal(await page.evaluate(function () { return document.documentElement.scrollWidth <= innerWidth; }), true);
    }
  }
  assert.deepEqual(errors, []);
  await page.close();
});

test("translated competition choices, solutions and math retain their original answers when language changes", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  for (const route of ["amc10-practice", "amc12-practice", "amc8-topic-practice"]) {
    await page.goto(base + "/" + route + ".html?grade=7&locale=en");
    await settled(page);
    const card = page.locator(".problem-card").first();
    const id = await card.getAttribute("data-item-id");
    const answer = await page.evaluate(function (id) {
      const banks = [window.GFIELDAMC10ConceptPractice, window.GFIELDAMC12ConceptPractice, window.GFIELDGrade7UnitMock, window.GFIELDAMC8ConceptPractice, window.GFIELDAMC8ConceptPracticeExtension].filter(Boolean);
      return banks.flatMap(function (bank) { return bank.items; }).find(function (item) { return item.id === id; }).answer;
    }, id);
    const before = await page.locator(".problem-card").evaluateAll(function (cards) { return cards.map(function (node) { return node.dataset.itemId; }); });
    await card.locator('[data-choice="' + answer + '"]').click();
    await page.locator("[data-boarding-content-locale]").selectOption("zh-Hans");
    await settled(page);
    assert.deepEqual(await page.locator(".problem-card").evaluateAll(function (cards) { return cards.map(function (node) { return node.dataset.itemId; }); }), before);
    assert.equal(await card.locator(".choice.correct").count(), 1);
    assert.deepEqual(await untranslated(page), [], route);
    if (await page.locator(".math-fraction").count()) {
      assert.ok(await page.locator(".math-fraction").evaluateAll(function (nodes) { return nodes.every(function (node) { return node.children.length === 2 && getComputedStyle(node.children[0]).borderBottomWidth !== "0px"; }); }));
    }
    assert.equal(await page.evaluate(function () { return document.documentElement.scrollWidth <= innerWidth; }), true);
  }
  assert.deepEqual(errors, []);
  await page.close();
});

test("English and Chinese exam entry, submission, feedback and saved aggregates agree", async function () {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  await page.goto(base + "/amc8-grade7-mock-exam.html?grade=7&locale=en");
  await page.locator("#mock-start").click();
  const answers = await page.evaluate(function () { return GFIELDGrade7UnitMock.items.map(function (item) { return { id: item.id, answer: item.answer }; }); });
  for (const item of answers) await page.locator('#mock-question-' + item.id + ' .mock-choice').nth(item.answer).click();
  await page.locator("[data-boarding-content-locale]").selectOption("zh-Hans");
  await page.locator("#mock-submit").click();
  await settled(page);
  assert.match(await page.locator(".mock-score").textContent(), /25\s*\/\s*25/);
  assert.deepEqual(await untranslated(page), []);
  await page.goto(base + "/competition-paper-review.html?grade=7&program=amc8&year=2023&locale=en");
  await page.locator('[data-question="1"][data-field="answer"]').selectOption("E");
  await page.locator('[data-question="1"][data-field="status"]').selectOption("wrong");
  await page.locator('[data-question="1"][data-field="domain"]').selectOption("number");
  await page.locator('[data-question="1"][data-field="reason"]').selectOption("approach");
  await openReviewOptions(page);await page.locator("#review-exam-date").fill("2026-11-14");
  await page.locator("[data-boarding-content-locale]").selectOption("zh-Hans");
  await page.locator(".review-form-actions button[type=submit]").click();
  await settled(page);
  assert.deepEqual(await untranslated(page), []);
  await page.locator("#save-diagnostic").click();
  await settled(page);
  assert.deepEqual(await untranslated(page), []);
  const record = await page.evaluate(function () { return GFIELDLocalLearningRecord.storage.loadCompetitionDiagnosticHistory(7, "amc8")[0]; });
  assert.equal(record.summary.wrong, 1);
  assert.equal(record.summary.attempted, 1);
  assert.equal(record.reasons[0].id, "approach");
  assert.deepEqual(errors, []);
  await context.close();
});

test("all display translations preserve numeric literals, mathematical notation and interpolation slots", function () {
  const vm = require("node:vm");
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, "../shared/boarding-content-translations.js"), "utf8"), context);
  const translations = context.window.GFIELDContentTranslations;
  assert.ok(Object.keys(translations).length > 4500);
  function atoms(value, pattern) { return Array.from(value.matchAll(pattern), function (match) { return match[0]; }).sort(); }
  function numbers(value) { return atoms(value.replace(/__GFIELD_\d+__/g, "").replace(/,/g, ""), /\d+(?:\.\d+)?/g); }
  for (const [source, pair] of Object.entries(translations)) {
    assert.equal(pair.length, 2);
    for (const value of pair) {
      assert.ok(typeof value === "string" && value.trim());
      assert.doesNotMatch(value, /ZXQ|[가-힣]/, source);
      assert.deepEqual(atoms(value, /__GFIELD_\d+__/g), atoms(source, /__GFIELD_\d+__/g), source);
      assert.deepEqual(numbers(value), numbers(source), source);
      assert.deepEqual(atoms(value, /[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿπθ√≡∞₀₁₂₃₄₅₆₇₈₉ₙ₋]/g), atoms(source, /[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿπθ√≡∞₀₁₂₃₄₅₆₇₈₉ₙ₋]/g), source);
    }
  }
});

test("AIME integer entry survives a language switch and uses the same answer and solution", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  await page.goto(base + "/aime-practice.html?grade=8&locale=en&study=1&studyGrade=8");
  const card = page.locator(".problem-card").first();
  const id = await card.getAttribute("data-item-id");
  const answer = await page.evaluate(function (id) { return GFIELDAimeConceptPractice.items.find(function (item) { return item.id === id; }).answer; }, id);
  const raw = String(answer).padStart(3, "0");
  await card.locator("input").fill(raw);
  await page.locator("[data-boarding-content-locale]").selectOption("zh-Hans");
  assert.equal(await card.locator("input").inputValue(), raw);
  assert.equal(await page.locator("#study-return-link").textContent(), "← 返回我的学习");
  await card.locator('button[type="submit"]').click();
  assert.equal(await card.locator(".feedback.correct").count(), 1);
  await page.locator("[data-boarding-content-locale]").selectOption("en");
  await settled(page);
  assert.equal(await card.locator("input").inputValue(), raw);
  assert.equal(await card.locator("input").isDisabled(), true);
  assert.equal(await page.locator("#study-return-link").textContent(), "← Back to my study");
  assert.match(await page.locator("#study-return-link").getAttribute("href"), /locale=en/);
  assert.deepEqual(await untranslated(page), []);
  assert.deepEqual(errors, []);
  await page.close();
});

async function openReviewOptions(page) {
  if (await page.locator("#review-extra-options").getAttribute("open") === null) await page.locator("#review-extra-options > summary").click();
}
