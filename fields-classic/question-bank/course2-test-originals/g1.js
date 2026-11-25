// 2과정 G1 「돌리기와 뒤집기」 권별 테스트 — 드라이브 원문(2G1 테스트, 25문항)을 우리 시험지 꼴로 다시 짠 것(원장 2026-11-14).
// 글·수·배치는 원문 그대로, 그림은 우리 색표(워밍업 그림 색)로 다시 그렸다. 디지털 숫자는 글꼴이 아니라 일곱 막대(SVG 선)로 그린다.
// 정답은 여기 두지 않는다(비공개 자리에만).
import { UT, text, svg, line, box, cell, blockArrow } from "../selection-test-originals/kit.js?v=20261114a";
import { lenArc } from "./len-arc.js?v=20261124a";

export const perPage = 4;
export const meta = { course: "2과정", book: "G1", title: "돌리기와 뒤집기" };

const R = Math.PI / 180;
const f = (n) => (Math.round(n * 10) / 10).toString();
const P = (x, y) => ({ x, y });
const at = (c, r, deg) => P(c.x + r * Math.cos(deg * R), c.y - r * Math.sin(deg * R));
const lerp = (a, b, t) => P(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
const INK = UT.ink;
const poly = (pts, { fill = "none", stroke = INK, width = 1.6, dash = "" } = {}) =>
  `<polygon points="${pts.map((p) => `${f(p.x)},${f(p.y)}`).join(" ")}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const seg = (a, b, opts) => line(f(a.x), f(a.y), f(b.x), f(b.y), opts);
const small = (p, value, size = 12, fill = INK) => text(f(p.x), f(p.y), value, { size, weight: 600, fill });
const circle = (c, r, { fill = "none", stroke = INK, width = 1.6, dash = "" } = {}) =>
  `<circle cx="${f(c.x)}" cy="${f(c.y)}" r="${f(r)}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const dot = (c, r = 3, fill = UT.green) => `<circle cx="${f(c.x)}" cy="${f(c.y)}" r="${r}" fill="${fill}"/>`;
const rect = (x, y, w, h, opts) => poly([P(x, y), P(x + w, y), P(x + w, y + h), P(x, y + h)], opts);

// ── 디지털 숫자: 일곱 막대(a 위 · b 오른쪽 위 · c 오른쪽 아래 · d 아래 · e 왼쪽 아래 · f 왼쪽 위 · g 가운데)
const SEGS = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcdfg" };
function seg7(x, y, w, h, digit, { color = UT.green, t = Math.max(2.4, w * 0.17) } = {}) {
  const g = t * 0.85, L = x + t / 2, Rr = x + w - t / 2, T = y + t / 2, B = y + h - t / 2, M = (T + B) / 2;
  const s = { a: [L + g, T, Rr - g, T], b: [Rr, T + g, Rr, M - g], c: [Rr, M + g, Rr, B - g], d: [L + g, B, Rr - g, B], e: [L, M + g, L, B - g], f: [L, T + g, L, M - g], g: [L + g, M, Rr - g, M] };
  return [...SEGS[digit]].map((k) => line(...s[k].map(f), { stroke: color, width: f(t) })).join("");
}
// 칸 안의 디지털 숫자(빈 칸이면 digit 을 null 로)
const segCell = (x, y, w, h, digit = null, opts = {}) => cell(x, y, w, h) + (digit == null ? "" : seg7(x + w * 0.27, y + h * 0.17, w * 0.46, h * 0.66, digit, opts));
// 0~9 디지털 숫자 카드 한 줄
function segCards(width, y, size = 26, gap = 4) {
  const x0 = (width - (10 * size + 9 * gap)) / 2;
  return Array.from({ length: 10 }, (_, d) => {
    const x = x0 + d * (size + gap);
    return box(x, y, size, size * 1.18, { fill: UT.card, stroke: UT.cardLine, width: 1.6 }) + seg7(x + size * 0.28, y + size * 0.2, size * 0.44, size * 0.78, d, { color: INK, t: 2.4 });
  }).join("");
}
// 두 칸(또는 세 칸) 세로셈: rows = [[...], [...]] (null 이면 빈 칸), result = 맨 아래 줄(null 은 칸 없음, "" 은 빈 칸)
function column(x, y, s, rows, op, result, { seg = false, notes = [] } = {}) {
  const n = rows[0].length;
  let out = "";
  rows.forEach((row, r) => row.forEach((v, i) => {
    const cx = x + i * s, cy = y + r * (s + 8);
    out += seg && v != null ? segCell(cx, cy, s, s, v) : cell(cx, cy, s, s, v ?? "", { size: 16 });
  }));
  out += text(x - 16, y + s + 8 + s / 2, op, { size: 16 });
  const ly = y + 2 * s + 8 + 10;
  out += line(x - 30, ly, x + n * s + 6, ly, { stroke: UT.line, width: 1.4 });
  result.forEach((v, i) => { if (v != null) out += cell(x + i * s, ly + 8, s, s, v, { size: 16 }); });
  notes.forEach((note, r) => { if (note) out += text(x + n * s + 10, y + r * (s + 8) + s / 2, note, { size: 12, weight: 600, anchor: "start" }); });
  return out;
}

// ── 색종이(접기·구멍)
const PAPER = { fill: UT.paper, stroke: UT.paperLine, width: 1.4 };
const crease = (a, b) => seg(a, b, { stroke: UT.crease, width: 1.1, dash: "4 3" });
// 접는 방향 굽은 화살표(a 에서 b 로)
function foldArrow(a, b, bend = 10) {
  const m = lerp(a, b, 0.5), l = Math.hypot(b.x - a.x, b.y - a.y), nx = -(b.y - a.y) / l, ny = (b.x - a.x) / l;
  const c = P(m.x + nx * bend, m.y + ny * bend);
  const ang = Math.atan2(b.y - c.y, b.x - c.x), h = 6;
  const h1 = P(b.x - h * Math.cos(ang - 0.45), b.y - h * Math.sin(ang - 0.45)), h2 = P(b.x - h * Math.cos(ang + 0.45), b.y - h * Math.sin(ang + 0.45));
  return `<path d="M${f(a.x)} ${f(a.y)} Q${f(c.x)} ${f(c.y)} ${f(b.x)} ${f(b.y)}" fill="none" stroke="${UT.arrow}" stroke-width="1.6"/>`
    + `<polyline points="${f(h1.x)},${f(h1.y)} ${f(b.x)},${f(b.y)} ${f(h2.x)},${f(h2.y)}" fill="none" stroke="${UT.arrow}" stroke-width="1.6" stroke-linejoin="round"/>`;
}
const next = (x, y) => blockArrow(x, y, x + 20, y, { shaft: 6, head: 13, headLen: 9 });

// ── 시계: hands = { hour: 시(소수), minute: 분 } · numbers false 면 숫자 없이 눈금만 · mirror 면 거울에 비친 「12」
function clock(c, r, { hands = null, numbers = true, mirror = false } = {}) {
  let out = circle(c, r, { fill: "#fff", stroke: UT.soft, width: r * 0.1 }) + circle(c, r * 1.05, { stroke: UT.line, width: 1 });
  for (let i = 0; i < 60; i += 1) {
    const big = i % 5 === 0, a = 90 - i * 6;
    out += seg(at(c, r * 0.94, a), at(c, r * (big ? 0.82 : 0.88), a), { stroke: big ? INK : UT.line, width: big ? 1.4 : 0.8 });
  }
  if (numbers === true) {
    for (let h = 1; h <= 12; h += 1) { const p = at(c, r * 0.68, 90 - h * 30); out += text(f(p.x), f(p.y), String(h), { size: r * 0.2, weight: 600 }); }
  } else if (numbers === "12") {
    const p = at(c, r * 0.68, 90);
    out += `<g transform="translate(${f(2 * p.x)} 0) scale(-1 1)">${text(f(p.x), f(p.y), "12", { size: r * 0.2, weight: 600 })}</g>`;
  }
  if (hands) {
    const hand = (deg, len, color, w) => {
      const tip = at(c, len, 90 - deg), base = at(c, len - 9, 90 - deg), l = at(base, 5, 180 - deg), rr = at(base, 5, -deg);
      return seg(c, base, { stroke: color, width: w }) + poly([tip, l, rr], { fill: color, stroke: color, width: 1 });
    };
    out += hand(hands.minute * 6, r * 0.78, UT.line, 3) + hand((hands.hour % 12) * 30, r * 0.5, INK, 4.2);
  }
  return out + circle(c, r * 0.08, { fill: "#bbb", stroke: UT.line, width: 1.2 });
}

// ── 돌리기·뒤집기 기호
const MOTION = UT.line;
function arrowHead(p, ang, h = 6, color = MOTION) {
  const a = ang * R, h1 = P(p.x - h * Math.cos(a - 0.5), p.y - h * Math.sin(a - 0.5)), h2 = P(p.x - h * Math.cos(a + 0.5), p.y - h * Math.sin(a + 0.5));
  return `<polyline points="${f(h1.x)},${f(h1.y)} ${f(p.x)},${f(p.y)} ${f(h2.x)},${f(h2.y)}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linejoin="round"/>`;
}
// 위아래로 뒤집기(가로 점선 축)
function flipH(c, s = 18) {
  return seg(P(c.x - s * 1.3, c.y), P(c.x + s * 1.3, c.y), { stroke: "#777", width: 1.8, dash: "4 3" })
    + `<path d="M${f(c.x + 2)} ${f(c.y + s)} A${f(s * 0.42)} ${f(s)} 0 1 1 ${f(c.x + s * 0.4)} ${f(c.y - s * 0.6)}" fill="none" stroke="${MOTION}" stroke-width="1.8"/>` + arrowHead(P(c.x + s * 0.4, c.y - s * 0.6), 60);
}
// 왼쪽 오른쪽으로 뒤집기(세로 점선 축) — 위아래 뒤집기 기호를 반의 반 바퀴 돌린 것
const flipV = (c, s = 18) => `<g transform="rotate(-90 ${f(c.x)} ${f(c.y)})">${flipH(c, s)}</g>`;
// 시계 방향 돌리기: quarter 1 = 반의 반 바퀴, 2 = 반 바퀴 · ccw 면 시계 반대 방향
function turn(c, r = 17, quarter = 1, ccw = false) {
  const end = ccw ? at(c, r, 90 + 90 * quarter) : at(c, r, 90 - 90 * quarter), top = at(c, r, 90);
  const arc = `<path d="M${f(top.x)} ${f(top.y)} A${r} ${r} 0 0 ${ccw ? 0 : 1} ${f(end.x)} ${f(end.y)}" fill="none" stroke="${MOTION}" stroke-width="1.8"/>`;
  const rest = circle(c, r, { stroke: "#aaa", width: 1.2 }) + seg(P(c.x - r, c.y), P(c.x + r, c.y), { stroke: "#ccc", width: 1, dash: "3 3" }) + seg(P(c.x, c.y - r), P(c.x, c.y + r), { stroke: "#ccc", width: 1, dash: "3 3" });
  const tangent = ccw ? (quarter === 1 ? 90 : 0) : (quarter === 1 ? 90 : 180);
  return rest + seg(c, top, { stroke: MOTION, width: 1.8 }) + seg(c, end, { stroke: MOTION, width: 1.8 }) + arc + arrowHead(end, tangent);
}
// 점선 모눈(cols × rows, 한 칸 s)
function dashGrid(x, y, cols, rows, s) {
  let out = "";
  for (let i = 0; i <= cols; i += 1) out += line(x + i * s, y, x + i * s, y + rows * s, { stroke: "#bbb", width: 1, dash: "4 3" });
  for (let j = 0; j <= rows; j += 1) out += line(x, y + j * s, x + cols * s, y + j * s, { stroke: "#bbb", width: 1, dash: "4 3" });
  return out;
}

// ── 1~4번
function q1() {
  const s = 56, y = 14;
  const sq = rect(10, y, s, s, PAPER) + crease(P(10, y), P(10 + s, y + s)) + foldArrow(P(54, y + 12), P(28, y + 42));
  const t1x = 104, t1 = poly([P(t1x, y), P(t1x, y + s), P(t1x + s, y + s)], PAPER) + crease(P(t1x, y + s), P(t1x + s / 2, y + s / 2)) + foldArrow(P(t1x + 12, y + 22), P(t1x + 22, y + 44), -8);
  const t2x = 196, t2 = poly([P(t2x, y + s), P(t2x + s, y + s), P(t2x + s / 2, y + s / 2)], PAPER) + crease(P(t2x + s / 2, y + s / 2), P(t2x + s / 2, y + s)) + foldArrow(P(t2x + 18, y + 46), P(t2x + 38, y + 46), -8);
  const t3x = 278, t3 = poly([P(t3x, y + s / 2), P(t3x, y + s), P(t3x + s / 2, y + s)], PAPER);
  const big = 148, bx = 26, by = 108, k = 0.15;
  const oct = [P(bx + big / 2, by), P(bx + big * (1 - k), by + big * k), P(bx + big, by + big / 2), P(bx + big * (1 - k), by + big * (1 - k)), P(bx + big / 2, by + big), P(bx + big * k, by + big * (1 - k)), P(bx, by + big / 2), P(bx + big * k, by + big * k)];
  const unfolded = rect(bx, by, big, big, { stroke: UT.paperLine, width: 1.1, dash: "4 3" }) + poly(oct, PAPER);
  const fx = 236, fy = by + 70, fs = 76;
  return svg(320, 270, "세 번 접은 색종이와 펼친 모양",
    sq + next(72, y + s / 2) + t1 + next(166, y + s / 2) + t2 + next(256, y + s * 0.75) + t3 + unfolded
    + poly([P(fx, fy), P(fx, fy + fs), P(fx + fs, fy + fs)], PAPER), 320);
}
function q2() {
  const s = 74, y = 12;
  const sq = rect(10, y, s, s, PAPER) + crease(P(10, y + s), P(10 + s, y)) + foldArrow(P(26, y + 30), P(56, y + 52), 8);
  const tx = 122, tri = poly([P(tx, y + s), P(tx + s, y + s), P(tx + s, y)], PAPER) + crease(P(tx + s, y + s), P(tx + s / 2, y + s / 2)) + foldArrow(P(tx + 60, y + 38), P(tx + 46, y + 62), 8);
  const hx = 232, hy = y + s, A = P(hx, hy), B = P(hx + 76, hy), C = P(hx + 38, hy - 38);
  const notch = lerp(C, B, 0.42), nr = 8;
  const holed = poly([A, B, C], PAPER) + circle(P(hx + 30, hy - 11), 6.5, { fill: "#fff", stroke: UT.paperLine, width: 1.3 }) + circle(P(hx + 46, hy - 11), 6.5, { fill: "#fff", stroke: UT.paperLine, width: 1.3 })
    + circle(notch, nr, { fill: "#fff", stroke: "none" })
    + `<path d="M${f(lerp(C, B, 0.42 - nr / 53.7).x)} ${f(lerp(C, B, 0.42 - nr / 53.7).y)} A${nr} ${nr} 0 0 0 ${f(lerp(C, B, 0.42 + nr / 53.7).x)} ${f(lerp(C, B, 0.42 + nr / 53.7).y)}" fill="none" stroke="${UT.paperLine}" stroke-width="1.3"/>`;
  const ux = 122, uy = 112, us = 92;
  const open = rect(ux, uy, us, us, PAPER) + crease(P(ux, uy), P(ux + us, uy + us)) + crease(P(ux + us, uy), P(ux, uy + us));
  return svg(320, 216, "두 번 접어 구멍을 뚫은 색종이", sq + next(92, y + s / 2) + tri + next(204, y + s * 0.7) + holed + open, 320);
}
function q3() {
  const W = 230, H = 92, x0 = 20, y0 = 14, dw = 30, dh = 52, top = y0 + 20;
  const digits = [[x0 + 22, 2], [x0 + 66, 1], [x0 + 128, 5], [x0 + 172, 1]];
  return svg(270, 120, "디지털 시계 21:51",
    `<rect x="${x0}" y="${y0}" width="${W}" height="${H}" rx="14" fill="${UT.greenSoft}" stroke="none"/>`
    + digits.map(([x, d]) => seg7(x, top, dw, dh, d, { t: 5.5 })).join("")
    + dot(P(x0 + 113, top + 16), 3.4) + dot(P(x0 + 113, top + 36), 3.4), 250);
}
function q4() {
  const s = 40, y = 34;
  return svg(320, 100, "원래 수와 거울에 비친 수를 더한 식",
    text(48, 16, "원래 수", { size: 12, weight: 600 }) + text(166, 16, "거울에 비친 수", { size: 12, weight: 600 })
    + segCell(8, y, s, s, 2) + segCell(8 + s, y, s, s, 8)
    + text(107, y + s / 2, "+", { size: 16 }) + cell(126, y, s, s) + cell(126 + s, y, s, s)
    + text(224, y + s / 2, "=", { size: 16 }) + box(240, y, 74, s, { stroke: UT.box, width: 1.6, radius: 6 }), 320);
}

// ── 5~8번
function q5() {
  const s = 32, y = 70;
  return svg(320, 214, "숫자 카드와 두 세로셈",
    segCards(320, 4) + text(18, 52, "(1)", { size: 12, weight: 600 }) + text(176, 52, "(2)", { size: 12, weight: 600 })
    + column(66, y, s, [[null, null], [null, null]], "+", [6, 3])
    + column(226, y, s, [[null, null], [null, null]], "−", [null, 6]), 320);
}
function q6() {
  const s = 56, y = 12, lab = y + s + 18;
  const p1 = rect(10, y, s, s, PAPER) + crease(P(10, y), P(10 + s, y + s)) + foldArrow(P(54, y + 12), P(28, y + 42));
  const x2 = 96, p2 = poly([P(x2, y), P(x2, y + s), P(x2 + s, y + s)], PAPER) + crease(P(x2, y + s), P(x2 + s / 2, y + s / 2)) + foldArrow(P(x2 + 12, y + 22), P(x2 + 22, y + 44), -8);
  const x3 = 186, p3 = poly([P(x3, y), P(x3, y + s), P(x3 + s / 2, y + s / 2)], PAPER) + crease(P(x3, y + s / 2), P(x3 + s / 2, y + s / 2)) + foldArrow(P(x3 + 8, y + 14), P(x3 + 14, y + 32), -6);
  const x4 = 262, p4 = poly([P(x4, y + s / 2), P(x4, y + s), P(x4 + s / 2, y + s)], PAPER);
  const labels = [[38, "1단계"], [124, "2단계"], [200, "3단계"], [276, "4단계"]].map(([x, v]) => text(x, lab, v, { size: 12, weight: 600 })).join("");
  return svg(310, 96, "네 단계로 접는 색종이", p1 + next(70, y + s / 2) + p2 + next(158, y + s / 2) + p3 + next(220, y + s * 0.6) + p4 + labels, 310);
}
function q7() {
  const r = 62, L = P(78, 72), Rr = P(232, 72);
  return svg(310, 168, "거울에 비친 두 시계",
    clock(L, r, { numbers: "12", hands: { hour: 7 + 20 / 60, minute: 20 } }) + clock(Rr, r, { numbers: "12", hands: { hour: 4 + 40 / 60, minute: 40 } })
    + text(L.x, 156, "시작한 시각", { size: 13, weight: 600 }) + text(Rr.x, 156, "끝난 시각", { size: 13, weight: 600 }), 300);
}
function q8() {
  const c = 30, gx = 10, gy = 10, x2 = 200, y3 = 210;
  const shape = [P(1, 0), P(3, 0), P(3, 3), P(4, 3), P(4, 4), P(2, 4), P(2, 1), P(1, 1)].map((p) => P(gx + p.x * c, gy + p.y * c));
  return svg(330, 340, "돌리고 뒤집을 도형과 빈 모눈",
    dashGrid(gx, gy, 4, 4, c) + poly(shape, { fill: UT.yellowSoft, stroke: UT.orange, width: 2.4 })
    + blockArrow(144, 52, 182, 52, { shaft: 9, head: 18, headLen: 12 }) + turn(P(163, 98), 15, 1, true)
    + dashGrid(x2, gy, 4, 4, c)
    + blockArrow(246, 140, 246, 178, { shaft: 9, head: 18, headLen: 12 }) + flipH(P(288, 160), 15)
    + dashGrid(x2, y3, 4, 4, c), 320);
}

// ── 9~12번
function q9() {
  const s = 40, x = 70, y = 10;
  return svg(260, 160, "원래 수와 반 바퀴 돌린 수의 세로셈",
    segCell(x, y, s, s, 6) + segCell(x + s, y, s, s, 1) + text(x + 2 * s + 12, y + s / 2, "← 원래 수", { size: 12, weight: 600, anchor: "start" })
    + cell(x, y + s + 8, s, s) + cell(x + s, y + s + 8, s, s) + text(x - 18, y + s + 8 + s / 2, "−", { size: 16 })
    + text(x + 2 * s + 12, y + s + 8 + s / 2, "← 돌린 수", { size: 12, weight: 600, anchor: "start" })
    + line(x - 34, y + 2 * s + 18, x + 2 * s + 6, y + 2 * s + 18, { stroke: UT.line, width: 1.4 })
    + cell(x, y + 2 * s + 26, s, s) + cell(x + s, y + 2 * s + 26, s, s), 260);
}
// 숫자판의 글자(돌리거나 뒤집힌 채로): rot 은 시계 방향 각, sx·sy 는 -1 이면 뒤집기
function turned(c, value, { rot = 0, sx = 1, sy = 1, size = 20 } = {}) {
  return `<g transform="translate(${f(c.x)} ${f(c.y)}) rotate(${rot}) scale(${sx} ${sy})">${text(0, 1, value, { size, weight: 500 })}</g>`;
}
function q10() {
  const s = 44, x0 = 94, y0 = 104;
  const board = [
    ["6", {}], ["8", { rot: 90 }], ["7", { rot: -90 }],
    ["9", {}], ["5", { rot: 90 }], ["4", { rot: 180 }],
    ["3", {}], ["2", { rot: -90 }], ["1", { sy: -1 }],
  ];
  let cells = "";
  board.forEach(([v, t], i) => {
    const cx = x0 + (i % 3) * s, cy = y0 + Math.floor(i / 3) * s;
    cells += rect(cx, cy, s, s, { fill: "#fff", stroke: UT.box, width: 1.5 }) + turned(P(cx + s / 2, cy + s / 2), v, t);
  });
  return svg(320, 244, "움직이는 방법과 숫자판",
    `<rect x="40" y="8" width="240" height="80" rx="14" fill="#fdfbf5" stroke="${UT.soft}" stroke-width="1.6"/>`
    + flipH(P(84, 48), 17) + turn(P(160, 48), 17, 2) + flipV(P(236, 48), 17) + cells, 300);
}
function q11() {
  const s = 32, y = 70;
  return svg(320, 214, "숫자 카드와 두 세로셈",
    segCards(320, 4) + text(18, 52, "(1)", { size: 12, weight: 600 }) + text(176, 52, "(2)", { size: 12, weight: 600 })
    + column(66, y, s, [[null, null], [null, null]], "+", [8, 0])
    + column(226, y, s, [[null, null], [null, null]], "−", [6, 3]), 320);
}
function q12() {
  const size = 26, gap = 4, x0 = (320 - (10 * size + 9 * gap)) / 2, s = 36, x = 92, y = 58;
  const cards = Array.from({ length: 10 }, (_, d) => {
    const cx = x0 + d * (size + gap);
    const face = d === 1 ? line(f(cx + size / 2), 9, f(cx + size / 2), 27, { stroke: INK, width: 2 }) : text(f(cx + size / 2), 18.5, String(d), { size: 16, weight: 500 });
    return box(cx, 4, size, 29, { fill: UT.card, stroke: UT.cardLine, width: 1.6 }) + face;
  }).join("");
  return svg(320, 214, "숫자 카드와 세 자리 수의 덧셈",
    cards + column(x, y, s, [["", "", ""], ["", "", ""]], "+", [8, 7, 0], { notes: ["← 원래 수", "← 반 바퀴 돌린 수"] }), 320);
}

// ── 13~16번
function q13() {
  const c = P(104, 104), r = 82, V = Array.from({ length: 8 }, (_, i) => at(c, r, 22.5 + i * 45));
  const A = V[0], B = V[7];
  const side = Math.hypot(A.x - B.x, A.y - B.y);
  const sector = `<path d="M${f(A.x)} ${f(A.y)} L${f(A.x + 20)} ${f(A.y)} A20 20 0 0 0 ${f(at(A, 20, 135).x)} ${f(at(A, 20, 135).y)} Z" fill="${UT.purpleSoft}" stroke="${UT.purple}" stroke-width="1.6"/>`;
  return svg(310, 210, "정팔각형과 정사각형을 붙인 그림",
    poly(V, { fill: UT.yellowSoft, stroke: UT.orange }) + rect(A.x, A.y, side, side, { fill: UT.greenSoft, stroke: UT.green }) + sector, 300);
}
function q14() {
  const r = 62;
  return svg(310, 160, "정각을 가리키는 두 시계",
    text(30, 12, "(1) 5시", { size: 13, weight: 600, anchor: "start" }) + text(176, 12, "(2) 10시", { size: 13, weight: 600, anchor: "start" })
    + clock(P(78, 92), r, { hands: { hour: 5, minute: 0 } }) + clock(P(232, 92), r), 300);
}
function q15() {
  const r = 62;
  return svg(310, 160, "주어진 시각의 두 시계",
    text(30, 12, "(1) 9시 30분", { size: 13, weight: 600, anchor: "start" }) + text(176, 12, "(2) 7시 30분", { size: 13, weight: 600, anchor: "start" })
    + clock(P(78, 92), r, { hands: { hour: 9.5, minute: 30 } }) + clock(P(232, 92), r), 300);
}
function q16() {
  const O = P(150, 104), r = 92, th = Math.asin(4 / 7) / R, A = at(O, r, 180 - th), B = at(O, r, 180 + th), E = P(O.x + r, O.y);
  // 길이 표시는 바깥 곡선 점선(스킬 gfield-textbook-design 4-3): 반지름 OE는 위로, 현 AB는 원 바깥 왼쪽으로
  return svg(260, 210, "원 안에 그린 삼각형",
    circle(O, r, { stroke: UT.green }) + poly([O, A, B], { fill: UT.greenSoft, stroke: UT.green }) + seg(O, E, { stroke: UT.green, width: 1.4 })
    + dot(O, 3, UT.green) + lenArc(O, E, "7cm", { side: -1 }) + lenArc(A, B, "8cm", { bend: (A.x - (O.x - r)) + 22 }), 250);
}

// ── 17~20번
function q17() {
  const O = P(120, 110), a = 62, b = 86, r = Math.hypot(a, b);
  const TL = P(O.x - a, O.y - b), TR = P(O.x + a, O.y - b), BR = P(O.x + a, O.y + b), BL = P(O.x - a, O.y + b);
  return svg(240, 224, "원 안의 직사각형과 마름모",
    circle(O, r, { stroke: UT.green }) + poly([TL, TR, BR, BL], { stroke: UT.green, width: 1.3 })
    + poly([P(O.x, TL.y), P(TR.x, O.y), P(O.x, BL.y), P(TL.x, O.y)], { fill: UT.greenSoft, stroke: UT.green }), 230);
}
function q18() {
  const O = P(160, 20), L = 150, half = 12;
  const pt = (d) => at(O, L, -90 + d);
  const B1 = pt(-half), B2 = pt(half), B0 = pt(-3 * half), B3 = pt(3 * half);
  const arc = (c, p1, p2, rr) => {
    const a1 = Math.atan2(-(p1.y - c.y), p1.x - c.x) / R, a2 = Math.atan2(-(p2.y - c.y), p2.x - c.x) / R;
    let span = ((a2 - a1) % 360 + 360) % 360; let s0 = a1;
    if (span > 180) { s0 = a2; span = 360 - span; }
    const s = at(c, rr, s0), e = at(c, rr, s0 + span);
    return `<path d="M${f(s.x)} ${f(s.y)} A${rr} ${rr} 0 0 0 ${f(e.x)} ${f(e.y)}" fill="none" stroke="${UT.red}" stroke-width="1.5"/>`;
  };
  const dots = (p, ang) => [0, 1, 2].map((i) => dot(at(p, 10 + i * 7, ang), 1.7, INK)).join("");
  return svg(320, 190, "밑각이 78°인 이등변삼각형을 이어 붙인 그림",
    poly([O, B0, B1], { stroke: UT.green }) + poly([O, B1, B2], { fill: UT.greenSoft, stroke: UT.green }) + poly([O, B2, B3], { stroke: UT.green })
    + arc(B1, O, B2, 16) + arc(B2, O, B1, 16) + small(P(B1.x + 12, B1.y - 26), "78°", 12) + small(P(B2.x - 12, B2.y - 26), "78°", 12)
    + dots(lerp(O, B0, 0.62), 160) + dots(lerp(O, B3, 0.62), 20), 300);
}
function q19() {
  return svg(220, 200, "11시 40분을 가리키는 시계", clock(P(110, 100), 90, { hands: { hour: 11 + 40 / 60, minute: 40 } }), 200);
}
function q20() {
  const u = 60, h = u * Math.sqrt(3) / 2, x0 = 20, y0 = 10, rows = 3;
  let tri = "";
  for (let r = 0; r < rows; r += 1) {
    const top = y0 + r * h, bot = top + h, n = r + 1;
    const lx = x0 + (rows - 1 - r) * u / 2;
    for (let i = 0; i <= n; i += 1) tri += poly([P(lx + i * u, bot), P(lx + (i + 1) * u, bot), P(lx + i * u + u / 2, top)], { stroke: UT.green, width: 1.4 });
    for (let i = 0; i < n; i += 1) tri += poly([P(lx + i * u + u / 2, top), P(lx + (i + 1) * u + u / 2, top), P(lx + (i + 1) * u, bot)], { stroke: UT.green, width: 1.4 });
  }
  const outline = poly([P(x0 + 1.5 * u, y0), P(x0 + 2.5 * u, y0), P(x0 + 4 * u, y0 + 3 * h), P(x0, y0 + 3 * h)], { fill: UT.yellowSoft, stroke: "none" });
  return svg(280, 180, "작은 정삼각형으로 나눈 사다리꼴", outline + tri, 280);
}

// ── 21~25번
function q21() {
  const u = 40, x0 = 10, y0 = 10;
  let out = rect(x0, y0, 6 * u, 2 * u, { fill: UT.yellowSoft, stroke: UT.green });
  for (let i = 1; i < 6; i += 1) out += seg(P(x0 + i * u, y0), P(x0 + i * u, y0 + 2 * u), { stroke: UT.green, width: 1.4 });
  out += seg(P(x0, y0 + u), P(x0 + 6 * u, y0 + u), { stroke: UT.green, width: 1.4 });
  return svg(260, 100, "작은 직사각형으로 나눈 큰 직사각형", out, 260);
}
function q22() {
  const u = 44, x0 = 10, y0 = 10, X = (i) => x0 + i * u, Y = (j) => y0 + j * u, L = { stroke: UT.green, width: 1.5 };
  const parts = [
    [X(0), Y(0), X(4), Y(0)], [X(0), Y(4), X(4), Y(4)], [X(0), Y(0), X(0), Y(4)], [X(4), Y(0), X(4), Y(4)],
    [X(0), Y(1), X(4), Y(1)], [X(0), Y(2), X(4), Y(2)], [X(0), Y(3), X(2), Y(3)],
    [X(1), Y(1), X(1), Y(4)], [X(2), Y(0), X(2), Y(4)], [X(3), Y(0), X(3), Y(2)],
  ];
  return svg(200, 200, "여러 칸으로 나눈 정사각형",
    rect(X(0), Y(0), 4 * u, 4 * u, { fill: UT.yellowSoft, stroke: "none" }) + parts.map(([a, b, c, d]) => line(a, b, c, d, L)).join(""), 190);
}
function q23() {
  const c = P(110, 96), r = 82;
  return svg(220, 192, "원 위에 일정한 간격으로 찍힌 점 10개",
    circle(c, r, { stroke: UT.green }) + Array.from({ length: 10 }, (_, i) => dot(at(c, r, 90 + i * 36), 3.6, UT.green)).join(""), 210);
}
function q24() {
  const r = 66;
  return svg(310, 150, "거울에 비친 두 시계(빈 시계)", clock(P(78, 75), r, { numbers: false }) + clock(P(232, 75), r, { numbers: false }), 300);
}
function q25() {
  // 원문은 두 줄 네 칸이지만 한 칸(쪽의 4분의 1)에 들어가게 세 줄 세 칸(마지막 한 칸은 비움)으로 놓았다
  const g = 18, card = 4 * g + 16, gap = 12, rowH = card + 32;
  let out = "";
  for (let k = 0; k < 8; k += 1) {
    const cx = 2 + (k % 3) * (card + gap), cy = 2 + Math.floor(k / 3) * rowH;
    out += `<rect x="${cx}" y="${cy}" width="${card}" height="${card}" rx="8" fill="#fff" stroke="${UT.green}" stroke-width="1.3"/>`;
    const ox = cx + 8, oy = cy + 8;
    for (let i = 0; i < 5; i += 1) {
      out += line(ox, oy + i * g, ox + 4 * g, oy + i * g, { stroke: UT.soft, width: 0.9, dash: "3 3" }) + line(ox + i * g, oy, ox + i * g, oy + 4 * g, { stroke: UT.soft, width: 0.9, dash: "3 3" });
    }
    for (let i = 0; i < 5; i += 1) for (let j = 0; j < 5; j += 1) out += dot(P(ox + i * g, oy + j * g), 2.6, UT.green);
    out += box(cx + card / 2 - 24, cy + card + 5, 38, 22, { stroke: UT.box, width: 1.4, radius: 5 }) + text(cx + card / 2 + 26, cy + card + 16, "㎠", { size: 12, weight: 600 });
  }
  return svg(3 * card + 2 * gap + 4, 3 * rowH, "점 모눈 여덟 개와 넓이 칸", out, 300);
}

const Q = (number, prompt, figure, answer = { label: "답" }) => ({ number, prompt, figure, answer });
export const questions = [
  Q(1, "정사각형 모양의 색종이를 다음과 같이 3번 접었습니다. 접힌 색종이 위에 한 선분을 긋고 선분을 따라 자른 다음 색종이를 펼쳤더니 다음과 같은 모양이 되었습니다. 접힌 색종이 위에 그은 선분을 그려 보시오.", q1, null),
  Q(2, "정사각형 모양의 색종이를 다음과 같이 2번 접은 후, 그림과 같이 구멍을 뚫었습니다. 펼친 모양에서 뚫린 구멍은 모두 몇 개인지 구하시오.", q2, { label: "답", unit: "개" }),
  Q(3, "가연이가 거울에 비친 디지털 시계를 보니 시계가 다음과 같이 21시 51분 (오후 9시 51분)을 가리키고 있었습니다. 6분 후 거울에 비친 디지털 시계는 몇 시 몇 분을 가리키는지 구하시오.", q3),
  Q(4, "다음 식은 원래 두 자리 수와 오른쪽 거울에 비친 두 자리 수를 더한 것입니다. 빈칸에 알맞은 수를 구하시오.", q4, [{ label: "거울에 비친 수" }, { label: "더한 수" }]),
  Q(5, "다음과 같은 숫자 카드 10장이 있습니다. 서로 다른 2장을 뽑아 두 자리 수를 만들고, 이 수의 오른쪽에 거울을 놓고 비추었습니다. 이때, 원래의 두 자리 수와 거울에 비친 두 자리 수의 합과 차가 다음과 같이 주어졌습니다. 원래의 두 자리 수가 거울에 비친 두 자리 수보다 클 때, 원래의 두 자리 수를 구하시오.", q5, [{ label: "(1)" }, { label: "(2)" }]),
  Q(6, "다음 순서로 색종이를 접습니다. 접을 때마다 펀치로 구멍을 뚫는데, 2단계에서 펀치로 구멍을 2개 뚫고, 3단계에서 1개, 4단계에서 1개를 뚫었다고 합니다. 모두 원래 있던 구멍과는 겹치지 않게 뚫었다면, 색종이를 다시 펼쳤을 때 구멍은 모두 몇 개 뚫려 있는지 구하시오.", q6, { label: "답", unit: "개" }),
  Q(7, "다음은 동훈이가 공부를 시작할 때와 끝날 때 본 거울에 비친 시계입니다. 동훈이가 공부를 한 시간은 몇 시간 몇 분인지 구하시오.", q7),
  Q(8, "다음 도형을 주어진 순서대로 돌리고 뒤집은 모양을 그리시오.", q8, null),
  Q(9, "다음 식은 원래 두 자리 수와 그 수를 반 바퀴 돌려 읽은 수를 계산한 것입니다. 빈칸에 알맞은 수를 구하시오.", q9, [{ label: "돌린 수" }, { label: "계산한 수" }]),
  Q(10, "숫자판을 다음과 같이 움직였을 때, 똑바로 놓이는 수들의 합을 구하시오.", q10),
  Q(11, "다음과 같은 모양의 숫자들로 이루어진 두 자리 수가 쓰인 수 카드를 시계 방향으로 반 바퀴 돌려서 다시 읽습니다. 이때, 원래 두 자리 수와 반 바퀴 돌려서 읽은 수의 합과 차가 다음과 같이 주어졌을 때, 원래 두 자리 수를 구하시오. (단, 원래의 두 자리 수가 반 바퀴 돌려서 읽은 두 자리 수보다 큽니다.)", q11, [{ label: "(1)" }, { label: "(2)" }]),
  Q(12, "다음과 같은 모양의 숫자들로 이루어진 세 자리 수가 쓰인 수 카드를 시계 방향으로 반 바퀴 돌려서 다시 읽습니다. 이때, 원래 세 자리 수와 반 바퀴 돌려서 읽은 수의 합이 870일 때, 원래 세 자리 수를 구하시오. (단, 원래의 세 자리 수가 반 바퀴 돌려서 읽은 세 자리 수보다 큽니다.)", q12),
  Q(13, "다음 그림은 정사각형과 정팔각형을 붙여 만든 그림입니다. 표시된 부분의 각의 크기를 구하시오.", q13, { label: "답", unit: "°" }),
  Q(14, "다음 시계는 정각을 가리키고 있습니다. 시침과 분침이 이루는 작은 쪽의 각의 크기를 구하시오.", q14, [{ label: "(1)", unit: "°" }, { label: "(2)", unit: "°" }]),
  Q(15, "다음 시계의 주어진 시각을 보고 시침과 분침이 이루는 작은 쪽의 각의 크기를 구하시오.", q15, [{ label: "(1)", unit: "°" }, { label: "(2)", unit: "°" }]),
  Q(16, "다음은 반지름이 7cm인 원 안에 삼각형을 그린 것입니다. 색칠된 삼각형의 둘레를 구하시오.", q16, { label: "답", unit: "cm" }),
  Q(17, "다음 그림은 지름이 14cm인 원 안에 직사각형을 그리고, 직사각형의 각 변의 중점을 연결해 마름모를 그린 것입니다. 색칠된 마름모의 둘레를 구하시오.", q17, { label: "답", unit: "cm" }),
  Q(18, "다음 삼각형들은 밑각의 크기가 78°인 이등변삼각형입니다. 그림과 같이 꼭짓점을 중심으로 이등변삼각형의 변끼리 이어 붙여 나가면, 만들어지는 정다각형의 이름을 말하시오.", q18),
  Q(19, "다음 시계의 주어진 시각을 보고 시침과 분침이 이루는 작은 쪽의 각의 크기를 구하시오.", q19, { label: "답", unit: "°" }),
  Q(20, "다음 그림은 사다리꼴을 같은 크기의 작은 정삼각형 조각으로 나눈 것입니다. 선을 따라 그릴 수 있는 크고 작은 정삼각형의 개수를 구하시오.", q20, { label: "답", unit: "개" }),
  Q(21, "다음 그림은 큰 직사각형을 같은 크기의 작은 직사각형 조각으로 나눈 것입니다. 선을 따라 그릴 수 있는 크고 작은 직사각형의 개수를 구하시오.", q21, { label: "답", unit: "개" }),
  Q(22, "다음 그림에서 찾을 수 있는 크고 작은 정사각형의 개수는 모두 몇 개인지 구하시오.", q22, { label: "답", unit: "개" }),
  Q(23, "원 위에 10개의 점이 일정한 간격으로 찍혀 있을 때, 점을 이어 만들 수 있는 이등변삼각형의 개수를 구하시오.", q23, { label: "답", unit: "개" }),
  Q(24, "일요일 오후에 준오는 가족들과 영화관에 가서 영화를 보았습니다. 영화가 끝난 후 거울에 비친 시계를 보았더니 영화가 시작할 때와 똑같은 시각이었습니다. 영화를 본 시간이 1시간 50분이었을 때, 영화가 시작한 시각은 몇 시 몇 분인지 구하시오.", q24),
  Q(25, "다음 한 변의 길이가 1cm인 모눈 위에 점과 점을 이어 그릴 수 있는 정사각형을 모두 그리고 정사각형의 넓이를 각각 구하시오.", q25, null),
];
