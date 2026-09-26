import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-library.js";

const runtimeModules = process.env.CODEX_NODE_MODULES
  || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const { chromium } = await import(pathToFileURL(path.join(runtimeModules, "playwright", "index.mjs")).href);
const baseUrl = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const sourceAnimationLessons = new Set(["hidden-cube-count", "catch-up-acorns"]);
const books = GOLDEN_BELL_BOOKS
  .filter((book) => /^book-(0[2-9]|10)$/u.test(book.id))
  .map((book) => ({
    ...book,
    lessons: book.lessons.filter((lesson) => lesson.experience?.kind === "progressive-concept" && !sourceAnimationLessons.has(lesson.id))
  }))
  .filter((book) => book.lessons.length);
const protectedFixture = {};
const visitProtectedRefs = (node) => {
  if (!node || typeof node !== "object") return;
  if (node.answerRef) protectedFixture[node.answerRef] = {
    answer: Array.isArray(node.options) && node.options.length ? node.options[0] : "0",
    solution: "조건을 그림에 표시하고 관계를 계산한 뒤 원래 조건에 넣어 확인합니다."
  };
  Object.values(node).forEach(visitProtectedRefs);
};
GOLDEN_BELL_BOOKS.forEach(visitProtectedRefs);
const runId = Date.now();
const captureDirectory = process.env.FIELDS_CAPTURE_DIR || "";
if (captureDirectory) await fs.mkdir(captureDirectory, { recursive: true });
const captureLessons = new Set(["polyomino-family-count", "vertical-shape-cryptarithm"]);

async function preparePage(page, student) {
  await page.route("**/functions/v1/fields-auth", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "{}" }));
  await page.route("**/functions/v1/golden-bell-answers", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ answers: protectedFixture }) }));
  await page.addInitScript(({ name }) => {
    sessionStorage.setItem("gfield_fields_session", "progressive-browser-audit");
    sessionStorage.setItem("gf_n", name);
  }, { name: student });
}

async function auditViewport(browser, viewport, label) {
  let audited = 0;
  for (const book of books) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const student = `PROGRESSIVE-${label}-${book.id}-${runId}`;
    await preparePage(page, student);
    await page.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=${student}&book=${book.id}`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => !document.querySelector(".protected-answer-notice"));

    for (const lesson of book.lessons) {
      await page.locator(`.lesson-button[data-lesson="${lesson.id}"]`).click();
      const experience = page.locator(`.progressive-concept[data-progressive-family="${lesson.experience.family}"]`);
      assert.equal(await experience.count(), 1, `${label}/${book.id}/${lesson.id}: progressive concept missing`);
      const frames = [];
      for (let step = 0; step < lesson.experience.beats.length; step += 1) {
        const visual = experience.locator(".progressive-visual");
        assert.equal(await visual.count(), 1, `${label}/${book.id}/${lesson.id}/${step + 1}: visual missing`);
        const html = (await visual.innerHTML()).replace(/\s+/gu, " ").trim();
        assert.ok(html.length > 20, `${label}/${book.id}/${lesson.id}/${step + 1}: visual is empty`);
        assert.doesNotMatch(html, /\b(?:NaN|undefined)\b/u, `${label}/${book.id}/${lesson.id}/${step + 1}: invalid visual value`);
        frames.push(html);
        const overflow = await experience.locator(".progressive-concept-scene").evaluate((node) => node.scrollWidth > node.clientWidth + 2);
        assert.equal(overflow, false, `${label}/${book.id}/${lesson.id}/${step + 1}: concept scene overflows`);
        assert.equal(await experience.locator(".progressive-check").count(), step === lesson.experience.beats.length - 1 ? 1 : 0, `${label}/${book.id}/${lesson.id}/${step + 1}: answer timing changed`);
        if (captureDirectory && captureLessons.has(lesson.id)) {
          await experience.screenshot({ path: path.join(captureDirectory, `${label}-${lesson.id}-step${step + 1}.png`) });
        }
        if (step < lesson.experience.beats.length - 1) await experience.locator('[data-experience-action="next"]').click();
      }
      assert.ok(new Set(frames).size > 1, `${label}/${book.id}/${lesson.id}: every concept frame is identical`);
      const answerButton = experience.locator("[data-experience-answer]");
      assert.equal(await answerButton.isDisabled(), false, `${label}/${book.id}/${lesson.id}: answer control is disabled`);
      await answerButton.click();
      assert.match(await experience.locator(".feedback").innerText(), /답:/u, `${label}/${book.id}/${lesson.id}: protected answer feedback missing`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), false, `${label}/${book.id}/${lesson.id}: page overflows`);
      audited += 1;
    }
    assert.deepEqual(errors, [], `${label}/${book.id}: browser errors: ${errors.join(" | ")}`);
    await page.close();
  }
  return audited;
}

const browser = await chromium.launch({ headless: true });
try {
  const desktop = await auditViewport(browser, { width: 1440, height: 1050 }, "desktop");
  const mobile = await auditViewport(browser, { width: 390, height: 844 }, "mobile");
  console.log(`GOLDEN_BELL_PROGRESSIVE_BROWSER_OK books=${books.map((book) => book.id).join(",")} desktop=${desktop} mobile=${mobile} answerHiddenBeforeFinal=pass overflow=pass`);
} finally {
  await browser.close();
}
