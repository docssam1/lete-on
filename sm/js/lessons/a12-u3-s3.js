// A1-2 3단원 수와 숫자의 탄생 · 3차시 (원본 64~74쪽) — 푸리수리 1~9 + 창의력 Game 「입체도형 빙고」
//  64 방 그림 속 숫자 1~5 · 65 10개씩 묶어 세기(11·15·14·20) · 66 수만큼 색칠(9·12·16) · 67 같은 수끼리 잇기
//  68 연잎 1~20 빈칸 · 69 꿀벌 1→10 벌집 길 · 70 순서대로·거꾸로 빈칸 · 71 10→1 보물 길 두 개 · 72 보석(세모 9·마름모 5)
//  73·74 입체도형 빙고: 주머니에서 입체도형을 꺼내 닮은 그림 카드를 뒤집기, 한 줄 먼저 → 빙고(나 대 독쌤)
//  그림 위치·수는 원본에서 옮겼다(sm/data/a1-2.local.json data). 그림은 모두 코드로 다시 그림.
import { esc, scene, icon, cube, group10, colorN, matchLines, seqFill, numPath, blockCount, findAll, bagSvg, onHit, pad } from "../numbers.js?v=20261115b";
import { kid } from "../art.js?v=20261115b";

const range = (a, b) => (a <= b ? Array.from({ length: b - a + 1 }, (_, i) => a + i) : Array.from({ length: a - b + 1 }, (_, i) => a - i));
const T = (x, y, t, { size = 26, fill = "#25324a", weight = 800, anchor = "middle", extra = "" } = {}) => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" ${extra}>${t}</text>`;

// ── 64쪽 방 그림 속 숫자 1~5 ──
function room() {
  const checks = Array.from({ length: 6 }, (_, r) => Array.from({ length: 7 }, (_, c) => (r + c) % 2 ? "" : `<rect x="${560 + c * 44}" y="${300 + r * 34}" width="44" height="34" fill="#ffb3c8" opacity=".75"/>`).join("")).join("");
  const find = (k, body, cx, cy, rr = 52) => `<g class="nm-hit nm-find" data-k="${k}">${body}<circle class="ring" cx="${cx}" cy="${cy}" r="${rr}" fill="rgba(255,230,0,.15)" stroke="#e8417f" stroke-width="6"/></g>`;
  return `<rect width="900" height="640" fill="#e9d8f5"/><rect y="440" width="900" height="200" fill="#d9c2ee"/>
    <rect x="60" y="40" width="300" height="170" fill="#cfeaff" stroke="#fff" stroke-width="10"/><path d="M210 40 v170" stroke="#fff" stroke-width="8"/>
    <path d="M40 30 Q70 120 50 230 L110 230 Q90 120 100 30Z M380 30 Q350 120 370 230 L310 230 Q330 120 320 30Z" fill="#f2475a" opacity=".85"/><rect x="30" y="22" width="360" height="12" rx="6" fill="#c0392b"/>
    <rect x="700" y="90" width="140" height="120" fill="#fff" stroke="#9a6a3c" stroke-width="8"/><path d="M720 190 l40 -60 l30 40 l20 -20 l20 40z" fill="#8bd17c"/>
    ${find("5", `<path d="M770 90 L770 70" stroke="#9a6a3c" stroke-width="3"/>${T(770, 72, "5", { size: 44, fill: "#2a6fc4", weight: 900 })}`, 770, 58, 34)}
    <rect x="520" y="260" width="340" height="260" rx="20" fill="#fff" stroke="#c96f8f" stroke-width="4"/>${checks}
    ${find("4", T(690, 420, "4", { size: 64, fill: "#f05a8a", weight: 900 }), 690, 398, 46)}
    <rect x="540" y="220" width="160" height="60" rx="28" fill="#fff" stroke="#8a93a3" stroke-width="3"/>
    ${find("2", `${T(620, 240, "2", { size: 90, fill: "#ffcf2e", weight: 900, extra: 'stroke="#d9a400" stroke-width="2"' })}<circle cx="612" cy="188" r="4" fill="#33241a"/><path d="M596 194 l-14 4 l14 5z" fill="#ff8a1c"/>`, 616, 206, 54)}
    <rect x="40" y="470" width="420" height="24" rx="6" fill="#c8955f"/><rect x="60" y="494" width="20" height="130" fill="#a5713c"/><rect x="420" y="494" width="20" height="130" fill="#a5713c"/>
    <path d="M70 470 L140 450 L210 470 L140 476Z" fill="#fff" stroke="#8a93a3" stroke-width="3"/><path d="M140 452 v22" stroke="#8a93a3" stroke-width="2"/>
    ${find("3", `<g transform="rotate(90 280 446)">${T(280, 470, "3", { size: 72, fill: "#3b4252", weight: 900 })}</g>`, 280, 446, 44)}
    ${find("1", `<path d="M330 400 L410 400 L392 350 L348 350Z" fill="#ffe066" stroke="#d9a400" stroke-width="3"/>${T(370, 470, "1", { size: 72, fill: "#ffcf2e", weight: 900, extra: 'stroke="#d9a400" stroke-width="2"' })}`, 370, 420, 58)}
    <rect x="170" y="560" width="120" height="16" rx="6" fill="#5aa0f0"/><rect x="180" y="576" width="12" height="54" fill="#4a7fd0"/><rect x="268" y="576" width="12" height="54" fill="#4a7fd0"/>`;
}
async function p64(ctx) {
  await ctx.source("64");
  const svg = scene(ctx, "0 0 900 640", room());
  ctx.guide.say("방 안에 숫자 1, 2, 3, 4, 5가 숨어 있어요. 찾아서 눌러요!");
  await findAll(ctx, svg, { total: 5 });
  await ctx.guide.praise("스탠드, 오리 인형, 안경, 이불, 액자 고리에 숫자가 숨어 있었어요!");
  await ctx.next("다음");
}

// ── 65쪽 10개씩 묶기 ──
const rows = (counts, kind, x0 = 330, y0 = 90, gap = 86) => counts.flatMap((n, r) => Array.from({ length: n }, (_, c) => ({ kind, x: x0 + c * gap, y: y0 + r * 92 })));
async function p65(ctx) {
  await ctx.source("65");
  // (1) 이미 10개를 묶어 둔 오리 11개 → 모두 몇 개
  const ducks = rows([5, 5, 1], "duck", 300, 100);
  scene(ctx, "0 0 900 420", `${T(30, 50, "(1)", { size: 28, fill: "#4a5a78", anchor: "start" })}<rect x="250" y="50" width="450" height="200" rx="22" fill="none" stroke="#e8604f" stroke-width="5"/>${ducks.map((d) => icon("duck", d.x, d.y, 70)).join("")}`);
  await ctx.guide.say("오리 10개는 벌써 묶어 놓았어요. 모두 몇 개일까요?");
  await pad(ctx, 11, { min: 1, max: 20, after: "개", onWrong: async () => ctx.guide.encourage("10개 묶음 하나와 1개! 열 다음은 열하나예요.") });
  await ctx.guide.praise("맞아요! 10개 묶음 하나와 1개, 11개예요.");
  const sets = [["(2)", "doll", [5, 5, 5]], ["(3)", "bear", [5, 5, 4]], ["(4)", "car", [5, 5, 5, 5]]];
  for (const [lbl, kind, counts] of sets) {
    const items = rows(counts, kind, 480, counts.length > 3 ? 80 : 120, 84);
    await group10(ctx, { items, vb: "0 0 900 470", size: 66, tray: { x: 20, y: 120 }, back: T(30, 50, lbl, { size: 28, fill: "#4a5a78", anchor: "start" }), ask: { rest: false, total: true } });
    await ctx.guide.praise("맞아요! 10개씩 묶으니 세기 쉬워요.");
  }
  await ctx.next("다음");
}

// ── 66쪽 수만큼 색칠 ──
function shelf(num, kind, colored = 0) {
  const slots = Array.from({ length: 20 }, (_, i) => ({ x: 250 + (i % 10) * 62, y: 150 + Math.floor(i / 10) * 70 }));
  const body = `<rect x="215" y="105" width="640" height="160" rx="10" fill="#ffe8b3" stroke="#d99a3c" stroke-width="4"/><rect x="200" y="262" width="670" height="14" rx="6" fill="#d99a3c"/>
    <rect x="80" y="130" width="96" height="74" rx="10" fill="#ffe066" stroke="#d9a400" stroke-width="4"/><rect x="122" y="204" width="12" height="70" fill="#d9a400"/>${T(128, 182, num, { size: 46, weight: 900 })}`;
  return { slots, body, pre: slots.slice(0, colored).map((s) => icon(kind, s.x, s.y, 52)).join("") + slots.slice(colored).map((s) => `<g style="filter:grayscale(1) brightness(1.75);opacity:.55">${icon(kind, s.x, s.y, 52)}</g>`).join("") };
}
async function p66(ctx) {
  await ctx.source("66");
  const ex = shelf(5, "apple", 5);
  scene(ctx, "0 0 900 320", `${T(30, 50, "보기", { size: 26, fill: "#fff", anchor: "start", extra: 'paint-order="stroke" stroke="#8f63e6" stroke-width="14"' })}${ex.body}${ex.pre}`);
  await ctx.guide.say("보기처럼 5는 사과 5개를 색칠해요. 나도 해 볼까요?");
  await ctx.next("나도 해 볼래요");
  for (const [lbl, n, kind] of [["(1)", 9, "strawberry"], ["(2)", 12, "melon"], ["(3)", 16, "apple"]]) {
    const sh = shelf(n, kind);
    const svg = scene(ctx, "0 0 900 320", `${T(30, 50, lbl, { size: 28, fill: "#4a5a78", anchor: "start" })}${sh.body}`);
    await colorN(ctx, { svg, slots: sh.slots, n, kind, size: 52, say: "팻말의 수만큼 눌러서 색칠해요. 다 칠하면 아래 단추를 눌러요." });
    await ctx.guide.praise("팻말의 수만큼 딱 맞게 색칠했어요!");
  }
  await ctx.next("다음");
}

// ── 67쪽 같은 수끼리 잇기 ──
const tenFrame = (x, y) => `<g>${Array.from({ length: 10 }, (_, i) => `<rect x="${x - 75 + (i % 5) * 30}" y="${y - 30 + Math.floor(i / 5) * 30}" width="30" height="30" fill="#e9f0ff" stroke="#6f8ff0" stroke-width="2.5"/>`).join("")}</g>`;
const grid = (kind, counts, x, y, s = 30, gap = 34) => counts.map((n, r) => Array.from({ length: n }, (_, c) => icon(kind, x - ((Math.max(...counts) - 1) * gap) / 2 + c * gap, y - ((counts.length - 1) * gap) / 2 + r * gap, s)).join("")).join("");
async function p67(ctx) {
  await ctx.source("67");
  const circ = (n, c, y) => `<circle cx="130" cy="${y}" r="44" fill="${c}"/><circle cx="130" cy="${y}" r="34" fill="#fff" opacity=".6"/>${T(130, y + 14, n, { size: 40, weight: 900 })}`;
  const L = [[10, "#ffc2d6"], [7, "#fff09a"], [9, "#c9f0a8"], [13, "#a8e6ef"]].map(([n, c], i) => ({ id: String(n), x: 130, y: 70 + i * 120, html: circ(n, c, 70 + i * 120) }));
  const R = [
    { id: "9", html: grid("cake", [3, 3, 3], 700, 70, 30, 34) },
    { id: "10", html: tenFrame(700, 190) },
    { id: "13", html: grid("donut", [4, 4, 4, 1], 700, 310, 30, 34) },
    { id: "7", html: grid("milk", [3, 4], 700, 430, 36, 42) }
  ].map((r, i) => ({ ...r, x: 650, y: 70 + i * 120, html: `<rect x="580" y="${70 + i * 120 - 56}" width="240" height="112" rx="16" fill="#fff" stroke="#dde5f0" stroke-width="3"/>${r.html}` }));
  await matchLines(ctx, { vb: "0 0 900 520", left: L, right: R, pairs: { 10: "10", 7: "7", 9: "9", 13: "13" }, dx: 70, say: "같은 수를 나타내는 것끼리 선으로 이어요. 왼쪽 수를 누르고, 오른쪽 그림을 눌러요!" });
  await ctx.guide.praise("모두 알맞게 이었어요!");
  await ctx.next("다음");
}

// ── 68쪽 연잎 1~20 ──
const PADS = [[0.13, 0.29], [0.32, 0.27], [0.52, 0.29], [0.71, 0.27], [0.89, 0.32], [0.82, 0.44], [0.64, 0.43], [0.45, 0.44], [0.27, 0.44], [0.13, 0.54], [0.27, 0.62], [0.45, 0.6], [0.64, 0.59], [0.82, 0.6], [0.89, 0.71], [0.78, 0.81], [0.6, 0.81], [0.41, 0.77], [0.25, 0.84], [0.13, 0.93]];
async function p68(ctx) {
  await ctx.source("68");
  const blanks = [3, 5, 8, 9, 10, 11, 14, 16, 18, 19];
  const cells = PADS.map(([px, py], i) => ({ x: 40 + px * 820, y: py * 640 - 10, v: i + 1, n: blanks.includes(i + 1) ? null : i + 1 }));
  const pond = `<rect width="900" height="640" fill="#bfe9ff"/><path d="M0 120 Q200 80 450 110 T900 100 V640 H0Z" fill="#7cc8f0"/>${Array.from({ length: 16 }, (_, i) => `<path d="M${30 + i * 56} 120 q8 -60 -4 -100" stroke="#55b047" stroke-width="5" fill="none"/>`).join("")}
    <g transform="translate(60 80)"><ellipse cx="0" cy="12" rx="34" ry="22" fill="#55b047"/><circle cx="-12" cy="-6" r="10" fill="#8bd17c"/><circle cx="12" cy="-6" r="10" fill="#8bd17c"/><circle cx="-12" cy="-7" r="4" fill="#25324a"/><circle cx="12" cy="-7" r="4" fill="#25324a"/></g>`;
  ctx.guide.say("개구리가 1부터 20까지 순서대로 연잎을 건너요. 빈 연잎의 수를 골라요!");
  await seqFill(ctx, { cells, vb: "0 0 900 640", kind: "lily", size: 92, label: pond, font: 36 });
  await ctx.guide.praise("개구리가 20까지 무사히 건넜어요!");
  await ctx.next("다음");
}

// ── 69쪽 꿀벌 길(벌집) ──
const bee = `<g transform="scale(.75)"><ellipse cx="0" cy="0" rx="30" ry="22" fill="#ffd23f" stroke="#25324a" stroke-width="3"/><path d="M-8 -20 v40 M8 -21 v42" stroke="#25324a" stroke-width="6"/><ellipse cx="-6" cy="-28" rx="14" ry="10" fill="#e9f7ff" stroke="#8a93a3" stroke-width="2"/><ellipse cx="10" cy="-28" rx="14" ry="10" fill="#e9f7ff" stroke="#8a93a3" stroke-width="2"/><circle cx="-26" cy="-4" r="4" fill="#25324a"/></g>`;
const morningGlory = `<g transform="scale(.8)"><path d="M0 0 L-26 -26 Q0 -40 26 -26Z" fill="#e85fa8"/><circle cx="0" cy="-22" r="8" fill="#fff"/><path d="M0 0 v30" stroke="#4fae40" stroke-width="5"/><ellipse cx="12" cy="20" rx="12" ry="7" fill="#4fae40"/></g>`;
async function p69(ctx) {
  await ctx.source("69");
  await numPath(ctx, { grid: [[1, 2, 2, 3], [1, 3, 4, 6], [5, 2, 5, 3], [9, 6, 9, 8], [5, 7, 8, 10]], seq: range(1, 10), start: [0, 0], end: [4, 3], hex: true, cell: 96, who: bee, goal: morningGlory,
    say: { start: "꿀벌이 1부터 10까지 순서대로 날아가요. 이웃한 칸으로만 갈 수 있어요!" } });
  await ctx.guide.praise("꿀벌이 꽃에 도착했어요!");
  await ctx.next("다음");
}

// ── 70쪽 순서대로 · 거꾸로 ──
const grid20 = (nums, blanks) => nums.map((v, i) => ({ x: 110 + (i % 5) * 120, y: 70 + Math.floor(i / 5) * 112, v, n: blanks.includes(v) ? null : v }));
async function p70(ctx) {
  await ctx.source("70");
  ctx.guide.say("순서대로 쓰기! 빈칸의 수를 골라요.");
  await seqFill(ctx, { cells: grid20(range(1, 20), [2, 3, 6, 8, 10, 12, 14, 16, 17, 18]), vb: "0 0 700 450", kind: "flower", size: 84, label: T(20, 30, "(1) 순서대로 쓰기", { size: 22, fill: "#4a5a78", anchor: "start" }) });
  await ctx.guide.praise("순서대로 다 채웠어요!");
  await ctx.wait(400);
  ctx.guide.say("거꾸로 쓰기! 하나씩 작아져요.");
  await seqFill(ctx, { cells: grid20(range(20, 1), [18, 16, 13, 12, 11, 9, 7, 5, 2, 1]), vb: "0 0 700 450", kind: "star", size: 96, reverse: true, label: T(20, 30, "(2) 거꾸로 쓰기", { size: 22, fill: "#4a5a78", anchor: "start" }) });
  await ctx.guide.praise("거꾸로도 다 채웠어요!");
  await ctx.next("다음");
}

// ── 71쪽 10→1 보물 길 ──
const chest = `<g transform="scale(.8)"><rect x="-26" y="-6" width="52" height="34" rx="4" fill="#9a6a3c" stroke="#5a3a1a" stroke-width="3"/><path d="M-26 -6 Q0 -34 26 -6Z" fill="#b07a4a" stroke="#5a3a1a" stroke-width="3"/><rect x="-5" y="-4" width="10" height="12" fill="#ffd23f"/><circle cx="-14" cy="-20" r="5" fill="#ffd23f"/><circle cx="12" cy="-22" r="4" fill="#ffe066"/></g>`;
const mini = (opts) => `<g transform="translate(-34 -46)">${kid({ ...opts, size: 68 })}</g>`;
async function p71(ctx) {
  await ctx.source("71");
  await numPath(ctx, { grid: [[10, 7, 8, 9, 3], [9, 8, 7, 6, 5], [6, 4, 5, 3, 4], [5, 6, 4, 2, 1]], seq: range(10, 1), start: [0, 0], end: [3, 4], who: mini({ hair: "boy", shirt: "#f2475a", bottom: "#4a5a7a" }), goal: chest, cell: 84, say: { start: "10에서 시작해서 9, 8, 7… 거꾸로 따라가요!" } });
  await ctx.guide.praise("보물을 찾았어요!");
  await ctx.wait(400);
  await numPath(ctx, { grid: [[10, 9, 8, 6, 5], [7, 6, 7, 8, 4], [6, 5, 9, 3, 2], [1, 4, 3, 2, 1]], seq: range(10, 1), start: [0, 0], end: [3, 4], who: mini({ hair: "girl", shirt: "#ffd84a", dress: true }), goal: chest, cell: 84, say: { start: "이번 길도 10부터 1까지 거꾸로 가요!" } });
  await ctx.guide.praise("두 번째 보물도 찾았어요!");
  await ctx.next("다음");
}

// ── 72쪽 보석 모양 패턴블록 ──
const U = 110, HT = U * 0.866;
const gem = [
  ["rho", [[1, 0], [3, 0], [2, 1], [0, 1]]], ["tri", [[2, 1], [3, 0], [4, 1]]], ["tri", [[3, 0], [5, 0], [4, 1]]], ["tri", [[4, 1], [5, 0], [6, 1]]], ["rho", [[5, 0], [7, 0], [8, 1], [6, 1]]],
  ["tri", [[0, 1], [2, 1], [1, 2]]], ["rho", [[2, 1], [3, 2], [2, 3], [1, 2]]], ["tri", [[2, 1], [4, 1], [3, 2]]], ["rho", [[4, 1], [5, 2], [4, 3], [3, 2]]], ["tri", [[4, 1], [6, 1], [5, 2]]],
  ["rho", [[6, 1], [7, 2], [6, 3], [5, 2]]], ["tri", [[6, 1], [8, 1], [7, 2]]], ["tri", [[2, 3], [3, 2], [4, 3]]], ["tri", [[4, 3], [5, 2], [6, 3]]]
].map(([type, pts]) => ({ type, pts: pts.map(([x, y]) => [70 + x * U / 2, 40 + y * HT]) }));
async function p72(ctx) {
  await ctx.source("72");
  await blockCount(ctx, { vb: "0 0 580 360", pieces: gem, ask: ["tri", "rho"] });
  await ctx.guide.praise("세모 9개, 마름모 5개! 하나씩 짚으며 잘 세었어요.");
  await ctx.next("다음");
}

// ── 73·74쪽 입체도형 빙고 ──
//  입체도형(주머니에서 꺼내는 것)과 닮은 그림 카드(원본 109쪽 그림 카드 A1-2-9를 코드로 다시 그림)
const SOLID = {
  sphere: (s) => `<circle r="${s * 0.42}" fill="url(#sdS)"/>`,
  pyramid: (s) => { const k = s / 100; return `<g transform="scale(${k})"><path d="M-44 22 L10 34 L44 14 L0 -44Z" fill="#ffb86b"/><path d="M-44 22 L10 34 L0 -44Z" fill="#ffd29c" stroke="#d98a2b" stroke-width="2"/><path d="M10 34 L44 14 L0 -44Z" fill="#f0a050" stroke="#d98a2b" stroke-width="2"/></g>`; },
  cube: (s) => { const k = s / 100; return `<g transform="scale(${k})"><path d="M-36 -18 L0 -36 L36 -18 L0 0Z" fill="#a8c8ff" stroke="#4d6cd6" stroke-width="2"/><path d="M-36 -18 L0 0 L0 40 L-36 22Z" fill="#7f9ff0" stroke="#4d6cd6" stroke-width="2"/><path d="M36 -18 L0 0 L0 40 L36 22Z" fill="#5f7fd8" stroke="#4d6cd6" stroke-width="2"/></g>`; },
  cone: (s) => { const k = s / 100; return `<g transform="scale(${k})"><path d="M-38 30 L0 -44 L38 30Z" fill="url(#sdC)"/><ellipse cx="0" cy="30" rx="38" ry="12" fill="#e06f9e"/></g>`; },
  hemi: (s) => { const k = s / 100; return `<g transform="scale(${k})"><path d="M-42 -4 A42 42 0 0 0 42 -4Z" fill="url(#sdH)"/><ellipse cx="0" cy="-4" rx="42" ry="14" fill="#b6e3a8" stroke="#55b047" stroke-width="2"/></g>`; },
  cylinder: (s) => { const k = s / 100; return `<g transform="scale(${k})"><path d="M-30 -30 L-30 30 A30 11 0 0 0 30 30 L30 -30Z" fill="url(#sdY)"/><ellipse cx="0" cy="-30" rx="30" ry="11" fill="#ffe98a" stroke="#d9a400" stroke-width="2"/></g>`; },
  triPrism: (s) => { const k = s / 100; return `<g transform="scale(${k})"><path d="M-40 34 L-14 -30 L12 34Z" fill="#ffb3c8" stroke="#e06f9e" stroke-width="2"/><path d="M-14 -30 L26 -40 L50 22 L12 34Z" fill="#f47aa8" stroke="#e06f9e" stroke-width="2"/></g>`; },
  hexPrism: (s) => { const k = s / 100; return `<g transform="scale(${k})"><path d="M-36 -20 L-18 -32 L18 -32 L36 -20 L18 -8 L-18 -8Z" fill="#ffe98a" stroke="#d9a400" stroke-width="2"/><path d="M-36 -20 L-18 -8 L-18 30 L-36 18Z" fill="#ffd84a" stroke="#d9a400" stroke-width="2"/><path d="M-18 -8 L18 -8 L18 30 L-18 30Z" fill="#f6c42a" stroke="#d9a400" stroke-width="2"/><path d="M18 -8 L36 -20 L36 18 L18 30Z" fill="#e0b020" stroke="#d9a400" stroke-width="2"/></g>`; },
  cuboid: (s) => { const k = s / 100; return `<g transform="scale(${k})"><path d="M-22 -40 L2 -48 L26 -40 L2 -32Z" fill="#d6dae3" stroke="#6a7385" stroke-width="2"/><path d="M-22 -40 L2 -32 L2 46 L-22 38Z" fill="#b6bccb" stroke="#6a7385" stroke-width="2"/><path d="M26 -40 L2 -32 L2 46 L26 38Z" fill="#8f97aa" stroke="#6a7385" stroke-width="2"/></g>`; }
};
const DEFS = `<defs><radialGradient id="sdS" cx=".35" cy=".35"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#5fb0f0"/></radialGradient><linearGradient id="sdC"><stop offset="0" stop-color="#ffc6de"/><stop offset="1" stop-color="#e06f9e"/></linearGradient>
  <linearGradient id="sdH"><stop offset="0" stop-color="#a8e89b"/><stop offset="1" stop-color="#4fae40"/></linearGradient><linearGradient id="sdY"><stop offset="0" stop-color="#ffe98a"/><stop offset="1" stop-color="#e0b020"/></linearGradient></defs>`;
const PIC = {
  sphere: `<circle r="34" fill="#fff" stroke="#25324a" stroke-width="3"/><path d="M0 -11 L10.5 -3.4 L6.5 8.9 L-6.5 8.9 L-10.5 -3.4Z" fill="#25324a"/>${[0, 72, 144, 216, 288].map((a) => `<g transform="rotate(${a})"><path d="M0 -11 V-22" stroke="#25324a" stroke-width="2.5"/><path d="M-8 -34 L-7 -24 L0 -21 L7 -24 L8 -34 Q0 -36 -8 -34Z" fill="#25324a"/></g>`).join("")}`,
  pyramid: `<path d="M-40 28 L0 -34 L40 28Z" fill="#ffd29c" stroke="#d98a2b" stroke-width="3"/><path d="M0 -34 L10 28" stroke="#d98a2b" stroke-width="2"/>${[-20, -6, 8, 20].map((y) => `<path d="M${-40 + (y + 34) * 0.62} ${y} H${40 - (y + 34) * 0.62}" stroke="#e6a860" stroke-width="2"/>`).join("")}`,
  cube: `<rect x="-28" y="-22" width="44" height="44" rx="6" fill="#fff" stroke="#55b047" stroke-width="3"/><path d="M-28 -22 l12 -10 h44 l-12 10z M16 -22 l12 -10 v44 l-12 10z" fill="#d6f2cc" stroke="#55b047" stroke-width="3"/>${[[-17, -11], [5, -11], [-17, 11], [5, 11], [-6, 0]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#25324a"/>`).join("")}`,
  cone: `<path d="M-30 32 L0 -38 L30 32Z" fill="#7fb2e8" stroke="#3d6fc4" stroke-width="3"/><circle cx="0" cy="-38" r="6" fill="#ffd23f"/><path d="M-14 0 q8 -6 16 0 M-20 18 q10 -6 22 2" stroke="#ffd23f" stroke-width="3" fill="none"/>`,
  hemi: `<path d="M-38 -6 A38 34 0 0 0 38 -6Z" fill="#3c8a3a"/><path d="M-32 -6 A32 26 0 0 0 32 -6Z" fill="#f0414f"/><ellipse cx="0" cy="-6" rx="38" ry="6" fill="#f0414f"/>${[-16, -4, 8, 18].map((x) => `<ellipse cx="${x}" cy="6" rx="2" ry="3" fill="#25324a"/>`).join("")}`,
  cylinder: `<rect x="-24" y="-30" width="48" height="60" fill="#ffe066" stroke="#d9a400" stroke-width="3"/><ellipse cx="0" cy="-30" rx="24" ry="8" fill="#e8ecf2" stroke="#8a93a3" stroke-width="3"/><circle cx="-6" cy="6" r="10" fill="#f0414f"/><circle cx="10" cy="12" r="9" fill="#f0414f"/>`,
  triPrism: `<path d="M-26 34 L-26 -24 L6 -30 L6 30Z" fill="#ffb3c8" stroke="#e06f9e" stroke-width="3"/><path d="M6 -30 L26 -18 L26 40 L6 30Z" fill="#f47aa8" stroke="#e06f9e" stroke-width="3"/>${[-20, -14, -8, -2, 4].map((x) => `<path d="M${x} -26 v-12" stroke="${["#f0414f", "#ffd23f", "#4fae40", "#2a6fc4", "#9b7be0"][Math.abs(x) % 5]}" stroke-width="3"/>`).join("")}`,
  hexPrism: `<path d="M-30 -16 L-15 -26 L15 -26 L30 -16 L15 -6 L-15 -6Z" fill="#ffe98a" stroke="#d9a400" stroke-width="3"/><path d="M-30 -16 L-30 22 L-15 32 L15 32 L30 22 L30 -16 L15 -6 L-15 -6Z" fill="#ffd84a" stroke="#d9a400" stroke-width="3"/><path d="M0 -26 V32" stroke="#f05a8a" stroke-width="5"/><path d="M0 -26 q-14 -12 -18 0 q10 6 18 0 q14 -12 18 0 q-10 6 -18 0" fill="#f05a8a"/>`,
  cuboid: `<rect x="-14" y="-40" width="28" height="80" fill="#9aa1ad" stroke="#4a5262" stroke-width="3"/>${Array.from({ length: 7 }, (_, i) => `<path d="M-10 ${-34 + i * 10} h20" stroke="#4a5262" stroke-width="2"/>`).join("")}<path d="M-14 -40 l8 -6 h28 l-8 6z" fill="#c8ced8" stroke="#4a5262" stroke-width="2"/>`
};
const KINDS = Object.keys(PIC);
const PIC_NAME = { sphere: "축구공", pyramid: "피라미드", cube: "주사위", cone: "고깔모자", hemi: "수박", cylinder: "통조림", triPrism: "연필꽂이", hexPrism: "선물 상자", cuboid: "건물" };
const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
const bingoLine = (flipped) => LINES.find((l) => l.every((i) => flipped[i]));
const FLOWER = ["#ffe3a8", "#e6c2ec", "#a8dcd6"];
function boardSvg(x, y, cs, order, flipped, { mine = true, line = null } = {}) {
  const cells = order.map((k, i) => {
    const cx = x + (i % 3) * cs + cs / 2, cy = y + Math.floor(i / 3) * cs + cs / 2, f = flipped[i];
    return `<g class="${mine ? "nm-hit bg-card" : ""}" data-i="${i}" data-k="${k}"><rect x="${cx - cs / 2}" y="${cy - cs / 2}" width="${cs}" height="${cs}" fill="#fff" stroke="#e6c2a0" stroke-width="2"/>
      <circle cx="${cx}" cy="${cy}" r="${cs * 0.36}" fill="${FLOWER[(i % 3 + Math.floor(i / 3)) % 3]}" opacity=".6"/>
      ${f ? `<rect x="${cx - cs * 0.42}" y="${cy - cs * 0.42}" width="${cs * 0.84}" height="${cs * 0.84}" rx="8" fill="#c9b8f0" stroke="#8f63e6" stroke-width="3"/><text x="${cx}" y="${cy + cs * 0.1}" text-anchor="middle" font-size="${cs * 0.26}" font-weight="900" fill="#f05a8a">빙고</text>`
        : `<rect x="${cx - cs * 0.42}" y="${cy - cs * 0.42}" width="${cs * 0.84}" height="${cs * 0.84}" rx="8" fill="#fff" stroke="#c9cfd8" stroke-width="2"/><g transform="translate(${cx} ${cy}) scale(${cs / 100})">${PIC[k]}</g>`}</g>`;
  }).join("");
  const ln = line ? (() => { const a = line[0], b = line[2]; const p = (i) => [x + (i % 3) * cs + cs / 2, y + Math.floor(i / 3) * cs + cs / 2]; const [x1, y1] = p(a), [x2, y2] = p(b); return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#e8417f" stroke-width="12" stroke-linecap="round" opacity=".8"/>`; })() : "";
  return cells + ln;
}
async function p73(ctx) {
  await ctx.source("73");
  // 닮은 것 알아보기: 입체도형 세 개를 보고 닮은 그림 카드 고르기
  ctx.guide.say("주머니에서 꺼낸 입체도형과 닮은 그림 카드를 찾아봐요!");
  for (const k of shuffle(KINDS).slice(0, 3)) {
    scene(ctx, "0 0 900 300", `${DEFS}${bagSvg(200, 170, 230, "#8f63e6")}<g transform="translate(470 150)">${SOLID[k](190)}</g><text x="470" y="290" text-anchor="middle" font-size="24" font-weight="800" fill="#4a5a78">꺼낸 입체도형</text>`);
    const opts = shuffle([k, ...shuffle(KINDS.filter((x) => x !== k)).slice(0, 2)]);
    await ctx.choose(opts.map((o) => ({ value: o, art: `<svg width="96" height="96" viewBox="-50 -50 100 100">${PIC[o]}</svg>`, name: PIC_NAME[o] })), { correct: k, wrongSay: "모양을 잘 봐요. 어떤 물건과 닮았나요?", praise: "맞아요! 모양이 닮았어요." });
    await ctx.wait(300);
  }
  await ctx.next("빙고 게임 하기!", { icon: "🎯" });
}
async function p74(ctx) {
  await ctx.source("74", { read: false });
  const me = { order: shuffle(KINDS), flipped: Array(9).fill(false) }, doc = { order: shuffle(KINDS), flipped: Array(9).fill(false) };
  const draw = (solid = null, lineMe = null, lineDoc = null) => scene(ctx, "0 0 1000 470", `${DEFS}
    <text x="20" y="34" font-size="26" font-weight="800" fill="#2fb67c">내 활동판</text>${boardSvg(20, 50, 130, me.order, me.flipped, { line: lineMe })}
    <g class="nm-hit nm-bagbtn">${bagSvg(560, 250, 200, "#8f63e6")}</g>${solid ? `<g transform="translate(560 252)">${SOLID[solid](130)}</g>` : `<text x="560" y="262" text-anchor="middle" font-size="22" font-weight="800" fill="#8f63e6">주머니</text>`}
    <text x="700" y="34" font-size="26" font-weight="800" fill="#2a6fc4">독쌤 활동판</text>${boardSvg(700, 50, 92, doc.order, doc.flipped, { mine: false, line: lineDoc })}`);
  await ctx.guide.say("각자 그림 카드 9장을 꽃 위에 올려 놓았어요. 주머니에서 입체도형을 꺼내 닮은 카드를 뒤집어요. 한 줄을 먼저 뒤집으면 빙고!");
  for (let turn = 0; turn < 60; turn++) {
    const mine = turn % 2 === 0, who = mine ? me : doc;
    let svg = draw();
    if (mine) {
      ctx.dock.innerHTML = `<p class="sm-docknote">👉 주머니를 눌러 입체도형을 꺼내요</p>`;
      ctx.guide.say("내 차례! 주머니를 눌러요.");
      await new Promise((r) => { const off = onHit(svg, ".nm-bagbtn", () => { off(); r(); }); });
    } else { ctx.dock.innerHTML = ""; await ctx.guide.say("독쌤 차례!"); }
    ctx.fx.sound.pop();
    const k = KINDS[Math.floor(Math.random() * KINDS.length)];
    svg = draw(k);
    const idx = who.order.indexOf(k);
    if (who.flipped[idx]) {
      await ctx.guide.encourage(mine ? "그 카드는 벌써 뒤집었어요. 다음 차례!" : "독쌤은 벌써 뒤집은 카드예요. 다음 차례!");
      await ctx.wait(600); continue;
    }
    if (mine) {
      ctx.dock.innerHTML = `<p class="sm-docknote">👉 닮은 그림 카드를 눌러 뒤집어요</p>`;
      ctx.guide.say("이 입체도형과 닮은 그림 카드를 찾아 눌러요!");
      let wrong = 0;
      await new Promise((r) => {
        const off = onHit(svg, ".bg-card", (el) => {
          const i = Number(el.dataset.i);
          if (me.flipped[i]) return;
          if (me.order[i] === k) { off(); r(); return; }
          wrong++; ctx.mistake(); ctx.fx.sound.bad(); el.classList.remove("nm-no"); void el.getBoundingClientRect(); el.classList.add("nm-no");
          ctx.guide.encourage(wrong >= 2 ? "공처럼 둥근지, 뾰족한지, 기둥 모양인지 봐요." : "모양을 다시 봐요. 어떤 물건과 닮았나요?");
          if (wrong >= 3) { const t = svg.querySelector(`.bg-card[data-i="${idx}"]`); t?.classList.add("nm-glow"); }
        });
      });
    } else await ctx.wait(900);
    who.flipped[idx] = true; ctx.fx.sound.drop();
    const line = bingoLine(who.flipped);
    svg = draw(k, mine && line ? line : null, !mine && line ? line : null);
    if (line) {
      ctx.dock.innerHTML = "";
      if (mine) { ctx.fx.sound.fanfare(); ctx.fx.stamp("빙고!"); ctx.fx.cheer(null, { big: true }); await ctx.guide.praise("빙고! 한 줄을 먼저 뒤집었어요. 내가 이겼어요!"); }
      else { await ctx.guide.encourage("빙고! 이번엔 독쌤이 먼저 한 줄을 뒤집었어요. 다음엔 꼭 이겨요!"); }
      break;
    }
    await ctx.wait(500);
  }
  await ctx.next("끝");
}

export const LESSON = {
  title: "푸리수리와 입체도형 빙고",
  subtitle: "20까지의 수를 세고, 순서대로·거꾸로 이어요",
  coverArt: "🎯",
  doneTitle: "수와 숫자의 탄생 3차시 끝!",
  doneText: "숨은 숫자 찾기, 10개씩 묶어 세기, 순서대로·거꾸로 세기를 모두 해냈어요.",
  steps: [
    { page: "64쪽 · 푸리수리 1", run: p64 },
    { page: "65쪽 · 푸리수리 2", run: p65 },
    { page: "66쪽 · 푸리수리 3", run: p66 },
    { page: "67쪽 · 푸리수리 4", run: p67 },
    { page: "68쪽 · 푸리수리 5", run: p68 },
    { page: "69쪽 · 푸리수리 6", run: p69 },
    { page: "70쪽 · 푸리수리 7", run: p70 },
    { page: "71쪽 · 푸리수리 8", run: p71 },
    { page: "72쪽 · 푸리수리 9", run: p72 },
    { page: "73쪽 · 창의력 Game", run: p73 },
    { page: "74쪽 · 빙고", run: p74 }
  ]
};
