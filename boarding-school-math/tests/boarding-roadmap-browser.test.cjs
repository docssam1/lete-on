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

test("roadmap shortcut bar stays usable and tracks the selected section on mobile", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  await page.goto(`${url}?grade=7`, { waitUntil: "networkidle" });
  const nav = page.getByRole("navigation", { name: "성장 지도 바로가기" });
  assert.deepEqual(await nav.getByRole("link").allInnerTexts(), ["성장 지도", "월별 계획", "학년 비교", "경시 기록"]);
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

test("grade map, level comparison, and competition intake stay honest and interactive", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  await page.goto(`${url}?grade=7`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#grade-map-title").innerText(), "7학년 수학 한눈에");
  const footerLinkStyle = await page.locator(".site-footer a").first().evaluate(function (node) { return { color: getComputedStyle(node).color, textDecoration: getComputedStyle(node).textDecorationLine }; });
  assert.deepEqual(footerLinkStyle, { color: "rgb(86, 98, 116)", textDecoration: "none" });
  assert.match(await page.locator("#grade-title").innerText(), /유리수/);
  assert.equal(await page.locator(".grade-button").count(), 10);
  assert.equal(await page.locator(".stage-button").count(), 4);
  assert.match(await page.locator(".journey-position-card").innerText(), /아직 입력한 평가 기록이 없어요/);
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
  assert.equal(await page.locator("#competition-select").inputValue(), "");
  assert.equal(await page.locator(".competition-report").isHidden(), true);
  assert.match(await page.locator("#competition-diagnostic .map-head > p").innerText(), /이 화면에서 저장하지 않아요.*문항별 복습에서 저장한 요약/);
  assert.equal(await page.locator("#paper-label-field").isHidden(), true);
  assert.equal(await page.locator("#paper-review-link").isHidden(), true);
  assert.equal(await page.locator(".competition-submit").isHidden(), true);
  assert.equal(await page.locator("#competition-source-link").isHidden(), true);
  assert.equal(await page.locator("#competition-paper-source-link").isHidden(), true);
  await page.locator("#competition-select").selectOption("amc8");
  assert.deepEqual(await page.locator("#domain-rows .domain-row strong").allInnerTexts(), ["식·대수", "수·비례·추정", "기하·공간", "경우의 수·확률", "그래프·표 해석"]);
  assert.equal(await page.locator(".competition-report").isHidden(), true);
  assert.equal(await page.locator("#paper-label-field").isVisible(), true);
  assert.equal(await page.locator("#paper-review-link").innerText(), "문항별 복습 · AMC 회차별 기록 →");
  assert.match(await page.locator("#paper-review-link").getAttribute("href"), /grade=7&program=amc8/);
  assert.match(await page.locator("#competition-guidance").innerText(), /연습 경로.*연령.*MAA 공식 안내/);
  assert.match(await page.locator(".competition-input-note").innerText(), /직접 분류.*대회 자격/);
  assert.equal(await page.locator(".competition-submit").isVisible(), true);
  assert.equal(await page.locator("#competition-practice-link").isVisible(), true);
  assert.match(await page.locator("#competition-source-link").getAttribute("href"), /maa\.org/);
  await page.locator("#competition-select").selectOption("");
  assert.equal(await page.locator("#paper-review-link").isHidden(), true);
  assert.equal(await page.locator(".competition-submit").isHidden(), true);
  assert.equal(await page.locator("#competition-source-link").isHidden(), true);
  assert.equal(await page.locator("#competition-paper-source-link").isHidden(), true);
  await page.locator("#competition-select").selectOption("kangaroo");
  assert.match(await page.locator("#competition-source-link").getAttribute("href"), /mathkangaroo\.org/);
  assert.equal(await page.locator("#competition-paper-source-link").getAttribute("href"), "https://mathkangaroo.org/mks/practice/grades-7-8/");
  assert.equal(await page.locator("#competition-paper-source-link").innerText(), "7–8학년 기출 시험지 PDF ↗");
  assert.equal(await page.locator("#competition-paper-source-link").isVisible(), true);
  assert.equal(await page.locator("#competition-paper-source-link").getAttribute("target"), "_blank");
  assert.match(await page.locator("#competition-paper-source-link").getAttribute("rel"), /noopener/);
  await page.locator("#competition-select").selectOption("amc8");
  assert.equal(await page.locator("#competition-paper-source-link").isHidden(), true);
  await page.locator(".grade-track > summary").click();
  await page.getByRole("button", { name: "Grade 9 지도 보기" }).click();
  assert.deepEqual(await page.locator(".route-button[aria-pressed='true']").allInnerTexts(), []);
  assert.equal(await page.locator(".route-explanation").isHidden(), true);
  assert.equal(await page.locator("#route-check-block").isHidden(), true);
  assert.equal(await page.locator("#competition-select").inputValue(), "");
  await page.locator("#competition-select").selectOption("kangaroo");
  assert.equal(await page.locator("#competition-paper-source-link").getAttribute("href"), "https://mathkangaroo.org/mks/practice/grades-9-10/");
  assert.equal(await page.locator("#grade-map-title").innerText(), "9학년 수학 한눈에");
  assert.match(await page.locator("#grade-focus-list").innerText(), /학교 수학 · 추정/);
  assert.match(await page.locator("#source-chip").innerText(), /추정안/);
  assert.match(await page.locator("#grade-note").innerText(), /제공된 7·8·10학년/);
  await page.locator("#competition-select").selectOption("amc10");
  assert.deepEqual(await page.locator("#domain-rows .domain-row strong").allInnerTexts(), ["식·대수", "수와 정수론", "기하·공간", "경우의 수·확률"]);
  assert.match(await page.locator("#paper-review-link").getAttribute("href"), /grade=9&program=amc10/);
  assert.equal(await page.locator("#competition-practice-link").isHidden(), true);
  await page.locator('[data-strand="algebra"][data-field="attempted"]').fill("4");
  await page.locator('[data-strand="algebra"][data-field="correct"]').fill("3");
  await page.locator('[data-strand="geometry"][data-field="attempted"]').fill("2");
  await page.locator('[data-strand="geometry"][data-field="correct"]').fill("1");
  await page.getByRole("button", { name: "영역별 결과 보기" }).click();
  assert.equal(await page.locator(".competition-report").isVisible(), true);
  assert.equal(await page.locator(".competition-report").evaluate(function (node) { return node === document.activeElement; }), true);
  assert.equal(await page.locator("#competition-report-title").innerText(), "AMC 10 · 6문제 중 4문제 정답");
  assert.equal(await page.locator("#competition-report-rows .report-row").count(), 2);
  assert.doesNotMatch(await page.locator("#competition-report-rows").innerText(), /입력 없음/);
  assert.match(await page.locator("#competition-report-rows").innerText(), /3문제 미만/);
  assert.doesNotMatch(await page.locator("#competition-report-rows").innerText(), /50%/);
  assert.match(await page.locator("#competition-report-summary").innerText(), /6\/25문항 입력[\s\S]*두 영역에서 각각 3문제 이상/);
  assert.match(await page.locator(".competition-report-boundary").innerText(), /실력 등급.*응시 자격/);
  assert.equal(await page.locator("#competition-saved-diagnostic").isHidden(), true);
  assert.equal(await page.evaluate(function () { return localStorage.getItem("gmap-local-learning-record-v1:competition-diagnostic-history-v1"); }), null);
  await page.locator('[data-strand="geometry"][data-field="attempted"]').fill("4");
  await page.locator('[data-strand="geometry"][data-field="correct"]').fill("3");
  await page.getByRole("button", { name: "영역별 결과 보기" }).click();
  assert.match(await page.locator("#competition-report-summary").innerText(), /영역별 정답률이 같아요/);
  await page.locator('[data-strand="geometry"][data-field="correct"]').fill("1");
  await page.getByRole("button", { name: "영역별 결과 보기" }).click();
  assert.match(await page.locator("#competition-report-summary").innerText(), /기하·공간부터 다시 보세요/);
  assert.deepEqual(errors, []);
  await page.close();
});

test("Math Kangaroo archive link follows the official paired paper band in roadmap Grades 3–12", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  for (let grade = 3; grade <= 12; grade += 1) {
    await page.goto(`${url}?grade=${grade}`, { waitUntil: "networkidle" });
    await page.locator("#competition-select").selectOption("kangaroo");
    const bandStart = Math.floor((grade - 1) / 2) * 2 + 1;
    const bandEnd = bandStart + 1;
    const link = page.locator("#competition-paper-source-link");
    assert.equal(await link.getAttribute("href"), `https://mathkangaroo.org/mks/practice/grades-${bandStart}-${bandEnd}/`);
    assert.equal(await link.innerText(), `${bandStart}–${bandEnd}학년 기출 시험지 PDF ↗`);
  }
  await page.close();
});

test("Grade 11–12 roadmap identifies inferred plans and only offers the eligible AMC 12 track", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  await page.goto(`${url}?grade=11`, { waitUntil: "networkidle" });
  assert.match(await page.locator("#source-chip").innerText(), /11학년 · 추정안/);
  assert.match(await page.locator("#grade-note").innerText(), /공통 수학 범주.*추정안/);
  assert.match(await page.locator("#annual-plan-title").innerText(), /11학년.*추정/);
  assert.match(await page.locator("#annual-plan-note").innerText(), /과목명·순서/);
  const grade11Options = await page.locator("#competition-select option").allTextContents();
  assert.ok(grade11Options.some(function (label) { return /AMC 12/.test(label); }));
  assert.ok(!grade11Options.some(function (label) { return /AMC 10/.test(label); }));
  assert.equal(await page.locator(".grade-button").count(), 10);
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [390, 390]);
  await page.getByRole("button", { name: "다음 학년 →" }).click();
  assert.match(await page.locator("#source-chip").innerText(), /12학년 · 추정안/);
  assert.match(await page.locator("#annual-plan-title").innerText(), /12학년.*추정/);
  assert.match(await page.locator("#grade-core").innerText(), /졸업·대학 계획/);
  assert.deepEqual(errors, []);
  await page.close();
});

test("roadmap shows only user-entered assessment evidence for the selected grade", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${url.replace("boarding-roadmap.html", "assessment-entry.html")}?grade=7`, { waitUntil: "networkidle" });
  await page.locator("#overall-percent").fill("82");
  await page.locator("#current-course").selectOption("pre-algebra");
  await page.locator("#target-course").selectOption("algebra-1");
  await page.getByRole("button", { name: /비교 결과 보기/ }).click();
  assert.equal(await page.locator("#result-content").isVisible(), true);
  await page.goto(`${url}?grade=7`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#journey-evidence-label").innerText(), "학교 수학 Placement Test · 7학년");
  assert.equal(await page.locator("#journey-evidence-title").innerText(), "Pre-Algebra → Algebra 1");
  assert.match(await page.locator("#journey-evidence-copy").innerText(), /공식 과목 배정을 판정하지 않아요/);
  assert.doesNotMatch(await page.locator(".journey-position-card").innerText(), /82%/);
  await page.getByLabel("비교할 학년").selectOption("8");
  assert.equal(await page.locator("#comparison-assessment-current-title").innerText(), "Pre-Algebra → Algebra 1");
  assert.equal(await page.locator("#comparison-assessment-link").innerText(), "평가 결과 확인·수정 →");
  assert.equal(await page.locator("#comparison-assessment-target-title").innerText(), "대수와 기하를 함께");
  assert.match(await page.locator("#comparison-assessment-target-copy").innerText(), /함수와 기하/);
  assert.match(await page.locator("#comparison-pair-note, .comparison-pair-note").innerText(), /공식 배정을 판정하지 않아요/);
  await page.locator(".grade-track > summary").click();
  await page.getByRole("button", { name: "Grade 8 지도 보기" }).click();
  assert.equal(await page.locator("#journey-evidence-title").innerText(), "아직 입력한 평가 기록이 없어요");
  assert.equal(await page.locator("#journey-assessment-link").getAttribute("href"), "./assessment-entry.html?grade=8");
  await page.getByLabel("비교할 학년").selectOption("7");
  assert.equal(await page.locator("#comparison-assessment-current-title").innerText(), "선택한 과정 경로가 없어요");
  assert.equal(await page.locator("#comparison-assessment-link").innerText(), "평가 기록 입력 →");
  assert.equal(await page.locator("#comparison-assessment-link").getAttribute("href"), "./assessment-entry.html?grade=8");
  assert.deepEqual(errors, []);
  await page.close();
});

test("roadmap loads each grade's own assessment route from local history", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  await page.goto(`${url.replace("boarding-roadmap.html", "assessment-entry.html")}?grade=7`, { waitUntil: "networkidle" });
  await page.locator("#overall-percent").fill("82");
  await page.locator("#current-course").selectOption("pre-algebra");
  await page.locator("#target-course").selectOption("algebra-1");
  await page.locator("#evidence-form").evaluate(function (form) { form.requestSubmit(); });
  await page.goto(`${url.replace("boarding-roadmap.html", "assessment-entry.html")}?grade=8`, { waitUntil: "networkidle" });
  await page.locator("#overall-percent").fill("76");
  await page.locator("#current-course").selectOption("algebra-1");
  await page.locator("#target-course").selectOption("geometry");
  await page.locator("#evidence-form").evaluate(function (form) { form.requestSubmit(); });
  await page.goto(`${url}?grade=7`, { waitUntil: "networkidle" });
  await page.getByLabel("비교할 학년").selectOption("8");
  assert.equal(await page.locator("#journey-evidence-title").innerText(), "Pre-Algebra → Algebra 1");
  assert.equal(await page.locator("#comparison-assessment-current-title").innerText(), "Pre-Algebra → Algebra 1");
  assert.equal(await page.locator("#comparison-assessment-target-title").innerText(), "Algebra 1 → Geometry");
  assert.match(await page.locator("#comparison-assessment-target-copy").innerText(), /성적표에서 직접 입력한 현재·목표 과정/);
  assert.equal(await page.locator("#comparison-assessment-target-link").isVisible(), false);
  await page.locator(".grade-track > summary").click();
  await page.getByRole("button", { name: "Grade 8 지도 보기" }).click();
  assert.equal(await page.locator("#journey-evidence-title").innerText(), "Algebra 1 → Geometry");
  assert.deepEqual(errors, []);
  await page.close();
});

test("grade comparison displays arithmetic RIT difference only for matching MAP records", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${url.replace("boarding-roadmap.html", "assessment-entry.html")}?grade=7`, { waitUntil: "networkidle" });
  await page.locator("#source-id").selectOption("map-growth");
  await page.locator("#rit").fill("218");
  await page.locator("#percentile").fill("55");
  await page.locator("#season").selectOption("fall");
  await page.locator("#evidence-form").evaluate(function (form) { form.requestSubmit(); });
  await page.goto(`${url.replace("boarding-roadmap.html", "assessment-entry.html")}?grade=8`, { waitUntil: "networkidle" });
  await page.locator("#source-id").selectOption("map-growth");
  await page.locator("#rit").fill("231");
  await page.locator("#percentile").fill("62");
  await page.locator("#season").selectOption("");
  await page.locator("#evidence-form").evaluate(function (form) { form.requestSubmit(); });
  await page.goto(`${url}?grade=7`, { waitUntil: "networkidle" });
  await page.getByLabel("비교할 학년").selectOption("8");
  const comparison = page.locator("#rit-comparison-copy");
  assert.equal(await comparison.getAttribute("data-state"), "comparable-scale");
  assert.match(await comparison.innerText(), /Grade 7.*RIT 218 → Grade 8.*RIT 231 · 입력값 차이 \+13 RIT/);
  assert.match(await comparison.innerText(), /시기 미기재/);
  assert.match(await comparison.innerText(), /같은 학생의 기록인지 성적표에서 확인/);
  assert.match(await comparison.innerText(), /예상 성장.*동학년 백분위.*모든 내용 숙달을 판정하지 않아요/);
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [390, 390]);
  await page.close();
});

test("grade comparison rounds legacy decimal RIT differences to one decimal place", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${url.replace("boarding-roadmap.html", "assessment-entry.html")}?grade=7`, { waitUntil: "networkidle" });
  await page.evaluate(function () {
    [
      { grade: 7, rit: 218.1 },
      { grade: 8, rit: 231.3 }
    ].forEach(function (entry) {
      const record = window.GFIELDExternalMathEvidenceEngine.analyze({ sourceId: "map-growth", testDate: "2026-09-01", grade: entry.grade, currentCourseId: "pre-algebra", targetCourseId: "algebra-1", rit: entry.rit, percentile: 55, domains: [] });
      window.GFIELDLocalLearningRecord.storage.saveAssessmentEvidence(record);
    });
  });
  await page.goto(`${url}?grade=7`, { waitUntil: "networkidle" });
  await page.getByLabel("비교할 학년").selectOption("8");
  const comparison = await page.locator("#rit-comparison-copy").innerText();
  assert.match(comparison, /입력값 차이 \+13\.2 RIT/);
  assert.doesNotMatch(comparison, /13\.199999/);
  await page.close();
});

test("MAP grade percentiles compare only when norm year, season, and instruction week match", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${url.replace("boarding-roadmap.html", "assessment-entry.html")}?grade=7`, { waitUntil: "networkidle" });
  await page.evaluate(function () {
    [
      { grade: 7, rit: 218, percentile: 55, normYear: "2025", season: "fall", instructionalWeeks: 4 },
      { grade: 8, rit: 224, percentile: 63, normYear: "2025", season: "fall", instructionalWeeks: 4 }
    ].forEach(function (entry) {
      const record = window.GFIELDExternalMathEvidenceEngine.analyze({ sourceId: "map-growth", testDate: "2026-09-01", grade: entry.grade, currentCourseId: "pre-algebra", targetCourseId: "algebra-1", rit: entry.rit, percentile: entry.percentile, normYear: entry.normYear, season: entry.season, instructionalWeeks: entry.instructionalWeeks, domains: [] });
      window.GFIELDLocalLearningRecord.storage.saveAssessmentEvidence(record);
    });
  });
  await page.goto(`${url}?grade=7`, { waitUntil: "networkidle" });
  await page.locator("#comparison-grade").selectOption("8");
  const percentile = page.locator("#map-percentile-comparison-copy");
  assert.equal(await page.locator("#map-percentile-comparison").getAttribute("data-state"), "comparable-grade-norms");
  assert.match(await percentile.innerText(), /Grade 7 백분위 55 → Grade 8 백분위 63 · 차이 \+8 percentile points \(2025 norms · Fall\)/);
  assert.match(await percentile.innerText(), /같은 학생의 기록인지 확인/);
  await page.goto(`${url.replace("boarding-roadmap.html", "assessment-entry.html")}?grade=8`, { waitUntil: "networkidle" });
  await page.evaluate(function () {
    const record = window.GFIELDExternalMathEvidenceEngine.analyze({ sourceId: "map-growth", testDate: "2026-09-01", grade: 8, currentCourseId: "pre-algebra", targetCourseId: "algebra-1", rit: 224, percentile: 63, normYear: "2025", season: "fall", instructionalWeeks: 5, domains: [] });
    window.GFIELDLocalLearningRecord.storage.saveAssessmentEvidence(record);
  });
  await page.goto(`${url}?grade=7`, { waitUntil: "networkidle" });
  await page.locator("#comparison-grade").selectOption("8");
  assert.equal(await page.locator("#map-percentile-comparison").getAttribute("data-state"), "needs-matching-norms");
  assert.doesNotMatch(await page.locator("#map-percentile-comparison-copy").innerText(), /차이 \+/);
  await page.close();
});

test("grade comparison does not calculate a difference between different assessment sources", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${url.replace("boarding-roadmap.html", "assessment-entry.html")}?grade=7`, { waitUntil: "networkidle" });
  await page.locator("#source-id").selectOption("map-growth");
  await page.locator("#rit").fill("218");
  await page.locator("#percentile").fill("55");
  await page.locator("#evidence-form").evaluate(function (form) { form.requestSubmit(); });
  await page.goto(`${url.replace("boarding-roadmap.html", "assessment-entry.html")}?grade=8`, { waitUntil: "networkidle" });
  await page.locator("#overall-percent").fill("82");
  await page.locator("#evidence-form").evaluate(function (form) { form.requestSubmit(); });
  await page.goto(`${url}?grade=7`, { waitUntil: "networkidle" });
  await page.getByLabel("비교할 학년").selectOption("8");
  assert.equal(await page.locator("#rit-comparison-copy").getAttribute("data-state"), "needs-matching-map-records");
  assert.doesNotMatch(await page.locator("#rit-comparison-copy").innerText(), /RIT 218.*→.*82%|입력값 차이 \+/);
  assert.match(await page.locator("#rit-comparison-copy").innerText(), /서로 다른 시험 점수는 섞지 않아요/);
  await page.close();
});

test("same-source CTP, SSAT, and ISEE records show raw values without deriving grade bands", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${url.replace("boarding-roadmap.html", "assessment-entry.html")}?grade=7`, { waitUntil: "networkidle" });
  await page.evaluate(function () {
    [
      { sourceId: "ctp", grade: 7, percentile: 81, scaleScore: 224, stanine: 7, normGroup: "Independent School Norm" },
      { sourceId: "ssat", grade: 7, percentile: 74, scaleScore: 685, testLevel: "ssat-middle" },
      { sourceId: "isee", grade: 7, quantStanine: 6, mathStanine: 8, testLevel: "isee-middle" },
      { sourceId: "ctp", grade: 8, percentile: 68, scaleScore: 231, stanine: 6, normGroup: "National Norm" },
      { sourceId: "ssat", grade: 8, percentile: 79, scaleScore: 710, testLevel: "ssat-upper" },
      { sourceId: "isee", grade: 8, quantStanine: 7, mathStanine: 7, testLevel: "isee-upper" }
    ].forEach(function (entry, index) {
      const record = window.GFIELDExternalMathEvidenceEngine.analyze(Object.assign({ testDate: `2026-09-0${index + 1}`, currentCourseId: "pre-algebra", targetCourseId: "algebra-1", domains: [] }, entry));
      window.GFIELDLocalLearningRecord.storage.saveAssessmentEvidence(record);
    });
  });
  await page.goto(`${url}?grade=7`, { waitUntil: "networkidle" });
  await page.locator("#comparison-grade").selectOption("8");
  const panel = page.locator("#same-source-score-comparison");
  assert.equal(await panel.getAttribute("data-state"), "same-source-values-only");
  assert.equal(await page.locator(".same-source-score-pair").count(), 3);
  const text = await panel.innerText();
  assert.match(text, /ERB CTP Mathematics/);
  assert.match(text, /백분위 81/);
  assert.match(text, /Independent School Norm/);
  assert.match(text, /National Norm/);
  assert.match(text, /SSAT Quantitative/);
  assert.match(text, /SSAT Middle/);
  assert.match(text, /SSAT Upper/);
  assert.match(text, /ISEE Quantitative \/ Mathematics/);
  assert.match(text, /ISEE Middle/);
  assert.match(text, /ISEE Upper/);
  assert.match(text, /Quantitative Reasoning[\s\S]*Stanine 6/);
  assert.match(text, /Mathematics Achievement[\s\S]*Stanine 8/);
  assert.doesNotMatch(text, /차이|등급|성장/);
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [390, 390]);
  await page.close();
});

test("same-source score panel stays hidden when only one grade has CTP records", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${url.replace("boarding-roadmap.html", "assessment-entry.html")}?grade=7`, { waitUntil: "networkidle" });
  await page.evaluate(function () {
    const record = window.GFIELDExternalMathEvidenceEngine.analyze({ sourceId: "ctp", testDate: "2026-09-01", grade: 7, currentCourseId: "pre-algebra", targetCourseId: "algebra-1", percentile: 81, domains: [] });
    window.GFIELDLocalLearningRecord.storage.saveAssessmentEvidence(record);
  });
  await page.goto(`${url}?grade=7`, { waitUntil: "networkidle" });
  await page.locator("#comparison-grade").selectOption("8");
  assert.equal(await page.locator("#same-source-score-comparison").getAttribute("data-state"), "no-matching-records");
  assert.equal(await page.locator("#same-source-score-comparison").isHidden(), true);
  await page.close();
});

test("released unit practice is reachable without exposing the private Grade 7 diagnostic", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${url}?grade=6`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#grade-practice-links a").count(), 3);
  assert.equal(await page.locator("#competition-practice-link").isHidden(), true);
  await page.locator("#competition-select").selectOption("amc8");
  assert.equal(await page.locator("#competition-practice-link").isVisible(), true);
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
  await page.goto(`${url}?grade=8`, { waitUntil: "networkidle" });
  const comparison = page.getByLabel("비교할 학년");
  assert.equal(await page.locator("#assessment-entry-link").getAttribute("href"), "./assessment-entry.html?grade=8");
  assert.match(await page.locator(".comparison-evidence-link").innerText(), /학교 Placement Test나 MAP·CTP/);
  assert.equal(await comparison.inputValue(), "");
  await comparison.selectOption("9");
  assert.equal(await page.locator("#comparison-table").isVisible(), true);
  assert.equal(await page.locator("#comparison-current-label").innerText(), "8학년 · 가속 학습 예시 · 학교 학년 기준 아님");
  assert.equal(await page.locator("#comparison-target-label").innerText(), "9학년 · 추정안");
  assert.match(await page.locator("#comparison-note").innerText(), /학교 과목 순서를 확인/);
  assert.match(await page.locator("#comparison-bridge-copy").innerText(), /8학년:.*9학년:/);
  assert.match(await page.locator("#comparison-current-tracks").innerText(), /1–3개월[\s\S]*대수 개념과 문제 해결/);
  assert.match(await page.locator("#comparison-current-tracks").innerText(), /4–6개월[\s\S]*기하 심화와 AMC 10\/12/);
  assert.match(await page.locator("#comparison-target-tracks").innerText(), /10–12개월 · 추정/);
  assert.match(await page.locator(".comparison-boundary").innerText(), /학생의 현재 위치.*판단하지 않아요/);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true);
  assert.equal(await page.locator("#comparison-assessment-pair").isVisible(), true);
  assert.equal(await page.locator(".comparison-pair-columns article").count(), 2);
  assert.equal(await page.locator(".comparison-pair-columns").evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(" ").length), 1);
  assert.equal(await page.locator(".comparison-desktop-view").isVisible(), false);
  assert.equal(await page.locator(".comparison-mobile-view").isVisible(), true);
  const pairedRows = page.locator(".comparison-mobile-row:not(.comparison-mobile-header)");
  assert.ok(await pairedRows.count() >= 8);
  for (const row of await pairedRows.all()) assert.equal(await row.locator(".comparison-mobile-cell").count(), 2, "each mobile comparison row keeps both grade values together");
  assert.match(await page.locator("#comparison-mobile-view").innerText(), /학교 수학[\s\S]*경시 · 선택[\s\S]*SAT · 선택[\s\S]*1–3개월/);
  assert.doesNotMatch(await page.locator("#comparison-mobile-view").innerText(), /학습 주제|기간 1/);
  assert.match(await page.locator(".comparison-mobile-note").innerText(), /인접 학년 자료를 연결한 추정안/);
  await page.emulateMedia({ media: "print" });
  assert.equal(await page.locator("#comparison-table").isVisible(), true);
  assert.equal(await page.locator(".grade-comparison-controls").isVisible(), false);
  await page.emulateMedia({ media: "screen" });
  await page.locator("#competition-select").selectOption("amc8");
  assert.equal(await page.locator("#competition-practice-link").isHidden(), true, "Grade 8 should not be offered the Grade 6 bridge as a grade-level practice set");
  await page.close();
});

test("grade comparison pairs only matching contest paper date and memo across grades", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  async function saveContestReview(grade, date, label, status) {
    await page.goto(`${url.replace("boarding-roadmap.html", "competition-paper-review.html")}?grade=${grade}&program=amc8`, { waitUntil: "networkidle" });
    await page.locator("#review-exam-date").fill(date);
    await page.locator("#review-paper-label").fill(label);
    await page.locator('[data-question="1"][data-field="status"]').selectOption(status);
    await page.locator('[data-question="1"][data-field="domain"]').selectOption("algebra");
    if (status === "wrong") await page.locator('[data-question="1"][data-field="reason"]').selectOption("concept");
    await page.getByRole("button", { name: "결과 보기" }).click();
    await page.locator("#save-diagnostic").click();
  }
  await saveContestReview(6, "2026-10-01", "Grade 6 practice", "correct");
  await saveContestReview(7, "2026-10-02", "Grade 7 practice", "wrong");
  await page.goto(`${url}?grade=7&program=amc8`, { waitUntil: "networkidle" });
  await page.locator("#comparison-grade").selectOption("6");
  assert.equal(await page.locator("#competition-grade-comparison").getAttribute("data-state"), "needs-matching-program-records");
  assert.match(await page.locator("#competition-grade-comparison-copy").innerText(), /같은 날짜·문제지 메모/);
  assert.equal(await page.locator("#competition-grade-comparison-cards article").count(), 0);
  await saveContestReview(6, "2026-10-03", "2025 AMC 8 Form A", "correct");
  await saveContestReview(7, "2026-10-03", "2025 AMC 8 Form A", "wrong");
  await saveContestReview(6, "2026-10-04", "Different AMC 8 form", "wrong");
  await saveContestReview(7, "2026-10-05", "Another AMC 8 form", "correct");
  await page.evaluate(function () {
    window.GFIELDLocalLearningRecord.storage.saveCompetitionDiagnostic({
      schemaVersion: "gfield-competition-diagnostic-v1", id: "undated-grade6-practice", programId: "amc8", programTitle: "AMC 8",
      grade: 6, paperLabel: "Undated practice", examDate: "",
      summary: { itemCount: 25, correct: 1, wrong: 0, blank: 0, unmarked: 24, attempted: 1, domainClassified: 1, reasonClassified: 0 },
      domains: [{ id: "algebra", attempted: 1, correct: 1, wrong: 0, blank: 0 }], reasons: []
    });
  });
  await page.goto(`${url}?grade=7&program=amc8`, { waitUntil: "networkidle" });
  await page.locator("#comparison-grade").selectOption("6");
  assert.equal(await page.locator("#competition-grade-comparison").getAttribute("data-state"), "comparable-format");
  assert.equal(await page.locator("#competition-grade-comparison-cards article").count(), 2);
  assert.deepEqual(await page.locator("#competition-grade-comparison-cards article p, #competition-grade-comparison-cards article li").evaluateAll(function (nodes) {
    return [...new Set(nodes.map(function (node) { return getComputedStyle(node).fontSize; }))];
  }), ["16px"]);
  const comparisonText = await page.locator("#competition-grade-comparison-cards").innerText();
  assert.match(comparisonText, /6학년 · 2025 AMC 8 Form A · 2026-10-03/);
  assert.match(comparisonText, /7학년 · 2025 AMC 8 Form A · 2026-10-03/);
  assert.doesNotMatch(comparisonText, /Different AMC 8 form|Another AMC 8 form/);
  assert.doesNotMatch(comparisonText, /Undated practice/);
  assert.match(await page.locator("#competition-grade-comparison-copy").innerText(), /날짜와 메모가 같아도 난도를 보정한 등급이나 성장 판정은 아니에요/);
  assert.equal(await page.evaluate(function () { return document.documentElement.scrollWidth === document.documentElement.clientWidth; }), true);
  await page.locator("#comparison-grade").selectOption("8");
  assert.equal(await page.locator("#competition-grade-comparison").getAttribute("data-state"), "needs-matching-program-records");
  assert.match(await page.locator("#competition-grade-comparison-copy").innerText(), /8학년/);
  await page.close();
});

test("Math Kangaroo Grade 7 and 8 diagnostics compare the same 30-question paper without implying grade rank", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  async function saveKangarooReview(grade, status) {
    await page.goto(`${url.replace("boarding-roadmap.html", "competition-paper-review.html")}?grade=${grade}&program=kangaroo`, { waitUntil: "networkidle" });
    assert.match(await page.locator("#review-source-note").innerText(), /30문항/);
    await page.locator("#review-exam-date").fill("2026-03-19");
    await page.locator("#review-paper-label").fill("2025 Grade 7–8 official paper");
    await page.locator('[data-question="1"][data-field="status"]').selectOption(status);
    await page.locator('[data-question="1"][data-field="domain"]').selectOption("algebra");
    if (status === "wrong") await page.locator('[data-question="1"][data-field="reason"]').selectOption("concept");
    await page.getByRole("button", { name: "결과 보기" }).click();
    await page.locator("#save-diagnostic").click();
  }
  await saveKangarooReview(7, "correct");
  await saveKangarooReview(8, "wrong");
  await page.goto(`${url}?grade=7&program=kangaroo`, { waitUntil: "networkidle" });
  await page.locator("#comparison-grade").selectOption("8");
  assert.equal(await page.locator("#competition-grade-comparison").getAttribute("data-state"), "comparable-format");
  assert.equal(await page.locator("#competition-grade-comparison-cards article").count(), 2);
  const text = await page.locator("#competition-grade-comparison").innerText();
  assert.match(text, /Math Kangaroo · 2026-03-19/);
  assert.match(text, /영역 분류 1\/30/);
  assert.match(text, /7학년 · 2025 Grade 7–8 official paper/);
  assert.match(text, /8학년 · 2025 Grade 7–8 official paper/);
  assert.match(text, /공식 순위와 백분위는 학년별로 산정/);
  assert.match(text, /난도를 보정한 등급이나 성장 판정은 아니에요/);
  assert.equal(await page.evaluate(function () { return document.documentElement.scrollWidth === document.documentElement.clientWidth; }), true);
  await saveKangarooReview(9, "correct");
  await page.goto(`${url}?grade=7&program=kangaroo`, { waitUntil: "networkidle" });
  await page.locator("#comparison-grade").selectOption("9");
  assert.equal(await page.locator("#competition-grade-comparison").getAttribute("data-state"), "needs-matching-program-records");
  assert.match(await page.locator("#competition-grade-comparison-copy").innerText(), /공식 시험지 학년 묶음이 달라/);
  await page.close();
});

test("Grade 10 and Grade 12 comparison keeps inferred planning separate from learner assessment", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${url}?grade=10`, { waitUntil: "networkidle" });
  assert.match(await page.locator("#grade-focus-list").innerText(), /AMC 12 130\+는 개인 도전 목표[\s\S]*Digital SAT Math 800은 개인 도전 목표/);
  assert.match(await page.locator("#annual-plan-note").innerText(), /AMC 12 130\+와 Digital SAT Math 800은 선택형 도전 목표/);
  assert.match(await page.locator("#annual-plan-periods").innerText(), /USAMO형 증명 문제[\s\S]*해당 연도 MAA 안내/);
  await page.getByLabel("비교할 학년").selectOption("12");
  assert.equal(await page.locator("#comparison-current-label").innerText(), "10학년 · 가속 학습 예시 · 학교 학년 기준 아님");
  assert.equal(await page.locator("#comparison-target-label").innerText(), "12학년 · 추정안");
  assert.match(await page.locator("#comparison-target-title").innerText(), /배운 수학을 선택 과목/);
  assert.match(await page.locator("#comparison-target-tracks").innerText(), /학교 수학 · 추정[\s\S]*졸업 요건·과목 경로/);
  assert.match(await page.locator("#comparison-note").innerText(), /추정안은 학교 과목 순서를 확인/);
  assert.match(await page.locator(".comparison-boundary").innerText(), /학생의 현재 위치.*판단하지 않아요/);
  assert.match(await page.locator("#comparison-assessment-target-label").innerText(), /12학년 · 추정 계획 예시/);
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [1280, 1280]);
  await page.close();
});

test("Grade 3 comparison labels the missing contest-plan source instead of implying no contest option exists", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${url}?grade=3`, { waitUntil: "networkidle" });
  await page.getByLabel("비교할 학년").selectOption("5");
  assert.match(await page.locator("#comparison-current-label").innerText(), /3학년 · 계획 예시 · 연간 구간 추정/);
  assert.match(await page.locator("#comparison-target-label").innerText(), /5학년 · 계획 예시 · 연간 구간 추정/);
  assert.match(await page.locator("#comparison-current-tracks").innerText(), /경시 · 선택[\s\S]*이 학년 계획 자료에는 별도 경시 과정이 제시되지 않았어요/);
  assert.match(await page.locator("#comparison-target-tracks").innerText(), /경시 · 선택[\s\S]*이 학년 계획 자료에는 별도 경시 과정이 제시되지 않았어요/);
  await page.close();

  const phone = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await phone.goto(`${url}?grade=3`, { waitUntil: "networkidle" });
  await phone.getByLabel("비교할 학년").selectOption("5");
  assert.match(await phone.locator(".comparison-mobile-header").innerText(), /3학년 · 현재 · 계획 예시 · 연간 구간 추정[\s\S]*5학년 · 계획 예시 · 연간 구간 추정/);
  assert.deepEqual(await phone.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [390, 390]);
  await phone.close();
});

test("grade comparison keeps paired columns on desktop", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${url}?grade=7`, { waitUntil: "networkidle" });
  await page.getByLabel("비교할 학년").selectOption("8");
  assert.equal(await page.locator(".comparison-desktop-view").isVisible(), true);
  assert.equal(await page.locator(".comparison-mobile-view").isVisible(), false);
  const positions = await page.locator(".comparison-column").evaluateAll((nodes) => nodes.map((node) => ({ x: node.getBoundingClientRect().x, y: node.getBoundingClientRect().y })));
  assert.equal(positions.length, 2);
  assert.ok(positions[1].x > positions[0].x && positions[1].y === positions[0].y);
  await page.close();
});

test("Grade 7 path previews checkpoints without claiming a measured position", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${url}?grade=7`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".boarding-intro").isHidden(), true);
  assert.equal(await page.locator(".grade-track").evaluate(function (node) { return node.open; }), false);
  assert.ok(await page.locator(".grade7-path").evaluate(function (node) { return node.getBoundingClientRect().top < window.innerHeight; }), "Grade 7 path should start in the first phone screen");
  assert.equal(await page.locator("#grade7-road-intro").isVisible(), true);
  assert.match(await page.locator("#boarding-learning-plan-link").getAttribute("href"), /learning-plan\.html\?goal=school-g7-nsa/);
  assert.match(await page.locator("#boarding-learning-plan-link-bottom").getAttribute("href"), /learning-plan\.html\?goal=school-g7-nsa/);
  assert.match(await page.locator(".journey-position-card").innerText(), /아직 입력한 평가 기록이 없어요/);
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
  assert.match(await page.locator("#stage-number").innerText(), /살펴보는 구간 2/);
  assert.match(await page.locator("#grade7-stage-questions").innerText(), /비례/);
  assert.match(await page.locator("#grade7-stage-resource").getAttribute("href"), /cluster=7.RP.A/);
  assert.doesNotMatch(await page.locator("#grade7-position").innerText(), /비례 관계/);
  await page.locator("#grade7-branches summary").click();
  assert.match(await page.locator("#grade7-branches details p").innerText(), /정식 SAT 진단/);
  assert.match(await page.locator("#grade7-branches a").getAttribute("href"), /competition-practice\.html\?program=amc8$/);
  assert.match(await page.locator("#grade7-branches a").innerText(), /6학년 기초 연결/);
  await page.locator(".grade-track > summary").focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.locator(".grade-track").evaluate(function (node) { return node.open; }), true);
  await page.getByRole("button", { name: "Grade 8 지도 보기" }).click();
  assert.equal(await page.locator("#grade7-road-intro").isHidden(), true);
  await page.goBack();
  assert.equal(await page.locator("#grade7-road-intro").isVisible(), true);
  assert.equal(await page.locator(".stage-detail").isHidden(), true);
  assert.match(await page.locator(".journey-position-card").innerText(), /아직 입력한 평가 기록이 없어요/);
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [390, 390]);
  await page.close();
});

test("elementary plans turn the supplied book guidance into clearly labeled pacing examples", async function () {
  for (const grade of [3, 4, 5]) {
    for (const width of [390, 1280]) {
      const page = await browser.newPage({ viewport: { width, height: 844 } });
      await page.goto(`${url}?grade=${grade}#annual-plan`, { waitUntil: "networkidle" });
      assert.match(await page.locator("#annual-plan-title").innerText(), new RegExp(`${grade}학년.*추정`));
      assert.equal(await page.locator("#annual-plan-periods > li").count(), 4);
      assert.ok(await page.locator("#annual-plan-periods").evaluate(function (node) { return node.classList.contains("is-inferred"); }));
      assert.match(await page.locator("#annual-plan-note").innerText(), /제공된 초등 로드맵.*계획 예시/);
      assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [width, width]);
      await page.close();
    }
  }
});

test("each Grade 7 NS.A standard link opens a populated filtered workbook with accessible controls",async function(){
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true});await page.goto(`${url}?grade=7`,{waitUntil:"networkidle"});await page.getByRole("button",{name:/살펴볼 지점 1, 유리수/}).click();
  const standards=await page.locator("#grade7-stage-questions .grade7-standard-code").evaluateAll(function(nodes){return nodes.map(function(node){return{standard:node.textContent,href:node.href,height:Math.round(node.getBoundingClientRect().height),minHeight:parseFloat(getComputedStyle(node).minHeight)};});});assert.deepEqual(standards.map(function(entry){return entry.standard;}),["7.NS.A.1","7.NS.A.2","7.NS.A.2d","7.NS.A.3"]);assert.ok(standards.every(function(entry){return entry.height>=44&&entry.minHeight>=44;}));for(let index=0;index<20&&!(await page.locator("#grade7-stage-questions .grade7-standard-code:focus-visible").count());index+=1)await page.keyboard.press("Tab");assert.ok(await page.locator("#grade7-stage-questions .grade7-standard-code:focus-visible").count(),"keyboard can focus a standard link");
  const route=await browser.newPage({viewport:{width:1280,height:900}});for(const entry of standards){await route.goto(entry.href,{waitUntil:"networkidle"});assert.equal(new URL(route.url()).searchParams.get("standard"),entry.standard);assert.ok(await route.locator(".book-problem").count()>0,entry.standard+" must open matching practice items");}await route.close();await page.close();
});

test("Grade 7 NS.A roadmap breaks the strand into four observable checks with references", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${url}?grade=7`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /살펴볼 지점 1, 유리수/ }).click();
  assert.deepEqual(await page.locator("#grade7-stage-questions .grade7-check-prompt").allInnerTexts(), [
    "덧셈·뺄셈: 수직선에서 이동과 거리를 나타내고, 빼기를 반대수 더하기로 설명할 수 있나요?",
    "곱셈·나눗셈: 부호와 연산 성질을 적용하고, 0이 아닌 수로 나누는 이유를 설명할 수 있나요?",
    "분수와 소수: 분수를 소수로 나타내고, 소수가 끝나는지 반복되는지 판별할 수 있나요?",
    "문장제: 상황에 맞게 유리수 네 연산을 골라 식을 세우고 답의 의미를 설명할 수 있나요?"
  ]);
  assert.deepEqual(await page.locator("#grade7-stage-questions .grade7-standard-code").allInnerTexts(), ["7.NS.A.1", "7.NS.A.2", "7.NS.A.2d", "7.NS.A.3"]);
  assert.equal(await page.locator("#grade7-stage-references a").count(), 3);
  assert.ok(await page.locator("#grade7-stage-references a").evaluateAll(function (nodes) { return nodes.every(function (node) { return node.getAttribute("aria-label").includes("새 창에서 열림") && parseFloat(getComputedStyle(node).minHeight) >= 44; }); }));
  assert.equal(await page.locator("#grade7-stage-references a").nth(0).getAttribute("href"), "https://www.thecorestandards.org/Math/Content/7/NS/");
  assert.match(await page.locator("#grade7-stage-resource").getAttribute("href"), /cluster=7.NS.A/);
  assert.match(await page.locator("#grade7-stage-resource").innerText(), /36문항/);
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
  await page.goto(`${url}?grade=7`, { waitUntil: "networkidle" });
  const cases = [
    { stage: 3, name: /살펴볼 지점 3, 식·방정식/, titles: ["Math 7 Unit 4 · 식과 분배법칙 ↗", "Unit 5 · 방정식 ↗", "Unit 6 · 여러 단계 방정식 ↗", "Unit 7 · 부등식 ↗"], urls: ["unit-4-expressions.html", "unit-5-equations.html", "unit-6-multiple-step-equations.html", "unit-7-inequalities.html"] },
    { stage: 4, name: /살펴볼 지점 4, 기하·혼합 문제/, titles: ["Math 7 Unit 13 · 닮음과 축척 ↗", "Unit 14 · 각과 삼각형 ↗", "Unit 15 · 원·넓이와 부피 ↗"], urls: ["unit-13-similarity.html", "unit-14-angles-and-triangles.html", "unit-15-area-and-volume.html"] }
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
    assert.deepEqual(links.map(function (link) { return new URL(link.href).pathname.split("/").pop(); }), item.urls);
    assert.ok(links.every(function (link) { return link.href.startsWith("https://math7.flippedmath.com/") && link.target === "_blank" && link.rel.includes("noopener"); }));
    const labels = await disclosure.locator("ul a").evaluateAll(function (nodes) { return nodes.map(function (node) { return node.getAttribute("aria-label"); }); });
    assert.ok(labels.every(function (label, index) { return label === `${item.titles[index].replace(" ↗", "")} (새 창에서 열림)`; }));
    assert.ok(await disclosure.locator("ul a").evaluateAll(function (nodes) { return nodes.every(function (node) { return parseFloat(getComputedStyle(node).minHeight) >= 44; }); }));
    if (item.name.toString().includes("식·방정식")) assert.match(await page.locator("#stage-copy").innerText(), /방정식·부등식/);
    if (item.name.toString().includes("기하·혼합")) assert.match(await page.locator("#stage-copy").innerText(), /닮음·각·삼각형·원·넓이·부피/);
    assert.equal(await page.locator("#grade7-no-resource").isVisible(), false);
    assert.equal(await disclosure.locator("ul").isVisible(), true);
    assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [390, 390]);
  }
  const upperGradeCases = [
    { grade: 8, button: /단계 1, 일차식·기하 점검 보기/, title: "FlippedMath Geometry ↗", url: "https://geometry.flippedmath.com/" },
    { grade: 8, button: /단계 3, 준비되면 심화 보기/, title: "FlippedMath Algebra 2 · 새 과정 ↗", url: "https://algebra2.flippedmath.com/" },
    { grade: 9, button: /단계 1, 빈 곳 메우기 보기/, title: "FlippedMath Algebra 2 · 새 과정 ↗", url: "https://algebra2.flippedmath.com/", inferred: true },
    { grade: 10, button: /단계 1, 개념 설명 보기/, title: "FlippedMath AP Precalculus ↗", url: "https://precalculus.flippedmath.com/ap-precalc.html" },
    { grade: 10, button: /단계 3, 필요한 실전 연습 보기/, titles: ["MAA 2027 AIME 응시 기준 ↗", "MAA AIME·USAJMO·USAMO 안내 ↗"], urls: ["https://maa.org/news/maa-announces-official-testing-centers-for-the-2027-american-invitational-mathematics-examination/", "https://maa.org/maa-invitational-competitions/"], note: true }
  ];
  for (const item of upperGradeCases) {
    await page.goto(`${url}?grade=${item.grade}`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: item.button }).click();
    if (item.inferred) assert.match(await page.locator("#source-chip").innerText(), /추정안/);
    const disclosure = page.locator("#stage-external-resources");
    assert.equal(await disclosure.isVisible(), true, `Grade ${item.grade} stage reference is visible`);
    await disclosure.locator("summary").click();
    assert.deepEqual(await disclosure.locator("ul a").allInnerTexts(), item.titles || [item.title]);
    assert.deepEqual(await disclosure.locator("ul a").evaluateAll(function (nodes) { return nodes.map(function (node) { return node.getAttribute("href"); }); }), item.urls || [item.url]);
    assert.ok(await disclosure.locator("ul a").evaluateAll(function (nodes) { return nodes.every(function (node) { return /새 창에서 열림/.test(node.getAttribute("aria-label")); }); }));
    if (item.inferred) assert.match(await disclosure.locator("#stage-external-resource-note").innerText(), /추정 경로.*학교의 실제 과목/);
    if (item.note) assert.match(await disclosure.locator("#stage-external-resource-note").innerText(), /미국·캐나다 AIME 기준.*다른 지역 규정/);
    if (item.grade === 10 && !item.note) assert.equal(await page.locator("#stage-external-resource-note").isVisible(), false);
    assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [390, 390]);
  }
  await page.close();
});

test("Grade 7 roadmap labels saved workbook practice as local activity, never a diagnosis",async function(){
  const page=await browser.newPage({viewport:{width:390,height:844}});
  await page.addInitScript(function(){localStorage.setItem("gfield-unit-workbook-progress:7.NS.A:v1",JSON.stringify({schemaVersion:1,packId:"gfield-grade7-ns-a-unit-workbook-v1",correctItemIds:["g7nsa-w01"],correctByStandard:{"7.NS.A.1":1,"7.NS.A.2":0,"7.NS.A.2d":0,"7.NS.A.3":0},totalByStandard:{"7.NS.A.1":18,"7.NS.A.2":14,"7.NS.A.2d":4,"7.NS.A.3":4}}));});
  await page.goto(`${url}?grade=7`,{waitUntil:"networkidle"});await page.getByRole("button",{name:/살펴볼 지점 1, 유리수/}).click();
  assert.equal(await page.locator("#grade7-stage-questions .grade7-practice-progress").count(),4);assert.match(await page.locator("#grade7-stage-questions .grade7-practice-progress").nth(0).innerText(),/이 기기 연습 · 맞힌 기록 1\/18 · 진단 아님/);assert.match(await page.locator("#grade7-stage-questions .grade7-practice-progress").nth(1).innerText(),/0\/14/);
  await page.getByRole("button",{name:/살펴볼 지점 2, 비례/}).click();assert.equal(await page.locator("#grade7-stage-questions .grade7-practice-progress").count(),0);await page.close();
});

test("map has no horizontal overflow at 390px and supports keyboard selection", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await page.goto(url, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".boarding-intro").isVisible(), true);
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [390, 390]);
  const gradeButton = page.getByRole("button", { name: "Grade 8 지도 보기" });
  await gradeButton.focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.locator("#grade-label").innerText(), "8학년");
  assert.equal(await gradeButton.evaluate(function (node) { return node === document.activeElement; }), true);
  await page.getByRole("button", { name: /단계 3/ }).click();
  assert.match(await page.locator("#stage-number").innerText(), /단계 3/);
  assert.equal(await page.getByRole("button", { name: /단계 3/ }).evaluate(function (node) { return node === document.activeElement; }), true);
  await page.close();
});

test("map reflows at small phone, tablet, and landscape widths", async function () {
  for (const size of [{ width: 375, height: 812 }, { width: 768, height: 1024 }, { width: 844, height: 390 }]) {
    const page = await browser.newPage({ viewport: size });
    await page.goto(url, { waitUntil: "networkidle" });
    const dimensions = await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; });
    assert.deepEqual(dimensions, [size.width, size.width], `overflow at ${size.width}`);
    await page.close();
  }
});

test("Grade 7 deep link keeps the concept path reachable at 320px", async function () {
  const page = await browser.newPage({ viewport: { width: 320, height: 844 } });
  await page.goto(`${url}?grade=7`, { waitUntil: "networkidle" });
  assert.ok(await page.locator(".grade7-path").evaluate(function (node) { return node.getBoundingClientRect().top < window.innerHeight; }));
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [320, 320]);
  assert.equal(await page.getByRole("link", { name: "개념 학습" }).isVisible(), true);
  await page.getByRole("button", { name: /살펴볼 지점 1, 유리수/ }).click();
  assert.ok(await page.locator(".stage-detail").evaluate(function (node) { const bounds = node.getBoundingClientRect(); return bounds.top >= 0 && bounds.bottom <= document.documentElement.scrollHeight; }));
  assert.equal(await page.locator("#grade7-stage-questions li").count(), 4);
  await page.close();
});

test("cross-grade concept flows render as examples on phone, tablet, and desktop widths", async function () {
  for (const width of [320, 390, 900, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 844 } });
    await page.goto(`${url}?grade=9`, { waitUntil: "networkidle" });
    assert.equal(await page.locator(".concept-flow").count(), 5);
    assert.equal(await page.locator(".concept-flow ol").count(), 5);
    assert.equal(await page.locator(".concept-flow ol li").count(), 26);
    const prealgebraFlow = page.locator('.concept-flow:has(h3:text("선택형 · 변수식에서 식 정리로"))');
    assert.equal(await page.locator(".concept-flow").first().getAttribute("aria-labelledby"), "prealgebra-algebra1-heading");
    assert.deepEqual(await page.locator(".concept-flow").nth(1).locator("li").allInnerTexts(), ["곱셈 구조", "분배법칙", "다항식 전개", "식 정리", "AMC 10 식 변형"]);
    assert.deepEqual(await prealgebraFlow.locator("li").allInnerTexts(), ["변수와 식 읽기", "말을 식으로 나타내기", "대입·거듭제곱·연산 순서", "연산 성질", "분배법칙", "동류항 정리"]);
    assert.equal(await prealgebraFlow.locator("ol").evaluate(function (node) { return getComputedStyle(node).gridTemplateColumns.split(" ").length; }), width <= 600 ? 1 : 6);
    const bridgeNote = prealgebraFlow.locator(".concept-flow-note");
    assert.match(await bridgeNote.innerText(), /Pre-Algebra와 Algebra 1.*학년 배치나 진단 결과가 아니에요/);
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
    assert.match(await studySequence.locator("h3").innerText(), /AMC·AIME 문제를 공부하는 순서/);
    assert.equal(await studySequence.locator("li").count(), 4);
    assert.deepEqual(await studySequence.locator("h4").allInnerTexts(), ["개념을 설명해요", "한 단원씩 연습해요", "개념을 섞어 풀어요", "기출로 시간 연습해요"]);
    assert.match(await studySequence.innerText(), /다른 방법도 있을까/);
    assert.match(await studySequence.innerText(), /막히면 표시하고 다음 문제로 넘어갔다 돌아와요/);
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

test("the same learning-world map frames every grade while phones keep the vertical path", async function () {
  const desktop = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  for (const grade of [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
    await desktop.goto(`${url}?grade=${grade}`, { waitUntil: "networkidle" });
    assert.equal(await desktop.locator("#stage-list button").count(), 4, `Grade ${grade} has four named route stops`);
    assert.ok(await desktop.locator("#stage-list button strong").allTextContents().then((labels) => labels.every((label) => label.trim())), `Grade ${grade} route labels are HTML text`);
    assert.match(await desktop.locator(".stage-map").evaluate((node) => getComputedStyle(node).backgroundImage), /mathematics-learning-world\.webp/, `Grade ${grade} uses the shared map scene`);
    await desktop.locator("#stage-list button").nth(1).click();
    assert.equal(await desktop.getByText("살펴보는 중", { exact: true }).count(), 1, `Grade ${grade} selected state is real DOM text`);
    assert.deepEqual(await desktop.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [1280, 1280], `Grade ${grade} has no horizontal overflow`);
  }
  await desktop.close();

  const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await phone.goto(`${url}?grade=8`, { waitUntil: "networkidle" });
  assert.doesNotMatch(await phone.locator(".stage-map").evaluate((node) => getComputedStyle(node).backgroundImage), /mathematics-learning-world\.webp/);
  assert.equal(await phone.locator("#stage-list").evaluate((node) => getComputedStyle(node).gridTemplateColumns.trim().split(/\s+/).length), 1);
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
    await page.goto(`${url}?grade=${grade}`, { waitUntil: "networkidle" });
    assert.match(await page.locator("#grade-focus-list").innerText(), expected, `Grade ${grade} shows its supplied books and study method`);
    assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [390, 390]);
    if (grade === "6") {
      assert.match(await page.locator("#annual-plan-title").innerText(), /선택 심화/);
      assert.match(await page.locator("#annual-plan-note").innerText(), /학교 수학에서 이미 배운 단원.*별도의 선택 심화/);
    }
  }
  await page.close();
});
