// A1-2 1단원 도형 마을 · 2차시 (원본 14~18쪽)
//  14 점 3개를 이어 세모, 점 4개를 이어 네모 → 세모는 파란색, 네모는 노란색(7개 도형, 원본 꼭짓점 그대로)
//  15 「도형 릴레이」 활동: 점판에서 여러 가지 세모 3개, 네모 3개 만들기(앵글렉스 대신 점 잇기)
//  16 범인을 찾아라: 감시 카메라 그림자 = 사다리꼴 + 직각삼각형 · 17 「도형 그림자」 카드 게임(도형 카드 A1-2-2, 그림자 카드 A1-2-3)
//  18 그림자 카드 세 장 — (1) 동그라미+세모 (2) 세모+네모 (3) 동그라미+네모+평행사변형
import { scene, onHit } from "../numbers.js?v=20261123a";
import { shape, shapeFriend, dotShapes, paintByRule, chooseAll, shadowOf, shapeCard, simplePoly } from "../shapes.js?v=20261123a";

const T = (x, y, t, { size = 26, fill = "#25324a", weight = 800, anchor = "middle" } = {}) => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${t}</text>`;
// ── 14쪽 ──
const BOX = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="#fff" stroke="#f0b860" stroke-width="3"/>`;
const SHAPES14 = [
  ["tri", [[0.113, 0.155], [0.113, 0.374], [0.268, 0.374]]], ["quad", [[0.376, 0.223], [0.466, 0.181], [0.428, 0.425], [0.34, 0.46]]],
  ["quad", [[0.622, 0.187], [0.711, 0.187], [0.753, 0.374], [0.583, 0.377]]], ["tri", [[0.902, 0.223], [0.815, 0.5], [0.903, 0.768]]],
  ["quad", [[0.041, 0.615], [0.179, 0.615], [0.179, 0.832], [0.041, 0.832]]], ["tri", [[0.471, 0.604], [0.414, 0.808], [0.297, 0.811]]],
  ["quad", [[0.573, 0.594], [0.667, 0.666], [0.7, 0.84], [0.568, 0.843]]]
];
async function p14(ctx) {
  const pg = await ctx.source("14");
  const A = [[0.235, 0.172], [0.837, 0.476], [0.158, 0.833]].map(([x, y]) => ({ x: 60 + x * 340, y: 40 + y * 340 }));
  const B = [[0.174, 0.16], [0.806, 0.217], [0.178, 0.79], [0.811, 0.849]].map(([x, y]) => ({ x: 500 + x * 340, y: 40 + y * 340 }));
  const svg = scene(ctx, "0 0 900 420", `${BOX(60, 40, 340, 340)}${BOX(500, 40, 340, 340)}`);
  await dotShapes(ctx, svg, [...A, ...B], [
    { n: 3, say: "왼쪽 점 3개를 차례로 누르고, 처음 점을 다시 누르면 세모가 돼요!", ok: (p) => p.every((i) => i < 3) },
    { n: 4, say: "오른쪽 점 4개를 이어서 네모를 그려요. 선이 엇갈리지 않게 둘레를 따라가요!", ok: (p) => p.every((i) => i >= 3) && simplePoly(p.map((i) => [B[i - 3].x, B[i - 3].y])), wrong: "선이 엇갈렸어요. 둘레를 따라 차례로 이어요." }
  ]);
  await ctx.guide.praise("점 3개로 세모, 점 4개로 네모를 그렸어요!");
  if (pg?.text2) { ctx.setSource(pg.text2); await ctx.guide.say(pg.text2, { display: false }); }
  const W = 860, H = 380;
  const svg2 = scene(ctx, `0 0 ${W + 40} ${H + 40}`, `<rect x="20" y="20" width="${W}" height="${H}" rx="16" fill="#fff" stroke="#7fc0ea" stroke-width="3" stroke-dasharray="8 6"/>
    ${SHAPES14.map(([kind, pts], i) => `<g class="nm-hit sp-item" data-k="s${i}"><polygon data-paint points="${pts.map(([x, y]) => `${20 + x * W},${20 + y * H}`).join(" ")}" fill="#fff" stroke="#25324a" stroke-width="3" stroke-linejoin="round"/></g>`).join("")}`);
  await paintByRule(ctx, svg2, SHAPES14.map(([kind], i) => ({ k: `s${i}`, want: kind === "tri" ? "blue" : "yellow" })), [{ key: "blue", color: "#4a90e2", name: "파란색(세모)" }, { key: "yellow", color: "#ffd23f", name: "노란색(네모)" }],
    { say: "색을 고르고 도형을 눌러 색칠해요. 세모는 파란색, 네모는 노란색!", wrongSay: "곧은 선을 세어 봐요. 3개면 세모, 4개면 네모예요." });
  await ctx.guide.praise("세모는 파란색, 네모는 노란색으로 다 칠했어요!");
  await ctx.next("다음");
}

// ── 15쪽 도형 릴레이: 점판(4×4)에서 서로 다른 세모 3개, 네모 3개 ──
async function p15(ctx) {
  await ctx.source("15");
  const G = 4, gap = 90, x0 = 170, y0 = 50;
  const dots = Array.from({ length: G * G }, (_, i) => ({ x: x0 + (i % G) * gap, y: y0 + Math.floor(i / G) * gap }));
  for (const [kind, n, word] of [["tri", 3, "세모"], ["quad", 4, "네모"]]) {
    const made = [];
    for (let k = 0; k < 3; k++) {
      const svg = scene(ctx, "0 0 760 380", `<rect x="${x0 - 40}" y="${y0 - 40}" width="${gap * 3 + 80}" height="${gap * 3 + 80}" rx="18" fill="#fff8e6" stroke="#e6c84a" stroke-width="3"/>
        ${T(620, 60, `${word} ${k + 1} / 3`, { size: 28, fill: kind === "tri" ? "#2a6fc4" : "#d98a00" })}${made.map((m, i) => `<polygon points="${m.map((j) => `${560 + (dots[j].x - x0) * 0.42 + (i % 2) * 120},${110 + (dots[j].y - y0) * 0.42 + Math.floor(i / 2) * 130}`).join(" ")}" fill="${kind === "tri" ? "#bcd8ff" : "#ffe9a0"}" stroke="#25324a" stroke-width="2"/>`).join("")}`);
      const [path] = await dotShapes(ctx, svg, dots, [{
        n, say: k === 0 ? (kind === "tri" ? "점을 3개 이어서 세모를 만들어요. 여러 가지 세모를 만들어 봐요!" : "이번엔 점 4개로 네모! 여러 가지 네모를 만들어 봐요!") : "앞에서 만든 것과 다른 모양으로 만들어 봐요!",
        ok: (p) => simplePoly(p.map((i) => [dots[i].x, dots[i].y])) && !made.some((m) => m.length === p.length && [...m].sort().join() === [...p].sort().join()),
        wrong: "선이 엇갈리거나 한 줄로 놓였거나, 앞에서 만든 것과 같아요. 다르게 만들어 봐요.", fill: kind === "tri" ? "rgba(74,144,226,.25)" : "rgba(255,210,63,.35)"
      }]);
      made.push(path);
      await ctx.wait(500);
    }
    await ctx.guide.praise(kind === "tri" ? "여러 가지 세모를 만들었어요! 모양은 달라도 곧은 선 3개면 모두 세모예요." : "여러 가지 네모를 만들었어요! 곧은 선 4개면 모두 네모예요.");
  }
  await ctx.next("다음");
}

// ── 16쪽 범인을 찾아라 ──
async function p16(ctx) {
  const pg = await ctx.source("16");
  const poly = [[0.148, 0.867], [0.258, 0.483], [0.49, 0.483], [0.49, 0.105], [0.841, 0.747], [0.629, 0.747], [0.654, 0.867]].map(([x, y]) => `${330 + x * 260},${40 + y * 220}`).join(" ");
  scene(ctx, "0 0 920 320", `<rect x="320" y="30" width="280" height="240" fill="#fff" stroke="#6a7385" stroke-width="10"/><polygon points="${poly}" fill="#8a9099"/>${T(460, 300, "감시 카메라 사진", { size: 22, fill: "#4a5a78" })}
    ${shapeFriend("circle", 170, 140, 110, "#ffb07a")}${shapeFriend("square", 760, 130, 100, "#a8dcf0")}`);
  await ctx.guide.say("사진에 찍힌 그림자를 잘 봐요. 어떤 도형들이 겹쳐 있을까요?");
  if (pg?.text2) ctx.setSource(pg.text2);
  await chooseAll(ctx, [["trap", "#ffe066", 0], ["tri", "#7fb2e8", 0], ["rtri", "#c9a8f0", 0], ["square", "#ffb36b", 0]].map(([k, c], i) => ({ value: String(i + 1), art: shapeCard(k, c, 84) })), ["1", "3"],
    { say: "범인이라고 생각되는 도형을 모두 눌러요. 다 골랐으면 아래 단추를 눌러요!", hint: () => ctx.guide.encourage("그림자 아래쪽은 사다리꼴 모양, 위쪽은 뾰족한 세모 모양이에요.") });
  await ctx.guide.praise("범인은 노란 사다리꼴과 보라 세모였어요!");
  await ctx.next("다음");
}

// ── 도형 카드(A1-2-2) 9장과 그림자 카드(A1-2-3) 9장 ──
const CARDS = { rtri: ["rtri", "#b6d65a", 0], wrect: ["rect", "#8f9ad8", 0], tri: ["tri", "#bcd0f5", 0], trect: ["tall", "#ffc2c2", 0], scirc: ["circle", "#6cc4b8", 0], trap: ["trap", "#ffe066", 0], sq: ["square", "#ffc98a", 0], bcirc: ["circle", "#d9a85a", 0], rho: ["rhombus", "#4cc4f0", 0] };
const NAME = { rtri: "직각 세모", wrect: "가로 네모", tri: "세모", trect: "세로 네모", scirc: "작은 동그라미", trap: "사다리꼴", sq: "네모", bcirc: "큰 동그라미", rho: "마름모" };
const SHADOW_CARDS = [
  { a: ["rtri", "wrect"], parts: [{ kind: "rtri", x: 100, y: 78, s: 110, rot: 90 }, { kind: "rect", x: 100, y: 140, s: 130 }] },
  { a: ["tri", "sq"], parts: [{ kind: "tri", x: 80, y: 80, s: 110 }, { kind: "square", x: 120, y: 125, s: 100 }] },
  { a: ["trap", "scirc"], parts: [{ kind: "trap", x: 100, y: 90, s: 140 }, { kind: "circle", x: 100, y: 145, s: 50 }] },
  { a: ["bcirc", "trect"], parts: [{ kind: "circle", x: 80, y: 100, s: 100 }, { kind: "tall", x: 135, y: 100, s: 120 }] },
  { a: ["rho", "bcirc"], parts: [{ kind: "rhombus", x: 85, y: 75, s: 120, rot: -25 }, { kind: "circle", x: 125, y: 125, s: 90 }] },
  { a: ["bcirc", "wrect", "tri"], parts: [{ kind: "circle", x: 100, y: 60, s: 80 }, { kind: "rect", x: 100, y: 105, s: 120 }, { kind: "tri", x: 100, y: 150, s: 80 }] },
  { a: ["rho", "bcirc", "tri"], parts: [{ kind: "rhombus", x: 75, y: 70, s: 110, rot: -25 }, { kind: "circle", x: 130, y: 105, s: 90 }, { kind: "tri", x: 70, y: 145, s: 80 }] },
  { a: ["sq", "rtri", "bcirc"], parts: [{ kind: "square", x: 75, y: 75, s: 90 }, { kind: "rtri", x: 100, y: 95, s: 110, rot: 90 }, { kind: "circle", x: 140, y: 140, s: 80 }] },
  { a: ["bcirc", "sq", "tri"], parts: [{ kind: "circle", x: 75, y: 70, s: 85 }, { kind: "square", x: 135, y: 95, s: 85 }, { kind: "tri", x: 100, y: 145, s: 80 }] }
];
const shadowSvg = (parts, size = 200) => `<svg width="${size}" height="${size}" viewBox="0 0 200 200" aria-hidden="true"><rect x="4" y="4" width="192" height="192" rx="14" fill="#fff" stroke="#d6dbe3" stroke-width="4"/>${shadowOf(parts, "#a9afb8")}</svg>`;
async function p17(ctx) {
  await ctx.source("17");
  ctx.guide.say("독쌤이 그림자 카드를 한 장 뽑을게요. 어떤 도형 카드가 겹쳐 있는지 골라요. 맞히면 1점!");
  let score = 0;
  const order = [...SHADOW_CARDS].sort(() => Math.random() - 0.5).slice(0, 4);
  for (const card of order) {
    scene(ctx, "0 0 900 300", `<g transform="translate(350 40) scale(1.1)">${shadowOf(card.parts, "#a9afb8")}</g><rect x="350" y="40" width="220" height="220" rx="16" fill="none" stroke="#d6dbe3" stroke-width="4"/>${T(460, 290, "그림자 카드", { size: 20, fill: "#4a5a78" })}${T(860, 40, `${score}점`, { size: 28, fill: "#2fb67c", anchor: "end" })}`);
    let first = true; const orig = ctx.mistake; ctx.mistake = () => { first = false; orig(); };
    await chooseAll(ctx, Object.keys(CARDS).map((k) => ({ value: k, art: shapeCard(CARDS[k][0], CARDS[k][1], 64), name: "" })), card.a, { say: null, wrongSay: "그림자의 모서리와 둥근 곳을 잘 봐요." });
    ctx.mistake = orig;
    if (first) { score++; ctx.fx.sound.good(); await ctx.guide.praise("한 번에 맞혔어요! 1점!"); } else await ctx.guide.say("맞았어요! 다음엔 한 번에 맞혀 봐요.");
  }
  await ctx.guide.praise("도형 그림자 놀이 끝! 겹친 도형을 잘 찾았어요.");
  void NAME; void shadowSvg;
  await ctx.next("다음");
}

// ── 18쪽 ──
async function p18(ctx) {
  await ctx.source("18");
  const P = [
    { parts: [{ kind: "circle", x: 100, y: 75, s: 90 }, { kind: "tri", x: 100, y: 140, s: 100 }], opts: [["circle", "#ffe066"], ["tri", "#7fb2e8"], ["square", "#ffb36b"]], a: ["0", "1"] },
    { parts: [{ kind: "tri", x: 80, y: 85, s: 110 }, { kind: "square", x: 125, y: 125, s: 95 }], opts: [["circle", "#ffe066"], ["tri", "#7fb2e8"], ["square", "#ffb36b"]], a: ["1", "2"] },
    { parts: [{ kind: "circle", x: 70, y: 75, s: 85 }, { kind: "para", x: 135, y: 80, s: 110 }, { kind: "square", x: 100, y: 135, s: 80 }], opts: [["circle", "#ffe066"], ["tri", "#7fb2e8"], ["square", "#ffb36b"], ["para", "#d9c2f0"]], a: ["0", "2", "3"] }
  ];
  for (const [i, p] of P.entries()) {
    scene(ctx, "0 0 900 280", `${T(20, 40, `(${i + 1})`, { size: 26, fill: "#4a5a78", anchor: "start" })}<g transform="translate(340 20) scale(1.2)"><rect x="4" y="4" width="192" height="192" rx="14" fill="#fff" stroke="#d6dbe3" stroke-width="4"/>${shadowOf(p.parts)}</g>
      <path d="M600 140 h80" stroke="#9aa6b8" stroke-width="5"/><path d="M672 128 l14 12 l-14 12" fill="none" stroke="#9aa6b8" stroke-width="5"/>`);
    await chooseAll(ctx, p.opts.map(([k, c], j) => ({ value: String(j), art: shapeCard(k, c, 76) })), p.a, { say: "겹쳐 있는 도형을 모두 눌러요!", wrongSay: "그림자의 모서리와 둥근 곳을 잘 봐요." });
    await ctx.guide.praise("맞아요!");
    await ctx.wait(300);
  }
  await ctx.next("끝");
}

export const LESSON = {
  title: "도형 릴레이와 범인 찾기",
  subtitle: "점을 이어 세모·네모를 만들고, 겹친 도형의 그림자를 찾아요",
  coverArt: "🔎",
  doneTitle: "도형 마을 2차시 끝!",
  doneText: "세모와 네모는 모양이 여러 가지예요. 그림자의 모서리와 둥근 곳을 보면 겹친 도형을 찾을 수 있어요.",
  steps: [
    { page: "14쪽", run: p14 },
    { page: "15쪽 · 활동", run: p15 },
    { page: "16쪽", run: p16 },
    { page: "17쪽 · 활동", run: p17 },
    { page: "18쪽", run: p18 }
  ]
};
void shape; void onHit;
