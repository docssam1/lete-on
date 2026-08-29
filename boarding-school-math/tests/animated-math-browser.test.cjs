const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
let server;
let browser;
let baseUrl;

function contentType(file) {
  if (file.endsWith(".html")) return "text/html; charset=utf-8";
  if (file.endsWith(".css")) return "text/css; charset=utf-8";
  if (file.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (file.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}

test.before(async function () {
  server = http.createServer(function (request, response) {
    const raw = request.url === "/" ? "/animated-math.html" : request.url.split("?")[0];
    const file = path.resolve(root, `.${decodeURIComponent(raw)}`);
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    response.writeHead(200, { "content-type": contentType(file) });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise(function (resolve) { server.listen(0, "127.0.0.1", resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}/`;
  browser = await chromium.launch({ headless: true });
});

test.after(async function () {
  if (browser) await browser.close();
  if (server) await new Promise(function (resolve) { server.close(resolve); });
});

function collectErrors(page) {
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  page.on("console", function (message) { if (message.type() === "error") errors.push(message.text()); });
  return errors;
}

test("ratio and geometry lessons synchronize the exact target objects", async function () {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = collectErrors(page);
  const response = await page.goto(`${baseUrl}animated-math.html`, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200);
  assert.equal(await page.locator(".lesson-tab").count(), 2);
  assert.match(await page.locator("#problem-copy").innerText(), /1:3 ratio[\s\S]*1:4 ratio[\s\S]*20 tokens/);
  assert.equal(await page.locator('[data-object="ratio-answer"]').evaluate(function (node) { return node.classList.contains("is-visible"); }), false);

  await page.locator("#next-step").click();
  assert.equal(await page.locator('.ratio-cell.is-visible[data-object^="ratio-a-"]').count(), 4);
  assert.equal(await page.locator('.ratio-cell.is-active[data-object^="ratio-a-"]').count(), 4);
  assert.match(await page.locator("#narration-text").innerText(), /four equal parts[\s\S]*worth five/);

  await page.locator('.step-button[data-step-index="5"]').click();
  assert.equal(await page.locator('[data-object="ratio-answer"]').evaluate(function (node) { return node.classList.contains("is-visible") && node.classList.contains("is-active"); }), true);
  assert.match(await page.locator("#narration-text").innerText(), /Five plus four equals nine/);

  await page.locator('.lesson-tab[data-lesson-index="1"]').click();
  assert.match(await page.locator("#problem-copy").innerText(), /AB = AC[\s\S]*40°[\s\S]*angle B/);
  assert.equal(await page.locator('[data-object="geo-answer"]').evaluate(function (node) { return node.classList.contains("is-visible"); }), false);
  await page.locator('.step-button[data-step-index="1"]').click();
  assert.equal(await page.locator(".geo-line.is-visible").count(), 3);
  assert.equal(await page.locator('[data-object="geo-equal-ab"].is-visible').count(), 1);
  await page.locator('.step-button[data-step-index="5"]').click();
  assert.equal(await page.locator('[data-object="geo-answer"].is-visible.is-active').count(), 1);
  assert.match(await page.locator("#narration-text").innerText(), /seventy degrees/);

  await page.locator("#show-overview").click();
  assert.equal(await page.locator("#mode-name").innerText(), "Final overview");
  assert.match(await page.locator("#narration-text").innerText(), /verified answer is 70°/);
  assert.deepEqual(errors, []);
  await page.close();
});

test("animated lessons remain operable without voice on narrow mobile screens", async function () {
  for (const width of [320, 390, 768]) {
    const page = await browser.newPage({ viewport: { width, height: 844 }, isMobile: width < 600, reducedMotion: "reduce" });
    const errors = collectErrors(page);
    await page.goto(`${baseUrl}animated-math.html`, { waitUntil: "networkidle" });
    await page.locator("#audio-toggle").click();
    assert.equal(await page.locator("#audio-toggle").getAttribute("aria-pressed"), "false");
    await page.locator("#next-step").click();
    assert.equal(await page.locator("#step-count").textContent(), "Step 2 of 7");
    const dimensions = await page.evaluate(function () {
      return { scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth };
    });
    assert.equal(dimensions.scroll, dimensions.client, `animated lesson overflow at ${width}px`);
    const controls = await page.locator(".lesson-tab, .control-button, .quiet-button, .step-button, .brand, .site-header nav a, .site-footer a").evaluateAll(function (nodes) {
      return nodes.map(function (node) {
        const rect = node.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      });
    });
    controls.forEach(function (size) {
      assert.ok(size.width >= 44, `touch width ${size.width} at ${width}px`);
      assert.ok(size.height >= 44, `touch height ${size.height} at ${width}px`);
    });
    assert.deepEqual(errors, []);
    await page.close();
  }
});
