"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const test = require("node:test");
const { chromium } = require("playwright");
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
  url = `http://127.0.0.1:${server.address().port}/boarding-school-math/boarding-roadmap.html`;
  browser = await chromium.launch({ headless: true });
});
test.after(async function () {
  if (browser) await browser.close();
  if (server) await new Promise(function (resolve) { server.close(resolve); });
});

test("grade map, level comparison, and competition intake stay honest and interactive", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  await page.goto(`${url}?grade=7`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#grade-map-title").innerText(), "7학년 수학 한눈에");
  assert.match(await page.locator("#grade-title").innerText(), /유리수/);
  assert.equal(await page.locator(".grade-button").count(), 8);
  assert.equal(await page.locator(".stage-button").count(), 4);
  assert.deepEqual(await page.locator("#grade-focus-list strong").allInnerTexts(), ["학교 수학", "경시 · 선택", "SAT · 맛보기"]);
  assert.match(await page.locator(".level-boundary").innerText(), /진단 결과가 없어서/);
  assert.match(await page.locator("#grade-note").innerText(), /7.NS.A 워크북과 진단은 검수 중/);
  assert.equal(await page.locator("#grade-practice-links a").count(), 2);
  assert.match(await page.locator("#grade-practice-links a").first().innerText(), /검수 시안/);
  assert.match(await page.locator("#grade-practice-links a").first().getAttribute("href"), /cluster=7.NS.A/);
  assert.deepEqual(await page.locator(".route-button[aria-pressed='true']").allInnerTexts(), []);
  assert.equal(await page.locator(".route-explanation").isHidden(), true);
  assert.equal(await page.locator("#route-check-block").isHidden(), true);
  await page.getByRole("button", { name: "다음 내용 배우기" }).click();
  assert.equal(await page.locator(".route-explanation").isVisible(), true);
  assert.equal(await page.getByRole("button", { name: "다음 내용 배우기" }).evaluate(function (node) { return node === document.activeElement; }), true);
  assert.equal(await page.locator("#route-name").innerText(), "다음 내용 배우기");
  assert.equal(await page.locator("#route-check-block").isVisible(), true);
  assert.equal(await page.locator("#competition-select").inputValue(), "");
  assert.equal(await page.locator(".competition-report").isHidden(), true);
  assert.equal(await page.locator("#paper-label-field").isHidden(), true);
  assert.equal(await page.locator("#paper-review-link").isHidden(), true);
  assert.equal(await page.locator(".competition-submit").isHidden(), true);
  assert.equal(await page.locator("#competition-source-link").isHidden(), true);
  await page.locator("#competition-select").selectOption("amc8");
  assert.equal(await page.locator(".competition-report").isHidden(), true);
  assert.equal(await page.locator("#paper-label-field").isVisible(), true);
  assert.match(await page.locator("#paper-review-link").getAttribute("href"), /grade=7&program=amc8/);
  assert.equal(await page.locator(".competition-submit").isVisible(), true);
  assert.equal(await page.locator("#competition-practice-link").isHidden(), true);
  assert.match(await page.locator("#competition-source-link").getAttribute("href"), /maa\.org/);
  await page.locator("#competition-select").selectOption("");
  assert.equal(await page.locator("#paper-review-link").isHidden(), true);
  assert.equal(await page.locator(".competition-submit").isHidden(), true);
  assert.equal(await page.locator("#competition-source-link").isHidden(), true);
  await page.locator("#competition-select").selectOption("kangaroo");
  assert.match(await page.locator("#competition-source-link").getAttribute("href"), /mathkangaroo\.org/);
  await page.locator("#competition-select").selectOption("amc8");
  await page.getByRole("button", { name: "Grade 9 지도 보기" }).click();
  assert.deepEqual(await page.locator(".route-button[aria-pressed='true']").allInnerTexts(), []);
  assert.equal(await page.locator(".route-explanation").isHidden(), true);
  assert.equal(await page.locator("#route-check-block").isHidden(), true);
  assert.equal(await page.locator("#competition-select").inputValue(), "");
  assert.equal(await page.locator("#grade-map-title").innerText(), "9학년 수학 한눈에");
  assert.match(await page.locator("#grade-focus-list").innerText(), /학교 수학 · 추정/);
  assert.match(await page.locator("#source-chip").innerText(), /추정안/);
  assert.match(await page.locator("#grade-note").innerText(), /제공된 7·8·10학년/);
  await page.locator("#competition-select").selectOption("amc10");
  assert.match(await page.locator("#paper-review-link").getAttribute("href"), /grade=9&program=amc10/);
  assert.equal(await page.locator("#competition-practice-link").isHidden(), true);
  await page.locator('[data-strand="algebra"][data-field="attempted"]').fill("4");
  await page.locator('[data-strand="algebra"][data-field="correct"]').fill("3");
  await page.locator('[data-strand="geometry"][data-field="attempted"]').fill("2");
  await page.locator('[data-strand="geometry"][data-field="correct"]').fill("1");
  await page.getByRole("button", { name: "영역별 결과 보기" }).click();
  assert.equal(await page.locator(".competition-report").isVisible(), true);
  assert.equal(await page.locator(".competition-report").evaluate(function (node) { return node === document.activeElement; }), true);
  assert.equal(await page.locator("#competition-report-title").innerText(), "AMC 10 · 6문제 중 4문제 정답");
  assert.equal(await page.locator("#competition-report-rows .report-row").count(), 2);
  assert.doesNotMatch(await page.locator("#competition-report-rows").innerText(), /입력 없음/);
  assert.match(await page.locator("#competition-report-rows").innerText(), /3문제 미만/);
  assert.doesNotMatch(await page.locator("#competition-report-rows").innerText(), /50%/);
  assert.match(await page.locator("#competition-report-summary").innerText(), /6\/25문항 입력[\s\S]*두 영역에서 각각 3문제 이상/);
  await page.locator('[data-strand="geometry"][data-field="attempted"]').fill("4");
  await page.locator('[data-strand="geometry"][data-field="correct"]').fill("3");
  await page.getByRole("button", { name: "영역별 결과 보기" }).click();
  assert.match(await page.locator("#competition-report-summary").innerText(), /영역별 정답률이 같아요/);
  await page.locator('[data-strand="geometry"][data-field="correct"]').fill("1");
  await page.getByRole("button", { name: "영역별 결과 보기" }).click();
  assert.match(await page.locator("#competition-report-summary").innerText(), /기하·공간부터 다시 보세요/);
  assert.deepEqual(errors, []);
  await page.close();
});

test("released unit practice is reachable without exposing the private Grade 7 diagnostic", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${url}?grade=6`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#grade-practice-links a").count(), 3);
  assert.equal(await page.locator("#competition-practice-link").isHidden(), true);
  await page.locator("#competition-select").selectOption("amc8");
  assert.equal(await page.locator("#competition-practice-link").isVisible(), true);
  await page.locator("#grade-practice-more summary").click();
  assert.equal(await page.locator("#grade-practice-more-links a").count(), 7);
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [390, 390]);
  await page.getByRole("button", { name: "Grade 7 지도 보기" }).click();
  assert.equal(await page.locator("#grade-practice-links a").count(), 2);
  assert.equal(await page.locator("#grade-practice-more").isHidden(), true);
  await page.locator("#grade-practice-links a").first().click();
  await page.waitForURL(/unit-workbook\.html\?cluster=7.NS.A/);
  assert.match(await page.locator("body").innerText(), /단원 워크북/);
  assert.doesNotMatch(page.url(), /diagnostic/);
  await page.close();
});

test("map has no horizontal overflow at 390px and supports keyboard selection", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await page.goto(url, { waitUntil: "networkidle" });
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [390, 390]);
  const gradeButton = page.getByRole("button", { name: "Grade 8 지도 보기" });
  await gradeButton.focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.locator("#grade-label").innerText(), "8학년");
  assert.equal(await gradeButton.evaluate(function (node) { return node === document.activeElement; }), true);
  await page.getByRole("button", { name: /단계 3/ }).click();
  assert.match(await page.locator("#stage-number").innerText(), /단계 3/);
  assert.equal(await page.getByRole("button", { name: /단계 3/ }).evaluate(function (node) { return node === document.activeElement; }), true);
  await page.close();
});

test("map reflows at small phone, tablet, and landscape widths", async function () {
  for (const size of [{ width: 375, height: 812 }, { width: 768, height: 1024 }, { width: 844, height: 390 }]) {
    const page = await browser.newPage({ viewport: size });
    await page.goto(url, { waitUntil: "networkidle" });
    const dimensions = await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; });
    assert.deepEqual(dimensions, [size.width, size.width], `overflow at ${size.width}`);
    await page.close();
  }
});
