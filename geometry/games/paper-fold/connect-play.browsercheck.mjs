/* 선 잇기(레벨 1·2)를 함께하기·배틀의 낮고 넓은 틀에서 푸는 브라우저 검사.

   실행: 저장소 뿌리에서 정적 서버를 띄운 뒤
     GFIELD_BASE_URL=http://127.0.0.1:8811 PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs \
       node geometry/games/paper-fold/connect-play.browsercheck.mjs

   4명 배틀 틀(1280x800에서 약 620x260, 1024x768에서 약 490x240)에서 선 잇기 그림이 세 줄
   두 칸이라 32~38px로 작았다. 이제 접어 자른 종이를 윗줄, 펼친 결과를 아랫줄에 놓는다.

   확인하는 것
   - 선 잇기 그림 짧은 변이 60px 이상이고, 여섯 장이 모두 틀 안에 보인다.
   - 접어 자른 종이는 윗줄 세 칸, 펼친 결과는 아랫줄 세 칸이다.
   - 실제 클릭으로 세 쌍을 이으면 풀린다. 선은 윗카드 아래 가운데에서 아랫카드 위 가운데로 긋는다.
   - 함께하기(844x390, 1280x800)는 틀이 높아 예전처럼 옆으로 잇고, 그대로 풀린다.
   - 페이지 오류가 없다. */

import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

const base = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8768").replace(/\/$/, "");
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : "playwright");
const PICTURE_MIN_PX = 60;
const browser = await chromium.launch({ headless: true });
const sizes = [];
let solved = 0;

async function openRound(viewport, query) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto(`${base}/geometry/games/paper-fold/play.html?${query}`, { waitUntil: "load" });
  await page.locator(".pf-overlay button:visible").first().waitFor({ timeout: 20000 });
  await page.waitForFunction(() => [...document.querySelectorAll(".pf-overlay")].every((overlay) => overlay.hidden || !overlay.querySelector("button").hidden), null, { timeout: 20000 });
  await page.locator(".pf-overlay button:visible").first().click();
  await page.waitForTimeout(500);
  return { page, errors };
}

async function solveConnect(frame, where) {
  const view = await frame.evaluate(() => {
    const box = (node) => { const r = node.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height }; };
    const cards = (side) => [...document.querySelectorAll(`[data-${side}]`)].map((node) => ({ key: node.dataset[side], ...box(node), picture: box(node.querySelector(".paper-diagram")) }));
    return { left: cards("left"), right: cards("right"), vw: innerWidth, vh: innerHeight };
  });
  /* 위아래 배치는 낮고 넓은 틀(가로이면서 높이 560px 이하)에서만 쓴다(polish.css). */
  const stacked = view.vw > view.vh && view.vh <= 560;
  const all = [...view.left, ...view.right];
  for (const card of all) {
    assert.ok(card.top >= -1 && card.left >= -1 && card.bottom <= view.vh + 1 && card.right <= view.vw + 1, `${where}: a card is outside the frame (${view.vw}x${view.vh})`);
    const side = Math.min(card.picture.width, card.picture.height);
    assert.ok(side >= PICTURE_MIN_PX, `${where}: a matching picture is ${Math.round(side)}px (min ${PICTURE_MIN_PX}, frame ${view.vw}x${view.vh})`);
    sizes.push(Math.round(side));
  }
  if (stacked) {
    assert.equal(new Set(view.left.map((card) => Math.round(card.top))).size, 1, `${where}: folded cards must share one row`);
    assert.equal(new Set(view.right.map((card) => Math.round(card.top))).size, 1, `${where}: results must share one row`);
    assert.ok(Math.min(...view.right.map((card) => card.top)) > Math.max(...view.left.map((card) => card.bottom)), `${where}: results must sit below the folded cards`);
  }
  for (const card of view.left) {
    await frame.locator(`[data-left="${card.key}"]`).click();
    await frame.locator(`[data-right="${card.key}"]`).click();
    await frame.waitForTimeout(120);
  }
  const lines = await frame.evaluate(() => {
    const board = document.querySelector("#connectBoard").getBoundingClientRect();
    return [...document.querySelectorAll("#connectionLines path")].map((path) => {
      const length = path.getTotalLength();
      const start = path.getPointAtLength(0); const end = path.getPointAtLength(length);
      const left = document.querySelector(`[data-left="${path.dataset.lineLeft}"]`).getBoundingClientRect();
      const right = document.querySelector(`[data-right="${path.dataset.lineLeft}"]`).getBoundingClientRect();
      return { start: { x: start.x + board.left, y: start.y + board.top }, end: { x: end.x + board.left, y: end.y + board.top }, left: { cx: left.left + left.width / 2, bottom: left.bottom, right: left.right, cy: left.top + left.height / 2 }, right: { cx: right.left + right.width / 2, top: right.top, leftEdge: right.left, cy: right.top + right.height / 2 } };
    });
  });
  await frame.waitForFunction(() => document.querySelector("#paper")?.classList.contains("is-solved"), null, { timeout: 4000 });
  assert.equal(lines.length, 3, `${where}: three lines are drawn`);
  for (const line of lines) {
    if (stacked) {
      assert.ok(Math.abs(line.start.x - line.left.cx) < 2 && Math.abs(line.start.y - line.left.bottom) < 2, `${where}: a line must start at the bottom middle of its folded card`);
      assert.ok(Math.abs(line.end.x - line.right.cx) < 2 && Math.abs(line.end.y - line.right.top) < 2, `${where}: a line must end at the top middle of its result`);
    } else {
      assert.ok(Math.abs(line.start.x - line.left.right) < 2 && Math.abs(line.end.x - line.right.leftEdge) < 2, `${where}: a side-by-side line must run from the right edge to the left edge ${JSON.stringify(line)}`);
    }
  }
  solved += 1;
}

const frameFor = (page, player) => page.frames().find((frame) => frame.url().includes("embedded=1") && new URL(frame.url()).searchParams.get("player") === player);

try {
  for (const [level, viewport] of [[1, { width: 1280, height: 800 }], [2, { width: 1280, height: 800 }], [1, { width: 1024, height: 768 }], [2, { width: 1024, height: 768 }]]) {
    const { page, errors } = await openRound(viewport, `mode=battle&players=4&level=${level}&count=10&seed=connect-${level}`);
    /* 첫 문제에서 선 잇기가 나온 틀을 모두 푼다(배틀은 사람마다 순서가 달라 보통 한두 틀). */
    let found = 0;
    for (const player of ["A", "B", "C", "D"]) {
      const frame = frameFor(page, player);
      const kind = await frame.locator("#paper").getAttribute("class");
      if (!kind.includes("activity-connect-match")) continue;
      await solveConnect(frame, `L${level} ${viewport.width}x${viewport.height} ${player}`);
      assert.ok(await frame.evaluate(() => innerHeight <= 560 && innerWidth > innerHeight), "battle frames are short and wide");
      found += 1;
    }
    assert.ok(found >= 1, `L${level} ${viewport.width}x${viewport.height}: no matching problem in the first round`);
    assert.deepEqual(errors, [], `L${level} ${viewport.width}x${viewport.height}: page errors`);
    await page.close();
  }

  /* 함께하기 한 틀(가로 폰·넓은 화면): 틀이 높아 옆으로 잇는 배치 그대로 풀린다. */
  for (const viewport of [{ width: 844, height: 390 }, { width: 1280, height: 800 }]) {
    let done = false;
    for (const seed of ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8"]) {
      const { page, errors } = await openRound(viewport, `mode=together&level=2&count=10&seed=connect-${seed}`);
      const frame = frameFor(page, "A");
      const kind = await frame.locator("#paper").getAttribute("class");
      if (kind.includes("activity-connect-match")) {
        await solveConnect(frame, `together ${viewport.width}x${viewport.height}`);
        done = true;
      }
      assert.deepEqual(errors, [], `together ${viewport.width}x${viewport.height}: page errors`);
      await page.close();
      if (done) break;
    }
    assert.ok(done, `together ${viewport.width}x${viewport.height}: no matching problem found to solve`);
  }
} finally {
  await browser.close();
}
console.log(`Paper fold matching check passed: ${solved} matching problems solved by real clicks in 4-player battle frames (1280x800, 1024x768; levels 1 and 2) and together frames (844x390, 1280x800; side by side); pictures ${Math.min(...sizes)}-${Math.max(...sizes)}px (min ${PICTURE_MIN_PX}); folded cards on top, results below, lines from bottom middle to top middle.`);
