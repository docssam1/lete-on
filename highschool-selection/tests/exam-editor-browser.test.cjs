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

test("exam editor browser saves rapid score edits and remains usable on desktop and phone", async t => {
  const browserBinary = executablePath();
  assert.ok(browserBinary, "Chromium is required; run npm run install:browser in highschool-selection");
  const fixture = startFixture();
  t.after(() => { if (!fixture.child.killed) fixture.child.kill(); });
  const base = await fixture.ready;
  const browser = await chromium.launch({ headless: true, executablePath: browserBinary });
  t.after(() => browser.close());
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  const page = await context.newPage();
  const consoleErrors = [];
  const failedResources = [];
  const candidateRequests = [];
  const catalogRequests = [];
  page.on("console", message => {
    if (message.type() === "error" && !/^Failed to load resource:/.test(message.text())) consoleErrors.push(message.text());
  });
  page.on("pageerror", error => consoleErrors.push(error.message));
  page.on("response", response => {
    if (response.status() >= 400 && !/\/favicon\.ico(?:\?|$)/.test(response.url())) failedResources.push(`${response.status()} ${response.url()}`);
  });
  page.on("request", request => {
    if (request.url().includes("/admin/exam-editor/candidates")) candidateRequests.push(request.url());
    if (request.url().includes("/admin/question-bank/catalog")) catalogRequests.push(request.url());
  });

  await page.goto(`${base}/admin/exam-editor.html`);
  await page.waitForURL(/\/login\.html/);
  await page.locator("#name").fill("편집관리자");
  await page.locator("#code").fill("ADMIN-EDITOR");
  await Promise.all([
    page.waitForURL(/\/admin\/exam-editor\.html/),
    page.locator("#login-form button[type=submit]").click()
  ]);
  await page.locator("#draft-mode").selectOption("SH");
  await page.locator("#draft-create-form button[type=submit]").click();
  await page.locator("#editor-workspace").waitFor({ state: "visible" });
  await page.locator("#candidate-list .candidate-row").first().waitFor();
  assert.ok(candidateRequests.some(url => /[?&]draftId=draft_[A-Za-z0-9]+/.test(url)));
  assert.equal(candidateRequests.some(url => /[?&](mode|originalOnly)=/.test(url)), false);

  await page.locator('#candidate-mode [data-mode="catalog"]').click();
  await page.locator('#academy-profile-filters input[value="SH_SELECTION"]').uncheck();
  await page.locator('#academy-profile-filters input[value="DP_STANDARD"]').check();
  await page.locator("#candidate-list .candidate-row.is-catalog").waitFor();
  assert.match(await page.locator("#candidate-list .candidate-path").first().textContent(), /중2-1.*함수.*일차함수.*교점/);
  assert.equal(await page.locator("#candidate-list .candidate-row.is-catalog button").first().isDisabled(), true);
  await page.locator("#catalog-include-candidates").check();
  await page.waitForFunction(() => document.querySelector("#candidate-context")?.textContent.includes("후보를 함께"));
  assert.ok(catalogRequests.some(url => /[?&]includeCandidates=1(?:&|$)/.test(url)));
  await page.locator('#candidate-mode [data-mode="new"]').click();
  await page.locator("#candidate-list [data-candidate-id]").first().waitFor();

  await page.locator("#candidate-list [data-candidate-id]").first().click();
  const scoreInput = page.locator("[data-score-placement]").first();
  await scoreInput.waitFor();
  await scoreInput.fill("0");
  await scoreInput.dispatchEvent("change");
  await page.waitForFunction(() => document.querySelector("[data-score-placement]")?.value === "1");
  assert.match(await page.locator("#editor-alert").textContent(), /0보다 큰/);

  let releaseFirstPatch;
  const firstPatchSeen = new Promise(resolve => { releaseFirstPatch = resolve; });
  let delayed = false;
  await page.route("**/admin/exam-editor/drafts/*", async route => {
    const request = route.request();
    let operation = null;
    try { operation = JSON.parse(request.postData() || "{}").operation; } catch (_) {}
    if (!delayed && request.method() === "PATCH" && operation && operation.kind === "set_score") {
      delayed = true;
      releaseFirstPatch();
      await new Promise(resolve => setTimeout(resolve, 350));
    }
    await route.continue();
  });

  await scoreInput.fill("2");
  await scoreInput.dispatchEvent("change");
  await firstPatchSeen;
  await scoreInput.fill("3");
  await scoreInput.dispatchEvent("change");
  await page.waitForFunction(async () => {
    const draftId = new URLSearchParams(location.search).get("draftId");
    const response = await fetch(`/admin/exam-editor/drafts/${encodeURIComponent(draftId)}`, { credentials: "include" });
    if (!response.ok) return false;
    const packet = await response.json();
    return packet.draft.placements[0] && packet.draft.placements[0].score === 3;
  }, null, { timeout: 10000 });
  assert.equal(await scoreInput.inputValue(), "3");

  const previousDraftId = new URL(page.url()).searchParams.get("draftId");
  await page.evaluate(() => {
    const input = document.querySelector("[data-score-placement]");
    input.value = "4";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    document.querySelector("#change-draft").click();
  });
  await page.locator("#draft-create-form button[type=submit]").click();
  await page.waitForFunction(oldDraftId => new URLSearchParams(location.search).get("draftId") !== oldDraftId, previousDraftId);
  const previousDraftScore = await page.evaluate(async oldDraftId => {
    const response = await fetch(`/admin/exam-editor/drafts/${encodeURIComponent(oldDraftId)}`, { credentials: "include" });
    const packet = await response.json();
    return packet.draft.placements[0].score;
  }, previousDraftId);
  assert.equal(previousDraftScore, 4);

  const desktopOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  assert.equal(desktopOverflow, false);
  await page.setViewportSize({ width: 390, height: 844 });
  const phoneOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  assert.equal(phoneOverflow, false);
  assert.deepEqual(consoleErrors, []);
  assert.deepEqual(failedResources, []);
});
