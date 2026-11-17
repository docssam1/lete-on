"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const test = require("node:test");
const { chromium } = require("playwright");
require("../competition/sat-foundation-practice-bank.js");
const bank = globalThis.GFIELDSATFoundationPractice;
const root = path.resolve(__dirname, "..", "..");
let server;
let browser;
let url;

test.before(async function () {
  server = http.createServer(function (request, response) {
    const pathname = new URL(request.url, "http://127.0.0.1").pathname;
    const file = path.resolve(root, `.${decodeURIComponent(pathname)}`);
    if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      response.writeHead(404); response.end("Not found"); return;
    }
    const type = file.endsWith(".html") ? "text/html" : file.endsWith(".css") ? "text/css" : file.endsWith(".js") ? "text/javascript" : "application/octet-stream";
    response.writeHead(200, { "content-type": `${type}; charset=utf-8` });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise(function (resolve) { server.listen(0, "127.0.0.1", resolve); });
  url = `http://127.0.0.1:${server.address().port}/boarding-school-math/sat-foundation-practice.html`;
  const launchOptions = { headless: true };
  if (process.env.GFIELD_CHROME_EXECUTABLE) launchOptions.executablePath = process.env.GFIELD_CHROME_EXECUTABLE;
  browser = await chromium.launch(launchOptions);
});

test.after(async function () {
  if (browser) await browser.close();
  if (server) await new Promise(function (resolve) { server.close(resolve); });
});

test("original SAT foundation bank has complete answer and explanation coverage", function () {
  assert.equal(bank.items.length, 20);
  const items = bank.items;
  assert.deepEqual(Array.from(new Set(items.map(function (item) { return item.domain; }))).sort(), bank.domains.slice().sort());
  assert.deepEqual(items.reduce(function (counts, item) { counts[item.domain] = (counts[item.domain] || 0) + 1; return counts; }, {}), {
    "대수": 4, "고급 대수": 4, "문제 해결·자료 분석": 8, "기하·삼각법": 4
  });
  assert.equal(new Set(items.map(function (item) { return item.id; })).size, items.length);
  for (const item of items) {
    assert.equal(item.choices.length, 5, item.id);
    assert.ok(Number.isInteger(item.answer) && item.answer >= 0 && item.answer < item.choices.length, item.id);
    assert.ok(item.hint && item.solution.length >= 2 && item.connection, item.id);
  }
  const answers = Object.fromEntries(items.map(function (item) { return [item.id, item.choices[item.answer]]; }));
  assert.equal(answers["sat-foundation-rate-01"], "5/4컵");
  assert.equal(answers["sat-foundation-rate-02"], "18마일/시간");
  assert.equal(answers["sat-foundation-percent-01"], "68달러");
  assert.equal(answers["sat-foundation-percent-02"], "25%");
  assert.equal(answers["sat-foundation-algebra-01"], "6번");
  assert.equal(answers["sat-foundation-algebra-02"], "20 + 7 × 8 = 76달러");
  assert.equal(answers["sat-foundation-algebra-03"], "25");
  assert.equal(answers["sat-foundation-data-01"], "19쪽");
  assert.equal(answers["sat-foundation-data-02"], "94점");
  assert.equal(answers["sat-foundation-data-03"], "1/2");
  assert.equal(answers["sat-foundation-data-04"], "응답한 수학 동아리 학생 중 75%가 체스를 골랐습니다.");
  assert.equal(answers["sat-foundation-algebra-04"], "6회");
  assert.equal(answers["sat-foundation-advanced-01"], "5x + 12");
  assert.equal(answers["sat-foundation-advanced-02"], "9");
  assert.equal(answers["sat-foundation-advanced-03"], "−7과 7");
  assert.equal(answers["sat-foundation-advanced-04"], "48개");
  assert.equal(answers["sat-foundation-geometry-01"], "65°");
  assert.equal(answers["sat-foundation-geometry-02"], "9πcm²");
  assert.equal(answers["sat-foundation-geometry-03"], "40cm²");
  assert.equal(answers["sat-foundation-geometry-04"], "5cm");
  assert.match(bank.scope, /Not a SAT form/);
  assert.match(bank.scope, /optional extensions/);
});

test("Grade 6–10 SAT review routes preserve supported grade context and display fractions vertically", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  for (const grade of [6, 7, 8, 9, 10]) {
    await page.goto(`${url}?grade=${grade}`, { waitUntil: "networkidle" });
    assert.equal(await page.locator("#sat-nav-route").innerText(), `${grade}학년 성장 지도`);
    assert.equal(await page.locator("#sat-back-route").getAttribute("href"), `./boarding-roadmap.html?grade=${grade}#annual-plan`);
    assert.equal(await page.locator(".sat-workspace .problem-card").count(), 20);
    assert.equal(await page.locator("#sat-progress").innerText(), "0 / 20");
    assert.equal(await page.locator(".sat-workspace .math-fraction").count() >= 3, true);
    assert.ok(await page.locator('.sat-workspace .math-fraction[aria-label="4분의 3"]').count() > 0);
    assert.ok(await page.locator(".sat-workspace .math-fraction").evaluateAll(function (nodes) {
      return nodes.every(function (node) {
        return ["inline-grid", "grid"].includes(getComputedStyle(node).display)
          && getComputedStyle(node.querySelector(".math-fraction-numerator")).borderBottomWidth !== "0px";
      });
    }), "fraction uses a stacked numerator, rule, and denominator");
  }
  const first = page.locator('[data-item-id="sat-foundation-rate-01"]');
  await first.locator('[data-choice="0"]').click();
  assert.equal(await page.locator("#sat-progress").innerText(), "0 / 20");
  await first.locator('[data-choice="1"]').click();
  assert.equal(await page.locator("#sat-progress").innerText(), "1 / 20");
  await first.locator(".hint-panel summary").click();
  await first.locator(".worked-solution:not(.hint-panel) summary").click();
  assert.ok(await first.locator('.worked-solution:not(.hint-panel) .math-fraction[aria-label="16분의 20"]').count() > 0);
  assert.ok(await first.locator('.worked-solution:not(.hint-panel) .math-fraction[aria-label="4분의 5"]').count() > 0);
  await page.locator("#sat-domain-filters").getByRole("button", { name: "문제 해결·자료 분석" }).click();
  assert.equal(await page.locator(".sat-workspace .problem-card").count(), 8);
  const sampling = page.locator('[data-item-id="sat-foundation-data-04"]');
  await sampling.locator(".worked-solution:not(.hint-panel) summary").click();
  assert.match(await sampling.locator(".worked-solution:not(.hint-panel)").innerText(), /대표성 있는 표본/);
  await page.locator("#sat-domain-filters").getByRole("button", { name: "고급 대수" }).click();
  assert.equal(await page.locator(".sat-workspace .problem-card").count(), 4);
  assert.equal(await page.locator('[data-item-id="sat-foundation-advanced-01"] .problem-meta span').innerText(), "준비되면 선택");
  await page.locator("#sat-domain-filters").getByRole("button", { name: "기하·삼각법" }).click();
  assert.equal(await page.locator(".sat-workspace .problem-card").count(), 4);
  await page.locator("#sat-reset-practice").click();
  assert.equal(await page.locator("#sat-progress").innerText(), "0 / 20");
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.clientWidth, document.documentElement.scrollWidth]; }), [1280, 1280]);
  await page.setViewportSize({ width: 390, height: 844 });
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.clientWidth, document.documentElement.scrollWidth]; }), [390, 390]);
  assert.ok(await page.locator(".practice-intro h1").evaluate(function (node) { return node.getBoundingClientRect().width >= 300; }), "mobile title keeps a readable line width");
  assert.equal(await page.locator(".practice-intro h1 span").evaluate(function (node) {
    const range = document.createRange(); range.selectNodeContents(node); return range.getClientRects().length;
  }), 1, "mobile title keeps 연습 together on one line");
  assert.deepEqual(await page.evaluate(function () { return Object.keys(localStorage); }), [], "practice does not persist a learner record");
  assert.deepEqual(errors, []);
  await page.close();
});

test("Grade 6–10 selected roadmaps link to GFIELD foundation review before official SAT resources", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  for (const grade of [6, 7, 8, 9, 10]) {
    const roadmap = `${url.replace("sat-foundation-practice.html", "boarding-roadmap.html")}?grade=${grade}#annual-plan`;
    await page.goto(roadmap, { waitUntil: "networkidle" });
    const satPeriod = page.locator("#annual-plan-periods > li").nth(2);
    const ownLink = satPeriod.locator('a[href^="./sat-foundation-practice.html"]');
    assert.equal(await ownLink.innerText(), grade <= 7 ? "지필드 SAT Math 기초 연결 연습 · 자체 20문항" : "지필드 SAT Math 네 영역 기초 복습 · 자체 20문항");
    if (grade === 10) {
      assert.deepEqual(await page.locator("#annual-plan-periods > li").nth(1).locator("a").evaluateAll(function (nodes) { return nodes.map(function (node) { return node.getAttribute("href"); }); }), [
        "./aime-practice.html?grade=10",
        "https://maa.org/news/maa-announces-official-testing-centers-for-the-2027-american-invitational-mathematics-examination/",
        "https://maa.org/maa-invitational-competitions/"
      ]);
      assert.deepEqual(await satPeriod.locator("a").evaluateAll(function (nodes) { return nodes.map(function (node) { return node.getAttribute("href"); }); }), [
        "./sat-foundation-practice.html?grade=10",
        "./precalculus-workbook.html",
        "https://www.khanacademy.org/digital-sat",
        "https://satsuite.collegeboard.org/practice/practice-tests/bluebook",
        "https://satsuite.collegeboard.org/practice/student-question-bank/math"
      ]);
    }
    assert.match(await ownLink.getAttribute("href"), new RegExp(`grade=${grade}$`));
    await ownLink.click();
    await page.waitForURL(new RegExp(`sat-foundation-practice\\.html\\?grade=${grade}$`));
    assert.equal(await page.locator("#sat-nav-route").innerText(), `${grade}학년 성장 지도`);
  }
  await page.goto(`${url.replace("sat-foundation-practice.html", "boarding-roadmap.html")}?grade=7#grade-map`, { waitUntil: "networkidle" });
  await page.locator("#grade7-branches summary").click();
  assert.match(await page.locator("#grade7-branches summary").innerText(), /대수·기하·자료 해석/);
  assert.equal(await page.locator(".grade7-sat-foundation-link").getAttribute("href"), "./sat-foundation-practice.html?grade=7");
  assert.equal(await page.locator(".grade7-sat-foundation-link").innerText(), "지필드 SAT Math 네 영역 기초 연습 · 20문항 →");
  await page.close();
});
