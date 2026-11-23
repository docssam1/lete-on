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

test("AMC original answer-key comparison is explicit, source-linked, and preserves manual review", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(`${url}?grade=9&program=amc10&year=2025&form=A`, { waitUntil: "networkidle" });
  const button = page.locator("#apply-answer-key");
  assert.equal(await button.isVisible(), true);
  assert.equal(await button.isDisabled(), false);
  await page.locator('[data-question="1"][data-field="answer"]').selectOption("E");
  await page.locator('[data-question="2"][data-field="answer"]').selectOption("B");
  await page.locator('[data-question="3"][data-field="answer"]').selectOption("A");
  await button.click();
  assert.match(await page.locator("#answer-key-action-status").innerText(), /정답 2 · 오답 1 · 미응답 22/);
  assert.equal(await page.locator('[data-question="1"][data-field="status"]').inputValue(), "correct");
  assert.equal(await page.locator('[data-question="3"][data-field="status"]').inputValue(), "wrong");
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.match(await page.locator("#answer-key-result-note").innerText(), /LIVE by Po-Shen Loh · 공개 답안 페이지로 25문항을 대조/);
  assert.equal(await page.locator("#answer-key-result-note a").getAttribute("href"), "https://live.poshenloh.com/past-contests/amc10/2025A/answers");
  assert.match(await page.locator("#report-review-items-list").innerText(), /3번 · 오답 · 내 답 A · 정답 D/);
  assert.deepEqual(errors, []);
  await page.close();

  const manualPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await manualPage.goto(`${url}?grade=7&program=amc8&year=2023`, { waitUntil: "networkidle" });
  await manualPage.locator('[data-question="1"][data-field="answer"]').selectOption("E");
  await manualPage.locator('[data-question="1"][data-field="status"]').selectOption("wrong");
  await manualPage.getByRole("button", { name: "결과 보기" }).click();
  assert.equal(await manualPage.locator("#answer-key-result-note").isVisible(), false);
  assert.match(await manualPage.locator("#report-review-items-list").innerText(), /1번 · 오답 · 내 답 E/);
  await manualPage.close();
});

test("AIME integer answer key comparison accepts only 0–999 integer entries", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(`${url}?grade=10&program=aime&year=2025&form=I`, { waitUntil: "networkidle" });
  await page.locator('[data-question="1"][data-field="answer"]').fill("70");
  await page.locator('[data-question="2"][data-field="answer"]').fill("999");
  await page.locator("#apply-answer-key").click();
  assert.match(await page.locator("#answer-key-action-status").innerText(), /정답 1 · 오답 1 · 미응답 13/);
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.match(await page.locator("#report-review-items-list").innerText(), /2번 · 오답 · 내 답 999 · 정답 588/);
  assert.equal(await page.locator("#answer-key-result-note a").getAttribute("href"), "https://live.poshenloh.com/past-contests/aime/2025I/answers");
  assert.deepEqual(errors, []);
  await page.close();
});

test("2004 AMC 8 historical response reference skips the bad first row and shows its cohort size", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(`${url}?grade=7&program=amc8&year=2004`, { waitUntil: "networkidle" });
  await page.locator('[data-question="2"][data-field="answer"]').selectOption("A");
  await page.locator('[data-question="2"][data-field="status"]').selectOption("wrong");
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.match(await page.locator("#report-review-items-note").innerText(), /MAA 보고서 응답 집단 154,590명/);
  assert.match(await page.locator("#report-review-items-note").innerText(), /학년별 비교나 현재 기준은 아닙니다/);
  assert.match(await page.locator("#report-review-items-list").innerText(), /2번 · 오답 · 내 답 A · 정답 B/);
  assert.match(await page.locator("#report-review-items-list").innerText(), /2004 응답 집계 · 전체 응답 154,590명 · 정답률 44\.49% · A 선택 6\.20%/);
  assert.equal(await page.locator('#report-review-items-list .report-review-source-link[href*="/problem/"]').getAttribute("href"), "https://live.poshenloh.com/past-contests/amc8/2004/problem/2");
  assert.deepEqual(errors, []);
  await page.close();
});

test("yearly AMC originals expose print, answer entry, and local self-marking", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${url}?grade=7&program=amc8&year=2023`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#archive-year option").count(), 41);
  assert.equal(await page.locator("#archive-open-link").getAttribute("href"), "https://live.poshenloh.com/past-contests/amc8/2023");
  assert.match(await page.locator("#archive-open-link").textContent(), /2023 AMC 8.*온라인 회차/);
  assert.equal(await page.locator("#archive-print-link").getAttribute("href"), "https://live.poshenloh.com/images/past-contests/pdf/amc8-2023-exam.pdf");
  assert.equal(await page.locator("#archive-answer-link").getAttribute("href"), "https://live.poshenloh.com/past-contests/amc8/2023/answers");
  assert.equal(await page.locator("#archive-solutions-link").getAttribute("href"), "https://live.poshenloh.com/past-contests/amc8/2023/solutions");
  assert.match(await page.locator("#archive-route-note").textContent(), /시험지를 펼쳐 화면에서 읽거나 인쇄/);
  assert.equal(await page.locator(".paper-mark-row:first-child .mark-source-link").getAttribute("href"), "https://live.poshenloh.com/past-contests/amc8/2023/problem/1");
  assert.equal(await page.locator(".paper-mark-row:first-child .mark-source-link").getAttribute("target"), "_blank");
  await page.locator('[data-question="1"][data-field="answer"]').selectOption("E");
  await page.locator('[data-question="1"][data-field="status"]').selectOption("wrong");
  await page.locator('[data-question="1"][data-field="domain"]').selectOption("number");
  await page.locator('[data-question="1"][data-field="reason"]').selectOption("approach");
  await openReviewOptions(page);await page.locator("#review-exam-date").fill("2026-11-04");
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.match(await page.locator("#report-review-items-list").innerText(), /1번 · 오답 · 내 답 E/);
  assert.equal(await page.locator("#report-review-items-list .report-review-source-link").getAttribute("href"), "https://live.poshenloh.com/past-contests/amc8/2023/problem/1");
  assert.match(await page.locator("#report-review-items-list .report-review-source-link").innerText(), /원본 문항·개념·해설/);
  await page.locator("#save-diagnostic").click();
  const saved = await page.evaluate(() => localStorage.getItem("gmap-local-learning-record-v1:competition-diagnostic-history-v1"));
  assert.doesNotMatch(saved, /answer|responses|questionNumber/i);
  await page.locator("#review-program").selectOption("amc10");
  await page.locator("#archive-year").selectOption("2021");
  assert.deepEqual(await page.locator("#archive-form option").allTextContents(), ["A형 · 봄 (자료 코드 A)", "B형 · 봄 (자료 코드 B)", "A형 · 가을 (자료 코드 C)", "B형 · 가을 (자료 코드 D)"]);
  await page.locator("#archive-form").selectOption("D");
  assert.equal(await page.locator("#archive-open-link").getAttribute("href"), "https://live.poshenloh.com/past-contests/amc10/2021D");
  assert.equal(await page.locator("#archive-print-link").getAttribute("href"), "https://live.poshenloh.com/images/past-contests/pdf/amc10-2021D-exam.pdf");
  assert.equal(await page.locator("#archive-answer-link").getAttribute("href"), "https://live.poshenloh.com/past-contests/amc10/2021D/answers");
  assert.equal(await page.locator("#archive-solutions-link").getAttribute("href"), "https://live.poshenloh.com/past-contests/amc10/2021D/solutions");
  assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [390, 390]);
  assert.deepEqual(errors, []);
  await page.close();
});

test("2010 AMC 8 shows linked source concepts, permits domain overrides, and reports provenance", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${url}?grade=7&program=amc8&year=2010`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".mark-concept-suggestion").count(), 25);
  assert.equal(await page.locator('.paper-mark-row:has([data-question="20"]) .mark-concept-suggestion').textContent(), "개념 포함배제·최소공배수 · 교사 검토 분류 · LIVE 출처");
  assert.equal(await page.locator('.paper-mark-row:has([data-question="20"]) .mark-concept-suggestion a').getAttribute("href"), "https://live.poshenloh.com/past-contests/amc8/2010/problem/20");
  assert.equal(await page.locator('[data-question="20"][data-field="domain"]').inputValue(), "counting");
  await page.locator('[data-question="20"][data-field="status"]').selectOption("wrong");
  await page.locator('[data-question="20"][data-field="reason"]').selectOption("concept");
  await page.locator('[data-question="23"][data-field="status"]').selectOption("wrong");
  await page.locator('[data-question="23"][data-field="domain"]').selectOption("number");
  await page.locator('[data-question="23"][data-field="status"]').selectOption("correct");
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.match(await page.locator("#report-domains").innerText(), /LIVE 문항 개념 자료 25개가 연결되어 있어요\. 이 중 1문항은 제안 영역을 사용했고 1문항은 직접 분류/);
  assert.match(await page.locator("#report-review-items-list").innerText(), /20번 · 오답 · 답 미입력[\s\S]*포함배제·최소공배수 · 경우의 수와 확률 · 개념/);
  assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [390, 390]);
  assert.deepEqual(errors, []);
  await page.close();
});

test("early and current AMC 8 years both load item-level concepts and source routes", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${url}?grade=7&program=amc8&year=1985`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".mark-concept-suggestion").count(), 25);
  assert.equal(await page.locator('.paper-mark-row:has([data-question="1"]) .mark-concept-suggestion').textContent(), "개념 분수 · 원본 태그 기반 영역 제안 · LIVE 출처");
  assert.equal(await page.locator('[data-question="1"][data-field="domain"]').inputValue(), "number");
  await page.locator('[data-question="1"][data-field="status"]').selectOption("wrong");
  await page.locator('[data-question="1"][data-field="reason"]').selectOption("concept");
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.match(await page.locator("#report-domains").innerText(), /LIVE 문항 개념 자료 25개가 연결되어 있어요\. 이 중 1문항은 제안 영역을 사용했고 0문항은 직접 분류/);
  assert.match(await page.locator("#report-review-items-list").innerText(), /1번 · 오답 · 답 미입력[\s\S]*분수[\s\S]*수와 정수의 성질 · 개념/);
  await page.goto(`${url}?grade=7&program=amc8&year=2026`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".mark-concept-suggestion").count(), 25);
  assert.equal(await page.locator('.paper-mark-row:has([data-question="25"]) .mark-concept-suggestion a').getAttribute("href"), "https://live.poshenloh.com/past-contests/amc8/2026/problem/25");
  assert.equal(await page.locator('[data-question="25"][data-field="domain"]').inputValue(), "geometry");
  assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [390, 390]);
  assert.deepEqual(errors, []);
  await page.close();
});

test("AMC 12 archive picker reaches the earliest listed year", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${url}?grade=10&program=amc12&year=1950`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#archive-year option").count(), 77);
  assert.equal(await page.locator("#archive-year").inputValue(), "1950");
  assert.equal(await page.locator("#archive-open-link").getAttribute("href"), "https://live.poshenloh.com/past-contests/amc12/1950");
  assert.equal(await page.locator(".paper-mark-row").count(), 50);
  assert.equal(await page.locator(".paper-mark-row:last-child .mark-source-link").getAttribute("href"), "https://live.poshenloh.com/past-contests/amc12/1950/problem/50");
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
  assert.deepEqual(await page.locator("#archive-form option").allTextContents(), ["A형 · 봄 (자료 코드 A)", "B형 · 봄 (자료 코드 B)", "A형 · 가을 (자료 코드 C)", "B형 · 가을 (자료 코드 D)"]);
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
  assert.match(await page.locator("#amc-cohort-summary").innerText(), /2025 AMC 12 B · Grade 10로 입력한 점수 114 \/ 150 · 공개된 해당 회차 전체 응시자 기준/);
  const bands = page.locator("#amc-cohort-bands .paper-question-band");
  assert.equal(await bands.count(), 7);
  assert.match(await bands.nth(3).innerText(), /상위 10% 기준[\s\S]*109\.5 \/ 150[\s\S]*기준점 이상/);
  assert.match(await bands.nth(2).innerText(), /상위 5% 기준[\s\S]*127\.5 \/ 150[\s\S]*기준점 미만/);
  assert.match(await page.locator("#amc-cohort-stats").innerText(), /전체 응시 16,432명/);
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
  assert.match(await page.locator("#amc-cohort-summary").innerText(), /2025 AMC 10 A · Grade 9로 입력한 점수 150 \/ 150 · 공개된 해당 회차 전체 응시자 기준/);
  assert.match(await page.locator("#amc-cohort-bands").innerText(), /상위 1% 기준[\s\S]*136\.5 \/ 150[\s\S]*기준점 이상/);
  assert.match(await page.locator("#amc-cohort-stats").innerText(), /전체 응시 31,600명 · 학교 1,956곳/);
  assert.match(await page.locator("#amc-cohort-reference").innerText(), /응시 학년별 순위·등급/);
  assert.equal(await page.locator("#amc-cohort-source").getAttribute("href"), "https://maa.edvistas.com/eduview/report.aspx?mode=6&r500=&view=1561&schoolyear=2026&amccomp=81054&viewClicked=true");
  assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [390, 390]);
  assert.deepEqual(errors, []);
  await page.close();
});

test("AMC result explains when grade comparison is unavailable and hides the note when a grade reference exists", async function () {
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
  assert.match(await page.locator("#amc-cohort-summary").innerText(), /2026 AMC 8 · Grade 7로 입력한 점수 25 \/ 25/);
  assert.equal(await page.locator("#amc-grade-comparison-unavailable").isVisible(), true);
  assert.match(await page.locator("#amc-grade-comparison-unavailable").innerText(), /학년별 비교 자료는 이 화면에 연결되어 있지 않습니다/);
  await page.locator("#archive-year").selectOption("2022");
  for (let question = 1; question <= 25; question += 1) {
    await page.locator(`[data-question="${question}"][data-field="status"]`).selectOption("correct");
  }
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.equal(await page.locator("#amc-cohort-reference").isVisible(), true);
  assert.equal(await page.locator("#amc-grade-reference").isVisible(), true);
  assert.equal(await page.locator("#amc-grade-comparison-unavailable").isHidden(), true);
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
  assert.equal(href, "./amc12-gfield-mock-exam.html?grade=10&domains=functions&sourceYear=2025&sourceForm=A&sourceQuestions=5&sourceConcepts=geometric-sequence%2Carea-ratio");
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
  const savedMock12 = await page.evaluate(() => JSON.parse(localStorage.getItem("gmap-local-learning-record-v1:gfield-mock-result-history-v1")));
  assert.equal(savedMock12.records[0].grade, 10);
  assert.equal(savedMock12.records[0].clusterId, "AMC12");
  assert.equal(await page.locator("#mock-results .mock-standard-results article").count(), 5);
  const nextStudy = await page.locator("#mock-results .mock-next-study a").first().getAttribute("href");
  assert.match(nextStudy, /amc12-practice\.html/);
  assert.match(nextStudy, /domains=geometry/);
  assert.match(nextStudy, /sourceYear=2025/);
  assert.match(nextStudy, /sourceForm=A/);
  assert.match(nextStudy, /sourceQuestions=5/);
  assert.match(nextStudy, /mockWrongQuestions=4/);
  await page.goto(new URL(nextStudy, url).toString(), { waitUntil: "networkidle" });
  assert.match(await page.locator("#targeted-practice-description").innerText(), /지필드 모의고사에서 틀리거나 비워 둔 4번 문항 · 2025 AMC 12 A 원본에서 표시한 5번 문항 이후 원본 풀이 개념.*연결된 GFIELD 창작 문항/);
  assert.equal(await page.locator(".problem-card").count(), 2);
  assert.equal(await page.locator("#practice-progress").innerText(), "0 / 2");
  const firstPractice = page.locator(".problem-card").first();
  const practiceId = await firstPractice.getAttribute("data-item-id");
  const answer = await page.evaluate((id) => GFIELDAMC12ConceptPractice.items.find((item) => item.id === id).answer, practiceId);
  await firstPractice.locator(`[data-choice="${(answer + 1) % 5}"]`).click();
  assert.match(await firstPractice.locator(".feedback").innerText(), /정답이 아니에요/);
  await firstPractice.locator(`[data-choice="${answer}"]`).click();
  assert.match(await firstPractice.locator(".feedback").innerText(), /맞았어요/);
  await firstPractice.locator(".worked-solution summary").first().click();
  assert.ok((await firstPractice.locator(".worked-solution").first().innerText()).length > 30);
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
  assert.equal(await page.locator(".problem-card").count(), 12);
  assert.match(await page.locator("#topic-intro-copy").innerText(), /지필드 모의고사 오답·미응답: 문항 5, 16번.*2023 AMC 8 원본 복습.*그래프·표 해석·수·비례·추정/);
  assert.match(await page.locator("#topic-source-summary").innerText(), /2023 AMC 8.*지필드 모의고사 다시 보기: 문항 5, 16번/);
  assert.equal(await page.locator("#topic-source-paper-link").getAttribute("href"), "https://live.poshenloh.com/past-contests/amc8/2023");
  assert.equal(await page.locator("#topic-return-link").getAttribute("href"), "./competition-paper-review.html?grade=7&program=amc8&year=2023");
  const firstTopicItem = page.locator("#topic-items .problem-card").first();
  const firstTopicId = await firstTopicItem.getAttribute("data-item-id");
  const topicAnswer = await page.evaluate(function (id) {
    const items = GFIELDGrade7UnitMock.items.concat(GFIELDAMC8ConceptPractice.items, GFIELDAMC8ConceptPracticeExtension.items);
    return items.find(function (item) { return item.id === id; }).answer;
  }, firstTopicId);
  await firstTopicItem.locator('[data-choice="' + topicAnswer + '"]').click();
  assert.equal(await firstTopicItem.getAttribute("data-solved"), "true");
  await firstTopicItem.locator(".worked-solution summary").click();
  assert.equal(await firstTopicItem.locator(".worked-solution").evaluate(function (node) { return node.open; }), true);
  assert.ok((await firstTopicItem.locator(".worked-solution").innerText()).length > 40);
  assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [390, 390]);
  assert.deepEqual(errors, []);
  await page.close();
});

test("AMC 10 original review leads to a full mock and mock practice uses its independently classified weak domain", async function () {
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
    const choice = index === 2 ? (mockItems[index].answer + 1) % 5 : mockItems[index].answer;
    await page.locator(`#mock-question-${mockItems[index].id} .mock-choice`).nth(choice).click();
  }
  await page.locator("#mock-submit").click();
  assert.match(await page.locator("#mock-results .mock-score").innerText(), /24 \/ 25/);
  const savedMock10 = await page.evaluate(() => JSON.parse(localStorage.getItem("gmap-local-learning-record-v1:gfield-mock-result-history-v1")));
  assert.equal(savedMock10.records[0].grade, 9);
  assert.equal(savedMock10.records[0].clusterId, "AMC10");
  const nextStudy = await page.locator("#mock-results .mock-next-study a").first().getAttribute("href");
  const next = new URL(nextStudy, "http://127.0.0.1");
  assert.equal(next.pathname, "/boarding-school-math/amc10-practice.html");
  assert.equal(next.searchParams.get("domains"), "geometry");
  assert.equal(next.searchParams.get("sourceYear"), "2021");
  assert.equal(next.searchParams.get("sourceForm"), "D");
  assert.equal(next.searchParams.get("sourceQuestions"), "3,8");
  assert.equal(next.searchParams.get("mockWrongQuestions"), "3");
  await page.goto(new URL(nextStudy, url).href, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".problem-card").count(), 1);
  assert.match(await page.locator("#targeted-practice-description").innerText(), /지필드 모의고사 3번.*2021 AMC 10 D 원본에서 표시한 3, 8번 문항 이후 원본 풀이 개념.*연결된 GFIELD 창작 문항/);
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
  assert.equal(await page.locator(".problem-card").count(), await page.evaluate(function () {
    return GFIELDAMC10ConceptPractice.items.filter(function (item) { return ["대수", "정수론"].includes(item.domain); }).length;
  }));
  assert.equal(await page.locator("#practice-count").innerText(), `${await page.locator(".problem-card").count()}문항`);
  assert.equal(await page.locator("#practice-progress").innerText(), `0 / ${await page.locator(".problem-card").count()}`);
  assert.equal(await page.locator("#targeted-practice-note").isVisible(), true);
  assert.match(await page.locator("#targeted-practice-description").innerText(), /2021 AMC 10 D 원본에서 표시한 3, 8번 문항 이후 정수론·대수 영역/);
  assert.equal(await page.locator("#targeted-practice-return").getAttribute("href"), "./competition-paper-review.html?grade=9&program=amc10&year=2021&form=D");
  assert.equal(await page.locator("#targeted-source-paper").getAttribute("href"), "https://live.poshenloh.com/past-contests/amc10/2021D");
  assert.equal(await page.locator("#targeted-source-paper").isVisible(), true);
  const firstNumberItem = page.locator('.problem-card[data-item-id="amc10-g7-number-01"]');
  await firstNumberItem.locator('[data-choice="3"]').click();
  assert.equal(await page.locator("#practice-progress").innerText(), `1 / ${await page.locator(".problem-card").count()}`);
  await page.getByRole("button", { name: "선택 지우기" }).click();
  assert.equal(await page.locator("#practice-progress").innerText(), `0 / ${await page.locator(".problem-card").count()}`);
  assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [390, 390]);
  assert.deepEqual(errors, []);
  await page.close();
});

test("users can save an answer-free AMC review summary without turning it into roadmap diagnosis", async function () {
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
  assert.match(await page.locator("#archive-open-link").textContent(), /2023 AMC 8.*온라인 회차/);
  assert.equal(await page.locator("#review-paper-label").inputValue(), "2023 AMC 8");
  assert.deepEqual(await page.locator('[data-question="1"][data-field="domain"] option').allTextContents(), ["영역 선택", "식과 대수 관계", "수와 정수의 성질", "기하 도형과 측정", "경우의 수와 확률", "자료와 통계", "함수와 그래프"]);
  await openReviewOptions(page);await page.locator("#review-exam-date").fill("2026-10-29");
  await openReviewOptions(page);await page.locator("#review-paper-label").fill("Practice A");
  await page.locator('[data-question="1"][data-field="answer"]').selectOption("C");
  assert.match(await page.locator("#mark-progress").innerText(), /답 입력 1문제/);
  await page.locator('[data-question="1"][data-field="status"]').selectOption("wrong");
  await page.locator('[data-question="1"][data-field="domain"]').selectOption("algebra");
  await page.locator('[data-question="1"][data-field="status"]').selectOption("correct");
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
  assert.equal(await savedDomains.count(), 6);
  assert.match(await page.locator(".saved-diagnostic-entry-domains").innerText(), /함수와 그래프/);
  await page.setViewportSize({ width: 1440, height: 1000 });
  const desktopDomainRows = await savedDomains.evaluateAll((nodes) => nodes.map((node) => { const rect = node.getBoundingClientRect(); return { y: rect.y, width: rect.width }; }));
  assert.ok(Math.max(...desktopDomainRows.map((entry) => entry.y)) - Math.min(...desktopDomainRows.map((entry) => entry.y)) < 2 && desktopDomainRows.every((entry) => entry.width >= 150), `all six saved areas share a readable desktop row: ${JSON.stringify(desktopDomainRows)}`);
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
  assert.deepEqual(JSON.parse(raw).records[0].blankReasons, [{ id: "skipped", count: 1 }]);
  await openReviewOptions(page);await page.locator("#review-exam-date").fill("2026-10-30");
  await openReviewOptions(page);await page.locator("#review-paper-label").fill(`Practice B-${"X".repeat(69)}`);
  await page.locator('[data-question="1"][data-field="status"]').selectOption("wrong");
  await page.locator('[data-question="1"][data-field="domain"]').selectOption("algebra");
  await page.locator('[data-question="1"][data-field="reason"]').selectOption("concept");
  await page.locator('[data-question="2"][data-field="status"]').selectOption("wrong");
  await page.locator('[data-question="2"][data-field="domain"]').selectOption("algebra");
  await page.locator('[data-question="2"][data-field="status"]').selectOption("correct");
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
  assert.equal(new URL(page.url()).searchParams.get("grade"), "7");
  assert.equal(new URL(page.url()).searchParams.get("program"), "amc8");
  assert.equal(await page.locator("#competition-paper-review-route").getAttribute("href"), "./competition-paper-review.html?grade=7&program=amc8");
  assert.equal(await page.locator("#competition-saved-diagnostic").count(), 0, "original-paper summaries stay in paper review and are not presented as roadmap diagnosis");
  assert.equal(await page.locator("#competition-record-pair").count(), 0, "different contest-paper records are not compared as grade-level results");
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [390, 390]);
  await page.setViewportSize({ width: 1280, height: 900 });
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [1280, 1280]);
  await page.setViewportSize({ width: 768, height: 900 });
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [768, 768]);
  await page.goto(`${url.replace("competition-paper-review.html", "boarding-roadmap.html")}?grade=8`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#competition-paper-review-route").getAttribute("href"), "./competition-paper-review.html?grade=8&program=amc8");
  assert.equal(await page.locator("#competition-saved-diagnostic").count(), 0);
  assert.equal(await page.locator("#competition-record-pair").count(), 0);
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
  await page.locator('[data-question="1"][data-field="status"]').selectOption("wrong");
  await page.locator('[data-question="1"][data-field="domain"]').selectOption("algebra");
  await page.locator('[data-question="1"][data-field="status"]').selectOption("correct");
  await page.locator('[data-question="2"][data-field="status"]').selectOption("wrong");
  await page.locator('[data-question="2"][data-field="answer"]').selectOption("D");
  await page.locator('[data-question="2"][data-field="domain"]').selectOption("algebra");
  await page.locator('[data-question="2"][data-field="reason"]').selectOption("reading");
  await page.locator('[data-question="3"][data-field="status"]').selectOption("blank");
  assert.equal(await page.locator("#mark-progress").innerText(), "3 / 25문제 채점 확인 · 답 입력 1문제");
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.match(await page.locator("#report-title").innerText(), /입력한 결과/);
  assert.match(await page.locator("#report-intro").innerText(), /22문제는 표시하지 않았습니다/);
  assert.match(await page.locator("#score-estimate-note").innerText(), /원본 점수는 모든 문항을 표시한 뒤 계산해요/);
  assert.match(await page.locator("#report-metrics").innerText(), /1\/2/);
  assert.match(await page.locator("#report-domains h3").innerText(), /풀이 영역 · 3\/25문항/);
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

test("2010 AIME review compares a completed paper with the matching historical grade distribution", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${url}?grade=8&program=aime&year=2010&form=I`, { waitUntil: "networkidle" });
  for (let question = 1; question <= 15; question += 1) {
    await page.locator(`[data-question="${question}"][data-field="status"]`).selectOption(question <= 8 ? "correct" : "wrong");
  }
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.match(await page.locator("#score-estimate-value").innerText(), /8 \/ 15/);
  assert.equal(await page.locator("#aime-historical-grade-reference").isVisible(), true);
  assert.match(await page.locator("#aime-historical-grade-summary").innerText(), /2010 AIME I · Grade 8 · 학년 표본 136명 · 8\/15점/);
  assert.match(await page.locator("#aime-historical-grade-result").innerText(), /104명 \/ 136명 · 76\.47% · 같은 점수 15명/);
  assert.equal(await page.locator("#aime-historical-grade-source").getAttribute("href"), "https://www.scribd.com/document/51428451/2010-HS-summary");
  assert.deepEqual(errors, []);
  await page.close();
});

test("AIME review opens year/form archive, captures integer answers, and stays separate from roadmap diagnosis", async function () {
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
  await openReviewOptions(page);await page.locator("#review-paper-label").fill("2026 AIME II");
  await openReviewOptions(page);await page.locator("#review-exam-date").fill("2026-11-03");
  for (let question = 1; question <= 15; question += 1) {
    await page.locator(`[data-question="${question}"][data-field="status"]`).selectOption("wrong");
    await page.locator(`[data-question="${question}"][data-field="domain"]`).selectOption("algebra");
    await page.locator(`[data-question="${question}"][data-field="status"]`).selectOption("correct");
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
  assert.doesNotMatch(saved, /responses|questionNumber|answerKey|"999"|:\s*999[,}\]]|sourceQuestions/);
  const followUpHref = await page.locator("#report-follow-up-link").getAttribute("href");
  await page.goto(new URL(followUpHref, url).href, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#source-paper-context").isVisible(), true);
  assert.equal(await page.locator("#source-paper-link").getAttribute("href"), "https://live.poshenloh.com/past-contests/aime/2026II");
  assert.equal(await page.locator(".problem-card").count(), 8);
  assert.equal(await page.locator("#practice-count").innerText(), "8문항");
  await page.goto(`${url}?grade=9&program=aime`, { waitUntil: "networkidle" });
  await openReviewOptions(page);await page.locator("#review-paper-label").fill("2026 개인 연습 세트");
  await openReviewOptions(page);await page.locator("#review-exam-date").fill("2026-11-03");
  await page.locator('[data-question="1"][data-field="status"]').selectOption("wrong");
  await page.locator('[data-question="1"][data-field="domain"]').selectOption("algebra");
  await page.locator('[data-question="1"][data-field="status"]').selectOption("correct");
  await page.getByRole("button", { name: "결과 보기" }).click();
  await page.locator("#save-diagnostic").click();
  await page.goto(`${url.replace("competition-paper-review.html", "boarding-roadmap.html")}?grade=8&program=aime#competition-diagnostic`, { waitUntil: "networkidle" });
  assert.equal(new URL(page.url()).searchParams.get("grade"), "8");
  assert.equal(new URL(page.url()).searchParams.get("program"), "aime");
  assert.equal(await page.locator("#competition-paper-review-route").getAttribute("href"), "./competition-paper-review.html?grade=8&program=aime");
  assert.equal(await page.locator("#competition-saved-diagnostic").count(), 0);
  await page.locator("#comparison-grade").selectOption("9");
  assert.equal(await page.locator("#comparison-table").isVisible(), true);
  assert.match(await page.locator("#comparison-current-label").innerText(), /8학년/);
  assert.match(await page.locator("#comparison-target-label").innerText(), /9학년/);
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

test("roadmap keeps saved original-paper reviews out of grade diagnosis", async function () {
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
  assert.equal(await page.locator("#competition-saved-diagnostic").count(), 0);
  assert.equal(await page.locator("#competition-review-guidance-list").count(), 0);
  assert.equal(await page.locator("#competition-paper-review-route").getAttribute("href"), "./competition-paper-review.html?grade=7&program=amc8");
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
  assert.match(await page.locator("#report-next").innerText(), /표시한 풀이 문항 중 정답 비율이 가장 낮게 나온 영역은 수와 정수의 성질 0\/3입니다/);
  const reviewItems = page.locator("#report-review-items-list");
  assert.match(await reviewItems.innerText(), /1번 · 오답 · 답 미입력.*수와 정수의 성질[\s\S]*3번 · 오답 · 답 미입력.*수와 정수의 성질/);
  assert.equal(await reviewItems.locator("li").count(), 3);
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.equal(await reviewItems.locator("li").count(), 3, "repeated submit replaces the result list instead of duplicating it");
  await page.close();
});

test("complete AMC 10 marks show the raw-score estimate without a qualification claim", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${url}?grade=9&program=amc10&year=2025&form=A`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#official-paper-sources").isVisible(), true);
  assert.equal(await page.locator("#review-paper-label").inputValue(), "2025 AMC 10 A");
  assert.equal(await page.locator("#archive-open-link").getAttribute("href"), "https://live.poshenloh.com/past-contests/amc10/2025A");
  for (let question = 1; question <= 25; question += 1) {
    const status = question <= 10 ? "correct" : question <= 15 ? "wrong" : "blank";
    await page.locator(`[data-question="${question}"][data-field="status"]`).selectOption(status);
  }
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.equal(await page.locator("#score-estimate").isVisible(), true);
  assert.match(await page.locator("#score-estimate-value").innerText(), /AMC 10 원본 점수 · 75 \/ 150/);
  assert.equal(await page.locator("#paper-performance").isVisible(), true);
  assert.match(await page.locator("#paper-performance-summary").innerText(), /AMC 10 원본 75 \/ 150점/);
  assert.equal(await page.locator("#paper-question-bands .paper-question-band").count(), 4);
  assert.match(await page.locator(".paper-question-band").nth(0).innerText(), /1–10번[\s\S]*10 \/ 10 정답/);
  assert.match(await page.locator(".paper-question-band").nth(1).innerText(), /11–15번[\s\S]*0 \/ 5 정답/);
  assert.equal(await page.locator("#report-follow-up").isVisible(), true);
  const followupUrl = new URL(await page.locator("#report-follow-up-link").getAttribute("href"), "https://gfield.test");
  assert.equal(followupUrl.pathname, "/amc10-gfield-mock-exam.html");
  assert.equal(followupUrl.searchParams.get("grade"), "9");
  assert.equal(followupUrl.searchParams.get("sourceYear"), "2025");
  assert.equal(followupUrl.searchParams.get("sourceForm"), "A");
  await openReviewOptions(page);await page.locator("#review-exam-date").fill("2026-10-30");
  await page.locator("#save-diagnostic").click();
  assert.match(await page.locator("#diagnostic-save-status").innerText(), /AMC 10 참고 원점수는 저장된 응답 수로 다시 계산할 수 있어요/);
  assert.equal(await page.locator("#report-roadmap-link").getAttribute("href"), "./boarding-roadmap.html?grade=9&program=amc10#grade-map");
  assert.equal(await page.locator("#report-roadmap-link").innerText(), "선택한 Grade 9 학습 경로 보기 →");
  assert.equal(await page.locator("#report-roadmap-link").getAttribute("aria-describedby"), "report-roadmap-note");
  assert.equal(await page.locator("#score-estimate-note").isHidden(), true);
  assert.match(await page.locator("#score-estimate").innerText(), /공식 성적과 응시 자격/);
  assert.equal(await page.locator("#score-estimate a:not([hidden])").getAttribute("href"), "https://maa.org/wp-content/uploads/2026/10/2026-2027-AMC-8-10-12-Policies.pdf");
  assert.equal(await page.locator("#score-estimate a:not([hidden])").innerText(), "MAA 2026–27 공식 채점 안내 ↗");
  assert.match(await page.locator("#score-estimate").innerText(), /해당 연도·지역의 MAA 안내/);
  assert.match(await page.locator(".report-boundary").innerText(), /수상·AIME 진출.*판단하지 않습니다/);
  await openReviewOptions(page);await page.locator("#review-grade").selectOption("8");
  assert.equal(await page.locator(".review-report").isVisible(), true, "changing grade comparison preserves the graded paper");
  assert.match(await page.locator("#report-roadmap-link").getAttribute("href"), /grade=8/);
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
  assert.match(await page.locator("#score-estimate-value").innerText(), /AMC 8 정답 수 · 18 \/ 25/);
  assert.match(await page.locator(".report-metrics").innerText(), /미응답/);
  await page.close();
});

test("deleting an unrelated saved contest record keeps the current result marked as saved", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${url}?grade=7&program=amc8`, { waitUntil: "networkidle" });
  const resultButton = page.getByRole("button", { name: "결과 보기" });
  const saveButton = page.locator("#save-diagnostic");
  await openReviewOptions(page);await page.locator("#review-exam-date").fill("2026-10-28");
  await openReviewOptions(page);await page.locator("#review-paper-label").fill("Earlier practice");
  await page.locator('[data-question="1"][data-field="status"]').selectOption("correct");
  await resultButton.click();
  await saveButton.click();
  await openReviewOptions(page);await page.locator("#review-exam-date").fill("2026-10-27");
  await openReviewOptions(page);await page.locator("#review-paper-label").fill("Oldest practice");
  await page.locator('[data-question="1"][data-field="status"]').selectOption("blank");
  await page.locator('[data-question="1"][data-field="reason"]').selectOption("skipped");
  await resultButton.click();
  await saveButton.click();
  await openReviewOptions(page);await page.locator("#review-exam-date").fill("2026-10-29");
  await openReviewOptions(page);await page.locator("#review-paper-label").fill("Current practice");
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
  await openReviewOptions(page);await page.locator("#review-exam-date").fill("2026-10-29");
  await openReviewOptions(page);await page.locator("#review-paper-label").fill("Saved practice");
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
  await page.goto(`${url}?grade=9&program=amc10&year=2025&form=A`, { waitUntil: "networkidle" });
  await page.locator('[data-question="1"][data-field="status"]').selectOption("correct");
  await page.getByRole("button", { name: "결과 보기" }).click();
  await page.locator("#report-roadmap-link").click();
  await page.waitForURL(/boarding-roadmap\.html\?grade=9&program=amc10#grade-map$/);
  assert.match(await page.locator("#grade-map-title").innerText(), /9학년 수학/);
  assert.equal(await page.locator("#competition-paper-review-route").getAttribute("href"), "./competition-paper-review.html?grade=9&program=amc10");
  await page.waitForFunction(function () {
    const section = document.querySelector("#grade-map");
    const shortcuts = document.querySelector(".roadmap-shortcuts");
    return section.getBoundingClientRect().top >= shortcuts.getBoundingClientRect().bottom;
  });
  await page.close();
});

test("browser back restores the selected grade and competition", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${url.replace("competition-paper-review.html", "boarding-roadmap.html")}?grade=7&program=amc8#grade-map`, { waitUntil: "networkidle" });
  await page.locator("#next-grade").click();
  await page.waitForURL(/boarding-roadmap\.html\?grade=8#grade-map$/);
  await page.goBack();
  await page.waitForURL(/boarding-roadmap\.html\?grade=7&program=amc8#grade-map$/);
  assert.equal(await page.locator("#competition-paper-review-route").getAttribute("href"), "./competition-paper-review.html?grade=7&program=amc8");
  assert.match(await page.locator("#grade-map-title").innerText(), /7학년 수학/);
  await page.close();
});

test("legacy score files import and export without requesting a region or manual score", async function () {
  const page=await browser.newPage({viewport:{width:390,height:844}});await page.goto(url,{waitUntil:"networkidle"});
  assert.equal(await page.locator('#history-region, #history-grade, #history-score, #score-history-form').count(),0);
  assert.equal(await page.locator('.score-history').getAttribute('open'),null);
  await importScores(page,[{id:'amc10-record',programId:'amc10',cycle:'2026-27',form:'B',examDate:'2026-11-13',rawScore:100,maxScore:150,studentGrade:7,regionId:'maa-us-canada'}, {id:'amc8-record',programId:'amc8',cycle:'2026-27',form:'AMC 8',examDate:'2027-01-24',rawScore:20,maxScore:25,studentGrade:7,regionId:'international'}]);
  assert.equal(await page.locator('.score-history-group').count(),2);
  const pending=page.waitForEvent('download');await page.locator('#history-export').click();const download=await pending;const exported=JSON.parse(await fs.promises.readFile(await download.path(),'utf8'));
  assert.equal(exported.records.length,2);assert.equal(exported.records[0].studentGrade,7);assert.equal(exported.records[0].regionId,'maa-us-canada');assert.equal(Object.hasOwn(exported.records[0],'answers'),false);
  page.once('dialog',d=>d.dismiss());await page.locator('#history-clear').click();assert.equal(await page.locator('.score-history-group').count(),2);
  page.once('dialog',d=>d.accept());await page.locator('#history-clear').click();assert.equal(await page.locator('.score-history-group').count(),0);
  await importScores(page,[{id:'legacy',programId:'amc8',cycle:'2025-26',form:'AMC 8',examDate:'2026-01-23',rawScore:21,maxScore:25}]);
  assert.match(await page.locator('.score-history-table').innerText(),/21 \/ 25/);
  await importScores(page,[{id:'legacy',programId:'amc8',cycle:'2025-26',form:'AMC 8',examDate:'2026-01-23',rawScore:21,maxScore:25}],false);
  await page.waitForFunction(()=>document.querySelector('#score-history-error').textContent.includes('이미 있는 기록과 겹치거나'));
  await importScores(page,[{id:'unsafe',programId:'amc8',cycle:'2025-26',form:'AMC 8',examDate:'2026-01-23',rawScore:21,maxScore:25,answers:['A']}],false);
  await page.waitForFunction(()=>document.querySelector('#score-history-error').textContent.includes('기록 파일을 읽지 못했어요'));
  assert.equal(await page.locator('.score-history-group').count(),1);await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('.score-history-group').count(),0);await page.close();
});

test("score history uses only the matching year and AMC form cohort reference", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(url, { waitUntil: "networkidle" });
  await importScores(page,[{id:'a',programId:'amc10',cycle:'2025-26',form:'A',examDate:'2025-11-05',rawScore:100,maxScore:150,studentGrade:7},{id:'b',programId:'amc10',cycle:'2025-26',form:'B',examDate:'2025-11-13',rawScore:100,maxScore:150,studentGrade:7}]);
  const rows = page.locator(".score-history-table tbody tr");
  assert.equal(await rows.count(), 2);
  assert.match(await rows.nth(0).innerText(), /Grade 7[\s\S]*MAA 전체 응시자 기준 · 상위 10% 기준 · 94\.5 \/ 150점 이상/);
  assert.match(await rows.nth(1).innerText(), /Grade 7[\s\S]*MAA 전체 응시자 기준 · 상위 10% 기준 · 87 \/ 150점 이상/);
  assert.equal(await page.getByRole("link", { name: "2025 AMC 10 A MAA 전체 응시자 점수 분포 보기" }).getAttribute("href"), "https://maa.edvistas.com/eduview/report.aspx?mode=6&r500=&view=1561&schoolyear=2026&amccomp=81054&viewClicked=true");
  await importScores(page,[{id:'eight',programId:'amc8',cycle:'2025-26',form:'AMC 8',examDate:'2026-01-22',rawScore:19,maxScore:25,studentGrade:7}]);
  const amc8Row = page.locator(".score-history-table").first().locator("tbody tr").first();
  assert.match(await amc8Row.innerText(), /Grade 7[\s\S]*MAA 전체 응시자 기준 · 상위 10% 기준 · 19 \/ 25점 이상/);
  assert.equal(await page.getByRole("link", { name: "2026 AMC 8 MAA 전체 응시자 점수 분포 보기" }).getAttribute("href"), "https://maa.edvistas.com/eduview/report.aspx?mode=6&r500=&view=1561&schoolyear=2026&amccomp=81060&viewClicked=true");
  assert.match(await page.locator(".score-history-boundary").innerText(), /동학년 순위·등급으로 환산하지 않습니다/);
  assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [390, 390]);
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
  assert.match(await page.locator("#report-review-items-list").innerText(), /1번 · 미응답 · 답 미입력[\s\S]*수와 정수의 성질 · 건너뜀/);
  assert.match(await page.locator("#report-reasons").innerText(), /미응답 이유 · 1\/1개 공란 분류/);
  assert.match(await page.locator("#report-reasons").innerText(), /건너뜀 · 1문항/);
  assert.doesNotMatch(await page.locator("#report-reasons").innerText(), /오답 이유/);
  await page.close();
});

test("contest format changes question count and clears old marks", async function () {
  const page = await browser.newPage();
  await page.goto(`${url}?grade=7&program=amc8`, { waitUntil: "networkidle" });
  await page.locator('[data-question="1"][data-field="status"]').selectOption("correct");
  await page.goto(`${url}?grade=7&program=kangaroo`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".paper-mark-row").count(), 30);
  assert.equal(await page.locator('[data-question="1"][data-field="status"]').inputValue(), "unmarked");
  assert.match(page.url(), /program=kangaroo/);
  await openReviewOptions(page);await page.locator("#review-grade").selectOption("3");
  assert.equal(await page.locator("#review-program").inputValue(), "kangaroo");
  assert.equal(await page.locator(".paper-mark-row").count(), 24);
  await page.goto(`${url}?grade=3&program=sasmo`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".paper-mark-row").count(), 25);
  await page.close();
});

test("paper review and score history reflow without horizontal overflow", async function () {
  for (const size of [{ width: 320, height: 720 }, { width: 375, height: 812 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 844, height: 390 }]) {
    const page = await browser.newPage({ viewport: size });
    await page.goto(`${url}?grade=7&program=amc8`, { waitUntil: "networkidle" });
    if (size.width === 320) {
      await importScores(page,[{id:'narrow',programId:'amc10',cycle:'2026-27',form:'A',examDate:'2026-11-05',rawScore:100,maxScore:150}]);
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
  await importScores(page,[{id:'focus',programId:'amc10',cycle:'2026-27',form:'A',examDate:'2026-11-05',rawScore:100,maxScore:150}]);
  assert.equal(await page.locator("#score-history-status").getAttribute("role"), "status");
  assert.equal(await page.locator("#score-history-error").getAttribute("role"), "alert");
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

test("2009 four-form response tables retain the MAA official-student cohort and original source",async function(){
 const page=await browser.newPage({viewport:{width:390,height:844}});
 for(const [program,form,count] of [['amc10','A',72528],['amc10','B',31395],['amc12','A',82802],['amc12','B',34228]]){
  await page.goto(`${url}?grade=9&program=${program}&year=2009&form=${form}`,{waitUntil:'networkidle'});
  await page.locator('[data-question="1"][data-field="answer"]').selectOption('A');await page.locator('#apply-answer-key').click();await page.locator('.review-form-actions button[type=submit]').click();
  const summary=await page.locator('#item-response-summary').textContent();assert.match(summary,new RegExp(`2009 AMC ${program==='amc10'?'10':'12'}${form}`));assert.match(summary,/MAA 공식 응시자 표본/);assert.match(summary,new RegExp(count.toLocaleString('ko-KR')));assert.doesNotMatch(summary,/세계 응시자/);
  assert.ok(await page.locator('#item-response-rows tr').count()>=24);assert.match(await page.locator('#item-response-source').getAttribute('href'),/2009_HS_summary\.pdf/);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 }
 await page.close();
});

async function openReviewOptions(page) {
  if (await page.locator("#review-extra-options").getAttribute("open") === null) await page.locator("#review-extra-options > summary").click();
}

async function importScores(page,records,success=true) {
 if(await page.locator('.score-history').getAttribute('open')===null)await page.locator('.score-history > summary').click();
 await page.locator('#history-import').setInputFiles({name:'scores.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({schemaVersion:'gfield-amc-score-history-v1',records}))});
 if(success)await page.waitForFunction(()=>document.querySelector('#score-history-status').textContent.includes('가져왔어요'));
}

test("AMC entry uses contest identity rather than school grades and grades without personal setup", async function () {
 const page=await browser.newPage({viewport:{width:390,height:844}});await page.goto(`${url}?grade=8&program=amc8&year=2025`,{waitUntil:'networkidle'});
 assert.deepEqual(await page.locator('#review-program option').allTextContents(),['대회를 선택해 주세요','AMC 8','AMC 10','AMC 12','AIME']);
 assert.equal(await page.locator('#review-grade').isVisible(),false);assert.equal(await page.locator('#review-paper-label').isVisible(),false);assert.equal(await page.locator('#history-region, #score-history-form').count(),0);
 await page.locator('[data-question="1"][data-field="answer"]').selectOption('A');await page.locator('#apply-answer-key').click();await page.locator('.review-form-actions button[type=submit]').click();await page.locator('#save-diagnostic').click();
 assert.equal(await page.locator('.saved-diagnostic-entry').count(),1);assert.equal(await page.locator('#review-extra-options').getAttribute('open'),null);
 const date=await page.locator('#review-exam-date').inputValue();assert.match(date,/^\d{4}-\d{2}-\d{2}$/);
 await openReviewOptions(page);await page.locator('#review-grade').selectOption('11');assert.equal(await page.locator('#review-program').inputValue(),'amc8');assert.equal(await page.locator('[data-question="1"][data-field="answer"]').inputValue(),'A');assert.equal(await page.locator('.review-report').isVisible(),true);
 await page.route('**/images/past-contests/pdf/**',route=>route.abort());await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('[data-question="1"][data-field="answer"]').inputValue(),'A');
 await page.locator('#review-program').selectOption('amc12');assert.equal(await page.locator('.paper-mark-row').count(),25);assert.equal(await page.locator('[data-question="1"][data-field="answer"]').inputValue(),'');
 await page.close();
});
