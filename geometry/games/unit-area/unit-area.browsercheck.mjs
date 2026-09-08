import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import { domains, problemsFor, answerFor } from "./core.js";

const base = process.env.GFIELD_BASE_URL || "http://127.0.0.1:8765";
const out = fileURLToPath(new URL("./qa-artifacts/", import.meta.url));
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: "block", reducedMotion: "reduce" });
const page = await context.newPage();
const errors = [];
page.on("pageerror", error => errors.push(error.message));
page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
let solvedFlows = 0, layoutCases = 0, alignments = 0;
async function layout() {
  const result = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > innerWidth,
    textOverflow: [...document.querySelectorAll("h1,h2,button,summary,.domain-tabs a,.comparison-choices label")].filter(el => el.clientWidth && el.scrollWidth > el.clientWidth + 1).map(el => el.textContent),
    diagram: document.querySelector("#board > svg")?.getBoundingClientRect().width || 0,
    badLabels: [...document.querySelectorAll("#board svg text")].filter(el => {
      const box = el.getBBox(), bounds = el.ownerSVGElement.viewBox.baseVal;
      return box.x < bounds.x - 1 || box.y < bounds.y - 1 || box.x + box.width > bounds.x + bounds.width + 1 || box.y + box.height > bounds.y + bounds.height + 1;
    }).map(el => el.textContent)
  }));
  assert.equal(result.overflow, false, JSON.stringify(result));
  assert.deepEqual(result.textOverflow, [], JSON.stringify(result));
  assert.deepEqual(result.badLabels, [], JSON.stringify(result));
  assert.ok(result.diagram >= 250, JSON.stringify(result));
  layoutCases++;
}
async function checkHidden() { assert.equal(await page.locator("#review").isVisible(), false); }
try {
  await page.goto(base + "/geometry/games/unit-area/");
  await page.evaluate(() => localStorage.setItem("gfield-profile", JSON.stringify({ name: "Existing learner", progress: { shapeTransform: { preserved: true } } })));
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const domain of domains) for (let round = 0; round < 4; round++) {
      await page.evaluate(({ level, round }) => localStorage.setItem(`gfield-pool-unit-area-${level}`, round), { level: domain.level, round });
      await page.goto(`${base}/geometry/games/unit-area/?domain=${domain.id}&lang=ko`);
      await page.waitForSelector("#board svg");
      for (let index = 0; index < 5; index++) {
        const problem = problemsFor(domain.id)[round * 5 + index];
        assert.equal(await page.locator("#board").getAttribute("data-problem-id"), problem.id);
        assert.equal(await page.locator("#check").isDisabled(), true);
        await checkHidden(); await layout();
        if (!index && !round) await page.screenshot({ path: `${out}/${domain.id}-${width}-student.png`, fullPage: true });
        const answer = answerFor(problem);
        if (domain.id === "build") {
          await page.locator('[data-cell="0,0"]').click();
          await page.locator("#check").click();
          await checkHidden();
          await page.locator('[data-cell="5,5"]').click();
          await page.locator("#check").click();
          assert.match(await page.locator("#feedback").textContent(), /변끼리/);
          await page.locator("#undo").click();
          await page.locator("#undo").click();
          assert.equal(await page.locator("#check").isDisabled(), true);
          // Reflect the example to exercise another accepted construction.
          const alternate = answer.map(([x, y]) => [problem.size - 1 - x, y]);
          for (const cell of alternate) await page.locator(`[data-cell="${cell.join(",")}"]`).click();
        } else if (domain.id === "compare") {
          await page.locator(`input[value=${answer === "less" ? "greater" : "less"}]`).check();
          await page.locator("#check").click(); await checkHidden();
          const original = await page.locator("#board [data-piece]").evaluateAll(nodes => nodes.map(el => el.getAttribute("data-piece")).sort());
          assert.equal(original.length, problem.left.length + problem.right.length);
          await page.locator("#aligned").check();
          assert.deepEqual(await page.locator("#board [data-piece]").evaluateAll(nodes => nodes.map(el => el.getAttribute("data-piece")).sort()), original);
          await layout(); alignments++;
          await page.locator(`input[value=${answer}]`).check();
        } else {
          if (domain.id === "halves") {
            await page.locator("#answer").fill(String(answer));
            await page.locator("#check").click(); await checkHidden();
            assert.match(await page.locator("#feedback").textContent(), /반칸/);
            const halves = problem.cells.map((cell, i) => cell.part === "full" ? -1 : i).filter(i => i !== -1);
            for (const i of halves) await page.locator(`[data-half="${i}"]`).click();
          } else if (!index) {
            const cell = problem.cells[0];
            await page.locator(`[data-cell="${cell.x},${cell.y}"]`).click();
            await page.locator("#undo").click();
          }
          await page.locator("#answer").fill(String(answer + 1));
          await page.locator("#check").click(); await checkHidden();
          await page.locator("#answer").fill(String(answer));
        }
        await page.locator("#check").click();
        assert.equal(await page.locator("#review").isVisible(), true, `${problem.id}: ${await page.locator("#feedback").textContent()}`);
        assert.equal(await page.locator("#next").isVisible(), true);
        await layout(); solvedFlows++;
        if (!index && !round) await page.screenshot({ path: `${out}/${domain.id}-${width}-answer.png`, fullPage: true });
        await page.locator("#next").click();
      }
      assert.equal(await page.locator("#completion").isVisible(), true);
      await page.locator("#close").click();
    }
  }
  for (const width of [320, 768]) {
    await page.setViewportSize({ width, height: 900 });
    for (const lang of ["ko", "en", "zh", "ja"]) for (const d of domains) {
      await page.goto(`${base}/geometry/games/unit-area/?domain=${d.id}&lang=${lang}`);
      await page.waitForSelector("#board svg");
      assert.equal(await page.locator("html").getAttribute("lang"), lang);
      await layout();
    }
  }
  await page.goto(`${base}/geometry/games/unit-area/?domain=build&lang=ko`);
  await page.locator('[data-cell="0,0"]').focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  assert.match(await page.locator("#buildReadout").textContent(), /1/);
  const id = await page.locator("#board").getAttribute("data-problem-id");
  await page.locator("#language").selectOption("en");
  assert.equal(await page.locator("#board").getAttribute("data-problem-id"), id);
  assert.match(await page.locator("#buildReadout").textContent(), /1/);
  await page.locator("#retry").click();
  assert.equal(await page.locator("#check").isDisabled(), true);
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(base + "/geometry/shape-garden/");
  await page.waitForSelector("#areaLevels a");
  assert.equal(await page.locator("#areaLevels a").count(), 4);
  assert.equal(await page.locator("#angleLevels a").count(), 4);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  const savedProfile = await page.evaluate(() => JSON.parse(localStorage.getItem("gfield-profile")));
  assert.equal(savedProfile.name, "Existing learner");
  assert.equal(savedProfile.progress.shapeTransform.preserved, true);
  assert.ok(savedProfile.progress.unitArea.completedProblem);
  assert.equal(Object.hasOwn(savedProfile, "score"), false);
  const touchContext = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, serviceWorkers: "block" });
  const touchPage = await touchContext.newPage();
  touchPage.on("pageerror", error => errors.push(error.message));
  await touchPage.goto(`${base}/geometry/games/unit-area/?domain=build&lang=ko`);
  for (const cell of answerFor(problemsFor("build")[0])) await touchPage.locator(`[data-cell="${cell.join(",")}"]`).tap();
  await touchPage.locator("#check").tap();
  assert.equal(await touchPage.locator("#review").isVisible(), true);
  await touchPage.screenshot({ path: `${out}/build-touch.png`, fullPage: true });
  await touchContext.close();
  const motionContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "no-preference", serviceWorkers: "block" });
  const motionPage = await motionContext.newPage();
  await motionPage.goto(`${base}/geometry/games/unit-area/?domain=compare&lang=ko`);
  const pieceRects = () => motionPage.locator("#board [data-piece]").evaluateAll(nodes => nodes.map(node => {
    const r = node.getBoundingClientRect();
    return { id: node.dataset.piece, x: r.x, y: r.y, width: r.width, height: r.height };
  }));
  const beforeMove = await pieceRects();
  await motionPage.locator("#aligned").check();
  const animationCount = await motionPage.evaluate(async () => {
    const animations = document.querySelector("#board").getAnimations({ subtree: true });
    await Promise.all(animations.map(animation => animation.finished));
    return animations.length;
  });
  assert.ok(animationCount > 0);
  const afterMove = await pieceRects();
  assert.deepEqual(afterMove.map(p => p.id), beforeMove.map(p => p.id));
  assert.ok(afterMove.some((piece, i) => Math.abs(piece.x - beforeMove[i].x) + Math.abs(piece.y - beforeMove[i].y) > 4));
  afterMove.forEach((piece, i) => {
    assert.ok(Math.abs(piece.width - beforeMove[i].width) < .1);
    assert.ok(Math.abs(piece.height - beforeMove[i].height) < .1);
  });
  await motionPage.screenshot({ path: `${out}/compare-aligned-mobile.png`, fullPage: true });
  await motionContext.close();
  assert.deepEqual(errors, []);
  const result = { passed: true, solvedFlows, layoutCases, alignments, areaPreservingMotion: true, keyboard: true, touch: true, reset: true, languagePersistence: true, profilePreserved: true, lobby: true, errors };
  await writeFile(`${out}/results.json`, JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result));
} finally { await browser.close(); }
