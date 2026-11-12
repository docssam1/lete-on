// 1단원 길이 재기 · 2차시 「큐브로 재어요」(원본 14~18쪽)
//   14 칫솔을 정확히 잰 큐브 ○ → 15 연필·해바라기에 큐브 놓기(몇 개?) → 16~17 「길이를 재어요!」(양·기린·토끼·공룡, 가장 긴/짧은 길이)
//   → 18 가장 긴 막대 ○ · 키가 가장 작은 친구 △
// 지문은 원본 그대로(ctx.source). 그림은 원본 쪽처럼 흰 종이 위 납작한 그림으로 다시 그렸다(art.js).
// 길이(큐브 수)는 원본에서 잰 값: 14쪽 칫솔 = 큐브 6(빨강 5개는 시작이 한 칸 늦음, 노랑 5개는 사이가 뜸),
//   15쪽 연필 3 · 해바라기 5, 16~17쪽 활동판(실제 크기, 지오큐브 2cm): 양 3 · 기린 5 · 토끼 2 · 공룡 4,
//   18쪽 막대: 보라 4(둘째 칸부터) · 노랑 7(첫 칸부터) · 파랑 6(다섯째 칸부터), 친구: 받침 0·1·2개(머리 높이 같음).
// 16~17쪽 활동판 길이는 인쇄 크기로 잰 값이라 정답지 확인 필요.
import { geocube, OBJ, animalAt, kid } from "../art.js?v=20261113q";

// 받침에 따라 「이에요/예요」
const ieyo = (w) => { const c = String(w).charCodeAt(String(w).length - 1) - 0xac00; return c >= 0 && c <= 11171 && c % 28 ? `${w}이에요` : `${w}예요`; };
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const U = 60;   // 큐브 한 변(그림 단위)
const PINK = "#e8417f";

// ── 큐브로 재기 장면(가로/세로) ───────────────────────────
const SHAPES = {
  pencil: { dir: "h", h: 46 }, sunflower: { dir: "h", h: 116 }, toothbrush: { dir: "h", h: 40 },
  sheep: { dir: "h", h: 150 }, dinosaur: { dir: "h", h: 190 }, giraffe: { dir: "v", w: 120 }, rabbit: { dir: "v", w: 70 }
};
function drawObject(kind, x, y, w, h) { return kind === "sheep" ? animalAt("sheep", x + w / 2, y + h, h) : OBJ[kind](x, y, w, h); }
function measureScene(host, { kind, units, color }) {
  const sh = SHAPES[kind], L = units * U, pad = 40;
  let vbW, vbH, line, slot;
  if (sh.dir === "h") {
    vbW = pad * 2 + L + U * 2.2; vbH = sh.h + U + 70;
    const ly = 20 + sh.h + 10;
    line = `<line x1="${pad}" y1="${ly}" x2="${pad + L}" y2="${ly}" stroke="${PINK}" stroke-width="3"/><line x1="${pad}" y1="${ly - 9}" x2="${pad}" y2="${ly + 9}" stroke="${PINK}" stroke-width="3"/><line x1="${pad + L}" y1="${ly - 9}" x2="${pad + L}" y2="${ly + 9}" stroke="${PINK}" stroke-width="3"/>`;
    slot = (i) => ({ x: pad + i * U, y: ly + 3 });
    host.innerHTML = `<svg class="sm-scene" viewBox="0 0 ${vbW} ${vbH}" preserveAspectRatio="xMidYMid meet">${drawObject(kind, pad, 20, L, sh.h)}${line}${geocube(pad, ly + 3, U, color, { dashed: true })}<g class="cubes"></g></svg>`;
  } else {
    vbW = pad * 2 + sh.w + U + 40; vbH = L + U * 2.2 + 50;
    const top = U * 2.2 + 20, lx = pad + sh.w + 10;
    line = `<line x1="${lx}" y1="${top}" x2="${lx}" y2="${top + L}" stroke="${PINK}" stroke-width="3"/><line x1="${lx - 9}" y1="${top}" x2="${lx + 9}" y2="${top}" stroke="${PINK}" stroke-width="3"/><line x1="${lx - 9}" y1="${top + L}" x2="${lx + 9}" y2="${top + L}" stroke="${PINK}" stroke-width="3"/>`;
    slot = (i) => ({ x: lx + 4, y: top + L - (i + 1) * U });
    host.innerHTML = `<svg class="sm-scene" viewBox="0 0 ${vbW} ${vbH}" preserveAspectRatio="xMidYMid meet">${drawObject(kind, pad, top, sh.w, L)}${line}${geocube(lx + 4, top + L - U, U, color, { dashed: true })}<g class="cubes"></g></svg>`;
  }
  const g = host.querySelector(".cubes");
  let n = 0;
  return {
    get n() { return n; },
    add() { const p = slot(n); n++; const el = document.createElementNS("http://www.w3.org/2000/svg", "g"); el.classList.add("sm-drop"); el.innerHTML = geocube(p.x, p.y, U, color, { bad: n > units }); g.append(el); return n; },
    sub() { if (!n) return 0; g.lastElementChild?.remove(); n--; return n; },
    pulse(i) { const el = g.children[i]; if (!el) return; el.classList.remove("sm-pop"); void el.getBoundingClientRect(); el.classList.add("sm-pop"); }
  };
}
// 큐브를 하나씩 놓아 끝까지 → 몇 개인지 고르기
async function measure(ctx, { kind, units, color, name, intro }) {
  const sc = measureScene(ctx.stage, { kind, units, color });
  ctx.dock.innerHTML = `<div class="sm-tray"><button class="sm-btn go big" type="button" data-add><span class="sm-geo-ico" style="--c:${color}"></span> 큐브 놓기</button><button class="sm-btn big" type="button" data-sub><span class="ico">➖</span> 빼기</button></div>`;
  ctx.guide.say(intro || `${name}의 길이만큼 큐브를 놓아 봐요. 분홍 선 끝까지!`);
  await new Promise((resolve) => {
    const on = (e) => {
      const add = e.target.closest("[data-add]"), sub = e.target.closest("[data-sub]");
      if (!add && !sub) return;
      const k = add ? sc.add() : sc.sub();
      add ? ctx.fx.sound.drop() : ctx.fx.sound.tap();
      if (k === units) { ctx.dock.removeEventListener("click", on); ctx.dock.querySelectorAll("button").forEach((b) => { b.disabled = true; }); resolve(); }
      else if (k > units) { ctx.mistake(); ctx.fx.sound.bad(); ctx.guide.encourage("분홍 선 끝을 넘었어요. 하나 빼요!"); }
    };
    ctx.dock.addEventListener("click", on);
  });
  ctx.fx.cheer(null);
  await ctx.guide.praise("끝이 꼭 맞아요! 이제 큐브를 세어 봐요.");
  ctx.guide.say(`${name}의 길이는 큐브 몇 개일까요?`);
  await ctx.number(units, { max: 10, before: "큐브", after: "개", hint: async () => {
    await ctx.guide.encourage("같이 세어 봐요!");
    for (let i = 0; i < units; i++) { sc.pulse(i); ctx.fx.sound.tap(); ctx.guide.say(String(i + 1)); await ctx.wait(650); }
  } });
  await ctx.guide.praise(`맞아요! ${name}의 길이는 큐브 ${units}개예요.`);
}

// ── 14쪽 칫솔을 정확하게 잰 큐브 ─────────────────────────
async function toothbrush(ctx) {
  const L = 6 * U, x0 = 60, W = x0 * 2 + L + 120;
  const rows = [
    { v: "red", color: "#ff8a73", cells: Array.from({ length: 5 }, (_, i) => x0 + U + i * U) },
    { v: "blue", color: "#7f8fd1", cells: Array.from({ length: 6 }, (_, i) => x0 + i * U) },
    { v: "yellow", color: "#ffd862", cells: Array.from({ length: 5 }, (_, i) => x0 + 4 + i * (U + 9.5)) }
  ];
  const pg = ctx.page("14");
  ctx.stage.innerHTML = `<svg class="sm-scene" viewBox="0 0 ${W} 400" preserveAspectRatio="xMidYMid meet">
    <line x1="${x0}" y1="8" x2="${x0}" y2="392" stroke="#f0a050" stroke-dasharray="7 6" stroke-width="2"/><line x1="${x0 + L}" y1="8" x2="${x0 + L}" y2="392" stroke="#f0a050" stroke-dasharray="7 6" stroke-width="2"/>
    ${OBJ.toothbrush(x0, 30, L, 46)}
    ${rows.map((r, k) => r.cells.map((x) => geocube(x, 110 + k * 95, U, r.color)).join("") + `<g class="mark" data-row="${r.v}"></g>`).join("")}
  </svg>`;
  await ctx.source("14");
  ctx.guide.say("칫솔의 길이를 정확하게 잰 큐브는 어느 줄일까요?");
  const icon = (c) => `<svg width="96" height="34" viewBox="0 0 96 34">${[0, 1, 2].map((i) => geocube(i * 32, 1, 31, c)).join("")}</svg>`;
  await ctx.choose(rows.map((r) => ({ value: r.v, art: icon(r.color), name: { red: "빨간 큐브", blue: "파란 큐브", yellow: "노란 큐브" }[r.v] })), {
    correct: "blue", wrongSay: "시작과 끝을 점선에 맞추었는지 볼까요?",
    hint: () => ctx.guide.encourage(pg?.bubbles?.[0] || "물건의 길이를 잴 때는 시작과 끝을 정확히 맞추어야 해요."),
    praise: "맞아요! 파란 큐브는 시작과 끝이 칫솔과 딱 맞아요."
  });
  const m = ctx.stage.querySelector('[data-row="blue"]');
  m.innerHTML = `<ellipse cx="${x0 + L + 60}" cy="${110 + 95 + U / 2}" rx="34" ry="30" fill="none" stroke="#e8417f" stroke-width="5"/>`;
  await ctx.guide.say(pg?.bubbles?.[0] || "물건의 길이를 잴 때는 시작과 끝을 정확히 맞추어야 해요.");
  await ctx.next("다음");
}

// ── 15쪽 연필·해바라기 ───────────────────────────────────
async function pencilSunflower(ctx) {
  await ctx.source("15");
  await measure(ctx, { kind: "pencil", units: 3, color: "#7f8fd1", name: "연필", intro: "연필의 길이에 맞게 큐브를 놓아 봐요. 분홍 선 끝까지!" });
  ctx.dispose(); ctx.reset("15쪽"); await ctx.source("15", { read: false });
  await measure(ctx, { kind: "sunflower", units: 5, color: "#ffd862", name: "해바라기", intro: "이번엔 해바라기예요. 분홍 선 끝까지 큐브를 놓아요!" });
  await ctx.next("다음");
}

// ── 16~17쪽 「길이를 재어요!」 ────────────────────────────
const BOARD = [
  { kind: "sheep", units: 3, color: "#f4a3c4", name: "양" },
  { kind: "giraffe", units: 5, color: "#ff8a73", name: "기린" },
  { kind: "rabbit", units: 2, color: "#8bd17c", name: "토끼" },
  { kind: "dinosaur", units: 4, color: "#7f8fd1", name: "공룡" }
];
async function lengthBoard(ctx) {
  await ctx.source("16");
  for (const [i, it] of BOARD.entries()) {
    if (i) { ctx.dispose(); ctx.reset("16~17쪽 · 활동판"); await ctx.source("16", { read: false }); }
    await measure(ctx, { ...it, intro: `${it.name}의 길이를 큐브로 재어 봐요!` });
  }
  ctx.dispose(); ctx.reset("16~17쪽 · 활동판"); await ctx.source("16", { read: false });
  // 활동 4번: 가장 긴 길이와 가장 짧은 길이
  const art = (it) => { const sh = SHAPES[it.kind]; return sh.dir === "h" ? `<svg width="120" height="${Math.round(120 * sh.h / (it.units * U))}" viewBox="0 0 ${it.units * U} ${sh.h}">${drawObject(it.kind, 0, 0, it.units * U, sh.h)}</svg>` : `<svg width="${Math.round(80 * sh.w / (it.units * U))}" height="80" viewBox="0 0 ${sh.w} ${it.units * U}">${drawObject(it.kind, 0, 0, sh.w, it.units * U)}</svg>`; };
  // 원장 2026-11-12 「가장 많은것 부터 눌러보세요」: 카드 한 줄에서 큐브가 많은 것부터 차례로 누른다 → 첫째 = 가장 긴 길이, 마지막 = 가장 짧은 길이
  ctx.stage.innerHTML = `<div class="sm-sumgrid">${BOARD.map((it) => `<button type="button" class="sm-sumcell" data-k="${it.kind}"><span class="ord" hidden></span><div class="pic">${art(it)}</div><div class="cnt"><b>${it.units}</b> 개</div><div class="nm">${it.name}</div><span class="tag" hidden></span></button>`).join("")}</div>`;
  ctx.dock.innerHTML = `<p class="sm-docknote">👆 큐브가 가장 많은 것부터 차례로 눌러요</p>`;
  ctx.guide.say("큐브로 잰 길이를 보아요. 큐브가 가장 많은 것부터 차례로 눌러 보세요!");
  const order = [...BOARD].sort((a, b) => b.units - a.units);
  await new Promise((resolve) => {
    let k = 0;
    const grid = ctx.stage.querySelector(".sm-sumgrid");
    grid.addEventListener("click", (e) => {
      const card = e.target.closest(".sm-sumcell"); if (!card || card.disabled) return;
      if (card.dataset.k === order[k].kind) {
        card.disabled = true; card.classList.add("is-done");
        const o = card.querySelector(".ord"); o.hidden = false; o.textContent = String(k + 1);
        ctx.fx.sound.pop(); ctx.fx.burstAt(card, { power: 0.8 });
        k++;
        if (k < order.length) ctx.guide.say(k === 1 ? "맞아요! 그다음으로 많은 것은요?" : "잘했어요! 그다음은요?");
        else resolve();
      } else {
        ctx.mistake(); ctx.fx.sound.bad(); card.classList.remove("is-wrong"); void card.offsetWidth; card.classList.add("is-wrong");
        ctx.guide.encourage("큐브 수를 보세요. 남은 것 중에서 가장 많은 것을 눌러요.");
      }
    });
  });
  const first = ctx.stage.querySelector(`[data-k="${order[0].kind}"] .tag`), last = ctx.stage.querySelector(`[data-k="${order.at(-1).kind}"] .tag`);
  first.hidden = false; first.textContent = "가장 길어요"; last.hidden = false; last.textContent = "가장 짧아요"; last.classList.add("short");
  ctx.dock.innerHTML = "";
  ctx.fx.cheer(null, { big: true });
  await ctx.guide.praise(`잘했어요! 가장 긴 길이는 ${order[0].name}, 가장 짧은 길이는 ${ieyo(order.at(-1).name)}.`);
  await ctx.next("다음");
}

// ── 18쪽 가장 긴 막대 ○ / 키가 가장 작은 친구 △ ──────────────
async function page18(ctx) {
  const C = 56, bars = [
    { v: "purple", name: "보라색 막대", color: "#8e6bb0", row: 0, from: 1, len: 4 },
    { v: "yellow", name: "노란색 막대", color: "#f7b733", row: 2, from: 0, len: 7 },
    { v: "blue", name: "파란색 막대", color: "#6aa6e8", row: 4, from: 4, len: 6 }
  ];
  const grid = Array.from({ length: 5 }, (_, r) => Array.from({ length: 10 }, (_, c) => `<rect x="${c * C}" y="${r * C}" width="${C}" height="${C}" fill="none" stroke="#9aa7b8" stroke-dasharray="5 4"/>`).join("")).join("");
  ctx.stage.innerHTML = `<svg class="sm-scene" viewBox="-20 -20 ${C * 10 + 160} ${C * 5 + 40}" preserveAspectRatio="xMidYMid meet">${grid}
    ${bars.map((b) => `<rect x="${b.from * C}" y="${b.row * C + 2}" width="${b.len * C}" height="${C - 4}" rx="4" fill="${b.color}"/>`).join("")}<g class="mark"></g></svg>`;
  const pg = await ctx.source("18");
  ctx.guide.say("시작하는 곳이 다 달라요. 칸을 세어 보면 알 수 있어요!");
  const ico = (b) => `<svg width="${b.len * 14}" height="24"><rect x="0" y="2" width="${b.len * 14}" height="20" rx="4" fill="${b.color}"/></svg>`;
  await ctx.choose(bars.map((b) => ({ value: b.v, art: ico(b), name: b.name })), {
    correct: "yellow", wrongSay: "끝만 보지 말고 몇 칸인지 세어 봐요.", praise: "맞아요! 노란색 막대가 7칸으로 가장 길어요.",
    hint: () => { ctx.guide.encourage("보라색 4칸, 노란색 7칸, 파란색 6칸이에요."); }
  });
  ctx.stage.querySelector(".mark").innerHTML = `<ellipse cx="${C * 10 + 60}" cy="${2 * C + C / 2}" rx="30" ry="24" fill="none" stroke="#e8417f" stroke-width="5"/>`;
  await ctx.wait(700);
  ctx.dispose(); ctx.reset("18쪽");
  ctx.setSource(pg?.text2 || "키가 가장 작은 친구에 △표 하세요.");
  await ctx.guide.say(pg?.text2 || "키가 가장 작은 친구에 △표 하세요.", { display: false });
  // 머리 높이가 같고, 받침이 0·1·2개 → 받침이 가장 많은 친구가 가장 작다
  // 무대 높이에 맞춰 키를 정하고, 그림 위쪽 빈 곳(머리카락 위 17%)을 빼서 머리 꼭대기가 점선에 닿게 한다
  const stageH = ctx.stage.clientHeight || 360, B = Math.round(Math.min(26, stageH * 0.07)), Hk = Math.max(140, Math.min(260, stageH - 70)), TOP = 0.125;   // 그림 맨 위에서 머리카락 꼭대기까지(162 중 약 20)
  const kids = [
    { v: "a", blocks: 0, look: { hair: "boy", hairColor: "#2a211c", shirt: "#8bc34a", bottom: "#3e4a3a" } },
    { v: "b", blocks: 1, look: { hair: "girl", hairColor: "#9a5a2a", shirt: "#e05252", dress: true } },
    { v: "c", blocks: 2, look: { hair: "bob", hairColor: "#2a211c", shirt: "#ffe066", dress: true, collar: "#ffd84a" } }
  ];
  // 그림 높이 h에서 머리 꼭대기까지의 실제 키 = h·(1−TOP). 받침 개수만큼 키가 작아야 머리 높이가 같다.
  const BOT = 0.062;   // 발바닥 아래 그림자 자리(162 중 약 10)
  const bodyH = (k) => (Hk - k.blocks * B) / (1 - TOP - BOT);
  ctx.stage.innerHTML = `<div class="sm-kidsrow" style="--B:${B}px"><div class="topline" style="bottom:${40 + Hk}px"></div>${kids.map((k) => `<div class="col"><div class="kidwrap" style="margin-bottom:${-(bodyH(k) * BOT).toFixed(1)}px">${kid({ ...k.look, size: bodyH(k) / 1.35 })}</div>${Array.from({ length: k.blocks }, () => '<div class="blk"></div>').join("")}</div>`).join("")}<div class="ground"></div></div>`;
  ctx.guide.say("받침을 보세요. 키가 가장 작은 친구는 누구일까요?");
  const mini = (k) => kid({ ...k.look, size: 54 });
  await ctx.choose(kids.map((k, i) => ({ value: k.v, art: mini(k), name: `${i + 1}번 친구` })), {
    correct: "c", wrongSay: "머리 높이는 같아요. 받침이 많을수록 키는 어떨까요?", praise: "맞아요! 받침을 2개나 딛고 서야 머리가 같아지니까 가장 작아요."
  });
  await ctx.next("끝내기", { icon: "🏁" });
}

export const LESSON = {
  title: "큐브로 재어요",
  subtitle: "같은 큐브로 길이를 재어 비교해요",
  coverArt: "🧊",
  doneTitle: "길이 재기 2차시 끝!",
  doneText: "길이를 잴 때는 시작과 끝을 정확히 맞추고, 큐브가 몇 개인지 세어요.",
  steps: [
    { page: "14쪽", run: toothbrush },
    { page: "15쪽", run: pencilSunflower },
    { page: "16~17쪽 · 활동", run: lengthBoard },
    { page: "18쪽", run: page18 }
  ]
};
