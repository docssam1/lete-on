// 2단원 무게 재기 · 3차시 (원본 44~48쪽) — 푸리수리 5~8번 + 창의력 Game 「더 무거워! 더 가벼워!」(사물 카드 A1-3-4)
// 원본 그림에서 옮긴 값: 44 고양이 = 큐브 5(아래 3·위 2), 여우 = 큐브 4(2×2) / 45 배구공 2·농구공 3 / 46 수박 3·참외 2·딸기 1
//   / 47 당근 2·고구마 4(2×2)·감자 1 / 사물 카드 큐브: 가위 7·풀 5·연필 2·지우개 3·휴지 11·컵 1·지갑 7·색연필 4·테이프 8·거울 12·칫솔 6·시계 9
// 게임: 원본은 두 명이 짝. 사이트는 나 대 독쌤, 차례대로 예측(내 차례·독쌤 차례 번갈아), 6판.
import { scale, cubeStack, colStack, colWidth, thingAt, thingIcon, svgScene, ring } from "../scale2d.js?v=20261115a";
import { orderTap } from "./u2-s2.js?v=20261115a";

// 원본 「( , )」 빈칸 안에는 작은 그림이 들어 있다
const fillPair = (t, kinds) => t.replace("( , )", `( ${kinds.map((k) => thingIcon(k, 34)).join(" , ")} )`);
const josa = (w, a, b) => { const c = String(w).charCodeAt(String(w).length - 1) - 0xac00; return c >= 0 && c <= 11171 && c % 28 ? `${w}${a}` : `${w}${b}`; };

// 44쪽 5번 — 큐브 수 쓰고 더 무거운 동물
async function p44(ctx) {
  const pg = await ctx.source("44");
  const items = [{ k: "cat", name: "고양이", rows: [3, 2], n: 5 }, { k: "fox", name: "여우", rows: [2, 2], n: 4 }];
  for (const it of items) {
    ctx.stage.innerHTML = svgScene("0 0 600 280", scale({ x: 80, y: 160, w: 440, left: (cx, cy) => thingAt(it.k, cx, cy, 120), right: (cx, cy) => cubeStack(it.rows, cx, cy, 44), base: "#3cb371" }));
    ctx.guide.say(`저울이 나란해요. ${josa(it.name, "의", "의")} 무게는 큐브 몇 개와 같을까요?`);
    await ctx.number(it.n, { max: 10, before: `${thingIcon(it.k, 50)}${pg?.frame?.[0] || "의 무게는"} ${pg?.frame?.[1] || "큐브"}`, after: pg?.frame?.[2] || "개와 같습니다." });
    await ctx.wait(400);
  }
  ctx.stage.innerHTML = svgScene("0 0 600 200", `<g transform="translate(150 150)">${thingAt("cat", 0, 0, 120)}</g><text x="260" y="110" font-size="40" font-weight="900" fill="#1f5fb3">5</text><g transform="translate(400 150)">${thingAt("fox", 0, 0, 120)}</g><text x="510" y="110" font-size="40" font-weight="900" fill="#1f5fb3">4</text>`);
  ctx.guide.say("더 무거운 동물은 누구일까요?");
  ctx.dock.innerHTML = `<div class="col"><div class="sm-frame">${fillPair(pg?.frame2 || "더 무거운 동물은 ( , )입니다.", ["cat", "fox"])}</div><div class="sm-tray" data-c></div></div>`;
  await ctx.choose(items.map((it) => ({ value: it.k, art: thingIcon(it.k), name: it.name })), { correct: "cat", host: ctx.dock.querySelector("[data-c]"), wrongSay: "큐브가 더 많은 동물이 더 무거워요.", praise: "맞아요! 고양이가 큐브 5개로 더 무거워요." });
  await ctx.next("다음");
}

// 45·46쪽 — 큐브 수로 비교(둘/셋)
async function compare(ctx, { page, items, correct, praise, base }) {
  const pg = await ctx.source(page);
  const W = 440, n = items.length;
  const vbW = n === 2 ? 1060 : 980, vbH = n === 2 ? 270 : 470;
  const pos = n === 2 ? [[40, 150], [580, 150]] : [[20, 160], [540, 160], [280, 380]];
  ctx.stage.innerHTML = svgScene(`0 0 ${vbW} ${vbH}`, items.map((it, i) => scale({ x: pos[i][0], y: pos[i][1], w: W, base, left: (cx, cy) => thingAt(it.k, cx, cy, it.h || 90), right: (cx, cy) => cubeStack(it.rows, cx, cy, 40) })).join(""));
  ctx.guide.say("저울은 모두 나란해요. 큐브를 세어 비교해요!");
  ctx.dock.innerHTML = `<div class="col"><div class="sm-frame">${fillPair(pg?.frame2 || "", items.map((it) => it.k))}</div><div class="sm-tray" data-c></div></div>`;
  await ctx.choose(items.map((it) => ({ value: it.k, art: thingIcon(it.k), name: it.name })), { correct, host: ctx.dock.querySelector("[data-c]"), wrongSay: "큐브가 가장 많은 쪽이 가장 무거워요.", praise });
  await ctx.next("다음");
}
const p45 = (ctx) => compare(ctx, { page: "45", base: "#9ad0f5", correct: "basketball", praise: "맞아요! 농구공이 큐브 3개로 더 무거워요.",
  items: [{ k: "volleyball", name: "배구공", rows: [2] }, { k: "basketball", name: "농구공", rows: [3] }] });
const p46 = (ctx) => compare(ctx, { page: "46", base: "#d16aa0", correct: "watermelon", praise: "맞아요! 수박이 큐브 3개로 가장 무거워요.",
  items: [{ k: "watermelon", name: "수박", rows: [3], h: 100 }, { k: "melon", name: "참외", rows: [2], h: 70 }, { k: "strawberry", name: "딸기", rows: [1], h: 60 }] });

// 47쪽 8번 — 가장 무거운 것부터
async function p47(ctx) {
  await ctx.source("47");
  ctx.stage.innerHTML = svgScene("0 0 980 470", scale({ x: 20, y: 160, w: 420, base: "#7b8fd6", left: (cx, cy) => thingAt("carrot", cx, cy, 80), right: (cx, cy) => cubeStack([2], cx, cy, 42) }) +
    scale({ x: 540, y: 160, w: 420, base: "#7b8fd6", left: (cx, cy) => thingAt("sweetpotato", cx, cy, 86), right: (cx, cy) => cubeStack([2, 2], cx, cy, 42) }) +
    scale({ x: 280, y: 380, w: 420, base: "#7b8fd6", left: (cx, cy) => thingAt("potato", cx, cy, 70), right: (cx, cy) => cubeStack([1], cx, cy, 42) }));
  ctx.guide.say("큐브가 많은 것부터 차례로 눌러요!");
  await orderTap(ctx, [{ k: "carrot", name: "당근", w: 2 }, { k: "sweetpotato", name: "고구마", w: 4 }, { k: "potato", name: "감자", w: 1 }], { hint: "당근은 큐브 2개, 고구마는 4개, 감자는 1개예요." });
  await ctx.guide.praise("고구마, 당근, 감자 순서로 무거워요!");
  await ctx.next("다음");
}

// ── 48쪽 창의력 Game 「더 무거워! 더 가벼워!」 ──────────────────
// 사물 카드 A1-3-4(원본 105쪽)를 그림으로 다시 그림: 네모 카드, 왼쪽 위 물건, 오른쪽 아래 분홍 큐브 기둥.
// 학습 흐름(원장 2026-11-12 「학습적으로 도움이 안돼」): ① 물건 그림만 보고 무게 예측 → ② 큐브 가리개를 벗기고 두 카드 큐브 세기
//   → ③ 큐브를 저울에 올려 기울기 확인 → ④ 원본 규칙대로 맞으면 짝의 카드를 가져오고 틀리면 내 카드를 준다.
const CARD_SVG = {
  가위: `<path d="M47 52 L33 6 Q38 2 42 7 L54 50Z" fill="#eef3f7" stroke="#333" stroke-width="2.5"/><path d="M53 52 L67 6 Q62 2 58 7 L46 50Z" fill="#eef3f7" stroke="#333" stroke-width="2.5"/><ellipse cx="33" cy="76" rx="12" ry="18" transform="rotate(25 33 76)" fill="none" stroke="#3b5bb5" stroke-width="7"/><ellipse cx="67" cy="76" rx="12" ry="18" transform="rotate(-25 67 76)" fill="none" stroke="#3b5bb5" stroke-width="7"/><circle cx="50" cy="52" r="5" fill="#3b5bb5" stroke="#333" stroke-width="2"/>`,
  풀: `<rect x="34" y="18" width="32" height="64" fill="#2e7d32" stroke="#222" stroke-width="2.5"/><rect x="34" y="18" width="32" height="9" fill="#fff" stroke="#222" stroke-width="2"/>${[38, 50, 62, 74].map((y) => `<path d="M34 ${y} h32" stroke="#a5d6a7" stroke-width="1.5"/>`).join("")}<path d="M45 27 v55 M55 27 v55" stroke="#a5d6a7" stroke-width="1.5"/><rect x="33" y="4" width="34" height="15" rx="5" fill="#ffd740" stroke="#222" stroke-width="2.5"/><rect x="33" y="81" width="34" height="14" rx="5" fill="#ffd740" stroke="#222" stroke-width="2.5"/>`,
  연필: `<g transform="rotate(25 50 50)"><rect x="43" y="16" width="14" height="68" fill="#f2c230" stroke="#333" stroke-width="2"/><path d="M48 16 v68 M52 16 v68" stroke="#c99a10" stroke-width="1.5"/><path d="M43 16 L50 0 L57 16Z" fill="#f3d9b1" stroke="#333" stroke-width="2"/><path d="M48 5 L50 0 L52 5Z" fill="#333"/><rect x="43" y="84" width="14" height="10" rx="2" fill="#e57373" stroke="#333" stroke-width="2"/></g>`,
  지우개: `<g transform="rotate(-14 50 55)"><rect x="8" y="40" width="84" height="34" rx="13" fill="#fff" stroke="#222" stroke-width="3"/><rect x="40" y="36" width="54" height="40" rx="4" fill="#ff9f40" stroke="#222" stroke-width="3"/><rect x="40" y="36" width="54" height="13" fill="#ffe14d" stroke="#222" stroke-width="3"/></g>`,
  휴지: `<path d="M18 34 V78 A32 10 0 0 0 82 78 V34" fill="#fff" stroke="#8a8a8a" stroke-width="2.5"/><path d="M40 46 v30" stroke="#999" stroke-width="1.5" stroke-dasharray="3 3"/><ellipse cx="50" cy="34" rx="32" ry="10" fill="#f4f4f4" stroke="#8a8a8a" stroke-width="2.5"/><ellipse cx="50" cy="34" rx="10" ry="3.5" fill="#b9cfd8" stroke="#8a8a8a" stroke-width="2"/>`,
  컵: `<path d="M28 20 L34 86 Q50 92 66 86 L72 20" fill="#f5fbff" stroke="#555" stroke-width="2.5"/><ellipse cx="50" cy="20" rx="22" ry="6" fill="#fff" stroke="#555" stroke-width="2.5"/>`,
  지갑: `<g transform="rotate(10 50 50)"><rect x="8" y="30" width="80" height="42" rx="8" fill="#2b2b2b" stroke="#000" stroke-width="2"/><rect x="12" y="66" width="74" height="9" rx="2" fill="#c8c8c8" stroke="#555" stroke-width="1.5"/><rect x="58" y="32" width="30" height="15" rx="7" fill="#444"/><circle cx="74" cy="39" r="3.5" fill="#ddd"/></g>`,
  색연필: [["#5b7fd1", -18, 30], ["#ff6d2e", 0, 50], ["#666", 16, 68]].map(([c, r, x]) => `<g transform="rotate(${r} ${x} 60)"><rect x="${x - 6}" y="20" width="12" height="74" fill="${c}" stroke="#333" stroke-width="2"/><path d="M${x - 6} 20 L${x} 4 L${x + 6} 20Z" fill="#f3d9b1" stroke="#333" stroke-width="2"/><path d="M${x - 2} 9 L${x} 4 L${x + 2} 9Z" fill="${c}"/></g>`).join(""),
  테이프: `<path d="M34 82 Q24 36 56 28 Q88 26 88 58 L88 82Z" fill="#8a5a2b" stroke="#5a3a1a" stroke-width="2.5"/><circle cx="62" cy="54" r="12" fill="#f4f4f4" stroke="#5a3a1a" stroke-width="2.5"/><circle cx="62" cy="54" r="5" fill="#8a5a2b"/><path d="M38 44 L8 68 L17 76 L42 56Z" fill="#ffc94d" stroke="#d99a00" stroke-width="1.5"/>`,
  거울: `<path d="M52 62 L68 94" stroke="#2aa7c9" stroke-width="10" stroke-linecap="round"/><ellipse cx="42" cy="36" rx="24" ry="31" fill="#c9eefa" stroke="#2aa7c9" stroke-width="7"/><path d="M32 18 L36 52" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`,
  칫솔: `<g transform="rotate(-48 50 50)"><rect x="0" y="46" width="76" height="8" rx="4" fill="#4cc3e0" stroke="#2a8fa8" stroke-width="1.5"/><rect x="72" y="44" width="26" height="11" rx="4" fill="#4cc3e0" stroke="#2a8fa8" stroke-width="1.5"/>${[76, 80, 84, 88, 92, 96].map((x) => `<path d="M${x} 44 v-11" stroke="#d6d6d6" stroke-width="3"/>`).join("")}</g>`,
  시계: `<path d="M16 50 Q16 26 48 24 Q80 26 80 50 L80 58 Q80 78 48 78 Q16 78 16 58Z" fill="none" stroke="#a3245a" stroke-width="13"/><circle cx="66" cy="64" r="18" fill="#ffd54f" stroke="#c79100" stroke-width="3"/><circle cx="66" cy="64" r="12.5" fill="#6ec1f0"/><path d="M66 64 V55 M66 64 L73 68" stroke="#234" stroke-width="2.5" stroke-linecap="round"/>`
};
// 원본 카드 큐브 기둥(왼쪽부터 높이) — 원본 105쪽에서 셈
const CARDS = [["가위", [2, 3, 2]], ["풀", [2, 2, 1]], ["연필", [1, 1]], ["지우개", [1, 1, 1]], ["휴지", [4, 4, 3]], ["컵", [1]],
  ["지갑", [2, 3, 2]], ["색연필", [2, 2]], ["테이프", [3, 3, 2]], ["거울", [4, 4, 4]], ["칫솔", [2, 2, 2]], ["시계", [3, 3, 3]]]
  .map(([name, cols], id) => ({ id, name, cols, w: cols.reduce((a, b) => a + b, 0) }));
const CS = 11;   // 카드 속 큐브 한 변
// 카드 한 장(SVG). cubes: "show" | "hide"(가리개) | "count"(큐브에 번호), back: 뒷면
function cardSvg(c, { cubes = "show", back = false } = {}) {
  if (back) return `<svg class="sm-ocard" viewBox="0 0 120 120"><rect x="1" y="1" width="118" height="118" rx="8" fill="#ffe3ea" stroke="#e05a6a" stroke-width="2.5"/><path d="M14 14 h92 v92 h-92z" fill="none" stroke="#f3a3b4" stroke-width="2" stroke-dasharray="5 4"/><text x="60" y="78" font-size="52" font-weight="900" text-anchor="middle" fill="#e05a6a">?</text></svg>`;
  const x0 = 112 - colWidth(c.cols, CS), base = 112, h = Math.max(...c.cols) * CS + CS * 0.32;
  let cube = colStack(c.cols, x0, base, CS);
  if (cubes === "count") { let k = 0; c.cols.forEach((hh, i) => { for (let r = 0; r < hh; r++) cube += `<text x="${x0 + i * CS + CS / 2}" y="${base - r * CS - 2.5}" font-size="8.5" font-weight="900" text-anchor="middle" fill="#b0306a">${++k}</text>`; }); }
  // 가리개는 모든 카드가 같은 크기(크기로 무게가 드러나지 않게)
  if (cubes === "hide") cube = `<rect x="70" y="58" width="45" height="57" rx="7" fill="#fff0f5" stroke="#f08db0" stroke-width="2" stroke-dasharray="4 3"/><text x="92.5" y="95" font-size="24" font-weight="900" text-anchor="middle" fill="#e05a8a">?</text>`;
  return `<svg class="sm-ocard" viewBox="0 0 120 120" role="img" aria-label="${c.name}"><rect x="1" y="1" width="118" height="118" rx="8" fill="#fff" stroke="#e05a6a" stroke-width="2.5"/><g transform="translate(4 4) scale(.86)">${CARD_SVG[c.name]}</g>${cube}</svg>`;
}
// 셀 때 쓰는 큰 큐브 — 큐브마다 눌러서 번호를 붙인다
function bigStack(cols, S = 40) {
  const d = S * 0.32, W = cols.length * S + d + 4, H = Math.max(...cols) * S + d + 4;
  let out = "", k = 0;
  cols.forEach((h, i) => { for (let r = 0; r < h; r++) {
    const x = 2 + i * S, y = H - 2 - (r + 1) * S;
    out += `<g data-k="${k++}" class="cb"><rect x="${x}" y="${y}" width="${S}" height="${S}" fill="#f9c6dc" stroke="#e58bb0" stroke-width="1.5"/>`;
    if (r === h - 1) out += `<path d="M${x} ${y} l${d} ${-d} h${S} l${-d} ${d}z" fill="#fde1ec" stroke="#e58bb0" stroke-width="1.5"/>`;
    if ((cols[i + 1] || 0) <= r) out += `<path d="M${x + S} ${y} l${d} ${-d} v${S} l${-d} ${d}z" fill="#f3a7c7" stroke="#e58bb0" stroke-width="1.5"/>`;
    out += `<text x="${x + S / 2}" y="${y + S * 0.7}" font-size="${S * 0.55}" font-weight="900" text-anchor="middle" fill="#fff"></text></g>`;
  } });
  return `<svg viewBox="0 0 ${W} ${H}" style="height:${Math.round(H * 1.15)}px;max-height:30vh;width:auto">${out}</svg>`;
}
const onPlate = (c, s = 17) => (cx, cy) => colStack(c.cols, cx - colWidth(c.cols, s) / 2, cy - 2, s);
const ROUNDS = 4;
async function cardGame(ctx) {
  await ctx.source("48");
  let mine = CARDS.map((c) => ({ ...c })), his = CARDS.map((c) => ({ ...c })), gotMe = 0, gotHim = 0;
  const tap = (host, sel) => new Promise((resolve) => { const on = (e) => { const b = e.target.closest(sel); if (!b) return; host.removeEventListener("click", on); resolve(b); }; host.addEventListener("click", on); });
  const score = (round) => `<div class="sm-cg-score"><span class="me">나 <b>${gotMe}</b>장</span><span>${round} / ${ROUNDS}판</span><span class="him">독쌤 <b>${gotHim}</b>장</span></div>`;
  await ctx.guide.say("물건 그림을 보고 어느 쪽이 더 무거울지 생각해요. 그다음 큐브를 세어 저울로 확인해요!");
  for (let round = 1; round <= ROUNDS; round++) {
    const myTurn = round % 2 === 1;
    // ① 카드 고르기 — 물건 그림만(큐브는 가림)
    ctx.stage.innerHTML = `<div class="sm-cg">${score(round)}<div class="sm-cg-hand">${mine.map((c) => `<button type="button" class="sm-cg-pick" data-id="${c.id}" aria-label="${c.name}">${cardSvg(c, { cubes: "hide" })}</button>`).join("")}</div></div>`;
    ctx.dock.innerHTML = "";
    ctx.guide.say(`${round}번째 판! 내 카드를 한 장 골라요.`);
    const pick = await tap(ctx.stage, "[data-id]");
    const me = mine.find((c) => c.id === Number(pick.dataset.id));
    ctx.fx.sound.pop();
    // 독쌤은 무게가 다른 카드를 주로 고른다(같은 무게는 가끔)
    const pool = his.filter((c) => c.w !== me.w);
    const src = pool.length && Math.random() > 0.12 ? pool : his.filter((c) => c.name !== me.name), him = src[Math.floor(Math.random() * src.length)];
    const table = (cm, ch, extra = "") => `<div class="sm-cg">${score(round)}<div class="sm-cg-table"><div class="side me"><div class="who">나 · ${cm.name}</div><div class="card" data-me>${cardSvg(me, { cubes: cm.cubes })}</div></div><div class="vs">VS</div><div class="side him"><div class="who">독쌤${ch.back ? "" : ` · ${him.name}`}</div><div class="card" data-him>${cardSvg(him, ch)}</div></div></div>${extra}</div>`;
    ctx.stage.innerHTML = table({ name: me.name, cubes: "hide" }, { back: true });
    await ctx.wait(500);
    // 독쌤 카드 뒤집기 — 물건만 보임
    ctx.fx.sound.tap();
    ctx.stage.innerHTML = table({ name: me.name, cubes: "hide" }, { cubes: "hide" });
    ctx.stage.querySelector("[data-him]").classList.add("flip");
    // ② 예측
    const q = `${josa(me.name, "이", "가")} ${him.name}보다 더 무거울까요, 더 가벼울까요?`;
    let saysHeavier;
    if (myTurn) {
      ctx.dock.innerHTML = `<div class="sm-tray"><button class="sm-btn go big" type="button" data-p="h">⬇️ 내 카드가 더 무거워!</button><button class="sm-btn blue big" type="button" data-p="l">⬆️ 내 카드가 더 가벼워!</button></div>`;
      ctx.guide.say(`내 차례! ${q}`);
      saysHeavier = (await tap(ctx.dock, "[data-p]")).dataset.p === "h";
      ctx.dock.innerHTML = `<div class="sm-cg-said">나: “내 카드가 더 ${saysHeavier ? "무거워" : "가벼워"}!”</div>`;
    } else {
      // 독쌤은 물건 크기로 어림해 말한다(가끔 틀림)
      saysHeavier = Math.random() < 0.78 ? him.w > me.w : him.w < me.w;
      ctx.dock.innerHTML = `<div class="sm-cg-said him">독쌤: “내 카드가 더 ${saysHeavier ? "무거워" : "가벼워"}!”</div>`;
      await ctx.guide.say(`독쌤 차례예요. 독쌤은 “${josa(him.name, "이", "가")} 더 ${saysHeavier ? "무거워" : "가벼워"}!”라고 했어요. 맞는지 같이 세어 봐요!`);
    }
    await ctx.wait(400);
    // ③ 큐브 세기 — 가리개를 벗기고, 큰 큐브를 하나씩 눌러 번호를 붙이며 센다(내 카드 → 독쌤 카드)
    for (const [who, c] of [["내 카드", me], ["독쌤 카드", him]]) {
      ctx.stage.innerHTML = `<div class="sm-cg">${score(round)}<div class="sm-cg-count"><div class="side"><div class="who">${who} · ${c.name}</div><div class="card open">${cardSvg(c)}</div></div><div class="arrow">➜</div><div class="sm-cg-big">${bigStack(c.cols)}</div></div></div>`;
      ctx.fx.sound.pop();
      const big = ctx.stage.querySelector(".sm-cg-big");
      let k = 0;
      const mark = (g) => { if (g.classList.contains("on")) return; g.classList.add("on"); g.querySelector("text").textContent = ++k; ctx.fx.sound.tap(); };
      big.addEventListener("click", (e) => { const g = e.target.closest("[data-k]"); if (g) mark(g); });
      ctx.guide.say(`${who} ${c.name}의 큐브를 하나씩 눌러 세어 봐요. 모두 몇 개예요?`);
      await ctx.number(c.w, { max: 12, before: `<span class="sm-cg-mini">${cardSvg(c)}</span>`, after: "개",
        hint: (n) => { if (n >= 2) { big.querySelectorAll("[data-k]").forEach(mark); ctx.guide.encourage("같이 세어 봤어요. 마지막 번호가 큐브 수예요!"); } else ctx.guide.encourage("큐브를 하나씩 눌러 번호를 붙여 봐요."); } });
      big.querySelectorAll("[data-k]").forEach(mark);
      await ctx.guide.praise(`${josa(c.name, "은", "는")} 큐브 ${c.w}개!`);
    }
    ctx.stage.innerHTML = table({ name: me.name, cubes: "show" }, { cubes: "show" });
    // ④ 저울로 확인
    const tilt = me.w > him.w ? "left" : me.w < him.w ? "right" : "level";
    // 저울은 두 카드 사이(VS 자리)에 — 내 카드 쪽이 왼쪽 접시, 독쌤 카드 쪽이 오른쪽 접시
    const balance = (t) => svgScene("70 18 460 210", scale({ x: 80, y: 128, w: 440, tilt: t, base: "#e8506a", left: onPlate(me), right: onPlate(him) }));
    ctx.dock.innerHTML = "";
    const mid = ctx.stage.querySelector(".sm-cg-table .vs");
    mid.className = "sm-cg-scale"; mid.innerHTML = balance("level");
    ctx.guide.say("큐브를 저울에 올려 봐요!");
    await ctx.wait(800);
    mid.innerHTML = balance(tilt); ctx.fx.sound.drop();
    await ctx.wait(300);
    if (tilt === "level") { await ctx.guide.say(`${me.w}개와 ${me.w}개, 큐브 수가 같아서 저울이 나란해요. 이번 판은 비겼어요!`); }
    else {
      const big = me.w > him.w ? me : him, small = big === me ? him : me;
      await ctx.guide.say(`${big.w}개가 ${small.w}개보다 많아요. ${josa(big.name, "이", "가")} 더 무거워서 저울이 내려갔어요!`);
      const predictor = myTurn ? me : him, other = myTurn ? him : me;
      const right = saysHeavier === (predictor.w > other.w);
      if (myTurn && right) { gotMe++; his = his.filter((c) => c !== him); ctx.fx.stamp("맞았어요!"); ctx.fx.cheer(null, { big: true }); await ctx.guide.praise(`예측이 맞았어요! 독쌤의 ${josa(him.name, "을", "를")} 가져와요.`); }
      else if (myTurn) { gotHim++; mine = mine.filter((c) => c !== me); ctx.fx.sound.bad(); await ctx.guide.encourage(`아쉬워요. 약속대로 내 ${josa(me.name, "을", "를")} 독쌤에게 줘요.`); }
      else if (right) { gotHim++; mine = mine.filter((c) => c !== me); await ctx.guide.say(`독쌤 예측이 맞았어요. 내 ${josa(me.name, "을", "를")} 독쌤에게 줘요.`); }
      else { gotMe++; his = his.filter((c) => c !== him); ctx.fx.stamp("독쌤이 틀렸어요!"); ctx.fx.cheer(null); await ctx.guide.praise(`독쌤 예측이 틀렸어요! 독쌤의 ${josa(him.name, "을", "를")} 내가 가져와요.`); }
    }
    const sc = ctx.stage.querySelector(".sm-cg-score"); if (sc) { sc.outerHTML = score(round); ctx.stage.querySelector(".sm-cg-score").classList.add("bump"); }
    ctx.dock.innerHTML = `<div class="sm-tray"><button class="sm-btn go big" type="button" data-go>${round < ROUNDS ? "▶ 다음 판" : "🏁 결과 보기"}</button></div>`;
    await tap(ctx.dock, "[data-go]");
  }
  ctx.dock.innerHTML = "";
  ctx.stage.innerHTML = `<div class="sm-cg">${score(ROUNDS)}</div>`;
  const msg = gotMe > gotHim ? `카드를 ${gotMe}장 가져왔어요. 내가 이겼어요!` : gotMe === gotHim ? `${gotMe}대 ${gotHim}, 비겼어요!` : `독쌤이 ${gotHim}장으로 이겼어요. 다음엔 꼭 이겨 봐요!`;
  ctx.fx.sound.fanfare(); ctx.fx.cheer(null, { big: gotMe >= gotHim });
  await ctx.guide.praise(`${msg} 큐브가 많을수록 더 무거워요.`);
  await ctx.next("끝내기", { icon: "🏁" });
}

export const LESSON = {
  title: "무게 비교 푸리수리",
  subtitle: "풀어 보고, 사물 카드로 무게를 예측하고 세어 확인해요",
  coverArt: "⚖️",
  doneTitle: "무게 재기 단원 끝!",
  doneText: "무거운 쪽은 내려가고, 같으면 수평! 큐브가 많을수록 무거워요.",
  steps: [
    { page: "44쪽 · 푸리수리 5", run: p44 },
    { page: "45쪽 · 푸리수리 6", run: p45 },
    { page: "46쪽 · 푸리수리 7", run: p46 },
    { page: "47쪽 · 푸리수리 8", run: p47 },
    { page: "48쪽 · 창의력 Game", run: cardGame }
  ]
};
