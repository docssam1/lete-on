// 2과정 G3 「정육면체와 각·넓이」 권별 테스트 — 드라이브 원문(2G3 N30 테스트, 25문항)을 우리 시험지 꼴로 다시 짠 것(원장 2026-11-15).
// 원문 문항을 본책(도형 움직이기 · 주사위와 쌓기나무 · 시계와 각 · 평면도형의 넓이) 단원과 내용으로 대조해 G3 것임을 확인했다.
// 글·수·배치는 원문 그대로, 그림은 우리 색표(워밍업 그림 색)로 다시 그렸다. 디지털 숫자는 글꼴이 아니라 일곱 막대(SVG 선)로 그린다.
// 1번 문장의 돌리기 기호(그림 기호)는 글 속에 그릴 수 없어 「시계 방향으로 반의 반 바퀴씩」처럼 말로 쓰고, 기호는 그림에 그대로 두었다.
// 정답은 여기 두지 않는다(비공개 자리에만).
import { UT, text, svg, line, box, cell, blockArrow, arrow, ringed, mark } from "../selection-test-originals/kit.js?v=20261114a";
import { lenArc } from "./len-arc.js?v=20261124a";

export const perPage = 4;
export const meta = { course: "2과정", book: "G3", title: "정육면체와 각·넓이" };

const R = Math.PI / 180;
const f = (n) => (Math.round(n * 10) / 10).toString();
const P = (x, y) => ({ x, y });
const at = (c, r, deg) => P(c.x + r * Math.cos(deg * R), c.y - r * Math.sin(deg * R));
const lerp = (a, b, t) => P(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
const dir = (a, b) => Math.atan2(-(b.y - a.y), b.x - a.x) / R;
const INK = UT.ink;
const poly = (pts, { fill = "none", stroke = INK, width = 1.6, dash = "" } = {}) =>
  `<polygon points="${pts.map((p) => `${f(p.x)},${f(p.y)}`).join(" ")}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const seg = (a, b, opts) => line(f(a.x), f(a.y), f(b.x), f(b.y), opts);
const small = (p, value, size = 12, fill = INK) => text(f(p.x), f(p.y), value, { size, weight: 600, fill });
const circle = (c, r, { fill = "none", stroke = INK, width = 1.6, dash = "" } = {}) =>
  `<circle cx="${f(c.x)}" cy="${f(c.y)}" r="${f(r)}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const rect = (x, y, w, h, opts) => poly([P(x, y), P(x + w, y), P(x + w, y + h), P(x, y + h)], opts);
const tag = (x, y, value) => text(x, y, value, { size: 12, weight: 600, anchor: "start" });
function meet(a1, a2, b1, b2) {
  const d = (a2.x - a1.x) * (b2.y - b1.y) - (a2.y - a1.y) * (b2.x - b1.x);
  const t = ((b1.x - a1.x) * (b2.y - b1.y) - (b1.y - a1.y) * (b2.x - b1.x)) / d;
  return lerp(a1, a2, t);
}
function foot(p, a, b) {
  const dx = b.x - a.x, dy = b.y - a.y, t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy);
  return P(a.x + t * dx, a.y + t * dy);
}
// 꼭짓점 c에서 c→p1, c→p2 사이 작은 쪽 각에 호와 글자. label 이 "㉠"·"㉡"이면 원 표지
function arcAt(c, p1, p2, r, label = "", { color = UT.red, lr = r + 13, size = 11.5 } = {}) {
  let a1 = dir(c, p1), a2 = dir(c, p2);
  let span = ((a2 - a1) % 360 + 360) % 360;
  if (span > 180) { [a1, a2] = [a2, a1]; span = 360 - span; }
  const s = at(c, r, a1), e = at(c, r, a1 + span);
  const arc = `<path d="M${f(s.x)} ${f(s.y)} A${r} ${r} 0 0 0 ${f(e.x)} ${f(e.y)}" fill="none" stroke="${color}" stroke-width="1.6"/>`;
  if (!label) return arc;
  const m = at(c, lr, a1 + span / 2);
  return arc + (label === "㉠" || label === "㉡" ? mark(m.x, m.y, label, { r: 9, size: 11 }) : small(m, label, size));
}
// 직각 표시
function rightAt(c, p1, p2, s = 8) {
  const u = (p) => { const l = Math.hypot(p.x - c.x, p.y - c.y); return P((p.x - c.x) / l, (p.y - c.y) / l); };
  const a = u(p1), b = u(p2);
  const q1 = P(c.x + a.x * s, c.y + a.y * s), q2 = P(c.x + (a.x + b.x) * s, c.y + (a.y + b.y) * s), q3 = P(c.x + b.x * s, c.y + b.y * s);
  return `<polyline points="${f(q1.x)},${f(q1.y)} ${f(q2.x)},${f(q2.y)} ${f(q3.x)},${f(q3.y)}" fill="none" stroke="${INK}" stroke-width="1.1"/>`;
}
// 길이 표시: a~b 바깥 곡선 점선 + 끊은 자리에 글자(스킬 gfield-textbook-design 4-3, 흰 판으로 덮지 않음).
// bulge 부호 = 휘는 쪽(+ = a→b 진행 방향의 (−dy, dx) 쪽), far = 더 띄울 만큼(전체 길이를 부분 길이보다 바깥에). boxed = 빈 답 칸 + ㎝.
const DIM = "#9a9183";
const dim = (a, b, value, bulge = 14, { boxed = false, far = 0 } = {}) => lenArc(a, b, value, { side: bulge < 0 ? -1 : 1, far, blank: boxed, unit: "㎝" });

// ── 디지털 숫자: 일곱 막대(a 위 · b 오른쪽 위 · c 오른쪽 아래 · d 아래 · e 왼쪽 아래 · f 왼쪽 위 · g 가운데)
const SEGS = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcdfg" };
function seg7(x, y, w, h, digit, { color = UT.green, t = Math.max(2.4, w * 0.17) } = {}) {
  const g = t * 0.85, L = x + t / 2, Rr = x + w - t / 2, T = y + t / 2, B = y + h - t / 2, M = (T + B) / 2;
  const s = { a: [L + g, T, Rr - g, T], b: [Rr, T + g, Rr, M - g], c: [Rr, M + g, Rr, B - g], d: [L + g, B, Rr - g, B], e: [L, M + g, L, B - g], f: [L, T + g, L, M - g], g: [L + g, M, Rr - g, M] };
  return [...SEGS[digit]].map((k) => line(...s[k].map(f), { stroke: color, width: f(t) })).join("");
}
const segCell = (x, y, w, h, digit = null, opts = {}) => cell(x, y, w, h) + (digit == null ? "" : seg7(x + w * 0.27, y + h * 0.17, w * 0.46, h * 0.66, digit, opts));
// 0~9 디지털 숫자 카드 한 줄
function segCards(width, y, size = 26, gap = 4) {
  const x0 = (width - (10 * size + 9 * gap)) / 2;
  return Array.from({ length: 10 }, (_, d) => {
    const x = x0 + d * (size + gap);
    return box(x, y, size, size * 1.18, { fill: UT.card, stroke: UT.cardLine, width: 1.6 }) + seg7(x + size * 0.28, y + size * 0.2, size * 0.44, size * 0.78, d, { color: INK, t: 2.4 });
  }).join("");
}
// 둥근 틀 안의 0~9 한 줄. seg 면 디지털 숫자, 아니면 글자(1 은 막대 하나)
function digitStrip(width, y, { seg = false } = {}) {
  const w = 268, x0 = (width - w) / 2, h = 40, step = (w - 24) / 10;
  let out = `<rect x="${f(x0)}" y="${y}" width="${w}" height="${h}" rx="9" fill="#fdfbf5" stroke="${UT.soft}" stroke-width="1.5"/>`;
  for (let d = 0; d < 10; d += 1) {
    const cx = x0 + 12 + step * (d + 0.5);
    if (seg) out += d === 1 ? seg7(cx - 7, y + 8, 9, h - 16, 1, { t: 3.6 }) : seg7(cx - 7, y + 8, 14, h - 16, d, { t: 3.6 });
    else out += d === 1 ? line(f(cx), y + 13, f(cx), y + h - 13, { stroke: INK, width: 2.6 }) : text(f(cx), y + h / 2 + 1, String(d), { size: 19, weight: 800 });
  }
  return out;
}
// 세로셈: rows = 위 두 줄 칸 수, op, result(아래 줄 수), notes(오른쪽 설명)
function column(x, y, s, n, op, result, notes = []) {
  let out = "";
  for (let r = 0; r < 2; r += 1) for (let i = 0; i < n; i += 1) out += cell(x + i * s, y + r * (s + 8), s, s);
  out += text(x - 16, y + s + 8 + s / 2, op, { size: 16 });
  const ly = y + 2 * s + 8 + 10;
  out += line(x - 30, ly, x + n * s + 6, ly, { stroke: UT.line, width: 1.4 });
  result.forEach((v, i) => { out += cell(x + i * s, ly + 8, s, s, String(v), { size: 15 }); });
  notes.forEach((note, r) => { out += tag(x + n * s + 8, y + r * (s + 8) + s / 2, note); });
  return out;
}

// ── 시계: hands = { hour: 시(소수), minute: 분 } · numbers false 면 숫자 없이 눈금만
function clock(c, r, { hands = null, numbers = true } = {}) {
  let out = circle(c, r, { fill: "#fff", stroke: UT.soft, width: r * 0.1 }) + circle(c, r * 1.05, { stroke: UT.line, width: 1 });
  for (let i = 0; i < 60; i += 1) {
    const big = i % 5 === 0, a = 90 - i * 6;
    out += seg(at(c, r * 0.94, a), at(c, r * (big ? 0.82 : 0.88), a), { stroke: big ? INK : UT.line, width: big ? 1.4 : 0.8 });
  }
  if (numbers) for (let h = 1; h <= 12; h += 1) { const p = at(c, r * 0.68, 90 - h * 30); out += text(f(p.x), f(p.y), String(h), { size: r * 0.2, weight: 600 }); }
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
function flipH(c, s = 18) {
  return seg(P(c.x - s * 1.3, c.y), P(c.x + s * 1.3, c.y), { stroke: "#777", width: 1.8, dash: "4 3" })
    + `<path d="M${f(c.x + 2)} ${f(c.y + s)} A${f(s * 0.42)} ${f(s)} 0 1 1 ${f(c.x + s * 0.4)} ${f(c.y - s * 0.6)}" fill="none" stroke="${MOTION}" stroke-width="1.8"/>` + arrowHead(P(c.x + s * 0.4, c.y - s * 0.6), 60);
}
// 왼쪽 오른쪽으로 뒤집기(세로 점선 축)
const flipV = (c, s = 18) => `<g transform="rotate(-90 ${f(c.x)} ${f(c.y)})">${flipH(c, s)}</g>`;
// 시계 방향 돌리기: quarter 1 = 반의 반 바퀴, 2 = 반 바퀴
function turn(c, r = 17, quarter = 1) {
  const end = at(c, r, 90 - 90 * quarter), top = at(c, r, 90);
  const arc = `<path d="M${f(top.x)} ${f(top.y)} A${r} ${r} 0 0 1 ${f(end.x)} ${f(end.y)}" fill="none" stroke="${MOTION}" stroke-width="1.8"/>`;
  const rest = circle(c, r, { fill: "#fdfbf5", stroke: "#aaa", width: 1.2 }) + seg(P(c.x - r, c.y), P(c.x + r, c.y), { stroke: "#ccc", width: 1, dash: "3 3" }) + seg(P(c.x, c.y - r), P(c.x, c.y + r), { stroke: "#ccc", width: 1, dash: "3 3" });
  return rest + seg(c, top, { stroke: MOTION, width: 1.8 }) + seg(c, end, { stroke: MOTION, width: 1.8 }) + arc + arrowHead(end, quarter === 1 ? 90 : 180);
}
function dashGrid(x, y, cols, rows, s) {
  let out = "";
  for (let i = 0; i <= cols; i += 1) out += line(x + i * s, y, x + i * s, y + rows * s, { stroke: "#bbb", width: 1, dash: "4 3" });
  for (let j = 0; j <= rows; j += 1) out += line(x, y + j * s, x + cols * s, y + j * s, { stroke: "#bbb", width: 1, dash: "4 3" });
  return out;
}

// ── 주사위(빗면 그림): (x, y) = 앞면 왼쪽 위, a = 한 모서리, d = 뒤로 들어간 깊이
const DIE = { front: "#fff", top: "#fdfaf1", side: "#e9e1cf", line: UT.line, pip: UT.red };
function die(x, y, a, d = a * 0.32, { top = "", front = "", side = "", size = 14, tops = DIE.top } = {}) {
  const st = { stroke: DIE.line, width: 1.4 };
  let out = poly([P(x, y), P(x + d, y - d), P(x + a + d, y - d), P(x + a, y)], { fill: tops, ...st })
    + poly([P(x + a, y), P(x + a + d, y - d), P(x + a + d, y + a - d), P(x + a, y + a)], { fill: DIE.side, ...st })
    + rect(x, y, a, a, { fill: DIE.front, ...st });
  if (top) out += text(f(x + a / 2 + d / 2), f(y - d / 2), top, { size: Math.min(size * 0.8, d * 0.95), weight: 500 });
  if (front) out += text(f(x + a / 2), f(y + a / 2), front, { size, weight: 500 });
  if (side) {
    const chars = [...side], cx = x + a + d / 2, cy = y + a / 2 - d / 2, gap = size * 0.82;
    out += chars.map((ch, i) => text(f(cx), f(cy + (i - (chars.length - 1) / 2) * gap), ch, { size: size * 0.78, weight: 500 })).join("");
  }
  return out;
}
// 윗면의 눈: spots = [[u, v]…] (u 왼→오, v 앞→뒤)
const topPips = (x, y, a, d, spots, r = a * 0.1) => spots.map(([u, v]) => `<ellipse cx="${f(x + u * a + v * d)}" cy="${f(y - v * d)}" rx="${f(r)}" ry="${f(r * 0.62)}" fill="${DIE.pip}"/>`).join("");

// ── 1~4번
function q1() {
  const s = 15, gw = 4 * s, gap = 34, y = 8, x0 = 6;
  const gx = (i) => x0 + i * (gw + gap);
  const shape = [P(0, 1), P(4, 1), P(4, 4), P(3, 4), P(3, 2), P(0, 2)].map((p) => P(gx(3) + p.x * s, y + p.y * s));
  let out = [0, 1, 2, 3].map((i) => dashGrid(gx(i), y, 4, 4, s)).join("") + poly(shape, { fill: UT.yellowSoft, stroke: UT.orange, width: 2.4 });
  const mid = (i) => gx(i) + gw + gap / 2;
  [0, 1, 2].forEach((i) => { out += blockArrow(mid(i) - 10, y + 34, mid(i) + 10, y + 34, { shaft: 6, head: 13, headLen: 8 }); });
  out += turn(P(mid(0), y + 66), 13, 1) + flipV(P(mid(1), y + 66), 12) + turn(P(mid(2), y + 66), 13, 2);
  out += text(gx(0) + gw / 2, 106, "처음 모양", { size: 12, weight: 600 }) + text(mid(0), 106, "17번", { size: 12, weight: 600 })
    + text(mid(1), 106, "16번", { size: 12, weight: 600 }) + text(mid(2), 106, "15번", { size: 12, weight: 600 });
  return svg(352, 118, "돌리고 뒤집은 순서와 마지막 모양", out, 330);
}
function q2() {
  const y = 64, h = 44, t = 5.2, col = UT.green;
  const plus = (cx) => line(cx - 9, y + h / 2, cx + 9, y + h / 2, { stroke: col, width: t }) + line(cx, y + h / 2 - 9, cx, y + h / 2 + 9, { stroke: col, width: t });
  const tri = poly([P(196, y + h), P(226, y + h), P(211, y)], { fill: "#fff", stroke: col, width: 1.8 });
  const body = seg7(34, y, 10, h, 1, { t }) + seg7(50, y, 26, h, 6, { t }) + plus(98)
    + seg7(120, y, 26, h, 8, { t }) + seg7(150, y, 10, h, 1, { t }) + plus(180) + tri + seg7(232, y, 26, h, 8, { t });
  return svg(290, 176, "마주 보고 읽는 식 16 + 81 + △8",
    ringed(141, 12, "2") + blockArrow(141, 26, 141, 56, { shaft: 9, head: 18, headLen: 11 })
    + body + blockArrow(141, 146, 141, 116, { shaft: 9, head: 18, headLen: 11 }) + ringed(141, 163, "1"), 290);
}
function q3() {
  const s = 30, x = 112;
  return svg(320, 300, "숫자 카드와 두 세로셈",
    segCards(320, 4) + tag(16, 58, "(1)") + column(x, 50, s, 2, "+", [9, 1], ["← 원래 수", "← 반 바퀴 돌린 수"])
    + tag(16, 184, "(2)") + column(x, 176, s, 2, "−", [6, 3], ["← 원래 수", "← 반 바퀴 돌린 수"]), 320);
}
function q4() {
  const s = 32;
  return svg(320, 200, "디지털 숫자와 세 자리 수의 덧셈",
    digitStrip(320, 4, { seg: true }) + column(84, 58, s, 3, "+", [9, 7, 1], ["← 원래 수", "← 180° 돌린 수"]), 320);
}

// ── 5~8번
function q5() {
  return svg(320, 52, "숫자 카드 0부터 9까지", digitStrip(320, 6), 320);
}
function q6() {
  const a = 34, d = 12;
  const tower = (x, n, spots) => {
    let out = "";
    const top = 40 + (5 - n) * a;
    for (let i = n - 1; i >= 0; i -= 1) out += die(x, top + i * a, a, d);
    return out + topPips(x, top, a, d, spots);
  };
  return svg(280, 232, "주사위를 쌓은 두 모양",
    tag(20, 12, "(1)") + tag(160, 12, "(2)")
    + tower(56, 4, [[0.27, 0.3], [0.73, 0.3], [0.27, 0.72], [0.73, 0.72]]) + tower(196, 5, [[0.28, 0.32], [0.72, 0.7]]), 260);
}
function q7() {
  const a = 34, d = 11, x0 = 16;
  const row = (y, n) => Array.from({ length: n }, (_, i) => die(x0 + i * a, y, a, d)).join("");
  return svg(200, 186, "주사위를 2개, 3개, 4개 붙여 나가는 모양",
    row(18, 2) + row(74, 3) + row(130, 4)
    + [0, 1, 2].map((i) => `<circle cx="80" cy="${172 + i * 5}" r="1.6" fill="${INK}"/>`).join(""), 200);
}
function q8() {
  const a = 54, d = 16, y = 26;
  return svg(320, 196, "이름이 쓰인 상자를 세 방향에서 본 모양과 바닥에 놓인 상자",
    `<rect x="6" y="6" width="308" height="94" rx="14" fill="#fdfbf5" stroke="${UT.soft}" stroke-width="1.5"/>`
    + die(22, y, a, d, { top: "다현", front: "준교", side: "승혁" }) + die(122, y, a, d, { top: "재욱", front: "상준", side: "지후" })
    + die(222, y, a, d, { top: "승혁", front: "상준", side: "다현" }) + die(132, 132, a, d, { top: "다현" }), 320);
}

// ── 9~12번
function q9() {
  const g = 48, ox = 74, oy = 52, dx = 18, dy = 24;
  const cellAt = (c, r) => rect(ox + c * g, oy + r * g, g, g, { fill: "#fff", stroke: UT.green, width: 1.5 });
  const path = [[1, 0], [1, 1], [2, 1], [2, 2], [3, 2]];
  let out = cellAt(0, 0) + path.map(([c, r]) => cellAt(c, r)).join("");
  // 주사위: 바닥 칸 (0,0) 위, 윗면은 위왼쪽으로 (dx, dy) 만큼 비켜 보인다
  const tx = ox - dx, ty = oy - dy;
  const st = { stroke: UT.green, width: 1.5 };
  const TR = P(tx + g, ty), TBR = P(tx + g, ty + g), TBL = P(tx, ty + g), BR = P(ox + g, oy), BBR = P(ox + g, oy + g), BBL = P(ox, oy + g);
  out += poly([TR, BR, BBR, TBR], { fill: DIE.side, ...st }) + poly([TBL, TBR, BBR, BBL], { fill: DIE.side, ...st }) + rect(tx, ty, g, g, { fill: "#fff", ...st });
  const pip = (p, rx = 3.2, ry = 3.2) => `<ellipse cx="${f(p.x)}" cy="${f(p.y)}" rx="${rx}" ry="${ry}" fill="${DIE.pip}"/>`;
  const onRight = (u, v) => lerp(lerp(TR, TBR, v), lerp(BR, BBR, v), u);
  const onFront = (sx, u) => lerp(lerp(TBL, TBR, sx), lerp(BBL, BBR, sx), u);
  out += pip(P(tx + g * 0.78, ty + g * 0.22), 3.8, 3.8) + pip(P(tx + g * 0.22, ty + g * 0.78), 3.8, 3.8);
  for (const u of [0.32, 0.68]) for (const v of [0.22, 0.5, 0.78]) out += pip(onRight(u, v), 2, 3);
  out += [[0.22, 0.28], [0.5, 0.5], [0.78, 0.72]].map(([sx, u]) => pip(onFront(sx, u), 3, 2)).join("");
  const right = (c, r) => arrow(ox + c * g - 10, oy + r * g + g / 2, ox + c * g + 10, oy + r * g + g / 2, { stroke: UT.red, width: 1.8, head: 6 });
  const down = (c, r) => arrow(ox + c * g + g / 2, oy + r * g - 10, ox + c * g + g / 2, oy + r * g + 10, { stroke: UT.red, width: 1.8, head: 6 });
  out += right(1, 0) + down(1, 1) + right(2, 1) + down(2, 2) + right(3, 2);
  return svg(280, 200, "주사위를 굴려 지나갈 빈칸", out, 270);
}
function q10() {
  const a = 40, d = 13, s = 26;
  const net = (x0, y0, cells) => cells.map(([c, r, v]) => cell(x0 + c * s, y0 + r * s, s, s, v || "", { size: 15, stroke: UT.box, width: 1.4 })).join("");
  const frame = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#fdfbf5" stroke="${UT.soft}" stroke-width="1.4"/>`;
  return svg(320, 196, "두 방향에서 본 주사위와 빈 전개도 두 개",
    die(92, 20, a, d, { top: "1", front: "2", side: "3", size: 20 }) + die(180, 20, a, d, { top: "4", front: "5", side: "6", size: 20 })
    + tag(4, 84, "(1)") + frame(4, 94, 130, 98) + net(17, 104, [[1, 0, "4"], [0, 1, "1"], [1, 1], [2, 1], [3, 1], [0, 2]])
    + tag(146, 84, "(2)") + frame(146, 94, 170, 98) + net(166, 117, [[0, 0], [1, 0], [2, 0, "1"], [2, 1], [3, 1], [4, 1, "3"]]), 320);
}
function q11() {
  const s = 20, y = 14;
  const view = (x0, cells) => cells.map(([c, r]) => rect(x0 + c * s, y + r * s, s, s, { fill: UT.cubeTop, stroke: UT.cubeLine, width: 1.3 })).join("");
  const topV = [[0, 0], [1, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]];
  const sideV = [[1, 0], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]];
  return svg(320, 110, "위, 앞, 오른쪽 옆에서 본 모양",
    `<rect x="6" y="4" width="308" height="102" rx="14" fill="#fdfbf5" stroke="${UT.soft}" stroke-width="1.5"/>`
    + view(30, topV) + view(130, topV) + view(230, sideV)
    + text(60, 92, "위", { size: 13, weight: 600 }) + text(160, 92, "앞", { size: 13, weight: 600 }) + text(260, 92, "오른쪽 옆", { size: 13, weight: 600 }), 320);
}
function q12() {
  const k = 0.3, o = P(16, 6), Q = (x, y) => P(o.x + x * k, o.y + y * k);
  const T = Q(503, 15), L = Q(137, 203), Rr = Q(820, 203), BR = Q(735, 770), A = Q(225, 672), B = Q(343, 720);
  const st = { stroke: UT.green, width: 1.6 };
  return svg(290, 248, "꼭짓점 하나가 잘린 별 모양",
    seg(L, Rr, st) + seg(L, BR, st) + seg(T, BR, st) + seg(T, A, st) + seg(Rr, B, st) + seg(A, B, st)
    + arcAt(T, A, BR, 14, "30°", { lr: 40, size: 10.5 }) + arcAt(L, Rr, BR, 16, "45°", { lr: 32 }) + arcAt(Rr, L, B, 16, "50°", { lr: 32 })
    + arcAt(BR, T, L, 14, "40°", { lr: 40, size: 10.5 }) + arcAt(A, T, B, 12) + arcAt(B, A, Rr, 12)
    + mark(A.x + 20, A.y - 15, "㉠", { r: 9, size: 11 }) + mark(B.x + 7, B.y - 25, "㉡", { r: 9, size: 11 }), 280);
}

// ── 13~16번
function q13() {
  const O = P(166, 116), r = 96, st = { stroke: UT.green, width: 1.5 };
  const pent = Array.from({ length: 5 }, (_, i) => at(O, r, 90 + 72 * i));
  const sq = [90, 0, 270, 180].map((deg) => at(O, r, deg));
  const N = sq[0], W = sq[3];
  const X = meet(W, N, pent[1], pent[2]);
  const a1 = at(N, 34, dir(N, pent[1]) / 2 + dir(N, W) / 2);
  return svg(300, 226, "원 안에 그린 정오각형과 정사각형",
    circle(O, r, st) + poly(pent, st) + poly(sq, st)
    + arcAt(N, pent[1], W, 30, "", { color: UT.red })
    + arrow(a1.x + 34, a1.y + 18, a1.x + 3, a1.y + 2, { stroke: UT.red, width: 1.4, head: 6 }) + mark(a1.x + 46, a1.y + 24, "㉠", { r: 9, size: 11 })
    + arcAt(X, W, pent[2], 16, "", { color: UT.red })
    + arrow(X.x - 10, X.y + 28, X.x - 40, X.y + 26, { stroke: UT.red, width: 1.4, head: 6 }) + mark(X.x - 54, X.y + 20, "㉡", { r: 9, size: 11 }), 280);
}
function q14() {
  const yA = 40, yB = 140, d1 = P(Math.cos(130 * R), -Math.sin(130 * R)), d2 = P(Math.cos(96 * R), -Math.sin(96 * R));
  const b1 = P(160, yB), a1 = P(b1.x + d1.x * (yB - yA) / -d1.y, yA), top1 = P(b1.x + d1.x * (yB - 18) / -d1.y, 18);
  const M = P(b1.x - d1.x * 45.7, b1.y - d1.y * 45.7);
  const a2 = P(M.x + d2.x * (M.y - yA) / -d2.y, yA), top2 = P(M.x + d2.x * (M.y - 18) / -d2.y, 18);
  const st = { stroke: UT.green, width: 1.5 };
  return svg(290, 200, "평행한 두 직선과 두 직선",
    seg(P(36, yA), P(282, yA), st) + seg(P(36, yB), P(282, yB), st) + seg(top1, M, st) + seg(top2, M, st)
    + text(22, yA, "A", { size: 14 }) + text(22, yB, "B", { size: 14 })
    + arcAt(a1, P(a1.x - 30, yA), top1, 14, "㉠", { lr: 28 }) + arcAt(a2, P(a2.x - 30, yA), top2, 14, "84°", { lr: 28 })
    + arcAt(b1, P(b1.x + 30, yB), top1, 13, "130°", { lr: 28 }) + arcAt(M, b1, a2, 18)
    + arrow(M.x - 34, M.y + 2, M.x - 6, M.y - 14, { stroke: UT.red, width: 1.4, head: 6 }) + mark(M.x - 44, M.y + 6, "㉡", { r: 9, size: 11 }), 280);
}
function q15() {
  const B = P(30, 176), C = P(280, 176), dc = P(Math.cos(-60 * R), -Math.sin(-60 * R));
  const D = P(C.x - dc.x * (C.y - 34) / dc.y, 34), A = P(52, 34);
  const E = meet(D, C, B, at(B, 100, 13));
  const st = { stroke: UT.green, width: 1.6 };
  const nm = (p, v, dx, dy) => text(f(p.x + dx), f(p.y + dy), v, { size: 14 });
  return svg(300, 200, "사다리꼴 ABCD와 선분 BE",
    poly([A, B, C, D], { fill: UT.greenSoft, ...st }) + seg(B, E, st)
    + arcAt(D, A, C, 14, "120°", { lr: 30 }) + arcAt(E, B, C, 14, "107°", { lr: 30 })
    + arcAt(B, C, E, 40) + arrow(B.x + 50, B.y - 44, B.x + 44, B.y - 10, { stroke: UT.red, width: 1.4, head: 6 }) + mark(B.x + 50, B.y - 56, "㉠", { r: 9, size: 11 })
    + nm(A, "A", -4, -12) + nm(D, "D", 4, -12) + nm(B, "B", -12, 6) + nm(C, "C", 12, 6) + nm(E, "E", 12, -8), 290);
}
function q16() {
  const r = 62;
  return svg(310, 160, "6시 40분과 8시 35분을 가리키는 두 시계",
    text(30, 12, "(1) 6시 40분", { size: 13, weight: 600, anchor: "start" }) + text(176, 12, "(2) 8시 35분", { size: 13, weight: 600, anchor: "start" })
    + clock(P(78, 92), r, { hands: { hour: 6 + 40 / 60, minute: 40 } }) + clock(P(232, 92), r, { hands: { hour: 8 + 35 / 60, minute: 35 } }), 300);
}

// ── 17~20번
function q17() {
  const c = P(118, 110), r = 92;
  const hourDeg = 162.5, minDeg = 240, markDeg = 150; // 바닥에 돌아 놓인 시계(12가 위가 아님)
  const H = at(c, r * 0.5, 90 - hourDeg), Mn = at(c, r * 0.78, 90 - minDeg), K = at(c, r * 0.86, 90 - markDeg);
  const small1 = at(c, 52, 90 - (hourDeg + markDeg) / 2);
  return svg(300, 210, "숫자가 없는 시계와 두 바늘이 이루는 각",
    clock(c, r, { numbers: false, hands: { hour: hourDeg / 30, minute: minDeg / 6 } })
    + seg(c, K, { stroke: "#999", width: 1.1, dash: "4 3" })
    + arcAt(c, Mn, H, 30, "77.5°", { lr: 48, color: UT.line, size: 13 }) + arcAt(c, H, K, 46, "", { color: UT.red })
    + `<path d="M${f(small1.x + 4)} ${f(small1.y + 4)} Q${f(small1.x + 50)} ${f(small1.y + 50)} ${f(242)} ${f(small1.y + 28)}" fill="none" stroke="${UT.red}" stroke-width="1.3"/>`
    + text(246, small1.y + 28, "표시된 각", { size: 12, weight: 700, anchor: "start" }), 300);
}
function q18() {
  const x = 40, y = 26, s = 150, A = P(x, y), B = P(x, y + s), C = P(x + s, y + s), D = P(x + s, y);
  const K = at(B, s, 45), Fp = P(K.x, B.y);
  const st = { stroke: INK, width: 1.4 };
  const nm = (p, v, dx, dy) => text(f(p.x + dx), f(p.y + dy), v, { size: 14 });
  return svg(240, 200, "정사각형 안의 사분원과 색칠한 삼각형",
    poly([B, K, Fp], { fill: "rgba(255,169,77,.55)", stroke: "none" }) + rect(x, y, s, s, st)
    + `<path d="M${f(A.x)} ${f(A.y)} A${s} ${s} 0 0 1 ${f(C.x)} ${f(C.y)}" fill="none" stroke="${INK}" stroke-width="1.4"/>`
    + seg(B, D, st) + seg(K, Fp, st) + poly([B, K, Fp], { stroke: UT.orange, width: 1.4 })
    + dim(B, A, "8㎝", -12) + nm(A, "A", -2, -13) + nm(D, "D", 4, -13) + nm(B, "B", -2, 14) + nm(C, "C", 4, 14), 230);
}
function q19() {
  const k = 0.36;
  const para = (pts, o, { leftLabel, baseLabel, height, perpT, boxedLeft = false, boxedBase = false }) => {
    const [BL, BR, TR, TL] = pts.map(([x, y]) => P(o.x + x * k, o.y + y * k));
    const Hf = P(TR.x, BL.y);
    const p0 = lerp(BL, TL, perpT), p1 = foot(p0, BR, TR);
    const st = { stroke: UT.green, width: 1.5 };
    return poly([BL, BR, TR, TL], { fill: UT.greenSoft, ...st }) + seg(BR, Hf, { stroke: DIM, width: 1, dash: "3 3" }) + seg(TR, Hf, { stroke: DIM, width: 1, dash: "3 3" })
      + rightAt(Hf, TR, BL, 7) + seg(p0, p1, { stroke: DIM, width: 1.1, dash: "3 3" }) + rightAt(p1, p0, TR, 6)
      + (boxedLeft ? dim(BL, TL, "", -16, { boxed: true }) : dim(BL, TL, leftLabel, -12))
      + (boxedBase ? dim(BL, BR, "", 16, { boxed: true }) : dim(BL, BR, baseLabel, 10))
      + dim(TR, Hf, height, -12) + dim(p0, p1, "3㎝", -10);
  };
  return svg(320, 290, "두 평행사변형",
    tag(6, 12, "(1)") + para([[115, 260], [375, 260], [635, 58], [375, 58]], P(-16, 10), { leftLabel: "12㎝", height: "6㎝", perpT: 0.82, boxedBase: true })
    + tag(6, 160, "(2)") + para([[85, 885], [318, 885], [795, 618], [557, 618]], P(-16, -60), { baseLabel: "5㎝", height: "9㎝", perpT: 0.66, boxedLeft: true }), 320);
}
function q20() {
  const k = 0.34, o = P(-6, -12), Q = (x, y) => P(o.x + x * k, o.y + y * k);
  const st = { fill: UT.greenSoft, stroke: UT.green, width: 1.5 };
  const pieces = [
    [Q(135, 112), Q(370, 112), Q(370, 418), Q(227, 418)], [Q(453, 112), Q(663, 112), Q(755, 418), Q(453, 418)],
    [Q(249, 490), Q(370, 490), Q(370, 655), Q(298, 655)], [Q(453, 490), Q(777, 490), Q(826, 655), Q(453, 655)],
  ];
  const corner = Q(135, 655);
  return svg(290, 240, "길을 낸 평행사변형 정원",
    pieces.map((p) => poly(p, st)).join("")
    + rightAt(Q(370, 418), Q(370, 112), Q(227, 418), 6) + rightAt(Q(453, 418), Q(453, 112), Q(755, 418), 6)
    + rightAt(Q(370, 490), Q(370, 655), Q(249, 490), 6) + rightAt(Q(453, 490), Q(453, 655), Q(777, 490), 6)
    + seg(Q(135, 112), corner, { stroke: DIM, width: 1, dash: "3 3" }) + seg(corner, Q(298, 655), { stroke: DIM, width: 1, dash: "3 3" }) + rightAt(corner, Q(135, 112), Q(298, 655), 6)
    + dim(Q(135, 112), Q(663, 112), "17m", -12) + dim(corner, Q(135, 112), "18m", -14)
    + dim(Q(453, 418), Q(453, 490), "3m", 8) + dim(Q(370, 655), Q(453, 655), "3m", 8), 290);
}

// ── 21~25번
function q21() {
  const k = 0.36;
  const quad = (pts, o, [lp, lq, lsr, lh]) => {
    const [Pp, Qq, Rr, S] = pts.map(([x, y]) => P(o.x + x * k, o.y + y * k));
    const F = foot(Pp, S, Rr), G = P(Rr.x, Pp.y), dash = { stroke: DIM, width: 1, dash: "3 3" };
    return poly([Pp, Qq, Rr, S], { fill: "rgba(255,169,77,.45)", stroke: UT.line, width: 1.4 }) + seg(Pp, Rr, { stroke: UT.line, width: 1.3 })
      + seg(Pp, F, dash) + seg(F, S, dash) + seg(Rr, G, dash) + seg(Qq, G, dash) + rightAt(F, Pp, S, 6) + rightAt(G, Rr, Pp, 6)
      + dim(F, Pp, lp, 12) + dim(Pp, Qq, lq, 9) + dim(S, Rr, lsr, -9) + dim(Rr, G, lh, -12);
  };
  return svg(320, 322, "색칠한 두 사각형",
    tag(6, 12, "(1)") + quad([[127, 458], [265, 458], [575, 117], [362, 73]], P(20, -6), ["15㎝", "8㎝", "10㎝", "13㎝"])
    + tag(6, 184, "(2)") + quad([[112, 1220], [458, 1220], [537, 962], [398, 907]], P(26, -140), ["19㎝", "18㎝", "8㎝", "10㎝"]), 320);
}
function q22() {
  const k = 0.3, o = P(4, -4), Q = (x, y) => P(o.x + x * k, o.y + y * k);
  const TL = Q(150, 93), TR = Q(670, 93), BL = Q(58, 495), BR = Q(940, 495), H = P(TR.x, BL.y), F = foot(TL, BL, TR);
  const dash = { stroke: DIM, width: 1.1, dash: "3 3" };
  return svg(300, 186, "사다리꼴과 대각선",
    poly([TL, TR, BR, BL], { fill: UT.purpleSoft, stroke: UT.purple, width: 1.5 }) + seg(BL, TR, dash) + seg(TL, F, dash) + seg(TR, H, dash)
    + rightAt(F, TL, TR, 6) + rightAt(H, TR, BL, 6)
    + dim(TL, TR, "6㎝", -12) + dim(BL, BR, "11㎝", 14) + dim(TR, H, "5㎝", -10) + dim(TL, F, "3㎝", -8) + dim(BL, TR, "", 18, { boxed: true }), 300);
}
function q23() {
  const s = 30, x = 58, y = 58;
  let cells = "";
  for (let r = 0; r < 2; r += 1) for (let i = 0; i < 5; i += 1) cells += cell(x + i * s, y + r * (s + 6), s, s);
  const ly = y + 2 * s + 6 + 10;
  return svg(320, 176, "숫자 카드와 다섯 자리 수의 뺄셈",
    digitStrip(320, 4) + cells + text(x - 18, y + s + 6 + s / 2, "−", { size: 16 })
    + tag(x + 5 * s + 8, y + s / 2, "← 원래 수") + tag(x + 5 * s + 8, y + s + 6 + s / 2, "← 180° 돌린 수")
    + line(x - 30, ly, x + 5 * s + 6, ly, { stroke: UT.line, width: 1.4 })
    + [2, 5, 9, 1, 1].map((v, i) => cell(x + i * s, ly + 8, s, s, String(v), { size: 15 })).join(""), 320);
}
function q24() {
  const k = 0.34, o = P(-10, -12), Q = (x, y) => P(o.x + x * k, o.y + y * k);
  const ex = (890 + Math.sqrt(890 * 890 - 4 * (100 * 790 + 330 * 330))) / 2;
  const A = Q(100, 128), D = Q(790, 128), B = Q(197, 458), C = Q(680, 458), E = Q(ex, 458);
  const st = { stroke: UT.green, width: 1.5 };
  const nm = (p, v, dx, dy) => text(f(p.x + dx), f(p.y + dy), v, { size: 14 });
  return svg(290, 180, "사다리꼴 ABCD와 직각으로 만나는 두 선분",
    poly([A, B, C, D], { fill: UT.greenSoft, ...st }) + seg(A, E, st) + seg(D, E, st) + rightAt(E, A, D, 7)
    + dim(A, D, "50㎝", -12) + dim(B, C, "35㎝", 10) + dim(A, E, "40㎝", -12) + dim(E, D, "30㎝", -12)
    + nm(A, "A", -4, -14) + nm(D, "D", 4, -14) + nm(B, "B", -4, 16) + nm(C, "C", 4, 16), 290);
}
function q25() {
  const st = { fill: UT.yellowSoft, stroke: UT.orange, width: 1.5 };
  const u1 = 11, o1 = P(56, 26), Q1 = (x, y) => P(o1.x + x * u1, o1.y + y * u1);
  const a = Q1(0, 0), b = Q1(8, 0), c = Q1(18, 10), d = Q1(0, 10);
  const u2 = 10, o2 = P(70, 166), Q2 = (x, y) => P(o2.x + x * u2, o2.y + (14 - y) * u2);
  const A = Q2(0, 0), B = Q2(8, 0), C = Q2(11, 3), D = Q2(0, 14);
  return svg(300, 330, "넓이를 구할 두 사각형",
    tag(6, 12, "(1)") + poly([a, b, c, d], st) + rightAt(a, b, d, 7) + rightAt(d, a, c, 7) + arcAt(b, a, c, 12, "135°", { lr: 26 })
    + dim(d, a, "10㎝", -12) + dim(d, c, "18㎝", 10)
    + tag(6, 160, "(2)") + poly([A, B, C, D], st) + rightAt(A, B, D, 7) + rightAt(C, B, D, 7) + arcAt(B, A, C, 12, "135°", { lr: 26 })
    + dim(A, D, "14㎝", -12) + dim(A, B, "8㎝", 10), 290);
}

const Q = (number, prompt, figure, answer = { label: "답" }) => ({ number, prompt, figure, answer });
const deg = (label = "㉠ =") => ({ label, unit: "°" });
export const questions = [
  Q(1, "다음 도형은 어떤 도형을 시계 방향으로 반의 반 바퀴씩 17번 돌리고, 왼쪽으로 16번 뒤집은 후, 시계 방향으로 반 바퀴씩 15번 돌린 모양입니다. 움직인 도형을 보고 처음 도형을 그리시오.", q1, null),
  Q(2, "책상 위에 다음과 같은 수학 문제가 적힌 공책이 있습니다. 두 학생이 마주 보고 앉아 이 문제를 ①, ②의 방향으로 보고 풀어서 같은 답을 얻도록 △ 안에 들어갈 0이 아닌 한 자리 수를 구하시오.", q2),
  Q(3, "다음과 같은 모양의 숫자들로 이루어진 두 자리 수가 쓰인 수 카드를 시계 방향으로 반 바퀴 돌려서 다시 읽습니다. 이때, 원래 두 자리 수와 반 바퀴 돌려서 읽은 수의 합과 차가 다음과 같이 주어졌을 때, 원래 두 자리 수를 구하시오. (단, 원래의 두 자리 수가 반 바퀴 돌려서 읽은 두 자리 수보다 큽니다.)", q3, [{ label: "(1)" }, { label: "(2)" }]),
  Q(4, "다음과 같은 모양의 디지털 숫자들로 이루어진 세 자리 수가 쓰인 수 카드를 시계 방향으로 180° 돌려서 다시 읽습니다. 이때, 원래 세 자리 수와 180° 돌려서 읽은 수의 합이 971일 때, 원래 세 자리 수를 구하시오. (단, 180° 돌려서 읽은 수가 원래 세 자리 수보다 큽니다.)", q4),
  Q(5, "다음과 같은 모양의 숫자들로 이루어진 세 자리 수를 180° 회전시켰더니 처음과 같은 수가 되었습니다. 이러한 세 자리 수의 개수를 구하시오.", q5, { label: "답", unit: "개" }),
  Q(6, "마주 보는 면의 눈의 합이 7인 주사위를 다음 그림과 같이 쌓을 때, 바닥면을 포함하여 보이지 않는 면의 눈의 합을 구하시오.", q6, [{ label: "(1)" }, { label: "(2)" }]),
  Q(7, "마주 보는 면의 눈의 합이 7인 주사위를 다음과 같이 붙여 나갑니다. 주사위 8개를 붙여 만든 모양에서 바닥면을 포함한 주사위 겉면의 눈의 합이 가장 클 때의 값의 합을 구하시오.", q7),
  Q(8, "6명의 아이가 게임을 합니다. 주사위 모양의 상자의 각 면에 술래가 될 아이의 이름이 쓰여져 있습니다. 아래 그림에서 바닥에 가려 보이지 않는 면에 쓰인 아이의 이름을 구하시오. (단, 글자의 방향은 생각하지 않습니다.)", q8),
  Q(9, "마주 보는 면의 눈의 합이 7인 주사위를 그림의 빈칸을 따라 굴릴 때, 바닥에 닿아 빈칸에 들어가는 눈의 수의 합을 구하시오.", q9, { label: "합" }),
  Q(10, "다음은 하나의 주사위를 다른 위치에서 관찰한 모양입니다. 주어진 전개도를 접었을 때 다음 주사위가 되도록 아래와 같은 순서로 빈칸에 알맞은 수를 써넣으시오. (단, 마주 보는 면의 수의 합은 7이고 숫자의 방향은 생각하지 않습니다.)", q10, null),
  Q(11, "다음은 쌓기나무를 쌓아서 만든 모양을 여러 방향에서 본 그림입니다. 쌓기나무를 가장 많이 사용한 경우와 가장 적게 사용한 경우에 필요한 쌓기나무의 개수는 각각 몇 개인지 구하시오.", q11, [{ label: "최대", unit: "개" }, { label: "최소", unit: "개" }]),
  Q(12, "다음 그림에서 각 ㉠ + 각 ㉡의 크기를 구하시오.", q12, { label: "답", unit: "°" }),
  Q(13, "다음 그림과 같이 원 안에 정다각형이 그려져 있습니다. 각 ㉠, ㉡의 크기를 각각 구하시오.", q13, [deg("㉠ ="), deg("㉡ =")]),
  Q(14, "다음 그림에서 직선 A와 B는 서로 평행입니다. 각 ㉠, ㉡의 크기를 각각 구하시오.", q14, [deg("㉠ ="), deg("㉡ =")]),
  Q(15, "사각형 ABCD는 사다리꼴입니다. 각 ㉠의 크기를 구하시오.", q15, deg()),
  Q(16, "다음 주어진 시계의 시각을 보고 시침과 분침이 이루는 작은 쪽의 각도를 각각 구하시오.", q16, [{ label: "(1)", unit: "°" }, { label: "(2)", unit: "°" }]),
  Q(17, "다음 그림과 같이 숫자가 쓰여져 있지 않은 시계가 바닥에 놓여 있습니다. 시계의 시침과 분침이 이루는 각이 77.5°일 때, 표시된 각과 이 시계가 가리키는 시각은 몇 시 몇 분인지 각각 구하시오.", q17, [{ label: "표시된 각", unit: "°" }, { label: "시각" }]),
  Q(18, "다음 그림은 정사각형 ABCD의 내부에 사분원을 그린 것입니다. 색칠된 부분의 넓이를 구하시오.", q18, { label: "답", unit: "㎠" }),
  Q(19, "다음 평행사변형에서 □ 안에 알맞은 수를 써넣으시오.", q19, [{ label: "(1)", unit: "㎝" }, { label: "(2)", unit: "㎝" }]),
  Q(20, "평행사변형 모양의 정원에 다음 그림과 같이 폭이 일정한 길을 내려고 합니다. 길을 제외한 정원의 넓이를 구하시오.", q20, { label: "답", unit: "㎡" }),
  Q(21, "다음 색칠한 사각형의 넓이를 구하시오.", q21, [{ label: "(1)", unit: "㎠" }, { label: "(2)", unit: "㎠" }]),
  Q(22, "다음 도형은 사다리꼴입니다. □ 안에 알맞은 수를 써넣으시오.", q22, { label: "□ =", unit: "㎝" }),
  Q(23, "다음과 같은 모양의 숫자들로 이루어진 다섯 자리 수가 적혀 있는 카드가 있습니다. 이 다섯 자리 수의 각 자리의 숫자는 모두 다릅니다. 카드를 180° 돌려서 보니 원래의 수보다 25911이 작아졌습니다. 똑바로 보았을 때 카드에 적힌 원래의 수는 무엇인지 구하시오.", q23),
  Q(24, "다음 사다리꼴 ABCD의 넓이를 구하시오.", q24, { label: "답", unit: "㎠" }),
  Q(25, "다음 사각형의 넓이를 구하시오.", q25, [{ label: "(1)", unit: "㎠" }, { label: "(2)", unit: "㎠" }]),
];
