#!/usr/bin/env node
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const playwrightPaths = [process.env.PLAYWRIGHT_PATH, "playwright"].filter(Boolean);
const playwrightPath = playwrightPaths.find(candidate => {
  try { require.resolve(candidate); return true; } catch (_) { return false; }
});
if (!playwrightPath) throw new Error("Playwright runtime not found. Set PLAYWRIGHT_PATH.");
const { chromium } = require(playwrightPath);

const base = String(process.argv[2] || "http://127.0.0.1:8904/hsmiddle").replace(/\/$/, "");
const output = path.resolve(process.argv[3] || path.join(os.tmpdir(), "hsmiddle-student-saved-report-audit"));
const token = "c".repeat(64);
const expiresAt = new Date(Date.now() + 3600000).toISOString();
const assert = (value, message) => { if (!value) throw new Error(message); };
const statesFor = correct => Object.fromEntries(Array.from({ length: 40 }, (_, index) => [index + 1, index < correct ? "o" : "x"]));
const validAttempts = [
  { attempt: 1, score: 50, correct: 20, answered: 40, states: statesFor(20), created_at: "2026-09-01T01:00:00.000Z" },
  { attempt: 2, score: 70, correct: 28, answered: 40, states: statesFor(28), created_at: "2026-09-08T01:00:00.000Z" },
  { attempt: 3, score: 87.5, correct: 35, answered: 40, states: statesFor(35), created_at: "2026-09-15T01:00:00.000Z" },
];
const invalidAttempts = [
  { attempt: 1, score: 100, correct: 40, answered: 40, states: statesFor(1), created_at: "2026-09-02T01:00:00.000Z" },
  { attempt: 1, score: 25, correct: 10, answered: 40, states: statesFor(10), created_at: "2026-09-02T02:00:00.000Z" },
  { attempt: 2, score: 70, correct: 28, answered: 40, states: { ...statesFor(28), "01": "o", 1: undefined }, created_at: "2026-09-09T01:00:00.000Z" },
  { attempt: 4, score: 50, correct: 20, answered: 40, states: statesFor(20), created_at: "2026-09-03T01:00:00.000Z" },
];

async function prepare(page, { withCurrentAnswers = false } = {}) {
  await page.addInitScript(({ token, expiresAt, withCurrentAnswers }) => {
    localStorage.setItem("hs-student", "DEMO");
    localStorage.setItem("hsm-session-token-v2", token);
    localStorage.setItem("hsm-session-profile-v2", JSON.stringify({ name: "DEMO", access: ["diagnostic", "mock-1", "mock-2", "mock-3", "final"], admin: false, expiresAt }));
    if (withCurrentAnswers) {
      for (let number = 1; number <= 40; number += 1) localStorage.setItem(`hsm-ox-${number}`, number <= 32 ? "o" : "x");
    }
    const localOnly = { date: "2026.09.20 10:00", score: 0, correct: 0, answered: 40, states: Object.fromEntries(Array.from({ length: 40 }, (_, index) => [index + 1, "x"])) };
    localStorage.setItem("hsm-history-diagnostic-DEMO", JSON.stringify([localOnly]));
    localStorage.setItem("hsm-history-mock-1-DEMO", JSON.stringify([localOnly]));
    window.__printCalls = 0;
    window.print = () => { window.__printCalls += 1; };
  }, { token, expiresAt, withCurrentAnswers });
  await page.route("**/functions/v1/hsmiddle-records", async route => {
    const body = JSON.parse(route.request().postData() || "{}");
    if (body.action === "session") {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, name: "DEMO", access: ["diagnostic", "mock-1", "mock-2", "mock-3", "final"], admin: false, expiresAt, startedAt: "2026-09-01T00:00:00.000Z" }) });
      return;
    }
    if (body.action === "listAttempts") {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ attempts: [...validAttempts, ...invalidAttempts] }) });
      return;
    }
    await route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ error: "unexpected_action" }) });
  });
}

async function noOverflow(page, label) {
  const metrics = await page.evaluate(() => ({ viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
  assert(metrics.scrollWidth <= metrics.viewport, `${label} horizontal overflow: ${JSON.stringify(metrics)}`);
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await prepare(desktop, { withCurrentAnswers: true });
    await desktop.goto(`${base}/report.html`, { waitUntil: "networkidle" });
    await desktop.locator(".score b").waitFor();
    assert((await desktop.locator(".score b").innerText()).trim() === "80", "current diagnostic score changed before preview");
    assert(await desktop.locator("[data-saved-attempt]").count() === 3, "invalid or missing saved attempts were rendered");
    await desktop.locator('[data-saved-attempt="0"]').click();
    assert((await desktop.locator(".score b").innerText()).trim() === "25", "newest valid duplicate attempt was not selected");
    assert(await desktop.locator(".diagnostic-cell.bad").count() === 30, "saved diagnostic O/X was not restored");
    assert(await desktop.locator(".plan-step").count() === 3, "saved diagnostic learning plan is missing");
    assert(await desktop.locator("#recordBtn.hidden").count() === 1, "saved diagnostic preview is not read-only");
    assert((await desktop.locator("#recordHint").innerText()).includes("1회차 저장 기록"), "saved diagnostic read-only label is missing");
    assert((await desktop.locator("#whoDate").innerText()).includes("1회차"), "saved diagnostic attempt heading is missing");
    assert(await desktop.locator('[data-saved-attempt="0"][aria-pressed="true"]').count() === 1, "selected diagnostic attempt is not identified");
    const unchanged = await desktop.evaluate(() => Array.from({ length: 40 }, (_, index) => localStorage.getItem(`hsm-ox-${index + 1}`)));
    assert(unchanged.filter(value => value === "o").length === 32, "opening a saved attempt mutated the current answers");
    await desktop.locator(".topbar button", { hasText: "인쇄 / PDF 저장" }).click();
    assert(await desktop.evaluate(() => window.__printCalls) === 1, "saved diagnostic print action failed");
    await desktop.screenshot({ path: path.join(output, "saved-diagnostic-desktop.png"), fullPage: true });
    await desktop.locator(".saved-preview-note button").click();
    assert((await desktop.locator(".score b").innerText()).trim() === "80", "returning to current diagnostic answers failed");
    assert(await desktop.locator("#recordBtn:not(.hidden)").count() === 1, "record button did not return after closing saved preview");
    const partialAttempts = await desktop.evaluate(() => {
      cloudAttempts = cloudAttempts.slice(0, 2);
      render();
      return [...document.querySelectorAll("[data-saved-attempt] b")].map(node => node.textContent.trim());
    });
    assert(partialAttempts.length === 3 && new Set(partialAttempts.map(label => label.split("회차")[0])).size === 3, "partial server results produced duplicate attempt numbers");
    assert(partialAttempts[2].startsWith("3회차"), "browser-only pending result did not fill the open attempt number");

    const fresh = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await prepare(fresh);
    await fresh.goto(`${base}/report.html`, { waitUntil: "networkidle" });
    assert(await fresh.locator("[data-saved-attempt]").count() === 3, "saved attempts are inaccessible on a device without current answers");
    await fresh.locator('[data-saved-attempt="2"]').click();
    assert((await fresh.locator(".score b").innerText()).trim() === "87.5", "fresh-device saved diagnostic preview failed");

    const mock = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await prepare(mock);
    await mock.goto(`${base}/report.html?exam=mock-1`, { waitUntil: "networkidle" });
    assert(await mock.locator("[data-saved-attempt]").count() === 3, "saved mock attempts are inaccessible without current answers");
    await mock.locator('[data-saved-attempt="1"]').click();
    assert((await mock.locator(".score b").innerText()).trim() === "70", "saved mock score was not restored");
    assert(await mock.locator(".gridcell.bad").count() === 12, "saved mock O/X was not restored");
    assert(await mock.locator(".gridcell.blank").count() === 0, "non-canonical saved-state keys created blank O/X cells");
    assert((await mock.locator(".errtable thead").innerText()).includes("저장 상태"), "saved mock report fabricates raw student answers");
    assert(!(await mock.locator(".errtable thead").innerText()).includes("내 답안"), "saved mock report uses the live-answer label");
    await mock.screenshot({ path: path.join(output, "saved-mock1-desktop.png"), fullPage: true });
    await mock.emulateMedia({ media: "print" });
    assert(await mock.locator(".saved-attempts").evaluate(node => getComputedStyle(node).display) === "none", "saved-attempt controls leaked into print");
    assert(await mock.locator(".saved-preview-note button").evaluate(node => getComputedStyle(node).display) === "none", "return control leaked into print");
    assert(await mock.locator(".gridcell").count() === 40, "A4 saved mock report lost O/X cells");
    const pdf = path.join(output, "saved-mock1-a4.pdf");
    await mock.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
    assert(fs.statSync(pdf).size > 10000, "saved mock A4 PDF was not created");

    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await prepare(mobile);
    await mobile.goto(`${base}/report.html`, { waitUntil: "networkidle" });
    await mobile.locator('[data-saved-attempt="0"]').click();
    assert(await mobile.locator(".saved-attempts").evaluate(node => getComputedStyle(node).gridTemplateColumns.split(" ").length) === 1, "mobile saved attempts must use one column");
    await noOverflow(mobile, "saved diagnostic mobile");
    await mobile.screenshot({ path: path.join(output, "saved-diagnostic-mobile.png"), fullPage: true });

    const mockMobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await prepare(mockMobile);
    await mockMobile.goto(`${base}/report.html?exam=mock-1`, { waitUntil: "networkidle" });
    await mockMobile.locator('[data-saved-attempt="1"]').click();
    assert((await mockMobile.locator(".score b").innerText()).trim() === "70", "mobile saved mock score was not restored");
    await noOverflow(mockMobile, "saved mock mobile");
    await mockMobile.screenshot({ path: path.join(output, "saved-mock1-mobile.png"), fullPage: true });

    console.log(`HSMIDDLE_STUDENT_SAVED_REPORT_AUDIT_OK attempts=3 diagnostic=current+saved+fresh mock=1 print=1 a4=1 mobile=diagnostic+mock invalid=blocked duplicate=latest`);
    console.log(output);
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error.stack || error);
  process.exit(1);
});
