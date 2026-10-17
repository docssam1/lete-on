// Browser check for 단서로 모양 찾기 (find-shape).
//
// Run from the repository root with a static server, for example:
//   python3 -m http.server 8811 --bind 127.0.0.1
//   GFIELD_BASE_URL=http://127.0.0.1:8811 PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs \
//     node geometry/games/find-shape/find-shape.browsercheck.mjs
//
// What it proves, for all 30 problems (both pool rounds of levels 3-5) at a
// PC, a tablet and three landscape phone sizes:
//   - every choice is a drawn 3D picture (not blank) with exactly as many cubes
//     as the option's heights add up to;
//   - alpha > 40 pixel bounds are measured in CSS pixels, separately from the
//     canvas/card size; every option has the same card and canvas dimensions;
//   - all cards, clues and primary controls stay in the viewport and can be
//     reached; the pictures are not covered by the control rail or mascot;
//   - the right view on screen is the one a child reads from the picture: the
//     front row on the left. This is recomputed here from the target grid,
//     without the game's clue code;
//   - only the answer matches all three clues under that reading;
//   - a wrong choice is rejected and the correct one is accepted;
//   - the camera draws the front lower left and the right side lower right;
//   - after a wrong try, the clue that does not match glows;
//   - with three.js blocked, the flat SVG pictures are used and the game works;
//   - no page error and no horizontal overflow.
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : "playwright");
const base = process.env.GFIELD_BASE_URL || "http://127.0.0.1:8811";
const here = dirname(fileURLToPath(import.meta.url));

// Load the same problem pools in Node with the same pool cursor the page uses.
const store = {};
globalThis.localStorage = { getItem: (key) => store[key] ?? null, setItem: (key, value) => { store[key] = String(value); } };
globalThis.window = { location: { search: "" } };
globalThis.location = globalThis.window.location;
async function sessionFor(round) {
  for (const level of [3, 4, 5]) store[`gfield-pool-find-shape-${level}`] = String(round);
  const module = await import(`${pathToFileURL(resolve(here, "levels.js")).href}?round=${round}`);
  return module.levels;
}

// Independent clue reading of a heights grid (grid[z][x], front = largest z).
function readClues(grid) {
  const depth = grid.length;
  const width = grid[0].length;
  const tallest = Math.max(...grid.flat());
  const layers = Array.from({ length: tallest }, (_, level) => grid.flat().filter((height) => height > level).length);
  const front = Array.from({ length: width }, (_, x) => Math.max(...grid.map((row) => row[x])));
  const rightFromRight = [];
  for (let z = depth - 1; z >= 0; z -= 1) rightFromRight.push(Math.max(...grid[z]));
  return { layers: layers.join(","), front: front.join(","), right: rightFromRight.join(",") };
}

const viewports = [
  { name: "pc", width: 1280, height: 800, touch: false },
  { name: "tablet", width: 1024, height: 768, touch: true },
  { name: "landscape-phone-small", width: 667, height: 375, touch: true },
  { name: "landscape-phone", width: 844, height: 390, touch: true },
  { name: "landscape-phone-wide", width: 896, height: 414, touch: true }
];

// These are real painted bounds, not a percentage of a mostly empty canvas.
const pictureRanges = new Map();
const phonePictureMinimums = {
  "landscape-phone-small": { width: 120, height: 80 },
  "landscape-phone": { width: 155, height: 100 },
  "landscape-phone-wide": { width: 165, height: 108 }
};
async function inspectPictures(page) {
  return page.evaluate(() => {
    const rectOf = (node) => {
      const rect = node.getBoundingClientRect();
      return { x: rect.x, y: rect.y, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height };
    };
    const inside = (rect) => rect.width > 0 && rect.height > 0 && rect.x >= -1 && rect.y >= -1 && rect.right <= innerWidth + 1 && rect.bottom <= innerHeight + 1;
    const overlaps = (a, b) => a.x < b.right && a.right > b.x && a.y < b.bottom && a.bottom > b.y;
    const reachable = (node) => {
      const rect = rectOf(node);
      return [[0.5, 0.5], [0.15, 0.15], [0.85, 0.15], [0.15, 0.85], [0.85, 0.85]].every(([x, y]) => {
        const hit = document.elementFromPoint(rect.x + rect.width * x, rect.y + rect.height * y);
        return hit && node.contains(hit);
      });
    };
    const visibleRect = (selector) => {
      const node = document.querySelector(selector);
      if (!node) return null;
      const style = getComputedStyle(node);
      return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0 ? rectOf(node) : null;
    };
    const mascot = visibleRect(".docssam .cubi-sprite");
    const obstacles = [visibleRect(".action-bar"), mascot].filter(Boolean);
    const pictures = [...document.querySelectorAll(".shape-choice")].map((button) => {
      const canvas = button.querySelector("canvas");
      const card = rectOf(button);
      if (!canvas) return { card, inside: inside(card), reachable: reachable(button) };
      const canvasBox = rectOf(canvas);
      const data = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
      let painted = 0;
      let minX = canvas.width, minY = canvas.height, maxX = -1, maxY = -1;
      for (let y = 0; y < canvas.height; y += 1) {
        for (let x = 0; x < canvas.width; x += 1) {
          if (data[(y * canvas.width + x) * 4 + 3] <= 40) continue;
          painted += 1;
          minX = Math.min(minX, x); minY = Math.min(minY, y);
          maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
        }
      }
      const scaleX = canvasBox.width / canvas.width, scaleY = canvasBox.height / canvas.height;
      const drawn = painted ? {
        x: canvasBox.x + minX * scaleX, y: canvasBox.y + minY * scaleY,
        right: canvasBox.x + (maxX + 1) * scaleX, bottom: canvasBox.y + (maxY + 1) * scaleY,
        width: (maxX - minX + 1) * scaleX, height: (maxY - minY + 1) * scaleY
      } : null;
      return {
        card, canvas: canvasBox, drawn, painted: painted / (canvas.width * canvas.height),
        inside: inside(card) && inside(canvasBox) && Boolean(drawn && inside(drawn)),
        reachable: reachable(button),
        touchesCanvasEdge: painted > 0 && (minX === 0 || minY === 0 || maxX === canvas.width - 1 || maxY === canvas.height - 1),
        coveredByDecoration: Boolean(drawn && obstacles.some((obstacle) => overlaps(drawn, obstacle)))
      };
    });
    const controls = ["#layerClue", "#frontView", "#rightView", "#clearChoice", "#checkChoice", "#next"].map((selector) => {
      const node = document.querySelector(selector);
      const rect = rectOf(node);
      return {
        selector, inside: inside(rect), reachable: reachable(node),
        coveredByMascot: ["#clearChoice", "#checkChoice"].includes(selector) && Boolean(mascot && overlaps(rect, mascot))
      };
    });
    return {
      pictures, controls, scrollX, scrollY,
      overflowX: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
      overflowY: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - innerHeight
    };
  });
}

function checkPictures(view, where, { three = false, viewport, record = true, flat = false } = {}) {
  assert.equal(view.scrollX, 0, `${where}: horizontal scroll`);
  assert.equal(view.scrollY, 0, `${where}: vertical scroll`);
  assert.ok(view.overflowX <= 1 && view.overflowY <= 1, `${where}: document overflow ${view.overflowX}x${view.overflowY}px`);
  for (const control of view.controls) {
    assert.ok(control.inside && control.reachable, `${where}: ${control.selector} is clipped or covered`);
    assert.equal(control.coveredByMascot, false, `${where}: ${control.selector} overlaps the mascot despite pointer-events:none`);
  }
  const first = view.pictures[0];
  view.pictures.forEach((picture, index) => {
    assert.ok(picture.inside && picture.reachable, `${where}: option ${index + 1} is clipped or covered`);
    assert.ok(picture.card.width >= 90 && picture.card.height >= 90, `${where}: option ${index + 1} is too small to tap (${picture.card.width}x${picture.card.height})`);
    assert.ok(Math.abs(picture.card.width - first.card.width) <= 1 && Math.abs(picture.card.height - first.card.height) <= 1, `${where}: unequal card sizes`);
    if (flat) return;
    assert.ok(picture.painted > 0.08, `${where}: option ${index + 1} picture is blank (${picture.painted.toFixed(3)})`);
    assert.ok(picture.drawn.width > 0 && picture.drawn.height > 0, `${where}: missing painted bounds`);
    assert.equal(picture.touchesCanvasEdge, false, `${where}: option ${index + 1} painting touches the canvas edge`);
    assert.equal(picture.coveredByDecoration, false, `${where}: option ${index + 1} picture overlaps the rail or mascot`);
    assert.ok(Math.abs(picture.canvas.width - first.canvas.width) <= 1 && Math.abs(picture.canvas.height - first.canvas.height) <= 1, `${where}: unequal canvas sizes change the shared camera scale`);
    if (three && phonePictureMinimums[viewport.name]) {
      const minimum = phonePictureMinimums[viewport.name];
      assert.ok(picture.drawn.width >= minimum.width && picture.drawn.height >= minimum.height, `${where}: option ${index + 1} painted bounds ${picture.drawn.width.toFixed(2)}x${picture.drawn.height.toFixed(2)}px are below ${minimum.width}x${minimum.height}px`);
    }
    if (three && record) {
      const range = pictureRanges.get(viewport.name) || { width: [], height: [] };
      range.width.push(picture.drawn.width); range.height.push(picture.drawn.height);
      pictureRanges.set(viewport.name, range);
    }
  });
  if (three && viewport.height <= 560) {
    const [a, b, c] = view.pictures.map((picture) => picture.card);
    assert.ok(Math.abs(a.y - b.y) <= 1 && b.x > a.right && c.y > a.bottom, `${where}: three choices must use two rows`);
    assert.ok(Math.abs(c.x + c.width / 2 - (a.x + b.right) / 2) <= 1, `${where}: third choice must be centered at the same size`);
  }
}

const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
let problemsChecked = 0;
const seen = new Set();
try {
  for (const viewport of viewports) {
    for (const round of [0, 1]) {
      const levels = await sessionFor(round);
      for (let levelIndex = 0; levelIndex < levels.length; levelIndex += 1) {
        const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, hasTouch: viewport.touch, deviceScaleFactor: 1 });
        await context.addInitScript(({ round, levelIndex }) => {
          localStorage.setItem("gfield-find-shape-tutorial-v1", "done");
          for (const level of [3, 4, 5]) localStorage.setItem(`gfield-pool-find-shape-${level}`, String(round));
          localStorage.setItem("find-shape-level", String(levelIndex));
        }, { round, levelIndex });
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(`${base}/geometry/games/find-shape/`, { waitUntil: "networkidle" });
        const closeLevels = page.locator("#closeLevels:visible");
        if (await closeLevels.count()) await closeLevels.click();

        for (const [problemIndex, problem] of levels[levelIndex].problems.entries()) {
          const where = `${viewport.name} ${problem.id}`;
          await page.waitForFunction((count) => (document.querySelector("#choiceGrid")?.dataset.drawnCubes || "").split(",").filter(Boolean).length === count, problem.options.length, { timeout: 8000 }).catch(async (error) => { throw new Error(`${where}: pictures not drawn; page shows ${await page.locator("#progress").textContent()}, drawn=${await page.locator("#choiceGrid").getAttribute("data-drawn-cubes")}, options=${await page.locator(".shape-choice").count()}`); });
          assert.equal(await page.locator("#choiceGrid").getAttribute("data-render"), "3d", `${where}: choices must be 3D pictures`);

          const drawn = (await page.locator("#choiceGrid").getAttribute("data-drawn-cubes")).split(",").map(Number);
          const expected = problem.options.map((grid) => grid.flat().reduce((sum, height) => sum + height, 0));
          assert.deepEqual(drawn, expected, `${where}: cubes drawn per option`);

          checkPictures(await inspectPictures(page), where, { three: problem.options.length === 3, viewport });

          // Rotating back must resize and redraw the same problem, rather
          // than leave portrait-sized or blank canvases in the new cards.
          if (viewport.name === "landscape-phone" && round === 0 && levelIndex === 0 && problemIndex === 0) {
            const beforeSize = await page.locator(".shape-canvas").first().evaluate((canvas) => ({ width: canvas.width, height: canvas.height }));
            await page.setViewportSize({ width: viewport.height, height: viewport.width });
            await page.locator(".portrait-guard:visible").waitFor();
            await page.waitForFunction((before) => {
              const canvas = document.querySelector(".shape-canvas");
              return canvas.width !== before.width || canvas.height !== before.height;
            }, beforeSize);
            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            await page.waitForFunction(() => [...document.querySelectorAll(".shape-canvas")].every((canvas) => {
              const box = canvas.getBoundingClientRect();
              return box.width > 0 && box.height > 0 && Math.abs(canvas.width - box.width) <= 1 && Math.abs(canvas.height - box.height) <= 1;
            }));
            checkPictures(await inspectPictures(page), `${where} after rotation`, { three: true, viewport, record: false });
          }

          // The camera must put the front edge of the tray lower left and the
          // right edge lower right, both nearer the viewer than the back/left.
          const view = JSON.parse(await page.locator("#choiceGrid").getAttribute("data-orientation"));
          assert.ok(view.front.x < 0.5 && view.right.x > 0.5, `${where}: front must be drawn on the left, right side on the right`);
          assert.ok(view.front.y > view.back.y && view.right.y > view.left.y, `${where}: front and right edges must be the near (lower) edges`);

          // The right view on screen, read column by column (left to right).
          const shownRight = await page.evaluate(() => {
            const grid = document.querySelector("#rightView");
            const cols = Number(grid.style.getPropertyValue("--cols"));
            const rows = Number(grid.style.getPropertyValue("--rows"));
            const cells = [...grid.children];
            return Array.from({ length: cols }, (_, col) => {
              let height = 0;
              for (let row = 0; row < rows; row += 1) if (cells[row * cols + col].classList.contains("filled")) height = Math.max(height, rows - row);
              return height;
            }).join(",");
          });
          const target = readClues(problem.target);
          assert.equal(shownRight, target.right, `${where}: right view must show the front row on the left`);
          const matching = problem.options.map(readClues).map((clues, index) => (clues.layers === target.layers && clues.front === target.front && clues.right === target.right ? index : -1)).filter((index) => index >= 0);
          assert.deepEqual(matching, [problem.answer], `${where}: exactly the answer must match all clues`);

          const wrong = problem.options.findIndex((_, index) => index !== problem.answer);
          await page.locator(".shape-choice").nth(wrong).click();
          await page.locator("#checkChoice").click();
          assert.equal(await page.locator(".shape-choice.wrong").count(), 1, `${where}: a wrong choice is rejected`);
          assert.equal(await page.locator(".shape-choice.correct").count(), 0, `${where}: no answer shown after a wrong try`);
          const wrongClues = readClues(problem.options[wrong]);
          const expectedHint = wrongClues.front !== target.front ? "hint-front" : wrongClues.right !== target.right ? "hint-right" : "hint-layer";
          assert.ok(await page.locator(`.clue-panel.${expectedHint}`).count() === 1, `${where}: the clue that does not match (${expectedHint}) must glow`);
          await page.locator(".shape-choice").nth(problem.answer).click();
          await page.locator("#checkChoice").click();
          await page.waitForSelector(".shape-choice.correct");
          assert.equal(await page.locator(".shape-choice:disabled").count(), problem.options.length, `${where}: choices lock after solving`);

          const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
          assert.ok(overflow <= 1, `${where}: horizontal overflow ${overflow}px`);
          problemsChecked += 1;
          seen.add(problem.id);
          if (problemIndex < levels[levelIndex].problems.length - 1) await page.locator("#next").click();
        }
        assert.deepEqual(errors, [], `${viewport.name} level ${levelIndex}: page errors`);
        await context.close();
      }
    }
  }

  // Fallback: with three.js unreachable the game must still show flat
  // pictures and be playable.
  for (const viewport of viewports) {
    const levels = await sessionFor(0);
    const problem = levels[0].problems[0];
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, hasTouch: viewport.touch });
    await context.addInitScript(() => {
      localStorage.setItem("gfield-find-shape-tutorial-v1", "done");
      localStorage.setItem("gfield-pool-find-shape-3", "0");
      localStorage.setItem("find-shape-level", "0");
    });
    await context.route("**/geometry/vendor/three/**", (route) => route.abort());
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}/geometry/games/find-shape/`, { waitUntil: "networkidle" });
    const closeLevels = page.locator("#closeLevels:visible");
    if (await closeLevels.count()) await closeLevels.click();
    await page.waitForSelector('#choiceGrid[data-render="svg"] .shape-choice svg');
    assert.equal(await page.locator(".shape-choice svg").count(), problem.options.length, "fallback: one flat picture per option");
    checkPictures(await inspectPictures(page), `fallback ${viewport.name}`, { three: true, viewport, flat: true });
    await page.locator(".shape-choice").nth(problem.answer).click();
    await page.locator("#checkChoice").click();
    await page.waitForSelector(".shape-choice.correct");
    assert.deepEqual(errors, [], "fallback: page errors");
    await context.close();
  }
} finally {
  await browser.close();
}
assert.equal(seen.size, 30, "all 30 pool problems must be visited");
const boundsSummary = Object.fromEntries([...pictureRanges].map(([name, range]) => [name, {
  width: [Math.min(...range.width), Math.max(...range.width)].map((value) => Number(value.toFixed(2))),
  height: [Math.min(...range.height), Math.max(...range.height)].map((value) => Number(value.toFixed(2)))
}]));
console.log(`find-shape browser check passed: ${seen.size} problems x ${viewports.length} viewports (${problemsChecked} solves), equal card/canvas dimensions, pictures and controls inside the viewport, no covered or clipped pictures, 3D pictures with the right cube counts, right view with the front on the left, one matching answer each, wrong-clue glow, rotation redraw, and the flat-picture fallback at every size.`);
console.log(`Level 3 painted bounds in CSS pixels (alpha > 40): ${JSON.stringify(boundsSummary)}`);
