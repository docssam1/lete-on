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
  url = `http://127.0.0.1:${server.address().port}/boarding-school-math/boarding-roadmap.html`;
  const launchOptions = { headless: true };
  if (process.env.GFIELD_CHROME_EXECUTABLE) launchOptions.executablePath = process.env.GFIELD_CHROME_EXECUTABLE;
  browser = await chromium.launch(launchOptions);
});
test.after(async function () {
  if (browser) await browser.close();
  if (server) await new Promise(function (resolve) { server.close(resolve); });
});

test("original AMC and AIME practice routes return to the learner's selected grade", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  for (const grade of [7, 8]) {
    await page.goto(`${url.replace("boarding-roadmap.html", "amc10-practice.html")}?grade=${grade}`, { waitUntil: "networkidle" });
    assert.equal(await page.locator("#amc10-nav-route").innerText(), `${grade}학년 성장 지도`);
    assert.equal(await page.locator("#amc10-brand-route").getAttribute("href"), `./boarding-roadmap.html?grade=${grade}`);
    assert.equal(await page.locator("#amc10-back-route").getAttribute("href"), `./boarding-roadmap.html?grade=${grade}#annual-plan`);
    assert.equal(await page.locator("#amc10-footer-route").innerText(), `${grade}학년 로드맵으로 돌아가기`);
    assert.equal(await page.locator("#amc10-review-route").getAttribute("href"), `./competition-paper-review.html?grade=${grade}&program=amc10`);
  }
  for (const grade of [8, 10]) {
    await page.goto(`${url.replace("boarding-roadmap.html", "aime-practice.html")}?grade=${grade}`, { waitUntil: "networkidle" });
    assert.equal(await page.locator("#aime-nav-route").innerText(), `${grade}학년 성장 지도`);
    assert.equal(await page.locator("#aime-brand-route").getAttribute("href"), `./boarding-roadmap.html?grade=${grade}`);
    assert.equal(await page.locator("#aime-back-route").getAttribute("href"), `./boarding-roadmap.html?grade=${grade}#annual-plan`);
    assert.equal(await page.locator("#aime-footer-route").innerText(), `${grade}학년 로드맵으로 돌아가기`);
    assert.equal(await page.locator("#aime-amc-route").getAttribute("href"), grade === 8 ? "./amc10-practice.html?grade=8" : "./competition-paper-review.html?grade=10&program=amc12");
    assert.equal(await page.locator("#aime-amc-route").innerText(), grade === 8 ? "AMC 10 개념 연습" : "AMC 12 문항별 복습");
  }
  await page.close();
});

test("course pathway is selected by course and links Grade 7 Algebra 1 to GFIELD original material", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  await page.goto(`${url}?grade=7&program=kangaroo#grade-map`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#current-course-select").inputValue(), "", "course selection must not be inferred from grade");
  assert.match(await page.locator("#course-path-cards").innerText(), /지나온 과정[\s\S]*현재 과정[\s\S]*다음 과정/);
  await page.locator("#current-course-select").selectOption("algebra-1");
  assert.deepEqual(await page.locator("#course-path-cards h3").allInnerTexts(), ["앞선 과목을 선택해 주세요", "Algebra 1", "다음 과목을 선택해 주세요"]);
  assert.deepEqual(await page.locator("#course-path-cards article:first-child select option").allTextContents(), ["지나온 과정 고르기", "Pre-Algebra"]);
  assert.deepEqual(await page.locator("#course-path-cards article:last-child select option").allTextContents(), ["다음 과정 고르기", "Geometry", "Algebra 2"]);
  await page.locator("#course-path-cards article:first-child select").selectOption("pre-algebra");
  await page.locator("#course-path-cards article:last-child select").selectOption("geometry");
  assert.deepEqual(await page.locator("#course-path-cards h3").allInnerTexts(), ["Pre-Algebra", "Algebra 1", "Geometry"]);
  assert.deepEqual(await page.locator(".course-path-material-link").evaluateAll(function (nodes) { return nodes.map(function (node) { return node.getAttribute("href"); }); }), ["./prealgebra-path.html", "./algebra1-workbook.html", "./geometry-workbook.html"]);
  assert.match(await page.locator("#course-path-cards").innerText(), /Pre-Algebra 4단원·27차시·54문항 공개[\s\S]*5단원·32차시·64문항 공개[\s\S]*5단원·16차시·32문항 공개/);
  await page.locator("#annual-plan-periods a").first().click();
  await page.waitForURL(/algebra1-workbook\.html\?edition=student$/);
  assert.equal(await page.locator("#workbook-title").innerText(), "Algebra 1 단원 교재");
  assert.match(await page.locator("#workbook-status").innerText(), /5개 단원 · .*차시 · 연습 .*문항 · A4/);
  await page.goto(`${url}?grade=7#algebra1-course`, { waitUntil: "networkidle" });
  assert.match(await page.locator("#algebra1-course").innerText(), /식의 계산과 방정식[\s\S]*지필드 원본[\s\S]*3\(2x − 1\) = 15/);
  assert.equal(await page.locator(".algebra1-unit-card").count(), 5);
  assert.equal(await page.locator(".algebra1-lesson-sequence").count(), 5);
  const unit1 = page.locator(".algebra1-unit-card").first();
  await unit1.locator(".algebra1-lesson-sequence > summary").click();
  assert.equal(await unit1.locator(".algebra1-session").count(), 7);
  await unit1.locator(".algebra1-session > summary").first().click();
  assert.match(await unit1.locator(".algebra1-session").first().innerText(), /변수로 상황을 식으로 나타내기[\s\S]*C = 7 \+ 4x[\s\S]*직접 풀어 보기/);
  await unit1.locator(".algebra1-session").first().locator(".algebra1-answer > summary").first().click();
  assert.match(await unit1.locator(".algebra1-session").first().innerText(), /17달러/);
  const unit2 = page.locator(".algebra1-unit-card").nth(1);
  await unit2.locator(".algebra1-lesson-sequence > summary").click();
  assert.equal(await unit2.locator(".algebra1-session").count(), 6);
  assert.match(await unit2.innerText(), /함수 표기법으로 출력 구하기[\s\S]*상황에 맞는 일차함수 만들기/);
  assert.deepEqual(await page.locator(".algebra1-standard-sources a").evaluateAll(function (links) { return links.map(function (link) { return link.href; }); }), ["https://www.thecorestandards.org/Math/Content/HSA/", "https://www.thecorestandards.org/Math/Content/HSF/"]);
  const unit3 = page.locator(".algebra1-unit-card").nth(2);
  await unit3.locator(".algebra1-lesson-sequence > summary").click();
  assert.equal(await unit3.locator(".algebra1-session").count(), 6);
  assert.match(await unit3.innerText(), /연립방정식의 해와 그래프의 교점[\s\S]*연립부등식과 가능한 영역/);
  const unit4 = page.locator(".algebra1-unit-card").nth(3);
  await unit4.locator(".algebra1-lesson-sequence > summary").click();
  assert.equal(await unit4.locator(".algebra1-session").count(), 6);
  assert.match(await unit4.innerText(), /거듭제곱의 성질 적용하기[\s\S]*지수함수의 시작값과 변화율 해석하기/);
  const unit5 = page.locator(".algebra1-unit-card").nth(4);
  await unit5.locator(".algebra1-lesson-sequence > summary").click();
  assert.equal(await unit5.locator(".algebra1-session").count(), 7);
  assert.match(await unit5.innerText(), /이차식의 곱과 표준형 연결하기[\s\S]*자료에 맞는 이차 모델 선택하기/);
  assert.deepEqual(await page.locator(".algebra1-unit-card").evaluateAll(function (cards) { return cards.map(function (card) { return getComputedStyle(card).gridColumn; }); }), ["1 / -1", "1 / -1", "1 / -1", "1 / -1", "1 / -1"]);
  assert.equal(await page.locator(".algebra1-unit-lesson").count(), 5);
  assert.ok(await page.locator('.algebra1-session .math-fraction[aria-label="3분의 8"]').count() > 0, "Algebra 1 lesson text should render a coordinate fraction as a stacked fraction");
  assert.ok(await page.locator('.algebra1-session .math-fraction[aria-label="3분의 14"]').count() > 0, "Algebra 1 lesson text should render both coordinate fractions as stacked fractions");
  await page.locator(".algebra1-unit-lesson").nth(2).locator("summary").click();
  assert.match(await page.locator(".algebra1-unit-lesson").nth(2).innerText(), /입장권[\s\S]*a \+ s = 28[\s\S]*a = 13, s = 15/);
  assert.doesNotMatch(await page.locator("body").innerText(), /추정안|AoPS Introduction to Algebra/);
  assert.deepEqual(errors, []);
  await page.close();
});

test("Pre-Algebra route connects public materials and the original six-lesson expression unit", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  await page.goto(`${url.replace("boarding-roadmap.html", "prealgebra-path.html")}`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("h1").innerText(), "Pre-Algebra로\n이어지는 수학 경로");
  assert.deepEqual(await page.locator(".route-stage h2").allInnerTexts(), [
    "수 감각에서 유리수 연산으로", "같은 비에서 비례 관계로", "변수로 관계를 나타내고 식을 정리해요", "그림·표·그래프로 생각을 보여줘요"
  ]);
  assert.equal(await page.locator(".route-stage").count(), 4);
  assert.equal(await page.locator(".route-stage .resource-links a:not(.workbook-link)").count(), 10);
  assert.equal(await page.locator(".route-stage .workbook-link").count(), 14);
  const conceptClusters = await page.locator('.route-stage .resource-links a:not(.workbook-link)').evaluateAll(function (nodes) {
    return nodes.map(function (node) { return new URL(node.href).searchParams.get("cluster"); });
  });
  assert.deepEqual(new Set(conceptClusters), new Set(["6.NS.A", "6.NS.B", "6.NS.C", "6.RP.A", "6.EE.A", "6.EE.B", "6.EE.C", "6.G.A", "6.SP.A", "6.SP.B"]));
  const workbookClusters = await page.locator(".route-stage .workbook-link").evaluateAll(function (nodes) {
    return nodes.map(function (node) { return new URL(node.href).searchParams.get("cluster"); });
  });
  assert.deepEqual(workbookClusters, [null, null, "6.NS.A", "6.NS.B", "6.NS.C", "7.NS.A", null, null, "6.RP.A", "7.RP.A", "6.EE.A", null, null, "6.SP.A"]);
  assert.deepEqual(await page.locator('#number-system a[href^="./prealgebra-workbook.html"]').evaluateAll(function (nodes) {
    return nodes.map(function (node) { return new URL(node.href).searchParams.get("unit") + ":" + new URL(node.href).searchParams.get("edition"); });
  }), ["rational-number-operations:student", "rational-number-operations:teacher"]);
  for (const link of await page.locator(".route-stage a").evaluateAll(function (nodes) { return nodes.map(function (node) { return node.href; }); })) {
    const response = await page.request.get(link);
    assert.equal(response.status(), 200, `resource link should load: ${link}`);
  }
  assert.equal(await page.locator(".course-bridge a").getAttribute("href"), "./algebra1-workbook.html");
  assert.deepEqual(await page.locator("#expressions-and-relationships .route-concepts li").allInnerTexts(), [
    "문자를 사용한 식과 식의 값", "거듭제곱과 혼합계산", "문장을 식으로 나타내기",
    "교환법칙·결합법칙·분배법칙", "분배법칙과 공통인수", "동류항의 정리"
  ]);
  assert.equal(await page.locator('#expressions-and-relationships a[href="./prealgebra-workbook.html?edition=student"]').count(), 1);
  assert.equal(await page.locator('#expressions-and-relationships a[href="./prealgebra-workbook.html?edition=teacher"]').count(), 1);
  assert.equal(await page.evaluate(function () { return document.documentElement.scrollWidth === document.documentElement.clientWidth; }), true);
  await page.setViewportSize({ width: 1280, height: 900 });
  assert.equal(await page.evaluate(function () { return document.documentElement.scrollWidth === document.documentElement.clientWidth; }), true);
  assert.deepEqual(errors, []);
  await page.close();
});

test("original Pre-Algebra units render stacked fractions in student, teacher, and A4 views", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  const workbookUrl = `${url.replace("boarding-roadmap.html", "prealgebra-workbook.html")}?edition=student`;
  await page.goto(workbookUrl, { waitUntil: "networkidle" });
  assert.match(await page.locator("#workbook-status").innerText(), /4개 단원 · 27차시 · 연습 54문항 · A4/);
  assert.equal(await page.locator(".lesson-page").count(), 27);
  assert.equal(await page.locator(".practice-page").count(), 27);
  assert.ok(await page.locator('.math-fraction[aria-label="2분의 3"]').count() > 0);
  assert.ok(await page.locator('.math-fraction[aria-label="4분의 9"]').count() > 0);
  assert.equal(await page.locator(".lesson-page,.practice-page").evaluateAll(function (pages) {
    return pages.some(function (node) { return /\d\s*\/\s*\d/.test(node.innerText); });
  }), false, "student workbook shows stacked fractions, not slash notation");
  assert.ok(await page.locator(".math-fraction").evaluateAll(function (nodes) {
    return nodes.every(function (node) {
      return getComputedStyle(node).display === "inline-grid"
        && getComputedStyle(node.querySelector(".math-fraction-numerator")).borderBottomWidth !== "0px";
    });
  }));
  await page.emulateMedia({ media: "print" });
  assert.equal(await page.locator(".print-page").evaluateAll(function (pages) {
    return pages.some(function (node) { return /\d\s*\/\s*\d/.test(node.innerText); });
  }), false, "A4 output keeps fraction formatting");
  assert.equal(await page.locator(".print-page").evaluateAll(function (pages) {
    return pages.filter(function (node) { return node.scrollHeight > node.clientHeight + 1; }).length;
  }), 0);
  await page.emulateMedia({ media: "screen" });
  await page.locator("#edition-select").selectOption("teacher");
  assert.equal(await page.locator(".answer-page").count(), 27);
  assert.equal(await page.locator(".answer-page").evaluateAll(function (pages) {
    return pages.some(function (node) { return /\d\s*\/\s*\d/.test(node.innerText); });
  }), false, "teacher edition keeps fractions stacked in the worked solutions");
  assert.ok(await page.locator(".answer-page .math-fraction").count() > 0);
  assert.deepEqual(errors, []);
  await page.close();
});

test("the original Algebra 1 Unit 1 sequence remains readable and contained on a phone", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  await page.goto(`${url}?grade=7#algebra1-course`, { waitUntil: "networkidle" });
  await page.locator(".algebra1-unit-card").first().locator(".algebra1-lesson-sequence > summary").click();
  await page.locator(".algebra1-session > summary").first().click();
  const unit1 = page.locator(".algebra1-unit-card").first();
  assert.equal(await unit1.locator(".algebra1-session").count(), 7);
  assert.ok(await page.locator(".algebra1-answer").count() >= 14);
  for (const unitIndex of [1, 2, 3, 4]) {
    await page.locator(".algebra1-unit-card").nth(unitIndex).locator(".algebra1-lesson-sequence > summary").click();
  }
  assert.deepEqual(await page.locator(".algebra1-unit-card").evaluateAll(function (cards) {
    return cards.map(function (card) { return card.querySelectorAll(".algebra1-session").length; });
  }), [7, 6, 6, 6, 7]);
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.clientWidth, document.documentElement.scrollWidth]; }), [390, 390]);
  assert.deepEqual(await page.locator(".algebra1-unit-card").evaluateAll(function (cards) { return cards.map(function (node) { return getComputedStyle(node).gridColumn; }); }), ["1 / -1", "1 / -1", "1 / -1", "1 / -1", "1 / -1"]);
  assert.ok(await unit1.locator(".algebra1-lesson-sequence").evaluate(function (node) { return node.getBoundingClientRect().width > 300; }));
  assert.ok(Number.parseFloat(await page.locator(".algebra1-unit-card:nth-child(5) .algebra1-session > summary").first().evaluate(function (node) { return getComputedStyle(node).fontSize; })) >= 14);
  assert.deepEqual(errors, []);
  await page.close();
});

test("the original Algebra 2 workbook uses stacked fractions and keeps student/teacher editions separate", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  await page.goto(`${new URL(url).origin}/boarding-school-math/algebra2-workbook.html?edition=student`, { waitUntil: "networkidle" });
  assert.match(await page.locator("#workbook-title").innerText(), /Algebra 2/);
  assert.match(await page.locator("#workbook-status").innerText(), /5개 단원 · 18차시 · 연습 36문항/);
  assert.equal(await page.locator(".unit-page").count(), 5);
  assert.equal(await page.locator(".lesson-page").count(), 18);
  assert.equal(await page.locator(".practice-page").count(), 18);
  assert.equal(await page.locator(".answer-page").count(), 0);
  assert.ok(await page.locator(".math-fraction").count() > 0);
  assert.ok(await page.locator(".math-fraction").evaluateAll(function (nodes) { return nodes.every(function (node) {
    return getComputedStyle(node).display === "inline-grid" && getComputedStyle(node.querySelector(".math-fraction-numerator")).borderBottomWidth !== "0px";
  }); }));
  assert.ok(await page.locator(".lesson-page").evaluateAll(function (pages) { return pages.some(function (node) {
    return node.querySelector('.math-fraction[aria-label*="x − 3분의 x² − 9"]');
  }); }));
  assert.ok(await page.locator(".lesson-page").evaluateAll(function (pages) { return pages.some(function (node) {
    return node.querySelector('.math-fraction[aria-label*="x(x+2)분의 2x+2"]');
  }); }));
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.clientWidth, document.documentElement.scrollWidth]; }), [390, 390]);
  await page.locator("#edition-select").selectOption("teacher");
  assert.equal(await page.locator(".answer-page").count(), 18);
  assert.ok(await page.locator(".answer-page").evaluateAll(function (pages) { return pages.some(function (node) { return node.querySelector(".math-fraction"); }); }));
  assert.equal(await page.locator(".answer-page").evaluateAll(function (pages) { return pages.some(function (node) { return /\d\s*\/\s*\d/.test(node.innerText); }); }), false);
  const seriesAnswer = page.locator(".answer-page").filter({ hasText: "75" });
  assert.equal(await seriesAnswer.count(), 1);
  assert.ok(await seriesAnswer.locator(".math-fraction").count() > 0);
  assert.ok(await page.locator('.lesson-page .math-fraction[aria-label="x분의 1"]').count() > 0);
  await page.setViewportSize({ width: 320, height: 740 });
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.clientWidth, document.documentElement.scrollWidth]; }), [320, 320]);
  await page.setViewportSize({ width: 1280, height: 900 });
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.clientWidth, document.documentElement.scrollWidth]; }), [1280, 1280]);
  assert.deepEqual(errors, []);
  await page.close();
});

test("the original Geometry workbook prints proof, similarity, circle, coordinate, and modeling lessons", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  await page.goto(`${new URL(url).origin}/boarding-school-math/geometry-workbook.html?edition=student`, { waitUntil: "networkidle" });
  assert.match(await page.locator("#workbook-title").innerText(), /Geometry/);
  assert.match(await page.locator("#workbook-status").innerText(), /5개 단원 · 16차시 · 연습 32문항/);
  assert.equal(await page.locator(".unit-page").count(), 5);
  assert.equal(await page.locator(".lesson-page").count(), 16);
  assert.equal(await page.locator(".practice-page").count(), 16);
  assert.equal(await page.locator(".answer-page").count(), 0);
  assert.ok(await page.locator('.lesson-page[aria-label*="컴퍼스·자 작도"]').count() > 0);
  assert.ok(await page.locator('.lesson-page[aria-label*="삼각비로 거리와 높이"]').count() > 0);
  assert.ok(await page.locator('.math-fraction[aria-label="360분의 90"]').count() > 0);
  const symbolicFractions = await page.evaluate(function () {
    const probe = document.createElement("span");
    window.GFIELDMathText.append(probe, "sin θ=맞은편/빗변; θ/360; −√3/2; 2π/|B|; πt/6; 속력 km/h; m/s; 기울기 단위 달러/km; AMC 10/12; AMC 12/AIME");
    return {
      labels: Array.from(probe.querySelectorAll(".math-fraction"), function (node) { return node.getAttribute("aria-label"); }),
      remainingText: probe.textContent
    };
  });
  assert.deepEqual(symbolicFractions.labels, ["빗변분의 맞은편", "360분의 θ", "2분의 −√3", "|B|분의 2π", "6분의 πt"]);
  assert.match(symbolicFractions.remainingText, /km\/h; m\/s; 기울기 단위 달러\/km; AMC 10\/12; AMC 12\/AIME/);
  const trigLabels = await page.locator('.lesson-page[aria-label*="삼각비로 거리와 높이"]').locator(".math-fraction").evaluateAll(function (nodes) {
    return nodes.map(function (node) { return node.getAttribute("aria-label"); });
  });
  assert.ok(trigLabels.includes("빗변분의 맞은편"));
  assert.ok(trigLabels.includes("빗변분의 이웃변"));
  assert.ok(trigLabels.includes("이웃변분의 맞은편"));
  assert.equal(trigLabels.some(function (label) { return /이에요|입니다|이므로/.test(label); }), false);
  assert.ok(await page.locator(".math-fraction").evaluateAll(function (nodes) { return nodes.every(function (node) {
    return getComputedStyle(node).display === "inline-grid" && getComputedStyle(node.querySelector(".math-fraction-numerator")).borderBottomWidth !== "0px";
  }); }));
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.clientWidth, document.documentElement.scrollWidth]; }), [390, 390]);
  await page.locator("#edition-select").selectOption("teacher");
  assert.equal(await page.locator(".answer-page").count(), 16);
  assert.deepEqual(errors, []);
  await page.setViewportSize({ width: 320, height: 740 });
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.clientWidth, document.documentElement.scrollWidth]; }), [320, 320]);
  await page.setViewportSize({ width: 1280, height: 900 });
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.clientWidth, document.documentElement.scrollWidth]; }), [1280, 1280]);
  await page.close();
});

test("the original Precalculus workbook connects functions, trigonometry, vectors, and models", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  await page.goto(`${new URL(url).origin}/boarding-school-math/precalculus-workbook.html?edition=student`, { waitUntil: "networkidle" });
  assert.match(await page.locator("#workbook-title").innerText(), /Precalculus/);
  assert.match(await page.locator("#workbook-status").innerText(), /5개 단원 · 16차시 · 연습 32문항/);
  assert.equal(await page.locator(".unit-page").count(), 5);
  assert.equal(await page.locator(".lesson-page").count(), 16);
  assert.equal(await page.locator(".practice-page").count(), 16);
  assert.equal(await page.locator(".answer-page").count(), 0);
  assert.ok(await page.locator('.lesson-page[aria-label*="단위원에서 삼각함수 값"]').count() > 0);
  const polarPage = page.locator('.lesson-page[aria-label*="극좌표와 직교좌표 연결"]');
  assert.equal(await polarPage.count(), 1);
  assert.ok(await polarPage.locator(".math-fraction[aria-label='2분의 3π']").count() > 0);
  const polarPracticePage = page.locator('.practice-page[aria-label*="극좌표와 직교좌표 연결"]');
  assert.ok(await polarPracticePage.locator(".math-fraction[aria-label='3분의 π']").count() > 0);
  assert.equal(await polarPracticePage.evaluate(function (node) { return /\d\s*\/\s*\d/.test(node.innerText); }), false, "polar-coordinate fractions should render with a bar, not a slash");
  assert.ok(await page.locator('.math-fraction[aria-label="2분의 x+3"]').count() > 0);
  assert.ok(await page.locator('.math-fraction[aria-label="2분의 −√3"]').count() > 0);
  assert.ok(await page.locator('.math-fraction[aria-label="|B|분의 2π"]').count() > 0);
  assert.ok(await page.locator('.math-fraction[aria-label="6분의 πt"]').count() > 0);
  assert.ok(await page.locator(".math-fraction").evaluateAll(function (nodes) { return nodes.every(function (node) {
    return getComputedStyle(node).display === "inline-grid" && getComputedStyle(node.querySelector(".math-fraction-numerator")).borderBottomWidth !== "0px";
  }); }));
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.clientWidth, document.documentElement.scrollWidth]; }), [390, 390]);
  await page.locator("#edition-select").selectOption("teacher");
  assert.equal(await page.locator(".answer-page").count(), 16);
  assert.deepEqual(errors, []);
  await page.setViewportSize({ width: 320, height: 740 });
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.clientWidth, document.documentElement.scrollWidth]; }), [320, 320]);
  await page.setViewportSize({ width: 1280, height: 900 });
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.clientWidth, document.documentElement.scrollWidth]; }), [1280, 1280]);
  await page.close();
});

test("roadmap shortcut bar stays usable and tracks the selected section on mobile", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  await page.goto(`${url}?grade=7#grade-map`, { waitUntil: "networkidle" });
  const nav = page.getByRole("navigation", { name: "성장 지도 바로가기" });
  assert.deepEqual(await nav.getByRole("link").allInnerTexts(), ["성장 지도", "월별 계획", "학년 비교", "모의고사"]);
  assert.equal(await nav.getByRole("link", { name: "성장 지도" }).getAttribute("aria-current"), "location");
  await nav.getByRole("link", { name: "월별 계획" }).click();
  await page.waitForFunction(function () { return location.hash === "#annual-plan"; });
  assert.equal(await page.locator("#annual-plan").count(), 1);
  await page.waitForFunction(function () { return document.querySelector('[data-roadmap-target="annual-plan"]').getAttribute("aria-current") === "location"; });
  await nav.getByRole("link", { name: "학년 비교" }).click();
  await page.waitForFunction(function () { return location.hash === "#grade-comparison"; });
  await page.waitForFunction(function () {
    return document.querySelector('[data-roadmap-target="grade-comparison"]').getAttribute("aria-current") === "location"
      && document.getElementById("grade-comparison").getBoundingClientRect().top >= 56
      && document.getElementById("grade-comparison").getBoundingClientRect().top < 120;
  });
  const geometry = await page.evaluate(function () { return { targetTop: document.getElementById("grade-comparison").getBoundingClientRect().top, scrollWidth: document.documentElement.scrollWidth, viewport: window.innerWidth }; });
  assert.ok(geometry.targetTop >= 56 && geometry.targetTop < 120, JSON.stringify(geometry));
  assert.equal(geometry.scrollWidth, geometry.viewport);
  assert.deepEqual(errors, []);
  await page.close();
});

test("grade map, level comparison, and GFIELD mock diagnosis stay honest and interactive", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  await page.goto(`${url}?grade=7#grade-map`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#grade-map-title").innerText(), "7학년 수학 한눈에");
  const footerLinkStyle = await page.locator(".site-footer a").first().evaluate(function (node) { return { color: getComputedStyle(node).color, textDecoration: getComputedStyle(node).textDecorationLine }; });
  assert.deepEqual(footerLinkStyle, { color: "rgb(86, 98, 116)", textDecoration: "none" });
  assert.match(await page.locator("#grade-title").innerText(), /유리수/);
  assert.equal(await page.locator(".grade-button").count(), 10);
  assert.equal(await page.locator(".stage-button").count(), 4);
  assert.match(await page.locator(".journey-position-card").innerText(), /지필드 7\.NS\.A 유리수 연산 단원 모의고사/);
  assert.match(await page.locator("#journey-next-preview").innerText(), /경로 지점을 눌러/);
  assert.equal(await page.locator("#journey-next-stop").isHidden(), true);
  await page.locator("#stage-list button").first().click();
  assert.equal(await page.locator("#journey-next-title").innerText(), "비례 관계");
  assert.deepEqual(await page.locator("#journey-next-button").evaluate(function (node) { const style = getComputedStyle(node); return { background: style.backgroundColor, color: style.color, minHeight: style.minHeight }; }), { background: "rgb(96, 65, 143)", color: "rgb(255, 255, 255)", minHeight: "42px" });
  await page.locator("#journey-next-button").click();
  assert.equal(await page.locator("#journey-selected-title").innerText(), "비례 관계");
  assert.equal(await page.locator("#journey-next-title").innerText(), "식·방정식");
  assert.deepEqual(await page.locator("#grade-focus-list strong").allInnerTexts(), ["학교 수학", "경시 · 선택", "SAT · 맛보기"]);
  assert.match(await page.locator(".level-boundary").innerText(), /진단 결과가 없어서/);
  assert.match(await page.locator("#grade-note").innerText(), /7.NS.A·7.RP.A 워크북은 연습용.*개인 진단은 별도 검수 중/);
  assert.equal(await page.locator("#grade-practice-links a").count(), 2);
  assert.match(await page.locator("#grade-practice-links a").first().innerText(), /36문항/);
  assert.match(await page.locator("#grade-practice-links a").first().getAttribute("href"), /cluster=7.NS.A/);
  assert.deepEqual(await page.locator(".route-button[aria-pressed='true']").allInnerTexts(), []);
  assert.equal(await page.locator(".route-explanation").isHidden(), true);
  assert.equal(await page.locator("#route-check-block").isHidden(), true);
  await page.getByRole("button", { name: "다음 내용 배우기" }).click();
  assert.equal(await page.locator(".route-explanation").isVisible(), true);
  assert.equal(await page.getByRole("button", { name: "다음 내용 배우기" }).evaluate(function (node) { return node === document.activeElement; }), true);
  assert.equal(await page.locator("#route-name").innerText(), "다음 내용 배우기");
  assert.equal(await page.locator("#route-check-block").isVisible(), true);
  assert.equal(await page.locator("#competition-diagnostic .map-head h2").innerText(), "지필드 모의고사 · 경시 연습");
  assert.match(await page.locator("#competition-diagnostic .map-head > p").innerText(), /지필드가 직접 만든 모의고사를 풀고.*문항별 결과와 오답 이유/);
  assert.equal(await page.locator(".competition-own-mocks article").count(), 4);
  assert.deepEqual(await page.locator(".competition-own-mocks a").evaluateAll(function (links) { return links.map(function (link) { return link.getAttribute("href"); }); }), [
    "./grade7-ns-a-mock-exam.html", "./grade7-rp-a-mock-exam.html", "./amc8-grade7-mock-exam.html", "./competition-practice.html?program=amc8"
  ]);
  assert.equal(await page.locator("#competition-form").count(), 0);
  assert.equal(await page.locator("#competition-diagnostic input, #competition-diagnostic select, #competition-diagnostic textarea").count(), 0);
  await page.locator(".grade-track > summary").click();
  await page.getByRole("button", { name: "Grade 9 지도 보기" }).click();
  assert.deepEqual(await page.locator(".route-button[aria-pressed='true']").allInnerTexts(), []);
  assert.equal(await page.locator(".route-explanation").isHidden(), true);
  assert.equal(await page.locator("#route-check-block").isHidden(), true);
  assert.deepEqual(errors, []);
  await page.close();
});

test("roadmap mock catalog lists GFIELD-authored assessment routes", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${url}?grade=7#grade-map`, { waitUntil: "networkidle" });
  assert.deepEqual(await page.locator(".competition-own-mocks a").evaluateAll(function (links) { return links.map(function (link) { return link.getAttribute("href"); }); }), [
    "./grade7-ns-a-mock-exam.html", "./grade7-rp-a-mock-exam.html", "./amc8-grade7-mock-exam.html", "./competition-practice.html?program=amc8"
  ]);
  assert.equal(await page.locator("#competition-form").count(), 0);
  assert.equal(await page.locator("#competition-diagnostic input:visible").count(), 0);
  await page.goto(`${url}?grade=9#grade-map`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#competition-own-mocks").isVisible(), false);
  assert.equal(await page.locator("#competition-own-mocks-empty").isVisible(), false);
  assert.equal(await page.locator("#competition-amc10-mock-route").isVisible(), true);
  assert.equal(await page.locator("#competition-amc10-mock-route a").getAttribute("href"), "./amc10-gfield-mock-exam.html?grade=9");
  assert.match(await page.locator("#competition-amc10-mock-route").innerText(), /25문항 · 75분/);
  await page.goto(`${url}?grade=10#grade-map`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#competition-own-mocks").isVisible(), false);
  assert.equal(await page.locator("#competition-amc12-mock-route").isVisible(), true);
  assert.equal(await page.locator("#competition-amc12-mock-route a").getAttribute("href"), "./amc12-gfield-mock-exam.html");
  assert.match(await page.locator("#competition-amc12-mock-route").innerText(), /25문항 · 75분/);
  for (const grade of [6, 8]) {
    await page.goto(`${url}?grade=${grade}#grade-map`, { waitUntil: "networkidle" });
    assert.equal(await page.locator("#competition-amc8-mock-route").isVisible(), true);
    assert.equal(await page.locator("#competition-amc8-mock-route a").getAttribute("href"), `./amc8-grade7-mock-exam.html?grade=${grade}`);
    assert.equal(await page.locator("#competition-own-mocks-empty").isVisible(), false);
  }
  await page.close();
});

test("Grade 11–12 roadmap identifies inferred plans and keeps the assessment mock-only", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  await page.goto(`${url}?grade=11#grade-map`, { waitUntil: "networkidle" });
  assert.match(await page.locator("#source-chip").innerText(), /11학년 · 학교 과목 확인/);
  assert.match(await page.locator("#grade-note").innerText(), /학교별 과목과 선수 조건/);
  assert.match(await page.locator("#annual-plan-title").innerText(), /11학년.*학교의 과목 경로/);
  assert.match(await page.locator("#annual-plan-note").innerText(), /학교별 과목 안내와 선수 조건/);
  assert.equal(await page.locator("#competition-diagnostic input, #competition-diagnostic select, #competition-diagnostic textarea").count(), 0);
  assert.equal(await page.locator(".grade-button").count(), 10);
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [390, 390]);
  await page.getByRole("button", { name: "다음 학년 →" }).click();
  assert.match(await page.locator("#source-chip").innerText(), /12학년 · 학교 과목 확인/);
  assert.match(await page.locator("#annual-plan-title").innerText(), /12학년.*이수 과목/);
  assert.match(await page.locator("#grade-core").innerText(), /졸업·대학 계획/);
  assert.deepEqual(errors, []);
  await page.close();
});

test("roadmap routes families to GFIELD-authored practice by grade", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${url}?grade=7#grade-map`, { waitUntil: "networkidle" });
  assert.match(await page.locator("#journey-practice-title").innerText(), /7\.NS\.A.*유리수 연산.*모의고사/);
  assert.equal(await page.locator("#journey-practice-link").getAttribute("href"), "./grade7-ns-a-mock-exam.html");
  assert.match(await page.locator("#journey-practice-copy").innerText(), /7\.NS\.A 모의고사.*다음 복습/);
  await page.getByLabel("비교할 학년").selectOption("8");
  assert.equal(await page.locator("#comparison-practice-pair").isVisible(), true);
  assert.deepEqual(await page.locator("#comparison-practice-current-links a").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href"))), [
    "./grade7-ns-a-mock-exam.html",
    "./grade7-rp-a-mock-exam.html",
    "./unit-workbook.html?cluster=7.NS.A&mode=workbook&audience=student&locale=ko&paper=A4",
    "./unit-workbook.html?cluster=7.RP.A&mode=workbook&audience=student&locale=ko&paper=A4",
    "./algebra1-workbook.html",
    "./geometry-workbook.html"
  ]);
  assert.ok(await page.locator("#comparison-practice-target-links a").count() > 0);
  assert.equal(await page.locator('#grade-comparison a[href*="assessment-entry.html"]').count(), 0);
  assert.doesNotMatch(await page.locator("#grade-comparison").innerText(), /MAP Growth|학교 Placement Test|성적표 입력/);
  await page.getByLabel("비교할 학년").selectOption("3");
  assert.match(await page.locator("#comparison-practice-target-title").innerText(), /자체 문항 준비 중/);
  assert.deepEqual(errors, []);
  await page.close();
});

test("released unit practice is reachable without exposing the private Grade 7 diagnostic", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${url}?grade=6#grade-map`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#grade-practice-links a").count(), 3);
  assert.equal(await page.locator("#competition-diagnostic input, #competition-diagnostic select, #competition-diagnostic textarea").count(), 0);
  await page.locator("#grade-practice-more summary").click();
  assert.equal(await page.locator("#grade-practice-more-links a").count(), 7);
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [390, 390]);
  await page.locator(".grade-track > summary").click();
  await page.getByRole("button", { name: "Grade 7 지도 보기" }).click();
  assert.equal(await page.locator("#grade-practice-links a").count(), 2);
  assert.equal(await page.locator("#grade-practice-more").isHidden(), true);
  await page.locator("#grade-practice-links a").first().click();
  await page.waitForURL(/unit-workbook\.html\?cluster=7.NS.A/);
  assert.match(await page.locator("body").innerText(), /단원 워크북/);
  assert.match(await page.locator("body").innerText(), /이 책만으로 배치·승급을 결정하지 않습니다/);
  assert.doesNotMatch(page.url(), /diagnostic/);
  await page.close();
});

test("grade comparison shows curriculum examples without implying measured level", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${url}?grade=8#grade-map`, { waitUntil: "networkidle" });
  assert.match(await page.locator("#annual-plan-note").innerText(), /학교 Geometry는 정규 진도에서 이어가고.*선택 심화/);
  assert.match(await page.locator("#annual-plan-periods").innerText(), /다항식·이차식·유리식·지수·로그.*복소수·수열·행렬은.*선택/);
  assert.match(await page.locator("#annual-plan-periods").innerText(), /변환·합동·증명·닮음·삼각비·원·좌표기하/);
  const comparison = page.getByLabel("비교할 학년");
  assert.equal(await page.locator('#grade-comparison a[href*="assessment-entry.html"]').count(), 0);
  assert.equal(await comparison.inputValue(), "");
  await comparison.selectOption("9");
  assert.equal(await page.locator("#comparison-table").isVisible(), true);
  assert.equal(await page.locator("#comparison-current-label").innerText(), "8학년 · 가속 학습 예시 · 학교 학년 기준 아님");
  assert.equal(await page.locator("#comparison-target-label").innerText(), "9학년 · 학습 계획 예시");
  assert.match(await page.locator("#comparison-note").innerText(), /실제 과목과 순서는 학교 안내에서 확인/);
  assert.match(await page.locator("#comparison-bridge-copy").innerText(), /8학년:.*9학년:/);
  assert.match(await page.locator("#comparison-bridge-copy").innerText(), /8학년:.* · 9학년:/);
  assert.equal(await page.locator("#comparison-bridge-copy .math-fraction").count(), 0, "the grade separator must not be interpreted as a mathematical fraction");
  assert.match(await page.locator("#comparison-current-tracks").innerText(), /1–3개월[\s\S]*대수 개념과 문제 해결/);
  assert.match(await page.locator("#comparison-current-tracks").innerText(), /Geometry는 학교 과정에서 이어가요/);
  assert.match(await page.locator("#comparison-current-tracks").innerText(), /AIME형 풀이/);
  assert.match(await page.locator("#comparison-current-tracks").innerText(), /4–6개월[\s\S]*기하 심화와 AMC 10\/12/);
  assert.match(await page.locator("#comparison-target-tracks").innerText(), /10–12개월/);
  assert.match(await page.locator(".comparison-boundary").innerText(), /학생의 현재 위치.*판단하지 않아요/);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true);
  assert.equal(await page.locator("#comparison-practice-pair").isVisible(), true);
  assert.equal(await page.locator(".comparison-pair-columns article").count(), 2);
  assert.equal(await page.locator(".comparison-pair-columns").evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(" ").length), 1);
  assert.equal(await page.locator(".comparison-desktop-view").isVisible(), false);
  assert.equal(await page.locator(".comparison-mobile-view").isVisible(), true);
  const pairedRows = page.locator(".comparison-mobile-row:not(.comparison-mobile-header)");
  assert.ok(await pairedRows.count() >= 8);
  for (const row of await pairedRows.all()) assert.equal(await row.locator(".comparison-mobile-cell").count(), 2, "each mobile comparison row keeps both grade values together");
  assert.match(await page.locator("#comparison-mobile-view").innerText(), /학교 수학[\s\S]*경시 · 선택[\s\S]*SAT · 선택[\s\S]*1–3개월/);
  assert.doesNotMatch(await page.locator("#comparison-mobile-view").innerText(), /학습 주제|기간 1/);
  assert.match(await page.locator(".comparison-mobile-note").innerText(), /학교의 실제 과목과 순서를 확인/);
  await page.emulateMedia({ media: "print" });
  assert.equal(await page.locator("#comparison-table").isVisible(), true);
  assert.equal(await page.locator(".grade-comparison-controls").isVisible(), false);
  await page.emulateMedia({ media: "screen" });
  assert.equal(await page.locator("#competition-diagnostic input, #competition-diagnostic select, #competition-diagnostic textarea").count(), 0);
  await page.close();
});

test("grade comparison keeps mock-result comparison separate from curriculum examples", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${url}?grade=7#grade-map`, { waitUntil: "networkidle" });
  await page.locator("#comparison-grade").selectOption("8");
  assert.equal(await page.locator("#competition-form").count(), 0);
  assert.match(await page.locator("#comparison-practice-pair").innerText(), /지필드가 만든 모의고사 응시 결과/);
  assert.equal(await page.locator("#comparison-practice-current-links a").count() > 0, true);
  await page.close();
});

test("grade comparison does not accept outside contest scores", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${url}?grade=7#grade-map`, { waitUntil: "networkidle" });
  await page.locator("#comparison-grade").selectOption("8");
  assert.equal(await page.locator("#competition-form").count(), 0);
  assert.equal(await page.locator("#competition-diagnostic input, #competition-diagnostic select, #competition-diagnostic textarea").count(), 0);
  assert.match(await page.locator("#comparison-practice-pair").innerText(), /지필드가 만든 모의고사 응시 결과/);
  assert.match(await page.locator("#competition-diagnostic").innerText(), /지필드가 직접 만든 모의고사/);
  await page.close();
});

test("Grade 10 and Grade 12 comparison keeps inferred planning separate from learner assessment", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${url}?grade=10#grade-map`, { waitUntil: "networkidle" });
  assert.match(await page.locator("#grade-focus-list").innerText(), /AMC 12 130\+는 개인 도전 목표[\s\S]*Digital SAT Math 800은 개인 도전 목표/);
  assert.match(await page.locator("#annual-plan-note").innerText(), /AMC 12 130\+와 Digital SAT Math 800은 선택형 도전 목표/);
  assert.match(await page.locator("#annual-plan-periods").innerText(), /주장을 근거로 설명하기[\s\S]*USAMO형 증명 문제.*선택/);
  await page.getByLabel("비교할 학년").selectOption("12");
  assert.equal(await page.locator("#comparison-current-label").innerText(), "10학년 · 가속 학습 예시 · 학교 학년 기준 아님");
  assert.equal(await page.locator("#comparison-target-label").innerText(), "12학년 · 학습 계획 예시");
  assert.match(await page.locator("#comparison-target-title").innerText(), /배운 수학을 선택 과목/);
  assert.match(await page.locator("#comparison-target-tracks").innerText(), /학교 수학[\s\S]*졸업 요건·과목 경로/);
  assert.match(await page.locator("#comparison-note").innerText(), /실제 과목과 순서는 학교 안내에서 확인/);
  assert.match(await page.locator(".comparison-boundary").innerText(), /학생의 현재 위치.*판단하지 않아요/);
  assert.match(await page.locator("#comparison-practice-target-label").innerText(), /12학년 · 자체 문항/);
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [1280, 1280]);
  await page.close();
});

test("Grade 10 annual plan opens the original proof-writing workbook with student and teacher editions", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${url}?grade=10#grade-map`, { waitUntil: "networkidle" });
  const proofLink = page.getByRole("link", { name: "지필드 증명 쓰기 워크북 · 자체 8문항" });
  assert.equal(await proofLink.getAttribute("href"), "./proof-writing-workbook.html");
  const workbookUrl = new URL("proof-writing-workbook.html", url).href;
  await page.goto(workbookUrl, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".proof-item").count(), 8);
  assert.equal(await page.locator(".proof-item textarea:visible").count(), 8);
  assert.match(await page.locator(".proof-item").nth(3).locator(".claim").innerText(), /0이 아닌 정수 d/);
  assert.equal(await page.locator(".teacher-solution:visible").count(), 0);
  assert.equal(await page.locator(".math-fraction").count(), 5, "coordinate midpoints and the rational-number expression use stacked fraction notation");
  assert.doesNotMatch(await page.locator("main").innerText(), /\\frac|\\sqrt|\\\(/);
  await page.getByLabel("자료 보기").selectOption("teacher");
  assert.equal(new URL(page.url()).searchParams.get("edition"), "teacher");
  assert.equal(await page.locator(".teacher-solution:visible").count(), 8);
  assert.match(await page.locator(".proof-item").nth(3).locator(".teacher-solution").innerText(), /0이 아닌 정수 d/);
  assert.equal(await page.locator(".proof-item textarea:visible").count(), 0);
  assert.match(await page.locator(".edition-note").innerText(), /풀이 예시는 가능한 설명의 한 가지 방식/);
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [1280, 1280]);
  await page.close();

  const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await phone.goto(workbookUrl, { waitUntil: "networkidle" });
  assert.deepEqual(await phone.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [390, 390]);
  await phone.close();
});

test("Grade 3 comparison labels the missing contest-plan source instead of implying no contest option exists", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${url}?grade=3#grade-map`, { waitUntil: "networkidle" });
  await page.getByLabel("비교할 학년").selectOption("5");
  assert.equal(await page.locator("#comparison-current-label").innerText(), "3학년 · 학습 계획 예시");
  assert.equal(await page.locator("#comparison-target-label").innerText(), "5학년 · 학습 계획 예시");
  assert.match(await page.locator("#comparison-current-tracks").innerText(), /경시 · 선택[\s\S]*이 학년 계획 자료에는 별도 경시 과정이 제시되지 않았어요/);
  assert.match(await page.locator("#comparison-target-tracks").innerText(), /경시 · 선택[\s\S]*이 학년 계획 자료에는 별도 경시 과정이 제시되지 않았어요/);
  await page.close();

  const phone = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await phone.goto(`${url}?grade=3#grade-map`, { waitUntil: "networkidle" });
  await phone.getByLabel("비교할 학년").selectOption("5");
  assert.match(await phone.locator(".comparison-mobile-header").innerText(), /3학년 · 현재 · 학습 계획 예시[\s\S]*5학년 · 학습 계획 예시/);
  assert.deepEqual(await phone.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [390, 390]);
  await phone.close();
});

test("grade comparison keeps paired columns on desktop", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${url}?grade=7#grade-map`, { waitUntil: "networkidle" });
  await page.getByLabel("비교할 학년").selectOption("8");
  assert.equal(await page.locator(".comparison-desktop-view").isVisible(), true);
  assert.equal(await page.locator(".comparison-mobile-view").isVisible(), false);
  const positions = await page.locator(".comparison-column").evaluateAll((nodes) => nodes.map((node) => ({ x: node.getBoundingClientRect().x, y: node.getBoundingClientRect().y })));
  assert.equal(positions.length, 2);
  assert.ok(positions[1].x > positions[0].x && positions[1].y === positions[0].y);
  await page.close();
});

test("phone grade comparison keeps paired descriptions readable without page overflow", async function () {
  for (const width of [390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 844 }, isMobile: true });
    await page.goto(`${url}?grade=7#grade-map`, { waitUntil: "networkidle" });
    await page.getByLabel("비교할 학년").selectOption("8");
    assert.equal(await page.locator(".comparison-mobile-view").isVisible(), true);
    const sizes = await page.locator(".comparison-mobile-cell p").evaluateAll((nodes) => nodes.map((node) => parseFloat(getComputedStyle(node).fontSize)));
    assert.ok(sizes.length > 0 && sizes.every((size) => size >= 14), `Grade comparison text is at least 14px at ${width}px`);
    const headingSizes = await page.locator(".comparison-mobile-row h3").evaluateAll((nodes) => nodes.map((node) => parseFloat(getComputedStyle(node).fontSize)));
    assert.ok(headingSizes.length > 0 && headingSizes.every((size) => size >= 15), `Grade comparison item headings are at least 15px at ${width}px`);
    assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [width, width]);
    await page.close();
  }
});

test("competition diagnosis uses GFIELD mocks without manual score entry", async function () {
  for (const width of [390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 844 }, isMobile: true });
    await page.goto(`${url}?grade=7#grade-map`, { waitUntil: "networkidle" });
    assert.equal(await page.locator("#competition-diagnostic input, #competition-diagnostic select, #competition-diagnostic textarea").count(), 0);
    assert.ok(await page.locator(".competition-own-mocks a").count() >= 3);
    assert.match(await page.locator("#comparison-practice-pair").innerText(), /지필드가 만든 모의고사 응시 결과/);
    assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [width, width]);
    await page.close();
  }
});

test("Grade 7 path previews checkpoints without claiming a measured position", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${url}?grade=7#grade-map`, { waitUntil: "networkidle" });
  assert.match(await page.locator("#annual-plan-note").innerText(), /Algebra 1은 가속 학습 예시.*학교 Geometry는 정규 진도/);
  assert.match(await page.locator("#annual-plan-periods").innerText(), /문자를 사용한 식·일차방정식·부등식.*등식의 성질/);
  assert.match(await page.locator("#annual-plan-periods").innerText(), /대수·기하.*심화 문장제와 자료 해석.*Digital SAT Math/);
  assert.equal(await page.locator(".boarding-intro").isHidden(), true);
  assert.equal(await page.locator(".grade-track").evaluate(function (node) { return node.open; }), false);
  assert.ok(await page.locator(".grade7-path").evaluate(function (node) { return node.getBoundingClientRect().top < window.innerHeight; }), "Grade 7 path should start in the first phone screen");
  assert.equal(await page.locator("#grade7-road-intro").isVisible(), true);
  assert.match(await page.locator("#boarding-learning-plan-link").getAttribute("href"), /learning-plan\.html\?goal=school-g7-nsa/);
  assert.match(await page.locator("#boarding-learning-plan-link-bottom").getAttribute("href"), /learning-plan\.html\?goal=school-g7-nsa/);
  assert.match(await page.locator(".journey-position-card").innerText(), /지필드 7\.NS\.A 유리수 연산 단원 모의고사/);
  assert.match(await page.locator("#grade7-position").innerText(), /지점을 고르면/);
  assert.doesNotMatch(await page.locator("#grade7-position").innerText(), /현재 위치 미확인/);
  assert.doesNotMatch(await page.locator("#grade7-position").innerText(), /진단 후/);
  assert.equal(await page.locator(".stage-detail").isHidden(), true);
  assert.deepEqual(await page.locator(".grade7-path .stage-button strong").allInnerTexts(), ["유리수", "비례 관계", "식·방정식", "기하·혼합 문제"]);
  assert.deepEqual(await page.locator(".grade7-path .stage-button[aria-pressed='true']").allInnerTexts(), []);
  await page.getByRole("button", { name: /살펴볼 지점 2, 비례 관계/ }).click();
  assert.equal(await page.getByText("살펴보는 중", { exact: true }).count(), 1, "the selected-state label is real DOM text");
  assert.ok(await page.locator(".stage-detail").evaluate(function (node) { const bounds = node.getBoundingClientRect(); return bounds.top >= 0 && bounds.bottom <= window.innerHeight; }), "selected stop and its detail should be visible on a phone");
  assert.equal(await page.getByRole("button", { name: /살펴볼 지점 2, 비례 관계/ }).evaluate(function (node) { return node === document.activeElement; }), true);
  assert.match(await page.locator("#stage-number").innerText(), /살펴보는 구간\s+2/);
  assert.match(await page.locator("#grade7-stage-questions").innerText(), /비례/);
  assert.match(await page.locator("#grade7-stage-resource").getAttribute("href"), /cluster=7.RP.A/);
  assert.doesNotMatch(await page.locator("#grade7-position").innerText(), /비례 관계/);
  await page.locator("#grade7-branches summary").click();
  assert.match(await page.locator("#grade7-branches details p").innerText(), /정식 SAT 진단/);
  assert.equal(await page.locator("#grade7-contest-branch").getAttribute("href"), "./competition-practice.html?program=amc8");
  assert.match(await page.locator("#grade7-contest-title").innerText(), /6학년 기초 연결/);
  await page.goto(`${url}?grade=7&program=kangaroo#grade7-branches`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#grade7-contest-branch").getAttribute("href"), "https://mathkangaroo.org/mks/practice/grades-7-8/", "a direct Math Kangaroo visit opens its matching official paper band");
  assert.match(await page.locator("#grade7-contest-title").innerText(), /Math Kangaroo · 공식 기출 시험지/);
  assert.equal(await page.locator("#competition-diagnostic input, #competition-diagnostic select, #competition-diagnostic textarea").count(), 0);
  assert.ok(await page.locator(".competition-own-mocks a").count() >= 3, "the diagnostic remains in GFIELD-authored mock routes");
  await page.locator(".grade-track > summary").focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.locator(".grade-track").evaluate(function (node) { return node.open; }), true);
  await page.getByRole("button", { name: "Grade 8 지도 보기" }).click();
  assert.equal(await page.locator("#grade7-road-intro").isHidden(), true);
  await page.goBack();
  assert.equal(await page.locator("#grade7-road-intro").isVisible(), true);
  assert.equal(await page.locator(".stage-detail").isHidden(), true);
  assert.match(await page.locator(".journey-position-card").innerText(), /지필드 7\.NS\.A 유리수 연산 단원 모의고사/);
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [390, 390]);
  await page.close();
});

test("Grade 6 and 7 annual plans expose stage-matched online resource links", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  for (const grade of [6, 7]) {
    await page.goto(`${url}?grade=${grade}#annual-plan`, { waitUntil: "networkidle" });
    const cards = page.locator("#annual-plan-periods > li");
    assert.equal(await cards.count(), 4);
    for (let index = 0; index < 4; index += 1) {
      const links = cards.nth(index).locator(".annual-plan-resource-links a");
      assert.ok(await links.count() >= 1, `Grade ${grade}, period ${index + 1} has links`);
      assert.match(await cards.nth(index).locator("small").innerText(), /자료 예시[\s\S]*온라인 자료/);
      if (grade === 6) assert.match(await cards.nth(index).locator("small").innerText(), /지필드/);
      const security = await links.first().evaluate((link) => [link.target, link.rel, link.href]);
      if (security[2].startsWith("https://")) {
        assert.equal(security[0], "_blank");
        assert.match(security[1], /noopener/);
      } else {
        assert.equal(security[0], "");
        assert.match(security[2], /^http:\/\//);
      }
    }
  }
  await page.goto(`${url}?grade=6#annual-plan`, { waitUntil: "networkidle" });
  const grade6Resources = page.locator("#annual-plan-periods > li .annual-plan-resource-links a");
  assert.deepEqual(await grade6Resources.evaluateAll(function (links) { return links.map(function (link) { return link.getAttribute("href"); }); }), [
    "./concept-learning.html", "./concept-learning.html?cluster=6.EE.A", "./unit-workbook.html?cluster=6.EE.A&mode=workbook&audience=student&locale=ko&paper=A4",
    "./competition-practice.html?program=amc8", "https://maa.org/student-programs/amc/",
    "./sat-foundation-practice.html?grade=6", "./concept-learning.html?cluster=6.RP.A", "https://satsuite.collegeboard.org/practice/student-question-bank/math",
    "./concept-learning.html", "./competition-practice.html?program=amc8"
  ]);
  await grade6Resources.nth(1).click();
  await page.waitForURL(/concept-learning\.html\?cluster=6\.EE\.A/);
  assert.match(await page.locator("#lesson").innerText(), /연산 순서와 분배법칙/);
  await page.goto(`${url}?grade=6#annual-plan`, { waitUntil: "networkidle" });
  await page.locator('#annual-plan-periods > li a[href*="unit-workbook.html"]').click();
  await page.waitForURL(/unit-workbook\.html\?cluster=6\.EE\.A/);
  assert.match(await page.locator("#book-content").innerText(), /6\.EE\.A/);
  await page.goto(`${url}?grade=6#annual-plan`, { waitUntil: "networkidle" });
  await page.locator("#annual-plan-periods > li").nth(1).locator('a[href*="competition-practice.html"]').click();
  await page.waitForURL(/competition-practice\.html\?program=amc8/);
  assert.equal(await page.locator("#program-title").innerText(), "AMC 8 Bridge");
  await page.goto(`${url}?grade=9#annual-plan`, { waitUntil: "networkidle" });
  assert.match(await page.locator("#annual-plan-note").innerText(), /학교마다 달라요[\s\S]*실제 수강 과목과 선수 개념/);
  assert.deepEqual(await page.locator("#annual-plan-periods > li .annual-plan-resource-links a").evaluateAll(function (links) { return links.map(function (link) { return link.getAttribute("href"); }); }), [
    "./algebra2-workbook.html",
    "./geometry-workbook.html", "./algebra2-workbook.html",
    "./amc10-practice.html?grade=9", "./amc12-practice.html?grade=9", "./sat-foundation-practice.html?grade=9", "https://satsuite.collegeboard.org/practice/student-question-bank/math",
    "./precalculus-workbook.html"
  ]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${url}?grade=7#annual-plan`, { waitUntil: "networkidle" });
  assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [390, 390]);
  await page.close();
});

test("elementary plans turn the supplied book guidance into clearly labeled pacing examples", async function () {
  for (const grade of [3, 4, 5]) {
    for (const width of [390, 1280]) {
      const page = await browser.newPage({ viewport: { width, height: 844 } });
      await page.goto(`${url}?grade=${grade}#annual-plan`, { waitUntil: "networkidle" });
      assert.match(await page.locator("#annual-plan-title").innerText(), new RegExp(`${grade}학년 ·`));
      assert.equal(await page.locator("#annual-plan-periods > li").count(), 4);
      assert.ok(await page.locator("#annual-plan-periods").evaluate(function (node) { return node.classList.contains("is-inferred"); }));
      assert.match(await page.locator("#annual-plan-note").innerText(), /제공된 초등 로드맵.*계획 예시/);
      assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [width, width]);
      await page.close();
    }
  }
});

test("each Grade 7 NS.A standard link opens a populated filtered workbook with accessible controls",async function(){
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true});await page.goto(`${url}?grade=7#grade-map`,{waitUntil:"networkidle"});await page.getByRole("button",{name:/살펴볼 지점 1, 유리수/}).click();
  const standards=await page.locator("#grade7-stage-questions .grade7-standard-code").evaluateAll(function(nodes){return nodes.map(function(node){return{standard:node.textContent,href:node.href,height:Math.round(node.getBoundingClientRect().height),minHeight:parseFloat(getComputedStyle(node).minHeight)};});});assert.deepEqual(standards.map(function(entry){return entry.standard;}),["7.NS.A.1","7.NS.A.2","7.NS.A.2d","7.NS.A.3"]);assert.ok(standards.every(function(entry){return entry.height>=44&&entry.minHeight>=44;}));for(let index=0;index<20&&!(await page.locator("#grade7-stage-questions .grade7-standard-code:focus-visible").count());index+=1)await page.keyboard.press("Tab");assert.ok(await page.locator("#grade7-stage-questions .grade7-standard-code:focus-visible").count(),"keyboard can focus a standard link");
  const route=await browser.newPage({viewport:{width:1280,height:900}});for(const entry of standards){await route.goto(entry.href,{waitUntil:"networkidle"});assert.equal(new URL(route.url()).searchParams.get("standard"),entry.standard);assert.ok(await route.locator(".book-problem").count()>0,entry.standard+" must open matching practice items");}await route.close();await page.close();
});

test("Grade 7 NS.A roadmap breaks the strand into four observable checks with references", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${url}?grade=7#grade-map`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /살펴볼 지점 1, 유리수/ }).click();
  assert.deepEqual(await page.locator("#grade7-stage-questions .grade7-check-prompt").allInnerTexts(), [
    "덧셈·뺄셈: 수직선에서 이동과 거리를 나타내고, 빼기를 반대수 더하기로 설명할 수 있나요?",
    "곱셈·나눗셈: 부호와 계산법칙을 적용하고, 0이 아닌 수로 나누는 이유를 설명할 수 있나요?",
    "분수와 소수: 분수를 소수로 나타내고, 소수가 끝나는지 반복되는지 판별할 수 있나요?",
    "문장제: 상황에 맞게 유리수의 사칙연산을 골라 식을 세우고 답의 의미를 설명할 수 있나요?"
  ]);
  assert.deepEqual(await page.locator("#grade7-stage-questions .grade7-standard-code").allInnerTexts(), ["7.NS.A.1", "7.NS.A.2", "7.NS.A.2d", "7.NS.A.3"]);
  assert.equal(await page.locator("#grade7-stage-references a").count(), 1, "the standards source stays separate from the GFIELD-authored lesson material");
  assert.ok(await page.locator("#grade7-stage-references a").evaluateAll(function (nodes) { return nodes.every(function (node) { return node.getAttribute("aria-label").includes("새 창에서 열림") && parseFloat(getComputedStyle(node).minHeight) >= 44; }); }));
  assert.equal(await page.locator("#grade7-stage-references a").nth(0).getAttribute("href"), "https://www.thecorestandards.org/Math/Content/7/NS/");
  assert.match(await page.locator("#grade7-stage-resource").getAttribute("href"), /cluster=7.NS.A.*paper=A4/);
  assert.match(await page.locator("#grade7-stage-resource").innerText(), /36문항/);
  assert.equal(await page.locator("#grade7-stage-references a[href*='flippedmath.com']").count(), 0);
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [390, 390]);
  await page.getByRole("link", { name: "7.NS.A.1 워크북에서 연습" }).click();
  await page.waitForURL(/unit-workbook\.html\?cluster=7\.NS\.A.*standard=7\.NS\.A\.1/);
  assert.equal(await page.locator("#standard-filter").inputValue(), "7.NS.A.1");
  assert.equal(await page.locator(".book-problem").count(), 18);
  assert.equal(await page.locator("[data-mode='workbook']").innerText(), "기준별 연습 18");
  assert.equal(await page.locator("[data-mode='recheck']").innerText(), "기준별 재확인 4");
  const standardItems = require("../learning/grade7-ns-a-unit-workbook.js").pack.workbookItems.filter(function (item) { return item.standardIds.some(function (standard) { return standard === "7.NS.A.1" || /^7\.NS\.A\.1[a-z]$/.test(standard); }); });
  for (const item of standardItems) await page.locator(`[data-item-id="${item.id}"] [data-answer-id="${require("../learning/grade7-ns-a-unit-workbook.js").solveItem(item)}"]`).click();
  assert.equal(await page.locator("#progress-chip").innerText(), "18 / 18");
  assert.equal(await page.locator("[data-mode='recheck']").isDisabled(), true, "mastering a filtered standard must not unlock the full-unit recheck");
  await page.locator("#standard-filter").selectOption("");
  assert.equal(await page.locator(".book-problem").count(), 36);
  assert.equal(await page.locator("#progress-chip").innerText(), "18 / 36");
  assert.doesNotMatch(page.url(), /standard=/);
  await page.close();
});

test("roadmap checkpoints open their matching course references", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await page.goto(`${url}?grade=7#grade-map`, { waitUntil: "networkidle" });
  const cases = [
    { stage: 3, name: /살펴볼 지점 3, 식·방정식/, titles: ["지필드 Algebra 1 원본 수업·A4 교재"], urls: ["./algebra1-workbook.html"] },
    { stage: 4, name: /살펴볼 지점 4, 기하·혼합 문제/, titles: ["지필드 Geometry 원본 수업·A4 교재"], urls: ["./geometry-workbook.html"] }
  ];
  for (const item of cases) {
    await page.getByRole("button", { name: item.name }).click();
    const disclosure = page.locator("#stage-external-resources");
    assert.equal(await disclosure.isVisible(), true);
    assert.deepEqual(await disclosure.locator("summary").innerText(), "단계별 참고 자료");
    assert.ok((await disclosure.locator("summary").boundingBox()).height >= 44);
    assert.equal(await disclosure.evaluate(function (node) { return node.open; }), false);
    await disclosure.locator("summary").click();
    assert.equal(await disclosure.evaluate(function (node) { return node.open; }), true);
    assert.deepEqual(await disclosure.locator("ul a").allInnerTexts(), item.titles);
    const links = await disclosure.locator("ul a").evaluateAll(function (nodes) { return nodes.map(function (node) { return { href: node.getAttribute("href"), target: node.target, rel: node.rel }; }); });
    assert.deepEqual(links.map(function (link) { return link.href; }), item.urls);
    assert.ok(links.every(function (link) { return link.href.startsWith("./") && link.target === "" && link.rel === ""; }));
    const labels = await disclosure.locator("ul a").evaluateAll(function (nodes) { return nodes.map(function (node) { return node.getAttribute("aria-label"); }); });
    assert.deepEqual(labels, item.titles.map(function () { return null; }));
    assert.ok(await disclosure.locator("ul a").evaluateAll(function (nodes) { return nodes.every(function (node) { return parseFloat(getComputedStyle(node).minHeight) >= 44; }); }));
    if (item.name.toString().includes("식·방정식")) assert.match(await page.locator("#stage-copy").innerText(), /방정식·부등식/);
    if (item.name.toString().includes("기하·혼합")) assert.match(await page.locator("#stage-copy").innerText(), /닮음·각·삼각형·원·넓이·부피/);
    assert.equal(await page.locator("#grade7-no-resource").isVisible(), false);
    assert.equal(await disclosure.locator("ul").isVisible(), true);
    assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [390, 390]);
  }
  const upperGradeCases = [
    { grade: 8, button: /단계 1, 일차식·기하 점검 보기/, title: "지필드 Geometry 원본 수업·A4 교재", url: "./geometry-workbook.html" },
    { grade: 8, button: /단계 3, 준비되면 심화 보기/, titles: ["지필드 Algebra 2 원본 수업·A4 교재", "지필드 AIME형 풀이 연습 · 자체 12문항", "MAA 2027 AIME 자격·응시 안내 ↗"], urls: ["./algebra2-workbook.html", "./aime-practice.html?grade=8", "https://maa.org/news/maa-announces-official-testing-centers-for-the-2027-american-invitational-mathematics-examination/"], note: true },
    { grade: 8, button: /단계 2, 그래프·식 연결 보기/, titles: ["지필드 AMC 10 개념 연결 연습", "지필드 AMC 12 주제 연습 · 자체 15문항 · 선택 심화", "MAA AMC 공식 범위·형식 ↗"], urls: ["./amc10-practice.html?grade=8", "./amc12-practice.html?grade=8", "https://maa.org/student-programs/amc/"] },
    { grade: 9, button: /단계 1, 빈 곳 메우기 보기/, title: "지필드 Algebra 2 원본 수업·A4 교재", url: "./algebra2-workbook.html", inferred: true },
    { grade: 9, button: /단계 2, 서로 연결하기 보기/, titles: ["지필드 Geometry 원본 수업·A4 교재", "지필드 Algebra 2 개념 복습 · 필요한 단원 선택"], urls: ["./geometry-workbook.html", "./algebra2-workbook.html"], inferred: true },
    { grade: 10, button: /단계 1, 개념 설명 보기/, titles: ["지필드 Precalculus 원본 수업·A4 교재", "지필드 AMC 12 주제 연습 · 자체 15문항 · 선택 심화"], urls: ["./precalculus-workbook.html", "./amc12-practice.html?grade=10"] },
    { grade: 10, button: /단계 2, 개념 섞어 풀기 보기/, titles: ["지필드 AIME형 풀이 연습 · 자체 12문항", "MAA 2027 AIME 자격·응시 안내 ↗", "MAA AIME·USAJMO·USAMO 안내 ↗"], urls: ["./aime-practice.html?grade=10", "https://maa.org/news/maa-announces-official-testing-centers-for-the-2027-american-invitational-mathematics-examination/", "https://maa.org/maa-invitational-competitions/"] },
    { grade: 10, button: /단계 3, 필요한 실전 연습 보기/, titles: ["지필드 SAT Math 네 영역 기초 복습 · 자체 20문항", "지필드 Precalculus 원본 수업·A4 교재", "Khan Academy Digital SAT Math ↗", "College Board Bluebook 실전 연습 ↗", "College Board SAT 수학 문제은행 ↗", "MAA 2027 AIME 자격·응시 안내 ↗", "MAA AIME·USAJMO·USAMO 안내 ↗"], urls: ["./sat-foundation-practice.html?grade=10", "./precalculus-workbook.html", "https://www.khanacademy.org/digital-sat", "https://satsuite.collegeboard.org/practice/practice-tests/bluebook", "https://satsuite.collegeboard.org/practice/student-question-bank/math", "https://maa.org/news/maa-announces-official-testing-centers-for-the-2027-american-invitational-mathematics-examination/", "https://maa.org/maa-invitational-competitions/"], note: true }
  ];
  for (const item of upperGradeCases) {
    await page.goto(`${url}?grade=${item.grade}#grade-map`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: item.button }).click();
    if (item.grade === 8 && item.button.toString().includes("심화")) {
      assert.match(await page.locator("#stage-copy").innerText(), /AMC 10\/12/);
      assert.equal(await page.locator("#stage-copy .math-fraction").count(), 0, "AMC 10/12 is a contest name, not a fraction");
    }
    if (item.inferred) assert.match(await page.locator("#source-chip").innerText(), /학교 과목 확인/);
    const disclosure = page.locator("#stage-external-resources");
    assert.equal(await disclosure.isVisible(), true, `Grade ${item.grade} stage reference is visible`);
    await disclosure.locator("summary").click();
    assert.deepEqual(await disclosure.locator("ul a").allInnerTexts(), item.titles || [item.title]);
    assert.deepEqual(await disclosure.locator("ul a").evaluateAll(function (nodes) { return nodes.map(function (node) { return node.getAttribute("href"); }); }), item.urls || [item.url]);
    assert.ok(await disclosure.locator("ul a").evaluateAll(function (nodes) { return nodes.every(function (node) {
      const external = /^https?:/.test(node.getAttribute("href"));
      return external
        ? node.target === "_blank" && node.rel.includes("noopener") && /새 창에서 열림/.test(node.getAttribute("aria-label"))
        : node.target === "" && node.getAttribute("aria-label") === null;
    }); }));
    if (item.inferred) assert.match(await disclosure.locator("#stage-external-resource-note").innerText(), /학교마다 수강 과목과 순서/);
    if (item.note) assert.match(await disclosure.locator("#stage-external-resource-note").innerText(), /미국·캐나다의 2027 AIME.*만 13세 이상.*AMC 10 100점.*AMC 12 85점.*다른 연도·지역/);
    if (item.grade === 10 && !item.note) assert.equal(await page.locator("#stage-external-resource-note").isVisible(), false);
    assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [390, 390]);
  }
  await page.close();
});

test("Grade 7 roadmap labels saved workbook practice as local activity, never a diagnosis",async function(){
  const page=await browser.newPage({viewport:{width:390,height:844}});
  await page.addInitScript(function(){localStorage.setItem("gfield-unit-workbook-progress:7.NS.A:v1",JSON.stringify({schemaVersion:1,packId:"gfield-grade7-ns-a-unit-workbook-v1",correctItemIds:["g7nsa-w01"],correctByStandard:{"7.NS.A.1":1,"7.NS.A.2":0,"7.NS.A.2d":0,"7.NS.A.3":0},totalByStandard:{"7.NS.A.1":18,"7.NS.A.2":14,"7.NS.A.2d":4,"7.NS.A.3":4}}));});
  await page.goto(`${url}?grade=7#grade-map`,{waitUntil:"networkidle"});await page.getByRole("button",{name:/살펴볼 지점 1, 유리수/}).click();
  assert.equal(await page.locator("#grade7-stage-questions .grade7-practice-progress").count(),4);assert.match(await page.locator("#grade7-stage-questions .grade7-practice-progress").nth(0).innerText(),/이 기기 연습 · 맞힌 기록 1\/18 · 진단 아님/);assert.match(await page.locator("#grade7-stage-questions .grade7-practice-progress").nth(1).innerText(),/0\/14/);
  await page.getByRole("button",{name:/살펴볼 지점 2, 비례/}).click();assert.equal(await page.locator("#grade7-stage-questions .grade7-practice-progress").count(),0);await page.close();
});

test("map has no horizontal overflow at 390px and supports keyboard selection", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await page.goto(url + "#grade-map", { waitUntil: "networkidle" });
  assert.equal(await page.locator(".boarding-intro").isVisible(), true);
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [390, 390]);
  const gradeButton = page.getByRole("button", { name: "Grade 8 지도 보기" });
  await gradeButton.focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.locator("#grade-label").innerText(), "8학년");
  assert.equal(await gradeButton.evaluate(function (node) { return node === document.activeElement; }), true);
  await page.getByRole("button", { name: /단계 3/ }).click();
  assert.match(await page.locator("#stage-number").innerText(), /단계\s+3/);
  assert.equal(await page.getByRole("button", { name: /단계 3/ }).evaluate(function (node) { return node === document.activeElement; }), true);
  await page.close();
});

test("map reflows at small phone, tablet, and landscape widths", async function () {
  for (const size of [{ width: 375, height: 812 }, { width: 768, height: 1024 }, { width: 844, height: 390 }]) {
    const page = await browser.newPage({ viewport: size });
    await page.goto(url + "#grade-map", { waitUntil: "networkidle" });
    const dimensions = await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; });
    assert.deepEqual(dimensions, [size.width, size.width], `overflow at ${size.width}`);
    await page.close();
  }
});

test("Grade 7 deep link keeps the concept path reachable at 320px", async function () {
  const page = await browser.newPage({ viewport: { width: 320, height: 844 } });
  await page.goto(`${url}?grade=7#grade-map`, { waitUntil: "networkidle" });
  assert.ok(await page.locator(".grade7-path").evaluate(function (node) { return node.getBoundingClientRect().top < window.innerHeight; }));
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [320, 320]);
  assert.equal(await page.getByRole("link", { name: "교과", exact: true }).isVisible(), true);
  await page.getByRole("button", { name: /살펴볼 지점 1, 유리수/ }).click();
  assert.ok(await page.locator(".stage-detail").evaluate(function (node) { const bounds = node.getBoundingClientRect(); return bounds.top >= 0 && bounds.bottom <= document.documentElement.scrollHeight; }));
  assert.equal(await page.locator("#grade7-stage-questions li").count(), 4);
  const stagePromptFractions = await page.evaluate(function () {
    const target = document.createElement("span");
    window.GFIELDMathText.append(target, "분수 3/4와 2/3을 비교해요.");
    return {
      count: target.querySelectorAll(".math-fraction").length,
      labels: Array.from(target.querySelectorAll(".math-fraction"), function (node) { return node.getAttribute("aria-label"); }),
      slashText: /\d\s*\/\s*\d/.test(target.textContent)
    };
  });
  assert.deepEqual(stagePromptFractions, { count: 2, labels: ["4분의 3", "3분의 2"], slashText: false }, "the shared renderer should show a fraction bar and expose the fraction through its accessible label");
  await page.close();
});

test("cross-grade concept flows render as examples on phone, tablet, and desktop widths", async function () {
  for (const width of [320, 390, 900, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 844 } });
    await page.goto(`${url}?grade=9#grade-map`, { waitUntil: "networkidle" });
    assert.equal(await page.locator("#stage-number").innerText(), "단계 1 / 4");
    assert.equal(await page.locator("#stage-number .math-fraction").count(), 0, "stage progress is a count, not a mathematical fraction");
    assert.equal(await page.locator(".concept-flow").count(), 5);
    assert.equal(await page.locator(".concept-flow ol").count(), 5);
    assert.equal(await page.locator(".concept-flow ol li").count(), 26);
    const prealgebraFlow = page.locator('.concept-flow:has(h3:text("문자와 식의 계산 · 선택 학습"))');
    assert.equal(await page.locator(".concept-flow").first().getAttribute("aria-labelledby"), "prealgebra-algebra1-heading");
    assert.deepEqual(await page.locator(".concept-flow").nth(1).locator("li").allInnerTexts(), ["곱셈 구조", "분배법칙", "다항식 전개", "식 정리", "AMC 10 식 변형"]);
    assert.deepEqual(await prealgebraFlow.locator("li").allInnerTexts(), ["문자를 사용한 식과 식의 값", "거듭제곱과 혼합계산", "문장을 식으로 나타내기", "교환법칙·결합법칙·분배법칙", "분배법칙을 이용한 식의 전개", "동류항의 정리"]);
    assert.equal(await prealgebraFlow.locator("ol").evaluate(function (node) { return getComputedStyle(node).gridTemplateColumns.split(" ").length; }), width <= 600 ? 1 : 6);
    const bridgeNote = prealgebraFlow.locator(".concept-flow-note");
    assert.equal(await bridgeNote.innerText(), "공유된 Prealgebra Unit 1의 개념 흐름을 참고한 예시예요. 학년 배치나 진단 결과가 아니에요.");
    assert.equal(await prealgebraFlow.getAttribute("aria-describedby"), await bridgeNote.getAttribute("id"));
    assert.equal(await prealgebraFlow.evaluate(function (node) { return getComputedStyle(node).gridColumn; }), "1 / -1");
    assert.equal(await bridgeNote.isVisible(), true);
    const noteBox = await bridgeNote.boundingBox();
    assert.ok(noteBox.width > 0);
    assert.ok(noteBox.x >= 0, `concept disclaimer stays inside the left viewport edge at ${width}px`);
    assert.ok(noteBox.x + noteBox.width <= width, `concept disclaimer stays in viewport at ${width}px`);
    assert.ok(await prealgebraFlow.evaluate((node) => node.scrollWidth <= node.clientWidth), `optional flow has no inner overflow at ${width}px`);
    assert.match(await page.locator("#concept-flow-title").innerText(), /배운 개념은 이렇게 이어져요/);
    assert.match(await page.locator(".concept-flow-intro").innerText(), /문제 풀이법을 먼저 외우기보다/);
    const studySequence = page.locator(".competition-study-sequence");
    assert.equal(await page.locator("#competition-paper-review-route").getAttribute("href"), "./competition-paper-review.html?grade=9&program=amc10");
    assert.match(await page.locator("#competition-paper-review-route").innerText(), /원본 답안 입력 · 결과 확인/);
    assert.match(await studySequence.locator("h3").innerText(), /공식 기출로 수준을 확인하고, 지필드 모의고사로 보완/);
    assert.deepEqual(await studySequence.locator(".competition-original-papers a").evaluateAll(function (links) { return links.map(function (link) { return link.getAttribute("href"); }); }), [
      "./competition-paper-review.html?grade=9&program=amc10",
      "https://maa.org/student-programs/amc/",
      "https://maa.org/maa-invitational-competitions/",
      "https://mathkangaroo.org/mks/practice/grades-9-10/"
    ]);
    assert.equal(await studySequence.locator("li").count(), 4);
    assert.deepEqual(await studySequence.locator("h4").allInnerTexts(), ["목표 대회 원본을 풀어요", "공식 해설로 풀이를 분석해요", "지필드 모의고사로 약점을 찾아요", "개념을 보완하고 새 문제로 확인해요"]);
    assert.ok(await studySequence.evaluate(function (node) { return node.innerText.indexOf("목표 대회 원본을 풀어요") >= 0 && node.innerText.indexOf("목표 대회 원본을 풀어요") < node.innerText.indexOf("지필드 모의고사로 약점을 찾아요"); }), "official source practice comes before the GFIELD mock diagnostic");
    assert.match(await studySequence.innerText(), /같은 연도·시험형 자료/);
    assert.match(await studySequence.innerText(), /풀이가 어디서 길어졌는지/);
    assert.equal(await studySequence.evaluate(function (node) { return node.scrollWidth <= node.clientWidth; }), true, `contest study sequence has no inner overflow at ${width}px`);
    if (width <= 390) assert.ok(await studySequence.locator("li p").first().evaluate(function (node) { return parseFloat(getComputedStyle(node).fontSize) >= 16; }));
    assert.equal(await page.locator(".concept-flow-section .map-head").evaluate((node) => {
      const title = node.querySelector("h2").getBoundingClientRect();
      const note = node.querySelector(":scope > p").getBoundingClientRect();
      return title.bottom <= note.top || note.bottom <= title.top || title.right <= note.left || note.right <= title.left;
    }), true, `concept heading and note overlap at ${width}px`);
    assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [width, width]);
    await page.close();
  }
});

test("the branded learning-world map frames every grade and phones keep the vertical path", async function () {
  const desktop = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  for (const grade of [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
    await desktop.goto(`${url}?grade=${grade}#grade-map`, { waitUntil: "networkidle" });
    assert.equal(await desktop.locator("#stage-list button").count(), 4, `Grade ${grade} has four named route stops`);
    assert.ok(await desktop.locator("#stage-list button strong").allTextContents().then((labels) => labels.every((label) => label.trim())), `Grade ${grade} route labels are HTML text`);
    assert.match(await desktop.locator(".stage-map-scene").evaluate((node) => getComputedStyle(node).backgroundImage), /mathematics-learning-world-gmap-v2\.webp/, `Grade ${grade} uses the shared branded map scene`);
    assert.equal(await desktop.locator("#stage-map-markers button").count(), 4, `Grade ${grade} exposes four matching map markers`);
    const sceneBottom = await desktop.locator(".stage-map-scene").evaluate((node) => node.getBoundingClientRect().bottom);
    const cardsTop = await desktop.locator("#stage-list").evaluate((node) => node.getBoundingClientRect().top);
    assert.ok(cardsTop >= sceneBottom, `Grade ${grade} route cards sit below the artwork`);
    if (grade !== 7) {
      const mapTop = await desktop.locator(".stage-map").evaluate((node) => node.getBoundingClientRect().top);
      const focusTop = await desktop.locator(".grade-focus").evaluate((node) => node.getBoundingClientRect().top);
      assert.ok(mapTop < focusTop, `Grade ${grade} shows the route map before the curriculum detail cards`);
    }
    if (grade === 7) {
      const intro = desktop.locator("#grade7-road-intro");
      const mapBox = await desktop.locator(".stage-map-scene").boundingBox();
      const introBox = await intro.boundingBox();
      assert.equal(await intro.isVisible(), true);
      assert.ok(introBox.y >= mapBox.y && introBox.y + introBox.height <= mapBox.y + mapBox.height, "Grade 7 prompt sits inside the map scene");
      assert.ok(Math.abs(introBox.x - mapBox.x) < 40, "Grade 7 prompt aligns to the map's left edge");
      const stopBoxes = await desktop.locator("#stage-map-markers .stage-map-marker").evaluateAll((nodes) => nodes.map((node) => {
        const box = node.getBoundingClientRect();
        return { x: box.x, y: box.y, right: box.right, bottom: box.bottom };
      }));
      assert.ok(stopBoxes.every((box) => box.x >= introBox.x + introBox.width || box.right <= introBox.x || box.y >= introBox.y + introBox.height || box.bottom <= introBox.y), "Grade 7 prompt does not cover map markers");
    }
    await desktop.locator("#stage-map-markers button").nth(1).click();
    assert.equal(await desktop.locator("#stage-list button").nth(1).getAttribute("aria-pressed"), "true", `Grade ${grade} map marker selects the matching card`);
    await desktop.locator("#stage-list button").nth(1).click();
    assert.equal(await desktop.getByText("살펴보는 중", { exact: true }).count(), 1, `Grade ${grade} selected state is real DOM text`);
    assert.deepEqual(await desktop.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [1280, 1280], `Grade ${grade} has no horizontal overflow`);
  }
  await desktop.close();

  const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await phone.goto(`${url}?grade=8#grade-map`, { waitUntil: "networkidle" });
  const mobileArt = await phone.locator(".stage-map-scene").evaluate((node) => ({ image: getComputedStyle(node).backgroundImage, height: node.getBoundingClientRect().height }));
  assert.match(mobileArt.image, /mathematics-learning-world-gmap-v2\.webp\?v=20261103-3/);
  assert.ok(mobileArt.height >= 150, "phone gives the branded route illustration enough height above the vertical route");
  assert.equal(await phone.locator("#stage-list").evaluate((node) => getComputedStyle(node).gridTemplateColumns.trim().split(/\s+/).length), 1);
  const routeLabelSizes = await phone.locator("#stage-list button strong").evaluateAll((nodes) => nodes.map((node) => parseFloat(getComputedStyle(node).fontSize)));
  assert.ok(routeLabelSizes.every((size) => size >= 16), "phone route labels remain at least 16px");
  await phone.locator("#stage-list button").nth(1).click();
  assert.equal(await phone.getByText("살펴보는 중", { exact: true }).count(), 1);
  assert.deepEqual(await phone.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [390, 390]);
  await phone.close();
});

test("elementary roadmap cards use the supplied book and study-method guidance", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  const supplied = {
    3: /Spectrum Math.*Math Mammoth.*하루 5문제.*맞은 문제/,
    4: /Spectrum Word Problems.*Singapore Math Primary Mathematics.*계산 전에 표/,
    5: /Math Mammoth.*IXL.*점수보다 풀이 이유/,
    6: /Singapore Math Primary Mathematics.*Spectrum Test Prep.*새 진도보다 이미 배운 단원/
  };
  for (const [grade, expected] of Object.entries(supplied)) {
    await page.goto(`${url}?grade=${grade}#grade-map`, { waitUntil: "networkidle" });
    assert.match(await page.locator("#grade-focus-list").innerText(), expected, `Grade ${grade} shows its supplied books and study method`);
    assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [390, 390]);
    if (grade === "6") {
      assert.match(await page.locator("#annual-plan-title").innerText(), /선택 심화/);
      assert.match(await page.locator("#annual-plan-note").innerText(), /학교 수학에서 이미 배운 단원.*별도의 선택 심화/);
    }
  }
  await page.close();
});

test("Grade 7 roadmap opens original AMC 10 concept practice with topic filters and stacked fractions", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  await page.goto(`${url}?grade=7#annual-plan`, { waitUntil: "networkidle" });
  const amcLink = page.locator('#annual-plan-periods a[href="./amc10-practice.html?grade=7"]');
  assert.equal(await amcLink.innerText(), "지필드 AMC 10 개념 연결 연습");
  await amcLink.click();
  await page.waitForURL(/amc10-practice\.html\?grade=7$/);
  const reflection = page.locator(".practice-reflection");
  assert.equal(await reflection.locator("summary").innerText(), "풀이 뒤에 한 번 더 생각하기");
  assert.deepEqual(await reflection.locator("li").allTextContents(), ["왜 이 방법을 골랐나요?", "다른 방법으로도 풀 수 있나요?", "조건 하나를 바꾸면 무엇이 달라지나요?", "숫자가 바뀌어도 같은 생각이 통하나요?"]);
  assert.equal(await reflection.evaluate(function (node) { return node.open; }), false, "reflection prompt stays optional");
  await reflection.locator("summary").click();
  assert.equal(await reflection.evaluate(function (node) { return node.open; }), true);
  const bankSize = await page.evaluate(function () { return window.GFIELDAMC10ConceptPractice.items.length; });
  assert.ok(bankSize >= 58, "the expanded public bank is present");
  assert.equal(await page.locator(".amc10-workspace .problem-card").count(), bankSize);
  const choiceCount = await page.evaluate(function () { return window.GFIELDAMC10ConceptPractice.items.reduce(function (sum, item) { return sum + item.choices.length; }, 0); });
  assert.equal(await page.locator(".amc10-workspace .choice").count(), choiceCount);
  assert.equal(await page.locator("#amc10-back-route").evaluate(function (node) { return getComputedStyle(node).textDecorationLine; }), "none", "roadmap navigation is styled as a GFIELD action instead of default underlined link text");
  assert.equal(await page.locator("#amc10-back-route").evaluate(function (node) { return getComputedStyle(node).color; }), "rgb(96, 65, 143)");
  assert.equal(await page.locator("#practice-progress").evaluate(function (node) { return getComputedStyle(node).whiteSpace; }), "nowrap", "progress count stays on one line on narrow screens");
  assert.equal(await page.locator("body").evaluate(function (node) { return getComputedStyle(node).getPropertyValue("--blue").trim(); }), "#60418f", "AMC practice uses the roadmap plum accent");
  assert.equal(await page.locator("body").evaluate(function (node) { return getComputedStyle(node).getPropertyValue("--blue-soft").trim(); }), "#f0ebf7", "selected practice states use the roadmap lilac wash");
  assert.ok(await page.locator(".math-fraction").count() >= 7);
  assert.ok(await page.locator(".math-fraction").evaluateAll(function (nodes) {
    return nodes.every(function (node) {
      const numerator = node.children[0];
      return ["grid", "inline-grid"].includes(getComputedStyle(node).display)
        && numerator
        && getComputedStyle(numerator).borderBottomWidth !== "0px";
    });
  }), "actual fractions must show a numerator, fraction bar, and denominator");
  assert.match(await page.locator(".practice-boundary").innerText(), /학생의 실력이나 다음 과목을 판정하지 않습니다/);
  const first = page.locator('[data-item-id="amc10-g7-algebra-01"]');
  await first.locator('[data-choice="1"]').click();
  assert.equal(await first.locator(".feedback.wrong").count(), 1);
  assert.equal(await page.locator("#practice-progress").innerText(), `0 / ${bankSize}`);
  await first.locator(".hint-panel summary").click();
  assert.equal(await first.locator(".hint-panel").evaluate(function (node) { return node.open; }), true);
  await first.locator('[data-choice="0"]').click();
  assert.equal(await page.locator("#practice-progress").innerText(), `1 / ${bankSize}`);
  await page.locator("#domain-filters").getByRole("button", { name: "확률" }).click();
  const probabilityCount = await page.evaluate(function () { return window.GFIELDAMC10ConceptPractice.items.filter(function (item) { return item.domain === "확률"; }).length; });
  assert.equal(await page.locator(".amc10-workspace .problem-card").count(), probabilityCount);
  await page.locator("#domain-filters").getByRole("button", { name: "전체" }).click();
  assert.equal(await page.locator('[data-item-id="amc10-g7-algebra-01"] .choice.correct').count(), 1);
  assert.equal(await page.locator('[data-item-id="amc10-g7-algebra-01"] .choice:enabled').count(), 0);
  await page.locator('[data-item-id="amc10-g7-probability-01"] [data-choice="3"]').click();
  assert.equal(await page.locator("#practice-progress").innerText(), `2 / ${bankSize}`);
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [1280, 1280]);
  await page.locator(".domain-filter").first().focus();
  assert.equal(await page.locator(".domain-filter").first().evaluate(function (node) { return getComputedStyle(node).outlineColor; }), "rgb(96, 65, 143)", "keyboard focus uses the roadmap accent");
  await page.setViewportSize({ width: 390, height: 844 });
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [390, 390]);
  assert.equal(await page.locator("body").evaluate(function (node) { return getComputedStyle(node).wordBreak; }), "keep-all", "Korean title and guidance break between words on mobile");
  assert.ok((await page.locator(".practice-intro h1").boundingBox()).width >= 320, "AMC heading keeps a full mobile column instead of collapsing beside the release note");
  assert.equal(await page.locator(".practice-intro").evaluate(function (node) { return getComputedStyle(node).gridTemplateColumns.split(" ").length; }), 1, "mobile introduction stacks the title and source note");
  await page.goto(`${url.replace("boarding-roadmap.html", "amc10-practice.html")}?grade=9`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#amc10-nav-route").innerText(), "9학년 성장 지도");
  assert.equal(await page.locator("#amc10-back-route").getAttribute("href"), "./boarding-roadmap.html?grade=9#annual-plan");
  assert.equal(await page.locator("#amc10-review-route").getAttribute("href"), "./competition-paper-review.html?grade=9&program=amc10");
  await page.locator("#amc10-method-review-route").click();
  await page.waitForURL(/competition-paper-review\.html\?grade=9&program=amc10/);
  assert.equal(await page.locator("#review-grade").inputValue(), "9");
  assert.equal(await page.locator("#review-program").inputValue(), "amc10");
  assert.deepEqual(errors, []);
  await page.close();
});
