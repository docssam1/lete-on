"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const test = require("node:test");
const { chromium } = require("playwright");
require("../grade7-ns-a-mock-bank.js");
const exam = globalThis.GFIELDGrade7NSAExam;
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
  url = `http://127.0.0.1:${server.address().port}/boarding-school-math/grade7-ns-a-mock-exam.html`;
  const launchOptions = { headless: true };
  if (process.env.GFIELD_CHROME_EXECUTABLE) launchOptions.executablePath = process.env.GFIELD_CHROME_EXECUTABLE;
  browser = await chromium.launch(launchOptions);
});

test.after(async function () {
  if (browser) await browser.close();
  if (server) await new Promise(function (resolve) { server.close(resolve); });
});

test("the original mock covers the declared Grade 7 rational-number standards with unique, keyed items", function () {
  assert.equal(exam.id, "gfield-grade7-ns-a-mock-v1");
  assert.equal(exam.durationMinutes, 35);
  assert.equal(exam.items.length, 12);
  assert.equal(new Set(exam.items.map(function (item) { return item.id; })).size, exam.items.length);
  assert.deepEqual(exam.standards, ["7.NS.A.1", "7.NS.A.2", "7.NS.A.3"]);
  assert.deepEqual(exam.items.reduce(function (counts, item) { counts[item.standard] = (counts[item.standard] || 0) + 1; return counts; }, {}), {
    "7.NS.A.1": 4, "7.NS.A.2": 4, "7.NS.A.3": 4
  });
  for (const item of exam.items) {
    assert.equal(item.choices.length, 4, item.id);
    assert.ok(Number.isInteger(item.answer) && item.answer >= 0 && item.answer < item.choices.length, item.id);
    assert.ok(item.focus && item.prompt && item.solution, item.id);
    assert.equal(new Set(item.choices).size, item.choices.length, item.id);
  }
  const expected = {
    "ns-a-m01": "1/12", "ns-a-m02": "11/10", "ns-a-m03": "0.55", "ns-a-m04": "2.75°C",
    "ns-a-m05": "−2/3", "ns-a-m06": "−15/16", "ns-a-m07": "3/2", "ns-a-m08": "−6",
    "ns-a-m09": "4/3", "ns-a-m10": "−30m", "ns-a-m11": "1/8L", "ns-a-m12": "−$8.00"
  };
  for (const item of exam.items) assert.equal(item.choices[item.answer], expected[item.id], item.id);
});

test("the mock hides answers until submission and returns only this attempt's item and standard results", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  await page.goto(url, { waitUntil: "networkidle" });
  assert.match(await page.locator("h1").innerText(), /유리수 연산[\s\S]*단원 모의고사/);
  assert.match(await page.locator("#mock-start-panel").innerText(), /학교 성적은 입력하지 않아요/);
  assert.equal(await page.locator("input").count(), 0, "the mock must not request school scores or personal identifiers");
  await page.getByRole("button", { name: "모의고사 시작" }).click();
  assert.equal(await page.locator(".mock-question").count(), 12);
  assert.equal(await page.locator("#mock-timer").innerText(), "35:00");
  assert.ok(await page.locator('.mock-question .math-fraction[aria-label="12분의 1"]').count() > 0, "fraction notation is displayed as a stacked fraction");
  assert.equal(await page.locator(".mock-review").count(), 0, "answers and worked solutions remain hidden before submission");
  const items = exam.items;
  for (let index = 0; index < items.length; index += 1) {
    await page.locator(`#mock-question-${items[index].id} .mock-choice`).nth(items[index].answer).click();
  }
  assert.equal(await page.locator("#mock-progress").innerText(), "12 / 12 응답");
  await page.getByRole("button", { name: "답안 제출" }).click();
  assert.equal(await page.locator("#mock-results").isVisible(), true);
  assert.match(await page.locator(".mock-score").innerText(), /12 \/ 12[\s\S]*12문항 응답/);
  assert.deepEqual(await page.locator(".mock-standard-results article").allInnerTexts(), [
    "7.NS.A.1\n4 / 4 정답", "7.NS.A.2\n4 / 4 정답", "7.NS.A.3\n4 / 4 정답"
  ]);
  assert.match(await page.locator(".mock-next-study").innerText(), /모든 문항을 맞혔어요.*전체 단원 숙달/);
  assert.equal(await page.locator(".mock-next-study a").getAttribute("href"), "./unit-workbook.html?cluster=7.NS.A&mode=workbook&audience=student&locale=ko&paper=A4");
  assert.equal(await page.locator(".mock-review article[data-correct='true']").count(), 12);
  assert.ok(await page.locator('.mock-review .math-fraction[aria-label="12분의 1"]').count() > 0);
  assert.match(await page.locator(".mock-result-boundary").innerText(), /다른 회차나 학년의 점수와.*비교한 결과가 아닙니다/);
  assert.equal(await page.evaluate(function () { return document.documentElement.scrollWidth === document.documentElement.clientWidth; }), true);
  assert.deepEqual(errors, []);
  await page.close();
});

test("mobile mock answers can be corrected before submitting an incomplete response set", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "모의고사 시작" }).click();
  const firstQuestion = page.locator(`#mock-question-${exam.items[0].id}`);
  await firstQuestion.locator(".mock-choice").nth(0).click();
  await firstQuestion.locator(".mock-choice").nth(exam.items[0].answer).click();
  assert.equal(await firstQuestion.locator('.mock-choice[aria-pressed="true"]').count(), 1);
  await page.getByRole("button", { name: "답안 제출" }).click();
  assert.match(await page.locator(".mock-score").innerText(), /1 \/ 12[\s\S]*1문항 응답/);
  assert.match(await page.locator(".mock-next-study").innerText(), /복습할 문제.*등급을 정하지 않고/);
  assert.match(await page.locator(".mock-review article").first().innerText(), new RegExp(`정답 ${"ABCD"[exam.items[0].answer]}`));
  assert.match(await page.locator(".mock-review article").nth(1).innerText(), /미응답/);
  assert.equal(await page.evaluate(function () { return document.documentElement.scrollWidth === document.documentElement.clientWidth; }), true);
  await page.close();
});
