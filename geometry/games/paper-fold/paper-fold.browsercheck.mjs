import assert from "node:assert/strict";
import { mkdir, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { levels } from "./levels.js";
import { seededRandom, sessionQueue } from "./session-order.js";

const base = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8768").replace(/\/$/, "");
const output = process.env.GFIELD_SCREENSHOT_DIR || join(tmpdir(), "gfield-paper-fold-learning-flow");
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : "playwright");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [];
const monitor = (page) => {
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
};
async function forcedPage(p, viewport = { width: 1440, height: 900 }, lang = "ko") {
  const page = await browser.newPage({ viewport });
  monitor(page);
  const rest = sessionQueue(levels[p.level - 1].problems, 9, new Set([p.id]), seededRandom("test"));
  await page.addInitScript(({ item, queue, locale }) => {
    localStorage.setItem("gfield-language", locale);
    localStorage.setItem("gfield-paper-fold-progress-v4", JSON.stringify({ level: item.level, index: 0, queue }));
  }, { item: p, queue: [p.id, ...rest.map((item) => item.id)], locale: lang });
  await page.goto(base + "/geometry/games/paper-fold/?seed=qa", { waitUntil: "networkidle" });
  assert.equal(await page.locator("#paper").getAttribute("data-problem-id"), p.id);
  await page.evaluate(() => document.fonts.ready);
  return page;
}
async function touch(page, side) {
  const zone = page.locator('.paper-action-step [data-side="' + side + '"]');
  const point = await zone.evaluate((node) => {
    const svg = node.ownerSVGElement;
    const paper = svg.querySelector(".paper-top-face");
    const box = node.getBBox();
    const inside = [];
    for (let row = 1; row < 12; row += 1) {
      for (let col = 1; col < 12; col += 1) {
        const p = new DOMPoint(box.x + box.width * col / 12, box.y + box.height * row / 12);
        if (node.isPointInFill(p) && paper.isPointInFill(p)) inside.push(p);
      }
    }
    if (!inside.length) throw new Error("No touchable paper face");
    const p = new DOMPoint(inside.reduce((sum, p) => sum + p.x, 0) / inside.length, inside.reduce((sum, p) => sum + p.y, 0) / inside.length);
    const screen = p.matrixTransform(svg.getScreenCTM());
    return { x: screen.x, y: screen.y };
  });
  await page.mouse.click(point.x, point.y);
  await page.waitForTimeout(460);
}
async function foldAll(page, p) {
  for (const fold of p.folds) {
    const aligned = await page.locator(".fold-start.paper-action-step .paper-diagram").evaluate((svg, fold) => {
      const arrow = svg.querySelector(".paper-fold-arrow");
      const start = arrow.getPointAtLength(0);
      const end = arrow.getPointAtLength(arrow.getTotalLength());
      return svg.querySelector('[data-side="' + fold.side + '"]').isPointInFill(start)
        && svg.querySelector('[data-side="' + fold.target + '"]').isPointInFill(end)
        && svg.querySelector(".paper-top-face").isPointInFill(start)
        && svg.querySelector(".paper-top-face").isPointInFill(end);
    }, fold);
    assert.ok(aligned, "fold arrow must connect its actual source and target faces");
    await touch(page, fold.side);
  }
  assert.equal(await page.locator(".result-step .paper-fold-arrow").count(), 0, "end diagram must not give an arrow hint");
  assert.equal(await page.locator("#paper .paper-fold-arrow").count(), p.folds.length);
  assert.equal(await page.locator("#paper [data-side]").count(), 2);
  assert.equal(await page.locator(".layer-badge").count(), 0);
  const stacks = await page.locator(".cut-step .paper-diagram").evaluate((svg) => ({
    depth: Number(svg.dataset.stackDepth), sides: svg.querySelectorAll(".paper-stack-side").length,
    layers: svg.querySelectorAll(".paper-stack-layer").length,
    viewBox: [svg.viewBox.baseVal.x, svg.viewBox.baseVal.y, svg.viewBox.baseVal.width, svg.viewBox.baseVal.height]
  }));
  assert.equal(stacks.depth, 2 ** p.folds.length - 1);
  assert.equal(stacks.layers, stacks.depth);
  assert.ok(stacks.sides >= stacks.depth);
  assert.deepEqual(stacks.viewBox, [-stacks.depth * 3.5, -stacks.depth * 3.5, 200 + stacks.depth * 7, 200 + stacks.depth * 7]);
}
async function sideAll(page, p) {
  for (const step of p.unfoldSteps) await touch(page, step.answer);
  assert.equal(await page.locator("[data-choice]").count(), 3, "final choice must not be skipped");
  if (p.resultChoices || p.interaction === "hole-result") assert.equal(await page.locator("[data-result-revealed]").count(), 0, "correct result leaked before answer");
}
async function solve(page, p) {
  if (p.interaction === "connect-match") {
    for (const pair of p.pairs) {
      await page.locator('[data-left="' + pair.key + '"]').click();
      await page.locator('[data-right="' + pair.key + '"]').click();
    }
  } else {
    await foldAll(page, p);
    await sideAll(page, p);
    await page.locator('[data-choice="' + (p.resultAnswer || p.answer) + '"]').click();
  }
  await page.waitForTimeout(700);
  assert.equal(await page.locator("#nextButton").getAttribute("hidden"), null);
}
async function layout(page, name) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), name + " horizontal overflow");
  const clipped = await page.locator("#interaction button, .tool-panel button:not([hidden]), .tool-panel a, .paper-action-step svg").evaluateAll((nodes) => nodes.filter((node) => {
    const box = node.getBoundingClientRect();
    return box.width > 0 && box.height > 0 && (box.x < -1 || box.y < -1 || box.right > innerWidth + 1 || box.bottom > innerHeight + 1);
  }).map((node) => node.className.baseVal || node.className));
  assert.deepEqual(clipped, [], name + " clipped controls");
  await page.screenshot({ path: output + "/" + name + ".png", fullPage: true });
}

try {
  const single = levels[0].problems.find((p) => p.id === "paper-one-fold-pattern-1-1");
  for (const [name, viewport] of [
    ["desktop", { width: 1440, height: 900 }],
    ["portrait", { width: 390, height: 844 }],
    ["landscape", { width: 844, height: 390 }]
  ]) {
    const page = await forcedPage(single, viewport);
    assert.equal(await page.locator(".fold-start.paper-action-step").count(), 1);
    assert.equal(await page.locator(".result-step .paper-diagram").count(), 0);
    await layout(page, name + "-fold");
    await touch(page, single.folds[0].target);
    assert.equal(await page.locator(".learning-sequence").getAttribute("data-learning-stage"), "fold");
    await foldAll(page, single);
    await layout(page, name + "-side");
    await touch(page, single.unfoldSteps[0].source);
    assert.equal(await page.locator(".learning-sequence").getAttribute("data-learning-stage"), "side");
    await sideAll(page, single);
    assert.equal(await page.locator(".result-step .paper-removed-region").count(), 1);
    await layout(page, name + "-choices");
    const wrong = single.resultChoices.find((c) => c.key !== single.resultAnswer).key;
    await page.locator('[data-choice="' + wrong + '"]').click();
    assert.equal(await page.locator("#nextButton").getAttribute("hidden"), "");
    await page.locator('[data-choice="' + single.resultAnswer + '"]').click();
    await page.waitForTimeout(700);
    assert.equal(await page.locator(".result-step .paper-removed-region").count(), 2);
    await layout(page, name + "-solved");
    await page.close();
  }
  const cases = [
    ...levels[0].problems.filter((p) => p.id.startsWith("paper-one-fold-pattern-") && p.id.endsWith("-1")).slice(1),
    levels[0].problems.find((p) => p.interaction === "region-unfold" && p.folds.length === 2),
    levels[0].problems.find((p) => p.interaction === "piece-count" && p.folds.length === 2),
    levels[0].problems.find((p) => p.interaction === "connect-match"),
    levels[1].problems.find((p) => p.interaction === "hole-count"),
    levels[1].problems.find((p) => p.interaction === "hole-result"),
    levels[1].problems.find((p) => p.interaction === "mixed-hole-result"),
    levels[1].problems.find((p) => p.interaction === "connect-match")
  ];
  for (const p of cases) {
    const page = await forcedPage(p, { width: 390, height: 844 });
    await solve(page, p);
    await layout(page, p.id);
    await page.close();
  }
  for (const lang of ["en", "zh", "ja"]) {
    const page = await forcedPage(single, { width: 390, height: 844 }, lang);
    await foldAll(page, single);
    await sideAll(page, single);
    assert.equal(await page.locator("html").getAttribute("lang"), lang);
    assert.doesNotMatch(await page.locator("#prompt").innerText(), /[가-힣]/);
    await layout(page, "locale-" + lang);
    await page.close();
  }
  const session = await forcedPage(single);
  for (let index = 0; index < 10; index += 1) {
    const id = await session.locator("#paper").getAttribute("data-problem-id");
    await solve(session, levels[0].problems.find((p) => p.id === id));
    await session.locator("#nextButton").click();
  }
  await session.locator("#completeDialog:not([hidden])").waitFor();
  await session.locator("#nextLevelButton").click();
  assert.equal(await session.locator("#problemLabel").innerText(), "11 / 20");
  const queue = await session.evaluate(() => JSON.parse(localStorage.getItem("gfield-paper-fold-progress-v4")).queue);
  assert.equal(new Set(queue).size, 20);
  await session.close();
  const historyPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  monitor(historyPage);
  await historyPage.goto(base + "/geometry/games/paper-fold/?level=2&seed=history", { waitUntil: "networkidle" });
  const firstQueue = sessionQueue(levels[1].problems, 10, new Set(), seededRandom("history-fixture")).map((p) => p.id);
  await historyPage.evaluate((queue) => localStorage.setItem("gfield-paper-fold-progress-v4", JSON.stringify({ level: 2, index: 9, queue })), firstQueue);
  await historyPage.goto(base + "/geometry/games/paper-fold/?seed=history", { waitUntil: "networkidle" });
  await solve(historyPage, levels[1].problems.find((p) => p.id === firstQueue[9]));
  await historyPage.locator("#nextButton").click();
  await historyPage.locator("#practiceButton").click();
  const fresh = await historyPage.evaluate(() => JSON.parse(localStorage.getItem("gfield-paper-fold-progress-v4")));
  assert.deepEqual(new Set(fresh.excludedIds), new Set(firstQueue));
  assert.ok(fresh.queue.every((id) => !firstQueue.includes(id)));
  await historyPage.evaluate((saved) => localStorage.setItem("gfield-paper-fold-progress-v4", JSON.stringify({ ...saved, index: 9 })), fresh);
  await historyPage.reload({ waitUntil: "networkidle" });
  await solve(historyPage, levels[1].problems.find((p) => p.id === fresh.queue[9]));
  await historyPage.locator("#nextButton").click();
  assert.equal(await historyPage.locator("#nextLevelButton").innerText(), "다른 유형");
  assert.equal(await historyPage.locator("#practiceButton").isVisible(), false);
  await historyPage.close();
  const modes = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  monitor(modes);
  await modes.goto(base + "/geometry/games/paper-fold/play.html?mode=together&seed=qa", { waitUntil: "networkidle" });
  await modes.screenshot({ path: output + "/together-ready.png", fullPage: true });
  await modes.goto(base + "/geometry/games/paper-fold/play.html?mode=battle&seed=qa", { waitUntil: "networkidle" });
  await modes.screenshot({ path: output + "/battle-ready.png", fullPage: true });
  const frames = modes.frames().filter((frame) => /index\.html/.test(frame.url()));
  assert.equal(frames.length, 2);
  const ids = await Promise.all(frames.map((frame) => frame.locator("#paper").getAttribute("data-problem-id")));
  assert.notEqual(ids[0], ids[1]);
  await modes.close();
  const worksheet = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  monitor(worksheet);
  for (const level of [1, 2]) {
    await worksheet.goto(base + "/geometry/worksheet/paper-fold/?mode=game-l" + level + "&count=10", { waitUntil: "networkidle" });
    await worksheet.locator(".sheet-page").first().waitFor();
    assert.ok(await worksheet.locator(".problem-card img").count() >= 10);
    await worksheet.screenshot({ path: output + "/worksheet-" + level + ".png", fullPage: false });
    await worksheet.emulateMedia({ media: "print" });
    const file = output + "/worksheet-" + level + "-a4.pdf";
    await worksheet.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
    assert.ok((await stat(file)).size > 10000);
    await worksheet.emulateMedia({ media: "screen" });
  }
  await worksheet.close();
  assert.deepEqual(errors, []);
  console.log("Paper Fold browser check passed: direct folds, side selection, hidden final answers, all axes, four locales, continuation, modes and A4 rendering.");
} finally {
  await browser.close();
}
