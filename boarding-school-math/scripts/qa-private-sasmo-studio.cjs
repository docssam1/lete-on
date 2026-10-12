#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const studioModule = require("./serve-private-sasmo-studio.cjs");

function fail(code) { const error = new Error(code); error.code = code; throw error; }
function argument(name) { const index = process.argv.indexOf(name); if (index < 0 || !process.argv[index + 1]) fail("PRIVATE_STUDIO_QA_COMMAND_INVALID"); return path.resolve(process.argv[index + 1]); }
function evidence(file) { const bytes = fs.readFileSync(file); return Object.freeze({ file: path.basename(file), byteLength: bytes.length, sha256: crypto.createHash("sha256").update(bytes).digest("hex") }); }
function errorsFor(page, target) {
  const errors = target || [];
  page.on("pageerror", function (error) { errors.push(`page:${error.message}`); });
  page.on("console", function (message) { if (message.type() === "error") errors.push(`console:${message.text()}`); });
  return errors;
}
async function fillAnswers(page, pack) {
  for (let number = 1; number <= 15; number += 1) await page.locator(`label:has(input[name=q${number}][value=${pack.items[number - 1].privateScoring.answerValue}])`).click();
  for (let number = 16; number <= 25; number += 1) await page.locator(`input[name=q${number}]`).fill(pack.items[number - 1].privateScoring.answerValue);
}
async function applyMixedOverrides(page, pack) {
  const wrongFirst = pack.items[0].privateScoring.answerValue === "A" ? "B" : "A";
  const wrongSixteenth = pack.items[15].privateScoring.answerValue === "0" ? "1" : "0";
  await page.locator(`label:has(input[name=q1][value=${wrongFirst}])`).click();
  await page.locator('input[name="q2"]:checked').evaluate(function (input) { input.checked = false; });
  await page.locator('input[name="q16"]').fill(wrongSixteenth);
}
async function openRuntime(page, base, audience) {
  await page.goto(`${base}&audience=${audience}`, { waitUntil: "networkidle" });
  await page.locator("#source-state[data-state=ready]").waitFor();
  if (await page.locator("body").getAttribute("data-audience") !== audience) fail("PRIVATE_STUDIO_QA_AUDIENCE_INVALID");
  if (!await page.locator("#runtime-note").isVisible() || !await page.locator("#paper-file").isDisabled() || !await page.locator("#pack-file").isDisabled()) fail("PRIVATE_STUDIO_QA_AUTOLOAD_INVALID");
}
async function reportAndReview(page, pack, audience, questionNumber, resultFile, reviewFile) {
  await fillAnswers(page, pack);
  await page.locator("#score-button").click();
  await page.locator("#results:not([hidden])").waitFor();
  await page.locator("#question-review-summary").click();
  if (await page.locator(".question-chip.has-review-link").count() !== 25) fail("PRIVATE_STUDIO_QA_LINK_COUNT_INVALID");
  if (await page.evaluate(function () { return document.documentElement.scrollWidth > window.innerWidth + 1; })) fail("PRIVATE_STUDIO_QA_HORIZONTAL_OVERFLOW");
  const firstQuestionCopy = await page.locator(".question-chip").first().innerText();
  if (!/Section A · 객관식 · 배점 2점 · 이번 득점 \+2점/u.test(firstQuestionCopy)
    || !/영역 가분류 · .* · 검수 중/u.test(firstQuestionCopy)
    || (audience === "teacher" && !/학생이 풀이를 설명하게 하여 우연 정답인지 확인하세요/u.test(firstQuestionCopy))
    || (audience === "student" && !/풀이 방법을 한 문장으로 설명해 보세요/u.test(firstQuestionCopy))) fail("PRIVATE_STUDIO_QA_ITEM_COMMENT_INVALID");
  if (!/점수만 반영 · 영역 진단 제외/u.test(await page.locator(".question-chip").nth(18).innerText())) fail("PRIVATE_STUDIO_QA_ITEM_EXCLUSION_INVALID");
  if (/answerValue|privateScoring|publishedSolutionLocator/u.test(await page.locator("body").innerHTML())) fail("PRIVATE_STUDIO_QA_ANSWER_LEAK");
  const href = await page.locator(`.question-chip.has-review-link[href*="q=${questionNumber}"]`).getAttribute("href");
  if (!href || !href.includes(`/review/${audience}.html?q=${questionNumber}`) || /(?:[A-Za-z]:\\|file:\/\/)/u.test(href)) fail("PRIVATE_STUDIO_QA_REVIEW_LINK_INVALID");
  await page.locator("#results").screenshot({ path: resultFile });
  const review = await page.context().newPage();
  const errors = errorsFor(review);
  try {
    await review.goto(href, { waitUntil: "load" });
    const lesson = review.locator(`.lesson[data-item="${questionNumber}"]`);
    if (!await lesson.isVisible() || await review.locator(".lesson:visible").count() !== 1) fail("PRIVATE_STUDIO_QA_DEEP_LINK_INVALID");
    if (await lesson.locator(".teacher-note").count() !== (audience === "teacher" ? 1 : 0)) fail("PRIVATE_STUDIO_QA_REVIEW_AUDIENCE_LEAK");
    await lesson.screenshot({ path: reviewFile });
  } finally { await review.close(); }
  if (errors.length) fail(`PRIVATE_STUDIO_QA_REVIEW_ERRORS_${errors.join("|")}`);
}

async function captureMixedStudentReview(page, pack, resultFile, resultPdf) {
  await applyMixedOverrides(page, pack);
  await page.locator("#score-button").click();
  if (!await page.locator(".teacher-evidence").evaluate(function (details) { return details.open; })) await page.locator("#question-review-summary").click();
  if (await page.locator("#raw-score").innerText() !== "61") fail("PRIVATE_STUDIO_QA_MIXED_SCORE_INVALID");
  if (await page.locator("#section-score-summary").innerText() !== "A영역 25 / 30 · B영역 36 / 40") fail("PRIVATE_STUDIO_QA_SECTION_SUBTOTAL_INVALID");
  const [wrongA, blankA, wrongB] = await Promise.all([
    page.locator(".question-chip").nth(0).innerText(),
    page.locator(".question-chip").nth(1).innerText(),
    page.locator(".question-chip").nth(15).innerText()
  ]);
  if (!/오답/u.test(wrongA) || !/이번 득점 −1점/u.test(wrongA) || !/처음 막힌 단계를 표시하세요/u.test(wrongA)) fail("PRIVATE_STUDIO_QA_SECTION_A_WRONG_COMMENT_INVALID");
  if (!/미응답/u.test(blankA) || !/이번 득점 0점/u.test(blankA) || !/시작하지 못한 이유를 적으세요/u.test(blankA)) fail("PRIVATE_STUDIO_QA_BLANK_COMMENT_INVALID");
  if (!/오답/u.test(wrongB) || !/Section B/u.test(wrongB) || !/이번 득점 0점/u.test(wrongB)) fail("PRIVATE_STUDIO_QA_SECTION_B_WRONG_COMMENT_INVALID");
  await page.locator("#results").screenshot({ path: resultFile });
  await page.emulateMedia({ media: "print" });
  const printState = await page.evaluate(function () {
    return {
      sectionScore: getComputedStyle(document.getElementById("section-score-summary")).display,
      itemReview: getComputedStyle(document.querySelector(".teacher-evidence")).display,
      results: getComputedStyle(document.getElementById("results")).display
    };
  });
  if (printState.sectionScore === "none" || printState.itemReview !== "none" || printState.results === "none") fail("PRIVATE_STUDIO_QA_RESULT_PRINT_STATE_INVALID");
  await page.pdf({ path: resultPdf, format: "A4", printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false });
  await page.emulateMedia({ media: "screen" });
}

async function captureReviewQueuePlan(context, sourcePage, artifacts, browserErrors) {
  const saved = await sourcePage.evaluate(function () {
    return JSON.parse(localStorage.getItem("gmap-local-learning-record-v1:competition-evidence") || "null");
  });
  if (!saved || saved.schemaVersion !== "gfield-competition-evidence-v6" || saved.score.rawScore !== 61 || !Array.isArray(saved.reviewQueue) || saved.reviewQueue.length !== 3) fail("PRIVATE_STUDIO_QA_REVIEW_QUEUE_STORAGE_INVALID");
  if (/answerValue|privateScoring|sourceLocator|publishedSolutionLocator|axisId|skillId/u.test(JSON.stringify(saved.reviewQueue))) fail("PRIVATE_STUDIO_QA_REVIEW_QUEUE_LEAK");
  const planHref = absoluteHref(sourcePage, await sourcePage.locator("#plan-link").getAttribute("href"));
  const plan = await context.newPage();
  errorsFor(plan, browserErrors);
  try {
    await plan.goto(planHref, { waitUntil: "networkidle" });
    if (!await plan.locator("#review-queue").isVisible() || await plan.locator("#review-queue-title").innerText() !== "최초 응시 다시 보기 3문항" || await plan.locator("#review-queue-list li").count() !== 3) fail("PRIVATE_STUDIO_QA_REVIEW_QUEUE_PLAN_INVALID");
    const queueCopy = await plan.locator("#review-queue").innerText();
    if (!/01[\s\S]*A영역 · 오답 · 득점 −1점/u.test(queueCopy) || !/02[\s\S]*A영역 · 미응답 · 득점 0점/u.test(queueCopy) || !/16[\s\S]*B영역 · 오답 · 득점 0점/u.test(queueCopy) || !/약점 영역을 판정한 목록이 아닙니다/u.test(queueCopy)) fail("PRIVATE_STUDIO_QA_REVIEW_QUEUE_COPY_INVALID");
    if (await plan.locator("#priority-legend").innerText() !== "영역 판정 전 직접 선택할 학습 영역" || await plan.evaluate(function () { return document.documentElement.scrollWidth > window.innerWidth + 1; })) fail("PRIVATE_STUDIO_QA_REVIEW_QUEUE_BOUNDARY_INVALID");
    await plan.screenshot({ path: artifacts.studentReviewQueuePlan, fullPage: true });
    await plan.emulateMedia({ media: "print" });
    if (!await plan.locator("#review-queue").isVisible()) fail("PRIVATE_STUDIO_QA_REVIEW_QUEUE_PRINT_HIDDEN");
    await plan.pdf({ path: artifacts.studentReviewQueuePlanPdf, format: "A4", printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false });
  } finally { await plan.close(); }
}

function absoluteHref(page, href) {
  if (!href) fail("PRIVATE_STUDIO_QA_FLOW_LINK_MISSING");
  return new URL(href, page.url()).href;
}

async function captureLearningFlow(context, sourcePage, audience, artifacts, browserErrors) {
  const planHref = absoluteHref(sourcePage, await sourcePage.locator("#plan-link").getAttribute("href"));
  const planUrl = new URL(planHref);
  if (planUrl.searchParams.get("runtime") !== "local-private" || planUrl.searchParams.get("audience") !== audience || !/^[A-Za-z0-9_-]{32}$/u.test(planUrl.searchParams.get("token") || "")) fail("PRIVATE_STUDIO_QA_PLAN_HANDOFF_INVALID");
  const plan = await context.newPage();
  errorsFor(plan, browserErrors);
  await plan.goto(planHref, { waitUntil: "networkidle" });
  if (await plan.locator("body").getAttribute("data-audience") !== audience || await plan.locator("#plan-state").innerText() !== "기출 점수 연결") fail("PRIVATE_STUDIO_QA_PLAN_STATE_INVALID");
  const teacherPackVisible = await plan.locator("#teacher-pack").isVisible();
  const teacherPackLinks = await plan.locator("#teacher-grid").getByRole("link").count();
  if ((audience === "student" && (teacherPackVisible || teacherPackLinks !== 0)) || (audience === "teacher" && (!teacherPackVisible || teacherPackLinks !== 4))) fail("PRIVATE_STUDIO_QA_PLAN_AUDIENCE_RESOURCES_INVALID");
  if (!/실제 점수 70 \/ 70/u.test(await plan.locator("#prediction-copy").innerText()) || !/영역 판정 재검수 중/u.test(await plan.locator("#prediction-copy").innerText())) fail("PRIVATE_STUDIO_QA_PLAN_BOUNDARY_INVALID");
  if (await plan.locator("#priority-legend").innerText() !== "영역 판정 전 직접 선택할 학습 영역" || await plan.locator("#teacher-title").innerText() !== "선택한 영역을 한 수업 세트로 엽니다.") fail("PRIVATE_STUDIO_QA_SCORE_ONLY_LANGUAGE_INVALID");
  const headlineLines = await plan.locator("#plan-audience-title .headline-line").evaluateAll(function (nodes) {
    return nodes.map(function (node) {
      const rect = node.getBoundingClientRect();
      return { text: node.textContent.trim(), top: Math.round(rect.top), fits: node.scrollWidth <= node.clientWidth + 1 };
    });
  });
  const expectedHeadline = audience === "teacher" ? ["진단 근거로", "오늘의 수업을", "설계합니다."] : ["진단 결과로", "오늘의 공부를", "설계합니다."];
  if (JSON.stringify(headlineLines.map(function (line) { return line.text; })) !== JSON.stringify(expectedHeadline)
    || new Set(headlineLines.map(function (line) { return line.top; })).size !== 3
    || headlineLines.some(function (line) { return !line.fits; })) fail("PRIVATE_STUDIO_QA_PLAN_HEADLINE_INVALID");
  const returnUrl = new URL(absoluteHref(plan, await plan.locator("#diagnostic-action").getAttribute("href")));
  if (returnUrl.searchParams.get("token") !== planUrl.searchParams.get("token") || returnUrl.searchParams.get("audience") !== audience) fail("PRIVATE_STUDIO_QA_RETURN_LINK_INVALID");
  if (await plan.evaluate(function () { return document.documentElement.scrollWidth > window.innerWidth + 1; })) fail("PRIVATE_STUDIO_QA_PLAN_OVERFLOW");
  await plan.screenshot({ path: audience === "teacher" ? artifacts.teacherPlan : artifacts.studentPlan, fullPage: true });
  await plan.emulateMedia({ media: "print" });
  const printState = await plan.evaluate(function () {
    return {
      form: getComputedStyle(document.querySelector(".plan-form")).display,
      diagnosticAction: getComputedStyle(document.querySelector(".diagnostic-action")).display,
      header: getComputedStyle(document.querySelector(".plan-header")).display,
      headlineLines: Array.from(document.querySelectorAll("#plan-audience-title .headline-line"), function (node) { return node.textContent.trim(); })
    };
  });
  if (printState.form !== "none" || printState.diagnosticAction !== "none" || printState.header !== "none" || printState.headlineLines.length !== 3) fail("PRIVATE_STUDIO_QA_PLAN_PRINT_STATE_INVALID");
  await plan.pdf({
    path: audience === "teacher" ? artifacts.teacherPlanPdf : artifacts.studentPlanPdf,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: false
  });
  await plan.emulateMedia({ media: "screen" });

  if (audience === "student") {
    const conceptHref = absoluteHref(plan, await plan.locator('#today-blocks a[href*="concept-learning.html"]').getAttribute("href"));
    const concept = await context.newPage();
    errorsFor(concept, browserErrors);
    await concept.goto(conceptHref, { waitUntil: "networkidle" });
    if (!/6\.G\.A/u.test(await concept.locator(".lesson-lineage").innerText())) fail("PRIVATE_STUDIO_QA_CONCEPT_CLUSTER_INVALID");
    await concept.locator("#lesson").screenshot({ path: artifacts.studentConcept });
    const workbookHref = absoluteHref(concept, await concept.locator('[data-clinic-action="workbook"]').getAttribute("href"));
    const workbook = await context.newPage();
    errorsFor(workbook, browserErrors);
    await workbook.goto(workbookHref, { waitUntil: "networkidle" });
    await workbook.locator('#print-book[data-ready="true"]').waitFor();
    if (await workbook.locator("body").getAttribute("data-audience") !== "student" || await workbook.locator(".book-problem").count() !== 36 || await workbook.locator(".teacher-key").count() !== 0) fail("PRIVATE_STUDIO_QA_STUDENT_WORKBOOK_INVALID");
    await workbook.locator(".book-page").first().screenshot({ path: artifacts.studentWorkbook });
    await workbook.close();
    await concept.close();
  } else {
    const teacherPackCopy = await plan.locator("#teacher-grid").innerText();
    if (!/36문항 전체의 정답·풀이·관찰 포인트/u.test(teacherPackCopy) || !/정답을 분리한 36문항 수업·독립 연습/u.test(teacherPackCopy) || !/8문항 재확인/u.test(teacherPackCopy)) fail("PRIVATE_STUDIO_QA_TEACHER_PACK_COPY_INVALID");
    const workbookHref = absoluteHref(plan, await plan.locator("#teacher-grid a").filter({ hasText: "교사용 지도서 열기" }).getAttribute("href"));
    const workbook = await context.newPage();
    errorsFor(workbook, browserErrors);
    await workbook.goto(workbookHref, { waitUntil: "networkidle" });
    await workbook.locator('#print-book[data-ready="true"]').waitFor();
    if (await workbook.locator("body").getAttribute("data-audience") !== "teacher" || await workbook.locator(".book-problem").count() !== 36 || await workbook.locator(".teacher-key").count() !== 36) fail("PRIVATE_STUDIO_QA_TEACHER_WORKBOOK_INVALID");
    const lessonPage = workbook.locator(".book-page").nth(2);
    await lessonPage.evaluate(function (page) { page.scrollIntoView({ block: "start" }); });
    const toolbarBox = await workbook.locator(".workbook-toolbar").boundingBox();
    const lessonPageBox = await lessonPage.boundingBox();
    if (!toolbarBox || !lessonPageBox || lessonPageBox.y < toolbarBox.y + toolbarBox.height) fail("PRIVATE_STUDIO_QA_TEACHER_WORKBOOK_TOOLBAR_OVERLAP");
    await lessonPage.screenshot({ path: artifacts.teacherWorkbook });
    await workbook.close();
  }
  await plan.close();
}

async function main() {
  const repositoryRoot = path.resolve(__dirname, "..", "..");
  const outputRoot = studioModule.assertExternalOutputRoot(argument("--out"), repositoryRoot);
  fs.mkdirSync(outputRoot, { recursive: true });
  const packFile = argument("--pack");
  const pack = JSON.parse(fs.readFileSync(packFile, "utf8"));
  const studio = studioModule.createPrivateSasmoStudio({
    repositoryRoot,
    paperFile: argument("--paper"),
    packFile,
    studentReviewFile: argument("--student-review"),
    teacherReviewFile: argument("--teacher-review")
  });
  await new Promise(function (resolve) { studio.server.listen(0, studioModule.HOST, resolve); });
  const base = `http://${studioModule.HOST}:${studio.server.address().port}/boarding-school-math/sasmo-real-paper.html?runtime=local-private&token=${studio.token}`;
  const browser = await chromium.launch({ headless: true });
  const artifacts = {
    studentResult: path.join(outputRoot, "student-results-links-desktop.png"),
    studentMixedResult: path.join(outputRoot, "student-results-mixed-desktop.png"),
    studentMixedResultPdf: path.join(outputRoot, "student-results-mixed-a4.pdf"),
    studentReviewQueuePlan: path.join(outputRoot, "student-review-queue-plan-desktop.png"),
    studentReviewQueuePlanPdf: path.join(outputRoot, "student-review-queue-plan-a4.pdf"),
    studentReview: path.join(outputRoot, "student-q06-review-desktop.png"),
    teacherResult: path.join(outputRoot, "teacher-results-links-desktop.png"),
    teacherReview: path.join(outputRoot, "teacher-q21-review-desktop.png"),
    studentPlan: path.join(outputRoot, "student-learning-plan-desktop.png"),
    studentPlanPdf: path.join(outputRoot, "student-learning-plan-a4.pdf"),
    studentConcept: path.join(outputRoot, "student-concept-6GA-desktop.png"),
    studentWorkbook: path.join(outputRoot, "student-workbook-6GA-desktop.png"),
    teacherPlan: path.join(outputRoot, "teacher-learning-plan-desktop.png"),
    teacherPlanPdf: path.join(outputRoot, "teacher-learning-plan-a4.pdf"),
    teacherWorkbook: path.join(outputRoot, "teacher-workbook-6GA-desktop.png"),
    mobileResult: path.join(outputRoot, "student-results-links-mobile-390.png"),
    mobilePlan: path.join(outputRoot, "student-learning-plan-mobile-390.png")
  };
  const browserErrors = [];
  try {
    const studentContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const student = await studentContext.newPage();
    errorsFor(student, browserErrors);
    await openRuntime(student, base, "student");
    await reportAndReview(student, pack, "student", 6, artifacts.studentResult, artifacts.studentReview);
    await captureLearningFlow(studentContext, student, "student", artifacts, browserErrors);
    await studentContext.close();

    const mixedContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const mixedStudent = await mixedContext.newPage();
    errorsFor(mixedStudent, browserErrors);
    await openRuntime(mixedStudent, base, "student");
    await fillAnswers(mixedStudent, pack);
    await captureMixedStudentReview(mixedStudent, pack, artifacts.studentMixedResult, artifacts.studentMixedResultPdf);
    await captureReviewQueuePlan(mixedContext, mixedStudent, artifacts, browserErrors);
    await mixedContext.close();

    const teacherContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const teacher = await teacherContext.newPage();
    errorsFor(teacher, browserErrors);
    await openRuntime(teacher, base, "teacher");
    await reportAndReview(teacher, pack, "teacher", 21, artifacts.teacherResult, artifacts.teacherReview);
    await captureLearningFlow(teacherContext, teacher, "teacher", artifacts, browserErrors);
    await teacherContext.close();

    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
    const mobile = await mobileContext.newPage();
    errorsFor(mobile, browserErrors);
    await openRuntime(mobile, base, "student");
    await fillAnswers(mobile, pack);
    await applyMixedOverrides(mobile, pack);
    await mobile.locator("#score-button").click();
    await mobile.locator("#results:not([hidden])").waitFor();
    await mobile.locator("#question-review-summary").click();
    if (await mobile.evaluate(function () { return document.documentElement.scrollWidth > window.innerWidth + 1; })) fail("PRIVATE_STUDIO_QA_MOBILE_OVERFLOW");
    await mobile.locator("#results").screenshot({ path: artifacts.mobileResult });
    const mobilePlanHref = absoluteHref(mobile, await mobile.locator("#plan-link").getAttribute("href"));
    await mobile.goto(mobilePlanHref, { waitUntil: "networkidle" });
    if (await mobile.locator("#plan-state").innerText() !== "기출 점수 연결" || !await mobile.locator("#review-queue").isVisible() || await mobile.locator("#review-queue-list li").count() !== 3 || await mobile.evaluate(function () { return document.documentElement.scrollWidth > window.innerWidth + 1; })) fail("PRIVATE_STUDIO_QA_MOBILE_PLAN_INVALID");
    await mobile.evaluate(function () { window.scrollTo(0, 0); });
    await mobile.screenshot({ path: artifacts.mobilePlan, fullPage: true });
    await mobileContext.close();
    if (browserErrors.length) fail(`PRIVATE_STUDIO_QA_BROWSER_ERRORS_${browserErrors.join("|")}`);
  } finally {
    await browser.close();
    await new Promise(function (resolve) { studio.server.close(resolve); });
  }
  const reportPath = path.join(outputRoot, "private-sasmo-studio-qa-report.json");
  const report = {
    schemaVersion: "gfield-private-sasmo-studio-qa-v1",
    formId: studio.runtime.form.formId,
    privateRouteTokenPersisted: false,
    checks: ["localhost-only-token-route", "automatic-verified-file-load", "public-paths-absent", "25-question-review-links", "answer-safe-item-score-and-comment", "section-a-section-b-subtotal", "mixed-section-a-penalty-section-b-zero-point-comment", "blank-item-comment", "diagnostic-exclusion-item-copy", "student-mixed-result-a4-pdf", "student-print-hides-item-review", "student-teacher-review-separation", "exact-question-deep-link", "score-to-plan-handoff", "answer-free-first-attempt-review-queue", "review-queue-score-reconciliation", "review-queue-not-automatic-weakness", "review-queue-desktop-mobile-a4", "score-only-manual-selection-language", "meaning-based-korean-headline-lines", "audience-specific-plan-resources", "audience-specific-workbook-count-copy", "student-concept-route", "student-teacher-workbook-separation", "teacher-workbook-toolbar-clearance", "private-runtime-return-link", "desktop-no-horizontal-overflow", "mobile-390-no-horizontal-overflow", "student-teacher-a4-plan-pdf", "browser-console-clean"],
    artifacts: Object.values(artifacts).map(evidence)
  };
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, { encoding: "utf8", flag: "w" });
  process.stdout.write(`PASS private SASMO studio QA: ${report.artifacts.length} artifacts + ${path.basename(reportPath)}\n`);
}

main().catch(function (error) { process.stderr.write(`BLOCKED private SASMO studio QA: ${error.code || error.message || "INVALID"}\n`); process.exitCode = 2; });
