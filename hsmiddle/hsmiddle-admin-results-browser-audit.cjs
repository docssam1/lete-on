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
const attempts = [
  { student: "학생가", round: "diagnostic", attempt: 2, score: 82.5, correct: 33, answered: 40, states: Object.fromEntries(Array.from({ length: 40 }, (_, index) => [index + 1, index % 6 ? "o" : "x"])), created_at: "2026-09-20T02:30:00.000Z" },
  { student: "학생가", round: "mock-1", attempt: 1, score: 75, correct: 30, answered: 40, states: Object.fromEntries(Array.from({ length: 40 }, (_, index) => [index + 1, index % 4 ? "o" : "x"])), created_at: "2026-09-19T03:20:00.000Z" },
  { student: "학생나", round: "diagnostic", attempt: 1, score: 50, correct: 20, answered: 32, states: Object.fromEntries(Array.from({ length: 32 }, (_, index) => [index + 1, index % 2 ? "o" : "x"])), created_at: "2026-09-18T04:10:00.000Z" },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function prepare(page, options = {}) {
  await page.addInitScript(({ token, expiresAt }) => {
    localStorage.setItem("hs-student", "관리자");
    localStorage.setItem("hsm-session-token-v2", token);
    localStorage.setItem("hsm-session-profile-v2", JSON.stringify({ name: "관리자", access: ["diagnostic"], admin: true, expiresAt }));
  }, { token, expiresAt });
  await page.route("**/functions/v1/hsmiddle-records", async route => {
    const body = JSON.parse(route.request().postData() || "{}");
    if (body.action === "adminList") {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ accounts: [
        { student_name: "학생가", permissions: ["diagnostic"], is_admin: false, active: true },
        { student_name: '악성\");window.__xssTriggered=true;//', permissions: ["diagnostic"], is_admin: false, active: true },
      ] }) });
      return;
    }
    if (body.action === "allAttempts") {
      if (options.resultsFailure) {
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
    assert(await desktop.locator(".result-card").count() === 3, "desktop result count mismatch");
    assert((await desktop.locator("#resultCount").innerText()).trim() === "3건", "result metric mismatch");
    assert((await desktop.locator("#studentCount").innerText()).trim() === "2명", "student metric mismatch");
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
    assert(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "mobile admin results overflow horizontally");
    await mobile.screenshot({ path: path.join(outputDir, "admin-results-mobile.png"), fullPage: true });

    const failed = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await prepare(failed, { resultsFailure: true });
    await failed.goto(`${base}/admin.html`, { waitUntil: "networkidle" });
    await failed.locator("#resultsTab").click();
    await failed.locator("#resultStatus").filter({ hasText: "불러오지 못했습니다" }).waitFor();
    assert((await failed.locator("#resultCount").innerText()).trim() === "-", "failed load must not be shown as zero records");
    console.log(`HSMIDDLE_ADMIN_RESULTS_BROWSER_AUDIT_OK records=3 students=2 ox=40 mobile=390 output=${outputDir}`);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error.stack || error); process.exit(1); });
