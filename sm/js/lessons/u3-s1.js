// 3단원 미로 찾기 · 1차시 (원본 52~60쪽)
//  52 마법의 성 → 53 네모네모 미로 길 긋기 → 54 짧은 길(①·② 발자국 세기) → 55~57 「짧은 길을 찾아라!」 활동판 A·B(나 대 독쌤)
//  → 58 거울 반사 규칙 두 가지(움직이는 그림) → 59·60 거울의 방 빠져나가기
// 정답(원본 그림에서 계산): 54쪽 ① 11칸 · ② 7칸 → ② / 활동판 A ① 5 · ② 11 · ③ 13 → ① / 활동판 B ① 15 · ② 6 · ③ 11 → ②
import { gapMaze, mirrorMaze, tokenSvg, chestSvg, stepsOf } from "../maze.js?v=20261115b";
import { GAP } from "../maze-data.js?v=20261115b";
import { kid } from "../art.js?v=20261115b";

const josa = (w, a, b) => { const c = String(w).charCodeAt(String(w).length - 1) - 0xac00; return c >= 0 && c <= 11171 && c % 28 ? `${w}${a}` : `${w}${b}`; };
const COLORS = ["#ff5a5a", "#2f7de1", "#2fb36b"];

// 미로 아래 「처음부터」 단추와 발자국 수
// 미로 무대 모서리의 「처음부터」·발자국 — 아래 단추 줄을 비워 미로를 크게(원장 2026-11-13 「작아 그림이 너무」)
export function mazeDock(ctx, { onReset, chip = "" }) {
  ctx.dock.innerHTML = "";
  ctx.stage.querySelector(".mz-tools")?.remove();
  const box = document.createElement("div"); box.className = "mz-tools";
  box.innerHTML = `<span class="mz-chip" data-chip>${chip}</span><button class="sm-btn mz-reset" type="button" data-reset aria-label="처음부터">↺</button>`;
  ctx.stage.append(box);
  box.querySelector("[data-reset]").addEventListener("click", () => { ctx.fx.sound.tap(); onReset(); });
  return (t) => { const c = box.querySelector("[data-chip]"); if (c) c.innerHTML = t; };
}
// 길 긋기 한 번(끝까지 그릴 때까지)
export async function drawPath(ctx, maze, port, { who, color, say, countSteps = true } = {}) {
  let setChip = () => {};
  const d = maze.draw(port, {
    color, token: who ? tokenSvg(who, 48) : "",
    onStep: (p, kind) => { if (kind === "go") ctx.fx.sound.tap(); if (countSteps) setChip(`👣 ${stepsOf(p)}`); },
    onBlocked: (why) => { ctx.fx.sound.bad(); ctx.mistake(); ctx.guide.encourage(why); }
  });
  setChip = mazeDock(ctx, { onReset: () => d.reset(), chip: countSteps ? "👣 0" : "" });
  if (say) ctx.guide.say(say);
  const path = await d.finished;
  ctx.fx.sound.good(); ctx.fx.cheer(null);
  return { path, steps: stepsOf(path), drawer: d };
}
// 거울 미로 길 긋기
export async function drawMirror(ctx, maze, { who, say, color = "#ff4f8b", onStep } = {}) {
  const d = maze.draw({ color, token: who ? tokenSvg(who, 46) : "", onStep: (p, k) => { if (k === "go") ctx.fx.sound.tap(); onStep?.(p, k); },
    onBlocked: (why) => { ctx.fx.sound.bad(); ctx.mistake(); ctx.guide.encourage(why); } });
  mazeDock(ctx, { onReset: () => d.reset() });
  if (say) ctx.guide.say(say);
  const path = await d.finished;
  ctx.fx.sound.good(); ctx.fx.cheer(null);
  return path;
}
const stageBox = (ctx, cls = "") => { ctx.stage.innerHTML = `<div class="mz-wrap ${cls}"><div class="mz-host"></div></div>`; return ctx.stage.querySelector(".mz-host"); };

// ── 52쪽 마법의 성 ──
async function castle(ctx) {
  ctx.stage.innerHTML = `<div class="mz-castle"><div class="sky"><span class="st s1">⭐</span><span class="st s2">⭐</span><span class="st s3">⭐</span><span class="moon">🌙</span><span class="castle">🏰</span></div><div class="girl">${kid({ hair: "girl", hairColor: "#5a3a2a", shirt: "#5aa0f0", bottom: "#ffffff", size: 120 })}</div></div>`;
  await ctx.source("52");
  ctx.guide.say("예림이를 도와 미로를 빠져 나가 볼까요?");
  await ctx.next("미로로 가기", { icon: "🏰" });
}
// ── 53쪽 네모네모 미로 ──
async function p53(ctx) {
  await ctx.source("53", { read: false });
  const host = stageBox(ctx);
  const m = gapMaze(host, { ...GAP.p53, starts: [{ side: "left", k: 0, color: "#ff7a6b" }], exits: [{ side: "right", k: 4, color: "#ff7a6b" }] });
  await ctx.guide.say(ctx.page("53")?.text || "예림이가 미로를 빠져 나갈 수 있도록 알맞은 길을 그려 주세요.", { display: false });
  await drawPath(ctx, m, { side: "left", k: 0 }, { who: "girl", say: "화살표에서 손가락으로 흰 길을 따라 그어요. 다리가 있는 곳은 막혀 있어요!", countSteps: false });
  await ctx.guide.praise("예림이가 마법의 성을 빠져 나왔어요!");
  await ctx.next("다음");
}
// ── 54쪽 짧은 길 ──
async function p54(ctx) {
  await ctx.source("54");
  const host = stageBox(ctx);
  const starts = [{ side: "top", k: 1, label: "①", color: COLORS[0] }, { side: "top", k: 4, label: "②", color: COLORS[1] }];
  const m = gapMaze(host, { ...GAP.p54, starts, exits: [{ side: "bottom", k: 1, color: COLORS[0] }, { side: "bottom", k: 4, color: COLORS[1] }] });
  const steps = [];
  for (const [i, s] of starts.entries()) {
    const r = await drawPath(ctx, m, s, { who: "hamster", color: s.color, say: `${s.label}에서 출발해 빠져 나가 봐요. 발자국을 세어 줄게요.` });
    steps.push(r.steps);
    await ctx.guide.praise(`${s.label} 길은 발자국 ${r.steps}개!`);
  }
  const best = steps[0] < steps[1] ? "①" : "②";
  ctx.dock.innerHTML = `<div class="col"><div class="mz-compare">${starts.map((s, i) => `<span style="--c:${s.color}">${s.label} 👣 ${steps[i]}</span>`).join("")}</div><div class="sm-tray" data-c></div></div>`;
  ctx.guide.say("어느 길로 가야 더 빨리 빠져 나갈 수 있을까요?");
  await ctx.choose(starts.map((s) => ({ value: s.label, art: `<b style="font-size:40px;color:${s.color}">${s.label}</b>`, name: `${s.label} 길` })), {
    correct: best, host: ctx.dock.querySelector("[data-c]"), wrongSay: "발자국이 더 적은 길이 더 빨라요.", praise: `맞아요! ${best} 길이 발자국이 더 적어서 더 빨라요.` });
  await ctx.next("다음");
}
// ── 55~57쪽 「짧은 길을 찾아라!」 ──
async function shortGame(ctx) {
  await ctx.source("55");
  ctx.stage.innerHTML = `<div class="mz-intro"><div>${chestSvg(120)}</div><p>출발점 ①②③ 중에서 보물 상자까지 <b>가장 빠른 길</b>을 고르는 사람이 이겨요!</p></div>`;
  await ctx.guide.say("나와 독쌤이 출발점을 하나씩 골라요. 세 길을 다 그려 보고, 가장 빠른 길을 고른 사람이 이겨요!");
  await ctx.next("시작", { icon: "🏁" });
  let me = 0, doc = 0;
  for (const [bi, key] of ["A", "B"].entries()) {
    await ctx.source(bi ? "57" : "56", { read: false });
    const host = stageBox(ctx);
    const starts = key === "A" ? [{ side: "top", k: 1 }, { side: "right", k: 1 }, { side: "bottom", k: 3 }] : [{ side: "top", k: 5 }, { side: "right", k: 4 }, { side: "bottom", k: 1 }];
    starts.forEach((s, i) => { s.label = "①②③"[i]; s.color = COLORS[i]; });
    const target = key === "A" ? { node: [3, 0] } : { node: [6, 3] };
    const m = gapMaze(host, { ...GAP[key], starts, target, seed: bi * 5 });
    // ① 출발점 고르기
    ctx.dock.innerHTML = `<div class="sm-tray" data-c></div>`;
    ctx.guide.say(`활동판 ${key}! 보물까지 가장 빠를 것 같은 출발점을 골라요.`);
    const mine = await ctx.choose(starts.map((s) => ({ value: s.label, art: `<b style="font-size:40px;color:${s.color}">${s.label}</b>`, name: "출발" })), { host: ctx.dock.querySelector("[data-c]") });
    const rest = starts.map((s) => s.label).filter((l) => l !== mine);
    const docPick = rest[Math.floor(Math.random() * rest.length)];
    await ctx.guide.say(`나는 ${mine}, 독쌤은 ${docPick}! 이제 세 길을 모두 그려 봐요.`);
    // ② 세 길 모두 그리기(내가 고른 것부터)
    const order = [starts.find((s) => s.label === mine), ...starts.filter((s) => s.label !== mine)];
    const steps = {};
    for (const s of order) {
      const r = await drawPath(ctx, m, s, { who: s.label === mine ? "girl" : "bear", color: s.color, say: `${s.label}에서 보물 상자까지 그려요.` });
      steps[s.label] = r.steps;
      ctx.guide.say(`${s.label} 길은 발자국 ${r.steps}개!`);
      await ctx.wait(700);
    }
    // ③ 비교
    const best = Object.entries(steps).sort((a, b) => a[1] - b[1])[0][0];
    ctx.dock.innerHTML = `<div class="mz-compare">${starts.map((s) => `<span style="--c:${s.color}" class="${s.label === best ? "best" : ""}">${s.label} 👣 ${steps[s.label]}${s.label === mine ? " · 나" : s.label === docPick ? " · 독쌤" : ""}</span>`).join("")}</div>`;
    if (best === mine) { me++; ctx.fx.stamp("내가 이겼어요!"); ctx.fx.cheer(null, { big: true }); await ctx.guide.praise(`${best} 길이 가장 빨라요. 내가 고른 길이에요! 내가 이겼어요!`); }
    else if (best === docPick) { doc++; await ctx.guide.say(`${best} 길이 가장 빨라요. 이번엔 독쌤이 이겼어요!`); }
    else await ctx.guide.say(`${best} 길이 가장 빨라요. 둘 다 못 골랐어요!`);
    await ctx.wait(400);
  }
  ctx.stage.innerHTML = `<div class="mz-intro"><div>${chestSvg(100)}</div><p class="score">나 <b>${me}</b> : <b>${doc}</b> 독쌤</p></div>`;
  ctx.fx.sound.fanfare();
  await ctx.guide.praise(me > doc ? "내가 이겼어요! 가장 짧은 길을 잘 찾았어요." : me === doc ? "비겼어요! 발자국이 적은 길이 가장 빨라요." : "독쌤이 이겼어요. 다음엔 발자국을 먼저 세어 봐요!");
  await ctx.next("다음");
}
// ── 58쪽 거울 반사 규칙 ──
async function rules(ctx) {
  const pg = await ctx.source("58");
  const rulesTxt = pg?.rules || [];
  for (const [i, spec] of [{ nh: 2, nv: 3, mirrors: {}, start: { side: "left", k: 0 }, exit: { side: "right", k: 0 } },
    { nh: 2, nv: 3, mirrors: { "0,1": "\\" }, start: { side: "left", k: 0 }, exit: { side: "bottom", k: 1 } }].entries()) {
    if (rulesTxt[i]) ctx.setSource(`규칙 ${i + 1}. ${rulesTxt[i]}`);
    const host = stageBox(ctx, "small");
    const m = mirrorMaze(host, { ...spec, color: "#b9a6e6" });
    const d = m.draw({ token: tokenSvg("girl", 46) });
    ctx.dock.innerHTML = "";
    await ctx.guide.say(i ? "거울을 만나면 튕겨서 방향이 바뀌어요. 거울을 뚫고 갈 수는 없어요!" : "거울이 없는 방에서는 점선을 따라 똑바로 가요.");
    await d.auto(m.route(), 420);
    await ctx.wait(500);
    await ctx.next(i ? "알았어요" : "다음 규칙");
  }
}
// ── 59·60쪽 거울의 방 ──
const MIRROR59 = [
  { page: "59", nh: 2, nv: 2, mirrors: { "0,0": "\\" }, start: { side: "left", k: 0 }, exit: { side: "bottom", k: 0 }, who: "girl" },
  { page: "59", nh: 2, nv: 2, mirrors: { "1,1": "/" }, start: { side: "left", k: 1 }, exit: { side: "top", k: 1 }, who: "girl" },
  { page: "60", nh: 2, nv: 3, mirrors: { "0,2": "\\", "1,2": "/" }, start: { side: "left", k: 0 }, exit: { side: "left", k: 1 }, who: "girl" },
  { page: "60", nh: 2, nv: 3, mirrors: { "0,1": "/", "1,1": "/" }, start: { side: "left", k: 1 }, exit: { side: "right", k: 0 }, who: "girl" }
];
export async function mirrorRooms(ctx, list, color = "#4cc3c3") {
  let shown = "";
  for (const [i, spec] of list.entries()) {
    if (spec.page !== shown) { await ctx.source(spec.page, { read: !shown || spec.page !== shown }); shown = spec.page; }
    const host = stageBox(ctx);
    const m = mirrorMaze(host, { ...spec, color });
    await drawMirror(ctx, m, { who: spec.who, say: `(${(i % 2) + 1}) 화살표에서 출발해요. 거울을 만나면 꺾여요!` });
    await ctx.guide.praise("거울의 방을 빠져 나왔어요!");
    await ctx.next(i < list.length - 1 ? "다음 방" : "다음");
  }
}

export const LESSON = {
  title: "마법의 성 미로",
  subtitle: "네모네모 미로에서 짧은 길을 찾고, 거울의 방을 빠져 나가요",
  coverArt: "🏰",
  doneTitle: "미로 1차시 끝!",
  doneText: "발자국이 적은 길이 더 빨라요. 거울을 만나면 방향이 바뀌어요!",
  steps: [
    { page: "52쪽 · 커지는 생각", run: castle },
    { page: "53쪽", run: p53 },
    { page: "54쪽 · 쑥쑥 자라는 사고 1", run: p54 },
    { page: "55~57쪽 · 게임", run: shortGame },
    { page: "58쪽 · 쑥쑥 자라는 사고 2", run: rules },
    { page: "59·60쪽", run: (ctx) => mirrorRooms(ctx, MIRROR59) }
  ]
};
