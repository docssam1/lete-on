// 4단원 스도쿠와 매트릭스 · 1차시 (원본 78~85쪽)
//  78 알록달록 사탕 놓기(수영이는 가로, 민지는 세로로 본다) → 79 나머지 사탕 칠하기(딸기 1·레몬 2)
//  → 80 색깔 스도쿠 규칙 두 가지 + ○× 세 개 → 81 경주·소현 스도쿠 두 판 → 82~83 「내가 만든 색깔 스도쿠」 활동판 세 개(타일 2개씩)
//  → 84 숫자 스도쿠(색깔 대신 1~4) → 85 「숫자 스도쿠」 카드 게임(나 대 독쌤, 카드 1·2 한 장씩, 3·4 두 장씩)
// 정답(원본 그림에서 계산 · 답이 하나뿐인지 solve로 확인): 79 오른쪽 위 레몬 · 왼쪽 아래 레몬 · 오른쪽 아래 딸기
//  80 ×(세로줄 빨강 둘) · ×(가로줄 파랑 둘) · ○ / 81 RYBG·GBRY, BYGR·RGBY / 82 RYBG·GBRY / 83 BRGY·YGRB, RYGB·BGRY
//  84 1324·4213, 2314·1423·3142·4231 / 85 2134·3421·4312·1243
import { COLORS, parse, solve, conflict, lastGap, makeBoard, tileHtml, units } from "../sudoku.js?v=20261114b";
import { ballCandy, FLAVOR } from "../matrix.js?v=20261114b";
import { kid } from "../art.js?v=20261114b";

const KIDS = {
  수영: { hair: "girl", hairColor: "#4a3a33", shirt: "#ff6b6b", bottom: "#ffffff" },
  민지: { hair: "girl", hairColor: "#3a2e2a", shirt: "#ffd84a", bottom: "#5a6a8a" },
  경주: { hair: "boy", hairColor: "#3a3030", shirt: "#4a7fd0", bottom: "#3a4a6a" },
  소현: { hair: "bob", hairColor: "#4a3530", shirt: "#ff8fb1", bottom: "#ffffff" }
};
export const kidFig = (name, cls = "") => `<figure class="u4-kid ${cls}">${kid({ ...KIDS[name], size: 100, label: name })}<figcaption>${name}</figcaption></figure>`;
export const fillBox = (ctx, cls = "") => { ctx.stage.innerHTML = `<div class="u4-fill ${cls}"></div>`; return ctx.stage.firstElementChild; };
const shuffle = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

// 규칙에 어긋날 때 독쌤 말(고정 글 — 독쌤 목소리 파일로 미리 만든다)
const BAD = {
  color: { row: { say: "가로줄에 같은 색이 벌써 있어요!" }, col: { say: "세로줄에 같은 색이 벌써 있어요!" }, box: { say: "굵은 선 안의 네모에 같은 색이 벌써 있어요!" } },
  number: { row: { say: "가로줄에 같은 숫자가 벌써 있어요!" }, col: { say: "세로줄에 같은 숫자가 벌써 있어요!" }, box: { say: "굵은 선 안의 네모에 같은 숫자가 벌써 있어요!" } }
};
const FOUND = {
  color: { row: { say: "맞아요! 가로줄에 같은 색이 두 개 있어요." }, col: { say: "맞아요! 세로줄에 같은 색이 두 개 있어요." }, box: { say: "맞아요! 굵은 선 안의 네모에 같은 색이 두 개 있어요." } },
  number: { row: { say: "맞아요! 가로줄에 같은 숫자가 두 개 있어요." }, col: { say: "맞아요! 세로줄에 같은 숫자가 두 개 있어요." }, box: { say: "맞아요! 굵은 선 안의 네모에 같은 숫자가 두 개 있어요." } }
};
const PICK_FIRST = { color: { say: "아래에서 색깔 타일을 먼저 골라요." }, number: { say: "아래에서 숫자를 먼저 골라요." } };

// 줄·네모를 하나씩 짚으며 확인(원본 82쪽 「알맞게 놓았는지 확인」)
export async function sweep(ctx, b, ms = 230) {
  for (const u of units(b.R, b.C, b.bh, b.bw)) { b.mark(u.cells, "hl"); ctx.fx.sound.tap(); await ctx.wait(ms); b.clear("hl"); }
  b.mark(b.g.flatMap((row, r) => row.map((_, c) => [r, c])), "ok");
}

// 빈칸 채우기: 아래 타일(색·숫자)을 고르고 칸을 누른다. tray: {값: 개수}(없으면 마음껏)
export function fillPuzzle(ctx, b, { tray = null, onPlace = null } = {}) {
  const kind = b.kind, sol = solve(b.g.map((r) => r.slice()), { bh: b.bh, bw: b.bw });
  const syms = kind === "color" ? ["R", "B", "Y", "G"] : ["1", "2", "3", "4"];
  const left = tray ? { ...tray } : null;
  let sel = null; const wrongAt = new Map();
  const drawTray = () => {
    ctx.dock.innerHTML = `<div class="sd-tray">${syms.map((v) => `<button type="button" class="sd-pickt${sel === v ? " on" : ""}" data-v="${v}" ${left && !left[v] ? "disabled" : ""} aria-label="${kind === "color" ? COLORS[v].name : v}">${tileHtml(v, kind, 58)}${left ? `<b class="sd-count">${left[v]}</b>` : ""}</button>`).join("")}</div>`;
  };
  drawTray();
  ctx.dock.onclick = (e) => { const t = e.target.closest(".sd-pickt"); if (!t || t.disabled) return; sel = t.dataset.v; ctx.fx.sound.pop(); drawTray(); };
  return new Promise((resolve) => {
    b.onTap(async (r, c, el) => {
      if (b.g[r][c] !== ".") return;
      if (!sel) { ctx.fx.shake(ctx.dock); ctx.guide.say(PICK_FIRST[kind].say); return; }
      if (left && !left[sel]) return;
      if (sol[r][c] === sel) {
        b.set(r, c, sel); ctx.fx.sound.pop();
        if (left) { left[sel]--; if (!left[sel]) sel = null; drawTray(); }
        for (const u of units(b.R, b.C, b.bh, b.bw)) if (u.cells.some(([y, x]) => y === r && x === c) && u.cells.every(([y, x]) => b.g[y][x] !== ".")) b.mark(u.cells, "done", 700);
        onPlace?.(r, c, sel);
        if (b.full()) { ctx.dock.onclick = null; ctx.dock.innerHTML = ""; resolve(); }
        return;
      }
      ctx.mistake(); ctx.fx.sound.bad(); ctx.fx.shake(el);
      const n = (wrongAt.get(`${r},${c}`) || 0) + 1; wrongAt.set(`${r},${c}`, n);
      const g2 = b.g.map((row) => row.slice()); g2[r][c] = sel;
      const cf = conflict(g2, { bh: b.bh, bw: b.bw, only: [r, c] });
      if (n >= 3) {
        b.set(r, c, sol[r][c]); b.mark([[r, c]], "helped", 1400);
        if (left) { left[sol[r][c]]--; drawTray(); }
        await ctx.guide.encourage("독쌤이 도와줄게요. 이 칸은 이거예요!");
        if (b.full()) { ctx.dock.onclick = null; ctx.dock.innerHTML = ""; resolve(); }
        return;
      }
      if (cf) {
        b.mark(cf.line, "hl", 1600); b.mark(cf.cells.filter(([y, x]) => !(y === r && x === c)), "bad", 1600);
        ctx.guide.encourage(BAD[kind][cf.type].say);
      } else {
        const u = lastGap(b.g, r, c, { bh: b.bh, bw: b.bw });
        if (u) { b.mark(u.cells, "hl", 1800); ctx.guide.encourage("반짝이는 줄에 빈칸이 하나뿐이에요. 빠진 것을 찾아봐요!"); }
        else ctx.guide.encourage("지금은 괜찮아 보여도 다른 칸이 막혀요. 빈칸이 하나뿐인 줄부터 채워 봐요.");
      }
    });
  });
}
// ○× 판단하기
export async function judge(ctx, b, { tag = "" } = {}) {
  const kind = b.kind, cf = conflict(b.g, { bh: b.bh, bw: b.bw }), answer = cf ? "x" : "o";
  ctx.dock.innerHTML = `<div class="u4-ox">${tag ? `<span class="u4-tag">${tag}</span>` : ""}<button type="button" class="sm-btn big u4-o" data-a="o" aria-label="맞아요 동그라미">○</button><button type="button" class="sm-btn big u4-x" data-a="x" aria-label="틀려요 가위표">×</button></div>`;
  for (;;) {
    const pick = await new Promise((r) => { ctx.dock.onclick = (e) => { const t = e.target.closest("[data-a]"); if (t) r(t.dataset.a); }; });
    ctx.dock.onclick = null; ctx.fx.sound.tap();
    if (pick === answer) {
      ctx.dock.querySelector(`[data-a="${pick}"]`).classList.add("chosen");
      if (cf) { b.mark(cf.line, "hl"); b.mark(cf.cells, "bad"); ctx.fx.cheer(null); await ctx.guide.praise(FOUND[kind][cf.type].say); }
      else { await sweep(ctx, b); ctx.fx.cheer(null); await ctx.guide.praise("맞아요! 가로줄, 세로줄, 굵은 선 안의 네모가 모두 달라요."); }
      return answer;
    }
    ctx.mistake(); ctx.fx.sound.bad();
    if (cf) { b.mark(cf.line, "hl", 2000); await ctx.guide.encourage("다시 볼까요? 반짝이는 줄을 잘 보세요."); }
    else { await sweep(ctx, b, 160); await ctx.guide.encourage("하나씩 살펴봤더니 같은 것이 없어요. 다시 골라 볼까요?"); b.clear("ok"); }
  }
}

// ── 78쪽 알록달록 사탕 놓기 ──
const candyBox = (cells) => `<div class="u4-cbox">${cells.map((f, i) => `<button type="button" class="u4-cb" data-i="${i}" aria-label="${FLAVOR[f].name} 사탕">${ballCandy(f)}</button>`).join("")}</div>`;
const sceneHtml = (cells) => `<div class="u4-candyscene">
  <div class="u4-talk t0" data-t="0" hidden></div>
  <div class="u4-mj"><div class="u4-talk t1" data-t="1" hidden></div>${kidFig("민지")}</div>
  <div class="u4-sy">${kidFig("수영")}</div>
  <div class="u4-boxwrap"><i class="u4-ar h"></i><i class="u4-ar v"></i>${candyBox(cells)}</div></div>`;
async function p78(ctx) {
  const box = fillBox(ctx, "col");
  const pg = ctx.page("78");
  box.innerHTML = `<div class="u4-wraps"><figure>${ballCandy("straw", 56)}${ballCandy("straw", 56)}<figcaption>${pg?.labels?.[0] || "딸기"}</figcaption></figure><figure>${ballCandy("lemon", 56)}${ballCandy("lemon", 56)}<figcaption>${pg?.labels?.[1] || "레몬"}</figcaption></figure></div>`;
  await ctx.source("78");
  await ctx.next("상자 보기", { icon: "🍬" });
  box.innerHTML = sceneHtml(["straw", "straw", "lemon", "lemon"]);
  const cb = [...box.querySelectorAll(".u4-cb")];
  const talk = (i, t) => { const el = box.querySelector(`[data-t="${i}"]`); el.textContent = t; el.hidden = false; };
  ctx.dock.innerHTML = "";
  [0, 1].forEach((i) => cb[i].classList.add("seen"));
  box.querySelector(".u4-ar.h").classList.add("on");
  talk(0, pg?.bubbles?.[0] || "딸기맛만 보여!");
  await ctx.guide.say("수영이는 옆에서 가로로 봐요. 딸기맛 사탕만 보여요.");
  await ctx.wait(500);
  cb.forEach((x) => x.classList.remove("seen")); [1, 3].forEach((i) => cb[i].classList.add("seen"));
  box.querySelector(".u4-ar.h").classList.remove("on"); box.querySelector(".u4-ar.v").classList.add("on");
  talk(1, pg?.bubbles?.[1] || "두 가지 맛이 다 보여!");
  await ctx.guide.say("민지는 위에서 세로로 봐요. 딸기맛과 레몬맛이 모두 보여요.");
  if (pg?.text2) { ctx.setSource(pg.text2); await ctx.guide.say(pg.text2, { display: false }); }
  await ctx.next("다음");
}
// ── 79쪽 나머지 사탕 칠하기 ──
async function p79(ctx) {
  const box = fillBox(ctx, "col");
  await ctx.source("79", { read: false });
  const cells = ["straw", "none", "none", "none"];
  box.innerHTML = sceneHtml(cells);
  ctx.source("79");
  let left = { straw: 1, lemon: 2 }, sel = null;
  const tray = () => { ctx.dock.innerHTML = `<div class="sd-tray">${["straw", "lemon"].map((f) => `<button type="button" class="sd-pickt wide${sel === f ? " on" : ""}" data-f="${f}" ${left[f] ? "" : "disabled"}>${ballCandy(f, 54)}<span>${FLAVOR[f].name}</span><b class="sd-count">${left[f]}</b></button>`).join("")}</div>`; };
  tray();
  ctx.dock.onclick = (e) => { const t = e.target.closest("[data-f]"); if (!t || t.disabled) return; sel = t.dataset.f; ctx.fx.sound.pop(); tray(); };
  const cb = () => [...box.querySelectorAll(".u4-cb")];
  for (;;) {
    await new Promise((done) => {
      box.querySelector(".u4-cbox").onclick = (e) => {
        const b = e.target.closest(".u4-cb"); if (!b) return;
        const i = Number(b.dataset.i);
        if (i === 0) { ctx.guide.say("이 사탕은 처음부터 딸기맛이에요."); return; }
        if (!sel) { ctx.fx.shake(ctx.dock); ctx.guide.say("아래에서 사탕을 먼저 골라요."); return; }
        if (cells[i] !== "none") left[cells[i]]++;
        cells[i] = sel; left[sel]--; b.innerHTML = ballCandy(sel); b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); ctx.fx.sound.pop();
        if (!left[sel]) sel = null;
        tray();
        if (!cells.includes("none")) done();
      };
    });
    box.querySelector(".u4-cbox").onclick = null;
    await ctx.wait(300);
    const rowOk = cells[0] !== cells[1], colOk = cells[1] !== cells[3];
    if (rowOk && colOk) break;
    ctx.mistake(); ctx.fx.sound.bad();
    if (!rowOk) { [0, 1].forEach((i) => cb()[i].classList.add("bad")); box.querySelector(".u4-ar.h").classList.add("on"); await ctx.guide.encourage("수영이 쪽에서 보면 딸기맛 사탕만 보여요."); }
    else { [1, 3].forEach((i) => cb()[i].classList.add("bad")); box.querySelector(".u4-ar.v").classList.add("on"); await ctx.guide.encourage("민지 쪽에서 보면 레몬맛 사탕만 보여요."); }
    await ctx.wait(600);
    cb().forEach((x) => x.classList.remove("bad")); box.querySelectorAll(".u4-ar").forEach((x) => x.classList.remove("on"));
    for (const i of [1, 2, 3]) { if (cells[i] !== "none") left[cells[i]]++; cells[i] = "none"; cb()[i].innerHTML = ballCandy("none"); }
    sel = null; tray();
    ctx.guide.say("다시 놓아 볼까요?");
  }
  ctx.dock.onclick = null; ctx.dock.innerHTML = "";
  box.querySelectorAll(".u4-ar").forEach((x) => x.classList.add("on")); cb().forEach((x) => x.classList.add("seen"));
  ctx.fx.cheer(null, { big: true });
  await ctx.guide.praise("수영이 쪽에서도, 민지 쪽에서도 두 가지 맛이 모두 보여요!");
  await ctx.guide.say("가로줄에도 세로줄에도 다른 맛이 하나씩 들어갔어요. 이것이 스도쿠의 비밀이에요.");
  await ctx.next("다음");
}
// ── 80쪽 색깔 스도쿠 규칙 + ○× ──
const P80 = [
  { rows: ["RB", "RY", "YG", "BG"], tag: "세로줄" },
  { rows: ["BBRG", "RYYG"], tag: "가로줄" },
  { rows: ["BYRG", "RGYB"], tag: "" }
];
async function p80(ctx) {
  const pg = await ctx.source("80");
  const host = fillBox(ctx);
  const demo = makeBoard(host, ["RBYG", "YGRB"], { cell: "min(15cqw, 34cqh)" });
  ctx.dock.innerHTML = "";
  const rules = pg?.rules || [];
  if (rules[0]) { ctx.setSource(`규칙 1. ${rules[0]}`); await ctx.guide.say(rules[0], { display: false }); }
  for (const u of units(2, 4).filter((x) => x.type !== "box")) { demo.mark(u.cells, "hl"); ctx.fx.sound.tap(); await ctx.wait(420); demo.clear("hl"); }
  if (rules[1]) { ctx.setSource(`규칙 2. ${rules[1]}`); await ctx.guide.say(rules[1], { display: false }); }
  for (const u of units(2, 4).filter((x) => x.type === "box")) { demo.mark(u.cells, "hl"); ctx.fx.sound.tap(); await ctx.wait(700); demo.clear("hl"); }
  if (pg?.text) ctx.setSource(pg.text);
  await ctx.guide.say("이제 규칙대로 만들었는지 살펴봐요. 맞으면 동그라미, 틀리면 가위표!");
  for (const [i, q] of P80.entries()) {
    host.innerHTML = "";
    const tall = q.rows.length === 4;
    const b = makeBoard(host, q.rows, { cell: tall ? "min(12cqw, 20cqh)" : "min(15cqw, 34cqh)" });
    if (q.tag) b.el.insertAdjacentHTML("beforebegin", `<span class="u4-dir ${tall ? "v" : "h"}">${q.tag}</span>`);
    await judge(ctx, b);
    await ctx.next(i < P80.length - 1 ? "다음 스도쿠" : "다음");
  }
}
// ── 81쪽 경주·소현 ──
const sides = (host) => { host.innerHTML = `${kidFig("경주")}<div class="u4-mid"></div>${kidFig("소현")}`; return host.querySelector(".u4-mid"); };
export const WIDE = "min(14cqw, 34cqh)";
async function p81(ctx) {
  await ctx.source("81");
  for (const [i, rows] of [["RY.G", ".BR."], ["B.G.", ".GBY"]].entries()) {
    const host = fillBox(ctx);
    const b = makeBoard(sides(host), rows, { cell: WIDE });
    ctx.guide.say(i ? "두 번째 스도쿠도 완성해 봐요." : "빈칸에 알맞은 색 타일을 놓아요. 가로줄, 세로줄, 굵은 선 안을 잘 봐요!");
    await fillPuzzle(ctx, b);
    await sweep(ctx, b); ctx.fx.cheer(null, { big: true });
    await ctx.guide.praise("스도쿠 완성!");
    await ctx.next(i ? "다음" : "다음 스도쿠");
  }
}
// ── 82~83쪽 「내가 만든 색깔 스도쿠」 ──
async function myColor(ctx) {
  const boards = [{ page: "82", rows: [".Y.G", ".BR."] }, { page: "83", rows: [".RG.", "Y..B"] }, { page: "83", rows: [".Y.B", ".GR."] }];
  for (const [i, q] of boards.entries()) {
    await ctx.source(q.page, { read: i === 0 });
    const host = fillBox(ctx);
    const b = makeBoard(sides(host), q.rows, { cell: WIDE });
    ctx.guide.say(i ? "다음 활동판이에요. 타일은 색깔마다 두 개씩!" : "빨강, 파랑, 노랑, 초록 타일을 두 개씩 가졌어요. 규칙대로 놓아 봐요.");
    await fillPuzzle(ctx, b, { tray: { R: 2, B: 2, Y: 2, G: 2 } });
    await ctx.guide.say("알맞게 놓았는지 확인해요.");
    await sweep(ctx, b, 300);
    ctx.fx.cheer(null, { big: true }); ctx.fx.stamp("확인 끝!");
    await ctx.guide.praise("규칙을 모두 지켰어요!");
    await ctx.next(i < boards.length - 1 ? "다음 활동판" : "다음");
  }
}
// ── 84쪽 숫자 스도쿠 ──
async function p84(ctx) {
  await ctx.source("84", { read: false });
  const host = fillBox(ctx);
  const demo = makeBoard(host, ["BYRG", "RGYB"], { cell: WIDE });
  ctx.dock.innerHTML = "";
  await ctx.guide.say("색깔 대신 숫자를 넣어도 규칙은 똑같아요!");
  const NUM = { R: "1", B: "2", Y: "3", G: "4" };
  for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) { const el = demo.cell(r, c); el.textContent = NUM[demo.g[r][c]]; el.classList.add("tonum"); }
  ctx.fx.sound.pop();
  await ctx.wait(1400);
  await ctx.source("84");
  for (const [i, rows] of [[".32.", "4.13"], ["23.4", ".42.", "3.42", ".23."]].entries()) {
    host.innerHTML = "";
    const b = makeBoard(host, rows, { kind: "number", cell: rows.length === 4 ? "min(13cqw, 21cqh)" : WIDE });
    ctx.guide.say(i ? "이번에는 큰 스도쿠예요. 굵은 선 안의 네모가 네 개예요." : "빈칸에 1, 2, 3, 4 중 알맞은 숫자를 넣어요.");
    await fillPuzzle(ctx, b);
    await sweep(ctx, b); ctx.fx.cheer(null, { big: true });
    await ctx.guide.praise("숫자 스도쿠 완성!");
    await ctx.next(i ? "다음" : "다음 스도쿠");
  }
}
// ── 85쪽 「숫자 스도쿠」 카드 게임 ──
const BOARD85 = [".1..", "3421", "4.12", ".2.3"];
const CARDS = ["1", "2", "3", "3", "4", "4"];
const swapDigits = (rows) => rows.map((r) => [...r].reverse().map((v) => ({ 1: "2", 2: "1", 3: "4", 4: "3" })[v] || v).join(""));
async function cardGame(ctx) {
  const pg = await ctx.source("85");
  let wins = 0;
  for (let round = 1; round <= 2; round++) {
    const rows = round === 1 ? BOARD85 : swapDigits(BOARD85);
    const host = fillBox(ctx, "game");
    host.innerHTML = `<div class="u4-side me"><b>나</b><div data-b></div></div><div class="u4-side doc"><b>독쌤</b><div data-b></div><div class="u4-deck" data-dd></div></div>`;
    const me = makeBoard(host.querySelector(".me [data-b]"), rows, { kind: "number", cell: "min(11cqw, 19cqh)" });
    const doc = makeBoard(host.querySelector(".doc [data-b]"), rows, { kind: "number", cell: "min(5.5cqw, 9.5cqh)", cls: "mini" });
    const sol = solve(parse(rows)), solD = sol;
    let myCards = shuffle(CARDS), docCards = shuffle(CARDS);
    const docDeck = () => { host.querySelector("[data-dd]").innerHTML = docCards.map(() => `<span class="u4-card back sm"></span>`).join(""); };
    docDeck();
    if (round === 1) { if (pg?.bubbles?.[0]) await ctx.guide.think(pg.bubbles[0]); await ctx.guide.say("카드를 한 장 뽑아서 알맞은 칸에 놓아요. 먼저 다 채우면 이겨요!"); }
    else await ctx.guide.say("활동판을 바꾸어 한 번 더 해요!");
    let winner = null;
    while (!winner) {
      // 내 차례
      ctx.dock.innerHTML = `<div class="u4-cards">${myCards.map((_, i) => `<button type="button" class="u4-card back" data-k="${i}" aria-label="뒤집힌 카드"></button>`).join("")}</div>`;
      ctx.guide.say("내 차례! 카드를 한 장 뽑아요.");
      const k = await new Promise((r) => { ctx.dock.onclick = (e) => { const t = e.target.closest("[data-k]"); if (t) r(Number(t.dataset.k)); }; });
      ctx.dock.onclick = null;
      const v = myCards[k];
      const cardEl = ctx.dock.querySelector(`[data-k="${k}"]`);
      cardEl.classList.remove("back"); cardEl.textContent = v; cardEl.classList.add("open"); ctx.fx.sound.pop();
      ctx.dock.querySelectorAll(".u4-card.back").forEach((x) => { x.disabled = true; });
      ctx.dock.insertAdjacentHTML("beforeend", `<button type="button" class="sm-btn u4-none" data-none>놓을 곳이 없어요</button>`);
      const act = await new Promise((r) => {
        ctx.dock.onclick = (e) => { if (e.target.closest("[data-none]")) r({ none: true }); };
        me.el.onclick = (e) => { const c = e.target.closest(".sd-cell"); if (c && me.g[c.dataset.r][c.dataset.c] === ".") r({ r: Number(c.dataset.r), c: Number(c.dataset.c) }); };
      });
      ctx.dock.onclick = null; me.el.onclick = null;
      if (!act.none && sol[act.r][act.c] === v) {
        me.set(act.r, act.c, v); myCards.splice(k, 1); ctx.fx.sound.good();
        if (me.full()) { winner = "me"; break; }
      } else {
        ctx.mistake(); ctx.fx.sound.bad();
        if (act.none) {
          const spots = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (me.g[r][c] === "." && sol[r][c] === v) spots.push([r, c]);
          me.mark(spots, "hl", 1800); await ctx.guide.encourage("반짝이는 칸에 놓을 수 있었어요. 카드를 다시 뒤집어요.");
        } else {
          const g2 = me.g.map((row) => row.slice()); g2[act.r][act.c] = v;
          const cf = conflict(g2, { only: [act.r, act.c] });
          if (cf) { me.mark(cf.line, "hl", 1600); me.mark(cf.cells.filter(([y, x]) => !(y === act.r && x === act.c)), "bad", 1600); await ctx.guide.encourage(BAD.number[cf.type].say); }
          else await ctx.guide.encourage("그 칸이 아니에요. 카드를 다시 뒤집어 놓아요.");
        }
        myCards = shuffle(myCards);
      }
      await ctx.wait(300);
      // 독쌤 차례
      ctx.dock.innerHTML = `<div class="u4-cards"><span class="u4-wait">독쌤 차례…</span></div>`;
      await ctx.wait(700);
      const dk = Math.floor(Math.random() * docCards.length), dv = docCards[dk];
      const spots = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (doc.g[r][c] === "." && solD[r][c] === dv) spots.push([r, c]);
      ctx.dock.innerHTML = `<div class="u4-cards"><span class="u4-card open">${dv}</span></div>`;
      ctx.fx.sound.pop();
      await ctx.wait(700);
      if (spots.length && Math.random() < 0.72) {
        const [r, c] = spots[Math.floor(Math.random() * spots.length)];
        doc.set(r, c, dv); docCards.splice(dk, 1); docDeck(); ctx.fx.sound.tap();
        if (doc.full()) winner = "doc";
      } else {
        await ctx.guide.say("어? 독쌤은 놓을 곳을 못 찾았어요. 카드를 다시 뒤집어요.");
        docCards = shuffle(docCards);
      }
      await ctx.wait(400);
    }
    ctx.dock.innerHTML = "";
    if (winner === "me") { wins++; await sweep(ctx, me); ctx.fx.cheer(null, { big: true }); ctx.fx.sound.fanfare(); await ctx.guide.praise("내가 먼저 완성했어요! 이겼어요!"); }
    else { ctx.fx.sound.good(); await ctx.guide.say("독쌤이 먼저 완성했어요. 다음 판에 다시 도전!"); }
    await ctx.next(round < 2 ? "활동판 바꾸기" : "결과 보기", { icon: round < 2 ? "🔄" : "🏁" });
  }
  ctx.stage.innerHTML = `<div class="u4-fill col"><p class="u4-score">두 판 중 <b>${wins}</b>판 이겼어요</p></div>`;
  ctx.fx.sound.fanfare();
  await ctx.guide.praise("숫자 스도쿠 박사! 가로, 세로, 굵은 네모를 보면 숫자 자리가 보여요.");
  await ctx.next("끝내기", { icon: "🏁" });
}

export const LESSON = {
  title: "색깔 스도쿠와 숫자 스도쿠",
  subtitle: "사탕 상자에서 시작해 색깔·숫자 스도쿠를 완성해요",
  coverArt: "🧩",
  doneTitle: "스도쿠 1차시 끝!",
  doneText: "가로줄, 세로줄, 굵은 선 안의 네모에 모두 다른 것! 색깔도 숫자도 같은 규칙이에요.",
  steps: [
    { page: "78쪽 · 커지는 생각", run: p78 },
    { page: "79쪽 · 커지는 생각", run: p79 },
    { page: "80쪽 · 쑥쑥 자라는 사고 1", run: p80 },
    { page: "81쪽 · 쑥쑥 자라는 사고 1", run: p81 },
    { page: "82~83쪽 · 활동", run: myColor },
    { page: "84쪽 · 쑥쑥 자라는 사고 2", run: p84 },
    { page: "85쪽 · 활동", run: cardGame }
  ]
};
