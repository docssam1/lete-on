// 4단원 스도쿠와 매트릭스 · 2차시 (원본 86~98쪽)
//  86 요술상자(매트릭스 뜻) → 87 빈칸 사탕 그리고 칠하기 → 88~89 「매트릭스 만들기」 스티커 활동판 A·B
//  → 90~97 푸리수리 1~8 → 98 「틱택토 게임」(나 빨강 대 독쌤 파랑)
// 정답(원본 그림에서 계산): 87 빨간 하트 / 90 × × ○ / 91 YGBR·BRGY, BYGR·RGYB / 92 ○ × ×
//  93 1432·2314, 2134·3421, 1423·3214 / 94 3214·4123·2431·1342, 2134·4312·1423·3241 / 95 초록 새(넷째) / 97 초록 펭귄(셋째)
import { makeBoard } from "../sudoku.js?v=20261114b";
import { matrixBoard, piece, crayon, PAL, GRAY } from "../matrix.js?v=20261114b";
import { fillBox, kidFig, judge, fillPuzzle, sweep, WIDE } from "./u4-s1.js?v=20261114b";

const shuffle = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
// 고르기 단추를 무대 오른쪽에 둔다 → 아래 줄이 비어 판이 커진다(가로 폰)
const sideOpts = (ctx, host) => { const o = document.createElement("div"); o.className = "u4-opts"; host.append(o); ctx.dock.innerHTML = ""; return o; };
const cellSize = (n) => (n >= 4 ? "min(12.5cqw, 16.5cqh)" : n === 3 ? "min(17cqw, 24cqh)" : "min(20cqw, 32cqh)");

// ── 86쪽 요술상자 ──
async function p86(ctx) {
  const pg = await ctx.source("86");
  const host = fillBox(ctx);
  const m = matrixBoard(host, { rows: ["round", "heart", "oval"], cols: ["red", "blue", "yellow"], filled: () => false, cell: cellSize(3) });
  ctx.dock.innerHTML = "";
  m.hint(0, 0); await ctx.guide.say("가로에서는 색깔을, 세로에서는 모양을 가져와요.");
  m.show(0, 0, { pop: true }); ctx.fx.sound.pop(); m.clearHints();
  await ctx.guide.say("빨간색과 동그라미가 만나면 빨간 동그란 사탕!");
  ctx.guide.say("빈 상자를 눌러 사탕을 만들어 봐요.");
  let left = 8;
  await new Promise((done) => m.onTap(async (r, c, b) => {
    if (b.classList.contains("full") || b.classList.contains("aim")) return;
    m.hint(r, c); ctx.fx.sound.tap(); await ctx.wait(450);
    m.show(r, c, { pop: true }); ctx.fx.sound.pop(); m.hint(r, c, false);
    if (--left === 0) done();
  }));
  ctx.fx.cheer(null, { big: true });
  if (pg?.bubbles?.[0]) await ctx.guide.say(pg.bubbles[0]);
  else await ctx.guide.praise("요술상자가 가득 찼어요!");
  await ctx.next("다음");
}
// ── 87쪽 빈칸 사탕 ──
async function p87(ctx) {
  await ctx.source("87");
  const host = fillBox(ctx);
  const m = matrixBoard(host, { rows: ["oval", "star", "heart"], cols: ["yellow", "green", "red"], filled: (r, c) => !(r === 2 && c === 2), cell: cellSize(3) });
  m.cellEl(2, 2).classList.add("blank");
  const art = (k, c) => `<span class="mx-opt">${piece(k, c)}</span>`;
  ctx.guide.say("먼저 어떤 모양일지 골라요.");
  const opts = sideOpts(ctx, host);
  await ctx.choose(["round", "star", "heart", "oval"].map((k) => ({ value: k, art: art(k, GRAY), name: { round: "동그라미", star: "별", heart: "하트", oval: "타원" }[k] })),
    { host: opts, correct: "heart", wrongSay: "이 가로줄은 모두 하트 모양이에요.", hint: () => { m.hint(2, 2); ctx.guide.encourage("이 가로줄은 모두 하트 모양이에요."); } });
  m.clearHints(); m.put(2, 2, piece("heart", GRAY)); ctx.fx.sound.pop();
  ctx.guide.say("이제 무슨 색으로 칠할까요?");
  await ctx.choose(["yellow", "green", "red", "blue"].map((c) => ({ value: c, art: crayon(c, 70), name: PAL[c].name })),
    { host: opts, correct: "red", wrongSay: "이 세로줄은 모두 빨간색이에요.", hint: () => { m.hint(2, 2); ctx.guide.encourage("이 세로줄은 모두 빨간색이에요."); } });
  opts.remove();
  m.clearHints(); m.show(2, 2, { pop: true }); ctx.fx.cheer(m.cellEl(2, 2), { big: true });
  await ctx.guide.praise("빨간색 하트 사탕이 만들어졌어요!");
  await ctx.next("다음");
}
// 스티커 붙이기: 아래 스티커를 고르고 칸을 누른다(원본 88·89·96쪽)
async function stickers(ctx, m, todo) {
  let sel = null; const wrong = new Map();
  const left = shuffle(todo.map(([r, c]) => ({ r, c, id: `${r},${c}` })));
  const tray = () => {
    ctx.dock.innerHTML = `<div class="sd-tray">${left.map((s) => `<button type="button" class="mx-stk${sel === s.id ? " on" : ""}" data-s="${s.id}" aria-label="스티커">${piece(m.rows[s.r], m.cols[s.c])}</button>`).join("")}</div>`;
  };
  tray();
  ctx.dock.onclick = (e) => { const t = e.target.closest("[data-s]"); if (!t) return; sel = t.dataset.s; ctx.fx.sound.pop(); tray(); };
  await new Promise((done) => m.onTap(async (r, c, b) => {
    if (b.classList.contains("full")) return;
    if (!sel) { ctx.fx.shake(ctx.dock); ctx.guide.say("아래에서 스티커를 먼저 골라요."); return; }
    const s = left.find((x) => x.id === sel);
    if (s.r === r && s.c === c) {
      m.show(r, c, { pop: true }); ctx.fx.sound.pop(); left.splice(left.indexOf(s), 1); sel = null; tray();
      if (!left.length) done();
      return;
    }
    ctx.mistake(); ctx.fx.sound.bad(); ctx.fx.shake(b);
    const n = (wrong.get(s.id) || 0) + 1; wrong.set(s.id, n);
    if (n >= 2) { m.hint(s.r, s.c); setTimeout(() => m.clearHints(), 2200); ctx.guide.encourage("반짝이는 그림과 색이 만나는 칸에 붙여요."); }
    else ctx.guide.encourage("그 칸은 아니에요. 왼쪽 그림과 위의 색을 함께 봐요.");
  }));
  ctx.dock.onclick = null; ctx.dock.innerHTML = "";
}
// ── 88~89쪽 「매트릭스 만들기」 ──
async function makeMatrix(ctx) {
  const boards = [{ page: "88", rows: ["squid", "puffer"], cols: ["red", "yellow"] }, { page: "89", rows: ["fish", "octopus", "crab"], cols: ["green", "yellow", "red"] }];
  for (const [i, q] of boards.entries()) {
    await ctx.source(q.page, { read: i === 0 });
    const host = fillBox(ctx);
    const m = matrixBoard(host, { rows: q.rows, cols: q.cols, filled: () => false, cell: cellSize(q.rows.length) });
    ctx.guide.say(i ? "활동판 B도 스티커로 채워요." : "스티커를 고르고, 알맞은 칸을 눌러 붙여요.");
    await stickers(ctx, m, q.rows.flatMap((_, r) => q.cols.map((__, c) => [r, c])));
    ctx.fx.cheer(null, { big: true });
    await ctx.guide.praise(i ? "매트릭스 완성! 친구가 만든 것과 똑같을까요?" : "활동판 A 완성!");
    await ctx.next(i ? "다음" : "활동판 B");
  }
}
// ── 90·92쪽 ○× ──
async function judgeSet(ctx, page, sets, kind) {
  await ctx.source(page);
  for (const [i, rows] of sets.entries()) {
    const host = fillBox(ctx);
    host.insertAdjacentHTML("afterbegin", `<span class="u4-num">(${i + 1})</span>`);
    const b = makeBoard(host, rows, { kind, cell: WIDE });
    await judge(ctx, b);
    await ctx.next(i < sets.length - 1 ? "다음 문제" : "다음");
  }
}
// ── 91·93·94쪽 채우기 ──
async function fillSet(ctx, page, sets, kind, { kids = false } = {}) {
  await ctx.source(page);
  for (const [i, rows] of sets.entries()) {
    const host = fillBox(ctx);
    host.insertAdjacentHTML("afterbegin", `<span class="u4-num">(${i + 1})</span>`);
    let mid = host;
    if (kids) { host.insertAdjacentHTML("beforeend", `${kidFig("경주")}<div class="u4-mid"></div>${kidFig("소현")}`); mid = host.querySelector(".u4-mid"); }
    const b = makeBoard(mid, rows, { kind, cell: rows.length === 4 ? "min(13cqw, 20cqh)" : WIDE });
    await fillPuzzle(ctx, b);
    await sweep(ctx, b); ctx.fx.cheer(null, { big: true });
    await ctx.guide.praise("완성!");
    await ctx.next(i < sets.length - 1 ? "다음 문제" : "다음");
  }
}
// ── 95·97쪽 빈칸 그림 고르기 ──
async function pickBlank(ctx, page, { rows, cols, blank, options, style, wrongSay, praise }) {
  await ctx.source(page);
  const host = fillBox(ctx);
  const m = matrixBoard(host, { rows, cols, filled: (r, c) => !(r === blank[0] && c === blank[1]), style, cell: cellSize(rows.length) });
  m.cellEl(...blank).classList.add("blank");
  const ans = `${rows[blank[0]]}-${cols[blank[1]]}`;
  ctx.guide.say("가로줄과 세로줄을 보고, 빈칸에 들어갈 그림을 골라요.");
  await ctx.choose(options.map(([k, c], i) => ({ value: `${k}-${c}`, art: `<span class="mx-opt">${piece(k, c)}</span>`, name: `${i + 1}번` })),
    { host: sideOpts(ctx, host), correct: ans, wrongSay, hint: () => { m.hint(...blank); ctx.guide.encourage(wrongSay); } });
  m.clearHints(); m.show(...blank, { pop: true }); ctx.fx.cheer(m.cellEl(...blank), { big: true });
  await ctx.guide.praise(praise);
  await ctx.next("다음");
}
const p95 = (ctx) => pickBlank(ctx, "95", { rows: ["dog", "bird", "giraffe"], cols: ["yellow", "green", "red"], blank: [1, 1], style: "plain",
  options: [["dog", "yellow"], ["giraffe", "blue"], ["bird", "red"], ["bird", "green"]], wrongSay: "이 가로줄은 모두 새예요. 이 세로줄은 모두 초록색이에요.", praise: "맞아요! 초록색 새예요." });
const p97 = (ctx) => pickBlank(ctx, "97", { rows: ["bear", "puppy", "hippo", "penguin"], cols: ["red", "blue", "yellow", "green"], blank: [3, 3], style: "box",
  options: [["hippo", "green"], ["penguin", "yellow"], ["penguin", "green"]], wrongSay: "이 가로줄은 모두 펭귄이에요. 이 세로줄은 모두 초록색이에요.", praise: "맞아요! 초록색 펭귄이에요." });
async function p96(ctx) {
  await ctx.source("96");
  const host = fillBox(ctx);
  const m = matrixBoard(host, { rows: ["monkey", "pig", "elephant"], cols: ["yellow", "red", "blue"], filled: (r, c) => r === c, style: "plain", cell: cellSize(3) });
  ctx.guide.say("빈칸에 알맞은 스티커를 붙여요.");
  await stickers(ctx, m, [[0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1]]);
  ctx.fx.cheer(null, { big: true });
  await ctx.guide.praise("매트릭스 완성!");
  await ctx.next("다음");
}

// ── 98쪽 틱택토 ──
const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
const lineType = (i) => (i < 3 ? "row" : i < 6 ? "col" : "diag");
const WIN = { row: { say: "가로로 한 줄을 먼저 놓았어요! 이겼어요!" }, col: { say: "세로로 한 줄을 먼저 놓았어요! 이겼어요!" }, diag: { say: "대각선으로 한 줄을 먼저 놓았어요! 이겼어요!" } };
const winner = (b) => { for (const [i, l] of LINES.entries()) { const [a, c, d] = l; if (b[a] && b[a] === b[c] && b[a] === b[d]) return { who: b[a], line: l, type: lineType(i) }; } return null; };
function docMove(b) {
  const free = b.map((v, i) => (v ? null : i)).filter((i) => i !== null);
  const finish = (who) => free.find((i) => { const t = b.slice(); t[i] = who; return winner(t)?.who === who; });
  const w = finish("doc"); if (w !== undefined) return w;
  const blk = finish("me"); if (blk !== undefined && Math.random() < 0.75) return blk;
  if (!b[4] && Math.random() < 0.6) return 4;
  return free[Math.floor(Math.random() * free.length)];
}
async function tictactoe(ctx) {
  await ctx.source("98");
  const host = fillBox(ctx, "col");
  let score = { me: 0, doc: 0 };
  const demo = async () => {
    host.innerHTML = `<div class="ttt" style="--cell:min(19cqw, 27cqh)">${Array.from({ length: 9 }, (_, i) => `<button type="button" class="ttt-c" data-i="${i}"></button>`).join("")}</div>`;
    for (const l of [LINES[1], LINES[4], LINES[6]]) { l.forEach((i) => host.querySelector(`[data-i="${i}"]`).classList.add("t-me", "hl")); ctx.fx.sound.tap(); await ctx.wait(650); host.querySelectorAll(".ttt-c").forEach((x) => x.classList.remove("t-me", "hl")); }
  };
  ctx.dock.innerHTML = "";
  const intro = demo();
  await ctx.guide.say("나는 빨간 타일, 독쌤은 파란 타일! 가로, 세로, 대각선으로 세 개를 먼저 놓으면 이겨요.");
  await intro;
  for (let game = 1; game <= 3; game++) {
    host.innerHTML = `<div class="ttt-score"><span class="t-me"></span> 나 <b>${score.me}</b> : <b>${score.doc}</b> 독쌤 <span class="t-doc"></span></div>
      <div class="ttt" style="--cell:min(19cqw, 25cqh)">${Array.from({ length: 9 }, (_, i) => `<button type="button" class="ttt-c" data-i="${i}" aria-label="빈칸"></button>`).join("")}</div>`;
    const b = Array(9).fill(null);
    const cell = (i) => host.querySelector(`[data-i="${i}"]`);
    const put = (i, who) => { b[i] = who; const el = cell(i); el.classList.add(who === "me" ? "t-me" : "t-doc", "pop"); el.setAttribute("aria-label", who === "me" ? "빨강" : "파랑"); };
    let turn = game % 2 ? "me" : "doc", res = null;
    ctx.dock.innerHTML = `<div class="u4-cards"><span class="u4-wait">${game}번째 판</span></div>`;
    ctx.guide.say(turn === "me" ? "내가 먼저 놓아요." : "이번 판은 독쌤이 먼저 놓아요.");
    while (!res && b.some((v) => !v)) {
      if (turn === "me") {
        const i = await new Promise((r) => { host.querySelector(".ttt").onclick = (e) => { const t = e.target.closest(".ttt-c"); if (t && !b[t.dataset.i]) r(Number(t.dataset.i)); }; });
        host.querySelector(".ttt").onclick = null;
        put(i, "me"); ctx.fx.sound.pop();
      } else {
        await ctx.wait(650);
        put(docMove(b), "doc"); ctx.fx.sound.tap();
      }
      res = winner(b);
      turn = turn === "me" ? "doc" : "me";
    }
    if (res) res.line.forEach((i) => cell(i).classList.add("win"));
    await ctx.wait(400);
    if (res?.who === "me") { score.me++; ctx.fx.cheer(null, { big: true }); await ctx.guide.praise(WIN[res.type].say); }
    else if (res) { score.doc++; ctx.fx.sound.good(); await ctx.guide.say("독쌤이 먼저 한 줄을 놓았어요. 다음엔 막아 봐요!"); }
    else await ctx.guide.say("모두 채웠는데 한 줄이 없어요. 비겼어요!");
    await ctx.next(game < 3 ? "한 판 더" : "결과 보기", { icon: game < 3 ? "▶" : "🏁" });
  }
  host.innerHTML = `<p class="u4-score">나 <b>${score.me}</b> : <b>${score.doc}</b> 독쌤</p>`;
  ctx.fx.sound.fanfare();
  await ctx.guide.praise(score.me > score.doc ? "내가 이겼어요! 한 줄을 잘 만들고 잘 막았어요." : score.me === score.doc ? "비겼어요! 독쌤 줄을 막는 것도 중요해요." : "독쌤이 이겼어요. 상대가 두 개를 놓으면 꼭 막아요!");
  await ctx.next("끝내기", { icon: "🏁" });
}

export const LESSON = {
  title: "매트릭스와 틱택토",
  subtitle: "가로와 세로 규칙으로 요술상자를 채우고, 틱택토로 한 줄 만들기",
  coverArt: "🍭",
  doneTitle: "스도쿠와 매트릭스 단원 끝!",
  doneText: "가로에서 하나, 세로에서 하나! 매트릭스는 두 규칙이 만나는 칸을 채워요.",
  steps: [
    { page: "86쪽 · 쑥쑥 자라는 사고 3", run: p86 },
    { page: "87쪽 · 쑥쑥 자라는 사고 3", run: p87 },
    { page: "88~89쪽 · 활동", run: makeMatrix },
    { page: "90쪽 · 푸리수리 1", run: (ctx) => judgeSet(ctx, "90", [["RRBY", "GBGY"], ["BRYG", "GBRB"], ["RBYG", "GYRB"]], "color") },
    { page: "91쪽 · 푸리수리 2", run: (ctx) => fillSet(ctx, "91", [["YGB.", ".RGY"], [".YG.", "RG.B"]], "color", { kids: true }) },
    { page: "92쪽 · 푸리수리 3", run: (ctx) => judgeSet(ctx, "92", [["3214", "1423"], ["1441", "2323"], ["4123", "1234"]], "number") },
    { page: "93쪽 · 푸리수리 4", run: (ctx) => fillSet(ctx, "93", [["143.", "2.14"], [".1.4", "3.21"], ["14.3", ".21."]], "number") },
    { page: "94쪽 · 푸리수리 5", run: (ctx) => fillSet(ctx, "94", [["32.4", ".123", "2.3.", "134."], ["213.", "..12", "142.", ".2.1"]], "number") },
    { page: "95쪽 · 푸리수리 6", run: p95 },
    { page: "96쪽 · 푸리수리 7", run: p96 },
    { page: "97쪽 · 푸리수리 8", run: p97 },
    { page: "98쪽 · 창의력 Game", run: tictactoe }
  ]
};
