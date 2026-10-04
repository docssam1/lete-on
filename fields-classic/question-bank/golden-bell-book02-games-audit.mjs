// 2권 레벨 게임 4종 검사 (2026-10-04)
//
// 1) 규칙: 레벨 1~10과 끝없는 도전의 문제를 여러 판 만들어, 답이 하나뿐인지 화면 코드와 따로 쓴 방법으로
//    다시 확인한다. 도형 값은 0~20 전체를 대입, 저울은 모든 순열을 대입, 무늬는 처음부터 이어 붙여 세고,
//    스도쿠는 모든 판을 다시 풀어 해가 하나인지 본다.
// 2) 화면: 골든벨 2권에서 네 게임을 열어 레벨 1~3을 끝까지 풀고(한 번 틀린 뒤 맞히기·두 번 틀려 정답 보기 포함)
//    다음 레벨이 열리는지, 휴대폰 폭에서 가로로 넘치지 않는지, 학습 기록을 바꾸지 않는지 본다.
//
// 실행: 저장소 루트에서 python3 -m http.server 8797 를 띄운 뒤
//   node fields-classic/question-bank/golden-bell-book02-games-audit.mjs          # 전부
//   node fields-classic/question-bank/golden-bell-book02-games-audit.mjs --model  # 규칙만
// playwright-core가 다른 곳에 있으면 FIELDS_PLAYWRIGHT=<그 index.mjs 경로>, 브라우저 경로는 FIELDS_CHROMIUM.

import assert from "node:assert/strict";
import { MATRIX, BALANCE, PATTERN, SUDOKU, BOOK02_GAMES } from "./golden-bell-book02-game-models.js";
import { HANDS_ON_ACTIVITIES, HANDS_ON_UNITS } from "./golden-bell-hands-on-models.js";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-library.js";

const permutations = (xs) => (xs.length ? xs.flatMap((x, i) => permutations(xs.filter((_, j) => j !== i)).map((r) => [x, ...r])) : [[]]);
const levelsOf = (g) => [...Array(12).keys()].map((i) => i + 1);

// 도형 값: 0~20 전체 대입으로 해가 하나인지(화면은 1~9 범위로만 찾는다)
function matrixAll(p) {
  const k = p.shapes.length, sols = [], v = Array(k).fill(0);
  const ok = () => {
    const val = (s) => v[p.shapes.indexOf(s)];
    if (p.grid) return p.grid.every((row, r) => row.reduce((a, s) => a + val(s), 0) === p.rowSums[r]) && p.colSums.every((sum, c) => p.grid.reduce((a, row) => a + val(row[c]), 0) === sum);
    return p.equations.every((e) => (e.op === "-" ? val(e.a) - val(e.b) : val(e.a) + val(e.b)) === e.result);
  };
  const rec = (i) => { if (i === k) { if (ok()) sols.push([...v]); return; } for (let x = p.lo; x <= p.hi; x++) { v[i] = x; rec(i + 1); } };
  rec(0);
  return sols;
}
for (const level of levelsOf(MATRIX)) for (let seed = 1; seed <= 25; seed++) for (const p of MATRIX.build(level, { seed })) {
  const sols = matrixAll(p);
  assert.equal(sols.length, 1, `도형 값 L${level}: 해 ${sols.length}개`);
  assert.deepEqual(sols[0], p.answer);
}
// 저울: 모든 순열 중 저울을 다 만족하는 것이 하나
for (const level of levelsOf(BALANCE)) for (let seed = 1; seed <= 25; seed++) for (const p of BALANCE.build(level, { seed })) {
  const heavy = (s) => (s.heavy === "left" ? [s.left, s.right] : [s.right, s.left]);
  const fits = permutations(p.items).filter((o) => p.scales.every((s) => { const [h, l] = heavy(s); return o.indexOf(h) < o.indexOf(l); }));
  assert.equal(fits.length, 1, `저울 L${level}: 맞는 순서 ${fits.length}개`);
  const want = p.kind === "order" ? fits[0] : p.kind === "pick" ? fits[0][0] : fits[0][p.n - 1];
  assert.deepEqual(p.answer, want);
}
// 무늬: 처음부터 이어 붙여 n번째와 개수를 센다
for (const level of levelsOf(PATTERN)) for (let seed = 1; seed <= 25; seed++) for (const p of PATTERN.build(level, { seed })) {
  const seq = [];
  for (let i = 0; seq.length < p.n; i++) seq.push(p.dual ? { shape: p.shapeCycle[i % p.shapeCycle.length], color: p.colorCycle[i % p.colorCycle.length] } : p.unit[i % p.unit.length]);
  if (p.kind === "count") {
    assert.equal(p.answer, seq.filter((b) => b.shape === p.target.shape && b.color === p.target.color).length);
    assert.equal(p.choices.filter((c) => c === p.answer).length, 1);
  } else {
    assert.deepEqual(p.answer, seq[p.n - 1]);
    if (p.choices) assert.equal(p.choices.filter((c) => c.shape === p.answer.shape && c.color === p.answer.color).length, 1, "보기 중 정답은 하나");
  }
  if (p.dual) assert.notEqual(p.shapeCycle.length, p.colorCycle.length, "이중 무늬는 두 주기가 달라야 한다");
  else for (let d = 1; d < p.unit.length; d++) if (p.unit.length % d === 0) assert.ok(!p.unit.every((b, i) => b.shape === p.unit[i % d].shape && b.color === p.unit[i % d].color), "마디가 더 짧게 쪼개지지 않음");
}
// 스도쿠: 다시 풀어 해가 하나이고 그것이 정답인지
function solveAll(p) {
  const n = p.size, g = p.puzzle.map((r) => [...r]), sols = [];
  const okAt = (r, c, v) => { for (let i = 0; i < n; i++) if (g[r][i] === v || g[i][c] === v) return false; if (p.boxes) { const br = r - r % 2, bc = c - c % 2; for (const [a, b] of [[br, bc], [br, bc + 1], [br + 1, bc], [br + 1, bc + 1]]) if (g[a][b] === v) return false; } return true; };
  const rec = (k) => { if (sols.length > 1) return; if (k === n * n) { sols.push(g.map((r) => [...r])); return; } const r = Math.floor(k / n), c = k % n; if (g[r][c]) { rec(k + 1); return; } for (let v = 1; v <= n; v++) if (okAt(r, c, v)) { g[r][c] = v; rec(k + 1); g[r][c] = 0; } };
  rec(0);
  return sols;
}
for (const level of levelsOf(SUDOKU)) for (let seed = 1; seed <= 25; seed++) for (const p of SUDOKU.build(level, { seed })) {
  const sols = solveAll(p);
  assert.equal(sols.length, 1, `스도쿠 L${level}: 해 ${sols.length}개`);
  assert.deepEqual(sols[0], p.solution);
  assert.equal(p.puzzle.flat().filter((v) => !v).length, p.blanks);
}
for (const g of Object.values(BOOK02_GAMES)) {
  assert.equal(g.levels.length, 10);
  for (let level = 1; level <= 14; level++) { const run = g.build(level, { seed: level }); assert.equal(new Set(run.map((p) => p.key)).size, run.length, `${g.id} L${level} 같은 문제 없음`); }
  assert.deepEqual([11, 12, 20, 30].map((l) => g.build(l, { seed: 3 }).length), [12, 14, 30, 30], `${g.id} 끝없는 도전 문제 수`);
}
// 2권 18레슨 모두에 게임 단원이 붙고, 2권 게임은 아직 학습지 QR에 넣지 않는다.
for (const lesson of GOLDEN_BELL_BOOKS[1].lessons) assert.ok(HANDS_ON_UNITS.some((u) => u.bookId === "book-02" && u.lessons.includes(lesson.id)), lesson.id);
for (const id of Object.keys(BOOK02_GAMES)) assert.equal(HANDS_ON_ACTIVITIES[id].qr, false);
console.log("BOOK02_GAMES_MODEL_OK games=4 levels=12 seeds=25");
if (process.argv.includes("--model")) process.exit(0);

const { chromium } = await import(process.env.FIELDS_PLAYWRIGHT || "playwright-core");
const base = `${process.env.FIELDS_BASE_URL || "http://127.0.0.1:8797"}/fields-classic/question-bank`;
const browser = await chromium.launch({ executablePath: process.env.FIELDS_CHROMIUM || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });

// 한 문제를 푼다. mode: right | once(한 번 틀린 뒤) | twice(두 번 틀려 정답 보기)
async function solve(page, game, mode) {
  const p = await page.locator(".cg.lg").evaluate((el) => el.fcProblem);
  // 둘 중 고르기는 한 번 틀리면 남은 것이 정답뿐이라 두 번 틀릴 수 없다.
  if (p.kind === "pick" && mode === "twice") mode = "once";
  const c = (sel) => page.locator(`[data-game-controls] ${sel}, [data-game-stage] ${sel}`).first();
  const tries = mode === "twice" ? 2 : mode === "once" ? 1 : 0;
  if (game === "b2-matrix") {
    const fill = async (vals) => { for (const [i, v] of vals.entries()) { await c(`[data-b2-slot="${i}"]`).click(); await c(`[data-b2-num="${v}"]`).click(); } await c("[data-b2-check]").click(); };
    for (let t = 0; t < tries; t++) await fill(p.answer.map((v, i) => (i === 0 ? (v === p.hi ? v - 1 : v + 1) : v)));
    if (mode !== "twice") await fill(p.answer);
  } else if (game === "b2-balance") {
    if (p.kind === "order") {
      const put = async (order) => { if (await c("[data-b2-clear]:not([disabled])").count()) await c("[data-b2-clear]").click(); for (const i of order) await c(`[data-b2-item="${i}"]`).click(); await c("[data-b2-check]").click(); };
      for (let t = 0; t < tries; t++) await put([...p.answer].reverse());
      if (mode !== "twice") await put(p.answer);
    } else {
      const wrongs = p.items.filter((i) => i !== p.answer);
      for (let t = 0; t < tries; t++) await c(`[data-b2-item="${wrongs[t]}"]`).click();
      if (mode !== "twice") await c(`[data-b2-item="${p.answer}"]`).click();
    }
  } else if (game === "b2-pattern") {
    if (p.kind === "count") {
      const wrongs = p.choices.filter((v) => v !== p.answer);
      for (let t = 0; t < tries; t++) await c(`[data-b2-count="${wrongs[t]}"]`).click();
      if (mode !== "twice") await c(`[data-b2-count="${p.answer}"]`).click();
    } else if (p.kind === "dual") {
      const pickAndCheck = async (shape, color) => { await c(`[data-b2-shape="${shape}"]`).click(); await c(`[data-b2-color="${color}"]`).click(); await c("[data-b2-check]").click(); };
      for (let t = 0; t < tries; t++) await pickAndCheck(p.shapeCycle.find((s) => s !== p.answer.shape), p.answer.color);
      if (mode !== "twice") await pickAndCheck(p.answer.shape, p.answer.color);
    } else {
      const idx = p.choices.findIndex((b) => b.shape === p.answer.shape && b.color === p.answer.color);
      const wrongs = p.choices.map((_, i) => i).filter((i) => i !== idx);
      for (let t = 0; t < tries; t++) await c(`[data-b2-choice="${wrongs[t]}"]`).click();
      if (mode !== "twice") await c(`[data-b2-choice="${idx}"]`).click();
    }
  } else {
    const blanks = [];
    p.puzzle.forEach((row, r) => row.forEach((v, col) => { if (!v) blanks.push([r, col]); }));
    const fill = async (grid) => { for (const [r, col] of blanks) { await c(`[data-b2-cell="${r},${col}"]`).click(); await c(`[data-b2-num="${grid[r][col]}"]`).click(); } await c("[data-b2-check]").click(); };
    // 틀린 판: 첫 빈칸에 다른 수를 넣는다
    const bad = p.solution.map((row) => [...row]);
    bad[blanks[0][0]][blanks[0][1]] = bad[blanks[0][0]][blanks[0][1]] % p.size + 1;
    for (let t = 0; t < tries; t++) await fill(bad);
    if (mode !== "twice") await fill(p.solution);
  }
  await page.locator("[data-game-next]").waitFor();
  assert.equal(await page.locator(".cg.lg").getAttribute("data-phase"), mode === "twice" ? "revealed" : "correct", `${game} ${p.kind} ${mode}`);
  await page.locator("[data-game-next]").click();
}
async function playLevel(page, game, modeFor) {
  await page.locator("[data-game-overlay]:not([hidden]) [data-game-go]").click();
  let n = 0;
  while ((await page.locator(".cg.lg").getAttribute("data-phase")) !== "done") await solve(page, game, modeFor(n++));
  await page.locator(".cg-finish").waitFor();
  return n;
}

try {
  const lessonOf = { "b2-matrix": "addition-matrix", "b2-balance": "balance-order", "b2-pattern": "repeating-sequence", "b2-sudoku": "sudoku" };
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce", hasTouch: width < 500 });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.route("**/functions/v1/**", (r) => r.fulfill({ status: 401, contentType: "application/json", body: '{"error":"login_required"}' }));
    await page.goto(`${base}/golden-bell.html?student=B2-QA&book=book-02`, { waitUntil: "networkidle" });
    const before = await page.evaluate(() => localStorage.getItem("fields-classic-golden-bell:B2-QA"));
    for (const [game, lesson] of Object.entries(lessonOf)) {
      await page.locator(`.lesson-button[data-lesson="${lesson}"]`).click();
      await page.locator(`.gold-hands-on [data-hand-open="${game}"]`).click();
      const levels = width === 1440 ? 3 : 1;
      for (let level = 1; level <= levels; level++) {
        assert.equal(await page.locator(".cg.lg").getAttribute("data-level"), String(level));
        const n = await playLevel(page, game, (i) => (i === 1 ? "once" : i === 2 ? "twice" : "right"));
        assert.equal(n, BOOK02_GAMES[game].levels[level - 1].count);
        assert.match(await page.locator("#lg-finish-title").innerText(), /통과/u);
        assert.equal(await page.evaluate(() => document.querySelector(".hand-modal").scrollWidth > innerWidth + 1), false, `${game} ${width}: 가로 넘침`);
        await page.locator("[data-game-next-level]").click();
      }
      const progress = await page.evaluate((g) => JSON.parse(localStorage.getItem(`fc-game-${g}-progress`)), game);
      assert.equal(progress.unlocked, (width === 1440 ? 3 : 1) + 1);
      await page.locator("[data-hand-close]").click();
      console.log(`BOOK02_GAME_PLAY_OK ${game} width=${width}`);
    }
    // 단원의 연결 문제로 넘어가기(레벨을 다 푼 뒤)
    assert.equal(await page.evaluate(() => localStorage.getItem("fields-classic-golden-bell:B2-QA")), before, "게임은 학습 기록을 바꾸지 않는다");
    assert.deepEqual(errors, []);
    await page.close();
  }
} finally {
  await browser.close();
}
