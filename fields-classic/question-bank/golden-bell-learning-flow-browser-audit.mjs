import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-library.js";
import { book01FoldAnimations } from "./golden-bell-book01-folding.js";

const modules = process.env.CODEX_NODE_MODULES || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const { chromium } = await import(pathToFileURL(path.join(modules, "playwright/index.mjs")).href);
const { PDFDocument } = createRequire(import.meta.url)(path.join(modules, "pdf-lib"));
const base = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
assert.ok(["127.0.0.1", "localhost"].includes(new URL(base).hostname));
const output = process.env.FIELDS_CAPTURE_DIR;
assert.ok(output && process.env.FIELDS_PRIVATE_ANSWER_BANK, "Private readback and capture directory required");
await fs.mkdir(output, { recursive: true });
const privateBank = JSON.parse(await fs.readFile(process.env.FIELDS_PRIVATE_ANSWER_BANK, "utf8"));
const books = GOLDEN_BELL_BOOKS.filter((book) => book.courseId === "course-01");
const records = {};
function visit(value) {
  if (!value || typeof value !== "object") return;
  if (value.answerRef) records[value.answerRef] = { answer: value.options?.[0] || "0", solution: "Navigation-only fixture" };
  Object.values(value).forEach(visit);
}
books.forEach(visit);
const report = { scope: "Book 1 instructional flow; books 1-10 navigation only", authentication: "local isolated readback fixture, not live student login", navigation: [], book01: [], print: [] };
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("**/functions/v1/fields-auth", (route) => route.fulfill({ contentType: "application/json", body: "{}" }));
    await page.route("**/functions/v1/golden-bell-answers", (route) => {
      const bookId = route.request().postDataJSON().bookId;
      return route.fulfill({ contentType: "application/json", body: JSON.stringify({ answers: privateBank.books[bookId] || records }) });
    });
    await page.addInitScript(() => {
      sessionStorage.setItem("gfield_fields_session", "learning-flow-fixture");
      window.print = () => {};
    });
    for (const book of books) {
      await page.goto(`${base}/fields-classic/question-bank/golden-bell.html?student=FLOW-QA&book=${book.id}`, { waitUntil: "networkidle" });
      await page.waitForFunction((id) => document.body.dataset.activeBook === id && document.querySelectorAll("[data-lesson]").length > 0, book.id);
      await page.waitForFunction(() => !document.querySelector(".protected-answer-notice"));
      for (const lesson of book.lessons) {
        await page.locator(`[data-lesson="${lesson.id}"]`).click();
        assert.ok((await page.locator("#lessonContent h2").first().innerText()).length);
        await page.locator('[data-next-phase="original"]').click();
        assert.equal(await page.locator('[data-phase="original"]').getAttribute("aria-current"), "step");
        assert.ok(await page.locator("[data-original-item]").count());
        assert.equal(await page.locator(".quiz-item-solution,.extension-solution").count(), 0);
        await page.locator('[data-phase="concept"]').click();
      }
      report.navigation.push({ book: book.id, width, lessons: book.lessons.length });
    }
    await page.goto(`${base}/fields-classic/question-bank/golden-bell.html?student=FLOW-QA&book=book-01`, { waitUntil: "networkidle" });
    for (const lesson of books[0].lessons) {
      await page.locator(`[data-lesson="${lesson.id}"]`).click();
      const foldTrack = book01FoldAnimations(lesson.id)[0];
      const experience = foldTrack || lesson.experience;
      if (foldTrack) assert.equal(await page.locator(".source-animation-problem").innerText(), foldTrack.problem);
      else {
        assert.equal(await page.locator(".concept-opening-question strong").innerText(), experience.openingPrompt);
        assert.equal(await page.locator(".concept-opening-question li").count(), experience.openingConditions.length);
      }
      assert.equal(await page.locator(".story-band").count(), 0);
      const scene = page.locator(".concept-experience").first();
      const positions = await page.locator(foldTrack ? ".source-animation-problem,.source-animation-scene" : ".concept-opening-question,.concept-experience").evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().top));
      assert.ok(positions[0] < positions[1]);
      const frames = [];
      for (let step = 0; step < experience.beats.length; step++) {
        frames.push(await scene.innerText());
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${lesson.id}/${width}/${step}: overflow`);
        assert.doesNotMatch(await scene.innerHTML(), /\b(?:undefined|NaN)\b/u);
        if (lesson.id === "clock-turning") {
          const angle = await page.locator(".experience-clock-hand").getAttribute("style");
          assert.ok(angle.includes("--from-angle:60deg"));
          assert.ok(angle.includes(`--to-angle:${60 + lesson.experience.beats[step].quarterTurns * 90}deg`));
        }
        if (lesson.id === "digital-turn-flip") assert.equal(await scene.locator(".b1-digit").count(), Math.min(step + 1, 3));
        if (foldTrack) assert.equal(await scene.locator(".book01-fold-frame").getAttribute("data-fold-phase"), experience.beats[step].phase);
        await scene.screenshot({ path: path.join(output, `${width}-${lesson.id}-${step}.png`) });
        if (step < experience.beats.length - 1) await scene.locator('[data-experience-action="next"]').click();
      }
      assert.equal(new Set(frames).size, frames.length);
      await scene.locator('[data-experience-action="restart"]').click();
      assert.equal(await scene.locator('[data-experience-action="previous"]').isDisabled(), true);
      await page.locator('[data-next-phase="original"]').click();
      for (const item of lesson.original.items) {
        const card = page.locator(`[data-original-item="${item.id}"]`);
        await card.locator("[data-original-answer]").click();
        assert.ok((await card.locator(".quiz-item-solution").innerText()).length > 10);
        if (lesson.original.mode === "paged") await page.locator('[data-check="original"]').click();
      }
      if (lesson.original.mode !== "paged") await page.locator("[data-complete-original]").click();
      assert.equal(await page.locator('[data-phase="extension"]').getAttribute("aria-current"), "step");
      assert.equal(await page.locator(".extension-solution").count(), 0);
      await page.locator("[data-extension-answer]").click();
      assert.ok((await page.locator(".extension-solution").innerText()).length > 10);
      await page.locator('[data-phase="concept"]').click();
      report.book01.push({ lesson: lesson.id, width, frames: frames.length, originalItems: lesson.original.items.length });
      if (width === 1440) {
        await page.selectOption("#coursePrintMode", "study");
        await page.locator("#printLessonButton").click();
        await page.waitForFunction(() => !document.querySelector("#printLessonButton").disabled);
        assert.match(await page.locator("#printStatus").innerText(), /^A4 /u);
        assert.ok((await page.locator("#goldPrintRoot").innerText()).includes(foldTrack ? foldTrack.problem : experience.openingPrompt));
        await page.emulateMedia({ media: "print" });
        const pages = await page.locator(".gold-print-page").count();
        const clipping = await page.locator(".gold-print-page").evaluateAll((nodes) => nodes.flatMap((node, index) => {
          const footer = node.querySelector(".gold-print-footer").getBoundingClientRect();
          return [...node.children].filter((child) => !child.matches(".gold-print-footer") && child.getBoundingClientRect().bottom > footer.top + 1).map((child) => ({ page: index + 1, element: child.className }));
        }));
        assert.deepEqual(clipping, [], `${lesson.id}: print clipping`);
        const pdf = await page.pdf({ path: path.join(output, `${lesson.id}.pdf`), format: "A4", printBackground: true });
        assert.equal((await PDFDocument.load(pdf)).getPageCount(), pages, `${lesson.id}: physical pages`);
        report.print.push({ lesson: lesson.id, pages });
        await page.emulateMedia({ media: "screen" });
      }
    }
    assert.deepEqual(errors, []);
    await page.close();
  }
  await fs.writeFile(path.join(output, "flow-report.json"), JSON.stringify(report, null, 2));
  console.log(`LEARNING_FLOW_OK navigation=${report.navigation.reduce((n, row) => n + row.lessons, 0)} book01=${report.book01.length} pdf=${report.print.length}`);
} finally {
  await browser.close();
}
