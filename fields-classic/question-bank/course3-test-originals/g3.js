// 3과정 G3 「정다면체와 피타고라스의 정리」 권별 테스트 — 드라이브 원문(3과정-G3N 테스트, 25문항)을 우리 시험지 꼴로 다시 짠 것(원장 2026-11-15).
// 내용 대조: 본책 N20 「정다면체와 피타고라스의 정리」(220104)의 네 단원과 문항이 맞는다(파일 이름이 아니라 내용으로 확인했다).
//   01 정다면체와 축구공 — 1~6번(각기둥 면·모서리, 정사면체 모서리의 중점 잇기, 깎인 정육면체, 깎인 정사면체 대각선, 회전체 고르기, 오각뿔 단면)
//   02 입체도형의 겉넓이와 부피 — 7~12번(겉넓이, 구멍 뚫린 원기둥, 회전체 겉넓이, 수조, 구멍 6개 원기둥, 비스듬히 자른 원기둥)
//   03 아르키메데스의 묘비 — 13~18번(원뿔 전개도, 원뿔 굴리기, 테니스 공 세 개, 회전체 부피, 뿔대 부피, 원뿔 그릇에 물 넣기)
//   04 피타고라스의 정리 — 19~25번(중점까지의 길이, 정사각형 BDEC, 이등변삼각형 넓이, 정사각형 ADEB, 직각 둘 + 30°, 원기둥에 실 감기, 세 변으로 넓이)
// 글·수·배치는 원문 그대로. 그림은 우리 색표로 다시 그렸다 — 선은 검정, 보이지 않는 모서리는 갈색 점선, 길이를 나타내는 점선 호는 갈색 점선,
// 입체의 면은 연두 계열(면의 방향에 따라 밝기만 다르게), 색칠한 부분은 연두. 다면체(2·3·4·6·7·10·17번)는 실제 꼭짓점 좌표로 계산해 그렸다.
// 원문 그림이 주어진 수와 맞지 않던 곳은 수에 맞게 바르게 그렸다:
//   13번 — 원문은 부채꼴이 좁게(약 140°) 그려져 있으나, 옆넓이 48π㎠ · 모선 8㎝ 에 맞는 중심각과 밑면 크기로 그렸다.
//   24번 — 원문은 원기둥이 뭉툭하게(높이 ≈ 지름의 1.5배) 그려져 있으나, 반지름 1.5㎝ · 높이 8π㎝ 의 실제 비율(가늘고 긴 원기둥)로 그렸다.
// 18번의 12㎝ 는 원문처럼 그릇 위 ~ 물 위까지의 길이다(물 깊이 6㎝ 와 따로 표시, 그릇 모양은 실제 비율).
// 3번 문장의 분수(1/3)는 mathPrompt 로 위아래로 쌓는다. 제곱근(25번 6√2)은 글 속에서는 √ 글자 그대로, 그림에서는 근호 선을 그린다.
// 정답은 여기 두지 않는다(비공개 자리에만).
import { UT, text, svg, line, ringed } from "../selection-test-originals/kit.js?v=20261114a";
import { lenArc } from "../course2-test-originals/len-arc.js?v=20261124a";

export const perPage = 4;
export const meta = { course: "3과정", book: "G3", title: "정다면체와 피타고라스의 정리" };

const R = Math.PI / 180;
const f = (n) => (Math.round(n * 10) / 10).toString();
const P = (x, y) => ({ x, y });
const lerp = (a, b, t) => P(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
const INK = UT.ink;
const DASH = UT.line;
const DIM = "#9a9183";

// ── 기본 그리기
const pathOf = (pts, close = false) => "M" + pts.map((p) => `${f(p.x)} ${f(p.y)}`).join(" L") + (close ? "Z" : "");
const draw = (d, { fill = "none", stroke = INK, width = 1.5, dash = "" } = {}) =>
  `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const poly = (pts, opts) => draw(pathOf(pts, true), opts);
const seg = (a, b, { stroke = INK, width = 1.5, dash = "" } = {}) => line(f(a.x), f(a.y), f(b.x), f(b.y), { stroke, width, dash });
const hid = (a, b) => seg(a, b, { stroke: DASH, width: 1.1, dash: "4 3" });
const dot = (p, r = 2.6, fill = INK) => `<circle cx="${f(p.x)}" cy="${f(p.y)}" r="${r}" fill="${fill}"/>`;
const halo = (markup) => markup.replace('style="', 'style="paint-order:stroke;stroke:#fff;stroke-width:3.5px;stroke-linejoin:round;');
const lab = (p, value, { size = 12.5, dx = 0, dy = 0, anchor = "middle", weight = 600 } = {}) => halo(text(f(p.x + dx), f(p.y + dy), value, { size, weight, anchor }));
const nm = (p, value, dx = 0, dy = 0) => halo(text(f(p.x + dx), f(p.y + dy), value, { size: 14, weight: 700 }));
// 점선 위 글자(흰 바탕)
const tag = (p, value, dy = 0, size = 12) => { const w = tw(value, size) + 6; return `<rect x="${f(p.x - w / 2)}" y="${f(p.y + dy - size * 0.62)}" width="${f(w)}" height="${f(size * 1.24)}" fill="#fff"/>` + text(f(p.x), f(p.y + dy), value, { size, weight: 600 }); };
const tw = (value, size) => [...String(value)].reduce((s, c) => s + (/[\x20-\x7e]/.test(c) ? 0.6 : 1.02), 0) * size;

// 색 섞기(흰색 ~ 초록)
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => "#" + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, "0")).join("");
const FACE = { top: mix("#ffffff", UT.green, 0.1), side: UT.greenSoft, dark: mix("#ffffff", UT.green, 0.3), hole: "#ffffff" };

// 길이 표시: a~b 바깥 곡선 점선 + 끊은 자리에 글자(스킬 gfield-textbook-design 4-3, 원장 2026-11-24 — 흰 판으로 덮지 않는다).
// bulge 부호 = 휘는 쪽(양수 = 진행 방향의 시계 쪽), far = 더 띄울 만큼. value 가 함수면 { w: 글자 폭 자리표, draw(p) } 로 그 자리에 직접 그린다.
function dim(a, b, value, bulge = 14, { far = 0, varName = false, halo = false } = {}) {
  const side = bulge < 0 ? -1 : 1;
  if (typeof value !== "object") return lenArc(a, b, value, { side, far, unit: "㎝", size: 12.5, varName, halo });
  const out = lenArc(a, b, value.w, { side, far, size: 12.5 });
  return out.replace(/<text x="([\d.-]+)" y="([\d.-]+)"[^>]*>[^<]*<\/text>/, (m, x, y) => value.draw(P(+x, +y - 1)));
}
// 화살촉(끝점 tip, 들어오는 방향의 한 점 from)
function head(tip, from, { size = 6, color = INK } = {}) {
  const l = Math.hypot(tip.x - from.x, tip.y - from.y) || 1, ux = (tip.x - from.x) / l, uy = (tip.y - from.y) / l;
  const b = P(tip.x - ux * size, tip.y - uy * size);
  return poly([tip, P(b.x - uy * size * 0.5, b.y + ux * size * 0.5), P(b.x + uy * size * 0.5, b.y - ux * size * 0.5)], { fill: color, stroke: color, width: 0.8 });
}
// 이끌림 화살표: 글자 자리 from 에서 to 를 가리키는 휜 화살표(원문의 꼬부라진 화살표)
function leader(from, to, value, { bend = 0.35, gap = 12, size = 12, anchor = "middle" } = {}) {
  const l = Math.hypot(to.x - from.x, to.y - from.y), ux = (to.x - from.x) / l, uy = (to.y - from.y) / l;
  const s = P(from.x + ux * gap, from.y + uy * gap), e = P(to.x - ux * 2, to.y - uy * 2);
  const m = lerp(s, e, 0.5), c = P(m.x - uy * l * bend, m.y + ux * l * bend);
  return draw(`M${f(s.x)} ${f(s.y)} Q${f(c.x)} ${f(c.y)} ${f(e.x)} ${f(e.y)}`, { width: 1.3 }) + head(e, lerp(c, e, 0.6), { size: 6 })
    + lab(from, value, { size, anchor });
}
// 직각 표시
function rightAt(c, p1, p2, s = 8) {
  const u = (p) => { const l = Math.hypot(p.x - c.x, p.y - c.y); return P((p.x - c.x) / l, (p.y - c.y) / l); };
  const a = u(p1), b = u(p2);
  return `<polyline points="${f(c.x + a.x * s)},${f(c.y + a.y * s)} ${f(c.x + (a.x + b.x) * s)},${f(c.y + (a.y + b.y) * s)} ${f(c.x + b.x * s)},${f(c.y + b.y * s)}" fill="none" stroke="${INK}" stroke-width="1.1"/>`;
}
// 각 표시 호(꼭짓점 c 에서 p1, p2 사이 작은 쪽)
function angleArc(c, p1, p2, r, { color = UT.red } = {}) {
  const d = (p) => Math.atan2(p.y - c.y, p.x - c.x);
  let a1 = d(p1), a2 = d(p2), span = a2 - a1;
  while (span > Math.PI) span -= 2 * Math.PI;
  while (span < -Math.PI) span += 2 * Math.PI;
  const pts = Array.from({ length: 13 }, (_, i) => P(c.x + r * Math.cos(a1 + span * i / 12), c.y + r * Math.sin(a1 + span * i / 12)));
  return draw(pathOf(pts), { stroke: color, width: 1.5 });
}
// 같은 길이 표시(빗금 n 개)
function ticks(a, b, n = 2, size = 5) {
  const l = Math.hypot(b.x - a.x, b.y - a.y), ux = (b.x - a.x) / l, uy = (b.y - a.y) / l, m = lerp(a, b, 0.5);
  return Array.from({ length: n }, (_, i) => {
    const o = (i - (n - 1) / 2) * 4, q = P(m.x + ux * o, m.y + uy * o);
    return seg(P(q.x - uy * size + ux * 1.5, q.y + ux * size + uy * 1.5), P(q.x + uy * size - ux * 1.5, q.y - ux * size - uy * 1.5), { width: 1.2 });
  }).join("");
}

// ── 타원(원기둥·원뿔의 밑면): t 는 각(라디안), sin 이 양수인 쪽이 앞(아래)
const ell = (c, rx, ry, t) => P(c.x + rx * Math.cos(t), c.y + ry * Math.sin(t));
const arcPts = (c, rx, ry, t0, t1, n = 36) => Array.from({ length: n + 1 }, (_, i) => ell(c, rx, ry, t0 + (t1 - t0) * i / n));
const ellipse = (c, rx, ry, { fill = "none", stroke = INK, width = 1.5, dash = "" } = {}) =>
  `<ellipse cx="${f(c.x)}" cy="${f(c.y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
// 앞 반은 실선, 뒤 반은 점선
const baseEllipse = (c, rx, ry) => draw(pathOf(arcPts(c, rx, ry, 0, Math.PI))) + draw(pathOf(arcPts(c, rx, ry, Math.PI, 2 * Math.PI)), { stroke: DASH, width: 1.1, dash: "4 3" });
// 회전축 위의 돌림 표시
function spin(c, rx = 10, ry = 4.5) {
  const pts = arcPts(c, rx, ry, 0.62 * Math.PI, 2.36 * Math.PI, 40);
  return draw(pathOf(pts), { width: 1.5 }) + head(pts[pts.length - 1], pts[pts.length - 4], { size: 6 });
}
// 회전축 ℓ(위에 ℓ 글자와 돌림 표시)
const axis = (x, y0, y1, spinY) => seg(P(x, y0), P(x, y1), { width: 1.4 }) + spin(P(x, spinY))
  + `<text x="${x}" y="${y0 - 8}" text-anchor="middle" dominant-baseline="central" style="font-size:15px;font-style:italic;font-family:serif;fill:${INK}">ℓ</text>`;

// ── 다면체: 꼭짓점 좌표(x 오른쪽, y 안쪽, z 위)와 면(꼭짓점 번호 묶음)으로 그린다
// 보이는 면은 칠하고 보이는 모서리는 실선, 보이지 않는 모서리는 점선. view: 비스듬한 투영(oblique) 또는 돌려 본 투영(ortho).
function oblique({ k = 0.5, ang = 40 } = {}) {
  const c = Math.cos(ang * R) * k, s = Math.sin(ang * R) * k;
  return { at: ([x, y, z]) => P(x + y * c, -(z + y * s)), D: [-c, 1, -s] };
}
function ortho({ yaw = 25, pitch = 20 } = {}) {
  const a = yaw * R, b = pitch * R;
  return {
    at: ([x, y, z]) => { const x1 = x * Math.cos(a) + y * Math.sin(a), y1 = -x * Math.sin(a) + y * Math.cos(a); return P(x1, -(z * Math.cos(b) + y1 * Math.sin(b))); },
    D: [-Math.sin(a) * Math.cos(b), Math.cos(a) * Math.cos(b), -Math.sin(b)]
  };
}
// 정해 둔 방향 D(보는 사람에게서 멀어지는 쪽)로 본 투영, upHint 가 화면 위쪽
function camera(D, upHint = [0, 0, 1]) {
  const d = unit(D), right = unit(cross(d, upHint)), up = cross(right, d);
  return { at: (p) => P(dot3(p, right), -dot3(p, up)), D: d };
}
const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => { const l = Math.hypot(...a) || 1; return a.map((v) => v / l); };
const avg3 = (list) => [0, 1, 2].map((i) => list.reduce((s, p) => s + p[i], 0) / list.length);
const LIGHT = unit([-0.3, -0.5, 1.2]);
function fitter(points, [bx, by, bw, bh]) {
  const xs = points.map((p) => p.x), ys = points.map((p) => p.y);
  const x0 = Math.min(...xs), y0 = Math.min(...ys), w = Math.max(...xs) - x0, h = Math.max(...ys) - y0;
  const s = Math.min(bw / (w || 1), bh / (h || 1));
  const ox = bx + (bw - w * s) / 2, oy = by + (bh - h * s) / 2;
  return (p) => P(ox + (p.x - x0) * s, oy + (p.y - y0) * s);
}
function solid(V, faceSets, view, box, { extra = [], tone = null } = {}) {
  const fit = fitter([...V, ...extra].map(view.at), box);
  const at = (p3) => fit(view.at(p3));
  const S = V.map(at), cen = avg3(V);
  const faces = faceSets.map((set) => {
    const pts = set.map((i) => V[i]), c = avg3(pts), u = unit(sub3(c, cen));
    const e1 = unit(sub3(pts[0], c).map((v, i) => v - u[i] * dot3(sub3(pts[0], c), u))), e2 = cross(u, e1);
    const order = [...set].sort((i, j) => Math.atan2(dot3(sub3(V[i], c), e2), dot3(sub3(V[i], c), e1)) - Math.atan2(dot3(sub3(V[j], c), e2), dot3(sub3(V[j], c), e1)));
    const n = unit(order.reduce((acc, i, k) => { const p = V[i], q = V[order[(k + 1) % order.length]]; return [acc[0] + (p[1] - q[1]) * (p[2] + q[2]), acc[1] + (p[2] - q[2]) * (p[0] + q[0]), acc[2] + (p[0] - q[0]) * (p[1] + q[1])]; }, [0, 0, 0]));
    const out = dot3(n, u) < 0 ? n.map((v) => -v) : n;
    return { order, n: out, visible: dot3(out, view.D) < -1e-9 };
  });
  const edges = new Map();
  faces.forEach((fc, fi) => fc.order.forEach((i, k) => { const j = fc.order[(k + 1) % fc.order.length], key = i < j ? `${i}-${j}` : `${j}-${i}`; edges.set(key, [...(edges.get(key) || []), fi]); }));
  let fill = "", back = "", front = "";
  faces.forEach((fc, fi) => {
    if (!fc.visible) return;
    const t = tone ? tone(fi, fc) : null;
    fill += poly(fc.order.map((i) => S[i]), { fill: t || mix("#ffffff", UT.green, 0.08 + 0.3 * (1 - dot3(fc.n, LIGHT)) / 2), stroke: "none" });
  });
  for (const [key, list] of edges) {
    const [i, j] = key.split("-").map(Number);
    if (list.some((fi) => faces[fi].visible)) front += seg(S[i], S[j], { width: 1.5 });
    else back += hid(S[i], S[j]);
  }
  return { markup: fill + back + front, S, at };
}
const CUBOID_FACES = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [2, 3, 7, 6], [0, 3, 7, 4], [1, 2, 6, 5]];
// 직육면체(가로 a · 안쪽 b · 높이 c) — 0~3 바닥(앞 왼쪽부터 시계 반대), 4~7 윗면
const cuboid = (a, b, c) => [[0, 0, 0], [a, 0, 0], [a, b, 0], [0, b, 0], [0, 0, c], [a, 0, c], [a, b, c], [0, b, c]];

// ── 1~4번
function q2() {
  const s = Math.sqrt(3), h = Math.sqrt(2);
  const V = [[Math.cos(-90 * R), Math.sin(-90 * R), 0], [Math.cos(30 * R), Math.sin(30 * R), 0], [Math.cos(150 * R), Math.sin(150 * R), 0], [0, 0, h]].map(([x, y, z]) => [x * s / Math.sqrt(3), y * s / Math.sqrt(3), z]);
  const { markup } = solid(V, [[0, 1, 2], [0, 1, 3], [1, 2, 3], [0, 2, 3]], ortho({ yaw: 14, pitch: 14 }), [40, 8, 200, 190]);
  return svg(280, 206, "정사면체", markup, 260);
}
function q3() {
  const V0 = cuboid(1, 1, 1);
  const cube = solid(V0, CUBOID_FACES, oblique({ k: 0.5, ang: 40 }), [8, 22, 112, 112]);
  // 깎인 정육면체: 각 모서리의 1/3, 2/3 되는 점 24개
  const V = [];
  for (const axisI of [0, 1, 2]) for (const a of [0, 1]) for (const b of [0, 1]) for (const t of [1 / 3, 2 / 3]) {
    const p = [0, 0, 0], others = [0, 1, 2].filter((k) => k !== axisI);
    p[axisI] = t; p[others[0]] = a; p[others[1]] = b; V.push(p);
  }
  const near = (p, q) => Math.abs(p - q) < 1e-9;
  const sets = [];
  for (const k of [0, 1, 2]) for (const v of [0, 1]) sets.push(V.map((p, i) => (near(p[k], v) ? i : -1)).filter((i) => i >= 0));
  for (const cx of [0, 1]) for (const cy of [0, 1]) for (const cz of [0, 1]) sets.push(V.map((p, i) => (Math.hypot(p[0] - cx, p[1] - cy, p[2] - cz) < 0.34 ? i : -1)).filter((i) => i >= 0));
  const cut = solid(V, sets, oblique({ k: 0.5, ang: 40 }), [176, 22, 112, 112], { tone: (fi, fc) => (fc.order.length === 3 ? FACE.dark : null) });
  // 잘려 나간 꼭짓점 조각(작은 삼각뿔)
  const piece = solid([[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]], [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]], oblique({ k: 0.5, ang: 40 }), [288, 4, 30, 34], { tone: (fi) => (fi === 3 ? FACE.dark : null) });
  const arrowBody = seg(P(138, 78), P(158, 78), { width: 2.2 }) + head(P(166, 78), P(150, 78), { size: 9 });
  return svg(320, 146, "정육면체와 각 모서리의 3분의 1 되는 곳을 잘라 낸 깎인 정육면체", cube.markup + arrowBody + cut.markup + piece.markup, 320);
}
function q4() {
  const T = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]];
  const V = [], key = [];
  T.forEach((a, i) => T.forEach((b, j) => { if (i !== j) { V.push(a.map((v, k) => v + (b[k] - v) / 3)); key.push([i, j]); } }));
  const sets = [];
  for (let i = 0; i < 4; i += 1) sets.push(key.map(([a], n) => (a === i ? n : -1)).filter((n) => n >= 0));
  for (let k = 0; k < 4; k += 1) sets.push(key.map(([a, b], n) => (a !== k && b !== k ? n : -1)).filter((n) => n >= 0));
  const { markup } = solid(V, sets, camera([-1, 0.16, -0.22], [0, 1, 1]), [50, 8, 190, 190], { tone: (fi, fc) => (fc.order.length === 3 ? FACE.dark : null) });
  return svg(290, 206, "정사면체의 각 꼭짓점 부분을 잘라 만든 입체도형", markup, 270);
}

// ── 5~8번
function frustum(c, rTop, rBot, h, { ry = 0.3, hole = 0 } = {}) {
  const top = P(c.x, c.y), bot = P(c.x, c.y + h);
  let out = poly([P(top.x - rTop, top.y), P(bot.x - rBot, bot.y), ...arcPts(bot, rBot, rBot * ry, Math.PI, 0).slice(1, -1), P(bot.x + rBot, bot.y), P(top.x + rTop, top.y)], { fill: FACE.side, stroke: "none" });
  out += draw(pathOf(arcPts(bot, rBot, rBot * ry, 0, Math.PI)), { fill: FACE.side, stroke: "none" });
  out += ellipse(top, rTop, rTop * ry, { fill: FACE.top });
  out += seg(P(top.x - rTop, top.y), P(bot.x - rBot, bot.y)) + seg(P(top.x + rTop, top.y), P(bot.x + rBot, bot.y)) + baseEllipse(bot, rBot, rBot * ry);
  if (hole) {
    out += ellipse(top, hole, hole * ry, { fill: "#fff" }) + hid(P(top.x - hole, top.y), P(bot.x - hole, bot.y)) + hid(P(top.x + hole, top.y), P(bot.x + hole, bot.y))
      + ellipse(bot, hole, hole * ry, { stroke: DASH, width: 1.1, dash: "4 3" });
  }
  return out;
}
function q5() {
  const ax = 178, s = 0.8;
  const top = 34, bot = top + 85 * s, gap = 18 * s;
  const trap = poly([P(ax - gap - 27 * s, top), P(ax - gap, top), P(ax - gap, bot), P(ax - gap - 50 * s, bot)], { fill: UT.yellowSoft, stroke: INK });
  const cone = (c, r, h) => poly([P(c.x, c.y), P(c.x - r, c.y + h), ...arcPts(P(c.x, c.y + h), r, r * 0.3, Math.PI, 0).slice(1, -1), P(c.x + r, c.y + h)], { fill: FACE.side, stroke: "none" })
    + seg(P(c.x, c.y), P(c.x - r, c.y + h)) + seg(P(c.x, c.y), P(c.x + r, c.y + h)) + baseEllipse(P(c.x, c.y + h), r, r * 0.3);
  const cyl = (c, r, h) => poly([P(c.x - r, c.y), P(c.x - r, c.y + h), ...arcPts(P(c.x, c.y + h), r, r * 0.3, Math.PI, 0).slice(1, -1), P(c.x + r, c.y + h), P(c.x + r, c.y)], { fill: FACE.side, stroke: "none" })
    + ellipse(c, r, r * 0.3, { fill: FACE.top }) + seg(P(c.x - r, c.y), P(c.x - r, c.y + h)) + seg(P(c.x + r, c.y), P(c.x + r, c.y + h)) + baseEllipse(P(c.x, c.y + h), r, r * 0.3);
  const y1 = 132, y2 = 228;
  return svg(320, 300, "사다리꼴과 회전축, 보기 입체도형 네 개",
    trap + axis(ax, 22, bot + 22, 30)
    + ringed(42, y1, "1", { r: 9, size: 11 }) + frustum(P(100, y1 + 4), 13, 36, 58)
    + ringed(186, y1, "2", { r: 9, size: 11 }) + frustum(P(244, y1 + 4), 32, 46, 58, { hole: 11 })
    + ringed(42, y2, "3", { r: 9, size: 11 }) + cone(P(100, y2), 36, 58)
    + ringed(186, y2, "4", { r: 9, size: 11 }) + cyl(P(244, y2 + 10), 36, 48), 320);
}
function q6() {
  const V = [-126, -54, 18, 90, 162].map((a) => [Math.cos(a * R), Math.sin(a * R), 0]);
  V.push([0, 0.05, 1.75]);
  const { markup } = solid(V, [[0, 1, 2, 3, 4], [0, 1, 5], [1, 2, 5], [2, 3, 5], [3, 4, 5], [4, 0, 5]], ortho({ yaw: 0, pitch: 16 }), [50, 8, 200, 220]);
  return svg(300, 236, "오각뿔", markup, 280);
}
function q7() {
  const box = solid(cuboid(6, 6, 8), CUBOID_FACES, oblique({ k: 0.5, ang: 40 }), [34, 30, 118, 150]);
  const a = box.at;
  const c = P(244, 70), r = 44, ry = 13, h = 88, b = P(c.x, c.y + h);
  const cyl = poly([P(c.x - r, c.y), P(c.x - r, b.y), ...arcPts(b, r, ry, Math.PI, 0).slice(1, -1), P(c.x + r, b.y), P(c.x + r, c.y)], { fill: FACE.side, stroke: "none" })
    + ellipse(c, r, ry, { fill: FACE.top }) + seg(P(c.x - r, c.y), P(c.x - r, b.y)) + seg(P(c.x + r, c.y), P(c.x + r, b.y)) + baseEllipse(b, r, ry)
    + seg(b, P(b.x + r, b.y), { width: 1.3 }) + dot(b, 2.4)
    + dim(P(c.x + r, c.y), P(b.x + r, b.y), "8㎝", -14) + dim(b, P(b.x + r, b.y), "4㎝", 1, { halo: true });
  return svg(320, 214, "직육면체와 원기둥",
    `<text x="10" y="14" dominant-baseline="central" style="font-size:12px;font-weight:700;fill:${INK}">(1)</text>`
    + box.markup + dim(a([6, 6, 8]), a([6, 6, 0]), "8㎝", -14) + dim(a([6, 0, 0]), a([6, 6, 0]), "6㎝", 12) + dim(a([0, 0, 0]), a([6, 0, 0]), "6㎝", 12)
    + `<text x="178" y="14" dominant-baseline="central" style="font-size:12px;font-weight:700;fill:${INK}">(2)</text>` + cyl, 320);
}
function q8() {
  const s = 8.6, r = 9 * s, k = 0.3, ry = r * k, h = 10 * s, c = P(150, 60), b = P(c.x, c.y + h);
  const sq = [[-1.5, -1.5], [1.5, -1.5], [1.5, 1.5], [-1.5, 1.5]].map(([u, v]) => { const a = 25 * R; return [u * Math.cos(a) - v * Math.sin(a), u * Math.sin(a) + v * Math.cos(a)]; });
  const onTop = ([u, v], y) => P(c.x + u * s, y - v * s * k * 1.9);
  const T = sq.map((p) => onTop(p, c.y)), B = sq.map((p) => onTop(p, b.y));
  const side = poly([P(c.x - r, c.y), P(c.x - r, b.y), ...arcPts(b, r, ry, Math.PI, 0).slice(1, -1), P(c.x + r, b.y), P(c.x + r, c.y)], { fill: FACE.dark, stroke: "none" });
  // 밑면 지름 18㎝: 밑면 양 끝을 잇는 바깥 곡선 점선(밑면 타원 아래로 지나가게)
  const span = dim(P(b.x - r, b.y), P(b.x + r, b.y), "18㎝", 1, { far: ry + 2 });
  return svg(320, 220, "가운데에 정사각형 모양 구멍을 뚫은 원기둥",
    side + ellipse(c, r, ry, { fill: FACE.side }) + seg(P(c.x - r, c.y), P(c.x - r, b.y)) + seg(P(c.x + r, c.y), P(c.x + r, b.y)) + baseEllipse(b, r, ry)
    + T.map((p, i) => hid(p, B[i])).join("") + poly(B, { stroke: DASH, width: 1.1, dash: "4 3" }) + poly(T, { fill: "#fff", width: 1.5 })
    + dim(P(c.x + r, c.y), P(b.x + r, b.y), "10㎝", -14) + span
    + leader(P(c.x + 46, c.y - 34), lerp(T[2], T[3], 0.5), "3㎝", { bend: 0.3 }) + leader(P(c.x - 52, c.y - 30), lerp(T[3], T[0], 0.5), "3㎝", { bend: -0.3 }), 320);
}

// ── 9~12번
function q9() {
  const s = 14, ax = 176, y0 = 46;
  const A = P(ax - 3 * s, y0), Bm = P(ax - 3 * s, y0 + 5 * s), C = P(ax - 7 * s, y0 + 5 * s), D = P(ax - 7 * s, y0 + 14 * s), E = P(ax, y0 + 14 * s);
  return svg(270, 266, "직선 ℓ에 붙은 두 직사각형",
    poly([P(ax, y0), A, Bm, C, D, E], { fill: UT.yellowSoft, stroke: INK }) + seg(Bm, P(ax, Bm.y)) + axis(ax, 20, E.y + 22, 30)
    + dim(A, P(ax, y0), "3㎝", -10) + dim(Bm, A, "5㎝", -12) + dim(D, C, "9㎝", -14) + dim(D, E, "7㎝", 14), 270);
}
function q10() {
  const box = solid(cuboid(8, 12, 20), CUBOID_FACES, oblique({ k: 0.5, ang: 45 }), [70, 8, 150, 226]);
  const a = box.at;
  return svg(300, 268, "직육면체 모양의 수조",
    box.markup + dim(a([8, 12, 20]), a([8, 12, 0]), "20㎝", -16) + dim(a([8, 0, 0]), a([8, 12, 0]), "12㎝", 12) + dim(a([0, 0, 0]), a([8, 0, 0]), "8㎝", 12), 300);
}
function q11() {
  const s = 9, r = 6 * s, c = P(196, 62), y1 = 150, y2 = y1 + 15 * s;
  const holes = [0, 60, 120, 180, 240, 300].map((d) => `<circle cx="${f(c.x + 4 * s * Math.cos(d * R))}" cy="${f(c.y + 4 * s * Math.sin(d * R))}" r="${2 * s}" fill="#fff" stroke="${INK}" stroke-width="1.4"/>`).join("");
  return svg(320, 300, "위와 앞에서 본 그림",
    `<circle cx="${c.x}" cy="${c.y}" r="${r}" fill="${FACE.side}" stroke="${INK}" stroke-width="1.5"/>` + holes
    + hid(P(c.x - r, c.y), P(c.x - r, y1)) + hid(P(c.x + r, c.y), P(c.x + r, y1))
    + `<rect x="${c.x - r}" y="${y1}" width="${2 * r}" height="${y2 - y1}" fill="${FACE.side}" stroke="${INK}" stroke-width="1.5"/>`
    + dim(P(c.x - r, y2), P(c.x + r, y2), "12㎝", -12) + dim(P(c.x + r, y1), P(c.x + r, y2), "15㎝", -14)
    + text(66, c.y, "<위에서 본 그림>", { size: 12, weight: 600 }) + text(66, (y1 + y2) / 2, "<앞에서 본 그림>", { size: 12, weight: 600 }), 320);
}
function q12() {
  const s = 10, r = 6 * s, ry = r * 0.3, b = P(140, 232);
  const topAt = (t) => P(b.x + r * Math.cos(t), b.y - (16 + 2 * Math.cos(t)) * s + ry * Math.sin(t));
  const topPts = Array.from({ length: 73 }, (_, i) => topAt(i * 2 * Math.PI / 72));
  const frontTop = Array.from({ length: 37 }, (_, i) => topAt(i * Math.PI / 36));
  const side = poly([...frontTop, P(b.x - r, b.y), ...arcPts(b, r, ry, Math.PI, 0).slice(1, -1), P(b.x + r, b.y)], { fill: FACE.side, stroke: "none" });
  return svg(300, 270, "비스듬히 자른 원기둥",
    side + draw(pathOf(topPts, true), { fill: FACE.top }) + seg(topAt(Math.PI), P(b.x - r, b.y)) + seg(topAt(0), P(b.x + r, b.y)) + baseEllipse(b, r, ry)
    + seg(b, P(b.x + r, b.y), { width: 1.3 }) + dot(b, 2.4)
    + dim(P(b.x - r, b.y), topAt(Math.PI), "14㎝", -14) + dim(topAt(0), P(b.x + r, b.y), "18㎝", -14)
    + dim(b, P(b.x + r, b.y), "6㎝", 1, { halo: true }), 300);
}

// ── 13~16번
function q13() {
  const s = 9, Rr = 8 * s, r = 6 * s, O = P(150, 66);
  const at = (deg, rad, c = O) => P(c.x + rad * Math.cos(deg * R), c.y - rad * Math.sin(deg * R));
  // 주어진 옆넓이·모선에 맞는 부채꼴(위쪽 45°~135°가 빈 모양)과 밑면 원
  const arc = Array.from({ length: 55 }, (_, i) => at(135 + i * 5, Rr));
  const C = P(O.x, O.y + Rr + r);
  return svg(300, 270, "원뿔의 전개도: 부채꼴과 원",
    poly([O, ...arc], { fill: FACE.side }) + `<circle cx="${f(C.x)}" cy="${f(C.y)}" r="${r}" fill="${FACE.dark}" stroke="${INK}" stroke-width="1.5"/>`
    + dim(at(135, Rr), O, "8㎝", -12), 300);
}
function q14() {
  const s = 15, alpha = Math.asin(4 / 12), h = Math.sqrt(128) * s, r = 4 * s, O = P(34, 132);
  const u = P(Math.cos(alpha), -Math.sin(alpha)), C = P(O.x + u.x * h, O.y + u.y * h);
  const rot = Math.atan2(u.y, u.x) / R; // 밑면 타원: 축 방향 짧은 지름
  const e = (t) => { const x = r * 0.32 * Math.cos(t), y = r * Math.sin(t), c = Math.cos(rot * R), sn = Math.sin(rot * R); return P(C.x + x * c - y * sn, C.y + x * sn + y * c); };
  const pts = Array.from({ length: 360 }, (_, i) => e(i * R));
  const ang = (p) => Math.atan2(p.y - O.y, p.x - O.x);
  const T1 = pts.reduce((m, p) => (ang(p) < ang(m) ? p : m)), T2 = pts.reduce((m, p) => (ang(p) > ang(m) ? p : m));
  return svg(300, 210, "옆으로 눕힌 원뿔과 점 O",
    poly([O, T1, T2], { fill: FACE.side }) + draw(pathOf(pts, true), { fill: "#fff" })
    + draw(`M${f(T2.x + 2)} ${f(T2.y + 6)} Q${f(T2.x + 26)} ${f(T2.y + 30)} ${f(T2.x + 4)} ${f(T2.y + 52)}`, { width: 1.4 }) + head(P(T2.x + 4, T2.y + 52), P(T2.x + 14, T2.y + 42), { size: 7 })
    + dot(O, 3.4) + nm(O, "O", 0, 18), 300);
}
function q15() {
  const s = 7.6, r = 5 * s, ry = r * 0.3, c = P(150, 24), b = P(c.x, c.y + 30 * s);
  let balls = "";
  for (let i = 0; i < 3; i += 1) {
    const k = P(c.x, c.y + (5 + 10 * i) * s);
    const seam = (side) => { const a = P(k.x + side * r * Math.cos(55 * R), k.y - r * Math.sin(55 * R)), z = P(k.x + side * r * Math.cos(55 * R), k.y + r * Math.sin(55 * R)); return draw(`M${f(a.x)} ${f(a.y)} Q${f(k.x + side * r * 0.08)} ${f(k.y)} ${f(z.x)} ${f(z.y)}`, { stroke: UT.orange, width: 1.6 }); };
    balls += `<circle cx="${f(k.x)}" cy="${f(k.y)}" r="${f(r)}" fill="${UT.yellowSoft}" stroke="${INK}" stroke-width="1.4"/>` + seam(-1) + seam(1);
  }
  return svg(300, 270, "원기둥 모양의 통에 넣은 테니스 공 세 개",
    balls + seg(P(c.x - r, c.y), P(b.x - r, b.y)) + seg(P(c.x + r, c.y), P(b.x + r, b.y)) + ellipse(c, r, ry) + baseEllipse(b, r, ry), 300);
}
function q16() {
  const s = 20;
  const one = (() => {
    const ax = 96, T = P(ax, 58), O = P(ax, 58 + 4 * s), L = P(ax - 3 * s, O.y), Bt = P(ax, O.y + 3 * s);
    return `<path d="M${f(T.x)} ${f(T.y)} L${f(L.x)} ${f(L.y)} A${3 * s} ${3 * s} 0 0 0 ${f(Bt.x)} ${f(Bt.y)} Z" fill="${UT.yellowSoft}" stroke="${INK}" stroke-width="1.5"/>`
      + axis(ax, 32, Bt.y + 16, 40) + hid(L, O) + rightAt(O, T, L, 8)
      + dim(L, T, "5㎝", -14) + dim(O, T, "4㎝", 19) + dim(L, O, "3㎝", 1) + dim(O, Bt, "3㎝", -19);
  })();
  const two = (() => {
    const ax = 214, O = P(ax, 58 + 4 * s), Rt = P(ax + 3 * s, O.y), T = P(ax + 3 * s, 58), Bt = P(ax, O.y + 3 * s);
    return `<path d="M${f(O.x)} ${f(O.y)} L${f(T.x)} ${f(T.y)} L${f(Rt.x)} ${f(Rt.y)} A${3 * s} ${3 * s} 0 0 1 ${f(Bt.x)} ${f(Bt.y)} Z" fill="${UT.yellowSoft}" stroke="${INK}" stroke-width="1.5"/>`
      + axis(ax, 32, Bt.y + 16, 40) + hid(O, Rt) + rightAt(Rt, T, O, 8) + rightAt(O, Bt, Rt, 8)
      + dim(O, T, "5㎝", -14) + dim(T, Rt, "4㎝", -16) + dim(O, Rt, "3㎝", 1) + dim(Bt, O, "3㎝", -19);
  })();
  return svg(320, 226, "직선 ℓ에 붙은 두 도형",
    `<text x="14" y="14" dominant-baseline="central" style="font-size:12px;font-weight:700;fill:${INK}">(1)</text>` + one
    + `<text x="164" y="14" dominant-baseline="central" style="font-size:12px;font-weight:700;fill:${INK}">(2)</text>` + two, 320);
}

// ── 17~20번
function q17() {
  const V = [[-5, -5, 0], [5, -5, 0], [5, 5, 0], [-5, 5, 0], [-2, -2, 6], [2, -2, 6], [2, 2, 6], [-2, 2, 6]];
  const fr = solid(V, CUBOID_FACES, oblique({ k: 0.42, ang: 32 }), [72, 14, 196, 150], { extra: [[0, 0, 10]] });
  const a = fr.at, apex = a([0, 0, 10]), mid = a([0, 0, 6]), foot = a([0, 0, 0]);
  const one = fr.markup + [4, 5, 6, 7].map((i) => hid(fr.S[i], apex)).join("") + hid(apex, foot) + dot(foot, 2)
    + rightAt(foot, apex, a([5, 0, 0]), 6)
    + leader(P(apex.x - 40, apex.y + 8), lerp(apex, mid, 0.5), "4㎝", { bend: 0.35 }) + leader(P(foot.x + 52, foot.y + 44), lerp(mid, foot, 0.62), "6㎝", { bend: 0.3 })
    + leader(P(fr.S[4].x - 34, fr.S[4].y - 4), lerp(fr.S[4], fr.S[5], 0.35), "4㎝", { bend: -0.3 }) + leader(P(fr.S[6].x + 34, fr.S[6].y - 2), lerp(fr.S[5], fr.S[6], 0.55), "4㎝", { bend: 0.3 })
    + dim(fr.S[0], fr.S[1], "10㎝", 12) + dim(fr.S[1], fr.S[2], "10㎝", 14);
  const s = 10.5, cx = 168, y0 = 214, rb = 8 * s, rt = 4 * s, ry = 0.28, hh = 6 * s;
  const T = P(cx, y0 + hh), B = P(cx, y0 + 2 * hh), A = P(cx, y0);
  const two = poly([P(T.x - rt, T.y), P(B.x - rb, B.y), ...arcPts(B, rb, rb * ry, Math.PI, 0).slice(1, -1), P(B.x + rb, B.y), P(T.x + rt, T.y)], { fill: FACE.side, stroke: "none" })
    + ellipse(T, rt, rt * ry, { fill: FACE.top }) + seg(P(T.x - rt, T.y), P(B.x - rb, B.y)) + seg(P(T.x + rt, T.y), P(B.x + rb, B.y)) + baseEllipse(B, rb, rb * ry)
    + hid(P(T.x - rt, T.y), A) + hid(P(T.x + rt, T.y), A) + hid(A, B) + hid(T, P(T.x + rt, T.y)) + hid(B, P(B.x + rb, B.y)) + dot(B, 2.2)
    + rightAt(T, A, P(T.x + rt, T.y), 6) + rightAt(B, A, P(B.x + rb, B.y), 6)
    + dim(A, T, "6㎝", 14) + dim(T, B, "6㎝", 14) + dim(T, P(T.x + rt, T.y), "4㎝", 1, { halo: true }) + dim(B, P(B.x + rb, B.y), "8㎝", 10);
  return svg(320, 372, "정사각뿔대와 원뿔대",
    `<text x="14" y="14" dominant-baseline="central" style="font-size:12px;font-weight:700;fill:${INK}">(1)</text>` + one
    + `<text x="14" y="${y0}" dominant-baseline="central" style="font-size:12px;font-weight:700;fill:${INK}">(2)</text>` + two, 320);
}
function q18() {
  const s = 10, r = 6 * s, ry = r * 0.3, c = P(140, 34), apex = P(c.x, c.y + 18 * s), w = P(c.x, c.y + 12 * s), rw = 2 * s;
  return svg(300, 232, "원뿔 모양의 그릇과 물",
    poly([P(c.x - r, c.y), apex, P(c.x + r, c.y)], { fill: "#fff", stroke: "none" })
    + poly([P(w.x - rw, w.y), apex, P(w.x + rw, w.y)], { fill: UT.greenSoft, stroke: "none" }) + ellipse(w, rw, rw * 0.3, { fill: FACE.dark, width: 1.3 })
    + seg(P(c.x - r, c.y), apex) + seg(P(c.x + r, c.y), apex) + ellipse(c, r, ry)
    + hid(c, apex) + hid(c, P(c.x + r, c.y)) + hid(w, P(w.x + rw, w.y))
    + dim(c, P(c.x + r, c.y), "6㎝", -9) + dim(w, c, "12㎝", -14) + dim(apex, w, "6㎝", -12, { halo: true })
    + dim(w, P(w.x + rw, w.y), "2㎝", 1, { halo: true }), 300);
}
function q19() {
  const s = 15, B = P(34, 150), C = P(34 + 12 * s, 150), A = P(C.x, 150 - 5 * s), M = lerp(B, C, 0.5);
  return svg(280, 176, "직각삼각형 ABC와 변 BC의 중점 M",
    poly([A, B, C], { fill: UT.greenSoft }) + seg(A, M) + rightAt(C, A, B, 9) + ticks(B, M) + ticks(M, C)
    + dim(B, A, "13㎝", -16) + dim(C, A, "5㎝", 12)
    + nm(A, "A", 0, -12) + nm(B, "B", -12, 2) + nm(C, "C", 10, 10) + nm(M, "M", 0, -14), 280);
}
function q20() {
  const s = 30, B = P(80, 100), C = P(B.x + 5 * s, B.y), A = P(B.x + 3.2 * s, B.y - 2.4 * s), D = P(B.x, B.y + 5 * s), E = P(C.x, D.y);
  return svg(310, 272, "직각삼각형 ABC와 변 BC 위의 정사각형 BDEC",
    poly([A, B, D], { fill: UT.greenSoft, stroke: "none" }) + poly([A, C, E], { fill: UT.greenSoft, stroke: "none" })
    + poly([A, B, C]) + poly([B, D, E, C]) + seg(A, D) + seg(A, E) + rightAt(A, B, C, 8)
    + dim(B, A, "4㎝", -12) + dim(A, C, "3㎝", -10)
    + nm(A, "A", 0, -13) + nm(B, "B", -13, 0) + nm(C, "C", 13, 0) + nm(D, "D", -12, 8) + nm(E, "E", 12, 8), 300);
}

// ── 21~25번
function q21() {
  const s = 12.5, B = P(50, 196), C = P(B.x + 10 * s, B.y), A = P(B.x + 5 * s, B.y - 12 * s);
  return svg(260, 226, "이등변삼각형 ABC",
    poly([A, B, C], { fill: UT.greenSoft }) + ticks(A, B) + ticks(A, C)
    + dim(B, A, "13㎝", -24) + dim(B, C, "10㎝", 12)
    + nm(A, "A", 0, -13) + nm(B, "B", -12, 4) + nm(C, "C", 12, 4), 260);
}
function q22() {
  const s = 4.6, A = P(196, 106), ub = P(-0.785, 0.62), uc = P(0.62, 0.785);
  const B = P(A.x + ub.x * 24 * s, A.y + ub.y * 24 * s), C = P(A.x + uc.x * 7 * s, A.y + uc.y * 7 * s), D = P(A.x - uc.x * 24 * s, A.y - uc.y * 24 * s);
  const E = P(B.x + D.x - A.x, B.y + D.y - A.y);

  return svg(280, 206, "직각삼각형 ABC와 변 AB 위의 정사각형 ADEB",
    poly([A, D, E, B]) + poly([A, B, C], { fill: UT.greenSoft }) + seg(E, C) + rightAt(A, B, C, 7)
    + dim(A, C, "x㎝", -12, { varName: true }) + dim(B, C, "25㎝", 12)
    + nm(A, "A", 2, -13) + nm(B, "B", -2, 14) + nm(C, "C", 12, 2) + nm(D, "D", 0, -12) + nm(E, "E", -13, 0), 280);
}
function q23() {
  const s = 24, B = P(64, 98), A = P(B.x, B.y - 3 * s), D = P(B.x + 4 * Math.sqrt(3) * s, B.y), C = P(D.x, D.y + 4 * s);
  const at30 = P(B.x + 34 * Math.cos(15 * R), B.y + 34 * Math.sin(15 * R));
  return svg(300, 216, "선분 AB와 선분 CD가 선분 BD에 수직인 그림",
    poly([A, B, C, D], { fill: UT.greenSoft, stroke: "none" }) + seg(A, B) + seg(B, D) + seg(D, C) + seg(A, D) + seg(B, C) + seg(A, C)
    + rightAt(B, A, D, 8) + rightAt(D, B, C, 8) + angleArc(B, D, C, 22) + lab(at30, "30°", { size: 12 })
    + dim(A, B, "3㎝", 12) + dim(D, C, "4㎝", -12)
    + nm(A, "A", 0, -12) + nm(B, "B", -12, 6) + nm(C, "C", 0, 14) + nm(D, "D", 12, -6), 300);
}
function q24() {
  const s = 12, r = 1.5 * s, ry = r * 0.5, top = P(110, 24), H = 8 * Math.PI * s, b = P(top.x, top.y + H);
  const at = (phi, y) => P(top.x + r * Math.cos(phi), y + ry * Math.sin(phi));
  // 앞(보이는 쪽)은 실선, 뒤는 점선 — 이어진 구간마다 한 줄로 그려야 점선이 고르게 나온다
  let thread = "", run = [], runFront = null;
  const flush = () => { if (run.length > 1) thread += draw(pathOf(run), runFront ? { stroke: UT.red, width: 1.8 } : { stroke: UT.red, width: 1.2, dash: "4 3" }); };
  const N = 240;
  for (let i = 0; i <= N; i += 1) {
    const t = i / N, phi = Math.PI + 4 * Math.PI * t, p = at(phi, top.y + H * t);
    const front = Math.sin(Math.PI + 4 * Math.PI * Math.min(t + 0.5 / N, 1 - 0.5 / N)) > 0;
    if (runFront === null) runFront = front;
    run.push(p);
    if (front !== runFront) { flush(); run = [p]; runFront = front; }
  }
  flush();
  const body = poly([P(top.x - r, top.y), P(b.x - r, b.y), ...arcPts(b, r, ry, Math.PI, 0).slice(1, -1), P(b.x + r, b.y), P(top.x + r, top.y)], { fill: FACE.side, stroke: "none" });
  return svg(220, H + 50, "실을 두 바퀴 감은 원기둥",
    body + ellipse(top, r, ry, { fill: FACE.top }) + seg(P(top.x - r, top.y), P(b.x - r, b.y)) + seg(P(top.x + r, top.y), P(b.x + r, b.y)) + baseEllipse(b, r, ry)
    + thread + dot(P(top.x - r, top.y), 2.6) + dot(P(b.x - r, b.y), 2.6) + nm(P(top.x - r, top.y), "A", -12, 0) + nm(P(b.x - r, b.y), "B", -12, 0), 220);
}
function q25() {
  const s = 14, B = P(30, 146), C = P(B.x + 14 * s, B.y), A = P(B.x + 8 * s, B.y - 6 * s);
  // 6√2㎝: 근호 선을 직접 그린다
  const serif = (x, y, v) => `<text x="${f(x)}" y="${f(y)}" text-anchor="middle" dominant-baseline="central" style="font-family:'FC Serif','Noto Serif KR',serif;font-size:12.5px;font-weight:400;fill:${INK}">${v}</text>`;
  const root = { w: "66√2㎝", draw: (p) => {
    const x = p.x - 22, y = p.y;
    return serif(x + 4, y + 1, "6")
      + `<polyline points="${f(x + 9)},${f(y + 1)} ${f(x + 11.5)},${f(y - 0.5)} ${f(x + 14.5)},${f(y + 6)} ${f(x + 18)},${f(y - 8)} ${f(x + 27)},${f(y - 8)}" fill="none" stroke="${INK}" stroke-width="1.1"/>`
      + serif(x + 22.5, y + 1, "2") + serif(x + 34, y + 1, "㎝");
  } };
  return svg(270, 180, "삼각형 ABC",
    poly([A, B, C], { fill: UT.greenSoft }) + dim(B, A, "10㎝", -14) + dim(A, C, root, -14) + dim(B, C, "14㎝", 12)
    + nm(A, "A", 0, -13) + nm(B, "B", -12, 2) + nm(C, "C", 12, 2), 270);
}

const Q = (number, prompt, figure, answer = { label: "답" }, extra = {}) => ({ number, prompt, figure, answer, ...extra });
const u = (unit, label = "답") => ({ label, unit });
export const questions = [
  Q(1, "어떤 입체도형의 옆면의 모양은 직사각형이고, 면의 수와 모서리의 수를 더하였더니 38입니다. 이 입체도형은 무엇입니까?", null),
  Q(2, "다음 그림과 같은 정사면체의 각 모서리의 중점을 잡아 그 점을 꼭짓점으로 하고, 그 꼭짓점을 연결한 선분을 모서리로 하는 입체도형을 구하시오.", q2),
  Q(3, "다음은 정육면체의 각 모서리의 1/3 되는 지점을 지나는 평면으로 잘라내어 만든 깎인 정육면체입니다. 이 도형의 면, 꼭짓점, 모서리의 수를 각각 구하시오.", q3,
    [u("개", "면"), u("개", "꼭짓점"), u("개", "모서리")], { mathPrompt: true }),
  Q(4, "다음 입체도형은 정사면체의 각 꼭짓점 부분을 단면이 정삼각형이 되도록 잘라서 만든 것입니다. 두 꼭짓점을 이은 대각선 중에서 도형의 내부에 있는 것은 모두 몇 개입니까?", q4, u("개")),
  Q(5, "다음과 같은 사다리꼴을 직선 ℓ을 축으로 하여 회전시켰을 때, 만들어지는 입체도형을 고르시오.", q5),
  Q(6, "다음 입체도형을 평면으로 잘랐을 때 나올 수 있는 다각형을 모두 쓰시오.", q6),
  Q(7, "다음 입체도형의 겉넓이를 구하시오.", q7, [u("㎠", "(1)"), u("㎠", "(2)")]),
  Q(8, "다음과 같이 원기둥의 가운데에 직육면체 모양으로 구멍을 뚫었습니다. 이 입체도형의 겉넓이를 구하시오.", q8, u("㎠")),
  Q(9, "다음 평면도형을 직선 ℓ을 축으로 하여 회전시킨 회전체의 겉넓이를 구하시오.", q9, u("㎠")),
  Q(10, "다음과 같은 직육면체 모양의 수조에 반지름이 4㎝인 원기둥 모양의 물체를 넣고, 물을 가득 채웠습니다. 원기둥 모양의 물체를 꺼냈더니 물의 높이가 3㎝ 낮아졌다면 원기둥의 높이는 몇 ㎝입니까? (단, 원주율은 3으로 계산합니다.)", q10, u("㎝")),
  Q(11, "다음 그림은 크기가 같은 6개의 작은 원기둥 모양의 구멍이 큰 원기둥의 안쪽에 꼭 맞게 나 있는 입체도형을 위, 앞에서 본 그림입니다. 이 입체도형의 부피를 구하시오.", q11, u("㎤")),
  Q(12, "다음 입체도형의 부피를 구하시오.", q12, u("㎤")),
  Q(13, "다음 전개도로 만들어지는 입체도형의 옆넓이가 48π㎠일 때, 겉넓이를 구하시오.", q13, u("㎠")),
  Q(14, "다음 그림은 밑면의 반지름이 4㎝이고, 모선의 길이가 12㎝인 원뿔입니다. 이 원뿔을 한 점 O를 중심으로 2회전 했을 때, 옆면이 움직인 부분의 넓이를 구하시오.", q14, u("㎠")),
  Q(15, "다음 그림과 같이 밑면의 반지름이 5㎝인 원기둥 모양의 통에 3개의 테니스 공을 꼭 맞게 넣었습니다. 원기둥 안의 빈 공간의 부피를 구하시오.", q15, u("㎤")),
  Q(16, "다음 도형을 직선 ℓ을 축으로 하여 회전시켰을 때, 만들어지는 회전체의 부피를 구하시오.", q16, [u("㎤", "(1)"), u("㎤", "(2)")]),
  Q(17, "다음 정사각뿔대와 원뿔대의 부피를 구하시오.", q17, [u("㎤", "(1)"), u("㎤", "(2)")]),
  Q(18, "다음 그림과 같이 원뿔 모양의 그릇에 일정한 속도로 물을 넣고 있습니다. 5초 동안 넣은 물의 깊이가 6㎝일 때, 물을 가득 채우려면 몇 초 동안 물을 더 넣어야 합니까?", q18, u("초")),
  Q(19, "오른쪽 그림의 삼각형 ABC에서 점 M이 변 BC의 중점일 때, 선분 AM의 길이를 구하시오.", q19, u("㎝")),
  Q(20, "오른쪽과 같이 각 A가 90°, 선분 AB가 4㎝, 선분 AC가 3㎝인 삼각형 ABC가 있습니다. 선분 BC를 한 변으로 하는 정사각형 BDEC를 그릴 때, 색칠한 부분의 넓이를 구하시오.", q20, u("㎠")),
  Q(21, "다음 그림과 같은 이등변삼각형 ABC의 넓이를 구하시오.", q21, u("㎠")),
  Q(22, "다음과 같이 직각삼각형 ABC에서 변 AB를 한 변으로 하는 정사각형 ADEB를 그렸습니다. 삼각형 EBC의 넓이가 288㎠일 때, 선분 AC의 길이를 구하시오.", q22, u("㎝")),
  Q(23, "다음 그림에서 선분 AB는 3㎝, 선분 CD는 4㎝, 각 CBD는 30°이고, 선분 AB와 선분 BD가 수직, 선분 BD와 선분 CD가 수직입니다. 선분 AC의 길이를 구하시오.", q23, u("㎝")),
  Q(24, "다음 그림과 같이 밑면의 반지름이 1.5㎝, 높이가 8π㎝인 원기둥이 있습니다. 점 A에서 점 B까지 팽팽하게 실로 두 바퀴 감을 때, 실의 길이를 구하시오.", q24, u("㎝")),
  Q(25, "다음 그림의 삼각형 ABC에서 선분 AB는 10㎝, 선분 BC는 14㎝, 선분 AC는 6√2㎝입니다. 삼각형 ABC의 넓이를 구하시오.", q25, u("㎠")),
];
