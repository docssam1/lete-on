"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const test = require("node:test");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..", "..");
let server, browser, baseUrl;
function type(file) { return file.endsWith(".html") ? "text/html; charset=utf-8" : file.endsWith(".css") ? "text/css; charset=utf-8" : "text/javascript; charset=utf-8"; }

test.before(async function () {
  server = http.createServer(function (request, response) {
    const file = path.resolve(root, `.${decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname)}`);
    if (!file.startsWith(root) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404); response.end(); return; }
    response.writeHead(200, { "content-type": type(file) }); fs.createReadStream(file).pipe(response);
  });
  await new Promise(function (resolve) { server.listen(0, "127.0.0.1", resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}/boarding-school-math/`;
  browser = await chromium.launch({ headless: true });
});
test.after(async function () { await browser.close(); await new Promise(function (resolve) { server.close(resolve); }); });

test("a student-only local SASMO first attempt survives reload and routes to a plan without an official score claim", async function () {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}competition-practice.html?program=sasmo-g6&audience=student&locale=ko`, { waitUntil: "networkidle" });
  await page.locator('[data-item-id="sasmo-g6-model-01"] [data-answer-id="A"]').click();
  assert.match(await page.locator("#audience-disclosure").innerText(), /이 기기의 브라우저/);
  assert.equal(await page.locator(".diagnostic-plan-link").count(), 1);
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator('[data-item-id="sasmo-g6-model-01"] .choice.wrong').count(), 1);
  await page.locator(".diagnostic-plan-link").click();
  await page.waitForURL(/learning-plan\.html/);
  assert.equal(await page.locator("#plan-state").innerText(), "예비 진단 연결");
  assert.match(await page.locator("#prediction-copy").innerText(), /공식 점수 예측이 아닙니다/);
  assert.match(await page.locator("#today-description").innerText(), /문제 해결 전략/);
  await page.goto(`${baseUrl}competition-practice.html?program=sasmo-g6&audience=teacher&locale=ko`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".teacher-evidence").count(), 0);
  assert.equal(await page.locator(".teacher-solution").count(), 10);
  await context.close();
});
