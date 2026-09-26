import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { HANDS_ON_UNITS, HANDS_ON_ACTIVITIES as activities, unitForLesson, newActivityState, applyActivityAction, activityCheck, expectedCells, expectedFoldSum, clockValueAfterQuarterTurns } from "./golden-bell-hands-on-models.js";
import { handsOnGuide } from "./golden-bell-hands-on-guide.js";
import { reflectedStroke, mirrorOperation } from "./golden-bell-hands-on-mirror.js";
import { preferenceCheck, preferenceSelection } from "./golden-bell-hands-on-preference.js";
import { equalLineAnswer } from "./golden-bell-hands-on-equal-lines.js";
import { topFoldedQuarter, foldedQuarterPiles } from "./golden-bell-hands-on-fold-quarters.js";
import { kakuroCheck } from "./golden-bell-hands-on-kakuro.js";
import { newInferenceState, inferenceCheck, inferenceCandidatePasses } from "./golden-bell-hands-on-inference.js";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-library.js";
import { courseAnswerPrintPages } from "./golden-bell-course-concepts.js";
import { cutPolygon, reflectCut } from "./golden-bell-hands-on-fold-shape.js";

const permutations = (values) => values.length ? values.flatMap((v, i) => permutations(values.filter((_, j) => i !== j)).map((rest) => [v, ...rest])) : [[]];
const sourceOrder = [["D", "B", "A", "C"], ["C", "B", "D", "A"], ["B", "C", "D", "A"]];
const solutions = new Map();
assert.equal(HANDS_ON_UNITS.length, 4);
assert.ok(HANDS_ON_UNITS.every((unit) => unit.activities.length >= 1 && unit.activities.length <= 4));
for (const lesson of GOLDEN_BELL_BOOKS[0].lessons) assert.ok(unitForLesson("book-01", lesson.id), lesson.id);
assert.equal(unitForLesson("book-02", "clock-turning"), undefined);
assert.equal(clockValueAfterQuarterTurns(3, 2), 9);
const printFixture = { id: "print-audit", title: "인쇄 검증", unit: "단원", original: { items: [] }, extension: { id: "worked", answer: "4", explanation: "2 + 2 = 4입니다." } };
const printBook = { id: "book-01", label: "1권", courseId: "course-01" };
assert.match(courseAnswerPrintPages(printFixture, printBook, "학생"), /2 \+ 2 = 4/);
assert.doesNotMatch(courseAnswerPrintPages(printFixture, printBook, "학생", { quick: true }), /2 \+ 2 = 4/);
assert.throws(() => courseAnswerPrintPages({ ...printFixture, extension: { id: "unworked", answer: "4" } }, printBook, "학생"), /Protected worked answers/);
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
  } else if (activity.kind === "mirror-shape") {
    const choices = round.options.map((operation) => JSON.stringify(reflectedStroke(round.stroke, operation)));
    assert.equal(new Set(choices).size, 4, "Four visibly distinct mirror options");
    assert.equal(reflectedStroke(round.stroke, "half")[0][0], 100 - round.stroke[0][0]);
    const correct = round.options.indexOf(mirrorOperation(round.mirror));
    state.mirrorChoice = (correct + 1) % 4;
    assert.equal(activityCheck(state), false);
    state.mirrorChoice = correct;
  } else if (activity.kind === "digital") {
    assert.equal(round.result.length, round.source.length);
    assert.equal(applyActivityAction(state, "digit", round.result[0]), false, "Read after moving the digit board");
    applyActivityAction(state, "digital-transform");
    for (const digit of round.result) applyActivityAction(state, "digit", digit);
  } else if (activity.kind === "preference") {
    const possible = permutations([0, 1, 2]).filter((values) => preferenceCheck(round, { cells: values.map((object, person) => person * 3 + object) }));
    assert.equal(possible.length, 1, "Preference clues have one solution");
    state.cells = possible[0].map((object, person) => person * 3 + object);
    assert.deepEqual(preferenceSelection([state.cells[0]], state.cells[0]), []);
    solutions.set(`${id}/${index}`, [...state.cells]);
  } else if (activity.kind === "equal-lines") {
    assert.equal(round.points.filter((point) => point[2] === null).length, 1);
    const answer = equalLineAnswer(round);
    assert.ok(answer >= 1 && answer <= 12);
    state.equalChoice = answer + (answer === 12 ? -1 : 1);
    assert.equal(activityCheck(state), false);
    state.equalChoice = answer;
  } else if (activity.kind === "fold-quarters") {
    const expectedTop = [3, 2, 4, 1, 2][index];
    assert.equal(topFoldedQuarter(round), expectedTop);
    assert.equal(foldedQuarterPiles(round.folds).flat().length, 4);
    applyActivityAction(state, "fold");
    applyActivityAction(state, "fold");
    state.quarterChoice = expectedTop;
  } else if (activity.kind === "fold-shape") {
    const cut = cutPolygon(round);
    const options = round.options.map((operation) => JSON.stringify(reflectCut(cut, operation).map(([x, y]) => [x.toFixed(3), y.toFixed(3)])));
    assert.equal(new Set(options).size, 4, "Four distinct unfolded cut silhouettes");
    applyActivityAction(state, "fold");
    applyActivityAction(state, "cut");
    state.foldShapeChoice = round.options.indexOf(round.axis);
  } else if (activity.kind === "kakuro") {
    const holes = state.cells.map((cell, cellIndex) => cell === null ? cellIndex : -1).filter((cellIndex) => cellIndex >= 0);
    const possible = permutations(round.cards).map((values) => {
      const cells = [...state.cells];
      holes.forEach((cellIndex, i) => { cells[cellIndex] = values[i]; });
      return cells;
    }).filter((cells) => kakuroCheck(round, { cells }));
    assert.equal(possible.length, 1, "Kakuro row and column sums have one card placement");
    state.cells = possible[0];
    solutions.set(`${id}/${index}`, { holes, cells: [...state.cells] });
  } else if (activity.kind === "inference") {
    if (round.kind === "regroup") {
      state.bundles = [4, 1, 6];
    } else if (round.kind === "classify") {
      state.marks = round.numbers.map((number) => inferenceCandidatePasses(round, number));
      assert.ok(state.marks.some(Boolean));
    } else {
      const possible = permutations(round.cards.map((_, cardIndex) => cardIndex)).filter((slots) =>
        slots.length >= round.length && inferenceCheck(round, { ...newInferenceState(round), slots: slots.slice(0, round.length) }));
      const visible = [...new Set(possible.map((slots) => slots.slice(0, round.length).map((cardIndex) => round.cards[cardIndex]).join(",")))];
      assert.deepEqual(visible.length, 1, "One visible number sequence satisfies the conditions");
      state.slots = possible[0].slice(0, round.length);
      solutions.set(`${id}/${index}`, [...state.slots]);
    }
  } else if (activity.kind === "cross") {
    const possible = permutations([1, 2, 3, 4, 5].filter((n) => n !== round.center)).filter((slots) => activityCheck({ ...state, slots }));
    assert.equal(possible.length, 8, "Accept all eight placements, not a single authored order");
    state.slots = possible.find((slots) => state.slots.every((value, index) => value === null || value === slots[index]));
    assert.ok(state.slots, "A partial starting layout has a completion");
    solutions.set(`${id}/${index}`, state.slots);
  } else if (activity.kind === "order") {
    const possible = permutations(["A", "B", "C", "D"]).filter((slots) => activityCheck({ ...state, slots }));
    assert.equal(possible.length, 1, "Order clues have one solution");
    if (sourceOrder[index]) assert.deepEqual(possible, [sourceOrder[index]]);
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
    if (activity.kind === "fold") {
      const sum = expected.reduce((total, cell) => total + round.values[cell], 0);
      assert.equal(expectedFoldSum(round), sum);
      assert.equal(activityCheck(state), false, "Selected cells still require their number sum");
      const wrong = String(sum + 1);
      for (const digit of wrong) applyActivityAction(state, "fold-sum-digit", Number(digit));
      assert.equal(activityCheck(state), false, "A wrong number sum must not pass");
      for (const _ of wrong) applyActivityAction(state, "fold-sum-erase");
      for (const digit of String(sum)) applyActivityAction(state, "fold-sum-digit", Number(digit));
    }
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
console.log(`HANDS_ON_MATH_OK units=${HANDS_ON_UNITS.length} activities=${Object.keys(activities).length} rounds=${Object.values(activities).reduce((sum, activity) => sum + activity.rounds.length, 0)}`);

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
const report = { units: HANDS_ON_UNITS.length, activities: Object.keys(activities).length, rounds: [], print: [], transitions: [], math: "pass" };
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, hasTouch: width === 390, reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
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
        assert.equal(await host.locator("audio.hand-voice-player").count(), 1);
        assert.equal(await host.locator("[data-hand-voice]").count(), 1);
        assert.match(await host.locator("audio.hand-voice-player").getAttribute("src"), /clock-start\.mp3$/);
        await page.waitForFunction(() => document.querySelector(".hand-voice-player")?.currentTime > 0.05);
        assert.equal(await host.locator("audio.hand-voice-player").evaluate((node) => node.paused), false);
        assert.equal(await host.locator(".hand-guide").getAttribute("data-guide-phase"), "start");
        assert.match(await host.locator(".hand-guide-copy").innerText(), /반의 반 바퀴씩 돌려 문제를 맞춰 보자/);
        const taskStyle = await host.locator(".hand-task").evaluate((node) => ({
          size: getComputedStyle(node).fontSize,
          family: getComputedStyle(node).fontFamily,
          overflow: node.scrollWidth > node.clientWidth
        }));
        assert.equal(taskStyle.size, width === 390 ? "21px" : "24px");
        assert.match(taskStyle.family, /Noto Sans KR/);
        assert.equal(taskStyle.overflow, false);
        assert.doesNotMatch(await host.innerText(), /¼|1\/4/);
        await host.locator("[data-hand-voice]").click();
        assert.equal(await host.locator("[data-hand-voice]").getAttribute("aria-pressed"), "false");
        assert.equal(await host.locator("audio.hand-voice-player").evaluate((node) => node.paused), true);
        await host.locator("[data-hand-voice]").click();
        assert.equal(await host.locator("[data-hand-voice]").getAttribute("aria-pressed"), "true");
        assert.equal(await host.locator(".hand-task").evaluate((node) => Boolean(node.compareDocumentPosition(document.querySelector(".hand-guide")) & Node.DOCUMENT_POSITION_FOLLOWING)), true);
        await host.locator('[data-hand-activity="mirror-tiles"]').click();
        assert.equal(await host.locator(".hand-scene").getAttribute("data-hand-kind"), "mirror-shape");
        assert.equal(await host.locator("[data-hand-voice]").count(), 0);
        assert.equal(await host.locator("audio.hand-voice-player").evaluate((node) => node.paused), true);
        await host.locator('[data-hand-activity="turn-clock"]').click();
        assert.equal(await host.locator(".hand-scene").getAttribute("data-hand-kind"), "clock");
      }
      for (const [index, round] of activity.rounds.entries()) {
        assert.equal(await host.locator(".hand-scene").getAttribute("data-hand-round"), String(index));
        assert.equal(await host.locator(".hand-feedback").innerText(), "");
        if (activity.kind === "fold-shape") {
          assert.equal(await act("check").count(), 0);
          await act("fold").click();
          await act("cut").click();
          await act("fold-shape-choice", (round.options.indexOf(round.axis) + 1) % 4).click();
          assert.equal(await host.locator(".hand-feedback.retry").count(), 1);
          await act("reset").click();
        } else if (activity.kind === "inference") {
          if (round.kind === "regroup") {
            assert.equal(await host.locator(".hand-feedback.retry").count(), 0);
          } else if (round.kind === "classify") {
            for (const [i] of round.numbers.entries()) await act("mark", `${i}:reject`).click();
          } else {
            for (let i = 0; i < round.length; i++) { await act("choose", i).click(); await act("place", i).click(); }
          }
          if (round.kind !== "regroup") assert.equal(await host.locator(".hand-feedback.retry").count(), 1);
          await act("reset").click();
        } else if (activity.kind === "kakuro") {
          assert.equal(await act("check").count(), 0);
          const { holes, cells } = solutions.get(`${id}/${index}`);
          const wrong = holes.map((_, i) => cells[holes[(i + 1) % holes.length]]);
          for (const [i, cellIndex] of holes.entries()) {
            await act("kakuro-card", wrong[i]).click();
            await act("kakuro-cell", cellIndex).click();
          }
          assert.equal(await host.locator(".hand-feedback.retry").count(), 1);
          await act("reset").click();
        } else if (activity.kind === "fold-quarters") {
          assert.equal(await act("check").count(), 0);
          await act("fold").click();
          await act("fold").click();
          await act("quarter-choice", topFoldedQuarter(round) % 4 + 1).click();
          assert.equal(await host.locator(".hand-feedback.retry").count(), 1);
          await act("reset").click();
        } else if (activity.kind === "equal-lines") {
          assert.equal(await act("check").count(), 0);
          const answer = equalLineAnswer(round);
          await act("equal-choice", answer === 12 ? 11 : answer + 1).click();
          assert.equal(await host.locator(".hand-feedback.retry").count(), 1);
          await act("reset").click();
        } else if (activity.kind === "preference") {
          assert.equal(await act("check").count(), 0);
          const correct = solutions.get(`${id}/${index}`);
          const wrong = [correct[1] % 3, correct[2] % 3, correct[0] % 3].map((object, person) => person * 3 + object);
          for (const cell of wrong) await act("preference", cell).click();
          assert.equal(await host.locator(".hand-feedback.retry").count(), 1);
          await act("reset").click();
        } else if (activity.kind === "mirror-shape") {
          assert.equal(await act("check").count(), 0);
          const correct = round.options.indexOf(mirrorOperation(round.mirror));
          await act("mirror-choice", (correct + 1) % 4).click();
          assert.equal(await host.locator(".hand-feedback.retry").count(), 1);
          assert.match(await host.locator(".hand-feedback.retry").innerText(), /아직 아니에요/);
          if (index === 0) {
            await act("mirror-choice", correct).click();
            assert.equal(await host.locator(".hand-feedback.correct").count(), 1, "Correcting an answer needs no confirmation click");
          }
          await act("reset").click();
          if (index === 0) {
            await page.waitForTimeout(2100);
            assert.equal(await host.locator(".hand-scene").getAttribute("data-hand-round"), "0", "Reset cancels pending auto-advance");
          }
        } else if (activity.kind === "digital") {
          assert.equal(await act("check").count(), 0);
          await act("digital-transform").click();
          for (const digit of round.result.map((digit) => (digit + 1) % 10)) await act("digit", digit).click();
          assert.equal(await host.locator(".hand-feedback.retry").count(), 1);
          await act("reset").click();
          assert.equal(await host.locator(".hand-guide").getAttribute("data-guide-phase"), "start");
        } else if (activity.kind === "clock" || activity.kind === "transfer") {
          await act(activity.kind === "clock" ? "turn" : "move", activity.kind === "clock" ? -Math.sign(round.turns) : -1).click();
          assert.equal(await host.locator(".hand-feedback.retry").count(), 1);
          if (activity.kind === "clock") assert.match(await host.locator("audio.hand-voice-player").getAttribute("src"), /clock-retry\.mp3$/);
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
          assert.equal(await host.locator(".hand-guide").getAttribute("data-guide-phase"), "retry");
          await act("undo").click();
          assert.match(await host.locator(".hand-measure").innerText(), /아직 돌리지 않음/);
          for (let i = 0; i < Math.abs(round.turns); i++) await act("turn", Math.sign(round.turns)).click();
        } else if (activity.kind === "fold-shape") {
          await act("fold").click();
          await act("cut").click();
          await act("fold-shape-choice", round.options.indexOf(round.axis)).click();
        } else if (activity.kind === "inference") {
          if (round.kind === "regroup") await act("exchange").click();
          else if (round.kind === "classify") {
            for (const [i, number] of round.numbers.entries()) await act("mark", `${i}:${inferenceCandidatePasses(round, number) ? "keep" : "reject"}`).click();
          } else {
            for (const [slot, cardIndex] of solutions.get(`${id}/${index}`).entries()) {
              await act("choose", cardIndex).click();
              await act("place", slot).click();
            }
          }
        } else if (activity.kind === "kakuro") {
          const { holes, cells } = solutions.get(`${id}/${index}`);
          for (const cellIndex of holes) {
            await act("kakuro-card", cells[cellIndex]).click();
            await act("kakuro-cell", cellIndex).click();
          }
        } else if (activity.kind === "fold-quarters") {
          await act("fold").click();
          await act("fold").click();
          await act("quarter-choice", topFoldedQuarter(round)).click();
        } else if (activity.kind === "equal-lines") {
          await act("equal-choice", equalLineAnswer(round)).click();
          assert.equal(await host.locator('.hand-equal-choices [aria-pressed="true"]').count(), 1);
        } else if (activity.kind === "preference") {
          for (const cell of solutions.get(`${id}/${index}`)) await act("preference", cell).click();
          assert.equal(await host.locator('.hand-preference-cell[aria-pressed="true"]').count(), 3);
        } else if (activity.kind === "mirror-shape") {
          assert.equal(await host.locator(".hand-mirror-target svg").count(), 0);
          await act("mirror-choice", round.options.indexOf(mirrorOperation(round.mirror))).click();
        } else if (activity.kind === "digital") {
          await act("digital-transform").click();
          assert.equal(await host.locator(".hand-digital-result svg").count(), round.source.length);
          for (const digit of round.result) await act("digit", digit).click();
        } else if (activity.kind === "fold") {
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
          const cells = expectedCells(activity, round);
          await act("cell", cells[0]).focus();
          await page.keyboard.press("Space");
          assert.equal(await act("cell", cells[0]).getAttribute("aria-pressed"), "true");
          assert.equal(await act("cell", cells[0]).evaluate((node) => node === document.activeElement), true);
          for (const cell of cells.slice(1)) { if (width === 390) await act("cell", cell).tap(); else await act("cell", cell).click(); }
          assert.equal(await host.locator(".hand-feedback.correct").count(), 0, "Number sum required after selecting cells");
          for (const digit of String(expectedFoldSum(round))) await act("fold-sum-digit", Number(digit)).click();
        } else if (["cross", "order"].includes(activity.kind)) {
          const slots = solutions.get(`${id}/${index}`);
          for (const [slot, value] of slots.entries()) {
            if (round.startingSlots?.[slot] === value) continue;
            await act("choose", value).click(); await act("slot", slot).click();
          }
        } else {
          for (let i = 0; i < (round.left - round.right) / 2; i++) await act("move", 1).click();
        }
        assert.equal(await host.locator(".hand-feedback.correct").count(), 1, `${id}/${index}/${width}: correct`);
        if (activity.kind === "clock") {
          assert.match(await host.locator("audio.hand-voice-player").getAttribute("src"), /clock-success\.mp3$/);
          if (index === 0) {
            await page.waitForFunction(() => document.querySelector(".hand-voice-player")?.duration > 0);
            assert.ok(await host.locator("audio.hand-voice-player").evaluate((node) => node.duration) < 2);
          }
        }
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
        if (index === 0 && id === "turn-clock") {
          await host.locator('.hand-scene[data-hand-round="1"]').waitFor({ timeout: 3500 });
          assert.equal(await host.locator(".hand-feedback.correct").count(), 0, "Auto-advance starts a fresh challenge");
        } else if (index < activity.rounds.length - 1) await act("next").click();
      }
      assert.equal(await page.evaluate(() => localStorage.getItem("fields-classic-golden-bell:HANDS-QA")), progressBefore, "A game cannot complete or grade original questions");
      await act("questions").click();
      assert.equal(await page.locator(".gold-hands-on").count(), 0);
      assert.match(await page.locator("#stageSteps [data-phase='original']").getAttribute("class"), /active/);
      report.transitions.push({ id, width, original: "pass" });
    }
    for (const lesson of GOLDEN_BELL_BOOKS[0].lessons) {
      const unit = unitForLesson("book-01", lesson.id);
      await page.locator(`[data-lesson="${lesson.id}"]`).click();
      await page.locator(`[data-hand-open="${unit.activities[0]}"]`).click();
      await page.locator('[data-hand-action="questions"]').click();
      assert.match(await page.locator(`[data-lesson="${lesson.id}"]`).getAttribute("class"), /active/, `Stay on ${lesson.id}`);
      assert.match(await page.locator("#stageSteps [data-phase='original']").getAttribute("class"), /active/);
      report.transitions.push({ id: lesson.id, width, original: "same lesson" });
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
        assert.match(await page.locator("#printStatus").innerText(), /^A4 /, `${mode}: ${errors.join(" | ")}`);
        const root = page.locator("#goldPrintRoot");
        assert.equal(await root.locator(".gold-hands-on,.hand-scene").count(), 0);
        assert.doesNotMatch(await root.innerText(), /체험 도전 \d+개 완료|도전 \d+ \/ \d+/);
        const sourceCount = await root.locator('[data-print-part^="original-"]').count();
        const answerCount = await root.locator('[data-print-part^="answers-"]').count();
        assert.equal(sourceCount > 0, mode === "study" || mode === "both", `${mode}: source pages`);
        assert.equal(answerCount > 0, mode !== "study", `${mode}: answer pages`);
        if (mode === "quick") assert.equal(await root.locator(".course-answer-solution").count(), 0);
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
  assert.equal(await guest.locator(".hand-feedback.correct").count(), 1);
  await guest.locator("[data-hand-close]").click();
  assert.equal(await guest.locator("audio.hand-voice-player").evaluate((node) => node.paused), true);
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
