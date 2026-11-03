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
  await new Promise(function (resolve) { server.listen(0, "127.0.0.1", resolve); });
  url = `http://127.0.0.1:${server.address().port}/boarding-school-math/competition-paper-review.html`;
  const launchOptions = { headless: true };
  if (process.env.GFIELD_CHROME_EXECUTABLE) launchOptions.executablePath = process.env.GFIELD_CHROME_EXECUTABLE;
  browser = await chromium.launch(launchOptions);
});
test.after(async function () { if (browser) await browser.close(); if (server) await new Promise(function (resolve) { server.close(resolve); }); });

test("yearly AMC originals expose print, answer entry, and local self-marking", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${url}?grade=7&program=amc8&year=2023`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#archive-year option").count(), 41);
  assert.equal(await page.locator("#archive-open-link").getAttribute("href"), "https://live.poshenloh.com/past-contests/amc8/2023");
  assert.match(await page.locator("#archive-open-link").innerText(), /2023 AMC 8.*인쇄·응시·해설/);
  await page.locator('[data-question="1"][data-field="answer"]').selectOption("E");
  await page.locator('[data-question="1"][data-field="status"]').selectOption("wrong");
  await page.locator('[data-question="1"][data-field="domain"]').selectOption("number");
  await page.locator('[data-question="1"][data-field="reason"]').selectOption("approach");
  await page.locator("#review-exam-date").fill("2026-11-04");
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.match(await page.locator("#report-review-items-list").innerText(), /1번 · 오답 · 내 답 E/);
  await page.locator("#save-diagnostic").click();
  const saved = await page.evaluate(() => localStorage.getItem("gmap-local-learning-record-v1:competition-diagnostic-history-v1"));
  assert.doesNotMatch(saved, /answer|responses|questionNumber/i);
  await page.locator("#review-program").selectOption("amc10");
  await page.locator("#archive-year").selectOption("2021");
  assert.deepEqual(await page.locator("#archive-form option").allTextContents(), ["A형", "B형", "C형", "D형"]);
  await page.locator("#archive-form").selectOption("D");
  assert.equal(await page.locator("#archive-open-link").getAttribute("href"), "https://live.poshenloh.com/past-contests/amc10/2021D");
  assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [390, 390]);
  assert.deepEqual(errors, []);
  await page.close();
});

test("AMC 12 archive picker reaches the earliest listed year", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${url}?grade=10&program=amc12&year=1950`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#archive-year option").count(), 76);
  assert.equal(await page.locator("#archive-year").inputValue(), "1950");
  assert.equal(await page.locator("#archive-open-link").getAttribute("href"), "https://live.poshenloh.com/past-contests/amc12/1950");
  assert.equal(await page.locator(".paper-mark-row").count(), 50);
  assert.match(await page.locator("#review-source-note").innerText(), /AHSME 1950 · 50문항/);
  assert.match(await page.locator("#review-source-note").innerText(), /초기 회차는 문항별 배점이 달라/);
  await page.locator("#archive-year").selectOption("1975");
  assert.equal(await page.locator(".paper-mark-row").count(), 30);
  assert.match(await page.locator("#review-source-note").innerText(), /AHSME 1975 · 30문항 · 80분/);
  await page.locator("#archive-year").selectOption("1977");
  assert.match(await page.locator("#review-source-note").innerText(), /AHSME 1977 · 30문항 · 90분/);
  await page.locator("#archive-year").selectOption("2001");
  assert.equal(await page.locator(".paper-mark-row").count(), 25);
  assert.equal(await page.locator("#archive-form-field").isHidden(), true);
  await page.locator("#archive-year").selectOption("2021");
  assert.deepEqual(await page.locator("#archive-form option").allTextContents(), ["A형", "B형", "C형", "D형"]);
  await page.close();
});

test("complete AMC papers compare only with the matching MAA year and form cohort", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${url}?grade=10&program=amc12&year=2025&form=B`, { waitUntil: "networkidle" });
  for (let question = 1; question <= 25; question += 1) {
    await page.locator(`[data-question="${question}"][data-field="status"]`).selectOption(question <= 19 ? "correct" : "wrong");
    if (question > 19) await page.locator(`[data-question="${question}"][data-field="reason"]`).selectOption("concept");
  }
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.equal(await page.locator("#amc-cohort-reference").isVisible(), true);
  assert.match(await page.locator("#amc-cohort-summary").innerText(), /2025 AMC 12 B · 114 \/ 150점/);
  const bands = page.locator("#amc-cohort-bands .paper-question-band");
  assert.equal(await bands.count(), 7);
  assert.match(await bands.nth(3).innerText(), /상위 10% 기준[\s\S]*109\.5 \/ 150[\s\S]*기준점 이상/);
  assert.match(await bands.nth(2).innerText(), /상위 5% 기준[\s\S]*127\.5 \/ 150[\s\S]*기준점 미만/);
  assert.match(await page.locator("#amc-cohort-stats").innerText(), /MAA 보고서 표본 16,432명/);
  assert.equal(await page.locator("#amc-cohort-source").getAttribute("href"), "https://maa.edvistas.com/eduview/report.aspx?mode=6&r500=&view=1561&schoolyear=2026&amccomp=81058&viewClicked=true");
  assert.match(await page.locator("#amc-cohort-reference").innerText(), /학년별 순위·등급/);
  assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [390, 390]);
  assert.deepEqual(errors, []);
  await page.close();
});

test("Grade 9 AMC 10 review shows the matching 2025 A cohort and rejects grade-rank interpretation", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(`${url}?grade=9&program=amc10&year=2025&form=A`, { waitUntil: "networkidle" });
  for (let question = 1; question <= 25; question += 1) {
    await page.locator(`[data-question="${question}"][data-field="status"]`).selectOption("correct");
  }
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.equal(await page.locator("#amc-cohort-reference").isVisible(), true);
  assert.match(await page.locator("#amc-cohort-summary").innerText(), /2025 AMC 10 A · 150 \/ 150점/);
  assert.match(await page.locator("#amc-cohort-bands").innerText(), /상위 1% 기준[\s\S]*150 \/ 150[\s\S]*기준점 이상/);
  assert.match(await page.locator("#amc-cohort-stats").innerText(), /MAA 보고서 표본 31,600명 · 학교 1,956곳/);
  assert.match(await page.locator("#amc-cohort-reference").innerText(), /응시 학년별 순위·등급/);
  assert.equal(await page.locator("#amc-cohort-source").getAttribute("href"), "https://maa.edvistas.com/eduview/report.aspx?mode=6&r500=&view=1561&schoolyear=2026&amccomp=81054&viewClicked=true");
  assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [390, 390]);
  assert.deepEqual(errors, []);
  await page.close();
});

test("AMC cohort reference stays hidden for incomplete or unavailable paper-year records", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${url}?grade=7&program=amc8&year=2026`, { waitUntil: "networkidle" });
  await page.locator('[data-question="1"][data-field="status"]').selectOption("correct");
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.equal(await page.locator("#amc-cohort-reference").isHidden(), true);
  for (let question = 1; question <= 25; question += 1) {
    await page.locator(`[data-question="${question}"][data-field="status"]`).selectOption("correct");
  }
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.equal(await page.locator("#amc-cohort-reference").isVisible(), true);
  assert.match(await page.locator("#amc-cohort-summary").innerText(), /2026 AMC 8 · 25 \/ 25점/);
  await page.locator("#archive-year").selectOption("2022");
  for (let question = 1; question <= 25; question += 1) {
    await page.locator(`[data-question="${question}"][data-field="status"]`).selectOption("correct");
  }
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.equal(await page.locator("#amc-cohort-reference").isHidden(), true);
  assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [1280, 1280]);
  await page.close();
});

test("AMC 12 original review routes into the complete GFIELD mock and then matching practice", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${url}?grade=10&program=amc12&year=2025&form=A`, { waitUntil: "networkidle" });
  assert.equal(await page.locator('[data-question="1"][data-field="domain"] option[value="functions"]').count(), 1);
  await page.locator('[data-question="5"][data-field="answer"]').selectOption("C");
  await page.locator('[data-question="5"][data-field="status"]').selectOption("wrong");
  await page.locator('[data-question="5"][data-field="domain"]').selectOption("functions");
  await page.locator('[data-question="5"][data-field="reason"]').selectOption("concept");
  await page.getByRole("button", { name: "결과 보기" }).click();
  const href = await page.locator("#report-follow-up-link").getAttribute("href");
  assert.equal(href, "./amc12-gfield-mock-exam.html?grade=10&domains=functions&sourceYear=2025&sourceForm=A&sourceQuestions=5");
  await page.goto(new URL(href, url).toString(), { waitUntil: "networkidle" });
  assert.match(await page.locator("#amc12-source-paper-note").innerText(), /2025 AMC 12 A형 원본 다음/);
  assert.equal(await page.locator("#amc12-mock-back").getAttribute("href"), "http://127.0.0.1:" + new URL(url).port + "/boarding-school-math/competition-paper-review.html?grade=10&program=amc12&year=2025&form=A");
  await page.locator("#mock-start").click();
  assert.equal(await page.locator(".mock-question").count(), 25);
  assert.equal(await page.locator("#mock-timer").innerText(), "75:00");
  const mockItems = await page.evaluate(() => window.GFIELDAMC12Mock.items.map((item) => ({ id: item.id, answer: item.answer })));
  for (let index = 0; index < mockItems.length; index += 1) {
    const choice = index === 3 ? (mockItems[index].answer + 1) % 5 : mockItems[index].answer;
    await page.locator(`#mock-question-${mockItems[index].id} .mock-choice`).nth(choice).click();
  }
  assert.equal(await page.locator("#mock-progress").innerText(), "25 / 25 응답");
  await page.locator("#mock-submit").click();
  assert.match(await page.locator("#mock-results .mock-score").innerText(), /24 \/ 25/);
  assert.equal(await page.locator("#mock-results .mock-standard-results article").count(), 5);
  const nextStudy = await page.locator("#mock-results .mock-next-study a").first().getAttribute("href");
  assert.match(nextStudy, /amc12-practice\.html/);
  assert.match(nextStudy, /domains=geometry/);
  assert.match(nextStudy, /sourceYear=2025/);
  assert.match(nextStudy, /sourceForm=A/);
  assert.match(nextStudy, /sourceQuestions=5/);
  assert.match(nextStudy, /mockWrongQuestions=4/);
  await page.goto(new URL(nextStudy, url).toString(), { waitUntil: "networkidle" });
  assert.match(await page.locator("#targeted-practice-description").innerText(), /지필드 모의고사에서 틀리거나 비워 둔 4번 문항 · 2025 AMC 12 A 원본에서 표시한 5번 문항 이후 기하 영역/);
  assert.equal(await page.locator(".problem-card").count(), 3);
  assert.equal(await page.locator("#practice-progress").innerText(), "0 / 3");
  await page.locator('#problem-amc12-g9-geometry-01 [data-choice="4"]').click();
  assert.match(await page.locator("#problem-amc12-g9-geometry-01 .feedback").innerText(), /정답이 아니에요/);
  await page.locator('#problem-amc12-g9-geometry-01 [data-choice="3"]').click();
  assert.match(await page.locator("#problem-amc12-g9-geometry-01 .feedback").innerText(), /맞았어요/);
  await page.locator("#problem-amc12-g9-geometry-01 .worked-solution summary").nth(1).click();
  assert.match(await page.locator("#problem-amc12-g9-geometry-01 .worked-solution").nth(1).innerText(), /반지름은\s+15\s+2\s+입니다/);
  await page.goto(`${new URL("./amc12-practice.html", url)}?grade=10&sourceYear=2021&sourceForm=D`, { waitUntil: "networkidle" });
  assert.match(await page.locator("#targeted-practice-description").innerText(), /2021 AMC 12 D 원본/);
  assert.equal(await page.locator("body").evaluate((node) => node.scrollWidth <= node.clientWidth), true);
  assert.deepEqual(errors, []);
  await page.close();
});

test("AMC 8 yearly original review flows through a full mock into diagnosed GFIELD topic practice", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${url}?grade=7&program=amc8&year=2023`, { waitUntil: "networkidle" });
  await page.locator('[data-question="4"][data-field="status"]').selectOption("wrong");
  await page.locator('[data-question="4"][data-field="domain"]').selectOption("number");
  await page.locator('[data-question="7"][data-field="status"]').selectOption("blank");
  await page.locator('[data-question="7"][data-field="domain"]').selectOption("data");
  await page.getByRole("button", { name: "결과 보기" }).click();
  const href = await page.locator("#report-follow-up-link").getAttribute("href");
  assert.match(href, /^\.\/amc8-grade7-mock-exam\.html\?/);
  const target = new URL(href, "http://127.0.0.1");
  assert.equal(target.searchParams.get("grade"), "7");
  assert.equal(target.searchParams.get("sourceYear"), "2023");
  assert.equal(target.searchParams.get("sourceQuestions"), "4,7");
  await page.goto(new URL(href, url).href, { waitUntil: "networkidle" });
  assert.match(await page.locator("#amc8-source-paper-note").innerText(), /2023 AMC 8 원본과 별도로/);
  assert.match(await page.locator("#mock-back-link").getAttribute("href"), /\/competition-paper-review\.html\?grade=7&program=amc8&year=2023$/);
  await page.getByRole("button", { name: "지필드 모의고사 시작" }).click();
  const mockItems = await page.evaluate(() => window.GFIELDGrade7UnitMock.items.map(({ id, answer, choices }) => ({ id, answer, choiceCount: choices.length })));
  for (let index = 0; index < mockItems.length; index += 1) {
    const item = mockItems[index];
    const choiceIndex = index === 4 || index === 15 ? (item.answer + 1) % item.choiceCount : item.answer;
    await page.locator(`#mock-question-${item.id} .mock-choice`).nth(choiceIndex).click();
  }
  await page.getByRole("button", { name: "답안 제출" }).click();
  assert.match(await page.locator(".mock-score").innerText(), /23 \/ 25/);
  const followUp = await page.locator(".mock-next-study a[href*='amc8-topic-practice']").getAttribute("href");
  assert.match(followUp, /\/amc8-topic-practice\.html\?/);
  const followUpUrl = new URL(followUp, "http://127.0.0.1");
  assert.equal(followUpUrl.searchParams.get("grade"), "7");
  assert.equal(followUpUrl.searchParams.get("domains"), "data,number");
  assert.equal(followUpUrl.searchParams.get("sourceYear"), "2023");
  assert.equal(followUpUrl.searchParams.get("sourceQuestions"), "4,7");
  assert.equal(followUpUrl.searchParams.get("mockWrongQuestions"), "5,16");
  await page.goto(new URL(followUp, url).href, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".problem-card").count(), 10);
  assert.match(await page.locator("#topic-intro-copy").innerText(), /지필드 모의고사 5, 16번.*2023 AMC 8 원본 복습.*그래프·표 해석·수·비례·추정/);
  assert.match(await page.locator("#topic-source-summary").innerText(), /2023 AMC 8.*지필드 모의고사 5, 16번/);
  assert.equal(await page.locator("#topic-source-paper-link").getAttribute("href"), "https://live.poshenloh.com/past-contests/amc8/2023");
  assert.equal(await page.locator("#topic-return-link").getAttribute("href"), "./competition-paper-review.html?grade=7&program=amc8&year=2023");
  const firstTopicItem = page.locator('.problem-card[data-item-id="amc8-g7-v2-m01"]');
  await firstTopicItem.locator('[data-choice="0"]').click();
  assert.equal(await firstTopicItem.getAttribute("data-solved"), "true");
  await firstTopicItem.locator(".worked-solution summary").click();
  assert.match(await firstTopicItem.locator(".worked-solution").innerText(), /1,000/);
  assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [390, 390]);
  assert.deepEqual(errors, []);
  await page.close();
});

test("AMC 10 original review leads to a full mock and practice follows the mock's actual weak domain", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${url}?grade=9&program=amc10&year=2021&form=D`, { waitUntil: "networkidle" });
  await page.locator('[data-question="3"][data-field="status"]').selectOption("wrong");
  await page.locator('[data-question="3"][data-field="domain"]').selectOption("number");
  await page.locator('[data-question="8"][data-field="status"]').selectOption("wrong");
  await page.locator('[data-question="8"][data-field="domain"]').selectOption("algebra");
  await page.getByRole("button", { name: "결과 보기" }).click();
  const href = await page.locator("#report-follow-up-link").getAttribute("href");
  assert.match(href, /^\.\/amc10-gfield-mock-exam\.html\?/);
  const target = new URL(href, "http://127.0.0.1");
  assert.equal(target.searchParams.get("domains"), "number,algebra");
  assert.equal(target.searchParams.get("sourceYear"), "2021");
  assert.equal(target.searchParams.get("sourceForm"), "D");
  assert.equal(target.searchParams.get("sourceQuestions"), "3,8");
  await page.goto(new URL(href, url).href, { waitUntil: "networkidle" });
  assert.match(await page.locator("#amc10-source-paper-note").innerText(), /2021 AMC 10 D 원본/);
  assert.match(await page.locator("#amc10-mock-back").getAttribute("href"), /program=amc10&year=2021&form=D/);
  await page.locator("#mock-start").click();
  assert.equal(await page.locator(".mock-question").count(), 25);
  assert.equal(await page.locator("#mock-timer").innerText(), "75:00");
  const mockItems = await page.evaluate(() => window.GFIELDAMC10Mock.items.map(item => ({ id: item.id, answer: item.answer })));
  for (let index = 0; index < mockItems.length; index += 1) {
    const choice = index === 12 ? (mockItems[index].answer + 1) % 5 : mockItems[index].answer;
    await page.locator(`#mock-question-${mockItems[index].id} .mock-choice`).nth(choice).click();
  }
  await page.locator("#mock-submit").click();
  assert.match(await page.locator("#mock-results .mock-score").innerText(), /24 \/ 25/);
  const nextStudy = await page.locator("#mock-results .mock-next-study a").first().getAttribute("href");
  const next = new URL(nextStudy, "http://127.0.0.1");
  assert.equal(next.pathname, "/boarding-school-math/amc10-practice.html");
  assert.equal(next.searchParams.get("domains"), "geometry");
  assert.equal(next.searchParams.get("sourceYear"), "2021");
  assert.equal(next.searchParams.get("sourceForm"), "D");
  assert.equal(next.searchParams.get("sourceQuestions"), "3,8");
  assert.equal(next.searchParams.get("mockWrongQuestions"), "13");
  await page.goto(new URL(nextStudy, url).href, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".problem-card").count(), 3);
  assert.match(await page.locator("#targeted-practice-description").innerText(), /지필드 모의고사 13번.*2021 AMC 10 D 원본에서 표시한 3, 8번 문항 이후 기하 영역/);
  assert.equal(await page.locator("#targeted-practice-return").getAttribute("href"), "./competition-paper-review.html?grade=9&program=amc10&year=2021&form=D");
  assert.equal(await page.locator("#targeted-source-paper").getAttribute("href"), "https://live.poshenloh.com/past-contests/amc10/2021D");
  assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [390, 390]);
  assert.deepEqual(errors, []);
  await page.close();
});

test("AMC 10 direct filtering keeps the 2021 D paper route and links back to its solutions", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(`${url.replace("competition-paper-review.html", "amc10-practice.html")}?grade=9&domains=number,algebra&sourceYear=2021&sourceForm=D&sourceQuestions=3,8`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".problem-card").count(), 6);
  assert.equal(await page.locator("#practice-count").innerText(), "6문항");
  assert.equal(await page.locator("#practice-progress").innerText(), "0 / 6");
  assert.equal(await page.locator("#targeted-practice-note").isVisible(), true);
  assert.match(await page.locator("#targeted-practice-description").innerText(), /2021 AMC 10 D 원본에서 표시한 3, 8번 문항 이후 정수론·대수 영역/);
  assert.equal(await page.locator("#targeted-practice-return").getAttribute("href"), "./competition-paper-review.html?grade=9&program=amc10&year=2021&form=D");
  assert.equal(await page.locator("#targeted-source-paper").getAttribute("href"), "https://live.poshenloh.com/past-contests/amc10/2021D");
  assert.equal(await page.locator("#targeted-source-paper").isVisible(), true);
  const firstNumberItem = page.locator('.problem-card[data-item-id="amc10-g7-number-01"]');
  await firstNumberItem.locator('[data-choice="3"]').click();
  assert.equal(await page.locator("#practice-progress").innerText(), "1 / 6");
  await page.getByRole("button", { name: "선택 지우기" }).click();
  assert.equal(await page.locator("#practice-progress").innerText(), "0 / 6");
  assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [390, 390]);
  assert.deepEqual(errors, []);
  await page.close();
});

test("users can opt to save an answer-free AMC review summary and see it only on the matching grade map", async function () {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${url}?grade=7&program=amc8`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#official-paper-sources").isVisible(), true);
  assert.equal(await page.locator("#archive-year option").count(), 41);
  assert.equal(await page.locator("#archive-year").inputValue(), "2026");
  await page.locator("#archive-year").selectOption("2023");
  assert.equal(await page.locator("#archive-open-link").getAttribute("href"), "https://live.poshenloh.com/past-contests/amc8/2023");
  assert.match(await page.locator("#archive-open-link").innerText(), /2023 AMC 8.*인쇄·응시·해설/);
  assert.equal(await page.locator("#review-paper-label").inputValue(), "2023 AMC 8");
  assert.deepEqual(await page.locator('[data-question="1"][data-field="domain"] option').allTextContents(), ["영역 선택", "식·대수", "수·비례·추정", "기하·공간", "경우의 수·확률", "그래프·표 해석"]);
  await page.locator("#review-exam-date").fill("2026-10-29");
  await page.locator("#review-paper-label").fill("Practice A");
  await page.locator('[data-question="1"][data-field="answer"]').selectOption("C");
  assert.match(await page.locator("#mark-progress").innerText(), /답 입력 1문제/);
  await page.locator('[data-question="1"][data-field="status"]').selectOption("correct");
  await page.locator('[data-question="1"][data-field="domain"]').selectOption("algebra");
  await page.locator('[data-question="2"][data-field="status"]').selectOption("wrong");
  await page.locator('[data-question="2"][data-field="domain"]').selectOption("geometry");
  await page.locator('[data-question="2"][data-field="reason"]').selectOption("reading");
  await page.locator('[data-question="3"][data-field="status"]').selectOption("blank");
  await page.locator('[data-question="3"][data-field="domain"]').selectOption("counting");
  await page.locator('[data-question="3"][data-field="reason"]').selectOption("skipped");
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.equal(await page.locator("#save-diagnostic").isVisible(), true);
  assert.equal(await page.locator("#save-diagnostic").innerText(), "복습 요약을 기기에 저장");
  await page.locator("#save-diagnostic").click();
  assert.match(await page.locator("#diagnostic-save-status").innerText(), /저장한 정답·오답·미응답 수와 영역별 합계로 입력 결과 일부를 유추할 수 있어요/);
  assert.equal(await page.locator("#save-diagnostic").isDisabled(), true);
  assert.equal(await page.locator(".saved-diagnostic-entry").count(), 1);
  const savedDomains = page.locator(".saved-diagnostic-entry-domains > div");
  assert.equal(await savedDomains.count(), 5);
  assert.match(await page.locator(".saved-diagnostic-entry-domains").innerText(), /그래프·표 해석/);
  await page.setViewportSize({ width: 1440, height: 1000 });
  const desktopDomainRows = await savedDomains.evaluateAll((nodes) => nodes.map((node) => { const rect = node.getBoundingClientRect(); return { y: rect.y, width: rect.width }; }));
  assert.ok(Math.max(...desktopDomainRows.map((entry) => entry.y)) - Math.min(...desktopDomainRows.map((entry) => entry.y)) < 2 && desktopDomainRows.every((entry) => entry.width >= 150), `all five saved areas share a readable desktop row: ${JSON.stringify(desktopDomainRows)}`);
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.locator("#saved-diagnostic-list").getAttribute("aria-live"), null);
  assert.match(await page.locator(".saved-diagnostic-entry").innerText(), /일부 입력 3\/25/);
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.equal(await page.locator("#save-diagnostic").isDisabled(), true);
  assert.match(await page.locator("#diagnostic-save-status").innerText(), /복습 요약을 이 기기에 저장했어요/);
  await page.locator(".saved-diagnostic-remove").click();
  const afterRemove = await page.evaluate(function () { return { hidden: document.getElementById("saved-diagnostic-history").hidden, rows: document.querySelectorAll(".saved-diagnostic-entry").length, raw: localStorage.getItem("gmap-local-learning-record-v1:competition-diagnostic-history-v1") }; });
  assert.equal(await page.locator("#saved-diagnostic-history").isVisible(), false, JSON.stringify(afterRemove));
  assert.equal(afterRemove.hidden, true);
  assert.equal(afterRemove.rows, 0);
  assert.equal(JSON.parse(afterRemove.raw).records.length, 0);
  await page.locator("#save-diagnostic").click();
  assert.equal(await page.locator(".saved-diagnostic-entry").count(), 1);
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [390, 390]);
  const raw = await page.evaluate(function () { return localStorage.getItem("gmap-local-learning-record-v1:competition-diagnostic-history-v1"); });
  assert.doesNotMatch(raw, /responses|answer|correct-answer/);
  assert.doesNotMatch(raw, /skipped|could-not-start|시간 부족/);
  await page.locator("#review-exam-date").fill("2026-10-30");
  await page.locator("#review-paper-label").fill(`Practice B-${"X".repeat(69)}`);
  await page.locator('[data-question="1"][data-field="status"]').selectOption("wrong");
  await page.locator('[data-question="1"][data-field="domain"]').selectOption("algebra");
  await page.locator('[data-question="1"][data-field="reason"]').selectOption("concept");
  await page.locator('[data-question="2"][data-field="status"]').selectOption("correct");
  await page.locator('[data-question="2"][data-field="domain"]').selectOption("algebra");
  await page.locator('[data-question="3"][data-field="status"]').selectOption("wrong");
  await page.locator('[data-question="3"][data-field="domain"]').selectOption("algebra");
  await page.locator('[data-question="3"][data-field="reason"]').selectOption("calculation");
  await page.getByRole("button", { name: "결과 보기" }).click();
  await page.locator("#save-diagnostic").click();
  assert.equal(await page.locator(".saved-diagnostic-entry").count(), 2);
  await page.evaluate(function () {
    const key = "gmap-local-learning-record-v1:competition-diagnostic-history-v1";
    const history = JSON.parse(localStorage.getItem(key));
    history.records.push({ ...history.records[1], id: "undated-practice", examDate: null, paperLabel: "Undated practice", savedAt: "2099-01-01T00:00:00.000Z" });
    localStorage.setItem(key, JSON.stringify(history));
  });
  await page.goto(`${url.replace("competition-paper-review.html", "boarding-roadmap.html")}?grade=7&program=amc8`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#competition-select").inputValue(), "amc8");
  assert.equal(await page.locator("#competition-saved-diagnostic").isVisible(), true);
  assert.equal(await page.locator("#competition-saved-title").innerText(), "AMC 8 · Grade 7");
  assert.match(await page.locator("#competition-saved-meta").innerText(), /Practice B/);
  assert.match(await page.locator("#competition-saved-domains").innerText(), /식·대수[\s\S]*1\/3 · 33%/);
  assert.equal(await page.locator("#competition-review-guidance").isVisible(), true);
  assert.match(await page.locator("#competition-review-guidance-list").innerText(), /계산으로 표시한 오답은 중간식을 남기고 어림이나 역산/);
  assert.match(await page.locator("#competition-review-guidance-list").innerText(), /개념으로 표시한 오답은 정의와 성질/);
  assert.match(await page.locator("#competition-review-guidance-list").innerText(), /표시하지 않은 22문항은 이 요약과 비교에 포함되지 않아요/);
  assert.doesNotMatch(await page.locator("#competition-review-guidance-list").innerText(), /낮았어요/);
  assert.equal(await page.locator("#competition-record-pair").isVisible(), true);
  assert.equal(await page.locator(".competition-record-pair-card").count(), 2);
  const pairText = await page.locator("#competition-record-pair-cards").innerText();
  assert.match(pairText, /최근 기록 · Practice B[\s\S]*식·대수: 1\/3 · 33%[\s\S]*이전 기록 · Practice A[\s\S]*식·대수: 1\/1 · 비율 비교 보류/);
  assert.doesNotMatch(pairText, /Undated practice/);
  assert.match(pairText, /정답 1 · 오답 2 · 미응답 0 · 표시 안 함 22 · 영역 분류 3\/25/);
  assert.match(pairText, /오답 이유 2\/2 분류 · 개념 1 · 계산 1/);
  assert.match(pairText, /오답 이유 1\/1 분류 · 조건 읽기 1/);
  assert.match(pairText, /경우의 수·확률: 미측정 · 미응답 1/);
  for (const card of await page.locator(".competition-record-pair-card").all()) {
    const label = await card.getAttribute("aria-labelledby");
    assert.ok(label);
    assert.equal(await card.locator(`#${label}`).count(), 1);
  }
  assert.match(await page.locator(".competition-record-pair-note").innerText(), /난도는 보정하지 않으므로 차이를 성장이나 실력 등급으로 해석하지 않습니다/);
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [390, 390]);
  assert.equal(await page.locator("#competition-record-pair-cards").evaluate(function (node) { return getComputedStyle(node).gridTemplateColumns.split(" ").length; }), 1);
  await page.setViewportSize({ width: 1280, height: 900 });
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [1280, 1280]);
  assert.equal(await page.locator("#competition-record-pair-cards").evaluate(function (node) { return getComputedStyle(node).gridTemplateColumns.split(" ").length; }), 2);
  await page.setViewportSize({ width: 768, height: 900 });
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [768, 768]);
  assert.equal(await page.locator("#competition-record-pair-cards").evaluate(function (node) { return getComputedStyle(node).gridTemplateColumns.split(" ").length; }), 2);
  await page.goto(`${url.replace("competition-paper-review.html", "boarding-roadmap.html")}?grade=8`, { waitUntil: "networkidle" });
  await page.locator("#competition-select").selectOption("amc8");
  assert.equal(await page.locator("#competition-saved-diagnostic").isVisible(), false);
  assert.equal(await page.locator("#competition-record-pair").isVisible(), false);
  assert.deepEqual(errors, []);
  await context.close();
});

test("Grade 7 paper marks yield partial learning review and no score estimate", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${url}?grade=7&program=amc8`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".paper-mark-row").count(), 25);
  assert.equal(await page.locator("#mark-progress").innerText(), "0 / 25문제 채점 확인 · 답 입력 0문제");
  assert.deepEqual(await page.locator('[data-question="1"][data-field="answer"] option').allTextContents(), ["미입력", "A", "B", "C", "D", "E"]);
  assert.equal(await page.locator('[data-field="status"]').first().inputValue(), "unmarked");
  await page.locator('[data-question="1"][data-field="status"]').selectOption("correct");
  await page.locator('[data-question="1"][data-field="domain"]').selectOption("algebra");
  await page.locator('[data-question="2"][data-field="status"]').selectOption("wrong");
  await page.locator('[data-question="2"][data-field="answer"]').selectOption("D");
  await page.locator('[data-question="2"][data-field="domain"]').selectOption("algebra");
  await page.locator('[data-question="2"][data-field="reason"]').selectOption("reading");
  await page.locator('[data-question="3"][data-field="status"]').selectOption("blank");
  assert.equal(await page.locator("#mark-progress").innerText(), "3 / 25문제 채점 확인 · 답 입력 1문제");
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.match(await page.locator("#report-title").innerText(), /입력한 결과/);
  assert.match(await page.locator("#report-intro").innerText(), /22문제는 표시하지 않았습니다/);
  assert.match(await page.locator("#score-estimate-note").innerText(), /참고 원점수는 25문항을 모두 표시한 뒤/);
  assert.match(await page.locator("#report-metrics").innerText(), /1\/2/);
  assert.match(await page.locator("#report-domains h3").innerText(), /직접 분류한 영역 · 2\/25문항/);
  assert.match(await page.locator("#report-reasons h3").first().innerText(), /1\/1개 분류/);
  assert.equal(await page.locator("#report-roadmap-link").getAttribute("href"), "./boarding-roadmap.html?grade=7&program=amc8#grade-map");
  assert.equal(await page.locator("#report-roadmap-link").innerText(), "선택한 Grade 7 학습 경로 보기 →");
  assert.equal(await page.locator("#report-roadmap-link").getAttribute("aria-describedby"), "report-roadmap-note");
  assert.match(await page.locator("#report-roadmap-note").innerText(), /문항 분류와 정답률은 학년 수준을 판정하지 않습니다/);
  assert.doesNotMatch(await page.locator("#report-metrics").innerText(), /50%/);
  assert.doesNotMatch(await page.locator("#report-domains").innerText(), /50%/);
  assert.equal(await page.locator("#report-title").evaluate((node) => node === document.activeElement), true);
  assert.match(await page.locator("#report-reasons").innerText(), /조건 읽기 · 1문항/);
  assert.match(await page.locator("#report-review-items-list").innerText(), /2번 · 오답 · 내 답 D/);
  assert.match(await page.locator(".report-boundary").innerText(), /수상·AIME 진출.*판단하지 않습니다/);
  assert.equal(await page.locator("#score-estimate").isHidden(), true, "partial responses do not produce a score estimate");
  assert.equal(await page.evaluate(() => localStorage.length), 0);
  assert.deepEqual(errors, []);
  await page.close();
});

test("AIME review opens year/form archive, captures integer answers, and routes errors to matching GFIELD practice", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${url}?grade=8&program=aime&year=2026&form=II`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".paper-mark-row").count(), 15);
  assert.equal(await page.locator('[data-field="answer"]').count(), 15);
  assert.equal(await page.locator('[data-question="1"][data-field="answer"]').getAttribute("inputmode"), "numeric");
  assert.equal(await page.locator("#answer-entry-guide").isVisible(), true);
  assert.equal(await page.locator(".score-history").isHidden(), true, "AMC score-history tools should not appear in AIME paper review");
  assert.match(await page.locator("#review-source-note").innerText(), /정수 답\(0–999\)/);
  assert.equal(await page.locator("#archive-year").inputValue(), "2026");
  assert.equal(await page.locator("#archive-form").inputValue(), "II");
  assert.equal(await page.locator("#archive-open-link").getAttribute("href"), "https://live.poshenloh.com/past-contests/aime/2026II");
  assert.equal(await page.locator("#aime-review-note").isVisible(), true);
  assert.match(await page.locator("#aime-review-note").innerText(), /초대·응시 자격·선발을 판단하지 않습니다/);
  assert.equal(await page.locator('#aime-review-note a').getAttribute("href"), "https://maa.org/maa-invitational-competitions/");
  await page.locator("#review-paper-label").fill("2026 AIME II");
  await page.locator("#review-exam-date").fill("2026-11-03");
  for (let question = 1; question <= 15; question += 1) {
    await page.locator(`[data-question="${question}"][data-field="status"]`).selectOption("correct");
    await page.locator(`[data-question="${question}"][data-field="domain"]`).selectOption("algebra");
  }
  await page.locator('[data-question="1"][data-field="answer"]').fill("999");
  await page.locator('[data-question="1"][data-field="status"]').selectOption("wrong");
  await page.locator('[data-question="1"][data-field="reason"]').selectOption("concept");
  await page.locator('[data-question="2"][data-field="answer"]').fill("0");
  await page.locator('[data-question="2"][data-field="status"]').selectOption("blank");
  await page.locator('[data-question="2"][data-field="domain"]').selectOption("number");
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.equal(await page.locator(".review-report").isVisible(), true, await page.locator("#paper-error").innerText());
  assert.match(await page.locator("#score-estimate-value").innerText(), /AIME 원본 정답 수 · 13 \/ 15/);
  assert.equal(await page.locator("#report-review-items-list li").count(), 2);
  assert.match(await page.locator("#report-roadmap-note").innerText(), /학년별 순위·등급이나 AIME 자격 판단은 제공하지 않아요/);
  assert.match(await page.locator("#report-follow-up-link").getAttribute("href"), /aime-practice\.html.*domains=algebra%2Cnumber.*sourceYear=2026.*sourceForm=II/s);
  await page.locator("#save-diagnostic").click();
  assert.equal(await page.locator(".saved-diagnostic-entry").count(), 1);
  const saved = await page.evaluate(function () { return localStorage.getItem("gmap-local-learning-record-v1:competition-diagnostic-history-v1"); });
  assert.match(saved, /\"programId\":\"aime\"/);
  assert.doesNotMatch(saved, /responses|questionNumber|answerKey|999|sourceQuestions/);
  const followUpHref = await page.locator("#report-follow-up-link").getAttribute("href");
  await page.goto(new URL(followUpHref, url).href, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#source-paper-context").isVisible(), true);
  assert.equal(await page.locator("#source-paper-link").getAttribute("href"), "https://live.poshenloh.com/past-contests/aime/2026II");
  assert.equal(await page.locator(".problem-card").count(), 7);
  assert.equal(await page.locator("#practice-count").innerText(), "7문항");
  await page.goto(`${url}?grade=9&program=aime`, { waitUntil: "networkidle" });
  await page.locator("#review-paper-label").fill("2026 개인 연습 세트");
  await page.locator("#review-exam-date").fill("2026-11-03");
  await page.locator('[data-question="1"][data-field="status"]').selectOption("correct");
  await page.locator('[data-question="1"][data-field="domain"]').selectOption("algebra");
  await page.getByRole("button", { name: "결과 보기" }).click();
  await page.locator("#save-diagnostic").click();
  await page.goto(`${url.replace("competition-paper-review.html", "boarding-roadmap.html")}?grade=8&program=aime#competition-diagnostic`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#competition-select").inputValue(), "aime");
  assert.equal(await page.locator("#competition-saved-diagnostic").isVisible(), true);
  assert.match(await page.locator("#competition-guidance").innerText(), /초대·응시 자격·선발은 판단하지 않아요/);
  assert.equal(await page.locator("#competition-source-link").getAttribute("href"), "https://maa.org/maa-invitational-competitions/");
  await page.locator("#comparison-grade").selectOption("9");
  assert.equal(await page.locator("#competition-grade-comparison").getAttribute("data-state"), "comparable-format");
  assert.equal(await page.locator("#competition-grade-comparison-cards article").count(), 2);
  assert.match(await page.locator("#competition-grade-comparison-copy").innerText(), /직접 입력한 날짜와 메모로 짝지어 나란히 보여줘요/);
  assert.match(await page.locator("#competition-grade-comparison-copy").innerText(), /실제 시험지 동일성은 확인되지 않으며, 난도 조정 등급이나 성장 판정을 제공하지 않아요/);
  assert.deepEqual(errors, []);
  await page.close();
});

test("AIME review uses integer answer fields instead of AMC multiple-choice controls", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${url}?grade=8&program=aime`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".paper-mark-row").count(), 15);
  assert.equal(await page.locator('[data-field="answer"]').count(), 15);
  assert.equal(await page.locator('[data-field="answer"]:not(input)').count(), 0);
  assert.equal(await page.locator("#answer-entry-guide").isVisible(), true);
  assert.equal(await page.locator(".score-history").isHidden(), true);
  assert.deepEqual(errors, []);
  await page.close();
});

test("saved contest review suggests a domain only when two areas have enough evidence", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const record = {
    schemaVersion: "gfield-competition-diagnostic-v1", id: "domain-guidance", programId: "amc8", programTitle: "AMC 8", grade: 7,
    paperLabel: "Practice with area evidence", examDate: "2026-10-30", savedAt: "2026-10-30T12:00:00.000Z",
    summary: { itemCount: 25, correct: 5, wrong: 3, blank: 0, unmarked: 17, attempted: 8, domainClassified: 8, reasonClassified: 3 },
    domains: [
      { id: "algebra", attempted: 4, correct: 4, wrong: 0, blank: 0 },
      { id: "number", attempted: 0, correct: 0, wrong: 0, blank: 0 },
      { id: "geometry", attempted: 4, correct: 1, wrong: 3, blank: 0 },
      { id: "counting", attempted: 0, correct: 0, wrong: 0, blank: 0 }
    ],
    reasons: [{ id: "concept", count: 3 }]
  };
  await page.addInitScript(function (savedRecord) {
    localStorage.setItem("gmap-local-learning-record-v1:competition-diagnostic-history-v1", JSON.stringify({ schemaVersion: "gfield-competition-diagnostic-history-v1", records: [savedRecord] }));
  }, record);
  await page.goto(`${url.replace("competition-paper-review.html", "boarding-roadmap.html")}?grade=7&program=amc8#competition-diagnostic`, { waitUntil: "networkidle" });
  const guidance = page.locator("#competition-review-guidance-list");
  assert.match(await guidance.innerText(), /기하·공간의 정답 비율이 비교 가능한 영역에서 낮았어요 \(기하·공간 1\/4\)/);
  assert.match(await guidance.innerText(), /개념으로 표시한 오답은 정의와 성질/);
  assert.equal(await page.evaluate(function () { return document.documentElement.scrollWidth === document.documentElement.clientWidth; }), true);
  await page.close();
});

test("paper review links a low-evidence area comparison to the specific wrong questions", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${url}?grade=7&program=amc8`, { waitUntil: "networkidle" });
  for (let question = 1; question <= 6; question += 1) {
    const domain = question <= 3 ? "number" : "algebra";
    const status = question <= 3 ? "wrong" : "correct";
    await page.locator(`[data-question="${question}"][data-field="status"]`).selectOption(status);
    await page.locator(`[data-question="${question}"][data-field="domain"]`).selectOption(domain);
  }
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.match(await page.locator("#report-next").innerText(), /표시한 풀이 문항 중 정답 비율이 가장 낮게 나온 영역은 수·비례·추정 0\/3입니다/);
  const reviewItems = page.locator("#report-review-items-list");
  assert.match(await reviewItems.innerText(), /1번 · 오답 · 수·비례·추정[\s\S]*3번 · 오답 · 수·비례·추정/);
  assert.equal(await reviewItems.locator("li").count(), 3);
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.equal(await reviewItems.locator("li").count(), 3, "repeated submit replaces the result list instead of duplicating it");
  await page.close();
});

test("complete AMC 10 marks show the raw-score estimate without a qualification claim", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${url}?grade=9&program=amc10`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#official-paper-sources").isVisible(), true);
  assert.equal(await page.locator("#review-paper-label").inputValue(), "2025 AMC 10 A");
  assert.equal(await page.locator("#archive-open-link").getAttribute("href"), "https://live.poshenloh.com/past-contests/amc10/2025A");
  for (let question = 1; question <= 25; question += 1) {
    const status = question <= 10 ? "correct" : question <= 15 ? "wrong" : "blank";
    await page.locator(`[data-question="${question}"][data-field="status"]`).selectOption(status);
  }
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.equal(await page.locator("#score-estimate").isVisible(), true);
  assert.match(await page.locator("#score-estimate-value").innerText(), /AMC 10 참고 원점수 · 75 \/ 150/);
  assert.equal(await page.locator("#paper-performance").isVisible(), true);
  assert.match(await page.locator("#paper-performance-summary").innerText(), /AMC 10 원본 75 \/ 150점/);
  assert.equal(await page.locator(".paper-question-band").count(), 4);
  assert.match(await page.locator(".paper-question-band").nth(0).innerText(), /1–10번[\s\S]*10 \/ 10 정답/);
  assert.match(await page.locator(".paper-question-band").nth(1).innerText(), /11–15번[\s\S]*0 \/ 5 정답/);
  assert.equal(await page.locator("#report-follow-up").isVisible(), true);
  assert.equal(await page.locator("#report-follow-up-link").getAttribute("href"), "./amc10-practice.html?grade=9");
  await page.locator("#review-exam-date").fill("2026-10-30");
  await page.locator("#save-diagnostic").click();
  assert.match(await page.locator("#diagnostic-save-status").innerText(), /AMC 10 참고 원점수는 저장된 응답 수로 다시 계산할 수 있어요/);
  assert.equal(await page.locator("#report-roadmap-link").getAttribute("href"), "./boarding-roadmap.html?grade=9&program=amc10#grade-map");
  assert.equal(await page.locator("#report-roadmap-link").innerText(), "선택한 Grade 9 학습 경로 보기 →");
  assert.equal(await page.locator("#report-roadmap-link").getAttribute("aria-describedby"), "report-roadmap-note");
  assert.equal(await page.locator("#score-estimate-note").isHidden(), true);
  assert.match(await page.locator("#score-estimate").innerText(), /공식 성적표/);
  assert.equal(await page.locator("#score-estimate a").getAttribute("href"), "https://maa.org/wp-content/uploads/2026/10/2026-2027-AMC-8-10-12-Policies.pdf");
  assert.equal(await page.locator("#score-estimate a").innerText(), "MAA 2026–27 공식 채점 안내 ↗");
  assert.match(await page.locator("#score-estimate").innerText(), /미국·캐나다의 2026–27 MAA 규정 기준/);
  assert.match(await page.locator("#score-estimate").innerText(), /국제 응시는 현지 주관기관 안내/);
  assert.match(await page.locator(".report-boundary").innerText(), /수상·AIME 진출.*판단하지 않습니다/);
  await page.locator("#review-grade").selectOption("8");
  assert.equal(await page.locator(".review-report").isHidden(), true, "a grade change clears the prior result and its roadmap link");
  await page.close();
});

test("complete AMC 8 marks show a correct-count reference estimate", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${url}?grade=7&program=amc8`, { waitUntil: "networkidle" });
  for (let question = 1; question <= 25; question += 1) {
    const status = question <= 18 ? "correct" : question <= 21 ? "wrong" : "blank";
    await page.locator(`[data-question="${question}"][data-field="status"]`).selectOption(status);
  }
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.match(await page.locator("#score-estimate-value").innerText(), /AMC 8 참고 원점수 · 18 \/ 25/);
  assert.match(await page.locator(".report-metrics").innerText(), /미응답/);
  await page.close();
});

test("deleting an unrelated saved contest record keeps the current result marked as saved", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${url}?grade=7&program=amc8`, { waitUntil: "networkidle" });
  const resultButton = page.getByRole("button", { name: "결과 보기" });
  const saveButton = page.locator("#save-diagnostic");
  await page.locator("#review-exam-date").fill("2026-10-28");
  await page.locator("#review-paper-label").fill("Earlier practice");
  await page.locator('[data-question="1"][data-field="status"]').selectOption("correct");
  await resultButton.click();
  await saveButton.click();
  await page.locator("#review-exam-date").fill("2026-10-27");
  await page.locator("#review-paper-label").fill("Oldest practice");
  await page.locator('[data-question="1"][data-field="status"]').selectOption("blank");
  await page.locator('[data-question="1"][data-field="reason"]').selectOption("skipped");
  await resultButton.click();
  await saveButton.click();
  await page.locator("#review-exam-date").fill("2026-10-29");
  await page.locator("#review-paper-label").fill("Current practice");
  await page.locator('[data-question="1"][data-field="status"]').selectOption("wrong");
  await page.locator('[data-question="1"][data-field="reason"]').selectOption("concept");
  await resultButton.click();
  await saveButton.click();
  assert.equal(await saveButton.isDisabled(), true);
  const currentCard = page.locator(".saved-diagnostic-entry").filter({ hasText: "Current practice" });
  assert.equal(await currentCard.count(), 1);
  await page.locator(".saved-diagnostic-entry").filter({ hasText: "Earlier practice" }).locator(".saved-diagnostic-remove").click();
  assert.equal(await saveButton.isDisabled(), true);
  await page.waitForFunction(() => document.querySelector("#diagnostic-save-status").textContent.includes("현재 결과의 저장 상태는 유지돼요"));
  assert.match(await page.locator("#diagnostic-save-status").innerText(), /현재 결과의 저장 상태는 유지돼요/);
  assert.equal(await page.evaluate(function () { return document.activeElement.classList.contains("saved-diagnostic-remove"); }), true);
  await page.evaluate(function () {
    window.__deletionStatusChanges = [];
    const status = document.getElementById("diagnostic-save-status");
    new MutationObserver(function () { window.__deletionStatusChanges.push(status.textContent); }).observe(status, { childList: true, characterData: true, subtree: true });
  });
  await page.locator(".saved-diagnostic-entry").filter({ hasText: "Oldest practice" }).locator(".saved-diagnostic-remove").click();
  await page.waitForFunction(() => window.__deletionStatusChanges.filter((message) => message === "저장된 다른 복습 요약을 삭제했어요. 현재 결과의 저장 상태는 유지돼요.").length >= 1 && window.__deletionStatusChanges.includes(""));
  assert.equal(await saveButton.isDisabled(), true, "repeating an unrelated deletion preserves the current saved state");
  await currentCard.locator(".saved-diagnostic-remove").click();
  assert.equal(await saveButton.isDisabled(), false);
  await page.waitForFunction(() => document.querySelector("#diagnostic-save-status").textContent.includes("현재 결과를 다시 저장할 수 있어요"));
  assert.match(await page.locator("#diagnostic-save-status").innerText(), /현재 결과를 다시 저장할 수 있어요/);
  assert.equal(await page.evaluate(function () { return document.activeElement.id; }), "review-program");
  await page.close();
});

test("deleting the last saved contest summary without an open result returns focus to contest selection", async function () {
  const page = await browser.newPage();
  await page.goto(`${url}?grade=7&program=amc8`, { waitUntil: "networkidle" });
  await page.locator("#review-exam-date").fill("2026-10-29");
  await page.locator("#review-paper-label").fill("Saved practice");
  await page.locator('[data-question="1"][data-field="status"]').selectOption("correct");
  await page.getByRole("button", { name: "결과 보기" }).click();
  await page.locator("#save-diagnostic").click();
  await page.reload({ waitUntil: "networkidle" });
  await page.locator(".saved-diagnostic-remove").click();
  assert.equal(await page.locator("#saved-diagnostic-history").isHidden(), true);
  assert.equal(await page.evaluate(function () { return document.activeElement.id; }), "review-program");
  await page.waitForFunction(function () { return document.getElementById("saved-diagnostic-announcement").textContent === "저장된 복습 요약을 삭제했어요."; });
  await page.close();
});

test("contest review opens the selected grade map from its result link", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${url}?grade=9&program=amc10`, { waitUntil: "networkidle" });
  await page.locator('[data-question="1"][data-field="status"]').selectOption("correct");
  await page.getByRole("button", { name: "결과 보기" }).click();
  await page.locator("#report-roadmap-link").click();
  await page.waitForURL(/boarding-roadmap\.html\?grade=9&program=amc10#grade-map$/);
  assert.match(await page.locator("#grade-map-title").innerText(), /9학년 수학/);
  assert.equal(await page.locator("#competition-select").inputValue(), "amc10");
  await page.waitForFunction(function () {
    const section = document.querySelector("#grade-map");
    const shortcuts = document.querySelector(".roadmap-shortcuts");
    return section.getBoundingClientRect().top >= shortcuts.getBoundingClientRect().bottom;
  });
  await page.close();
});

test("browser back restores the selected grade and competition", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${url.replace("competition-paper-review.html", "boarding-roadmap.html")}?grade=7`, { waitUntil: "networkidle" });
  await page.locator("#competition-select").selectOption("amc8");
  await page.locator("#next-grade").click();
  await page.waitForURL(/boarding-roadmap\.html\?grade=8$/);
  await page.goBack();
  await page.waitForURL(/boarding-roadmap\.html\?grade=7&program=amc8$/);
  assert.equal(await page.locator("#competition-select").inputValue(), "amc8");
  await page.close();
});

test("AMC score records stay separated by contest, export/import as a local file, and show the current-cycle reference", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.locator("#history-program").selectOption("amc10");
  await page.locator("#history-cycle").fill("2026-27");
  assert.match(await page.locator("#score-history-context").innerText(), /실제 응시 프로그램을 선택/);
  await page.locator("#history-region").selectOption("maa-us-canada");
  assert.match(await page.locator("#score-history-context").innerText(), /100 \/ 150/);
  assert.match(await page.locator("#score-history-context").innerText(), /만 13세 이상/);
  assert.match(await page.locator("#score-history-context").innerText(), /2027 USAJMO·USAMO 선발은 AIME 점수를 주로 보며 AMC 점수는 선발 요소가 아니지만/);
  assert.match(await page.locator("#score-history-context").innerText(), /어느 대회의 진출 여부도 판정하지 않습니다/);
  assert.equal(await page.getByRole("link", { name: "MAA 2027 AIME 공식 공지 ↗" }).getAttribute("href"), "https://maa.org/news/maa-announces-official-testing-centers-for-the-2027-american-invitational-mathematics-examination/");
  assert.equal(await page.getByRole("link", { name: "MAA AIME 자격 조건 ↗" }).getAttribute("href"), "https://maa.org/maa-invitational-competitions/");
  assert.equal(await page.locator("#history-score").getAttribute("max"), "150");
  assert.equal(await page.locator("#history-score").getAttribute("step"), "0.5");
  assert.equal(await page.locator("#history-score").getAttribute("inputmode"), "decimal");
  await page.locator("#history-form").selectOption("B");
  await page.locator("#history-grade").selectOption("7");
  await page.locator("#history-date").fill("2026-11-13");
  await page.locator("#history-score").fill("100");
  await page.getByRole("button", { name: "비교 기록에 추가" }).click();
  await page.waitForFunction(() => document.querySelector("#score-history-status").textContent.includes("추가했어요"));
  assert.equal(await page.locator(".score-history-group").count(), 1);
  assert.match(await page.locator(".score-history-table").innerText(), /점수 기준 이상 · 나이와 기타 자격 확인/);
  assert.match(await page.locator(".score-history-table").innerText(), /Grade 7/);
  assert.equal(await page.locator("#history-program").inputValue(), "amc10", "the contest selection stays ready for the next entry");
  assert.equal(await page.locator("#history-cycle").inputValue(), "2026-27");
  assert.equal(await page.locator("#history-form").inputValue(), "B");
  assert.equal(await page.locator("#history-score").inputValue(), "");
  assert.match(await page.locator("#score-history-context").innerText(), /2026–27 미국·캐나다 MAA AIME 점수 기준 · 100 \/ 150/);
  assert.match(await page.locator("#score-history-context").innerText(), /만 13세 이상/);

  await page.locator("#history-region").selectOption("international");
  assert.match(await page.locator("#score-history-context").innerText(), /International Group Leader/);
  assert.doesNotMatch(await page.locator("#score-history-context").innerText(), /100 \/ 150/);

  await page.locator("#history-program").selectOption("amc8");
  assert.equal(await page.locator("#history-score").getAttribute("inputmode"), "numeric");
  await page.locator("#history-cycle").fill("2026-27");
  await page.locator("#history-date").fill("2027-01-24");
  await page.locator("#history-score").fill("20");
  await page.getByRole("button", { name: "비교 기록에 추가" }).click();
  assert.equal(await page.locator(".score-history-group").count(), 2, "AMC 8 and AMC 10 are kept in separate comparison groups");
  assert.equal(await page.evaluate(() => localStorage.length), 0, "no learner history is persisted by the page");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "JSON 파일로 저장" }).click();
  const download = await downloadPromise;
  assert.equal(download.suggestedFilename(), "gfield-amc-score-history.json");
  const exported = JSON.parse(await fs.promises.readFile(await download.path(), "utf8"));
  assert.equal(exported.schemaVersion, "gfield-amc-score-history-v3");
  assert.equal(exported.records[0].studentGrade, 7);
  assert.equal(exported.records.length, 2);
  assert.equal(exported.records.find((record) => record.programId === "amc10").regionId, "maa-us-canada");
  assert.equal(exported.records.find((record) => record.programId === "amc8").regionId, "international");
  assert.equal(Object.hasOwn(exported.records[0], "answers"), false);
  assert.equal(Object.hasOwn(exported.records[0], "studentName"), false);
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.locator("#history-clear").click();
  assert.equal(await page.locator(".score-history-group").count(), 2, "cancelling keeps existing score-history rows");
  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("#history-clear").click();
  assert.equal(await page.locator(".score-history-group").count(), 0);
  assert.equal(await page.locator("#history-clear").isDisabled(), true);
  await page.waitForFunction(() => document.querySelector("#score-history-status").textContent.includes("화면 기록을 비웠어요"));

  const archive = { schemaVersion: "gfield-amc-score-history-v1", records: [{ id: "imported-attempt", programId: "amc8", cycle: "2025-26", form: "AMC 8", examDate: "2026-01-23", rawScore: 21, maxScore: 25 }] };
  await page.locator("#history-import").setInputFiles({ name: "history.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(archive)) });
  await page.waitForFunction(() => document.querySelector("#score-history-status").textContent.includes("가져왔어요"));
  assert.match(await page.locator("#score-history-status").innerText(), /1개 기록을 가져왔어요/);
  assert.equal(await page.locator(".score-history-group").count(), 1);
  assert.match(await page.locator(".score-history-table").innerText(), /21 \/ 25/);
  await page.locator("#history-import").setInputFiles({ name: "history-again.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(archive)) });
  await page.waitForFunction(() => document.querySelector("#score-history-error").textContent.includes("이미 있는 기록과 겹치거나"));
  assert.match(await page.locator("#score-history-error").innerText(), /이미 있는 기록과 겹치거나/);
  assert.equal(await page.locator(".score-history-group").count(), 1, "duplicate imports do not append a second copy");
  const unsafeArchive = { schemaVersion: "gfield-amc-score-history-v1", records: [{ ...archive.records[0], id: "unsafe-attempt", answers: ["A"] }] };
  await page.locator("#history-import").setInputFiles({ name: "unsafe.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(unsafeArchive)) });
  await page.waitForFunction(() => document.querySelector("#score-history-error").textContent.includes("기록 파일을 읽지 못했어요"));
  assert.match(await page.locator("#score-history-error").innerText(), /기록 파일을 읽지 못했어요/);
  assert.equal(await page.locator(".score-history-group").count(), 1, "invalid imports do not alter the in-memory records");
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator(".score-history-group").count(), 0, "records are session-only until exported and imported");
  assert.equal(await page.evaluate(() => localStorage.length), 0);
  await page.close();
});

test("direct entry waits for a contest and keeps empty results out of view", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(url, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#review-program").inputValue(), "");
  assert.equal(await page.locator("#paper-mark-list").isHidden(), true);
  assert.equal(await page.locator("#mark-progress").isHidden(), true);
  assert.equal(await page.locator(".review-report").isHidden(), true);
  assert.equal(await page.locator("#review-paper-label-field").isHidden(), true);
  assert.equal(await page.locator("#review-amc8-practice").isHidden(), true);
  assert.equal(await page.locator(".review-related").isHidden(), true);
  await page.locator("#review-program").selectOption("amc8");
  assert.equal(await page.locator(".paper-mark-row").count(), 25);
  assert.equal(await page.locator(".review-related").isVisible(), true);
  assert.equal(await page.locator(".review-report").isHidden(), true);
  await page.getByRole("button", { name: "결과 보기" }).click();
  await page.waitForFunction(() => document.querySelector("#paper-error").textContent.includes("표시한 문제가 없습니다"));
  assert.match(await page.locator("#paper-error").innerText(), /표시한 문제가 없습니다/);
  assert.equal(await page.locator(".review-report").isHidden(), true);
  assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [390, 390]);
  await page.close();
});

test("phone rows show one status first, then only relevant follow-up fields", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${url}?grade=7&program=amc8`, { waitUntil: "networkidle" });
  const row = page.locator(".paper-mark-row").first();
  assert.equal(await row.locator(".mark-domain").isHidden(), true);
  assert.equal(await row.locator(".mark-reason").isHidden(), true);
  await row.locator('[data-field="status"]').selectOption("correct");
  assert.equal(await row.locator(".mark-domain").isVisible(), true);
  assert.equal(await row.locator(".mark-reason").isHidden(), true);
  await row.locator('[data-field="status"]').selectOption("wrong");
  assert.equal(await row.locator(".mark-reason").isVisible(), true);
  const positions = await row.locator("select:visible").evaluateAll((nodes) => nodes.map((node) => { const rect = node.getBoundingClientRect(); return { x: rect.x, y: rect.y, width: rect.width }; }));
  assert.ok(Math.abs(positions[0].y - positions[1].y) < 2, `status and domain share a row: ${JSON.stringify(positions)}`);
  assert.ok(positions[2].y > positions[0].y && positions.every((position) => position.width >= 100), `reason follows with usable controls: ${JSON.stringify(positions)}`);
  assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [390, 390]);
  await page.setViewportSize({ width: 320, height: 780 });
  const narrowWidths = await row.locator("select:visible").evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().width));
  assert.ok(narrowWidths.every((width) => width >= 100), `320px controls remain usable: ${narrowWidths}`);
  assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [320, 320]);
  await page.close();
});

test("blank response reason is captured separately and never shown as an answer error", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${url}?grade=7&program=amc8`, { waitUntil: "networkidle" });
  const row = page.locator(".paper-mark-row").first();
  await row.locator('[data-field="status"]').selectOption("blank");
  assert.equal(await row.locator(".mark-reason span").innerText(), "미응답 이유");
  assert.equal(await row.locator('[data-field="reason"]').isEnabled(), true);
  assert.deepEqual(await row.locator('[data-field="reason"] option').allTextContents(), ["이유 선택", "시간 부족", "건너뜀", "시작 못 함"]);
  await row.locator('[data-field="domain"]').selectOption("number");
  await row.locator('[data-field="reason"]').selectOption("skipped");
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.match(await page.locator("#report-review-items-list").innerText(), /1번 · 미응답 · 수·비례·추정 · 건너뜀/);
  assert.match(await page.locator("#report-reasons").innerText(), /미응답 이유 · 1\/1개 공란 분류/);
  assert.match(await page.locator("#report-reasons").innerText(), /건너뜀 · 1문항/);
  assert.doesNotMatch(await page.locator("#report-reasons").innerText(), /오답 이유/);
  await page.close();
});

test("contest format changes question count and clears old marks", async function () {
  const page = await browser.newPage();
  await page.goto(`${url}?grade=7&program=amc8`, { waitUntil: "networkidle" });
  await page.locator('[data-question="1"][data-field="status"]').selectOption("correct");
  await page.locator("#review-program").selectOption("kangaroo");
  assert.equal(await page.locator(".paper-mark-row").count(), 30);
  assert.equal(await page.locator('[data-question="1"][data-field="status"]').inputValue(), "unmarked");
  assert.match(page.url(), /program=kangaroo/);
  await page.locator("#review-grade").selectOption("3");
  assert.equal(await page.locator("#review-program").inputValue(), "kangaroo");
  assert.equal(await page.locator(".paper-mark-row").count(), 24);
  await page.locator("#review-program").selectOption("sasmo");
  assert.equal(await page.locator(".paper-mark-row").count(), 25);
  await page.close();
});

test("paper review and score history reflow without horizontal overflow", async function () {
  for (const size of [{ width: 320, height: 720 }, { width: 375, height: 812 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 844, height: 390 }]) {
    const page = await browser.newPage({ viewport: size });
    await page.goto(`${url}?grade=7&program=amc8`, { waitUntil: "networkidle" });
    if (size.width === 320) {
      await page.locator("#history-program").selectOption("amc10");
      await page.locator("#history-cycle").fill("2026-27");
      await page.locator("#history-region").selectOption("maa-us-canada");
      await page.locator("#history-form").selectOption("A");
      await page.locator("#history-date").fill("2026-11-05");
      await page.locator("#history-score").fill("100");
      await page.getByRole("button", { name: "비교 기록에 추가" }).click();
      assert.equal(await page.locator(".score-history-group").count(), 1);
    }
    const dimensions = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
    assert.deepEqual(dimensions, [size.width, size.width], `overflow at ${size.width}`);
    await page.close();
  }
});

test("history announcements and delete focus support keyboard and assistive technology", async function () {
  const page = await browser.newPage({ viewport: { width: 900, height: 900 } });
  await page.goto(`${url}?grade=7&program=amc8`, { waitUntil: "networkidle" });
  await page.locator("#history-program").selectOption("amc10");
  await page.locator("#history-cycle").fill("2026-27");
  await page.locator("#history-region").selectOption("maa-us-canada");
  await page.locator("#history-form").selectOption("A");
  await page.locator("#history-date").fill("2026-11-05");
  await page.locator("#history-score").fill("100");
  await page.getByRole("button", { name: "비교 기록에 추가" }).click();
  await page.waitForFunction(() => document.querySelector("#score-history-status").textContent.includes("추가했어요"));
  assert.equal(await page.locator("#score-history-status").getAttribute("role"), "status");
  assert.equal(await page.locator("#score-history-error").getAttribute("role"), "alert");
  assert.match(await page.locator("#score-history-status").innerText(), /추가했어요/);
  await page.locator("#history-score").fill("99.5");
  assert.equal(await page.locator("#score-history-context").locator("article").count(), 1, "keystrokes do not rebuild unchanged live context");
  await page.locator(".history-remove").click();
  assert.equal(await page.locator("#score-history-title").evaluate((node) => node === document.activeElement), true, "after removing the last record, focus returns to the section title");
  await page.waitForFunction(() => document.querySelector("#score-history-status").textContent.includes("삭제했어요"));
  assert.match(await page.locator("#score-history-status").innerText(), /회차 기록을 삭제했어요/);
  await page.close();
});

test("the paper review still works if optional score history is unavailable", async function () {
  const page = await browser.newPage();
  await page.route("**/competition/amc-score-history.js*", (route) => route.fulfill({ status: 200, contentType: "text/javascript", body: "" }));
  await page.goto(`${url}?grade=7&program=amc8`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".score-history").isHidden(), true);
  assert.equal(await page.locator(".paper-mark-row").count(), 25);
  await page.locator('[data-question="1"][data-field="status"]').selectOption("correct");
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.equal(await page.locator(".review-report").isVisible(), true);
  await page.emulateMedia({ media: "print" });
  assert.equal(await page.locator(".score-history").evaluate((node) => getComputedStyle(node).display), "none");
  assert.equal(await page.locator(".review-report").evaluate((node) => getComputedStyle(node).display), "block");
  await page.close();
});
