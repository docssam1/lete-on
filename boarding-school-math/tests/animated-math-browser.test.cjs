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
  if (file.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}
function collectErrors(page) {
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  page.on("console", function (message) { if (message.type() === "error") errors.push(message.text()); });
  return errors;
}

test.before(async function () {
  server = http.createServer(function (request, response) {
    const raw = request.url === "/" ? "/boarding-school-math/animated-math.html" : request.url.split("?")[0];
    const file = path.resolve(repoRoot, `.${decodeURIComponent(raw)}`);
    if (!file.startsWith(repoRoot) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { response.writeHead(404); response.end("Not found"); return; }
    response.writeHead(200, { "content-type": contentType(file) });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise(function (resolve) { server.listen(0, "127.0.0.1", resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}/boarding-school-math/animated-math.html`;
  browser = await chromium.launch({ headless: true });
});
test.after(async function () {
  if (browser) await browser.close();
  if (server) await new Promise(function (resolve) { server.close(resolve); });
});

test("ratio, fraction, GCF, signed-number, expression, equation, and geometry lessons reveal exactly the intended conceptual object", async function () {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = collectErrors(page);
  const response = await page.goto(baseUrl, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200);
  assert.equal(await page.locator(".lesson-tab").count(), 7);
  assert.equal(await page.locator('[data-object="ratio-answer"].is-visible').count(), 0);
  await page.locator("#next-step").click();
  assert.equal(await page.locator('[data-object="ratio-team-a-bar"].is-visible.is-active').count(), 1);
  assert.equal(await page.locator(".scene-object.is-active").count(), 1);
  await page.locator('.step-button[data-step-index="5"]').click();
  assert.equal(await page.locator('[data-object="ratio-answer"].is-visible.is-active').count(), 1);
  assert.match(await page.locator("#narration-text").innerText(), /Five plus four equals nine/);

  await page.locator('.lesson-tab[data-lesson-index="1"]').click();
  assert.match(await page.locator("#problem-copy").innerText(), /3\/4 m[\s\S]*1\/8 m/);
  assert.equal(await page.locator('[data-object="frac-answer"].is-visible').count(), 0);
  assert.equal(await page.locator('[data-object="frac-answer"]').getAttribute("aria-hidden"), "true");
  await page.locator('.step-button[data-step-index="4"]').click();
  assert.equal(await page.locator('[data-object="frac-six-groups"].is-visible.is-active').count(), 1);
  await page.locator('.step-button[data-step-index="7"]').click();
  assert.equal(await page.locator('[data-object="frac-answer"].is-visible.is-active').count(), 1);
  assert.match(await page.locator("#narration-text").innerText(), /Six pieces/);

  await page.locator('.lesson-tab[data-lesson-index="2"]').click();
  assert.match(await page.locator("#problem-copy").innerText(), /84[\s\S]*60/);
  assert.equal(await page.locator('[data-object="gcf-answer"].is-visible').count(), 0);
  await page.locator('.step-button[data-step-index="4"]').click();
  assert.equal(await page.locator('[data-object="gcf-common"].is-visible.is-active').count(), 1);
  await page.locator('.step-button[data-step-index="7"]').click();
  assert.equal(await page.locator('[data-object="gcf-answer"].is-visible.is-active').count(), 1);
  assert.match(await page.locator("#narration-text").innerText(), /greatest common factor is twelve/i);

  await page.locator('.lesson-tab[data-lesson-index="3"]').click();
  assert.match(await page.locator("#problem-copy").innerText(), /-7\/4[\s\S]*-5\/3/);
  assert.equal(await page.locator('[data-object="signed-answer"].is-visible').count(), 0);
  await page.locator('.step-button[data-step-index="2"]').click();
  assert.equal(await page.locator('[data-object="signed-point-a"].is-visible.is-active').count(), 1);
  await page.locator('.step-button[data-step-index="8"]').click();
  assert.equal(await page.locator('[data-object="signed-answer"].is-visible.is-active').count(), 1);
  assert.match(await page.locator("#narration-text").innerText(), /less than negative five-thirds/i);

  await page.locator('.lesson-tab[data-lesson-index="4"]').click();
  assert.match(await page.locator("#problem-copy").innerText(), /3\(2³ \+ 4\) - 5/);
  assert.equal(await page.locator('[data-object="expr-answer"].is-visible').count(), 0);
  assert.equal(await page.locator('[data-object="expr-answer"]').getAttribute("aria-hidden"), "true");
  assert.doesNotMatch(await page.locator(".expression-tree-scene").getAttribute("aria-label"), /31|thirty-one/i);
  await page.locator('.step-button[data-step-index="2"]').click();
  assert.equal(await page.locator('[data-object="expr-power"].is-visible.is-active').count(), 1);
  await page.locator('.step-button[data-step-index="7"]').click();
  assert.equal(await page.locator('[data-object="expr-answer"].is-visible.is-active').count(), 1);
  assert.match(await page.locator("#narration-text").innerText(), /unique value thirty-one/i);

  await page.locator('.lesson-tab[data-lesson-index="6"]').click();
  assert.match(await page.locator("#problem-copy").innerText(), /AB = AC[\s\S]*40°[\s\S]*angle B/);
  assert.equal(await page.locator('[data-object="geo-answer"].is-visible').count(), 0);
  await page.locator('.step-button[data-step-index="1"]').click();
  assert.equal(await page.locator('[data-object="geo-triangle"].is-visible.is-active').count(), 1);
  assert.equal(await page.locator('[data-object="geo-triangle"] .geo-line').count(), 3);
  await page.locator('.step-button[data-step-index="7"]').click();
  assert.equal(await page.locator('[data-object="geo-answer"].is-visible.is-active').count(), 1);
  assert.match(await page.locator("#narration-text").innerText(), /seventy degrees/);
  await page.locator("#show-overview").click();
  assert.equal(await page.locator("#mode-name").innerText(), "Final overview");
  assert.equal(await page.locator(".scene-object:not(.is-visible)").count(), 0);
  assert.deepEqual(errors, []);
  await page.close();
});

test("direct Chinese and Korean narration changes without cross-language residue", async function () {
  const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
  const errors = collectErrors(page);
  await page.goto(`${baseUrl}?locale=zh-Hans`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("html").getAttribute("lang"), "zh-Hans");
  assert.match(await page.locator("#narration-text").innerText(), /两队/);
  assert.equal(/[가-힣]/.test(await page.locator("#narration-text").innerText()), false);
  await page.locator("#lesson-language").selectOption("ko");
  assert.equal(await page.locator("html").getAttribute("lang"), "ko");
  assert.match(await page.locator("#narration-text").innerText(), /두 팀/);
  await page.goto(`${baseUrl}?lesson=signed-rational-number-line&cluster=6.NS.C&locale=zh-Hans`, { waitUntil: "networkidle" });
  await page.locator("#show-overview").click();
  assert.match(await page.locator('[data-object="signed-order"]').innerText(), /更靠左/);
  assert.doesNotMatch(await page.locator('[data-object="signed-order"]').innerText(), /farther left/i);
  assert.match(await page.locator(".signed-number-line-svg").getAttribute("aria-label"), /数轴/);
  await page.goto(`${baseUrl}?lesson=expression-structure-order&cluster=6.EE.A&locale=zh-Hans`, { waitUntil: "networkidle" });
  await page.locator("#show-overview").click();
  assert.match(await page.locator('[data-object="expr-answer"]').innerText(), /式子的值/);
  assert.match(await page.locator('[data-object="expr-power"] small').innerText(), /幂/);
  assert.match(await page.locator('[data-object="expr-inside"] small').innerText(), /括号内/);
  assert.match(await page.locator('[data-object="expr-product"] small').innerText(), /乘法/);
  assert.match(await page.locator('[data-object="expr-subtract"] small').innerText(), /减法/);
  assert.doesNotMatch(await page.locator(".expression-tree-scene").innerText(), /original structure|distribution check|value|power|parentheses|multiply|subtract/i);
  await page.goto(`${baseUrl}?lesson=equation-balance-groups&cluster=6.EE.B&locale=zh-Hans`, { waitUntil: "networkidle" });
  await page.locator("#show-overview").click();
  assert.match(await page.locator('[data-object="balance-answer"]').innerText(), /方程的解/);
  assert.match(await page.locator(".algebra-balance-scene").getAttribute("aria-label"), /6个相等的x方框/);
  assert.doesNotMatch(await page.locator(".algebra-balance-scene").innerText(), /six equal groups|divide both sides|one group|solution|substitution check/i);
  assert.deepEqual(errors, []);
  await page.close();
});

test("mobile controls, caption fallback, and narrow layouts remain operable", async function () {
  for (const width of [320, 390, 768]) {
    const page = await browser.newPage({ viewport: { width, height: 844 }, isMobile: width < 600, reducedMotion: "reduce" });
    const errors = collectErrors(page);
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.locator('.lesson-tab[data-lesson-index="2"]').click();
    await page.locator("#audio-toggle").click();
    await page.locator("#captions-toggle").click();
    assert.equal(await page.locator("#audio-toggle").getAttribute("aria-pressed"), "false");
    assert.equal(await page.locator("#captions-toggle").getAttribute("aria-pressed"), "false");
    await page.locator("#next-step").click();
    assert.match(await page.locator("#step-count").textContent(), /2/);
    const dimensions = await page.evaluate(function () { return { scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }; });
    assert.equal(dimensions.scroll, dimensions.client, `animated lesson overflow at ${width}px`);
    const controls = await page.locator(".lesson-tab, .control-button, .quiet-button, .compact-select select, .step-button, .brand, .site-header nav a, .site-footer a").evaluateAll(function (nodes) { return nodes.map(function (node) { const rect = node.getBoundingClientRect(); return { width: rect.width, height: rect.height }; }); });
    controls.forEach(function (size) { assert.ok(size.width >= 44, `touch width ${size.width} at ${width}px`); assert.ok(size.height >= 44, `touch height ${size.height} at ${width}px`); });
    assert.deepEqual(errors, []);
    await page.close();
  }
});

test("6.NS.B GCF A4 print state shows the complete model and hides playback chrome", async function () {
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
  const errors = collectErrors(page);
  await page.goto(`${baseUrl}?lesson=gcf-factor-chain&cluster=6.NS.B&locale=en`, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  const state = await page.evaluate(function () {
    const objects = Array.from(document.querySelectorAll(".scene-object"));
    return {
      opacities: objects.map(function (node) { return getComputedStyle(node).opacity; }),
      controls: getComputedStyle(document.querySelector(".lesson-controls")).display,
      width: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth
    };
  });
  assert.ok(state.opacities.every(function (opacity) { return opacity === "1"; }));
  assert.equal(state.controls, "none");
  assert.equal(state.width, state.client);
  assert.deepEqual(errors, []);
  await page.close();
});

test("6.NS.C number-line labels remain legible at 320 and 390 pixels", async function () {
  for (const width of [320, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 844 }, isMobile: true });
    const errors = collectErrors(page);
    await page.goto(`${baseUrl}?lesson=signed-rational-number-line&cluster=6.NS.C&locale=ko`, { waitUntil: "networkidle" });
    await page.locator("#show-overview").click();
    const measurements = await page.locator(".signed-axis-label,.signed-point-label,.signed-distance-label").evaluateAll(function (nodes) {
      return nodes.map(function (node) { const rect = node.getBoundingClientRect(); return { height: rect.height, left: rect.left, right: rect.right }; });
    });
    measurements.forEach(function (measurement) {
      assert.ok(measurement.height >= 12, `number-line label height ${measurement.height} at ${width}px`);
      assert.ok(measurement.left >= 0 && measurement.right <= width, `number-line label stays inside ${width}px viewport`);
    });
    const dimensions = await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; });
    assert.deepEqual(dimensions, [width, width]);
    assert.deepEqual(errors, []);
    await page.close();
  }
});

test("6.NS.C number-line A4 print state shows all exact comparison objects", async function () {
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
  const errors = collectErrors(page);
  await page.goto(`${baseUrl}?lesson=signed-rational-number-line&cluster=6.NS.C&locale=en`, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  const state = await page.evaluate(function () {
    return {
      hidden: Array.from(document.querySelectorAll(".scene-object")).filter(function (node) { return getComputedStyle(node).opacity !== "1"; }).length,
      answer: document.querySelector('[data-object="signed-answer"]').textContent,
      controls: getComputedStyle(document.querySelector(".lesson-controls")).display,
      width: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth
    };
  });
  assert.equal(state.hidden, 0);
  assert.match(state.answer, /-7\/4 < -5\/3/);
  assert.equal(state.controls, "none");
  assert.equal(state.width, state.client);
  assert.deepEqual(errors, []);
  await page.close();
});

test("6.EE.A expression tree stays legible on mobile and complete on A4", async function () {
  for (const width of [320, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 844 }, isMobile: true });
    const errors = collectErrors(page);
    await page.goto(`${baseUrl}?lesson=expression-structure-order&cluster=6.EE.A&locale=ko`, { waitUntil: "networkidle" });
    await page.locator("#show-overview").click();
    const dimensions = await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; });
    assert.deepEqual(dimensions, [width, width]);
    const nodes = await page.locator(".expression-node strong").evaluateAll(function (items) { return items.map(function (node) { const rect = node.getBoundingClientRect(); return { height: rect.height, left: rect.left, right: rect.right }; }); });
    nodes.forEach(function (node) { assert.ok(node.height >= 18); assert.ok(node.left >= 0 && node.right <= width); });
    assert.equal(await page.locator('[data-object="expr-answer"]').innerText(), "식의 값\n31");
    assert.deepEqual(errors, []); await page.close();
  }
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
  const errors = collectErrors(page);
  await page.goto(`${baseUrl}?lesson=expression-structure-order&cluster=6.EE.A&locale=en`, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  const state = await page.evaluate(function () { return { hidden: Array.from(document.querySelectorAll(".scene-object")).filter(function (node) { return getComputedStyle(node).opacity !== "1"; }).length, answer: document.querySelector('[data-object="expr-answer"]').textContent, controls: getComputedStyle(document.querySelector(".lesson-controls")).display, width: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }; });
  assert.equal(state.hidden, 0); assert.match(state.answer, /31/); assert.equal(state.controls, "none"); assert.equal(state.width, state.client); assert.deepEqual(errors, []);
  await page.close();
});

test("6.EE.B balance model gates the answer and stays complete on mobile and A4", async function () {
  for (const width of [320, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 844 }, isMobile: true });
    const errors = collectErrors(page);
    await page.goto(`${baseUrl}?lesson=equation-balance-groups&cluster=6.EE.B&locale=ko`, { waitUntil: "networkidle" });
    assert.equal(await page.locator(".balance-x-box").count(), 6);
    assert.equal(await page.locator('[data-object="balance-answer"]').getAttribute("aria-hidden"), "true");
    for (let index = 0; index < 4; index += 1) await page.locator("#next-step").click();
    assert.equal(await page.locator('[data-object="balance-unit"].is-visible').count(), 1);
    assert.equal(await page.locator('[data-object="balance-answer"]').getAttribute("aria-hidden"), "true");
    assert.doesNotMatch(await page.locator("#narration-text").innerText(), /x\s*=\s*7|값은 7/);
    await page.locator("#next-step").click();
    assert.equal(await page.locator('[data-object="balance-answer"]').getAttribute("aria-hidden"), "false");
    assert.match(await page.locator('[data-object="balance-answer"]').innerText(), /x = 7/);
    const dimensions = await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; });
    assert.deepEqual(dimensions, [width, width]);
    const boxes = await page.locator(".balance-x-box").evaluateAll(function (nodes) { return nodes.map(function (node) { const rect = node.getBoundingClientRect(); return { width: rect.width, height: rect.height, left: rect.left, right: rect.right }; }); });
    boxes.forEach(function (box) { assert.ok(box.width >= 40); assert.ok(box.height >= 44); assert.ok(box.left >= 0 && box.right <= width); });
    assert.deepEqual(errors, []); await page.close();
  }
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
  const errors = collectErrors(page);
  await page.goto(`${baseUrl}?lesson=equation-balance-groups&cluster=6.EE.B&locale=en`, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  const state = await page.evaluate(function () { return { hidden: Array.from(document.querySelectorAll(".scene-object")).filter(function (node) { return getComputedStyle(node).opacity !== "1"; }).length, boxes: document.querySelectorAll(".balance-x-box").length, answer: document.querySelector('[data-object="balance-answer"]').textContent, check: document.querySelector('[data-object="balance-check"]').textContent, controls: getComputedStyle(document.querySelector(".lesson-controls")).display, width: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }; });
  assert.equal(state.hidden, 0); assert.equal(state.boxes, 6); assert.match(state.answer, /x = 7/); assert.match(state.check, /6 × 7 = 42/); assert.equal(state.controls, "none"); assert.equal(state.width, state.client); assert.deepEqual(errors, []);
  await page.close();
});
