import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { COURSE23_PILOT_BOOKS } from "./golden-bell-course23-data.js";

const modules = process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = await import(pathToFileURL(path.join(modules, "playwright/index.mjs")).href);
const require = createRequire(path.join(modules, "package.json"));
const { PDFDocument } = require("pdf-lib");
const base = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8795";
const output = path.join(os.tmpdir(), "fields-course23-a2-browser-audit");
await mkdir(output, { recursive: true });
const books = COURSE23_PILOT_BOOKS.filter((book) => book.id.endsWith("-a2"));
assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(new URL(base).hostname), "Private fixtures are local-only");
assert.ok(process.env.FIELDS_PRIVATE_ANSWER_BANK, "Set FIELDS_PRIVATE_ANSWER_BANK to a local private Course 2/3 A2 answer fixture");
const privateBank = JSON.parse(await readFile(process.env.FIELDS_PRIVATE_ANSWER_BANK, "utf8"));

const recordsFor = (book) => {
  const records = privateBank.books?.[book.id];
  assert.ok(records, `${book.id}: private answer records missing`);
  const items = book.lessons.flatMap((lesson) => [...lesson.original.items, lesson.extension, ...lesson.similarPractice]);
  assert.equal(Object.keys(records).length, items.length, `${book.id}: private answer record count`);
  for (const item of items) {
    const record = records[item.answerRef];
    assert.ok(record && Object.hasOwn(record, "answer"), `${item.id}: private answer missing`);
    assert.ok(typeof record.solution === "string" && record.solution.length >= 45, `${item.id}: worked solution is too short`);
  }
  return records;
};

async function assertLayout(page, label) {
  const issues = await page.evaluate(() => {
    const found = [];
    if (document.documentElement.scrollWidth > innerWidth + 2) found.push("document overflow");
    for (const host of document.querySelectorAll(".course-concept-scene,.source-question-card,.extension-panel")) {
      if (host.scrollWidth > host.clientWidth + 2) found.push(`${host.className}: horizontal overflow`);
      const box = host.getBoundingClientRect();
      for (const node of host.querySelectorAll(".course23-a2-visual,.course23-a2-numberline,.a2-weekdays,.a2-stones,.a2-transfer,.a2-schedules,.a2-equation,.a2-catch")) {
        const rect = node.getBoundingClientRect();
        if (rect.width < 1 || rect.height < 1 || rect.left < box.left - 2 || rect.right > box.right + 2) found.push(`${node.className}: out of bounds`);
      }
    }
    return found;
  });
  assert.deepEqual(issues, [], label);
}

async function printAndCheck(page, selector, label, fileName) {
  await page.emulateMedia({ media: "print" });
  const sheets = page.locator("#goldPrintRoot>.gold-print-page");
  assert.ok(await sheets.count() > 0, `${label}: no print sheets`);
  const overflow = await sheets.evaluateAll((pages) => pages.flatMap((sheet, index) => {
    const footer = sheet.querySelector(":scope>.gold-print-footer")?.getBoundingClientRect();
    if (!footer) return [index + 1];
    return [...sheet.children].filter((node) => !node.matches(".gold-print-footer") && node.getBoundingClientRect().bottom > footer.top + 1).map(() => index + 1);
  }));
  assert.deepEqual(overflow, [], `${label}: footer overflow`);
  assert.equal(await page.locator(`${selector} .course23-a2-visual`).evaluateAll((nodes) => nodes.every((node) => node.children.length > 0)), true, `${label}: empty diagrams`);
  const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
  assert.equal((await PDFDocument.load(pdf)).getPageCount(), await sheets.count(), `${label}: browser added pages`);
  await writeFile(path.join(output, fileName), pdf);
  await page.emulateMedia({ media: "screen" });
}

const browser = await chromium.launch();
const results = [];
try {
  for (const width of [1440, 390]) {
    for (const book of books) {
      const records = recordsFor(book);
      const context = await browser.newContext({ viewport: { width, height: 1000 }, isMobile: width === 390, hasTouch: width === 390 });
      await context.addInitScript(() => sessionStorage.setItem("gfield_fields_session", "course23-a2-local-audit"));
      await context.route("**/functions/v1/fields-auth", (route) => route.fulfill({ json: { ok: true } }));
      await context.route("**/functions/v1/golden-bell-answers", (route) => route.fulfill({ json: { bookId: book.id, answers: records, revision: "local-audit" } }));
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
      await page.goto(`${base}/fields-classic/question-bank/golden-bell.html?student=A2-QA&course=${book.courseId}&book=${book.id}`, { waitUntil: "networkidle" });
      assert.equal(await page.locator(".lesson-button").count(), 4, `${book.id}: lesson count`);
      for (const [lessonIndex, lesson] of book.lessons.entries()) {
        await page.locator(`[data-lesson="${lesson.id}"]`).click();
        assert.equal(await page.locator("[data-course-track]").count(), lesson.experience.tracks.length);
        assert.equal(await page.locator(".experience-check").count(), 0, "concept playback must not contain a quiz");
        for (const track of lesson.experience.tracks) {
          await page.locator(`[data-course-track="${track.id}"]`).click();
          for (let step = 0; step < 4; step += 1) {
            assert.equal(await page.locator(".course-concept-scene").getAttribute("data-course-step"), String(step));
            await assertLayout(page, `${book.id}/${width}/${track.id}/${step}`);
            if (step < 3) await page.locator('[data-experience-action="next"]').click();
          }
          await page.waitForTimeout(350);
          await page.locator(".course-concept-scene").screenshot({
            path: path.join(output, `${book.id}-${width}-${track.id}.png`)
          });
        }
        if (lessonIndex === 0) await page.screenshot({ path: path.join(output, `${book.id}-${width}.png`), fullPage: true });
        await page.locator('[data-next-phase="original"]').click();
        for (const item of lesson.original.items) {
          assert.equal(await page.locator("[data-original-item]").getAttribute("data-original-item"), item.id);
          await page.locator("[data-input-group]").fill(String(records[item.answerRef].answer));
          await page.locator('[data-check="original"]').click();
          assert.equal(await page.locator(`[data-original-item="${item.id}"] .course-solution-visual .course23-a2-visual`).count(), 1, `${item.id}: solution visual`);
          await assertLayout(page, `${book.id}/${width}/${item.id}`);
          await page.locator('[data-check="original"]').click({ force: true });
        }
        for (const item of [lesson.extension, ...lesson.similarPractice]) {
          await page.locator("[data-input-group]").fill(String(records[item.answerRef].answer));
          await page.locator('[data-check="extension"]').click({ force: true });
          assert.equal(await page.locator("#lessonContent .extension-solution .course23-a2-visual").count(), 1, `${item.id}: extension visual`);
          await assertLayout(page, `${book.id}/${width}/${item.id}`);
          await page.locator('[data-check="extension"]').click({ force: true });
        }
        assert.equal(await page.locator(".complete-panel").count(), 1);
        if (width === 1440) {
          await page.evaluate(() => { window.print = () => { window.__printed = true; }; });
          for (const mode of ["study", "answers"]) {
            await page.locator("#coursePrintMode").selectOption(mode);
            await page.evaluate(() => { window.__printed = false; });
            await page.locator("#printLessonButton").click();
            await page.waitForFunction(() => window.__printed === true);
            await printAndCheck(page, "#goldPrintRoot", `${book.id}/${lesson.id}/${mode}`, `${book.id}-${lessonIndex + 1}-${mode}.pdf`);
          }
        }
      }
      if (width === 1440) {
        for (const mode of ["both", "quick"]) {
          await page.locator("#coursePrintMode").selectOption(mode);
          await page.evaluate(() => { window.__printed = false; });
          await page.locator("#printBookButton").click();
          await page.waitForFunction(() => window.__printed === true);
          await printAndCheck(page, "#goldPrintRoot", `${book.id}/whole/${mode}`, `${book.id}-whole-${mode}.pdf`);
        }
      }
      assert.deepEqual(errors, [], `${book.id}/${width}: browser errors`);
      results.push({
        book: book.id,
        width,
        lessons: book.lessons.length,
        tracks: book.lessons.reduce((sum, lesson) => sum + lesson.experience.tracks.length, 0),
        items: book.lessons.reduce((sum, lesson) => sum + lesson.original.items.length + 1 + lesson.similarPractice.length, 0)
      });
      await context.close();
    }
  }
  console.log(JSON.stringify({ status: "COURSE23_A2_BROWSER_OK", output, results }));
} finally {
  await browser.close();
}
