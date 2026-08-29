const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const repoRoot = path.resolve(__dirname, "..", "..");
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml" };
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

function errorsFor(page) {
  const errors = [];
  page.on("console", function (message) { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", function (error) { errors.push(error.message); });
  return errors;
}

test("English entry makes the G·MAP student, teacher, US Curriculum, and SASMO-source routes explicit", async function () {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = errorsFor(page);
  const response = await page.goto(`${baseUrl}international.html?locale=en`, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200);
  assert.equal(await page.locator("html").getAttribute("lang"), "en");
  assert.equal(await page.locator("h1").innerText(), "From Foundations to Competition.");
  assert.match(await page.locator(".brand").innerText(), /G·MAP/);
  assert.equal(await page.locator('[data-route="student"]').first().getAttribute("href"), "./catalog.html?locale=en&role=student");
  assert.equal(await page.locator('[data-route="teacher"]').first().getAttribute("href"), "./catalog.html?locale=en&role=teacher");
  assert.equal(await page.locator("#course-rail span").count(), 7);
  assert.deepEqual(await page.locator("#course-rail span").allTextContents(), ["K", "G1–G8", "Pre-Algebra", "Algebra 1", "Geometry", "Algebra 2", "Precalculus"]);
  assert.deepEqual(await page.locator("#domain-grid b").allTextContents(), ["Number & Operations", "Ratios", "Algebraic Thinking", "Geometry", "Measurement", "Data & Probability"]);
  assert.match(await page.locator(".domain-cycle").innerText(), /Concept → Diagnostic → Clinic → Workbook → Check/);
  const source = page.locator('a[href="https://www.k12mathcontests.com/contest/sasmo"]');
  assert.ok(await source.count() >= 1);
  assert.equal(await source.first().getAttribute("target"), "_blank");
  assert.match(await page.locator(".availability-note").innerText(), /review-gated/);
  assert.deepEqual(errors, []);
  await page.close();
});

test("Singapore Simplified Chinese entry uses natural student-teacher and learning-path terminology on mobile", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  const errors = errorsFor(page);
  await page.goto(`${baseUrl}international.html?locale=zh-Hans`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("html").getAttribute("lang"), "zh-Hans");
  assert.equal(await page.locator("h1").innerText(), "从基础概念到数学竞赛");
  assert.match(await page.locator("body").innerText(), /诊断 · 学习 · 进阶。[\s\S]*学生版[\s\S]*教师版[\s\S]*SASMO 历届试题/);
  assert.match(await page.locator(".domain-cycle").innerText(), /概念学习 → 学习诊断 → 专项补强 → 个性化练习册 → 成效检验/);
  assert.deepEqual(await page.locator("#domain-grid b").allTextContents(), ["数与运算", "比与比例", "代数思维", "几何", "测量", "数据与概率"]);
  assert.equal(await page.locator('[data-route="student"]').first().getAttribute("href"), "./catalog.html?locale=zh-Hans&role=student");
  const dimensions = await page.evaluate(function () { return { scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }; });
  assert.equal(dimensions.scroll, dimensions.client);
  assert.deepEqual(errors, []);
  await page.close();
});

test("catalog accepts the locale route and retains the student-teacher boundary in Singapore Simplified Chinese", async function () {
  const page = await browser.newPage({ viewport: { width: 1000, height: 800 } });
  const errors = errorsFor(page);
  await page.goto(`${baseUrl}catalog.html?locale=zh-Hans&role=teacher&grade=6`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("html").getAttribute("lang"), "zh-Hans");
  assert.equal(await page.locator('[data-role="teacher"]').getAttribute("aria-pressed"), "true");
  assert.equal(await page.locator('[data-role="student"]').innerText(), "学生版");
  assert.equal(await page.locator('[data-role="teacher"]').innerText(), "教师版");
  assert.match(await page.locator("h1").innerText(), /K–12 全路径/);
  assert.deepEqual(errors, []);
  await page.close();
});
