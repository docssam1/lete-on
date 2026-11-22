// 2과정 개념 꾸러미 그림 도구 — 되짚기·정리·예제 카드의 SVG(워밍업 그림 색표: 잉크·초록·빨강 각 표시·연한 칠)
import { mathText } from "../math-markup.js?v=20261122w";
export const INK = "#24302b", GREEN = "#2f6b52", SOFT = "#e6efe8", MARK = "#b4553f", PALE = "#f4f1e8", BLUE = "#2f5fb3", YELLOW = "#fff1bf", PINK = "#f9c8c4";
const R = Math.PI / 180;
export const f1 = (v) => Math.round(v * 10) / 10;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
export const P = (x, y) => ({ x, y });
// 그림 다듬기(원장 2026-11-22 「SVG로 그림질 높여 · 촌스럽잖아」): 칠한 면은 위가 밝은 옅은 그라데이션, 선은 조금 가늘고 부드러운 잉크.
// 그림마다 따로 id를 붙여(한 쪽에 그림이 여럿이어도 서로 안 섞임) defs를 넣는다. 도형 함수는 평소대로 색 이름을 넘기면 된다.
const TONES = {
  "#fff1bf": ["#fff8de", "#fde9a8"], // 노랑
  "#e6efe8": ["#f1f7f2", "#d9e8dc"], // 옅은 초록
  "#f9c8c4": ["#fcdcd8", "#f3b2ad"], // 분홍
  "#cfe3f3": ["#e3f0fa", "#b7d4ec"], // 물
  "#e8e2d2": ["#f3efe4", "#ddd4bf"], // 쓴 몫
  "#f4f1e8": ["#faf8f2", "#ece6d6"], // 종이
  "#d9b37c": ["#e8c999", "#c99b5c"], // 나무
  "#fff": ["#ffffff", "#f4f6f3"], "#ffffff": ["#ffffff", "#f4f6f3"],
};
let svgSerial = 0;
export function polish(body) {
  const id = `pk${(svgSerial += 1).toString(36)}`;
  const used = new Map();
  let out = body.replace(/fill="(#[0-9a-fA-F]{3,6})"/g, (m, c) => {
    const tone = TONES[c.toLowerCase()];
    if (!tone) return m;
    const key = c.toLowerCase();
    if (!used.has(key)) used.set(key, `${id}g${used.size}`);
    return `fill="url(#${used.get(key)})"`;
  });
  out = out.replace(/stroke="#24302b" stroke-width="2\.2"/g, 'stroke="#2b3a33" stroke-width="1.9"');
  const grads = [...used].map(([c, gid]) => `<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${TONES[c][0]}"/><stop offset="1" stop-color="${TONES[c][1]}"/></linearGradient>`).join("");
  const shadow = `<filter id="${id}s" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="1.2" stdDeviation="1.1" flood-color="#1e4631" flood-opacity=".16"/></filter>`;
  return { id, body: `<defs>${grads}${shadow}</defs>${out.replaceAll("url(#SHADOW)", `url(#${id}s)`)}` };
}
// 그림자를 줄 요소에는 filter="url(#SHADOW)"를 붙인다(svg()가 그 그림의 그림자 id로 바꾼다)
export const SHADOW = 'filter="url(#SHADOW)"';
export const svg = (w, h, body, label = "그림") => `<svg viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-label="${esc(label)}" font-family="'FC Sans','Pretendard',sans-serif" style="overflow:visible">${polish(body).body}</svg>`;
export const text = (x, y, value, { size = 16, anchor = "middle", color = INK, weight = 600 } = {}) =>
  `<text x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}" dominant-baseline="central" fill="${color}" font-weight="${weight}">${esc(value)}</text>`;
export const line = (a, b, { color = INK, width = 2.2, dash = "" } = {}) =>
  `<line x1="${f1(a.x)}" y1="${f1(a.y)}" x2="${f1(b.x)}" y2="${f1(b.y)}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
export const poly = (points, { fill = "none", color = INK, width = 2.2, dash = "" } = {}) =>
  `<polygon points="${points.map((p) => `${f1(p.x)},${f1(p.y)}`).join(" ")}" fill="${fill}" stroke="${color}" stroke-width="${width}" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
export const rect = (x, y, w, h, { fill = "none", color = INK, width = 2.2, dash = "", rx = 0, shadow = false } = {}) =>
  `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}"${rx ? ` rx="${rx}"` : ""} fill="${fill}" stroke="${color}" stroke-width="${width}" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ""}${shadow ? ` ${SHADOW}` : ""}/>`;
export const circle = (c, r, { fill = "none", color = INK, width = 2.2, dash = "" } = {}) =>
  `<circle cx="${f1(c.x)}" cy="${f1(c.y)}" r="${f1(r)}" fill="${fill}" stroke="${color}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
export const dot = (p, r = 3.6, color = INK) => `<circle cx="${f1(p.x)}" cy="${f1(p.y)}" r="${r}" fill="${color}"/>`;
export const at = (c, r, deg) => P(c.x + r * Math.cos(deg * R), c.y - r * Math.sin(deg * R));
export const arrow = (a, b, { color = "#8a948f", width = 2.2 } = {}) => {
  const d = Math.atan2(b.y - a.y, b.x - a.x), h = 9;
  const p1 = P(b.x - h * Math.cos(d - 0.45), b.y - h * Math.sin(d - 0.45)), p2 = P(b.x - h * Math.cos(d + 0.45), b.y - h * Math.sin(d + 0.45));
  return line(a, b, { color, width }) + `<polygon points="${f1(b.x)},${f1(b.y)} ${f1(p1.x)},${f1(p1.y)} ${f1(p2.x)},${f1(p2.y)}" fill="${color}"/>`;
};
// 부채꼴(가운데 c, 반지름 r, 수학 방향 a1 → a2 도)
export function sector(c, r, a1, a2, { fill = SOFT, color = INK, width = 2 } = {}) {
  let span = a2 - a1; while (span <= 0) span += 360;
  const p1 = at(c, r, a1), p2 = at(c, r, a1 + span);
  return `<path d="M ${f1(c.x)} ${f1(c.y)} L ${f1(p1.x)} ${f1(p1.y)} A ${r} ${r} 0 ${span > 180 ? 1 : 0} 0 ${f1(p2.x)} ${f1(p2.y)} Z" fill="${fill}" stroke="${color}" stroke-width="${width}" stroke-linejoin="round"/>`;
}
// 각 표시: 꼭짓점 v에서 수학 방향 a1 → a2(도) 사이 호와 글자. 직각이면 꺾쇠
export function angleMark(v, a1, a2, r, label = "", { color = MARK, size = 15, gap = 16 } = {}) {
  let span = a2 - a1; while (span <= 0) span += 360;
  const p1 = at(v, r, a1), p2 = at(v, r, a1 + span);
  const right = Math.abs(span - 90) < 0.5;
  const corner = at(v, r * 1.41, a1 + 45);
  const arc = right
    ? `<path d="M ${f1(p1.x)} ${f1(p1.y)} L ${f1(corner.x)} ${f1(corner.y)} L ${f1(p2.x)} ${f1(p2.y)}" fill="none" stroke="${color}" stroke-width="1.8"/>`
    : `<path d="M ${f1(p1.x)} ${f1(p1.y)} A ${r} ${r} 0 ${span > 180 ? 1 : 0} 0 ${f1(p2.x)} ${f1(p2.y)}" fill="none" stroke="${color}" stroke-width="1.9"/>`;
  const m = at(v, r + gap, a1 + span / 2);
  return arc + (label ? text(m.x, m.y, label, { size, color }) : "");
}
export const dirOf = (a, b) => Math.atan2(-(b.y - a.y), b.x - a.x) / R;
// 같은 길이 표시(변 가운데 작은 빗금)
export function tick(a, b, n = 1, { color = INK } = {}) {
  const m = P((a.x + b.x) / 2, (a.y + b.y) / 2), d = dirOf(a, b) + 90;
  return Array.from({ length: n }, (_, k) => {
    const c = at(m, (k - (n - 1) / 2) * 5, dirOf(a, b));
    return line(at(c, 6, d), at(c, -6, d), { color, width: 1.8 });
  }).join("");
}
// 정n각형 꼭짓점(가운데 c, 반지름 r, 첫 꼭짓점 각 start)
export const regular = (c, r, n, start = 90) => Array.from({ length: n }, (_, k) => at(c, r, start + (360 / n) * k));
// 점판(가로 cols × 세로 rows, 칸 s, 왼쪽 위 o)
export const dots = (o, cols, rows, s, { r = 3.2, color = "#8a948f" } = {}) => {
  let out = "";
  for (let j = 0; j < rows; j += 1) for (let i = 0; i < cols; i += 1) out += dot(P(o.x + i * s, o.y + j * s), r, color);
  return out;
};
// 모눈(가로 cols × 세로 rows, 칸 s, 왼쪽 위 o)
export const grid = (o, cols, rows, s, { color = "#c9d3cd", width = 1.2 } = {}) => {
  let out = "";
  for (let i = 0; i <= cols; i += 1) out += line(P(o.x + i * s, o.y), P(o.x + i * s, o.y + rows * s), { color, width });
  for (let j = 0; j <= rows; j += 1) out += line(P(o.x, o.y + j * s), P(o.x + cols * s, o.y + j * s), { color, width });
  return out;
};
// 시계판(가운데 c, 반지름 r) + 바늘(시·분)
export function clock(c, r, hour, minute, { hourColor = INK, minuteColor = BLUE, labels = true } = {}) {
  let out = circle(c, r, { fill: "#fff", width: 2.6 });
  for (let k = 0; k < 60; k += 1) {
    const big = k % 5 === 0;
    out += line(at(c, r - (big ? 11 : 6), 90 - k * 6), at(c, r - 2, 90 - k * 6), { width: big ? 2.2 : 1, color: big ? INK : "#9aa39e" });
  }
  if (labels) for (let h = 1; h <= 12; h += 1) { const p = at(c, r - 24, 90 - h * 30); out += text(p.x, p.y, String(h), { size: 14 }); }
  const ha = 90 - (30 * (hour % 12) + 0.5 * minute), ma = 90 - 6 * minute;
  out += line(c, at(c, r * 0.5, ha), { color: hourColor, width: 5 });
  out += line(c, at(c, r * 0.78, ma), { color: minuteColor, width: 3.2 });
  return out + dot(c, 4.5);
}
// 디지털 숫자(일곱 막대). mirror면 좌우로 뒤집어 그린다
const SEG = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcdfg" };
export function digital(d, x, y, { w = 30, h = 54, color = INK, width = 5, mirror = false } = {}) {
  const parts = { a: [4, 0, w - 4, 0], b: [w - 2, 3, w - 2, h / 2 - 2], c: [w - 2, h / 2 + 2, w - 2, h - 3], d: [4, h, w - 4, h], e: [2, h / 2 + 2, 2, h - 3], f: [2, 3, 2, h / 2 - 2], g: [4, h / 2, w - 4, h / 2] };
  return [...(SEG[d] || "")].map((k) => {
    let [x1, y1, x2, y2] = parts[k];
    if (mirror) { x1 = w - x1; x2 = w - x2; }
    return line(P(x + x1, y + y1), P(x + x2, y + y2), { color, width });
  }).join("");
}

// 식 칠판 — 줄마다 식 하나. SVG 글자로는 분수를 쌓을 수 없어 HTML + 공통 수식(math-markup)으로 그린다(빗금 분수 금지).
// 「3/5」「1/(□ × (□ + 1))」「2^5」는 수식으로, 나머지 글은 그대로. 모양은 course2-pack.css · golden-bell-print-layout.css 의 .pk-board.
export const formulas = (lines) => `<div class="pk-board" role="img" aria-label="식">${lines.map((t) => `<div class="pk-board-line">${mathText(esc(t))}</div>`).join("")}</div>`;

// 그림(SVG) 속 수식 글 — SVG 안에는 MathML을 넣지 않으므로(math-markup.js 약속) 분수는 위아래로 쌓아 가로줄을, 거듭제곱은 작게 올려 그린다.
// 「1/3 사용」「72 = 2^3 × 3^2」처럼 글과 섞어 쓴다. 분수 칸은 수·□, 지수는 수·□·글자 하나.
const TOKEN = /(\d+|□)\/(\d+|□)|(\d+|[A-Za-z□])\^(\d+|□|[A-Za-z])/g;
const glyph = (ch, size) => (/[가-힣ㄱ-ㅎ]/.test(ch) ? size * 0.96 : /\s/.test(ch) ? size * 0.3 : /[×÷=+−→□]/.test(ch) ? size * 0.78 : size * 0.58);
const runWidth = (str, size) => [...str].reduce((w, ch) => w + glyph(ch, size), 0);
export function mathLabel(x, y, value, { size = 16, anchor = "middle", color = INK, weight = 600 } = {}) {
  const parts = []; let last = 0;
  for (const m of String(value).matchAll(TOKEN)) {
    if (m.index > last) parts.push({ kind: "run", t: String(value).slice(last, m.index) });
    parts.push(m[1] ? { kind: "frac", n: m[1], d: m[2] } : { kind: "pow", b: m[3], e: m[4] });
    last = m.index + m[0].length;
  }
  if (last < String(value).length) parts.push({ kind: "run", t: String(value).slice(last) });
  const small = size * 0.8, sup = size * 0.62;
  const widthOf = (p) => (p.kind === "run" ? runWidth(p.t, size) : p.kind === "frac" ? Math.max(runWidth(p.n, small), runWidth(p.d, small)) + size * 0.3 : runWidth(p.b, size) + runWidth(p.e, sup) + 1);
  const total = parts.reduce((w, p) => w + widthOf(p), 0);
  let cx = anchor === "middle" ? x - total / 2 : anchor === "end" ? x - total : x;
  const t = (px, py, str, sz, a = "start") => `<text x="${f1(px)}" y="${f1(py)}" font-size="${f1(sz)}" text-anchor="${a}" dominant-baseline="central" fill="${color}" font-weight="${weight}">${esc(str)}</text>`;
  let out = "";
  for (const p of parts) {
    const w = widthOf(p);
    if (p.kind === "run") out += t(cx, y, p.t, size);
    else if (p.kind === "frac") {
      const mid = cx + w / 2;
      out += t(mid, y - small * 0.62, p.n, small, "middle") + `<line x1="${f1(cx + size * 0.08)}" y1="${f1(y)}" x2="${f1(cx + w - size * 0.08)}" y2="${f1(y)}" stroke="${color}" stroke-width="${f1(Math.max(1.2, size / 13))}"/>` + t(mid, y + small * 0.66, p.d, small, "middle");
    } else {
      const bw = runWidth(p.b, size);
      out += t(cx, y, p.b, size) + t(cx + bw + 1, y - size * 0.42, p.e, sup);
    }
    cx += w;
  }
  return `<g role="img" aria-label="${esc(value)}">${out}</g>`;
}
