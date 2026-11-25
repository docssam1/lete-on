// 2과정 G2 「도형분할과 넓이」 권별 테스트 — 드라이브 원문(2G2 N30 테스트, 25문항)을 우리 시험지 꼴로 다시 짠 것(원장 2026-11-15).
// 원문 내용이 본책 네 단원(도형분할과 정사각형 · 피보나치 사각형 · 원과 삼각형의 둘레 · 360도와 나비각)과 맞는 것을 확인하고 옮겼다.
// 글·수·배치는 원문 그대로, 그림은 우리 색표(워밍업 그림 색)로 다시 그렸다. 원문 그림이 눈금에 맞지 않던 것(13·14번 사분원)은
// 문제의 수에 맞춰 바르게 그렸다. 정답은 여기 두지 않는다(비공개 자리에만).
import { UT, text, svg, line, mark } from "../selection-test-originals/kit.js?v=20261114a";
import { lenArc } from "./len-arc.js?v=20261124a";

export const perPage = 4;
export const meta = { course: "2과정", book: "G2", title: "도형분할과 넓이" };

const R = Math.PI / 180;
const f = (n) => (Math.round(n * 10) / 10).toString();
const P = (x, y) => ({ x, y });
const at = (c, r, deg) => P(c.x + r * Math.cos(deg * R), c.y - r * Math.sin(deg * R));
const lerp = (a, b, t) => P(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
const dir = (a, b) => Math.atan2(-(b.y - a.y), b.x - a.x) / R;
const INK = UT.ink;
const G = { fill: "none", stroke: UT.green, width: 1.6 };
const SHADE = { fill: UT.greenSoft, stroke: UT.green, width: 1.6 };
const poly = (pts, { fill = "none", stroke = INK, width = 1.6, dash = "" } = {}) =>
  `<polygon points="${pts.map((p) => `${f(p.x)},${f(p.y)}`).join(" ")}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const seg = (a, b, opts) => line(f(a.x), f(a.y), f(b.x), f(b.y), opts);
const rect = (x, y, w, h, opts) => poly([P(x, y), P(x + w, y), P(x + w, y + h), P(x, y + h)], opts);
const circle = (c, r, { fill = "none", stroke = UT.green, width = 1.6, dash = "" } = {}) =>
  `<circle cx="${f(c.x)}" cy="${f(c.y)}" r="${f(r)}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const dot = (c, r = 2.6, fill = UT.green) => `<circle cx="${f(c.x)}" cy="${f(c.y)}" r="${r}" fill="${fill}"/>`;
const small = (p, value, size = 12, fill = INK) => text(f(p.x), f(p.y), value, { size, weight: 600, fill });
const name = (p, value, size = 13) => text(f(p.x), f(p.y), value, { size, weight: 700 });
function meet(a1, a2, b1, b2) {
  const d = (a2.x - a1.x) * (b2.y - b1.y) - (a2.y - a1.y) * (b2.x - b1.x);
  const t = ((b1.x - a1.x) * (b2.y - b1.y) - (b1.y - a1.y) * (b2.x - b1.x)) / d;
  return lerp(a1, a2, t);
}
// 꼭짓점 c에서 c→p1, c→p2 사이 작은 쪽 각에 호
function angleArc(c, p1, p2, r, { color = UT.red, width = 1.4 } = {}) {
  let a1 = dir(c, p1), a2 = dir(c, p2);
  let span = ((a2 - a1) % 360 + 360) % 360;
  if (span > 180) { [a1, a2] = [a2, a1]; span = 360 - span; }
  const s = at(c, r, a1), e = at(c, r, a1 + span);
  return { path: `<path d="M${f(s.x)} ${f(s.y)} A${r} ${r} 0 0 0 ${f(e.x)} ${f(e.y)}" fill="none" stroke="${color}" stroke-width="${width}"/>`, mid: a1 + span / 2 };
}
// 길이 표시: a~b 바깥 곡선 점선 + 끊은 자리에 글자(스킬 gfield-textbook-design 4-3). side 1 = (−dy, dx) 쪽.
const brace = (a, b, label, { side = 1, far = 0, italic = false, blank = false } = {}) => lenArc(a, b, label, { side, far, varName: italic, blank });

// ── 1~4번
function q1() {
  const s = 40, x0 = 10, y0 = 8, X = (i) => x0 + i * s, Y = (j) => y0 + j * s;
  let grid = "";
  for (let i = 1; i < 5; i += 1) grid += line(X(i), Y(0), X(i), Y(4), { stroke: "#b9a3e3", width: 1, dash: "4 3" });
  for (let j = 1; j < 4; j += 1) grid += line(X(0), Y(j), X(5), Y(j), { stroke: "#b9a3e3", width: 1, dash: "4 3" });
  const tri = [P(X(0), Y(2)), P(X(4), Y(0)), P(X(5), Y(4))];
  return svg(220, 176, "모눈종이 위의 색칠된 삼각형",
    poly(tri, { fill: UT.purpleSoft, stroke: "none" }) + grid + poly(tri, { stroke: UT.purple, width: 1.6 })
    + rect(X(0), Y(0), 5 * s, 4 * s, { stroke: UT.purple, width: 1.6 }), 220);
}
function q2() {
  const s = 56, x0 = 16, y0 = 26, X = (i) => x0 + i * s, Y = (j) => y0 + j * s;
  let grid = "";
  for (let i = 0; i <= 3; i += 1) grid += line(X(i), Y(0), X(i), Y(3), { stroke: UT.green, width: 1.4 }) + line(X(0), Y(i), X(3), Y(i), { stroke: UT.green, width: 1.4 });
  const A = P(X(1), Y(0)), B = P(X(3), Y(1));
  return svg(220, 202, "정사각형 9개를 이은 모양과 선분 AB",
    grid + seg(A, B, { stroke: UT.red, width: 2 }) + dot(A, 2.6, UT.red) + dot(B, 2.6, UT.red)
    + name(P(A.x, A.y - 12), "A") + name(P(B.x + 12, B.y), "B"), 210);
}
function q3() {
  const S = 180, x0 = 10, y0 = 10, u = S / 3, X = (i) => x0 + i * u, Y = (j) => y0 + j * u;
  const steep = [0, 1, 2].map((i) => [P(X(i), Y(0)), P(X(i + 1), Y(3))]);
  const flat = [0, 1, 2].map((i) => [P(X(0), Y(i + 1)), P(X(3), Y(i))]);
  const box = [meet(...steep[1], ...flat[0]), meet(...steep[2], ...flat[0]), meet(...steep[2], ...flat[1]), meet(...steep[1], ...flat[1])];
  return svg(200, 200, "네 변을 3등분해 이은 정사각형",
    poly(box, { fill: UT.greenSoft, stroke: "none" })
    + [...steep, ...flat].map(([a, b]) => seg(a, b, { stroke: UT.green, width: 1.6 })).join("")
    + rect(x0, y0, S, S, { stroke: UT.green, width: 2 }), 200);
}
function q4() {
  const L = 130, y0 = 10, base = y0 + L;
  const g1 = 20, k = L / 3;
  const left = poly([P(g1, y0), P(g1, base), P(g1 + L, base)], G) + rect(g1, base - L / 2, L / 2, L / 2, SHADE);
  const g2 = 194;
  const right = poly([P(g2, y0), P(g2, base), P(g2 + L, base)], G)
    + poly([P(g2, base - k), P(g2 + k, base), P(g2 + 2 * k, base - k), P(g2 + k, base - 2 * k)], SHADE);
  return svg(340, 178, "크기가 같은 두 직각이등변삼각형과 정사각형",
    left + right + small(P(g1 + L / 2, base + 24), "(가)", 13) + small(P(g2 + L / 2, base + 24), "(나)", 13), 320);
}

// ── 5~8번
function q5() {
  const c = P(100, 100), h = 88;
  return svg(200, 200, "중점을 이어 차례로 그린 정사각형",
    rect(c.x - h, c.y - h, 2 * h, 2 * h, G)
    + poly([P(c.x, c.y - h), P(c.x + h, c.y), P(c.x, c.y + h), P(c.x - h, c.y)], G)
    + rect(c.x - h / 2, c.y - h / 2, h, h, G)
    + poly([P(c.x, c.y - h / 2), P(c.x + h / 2, c.y), P(c.x, c.y + h / 2), P(c.x - h / 2, c.y)], SHADE), 190);
}
function q6() {
  const k = 9, x0 = 58, y0 = 10, H = 15 * k, big = 15 * k, w = 12 * k, sq = 3 * k;
  let out = rect(x0, y0, big, H, G) + rect(x0 + big, y0, w, H, G);
  for (let i = 0; i < 4; i += 1) out += rect(x0 + big + i * sq, y0, sq, sq, G);
  const W = big + w;
  out += brace(P(x0, y0), P(x0, y0 + H), "15cm")
    + brace(P(x0, y0 + H), P(x0 + W, y0 + H), "", { blank: true });
  return svg(320, 206, "정사각형으로 나눈 직사각형", out, 310);
}
function q7() {
  const k = 16, x0 = 52, y0 = 36;
  const out = rect(x0, y0, 9 * k, 9 * k, G) + rect(x0 + 9 * k, y0, 7 * k, 7 * k, G) + rect(x0 + 9 * k, y0 + 7 * k, 2 * k, 2 * k, G)
    + rect(x0 + 11 * k, y0 + 7 * k, 5 * k, 2 * k, SHADE)
    + mark(x0 + 4.5 * k, y0 + 4.5 * k, "가", { r: 10, size: 12 }) + mark(x0 + 12.5 * k, y0 + 3.5 * k, "나", { r: 10, size: 12 }) + mark(x0 + 10 * k, y0 + 8 * k, "다", { r: 9, size: 11 })
    + brace(P(x0 + 16 * k, y0), P(x0, y0), "16cm")
    + brace(P(x0, y0), P(x0, y0 + 9 * k), "9cm");
  return svg(320, 188, "정사각형 ㉮, ㉯, ㉰와 색칠된 직사각형", out, 310);
}
function q8() {
  const x0 = 10, y0 = 10, S = 160;
  let out = rect(x0, y0, S, S, G);
  for (let i = 1; i < 4; i += 1) out += line(x0 + i * 40, y0, x0 + i * 40, y0 + S, { stroke: UT.green, width: 1.6 });
  return svg(180, 180, "같은 크기의 작은 직사각형 4개로 나눈 정사각형", out, 170);
}

// ── 9~12번
function q9() {
  const x0 = 10, y0 = 10, S = 168;
  let out = rect(x0, y0, S, S, G) + line(x0, y0 + S / 2, x0 + S, y0 + S / 2, { stroke: UT.green, width: 1.6 });
  for (let i = 1; i < 3; i += 1) out += line(x0 + i * S / 3, y0, x0 + i * S / 3, y0 + S, { stroke: UT.green, width: 1.6 });
  return svg(188, 188, "직사각형 6개를 붙여 만든 정사각형", out, 180);
}
function q10() {
  const x0 = 10, y0 = 10, w = 44, l = 110;
  let out = "";
  for (let i = 0; i < 5; i += 1) out += rect(x0 + i * w, y0, w, l, G);
  out += rect(x0, y0 + l, l, w, G) + rect(x0 + l, y0 + l, l, w, G);
  return svg(240, 174, "작은 직사각형 7개를 붙여 만든 큰 직사각형", out, 240);
}
function q11() {
  const k = 11, x0 = 10, y0 = 10, X = (v) => x0 + v * k, Y = (v) => y0 + v * k;
  let out = rect(X(0), Y(0), 14 * k, 14 * k, G) + rect(X(14), Y(0), 6 * k, 6 * k, G) + rect(X(14), Y(8), 6 * k, 6 * k, G);
  for (let i = 0; i < 3; i += 1) out += rect(X(14 + 2 * i), Y(6), 2 * k, 2 * k, G);
  for (let i = 0; i < 5; i += 1) out += rect(X(4 * i), Y(14), 4 * k, 4 * k, i === 1 ? SHADE : G);
  out += mark(X(7), Y(7), "가", { r: 11, size: 13 }) + mark(X(6), Y(16), "나", { r: 10, size: 12 });
  return svg(240, 218, "정사각형을 붙여 만든 큰 직사각형", out, 240);
}
function q12() {
  const c = P(100, 100), r = 90, h = r / Math.SQRT2;
  return svg(200, 200, "원 안의 정사각형과 중점을 이은 정사각형",
    circle(c, r) + rect(c.x - h, c.y - h, 2 * h, 2 * h, G)
    + poly([P(c.x, c.y - h), P(c.x + h, c.y), P(c.x, c.y + h), P(c.x - h, c.y)], SHADE), 190);
}

// ── 13~16번
function q13() {
  const k = 10, x0 = 66, y0 = 10, W = 23 * k, H = 18 * k;
  const TL = P(x0, y0), BL = P(x0, y0 + H), BR = P(x0 + W, y0 + H);
  const arc = (s, r, e, sweep) => `<path d="M${f(s.x)} ${f(s.y)} A${r} ${r} 0 0 ${sweep} ${f(e.x)} ${f(e.y)}" fill="none" stroke="${UT.green}" stroke-width="1.6"/>`;
  const shaded = `<path d="M${f(BR.x)} ${f(BR.y)} L${f(BR.x - 10 * k)} ${f(BR.y)} A${10 * k} ${10 * k} 0 0 1 ${f(BR.x)} ${f(BR.y - 10 * k)} Z" fill="${UT.greenSoft}" stroke="${UT.green}" stroke-width="1.6"/>`;
  return svg(310, 200, "직사각형의 꼭짓점을 중심으로 그린 네 사분원",
    shaded + arc(P(x0 + 5 * k, y0), 5 * k, P(x0, y0 + 5 * k), 1) + arc(P(x0, y0 + 5 * k), 13 * k, P(x0 + 13 * k, BL.y), 1)
    + arc(P(x0 + 5 * k, y0), 18 * k, BR, 0) + rect(TL.x, TL.y, W, H, { stroke: UT.green, width: 1.8 })
    + brace(TL, P(x0, y0 + 5 * k), "5cm") + brace(P(x0, y0 + 5 * k), BL, "13cm"), 300);
}
function q14() {
  const k = 6.6, B = P(78, 206), C = P(78 + 22 * k, 206), A = P(78 + 11 * k, 206 - Math.sqrt(29 * 29 - 11 * 11) * k);
  const onAB = (d) => lerp(A, B, d / 29);
  const arcA = angleArc(A, B, C, 13 * k, { color: UT.green, width: 1.6 }).path;
  const arcC = angleArc(C, A, B, 16 * k, { color: UT.green, width: 1.6 }).path;
  const p6 = lerp(B, A, 6 / 29), q6 = P(B.x + 6 * k, B.y);
  const sector = `<path d="M${f(B.x)} ${f(B.y)} L${f(q6.x)} ${f(q6.y)} A${f(6 * k)} ${f(6 * k)} 0 0 0 ${f(p6.x)} ${f(p6.y)} Z" fill="${UT.greenSoft}" stroke="${UT.green}" stroke-width="1.6"/>`;
  return svg(290, 228, "이등변삼각형 ABC와 세 원의 일부",
    sector + arcA + arcC + poly([A, B, C], G)
    + brace(A, onAB(13), "13cm") + brace(onAB(13), onAB(23), "10cm") + brace(onAB(23), B, "a", { italic: true })
    + name(P(A.x, A.y - 12), "A") + name(P(B.x - 12, B.y + 6), "B") + name(P(C.x + 12, C.y + 6), "C"), 270);
}
function q15() {
  const r = 24, Bc = P(76, 174), Cc = P(124, 174), Ac = P(100, 174 - Math.sqrt(96 * 96 - 24 * 24));
  return svg(200, 206, "세 원과 중심을 이은 삼각형",
    circle(Ac, 3 * r) + circle(Bc, r) + circle(Cc, r) + poly([Ac, Bc, Cc], SHADE)
    + dot(Ac) + dot(Bc) + dot(Cc)
    + small(P(Ac.x, Ac.y - 16), "(가)", 13) + small(P(Bc.x, Bc.y + 12), "(나)", 11) + small(P(Cc.x, Cc.y + 12), "(다)", 11), 190);
}

// ── 17~20번
function q17() {
  const T = P(150, 14), BL = P(30, 14 + 120 * Math.sqrt(3)), BR = P(270, 14 + 120 * Math.sqrt(3));
  const L1 = lerp(T, BL, 6 / 30), L2 = lerp(T, BL, 19 / 30), B1 = lerp(BL, BR, 11 / 30), B2 = lerp(BL, BR, 15 / 30), R1 = lerp(BR, T, 15 / 30), R2 = lerp(BR, T, 24 / 30);
  return svg(300, 252, "정삼각형에서 세 작은 정삼각형을 잘라 낸 육각형",
    poly([T, BL, BR], { stroke: UT.line, width: 1.1, dash: "4 3" }) + poly([L1, L2, B1, B2, R1, R2], { fill: UT.greenSoft, stroke: UT.green, width: 1.8 })
    + brace(L1, L2, "13cm") + brace(R1, R2, "9cm") + brace(B1, B2, "4cm"), 290);
}
function q18() {
  const c = P(110, 110), r = 100, s = r / 6;
  let out = circle(c, r) + seg(P(c.x - r, c.y), P(c.x + r, c.y), { stroke: UT.green, width: 1.4 });
  for (let i = 0; i < 3; i += 1) {
    const left = P(c.x - r + s + i * s, c.y), right = P(c.x + r - s - i * s, c.y);
    out += circle(left, s, { width: 1.4 }) + circle(right, s, { width: 1.4 }) + dot(left, 2.4) + dot(right, 2.4);
  }
  out += [-8, 0, 8].map((dx) => dot(P(c.x + dx, c.y - 10), 1.8, INK)).join("");
  return svg(220, 220, "큰 원의 지름 위에 겹쳐 그린 작은 원", out, 210);
}
function q19() {
  const O = P(125, 116), Lb = 64, Rr = Lb / (2 * Math.sin(15 * R)), ri = Rr - 32 / Math.cos(15 * R), rm = (Rr + ri) / 2;
  const piece = (th) => [at(O, Rr, th - 15), at(O, Rr, th + 15), at(O, ri, th + 15), at(O, ri, th - 15)];
  const pieces = [-120, -60, -90].map((th) => poly(piece(th), SHADE)).join("");
  const s = at(O, rm, -45), e = at(O, rm, 225);
  const ring = `<path d="M${f(s.x)} ${f(s.y)} A${f(rm)} ${f(rm)} 0 1 0 ${f(e.x)} ${f(e.y)}" fill="none" stroke="${UT.line}" stroke-width="1.1" stroke-dasharray="4 4"/>`;
  const [o1, o2, i2, i1] = piece(-90);
  const a1 = angleArc(o1, o2, i1, 12), a2 = angleArc(o2, o1, i2, 12);
  return svg(250, 244, "등변사다리꼴 색종이를 이어 붙인 모양",
    ring + pieces + a1.path + a2.path + small(P(o1.x + 22, o1.y - 12), "75°", 11) + small(P(o2.x - 22, o2.y - 12), "75°", 11), 240);
}
function q20() {
  const O = P(150, 108), A = at(O, 92, 90), B = at(O, 120, 207);
  const g1 = angleArc(O, A, at(O, 10, 145), 22), g2 = angleArc(O, B, at(O, 10, 325), 18);
  return svg(300, 196, "각 AOB와 각 ㉠, ㉡",
    seg(O, A, { stroke: UT.green }) + seg(B, at(O, 120, 27), { stroke: UT.green }) + seg(at(O, 110, 145), at(O, 110, 325), { stroke: UT.green })
    + g1.path + g2.path + mark(at(O, 40, g1.mid).x, at(O, 40, g1.mid).y, "㉠", { r: 9, size: 11 }) + mark(at(O, 36, g2.mid).x, at(O, 36, g2.mid).y, "㉡", { r: 9, size: 11 })
    + name(P(A.x, A.y - 11), "A") + name(P(B.x - 10, B.y + 4), "B") + name(P(O.x + 16, O.y + 4), "O"), 290);
}

// ── 21~25번
function marked(pts, r = 7) {
  const n = pts.length;
  return pts.map((p, i) => angleArc(p, pts[(i + n - 1) % n], pts[(i + 1) % n], r).path).join("");
}
function q21() {
  const k = 0.55;
  const t1 = ([x, y]) => P(40 + (x - 78) * k, 8 + (y - 28) * k), t2 = ([x, y]) => P(44 + (x - 62) * k, 188 + (y - 502) * k);
  const fig1 = [[207, 33], [345, 28], [438, 150], [383, 318], [180, 203], [336, 195], [157, 311], [78, 162]].map(t1);
  const [T, L, Rt, BL, BR] = [[230, 502], [62, 623], [400, 623], [123, 827], [338, 822]].map(t2);
  const star = [T, BL, Rt, L, BR];
  return svg(260, 372, "표시된 각이 있는 두 도형",
    small(P(14, 12), "(1)", 13) + small(P(14, 192), "(2)", 13)
    + poly(fig1, G) + marked(fig1, 9) + poly(star, G) + marked(star, 13), 250);
}
function q22() {
  const c = P(115, 115), r = 104, V = Array.from({ length: 11 }, (_, i) => at(c, r, 90 + i * 360 / 11));
  const order = Array.from({ length: 11 }, (_, i) => V[(i * 2) % 11]);
  return svg(230, 230, "십일각별 모양의 다각형", poly(order, G) + marked(order, 9), 220);
}
// 시계: 숫자판(numbers) · 바늘은 12시에서 시계 방향 각도(minuteDeg, hourDeg)
function clock(c, r, { numbers = true, minuteDeg = null, hourDeg = null } = {}) {
  let out = circle(c, r, { fill: "#fff", stroke: UT.soft, width: r * 0.1 }) + circle(c, r * 1.05, { stroke: UT.line, width: 1 });
  for (let i = 0; i < 60; i += 1) {
    const big = i % 5 === 0, a = 90 - i * 6;
    out += seg(at(c, r * 0.94, a), at(c, r * (big ? 0.82 : 0.88), a), { stroke: big ? INK : UT.line, width: big ? 1.4 : 0.8 });
  }
  if (numbers) for (let h = 1; h <= 12; h += 1) { const p = at(c, r * 0.68, 90 - h * 30); out += text(f(p.x), f(p.y), String(h), { size: r * 0.2, weight: 600 }); }
  const hand = (deg, len, color, w) => {
    const tip = at(c, len, 90 - deg), base = at(c, len - 9, 90 - deg), l = at(base, 5, 180 - deg), rr = at(base, 5, -deg);
    return seg(c, base, { stroke: color, width: w }) + poly([tip, l, rr], { fill: color, stroke: color, width: 1 });
  };
  if (minuteDeg != null) out += hand(minuteDeg, r * 0.78, UT.line, 3);
  if (hourDeg != null) out += hand(hourDeg, r * 0.5, INK, 4.2);
  return out + circle(c, r * 0.08, { fill: "#bbb", stroke: UT.line, width: 1.2 });
}
function q23() {
  const r = 62;
  return svg(310, 162, "5시 10분과 6시 45분을 가리키는 시계",
    text(30, 12, "(1) 5시 10분", { size: 13, weight: 600, anchor: "start" }) + text(176, 12, "(2) 6시 45분", { size: 13, weight: 600, anchor: "start" })
    + clock(P(78, 94), r, { minuteDeg: 60, hourDeg: 155 }) + clock(P(232, 94), r, { minuteDeg: 270, hourDeg: 202.5 }), 300);
}
function q24() {
  const c = P(110, 100), r = 88;
  // 숫자 없는 시계: 긴바늘·짧은바늘 사이 110°, 짧은바늘은 큰 눈금(점선)에서 20° 지나 있다
  const a0 = -30, a1 = -50, rr = 50;
  const s = at(c, rr, a0), e = at(c, rr, a1 + 3), pre = at(c, rr, a1 + 8);
  const ang = Math.atan2(e.y - pre.y, e.x - pre.x), h = 6;
  const head = `<polyline points="${f(e.x - h * Math.cos(ang - 0.5))},${f(e.y - h * Math.sin(ang - 0.5))} ${f(e.x)},${f(e.y)} ${f(e.x - h * Math.cos(ang + 0.5))},${f(e.y - h * Math.sin(ang + 0.5))}" fill="none" stroke="${UT.red}" stroke-width="1.5" stroke-linejoin="round"/>`;
  return svg(220, 200, "숫자가 없는 돌려 놓인 시계",
    clock(c, r, { numbers: false, minuteDeg: 30, hourDeg: 140 })
    + seg(c, at(c, r * 0.9, a0), { stroke: UT.line, width: 1, dash: "3 3" })
    + `<path d="M${f(s.x)} ${f(s.y)} A${rr} ${rr} 0 0 1 ${f(e.x)} ${f(e.y)}" fill="none" stroke="${UT.red}" stroke-width="1.5"/>` + head
    + small(at(c, 66, -12), "20°", 13), 200);
}
function q25() {
  const s = 30, x0 = 20, y0 = 16, X = (i) => x0 + i * s, Y = (j) => y0 + j * s;
  const cells = [[2, 0], [3, 0], [4, 0], [5, 0]];
  for (let j = 1; j < 5; j += 1) for (let i = 0; i < 5; i += 1) cells.push([i, j]);
  const dash = { stroke: "#b9a3e3", width: 1, dash: "4 3" };
  const inner = cells.map(([i, j]) => line(X(i), Y(j), X(i + 1), Y(j), dash) + line(X(i), Y(j), X(i), Y(j + 1), dash)).join("");
  const outline = [[0, 1], [2, 1], [2, 0], [6, 0], [6, 1], [5, 1], [5, 5], [0, 5]].map(([i, j]) => P(X(i), Y(j)));
  return svg(220, 182, "작은 정사각형 24개로 이루어진 도형",
    `<rect x="6" y="4" width="208" height="174" rx="6" fill="#fff" stroke="${UT.soft}" stroke-width="1.2"/>` + inner + poly(outline, { stroke: UT.purple, width: 2 }), 210);
}

const Q = (number, prompt, figure, answer = { label: "답" }) => ({ number, prompt, figure, answer });
export const questions = [
  Q(1, "다음 모눈종이의 눈금은 1cm 간격입니다. 작은 정사각형 하나의 넓이를 1㎠라 할 때, 색칠된 삼각형의 넓이는 몇 ㎠입니까?", q1, { label: "답", unit: "㎠" }),
  Q(2, "정사각형 9개를 겹치는 부분이 없게 이은 모양에 선분을 그었습니다. 선분 AB의 길이가 15cm일 때, 작은 정사각형 한 개의 넓이를 구하시오.", q2, { label: "답", unit: "㎠" }),
  Q(3, "다음 그림은 정사각형 네 변을 3등분한 후 선분으로 연결한 것입니다. 색칠된 정사각형의 넓이는 큰 정사각형 넓이의 몇 분의 몇인지 구하시오.", q3),
  Q(4, "다음 (가), (나) 두 도형은 크기가 같은 직각이등변삼각형입니다. (가)의 색칠한 정사각형의 넓이가 36㎠일 때, (나)의 색칠한 정사각형의 넓이를 구하시오.", q4, { label: "답", unit: "㎠" }),
  Q(5, "정사각형의 각 변의 중점을 연결하면 그보다 작은 정사각형이 계속해서 만들어집니다. 가장 큰 정사각형의 넓이가 48㎠일 때, 칠해진 부분의 넓이는 몇 ㎠인지 구하시오.", q5, { label: "답", unit: "㎠" }),
  Q(6, "세로의 길이가 15cm인 직사각형을 그림과 같이 나누었더니 모두 정사각형이 되었습니다. 직사각형의 가로의 길이를 구하시오.", q6, { label: "답", unit: "cm" }),
  Q(7, "다음 그림에서 ㉮, ㉯, ㉰는 정사각형입니다. 색칠된 직사각형의 둘레는 몇 cm인지 구하시오.", q7, { label: "답", unit: "cm" }),
  Q(8, "다음은 정사각형을 같은 크기의 작은 직사각형으로 나눈 것입니다. 작은 직사각형의 둘레가 40cm일 때, 정사각형의 둘레의 길이는 몇 cm인지 구하시오.", q8, { label: "답", unit: "cm" }),
  Q(9, "다음 그림과 같이 크기와 모양이 같은 직사각형을 6개를 붙여 정사각형을 만들었습니다. 직사각형의 둘레가 70cm일 때, 정사각형의 한 변의 길이를 구하시오.", q9, { label: "답", unit: "cm" }),
  Q(10, "다음과 같이 모양과 크기가 같은 작은 직사각형 7개를 붙여 큰 직사각형을 만들었습니다. 작은 직사각형의 둘레가 70cm일 때, 큰 직사각형의 둘레를 구하시오.", q10, { label: "답", unit: "cm" }),
  Q(11, "다음 그림과 같이 정사각형을 붙여 큰 직사각형을 만들었습니다. 가장 큰 정사각형 ㉮의 둘레가 56cm일 때, 정사각형 ㉯의 둘레를 구하시오.", q11, { label: "답", unit: "cm" }),
  Q(12, "지름이 14cm인 원 안에 정사각형을 그리고, 정사각형의 각 변의 중점을 연결해 작은 정사각형을 그렸습니다. 색칠된 정사각형의 둘레를 구하시오.", q12, { label: "답", unit: "cm" }),
  Q(13, "다음 직사각형의 꼭짓점을 원의 중심으로 하는 서로 다른 4개의 사분원을 그렸습니다. 칠해진 사분원의 반지름의 길이를 구하시오.", q13, { label: "답", unit: "cm" }),
  Q(14, "이등변삼각형 ABC의 꼭짓점은 서로 다른 원의 중심입니다. 이등변삼각형 ABC의 둘레가 80cm일 때, 색칠된 가장 작은 원의 반지름 a의 길이를 구하시오.", q14, { label: "답", unit: "cm" }),
  Q(15, "원 (가)의 지름은 원 (나)와 (다)의 지름의 3배입니다. 세 원의 중심을 연결한 삼각형의 둘레가 60cm입니다. 원 (가)의 반지름의 길이를 구하시오.", q15, { label: "답", unit: "cm" }),
  Q(16, "성냥개비 24개를 모두 사용하여 삼각형을 만들 때, 만들 수 있는 삼각형은 모두 몇 가지인지 구하시오. (단, 돌리거나 뒤집어서 모양이 같은 삼각형은 같은 것으로 생각합니다.)", null, { label: "답", unit: "가지" }),
  Q(17, "한 변의 길이가 30cm인 정삼각형에서 다음 그림과 같이 세 개의 작은 정삼각형을 잘라 내어 육각형을 만들었습니다. 만들어진 육각형의 둘레를 구하시오.", q17, { label: "답", unit: "cm" }),
  Q(18, "다음 그림과 같이 반지름이 18cm인 원의 지름 위에 반지름이 3cm인 원을 중심이 겹쳐지게 그리려고 합니다. 작은 원을 모두 몇 개 그릴 수 있는지 구하시오.", q18, { label: "답", unit: "개" }),
  Q(19, "아랫변의 양 끝각의 크기가 같은 사다리꼴을 등변사다리꼴이라고 합니다. 다음 그림과 같이 등변사다리꼴 모양의 색종이를 겹치지 않게 이어 붙여 정다각형을 만들려고 합니다. 필요한 색종이는 모두 몇 장인지 구하시오.", q19, { label: "답", unit: "장" }),
  Q(20, "다음 그림에서 각 AOB의 크기가 117°일 때, 각 ㉠과 각 ㉡의 각도의 차를 구하시오.", q20, { label: "답", unit: "°" }),
  Q(21, "다음 그림에서 표시된 부분의 각의 합을 구하시오.", q21, [{ label: "(1)", unit: "°" }, { label: "(2)", unit: "°" }]),
  Q(22, "다음 십일각별 모양의 다각형에서 표시된 각의 합을 구하시오.", q22, { label: "답", unit: "°" }),
  Q(23, "다음 주어진 시계의 시각을 보고 시침과 분침이 이루는 작은 쪽의 각도를 구하시오.", q23, [{ label: "(1)", unit: "°" }, { label: "(2)", unit: "°" }]),
  Q(24, "다음 그림과 같이 숫자가 쓰여져 있지 않은 시계가 바닥에 놓여 있습니다. 이 시계가 가리키는 시각은 몇 시 몇 분인지 구하시오. (단, 시계는 돌려져 있어 어디가 12시인지 알 수 없습니다.)", q24),
  Q(25, "다음 그림은 작은 정사각형 24개로 이루어진 도형입니다. 점선을 따라 크기와 모양이 같은 4개의 도형으로 나누시오.", q25, null),
];
