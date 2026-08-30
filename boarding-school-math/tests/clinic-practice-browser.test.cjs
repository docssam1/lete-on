const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const repoRoot = path.resolve(__dirname, "..", "..");
const answers = ["20", "3:4", "14", "35", "35", "0.75", "1920", "5.25", "17", "75", "210", "35"];
let server; let browser; let baseUrl;

function contentType(file) {
  if (file.endsWith(".html")) return "text/html; charset=utf-8";
  if (file.endsWith(".css")) return "text/css; charset=utf-8";
  if (file.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (file.endsWith(".svg")) return "image/svg+xml";
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
    const file = path.resolve(repoRoot, "." + decodeURIComponent(request.url.split("?")[0]));
    if (!file.startsWith(repoRoot) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { response.writeHead(404); response.end("Not found"); return; }
    response.writeHead(200, { "content-type": contentType(file) }); fs.createReadStream(file).pipe(response);
  });
  await new Promise(function (resolve) { server.listen(0, "127.0.0.1", resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}/boarding-school-math/clinic-practice.html`;
  browser = await chromium.launch({ headless: true });
});
test.after(async function () { if (browser) await browser.close(); if (server) await new Promise(function (resolve) { server.close(resolve); }); });

test("student answers and solutions stay hidden until an authentic attempt", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = errorsFor(page);
  await page.goto(`${baseUrl}?cluster=6.RP.A&mode=workbook&audience=student&locale=ko`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".problem-card").count(), 12);
  assert.equal(await page.locator(".teacher-answer,.solution-box,.solution-toggle,.hint-box").count(), 0);
  assert.equal(await page.locator('[data-audience="teacher"]').isVisible(), false);
  const first = page.locator('.problem-card[data-item-id="rp-w01"]');
  await first.locator(".response-row button").click();
  assert.equal(await first.locator(".solution-toggle,.hint-box").count(), 0);
  await first.locator("input").fill("19"); await first.locator(".response-row button").click();
  assert.equal(await first.locator(".hint-box").count(), 1);
  assert.equal(await first.locator(".solution-box").count(), 0);
  await first.locator(".solution-toggle").click();
  assert.equal(await first.locator(".solution-box").count(), 1);
  assert.match(await first.locator(".solution-box").innerText(), /20/);
  assert.deepEqual(errors, []);
  await page.close();
});

test("6.NS.A uses the shared shell, exact fraction rules, and its own completion key", async function () {
  const context = await browser.newContext({ viewport: { width: 1180, height: 900 } });
  const page = await context.newPage(); const errors = errorsFor(page);
  await page.goto(`${baseUrl}?cluster=6.NS.A&mode=workbook&audience=student&locale=en`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".problem-card").count(), 12);
  assert.match(await page.locator("#page-title").innerText(), /fraction division/i);
  const strict = page.locator('.problem-card[data-item-id="ns-w05"]');
  await strict.locator("input").fill("10/8"); await strict.locator(".response-row button").click();
  assert.equal(await strict.locator(".is-correct").count(), 0);
  await strict.locator("input").fill("5/4"); await strict.locator(".response-row button").click();
  assert.equal(await strict.getAttribute("class").then(function (value) { return value.includes("is-correct"); }), true);
  const answersNs = ["6", "4", "10", "6", null, "15/16", "15/4", "10/3", "4", "5", "9/2", "6"];
  for (let index = 0; index < answersNs.length; index += 1) {
    if (answersNs[index] == null) continue;
    const card = page.locator(".problem-card").nth(index);
    await card.locator("input").fill(answersNs[index]); await card.locator(".response-row button").click();
  }
  assert.equal(await page.locator(".problem-card.is-correct").count(), 12);
  assert.equal(await page.evaluate(function () { return localStorage.getItem("gfield-clinic-workbook:6.NS.A:v1"); }), "complete-v1");
  assert.deepEqual(errors, []);
  await context.close();
});

test("6.NS.B uses exact decimal rules, independent strands, and its own completion key", async function () {
  const context = await browser.newContext({ viewport: { width: 1180, height: 900 } });
  const page = await context.newPage(); const errors = errorsFor(page);
  await page.goto(`${baseUrl}?cluster=6.NS.B&mode=workbook&audience=student&locale=en`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".problem-card").count(), 12);
  assert.match(await page.locator("#page-title").innerText(), /computation/i);
  assert.equal(await page.locator(".teacher-answer,.solution-box,.hint-box").count(), 0);
  const decimal = page.locator('.problem-card[data-item-id="nsb-w05"]');
  await decimal.locator("input").fill("25.157999"); await decimal.locator(".response-row button").click();
  assert.equal(await decimal.getAttribute("class").then(function (value) { return value.includes("is-correct"); }), false);
  const values = ["42", "364", "125", "384", "25.158", "24.755", "9", "11.9", "12", "24", "12", "12"];
  for (let index = 0; index < values.length; index += 1) {
    const card = page.locator(".problem-card").nth(index);
    await card.locator("input").fill(values[index]); await card.locator(".response-row button").click();
  }
  assert.equal(await page.locator(".problem-card.is-correct").count(), 12);
  assert.equal(await page.evaluate(function () { return localStorage.getItem("gfield-clinic-workbook:6.NS.B:v1"); }), "complete-v1");
  assert.deepEqual(errors, []);
  await context.close();
});

test("6.NS.C keeps exact signed-number answers, teacher observation, and completion separate", async function () {
  const context = await browser.newContext({ viewport: { width: 1180, height: 900 } });
  const page = await context.newPage(); const errors = errorsFor(page);
  await page.goto(`${baseUrl}?cluster=6.NS.C&mode=workbook&audience=student&locale=en`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".problem-card").count(), 12);
  assert.match(await page.locator("#page-title").innerText(), /signed numbers[\s\S]*position and distance/i);
  assert.equal(await page.locator(".teacher-answer,.solution-box,.hint-box").count(), 0);
  const reduced = page.locator('.problem-card[data-item-id="nsc-w01"]');
  await reduced.locator("input").fill("14/8"); await reduced.locator(".response-row button").click();
  assert.equal(await reduced.getAttribute("class").then(function (value) { return value.includes("is-correct"); }), false);
  const values = ["7/4", "-5/3", "9/4", "7/4", "<", "-7/4", ">", "1", "2", "4", "2", "1"];
  for (let index = 0; index < values.length; index += 1) {
    const card = page.locator(".problem-card").nth(index);
    await card.locator("input").fill(values[index]); await card.locator(".response-row button").click();
  }
  assert.equal(await page.locator(".problem-card.is-correct").count(), 12);
  assert.equal(await page.evaluate(function () { return localStorage.getItem("gfield-clinic-workbook:6.NS.C:v1"); }), "complete-v1");
  await page.goto(`${baseUrl}?cluster=6.NS.C&mode=workbook&audience=teacher&locale=zh-Hans`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".teacher-answer").count(), 24);
  assert.equal(await page.locator(".response-row").count(), 0);
  assert.match(await page.locator(".scope-note").innerText(), /实际描点与情境说明由教师另行观察/);
  assert.deepEqual(errors, []);
  await context.close();
});

test("6.EE.A keeps exact numeric evidence and teacher explanation separate", async function () {
  const context = await browser.newContext({ viewport: { width: 1180, height: 900 } });
  const page = await context.newPage(); const errors = errorsFor(page);
  await page.goto(`${baseUrl}?cluster=6.EE.A&mode=workbook&audience=student&locale=en`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".problem-card").count(), 12);
  assert.match(await page.locator("#page-title").innerText(), /see the structure[\s\S]*evaluate and verify/i);
  assert.equal(await page.locator(".teacher-answer,.solution-box,.hint-box").count(), 0);
  const values = ["32", "81", "41", "3", "8", "19", "21", "8", "3", "20", "1", "7"];
  for (let index = 0; index < values.length; index += 1) {
    const card = page.locator(".problem-card").nth(index);
    await card.locator("input").fill(values[index]); await card.locator(".response-row button").click();
  }
  assert.equal(await page.locator(".problem-card.is-correct").count(), 12);
  assert.equal(await page.evaluate(function () { return localStorage.getItem("gfield-clinic-workbook:6.EE.A:v1"); }), "complete-v1");
  await page.goto(`${baseUrl}?cluster=6.EE.A&mode=workbook&audience=teacher&locale=zh-Hans`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".teacher-answer").count(), 24);
  assert.equal(await page.locator(".response-row").count(), 0);
  assert.match(await page.locator(".scope-note").innerText(), /等价理由由教师另行观察/);
  assert.deepEqual(errors, []);
  await context.close();
});

test("accurate workbook completion unlocks the separate four-item recheck", async function () {
  const context = await browser.newContext({ viewport: { width: 1180, height: 900 } });
  const page = await context.newPage(); const errors = errorsFor(page);
  await page.goto(`${baseUrl}?cluster=6.RP.A&mode=workbook&audience=student&locale=en`, { waitUntil: "networkidle" });
  for (let index = 0; index < answers.length; index += 1) {
    const card = page.locator(".problem-card").nth(index);
    await card.locator("input").fill(answers[index]); await card.locator(".response-row button").click();
  }
  assert.equal(await page.locator(".problem-card.is-correct").count(), 12);
  assert.equal(await page.locator("#completion-card").isVisible(), true);
  assert.equal(await page.evaluate(function () { return localStorage.getItem("gfield-clinic-workbook:6.RP.A:v1"); }), "complete-v1");
  await page.locator("#completion-card a").click(); await page.waitForLoadState("networkidle");
  assert.equal(new URL(page.url()).searchParams.get("mode"), "recheck");
  assert.equal(await page.locator(".problem-card").count(), 4);
  assert.equal(await page.locator(".teacher-answer,.solution-box").count(), 0);
  assert.deepEqual(errors, []);
  await context.close();
});

test("recheck is locked before completion while teacher preview stays separate", async function () {
  const page = await browser.newPage({ viewport: { width: 1050, height: 850 } });
  const errors = errorsFor(page);
  await page.goto(`${baseUrl}?cluster=6.RP.A&mode=recheck&audience=student&locale=zh-Hans`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".lock-card").count(), 1);
  assert.equal(await page.locator(".problem-card").count(), 0);
  await page.goto(`${baseUrl}?cluster=6.RP.A&mode=workbook&audience=teacher&locale=zh-Hans`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".teacher-guide").count(), 1);
  assert.equal(await page.locator(".teacher-answer").count(), 24);
  assert.equal(await page.locator(".response-row").count(), 0);
  const visibleChineseSurfaces = await Promise.all([".site-header", ".clinic-hero", "#clinic-content", ".clinic-footer"].map(function (selector) { return page.locator(selector).innerText(); }));
  assert.equal(/[가-힣]/.test(visibleChineseSurfaces.join(" ")), false);
  assert.deepEqual(errors, []);
  await page.close();
});

test("6.NS.B student clinic has no horizontal overflow on mobile and has an A4 print state", async function () {
  for (const width of [320, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 844 }, isMobile: true });
    const errors = errorsFor(page);
    await page.goto(`${baseUrl}?cluster=6.NS.B&mode=workbook&audience=student&locale=ko`, { waitUntil: "networkidle" });
    const sizes = await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; });
    assert.deepEqual(sizes, [width, width]);
    const targets = await page.locator("button,select,input,.brand").evaluateAll(function (nodes) { return nodes.filter(function (node) { return getComputedStyle(node).display !== "none"; }).map(function (node) { const rect = node.getBoundingClientRect(); return [rect.width, rect.height]; }); });
    targets.forEach(function (size) { assert.ok(size[0] >= 44); assert.ok(size[1] >= 44); });
    assert.deepEqual(errors, []); await page.close();
  }
  const printPage = await browser.newPage({ viewport: { width: 794, height: 1123 } });
  await printPage.goto(`${baseUrl}?cluster=6.NS.B&mode=workbook&audience=student&locale=en`, { waitUntil: "networkidle" });
  await printPage.emulateMedia({ media: "print" });
  assert.equal(await printPage.locator(".clinic-toolbar").evaluate(function (node) { return getComputedStyle(node).display; }), "none");
  assert.equal(await printPage.locator(".response-row input").first().isVisible(), true);
  assert.equal(await printPage.locator(".solution-box,.teacher-answer").count(), 0);
  await printPage.close();
});

test("6.NS.C student clinic stays operable on mobile and answer-free on A4", async function () {
  for (const width of [320, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 844 }, isMobile: true });
    const errors = errorsFor(page);
    await page.goto(`${baseUrl}?cluster=6.NS.C&mode=workbook&audience=student&locale=ko`, { waitUntil: "networkidle" });
    assert.equal(await page.locator('.problem-card[data-item-id="nsc-w01"] input').getAttribute("inputmode"), "text");
    assert.equal(await page.locator('.problem-card[data-item-id="nsc-w02"] input').getAttribute("inputmode"), "text");
    assert.equal(await page.locator('.problem-card[data-item-id="nsc-w05"] input').getAttribute("inputmode"), "text");
    const sizes = await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; });
    assert.deepEqual(sizes, [width, width]);
    const targets = await page.locator("button,select,input,.brand").evaluateAll(function (nodes) { return nodes.filter(function (node) { return getComputedStyle(node).display !== "none"; }).map(function (node) { const rect = node.getBoundingClientRect(); return [rect.width, rect.height]; }); });
    targets.forEach(function (size) { assert.ok(size[0] >= 44); assert.ok(size[1] >= 44); });
    assert.deepEqual(errors, []); await page.close();
  }
  const printPage = await browser.newPage({ viewport: { width: 794, height: 1123 } });
  await printPage.goto(`${baseUrl}?cluster=6.NS.C&mode=workbook&audience=student&locale=en`, { waitUntil: "networkidle" });
  await printPage.emulateMedia({ media: "print" });
  assert.equal(await printPage.locator(".clinic-toolbar").evaluate(function (node) { return getComputedStyle(node).display; }), "none");
  assert.equal(await printPage.locator(".response-row input").first().isVisible(), true);
  assert.equal(await printPage.locator(".solution-box,.teacher-answer").count(), 0);
  await printPage.close();
});

test("6.EE.A student clinic stays operable on mobile and answer-free on A4", async function () {
  for (const width of [320, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 844 }, isMobile: true });
    const errors = errorsFor(page);
    await page.goto(`${baseUrl}?cluster=6.EE.A&mode=workbook&audience=student&locale=ko`, { waitUntil: "networkidle" });
    const sizes = await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; });
    assert.deepEqual(sizes, [width, width]);
    assert.equal(await page.locator(".teacher-answer,.solution-box").count(), 0);
    const targets = await page.locator("button,select,input,.brand").evaluateAll(function (nodes) { return nodes.filter(function (node) { return getComputedStyle(node).display !== "none"; }).map(function (node) { const rect = node.getBoundingClientRect(); return [rect.width, rect.height]; }); });
    targets.forEach(function (size) { assert.ok(size[0] >= 44); assert.ok(size[1] >= 44); });
    assert.deepEqual(errors, []); await page.close();
  }
  const printPage = await browser.newPage({ viewport: { width: 794, height: 1123 } });
  await printPage.goto(`${baseUrl}?cluster=6.EE.A&mode=workbook&audience=student&locale=en`, { waitUntil: "networkidle" });
  await printPage.emulateMedia({ media: "print" });
  assert.equal(await printPage.locator(".clinic-toolbar").evaluate(function (node) { return getComputedStyle(node).display; }), "none");
  assert.equal(await printPage.locator(".response-row input").first().isVisible(), true);
  assert.equal(await printPage.locator(".solution-box,.teacher-answer").count(), 0);
  await printPage.close();
});
