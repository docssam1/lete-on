import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js";

const modules = process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = await import(pathToFileURL(path.join(modules, "playwright/index.mjs")).href);
const require = createRequire(import.meta.url);
const { PDFDocument } = require(path.join(modules, "pdf-lib"));
const base = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(new URL(base).hostname), "Private fixtures are local-only");
const output = process.env.FIELDS_CAPTURE_DIR;
if (output) await fs.mkdir(output, { recursive: true });
assert.ok(process.env.FIELDS_PRIVATE_ANSWER_BANK, "Set FIELDS_PRIVATE_ANSWER_BANK to a local private fixture");
const privateBank = JSON.parse(await fs.readFile(process.env.FIELDS_PRIVATE_ANSWER_BANK, "utf8"));
const browser = await chromium.launch();
const pilots = [["book-04", "hidden-cube-count", 3], ["book-10", "catch-up-acorns", 5]];
const report = { authMode: "isolated UI fixture; not a live server authorization audit", views: [], print: [] };

async function context(authorized, viewport, reducedMotion = "no-preference") {
  const ctx = await browser.newContext({ viewport, reducedMotion });
  await ctx.route("**/golden-bell-source-animations.js?*", async route => {
    const response = await route.fetch();
    const body = (await response.text()).replace(
      "export function sourceAnimationsForLesson(lesson) {",
      "export function sourceAnimationsForLesson(lesson) { globalThis.__sourceAnimationBuildCount = (globalThis.__sourceAnimationBuildCount || 0) + 1;"
    );
    await route.fulfill({ response, body });
  });
  // Use local answer fixtures with a synthetic session, never real access codes or learner records.
  await ctx.route("**/functions/v1/fields-auth", (route) => route.fulfill({ json: { ok: true }, headers: { "Access-Control-Allow-Origin": new URL(base).origin } }));
  await ctx.route("**/functions/v1/golden-bell-answers", (route) => route.fulfill({ json: { answers: privateBank.books[route.request().postDataJSON().bookId] }, headers: { "Access-Control-Allow-Origin": new URL(base).origin } }));
  if (authorized) await ctx.addInitScript(() => sessionStorage.setItem("gfield_fields_session", "source-animation-ui-fixture"));
  return ctx;
}

async function assertFit(page, label) {
  const overflow = await page.locator(".source-animation").evaluate((node) => {
    const outer = node.getBoundingClientRect();
    return [...node.querySelectorAll(".source-animation-scene, .source-animation-problem, select, svg, .source-animation-equation, .source-animation-b10__calculation strong")].filter((child) => {
      const box = child.getBoundingClientRect();
      return box.width > 0 && (box.left < outer.left - 2 || box.right > outer.right + 2 || child.scrollWidth > child.clientWidth + 2 && child.tagName !== "svg");
    }).map((child) => child.className?.baseVal || child.className || child.tagName);
  });
  assert.deepEqual(overflow, [], `${label}: overflowing diagram/text`);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${label}: document overflow`);
}

try {
  for (const width of [1440, 390]) {
    const ctx = await context(true, { width, height: 1000 });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const [book, lessonId, count] of pilots) {
      await page.goto(`${base}/fields-classic/question-bank/golden-bell.html?student=DEMO&book=${book}`, { waitUntil: "networkidle" });
      await page.waitForFunction(() => !document.querySelector(".protected-answer-notice"));
      await page.locator(`[data-lesson="${lessonId}"]`).click();
      const values = await page.locator("[data-source-track] option").evaluateAll((nodes) => nodes.map((node) => node.value));
      assert.equal(values.length, count);
      assert.equal(await page.locator('[data-phase="original"]').isEnabled(), true, "explanation must not require quiz completion");
      let frames = 0;
      for (const value of values) {
        await page.locator("[data-source-track]").selectOption(value);
        const steps = await page.locator("[data-source-step]").count();
        const initialPolygons = await page.locator(".source-cube-model svg polygon").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("points")));
        for (let step = 0; step < steps; step += 1) {
          await page.locator(`[data-source-step="${step}"]`).click();
          assert.equal(await page.locator(".source-animation").getAttribute("data-source-item"), value);
          assert.ok((await page.locator(".source-animation-scene").innerText()).trim().length > 0);
          assert.ok((await page.locator(".source-animation .experience-caption").innerText()).trim().length > 0);
          if (initialPolygons.length) assert.deepEqual(await page.locator(".source-cube-model svg polygon").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("points"))), initialPolygons, "the same cube stack must remain through all scenes");
          assert.equal(await page.locator(".source-animation .is-animating,.source-animation .is-moving").count(), 0, "seeking must produce a static scene");
          await assertFit(page, `${book}/${value}/${step}/${width}`);
          frames += 1;
        }
      }
      if (output) await page.locator(".source-animation").screenshot({ path: path.join(output, `${book}-${width}.png`) });
      await page.locator('[data-experience-action="restart"]').click();
      await page.clock.install();
      await page.clock.pauseAt(Date.now() + 100);
      await page.locator('[data-experience-action="play"]').click();
      await page.clock.runFor(4700);
      const current = await page.locator('[data-source-step][aria-current="step"]').getAttribute("data-source-step");
      assert.notEqual(current, "0", "playback must advance without answering");
      await page.locator('[data-experience-action="play"]').click();
      await page.clock.runFor(9000);
      assert.equal(await page.locator('[data-source-step][aria-current="step"]').getAttribute("data-source-step"), current, "paused playback moved");
      await page.locator('[data-experience-action="play"]').click();
      await page.locator("[data-source-track]").selectOption(values[0]);
      await page.clock.runFor(10000);
      assert.equal(await page.locator('[data-source-step][aria-current="step"]').getAttribute("data-source-step"), "0", "old timer moved the newly selected question");
      await page.clock.resume();
      report.views.push({ book, width, tracks: values.length, frames });
    }
    assert.deepEqual(errors, []);
    await ctx.close();
  }

  const reduced = await context(true, { width: 390, height: 844 }, "reduce");
  const reducedPage = await reduced.newPage();
  await reducedPage.goto(`${base}/fields-classic/question-bank/golden-bell.html?book=book-04`, { waitUntil: "networkidle" });
  await reducedPage.waitForFunction(() => !document.querySelector(".protected-answer-notice"));
  await reducedPage.locator('[data-lesson="hidden-cube-count"]').click();
  await reducedPage.locator('[data-experience-action="next"]').click();
  assert.equal(await reducedPage.locator(".source-animation .is-animating").count(), 0);
  assert.ok(await reducedPage.locator(".ws-iso-top-label").count() > 0);
  await reduced.close();

  const printContext = await context(true, { width: 1440, height: 1000 });
  const printPage = await printContext.newPage();
  for (const [book, lessonId] of pilots) {
    const lesson = GOLDEN_BELL_BOOKS.find((item) => item.id === book).lessons.find((item) => item.id === lessonId);
    await printPage.emulateMedia({ media: "screen" });
    await printPage.goto(`${base}/fields-classic/question-bank/golden-bell.html?student=DEMO&book=${book}`, { waitUntil: "networkidle" });
    await printPage.waitForFunction(() => !document.querySelector(".protected-answer-notice"));
    await printPage.locator(`[data-lesson="${lessonId}"]`).click();
    const values = await printPage.locator("[data-source-track] option").evaluateAll((nodes) => nodes.map((node) => node.value));
    for (const [trackIndex, value] of values.entries()) {
    await printPage.emulateMedia({ media: "screen" });
    await printPage.locator("[data-source-track]").selectOption(value);
    await printPage.evaluate(() => { window.print = () => {}; });
    await printPage.locator("#printLessonButton").click();
    await printPage.waitForFunction(() => document.querySelector("#printStatus").textContent.startsWith("A4 "));
    await printPage.waitForFunction(() => document.querySelectorAll(".source-animation-print-frame").length > 0);
    assert.equal(await printPage.locator(".gold-print-source-item").count(), lesson.original.items.length);
    assert.equal(await printPage.locator('.gold-print-story').count(), 1 + (lesson.similarPractice || []).length);
    await printPage.emulateMedia({ media: "print" });
    const smallCoreText = await printPage.locator(".source-animation-print-page > .gold-print-concept, .source-animation-print-frame > p, .source-animation-print-frame .source-animation-b10__calculation strong").evaluateAll((nodes) => nodes.filter((node) => parseFloat(getComputedStyle(node).fontSize) < 16).map((node) => node.className || node.tagName));
    assert.deepEqual(smallCoreText, [], `${book}/${value}: core print type must remain readable`);
    const bad = await printPage.locator(".gold-print-page").evaluateAll((nodes) => nodes.flatMap((node) => {
      const outer = node.getBoundingClientRect();
      const footer = node.querySelector(".gold-print-footer").getBoundingClientRect();
      const content = [...node.children].filter((child) => !child.classList.contains("gold-print-footer"));
      const bottom = Math.max(...content.map((child) => child.getBoundingClientRect().bottom));
      return bottom > footer.top - 2 || outer.height > 1022 ? [{ part: node.dataset.printPart, contentBottom: bottom - outer.top, footerTop: footer.top - outer.top, height: outer.height }] : [];
    }));
    assert.deepEqual(bad, [], `${book}: A4 boundary/footer overlap`);
    const pdf = await printPage.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
    const parsed = await PDFDocument.load(pdf);
    assert.equal(parsed.getPageCount(), await printPage.locator(".gold-print-page").count(), `${book}: physical PDF has spillover pages`);
    if (output) {
      const name = trackIndex === 0 ? book : `${book}-track-${trackIndex + 1}`;
      await fs.writeFile(path.join(output, `${name}-learning.pdf`), pdf);
      await printPage.locator(".source-animation-print-page").first().screenshot({ path: path.join(output, `${name}-print.png`) });
    }
    report.print.push({ book, track: value, pages: parsed.getPageCount(), sources: lesson.original.items.length, additional: 1 + (lesson.similarPractice || []).length });
    }
  }
  await printContext.close();

  const locked = await context(false, { width: 390, height: 844 });
  const lockedPage = await locked.newPage();
  for (const [book, lesson] of pilots) {
    await lockedPage.goto(`${base}/fields-classic/question-bank/golden-bell.html?book=${book}`, { waitUntil: "networkidle" });
    await lockedPage.locator(`[data-lesson="${lesson}"]`).click();
    assert.equal(await lockedPage.locator(".source-animation").count(), 0, "Guest must not build a solved animation");
    assert.equal(await lockedPage.evaluate(() => globalThis.__sourceAnimationBuildCount || 0), 0, "Animation builder ran before authorization");
    await lockedPage.evaluate(() => { window.print = () => {}; });
    await lockedPage.locator("#printLessonButton").click();
    assert.equal(await lockedPage.locator(".source-animation-print-frame").count(), 0, "locked session printed the worked animation");
  }
  await locked.close();
  if (output) await fs.writeFile(path.join(output, "animation-audit.json"), JSON.stringify(report, null, 2));
  console.log(`SOURCE_ANIMATION_BROWSER_OK ${JSON.stringify(report)}`);
} finally {
  await browser.close();
}
