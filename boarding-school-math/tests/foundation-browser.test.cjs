const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const repoRoot = path.resolve(__dirname, "..", "..");
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };
let server;
let browser;
let baseUrl;

test.before(async function () {
  server = http.createServer(function (request, response) {
    const requestPath = new URL(request.url, "http://127.0.0.1").pathname;
    const relative = requestPath === "/boarding-school-math/" ? "/boarding-school-math/index.html" : requestPath;
    const target = path.resolve(repoRoot, `.${relative}`);
    if (!target.startsWith(repoRoot) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
      response.writeHead(404).end("Not found");
      return;
    }
    response.writeHead(200, { "content-type": `${mime[path.extname(target)] || "application/octet-stream"}; charset=utf-8` });
    fs.createReadStream(target).pipe(response);
  });
  await new Promise(function (resolve) { server.listen(0, "127.0.0.1", resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}/boarding-school-math/`;
  browser = await chromium.launch({ headless: true });
});

test.after(async function () {
  await browser.close();
  await new Promise(function (resolve) { server.close(resolve); });
});

test("desktop interactions preserve grade role and language contracts", async function () {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on("console", function (message) { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", function (error) { errors.push(error.message); });
  const response = await page.goto(baseUrl, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200);
  assert.equal(await page.locator(".program-card").count(), 1);
  assert.equal(await page.locator("#resource-list li").count(), 6);

  await page.locator('[data-grade="8"]').click();
  assert.equal(await page.locator(".program-card").count(), 5);
  assert.equal(await page.locator(".domain-item").count(), 5);
  assert.equal(await page.locator("#domain-list").getByText("함수", { exact: true }).count(), 1);

  await page.locator('[data-role="teacher"]').click();
  assert.equal(await page.locator('[data-role="teacher"]').getAttribute("aria-pressed"), "true");
  assert.deepEqual(await page.locator("#resource-list li").allTextContents(), ["수업 교안", "정답지", "해설지", "평가 루브릭", "과제 생성기", "교사용 분석"]);

  await page.locator('[data-locale="en"]').click();
  assert.equal(await page.locator("html").getAttribute("lang"), "en");
  assert.equal(await page.locator("h1").textContent(), "One growth path from school math to competition");
  assert.deepEqual(errors, []);
  await page.close();
});

test("mobile layout has no horizontal overflow or runtime errors", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  const errors = [];
  page.on("console", function (message) { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", function (error) { errors.push(error.message); });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const width = await page.evaluate(function () {
    return { scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth };
  });
  assert.equal(width.scroll, width.client);
  assert.deepEqual(errors, []);
  await page.close();
});
