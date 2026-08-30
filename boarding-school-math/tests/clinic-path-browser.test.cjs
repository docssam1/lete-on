const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const repoRoot = path.resolve(__dirname, "..", "..");
let server;
let browser;
let baseUrl;

function contentType(file) {
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
    const raw = request.url.split("?")[0];
    const file = path.resolve(repoRoot, `.${decodeURIComponent(raw)}`);
    if (!file.startsWith(repoRoot) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      response.writeHead(404); response.end("Not found"); return;
    }
    response.writeHead(200, { "content-type": contentType(file) });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise(function (resolve) { server.listen(0, "127.0.0.1", resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}/boarding-school-math`;
  browser = await chromium.launch({ headless: true });
});

test.after(async function () {
  if (browser) await browser.close();
  if (server) await new Promise(function (resolve) { server.close(resolve); });
});

test("ratio diagnosis opens the exact concept and animated clinic path", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = errorsFor(page);
  await page.goto(`${baseUrl}/concept-learning.html?cluster=6.RP.A&from=diagnostic`, { waitUntil: "networkidle" });
  assert.match(await page.locator(".clinic-route-heading h3").innerText(), /진단 결과/);
  assert.equal(await page.locator(".clinic-route-step.is-current small").innerText(), "6.RP.A");
  const animation = page.locator('[data-clinic-action="animated"]');
  assert.equal(await animation.count(), 1);
  assert.equal(await animation.getAttribute("href"), "./animated-math.html?lesson=common-total-ratio&cluster=6.RP.A&locale=ko");

  await animation.click();
  await page.waitForLoadState("networkidle");
  assert.equal(await page.locator("html").getAttribute("lang"), "ko");
  assert.equal(await page.locator('.lesson-tab[aria-selected="true"]').innerText(), "부분과 전체의 비");
  assert.equal(await page.locator("#clinic-context").isVisible(), true);
  assert.match(await page.locator("#clinic-context strong").innerText(), /6\.RP\.A/);
  assert.equal(await page.locator('#clinic-context a[href*="concept-learning.html"]').getAttribute("href"), "./concept-learning.html?cluster=6.RP.A&from=diagnostic");
  assert.equal(await page.locator('[data-clinic-action="workbook"]').getAttribute("href"), "./clinic-practice.html?cluster=6.RP.A&mode=workbook&audience=student&locale=ko");
  assert.deepEqual(errors, []);
  await page.close();
});

test("Grade 6 geometry never links to the unrelated isosceles sample", async function () {
  const page = await browser.newPage({ viewport: { width: 1080, height: 850 } });
  const errors = errorsFor(page);
  await page.goto(`${baseUrl}/concept-learning.html?cluster=6.G.A&from=diagnostic`, { waitUntil: "networkidle" });
  assert.equal(await page.locator('[data-clinic-action="animated"]').count(), 0);
  assert.match(await page.locator(".clinic-route-step:nth-child(3)").innerText(), /검수 대기/);
  assert.equal(await page.locator('.clinic-route a[href*="isosceles-angle"]').count(), 0);
  assert.equal((await page.locator(".clinic-route").innerText()).includes("이등변삼각형"), false);
  assert.deepEqual(errors, []);
  await page.close();
});

test("manual concept navigation no longer claims a diagnostic recommendation", async function () {
  const page = await browser.newPage({ viewport: { width: 1080, height: 850 } });
  const errors = errorsFor(page);
  await page.goto(`${baseUrl}/concept-learning.html?cluster=6.RP.A&from=diagnostic`, { waitUntil: "networkidle" });
  await page.locator('.concept-index-button[data-cluster="6.G.A"]').click();
  assert.equal(new URL(page.url()).searchParams.has("from"), false);
  assert.match(await page.locator(".clinic-route-heading h3").innerText(), /다음 학습 경로/);
  assert.doesNotMatch(await page.locator(".clinic-route-heading h3").innerText(), /진단 결과/);
  assert.deepEqual(errors, []);
  await page.close();
});

test("clinic path has no page-level overflow on 320 and 390 pixel screens", async function () {
  for (const width of [320, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 844 }, isMobile: true });
    const errors = errorsFor(page);
    await page.goto(`${baseUrl}/concept-learning.html?cluster=6.RP.A&from=diagnostic`, { waitUntil: "networkidle" });
    const conceptSize = await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; });
    assert.deepEqual(conceptSize, [width, width]);
    await page.locator('[data-clinic-action="animated"]').click();
    await page.waitForLoadState("networkidle");
    const lessonSize = await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; });
    assert.deepEqual(lessonSize, [width, width]);
    assert.equal(await page.locator('#clinic-context a[href*="concept-learning.html"]').isVisible(), true);
    assert.equal(await page.locator('[data-clinic-action="workbook"]').isVisible(), true);
    assert.deepEqual(errors, []);
    await page.close();
  }
});
