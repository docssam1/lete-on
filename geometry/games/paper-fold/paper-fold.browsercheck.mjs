import assert from "node:assert/strict";
import { mkdir, stat } from "node:fs/promises";
import { chromium } from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import { levels } from "./levels.js";

const baseUrl = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8765").replace(/\/$/, "");
const output = process.env.GFIELD_SCREENSHOT_DIR || "E:/Codex/visualizations/2026/07/14/019f6069-3d4e-7503-8438-a193bbe6c30a/paper-fold-flexible-ten";
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const errors = [];

async function makePage(viewport) {
  const page = await browser.newPage({ viewport });
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    localStorage.setItem("gfield-audio-muted", "true");
    localStorage.setItem("gfield-language", "ko");
    localStorage.removeItem("gfield-paper-fold-progress-v4");
    localStorage.removeItem("gfield-paper-fold-recent-v4");
  });
  return page;
}

async function currentProblem(page) {
  const saved = JSON.parse(await page.evaluate(() => localStorage.getItem("gfield-paper-fold-progress-v4")));
  const level = levels[saved.level - 1];
  const problem = level.problems.find((item) => item.id === saved.queue[saved.index]);
  assert.ok(problem, `missing current problem ${saved.queue[saved.index]}`);
  return problem;
}

async function clickPaperSide(page, step) {
  const diagram = page.locator(".paper-action-step .paper-diagram");
  const point = await diagram.evaluate((svg, currentStep) => {
    const bounds = svg.querySelector(".paper-top-face").getBBox();
    const ratios = {
      left: [.25, .5], right: [.75, .5], top: [.5, .25], bottom: [.5, .75],
      upper: currentStep.axis === "diag-main" ? [.75, .25] : [.25, .25],
      lower: currentStep.axis === "diag-main" ? [.25, .75] : [.75, .75]
    };
    const [xRatio, yRatio] = ratios[currentStep.answer];
    const source = svg.createSVGPoint();
    source.x = bounds.x + bounds.width * xRatio;
    source.y = bounds.y + bounds.height * yRatio;
    const screen = source.matrixTransform(svg.getScreenCTM());
    return { x: screen.x, y: screen.y };
  }, step);
  await page.mouse.click(point.x, point.y);
}

async function solveCurrent(page, context = "") {
  const problem = await currentProblem(page);
  if (problem.interaction !== "connect-match") {
    assert.equal(await page.locator(".fold-sequence-view figure").count(), problem.folds.length === 2 ? 4 : 3);
    assert.equal(await page.locator(".paper-fold-arrow").count(), problem.folds.length + 1);
    const marker = page.locator(".fold-sequence-view marker").first();
    assert.equal(await marker.getAttribute("markerUnits"), "userSpaceOnUse");
    assert.ok(Number(await marker.getAttribute("markerWidth")) <= 7, "fold arrow head is too large");
    for (const arrow of await page.locator(".paper-fold-arrow").all()) {
      const geometry = await arrow.evaluate((node) => {
        const bounds = node.getBBox();
        const paper = node.ownerSVGElement.querySelector(".paper-top-face").getBBox();
        const end = node.getPointAtLength(node.getTotalLength());
        return {
          box: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height },
          axis: node.ownerSVGElement.dataset.foldAxis,
          side: node.ownerSVGElement.dataset.foldSide,
          end: { x: (end.x - paper.x) / paper.width, y: (end.y - paper.y) / paper.height }
        };
      });
      const { box } = geometry;
      assert.ok(box.x >= 19 && box.y >= 19 && box.x + box.width <= 181 && box.y + box.height <= 181, `fold arrow misses paper: ${JSON.stringify(box)}`);
      if (geometry.axis === "vertical") assert.ok(geometry.side === "left" ? geometry.end.x > .5 : geometry.end.x < .5, `vertical arrow points to wrong face: ${JSON.stringify(geometry)}`);
      if (geometry.axis === "horizontal") assert.ok(geometry.side === "top" ? geometry.end.y > .5 : geometry.end.y < .5, `horizontal arrow points to wrong face: ${JSON.stringify(geometry)}`);
      if (geometry.axis === "diag-main") assert.ok(geometry.side === "upper" ? geometry.end.y > geometry.end.x : geometry.end.y < geometry.end.x, `diagonal arrow points to wrong face: ${JSON.stringify(geometry)}`);
      if (geometry.axis === "diag-anti") assert.ok(geometry.side === "upper" ? geometry.end.x + geometry.end.y > 1 : geometry.end.x + geometry.end.y < 1, `diagonal arrow points to wrong face: ${JSON.stringify(geometry)}`);
    }
    for (const [stepIndex, step] of problem.unfoldSteps.entries()) {
      assert.equal(await page.locator("[data-side]").count(), 2);
      assert.equal(await page.locator(".side-choice").count(), 0);
      assert.equal(await page.locator(".paper-action-step [data-side]").count(), 2);
      assert.equal(await page.locator(".result-step.paper-action-step").count(), 1);
      assert.equal(await page.locator(".fold-sequence-view figure:not(.result-step) [data-side]").count(), 0);
      await clickPaperSide(page, step);
      await page.waitForTimeout(500);
      const progressed = await page.locator("[data-side], [data-choice], #nextButton:not([hidden])").count();
      assert.ok(progressed > 0, `${context} ${problem.id} did not advance after touch step ${stepIndex + 1}`);
    }
    if (!problem.completeOnUnfold && problem.interaction !== "hole-result") {
      assert.equal(await page.locator("[data-choice]").count(), 3, `${context} ${problem.id} did not show final choices`);
      await page.locator(`[data-choice="${problem.answer}"]`).click();
    } else {
      assert.equal(await page.locator("[data-choice]").count(), 0, `${context} ${problem.id} should finish through reverse unfolding`);
    }
  } else {
    assert.equal(await page.locator("[data-left]").count(), 3);
    assert.equal(await page.locator("[data-right]").count(), 3);
    assert.equal(await page.locator(".check-button").count(), 0);
    for (const pair of problem.pairs) {
      await page.locator(`[data-left="${pair.key}"]`).click();
      await page.locator(`[data-right="${pair.key}"]`).click();
    }
    assert.equal(await page.locator("#connectionLines path").count(), 3);
  }
  await page.locator("#nextButton:not([hidden])").waitFor();
  return problem;
}

async function advance(page) {
  await page.waitForTimeout(660);
  await page.locator("#nextButton").click();
}

async function verifyImmediateWrongRecovery(page) {
  const problem = await currentProblem(page);
  assert.equal(problem.interaction, "connect-match");
  const rightKeys = problem.pairs.map((pair) => pair.key);
  for (let index = 0; index < problem.pairs.length; index += 1) {
    const pair = problem.pairs[index];
    const wrongRight = rightKeys[(index + 1) % rightKeys.length];
    await page.locator(`[data-left="${pair.key}"]`).click();
    await page.locator(`[data-right="${wrongRight}"]`).click();
  }
  await page.locator(".connect-card.wrong").first().waitFor();
  assert.equal(await page.locator(".check-button").count(), 0);
  await page.waitForTimeout(620);
  assert.equal(await page.locator("#connectionLines path").count(), 0);
}

const desktop = await makePage({ width: 1280, height: 820 });
await desktop.goto(`${baseUrl}/geometry/games/paper-fold/?level=1`, { waitUntil: "networkidle" });
assert.equal(await desktop.locator("#soundButton").count(), 0, "silent paper-fold course must not show a sound toggle");
assert.equal(await desktop.locator("#problemLabel").textContent(), "1 / 10");
assert.equal(await desktop.locator("#levelLabel").textContent(), "색종이 접어 자르기");
await desktop.locator("#levelButton").click();
assert.equal(await desktop.locator(".level-card").count(), 2);
await desktop.locator("#closeLevels").click();
await desktop.screenshot({ path: `${output}/direct-touch-desktop.png`, fullPage: true });

const interactions = new Set();
for (let index = 0; index < 10; index += 1) {
  if (index === 1) await verifyImmediateWrongRecovery(desktop);
  const solved = await solveCurrent(desktop);
  interactions.add(solved.interaction);
  if (index === 0) await desktop.screenshot({ path: `${output}/choice-desktop.png`, fullPage: true });
  if (index === 1) await desktop.screenshot({ path: `${output}/connect-desktop.png`, fullPage: true });
  await advance(desktop);
}
assert.ok(interactions.has("connect-match"));
assert.ok(interactions.has("piece-count"));
assert.equal(await desktop.locator("#completeDialog:not([hidden])").count(), 1);
assert.match(await desktop.locator("#completeTitle").textContent(), /10문제/);
assert.match(await desktop.locator("#nextLevelButton").textContent(), /10문제 더/);
await desktop.locator("#nextLevelButton").click();
assert.equal(await desktop.locator("#problemLabel").textContent(), "11 / 20");

for (let index = 10; index < 20; index += 1) {
  await solveCurrent(desktop);
  await advance(desktop);
}
assert.equal(await desktop.locator("#completeDialog:not([hidden])").count(), 1);
assert.match(await desktop.locator("#completeTitle").textContent(), /20문제/);

await desktop.goto(`${baseUrl}/geometry/games/paper-fold/?level=2`, { waitUntil: "networkidle" });
const doubleFold = await currentProblem(desktop);
assert.ok([1, 2].includes(doubleFold.folds.length));
assert.ok(doubleFold.kind.includes("holes"));
await solveCurrent(desktop);
await desktop.screenshot({ path: `${output}/double-fold-desktop.png`, fullPage: true });

const forcedDoubleCut = levels[0].problems.find((item) => item.interaction === "piece-count" && item.folds.length === 2);
assert.ok(forcedDoubleCut, "missing a two-fold cut problem");
const forcedQueue = [forcedDoubleCut.id, ...levels[0].problems.filter((item) => item.id !== forcedDoubleCut.id).slice(0, 9).map((item) => item.id)];
const doubleCutPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
doubleCutPage.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
doubleCutPage.on("pageerror", (error) => errors.push(error.message));
await doubleCutPage.addInitScript(({ queue }) => {
  localStorage.setItem("gfield-audio-muted", "true");
  localStorage.setItem("gfield-language", "ko");
  localStorage.setItem("gfield-paper-fold-progress-v4", JSON.stringify({ level: 1, index: 0, queue }));
}, { queue: forcedQueue });
await doubleCutPage.goto(`${baseUrl}/geometry/games/paper-fold/`, { waitUntil: "networkidle" });
assert.equal((await currentProblem(doubleCutPage)).id, forcedDoubleCut.id);
assert.equal(await doubleCutPage.locator(".fold-sequence-view figure").count(), 4);
assert.equal(await doubleCutPage.locator(".side-choice").count(), 0);
assert.deepEqual((await doubleCutPage.locator(".layer-badge text").allTextContents()).sort(), ["2겹", "2겹", "4겹"]);
assert.ok(await doubleCutPage.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth) <= 1);
await doubleCutPage.screenshot({ path: `${output}/double-cut-portrait.png`, fullPage: true });
await clickPaperSide(doubleCutPage, forcedDoubleCut.unfoldSteps[0]);
assert.equal(await doubleCutPage.locator(".paper-diagram.touch-correct").count(), 1);
await doubleCutPage.waitForTimeout(170);
await doubleCutPage.screenshot({ path: `${output}/unfold-first-animation-portrait.png`, fullPage: true });
await doubleCutPage.waitForTimeout(330);
assert.equal(await doubleCutPage.locator(".paper-action-step [data-side]").count(), 2);
assert.equal(await doubleCutPage.locator(".result-step .paper-cut-line").count(), forcedDoubleCut.segmentStages[1].length);
await doubleCutPage.screenshot({ path: `${output}/double-cut-second-touch-portrait.png`, fullPage: true });
await doubleCutPage.close();

const forcedSingleCut = levels[0].problems.find((item) => item.interaction === "piece-count" && item.folds.length === 1);
assert.ok(forcedSingleCut, "missing a single-fold cut problem");
const singleQueue = [forcedSingleCut.id, ...levels[0].problems.filter((item) => item.id !== forcedSingleCut.id).slice(0, 9).map((item) => item.id)];
const unfoldPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
unfoldPage.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
unfoldPage.on("pageerror", (error) => errors.push(error.message));
await unfoldPage.addInitScript(({ queue }) => {
  localStorage.setItem("gfield-audio-muted", "true");
  localStorage.setItem("gfield-language", "ko");
  localStorage.setItem("gfield-paper-fold-progress-v4", JSON.stringify({ level: 1, index: 0, queue }));
}, { queue: singleQueue });
await unfoldPage.goto(`${baseUrl}/geometry/games/paper-fold/`, { waitUntil: "networkidle" });
assert.equal(await unfoldPage.locator(".paper-action-step .paper-diagram").getAttribute("data-touch-action"), "unfold");
await clickPaperSide(unfoldPage, forcedSingleCut.unfoldSteps[0]);
assert.equal(await unfoldPage.locator(".paper-diagram.touch-correct[data-touch-action='unfold']").count(), 1);
await unfoldPage.waitForTimeout(170);
await unfoldPage.screenshot({ path: `${output}/unfold-touch-animation-portrait.png`, fullPage: true });
await unfoldPage.waitForTimeout(330);
assert.equal(await unfoldPage.locator(".result-step .paper-cut-line").count(), forcedSingleCut.unfoldedSegments.length);
assert.equal(await unfoldPage.locator("[data-choice]").count(), 3);
await unfoldPage.close();

const forcedDiagonalCut = levels[0].problems.find((item) => item.interaction === "piece-count" && item.folds.length === 1 && item.fold.axis.startsWith("diag"));
assert.ok(forcedDiagonalCut, "missing a diagonal one-fold cut problem");
const diagonalQueue = [forcedDiagonalCut.id, ...levels[0].problems.filter((item) => item.id !== forcedDiagonalCut.id).slice(0, 9).map((item) => item.id)];
const diagonalPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
diagonalPage.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
diagonalPage.on("pageerror", (error) => errors.push(error.message));
await diagonalPage.addInitScript(({ queue }) => {
  localStorage.setItem("gfield-audio-muted", "true");
  localStorage.setItem("gfield-language", "ko");
  localStorage.setItem("gfield-paper-fold-progress-v4", JSON.stringify({ level: 1, index: 0, queue }));
}, { queue: diagonalQueue });
await diagonalPage.goto(`${baseUrl}/geometry/games/paper-fold/`, { waitUntil: "networkidle" });
assert.equal((await currentProblem(diagonalPage)).id, forcedDiagonalCut.id);
assert.equal(await diagonalPage.locator(".fold-sequence-view figure:nth-of-type(2) .paper-top-face").getAttribute("points").then((value) => value.trim().split(/\s+/).length), 3);
assert.ok(await diagonalPage.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth) <= 1);
await diagonalPage.screenshot({ path: `${output}/diagonal-cut-touch-portrait.png`, fullPage: true });
await clickPaperSide(diagonalPage, forcedDiagonalCut.unfoldSteps[0]);
await diagonalPage.waitForTimeout(500);
assert.equal(await diagonalPage.locator("[data-choice]").count(), 3);
await diagonalPage.close();

for (const { interaction, foldCount, markSelector, initialCount } of [
  { interaction: "region-unfold", foldCount: 1, markSelector: ".paper-cut-region", initialCount: 1 },
  { interaction: "region-unfold", foldCount: 2, markSelector: ".paper-cut-region", initialCount: 1 },
  { interaction: "mixed-hole-result", foldCount: 2, markSelector: ".paper-shape-hole", initialCount: 2 }
]) {
  const levelIndex = interaction === "region-unfold" ? 0 : 1;
  const markedProblem = levels[levelIndex].problems.find((item) => item.interaction === interaction && item.folds.length === foldCount);
  assert.ok(markedProblem, `missing ${interaction} ${foldCount}-fold problem`);
  const queue = [markedProblem.id, ...levels[levelIndex].problems.filter((item) => item.id !== markedProblem.id).slice(0, 9).map((item) => item.id)];
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(({ level, queue: savedQueue }) => {
    localStorage.setItem("gfield-audio-muted", "true");
    localStorage.setItem("gfield-language", "ko");
    localStorage.setItem("gfield-paper-fold-progress-v4", JSON.stringify({ level, index: 0, queue: savedQueue }));
  }, { level: levelIndex + 1, queue });
  await page.goto(`${baseUrl}/geometry/games/paper-fold/`, { waitUntil: "networkidle" });
  assert.match(await page.locator("#foldStatus").textContent(), foldCount === 2 ? /두 번/ : /한 번/);
  assert.equal(await page.locator(`.result-step ${markSelector}`).count(), initialCount);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth) <= 1);
  await page.screenshot({ path: `${output}/${interaction}-${foldCount}-initial-portrait.png`, fullPage: true });
  for (const [stepIndex, step] of markedProblem.unfoldSteps.entries()) {
    await clickPaperSide(page, step);
    await page.waitForTimeout(500);
    const expected = initialCount * (2 ** (stepIndex + 1));
    assert.equal(await page.locator(`.result-step ${markSelector}`).count(), expected, `${markedProblem.id} stage ${stepIndex + 1}`);
  }
  assert.equal(await page.locator("[data-choice]").count(), 0);
  await page.locator("#nextButton:not([hidden])").waitFor();
  const bubbleBox = await page.locator("#guideBubble").boundingBox();
  const toolsBox = await page.locator(".tool-panel").boundingBox();
  assert.ok(bubbleBox.y + bubbleBox.height <= toolsBox.y - 4, `${markedProblem.id} guide overlaps the controls`);
  await page.screenshot({ path: `${output}/${interaction}-${foldCount}-result-portrait.png`, fullPage: true });
  await page.close();
}

for (const [name, viewport] of [["portrait", { width: 390, height: 844 }], ["landscape", { width: 844, height: 390 }]]) {
  const page = await makePage(viewport);
  await page.goto(`${baseUrl}/geometry/games/paper-fold/?level=1`, { waitUntil: "networkidle" });
  let overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `${name} choice overflow: ${overflow}px`);
  await page.screenshot({ path: `${output}/direct-touch-${name}.png`, fullPage: true });
  await solveCurrent(page, name);
  await advance(page);
  assert.equal((await currentProblem(page)).interaction, "connect-match");
  overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `${name} connect overflow: ${overflow}px`);
  await page.screenshot({ path: `${output}/connect-${name}.png`, fullPage: true });
  await page.close();
}

const studio = await makePage({ width: 1280, height: 900 });
await studio.goto(`${baseUrl}/geometry/origami-studio/`, { waitUntil: "networkidle" });
assert.equal(await studio.locator("#foldLevelGrid .level-card").count(), 3);
assert.equal(await studio.locator("#foldLevelGrid .level-card strong").first().textContent(), "색종이 접어 자르기");
assert.equal(await studio.locator("#foldLevelGrid .level-card strong").nth(1).textContent(), "색종이 접어 구멍 뚫기");
assert.equal(await studio.locator("#foldLevelGrid .level-card strong").nth(2).textContent(), "색칠 부분 잘라 펼치기");
assert.match(await studio.locator("#foldLevelGrid .level-card").nth(2).getAttribute("href"), /modes=unfoldshape/);
assert.equal(await studio.locator("#applicationGrid .level-card").count(), 2);
assert.equal(await studio.locator("#applicationGrid .level-card strong").first().textContent(), "조각과 구멍 세기");
assert.equal(await studio.locator("#applicationGrid .level-card strong").nth(1).textContent(), "수가 쓰인 색종이 계산");
assert.equal(await studio.locator("#overlapGrid .level-card").count(), 1);
assert.equal(await studio.locator("#overlapGrid .level-card strong").first().textContent(), "겹친 색종이 순서");
assert.match(await studio.locator("#applicationGrid .level-card").first().getAttribute("href"), /modes=pieces,punch,hole2,hole3d/);
assert.match(await studio.locator("#applicationGrid .level-card").nth(1).getAttribute("href"), /modes=numcut,numsum,numdiag,numinv,foldtop/);
assert.match(await studio.locator("#overlapGrid .level-card").first().getAttribute("href"), /modes=stackfind,stackorder/);
assert.match(await studio.locator("[data-i18n='fiveEach']").first().textContent(), /10문제/);
await studio.screenshot({ path: `${output}/origami-studio-two-types.png`, fullPage: true });
await studio.close();

const studioMobile = await makePage({ width: 390, height: 844 });
await studioMobile.goto(`${baseUrl}/geometry/origami-studio/`, { waitUntil: "networkidle" });
assert.equal(await studioMobile.locator("#foldLevelGrid .level-card").count(), 3);
assert.equal(await studioMobile.locator("#applicationGrid .level-card").count(), 2);
assert.equal(await studioMobile.locator("#overlapGrid .level-card").count(), 1);
const studioOverflow = await studioMobile.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
assert.ok(studioOverflow <= 1, `studio mobile overflow: ${studioOverflow}px`);
await studioMobile.screenshot({ path: `${output}/origami-studio-mobile.png`, fullPage: true });
await studioMobile.close();

const worksheet = await makePage({ width: 1440, height: 1000 });
await worksheet.goto(`${baseUrl}/geometry/worksheet/paper-fold/?mode=game-l1&count=10`, { waitUntil: "networkidle" });
await worksheet.locator(".sheet-page").first().waitFor();
assert.equal(await worksheet.locator("#mode option[value^='game-l']").count(), 2);
assert.match(await worksheet.locator("#mode option[value='game-l1']").textContent(), /접어 자르기/);
assert.match(await worksheet.locator("#info").textContent(), /paper-cut/);
assert.ok(await worksheet.locator(".problem-card img").count() >= 10);
await worksheet.goto(`${baseUrl}/geometry/worksheet/paper-fold/?mode=game-l2&count=10`, { waitUntil: "networkidle" });
await worksheet.locator(".sheet-page").first().waitFor();
assert.match(await worksheet.locator("#info").textContent(), /paper-(double-hole|mixed-hole|holes)/);
await worksheet.screenshot({ path: `${output}/worksheet-double-fold-preview.png`, fullPage: false });
await worksheet.emulateMedia({ media: "print" });
const worksheetPdf = `${output}/worksheet-double-fold-a4.pdf`;
await worksheet.pdf({ path: worksheetPdf, format: "A4", printBackground: true, preferCSSPageSize: true });
assert.ok((await stat(worksheetPdf)).size > 10_000, "worksheet A4 PDF was not generated correctly");
await worksheet.setViewportSize({ width: 794, height: 1123 });
await worksheet.screenshot({ path: `${output}/worksheet-double-fold-a4.png`, fullPage: true });
await worksheet.emulateMedia({ media: "screen" });
await worksheet.goto(`${baseUrl}/geometry/worksheet/paper-fold/?modes=unfoldshape&count=10`, { waitUntil: "networkidle" });
await worksheet.locator(".sheet-page").first().waitFor();
assert.equal(await worksheet.locator("#modeButtons .mode-button[aria-pressed='true']").count(), 1);
assert.match(await worksheet.locator("#modeButtons .mode-button[aria-pressed='true']").textContent(), /펼친 모양/);
assert.ok(await worksheet.locator(".problem-card img").count() >= 10);
await worksheet.screenshot({ path: `${output}/worksheet-colored-region-preview.png`, fullPage: false });
await worksheet.goto(`${baseUrl}/geometry/worksheet/paper-fold/?modes=numcut,numsum,numinv,foldtop&count=10`, { waitUntil: "networkidle" });
await worksheet.locator(".sheet-page").first().waitFor();
assert.equal(await worksheet.locator("#modeButtons .mode-button[aria-pressed='true']").count(), 4);
for (const label of ["잘려나간 수들의 합", "남은 수들의 합", "목표 합", "가장 위의 수"]){
  assert.match(await worksheet.locator("#modeButtons .mode-button[aria-pressed='true']").allTextContents().then((items)=>items.join(" ")), new RegExp(label));
}
await worksheet.goto(`${baseUrl}/geometry/worksheet/paper-fold/?modes=stackfind,stackorder&count=10`, { waitUntil: "networkidle" });
await worksheet.locator(".sheet-page").first().waitFor();
assert.equal(await worksheet.locator("#modeButtons .mode-button[aria-pressed='true']").count(), 2);
await worksheet.close();

assert.deepEqual(errors, []);
await browser.close();
console.log("Paper Fold browser check passed: reverse-order unfolding on the paper, aligned arrows, layer states, responsive layouts, and worksheet links verified.");
