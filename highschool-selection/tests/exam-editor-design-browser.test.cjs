"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { chromium } = require("playwright");

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

function startFixture() {
  const child = spawn(process.execPath, [path.join(__dirname, "fixtures", "exam-editor-browser-server.cjs")], {
    env: { ...process.env, PORT: "0" },
    stdio: ["ignore", "pipe", "pipe"]
  });
  const ready = new Promise((resolve, reject) => {
    let output = "";
    const timer = setTimeout(() => reject(new Error(`browser fixture start timed out: ${output}`)), 10000);
    child.stdout.on("data", chunk => {
      output += chunk.toString();
      const match = output.match(/http:\/\/127\.0\.0\.1:(\d+)/);
      if (match) { clearTimeout(timer); resolve(`http://127.0.0.1:${match[1]}`); }
    });
    child.stderr.on("data", chunk => { output += chunk.toString(); });
    child.once("exit", code => { clearTimeout(timer); reject(new Error(`browser fixture exited with ${code}: ${output}`)); });
  });
  return { child, ready };
}

async function openEditor(t, viewport = { width: 1440, height: 960 }) {
  const browserBinary = executablePath();
  assert.ok(browserBinary, "Chromium is required; run npm run install:browser in highschool-selection");
  const fixture = startFixture();
  t.after(() => { if (!fixture.child.killed) fixture.child.kill(); });
  const base = await fixture.ready;
  const browser = await chromium.launch({ headless: true, executablePath: browserBinary });
  t.after(() => browser.close());
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", message => {
    if (message.type() === "error" && !/^Failed to load resource:/.test(message.text())) consoleErrors.push(message.text());
  });
  page.on("pageerror", error => pageErrors.push(error.message));
  t.after(() => {
    assert.deepEqual(consoleErrors, [], "unexpected browser console errors");
    assert.deepEqual(pageErrors, [], "unexpected uncaught page errors");
  });
  await page.goto(`${base}/admin/exam-editor.html`);
  await page.waitForURL(/\/login\.html/);
  await page.locator("#name").fill("편집관리자");
  await page.locator("#code").fill("ADMIN-EDITOR");
  await Promise.all([
    page.waitForURL(/\/admin\/exam-editor\.html/),
    page.locator("#login-form button[type=submit]").click()
  ]);
  await page.locator("#draft-create-form button[type=submit]").click();
  await page.locator("#editor-workspace").waitFor({ state: "visible" });
  await page.locator("#candidate-list .candidate-row").first().waitFor();
  return { base, browser, context, page };
}

async function submitSearch(page, query) {
  await page.locator("#candidate-query").fill(query);
  await page.locator("#candidate-search-form button[type=submit]").click();
}

async function candidatePacket(page) {
  return page.evaluate(async () => {
    const draftId = new URLSearchParams(location.search).get("draftId");
    const response = await fetch(`/admin/exam-editor/candidates?draftId=${encodeURIComponent(draftId)}&limit=100`, { credentials: "include" });
    return response.json();
  });
}

function catalogItem(overrides = {}) {
  return {
    questionId: "DESIGN-PREVIEW-001",
    paperId: "DESIGN-PAPER",
    sourceLabel: "로컬 브라우저 검수 자료",
    number: 17,
    semester: "중학교 3학년 2학기 누적 과정",
    majorUnit: "함수와 도형을 함께 해석하는 매우 긴 대단원 이름",
    minorUnit: "좌표평면에서 조건을 빠짐없이 확인하고 여러 관계를 연결하는 긴 소단원 이름",
    typeId: "DESIGN-LONG-TYPE",
    typeLabel: "두 직선과 포물선의 교점 조건을 비교하여 가능한 모든 경우를 빠짐없이 판단하는 매우 긴 한국어 세부 유형명",
    conceptStatus: "pending",
    taxonomyReviewStatus: "new_type",
    withinCurrentRange: true,
    domainGroup: "algebra",
    difficultyBand: null,
    difficultyStatus: "pending",
    responseKind: null,
    responseStatus: "pending",
    releaseEligible: false,
    releaseBlockReason: "learner_fit_not_passed",
    pagePreviewAvailable: true,
    reviewChecks: {
      classification: false, locator: true, difficulty: false, response: false,
      keyCheck: true, learnerFit: false, method: false, variants: false, usageApproval: false
    },
    profiles: [{ profileId: "SH_SELECTION", label: "황소형", status: "candidate" }],
    ...overrides
  };
}

async function useLocalCatalog(page, items) {
  await page.route("**/admin/question-bank/catalog?*", route => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ profiles: [], representativeAnalyses: [], items, count: items.length })
  }));
  await page.locator('#candidate-mode [data-mode="catalog"]').click();
  await page.locator("#candidate-list .candidate-row.is-catalog").first().waitFor();
}

test("selected draft survives search and the same candidate cannot be added twice", async t => {
  const { page } = await openEditor(t);
  const first = page.locator("#candidate-list [data-candidate-id]").first();
  const itemId = await first.getAttribute("data-candidate-id");
  await first.click();
  await page.locator("#placement-list > [data-placement-id]").waitFor();
  assert.equal(await page.locator("#placement-list > [data-placement-id]").count(), 1);

  await submitSearch(page, itemId);
  await page.locator(`#candidate-list [data-candidate-id="${itemId}"]`).waitFor();
  const selectedCandidate = page.locator(`#candidate-list [data-candidate-id="${itemId}"]`);
  assert.equal(await selectedCandidate.textContent(), "담김");
  assert.equal(await selectedCandidate.isDisabled(), true);
  assert.equal(await page.locator("#placement-list > [data-placement-id]").count(), 1);
  assert.equal(await page.locator("#summary-items").textContent(), "1");
});

test("Korean composition suppresses Enter and input search is debounced by at least 250ms", async t => {
  const { page } = await openEditor(t);
  const requestTimes = [];
  page.on("request", request => {
    if (request.url().includes("/admin/exam-editor/candidates") && new URL(request.url()).searchParams.get("q")) {
      requestTimes.push({ time: Date.now(), query: new URL(request.url()).searchParams.get("q") });
    }
  });

  const started = Date.now();
  await page.locator("#candidate-query").evaluate(input => {
    input.focus();
    input.dispatchEvent(new CompositionEvent("compositionstart", { bubbles: true, data: "ㅎ" }));
    input.value = "함";
    input.dispatchEvent(new InputEvent("input", { bubbles: true, data: "함", inputType: "insertCompositionText", isComposing: true }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true, isComposing: true, keyCode: 229 }));
  });
  await page.waitForTimeout(320);
  assert.deepEqual(requestTimes, [], "composition input and Enter must not send a search");

  const ended = Date.now();
  await page.locator("#candidate-query").evaluate(input => {
    input.dispatchEvent(new CompositionEvent("compositionend", { bubbles: true, data: "함" }));
  });
  await page.waitForTimeout(320);
  assert.equal(requestTimes.length, 1);
  assert.equal(requestTimes[0].query, "함");
  assert.ok(requestTimes[0].time - ended >= 230, `search was sent too early after compositionend (${requestTimes[0].time - ended}ms)`);
  assert.ok(requestTimes[0].time - started >= 550);
});

test("latest search wins; loading, empty, failure and retry are distinct without losing the draft", async t => {
  const { page } = await openEditor(t);
  const packet = await candidatePacket(page);
  assert.ok(packet.items.length >= 2);
  await page.locator("#candidate-list [data-candidate-id]").first().click();
  await page.locator("#placement-list > [data-placement-id]").waitFor();
  const draftId = new URL(page.url()).searchParams.get("draftId");
  let retryAttempts = 0;

  await page.route("**/admin/exam-editor/candidates?*", async route => {
    const query = new URL(route.request().url()).searchParams.get("q") || "";
    if (query === "느린검색") {
      await new Promise(resolve => setTimeout(resolve, 420));
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ items: [packet.items[0]] }) });
    }
    if (query === "최신검색") {
      await new Promise(resolve => setTimeout(resolve, 40));
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ items: [packet.items[1]] }) });
    }
    if (query === "빈결과") return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ items: [] }) });
    if (query === "재시도검색") {
      retryAttempts += 1;
      if (retryAttempts === 1) return route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ message: "검색 서버 연결 실패" }) });
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ items: [packet.items[1]] }) });
    }
    return route.continue();
  });

  await submitSearch(page, "느린검색");
  await page.waitForFunction(() => document.querySelector("#candidate-list")?.getAttribute("aria-busy") === "true");
  assert.equal(await page.locator("#candidate-list .candidate-row").count(), 0, "loading must clear previous rows");
  await submitSearch(page, "최신검색");
  await page.locator(`#candidate-list [data-candidate-id="${packet.items[1].itemId}"]`).waitFor();
  await page.waitForTimeout(500);
  assert.equal(await page.locator(`#candidate-list [data-candidate-id="${packet.items[0].itemId}"]`).count(), 0);

  await submitSearch(page, "빈결과");
  await page.locator("#candidate-empty").waitFor({ state: "visible" });
  await page.waitForFunction(() => document.querySelector("#candidate-list")?.getAttribute("aria-busy") !== "true");
  assert.match(await page.locator("#candidate-empty").textContent(), /없/);
  assert.equal(await page.locator("#candidate-retry").isVisible(), false);

  await submitSearch(page, "재시도검색");
  await page.locator("#candidate-retry").waitFor({ state: "visible" });
  assert.match(await page.locator("#editor-alert").textContent(), /실패|불러오지 못|연결/);
  assert.equal(await page.locator("#candidate-query").inputValue(), "재시도검색");
  assert.equal(new URL(page.url()).searchParams.get("draftId"), draftId);
  assert.equal(await page.locator("#placement-list > [data-placement-id]").count(), 1);
  await page.locator("#candidate-retry").click();
  await page.locator(`#candidate-list [data-candidate-id="${packet.items[1].itemId}"]`).waitFor();
  assert.equal(retryAttempts, 2);
  assert.equal(await page.locator("#candidate-query").inputValue(), "재시도검색");
  assert.equal(await page.locator("#placement-list > [data-placement-id]").count(), 1);
});

test("a search response does not replace the focused score input or its unsaved value", async t => {
  const { page } = await openEditor(t);
  const packet = await candidatePacket(page);
  await page.locator("#candidate-list [data-candidate-id]").first().click();
  const score = page.locator("[data-score-placement]").first();
  await score.waitFor();
  await page.route("**/admin/exam-editor/candidates?*", async route => {
    if (new URL(route.request().url()).searchParams.get("q") !== "초점보존") return route.continue();
    await new Promise(resolve => setTimeout(resolve, 80));
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ items: packet.items }) });
  });

  await score.focus();
  await score.fill("7");
  assert.equal(await page.locator("#score-save-status").isVisible(), true);
  assert.match(await page.locator("#summary-score").evaluate(node => node.parentElement.textContent), /저장된 배점 합계/);
  const marker = await score.evaluate(node => {
    node.dataset.focusProbe = "same-node";
    const query = document.querySelector("#candidate-query");
    query.value = "초점보존";
    query.dispatchEvent(new InputEvent("input", { bubbles: true, data: "초점보존", inputType: "insertText" }));
    return node.dataset.scorePlacement;
  });
  await page.waitForFunction(() => document.querySelector("#candidate-list")?.getAttribute("aria-busy") === "true");
  await page.waitForFunction(() => document.querySelector("#candidate-list")?.getAttribute("aria-busy") !== "true");
  const result = await page.evaluate(placementId => {
    const node = document.querySelector(`[data-score-placement="${placementId}"]`);
    return {
      exists: Boolean(node),
      sameNode: node && node.dataset.focusProbe === "same-node",
      value: node && node.value,
      focused: document.activeElement === node
    };
  }, marker);
  assert.deepEqual(result, { exists: true, sameNode: true, value: "7", focused: true });
  await page.waitForFunction(() => document.querySelector("#summary-score").textContent === "7" && document.querySelector("#score-save-status").hidden);
});

test("original-page preview owns loading/error lifecycle, cannot late-reopen, and never changes the draft", async t => {
  const { page } = await openEditor(t);
  await useLocalCatalog(page, [catalogItem()]);
  const preview = page.locator('[data-page-preview-id="DESIGN-PREVIEW-001"]');
  const placementCount = await page.locator("#placement-list > [data-placement-id]").count();
  let releaseLate;
  let previewAttempt = 0;
  const onePixelPng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64");

  await page.route("**/admin/question-bank/items/*/page-preview", async route => {
    previewAttempt += 1;
    if (previewAttempt === 1) {
      await new Promise(resolve => { releaseLate = resolve; });
      return route.fulfill({ status: 200, contentType: "image/png", headers: { "cache-control": "no-store" }, body: onePixelPng });
    }
    if (previewAttempt === 2) return route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ message: "원본 페이지 연결 실패" }) });
    if (previewAttempt === 3) return route.fulfill({ status: 200, contentType: "image/png", headers: { "cache-control": "no-store" }, body: Buffer.from("not-an-image") });
    return route.fulfill({ status: 200, contentType: "image/png", headers: { "cache-control": "no-store" }, body: onePixelPng });
  });

  await preview.click();
  await page.locator("#question-page-dialog").waitFor({ state: "visible" });
  assert.match(await page.locator("#question-page-status").textContent(), /불러오|로딩|준비/);
  assert.equal(await page.locator("#question-page-image").getAttribute("src"), null);
  await page.keyboard.press("Escape");
  await page.locator("#question-page-dialog").waitFor({ state: "hidden" });
  releaseLate();
  await page.waitForTimeout(150);
  assert.equal(await page.locator("#question-page-dialog").isVisible(), false);
  assert.equal(await page.locator("#question-page-image").getAttribute("src"), null);
  assert.equal(await preview.evaluate(node => document.activeElement === node), true);

  await preview.click();
  await page.locator("#question-page-status").waitFor();
  await page.waitForFunction(() => /실패|불러오지 못/.test(document.querySelector("#question-page-status")?.textContent || ""));
  assert.equal(await page.locator("#question-page-image").getAttribute("src"), null);
  assert.equal(await page.locator("#question-page-retry").isVisible(), true);
  await page.locator("#close-question-page").click();

  await preview.click();
  for (let index = 0; index < 40 && previewAttempt < 3; index += 1) await page.waitForTimeout(50);
  assert.equal(previewAttempt, 3, "the decode-error preview request must be issued");
  await page.waitForTimeout(500);
  assert.match(await page.locator("#question-page-status").textContent(), /실패|이미지|표시|불러오지 못/);
  assert.equal(await page.locator("#question-page-image").getAttribute("src"), null, "decode failure must not show a broken image");
  await page.locator("#close-question-page").click();

  await preview.click();
  await page.waitForFunction(() => Boolean(document.querySelector("#question-page-image")?.getAttribute("src")));
  await page.locator("#close-question-page").click();
  assert.equal(await preview.evaluate(node => document.activeElement === node), true);
  assert.equal(await page.locator("#placement-list > [data-placement-id]").count(), placementCount);
  assert.equal(await page.locator("#summary-items").textContent(), String(placementCount));
});

test("mobile selection summary stays accurate and focused draft controls remain above it", async t => {
  const { page } = await openEditor(t);
  await page.locator("#candidate-list [data-candidate-id]").first().click();
  const score = page.locator("[data-score-placement]").first();
  await score.waitFor();
  assert.equal(await page.locator(".editor-mobile-summary").isVisible(), false);

  await page.setViewportSize({ width: 390, height: 844 });
  const summary = page.locator(".editor-mobile-summary");
  await summary.waitFor({ state: "visible" });
  assert.equal(await page.locator("#mobile-selection-count").textContent(), "1");
  assert.equal(await summary.getAttribute("href"), "#draft-pane-title");
  await score.focus();
  await page.waitForTimeout(100);
  const positions = await page.evaluate(() => {
    const focused = document.activeElement && document.activeElement.getBoundingClientRect();
    const summaryBox = document.querySelector(".editor-mobile-summary").getBoundingClientRect();
    return { focusedBottom: focused.bottom, focusedTop: focused.top, summaryTop: summaryBox.top };
  });
  assert.ok(positions.focusedTop >= 0, "focused score input must be scrolled into view");
  assert.ok(positions.focusedBottom <= positions.summaryTop, "fixed mobile summary must not cover the focused score input");
});

test("long Korean catalog rows wrap without overflow and editor controls remain touch and keyboard accessible", async t => {
  const { page } = await openEditor(t);
  await useLocalCatalog(page, [catalogItem()]);

  async function assertLayout(width, height, snapshotName) {
    await page.setViewportSize({ width, height });
    const layout = await page.evaluate(() => {
      const row = document.querySelector("#candidate-list .candidate-row");
      const type = row && row.querySelector(".candidate-title strong");
      const path = row && row.querySelector(".candidate-path");
      const controls = Array.from(document.querySelectorAll("#editor-workspace button:not([hidden]), #editor-workspace input:not([hidden]), #editor-workspace select:not([hidden])"))
        .filter(node => node.getClientRects().length && getComputedStyle(node).visibility !== "hidden")
        .map(node => {
          const target = node.matches('input[type="checkbox"], input[type="radio"]') ? node.closest("label") || node : node;
          return {
            id: node.id,
            tag: node.tagName,
            inputType: node.getAttribute("type") || "",
            height: target.getBoundingClientRect().height,
            fontSize: parseFloat(getComputedStyle(node).fontSize)
          };
        });
      return {
        pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        rowOverflow: row ? row.scrollWidth > row.clientWidth + 1 : true,
        typeOverflow: type ? type.scrollWidth > type.clientWidth + 1 : true,
        pathOverflow: path ? path.scrollWidth > path.clientWidth + 1 : true,
        controls
      };
    });
    assert.equal(layout.pageOverflow, false, `${width}px page overflow`);
    assert.equal(layout.rowOverflow, false, `${width}px candidate row overflow`);
    assert.equal(layout.typeOverflow, false, `${width}px long type overflow`);
    assert.equal(layout.pathOverflow, false, `${width}px long path overflow`);
    assert.ok(layout.controls.length > 0);
    assert.deepEqual(layout.controls.filter(control => control.height < 43.5), [], `${width}px controls smaller than 44px`);
    if (width === 390) assert.deepEqual(layout.controls.filter(control => control.tag === "INPUT" && !["checkbox", "radio"].includes(control.inputType) && control.fontSize < 16), [], "mobile text inputs must be at least 16px");
    if (process.env.OUTPUT_DIR) {
      fs.mkdirSync(process.env.OUTPUT_DIR, { recursive: true });
      await page.screenshot({ path: path.join(process.env.OUTPUT_DIR, snapshotName), fullPage: true });
    }
  }

  await assertLayout(1440, 960, "exam-editor-design-qa-fixture-1440.png");
  await assertLayout(390, 844, "exam-editor-design-qa-fixture-390.png");
  await page.locator("#candidate-query").focus();
  const focusStyle = await page.locator("#candidate-query").evaluate(node => {
    const style = getComputedStyle(node);
    return { outlineStyle: style.outlineStyle, outlineWidth: parseFloat(style.outlineWidth), boxShadow: style.boxShadow };
  });
  assert.ok((focusStyle.outlineStyle !== "none" && focusStyle.outlineWidth >= 2) || focusStyle.boxShadow !== "none", "focused search input needs a visible focus indicator");
});
