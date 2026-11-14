// 4단원 매트릭스 그림 — 원본 78·79·86~97쪽의 사탕·바다 친구·동물을 코드로 다시 그린다(원본 삽화는 쓰지 않음).
//  모든 그림은 색 하나(c)를 받아 칠한다. 회색(GRAY)이면 원본처럼 줄 머리의 「모양만 있는」 그림이 된다.
//  matrixBoard: 위(가로 →)에는 색연필 자국, 왼쪽(세로 ↓)에는 회색 모양, 가운데 칸에 그 둘을 합친 그림.
export const GRAY = "#b9b9bd";
export const PAL = {
  red: { name: "빨간색", fill: "#ef4646" },
  blue: { name: "파란색", fill: "#2f6fd6" },
  yellow: { name: "노란색", fill: "#ffd23a" },
  green: { name: "초록색", fill: "#3aa55a" },
  pink: { name: "분홍색", fill: "#ff6f8e" }
};
const fillOf = (c) => PAL[c]?.fill || c;
const L = "#3a3a3a";
let uid = 0;

// ── 사탕(줄무늬 알사탕) ──
const SHAPE = {
  round: `<circle cx="50" cy="50" r="34"/>`,
  heart: `<path d="M50 86 C22 66 10 48 14 32 C18 15 42 11 50 31 C58 11 82 15 86 32 C90 48 78 66 50 86Z"/>`,
  oval: `<ellipse cx="50" cy="52" rx="40" ry="27"/>`,
  star: `<path d="M50 8 L61 37 L92 38 L67 57 L76 88 L50 70 L24 88 L33 57 L8 38 L39 37Z"/>`
};
export const SHAPE_NAME = { round: "동그라미", heart: "하트", oval: "타원", star: "별" };
export function candy(shape, c, { size = null } = {}) {
  const f = fillOf(c), id = `cd${++uid}`, s = size ? `width="${size}" height="${size}"` : "";
  return `<svg viewBox="0 0 100 100" ${s} aria-hidden="true"><defs><clipPath id="${id}">${SHAPE[shape]}</clipPath>
    <radialGradient id="${id}g" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></radialGradient></defs>
    <g fill="${f}" stroke="${L}" stroke-width="2.5" stroke-linejoin="round">${SHAPE[shape]}</g>
    <g clip-path="url(#${id})" stroke="#fff" stroke-width="4.5" fill="none" opacity=".9">
      <path d="M28 4 Q14 50 28 96"/><path d="M42 2 Q34 50 42 98"/><path d="M58 2 Q66 50 58 98"/><path d="M72 4 Q86 50 72 96"/></g>
    <g clip-path="url(#${id})"><rect width="100" height="100" fill="url(#${id}g)"/></g></svg>`;
}
// 78·79쪽 알사탕(동그란 줄무늬) — 맛 색깔
export const FLAVOR = { straw: { name: "딸기맛", fill: "#f0507a" }, lemon: { name: "레몬맛", fill: "#ffc93a" }, none: { name: "빈", fill: "#eeeeee" } };
export const ballCandy = (fl, size = null) => candy("round", FLAVOR[fl].fill, { size });

// ── 바다 친구·동물(한 색으로 칠하는 그림) ──
const W = `fill="#fff"`, LIGHT = `fill="#fff" opacity=".45"`;
const eye = (x, y, r = 6) => `<circle cx="${x}" cy="${y}" r="${r}" ${W} stroke="${L}" stroke-width="2"/><circle cx="${x + r * 0.15}" cy="${y + r * 0.1}" r="${r * 0.5}" fill="${L}"/>`;
const dot = (x, y, r = 3.4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${L}"/>`;
const CRIT = {
  squid: (f) => `<g stroke="${f}" stroke-width="6" stroke-linecap="round" fill="none"><path d="M34 60 q-6 14 0 28"/><path d="M44 62 q-3 14 1 30"/><path d="M56 62 q3 14 -1 30"/><path d="M66 60 q6 14 0 28"/></g>
    <path d="M50 6 L74 44 Q74 62 50 62 Q26 62 26 44Z" fill="${f}" stroke="${L}" stroke-width="2.5" stroke-linejoin="round"/><path d="M50 12 L60 32 Q50 36 40 32Z" ${LIGHT}/>${eye(40, 48)}${eye(60, 48)}`,
  puffer: (f) => `<g fill="${f}" stroke="${L}" stroke-width="2">${[[50, 14], [24, 26], [76, 26], [14, 52], [86, 52], [26, 78], [74, 78]].map(([x, y]) => { const a = Math.atan2(y - 52, x - 50), cx = 50 + 30 * Math.cos(a), cy = 52 + 30 * Math.sin(a); return `<path d="M${cx + 7 * Math.sin(a)} ${cy - 7 * Math.cos(a)} L${x} ${y} L${cx - 7 * Math.sin(a)} ${cy + 7 * Math.cos(a)}Z"/>`; }).join("")}</g>
    <circle cx="50" cy="52" r="31" fill="${f}" stroke="${L}" stroke-width="2.5"/><ellipse cx="50" cy="66" rx="20" ry="11" ${LIGHT}/><path d="M80 48 l12 -8 v20z" fill="${f}" stroke="${L}" stroke-width="2"/>${eye(36, 46, 7)}${eye(58, 46, 7)}<circle cx="47" cy="62" r="3.5" fill="none" stroke="${L}" stroke-width="2"/>`,
  fish: (f) => `<path d="M74 52 L96 34 L94 70Z" fill="${f}" stroke="${L}" stroke-width="2.5" stroke-linejoin="round"/><path d="M40 30 Q52 14 64 30" fill="${f}" stroke="${L}" stroke-width="2.5"/>
    <ellipse cx="46" cy="52" rx="34" ry="24" fill="${f}" stroke="${L}" stroke-width="2.5"/><path d="M14 58 Q30 72 52 66" ${LIGHT}/>${eye(30, 46, 9)}<path d="M13 60 q6 4 12 0" stroke="${L}" stroke-width="2.5" fill="none"/><path d="M56 44 q-6 8 0 16" stroke="${L}" stroke-width="2" fill="none"/>`,
  octopus: (f) => `<g stroke="${f}" stroke-width="7" stroke-linecap="round" fill="none"><path d="M30 62 q-10 14 -4 26"/><path d="M42 66 q-4 14 -2 24"/><path d="M58 66 q4 14 2 24"/><path d="M70 62 q10 14 4 26"/></g>
    <circle cx="50" cy="42" r="30" fill="${f}" stroke="${L}" stroke-width="2.5"/><ellipse cx="42" cy="28" rx="10" ry="7" ${LIGHT}/>${eye(39, 44, 6)}${eye(61, 44, 6)}<ellipse cx="50" cy="58" rx="6" ry="5" fill="#fff" stroke="${L}" stroke-width="2"/>`,
  crab: (f) => `<g stroke="${L}" stroke-width="3" stroke-linecap="round"><path d="M26 66 l-12 10 M28 72 l-10 12 M74 66 l12 10 M72 72 l10 12"/><path d="M40 46 v-16 M60 46 v-16"/><path d="M30 54 L18 40 M70 54 L82 40"/></g>
    <g fill="${f}" stroke="${L}" stroke-width="2.5"><path d="M8 34 a12 12 0 1 1 22 0 l-8 -4z"/><path d="M70 34 a12 12 0 1 1 22 0 l-8 -4z"/></g>
    <ellipse cx="50" cy="62" rx="28" ry="19" fill="${f}" stroke="${L}" stroke-width="2.5"/><ellipse cx="50" cy="70" rx="16" ry="7" ${LIGHT}/>${eye(40, 26, 6)}${eye(60, 26, 6)}<path d="M44 64 q6 5 12 0" stroke="${L}" stroke-width="2.5" fill="none"/>`,
  dog: (f, gray) => `<rect x="30" y="56" width="40" height="30" rx="8" fill="${f}" stroke="${L}" stroke-width="2.5"/><rect x="33" y="84" width="12" height="10" rx="4" fill="${gray ? f : "#fff"}" stroke="${L}" stroke-width="2"/><rect x="55" y="84" width="12" height="10" rx="4" fill="${gray ? f : "#fff"}" stroke="${L}" stroke-width="2"/>
    <circle cx="26" cy="64" r="6" fill="${gray ? f : "#fff"}" stroke="${L}" stroke-width="2"/><circle cx="74" cy="64" r="6" fill="${gray ? f : "#fff"}" stroke="${L}" stroke-width="2"/>
    <ellipse cx="50" cy="34" rx="26" ry="23" fill="${gray ? f : "#fff"}" stroke="${L}" stroke-width="2.5"/><path d="M50 11 A26 23 0 0 0 26 40 Q36 30 50 32Z" fill="${L}"/><path d="M70 16 q12 0 10 14 q-8 0 -10 -14z" fill="${gray ? f : "#fff"}" stroke="${L}" stroke-width="2"/>
    ${dot(40, 32)}${dot(60, 32)}<ellipse cx="50" cy="42" rx="5" ry="3.6" fill="${L}"/><path d="M42 48 q8 6 16 0" stroke="${L}" stroke-width="2.5" fill="none"/>`,
  bird: (f) => `<g stroke="${L}" stroke-width="2.5"><path d="M42 80 v12 M54 80 v12 M38 92 h8 M50 92 h8"/></g><path d="M66 50 L92 34 L88 62Z" fill="${f}" stroke="${L}" stroke-width="2.5"/>
    <ellipse cx="48" cy="58" rx="30" ry="24" fill="${f}" stroke="${L}" stroke-width="2.5"/><circle cx="34" cy="38" r="17" fill="${f}" stroke="${L}" stroke-width="2.5"/><path d="M52 52 q14 -2 22 10 q-12 8 -24 2z" fill="#000" opacity=".18" stroke="${L}" stroke-width="2"/>
    <path d="M18 36 L4 42 L18 44Z" fill="${L}"/>${dot(30, 34, 3.6)}`,
  giraffe: (f) => `<g fill="${f}" stroke="${L}" stroke-width="2.5" stroke-linejoin="round"><path d="M38 20 L46 20 L50 64 L80 64 L82 92 L74 92 L72 76 L54 76 L52 92 L44 92 Z"/><path d="M28 14 Q38 4 50 12 L52 22 Q40 26 28 22Z"/></g>
    <g stroke="${L}" stroke-width="2.5"><path d="M40 10 v-6 M46 10 v-6"/></g><circle cx="40" cy="4" r="2.5" fill="${L}"/><circle cx="46" cy="4" r="2.5" fill="${L}"/>
    <g fill="${L}" opacity=".45">${[[44, 32], [46, 46], [48, 58], [60, 68], [72, 70], [64, 80], [78, 82]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2"/>`).join("")}</g>${dot(38, 15, 2.6)}<path d="M82 66 q8 4 6 14" stroke="${L}" stroke-width="2.5" fill="none"/>`,
  monkey: (f) => `<path d="M68 72 q22 0 16 -18 q-4 -8 -10 -2" stroke="${L}" stroke-width="3" fill="none"/><rect x="34" y="56" width="32" height="32" rx="12" fill="${f}" stroke="${L}" stroke-width="2.5"/><rect x="36" y="84" width="10" height="10" rx="4" fill="${f}" stroke="${L}" stroke-width="2"/><rect x="54" y="84" width="10" height="10" rx="4" fill="${f}" stroke="${L}" stroke-width="2"/>
    <circle cx="22" cy="34" r="10" fill="${f}" stroke="${L}" stroke-width="2.5"/><circle cx="78" cy="34" r="10" fill="${f}" stroke="${L}" stroke-width="2.5"/><circle cx="50" cy="34" r="26" fill="${f}" stroke="${L}" stroke-width="2.5"/>
    <path d="M30 40 Q30 22 44 26 Q50 30 56 26 Q70 22 70 40 Q70 56 50 56 Q30 56 30 40Z" ${LIGHT}/>${dot(42, 36)}${dot(58, 36)}<path d="M44 46 q6 5 12 0" stroke="${L}" stroke-width="2.5" fill="none"/>`,
  pig: (f) => `<g fill="${f}" stroke="${L}" stroke-width="2.5"><rect x="26" y="68" width="10" height="16" rx="4"/><rect x="62" y="68" width="10" height="16" rx="4"/><ellipse cx="52" cy="56" rx="38" ry="26"/><path d="M28 34 l4 -16 l12 12z"/><path d="M52 32 l10 -14 l6 16z"/></g>
    <path d="M88 52 q10 -4 6 -12 q-6 -2 -4 6" stroke="${L}" stroke-width="2.5" fill="none"/><ellipse cx="20" cy="60" rx="12" ry="10" fill="${f}" stroke="${L}" stroke-width="2.5"/><ellipse cx="20" cy="60" rx="12" ry="10" ${LIGHT}/>
    <ellipse cx="16" cy="60" rx="2" ry="3.4" fill="${L}"/><ellipse cx="24" cy="60" rx="2" ry="3.4" fill="${L}"/>${dot(36, 46)}<ellipse cx="54" cy="70" rx="20" ry="8" ${LIGHT}/>`,
  elephant: (f) => `<g fill="${f}" stroke="${L}" stroke-width="2.5" stroke-linejoin="round"><rect x="40" y="66" width="12" height="24" rx="4"/><rect x="72" y="66" width="12" height="24" rx="4"/><ellipse cx="62" cy="56" rx="32" ry="24"/>
    <path d="M34 40 Q14 44 12 66 Q10 78 4 80 Q14 84 20 70 Q24 58 36 58Z"/><circle cx="36" cy="44" r="20"/><path d="M44 28 Q70 22 66 50 Q62 62 46 58Z"/></g><path d="M46 32 Q62 30 60 48" ${LIGHT}/>${dot(30, 40)}`,
  bear: (f) => `<g fill="${f}" stroke="${L}" stroke-width="2.5"><ellipse cx="52" cy="64" rx="30" ry="28"/><ellipse cx="32" cy="88" rx="14" ry="8"/><ellipse cx="70" cy="88" rx="14" ry="8"/><circle cx="30" cy="16" r="8"/><circle cx="62" cy="16" r="8"/><circle cx="46" cy="32" r="20"/></g>
    <path d="M44 56 q10 -10 18 0 q-4 18 -9 22 q-5 -4 -9 -22z" fill="${L}"/><path d="M48 60 q5 4 10 0" stroke="#fff" stroke-width="2" fill="none"/><ellipse cx="38" cy="38" rx="9" ry="6" ${LIGHT}/>${dot(38, 28, 2.8)}${dot(52, 28, 2.8)}<ellipse cx="36" cy="37" rx="3.6" ry="2.6" fill="${L}"/>`,
  puppy: (f) => `<g fill="${f}" stroke="${L}" stroke-width="2.5"><ellipse cx="60" cy="62" rx="28" ry="18"/><rect x="40" y="70" width="10" height="20" rx="4"/><rect x="72" y="70" width="10" height="20" rx="4"/><circle cx="34" cy="46" r="22"/></g>
    <path d="M38 24 q16 -6 18 16 q-10 2 -18 -16z" fill="${L}"/><ellipse cx="26" cy="52" rx="10" ry="7" ${LIGHT}/><ellipse cx="20" cy="50" rx="4" ry="3" fill="${L}"/>${eye(30, 42, 5)}
    <path d="M46 62 q10 8 20 4" stroke="${L}" stroke-width="5" fill="none"/>${[50, 57, 64].map((x) => `<path d="M${x} 64 l3 -6 l3 6z" fill="${L}"/>`).join("")}<path d="M86 56 q8 -6 6 -14" stroke="${L}" stroke-width="3" fill="none"/>`,
  hippo: (f) => `<g fill="${f}" stroke="${L}" stroke-width="2.5"><rect x="44" y="68" width="10" height="18" rx="4"/><rect x="64" y="68" width="10" height="18" rx="4"/><rect x="80" y="68" width="10" height="18" rx="4"/><ellipse cx="64" cy="56" rx="30" ry="22"/>
    <circle cx="32" cy="34" r="6"/><ellipse cx="34" cy="50" rx="22" ry="17"/><ellipse cx="22" cy="62" rx="20" ry="14"/></g><ellipse cx="22" cy="64" rx="18" ry="11" ${LIGHT}/>
    <circle cx="14" cy="60" r="4" fill="${L}"/><circle cx="28" cy="60" r="4" fill="${L}"/>${eye(40, 42, 5)}`,
  penguin: (f) => `<path d="M30 92 h14 M56 92 h14" stroke="#f0a020" stroke-width="5" stroke-linecap="round"/><path d="M50 8 Q78 12 80 56 Q82 88 50 90 Q18 88 20 56 Q22 12 50 8Z" fill="${f}" stroke="${L}" stroke-width="2.5"/>
    <path d="M50 30 Q70 36 68 64 Q66 84 50 84 Q34 84 32 64 Q30 36 50 30Z" fill="#fff" opacity=".85"/><path d="M20 50 q-10 16 -4 26 q8 -6 8 -20z" fill="${f}" stroke="${L}" stroke-width="2"/><path d="M80 50 q10 16 4 26 q-8 -6 -8 -20z" fill="${f}" stroke="${L}" stroke-width="2"/>
    <path d="M44 26 L50 34 L56 26Z" fill="#f0a020" stroke="${L}" stroke-width="1.5"/>${dot(42, 20, 3)}${dot(58, 20, 3)}`
};
export const CRIT_NAME = { squid: "오징어", puffer: "복어", fish: "물고기", octopus: "문어", crab: "게", dog: "강아지", bird: "새", giraffe: "기린", monkey: "원숭이", pig: "돼지", elephant: "코끼리", bear: "곰", puppy: "강아지", hippo: "하마", penguin: "펭귄" };
export function critter(kind, c, { size = null } = {}) {
  const f = fillOf(c), s = size ? `width="${size}" height="${size}"` : "";
  return `<svg viewBox="0 0 100 100" ${s} aria-hidden="true">${CRIT[kind](f, f === GRAY)}</svg>`;
}
// 모양(사탕 모양 또는 동물) 하나를 색 c로
export const piece = (kind, c, opts) => (SHAPE[kind] ? candy(kind, c, opts) : critter(kind, c, opts));
export const pieceName = (kind) => SHAPE_NAME[kind] || CRIT_NAME[kind] || kind;

// 색연필 자국(원본 매트릭스 맨 위)
export const crayon = (c, w = 64) => `<svg viewBox="0 0 64 40" width="${w}" height="${w * 40 / 64}" aria-hidden="true"><path d="M6 34 L14 8 L18 30 L26 6 L30 30 L38 6 L42 30 L50 6 L54 30 L60 10" stroke="${fillOf(c)}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" fill="none"/><path d="M8 26 L56 14" stroke="${fillOf(c)}" stroke-width="3" opacity=".6"/></svg>`;

// 매트릭스 판. rows: 모양 이름들(세로 ↓), cols: 색 이름들(가로 →), filled(r,c): 처음부터 그려 둘 칸
export function matrixBoard(host, { rows, cols, filled = () => true, style = "box", cell = "90px", arrows = true }) {
  const el = document.createElement("div");
  el.className = `mx-board ${style}`;
  el.style.setProperty("--cell", cell);
  el.style.gridTemplateColumns = `var(--head) repeat(${cols.length}, var(--cell))`;
  el.innerHTML = `${arrows ? `<div class="mx-arrow h"><span>가로</span><i></i></div><div class="mx-arrow v"><span>세로</span><i></i></div>` : ""}
    <div class="mx-corner"></div>${cols.map((c, j) => `<div class="mx-head col" data-c="${j}">${crayon(c)}</div>`).join("")}
    ${rows.map((k, i) => `<div class="mx-head row" data-r="${i}">${piece(k, GRAY)}</div>${cols.map((c, j) => `<button type="button" class="mx-cell" data-r="${i}" data-c="${j}" aria-label="${pieceName(k)} ${PAL[c]?.name || ""}"></button>`).join("")}`).join("")}`;
  host.append(el);
  const cellEl = (r, c) => el.querySelector(`.mx-cell[data-r="${r}"][data-c="${c}"]`);
  const api = {
    el, rows, cols, cellEl,
    show(r, c, { pop = false } = {}) { const b = cellEl(r, c); b.innerHTML = piece(rows[r], cols[c]); b.classList.add("full"); b.classList.remove("blank"); if (pop) { b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); } },
    put(r, c, html) { const b = cellEl(r, c); b.innerHTML = html; b.classList.add("full"); },
    hint(r, c, on = true) { el.querySelector(`.mx-head.row[data-r="${r}"]`)?.classList.toggle("glow", on); el.querySelector(`.mx-head.col[data-c="${c}"]`)?.classList.toggle("glow", on); cellEl(r, c)?.classList.toggle("aim", on); },
    clearHints() { el.querySelectorAll(".glow, .aim").forEach((x) => x.classList.remove("glow", "aim")); },
    onTap(fn) { el.addEventListener("click", (e) => { const b = e.target.closest(".mx-cell"); if (b) fn(Number(b.dataset.r), Number(b.dataset.c), b); }); }
  };
  rows.forEach((_, r) => cols.forEach((__, c) => { if (filled(r, c)) api.show(r, c); }));
  return api;
}
