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

test("users can opt to save an answer-free AMC review summary and see it only on the matching grade map", async function () {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${url}?grade=7&program=amc8`, { waitUntil: "networkidle" });
  assert.deepEqual(await page.locator('[data-question="1"][data-field="domain"] option').allTextContents(), ["영역 선택", "식·대수", "수·비례·추정", "기하·공간", "경우의 수·확률", "그래프·표 해석"]);
  await page.locator("#review-exam-date").fill("2026-10-29");
  await page.locator("#review-paper-label").fill("Practice A");
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
  assert.equal(await page.locator("#mark-progress").innerText(), "0 / 25문제 표시");
  assert.equal(await page.locator('[data-field="status"]').first().inputValue(), "unmarked");
  await page.locator('[data-question="1"][data-field="status"]').selectOption("correct");
  await page.locator('[data-question="1"][data-field="domain"]').selectOption("algebra");
  await page.locator('[data-question="2"][data-field="status"]').selectOption("wrong");
  await page.locator('[data-question="2"][data-field="domain"]').selectOption("algebra");
  await page.locator('[data-question="2"][data-field="reason"]').selectOption("reading");
  await page.locator('[data-question="3"][data-field="status"]').selectOption("blank");
  assert.equal(await page.locator("#mark-progress").innerText(), "3 / 25문제 표시");
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
  assert.match(await page.locator(".report-boundary").innerText(), /수상·AIME 진출.*판단하지 않습니다/);
  assert.equal(await page.locator("#score-estimate").isHidden(), true, "partial responses do not produce a score estimate");
  assert.equal(await page.evaluate(() => localStorage.length), 0);
  assert.deepEqual(errors, []);
  await page.close();
});

test("AIME manual review accepts self-marked 15-item papers without scoring or eligibility claims", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${url}?grade=8&program=aime`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".paper-mark-row").count(), 15);
  assert.equal(await page.locator("#aime-review-note").isVisible(), true);
  assert.match(await page.locator("#aime-review-note").innerText(), /초대·응시 자격·선발을 판단하지 않습니다/);
  assert.equal(await page.locator('#aime-review-note a').getAttribute("href"), "https://maa.org/maa-invitational-competitions/");
  await page.locator("#review-paper-label").fill("2026 개인 연습 세트");
  await page.locator("#review-exam-date").fill("2026-11-03");
  for (let question = 1; question <= 15; question += 1) {
    await page.locator(`[data-question="${question}"][data-field="status"]`).selectOption("correct");
    await page.locator(`[data-question="${question}"][data-field="domain"]`).selectOption("algebra");
  }
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.equal(await page.locator(".review-report").isVisible(), true, await page.locator("#paper-error").innerText());
  assert.equal(await page.locator("#score-estimate").isHidden(), true);
  assert.equal(await page.locator("#score-estimate-note").isHidden(), true);
  await page.locator("#save-diagnostic").click();
  assert.equal(await page.locator(".saved-diagnostic-entry").count(), 1);
  const saved = await page.evaluate(function () { return localStorage.getItem("gmap-local-learning-record-v1:competition-diagnostic-history-v1"); });
  assert.match(saved, /\"programId\":\"aime\"/);
  assert.doesNotMatch(saved, /responses|questionNumber|answerKey/);
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
  for (let question = 1; question <= 25; question += 1) {
    const status = question <= 10 ? "correct" : question <= 15 ? "wrong" : "blank";
    await page.locator(`[data-question="${question}"][data-field="status"]`).selectOption(status);
  }
  await page.getByRole("button", { name: "결과 보기" }).click();
  assert.equal(await page.locator("#score-estimate").isVisible(), true);
  assert.match(await page.locator("#score-estimate-value").innerText(), /AMC 10 참고 원점수 · 75 \/ 150/);
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
