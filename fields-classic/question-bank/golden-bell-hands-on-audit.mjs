import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { HANDS_ON_UNITS, HANDS_ON_ACTIVITIES as activities, unitForLesson, newActivityState, applyActivityAction, activityCheck, expectedCells, clockValueAfterQuarterTurns } from "./golden-bell-hands-on-models.js";
import { handsOnGuide } from "./golden-bell-hands-on-guide.js";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-library.js";

const permutations = (values) => values.length ? values.flatMap((v, i) => permutations(values.filter((_, j) => i !== j)).map((rest) => [v, ...rest])) : [[]];
const sourceOrder = [["D", "B", "A", "C"], ["C", "B", "D", "A"], ["B", "C", "D", "A"]];
const solutions = new Map();
assert.equal(HANDS_ON_UNITS.length, 4);
assert.ok(HANDS_ON_UNITS.every((unit) => unit.activities.length >= 1 && unit.activities.length <= 2));
for (const lesson of GOLDEN_BELL_BOOKS[0].lessons) assert.ok(unitForLesson("book-01", lesson.id), lesson.id);
assert.equal(unitForLesson("book-02", "clock-turning"), undefined);
assert.equal(clockValueAfterQuarterTurns(3, 2), 9);
for (const [id, activity] of Object.entries(activities)) for (const [index, round] of activity.rounds.entries()) {
  const state = newActivityState(id, index);
  assert.equal(activityCheck(state), false, `${id}/${index}: no pre-completion`);
  assert.equal(handsOnGuide(activity, round, state).phase, "start");
  const retry = newActivityState(id, index);
  applyActivityAction(retry, "check");
  assert.equal(handsOnGuide(activity, round, retry).phase, "retry");
  if (activity.kind === "clock") {
    state.turns = round.turns + 4;
    assert.equal(activityCheck(state), false, "A matching endpoint with an extra turn is not the requested rotation");
    state.turns = round.turns;
  } else if (activity.kind === "cross") {
    const possible = permutations([1, 2, 3, 4, 5].filter((n) => n !== round.center)).filter((slots) => activityCheck({ ...state, slots }));
    assert.equal(possible.length, 8, "Accept all eight placements, not a single authored order");
    state.slots = possible[0];
    solutions.set(`${id}/${index}`, state.slots);
  } else if (activity.kind === "order") {
    const possible = permutations(["A", "B", "C", "D"]).filter((slots) => activityCheck({ ...state, slots }));
    assert.deepEqual(possible, [sourceOrder[index]]);
    state.slots = possible[0];
    solutions.set(`${id}/${index}`, state.slots);
  } else if (activity.kind === "transfer") {
    const half = (round.left - round.right) / 2;
    for (let i = 0; i < half; i++) applyActivityAction(state, "move", 1);
    assert.equal(state.left + state.right, round.left + round.right);
  } else {
    const expected = expectedCells(activity, round);
    if (activity.kind === "fold") {
      assert.equal(applyActivityAction(state, "cut"), false, "Must fold before cutting");
      assert.equal(applyActivityAction(state, "cell", 0), false, "No prediction before cutting");
      const cell = round.model.cuts[0][0];
      let independent = [[Math.round(cell[0] * 4), Math.round(cell[1] * 4)]];
      for (const fold of [...round.model.folds].reverse()) independent = [...independent, ...independent.map(([x, y]) => [fold === "left" || fold === "right" ? 3 - x : x, fold === "up" || fold === "down" ? 3 - y : y])];
      assert.deepEqual(expected, independent.map(([x, y]) => y * 4 + x).sort((a, b) => a - b));
      for (const _ of round.model.folds) applyActivityAction(state, "fold");
      applyActivityAction(state, "cut");
    } else {
      assert.deepEqual(expected, round.given.map(([x, y]) => round.axis.kind === "vertical" ? y * 4 + 3 - x : (3 - y) * 4 + x).sort((a, b) => a - b));
    }
    expected.forEach((cell) => applyActivityAction(state, "cell", cell));
  }
  assert.equal(activityCheck(state), true, `${id}/${index}: solution`);
  applyActivityAction(state, "check");
  assert.equal(state.solved, true);
  assert.equal(handsOnGuide(activity, round, state).phase, "success");
  assert.equal(applyActivityAction(state, "undo"), false, "Solved scene stays consistent with its explanation");
  assert.equal(newActivityState(id, index).solved, false);
}
const undo = newActivityState("share-equally");
applyActivityAction(undo, "move", 1);
applyActivityAction(undo, "undo");
assert.deepEqual([undo.left, undo.right, undo.moved, undo.history.length], [10, 4, 0, 0]);
console.log("HANDS_ON_MATH_OK units=4 activities=7 rounds=21");

if (process.argv.includes("--math-only")) process.exit(0);
const gameOnly = process.argv.includes("--game-only");
const output = process.env.FIELDS_CAPTURE_DIR;
const privateFile = process.env.FIELDS_PRIVATE_ANSWER_BANK;
assert.ok(output && privateFile, "Set external evidence directory and private answer fixture");
const privateBank = JSON.parse(await fs.readFile(privateFile, "utf8"));
const modules = process.env.CODEX_NODE_MODULES || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const { chromium } = await import(pathToFileURL(path.join(modules, "playwright/index.mjs")).href);
const { PDFDocument } = createRequire(import.meta.url)(path.join(modules, "pdf-lib"));
const base = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
assert.ok(["127.0.0.1", "localhost"].includes(new URL(base).hostname));
await fs.mkdir(output, { recursive: true });
const report = { units: 4, activities: 7, rounds: [], print: [], transitions: [], math: "pass" };
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, hasTouch: width === 390, reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("requestfailed", (request) => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
    await page.route("**/functions/v1/fields-auth", (route) => route.fulfill({ contentType: "application/json", body: "{}" }));
    await page.route("**/functions/v1/golden-bell-answers", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({ answers: privateBank.books["book-01"] }) }));
    await page.addInitScript(() => { sessionStorage.setItem("gfield_fields_session", "isolated-hands-on-review"); window.print = () => {}; });
    await page.goto(`${base}/fields-classic/question-bank/golden-bell.html?student=HANDS-QA&book=book-01`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => !document.querySelector(".protected-answer-notice"));
    const progressBefore = await page.evaluate(() => localStorage.getItem("fields-classic-golden-bell:HANDS-QA"));
    const open = async (id) => {
      await page.locator(`[data-lesson="${activities[id].lesson}"]`).click();
      const host = page.locator(".gold-hands-on");
      await host.locator(`[data-hand-open="${id}"]`).click();
      assert.equal(await host.locator("dialog[open]").count(), 1);
      assert.equal(await host.locator("select").count(), 0);
      assert.equal(await host.locator(".hand-guide img").count(), 1);
      return host;
    };
    for (const [id, activity] of Object.entries(activities)) {
      const host = await open(id);
      const act = (action, value) => host.locator(`[data-hand-action="${action}"]${value === undefined ? "" : `[data-value="${value}"]`}`);
      if (id === "turn-clock") {
        assert.equal(await host.locator("[data-hand-voice],audio").count(), 0);
        assert.equal(await host.locator(".hand-guide").getAttribute("data-guide-phase"), "start");
        assert.match(await host.locator(".hand-guide-copy").innerText(), /출발점과 방향/);
        assert.equal(await host.locator(".hand-task").evaluate((node) => Boolean(node.compareDocumentPosition(document.querySelector(".hand-guide")) & Node.DOCUMENT_POSITION_FOLLOWING)), true);
        await host.locator('[data-hand-activity="mirror-tiles"]').click();
        assert.equal(await host.locator(".hand-scene").getAttribute("data-hand-kind"), "mirror");
        await host.locator('[data-hand-activity="turn-clock"]').click();
        assert.equal(await host.locator(".hand-scene").getAttribute("data-hand-kind"), "clock");
      }
      for (const [index, round] of activity.rounds.entries()) {
        assert.equal(await host.locator(".hand-scene").getAttribute("data-hand-round"), String(index));
        assert.equal(await host.locator(".hand-feedback").innerText(), "");
        if (activity.kind !== "fold") {
          await act("check").click();
          assert.equal(await host.locator(".hand-feedback.retry").count(), 1);
          assert.equal(await host.locator(".hand-guide").getAttribute("data-guide-phase"), "retry");
          await act("reset").click();
          assert.equal(await host.locator(".hand-guide").getAttribute("data-guide-phase"), "start");
        }
        await host.locator("dialog").screenshot({ path: path.join(output, `${width}-${id}-${index}-start.png`) });
        if (index === 0) {
          await host.evaluate((node) => window.scrollTo(0, window.scrollY + node.getBoundingClientRect().top - 140));
          await page.screenshot({ path: path.join(output, `${width}-${id}-viewport.png`) });
        }
        if (activity.kind === "clock") {
          await act("turn", round.turns > 0 ? -1 : 1).click();
          assert.equal(await host.locator(".hand-guide").getAttribute("data-guide-phase"), "progress");
          await act("undo").click();
          assert.match(await host.locator(".hand-measure").innerText(), /0 \/ 4/);
          for (let i = 0; i < Math.abs(round.turns); i++) await act("turn", Math.sign(round.turns)).click();
        } else if (["mirror", "fold"].includes(activity.kind)) {
          if (activity.kind === "mirror") assert.equal(await host.locator(".hand-pair-guide").count(), 0);
          if (activity.kind === "fold") {
            assert.equal(await act("cut").isDisabled(), true);
            assert.equal(await host.locator(".hand-fold-crease,.hand-fold-arrow").count(), 2);
            assert.equal(await host.locator(".hand-fold-hole,.hand-fold-mark").count(), 0, "No cut or unfolded answer before folding");
            for (const _ of round.model.folds) await act("fold").click();
            assert.equal(await host.locator(".hand-guide").getAttribute("data-guide-phase"), "progress");
            assert.equal(await host.locator(".hand-fold-mark").count(), 1);
            assert.equal(await host.locator(".hand-fold-hole").count(), 0, "Only marked cut is shown before cutting");
            await act("cut").click();
            assert.equal(await host.locator(".hand-fold-hole").count(), 1, "Folded paper shows only its cut, not the unfolded answer");
            await host.locator("dialog").screenshot({ path: path.join(output, `${width}-${id}-${index}-cut.png`) });
          }
          const cells = expectedCells(activity, round);
          await act("cell", cells[0]).focus();
          await page.keyboard.press("Space");
          assert.equal(await act("cell", cells[0]).getAttribute("aria-pressed"), "true");
          assert.equal(await act("cell", cells[0]).evaluate((node) => node === document.activeElement), true);
          if (activity.kind === "mirror") {
            assert.equal(await host.locator(".hand-pair-guide").count(), 1);
            assert.equal(await host.locator(".pair-source").count(), 1, "Guide highlights only the counterpart of the chosen cell");
            if (index === 0) await host.locator("dialog").screenshot({ path: path.join(output, `${width}-${id}-pair.png`) });
          }
          for (const cell of cells.slice(1)) { if (width === 390) await act("cell", cell).tap(); else await act("cell", cell).click(); }
        } else if (["cross", "order"].includes(activity.kind)) {
          const slots = solutions.get(`${id}/${index}`);
          for (const [slot, value] of slots.entries()) { await act("choose", value).click(); await act("slot", slot).click(); }
        } else {
          for (let i = 0; i < (round.left - round.right) / 2; i++) await act("move", 1).click();
        }
        await act("check").click();
        assert.equal(await host.locator(".hand-feedback.correct").count(), 1, `${id}/${index}/${width}: correct`);
        assert.equal(await host.locator(".hand-guide").getAttribute("data-guide-phase"), "success");
        if (activity.kind === "fold") assert.equal(await host.locator(".hand-fold-hole").count(), expectedCells(activity, round).length);
        const overflow = await host.locator("dialog").evaluate((node) => {
          const r = node.getBoundingClientRect();
          return [...node.querySelectorAll("button,select,svg,.hand-grid")].filter((el) => {
            const box = el.getBoundingClientRect();
            return box.width && (box.left < r.left - 1 || box.right > r.right + 1);
          }).map((el) => el.outerHTML.slice(0, 200));
        });
        assert.deepEqual(overflow, [], `${id}/${width}: clipped control`);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
        assert.doesNotMatch(await host.innerHTML(), /\b(?:NaN|undefined)\b/);
        await host.locator("dialog").screenshot({ path: path.join(output, `${width}-${id}-${index}-solved.png`) });
        report.rounds.push({ id, round: index + 1, width, result: "pass" });
        if (index < activity.rounds.length - 1) await act("next").click();
      }
      assert.equal(await page.evaluate(() => localStorage.getItem("fields-classic-golden-bell:HANDS-QA")), progressBefore, "A game cannot complete or grade original questions");
      await act("questions").click();
      assert.equal(await page.locator(".gold-hands-on").count(), 0);
      assert.match(await page.locator("#stageSteps [data-phase='original']").getAttribute("class"), /active/);
      report.transitions.push({ id, width, original: "pass" });
    }
    // Screen controls stay out of print; authored paper challenges belong in each mode.
    if (width === 1440 && !gameOnly) {
      const host = await open("fold-twice");
      assert.equal(await host.locator(".hand-feedback.correct").count(), 1, "Retain activity within this tab after leaving a unit");
      await page.keyboard.press("Escape");
      assert.equal(await host.locator("dialog[open]").count(), 0);
      for (const mode of ["study", "answers", "quick", "both"]) {
        await page.selectOption("#coursePrintMode", mode);
        await page.locator("#printLessonButton").click();
        await page.waitForFunction(() => !document.querySelector("#printLessonButton").disabled);
        assert.match(await page.locator("#printStatus").innerText(), /^A4 /);
        const root = page.locator("#goldPrintRoot");
        assert.equal(await root.locator(".gold-hands-on,.hand-scene").count(), 0);
        assert.doesNotMatch(await root.innerText(), /체험 도전 3개 완료|도전 3 \/ 3/);
        const expectedRole = mode === "study" ? "student" : mode === "both" ? null : "answer";
        assert.equal(await root.locator('[data-print-challenge^="D"]').count(), mode === "both" ? 6 : 3);
        assert.equal(await root.locator('[data-print-role="student"]').count(), mode === "answers" || mode === "quick" ? 0 : 3);
        assert.equal(await root.locator('[data-print-role="answer"]').count(), mode === "study" ? 0 : 3);
        if (expectedRole) assert.equal(await root.locator(`[data-print-role="${expectedRole}"]`).count(), 3);
        await page.emulateMedia({ media: "print" });
        const count = await root.locator(".gold-print-page").count();
        const pdf = await page.pdf({ path: path.join(output, `fold-twice-${mode}.pdf`), format: "A4", printBackground: true });
        assert.equal((await PDFDocument.load(pdf)).getPageCount(), count);
        const answerIndex = await root.locator(".gold-print-page").evaluateAll((nodes) => nodes.findIndex((node) => node.dataset.printPart.startsWith("answers-")));
        if (mode === "both") assert.equal(answerIndex % 2, 0);
        if (["answers", "quick"].includes(mode)) assert.equal(await root.locator(".gold-print-cover,.gold-print-duplex-blank").count(), 0);
        report.print.push({ mode, pages: count, answerPage: answerIndex + 1 });
        await page.emulateMedia({ media: "screen" });
      }
    }
    assert.deepEqual(errors, []);
    await page.close();
  }
  const guest = await browser.newPage({ viewport: { width: 390, height: 900 } });
  await guest.goto(`${base}/fields-classic/question-bank/golden-bell.html?student=GUEST&book=book-01`, { waitUntil: "networkidle" });
  await guest.locator(".protected-answer-notice").waitFor();
  await guest.locator('.gold-hands-on [data-hand-open="turn-clock"]').click();
  for (let i = 0; i < 2; i++) await guest.locator('[data-hand-action="turn"][data-value="1"]').click();
  assert.match(await guest.locator(".clock-hand").getAttribute("style"), /270deg/);
  await guest.locator('[data-hand-action="check"]').click();
  assert.equal(await guest.locator(".hand-feedback.correct").count(), 1);
  await guest.locator("[data-hand-close]").click();
  await guest.locator('[data-next-phase="original"]').click();
  assert.equal(await guest.locator('.quiz-item-solution').count(), 0);
  assert.ok(await guest.locator('[data-original-check]:disabled,[data-original-answer]:disabled').count());
  assert.equal(await guest.evaluate(() => localStorage.getItem("fields-classic-golden-bell:GUEST")), null);
  report.guest = "Authored activity playable; protected original answers remain locked; no lesson record changed";
  await guest.close();
  const motion = await browser.newPage({ viewport: { width: 390, height: 900 }, reducedMotion: "no-preference" });
  await motion.goto(`${base}/fields-classic/question-bank/golden-bell.html?student=GUEST&book=book-01`, { waitUntil: "networkidle" });
  await motion.locator('[data-lesson="fold-two-cut"]').click();
  await motion.locator('.gold-hands-on [data-hand-open="fold-twice"]').click();
  await motion.locator('[data-hand-action="fold"]').click();
  const flap = motion.locator(".hand-fold-moving");
  assert.equal(await flap.count(), 1);
  assert.match(await flap.evaluate((node) => getComputedStyle(node).animationName), /hand-fold-vertical/);
  await motion.waitForTimeout(110);
  await motion.locator("dialog[open]").screenshot({ path: path.join(output, "390-fold-twice-motion.png") });
  await flap.evaluate((node) => Promise.all(node.getAnimations().map((animation) => animation.finished)));
  assert.equal(await flap.evaluate((node) => getComputedStyle(node).opacity), "0");
  report.motion = "Folded face animates over the crease, then clears; reduced-motion test uses the static final state";
  await motion.close();
  report.guide = "Text-only Docssam speech bubble follows start, progress, retry, and success; no audio control";
  await fs.writeFile(path.join(output, "hands-on-review.json"), JSON.stringify(report, null, 2));
  console.log(`HANDS_ON_BROWSER_OK rounds=${report.rounds.length} transitions=${report.transitions.length} pdf=${report.print.length}`);
} finally { await browser.close(); }
