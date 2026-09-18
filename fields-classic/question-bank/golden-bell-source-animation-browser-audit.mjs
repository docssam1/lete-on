import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import "../../geometry/worksheet/generators.js";
import "../../geometry/worksheet/render.js";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js";
import { conceptAnimationExamplesForLesson, sourceAnimationFrame, sourceAnimationsForLesson } from "./golden-bell-source-animations.js";

const modules = process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = await import(pathToFileURL(path.join(modules, "playwright/index.mjs")).href);
const require = createRequire(import.meta.url);
const { PDFDocument } = require(path.join(modules, "pdf-lib"));
const base = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(new URL(base).hostname), "Private fixtures are local-only");
const output = process.env.FIELDS_CAPTURE_DIR;
if (output) await fs.mkdir(output, { recursive: true });
const pilots = [["book-04", "hidden-cube-count", 3], ["book-10", "catch-up-acorns", 5]];
const conceptStages = ["given", "target", "transform", "verify"];

function syntheticAnswerRecords(book) {
  const records = {};
  const visit = (node) => {
    if (!node || typeof node !== "object") return;
    if (typeof node.answerRef === "string") records[node.answerRef] = { solution: "local source-animation UI fixture" };
    Object.values(node).forEach(visit);
  };
  visit(book);
  return records;
}

const useSyntheticFixture = process.env.FIELDS_SYNTHETIC_AUTH_FIXTURE === "1";
assert.ok(process.env.FIELDS_PRIVATE_ANSWER_BANK || useSyntheticFixture, "Set FIELDS_PRIVATE_ANSWER_BANK or explicitly enable the local synthetic UI fixture");
const privateBank = process.env.FIELDS_PRIVATE_ANSWER_BANK
  ? JSON.parse(await fs.readFile(process.env.FIELDS_PRIVATE_ANSWER_BANK, "utf8"))
  : { books: Object.fromEntries(pilots.map(([bookId]) => {
    const book = GOLDEN_BELL_BOOKS.find((item) => item.id === bookId);
    return [bookId, syntheticAnswerRecords(book)];
  })) };
const browser = await chromium.launch();

function independentHiddenCount(map) {
  const cubes = map.flatMap((row, z) => row.flatMap((height, x) => Array.from({ length: height }, (_, y) => ({ x, y, z }))));
  return cubes.filter((cube) => ["x", "y", "z"].every((axis) => cubes.some((other) => other[axis] > cube[axis]
    && ["x", "y", "z"].filter((name) => name !== axis).every((name) => other[name] === cube[name])))).length;
}

function independentValues(visual) {
  const rows = visual.equations || visual.attempts?.map((attempt) => ({ terms: attempt.hits, total: attempt.total }));
  const values = [];
  for (let first = 1; first <= 100; first += 1) for (let second = 1; second <= 100; second += 1) {
    if (rows.every((row) => row.terms[0] * first + row.terms[1] * second === row.total)) values.push([first, second]);
  }
  return values;
}

function auditConceptExamples() {
  return pilots.map(([bookId, lessonId, expectedCount]) => {
    const lesson = GOLDEN_BELL_BOOKS.find((book) => book.id === bookId).lessons.find((item) => item.id === lessonId);
    const originalIds = new Set(lesson.original.items.map((item) => item.id));
    const similarIds = new Set((lesson.similarPractice || []).map((item) => item.id).filter(Boolean));
    const forbiddenIds = new Set([...originalIds, ...similarIds]);
    const originalVisuals = new Set(lesson.original.items.map((item) => JSON.stringify(item.visual)));
    const examples = conceptAnimationExamplesForLesson(lessonId);
    const tracks = sourceAnimationsForLesson(lesson);
    assert.equal(examples.length, expectedCount, `${lessonId}: concept example count changed`);
    assert.equal(tracks.length, expectedCount, `${lessonId}: concept animation count changed`);
    for (const [index, example] of examples.entries()) {
      const track = tracks[index];
      assert.match(example.id, /^concept-example-/u, `${lessonId}: example ID is not isolated`);
      assert.equal(forbiddenIds.has(example.id), false, `${lessonId}: example reuses a practice ID`);
      assert.equal(Object.hasOwn(example, "answerRef"), false, `${lessonId}: concept example references an answer record`);
      assert.equal(Object.hasOwn(example, "sourceNo"), false, `${lessonId}: concept example references a source number`);
      assert.equal(originalVisuals.has(JSON.stringify(example.visual)), false, `${lessonId}: concept visual copies an original item`);
      for (const id of forbiddenIds) assert.equal(JSON.stringify(example).includes(id), false, `${lessonId}: concept example embeds practice ID ${id}`);
      assert.equal(track.sourceItemId, example.id, `${lessonId}: track ID diverges from its concept example`);
      assert.deepEqual(track.beats.map((beat) => beat.phase), conceptStages, `${example.id}: semantic stages changed`);
      const frames = track.beats.map((_, step) => sourceAnimationFrame(track, step));
      assert.equal(new Set(frames).size, conceptStages.length, `${example.id}: one or more stages have no state change`);
      frames.slice(0, -1).forEach((frame, step) => {
        assert.doesNotMatch(frame, /source-animation-final-answer|data-answer-value/u, `${example.id}/${conceptStages[step]}: answer leaked before verification`);
        assert.match(frame, new RegExp(`data-concept-stage="${conceptStages[step]}"`, "u"));
      });
      const finalFrame = frames.at(-1);
      assert.match(finalFrame, /source-animation-final-answer/u, `${example.id}: final answer is missing`);
      assert.match(finalFrame, /data-concept-stage="verify"/u, `${example.id}: final stage is not verification`);
      if (lessonId === "hidden-cube-count") {
        const hidden = independentHiddenCount(example.visual.map);
        assert.equal(track.hidden, hidden, `${example.id}: hidden-cube answer failed independent calculation`);
        assert.ok(frames.slice(0, -1).every((frame) => !frame.includes(`${track.total} - ${track.visible} = ${hidden}`)), `${example.id}: completed hidden-count equation leaked early`);
        assert.match(finalFrame, new RegExp(`data-answer-value="${hidden}"`, "u"), `${example.id}: rendered hidden answer differs from calculation`);
      } else {
        const solutions = independentValues(example.visual);
        assert.deepEqual(solutions, [track.model.values], `${example.id}: shape values are not uniquely verified`);
        const answerLabels = (track.model.symbols || track.model.zones).map((item) => item.label);
        for (const [answerIndex, label] of answerLabels.entries()) {
          assert.ok(frames.slice(0, -1).every((frame) => !frame.includes(`${label} = ${track.model.values[answerIndex]}`)), `${example.id}: named answer leaked early`);
        }
        assert.match(finalFrame, new RegExp(`data-answer-values="${track.model.values.join(",")}"`, "u"), `${example.id}: rendered values differ from calculation`);
      }
    }
    return { book: bookId, lesson: lessonId, examples: examples.length, idIsolation: "pass", answerTiming: "pass", stateChanges: "pass", math: "pass" };
  });
}

const report = { authMode: useSyntheticFixture ? "isolated synthetic UI fixture; not an answer or live authorization audit" : "isolated private UI fixture; not a live server authorization audit", examples: auditConceptExamples(), views: [], print: [] };

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
      const lesson = GOLDEN_BELL_BOOKS.find((item) => item.id === book).lessons.find((item) => item.id === lessonId);
      const sourceIds = new Set([...lesson.original.items, ...(lesson.similarPractice || [])].map((item) => item.id).filter(Boolean));
      assert.ok(values.every((value) => value.startsWith("concept-example-") && !sourceIds.has(value)), `${book}: picker exposed a source/practice item`);
      assert.equal(await page.locator('[data-phase="original"]').isEnabled(), true, "explanation must not require quiz completion");
      let frames = 0;
      for (const value of values) {
        await page.locator("[data-source-track]").selectOption(value);
        const steps = await page.locator("[data-source-step]").count();
        assert.equal(steps, conceptStages.length, `${value}: concept must use four semantic stages`);
        const initialPolygons = await page.locator(".source-cube-model svg polygon").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("points")));
        const renderedStates = [];
        for (let step = 0; step < steps; step += 1) {
          await page.locator(`[data-source-step="${step}"]`).click();
          assert.equal(await page.locator(".source-animation").getAttribute("data-source-item"), value);
          const scene = page.locator(".source-animation-scene [data-concept-stage]");
          assert.equal(await scene.count(), 1, `${value}/${step}: concept stage marker missing`);
          assert.equal(await scene.getAttribute("data-concept-stage"), conceptStages[step], `${value}/${step}: wrong semantic stage`);
          assert.equal(await scene.getAttribute("data-concept-example"), value, `${value}/${step}: scene uses a different example`);
          assert.equal(await page.locator(".source-animation-final-answer").count(), step === steps - 1 ? 1 : 0, `${value}/${step}: answer visibility is out of sequence`);
          assert.ok((await page.locator(".source-animation-scene").innerText()).trim().length > 0);
          assert.ok((await page.locator(".source-animation .experience-caption").innerText()).trim().length > 0);
          if (initialPolygons.length) assert.deepEqual(await page.locator(".source-cube-model svg polygon").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("points"))), initialPolygons, "the same cube stack must remain through all scenes");
          assert.equal(await page.locator(".source-animation .is-animating,.source-animation .is-moving").count(), 0, "seeking must produce a static scene");
          renderedStates.push(await scene.innerHTML());
          await assertFit(page, `${book}/${value}/${step}/${width}`);
          frames += 1;
        }
        assert.equal(new Set(renderedStates).size, conceptStages.length, `${value}: browser stages do not visibly change`);
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
  assert.equal(await reducedPage.locator('[data-concept-stage="target"]').count(), 1);
  assert.ok(await reducedPage.locator(".source-cube-map .active").count() > 0);
  assert.equal(await reducedPage.locator(".source-animation-final-answer").count(), 0);
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
    const printFrameIds = await printPage.locator(".source-animation-print-frame").evaluateAll((nodes) => nodes.map((node) => node.dataset.sourceItem));
    assert.deepEqual(printFrameIds, conceptStages.map(() => value), `${book}/${value}: print switched away from the selected concept example`);
    assert.deepEqual(await printPage.locator(".source-animation-print-frame [data-concept-stage]").evaluateAll((nodes) => nodes.map((node) => node.dataset.conceptStage)), conceptStages, `${book}/${value}: print semantic stages changed`);
    assert.deepEqual(await printPage.locator(".source-animation-print-frame").evaluateAll((nodes) => nodes.map((node) => node.querySelectorAll(".source-animation-final-answer").length)), [0, 0, 0, 1], `${book}/${value}: print answer is not final-only`);
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
