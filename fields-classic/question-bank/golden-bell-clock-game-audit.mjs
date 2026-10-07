// 「시계 바늘 돌리기」 레벨 게임 검사 (2026-10-04)
//
// 1) 규칙: 레벨 1~10과 끝없는 도전(11~)의 문제를 여러 판 만들어, 정답을 화면과 다른 식으로 다시 계산해
//    맞춘다. 레벨 1이 원본 체험 3도전으로 시작하는지, 레벨마다 문제 종류·개수·명령 수가 맞는지,
//    끝없는 도전이 깰 때마다 2문제씩 늘어나는지, 거꾸로 보기에 같은 곳에 닿는 보기가 하나뿐인지,
//    틀린 종류가 섞는 레벨에서 더 자주 나오는지, 분수 표기와 숫자 조사.
// 2) 화면: 골든벨 1권 모달에서 레벨 1~10을 끝까지 풀어 레벨이 차례로 열리는지 본다. 한 번 틀린 뒤 맞히기,
//    두 번 틀려 정답 보기, 바늘 숨기기, 60% 미만이면 다음 레벨이 안 열리는지, 새로 고쳐도 진행이
//    남는지, 끝없는 도전 12문제, 「연결 문제 풀기」 전환을 함께 본다.
// 3) 게임 QR 페이지(game.html): 바늘 끌기, WebGL이 없을 때 2D, QR에서 다른 기능으로 못 나가기.
//
// 실행: 저장소 루트에서 python3 -m http.server 8797 를 띄운 뒤
//   node fields-classic/question-bank/golden-bell-clock-game-audit.mjs          # 전부
//   node fields-classic/question-bank/golden-bell-clock-game-audit.mjs --model  # 규칙만(브라우저 없음)
// playwright-core가 필요하다(다른 곳에 있으면 FIELDS_PLAYWRIGHT=<그 index.mjs 경로>). 브라우저 경로는 FIELDS_CHROMIUM.

import assert from "node:assert/strict";
import { HANDS_ON_ACTIVITIES } from "./golden-bell-hands-on-models.js";
import { buildLevel, levelSpec, levelResult, reverseChoices, checkChoice, checkTurn, missionText, hintText, successText, turnAmountText, josa, seededRandom, LEVELS, MASTER_LEVEL } from "./golden-bell-clock-game-model.js";

// 화면 코드와 따로 쓴 계산: 시계 방향 반의 반 바퀴 = 숫자 3칸.
const independent = (start, ops) => { let v = start; for (const op of ops) v = ((v + op * 3 - 1) % 12 + 12) % 12 + 1; return v; };
const NO_FRACTION = /¼|½|\d\s*\/\s*\d|undefined|NaN/u;

assert.equal(MASTER_LEVEL, 10);
for (let level = 1; level <= 20; level++) {
  const spec = levelSpec(level);
  for (let seed = 1; seed <= 60; seed++) {
    const run = buildLevel(level, { seed });
    assert.equal(run.length, spec.count, `레벨 ${level} 문제 수`);
    if (level === 1) assert.deepEqual(run.slice(0, 3).map((p) => [p.start, p.ops[0]]), HANDS_ON_ACTIVITIES["turn-clock"].rounds.map((r) => [r.start, r.turns]), "레벨 1은 원본 체험 3도전으로 시작");
    assert.equal(new Set(run.map((p) => p.key)).size, run.length, `레벨 ${level}: 한 판 안에서 같은 문제 없음`);
    for (const p of run) {
      assert.ok(Object.hasOwn(spec.mix, p.stage), `레벨 ${level}: 정해진 종류만 (${p.stage})`);
      assert.equal(p.answer, independent(p.start, p.ops), `레벨 ${level} seed ${seed}`);
      assert.ok(p.ops.every((op) => [1, 2, 4].includes(Math.abs(op))), "원본이 쓰는 세 가지 양만");
      assert.equal(p.ops.length, p.stage === "chain" ? spec.steps : 1);
      if (p.hidden) assert.ok(["predict", "chain"].includes(p.stage), "바늘 숨기기는 숫자를 고르는 문제에만");
      for (const text of [missionText(p), hintText(p), successText(p, p.ops[0])]) assert.doesNotMatch(text, NO_FRACTION, text);
      if (p.stage === "reverse") {
        assert.equal(new Set(p.choices).size, 4);
        assert.equal(p.choices.filter((op) => checkChoice(p, op)).length, 1, "같은 곳에 닿는 보기는 하나");
      }
      if (p.stage === "turn") assert.equal(checkTurn(p, p.ops[0] + 4 * Math.sign(p.ops[0])), false, "한 바퀴 더 돌면 틀림");
    }
  }
}
assert.ok(levelSpec(8).hidden === 1 && buildLevel(8, { seed: 3 }).every((p) => p.stage === "reverse" || p.stage === "turn" || p.hidden), "바늘 없이 레벨은 모두 숨김");
assert.deepEqual([11, 12, 13, 20, 30].map((l) => levelSpec(l).count), [12, 14, 16, 30, 30], "끝없는 도전은 깰 때마다 2문제씩, 30개까지");
// 많이 틀린 종류는 섞는 레벨에서 더 자주 나온다.
const share = (weak) => { let n = 0, all = 0; for (let seed = 1; seed <= 300; seed++) for (const p of buildLevel(7, { seed, weak })) { all++; if (p.stage === "reverse") n++; } return n / all; };
assert.ok(share({ reverse: 6 }) > share({}) + 0.15, "틀린 종류의 비중이 늘어남");
for (const op of [2, -2]) assert.ok(!reverseChoices(op, seededRandom(3)).includes(-op));
assert.deepEqual([levelResult(12, 6), levelResult(8, 6), levelResult(7, 6), levelResult(12, 10)].map((r) => [r.passed, r.stars]), [[true, 3], [true, 1], [false, 0], [true, 1]]);
assert.equal(turnAmountText(6), "시계 방향으로 한 바퀴와 반 바퀴");
assert.deepEqual([1, 2, 3, 9, 12].map((n) => josa(n, "을")), ["1을", "2를", "3을", "9를", "12를"]);
assert.deepEqual([1, 3, 12].map((n) => josa(n, "으로")), ["1로", "3으로", "12로"]);
assert.equal(LEVELS.length, 10);
console.log("CLOCK_GAME_MODEL_OK levels=20 seeds=60");
if (process.argv.includes("--model")) process.exit(0);

const { chromium } = await import(process.env.FIELDS_PLAYWRIGHT || "playwright-core");
const base = `${process.env.FIELDS_BASE_URL || "http://127.0.0.1:8797"}/fields-classic/question-bank`;
const browser = await chromium.launch({ executablePath: process.env.FIELDS_CHROMIUM || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
const watch = (page) => { const errors = []; page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => m.type() === "error" && errors.push(m.text())); return errors; };

// 한 문제를 푼다. mode: "right" | "once"(한 번 틀린 뒤 맞힘) | "twice"(두 번 틀려 정답 보기)
async function solve(page, mode = "right") {
  const cg = page.locator(".cg");
  const d = await cg.evaluate((el) => ({ ...el.dataset }));
  const start = Number(d.start), ops = d.ops.split(",").map(Number), answer = independent(start, ops);
  assert.doesNotMatch(await page.locator("[data-clock-mission]").innerText(), NO_FRACTION);
  if (d.hidden === "true") assert.equal(await cg.evaluate(() => document.querySelector(".cg-pick:not(:disabled)") !== null), true);
  const wrongNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((v) => v !== answer);
  if (d.stage === "turn") {
    const dir = Math.sign(ops[0]);
    const tries = mode === "twice" ? 2 : mode === "once" ? 1 : 0;
    for (let t = 0; t < tries; t++) {
      await page.locator(`[data-clock-turn="${-dir}"]:not([disabled])`).click();
      await page.locator("[data-clock-check]:not([disabled])").click();
      if (t === 0) { assert.equal(await cg.getAttribute("data-phase"), "wrong"); await page.locator("[data-clock-reset]:not([disabled])").click(); }
    }
    if (mode !== "twice") {
      for (let i = 0; i < Math.abs(ops[0]); i++) await page.locator(`[data-clock-turn="${dir}"]:not([disabled])`).click();
      assert.equal(await page.locator("[data-clock-readout] strong").innerText(), turnAmountText(ops[0]));
      await page.locator("[data-clock-check]:not([disabled])").click();
    }
  } else if (d.stage === "reverse") {
    const cards = await page.locator("[data-clock-choice]").evaluateAll((els) => els.map((e) => Number(e.dataset.clockChoice)));
    const wrongs = cards.filter((op) => independent(start, [op]) !== answer);
    for (let t = 0; t < (mode === "twice" ? 2 : mode === "once" ? 1 : 0); t++) await page.locator(`[data-clock-choice="${wrongs[t]}"]`).click();
    if (mode !== "twice") await page.locator(`[data-clock-choice="${ops[0]}"]`).click();
  } else {
    for (let t = 0; t < (mode === "twice" ? 2 : mode === "once" ? 1 : 0); t++) {
      await page.locator(`[data-clock-number="${wrongNumbers[t]}"]`).click();
      if (t === 0) assert.equal(await page.locator(`[data-clock-number="${wrongNumbers[0]}"]`).getAttribute("data-mark"), "bad");
    }
    if (mode !== "twice") await page.locator(`[data-clock-number="${answer}"]`).click();
  }
  await page.locator("[data-clock-next]").waitFor();
  assert.equal(await cg.getAttribute("data-phase"), mode === "twice" ? "revealed" : "correct");
  if (mode === "twice") assert.equal(await page.locator(`[data-clock-number="${answer}"]`).getAttribute("data-mark"), "good");
  await page.locator("[data-clock-next]").click();
  return d;
}
async function playLevel(page, modeFor = () => "right") {
  const go = page.locator("[data-clock-overlay]:not([hidden]) [data-clock-go]");
  await go.waitFor();
  await go.click();
  const kinds = new Set(); let hidden = 0, n = 0;
  while ((await page.locator(".cg").getAttribute("data-phase")) !== "done") {
    const d = await solve(page, modeFor(n++));
    kinds.add(d.stage); if (d.hidden === "true") hidden++;
  }
  await page.locator(".cg-finish").waitFor();
  return { kinds, hidden, count: n };
}

try {
  { // 골든벨 모달: 레벨 1~10 전부, 그다음 끝없는 도전 1
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const errors = watch(page);
    await page.route("**/functions/v1/**", (r) => r.fulfill({ status: 401, contentType: "application/json", body: '{"error":"login_required"}' }));
    await page.goto(`${base}/golden-bell.html?student=CLOCK-QA&book=book-01`, { waitUntil: "networkidle" });
    const before = await page.evaluate(() => localStorage.getItem("fields-classic-golden-bell:CLOCK-QA"));
    await page.locator('.gold-hands-on [data-hand-open="turn-clock"]').click();
    assert.equal(await page.locator(".cg").getAttribute("data-renderer"), "webgl");
    // 레벨 1: 60% 미만이면 레벨 2가 열리지 않는다.
    let r = await playLevel(page, (i) => (i < 3 ? "twice" : "right"));
    assert.match(await page.locator("#cg-finish-title").innerText(), /조금만 더/u);
    assert.equal(await page.locator("[data-clock-next-level]").count(), 0);
    await page.locator(".cg-finish [data-clock-levels]").click();
    assert.equal(await page.locator('[data-clock-pick-level="2"]').isDisabled(), true, "통과 전에는 레벨 2 잠김");
    await page.locator("[data-clock-close]").click();
    assert.equal(await page.locator(".cg-finish").count(), 1, "지도를 닫으면 결과 화면으로");
    await page.locator("[data-clock-restart]").click();
    for (let level = 1; level <= 10; level++) {
      assert.equal(await page.locator(".cg").getAttribute("data-level"), String(level));
      r = await playLevel(page, (i) => (i === 1 ? "once" : "right"));
      assert.equal(r.count, levelSpec(level).count);
      assert.deepEqual([...r.kinds].sort(), Object.keys(levelSpec(level).mix).filter((k) => r.kinds.has(k)).sort());
      if (level === 8) assert.ok(r.hidden >= 5, "바늘 없이 레벨에서 숨김 문제가 나옴");
      assert.match(await page.locator("#cg-finish-title").innerText(), /통과/u);
      assert.match(await page.locator(".cg-unlock").innerText(), /새로 열림/u);
      if (level === 3) await page.locator(".cg-finish").screenshot({ path: "/tmp/clock-level-finish.png" }).catch(() => {});
      await page.locator("[data-clock-next-level]").click();
    }
    assert.equal(await page.locator(".cg").getAttribute("data-level"), "11");
    assert.match(await page.locator("[data-clock-level-name]").innerText(), /끝없는 도전 1/u);
    r = await playLevel(page);
    assert.equal(r.count, 12);
    assert.equal(await page.evaluate(() => localStorage.getItem("fields-classic-golden-bell:CLOCK-QA")), before, "게임은 학습 기록을 바꾸지 않는다");
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("fc-clock-game-progress")));
    assert.equal(saved.unlocked, 12);
    assert.equal(saved.stars["10"] >= 1, true);
    await page.locator("[data-clock-questions]").click();
    assert.equal(await page.locator(".gold-hands-on dialog[open]").count(), 0);
    assert.match(await page.locator("#stageSteps [data-phase='original']").getAttribute("class"), /active/u);
    // 새로 고쳐도 진행이 남고, 열린 가장 높은 정해진 레벨(10)부터 이어 한다.
    await page.reload({ waitUntil: "networkidle" });
    await page.locator('.gold-hands-on [data-hand-open="turn-clock"]').click();
    assert.equal(await page.locator(".cg").getAttribute("data-level"), "10");
    await page.locator("[data-clock-go]").click();
    await page.locator("[data-clock-levels]").click();
    assert.equal(await page.locator("[data-clock-pick-level]:not([disabled])").count(), 12);
    assert.deepEqual(errors, []);
    console.log("CLOCK_GAME_LEVELS_OK width=1440 levels=1..10+endless unlocked=12");
    await page.close();
  }
  { // 휴대폰 폭: 레벨 1~3, 가로 넘침 없음
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce", hasTouch: true });
    const errors = watch(page);
    await page.route("**/functions/v1/**", (r) => r.fulfill({ status: 401, contentType: "application/json", body: '{"error":"login_required"}' }));
    await page.goto(`${base}/golden-bell.html?student=CLOCK-QA&book=book-01`, { waitUntil: "networkidle" });
    await page.locator('.gold-hands-on [data-hand-open="turn-clock"]').click();
    for (let level = 1; level <= 3; level++) {
      await playLevel(page, (i) => (i === 2 ? "twice" : "right"));
      assert.equal(await page.evaluate(() => document.querySelector(".hand-modal").scrollWidth > innerWidth + 1), false, "가로 넘침");
      await page.locator("[data-clock-next-level]").click();
    }
    assert.deepEqual(errors, []);
    console.log("CLOCK_GAME_LEVELS_OK width=390 levels=1..3");
    await page.close();
  }
  for (const flat of [false, true]) { // 게임 QR 페이지: 끌기, 2D 대체, 다른 기능으로 못 나감
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: "reduce" });
    const errors = watch(page);
    if (flat) await page.addInitScript(() => { const get = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (type, ...rest) { return /webgl/u.test(type) ? null : get.call(this, type, ...rest); }; });
    await page.route("**/functions/v1/fields-game-link", (r) => r.fulfill({ contentType: "application/json", body: JSON.stringify({ activityId: "turn-clock", lessonId: "clock-turning", bookId: "book-01", expiresAt: "2027-10-03T00:00:00Z" }) }));
    await page.goto(`${base}/game.html#fcg1.turn-clock.1822000000.${"A".repeat(43)}`, { waitUntil: "networkidle" });
    const cg = page.locator(".cg");
    await cg.waitFor();
    assert.equal(await cg.getAttribute("data-renderer"), flat ? "flat" : "webgl");
    await page.locator("[data-clock-go]").click();
    // 레벨 1 첫 문제(원본): 3에서 시계 방향으로 반 바퀴. 바늘 끝을 3시에서 9시까지 끈다.
    const c = await page.evaluate(() => { const a = document.querySelector('[data-clock-number="12"]').getBoundingClientRect(), b = document.querySelector('[data-clock-number="6"]').getBoundingClientRect(); return { x: (a.left + b.left + a.width) / 2, y: (a.top + b.top + a.height) / 2, r: (b.top - a.top) / 2 }; });
    const at = (h) => [c.x + Math.sin(h * Math.PI / 6) * c.r * 0.8, c.y - Math.cos(h * Math.PI / 6) * c.r * 0.8];
    await page.mouse.move(...at(3)); await page.mouse.down();
    for (let h = 3; h <= 9; h += 0.5) await page.mouse.move(...at(h), { steps: 2 });
    await page.mouse.up();
    assert.equal(await page.locator("[data-clock-readout] strong").innerText(), "시계 방향으로 반 바퀴");
    await page.locator("[data-clock-check]").click();
    assert.equal(await cg.getAttribute("data-phase"), "correct");
    assert.equal(await page.locator("[data-clock-questions],button[data-hand-activity],a").count(), 0, "QR 게임에서는 다른 기능으로 못 나간다");
    assert.deepEqual(errors, []);
    console.log(`CLOCK_GAME_QR_OK renderer=${flat ? "flat" : "webgl"} drag=pass`);
    await page.close();
  }
} finally {
  await browser.close();
}
