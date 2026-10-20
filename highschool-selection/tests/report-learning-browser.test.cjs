"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");
const { buildReport } = require("../server/report-builder.js");

const staticRoot = path.resolve(__dirname, "..");

function executablePath() {
  const candidates = [
    process.env.HIGHSELECT_BROWSER_EXECUTABLE,
    process.platform === "win32" ? "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe" : "",
    process.platform === "win32" ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" : "",
    process.platform === "win32" ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" : "",
    chromium && chromium.executablePath ? chromium.executablePath() : ""
  ].filter(Boolean);
  return candidates.find(candidate => fs.existsSync(candidate)) || null;
}

function startStaticServer() {
  const server = http.createServer((request, response) => {
    const url = new URL(request.url, "http://127.0.0.1");
    const relative = decodeURIComponent(url.pathname).replace(/^\/+/, "") || "report.html";
    const resolved = path.resolve(staticRoot, relative);
    if (resolved !== staticRoot && !resolved.startsWith(`${staticRoot}${path.sep}`)) return response.writeHead(403).end();
    if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) return response.writeHead(404).end();
    const mime = ({ ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8" })[path.extname(resolved)] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": mime, "Cache-Control": "no-store" });
    fs.createReadStream(resolved).pipe(response);
  });
  return new Promise(resolve => server.listen(0, "127.0.0.1", () => resolve({ server, base: `http://127.0.0.1:${server.address().port}` })));
}

function catalogScript(state) {
  const count = state.report.questionCount;
  const releaseStatus = state.catalogStatus || "released";
  return `window.HIGHSELECT_CATALOG={exams:[{id:"qa-report-exam",title:"합성 학습 진단 ${count}문항",questionCount:${count},programId:"SH",curriculumVersion:"2022-revised",releaseStatus:${JSON.stringify(releaseStatus)},answerStatus:"verified",classificationStatus:"verified"}]};`;
}

function syntheticReport(count, stateFor) {
  const items = Array.from({ length: count }, (_, index) => {
    const number = index + 1;
    const state = stateFor(number, count);
    return {
      number,
      state,
      classification: {
        points: [1, 2, 3, 4][index % 4],
        domain: index % 2 ? "대수" : "기하",
        gradeBand: index % 2 ? "중2" : "중3",
        semester: index % 2 ? "1학기" : "2학기",
        majorUnit: index % 2 ? "합성 대수 단원" : "합성 기하 단원",
        minorUnit: `합성 소단원 ${index % 3 + 1}`,
        detailType: `합성 유형 ${index % 4 + 1} · 여러 조건을 차례대로 확인하고 풀이의 근거를 설명하는 긴 유형명`,
        difficulty: ["lowered", "standard", "raised"][index % 3],
        evidence: ["synthetic-browser-qa"]
      }
    };
  });
  return buildReport({
    attemptId: `qa-report-${count}`,
    studentId: "synthetic-student",
    exam: { examId: "qa-report-exam", title: `합성 학습 진단 ${count}문항` },
    submittedAt: "2026-09-06T12:00:00.000Z",
    scored: { gradingVersion: "synthetic-browser-qa", items }
  });
}

function clone(value) { return JSON.parse(JSON.stringify(value)); }

async function installSyntheticRoutes(page, base, state) {
  await page.route(`${base}/shared/runtime.js`, route => route.fulfill({
    status: 200,
    contentType: "text/javascript; charset=utf-8",
    body: `window.HIGHSELECT_RUNTIME={apiBase:${JSON.stringify(base)}};`
  }));
  await page.route(`${base}/data/catalog.js`, route => route.fulfill({
    status: 200,
    contentType: "text/javascript; charset=utf-8",
    body: catalogScript(state)
  }));
  await page.route(`${base}/attempts/**/report`, async route => {
    state.requests.push({ method: route.request().method(), headers: route.request().headers() });
    if (state.mode === "hold") {
      await new Promise(resolve => { state.release = resolve; });
    }
    if (state.mode === "not-found") return route.fulfill({ status: 404, contentType: "application/json", headers: { "Cache-Control": "no-store" }, body: JSON.stringify({ message: "합성 성적표 미등록" }) });
    if (state.mode === "unavailable") return route.fulfill({ status: 503, contentType: "application/json", headers: { "Cache-Control": "no-store" }, body: JSON.stringify({ message: "합성 통신 점검" }) });
    const report = clone(state.report);
    report.displayName = "서버 확인 QA 학생";
    if (state.mode === "wrong-student") report.studentId = "another-synthetic-student";
    if (state.mode === "partial") report.items[0].earnedPoints = Math.max(0, report.items[0].points - 0.5);
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: { "Cache-Control": "private, no-store, max-age=0" },
      body: JSON.stringify(report)
    });
  });
}

async function seedSyntheticStudent(page) {
  await page.addInitScript(() => {
    localStorage.setItem("highselect-session-v1", JSON.stringify({
      name: "합성 QA 학생", studentId: "synthetic-student", role: "student", access: [], issuedAt: new Date().toISOString()
    }));
  });
}

function reportUrl(base, count) { return `${base}/report.html?attempt=qa-report-${count}`; }

function assertEvidenceDirectory() {
  if (!process.env.HIGHSELECT_REPORT_QA_DIR) return null;
  const destination = path.resolve(process.env.HIGHSELECT_REPORT_QA_DIR);
  assert.ok(path.isAbsolute(process.env.HIGHSELECT_REPORT_QA_DIR), "Provide an absolute private QA directory.");
  assert.ok(destination !== staticRoot && !destination.startsWith(`${staticRoot}${path.sep}`), "QA output must stay outside the public repository.");
  if (process.platform === "win32") assert.equal(path.parse(destination).root.toUpperCase(), "G:\\", "Use the designated private data drive.");
  fs.mkdirSync(destination, { recursive: true });
  return destination;
}

test("synthetic released report has the personal score path, three stages, and usable desktop/mobile layout", async t => {
  const browserBinary = executablePath();
  assert.ok(browserBinary, "Chromium is required; run npm run install:browser in highschool-selection");
  const fixture = await startStaticServer();
  t.after(() => fixture.server.close());
  const browser = await chromium.launch({ headless: true, executablePath: browserBinary });
  t.after(() => browser.close());
  const state = { report: syntheticReport(10, number => number % 3 === 1 ? "wrong" : "correct"), mode: "hold", requests: [], catalogStatus: "released", release: null };
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  t.after(() => context.close());
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error" && !/^Failed to load resource:/.test(message.text())) errors.push(message.text()); });
  await seedSyntheticStudent(page);
  await installSyntheticRoutes(page, fixture.base, state);
  await page.goto(reportUrl(fixture.base, 10));
  await page.locator("#report-root[aria-busy=true]").waitFor();
  assert.equal(await page.locator("#report-print").isDisabled(), true);
  state.mode = "success";
  state.release();
  await page.locator(".learning-plan").waitFor({ state: "visible" });
  assert.match(await page.locator("#meta").textContent(), /서버 확인 QA 학생/);
  assert.doesNotMatch(await page.locator("#meta").textContent(), /합성 QA 학생/);
  assert.equal(await page.locator("#report-print").isEnabled(), true);
  assert.equal(await page.locator(".weighted-results").count(), 1);
  assert.match(await page.locator(".weighted-results").textContent(), /영역별 수행률.*배점 기준.*영역별 득점률.*득점/s);
  assert.equal(await page.locator(".point-band-results + .item-detail").count(), 1);
  assert.equal(await page.locator(".diagnostic-items tbody tr").count(), 10);
  assert.match(await page.locator(".item-detail").textContent(), /문항 정답률.*미등록/s);
  assert.equal(await page.locator(".review-first").count(), 3);
  assert.equal(await page.locator(".priority-mark").count(), 3);
  assert.equal(await page.locator(".learning-stage").count(), 3);
  assert.equal(await page.locator(".goal-chart .goal-row").count(), 2);
  assert.match(await page.locator(".learning-plan").textContent(), /낮은 배점이 쉬운 문제라는 뜻은 아닙니다/);
  assert.match(await page.locator(".goal-chart").textContent(), /같은 눈금: 0~.*현재 성적은 바뀌지 않습니다/s);
  assert.equal(await page.locator(".report-print-watermark").count(), 1);
  assert.equal(await page.locator('a[href*="similar"], a[href*="qa-report"], a[href*="synthetic"]' ).count(), 0);
  assert.equal(await page.evaluate(() => /answer|sourcePath|synthetic-browser-qa|qa-report-exam/i.test(document.body.innerText)), false);
  assert.deepEqual(state.requests.map(request => request.method), ["GET"]);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  await page.locator(".table-scroll").first().focus();
  assert.equal(await page.evaluate(() => document.activeElement.classList.contains("table-scroll")), true);
  await page.keyboard.press("Tab");
  assert.notEqual(await page.evaluate(() => document.activeElement === document.body), true);
  const evidenceDir = assertEvidenceDirectory();
  if (evidenceDir) await page.screenshot({ path: path.join(evidenceDir, "synthetic-report-desktop.png"), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  if (evidenceDir) {
    await page.screenshot({ path: path.join(evidenceDir, "synthetic-report-mobile.png"), fullPage: true });
    for (const [label, selector] of [["top", ".page-title"], ["items", ".item-detail"], ["plan", ".learning-plan"]]) {
      await page.locator(selector).evaluate(element => window.scrollTo(0, window.scrollY + element.getBoundingClientRect().top));
      await page.screenshot({ path: path.join(evidenceDir, `synthetic-report-mobile-${label}.png`), fullPage: false });
    }
  }
  assert.deepEqual(errors, []);
});

test("synthetic zero, perfect, unavailable, unregistered, invalid student, pending review, and partial-score reports fail closed", async t => {
  const browserBinary = executablePath();
  assert.ok(browserBinary, "Chromium is required; run npm run install:browser in highschool-selection");
  const fixture = await startStaticServer();
  t.after(() => fixture.server.close());
  const browser = await chromium.launch({ headless: true, executablePath: browserBinary });
  t.after(() => browser.close());
  const state = { report: syntheticReport(10, () => "wrong"), mode: "success", requests: [], catalogStatus: "released" };
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  t.after(() => context.close());
  const page = await context.newPage();
  await seedSyntheticStudent(page);
  await installSyntheticRoutes(page, fixture.base, state);

  await page.goto(reportUrl(fixture.base, 10));
  await page.locator(".learning-plan").waitFor();
  assert.match(await page.locator(".goal-chart").textContent(), /현재 점수.*0\s*\/.*점/s);
  assert.equal(await page.locator(".goal-chart .goal-row").count(), 2);
  assert.equal(await page.locator(".review-first").count(), 3);

  state.report = syntheticReport(10, () => "correct");
  await page.goto(reportUrl(fixture.base, 10));
  await page.locator(".learning-plan").waitFor();
  assert.equal(await page.locator(".review-first").count(), 0);
  assert.equal(await page.locator(".goal-chart .goal-row").count(), 1);
  assert.equal(await page.locator("#report-print").isEnabled(), true);

  state.mode = "not-found";
  await page.goto(reportUrl(fixture.base, 10));
  await page.locator("#report-root .empty").waitFor();
  assert.match(await page.locator("#report-root").textContent(), /아직 등록되지 않았습니다/);
  assert.equal(await page.locator("#report-print").isDisabled(), true);
  assert.equal(await page.locator("#report-retry").count(), 1);

  state.mode = "unavailable";
  await page.goto(reportUrl(fixture.base, 10));
  await page.locator("#report-retry").waitFor();
  assert.match(await page.locator("#report-root").textContent(), /합성 통신 점검/);
  state.mode = "success";
  await page.locator("#report-retry").click();
  await page.locator(".learning-plan").waitFor();
  assert.equal(await page.locator("#report-print").isEnabled(), true);

  state.mode = "wrong-student";
  await page.goto(reportUrl(fixture.base, 10));
  await page.locator("#report-root .empty").waitFor();
  assert.equal(await page.locator("#report-print").isDisabled(), true);
  assert.equal(await page.locator(".learning-plan").count(), 0);

  state.mode = "success";
  state.catalogStatus = "review_pending";
  await page.goto(reportUrl(fixture.base, 10));
  await page.locator("#report-root .empty").waitFor();
  assert.match(await page.locator("#report-root").textContent(), /검수가 완료되지 않은 시험/);
  assert.equal(await page.locator("#report-print").isDisabled(), true);

  state.catalogStatus = "released";
  state.mode = "partial";
  state.report = syntheticReport(10, number => number === 1 ? "correct" : "wrong");
  await page.goto(reportUrl(fixture.base, 10));
  await page.locator("#report-root .empty").waitFor();
  assert.match(await page.locator("#report-root").textContent(), /부분점수 채점 규칙/);
  assert.equal(await page.locator("#report-print").isDisabled(), true);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
});

test("blank answers remain distinct from wrong answers on desktop, phone, and print layout", async t => {
  const browserBinary = executablePath();
  assert.ok(browserBinary, "Chromium is required; run npm run install:browser in highschool-selection");
  const fixture = await startStaticServer();
  t.after(() => fixture.server.close());
  const browser = await chromium.launch({ headless: true, executablePath: browserBinary });
  t.after(() => browser.close());
  const state = { report: syntheticReport(10, number => number % 3 === 0 ? "wrong" : number % 3 === 2 ? "blank" : "correct"),
    mode: "success", requests: [], catalogStatus: "released" };
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  t.after(() => context.close());
  const page = await context.newPage();
  await seedSyntheticStudent(page);
  await installSyntheticRoutes(page, fixture.base, state);
  await page.goto(reportUrl(fixture.base, 10));
  await page.locator(".learning-plan").waitFor();
  assert.equal(await page.locator(".item-dot.blank").count(), 3);
  assert.equal(await page.locator(".item-dot.blank[aria-label='2번 미응시']").count(), 1);
  assert.equal(await page.locator(".review-first").count(), 3);
  assert.deepEqual(await page.locator(".score-facts b").allTextContents(), ["맞힌 문항 비율 40%", "정답 4", "오답 3", "미응시 3"]);
  assert.match(await page.locator(".report-comments").textContent(), /미응시 문항은 오답 유형으로 판단하지 않았습니다/);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  assert.equal(await page.locator(".diagnostic-items tbody tr").nth(1).locator("[data-label='결과'] b").textContent(), "—");
  await page.emulateMedia({ media: "print" });
  await page.setViewportSize({ width: 794, height: 1123 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  assert.equal(await page.locator(".item-dot.blank").count(), 3);
});

test("optional A4 evidence uses a 40-item synthetic report and only the approved destination", async t => {
  const evidenceDir = assertEvidenceDirectory();
  if (!evidenceDir) { t.skip("Set HIGHSELECT_REPORT_QA_DIR to inspect actual PDF output."); return; }
  const browserBinary = executablePath();
  assert.ok(browserBinary, "Chromium is required; run npm run install:browser in highschool-selection");
  const fixture = await startStaticServer();
  t.after(() => fixture.server.close());
  const browser = await chromium.launch({ headless: true, executablePath: browserBinary });
  t.after(() => browser.close());
  const state = { report: syntheticReport(40, number => number % 5 === 0 ? "blank" : number % 4 === 0 ? "wrong" : "correct"), mode: "success", requests: [], catalogStatus: "released" };
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  t.after(() => context.close());
  const page = await context.newPage();
  await seedSyntheticStudent(page);
  await installSyntheticRoutes(page, fixture.base, state);
  await page.goto(reportUrl(fixture.base, 40));
  await page.locator(".learning-plan").waitFor();
  assert.equal(await page.locator(".diagnostic-items tbody tr").count(), 40);
  assert.equal(await page.locator(".item-dot.blank").count(), 8);
  await page.screenshot({ path: path.join(evidenceDir, "synthetic-report-40-desktop.png"), fullPage: true });
  await page.emulateMedia({ media: "print" });
  await page.setViewportSize({ width: 794, height: 1123 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  await page.pdf({ path: path.join(evidenceDir, "synthetic-report-40-a4.pdf"), format: "A4", printBackground: true, preferCSSPageSize: true });
});
