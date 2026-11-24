// 2과정 G5 「도형의 넓이와 비」 그림 논증 — 본책 1단원(정다각별과 나비각)·2단원(평행선과 등적변형)·
// 3단원(도형의 넓이와 비)·4단원(닮음과 비)의 「왜 그럴까」.
// 본책은 「원주각은 중심각의 몇 배」「높이가 같으면 넓이는 밑변에 비례」처럼 성질을 채워 넣게 한다.
// 여기서는 그 성질이 반드시 그런 까닭(이등변삼각형·외각·평행선·합동)을 장면마다 근거로 쌓고,
// 「다른 …으로」를 눌러 다른 모양·다른 비에서도 같은 논증이 통한다는 것(일반화)을 본다. 그림 도구는 proof-board.js.
import { C, P, add, sub, mul, lerp, mid, dist, dirDeg, polar, rot, clamp, ease, phase } from "../proof-board.js";
import { dimArc } from "../length-dim.js?v=20261124a";

const pick = (list, seed) => list[seed % list.length];
// 길이 = 두 끝을 짚는 바깥 곡선 점선 + 그 가운데 끊은 자리에 손글씨(스킬 gfield-textbook-design 4-3,
// 원장 2026-11-24 「도형의 변의 길이를 점선 호를 사용하여 길이를 써야지 기준이잖아」). 곡선·끊는 자리 계산은 length-dim.js dimArc.
//   away: 도형 안쪽 점 — 그 반대쪽(바깥)으로 휜다 · side: +1/−1로 직접(a→b 진행 방향의 오른쪽이 +) · off: 곡선 꼭대기와 선분 사이
const HAND = "'FC Hand','Nanum Pen Script',cursive";
function dimLen(f, a, b, text, { away, side, off = 18, size = 16, color = C.ink, opacity = 1 } = {}) {
  const l = Math.hypot(b.x - a.x, b.y - a.y);
  if (opacity <= 0 || text == null || text === "" || l < 2) return f;
  const nx = -(b.y - a.y) / l, ny = (b.x - a.x) / l, mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const sg = side ?? ((mx - away.x) * nx + (my - away.y) * ny >= 0 ? 1 : -1);
  // 글자 상자가 선분에 걸리지 않을 만큼은 띄운다(세로 변의 긴 글자). 글자가 구간보다 길면 dimArc가 곡선 바깥에 둔다
  const fs = size * 1.3, w = [...String(text)].reduce((t, ch) => t + (/[0-9.]/.test(ch) ? 0.56 : /[a-z]/i.test(ch) ? 0.58 : /\s/.test(ch) ? 0.3 : 0.95) * fs, 0);
  const bend = w + 6 > l * 0.6 ? off : Math.max(off, Math.abs(nx) * w / 2 + Math.abs(ny) * fs * 0.55 + 4);
  const svg = dimArc(a.x, a.y, b.x, b.y, sg * bend, text, { size: size * 1.3, font: HAND, ink: color, color, width: 1.5, dash: "5 4", gap: 3 })
    .replace("<text ", `<text stroke="${C.paper}" stroke-width="5" paint-order="stroke" `);   // 다른 글자처럼 종이색 테두리
  return f.raw(`<g class="pf-dim"${opacity < 1 ? ` opacity="${Math.round(opacity * 100) / 100}"` : ""}>${svg}</g>`);
}
const bottomNote = (f, text, o = {}) => f.note(P(320, 414), text, o);
const norm = (d) => ((d % 360) + 360) % 360;
const turnTo = (a, b) => ((b - a) % 360 + 540) % 360 - 180;
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
// 꼭짓점 v에서 p1, p2 쪽 두 변 사이의 작은 쪽 각: 시작 방향과 크기
function arcSpec(v, p1, p2) {
  const a1 = dirDeg(v, p1), a2 = dirDeg(v, p2);
  let span = norm(a2 - a1), start = a1;
  if (span > 180) { start = a2; span = 360 - span; }
  return { start, span };
}
// 각 조각을 다른 꼭짓점으로 옮긴다(자리·방향·크기·반지름을 함께 바꾼다)
function flyWedge(f, from, to, t, o = {}) {
  if (t <= 0 && o.hideAtStart) return;
  const v = lerp(from.v, to.v, t), start = from.start + turnTo(from.start, to.start) * t;
  const span = from.span + (to.span - from.span) * t, r = from.r + (to.r - from.r) * t;
  f.wedge(v, start, span, { ...o, r, label: t > 0.97 ? o.label : "" });
}
// 원 위의 호(점 여러 개로 그린 선)
const arcPts = (O, Rr, start, span, n = 48) => Array.from({ length: n + 1 }, (_, i) => polar(O, Rr, start + (span * i) / n));
// 평행 표시(작은 꺾쇠)
function par(f, a, b, { n = 1, color = C.ink, opacity = 1 } = {}) {
  if (opacity <= 0) return;
  const m = mid(a, b), d = sub(b, a), l = Math.hypot(d.x, d.y), u = P(d.x / l, d.y / l), nr = P(-u.y, u.x);
  for (let i = 0; i < n; i += 1) {
    const c = add(m, mul(u, (i - (n - 1) / 2) * 8));
    f.path([add(sub(c, mul(u, 6)), mul(nr, 6)), add(c, mul(u, 3)), sub(sub(c, mul(u, 6)), mul(nr, 6))], { stroke: color, w: 2.2, opacity });
  }
}
// 점에서 직선 ab에 내린 수선의 발
function foot(p, a, b) {
  const d = sub(b, a), t = ((p.x - a.x) * d.x + (p.y - a.y) * d.y) / (d.x * d.x + d.y * d.y);
  return add(a, mul(d, t));
}
// 삼각형 무게중심에서 바깥쪽으로 이름표
const outLabel = (f, p, g, text, o = {}) => {
  const d = sub(p, g), l = Math.hypot(d.x, d.y) || 1;
  return f.label(add(p, mul(d, (o.d || 20) / l)), text, o);
};
// 변 옆 길이 이름표(점 away의 반대쪽)
function sideLabel(f, a, b, away, text, o = {}) {
  const m = lerp(a, b, o.at ?? 0.5), d = sub(b, a), l = Math.hypot(d.x, d.y), nr = P(-d.y / l, d.x / l);
  const s = (away.x - m.x) * nr.x + (away.y - m.y) * nr.y > 0 ? -1 : 1;
  f.label(add(m, mul(nr, s * (o.d || 18))), text, { size: 16, ...o });
}
const centroid = (pts) => mul(pts.reduce((s, q) => add(s, q), P(0, 0)), 1 / pts.length);

// ── 1. 원주각은 왜 중심각의 반일까 ─────────────────────────────
const inscribed = {
  id: "inscribed-angle",
  unit: "1단원 · 정다각별과 나비각",
  title: "원주각은 왜 중심각의 반일까",
  vary: "다른 자리로",
  params(seed) {
    const s = pick([{ a: 200, b: 340, p: 100 }, { a: 220, b: 320, p: 80 }, { a: 235, b: 335, p: 118 }, { a: 190, b: 290, p: 66 }, { a: 210, b: 350, p: 128 }], seed);
    const O = P(205, 222), Rr = 150;
    const A = polar(O, Rr, s.a), B = polar(O, Rr, s.b), Pt = polar(O, Rr, s.p), D = polar(O, Rr, s.p + 180);
    const c = s.b - s.a;
    return { ...s, O, Rr, A, B, Pt, D, c, i: c / 2 };
  },
  scenes: [
    { say: "원 위에 두 점 ㄱ, ㄴ과 또 다른 점 ㄷ이 있어요. 같은 호 ㄱㄴ을 중심 ㅇ에서 본 각이 중심각 ㉠, 원 위의 점 ㄷ에서 본 각이 원주각 ㉡이에요. 둘은 어떤 사이일까요?", line: "중심각 ㉠ = 각 ㄱㅇㄴ, 원주각 ㉡ = 각 ㄱㄷㄴ", ms: 2000 },
    { say: "ㄷ에서 중심 ㅇ을 지나는 지름 ㄷㄹ을 그어요. 원주각 ㉡이 두 조각 ㉢과 ㉣으로 나뉘어요.", line: "㉡ = ㉢ + ㉣", why: "지름 ㄷㄹ이 ㉡을 둘로 나눈다", ms: 2000 },
    { say: "왼쪽 삼각형 ㅇㄷㄱ을 봐요. ㅇㄷ과 ㅇㄱ은 둘 다 반지름이라 길이가 같아요. 그래서 ㄱ에 있는 각도 ㉢과 같아요.", line: "각 ㅇㄱㄷ = ㉢", why: "ㅇㄷ = ㅇㄱ(반지름) → 이등변삼각형의 두 밑각은 같다", ms: 2600 },
    { say: "각 ㄱㅇㄹ은 삼각형 ㅇㄷㄱ의 바깥쪽 각(외각)이에요. 안쪽의 두 ㉢을 옮겨 오면 꼭 채워져요.", line: "각 ㄱㅇㄹ = ㉢ + ㉢", why: "삼각형의 외각은 이웃하지 않은 두 내각의 합(세 각의 합 180°, 외각과 옆 내각의 합도 180°)", ms: 2600 },
    { say: "오른쪽 삼각형 ㅇㄷㄴ도 똑같아요. ㅇㄷ = ㅇㄴ이라 ㄴ의 각도 ㉣, 그 둘이 각 ㄹㅇㄴ을 채워요.", line: "각 ㄹㅇㄴ = ㉣ + ㉣", why: "ㅇㄷ = ㅇㄴ(반지름) · 외각은 두 내각의 합 — 같은 까닭", ms: 3200 },
    { say: (p) => `그래서 ㉠ = (㉢ + ㉣) × 2 = ㉡ × 2예요. 이 그림은 ${p.c}° = ${p.i}° × 2. 「다른 자리로」를 눌러 ㄷ을 옮겨 보세요.`, line: "원주각 ㉡ = 중심각 ㉠ ÷ 2", why: "㉠ = ㉢ × 2 + ㉣ × 2 = (㉢ + ㉣) × 2", ms: 2000 },
  ],
  draw(f, k, p) {
    const { O, Rr, A, B, Pt, D, c, i } = p;
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3), s5 = phase(k, 5);
    const s4a = phase(k, 4, 0, 0.45), s4b = phase(k, 4, 0.5, 1), s4 = phase(k, 4);
    const op0 = clamp(s0 * 2 - 1);
    // 반지름 같은 삼각형 칠하기
    f.poly([O, Pt, A], { fill: C.greenSoft, stroke: "none", opacity: s2 * (1 - 0.6 * s4) * (1 - s5) });
    f.poly([O, Pt, B], { fill: C.purpleSoft, stroke: "none", opacity: s4 * (1 - s5) });
    f.circle(O, Rr, { draw: s0, w: 2.2 });
    f.seg(Pt, A, { grow: s0 }).seg(Pt, B, { grow: s0 });
    f.seg(O, A, { w: 2, grow: s0 }).seg(O, B, { w: 2, grow: s0 });
    f.seg(Pt, D, { stroke: C.orange, w: 2.2, dash: "7 6", grow: s1, opacity: s1 });
    f.ticks(O, lerp(O, Pt, 0.7), { opacity: s2 }).ticks(O, A, { opacity: s2 }).ticks(O, B, { opacity: s4 });
    // 중심각 ㉠
    const cen = arcSpec(O, A, B), dim = clamp(s3 * 1.5) * (1 - s5);
    f.wedge(O, cen.start, cen.span, { r: 30, color: C.blue, fillOpacity: 0.25, opacity: op0 * (1 - 0.8 * dim), label: s5 > 0.5 ? `㉠ ${c}°` : "㉠", labelR: 58 });
    // 원주각 ㉡과 두 조각
    const ins = arcSpec(Pt, A, B), x1 = arcSpec(Pt, A, D), x2 = arcSpec(Pt, D, B);
    f.wedge(Pt, ins.start, ins.span, { r: 54, color: C.red, opacity: op0 * (1 - s1) + s5, label: s5 > 0.5 ? `㉡ ${i}°` : "㉡", labelR: 76 });
    f.wedge(Pt, x1.start, x1.span, { r: 54, color: C.green, opacity: s1 * (1 - s5), label: "㉢", labelR: 72 });
    f.wedge(Pt, x2.start, x2.span, { r: 54, color: C.purple, opacity: s1 * (1 - s5), label: "㉣", labelR: 72 });
    // ㄱ, ㄴ의 밑각
    const bA = arcSpec(A, O, Pt), bB = arcSpec(B, O, Pt);
    const fromP1 = { v: Pt, start: x1.start, span: x1.span, r: 54 }, fromP2 = { v: Pt, start: x2.start, span: x2.span, r: 54 };
    const atA = { v: A, start: bA.start, span: bA.span, r: 36 }, atB = { v: B, start: bB.start, span: bB.span, r: 36 };
    const t2 = phase(k, 2, 0.3, 1);
    if (t2 > 0) flyWedge(f, fromP1, atA, t2, { color: C.green, opacity: 1 - s5, label: "㉢", labelR: 56 });
    if (s4a > 0) flyWedge(f, fromP2, atB, s4a, { color: C.purple, opacity: 1 - s5, label: "㉣", labelR: 56 });
    // 중심으로 모으기
    const aod = arcSpec(O, A, D), bod = arcSpec(O, D, B);
    const sm1 = aod.span / 2, sm2 = bod.span / 2;
    if (s3 > 0) {
      flyWedge(f, fromP1, { v: O, start: aod.start, span: sm1, r: 42 }, s3, { color: C.green, opacity: 1 - s5 });
      flyWedge(f, atA, { v: O, start: aod.start + sm1, span: sm1, r: 42 }, s3, { color: C.green, opacity: 1 - s5 });
    }
    if (s4b > 0) {
      flyWedge(f, fromP2, { v: O, start: bod.start, span: sm2, r: 42 }, s4b, { color: C.purple, opacity: 1 - s5 });
      flyWedge(f, atB, { v: O, start: bod.start + sm2, span: sm2, r: 42 }, s4b, { color: C.purple, opacity: 1 - s5 });
    }
    f.dot(O, { opacity: s0 });
    for (const [q, t, o] of [[A, "ㄱ", 1], [B, "ㄴ", 1], [Pt, "ㄷ", 1], [D, "ㄹ", s1]]) f.dot(q, { opacity: s0 * o }).label(polar(O, Rr + 20, dirDeg(O, q)), t, { opacity: o });
    f.label(polar(O, 20, dirDeg(O, D) - 90), "ㅇ", { opacity: s0 });
    // 오른쪽 식
    const x = 392, o = { anchor: "start", size: 19 };
    if (s1 > 0) f.note(P(x, 90), "㉡ = ㉢ + ㉣", { ...o, opacity: s1 });
    if (s3 > 0) f.note(P(x, 145), "각 ㄱㅇㄹ = ㉢ + ㉢", { ...o, opacity: s3, color: C.green });
    if (s4b > 0) f.note(P(x, 190), "각 ㄹㅇㄴ = ㉣ + ㉣", { ...o, opacity: s4b, color: C.purple });
    if (s5 > 0) {
      f.note(P(x, 250), "㉠ = (㉢ + ㉣) × 2", { ...o, opacity: s5 });
      f.note(P(x, 290), "   = ㉡ × 2", { ...o, opacity: s5 });
      f.note(P(x, 345), `${c}° = ${i}° × 2`, { ...o, opacity: s5, size: 22, color: C.red });
    }
  },
};

// ── 2. 정다각별의 꼭지각의 합 ─────────────────────────────────
const STAR_NAMES = { 5: "정오각별", 6: "정육각별", 8: "정팔각별", 9: "정구각별", 10: "정십각별", 12: "정십이각별" };
const star = {
  id: "star-tips",
  unit: "1단원 · 정다각별과 나비각",
  title: "정다각별의 꼭지각을 모두 더하면",
  vary: "다른 별로",
  params(seed) {
    const [n, s] = pick([[5, 2], [8, 3], [6, 2], [9, 2], [10, 3], [12, 5]], seed);
    const g = n - 2 * s, Cc = (g * 360) / n, Y = Cc / 2, Z = g * 180;
    const O = P(200, 222), Rr = 140;
    const ang = (i) => 90 + (360 * i) / n, pt = (i) => polar(O, Rr, ang(((i % n) + n) % n));
    // 선을 잇는 차례(겹친 별이면 여러 번 처음으로 돌아간다)
    const edges = [], seen = new Set();
    for (let st = 0; st < n; st += 1) {
      if (seen.has(st)) continue;
      let i = st;
      do { seen.add(i); edges.push([i, (i + s) % n]); i = (i + s) % n; } while (i !== st);
    }
    return { n, s, g, C: Cc, Y, Z, O, Rr, ang, pt, edges, name: STAR_NAMES[n] };
  },
  scenes: [
    { say: (p) => `원 위에 같은 간격으로 점 ${p.n}개를 찍고, 점을 ${p.s - 1}개씩 건너뛰며 이었어요(${p.name}). 뾰족한 끝의 각(꼭지각)을 모두 더하면 몇 도일까요?`, line: (p) => `${p.name}: 점 ${p.n}개를 ${p.s - 1}개씩 건너뛰며 이었다`, ms: 2600 },
    { say: "꼭지각 하나를 봐요. 두 변의 끝이 모두 원 위에 있으니, 꼭지각은 맞은편 호를 바라보는 원주각이에요. 그 호가 몇 칸인지 세어 봐요.", line: (p) => `꼭지각 하나는 ${p.g}칸짜리 호에 대한 원주각`, why: (p) => `양쪽으로 ${p.s}칸씩 간 점까지 변이 뻗는다 → ${p.n} − ${p.s} × 2 = ${p.g}칸이 남는다`, ms: 2400 },
    { say: "그 호의 중심각을 그려요. 점이 같은 간격이라 한 칸의 중심각은 모두 같아요.", line: (p) => `그 호의 중심각 = 360° ÷ ${p.n} × ${p.g} = ${p.C}°`, why: "같은 간격 → 한 칸의 중심각 = 360° ÷ 점의 수", ms: 2200 },
    { say: "원주각은 중심각의 반이에요. 중심각을 반으로 줄여 꼭짓점으로 옮겨요.", line: (p) => `꼭지각 하나 = ${p.C}° ÷ 2 = ${p.Y}°`, why: "원주각 = 중심각 ÷ 2(앞 판서)", ms: 2400 },
    { say: (p) => `꼭지각은 모두 같아요. 꼭지각마다 바라보는 호를 차례로 이어 붙이면 원을 ${p.g}바퀴 돌아요.`, line: (p) => `꼭지각 ${p.n}개의 합 = ${p.Y}° × ${p.n} = ${p.Z}°`, why: (p) => `호 ${p.g}칸씩 ${p.n}번 = ${p.g * p.n}칸 = 원 ${p.g}바퀴 → 중심각 합 ${p.g} × 360°, 꼭지각 합은 그 반`, ms: 4200 },
    { say: "그래서 정다각별의 꼭지각의 합은 「한 꼭지각이 바라보는 칸 수 × 180°」예요. 「다른 별로」를 눌러 확인해 보세요.", line: "꼭지각의 합 = (바라보는 칸 수) × 180°", why: "칸 수만큼 원을 돈 중심각(칸 수 × 360°)의 반", ms: 1600 },
  ],
  draw(f, k, p) {
    const { n, s, g, O, Rr, ang, pt, edges } = p;
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3), s4 = phase(k, 4), s5 = phase(k, 5);
    f.circle(O, Rr, { draw: s0, w: 1.6, stroke: C.soft });
    edges.forEach(([a, b], e) => f.seg(pt(a), pt(b), { w: 2.4, grow: clamp(s0 * 1.3 * edges.length - e), opacity: clamp(s0 * 1.3 * edges.length - e) > 0 ? 1 : 0 }));
    for (let i = 0; i < n; i += 1) f.dot(pt(i), { r: 4, opacity: s0 });
    const T = pt(0), L = pt(s), Rt = pt(n - s), tip = arcSpec(T, L, Rt);
    // 꼭지각 하나가 바라보는 호
    const hl = s1 * (1 - s4);
    f.seg(T, L, { stroke: C.red, w: 4, opacity: hl }).seg(T, Rt, { stroke: C.red, w: 4, opacity: hl });
    f.path(arcPts(O, Rr, ang(s), p.C), { stroke: C.red, w: 5, draw: s1, opacity: hl });
    for (let i = s; i <= n - s; i += 1) f.dot(pt(i), { r: 5.5, fill: C.red, opacity: hl });
    if (s1 > 0) f.label(polar(O, Rr + 24, ang(s) + p.C / 2), `${g}칸`, { color: C.red, opacity: hl, size: 18 });
    // 중심각
    const cOp = s2 * (1 - s4);
    f.seg(O, L, { stroke: C.blue, w: 2.2, grow: s2, opacity: cOp }).seg(O, Rt, { stroke: C.blue, w: 2.2, grow: s2, opacity: cOp });
    f.wedge(O, ang(s), p.C, { r: 34, color: C.blue, opacity: cOp, label: `${p.C}°`, labelR: 56, size: 16 });
    f.dot(O, { opacity: s0 });
    // 반으로 줄여 꼭짓점으로
    if (s3 > 0) flyWedge(f, { v: O, start: ang(s), span: p.C, r: 34 }, { v: T, start: tip.start, span: tip.span, r: 34 }, s3, { color: C.red, label: `${p.Y}°`, labelR: 54, size: 16 });
    // 모든 꼭지각과 바라보는 호(나선으로 이어 붙이기)
    if (s4 > 0) {
      for (let j = 1; j < n; j += 1) {
        const tj = pt(j), sp = arcSpec(tj, pt(j + s), pt(j - s));
        f.wedge(tj, sp.start, sp.span, { r: 26, color: C.red, opacity: clamp(s4 * n - j + 0.5) });
      }
      const total = s4 * n * p.C, step = 6;
      const pts = [];
      for (let a = 0; a <= total + 0.01; a += 4) pts.push(polar(O, Rr + 12 + (step * a) / 360, ang(s) + a));
      pts.push(polar(O, Rr + 12 + (step * total) / 360, ang(s) + total));
      if (pts.length > 1) f.path(pts, { stroke: C.orange, w: 3 });
      const turns = Math.min(g, Math.floor(total / 360 + 1e-6));
      if (turns > 0) f.note(P(400, 300), `${turns}바퀴`, { anchor: "start", color: C.orange, size: 22 });
    }
    // 오른쪽 식
    const x = 400, o = { anchor: "start", size: 19 };
    f.note(P(x, 60), p.name, { ...o, size: 22, opacity: s0 });
    if (s1 > 0) f.note(P(x, 110), `호 ${g}칸`, { ...o, opacity: s1, color: C.red });
    if (s2 > 0) f.note(P(x, 150), `중심각 ${p.C}°`, { ...o, opacity: s2, color: C.blue });
    if (s3 > 0) f.note(P(x, 190), `꼭지각 ${p.Y}°`, { ...o, opacity: s3, color: C.red });
    if (s4 > 0) f.note(P(x, 240), `${p.Y}° × ${n} = ${p.Z}°`, { ...o, opacity: s4 });
    if (s5 > 0) f.note(P(x, 360), `${g} × 180° = ${p.Z}°`, { ...o, opacity: s5, size: 22, color: C.purple });
  },
};

// ── 3. 나비각: ㉠ + ㉡ = ㉢ + ㉣ ─────────────────────────────
const butterfly = {
  id: "butterfly",
  unit: "1단원 · 정다각별과 나비각",
  title: "나비 모양의 위 두 각과 아래 두 각은 왜 합이 같을까",
  vary: "다른 나비로",
  params(seed) {
    const s = pick([
      { ta: 132, la: 200, tb: 45, lb: 170, lc: 150, ld: 195 },
      { ta: 145, la: 190, tb: 30, lb: 175, lc: 165, ld: 135 },
      { ta: 118, la: 170, tb: 60, lb: 190, lc: 130, ld: 195 },
      { ta: 152, la: 205, tb: 38, lb: 140, lc: 180, ld: 160 },
      { ta: 128, la: 185, tb: 24, lb: 170, lc: 140, ld: 180 },
    ], seed);
    const X = P(215, 222);
    const A = polar(X, s.la, s.ta), B = polar(X, s.lb, s.tb), Cc = polar(X, s.lc, s.tb + 180), D = polar(X, s.ld, s.ta + 180);
    const r = (v) => Math.round(v);
    const a = r(arcSpec(A, X, B).span), c = r(arcSpec(Cc, X, D).span), e = r(arcSpec(X, A, Cc).span);
    return { X, A, B, C: Cc, D, a, b: e - a, c, d: e - c, e };
  },
  scenes: [
    { say: "두 선분 ㄱㄹ과 ㄴㄷ이 점 ㅁ에서 엇갈리고, 양 끝을 이어 나비 모양을 만들었어요. 위의 두 각 ㉠ + ㉡과 아래의 두 각 ㉢ + ㉣은 어떤 사이일까요?", line: "위 삼각형 ㄱㄴㅁ, 아래 삼각형 ㄷㄹㅁ", ms: 2000 },
    { say: "ㅁ의 옆쪽 각 ㉤을 봐요. ㉤은 위 삼각형의 바깥쪽 각(외각)이에요. ㉠과 ㉡을 옮겨 오면 ㉤이 꼭 채워져요.", line: "㉠ + ㉡ = ㉤", why: "위 삼각형: ㉠ + ㉡ + 가운데 각 = 180°, ㉤ + 가운데 각 = 180°(곧은 선)", ms: 2800 },
    { say: "이번엔 아래 삼각형. ㉤은 아래 삼각형의 외각이기도 해요. ㉢과 ㉣을 옮겨 와도 ㉤이 꼭 채워져요.", line: "㉢ + ㉣ = ㉤", why: "아래 삼각형: ㉢ + ㉣ + 가운데 각 = 180°, ㉤ + 가운데 각 = 180°(곧은 선)", ms: 2800 },
    { say: (p) => `그래서 ㉠ + ㉡ = ㉢ + ㉣이에요. 이 그림에서는 ${p.a}° + ${p.b}° = ${p.c}° + ${p.d}° = ${p.e}°.`, line: "㉠ + ㉡ = ㉢ + ㉣ (나비각)", why: "둘 다 같은 ㉤과 같다", ms: 1800 },
    { say: "「다른 나비로」를 눌러 보세요. 선분을 어떻게 엇갈려도 같은 까닭으로 맞아요. 별 모양처럼 복잡한 그림의 각도 나비각으로 한곳에 모을 수 있어요.", line: "엇갈린 두 선분의 양 끝을 이으면 언제나 위 두 각의 합 = 아래 두 각의 합", why: "가운데 두 각이 맞꼭지각이라 양쪽 삼각형의 외각이 같은 ㉤", ms: 1600 },
  ],
  draw(f, k, p) {
    const { X, A, B, D } = p, Cc = p.C;
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3);
    const op0 = clamp(s0 * 2 - 1);
    f.poly([A, B, X], { fill: C.blueSoft, fillOpacity: 0.6, draw: s0 });
    f.poly([Cc, D, X], { fill: C.greenSoft, fillOpacity: 0.6, draw: s0 });
    const sa = arcSpec(A, X, B), sb = arcSpec(B, A, X), sc = arcSpec(Cc, X, D), sd = arcSpec(D, Cc, X), se = arcSpec(X, A, Cc);
    const lab = (t, n) => (s3 > 0.4 ? `${n}°` : t);
    f.wedge(A, sa.start, sa.span, { r: 32, color: C.red, opacity: op0, label: lab("㉠", p.a), labelR: 52, size: 16 });
    f.wedge(B, sb.start, sb.span, { r: 32, color: C.orange, opacity: op0, label: lab("㉡", p.b), labelR: 52, size: 16 });
    f.wedge(Cc, sc.start, sc.span, { r: 32, color: C.blue, opacity: op0, label: lab("㉢", p.c), labelR: 52, size: 16 });
    f.wedge(D, sd.start, sd.span, { r: 32, color: C.purple, opacity: op0, label: lab("㉣", p.d), labelR: 52, size: 16 });
    // ㉤과 채우기(바깥 고리 = ㉠㉡, 안쪽 고리 = ㉢㉣)
    f.wedge(X, se.start, se.span, { r: 72, color: C.teal, fillOpacity: 0.08, w: 2.4, opacity: s1, label: s3 > 0.4 ? `㉤ ${p.e}°` : "㉤", labelR: 96, size: 18 });
    const ra = sa.span, rb = se.span - sa.span, rc = sc.span, rdd = se.span - sc.span;
    if (s1 > 0) {
      const t1 = phase(k, 1, 0.25, 1);
      flyWedge(f, { v: A, start: sa.start, span: sa.span, r: 32 }, { v: X, start: se.start, span: ra, r: 66 }, t1, { color: C.red });
      flyWedge(f, { v: B, start: sb.start, span: sb.span, r: 32 }, { v: X, start: se.start + ra, span: rb, r: 66 }, t1, { color: C.orange });
    }
    if (s2 > 0) {
      const t2 = phase(k, 2, 0.25, 1);
      flyWedge(f, { v: Cc, start: sc.start, span: sc.span, r: 32 }, { v: X, start: se.start, span: rc, r: 42 }, t2, { color: C.blue });
      flyWedge(f, { v: D, start: sd.start, span: sd.span, r: 32 }, { v: X, start: se.start + rc, span: rdd, r: 42 }, t2, { color: C.purple });
    }
    // 가운데 맞꼭지각
    const top = arcSpec(X, A, B), bot = arcSpec(X, Cc, D);
    f.wedge(X, top.start, top.span, { r: 20, color: C.ink, fillOpacity: 0.12, w: 1.4, opacity: s1 * 0.8 });
    f.wedge(X, bot.start, bot.span, { r: 20, color: C.ink, fillOpacity: 0.12, w: 1.4, opacity: s2 * 0.8 });
    const g = centroid([A, B, Cc, D]);
    outLabel(f, A, g, "ㄱ").label(add(B, P(16, -12)), "ㄴ");
    outLabel(f, Cc, g, "ㄷ"); outLabel(f, D, g, "ㄹ");
    const sbd = arcSpec(X, B, D);
    f.label(polar(X, 30, sbd.start + sbd.span / 2), "ㅁ", { opacity: s0 });
    const x = 428, o = { anchor: "start", size: 20 };
    if (s1 > 0) f.note(P(x, 120), "㉠ + ㉡ = ㉤", { ...o, opacity: s1 });
    if (s2 > 0) f.note(P(x, 165), "㉢ + ㉣ = ㉤", { ...o, opacity: s2 });
    if (s3 > 0) {
      f.note(P(x, 240), `${p.a}° + ${p.b}° = ${p.e}°`, { ...o, opacity: s3, size: 19 });
      f.note(P(x, 280), `${p.c}° + ${p.d}° = ${p.e}°`, { ...o, opacity: s3, size: 19 });
    }
  },
};

// ── 4. 등적변형: 사각형을 넓이가 같은 삼각형으로 ─────────────────
const equalArea = {
  id: "equal-area",
  unit: "2단원 · 평행선과 등적변형",
  title: "꼭짓점을 평행선 따라 옮기면 왜 넓이가 그대로일까",
  vary: "다른 사각형으로",
  params(seed) {
    const s = pick([
      { A: P(120, 120), D: P(290, 90) },
      { A: P(90, 100), D: P(330, 155) },
      { A: P(170, 85), D: P(360, 185) },
      { A: P(80, 115), D: P(265, 120) },
      { A: P(140, 155), D: P(235, 80) },
    ], seed);
    const B = P(60, 320), Cc = P(300, 320), d = sub(Cc, s.A);
    const t = (Cc.y - s.D.y) / d.y, E = add(s.D, mul(d, t));
    return { A: s.A, B, C: Cc, D: s.D, E };
  },
  scenes: [
    { say: "사각형 ㄱㄴㄷㄹ과 넓이가 같은 삼각형을 만들 수 있을까요? 자르거나 붙이지 않고, 꼭짓점 하나만 옮겨서요.", line: "사각형 ㄱㄴㄷㄹ → 넓이가 같은 삼각형?", ms: 1800 },
    { say: "대각선 ㄱㄷ을 그으면 삼각형 두 개로 나뉘어요. 파란 삼각형은 그대로 두고, 주황 삼각형만 모양을 바꿀 거예요.", line: "사각형 ㄱㄴㄷㄹ = 삼각형 ㄱㄴㄷ + 삼각형 ㄱㄷㄹ", why: "대각선 ㄱㄷ으로 나눴다", ms: 2000 },
    { say: "ㄹ을 지나고 ㄱㄷ에 평행한 선을 그어요. 이 선 위의 점은 어디서나 ㄱㄷ까지의 거리(높이)가 같아요.", line: "평행선 위 어느 점에서나 ㄱㄷ까지의 높이가 같다", why: "평행선 사이의 거리는 어디서나 같다", ms: 2400 },
    { say: "꼭짓점 ㄹ을 평행선을 따라 밀어, ㄴㄷ을 늘인 선과 만나는 점 ㅁ까지 옮겨요. 밑변 ㄱㄷ도, 높이도 그대로예요.", line: "삼각형 ㄱㄷㄹ = 삼각형 ㄱㄷㅁ", why: "밑변 ㄱㄷ이 같고 높이가 같다 → 밑변 × 높이 ÷ 2가 같다", ms: 3000 },
    { say: "파란 삼각형에 넓이가 같은 주황 삼각형을 붙였으니, 큰 삼각형 ㄱㄴㅁ은 처음 사각형과 넓이가 같아요.", line: "사각형 ㄱㄴㄷㄹ = 삼각형 ㄱㄴㅁ", why: "같은 삼각형 ㄱㄴㄷ에 넓이가 같은 조각을 붙였다", ms: 2000 },
    { say: "「다른 사각형으로」를 눌러 보세요. 어떤 사각형이든 대각선 하나와 평행선 하나로 넓이가 같은 삼각형이 돼요(등적변형).", line: "평행선을 따라 꼭짓점을 옮기면 모양은 바뀌어도 넓이는 그대로", why: "밑변과 높이가 그대로이기 때문", ms: 1600 },
  ],
  draw(f, k, p) {
    const { A, B, D, E } = p, Cc = p.C;
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3), s4 = phase(k, 4), s5 = phase(k, 5);
    const Dt = lerp(D, E, s3);
    const u = sub(Cc, A), ul = Math.hypot(u.x, u.y), uu = P(u.x / ul, u.y / ul);
    if (s1 > 0) {
      f.poly([A, B, Cc], { fill: C.blueSoft, stroke: "none", opacity: s1 });
      f.poly([A, Cc, Dt], { fill: C.orangeSoft, stroke: "none", opacity: s1 });
    }
    // 평행선과 늘인 밑변
    f.seg(sub(D, mul(uu, 50)), add(E, mul(uu, 40)), { stroke: C.teal, w: 2, dash: "8 6", grow: s2, opacity: s2 });
    f.seg(Cc, add(E, P(40, 0)), { stroke: C.soft, w: 2, dash: "6 6", grow: s2, opacity: s2 });
    // 처음 사각형(나중엔 점선으로 남는다)
    if (s3 < 1) f.poly([A, B, Cc, D], { fill: "none", draw: s0, opacity: 1 - s3 });
    f.poly([A, B, Cc, D], { fill: "none", stroke: C.purple, dash: "6 6", w: 2, opacity: Math.max(s3 * 0.7 * (1 - s4), s5) });
    f.seg(A, Cc, { dash: "6 5", w: 2, grow: s1, opacity: s1 });
    f.path([Cc, Dt, A], { w: 2.4, opacity: s1 });
    par(f, A, Cc, { opacity: s2 }); par(f, D, lerp(D, E, 0.35), { opacity: s2 });
    // 높이(움직이는 점에서 ㄱㄷ까지)
    const hOp = s2 * (1 - s4);
    const F = foot(Dt, A, Cc);
    // 발이 ㄱㄷ 밖으로 나가면 ㄱㄷ을 늘여 보인다
    const tF = ((F.x - A.x) * u.x + (F.y - A.y) * u.y) / (ul * ul);
    if (tF > 1) f.seg(Cc, F, { stroke: C.soft, w: 1.6, dash: "4 4", opacity: hOp });
    f.seg(Dt, F, { stroke: C.purple, w: 2.4, dash: "6 5", grow: s2, opacity: hOp }).right(F, Dt, A, { color: C.purple, opacity: hOp });
    if (s2 > 0 && s3 === 0) {
      // 평행선 위 다른 두 점에서도 같은 높이
      f.seg(A, foot(E, A, Cc), { stroke: C.soft, w: 1.4, dash: "4 4", opacity: s2 * 0.8 });
      [0.4, 0.8].forEach((t) => {
        const Q = add(D, mul(sub(E, D), t)), Fq = foot(Q, A, Cc);
        f.seg(Q, Fq, { stroke: C.purple, w: 1.6, dash: "4 5", opacity: s2 * 0.6 });
      });
    }
    // 큰 삼각형
    f.poly([A, B, E], { fill: "none", stroke: C.ink, w: 4, opacity: s4 });
    f.seg(B, E, { w: 2.4, opacity: s3 > 0.99 ? 1 : 0 });
    f.seg(B, Cc, { w: 2.4, opacity: s1 });
    f.seg(A, B, { w: 2.4, opacity: s1 });
    f.dot(Dt, { opacity: s1, fill: C.orange, r: 5.5 });
    f.label(add(A, P(-6, -20)), "ㄱ").label(add(B, P(-16, 12)), "ㄴ").label(add(Cc, P(0, 22)), "ㄷ");
    f.label(add(D, P(14, -16)), "ㄹ", { opacity: 1 - s3 * 0.6 });
    f.label(add(E, P(4, 22)), "ㅁ", { opacity: clamp(s3 * 3 - 2) });
    if (s4 > 0) bottomNote(f, "사각형 ㄱㄴㄷㄹ = 삼각형 ㄱㄴㄷ + 삼각형 ㄱㄷㅁ = 삼각형 ㄱㄴㅁ", { opacity: s4, size: 17 });
  },
};

// ── 5. 높이가 같은 삼각형으로 두 번 나누기 ──────────────────────
const ratioTwice = {
  id: "ratio-twice",
  unit: "2단원 · 평행선과 등적변형",
  title: "변의 비로 넓이의 몇 분의 몇을 구하는 까닭",
  vary: "다른 비로",
  params(seed) {
    const s = pick([
      { p: 5, q: 3, r: 3, u: 1, S: 60, ax: 170 },
      { p: 4, q: 3, r: 3, u: 2, S: 48, ax: 280 },
      { p: 3, q: 1, r: 4, u: 3, S: 36, ax: 140 },
      { p: 5, q: 2, r: 4, u: 3, S: 80, ax: 230 },
      { p: 2, q: 1, r: 3, u: 2, S: 30, ax: 300 },
    ], seed);
    const A = P(s.ax, 60), B = P(40, 340), Cc = P(390, 340);
    const bp = (i) => lerp(B, Cc, i / s.p), cp = (j) => lerp(Cc, A, j / s.r);
    return { ...s, A, B, C: Cc, bp, cp, D: bp(s.p - s.q), E: cp(s.u), ans: (s.S * s.q * s.u) / (s.p * s.r) };
  },
  scenes: [
    { say: (p) => `삼각형 ㄱㄴㄷ의 넓이는 ${p.S}㎠예요. ㄴㄹ : ㄹㄷ = ${p.p - p.q} : ${p.q}, ㄱㅁ : ㅁㄷ = ${p.r - p.u} : ${p.u}일 때, 색칠한 삼각형 ㄹㅁㄷ은 넓이가 얼마일까요?`, line: (p) => `ㄴㄹ : ㄹㄷ = ${p.p - p.q} : ${p.q},  ㄱㅁ : ㅁㄷ = ${p.r - p.u} : ${p.u}`, ms: 2200 },
    { say: "ㄱ에서 밑변을 나눈 점마다 선을 그어요. 가는 삼각형들은 밑변이 똑같고, 꼭짓점 ㄱ에서 잰 높이도 모두 같아요.", line: (p) => `삼각형 ㄱㄹㄷ = 삼각형 ㄱㄴㄷ의 ${p.p}분의 ${p.q}`, why: (p) => `높이가 같고 밑변이 같은 삼각형 ${p.p}개 → 넓이가 모두 같다(높이가 같으면 넓이는 밑변에 비례)`, ms: 2800 },
    { say: "이번엔 삼각형 ㄱㄹㄷ만 봐요. ㄹ에서 변 ㄱㄷ을 나눈 점마다 선을 그으면, 꼭짓점 ㄹ에서 잰 높이가 모두 같아요.", line: (p) => `삼각형 ㄹㅁㄷ = 삼각형 ㄱㄹㄷ의 ${p.r}분의 ${p.u}`, why: (p) => `이번엔 꼭짓점 ㄹ에서 높이가 같은 삼각형 ${p.r}개`, ms: 2800 },
    { say: (p) => `두 번 줄였으니 차례로 곱해요. ${p.S}㎠ × ${p.q} ÷ ${p.p} × ${p.u} ÷ ${p.r} = ${p.ans}㎠.`, line: (p) => `삼각형 ㄹㅁㄷ = 삼각형 ㄱㄴㄷ의 ${p.p * p.r}분의 ${p.q * p.u} = ${p.ans}㎠`, why: (p) => `${p.p}분의 ${p.q}의 ${p.r}분의 ${p.u} → 분모끼리, 분자끼리 곱한다`, ms: 2200 },
    { say: "꼭짓점 ㄷ을 같이 쓰는 두 삼각형이면, ㄷ에서 뻗은 두 변이 줄어든 비를 곱하면 돼요. 「다른 비로」를 눌러 보세요.", line: "작은 삼각형 = 큰 삼각형 × (ㄷㄹ ÷ ㄷㄴ) × (ㄷㅁ ÷ ㄷㄱ)", why: "높이가 같은 삼각형으로 두 번 나눈 것", ms: 1800 },
  ],
  draw(f, k, p) {
    const { A, B, D, E, bp, cp } = p, Cc = p.C;
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3), s4 = phase(k, 4);
    // 1단계 조각(ㄱ에서)
    for (let i = p.p - p.q; i < p.p; i += 1) {
      const on = clamp(s1 * (p.q + 1) - (i - (p.p - p.q)) - 0.5);
      f.poly([A, bp(i), bp(i + 1)], { fill: C.orangeSoft, stroke: "none", opacity: on * (1 - 0.5 * s2) });
    }
    // 2단계 조각(ㄹ에서)
    for (let j = 0; j < p.u; j += 1) {
      const on = clamp(s2 * (p.u + 1) - j - 0.5);
      f.poly([D, cp(j), cp(j + 1)], { fill: C.purpleSoft, stroke: "none", opacity: on });
    }
    f.poly([D, E, Cc], { fill: C.purpleSoft, stroke: C.purple, w: 2.4, opacity: s0 * (1 - 0.7 * s1 * (1 - s2)) });
    if (s3 > 0) f.poly([D, E, Cc], { fill: C.purple, fillOpacity: 0.35 * s3, stroke: C.purple, w: 3 });
    f.poly([A, B, Cc], { fill: "none", draw: s0 });
    // ㄱ에서 나눈 선
    for (let i = 1; i < p.p; i += 1) f.seg(A, bp(i), { stroke: C.orange, w: 1.8, grow: s1, opacity: s1 * (1 - 0.6 * s2) });
    const H = P(A.x, B.y);
    f.seg(A, H, { stroke: C.orange, w: 2, dash: "6 5", grow: s1, opacity: s1 * (1 - s2) }).right(H, A, Cc, { color: C.orange, opacity: s1 * (1 - s2) });
    // ㄹ에서 나눈 선
    for (let j = 1; j < p.r; j += 1) f.seg(D, cp(j), { stroke: C.purple, w: 1.8, grow: s2, opacity: s2 * (1 - 0.5 * s4) });
    f.seg(D, A, { stroke: C.ink, w: 2, opacity: s2 });
    const F = foot(D, Cc, A);
    f.seg(D, F, { stroke: C.purple, w: 2, dash: "6 5", grow: s2, opacity: s2 * (1 - s3) }).right(F, D, A, { color: C.purple, opacity: s2 * (1 - s3) });
    // 나눈 점
    for (let i = 1; i < p.p; i += 1) f.dot(bp(i), { r: 3.5, fill: C.soft, opacity: s0 });
    for (let j = 1; j < p.r; j += 1) f.dot(cp(j), { r: 3.5, fill: C.soft, opacity: s0 });
    f.dot(D, { opacity: s0 }).dot(E, { opacity: s0 });
    // 비 숫자
    const g = centroid([A, B, Cc]);
    f.label(add(mid(B, D), P(0, 22)), String(p.p - p.q), { color: C.teal, opacity: s0 });
    f.label(add(mid(D, Cc), P(0, 22)), String(p.q), { color: C.teal, opacity: s0 });
    sideLabel(f, Cc, E, g, String(p.u), { color: C.teal, opacity: s0, d: 18 });
    sideLabel(f, E, A, g, String(p.r - p.u), { color: C.teal, opacity: s0, d: 18 });
    // 꼭짓점 ㄷ의 각(같이 쓰는 각)
    const sc = arcSpec(Cc, B, A);
    f.wedge(Cc, sc.start, sc.span, { r: 26, color: C.teal, opacity: s4 });
    f.label(add(A, P(0, -20)), "ㄱ").label(add(B, P(-14, 14)), "ㄴ").label(add(Cc, P(14, 14)), "ㄷ");
    f.label(add(D, P(0, 40)), "ㄹ", { opacity: s0 });
    outLabel(f, E, g, "ㅁ", { opacity: s0, d: 38 });
    f.note(add(centroid([A, B, D]), P(0, 10)), `${p.S}㎠`, { opacity: s0 * (1 - s1), size: 18, color: C.soft });
    const x = 420, o = { anchor: "start", size: 17 };
    if (s1 > 0) { f.note(P(x, 100), "삼각형 ㄱㄹㄷ", { ...o, opacity: s1, color: "#b35f00" }); f.note(P(x, 128), `= ㄱㄴㄷ의 ${p.p}분의 ${p.q}`, { ...o, opacity: s1 }); }
    if (s2 > 0) { f.note(P(x, 178), "삼각형 ㄹㅁㄷ", { ...o, opacity: s2, color: C.purple }); f.note(P(x, 206), `= ㄱㄹㄷ의 ${p.r}분의 ${p.u}`, { ...o, opacity: s2 }); }
    if (s3 > 0) { f.note(P(x, 256), "삼각형 ㄹㅁㄷ", { ...o, opacity: s3, color: C.purple }); f.note(P(x, 284), `= ㄱㄴㄷ의 ${p.p * p.r}분의 ${p.q * p.u}`, { ...o, opacity: s3 }); }
    if (s3 > 0) bottomNote(f, `${p.S}㎠ × ${p.q} ÷ ${p.p} × ${p.u} ÷ ${p.r} = ${p.ans}㎠`, { opacity: s3, size: 20 });
  },
};

// ── 6. 밑변의 비와 높이의 비는 거꾸로 ──────────────────────────
const inverse = {
  id: "base-height-inverse",
  unit: "3단원 · 도형의 넓이와 비",
  title: "밑변이 길면 높이는 왜 그만큼 짧을까",
  vary: "다른 삼각형으로",
  params(seed) {
    const [a, b, sn, cs] = pick([[20, 15, 0.8, 0.6], [25, 20, 0.8, 0.6], [25, 30, 0.8, 0.6], [15, 20, 0.8, 0.6], [20, 25, 0.8, 0.6]], seed);
    const ha = Math.round(b * sn), hb = Math.round(a * sn);
    // cm 단위 그림(ㄷ을 원점, 위가 −y)
    const Cc = P(0, 0), B = P(-a, 0), A = P(-b * cs, -b * sn), D = P(A.x, 0), E = add(Cc, mul(sub(A, Cc), (a * cs) / b));
    const G = centroid([A, B, Cc]);
    const fA = dirDeg(Cc, A);
    let th = 180 - fA;
    const tryRot = (t) => { const b2 = rot(B, G, t), a2 = rot(A, G, t); return b2.y < a2.y; };
    if (!tryRot(th)) th = -fA;
    const pts0 = [A, B, Cc, P(-a, A.y), P(0, A.y)];
    const pts1 = [A, B, Cc, add(Cc, sub(B, E)), add(A, sub(B, E))].map((q) => rot(q, G, th));
    const all = [...pts0, ...pts1];
    const xs = all.map((q) => q.x), ys = all.map((q) => q.y);
    const xmin = Math.min(...xs), xmax = Math.max(...xs), ymin = Math.min(...ys), ymax = Math.max(...ys);
    const sc = Math.min(350 / (xmax - xmin), 320 / (ymax - ymin));
    const ox = 215 - ((xmin + xmax) / 2) * sc, oy = 215 - ((ymin + ymax) / 2) * sc;
    const T = (q) => P(ox + q.x * sc, oy + q.y * sc);
    const g = gcd(a, b);
    return { a, b, ha, hb, A: T(A), B: T(B), C: T(Cc), D: T(D), E: T(E), G: T(G), th, ra: a / g, rb: b / g };
  },
  scenes: [
    { say: "삼각형 ㄱㄴㄷ에서 밑변 ㄴㄷ에 대한 높이는 ㄱㄹ, 밑변 ㄱㄷ에 대한 높이는 ㄴㅁ이에요. 밑변과 높이는 어떤 사이일까요?", line: "한 삼각형에서 밑변과 높이를 두 가지로 잡는다", ms: 1800 },
    { say: "높이 ㄱㄹ로 삼각형을 둘로 나누고, 똑같은 조각을 하나씩 반 바퀴 돌려 붙이면 직사각형이 돼요.", line: (p) => `삼각형 × 2 = ㄴㄷ × ㄱㄹ = ${p.a} × ${p.ha}`, why: "높이로 나눈 두 직각삼각형은 각각 작은 직사각형의 반", ms: 2600 },
    { say: "이번엔 삼각형을 돌려 ㄱㄷ을 밑변으로 놓고 같은 일을 해요.", line: (p) => `삼각형 × 2 = ㄱㄷ × ㄴㅁ = ${p.b} × ${p.hb}`, why: "같은 까닭(높이 ㄴㅁ으로 나눈 두 직각삼각형)", ms: 3400 },
    { say: "두 직사각형은 모두 같은 삼각형 2개의 넓이예요. 그러니 넓이가 같아요.", line: (p) => `ㄴㄷ × ㄱㄹ = ㄱㄷ × ㄴㅁ = ${p.a * p.ha}`, why: "같은 삼각형의 넓이를 두 가지로 나타냈다", ms: 2200 },
    { say: (p) => `곱이 같으니, 밑변이 ${p.ra} : ${p.rb}이면 높이는 거꾸로 ${p.rb} : ${p.ra}예요. 「다른 삼각형으로」를 눌러 보세요.`, line: (p) => `ㄴㄷ : ㄱㄷ = ${p.ra} : ${p.rb} = ㄴㅁ : ㄱㄹ`, why: "밑변 × 높이가 같으면, 밑변의 비와 높이의 비는 거꾸로", ms: 1800 },
  ],
  draw(f, k, p) {
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3), s4 = phase(k, 4);
    const thNow = p.th * (phase(k, 2, 0, 0.35) * (k < 3 ? 1 : 1 - phase(k, 3, 0, 0.45)));
    const T = (q) => rot(q, p.G, thNow);
    const A = T(p.A), B = T(p.B), Cc = T(p.C), D = T(p.D), E = T(p.E);
    // 1단계 직사각형(밑변 ㄴㄷ)
    const r1 = s1 * (1 - phase(k, 2, 0, 0.25));
    if (r1 > 0) {
      const c1 = rot(D, mid(A, B), 180 * s1), c2 = rot(D, mid(A, Cc), 180 * s1);
      f.poly([A, B, c1], { fill: C.blueSoft, stroke: C.blue, w: 1.8, opacity: r1 });
      f.poly([A, Cc, c2], { fill: C.greenSoft, stroke: C.green, w: 1.8, opacity: r1 });
      f.poly([B, Cc, add(Cc, sub(A, D)), add(B, sub(A, D))], { fill: "none", stroke: C.blue, w: 2.4, dash: "7 5", opacity: r1 * clamp(s1 * 3 - 2) });
    }
    // 2단계 직사각형(밑변 ㄱㄷ)
    const t2 = phase(k, 2, 0.45, 1), r2 = t2 * (1 - phase(k, 3, 0, 0.3));
    if (r2 > 0) {
      const c1 = rot(E, mid(B, A), 180 * t2), c2 = rot(E, mid(B, Cc), 180 * t2);
      f.poly([B, A, c1], { fill: C.orangeSoft, stroke: C.orange, w: 1.8, opacity: r2 });
      f.poly([B, Cc, c2], { fill: C.purpleSoft, stroke: C.purple, w: 1.8, opacity: r2 });
      f.poly([A, Cc, add(Cc, sub(B, E)), add(A, sub(B, E))], { fill: "none", stroke: C.orange, w: 2.4, dash: "7 5", opacity: r2 * clamp(t2 * 3 - 2) });
    }
    f.poly([A, B, Cc], { fill: C.paper, fillOpacity: 0.6, draw: s0 });
    // 높이 ㄱㄹ
    const hA = Math.max(s0 * (1 - phase(k, 2, 0, 0.25)), s3);
    f.seg(A, D, { stroke: C.blue, w: 2.4, dash: "7 5", opacity: hA }).right(D, A, Cc, { color: C.blue, opacity: hA });
    dimLen(f, A, D, `${p.ha}cm`, { away: B, off: 18, color: C.blue, opacity: hA });   // 높이 ㄴㅁ의 호와 글자가 떨어지게 ㄷ 쪽으로
    const tD = dist(B, D) / dist(B, Cc), tE = dist(A, E) / dist(A, Cc);
    // 밑변의 호는 높이의 발(ㄹ·ㅁ) 이름보다 더 바깥으로(발이 끝에 바짝 붙지 않으면 호가 그 이름을 지난다)
    dimLen(f, B, Cc, `${p.a}cm`, { away: A, off: Math.abs(tD - 0.5) < 0.42 ? 46 : 22, opacity: Math.max(s0 * (1 - phase(k, 2, 0, 0.25)), s3) });
    // 높이 ㄴㅁ
    const hB = k < 3 ? phase(k, 2, 0.3, 0.6) : 1;
    f.seg(B, E, { stroke: C.orange, w: 2.4, dash: "7 5", opacity: hB, grow: k < 3 ? phase(k, 2, 0.3, 0.6) : 1 }).right(E, B, A, { color: C.orange, opacity: hB });
    dimLen(f, B, E, `${p.hb}cm`, { away: A, off: 18, color: "#b35f00", opacity: hB });
    dimLen(f, A, Cc, `${p.b}cm`, { away: B, off: Math.abs(tE - 0.5) < 0.42 ? 46 : 22, opacity: hB });
    const g = centroid([A, B, Cc]);
    outLabel(f, A, g, "ㄱ"); outLabel(f, B, g, "ㄴ"); outLabel(f, Cc, g, "ㄷ");
    outLabel(f, D, g, "ㄹ", { opacity: hA, color: C.blue }); outLabel(f, E, g, "ㅁ", { opacity: hB, color: "#b35f00" });
    const x = 440, o = { anchor: "start", size: 19 };
    if (s1 > 0) { f.note(P(x, 80), "ㄴㄷ × ㄱㄹ", { ...o, opacity: s1, color: C.blue }); f.note(P(x, 108), `= ${p.a} × ${p.ha} = ${p.a * p.ha}`, { ...o, opacity: s1 }); }
    if (s2 > 0) { f.note(P(x, 160), "ㄱㄷ × ㄴㅁ", { ...o, opacity: s2, color: "#b35f00" }); f.note(P(x, 188), `= ${p.b} × ${p.hb} = ${p.b * p.hb}`, { ...o, opacity: s2 }); }
    if (s3 > 0) f.note(P(x, 240), "넓이가 같다!", { ...o, opacity: s3, color: C.purple });
    if (s4 > 0) {
      f.note(P(x, 300), `밑변 ${p.a} : ${p.b} = ${p.ra} : ${p.rb}`, { ...o, opacity: s4, size: 18 });
      f.note(P(x, 334), `높이 ${p.hb} : ${p.ha} = ${p.ra} : ${p.rb}`, { ...o, opacity: s4, size: 18 });
    }
  },
};

// ── 7. 닮음비가 1 : n이면 넓이의 비는 1 : n × n ───────────────
const squareRatio = {
  id: "similar-area",
  unit: "4단원 · 닮음과 비",
  title: "닮음비가 2배면 넓이는 왜 4배일까",
  vary: "다른 등분으로",
  params(seed) {
    const s = pick([{ n: 4, ax: 230, bx: 40, cx: 420 }, { n: 3, ax: 150, bx: 50, cx: 410 }, { n: 5, ax: 290, bx: 40, cx: 410 }, { n: 4, ax: 110, bx: 50, cx: 400 }, { n: 3, ax: 320, bx: 40, cx: 420 }], seed);
    const A = P(s.ax, 45), B = P(s.bx, 365), Cc = P(s.cx, 365), n = s.n;
    const gp = (i, j) => add(A, add(mul(sub(B, A), i / n), mul(sub(Cc, B), j / n)));
    const tiles = [];
    for (let i = 0; i < n; i += 1) {
      for (let j = 0; j <= i; j += 1) tiles.push({ row: i, up: true, pts: [gp(i, j), gp(i + 1, j), gp(i + 1, j + 1)] });
      for (let j = 0; j < i; j += 1) tiles.push({ row: i, up: false, pts: [gp(i, j), gp(i + 1, j + 1), gp(i, j + 1)] });
    }
    const lin = Array.from({ length: n }, (_, i) => i + 1);
    return { n, A, B, C: Cc, gp, tiles, lin, sq: lin.map((v) => v * v), odd: lin.map((v) => 2 * v - 1) };
  },
  scenes: [
    { say: (p) => `삼각형 ㄱㄴㄷ의 두 변 ㄱㄴ, ㄱㄷ을 ${p.n}등분하고 밑변에 평행한 선을 그었어요. 꼭짓점 ㄱ에서 시작하는 삼각형들은 모두 닮았어요. 넓이는 어떻게 커질까요?`, line: (p) => `ㄱ에서 시작하는 닮은 삼각형, 닮음비 ${p.lin.join(" : ")}`, ms: 2200 },
    { say: "다른 두 변에도 평행한 선을 그으면 작은 삼각형으로 빈틈없이 나뉘어요. 맨 위 작은 삼각형을 밀거나 반 바퀴 돌리면 모든 칸에 꼭 맞아요.", line: (p) => `작은 삼각형 ${p.n * p.n}개는 모두 합동`, why: "세 방향 평행선의 간격이 같다 → 밀거나 반 바퀴 돌리면 꼭 겹친다", ms: 3400 },
    { say: "꼭짓점 ㄱ에서부터 삼각형을 한 줄씩 키우며 작은 삼각형을 세어 봐요.", line: (p) => `넓이의 비 = ${p.sq.join(" : ")}`, why: (p) => `닮음비 ${p.lin.join(" : ")}인 삼각형마다 작은 삼각형을 센 수`, ms: 3000 },
    { say: "한 줄 내려갈 때마다 작은 삼각형이 2개씩 늘어요. 1, 3, 5, …를 차례로 더하면 언제나 (줄 수) × (줄 수)예요.", line: (p) => `${p.odd.join(" + ")} = ${p.n} × ${p.n}`, why: "줄마다 바로 선 삼각형과 거꾸로 선 삼각형이 하나씩 더 늘어난다", ms: 2400 },
    { say: (p) => `그래서 닮음비가 ${p.n - 1} : ${p.n}이면 넓이의 비는 (${p.n - 1} × ${p.n - 1}) : (${p.n} × ${p.n}) = ${(p.n - 1) ** 2} : ${p.n * p.n}. 「다른 등분으로」를 눌러 보세요.`, line: "닮음비 a : b → 넓이의 비 (a × a) : (b × b)", why: "가로도 높이도 같은 비로 커지니 두 번 곱해진다", ms: 2000 },
  ],
  draw(f, k, p) {
    const { n, A, B, gp, tiles } = p, Cc = p.C;
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3), s4 = phase(k, 4);
    const band = [C.redSoft, C.orangeSoft, C.greenSoft, C.blueSoft, C.purpleSoft];
    const T0 = tiles[0].pts, c0 = centroid(T0);
    // 칸 채우기(맨 위 조각을 옮겨서)
    tiles.forEach((t, m) => {
      const lvl = t.row;
      const col = s2 > 0 && clamp(s2 * n - lvl) > 0 ? band[lvl % 5] : C.blueSoft;
      if (m === 0) { f.poly(T0, { fill: col, stroke: C.ink, w: 1.4, opacity: s0 }); return; }
      const tm = clamp((s1 - (m / tiles.length) * 0.7) / 0.3);
      if (tm <= 0) return;
      const ct = centroid(t.pts), cc = lerp(c0, ct, ease(tm));
      const pts = T0.map((q) => add(rot(q, c0, t.up ? 0 : 180 * ease(tm)), sub(cc, c0)));
      f.poly(pts, { fill: col, stroke: C.ink, w: 1.2, fillOpacity: 0.9 });
    });
    // 평행선
    for (let i = 1; i < n; i += 1) f.seg(gp(i, 0), gp(i, i), { stroke: C.orange, w: 2, grow: s0, opacity: s0 });
    for (let j = 1; j < n; j += 1) {
      f.seg(gp(n, j), gp(n - j, 0), { stroke: C.teal, w: 1.6, dash: "5 4", grow: s1, opacity: s1 * (1 - s2) });
      f.seg(gp(n, j), gp(j, j), { stroke: C.teal, w: 1.6, dash: "5 4", grow: s1, opacity: s1 * (1 - s2) });
    }
    f.poly([A, B, Cc], { fill: "none", draw: s0, w: 2.6 });
    for (let i = 1; i < n; i += 1) { f.ticks(gp(i - 1, 0), gp(i, 0), { opacity: s0 * (1 - s1), len: 6 }); f.ticks(gp(i - 1, i - 1), gp(i, i), { opacity: s0 * (1 - s1), len: 6 }); }
    // 키우는 삼각형 테두리와 칸 수
    for (let L = 1; L <= n; L += 1) {
      const on = clamp(s2 * n - (L - 1));
      if (on <= 0) continue;
      const cur = L === Math.min(n, Math.ceil(s2 * n + 1e-6));
      f.poly([A, gp(L, 0), gp(L, L)], { fill: "none", stroke: C.ink, w: cur && s2 < 1 ? 3.6 : 1.8, opacity: on * (1 - s4 * 0.6) });
      f.label(add(gp(L, L), P(14, 0)), `${L * L}칸`, { anchor: "start", size: 16, opacity: on, color: C.ink });
    }
    // 줄마다 늘어나는 수
    if (s3 > 0) for (let L = 1; L <= n; L += 1) f.label(add(mid(gp(L - 1, 0), gp(L, 0)), P(-20, 0)), `+${2 * L - 1}`, { anchor: "end", size: 16, color: C.purple, opacity: clamp(s3 * n - L + 1) });
    // 닮음비 2 : n
    if (s4 > 0) {
      f.poly([A, gp(n - 1, 0), gp(n - 1, n - 1)], { fill: C.red, fillOpacity: 0.12, stroke: C.red, w: 4, opacity: s4 });
      f.poly([A, B, Cc], { fill: "none", stroke: C.purple, w: 4, opacity: s4 });
    }
    f.label(add(A, P(0, -18)), "ㄱ").label(add(B, P(-12, 14)), "ㄴ").label(add(Cc, P(12, 14)), "ㄷ");
    if (s2 > 0 && s3 === 0) bottomNote(f, `닮음비 ${p.lin.join(" : ")}  →  넓이 ${p.sq.join(" : ")}`, { opacity: s2, size: 19 });
    if (s3 > 0 && s4 === 0) bottomNote(f, `${p.odd.join(" + ")} = ${n} × ${n} = ${n * n}`, { opacity: s3, size: 20, color: C.purple });
    if (s4 > 0) bottomNote(f, `닮음비 ${n - 1} : ${n}  →  넓이 ${(n - 1) ** 2} : ${n * n}`, { opacity: s4, size: 21, color: C.red });
  },
};

// ── 8. 피라미드 닮음과 모래시계 닮음 ───────────────────────────
const hourglass = {
  id: "pyramid-hourglass",
  unit: "4단원 · 닮음과 비",
  title: "평행선 하나가 길이의 비를 정하는 까닭",
  vary: "다른 비로",
  params(seed) {
    const s = pick([
      { m: 3, n: 5, u: 4, w: 3, ax: 215, bl: 185, br: 175 },
      { m: 2, n: 3, u: 6, w: 4, ax: 190, bl: 150, br: 200 },
      { m: 1, n: 2, u: 7, w: 8, ax: 245, bl: 205, br: 140 },
      { m: 2, n: 5, u: 3, w: 4, ax: 205, bl: 165, br: 190 },
      { m: 1, n: 3, u: 5, w: 6, ax: 225, bl: 175, br: 170 },
    ], seed);
    const A = P(s.ax, 175), B = P(s.ax - s.bl, 375), Cc = P(s.ax + s.br, 375), t = s.m / s.n;
    return { ...s, A, B, C: Cc, D: lerp(A, B, t), E: lerp(A, Cc, t), AD: s.m * s.u, AB: s.n * s.u, DE: s.m * s.w, BC: s.n * s.w };
  },
  scenes: [
    { say: "삼각형 ㄱㄴㄷ 안에 ㄴㄷ과 평행한 선분 ㄹㅁ을 그었어요(피라미드 모양). 작은 삼각형 ㄱㄹㅁ과 큰 삼각형 ㄱㄴㄷ은 어떤 사이일까요?", line: "ㄹㅁ ∥ ㄴㄷ (피라미드 모양)", ms: 1800 },
    { say: "평행한 두 선을 한 직선이 지나가면 같은 자리의 각(동위각)이 같아요. ㄴ의 각을 선을 따라 ㄹ로 밀어 올리면 꼭 겹쳐요.", line: "각 ㄱㄹㅁ = 각 ㄱㄴㄷ, 각 ㄱㅁㄹ = 각 ㄱㄷㄴ, 각 ㄱ은 같이 쓴다", why: "평행선의 동위각은 같다", ms: 2600 },
    { say: "세 각이 같으니 모양이 같아요. 작은 삼각형을 ㄱ에서 똑같은 배수로 늘리면 큰 삼각형에 꼭 겹쳐요.", line: "삼각형 ㄱㄹㅁ ∽ 삼각형 ㄱㄴㄷ (AA 닮음)", why: "두 각이 같으면 나머지 한 각도 같다(세 각의 합 180°) → 모양이 같다", ms: 2600 },
    { say: (p) => `늘린 배수는 어느 변이나 같아요. ㄱㄹ : ㄱㄴ = ${p.AD} : ${p.AB} = ${p.m} : ${p.n}이니, ㄹㅁ = ${p.BC} × ${p.m} ÷ ${p.n} = ${p.DE}cm예요.`, line: (p) => `ㄱㄹ : ㄱㄴ = ㄱㅁ : ㄱㄷ = ㄹㅁ : ㄴㄷ = ${p.m} : ${p.n}`, why: "닮은 도형은 대응변의 비가 모두 같다", ms: 2200 },
    { say: "작은 삼각형을 ㄱ을 중심으로 반 바퀴 돌려 봐요. 모래시계 모양이 돼도 ㄹㅁ은 여전히 ㄴㄷ과 평행하고, 각도 그대로예요.", line: "모래시계: 각 ㄱ은 맞꼭지각, 각 ㄹ = 각 ㄴ · 각 ㅁ = 각 ㄷ (엇각)", why: "반 바퀴 돌려도 모양과 크기는 그대로 → 여전히 닮음", ms: 3000 },
    { say: "그래서 평행선 하나만 있으면, 피라미드든 모래시계든 ㄱ에서 잰 길이의 비가 평행한 두 변의 비와 같아요. 「다른 비로」를 눌러 보세요.", line: (p) => `ㄱㄹ : ㄱㄴ = ㄹㅁ : ㄴㄷ = ${p.m} : ${p.n} (모래시계도 같다)`, why: "평행선 → 각이 같다 → 닮음 → 변의 비가 같다", ms: 1600 },
  ],
  draw(f, k, p) {
    const { A, B, D, E, m, n } = p, Cc = p.C;
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3), s4 = phase(k, 4), s5 = phase(k, 5);
    const Dn = rot(D, A, 180 * s4), En = rot(E, A, 180 * s4);
    // 모래시계용 늘인 선
    f.seg(A, lerp(A, B, -m / n - 0.12), { stroke: C.soft, w: 1.8, dash: "5 5", grow: s4, opacity: s4 });
    f.seg(A, lerp(A, Cc, -m / n - 0.12), { stroke: C.soft, w: 1.8, dash: "5 5", grow: s4, opacity: s4 });
    f.poly([A, B, Cc], { fill: C.paper, draw: s0 });
    f.poly([A, Dn, En], { fill: C.blueSoft, stroke: C.blue, w: 2.4, opacity: clamp(s0 * 2 - 1) });
    par(f, Dn, En, { color: C.blue, opacity: clamp(s0 * 2 - 1) }); par(f, B, Cc, { color: C.blue, opacity: clamp(s0 * 2 - 1) });
    // 늘리기(닮음의 중심 ㄱ)
    if (s2 > 0) {
      const sc = 1 + (n / m - 1) * s2;
      const grow = (q) => add(A, mul(sub(q, A), sc));
      f.poly([A, grow(D), grow(E)], { fill: "none", stroke: C.orange, w: 3, dash: "9 6", opacity: 1 - s3 });
    }
    // 각
    const aOp = clamp(s1 * 2 - 0.4);
    const sB = arcSpec(B, A, Cc), sC = arcSpec(Cc, A, B), sA = arcSpec(A, B, Cc);
    f.wedge(B, sB.start, sB.span, { r: 30, color: C.green, opacity: aOp });
    f.wedge(Cc, sC.start, sC.span, { r: 30, color: C.purple, opacity: aOp });
    f.wedge(A, sA.start, sA.span, { r: 26, color: C.red, opacity: aOp });
    if (s1 > 0) {
      const t = phase(k, 1, 0, 0.7);
      flyWedge(f, { v: B, start: sB.start, span: sB.span, r: 30 }, { v: Dn, start: sB.start + 180 * s4, span: sB.span, r: 26 }, t, { color: C.green });
      flyWedge(f, { v: Cc, start: sC.start, span: sC.span, r: 30 }, { v: En, start: sC.start + 180 * s4, span: sC.span, r: 26 }, t, { color: C.purple });
      if (s4 > 0) { const sA2 = arcSpec(A, Dn, En); f.wedge(A, sA2.start, sA2.span, { r: 22, color: C.red, opacity: s4 }); }
    }
    // 길이
    const lo = s3;
    // 작은 삼각형의 두 변은 그 삼각형 바깥으로(반 바퀴 돌려도 같은 쪽이라 호가 뒤집히지 않는다)
    dimLen(f, A, Dn, `${p.AD}`, { away: En, off: 16, opacity: lo, color: C.blue });
    dimLen(f, Dn, En, `${p.DE}`, { away: A, off: 16, opacity: lo, color: C.blue });
    dimLen(f, D, B, `${p.AB - p.AD}`, { away: Cc, off: 16, opacity: lo * (1 - s4), color: C.soft });
    dimLen(f, B, Cc, `${p.BC}cm`, { away: A, off: 20, opacity: lo });
    if (s4 > 0) dimLen(f, A, B, `${p.AB}`, { away: Cc, off: 18, opacity: s4 * lo });
    f.label(add(A, P(s4 > 0.5 ? 20 : 0, s4 > 0.5 ? 2 : -20)), "ㄱ").label(add(B, P(-14, 14)), "ㄴ").label(add(Cc, P(14, 14)), "ㄷ");
    const ctr = lerp(mid(Dn, En), A, 0.35);
    outLabel(f, Dn, ctr, "ㄹ", { opacity: s0 }); outLabel(f, En, ctr, "ㅁ", { opacity: s0 });
    const x = 420, o = { anchor: "start", size: 19 };
    if (s3 > 0) {
      f.note(P(x, 230), `ㄱㄹ : ㄱㄴ = ${p.AD} : ${p.AB}`, { ...o, opacity: s3 });
      f.note(P(x, 264), `ㄹㅁ : ㄴㄷ = ${p.DE} : ${p.BC}`, { ...o, opacity: s3 });
      f.note(P(x, 300), `= ${m} : ${n}`, { ...o, opacity: s3, color: C.blue, size: 22 });
    }
    if (s5 > 0) f.note(P(x, 345), "모래시계도 같다", { ...o, opacity: s5, color: C.purple });
  },
};

export const PROOFS = [inscribed, star, butterfly, equalArea, ratioTwice, inverse, squareRatio, hourglass];
