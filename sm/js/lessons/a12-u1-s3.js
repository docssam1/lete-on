// A1-2 1단원 도형 마을 · 3차시 (원본 19~28쪽) — 푸리수리 1~9 + 창의력 Game 「동그라미 그리기」
//  19 규칙대로 색칠(동그라미 노랑 4 · 세모 빨강 3 · 네모 주황 3) · 20 이름 잇기 · 21 다른 것 하나(네모·세모·평행사변형)
//  22 ▲끼리 세모, ■끼리 네모(4문제, 원본 점 위치) · 23 같은 색 점끼리(빨강 네모 · 파랑 세모 · 주황 네모 · 보라 세모)
//  24·25 그림자 속 도형 모두 · 26 마름모+세모 그림자 → ③ · 27 그림자에 없는 도형 → 사다리꼴 · 28 띠(5·7·10cm)로 동그라미 그리기
import { scene, matchLines } from "../numbers.js?v=20261117a";
import { shape, dotShapes, paintByRule, chooseAll, shadowOf, shapeCard, drawCircle, simplePoly } from "../shapes.js?v=20261117a";

const T = (x, y, t, { size = 26, fill = "#25324a", weight = 800, anchor = "middle" } = {}) => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${t}</text>`;

// ── 19쪽 버섯 집 색칠 ──
async function p19(ctx) {
  await ctx.source("19");
  const blank = (k, body) => `<g class="nm-hit sp-item" data-k="${k}">${body}</g>`;
  const svg = scene(ctx, "0 0 900 520", `<rect x="20" y="10" width="860" height="500" rx="40" fill="#eaf8ff" stroke="#9aa6b8" stroke-width="3"/><rect x="20" y="330" width="860" height="180" rx="30" fill="#7fce6a"/>
    <path d="M150 250 Q320 40 490 250Z" fill="#f2475a" stroke="#c92c3a" stroke-width="3"/>${[[190, 240], [260, 250], [330, 252], [400, 250], [460, 240]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16" fill="#ffd23f"/>`).join("")}
    <rect x="200" y="250" width="240" height="120" fill="#fff6dc" stroke="#c9a36a" stroke-width="3"/><path d="M300 370 v-50 a20 20 0 0 1 40 0 v50z" fill="#8a5a32"/>
    ${blank("c1", `<circle data-paint cx="320" cy="140" r="34" fill="#fff" stroke="#25324a" stroke-width="3"/>`)}${blank("c2", `<circle data-paint cx="220" cy="200" r="22" fill="#fff" stroke="#25324a" stroke-width="3"/>`)}${blank("c3", `<circle data-paint cx="410" cy="195" r="26" fill="#fff" stroke="#25324a" stroke-width="3"/>`)}
    ${blank("q1", `<rect data-paint x="220" y="270" width="50" height="45" fill="#fff" stroke="#25324a" stroke-width="3"/>`)}${blank("q2", `<rect data-paint x="370" y="270" width="50" height="45" fill="#fff" stroke="#25324a" stroke-width="3"/>`)}
    <circle cx="690" cy="230" r="80" fill="#4fae40"/><circle cx="640" cy="190" r="50" fill="#5ec04e"/><circle cx="740" cy="190" r="50" fill="#5ec04e"/>
    ${blank("q3", `<rect data-paint x="672" y="270" width="36" height="140" fill="#fff" stroke="#25324a" stroke-width="3"/>`)}${blank("t2", `<polygon data-paint points="672,380 672,420 630,420" fill="#fff" stroke="#25324a" stroke-width="3"/>`)}${blank("t3", `<polygon data-paint points="708,380 708,420 750,420" fill="#fff" stroke="#25324a" stroke-width="3"/>`)}
    ${blank("c4", `<circle data-paint cx="640" cy="70" r="20" fill="#fff" stroke="#25324a" stroke-width="3"/>`)}${blank("t1", `<polygon data-paint points="656,60 760,50 700,110" fill="#fff" stroke="#25324a" stroke-width="3"/>`)}<path d="M624 66 l-12 4 l12 4z" fill="#ff8a1c"/><circle cx="634" cy="66" r="3" fill="#25324a"/>
    ${[[120, 430], [520, 460], [800, 440], [380, 470]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#fff"/><circle cx="${x}" cy="${y}" r="3" fill="#ffd23f"/>`).join("")}`);
  const items = ["c1", "c2", "c3", "c4"].map((k) => ({ k, want: "y" })).concat(["t1", "t2", "t3"].map((k) => ({ k, want: "r" })), ["q1", "q2", "q3"].map((k) => ({ k, want: "o" })));
  await paintByRule(ctx, svg, items, [{ key: "y", color: "#ffe14d", name: "동그라미" }, { key: "r", color: "#f2475a", name: "세모" }, { key: "o", color: "#ffa94d", name: "네모" }],
    { say: "규칙: 동그라미는 노란색, 세모는 빨간색, 네모는 주황색! 색을 고르고 흰 도형을 눌러요.", wrongSay: "규칙을 다시 볼까요? 모양에 맞는 색을 골라요." });
  await ctx.guide.praise("규칙대로 다 색칠했어요!");
  await ctx.next("다음");
}

// ── 20쪽 이름 잇기 ──
async function p20(ctx) {
  await ctx.source("20");
  const S = [["rtri", "#ffa94d", 180, "tri"], ["circle", "#ffe14d", 0, "round"], ["flatTri", "#ffe14d", 0, "tri"], ["kite", "#c0399b", 30, "quad"], ["square", "#2a6fc4", 0, "quad"]];
  const art = (k, x, y, c, rot) => k === "flatTri" ? `<polygon points="${x - 55},${y + 18} ${x + 55},${y + 18} ${x + 5},${y - 22}" fill="${c}"/>` : shape(k, x, y, 74, { fill: c, rot });
  const L = S.map(([k, c, rot, v], i) => ({ id: `s${i}`, v, x: 170, y: 50 + i * 90, html: art(k, 120, 50 + i * 90, c, rot) }));
  const names = { round: "동그라미", tri: "세모", quad: "네모" };
  const R = ["round", "tri", "quad"].map((k, i) => ({ id: k, x: 640, y: 100 + i * 140, html: `<rect x="690" y="${76 + i * 140}" width="150" height="48" rx="8" fill="#fffde6" stroke="#b6d65a" stroke-width="3" stroke-dasharray="6 4"/>${T(765, 108 + i * 140, names[k], { size: 26 })}` }));
  await matchLines(ctx, { vb: "0 0 900 480", left: L, right: R, pairs: Object.fromEntries(L.map((l) => [l.id, l.v])), dx: 80, multi: true, say: "도형을 누르고 알맞은 이름을 눌러 이어요!", wrongSay: "곧은 선이 몇 개인지 세어 봐요." });
  await ctx.guide.praise("도형 이름을 모두 찾았어요!");
  await ctx.next("다음");
}

// ── 21쪽 다른 것 하나 ──
async function p21(ctx) {
  await ctx.source("21");
  const P = [
    [["circle", 80, 0], ["circle", 110, 0], ["circle", 60, 0], ["square", 70, 0]], "#ffb36b", 3,
    [["rect", 90, 0], ["kite", 90, 20], ["tri", 80, -90], ["square", 80, 0]], "#9b86d6", 2,
    [["tri", 90, 0], ["para", 90, 0], ["rtri", 85, 0], ["tri", 90, 180]], "#8ed37a", 1
  ];
  for (let i = 0; i < 3; i++) {
    const items = P[i * 3], col = P[i * 3 + 1], ans = P[i * 3 + 2];
    scene(ctx, "0 0 900 120", `${T(20, 70, `(${i + 1})`, { size: 28, fill: "#4a5a78", anchor: "start" })}<rect x="100" y="10" width="760" height="100" rx="16" fill="#fffbea" stroke="#f0d070" stroke-width="3"/>`);
    ctx.guide.say("상자 안에서 다른 것 하나를 눌러요.");
    await ctx.choose(items.map(([k, s, rot], j) => ({ value: String(j), art: shapeCard(k, col, Math.round(40 + s * 0.45), rot), name: "" })), { correct: String(ans), wrongSay: "곧은 선의 수와 동그란지를 봐요.", praise: "맞아요! 그것만 모양이 달라요." });
    await ctx.wait(300);
  }
  await ctx.next("다음");
}

// ── 22쪽 ▲끼리 세모, ■끼리 네모 ──
const P22 = [
  [[0.134, 0.136], [0.861, 0.148], [0.496, 0.568]], [[0.494, 0.328], [0.191, 0.563], [0.807, 0.56], [0.494, 0.832]],
  [[0.703, 0.116], [0.105, 0.469], [0.636, 0.711]], [[0.309, 0.156], [0.824, 0.333], [0.201, 0.736], [0.732, 0.864]],
  [[0.475, 0.079], [0.188, 0.909], [0.847, 0.906]], [[0.252, 0.269], [0.758, 0.267], [0.078, 0.674], [0.878, 0.654]],
  [[0.297, 0.116], [0.741, 0.642], [0.201, 0.81]], [[0.59, 0.207], [0.096, 0.4], [0.908, 0.516], [0.54, 0.889]]
];
const markArt = (d) => d.mark === "t" ? `<polygon points="${d.x},${d.y - 11} ${d.x + 11},${d.y + 8} ${d.x - 11},${d.y + 8}" fill="#2a6fc4"/>` : `<rect x="${d.x - 9}" y="${d.y - 9}" width="18" height="18" fill="#e8417f"/>`;
async function p22(ctx) {
  await ctx.source("22");
  const S = 400, X = 250, Y = 20;
  for (let i = 0; i < 4; i++) {
    const tri = P22[i * 2].map(([x, y]) => ({ x: X + x * S, y: Y + y * S, mark: "t" })), sq = P22[i * 2 + 1].map(([x, y]) => ({ x: X + x * S, y: Y + y * S, mark: "s" }));
    const svg = scene(ctx, "0 0 900 440", `${T(30, 50, `(${i + 1})`, { size: 28, fill: "#4a5a78", anchor: "start" })}<rect x="${X - 20}" y="${Y - 10}" width="${S + 40}" height="${S + 20}" rx="12" fill="#fff" stroke="#c9b3e6" stroke-width="3"/>`);
    const dots = [...tri, ...sq];
    await dotShapes(ctx, svg, dots, [
      { n: 3, say: i === 0 ? "세모 모양 점끼리 이어서 세모를 만들어요!" : "세모 모양 점끼리 이어요!", ok: (p) => p.every((k) => k < 3), wrong: "세모 모양 점만 이어요.", stroke: "#2a6fc4", fill: "rgba(42,111,196,.15)" },
      { n: 4, say: "이번엔 네모 모양 점끼리 이어서 네모를 만들어요. 둘레를 따라가요!", ok: (p) => p.every((k) => k >= 3) && simplePoly(p.map((k) => [dots[k].x, dots[k].y])), wrong: "네모 모양 점만, 선이 엇갈리지 않게 이어요.", stroke: "#e8417f" }
    ], { markArt, color: "#7a5ad0" });
    await ctx.guide.praise("세모와 네모를 만들었어요!");
    await ctx.wait(300);
  }
  await ctx.next("다음");
}

// ── 23쪽 같은 색 점끼리 ──
const D23 = { green: [[0.092, 0.08], [0.41, 0.237], [0.078, 0.379]], red: [[0.438, 0.083], [0.253, 0.203], [0.63, 0.234], [0.412, 0.397]], blue: [[0.523, 0.287], [0.833, 0.39], [0.422, 0.648]], orange: [[0.286, 0.564], [0.624, 0.564], [0.123, 0.801], [0.813, 0.8]], purple: [[0.898, 0.624], [0.454, 0.924], [0.898, 0.928]] };
const C23 = { green: "#2fa35a", red: "#f2475a", blue: "#2a6fc4", orange: "#ff9a3c", purple: "#9b6ad6" };
async function p23(ctx) {
  await ctx.source("23");
  const S = 470, X = 215, Y = 10;
  const dots = []; const idx = {};
  for (const [c, pts] of Object.entries(D23)) { idx[c] = []; for (const [x, y] of pts) { idx[c].push(dots.length); dots.push({ x: X + x * S, y: Y + y * S, color: C23[c] }); } }
  const g = idx.green.map((k) => `${dots[k].x},${dots[k].y}`).join(" ");
  const svg = scene(ctx, "0 0 900 500", `<rect x="${X - 20}" y="${Y - 5}" width="${S + 40}" height="${S + 10}" rx="12" fill="#fffef6" stroke="#f0d070" stroke-width="3"/><polygon points="${g}" fill="none" stroke="#c0392b" stroke-width="4"/>`);
  const goal = (c, n, say) => ({ n, say, ok: (p) => p.every((k) => idx[c].includes(k)) && (n === 3 || simplePoly(p.map((k) => [dots[k].x, dots[k].y]))), wrong: "같은 색 점만, 선이 엇갈리지 않게 이어요.", stroke: C23[c] });
  await dotShapes(ctx, svg, dots, [goal("red", 4, "초록 점은 보기처럼 이어져 있어요. 빨간 점끼리 이어 볼까요?"), goal("blue", 3, "이번엔 파란 점끼리!"), goal("orange", 4, "주황 점끼리 이어요!"), goal("purple", 3, "보라 점끼리 이어요!")], { color: "#25324a" });
  await ctx.guide.praise("세모 3개, 네모 2개가 생겼어요!");
  await ctx.next("다음");
}

// ── 24·25 그림자 속 도형 ──
async function shadowAll(ctx, label, parts, opts, ans) {
  scene(ctx, "0 0 900 280", `${T(20, 40, label, { size: 26, fill: "#4a5a78", anchor: "start" })}<g transform="translate(340 20) scale(1.2)"><rect x="4" y="4" width="192" height="192" rx="14" fill="#fff" stroke="#f2a7c8" stroke-width="4"/>${shadowOf(parts)}</g>
    <path d="M600 140 h80" stroke="#9aa6b8" stroke-width="5"/><path d="M672 128 l14 12 l-14 12" fill="none" stroke="#9aa6b8" stroke-width="5"/>`);
  await chooseAll(ctx, opts.map(([k, c, rot], j) => ({ value: String(j), art: shapeCard(k, c, 76, rot || 0) })), ans, { say: "겹쳐 있는 도형을 모두 눌러요!", wrongSay: "그림자의 모서리와 둥근 곳을 잘 봐요." });
  await ctx.guide.praise("맞아요!");
  await ctx.wait(300);
}
async function p24(ctx) {
  await ctx.source("24");
  const O = [["square", "#7fd0f0"], ["tri", "#ff9ec7"], ["circle", "#b6e88a"]];
  await shadowAll(ctx, "(1)", [{ kind: "tri", x: 90, y: 80, s: 120, rot: 180 }, { kind: "circle", x: 130, y: 130, s: 90 }], O, ["1", "2"]);
  await shadowAll(ctx, "(2)", [{ kind: "square", x: 100, y: 75, s: 95, rot: 45 }, { kind: "tri", x: 100, y: 140, s: 100, rot: 180 }], O, ["0", "1"]);
  await shadowAll(ctx, "(3)", [{ kind: "circle", x: 75, y: 100, s: 90 }, { kind: "square", x: 125, y: 100, s: 100 }], O, ["0", "2"]);
  await ctx.next("다음");
}
async function p25(ctx) {
  await ctx.source("25");
  await shadowAll(ctx, "(1)", [{ kind: "circle", x: 75, y: 70, s: 80 }, { kind: "rect", x: 120, y: 125, s: 120 }, { kind: "tri", x: 70, y: 135, s: 90, rot: 200 }], [["circle", "#ffb3c8"], ["para", "#b6e88a"], ["tri", "#ffa94d", 200], ["rect", "#9b86d6"]], ["0", "2", "3"]);
  await shadowAll(ctx, "(2)", [{ kind: "circle", x: 70, y: 70, s: 80 }, { kind: "square", x: 130, y: 95, s: 85 }, { kind: "rtri", x: 100, y: 140, s: 110, rot: 270 }], [["circle", "#ffb3c8"], ["square", "#9b86d6"], ["rtri", "#7fd0f0", 270], ["tri", "#7f93b0"]], ["0", "1", "2"]);
  await ctx.next("다음");
}

// ── 26쪽 겹쳐진 그림자 고르기 ──
async function p26(ctx) {
  await ctx.source("26");
  scene(ctx, "0 0 900 220", `<rect x="200" y="20" width="500" height="180" rx="16" fill="#fff" stroke="#f2a7b8" stroke-width="3"/>${shape("rhombus", 300, 110, 110, { fill: "#5ec8f0", rot: -30 })}${shape("tri", 420, 115, 90, { fill: "#a8d860" })}
    <path d="M480 110 h50" stroke="#9aa6b8" stroke-width="5"/><rect x="550" y="45" width="120" height="130" rx="8" fill="#fff" stroke="#25324a" stroke-width="2" stroke-dasharray="6 4"/>${T(610, 130, "?", { size: 64, fill: "#25324a" })}`);
  const C = [
    [{ kind: "rhombus", x: 80, y: 100, s: 120, rot: 90 }, { kind: "square", x: 130, y: 100, s: 70 }],
    [{ kind: "circle", x: 80, y: 90, s: 90 }, { kind: "para", x: 120, y: 120, s: 100 }],
    [{ kind: "rhombus", x: 80, y: 100, s: 120, rot: 90 }, { kind: "tri", x: 130, y: 100, s: 90, rot: 90 }]
  ];
  ctx.guide.say("마름모와 세모가 겹쳐진 그림자를 골라요.");
  await ctx.choose(C.map((parts, i) => ({ value: String(i + 1), art: `<svg width="110" height="110" viewBox="0 0 200 200">${shadowOf(parts)}</svg>`, name: ["①", "②", "③"][i] })), { correct: "3", wrongSay: "세모의 뾰족한 곳이 보이는 그림자를 찾아요.", praise: "맞아요! ③에 마름모와 세모가 겹쳐 있어요." });
  await ctx.next("다음");
}

// ── 27쪽 그림자에 없는 도형 ──
async function p27(ctx) {
  await ctx.source("27");
  scene(ctx, "0 0 900 240", `<rect x="250" y="10" width="400" height="220" rx="16" fill="#fff" stroke="#f0d070" stroke-width="4"/><g transform="translate(250 10) scale(2)">${shadowOf([{ kind: "rtri", x: 50, y: 60, s: 70 }, { kind: "circle", x: 90, y: 45, s: 55 }, { kind: "square", x: 115, y: 65, s: 60 }, { kind: "tri", x: 160, y: 75, s: 60, rot: 90 }])}</g>`);
  ctx.guide.say("그림자에 없는 도형을 하나 찾아 눌러요.");
  await ctx.choose([["rtri", "#5ec8f0", 0], ["circle", "#ff9a3c", 0], ["square", "#7f93b0", 0], ["trap", "#2fa35a", 0], ["tri", "#ff8fbf", 90]].map(([k, c, rot], i) => ({ value: String(i), art: shapeCard(k, c, 72, rot), name: "" })), { correct: "3", wrongSay: "그 도형은 그림자에 있어요. 다른 것을 찾아요.", praise: "맞아요! 사다리꼴은 그림자에 없어요." });
  await ctx.next("다음");
}

// ── 28쪽 동그라미 그리기 ──
async function p28(ctx) {
  const pg = await ctx.source("28");
  for (const [i, t] of [pg?.text2, pg?.text3].entries()) if (t) { ctx.setSource(t); await ctx.guide.say(t, { display: false }); void i; }
  const svg = scene(ctx, "0 0 900 480", `<rect x="10" y="10" width="880" height="460" rx="18" fill="#fffef8" stroke="#e6dcc6" stroke-width="3"/>`);
  const strips = [["5cm", 90, "#e8417f"], ["7cm", 126, "#2a6fc4"], ["10cm", 180, "#2fa35a"]];
  for (const [i, [label, r, col]] of strips.entries()) {
    ctx.guide.say(i === 0 ? "가운데 핀은 그대로 두고, 반짝이는 연필을 끌어서 한 바퀴 돌려요!" : "이번엔 더 긴 띠예요. 한 바퀴 돌려 볼까요?");
    await drawCircle(ctx, svg, { cx: 450, cy: 240, r, color: col, label });
    ctx.fx.cheer(null);
    await ctx.wait(400);
  }
  await ctx.guide.praise("띠가 길수록 더 큰 동그라미가 그려져요!");
  await ctx.next("끝");
}

export const LESSON = {
  title: "푸리수리와 동그라미 그리기",
  subtitle: "세모·네모·동그라미를 찾고, 이어 만들고, 그려요",
  coverArt: "⭕",
  doneTitle: "도형 마을 3차시 끝!",
  doneText: "곧은 선 3개는 세모, 4개는 네모, 동그란 모양은 동그라미! 띠가 길수록 동그라미가 커져요.",
  steps: [
    { page: "19쪽 · 푸리수리 1", run: p19 },
    { page: "20쪽 · 푸리수리 2", run: p20 },
    { page: "21쪽 · 푸리수리 3", run: p21 },
    { page: "22쪽 · 푸리수리 4", run: p22 },
    { page: "23쪽 · 푸리수리 5", run: p23 },
    { page: "24쪽 · 푸리수리 6", run: p24 },
    { page: "25쪽 · 푸리수리 7", run: p25 },
    { page: "26쪽 · 푸리수리 8", run: p26 },
    { page: "27쪽 · 푸리수리 9", run: p27 },
    { page: "28쪽 · 창의력 Game", run: p28 }
  ]
};
