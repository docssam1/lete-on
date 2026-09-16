import assert from "node:assert/strict";
import { chromium } from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";

const baseUrl = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8765").replace(/\/$/, "");
const browser = await chromium.launch({ headless: true });
const errors = [];

function watch(page, label) {
  page.on("console", (message) => {
    if (message.type() === "error") {
      const source = message.location().url || "unknown source";
      errors.push(`${label}: ${message.text()} (${source})`);
    }
  });
  page.on("pageerror", (error) => errors.push(`${label}: ${error.message}`));
}

async function prepare(page, { corruptProfile = false, tutorialDone = true } = {}) {
  await page.addInitScript(({ corruptProfile, tutorialDone }) => {
    localStorage.setItem("gfield-language", "ko");
    localStorage.setItem("gfield-audio-muted", "true");
    localStorage.setItem("gfield-profile", corruptProfile ? "not-json" : "{}");
    if (tutorialDone) localStorage.setItem("gfield-shape-build-tutorial-v1", "done");
  }, { corruptProfile, tutorialDone });
}

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  watch(page, "desktop");
  await prepare(page, { corruptProfile: true });
  await page.goto(`${baseUrl}/geometry/cube-town/`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".game-card.ready").count(), 12, "corrupt profile must not blank the catalog");

  await page.locator('[data-game-id="copy-build"]').click();
  await page.locator("#copyLevelDialog").waitFor({ state: "visible" });
  assert.equal(await page.locator(".copy-level-card").count(), 5);
  await page.locator(".copy-level-card").first().click();
  await page.waitForURL(/\/geometry\/games\/copy-build\/\?level=1$/);
  await page.locator("#targetCanvas canvas").waitFor({ state: "visible" });

  const copyLevelButton = page.locator("#problemProgress");
  assert.equal(await copyLevelButton.isVisible(), true);
  assert.match(await copyLevelButton.textContent(), /^레벨 1 · 1\/10$/);
  await copyLevelButton.click();
  assert.equal(await page.locator("#levelOptions .level-option").count(), 5);
  await page.locator("#levelOptions .level-option").nth(3).click();
  await page.waitForURL(/\/geometry\/games\/shape-build\/\?level=4$/);
  await page.locator("#targetCanvas canvas").waitFor({ state: "visible" });

  const shapeLevelButton = page.locator("#topLevelPickerButton");
  assert.equal(await shapeLevelButton.isVisible(), true);
  assert.equal(await shapeLevelButton.textContent(), "레벨 4");
  await shapeLevelButton.click();
  assert.equal(await page.locator("#levelOptions .level-option").count(), 5);
  await page.locator("#levelOptions .level-option").first().click();
  await page.waitForURL(/\/geometry\/games\/copy-build\/\?level=1$/);

  const mobile = await browser.newPage({ viewport: { width: 844, height: 390 } });
  watch(mobile, "mobile-landscape");
  await prepare(mobile);
  await mobile.goto(`${baseUrl}/geometry/games/shape-build/?level=4`, { waitUntil: "networkidle" });
  await mobile.locator("#targetCanvas canvas").waitFor({ state: "visible" });
  assert.equal(await mobile.locator("#topLevelPickerButton").isVisible(), true);
  assert.ok(await mobile.locator("#topLevelPickerButton").boundingBox(), "mobile level picker needs a stable hit target");

  const english = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  watch(english, "english");
  await english.addInitScript(() => {
    localStorage.setItem("gfield-language", "en");
    localStorage.setItem("gfield-audio-muted", "true");
    localStorage.setItem("gfield-shape-build-tutorial-v1", "done");
  });
  await english.goto(`${baseUrl}/geometry/games/shape-build/?level=4`, { waitUntil: "networkidle" });
  assert.equal(await english.locator("#topLevelPickerButton").textContent(), "Level 4");

  const tutorial = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  watch(tutorial, "tutorial");
  await prepare(tutorial, { tutorialDone: false });
  await tutorial.goto(`${baseUrl}/geometry/games/shape-build/?level=4`, { waitUntil: "networkidle" });
  assert.equal(await tutorial.locator(".gft-veil").isVisible(), true);
  await tutorial.locator(".gft-skip").click();
  await tutorial.locator("#topLevelPickerButton").click();
  assert.equal(await tutorial.locator("#levelDialog").isVisible(), true);

  if (baseUrl.startsWith("http://127.0.0.1") || baseUrl.startsWith("http://localhost")) {
    const offlineContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const offline = await offlineContext.newPage();
    watch(offline, "offline");
    await prepare(offline);
    await offline.goto(`${baseUrl}/geometry/cube-town/`, { waitUntil: "networkidle" });
    await offline.evaluate(async () => { await navigator.serviceWorker.ready; });
    await offline.reload({ waitUntil: "networkidle" });
    await offlineContext.setOffline(true);
    await offline.goto(`${baseUrl}/geometry/games/copy-build/?level=2`, { waitUntil: "domcontentloaded" });
    await offline.locator("#targetCanvas canvas").waitFor({ state: "visible", timeout: 15000 });
    assert.match(offline.url(), /\/geometry\/games\/copy-build\/\?level=2$/);
    await offlineContext.setOffline(false);
    await offlineContext.close();
  }
} finally {
  await browser.close();
}

assert.deepEqual(errors, []);
console.log(`Cube Town access check passed against ${baseUrl}: catalog recovery, 1-5 routing, tutorial exit, mobile landscape, and offline query navigation.`);
