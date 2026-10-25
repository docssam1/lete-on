// 3D 게임 시범(1권 시계 · 2권 저울 · 9권 쌓기나무 · 9권 마방진)과 「개념 → 유형별 예제 → 게임」 흐름 검사 (2026-10-22)
//
// 휴대폰(375×800, 손가락)과 PC(1180×900, 마우스)에서, 학습 순서가 켜진 레슨 넷을 연다:
//   1) 개념 칸: 학습 순서 막대, 「문제로 확인하기」 단추는 하나뿐.
//   2) 유형별 예제: 원본 문항의 모든 유형 × 모든 예제를 끝까지 넘긴다. 답은 마지막 단계에서만 보인다.
//   3) 게임: WebGL 캔버스가 실제로 그려졌는지(화면 캡처의 색 수·칠한 넓이), 3D 물체를 손가락·마우스로 직접 눌러
//      조작되는지, 돌려 보기 → 「↺ 처음 시점」, 크게 보기(전체 화면) → 작게, 레벨 1을 끝까지 풀어 「통과」,
//      「연결 문제 풀기」로 골든벨 문제 단계가 열리는지. 한 번 틀린 뒤 맞히기·두 번 틀려 정답 보기 길도 지난다.
//   단계마다 가로 넘침이 없는지, 콘솔·페이지 오류가 0인지.
// 4) WebGL이 없는 기기: 평면 그림 알림이 뜨고 HTML 조작만으로 풀 수 있는지(9권 두 게임).
//
// 실행: 저장소 루트에서 python3 -m http.server 8797 를 띄운 뒤
//   node fields-classic/question-bank/golden-bell-3d-game-browser-audit.mjs
//   SHOTS=<폴더> 를 주면 단계마다 화면을 저장한다(저장소 밖에 둘 것).
// playwright-core가 다른 곳에 있으면 FIELDS_PLAYWRIGHT=<그 index.mjs 경로>, 브라우저 경로는 FIELDS_CHROMIUM.

import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { LESSON_FLOWS } from "./golden-bell-lesson-flow.js";
import { HANDS_ON_ACTIVITIES } from "./golden-bell-hands-on-models.js";

const { chromium } = await import(process.env.FIELDS_PLAYWRIGHT || "playwright-core");
const base = `${process.env.FIELDS_BASE_URL || "http://127.0.0.1:8797"}/fields-classic/question-bank`;
const SHOTS = process.env.SHOTS || "";
if (SHOTS) mkdirSync(SHOTS, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.FIELDS_CHROMIUM || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist", "--enable-unsafe-swiftshader"] });
const VIEWPORTS = [{ width: 375, height: 800, touch: true, name: "phone" }, { width: 1180, height: 900, touch: false, name: "desktop" }];
const results = [];

function watch(page) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error") errors.push(`console: ${m.text()}`); });
  return errors;
}
async function shot(page, name, locator = null) {
  if (!SHOTS) return;
  const path = `${SHOTS}/${name}.png`;
  if (locator) await locator.screenshot({ path }); else await page.screenshot({ path });
}
async function noOverflow(page, label) {
  const o = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: innerWidth, game: (() => { const g = document.querySelector(".gb-flow-game"); if (!g) return 0; const b = g.getBoundingClientRect(); return b.right; })() }));
  assert.ok(o.doc <= o.win + 1, `${label}: 가로 넘침 ${o.doc} > ${o.win}`);
  assert.ok(o.game <= o.win + 1, `${label}: 게임 판이 화면 밖 ${o.game}`);
}
// 캔버스 화면 캡처를 페이지 안에서 읽어 색 수와 「배경이 아닌」 넓이를 잰다(빈 WebGL 캔버스를 잡는다).
async function canvasPainted(page, canvas, label) {
  await page.waitForTimeout(250);
  const png = (await canvas.screenshot()).toString("base64");
  const stats = await page.evaluate(async (data) => {
    const img = new Image(); img.src = `data:image/png;base64,${data}`; await img.decode();
    const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
    const ctx = c.getContext("2d"); ctx.drawImage(img, 0, 0);
    const px = ctx.getImageData(0, 0, c.width, c.height).data, bg = [px[0], px[1], px[2]];
    const colors = new Set(); let painted = 0;
    for (let i = 0; i < px.length; i += 16) {
      colors.add(`${px[i] >> 4},${px[i + 1] >> 4},${px[i + 2] >> 4}`);
      if (Math.abs(px[i] - bg[0]) + Math.abs(px[i + 1] - bg[1]) + Math.abs(px[i + 2] - bg[2]) > 40) painted++;
    }
    return { colors: colors.size, painted: painted / (px.length / 16), w: c.width, h: c.height };
  }, png);
  assert.ok(stats.colors >= 12 && stats.painted >= 0.05, `${label}: WebGL 캔버스가 비었음 ${JSON.stringify(stats)}`);
  return stats;
}
// 3D 판의 한 점을 손가락(폰)이나 마우스(PC)로 누른다. 판을 화면에 올린 뒤 좌표를 다시 재고, 그 점이 캔버스 위인지 확인한다.
async function tap3dPoint(page, vp, measure) {
  const host = page.locator(".gb-flow-game .lg-3d");
  // 폰은 위에 단계 막대가 붙어 있어, 판을 화면 가운데로 올린다(맨 위에 붙이면 막대에 가린다).
  await host.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(120);
  const point = await host.evaluate(measure.fn, measure.arg);
  const box = await host.locator(".g3d-canvas").boundingBox();
  assert.ok(point && point.x > box.x && point.x < box.x + box.width && point.y > box.y && point.y < box.y + box.height && point.y > 0 && point.y < vp.height, `누를 점이 캔버스 안: ${JSON.stringify(point)} ${JSON.stringify(box)}`);
  const hit = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.className || "", [point.x, point.y]);
  assert.match(String(hit), /g3d-canvas/u, `그 점에서 맨 위는 3D 캔버스(가리는 것 없음): ${hit}`);
  if (vp.touch) await page.touchscreen.tap(point.x, point.y);
  else await page.mouse.click(point.x, point.y);
}
// 돌려 보기 → 처음 시점 단추 → 처음으로. 마우스로 끈다(손가락 끌기는 페이지 스크롤과 나뉘어 따로 본다).
async function orbitAndReset(page, game, label) {
  const canvas = game.locator(".g3d-canvas").first();
  const box = await canvas.boundingBox();
  const home = game.locator(".g3d-home").first();
  assert.equal(await home.isVisible(), false, `${label}: 처음엔 처음 시점 단추가 없음`);
  await page.mouse.move(box.x + box.width * 0.82, box.y + box.height * 0.2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.45, box.y + box.height * 0.25, { steps: 8 });
  await page.mouse.up();
  await home.waitFor({ state: "visible" });
  await home.click();
  await page.waitForFunction((el) => el.hidden, await home.elementHandle());
}
async function fullscreenRoundTrip(page, game, label, name) {
  const before = await game.locator(".g3d-canvas").first().boundingBox();
  await game.locator(".g3d-full").first().click();
  await page.waitForFunction(() => Boolean(document.fullscreenElement || document.querySelector(".g3d-pseudo-full")));
  await page.waitForTimeout(400);
  const after = await game.locator(".g3d-canvas").first().boundingBox();
  assert.ok(after.width * after.height > before.width * before.height * 1.05, `${label}: 크게 보기에서 캔버스가 커짐`);
  await canvasPainted(page, game.locator(".g3d-canvas").first(), `${label} 크게 보기`);
  await shot(page, `${name}-fullscreen`);
  await game.locator(".g3d-full").first().click();
  await page.waitForFunction(() => !document.fullscreenElement && !document.querySelector(".g3d-pseudo-full"));
}

// ───── 게임별 한 문제 풀기 ─────
// mode: right | once(한 번 틀린 뒤) | twice(두 번 틀려 정답 보기). tap3d: 이 문제에서 3D 물체를 직접 누른다.
async function solveClock(page, mode) {
  const cg = page.locator(".gb-flow-game .cg");
  const d = await cg.evaluate((el) => ({ ...el.dataset }));
  const start = Number(d.start), ops = d.ops.split(",").map(Number);
  let answer = start; for (const op of ops) answer = ((answer + op * 3 - 1) % 12 + 12) % 12 + 1;
  const tries = mode === "twice" ? 2 : mode === "once" ? 1 : 0;
  if (d.stage === "turn") {
    const dir = Math.sign(ops[0]);
    for (let t = 0; t < tries; t++) {
      await page.locator(`[data-clock-turn="${-dir}"]:not([disabled])`).click();
      await page.locator("[data-clock-check]:not([disabled])").click();
      if (t === 0 && tries === 2) await page.locator("[data-clock-reset]:not([disabled])").click();
    }
    if (mode !== "twice") {
      if (mode === "once") await page.locator("[data-clock-reset]:not([disabled])").click();
      for (let i = 0; i < Math.abs(ops[0]); i++) await page.locator(`[data-clock-turn="${dir}"]:not([disabled])`).click();
      await page.locator("[data-clock-check]:not([disabled])").click();
    }
  } else if (d.stage === "reverse") {
    const cards = await page.locator("[data-clock-choice]").evaluateAll((els) => els.map((e) => Number(e.dataset.clockChoice)));
    const wrongs = cards.filter((op) => ((start + op * 3 - 1) % 12 + 12) % 12 + 1 !== answer);
    for (let t = 0; t < tries; t++) await page.locator(`[data-clock-choice="${wrongs[t]}"]`).click();
    if (mode !== "twice") await page.locator(`[data-clock-choice="${ops[0]}"]`).click();
  } else {
    const wrongs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((v) => v !== answer);
    for (let t = 0; t < tries; t++) await page.locator(`[data-clock-number="${wrongs[t]}"]`).click();
    if (mode !== "twice") await page.locator(`[data-clock-number="${answer}"]`).click();
  }
  await page.locator("[data-clock-next]").waitFor();
  assert.equal(await cg.getAttribute("data-phase"), mode === "twice" ? "revealed" : "correct");
  await page.locator("[data-clock-next]").click();
}
async function solveBalance(page, vp, mode, tap3d) {
  const cg = page.locator(".gb-flow-game .cg.lg");
  const p = await cg.evaluate((el) => el.fcProblem);
  if (p.kind === "pick" && mode === "twice") mode = "once";
  const tries = mode === "twice" ? 2 : mode === "once" ? 1 : 0;
  if (p.kind === "order") {
    const put = async (order) => { if (await page.locator("[data-b2-clear]:not([disabled])").count()) await page.locator("[data-b2-clear]").click(); for (const i of order) await page.locator(`[data-game-controls] [data-b2-item="${i}"]`).click(); await page.locator("[data-b2-check]").click(); };
    for (let t = 0; t < tries; t++) await put([...p.answer].reverse());
    if (mode !== "twice") await put(p.answer);
  } else {
    const wrongs = p.items.filter((i) => i !== p.answer);
    for (let t = 0; t < tries; t++) await page.locator(`[data-game-controls] [data-b2-item="${wrongs[t]}"]`).click();
    if (mode !== "twice") {
      if (tap3d) { // 3D 저울 위의 공을 직접 누른다
        await tap3dPoint(page, vp, { fn: (el, item) => el.fcItemPoint(item), arg: p.answer });
      } else await page.locator(`[data-game-controls] [data-b2-item="${p.answer}"]`).click();
    }
  }
  await page.locator("[data-game-next]").waitFor();
  assert.equal(await cg.getAttribute("data-phase"), mode === "twice" ? "revealed" : "correct", `저울 ${p.kind} ${mode}`);
  await page.locator("[data-game-next]").click();
}
async function solveCubes(page, vp, mode, tap3d) {
  const cg = page.locator(".gb-flow-game .cg.lg");
  const p = await cg.evaluate((el) => el.fcProblem);
  const total = () => page.locator("[data-b9-total]").innerText().then(Number);
  const cells = [];
  p.answerMap.forEach((row, r) => row.forEach((h, c) => { if (h) cells.push([r, c, h]); }));
  let first = true;
  const build = async (skipLast) => {
    if (await page.locator("[data-b9-clear]:not([disabled])").count()) await page.locator("[data-b9-clear]").click();
    for (const [r, c, h] of cells) for (let k = 0; k < h; k++) {
      if (skipLast && r === cells.at(-1)[0] && c === cells.at(-1)[1] && k === h - 1) continue;
      if (tap3d && first) { // 3D 판의 칸(기둥 맨 윗면)을 직접 눌러 한 층 올린다
        first = false;
        const before = await total();
        await tap3dPoint(page, vp, { fn: (el, rc) => el.fcCellPoint(rc[0], rc[1]), arg: [r, c] });
        await page.waitForFunction((b) => Number(document.querySelector("[data-b9-total]").textContent) === b + 1, before);
      } else await page.locator(`[data-b9-cell="${r},${c}"]`).click();
    }
    await page.locator("[data-b9-check]").click();
  };
  const tries = mode === "twice" ? 2 : mode === "once" ? 1 : 0;
  for (let t = 0; t < tries; t++) await build(true);
  if (mode !== "twice") await build(false);
  await page.locator("[data-game-next]").waitFor();
  assert.equal(await cg.getAttribute("data-phase"), mode === "twice" ? "revealed" : "correct", `쌓기 ${p.kind} ${mode}`);
  if (mode === "twice") assert.equal(await total(), p.answer, "정답 보기에서 정답대로 쌓임");
  await page.locator("[data-game-next]").click();
}
async function solveMagic(page, vp, mode, tap3d) {
  const cg = page.locator(".gb-flow-game .cg.lg");
  const p = await cg.evaluate((el) => el.fcProblem);
  const fill = async (values) => {
    const used = new Set();
    for (const [k, i] of p.blanks.entries()) {
      if (tap3d && k === 0) {
        await tap3dPoint(page, vp, { fn: (el, cell) => el.fcCellPoint(cell), arg: i });
        await page.locator(`[data-b9m-cell="${i}"][aria-pressed="true"]`).waitFor();
      } else await page.locator(`[data-b9m-cell="${i}"]`).click();
      const card = p.cards.findIndex((v, idx) => v === values[i] && !used.has(idx));
      used.add(card);
      await page.locator(`[data-b9m-card="${card}"]`).click();
    }
    await page.locator("[data-b9m-check]").click();
  };
  // 틀린 판: 처음 두 빈칸의 카드를 맞바꾼다(같은 수면 덤 카드를 쓴다).
  const wrong = [...p.full];
  if (p.blanks.length >= 2 && wrong[p.blanks[0]] !== wrong[p.blanks[1]]) [wrong[p.blanks[0]], wrong[p.blanks[1]]] = [wrong[p.blanks[1]], wrong[p.blanks[0]]];
  else { const decoy = p.cards.find((v) => !p.blanks.some((i) => p.full[i] === v)); if (decoy !== undefined) wrong[p.blanks[0]] = decoy; }
  assert.ok(wrong.some((v, i) => v !== p.full[i]), "틀린 판을 만들 카드가 있다(덤 카드)");
  const tries = mode === "twice" ? 2 : mode === "once" ? 1 : 0;
  for (let t = 0; t < tries; t++) {
    await fill(wrong);
    if (t + 1 < tries || mode === "once") { for (const i of p.blanks) { await page.locator(`[data-b9m-cell="${i}"]`).click(); if (await page.locator("[data-b9m-clear]:not([disabled])").count()) await page.locator("[data-b9m-clear]").click(); } }
  }
  if (mode !== "twice") await fill(p.full);
  await page.locator("[data-game-next]").waitFor();
  assert.equal(await cg.getAttribute("data-phase"), mode === "twice" ? "revealed" : "correct", `마방진 ${p.kind} ${mode}`);
  await page.locator("[data-game-next]").click();
}

// 이 검사가 끝까지 풀 줄 아는 게임(나머지는 뜨는지만 본다)
const SOLVED_GAMES = new Set(["turn-clock", "b2-balance", "b9-cubes", "b9-magic"]);
async function playLevelOne(page, vp, gameId) {
  const isClock = gameId === "turn-clock";
  const root = page.locator(".gb-flow-game .cg");
  const go = page.locator(isClock ? "[data-clock-overlay]:not([hidden]) [data-clock-go]" : "[data-game-overlay]:not([hidden]) [data-game-go]");
  await go.click();
  let n = 0;
  while ((await root.getAttribute("data-phase")) !== "done") {
    const mode = n === 1 ? "once" : n === 2 ? "twice" : "right";
    const tap3d = n === 0 || n === 3;
    if (isClock) await solveClock(page, mode);
    else if (gameId === "b2-balance") await solveBalance(page, vp, mode, tap3d);
    else if (gameId === "b9-cubes") await solveCubes(page, vp, mode, tap3d);
    else await solveMagic(page, vp, mode, tap3d);
    n++;
    assert.ok(n < 40, "레벨이 끝나지 않음");
  }
  await page.locator(".cg-finish").waitFor();
  assert.match(await page.locator(isClock ? "#cg-finish-title" : "#lg-finish-title").innerText(), /통과/u);
  return n;
}

try {
  for (const vp of VIEWPORTS) {
    for (const [key, flow] of Object.entries(LESSON_FLOWS)) {
      // FLOWS=calendar,equalize — 이름에 그 말이 들어간 흐름만(빠른 확인용, 없으면 전부)
      if (process.env.FLOWS && !process.env.FLOWS.split(",").some((w) => key.includes(w) || flow.examples === w)) continue;
      const [bookId, lessonId] = key.split("/");
      const name = `${lessonId}-${vp.name}`;
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, hasTouch: vp.touch, isMobile: vp.touch, reducedMotion: "reduce" });
      const errors = watch(page);
      await page.route("**/functions/v1/**", (r) => r.fulfill({ status: 401, contentType: "application/json", body: '{"error":"login_required"}' }));
      await page.goto(`${base}/golden-bell.html?student=3D-QA&book=${bookId}${flow.game === "drill" ? "&test=1" : ""}`, { waitUntil: "networkidle" });
      const before = await page.evaluate(() => localStorage.getItem("fields-classic-golden-bell:3D-QA"));
      await page.locator(`.lesson-button[data-lesson="${lessonId}"]`).click();
      // 1) 개념 칸
      await page.locator(".gb-flow").waitFor();
      assert.equal(await page.locator('.gb-flow-step.active').getAttribute("data-flow-go"), "tutorial");
      assert.equal(await page.locator("[data-next-phase]").count(), 1, `${name}: 문제로 가는 단추는 하나`);
      await noOverflow(page, `${name} 개념`);
      await shot(page, `${name}-1-tutorial`);
      // 2) 유형별 예제: 모든 유형 × 모든 예제를 끝까지
      await page.locator('.gb-flow-actions [data-flow-go="examples"]').click();
      await page.locator(".tx-card").waitFor();
      assert.equal(await page.locator("[data-next-phase]").count(), 1);
      const typeCount = await page.locator(".tx-type").count();
      let exampleCount = 0;
      for (let t = 0; t < typeCount; t++) {
        await page.locator(`.tx-type[data-tx-type="${t}"]`).click();
        const exCount = Math.max(1, await page.locator(".tx-ex-tabs [data-tx-example]").count());
        for (let e = 0; e < exCount; e++) {
          if (exCount > 1) await page.locator(`.tx-ex-tabs [data-tx-example="${e}"]`).click();
          exampleCount++;
          let steps = 0;
          while (await page.locator(".tx-next[data-tx-step]").count()) {
            assert.equal(await page.locator("[data-tx-answer]").count(), 0, `${name}: 답이 마지막 단계 전에 보임`);
            await page.locator(".tx-next[data-tx-step]").click();
            steps++;
          }
          assert.ok(steps >= 2, `${name}: 예제 단계`);
          assert.equal(await page.locator("[data-tx-answer]").count(), 1, `${name}: 마지막 단계에서 답이 보임`);
          await noOverflow(page, `${name} 예제 ${t + 1}-${e + 1}`);
          if (t === 0 && e === 0) await shot(page, `${name}-2-example`, page.locator(".tx-card"));
        }
      }
      assert.equal(await page.locator(".tx-type.done").count(), typeCount, `${name}: 모든 유형을 봄`);
      // 3) 게임
      await page.locator('.gb-flow [data-flow-go="game"]').click();
      if (flow.game === "drill") {
        // 연습 공방(창): 세 단계 아홉 문제를 정답으로 끝까지 풀고, 「골든벨 문제로」를 누르면 골든벨 문제 단계로 간다.
        const frame = page.frameLocator(".gb-flow-game iframe.drill-frame");
        await frame.locator(".dr-prompt").waitFor();
        await shot(page, `${name}-3-game`);
        for (let k = 0; k < 9; k++) {
          const sh = await page.locator(".gb-flow-game iframe.drill-frame").evaluate((el) => el.contentWindow.__drill.p.shape);
          if (sh.kind === "choice") await frame.locator(`[data-pick="${sh.values[0]}"]`).click();
          else if (sh.kind === "weekday") await frame.locator(`.dr-key[data-day="${sh.values[0]}"]`).click();
          else if (sh.kind === "grid") for (const [k, val] of sh.values.entries()) { await frame.locator(`[data-cell="${k}"]`).click(); await frame.locator(`[data-card="${val}"]`).first().click(); }   // 가쿠로: 칸을 고르고 카드를 놓는다
          else for (const ch of sh.values.join(sh.kind === "frac" ? "/" : ",")) await frame.locator(`.dr-key[data-key="${ch}"]`).click();
          await frame.locator('[data-dr="answer"]').click();
          assert.match(await frame.locator(".dr-note").innerText(), /정답|맞았어요/u, `${name}: 공방 ${k + 1}번 정답`);
          await frame.locator('[data-dr="next"]').click();
        }
        await frame.locator(".dr-finale").waitFor();
        await frame.locator('[data-dr="done"]').click();
        await page.waitForFunction(() => document.querySelector('#stageSteps [data-phase="original"]')?.classList.contains("active"));
        assert.equal(await page.locator(".gb-flow-game").count(), 0, `${name}: 게임 화면이 정리됨`);
        assert.equal(await page.evaluate(() => localStorage.getItem("fields-classic-golden-bell:3D-QA")), before, `${name}: 게임·예제는 학습 기록을 바꾸지 않는다`);
        assert.deepEqual(errors, [], `${name}: 오류`);
        results.push(`${name} examples=${exampleCount} drill=9`);
        console.log(`GOLDEN_BELL_3D_FLOW_OK ${results.at(-1)}`);
        await page.close();
        continue;
      }
      if (HANDS_ON_ACTIVITIES[flow.game]?.kind === "transfer") {
        // 「직접 해보기」 옮기기 체험: 도전마다 짝 없는 구슬을 표시하고, 그 반을 골라 주고, 결과를 확인한다. 마지막은 「연결 문제 풀기」.
        const game = page.locator(".gb-flow-game"), rounds = HANDS_ON_ACTIVITIES[flow.game].rounds;
        for (let r = 0; r < rounds.length; r++) {
          const { left, right } = rounds[r];
          await game.locator(`.hand-scene[data-hand-round="${r}"]`).waitFor();
          if (r === 0) await shot(page, `${name}-3-game`);
          for (let i = right; i < left; i++) await game.locator(`[data-hand-action="mark"][data-value="${i}"]`).click();
          for (let i = right; i < right + (left - right) / 2; i++) await game.locator(`[data-hand-action="give"][data-value="${i}"]`).click();
          await game.locator('[data-hand-action="hand"]').click();
          await game.locator('[data-hand-action="check"]').click();
          await noOverflow(page, `${name} 체험 ${r + 1}`);
          await game.locator(`[data-hand-action="${r === rounds.length - 1 ? "questions" : "next"}"]`).click();
        }
        await page.waitForFunction(() => document.querySelector('#stageSteps [data-phase="original"]')?.classList.contains("active"));
        assert.equal(await page.locator(".gb-flow-game").count(), 0, `${name}: 게임 화면이 정리됨`);
        assert.equal(await page.evaluate(() => localStorage.getItem("fields-classic-golden-bell:3D-QA")), before, `${name}: 게임·예제는 학습 기록을 바꾸지 않는다`);
        assert.deepEqual(errors, [], `${name}: 오류`);
        results.push(`${name} examples=${exampleCount} handsOn=${rounds.length}`);
        console.log(`GOLDEN_BELL_3D_FLOW_OK ${results.at(-1)}`);
        await page.close();
        continue;
      }
      if (!SOLVED_GAMES.has(flow.game)) {
        // 흐름 검사가 풀이를 모르는 게임(그 게임은 자기 검사기가 끝까지 푼다): 게임이 뜨고 그려지는지만 보고 「골든벨 문제 풀기」로 넘어간다
        const game = page.locator(".gb-flow-game"), level = !HANDS_ON_ACTIVITIES[flow.game] || HANDS_ON_ACTIVITIES[flow.game].kind === "level-game";
        if (level) {
          await game.locator(".cg").waitFor();
          await page.locator("[data-game-go]").first().click();
          await game.locator("[data-game-controls]").first().waitFor();
          // 3D 무대가 있는 게임만 그려졌는지 본다(2권 게임 몇은 평면)
          if (await game.locator(".g3d").count()) { assert.equal(await game.locator(".g3d").first().getAttribute("data-renderer"), "webgl", `${name}: WebGL 무대`); const canvas = game.locator(".g3d-canvas").first(); await canvas.scrollIntoViewIfNeeded(); await canvasPainted(page, canvas, `${name} 게임`); }
        } else await game.locator(".hand-scene").first().waitFor();
        await noOverflow(page, `${name} 게임`);
        await shot(page, `${name}-3-game`);
        await page.locator('.gb-flow-actions [data-next-phase="original"]').click();
        await page.waitForFunction(() => document.querySelector('#stageSteps [data-phase="original"]')?.classList.contains("active"));
        assert.equal(await page.locator(".gb-flow-game").count(), 0, `${name}: 게임 화면이 정리됨`);
        assert.equal(await page.evaluate(() => localStorage.getItem("fields-classic-golden-bell:3D-QA")), before, `${name}: 게임·예제는 학습 기록을 바꾸지 않는다`);
        assert.deepEqual(errors, [], `${name}: 오류`);
        results.push(`${name} examples=${exampleCount} game=mounted`);
        console.log(`GOLDEN_BELL_3D_FLOW_OK ${results.at(-1)}`);
        await page.close();
        continue;
      }
      const game = page.locator(".gb-flow-game");
      await game.locator(".cg").waitFor();
      assert.equal(await game.locator(".g3d").first().getAttribute("data-renderer"), "webgl", `${name}: WebGL 무대`);
      const startButton = page.locator("[data-game-go], [data-clock-go]").first();
      await startButton.click();
      const canvas = game.locator(".g3d-canvas").first();
      await canvas.scrollIntoViewIfNeeded();
      const stats = await canvasPainted(page, canvas, `${name} 게임`);
      await noOverflow(page, `${name} 게임`);
      await shot(page, `${name}-3-game`);
      if (!vp.touch) await orbitAndReset(page, game, name);
      await fullscreenRoundTrip(page, game, name, name);
      // 처음 소개 화면부터 레벨 1을 끝까지(레벨 고르기에서 1을 다시 고른다)
      const levelsButton = page.locator(flow.game === "turn-clock" ? "[data-clock-levels]" : "[data-game-levels]").first();
      await levelsButton.click();
      await page.locator(flow.game === "turn-clock" ? '[data-clock-pick-level="1"]' : '[data-game-pick-level="1"]').click();
      const solved = await playLevelOne(page, vp, flow.game);
      await noOverflow(page, `${name} 끝`);
      await shot(page, `${name}-4-finish`);
      // 연결 문제 풀기 → 골든벨 문제 단계
      await page.locator(flow.game === "turn-clock" ? "[data-clock-questions]" : "[data-game-questions]").click();
      await page.waitForFunction(() => document.querySelector('#stageSteps [data-phase="original"]')?.classList.contains("active"));
      assert.equal(await page.locator(".gb-flow-game").count(), 0, `${name}: 게임 화면이 정리됨`);
      assert.equal(await page.evaluate(() => localStorage.getItem("fields-classic-golden-bell:3D-QA")), before, `${name}: 게임·예제는 학습 기록을 바꾸지 않는다`);
      assert.deepEqual(errors, [], `${name}: 오류`);
      results.push(`${name} examples=${exampleCount} level1=${solved} canvasColors=${stats.colors} painted=${stats.painted.toFixed(2)}`);
      console.log(`GOLDEN_BELL_3D_FLOW_OK ${results.at(-1)}`);
      await page.close();
    }
  }
  // 3-2) 단계를 여러 번 오가도 3D 무대(WebGL 문맥)가 쌓이지 않는다 — 게임 칸에서 1개, 떠나면 0개.
  {
    const page = await browser.newPage({ viewport: { width: 1180, height: 900 }, reducedMotion: "reduce" });
    const errors = watch(page);
    await page.route("**/functions/v1/**", (r) => r.fulfill({ status: 401, contentType: "application/json", body: '{"error":"login_required"}' }));
    await page.goto(`${base}/golden-bell.html?student=3D-LEAK&book=book-09`, { waitUntil: "networkidle" });
    await page.locator('.lesson-button[data-lesson="magic-square-missing"]').click();
    const live = () => page.evaluate(async () => (await import("./golden-bell-3d-engine.js?v=20261023w")).liveStageCount());
    for (let k = 0; k < 5; k++) {
      await page.locator('.gb-flow [data-flow-go="game"]').click();
      await page.locator(".gb-flow-game .g3d-canvas").waitFor();
      assert.equal(await live(), 1, "게임 칸의 3D 무대는 하나");
      await page.locator('.gb-flow [data-flow-go="examples"]').click();
      await page.locator(".tx-card").waitFor();
      assert.equal(await live(), 0, "예제 칸으로 가면 3D 무대를 닫는다");
    }
    await page.locator('.gb-flow [data-flow-go="game"]').click();
    await page.locator(".gb-flow-game .g3d-canvas").waitFor();
    await page.locator('.lesson-button[data-lesson="cube-min-max-source"]').click();
    await page.locator('.gb-flow-step.active[data-flow-go="tutorial"]').waitFor();
    assert.equal(await live(), 0, "다른 레슨으로 가면 3D 무대를 닫고 개념 설명부터");
    assert.deepEqual(errors, []);
    console.log("GOLDEN_BELL_3D_NO_LEAK_OK switches=5");
    await page.close();
  }
  // 4) WebGL이 없는 기기: 평면 그림 + HTML 조작
  for (const lessonId of ["cube-min-max-source", "magic-square-missing"]) {
    const page = await browser.newPage({ viewport: { width: 375, height: 800 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
    const errors = watch(page);
    await page.addInitScript(() => { const get = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (type, ...rest) { return /webgl/u.test(type) ? null : get.call(this, type, ...rest); }; });
    await page.route("**/functions/v1/**", (r) => r.fulfill({ status: 401, contentType: "application/json", body: '{"error":"login_required"}' }));
    await page.goto(`${base}/golden-bell.html?student=3D-FLAT&book=book-09`, { waitUntil: "networkidle" });
    await page.locator(`.lesson-button[data-lesson="${lessonId}"]`).click();
    await page.locator('.gb-flow [data-flow-go="game"]').click();
    await page.locator(".gb-flow-game .cg").waitFor();
    assert.equal(await page.locator(".gb-flow-game .g3d").count(), 0, "WebGL이 없으면 3D 무대를 만들지 않음");
    assert.equal(await page.locator(".gb-flow-game .g3d-fallback").count(), 1, "평면 그림 알림");
    await page.locator("[data-game-go]").click();
    if (lessonId === "cube-min-max-source") await solveCubes(page, VIEWPORTS[0], "right", false);
    else await solveMagic(page, VIEWPORTS[0], "right", false);
    await noOverflow(page, `${lessonId} 평면`);
    await shot(page, `${lessonId}-flat`);
    assert.deepEqual(errors, []);
    console.log(`GOLDEN_BELL_3D_FLAT_OK ${lessonId}`);
    await page.close();
  }
} finally {
  await browser.close();
}
console.log(`GOLDEN_BELL_3D_GAME_BROWSER_OK runs=${results.length}`);
