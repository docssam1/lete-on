// 3과정 G2 「원과 사이클로이드」 권별 테스트 — 드라이브 원문(3과정-G2N20 테스트, 25문항)을 우리 시험지 꼴로 다시 짠 것(원장 2026-11-15).
// 내용 대조: 같은 권 본책 N20판 「원과 사이클로이드」의 네 단원과 맞는 것을 확인했다(N11판 「원과 부채꼴」 짝 테스트 3과정-G2N에는
// 피타고라스·히포크라테스 문항이 없다). 2번 고깔 굴리기 · 3번 원 안의 정사각형 · 4번 직각삼각형 회전 · 5번 15° 반원 · 6번 지구 둘레 끈 ·
// 7번 송아지 끈 · 8번 원통 묶는 실 · 9번 ㉮㉯ 넓이 같은 부채꼴 · 12번 원 안 직사각형은 본책 문제와 같은 꼴이다.
//   원과 부채꼴: 1~6번, 25번(회전) · 사이클로이드(곡선으로 둘러싸인 도형): 7~12번 ·
//   삼각형의 외심과 내심: 13~18번 · 히포크라테스의 초승달(피타고라스의 정리·직각삼각형의 닮음): 19~24번
// 글·수·배치는 원문 그대로(12번 「반지름 6cm 때」만 「반지름이 6cm일 때」로). 그림은 원문 그림의 꼴을 따라 주어진 수에 맞게
// 바르게 다시 그렸다(선은 검정, 색칠한 부분은 연두 · 두 부분을 견주는 9·12번의 둘째 부분은 주황, 길이 점선은 갈색, 각 표시는 빨강).
// 17번은 원문 그림의 길이(접선 길이 8·10·6cm)대로 그렸다 — 이 길이면 내접원 반지름은 4cm보다 조금 크다(원문 조건 그대로 둠).
// 정답은 여기 두지 않는다(비공개 자리에만).
import { UT, text, svg, line, mark } from "../selection-test-originals/kit.js?v=20261114a";
import { lenArc } from "../course2-test-originals/len-arc.js?v=20261124a";

export const perPage = 4;
export const meta = { course: "3과정", book: "G2", title: "원과 사이클로이드" };

const R = Math.PI / 180;
const f = (n) => (Math.round(n * 10) / 10).toString();
const P = (x, y) => ({ x, y });
const at = (c, r, deg) => P(c.x + r * Math.cos(deg * R), c.y - r * Math.sin(deg * R));
const lerp = (a, b, t) => P(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
const dir = (a, b) => Math.atan2(-(b.y - a.y), b.x - a.x) / R;
const dist = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
const INK = UT.ink;
const SHADE = UT.greenSoft;
const SHADE2 = UT.orangeSoft;
const pts = (list) => list.map((p) => `${f(p.x)},${f(p.y)}`).join(" ");
const poly = (list, { fill = "none", stroke = INK, width = 1.6, dash = "" } = {}) =>
  `<polygon points="${pts(list)}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const seg = (a, b, opts) => line(f(a.x), f(a.y), f(b.x), f(b.y), opts);
const circle = (c, r, { fill = "none", stroke = INK, width = 1.6, dash = "" } = {}) =>
  `<circle cx="${f(c.x)}" cy="${f(c.y)}" r="${f(r)}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const dot = (c, r = 2.6, fill = INK) => `<circle cx="${f(c.x)}" cy="${f(c.y)}" r="${r}" fill="${fill}"/>`;
const small = (p, value, size = 12, fill = INK) => text(f(p.x), f(p.y), value, { size, weight: 600, fill });
const name = (p, value, size = 13) => text(f(p.x), f(p.y), value, { size, weight: 700 });
const path = (d, { fill = "none", stroke = INK, width = 1.6 } = {}) =>
  `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round"/>`;
const M = (p) => `M${f(p.x)} ${f(p.y)}`;
const L = (p) => `L${f(p.x)} ${f(p.y)}`;
// 중심 c, 반지름 r 인 원에서 각 from → to 로 가는 호(각은 수학 방향: 시계 반대가 +)
function arcTo(c, r, from, to) {
  const e = at(c, r, to), span = to - from;
  return `A${f(r)} ${f(r)} 0 ${Math.abs(span) > 180 ? 1 : 0} ${span > 0 ? 0 : 1} ${f(e.x)} ${f(e.y)}`;
}
const arc = (c, r, from, to, opts) => path(`${M(at(c, r, from))}${arcTo(c, r, from, to)}`, opts);
function meet(a1, a2, b1, b2) {
  const d = (a2.x - a1.x) * (b2.y - b1.y) - (a2.y - a1.y) * (b2.x - b1.x);
  const t = ((b1.x - a1.x) * (b2.y - b1.y) - (b1.y - a1.y) * (b2.x - b1.x)) / d;
  return lerp(a1, a2, t);
}
// 점 p 에서 직선 ab 에 내린 수선의 발
function foot(p, a, b) {
  const dx = b.x - a.x, dy = b.y - a.y, t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy);
  return P(a.x + dx * t, a.y + dy * t);
}
// 꼭짓점 c에서 c→p1, c→p2 사이 작은 쪽 각에 호
function angleArc(c, p1, p2, r, { color = UT.red, width = 1.4 } = {}) {
  let a1 = dir(c, p1), a2 = dir(c, p2);
  let span = ((a2 - a1) % 360 + 360) % 360;
  if (span > 180) { [a1, a2] = [a2, a1]; span = 360 - span; }
  return { path: arc(c, r, a1, a1 + span, { stroke: color, width }), mid: a1 + span / 2 };
}
// 직각 표시
function rightMark(v, p1, p2, s = 7) {
  const u = (p) => { const l = dist(v, p); return P((p.x - v.x) / l * s, (p.y - v.y) / l * s); };
  const a = u(p1), b = u(p2);
  return `<polyline points="${pts([P(v.x + a.x, v.y + a.y), P(v.x + a.x + b.x, v.y + a.y + b.y), P(v.x + b.x, v.y + b.y)])}" fill="none" stroke="${INK}" stroke-width="1"/>`;
}
// 길이 표시: a~b 바깥 곡선 점선 + 끊은 자리에 글자(스킬 gfield-textbook-design 4-3, 원장 2026-11-24).
// side 1 = a→b 진행 방향의 (−dy, dx) 쪽(y가 아래로 커지므로 오른쪽으로 갈 때는 아래). far = 더 띄울 만큼 · halo = 다른 선 위에 놓이는 글자에 흰 테.
const brace = (a, b, label, { side = 1, far = 0, halo = false, bend = null } = {}) => lenArc(a, b, label, { side, far, halo, bend });
// 점 p가 a→b의 어느 쪽인지(brace의 side 약속으로)
const toward = (a, b, p) => (-(b.y - a.y) * (p.x - a.x) + (b.x - a.x) * (p.y - a.y) >= 0 ? 1 : -1);
// 글자 둘레에 흰 테(선 위에서도 읽히게)
const halo = (markup) => markup.replace('style="', 'style="paint-order:stroke;stroke:#fff;stroke-width:3.5px;stroke-linejoin:round;');
const italic = (p, value, size = 15) =>
  `<text x="${f(p.x)}" y="${f(p.y)}" text-anchor="middle" dominant-baseline="central" style="font-size:${size}px;font-weight:600;font-style:italic;font-family:'Times New Roman',serif;fill:${INK};text-anchor:middle;dominant-baseline:central">${value}</text>`;
// 수학 좌표(위가 +) → 그림 좌표
const grid = (ox, oy, k) => (x, y) => P(ox + x * k, oy - y * k);

// ── 1~6번 (원과 부채꼴)
function q1() {
  const k = 11, T = grid(110, 100, k), O = T(0, 0);
  const left = T(-3, 0), right = T(5, 0), touch = T(2, 0);
  return svg(220, 200, "지름이 10cm, 6cm인 두 원을 품은 큰 원",
    circle(O, 8 * k, { fill: SHADE }) + circle(left, 5 * k, { fill: "#fff" }) + circle(right, 3 * k, { fill: "#fff" })
    + seg(T(-8, 0), T(8, 0), { width: 1.4 }) + dot(left) + dot(right)
    + brace(T(-8, 0), touch, "10cm") + brace(touch, T(8, 0), "6cm"), 220);
}
function q2() {
  // 고깔 밑면 반지름(3cm) 길이 표시가 왼쪽에 들어가도록 그림을 오른쪽으로 18 옮기고 폭을 늘림
  const k = 6.6, T = grid(140, 104, k), O = T(0, 0), base = Math.sqrt(15 * 15 - 9);
  const top = T(-base, 3), bot = T(-base, -3), bc = T(-base, 0);
  return svg(262, 212, "반지름 15cm인 원 위를 굴러가는 고깔",
    circle(O, 15 * k) + seg(O, T(15, 0), { width: 1.2 })
    + poly([O, top, bot], { fill: UT.yellowSoft, stroke: INK, width: 1.5 })
    + `<ellipse cx="${f(bc.x)}" cy="${f(bc.y)}" rx="${f(0.9 * k)}" ry="${f(3 * k)}" fill="${UT.yellowSoft}" stroke="${INK}" stroke-width="1.5"/>`
    + seg(bc, top, { stroke: UT.line, width: 1.1, dash: "3 2.5" })
    + brace(top, bc, "3cm", { side: 1, halo: true }) + dot(O) + name(P(O.x, O.y + 14), "O")
    + brace(O, T(15, 0), "15cm", { side: -1 }), 258);
}
function q3() {
  const h = 84, c = P(100, 96), d = h / Math.SQRT2;
  return svg(200, 210, "정사각형 안의 원, 원 안의 정사각형",
    poly([P(c.x - h, c.y - h), P(c.x + h, c.y - h), P(c.x + h, c.y + h), P(c.x - h, c.y + h)])
    + circle(c, h, { fill: SHADE }) + poly([P(c.x - d, c.y - d), P(c.x + d, c.y - d), P(c.x + d, c.y + d), P(c.x - d, c.y + d)], { fill: "#fff" })
    + dot(c) + brace(P(c.x - h, c.y + h), P(c.x + h, c.y + h), "12cm"), 200);
}
function q4() {
  const k = 8.6, T = grid(160, 160, k), C = T(0, 0);
  const B = T(-16, 0), A = at(C, 8 * k, 120), B2 = at(C, 16 * k, 30), A2 = at(C, 8 * k, -30);
  const region = path(`${M(B)}${arcTo(C, 16 * k, 180, 30)}${L(A2)}${arcTo(C, 8 * k, -30, 120)}Z`, { fill: SHADE, stroke: "none" });
  const ang = angleArc(C, B, A, 15);
  return svg(310, 210, "점 C를 중심으로 돌린 직각삼각형",
    region + arc(C, 16 * k, 180, 30) + arc(C, 8 * k, -30, 120, { width: 1.3 })
    + poly([A, B, C]) + poly([A2, B2, C]) + rightMark(A, B, C) + rightMark(A2, B2, C)
    + ang.path + small(at(C, 28, ang.mid + 4), "60°", 11)
    + brace(C, A, "8cm", { side: -toward(C, A, B), halo: true })
    + name(P(A.x - 3, A.y - 11), "A") + name(P(B.x - 9, B.y + 5), "B") + name(P(C.x + 2, C.y + 13), "C")
    + name(P(B2.x + 12, B2.y - 2), "B′") + name(P(A2.x + 4, A2.y + 13), "A′"), 300);
}
function q5() {
  const k = 9, O = P(126, 130), r = 12 * k, A = at(O, r, 180), B = at(O, r, 0), C = at(O, r, 30);
  const ang = angleArc(A, B, C, 26);
  return svg(260, 170, "반원과 선분 AC",
    path(`${M(A)}${L(C)}${arcTo(O, r, 30, 180)}Z`, { fill: SHADE, stroke: "none" })
    + arc(O, r, 0, 180) + seg(A, B) + seg(A, C) + ang.path + halo(small(at(A, 54, ang.mid), "15°", 11))
    + dot(O) + name(P(O.x + 4, O.y + 13), "O") + name(P(A.x - 9, A.y + 2), "A") + name(P(B.x + 9, B.y + 2), "B") + name(P(C.x + 9, C.y - 8), "C")
    + brace(A, O, "12cm"), 250);
}

// ── 7~12번 (사이클로이드 · 곡선으로 둘러싸인 도형)
function q7() {
  const k = 8, x0 = 34, y0 = 52, w = 12 * k, h = 8 * k, K = P(x0 + w, y0 + h);
  const cow = P(K.x + 54, K.y + 42);
  return svg(250, 228, "가로 12m, 세로 8m인 직사각형 울타리와 귀퉁이에 묶인 송아지",
    poly([P(x0, y0), P(x0 + w, y0), K, P(x0, y0 + h)], { fill: UT.yellowSoft, stroke: UT.line, width: 2.2 })
    + brace(P(x0, y0), P(x0 + w, y0), "12m", { side: -1 }) + brace(P(x0, y0 + h), P(x0, y0), "8m", { side: -1 })
    + `<path d="${M(K)} C${f(K.x + 14)} ${f(K.y + 30)} ${f(K.x + 30)} ${f(K.y + 6)} ${f(cow.x - 14)} ${f(cow.y - 4)}" fill="none" stroke="${UT.line}" stroke-width="1.3"/>`
    + dot(K, 3) + `<rect x="${f(cow.x - 16)}" y="${f(cow.y - 10)}" width="40" height="20" rx="10" fill="#fff" stroke="${UT.soft}" stroke-width="1.2"/>`
    + small(P(cow.x + 4, cow.y), "송아지", 11), 250);
}
function q8() {
  const r = 22, x0 = 52, y0 = 128, s = r * Math.sqrt(3);
  const low = [0, 1, 2, 3].map((i) => P(x0 + i * 2 * r, y0)), high = [0, 1, 2].map((i) => P(x0 + r + i * 2 * r, y0 - s));
  const [c0, , , c3] = low, [t0, , t2] = high;
  const string = `${M(at(c0, r, -90))}${L(at(c3, r, -90))}${arcTo(c3, r, -90, 30)}${L(at(t2, r, 30))}${arcTo(t2, r, 30, 90)}`
    + `${L(at(t0, r, 90))}${arcTo(t0, r, 90, 150)}${L(at(c0, r, 150))}${arcTo(c0, r, 150, 270)}`;
  return svg(236, 162, "반지름 9cm인 원통 7개를 실로 묶은 모양",
    [...low, ...high].map((c) => circle(c, r, { fill: "#fff", width: 1.3 }) + dot(c, 1.8)).join("")
    + path(string, { stroke: UT.red, width: 1.8 }), 236);
}
function q9() {
  const k = 13, w = 4 * Math.PI, T = grid(26, 132, k);
  const A = T(0, 8), D = T(w, 8), B = T(0, 0), C = T(w, 0), E = T(w - 8, 0);
  const tilt = dir(C, A), X = at(C, 8 * k, tilt);
  return svg(250, 160, "직사각형 ABCD와 부채꼴 CDE, 넓이가 같은 ㉮와 ㉯",
    path(`${M(A)}${L(D)}${arcTo(C, 8 * k, 90, tilt)}Z`, { fill: SHADE, stroke: "none" })
    + path(`${M(E)}${L(C)}${L(X)}${arcTo(C, 8 * k, tilt, 180)}Z`, { fill: SHADE2, stroke: "none" })
    + poly([A, D, C, B]) + seg(A, C) + arc(C, 8 * k, 90, 180)
    + mark(lerp(A, D, 0.55).x, A.y + 20, "가", { r: 9, size: 11 }) + mark(lerp(E, C, 0.55).x + 4, C.y - 18, "나", { r: 9, size: 11 })
    + name(P(A.x - 8, A.y - 9), "A") + name(P(D.x + 8, D.y - 9), "D") + name(P(B.x - 8, B.y + 11), "B") + name(P(C.x + 8, C.y + 11), "C") + name(P(E.x, E.y + 13), "E")
    + brace(D, C, "8cm", { side: -1 }), 250);
}
function q10() {
  const k = 17, T = grid(46, 172, k), s = 9, c3 = Math.sqrt(3) / 2;
  const BL = T(0, 0), BR = T(s, 0), TR = T(s, s), TL = T(0, s), r = s * k;
  const top = T(s / 2, s * c3), rt = T(s * c3, s / 2), bot = T(s / 2, s * (1 - c3)), lf = T(s * (1 - c3), s / 2);
  const shade = `${M(top)}${arcTo(BL, r, 60, 30)}${arcTo(TL, r, -30, -60)}${arcTo(TR, r, -120, -150)}${arcTo(BR, r, 150, 120)}Z`;
  return svg(220, 184, "정사각형의 네 꼭짓점을 중심으로 그린 사분원",
    path(shade, { fill: SHADE, stroke: "none" }) + poly([TL, TR, BR, BL])
    + arc(BL, r, 0, 90, { width: 1.3 }) + arc(BR, r, 90, 180, { width: 1.3 }) + arc(TR, r, 180, 270, { width: 1.3 }) + arc(TL, r, 270, 360, { width: 1.3 })
    + brace(BL, TL, "9cm", { side: -1 }), 210);
}
function q11() {
  const k = 25, T = grid(54, 172, k), r = 3 * k;
  const BL = T(0, 0), BR = T(6, 0), TR = T(6, 6), TL = T(0, 6), cl = T(0, 3), cb = T(3, 0);
  return svg(232, 214, "정사각형 안에 그린 두 반원",
    path(`${M(TL)}${L(TR)}${L(BR)}${arcTo(cb, r, 0, 90)}${arcTo(cl, r, 0, 90)}Z`, { fill: SHADE, stroke: "none" })
    + path(`${M(BL)}${arcTo(cl, r, -90, 0)}${arcTo(cb, r, 90, 180)}Z`, { fill: SHADE, stroke: "none" })
    + poly([TL, TR, BR, BL]) + arc(cl, r, 90, -90) + arc(cb, r, 180, 0)
    + brace(BL, TL, "6cm", { side: -1 }) + brace(BL, BR, "6cm"), 220);
}
function q12() {
  const k = 13, O = P(110, 100), r = 6 * k, w = 3 * Math.sqrt(3) * k, h = 3 * k;
  const ticks = [-4.5, -1.5, 1.5, 4.5].map((y) => { const c = P(O.x, O.y - y * k); return seg(P(c.x - 4, c.y - 2), P(c.x + 4, c.y - 2), { width: 1.1 }) + seg(P(c.x - 4, c.y + 2), P(c.x + 4, c.y + 2), { width: 1.1 }); }).join("");
  return svg(220, 200, "원 안에 그려 넣은 직사각형과 색칠된 두 부분",
    path(`${M(P(O.x - w, O.y - h))}${L(P(O.x + w, O.y - h))}${arcTo(O, r, 30, 150)}Z`, { fill: SHADE, stroke: "none" })
    + path(`${M(P(O.x + w, O.y - h))}${arcTo(O, r, 30, -30)}Z`, { fill: UT.shade, stroke: "none" })
    + circle(O, r) + poly([P(O.x - w, O.y - h), P(O.x + w, O.y - h), P(O.x + w, O.y + h), P(O.x - w, O.y + h)])
    + seg(P(O.x - r, O.y), P(O.x + r, O.y), { width: 1.2 }) + seg(P(O.x, O.y - r), P(O.x, O.y + r), { width: 1.2 }) + ticks, 210);
}

// ── 13~18번 (삼각형의 외심과 내심)
function q13() {
  const B = P(44, 184), C = P(178, 184), A = meet(B, at(B, 10, 62), C, at(C, 10, 108));
  const mAB = lerp(A, B, 0.5), mBC = lerp(B, C, 0.5);
  const O = meet(mAB, P(mAB.x + (A.y - B.y), mAB.y - (A.x - B.x)), mBC, P(mBC.x, mBC.y - 10));
  const ax = angleArc(A, B, O, 26), bx = angleArc(B, C, O, 22), cx = angleArc(C, A, O, 22);
  return svg(222, 204, "외심 O가 있는 삼각형 ABC",
    poly([A, B, C]) + seg(O, A) + seg(O, B) + seg(O, C) + ax.path + bx.path + cx.path
    + italic(at(A, 36, ax.mid), "x") + small(at(B, 38, bx.mid), "44°", 11) + halo(small(at(C, 42, cx.mid + 4), "28°", 11))
    + name(P(A.x, A.y - 11), "A") + name(P(B.x - 9, B.y + 6), "B") + name(P(C.x + 9, C.y + 6), "C") + name(P(O.x, O.y + 15), "O"), 220);
}
function q14() {
  const k = 40, T = grid(48, 150, k), B = T(0, 0), A = T(0, 3), C = T(4, 0), Mm = lerp(A, C, 0.5);
  return svg(250, 186, "직각삼각형 ABC와 외심 M",
    poly([A, B, C]) + seg(B, Mm) + rightMark(B, A, C, 9) + dot(Mm, 2.2)
    + name(P(A.x, A.y - 11), "A") + name(P(B.x - 8, B.y + 9), "B") + name(P(C.x + 10, C.y + 4), "C") + name(P(Mm.x + 3, Mm.y + 15), "M")
    + brace(B, A, "3cm", { side: -1 }) + brace(B, C, "4cm") + brace(A, C, "5cm", { side: -1 }), 240);
}
function q15() {
  const k = 22, T = grid(30, 166, k), C = T(8, 0), B = T(0, 0), A = T(8, 6), I = T(6, 2);
  return svg(252, 196, "직각삼각형 ABC와 내심 I",
    poly([A, B, C]) + circle(I, 2 * k, { width: 1.3 }) + seg(I, B) + seg(I, C) + rightMark(C, B, A, 9) + dot(I)
    + name(P(I.x, I.y - 12), "I") + name(P(A.x + 6, A.y - 10), "A") + name(P(B.x - 9, B.y + 6), "B") + name(P(C.x + 10, C.y + 6), "C")
    + brace(B, A, "10cm", { side: -1 }) + brace(C, A, "6cm") + brace(B, C, "8cm"), 240);
}
function q16() {
  const k = 17, T = grid(26, 186, k), B = T(0, 0), C = T(11, 0), A = T(3.5, Math.sqrt(100 - 12.25));
  const I = P((11 * A.x + 12 * B.x + 10 * C.x) / 33, (11 * A.y + 12 * B.y + 10 * C.y) / 33);
  const D = meet(A, B, I, P(I.x + 10, I.y)), E = meet(A, C, I, P(I.x + 10, I.y));
  return svg(240, 204, "내심 I를 지나고 변 BC와 평행한 선분 DE",
    poly([A, B, C]) + seg(D, E) + seg(B, I) + seg(C, I) + dot(I, 2.2)
    + name(P(A.x, A.y - 11), "A") + name(P(B.x - 9, B.y + 6), "B") + name(P(C.x + 9, C.y + 6), "C")
    + name(P(D.x - 10, D.y), "D") + name(P(E.x + 10, E.y), "E") + name(P(I.x, I.y - 11), "I"), 230);
}
function q17() {
  // 접선 길이 BD = BE = 10, CE = CF = 6, AD = AF = 8 (원문 그림의 길이)
  const k = 10.5, T = grid(30, 176, k), B = T(0, 0), C = T(16, 0), A = T(12, Math.sqrt(180));
  const E = T(10, 0), D = lerp(B, A, 10 / 18), F = lerp(C, A, 6 / 14), r = Math.sqrt(20) * k, I = P(E.x, E.y - r);
  return svg(232, 206, "내접원과 접점 D, E, F가 있는 삼각형 ABC",
    poly([A, B, C]) + circle(I, r, { width: 1.3 }) + seg(I, E, { width: 1.2 }) + rightMark(E, C, I, 6) + dot(I) + dot(D, 1.8) + dot(E, 1.8) + dot(F, 1.8)
    + name(P(I.x - 9, I.y - 9), "I") + name(P(A.x, A.y - 11), "A") + name(P(B.x - 9, B.y + 6), "B") + name(P(C.x + 9, C.y + 6), "C")
    + name(P(D.x - 11, D.y - 4), "D") + name(P(F.x + 11, F.y - 2), "F") + name(P(E.x, E.y + 13), "E")
    + brace(B, A, "18cm", { side: -1, far: 22 }) + brace(B, E, "10cm") + brace(E, C, "6cm"), 228);
}
function q18() {
  const B = P(70, 104), C = P(186, 104), A = meet(B, at(B, 10, 56), C, at(C, 10, 132));
  const I = meet(B, at(B, 10, 28), C, at(C, 10, 156));
  const Q = meet(B, at(B, 10, 28), C, at(C, 10, 66)), Pp = meet(B, at(B, 10, -62), C, at(C, 10, 246));
  const tri = (p, deg) => { const c = at(p, 15, deg); return poly([P(c.x, c.y - 3.2), P(c.x + 3.4, c.y + 2.6), P(c.x - 3.4, c.y + 2.6)], { width: 1 }); };
  const cross = (p, deg) => { const c = at(p, 22, deg); return seg(P(c.x - 2.8, c.y - 2.8), P(c.x + 2.8, c.y + 2.8), { width: 1.1 }) + seg(P(c.x - 2.8, c.y + 2.8), P(c.x + 2.8, c.y - 2.8), { width: 1.1 }); };
  const ring = (p, deg) => circle(at(p, 15, deg), 2.6, { width: 1 });
  const ang = angleArc(A, B, C, 14);
  return svg(270, 262, "삼각형 ABC와 내심 I, 각의 이등분선이 만나는 점 P, Q",
    poly([A, B, C]) + seg(B, at(B, 46, 236)) + seg(C, at(C, 46, 312)) + seg(C, at(C, 54, 0))
    + seg(B, Q) + seg(C, I) + seg(Q, Pp) + seg(B, Pp)
    + ang.path + small(at(A, 26, ang.mid), "76°", 10)
    + dot(at(B, 18, 14), 2.2) + dot(at(B, 18, 42), 2.2) + cross(C, 168) + cross(C, 144)
    + tri(B, 267) + tri(B, 329) + ring(C, 33) + ring(C, 99)
    + name(P(A.x, A.y - 12), "A") + name(P(B.x - 11, B.y - 4), "B") + name(P(C.x + 3, C.y + 14), "C") + dot(I, 2) + name(P(I.x + 1, I.y + 12), "I")
    + name(P(Q.x + 8, Q.y - 8), "Q") + name(P(Pp.x, Pp.y + 13), "P"), 250);
}

// ── 19~24번 (히포크라테스의 초승달)
function q19() {
  const k = 6, T = grid(56, 176, k);
  const A = T(0, 26), B = T(0, 0), C = T(26, 0), D = T(26, 26);
  const c = T(13, 13), rot = (p) => P(c.x + (p.y - c.y), c.y - (p.x - c.x)); // 화면에서 시계 반대로 90°
  const th = Math.acos(10 / 26), Pp = T(10 * Math.cos(th), 26 - 10 * Math.sin(th));
  const Q = rot(Pp), Rr = rot(Q), S = rot(Rr);
  return svg(250, 200, "정사각형 ABCD 안의 사각형 PQRS",
    poly([Pp, Q, Rr, S], { fill: SHADE }) + poly([A, D, C, B]) + seg(A, Q) + seg(B, Rr) + seg(C, S) + seg(D, Pp)
    + rightMark(Pp, A, S, 6) + rightMark(Q, B, Pp, 6) + rightMark(Rr, C, Q, 6) + rightMark(S, D, Rr, 6)
    + name(P(A.x - 8, A.y - 8), "A") + name(P(D.x + 8, D.y - 8), "D") + name(P(B.x - 8, B.y + 9), "B") + name(P(C.x + 8, C.y + 9), "C")
    + name(P(Pp.x - 10, Pp.y + 4), "P") + name(P(Q.x - 2, Q.y + 13), "Q") + name(P(Rr.x + 11, Rr.y), "R") + name(P(S.x + 2, S.y - 12), "S")
    + brace(B, A, "26cm", { side: -1 }) + brace(A, Pp, "10cm", { side: -1 }), 240);
}
function q20() {
  const k = 13, T = grid(66, 142, k), B = T(0, 0), C = T(8, 0), A = T(2.5, Math.sqrt(880) / 8);
  const out = (p, q, away) => { const l = dist(p, q); let n = P(-(q.y - p.y) / l, (q.x - p.x) / l); if (n.x * (away.x - p.x) + n.y * (away.y - p.y) > 0) n = P(-n.x, -n.y); return P(n.x * l, n.y * l); };
  const nb = out(A, B, C), nc = out(A, C, B);
  const E = P(B.x + nb.x, B.y + nb.y), D = P(A.x + nb.x, A.y + nb.y), G = P(C.x + nc.x, C.y + nc.y), F = P(A.x + nc.x, A.y + nc.y);
  const H = T(0, -8), I = T(8, -8);
  return svg(254, 264, "직각삼각형 ABC의 세 변에 그린 정사각형",
    poly([A, B, H], { fill: SHADE, stroke: "none" }) + poly([A, B, E, D]) + poly([A, C, G, F]) + poly([B, C, I, H]) + seg(A, H, { width: 1.3 })
    + rightMark(A, B, C, 6)
    + name(P(A.x + 2, A.y - 13), "A") + name(P(B.x - 10, B.y + 2), "B") + name(P(C.x + 10, C.y + 2), "C") + name(P(D.x - 2, D.y - 11), "D")
    + name(P(E.x - 11, E.y), "E") + name(P(F.x + 1, F.y - 11), "F") + name(P(G.x + 11, G.y), "G") + name(P(H.x - 9, H.y + 9), "H") + name(P(I.x + 9, I.y + 9), "I"), 250);
}
function q21() {
  const k = 17, T = grid(30, 166, k), A = T(0, 8), D = T(10, 8), B = T(0, 0), C = T(10, 0);
  const E = T(0, 3), F = T(4, 0), G = T(10 - 8 / 3, 0), H = lerp(D, F, 0.8);
  return svg(238, 194, "직사각형 ABCD를 접은 그림",
    poly([A, D, C, B]) + seg(D, E) + seg(E, F) + seg(D, F) + seg(D, G) + seg(G, H) + rightMark(F, E, D, 6) + rightMark(H, G, D, 6)
    + name(P(A.x - 8, A.y - 8), "A") + name(P(D.x + 8, D.y - 8), "D") + name(P(B.x - 8, B.y + 8), "B") + name(P(C.x + 8, C.y + 8), "C")
    + name(P(E.x - 9, E.y), "E") + name(P(F.x, F.y + 13), "F") + name(P(G.x, G.y + 13), "G") + name(P(H.x - 10, H.y - 4), "H")
    + brace(A, D, "10cm", { side: -1 }) + brace(D, C, "8cm", { side: -1 }), 230);
}
function q22() {
  const k = 15, T = grid(40, 164, k), A = T(0, 9), D = T(12, 9), B = T(0, 0), C = T(12, 0);
  const E = T(9.375, 9), F = T(2.625, 0), H = T(6, 4.5);
  return svg(250, 196, "직사각형 ABCD의 대각선 AC와 그 수직이등분선 EF",
    poly([A, D, C, B]) + seg(A, C) + seg(E, F) + rightMark(H, C, E, 6)
    + name(P(A.x - 8, A.y - 8), "A") + name(P(D.x + 8, D.y - 8), "D") + name(P(B.x - 8, B.y + 8), "B") + name(P(C.x + 8, C.y + 8), "C")
    + name(P(E.x, E.y - 11), "E") + name(P(F.x, F.y + 13), "F") + name(P(H.x - 2, H.y - 13), "H")
    + brace(B, A, "9cm", { side: -1 }) + brace(B, C, "12cm"), 240);
}
function q23() {
  const k = 22, T = grid(36, 172, k), C = T(8, 0), B = T(0, 0), A = T(8, 6), Mm = lerp(A, B, 0.5);
  const D = foot(C, A, B), H = foot(D, Mm, C);
  return svg(252, 206, "직각삼각형 ABC 안의 선분 CD, CM, DH",
    poly([A, B, C]) + seg(C, D) + seg(C, Mm) + seg(D, H) + rightMark(C, B, A, 7) + rightMark(D, A, C, 5) + rightMark(H, D, C, 5)
    + name(P(A.x + 6, A.y - 10), "A") + name(P(B.x - 9, B.y + 6), "B") + name(P(C.x + 10, C.y + 6), "C")
    + name(P(D.x - 1, D.y - 12), "D") + name(P(Mm.x - 6, Mm.y + 13), "M") + name(P(H.x + 6, H.y + 13), "H")
    + brace(B, A, "10cm", { side: -1 }) + brace(C, A, "6cm") + brace(B, C, "8cm"), 240);
}
function q24() {
  const k = 13, T = grid(26, 186, k), B = T(0, 0), C = T(17, 0), A = T(225 / 17, 120 / 17);
  // 지름 p→q 인 반원을 점 away 반대쪽으로
  const semi = (p, q, away, opts) => {
    const m = lerp(p, q, 0.5), r = dist(p, q) / 2, cross = (q.x - p.x) * (away.y - p.y) - (q.y - p.y) * (away.x - p.x);
    return path(`${M(p)}A${f(r)} ${f(r)} 0 0 ${cross > 0 ? 1 : 0} ${f(q.x)} ${f(q.y)}${opts.fill !== "none" ? "Z" : ""}`, opts);
  };
  const top = T(8.5, -1);
  return svg(290, 212, "직각삼각형 ABC의 세 변을 지름으로 하는 반원",
    semi(A, B, C, { fill: SHADE, stroke: "none" }) + semi(A, C, B, { fill: SHADE, stroke: "none" }) + semi(B, C, top, { fill: "#fff", stroke: "none" })
    + semi(A, B, C, { fill: "none" }) + semi(A, C, B, { fill: "none" }) + semi(B, C, top, { fill: "none" })
    + poly([A, B, C]) + rightMark(A, B, C, 6)
    + name(P(A.x + 6, A.y - 11), "A") + name(P(B.x - 4, B.y + 12), "B") + name(P(C.x + 4, C.y + 12), "C")
    + brace(A, C, "8cm", { side: toward(A, C, B) }) + brace(B, C, "17cm"), 280);
}

// ── 25번 (회전)
function q25() {
  const s = 58, d = s * Math.SQRT2;
  const O1 = P(104, 72), O2 = P(96, 234);
  const sq = (O, turn) => [O, at(O, s, turn), at(O, d, turn - 45), at(O, s, turn - 90)];
  const fig1 = circle(O1, s) + poly(sq(O1, 0)) + seg(at(O1, s, -90), at(O1, s, 0))
    + brace(at(O1, s, -90), at(O1, s, 0), "12cm", { side: -1, bend: s / Math.SQRT2 + 24 })   // 글자가 정사각형 밖(점 O 왼쪽 위)에 오도록 + dot(O1);
  const F15 = at(O2, d, 15);
  const region = `${M(at(O2, s, 60))}${L(F15)}${arcTo(O2, d, 15, -45)}${L(at(O2, s, -90))}${arcTo(O2, s, -90, 60)}Z`;
  const ang = angleArc(O2, at(O2, s, -90), at(O2, s, -30), 16);
  const fig2 = path(region, { fill: SHADE, stroke: "none" }) + circle(O2, s) + poly(sq(O2, 0)) + poly(sq(O2, 60)) + arc(O2, d, 15, -45)
    + ang.path + small(at(O2, 28, ang.mid), "60°", 10) + dot(O2);
  return svg(230, 330, "[그림 1] 정사각형과 원, [그림 2] 정사각형을 60° 돌린 그림",
    fig1 + fig2 + small(P(O1.x, 146), "[그림 1]", 12) + small(P(O2.x + 10, 310), "[그림 2]", 12), 230);
}

const Q = (number, prompt, figure, answer = { label: "답" }) => ({ number, prompt, figure, answer });
const cm = (label = "답") => ({ label, unit: "cm" });
const area = (label = "답") => ({ label, unit: "㎠" });
const deg = (label = "답") => ({ label, unit: "°" });
export const questions = [
  Q(1, "다음 도형에서 색칠한 부분의 둘레와 넓이를 각각 구하시오.", q1, [{ label: "둘레", unit: "cm" }, { label: "넓이", unit: "㎠" }]),
  Q(2, "반지름이 3cm인 원을 밑면으로 하는 뿔 모양의 고깔이 있습니다. 가연이는 그림과 같이 이 고깔을 점 O를 중심으로 원의 둘레를 따라 굴리고 있습니다. 고깔을 몇 회전시키면 처음의 자리로 돌아옵니까?", q2, { label: "답", unit: "회전" }),
  Q(3, "한 변의 길이가 12cm인 정사각형에 들어가는 가장 큰 원을 그리고, 그 안에 가장 큰 정사각형을 그렸습니다. 색칠된 부분의 넓이를 구하시오.", q3, area()),
  Q(4, "다음 그림은 각 ACB의 크기가 60°인 직각삼각형을 점 C를 중심으로 빗변 B′C가 변 AB와 평행이 되도록 회전시킨 것입니다. 이때, 색칠한 부분의 넓이를 구하시오.", q4, area()),
  Q(5, "다음 그림과 같이 반지름이 12cm인 반원의 지름인 선분 AB에 각 CAB가 15°가 되게 선분 AC를 그을 때, 색칠된 부분의 넓이를 구하시오.", q5, area()),
  Q(6, "지구를 매끈한 구라고 가정하고 지구 표면에 5m 높이의 전봇대를 세웁니다. 전선을 팽팽하게 당겨서 지구의 둘레를 한 바퀴 돌았을 때 전선의 길이는 지구의 둘레보다 몇 m 더 길어집니까?", null, { label: "답", unit: "m" }),
  Q(7, "다음과 같이 가로 12m, 세로 8m 길이의 직사각형 모양의 울타리에 12m 길이의 끈을 사용해 송아지를 묶어두려고 합니다. 울타리의 한 귀퉁이에 송아지가 묶여있을 때, 송아지가 움직일 수 있는 영역을 그리고, 넓이를 구하시오.", q7, { label: "답", unit: "㎡" }),
  Q(8, "다음 그림과 같이 반지름의 길이가 9cm인 원통을 실로 팽팽하게 묶으려고 합니다. 실의 길이를 구하시오.", q8, cm()),
  Q(9, "다음 그림에서 ㉮, ㉯의 넓이가 같을 때, 직사각형 ABCD의 가로의 길이를 구하시오. (단, 도형 CDE는 부채꼴입니다.)", q9, cm()),
  Q(10, "다음 색칠된 부분의 둘레의 길이를 구하시오.", q10, cm()),
  Q(11, "다음 그림에서 색칠한 부분의 넓이를 구하시오.", q11, area()),
  Q(12, "다음 그림은 원 안에 직사각형을 그려 넣은 것입니다. 원의 반지름이 6cm일 때, 색칠된 두 부분의 넓이의 차를 구하시오.", q12, area()),
  Q(13, "다음 그림에서 점 O는 삼각형 ABC의 외심입니다. 각 OBC는 44°, 각 ACO는 28°일 때, 각 x의 크기는 얼마입니까?", q13, deg()),
  Q(14, "다음 그림에서 점 M은 직각삼각형 ABC의 외심입니다. 선분 AB는 3cm, 선분 BC는 4cm, 선분 CA는 5cm일 때, 삼각형 MBC의 넓이를 구하시오.", q14, area()),
  Q(15, "다음 그림에서 점 I는 직각삼각형 ABC의 내심입니다. 삼각형 IBC의 넓이를 구하시오.", q15, area()),
  Q(16, "다음 그림에서 점 I는 삼각형 ABC의 내심이고, 선분 AB는 10cm, 선분 AC는 12cm, 선분 BC는 11cm입니다. 삼각형 ADE의 둘레를 구하시오. (단, 선분 BC와 선분 DE는 평행입니다.)", q16, cm()),
  Q(17, "다음 그림에서 점 I는 삼각형 ABC의 내심이고, 점 D, E, F는 접점입니다. 내접원의 반지름이 4cm일 때, 삼각형 ABC의 넓이를 구하시오.", q17, area()),
  Q(18, "다음 그림의 △ABC에 대하여 ∠A=76°일 때, 다음을 구하시오. (1) ∠BIC의 크기는 얼마입니까? (2) ∠BPC의 크기는 얼마입니까? (3) ∠BQC의 크기는 얼마입니까?", q18, [deg("(1)"), deg("(2)"), deg("(3)")]),
  Q(19, "다음 그림에서 □ABCD는 한 변의 길이가 26cm인 정사각형이고, (선분 AP)=10cm일 때, □PQRS의 넓이를 구하시오.", q19, area()),
  Q(20, "다음 그림은 직각삼각형 ABC를 한 변으로 하는 세 개의 정사각형을 그린 것입니다. △ABH=10㎠, □ACGF=44㎠일 때, 선분 BC의 길이를 구하시오.", q20, cm()),
  Q(21, "다음 그림과 같이 직사각형 ABCD에서 △ADE와 △GCD를 접었더니 각각 △FDE와 △GHD가 되었습니다. 다음 물음에 답하시오. (1) 선분 FC의 길이를 구하시오. (2) △ADE의 넓이는 얼마입니까?", q21, [cm("(1)"), area("(2)")]),
  Q(22, "다음 그림과 같이 직사각형 ABCD에서 선분 EF는 대각선 AC의 수직이등분선일 때, 선분 EF의 길이는 얼마입니까?", q22, cm()),
  Q(23, "다음 그림과 같이 ∠C=90°인 직각삼각형 ABC에서 (선분 AM)=(선분 BM), (선분 AB)⊥(선분 CD), (선분 DH)⊥(선분 MC)이고, (선분 AB)=10cm, (선분 AC)=6cm, (선분 BC)=8cm일 때, 선분 DH의 길이를 구하시오.", q23, cm()),
  Q(24, "다음 그림과 같이 ∠A=90°인 직각삼각형 ABC의 세 변을 지름으로 하는 반원을 그릴 때, 색칠한 부분의 넓이를 구하시오.", q24, area()),
  Q(25, "다음 [그림 1]은 대각선의 길이가 12cm인 정사각형과 그 정사각형의 한 변의 길이를 반지름으로 하는 원을 정사각형의 한 꼭짓점과 원의 중심이 포개어지도록 놓은 것입니다. [그림 2]는 정사각형을 반시계 방향으로 60°만큼 회전시킨 것입니다. 색칠한 부분의 넓이를 구하시오.", q25, area()),
];
