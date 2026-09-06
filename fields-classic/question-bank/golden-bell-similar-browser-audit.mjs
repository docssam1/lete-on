import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js";
import { hydrateProtectedAnswers } from "./golden-bell-protected.js";

const runtimeModules = process.env.CODEX_NODE_MODULES
  || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = await import(pathToFileURL(path.join(runtimeModules, "playwright", "index.mjs")).href);
const baseUrl = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(new URL(baseUrl).hostname), "Private answer fixtures may only be used against a local test server");
assert.ok(process.env.FIELDS_PRIVATE_ANSWER_BANK, "Set FIELDS_PRIVATE_ANSWER_BANK to a private fixture; do not embed answers");
const privateBank = JSON.parse(await readFile(process.env.FIELDS_PRIVATE_ANSWER_BANK, "utf8"));
for (const book of GOLDEN_BELL_BOOKS) hydrateProtectedAnswers(structuredClone(book), privateBank.books[book.id]);
const output = process.env.FIELDS_CAPTURE_DIR;
if (output) await mkdir(output, { recursive: true });
const results = [];

function unlockedProgress() {
  return Object.fromEntries(GOLDEN_BELL_BOOKS.map((book) => [
    book.id,
    Object.fromEntries(book.lessons.map((lesson) => [lesson.id, { original: true }]))
  ]));
}

async function auditViewport(browser, viewport, label) {
  const student = `SIMILAR-${label.toUpperCase()}`;
  const page = await browser.newPage({ viewport, isMobile: label === "mobile", hasTouch: label === "mobile" });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("ERR_NETWORK_ACCESS_DENIED")) errors.push(message.text());
  });
  await page.addInitScript(({ key, progress }) => {
    localStorage.setItem(key, JSON.stringify(progress));
    sessionStorage.setItem("gfield_fields_session", "isolated-similar-audit");
  }, {
    key: `fields-classic-golden-bell:${student}`,
    progress: unlockedProgress()
  });
  await page.route("**/functions/v1/fields-auth", route => route.fulfill({ status: 200, contentType: "application/json", body: "{}" }));
  await page.route("**/functions/v1/golden-bell-answers", route => {
    const { bookId } = route.request().postDataJSON();
    assert.ok(privateBank.books[bookId], `Missing private fixture for ${bookId}`);
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ answers: privateBank.books[bookId] }) });
  });

  let audited = 0;
  for (const book of GOLDEN_BELL_BOOKS) {
    await page.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=${student}&book=${book.id}`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => !document.querySelector(".protected-answer-notice"));
    for (const lesson of book.lessons) {
      await page.locator(`.lesson-button[data-lesson="${lesson.id}"]`).click();
      const extensionStep = page.locator('.stage-step[data-phase="extension"]');
      assert.equal(await extensionStep.isDisabled(), false, `${label}/${book.id}/${lesson.id}: additional learning is locked`);
      await extensionStep.click();
      const items = [lesson.extension, ...(lesson.similarPractice || [])];
      const workloadPattern = new RegExp(`${items.length}문제 중 1번째[\\s\\S]*이 권 ${book.dailyPractice.problemCount}문제[\\s\\S]*약 ${book.dailyPractice.estimatedMinutes}분`, "u");
      assert.match(await page.locator(".daily-quiz-head aside").innerText(), workloadPattern, `${label}/${book.id}/${lesson.id}: daily workload label missing`);
      for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
        assert.equal(await page.locator(".daily-quiz-head aside strong").innerText(), `${items.length}문제 중 ${itemIndex + 1}번째`, `${label}/${book.id}/${lesson.id}: additional problem did not open`);
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
        results.push({ viewport: label, book: book.id, lesson: lesson.id, item: itemIndex + 1, render: "pass", solution: "pass", overflow: "pass" });
        if (itemIndex + 1 < items.length) await page.locator('[data-check="extension"]').click();
      }
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
  console.log(`GOLDEN_BELL_SIMILAR_BROWSER_OK desktop=${desktop} mobile=${mobile} itemViews=${results.length} auth=isolated-fixture math=not-audited duration=estimate-only`);
} finally {
  if (output) await writeFile(path.join(output, "similar-browser-audit.json"), JSON.stringify({ scope: "Isolated authorization fixtures; interaction/render checks, not independent mathematics or live authorization", results }, null, 2));
  await browser.close();
}
