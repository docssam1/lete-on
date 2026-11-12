// 3단원 미로 찾기 · 2차시 (원본 61~74쪽)
//  61 사탕 먹기 예 → 62~65 「사탕 먹기」 활동판 A~D(먼저 몇 개 먹을지 예상 → 길 긋기 → 먹은 사탕 세기)
//  → 66~73 푸리수리 1~8 → 74 「아빠곰을 찾아라!」(2단원 저울 재사용)
// 정답(원본 그림에서 계산): 61 (위) 2 · (아래) 2 / 활동판 A 2 · B 3 · C 4 · D 4 / 68쪽 ② / 69쪽 소이 / 71 (1) 2 · (2) 3 / 72쪽 3 / 73쪽 4
import { gapMaze, mirrorMaze, lineMaze, tokenSvg, candySvg, stepsOf } from "../maze.js?v=20261113q";
import { GAP, LINE66 } from "../maze-data.js?v=20261113q";
import { drawPath, drawMirror, mirrorRooms, mazeDock } from "./u3-s1.js?v=20261113q";
import { createBalance, picture, BEARS } from "../balance3d.js?v=20261113q";

const stageBox = (ctx) => { ctx.stage.innerHTML = `<div class="mz-wrap"><div class="mz-host"></div></div>`; return ctx.stage.querySelector(".mz-host"); };
const COLORS = ["#ff5a5a", "#2f7de1"];

// 사탕 미로 한 판: (예상) → 길 긋기(사탕을 먹으며) → 먹은 수 세기
async function candyRun(ctx, spec, { color, predict = false, title = "" } = {}) {
  const host = stageBox(ctx);
  const m = mirrorMaze(host, { ...spec, color });
  const eatenOf = (path) => (spec.candies || []).filter((k) => path.includes(k));
  const answer = eatenOf(m.route()).length;
  let guess = null;
  if (predict) {
    ctx.dock.innerHTML = `<div class="col"><div class="sm-frame">${title} 사탕을 몇 개 먹을 것 같아요?</div><div class="sm-pad">${Array.from({ length: 6 }, (_, i) => `<button class="sm-btn" type="button" data-g="${i}">${i}</button>`).join("")}</div></div>`;
    ctx.guide.say("길을 긋기 전에 먼저 예상해 봐요. 사탕을 몇 개 먹을까요?");
    guess = await new Promise((r) => ctx.dock.addEventListener("click", (e) => { const b = e.target.closest("[data-g]"); if (b) r(Number(b.dataset.g)); }));
    ctx.fx.sound.pop();
  }
  const show = (path) => { const eat = new Set(eatenOf(path)); for (const [k, g] of m.candyEls) g.classList.toggle("eaten", eat.has(k)); };
  await drawMirror(ctx, m, { who: spec.who, color: "#ff4f8b", say: "화살표에서 출발해요. 지나가는 길의 사탕을 먹어요!", onStep: (p, k) => { show(p); if (k === "go" && spec.candies?.includes(p[p.length - 1])) ctx.fx.sound.pop(); } });
  ctx.guide.say("먹은 사탕은 몇 개일까요? 세어 봐요.");
  await ctx.number(answer, { max: 8, before: `<span style="display:inline-flex">${candySvg(0, 30)}</span>`, after: "개", hint: () => ctx.guide.encourage("길 위에서 반짝이는 사탕을 하나씩 세어 봐요.") });
  if (predict) {
    if (guess === answer) { ctx.fx.stamp("예상 적중!"); await ctx.guide.praise(`예상이 딱 맞았어요! 사탕 ${answer}개!`); }
    else await ctx.guide.say(`예상은 ${guess}개, 실제로는 ${answer}개 먹었어요.`);
  } else await ctx.guide.praise(`사탕을 ${answer}개 먹었어요!`);
  return answer;
}

// ── 61쪽 사탕 먹기 ──
const P61 = [
  { nh: 2, nv: 2, mirrors: { "0,1": "\\" }, start: { side: "left", k: 0 }, exit: { side: "bottom", k: 1 }, candies: ["0,0", "1,0", "1,1"], who: "bear" },
  { nh: 2, nv: 3, mirrors: { "0,1": "\\", "1,1": "\\" }, start: { side: "left", k: 0 }, exit: { side: "right", k: 1 }, candies: ["0,0", "0,2", "1,0", "1,2"], who: "bear" }
];
async function p61(ctx) {
  await ctx.source("61");
  for (const [i, spec] of P61.entries()) { await candyRun(ctx, spec, { color: "#f7b24a" }); await ctx.next(i ? "다음" : "다음 미로"); }
}
// ── 62~65쪽 「사탕 먹기」 활동판 A~D ──
const BOARDS = [
  { page: "62", label: "A", nh: 3, nv: 3, mirrors: { "0,0": "/", "1,1": "\\" }, start: { side: "left", k: 1 }, exit: { side: "bottom", k: 1 }, candies: ["0,2", "1,0", "2,0", "2,1", "2,2"], who: "rabbit" },
  { page: "63", label: "B", nh: 3, nv: 3, mirrors: { "1,1": "\\", "2,0": "\\" }, start: { side: "top", k: 0 }, exit: { side: "right", k: 2 }, candies: ["0,0", "0,1", "0,2", "2,1", "2,2"], who: "tiger" },
  { page: "64", label: "C", nh: 4, nv: 4, mirrors: { "1,3": "\\", "2,0": "/", "2,2": "/", "3,2": "\\" }, start: { side: "top", k: 2 }, exit: { side: "bottom", k: 0 }, candies: ["0,0", "0,2", "1,0", "1,2", "2,1", "3,0", "3,1", "3,3"], who: "pig" },
  { page: "65", label: "D", nh: 4, nv: 4, mirrors: { "1,2": "\\", "3,0": "\\", "3,3": "/" }, start: { side: "top", k: 0 }, exit: { side: "top", k: 3 }, candies: ["0,1", "0,2", "1,3", "2,0", "2,1", "2,2", "2,3", "3,1"], who: "bear" }
];
async function candyGame(ctx) {
  let total = 0;
  for (const b of BOARDS) {
    await ctx.source(b.page, { read: b.page === "62" });
    total += await candyRun(ctx, b, { color: "#c9d84a", predict: true, title: `활동판 ${b.label}:` });
    await ctx.next(b.label === "D" ? "다음" : "다음 활동판");
  }
  ctx.dock.innerHTML = "";
  ctx.fx.sound.fanfare();
  await ctx.guide.praise(`활동판 네 개에서 사탕을 모두 ${total}개 먹었어요!`);
}
// ── 66쪽 선 미로 ──
async function p66(ctx) {
  await ctx.source("66");
  const host = stageBox(ctx);
  const m = lineMaze(host, LINE66, { token: tokenSvg("mouse", 44), goalArt: `<text x="22" y="34" font-size="40" text-anchor="middle">🧀</text>`,
    onBlocked: () => { ctx.fx.sound.bad(); ctx.guide.encourage("벽은 지나갈 수 없어요. 다른 길로 가 봐요!"); } });
  mazeDock(ctx, { onReset: () => m.reset() });
  ctx.guide.say("생쥐를 손가락으로 끌어 길을 그려요. 끝에서 이어서 그을 수 있어요!");
  await m.finished;
  ctx.fx.sound.good(); ctx.fx.cheer(null, { big: true });
  await ctx.guide.praise("생쥐가 치즈를 먹었어요!");
  await ctx.next("다음");
}
// ── 67쪽 네모네모 미로 ──
async function p67(ctx) {
  await ctx.source("67");
  const m = gapMaze(stageBox(ctx), { ...GAP.p67, starts: [{ side: "top", k: 2, color: "#ff7a6b" }], exits: [{ side: "bottom", k: 4, color: "#ff7a6b" }], seed: 2 });
  await drawPath(ctx, m, { side: "top", k: 2 }, { who: "hamster", say: "흰 길을 따라 팬돌이를 아래 화살표까지 데려가요.", countSteps: false });
  await ctx.guide.praise("팬돌이가 빠져 나왔어요!");
  await ctx.next("다음");
}
// 두 출발점 비교(68·69쪽)
async function race(ctx, { page, key, starts, exits = [], target = null, whos, question, names, seed = 0 }) {
  await ctx.source(page);
  const m = gapMaze(stageBox(ctx), { ...GAP[key], starts, exits, target, seed });
  const steps = [];
  for (const [i, s] of starts.entries()) {
    const r = await drawPath(ctx, m, s, { who: whos[i], color: s.color, say: `${names[i]} 길을 그려 봐요.` });
    steps.push(r.steps); await ctx.guide.praise(`${names[i]} 길은 발자국 ${r.steps}개!`);
  }
  const best = steps[0] < steps[1] ? 0 : 1;
  ctx.dock.innerHTML = `<div class="col"><div class="mz-compare">${starts.map((s, i) => `<span style="--c:${s.color}">${names[i]} 👣 ${steps[i]}</span>`).join("")}</div><div class="sm-tray" data-c></div></div>`;
  ctx.guide.say(question);
  await ctx.choose(starts.map((s, i) => ({ value: String(i), art: s.label ? `<b style="font-size:40px;color:${s.color}">${s.label}</b>` : tokenSvg(whos[i], 56), name: names[i] })), {
    correct: String(best), host: ctx.dock.querySelector("[data-c]"), wrongSay: "발자국이 더 적은 쪽이 더 빨라요.", praise: `맞아요! ${names[best]} 쪽이 발자국이 더 적어요.` });
  await ctx.next("다음");
}
const p68 = (ctx) => race(ctx, { page: "68", key: "p68", seed: 4, whos: ["sheep", "sheep"], names: ["①", "②"], question: "어떤 길로 가야 더 빨리 빠져 나갈 수 있을까요?",
  starts: [{ side: "top", k: 1, label: "①", color: COLORS[0] }, { side: "top", k: 3, label: "②", color: COLORS[1] }],
  exits: [{ side: "bottom", k: 1, color: COLORS[0] }, { side: "bottom", k: 3, color: COLORS[1] }] });
const p69 = (ctx) => race(ctx, { page: "69", key: "p69", seed: 6, whos: ["soi", "jumyeong"], names: ["소이", "주명"], question: "누가 더 빨리 보물을 찾으러 갈 수 있을까요?",
  starts: [{ side: "top", k: 1, color: "#ff7a6b" }, { side: "right", k: 1, color: "#2f7de1" }], target: { node: [2, 3] } });
// ── 70쪽 거울의 방 · 71~73쪽 사탕 ──
const P70 = [
  { page: "70", nh: 2, nv: 2, mirrors: { "0,1": "\\" }, start: { side: "left", k: 0 }, exit: { side: "bottom", k: 1 }, who: "girl" },
  { page: "70", nh: 2, nv: 3, mirrors: { "0,2": "\\", "1,2": "\\" }, start: { side: "left", k: 0 }, exit: { side: "right", k: 1 }, who: "girl" }
];
const P71 = [
  { nh: 2, nv: 3, mirrors: { "0,0": "\\" }, start: { side: "top", k: 0 }, exit: { side: "right", k: 0 }, candies: ["0,1", "0,2", "1,0", "1,1", "1,2"], who: "bear" },
  { nh: 3, nv: 3, mirrors: { "1,0": "\\", "1,2": "\\" }, start: { side: "top", k: 0 }, exit: { side: "bottom", k: 2 }, candies: ["0,0", "0,1", "0,2", "1,1", "2,0", "2,1", "2,2"], who: "bear" }
];
async function p71(ctx) { await ctx.source("71"); for (const [i, s] of P71.entries()) { await candyRun(ctx, s, { color: "#f7b24a" }); await ctx.next(i ? "다음" : "다음 미로"); } }
async function p72(ctx) {
  await ctx.source("72");
  await candyRun(ctx, { nh: 4, nv: 4, mirrors: { "0,1": "/", "1,0": "/", "1,2": "/" }, start: { side: "top", k: 2 }, exit: { side: "bottom", k: 0 }, candies: ["0,2", "1,3", "2,0", "2,1", "2,2", "2,3", "3,0"], who: "rabbit" }, { color: "#c9d84a" });
  await ctx.next("다음");
}
async function p73(ctx) {
  await ctx.source("73");
  await candyRun(ctx, { nh: 4, nv: 4, mirrors: { "0,1": "/", "0,3": "/", "2,0": "\\", "2,2": "\\", "2,3": "\\" }, start: { side: "top", k: 3 }, exit: { side: "bottom", k: 1 }, candies: ["0,0", "0,2", "1,0", "1,1", "2,1", "3,1", "3,3"], who: "dog" }, { color: "#b5d65a" });
  await ctx.next("다음");
}

// ── 74쪽 「아빠곰을 찾아라!」 — 종이컵 3개(아빠·엄마·아기곰), 독쌤이 저울에 올려 비교 ──
const cupSvg = (n) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M14 14 L24 92 Q50 98 76 92 L86 14Z" fill="#fff" stroke="#555" stroke-width="3"/><ellipse cx="50" cy="14" rx="36" ry="9" fill="#f2f2f2" stroke="#555" stroke-width="3"/><text x="50" y="66" font-size="40" font-weight="700" text-anchor="middle" fill="#333" font-family="sans-serif">${n}</text></svg>`;
const BEAR_NAME = { papa: "아빠곰", mama: "엄마곰", baby: "아기곰" };
async function findPapa(ctx) {
  await ctx.source("74");
  await ctx.guide.say("독쌤이 종이컵 1, 2, 3에 아빠곰, 엄마곰, 아기곰을 몰래 하나씩 넣었어요. 저울을 보고 아빠곰이 든 컵을 찾아요!");
  let got = 0; const ROUNDS = 3;
  for (let round = 1; round <= ROUNDS; round++) {
    const sizes = ["papa", "mama", "baby"].sort(() => Math.random() - 0.5);
    const w = (n) => BEARS[sizes[n - 1]].w;
    const cup = (n) => picture(cupSvg(n), w(n), `${n}번 컵`, 1.15);
    ctx.stage.innerHTML = "";
    const b = createBalance(ctx.stage, { type: "balance" });
    ctx.onDispose(() => b.dispose());
    const weigh = async (x, y) => {
      b.clear(); b.lock(true);
      b.put("left", cup(x), { animate: false }); b.put("right", cup(y), { animate: false });
      await ctx.wait(500); b.lock(false); ctx.fx.sound.drop(); await Promise.race([b.settle(), ctx.wait(2500)]);   // 느린 기기에서도 멈추지 않게
      const heavy = w(x) > w(y) ? x : y;
      await ctx.guide.say(`${x}번 컵과 ${y}번 컵! ${heavy}번 컵 쪽이 내려갔어요.`);
      return heavy;
    };
    ctx.dock.innerHTML = `<div class="sm-cg-score"><span>${round} / ${ROUNDS}번째</span><span>곰돌이 <b>${got}</b>개</span></div>`;
    const h1 = await weigh(1, 2);
    await ctx.wait(600);
    const other = 3;
    await weigh(h1, other);
    ctx.dock.innerHTML = `<div class="col"><div class="sm-frame">아빠곰이 들어 있는 컵은?</div><div class="sm-tray" data-c></div></div>`;
    ctx.guide.say("두 번 저울에 올려 봤어요. 아빠곰은 몇 번 컵에 들어 있을까요?");
    const papaCup = [1, 2, 3].find((n) => sizes[n - 1] === "papa");
    const pick = Number(await ctx.choose([1, 2, 3].map((n) => ({ value: String(n), art: `<span style="display:inline-block;width:60px;height:60px">${cupSvg(n).replace("<svg ", '<svg width="60" height="60" ')}</span>`, name: `${n}번 컵` })), { host: ctx.dock.querySelector("[data-c]") }));
    const reveal = [1, 2, 3].map((n) => `${n}번 ${BEAR_NAME[sizes[n - 1]]}`).join(" · ");
    if (pick === papaCup) { got++; ctx.fx.stamp("곰돌이 1개!"); ctx.fx.cheer(null, { big: true }); await ctx.guide.praise(`맞아요! ${papaCup}번 컵에 아빠곰이 있어요. (${reveal})`); }
    else { ctx.fx.sound.bad(); ctx.mistake(); await ctx.guide.encourage(`아빠곰은 ${papaCup}번 컵이에요. 두 번 다 내려간 컵이 가장 무거워요. (${reveal})`); }
    b.dispose();
    await ctx.next(round < ROUNDS ? "다음 판" : "결과 보기", { icon: round < ROUNDS ? "▶" : "🏁" });
  }
  ctx.fx.sound.fanfare();
  await ctx.guide.praise(`곰돌이를 ${got}개 모았어요! 저울에서 계속 내려가는 컵이 가장 무거워요.`);
  await ctx.next("끝내기", { icon: "🏁" });
}

export const LESSON = {
  title: "거울 미로와 사탕",
  subtitle: "거울 미로에서 사탕을 먹고, 미로 문제를 풀고, 아빠곰을 찾아요",
  coverArt: "🍬",
  doneTitle: "미로 찾기 단원 끝!",
  doneText: "짧은 길은 발자국으로, 거울에서는 꺾이는 방향으로! 저울로 아빠곰도 찾았어요.",
  steps: [
    { page: "61쪽 · 쑥쑥 자라는 사고 3", run: p61 },
    { page: "62~65쪽 · 게임", run: candyGame },
    { page: "66쪽 · 푸리수리 1", run: p66 },
    { page: "67쪽 · 푸리수리 2", run: p67 },
    { page: "68쪽 · 푸리수리 3", run: p68 },
    { page: "69쪽 · 푸리수리 4", run: p69 },
    { page: "70쪽 · 푸리수리 5", run: (ctx) => mirrorRooms(ctx, P70, "#a99be0") },
    { page: "71쪽 · 푸리수리 6", run: p71 },
    { page: "72쪽 · 푸리수리 7", run: p72 },
    { page: "73쪽 · 푸리수리 8", run: p73 },
    { page: "74쪽 · 창의력 Game", run: findPapa }
  ]
};
