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

test("mixed plan persists, reorders, keeps visits after removal, and synchronizes tabs", async function () {
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  await page.goto(base + "/boarding-roadmap.html?grade=7");
  await page.locator("#my-study").waitFor({ state: "visible" });
  await page.locator('[id="study-add-7.NS.A"]').click();
  await page.locator("#study-kind").selectOption("contest");
  await page.locator("#study-year").selectOption("2023");
  await page.locator("#study-add-amc8-2023").click();
  await page.locator("#study-kind").selectOption("topic");
  await page.locator("#study-add-amc8-counting").click();
  const peer = await context.newPage();
  await peer.goto(base + "/boarding-roadmap.html");
  await page.locator("#study-queue li").nth(2).getByRole("button", { name: "먼저 하기", exact: true }).click();
  assert.deepEqual(await page.locator(".study-item-title").allTextContents(), ["경우의 수와 확률", "유리수의 연산", "AMC 8 · 2023"]);
  await peer.waitForFunction(function () { return document.querySelector(".study-item-title").textContent === "경우의 수와 확률"; });
  await page.locator("#study-queue li").nth(1).getByRole("button", { name: /아래로 옮기기/ }).click();
  await page.locator("#study-queue li").nth(2).getByRole("button", { name: /위로 옮기기/ }).click();
  await page.reload();
  assert.equal(await page.locator(".study-item-title").first().textContent(), "경우의 수와 확률");
  assert.match(await page.locator("#study-current a").first().getAttribute("href"), /domains=counting/);
  await page.locator("#study-current a").first().click();
  await page.waitForURL(/amc8-topic-practice/);
  await page.goBack();
  await page.locator("#study-queue li").first().getByRole("button", { name: /목록에서 빼기/ }).click();
  await page.locator(".study-detail summary").click();
  assert.match(await page.locator("#study-history").textContent(), /경우의 수/);
  await page.getByRole("link", { name: "경시", exact: true }).click();
  await page.locator("#study-contests").waitFor({ state: "visible" });
  await page.locator("#study-year").selectOption("2023");
  assert.equal(await page.locator("#study-add-amc8-2023").textContent(), "담았어요 · 목록 보기");
  await page.locator("#study-add-amc8-2023").click();
  await page.locator("#my-study").waitFor({ state: "visible" });
  await page.getByRole("link", { name: "교과", exact: true }).click();
  await page.locator("#grade-map").waitFor({ state: "visible" });
  assert.equal(await page.locator("#my-study").isVisible(), false);
  await page.getByRole("link", { name: "내 공부", exact: true }).click();
  await page.locator("#my-study").waitFor({ state: "visible" });
  await page.locator("#study-kind").selectOption("curriculum");
  await page.locator("#study-grade").selectOption("course");
  await page.locator("#study-add-algebra1").click();
  await page.locator("#study-item-algebra1").click();
  await page.reload();
  assert.equal(await page.locator("#study-current h2").textContent(), "Algebra 1");
  await page.locator("#study-current a").first().click();
  await page.waitForURL(/algebra1-workbook/);
  assert.ok(await page.locator("#workbook-pages").textContent());
  await page.goBack();
  assert.deepEqual(errors, []);
  await context.close();
});

test("learner studies school and contest items, returns to the ordered plan and resumes answers", async function () {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  await page.goto(base + "/boarding-roadmap.html?grade=7");
  await page.locator('[id="study-add-7.NS.A"]').click();
  await page.locator("#study-kind").selectOption("topic");
  await page.locator("#study-add-amc8-counting").click();
  await page.locator("#study-kind").selectOption("contest");
  await page.locator("#study-year").selectOption("2023");
  await page.locator("#study-add-amc8-2023").click();
  await page.locator("#study-queue li").nth(1).getByRole("button", { name: "먼저 하기", exact: true }).click();
  await page.locator("#study-current a").first().click();
  await page.waitForURL(/amc8-topic-practice/);
  const first = page.locator("#topic-items .problem-card").first();
  const itemId = await first.getAttribute("data-item-id");
  const answer = await page.evaluate(function (id) {
    return GFIELDGrade7UnitMock.items.concat(GFIELDAMC8ConceptPractice.items, GFIELDAMC8ConceptPracticeExtension.items).find(function (item) { return item.id === id; }).answer;
  }, itemId);
  await first.locator('[data-choice="' + ((answer + 1) % 5) + '"]').click();
  assert.equal(await first.locator(".feedback.wrong").count(), 1);
  await first.locator('[data-choice="' + answer + '"]').click();
  assert.equal(await first.locator(".feedback.correct").count(), 1);
  await page.locator("#study-return-link").click();
  await page.locator("#my-study").waitFor({ state: "visible" });
  assert.equal(await page.locator(".study-item-title").first().textContent(), "경우의 수와 확률");
  await page.locator("#study-current a").first().click();
  await page.waitForURL(/amc8-topic-practice/);
  assert.equal(await page.locator('[data-item-id="' + itemId + '"] .choice.correct').count(), 1);
  assert.match(await page.locator("#topic-progress").textContent(), /^1 \/ /);
  await page.locator("#study-return-link").click();
  await page.locator('[id="study-item-7.NS.A"]').click();
  await page.locator("#study-current a").first().click();
  await page.waitForURL(/unit-workbook/);
  const workbookItem = await page.evaluate(function () {
    const source = GFIELDGrade7NSAUnitWorkbook;
    const item = source.pack.workbookItems[0];
    return { id: item.id, answer: source.solveItem(item) };
  });
  const card = page.locator('[data-item-id="' + workbookItem.id + '"]');
  await card.locator('[data-answer-id="' + workbookItem.answer + '"]').click();
  assert.equal(await card.locator(".choice-feedback.correct").count(), 1);
  await page.locator("#study-return-link").click();
  await page.locator("#my-study").waitFor({ state: "visible" });
  assert.equal(await page.locator("#study-current h2").textContent(), "유리수의 연산");
  await page.locator("#study-current a").first().click();
  await page.waitForURL(/unit-workbook/);
  assert.equal(await page.locator('[data-item-id="' + workbookItem.id + '"] .choice-feedback.correct').count(), 1);
  await page.locator("#study-return-link").click();
  await page.locator("#study-item-amc8-2023").click();
  await page.locator("#study-current a").first().click();
  await page.waitForURL(/competition-paper-review/);
  assert.equal(await page.locator("#archive-year").inputValue(), "2023");
  assert.equal(await page.locator("#review-program").inputValue(), "amc8");
  await page.locator("#study-return-link").click();
  await page.locator("#my-study").waitFor({ state: "visible" });
  assert.equal(await page.locator("#study-current h2").textContent(), "AMC 8 · 2023");
  assert.deepEqual(errors, []);
  await context.close();
});

test("phone layouts retain usable controls and paper form selection", async function () {
  for (const width of [320, 390, 768]) {
    const context = await browser.newContext({ viewport: { width: width, height: 850 } });
    const page = await context.newPage();
    await page.goto(base + "/boarding-roadmap.html?grade=7");
    await page.locator('[id="study-add-7.RP.A"]').click();
    await page.getByRole("link", { name: "경시", exact: true }).click();
    await page.locator("#study-program").selectOption("amc10");
    await page.locator("#study-year").selectOption("2021");
    await page.locator("#study-form").selectOption("D");
    await page.locator("#study-add-amc10-2021-D").click();
    assert.match(await page.locator("#study-catalog a").getAttribute("href"), /year=2021&form=D/);
    await page.getByRole("link", { name: "내 공부", exact: true }).click();
    await page.locator("#my-study").waitFor({ state: "visible" });
    assert.equal(await page.evaluate(function () { return document.documentElement.scrollWidth <= innerWidth; }), true, "No overflow at " + width);
    const heights = await page.locator("#study-queue .study-controls button").evaluateAll(function (nodes) { return nodes.map(function (node) { return node.getBoundingClientRect().height; }); });
    assert.ok(heights.every(function (height) { return height >= 44; }));
    await context.close();
  }
});

test("language changes preserve the mixed study plan, paper selection and workbook return locale", async function () {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  await page.goto(base + "/boarding-roadmap.html?grade=7");
  await page.locator('[id="study-add-7.NS.A"]').click();
  await page.locator("#study-kind").selectOption("contest");
  await page.locator("#study-program").selectOption("amc10");
  await page.locator("#study-year").selectOption("2021");
  await page.locator("#study-form").selectOption("D");
  await page.locator("#study-add-amc10-2021-D").click();
  const ids = await page.evaluate(function () { return JSON.parse(localStorage.getItem("gfield-boarding-study-plan:v1")).items; });
  for (const locale of ["en", "zh-Hans", "ko"]) {
    await page.locator("#study-locale").selectOption(locale);
    assert.equal(await page.locator("html").getAttribute("lang"), locale);
    assert.equal(await page.locator("#study-home-title").textContent(), { ko: "내 공부", en: "My study", "zh-Hans": "我的学习" }[locale]);
    assert.equal(await page.locator("#study-year").inputValue(), "2021");
    assert.equal(await page.locator("#study-form").inputValue(), "D");
    const currentIds = await page.evaluate(function () { return JSON.parse(localStorage.getItem("gfield-boarding-study-plan:v1")).items; });
    assert.deepEqual(currentIds, ids);
    assert.equal(await page.evaluate(function () { return document.documentElement.scrollWidth <= innerWidth; }), true);
    if (locale !== "ko") assert.doesNotMatch(await page.locator("#my-study").textContent(), /[가-힣]/);
  }
  await page.locator("#study-locale").selectOption("en");
  await page.locator("#study-queue li").nth(1).getByRole("button", { name: "Study first", exact: true }).click();
  await page.reload();
  assert.equal(await page.locator("#study-home-title").textContent(), "My study");
  assert.equal(await page.locator(".study-item-title").first().textContent(), "AMC 10 · 2021 D");
  await page.locator("#study-locale").selectOption("zh-Hans");
  await page.locator('[id="study-item-7.NS.A"]').click();
  await page.locator("#study-current a").first().click();
  await page.waitForURL(/unit-workbook/);
  assert.equal(new URL(page.url()).searchParams.get("locale"), "zh-Hans");
  assert.equal(await page.locator("html").getAttribute("lang"), "zh-Hans");
  assert.equal(await page.locator("#study-return-link").textContent(), "← 返回我的学习");
  await page.locator("#study-return-link").click();
  await page.locator("#my-study").waitFor({ state: "visible" });
  assert.equal(await page.locator("#study-locale").inputValue(), "zh-Hans");
  assert.equal(await page.locator("#study-current h2").textContent(), "有理数运算");
  await page.getByRole("link", { name: "校内数学", exact: true }).click();
  await page.locator("#grade-map").waitFor({ state: "visible" });
  assert.doesNotMatch(await page.locator("#grade-core").textContent(), /[가-힣]/);
  assert.deepEqual(errors, []);
  await context.close();
});

test("stored IDs cannot inject a destination and stale tabs edit the latest order", function () {
  const catalog = new Map([["unit", {}], ["contest", {}]]);
  const cleaned = model.clean({ version: 1, items: ["unit", "unit", "javascript:alert(1)"], opened: { unit: 123, unknown: 123, contest: "bad" } }, catalog);
  assert.deepEqual(cleaned.items, ["unit"]);
  assert.deepEqual(cleaned.opened, { unit: 123 });
  let value = JSON.stringify({ version: 1, items: ["unit"], opened: {} });
  const storage = { getItem: function () { return value; }, setItem: function (_key, next) { value = next; } };
  model.update(storage, catalog, function (plan) { plan.items.push("contest"); });
  const latest = model.update(storage, catalog, function (plan) { model.move(plan, "contest", -1); });
  assert.deepEqual(latest.items, ["contest", "unit"]);
  assert.throws(function () { model.update({ getItem: storage.getItem, setItem: function () { throw new Error("quota"); } }, catalog, function (plan) { plan.items = []; }); }, /quota/);
  assert.deepEqual(model.load(storage, catalog).items, ["contest", "unit"]);
});
