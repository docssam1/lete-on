import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";

const runtimeModules = process.env.CODEX_NODE_MODULES
  || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const { chromium } = await import(pathToFileURL(path.join(runtimeModules, "playwright", "index.mjs")).href);
const baseUrl = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const browser = await chromium.launch({ headless: true });
const expectedOfflineError = (message) => message.includes("ERR_NETWORK_ACCESS_DENIED");

async function auditViewport(viewport, label) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error" && !expectedOfflineError(message.text())) errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  let lessonCount = 0;
  for (let bookNumber = 1; bookNumber <= 10; bookNumber += 1) {
    const bookId = `book-${String(bookNumber).padStart(2, "0")}`;
    await page.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=BROWSER-AUDIT&book=${bookId}`, { waitUntil: "networkidle" });
    const lessons = await page.locator(".lesson-button").evaluateAll((nodes) => nodes.map((node) => node.dataset.lesson));
    assert.equal(lessons.length, 4, `${label}/${bookId}: expected four lessons`);
    for (const lessonId of lessons) {
      await page.locator(`.lesson-button[data-lesson="${lessonId}"]`).click();
      assert.equal(await page.locator(".concept-tutorial").count(), 1, `${label}/${bookId}/${lessonId}: tutorial missing`);
      assert.ok(await page.locator(".tutorial-steps li").count() >= 2, `${label}/${bookId}/${lessonId}: tutorial steps missing`);
      assert.equal(await page.locator(".tutorial-steps li p:empty").count(), 0, `${label}/${bookId}/${lessonId}: empty tutorial step`);
      assert.ok((await page.locator(".tutorial-check span").innerText()).trim(), `${label}/${bookId}/${lessonId}: tutorial check missing`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      assert.equal(overflow, false, `${label}/${bookId}/${lessonId}: horizontal overflow`);
      lessonCount += 1;
    }
  }

  assert.deepEqual(errors, [], `${label}: browser errors: ${errors.join(" | ")}`);
  await page.close();
  return lessonCount;
}

async function auditGeometryAndPrint() {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
  await page.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=BROWSER-AUDIT&book=book-06`, { waitUntil: "networkidle" });
  await page.locator('.lesson-button[data-lesson="rectangle-missing-side"]').click();
  await page.locator('.stage-step[data-phase="original"]').click();
  const labelSizes = await page.locator(".b6-geometry .measure-label, .b6-geometry .note").evaluateAll((nodes) => nodes.map((node) => ({
    text: node.textContent.trim(),
    size: Number.parseFloat(getComputedStyle(node).fontSize)
  })));
  assert.ok(labelSizes.length >= 4, "book-06 rectangle measurement labels missing");
  assert.ok(labelSizes.every(({ size }) => size >= 14), `book-06 rectangle labels too small: ${JSON.stringify(labelSizes)}`);

  await page.evaluate(() => { window.print = () => {}; });
  await page.locator("#printBookButton").click();
  assert.equal(await page.locator(".gold-print-page").count(), 8, "book print must contain eight pages");
  await page.close();
  return labelSizes.length;
}

try {
  const desktopLessons = await auditViewport({ width: 1440, height: 1050 }, "desktop");
  const mobileLessons = await auditViewport({ width: 390, height: 844 }, "mobile");
  const geometryLabels = await auditGeometryAndPrint();
  console.log(`GOLDEN_BELL_BROWSER_OK desktop=${desktopLessons} mobile=${mobileLessons} geometryLabels=${geometryLabels} printPages=8`);
} finally {
  await browser.close();
}
