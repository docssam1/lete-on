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
let baseUrl;

function type(file) {
  if (file.endsWith(".html")) return "text/html; charset=utf-8";
  if (file.endsWith(".css")) return "text/css; charset=utf-8";
  if (file.endsWith(".js")) return "text/javascript; charset=utf-8";
  return "application/octet-stream";
}
function errorsFor(page) {
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  page.on("console", function (message) { if (message.type() === "error") errors.push(message.text()); });
  return errors;
}

test.before(async function () {
  server = http.createServer(function (request, response) {
    const pathname = new URL(request.url, "http://127.0.0.1").pathname;
    const file = path.resolve(root, `.${decodeURIComponent(pathname)}`);
    if (!file.startsWith(root) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      response.writeHead(404); response.end("Not found"); return;
    }
    response.writeHead(200, { "content-type": type(file) });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise(function (resolve) { server.listen(0, "127.0.0.1", resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}/boarding-school-math/learning-plan.html`;
  browser = await chromium.launch({ headless: true });
});
test.after(async function () {
  if (browser) await browser.close();
  if (server) await new Promise(function (resolve) { server.close(resolve); });
});

test("learning plan connects goal, time budget, student materials, and teacher materials without a fake score", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = errorsFor(page);
  const response = await page.goto(baseUrl, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200);
  assert.match(await page.locator("h1").innerText(), /진단 결과가/);
  assert.equal(await page.locator("body").getAttribute("data-audience"), "student");
  assert.equal(await page.locator("#student-workspace-link").getAttribute("aria-current"), "page");
  assert.equal(await page.locator("#plan-state").innerText(), "진단 연결 전");
  assert.match(await page.locator("#prediction-title").innerText(), /진단 후/);
  assert.equal(await page.locator("#today-blocks li").count(), 5);
  assert.match(await page.locator("#today-minutes").innerText(), /45분/);
  assert.match(await page.locator("#teacher-grid a").nth(1).getAttribute("href"), /audience=teacher/);
  assert.match(await page.locator("#teacher-pack-state").innerText(), /기하·공간 추론/);
  assert.match(await page.locator(".teacher-context").innerText(), /공유 학생 기록/);
  assert.match(await page.locator("#teacher-grid a").nth(3).getAttribute("href"), /audience=teacher/);
  assert.match(await page.locator("#teacher-grid a").nth(3).getAttribute("href"), /mode=recheck/);
  assert.equal(await page.locator("#today-blocks a").count() >= 3, true);
  await page.locator("#goal-id").selectOption("sasmo-primary6");
  await page.locator("#minutes-per-day").selectOption("60");
  await page.locator("#plan-form").evaluate(function (form) { form.requestSubmit(); });
  assert.equal(await page.locator("#goal-program").innerText(), "SASMO Primary 6");
  assert.match(await page.locator("#today-minutes").innerText(), /60분/);
  assert.match(await page.locator("#diagnostic-action").getAttribute("href"), /competition-practice/);
  assert.deepEqual(errors, []);
  await page.close();
});

test("learning plan stays readable at 390px and supports print styling", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  const errors = errorsFor(page);
  await page.goto(`${baseUrl}?goal=sasmo-primary6`, { waitUntil: "networkidle" });
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [390, 390]);
  const targets = await page.locator("button,select,input,a").evaluateAll(function (nodes) {
    return nodes.filter(function (node) { return getComputedStyle(node).display !== "none"; }).map(function (node) {
      const box = node.getBoundingClientRect(); return [box.width, box.height];
    });
  });
  targets.filter(function (size) { return size[0] > 0; }).forEach(function (size) { assert.ok(size[1] >= 20); });
  await page.emulateMedia({ media: "print" });
  assert.equal(await page.locator(".plan-form").evaluate(function (node) { return getComputedStyle(node).display; }), "none");
  assert.deepEqual(errors, []);
  await page.close();
});

test("teacher workspace changes the product focus and keeps its heading below the sticky mobile header", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await page.goto(`${baseUrl}?goal=school-g6&audience=teacher#teacher-pack`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("body").getAttribute("data-audience"), "teacher");
  assert.equal(await page.locator("#teacher-workspace-link").getAttribute("aria-current"), "page");
  assert.match(await page.locator("#plan-audience-title").innerText(), /오늘의 수업/);
  assert.match(await page.locator("#plan-setup-title").innerText(), /학생의 수업 조건/);
  assert.equal(await page.locator("#teacher-pack").evaluate(function (node) {
    return node.compareDocumentPosition(document.querySelector(".today-section")) & Node.DOCUMENT_POSITION_FOLLOWING;
  }) > 0, true);
  const positions = await page.evaluate(function () {
    const header = document.querySelector(".plan-header").getBoundingClientRect();
    const section = document.querySelector("#teacher-pack").getBoundingClientRect();
    return { headerBottom: header.bottom, sectionTop: section.top };
  });
  assert.ok(positions.sectionTop >= positions.headerBottom, JSON.stringify(positions));
  assert.match(await page.locator(".teacher-context").innerText(), /공개 미리보기/);
  await page.close();
});

test("saved SASMO type evidence can prioritize today’s plan but cannot create a score range", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.addInitScript(function () {
    localStorage.setItem("gmap-local-learning-record-v1:practice", JSON.stringify({
      "sasmo-g6": { attempts: { "sasmo-g6-geometry-01": { responses: [{ answerId: "A", correct: false }], solved: false } }, summary: { attempted: 1, itemCount: 10, firstCorrect: 0, accuracy: 0, complete: false, readinessBand: "collecting", strengthAxis: null, priorityAxis: "geometry-spatial" } }
    }));
  });
  await page.goto(`${baseUrl}?goal=sasmo-primary6`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#plan-state").innerText(), "예비 진단 연결");
  assert.match(await page.locator("#today-description").innerText(), /기하·공간 추론/);
  assert.match(await page.locator("#prediction-copy").innerText(), /공식 점수 예측이 아닙니다/);
  assert.doesNotMatch(await page.locator("#prediction-copy").innerText(), /\d+\s*[-~]\s*\d+/);
  await page.close();
});

test("an older 2019 paper record retains its score but cannot prescribe an unreviewed domain", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.addInitScript(function () {
    localStorage.setItem("gmap-local-learning-record-v1:competition-evidence", JSON.stringify({
      schemaVersion: "gfield-competition-evidence-v1", programId: "sasmo", formId: "sasmo-2019-g6-baseline-a",
      year: 2019, levelId: "G6", sourceState: "private-verified-reference", verifiedRealPaper: true, officialAwardPrediction: false,
      score: { rawScore: 48, maxScore: 70, percentOfMax: 68.6, correct: 19, incorrect: 4, blank: 2 },
      axes: [{ axisId: "geometry-spatial", itemCount: 5, correct: 2, incorrect: 2, blank: 1, percentage: 40, evidenceState: "sufficient" }],
      strengths: [], weaknesses: ["geometry-spatial"], priorityAxis: "geometry-spatial",
      prediction: { state: "collect-another-real-paper", officialAwardPrediction: false }
    }));
  });
  await page.goto(`${baseUrl}?goal=sasmo-primary6`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#plan-state").innerText(), "기출 점수 연결");
  assert.match(await page.locator("#plan-description").innerText(), /점수 이력으로만 연결/);
  assert.match(await page.locator("#prediction-copy").innerText(), /영역 판정 재검수 중/);
  assert.match(await page.locator("#today-description").innerText(), /검수 중인 영역 판정으로 확정한 약점이 아닙니다/);
  await page.close();
});
