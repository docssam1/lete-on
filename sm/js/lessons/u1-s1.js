// 1단원 길이 재기 · 1차시 (원본 8~13쪽)
//   8 커지는 생각 「리본의 길이」 → 9 막대 계단 → 10 갈색보다 긴/보라색보다 짧은 막대 → 11 가장 긴 막대 ○·가장 작은 동물 △
//   → 12 숫자 1과 3 완성 → 13 「숫자 만들기」(게임, 활동지 A1-3-1)
// 지문은 화면 위 칸에 원본 그대로(ctx.source). 그림 수치는 원본 그림에서 칸을 세어 옮겼다:
//   10쪽 갈색 8·보라 4, 11쪽 초록 6·보라 4·갈색 8, 동물 키 소 3·오리 4·양 2칸, 12쪽 「1」(흰1·보라4, 아래 3칸 빔)·「3」(연두3·보라4·빨강2, 가운데 2칸 빔)
//   13쪽 활동지 「7과 4」·「3과 6」 칸 모양(각 5칸×7줄).
// 8쪽 질문(어떻게 알 수 있을까요?)은 열린 질문 — 사이트에서는 「리본을 풀어 끝을 맞추어 대 보기」를 보여 준다. 어느 쪽이 더 긴지는 원본에 없어 민석이 쪽을 길게 정했다.
// 13쪽 게임: 원본은 두 팀. 사이트는 나 대 독쌤, 둘 다 「7과 4」(칸 수를 같게). 막대는 가운데 더미(1~5칸 각 5개)에서 찾아 집는다.
import { createRodStage, RODS, rodIcon } from "../rods3d.js?v=20261113v";
import { person, animal, animalAt, bow } from "../art.js?v=20261113v";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
function rods(ctx, opts) {
  const r = createRodStage(ctx.stage, opts);
  ctx.onDispose(() => r?.dispose());
  return r;
}
// 막대 고르기 단추(길이 그림). lens: [1..10]
// 원장 2026-11-12 「퀴즈네르 막대 보기 순서 바꿔야지」: 짧은 것부터 차례로 늘어놓지 않고 섞어서 보인다.
function shuffled(list) { const a = [...list]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } if (a.every((x, i) => i === 0 || x > a[i - 1])) a.reverse(); return a; }
function rodTray(host, lens, { unit = 13, keepOrder = false } = {}) {
  host.innerHTML = `<div class="sm-rodtray">${(keepOrder ? lens : shuffled(lens)).map((n) => `<button class="sm-rodbtn" type="button" data-len="${n}" aria-label="${RODS[n].name} 막대">${rodIcon(n, unit)}</button>`).join("")}</div>`;
  return host.querySelector(".sm-rodtray");
}
// 더미에서 막대 하나를 누를 때까지 기다린다(onPile → 여기로)
function pileWaiter() {
  let resolver = null;
  return { onPile: (item) => { const r = resolver; resolver = null; r?.(item); }, next: () => new Promise((res) => { resolver = res; }) };
}
const waitTap = (el, sel) => new Promise((resolve) => {
  const on = (e) => { const b = e.target.closest(sel); if (!b || b.disabled) return; el.removeEventListener("click", on); resolve(b); };
  el.addEventListener("click", on);
});

// ── 8쪽 리본의 길이 ─────────────────────────────────────
async function ribbon(ctx) {
  const pg = ctx.page("8");
  const names = pg?.names || ["민수", "민지", "민석"];
  // 사람은 노란 이모지 대신 코드로 그린 아이 그림(art.js). 리본은 원본처럼 고리 크기는 같고 늘어진 끈 길이가 다르게(art.js bow).
  // 끈 그림은 리본을 풀 때 넣는다(그 전에는 자리를 차지하지 않게 — 작은 화면에서 아이 그림을 크게)
  const stringsHtml = `
      <svg class="strings" viewBox="0 0 900 120" opacity="0" aria-hidden="true">
        <defs><linearGradient id="rb" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ff6b7a"/><stop offset="1" stop-color="#d81f3c"/></linearGradient></defs>
        <line x1="160" x2="160" y1="6" y2="114" stroke="#1d2b44" stroke-width="3" stroke-dasharray="8 6"/>
        <text x="145" y="44" font-size="26" font-weight="800" text-anchor="end" fill="#1d2b44">${esc(names[1])}</text><rect class="s1" x="160" y="24" width="0" height="24" rx="12" fill="url(#rb)"/>
        <text x="145" y="96" font-size="26" font-weight="800" text-anchor="end" fill="#1d2b44">${esc(names[2])}</text><rect class="s2" x="160" y="76" width="0" height="24" rx="12" fill="url(#rb)"/>
      </svg>
`;
  ctx.stage.innerHTML = `
    <div class="sm-ribbon">
      <div class="kids">
        <figure class="k k0"><div class="talk">${esc(pg?.bubbles?.[0] || "누가 더 많이 썼어?")}</div>${person(names[0], 118)}<figcaption>${esc(names[0])}</figcaption></figure>
        <figure class="k k1"><span class="bow">${bow({ tail: 52, spread: 0.7, width: 160 })}</span>${person(names[1], 108)}<figcaption>${esc(names[1])}</figcaption></figure>
        <figure class="k k2"><span class="bow">${bow({ tail: 92, spread: 0.95, width: 160 })}</span>${person(names[2], 108)}<figcaption>${esc(names[2])}</figcaption></figure>
      </div>
    </div>`;
  await ctx.source("8");
  ctx.guide.say(pg?.question || "누가 만든 리본이 더 긴지 어떻게 알 수 있을까요?", { mood: "think" });
  await ctx.next("리본을 풀어 보기", { icon: "✂️" });
  const box = ctx.stage.querySelector(".sm-ribbon");
  box.querySelectorAll(".bow").forEach((b) => b.animate?.([{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(.2) rotate(40deg)" }], { duration: 500, fill: "forwards" }));
  // 풀린 리본·말풍선은 사라진 뒤 자리를 비운다(작은 화면에서 끈 그림을 크게)
  setTimeout(() => box.querySelectorAll(".bow, .talk").forEach((n) => n.remove()), ctx.fx.reduced() ? 0 : 520);
  box.insertAdjacentHTML("beforeend", stringsHtml);
  const strings = box.querySelector(".strings"), svg = strings;
  strings.animate?.([{ opacity: 0 }, { opacity: 1 }], { duration: 400, fill: "forwards" }); strings.setAttribute("opacity", "1");
  const grow = (el, w) => { el.animate?.([{ width: "0px" }, { width: `${w}px` }], { duration: ctx.fx.reduced() ? 1 : 1100, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" }); el.setAttribute("width", w); };
  grow(svg.querySelector(".s1"), 520); grow(svg.querySelector(".s2"), 640);
  ctx.fx.sound.pop();
  await ctx.guide.say("끈을 풀어서 한쪽 끝을 맞추어 나란히 놓아 보았어요.");
  ctx.guide.say("누가 끈을 더 많이 썼나요?");
  await ctx.choose([{ value: "a", art: person(names[1], 64), name: names[1] }, { value: "b", art: person(names[2], 64), name: names[2] }],
    { correct: "b", wrongSay: "끝을 맞춘 쪽에서 누구 끈이 더 멀리 가나요?", praise: `맞아요! 끝을 맞추어 대 보면 ${names[2]}이 끈을 더 많이 썼어요.` });
  await ctx.next("다음");
}

// ── 9쪽 막대 계단 — 원본: 왼쪽 계단 칸, 오른쪽 아래 아이와 말풍선. 막대는 오른쪽 「더미」(여러 개)에서 찾는다 ──
async function staircase(ctx) {
  const cells = []; for (let r = 0; r < 10; r++) for (let c = 0; c <= r; c++) cells.push([r, c]);
  const P = pileWaiter();
  const R = rods(ctx, { boards: [{ id: "s", cols: 10, rows: 10, cells, dashed: false }], pile: { x: 12.5, z: 0, w: 12, d: 10 }, extra: [{ x: 3, z: 6.6, w: 8, d: 2.2 }], onPile: P.onPile });
  R?.fillPile([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5]);
  const pg = await ctx.source("9");
  R?.pin(`<div class="sm-talkpin">${esc(pg?.bubbles?.[0] || "퀴즈네르 막대는 색깔별로 길이가 달라.")}</div>`, 3, 6.6, 8);
  ctx.guide.say("오른쪽 막대 더미에서 빛나는 칸에 꼭 맞는 막대를 찾아 눌러요!");
  ctx.dock.innerHTML = `<p class="sm-docknote">👉 막대 더미에서 막대를 눌러요</p>`;
  for (let row = 0; row < 10; row++) {
    const need = row + 1;
    const off = R?.glow("s", Array.from({ length: need }, (_, c) => [row, c]));
    let wrong = 0;
    for (;;) {
      const item = await P.next();
      ctx.fx.sound.tap();
      if (item.len === need) {
        off?.(); await R.takeFromPile(item, "s", row, 0); ctx.fx.sound.drop();
        const pt = R.point("s", row, need - 1); if (row % 3 === 2 || row === 9) ctx.fx.cheer(null); else ctx.fx.burst(pt.x, pt.y, { power: 0.7 });
        break;
      }
      wrong++; ctx.mistake(); ctx.fx.sound.bad();
      await R.tryFromPile(item, "s", row, 0, "h", { over: Math.max(0, item.len - need) });
      ctx.guide.encourage(item.len > need ? "칸보다 길어서 넘쳐요. 더 짧은 막대!" : "칸이 남아요. 더 긴 막대!");
      if (wrong >= 2) ctx.guide.say(`빛나는 칸이 ${need}칸이에요.`);
    }
  }
  ctx.fx.cheer(null, { big: true });
  await ctx.guide.praise("계단 완성! 막대는 색깔마다 길이가 달라요.");
  await ctx.next("다음");
}

// ── 10쪽 — 원본처럼 한 쪽에 두 격자(위: 갈색 막대 + 빈 줄 2, 아래: 보라색 막대 + 빈 줄 3). 막대는 오른쪽 더미에서 ──
async function step10(ctx) {
  const P = pileWaiter();
  const R = rods(ctx, { boards: [{ id: "a", cols: 10, rows: 3, z: -5 }, { id: "b", cols: 10, rows: 4, z: 3.5 }], pile: { x: 12.5, z: -0.5, w: 12, d: 13 }, onPile: P.onPile });
  await R?.place("a", 8, 0, 0, "h", { animate: false });
  await R?.place("b", 4, 0, 0, "h", { animate: false });
  R?.fillPile([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 5, 6, 9]);
  const pg = ctx.page("10");
  ctx.dock.innerHTML = `<p class="sm-docknote">👉 막대 더미에서 막대를 눌러요</p>`;
  // 원장 2026-11-12 「이건 어떻게 하라고 설계가 이상하잖아」: 기준 막대 끝에 빨간 점선을 긋고,
  //   짧은 막대 찾기는 기준선 안쪽 칸만, 긴 막대 찾기는 기준선 너머 칸만 빛나게 한다. 틀리면 넘친 칸·모자란 칸이 빨갛다.
  const parts = [
    { id: "a", base: 8, text: pg?.text, want: (n) => n > 8, need: 2, kind: "long", mark: "갈색 끝",
      say: "갈색 막대보다 긴 막대를 더미에서 찾아 아래 빈 줄에 놓아요. 빨간 선을 넘어야 해요!" },
    { id: "b", base: 4, text: pg?.text2, want: (n) => n < 4, need: 3, kind: "short", mark: "보라색 끝",
      say: "보라색 막대보다 짧은 막대를 더미에서 찾아 아래 빈 줄에 놓아요. 빨간 선 안쪽에 쏙 들어가야 해요!" }
  ];
  for (const [k, part] of parts.entries()) {
    if (k === 0) await ctx.source("10"); else { ctx.setSource(part.text || ""); if (part.text) await ctx.guide.say(part.text, { display: false }); }
    const unmark = R?.marker(part.id, part.base, part.mark);
    ctx.guide.say(part.say);
    const got = new Set();
    let row = 1;
    while (got.size < part.need) {
      const glowCells = part.kind === "short" ? Array.from({ length: part.base - 1 }, (_, c) => [row, c]) : Array.from({ length: 10 - part.base }, (_, c) => [row, part.base + c]);
      const off = R?.glow(part.id, glowCells);
      const item = await P.next();
      ctx.fx.sound.tap();
      if (part.want(item.len) && !got.has(item.len)) {
        off?.(); await R.takeFromPile(item, part.id, row, 0); ctx.fx.sound.drop(); got.add(item.len); row++;
        const pt = R.point(part.id, row - 1, item.len - 1); ctx.fx.burst(pt.x, pt.y, { power: 0.9 });
        ctx.guide.praise(got.size < part.need ? `맞아요! ${part.kind === "short" ? "짧은" : "긴"} 막대가 또 있을까요?` : "모두 찾았어요!");
      } else {
        off?.(); ctx.mistake(); ctx.fx.sound.bad();
        const dup = got.has(item.len);
        // 짧은 막대 찾기: 기준선(보라색 끝)에 닿거나 넘은 칸을 빨갛게 / 긴 막대 찾기: 기준선까지 모자란 칸을 빨갛게
        const over = part.kind === "short" ? Math.max(0, item.len - (part.base - 1)) : 0;
        const short = part.kind === "long" && item.len <= part.base ? Array.from({ length: part.base - item.len + 1 }, (_, c) => [row, item.len + c]).filter(([, c]) => c < 10) : [];
        await R.tryFromPile(item, part.id, row, 0, "h", { hold: 1100, over, short });
        ctx.guide.encourage(dup ? "그 길이는 벌써 놓았어요. 다른 막대!"
          : part.kind === "short" ? (item.len === part.base ? "보라색 막대와 길이가 같아요. 더 짧아야 해요!" : "빨간 선을 넘었어요. 보라색 막대보다 길어요!")
          : (item.len === part.base ? "갈색 막대와 길이가 같아요. 더 길어야 해요!" : "빨간 선까지 모자라요. 갈색 막대보다 짧아요!"));
      }
    }
    unmark?.();
    ctx.fx.cheer(null, { big: true });
    await ctx.wait(700);
  }
  await ctx.next("다음");
}

// ── 11쪽 가장 긴 막대 ○ / 키가 가장 작은 동물 △ ────────────
async function step11(ctx) {
  const R = rods(ctx, { boards: [{ id: "g", cols: 10, rows: 5 }] });
  await R?.place("g", 6, 0, 0, "h", { animate: false });
  await R?.place("g", 4, 2, 0, "h", { animate: false });
  await R?.place("g", 8, 4, 0, "h", { animate: false });
  const pg = await ctx.source("11");
  ctx.guide.say("가장 긴 막대를 눌러요.");
  await ctx.choose([6, 4, 8].map((n) => ({ value: String(n), art: rodIcon(n, 11), name: `${RODS[n].name} 막대` })),
    { correct: "8", wrongSay: "막대 끝이 가장 오른쪽까지 간 것을 찾아요.", praise: "맞아요! 갈색 막대가 가장 길어요." });
  R?.label("g", "○", 4, 9);
  await ctx.wait(600);
  ctx.dispose(); ctx.reset("11쪽");
  // 동물 키: 원본 격자(3칸 × 5줄)에서 소 3칸, 오리 4칸, 양 2칸
  const animals = [{ v: "cow", name: "소", h: 3 }, { v: "duck", name: "오리", h: 4 }, { v: "sheep", name: "양", h: 2 }];
  const cw = 160, ch = 64;
  ctx.stage.innerHTML = `<svg class="sm-scene" viewBox="0 0 ${cw * 3 + 40} ${ch * 5 + 40}" role="img" aria-label="격자 위의 소, 오리, 양">
    <g transform="translate(20,20)">${Array.from({ length: 6 }, (_, i) => `<line x1="0" x2="${cw * 3}" y1="${i * ch}" y2="${i * ch}" stroke="#9aa7b8" stroke-dasharray="6 5"/>`).join("")}
    ${Array.from({ length: 4 }, (_, i) => `<line y1="0" y2="${ch * 5}" x1="${i * cw}" x2="${i * cw}" stroke="#9aa7b8" stroke-dasharray="6 5"/>`).join("")}
    ${animals.map((a, i) => animalAt(a.v, i * cw + cw / 2, ch * 5, a.h * ch)).join("")}</g></svg>`;
  ctx.setSource(pg?.text2 || "키가 가장 작은 동물에 △표 하세요.");
  await ctx.guide.say(pg?.text2 || "키가 가장 작은 동물에 △표 하세요.", { display: false });
  ctx.guide.say("칸을 세어 보면 알 수 있어요.");
  await ctx.choose(animals.map((a) => ({ value: a.v, art: animal(a.v, 76), name: a.name })),
    { correct: "sheep", wrongSay: "몇 칸까지 올라오는지 세어 봐요.", praise: "맞아요! 양이 2칸으로 가장 작아요." });
  await ctx.next("다음");
}

// ── 12쪽 숫자 1과 3 완성 — 원본 배치 그대로(스캔에서 칸 단위로 잼):
//   위 가운데 노란 테두리 상자에 보기 막대 5개(윗줄 흰·빨강·연두, 아랫줄 보라·노랑), 아래 왼쪽 지환, 아래 가운데 「1」, 오른쪽 「3」.
async function step12(ctx) {
  const one = [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [4, 0], [4, 1], [4, 2]];
  const three = [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [2, 0], [2, 1], [4, 0], [4, 1]];
  const P = pileWaiter();
  const R = rods(ctx, {
    boards: [{ id: "one", cols: 3, rows: 5, cells: one, x: -0.8, z: 8.3 }, { id: "three", cols: 3, rows: 5, cells: three, x: 5.2, z: 8.3 }],
    pile: { x: 0, z: 0, w: 13.4, d: 5.3 }, box: true, extra: [{ x: -6.6, z: 8.3, w: 3.4, d: 6 }], onPile: P.onPile
  });
  await R?.place("one", 1, 0, 0, "h", { animate: false }); await R?.place("one", 4, 0, 1, "v", { animate: false });
  await R?.place("three", 3, 0, 0, "h", { animate: false }); await R?.place("three", 4, 1, 2, "v", { animate: false }); await R?.place("three", 2, 4, 0, "h", { animate: false });
  R?.layoutPile([{ len: 1, x: -4.7, z: -1.08 }, { len: 2, x: -2.1, z: -1.08 }, { len: 3, x: 1.6, z: -1.08 }, { len: 4, x: -3.2, z: 1.13 }, { len: 5, x: 2.6, z: 1.13 }]);
  const pg = await ctx.source("12");
  R?.pin(`${person(pg?.names?.[0] || "지환", 120)}<figcaption>${esc(pg?.names?.[0] || "지환")}</figcaption>`, -6.6, 8.3, 3.4);
  ctx.guide.say("위 상자에서 빈칸에 꼭 맞는 막대 2개를 찾아 눌러요!");
  ctx.dock.innerHTML = `<p class="sm-docknote">👆 위 상자의 막대를 눌러요</p>`;
  const slots = [{ board: "one", r: 4, c: 0, len: 3 }, { board: "three", r: 2, c: 0, len: 2 }];
  const offs = slots.map((sl) => R?.glow(sl.board, Array.from({ length: sl.len }, (_, i) => [sl.r, sl.c + i])));
  const left = new Set([0, 1]);
  while (left.size) {
    const item = await P.next();
    ctx.fx.sound.tap();
    const k = [...left].find((i) => slots[i].len === item.len);
    if (k !== undefined) {
      const sl = slots[k]; offs[k]?.(); left.delete(k);
      await R.takeFromPile(item, sl.board, sl.r, sl.c); ctx.fx.sound.drop();
      const pt = R.point(sl.board, sl.r, sl.c); ctx.fx.burst(pt.x, pt.y, { power: 1 });
      if (left.size) ctx.guide.praise("맞아요! 하나 더 찾아요.");
    } else {
      ctx.mistake(); ctx.fx.sound.bad();
      const sl = slots[[...left][0]];
      await R.tryFromPile(item, sl.board, sl.r, sl.c, "h", { over: Math.max(0, item.len - sl.len) });
      ctx.guide.encourage(item.len > sl.len ? "칸보다 길어요." : "칸이 남아요.");
    }
  }
  ctx.fx.cheer(null, { big: true });
  await ctx.guide.praise("숫자 1과 3이 완성되었어요! 연두색 막대와 빨간색 막대가 필요했어요.");
  await ctx.next("다음");
}

// ── 13쪽 숫자 만들기(게임) — 활동지 A1-3-1 「7과 4」. 원본 규칙: 1~5cm 막대 여러 개를 「책상 가운데」 놓고,
//   주사위를 던져 나온 수의 길이에 맞는 막대를 찾아 칸에 놓는다. 6이면 원하는 막대. 칸을 벗어나면 안 되고, 놓을 수 없으면 다시 가운데에.
const SEVEN = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4]];
const FOUR = [[0, 0], [1, 0], [2, 0], [3, 0], [3, 1], [3, 2], [3, 3], [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4]];
const die = (n) => {
  const P = { 1: [[50, 50]], 2: [[28, 28], [72, 72]], 3: [[25, 25], [50, 50], [75, 75]], 4: [[28, 28], [72, 28], [28, 72], [72, 72]], 5: [[26, 26], [74, 26], [50, 50], [26, 74], [74, 74]], 6: [[28, 24], [72, 24], [28, 50], [72, 50], [28, 76], [72, 76]] };
  return `<svg viewBox="0 0 100 100" width="96" height="96" aria-label="주사위 ${n}"><rect x="4" y="4" width="92" height="92" rx="20" fill="#fff" stroke="#1d2b44" stroke-width="4"/>${P[n].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${n === 1 ? "#ef4444" : "#1d2b44"}"/>`).join("")}</svg>`;
};
async function numberGame(ctx) {
  const P = pileWaiter();
  let cellTap = null;
  const R = rods(ctx, {
    boards: [
      { id: "m7", cols: 5, rows: 7, cells: SEVEN, x: -15, dashed: false, labelRoom: true }, { id: "m4", cols: 5, rows: 7, cells: FOUR, x: -9 },
      { id: "d7", cols: 5, rows: 7, cells: SEVEN, x: 9, dashed: false }, { id: "d4", cols: 5, rows: 7, cells: FOUR, x: 15 }
    ],
    pile: { x: 0, z: 0, w: 12, d: 9 }, onPile: P.onPile,
    onCell: (board, r, c) => cellTap?.(board, r, c)
  });
  R?.fillPile(Array.from({ length: 20 }, (_, i) => (i % 5) + 1));
  R?.label("m7", "나", -1.6, 7); R?.label("d7", "독쌤", -1.6, 7);
  const over = document.createElement("div");
  over.className = "sm-overlay sm-game-hud";
  ctx.stage.append(over);
  const left = (who) => R.emptyCount(`${who}7`) + R.emptyCount(`${who}4`);
  const hud = (dieHtml = "") => { over.innerHTML = `<div class="sm-score"><span>나 · 남은 칸 ${left("m")}</span><span>독쌤 · 남은 칸 ${left("d")}</span></div>${dieHtml ? `<div class="sm-die">${dieHtml}</div>` : ""}`; };
  hud();
  await ctx.source("13");
  await ctx.guide.say("가운데 막대 더미에서 주사위 수만큼 긴 막대를 찾아 내 숫자 7과 4의 칸에 놓아요!");
  const roll = async () => { let n = 1; for (let i = 0; i < (ctx.fx.reduced() ? 1 : 9); i++) { n = 1 + Math.floor(Math.random() * 6); hud(die(n)); ctx.fx.sound.tap(); await ctx.wait(80 + i * 12); } return n; };
  const fitsAny = (who, len) => R.pileHas(len) && [...R.fits(`${who}7`, len), ...R.fits(`${who}4`, len)].length > 0;
  for (let turn = 0; turn < 80; turn++) {
    ctx.dock.innerHTML = `<button class="sm-btn go big pulse" type="button" data-roll><span class="ico">🎲</span> 주사위 던지기</button>`;
    ctx.guide.say("내 차례예요! 주사위를 던져요.");
    await waitTap(ctx.dock, "[data-roll]");
    ctx.dock.innerHTML = "";
    const n = await roll();
    const anyOk = n === 6 ? [1, 2, 3, 4, 5].some((k) => fitsAny("m", k)) : fitsAny("m", n);
    if (!anyOk) await ctx.guide.encourage(n === 6 ? "놓을 수 있는 막대가 없어요." : `${n}칸 막대는 놓을 곳이 없어요. 다음 차례!`);
    else {
      ctx.dock.innerHTML = `<p class="sm-docknote">👉 가운데 더미에서 ${n === 6 ? "원하는" : `${n}칸`} 막대를 눌러요</p>`;
      ctx.guide.say(n === 6 ? "6이 나왔어요! 원하는 막대를 더미에서 골라요." : `${n}이 나왔어요! ${n}칸짜리 막대를 더미에서 찾아요.`);
      let item;
      for (;;) {
        item = await P.next();
        if (n !== 6 && item.len !== n) { ctx.mistake(); ctx.fx.sound.bad(); R.lift(item, true); await ctx.wait(350); R.lift(item, false); ctx.guide.encourage(`그 막대는 ${item.len}칸이에요. ${n}칸 막대를 찾아요.`); continue; }
        if (!fitsAny("m", item.len)) { ctx.fx.sound.bad(); ctx.guide.encourage("그 막대는 놓을 곳이 없어요. 다른 막대를 골라요."); continue; }
        break;
      }
      R.lift(item, true); ctx.fx.sound.pop();
      ctx.dock.innerHTML = `<p class="sm-docknote">👉 내 숫자(왼쪽)에서 막대를 놓을 칸을 눌러요</p>`;
      ctx.guide.say("이제 놓을 칸을 눌러요. 칸을 벗어나면 안 돼요!");
      await new Promise((resolve) => {
        cellTap = async (board, r, c) => {
          if (!board.startsWith("m")) { ctx.guide.encourage("왼쪽이 내 숫자예요!"); return; }
          const fit = R.fitAt(board, item.len, r, c);
          if (!fit) { ctx.fx.sound.bad(); ctx.guide.encourage("거기는 칸이 모자라거나 이미 찼어요."); return; }
          cellTap = null;
          await R.takeFromPile(item, board, fit.r, fit.c, fit.dir); ctx.fx.sound.drop();
          const pt = R.point(board, fit.r, fit.c); ctx.fx.burst(pt.x, pt.y, { power: 0.8 });
          resolve();
        };
      });
    }
    hud(die(n));
    if (!left("m")) { ctx.fx.sound.fanfare(); ctx.fx.cheer(null, { big: true }); await ctx.guide.praise("숫자 7과 4를 먼저 완성했어요! 내가 이겼어요!"); break; }
    await ctx.guide.say("이번엔 독쌤 차례!");
    const m = await roll();
    const dl = m === 6 ? ([5, 4, 3, 2, 1].find((k) => fitsAny("d", k)) || 0) : (fitsAny("d", m) ? m : 0);
    if (dl) {
      const opts = [...R.fits("d7", dl).map((f) => ({ b: "d7", ...f })), ...R.fits("d4", dl).map((f) => ({ b: "d4", ...f }))];
      const item = R.findInPile(dl);
      await R.takeFromPile(item, opts[0].b, opts[0].r, opts[0].c, opts[0].dir); ctx.fx.sound.drop();
      await ctx.guide.say(`독쌤은 ${RODS[dl].name} 막대(${dl}칸)를 놓았어요.`);
    } else await ctx.guide.say("독쌤은 놓을 곳이 없어요.");
    hud();
    if (!left("d")) { await ctx.guide.encourage("독쌤이 먼저 완성했어요. 다음엔 꼭 이겨 봐요!"); break; }
  }
  over.remove();
  await ctx.next("다음");
}

export const LESSON = {
  title: "누가 더 길까?",
  subtitle: "퀴즈네르 막대로 길이를 비교해요",
  coverArt: "📏",
  doneTitle: "길이 재기 1차시 끝!",
  doneText: "길이를 비교할 때는 한쪽 끝을 맞추어요. 막대는 색깔마다 길이가 달라요.",
  steps: [
    { page: "8쪽", run: ribbon },
    { page: "9쪽", run: staircase },
    { page: "10쪽", run: step10 },
    { page: "11쪽", run: step11 },
    { page: "12쪽", run: step12 },
    { page: "13쪽 · 게임", run: numberGame }
  ]
};
