import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-library.js";
import { book01FoldAnimations, foldPaper, foldSelectedCells, foldingQuestionMarkup, foldAnswerValue, reviewBook01FoldSolutions } from "./golden-bell-book01-folding.js";
import { hydrateProtectedAnswers } from "./golden-bell-protected.js";
import { courseAnswerPrintPages } from "./golden-bell-course-concepts.js";

const book = GOLDEN_BELL_BOOKS.find((value) => value.id === "book-01");
const lessons = book.lessons.filter((lesson) => lesson.id.startsWith("fold-"));
const items = lessons.flatMap((lesson) => lesson.original.items).filter((item) => item.visual?.foldModel);
const privateFile = process.env.FIELDS_PRIVATE_ANSWER_BANK;
const output = process.env.FIELDS_CAPTURE_DIR;
assert.ok(privateFile && output, "Private answer readback and external output directory required");
const privateBank = JSON.parse(await fs.readFile(privateFile, "utf8"));
hydrateProtectedAnswers(book, privateBank.books[book.id]);
assert.equal(items.length, 13);
for (const item of items) {
  const model = item.visual.foldModel;
  if (model.task === "position") assert.doesNotMatch(item.prompt + item.typeLabel, /맨 위|가장 위/);
  if (item.visual.numbers) assert.deepEqual(foldSelectedCells(model, item.visual.numbers), item.visual.selected, item.id);
  assert.equal(Number(String(item.answer).replace(/\D/g, "")), foldAnswerValue(item.visual), item.id);
  assert.doesNotMatch(foldingQuestionMarkup(item.visual), /class="(?:fold-number-cut|fold-position)"/);
  assert.match(foldingQuestionMarkup(item.solutionVisual), /class="(?:fold-number-cut|fold-position)"/);
  model.folds.forEach((_, i) => {
    const poly = foldPaper(model, i + 1);
    const area = Math.abs(poly.reduce((sum, p, index) => {
      const q = poly[(index + 1) % poly.length];
      return sum + p.x * q.y - q.x * p.y;
    }, 0)) / 2;
    assert.equal(area, 1 / 2 ** (i + 1), `${item.id}: fold area`);
  });
}
reviewBook01FoldSolutions(book);
assert.deepEqual(items.filter((item) => item.visual.foldModel.task === "position").map((item) => foldAnswerValue(item.visual)), [4, 1, 2]);
const invalid = structuredClone(book);
invalid.lessons.find((lesson) => lesson.id === "fold-one-cut").original.items.find((item) => item.id === "one-fold-sum-1").answer = "999";
assert.throws(() => reviewBook01FoldSolutions(invalid), /disagree/);
for (const lesson of book.lessons) assert.match(courseAnswerPrintPages(lesson, book, "QA", { renderVisual: () => "" }), /course-answer-item/);
const missingWorkedAnswer = structuredClone(lessons[0]);
delete missingWorkedAnswer.original.items[0].solution;
delete missingWorkedAnswer.original.items[0].explanation;
assert.throws(() => courseAnswerPrintPages(missingWorkedAnswer, book, "QA", { renderVisual: () => "" }), /Protected worked answers/);

const modules = process.env.CODEX_NODE_MODULES || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const { chromium } = await import(pathToFileURL(path.join(modules, "playwright/index.mjs")).href);
const { PDFDocument } = createRequire(import.meta.url)(path.join(modules, "pdf-lib"));
const base = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
assert.ok(["127.0.0.1", "localhost"].includes(new URL(base).hostname));
await fs.mkdir(output, { recursive: true });
const report = { sourceSlides: [12, 14, 16], originalItems: items.length, concepts: [], print: [], autoplay: [] };
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("requestfailed", (request) => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await page.route("**/functions/v1/fields-auth", (route) => route.fulfill({ contentType: "application/json", body: "{}" }));
    await page.route("**/functions/v1/golden-bell-answers", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({ answers: privateBank.books[book.id] }) }));
    await page.addInitScript(() => {
      sessionStorage.setItem("gfield_fields_session", "isolated-fold-review");
      window.print = () => {};
    });
    await page.goto(`${base}/fields-classic/question-bank/golden-bell.html?student=FOLD-QA&book=book-01`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => !document.querySelector(".protected-answer-notice"));
    for (const lesson of lessons) {
      await page.locator(`[data-lesson="${lesson.id}"]`).click();
      const scene = page.locator('.source-animation[data-source-family="book01-fold"]');
      const tracks = book01FoldAnimations(lesson.id);
      assert.equal(await scene.locator("[data-source-track] option").count(), 3);
      for (const animation of tracks) {
        await scene.locator("[data-source-track]").selectOption(animation.sourceItemId);
        assert.equal(await scene.locator(".source-animation-problem").innerText(), animation.problem);
        assert.equal(await scene.locator(".book01-fold-solution").count(), 0);
        for (let step = 0; step < animation.beats.length; step++) {
          assert.equal(await scene.locator(".book01-fold-frame").getAttribute("data-fold-phase"), animation.beats[step].phase);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${animation.id}/${step}/${width}: overflow`);
          assert.doesNotMatch(await scene.innerHTML(), /\b(?:undefined|NaN)\b/);
          await scene.screenshot({ path: path.join(output, `${width}-${lesson.id}-${animation.id}-${step}.png`) });
          if (step < animation.beats.length - 1) await scene.locator('[data-experience-action="next"]').click();
        }
        await scene.locator('[data-experience-action="restart"]').click();
        assert.equal(await scene.locator(".book01-fold-frame").getAttribute("data-fold-phase"), "given");
        await page.evaluate(() => document.activeElement?.blur());
        await page.keyboard.press("End");
        assert.equal(await scene.locator(".book01-fold-frame").getAttribute("data-fold-phase"), "verify");
        await page.keyboard.press("Home");
        assert.equal(await scene.locator(".book01-fold-frame").getAttribute("data-fold-phase"), "given");
        await page.keyboard.press("ArrowRight");
        assert.equal(await scene.locator(".book01-fold-frame").getAttribute("data-fold-phase"), "fold");
        await page.keyboard.press("ArrowLeft");
        assert.equal(await scene.locator(".book01-fold-frame").getAttribute("data-fold-phase"), "given");
        report.concepts.push({ width, lesson: lesson.id, track: animation.id, steps: animation.beats.length });
      }
      await scene.locator('[data-experience-action="play"]').click();
      await page.waitForFunction(() => document.querySelector(".book01-fold-frame")?.dataset.foldPhase !== "given", { timeout: 9000 });
      await scene.locator('[data-experience-action="play"]').click();
      const paused = await scene.locator(".experience-progress").innerText();
      await page.waitForTimeout(5000);
      assert.equal(await scene.locator(".experience-progress").innerText(), paused);
      await scene.locator('[data-experience-action="restart"]').click();
      report.autoplay.push({ lesson: lesson.id, width, paused });
      await page.locator('[data-next-phase="original"]').click();
      for (const item of lesson.original.items) {
        const card = page.locator(`[data-original-item="${item.id}"]`);
        if (item.visual?.foldModel) {
          assert.equal(await page.locator(".item-quiz-visual .fold-number-cut,.item-quiz-visual .fold-position").count(), 0);
          assert.equal(await page.locator(".item-quiz-visual .book01-fold-sequence .fold-direction").count(), item.visual.foldModel.folds.length);
          await page.locator(".source-question-card").screenshot({ path: path.join(output, `${width}-${item.id}-problem.png`) });
          await card.locator("[data-original-answer]").click();
          assert.ok(await card.locator(".book01-fold-solution").count());
          await card.screenshot({ path: path.join(output, `${width}-${item.id}-solution.png`) });
        } else await card.locator("[data-original-skip]").click();
        await page.locator('[data-check="original"]').click();
      }
      await page.locator('[data-phase="concept"]').click();
      if (width === 1440) for (const mode of ["study", "answers", "quick", "both"]) {
        await page.selectOption("#coursePrintMode", mode);
        await page.locator("#printLessonButton").click();
        await page.waitForFunction(() => !document.querySelector("#printLessonButton").disabled);
        assert.match(await page.locator("#printStatus").innerText(), /^A4 /, `${lesson.id}/${mode}: ${errors.join("; ")}`);
        const root = page.locator("#goldPrintRoot");
        const expectedConcepts = ["study", "both"].includes(mode) ? 3 : 0;
        assert.equal(await root.locator(".book01-fold-print").count(), expectedConcepts);
        assert.equal(await root.locator('.gold-print-page:not([data-print-part^="answers-"]):not(.book01-fold-print) .fold-number-cut').count(), 0);
        await page.emulateMedia({ media: "print" });
        const pages = await root.locator(".gold-print-page").count();
        const clipping = await root.locator(".gold-print-page").evaluateAll((nodes) => nodes.flatMap((node, index) => {
          const footer = node.querySelector(".gold-print-footer").getBoundingClientRect();
          return [...node.children].filter((child) => !child.matches(".gold-print-footer") && child.getBoundingClientRect().bottom > footer.top + 1).map((child) => ({ page: index + 1, element: child.className }));
        }));
        assert.deepEqual(clipping, [], `${lesson.id}/${mode}: clipping`);
        const pdf = await page.pdf({ path: path.join(output, `${lesson.id}-${mode}.pdf`), format: "A4", printBackground: true });
        assert.equal((await PDFDocument.load(pdf)).getPageCount(), pages, "physical page count");
        const answerIndex = await root.locator(".gold-print-page").evaluateAll((nodes) => nodes.findIndex((node) => node.dataset.printPart.startsWith("answers-")));
        if (mode === "both") assert.equal(answerIndex % 2, 0, "Answers start on a new sheet front");
        if (["answers", "quick"].includes(mode)) assert.equal(await root.locator(".gold-print-duplex-blank,.gold-print-cover").count(), 0);
        report.print.push({ lesson: lesson.id, mode, pages, firstAnswerPage: answerIndex + 1 });
        await page.emulateMedia({ media: "screen" });
      }
    }
    assert.deepEqual(errors, []);
    await page.close();
  }
  await fs.writeFile(path.join(output, "fold-review.json"), JSON.stringify(report, null, 2));
  console.log(`BOOK01_FOLD_OK originals=${items.length} concepts=${report.concepts.length} autoplay=${report.autoplay.length} pdf=${report.print.length}`);
} finally { await browser.close(); }
