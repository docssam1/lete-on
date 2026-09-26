import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-library.js";

const runtimeModules = process.env.CODEX_NODE_MODULES
  || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const { chromium } = await import(pathToFileURL(path.join(runtimeModules, "playwright", "index.mjs")).href);
const baseUrl = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const captureDir = process.env.FIELDS_CAPTURE_DIR || "";
if (captureDir) await fs.mkdir(captureDir, { recursive: true });

const lessons = [
  ["number-line-unit-distance", "book06-number-line"],
  ["rectangle-missing-side", "book06-missing-side"],
  ["inclusive-range-count", "book06-range-count"],
  ["number-and-digit-count", "book06-number-digit-count"],
  ["equal-share-source", "book06-equal-share"],
  ["number-line-ratio-source", "book06-distance-ratio"],
  ["fraction-balance-source", "book06-equivalent-ratio"],
  ["perimeter-source", "book06-perimeter-half"],
  ["multiplication-source", "book06-partial-product"],
  ["consecutive-source", "book06-inclusive-sequence"],
  ["digit-sign-source", "book06-digit-occurrence"]
];
const phases = ["given", "organize", "calculate", "verify"];
const captureLessons = new Set(["number-line-unit-distance", "equal-share-source", "fraction-balance-source", "digit-sign-source"]);
const protectedFixture = {};
const visitProtectedRefs = (node) => {
  if (!node || typeof node !== "object") return;
  if (node.answerRef) protectedFixture[node.answerRef] = { answer: "검사용", solution: "화면 구조 검사용 풀이" };
  Object.values(node).forEach(visitProtectedRefs);
};
visitProtectedRefs(GOLDEN_BELL_BOOKS.find((book) => book.id === "book-06"));
const browser = await chromium.launch({ headless: true });

async function auditViewport(viewport, label) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  const student = `BOOK06-${label}`;
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/functions/v1/fields-auth", (route) => route.fulfill({ status: 200, contentType: "application/json", body: "{}" }));
  await page.route("**/functions/v1/golden-bell-answers", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ answers: protectedFixture }) }));
  await page.addInitScript(({ name }) => {
    sessionStorage.setItem("gfield_fields_session", "book06-browser-audit");
    sessionStorage.setItem("gf_n", name);
  }, { name: student });
  await page.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=${student}&book=book-06`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => !document.querySelector(".protected-answer-notice"));
  await page.waitForSelector('.lesson-button[data-lesson="number-line-unit-distance"]');

  assert.equal(await page.locator(".lesson-button").count(), lessons.length, `${label}: lesson count`);
  assert.match(await page.locator("#bookSource").innerText(), /추가 학습 22문제 · 약 30분/u, `${label}: available practice summary missing`);

  for (const [lessonId, family] of lessons) {
    await page.locator(`.lesson-button[data-lesson="${lessonId}"]`).click();
    const experience = page.locator(`.guided-concept[data-guided-family="${family}"]`);
    assert.equal(await experience.count(), 1, `${label}/${lessonId}: guided workbook missing`);
    const snapshots = [];
    for (let step = 0; step < phases.length; step += 1) {
      const frame = experience.locator(`.book06-workbook[data-book06-phase="${phases[step]}"]`);
      assert.equal(await frame.count(), 1, `${label}/${lessonId}: ${phases[step]} frame missing`);
      assert.equal(await experience.locator("[data-book06-answer]").count(), step === phases.length - 1 ? 1 : 0, `${label}/${lessonId}: answer visibility at step ${step + 1}`);
      snapshots.push((await frame.innerHTML()).replace(/\s+/gu, " "));
      const box = await experience.boundingBox();
      assert.ok(box && box.x >= -1 && box.x + box.width <= viewport.width + 1, `${label}/${lessonId}: experience crosses viewport`);
      const overflow = await frame.evaluate((root) => [...root.querySelectorAll("*")].filter((node) => {
        if (!(node instanceof HTMLElement) || node.offsetParent === null) return false;
        return node.scrollWidth > node.clientWidth + 2;
      }).map((node) => `${node.tagName}.${node.className}`));
      assert.deepEqual(overflow, [], `${label}/${lessonId}/${phases[step]}: internal overflow ${overflow.join(", ")}`);
      if (step < phases.length - 1) await experience.locator('[data-experience-action="next"]').click();
    }
    assert.equal(new Set(snapshots).size, phases.length, `${label}/${lessonId}: repeated frame`);
    if (captureDir && captureLessons.has(lessonId)) {
      await experience.screenshot({ path: path.join(captureDir, `${lessonId}-${label}.png`) });
    }
  }

  const completedLessons = Object.fromEntries(lessons.map(([lessonId]) => [lessonId, { original: true }]));
  await page.evaluate(({ key, progress }) => localStorage.setItem(key, JSON.stringify({ "book-06": progress })), { key: `fields-classic-golden-bell:${student}`, progress: completedLessons });
  await page.reload({ waitUntil: "networkidle" });
  for (const [lessonId] of lessons) {
    await page.locator(`.lesson-button[data-lesson="${lessonId}"]`).click();
    await page.locator('.stage-step[data-phase="extension"]').click();
    for (let question = 0; question < 2; question += 1) {
      assert.match(await page.locator(".daily-quiz-head aside").innerText(), new RegExp(`2문제 중 ${question + 1}번째[\\s\\S]*이 학습 2문제 · 약 3분 \\/ 이 권 22문제`, "u"), `${label}/${lessonId}: per-lesson practice wording missing`);
      const visual = page.locator(".quiz-visual .book06-visual");
      assert.equal(await visual.count(), 1, `${label}/${lessonId}/${question + 1}: practice visual missing`);
      const visualBox = await visual.locator(":scope > *").first().boundingBox();
      assert.ok(visualBox && visualBox.width >= 5 && visualBox.height >= 5, `${label}/${lessonId}/${question + 1}: practice visual collapsed`);
      const visualOverflow = await visual.evaluate((root) => [...root.querySelectorAll("*")].filter((node) => {
        if (!(node instanceof HTMLElement) || node.offsetParent === null) return false;
        return node.scrollWidth > node.clientWidth + 2;
      }).map((node) => `${node.tagName}.${node.className}`));
      assert.deepEqual(visualOverflow, [], `${label}/${lessonId}/${question + 1}: practice visual overflow ${visualOverflow.join(", ")}`);
      if (captureDir && captureLessons.has(lessonId) && question === 0) {
        await page.locator("#lessonContent").screenshot({ path: path.join(captureDir, `${lessonId}-practice-${label}.png`) });
      }
      if (question < 1) {
        await page.locator("[data-extension-skip]").click();
        await page.locator('[data-check="extension"]').click();
      }
    }
  }

  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), false, `${label}: page has horizontal overflow`);
  assert.deepEqual(errors, [], `${label}: browser errors: ${errors.join(" | ")}`);
  await page.close();
}

try {
  await auditViewport({ width: 1440, height: 1050 }, "desktop");
  await auditViewport({ width: 390, height: 844 }, "mobile");
} finally {
  await browser.close();
}

console.log("GOLDEN_BELL_BOOK06_WORKBOOK_BROWSER_OK lessons=11 phases=4 desktop=pass mobile=pass practice=22 pending=11 answerHiddenBeforeVerify=pass");
