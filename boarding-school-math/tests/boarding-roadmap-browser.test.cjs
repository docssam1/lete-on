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
  assert.match(await page.locator("#grade-title").innerText(), /유리수/);
  assert.equal(await page.locator(".grade-button").count(), 8);
  assert.equal(await page.locator(".stage-button").count(), 4);
  assert.match(await page.locator(".level-boundary").innerText(), /진단 전/);
  assert.match(await page.locator("#grade-note").innerText(), /검수·공개 전/);
  assert.match(await page.locator("#paper-review-link").getAttribute("href"), /grade=7&program=amc8/);
  assert.equal(await page.locator("#competition-practice-link").getAttribute("href"), "./competition-practice.html?program=amc8");
  await page.getByRole("button", { name: "Grade 9 지도 보기" }).click();
  assert.match(await page.locator("#source-chip").innerText(), /추정안/);
  assert.match(await page.locator("#grade-note").innerText(), /제공된 7·8·10학년/);
  await page.locator("#competition-select").selectOption("amc10");
  assert.match(await page.locator("#paper-review-link").getAttribute("href"), /grade=9&program=amc10/);
  assert.equal(await page.locator("#competition-practice-link").isHidden(), true);
  await page.locator('[data-strand="algebra"][data-field="attempted"]').fill("4");
  await page.locator('[data-strand="algebra"][data-field="correct"]').fill("3");
  await page.locator('[data-strand="geometry"][data-field="attempted"]').fill("2");
  await page.locator('[data-strand="geometry"][data-field="correct"]').fill("1");
  await page.getByRole("button", { name: "영역별 결과 분석" }).click();
  assert.match(await page.locator("#competition-report-title").innerText(), /4\/6/);
  assert.match(await page.locator("#competition-report-rows").innerText(), /표본 부족/);
  assert.match(await page.locator("#competition-report-summary").innerText(), /비교 가능한 영역/);
  assert.deepEqual(errors, []);
  await page.close();
});

test("map has no horizontal overflow at 390px and supports keyboard selection", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await page.goto(url, { waitUntil: "networkidle" });
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [390, 390]);
  const gradeButton = page.getByRole("button", { name: "Grade 8 지도 보기" });
  await gradeButton.focus();
  await page.keyboard.press("Enter");
  assert.match(await page.locator("#grade-label").innerText(), /GRADE 8/);
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
