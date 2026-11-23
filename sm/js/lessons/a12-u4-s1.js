// A1-2 4단원 큰 수, 작은 수 · 1차시 (원본 78~84쪽)
//  78 수민 사탕 5 · 정민 사탕 7 (병 속 사탕 세기) · 79 민지는 수민보다 많고 정민보다 적게 → 스티커 6개
//  80·81 수민 큐브 10 · 정민 큐브 8 → 개수만큼 색칠, 더 많은 쪽 · 더 큰 수 ○
//  82·83 「큰 수 찾기」 파란 큐브와 빨간 큐브를 하나씩 짝지어 더 큰 수 ○ (보기 3·4, 활동판 A 6장)
//  84 풍선 두 수 중 큰 수 ○ (4·15·20), 작은 수 △ (10·2·11)
import { esc, scene, icon, cube, bagSvg, colorN, onHit, pad, pickArt, countSay, pairUp } from "../numbers.js?v=20261123a";
import { kid } from "../art.js?v=20261123a";

const T = (x, y, t, { size = 26, fill = "#25324a", weight = 800, anchor = "middle", extra = "" } = {}) => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" ${extra}>${t}</text>`;
const SUMIN = { hair: "bob", hairColor: "#a0522d", shirt: "#c0392b", bottom: "#7a2a22" };
const JEONGMIN = { hair: "boy", hairColor: "#22201f", shirt: "#5aa0f0", bottom: "#2f4a72" };
const MINJI = { hair: "bob", hairColor: "#3a2418", shirt: "#fff4c2", bottom: "#4a5a7a", dress: true, collar: "#ffe066" };
const person = (o, x, y, size = 120, name = "") => `<g transform="translate(${x - size / 2} ${y})">${kid({ ...o, size })}</g>${name ? T(x, y + size * 1.42, name, { size: 24 }) : ""}`;
// 유리병(코르크 마개 · 빨간 리본)
const jar = (cx, cy, w = 200) => { const h = w * 1.05; return `<g><path d="M${cx - w * 0.3} ${cy - h * 0.42} Q${cx - w * 0.55} ${cy - h * 0.3} ${cx - w * 0.5} ${cy + h * 0.1} Q${cx - w * 0.45} ${cy + h * 0.5} ${cx} ${cy + h * 0.5} Q${cx + w * 0.45} ${cy + h * 0.5} ${cx + w * 0.5} ${cy + h * 0.1} Q${cx + w * 0.55} ${cy - h * 0.3} ${cx + w * 0.3} ${cy - h * 0.42}Z" fill="rgba(220,240,255,.55)" stroke="#9fb6cf" stroke-width="4"/>
  <rect x="${cx - w * 0.33}" y="${cy - h * 0.56}" width="${w * 0.66}" height="${h * 0.14}" rx="8" fill="#d9a066" stroke="#a5713c" stroke-width="3"/><path d="M${cx + w * 0.1} ${cy - h * 0.44} q${w * 0.18} ${-w * 0.16} ${w * 0.3} 0 q${-w * 0.12} ${w * 0.14} ${-w * 0.3} 0 M${cx + w * 0.1} ${cy - h * 0.44} q${w * 0.08} ${w * 0.2} ${w * 0.22} ${w * 0.26}" fill="#f0414f" stroke="#c92c3a" stroke-width="3"/></g>`; };
const candySpots = (n, cx, cy, gap = 52) => { const per = n > 6 ? 3 : 3, out = []; for (let i = 0; i < n; i++) { const r = Math.floor(i / per), c = i % per; out.push({ x: cx + (c - 1) * gap + (r % 2 ? gap * 0.3 : 0), y: cy + 40 - r * gap * 0.82 }); } return out; };
const CANDY_C = ["red", "orange", "orange", "red", "green", "green", "red", "orange", "green", "red"];

// ── 78쪽 수민 5 · 정민 7 ──
async function p78(ctx) {
  await ctx.source("78");
  // 원장 2026-11-15 「그림 작어 사탕 못 눌러」: 한 병씩 크게 보이고, 사탕마다 손가락 크기의 누르는 자리를 둔다
  for (const [j, n, who, look, name, off0] of [["a", 5, "수민이의 사탕을 하나씩 눌러서 세어 봐요.", SUMIN, "수민", 0], ["b", 7, "이번엔 정민이의 사탕을 세어 봐요.", JEONGMIN, "정민", 3]]) {
    const spots = candySpots(n, 300, 310, 96);
    const svg = scene(ctx, "0 0 560 480", `${person(look, 62, 8, 96, name)}${jar(310, 255, 420)}${spots.map((p, i) => `<g class="nm-hit nm-cd" data-i="${i}"><circle cx="${p.x}" cy="${p.y}" r="50" fill="transparent"/>${icon("candy", p.x, p.y, 88, CANDY_C[i + off0])}</g>`).join("")}<g class="nm-marks"></g>`);
    const marks = svg.querySelector(".nm-marks");
    ctx.guide.say(who);
    ctx.dock.innerHTML = `<div class="nm-padwrap"><div class="nm-ask"><span class="nm-count">0</span>개</div></div>`;
    let k = 0;
    await new Promise((r) => { const off = onHit(svg, ".nm-cd", (el) => { if (el.dataset.done) return; el.dataset.done = "1"; k++; const p = spots[Number(el.dataset.i)]; el.style.opacity = ".6"; marks.insertAdjacentHTML("beforeend", `<circle cx="${p.x + 30}" cy="${p.y - 30}" r="18" fill="#2fb67c" stroke="#fff" stroke-width="3"/><text x="${p.x + 30}" y="${p.y - 23}" text-anchor="middle" font-size="20" font-weight="900" fill="#fff">${k}</text>`); ctx.dock.querySelector(".nm-count").textContent = k; ctx.fx.sound.pop(); countSay(ctx, k); if (k === n) { off(); r(); } }); });
    await ctx.wait(500);
    await ctx.guide.praise(j === "a" ? "수민이는 사탕 5개!" : "정민이는 사탕 7개!");
  }
  ctx.dock.innerHTML = "";
  await ctx.next("다음");
}

// ── 79쪽 민지의 사탕 ──
async function p79(ctx) {
  const pg = await ctx.source("79");
  const spots = candySpots(10, 600, 250, 50);
  const bubble = pg?.bubbles?.[0] || "";
  const svg = scene(ctx, "0 0 900 470", `${person(MINJI, 190, 170, 130, "민지")}${bubble ? `<rect x="20" y="10" width="340" height="120" rx="40" fill="#fff" stroke="#25324a" stroke-width="2.5"/><path d="M170 128 l10 30 l18 -30" fill="#fff" stroke="#25324a" stroke-width="2.5"/><foreignObject x="40" y="18" width="300" height="104"><div xmlns="http://www.w3.org/1999/xhtml" style="height:104px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:21px;font-weight:700;line-height:1.35;color:#25324a">${esc(bubble)}</div></foreignObject>` : ""}
    <g class="nm-hit nm-jar">${jar(600, 240, 300)}</g><g class="nm-st"></g>
    ${T(380, 455, "수민 5개 · 정민 7개", { size: 22, fill: "#4a5a78", anchor: "start" })}`);
  if (bubble) await ctx.guide.think(bubble);
  ctx.guide.say("병을 누르면 동그라미 스티커가 붙어요. 붙인 스티커를 누르면 떼어져요.");
  ctx.dock.innerHTML = `<div class="nm-padwrap"><div class="nm-ask"><span class="nm-count">0</span>개 붙였어요</div><button class="sm-btn go big" type="button" data-ok><span class="ico">✔</span> 다 붙였어요</button></div>`;
  const st = svg.querySelector(".nm-st"); let n = 0;
  const redraw = () => { st.innerHTML = spots.slice(0, n).map((p, i) => `<g class="nm-hit nm-sticker" data-i="${i}"><circle cx="${p.x}" cy="${p.y}" r="22" fill="${["#ff6b6b", "#ffa94d", "#46c37b"][i % 3]}" stroke="#fff" stroke-width="4"/></g>`).join(""); ctx.dock.querySelector(".nm-count").textContent = n; };
  const off1 = onHit(svg, ".nm-jar", () => { if (n < 10) { n++; redraw(); ctx.fx.sound.pop(); } });
  const off2 = onHit(svg, ".nm-sticker", () => { if (n > 0) { n--; redraw(); ctx.fx.sound.tap(); } });
  await new Promise((r) => ctx.dock.querySelector("[data-ok]").addEventListener("click", () => {
    if (n === 6) { off1(); off2(); r(); return; }
    ctx.mistake(); ctx.fx.sound.bad();
    ctx.guide.encourage(n <= 5 ? "수민이보다 많아야 해요. 수민이는 5개예요." : "정민이보다 적어야 해요. 정민이는 7개예요.");
  }));
  ctx.fx.cheer(null, { big: true });
  await ctx.guide.praise("5보다 많고 7보다 적은 수는 6! 민지는 사탕 6개를 가지고 있어요.");
  await pad(ctx, 6, { min: 1, max: 10, before: esc(pg?.frames?.[0]?.replace("□ 개", "") || "민지가 가진 사탕은 몇 개입니까?"), after: "개" });
  await ctx.next("다음");
}

// ── 80·81쪽 큐브의 개수 ──
async function p80(ctx) {
  await ctx.source("80");
  // 한 주머니씩 크게(큐브마다 손가락 크기의 누르는 자리)
  const A = [[3, 0], [4, 1], [3, 2]].flatMap(([n, r]) => Array.from({ length: n }, (_, c) => [330 + (c - (n - 1) / 2) * 96, 190 + r * 92]));
  const B = [[240, 195], [350, 180], [460, 200], [190, 295], [300, 290], [415, 300], [270, 390], [390, 390]];
  for (const [j, n, msg, look, name, bag, col, pts] of [["a", 10, "수민이의 큐브를 하나씩 눌러서 세어 봐요.", SUMIN, "수민", "#e8604f", "blue", A], ["b", 8, "정민이의 큐브도 세어 봐요.", JEONGMIN, "정민", "#3d6fc4", "red", B]]) {
    const svg = scene(ctx, "0 0 640 490", `${person(look, 62, 4, 96, name)}${bagSvg(330, 290, 560, bag)}${pts.map(([x, y], i) => `<g class="nm-hit nm-cc" data-i="${i}"><rect x="${x - 46}" y="${y - 46}" width="92" height="92" fill="transparent"/>${cube(x, y, 72, col)}</g>`).join("")}<g class="nm-marks"></g>`);
    const marks = svg.querySelector(".nm-marks");
    ctx.guide.say(msg);
    ctx.dock.innerHTML = `<div class="nm-padwrap"><div class="nm-ask"><span class="nm-count">0</span>개</div></div>`;
    let k = 0;
    await new Promise((r) => { const off = onHit(svg, ".nm-cc", (el) => { if (el.dataset.done) return; el.dataset.done = "1"; k++; const [x, y] = pts[Number(el.dataset.i)]; el.style.opacity = ".55"; marks.insertAdjacentHTML("beforeend", `<circle cx="${x + 30}" cy="${y - 32}" r="18" fill="#2fb67c" stroke="#fff" stroke-width="3"/><text x="${x + 30}" y="${y - 25}" text-anchor="middle" font-size="20" font-weight="900" fill="#fff">${k}</text>`); ctx.dock.querySelector(".nm-count").textContent = k; ctx.fx.sound.pop(); countSay(ctx, k); if (k === n) { off(); r(); } }); });
    await ctx.wait(400);
  }
  await ctx.guide.praise("수민이는 큐브 10개, 정민이는 8개예요!");
  ctx.dock.innerHTML = "";
  await ctx.next("다음");
}
async function p81(ctx) {
  const pg = await ctx.source("81");
  const row = (y) => Array.from({ length: 10 }, (_, i) => ({ x: 250 + i * 60, y }));
  const svg = scene(ctx, "0 0 900 360", `${person(SUMIN, 110, 20, 90, "수민")}${person(JEONGMIN, 110, 190, 90, "정민")}`);
  await colorN(ctx, { svg, slots: row(90), n: 10, kind: "box", size: 52, color: "#6f8ff0", say: "수민이의 큐브는 10개! 10칸을 색칠해요." });
  ctx.fx.sound.good();
  await colorN(ctx, { svg, slots: row(260), n: 8, kind: "box", size: 52, color: "#ff6b6b", say: "정민이의 큐브는 8개! 8칸만 색칠해요." });
  ctx.fx.cheer(null);
  ctx.setSource(pg?.frames?.[0] || "누가 큐브를 더 많이 가지고 있는지 말해 보세요.");
  await ctx.guide.say("색칠한 칸을 비교해 봐요. 누가 큐브를 더 많이 가지고 있나요?");
  await ctx.choose([{ value: "sumin", art: kid({ ...SUMIN, size: 80 }), name: "수민" }, { value: "jm", art: kid({ ...JEONGMIN, size: 80 }), name: "정민" }],
    { correct: "sumin", wrongSay: "색칠한 칸이 더 긴 쪽을 봐요.", praise: "맞아요! 수민이가 2개 더 많아요." });
  ctx.setSource(pg?.frames?.[1] || "더 큰 수에 ○표 하세요.");
  await ctx.guide.say("10과 8 중에서 더 큰 수를 눌러요.");
  await ctx.choose([{ value: "10", art: pickArt("star", 10, "#e9ffe0"), name: "" }, { value: "8", art: pickArt("star", 8, "#e9ffe0"), name: "" }], { correct: "10", wrongSay: "개수가 많은 쪽의 수가 더 큰 수예요.", praise: "맞아요! 10은 8보다 커요." });
  await ctx.next("다음");
}

// ── 82·83쪽 큰 수 찾기: 파란 큐브와 빨간 큐브 짝짓기(numbers.js pairUp) ──
async function p82(ctx) {
  await ctx.source("82");
  await ctx.guide.say("보기를 봐요. 파란 큐브 3개와 빨간 큐브 4개를 하나씩 짝지으면 빨간 큐브가 1개 남아요. 그래서 4가 더 큰 수예요.");
  await pairUp(ctx, 3, 4, { manual: true, label: T(450, 36, "보기", { size: 26, fill: "#8f63e6" }) });
  await ctx.next("활동판 A 하기");
}
async function p83(ctx) {
  await ctx.source("83");
  const A = [[3, 4], [9, 5], [8, 11], [10, 11], [12, 14], [20, 17]];
  for (const [i, [b, r]] of A.entries()) {
    await pairUp(ctx, b, r, { manual: i < 2, label: T(450, 36, `활동판 A · ${i + 1}`, { size: 24, fill: "#4a5a78" }) });
    await ctx.wait(400);
  }
  await ctx.guide.praise("여섯 장 모두 더 큰 수를 찾았어요!");
  await ctx.next("다음");
}

// ── 84쪽 풍선 ──
const BAL = { 2: "#ffc2d6", 4: "#ffd6b0", 9: "#fff09a", 15: "#ffc08a", 20: "#bfe6ff", 10: "#d9c8f5", 14: "#ffc2d6", 8: "#fff09a", 16: "#bfe6ff", 11: "#d9c8f5" };
async function p84(ctx) {
  const pg = await ctx.source("84");
  const big = [[2, 4], [9, 15], [20, 10]], small = [[14, 10], [8, 2], [16, 11]];
  for (const [mode, sets] of [["big", big], ["small", small]]) {
    if (mode === "small" && pg?.text2) { ctx.setSource(pg.text2); await ctx.guide.say(pg.text2, { display: false }); }
    for (const [a, b] of sets) {
      scene(ctx, "0 0 900 300", `${icon("balloon", 360, 130, 150, BAL[a])}${T(360, 145, a, { size: 52, weight: 900 })}${icon("balloon", 540, 140, 150, BAL[b])}${T(540, 155, b, { size: 52, weight: 900 })}`);
      ctx.guide.say(mode === "big" ? "두 수 중 큰 수를 눌러요." : "두 수 중 작은 수를 눌러요.");
      const ans = mode === "big" ? Math.max(a, b) : Math.min(a, b);
      await ctx.choose([a, b].map((n) => ({ value: String(n), art: pickArt("balloon", n, BAL[n], 90), name: "" })), { correct: String(ans), wrongSay: mode === "big" ? "1부터 세어 갈 때 더 나중에 나오는 수가 큰 수예요." : "1부터 세어 갈 때 먼저 나오는 수가 작은 수예요.", praise: mode === "big" ? "맞아요! ○표!" : "맞아요! △표!" });
      ctx.fx.stamp(mode === "big" ? "○" : "△");
      await ctx.wait(500);
    }
  }
  await ctx.guide.praise("큰 수와 작은 수를 모두 찾았어요!");
  await ctx.next("끝");
}

export const LESSON = {
  title: "사탕은 몇 개일까?",
  subtitle: "하나씩 짝지어 보고 더 큰 수, 더 작은 수를 찾아요",
  coverArt: "🍬",
  doneTitle: "큰 수, 작은 수 1차시 끝!",
  doneText: "하나씩 짝지었을 때 남는 쪽이 더 많아요. 더 많은 쪽의 수가 더 큰 수예요.",
  steps: [
    { page: "78쪽 · 커지는 생각", run: p78 },
    { page: "79쪽", run: p79 },
    { page: "80쪽", run: p80 },
    { page: "81쪽", run: p81 },
    { page: "82쪽 · 활동", run: p82 },
    { page: "83쪽 · 활동판 A", run: p83 },
    { page: "84쪽", run: p84 }
  ]
};
