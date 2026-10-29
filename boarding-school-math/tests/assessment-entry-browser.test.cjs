"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const test = require("node:test");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..", "..");
let server, browser, baseUrl;
function type(file) { return file.endsWith(".html") ? "text/html; charset=utf-8" : file.endsWith(".css") ? "text/css; charset=utf-8" : "text/javascript; charset=utf-8"; }
function errorsFor(page) {
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  page.on("console", function (message) { if (message.type() === "error") errors.push(message.text()); });
  return errors;
}

test.before(async function () {
  server = http.createServer(function (request, response) {
    const file = path.resolve(root, `.${decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname)}`);
    if (!file.startsWith(root) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404); response.end(); return; }
    response.writeHead(200, { "content-type": type(file) }); fs.createReadStream(file).pipe(response);
  });
  await new Promise(function (resolve) { server.listen(0, "127.0.0.1", resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}/boarding-school-math/`;
  browser = await chromium.launch({ headless: true });
});
test.after(async function () { if (browser) await browser.close(); if (server) await new Promise(function (resolve) { server.close(resolve); }); });

test("school placement evidence remains descriptive and carries no automated weakness into today's plan", async function () {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const errors = errorsFor(page);
  await page.goto(`${baseUrl}assessment-entry.html?grade=6`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#grade").inputValue(), "6");
  assert.equal(await page.locator('[data-sources="map-growth"]#season').isVisible(), false);
  await page.locator("#overall-percent").fill("82");
  await page.locator("#school-cut").fill("80");
  await page.locator('[data-domain="number"]').fill("88");
  await page.locator('[data-domain="proportional"]').fill("84");
  await page.locator('[data-domain="algebra"]').fill("78");
  await page.locator('[data-domain="geometry"]').fill("61");
  await page.locator('[data-domain="reasoning"]').fill("74");
  await page.locator("#evidence-form").evaluate(function (form) { form.requestSubmit(); });
  assert.equal(await page.locator("#recommended-course").innerText(), "Pre-Algebra");
  assert.match(await page.locator("#priority-list").innerText(), /기하·측정[\s\S]*61%/);
  assert.match(await page.locator("#recommendation-reason").innerText(), /컷 충족만 표시하며 G·MAP 준비도나 배정을 판정하지 않습니다/);
  assert.match(await page.locator("#decision-notice").innerText(), /사용자가 입력한 과정의 비교 자료/);
  assert.match(await page.locator("#decision-notice").innerText(), /공식 배정/);
  assert.notEqual(await page.locator("#send-to-plan").getAttribute("aria-disabled"), "true");
  const stored = await page.evaluate(function () { return JSON.parse(localStorage.getItem("gmap-local-learning-record-v1:external-assessment")); });
  assert.equal(stored.officialPlacement, false);
  assert.equal(stored.primaryPriority, null);
  assert.deepEqual(stored.priorityDomains, []);
  await page.locator("#send-to-plan").click();
  await page.waitForURL(/learning-plan\.html/);
  assert.equal(await page.locator("#plan-state").innerText(), "학교 평가 연결");
  assert.match(await page.locator("#today-description").innerText(), /외부 성적표만으로 약점이나 배정을 자동 판정하지 않습니다/);
  assert.match(await page.locator("#prediction-copy").innerText(), /직접 선택/);
  assert.equal(await page.locator("#study-days").inputValue(), "4");
  assert.equal(await page.locator("#minutes-per-day").inputValue(), "45");
  assert.deepEqual(errors, []);
  await context.close();
});

test("assessment entry keeps MAP metrics distinct and locks unverified grades on mobile and print", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  const errors = errorsFor(page);
  await page.goto(`${baseUrl}assessment-entry.html?grade=7`, { waitUntil: "networkidle" });
  await page.locator("#source-id").selectOption("map-growth");
  assert.equal(await page.locator("#overall-percent").isEnabled(), false);
  assert.equal(await page.locator("#rit").isVisible(), true);
  await page.locator("#rit").fill("218");
  await page.locator("#percentile").fill("64");
  await page.locator("#current-course").selectOption("pre-algebra");
  await page.locator("#target-course").selectOption("algebra-1");
  await page.locator("#evidence-form").evaluate(function (form) { form.requestSubmit(); });
  assert.match(await page.locator("#metric-value").innerText(), /RIT 218/);
  assert.match(await page.locator("#metric-value").innerText(), /64th percentile/);
  assert.match(await page.locator("#recommendation-reason").innerText(), /점수 구간·준비도/);
  assert.equal(await page.locator("#send-to-plan").getAttribute("aria-disabled"), "true");
  assert.equal(await page.locator("#published-resource").isVisible(), true);
  assert.match(await page.locator("#published-resource").getAttribute("href"), /catalog\.html\?role=student&grade=7/);
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [390, 390]);
  await page.emulateMedia({ media: "print" });
  assert.equal(await page.locator("#evidence-form").evaluate(function (node) { return getComputedStyle(node).display; }), "none");
  assert.deepEqual(errors, []);
  await page.close();
});

test("ISEE stanines stay separate instead of becoming an invented average", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = errorsFor(page);
  await page.goto(`${baseUrl}assessment-entry.html?grade=7`, { waitUntil: "networkidle" });
  await page.locator("#source-id").selectOption("isee");
  await page.locator("#quant-stanine").fill("9");
  await page.locator("#math-stanine").fill("8");
  await page.locator("#evidence-form").evaluate(function (form) { form.requestSubmit(); });
  assert.match(await page.locator("#metric-value").innerText(), /Quantitative Reasoning 9 · Mathematics Achievement 8 stanine/);
  assert.doesNotMatch(await page.locator("#metric-value").innerText(), /평균|8\.5/);
  assert.equal(await page.locator("#confidence-value").innerText(), "성적표 표기 기준");
  assert.deepEqual(errors, []);
  await page.close();
});
