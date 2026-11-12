// 1단원 길이 재기 · 3차시 — 푸리수리 1~8번(원본 19~24쪽) + 창의력 Game 「길 만들기」(25~26쪽, 길 만들기 카드 A1-3-2)
// 지문은 원본 그대로(ctx.source). 그림 수치는 원본 그림에서 칸을 세어 옮겼다:
//   1(1) 연두 3·검정 7·노랑 5 / 1(2) 갈색 8·노랑 5·초록 6, 2 색연필 파랑·빨강·검정(빨강이 가장 김), 3 키 2·4·3칸(3칸×5줄 격자),
//   4 붓 = 큐브 5(빨강 3개 띄엄, 파랑 3개, 노랑 5개 맞음, 초록 4개 들쭉날쭉), 5 연필 4·6·3, 6 숟가락 3·빗 4(큐브 칸 5개),
//   7 분홍 6(다섯째 칸부터)·노랑 7(다섯째 칸부터)·연두 8(첫 칸부터)(11칸×5줄), 8 받침 1·2·3개(머리 높이 같음, 여우·원숭이·고양이).
//   길 만들기 카드: 굽은 길 6·곧은 길 6·네거리 4(활동지 A1-3-2). 길 연결 판정은 지오메트리 「길 잇기 산책로」(path-walk)의 방향 비트를 쓴다.
import { geocube, OBJ, kid, stand, standAt } from "../art.js?v=20261113k";
import { directionBits, rotateMask } from "../../../geometry/games/path-walk/levels.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const svg = (vb, body, cls = "sm-scene") => `<svg class="${cls}" viewBox="${vb}" preserveAspectRatio="xMidYMid meet">${body}</svg>`;
const circle = (cx, cy) => `<ellipse class="sm-mark" cx="${cx}" cy="${cy}" rx="34" ry="26" fill="none" stroke="#e8417f" stroke-width="5"/>`;
const tri = (cx, cy) => `<path class="sm-mark" d="M${cx} ${cy - 26} L${cx + 28} ${cy + 20} L${cx - 28} ${cy + 20}Z" fill="none" stroke="#e8417f" stroke-width="5"/>`;
const barIcon = (color, len) => `<svg width="${len * 12}" height="24"><rect x="0" y="2" width="${len * 12}" height="20" rx="4" fill="${color}" stroke="rgba(0,0,0,.2)"/></svg>`;

// ── 막대 고르기(시작선이 같은 막대 / 격자 위 막대) ─────────────
async function barsChoose(ctx, { bars, grid = null, U = 46, correct, praise, wrongSay }) {
  const cols = grid?.cols || Math.max(...bars.map((b) => (b.from || 0) + b.len)) + 1, rows = grid?.rows || bars.length * 2 - 1;
  const W = cols * U, H = rows * U;
  const cells = grid ? Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, c) => `<rect x="${c * U}" y="${r * U}" width="${U}" height="${U}" fill="none" stroke="#9aa7b8" stroke-dasharray="5 4"/>`).join("")).join("") : `<line x1="0" y1="-10" x2="0" y2="${H + 10}" stroke="#5a6478" stroke-width="2"/>`;
  const body = cells + bars.map((b, i) => `<rect x="${(b.from || 0) * U}" y="${(grid ? b.row : i * 2) * U + 3}" width="${b.len * U}" height="${U - 6}" fill="${b.color}"/>`).join("") + `<g class="marks"></g>`;
  ctx.stage.innerHTML = svg(`-30 -30 ${W + 160} ${H + 60}`, body);
  await ctx.choose(bars.map((b) => ({ value: b.v, art: barIcon(b.color, Math.min(b.len, 8)), name: b.name })), { correct, praise, wrongSay });
  const i = bars.findIndex((b) => b.v === correct);
  ctx.stage.querySelector(".marks").innerHTML = circle(W + 70, (grid ? bars[i].row : i * 2) * U + U / 2);
  await ctx.wait(800);
}

// 1번 (19쪽)
async function q1(ctx) {
  await ctx.source("19");
  ctx.guide.say("(1) 가장 긴 막대를 찾아요.");
  await barsChoose(ctx, { bars: [{ v: "a", name: "연두색 막대", color: "#c5dd6b", len: 3 }, { v: "b", name: "검은색 막대", color: "#3b4545", len: 7 }, { v: "c", name: "노란색 막대", color: "#f6e04a", len: 5 }],
    correct: "b", praise: "맞아요! 검은색 막대가 가장 길어요.", wrongSay: "시작이 모두 같아요. 끝이 가장 멀리 간 막대는요?" });
  ctx.guide.say("(2) 이번에도 가장 긴 막대를 찾아요.");
  await barsChoose(ctx, { bars: [{ v: "a", name: "갈색 막대", color: "#9b8650", len: 8 }, { v: "b", name: "노란색 막대", color: "#f6e04a", len: 5 }, { v: "c", name: "초록색 막대", color: "#23906a", len: 6 }],
    correct: "a", praise: "맞아요! 갈색 막대가 가장 길어요.", wrongSay: "끝이 가장 멀리 간 막대를 찾아요." });
  await ctx.next("다음");
}

// 2·3번 (20쪽)
const pencilSvg = (x, y, len, body) => `<g transform="translate(${x} ${y})"><rect x="0" y="0" width="${len - 50}" height="34" fill="${body}"/><rect x="0" y="12" width="${len - 50}" height="8" fill="#fff" opacity=".25"/><path d="M${len - 50} 0 L${len} 17 L${len - 50} 34Z" fill="#ffe08a"/><path d="M${len - 16} 11 L${len} 17 L${len - 16} 23Z" fill="${body}"/></g>`;
async function q23(ctx) {
  const pg = await ctx.source("20");
  const pens = [{ v: "blue", name: "파란 색연필", c: "#6f86d6", len: 290 }, { v: "red", name: "빨간 색연필", c: "#f2543d", len: 355 }, { v: "black", name: "검은 색연필", c: "#4a4f4f", len: 232 }];
  ctx.stage.innerHTML = svg("-30 -20 560 260", `<line x1="0" y1="-10" x2="0" y2="235" stroke="#5a6478" stroke-width="2"/>${pens.map((p, i) => pencilSvg(0, i * 80, p.len, p.c)).join("")}<g class="marks"></g>`);
  ctx.guide.say("가장 긴 색연필을 찾아요.");
  await ctx.choose(pens.map((p) => ({ value: p.v, art: `<svg width="110" height="24" viewBox="0 0 ${p.len} 34">${pencilSvg(0, 0, p.len, p.c)}</svg>`, name: p.name })),
    { correct: "red", praise: "맞아요! 빨간 색연필이 가장 길어요.", wrongSay: "시작이 같아요. 끝이 가장 멀리 간 것은요?" });
  ctx.stage.querySelector(".marks").innerHTML = circle(470, 80 + 17);
  await ctx.wait(700);
  ctx.dispose(); ctx.reset("20쪽");
  ctx.setSource(pg?.text2 || "키가 가장 작은 친구에 △표 하세요.");
  await ctx.guide.say(pg?.text2 || "", { display: false });
  // 3칸 × 5줄 격자, 키 2·4·3칸
  const C = 70, cw = 150, people = [
    { v: "a", h: 2, look: { hair: "girl", hairColor: "#6a4a3a", shirt: "#f2743d", dress: true } },
    { v: "b", h: 4, look: { hair: "boy", hairColor: "#e8a33a", shirt: "#4e8a4a", bottom: "#f2e9a0" } },
    { v: "c", h: 3, look: { hair: "bob", hairColor: "#c9a77a", shirt: "#f7b7c9", dress: true } }
  ];
  const TOP = 0.125, BOT = 0.062;
  const fig = (p, i) => { const hh = p.h * C / (1 - TOP - BOT), w = hh / 1.35; return `<svg x="${i * cw + cw / 2 - w / 2}" y="${5 * C - p.h * C - hh * TOP}" width="${w}" height="${hh}" viewBox="0 0 120 162">${kid({ ...p.look, size: 120 }).replace(/^<svg[^>]*>|<\/svg>$/g, "")}</svg>`; };
  const grid = Array.from({ length: 5 }, (_, r) => Array.from({ length: 3 }, (_, c) => `<rect x="${c * cw}" y="${r * C}" width="${cw}" height="${C}" fill="none" stroke="#9aa7b8" stroke-dasharray="5 4"/>`).join("")).join("");
  ctx.stage.innerHTML = svg(`-20 -20 ${cw * 3 + 40} ${C * 5 + 90}`, `${grid}${people.map(fig).join("")}<g class="marks"></g>`);
  ctx.guide.say("칸을 세어 보면 알 수 있어요.");
  await ctx.choose(people.map((p, i) => ({ value: p.v, art: kid({ ...p.look, size: 46 }), name: `${i + 1}번 친구` })),
    { correct: "a", praise: "맞아요! 첫째 친구가 2칸으로 가장 작아요.", wrongSay: "몇 칸까지 올라오는지 세어 봐요." });
  ctx.stage.querySelector(".marks").innerHTML = tri(cw / 2, 5 * C + 50);
  await ctx.wait(700);
  await ctx.next("다음");
}

// 4번 (21쪽) 붓을 큐브로 바르게 잰 것
async function q4(ctx) {
  await ctx.source("21");
  const U = 64, L = 5 * U, x0 = 30;
  const rows = [
    { v: "red", name: "빨간 큐브", c: "#ff8a73", cubes: [[0, 0], [2, 0], [4, 0]] },
    { v: "blue", name: "파란 큐브", c: "#7f8fd1", cubes: [[0, 0], [1, 0], [2, 0]] },
    { v: "yellow", name: "노란 큐브", c: "#ffd862", cubes: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]] },
    { v: "green", name: "초록 큐브", c: "#8bd17c", cubes: [[0, 0], [1.24, 0.25], [2.48, 0], [3.72, 0.25]] }
  ];
  ctx.stage.innerHTML = svg(`0 0 ${x0 * 2 + L + 140} 470`, `<line x1="${x0}" y1="6" x2="${x0}" y2="464" stroke="#f0a050" stroke-dasharray="7 6" stroke-width="2"/><line x1="${x0 + L}" y1="6" x2="${x0 + L}" y2="464" stroke="#f0a050" stroke-dasharray="7 6" stroke-width="2"/>${OBJ.brush(x0, 20, L, 40)}${rows.map((r, k) => r.cubes.map(([i, dy]) => geocube(x0 + i * U, 84 + k * 96 + dy * U, U, r.c)).join("")).join("")}<g class="marks"></g>`);
  ctx.guide.say("시작과 끝을 맞추고, 사이가 뜨지 않게 잰 것을 찾아요.");
  const icon = (c) => `<svg width="90" height="30" viewBox="0 0 90 30">${[0, 1, 2].map((i) => geocube(i * 30, 0, 29, c)).join("")}</svg>`;
  await ctx.choose(rows.map((r) => ({ value: r.v, art: icon(r.c), name: r.name })),
    { correct: "yellow", praise: "맞아요! 노란 큐브가 시작과 끝을 맞추고 빈틈없이 잰 거예요.", wrongSay: "띄엄띄엄 놓거나 끝까지 안 가면 바르게 잰 게 아니에요." });
  ctx.stage.querySelector(".marks").innerHTML = circle(x0 + L + 70, 84 + 2 * 96 + U / 2);
  await ctx.wait(700);
  await ctx.next("다음");
}

// 5번 (22쪽) 연필은 큐브 몇 개
async function q5(ctx) {
  await ctx.source("22");
  const U = 60, items = [{ n: 4, c: "#8bd17c" }, { n: 6, c: "#7f8fd1" }, { n: 3, c: "#ffd862" }];
  for (const [k, it] of items.entries()) {
    ctx.stage.innerHTML = svg(`0 0 ${it.n * U + 80} 150`, `${OBJ.pencilY(20, 20, it.n * U, 30)}${Array.from({ length: it.n }, (_, i) => geocube(20 + i * U, 52, U, it.c)).join("")}<text x="2" y="16" font-size="18" font-weight="800" fill="#4a5a78">(${k + 1})</text>`);
    ctx.guide.say(`(${k + 1}) 연필의 길이는 큐브 몇 개만큼일까요?`);
    await ctx.number(it.n, { max: 10, before: "큐브", after: "개" });
    await ctx.wait(500);
  }
  await ctx.next("다음");
}

// 6번 (23쪽) 물건의 길이만큼 큐브 색칠
async function q6(ctx) {
  await ctx.source("23");
  const U = 64, items = [{ kind: "spoon", n: 3, c: "#ffd862", name: "숟가락" }, { kind: "comb", n: 4, c: "#ff8a73", name: "빗" }];
  for (const [k, it] of items.entries()) {
    ctx.stage.innerHTML = svg(`0 0 ${5 * U + 60} 170`, `<line x1="20" y1="6" x2="20" y2="100" stroke="#f0a050" stroke-width="2"/><line x1="${20 + it.n * U}" y1="6" x2="${20 + it.n * U}" y2="100" stroke="#f0a050" stroke-width="2"/>${OBJ[it.kind](20, 14, it.n * U, 44)}<g class="cells">${Array.from({ length: 5 }, (_, i) => `<g data-i="${i}" style="cursor:pointer">${geocube(20 + i * U, 70, U, it.c, { dashed: true })}<rect x="${20 + i * U}" y="70" width="${U}" height="${U}" fill="transparent"/></g>`).join("")}</g><text x="2" y="12" font-size="16" font-weight="800" fill="#4a5a78">(${k + 1})</text>`);
    ctx.dock.innerHTML = `<p class="sm-docknote">👆 큐브 칸을 눌러 물건 길이만큼 색칠해요</p>`;
    ctx.guide.say(`(${k + 1}) ${it.name}의 길이만큼 큐브를 눌러 색칠해요.`);
    await new Promise((resolve) => {
      const cells = ctx.stage.querySelector(".cells");
      cells.addEventListener("click", (e) => {
        const g = e.target.closest("[data-i]"); if (!g) return;
        const upto = Number(g.dataset.i) + 1;
        cells.querySelectorAll("[data-i]").forEach((el) => { const i = Number(el.dataset.i); el.innerHTML = geocube(20 + i * U, 70, U, it.c, { dashed: i >= upto, bad: i >= it.n && i < upto }) + `<rect x="${20 + i * U}" y="70" width="${U}" height="${U}" fill="transparent"/>`; });
        ctx.fx.sound.tap();
        if (upto === it.n) { resolve(); }
        else if (upto > it.n) { ctx.mistake(); ctx.fx.sound.bad(); ctx.guide.encourage("물건 끝을 넘었어요. 끝 선까지만 색칠해요."); }
      });
    });
    ctx.fx.cheer(null);
    ctx.guide.say(`큐브 몇 개가 사용되었나요?`);
    await ctx.number(it.n, { max: 5, before: "큐브", after: "개" });
    await ctx.wait(500);
  }
  await ctx.next("다음");
}

// 7·8번 (24쪽)
async function q78(ctx) {
  const pg = await ctx.source("24");
  ctx.guide.say("시작하는 곳이 달라요. 칸을 세어 봐요!");
  await barsChoose(ctx, { grid: { cols: 11, rows: 5 }, U: 44, bars: [
    { v: "pink", name: "분홍색 막대", color: "#f7a6bb", row: 0, from: 4, len: 6 },
    { v: "yellow", name: "노란색 막대", color: "#f8ef7a", row: 2, from: 4, len: 7 },
    { v: "green", name: "연두색 막대", color: "#c9e05e", row: 4, from: 0, len: 8 }],
    correct: "green", praise: "맞아요! 연두색 막대가 8칸으로 가장 길어요.", wrongSay: "끝만 보지 말고 몇 칸인지 세어 봐요." });
  ctx.dispose(); ctx.reset("24쪽");
  ctx.setSource(pg?.text2 || "키가 가장 작은 동물에 △표 하세요.");
  await ctx.guide.say(pg?.text2 || "", { display: false });
  const B = 34, Hk = 250, an = [{ v: "fox", name: "여우", b: 1 }, { v: "monkey", name: "원숭이", b: 2 }, { v: "cat", name: "고양이", b: 3 }];
  const body = `<line x1="0" y1="${400 - Hk}" x2="600" y2="${400 - Hk}" stroke="#6b7a90" stroke-dasharray="6 5" stroke-width="2"/><line x1="0" y1="400" x2="600" y2="400" stroke="#4a5568" stroke-width="3"/>` +
    an.map((a, i) => { const cx = 100 + i * 200; return Array.from({ length: a.b }, (_, k) => `<rect x="${cx - 55}" y="${400 - (k + 1) * B}" width="110" height="${B - 3}" rx="8" fill="#fff" stroke="#6b7a90" stroke-width="2"/>`).join("") + standAt(a.v, cx, 400 - a.b * B, Hk - a.b * B); }).join("") + `<g class="marks"></g>`;
  ctx.stage.innerHTML = svg("-20 120 640 330", body);
  ctx.guide.say("머리 높이는 같아요. 받침을 보세요!");
  await ctx.choose(an.map((a) => ({ value: a.v, art: stand(a.v, 64), name: a.name })),
    { correct: "cat", praise: "맞아요! 받침을 3개나 딛어야 머리가 같아지니 고양이가 가장 작아요.", wrongSay: "받침이 많을수록 키는 어떨까요?" });
  ctx.stage.querySelector(".marks").innerHTML = tri(500, 430);
  await ctx.wait(700);
  await ctx.next("다음");
}

// ── 창의력 Game 길 만들기(25~26쪽) ─────────────────────────
const { N, E, S, W } = directionBits;
const CARDS = [...Array(6).fill(N | E), ...Array(6).fill(N | S), ...Array(4).fill(N | E | S | W)];   // 굽은 길 6 · 곧은 길 6 · 네거리 4
// 길 카드 그림(회색 바닥 + 노란 길, 원본 카드처럼)
function tileSvg(mask, x, y, s) {
  const r1 = s * 0.35, r2 = s * 0.65, w = s * 0.3, c = s / 2;
  const has = (d) => (mask & d) !== 0, cnt = [N, E, S, W].filter(has).length;
  let road;
  const corner = cnt === 2 && !(has(N) && has(S)) && !(has(E) && has(W));
  if (corner) {
    const cx = has(E) ? s : 0, cy = has(N) ? 0 : s, sx = has(E) ? -1 : 1, sy = has(N) ? 1 : -1;
    const p = (r, a) => [cx + sx * r * Math.cos(a), cy + sy * r * Math.sin(a)];
    const [a1, b1] = p(r2, 0), [a2, b2] = p(r2, Math.PI / 2), [a3, b3] = p(r1, Math.PI / 2), [a4, b4] = p(r1, 0);
    const sweep = sx * sy > 0 ? 1 : 0;
    road = `<path d="M${a1} ${b1} A${r2} ${r2} 0 0 ${sweep} ${a2} ${b2} L${a3} ${b3} A${r1} ${r1} 0 0 ${1 - sweep} ${a4} ${b4}Z" fill="#fff35a" stroke="#222" stroke-width="2"/>`;
  } else {
    road = [N, E, S, W].filter(has).map((d) => d === N ? `<rect x="${c - w / 2}" y="0" width="${w}" height="${c + w / 2}"/>` : d === S ? `<rect x="${c - w / 2}" y="${c - w / 2}" width="${w}" height="${c + w / 2}"/>` : d === E ? `<rect x="${c - w / 2}" y="${c - w / 2}" width="${c + w / 2}" height="${w}"/>` : `<rect x="0" y="${c - w / 2}" width="${c + w / 2}" height="${w}"/>`).join("");
    road = `<g fill="#fff35a" stroke="#222" stroke-width="2">${road}</g><g fill="#fff35a">${[N, E, S, W].filter(has).map((d) => d === N || d === S ? `<rect x="${c - w / 2 + 1}" y="${d === N ? 0 : c - w / 2}" width="${w - 2}" height="${c + w / 2}"/>` : `<rect x="${d === W ? 0 : c - w / 2}" y="${c - w / 2 + 1}" width="${c + w / 2}" height="${w - 2}"/>`).join("")}</g>`;
  }
  return `<g transform="translate(${x} ${y})"><rect width="${s}" height="${s}" fill="#ded8cf" stroke="#fff" stroke-width="2"/>${road}</g>`;
}
async function roadGame(ctx) {
  const pg = await ctx.source("25");
  const T = 120, bx = 60, by = 110;
  const board = Array.from({ length: 9 }, () => null);   // { card: index, mask }
  const used = new Set();
  let sel = null, focus = null;
  const draw = () => {
    const cells = board.map((b, i) => { const r = Math.floor(i / 3), c = i % 3, x = bx + c * T, y = by + r * T; return `<g data-cell="${i}" style="cursor:pointer">${b ? tileSvg(b.mask, x, y, T) : `<rect x="${x}" y="${y}" width="${T}" height="${T}" fill="#fff" stroke="#3a4558" stroke-width="2"/>`}${focus === i ? `<rect x="${x + 3}" y="${y + 3}" width="${T - 6}" height="${T - 6}" fill="none" stroke="#2f7de1" stroke-width="6"/>` : ""}</g>`; }).join("");
    const tray = CARDS.map((m, k) => { const x = 520 + (k % 4) * 78, y = 60 + Math.floor(k / 4) * 78; return used.has(k) ? `<rect x="${x}" y="${y}" width="70" height="70" rx="6" fill="#f1f3f6" stroke="#d5dbe4" stroke-dasharray="4 3"/>` : `<g data-card="${k}" style="cursor:pointer">${tileSvg(m, x, y, 70)}${sel === k ? `<rect x="${x - 3}" y="${y - 3}" width="76" height="76" fill="none" stroke="#2f7de1" stroke-width="6" rx="6"/>` : ""}</g>`; }).join("");
    ctx.stage.querySelector(".play").innerHTML = cells + tray;
  };
  const house = (x, y) => `<g transform="translate(${x - 40} ${y})"><ellipse cx="40" cy="62" rx="44" ry="9" fill="#9ccc65"/><rect x="10" y="26" width="60" height="36" fill="#fff" stroke="#8a93a3"/><path d="M2 30 L40 2 L78 30Z" fill="#8f86c9" stroke="#6a62a8"/><rect x="32" y="40" width="16" height="22" fill="#8f86c9"/></g>`;
  const bunny = (x, y) => OBJ.rabbit(x - 18, y - 48, 36, 48);
  ctx.stage.innerHTML = svg("0 -10 860 600", `
    ${bunny(bx + T / 2, 48)}<path d="M${bx + T / 2} 56 L${bx + T / 2} 100" stroke="#f2b632" stroke-width="5"/><path d="M${bx + T / 2 - 9} 92 L${bx + T / 2} 104 L${bx + T / 2 + 9} 92" fill="none" stroke="#f2b632" stroke-width="5"/>
    <path d="M${bx + 2.5 * T} ${by + 3 * T + 6} L${bx + 2.5 * T} ${by + 3 * T + 44}" stroke="#f2b632" stroke-width="5"/>${house(bx + 2.5 * T, by + 3 * T + 48)}
    <text x="520" y="40" font-size="20" font-weight="800" fill="#4a5a78">길 만들기 카드</text>
    <g class="play"></g><g class="walker"></g>`);
  draw();
  ctx.dock.innerHTML = `<div class="sm-tray"><button class="sm-btn big" type="button" data-rot><span class="ico">↻</span> 돌리기</button><button class="sm-btn big" type="button" data-del><span class="ico">✕</span> 빼기</button></div>`;
  await ctx.guide.say("카드를 골라 빈칸에 놓아요. 놓은 카드를 누르면 빙글 돌아가요. 토끼가 집까지 갈 수 있게 길을 이어요!");
  // 토끼 칸(0) 위쪽에서 들어가 집 칸(8) 아래쪽으로 나가는 길이 끊어지지 않고 이어졌는지(path-walk 방향 비트)
  const route = () => {
    const opp = { [N]: S, [S]: N, [E]: W, [W]: E }, step = { [N]: [-1, 0], [S]: [1, 0], [E]: [0, 1], [W]: [0, -1] };
    if (!board[0] || !(board[0].mask & N)) return null;
    const prev = new Map([[0, -1]]), q = [0];
    while (q.length) {
      const i = q.shift(), r = Math.floor(i / 3), c = i % 3;
      if (i === 8 && board[8].mask & S) { const path = []; for (let k = i; k !== -1; k = prev.get(k)) path.unshift(k); return path; }
      for (const d of [N, E, S, W]) {
        if (!(board[i].mask & d)) continue;
        const [dr, dc] = step[d], rr = r + dr, cc = c + dc, j = rr * 3 + cc;
        if (rr < 0 || rr > 2 || cc < 0 || cc > 2 || prev.has(j) || !board[j] || !(board[j].mask & opp[d])) continue;
        prev.set(j, i); q.push(j);
      }
    }
    return null;
  };
  const path = await new Promise((resolve) => {
    const check = () => { const p = route(); if (p) resolve(p); };
    ctx.stage.addEventListener("click", (e) => {
      const card = e.target.closest("[data-card]"), cell = e.target.closest("[data-cell]");
      if (card) { sel = Number(card.dataset.card); focus = null; ctx.fx.sound.tap(); draw(); ctx.guide.say("이제 놓을 칸을 눌러요."); return; }
      if (!cell) return;
      const i = Number(cell.dataset.cell);
      if (sel !== null && !board[i]) { board[i] = { card: sel, mask: CARDS[sel] }; used.add(sel); sel = null; focus = i; ctx.fx.sound.drop(); draw(); check(); return; }
      if (board[i]) { focus = i; board[i].mask = rotateMask(board[i].mask, 1); ctx.fx.sound.pop(); draw(); check(); }
    });
    ctx.dock.addEventListener("click", (e) => {
      if (focus === null || !board[focus]) return;
      if (e.target.closest("[data-rot]")) { board[focus].mask = rotateMask(board[focus].mask, 1); ctx.fx.sound.pop(); }
      else if (e.target.closest("[data-del]")) { used.delete(board[focus].card); board[focus] = null; focus = null; ctx.fx.sound.tap(); }
      else return;
      draw(); check();
    });
  });
  ctx.dock.innerHTML = "";
  // 토끼가 길을 따라 집까지
  const walker = ctx.stage.querySelector(".walker");
  const pts = [[bx + T / 2, by - 20], ...path.map((i) => [bx + (i % 3) * T + T / 2, by + Math.floor(i / 3) * T + T / 2 + 14]), [bx + 2.5 * T, by + 3 * T + 40]];
  ctx.stage.querySelector(".sm-scene").querySelectorAll("svg").forEach(() => {});
  for (const [x, y] of pts) { walker.innerHTML = bunny(x, y); ctx.fx.sound.tap(); await ctx.wait(380); }
  ctx.fx.sound.fanfare(); ctx.fx.cheer(null, { big: true });
  await ctx.guide.praise(`길이 모두 이어졌어요! ${pg?.examples?.[1]?.[1] || "길이 모두 연결됨"} — 토끼가 집에 도착했어요!`);
  await ctx.next("끝내기", { icon: "🏁" });
}

export const LESSON = {
  title: "푸리수리와 길 만들기",
  subtitle: "배운 것을 풀어 보고 길을 만들어요",
  coverArt: "🛤️",
  doneTitle: "길이 재기 단원 끝!",
  doneText: "길이는 시작을 맞추고 끝을 봐요. 같은 큐브로 재면 몇 개인지로 비교할 수 있어요.",
  steps: [
    { page: "19쪽 · 푸리수리 1", run: q1 },
    { page: "20쪽 · 푸리수리 2·3", run: q23 },
    { page: "21쪽 · 푸리수리 4", run: q4 },
    { page: "22쪽 · 푸리수리 5", run: q5 },
    { page: "23쪽 · 푸리수리 6", run: q6 },
    { page: "24쪽 · 푸리수리 7·8", run: q78 },
    { page: "25~26쪽 · 창의력 Game", run: roadGame }
  ]
};
