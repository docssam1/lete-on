"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const test = require("node:test");
const { chromium } = require("playwright");
const catalog = require("../competition/sasmo-mock-catalog.js");
const privateStudio = require("../scripts/serve-private-sasmo-studio.cjs");

const root = path.resolve(__dirname, "..", "..");
let server;
let browser;
let baseUrl;
const privatePaper = process.env.GFIELD_SASMO_2019_G6_PDF;
const privatePack = process.env.GFIELD_SASMO_2019_G6_PACK;
const hasPrivatePaper = Boolean(privatePaper && fs.existsSync(privatePaper) && privatePack && fs.existsSync(privatePack));
const privateStudentReview = process.env.GFIELD_SASMO_2019_G6_STUDENT_REVIEW;
const privateTeacherReview = process.env.GFIELD_SASMO_2019_G6_TEACHER_REVIEW;
const hasPrivateStudio = Boolean(hasPrivatePaper && privateStudentReview && fs.existsSync(privateStudentReview) && privateTeacherReview && fs.existsSync(privateTeacherReview));

function type(file) {
  if (file.endsWith(".html")) return "text/html; charset=utf-8";
  if (file.endsWith(".css")) return "text/css; charset=utf-8";
  if (file.endsWith(".json")) return "application/json; charset=utf-8";
  return "text/javascript; charset=utf-8";
}

function verifiedPack() {
  const form = catalog.getForm("sasmo-2019-g6-baseline-a");
  return {
    schemaVersion: "gfield-private-sasmo-diagnostic-v2",
    paper: {
      programId: "sasmo",
      year: 2019,
      levelId: "G6",
      sourceType: "third-party-public-reference",
      sourcePageUrl: "https://www.k12mathcontests.com/download/sasmo/2019/primary6",
      sourceFingerprintSha256: form.sourceFingerprintSha256,
      rightsState: "private-reference-only"
    },
    items: form.items.map(function (entry, index) {
      const multipleChoice = index < 15;
      return {
        itemId: `sasmo-2019-g6-q${String(index + 1).padStart(2, "0")}`,
        sourceLocator: `private question ${index + 1}`,
        axisId: entry.axisId,
        skillId: entry.skillId,
        responseType: multipleChoice ? "multiple-choice" : "numeric-exact",
        primaryErrorType: "reasoning-error",
        answerProof: { answerProof: "published-solution-plus-independent", publishedSolutionLocator: `private solution ${index + 1}`, independentSolveMethod: "independent check", independentSolveConfirmed: true },
        privateScoring: { answerKind: multipleChoice ? "option-id" : "numeric-exact", answerValue: multipleChoice ? "B" : String(index + 1) }
      };
    })
  };
}

test.before(async function () {
  server = http.createServer(function (request, response) {
    const file = path.resolve(root, `.${decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname)}`);
    if (!file.startsWith(root) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404); response.end(); return; }
    response.writeHead(200, { "content-type": type(file) });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise(function (resolve) { server.listen(0, "127.0.0.1", resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}/boarding-school-math/`;
  browser = await chromium.launch({ headless: true });
});

test.after(async function () {
  await browser.close();
  await new Promise(function (resolve) { server.close(resolve); });
});

test("a verified local paper scores in-browser, stores only answer-safe evidence, and drives the learning plan", { skip: !hasPrivatePaper }, async function () {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}sasmo-real-paper.html`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#score-button").isDisabled(), true);
  const pack = JSON.parse(fs.readFileSync(privatePack, "utf8"));
  await page.locator("#pack-file").setInputFiles(privatePack);
  assert.equal(await page.locator("#score-button").isDisabled(), true);
  await page.locator("#paper-file").setInputFiles(privatePaper);
  await page.locator("#source-state[data-state=ready]").waitFor();
  assert.match(await page.locator(".intro-copy").innerText(), /제3자 공개 보관본/);
  assert.match(await page.locator("#source-state p").innerText(), /제3자 공개 보관본의 파일 지문/);
  assert.equal(await page.locator("#paper-empty").isVisible(), false);
  assert.equal(await page.locator("#pdf-stage").isVisible(), true);
  assert.equal(await page.locator("#score-button").isEnabled(), true);
  for (let number = 1; number <= 15; number += 1) await page.locator(`label:has(input[name=q${number}][value=${pack.items[number - 1].privateScoring.answerValue}])`).click();
  for (let number = 16; number <= 25; number += 1) await page.locator(`input[name=q${number}]`).fill(pack.items[number - 1].privateScoring.answerValue);
  await page.locator("#score-button").click();
  await page.locator("#results:not([hidden])").waitFor();
  assert.equal(await page.locator("#raw-score").innerText(), "70");
  assert.equal(await page.locator("#section-score-summary").innerText(), "A영역 30 / 30 · B영역 40 / 40");
  assert.equal(await page.locator("#priority-title").innerText(), "영역별 자동 처방은 검수 대기 중입니다.");
  assert.match(await page.locator("#axis-boundary").innerText(), /나머지 21문항/);
  assert.match(await page.locator("#axis-boundary").innerText(), /자동 약점 처방에는 사용하지 않습니다/);
  assert.equal(await page.locator(".axis-card").filter({ hasText: "규칙과 대수" }).locator("header span").innerText(), "2 / 2");
  assert.match(await page.locator(".question-chip").nth(8).textContent(), /표현 해석 검수 필요 · 영역 진단 제외/);
  assert.match(await page.locator(".question-chip").nth(14).textContent(), /문항 규칙 검수 필요 · 영역 진단 제외/);
  assert.match(await page.locator(".question-chip").nth(18).textContent(), /점수만 반영 · 영역 진단 제외/);
  assert.match(await page.locator(".question-chip").nth(20).textContent(), /0 포함 범위 검수 필요 · 영역 진단 제외/);
  assert.match(await page.locator(".prediction-boundary").innerText(), /최초 응시 1\/3회 기록/);
  assert.equal(await page.locator(".axis-card").count(), 6);
  assert.equal(await page.locator(".question-chip").count(), 25);
  assert.equal(await page.locator(".question-chip.has-review-link").count(), 0);
  assert.match(await page.locator(".question-chip").nth(0).textContent(), /Section A · 객관식 · 배점 2점 · 이번 득점 \+2점/u);
  assert.match(await page.locator(".question-chip").nth(0).textContent(), /영역 가분류 · .* · 검수 중/u);
  assert.match(await page.locator(".question-chip").nth(0).textContent(), /풀이 방법을 한 문장으로 설명해 보세요/u);
  assert.doesNotMatch(await page.locator("body").innerHTML(), /answerValue|privateScoring|publishedSolutionLocator/u);
  const saved = await page.evaluate(function () { return localStorage.getItem("gmap-local-learning-record-v1:competition-evidence"); });
  assert.ok(saved);
  const parsed = JSON.parse(saved);
  assert.equal(parsed.schemaVersion, "gfield-competition-evidence-v6");
  assert.deepEqual(parsed.reviewQueue, []);
  assert.equal(parsed.axes.reduce(function (total, axis) { return total + axis.itemCount; }, 0), 25);
  assert.equal(parsed.diagnosticAxes.reduce(function (total, axis) { return total + axis.itemCount; }, 0), 21);
  assert.deepEqual(parsed.diagnosticExcludedQuestionNumbers, [9, 15, 19, 21]);
  assert.deepEqual(parsed.scoreOnlyQuestionNumbers, [19]);
  assert.deepEqual(parsed.reviewRequiredQuestionNumbers, [9, 15, 21]);
  assert.equal(parsed.priorityAxis, null);
  assert.doesNotMatch(saved, /answerValue|sourceLocator|privateScoring|publishedSolutionLocator/);
  const firstSeries = await page.evaluate(function () { return localStorage.getItem("gmap-local-learning-record-v1:competition-first-attempts-v2"); });
  assert.ok(firstSeries);
  assert.doesNotMatch(firstSeries, /answerValue|sourceLocator|privateScoring|publishedSolutionLocator|sourcePageUrl/);
  const wrongNineteen = pack.items[18].privateScoring.answerValue === "0" ? "1" : "0";
  await page.locator("input[name=q19]").fill(wrongNineteen);
  await page.locator("#score-button").click();
  assert.equal(await page.locator("#raw-score").innerText(), "66");
  assert.equal(await page.locator("#section-score-summary").innerText(), "A영역 30 / 30 · B영역 36 / 40");
  assert.match(await page.locator(".question-chip").nth(18).textContent(), /Section B · 단답형 · 배점 4점 · 이번 득점 0점/u);
  assert.match(await page.locator(".question-chip").nth(18).textContent(), /점수에는 반영되지만 강점·약점 판단에는 사용하지 않습니다/u);
  assert.equal(await page.locator(".axis-card").filter({ hasText: "규칙과 대수" }).locator("header span").innerText(), "2 / 2");
  assert.equal(await page.evaluate(function () { return localStorage.getItem("gmap-local-learning-record-v1:competition-first-attempts-v2"); }), firstSeries);
  await page.locator("input[name=q19]").fill(pack.items[18].privateScoring.answerValue);
  const wrongTwentyOne = pack.items[20].privateScoring.answerValue === "0" ? "1" : "0";
  await page.locator("input[name=q21]").fill(wrongTwentyOne);
  await page.locator("#score-button").click();
  assert.equal(await page.locator("#raw-score").innerText(), "66");
  assert.equal(await page.locator(".axis-card").filter({ hasText: "조합과 논리" }).locator("header span").innerText(), "3 / 3");
  assert.equal(await page.evaluate(function () { return localStorage.getItem("gmap-local-learning-record-v1:competition-first-attempts-v2"); }), firstSeries);
  await page.locator("input[name=q21]").fill(pack.items[20].privateScoring.answerValue);
  const wrongFifteen = pack.items[14].privateScoring.answerValue === "A" ? "B" : "A";
  await page.locator(`label:has(input[name=q15][value=${wrongFifteen}])`).click();
  await page.locator("#score-button").click();
  assert.equal(await page.locator("#raw-score").innerText(), "67");
  assert.match(await page.locator(".question-chip").nth(14).textContent(), /Section A · 객관식 · 배점 2점 · 이번 득점 −1점/u);
  assert.equal(await page.locator(".axis-card").filter({ hasText: "규칙과 대수" }).locator("header span").innerText(), "2 / 2");
  await page.locator(`label:has(input[name=q15][value=${pack.items[14].privateScoring.answerValue}])`).click();
  const wrongLetter = pack.items[0].privateScoring.answerValue === "A" ? "B" : "A";
  await page.locator(`label:has(input[name=q1][value=${wrongLetter}])`).click();
  await page.locator("#score-button").click();
  assert.equal(await page.locator("#raw-score").innerText(), "67");
  assert.match(await page.locator(".question-chip").nth(0).textContent(), /처음 막힌 단계를 표시하세요/u);
  assert.match(await page.locator(".prediction-boundary").innerText(), /다시 풀었습니다/);
  assert.equal(await page.evaluate(function () { return localStorage.getItem("gmap-local-learning-record-v1:competition-first-attempts-v2"); }), firstSeries);
  await page.locator("#paper-file").setInputFiles([]);
  assert.equal(await page.locator("#score-button").isDisabled(), true);
  assert.equal(await page.locator("#paper-empty").isVisible(), true);
  assert.equal(await page.locator("#pdf-stage").isVisible(), false);
  await page.locator("#plan-link").click();
  await page.waitForURL(/learning-plan\.html/);
  assert.equal(await page.locator("#plan-state").innerText(), "기출 점수 연결");
  assert.match(await page.locator("#prediction-copy").innerText(), /실제 점수 70 \/ 70/);
  assert.match(await page.locator("#prediction-copy").innerText(), /영역 판정 재검수 중/);
  assert.equal(await page.locator("#review-queue").isHidden(), true);
  await context.close();
});

test("a mixed first attempt carries only its neutral review queue into the learning plan", { skip: !hasPrivatePaper }, async function () {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const page = await context.newPage();
  const pack = JSON.parse(fs.readFileSync(privatePack, "utf8"));
  await page.goto(`${baseUrl}sasmo-real-paper.html`, { waitUntil: "networkidle" });
  await page.locator("#pack-file").setInputFiles(privatePack);
  await page.locator("#paper-file").setInputFiles(privatePaper);
  await page.locator("#source-state[data-state=ready]").waitFor();
  for (let number = 1; number <= 15; number += 1) {
    if (number === 2) continue;
    const answer = number === 1
      ? pack.items[0].privateScoring.answerValue === "A" ? "B" : "A"
      : pack.items[number - 1].privateScoring.answerValue;
    await page.locator(`label:has(input[name=q${number}][value=${answer}])`).click();
  }
  for (let number = 16; number <= 25; number += 1) {
    const answer = number === 16
      ? pack.items[15].privateScoring.answerValue === "0" ? "1" : "0"
      : pack.items[number - 1].privateScoring.answerValue;
    await page.locator(`input[name=q${number}]`).fill(answer);
  }
  await page.locator("#score-button").click();
  await page.locator("#results:not([hidden])").waitFor();
  assert.equal(await page.locator("#raw-score").innerText(), "61");
  assert.equal(await page.locator("#section-score-summary").innerText(), "A영역 25 / 30 · B영역 36 / 40");
  const saved = JSON.parse(await page.evaluate(function () { return localStorage.getItem("gmap-local-learning-record-v1:competition-evidence"); }));
  assert.equal(saved.schemaVersion, "gfield-competition-evidence-v6");
  assert.deepEqual(saved.reviewQueue, [
    { questionNumber: 1, sectionId: "A", outcome: "incorrect", pointsEarned: -1, diagnosticEligibility: "eligible", reviewCommentCode: "locate-first-divergence" },
    { questionNumber: 2, sectionId: "A", outcome: "blank", pointsEarned: 0, diagnosticEligibility: "eligible", reviewCommentCode: "identify-starting-barrier" },
    { questionNumber: 16, sectionId: "B", outcome: "incorrect", pointsEarned: 0, diagnosticEligibility: "eligible", reviewCommentCode: "locate-first-divergence" }
  ]);
  assert.doesNotMatch(JSON.stringify(saved.reviewQueue), /answer|axis|skill|error|source|locator/i);
  await page.locator("#plan-link").click();
  await page.waitForURL(/learning-plan\.html/u);
  assert.equal(await page.locator("#review-queue-title").innerText(), "최초 응시 다시 보기 3문항");
  assert.equal(await page.locator("#review-queue-list li").count(), 3);
  assert.match(await page.locator("#review-queue-copy").innerText(), /약점 영역을 판정한 목록이 아닙니다/u);
  assert.equal(await page.locator("#priority-legend").innerText(), "영역 판정 전 직접 선택할 학습 영역");
  assert.deepEqual(await page.evaluate(function () { return [document.documentElement.scrollWidth, document.documentElement.clientWidth]; }), [390, 390]);
  await context.close();
});

test("the token-gated local studio auto-connects verified files and opens the exact student lesson", { skip: !hasPrivateStudio }, async function () {
  const token = "C".repeat(32);
  const studio = privateStudio.createPrivateSasmoStudio({
    repositoryRoot: root,
    token,
    paperFile: privatePaper,
    packFile: privatePack,
    studentReviewFile: privateStudentReview,
    teacherReviewFile: privateTeacherReview
  });
  await new Promise(function (resolve) { studio.server.listen(0, privateStudio.HOST, resolve); });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  try {
    const studioUrl = `http://${privateStudio.HOST}:${studio.server.address().port}/boarding-school-math/sasmo-real-paper.html?runtime=local-private&token=${token}&audience=student`;
    await page.goto(studioUrl, { waitUntil: "networkidle" });
    await page.locator("#source-state[data-state=ready]").waitFor();
    assert.equal(await page.locator("body").getAttribute("data-audience"), "student");
    assert.equal(await page.locator("#paper-file").isDisabled(), true);
    assert.equal(await page.locator("#pack-file").isDisabled(), true);
    assert.equal(await page.locator("#runtime-note").isVisible(), true);
    assert.match(await page.locator("#source-state").innerText(), /문항별 복습의 검증값/u);

    const pack = JSON.parse(fs.readFileSync(privatePack, "utf8"));
    for (let number = 1; number <= 15; number += 1) await page.locator(`label:has(input[name=q${number}][value=${pack.items[number - 1].privateScoring.answerValue}])`).click();
    for (let number = 16; number <= 25; number += 1) await page.locator(`input[name=q${number}]`).fill(pack.items[number - 1].privateScoring.answerValue);
    await page.locator("#score-button").click();
    await page.locator("#results:not([hidden])").waitFor();
    await page.locator("#question-review-summary").click();
    assert.equal(await page.locator(".question-chip.has-review-link").count(), 25);
    const href = await page.locator('.question-chip.has-review-link[href*="q=6"]').getAttribute("href");
    assert.ok(href);
    assert.match(href, new RegExp(`/__gfield_private/${token}/review/student\\.html\\?q=6$`, "u"));
    assert.doesNotMatch(href, /(?:[A-Za-z]:\\|file:\/\/)/u);

    const review = await context.newPage();
    await review.goto(href, { waitUntil: "load" });
    assert.equal(await review.locator('.lesson[data-item="6"]').isVisible(), true);
    assert.equal(await review.locator(".lesson:visible").count(), 1);
    assert.equal(await review.locator('.question-link[data-go="6"]').getAttribute("aria-current"), "page");
    assert.equal(await review.locator(".teacher-note").count(), 0);
    assert.equal(new URL(review.url()).searchParams.get("q"), "6");

    const teacherPage = await context.newPage();
    await teacherPage.goto(studioUrl.replace("audience=student", "audience=teacher"), { waitUntil: "networkidle" });
    await teacherPage.locator("#source-state[data-state=ready]").waitFor();
    assert.equal(await teacherPage.locator("body").getAttribute("data-audience"), "teacher");
    assert.match(await teacherPage.locator("#question-review-summary").innerText(), /교사용/u);
    await teacherPage.locator("#score-button").click();
    await teacherPage.locator("#results:not([hidden])").waitFor();
    await teacherPage.locator("#question-review-summary").click();
    assert.match(await teacherPage.locator(".question-chip").first().innerText(), /Section A · 객관식 · 배점 2점 · 이번 득점 0점/u);
    assert.match(await teacherPage.locator(".question-chip").first().innerText(), /시간 부족인지 시작 방법을 찾지 못했는지 풀이 흔적으로 구분하세요/u);
    assert.doesNotMatch(await teacherPage.locator("body").innerHTML(), /answerValue|privateScoring|publishedSolutionLocator/u);
    const teacherHref = await teacherPage.locator('.question-chip.has-review-link[href*="q=21"]').getAttribute("href");
    assert.ok(teacherHref);
    assert.match(teacherHref, new RegExp(`/__gfield_private/${token}/review/teacher\\.html\\?q=21$`, "u"));
    const teacherReview = await context.newPage();
    await teacherReview.goto(teacherHref, { waitUntil: "load" });
    assert.equal(await teacherReview.locator('.lesson[data-item="21"]').isVisible(), true);
    assert.equal(await teacherReview.locator('.lesson[data-item="21"] .teacher-note').count(), 1);
    assert.equal(await teacherReview.locator('.lesson[data-item="21"] .review-boundary[data-review-state="review-required"]').count(), 1);
  } finally {
    await context.close();
    await new Promise(function (resolve) { studio.server.close(resolve); });
  }
});

test("the local studio carries one verified score into student and teacher learning materials", { skip: !hasPrivateStudio }, async function () {
  const token = "D".repeat(32);
  const studio = privateStudio.createPrivateSasmoStudio({
    repositoryRoot: root,
    token,
    paperFile: privatePaper,
    packFile: privatePack,
    studentReviewFile: privateStudentReview,
    teacherReviewFile: privateTeacherReview
  });
  await new Promise(function (resolve) { studio.server.listen(0, privateStudio.HOST, resolve); });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  function track(page) {
    page.on("pageerror", function (error) { errors.push(`page:${error.message}`); });
    page.on("console", function (message) { if (message.type() === "error") errors.push(`console:${message.text()}`); });
    return page;
  }
  try {
    const base = `http://${privateStudio.HOST}:${studio.server.address().port}`;
    const paper = track(await context.newPage());
    await paper.goto(`${base}/boarding-school-math/sasmo-real-paper.html?runtime=local-private&token=${token}&audience=student`, { waitUntil: "networkidle" });
    await paper.locator("#source-state[data-state=ready]").waitFor();
    const pack = JSON.parse(fs.readFileSync(privatePack, "utf8"));
    for (let number = 1; number <= 15; number += 1) await paper.locator(`label:has(input[name=q${number}][value=${pack.items[number - 1].privateScoring.answerValue}])`).click();
    for (let number = 16; number <= 25; number += 1) await paper.locator(`input[name=q${number}]`).fill(pack.items[number - 1].privateScoring.answerValue);
    await paper.locator("#score-button").click();
    await paper.locator("#results:not([hidden])").waitFor();

    const planHref = await paper.locator("#plan-link").getAttribute("href");
    assert.ok(planHref);
    const planUrl = new URL(planHref);
    assert.equal(planUrl.searchParams.get("runtime"), "local-private");
    assert.equal(planUrl.searchParams.get("token"), token);
    assert.equal(planUrl.searchParams.get("audience"), "student");

    const studentPlan = track(await context.newPage());
    await studentPlan.goto(planHref, { waitUntil: "networkidle" });
    assert.equal(await studentPlan.locator("#plan-state").innerText(), "기출 점수 연결");
    assert.equal(await studentPlan.locator("#teacher-pack").isHidden(), true);
    assert.equal(await studentPlan.locator("#teacher-grid").getByRole("link").count(), 0);
    assert.match(await studentPlan.locator("#prediction-copy").innerText(), /실제 점수 70 \/ 70/u);
    assert.match(await studentPlan.locator("#prediction-copy").innerText(), /영역 판정 재검수 중/u);
    assert.equal(await studentPlan.locator("#priority-legend").innerText(), "영역 판정 전 직접 선택할 학습 영역");
    assert.equal(await studentPlan.locator("#teacher-title").innerText(), "선택한 영역을 한 수업 세트로 엽니다.");
    const returnHref = new URL(await studentPlan.locator("#diagnostic-action").getAttribute("href"), studentPlan.url());
    assert.equal(returnHref.searchParams.get("token"), token);
    assert.equal(returnHref.searchParams.get("audience"), "student");

    const conceptHrefValue = await studentPlan.locator('#today-blocks a[href*="concept-learning.html"]').getAttribute("href");
    assert.ok(conceptHrefValue);
    const conceptHref = new URL(conceptHrefValue, studentPlan.url()).href;
    const concept = track(await context.newPage());
    await concept.goto(conceptHref, { waitUntil: "networkidle" });
    assert.match(await concept.locator(".lesson-lineage").innerText(), /6\.G\.A/u);
    const workbookHrefValue = await concept.locator('[data-clinic-action="workbook"]').getAttribute("href");
    assert.ok(workbookHrefValue);
    const workbookHref = new URL(workbookHrefValue, concept.url()).href;

    const studentWorkbook = track(await context.newPage());
    await studentWorkbook.goto(workbookHref, { waitUntil: "networkidle" });
    await studentWorkbook.locator('#print-book[data-ready="true"]').waitFor();
    assert.equal(await studentWorkbook.locator("body").getAttribute("data-audience"), "student");
    assert.equal(await studentWorkbook.locator(".book-problem").count(), 36);
    assert.equal(await studentWorkbook.locator(".teacher-key").count(), 0);

    const teacherPlanHrefValue = await studentPlan.locator("#teacher-workspace-link").getAttribute("href");
    assert.ok(teacherPlanHrefValue);
    const teacherPlanHref = new URL(teacherPlanHrefValue, studentPlan.url()).href;
    const teacherPlan = track(await context.newPage());
    await teacherPlan.goto(teacherPlanHref, { waitUntil: "networkidle" });
    assert.equal(await teacherPlan.locator("body").getAttribute("data-audience"), "teacher");
    assert.equal(await teacherPlan.locator("#teacher-pack").isVisible(), true);
    assert.equal(await teacherPlan.locator("#plan-state").innerText(), "기출 점수 연결");
    const teacherPackCopy = await teacherPlan.locator("#teacher-grid").innerText();
    assert.match(teacherPackCopy, /36문항 전체의 정답·풀이·관찰 포인트/u);
    assert.match(teacherPackCopy, /정답을 분리한 36문항 수업·독립 연습/u);
    assert.match(teacherPackCopy, /8문항 재확인/u);
    const teacherReturn = new URL(await teacherPlan.locator("#diagnostic-action").getAttribute("href"), teacherPlan.url());
    assert.equal(teacherReturn.searchParams.get("token"), token);
    assert.equal(teacherReturn.searchParams.get("audience"), "teacher");
    const teacherWorkbookHrefValue = await teacherPlan.locator("#teacher-grid a").filter({ hasText: "교사용 지도서 열기" }).getAttribute("href");
    assert.ok(teacherWorkbookHrefValue);
    const teacherWorkbookHref = new URL(teacherWorkbookHrefValue, teacherPlan.url()).href;

    const teacherWorkbook = track(await context.newPage());
    await teacherWorkbook.goto(teacherWorkbookHref, { waitUntil: "networkidle" });
    await teacherWorkbook.locator('#print-book[data-ready="true"]').waitFor();
    assert.equal(await teacherWorkbook.locator("body").getAttribute("data-audience"), "teacher");
    assert.equal(await teacherWorkbook.locator(".book-problem").count(), 36);
    assert.equal(await teacherWorkbook.locator(".teacher-key").count(), 36);
    await teacherWorkbook.locator(".book-page").nth(2).evaluate(function (page) {
      page.scrollIntoView({ block: "start" });
    });
    const [toolbarBox, lessonPageBox] = await Promise.all([
      teacherWorkbook.locator(".workbook-toolbar").boundingBox(),
      teacherWorkbook.locator(".book-page").nth(2).boundingBox()
    ]);
    assert.ok(toolbarBox && lessonPageBox);
    assert.ok(lessonPageBox.y >= toolbarBox.y + toolbarBox.height,
      `teacher workbook page starts at ${lessonPageBox.y}px under a toolbar ending at ${toolbarBox.y + toolbarBox.height}px`);
    assert.deepEqual(errors, []);
  } finally {
    await context.close();
    await new Promise(function (resolve) { studio.server.close(resolve); });
  }
});

test("the setup, OMR, and result remain usable at 390px without horizontal overflow", { skip: !hasPrivatePaper }, async function () {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}sasmo-real-paper.html`, { waitUntil: "networkidle" });
  assert.equal(await page.evaluate(function () { return document.documentElement.scrollWidth <= window.innerWidth; }), true);
  const pack = JSON.parse(fs.readFileSync(privatePack, "utf8"));
  await page.locator("#pack-file").setInputFiles(privatePack);
  await page.locator("#paper-file").setInputFiles(privatePaper);
  await page.locator("#source-state[data-state=ready]").waitFor();
  await page.locator(`label:has(input[name=q1][value=${pack.items[0].privateScoring.answerValue}])`).click();
  await page.locator("#score-button").click();
  await page.locator("#results:not([hidden])").waitFor();
  await page.locator("#question-review-summary").click();
  assert.equal(await page.evaluate(function () { return document.documentElement.scrollWidth <= window.innerWidth; }), true);
  assert.equal(await page.locator(".choice-group label").first().evaluate(function (node) { return node.getBoundingClientRect().height >= 34; }), true);
  assert.match(await page.locator(".question-chip").nth(1).innerText(), /02 · 미응답/u);
  assert.match(await page.locator(".question-chip").nth(1).innerText(), /시간을 정해 다시 시도하고, 시작하지 못한 이유를 적으세요/u);
  const [firstCard, secondCard] = await Promise.all([
    page.locator(".question-chip").nth(0).boundingBox(),
    page.locator(".question-chip").nth(1).boundingBox()
  ]);
  assert.ok(firstCard && secondCard);
  assert.equal(Math.round(firstCard.x), Math.round(secondCard.x));
  assert.ok(firstCard.width <= 390 && secondCard.width <= 390);
  await context.close();
});

test("the score-only boundary and intro remain readable at a narrow 320px width", async function () {
  const context = await browser.newContext({ viewport: { width: 320, height: 700 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}sasmo-real-paper.html`, { waitUntil: "networkidle" });
  assert.equal(await page.evaluate(function () { return document.documentElement.scrollWidth <= window.innerWidth; }), true);
  assert.match(await page.locator(".intro-copy").innerText(), /자동 약점 처방에 사용하지 않습니다/);
  assert.equal(await page.locator(".format-facts dd").last().innerText(), "검수 중");
  await context.close();
});

test("a cleared file selection cannot be revived by an older asynchronous read", { skip: !hasPrivatePaper }, async function () {
  const page = await browser.newPage();
  await page.addInitScript(function () {
    const original = File.prototype.arrayBuffer;
    File.prototype.arrayBuffer = async function () {
      await new Promise(function (resolve) { setTimeout(resolve, 250); });
      return original.call(this);
    };
  });
  await page.goto(`${baseUrl}sasmo-real-paper.html`, { waitUntil: "networkidle" });
  await page.locator("#paper-file").setInputFiles(privatePaper);
  await page.locator("#paper-file").setInputFiles([]);
  await page.locator("#pack-file").setInputFiles(privatePack);
  await page.locator("#pack-file").setInputFiles([]);
  await page.waitForTimeout(350);
  assert.equal(await page.locator("#pdf-stage").isVisible(), false);
  assert.equal(await page.locator("#paper-empty").isVisible(), true);
  assert.equal(await page.locator("#score-button").isDisabled(), true);
  assert.equal(await page.locator("#source-state[data-state=ready]").count(), 0);
  await page.close();
});

test("a different PDF is rejected before OMR input and cannot create a real-paper record", async function () {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${baseUrl}sasmo-real-paper.html`, { waitUntil: "networkidle" });
  await page.locator("#pack-file").setInputFiles({ name: "sasmo-2019-g6-diagnostic.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(verifiedPack())) });
  await page.locator("#source-state[data-state=error]").waitFor();
  assert.match(await page.locator("#source-state").innerText(), /PACK_FINGERPRINT_MISMATCH/);
  const otherPdf = await page.pdf({ format: "A4" });
  await page.locator("#paper-file").setInputFiles({ name: "another-year.pdf", mimeType: "application/pdf", buffer: otherPdf });
  await page.locator("#paper-empty strong").filter({ hasText: "이 회차의 원본 PDF가 아닙니다." }).waitFor();
  assert.match(await page.locator("#paper-empty strong").innerText(), /원본 PDF가 아닙니다/);
  assert.equal(await page.locator("#score-button").isDisabled(), true);
  assert.equal(await page.evaluate(function () { return localStorage.getItem("gmap-local-learning-record-v1:competition-first-attempts-v2"); }), null);
  await page.close();
});
