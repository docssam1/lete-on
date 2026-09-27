"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const test = require("node:test");
const { chromium } = require("playwright");
const catalog = require("../competition/sasmo-mock-catalog.js");

const root = path.resolve(__dirname, "..", "..");
let server;
let browser;
let baseUrl;
const privatePaper = process.env.GFIELD_SASMO_2019_G6_PDF;
const privatePack = process.env.GFIELD_SASMO_2019_G6_PACK;
const hasPrivatePaper = Boolean(privatePaper && fs.existsSync(privatePaper) && privatePack && fs.existsSync(privatePack));

function type(file) {
  if (file.endsWith(".html")) return "text/html; charset=utf-8";
  if (file.endsWith(".css")) return "text/css; charset=utf-8";
  if (file.endsWith(".json")) return "application/json; charset=utf-8";
  return "text/javascript; charset=utf-8";
}

function verifiedPack() {
  const form = catalog.getForm("sasmo-2019-g6-baseline-a");
  return {
    schemaVersion: "gfield-private-sasmo-diagnostic-v2",
    paper: {
      programId: "sasmo",
      year: 2019,
      levelId: "G6",
      sourceType: "third-party-public-reference",
      sourcePageUrl: "https://www.k12mathcontests.com/download/sasmo/2019/primary6",
      sourceFingerprintSha256: form.sourceFingerprintSha256,
      rightsState: "private-reference-only"
    },
    items: form.items.map(function (entry, index) {
      const multipleChoice = index < 15;
      return {
        itemId: `sasmo-2019-g6-q${String(index + 1).padStart(2, "0")}`,
        sourceLocator: `private question ${index + 1}`,
        axisId: entry.axisId,
        skillId: entry.skillId,
        responseType: multipleChoice ? "multiple-choice" : "numeric-exact",
        primaryErrorType: "reasoning-error",
        answerProof: { answerProof: "published-solution-plus-independent", publishedSolutionLocator: `private solution ${index + 1}`, independentSolveMethod: "independent check", independentSolveConfirmed: true },
        privateScoring: { answerKind: multipleChoice ? "option-id" : "numeric-exact", answerValue: multipleChoice ? "B" : String(index + 1) }
      };
    })
  };
}

test.before(async function () {
  server = http.createServer(function (request, response) {
    const file = path.resolve(root, `.${decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname)}`);
    if (!file.startsWith(root) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404); response.end(); return; }
    response.writeHead(200, { "content-type": type(file) });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise(function (resolve) { server.listen(0, "127.0.0.1", resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}/boarding-school-math/`;
  browser = await chromium.launch({ headless: true });
});

test.after(async function () {
  await browser.close();
  await new Promise(function (resolve) { server.close(resolve); });
});

test("a verified local paper scores in-browser, stores only answer-safe evidence, and drives the learning plan", { skip: !hasPrivatePaper }, async function () {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}sasmo-real-paper.html`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#score-button").isDisabled(), true);
  const pack = JSON.parse(fs.readFileSync(privatePack, "utf8"));
  await page.locator("#pack-file").setInputFiles(privatePack);
  assert.equal(await page.locator("#score-button").isDisabled(), true);
  await page.locator("#paper-file").setInputFiles(privatePaper);
  await page.locator("#source-state[data-state=ready]").waitFor();
  assert.equal(await page.locator("#paper-empty").isVisible(), false);
  assert.equal(await page.locator("#pdf-stage").isVisible(), true);
  assert.equal(await page.locator("#score-button").isEnabled(), true);
  for (let number = 1; number <= 15; number += 1) await page.locator(`label:has(input[name=q${number}][value=${pack.items[number - 1].privateScoring.answerValue}])`).click();
  for (let number = 16; number <= 25; number += 1) await page.locator(`input[name=q${number}]`).fill(pack.items[number - 1].privateScoring.answerValue);
  await page.locator("#score-button").click();
  await page.locator("#results:not([hidden])").waitFor();
  assert.equal(await page.locator("#raw-score").innerText(), "70");
  assert.equal(await page.locator("#priority-title").innerText(), "영역별 자동 처방은 검수 대기 중입니다.");
  assert.match(await page.locator("#axis-boundary").innerText(), /나머지 24문항/);
  assert.match(await page.locator("#axis-boundary").innerText(), /자동 약점 처방에는 사용하지 않습니다/);
  assert.equal(await page.locator(".axis-card").filter({ hasText: "규칙과 대수" }).locator("header span").innerText(), "3 / 3");
  assert.match(await page.locator(".question-chip").nth(18).textContent(), /점수만 반영 · 영역 진단 제외/);
  assert.match(await page.locator(".prediction-boundary").innerText(), /최초 응시 1\/3회 기록/);
  assert.equal(await page.locator(".axis-card").count(), 6);
  assert.equal(await page.locator(".question-chip").count(), 25);
  const saved = await page.evaluate(function () { return localStorage.getItem("gmap-local-learning-record-v1:competition-evidence"); });
  assert.ok(saved);
  const parsed = JSON.parse(saved);
  assert.equal(parsed.schemaVersion, "gfield-competition-evidence-v2");
  assert.equal(parsed.axes.reduce(function (total, axis) { return total + axis.itemCount; }, 0), 25);
  assert.equal(parsed.diagnosticAxes.reduce(function (total, axis) { return total + axis.itemCount; }, 0), 24);
  assert.deepEqual(parsed.scoreOnlyQuestionNumbers, [19]);
  assert.equal(parsed.priorityAxis, null);
  assert.doesNotMatch(saved, /answerValue|sourceLocator|privateScoring|publishedSolutionLocator/);
  const firstSeries = await page.evaluate(function () { return localStorage.getItem("gmap-local-learning-record-v1:competition-first-attempts-v2"); });
  assert.ok(firstSeries);
  assert.doesNotMatch(firstSeries, /answerValue|sourceLocator|privateScoring|publishedSolutionLocator|sourcePageUrl/);
  const wrongNineteen = pack.items[18].privateScoring.answerValue === "0" ? "1" : "0";
  await page.locator("input[name=q19]").fill(wrongNineteen);
  await page.locator("#score-button").click();
  assert.equal(await page.locator("#raw-score").innerText(), "66");
  assert.equal(await page.locator(".axis-card").filter({ hasText: "규칙과 대수" }).locator("header span").innerText(), "3 / 3");
  assert.equal(await page.evaluate(function () { return localStorage.getItem("gmap-local-learning-record-v1:competition-first-attempts-v2"); }), firstSeries);
  await page.locator("input[name=q19]").fill(pack.items[18].privateScoring.answerValue);
  const wrongLetter = pack.items[0].privateScoring.answerValue === "A" ? "B" : "A";
  await page.locator(`label:has(input[name=q1][value=${wrongLetter}])`).click();
  await page.locator("#score-button").click();
  assert.equal(await page.locator("#raw-score").innerText(), "67");
  assert.match(await page.locator(".prediction-boundary").innerText(), /다시 풀었습니다/);
  assert.equal(await page.evaluate(function () { return localStorage.getItem("gmap-local-learning-record-v1:competition-first-attempts-v2"); }), firstSeries);
  await page.locator("#paper-file").setInputFiles([]);
  assert.equal(await page.locator("#score-button").isDisabled(), true);
  assert.equal(await page.locator("#paper-empty").isVisible(), true);
  assert.equal(await page.locator("#pdf-stage").isVisible(), false);
  await page.locator("#plan-link").click();
  await page.waitForURL(/learning-plan\.html/);
  assert.equal(await page.locator("#plan-state").innerText(), "기출 점수 연결");
  assert.match(await page.locator("#prediction-copy").innerText(), /실제 점수 70 \/ 70/);
  assert.match(await page.locator("#prediction-copy").innerText(), /영역 판정 재검수 중/);
  await context.close();
});

test("the setup, OMR, and result remain usable at 390px without horizontal overflow", { skip: !hasPrivatePaper }, async function () {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}sasmo-real-paper.html`, { waitUntil: "networkidle" });
  assert.equal(await page.evaluate(function () { return document.documentElement.scrollWidth <= window.innerWidth; }), true);
  const pack = JSON.parse(fs.readFileSync(privatePack, "utf8"));
  await page.locator("#pack-file").setInputFiles(privatePack);
  await page.locator("#paper-file").setInputFiles(privatePaper);
  await page.locator("#source-state[data-state=ready]").waitFor();
  await page.locator(`label:has(input[name=q1][value=${pack.items[0].privateScoring.answerValue}])`).click();
  await page.locator("#score-button").click();
  await page.locator("#results:not([hidden])").waitFor();
  assert.equal(await page.evaluate(function () { return document.documentElement.scrollWidth <= window.innerWidth; }), true);
  assert.equal(await page.locator(".choice-group label").first().evaluate(function (node) { return node.getBoundingClientRect().height >= 34; }), true);
  await context.close();
});

test("the score-only boundary and intro remain readable at a narrow 320px width", async function () {
  const context = await browser.newContext({ viewport: { width: 320, height: 700 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}sasmo-real-paper.html`, { waitUntil: "networkidle" });
  assert.equal(await page.evaluate(function () { return document.documentElement.scrollWidth <= window.innerWidth; }), true);
  assert.match(await page.locator(".intro-copy").innerText(), /자동 약점 처방에 사용하지 않습니다/);
  assert.equal(await page.locator(".format-facts dd").last().innerText(), "검수 중");
  await context.close();
});

test("a cleared file selection cannot be revived by an older asynchronous read", { skip: !hasPrivatePaper }, async function () {
  const page = await browser.newPage();
  await page.addInitScript(function () {
    const original = File.prototype.arrayBuffer;
    File.prototype.arrayBuffer = async function () {
      await new Promise(function (resolve) { setTimeout(resolve, 250); });
      return original.call(this);
    };
  });
  await page.goto(`${baseUrl}sasmo-real-paper.html`, { waitUntil: "networkidle" });
  await page.locator("#paper-file").setInputFiles(privatePaper);
  await page.locator("#paper-file").setInputFiles([]);
  await page.locator("#pack-file").setInputFiles(privatePack);
  await page.locator("#pack-file").setInputFiles([]);
  await page.waitForTimeout(350);
  assert.equal(await page.locator("#pdf-stage").isVisible(), false);
  assert.equal(await page.locator("#paper-empty").isVisible(), true);
  assert.equal(await page.locator("#score-button").isDisabled(), true);
  assert.equal(await page.locator("#source-state[data-state=ready]").count(), 0);
  await page.close();
});

test("a different PDF is rejected before OMR input and cannot create a real-paper record", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${baseUrl}sasmo-real-paper.html`, { waitUntil: "networkidle" });
  await page.locator("#pack-file").setInputFiles({ name: "sasmo-2019-g6-diagnostic.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(verifiedPack())) });
  await page.locator("#source-state[data-state=error]").waitFor();
  assert.match(await page.locator("#source-state").innerText(), /PACK_FINGERPRINT_MISMATCH/);
  const otherPdf = await page.pdf({ format: "A4" });
  await page.locator("#paper-file").setInputFiles({ name: "another-year.pdf", mimeType: "application/pdf", buffer: otherPdf });
  await page.locator("#paper-empty strong").filter({ hasText: "이 회차의 원본 PDF가 아닙니다." }).waitFor();
  assert.match(await page.locator("#paper-empty strong").innerText(), /원본 PDF가 아닙니다/);
  assert.equal(await page.locator("#score-button").isDisabled(), true);
  assert.equal(await page.evaluate(function () { return localStorage.getItem("gmap-local-learning-record-v1:competition-first-attempts-v2"); }), null);
  await page.close();
});
