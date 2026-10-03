import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-library.js";
import { applyBook01SourceFixes } from "./golden-bell-book01-source-fixes.js";

const modules = process.env.CODEX_NODE_MODULES
  || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = await import(pathToFileURL(path.join(modules, "playwright/index.mjs")).href);
const { PDFDocument } = createRequire(import.meta.url)(path.join(modules, "pdf-lib"));
const base = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8797";
assert.ok(["127.0.0.1", "localhost"].includes(new URL(base).hostname));
assert.ok(process.env.FIELDS_CAPTURE_DIR && process.env.FIELDS_PRIVATE_ANSWER_BANK);
const output = process.env.FIELDS_CAPTURE_DIR;
await fs.mkdir(output, { recursive: true });
const privateBank = JSON.parse(await fs.readFile(process.env.FIELDS_PRIVATE_ANSWER_BANK, "utf8"));
const book = GOLDEN_BELL_BOOKS.find((candidate) => candidate.id === "book-01");
const clock = book.lessons.find((lesson) => lesson.id === "clock-turning");
const digital = book.lessons.find((lesson) => lesson.id === "digital-turn-flip");
assert.equal(book.lessons.reduce((count, lesson) => count + lesson.original.items.length, 0), 133);
assert.equal(digital.original.items.length, 21);
assert.equal(clock.experience.start, clock.original.visual.value);
for (const beat of clock.experience.beats) {
  assert.equal(beat.result, ((clock.experience.start - 1 + beat.quarterTurns * 3) % 12 + 12) % 12 + 1);
  assert.doesNotMatch(beat.caption, /\d\s*\/\s*\d/u);
}
const snapshot = JSON.stringify(book);
applyBook01SourceFixes(GOLDEN_BELL_BOOKS);
assert.equal(JSON.stringify(book), snapshot, "Applying source fixes twice must not duplicate a variation");
const targets = digital.original.items.filter((item) => ["half-8", "arithmetic-8-three-digit"].includes(item.id));
assert.equal(targets.length, 2);
const report = { scope: "Book 1 source corrections", authentication: "isolated local fixture", viewports: [], print: [] };
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.route("**/functions/v1/fields-auth", (route) => route.fulfill({ contentType: "application/json", body: "{}" }));
    await page.route("**/functions/v1/golden-bell-answers", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({ answers: privateBank.books[book.id] }) }));
    await page.addInitScript(() => {
      sessionStorage.setItem("gfield_fields_session", "source-audit-fixture");
      window.print = () => {};
    });
    await page.goto(`${base}/fields-classic/question-bank/golden-bell.html?student=SOURCE-QA&book=book-01`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => !document.querySelector(".protected-answer-notice"));
    const scene = page.locator(".concept-experience").first();
    for (let index = 0; index < clock.experience.beats.length; index++) {
      assert.ok((await scene.innerText()).includes(clock.experience.beats[index].caption));
      if (index < clock.experience.beats.length - 1) await scene.locator('[data-experience-action="next"]').click();
    }
    await scene.screenshot({ path: path.join(output, `${width}-clock-source.png`) });
    for (const lesson of book.lessons) {
      await page.locator(`[data-lesson="${lesson.id}"]`).click();
      await page.locator('[data-phase="original"]').click();
      assert.ok(await page.locator("[data-original-item]").count());
      assert.equal(await page.locator(".quiz-item-solution").count(), 0);
    }
    await page.locator('[data-lesson="digital-turn-flip"]').click();
    await page.locator('[data-phase="original"]').click();
    for (const item of digital.original.items) {
      const card = page.locator(`[data-original-item="${item.id}"]`);
      assert.equal(await card.count(), 1);
      if (targets.includes(item)) {
        assert.equal(await card.locator(".quiz-item-solution").count(), 0);
        if (item.parts) {
          assert.equal(await page.locator(".source-question-card .b1-arithmetic-list").count(), 0);
          assert.equal(await card.locator("input").count(), item.parts.length);
          for (const part of item.parts) await card.locator(`[data-input-group="${item.id}:${part.id}"]`).fill(String(privateBank.books[book.id][part.answerRef].answer));
        } else {
          assert.deepEqual(item.visual.digits, [8]);
          await card.locator("input").fill("0");
          await page.locator('[data-check="original"]').click();
          assert.equal(await card.getAttribute("class"), "quiz-item incorrect");
          await card.locator("input").fill(String(privateBank.books[book.id][item.answerRef].answer));
        }
        await page.locator('[data-check="original"]').click();
        assert.equal(await card.getAttribute("class"), "quiz-item correct");
        assert.ok((await card.locator(".quiz-item-solution p").innerText()).trim().length > 20);
        const overflow = await page.locator(".source-question-card").evaluate((node) => node.scrollWidth > node.clientWidth + 2);
        assert.equal(overflow, false);
        await page.locator(".source-question-card").screenshot({ path: path.join(output, `${width}-${item.id}.png`) });
      } else {
        await card.locator(`[data-original-skip="${item.id}"]`).click();
      }
      if (item !== digital.original.items.at(-1)) await page.locator('[data-check="original"]').click();
    }
    for (const mode of ["study", "answers", "quick", "both"]) {
      await page.selectOption("#coursePrintMode", mode);
      await page.locator("#printLessonButton").click();
      await page.waitForFunction(() => !document.querySelector("#printLessonButton").disabled);
      assert.match(await page.locator("#printStatus").innerText(), /^A4 /u, `${width}/${mode}: ${errors.join(" | ")}`);
      const sections = await page.locator(".gold-print-page").evaluateAll((nodes) => nodes.map((node) => node.dataset.printPart));
      if (mode === "study") {
        assert.equal(await page.locator("[data-answer-item]").count(), 0);
        const arithmetic = page.locator(".gold-print-source-item").filter({ hasText: "세 자리 덧셈" });
        assert.equal(await arithmetic.count(), 1);
        assert.equal(await arithmetic.locator("[data-print-part-id]").count(), 4);
        assert.equal(await arithmetic.locator(".b1-arithmetic-list").count(), 0);
      } else {
        for (const item of targets) {
          const printed = page.locator(`[data-answer-item="${item.id}"]`);
          assert.equal(await printed.count(), 1);
          const answers = item.parts ? item.parts.map((part) => privateBank.books[book.id][part.answerRef].answer) : [privateBank.books[book.id][item.answerRef].answer];
          for (const answer of answers) assert.ok((await printed.innerText()).includes(String(answer)));
        }
        if (mode === "answers" || mode === "quick") assert.ok(sections.every((part) => part.startsWith("answers-")));
        if (mode === "both") assert.equal(sections.findIndex((part) => part.startsWith("answers-")) % 2, 0);
      }
      await page.emulateMedia({ media: "print" });
      const pdfBytes = await page.pdf({ format: "A4", printBackground: true });
      const count = (await PDFDocument.load(pdfBytes)).getPageCount();
      assert.equal(count, sections.length, `${mode}: content overflow created an extra physical PDF page`);
      if (width === 1440) await fs.writeFile(path.join(output, `digital-${mode}.pdf`), pdfBytes);
      report.print.push({ width, mode, pages: count });
      await page.emulateMedia({ media: "screen" });
    }
    assert.deepEqual(errors, []);
    report.viewports.push({ width, lessons: book.lessons.length, sourceItems: digital.original.items.length });
    await page.close();
  }
  await fs.writeFile(path.join(output, "source-audit-report.json"), JSON.stringify(report, null, 2));
  console.log(`BOOK01_SOURCE_OK viewports=${report.viewports.length} printModes=${report.print.length}`);
} finally {
  await browser.close();
}
