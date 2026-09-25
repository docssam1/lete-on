#!/usr/bin/env node
"use strict";

const { chromium } = require("playwright");
const fs = require("fs");
const os = require("os");
const path = require("path");

const base = String(process.argv[2] || "http://127.0.0.1:8896/hsmiddle").replace(/\/$/, "");
const outputDir = process.env.HSMIDDLE_ADMIN_AUDIT_OUTPUT || path.join(os.tmpdir(), "hsmiddle-admin-results-audit");
const token = "a".repeat(64);
const expiresAt = new Date(Date.now() + 3600000).toISOString();
const maliciousStudent = '<img src=x onerror="window.__reportXss=true">';
const statesFor = (correct, answered = 40) => Object.fromEntries(Array.from({ length: answered }, (_, index) => [index + 1, index < correct ? "o" : "x"]));
const attempts = [
  { student: "학생가", round: "diagnostic", attempt: 2, score: 82.5, correct: 33, answered: 40, states: statesFor(33), created_at: "2026-09-20T02:30:00.000Z" },
  { student: "학생가", round: "mock-1", attempt: 1, score: 75, correct: 30, answered: 40, states: statesFor(30), created_at: "2026-09-19T03:20:00.000Z" },
  { student: "학생가", round: "mock-2", attempt: 1, score: 80, correct: 32, answered: 40, states: statesFor(32), created_at: "2026-09-18T03:20:00.000Z" },
  { student: "학생가", round: "mock-3", attempt: 1, score: 85, correct: 34, answered: 40, states: statesFor(34), created_at: "2026-09-17T03:20:00.000Z" },
  { student: "학생가", round: "final", attempt: 1, score: 90, correct: 36, answered: 40, states: statesFor(36), created_at: "2026-09-16T03:20:00.000Z" },
  { student: "학생나", round: "diagnostic", attempt: 1, score: 40, correct: 16, answered: 32, states: statesFor(16, 32), created_at: "2026-09-15T04:10:00.000Z" },
  { student: maliciousStudent, round: "diagnostic", attempt: 1, score: 50, correct: 20, answered: 40, states: statesFor(20), created_at: "2026-09-14T04:10:00.000Z" },
];
const roundExpectations = {
  "mock-1": { title: "실전 모의고사 1회", score: "75" },
  "mock-2": { title: "실전 모의고사 2회", score: "80" },
  "mock-3": { title: "실전 모의고사 3회", score: "85" },
  final: { title: "최종 모의고사", score: "90" },
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function prepare(page, options = {}) {
  const localAdmin = options.localAdmin !== false;
  const localName = localAdmin ? "관리자" : "일반학생";
  const serverAccess = options.serverAccess || ["diagnostic", "mock-1", "mock-2", "mock-3", "final"];
  const localAccess = options.localAccess || serverAccess;
  await page.addInitScript(({ token, expiresAt, localAdmin, localName, localAccess, previewSelector }) => {
    localStorage.setItem("hs-student", localName);
    localStorage.setItem("hsm-session-token-v2", token);
    localStorage.setItem("hsm-session-profile-v2", JSON.stringify({ name: localName, access: localAccess, admin: localAdmin, expiresAt }));
    if (previewSelector) sessionStorage.setItem("hsm-admin-report-preview-v1", JSON.stringify(previewSelector));
  }, { token, expiresAt, localAdmin, localName, localAccess, previewSelector: options.previewSelector || null });
  await page.route("**/functions/v1/hsmiddle-records", async route => {
    const body = JSON.parse(route.request().postData() || "{}");
    if (body.action === "session") {
      if (options.sessionFailure) {
        await route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: "offline" }) });
        return;
      }
      const admin = options.serverAdmin !== false;
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, name: admin ? "관리자" : "일반학생", access: serverAccess, admin, expiresAt, startedAt: "2026-09-01T00:00:00.000Z" }) });
      return;
    }
    if (body.action === "adminList") {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ accounts: [
        { student_name: "학생가", permissions: ["diagnostic"], is_admin: false, active: true },
        { student_name: '악성\");window.__xssTriggered=true;//', permissions: ["diagnostic"], is_admin: false, active: true },
      ] }) });
      return;
    }
    if (body.action === "allAttempts") {
      if (options.resultsFailure || options.serverAdmin === false) {
        await route.fulfill({ status: 403, contentType: "application/json", body: JSON.stringify({ error: "admin_required" }) });
        return;
      }
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ attempts }) });
      return;
    }
    await route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ error: "unexpected_action" }) });
  });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await prepare(desktop);
    await desktop.goto(`${base}/admin.html`, { waitUntil: "networkidle" });
    assert(await desktop.locator("[data-deactivate-index]").count() === 2, "account action buttons missing");
    assert(await desktop.locator('[onclick*="deactivate"]').count() === 0, "student name is exposed through an inline event handler");
    assert(await desktop.evaluate(() => window.__xssTriggered !== true), "stored student name executed script");
    await desktop.locator("#resultsTab").click();
    await desktop.locator(".result-card").first().waitFor();
    assert(await desktop.locator(".result-card").count() === 7, "desktop result count mismatch");
    assert((await desktop.locator("#resultCount").innerText()).trim() === "7건", "result metric mismatch");
    assert((await desktop.locator("#studentCount").innerText()).trim() === "3명", "student metric mismatch");
    await desktop.locator(".detail-button").first().click();
    assert(await desktop.locator(".result-detail:not(.hidden) .ox-cell").count() === 40, "expanded O/X detail must have 40 cells");
    fs.mkdirSync(outputDir, { recursive: true });
    await desktop.screenshot({ path: path.join(outputDir, "admin-results-desktop.png"), fullPage: true });
    await desktop.locator("#studentFilter").selectOption({ label: "학생나" });
    assert(await desktop.locator(".result-card").count() === 1, "student filter mismatch");

    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await prepare(mobile);
    await mobile.goto(`${base}/admin.html`, { waitUntil: "networkidle" });
    await mobile.locator("#resultsTab").click();
    await mobile.locator(".result-card").first().waitFor();
    await mobile.locator(".detail-button").first().click();
    const columns = await mobile.locator(".ox-grid").first().evaluate(node => getComputedStyle(node).gridTemplateColumns.split(" ").length);
    assert(columns === 4, "mobile O/X detail must use four columns");
    const mobileOverflow = await mobile.evaluate(() => ({
      viewport: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      offenders: Array.from(document.querySelectorAll("body *")).map(node => ({ tag: node.tagName, className: String(node.className || ""), right: Math.round(node.getBoundingClientRect().right), width: Math.round(node.getBoundingClientRect().width) })).filter(item => item.right > innerWidth + 1).slice(0, 8),
    }));
    assert(mobileOverflow.scrollWidth <= mobileOverflow.viewport, `mobile admin results overflow horizontally: ${JSON.stringify(mobileOverflow)}`);
    await mobile.screenshot({ path: path.join(outputDir, "admin-results-mobile.png"), fullPage: true });

    const report = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await prepare(report);
    await report.goto(`${base}/admin.html`, { waitUntil: "networkidle" });
    await report.locator("#resultsTab").click();
    await report.locator(".report-button").first().click();
    await report.waitForURL(/report\.html\?adminPreview=1/);
    await report.locator(".score b").waitFor();
    assert((await report.locator("#whoName").innerText()).trim() === "학생가 학생", "admin report student mismatch");
    assert((await report.locator(".score b").innerText()).trim() === "82.5", "admin report score mismatch");
    assert(await report.locator(".diagnostic-cell").count() === 40, "admin report must render all 40 O/X cells");
    assert(await report.locator(".chart").count() === 4, "admin report analysis charts missing");
    assert(await report.locator(".plan-step").count() === 3, "admin report learning plan missing");
    assert(await report.locator("#recordBtn.hidden").count() === 1, "admin report must be read-only");
    assert((await report.locator(".topbar a").innerText()).includes("성적 기록으로 돌아가기"), "admin return link missing");
    const printLabels = await report.locator(".print-group button").allTextContents();
    assert(printLabels.includes("선택 번호 인쇄") && printLabels.includes("오답 전체 인쇄"), "admin preview wrong-answer print controls missing");
    assert(printLabels.includes("선택 유사문제 인쇄") && printLabels.includes("오답 유사문제 전체 인쇄"), "admin preview similar-problem print controls missing");
    const printTargets = await report.evaluate(() => {
      const opened = [];
      window.open = target => { opened.push(String(target)); };
      toggleWrongPicks(false);
      for (const input of document.querySelectorAll("[data-wrong-pick]")) input.checked = input.value === "34" || input.value === "35";
      setWrongPrintMode("answer");
      printSelectedWrong();
      printAllWrong();
      printSelectedSimilar();
      printAllSimilar();
      setWrongPrintMode("problem");
      printSelectedSimilar();
      return opened;
    });
    assert(printTargets[0].includes("viewer.html?doc=diagnostic-review&qs=34,35&mode=answer") && printTargets[0].includes("student="), "admin preview selected wrong-answer print URL is incorrect");
    assert(printTargets[1].includes("qs=34,35,36,37,38,39,40") && printTargets[1].includes("mode=answer"), "admin preview all-wrong print URL is incorrect");
    assert(printTargets[2].includes("question-bank/?qs=34,35&mode=answer&autoprint=1&student=%ED%95%99%EC%83%9D%EA%B0%80"), "admin preview selected similar-problem print URL is incorrect");
    assert(printTargets[3].includes("question-bank/?qs=34,35,36,37,38,39,40&mode=answer&autoprint=1&student=%ED%95%99%EC%83%9D%EA%B0%80"), "admin preview all-similar print URL is incorrect");
    assert(printTargets[4].includes("question-bank/?qs=34,35&mode=problem&autoprint=1&student=%ED%95%99%EC%83%9D%EA%B0%80"), "admin preview problem-only similar print URL is incorrect");
    await report.locator(".print-tools").screenshot({ path: path.join(outputDir, "admin-report-print-actions.png") });
    await report.screenshot({ path: path.join(outputDir, "admin-report-desktop.png"), fullPage: true });
    await report.emulateMedia({ media: "print" });
    const pdfPath = path.join(outputDir, "admin-report-a4.pdf");
    await report.pdf({ path: pdfPath, format: "A4", printBackground: true, margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" } });
    assert(fs.statSync(pdfPath).size > 10000, "admin report A4 PDF was not created");

    const reportMobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await prepare(reportMobile);
    await reportMobile.goto(`${base}/admin.html`, { waitUntil: "networkidle" });
    await reportMobile.locator("#resultsTab").click();
    await reportMobile.locator(".report-button").first().click();
    await reportMobile.waitForURL(/report\.html\?adminPreview=1/);
    await reportMobile.locator(".score b").waitFor();
    assert(await reportMobile.locator(".print-group button").count() === 4, "mobile admin report print actions missing");
    assert(await reportMobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "mobile admin report overflows horizontally");
    await reportMobile.locator(".print-tools").screenshot({ path: path.join(outputDir, "admin-report-print-actions-mobile.png") });
    await reportMobile.screenshot({ path: path.join(outputDir, "admin-report-mobile.png"), fullPage: true });

    const bankPrint = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await prepare(bankPrint);
    await bankPrint.goto(`${base}/question-bank/?qs=34,35&mode=answer&student=${encodeURIComponent("학생가")}`, { waitUntil: "networkidle" });
    await bankPrint.locator("#app:not([hidden]), #accessGate:not([hidden])").first().waitFor();
    const bankState = await bankPrint.evaluate(() => ({
      gateHidden: document.getElementById("accessGate").hidden,
      appHidden: document.getElementById("app").hidden,
      worksheetHidden: document.getElementById("worksheetView").hidden,
      selectedTypes: document.querySelectorAll(".selected-item").length,
      notice: document.getElementById("linkedNotice").textContent,
    }));
    assert(!bankState.appHidden && bankState.worksheetHidden === false, `admin question-bank print did not open: ${JSON.stringify(bankState)}`);
    assert((await bankPrint.locator("#studentName").innerText()).trim() === "학생가 학생", "admin question-bank print student heading mismatch");
    assert((await bankPrint.locator(".watermark").first().innerText()).includes("학생가 · LETE-ON"), "admin question-bank print watermark mismatch");

    const bankXss = await browser.newPage({ viewport: { width: 1000, height: 800 } });
    await prepare(bankXss);
    await bankXss.addInitScript(() => { window.__bankXss = false; });
    const maliciousWatermark = '<img src=x onerror="window.__bankXss=true">';
    await bankXss.goto(`${base}/question-bank/?qs=34&student=${encodeURIComponent(maliciousWatermark)}`, { waitUntil: "networkidle" });
    await bankXss.locator("#worksheetView:not([hidden])").waitFor();
    assert(await bankXss.evaluate(() => window.__bankXss !== true), "admin-selected student name executed script in the question-bank watermark");
    assert((await bankXss.locator(".watermark").first().innerText()).includes(maliciousWatermark), "escaped question-bank watermark text mismatch");

    const forgedBank = await browser.newPage({ viewport: { width: 1000, height: 800 } });
    await prepare(forgedBank, { localAdmin: false, serverAdmin: false, localAccess: ["diagnostic", "question-bank"] });
    await forgedBank.goto(`${base}/question-bank/?qs=34,35`, { waitUntil: "networkidle" });
    assert(await forgedBank.locator("#accessGate:not([hidden])").count() === 1, "forged local question-bank permission bypassed the access gate");
    assert(await forgedBank.locator("#app[hidden]").count() === 1, "forged local question-bank permission exposed the app");

    const forgedReport = await browser.newPage({ viewport: { width: 1000, height: 800 } });
    await prepare(forgedReport, { localAdmin: false, serverAdmin: false, localAccess: ["diagnostic", "question-bank"] });
    await forgedReport.addInitScript(() => { for (let number = 1; number <= 40; number += 1) localStorage.setItem(`hsm-ox-${number}`, number <= 33 ? "o" : "x"); });
    await forgedReport.goto(`${base}/report.html`, { waitUntil: "networkidle" });
    await forgedReport.locator(".score b").waitFor();
    assert(await forgedReport.locator(".print-group", { hasText: "연계 유사문제" }).count() === 0, "diagnostic-only student saw question-bank print controls");
    assert(!(await forgedReport.locator("body").innerText()).includes("별도 문제은행"), "diagnostic-only student saw separate product promotion in the report");

    const offlineReport = await browser.newPage({ viewport: { width: 1000, height: 800 } });
    await prepare(offlineReport, { localAdmin: false, serverAdmin: false, sessionFailure: true });
    await offlineReport.addInitScript(() => { for (let number = 1; number <= 40; number += 1) localStorage.setItem(`hsm-ox-${number}`, number <= 33 ? "o" : "x"); });
    await offlineReport.goto(`${base}/report.html`, { waitUntil: "networkidle" });
    await offlineReport.locator(".score b").waitFor();
    assert((await offlineReport.locator(".score b").innerText()).trim() === "82.5", "offline diagnostic report did not preserve the local result");
    assert(await offlineReport.locator(".print-group", { hasText: "연계 유사문제" }).count() === 0, "offline report exposed unverified question-bank controls");

    const revokedReport = await browser.newPage({ viewport: { width: 1000, height: 800 } });
    await prepare(revokedReport, { localAdmin: false, serverAdmin: false, serverAccess: [] });
    await revokedReport.addInitScript(() => { for (let number = 1; number <= 40; number += 1) localStorage.setItem(`hsm-ox-${number}`, number <= 33 ? "o" : "x"); });
    await revokedReport.goto(`${base}/report.html`, { waitUntil: "networkidle" });
    assert(await revokedReport.locator("#app.hidden").count() === 1, "server-revoked diagnostic permission fell back to stale local access");

    for (const [round, expected] of Object.entries(roundExpectations)) {
      const mockReport = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
      await prepare(mockReport);
      await mockReport.goto(`${base}/admin.html`, { waitUntil: "networkidle" });
      await mockReport.locator("#resultsTab").click();
      await mockReport.locator("#examFilter").selectOption(round);
      await mockReport.locator(".report-button").first().click();
      await mockReport.waitForURL(new RegExp(`report\\.html\\?adminPreview=1&exam=${round}`));
      await mockReport.locator(".score b").waitFor();
      assert((await mockReport.locator("#reportTitle").innerText()).includes(expected.title), `${round} report title mismatch`);
      assert((await mockReport.locator(".score b").innerText()).trim() === expected.score, `${round} report score mismatch`);
      assert(await mockReport.locator(".gridcell").count() === 40, `${round} report must render all 40 O/X cells`);
      assert(await mockReport.locator("#recordBtn.hidden").count() === 1, `${round} admin report must be read-only`);
      assert((await mockReport.locator(".errtable thead").innerText()).includes("저장 상태"), `${round} report must label stored O/X state accurately`);
      assert(!(await mockReport.locator(".errtable thead").innerText()).includes("내 답안"), `${round} report must not fabricate student answers`);
      if (round === "mock-1") await mockReport.screenshot({ path: path.join(outputDir, "admin-report-mock1-desktop.png"), fullPage: true });
      await mockReport.emulateMedia({ media: "print" });
      const roundPdf = path.join(outputDir, `admin-report-${round}-a4.pdf`);
      await mockReport.pdf({ path: roundPdf, format: "A4", printBackground: true, margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" } });
      assert(fs.statSync(roundPdf).size > 10000, `${round} A4 PDF was not created`);
      await mockReport.close();

      const mockMobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
      await prepare(mockMobile);
      await mockMobile.goto(`${base}/admin.html`, { waitUntil: "networkidle" });
      await mockMobile.locator("#resultsTab").click();
      await mockMobile.locator("#examFilter").selectOption(round);
      await mockMobile.locator(".report-button").first().click();
      await mockMobile.locator(".score b").waitFor();
      assert(await mockMobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${round} mobile report overflows horizontally`);
      await mockMobile.close();
    }

    const xssReport = await browser.newPage({ viewport: { width: 1000, height: 800 } });
    await prepare(xssReport);
    await xssReport.goto(`${base}/admin.html`, { waitUntil: "networkidle" });
    await xssReport.locator("#resultsTab").click();
    await xssReport.locator("#studentFilter").selectOption({ label: maliciousStudent });
    await xssReport.locator(".report-button").click();
    await xssReport.locator(".score b").waitFor();
    assert(await xssReport.evaluate(() => window.__reportXss !== true), "stored student name executed script in report");
    assert((await xssReport.locator(".watermark").innerText()).includes(maliciousStudent), "escaped student watermark text mismatch");

    const forgedAdmin = await browser.newPage({ viewport: { width: 1000, height: 800 } });
    await prepare(forgedAdmin, { serverAdmin: false, previewSelector: { student: "학생가", round: "diagnostic", attempt: 2, created_at: "2026-09-20T02:30:00.000Z" } });
    await forgedAdmin.goto(`${base}/report.html?adminPreview=1`, { waitUntil: "networkidle" });
    await forgedAdmin.locator("#previewError").waitFor();
    assert(await forgedAdmin.locator("#app.hidden").count() === 1, "forged local admin profile exposed a report");

    const staleRecord = await browser.newPage({ viewport: { width: 1000, height: 800 } });
    await prepare(staleRecord, { previewSelector: { student: "학생가", round: "diagnostic", attempt: 2, created_at: "2020-01-01T00:00:00.000Z" } });
    await staleRecord.goto(`${base}/report.html?adminPreview=1`, { waitUntil: "networkidle" });
    await staleRecord.locator("#previewError").waitFor();
    assert(await staleRecord.locator("#app.hidden").count() === 1, "stale selector fell back to another report");

    const failed = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await prepare(failed, { resultsFailure: true });
    await failed.goto(`${base}/admin.html`, { waitUntil: "networkidle" });
    await failed.locator("#resultsTab").click();
    await failed.locator("#resultStatus").filter({ hasText: "불러오지 못했습니다" }).waitFor();
    assert((await failed.locator("#resultCount").innerText()).trim() === "-", "failed load must not be shown as zero records");
    console.log(`HSMIDDLE_ADMIN_RESULTS_BROWSER_AUDIT_OK records=7 students=3 ox=40 reports=5 print_actions=5 a4=5 mobile=390 xss=blocked forged_admin=blocked forged_question_bank=blocked offline_report=preserved revoked_access=blocked student_watermark=verified watermark_xss=blocked stale=blocked output=${outputDir}`);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error.stack || error); process.exit(1); });
