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
  assert.equal(await page.locator("#amc-grade-comparison-wrap").isVisible(), true);
  assert.match(await page.locator("#amc-grade-comparison-body").innerText(), /Grade 6\s+9\.17 \/ 25\s+20,688명/);
  assert.match(await page.locator("#amc-grade-comparison-body").innerText(), /Grade 7 · 선택 그룹\s+10\.08 \/ 25\s+50,218명/);
  assert.match(await page.locator("#amc-grade-reference-delta").innerText(), /평균보다 0\.08점 아래/);
  assert.equal(await page.locator("#amc8-korea-percentile-reference").isVisible(), true);
  assert.match(await page.locator("#amc8-korea-percentile-summary").innerText(), /2009 AMC 8 · Grade 7학년 · 10\/25점 · 점수 16명 · 학년 표본 262명/);
  assert.match(await page.locator("#amc8-korea-percentile-value").innerText(), /계산 백분위 12\.60%/);
  assert.equal(await page.locator("#amc-grade-reference-source").getAttribute("href"), "https://pdfcoffee.com/maa-amc-8-25-annual-pdf-free.html");
  assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [390, 390]);
  assert.deepEqual(errors, []);
  await page.close();
});

test("2010 AMC 8 shows the archived MAA grade mean and unassigned sample note", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${url}?grade=7&program=amc8&year=2010`, { waitUntil: "networkidle" });
  for (let question = 1; question <= 25; question += 1) {
    await page.locator(`[data-question="${question}"][data-field="status"]`).selectOption(question <= 10 ? "correct" : "blank");
  }
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.equal(await page.locator("#amc-grade-reference").isVisible(), true);
  assert.match(await page.locator("#amc-grade-reference-summary").innerText(), /Grade 7 · 2010 AMC 8 · 기록된 학년 참가자 50,749명/);
  assert.match(await page.locator("#amc-grade-reference-summary").innerText(), /학년별 표에 포함되지 않은 참가자 2,595명 \(전체 153,211명\)/);
  assert.match(await page.locator("#amc-grade-reference-plot").innerText(), /이번 원본\s+10 \/ 25\s+해당 학년 평균\s+9\.74 \/ 25/);
  assert.equal(await page.locator("#amc-grade-reference-source").getAttribute("href"), "https://web.archive.org/web/20130707194038/http://amc.maa.org/amc8/2010/stats/2010-amc8stats.shtml");
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
  assert.match(await page.locator("#amc-grade-comparison-body").innerText(), /Grade 8 and below\s+81\.30 \/ 150\s+5,018명/);
  assert.match(await page.locator("#amc-grade-comparison-body").innerText(), /Grade 10\s+70\.50 \/ 150\s+35,727명/);
  await page.locator("#archive-year").selectOption("2022");
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.equal(await page.locator("#amc-grade-reference").isHidden(), true);
  assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [390, 390]);
  await page.close();
});

test("AMC 10/12 result shows the matching historical AIME score line", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${url}?grade=8&program=amc12&year=2024&form=A`, { waitUntil: "networkidle" });
  for (let question = 1; question <= 25; question += 1) await page.locator(`[data-question="${question}"][data-field="status"]`).selectOption(question <= 10 ? "correct" : "blank");
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.equal(await page.locator("#amc-aime-cutoff-reference").isVisible(), true);
  assert.match(await page.locator("#amc-aime-cutoff-summary").innerText(), /2024 AMC 12 A · 응시 점수 82\.5 \/ 150점 · 당시 AIME 진출 점수선 76\.5점/);
  assert.match(await page.locator("#amc-aime-cutoff-bands").innerText(), /당시 AIME 진출 점수선\s+76\.5 \/ 150\s+기준보다 6점 위/);
  await page.goto(`${url}?grade=8&program=amc10&year=2021&form=D`, { waitUntil: "networkidle" });
  for (let question = 1; question <= 25; question += 1) await page.locator(`[data-question="${question}"][data-field="status"]`).selectOption(question <= 8 ? "correct" : "blank");
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.match(await page.locator("#amc-aime-cutoff-summary").innerText(), /2021 가을 AMC 10 B .*당시 AIME 진출 점수선 96점/);
  assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [390, 390]);
  assert.deepEqual(errors, []);
  await page.close();
});
