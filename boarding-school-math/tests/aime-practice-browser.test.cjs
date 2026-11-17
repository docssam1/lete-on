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
let url;

test.before(async function () {
  server = http.createServer(function (request, response) {
    const pathname = new URL(request.url, "http://127.0.0.1").pathname;
    const file = path.resolve(root, `.${decodeURIComponent(pathname)}`);
    if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      response.writeHead(404); response.end("Not found"); return;
    }
    const type = file.endsWith(".html") ? "text/html" : file.endsWith(".css") ? "text/css" : file.endsWith(".js") ? "text/javascript" : "application/octet-stream";
    response.writeHead(200, { "content-type": `${type}; charset=utf-8` });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise(function (resolve) { server.listen(0, "127.0.0.1", resolve); });
  url = `http://127.0.0.1:${server.address().port}/boarding-school-math/aime-practice.html`;
  const launchOptions = { headless: true };
  if (process.env.GFIELD_CHROME_EXECUTABLE) launchOptions.executablePath = process.env.GFIELD_CHROME_EXECUTABLE;
  browser = await chromium.launch(launchOptions);
});

test.after(async function () {
  if (browser) await browser.close();
  if (server) await new Promise(function (resolve) { server.close(resolve); });
});

test("AIME-style practice validates integer answers, filters, explanations, and responsive layout", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  await page.goto(url, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".problem-card").count(), 63);
  assert.equal(await page.locator(".answer-entry input").count(), 63);
  assert.equal(await page.locator("#aime-back-route").evaluate(function (node) { return getComputedStyle(node).textDecorationLine; }), "none", "roadmap navigation is styled as a GFIELD action instead of default underlined link text");
  assert.equal(await page.locator("#aime-back-route").evaluate(function (node) { return getComputedStyle(node).color; }), "rgb(96, 65, 143)");
  assert.equal(await page.locator("body").evaluate(function (node) { return getComputedStyle(node).getPropertyValue("--blue").trim(); }), "#60418f", "AIME practice uses the roadmap plum accent");
  assert.equal(await page.locator("body").evaluate(function (node) { return getComputedStyle(node).getPropertyValue("--blue-soft").trim(); }), "#f0ebf7", "selected practice states use the roadmap lilac wash");
  assert.deepEqual(await page.evaluate(function () { return window.GFIELDAimeConceptPractice.items.map(function (item) { return item.answer; }); }), [30, 17, 6, 84, 72, 60, 95, 91, 49, 418, 48, 43, 16, 4]);
  assert.match(await page.locator(".practice-boundary").innerText(), /실력·학년·과목 배치나 AIME 응시 자격을 판정하지 않습니다/);
  assert.ok(await page.locator('.math-fraction[aria-label="2분의 1"]').count() >= 2, "actual one-half values should render as stacked fractions");
  assert.equal(await page.locator(".math-fraction").first().evaluate(function (node) { return getComputedStyle(node).display; }), "inline-grid", "fraction numerator and denominator should be visually stacked");
  assert.notEqual(await page.locator(".math-fraction-numerator").first().evaluate(function (node) { return getComputedStyle(node).borderBottomStyle; }), "none", "stacked fraction should show a fraction bar");
  assert.equal(await page.locator(".domain-filter[aria-label='수학 영역: 정수론']").count(), 1);
  const reflection = page.locator(".practice-reflection");
  assert.deepEqual(await reflection.locator("li").allTextContents(), ["왜 이 방법을 골랐나요?", "다른 방법으로도 풀 수 있나요?", "조건 하나를 바꾸면 무엇이 달라지나요?", "숫자가 바뀌어도 같은 생각이 통하나요?"]);
  await reflection.locator("summary").click();
  assert.equal(await reflection.evaluate(function (node) { return node.open; }), true);

  const firstCard = page.locator(".problem-card").first();
  const firstInput = firstCard.locator("input");
  await firstInput.fill("1000");
  await firstCard.locator("button[type=submit]").click();
  assert.match(await firstCard.locator(".feedback").innerText(), /0부터 999까지/);
  await firstInput.fill("29");
  await firstCard.locator("button[type=submit]").click();
  assert.match(await firstCard.locator(".feedback").innerText(), /아직 정답이 아니에요/);
  await firstInput.fill("30");
  await firstCard.locator("button[type=submit]").click();
  assert.match(await firstCard.locator(".feedback").innerText(), /정답이에요/);
  assert.equal(await page.locator("#practice-progress").innerText(), "1 / 63");
  await page.locator(".domain-filter[aria-label='수학 영역: 정수론']").click();
  assert.equal(await page.locator(".problem-card").count(), await page.evaluate(() => [...GFIELDAimeConceptPractice.items, ...GFIELDAimeConceptPracticeExtension.items].filter(x => x.domain === "정수론").length));
  assert.equal(await page.locator(".domain-filter[aria-label='풀이 단계: 연결']").count(), 1);
  await page.locator(".domain-filter[aria-label='수학 영역: 전체']").click();
  await page.locator(".domain-filter[aria-label='풀이 단계: 연결']").click();
  assert.equal(await page.locator(".problem-card").count(), await page.evaluate(() => [...GFIELDAimeConceptPractice.items, ...GFIELDAimeConceptPracticeExtension.items].filter(x => x.stage === "연결").length));
  await page.locator(".domain-filter[aria-label='풀이 단계: 전체']").click();
  assert.equal(await page.locator("#problem-aime-g8-algebra-01").getAttribute("data-solved"), "true");
  const solution = page.locator("#problem-aime-g8-algebra-01 .worked-solution").nth(1);
  await solution.locator("summary").click();
  assert.match(await solution.innerText(), /개념 연결 질문/);
  assert.equal(await page.locator("body").evaluate(function (node) { return node.scrollWidth <= node.clientWidth; }), true);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(100);
  assert.equal(await page.locator("body").evaluate(function (node) { return node.scrollWidth <= node.clientWidth; }), true);
  assert.equal(await page.locator("body").evaluate(function (node) { return getComputedStyle(node).wordBreak; }), "keep-all", "Korean text breaks between words on mobile");
  assert.equal(await page.evaluate(() => [...GFIELDAimeConceptPractice.items, ...GFIELDAimeConceptPracticeExtension.items].every(x => Number.isInteger(x.answer) && x.answer >= 0 && x.answer <= 999)), true);
  const remainderCard = page.locator("#problem-aime-g8-number-05");
  assert.match(await remainderCard.locator(".problem-prompt").innerText(), /1000으로 나눈 나머지/);
  const independentSum = Array.from({length:100}, (_,i) => i+1).filter(n => n%3===0 || n%5===0).reduce((a,b) => a+b,0);
  assert.equal(independentSum % 1000, 418);
  await remainderCard.locator("input").fill(String(independentSum % 1000));
  await remainderCard.locator("button[type=submit]").click();
  assert.match(await remainderCard.locator(".feedback").innerText(), /정답이에요/);
  assert.deepEqual(errors, []);
  await page.close();
});
