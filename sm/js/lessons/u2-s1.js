// 2단원 무게 재기 · 1차시 (원본 30~37쪽)
//   30 커지는 생각 「시소 타기」 → 31 「저울 놀이」(게임) → 32 무거운/가벼운 물건 → 34 아빠곰과 아기곰(수평)
//   → 35 「가장 가벼운 블록에 1 쓰기」(원장 지도법 2026-11-12) → 35 공·원뿔은 큐브 몇 개 → 36 아빠곰 무게 재기
// 33쪽(병아리 반대편에 올 것)은 정답이 하나로 정해지지 않아 정답지 확인 전까지 넣지 않는다(설계서 7절).
// 37쪽 활동판(실물 무게 재기)은 원본에 수치가 없어 원장이 가상 무게를 정한 뒤 넣는다.
// 그림 수치: 32쪽 기울기(컵>모자, 가방>컵), 35쪽 큐브(공 7 · 원뿔 5), 36쪽 예(아빠곰 = 큐브 12)는 원본 그림·글에서 옮겼다.
import { createBalance, bear, cube, solid, thing } from "../balance3d.js?v=20261112b";

import { BEAR_COLORS } from "../balance3d.js?v=20261112b";
// 색깔 곰돌이 그림(단추용) — 3D 곰과 같은 색
export const bearIcon = (color, size = 72) => { const c = BEAR_COLORS[color] || color; return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true"><g fill="${c}" stroke="rgba(0,0,0,.18)" stroke-width="3"><circle cx="30" cy="20" r="11"/><circle cx="70" cy="20" r="11"/><ellipse cx="50" cy="72" rx="28" ry="25"/><circle cx="50" cy="36" r="23"/><ellipse cx="22" cy="64" rx="9" ry="13"/><ellipse cx="78" cy="64" rx="9" ry="13"/></g><circle cx="42" cy="33" r="3.5" fill="#1b1b1b"/><circle cx="58" cy="33" r="3.5" fill="#1b1b1b"/><ellipse cx="50" cy="43" rx="6" ry="4" fill="#1b1b1b"/><ellipse cx="44" cy="25" rx="8" ry="5" fill="#fff" opacity=".35"/></svg>`; };
const SAY = {
  heavyHint: "아래로 내려간 쪽이 더 무거워요. 내려간 쪽을 찾아봐요!"
};

function balanceIn(ctx, type = "balance", onTap) {
  const b = createBalance(ctx.stage, { type, onTap: (p) => onTap?.(p) });
  ctx.onDispose(() => b.dispose());
  return b;
}
const sideName = (side) => (side === "left" ? "왼쪽" : "오른쪽");

// ── 30쪽 시소 타기 ───────────────────────────────────────
async function seesaw(ctx) {
  const b = balanceIn(ctx, "seesaw");
  b.lock(true);
  b.put("left", thing("🐯", 20, "호돌이"), { animate: false });
  b.put("right", thing("🐻", 24, "곰돌이"), { animate: false });
  ctx.guide.say("호돌이와 곰돌이는 키도 같고 덩치도 비슷해요. 누가 더 무거울까요? 시소를 타 봐요!");
  await ctx.next("시소 타기", { icon: "🎢" });
  b.lock(false);
  ctx.fx.sound.drop();
  await b.settle();
  ctx.guide.say("시소가 움직였어요! 더 무거운 친구를 눌러 보세요.");
  await ctx.choose(
    [{ value: "tiger", art: "🐯", name: "호돌이" }, { value: "bear", art: "🐻", name: "곰돌이" }],
    { correct: "bear", wrongSay: "시소가 어느 쪽으로 내려갔나 볼까요?", hint: () => { b.label("right", "⬇ 내려갔어요"); ctx.guide.encourage("곰돌이 쪽이 아래로 내려갔어요. 내려간 쪽이 더 무거워요."); },
      praise: "맞아요! 아래로 내려간 쪽이 더 무거워요." }
  );
  await ctx.next("다음");
}

// ── 31쪽 저울 놀이(게임): 화살판 두 번 → 곰돌이 2개, 무거운 쪽이 이긴다. 먼저 기울 쪽을 예상한다(활동 5번) ──
const SECTORS = [
  { size: "papa", color: "green", label: "아빠곰" },
  { size: "mama", color: "blue", label: "엄마곰" },
  { size: "baby", color: "yellow", label: "아기곰" }
];
function spinner(host) {
  host.innerHTML = `<div class="sm-spin-wrap" aria-hidden="true"><div class="sm-spin">${SECTORS.map((s, k) => {
    const a = (k * 120 + 60) * Math.PI / 180, x = Math.sin(a) * 58, y = -Math.cos(a) * 58;
    return `<span style="transform:translate(${x.toFixed(1)}px,${y.toFixed(1)}px)"><b>${bearIcon("#ffffff", s.size === "papa" ? 44 : s.size === "mama" ? 36 : 28)}</b>${s.label}</span>`;
  }).join("")}</div><i class="sm-spin-hub"></i></div>`;
  const wheel = host.querySelector(".sm-spin");
  let turn = 0;
  return {
    spin() {
      const k = Math.floor(Math.random() * 3), theta = k * 120 + 60 + (Math.random() * 70 - 35);
      const now = ((turn % 360) + 360) % 360, want = (360 - theta) % 360;
      turn += 360 * 5 + ((want - now + 360) % 360);
      wheel.style.transform = `rotate(${turn}deg)`;
      const ms = matchMedia("(prefers-reduced-motion: reduce)").matches ? 50 : 2450;
      return new Promise((r) => setTimeout(() => r(SECTORS[k]), ms));
    }
  };
}
async function balanceGame(ctx) {
  const b = balanceIn(ctx);
  const ROUNDS = 3;
  let mine = 0, his = 0;
  const overlay = document.createElement("div");
  overlay.className = "sm-overlay";
  ctx.stage.append(overlay);
  const lblL = b.label("left", "나"), lblR = b.label("right", "독쌤");
  void lblL; void lblR;
  await ctx.guide.say("저울 놀이를 해요! 화살판을 두 번 돌려서 나온 곰돌이를 저울에 올려요. 더 무거운 쪽이 이겨요!");
  for (let round = 1; round <= ROUNDS; round++) {
    b.clear(); b.lock(true);
    overlay.innerHTML = `<div data-spin></div><div class="sm-score"><span>나 ${"⭐".repeat(mine) || "·"}</span><span>독쌤 ${"⭐".repeat(his) || "·"}</span></div>`;
    ctx.dock.innerHTML = `<div data-act class="sm-tray"></div>`;
    const sp = spinner(overlay.querySelector("[data-spin]"));
    const act = ctx.dock.querySelector("[data-act]");
    const press = (label, icon) => new Promise((resolve) => {
      act.innerHTML = `<button class="sm-btn go big pulse" type="button"><span class="ico">${icon}</span> ${label}</button>`;
      act.querySelector("button").addEventListener("click", (e) => { e.currentTarget.disabled = true; ctx.fx.sound.tap(); resolve(); }, { once: true });
    });
    ctx.guide.say(`${round}번째 판! 화살판을 돌려요.`);
    for (let k = 0; k < 2; k++) {
      await press(k ? "한 번 더 돌리기" : "돌리기", "🌀");
      act.innerHTML = "";
      const got = await sp.spin();
      b.put("left", bear(got.size, got.color)); ctx.fx.sound.drop();
      ctx.guide.say(`${got.label}이 나왔어요!`);
      await ctx.wait(700);
    }
    await ctx.guide.say("이번엔 독쌤 차례예요!");
    for (let k = 0; k < 2; k++) {
      const got = await sp.spin();
      b.put("right", bear(got.size, got.color === "yellow" ? "red" : got.color)); ctx.fx.sound.drop();
      await ctx.wait(500);
    }
    ctx.guide.think("저울을 풀기 전에 맞혀 봐요. 어느 쪽이 아래로 내려갈까요?");
    const guess = await ctx.choose([
      { value: "left", art: "⬅️", name: "내 쪽" },
      { value: "level", art: "⚖️", name: "똑같아요" },
      { value: "right", art: "➡️", name: "독쌤 쪽" }
    ], { host: act });
    b.lock(false); ctx.fx.sound.drop();
    const s = await b.settle();
    const heavy = s.heavy;
    if (guess === heavy) { ctx.fx.cheer(act); await ctx.guide.praise("예상이 맞았어요!"); }
    else { ctx.fx.sound.bad(); await ctx.guide.encourage(heavy === "level" ? "앗, 저울이 나란해졌어요. 무게가 같아요!" : `앗, ${heavy === "left" ? "내" : "독쌤"} 쪽이 내려갔어요.`); }
    if (heavy === "left") { mine++; ctx.fx.burst(innerWidth * 0.3, innerHeight * 0.4, { power: 1.4 }); await ctx.guide.praise("내 곰돌이가 더 무거워요. 내가 이겼어요!"); }
    else if (heavy === "right") { his++; await ctx.guide.say("독쌤 곰돌이가 더 무거워요. 독쌤이 이겼어요!"); }
    else await ctx.guide.say("무게가 같아서 비겼어요!");
  }
  ctx.dock.innerHTML = ""; overlay.remove();
  const msg = mine > his ? `내가 ${mine}번 이겼어요! 대단해요!` : mine === his ? `${mine}대 ${his}, 비겼어요!` : `독쌤이 ${his}번 이겼어요. 다음엔 꼭 이겨 봐요!`;
  ctx.fx.cheer(null, { big: mine >= his });
  await ctx.guide.praise(msg);
  await ctx.next("다음");
}

// ── 32쪽 무거운 물건·가벼운 물건 ─────────────────────────
async function heavyLight(ctx) {
  const scenes = [
    { left: { it: thing("☕", 3, "컵"), v: "cup" }, right: { it: thing("🧢", 2, "모자"), v: "cap" }, heavy: "cup", light: "cap" },
    { left: { it: thing("💼", 6, "가방"), v: "bag" }, right: { it: thing("☕", 3, "컵"), v: "cup" }, heavy: "bag", light: "cup" }
  ];
  for (const [i, sc] of scenes.entries()) {
    ctx.stage.innerHTML = "";
    const b = createBalance(ctx.stage);
    b.put("left", sc.left.it, { animate: false }); b.put("right", sc.right.it, { animate: false });
    ctx.dock.innerHTML = `<div class="sm-bins"><div class="sm-bin" data-bin="heavy"><span class="tag">무거운 물건</span><span class="slot"></span></div><div class="sm-bin" data-bin="light"><span class="tag">가벼운 물건</span><span class="slot"></span></div></div><div class="sm-tray" data-choices></div>`;
    const host = ctx.dock.querySelector("[data-choices]"), binH = ctx.dock.querySelector('[data-bin="heavy"]'), binL = ctx.dock.querySelector('[data-bin="light"]');
    const choices = [sc.left, sc.right].map((x) => ({ value: x.v, art: x.it.char, name: x.it.name }));
    const of = (v) => [sc.left, sc.right].find((x) => x.v === v).it;
    sc.heavy = { v: sc.heavy, art: of(sc.heavy).char, name: of(sc.heavy).name };
    sc.light = { v: sc.light, art: of(sc.light).char, name: of(sc.light).name };
    binH.classList.add("active");
    ctx.guide.say(i === 0 ? "양팔 저울에 물건을 올려 놓았어요. 무거운 물건은 무엇일까요?" : "이번에는요? 무거운 물건을 눌러요.");
    await ctx.choose(choices, { correct: sc.heavy.v, host, wrongSay: "저울이 어느 쪽으로 내려갔는지 볼까요?", hint: () => { b.label("left", "⬇ 내려갔어요"); ctx.guide.encourage(SAY.heavyHint); } });
    binH.classList.remove("active"); binH.querySelector(".slot").textContent = sc.heavy.art; binH.querySelector(".slot").classList.add("filled");
    binL.classList.add("active");
    ctx.guide.say("맞아요! 그럼 가벼운 물건은요?");
    await ctx.choose(choices, { correct: sc.light.v, host, wrongSay: "위로 올라간 쪽이 가벼워요." });
    binL.classList.remove("active"); binL.querySelector(".slot").textContent = sc.light.art; binL.querySelector(".slot").classList.add("filled");
    await ctx.guide.praise(`잘했어요! ${sc.heavy.name}이 ${sc.light.name}보다 무거워요.`);
    await ctx.wait(500);
    b.dispose();
  }
  await ctx.next("다음");
}

// ── 34쪽 아빠곰 1 = 아기곰 3 (수평) ─────────────────────
async function papaAndBabies(ctx) {
  const b = balanceIn(ctx);
  b.put("left", bear("papa", "green"), { animate: false });
  ctx.dock.innerHTML = `<div class="sm-tray">${["red", "yellow", "blue"].map((c) => `<button class="sm-pick" type="button" data-c="${c}" aria-label="아기곰 올리기"><span class="art">${bearIcon(c)}</span><span class="name">아기곰</span></button>`).join("")}</div>`;
  await ctx.guide.say("왼쪽에 아빠곰 1마리가 있어요. 아기곰을 하나씩 올려서 저울을 나란하게 만들어 봐요!");
  let seq = 0;
  await new Promise((resolve) => {
    ctx.dock.addEventListener("click", async (event) => {
      const btn = event.target.closest("[data-c]"); if (!btn || btn.disabled) return;
      btn.disabled = true; btn.style.opacity = ".35";
      b.put("right", bear("baby", btn.dataset.c)); ctx.fx.sound.drop();
      const my = ++seq; const s = await b.settle();
      if (my !== seq) return;
      if (s.heavy === "level") { resolve(); return; }
      ctx.guide.encourage(b.items("right").length === 1 ? "아직 아빠곰 쪽이 내려가 있어요. 하나 더!" : "조금만 더! 아기곰을 또 올려요.");
    });
  });
  ctx.fx.sound.level(); ctx.fx.cheer(null, { big: true });
  await ctx.guide.praise("와! 두 접시가 나란해졌어요. 두 저울이 나란한 것을 수평이라고 해요.");
  ctx.guide.say("아빠곰 1마리와 아기곰 3마리는 무게가 어떨까요?");
  await ctx.choose(
    [{ value: "same", art: "🟰", name: "같아요" }, { value: "diff", art: "↕️", name: "달라요" }],
    { correct: "same", wrongSay: "저울이 나란하면 무게가 어떨까요?", praise: "맞아요! 저울이 수평이면 무게가 같아요." }
  );
  await ctx.next("다음");
}

// ── 35쪽 시작: 가장 가벼운 블록에 1 쓰기(원장 지도법 2026-11-12) ─────────
//   아기곰과 1g 큐브를 저울에 올려 더 가벼운 쪽을 찾고 → 가장 가벼운 블록에 1을 쓴다.
async function writeOne(ctx) {
  let written = false, done = null;
  const finished = new Promise((r) => { done = r; });
  const b = balanceIn(ctx, "balance", (p) => { if (ready && p.item?.kind === "cube") write(); });
  let ready = false;
  b.put("left", bear("baby", "red"), { animate: false });
  b.put("right", cube(false), { animate: false });
  ctx.guide.say("아기곰과 큐브를 저울에 올렸어요. 어느 쪽이 더 가벼울까요?");
  await ctx.choose(
    [{ value: "bear", art: bearIcon("red"), name: "아기곰" }, { value: "cube", art: '<span class="sm-cube-ico" style="width:70px;height:70px;font-size:0">1</span>', name: "큐브" }],
    { correct: "cube", wrongSay: "위로 올라간 쪽이 가벼워요.", praise: "맞아요! 큐브가 가장 가벼워요." }
  );
  async function write() {
    if (written) return; written = true;
    b.showOnes(true); ctx.fx.sound.pop();
    const p = b.point("right"); ctx.fx.burst(p.x, p.y - 30, { power: 1.6 });
    ctx.dock.innerHTML = `<span class="sm-cube-ico" style="width:110px;height:110px;font-size:70px;border-radius:22px;animation:sm-star-in .8s cubic-bezier(.3,1.6,.5,1)">1</span>`;
    await ctx.guide.praise("잘했어요! 이 큐브는 1이에요. 이제 큐브가 몇 개인지 세면 무게를 알 수 있어요.");
    done();
  }
  ready = true;
  ctx.dock.innerHTML = `<button class="sm-btn go big pulse" type="button"><span class="ico">✏️</span> 큐브에 1 쓰기</button>`;
  ctx.dock.querySelector("button").addEventListener("click", write, { once: true });
  ctx.guide.say("가장 가벼운 블록에는 1을 써요! 큐브를 눌러 보세요.");
  await finished;
  await ctx.next("다음");
}

// ── 큐브로 무게 재기(35쪽 공·원뿔, 36쪽 아빠곰) ────────────
async function measure(ctx, { item, art, name, answer, max, intro }) {
  const b = balanceIn(ctx);
  b.showOnes(true);
  b.put("left", item, { animate: false });
  ctx.dock.innerHTML = `<div class="sm-tray">
      <button class="sm-btn go big" type="button" data-add><span class="sm-cube-ico">1</span> 큐브 올리기</button>
      <button class="sm-btn big" type="button" data-sub aria-label="큐브 하나 빼기"><span class="ico">➖</span> 빼기</button></div>`;
  ctx.guide.say(intro);
  await new Promise((resolve) => {
    let seq = 0;   // 빨리 여러 번 눌러도 모두 받는다. 마지막 누름 뒤 저울이 멈췄을 때만 판단
    const onClick = async (event) => {
      const add = event.target.closest("[data-add]"), sub = event.target.closest("[data-sub]");
      if (!add && !sub) return;
      if (sub && !b.items("right").length) return;
      if (add) { b.put("right", cube(true)); ctx.fx.sound.drop(); } else { b.take("right"); ctx.fx.sound.tap(); }
      const my = ++seq; const s = await b.settle();
      if (my !== seq) return;
      if (s.heavy === "level") { ctx.dock.removeEventListener("click", onClick); ctx.dock.querySelectorAll("button").forEach((x) => { x.disabled = true; }); resolve(); }
      else if (s.heavy === "right") ctx.guide.encourage("앗, 큐브 쪽이 내려갔어요. 하나 빼 볼까요?");
    };
    ctx.dock.addEventListener("click", onClick);
  });
  ctx.fx.sound.level(); ctx.fx.cheer(null, { big: true });
  b.focus(true);
  await ctx.guide.praise("수평이 되었어요! 이제 큐브를 세어 봐요.");
  ctx.guide.say(`${name}의 무게는 큐브 몇 개의 무게와 같을까요?`);
  await ctx.number(answer, {
    max, before: `<span style="font-size:44px" aria-hidden="true">${art}</span> 큐브`, after: "개",
    hint: async () => {
      await ctx.guide.encourage("같이 세어 봐요!");
      const n = b.items("right").length;
      for (let i = 0; i < n; i++) { b.pulse("right", i); ctx.fx.sound.tap(); ctx.guide.say(String(i + 1)); await ctx.wait(650); }
      await ctx.guide.say(`모두 ${n}개예요. 숫자를 눌러 봐요.`);
    }
  });
  await ctx.guide.praise(`맞아요! ${name}의 무게는 큐브 ${answer}개의 무게와 같아요.`);
}
async function ballAndCone(ctx) {
  await measure(ctx, { item: solid("sphere", 7, "공"), art: "🟡", name: "공", answer: 7, max: 10, intro: "공과 무게가 같아지도록 큐브를 하나씩 올려 봐요. 저울이 나란해지면 성공!" });
  ctx.dispose(); ctx.reset("35쪽");
  await measure(ctx, { item: solid("cone", 5, "원뿔"), art: "🔺", name: "원뿔", answer: 5, max: 10, intro: "이번엔 원뿔이에요. 큐브를 올려서 저울을 나란하게 만들어요!" });
  await ctx.next("다음");
}
async function papaWeight(ctx) {
  await measure(ctx, { item: bear("papa", "green"), art: "🧸", name: "아빠곰", answer: 12, max: 15, intro: "아빠곰의 무게를 큐브로 재어 봐요. 큐브를 하나씩 올려서 수평을 만들어요!" });
  await ctx.next("끝내기", { icon: "🏁" });
}

export const LESSON = {
  title: "누가 더 무거울까?",
  subtitle: "시소와 저울로 무게를 비교해요",
  coverArt: "⚖️",
  doneTitle: "무게 재기 1차시 끝!",
  doneText: "무거운 쪽은 아래로, 같으면 수평! 가장 가벼운 블록은 1이에요.",
  steps: [
    { page: "30쪽", run: seesaw },
    { page: "31쪽 · 게임", run: balanceGame },
    { page: "32쪽", run: heavyLight },
    { page: "34쪽", run: papaAndBabies },
    { page: "35쪽", run: writeOne },
    { page: "35쪽", run: ballAndCone },
    { page: "36쪽", run: papaWeight }
  ]
};
