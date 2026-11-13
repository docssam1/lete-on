// A1-2 4단원 큰 수, 작은 수 · 2차시 (원본 85~88쪽)
//  85 재희: 수 카드 5 + 화살판 「1 큰 수」 → 6 ○ · 86 「큰 수, 작은 수」 활동(독쌤이 수 카드 3~18을 뽑고 내가 화살판을 돌려 찾기)
//  87 11 · 1 작은 수 → 10, 12 · 2 큰 수 → 14 · 88 새의 말 → 나무의 수(11·4·7·17) 잇기
//  화살판 칸 배치와 화살 위치는 원본 그림에서 옮겼다.
import { scene, numCard, spinnerSvg, spinTo, pointArrow, numStrip, stripMark, stripHop, SPIN, onHit, matchLines, icon, cardSpin, solveSpin } from "../numbers.js?v=20261115a";
import { kid } from "../art.js?v=20261115a";

const T = (x, y, t, { size = 26, fill = "#25324a", weight = 800, anchor = "middle" } = {}) => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${t}</text>`;
const JAEHEE = { hair: "boy", hairColor: "#3a2418", shirt: "#ff8a3c", bottom: "#e9edf3" };
async function p85(ctx) {
  const pg = await ctx.source("85");
  const svg = scene(ctx, "0 0 900 440", `${numStrip(50, 14, 800)}<g transform="translate(70 170)">${kid({ ...JAEHEE, size: 120 })}</g>${T(130, 352, "재희", { size: 24 })}
    ${numCard(300, 280, 5, { w: 90, h: 110, font: 50, stroke: "#5aa0f0" })}${spinnerSvg(600, 280, 130)}`);
  pointArrow(svg, "1big");
  await ctx.guide.say("재희는 수 카드 5를 뽑았고, 화살판은 1 큰 수가 나왔어요.");
  ctx.setSource(pg?.frames?.[0] || "재희가 찾아야 할 수 카드에 ○표 하세요.");
  stripMark(svg, [5], "#9fd6ff");
  await ctx.choose([4, 6].map((n) => ({ value: String(n), art: `<svg width="80" height="96" viewBox="0 0 80 96">${numCard(40, 48, n, { w: 70, h: 86, font: 42, stroke: n === 4 ? "#b28cf0" : "#f0c419" })}</svg>`, name: "" })),
    { correct: "6", wrongSay: "1 큰 수는 5 바로 다음 수예요.", hint: async () => { ctx.guide.encourage("수 띠에서 5 다음 칸을 봐요."); await stripHop(ctx, svg, 5, 1); }, praise: "맞아요! 5보다 1 큰 수는 6이에요." });
  ctx.fx.stamp("○");
  await ctx.next("다음");
}

// 86쪽 활동: 독쌤이 카드를 뽑고 내가 화살판을 돌려 찾는다(4판, 맞히면 1점)
async function p86(ctx) {
  await ctx.source("86");
  let score = 0;
  for (let round = 1; round <= 4; round++) {
    const card = 3 + Math.floor(Math.random() * 16);       // 수 카드 3~18
    const svg = scene(ctx, "0 0 900 450", `${cardSpin(card)}${T(840, 440, `점수 ${score}`, { size: 26, fill: "#2fb67c", anchor: "end" })}<g class="nm-hit nm-spin"><circle cx="450" cy="290" r="132" fill="transparent"/></g>`);
    svg.querySelector(".nm-spinner").classList.add("nm-hit");
    ctx.guide.say(round === 1 ? "독쌤이 수 카드를 한 장 뽑았어요. 화살판을 눌러서 돌려요!" : "독쌤이 새 수 카드를 뽑았어요. 화살판을 돌려요!");
    ctx.dock.innerHTML = `<p class="sm-docknote">👉 화살판을 눌러 돌려요</p>`;
    await new Promise((r) => { const off = onHit(svg, ".nm-spin, .nm-spinner", () => { off(); r(); }); });
    const key = SPIN[Math.floor(Math.random() * 4)].key;
    const s = SPIN.find((x) => x.key === key);
    const fixed = card + s.d < 1 || card + s.d > 20 ? "1big" : key;
    await spinTo(ctx, svg, fixed);
    let wrongNow = 0; const orig = ctx.mistake; ctx.mistake = () => { wrongNow++; orig(); };
    await solveSpin(ctx, svg, card, fixed);
    ctx.mistake = orig;
    if (!wrongNow) { score++; ctx.fx.sound.good(); await ctx.guide.praise("한 번에 맞혔어요! 1점!"); }
    else await ctx.guide.say("맞았어요! 다음엔 한 번에 맞혀 봐요.");
  }
  scene(ctx, "0 0 900 300", `${Array.from({ length: 4 }, (_, i) => icon("star", 240 + i * 140, 140, 110, i < score ? "#ffd23f" : "#eef1f6")).join("")}${T(450, 270, `4판 중 ${score}점`, { size: 32 })}`);
  ctx.fx.cheer(null, { big: true });
  await ctx.guide.praise("큰 수, 작은 수 놀이를 모두 했어요!");
  await ctx.next("다음");
}

async function p87(ctx) {
  await ctx.source("87");
  for (const [lbl, card, key] of [["(1)", 11, "1small"], ["(2)", 12, "2big"]]) {
    const svg = scene(ctx, "0 0 900 450", `${T(20, 200, lbl, { size: 28, fill: "#4a5a78", anchor: "start" })}${cardSpin(card)}`);
    pointArrow(svg, key);
    await solveSpin(ctx, svg, card, key);
    await ctx.guide.praise("맞아요!");
    await ctx.wait(400);
  }
  await ctx.next("다음");
}

// 88쪽 새의 말 → 나무
const birdArt = (x, y, color) => `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="0" rx="34" ry="22" fill="${color}" stroke="#25324a" stroke-width="2.5"/><circle cx="-24" cy="-10" r="14" fill="${color}" stroke="#25324a" stroke-width="2.5"/><circle cx="-28" cy="-12" r="3" fill="#25324a"/><path d="M-40 -8 l-12 4 l12 4z" fill="#ff8a1c"/><path d="M4 -6 q14 -18 26 -4" fill="none" stroke="#25324a" stroke-width="2.5"/></g>`;
const heartTree = (x, y, n) => `<g><rect x="${x - 7}" y="${y + 30}" width="14" height="44" fill="#9a6a3c"/><path d="M${x} ${y + 42} C${x - 70} ${y - 4} ${x - 40} ${y - 70} ${x} ${y - 36} C${x + 40} ${y - 70} ${x + 70} ${y - 4} ${x} ${y + 42}Z" fill="#8bd17c" stroke="#55b047" stroke-width="3"/>${T(x, y + 6, n, { size: 40, weight: 900 })}</g>`;
async function p88(ctx) {
  await ctx.source("88");
  const L = [["10보다 1 큰 수", "#ffffff", "11"], ["5보다 1 작은 수", "#ffe066", "4"], ["9보다 2 작은 수", "#7fb2e8", "7"], ["15보다 2 큰 수", "#ff9ec7", "17"]]
    .map(([t, c, id], i) => ({ id: t, x: 170, y: 60 + i * 110, html: `${birdArt(70, 60 + i * 110, c)}<rect x="110" y="${40 + i * 110}" width="190" height="42" rx="6" fill="#fff" stroke="#9aa6b8" stroke-width="2.5"/>${T(205, 69 + i * 110, t, { size: 21 })}` }));
  const R = [4, 11, 17, 7].map((n, i) => ({ id: String(n), x: 700, y: 60 + i * 110, html: heartTree(770, 60 + i * 110, n) }));
  for (const l of L) l.x = 230;
  await matchLines(ctx, { vb: "0 0 900 470", left: L, right: R, pairs: { "10보다 1 큰 수": "11", "5보다 1 작은 수": "4", "9보다 2 작은 수": "7", "15보다 2 큰 수": "17" }, dx: 80, say: "새가 말하는 수를 찾아 나무와 선으로 이어요!", wrongSay: "수 띠에서 세어 볼까요? 크면 오른쪽, 작으면 왼쪽으로 가요." });
  await ctx.guide.praise("새들이 모두 자기 나무를 찾았어요!");
  await ctx.next("끝");
}

export const LESSON = {
  title: "큰 수, 작은 수",
  subtitle: "화살판을 돌려 1 크고 작은 수, 2 크고 작은 수를 찾아요",
  coverArt: "🎯",
  doneTitle: "큰 수, 작은 수 2차시 끝!",
  doneText: "1 큰 수는 바로 다음 수, 1 작은 수는 바로 앞의 수예요. 2는 두 칸을 가요.",
  steps: [
    { page: "85쪽", run: p85 },
    { page: "86쪽 · 활동", run: p86 },
    { page: "87쪽", run: p87 },
    { page: "88쪽", run: p88 }
  ]
};
