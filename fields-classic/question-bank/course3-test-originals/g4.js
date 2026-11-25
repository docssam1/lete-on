// 3과정 G4 「넓이분할과 도형의 변환」 권별 테스트 — 드라이브 원문(3과정-G4 테스트, 25문항)을 우리 시험지 꼴로 다시 짜되,
// 신판 N20 본책(원장 확인 2026-11-15: 3과정은 N20이 신판) 차례 「등적변형과 넓이분할 · 지렛대와 닮음 · 대칭변환 · 회전변환」에 맞췄다.
// 원문 테스트에서 본책 단원과 맞는 19문항은 글·수 그대로 두고 단원 차례로 번호를 다시 매겼다. 원문의 평면좌표 6문항은 본책에 없는
// 단원이라 빼고, 문항이 적던 대칭변환·회전변환 단원에서 본책의 활동·확인·도전 문제 꼴을 따라 수만 바꿔 6문항을 새로 냈다.
// 단원별 번호: 1~6번 등적변형과 넓이분할 · 7~12번 지렛대와 닮음 · 13~19번 대칭변환 · 20~25번 회전변환.
// 새로 낸 번호(본책 쪽은 인쇄 쪽 번호): 14번 다리 놓기 최단 거리(74쪽 확인 02) · 16번 직각이등변삼각형 접기(80쪽 확인 03) ·
// 19번 두 각의 이등분선에 내린 수선(88쪽 도전 2) · 22번 정사각형 각의 이등분선(105쪽 확인 03) · 24번 페르마포인트(109쪽 활동 03) ·
// 25번 정삼각형과 60° 돌리기(120쪽 13번).
// 원문 번호 → 이 파일 번호: 1~6 → 1~6 · 14~19 → 7~12 · 7 → 13 · 8 → 15 · 9 → 17 · 10 → 18 · 11 → 20 · 13 → 21 · 12 → 23.
// 9·10번(원문 16·17번)은 본책에 같은 문제는 없고 지렛대와 닮음 단원의 피라미드·모래시계 닮음 꼴이다.
// 원문의 윗줄 선분 기호(AB 위 가로줄)는 「선분 AB」로 적었다. 그림은 우리 색표로 다시 그렸다.
// 원문과 다르게 한 곳: 1번 글 「AB와 만나는 점」→「AC와 만나는 점」(그림·본책 그림 모두 D가 AC 위에 있고, M을 지나는 수선은 AB와
// 만나지 않는다) · 2번 그림은 DC 12㎝, AB 18㎝ 길이에 맞게 · 20번 그림은 ∠BEM 24°가 되게 직사각형 가로세로를 맞춤.
// 정답은 여기 두지 않는다(비공개 자리에만). 그림은 우리 색표(워밍업 그림 색), 글자는 검정.
import { UT, text, svg, line } from "../selection-test-originals/kit.js?v=20261114a";
import { lenArc } from "../course2-test-originals/len-arc.js?v=20261124a";

export const perPage = 4;
export const meta = { course: "3과정", book: "G4", title: "넓이분할과 도형의 변환" };

const R = Math.PI / 180;
const f = (n) => (Math.round(n * 10) / 10).toString();
const P = (x, y) => ({ x, y });
const lerp = (a, b, t) => P(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
const len = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
const pol = (deg, r = 1, o = P(0, 0)) => P(o.x + r * Math.cos(deg * R), o.y + r * Math.sin(deg * R));
function meet(a1, a2, b1, b2) {
  const d = (a2.x - a1.x) * (b2.y - b1.y) - (a2.y - a1.y) * (b2.x - b1.x);
  const t = ((b1.x - a1.x) * (b2.y - b1.y) - (b1.y - a1.y) * (b2.x - b1.x)) / d;
  return lerp(a1, a2, t);
}
// 수학 좌표(위가 +) → 그림 칸 좌표. 점들이 w 폭·maxH 높이 안에 들어가게 같은 배율로 맞춘다.
function fit(points, { w = 270, maxH = 210, pad = 24 } = {}) {
  const xs = points.map((p) => p.x), ys = points.map((p) => p.y);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const k = Math.min((w - 2 * pad) / (x1 - x0 || 1), (maxH - 2 * pad) / (y1 - y0 || 1));
  const ox = (w - (x1 - x0) * k) / 2;
  return { T: (p) => P(ox + (p.x - x0) * k, pad + (y1 - p.y) * k), h: Math.round((y1 - y0) * k + 2 * pad), k };
}

const INK = UT.ink;
const tint = { yellow: UT.yellowSoft, green: UT.greenSoft, purple: UT.purpleSoft, orange: UT.orangeSoft, blue: UT.blueSoft };
const SHADE = "rgba(243,154,30,.45)";
const poly = (pts, { fill = "none", stroke = INK, width = 1.6, dash = "" } = {}) =>
  `<polygon points="${pts.map((p) => `${f(p.x)},${f(p.y)}`).join(" ")}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const seg = (a, b, opts) => line(f(a.x), f(a.y), f(b.x), f(b.y), opts);
const name = (p, value, dx = 0, dy = 0, size = 13) => text(f(p.x + dx), f(p.y + dy), value, { size, weight: 700 });
const small = (p, value, size = 12, fill = INK) => text(f(p.x), f(p.y), value, { size, weight: 600, fill });
const dot = (p, r = 2.6) => `<circle cx="${f(p.x)}" cy="${f(p.y)}" r="${r}" fill="${INK}"/>`;
// 그림 칸 좌표에서 본 방향(수학 각, 시계 반대 방향)
const dir = (a, b) => Math.atan2(-(b.y - a.y), b.x - a.x) / R;
const at = (c, r, deg) => P(c.x + r * Math.cos(deg * R), c.y - r * Math.sin(deg * R));
// 꼭짓점 c에서 c→p1, c→p2 사이 작은 쪽 각에 호와 글자
function arcAt(c, p1, p2, r, label = "", { color = UT.red, lr = r + 13, size = 11.5 } = {}) {
  let a1 = dir(c, p1), a2 = dir(c, p2);
  let span = ((a2 - a1) % 360 + 360) % 360;
  if (span > 180) { [a1, a2] = [a2, a1]; span = 360 - span; }
  const s = at(c, r, a1), e = at(c, r, a1 + span);
  const arc = `<path d="M${f(s.x)} ${f(s.y)} A${r} ${r} 0 0 0 ${f(e.x)} ${f(e.y)}" fill="none" stroke="${color}" stroke-width="1.6"/>`;
  return arc + (label ? small(at(c, lr, a1 + span / 2), label, size, color) : "");
}
// 같은 크기의 두 각(이등분) — 각 안에 점 둘
function bisectDots(c, p1, p2, r = 16) {
  let a1 = dir(c, p1), a2 = dir(c, p2);
  let span = ((a2 - a1) % 360 + 360) % 360;
  if (span > 180) { [a1, a2] = [a2, a1]; span = 360 - span; }
  return dot(at(c, r, a1 + span * 0.27), 2.3) + dot(at(c, r, a1 + span * 0.73), 2.3);
}
// 직각 표시
function rightAt(c, p1, p2, s = 8) {
  const u = (p) => { const l = Math.hypot(p.x - c.x, p.y - c.y); return P((p.x - c.x) / l, (p.y - c.y) / l); };
  const a = u(p1), b = u(p2);
  const q1 = P(c.x + a.x * s, c.y + a.y * s), q2 = P(c.x + (a.x + b.x) * s, c.y + (a.y + b.y) * s), q3 = P(c.x + b.x * s, c.y + b.y * s);
  return `<polyline points="${f(q1.x)},${f(q1.y)} ${f(q2.x)},${f(q2.y)} ${f(q3.x)},${f(q3.y)}" fill="none" stroke="${INK}" stroke-width="1.2"/>`;
}
// 같은 길이 표시(짧은 금 n개, 선분의 t 자리)
function ticks(a, b, n = 1, t = 0.5) {
  const m = lerp(a, b, t), l = len(a, b), ux = (b.x - a.x) / l, uy = (b.y - a.y) / l, nx = -uy, ny = ux;
  return Array.from({ length: n }, (_, i) => {
    const o = (i - (n - 1) / 2) * 4, c = P(m.x + ux * o, m.y + uy * o);
    return seg(P(c.x - nx * 5, c.y - ny * 5), P(c.x + nx * 5, c.y + ny * 5), { stroke: UT.red, width: 1.5 });
  }).join("");
}
// 평행 표시(가운데에 a→b 쪽 꺾쇠 n개)
function chev(a, b, n = 1, t = 0.5) {
  const m = lerp(a, b, t), l = len(a, b), ux = (b.x - a.x) / l, uy = (b.y - a.y) / l, nx = -uy, ny = ux;
  return Array.from({ length: n }, (_, i) => {
    const o = (i - (n - 1) / 2) * 5 + 3, tip = P(m.x + ux * o, m.y + uy * o), back = P(tip.x - ux * 6, tip.y - uy * 6);
    return `<polyline points="${f(back.x + nx * 4)},${f(back.y + ny * 4)} ${f(tip.x)},${f(tip.y)} ${f(back.x - nx * 4)},${f(back.y - ny * 4)}" fill="none" stroke="${UT.purple}" stroke-width="1.5" stroke-linejoin="round"/>`;
  }).join("");
}
// 길이 표시: a~b 바깥 곡선 점선 + 끊은 자리에 글자(스킬 gfield-textbook-design 4-3, 원장 2026-11-24).
// off 부호 = 휘는 쪽(양수 = a→b 진행 방향의 (−dy, dx) 쪽, 옛 글자 자리와 같은 쪽). far = 더 띄울 만큼 · halo = 다른 선 위 글자에 흰 테.
const along = (a, b, value, off = 12, { far = 0, halo = false } = {}) => lenArc(a, b, value, { side: off < 0 ? -1 : 1, far, halo, size: 12.5, unit: "㎝" });
// 점 이름을 중심에서 바깥쪽으로 조금 떨어뜨려
function out(p, value, center, d = 12, size = 13) {
  const l = Math.hypot(p.x - center.x, p.y - center.y) || 1;
  return name(P(p.x + (p.x - center.x) / l * d, p.y + (p.y - center.y) / l * d), value, 0, 0, size);
}
const mid = (pts) => P(pts.reduce((s, p) => s + p.x, 0) / pts.length, pts.reduce((s, p) => s + p.y, 0) / pts.length);
function arrowHead(a, b, s = 7) {
  const l = len(a, b), ux = (b.x - a.x) / l, uy = (b.y - a.y) / l;
  return `<polygon points="${f(b.x)},${f(b.y)} ${f(b.x - ux * s - uy * s * 0.45)},${f(b.y - uy * s + ux * s * 0.45)} ${f(b.x - ux * s + uy * s * 0.45)},${f(b.y - uy * s - ux * s * 0.45)}" fill="${INK}"/>`;
}
const ray = (a, b) => seg(a, b, { width: 1.5 }) + arrowHead(a, b);

// ── 1단원 등적변형과 넓이분할
function q1() {
  // 직각삼각형: AB 16, AC 20 → 빗변 25.6, BH 10, AH 12.5
  const B = P(0, 0), C = P(25.6, 0), A = P(10, 12.5), H = P(10, 0), M = P(12.8, 0), D = meet(M, P(12.8, 10), A, C);
  const { T, h } = fit([A, B, C], { w: 290, maxH: 190, pad: 26 });
  const [a, b, c, hh, m, d] = [A, B, C, H, M, D].map(T), o = mid([a, b, c]);
  return svg(290, h, "직각삼각형 ABC와 선분 AH, DM, DH",
    poly([a, b, c], { fill: tint.yellow }) + seg(a, hh) + seg(d, m) + seg(d, hh)
    + rightAt(a, b, c, 9) + rightAt(hh, a, c, 8) + rightAt(m, d, c, 8)
    + along(a, b, "16㎝", 14) + along(c, a, "20㎝", 14)
    + out(a, "A", o) + name(b, "B", -10, 4) + name(c, "C", 10, 4) + name(hh, "H", 0, 13) + name(m, "M", 2, 13) + name(d, "D", 6, -10), 290);
}
function q2() {
  // AB // DC, DC 12, AB 18. E = (B를 지나 AD와 평행) ∩ (D를 지나 AC와 평행)
  const A = P(0, 0), B = P(18, 0), D = P(2.6, 6.2), C = P(14.6, 6.2);
  const E = meet(B, P(B.x + D.x - A.x, B.y + D.y - A.y), D, P(D.x + C.x - A.x, D.y + C.y - A.y));
  const { T, h } = fit([A, B, C, D, E], { w: 290, maxH: 220, pad: 22 });
  const [a, b, c, d, e] = [A, B, C, D, E].map(T);
  return svg(290, h, "사다리꼴 ABCD와 점 E",
    poly([a, b, c, d], { fill: tint.green }) + seg(a, c) + seg(d, e) + seg(b, e) + seg(c, e)
    + chev(a, b, 3) + chev(d, c, 3) + chev(a, d, 2, 0.55) + chev(b, e, 2, 0.6) + chev(a, c, 1, 0.45) + chev(d, e, 1, 0.55)
    + name(a, "A", -10, 4) + name(b, "B", 10, 6) + name(c, "C", -2, -11) + name(d, "D", -11, -3) + name(e, "E", 8, -7), 290);
}
function q3() {
  // △PAB : △PAC : △PBC = 4 : 5 : 6 → P = (6A + 5B + 4C) / 15
  const A = P(7.4, 7.4), B = P(0, 0), C = P(9.4, 0);
  const Pp = P((6 * A.x + 5 * B.x + 4 * C.x) / 15, (6 * A.y + 5 * B.y + 4 * C.y) / 15), D = meet(A, Pp, B, C);
  const { T, h } = fit([A, B, C], { w: 250, maxH: 200, pad: 22 });
  const [a, b, c, p, d] = [A, B, C, Pp, D].map(T);
  return svg(250, h, "삼각형 ABC 안의 점 P",
    poly([a, b, c], { fill: tint.purple, stroke: INK }) + seg(a, d) + seg(b, p) + seg(c, p)
    + name(a, "A", 0, -10) + name(b, "B", -10, 4) + name(c, "C", 10, 4) + name(d, "D", 0, 13) + name(p, "P", 10, -6), 250);
}
function q4() {
  // BD : DC = AF : FB = CE : EA = 1 : 3
  const A = P(8.7, 9.5), B = P(0, 0), C = P(11.8, 0);
  const D = lerp(B, C, 0.25), F = lerp(A, B, 0.25), E = lerp(C, A, 0.25);
  const Pp = meet(A, D, C, F), Q = meet(A, D, B, E), Rr = meet(B, E, C, F);
  const { T, h } = fit([A, B, C], { w: 260, maxH: 210, pad: 22 });
  const [a, b, c, d, e, ff, p, q, r] = [A, B, C, D, E, F, Pp, Q, Rr].map(T);
  return svg(260, h, "삼각형 ABC와 세 선분이 만든 색칠한 삼각형 PQR",
    poly([a, b, c], { fill: "#fff" }) + poly([p, q, r], { fill: SHADE, stroke: UT.orange }) + seg(a, d) + seg(b, e) + seg(c, ff)
    + name(a, "A", 0, -10) + name(b, "B", -10, 4) + name(c, "C", 10, 4) + name(d, "D", 0, 13) + name(e, "E", 10, -2) + name(ff, "F", -10, -4)
    + name(p, "P", 9, -6, 12) + name(q, "Q", -11, 2, 12) + name(r, "R", 3, 12, 12), 260);
}
function q5() {
  // AF = FC, BD : DC = 2 : 5, E = AD ∩ BF
  const A = P(2.4, 11), B = P(0, 0), C = P(9, 0), D = lerp(B, C, 2 / 7), F = lerp(A, C, 0.5), E = meet(A, D, B, F);
  const { T, h } = fit([A, B, C], { w: 220, maxH: 210, pad: 22 });
  const [a, b, c, d, e, ff] = [A, B, C, D, E, F].map(T);
  return svg(220, h, "삼각형 ABC와 선분 AD, BF",
    poly([a, b, c], { fill: tint.yellow }) + seg(a, d) + seg(b, ff) + ticks(a, ff) + ticks(ff, c)
    + name(a, "A", 0, -10) + name(b, "B", -10, 4) + name(c, "C", 10, 4) + name(d, "D", 0, 13) + name(e, "E", 10, 4) + name(ff, "F", 10, -3), 220);
}
function q6() {
  // C는 BF의 중점, E는 AC의 중점, D는 직선 FE와 변 AB가 만나는 점
  const B = P(0, 0), F = P(10, 0), C = P(5, 0), A = P(4.2, 10.4), E = lerp(A, C, 0.5), D = meet(F, E, A, B);
  const { T, h } = fit([A, B, F], { w: 230, maxH: 210, pad: 22 });
  const [a, b, c, d, e, ff] = [A, B, C, D, E, F].map(T);
  return svg(230, h, "삼각형 ABC와 직선 DEF",
    poly([a, b, c], { fill: tint.green }) + seg(c, ff) + seg(d, ff)
    + ticks(b, c) + ticks(c, ff) + ticks(a, e, 2) + ticks(e, c, 2)
    + name(a, "A", 0, -10) + name(b, "B", -10, 4) + name(c, "C", 0, 13) + name(ff, "F", 10, 4) + name(d, "D", -11, -2) + name(e, "E", 10, -4), 230);
}

// ── 2단원 지렛대와 닮음
function q7() {
  // 평행사변형: AE : ED = 1 : 3, F = BD ∩ EC
  const B = P(0, 0), C = P(8, 0), A = P(1.9, 6.6), D = P(9.9, 6.6), E = lerp(A, D, 0.25), F = meet(B, D, E, C);
  const { T, h } = fit([A, B, C, D], { w: 230, maxH: 190, pad: 22 });
  const [a, b, c, d, e, ff] = [A, B, C, D, E, F].map(T);
  return svg(230, h, "평행사변형 ABCD와 선분 BD, EC",
    poly([a, b, c, d], { fill: tint.purple }) + seg(b, d) + seg(e, c)
    + name(a, "A", -6, -9) + name(e, "E", 0, -10) + name(d, "D", 6, -9) + name(b, "B", -6, 11) + name(c, "C", 4, 11) + name(ff, "F", -11, -4), 230);
}
function q8() {
  // 한 변을 4등분한 정사각형: E(AB 아래쪽 4분의 1), F(DC 가운데), G(BC 가운데), H(DC 아래쪽 4분의 1)
  const A = P(0, 4), B = P(0, 0), C = P(4, 0), D = P(4, 4), E = P(0, 1), F = P(4, 2), G = P(2, 0), H = P(4, 1);
  const Pp = meet(A, G, E, F), Q = meet(A, H, E, F);
  const { T, h } = fit([A, B, C, D], { w: 230, maxH: 210, pad: 24 });
  const [a, b, c, d, e, ff, g, hh, p, q] = [A, B, C, D, E, F, G, H, Pp, Q].map(T);
  const tk = (pt, horiz) => (horiz ? seg(P(pt.x, pt.y - 4), P(pt.x, pt.y + 4), { width: 1.3 }) : seg(P(pt.x - 4, pt.y), P(pt.x + 4, pt.y), { width: 1.3 }));
  const marks = [P(1, 4), P(2, 4), P(3, 4), P(1, 0), P(3, 0)].map((pt) => tk(T(pt), true)).join("")
    + [P(0, 3), P(0, 2), P(4, 3)].map((pt) => tk(T(pt), false)).join("");
  return svg(230, h, "네 변을 4등분한 정사각형 ABCD와 색칠한 삼각형 APQ",
    poly([a, b, c, d], { fill: "#fff" }) + poly([a, p, q], { fill: SHADE, stroke: UT.orange }) + poly([a, b, c, d])
    + seg(a, g) + seg(a, hh) + seg(e, ff) + marks
    + name(a, "A", -9, -7) + name(b, "B", -10, 5) + name(c, "C", 10, 5) + name(d, "D", 9, -7)
    + name(e, "E", -11, 0) + name(ff, "F", 11, 0) + name(g, "G", 0, 13) + name(hh, "H", 11, 2) + name(p, "P", -9, -8, 12) + name(q, "Q", 0, -11, 12), 230);
}
function q9() {
  // AB 6, AC 12, ∠BAD = ∠DAC = 60°
  const A = P(0, 0), C = P(12, 0), B = pol(-120, 6), D = meet(A, pol(-60, 5), B, C);
  const { T, h } = fit([A, B, C], { w: 290, maxH: 170, pad: 26 });
  const [a, b, c, d] = [A, B, C, D].map(T);
  return svg(290, h, "삼각형 ABC와 선분 AD",
    poly([a, b, c], { fill: tint.yellow }) + seg(a, d)
    + arcAt(a, b, d, 16, "60°", { lr: 30 }) + arcAt(a, d, c, 22, "60°", { lr: 36 })
    + along(b, a, "6㎝", -13) + along(a, c, "12㎝", -12)
    + name(a, "A", -6, -10) + name(b, "B", -10, 6) + name(c, "C", 11, 0) + name(d, "D", 4, 13), 290);
}
function q10() {
  // 한 변 10㎝인 정사각형, E는 CB의 연장선 위, 직선 DE가 AB와 F에서 만난다
  const B = P(0, 0), C = P(10, 0), A = P(0, 10), D = P(10, 10), E = P(-6.2, 0), F = meet(E, D, A, B);
  const { T, h } = fit([A, C, D, E], { w: 260, maxH: 190, pad: 24 });
  const [a, b, c, d, e, ff] = [A, B, C, D, E, F].map(T);
  return svg(260, h, "정사각형 ABCD와 직선 ED",
    poly([a, b, c, d], { fill: tint.green }) + seg(e, b) + seg(e, d)
    + name(a, "A", -6, -9) + name(b, "B", 0, 13) + name(c, "C", 0, 13) + name(d, "D", 6, -9) + name(e, "E", 0, 13) + name(ff, "F", -11, -6), 260);
}
function q11() {
  // 정사각형: M은 BC의 중점, N은 CD의 중점
  const A = P(0, 2), B = P(0, 0), C = P(2, 0), D = P(2, 2), M = P(1, 0), N = P(2, 1);
  const Pp = meet(A, M, B, N), Q = meet(A, C, B, N);
  const { T, h } = fit([A, B, C, D], { w: 220, maxH: 210, pad: 24 });
  const [a, b, c, d, m, n, p, q] = [A, B, C, D, M, N, Pp, Q].map(T);
  return svg(220, h, "정사각형 ABCD와 선분 AM, AC, BN",
    poly([a, b, c, d], { fill: tint.blue }) + seg(a, m) + seg(a, c) + seg(b, n)
    + name(a, "A", -9, -7) + name(b, "B", -10, 5) + name(c, "C", 10, 5) + name(d, "D", 9, -7) + name(m, "M", 0, 13) + name(n, "N", 11, 0)
    + name(p, "P", -10, -6, 12) + name(q, "Q", 0, -11, 12), 220);
}
function q12() {
  // BE : EC = 4 : 3, GF : FE = 5 : 4 — G는 CA의 연장선 위, F는 GE와 AB의 교점
  const B = P(0, 0), C = P(7, 0), E = P(4, 0), A = P(4.3, 4.25);
  const ratio = (t) => { const G = lerp(C, A, t), Fp = meet(G, E, B, A); return len(G, Fp) / len(Fp, E) - 1.25; };
  let lo = 1.01, hi = 4;
  for (let i = 0; i < 60; i += 1) { const m = (lo + hi) / 2; if (ratio(lo) * ratio(m) <= 0) hi = m; else lo = m; }
  const G = lerp(C, A, lo), F = meet(G, E, B, A);
  const { T, h } = fit([A, B, C, G], { w: 230, maxH: 220, pad: 22 });
  const [a, b, c, e, g, ff] = [A, B, C, E, G, F].map(T);
  return svg(230, h, "삼각형 ABC와 점 G에서 그은 선분 GE",
    poly([a, b, c], { fill: tint.yellow }) + seg(g, a) + seg(g, e)
    + name(a, "A", 10, -4) + name(b, "B", -10, 4) + name(c, "C", 10, 4) + name(e, "E", 0, 13) + name(g, "G", 0, -10) + name(ff, "F", -11, -4), 230);
}

// ── 3단원 대칭변환
function q13() {
  const O = P(0, 0), X = P(10.8, 0), Y = pol(30, 10.8), Pp = pol(14, 8), Q = P(7, 0), Rr = pol(30, 5.6);
  const { T, h } = fit([O, X, Y, P(0, -0.6)], { w: 300, maxH: 190, pad: 20 });
  const [o, x, y, p, q, r] = [O, X, Y, Pp, Q, Rr].map(T);
  return svg(300, h, "30도를 이루는 반직선 OX, OY와 삼각형 PQR",
    poly([p, q, r], { fill: tint.yellow }) + ray(o, x) + ray(o, y) + seg(o, p, { dash: "4 4", width: 1.3 })
    + arcAt(o, x, y, 34) + small(at(o, 50, 6), "30°", 11.5, UT.red)
    + name(o, "O", -10, 3) + name(x, "X", 4, 13) + name(y, "Y", 8, -6) + name(p, "P", 10, 0) + name(q, "Q", 0, 13) + name(r, "R", -4, -12), 300);
}
function q14() {
  // 다리 놓기: 학교는 위 강가에서 200, 집은 아래 강가에서 400, 강 폭 300, 동서로 800 (수학 좌표, 단위 m)
  const S = P(0, 900), H = P(800, 0), top = 700, bot = 400;
  const { T, h } = fit([P(-160, 0), P(1000, 960)], { w: 290, maxH: 210, pad: 18 });
  const [s, hh] = [S, H].map(T);
  const r1 = T(P(-160, top)), r2 = T(P(1000, bot));
  const river = `<rect x="${f(r1.x)}" y="${f(r1.y)}" width="${f(r2.x - r1.x)}" height="${f(r2.y - r1.y)}" fill="${tint.blue}"/>`
    + seg(T(P(-160, top)), T(P(1000, top)), { stroke: UT.blue, width: 1.4 }) + seg(T(P(-160, bot)), T(P(1000, bot)), { stroke: UT.blue, width: 1.4 });
  const dash = { dash: "4 4", width: 1.2 };
  const sTop = T(P(0, top)), sBot = T(P(0, bot)), o = T(P(0, 0)), hBank = T(P(800, bot));
  return svg(290, h + 10, "강을 사이에 둔 학교와 집",
    river + seg(s, sTop, dash) + seg(sBot, o, dash) + seg(o, hh, dash) + seg(hh, hBank, dash) + rightAt(o, sBot, hh, 7)
    + along(sTop, s, "200m", -1) + along(hh, hBank, "400m", 1)
    + along(o, hh, "800m", 1) + along(T(P(930, bot)), T(P(930, top)), "300m", -1)
    + dot(s, 3) + dot(hh, 3) + small(P(s.x + 22, s.y + 4), "학교", 12) + small(P(hh.x + 2, hh.y + 17), "집", 12), 290);
}
function q15() {
  // ∠C = 2∠B, AC 12 — ∠B를 조금씩 바꿔 가며 이등분선이 만든 DC가 8이 되는 모양을 찾는다(길이는 그림 속에 적지 않음)
  const shape = (b) => { const C = P(0, 0), A = pol(180 - 2 * b, 12), B = meet(A, pol(180 + b, 1, A), C, P(-1, 0)), D = meet(A, lerp(B, C, len(A, B) / (len(A, B) + 12)), B, C); return { A, B, C, D }; };
  let lo = 20, hi = 50;
  for (let i = 0; i < 60; i += 1) { const m = (lo + hi) / 2; if (len(shape(m).D, shape(m).C) > 8) lo = m; else hi = m; }
  const { A, B, C, D } = shape(lo);
  const { T, h } = fit([A, B, C], { w: 290, maxH: 190, pad: 26 });
  const [a, b, c, d] = [A, B, C, D].map(T);
  return svg(290, h, "삼각형 ABC와 각 A의 이등분선 AD",
    poly([a, b, c], { fill: tint.purple }) + seg(a, d) + bisectDots(a, b, c, 18)
    + along(c, a, "12㎝", 14) + along(c, d, "8㎝", -13)
    + name(a, "A", 0, -10) + name(b, "B", -10, 4) + name(c, "C", 10, 4) + name(d, "D", -2, 13), 290);
}
function q16() {
  // 직각이등변삼각형 ABC(AC = BC, ∠C = 90°), AD = AC, DE ⊥ AB, CE = 6
  const a = 6 / (Math.SQRT2 - 1), B = P(0, 0), C = P(a, 0), A = P(a, a), D = lerp(A, B, 1 / Math.SQRT2), E = P(a - 6, 0);
  const { T, h } = fit([A, B, C], { w: 240, maxH: 210, pad: 24 });
  const [aa, b, c, d, e] = [A, B, C, D, E].map(T);
  return svg(240, h, "직각이등변삼각형 ABC와 선분 AE, DE",
    poly([aa, b, c], { fill: tint.yellow }) + poly([b, d, e], { fill: SHADE, stroke: UT.orange }) + poly([aa, b, c]) + seg(aa, e) + seg(d, e)
    + rightAt(c, aa, b, 9) + rightAt(d, b, e, 8) + along(c, e, "6㎝", -13)
    + name(aa, "A", 0, -10) + name(b, "B", -10, 4) + name(c, "C", 10, 4) + name(d, "D", -10, -6) + name(e, "E", 0, 13), 240);
}
function q17() {
  // 평행사변형: AD 18, DC 12, ∠A 64°. 각 A의 이등분선 위의 H에서 DE ⊥ AH
  const A = P(0, 0), D = P(18, 0), B = pol(-64, 12), C = P(B.x + 18, B.y);
  const u = pol(-32), H = P(u.x * (D.x * u.x + D.y * u.y), u.y * (D.x * u.x + D.y * u.y));
  const E = meet(D, H, B, C);
  const { T, h } = fit([A, B, C, D], { w: 300, maxH: 210, pad: 32 });
  const [a, b, c, d, hh, e] = [A, B, C, D, H, E].map(T);
  return svg(300, h, "평행사변형 ABCD와 각 A의 이등분선 AH, 선분 DE",
    poly([a, b, c, d], { fill: tint.green }) + seg(a, hh) + seg(d, e) + bisectDots(a, b, d, 18) + rightAt(hh, a, d, 8)
    + along(c, d, "12㎝", 16) + along(b, c, "18㎝", 19)
    + name(a, "A", -8, -9) + name(d, "D", 8, -9) + name(b, "B", -10, 6) + name(c, "C", 10, 6) + name(e, "E", -4, 13) + name(hh, "H", -14, 3), 300);
}
function q18() {
  // 사다리꼴 AD // BC, CE는 각 C의 이등분선, CE ⊥ AB, AE : EB = 1 : 3
  const B = P(0, 0), Fd = pol(63, 6), E = lerp(B, Fd, 0.5), t = E.y / Math.cos(63 * R), C = P(E.x + t * Math.sin(63 * R), 0);
  const A = lerp(B, Fd, 4 / 6), D = lerp(Fd, C, 2 / 6);
  const { T, h } = fit([A, B, C, D], { w: 270, maxH: 180, pad: 24 });
  const [a, b, c, d, e] = [A, B, C, D, E].map(T);
  return svg(270, h, "사다리꼴 ABCD와 각 C의 이등분선 CE",
    poly([a, b, c, d], { fill: tint.yellow }) + seg(c, e) + rightAt(e, b, c, 8) + bisectDots(c, b, d, 26)
    + name(a, "A", -6, -9) + name(d, "D", 8, -8) + name(b, "B", -10, 4) + name(c, "C", 10, 4) + name(e, "E", -11, -3), 270);
}
function q19() {
  // △ABC에서 ∠B, ∠C의 이등분선에 A에서 내린 수선의 발 P, Q (삼각형 모양은 대강 — 길이는 글에만)
  const B = P(0, 0), C = P(10, 0), A = P(4.4, 6.2);
  const Bd = lerp(A, C, len(A, B) / (len(A, B) + len(B, C))), Cd = lerp(A, B, len(A, C) / (len(A, C) + len(B, C)));
  const foot = (p, a, b) => { const dx = b.x - a.x, dy = b.y - a.y, t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy); return lerp(a, b, t); };
  const Pp = foot(A, B, Bd), Q = foot(A, C, Cd);
  const { T, h } = fit([A, B, C], { w: 290, maxH: 200, pad: 24 });
  const [a, b, c, bd, cd, p, q] = [A, B, C, Bd, Cd, Pp, Q].map(T);
  return svg(290, h, "삼각형 ABC와 두 각의 이등분선, 점 A에서 내린 수선 AP, AQ",
    poly([a, b, c], { fill: tint.green }) + seg(b, bd) + seg(c, cd) + seg(a, p) + seg(a, q) + seg(p, q, { stroke: UT.orange, width: 1.8 })
    + bisectDots(b, a, c, 20) + bisectDots(c, a, b, 20) + rightAt(p, a, b, 7) + rightAt(q, a, c, 7)
    + name(a, "A", 0, -10) + name(b, "B", -10, 4) + name(c, "C", 10, 4) + name(p, "P", 6, 13, 12) + name(q, "Q", -6, 13, 12), 290);
}

// ── 4단원 회전변환
function q20() {
  // 직사각형: M은 AB의 중점, E는 MD 위, BE = BC, ∠BEM = 24° 가 되도록 세로 0.888
  const w = 10, hgt = 8.88, A = P(0, hgt), B = P(0, 0), C = P(w, 0), D = P(w, hgt), M = P(0, hgt / 2);
  const u = P(D.x - M.x, D.y - M.y), qa = u.x * u.x + u.y * u.y, qb = 2 * (M.x * u.x + M.y * u.y), qc = M.x * M.x + M.y * M.y - w * w;
  const s = (-qb + Math.sqrt(qb * qb - 4 * qa * qc)) / (2 * qa), E = P(M.x + u.x * s, M.y + u.y * s);
  const { T, h } = fit([A, B, C, D], { w: 260, maxH: 220, pad: 24 });
  const [a, b, c, d, m, e] = [A, B, C, D, M, E].map(T);
  return svg(260, h, "직사각형 ABCD와 선분 MD, BE, EC",
    poly([a, b, c, d], { fill: tint.blue }) + seg(m, d) + seg(b, e) + seg(e, c)
    + ticks(a, m, 2) + ticks(m, b, 2) + ticks(b, e) + ticks(b, c)
    + arcAt(e, b, m, 18, "24°", { lr: 46, size: 11 }) + arcAt(c, b, e, 16)
    + name(a, "A", -10, -4) + name(b, "B", -10, 4) + name(c, "C", 10, 4) + name(d, "D", 10, -4) + name(m, "M", -12, 0) + name(e, "E", 13, 3), 260);
}
function q21() {
  // 정사각형: ∠AFD = 67°, ∠FDE = 45°
  const A = P(0, 10), B = P(0, 0), C = P(10, 0), D = P(10, 10), F = P(0, 10 - 10 / Math.tan(67 * R));
  const df = Math.atan2(F.y - D.y, F.x - D.x) / R, E = meet(D, pol(df + 45, 5, D), B, C);
  const { T, h } = fit([A, B, C, D], { w: 230, maxH: 220, pad: 24 });
  const [a, b, c, d, e, ff] = [A, B, C, D, E, F].map(T);
  return svg(230, h, "정사각형 ABCD와 삼각형 DFE",
    poly([a, b, c, d], { fill: "#fff" }) + poly([d, ff, e], { fill: tint.yellow }) + poly([a, b, c, d], { fill: "none" })
    + arcAt(ff, a, d, 16, "67°", { lr: 30 }) + arcAt(d, ff, e, 20, "45°", { lr: 34 }) + arcAt(e, ff, d, 14)
    + name(a, "A", -9, -7) + name(b, "B", -10, 5) + name(c, "C", 10, 5) + name(d, "D", 9, -7) + name(e, "E", 0, 13) + name(ff, "F", -11, 0), 230);
}
function q22() {
  // 정사각형, E는 BC 위, F는 ∠DAE의 이등분선과 CD가 만나는 점(그림 칸에 맞춘 크기)
  const A = P(0, 10), B = P(0, 0), C = P(10, 0), D = P(10, 10), E = P(7.5, 0);
  const ang = (q) => Math.atan2(q.y - A.y, q.x - A.x) / R, F = meet(A, pol((ang(E) + ang(D)) / 2, 1, A), C, D);
  const { T, h } = fit([A, B, C, D], { w: 230, maxH: 210, pad: 26 });
  const [a, b, c, d, e, ff] = [A, B, C, D, E, F].map(T);
  return svg(230, h, "정사각형 ABCD와 선분 AE, AF",
    poly([a, b, c, d], { fill: tint.blue }) + seg(a, e) + seg(a, ff) + bisectDots(a, e, d, 22)
    + along(b, e, "9㎝", 13) + along(d, ff, "6㎝", -17)
    + name(a, "A", -9, -7) + name(b, "B", -10, 5) + name(c, "C", 10, 5) + name(d, "D", 9, -7) + name(e, "E", 0, 13) + name(ff, "F", 11, 0), 230);
}
function q23() {
  // 정삼각형 안의 점 P: BP 4, CP 2√3 — 한 변을 조금씩 바꿔 가며 AP가 2가 되는 크기를 찾는다
  const place = (s) => { const px = (16 - 12 + s * s) / (2 * s); return { s, Pp: P(px, Math.sqrt(Math.max(0, 16 - px * px))), A: P(s / 2, s * Math.sqrt(3) / 2) }; };
  let lo = 4.2, hi = 7;
  for (let i = 0; i < 60; i += 1) { const m = (lo + hi) / 2, t = place(m); if (len(t.A, t.Pp) < 2) lo = m; else hi = m; }
  const { s, Pp, A } = place(lo), B = P(0, 0), C = P(s, 0);
  const { T, h } = fit([A, B, C], { w: 240, maxH: 210, pad: 22 });
  const [a, b, c, p] = [A, B, C, Pp].map(T);
  return svg(240, h, "정삼각형 ABC 안의 점 P",
    poly([a, b, c], { fill: tint.green }) + seg(a, p) + seg(b, p) + seg(c, p)
    + along(a, p, "2", 9) + along(b, p, "4", 11) + along(p, c, "2√3", 16)
    + name(a, "A", 0, -10) + name(b, "B", -10, 4) + name(c, "C", 10, 4) + name(p, "P", -10, 2), 240);
}
function q24() {
  // AB 8, BC 7, ∠B 60°. F는 삼각형 안의 한 점(페르마포인트 자리가 아닌 아무 점)
  const B = P(0, 0), C = P(7, 0), A = pol(60, 8), F = P(3.3, 2.1);
  const { T, h } = fit([A, B, C], { w: 250, maxH: 210, pad: 24 });
  const [a, b, c, ff] = [A, B, C, F].map(T);
  const dash = { dash: "4 3", width: 1.2 };
  return svg(250, h, "삼각형 ABC와 내부의 점 F",
    poly([a, b, c], { fill: tint.purple }) + seg(ff, a, dash) + seg(ff, b, dash) + seg(ff, c, dash) + dot(ff, 2.4)
    + arcAt(b, c, a, 18, "60°", { lr: 32 }) + along(b, a, "8", -12) + along(c, b, "7", -13)
    + name(a, "A", 0, -10) + name(b, "B", -10, 4) + name(c, "C", 10, 4) + name(ff, "F", 9, -6, 12), 250);
}
function q25() {
  // 한 변 10인 정삼각형 ABC, 변 BC 아래쪽의 점 D: ∠ADB = ∠ADC = 60°, AD 11 (D가 BC에 가까워 각 글자는 글에만 둔다)
  const s = 10, B = P(0, 0), C = P(s, 0), A = P(s / 2, s * Math.sqrt(3) / 2), O = P(s / 2, s / (2 * Math.sqrt(3))), r = s / Math.sqrt(3);
  let lo = -150, hi = -30;
  for (let i = 0; i < 60; i += 1) { const m = (lo + hi) / 2; if (len(A, pol(m, r, O)) < 11) hi = m; else lo = m; }
  const D = pol(lo, r, O);
  const { T, h } = fit([A, B, C, D], { w: 240, maxH: 220, pad: 24 });
  const [a, b, c, d] = [A, B, C, D].map(T);
  return svg(240, h, "정삼각형 ABC와 점 D",
    poly([a, b, c], { fill: tint.yellow }) + poly([b, d, c], { fill: "none" }) + seg(a, d)
    + arcAt(d, a, b, 11) + arcAt(d, a, c, 14)
    + along(b, a, "10㎝", -14) + along(a, d, "11㎝", 22)
    + name(a, "A", 0, -10) + name(b, "B", -10, 4) + name(c, "C", 10, 4) + name(d, "D", 0, 14), 240);
}

const Q = (number, prompt, figure, answer = { label: "답" }) => ({ number, prompt, figure, answer });
const unit = (u, label = "답") => ({ label, unit: u });
export const questions = [
  Q(1, "다음 그림의 직각삼각형 ABC에서 (선분 AB) = 16㎝, (선분 AC) = 20㎝, 점 M은 선분 BC의 중점입니다. 꼭짓점 A에서 선분 BC에 내린 수선의 발을 H라 하고, 점 M을 지나 선분 AH와 평행한 직선이 선분 AC와 만나는 점을 D라 할 때, △DHC의 넓이는 얼마입니까?", q1, unit("㎠")),
  Q(2, "그림과 같이 선분 AB와 선분 DC가 평행인 사다리꼴 ABCD의 꼭짓점 B를 지나고 선분 AD와 평행인 직선과, 점 D를 지나고 선분 AC에 평행인 직선의 교점을 E라 합니다. (선분 DC) = 12㎝, (선분 AB) = 18㎝, △EDC = 30㎠일 때, △DAC의 넓이는 얼마입니까?", q2, unit("㎠")),
  Q(3, "다음 그림의 △ABC에서 △PAB : △PAC : △PBC = 4 : 5 : 6일 때, 다음을 구하시오.", q3, [{ label: "(1) (선분 BD) : (선분 DC) =" }, { label: "(2) (선분 AP) : (선분 PD) =" }]),
  Q(4, "다음 그림의 삼각형 ABC에서 (선분 BD) : (선분 DC) = (선분 AF) : (선분 FB) = (선분 CE) : (선분 EA) = 1 : 3일 때, (1) (선분 BQ) : (선분 QR) : (선분 RE)를 구하시오. (2) △PQR의 넓이는 △ABC의 넓이의 몇 배입니까?", q4, [{ label: "(1)" }, { label: "(2)", unit: "배" }]),
  Q(5, "다음 △ABC에서 (선분 AF) = (선분 FC), (선분 BD) : (선분 DC) = 2 : 5, △EBD = 4㎠일 때, △ABC의 넓이를 구하시오.", q5, unit("㎠")),
  Q(6, "다음 그림에서 점 C, E는 각각 선분 BF, 선분 AC의 중점이고, (선분 BD) = 24㎝일 때, 선분 AD의 길이를 구하시오.", q6, unit("㎝")),
  Q(7, "평행사변형 ABCD의 넓이는 56㎠이고, (선분 AE) : (선분 ED) = 1 : 3일 때, 다음을 구하시오. (1) (선분 EF) : (선분 FC) (2) △EFD의 넓이는 얼마입니까?", q7, [{ label: "(1)" }, { label: "(2)", unit: "㎠" }]),
  Q(8, "다음 그림은 정사각형 ABCD의 네 변을 4등분한 것입니다. 다음을 구하시오. (1) (선분 EP) : (선분 PQ) : (선분 QF) (2) △APQ : □ABCD", q8, [{ label: "(1)" }, { label: "(2)" }]),
  Q(9, "다음 그림에서 선분 AD의 길이를 구하시오.", q9, unit("㎝")),
  Q(10, "다음 그림에서 사각형 ABCD는 한 변의 길이가 10㎝인 정사각형입니다. △AFD의 넓이가 △EBF의 넓이보다 10㎠ 더 넓을 때, 선분 AF의 길이를 구하시오.", q10, unit("㎝")),
  Q(11, "정사각형 ABCD에서 점 M, N은 각각 선분 BC, 선분 CD의 중점입니다. 다음 물음에 답하시오. (1) △ABC : △QCN은 얼마입니까? (2) □APND : △PBM은 얼마입니까?", q11, [{ label: "(1)" }, { label: "(2)" }]),
  Q(12, "다음 그림에서 (선분 BE) : (선분 EC) = 4 : 3, (선분 GF) : (선분 FE) = 5 : 4일 때, 다음을 구하시오. (1) (선분 BF) : (선분 FA) (2) (선분 GA) : (선분 AC) (3) △ABC : △GEC", q12, [{ label: "(1)" }, { label: "(2)" }, { label: "(3)" }]),
  Q(13, "그림과 같이 점 O를 교점으로 하는 30°의 각을 이루는 반직선 OX, OY가 있습니다. 두 반직선의 내부에 (선분 OP) = 8㎝인 정점 P를 정하고 반직선 OX, OY 위를 움직이는 동점 Q, R을 생각할 때, △PQR의 둘레의 최소 길이는 얼마입니까?", q13, unit("㎝")),
  Q(14, "다음 그림과 같이 집은 강 아래쪽 강가에서 400m, 학교는 강 위쪽 강가에서 200m 떨어져 있고, 집과 학교는 동서로 800m 떨어져 있으며, 강의 폭은 300m입니다. 집에서 학교까지 가장 짧은 길로 갈 수 있게 강을 가로질러 수직으로 다리를 놓을 때, 집에서 학교까지 가는 최단 거리는 몇 m입니까? (단, 양쪽 강가는 서로 평행하고, 다리의 폭은 생각하지 않습니다.)", q14, unit("m")),
  Q(15, "다음 그림의 △ABC에서 ∠A의 이등분선이 선분 BC와 만나는 점을 D라 합니다. ∠C = 2∠B, (선분 AC) = 12㎝, (선분 DC) = 8㎝일 때, 선분 AB의 길이를 구하시오.", q15, unit("㎝")),
  Q(16, "다음 그림의 △ABC는 (선분 AC) = (선분 BC)인 직각이등변삼각형입니다. (선분 AC) = (선분 AD), 선분 DE ⊥ 선분 AB, (선분 CE) = 6㎝일 때, △BDE의 넓이를 구하시오.", q16, unit("㎠")),
  Q(17, "다음 그림과 같은 평행사변형 ABCD에서 각 A의 이등분선과 선분 DE가 수직으로 만납니다. 선분 BE의 길이를 구하시오.", q17, unit("㎝")),
  Q(18, "그림과 같은 사다리꼴 ABCD에서 선분 CE는 각 C의 이등분선이고, 선분 CE ⊥ 선분 AB, (선분 AE) : (선분 EB) = 1 : 3, △EBC = 18㎠일 때, □AECD의 넓이를 구하시오.", q18, unit("㎠")),
  Q(19, "△ABC의 ∠B, ∠C의 이등분선에 점 A에서 내린 수선의 발을 각각 P, Q라 하고, (선분 PQ) = 5㎝, △ABC의 둘레의 길이가 42㎝라 할 때, 선분 BC의 길이는 얼마입니까?", q19, unit("㎝")),
  Q(20, "다음 그림과 같은 직사각형 ABCD에서 점 M은 선분 AB의 중점이고, (선분 BE) = (선분 BC)입니다. ∠BEM = 24°일 때, ∠BCE의 크기를 구하시오.", q20, unit("°")),
  Q(21, "다음 그림에서 사각형 ABCD는 정사각형입니다. 각 FED의 크기를 구하시오.", q21, unit("°")),
  Q(22, "정사각형 ABCD에서 선분 BC 위의 한 점 E에 대하여 ∠DAE의 이등분선이 선분 CD와 만나는 점을 F라 합니다. (선분 DF) = 6㎝, (선분 BE) = 9㎝일 때, 정사각형의 한 변의 길이를 구하시오.", q22, unit("㎝")),
  Q(23, "그림과 같이 정삼각형 ABC의 내부에 (선분 AP) = 2, (선분 BP) = 4, (선분 CP) = 2√3을 만족하는 점 P가 있습니다. 이 정삼각형의 한 변 AB의 길이는 얼마입니까?", q23),
  Q(24, "다음 그림의 △ABC에서 내부의 점 F에 대하여 (선분 AF) + (선분 BF) + (선분 CF)의 값을 가장 작게 하는 점 F를 △ABC의 페르마포인트라고 합니다. (선분 AB) = 8, (선분 BC) = 7, ∠B = 60°일 때, (선분 AF) + (선분 BF) + (선분 CF)의 최솟값을 구하시오.", q24),
  Q(25, "다음 그림에서 삼각형 ABC는 한 변의 길이가 10㎝인 정삼각형이고, 점 D는 변 BC를 사이에 두고 점 A의 반대쪽에 있습니다. ∠ADB = ∠ADC = 60°, (선분 AD) = 11㎝일 때, (선분 BD) + (선분 DC)의 값을 구하시오.", q25, unit("㎝")),
];
