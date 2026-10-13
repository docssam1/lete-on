/* 레벨 3 · 접는 방법 거꾸로 찾기를 함께하기·배틀(play.html)에서 끝까지 푸는 브라우저 검사.

   실행: 저장소 뿌리에서 정적 서버를 띄운 뒤
     GFIELD_BASE_URL=http://127.0.0.1:8811 PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs \
       node geometry/games/paper-fold/reverse-play.browsercheck.mjs

   확인하는 것
   - 유형 선택에 레벨 3이 있고, ?level=3 주소가 레벨 3으로 열린다(전에는 1로 바뀌었다).
   - 함께하기 10문제, 2명·4명 배틀 각 10문제를 실제 클릭으로 끝까지 푼다.
     접는 선은 종이 위 정답 선을 직접 누르고(다른 선과 먼 점), 모두 고르기는 두 정답을 누른다.
   - 문제마다 각 틀 안에서 종이 그림과 보기, 풀이 뒤 접는 선이 가려지지 않는다.
     4명 배틀(1280x800·1024x768, 틀 하나 약 620x260·490x240)에서 종이 짧은 변과 보기 크기를 잰다.
   - 가로 태블릿(1024x768)에서도 배틀 틀이 화면 안에 두 열로 놓인다(세로로 쌓이지 않는다).
   - 배틀에서 한 사람이 틀리면 점수(정답 3점, 틀릴 때마다 1점 깎이고 최소 1점)가 줄고
     순위표에 오답 수가 맞게 나온다. 페이지 오류가 없다. */

import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { levels } from "./levels.js";

const base = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8768").replace(/\/$/, "");
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : "playwright");
const byId = new Map(levels[2].problems.map((problem) => [problem.id, problem]));
const PAPER_MIN_PX = 100;
const CHOICE_MIN_PX = 90;

const browser = await chromium.launch({ headless: true });
const sizes = { paper: [], choice: [] };

/* 틀 안 그림 검사: 종이 가운데·꼭짓점 안쪽과 보여 준 접는 선 위의 점이 그 그림에 닿는지,
   보기가 틀 안에 다 보이는지. */
async function frameView(frame) {
  return frame.evaluate(() => {
    const svg = document.querySelector(".fold-start .reverse-diagram");
    const paper = svg.querySelector(".paper-fill");
    const matrix = svg.getScreenCTM();
    const corners = [...paper.points].map((point) => new DOMPoint(point.x, point.y).matrixTransform(matrix));
    const center = { x: corners.reduce((sum, item) => sum + item.x, 0) / corners.length, y: corners.reduce((sum, item) => sum + item.y, 0) / corners.length };
    const probes = [center, ...corners.map((item) => ({ x: item.x + (center.x - item.x) * 0.15, y: item.y + (center.y - item.y) * 0.15 }))];
    const creases = [...svg.querySelectorAll(".reverse-crease")].flatMap((line) => {
      const a = new DOMPoint(line.x1.baseVal.value, line.y1.baseVal.value).matrixTransform(matrix);
      const b = new DOMPoint(line.x2.baseVal.value, line.y2.baseVal.value).matrixTransform(matrix);
      return [0.25, 0.5, 0.75].map((ratio) => ({ x: a.x + (b.x - a.x) * ratio, y: a.y + (b.y - a.y) * ratio }));
    });
    const covered = (point) => { const hit = document.elementFromPoint(point.x, point.y); return !hit || !svg.contains(hit); };
    const box = paper.getBoundingClientRect();
    const choices = [...document.querySelectorAll(".reverse-choice")].map((button) => {
      const rect = button.getBoundingClientRect();
      const picture = button.querySelector(".reverse-diagram").getBoundingClientRect();
      return { inside: rect.top >= -1 && rect.left >= -1 && rect.bottom <= innerHeight + 1 && rect.right <= innerWidth + 1, side: Math.min(picture.width, picture.height) };
    });
    return { side: Math.min(box.width, box.height), coveredPaper: probes.filter(covered).length, coveredCrease: creases.filter(covered).length, creases: creases.length, choices, frame: `${innerWidth}x${innerHeight}` };
  });
}

function checkView(view, where, { minimum = true } = {}) {
  assert.equal(view.coveredPaper, 0, `${where}: paper covered at ${view.coveredPaper} points (${view.frame})`);
  assert.equal(view.coveredCrease, 0, `${where}: ${view.coveredCrease} of ${view.creases} crease points covered (${view.frame})`);
  assert.ok(view.choices.every((choice) => choice.inside), `${where}: a shape choice is outside the frame (${view.frame})`);
  if (!minimum) return;
  assert.ok(view.side >= PAPER_MIN_PX, `${where}: paper short side ${Math.round(view.side)}px (${view.frame})`);
  for (const choice of view.choices) assert.ok(choice.side >= CHOICE_MIN_PX, `${where}: shape choice ${Math.round(choice.side)}px (${view.frame})`);
  sizes.paper.push(Math.round(view.side));
  sizes.choice.push(...view.choices.map((choice) => Math.round(choice.side)));
}

/* 정답 선 위에서 다른 후보 선과 가장 먼 점을 그림 기준 좌표로 돌려준다. */
async function creasePoint(frame, problem, key) {
  return frame.locator(".fold-start .reverse-diagram").evaluate((svg, { choices, key }) => {
    const matrix = svg.getScreenCTM();
    const rect = svg.getBoundingClientRect();
    const toScreen = (u) => new DOMPoint(20 + u.x * 160, 20 + u.y * 160).matrixTransform(matrix);
    const target = choices.find((choice) => choice.key === key);
    const others = choices.filter((choice) => choice.key !== key);
    const dist = (p, [a, b]) => {
      const dx = b.x - a.x; const dy = b.y - a.y;
      const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy)));
      return Math.hypot(p.x - a.x - dx * t, p.y - a.y - dy * t);
    };
    let best = null;
    for (let step = 2; step <= 18; step += 1) {
      const ratio = step / 20;
      const [a, b] = target.chord;
      const point = { x: a.x + (b.x - a.x) * ratio, y: a.y + (b.y - a.y) * ratio };
      const gap = Math.min(...others.map((choice) => dist(point, choice.chord)));
      const screen = toScreen(point);
      const hit = document.elementFromPoint(screen.x, screen.y);
      if (!hit || !svg.contains(hit)) continue;
      if (!best || gap > best.gap) best = { gap, x: screen.x - rect.left, y: screen.y - rect.top };
    }
    return best;
  }, { choices: problem.lineChoices.map((choice) => ({ key: choice.key, chord: choice.chord })), key });
}

async function solveIn(frame, where, { wrongFirst = false } = {}) {
  const id = await frame.locator("#paper").getAttribute("data-problem-id");
  const problem = byId.get(id);
  assert.ok(problem, `${where}: ${id} is not a level 3 problem`);
  if (problem.interaction === "fold-line-pick") {
    if (wrongFirst) {
      const wrong = problem.lineChoices.find((choice) => !choice.correct).key;
      const spot = await creasePoint(frame, problem, wrong);
      await frame.locator(".fold-start .reverse-diagram").click({ position: spot });
      await frame.waitForTimeout(560);
    }
    const spot = await creasePoint(frame, problem, problem.answerKey);
    assert.ok(spot && spot.gap > 0.04, `${where}: no clear point on the answer crease`);
    await frame.locator(".fold-start .reverse-diagram").click({ position: spot });
  } else {
    if (wrongFirst) {
      await frame.locator(`[data-shape="${problem.resultOptions.find((option) => !option.correct).key}"]`).click();
      await frame.waitForTimeout(600);
    }
    for (const key of problem.answerKeys) {
      await frame.locator(`[data-shape="${key}"]`).click();
      await frame.waitForTimeout(200);
    }
  }
  await frame.waitForFunction(() => document.querySelector("#paper")?.classList.contains("is-solved"), null, { timeout: 4000 });
  await frame.waitForTimeout(150);
  return problem;
}

async function openRound(viewport, query) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto(`${base}/geometry/games/paper-fold/play.html?${query}`, { waitUntil: "load" });
  assert.equal(await page.locator("#levelSelect").inputValue(), "3", `${query}: the level 3 address must open level 3`);
  assert.equal(await page.locator('#levelSelect option[value="3"]').count(), 1);
  await page.locator(".pf-overlay button:visible").first().waitFor({ timeout: 20000 });
  await page.waitForFunction(() => [...document.querySelectorAll(".pf-overlay")].every((overlay) => overlay.hidden || !overlay.querySelector("button").hidden), null, { timeout: 20000 });
  for (const frame of page.frames().filter((item) => item.url().includes("embedded=1"))) {
    assert.match(frame.url(), /[?&]level=3(&|$)/, "every frame must load level 3");
  }
  await page.locator(".pf-overlay button:visible").first().click();
  await page.waitForTimeout(300);
  return { page, errors };
}

const frameFor = (page, player) => page.frames().find((frame) => frame.url().includes("embedded=1") && new URL(frame.url()).searchParams.get("player") === player);

try {
  /* 함께하기: 한 틀을 A·B가 번갈아 푼다. */
  {
    const { page, errors } = await openRound({ width: 1280, height: 800 }, "mode=together&level=3&count=10&seed=l3-together");
    const frame = frameFor(page, "A");
    const seen = new Set();
    for (let index = 0; index < 10; index += 1) {
      const where = `together #${index + 1}`;
      checkView(await frameView(frame), `${where} before`, { minimum: false });
      const problem = await solveIn(frame, where);
      seen.add(problem.id);
      checkView(await frameView(frame), `${where} solved`, { minimum: false });
      await page.locator(".pf-overlay button:visible").click();
      await page.waitForTimeout(250);
    }
    await page.locator("#finishBanner:not([hidden])").waitFor({ timeout: 8000 });
    assert.equal(seen.size, 10, "together: ten different problems");
    assert.equal(await page.locator("#sharedCount").innerText(), "10 / 10");
    assert.deepEqual(errors, [], "together: page errors");
    await page.close();
  }

  /* 배틀: 같은 문제 묶음을 사람마다 다른 순서로. B는 문제마다 한 번 틀린다. */
  for (const [players, viewport] of [[2, { width: 1024, height: 768 }], [4, { width: 1280, height: 800 }], [4, { width: 1024, height: 768 }]]) {
    const { page, errors } = await openRound(viewport, `mode=battle&players=${players}&level=3&count=10&seed=l3-battle`);
    /* 가로 태블릿에서도 모든 틀이 한 화면 안에 나란히(3~4명은 2x2) 있어야 동시에 풀 수 있다.
       전에는 1100px 미만에서 틀이 세로로 쌓였다. */
    const frameBoxes = await page.locator("iframe").evaluateAll((nodes) => nodes.map((node) => { const box = node.getBoundingClientRect(); return { x: Math.round(box.x), y: Math.round(box.y), bottom: Math.round(box.bottom), right: Math.round(box.right) }; }));
    assert.ok(frameBoxes.every((box) => box.bottom <= viewport.height + 1 && box.right <= viewport.width + 1), `battle ${players} at ${viewport.width}x${viewport.height}: a frame is off screen ${JSON.stringify(frameBoxes)}`);
    assert.equal(new Set(frameBoxes.map((box) => box.x)).size, 2, `battle ${players} at ${viewport.width}x${viewport.height}: frames must sit in two columns`);
    const ids = ["A", "B", "C", "D"].slice(0, players);
    const sets = Object.fromEntries(ids.map((id) => [id, new Set()]));
    for (let index = 0; index < 10; index += 1) {
      for (const player of ids) {
        const frame = frameFor(page, player);
        const where = `battle ${players} ${viewport.width} ${player} #${index + 1}`;
        checkView(await frameView(frame), `${where} before`, { minimum: players === 4 });
        const problem = await solveIn(frame, where, { wrongFirst: player === "B" });
        sets[player].add(problem.id);
        checkView(await frameView(frame), `${where} solved`, { minimum: players === 4 });
        await page.locator(`.pf-game[data-player="${player}"] .pf-game-actions button:visible`).click();
        await page.waitForTimeout(200);
      }
    }
    await page.locator("#finishBanner:not([hidden])").waitFor({ timeout: 8000 });
    const firstQueue = [...sets.A].join(",");
    for (const player of ids) {
      assert.equal(sets[player].size, 10, `battle ${players}: ${player} solved ten different problems`);
      assert.deepEqual([...sets[player]].sort(), [...sets.A].sort(), `battle ${players}: ${player} gets the same problem set`);
    }
    assert.notEqual([...sets.B].join(","), firstQueue, `battle ${players}: B plays the set in another order`);
    const rows = await page.locator(".pf-results-table tbody tr").evaluateAll((items) => items.map((row) => ({ player: row.dataset.player, cells: [...row.children].map((cell) => cell.textContent) })));
    const rowFor = (player) => rows.find((row) => row.player === player).cells;
    assert.equal(rowFor("A")[2], "30", `battle ${players}: A scores 3 points per problem`);
    assert.equal(rowFor("B")[2], "20", `battle ${players}: one mistake per problem costs one point each`);
    assert.equal(rowFor("B")[4], "10", `battle ${players}: B's mistakes are counted`);
    assert.equal(rows.at(-1).player, "B", `battle ${players}: B is ranked last`);
    assert.deepEqual(errors, [], `battle ${players}: page errors`);
    await page.close();
  }
} finally {
  await browser.close();
}

console.log([
  "Reverse fold play check passed: level 3 in the type list and in level=3 addresses,",
  "together 10 problems (1280x800), 2-player battle (1024x768) and 4-player battle (1280x800, 1024x768; frames side by side on screen) solved by real taps on the paper,",
  "same set in a different order per player, accuracy points 30/20 with 10 mistakes counted, paper and shown creases never covered,",
  `4-player frames: paper short side ${Math.min(...sizes.paper)}-${Math.max(...sizes.paper)}px (min ${PAPER_MIN_PX}), shape choices ${Math.min(...sizes.choice)}-${Math.max(...sizes.choice)}px (min ${CHOICE_MIN_PX}).`
].join(" "));
