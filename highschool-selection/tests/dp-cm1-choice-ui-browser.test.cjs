"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const browserBinary = chromium.executablePath();

test("DP CM1 keeps 19 choice buttons and 11 written inputs without exposing keys", { skip: !fs.existsSync(browserBinary) }, async () => {
  const browser = await chromium.launch({ headless: true, executablePath: browserBinary });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.route("http://exam.test/**", route => route.fulfill({ status: 200, contentType: "text/html", body: "<html><body></body></html>" }));
    await page.goto("http://exam.test/");
    await page.setContent(`
      <span id="exam-title">시험 응시</span><span id="exam-meta"></span>
      <div id="viewer-pages"></div><aside class="panel answer-panel" id="answer-panel" hidden>
      <div id="save-state"></div><div class="answer-grid" id="answer-grid"></div><div id="submit-state"></div>
      </aside><button id="submit"></button><button id="to-answers"></button><button id="print-paper"></button>
    `);
    await page.addStyleTag({ path: path.join(root, "shared", "app.css") });
    await page.addStyleTag({ path: path.join(root, "shared", "exam-choices.css") });
    for (const script of [
      "data/question-bank-core.js",
      "data/review-only/dp-cm1-entry-202405-inventory.js",
      "data/review-only/dp-cm1-entry-202405-response-schema.js",
      "shared/response-contract.js",
      "shared/exam-security.js"
    ]) await page.addScriptTag({ path: path.join(root, script) });
    await page.evaluate(() => {
      const realSecurity = window.HIGHSELECT_EXAM_SECURITY;
      window.HIGHSELECT_EXAM_SECURITY = {
        validateManifest() { return []; },
        validateResponseSchema: realSecurity.validateResponseSchema,
        validateAttemptAnswers: realSecurity.validateAttemptAnswers
      };
      window.HIGHSELECT_AUTH = { requireSession() { return { studentId: "STUDENT_001", name: "T" }; }, canAccess() { return true; } };
      window.HIGHSELECT_CATALOG = { exams: [{ id: "dp-common1-entry-202405", title: "돌파 공통수학1 입학 1차 모의고사", scopeLabel: "공통수학1", questionCount: 30, releaseStatus: "released" }] };
      window.HIGHSELECT_RUNTIME = { apiBase: "http://exam.test" };
      window.fetch = async function (url) {
        return {
          ok: true,
          async json() {
            return String(url).endsWith("response-schema")
              ? window.HIGHSELECT_DP_CM1_ENTRY_202405_RESPONSE_SCHEMA.forStudent("STUDENT_001")
              : { pages: [] };
          }
        };
      };
      history.replaceState(null, "", "/?id=dp-common1-entry-202405");
    });
    await page.addScriptTag({ path: path.join(root, "shared", "exam-page.js") });
    await page.locator("#answer-panel:not([hidden])").waitFor();

    assert.equal(await page.locator(".answer-choice-buttons").count(), 19);
    assert.equal(await page.locator(".answer-cell input").count(), 11);
    assert.equal(await page.locator(".answer-choice-buttons button").count(), 95);
    const thirdChoice = page.locator(".answer-choice-buttons").first().locator("button").nth(2);
    await thirdChoice.click();
    assert.equal(await thirdChoice.getAttribute("aria-pressed"), "true");
    const result = await page.evaluate(() => {
      const raw = localStorage.getItem("highselect-answer:STUDENT_001:dp-common1-entry-202405:1");
      const questions = HIGHSELECT_DP_CM1_ENTRY_202405_RESPONSE_SCHEMA.questions;
      return {
        stored: raw,
        submitted: HIGHSELECT_RESPONSE_CONTRACT.collect(questions[0], raw).value,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        publicSchema: JSON.stringify(HIGHSELECT_DP_CM1_ENTRY_202405_RESPONSE_SCHEMA.template)
      };
    });
    assert.equal(result.stored, "3");
    assert.equal(result.submitted, "3");
    assert.equal(result.overflow, false);
    assert.doesNotMatch(result.publicSchema, /answerSpec|correctAnswer|solution|explanation/i);
    if (process.env.DP_CM1_CAPTURE_DIR) {
      await page.locator("#answer-panel").screenshot({ path: path.join(process.env.DP_CM1_CAPTURE_DIR, "dp-cm1-choice-mobile.png") });
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), false);
    assert.equal(await thirdChoice.getAttribute("aria-pressed"), "true");
    if (process.env.DP_CM1_CAPTURE_DIR) {
      await page.locator("#answer-panel").screenshot({ path: path.join(process.env.DP_CM1_CAPTURE_DIR, "dp-cm1-choice-desktop.png") });
    }
  } finally {
    await browser.close();
  }
});

test("new DP CM1 basic entry mock shows its own 19 choice and 11 written answer controls", { skip: !fs.existsSync(browserBinary) }, async () => {
  const browser = await chromium.launch({ headless: true, executablePath: browserBinary });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.route("http://exam.test/**", route => route.fulfill({ status: 200, contentType: "text/html", body: "<html><body></body></html>" }));
    await page.goto("http://exam.test/");
    await page.setContent(`
      <span id="exam-title">시험 응시</span><span id="exam-meta"></span>
      <main class="viewer-shell"><div class="viewer-pages" id="viewer-pages"></div><aside class="panel answer-panel" id="answer-panel" hidden>
      <div id="save-state"></div><div class="answer-grid" id="answer-grid"></div><div id="submit-state"></div>
      </aside></main><button id="submit"></button><button id="to-answers"></button><button id="print-paper"></button>
    `);
    await page.addStyleTag({ path: path.join(root, "shared", "app.css") });
    await page.addStyleTag({ path: path.join(root, "shared", "exam-choices.css") });
    for (const script of [
      "data/review-only/dp-cm1-basic-entry-r01-format.js",
      "data/review-only/dp-cm1-basic-entry-r01-response-schema.js",
      "shared/response-contract.js",
      "shared/exam-security.js"
    ]) await page.addScriptTag({ path: path.join(root, script) });
    await page.evaluate(() => {
      const realSecurity = window.HIGHSELECT_EXAM_SECURITY;
      window.HIGHSELECT_EXAM_SECURITY = {
        validateManifest() { return [{ url: "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='600'%20height='840'%3E%3C/svg%3E" }]; },
        validateResponseSchema: realSecurity.validateResponseSchema,
        validateAttemptAnswers: realSecurity.validateAttemptAnswers
      };
      window.HIGHSELECT_AUTH = { requireSession() { return { studentId: "STUDENT_001", name: "T" }; }, canAccess() { return true; } };
      window.HIGHSELECT_CATALOG = { exams: [{ id: "dp-common1-basic-entry-mock-r01", title: "돌파 공통수학1 기본반 입학 모의고사 1회", scopeLabel: "공통수학1", questionCount: 30, releaseStatus: "released" }] };
      window.HIGHSELECT_RUNTIME = { apiBase: "http://exam.test" };
      window.fetch = async function (url) {
        return {
          ok: true,
          async json() {
            return String(url).endsWith("response-schema")
              ? window.HIGHSELECT_DP_CM1_BASIC_ENTRY_R01_RESPONSE_SCHEMA.forStudent("STUDENT_001")
              : { pages: [] };
          }
        };
      };
      history.replaceState(null, "", "/?id=dp-common1-basic-entry-mock-r01");
    });
    await page.addScriptTag({ path: path.join(root, "shared", "exam-page.js") });
    await page.locator("#answer-panel:not([hidden])").waitFor();
    assert.equal(await page.locator(".answer-choice-buttons").count(), 19);
    assert.equal(await page.locator(".answer-cell input").count(), 11);
    assert.equal(await page.locator(".answer-choice-buttons button").count(), 95);
    const eighth = page.locator(".answer-choice-buttons").nth(7).locator("button").nth(3);
    await eighth.click();
    assert.equal(await eighth.getAttribute("aria-pressed"), "true");
    assert.equal(await page.evaluate(() => localStorage.getItem("highselect-answer:STUDENT_001:dp-common1-basic-entry-mock-r01:8")), "4");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), false);
    const zoom = page.locator(".paper-zoom-toggle");
    await zoom.click();
    assert.equal(await zoom.getAttribute("aria-pressed"), "true");
    assert.equal(await page.locator(".paper-page").evaluate(element => element.scrollWidth > element.clientWidth), true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), false);
    await zoom.click();
    assert.equal(await zoom.getAttribute("aria-pressed"), "false");
    await page.setViewportSize({ width: 1440, height: 900 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), false);
    assert.equal(await eighth.getAttribute("aria-pressed"), "true");
    await page.emulateMedia({ media: "print" });
    assert.equal(await page.locator(".viewer-shell").evaluate(element => getComputedStyle(element).display), "block");
    assert.equal(await page.locator("#answer-panel").evaluate(element => getComputedStyle(element).display), "none");
    assert.equal(await page.locator(".paper-zoom-toggle").evaluate(element => getComputedStyle(element).display), "none");
    const publicData = await page.evaluate(() => JSON.stringify(window.HIGHSELECT_DP_CM1_BASIC_ENTRY_R01_FORMAT));
    assert.doesNotMatch(publicData, /answerSpec|correctAnswer|solution|sourceQuestionId/i);
  } finally {
    await browser.close();
  }
});
