"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const test = require("node:test");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..", "..");
let server, browser, baseUrl;
function type(file) { return file.endsWith(".html") ? "text/html; charset=utf-8" : file.endsWith(".css") ? "text/css; charset=utf-8" : "text/javascript; charset=utf-8"; }
function errorsFor(page) {
  const errors = [];
  page.on("pageerror", function (error) { errors.push(error.message); });
  page.on("console", function (message) { if (message.type() === "error") errors.push(message.text()); });
  return errors;
}

test.before(async function () {
  server = http.createServer(function (request, response) {
    const file = path.resolve(root, `.${decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname)}`);
    if (!file.startsWith(root) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404); response.end(); return; }
    response.writeHead(200, { "content-type": type(file) }); fs.createReadStream(file).pipe(response);
  });
  await new Promise(function (resolve) { server.listen(0, "127.0.0.1", resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}/boarding-school-math/`;
  browser = await chromium.launch({ headless: true });
});
test.after(async function () { if (browser) await browser.close(); if (server) await new Promise(function (resolve) { server.close(resolve); }); });

test("assessment history is stored on device and only matching grade is restored", async function () {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const page = await context.newPage();
  const errors = errorsFor(page);
  await page.addInitScript(function () {
    window.__scrollIntoViewCalls = 0;
    Element.prototype.scrollIntoView = function () { window.__scrollIntoViewCalls += 1; };
  });
  await page.goto(`${baseUrl}assessment-entry.html?grade=7`, { waitUntil: "networkidle" });
  await page.locator("#overall-percent").fill("82");
  await page.locator("#evidence-form").evaluate(function (form) { form.requestSubmit(); });
  await page.waitForFunction(function () { return document.getElementById("result-announcement").textContent.includes("비교 결과를 계산했어요"); });
  await page.goto(`${baseUrl}assessment-entry.html?grade=8`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#result-content").isVisible(), false);
  await page.locator("#overall-percent").fill("76");
  await page.locator("#evidence-form").evaluate(function (form) { form.requestSubmit(); });
  await page.waitForFunction(function () { return document.getElementById("result-announcement").textContent.includes("평가 기록 2개가 이 기기에 저장되어 있어요"); });
  assert.equal(await page.locator(".assessment-history-item").count(), 2);
  const historyText = await page.locator("#assessment-history-list").innerText();
  assert.match(historyText, /Grade 7[\s\S]*82%/);
  assert.match(historyText, /Grade 8[\s\S]*76%/);
  await page.goto(`${baseUrl}assessment-entry.html?grade=7`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#result-content").isVisible(), true);
  assert.equal(await page.evaluate(function () { return window.__scrollIntoViewCalls; }), 0, "restoring saved evidence should not scroll past the page introduction");
  assert.equal(await page.locator(".result-panel").getAttribute("aria-live"), null);
  assert.equal(await page.locator("#result-announcement").getAttribute("role"), "status");
  assert.match(await page.locator("#result-announcement").innerText(), /저장한 평가 결과를 불러왔어요.*Grade 7/);
  assert.equal(await page.locator("#result-source").innerText(), "학교 수학 Placement Test · Grade 7");
  assert.match(await page.locator("#metric-value").innerText(), /82%/);
  for (const action of ["#send-to-plan", "#open-material"]) {
    assert.equal(await page.locator(action).getAttribute("href"), null);
    assert.equal(await page.locator(action).getAttribute("aria-disabled"), "true");
    assert.equal(await page.locator(action).evaluate(function (node) { return node.tabIndex; }), -1);
  }
  assert.match(await page.locator(".evidence-roles").innerText(), /개인 진단은 아직 검수 중.*자동 배정하지 않습니다/);
  const routeBeforeDisabledClick = page.url();
  assert.equal(await page.locator("#open-material").evaluate(function (node) { return getComputedStyle(node).pointerEvents; }), "none");
  await page.locator("#open-material").evaluate(function (node) { node.click(); });
  assert.equal(page.url(), routeBeforeDisabledClick, "a gated action cannot jump to the page top");
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [390, 390]);
  page.once("dialog", function (dialog) { dialog.dismiss(); });
  await page.locator("#clear-assessment-history").click();
  assert.equal(await page.locator(".assessment-history-item").count(), 2, "cancel keeps all saved grade records");
  assert.equal(await page.locator("#result-content").isVisible(), true);
  page.once("dialog", function (dialog) { dialog.accept(); });
  await page.locator("#clear-assessment-history").click();
  assert.equal(await page.locator(".assessment-history-item").count(), 0);
  assert.equal(await page.evaluate(function () { return [localStorage.getItem("gmap-local-learning-record-v1:external-assessment"), localStorage.getItem("gmap-local-learning-record-v1:external-assessment-history")]; }).then(function (keys) { return keys.every(function (entry) { return entry === null; }); }), true);
  assert.equal(await page.locator("#result-content").isVisible(), false);
  assert.equal(await page.locator("#assessment-history-empty").isVisible(), true);
  await page.waitForFunction(function () { return document.getElementById("result-announcement").textContent.includes("평가 기록을 모두 지웠어요"); });
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator("#result-content").isVisible(), false, "cleared results do not return after reload");
  assert.deepEqual(errors, []);
  await context.close();
});

test("assessment entry restores the latest saved result when no grade is requested", async function () {
  const page = await browser.newPage();
  await page.goto(`${baseUrl}assessment-entry.html?grade=7`, { waitUntil: "networkidle" });
  await page.locator("#overall-percent").fill("84");
  await page.locator("#evidence-form").evaluate(function (form) { form.requestSubmit(); });
  await page.goto(`${baseUrl}assessment-entry.html`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#grade").inputValue(), "7");
  assert.equal(await page.locator("#result-content").isVisible(), true);
  assert.match(await page.locator("#metric-value").innerText(), /84%/);
  assert.match(await page.locator("#result-announcement").innerText(), /저장한 평가 결과를 불러왔어요.*Grade 7/);
  await page.close();
});

test("ISEE stanines survive save, history rendering, and reload", async function () {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const page = await context.newPage();
  const errors = errorsFor(page);
  await page.goto(`${baseUrl}assessment-entry.html?grade=7`, { waitUntil: "networkidle" });
  await page.locator("#source-id").selectOption("isee");
  await page.locator("#test-level").selectOption("isee-middle");
  await page.locator("#quant-stanine").fill("7");
  await page.locator("#math-stanine").fill("6");
  await page.locator("#evidence-form").evaluate(function (form) { form.requestSubmit(); });
  assert.match(await page.locator("#metric-value").innerText(), /Quantitative Reasoning 7 · Mathematics Achievement 6 stanine/);
  assert.match(await page.locator("#confidence-value").innerText(), /ISEE Middle · 입학 평가 보조 근거/);
  assert.match(await page.locator("#assessment-history-list").innerText(), /ISEE Middle.*Quantitative Reasoning 7.*Mathematics Achievement 6 stanine/);
  await page.reload({ waitUntil: "networkidle" });
  assert.match(await page.locator("#metric-value").innerText(), /Quantitative Reasoning 7 · Mathematics Achievement 6 stanine/);
  assert.match(await page.locator("#assessment-history-list").innerText(), /ISEE Middle/);
  assert.equal(await page.locator("#quant-stanine").inputValue(), "7");
  assert.equal(await page.locator("#math-stanine").inputValue(), "6");
  assert.equal(await page.locator("#test-level").inputValue(), "isee-middle");
  assert.doesNotMatch(await page.locator("#assessment-history-list").innerText(), /undefined/);
  assert.deepEqual(await page.locator("#test-level option").allTextContents(), ["성적표에서 선택", "ISEE Primary 2", "ISEE Primary 3", "ISEE Primary 4", "ISEE Lower", "ISEE Middle", "ISEE Upper"]);
  await page.locator("#source-id").selectOption("ssat");
  assert.deepEqual(await page.locator("#test-level option").allTextContents(), ["성적표에서 선택", "SSAT Elementary · Grade 3", "SSAT Elementary · Grade 4", "SSAT Middle", "SSAT Upper"]);
  assert.equal(await page.locator("#test-level").inputValue(), "");
  assert.equal(await page.locator("#test-level").getAttribute("required"), "");
  assert.deepEqual(errors, []);
  await context.close();
});

test("school placement evidence remains descriptive and carries no automated weakness into today's plan", async function () {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const errors = errorsFor(page);
  await page.goto(`${baseUrl}assessment-entry.html?grade=6`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#grade").inputValue(), "6");
  assert.equal(await page.locator('[data-sources="map-growth"]#season').isVisible(), false);
  await page.locator("#overall-percent").fill("82");
  await page.locator("#school-cut").fill("80");
  await page.locator('[data-domain="number"]').fill("88");
  await page.locator('[data-domain="proportional"]').fill("84");
  await page.locator('[data-domain="algebra"]').fill("78");
  await page.locator('[data-domain="geometry"]').fill("61");
  await page.locator('[data-domain="reasoning"]').fill("74");
  await page.locator("#evidence-form").evaluate(function (form) { form.requestSubmit(); });
  assert.equal(await page.locator("#recommended-course").innerText(), "Pre-Algebra");
  assert.match(await page.locator("#priority-list").innerText(), /기하·측정[\s\S]*61%/);
  assert.match(await page.locator("#recommendation-reason").innerText(), /컷 충족만 표시하며 G·MAP 준비도나 배정을 판정하지 않습니다/);
  assert.match(await page.locator("#decision-notice").innerText(), /사용자가 입력한 과정의 비교 자료/);
  assert.match(await page.locator("#decision-notice").innerText(), /공식 배정/);
  assert.notEqual(await page.locator("#send-to-plan").getAttribute("aria-disabled"), "true");
  const stored = await page.evaluate(function () { return JSON.parse(localStorage.getItem("gmap-local-learning-record-v1:external-assessment")); });
  assert.equal(stored.officialPlacement, false);
  assert.equal(stored.primaryPriority, null);
  assert.deepEqual(stored.priorityDomains, []);
  await page.locator("#send-to-plan").click();
  await page.waitForURL(/learning-plan\.html/);
  assert.equal(await page.locator("#plan-state").innerText(), "학교 평가 연결");
  assert.match(await page.locator("#today-description").innerText(), /외부 성적표만으로 약점이나 배정을 자동 판정하지 않습니다/);
  assert.match(await page.locator("#prediction-copy").innerText(), /직접 선택/);
  assert.equal(await page.locator("#study-days").inputValue(), "4");
  assert.equal(await page.locator("#minutes-per-day").inputValue(), "45");
  assert.deepEqual(errors, []);
  await context.close();
});

test("high-school elective comparison records only the chosen courses and avoids Grade 6 domain tags", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  const errors = errorsFor(page);
  await page.goto(`${baseUrl}assessment-entry.html?grade=12`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#grade").inputValue(), "12");
  assert.match(await page.locator(".course-choice-note").innerText(), /과목 순서는 학교마다 달라요/);
  const target = page.locator("#target-course");
  const labels = await target.locator("option").allTextContents();
  assert.ok(labels.some(function (label) { return /Statistics · 고등학교 선택 과목 · 학교별/.test(label); }));
  assert.ok(labels.some(function (label) { return /Calculus · 고등학교 선택 과목 · 학교별/.test(label); }));
  await page.locator("#current-course").selectOption("algebra-2");
  await target.selectOption("statistics");
  await page.locator("#overall-percent").fill("82");
  await page.locator('[data-domain="data"]').fill("61");
  await page.locator("#evidence-form").evaluate(function (form) { form.requestSubmit(); });
  assert.equal(await page.locator(".course-route span").count(), 2);
  assert.match(await page.locator("#course-route").innerText(), /현재 선택 · Algebra 2[\s\S]*비교 목표 · Statistics/);
  assert.doesNotMatch(await page.locator("#course-route").innerText(), /Precalculus|Calculus/);
  assert.match(await page.locator("#priority-list").innerText(), /자료·확률[\s\S]*성적표 입력값/);
  assert.doesNotMatch(await page.locator("#priority-list").innerText(), /6\.SP\.A/);
  assert.equal(await page.locator("#recommended-course").innerText(), "Algebra 2");
  const saved = await page.evaluate(function () { return JSON.parse(localStorage.getItem("gmap-local-learning-record-v1:external-assessment")); });
  assert.equal(saved.targetCourse.id, "statistics");
  assert.equal(saved.domainComparisons[0].clusterId, null);
  assert.deepEqual(errors, []);
  await page.close();
});

test("assessment entry keeps MAP metrics distinct and locks unverified grades on mobile and print", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  const errors = errorsFor(page);
  await page.goto(`${baseUrl}assessment-entry.html?grade=7`, { waitUntil: "networkidle" });
  await page.locator("#source-id").selectOption("map-growth");
  assert.equal(await page.locator("#overall-percent").isEnabled(), false);
  assert.equal(await page.locator("#overall-percent").inputValue(), "");
  assert.equal(await page.locator("#rit").isVisible(), true);
  await page.locator("#rit").fill("218");
  await page.locator("#percentile").fill("64");
  await page.locator("#season").selectOption("fall");
  await page.locator("#norm-year").selectOption("2025");
  await page.locator("#instructional-weeks").fill("4");
  await page.locator("#current-course").selectOption("pre-algebra");
  await page.locator("#target-course").selectOption("algebra-1");
  await page.locator("#evidence-form").evaluate(function (form) { form.requestSubmit(); });
  assert.match(await page.locator("#metric-value").innerText(), /RIT 218/);
  assert.match(await page.locator("#metric-value").innerText(), /64th percentile/);
  assert.match(await page.locator("#confidence-value").innerText(), /2025 norms · Fall · 4 instructional weeks/);
  const stored = await page.evaluate(function () { return JSON.parse(localStorage.getItem("gmap-local-learning-record-v1:external-assessment")); });
  assert.equal(stored.scores.normYear, "2025");
  assert.equal(stored.scores.instructionalWeeks, 4);
  assert.match(await page.locator("#recommendation-reason").innerText(), /점수 구간·준비도/);
  assert.equal(await page.locator("#send-to-plan").getAttribute("aria-disabled"), "true");
  assert.equal(await page.locator("#published-resource").isVisible(), true);
  assert.match(await page.locator("#published-resource").getAttribute("href"), /catalog\.html\?role=student&grade=7/);
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [390, 390]);
  await page.emulateMedia({ media: "print" });
  assert.equal(await page.locator("#evidence-form").evaluate(function (node) { return getComputedStyle(node).display; }), "none");
  assert.deepEqual(errors, []);
  await page.close();
});

test("saved MAP v2 evidence restores while clearly marking missing norm comparison context", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.addInitScript(function () {
    localStorage.setItem("gmap-local-learning-record-v1:external-assessment", JSON.stringify({
      schemaVersion: "gfield-external-math-evidence-v2", source: { id: "map-growth", label: "NWEA MAP Growth Math", role: "instructional-growth" },
      testDate: "2026-09-01", grade: 7, band: null, confidence: "not-calculated", placementState: "school-policy-required", officialPlacement: false,
      currentCourse: { id: "pre-algebra", label: "Pre-Algebra", publicLearning: true }, recommendedStart: { id: "pre-algebra", label: "Pre-Algebra", publicLearning: true }, targetCourse: { id: "algebra-1", label: "Algebra 1" },
      scores: { metric: 64, metricLabel: "성취 백분위", rit: 218, percentile: 64, season: "fall" }, primaryPriority: null, priorityDomains: [], domainComparisons: [], plan: {}, materialState: null, decisionNotice: "사용자 입력"
    }));
  });
  await page.goto(`${baseUrl}assessment-entry.html?grade=7`, { waitUntil: "networkidle" });
  assert.match(await page.locator("#metric-value").innerText(), /RIT 218.*64th percentile/);
  assert.equal(await page.locator("#norm-year").inputValue(), "");
  assert.equal(await page.locator("#instructional-weeks").inputValue(), "");
  assert.match(await page.locator("#legacy-evidence-note").innerText(), /규준 연도와 시험 전 수업 주차가 없어/);
  await page.close();
});

test("ISEE stanines stay separate instead of becoming an invented average", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = errorsFor(page);
  await page.goto(`${baseUrl}assessment-entry.html?grade=7`, { waitUntil: "networkidle" });
  await page.locator("#source-id").selectOption("isee");
  await page.locator("#test-level").selectOption("isee-middle");
  await page.locator("#quant-stanine").fill("9");
  await page.locator("#math-stanine").fill("8");
  await page.locator("#evidence-form").evaluate(function (form) { form.requestSubmit(); });
  assert.match(await page.locator("#metric-value").innerText(), /Quantitative Reasoning 9 · Mathematics Achievement 8 stanine/);
  assert.doesNotMatch(await page.locator("#metric-value").innerText(), /평균|8\.5/);
  assert.equal(await page.locator("#confidence-value").innerText(), "ISEE Middle · 입학 평가 보조 근거");
  assert.deepEqual(errors, []);
  await page.close();
});

test("legacy MAP summary restores only report values and asks for missing comparison context", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = errorsFor(page);
  await page.addInitScript(function () {
    localStorage.setItem("gmap-local-learning-record-v1:external-assessment", JSON.stringify({
      schemaVersion: "gfield-external-math-evidence-v1",
      source: { id: "map-growth", label: "NWEA MAP Growth Math", role: "instructional-growth" },
      testDate: "2026-09-01", grade: 7,
      scores: { metric: 93, metricLabel: "성취 백분위", rit: 242, percentile: 93, schoolCut: null, clearsEnteredCut: null },
      recommendedStart: { id: "algebra-1", label: "Algebra 1", publicLearning: false },
      targetCourse: { id: "geometry", label: "Geometry" },
      primaryPriority: { label: "기하·측정", axis: "geometry-spatial", clusterId: "6.G.A", percent: 48 },
      plan: { weeks: 6, studyDaysPerWeek: 3, minutesPerDay: 45, problemCountPerDay: 12 },
      materialState: "verified-grade6-public-materials"
    }));
  });
  await page.goto(`${baseUrl}assessment-entry.html?grade=7`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#source-id").inputValue(), "map-growth");
  assert.equal(await page.locator("#grade").inputValue(), "7");
  assert.equal(await page.locator("#rit").inputValue(), "242");
  assert.equal(await page.locator("#percentile").inputValue(), "93");
  assert.equal(await page.locator("#result-content").isHidden(), true);
  assert.match(await page.locator("#legacy-evidence-note").innerText(), /시험 시기·규준집단, 현재·목표 과정/);
  assert.match(await page.locator("#legacy-evidence-note").innerText(), /준비도·약점 판정은 복원하지 않았습니다/);
  assert.deepEqual(errors, []);
  await page.close();
});

test("legacy ISEE average is not restored as either reported stanine", async function () {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.addInitScript(function () {
    localStorage.setItem("gmap-local-learning-record-v1:external-assessment", JSON.stringify({
      schemaVersion: "gfield-external-math-evidence-v1",
      source: { id: "isee", label: "ISEE Quantitative / Mathematics", role: "admission-support" },
      testDate: "2026-09-01", grade: 7,
      scores: { metric: 8.5, metricLabel: "수학 stanine", stanine: 8.5 },
      recommendedStart: { id: "pre-algebra", label: "Pre-Algebra", publicLearning: true },
      targetCourse: { id: "algebra-1", label: "Algebra 1" },
      plan: { weeks: 6, studyDaysPerWeek: 3, minutesPerDay: 45, problemCountPerDay: 12 }
    }));
  });
  await page.goto(`${baseUrl}assessment-entry.html?grade=7`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#source-id").inputValue(), "isee");
  assert.equal(await page.locator("#quant-stanine").inputValue(), "");
  assert.equal(await page.locator("#math-stanine").inputValue(), "");
  assert.match(await page.locator("#legacy-evidence-note").innerText(), /평균 하나로 합쳐져 있어 복원하지 않았습니다/);
  await page.close();
});
