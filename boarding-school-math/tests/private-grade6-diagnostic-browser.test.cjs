"use strict";

/*
 * This test is deliberately the only browser consumer of private Grade 6
 * authoring. It reads the ignored pack at execution time so the committed
 * test never contains question wording or an answer value.
 */

const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");
const { chromium } = require("playwright");

const local = require("../assessment/private-grade6-local-runtime.cjs");

const projectRoot = path.resolve(__dirname, "..");
const privateDirectory = path.join(projectRoot, "private-authoring");
const teacherPin = "BROWSER-TEST-PIN-42";

let browser;
let server;
let baseUrl;

function authoringItems() {
  return local.loadPrivateAuthoring(privateDirectory).items;
}

function browserResponseFor(item, index) {
  return item.privateDraft.answer ? item.privateDraft.answer.value : `풀이근거${index + 1}`.padEnd(1000, "가");
}

function forbiddenStudentPaths(value, prefix) {
  const forbidden = new Set([
    "answer", "solutionByLocale", "expectedResponseByLocale", "rubricDraft", "privateDraft",
    "sourcePath", "errorSignals", "defaultErrorType", "scoringSpec"
  ]);
  if (!value || typeof value !== "object") return [];
  return Object.keys(value).flatMap(function (key) {
    const current = prefix ? `${prefix}.${key}` : key;
    return (forbidden.has(key) ? [current] : []).concat(forbiddenStudentPaths(value[key], current));
  });
}

function collectErrors(page) {
  const errors = [];
  page.on("console", function (message) {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", function (error) { errors.push(error.message); });
  return errors;
}

function diagnosticPost(response, action) {
  if (!response.url().includes("/api/grade6-local") || response.request().method() !== "POST") return false;
  try { return JSON.parse(response.request().postData() || "{}").action === action; } catch (_) { return false; }
}

async function noHorizontalOverflow(page, width) {
  await page.setViewportSize({ width, height: 844 });
  const dimensions = await page.evaluate(function () {
    return { scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth };
  });
  assert.equal(dimensions.scroll, dimensions.client, `Grade 6 diagnostic overflow at ${width}px`);
}

test.before(async function () {
  server = local.createGrade6LocalServer({ projectRoot, privateDirectory, teacherPin, qaOnly: true });
  await new Promise(function (resolve) { server.listen(0, "127.0.0.1", resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}/`;
  browser = await chromium.launch({ headless: true });
});

test.after(async function () {
  if (browser) await browser.close();
  if (server && server.listening) await new Promise(function (resolve) { server.close(resolve); });
});

test("Grade 6 local diagnostic turns a reviewed prerequisite error into domain analysis and a locked prescription candidate", { timeout: 120000 }, async function () {
  const items = authoringItems();
  const manualItems = items.filter(function (item) {
    return ["short-answer", "constructed-response"].includes(item.responseType);
  });
  assert.equal(items.length, 42);
  assert.equal(manualItems.length, 10);
  const prerequisiteItem = items.find(function (item) {
    return item.privateDraft.answer && item.privateDraft.errorSignals.some(function (signal) { return signal.errorType === "prerequisite-gap"; });
  });
  assert.ok(prerequisiteItem, "the reviewed fixture needs one automatic prerequisite-gap signal");
  const prerequisiteSignal = prerequisiteItem.privateDraft.errorSignals.find(function (signal) { return signal.errorType === "prerequisite-gap"; });

  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = collectErrors(page);
  let renderedDiagram = false;
  let finalSaveBatchCount = 0;
  const teacherUiViolations = [];
  try {
    page.on("request", function (request) {
      if (!request.url().includes("/api/grade6-local") || request.method() !== "POST") return;
      try {
        const payload = JSON.parse(request.postData() || "{}");
        if (payload.action === "save" && Array.isArray(payload.responses) && payload.responses.length > 1) finalSaveBatchCount += 1;
      } catch (_) { /* malformed test traffic is handled by the server */ }
    });
    const pageResponse = await page.goto(`${baseUrl}diagnostic.html`, { waitUntil: "networkidle" });
    assert.equal(pageResponse.status(), 200);
    await page.locator("#student-start").waitFor({ state: "visible" });
    assert.equal(await page.locator("#student-start").isDisabled(), false);
    assert.match(await page.locator("#runtime-status-title").textContent(), /비공개 QA 흐름 준비됨/);
    assert.match(await page.locator("#runtime-status-copy").textContent(), /독립 승인 전[\s\S]*실제 학생 운영은 잠겨/);

    const startResponse = page.waitForResponse(function (response) { return diagnosticPost(response, "start"); });
    await page.locator("#student-start").click();
    const startPayload = await (await startResponse).json();
    assert.equal(startPayload.items.length, 42);
    assert.deepEqual(startPayload.counts, { total: 42, automatic: 32, teacherReview: 10 });
    assert.equal(startPayload.deliveryState, "local-qa-only-pending-independent-review");
    assert.deepEqual(forbiddenStudentPaths(startPayload), [], "student start payload contains scoring or solution data");
    assert.equal(startPayload.items.filter(function (item) { return item.assets.length > 0; }).length > 0, true);
    assert.equal(await page.locator("#question-overview").isHidden(), true, "the 42-item overview must stay collapsed until requested");
    assert.equal(await page.locator("#assessment-submit").isHidden(), true, "submit must stay hidden before the final item");
    assert.equal(await page.locator("#question-next").isVisible(), true);

    for (let index = 0; index < items.length; index += 1) {
      const item = items[index];
      const responseValue = item.itemId === prerequisiteItem.itemId ? prerequisiteSignal.observedValue : browserResponseFor(item, index);
      assert.equal(await page.locator("#question-progress").textContent(), `${index + 1} / 42`);
      if (await page.locator("#student-question img").count()) {
        await page.waitForFunction(function () {
          const image = document.querySelector("#student-question img");
          return image && image.complete && image.naturalWidth > 0;
        });
        renderedDiagram = true;
      }

      if (item.privateDraft.answer && item.privateDraft.answer.kind === "option-id") {
        const option = page.locator("#student-question input[type=radio]");
        const matched = await option.evaluateAll(function (inputs, value) {
          return inputs.filter(function (input) { return input.value === value; }).length;
        }, responseValue);
        assert.equal(matched, 1, `student response UI lacks its approved option for item ${index + 1}`);
        await page.locator("#student-question input[type=radio]").evaluateAll(function (inputs, value) {
          const match = inputs.find(function (candidate) {
            return candidate.value === value;
          });
          if (!match) throw new Error("Expected choice is not present");
          match.click();
        }, responseValue);
      } else {
        const field = page.locator("#student-question textarea, #student-question input[type=text]");
        assert.equal(await field.count(), 1, `student response field missing for item ${index + 1}`);
        assert.match(await field.evaluate(function (control) {
          return Array.from(control.labels || []).map(function (label) { return label.textContent.trim(); }).join(" ");
        }), /^(답|풀이와 근거)$/);
        assert.equal(await field.getAttribute("maxlength"), item.responseType === "constructed-response" || item.publicDraft.responseUi.inputKind === "workpad" ? "1500" : "200");
        assert.match(await page.locator("#student-question .response-limit").textContent(), /10,240 bytes/);
        await field.fill(responseValue);
      }

      if (index < items.length - 1) {
        const saveResponse = page.waitForResponse(function (response) { return diagnosticPost(response, "save"); });
        await page.locator("#question-next").click();
        assert.equal((await saveResponse).status(), 200);
        await page.locator("#question-progress").waitFor({ state: "visible" });
        await page.waitForFunction(function (nextIndex) {
          return document.getElementById("question-progress").textContent === `${nextIndex + 1} / 42`;
        }, index + 1);
      }
    }
    assert.equal(renderedDiagram, true, "at least one private SVG diagram must render in the student flow");
    assert.equal(await page.locator("#question-next").isHidden(), true, "next must hide on the final item");
    assert.equal(await page.locator("#assessment-submit").isVisible(), true, "submit must appear only on the final item");

    const submission = page.waitForResponse(function (response) { return diagnosticPost(response, "submit"); });
    await page.locator("#assessment-submit").click();
    const submitResponse = await submission;
    assert.equal(submitResponse.status(), 200);
    const submitted = await submitResponse.json();
    assert.equal(submitted.automaticScoredCount, 32);
    assert.equal(submitted.teacherReviewCount, 10);
    assert.ok(finalSaveBatchCount >= 2, `expected split final saves, received ${finalSaveBatchCount}`);
    await page.locator("#student-pending").waitFor({ state: "visible" });
    const attemptId = (await page.locator("#student-attempt-id").textContent()).trim();
    assert.match(attemptId, /^att-bdg-[a-f0-9]{16}$/);

    await page.locator("#workspace-tab-teacher").click();
    await page.locator("#teacher-attempt-id").fill(attemptId);
    await page.locator("#teacher-pin").fill(teacherPin);
    const teacherOpen = page.waitForResponse(function (response) { return diagnosticPost(response, "teacher-open"); });
    await page.locator("#teacher-entry-form").evaluate(function (form) { form.requestSubmit(); });
    assert.equal((await teacherOpen).status(), 200);
    await page.locator("#teacher-review").waitFor({ state: "visible" });
    assert.equal(await page.locator("#teacher-review-list .review-item").count(), 10);

    const reviewText = await page.locator(".student-raw-response").allTextContents();
    if (reviewText.length !== 10 || reviewText.some(function (value) { return !value || value === "(응답 없음)"; })) {
      teacherUiViolations.push("teacher review did not render all ten saved student responses");
    }
    const scoreControls = page.locator('#teacher-review-list select[aria-label$="점수"]');
    const errorControls = page.locator('#teacher-review-list select[aria-label$="오류 유형"]');
    assert.equal(await scoreControls.count(), 10);
    assert.equal(await errorControls.count(), 10);
    const expectedFirstErrorTypes = Array.from(new Set(manualItems[0].privateDraft.errorSignals.map(function (signal) {
      return signal.errorType;
    }).concat(manualItems[0].privateDraft.defaultErrorType)));
    const firstErrorValues = await errorControls.first().locator("option").evaluateAll(function (options) {
      return options.map(function (option) { return option.value; }).filter(Boolean);
    });
    assert.deepEqual(firstErrorValues, expectedFirstErrorTypes, "teacher must see exactly the error types accepted for this item");

    await scoreControls.first().selectOption("0");
    assert.equal(await errorControls.first().isDisabled(), false);
    await errorControls.first().selectOption(manualItems[0].privateDraft.defaultErrorType);
    await scoreControls.first().selectOption("1");
    for (let index = 1; index < 10; index += 1) await scoreControls.nth(index).selectOption("1");
    await page.waitForFunction(function () { return document.getElementById("teacher-finalize").disabled === false; });

    const finalized = page.waitForResponse(function (response) { return diagnosticPost(response, "teacher-finalize"); });
    await page.locator("#teacher-finalize").click();
    assert.equal((await finalized).status(), 200);
    await page.locator("#teacher-report").waitFor({ state: "visible" });
    assert.equal(await page.locator("#teacher-report .domain-result").count(), 5);
    assert.equal(await page.locator("#teacher-report .item-feedback-list > li").count(), 42);
    assert.match(await page.locator("#teacher-report .report-score").innerText(), /97\.6%\s*41\s*\/\s*42점/);
    assert.match(await page.locator("#teacher-report .report-score").innerText(), /진단 등급 · 준비 근거 확보/);
    assert.equal(await page.locator("#teacher-report .prescription-entry").count(), 10);
    assert.doesNotMatch(await page.locator(`#teacher-report .domain-result[data-domain-id="${prerequisiteItem.domainId}"]`).innerText(), /100%/);
    assert.match(await page.locator("#teacher-report .prescription-list").innerText(), /선수개념 보완/);
    assert.equal(await page.locator("#teacher-report .route-difficulty-list").count(), 10);
    assert.equal(await page.locator("#teacher-report .route-concept-link").count(), 10);
    assert.equal(await page.locator("#teacher-report .route-concept-link").first().getAttribute("href").then(function (href) { return href.startsWith("./concept-learning.html?cluster="); }), true);
    assert.doesNotMatch(await page.locator("#teacher-report .prescription-list").innerText(), /null%/);
    assert.equal(await page.locator("#teacher-report .route-resources").count(), 20);
    assert.match(await page.locator("#teacher-report .cadence-section").innerText(), /3주[\s\S]*주 2회 × 75분[\s\S]*D\+7/);
    assert.match(await page.locator("#teacher-report .assignment-lock").first().innerText(), /교사 승인 전/);
    const wrongFeedbackIndex = items.indexOf(prerequisiteItem);
    assert.match(await page.locator("#teacher-report .item-feedback-list > li").nth(wrongFeedbackIndex).innerText(), /0\/1점[\s\S]*선수개념 결손/);

    await page.locator("#workspace-tab-student").click();
    await page.locator("#student-result-refresh").click();
    await page.locator("#student-report").waitFor({ state: "visible" });
    assert.equal(await page.locator("#student-report .domain-result").count(), 5);
    assert.equal(await page.locator("#student-report .item-feedback-list > li").count(), 42);
    assert.match(await page.locator("#student-report .report-score").innerText(), /97\.6%\s*41\s*\/\s*42점/);
    assert.match(await page.locator("#student-report .report-score").innerText(), /진단 등급 · 준비 근거 확보/);
    assert.match(await page.locator("#student-report .prescription-list").innerText(), /선수개념 보완/);
    assert.equal(await page.locator("#student-report .route-resources").count(), 10);
    assert.equal(await page.locator("#student-report .route-concept-link").count(), 10);

    for (const width of [1440, 390, 320]) await noHorizontalOverflow(page, width);
    assert.deepEqual(teacherUiViolations, []);
    assert.deepEqual(errors, []);
  } finally {
    await page.close();
  }
});
