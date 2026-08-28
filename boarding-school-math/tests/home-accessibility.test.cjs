const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const repoRoot = path.resolve(__dirname, "..", "..");
let server;
let browser;
let url;

test.before(async function () {
  server = http.createServer(function (request, response) {
    const requestPath = new URL(request.url, "http://127.0.0.1").pathname;
    const relative = requestPath === "/boarding-school-math/" ? "/boarding-school-math/index.html" : requestPath;
    const target = path.resolve(repoRoot, `.${relative}`);
    if (!target.startsWith(repoRoot) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
      response.writeHead(404).end("Not found");
      return;
    }
    const extension = path.extname(target);
    const type = extension === ".html" ? "text/html" : extension === ".css" ? "text/css" : "text/javascript";
    response.writeHead(200, { "content-type": `${type}; charset=utf-8` });
    fs.createReadStream(target).pipe(response);
  });
  await new Promise(function (resolve) { server.listen(0, "127.0.0.1", resolve); });
  url = `http://127.0.0.1:${server.address().port}/boarding-school-math/`;
  browser = await chromium.launch({ headless: true });
});

test.after(async function () {
  await browser.close();
  await new Promise(function (resolve) { server.close(resolve); });
});

test("learning directory has connected landmarks, headings, and tab panels", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(url, { waitUntil: "networkidle" });

  const audit = await page.evaluate(function () {
    const ids = Array.from(document.querySelectorAll("[id]")).map(function (node) { return node.id; });
    const duplicates = ids.filter(function (id, index) { return ids.indexOf(id) !== index; });
    const headings = Array.from(document.querySelectorAll("h1,h2,h3")).map(function (heading) {
      return { level: Number(heading.tagName.slice(1)), text: heading.textContent.trim() };
    });
    const jumps = headings.filter(function (heading, index) {
      return index > 0 && heading.level > headings[index - 1].level + 1;
    });
    const disconnectedTabs = Array.from(document.querySelectorAll('[role="tab"]')).filter(function (tab) {
      const controls = tab.getAttribute("aria-controls");
      return !tab.id || !controls || !document.getElementById(controls);
    }).map(function (tab) { return tab.id || tab.textContent.trim(); });
    return { duplicates, headings, jumps, disconnectedTabs };
  });

  assert.deepEqual(audit.duplicates, []);
  assert.ok(audit.headings.length > 8);
  assert.equal(audit.headings.filter(function (heading) { return heading.level === 1; }).length, 1);
  assert.equal(audit.headings.some(function (heading) { return !heading.text; }), false);
  assert.deepEqual(audit.jumps, []);
  assert.deepEqual(audit.disconnectedTabs, []);
  await page.close();
});

test("skip link and every tab set work from the keyboard", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(url, { waitUntil: "networkidle" });

  await page.keyboard.press("Tab");
  assert.equal(await page.locator(":focus").getAttribute("href"), "#main");
  await page.keyboard.press("Enter");
  assert.equal(await page.evaluate(function () { return location.hash; }), "#main");
  assert.equal(await page.locator(":focus").getAttribute("id"), "main");

  await page.locator(".advanced-home-tools summary").click();
  await page.locator('[data-role-preview="student"]').focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(await page.locator('[data-role-preview="teacher"]').getAttribute("aria-selected"), "true");
  assert.equal(await page.locator(":focus").getAttribute("data-role-preview"), "teacher");

  await page.locator('[data-grade-tab="6"]').focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(await page.locator('[data-grade-tab="7"]').getAttribute("aria-selected"), "true");
  await page.keyboard.press("End");
  assert.equal(await page.locator('[data-grade-tab="8"]').getAttribute("aria-selected"), "true");

  await page.locator('[data-map-view="grade"]').focus();
  await page.keyboard.press("Home");
  assert.equal(await page.locator('[data-map-view="grade"]').getAttribute("aria-selected"), "true");
  await page.keyboard.press("ArrowRight");
  assert.equal(await page.locator('[data-map-view="domain"]').getAttribute("aria-selected"), "true");
  assert.equal(await page.locator("#domain-directory").isVisible(), true);
  await page.close();
});

test("official source links are external, isolated, and never embedded", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.locator('[data-goal="sasmo"]').click();
  const original = page.locator("#goal-original");
  assert.equal(await original.getAttribute("target"), "_blank");
  const rel = await original.getAttribute("rel");
  assert.match(rel, /noopener/);
  assert.match(rel, /noreferrer/);
  assert.equal(await page.locator("iframe, embed, object").count(), 0);
  assert.equal(await page.locator('a[href$=".pdf"]').count(), 0);
  await page.close();
});
