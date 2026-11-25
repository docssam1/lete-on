// 2과정 G4 「도형의 복원과 측정」 권별 테스트 — 새로 만든 시험(원장 2026-11-14 「G4 테스트는 다시 만들어 · 파일명으로 확정하지 마」).
// 드라이브의 G4 테스트(2과정-G4N · G4(R))는 문제 내용이 정다각별·넓이의 비·닮음 쪽이라 G4 N30 본책(특수각과 도형의 복원 · 평행선과
// 색종이 접기 · 평면도형의 넓이 · 평면도형의 둘레)과 맞지 않았다. 그래서 본책 네 단원의 활동·확인·도전 문제 꼴을 따라 수를 바꿔 새로 냈다.
// 단원: 1~6번 특수각과 도형의 복원 · 7~12번 평행선과 색종이 접기 · 13~19번 평면도형의 넓이 · 20~25번 평면도형의 둘레.
// 정답은 여기 두지 않는다(비공개 자리에만). 그림은 우리 색표(워밍업 그림 색), 글자는 검정.
import { UT, text, svg, line, mark } from "../selection-test-originals/kit.js?v=20261114a";
import { lenArc } from "./len-arc.js?v=20261124a";

export const perPage = 4;
export const meta = { course: "2과정", book: "G4", title: "도형의 복원과 측정" };

const R = Math.PI / 180;
const f = (n) => (Math.round(n * 10) / 10).toString();
const P = (x, y) => ({ x, y });
// 수학 각(시계 반대 방향, 위쪽이 +)으로 본 방향
const dir = (a, b) => Math.atan2(-(b.y - a.y), b.x - a.x) / R;
const at = (c, r, deg) => P(c.x + r * Math.cos(deg * R), c.y - r * Math.sin(deg * R));
const INK = UT.ink;
const poly = (pts, { fill = "none", stroke = INK, width = 1.6, dash = "" } = {}) =>
  `<polygon points="${pts.map((p) => `${f(p.x)},${f(p.y)}`).join(" ")}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const seg = (a, b, opts) => line(f(a.x), f(a.y), f(b.x), f(b.y), opts);
const name = (p, value, dx = 0, dy = 0, size = 13) => text(f(p.x + dx), f(p.y + dy), value, { size, weight: 700 });
const small = (p, value, size = 12, fill = INK) => text(f(p.x), f(p.y), value, { size, weight: 600, fill });
const lerp = (a, b, t) => P(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
function meet(a1, a2, b1, b2) {
  const d = (a2.x - a1.x) * (b2.y - b1.y) - (a2.y - a1.y) * (b2.x - b1.x);
  const t = ((b1.x - a1.x) * (b2.y - b1.y) - (b1.y - a1.y) * (b2.x - b1.x)) / d;
  return lerp(a1, a2, t);
}
function reflect(p, a, b) {
  const dx = b.x - a.x, dy = b.y - a.y, t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy);
  const q = P(a.x + t * dx, a.y + t * dy);
  return P(2 * q.x - p.x, 2 * q.y - p.y);
}
// 꼭짓점 c에서 c→p1, c→p2 사이 작은 쪽 각에 호와 글자. label 이 "㉠"·"㉡"이면 원 표지
function arcAt(c, p1, p2, r, label = "", { color = UT.red, lr = r + 13, size = 12, big = false } = {}) {
  let a1 = dir(c, p1), a2 = dir(c, p2);
  let span = ((a2 - a1) % 360 + 360) % 360;
  if (!big && span > 180) { [a1, a2] = [a2, a1]; span = 360 - span; }
  const s = at(c, r, a1), e = at(c, r, a1 + span);
  const arc = `<path d="M${f(s.x)} ${f(s.y)} A${r} ${r} 0 ${span > 180 ? 1 : 0} 0 ${f(e.x)} ${f(e.y)}" fill="none" stroke="${color}" stroke-width="1.6"/>`;
  if (!label) return arc;
  const m = at(c, lr, a1 + span / 2);
  return arc + (label.startsWith("㉠") || label.startsWith("㉡") ? mark(m.x, m.y, label, { r: 9, size: 11 }) : small(m, label, 11.5, color));
}
// 직각 표시
function rightAt(c, p1, p2, s = 9) {
  const u = (p) => { const l = Math.hypot(p.x - c.x, p.y - c.y); return P((p.x - c.x) / l, (p.y - c.y) / l); };
  const a = u(p1), b = u(p2);
  const q1 = P(c.x + a.x * s, c.y + a.y * s), q2 = P(c.x + (a.x + b.x) * s, c.y + (a.y + b.y) * s), q3 = P(c.x + b.x * s, c.y + b.y * s);
  return `<polyline points="${f(q1.x)},${f(q1.y)} ${f(q2.x)},${f(q2.y)} ${f(q3.x)},${f(q3.y)}" fill="none" stroke="${INK}" stroke-width="1.2"/>`;
}
// 같은 길이 표시(짧은 금 n개)
function ticks(a, b, n = 1) {
  const m = lerp(a, b, 0.5), l = Math.hypot(b.x - a.x, b.y - a.y), ux = (b.x - a.x) / l, uy = (b.y - a.y) / l, nx = -uy, ny = ux;
  return Array.from({ length: n }, (_, i) => {
    const o = (i - (n - 1) / 2) * 4;
    const c = P(m.x + ux * o, m.y + uy * o);
    return seg(P(c.x - nx * 5, c.y - ny * 5), P(c.x + nx * 5, c.y + ny * 5), { stroke: UT.red, width: 1.6 });
  }).join("");
}
// 길이 표시: a~b 바깥 곡선 점선 + 끊은 자리에 글자(스킬 gfield-textbook-design 4-3). side 1 = a→b 진행 방향의 (−dy, dx) 쪽.
const along = (a, b, value, side = 1, opts = {}) => lenArc(a, b, value, { side, unit: "㎝", ...opts });
const tint = { yellow: UT.yellowSoft, green: UT.greenSoft, purple: UT.purpleSoft, orange: UT.orangeSoft, red: UT.redSoft };

// ── 1단원 특수각과 도형의 복원
function q1() {
  const A = P(50, 20), B = P(50, 140), C = P(170, 140), D = P(170, 20), E = P(110, 140 + 120 * Math.sqrt(3) / 2);
  return svg(220, 262, "정사각형과 정삼각형",
    poly([A, B, C, D], { fill: tint.yellow }) + poly([B, E, C], { fill: tint.green }) + seg(A, E) + seg(D, E)
    + arcAt(E, A, D, 30, "㉠", { lr: 46 })
    + name(A, "A", -10, -6) + name(B, "B", -12, 4) + name(C, "C", 12, 4) + name(D, "D", 10, -6) + name(E, "E", 0, 12), 220);
}
function q2() {
  const O = P(110, 104), r = 86, ang = [90, 18, -54, -126, 162];
  const [A, B, C, D, E] = ang.map((a) => at(O, r, a));
  const X = meet(A, C, B, D);
  return svg(220, 200, "정오각형과 두 대각선",
    poly([A, B, C, D, E], { fill: tint.purple, stroke: UT.purple }) + seg(A, C) + seg(B, D)
    + arcAt(X, A, B, 16, "㉠", { lr: 30 })
    + name(A, "A", 0, -11) + name(B, "B", 12, 0) + name(C, "C", 10, 10) + name(D, "D", -10, 10) + name(E, "E", -12, 0) + name(X, "P", -2, 16, 12), 220);
}
function q3() {
  const k = 38, O = P(30, 200), X = P(30 + 4 * k, 200), Y45 = P(30, 200 - 4 * k), X2 = P(30 + 3 * Math.sqrt(3) * k, 200), Y2 = P(30, 200 - 3 * k);
  const Q = meet(X, Y45, X2, Y2);
  return svg(260, 216, "삼각자 두 개를 포갠 그림",
    poly([O, X2, Y2], { fill: "rgba(220,245,229,.85)", stroke: UT.green }) + poly([O, X, Y45], { fill: "rgba(255,243,196,.75)", stroke: UT.orange })
    + rightAt(O, X, Y45, 11) + arcAt(Q, X, Y2, 15, "㉠", { lr: 29 })
    + arcAt(X, O, Y45, 18, "45°", { color: UT.orange, lr: 33 }) + arcAt(Y45, O, X, 18, "45°", { color: UT.orange, lr: 33 })
    + arcAt(X2, O, Y2, 26, "30°", { color: UT.green, lr: 40 }) + arcAt(Y2, O, X2, 14, "60°", { color: UT.green, lr: 26 }), 260);
}
function q4() {
  const B = P(20, 176), C = P(244, 176), A = P(20 + 168, 176 - 97), D = P(188, 176);
  return svg(260, 200, "직각삼각형과 수선",
    poly([A, B, C], { fill: tint.yellow }) + seg(A, D, { dash: "5 4" }) + rightAt(A, B, C, 10) + rightAt(D, A, C, 9)
    + arcAt(B, C, A, 26, "30°", { lr: 42 }) + along(D, C, "4㎝")
    + name(A, "A", 0, -12) + name(B, "B", -10, 6) + name(C, "C", 10, 6) + name(D, "D", -8, 14), 260);
}
function q5() {
  const O = P(120, 116), r = 84, h = 42, w = Math.sqrt(r * r - h * h), A = P(120 - w, 116 - h), B = P(120 + w, 116 - h);
  const flap = `<path d="M${f(A.x)} ${f(A.y)} A${r} ${r} 0 0 0 ${f(B.x)} ${f(B.y)} Z" fill="${UT.orangeSoft}" stroke="${UT.orange}" stroke-width="1.6"/>`;
  return svg(240, 212, "원 모양 종이를 접은 그림",
    `<circle cx="${O.x}" cy="${O.y}" r="${r}" fill="${UT.yellowSoft}" stroke="${INK}" stroke-width="1.6"/>`
    + `<path d="M${f(A.x)} ${f(A.y)} A${r} ${r} 0 0 1 ${f(B.x)} ${f(B.y)}" fill="#fff" stroke="${INK}" stroke-width="1.2" stroke-dasharray="4 4"/>` + flap
    + seg(O, A) + seg(O, B) + `<circle cx="${O.x}" cy="${O.y}" r="2.6" fill="${INK}"/>` + arcAt(O, A, B, 18, "㉠", { lr: 32, big: false })
    + name(O, "O", 0, 14) + name(A, "A", -10, -4) + name(B, "B", 10, -4), 240);
}
function q6() {
  const A = P(110, 16), B = P(48.2, 206), C = P(171.8, 206), D = lerp(A, C, 0.618);
  return svg(220, 222, "이등변삼각형 안의 선분",
    poly([A, B, C], { fill: tint.green }) + seg(B, D) + ticks(A, D) + ticks(D, B) + ticks(B, C)
    + arcAt(A, B, C, 30, "㉠", { lr: 46 })
    + name(A, "A", 0, -8) + name(B, "B", -10, 6) + name(C, "C", 10, 6) + name(D, "D", 12, -2), 220);
}

// ── 2단원 평행선과 색종이 접기
function q7() {
  const B = P(20, 176), C = P(270, 176), A = P(20 + 130 / Math.tan(68 * R), 46), D = P(270 - 130 / Math.tan(58 * R), 46);
  return svg(290, 196, "사다리꼴",
    poly([A, B, C, D], { fill: tint.yellow })
    + arcAt(A, D, B, 20, "112°", { lr: 36 }) + arcAt(C, B, D, 22, "58°", { lr: 38 }) + arcAt(B, C, A, 20, "㉠", { lr: 34 }) + arcAt(D, A, C, 18, "㉡", { lr: 32 })
    + name(A, "A", -4, -11) + name(B, "B", -10, 6) + name(C, "C", 10, 6) + name(D, "D", 6, -11), 290);
}
const parallel = (y, x1 = 10, x2 = 300, tag = "") => seg(P(x1, y), P(x2, y), { width: 1.8 }) + (tag ? name(P(x2 + 10, y), tag, 0, 1) : "");
function q8() {
  const A0 = P(70, 36), B0 = P(80, 176);
  const Pt = meet(A0, at(A0, 50, -38), B0, at(B0, 50, 46));
  return svg(300, 200, "평행선 사이의 꺾인 선",
    parallel(36, 10, 270, "A") + parallel(176, 10, 270, "B") + seg(A0, Pt, { width: 1.8 }) + seg(Pt, B0, { width: 1.8 })
    + arcAt(A0, P(A0.x + 40, A0.y), Pt, 24, "38°", { lr: 40 }) + arcAt(B0, P(B0.x + 40, B0.y), Pt, 24, "46°", { lr: 40 }) + arcAt(Pt, A0, B0, 18, "㉠", { lr: 32 }), 300);
}
function q9() {
  const Q0 = P(60, 28), P1 = P(140, 73), P2 = P(170, 113), P3 = P(145, 158), Q4 = P(70, 198);
  const chain = [Q0, P1, P2, P3, Q4];
  return svg(300, 216, "평행선 사이의 여러 번 꺾인 선",
    parallel(28, 10, 270, "A") + parallel(198, 10, 270, "B") + chain.slice(1).map((p, i) => seg(chain[i], p, { width: 1.8 })).join("")
    + arcAt(Q0, P(10, 28), P1, 16) + arcAt(P1, Q0, P2, 16) + arcAt(P2, P1, P3, 16) + arcAt(P3, P2, Q4, 16) + arcAt(Q4, P(10, 198), P3, 16), 300);
}
function q10() {
  const Pb = P(176, 70), Pt = P(176 - 36 / Math.tan(50 * R), 34), d = P(Math.cos(260 * R), -Math.sin(260 * R)), L = 126;
  const Fb = P(Pb.x + d.x * L, Pb.y + d.y * L), Ft = P(Pt.x + d.x * L, Pt.y + d.y * L);
  return svg(300, 206, "종이 테이프를 접은 그림",
    poly([P(10, 34), Pt, Pb, P(10, 70)], { fill: tint.yellow }) + poly([Pt, Pb, Fb, Ft], { fill: tint.orange, stroke: UT.orange })
    + seg(Pt, Pb, { stroke: UT.orange, width: 1.6, dash: "5 4" })
    + arcAt(Pb, P(10, 70), Pt, 22, "50°", { lr: 38 }) + arcAt(Pb, P(10, 70), Fb, 34, "㉠", { lr: 50 }), 300);
}
function q11() {
  const heads = [0, 70, 125, 185, 230, 305], lens = [100, 90, 100, 90, 80.44, 118.45];
  const pts = [P(0, 0)];
  for (let i = 0; i < 5; i += 1) pts.push(at(pts[i], lens[i], heads[i]));
  const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y), k = 0.95, ox = 30 - Math.min(...xs) * k, oy = 26 - Math.min(...ys) * k;
  const V = pts.map((p) => P(ox + p.x * k, oy + p.y * k));
  const inner = ["㉠", "110°", "125°", "120°", "135°", "105°"];
  return svg(270, 236, "육각형",
    poly(V, { fill: tint.green }) + V.map((v, i) => arcAt(v, V[(i + 5) % 6], V[(i + 1) % 6], 17, inner[i], { lr: 34 })).join(""), 260);
}
function q12() {
  const A = P(22, 84), B = P(22, 204), C = P(214, 204), D = P(214, 84), C2 = reflect(C, B, D), E = meet(B, C2, A, D);
  return svg(240, 226, "직사각형을 대각선으로 접은 그림",
    poly([A, B, D], { fill: tint.yellow }) + poly([B, C2, D], { fill: tint.orange, stroke: UT.orange }) + seg(B, D)
    + seg(B, C, { dash: "4 4", stroke: UT.soft }) + seg(C, D, { dash: "4 4", stroke: UT.soft })
    + arcAt(D, A, B, 34, "32°", { lr: 50 }) + arcAt(E, A, B, 14, "㉠", { lr: 28 })
    + name(A, "A", -9, -6) + name(B, "B", -10, 6) + name(C, "C", 10, 6) + name(D, "D", 10, -6) + name(C2, "C'", 6, 10) + name(E, "E", 4, -9), 240);
}

// ── 3단원 평면도형의 넓이
function q13() {
  // 대각선 AC 10㎝ · BD 7㎝(그림 길이 200 : 140). 두 길이 표시가 다른 대각선 위에 앉지 않게 만나는 점을 가운데에서 비켜 둔다.
  const O = P(115, 96), A = P(40, 96), C = P(240, 96), B = at(O, 52, 120), D = at(O, 88, -60);
  return svg(280, 192, "두 대각선으로 만든 사각형",
    poly([A, B, C, D], { fill: tint.yellow, stroke: UT.soft, dash: "5 4" }) + seg(A, C, { width: 2.2 }) + seg(B, D, { width: 2.2 })
    + along(A, C, "10㎝", -1) + along(B, D, "7㎝", 1)
    + name(A, "A", -10, 0) + name(B, "B", -6, -9) + name(C, "C", 10, 0) + name(D, "D", 6, 10), 280);
}
function q14() {
  const s = 62, A = P(20, 30), B = P(20, 30 + s), C = P(20 + 4 * s, 30 + s), D = P(20 + 4 * s, 30);
  const sq = Array.from({ length: 4 }, (_, i) => poly([P(20 + i * s, 30), P(20 + i * s, 30 + s), P(20 + (i + 1) * s, 30 + s), P(20 + (i + 1) * s, 30)], { fill: tint.green })).join("");
  return svg(290, 120, "정사각형 4개를 이어 붙인 직사각형",
    sq + seg(B, D, { stroke: UT.red, width: 2 }) + along(B, D, "17㎝", -1, { halo: true })
    + name(A, "A", -9, -6) + name(B, "B", -10, 6) + name(C, "C", 10, 6) + name(D, "D", 10, -6), 290);
}
function q15() {
  const BL = P(20, 180), BR = P(260, 180), TR = P(310, 36), TL = P(70, 36);
  const xAt = (y, left) => (left ? 20 + (180 - y) * 50 / 144 : 260 + (180 - y) * 50 / 144);
  const y1 = 96, y2 = 120;
  const road1 = [P(xAt(y1, true), y1), P(xAt(y1, false), y1), P(xAt(y2, false), y2), P(xAt(y2, true), y2)];
  const road2 = [P(140, 180), P(156, 180), P(206, 36), P(190, 36)];
  return svg(340, 214, "길이 난 평행사변형 정원",
    poly([BL, BR, TR, TL], { fill: tint.green, stroke: UT.green }) + poly(road1, { fill: "#efe6d2", stroke: "none" }) + poly(road2, { fill: "#efe6d2", stroke: "none" })
    + poly([BL, BR, TR, TL], { stroke: UT.green }) + along(BL, BR, "30m") + seg(P(300, 36), P(300, 180), { dash: "4 4" }) + along(P(300, 180), P(300, 36), "18m")
    + along(P(242, y1), P(242, y2), "3m", -1) + along(P(206, 36), P(190, 36), "2m"), 330);
}
function q16() {
  const k = 8, B = P(30, 180), C = P(30 + 30 * k, 180), A = P(30 + 15 * k, 180 - 20 * k), D = P(A.x, 180);
  const t = ((B.x - A.x) * (C.x - A.x) + (B.y - A.y) * (C.y - A.y)) / ((C.x - A.x) ** 2 + (C.y - A.y) ** 2), E = lerp(A, C, t);
  return svg(300, 204, "삼각형과 두 높이",
    poly([A, B, C], { fill: tint.yellow }) + seg(A, D, { dash: "5 4" }) + seg(B, E, { dash: "5 4" }) + rightAt(D, A, C, 8) + rightAt(E, B, C, 8)
    + along(A, D, "20㎝", -1) + along(B, E, "24㎝", 1)
    + name(A, "A", 0, -11) + name(B, "B", -10, 6) + name(C, "C", 10, 6) + name(D, "D", 0, 14) + name(E, "E", 10, -6), 300);
}
function q17() {
  const A = P(90, 30), D = P(90 + 7 * 18, 30), B = P(30, 150), C = P(270, 150);
  return svg(300, 180, "사다리꼴",
    poly([A, B, C, D], { fill: tint.purple, stroke: UT.purple }) + seg(A, P(90, 150), { dash: "5 4" }) + rightAt(P(90, 150), A, C, 8)
    + along(D, A, "7㎝") + along(A, P(90, 150), "6㎝") + along(B, C, "", 1, { blank: true }), 300);
}
function q18() {
  const A = P(20, 20), B = P(20, 170), C = P(260, 170), D = P(260, 20), E = P(128, 20);
  return svg(300, 196, "직사각형과 색칠한 부분",
    poly([A, B, C, D], { fill: "#fff" }) + poly([E, B, C, D], { fill: tint.orange, stroke: UT.orange }) + poly([A, B, C, D])
    + along(B, C, "16㎝") + along(C, D, "10㎝")
    + name(A, "A", -9, -6) + name(B, "B", -10, 6) + name(C, "C", 10, 6) + name(D, "D", 10, -6) + name(E, "E", 0, -9), 290);
}
function q19() {
  const A = P(20, 20), B = P(20, 200), C = P(200, 200), D = P(200, 20), Pp = P(200, 150);
  return svg(230, 224, "정사각형을 나눈 그림",
    poly([A, B, C, Pp], { fill: tint.green }) + poly([A, Pp, D], { fill: tint.yellow }) + poly([A, B, C, D])
    + text(165, 62, "㉮", { size: 15 }) + text(90, 140, "㉯", { size: 15 }) + along(B, C, "12㎝")
    + name(A, "A", -9, -6) + name(B, "B", -10, 6) + name(C, "C", 10, 6) + name(D, "D", 10, -6) + name(Pp, "P", 12, 0), 230);
}

// ── 4단원 평면도형의 둘레
function q21() {
  const x0 = 20, y0 = 20, W = 240, H = 192, xs = [44, 92, 128, 196], ys = [56, 120];
  return svg(300, 236, "점선을 따라 자를 직사각형 종이",
    poly([P(x0, y0), P(x0 + W, y0), P(x0 + W, y0 + H), P(x0, y0 + H)], { fill: tint.yellow })
    + xs.map((x) => seg(P(x0 + x, y0), P(x0 + x, y0 + H), { dash: "5 4", stroke: INK, width: 1.2 })).join("")
    + ys.map((y) => seg(P(x0, y0 + y), P(x0 + W, y0 + y), { dash: "5 4", stroke: INK, width: 1.2 })).join("")
    + along(P(x0, y0 + H), P(x0 + W, y0 + H), "15㎝") + along(P(x0 + W, y0 + H), P(x0 + W, y0), "12㎝"), 300);
}
function q22() {
  const pts = [P(20, 20), P(110, 20), P(110, 65), P(180, 65), P(180, 110), P(272, 110), P(272, 200), P(140, 200), P(140, 146), P(90, 146), P(90, 200), P(20, 200)].map((p) => P(p.x + 22, p.y));
  return svg(310, 236, "직각으로 꺾인 도형",
    poly(pts, { fill: tint.green, stroke: UT.green }) + along(P(42, 200), P(294, 200), "14㎝")
    + along(P(42, 20), P(42, 200), "10㎝") + along(P(162, 146), P(162, 200), "3㎝"), 310);
}
function q23() {
  const k = 14, a = 6 * k, b = 9 * k, c = 4 * k, d = 9 * k, x0 = 20, y0 = 16;
  const cell = (x, y, w, h, label, shade) => poly([P(x, y), P(x + w, y), P(x + w, y + h), P(x, y + h)], { fill: shade ? tint.orange : "#fff" }) + text(x + w / 2, y + h / 2, label, { size: 14, weight: 700 });
  return svg(250, 210, "네 조각으로 나눈 직사각형",
    cell(x0, y0, a, c, "20㎝") + cell(x0 + a, y0, b, c, "26㎝") + cell(x0, y0 + c, a, d, "30㎝") + cell(x0 + a, y0 + c, b, d, "?", true), 250);
}
function q24() {
  const w = 48, l = 120, x0 = 20, y0 = 16;
  const top = Array.from({ length: 5 }, (_, i) => poly([P(x0 + i * w, y0), P(x0 + (i + 1) * w, y0), P(x0 + (i + 1) * w, y0 + l), P(x0 + i * w, y0 + l)], { fill: tint.purple, stroke: UT.purple })).join("");
  const bottom = Array.from({ length: 2 }, (_, i) => poly([P(x0 + i * l, y0 + l), P(x0 + (i + 1) * l, y0 + l), P(x0 + (i + 1) * l, y0 + l + w), P(x0 + i * l, y0 + l + w)], { fill: tint.purple, stroke: UT.purple })).join("");
  return svg(280, 196, "같은 직사각형 7개로 만든 큰 직사각형", top + bottom, 280);
}
function q25() {
  const s = 135, offs = [P(20, 20), P(47, 51.5), P(74, 83)];
  const fills = ["rgba(255,243,196,.85)", "rgba(220,245,229,.8)", "rgba(236,224,251,.75)"];
  const sq = offs.map((o, i) => poly([o, P(o.x + s, o.y), P(o.x + s, o.y + s), P(o.x, o.y + s)], { fill: fills[i] })).join("");
  const core = poly([P(74, 83), P(155, 83), P(155, 155), P(74, 155)], { fill: "rgba(243,154,30,.35)", stroke: UT.orange, width: 1.6 });
  return svg(250, 252, "정사각형 3장을 겹쳐 놓은 그림",
    sq + core + along(P(155, 20), P(20, 20), "15㎝") + along(P(74, 155), P(155, 155), "9㎝") + along(P(155, 155), P(155, 83), "8㎝"), 250);
}

const Q = (number, prompt, figure, answer = { label: "답" }) => ({ number, prompt, figure, answer });
const deg = (label = "㉠ =") => ({ label, unit: "°" });
export const questions = [
  Q(1, "다음 그림은 정사각형 ABCD의 바깥쪽에 정삼각형 EBC를 붙인 것입니다. 각 ㉠의 크기를 구하시오.", q1, deg()),
  Q(2, "다음 정오각형 ABCDE에서 대각선 AC와 BD가 만나는 점을 P라고 할 때, 각 ㉠의 크기를 구하시오.", q2, deg()),
  Q(3, "다음은 두 가지 삼각자를 직각인 꼭짓점이 꼭 맞게 포개어 놓은 것입니다. 두 삼각자가 겹쳐진 부분에서 각 ㉠의 크기를 구하시오.", q3, deg()),
  Q(4, "다음 그림의 직각삼각형 ABC에서 각 B는 30°, 선분 DC는 4㎝이고, 선분 AD와 선분 BC가 수직일 때, 선분 BD의 길이를 구하시오.", q4, { label: "답", unit: "㎝" }),
  Q(5, "원 모양의 종이를 접어서 접힌 부분의 호가 원의 중심 O에 닿도록 하였습니다. 각 ㉠의 크기를 구하시오.", q5, deg()),
  Q(6, "삼각형 ABC는 변 AB와 변 AC의 길이가 같은 이등변삼각형이고, 같은 표시는 같은 길이를 나타냅니다. 각 ㉠의 크기를 구하시오.", q6, deg()),
  Q(7, "사각형 ABCD는 변 AD와 변 BC가 평행한 사다리꼴입니다. 각 ㉠, ㉡의 크기를 각각 구하시오.", q7, [deg("㉠ ="), deg("㉡ =")]),
  Q(8, "두 직선 A, B는 서로 평행합니다. 각 ㉠의 크기를 구하시오.", q8, deg()),
  Q(9, "두 직선 A, B는 서로 평행합니다. 표시된 부분의 각의 크기의 합을 구하시오.", q9, { label: "답", unit: "°" }),
  Q(10, "직사각형 모양의 종이 테이프를 그림과 같이 접었습니다. 각 ㉠의 크기를 구하시오.", q10, deg()),
  Q(11, "다음 육각형에서 각 ㉠의 크기를 구하시오.", q11, deg()),
  Q(12, "직사각형 ABCD를 대각선 BD를 접는 선으로 하여 접었습니다. 각 ㉠의 크기를 구하시오.", q12, deg()),
  Q(13, "길이가 10㎝인 선분 AC와 7㎝인 선분 BD를 대각선으로 하는 사각형 ABCD가 있습니다. 사각형 ABCD의 넓이가 가장 클 때, 그 넓이를 구하시오.", q13, { label: "답", unit: "㎠" }),
  Q(14, "다음 그림은 크기가 같은 정사각형 4개를 이어 붙여 직사각형 ABCD를 만든 것입니다. 대각선 BD의 길이가 17㎝일 때, 작은 정사각형 1개의 넓이를 구하시오.", q14, { label: "답", unit: "㎠" }),
  Q(15, "평행사변형 모양의 정원에 그림과 같이 폭이 일정한 길을 내려고 합니다. 길을 제외한 정원의 넓이를 구하시오.", q15, { label: "답", unit: "㎡" }),
  Q(16, "삼각형 ABC에서 선분 AD와 선분 BE는 각각 높이입니다. 선분 AD는 20㎝, 선분 BE는 24㎝이고 변 BC와 변 AC의 길이의 합이 55㎝일 때, 삼각형 ABC의 넓이를 구하시오.", q16, { label: "답", unit: "㎠" }),
  Q(17, "다음 사다리꼴의 넓이가 60㎠일 때, □ 안에 알맞은 수를 구하시오.", q17, { label: "□ =" }),
  Q(18, "다음 그림에서 사각형 ABCD는 직사각형입니다. 색칠한 부분의 넓이가 색칠하지 않은 부분의 넓이의 3배일 때, 선분 AE의 길이를 구하시오.", q18, { label: "답", unit: "㎝" }),
  Q(19, "한 변의 길이가 12㎝인 정사각형 ABCD를 선분 AP로 나누었습니다. ㉯의 넓이가 ㉮의 넓이의 2배일 때, 선분 DP의 길이를 구하시오.", q19, { label: "답", unit: "㎝" }),
  Q(20, "둘레가 28㎝인 직사각형 중에서 넓이가 가장 큰 직사각형의 넓이를 구하시오.", null, { label: "답", unit: "㎠" }),
  Q(21, "가로가 15㎝, 세로가 12㎝인 직사각형 모양의 종이를 점선을 따라 가위로 잘라 15개의 직사각형을 만들었습니다. 15개의 직사각형의 둘레를 모두 더하면 몇 ㎝인지 구하시오.", q21, { label: "답", unit: "㎝" }),
  Q(22, "다음 도형은 모든 각이 직각입니다. 도형의 둘레를 구하시오.", q22, { label: "답", unit: "㎝" }),
  Q(23, "큰 직사각형을 4개의 작은 직사각형으로 나누었습니다. 작은 직사각형 안의 수는 그 직사각형의 둘레입니다. 색칠한 직사각형의 둘레를 구하시오.", q23, { label: "답", unit: "㎝" }),
  Q(24, "모양과 크기가 같은 작은 직사각형 7개를 붙여 큰 직사각형을 만들었습니다. 큰 직사각형의 둘레가 68㎝일 때, 작은 직사각형 1개의 둘레를 구하시오.", q24, { label: "답", unit: "㎝" }),
  Q(25, "한 변의 길이가 15㎝인 정사각형 3장을 그림과 같이 겹쳐 놓았습니다. 세 장이 모두 겹쳐진 부분의 가로가 9㎝, 세로가 8㎝일 때, 만들어진 도형의 둘레를 구하시오.", q25, { label: "답", unit: "㎝" }),
];
