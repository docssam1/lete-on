// A1-2 4단원 큰 수, 작은 수 · 3차시 (원본 89~96쪽) — 푸리수리 1~8 + 창의력 Game 「그림자의 주인을 찾아라!」
//  89 딸기 11·12 → 12쪽, 가지 9·7 → 9쪽 · 90 큐브 짝짓기 5>3, 6>4, 7>6 · 91 더 큰 수(5·12·18·20), 더 작은 수(1·6·15·10)
//  92 8·1 큰 수 → 9, 4·2 작은 수 → 2 · 93 16·1 작은 수 → 15, 18·2 큰 수 → 20
//  94 7: 6과 8, 9: 8과 10, 5: 3과 7 만큼 색칠 · 95 「3보다 2 큰 수」 → 5 … 잇기
//  96 그림자의 주인: 원본의 속성 카드·그림자 카드는 책 부록에 없는 별도 교구 → 원본 보기(뱀)처럼 동물 그림 9장과 그 그림자를 코드로 그림
import { esc, scene, icon, onHit, pickArt, pairUp, colorN, matchLines, numStrip, cardSpin, solveSpin, pointArrow } from "../numbers.js?v=20261115a";

const T = (x, y, t, { size = 26, fill = "#25324a", weight = 800, anchor = "middle" } = {}) => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${t}</text>`;

// ── 89쪽 더 많은 쪽 ──
const rowsAt = (counts, x0, y0, gap) => counts.flatMap((n, r) => Array.from({ length: n }, (_, c) => [x0 + c * gap, y0 + r * gap]));
const EGG_A = [[120, 90], [190, 80], [260, 95], [330, 85], [150, 160], [230, 150], [300, 165], [180, 225], [270, 225]];
const EGG_B = [[580, 90], [660, 100], [740, 85], [600, 170], [700, 160], [780, 170], [650, 230]];
async function p89(ctx) {
  await ctx.source("89");
  const probs = [
    { lbl: "(1)", kind: "strawberry", a: rowsAt([5, 5, 1], 110, 80, 62), b: rowsAt([5, 5, 2], 570, 80, 62), ans: "b" },
    { lbl: "(2)", kind: "eggplant", a: EGG_A, b: EGG_B, ans: "a" }
  ];
  for (const p of probs) {
    const svg = scene(ctx, "0 0 900 340", `${T(20, 34, p.lbl, { size: 26, fill: "#4a5a78", anchor: "start" })}
      <g class="nm-hit nm-box" data-s="a"><rect x="60" y="40" width="380" height="280" rx="18" fill="#fff" stroke="#f2a7b8" stroke-width="4"/>${p.a.map(([x, y]) => icon(p.kind, x, y, 52)).join("")}</g>
      <g class="nm-hit nm-box" data-s="b"><rect x="500" y="40" width="380" height="280" rx="18" fill="#fff" stroke="#f2a7b8" stroke-width="4"/>${p.b.map(([x, y]) => icon(p.kind, x, y, 52)).join("")}</g><g class="nm-marks"></g>`);
    ctx.guide.say("개수를 세어 보고, 더 많은 쪽 상자를 눌러요.");
    let wrong = 0;
    await new Promise((r) => {
      const off = onHit(svg, ".nm-box", (el) => {
        if (el.dataset.s === p.ans) { off(); el.querySelector("rect").setAttribute("stroke", "#e8417f"); el.querySelector("rect").setAttribute("stroke-width", "8"); ctx.fx.cheer(null); r(); return; }
        wrong++; ctx.mistake(); ctx.fx.sound.bad();
        ctx.guide.encourage("하나씩 세어 볼까요? 번호를 붙여 줄게요.");
        if (wrong === 1) {
          const m = svg.querySelector(".nm-marks");
          for (const [side, pts] of [["a", p.a], ["b", p.b]]) pts.forEach(([x, y], i) => m.insertAdjacentHTML("beforeend", `<circle cx="${x + 20}" cy="${y - 20}" r="12" fill="${side === "a" ? "#2fb67c" : "#2a6fc4"}"/><text x="${x + 20}" y="${y - 15}" text-anchor="middle" font-size="14" font-weight="900" fill="#fff">${i + 1}</text>`));
        }
      });
    });
    await ctx.guide.praise(p.ans === "b" ? "맞아요! 딸기 12개가 11개보다 많아요." : "맞아요! 가지 9개가 7개보다 많아요.");
    ctx.fx.stamp("○");
    await ctx.wait(500);
  }
  await ctx.next("다음");
}

async function p90(ctx) {
  await ctx.source("90");
  const P = [[5, 3, ["pink", "blue"], ["#ffd6e6", "#d6e2ff"]], [4, 6, ["green", "yellow"], ["#d6f5c4", "#fff3a8"]], [6, 7, ["orange", "brown"], ["#ffe1c2", "#ead6c2"]]];
  for (const [i, [a, b, colors, stars]] of P.entries()) {
    await pairUp(ctx, a, b, { manual: true, colors, stars, label: T(450, 36, `(${i + 1})`, { size: 26, fill: "#4a5a78" }) });
    await ctx.wait(500);
  }
  await ctx.next("다음");
}

async function p91(ctx) {
  const pg = await ctx.source("91");
  for (const [mode, sets] of [["big", [[2, 5], [12, 9], [14, 18], [20, 19]]], ["small", [[3, 1], [8, 6], [15, 17], [10, 13]]]]) {
    if (mode === "small" && pg?.text2) { ctx.setSource(pg.text2); await ctx.guide.say(pg.text2, { display: false }); }
    for (const [a, b] of sets) {
      scene(ctx, "0 0 900 260", `${icon("star", 350, 130, 190, "#fff")}${T(350, 146, a, { size: 52, weight: 900 })}${icon("star", 550, 130, 190, "#fff")}${T(550, 146, b, { size: 52, weight: 900 })}`);
      ctx.guide.say(mode === "big" ? "더 큰 수에 색칠해요. 더 큰 수를 눌러요." : "더 작은 수에 색칠해요. 더 작은 수를 눌러요.");
      const ans = mode === "big" ? Math.max(a, b) : Math.min(a, b);
      await ctx.choose([a, b].map((n) => ({ value: String(n), art: pickArt("star", n, "#fff", 90), name: "" })), { correct: String(ans), wrongSay: mode === "big" ? "1부터 세어 갈 때 더 나중에 나오는 수가 커요." : "1부터 세어 갈 때 먼저 나오는 수가 작아요.", praise: "맞아요!" });
      await ctx.wait(300);
    }
  }
  await ctx.next("다음");
}

async function spinPage(ctx, no, probs) {
  await ctx.source(no);
  for (const [lbl, card, key] of probs) {
    const svg = scene(ctx, "0 0 900 450", `${T(20, 200, lbl, { size: 28, fill: "#4a5a78", anchor: "start" })}${cardSpin(card)}`);
    pointArrow(svg, key);
    await solveSpin(ctx, svg, card, key);
    await ctx.guide.praise("맞아요!");
    await ctx.wait(400);
  }
  await ctx.next("다음");
}
const p92 = (ctx) => spinPage(ctx, "92", [["(1)", 8, "1big"], ["(2)", 4, "2small"]]);
const p93 = (ctx) => spinPage(ctx, "93", [["(1)", 16, "1small"], ["(2)", 18, "2big"]]);

// ── 94쪽 개수만큼 색칠 ──
const frame10 = (x0, y0) => Array.from({ length: 10 }, (_, i) => ({ x: x0 + 34 + (i % 5) * 52, y: y0 + 34 + Math.floor(i / 5) * 52 }));
async function p94(ctx) {
  await ctx.source("94");
  const P = [[7, "1 작은 수", "1 큰 수", 6, 8, "#ffe066", true], [9, "1 작은 수", "1 큰 수", 8, 10, "#ffb3c8", false], [5, "2 작은 수", "2 큰 수", 3, 7, "#b6e8a0", false]];
  for (const [i, [c, lw, rw, L, R, col, pre]] of P.entries()) {
    const left = frame10(40, 120), right = frame10(560, 120);
    const svg = scene(ctx, "0 0 900 300", `${T(20, 40, `(${i + 1})`, { size: 26, fill: "#4a5a78", anchor: "start" })}
      <rect x="40" y="120" width="300" height="140" rx="14" fill="#fff" stroke="${col}" stroke-width="5"/><rect x="560" y="120" width="300" height="140" rx="14" fill="#fff" stroke="${col}" stroke-width="5"/>
      <circle cx="450" cy="190" r="50" fill="${col}"/>${T(450, 208, c, { size: 50, weight: 900 })}
      <path d="M396 190 H350" stroke="#e8604f" stroke-width="4"/><path d="M356 182 l-12 8 l12 8" fill="none" stroke="#e8604f" stroke-width="4"/>${T(372, 172, lw, { size: 18 })}
      <path d="M504 190 H550" stroke="#e8604f" stroke-width="4"/><path d="M544 182 l12 8 l-12 8" fill="none" stroke="#e8604f" stroke-width="4"/>${T(528, 172, rw, { size: 18 })}
      ${pre ? left.map((s, k) => `<circle cx="${s.x}" cy="${s.y}" r="21" fill="${k < L ? col : "#fff"}" stroke="#9aa6b8" stroke-width="3"/>`).join("") : ""}`);
    if (!pre) {
      await colorN(ctx, { svg, slots: left, n: L, kind: "circle", size: 42, color: col, say: lw === "1 작은 수" ? "왼쪽 상자에는 1 작은 수만큼 색칠해요." : "왼쪽 상자에는 2 작은 수만큼 색칠해요." });
      ctx.fx.sound.good();
    } else await ctx.guide.say("왼쪽은 7보다 1 작은 수, 6만큼 색칠되어 있어요.");
    await colorN(ctx, { svg, slots: right, n: R, kind: "circle", size: 42, color: col, say: rw === "1 큰 수" ? "오른쪽 상자에는 1 큰 수만큼 색칠해요." : "오른쪽 상자에는 2 큰 수만큼 색칠해요." });
    ctx.fx.cheer(null);
    await ctx.guide.praise("알맞게 색칠했어요!");
  }
  await ctx.next("다음");
}

// 95쪽: 원본처럼 위에 1~20 수 띠
async function p95(ctx) {
  await ctx.source("95");
  const L = ["3보다 2 큰 수", "11보다 1 작은 수", "10보다 2 큰 수", "8보다 2 작은 수"].map((t, i) => ({ id: t, x: 200, y: 200 + i * 80, html: `<rect x="60" y="${176 + i * 80}" width="200" height="48" rx="8" fill="#fff" stroke="#9b7be0" stroke-width="3" stroke-dasharray="7 5"/>${T(160, 208 + i * 80, t, { size: 22 })}` }));
  const R = [[6, "#ffe066"], [12, "#ffb3c8"], [5, "#b6e8a0"], [10, "#a8dcf0"]].map(([n, c], i) => ({ id: String(n), x: 700, y: 200 + i * 80, html: `<circle cx="760" cy="${200 + i * 80}" r="30" fill="${c}"/>${T(760, 214 + i * 80, n, { size: 34, weight: 900 })}` }));
  for (const l of L) l.x = 210;
  await matchLines(ctx, { vb: "0 0 900 520", back: numStrip(50, 14, 800), left: L, right: R, pairs: { "3보다 2 큰 수": "5", "11보다 1 작은 수": "10", "10보다 2 큰 수": "12", "8보다 2 작은 수": "6" }, dx: 60, say: "같은 수끼리 선으로 이어요. 위의 수 띠를 보면서 세어 봐요!", wrongSay: "수 띠에서 세어 볼까요? 크면 오른쪽, 작으면 왼쪽으로 가요." });
  await ctx.guide.praise("모두 알맞게 이었어요!");
  await ctx.next("다음");
}

// ── 96쪽 그림자의 주인을 찾아라! ──
const ANI = {
  snake: `<path d="M-30 30 Q-44 10 -24 0 Q0 -8 20 4 Q40 18 18 30 Q-4 40 -30 30Z" fill="#4fae40"/><path d="M-20 18 Q0 8 18 18 Q0 30 -20 18Z" fill="#7bd36a"/><path d="M18 4 Q22 -26 8 -36 Q-6 -40 -8 -28 Q-6 -18 6 -22" fill="none" stroke="#4fae40" stroke-width="14" stroke-linecap="round"/><circle cx="-4" cy="-34" r="3" fill="#25324a"/><path d="M-12 -30 l-10 2 m10 -2 l-10 -3" stroke="#f0414f" stroke-width="2"/>`,
  rabbit: `<ellipse cx="-10" cy="-30" rx="7" ry="20" fill="#f1e6e0"/><ellipse cx="6" cy="-32" rx="7" ry="20" fill="#f1e6e0"/><circle cx="-2" cy="-6" r="16" fill="#f1e6e0"/><ellipse cx="0" cy="22" rx="22" ry="18" fill="#f1e6e0"/><circle cx="22" cy="30" r="7" fill="#fff"/><circle cx="-8" cy="-8" r="2.5" fill="#25324a"/>`,
  duck: `<ellipse cx="6" cy="16" rx="30" ry="18" fill="#ffd23f"/><circle cx="-16" cy="-12" r="15" fill="#ffd23f"/><path d="M-30 -10 l-14 4 l14 5z" fill="#ff8a1c"/><path d="M30 6 l12 -12 l-2 18z" fill="#ffd23f"/><circle cx="-18" cy="-15" r="2.5" fill="#25324a"/>`,
  elephant: `<ellipse cx="6" cy="8" rx="30" ry="22" fill="#a8b3c6"/><circle cx="-24" cy="-6" r="16" fill="#a8b3c6"/><path d="M-36 0 Q-46 20 -38 36" stroke="#a8b3c6" stroke-width="9" fill="none" stroke-linecap="round"/><ellipse cx="-14" cy="-8" rx="10" ry="14" fill="#93a0b6"/><rect x="-14" y="24" width="10" height="16" fill="#a8b3c6"/><rect x="18" y="24" width="10" height="16" fill="#a8b3c6"/><circle cx="-28" cy="-10" r="2.5" fill="#25324a"/>`,
  giraffe: `<rect x="-6" y="-40" width="10" height="44" fill="#ffc94d"/><ellipse cx="-10" cy="-42" rx="12" ry="8" fill="#ffc94d"/><ellipse cx="8" cy="14" rx="24" ry="14" fill="#ffc94d"/><rect x="-12" y="22" width="7" height="22" fill="#ffc94d"/><rect x="20" y="22" width="7" height="22" fill="#ffc94d"/><circle cx="4" cy="10" r="4" fill="#c98a2b"/><circle cx="16" cy="16" r="3" fill="#c98a2b"/><circle cx="-14" cy="-44" r="2.5" fill="#25324a"/><path d="M-4 -48 v-8 M2 -48 v-8" stroke="#c98a2b" stroke-width="3"/>`,
  turtle: `<path d="M-30 14 Q-30 -22 0 -22 Q30 -22 30 14Z" fill="#55b047"/><path d="M-14 -10 l14 -6 l14 6 l-4 14 h-20z" fill="#7bd36a"/><circle cx="-38" cy="6" r="9" fill="#9fd68f"/><ellipse cx="-20" cy="18" rx="7" ry="5" fill="#9fd68f"/><ellipse cx="20" cy="18" rx="7" ry="5" fill="#9fd68f"/><circle cx="-41" cy="4" r="2" fill="#25324a"/>`,
  fish: `<path d="M-32 0 Q-6 -24 22 0 Q-6 24 -32 0Z" fill="#5aa0f0"/><path d="M20 0 L40 -16 L36 0 L40 16Z" fill="#5aa0f0"/><path d="M-6 -14 l8 -10 l6 12" fill="#4a7fd0"/><circle cx="-20" cy="-4" r="3" fill="#25324a"/>`,
  cat: `<path d="M-20 -26 L-14 -44 L-4 -30Z M18 -26 L12 -44 L2 -30Z" fill="#ffb347"/><circle cx="-1" cy="-16" r="18" fill="#ffb347"/><ellipse cx="2" cy="20" rx="20" ry="20" fill="#ffb347"/><path d="M20 30 Q40 20 34 -4" stroke="#ffb347" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="-8" cy="-18" r="2.5" fill="#25324a"/><circle cx="6" cy="-18" r="2.5" fill="#25324a"/>`,
  bird: `<ellipse cx="4" cy="6" rx="24" ry="18" fill="#f47aa8"/><circle cx="-18" cy="-12" r="13" fill="#f47aa8"/><path d="M-30 -10 l-12 3 l12 4z" fill="#ff8a1c"/><path d="M4 -2 q16 -26 30 -12 q-12 12 -30 12z" fill="#e85f95"/><path d="M26 10 l16 4 l-14 6z" fill="#e85f95"/><path d="M-2 22 v14 M10 22 v14" stroke="#c0564b" stroke-width="3"/><circle cx="-21" cy="-14" r="2.5" fill="#25324a"/>`
};
const ANI_NAME = { snake: "뱀", rabbit: "토끼", duck: "오리", elephant: "코끼리", giraffe: "기린", turtle: "거북", fish: "물고기", cat: "고양이", bird: "새" };
const aniCard = (k, x, y, s, { shadow = false, border = "#55b047" } = {}) => `<g transform="translate(${x} ${y})"><rect x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}" rx="12" fill="#fff" stroke="${border}" stroke-width="4"/><g transform="scale(${s / 110})" ${shadow ? 'style="filter:brightness(0);opacity:.38"' : ""}>${ANI[k]}</g></g>`;
const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
async function p96(ctx) {
  const pg = await ctx.source("96");
  // 원본 보기: 뱀 카드와 그 그림자
  scene(ctx, "0 0 900 300", `${aniCard("snake", 330, 150, 180)}${T(330, 270, "속성 카드", { size: 22, fill: "#4a5a78" })}${aniCard("snake", 570, 150, 180, { shadow: true })}${T(570, 270, "그림자 카드", { size: 22, fill: "#4a5a78" })}`);
  await ctx.guide.say("뱀의 그림자는 뱀과 모양이 똑같아요. 그림자를 보고 주인을 찾아요!");
  await ctx.next("게임 시작!", { icon: "🔦" });
  ctx.dock.innerHTML = "";
  const kinds = Object.keys(ANI), spread = shuffle(kinds), draws = shuffle(kinds).slice(0, 6);
  const took = {};                 // kind → "me" | "doc"
  const draw = (shadowK = null) => scene(ctx, "0 0 940 460", `
    ${spread.map((k, i) => { const x = 90 + (i % 3) * 150, y = 90 + Math.floor(i / 3) * 140; return took[k] ? `<g transform="translate(${x} ${y})"><rect x="-62" y="-62" width="124" height="124" rx="12" fill="${took[k] === "me" ? "#d8f7e2" : "#dbe8ff"}" stroke="#c9cfd8" stroke-width="2" stroke-dasharray="6 5"/>${T(0, 8, took[k] === "me" ? "나" : "독쌤", { size: 24, fill: took[k] === "me" ? "#2fb67c" : "#2a6fc4" })}</g>` : `<g class="nm-hit sh-card" data-k="${k}">${aniCard(k, x, y, 124)}</g>`; }).join("")}
    <rect x="560" y="40" width="360" height="300" rx="20" fill="#f3f0ff" stroke="#8f63e6" stroke-width="3"/>${T(740, 80, "그림자 카드", { size: 24, fill: "#8f63e6" })}${shadowK ? aniCard(shadowK, 740, 210, 200, { shadow: true, border: "#8f63e6" }) : ""}
    ${T(600, 420, `나 ${Object.values(took).filter((w) => w === "me").length}장`, { size: 26, fill: "#2fb67c", anchor: "start" })}${T(900, 420, `독쌤 ${Object.values(took).filter((w) => w === "doc").length}장`, { size: 26, fill: "#2a6fc4", anchor: "end" })}`);
  for (const [round, k] of draws.entries()) {
    let svg = draw(k);
    ctx.guide.say(round === 0 ? "독쌤이 그림자 카드를 한 장 뽑았어요. 그림자의 주인을 찾아 눌러요!" : "새 그림자 카드예요. 주인을 찾아요!");
    const first = await new Promise((r) => { const off = onHit(svg, ".sh-card", (el) => { off(); r(el); }); });
    if (first.dataset.k === k) { took[k] = "me"; ctx.fx.sound.pop(); ctx.fx.cheer(first); await ctx.guide.praise("찾았어요! 카드를 가져가요."); }
    else {
      ctx.mistake(); ctx.fx.sound.bad(); first.classList.add("nm-no");
      const right = svg.querySelector(`.sh-card[data-k="${k}"]`); right?.classList.add("nm-glow");
      await ctx.guide.encourage("앗, 독쌤이 먼저 찾았어요! 반짝이는 카드가 그림자의 주인이에요.");
      took[k] = "doc";
    }
    await ctx.wait(500);
  }
  draw();
  const me = Object.values(took).filter((w) => w === "me").length, doc = Object.values(took).filter((w) => w === "doc").length;
  if (me > doc) { ctx.fx.sound.fanfare(); ctx.fx.cheer(null, { big: true }); await ctx.guide.praise("카드를 더 많이 가져갔어요! 내가 이겼어요!"); }
  else if (me === doc) await ctx.guide.say("카드 수가 같아요. 비겼어요!");
  else await ctx.guide.encourage("이번엔 독쌤이 이겼어요. 다음엔 꼭 이길 거예요!");
  void pg; void esc; void ANI_NAME;
  await ctx.next("끝");
}

export const LESSON = {
  title: "푸리수리와 그림자 주인 찾기",
  subtitle: "더 큰 수, 더 작은 수, 1·2 크고 작은 수를 찾아요",
  coverArt: "🔦",
  doneTitle: "큰 수, 작은 수 3차시 끝!",
  doneText: "수 띠에서 오른쪽으로 가면 큰 수, 왼쪽으로 가면 작은 수예요.",
  steps: [
    { page: "89쪽 · 푸리수리 1", run: p89 },
    { page: "90쪽 · 푸리수리 2", run: p90 },
    { page: "91쪽 · 푸리수리 3·4", run: p91 },
    { page: "92쪽 · 푸리수리 5", run: p92 },
    { page: "93쪽 · 푸리수리 6", run: p93 },
    { page: "94쪽 · 푸리수리 7", run: p94 },
    { page: "95쪽 · 푸리수리 8", run: p95 },
    { page: "96쪽 · 창의력 Game", run: p96 }
  ]
};
