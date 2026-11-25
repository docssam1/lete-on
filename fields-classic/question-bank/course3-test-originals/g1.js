// 3과정 G1 「합동과 닮음」 권별 테스트 — 드라이브 원문(3과정-G1N20 테스트, 25문항)을 우리 시험지 꼴로 다시 짠 것(원장 2026-11-15).
// 원문 문항을 본책 N20 판(「합동과 닮음」, 네 단원)의 활동·확인·연습 문제와 견주어 본책 단원과 맞는 것을 확인하고 옮겼다
// (파일 이름이 아니라 내용으로 확인 — 4·5·6·7·8·9·10·12·17·18·21·23·24·25번은 본책 문제의 수만 바꾼 꼴).
// 다른 판의 테스트(3과정-G1N)는 1~4번과 몇 문항만 같고, 원의 넓이·부채꼴(π) 문항이 들어 있어 N20 본책 차례와 맞지 않는다.
// 단원: 1~6번 합동과 도형의 변환 · 7~12번 탈레스의 반원(원주각 · 원에 내접하는 다각형 · 시계의 시침과 분침이 이루는 각)
//       · 13~18번 사다리꼴의 넓이(등적변형 · 넓이의 비 · 넓이를 이등분하는 선분) · 19~25번 보조선과 닮음(평행선과 닮음 · 연비와 닮음).
// 글·수·배치는 원문 그대로. 원문의 위줄(선분) 표기는 「선분 AB」로, 「//」(평행) 표기는 「서로 평행」으로 풀어 썼다.
// 원문에서 고친 것: 15번 「넓이의 몇 입니까?」→「넓이의 몇 분의 몇입니까?」, 단위 ㎝는 cm로, 띄어쓰기.
// 그림은 원문 그림의 점·선 자리를 따르되 문제의 수(각·길이·비)에 맞게 계산해 바르게 다시 그렸다(원문 그림은 눈대중이라
// 5번 C·D·M이 한 줄이 아니던 것, 4번 A·D·E가 한 줄이 아니던 것, 8번 원 위 네 점의 호, 25번 선분 PQ의 높이를 수에 맞췄다).
// 선은 검정, 색칠한 부분은 연두, 길이를 나타내는 점선 호는 갈색 점선, 각 표시는 빨강.
// 정답은 여기 두지 않는다(비공개 자리에만).
import { UT, esc, text, svg, mark, ringed } from "../selection-test-originals/kit.js?v=20261114a";
import { lenArc } from "../course2-test-originals/len-arc.js?v=20261124a";

export const perPage = 4;
export const meta = { course: "3과정", book: "G1", title: "합동과 닮음" };

const R = Math.PI / 180;
const f = (n) => (Math.round(n * 10) / 10).toString();
const INK = UT.ink;
const P = (x, y) => ({ x, y });
const add = (a, b) => P(a.x + b.x, a.y + b.y);
const sub = (a, b) => P(a.x - b.x, a.y - b.y);
const mul = (a, k) => P(a.x * k, a.y * k);
const len = (a) => Math.hypot(a.x, a.y);
const unit = (a) => mul(a, 1 / (len(a) || 1));
const lerp = (a, b, t) => P(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
const polar = (deg, r = 1, c = P(0, 0)) => P(c.x + r * Math.cos(deg * R), c.y + r * Math.sin(deg * R));   // 수학 좌표(y 위)
const turn = (p, c, deg) => { const d = sub(p, c), s = Math.sin(deg * R), k = Math.cos(deg * R); return P(c.x + d.x * k - d.y * s, c.y + d.x * s + d.y * k); };
function meet(a1, a2, b1, b2) {
  const d = (a2.x - a1.x) * (b2.y - b1.y) - (a2.y - a1.y) * (b2.x - b1.x);
  const t = ((b1.x - a1.x) * (b2.y - b1.y) - (b1.y - a1.y) * (b2.x - b1.x)) / d;
  return lerp(a1, a2, t);
}
// 정삼각형의 셋째 꼭짓점(선분 pq 위, away 와 먼 쪽)
function equi(p, q, away) {
  const a = turn(q, p, 60), b = turn(q, p, -60);
  return len(sub(a, away)) > len(sub(b, away)) ? a : b;
}
// 수학 좌표 점들 → 그림 칸(w×h)에 맞추는 변환(화면 좌표, y 아래)
function view(points, w, h, pad = 22) {
  const xs = points.map((p) => p.x), ys = points.map((p) => p.y);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const s = Math.min((w - 2 * pad) / ((x1 - x0) || 1), (h - 2 * pad) / ((y1 - y0) || 1));
  const ox = (w - (x1 - x0) * s) / 2, oy = (h - (y1 - y0) * s) / 2;
  const T = (p) => P(ox + (p.x - x0) * s, oy + (y1 - p.y) * s);
  T.scale = s;
  return T;
}

// ── 그리는 조각(화면 좌표)
const pts = (list) => list.map((p) => `${f(p.x)},${f(p.y)}`).join(" ");
const seg = (a, b, { stroke = INK, width = 1.5, dash = "" } = {}) =>
  `<line x1="${f(a.x)}" y1="${f(a.y)}" x2="${f(b.x)}" y2="${f(b.y)}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const poly = (list, { fill = "none", stroke = INK, width = 1.5 } = {}) =>
  `<polygon points="${pts(list)}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round"/>`;
const shade = (list) => poly(list, { fill: UT.greenSoft, stroke: "none" });
const circle = (c, r, { fill = "none", stroke = INK, width = 1.5 } = {}) =>
  `<circle cx="${f(c.x)}" cy="${f(c.y)}" r="${f(r)}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
const dot = (c, r = 2.6, fill = INK) => `<circle cx="${f(c.x)}" cy="${f(c.y)}" r="${r}" fill="${fill}"/>`;
const halo = (markup) => markup.replace('style="', 'style="paint-order:stroke;stroke:#fff;stroke-width:3.5px;stroke-linejoin:round;');
const word = (p, value, size = 12) => halo(text(f(p.x), f(p.y), value, { size, weight: 600 }));
const italic = (p, value, size = 14) => halo(`<text x="${f(p.x)}" y="${f(p.y)}" text-anchor="middle" dominant-baseline="central" style="font-size:${size}px;font-style:italic;font-weight:600;fill:${INK};font-family:'Times New Roman',serif;text-anchor:middle;dominant-baseline:central">${esc(value)}</text>`);
// 꼭짓점 이름: from 에서 p 쪽으로 d 만큼 바깥에
const name = (p, value, from, d = 13) => { const u = unit(sub(p, from)); return halo(text(f(p.x + u.x * d), f(p.y + u.y * d), value, { size: 13, weight: 700 })); };
const nameAt = (p, value, dx, dy) => halo(text(f(p.x + dx), f(p.y + dy), value, { size: 13, weight: 700 }));
const ringMark = (p, value) => ringed(p.x, p.y, { "㉠": "ㄱ", "㉮": "가", "㉯": "나", "㉰": "다" }[value] || value, { r: 9, size: 11 });
// 화면 좌표의 방향(도, 수학 방향)
const dirOf = (c, p) => Math.atan2(-(p.y - c.y), p.x - c.x) / R;
const at = (c, r, deg) => P(c.x + r * Math.cos(deg * R), c.y - r * Math.sin(deg * R));
function span(c, p1, p2) {
  let a1 = dirOf(c, p1), a2 = dirOf(c, p2);
  let s = ((a2 - a1) % 360 + 360) % 360;
  if (s > 180) { [a1, a2] = [a2, a1]; s = 360 - s; }
  return { a1, s, mid: a1 + s / 2 };
}
// 각 표시: c 에서 p1·p2 사이 작은 쪽. label 이 있으면 호 바깥에
function angle(c, p1, p2, r = 16, label = "", { fill = false, off = 13, size = 12 } = {}) {
  const { a1, s, mid } = span(c, p1, p2);
  const st = at(c, r, a1), en = at(c, r, a1 + s);
  const arc = `<path d="M${f(st.x)} ${f(st.y)} A${r} ${r} 0 0 0 ${f(en.x)} ${f(en.y)}" fill="none" stroke="${UT.red}" stroke-width="1.4"/>`;
  const fan = fill ? `<path d="M${f(c.x)} ${f(c.y)} L${f(st.x)} ${f(st.y)} A${r} ${r} 0 0 0 ${f(en.x)} ${f(en.y)}Z" fill="${UT.redSoft}" stroke="none"/>` : "";
  const tag = !label ? "" : label === "x" || label === "y" ? italic(at(c, r + off, mid), label) : /^[㉠㉮]$/.test(label) ? ringMark(at(c, r + off, mid), label) : word(at(c, r + off, mid), label, size);
  return fan + arc + tag;
}
// 직각 표시
function right(c, p1, p2, s = 8) {
  const u = unit(sub(p1, c)), v = unit(sub(p2, c));
  return `<polyline points="${pts([add(c, mul(u, s)), add(add(c, mul(u, s)), mul(v, s)), add(c, mul(v, s))])}" fill="none" stroke="${INK}" stroke-width="1"/>`;
}
// 길이가 같음 표시(짧은 금 n개)
function ticks(a, b, n = 1, sz = 5) {
  const m = lerp(a, b, 0.5), u = unit(sub(b, a)), v = P(-u.y, u.x);
  let out = "";
  for (let i = 0; i < n; i += 1) {
    const c = add(m, mul(u, (i - (n - 1) / 2) * 4));
    out += seg(add(c, mul(v, sz)), sub(c, mul(v, sz)), { width: 1.2 });
  }
  return out;
}
// 평행 표시(가운데 화살촉, a→b 방향)
function arrowMark(a, b, sz = 5) {
  const m = lerp(a, b, 0.5), u = unit(sub(b, a)), v = P(-u.y, u.x), tip = add(m, mul(u, sz * 0.8));
  return `<polygon points="${pts([tip, add(sub(m, mul(u, sz * 0.6)), mul(v, sz * 0.75)), sub(sub(m, mul(u, sz * 0.6)), mul(v, sz * 0.75))])}" fill="${INK}"/>`;
}
// 길이 표시: a~b 바깥 곡선 점선 + 끊은 자리에 글자(스킬 gfield-textbook-design 4-3, 원장 2026-11-24).
// side 1 = a→b 진행 방향의 (dy, −dx) 쪽(이 파일의 옛 약속 그대로). far = 더 띄울 만큼(전체 길이를 부분 길이보다 바깥에). it = 「x cm」 기울인 글자.
const brace = (a, b, label, { side = 1, far = 0, it = false } = {}) => lenArc(a, b, label, { side: -side, far, varName: it });

// ── 글로 쓰는 (1)(2) 물음(11·12번)
const SERIF = "font-family:'FC Serif',serif;color:#191511;word-break:keep-all";
const subs = (rows) => `<div style="display:flex;flex-direction:column;justify-content:space-evenly;gap:14px;width:100%;padding:8px 0 0 4px">${rows.map((row) => `<p style="margin:0;padding-left:1.9em;text-indent:-1.9em;${SERIF};font-size:clamp(11px,4.3cqw,15.5px);line-height:1.6">${esc(row)}</p>`).join("")}</div>`;

// ── 1~4번 합동과 도형의 변환
function q1() {
  const B = P(0, 0), C = P(157, 0), A = P(110, 78);
  const D = equi(A, B, C), E = equi(A, C, B);
  const T = view([A, B, C, D, E], 300, 190, 22), [a, b, c, d, e] = [A, B, C, D, E].map(T);
  const g = P((a.x + b.x + c.x) / 3, (a.y + b.y + c.y) / 3);
  return svg(300, 190, "삼각형 ABC의 변 AB와 변 AC에 그린 정삼각형 ABD와 ACE",
    poly([a, b, c]) + poly([a, b, d]) + poly([a, c, e]) + seg(d, c) + seg(b, e)
    + name(a, "A", P(a.x, a.y + 30)) + name(b, "B", g) + name(c, "C", g) + name(d, "D", g) + name(e, "E", g), 290);
}
function q2() {
  const B = P(0, 0), C = P(6, 0), D = P(10, 0), A = P(3, 3 * Math.sqrt(3)), E = P(8, 2 * Math.sqrt(3));
  const T = view([A, B, D, E], 300, 180, 22), [a, b, c, d, e] = [A, B, C, D, E].map(T);
  const p = meet(a, d, b, e);
  return svg(300, 180, "정삼각형 ABC와 ECD, 선분 AD와 BE의 교점 P",
    angle(p, b, d, 13, "", { fill: true }) + poly([a, b, c]) + poly([e, c, d]) + seg(a, d) + seg(b, e)
    + nameAt(a, "A", 0, -12) + nameAt(b, "B", -10, 9) + nameAt(c, "C", 0, 13) + nameAt(d, "D", 10, 9) + nameAt(e, "E", 4, -12) + nameAt(p, "P", -4, -14), 290);
}
function q3() {
  const B = P(0, 0), C = P(6, 0), E = P(16, 0), A = P(3, 3 * Math.sqrt(3));
  const D = equi(A, E, B);
  const T = view([A, B, E, D], 300, 230, 26), [a, b, c, e, d] = [A, B, C, E, D].map(T);
  return svg(300, 230, "정삼각형 ABC와 변 BC의 연장선 위의 점 E로 그린 정삼각형 ADE",
    poly([a, b, c]) + seg(c, e) + poly([a, d, e]) + seg(c, d)
    + brace(a, b, "6cm", { side: -1 }) + brace(c, e, "10cm", { side: -1 })
    + nameAt(a, "A", -4, -13) + nameAt(b, "B", -11, 6) + nameAt(c, "C", -2, 13) + nameAt(e, "E", 11, 6) + nameAt(d, "D", 0, -12), 280);
}
function q4() {
  const s = 10, B = P(0, 0), C = P(s, 0), A = polar(60, s);
  const bd = (s * Math.sin(27 * R)) / Math.sin(120 * R);
  const D = polar(27, bd), E = polar(-33, bd);   // 각 ABD = 33°, 삼각형 BDE 는 정삼각형 → A·D·E 가 한 줄
  const T = view([A, B, C, E], 260, 230, 24), [a, b, c, d, e] = [A, B, C, D, E].map(T);
  return svg(260, 230, "정삼각형 ABC와 정삼각형 BDE",
    angle(c, b, e, 20, "", { fill: true }) + poly([a, b, c]) + seg(a, e) + seg(b, d) + seg(b, e) + seg(c, e)
    + angle(b, a, d, 22, "33°", { off: 12 }) + ringMark(at(c, 40, span(c, b, e).mid), "㉠")
    + nameAt(a, "A", 0, -12) + nameAt(b, "B", -11, 2) + nameAt(c, "C", 11, 2) + nameAt(d, "D", 10, -6) + nameAt(e, "E", 0, 13), 250);
}

// ── 5~8번
function q5() {
  const A = P(0, 0), M = P(1, 0), B = P(2, 0);
  const ac = Math.sin(98 * R) / Math.sin(52 * R);   // 선분 AC = 선분 BD, C·M·D 는 한 줄(삼각형 ACM 의 각으로 계산)
  const C = polar(30, ac), D = polar(134, ac, B);
  const T = view([A, B, D], 290, 150, 24), [a, m, b, c, d] = [A, M, B, C, D].map(T);
  return svg(290, 150, "선분 AB의 중점 M과 선분 AC, 선분 BD",
    seg(a, b) + seg(a, c) + seg(m, d) + seg(b, d)
    + ticks(a, c, 1) + ticks(b, d, 1) + ticks(a, m, 2) + ticks(m, b, 2)
    + angle(a, b, c, 26, "30°", { off: 13 }) + angle(b, a, d, 22, "46°", { off: 13 }) + angle(c, a, m, 11)
    + nameAt(a, "A", -11, 2) + nameAt(m, "M", 0, 13) + nameAt(b, "B", 11, 4) + nameAt(c, "C", -9, -10) + nameAt(d, "D", 0, -12), 280);
}
function q6() {
  const A = P(0, 1), B = P(0, 0), C = P(1, 0), D = P(1, 1);
  const F = P(0, 1 - 1 / Math.tan(67 * R)), E = P(1 - Math.tan(22 * R), 0);   // 각 AFD = 67°, 각 FDE = 45°
  const T = view([A, B, C, D], 230, 230, 26), [a, b, c, d, fp, e] = [A, B, C, D, F, E].map(T);
  return svg(230, 230, "정사각형 ABCD와 삼각형 DFE",
    poly([a, b, c, d]) + poly([d, fp, e])
    + angle(fp, a, d, 16, "67°", { off: 12 }) + angle(d, fp, e, 24, "45°", { off: 12 }) + angle(e, fp, d, 14)
    + nameAt(a, "A", -10, -10) + nameAt(b, "B", -10, 10) + nameAt(c, "C", 10, 10) + nameAt(d, "D", 10, -10) + nameAt(fp, "F", -11, 0) + nameAt(e, "E", 0, 13), 220);
}
function q7() {
  const O = P(0, 0), A = P(-1, 0), B = P(1, 0), C = polar(150);   // 호 CB = 호 AC 의 5배
  const T = view([P(-1, -1), P(1, 1)], 230, 220, 24), [o, a, b, c] = [O, A, B, C].map(T);
  return svg(230, 220, "지름 AB가 있는 원 O와 색칠한 삼각형 OCB",
    shade([o, c, b]) + circle(o, T.scale) + seg(a, b) + seg(o, c) + seg(c, b)
    + angle(c, o, b, 18, "x", { off: 12 }) + dot(o, 2.6)
    + nameAt(a, "A", -11, 0) + nameAt(b, "B", 11, 0) + nameAt(c, "C", -9, -9) + nameAt(o, "O", 0, 12), 220);
}
function q8() {
  // 원 위 호: AB 104° · BC 106° · CD 67° · DA 83° (각 ABE = 105°, 각 BDC = 53°에 맞춤, 변 BC 는 가로로)
  const O = P(0, 0), A = polar(113), B = polar(217), C = polar(323), D = polar(30);
  const E = add(B, mul(sub(B, C), 0.3));
  const T = view([P(-1, -1), P(1, 1), E], 260, 220, 24), [o, a, b, c, d, e] = [O, A, B, C, D, E].map(T);
  return svg(260, 220, "원에 내접하는 사각형 ABCD와 변 CB의 연장선 위의 점 E",
    circle(o, T.scale) + poly([a, b, c, d]) + seg(a, c) + seg(b, d) + seg(b, e) + dot(e, 2.6)
    + angle(b, e, a, 13, "105°", { off: 14 }) + angle(a, b, c, 20, "x", { off: 9 })
    + angle(d, a, b, 18, "y", { off: 9 }) + angle(d, b, c, 28, "53°", { off: 13 })
    + nameAt(a, "A", -4, -12) + nameAt(b, "B", 4, 13) + nameAt(c, "C", 10, 8) + nameAt(d, "D", 11, -2) + nameAt(e, "E", 0, 13), 250);
}

// ── 9~12번
function q9() {
  const T = view([P(-1, -1), P(1, 1)], 230, 220, 24), o = T(P(0, 0)), r = T.scale;
  const dots = Array.from({ length: 10 }, (_, i) => T(polar(90 + i * 36)));
  const v = T(polar(54)), p1 = T(polar(198)), p2 = T(polar(270));
  return svg(230, 220, "원주를 10등분하는 점 10개와 두 현이 이루는 각",
    circle(o, r) + seg(v, p1) + seg(v, p2) + angle(v, p1, p2, 18, "", { fill: true })
    + dots.map((p) => dot(p, 2.6)).join("") + dot(o, 2.4) + nameAt(o, "O", 0, 12)
    + ringMark(at(v, 34, span(v, p1, p2).mid), "㉮"), 220);
}
function q10() {
  const T = view([P(-1, -1), P(1, 1)], 230, 220, 24), o = T(P(0, 0)), r = T.scale;
  const dots = Array.from({ length: 12 }, (_, i) => T(polar(i * 30)));
  const [p90, p30, p330, p240] = [90, 30, 330, 240].map((deg) => T(polar(deg)));
  const x = meet(p90, p330, p30, p240);
  return svg(230, 220, "원의 둘레를 12등분하는 점 12개 중 4개를 이은 사각형과 두 대각선",
    circle(o, r) + angle(x, p90, p30, 14, "x", { fill: true, off: 9 }) + poly([p90, p30, p330, p240])
    + seg(p90, p330, { dash: "4 3", width: 1.2 }) + seg(p30, p240, { dash: "4 3", width: 1.2 })
    + dots.map((p) => dot(p, 2.6)).join("") + dot(o, 2.4), 220);
}
const q11 = () => subs(["(1) 7시 20분", "(2) 1시 45분"]);
const q12 = () => subs(["(1) 시침과 분침이 일치(0°)합니다.", "(2) 시침과 분침이 20°를 이룹니다."]);

// ── 13~16번 사다리꼴의 넓이
function q13() {
  const A = P(0, 6), B = P(0, 0), C = P(10, 0), D = P(10, 6), Pp = P(5.6, 6);
  const X = meet(Pp, B, A, C), Y = meet(Pp, C, B, D);
  const T = view([A, B, C, D], 280, 190, 24), [a, b, c, d, p, x, y] = [A, B, C, D, Pp, X, Y].map(T);
  const o = meet(a, c, b, d), g = P((p.x + x.x + o.x + y.x) / 4, (p.y + x.y + o.y + y.y) / 4 - 2);
  return svg(280, 190, "직사각형 ABCD 안의 색칠한 두 삼각형과 사각형 ㉮",
    shade([a, b, x]) + shade([d, c, y]) + poly([a, b, c, d]) + seg(p, b) + seg(p, c) + seg(a, c) + seg(b, d)
    + ringMark(g, "㉮")
    + nameAt(a, "A", -10, -10) + nameAt(b, "B", -10, 10) + nameAt(c, "C", 10, 10) + nameAt(d, "D", 10, -10), 270);
}
function q14() {
  const A = P(0, 10), B = P(0, 0), C = P(18, 0), D = P(18, 10), E = P(0, 5), F = P(18, 5);
  const H = meet(A, F, B, D), G = meet(E, C, B, D);
  const T = view([A, B, C, D], 290, 190, 24), [a, b, c, d, e, fp, h, g] = [A, B, C, D, E, F, H, G].map(T);
  return svg(290, 190, "직사각형 ABCD와 변 AB, 변 DC의 중점 E, F",
    shade([g, h, fp, c]) + poly([a, b, c, d]) + seg(a, fp) + seg(e, c) + seg(b, d)
    + nameAt(a, "A", -10, -10) + nameAt(b, "B", -10, 10) + nameAt(c, "C", 10, 10) + nameAt(d, "D", 10, -10)
    + nameAt(e, "E", -11, 0) + nameAt(fp, "F", 11, 0) + nameAt(h, "H", 0, -13) + nameAt(g, "G", 0, -13), 280);
}
function q15() {
  const B = P(0, 0), C = P(10, 0), A = P(3.4, 9.2), D = lerp(B, C, 0.5);
  const E = lerp(A, B, 2 / 5), F = lerp(E, D, 1 / 4), G = lerp(A, D, 3 / 5);
  const T = view([A, B, C], 250, 220, 24), [a, b, c, d, e, fp, g] = [A, B, C, D, E, F, G].map(T);
  return svg(250, 220, "삼각형 ABC 안의 색칠한 삼각형 AFG",
    poly([a, fp, g], { fill: UT.greenSoft }) + poly([a, b, c]) + seg(e, d) + seg(a, d)
    + nameAt(a, "A", 0, -12) + nameAt(b, "B", -11, 4) + nameAt(c, "C", 11, 4) + nameAt(d, "D", 0, 13)
    + nameAt(e, "E", -11, -2) + nameAt(fp, "F", -11, 0) + nameAt(g, "G", 10, 4), 240);
}
function q16() {
  const A = P(0, 6), B = P(0, 0), C = P(12, 0), D = P(12, 6), E = P(6, 6), F = P(8, 0);
  const T = view([A, B, C, D], 280, 170, 24), [a, b, c, d, e, fp] = [A, B, C, D, E, F].map(T);
  return svg(280, 170, "직사각형 ABCD를 선분 EF로 나눈 ㉮와 ㉯",
    poly([a, b, c, d]) + seg(e, fp) + ringMark(T(P(3.3, 3)), "㉮") + ringMark(T(P(9.9, 3)), "㉯")
    + nameAt(a, "A", -10, -10) + nameAt(b, "B", -10, 10) + nameAt(c, "C", 10, 10) + nameAt(d, "D", 10, -10)
    + nameAt(e, "E", 0, -12) + nameAt(fp, "F", 0, 13), 270);
}

// ── 17~20번
function q17() {
  // 원문 그림 모양 그대로(선분 BE·EG·GC 의 실제 길이는 답이라 눈금을 맞추지 않는다)
  const A = P(0, 9), B = P(0, 0), C = P(16, 0), D = P(16, 9), E = P(2.6, 0), F = P(6.2, 9), G = P(8.8, 0);
  const T = view([A, B, C, D], 290, 190, 28), [a, b, c, d, e, fp, g] = [A, B, C, D, E, F, G].map(T);
  // 위 길이 표시(30cm)가 F 이름 위로 올라가도록 그림 전체를 14 내린다
  return svg(290, 204, "직사각형 ABCD를 평행한 두 선분 AE, FG로 나눈 ㉮, ㉯, ㉰", `<g transform="translate(0 14)">`
    + poly([a, b, c, d]) + seg(a, e) + seg(fp, g) + brace(a, d, "30cm", { side: 1, far: 10 })
    + ringMark(T(P(0.8, 2.2)), "㉮") + ringMark(T(P(4.6, 4.5)), "㉯") + ringMark(T(P(12, 4.5)), "㉰")
    + nameAt(a, "A", -10, -8) + nameAt(b, "B", -10, 10) + nameAt(c, "C", 10, 10) + nameAt(d, "D", 10, -8)
    + nameAt(e, "E", 0, 13) + nameAt(g, "G", 0, 13) + nameAt(fp, "F", 0, -12) + "</g>", 280);
}
function q18() {
  const B = P(0, 0), C = P(14, 0), A = P(5, Math.sqrt(14 * 14 - 25)), D = P(13, A.y);   // 변 AB = 14cm
  const E = lerp(B, A, 11 / 14);
  const T = view([A, B, C, D], 250, 230, 30), [a, b, c, d, e] = [A, B, C, D, E].map(T);
  return svg(250, 230, "사다리꼴 ABCD와 넓이를 이등분하는 선분 EC",
    poly([a, b, c, d]) + seg(e, c)
    + brace(a, d, "8cm", { side: 1 }) + brace(b, c, "14cm", { side: -1 }) + brace(b, a, "14cm", { side: 1 })
    + nameAt(a, "A", -9, -9) + nameAt(b, "B", -10, 8) + nameAt(c, "C", 10, 8) + nameAt(d, "D", 9, -9) + nameAt(e, "E", 10, -3), 240);
}
function q19() {
  const u = unit(P(0.3, 1));   // 세 평행선의 방향
  const B = P(0, 0), C = P(15, 0), A = mul(u, 10), D = add(C, mul(u, 15));
  const E = meet(A, C, B, D), F = P(6, 0);
  const T = view([A, B, C, D], 290, 190, 30), [a, b, c, d, e, fp] = [A, B, C, D, E, F].map(T);
  return svg(290, 190, "서로 평행한 선분 AB, EF, DC",
    seg(b, c) + seg(a, b) + seg(e, fp) + seg(d, c) + seg(a, c) + seg(b, d)
    + arrowMark(b, a) + arrowMark(fp, e) + arrowMark(c, d)
    + brace(b, a, "10cm", { side: 1 }) + brace(c, d, "15cm", { side: -1 })
    + brace(b, fp, "6cm", { side: -1 }) + brace(fp, c, "x cm", { side: -1, it: true })
    + brace(fp, e, "y cm", { side: -1, it: true })
    + nameAt(a, "A", -2, -12) + nameAt(b, "B", -11, 2) + nameAt(c, "C", 10, 6) + nameAt(d, "D", 2, -12) + nameAt(e, "E", 0, -12) + nameAt(fp, "F", 0, 13), 280);
}
function q20() {
  // (1) AB 14, AC 12, BC 10, 각 AED = 각 ACB → AD = 28/3 (2) AB 6, AC 9, BD 3, DC 9
  const A1 = P(0, 0), B1 = P(14, 0), C1 = P((144 - 100 + 196) / 28, 0);
  C1.y = Math.sqrt(144 - C1.x * C1.x);
  const E1 = P(8, 0), D1 = lerp(A1, C1, (28 / 3) / 12);
  const B2 = P(0, 0), C2 = P(12, 0), A2 = P(99 / 24, Math.sqrt(36 - (99 / 24) ** 2)), D2 = P(3, 0);
  const T1 = view([A1, B1, C1], 300, 150, 30), [a1, b1, c1, d1, e1] = [A1, B1, C1, D1, E1].map(T1);
  const T2 = view([A2, B2, C2], 300, 150, 30), [a2, b2, c2, d2] = [A2, B2, C2, D2].map((p) => { const q = T2(p); return P(q.x, q.y + 160); });
  return svg(300, 310, "닮음인 삼각형을 찾아 x를 구하는 두 그림",
    text(14, 14, "(1)", { size: 13, weight: 600 })
    + poly([a1, b1, c1]) + seg(d1, e1)
    + angle(c1, a1, b1, 12) + angle(e1, a1, d1, 12)
    + brace(a1, c1, "12cm", { side: 1 }) + brace(c1, b1, "10cm", { side: 1 })
    + brace(e1, b1, "6cm", { side: 1 }) + brace(a1, b1, "14cm", { side: -1, far: 12 })
    + brace(d1, e1, "x cm", { side: -1, it: true })
    + nameAt(a1, "A", -11, 2) + nameAt(b1, "B", 11, 2) + nameAt(c1, "C", 2, -12) + nameAt(d1, "D", -10, -6) + nameAt(e1, "E", -9, 10)
    + text(14, 174, "(2)", { size: 13, weight: 600 })
    + poly([a2, b2, c2]) + seg(a2, d2)
    + brace(b2, a2, "6cm", { side: 1 }) + brace(a2, c2, "9cm", { side: 1 })
    + brace(b2, d2, "3cm", { side: -1 }) + brace(d2, c2, "9cm", { side: -1 })
    + brace(a2, d2, "x cm", { side: 1, it: true })
    + nameAt(a2, "A", 0, -12) + nameAt(b2, "B", -11, 2) + nameAt(c2, "C", 11, 2) + nameAt(d2, "D", -2, 13), 290);
}

// ── 21~25번 보조선과 닮음
function q21() {
  const A = P(0, 8), B = P(0, 0), C = P(10, 0), D = P(10, 6), M = P(5, 0);
  const Pp = meet(A, C, M, D);
  // 아래 10cm 길이 표시가 M 이름 아래로 내려가도록 그림 높이를 늘리고 도형을 조금 위로
  const T = view([A, B, C, D], 260, 210, 32), [a, b, c, d, m, p] = [A, B, C, D, M, Pp].map((q) => { const r = T(q); return P(r.x, r.y - 6); });
  return svg(260, 222, "사다리꼴 ABCD와 변 BC의 중점 M, 색칠한 삼각형 MPC",
    shade([m, p, c]) + poly([a, b, c, d]) + seg(a, c) + seg(m, d)
    + right(b, a, c) + right(c, b, d) + ticks(b, m, 2) + ticks(m, c, 2)
    + brace(a, b, "8cm", { side: -1 }) + brace(c, d, "6cm", { side: -1 }) + brace(b, c, "10cm", { side: -1, far: 16 })
    + nameAt(a, "A", 0, -12) + nameAt(b, "B", -11, 4) + nameAt(c, "C", 11, 6) + nameAt(d, "D", 2, -12) + nameAt(m, "M", 0, 13) + nameAt(p, "P", 0, -12), 250);
}
function q22() {
  const A = P(1.5, 9), D = P(11.5, 9), B = P(0, 0), C = P(15, 0);
  const O = meet(A, C, B, D), E = meet(A, B, O, add(O, P(1, 0))), F = meet(D, C, O, add(O, P(1, 0)));
  const T = view([A, B, C, D], 240, 230, 30), [a, b, c, d, o, e, fp] = [A, B, C, D, O, E, F].map(T);
  return svg(240, 230, "사다리꼴 ABCD와 두 대각선의 교점 O를 지나는 선분 EF",
    poly([a, b, c, d]) + seg(a, c) + seg(b, d) + seg(e, fp)
    + arrowMark(d, a) + arrowMark(fp, e) + arrowMark(c, b)
    + brace(a, d, "10cm", { side: 1 }) + brace(b, c, "15cm", { side: -1 })
    + nameAt(a, "A", -9, -8) + nameAt(b, "B", -11, 4) + nameAt(c, "C", 11, 4) + nameAt(d, "D", 9, -8)
    + nameAt(e, "E", -11, 0) + nameAt(fp, "F", 11, 0) + nameAt(o, "O", 0, 13), 230);
}
function q23() {
  const A = P(0, 2), B = P(0, 0), C = P(3, 0), D = P(3, 2), E = P(1, 2), F = P(2.4, 0);
  const G = meet(E, C, B, D), H = meet(E, C, D, F);
  const T = view([A, B, C, D], 260, 190, 26), [a, b, c, d, e, fp, g, h] = [A, B, C, D, E, F, G, H].map(T);
  return svg(260, 190, "직사각형 ABCD와 선분 BD, EC, DF",
    poly([a, b, c, d]) + seg(b, d) + seg(e, c) + seg(d, fp)
    + nameAt(a, "A", -10, -10) + nameAt(b, "B", -10, 10) + nameAt(c, "C", 10, 10) + nameAt(d, "D", 10, -10)
    + nameAt(e, "E", 0, -12) + nameAt(fp, "F", 0, 13) + nameAt(g, "G", 0, -14) + nameAt(h, "H", -12, 4), 250);
}
function q24() {
  const A = P(0, 4), B = P(0, 0), C = P(4, 0), D = P(4, 4);
  const E = P(1, 4), F = P(3, 4), M = P(2, 4), H = P(0, 2), G = P(1, 0);
  const Pp = meet(G, F, H, C), Q = meet(G, F, M, C);
  const T = view([A, B, C, D], 230, 230, 28), [a, b, c, d, e, fp, m, h, g, p, q] = [A, B, C, D, E, F, M, H, G, Pp, Q].map(T);
  let marks = "";
  for (let i = 1; i < 4; i += 1) {
    const k = i / 4;
    marks += seg(lerp(a, d, k), add(lerp(a, d, k), P(0, 5)), { width: 1.1 }) + seg(lerp(b, c, k), add(lerp(b, c, k), P(0, -5)), { width: 1.1 })
      + seg(lerp(b, a, k), add(lerp(b, a, k), P(5, 0)), { width: 1.1 }) + seg(lerp(c, d, k), add(lerp(c, d, k), P(-5, 0)), { width: 1.1 });
  }
  return svg(230, 230, "네 변을 4등분한 정사각형 ABCD와 선분 GF, HC, 변 AD의 중점과 C를 이은 선분",
    poly([a, b, c, d]) + marks + seg(g, fp) + seg(h, c) + seg(m, c)
    + nameAt(a, "A", -10, -10) + nameAt(b, "B", -10, 10) + nameAt(c, "C", 10, 10) + nameAt(d, "D", 10, -10)
    + nameAt(e, "E", 0, -12) + nameAt(fp, "F", 2, -12) + nameAt(h, "H", -11, 0) + nameAt(g, "G", 0, 13)
    + nameAt(p, "P", -11, -4) + nameAt(q, "Q", -12, -2), 220);
}
function q25() {
  // AD 1 · PQ 6 · BC 9 — 꼭짓점을 이은 삼각형의 높이에 비례하게(선분 PQ 의 높이를 수에 맞춤)
  const k = 1.3, top = P(0, 9 * k), at = (w) => [P(-w / 2, top.y - w * k), P(w / 2, top.y - w * k)];
  const [A, D] = at(1), [Pp, Q] = at(6), [B, C] = at(9);
  const T = view([A, D, B, C], 230, 190, 26), [a, d, p, q, b, c] = [A, D, Pp, Q, B, C].map(T);
  return svg(230, 190, "사다리꼴 ABCD와 밑변에 평행한 선분 PQ",
    poly([a, b, c, d]) + seg(p, q)
    + nameAt(a, "A", -8, -9) + nameAt(d, "D", 8, -9) + nameAt(p, "P", -11, 0) + nameAt(q, "Q", 11, 0) + nameAt(b, "B", -10, 6) + nameAt(c, "C", 10, 6), 220);
}

const Q = (number, prompt, figure, answer = { label: "답" }, extra = {}) => ({ number, prompt, figure, answer, ...extra });
const deg = (label = "답") => ({ label, unit: "°" });
const cm = (label = "답") => ({ label, unit: "cm" });
const area = (label = "답") => ({ label, unit: "㎠" });
export const questions = [
  Q(1, "다음은 삼각형 ABC에서 변 AB와 변 AC를 한 변으로 하는 정삼각형을 각각 그린 것입니다. 합동인 두 삼각형을 찾고, 합동조건을 쓰시오.", q1, [{ label: "합동인 두 삼각형" }, { label: "합동조건" }]),
  Q(2, "다음 그림에서 삼각형 ABC와 삼각형 ECD는 정삼각형입니다. 선분 AD와 선분 BE의 교점을 P라 할 때, 각 BPD의 크기를 구하시오.", q2, deg()),
  Q(3, "다음 그림은 한 변의 길이가 6cm인 정삼각형 ABC의 변 BC의 연장선 위에 (변 CE)=10cm인 점 E를 잡아 정삼각형 ADE를 그린 것입니다. 변 CD의 길이는 얼마입니까?", q3, cm()),
  Q(4, "다음 그림의 삼각형 ABC와 삼각형 BDE는 정삼각형이고, 각 ABD=33°일 때, 각 ㉠의 크기를 구하시오.", q4, deg()),
  Q(5, "다음 그림에서 점 M은 선분 AB의 중점이고, 선분 AC와 선분 BD의 길이가 같습니다. 각 CAM = 30°, 각 DBM = 46°일 때, 각 ACM의 크기를 구하시오.", q5, deg()),
  Q(6, "다음 그림에서 사각형 ABCD는 정사각형입니다. 각 FED의 크기를 구하시오.", q6, deg()),
  Q(7, "다음 그림에서 호 CB의 길이는 호 AC의 5배일 때, 각 OCB의 크기를 구하시오.", q7, deg()),
  Q(8, "다음 그림에서 □ABCD는 원 O에 내접할 때, ∠x+∠y의 크기를 구하시오.", q8, deg()),
  Q(9, "다음 그림에서 원 위에 있는 10개의 점이 원주를 10등분할 때, 각 ㉮의 크기를 구하시오.", q9, deg()),
  Q(10, "다음 그림과 같이 원의 둘레를 12등분 하는 점 12개가 있습니다. 이 중 4개의 점을 이어 오른쪽과 같이 원에 내접하는 사각형을 만들었습니다. 이 사각형의 두 대각선이 만나 생기는 작은 각 x의 크기를 구하시오.", q10, deg()),
  Q(11, "다음의 시각에서 시계의 시침과 분침이 이루는 각 중 작은 각의 크기를 구하시오.", q11, [deg("(1)"), deg("(2)")]),
  Q(12, "4시와 5시 사이에서 시침과 분침이 이루는 각이 다음과 같이 주어졌을 때, 현재 시각을 구하시오.", q12, [{ label: "(1)" }, { label: "(2)" }]),
  Q(13, "다음 직사각형 ABCD에서 사각형 ㉮의 넓이가 5㎠이고 직사각형 ABCD의 넓이가 80㎠일 때, 색칠한 부분의 넓이의 합을 구하시오.", q13, area()),
  Q(14, "다음 직사각형 ABCD에서 점 E, 점 F는 각각 변 AB, 변 DC의 중점입니다. 선분 AB=10cm, 선분 BC=18cm일 때, 색칠한 부분의 넓이를 구하시오.", q14, area()),
  Q(15, "다음 그림에서 점 D는 변 BC를 1 : 1로 나누는 점이고, 점 E는 변 AB를 2 : 3으로 나누는 점입니다. 점 F가 선분 ED를 1 : 3으로, 점 G가 선분 AD를 3 : 2로 나눌 때, 색칠한 부분의 넓이는 삼각형 ABC 넓이의 몇 분의 몇입니까?", q15),
  Q(16, "다음 직사각형 ABCD에서 점 E는 선분 AD의 중점이고, 선분 BF와 선분 FC의 길이의 비는 2 : 1입니다. ㉮부분과 ㉯부분의 넓이의 비를 가장 간단한 자연수의 비로 나타내시오.", q16, { label: "㉮ : ㉯ =" }),
  Q(17, "다음 직사각형 ABCD에서 선분 AE와 선분 FG는 평행입니다. ㉯의 넓이는 ㉮의 넓이의 6배이고, ㉰의 넓이는 ㉮의 넓이의 8배일 때, 선분 BE, 선분 EG, 선분 GC의 길이를 각각 구하시오.", q17, [cm("선분 BE"), cm("선분 EG"), cm("선분 GC")]),
  Q(18, "다음 그림에서 선분 EC가 사다리꼴 ABCD 넓이를 이등분할 때, 선분 BE의 길이를 구하시오.", q18, cm("선분 BE")),
  Q(19, "다음 그림에서 선분 AB, 선분 EF, 선분 DC는 서로 평행하고 (선분 AB)=10cm, (선분 BF)=6cm, (선분 CD)=15cm일 때, x+y의 값을 구하시오.", q19),
  Q(20, "다음 그림에서 x의 값을 구하시오.", q20, [{ label: "(1) x =" }, { label: "(2) x =" }]),
  Q(21, "사다리꼴 ABCD에서 점 M은 선분 BC의 중점입니다. △MPC의 넓이를 구하시오.", q21, area()),
  Q(22, "다음 그림과 같은 사다리꼴 ABCD에서 선분 AD, 선분 EF, 선분 BC가 서로 평행일 때, 선분 EO의 길이를 구하시오. (단, 점 O는 두 대각선의 교점입니다.)", q22, cm("선분 EO")),
  Q(23, "다음 직사각형 ABCD에서 (선분 AE) : (선분 ED) = 1 : 2, (선분 BF) : (선분 FC) = 4 : 1일 때, (선분 EG) : (선분 GH) : (선분 HC)를 구하시오.", q23, { label: "EG : GH : HC =" }),
  Q(24, "다음 그림은 정사각형 ABCD의 네 변을 4등분한 것입니다. (선분 GP) : (선분 PQ) : (선분 QF)를 구하시오.", q24, { label: "GP : PQ : QF =" }),
  Q(25, "다음 그림의 □ABCD에서 (선분 AD)=1, (선분 BC)=9이고, 선분 AD, 선분 PQ, 선분 BC는 서로 평행입니다. □APQD와 □PBCQ의 넓이의 비가 7 : 9일 때, 선분 PQ의 길이를 구하시오.", q25, { label: "선분 PQ =" }),
];
