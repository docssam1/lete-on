// A1-2 3·4단원(수와 숫자의 탄생 · 큰 수, 작은 수) 공용 부품 — 원본 54~96쪽 활동을 화면으로.
//  모두 SVG 한 장(무대를 꽉 채움)에 그리고, 5세가 손가락으로 누르기만 하면 되게 만든다.
//  독쌤 말은 정해진 문장만 쓴다(바뀌는 수는 화면에 크게 보이고, 소리는 「하나·둘…」 세기 말만) → 모두 독쌤 목소리로 미리 만든다.
import { svgScene } from "./scale2d.js?v=20261115b";

export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
export const scene = (ctx, vb, body) => { ctx.stage.innerHTML = svgScene(vb, body); return ctx.stage.querySelector("svg"); };
const sleep = (ctx, ms) => ctx.wait(ms);
// 세기 말(독쌤 목소리 「하나」~「스물」) — 1~20
export const countSay = (ctx, n) => ctx.guide.say(String(n), { mood: "explain", display: false });

// ── 작은 그림(모두 코드로 그림, 원본 삽화는 쓰지 않음). (x,y)=가운데, s=크기 ──────────────────
const CUBE = { red: ["#ff6b6b", "#e04848", "#ff9a9a"], blue: ["#6f8ff0", "#4d6cd6", "#9db2ff"], yellow: ["#ffd84a", "#f0b820", "#ffe98a"], green: ["#7bd36a", "#4fae40", "#a8e89b"], pink: ["#ff9ec7", "#ec6fa3", "#ffc6de"], purple: ["#b28cf0", "#8d63d6", "#d3bcff"], orange: ["#ffa94d", "#f08a1c", "#ffc98a"], brown: ["#c8955f", "#a5713c", "#e0b88c"] };
export const CUBE_COLORS = Object.keys(CUBE);
export function cube(x, y, s, color = "red") {
  const [f, d, t] = CUBE[color] || CUBE.red; const h = s / 2, k = s * 0.28;
  return `<g><path d="M${x - h} ${y - h + k}h${s - k}l${k} ${-k}v${s - k}l${-k} ${k}h${-(s - k)}z" fill="${d}"/><rect x="${x - h}" y="${y - h + k}" width="${s - k}" height="${s - k}" rx="${s * 0.08}" fill="${f}" stroke="rgba(0,0,0,.15)"/><path d="M${x - h} ${y - h + k}l${k} ${-k}h${s - k}l${-k} ${k}z" fill="${t}"/><circle cx="${x - h + (s - k) / 2}" cy="${y - h + k + (s - k) / 2}" r="${s * 0.12}" fill="${d}" opacity=".55"/></g>`;
}
const ICONS = {
  cube: (x, y, s, c) => cube(x, y, s, c || "red"),
  duck: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s / 100})"><ellipse cx="4" cy="16" rx="36" ry="24" fill="#ffd23f"/><circle cx="-20" cy="-14" r="20" fill="#ffd23f"/><path d="M-42 -12 l-14 5 l14 5z" fill="#ff8a1c"/><circle cx="-24" cy="-18" r="3.4" fill="#33241a"/><path d="M8 6 q18 -6 26 10 q-16 6 -26 -10z" fill="#f0b820"/></g>`,
  doll: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s / 100})"><path d="M-26 40 L-16 0 h32 l10 40z" fill="#f47aa8"/><circle cx="0" cy="-18" r="20" fill="#ffe1cc"/><path d="M-22 -20 q2 -26 22 -26 q20 0 22 26 q-8 -12 -22 -12 q-14 0 -22 12z" fill="#6a3c22"/><circle cx="-7" cy="-16" r="2.6" fill="#33241a"/><circle cx="7" cy="-16" r="2.6" fill="#33241a"/><path d="M-5 -8 q5 4 10 0" stroke="#c0564b" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="-20" cy="-36" r="7" fill="#5aa0f0"/><circle cx="20" cy="-36" r="7" fill="#5aa0f0"/></g>`,
  bear: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s / 100})"><circle cx="-24" cy="-26" r="13" fill="#b07a4a"/><circle cx="24" cy="-26" r="13" fill="#b07a4a"/><circle cx="0" cy="-6" r="32" fill="#c68b56"/><ellipse cx="0" cy="6" rx="15" ry="11" fill="#f1d3b0"/><circle cx="-11" cy="-12" r="3.6" fill="#33241a"/><circle cx="11" cy="-12" r="3.6" fill="#33241a"/><ellipse cx="0" cy="2" rx="5" ry="3.6" fill="#33241a"/><ellipse cx="0" cy="38" rx="26" ry="14" fill="#c68b56"/></g>`,
  car: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s / 100})"><path d="M-44 10 v-14 q0 -8 8 -9 l12 -14 q4 -5 12 -5 h22 q8 0 12 6 l10 13 q12 1 12 10 v13z" fill="#46c37b"/><path d="M-18 -24 h14 v15 h-24z M2 -24 h12 l10 15 h-22z" fill="#d9f5ff"/><circle cx="-24" cy="12" r="10" fill="#3b4252"/><circle cx="24" cy="12" r="10" fill="#3b4252"/><circle cx="-24" cy="12" r="4" fill="#c8ced8"/><circle cx="24" cy="12" r="4" fill="#c8ced8"/></g>`,
  strawberry: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s / 100})"><path d="M0 40 C-36 18 -36 -18 -20 -22 C-8 -26 8 -26 20 -22 C36 -18 36 18 0 40z" fill="#f0414f"/><path d="M-20 -22 l8 -14 l8 10 l4 -14 l4 14 l8 -10 l8 14 q-20 8 -40 0z" fill="#3fae49"/>${[[-12, -6], [4, -8], [14, 4], [-4, 8], [-16, 10], [8, 20], [-6, 24]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="2.2" ry="3.2" fill="#ffe08a"/>`).join("")}</g>`,
  eggplant: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s / 100})"><path d="M-10 -24 C-36 -2 -40 34 -8 40 C24 44 40 14 14 -16 C8 -24 -2 -30 -10 -24z" fill="#6b3fa0"/><path d="M-14 -22 C-20 -34 -4 -44 8 -30 C14 -24 4 -16 -14 -22z" fill="#3fae49"/><path d="M-4 -34 l-2 -12" stroke="#3fae49" stroke-width="5" stroke-linecap="round"/><path d="M-20 4 q-4 14 6 24" stroke="#9f74d6" stroke-width="5" fill="none" stroke-linecap="round"/></g>`,
  apple: (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s / 100})"><path d="M0 -22 C-18 -34 -42 -24 -40 4 C-38 30 -18 44 0 36 C18 44 38 30 40 4 C42 -24 18 -34 0 -22z" fill="${c === "off" || c === "line" ? "#fff" : "#f0414f"}" stroke="${c === "off" ? "#c9cfd8" : c === "line" ? "#f0414f" : "#c92c3a"}" stroke-width="${c === "line" ? 6 : 3}"/><path d="M0 -22 q-2 -12 6 -20" stroke="#7a4a22" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M6 -34 q14 -10 22 2 q-12 8 -22 -2z" fill="#3fae49"/></g>`,
  candy: (x, y, s, c) => { const col = { red: ["#ff6b6b", "#fff"], green: ["#46c37b", "#d6ffe3"], orange: ["#ffa94d", "#fff3d6"], pink: ["#ff9ec7", "#fff"] }[c || "red"]; return `<g transform="translate(${x} ${y}) scale(${s / 100})"><circle r="34" fill="${col[0]}"/><path d="M-30 -14 q30 -20 60 0 M-34 4 q34 -22 68 0 M-30 20 q30 -20 60 0" stroke="${col[1]}" stroke-width="7" fill="none" opacity=".85"/><circle cx="-12" cy="-14" r="7" fill="#fff" opacity=".5"/></g>`; },
  cake: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s / 100})"><path d="M-34 22 L30 -30 L36 -10 L-28 34z" fill="#8a5a3a"/><path d="M-34 22 L30 -30 L28 -40 L-40 14z" fill="#ffe8b3"/><path d="M-40 14 L28 -40" stroke="#ff9ec7" stroke-width="7" stroke-linecap="round"/><circle cx="20" cy="-40" r="7" fill="#f0414f"/></g>`,
  donut: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s / 100})"><ellipse rx="40" ry="28" fill="#e9a650"/><ellipse rx="34" ry="22" fill="#ffd36e"/><ellipse rx="12" ry="7" fill="#fff"/><path d="M-20 -8 l6 -3 M14 -12 l5 3 M18 8 l6 -2 M-14 12 l-5 2" stroke="#f05a8a" stroke-width="4" stroke-linecap="round"/></g>`,
  milk: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s / 100})"><path d="M-22 -18 l10 -20 h24 l10 20z" fill="#7bd36a"/><rect x="-22" y="-18" width="44" height="56" fill="#fff" stroke="#7bd36a" stroke-width="4"/><rect x="-22" y="0" width="44" height="18" fill="#7bd36a"/><rect x="-6" y="-46" width="12" height="9" fill="#4fae40"/></g>`,
  star: (x, y, s, c) => { const p = Array.from({ length: 10 }, (_, i) => { const r = i % 2 ? 0.42 : 1, a = -Math.PI / 2 + i * Math.PI / 5; return `${(Math.cos(a) * r * 48).toFixed(1)},${(Math.sin(a) * r * 48).toFixed(1)}`; }).join(" "); return `<g transform="translate(${x} ${y}) scale(${s / 100})"><polygon points="${p}" fill="${c || "#fff6c2"}" stroke="#e6b800" stroke-width="4" stroke-linejoin="round"/></g>`; },
  flower: (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s / 100})">${Array.from({ length: 8 }, (_, i) => `<ellipse rx="13" ry="22" fill="#ffb627" transform="rotate(${i * 45}) translate(0 -26)"/>`).join("")}<circle r="30" fill="${c || "#fff"}" stroke="#f08a1c" stroke-width="3"/></g>`,
  lily: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s / 100})"><ellipse rx="48" ry="33" fill="#8bd17c" stroke="#55b047" stroke-width="3"/><path d="M0 0 L-50 -9 L-50 9Z" fill="#7cc8f0"/><path d="M0 0 L-30 -16 M0 0 L22 -24 M0 0 L30 18 M0 0 L-18 24" stroke="#6bbf5c" stroke-width="2"/></g>`,
  tree: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s / 100})"><rect x="-5" y="20" width="10" height="24" fill="#9a6a3c"/><path d="M0 -40 C-30 -40 -42 -14 -30 0 C-44 12 -30 34 -8 26 C0 34 10 34 16 26 C38 34 46 10 32 0 C42 -16 28 -40 0 -40z" fill="#effbe6" stroke="#8bd17c" stroke-width="4"/></g>`,
  balloon: (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s / 100})"><path d="M0 40 q-6 20 4 40" stroke="#8a93a3" stroke-width="2.5" fill="none"/><ellipse rx="34" ry="40" fill="${c || "#ffb3c8"}"/><path d="M-4 38 l4 6 l4 -6z" fill="${c || "#ffb3c8"}"/><ellipse cx="-12" cy="-16" rx="7" ry="11" fill="#fff" opacity=".5"/></g>`,
  pumpkin: (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s / 100})"><ellipse rx="40" ry="32" fill="${c === "off" ? "#fff" : "#ffa94d"}" stroke="#d98a2b" stroke-width="3"/><path d="M-14 -30 q-8 30 0 60 M14 -30 q8 30 0 60" stroke="#d98a2b" stroke-width="3" fill="none"/><path d="M0 -30 v-12" stroke="#4fae40" stroke-width="6" stroke-linecap="round"/></g>`,
  melon: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s / 100})"><circle r="38" fill="#3c8a3a" stroke="#1f4a1e" stroke-width="3"/><path d="M-18 -33 q-10 33 0 66 M0 -38 v76 M18 -33 q10 33 0 66" stroke="#174016" stroke-width="5" fill="none"/><path d="M-4 -38 q2 -8 8 -10" stroke="#7a4a22" stroke-width="4" fill="none"/></g>`,
  onion: (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s / 100})"><path d="M0 -40 C-6 -20 -40 -10 -36 14 C-32 36 32 36 36 14 C40 -10 6 -20 0 -40z" fill="${c === "off" ? "#fff" : "#f7d9a8"}" stroke="#c9a36a" stroke-width="3"/><path d="M-10 -6 q10 -10 20 0" stroke="#c9a36a" stroke-width="2.5" fill="none"/></g>`
};
export const icon = (kind, x, y, s, c) => (ICONS[kind] || ICONS.cube)(x, y, s, c);
export const iconSvg = (kind, size = 64, c) => `<svg width="${size}" height="${size}" viewBox="-50 -50 100 100" aria-hidden="true">${icon(kind, 0, 0, 92, c)}</svg>`;

// 숫자 카드(누를 수 있는 글자 카드)
export const numCard = (x, y, n, { w = 64, h = 74, fill = "#fff", stroke = "#9cb8de", cls = "", font = 40, attrs = "" } = {}) =>
  `<g class="nm-card ${cls}" ${attrs}><rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="14" fill="${fill}" stroke="${stroke}" stroke-width="4"/><text x="${x}" y="${y + font * 0.36}" text-anchor="middle" font-size="${font}" font-weight="900" fill="#25324a">${n ?? ""}</text></g>`;

// ── 1~20 숫자판(10개씩 두 줄) ───────────────────────────────────────────────
// 맞힐 때까지. onWrong(n, wrong)이 있으면 그 안에서 힌트를 준다.
export function pad(ctx, correct, { host = ctx.dock, min = 1, max = 20, before = "", after = "", onWrong = null, wrongSay = "다시 세어 볼까요?" } = {}) {
  const nums = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  host.innerHTML = `<div class="nm-padwrap">
      <div class="nm-ask">${before}<span class="sm-answer" aria-live="polite">?</span>${esc(after)}</div>
      <div class="nm-pad ${nums.length > 10 ? "two" : ""}">${nums.map((n) => `<button class="sm-btn" type="button" data-n="${n}">${n}</button>`).join("")}</div></div>`;
  const box = host.querySelector(".sm-answer");
  return new Promise((resolve) => {
    let wrong = 0;
    const onClick = async (event) => {
      const b = event.target.closest("[data-n]"); if (!b || b.disabled) return;
      const n = Number(b.dataset.n);
      box.textContent = n; box.classList.remove("filled"); void box.offsetWidth; box.classList.add("filled");
      ctx.fx.sound.tap();
      if (n === correct) {
        host.querySelectorAll("[data-n]").forEach((x) => { x.disabled = true; });
        ctx.fx.cheer(box); host.removeEventListener("click", onClick); resolve(n);
      } else {
        wrong++; ctx.mistake(); ctx.fx.sound.bad(); ctx.fx.shake(box);
        if (onWrong) await onWrong(n, wrong); else ctx.guide.encourage(wrongSay);
      }
    };
    host.addEventListener("click", onClick);
  });
}

// SVG 안에서 누르기: sel에 맞는 요소를 누르면 fn(요소, 이벤트). 돌려받은 함수로 끈다.
export function onHit(root, sel, fn) {
  const h = (e) => { const t = e.target.closest(sel); if (t && root.contains(t)) fn(t, e); };
  root.addEventListener("click", h);
  return () => root.removeEventListener("click", h);
}
const svgEl = (tag, attrs = {}) => { const el = document.createElementNS("http://www.w3.org/2000/svg", tag); for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v); return el; };
const badge = (g, x, y, n, color = "#2a6fc4") => {
  const b = svgEl("g", { class: "nm-badge" });
  b.innerHTML = `<circle cx="${x}" cy="${y}" r="15" fill="${color}" stroke="#fff" stroke-width="3"/><text x="${x}" y="${y + 6}" text-anchor="middle" font-size="17" font-weight="900" fill="#fff">${n}</text>`;
  g.append(b); return b;
};
const shakeEl = (el) => { el.classList.remove("nm-no"); void el.getBoundingClientRect(); el.classList.add("nm-no"); };

// ── 10개 묶기(원본 56·65쪽) ─────────────────────────────────────────────────
//  items: [{kind, c, x, y}] — 화면 좌표(viewBox 0 0 W H). 10개를 하나씩 누르면 번호가 붙고 묶음 칸(2×5)으로 들어간다.
//  그다음 「남은 것」과 「모두」를 숫자판으로. say: { start, rest, total } 독쌤 말
export async function group10(ctx, { items, vb = "0 0 900 420", size = 54, tray = { x: 40, y: 40 }, unit = "개", back = "", ask = { rest: true, total: true }, say = {} }) {
  const svg = scene(ctx, vb, `${back}<g class="nm-tray"></g><g class="nm-items">${items.map((it, i) => `<g class="nm-hit nm-item" data-i="${i}" style="transform-origin:${it.x}px ${it.y}px">${icon(it.kind, it.x, it.y, size, it.c)}</g>`).join("")}</g><g class="nm-marks"></g>`);
  const trayG = svg.querySelector(".nm-tray"), marks = svg.querySelector(".nm-marks");
  const cell = size * 1.18, tw = cell * 5 + 16, th = cell * 2 + 16;
  trayG.innerHTML = `<rect x="${tray.x}" y="${tray.y}" width="${tw}" height="${th}" rx="18" fill="#fff8d6" stroke="#f0b820" stroke-width="4" stroke-dasharray="10 7"/><text x="${tray.x + tw / 2}" y="${tray.y + th + 30}" text-anchor="middle" font-size="22" font-weight="800" fill="#b8860b">10개 묶음</text>`;
  const slot = (k) => [tray.x + 8 + cell / 2 + (k % 5) * cell, tray.y + 8 + cell / 2 + Math.floor(k / 5) * cell];
  ctx.dock.innerHTML = "";
  ctx.guide.say(say.start || "10개를 묶어 보세요. 하나씩 눌러서 묶음 칸에 넣어요!");
  let k = 0;
  await new Promise((resolve) => {
    const off = onHit(svg, ".nm-item", async (g) => {
      if (g.dataset.in || k >= 10) return;
      const it = items[Number(g.dataset.i)]; const [sx, sy] = slot(k);
      g.dataset.in = "1"; g.classList.remove("nm-hit");
      g.style.transition = "transform .45s cubic-bezier(.3,1.4,.5,1)"; g.style.transform = `translate(${sx - it.x}px, ${sy - it.y}px)`;
      k++; ctx.fx.sound.pop(); countSay(ctx, k);
      if (k === 10) { off(); await sleep(ctx, 500); resolve(); }
    });
  });
  ctx.fx.sound.good(); ctx.fx.cheer(null);
  const rest = items.length - 10;
  if (ask.rest) {
    await ctx.guide.say(say.rest || "10개를 묶었어요! 묶음 밖에 남은 것은 몇 개일까요?");
    // 틀리면 남은 것에 번호를 붙여 같이 센다
    const numberRest = async () => { if (marks.childElementCount) return; let n = 0; for (const g of svg.querySelectorAll(".nm-item:not([data-in])")) { n++; const it = items[Number(g.dataset.i)]; badge(marks, it.x + size * 0.38, it.y - size * 0.42, n, "#f08a1c"); countSay(ctx, n); await sleep(ctx, 650); } };
    await pad(ctx, rest, { min: 1, max: 10, after: unit, onWrong: async () => { ctx.guide.encourage("묶음 밖에 남은 것을 같이 세어 봐요."); await sleep(ctx, 1200); await numberRest(); } });
  }
  if (ask.total) {
    await ctx.guide.say(say.total || "10개 묶음과 남은 것을 합하면 모두 몇 개일까요?");
    await pad(ctx, items.length, {
      min: 1, max: 20, after: unit, onWrong: async (_, w) => {
        if (w < 2) { ctx.guide.encourage("열에서부터 이어서 세어 봐요. 열, 열하나, 열둘…"); return; }
        // 같이 세기: 10 다음부터 남은 것을 하나씩 짚는다
        let c = 10; for (const g of svg.querySelectorAll(".nm-item:not([data-in])")) { c++; g.classList.add("nm-glow"); countSay(ctx, c); await sleep(ctx, 700); g.classList.remove("nm-glow"); }
      }
    });
  }
  return svg;
}

// ── 빈칸에 알맞은 수(원본 58·59·68·70쪽) ─────────────────────────────────
//  cells: [{x, y, n|null, v}] v=그 자리의 수(빈칸이면 정답). kind: 그 칸 그림(apple·tree·lily·flower·star)
//  빈칸은 읽는 차례(cells 순서)대로 하나씩 반짝이고, 아래 숫자판에서 고른다.
export async function seqFill(ctx, { cells, vb, kind = "apple", size = 76, reverse = false, font = 34, label = "", tone = kind === "apple" ? "line" : undefined }) {
  const svg = scene(ctx, vb, `${label}<g class="nm-path"></g>${cells.map((c, i) => `<g class="nm-cell" data-i="${i}">${icon(kind, c.x, c.y, size, tone)}<text class="v" x="${c.x}" y="${c.y + font * 0.36 + (kind === "tree" ? -2 : kind === "apple" ? 4 : 0)}" text-anchor="middle" font-size="${font}" font-weight="900" fill="#25324a">${c.n ?? ""}</text></g>`).join("")}`);
  const blanks = cells.map((c, i) => ({ ...c, i })).filter((c) => c.n == null);
  for (const b of blanks) {
    const g = svg.querySelector(`.nm-cell[data-i="${b.i}"]`); g.classList.add("nm-now");
    g.insertAdjacentHTML("afterbegin", `<circle class="nm-nowring" cx="${b.x}" cy="${b.y}" r="${size * 0.6}" fill="#fff7c2" stroke="#e8417f" stroke-width="5" stroke-dasharray="10 6"/>`);
    const prev = cells[b.i - 1];
    await pad(ctx, b.v, {
      min: 1, max: 20, onWrong: async (_, w) => {
        if (prev) { const pg = svg.querySelector(`.nm-cell[data-i="${b.i - 1}"]`); pg.classList.add("nm-glow"); setTimeout(() => pg.classList.remove("nm-glow"), 1600); }
        ctx.guide.encourage(w < 2 ? "앞의 수를 보고 생각해요." : reverse ? "거꾸로 갈 때는 하나씩 작아져요." : "순서대로 갈 때는 하나씩 커져요.");
      }
    });
    g.querySelector("text.v").textContent = b.v; g.classList.remove("nm-now"); g.classList.add("nm-done"); g.querySelector(".nm-nowring")?.remove();
    ctx.fx.burstAt(g, { power: 0.5 });
    await sleep(ctx, 250);
  }
  ctx.dock.innerHTML = "";
  return svg;
}

// ── 수를 따라 길 그리기(원본 61·69·71쪽) ─────────────────────────────────
//  grid: 줄마다 수 배열. hex=true면 벌집(홀수 줄이 반 칸 오른쪽). seq: 지나갈 수 차례(예 [11..20]).
//  start/end: [r,c]. who/goal: 출발·도착 그림(SVG 글). 옆 칸(가로·세로, 벌집은 6방향)으로만 갈 수 있다.
export async function numPath(ctx, { grid, seq, start, end, hex = false, cell = 78, who = "", goal = "", say = {} }) {
  const R = grid.length, C = grid[0].length;
  const hx = (r, c) => hex ? 70 + c * cell + (r % 2 ? cell / 2 : 0) + cell / 2 : 80 + c * cell + cell / 2;
  const hy = (r) => hex ? 50 + r * cell * 0.87 + cell / 2 : 50 + r * cell + cell / 2;
  const W = (hex ? 70 + C * cell + cell / 2 + 90 : 80 + C * cell + 90), H = (hex ? 50 + (R - 1) * cell * 0.87 + cell + 50 : 50 + R * cell + 50);
  const hexPts = (x, y) => Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 6 + i * Math.PI / 3; return `${(x + Math.cos(a) * cell * 0.56).toFixed(1)},${(y + Math.sin(a) * cell * 0.56).toFixed(1)}`; }).join(" ");
  const cells = grid.flatMap((row, r) => row.map((n, c) => `<g class="nm-hit nm-pc" data-r="${r}" data-c="${c}">${hex
    ? `<polygon points="${hexPts(hx(r, c), hy(r))}" fill="#fff8d6" stroke="#f0c419" stroke-width="5"/>`
    : `<rect x="${hx(r, c) - cell / 2}" y="${hy(r) - cell / 2}" width="${cell}" height="${cell}" fill="#fff" stroke="#c9b3e6" stroke-width="3"/>`}</g>`).join("")).join("");
  const labels = grid.flatMap((row, r) => row.map((n, c) => `<text x="${hx(r, c)}" y="${hy(r) + 12}" text-anchor="middle" font-size="32" font-weight="800" fill="#25324a" stroke="#fff" stroke-width="5" paint-order="stroke">${n}</text>`).join("")).join("");
  const [sr, sc] = start, [er, ec] = end;
  const svg = scene(ctx, `0 0 ${W} ${H}`, `${cells}<polyline class="nm-line" fill="none" stroke="#e8417f" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" opacity=".75" points=""/><g style="pointer-events:none">${labels}</g>
    <g transform="translate(${hx(sr, sc) - cell * 0.95} ${hy(sr)})">${who}</g><g transform="translate(${hx(er, ec) + cell * 0.95} ${hy(er)})">${goal}</g>
    <path d="M${hx(sr, sc) - cell * 0.78} ${hy(sr)} h${cell * 0.2}" stroke="#f05a45" stroke-width="5" marker-end=""/><g class="nm-marks"></g>`);
  const line = svg.querySelector(".nm-line");
  const near = (a, b) => {
    const dr = b[0] - a[0], dc = b[1] - a[1];
    if (!hex) return Math.abs(dr) + Math.abs(dc) === 1;
    if (dr === 0) return Math.abs(dc) === 1;
    if (Math.abs(dr) !== 1) return false;
    return a[0] % 2 ? (dc === 0 || dc === 1) : (dc === 0 || dc === -1);
  };
  const path = [[sr, sc]]; const pts = () => path.map(([r, c]) => `${hx(r, c)},${hy(r)}`).join(" ");
  const mark = (r, c) => svg.querySelector(`.nm-pc[data-r="${r}"][data-c="${c}"]`).classList.add("nm-on");
  mark(sr, sc); line.setAttribute("points", pts());
  ctx.dock.innerHTML = "";
  ctx.guide.say(say.start || "출발 칸에서 시작해요. 다음 수가 쓰인 옆 칸을 차례로 눌러요!");
  let wrong = 0;
  await new Promise((resolve) => {
    const off = onHit(svg, ".nm-pc", async (g) => {
      const r = Number(g.dataset.r), c = Number(g.dataset.c), k = path.length;
      if (path.some(([a, b]) => a === r && b === c)) return;
      const want = seq[k], cur = path[k - 1];
      if (grid[r][c] === want && near(cur, [r, c])) {
        path.push([r, c]); mark(r, c); line.setAttribute("points", pts()); ctx.fx.sound.pop(); wrong = 0;
        if (k + 1 === seq.length) { off(); resolve(); }
        return;
      }
      ctx.mistake(); ctx.fx.sound.bad(); shakeEl(g); wrong++;
      if (grid[r][c] === want) ctx.guide.encourage("바로 옆에 붙어 있는 칸으로만 갈 수 있어요.");
      else ctx.guide.encourage(wrong >= 2 ? "지금 칸 옆에서 다음 수를 찾아요. 반짝이는 칸을 봐요." : "그 수가 아니에요. 다음 수를 찾아요.");
      if (wrong >= 2) {
        // 힌트: 다음으로 갈 수 있는 칸을 반짝
        for (let rr = 0; rr < R; rr++) for (let cc = 0; cc < C; cc++) if (grid[rr][cc] === want && near(cur, [rr, cc])) { const t = svg.querySelector(`.nm-pc[data-r="${rr}"][data-c="${cc}"]`); t.classList.add("nm-glow"); setTimeout(() => t.classList.remove("nm-glow"), 1800); }
      }
    });
  });
  const gl = svg.querySelector(`g[transform^="translate(${hx(er, ec) + cell * 0.95}"]`); if (gl) ctx.fx.burstAt(gl, { power: 1 });
  ctx.fx.cheer(null, { big: true });
  return svg;
}

// ── 개수만큼 색칠하기(원본 66·81·94쪽) ───────────────────────────────────
//  slots: [{x,y}] 칠할 자리, n: 칠해야 할 수, pre: 처음부터 칠해진 자리 수. 누르면 칠하고 다시 누르면 지운다. 「다 칠했어요」로 확인.
export async function colorN(ctx, { svg, slots, n, kind = "circle", size = 46, color = "#ffd84a", host = ctx.dock, say = null }) {
  const g = svgEl("g", { class: "nm-slots" }); svg.append(g);
  const draw = (s, on) => kind === "circle" ? `<circle cx="${s.x}" cy="${s.y}" r="${size / 2}" fill="${on ? color : "#fff"}" stroke="${on ? "rgba(0,0,0,.25)" : "#9aa6b8"}" stroke-width="3"/>`
    : kind === "box" ? `<rect x="${s.x - size / 2}" y="${s.y - size / 2}" width="${size}" height="${size}" rx="6" fill="${on ? color : "#fff"}" stroke="#9aa6b8" stroke-width="3"/>`
      : on ? icon(kind, s.x, s.y, size) : `<g style="filter:grayscale(1) brightness(1.75);opacity:.55">${icon(kind, s.x, s.y, size)}</g><circle cx="${s.x}" cy="${s.y}" r="${size * 0.46}" fill="none" stroke="#b6c0cf" stroke-width="2.5" stroke-dasharray="5 4"/>`;
  slots.forEach((s, i) => { const el = svgEl("g", { class: "nm-hit nm-slot", "data-i": i }); el.innerHTML = draw(s, false); el.dataset.on = ""; g.append(el); });
  if (say) ctx.guide.say(say);
  host.innerHTML = `<div class="nm-padwrap"><div class="nm-ask"><span class="nm-count">0</span>개 칠했어요</div><button class="sm-btn go big" type="button" data-ok><span class="ico">✔</span> 다 칠했어요</button></div>`;
  const cnt = host.querySelector(".nm-count");
  // 같은 그림에서 색칠을 여러 번 하므로(81·94쪽) 이번 칸 묶음(g) 안에서만 센다
  const off = onHit(g, ".nm-slot", (el) => { const on = !el.dataset.on; el.dataset.on = on ? "1" : ""; el.innerHTML = draw(slots[Number(el.dataset.i)], on); ctx.fx.sound[on ? "pop" : "tap"](); cnt.textContent = g.querySelectorAll('.nm-slot[data-on="1"]').length; });
  await new Promise((resolve) => {
    host.querySelector("[data-ok]").addEventListener("click", function check() {
      const k = g.querySelectorAll('.nm-slot[data-on="1"]').length;
      if (k === n) { off(); g.querySelectorAll(".nm-slot").forEach((x) => x.classList.remove("nm-hit", "nm-slot")); ctx.fx.cheer(host.querySelector("[data-ok]")); resolve(); return; }
      ctx.mistake(); ctx.fx.sound.bad();
      ctx.guide.encourage(k < n ? "조금 더 칠해야 해요. 다시 세어 봐요." : "너무 많이 칠했어요. 하나를 다시 누르면 지워져요.");
    });
  });
  host.innerHTML = "";
}

// ── 선으로 잇기(원본 67·88·95쪽) ─────────────────────────────────────────
//  left/right: [{id, x, y, html}] (html = SVG 그림), dotL/dotR: 점 위치는 x±dx. pairs: { leftId: rightId }
//  왼쪽을 누르고 오른쪽을 누르면 선이 그어진다. 틀리면 선이 흔들리다 사라진다.
export async function matchLines(ctx, { vb, left, right, pairs, dx = 70, back = "", say = "같은 것끼리 선으로 이어요. 왼쪽을 누르고 오른쪽을 눌러요!", wrongSay = "다시 세어 볼까요?" }) {
  const svg = scene(ctx, vb, `${back}<g class="nm-lines"></g>${left.map((l) => `<g class="nm-hit nm-L" data-id="${l.id}">${l.html}<circle cx="${l.x + dx}" cy="${l.y}" r="11" fill="#25324a"/></g>`).join("")}${right.map((r) => `<g class="nm-hit nm-R" data-id="${r.id}">${r.html}<circle cx="${r.x - dx}" cy="${r.y}" r="11" fill="#25324a"/></g>`).join("")}`);
  const lines = svg.querySelector(".nm-lines"); const done = new Set(); let pick = null;
  ctx.guide.say(say);
  await new Promise((resolve) => {
    const off = onHit(svg, ".nm-L, .nm-R", async (g) => {
      const isL = g.classList.contains("nm-L"), id = g.dataset.id;
      if (isL) { if (done.has(id)) return; svg.querySelectorAll(".nm-L").forEach((x) => x.classList.remove("nm-sel")); g.classList.add("nm-sel"); pick = id; ctx.fx.sound.tap(); return; }
      if (!pick) { ctx.guide.encourage("왼쪽부터 먼저 눌러요."); return; }
      if ([...done].some((l) => pairs[l] === id)) return;
      const L = left.find((x) => x.id === pick), Rr = right.find((x) => x.id === id);
      const ln = svgEl("line", { x1: L.x + dx, y1: L.y, x2: Rr.x - dx, y2: Rr.y, stroke: "#e8417f", "stroke-width": 7, "stroke-linecap": "round" });
      lines.append(ln);
      if (pairs[pick] === id) {
        done.add(pick); svg.querySelector(`.nm-L[data-id="${pick}"]`).classList.replace("nm-sel", "nm-ok"); g.classList.add("nm-ok"); pick = null;
        ctx.fx.sound.pop(); ctx.fx.burstAt(g, { power: 0.6 });
        if (done.size === left.length) { off(); resolve(); }
      } else {
        ctx.mistake(); ctx.fx.sound.bad(); ln.setAttribute("stroke", "#9aa6b8"); ln.classList.add("nm-no"); ctx.guide.encourage(wrongSay);
        await sleep(ctx, 700); ln.remove();
      }
    });
  });
  ctx.fx.cheer(null, { big: true });
  return svg;
}

// ── 패턴블록(원본 62·63·72쪽) ─────────────────────────────────────────────
//  세모 격자: 한 변 = u px. 블록 모양은 꼭짓점 목록으로 만든다.
export const PB = {
  tri: { name: "세모", color: "#3ea65b", ask: "초록색 세모를 하나씩 눌러서 세어 봐요!", total: "초록색 세모는 모두 몇 개예요?" },
  trap: { name: "사다리꼴", color: "#f2475a", ask: "빨간색 블록을 하나씩 눌러서 세어 봐요!", total: "빨간색 블록은 모두 몇 개예요?" },
  hex: { name: "육각형", color: "#ffd23f", ask: "노란색 블록을 하나씩 눌러서 세어 봐요!", total: "노란색 블록은 모두 몇 개예요?" },
  rho: { name: "마름모", color: "#2a6fc4", ask: "파란색 블록을 하나씩 눌러서 세어 봐요!", total: "파란색 블록은 모두 몇 개예요?" }
};
export const pbIcon = (type, size = 56) => {
  const P = { tri: "0,-40 46,40 -46,40", trap: "-24,-30 24,-30 50,30 -50,30", hex: "-24,-42 24,-42 48,0 24,42 -24,42 -48,0", rho: "0,-30 52,0 0,30 -52,0" }[type];
  return `<svg width="${size}" height="${size}" viewBox="-54 -54 108 108" aria-hidden="true"><polygon points="${P}" fill="${PB[type].color}" stroke="rgba(0,0,0,.25)" stroke-width="3" stroke-linejoin="round"/></svg>`;
};
//  pieces: [{type, pts:[[x,y]…]}] (화면 좌표). ask: 셀 블록 종류 차례. answers: {type: 개수}
//  블록을 하나씩 누르면 번호가 붙고, 다 세면 숫자판으로 개수를 쓴다.
export async function blockCount(ctx, { vb, pieces, ask }) {
  const svg = scene(ctx, vb, `<g class="nm-pb">${pieces.map((p, i) => `<polygon class="nm-hit nm-piece" data-i="${i}" data-t="${p.type}" points="${p.pts.map((q) => q.join(",")).join(" ")}" fill="${PB[p.type].color}" stroke="#1f2a3a" stroke-opacity=".55" stroke-width="2.5" stroke-linejoin="round"/>`).join("")}</g><g class="nm-marks"></g>`);
  const marks = svg.querySelector(".nm-marks");
  const cen = (p) => [p.pts.reduce((a, q) => a + q[0], 0) / p.pts.length, p.pts.reduce((a, q) => a + q[1], 0) / p.pts.length];
  for (const type of ask) {
    const total = pieces.filter((p) => p.type === type).length;
    marks.innerHTML = "";
    svg.querySelectorAll(".nm-piece").forEach((el) => el.classList.toggle("nm-dim", el.dataset.t !== type));
    ctx.dock.innerHTML = `<div class="nm-padwrap"><div class="nm-ask">${pbIcon(type, 64)}<span class="nm-count">0</span>개</div></div>`;
    ctx.guide.say(PB[type].ask);
    let k = 0; const seen = new Set();
    await new Promise((resolve) => {
      const off = onHit(svg, ".nm-piece", (el) => {
        const i = Number(el.dataset.i);
        if (el.dataset.t !== type) { ctx.fx.sound.bad(); shakeEl(el); ctx.guide.encourage("그 블록은 아니에요. 같은 색 블록만 세어요."); return; }
        if (seen.has(i)) { ctx.guide.encourage("그건 벌써 세었어요."); return; }
        seen.add(i); k++; const [x, y] = cen(pieces[i]); badge(marks, x, y, k, "#25324a"); el.classList.add("nm-counted");
        ctx.fx.sound.pop(); countSay(ctx, k); ctx.dock.querySelector(".nm-count").textContent = k;
        if (k === total) { off(); resolve(); }
      });
    });
    await sleep(ctx, 600);
    await ctx.guide.say(PB[type].total);
    await pad(ctx, total, { min: 1, max: 20, before: pbIcon(type, 56), after: "개" });
    ctx.fx.cheer(null);
  }
  svg.querySelectorAll(".nm-piece").forEach((el) => el.classList.remove("nm-dim"));
  ctx.dock.innerHTML = "";
  return svg;
}
// 세모 격자 도우미: 위쪽이 뾰족한 세모의 왼쪽 아래 꼭짓점 (x,y), 한 변 u
export const tri = {
  up: (x, y, u) => [[x, y], [x + u, y], [x + u / 2, y - u * 0.866]],
  down: (x, y, u) => [[x, y], [x + u, y], [x + u / 2, y + u * 0.866]]
};

// ── 화살판(원본 85~87·92·93쪽) ───────────────────────────────────────────
//  4칸: 왼쪽 위 「1 큰 수」, 오른쪽 위 「1 작은 수」, 왼쪽 아래 「2 작은 수」, 오른쪽 아래 「2 큰 수」 (원본 그림 그대로). ang: 화살 각도(위 0°, 시계 방향)
export const SPIN = [
  { key: "1big", label: "1 큰 수", d: +1, ang: -45 },
  { key: "1small", label: "1 작은 수", d: -1, ang: 45 },
  { key: "2big", label: "2 큰 수", d: +2, ang: 135 },
  { key: "2small", label: "2 작은 수", d: -2, ang: 225 }
];
export function spinnerSvg(cx, cy, r) {
  const q = [["1 큰 수", "#fff3a8", -1, -1], ["1 작은 수", "#ffad4d", 1, -1], ["2 작은 수", "#ffad4d", -1, 1], ["2 큰 수", "#fff3a8", 1, 1]];
  const arc = (sx, sy) => { const a0 = Math.atan2(sy, 0) , x1 = cx + sx * r, y1 = cy, x2 = cx, y2 = cy + sy * r; return `M${cx} ${cy} L${x1} ${y1} A${r} ${r} 0 0 ${sx * sy > 0 ? 1 : 0} ${x2} ${y2}Z`; };
  return `<g class="nm-spinner"><circle cx="${cx}" cy="${cy}" r="${r + 10}" fill="#c98a3a"/>${q.map(([t, f, sx, sy]) => `<path d="${arc(sx, sy)}" fill="${f}" stroke="#c98a3a" stroke-width="3"/><text x="${cx + sx * r * 0.48}" y="${cy + sy * r * 0.42 + 9}" text-anchor="middle" font-size="${r * 0.17}" font-weight="800" fill="#4a3a20">${t}</text>`).join("")}
    <g class="nm-arrow" style="transform-origin:${cx}px ${cy}px"><path d="M${cx} ${cy + r * 0.12} L${cx} ${cy - r * 0.8}" stroke="#25324a" stroke-width="7" stroke-linecap="round"/><path d="M${cx - 14} ${cy - r * 0.68} L${cx} ${cy - r * 0.86} L${cx + 14} ${cy - r * 0.68}" fill="none" stroke="#25324a" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g><circle cx="${cx}" cy="${cy}" r="10" fill="#e8417f"/></g>`;
}
// 화살을 돌려 key 칸에 세운다(멈출 칸을 미리 정함). 화살 각도는 위쪽이 0°, 시계 방향.
export async function spinTo(ctx, svg, key, { turns = 3 } = {}) {
  const arrow = svg.querySelector(".nm-arrow"); const s = SPIN.find((x) => x.key === key);
  const jitter = (Math.random() - 0.5) * 50; const deg = turns * 360 + s.ang + jitter;
  arrow.style.transition = "none"; arrow.style.transform = "rotate(0deg)"; void arrow.getBoundingClientRect();
  arrow.style.transition = `transform ${ctx.fx.reduced() ? 0.2 : 2.2}s cubic-bezier(.15,.7,.2,1)`; arrow.style.transform = `rotate(${deg}deg)`;
  ctx.fx.sound.tap();
  await sleep(ctx, ctx.fx.reduced() ? 250 : 2300);
  return s;
}
export const pointArrow = (svg, key) => { const a = svg.querySelector(".nm-arrow"); const s = SPIN.find((x) => x.key === key); a.style.transition = "none"; a.style.transform = `rotate(${s.ang + 12}deg)`; };

// 1~20 수 띠(원본 85~87·92·93쪽 위의 표). mark: 반짝일 수들
export function numStrip(x, y, w, { mark = [], cls = "" } = {}) {
  const c = w / 10, h = c * 0.8;
  return `<g class="nm-strip ${cls}">${Array.from({ length: 20 }, (_, i) => { const n = i + 1, cx = x + (i % 10) * c, cy = y + Math.floor(i / 10) * h; return `<g data-n="${n}"><rect x="${cx}" y="${cy}" width="${c}" height="${h}" fill="${mark.includes(n) ? "#ffe066" : "#eaf6ff"}" stroke="#7fc0ea" stroke-width="2"/><text x="${cx + c / 2}" y="${cy + h / 2 + 8}" text-anchor="middle" font-size="${Math.min(24, c * 0.42)}" font-weight="700" fill="#25324a">${n}</text></g>`; }).join("")}</g>`;
}
export function stripMark(svg, nums, color = "#ffe066") {
  svg.querySelectorAll(".nm-strip [data-n] rect").forEach((r) => r.setAttribute("fill", "#eaf6ff"));
  for (const n of nums) svg.querySelector(`.nm-strip [data-n="${n}"] rect`)?.setAttribute("fill", color);
}
// 수 띠 위에서 한 칸씩 뛰어 보여 주기(1·2 크고 작은 수 힌트)
export async function stripHop(ctx, svg, from, d) {
  stripMark(svg, [from], "#9fd6ff"); await sleep(ctx, 500);
  for (let k = 1; k <= Math.abs(d); k++) { stripMark(svg, [from, from + Math.sign(d) * k], "#ffe066"); ctx.fx.sound.pop(); await sleep(ctx, 600); }
}

// ── 그림 속 숫자 찾기(원본 54·55·64쪽) ───────────────────────────────────
//  svg 안의 .nm-find 요소(data-k 이름)를 모두 누르면 끝. found(k) 돌려 부름.
export async function findAll(ctx, svg, { total, host = ctx.dock, noun = "숫자", onFound = null }) {
  host.innerHTML = `<div class="nm-padwrap"><div class="nm-ask">찾은 ${esc(noun)} <span class="nm-count">0</span> / ${total}</div></div>`;
  let k = 0;
  await new Promise((resolve) => {
    const off = onHit(svg, ".nm-find", async (el) => {
      if (el.classList.contains("nm-found")) return;
      el.classList.add("nm-found"); k++; host.querySelector(".nm-count").textContent = k;
      ctx.fx.sound.pop(); ctx.fx.burstAt(el, { power: 0.6 });
      if (onFound) await onFound(el.dataset.k, k);
      if (k === total) { off(); resolve(); }
    });
  });
  ctx.fx.cheer(null, { big: true });
}

// 두 수 중 고르기 단추 그림(풍선·별 등)
export const pickArt = (kind, n, c, size = 96) => `<svg width="${size}" height="${size * 1.1}" viewBox="-50 -50 100 110" aria-hidden="true">${icon(kind, 0, kind === "balloon" ? -8 : 0, 96, c)}<text x="0" y="${kind === "balloon" ? 4 : 12}" text-anchor="middle" font-size="34" font-weight="900" fill="#25324a">${n}</text></svg>`;

// 주머니(원본 56·57쪽) — 가운데 (cx, cy), 몸통 너비 w. 묶은 끈과 주름.
export function bagSvg(cx, cy, w, color = "#e8604f", { fill = "rgba(255,255,255,.75)", cls = "" } = {}) {
  const h = w * 0.7, top = cy - h / 2 + w * 0.04;
  return `<g class="nm-bag ${cls}"><path d="M${cx - w * 0.2} ${top + 4} C${cx - w * 0.3} ${top - w * 0.1} ${cx - w * 0.08} ${top - w * 0.14} ${cx} ${top - w * 0.09} C${cx + w * 0.1} ${top - w * 0.15} ${cx + w * 0.32} ${top - w * 0.1} ${cx + w * 0.2} ${top + 4}Z" fill="${fill}" stroke="${color}" stroke-width="3"/>
    <path d="M${cx - w * 0.2} ${top + 2} C${cx - w * 0.62} ${top + h * 0.08} ${cx - w * 0.6} ${cy + h * 0.5} ${cx} ${cy + h * 0.5} C${cx + w * 0.6} ${cy + h * 0.5} ${cx + w * 0.62} ${top + h * 0.08} ${cx + w * 0.2} ${top + 2}Z" fill="${fill}" stroke="${color}" stroke-width="3"/>
    <path d="M${cx - w * 0.22} ${top + 2} Q${cx} ${top + 12} ${cx + w * 0.22} ${top + 2}" fill="none" stroke="${color}" stroke-width="4"/><path d="M${cx} ${top + 6} l-${w * 0.08} -${w * 0.05} l0 ${w * 0.1}z M${cx} ${top + 6} l${w * 0.08} -${w * 0.05} l0 ${w * 0.1}z" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round"/></g>`;
}
// 주머니 안 큐브 배치: 5개씩 줄, 가운데 정렬. 반환 [{x,y,c}]
export function bagCubes(n, cx, cy, { gap = 62, per = 5, colors = null, seed = 1 } = {}) {
  const pal = colors || ["brown", "yellow", "green", "red", "blue", "green", "pink", "orange", "yellow", "brown", "red", "brown", "yellow", "orange", "pink", "green", "pink", "orange", "yellow", "brown"];
  const rows = Math.ceil(n / per), out = [];
  for (let i = 0; i < n; i++) { const r = Math.floor(i / per), c = i % per; out.push({ kind: "cube", c: pal[(i + seed) % pal.length], x: cx + (c - (per - 1) / 2) * gap, y: cy + (r - (rows - 1) / 2) * gap }); }
  return out;
}

const T_ = (x, y, t, { size = 26, fill = "#25324a", weight = 800 } = {}) => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="middle">${t}</text>`;
// ── 82·83쪽 큰 수 찾기: 파란 큐브와 빨간 큐브 짝짓기 ──
//  manual: 파란 큐브를 누르고 빨간 큐브를 누르면 선으로 이어진다. 아니면 「짝짓기」 단추로 하나씩 이어 보인다.
export async function pairUp(ctx, blue, red, { manual = false, label = "", colors = ["blue", "red"], stars = ["#d6f5c4", "#fff3a8"], numBox = false } = {}) {
  const W = 900, s = Math.min(54, 760 / Math.max(blue, red)), gap = s * 1.12, x0 = 150;
  const bx = (i) => x0 + i * gap, by = 110, ry = 290;
  const svg = scene(ctx, `0 0 ${W} 400`, `${label}<g class="nm-lines"></g>
    <g>${icon("star", 70, by, 82, stars[0])}${T_(70, by + 12, blue, { size: 32, weight: 900 })}</g><g>${icon("star", 70, ry, 82, stars[1])}${T_(70, ry + 12, red, { size: 32, weight: 900 })}</g>
    ${Array.from({ length: blue }, (_, i) => `<g class="nm-hit nm-bc" data-i="${i}">${cube(bx(i), by, s, colors[0])}</g>`).join("")}
    ${Array.from({ length: red }, (_, i) => `<g class="nm-hit nm-rc" data-i="${i}">${cube(bx(i), ry, s, colors[1])}</g>`).join("")}`);
  const lines = svg.querySelector(".nm-lines"), pairs = Math.min(blue, red);
  const link = (i, j) => { lines.insertAdjacentHTML("beforeend", `<line x1="${bx(i)}" y1="${by + s * 0.5}" x2="${bx(j)}" y2="${ry - s * 0.4}" stroke="#e8417f" stroke-width="4"/>`); };
  if (manual) {
    ctx.dock.innerHTML = `<p class="sm-docknote">👉 위 큐브 하나, 아래 큐브 하나를 차례로 눌러 짝지어요</p>`;
    ctx.guide.say(colors[0] === "blue" ? "파란 큐브를 하나 누르고, 빨간 큐브를 하나 눌러서 짝지어 봐요!" : "위의 큐브를 하나 누르고, 아래 큐브를 하나 눌러서 짝지어 봐요!");
    const usedB = new Set(), usedR = new Set(); let selB = null;
    await new Promise((r) => {
      const off = onHit(svg, ".nm-bc, .nm-rc", (el) => {
        const i = Number(el.dataset.i), isB = el.classList.contains("nm-bc");
        if (isB) { if (usedB.has(i)) return; svg.querySelectorAll(".nm-bc").forEach((x) => x.classList.remove("nm-sel")); el.classList.add("nm-sel"); selB = i; ctx.fx.sound.tap(); return; }
        if (usedR.has(i)) return;
        if (selB === null) { ctx.guide.encourage("먼저 위의 큐브를 눌러요."); return; }
        link(selB, i); usedB.add(selB); usedR.add(i); svg.querySelector(`.nm-bc[data-i="${selB}"]`).classList.replace("nm-sel", "nm-ok"); el.classList.add("nm-ok"); selB = null; ctx.fx.sound.pop();
        if (usedB.size === pairs) { off(); r(); }
      });
    });
  } else {
    await ctx.next("하나씩 짝지어 보기", { icon: "🔗" });
    ctx.dock.innerHTML = "";
    for (let i = 0; i < pairs; i++) { link(i, i); svg.querySelector(`.nm-bc[data-i="${i}"]`).classList.add("nm-ok"); svg.querySelector(`.nm-rc[data-i="${i}"]`).classList.add("nm-ok"); ctx.fx.sound.tap(); await ctx.wait(blue + red > 24 ? 160 : 260); }
  }
  // 남은 큐브 반짝
  const left = blue > red ? ".nm-bc" : ".nm-rc";
  svg.querySelectorAll(`${left}:not(.nm-ok)`).forEach((el) => el.classList.add("nm-glow"));
  await ctx.guide.say(colors[0] !== "blue" ? (blue > red ? "위의 큐브가 남았어요! 위의 큐브가 더 많아요." : "아래 큐브가 남았어요! 아래 큐브가 더 많아요.") : blue > red ? "파란 큐브가 남았어요! 파란 큐브가 더 많아요." : "빨간 큐브가 남았어요! 빨간 큐브가 더 많아요.");
  ctx.guide.say("더 큰 수를 눌러요.");
  const big = Math.max(blue, red);
  await ctx.choose([{ value: String(blue), art: pickArt("star", blue, stars[0]), name: "" }, { value: String(red), art: pickArt("star", red, stars[1]), name: "" }], { correct: String(big), wrongSay: "짝이 없이 남은 큐브가 있는 쪽이 더 많아요.", praise: "맞아요! 더 큰 수를 찾았어요." });
  ctx.fx.stamp("○");
}

// ── 수 카드 → 화살판 → □ (원본 86·87·92·93쪽) ──
// 카드 → 화살판 → □ 한 줄 그림(원본 87·92·93쪽)
export const cardSpin = (card, { strip = true } = {}) => `${strip ? numStrip(50, 14, 800) : ""}
  ${numCard(150, strip ? 290 : 170, card, { w: 90, h: 110, font: 50, stroke: "#f0c419" })}${spinnerSvg(450, strip ? 290 : 170, 120)}
  <path d="M600 ${strip ? 290 : 170} h60" stroke="#8f63e6" stroke-width="8" marker-end="url(#ar)"/><path d="M655 ${(strip ? 290 : 170) - 14} l18 14 l-18 14z" fill="#8f63e6"/>
  <rect class="ansbox" x="700" y="${(strip ? 290 : 170) - 50}" width="100" height="100" rx="12" fill="#fff" stroke="#25324a" stroke-width="4"/><text class="anstxt" x="750" y="${(strip ? 290 : 170) + 18}" text-anchor="middle" font-size="52" font-weight="900" fill="#e8417f"></text>`;
const SPIN_WORD = { "1big": "1 큰 수", "1small": "1 작은 수", "2big": "2 큰 수", "2small": "2 작은 수" };
const SPIN_SAY = {
  "1big": "1 큰 수는 수 띠에서 오른쪽으로 한 칸 간 수예요.",
  "1small": "1 작은 수는 수 띠에서 왼쪽으로 한 칸 간 수예요.",
  "2big": "2 큰 수는 수 띠에서 오른쪽으로 두 칸 간 수예요.",
  "2small": "2 작은 수는 수 띠에서 왼쪽으로 두 칸 간 수예요."
};
// 카드와 화살판 칸이 주어진 문제 하나: 숫자판으로 답, 틀리면 수 띠에서 뛰어 보기
export async function solveSpin(ctx, svg, card, key) {
  const s = SPIN.find((x) => x.key === key), ans = card + s.d;
  stripMark(svg, [card], "#9fd6ff");
  await ctx.guide.say(SPIN_SAY[key]);
  await pad(ctx, ans, { min: 1, max: 20, onWrong: async (_, w) => { ctx.guide.encourage(w < 2 ? "수 띠에서 수 카드의 수를 찾아 세어 봐요." : "같이 뛰어 볼까요?"); if (w >= 2) await stripHop(ctx, svg, card, s.d); } });
  svg.querySelector(".anstxt").textContent = ans; stripMark(svg, [card, ans], "#ffe066");
  ctx.fx.burstAt(svg.querySelector(".ansbox"), { power: 0.7 });
}

