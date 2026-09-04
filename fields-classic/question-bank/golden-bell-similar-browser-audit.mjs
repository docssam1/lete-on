import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js";

const runtimeModules = process.env.CODEX_NODE_MODULES
  || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const { chromium } = await import(pathToFileURL(path.join(runtimeModules, "playwright", "index.mjs")).href);
const baseUrl = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";

function unlockedProgress() {
  return Object.fromEntries(GOLDEN_BELL_BOOKS.map((book) => [
    book.id,
    Object.fromEntries(book.lessons.map((lesson) => [lesson.id, { original: true }]))
  ]));
}

async function auditViewport(browser, viewport, label) {
  const student = `SIMILAR-${label.toUpperCase()}`;
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("ERR_NETWORK_ACCESS_DENIED")) errors.push(message.text());
  });
  await page.addInitScript(({ key, progress }) => localStorage.setItem(key, JSON.stringify(progress)), {
    key: `fields-classic-golden-bell:${student}`,
    progress: unlockedProgress()
  });

  let audited = 0;
  for (const book of GOLDEN_BELL_BOOKS) {
    await page.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=${student}&book=${book.id}`, { waitUntil: "networkidle" });
    for (const lesson of book.lessons) {
      await page.locator(`.lesson-button[data-lesson="${lesson.id}"]`).click();
      const extensionStep = page.locator('.stage-step[data-phase="extension"]');
      assert.equal(await extensionStep.isDisabled(), false, `${label}/${book.id}/${lesson.id}: additional learning is locked`);
      await extensionStep.click();
      assert.match(await page.locator(".daily-quiz-head aside").innerText(), /2문제 중 1번째[\s\S]*이 권 8문제[\s\S]*약 30분/u, `${label}/${book.id}/${lesson.id}: daily workload label missing`);
      assert.equal(await page.locator(".extension-solution").count(), 0, `${label}/${book.id}/${lesson.id}: first solution leaked`);
      await page.locator("[data-extension-skip]").click();
      await page.locator('[data-check="extension"]').click();

      assert.match(await page.locator(".daily-quiz-head aside strong").innerText(), /2문제 중 2번째/u, `${label}/${book.id}/${lesson.id}: similar problem did not open`);
      assert.equal(await page.locator(".extension-solution").count(), 0, `${label}/${book.id}/${lesson.id}: similar solution leaked`);
      const visual = await page.locator(".quiz-visual").evaluate((node) => {
        const rect = node.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          contentLength: node.textContent.trim().length + node.querySelectorAll("svg, table, ol, ul, div").length,
          overflow: node.scrollWidth > node.clientWidth + 1
        };
      });
      assert.ok(visual.width > 120 && visual.height > 40 && visual.contentLength > 0, `${label}/${book.id}/${lesson.id}: similar visual is blank: ${JSON.stringify(visual)}`);
      assert.equal(visual.overflow, false, `${label}/${book.id}/${lesson.id}: similar visual overflows its panel`);
      await page.locator("[data-extension-answer]").click();
      assert.match(await page.locator(".extension-solution").innerText(), /풀이[\s\S]*답/u, `${label}/${book.id}/${lesson.id}: worked solution or answer missing`);
      const sizes = await page.locator(".extension-study>strong, .extension-study input, .extension-study button, .extension-solution p").evaluateAll((nodes) => nodes.map((node) => ({
        fontSize: Number.parseFloat(getComputedStyle(node).fontSize),
        height: node.matches("button, input") ? node.getBoundingClientRect().height : null
      })));
      assert.ok(sizes.every(({ fontSize }) => fontSize >= 14), `${label}/${book.id}/${lesson.id}: similar-practice text is too small: ${JSON.stringify(sizes)}`);
      assert.ok(sizes.filter(({ height }) => height != null).every(({ height }) => height >= 40), `${label}/${book.id}/${lesson.id}: similar-practice touch control is too small: ${JSON.stringify(sizes)}`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), false, `${label}/${book.id}/${lesson.id}: page has horizontal overflow`);
      audited += 1;
    }
  }
  assert.deepEqual(errors, [], `${label}: browser errors: ${errors.join(" | ")}`);
  await page.close();
  return audited;
}

const browser = await chromium.launch({ headless: true });
try {
  const desktop = await auditViewport(browser, { width: 1440, height: 1050 }, "desktop");
  const mobile = await auditViewport(browser, { width: 390, height: 844 }, "mobile");
  console.log(`GOLDEN_BELL_SIMILAR_BROWSER_OK desktop=${desktop} mobile=${mobile} solutions=80 workload=8/30min`);
} finally {
  await browser.close();
}
