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
    if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404); response.end("Not found"); return; }
    const type = file.endsWith(".html") ? "text/html" : file.endsWith(".css") ? "text/css" : file.endsWith(".js") ? "text/javascript" : "application/octet-stream";
    response.writeHead(200, { "content-type": `${type}; charset=utf-8` });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  url = `http://127.0.0.1:${server.address().port}/boarding-school-math/competition-paper-review.html`;
  const launchOptions = { headless: true };
  if (process.env.GFIELD_CHROME_EXECUTABLE) launchOptions.executablePath = process.env.GFIELD_CHROME_EXECUTABLE;
  browser = await chromium.launch(launchOptions);
});

test.after(async function () { if (browser) await browser.close(); if (server) await new Promise((resolve) => server.close(resolve)); });

test("complete same-year AMC 8 result shows the exact historical grade mean", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${url}?grade=7&program=amc8&year=2009`, { waitUntil: "networkidle" });
  for (let question = 1; question <= 25; question += 1) {
    await page.locator(`[data-question="${question}"][data-field="status"]`).selectOption(question <= 10 ? "correct" : "blank");
  }
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.equal(await page.locator("#amc-grade-reference").isVisible(), true);
  assert.match(await page.locator("#amc-grade-reference-summary").innerText(), /Grade 7 · 2009 AMC 8 · 기록된 학년 참가자 50,218명/);
  assert.match(await page.locator("#amc-grade-reference-plot").innerText(), /이번 원본\s+10 \/ 25\s+해당 학년 평균\s+10\.08 \/ 25/);
  assert.match(await page.locator("#amc-grade-reference-delta").innerText(), /평균보다 0\.08점 아래/);
  assert.equal(await page.locator("#amc8-korea-percentile-reference").isVisible(), true);
  assert.match(await page.locator("#amc8-korea-percentile-summary").innerText(), /2009 AMC 8 · Grade 7학년 · 10\/25점 · 점수 16명 · 학년 표본 262명/);
  assert.match(await page.locator("#amc8-korea-percentile-value").innerText(), /계산 백분위 12\.60%/);
  assert.equal(await page.locator("#amc-grade-reference-source").getAttribute("href"), "https://pdfcoffee.com/maa-amc-8-25-annual-pdf-free.html");
  assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [390, 390]);
  assert.deepEqual(errors, []);
  await page.close();
});

test("2011 AMC 8 shows the transcribed Korea grade percentile with its cohort scope", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${url}?grade=7&program=amc8&year=2011`, { waitUntil: "networkidle" });
  for (let question = 1; question <= 25; question += 1) {
    await page.locator(`[data-question="${question}"][data-field="status"]`).selectOption(question <= 21 ? "correct" : "blank");
  }
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.equal(await page.locator("#amc8-korea-percentile-reference").isVisible(), true);
  assert.match(await page.locator("#amc8-korea-percentile-summary").innerText(), /2011 AMC 8 · Grade 7학년 · 21\/25점 · 점수 16명 · 학년 표본 315명/);
  assert.match(await page.locator("#amc8-korea-percentile-value").innerText(), /^원자료 기록 백분위 88\.25%/);
  assert.equal(await page.locator("#amc8-korea-percentile-source").getAttribute("href"), "https://www.amcstudy.net/79");
  assert.equal(await page.locator("#amc8-historical-award-reference").isVisible(), true);
  assert.match(await page.locator("#amc8-historical-award-summary").innerText(), /2011 AMC 8 · 입력 학년 Grade 7 · 21\/25점 · 전체 응시자 기준선/);
  assert.match(await page.locator("#amc8-historical-award-bands").innerText(), /Honor Roll · 상위 약 5%\s+17 \/ 25\s+기준점보다 4점 위/);
  assert.match(await page.locator("#amc8-historical-award-bands").innerText(), /Distinguished Honor Roll · 상위 약 1%\s+22 \/ 25\s+기준점까지 1점/);
  assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [390, 390]);
  assert.deepEqual(errors, []);
  await page.close();
});

test("grade comparison stays hidden for grouped grades and unavailable years", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${url}?grade=7&program=amc10&year=2011&form=A`, { waitUntil: "networkidle" });
  for (let question = 1; question <= 25; question += 1) await page.locator(`[data-question="${question}"][data-field="status"]`).selectOption("correct");
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.equal(await page.locator("#amc-grade-reference").isHidden(), true);
  await page.goto(`${url}?grade=9&program=amc10&year=2011&form=A`, { waitUntil: "networkidle" });
  for (let question = 1; question <= 25; question += 1) await page.locator(`[data-question="${question}"][data-field="status"]`).selectOption("correct");
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.equal(await page.locator("#amc-grade-reference").isVisible(), true);
  assert.match(await page.locator("#amc-grade-reference-summary").innerText(), /Grade 9 · 2011 AMC 10 A · 기록된 학년 참가자 24,410명/);
  await page.locator("#archive-year").selectOption("2022");
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.equal(await page.locator("#amc-grade-reference").isHidden(), true);
  assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [390, 390]);
  await page.close();
});
