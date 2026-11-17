"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const test = require("node:test");
const { chromium } = require("playwright");
require("../grade7-ns-a-mock-bank.js");
const exam = globalThis.GFIELDGrade7NSAExam;
require("../grade7-rp-a-mock-bank.js");
const rpExam = globalThis.GFIELDGrade7UnitMock;
require("../amc8-grade7-mock-bank.js");
const amcExam = globalThis.GFIELDGrade7UnitMock;
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
  assert.equal(exam.durationMinutes, 40);
  assert.equal(exam.items.length, 14);
  assert.equal(new Set(exam.items.map(function (item) { return item.id; })).size, exam.items.length);
  assert.deepEqual(exam.standards, ["7.NS.A.1", "7.NS.A.2", "7.NS.A.3"]);
  assert.deepEqual(exam.items.reduce(function (counts, item) { counts[item.standard] = (counts[item.standard] || 0) + 1; return counts; }, {}), {
    "7.NS.A.1": 5, "7.NS.A.2": 5, "7.NS.A.3": 4
  });
  for (const item of exam.items) {
    assert.equal(item.choices.length, 4, item.id);
    assert.ok(Number.isInteger(item.answer) && item.answer >= 0 && item.answer < item.choices.length, item.id);
    assert.ok(item.focus && item.prompt && item.solution, item.id);
    assert.equal(new Set(item.choices).size, item.choices.length, item.id);
  }
  const expected = {
    "ns-a-m01": "1/12", "ns-a-m02": "11/10", "ns-a-m03": "0.55", "ns-a-m04": "2.75°C",
    "ns-a-m05": "−5/4", "ns-a-m06": "−2/3", "ns-a-m07": "−15/16", "ns-a-m08": "3/2",
    "ns-a-m09": "−6", "ns-a-m10": "0.58333…", "ns-a-m11": "4/3", "ns-a-m12": "−30m",
    "ns-a-m13": "1/8L", "ns-a-m14": "−$8.00"
  };
  for (const item of exam.items) assert.equal(item.choices[item.answer], expected[item.id], item.id);
});

test("the GFIELD proportional-relationships form covers 7.RP.A with unique, keyed original items", function () {
  assert.equal(rpExam.id, "gfield-grade7-rp-a-mock-v1");
  assert.equal(rpExam.formVersion, "2026-11-04-v1");
  assert.equal(rpExam.durationMinutes, 40);
  assert.equal(rpExam.clusterId, "7.RP.A");
  assert.equal(rpExam.items.length, 14);
  assert.deepEqual(rpExam.standards, ["7.RP.A.1", "7.RP.A.2", "7.RP.A.3"]);
  assert.deepEqual(rpExam.items.reduce(function (counts, item) { counts[item.standard] = (counts[item.standard] || 0) + 1; return counts; }, {}), {
    "7.RP.A.1": 4, "7.RP.A.2": 5, "7.RP.A.3": 5
  });
  assert.equal(new Set(rpExam.items.map(function (item) { return item.id; })).size, 14);
  for (const item of rpExam.items) {
    assert.equal(item.choices.length, 4, item.id);
    assert.ok(Number.isInteger(item.answer) && item.answer >= 0 && item.answer < 4, item.id);
    assert.equal(new Set(item.choices).size, 4, item.id);
  }
  assert.deepEqual(rpExam.items.map(function (item) { return item.choices[item.answer]; }), ["52마일", "$2.55", "27쪽", "1/10컵", "3.5", "x: 2, 4, 6 · y: 5, 10, 15", "y = 3.60x", "(0, 0)", "x가 1일 때 y는 4.5이다", "$90", "$127.20", "16km", "$55.20", "25%"]);
});

test("the original GFIELD AMC 8 style form has 25 uniquely keyed questions across five reasoning areas", function () {
  assert.equal(amcExam.id, "gfield-grade7-amc8-style-mock-v2");
  assert.equal(amcExam.formVersion, "2026-11-04-v2");
  assert.equal(amcExam.durationMinutes, 40);
  assert.equal(amcExam.items.length, 25);
  assert.equal(new Set(amcExam.items.map(function (item) { return item.id; })).size, 25);
  assert.deepEqual(amcExam.standards, ["수 감각·비율", "대수·규칙", "기하·공간", "경우의 수·확률", "정수·자료 해석"]);
  assert.deepEqual(amcExam.items.reduce(function (counts, item) { counts[item.standard] = (counts[item.standard] || 0) + 1; return counts; }, {}), {
    "수 감각·비율": 5, "대수·규칙": 5, "기하·공간": 5, "경우의 수·확률": 5, "정수·자료 해석": 5
  });
  const expected = ["1,000", "47", "35cm²", "6", "26권", "7.5컵", "11", "80°", "7/8", "16점", "19", "15", "13cm", "60", "3.5점", "10", "73", "12", "3/7", "45%", "47", "12cm", "64cm²", "60", "119"];
  const standardByItem = [];
  const correctChoiceCounts = [0, 0, 0, 0, 0];
  const difficultyCounts = [0, 0, 0, 0, 0];
  for (let index = 0; index < amcExam.items.length; index += 1) {
    const item = amcExam.items[index];
    assert.equal(item.choices.length, 5, item.id);
    assert.equal(new Set(item.choices).size, 5, item.id);
    assert.ok(Number.isInteger(item.answer) && item.answer >= 0 && item.answer < 5, item.id);
    assert.ok(item.prompt && item.solution && item.focus, item.id);
    assert.equal(item.choices[item.answer], expected[index], item.id);
    assert.equal(item.difficultyBand, Math.floor(index / 5) + 1, item.id);
    correctChoiceCounts[item.answer] += 1;
    difficultyCounts[item.difficultyBand - 1] += 1;
    standardByItem.push(item.standard);
    if (item.dataTable) for (const row of item.dataTable.rows) assert.equal(row.length, item.dataTable.headers.length, item.id);
  }
  assert.deepEqual(correctChoiceCounts, [5, 5, 5, 5, 5]);
  assert.deepEqual(difficultyCounts, [5, 5, 5, 5, 5]);
  assert.equal(new Set(standardByItem.slice(0, 5)).size, 5, "question topics should be mixed rather than grouped by domain");
  assert.equal(amcExam.items.filter(function (item) { return item.dataTable; }).length, 3);
});

test("the GFIELD AMC 8 style mock records an answer-safe domain summary and its own review path", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  const amcUrl = new URL("amc8-grade7-mock-exam.html", url).href;
  await page.goto(amcUrl, { waitUntil: "networkidle" });
  assert.match(await page.locator("h1").innerText(), /문제를 읽고 연결하는[\s\S]*지필드 경시 모의고사/);
  assert.match(await page.locator("#mock-start-panel").innerText(), /학교·대회 성적을 입력하지 않아요/);
  assert.match(await page.locator("#mock-start-panel").innerText(), /40분 동안 계산기 없이/);
  assert.equal(await page.locator("input").count(), 0);
  await page.getByRole("button", { name: "지필드 모의고사 시작" }).click();
  assert.equal(await page.locator(".mock-question").count(), 25);
  assert.equal(await page.locator(".mock-data-table").count(), 3);
  assert.equal(await page.locator('.mock-question .mock-choice-mark:text-is("E")').count(), 25);
  assert.ok(await page.locator('.mock-question .math-fraction[aria-label="8분의 7"]').count() > 0, "fractions remain stacked in the mock" );
  for (const item of amcExam.items) await page.locator(`#mock-question-${item.id} .mock-choice`).nth(item.answer).click();
  await page.getByRole("button", { name: "답안 제출" }).click();
  assert.match(await page.locator(".mock-score").innerText(), /25 \/ 25/);
  assert.deepEqual(await page.locator(".mock-standard-results article").allInnerTexts(), [
    "수 감각·비율\n5 / 5 정답", "대수·규칙\n5 / 5 정답", "기하·공간\n5 / 5 정답", "경우의 수·확률\n5 / 5 정답", "정수·자료 해석\n5 / 5 정답"
  ]);
  assert.equal(await page.locator(".mock-review .mock-data-table").count(), 3);
  const nextPractice = new URL(await page.locator(".mock-next-study a[href*='amc8-topic-practice']").getAttribute("href"));
  assert.equal(nextPractice.pathname, "/boarding-school-math/amc8-topic-practice.html");
  assert.equal(nextPractice.searchParams.get("grade"), "7");
  assert.match(await page.locator(".mock-result-boundary").innerText(), /다른 회차·학년과 같은 기준으로 비교한 값이 아니며.*학년 등급을 판정하지 않아요/);
  const saved = await page.evaluate(function () { return JSON.parse(localStorage.getItem("gmap-local-learning-record-v1:gfield-mock-result-history-v1")); });
  assert.equal(saved.records[0].examTitle, "지필드 AMC 8 스타일 모의고사 · 2회");
  assert.equal(saved.records[0].score.total, 25);
  assert.equal(saved.records[0].standards.length, 5);
  assert.equal(saved.records[0].reviewFocuses.length, 0);
  assert.doesNotMatch(JSON.stringify(saved), /"(?:responses|answer|studentName|schoolScore)"\s*:/);
  await page.goto(new URL("boarding-roadmap.html?grade=7#grade-map", url).href, { waitUntil: "networkidle" });
  assert.match(await page.locator("#journey-mock-history").innerText(), /지필드 AMC 8 스타일 모의고사[\s\S]*25 \/ 25 정답/);
  assert.deepEqual(errors, []);
  await page.close();
});

test("AMC 8 mock keeps Grade 6 and Grade 8 route context through saved results and follow-up", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  for (const { grade, year } of [{ grade: 6, year: 2024 }, { grade: 8, year: 2025 }]) {
    await page.goto(new URL(`amc8-grade7-mock-exam.html?grade=${grade}&sourceYear=${year}`, url).href, { waitUntil: "networkidle" });
    assert.match(await page.locator("#amc8-source-paper-note").innerText(), new RegExp(`${year} AMC 8 원본과 별도로`));
    assert.match(await page.locator("#mock-back-link").getAttribute("href"), new RegExp(`competition-paper-review\\.html\\?grade=${grade}&program=amc8&year=${year}$`));
    await page.getByRole("button", { name: "지필드 모의고사 시작" }).click();
    for (const item of amcExam.items) await page.locator(`#mock-question-${item.id} .mock-choice`).nth(item.answer).click();
    await page.getByRole("button", { name: "답안 제출" }).click();
    const saved = await page.evaluate(function () { return JSON.parse(localStorage.getItem("gmap-local-learning-record-v1:gfield-mock-result-history-v1")); });
    assert.equal(saved.records[0].grade, grade);
    const nextPractice = new URL(await page.locator(".mock-next-study a[href*='amc8-topic-practice']").getAttribute("href"));
    assert.equal(nextPractice.searchParams.get("grade"), String(grade));
    assert.equal(nextPractice.searchParams.get("sourceYear"), String(year));
  }
  await page.close();
});

test("the Grade 7 proportional mock shows stacked fractions, stores its aggregate, and reaches its workbook and roadmap", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  const rpUrl = new URL("grade7-rp-a-mock-exam.html", url).href;
  await page.goto(rpUrl, { waitUntil: "networkidle" });
  assert.match(await page.locator("h1").innerText(), /비와 비례 관계[\s\S]*단원 모의고사/);
  assert.equal(await page.locator("input").count(), 0);
  await page.getByRole("button", { name: "모의고사 시작" }).click();
  assert.equal(await page.locator(".mock-question").count(), 14);
  assert.ok(await page.locator('.mock-question .math-fraction[aria-label="3분의 2"]').count() > 0, "fractions stay typeset as stacked math");
  for (const item of rpExam.items) await page.locator(`#mock-question-${item.id} .mock-choice`).nth(item.answer).click();
  await page.getByRole("button", { name: "답안 제출" }).click();
  assert.match(await page.locator(".mock-score").innerText(), /14 \/ 14/);
  assert.deepEqual(await page.locator(".mock-standard-results article").allInnerTexts(), ["7.RP.A.1\n4 / 4 정답", "7.RP.A.2\n5 / 5 정답", "7.RP.A.3\n5 / 5 정답"]);
  assert.equal(await page.locator(".mock-next-study a[href*='unit-workbook']").getAttribute("href"), "./unit-workbook.html?cluster=7.RP.A&mode=workbook&audience=student&locale=ko&paper=A4");
  const history = await page.evaluate(function () { return JSON.parse(localStorage.getItem("gmap-local-learning-record-v1:gfield-mock-result-history-v1")); });
  assert.equal(history.records[0].examTitle, "7.RP.A 비와 비례 관계");
  assert.equal(history.records[0].score.correct, 14);
  assert.doesNotMatch(JSON.stringify(history), /"(?:responses|answer|studentName|schoolScore)"\s*:/);
  await page.goto(new URL("boarding-roadmap.html?grade=7#grade-map", url).href, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#journey-mock-history").isVisible(), true);
  assert.match(await page.locator("#journey-mock-history").innerText(), /7\.RP\.A 비와 비례 관계[\s\S]*14 \/ 14 정답/);
  assert.equal(await page.evaluate(function () { return document.documentElement.scrollWidth === document.documentElement.clientWidth; }), true);
  assert.deepEqual(errors, []);
  await page.close();
});

test("the mock hides answers until submission and returns only this attempt's item and standard results", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  await page.goto(url, { waitUntil: "networkidle" });
  assert.match(await page.locator("h1").innerText(), /유리수 연산[\s\S]*단원 모의고사/);
  assert.match(await page.locator("#mock-start-panel").innerText(), /이름이나 외부 성적을 입력하지 않아요/);
  assert.equal(await page.locator("input").count(), 0, "the mock must not request school scores or personal identifiers");
  await page.getByRole("button", { name: "모의고사 시작" }).click();
  assert.equal(await page.locator(".mock-question").count(), 14);
  assert.equal(await page.locator("#mock-timer").innerText(), "40:00");
  assert.ok(await page.locator('.mock-question .math-fraction[aria-label="12분의 1"]').count() > 0, "fraction notation is displayed as a stacked fraction");
  assert.equal(await page.locator(".mock-review").count(), 0, "answers and worked solutions remain hidden before submission");
  const items = exam.items;
  for (let index = 0; index < items.length; index += 1) {
    await page.locator(`#mock-question-${items[index].id} .mock-choice`).nth(items[index].answer).click();
  }
  assert.equal(await page.locator("#mock-progress").innerText(), "14 / 14 응답");
  await page.getByRole("button", { name: "답안 제출" }).click();
  assert.equal(await page.locator("#mock-results").isVisible(), true);
  assert.match(await page.locator(".mock-score").innerText(), /14 \/ 14[\s\S]*14문항 응답/);
  assert.deepEqual(await page.locator(".mock-standard-results article").allInnerTexts(), [
    "7.NS.A.1\n5 / 5 정답", "7.NS.A.2\n5 / 5 정답", "7.NS.A.3\n4 / 4 정답"
  ]);
  assert.match(await page.locator(".mock-next-study").innerText(), /모든 문항을 맞혔어요.*전체 영역의 숙달을 판단하지 않고/);
  assert.equal(await page.locator(".mock-next-study a[href*='unit-workbook']").getAttribute("href"), "./unit-workbook.html?cluster=7.NS.A&mode=workbook&audience=student&locale=ko&paper=A4");
  assert.equal(await page.locator(".mock-review article[data-correct='true']").count(), 14);
  assert.ok(await page.locator('.mock-review .math-fraction[aria-label="12분의 1"]').count() > 0);
  assert.match(await page.locator(".mock-result-boundary").innerText(), /다른 회차·학년과 같은 기준으로 비교한 값이 아니며.*학년 등급을 판정하지 않아요/);
  const saved = await page.evaluate(function () { return JSON.parse(localStorage.getItem("gmap-local-learning-record-v1:gfield-mock-result-history-v1")); });
  assert.equal(saved.records[0].score.correct, 14);
  assert.equal(saved.records[0].standards.length, 3);
  assert.equal(saved.records[0].reviewFocuses.length, 0);
  assert.doesNotMatch(JSON.stringify(saved), /"(?:responses|answer|studentName|schoolScore)"\s*:/);
  assert.equal(await page.locator(".mock-roadmap-result-link").getAttribute("href"), "./boarding-roadmap.html?grade=7#grade-practice");
  assert.equal(await page.evaluate(function () { return document.documentElement.scrollWidth === document.documentElement.clientWidth; }), true);
  assert.deepEqual(errors, []);
  await page.close();
});

test("saved mock summary appears in the Grade 7 roadmap without exposing item answers", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "모의고사 시작" }).click();
  for (const item of exam.items) await page.locator(`#mock-question-${item.id} .mock-choice`).nth(item.answer).click();
  await page.getByRole("button", { name: "답안 제출" }).click();
  await page.goto(new URL("boarding-roadmap.html?grade=7#grade-map", url).href, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#journey-mock-history").isVisible(), true);
  assert.match(await page.locator("#journey-mock-history").innerText(), /최근 지필드 모의고사[\s\S]*14 \/ 14 정답[\s\S]*7\.NS\.A\.1 · 5\/5/);
  assert.equal(await page.locator("#journey-mock-history input").count(), 0);
  assert.equal(await page.evaluate(function () { return document.documentElement.scrollWidth === document.documentElement.clientWidth; }), true);
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
  assert.match(await page.locator(".mock-score").innerText(), /1 \/ 14[\s\S]*1문항 응답/);
  assert.match(await page.locator(".mock-next-study").innerText(), /복습할 문제.*등급을 정하지 않고/);
  assert.match(await page.locator(".mock-review article").first().innerText(), new RegExp(`정답 ${"ABCD"[exam.items[0].answer]}`));
  assert.match(await page.locator(".mock-review article").nth(1).innerText(), /미응답/);
  assert.equal(await page.evaluate(function () { return document.documentElement.scrollWidth === document.documentElement.clientWidth; }), true);
  await page.close();
});
