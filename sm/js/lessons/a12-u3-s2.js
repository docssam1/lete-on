// A1-2 3단원 수와 숫자의 탄생 · 2차시 (원본 58~63쪽)
//  58 1~20 순서대로 빈칸(사과) · 59 거꾸로 빈칸(나무) · 60 「수 완성하기」 백판 숫자칩(나 대 독쌤)
//  61 11→20 토끼 길, 10→1 고양이 길 · 62 물고기(세모 4·사다리꼴 3) · 63 오리(육각형 1·세모 6·마름모 3)
//  빈칸·길·블록 위치는 원본 그림에서 옮겼다(sm/data/a1-2.local.json data, 공개 저장소에는 정답 수만 코드에).
import { scene, seqFill, numPath, blockCount, onHit, countSay } from "../numbers.js?v=20261115b";

const range = (a, b) => (a <= b ? Array.from({ length: b - a + 1 }, (_, i) => a + i) : Array.from({ length: a - b + 1 }, (_, i) => a - i));
// 4줄 × 5칸 배치. blanks: 빈칸인 수
const grid20 = (nums, blanks) => nums.map((v, i) => ({ x: 110 + (i % 5) * 120, y: 70 + Math.floor(i / 5) * 112, v, n: blanks.includes(v) ? null : v }));

async function p58(ctx) {
  await ctx.source("58");
  ctx.guide.say("반짝이는 빈칸에 들어갈 수를 아래에서 골라요!");
  await seqFill(ctx, { cells: grid20(range(1, 20), [4, 5, 8, 11, 12, 13, 18, 19, 20]), vb: "0 0 700 450", kind: "apple", size: 90 });
  await ctx.guide.praise("1부터 20까지 순서대로 다 채웠어요!");
  await ctx.next("다음");
}
async function p59(ctx) {
  await ctx.source("59");
  ctx.guide.say("이번엔 거꾸로! 20부터 하나씩 작아져요.");
  await seqFill(ctx, { cells: grid20(range(20, 1), [17, 16, 14, 12, 9, 6, 3, 1]), vb: "0 0 700 450", kind: "tree", size: 96, reverse: true });
  await ctx.guide.praise("20부터 1까지 거꾸로도 잘 썼어요!");
  await ctx.next("다음");
}

// ── 60쪽 「수 완성하기」: 백판(두 줄만 씀)과 숫자칩 ──
function boardSvg(state, { tray = [], sel = null } = {}) {
  const cell = 74, x0 = 20, y0 = 30;
  const cells = range(1, 20).map((n, i) => {
    const x = x0 + (i % 10) * cell, y = y0 + Math.floor(i / 10) * cell, has = state[n];
    return `<g class="nm-hit nm-slotcell" data-n="${n}"><rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${has ? "#fff" : "#fff3b0"}" stroke="#d9b84a" stroke-width="2.5"/>${has ? `<circle cx="${x + cell / 2}" cy="${y + cell / 2}" r="${cell * 0.4}" fill="#ffffff" stroke="#7fb2e8" stroke-width="4"/><text x="${x + cell / 2}" y="${y + cell / 2 + 11}" text-anchor="middle" font-size="30" font-weight="900" fill="#25324a">${n}</text>` : ""}</g>`;
  }).join("");
  const chips = tray.map((n, i) => { const x = 60 + i * 66, y = 250; return `<g class="nm-hit nm-chip" data-n="${n}"><circle cx="${x}" cy="${y}" r="30" fill="${sel === n ? "#ffe066" : "#fff"}" stroke="${sel === n ? "#e8417f" : "#7fb2e8"}" stroke-width="5"/><text x="${x}" y="${y + 11}" text-anchor="middle" font-size="28" font-weight="900" fill="#25324a">${n}</text></g>`; }).join("");
  return `<rect x="10" y="20" width="760" height="168" rx="12" fill="#ffe680"/>${cells}${tray.length ? `<text x="20" y="210" font-size="22" font-weight="800" fill="#4a5a78">숫자칩</text>` : ""}${chips}`;
}
const pickN = (k) => { const a = range(1, 20); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, k).sort(() => Math.random() - 0.5); };
async function fillBoard(ctx, missing) {
  const state = {}; range(1, 20).forEach((n) => { state[n] = !missing.includes(n); });
  let tray = [...missing], sel = null, wrong = 0;
  const draw = () => scene(ctx, "0 0 780 300", boardSvg(state, { tray, sel }));
  let svg = draw();
  ctx.dock.innerHTML = `<p class="sm-docknote">👉 숫자칩을 누르고, 들어갈 빈칸을 눌러요</p>`;
  ctx.guide.say("숫자칩을 하나 누르고, 그 수가 들어갈 빈칸을 눌러요!");
  await new Promise((resolve) => {
    const bind = () => onHit(svg, ".nm-chip, .nm-slotcell", async (el) => {
      const n = Number(el.dataset.n);
      if (el.classList.contains("nm-chip")) { sel = n; ctx.fx.sound.tap(); svg = draw(); bind(); return; }
      if (state[n]) return;
      if (sel === null) { ctx.guide.encourage("먼저 아래 숫자칩을 골라요."); return; }
      if (sel === n) {
        state[n] = true; tray = tray.filter((x) => x !== n); sel = null; ctx.fx.sound.pop(); svg = draw(); bind();
        const c = svg.querySelector(`.nm-slotcell[data-n="${n}"]`); ctx.fx.burstAt(c, { power: 0.5 });
        if (!tray.length) resolve();
        return;
      }
      wrong++; ctx.mistake(); ctx.fx.sound.bad();
      el.classList.remove("nm-no"); void el.getBoundingClientRect(); el.classList.add("nm-no");
      ctx.guide.encourage(wrong >= 2 ? "빈칸 앞의 수를 보고, 그다음 수를 생각해요." : "그 자리가 아니에요. 앞뒤 수를 봐요.");
    });
    bind();
  });
  ctx.dock.innerHTML = "";
  ctx.fx.cheer(null, { big: true });
}
async function p60(ctx) {
  await ctx.source("60");
  // 1판: 독쌤이 5개를 뺌 → 내가 채움
  const full = {}; range(1, 20).forEach((n) => { full[n] = true; });
  let svg = scene(ctx, "0 0 780 300", boardSvg(full));
  await ctx.guide.say("백판에 1부터 20까지 숫자칩이 순서대로 있어요. 독쌤이 숫자칩 5개를 뺄게요. 잘 봐요!");
  const m1 = pickN(5);
  for (const n of m1) { full[n] = false; svg = scene(ctx, "0 0 780 300", boardSvg(full)); ctx.fx.sound.pop(); await ctx.wait(450); }
  await fillBoard(ctx, m1);
  await ctx.guide.praise("빈 곳에 숫자칩을 알맞게 놓았어요!");
  // 2판: 내가 5개를 뺌 → 독쌤이 채움
  range(1, 20).forEach((n) => { full[n] = true; });
  svg = scene(ctx, "0 0 780 300", boardSvg(full));
  ctx.dock.innerHTML = `<p class="sm-docknote">👉 숫자칩 5개를 눌러서 빼요 · <b class="nm-left">5</b>개 남음</p>`;
  ctx.guide.say("이번엔 내가 숫자칩 5개를 빼요. 빼고 싶은 칩을 눌러요!");
  const mine = [];
  await new Promise((resolve) => {
    const off = onHit(svg, ".nm-slotcell", (el) => {
      const n = Number(el.dataset.n); if (!full[n]) return;
      full[n] = false; mine.push(n); ctx.fx.sound.pop();
      el.innerHTML = el.innerHTML.replace(/<circle[\s\S]*<\/text>/, ""); el.querySelector("rect").setAttribute("fill", "#fff3b0");
      ctx.dock.querySelector(".nm-left").textContent = 5 - mine.length;
      if (mine.length === 5) { off(); resolve(); }
    });
  });
  ctx.dock.innerHTML = "";
  await ctx.guide.say("독쌤이 채워 볼게요. 맞게 놓는지 봐요!");
  for (const n of [...mine].sort((a, b) => a - b)) { full[n] = true; svg = scene(ctx, "0 0 780 300", boardSvg(full)); ctx.fx.sound.pop(); countSay(ctx, n); await ctx.wait(800); }
  await ctx.guide.say("독쌤도 다 맞혔어요!");
  // 3판: 익숙해지면 10개
  range(1, 20).forEach((n) => { full[n] = true; });
  await ctx.guide.say("익숙해졌으면 이번엔 숫자칩 10개를 빼 볼게요!");
  const m3 = pickN(10);
  for (const n of m3) { full[n] = false; scene(ctx, "0 0 780 300", boardSvg(full)); ctx.fx.sound.pop(); await ctx.wait(300); }
  await fillBoard(ctx, m3);
  await ctx.guide.praise("10개도 모두 제자리에 놓았어요! 1부터 20까지 순서를 잘 알아요.");
  await ctx.next("다음");
}

// ── 61쪽 수를 따라 길 그리기 ──
const rabbit = `<g transform="scale(.8)"><ellipse cx="-12" cy="-44" rx="8" ry="22" fill="#fff" stroke="#9aa6b8" stroke-width="2.5"/><ellipse cx="8" cy="-46" rx="8" ry="22" fill="#fff" stroke="#9aa6b8" stroke-width="2.5"/><ellipse cx="-12" cy="-44" rx="3.5" ry="14" fill="#ffc6de"/><ellipse cx="8" cy="-46" rx="3.5" ry="14" fill="#ffc6de"/><ellipse cx="0" cy="14" rx="26" ry="22" fill="#fff" stroke="#9aa6b8" stroke-width="2.5"/><circle cx="-2" cy="-12" r="20" fill="#fff" stroke="#9aa6b8" stroke-width="2.5"/><circle cx="-9" cy="-14" r="2.6" fill="#33241a"/><circle cx="5" cy="-14" r="2.6" fill="#33241a"/><ellipse cx="-2" cy="-6" rx="3" ry="2" fill="#f47aa8"/></g>`;
const carrot = `<g transform="scale(.8)"><path d="M-8 -16 L8 -16 L2 36 Q0 40 -2 36Z" fill="#ff8a1c" stroke="#d96a0a" stroke-width="2.5"/><path d="M0 -16 q-14 -18 -6 -30 q4 12 6 14 q2 -16 10 -22 q2 18 -4 32z" fill="#4fae40"/></g>`;
const cat = `<g transform="scale(.8)"><path d="M-20 -26 L-14 -46 L-4 -30Z M20 -26 L14 -46 L4 -30Z" fill="#ffb347" stroke="#c97a1f" stroke-width="2.5"/><ellipse cx="0" cy="18" rx="24" ry="22" fill="#ffb347" stroke="#c97a1f" stroke-width="2.5"/><circle cx="0" cy="-14" r="22" fill="#ffb347" stroke="#c97a1f" stroke-width="2.5"/><circle cx="-8" cy="-16" r="3" fill="#33241a"/><circle cx="8" cy="-16" r="3" fill="#33241a"/><path d="M-4 -6 q4 4 8 0" stroke="#33241a" stroke-width="2" fill="none"/><path d="M-12 -8 h-14 M12 -8 h14" stroke="#c97a1f" stroke-width="2"/></g>`;
const fish = `<g transform="scale(.8)"><path d="M-30 0 Q-6 -24 22 0 Q-6 24 -30 0Z" fill="#7a8ca6" stroke="#4a5a78" stroke-width="2.5"/><path d="M20 0 L40 -16 L36 0 L40 16Z" fill="#7a8ca6" stroke="#4a5a78" stroke-width="2.5"/><circle cx="-18" cy="-4" r="3" fill="#25324a"/></g>`;
async function p61(ctx) {
  const pg = await ctx.source("61");
  await numPath(ctx, { grid: [[11, 12, 14, 16, 14], [13, 13, 16, 17, 18], [16, 14, 15, 14, 19], [12, 13, 17, 18, 20]], seq: range(11, 20), start: [0, 0], end: [3, 4], who: rabbit, goal: carrot, cell: 84,
    say: { start: "11에서 시작해요. 12, 13… 다음 수가 쓰인 옆 칸을 눌러요!" } });
  await ctx.guide.praise("토끼가 당근을 먹었어요!");
  await ctx.wait(500);
  if (pg?.text2) { ctx.setSource(pg.text2); await ctx.guide.say(pg.text2, { display: false }); }
  await numPath(ctx, { grid: [[10, 7, 8, 6, 5], [9, 10, 4, 1, 2], [8, 9, 4, 3, 5], [7, 6, 5, 2, 1]], seq: range(10, 1), start: [0, 0], end: [3, 4], who: cat, goal: fish, cell: 84,
    say: { start: "이번엔 거꾸로! 10에서 시작해서 9, 8… 하나씩 작아지는 수를 따라가요." } });
  await ctx.guide.praise("고양이도 생선을 먹었어요!");
  await ctx.next("다음");
}

// ── 62·63쪽 패턴블록 ──
//  62쪽 좌표: x 1칸 = 세모 높이, y 1칸 = 변의 절반 / 63쪽 좌표: x 1칸 = 변의 절반, y 1칸 = 세모 높이 (원본에서 옮김)
const U = 110, HT = U * 0.866;
const fishPieces = [
  ["tri", [[0, 0], [1, -1], [1, 1]]], ["trap", [[1, -1], [2, -2], [2, 2], [1, 1]]], ["trap", [[2, -2], [3, -1], [3, 1], [2, 2]]],
  ["tri", [[2, -2], [3, -3], [3, -1]]], ["tri", [[2, 2], [3, 1], [3, 3]]], ["trap", [[3, -1], [4, -2], [4, 2], [3, 1]]], ["tri", [[4.06, 0], [5.06, -1], [5.06, 1]]]
].map(([type, pts]) => ({ type, pts: pts.map(([x, y]) => [60 + x * HT, 200 + y * U / 2]) }));
const duckPieces = [
  ["hex", [[2, 0], [4, 0], [5, 1], [4, 2], [2, 2], [1, 1]]], ["tri", [[0, 2], [1, 1], [2, 2]]],
  ["rho", [[2, 2], [3, 3], [2, 4], [1, 3]]], ["rho", [[4, 2], [5, 3], [4, 4], [3, 3]]], ["rho", [[6, 2], [7, 3], [6, 4], [5, 3]]],
  ["tri", [[2, 2], [4, 2], [3, 3]]], ["tri", [[4, 2], [6, 2], [5, 3]]], ["tri", [[6, 2], [8, 2], [7, 3]]], ["tri", [[2, 4], [3, 3], [4, 4]]], ["tri", [[4, 4], [5, 3], [6, 4]]]
].map(([type, pts]) => ({ type, pts: pts.map(([x, y]) => [80 + x * U / 2, 40 + y * HT]) }));
async function p62(ctx) {
  await ctx.source("62");
  await blockCount(ctx, { vb: "0 0 620 400", pieces: fishPieces, ask: ["tri", "trap"] });
  await ctx.guide.praise("물고기는 세모 4개, 사다리꼴 3개로 만들었어요!");
  await ctx.next("다음");
}
async function p63(ctx) {
  await ctx.source("63");
  await blockCount(ctx, { vb: "0 0 620 460", pieces: duckPieces, ask: ["hex", "tri", "rho"] });
  await ctx.guide.praise("오리는 육각형 1개, 세모 6개, 마름모 3개로 만들었어요!");
  await ctx.next("끝");
}

export const LESSON = {
  title: "20까지의 수",
  subtitle: "1부터 20까지 순서를 알고, 패턴블록을 세어요",
  coverArt: "🍎",
  doneTitle: "수와 숫자의 탄생 2차시 끝!",
  doneText: "1부터 20까지 순서대로, 거꾸로 셀 수 있어요. 모양별로 하나씩 짚으며 세면 빠뜨리지 않아요.",
  steps: [
    { page: "58쪽", run: p58 },
    { page: "59쪽", run: p59 },
    { page: "60쪽 · 활동", run: p60 },
    { page: "61쪽", run: p61 },
    { page: "62쪽", run: p62 },
    { page: "63쪽", run: p63 }
  ]
};
