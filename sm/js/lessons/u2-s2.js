// 2단원 무게 재기 · 2차시 (원본 38~43쪽) — 무게 비교하기(38·39) + 푸리수리 1~4번(40~43)
// 원본처럼 납작한 저울 그림(scale2d.js). 기울기·큐브 수는 원본 그림에서 옮겼다:
//   38 바나나 = 큐브 2, 수박 = 큐브 3(모두 수평) → 수박 / 39 닭 2·양 4(2×2)·오리 3 → 양·오리·닭
//   40 축구공=곰인형(수평) → 같습니다, 팽이(올라감) < 곰인형 → 다릅니다 / 41 수박 > 바나나, 하트 풍선 < 돌, 큐브 3 < 큐브 5
//   42 바나나가 올라감 → 오른쪽에는 더 무거운 수박 / 43 모자 < 비행기, 책 > 비행기
import { scale, cubeStack, thingAt, thingIcon, svgScene, ring } from "../scale2d.js?v=20261113k";

export const orderTap = async (ctx, items, { heavyFirst = true, slotsHost = ctx.dock, hint }) => {
  // 카드를 무거운(또는 가벼운) 것부터 차례로 누르면 아래 칸(□→□→□)에 들어간다
  const order = [...items].sort((a, b) => (heavyFirst ? b.w - a.w : a.w - b.w));
  slotsHost.innerHTML = `<div class="sm-ordrow">${order.map((_, i) => `${i ? '<span class="arr">➜</span>' : ""}<span class="slot" data-s="${i}"></span>`).join("")}</div><div class="sm-tray" data-cards>${items.map((it) => `<button class="sm-pick" type="button" data-k="${it.k}"><span class="art">${thingIcon(it.k, 60)}</span><span class="name">${it.name}</span></button>`).join("")}</div>`;
  let k = 0, wrong = 0;
  await new Promise((resolve) => {
    slotsHost.querySelector("[data-cards]").addEventListener("click", (e) => {
      const b = e.target.closest("[data-k]"); if (!b || b.disabled) return;
      if (b.dataset.k === order[k].k) {
        b.disabled = true; b.style.opacity = ".35";
        const sl = slotsHost.querySelector(`[data-s="${k}"]`); sl.innerHTML = thingIcon(order[k].k, 56); sl.classList.add("filled");
        ctx.fx.sound.pop(); ctx.fx.burstAt(sl, { power: 0.7 }); k++;
        if (k === order.length) resolve(); else ctx.guide.say("맞아요! 그다음은요?");
      } else {
        wrong++; ctx.mistake(); ctx.fx.sound.bad(); b.classList.remove("is-wrong"); void b.offsetWidth; b.classList.add("is-wrong");
        ctx.guide.encourage(wrong >= 2 && hint ? hint : "큐브를 세어 봐요. 큐브가 많을수록 무거워요.");
      }
    });
  });
  ctx.fx.cheer(null, { big: true });
};

// 38쪽 두 과일 비교
async function p38(ctx) {
  const pg = await ctx.source("38");
  ctx.stage.innerHTML = svgScene("0 0 980 300", scale({ x: 20, y: 150, w: 440, left: (cx, cy) => thingAt("banana", cx, cy, 90), right: (cx, cy) => cubeStack([2], cx, cy, 44) }) +
    scale({ x: 520, y: 150, w: 440, left: (cx, cy) => thingAt("watermelon", cx, cy, 110), right: (cx, cy) => cubeStack([3], cx, cy, 44) }) + `<g class="marks"></g>`);
  ctx.guide.say("두 저울 모두 나란해요. 큐브를 세어 보면 알 수 있어요!");
  ctx.dock.innerHTML = `<div class="col"><div class="sm-frame">${pg?.frame || "더 무거운 과일 :"} ( <span class="paren">🍌 , 🍉</span> )</div><div class="sm-tray" data-c></div></div>`;
  await ctx.choose([{ value: "banana", art: thingIcon("banana"), name: "바나나" }, { value: "watermelon", art: thingIcon("watermelon"), name: "수박" }],
    { correct: "watermelon", host: ctx.dock.querySelector("[data-c]"), wrongSay: "바나나는 큐브 2개, 수박은 큐브 몇 개일까요?", praise: "맞아요! 수박은 큐브 3개, 바나나는 큐브 2개라서 수박이 더 무거워요." });
  ctx.stage.querySelector(".marks").innerHTML = ring(520 + 79, 150 - 50, 80, 70);
  await ctx.next("다음");
}

// 39쪽 가장 무거운 동물부터
async function p39(ctx) {
  await ctx.source("39");
  ctx.stage.innerHTML = svgScene("0 0 980 470", scale({ x: 20, y: 160, w: 420, left: (cx, cy) => thingAt("rooster", cx, cy, 96), right: (cx, cy) => cubeStack([2], cx, cy, 42) }) +
    scale({ x: 540, y: 160, w: 420, left: (cx, cy) => thingAt("sheep", cx, cy, 120), right: (cx, cy) => cubeStack([2, 2], cx, cy, 42) }) +
    scale({ x: 280, y: 380, w: 420, left: (cx, cy) => thingAt("duck", cx, cy, 120), right: (cx, cy) => cubeStack([3], cx, cy, 42) }));
  ctx.guide.say("저울은 모두 나란해요. 큐브가 많은 동물부터 차례로 눌러요!");
  await orderTap(ctx, [{ k: "rooster", name: "닭", w: 2 }, { k: "sheep", name: "양", w: 4 }, { k: "duck", name: "오리", w: 3 }], { hint: "닭은 큐브 2개, 양은 4개, 오리는 3개예요." });
  await ctx.guide.praise("양, 오리, 닭 순서로 무거워요!");
  await ctx.next("다음");
}

// 40쪽 푸리수리 1 — 같습니다/다릅니다
async function p40(ctx) {
  const pg = await ctx.source("40");
  const parts = [
    { tilt: "level", l: "soccer", r: "teddy", ans: "same", frame: pg?.frames?.[0] || "축구공과 곰인형은 무게가 ( 같습니다 , 다릅니다 )." },
    { tilt: "right", l: "top", r: "teddy", ans: "diff", frame: pg?.frames?.[1] || "팽이와 곰인형은 무게가 ( 같습니다 , 다릅니다 )." }
  ];
  for (const [i, p] of parts.entries()) {
    ctx.stage.innerHTML = svgScene("0 0 600 260", `<text x="10" y="30" font-size="22" font-weight="800" fill="#4a5a78">(${i + 1})</text>` + scale({ x: 80, y: 140, w: 440, tilt: p.tilt, left: (cx, cy) => thingAt(p.l, cx, cy, 86), right: (cx, cy) => thingAt(p.r, cx, cy, 96) }));
    ctx.dock.innerHTML = `<div class="col"><div class="sm-frame">${p.frame}</div><div class="sm-tray" data-c></div></div>`;
    ctx.guide.say(p.tilt === "level" ? "저울이 나란해요. 무게는 어떨까요?" : "저울이 기울었어요. 무게는 어떨까요?");
    await ctx.choose([{ value: "same", art: "🟰", name: "같습니다" }, { value: "diff", art: "↕️", name: "다릅니다" }],
      { correct: p.ans, host: ctx.dock.querySelector("[data-c]"), wrongSay: "저울이 나란하면 같고, 기울면 달라요.", praise: p.ans === "same" ? "맞아요! 나란하니까 무게가 같아요." : "맞아요! 기울었으니까 무게가 달라요." });
    await ctx.wait(500);
  }
  await ctx.next("다음");
}

// 41쪽 푸리수리 2 — 더 무거운 쪽 ○
async function p41(ctx) {
  await ctx.source("41");
  const parts = [
    { tilt: "left", l: (cx, cy) => thingAt("watermelon", cx, cy, 110), r: (cx, cy) => thingAt("banana", cx, cy, 80), li: thingIcon("watermelon"), ri: thingIcon("banana"), ln: "수박", rn: "바나나" },
    { tilt: "right", l: (cx, cy) => thingAt("heart", cx, cy, 100), r: (cx, cy) => thingAt("rock", cx, cy, 64), li: thingIcon("heart"), ri: thingIcon("rock"), ln: "하트 풍선", rn: "돌" },
    { tilt: "right", l: (cx, cy) => cubeStack([3], cx, cy, 40), r: (cx, cy) => cubeStack([3, 2], cx, cy, 40), li: `<svg width="90" height="50" viewBox="-60 -45 120 50">${cubeStack([3], 0, 0, 30)}</svg>`, ri: `<svg width="90" height="70" viewBox="-60 -75 120 80">${cubeStack([3, 2], 0, 0, 30)}</svg>`, ln: "왼쪽 큐브", rn: "오른쪽 큐브" }
  ];
  for (const [i, p] of parts.entries()) {
    const W = 440, X = 80;
    ctx.stage.innerHTML = svgScene("0 0 600 280", `<text x="10" y="30" font-size="22" font-weight="800" fill="#4a5a78">(${i + 1})</text>` + scale({ x: X, y: 150, w: W, tilt: p.tilt, left: p.l, right: p.r }) + `<g class="marks"></g>`);
    ctx.guide.say("더 무거운 쪽을 눌러요. 아래로 내려간 쪽이 무거워요!");
    const ans = p.tilt === "left" ? "L" : "R";
    await ctx.choose([{ value: "L", art: p.li, name: p.ln }, { value: "R", art: p.ri, name: p.rn }], { correct: ans, wrongSay: "아래로 내려간 쪽을 찾아요.", praise: "맞아요!" });
    const pw = W * 0.36, cx = ans === "L" ? X + pw / 2 : X + W - pw / 2, cy = 150 + (ans === "L" ? 22 : 22) - 40;
    ctx.stage.querySelector(".marks").innerHTML = ring(cx, cy, 90, 70);
    await ctx.wait(600);
  }
  await ctx.next("다음");
}

// 42쪽 푸리수리 3 — 오른쪽에 놓일 것
async function p42(ctx) {
  const pg = await ctx.source("42");
  ctx.stage.innerHTML = svgScene("0 0 600 280", scale({ x: 80, y: 150, w: 440, tilt: "right", left: (cx, cy) => thingAt("banana", cx, cy, 86), right: (cx, cy) => `<text x="${cx}" y="${cy - 14}" font-size="60" font-weight="800" text-anchor="middle" fill="#4a5a78">?</text>` }));
  ctx.guide.say("바나나 쪽이 위로 올라갔어요. 오른쪽에는 바나나보다 무거운 것이 있어요!");
  const opt = [["strawberry", "딸기"], ["cherry", "체리"], ["balloon", "풍선"], ["watermelon", "수박"]];
  await ctx.choose(opt.map(([k, n], i) => ({ value: k, art: thingIcon(k), name: `${"①②③④"[i]} ${pg?.options?.[i] || n}` })),
    { correct: "watermelon", wrongSay: "그것은 바나나보다 가벼워요. 오른쪽이 내려가려면 더 무거워야 해요.", praise: "맞아요! 수박이 바나나보다 무거워서 오른쪽이 내려가요." });
  await ctx.next("다음");
}

// 43쪽 푸리수리 4 — 무거운 물건·가벼운 물건
async function p43(ctx) {
  const pg = await ctx.source("43");
  const tagH = pg?.labels?.heavy || "무거운 물건 :", tagL = pg?.labels?.light || "가벼운 물건 :";
  const parts = [{ tilt: "right", l: "cap", r: "plane", ln: "모자", rn: "비행기" }, { tilt: "left", l: "book", r: "plane", ln: "책", rn: "비행기" }];
  for (const [i, p] of parts.entries()) {
    ctx.stage.innerHTML = svgScene("0 0 600 260", `<text x="10" y="30" font-size="22" font-weight="800" fill="#4a5a78">(${i + 1})</text>` + scale({ x: 80, y: 140, w: 440, tilt: p.tilt, left: (cx, cy) => thingAt(p.l, cx, cy, 80), right: (cx, cy) => thingAt(p.r, cx, cy, 80) }));
    ctx.dock.innerHTML = `<div class="sm-bins"><div class="sm-bin" data-bin="heavy"><span class="tag">${tagH}</span><span class="slot"></span></div><div class="sm-bin" data-bin="light"><span class="tag">${tagL}</span><span class="slot"></span></div></div><div class="sm-tray" data-c></div>`;
    const heavy = p.tilt === "left" ? p.l : p.r, light = p.tilt === "left" ? p.r : p.l;
    const ch = [{ value: p.l, art: thingIcon(p.l), name: p.ln }, { value: p.r, art: thingIcon(p.r), name: p.rn }];
    const host = ctx.dock.querySelector("[data-c]"), bH = ctx.dock.querySelector('[data-bin="heavy"]'), bL = ctx.dock.querySelector('[data-bin="light"]');
    bH.classList.add("active"); ctx.guide.say("무거운 물건을 눌러요.");
    await ctx.choose(ch, { correct: heavy, host, wrongSay: "아래로 내려간 쪽이 무거워요." });
    bH.classList.remove("active"); bH.querySelector(".slot").innerHTML = thingIcon(heavy, 70); bH.querySelector(".slot").classList.add("filled");
    bL.classList.add("active"); ctx.guide.say("가벼운 물건은요?");
    await ctx.choose(ch, { correct: light, host, wrongSay: "위로 올라간 쪽이 가벼워요." });
    bL.classList.remove("active"); bL.querySelector(".slot").innerHTML = thingIcon(light, 70); bL.querySelector(".slot").classList.add("filled");
    ctx.fx.cheer(null);
    await ctx.guide.praise("맞아요! 내려간 쪽이 무겁고, 올라간 쪽이 가벼워요.");
  }
  await ctx.next("끝내기", { icon: "🏁" });
}

export const LESSON = {
  title: "무게 비교하기",
  subtitle: "큐브로 잰 무게를 비교해요",
  coverArt: "⚖️",
  doneTitle: "무게 재기 2차시 끝!",
  doneText: "같은 큐브로 재면 큐브가 많을수록 무거워요.",
  steps: [
    { page: "38쪽", run: p38 },
    { page: "39쪽", run: p39 },
    { page: "40쪽 · 푸리수리 1", run: p40 },
    { page: "41쪽 · 푸리수리 2", run: p41 },
    { page: "42쪽 · 푸리수리 3", run: p42 },
    { page: "43쪽 · 푸리수리 4", run: p43 }
  ]
};
