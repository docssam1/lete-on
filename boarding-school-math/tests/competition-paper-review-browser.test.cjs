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
  browser = await chromium.launch({ headless: true });
});
test.after(async function () { if (browser) await browser.close(); if (server) await new Promise(function (resolve) { server.close(resolve); }); });

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
  assert.match(await page.locator("#report-domains h3").innerText(), /2\/25문항 분류/);
  assert.match(await page.locator("#report-reasons h3").innerText(), /1\/1개 오답 분류/);
  assert.doesNotMatch(await page.locator("#report-metrics").innerText(), /50%/);
  assert.doesNotMatch(await page.locator("#report-domains").innerText(), /50%/);
  assert.equal(await page.locator(".review-report").evaluate((node) => node === document.activeElement), true);
  assert.match(await page.locator("#report-reasons").innerText(), /조건 읽기 · 1문항/);
  assert.match(await page.locator(".report-boundary").innerText(), /수상·AIME 진출.*판단하지 않습니다/);
  assert.equal(await page.locator("#score-estimate").isHidden(), true, "partial responses do not produce a score estimate");
  assert.equal(await page.evaluate(() => localStorage.length), 0);
  assert.deepEqual(errors, []);
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
  assert.equal(await page.locator("#score-estimate-note").isHidden(), true);
  assert.match(await page.locator("#score-estimate").innerText(), /공식 성적표/);
  assert.match(await page.locator(".report-boundary").innerText(), /수상·AIME 진출.*판단하지 않습니다/);
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

test("AMC score records stay separated by contest, export/import as a local file, and show the current-cycle reference", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.locator("#history-program").selectOption("amc10");
  await page.locator("#history-cycle").fill("2026-27");
  assert.match(await page.locator("#score-history-context").innerText(), /실제 응시 프로그램을 선택/);
  await page.locator("#history-region").selectOption("maa-us-canada");
  assert.match(await page.locator("#score-history-context").innerText(), /100 \/ 150/);
  assert.match(await page.locator("#score-history-context").innerText(), /만 13세 이상/);
  assert.equal(await page.getByRole("link", { name: "MAA 2027 AIME 공식 공지 ↗" }).getAttribute("href"), "https://maa.org/news/maa-announces-official-testing-centers-for-the-2027-american-invitational-mathematics-examination/");
  assert.equal(await page.getByRole("link", { name: "MAA AIME 자격 조건 ↗" }).getAttribute("href"), "https://maa.org/maa-invitational-competitions/");
  assert.equal(await page.locator("#history-score").getAttribute("max"), "150");
  assert.equal(await page.locator("#history-score").getAttribute("step"), "0.5");
  assert.equal(await page.locator("#history-score").getAttribute("inputmode"), "decimal");
  await page.locator("#history-form").selectOption("B");
  await page.locator("#history-date").fill("2026-11-13");
  await page.locator("#history-score").fill("100");
  await page.getByRole("button", { name: "비교 기록에 추가" }).click();
  assert.equal(await page.locator(".score-history-group").count(), 1);
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
  assert.equal(exported.schemaVersion, "gfield-amc-score-history-v1");
  assert.equal(exported.records.length, 2);
  assert.equal(Object.hasOwn(exported.records[0], "answers"), false);
  assert.equal(Object.hasOwn(exported.records[0], "studentName"), false);
  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("#history-clear").click();
  assert.equal(await page.locator(".score-history-group").count(), 0);

  const archive = { schemaVersion: "gfield-amc-score-history-v1", records: [{ id: "imported-attempt", programId: "amc8", cycle: "2025-26", form: "AMC 8", examDate: "2026-01-23", rawScore: 21, maxScore: 25 }] };
  await page.locator("#history-import").setInputFiles({ name: "history.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(archive)) });
  await page.waitForFunction(() => !document.querySelector("#score-history-status").hidden);
  assert.match(await page.locator("#score-history-status").innerText(), /1개 기록을 가져왔어요/);
  assert.equal(await page.locator(".score-history-group").count(), 1);
  assert.match(await page.locator(".score-history-table").innerText(), /21 \/ 25/);
  await page.locator("#history-import").setInputFiles({ name: "history-again.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(archive)) });
  await page.waitForFunction(() => !document.querySelector("#score-history-error").hidden);
  assert.match(await page.locator("#score-history-error").innerText(), /이미 있는 기록과 겹치거나/);
  assert.equal(await page.locator(".score-history-group").count(), 1, "duplicate imports do not append a second copy");
  const unsafeArchive = { schemaVersion: "gfield-amc-score-history-v1", records: [{ ...archive.records[0], id: "unsafe-attempt", answers: ["A"] }] };
  await page.locator("#history-import").setInputFiles({ name: "unsafe.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(unsafeArchive)) });
  await page.waitForFunction(() => !document.querySelector("#score-history-error").hidden && !document.querySelector("#score-history-error").classList.contains("is-success"));
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
  const widths = await row.locator("select:visible").evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().width));
  assert.ok(widths[0] > widths[1] && widths[1] >= 100 && widths[2] >= 100, `mobile control widths: ${widths}`);
  assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [390, 390]);
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
  assert.equal(await page.locator("#score-history-status").getAttribute("role"), "status");
  assert.equal(await page.locator("#score-history-error").getAttribute("role"), "alert");
  assert.match(await page.locator("#score-history-status").innerText(), /추가했어요/);
  await page.locator("#history-score").fill("99.5");
  assert.equal(await page.locator("#score-history-context").locator("article").count(), 1, "keystrokes do not rebuild unchanged live context");
  await page.locator(".history-remove").click();
  assert.equal(await page.locator("#score-history-title").evaluate((node) => node === document.activeElement), true, "after removing the last record, focus returns to the section title");
  assert.equal(await page.locator("#score-history-status").isHidden(), true, "delete clears the old success announcement");
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
