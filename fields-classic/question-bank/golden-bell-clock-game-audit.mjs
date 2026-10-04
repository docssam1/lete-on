// 「시계 바늘 돌리기」 네 단계 게임 검사 (2026-10-04)
//
// 1) 규칙: 정답을 화면과 다른 식으로 다시 계산해 맞춘다. 원본 체험 3도전이 1단계에 그대로 있는지,
//    거꾸로 단계 보기에 같은 곳에 닿는 보기가 정확히 하나인지, 분수 표기가 없는지, 숫자 조사.
// 2) 화면: 골든벨 1권 모달에서 13문제를 끝까지 푼다. 한 번 틀린 뒤 맞히기, 두 번 틀려 정답 보기를
//    섞는다. 끝나면 「연결 문제 풀기」로 원본 문항 단계로 넘어가는지 본다.
// 3) 게임 QR 페이지(game.html): 바늘을 끌어서 돌리기, WebGL이 없을 때 2D로 그리기, 탭을 오가도
//    WebGL 캔버스가 쌓이지 않기.
//
// 실행: 저장소 루트에서 python3 -m http.server 8797 를 띄운 뒤
//   node fields-classic/question-bank/golden-bell-clock-game-audit.mjs          # 전부
//   node fields-classic/question-bank/golden-bell-clock-game-audit.mjs --model  # 규칙만(브라우저 없음)
// playwright-core가 필요하다(다른 곳에 있으면 FIELDS_PLAYWRIGHT=<그 index.mjs 경로>). 브라우저 경로는 FIELDS_CHROMIUM.

import assert from "node:assert/strict";
import { HANDS_ON_ACTIVITIES } from "./golden-bell-hands-on-models.js";
import { buildRun, reverseChoices, checkChoice, checkTurn, missionText, hintText, successText, turnAmountText, josa, seededRandom, STAGES } from "./golden-bell-clock-game-model.js";

// 화면 코드와 따로 쓴 계산: 시계 방향 반의 반 바퀴 = 숫자 3칸.
const independent = (start, ops) => { let v = start; for (const op of ops) v = ((v + op * 3 - 1) % 12 + 12) % 12 + 1; return v; };
const NO_FRACTION = /¼|½|\d\s*\/\s*\d|undefined|NaN/u;

for (let seed = 1; seed <= 400; seed++) {
  const run = buildRun(seed);
  assert.equal(run.length, 13);
  assert.deepEqual(run.map((p) => p.stage), ["turn", "turn", "turn", "predict", "predict", "predict", "predict", "reverse", "reverse", "reverse", "chain", "chain", "chain"]);
  assert.deepEqual(run.slice(0, 3).map((p) => [p.start, p.ops[0]]), HANDS_ON_ACTIVITIES["turn-clock"].rounds.map((r) => [r.start, r.turns]), "1단계는 원본 체험 3도전 그대로");
  for (const p of run) {
    assert.equal(p.answer, independent(p.start, p.ops), `seed ${seed} #${p.index}`);
    assert.ok(p.ops.every((op) => [1, 2, 4].includes(Math.abs(op))), "원본이 쓰는 세 가지 양만");
    for (const text of [missionText(p), hintText(p), successText(p, p.ops[0])]) assert.doesNotMatch(text, NO_FRACTION, text);
    if (p.stage === "reverse") {
      assert.equal(new Set(p.choices).size, 4);
      assert.equal(p.choices.filter((op) => checkChoice(p, op)).length, 1, `seed ${seed}: 같은 곳에 닿는 보기는 하나`);
      assert.ok(p.choices.includes(p.ops[0]));
    }
    if (p.stage === "turn") {
      assert.equal(checkTurn(p, p.ops[0]), true);
      assert.equal(checkTurn(p, p.ops[0] + 4 * Math.sign(p.ops[0])), false, "도착 숫자가 같아도 한 바퀴 더 돌면 틀림");
    }
  }
  const starts = (stage) => run.filter((p) => p.stage === stage).map((p) => p.start);
  for (const stage of ["predict", "reverse", "chain"]) assert.equal(new Set(starts(stage)).size, starts(stage).length, "한 단계 안에서 출발점이 겹치지 않음");
}
// 반 바퀴 거꾸로 문제에는 반대 방향 반 바퀴 보기를 넣지 않는다(둘 다 정답이 되므로).
for (const op of [2, -2]) assert.ok(!reverseChoices(op, seededRandom(3)).includes(-op));
// 반 바퀴 문제에서 반대 방향으로 돌려도 같은 곳이라는 원본의 말
assert.match(successText({ stage: "reverse", start: 5, ops: [2], answer: 11 }, 2), /시계 반대 방향으로 반 바퀴 돌려도 똑같이 11/u);
assert.equal(turnAmountText(6), "시계 방향으로 한 바퀴와 반 바퀴");
assert.equal(turnAmountText(-1), "시계 반대 방향으로 반의 반 바퀴");
assert.deepEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => josa(n, "을")), ["1을", "2를", "3을", "4를", "5를", "6을", "7을", "8을", "9를", "10을", "11을", "12를"]);
assert.deepEqual([1, 3, 9, 12].map((n) => josa(n, "으로")), ["1로", "3으로", "9로", "12로"]);
assert.deepEqual([2, 6].map((n) => `${josa(n, "이")}야`), ["2야", "6이야"]);
assert.equal(STAGES.length, 4);
console.log("CLOCK_GAME_MODEL_OK seeds=400 problems=5200");
if (process.argv.includes("--model")) process.exit(0);

const { chromium } = await import(process.env.FIELDS_PLAYWRIGHT || "playwright-core");
const base = `${process.env.FIELDS_BASE_URL || "http://127.0.0.1:8797"}/fields-classic/question-bank`;
const browser = await chromium.launch({ executablePath: process.env.FIELDS_CHROMIUM || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
const watch = (page) => { const errors = []; page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => m.type() === "error" && errors.push(m.text())); return errors; };
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce", hasTouch: width < 500 });
    const errors = watch(page);
    await page.route("**/functions/v1/**", (r) => r.fulfill({ status: 401, contentType: "application/json", body: '{"error":"login_required"}' }));
    await page.goto(`${base}/golden-bell.html?student=CLOCK-QA&book=book-01`, { waitUntil: "networkidle" });
    const before = await page.evaluate(() => localStorage.getItem("fields-classic-golden-bell:CLOCK-QA"));
    await page.locator('.gold-hands-on [data-hand-open="turn-clock"]').click();
    const cg = page.locator(".cg");
    assert.equal(await cg.getAttribute("data-renderer"), "webgl");
    // 탭을 오가도 진행이 남고 WebGL 캔버스가 쌓이지 않는다.
    await page.locator("[data-clock-go]").click();
    await page.locator('[data-clock-turn="1"]').click();
    await page.locator('[data-hand-activity="mirror-tiles"]').click();
    await page.locator('[data-hand-activity="turn-clock"]').click();
    assert.equal(await page.locator(".cg-canvas").count(), 1);
    assert.equal(await cg.getAttribute("data-problem"), "0");
    let wrongOnce = 0, revealed = 0;
    for (let n = 0; n < 13; n++) {
      const go = page.locator("[data-clock-overlay]:not([hidden]) [data-clock-go]");
      if (await go.count()) await go.click();
      const d = await cg.evaluate((el) => ({ ...el.dataset }));
      assert.equal(d.problem, String(n));
      const start = Number(d.start), ops = d.ops.split(",").map(Number), answer = independent(start, ops);
      const mission = await page.locator("[data-clock-mission]").innerText();
      assert.match(mission, new RegExp(`^${start}에서`, "u"));
      assert.doesNotMatch(mission, NO_FRACTION);
      if (d.stage === "turn") {
        const dir = Math.sign(ops[0]);
        if (n === 1) { // 반대로 한 번 돌리고 확인 → 힌트, 별 하나 깎임
          await page.locator(`[data-clock-turn="${-dir}"]`).click();
          await page.locator("[data-clock-check]").click();
          assert.equal(await cg.getAttribute("data-phase"), "wrong");
          assert.match(await page.locator("[data-clock-say]").innerText(), /방향/u);
          await page.locator("[data-clock-reset]").click();
          wrongOnce++;
        }
        for (let i = 0; i < Math.abs(ops[0]); i++) await page.locator(`[data-clock-turn="${dir}"]:not([disabled])`).click();
        assert.equal(await page.locator("[data-clock-readout] strong").innerText(), turnAmountText(ops[0]));
        await page.locator("[data-clock-check]").click();
      } else if (d.stage === "reverse") {
        const cards = await page.locator("[data-clock-choice]").evaluateAll((els) => els.map((e) => Number(e.dataset.clockChoice)));
        assert.equal(cards.filter((op) => independent(start, [op]) === answer).length, 1);
        if (n === 8) { await page.locator(`[data-clock-choice="${cards.find((op) => op !== ops[0])}"]`).click(); wrongOnce++; }
        await page.locator(`[data-clock-choice="${ops[0]}"]`).click();
      } else {
        const wrongs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((v) => v !== answer);
        if (n === 5 || n === 11) { // 두 번 틀리면 바늘이 돌며 정답을 보여 준다
          await page.locator(`[data-clock-number="${wrongs[0]}"]`).click();
          assert.equal(await cg.getAttribute("data-phase"), "wrong");
          assert.equal(await page.locator(`[data-clock-number="${wrongs[0]}"]`).getAttribute("data-mark"), "bad");
          await page.locator(`[data-clock-number="${wrongs[1]}"]`).click();
          await page.locator("[data-clock-next]").waitFor();
          assert.equal(await cg.getAttribute("data-phase"), "revealed");
          assert.equal(await page.locator(`[data-clock-number="${answer}"]`).getAttribute("data-mark"), "good");
          revealed++;
        } else {
          await page.locator(`[data-clock-number="${answer}"]`).click();
        }
      }
      await page.locator("[data-clock-next]").waitFor();
      if (!["revealed"].includes(await cg.getAttribute("data-phase"))) assert.equal(await cg.getAttribute("data-phase"), "correct");
      assert.doesNotMatch(await page.locator(".cg").innerText(), NO_FRACTION);
      assert.equal(await page.evaluate(() => document.querySelector(".hand-modal").scrollWidth > innerWidth + 1), false, `${width}: 가로 넘침`);
      await page.locator("[data-clock-next]").click();
    }
    await page.locator(".cg-finish").waitFor();
    const expected = 13 * 2 - wrongOnce - revealed * 2;
    assert.equal(await page.locator("[data-clock-stars]").innerText(), String(expected));
    assert.match(await page.locator("#cg-finish-title").innerText(), new RegExp(`별 ${expected}개`, "u"));
    assert.equal(await page.evaluate(() => localStorage.getItem("fields-classic-golden-bell:CLOCK-QA")), before, "게임은 학습 기록을 바꾸지 않는다");
    await page.locator("[data-clock-questions]").click();
    assert.equal(await page.locator(".gold-hands-on dialog[open]").count(), 0);
    assert.match(await page.locator("#stageSteps [data-phase='original']").getAttribute("class"), /active/u);
    assert.deepEqual(errors, []);
    console.log(`CLOCK_GAME_PLAY_OK width=${width} stars=${expected}`);
    await page.close();
  }
  for (const flat of [false, true]) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: "reduce" });
    const errors = watch(page);
    if (flat) await page.addInitScript(() => { const get = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (type, ...rest) { return /webgl/u.test(type) ? null : get.call(this, type, ...rest); }; });
    await page.route("**/functions/v1/fields-game-link", (r) => r.fulfill({ contentType: "application/json", body: JSON.stringify({ activityId: "turn-clock", lessonId: "clock-turning", bookId: "book-01", expiresAt: "2027-10-03T00:00:00Z" }) }));
    await page.goto(`${base}/game.html#fcg1.turn-clock.1822000000.${"A".repeat(43)}`, { waitUntil: "networkidle" });
    const cg = page.locator(".cg");
    await cg.waitFor();
    assert.equal(await cg.getAttribute("data-renderer"), flat ? "flat" : "webgl");
    await page.locator("[data-clock-go]").click();
    // 3에서 시계 방향으로 반 바퀴: 바늘 끝을 3시에서 9시까지 끈다.
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
