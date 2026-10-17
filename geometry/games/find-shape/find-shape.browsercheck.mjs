// Browser check for 단서로 모양 찾기 (find-shape).
//
// Run from the repository root with a static server, for example:
//   python3 -m http.server 8811 --bind 127.0.0.1
//   GFIELD_BASE_URL=http://127.0.0.1:8811 PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs \
//     node geometry/games/find-shape/find-shape.browsercheck.mjs
//
// What it proves, for all 30 problems (both pool rounds of levels 3-5) at a
// PC, a tablet and a landscape phone size:
//   - every choice is a drawn 3D picture (not blank) with exactly as many cubes
//     as the option's heights add up to;
//   - the right view on screen is the one a child reads from the picture: the
//     front row on the left. This is recomputed here from the target grid,
//     without the game's clue code;
//   - only the answer matches all three clues under that reading;
//   - a wrong choice is rejected and the correct one is accepted;
//   - the camera draws the front lower left and the right side lower right;
//   - every option card has the same size and is not tall and narrow (on a
//     landscape phone three cards in one row made the pictures small);
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
  { name: "landscape-phone", width: 844, height: 390, touch: true }
];

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

          const pictures = await page.evaluate(() => [...document.querySelectorAll(".shape-choice")].map((button) => {
            const canvas = button.querySelector("canvas");
            const box = button.getBoundingClientRect();
            const data = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
            let painted = 0;
            for (let index = 3; index < data.length; index += 4 * 7) if (data[index] > 40) painted += 1;
            return {
              painted: painted / (data.length / (4 * 7)),
              width: box.width, height: box.height
            };
          }));
          pictures.forEach((picture, index) => {
            assert.ok(picture.painted > 0.08, `${where}: option ${index + 1} picture is blank (${picture.painted.toFixed(3)})`);
            assert.ok(picture.width >= 90 && picture.height >= 90, `${where}: option ${index + 1} is too small to tap (${picture.width}x${picture.height})`);
            /* 받침 그림은 가로로 넓다. 칸이 세로로 길면(가로 폰에서 세 보기를 한 줄에 둘 때
               약 145x300) 그림이 폭에 맞춰 작아지고 위아래가 빈다. */
            assert.ok(picture.width / picture.height >= 0.9, `${where}: option ${index + 1} card is tall and narrow (${Math.round(picture.width)}x${Math.round(picture.height)}), the picture shrinks`);
            assert.ok(Math.abs(picture.width - pictures[0].width) < 2 && Math.abs(picture.height - pictures[0].height) < 2, `${where}: option ${index + 1} must be the same size as option 1`);
          });

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
  {
    const levels = await sessionFor(0);
    const problem = levels[0].problems[0];
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
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
console.log(`find-shape browser check passed: ${seen.size} problems x ${viewports.length} viewports (${problemsChecked} solves), 3D pictures with the right cube counts, right view with the front on the left, one matching answer each, wrong-clue glow, and the flat-picture fallback.`);
