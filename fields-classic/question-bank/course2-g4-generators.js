// 2과정 G4 「도형의 복원과 측정」 교재 유사문제 생성기. 약속은 G1~G3 생성기와 같다.
// 문제는 모두 새로 지은 것이다. 답은 그림을 만든 수에서 계산한다.
import { plainText } from "./course2-plain.js?v=20261122zi";
import { dimArc, isLength } from "./length-dim.js?v=20261124a";

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sample = (items) => items[randomInt(0, items.length - 1)];
const INK = "#24302b", GREEN = "#2f6b52", SOFT = "#e6efe8", MARK = "#b4553f", YELLOW = "#fff1bf";
const R = Math.PI / 180;
const f1 = (v) => Math.round(v * 10) / 10;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const P = (x, y) => ({ x, y });
const at = (c, r, deg) => P(c.x + r * Math.cos(deg * R), c.y - r * Math.sin(deg * R));
const dirOf = (a, b) => Math.atan2(-(b.y - a.y), b.x - a.x) / R;
const mid = (a, b) => P((a.x + b.x) / 2, (a.y + b.y) / 2);

function problem({ prompt, subtype, html, answer, solution, family, meta = {} }) {
  return { prompt, visual: { kind: "c2", subtype, html }, answer: String(answer), solution, meta: { family, answer, ...meta } };
}
const svg = (w, h, body, label = "그림") => `<svg class="c2-fig" viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-label="${esc(label)}">${body}</svg>`;
const text = (x, y, value, { size = 15, anchor = "middle", color = INK, weight = 500 } = {}) =>
  `<text x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}" dominant-baseline="central" fill="${color}" font-weight="${weight}">${esc(value)}</text>`;
const line = (a, b, { color = INK, width = 2, dash = "" } = {}) =>
  `<line x1="${f1(a.x)}" y1="${f1(a.y)}" x2="${f1(b.x)}" y2="${f1(b.y)}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const poly = (points, { fill = "none", color = INK, width = 2, dash = "" } = {}) =>
  `<polygon points="${points.map((p) => `${f1(p.x)},${f1(p.y)}`).join(" ")}" fill="${fill}" stroke="${color}" stroke-width="${width}" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const rect = (x, y, w, h, { fill = "none", color = INK, width = 2 } = {}) =>
  `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="${fill}" stroke="${color}" stroke-width="${width}"/>`;
const dot = (p, r = 3.2, color = INK) => `<circle cx="${f1(p.x)}" cy="${f1(p.y)}" r="${r}" fill="${color}"/>`;
function angleMark(v, a1, a2, r, label, { color = MARK, size = 14 } = {}) {
  let span = a2 - a1;
  while (span <= 0) span += 360;
  if (span > 180) { a1 = a2; span = 360 - span; }
  const p1 = at(v, r, a1), p2 = at(v, r, a1 + span), m = at(v, r + 15, a1 + span / 2);
  return `<path d="M ${f1(p1.x)} ${f1(p1.y)} A ${r} ${r} 0 0 0 ${f1(p2.x)} ${f1(p2.y)}" fill="none" stroke="${color}" stroke-width="1.8"/>`
    + (label ? text(m.x, m.y, label, { size, color }) : "");
}
const tick = (a, b, n = 1) => {   // 같은 길이 표시
  const m = mid(a, b), d = dirOf(a, b) + 90;
  return Array.from({ length: n }, (_, k) => { const c = at(m, (k - (n - 1) / 2) * 5, dirOf(a, b)); return line(at(c, 6, d), at(c, -6, d), { width: 1.8 }); }).join("");
};
// 길이(「12cm」「?」)는 바깥 곡선 점선 + 끊은 자리에 글자(length-dim.js, 스킬 gfield-textbook-design 4-3), 그 밖의 글자는 변 옆 그대로.
// offset 쪽(변 진행 방향 왼쪽이 +)으로 휜다 — dimArc의 bend는 오른쪽이 +라 부호를 바꾼다.
// 세로에 가까운 변은 가로로 쓴 글자가 변에 닿지 않게 글자 반 폭만큼은 띄운다(clearBend)
const clearBend = (a, b, value, bend, size = 13) => {
  const len = Math.hypot(b.x - a.x, b.y - a.y) || 1, w = String(value).length * 0.62 * size, h = size * 1.1;
  const need = Math.abs(b.y - a.y) / len * w / 2 + Math.abs(b.x - a.x) / len * h / 2 + 3;
  return Math.sign(bend || 1) * Math.max(Math.abs(bend), need);
};
const lenLabel = (a, b, value, { offset = 14, color = INK, size = 13 } = {}) => {
  if (isLength(value)) return dimArc(a.x, a.y, b.x, b.y, clearBend(a, b, value, -offset * 0.9, size), value, { size, labelColor: color === INK ? null : color });
  const m = mid(a, b), p = at(m, offset, dirOf(a, b) + 90); return text(p.x, p.y, value, { size, color });
};
const name = (p, t, dx = 0, dy = 0) => text(p.x + dx, p.y + dy, t, { size: 14, weight: 700 });

// ════ 1단원 특수각과 도형의 복원 ════
// 1. 정사각형 + 정삼각형, 같은 길이 사슬 — 이등변삼각형의 밑각으로 각을 되살린다
function c2SpecialAngle({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "inside" : sample(["inside", "outside", "chain"]);
  if (kind === "chain") {
    const n = difficulty >= 3 ? 3 : 2, a = sample(n === 3 ? [10, 12, 15, 18, 20] : [15, 18, 20, 24, 25, 30]);
    // 꼭짓점 O에서 두 반직선, 같은 길이로 지그재그 — 삼각형 k번째 바깥 각 = (k+1)a
    const O = P(30, 190);
    const ray1 = (t) => at(O, t, 0), ray2 = (t) => at(O, t, a);
    // 길이 1인 선분으로 번갈아: P0 = O, P1 on ray2? 계산: 지그재그 점 거리(사인 법칙)
    const pts = [O];
    // 첫 선분 O→P1(위 반직선)과 뒤의 선분이 모두 같은 길이 s
    const s = 70;
    let onFirst = true;
    pts.push(ray2(s));
    for (let k = 1; k <= n; k += 1) {
      // 다음 점: 반대 반직선 위, 앞 점에서 거리 s
      const prev = pts[pts.length - 1];
      const ray = onFirst ? ray1 : ray2;
      // 반직선 위 점 t: |ray(t) − prev| = s, 바깥쪽 해
      const u = onFirst ? 0 : a;
      const dx = Math.cos(u * R), dy = -Math.sin(u * R);
      const px = prev.x - O.x, py = prev.y - O.y;
      const B = -2 * (px * dx + py * dy), C = px * px + py * py - s * s;
      const t = (-B + Math.sqrt(Math.max(0, B * B - 4 * C))) / 2;
      pts.push(ray(t)); onFirst = !onFirst;
    }
    let body = line(O, at(O, Math.max(...pts.map((p) => Math.hypot(p.x - O.x, p.y - O.y))) + 30, 0), { width: 2 }) + line(O, at(O, Math.max(...pts.map((p) => Math.hypot(p.x - O.x, p.y - O.y))) + 30, a), { width: 2 });
    for (let i = 1; i < pts.length - 1; i += 1) body += line(pts[i], pts[i + 1], { width: 2 }) + tick(pts[i], pts[i + 1]);
    body += tick(O, pts[1]);
    body += angleMark(O, 0, a, 34, `${a}°`, { color: INK });
    const last = pts[pts.length - 1], before = pts[pts.length - 2];
    const lastOnFirst = !onFirst;
    // ? = 마지막 선분이 반직선과 이루는 바깥쪽 각
    const outDir = lastOnFirst ? 0 : a;
    body += angleMark(last, outDir, dirOf(last, before), 20, "?");
    const ans = (n + 1) * a;
    const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
    return problem({
      prompt: `꼭짓점 O에서 ${a}°로 벌어진 두 직선 위에 같은 길이의 선분을 지그재그로 이어 그렸습니다(같은 표시는 같은 길이). ?의 각은 몇 도인가요?`,
      subtype: "special-angle", html: svg(Math.max(...xs) + 60, 220, body, "같은 길이로 이은 지그재그"), answer: `${ans}°`,
      solution: `같은 길이의 두 변을 가진 삼각형은 이등변삼각형이라 두 밑각이 같습니다. 첫 삼각형의 밑각은 ${a}°이고 바깥 각은 두 내각의 합 ${2 * a}°입니다. 다음 이등변삼각형의 밑각이 ${2 * a}°가 되고, 그 다음 바깥 각은 ${a} + ${2 * a} = ${3 * a}°… 이렇게 ${a}°씩 늘어 ?는 ${ans}°입니다.`,
      family: `special-chain-${n}`, meta: { a, n }
    });
  }
  const s = 150, A = P(40, 30), B = P(40, 30 + s), C = P(40 + s, 30 + s), D = P(40 + s, 30);
  if (kind === "inside") {
    // 정사각형 ABCD 안에 BC를 한 변으로 하는 정삼각형 EBC
    const E = at(B, s, 60);
    let body = poly([A, B, C, D], { fill: "#fff" }) + poly([E, B, C], { fill: SOFT }) + line(A, E) + line(D, E);
    body += name(A, "A", -12, -8) + name(B, "B", -12, 10) + name(C, "C", 12, 10) + name(D, "D", 12, -8) + name(E, "E", 0, -14);
    const q = sample(["BAE", "EAD", "AED"]);
    const ans = { BAE: 75, EAD: 15, AED: 150 }[q];
    if (q === "BAE") body += angleMark(A, dirOf(A, B), dirOf(A, E), 24, "?");
    if (q === "EAD") body += angleMark(A, dirOf(A, E), dirOf(A, D), 30, "?");
    if (q === "AED") body += angleMark(E, dirOf(E, A), dirOf(E, D), 18, "?");
    return problem({
      prompt: `정사각형 ABCD 안에 변 BC를 한 변으로 하는 정삼각형 EBC를 그렸습니다. 각 ${q[0]}${q[1]}${q[2]}의 크기는 몇 도인가요?`,
      subtype: "special-angle", html: svg(s + 90, s + 70, body, "정사각형 안의 정삼각형"), answer: `${ans}°`,
      solution: `BE = BC = AB이므로 삼각형 ABE는 이등변삼각형입니다. 각 ABE = 90 − 60 = 30°이므로 두 밑각은 (180 − 30) ÷ 2 = 75°, 각 BAE = 75°입니다. 각 EAD = 90 − 75 = 15°이고, 삼각형 AED도 이등변(EA = ED)이라 각 AED = 180 − 15 × 2 = 150°입니다. 답은 ${ans}°입니다.`,
      family: `special-inside-${q}`, meta: {}
    });
  }
  // 정사각형 ABCD 바깥, 변 BC 위로 정삼각형 BCE(오른쪽 바깥)
  const E2 = P(D.x + s * Math.sin(60 * R), (D.y + C.y) / 2);
  let body = poly([A, B, C, D], { fill: "#fff" }) + poly([D, C, E2], { fill: SOFT }) + line(A, E2);
  body += name(A, "A", -12, -8) + name(B, "B", -12, 10) + name(C, "C", 0, 14) + name(D, "D", 0, -14) + name(E2, "E", 12, 0);
  body += angleMark(A, dirOf(A, E2), dirOf(A, D), 34, "?");
  return problem({
    prompt: `정사각형 ABCD의 변 DC 바깥쪽에 정삼각형 DCE를 붙였습니다. 각 DAE의 크기는 몇 도인가요?`,
    subtype: "special-angle", html: svg(E2.x + 40, s + 70, body, "정사각형과 바깥 정삼각형"), answer: "15°",
    solution: `DE = DC = DA이므로 삼각형 ADE는 이등변삼각형입니다. 각 ADE = 90 + 60 = 150°이므로 두 밑각은 (180 − 150) ÷ 2 = 15°, 각 DAE = 15°입니다.`,
    family: "special-outside", meta: {}
  });
}
// 2. 삼각자(30°·60°·90°) — 30°를 마주 보는 변은 빗변의 반
function c2SetSquareSide({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "half" : sample(["half", "area30", "area150"]);
  if (kind === "half") {
    const h = randomInt(3, 12) * 2;
    const C = P(40, 170), B = P(40 + h * 0.866 * 10, 170), A = P(40, 170 - (h / 2) * 10);
    const sc = Math.min(1, 240 / (B.x - 20));
    const T = (p) => P(40 + (p.x - 40) * sc, 170 - (170 - p.y) * sc);
    const [a, b, c] = [A, B, C].map(T);
    const body = poly([a, b, c], { fill: SOFT }) + angleMark(b, 180, dirOf(b, a), 30, "30°", { color: INK }) + `<path d="M ${c.x + 12} ${c.y} L ${c.x + 12} ${c.y - 12} L ${c.x} ${c.y - 12}" fill="none" stroke="${INK}" stroke-width="1.6"/>`
      + lenLabel(a, b, `${h}cm`, { offset: 16 }) + lenLabel(c, a, "?", { offset: 14, color: MARK });
    return problem({
      prompt: `한 각이 30°인 직각삼각형의 빗변(직각과 마주 보는 변)이 ${h}cm입니다. 30°인 각과 마주 보는 변은 몇 cm인가요?`,
      subtype: "set-square", html: svg(b.x + 40, 200, body, "30°·60°·90° 삼각형"), answer: `${h / 2}cm`,
      solution: `이 삼각형을 30°와 마주 보는 변을 따라 거울처럼 하나 더 붙이면 세 각이 모두 60°인 정삼각형이 됩니다. 정삼각형의 한 변이 빗변 ${h}cm이고, 30°와 마주 보는 변은 그 한 변의 반이므로 ${h / 2}cm입니다.`,
      family: "set-square-half", meta: { h }
    });
  }
  const a = randomInt(3, 9) * 2, b = randomInt(4, 12);
  const ang = kind === "area30" ? 30 : 150;
  const B = P(60, 170), C = at(B, b * 16, 0), A = at(B, Math.max(a * 12, ang === 150 ? 96 : 0), ang);   // 150°는 변과 늘인 밑변 사이가 좁아 짧은 변이면 길이 글자가 들어갈 자리가 없다
  const minX = Math.min(A.x, B.x, C.x) - 30;
  const shift = (p) => P(p.x - minX + 10, p.y);
  const [pa, pb, pc] = [A, B, C].map(shift);
  const foot = P(pa.x, pb.y);
  let body = poly([pa, pb, pc], { fill: YELLOW }) + angleMark(pb, 0, ang, 26, `${ang}°`, { color: INK }) + lenLabel(pb, pc, `${b}cm`, { offset: -14 }) + lenLabel(pb, pa, `${a}cm`, { offset: 14 });
  body += line(pa, foot, { color: GREEN, dash: "5 4" }) + (kind === "area150" ? line(pb, foot, { color: GREEN, dash: "3 3", width: 1.2 }) : "");
  const area = (b * (a / 2)) / 2;
  return problem({
    prompt: `두 변이 ${a}cm, ${b}cm이고 그 사이의 각이 ${ang}°인 삼각형의 넓이는 몇 ㎠인가요?`,
    subtype: "set-square", html: svg(Math.max(pa.x, pc.x) + 40, 200, body, `끼인각이 ${ang}°인 삼각형`), answer: `${area}㎠`,
    solution: `${b}cm인 변을 밑변으로 놓고 맞은편 꼭짓점에서 높이(점선)를 내리면 ${kind === "area30" ? "30°" : "밑변을 늘인 쪽에 30°(180 − 150)"}를 가진 삼각자 모양이 생깁니다. 30°와 마주 보는 변인 높이는 빗변 ${a}cm의 반, ${a / 2}cm입니다. 넓이 = ${b} × ${a / 2} ÷ 2 = ${area}㎠입니다.`,
    family: `set-square-${kind}`, meta: { a, b }
  });
}

// ════ 2단원 평행선과 색종이 접기 ════
// 3. 종이 띠 접기 — 접힌 부분은 이등변삼각형
function c2FoldTapeAngle({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "forward" : sample(["forward", "reverse"]);
  const a = randomInt(30, 70);   // 접는 선이 띠의 변과 이루는 각
  const x = 180 - 2 * a;         // 접혀 올라간 띠가 위 변(남은 쪽)과 이루는 각
  const top = 150, bot = 230, H = bot - top;
  // 접는 선 F1(아래 변) → F2(위 변)는 오른쪽 위로(수학 방향 a). 오른쪽 부분을 접는 선에 대해 뒤집으면 두 변이 방향 2a로 올라간다
  const F1 = P(150, bot), F2 = P(150 + H / Math.tan(a * R), top);
  const L = 150, u1 = at(F1, L, 2 * a), u2 = at(F2, L, 2 * a);
  let body = poly([P(20, top), F2, F1, P(20, bot)], { fill: SOFT, width: 0 }) + line(P(20, top), F2) + line(P(20, bot), F1);
  body += poly([F1, F2, u2, u1], { fill: "rgba(255,241,191,.9)", width: 2 }) + line(F1, F2, { color: MARK, dash: "6 4", width: 2 });
  body += line(F2, P(F2.x + 50, top), { color: "#9aa39e", dash: "4 4", width: 1.2 });
  body += angleMark(F2, 0, a + 180, 22, kind === "forward" ? `${a}°` : "?", { color: kind === "forward" ? INK : MARK });
  body += angleMark(F2, 2 * a, 180, 30, kind === "forward" ? "?" : `${x}°`, { color: kind === "forward" ? MARK : INK });
  const ys = [u1.y, u2.y, top], xs = [u1.x, u2.x, F2.x + 50];
  const dy = 20 - Math.min(...ys), w = Math.max(...xs) + 30;
  const html = svg(w, bot + dy + 20, `<g transform="translate(0 ${f1(dy)})">${body}</g>`, "접은 종이 띠");
  if (kind === "forward") return problem({
    prompt: `폭이 일정한 종이 띠(위아래 변이 평행)를 점선을 따라 접었습니다. 접는 선이 위 변과 이루는 각이 ${a}°일 때, 접혀 올라간 띠가 위 변의 남은 쪽과 이루는 각 ?는 몇 도인가요?`,
    subtype: "fold-tape", html, answer: `${x}°`,
    solution: `접으면 접는 선 양쪽의 각이 같으므로 접혀 올라간 띠의 변도 접는 선과 ${a}°를 이룹니다(위 변과 접혀 올라간 변이 접는 선을 사이에 두고 ${a}°씩). 위 변의 오른쪽(점선)에서 접혀 올라간 변까지는 ${a} + ${a} = ${2 * a}°이므로, 남은 쪽과 이루는 ?는 180 − ${2 * a} = ${x}°입니다.`,
    family: "fold-tape-forward", meta: { a }
  });
  return problem({
    prompt: `폭이 일정한 종이 띠를 점선을 따라 접었더니 접혀 올라간 띠가 위 변의 남은 쪽과 ${x}°를 이루었습니다. 접는 선이 위 변과 이루는 각 ?는 몇 도인가요?`,
    subtype: "fold-tape", html, answer: `${a}°`,
    solution: `위 변의 오른쪽(점선)에서 접혀 올라간 변까지는 180 − ${x} = ${2 * a}°이고, 접는 선이 이 각을 똑같이 둘로 나눕니다(접은 양쪽이 같음). ? = ${2 * a} ÷ 2 = ${a}°입니다.`,
    family: "fold-tape-reverse", meta: { a }
  });
}

// ════ 4단원 평면도형의 둘레 ════
// 4. 직각으로 꺾인 도형의 둘레 — 꺾인 변을 옮기면 둘러싼 직사각형
function c2RectilinearPerimeter({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "stair" : sample(["stair", "notch"]);
  const W = randomInt(8, 16), H = randomInt(6, 12);
  const k = Math.min(16, 220 / W), o = P(48, 30);   // 왼쪽 세로 길이 곡선 점선이 도형 바깥(왼쪽)에 들어갈 자리
  let pts, extra = 0, d = 0;
  if (kind === "stair") {
    // 왼쪽 위에서 오른쪽 아래로 내려가는 계단(꺾인 자리 2~3번)
    const steps = randomInt(2, 3);
    const xs = [0], ys = [0];
    for (let i = 1; i < steps; i += 1) { xs.push(Math.round((W * i) / steps)); ys.push(Math.round((H * i) / steps)); }
    pts = [P(0, 0)];
    for (let i = 1; i < steps; i += 1) { pts.push(P(xs[i], ys[i - 1])); pts.push(P(xs[i], ys[i])); }
    pts.push(P(W, ys[steps - 1])); pts.push(P(W, H)); pts.push(P(0, H));
  } else {
    d = randomInt(2, Math.max(2, Math.floor(H / 2)));
    const x1 = randomInt(2, W - 5), x2 = x1 + 3;   // 홈 폭은 문제에 쓰지 않는다 — 깊이 길이 글자가 홈 안에 들어가게 3칸
    pts = [P(0, 0), P(x1, 0), P(x1, d), P(x2, d), P(x2, 0), P(W, 0), P(W, H), P(0, H)];
    extra = 2 * d;
  }
  const scr = pts.map((p) => P(o.x + p.x * k, o.y + p.y * k));
  let body = poly(scr, { fill: YELLOW, width: 2.4 });
  body += lenLabel(P(o.x, o.y + H * k), P(o.x + W * k, o.y + H * k), `${W}cm`, { offset: -14 }) + lenLabel(P(o.x, o.y), P(o.x, o.y + H * k), `${H}cm`, { offset: -16 });
  // 홈의 깊이 = 홈 왼쪽 벽의 두 끝을 잇는 곡선 점선, 홈 안쪽(도형 바깥)으로 휜다
  // 홈이 얕아 글자가 곡선 밖으로 나가면(글자 폭 > 홈 깊이의 0.6) 곡선을 벽에 붙여 글자가 홈 안에 남게
  if (kind === "notch") {
    const dl = `${d}cm`, outside = dl.length * 0.62 * 12 + 8 > d * k * 0.6;
    body += dimArc(scr[1].x, scr[1].y, scr[2].x, scr[2].y, outside ? -6 : clearBend(scr[1], scr[2], dl, -8, 12), dl, { size: 12 });
  }
  const per = 2 * (W + H) + extra;
  return problem({
    prompt: kind === "stair"
      ? `모든 각이 직각인 계단 모양 도형입니다. 가장 긴 가로가 ${W}cm, 가장 긴 세로가 ${H}cm일 때 둘레는 몇 cm인가요?`
      : `모든 각이 직각인 도형입니다. 가로 ${W}cm, 세로 ${H}cm인 직사각형의 윗변에서 깊이 ${d}cm만큼 안으로 파인 홈이 있습니다. 둘레는 몇 cm인가요?`,
    subtype: "rectilinear-perimeter", html: svg(W * k + 88, H * k + 60, body, "직각으로 꺾인 도형"), answer: `${per}cm`,
    solution: kind === "stair"
      ? `계단의 가로 토막을 위로, 세로 토막을 오른쪽으로 옮기면 가로 ${W}cm, 세로 ${H}cm인 직사각형의 둘레와 꼭 같아집니다. (${W} + ${H}) × 2 = ${per}cm입니다.`
      : `파인 홈의 바닥을 위로 옮기면 직사각형의 둘레 (${W} + ${H}) × 2 = ${2 * (W + H)}cm가 되고, 홈의 양옆 세로 변 ${d}cm 두 개가 더 남습니다. ${2 * (W + H)} + ${d} × 2 = ${per}cm입니다.`,
    family: `rectilinear-${kind}`, meta: { W, H }
  });
}
// 5. 두 선분으로 넷으로 나눈 직사각형 — 마주 보는 두 조각의 둘레의 합은 같다
function c2RectPartsPerimeter({ difficulty = 2 }) {
  const w1 = randomInt(3, 9), w2 = randomInt(3, 9), h1 = randomInt(2, 7), h2 = randomInt(2, 7);
  const per = (w, h) => 2 * (w + h);
  const ps = { a: per(w1, h1), b: per(w2, h1), c: per(w1, h2), d: per(w2, h2) };   // a 왼위, b 오른위, c 왼아래, d 오른아래
  const kind = difficulty <= 1 ? "fourth" : sample(["fourth", "whole"]);
  const k = Math.min(220 / (w1 + w2), 160 / (h1 + h2)), o = P(30, 20);
  const X = o.x + w1 * k, Y = o.y + h1 * k, Wp = (w1 + w2) * k, Hp = (h1 + h2) * k;
  let body = rect(o.x, o.y, Wp, Hp, { fill: "#fff", width: 2.4 }) + line(P(X, o.y), P(X, o.y + Hp)) + line(P(o.x, Y), P(o.x + Wp, Y));
  const lab = (x, y, t, c = INK) => text(x, y, t, { size: 14, color: c });
  if (kind === "fourth") {
    body += lab((o.x + X) / 2, (o.y + Y) / 2, `${ps.a}cm`) + lab((X + o.x + Wp) / 2, (o.y + Y) / 2, `${ps.b}cm`) + lab((o.x + X) / 2, (Y + o.y + Hp) / 2, `${ps.c}cm`) + lab((X + o.x + Wp) / 2, (Y + o.y + Hp) / 2, "?", MARK);
    return problem({
      prompt: `직사각형을 가로·세로 선분 하나씩으로 나누어 작은 직사각형 4개를 만들었습니다. 세 직사각형의 둘레가 그림과 같을 때, 오른쪽 아래 직사각형의 둘레는 몇 cm인가요?`,
      subtype: "rect-parts", html: svg(Wp + 60, Hp + 40, body, "넷으로 나눈 직사각형"), answer: `${ps.d}cm`,
      solution: `왼쪽 위와 오른쪽 아래의 둘레를 더하면 (왼쪽 폭 + 위 높이 + 오른쪽 폭 + 아래 높이) × 2이고, 오른쪽 위와 왼쪽 아래를 더해도 같은 네 길이가 들어갑니다. 그래서 ? = ${ps.b} + ${ps.c} − ${ps.a} = ${ps.d}cm입니다.`,
      family: "rect-parts-fourth", meta: { w1, w2, h1, h2 }
    });
  }
  body += lab((o.x + X) / 2, (o.y + Y) / 2, `${ps.a}cm`) + lab((X + o.x + Wp) / 2, (Y + o.y + Hp) / 2, `${ps.d}cm`);
  return problem({
    prompt: `직사각형을 가로·세로 선분 하나씩으로 나누었습니다. 왼쪽 위 직사각형의 둘레가 ${ps.a}cm, 오른쪽 아래 직사각형의 둘레가 ${ps.d}cm일 때, 큰 직사각형의 둘레는 몇 cm인가요?`,
    subtype: "rect-parts", html: svg(Wp + 60, Hp + 40, body, "넷으로 나눈 직사각형"), answer: `${ps.a + ps.d}cm`,
    solution: `큰 직사각형의 가로 = 왼쪽 폭 + 오른쪽 폭, 세로 = 위 높이 + 아래 높이입니다. 왼쪽 위 둘레 + 오른쪽 아래 둘레 = (왼쪽 폭 + 위 높이 + 오른쪽 폭 + 아래 높이) × 2 = 큰 직사각형의 둘레이므로 ${ps.a} + ${ps.d} = ${ps.a + ps.d}cm입니다.`,
    family: "rect-parts-whole", meta: { w1, w2, h1, h2 }
  });
}

export const COURSE2_G4_GENERATORS = plainText({ c2SpecialAngle, c2SetSquareSide, c2FoldTapeAngle, c2RectilinearPerimeter, c2RectPartsPerimeter });
export const COURSE2_G4_TYPE_ROWS = [
  ["c2-special-angle", "geometry", "각", "정사각형·정삼각형과 같은 길이로 되살리는 각", "c2SpecialAngle"],
  ["c2-set-square-side", "geometry", "삼각자", "30°와 마주 보는 변은 빗변의 반", "c2SetSquareSide"],
  ["c2-fold-tape-angle", "geometry", "색종이 접기", "접은 종이 띠의 각", "c2FoldTapeAngle"],
  ["c2-rectilinear-perimeter", "geometry", "둘레", "직각으로 꺾인 도형의 둘레", "c2RectilinearPerimeter"],
  ["c2-rect-parts-perimeter", "geometry", "둘레", "넷으로 나눈 직사각형의 둘레", "c2RectPartsPerimeter"]
];
export const COURSE2_G4_GUIDES = Object.freeze({
  "c2-special-angle": "같은 길이의 두 변을 찾아 이등변삼각형을 만들고, 밑각이 같다는 것으로 각을 되살립니다.",
  "c2-set-square-side": "30°·60°·90° 삼각형 둘을 붙이면 정삼각형 — 30°와 마주 보는 변은 빗변의 반입니다.",
  "c2-fold-tape-angle": "접는 선 양쪽의 각은 같고, 평행한 두 변에서는 엇각이 같습니다.",
  "c2-rectilinear-perimeter": "꺾인 변을 바깥으로 옮기면 둘러싼 직사각형의 둘레가 됩니다(안으로 파인 홈의 옆변만 더함).",
  "c2-rect-parts-perimeter": "마주 보는(대각선 자리) 두 조각의 둘레의 합은 큰 직사각형의 둘레와 같습니다."
});
