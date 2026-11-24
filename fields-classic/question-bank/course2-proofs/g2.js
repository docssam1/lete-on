// 2과정 G2 「도형분할과 넓이」 그림 논증 — 본책 1단원(도형분할과 정사각형)·2단원(피보나치 사각형)·
// 3단원(원과 삼각형의 둘레)·4단원(360도와 나비각)의 「왜 그럴까」.
// 본책은 칸을 세고 잘라 보며 답을 낸다. 여기서는 「옮겨도 넓이는 그대로」「마주 보는 변은 같다」
// 「원 = 같은 거리의 점」「맞꼭지각은 같다」 같은 이미 아는 사실을 근거로 쌓아, 왜 반드시 그런지 따진다.
// 「다른 …으로」를 눌러 다른 모양·다른 수에도 같은 논증이 통하는 것(일반화)을 본다. 그림 도구는 proof-board.js.
import { C, P, add, sub, mul, lerp, mid, dirDeg, polar, rot, angleAt, clamp, phase } from "../proof-board.js";
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
const unit = (v) => { const l = Math.hypot(v.x, v.y) || 1; return P(v.x / l, v.y / l); };
const arcPts = (c, r, a0, a1, n = 48) => Array.from({ length: n + 1 }, (_, i) => polar(c, r, a0 + ((a1 - a0) * i) / n));
const box = (x, y, w, h) => [P(x, y), P(x + w, y), P(x + w, y + h), P(x, y + h)];
const centroid = (pts) => mul(pts.reduce((s, q) => add(s, q), P(0, 0)), 1 / pts.length);
// 두 직선(p1p2, p3p4)이 만나는 점
const meet = (p1, p2, p3, p4) => {
  const d = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
  const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / d;
  return lerp(p1, p2, t);
};
const U1 = "1단원 · 도형분할과 정사각형", U2 = "2단원 · 피보나치 사각형", U3 = "3단원 · 원과 삼각형의 둘레", U4 = "4단원 · 360도와 나비각";

// ── 1. 계단 분할: 직사각형 → 정사각형 ─────────────────────────────
const stair = {
  id: "stair-square",
  unit: U1,
  title: "계단 모양으로 자르면 왜 정사각형이 될까",
  vary: "다른 직사각형으로",
  params(seed) {
    const [n, a, b] = pick([[2, 3, 2], [3, 4, 3], [2, 6, 4], [1, 4, 2], [1, 2, 1]], seed);
    const W = a * (n + 1), H = b * n, s = a * n, c = Math.min(44, 520 / W, 290 / s);
    const x0 = 320 - (W * c) / 2, y0 = 352;
    const cut = [[a, H]];
    for (let k = 1; k <= n; k += 1) { cut.push([k * a, H - k * b]); if (k < n) cut.push([(k + 1) * a, H - k * b]); }
    return { n, a, b, W, H, s, c, x0, y0, cut, L: [[0, 0], ...[...cut].reverse(), [0, H]], U: [...cut, [W, 0], [W, H]] };
  },
  scenes: [
    { say: (p) => `가로 ${p.W}칸, 세로 ${p.H}칸인 직사각형이에요. 두 조각으로 잘라 이어 붙여서 정사각형을 만들 수 있을까요?`, line: (p) => `직사각형의 넓이 = ${p.W} × ${p.H} = ${p.W * p.H}칸`, ms: 1800 },
    { say: (p) => `잘라서 옮겨도 칸 수는 그대로예요. ${p.W * p.H}칸짜리 정사각형은 한 변이 몇 칸일까요?`, line: (p) => `만들 정사각형의 한 변 = ${p.s}칸 (${p.s} × ${p.s} = ${p.W * p.H})`, why: "잘라 옮겨도 넓이는 늘지도 줄지도 않는다", ms: 2200 },
    { say: (p) => `가로는 ${p.W}칸에서 ${p.s}칸으로 ${p.a}칸 줄고, 세로는 ${p.H}칸에서 ${p.s}칸으로 ${p.b}칸 늘어야 해요.`, line: (p) => `가로는 ${p.a}칸 줄이고, 세로는 ${p.b}칸 늘인다`, why: (p) => `${p.W} − ${p.s} = ${p.a},  ${p.s} − ${p.H} = ${p.b}`, ms: 2200 },
    { say: (p) => (p.n === 1 ? `왼쪽에서 ${p.a}칸 되는 곳을 세로로 곧게 잘라요. 이번엔 계단이 한 칸뿐이에요.` : `한 칸이 가로 ${p.a}칸, 세로 ${p.b}칸인 계단 모양으로 잘라요.`), line: (p) => `계단 한 칸 = 가로 ${p.a}칸 · 세로 ${p.b}칸으로 자른다`, why: "옮겨야 할 거리를 계단 한 칸의 크기로 잡는다", ms: 2600 },
    { say: (p) => `오른쪽 조각을 왼쪽으로 ${p.a}칸, 위로 ${p.b}칸 옮겨요. 계단이 한 칸씩 어긋나며 꼭 맞물려요.`, line: "계단이 한 칸씩 밀려 빈틈없이 맞물린다", why: "계단 칸이 모두 똑같은 크기라 한 칸 밀면 바로 다음 계단에 맞는다", ms: 2800 },
    { say: (p) => `가로는 계단 폭만큼 줄고 세로는 계단 높이만큼 늘어 ${p.s}칸 × ${p.s}칸 정사각형이 됐어요. 「다른 직사각형으로」도 같은 까닭으로 돼요.`, line: (p) => `${p.s}칸 × ${p.s}칸 정사각형 완성`, why: (p) => `가로 ${p.W} − ${p.a} = ${p.s},  세로 ${p.H} + ${p.b} = ${p.s}`, ms: 1600 },
  ],
  draw(f, k, p) {
    const { a, b, W, H, s, c, x0, y0 } = p;
    const g = (i, j) => P(x0 + i * c, y0 - j * c);
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3a = phase(k, 3, 0, 0.6), s3b = phase(k, 3, 0.6, 1), s4 = phase(k, 4), s5 = phase(k, 5);
    for (let i = 0; i <= W; i += 1) f.seg(g(i, 0), g(i, s), { stroke: C.line, w: 1 });
    for (let j = 0; j <= s; j += 1) f.seg(g(0, j), g(W, j), { stroke: C.line, w: 1 });
    const ghost = [g(0, 0), g(s, 0), g(s, s), g(0, s)];
    if (s1 > 0) f.poly(ghost, { fill: C.purpleSoft, fillOpacity: 0.55, stroke: "none", opacity: s1 * (1 - s5) });
    if (s3b === 0) f.poly([g(0, 0), g(W, 0), g(W, H), g(0, H)], { draw: s0, fill: C.paper });
    else {
      f.poly(p.L.map(([i, j]) => g(i, j)), { fill: C.blueSoft, stroke: C.blue, w: 2.4, fillOpacity: s3b });
      f.poly(p.U.map(([i, j]) => g(i - a * s4, j + b * s4)), { fill: C.orangeSoft, stroke: C.orange, w: 2.4, fillOpacity: s3b });
    }
    if (s1 > 0) f.poly(ghost, { fill: "none", stroke: C.purple, w: 2, dash: "7 6", opacity: s1 * (1 - s4) });
    if (s3a > 0) f.path(p.cut.map(([i, j]) => g(i, j)), { stroke: C.red, w: 3.4, draw: s3a, opacity: 1 - s4 });
    // 줄일 가로, 늘일 세로
    const ar = s2 * (1 - s4);
    f.seg(P(g(s, 0).x, y0 + 14), P(g(W, 0).x, y0 + 14), { stroke: C.red, w: 4, opacity: ar });
    f.label(P((g(s, 0).x + g(W, 0).x) / 2, y0 + 33), `− ${a}칸`, { color: C.red, opacity: ar, size: 16 });
    f.seg(P(x0 - 14, g(0, H).y), P(x0 - 14, g(0, s).y), { stroke: C.green, w: 4, opacity: ar });
    f.label(P(x0 - 22, (g(0, H).y + g(0, s).y) / 2), `+ ${b}칸`, { anchor: "end", color: C.green, opacity: ar, size: 16 });
    // 길이 표시
    const d0 = s0 * (1 - s2);
    dimLen(f, g(0, 0), g(W, 0), `${W}칸`, { side: 1, opacity: d0 });
    dimLen(f, g(0, H), g(0, 0), `${H}칸`, { side: 1, opacity: d0 });
    dimLen(f, g(0, 0), g(s, 0), `${s}칸`, { side: 1, off: 30, opacity: s5, color: C.purple });
    dimLen(f, g(0, s), g(0, 0), `${s}칸`, { side: 1, off: 30, opacity: s5, color: C.purple });
    [[ghost[0], ghost[1]], [ghost[1], ghost[2]], [ghost[2], ghost[3]], [ghost[3], ghost[0]]].forEach(([u, v]) => f.ticks(u, v, { n: 2, opacity: s5, color: C.purple }));
    if (s1 > 0) bottomNote(f, `${W} × ${H} = ${W * H} = ${s} × ${s}`, { opacity: s1 * (1 - s2), size: 19 });
    if (s5 > 0) bottomNote(f, `가로 ${W} − ${a} = ${s}   ·   세로 ${H} + ${b} = ${s}`, { opacity: s5, size: 19 });
  },
};

// ── 2. 꼭짓점과 가운데 점을 이은 안쪽 정사각형 = 전체 ÷ 5 ───────────
const SQ_CORNER = [[0, 0], [2, 0], [2, 2], [0, 2]];
const SQ_MID = [[1, 0], [2, 1], [1, 2], [0, 1]];
const SQ_IN = [[0.8, 0.4], [1.6, 0.8], [1.2, 1.6], [0.4, 1.2]];
const squareFifth = {
  id: "square-fifth",
  unit: U1,
  title: "안쪽 정사각형은 왜 전체를 5로 나눈 하나일까",
  vary: "다른 넓이로",
  params(seed) {
    const N = pick([100, 45, 80, 125, 20], seed), mir = seed % 2 === 1;
    return { N, mir, T: ([x, y]) => P(110 + (mir ? 2 - x : x) * 120, 330 - y * 120) };
  },
  scenes: [
    { say: (p) => `넓이가 ${p.N}㎠인 정사각형의 네 꼭짓점에서 다음 변의 가운데 점으로 선을 그었더니, 가운데에 작은 정사각형이 생겼어요. 넓이는 얼마일까요?`, line: "네 꼭짓점에서 다음 변의 가운데 점까지 선 4개", ms: 2200 },
    { say: "선 4개가 큰 정사각형을 가운데 정사각형, 파란 조각 4개, 주황 작은 삼각형 4개로 나눠요.", line: "큰 정사각형 = 가운데 1개 + 파란 조각 4개 + 작은 삼각형 4개", why: "선 4개로 나눈 조각을 빠짐없이 센다", ms: 1800 },
    { say: "작은 삼각형을 가운데 점(●)을 중심으로 반 바퀴 돌려요. 꼭짓점 ㄱ이 꼭짓점 ㄴ 자리로 가서 파란 조각 옆에 붙어요.", line: "작은 삼각형을 가운데 점에서 반 바퀴 → 옆 조각에 붙는다", why: "가운데 점이라 양쪽 길이가 같아, 돌리면 한 꼭짓점이 다음 꼭짓점에 닿는다", ms: 2800 },
    { say: "새로 생긴 조각을 봐요. 네 각이 모두 직각이고, 빨갛게 표시한 이웃한 두 변의 길이가 같아요. 그러니 정사각형이에요.", line: "붙인 조각: 네 각이 직각, 이웃한 두 변이 같다 → 정사각형", why: "선 4개는 서로 직각으로 만난다(가운데가 정사각형) · 그림을 반의 반 바퀴 돌려도 그대로라 같은 자리의 길이가 같다", ms: 2400 },
    { say: "새 정사각형 4개는 모두 가운데 정사각형과 한 변을 같이 써요. 그래서 다섯 개가 모두 같은 크기예요.", line: "큰 정사각형 = 똑같은 정사각형 5개", why: "한 변을 같이 쓰는 정사각형은 크기가 같다 · 옮겨도 넓이는 그대로", ms: 2000 },
    { say: (p) => `그러니 가운데 정사각형은 전체를 5로 나눈 하나, ${p.N} ÷ 5 = ${p.N / 5}㎠. 「다른 넓이로」를 눌러도 늘 다섯 개 중 하나예요.`, line: (p) => `가운데 정사각형 = ${p.N} ÷ 5 = ${p.N / 5}㎠`, why: "큰 정사각형을 똑같이 5개로 나눈 것 중 하나", ms: 1600 },
  ],
  draw(f, k, p) {
    const { T, N } = p;
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3), s4 = phase(k, 4), s5 = phase(k, 5);
    const Cn = SQ_CORNER.map(T), M = SQ_MID.map(T), I = SQ_IN.map(T), O = T([1, 1]);
    if (s2 === 0) f.poly(Cn, { draw: s0, fill: C.paper });
    else f.poly(Cn, { fill: "none", stroke: C.soft, w: 1.6, dash: "5 5" });
    const turned = (i) => rot(I[i], M[i], 180);
    for (let i = 0; i < 4; i += 1) {
      const quad = [M[i], Cn[(i + 1) % 4], I[(i + 1) % 4], I[i]];
      if (s1 > 0) f.poly(quad, { fill: C.blueSoft, stroke: C.blue, w: 2, opacity: s1 });
    }
    f.poly(I, { fill: C.greenSoft, stroke: C.green, w: 2.4, opacity: clamp(s0 * 2 - 1) });
    for (let i = 0; i < 4; i += 1) {
      if (s1 > 0) f.poly([Cn[i], M[i], I[i]].map((q) => rot(q, M[i], 180 * s2)), { fill: C.orangeSoft, stroke: C.orange, w: 2, opacity: s1 });
    }
    // 새 정사각형을 초록으로
    for (let i = 0; i < 4; i += 1) if (s4 > 0) f.poly([turned(i), Cn[(i + 1) % 4], I[(i + 1) % 4], I[i]], { fill: C.greenSoft, stroke: C.green, w: 2.4, opacity: s4 });
    // 처음 선 4개
    for (let i = 0; i < 4; i += 1) f.seg(Cn[i], M[(i + 1) % 4], { grow: clamp(s0 * 1.5 - 0.5), opacity: 1 - s1, w: 2.2 });
    M.forEach((m) => f.dot(m, { fill: C.orange, r: 5, opacity: s0 }));
    // 정사각형인 까닭(아래 조각 하나)
    const q0 = [turned(0), Cn[1], I[1], I[0]];
    const ro = s3 * (1 - s4);
    q0.forEach((v, i) => f.right(v, q0[(i + 1) % 4], q0[(i + 3) % 4], { opacity: ro, color: C.ink, size: 11 }));
    f.ticks(q0[0], q0[1], { color: C.red, opacity: ro }).ticks(q0[1], q0[2], { color: C.red, opacity: ro });
    // 다섯 개
    if (s4 > 0) {
      f.label(O, "1", { size: 20, opacity: s4, color: C.green });
      for (let i = 0; i < 4; i += 1) f.label(centroid([turned(i), Cn[(i + 1) % 4], I[(i + 1) % 4], I[i]]), String(i + 2), { size: 20, opacity: s4, color: C.green });
    }
    ["ㄱ", "ㄴ", "ㄷ", "ㄹ"].forEach((t, i) => f.label(add(Cn[i], mul(unit(sub(Cn[i], O)), 24)), t, { opacity: s0 }));
    f.note(P(426, 110), `큰 정사각형 ${N}㎠`, { anchor: "start", size: 18, opacity: s0 });
    if (s4 > 0) f.note(P(426, 160), "= 똑같은 정사각형 5개", { anchor: "start", size: 17, opacity: s4, color: C.green });
    if (s5 > 0) {
      f.note(P(426, 220), `가운데 = ${N} ÷ 5`, { anchor: "start", size: 20, opacity: s5 });
      f.note(P(426, 262), `= ${N / 5}㎠`, { anchor: "start", size: 26, opacity: s5, color: C.green });
    }
  },
};

// ── 3. 정팔각형 귀퉁이 삼각형 ㉡ = 가운데 정사각형 ㉠ ÷ 4 ──────────
const octagon = {
  id: "octagon-corner",
  unit: U1,
  title: "정팔각형 귀퉁이 삼각형은 왜 가운데 정사각형의 4분의 1일까",
  vary: "다른 수로",
  params(seed) {
    const A = pick([16, 20, 36, 12, 64], seed), s = 136;
    return { A, q: A / 4, s, h: s / Math.SQRT2, O: P(230, 222) };
  },
  scenes: [
    { say: "정팔각형을 꼭짓점끼리 가로·세로로 이어 나눴어요. 가운데 정사각형 ㉠, 직사각형 4개, 귀퉁이 삼각형 ㉡ 4개가 생겨요. ㉡은 ㉠의 몇 분의 몇일까요?", line: "정팔각형 = 정사각형 ㉠ + 직사각형 4개 + 삼각형 ㉡ 4개", ms: 2200 },
    { say: "정팔각형은 여덟 변이 모두 같아요. ㉠의 한 변은 정팔각형의 윗변과 마주 보고, ㉡의 긴 변은 정팔각형의 한 변 그대로예요.", line: "㉡의 긴 변 = 정팔각형의 한 변 = ㉠의 한 변", why: "정팔각형의 변은 모두 같다 · 직사각형의 마주 보는 변은 같다", ms: 2400 },
    { say: "㉡은 직각을 끼고 있고, 직각을 낀 두 변의 길이도 같아요(직각이등변삼각형). 네 귀퉁이 ㉡은 모두 똑같아요.", line: "㉡ 4개는 모두 똑같은 직각이등변삼각형", why: "정팔각형은 각과 변이 모두 같아 네 귀퉁이가 꼭 같은 모양", ms: 2200 },
    { say: "㉡ 4개의 직각을 ㉠의 한가운데에 모아요. 긴 변이 ㉠의 네 변에 딱 맞고, 빈틈도 겹침도 없어요.", line: "㉡ 4개가 ㉠을 빈틈없이 꼭 덮는다", why: "직각 4개 = 한 바퀴(360°) · ㉡의 긴 변 = ㉠의 한 변", ms: 3000 },
    { say: (p) => `똑같은 ㉡ 4개가 ㉠ 하나와 같으니 ㉡ = ㉠ ÷ 4. ㉠이 ${p.A}㎠이면 ㉡은 ${p.q}㎠예요. 「다른 수로」 눌러 보세요.`, line: (p) => `㉡ = ㉠ ÷ 4 = ${p.A} ÷ 4 = ${p.q}㎠`, why: "똑같은 ㉡ 4개 = ㉠", ms: 1600 },
  ],
  draw(f, k, p) {
    const { O, s, h, A, q } = p, half = s / 2, e = half + h;
    const at = (x, y) => P(O.x + x, O.y + y);
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3), s4 = phase(k, 4);
    const oct = [at(-half, -e), at(half, -e), at(e, -half), at(e, half), at(half, e), at(-half, e), at(-e, half), at(-e, -half)];
    const sq = [at(-half, -half), at(half, -half), at(half, half), at(-half, half)];
    const rects = [
      [at(-half, -e), at(half, -e), at(half, -half), at(-half, -half)], [at(half, -half), at(e, -half), at(e, half), at(half, half)],
      [at(-half, half), at(half, half), at(half, e), at(-half, e)], [at(-e, -half), at(-half, -half), at(-half, half), at(-e, half)],
    ];
    const tris = [
      [at(half, -half), at(half, -e), at(e, -half)], [at(half, half), at(e, half), at(half, e)],
      [at(-half, half), at(-half, e), at(-e, half)], [at(-half, -half), at(-e, -half), at(-half, -e)],
    ];
    const move = (pt, K, t) => add(rot(pt, K, -45 * t), mul(sub(O, K), t));
    const op = clamp(s0 * 2 - 1);
    f.poly(oct, { draw: s0, fill: C.paper });
    rects.forEach((r) => f.poly(r, { fill: C.blueSoft, stroke: C.blue, w: 1.8, opacity: op }));
    f.poly(sq, { fill: C.greenSoft, stroke: C.green, w: 2.4, opacity: op });
    tris.forEach((t) => { if (s3 > 0) f.poly(t, { fill: "none", stroke: C.soft, w: 1.6, dash: "5 5", opacity: s3 }); });
    tris.forEach((t) => f.poly(t.map((pt) => move(pt, t[0], s3)), { fill: C.orangeSoft, stroke: C.orange, w: 2.2, opacity: op, fillOpacity: 0.95 }));
    f.poly(oct, { fill: "none", w: 2.6, opacity: op });
    // 같은 길이
    const t1 = s1 * (1 - s3 * 0.8);
    oct.forEach((v, i) => f.ticks(v, oct[(i + 1) % 8], { color: C.red, opacity: t1 }));
    sq.forEach((v, i) => f.ticks(v, sq[(i + 1) % 4], { color: C.red, opacity: t1 * (1 - s3) }));
    // 직각, 같은 두 변
    const t2 = s2 * (1 - s3);
    tris.forEach(([K, V1, V2]) => { f.right(K, V1, V2, { opacity: t2, size: 12 }); f.ticks(K, V1, { n: 2, color: C.purple, opacity: t2, len: 7 }).ticks(K, V2, { n: 2, color: C.purple, opacity: t2, len: 7 }); });
    // 이름표
    f.label(O, "㉠", { size: 24, color: C.green, opacity: op * (1 - s3) });
    f.label(centroid(tris[0]), "㉡", { size: 17, color: "#b35f00", opacity: op * (1 - s3) });
    const ql = clamp(s3 * 2 - 1);
    [P(1, 0), P(0, 1), P(-1, 0), P(0, -1)].forEach((d) => f.label(add(O, mul(d, s * 0.29)), s4 > 0.5 ? `${q}` : "㉡", { size: 17, color: "#b35f00", opacity: ql }));
    if (s4 > 0) {
      f.note(P(426, 170), `㉠ = ${A}㎠`, { anchor: "start", size: 20, opacity: s4, color: C.green });
      f.note(P(426, 215), `㉡ = ${A} ÷ 4`, { anchor: "start", size: 20, opacity: s4 });
      f.note(P(426, 258), `= ${q}㎠`, { anchor: "start", size: 26, opacity: s4, color: "#b35f00" });
    }
  },
};

// ── 4. 피보나치 사각형: 새 한 변 = 앞의 두 한 변의 합 ─────────────
const fib = {
  id: "fibonacci-rect",
  unit: U2,
  title: "피보나치 사각형의 한 변은 왜 앞의 두 수의 합일까",
  vary: "다른 개수로",
  params(seed) {
    const n = pick([6, 5, 7, 8], seed);
    const s = [1, 1];
    while (s.length < n) s.push(s[s.length - 1] + s[s.length - 2]);
    const sq = [{ x0: 0, y0: 0, x1: 1, y1: 1, d: -1 }], rects = [];
    let r = { x0: 0, y0: 0, x1: 1, y1: 1 };
    rects.push({ ...r });
    for (let i = 1; i < n; i += 1) {
      const d = (i - 1) % 4, z = s[i];
      let q;
      if (d === 0) q = { x0: r.x1, x1: r.x1 + z, y0: r.y0, y1: r.y0 + z };
      else if (d === 1) q = { x0: r.x0, x1: r.x0 + z, y0: r.y1, y1: r.y1 + z };
      else if (d === 2) q = { x0: r.x0 - z, x1: r.x0, y0: r.y0, y1: r.y0 + z };
      else q = { x0: r.x0, x1: r.x0 + z, y0: r.y0 - z, y1: r.y0 };
      q.d = d; sq.push(q);
      r = { x0: Math.min(r.x0, q.x0), y0: Math.min(r.y0, q.y0), x1: Math.max(r.x1, q.x1), y1: Math.max(r.y1, q.y1) };
      rects.push({ ...r });
    }
    const w = r.x1 - r.x0, h = r.y1 - r.y0, g = Math.min(400 / w, 320 / h), cx = 300, cy = 196;
    const T = (x, y) => P(cx + (x - (r.x0 + r.x1) / 2) * g, cy - (y - (r.y0 + r.y1) / 2) * g);
    return { n, s, sq, rects, r, w, h, g, T, a: s[n - 1], b: s[n - 2], c: s[n - 3] };
  },
  scenes: [
    { say: "한 변이 1인 정사각형 두 개를 나란히 붙였어요. 이제 늘 직사각형의 긴 변에 꼭 맞는 정사각형을 붙여 나가요.", line: "한 변이 1, 1인 정사각형에서 시작한다", ms: 1600 },
    { say: "직사각형의 긴 변에 정사각형을 붙이면 다시 직사각형이 되고, 긴 변이 바뀌어요. 빙 돌아가며 붙여요.", line: (p) => `한 변: ${p.s.join(", ")}`, why: "새 정사각형은 직사각형의 긴 변 전체를 덮는다 → 다시 직사각형", ms: 4200 },
    { say: (p) => `마지막 정사각형이 붙은 변을 봐요. 바로 앞 정사각형의 한 변 ${p.b}와 그 앞 정사각형의 한 변 ${p.c}가 이어져 있어요.`, line: (p) => `새 한 변 = 앞의 두 한 변의 합 (${p.b} + ${p.c} = ${p.a})`, why: "붙이는 긴 변 = 바로 앞 정사각형의 한 변 + 그 앞 정사각형의 한 변", ms: 2600 },
    { say: (p) => `큰 직사각형의 짧은 변은 마지막 정사각형의 한 변 ${p.a}, 긴 변은 마지막 두 정사각형을 이은 ${p.a} + ${p.b} = ${p.a + p.b}예요.`, line: (p) => `큰 직사각형 = ${p.a} × ${p.a + p.b}`, why: "짧은 변 = 마지막 정사각형 · 긴 변 = 마지막 두 정사각형이 나란히", ms: 2200 },
    { say: (p) => `둘레는 (짧은 변 + 긴 변) × 2 = (${p.a} + ${p.a + p.b}) × 2 = ${2 * (2 * p.a + p.b)}. 「다른 개수로」 눌러 같은 방법으로 따져 보세요.`, line: (p) => `둘레 = (${p.a} + ${p.a + p.b}) × 2 = ${2 * (2 * p.a + p.b)}`, why: (p) => `${p.a} + ${p.a + p.b} = ${2 * p.a + p.b} — 수를 늘어놓은 줄에서 ${p.a}의 다음다음 수`, ms: 1600 },
  ],
  draw(f, k, p) {
    const { n, s, sq, rects, T, g } = p;
    const s0 = phase(k, 0), s2 = phase(k, 2), s3 = phase(k, 3), s4 = phase(k, 4);
    const m = n - 2;
    const fills = [C.blueSoft, C.blueSoft];
    sq.forEach((q, i) => {
      const op = i < 2 ? clamp(s0 * 2 - i) : clamp((k - 1) * m - (i - 2));
      if (op <= 0) return;
      let fill = C.paper;
      if (s2 > 0 && i === n - 1) fill = C.purpleSoft;
      else if (s2 > 0 && i === n - 2) fill = C.orangeSoft;
      else if (s2 > 0 && i === n - 3) fill = C.greenSoft;
      else fill = fills[i % 2];
      f.poly([T(q.x0, q.y0), T(q.x1, q.y0), T(q.x1, q.y1), T(q.x0, q.y1)], { fill, stroke: C.ink, w: 2, opacity: op });
      const px = s[i] * g, size = clamp(px * 0.42, 11, 30);
      if (px >= 16) f.label(T((q.x0 + q.x1) / 2, (q.y0 + q.y1) / 2), String(s[i]), { size, opacity: op, halo: false });
    });
    // 마지막 정사각형이 붙은 변
    if (s2 > 0 && n >= 3) {
      const rb = rects[n - 2], d = sq[n - 1].d, vert = d === 0 || d === 2;
      const line = d === 0 ? rb.x1 : d === 2 ? rb.x0 : d === 1 ? rb.y1 : rb.y0;
      const span = (q) => (vert ? [q.y0, q.y1] : [q.x0, q.x1]);
      const full = vert ? [rb.y0, rb.y1] : [rb.x0, rb.x1];
      const ps = span(sq[n - 2]), rest = ps[0] === full[0] ? [ps[1], full[1]] : [full[0], ps[0]];
      const E = ([lo, hi]) => (vert ? [T(line, lo), T(line, hi)] : [T(lo, line), T(hi, line)]);
      const into = unit(sub(T((sq[n - 1].x0 + sq[n - 1].x1) / 2, (sq[n - 1].y0 + sq[n - 1].y1) / 2), mid(...E(full))));
      const op = s2 * (1 - s3 * 0.7);
      const [o1, o2] = E(ps), [g1, g2] = E(rest);
      f.seg(o1, o2, { stroke: C.orange, w: 7, opacity: op }).seg(g1, g2, { stroke: C.green, w: 7, opacity: op });
      const inward = add(mid(...E(full)), mul(into, -40));   // 붙인 정사각형 쪽으로 휘게(그 반대쪽 점)
      dimLen(f, o1, o2, `${p.b}`, { away: inward, color: "#b35f00", size: 18, opacity: op });
      dimLen(f, g1, g2, `${p.c}`, { away: inward, color: C.green, size: 18, opacity: op });
    }
    // 큰 직사각형
    if (s3 > 0) {
      const { r } = p, lb = T(r.x0, r.y0), rbm = T(r.x1, r.y0), rt = T(r.x1, r.y1), ctr = T((r.x0 + r.x1) / 2, (r.y0 + r.y1) / 2);
      f.poly([T(r.x0, r.y0), T(r.x1, r.y0), T(r.x1, r.y1), T(r.x0, r.y1)], { fill: "none", stroke: C.purple, w: 4, opacity: s3 });
      dimLen(f, lb, rbm, `${p.w}`, { away: ctr, off: 20, color: C.purple, size: 18, opacity: s3 });
      dimLen(f, rbm, rt, `${p.h}`, { away: ctr, off: 20, color: C.purple, size: 18, opacity: s3 });
    }
    if (s4 > 0) bottomNote(f, `둘레 = (${p.a} + ${p.a + p.b}) × 2 = ${2 * (2 * p.a + p.b)}`, { opacity: s4, color: C.purple });
  },
};

// ── 5. 똑같은 직사각형으로 만든 모양: 가로를 두 번 재면 비가 나온다 ──
const ratioRects = {
  id: "ratio-rects",
  unit: U2,
  title: "작은 직사각형의 가로와 세로의 비는 어떻게 알까",
  vary: "다른 배열로",
  params(seed) {
    const [m, n, u] = pick([[2, 3, 2], [1, 2, 3], [3, 4, 1], [2, 5, 2], [1, 3, 2]], seed);
    const L = n * u, S = m * u, Wc = m * L, Hc = S + L, kk = Math.min(330 / Wc, 190 / Hc);
    return { m, n, u, L, S, Pm: 2 * (L + S), Wc, Hc, kk, x0: 320 - (Wc * kk) / 2, y0: 46 };
  },
  scenes: [
    { say: (p) => `크기와 모양이 같은 직사각형 ${p.m + p.n}개를 붙여 큰 직사각형을 만들었어요. 위에 ${p.m}개는 눕히고, 아래 ${p.n}개는 세웠어요. 작은 직사각형의 긴 변과 짧은 변은 어떤 비일까요?`, line: (p) => `똑같은 직사각형 ${p.m + p.n}개: 위 ${p.m}개 눕힘, 아래 ${p.n}개 세움`, ms: 2200 },
    { say: (p) => `큰 직사각형의 가로를 위에서 재면 긴 변 ${p.m}개, 아래에서 재면 짧은 변 ${p.n}개예요. 두 막대로 옮겨 나란히 대 봐요.`, line: (p) => `긴 변 ${p.m}개 = 짧은 변 ${p.n}개`, why: "위 가로와 아래 가로는 큰 직사각형의 마주 보는 변이라 길이가 같다", ms: 3000 },
    { say: (p) => `같은 막대를 똑같은 칸 ${p.m * p.n}개로 나누면 긴 변 하나는 ${p.n}칸, 짧은 변 하나는 ${p.m}칸이에요.`, line: (p) => `긴 변 : 짧은 변 = ${p.n} : ${p.m}`, why: (p) => `같은 길이를 긴 변 ${p.m}개로, 짧은 변 ${p.n}개로 똑같이 나눴다`, ms: 2400 },
    { say: (p) => `작은 직사각형의 둘레가 ${p.Pm}cm라면, 긴 변 + 짧은 변은 그 반인 ${p.L + p.S}cm예요.`, line: (p) => `긴 변 + 짧은 변 = ${p.Pm} ÷ 2 = ${p.L + p.S}cm`, why: "둘레 = (긴 변 + 짧은 변) × 2", ms: 2000 },
    { say: (p) => `긴 변 + 짧은 변은 ${p.n} + ${p.m} = ${p.m + p.n}칸이니 한 칸은 ${p.L + p.S} ÷ ${p.m + p.n} = ${p.u}cm. 긴 변 ${p.L}cm, 짧은 변 ${p.S}cm예요. 「다른 배열로」도 가로를 두 번 재면 돼요.`, line: (p) => `한 칸 ${p.u}cm → 긴 변 ${p.L}cm, 짧은 변 ${p.S}cm`, why: (p) => `${p.L + p.S} ÷ ${p.m + p.n} = ${p.u}`, ms: 1800 },
  ],
  draw(f, k, p) {
    const { m, n, u, L, S, kk, x0, y0 } = p;
    const X = (cm) => x0 + cm * kk, Y = (cm) => y0 + cm * kk;
    const s0 = phase(k, 0), s1a = phase(k, 1, 0, 0.4), s1b = phase(k, 1, 0.45, 1), s2 = phase(k, 2), s3 = phase(k, 3), s4 = phase(k, 4);
    for (let i = 0; i < m; i += 1) f.poly(box(X(i * L), Y(0), L * kk, S * kk), { fill: i === 0 ? C.greenSoft : C.paper, draw: s0 });
    for (let j = 0; j < n; j += 1) f.poly(box(X(j * S), Y(S), S * kk, L * kk), { fill: C.paper, draw: s0 });
    const by1 = Y(S + L) + 48, by2 = by1 + 40;
    const top = Y(0), bot = Y(S + L);
    const segs = (count, len, yy, color, w) => {
      for (let i = 0; i < count; i += 1) f.seg(P(X(i * len) + 2, yy), P(X((i + 1) * len) - 2, yy), { stroke: color, w, opacity: s1a });
    };
    segs(m, L, top, C.orange, 5);
    segs(n, S, bot, C.blue, 5);
    if (s1b > 0) {
      segs(m, L, top + (by1 - top) * s1b, C.orange, 9);
      segs(n, S, bot + (by2 - bot) * s1b, C.blue, 9);
      f.label(P(x0 - 12, by1), `긴 변 × ${m}`, { anchor: "end", size: 15, color: "#b35f00", opacity: s1b });
      f.label(P(x0 - 12, by2), `짧은 변 × ${n}`, { anchor: "end", size: 15, color: C.blue, opacity: s1b });
      f.seg(P(X(m * L), by1 - 14), P(X(m * L), by2 + 14), { stroke: C.ink, w: 1.6, dash: "4 4", opacity: s1b });
      f.seg(P(X(0), by1 - 14), P(X(0), by2 + 14), { stroke: C.ink, w: 1.6, dash: "4 4", opacity: s1b });
    }
    if (s2 > 0) {
      for (let c = 1; c < m * n; c += 1) f.seg(P(X(c * u), by1 - 8), P(X(c * u), by2 + 8), { stroke: C.ink, w: 1.2, opacity: s2 * 0.8 });
      f.label(P(X(L / 2), by1 - 22), `긴 변 = ${n}칸`, { size: 15, color: "#b35f00", opacity: s2 });
      f.label(P(X(S / 2), by2 + 23), `짧은 변 = ${m}칸`, { size: 15, color: C.blue, opacity: s2, anchor: "start" });
    }
    if (s4 > 0) {
      dimLen(f, P(X(0), Y(0)), P(X(L), Y(0)), `${L}cm`, { side: -1, off: 16, color: "#b35f00", opacity: s4 });
      dimLen(f, P(X(0), Y(S)), P(X(0), Y(0)), `${S}cm`, { side: -1, off: 16, color: C.blue, opacity: s4 });
    }
    if (s3 > 0) f.note(P(320, 382), `둘레 ${p.Pm} ÷ 2 = 긴 변 + 짧은 변 = ${L + S}cm`, { opacity: s3, size: 18 });
    if (s4 > 0) f.note(P(320, 414), `한 칸 = ${L + S} ÷ ${m + n} = ${u}cm`, { opacity: s4, size: 19, color: C.green });
  },
};

// ── 6. 세 막대로 삼각형: 두 원이 만나야 한다 ──────────────────────
const sticks = {
  id: "triangle-sticks",
  unit: U3,
  title: "세 막대로 삼각형을 만들 수 있는 때는 언제일까",
  vary: "다른 막대로",
  params(seed) {
    const [a, b, c] = pick([[3, 4, 8], [5, 6, 8], [3, 5, 8], [4, 7, 8], [2, 5, 6]], seed);
    const g = 40, Lp = P(320 - (c * g) / 2, 330), Rp = P(320 + (c * g) / 2, 330);
    const kind = a + b > c ? "ok" : a + b === c ? "flat" : "short";
    let Ap = null, thL = 0, thR = 180;
    if (kind === "ok") {
      const d = (a * a - b * b + c * c) / (2 * c), h = Math.sqrt(a * a - d * d);
      Ap = P(Lp.x + d * g, Lp.y - h * g); thL = dirDeg(Lp, Ap); thR = dirDeg(Rp, Ap);
    }
    return { a, b, c, g, Lp, Rp, kind, Ap, thL, thR };
  },
  scenes: [
    { say: (p) => `길이가 ${p.a}cm, ${p.b}cm, ${p.c}cm인 막대 세 개로 삼각형을 만들 수 있을까요? 가장 긴 ${p.c}cm 막대를 밑변으로 놓아요.`, line: (p) => `막대 ${p.a}cm, ${p.b}cm, ${p.c}cm — 가장 긴 ${p.c}cm가 밑변`, ms: 1800 },
    { say: "두 막대를 밑변 양 끝 ㄱ, ㄴ에 세워요. 막대 끝은 컴퍼스처럼 원을 그리며 움직여요. 삼각형의 꼭짓점은 두 원이 만나는 곳이어야 해요.", line: "막대 끝은 ㄱ, ㄴ을 중심으로 하는 원 위를 움직인다", why: "원 = 한 점에서 같은 거리에 있는 점들을 이은 것", ms: 2600 },
    { say: (p) => `두 막대를 밑변 위에 곧게 눕혀요. 두 막대가 가장 멀리 닿는 때예요. ${p.a} + ${p.b} = ${p.a + p.b}cm를 밑변 ${p.c}cm와 견줘요.`, line: (p) => (p.kind === "short" ? `눕혀도 ${p.a + p.b}cm < ${p.c}cm — ${p.c - p.a - p.b}cm 모자란다` : p.kind === "flat" ? `눕히면 ${p.a + p.b}cm = ${p.c}cm — 끝이 딱 맞닿는다` : `눕히면 ${p.a + p.b}cm > ${p.c}cm — ${p.a + p.b - p.c}cm 겹친다`), why: "곧게 눕힐 때 두 막대가 밑변을 가장 많이 덮는다", ms: 2600 },
    {
      say: (p) => (p.kind === "ok" ? "겹칠 만큼 길었으니, 두 막대를 세우는 동안 두 끝이 한 점 ㄷ에서 만나요. 삼각형이 돼요." : p.kind === "short" ? "눕혀도 모자랐으니 세우면 두 끝이 더 멀어져요. 두 원은 만나지 않아요. 삼각형이 안 돼요." : "두 끝이 만나는 곳은 밑변 위 한 점뿐이에요. 조금만 세워도 떨어지니 납작해질 뿐, 삼각형이 안 돼요."),
      line: (p) => (p.kind === "ok" ? "두 원이 위에서 만난다 → 삼각형 ㄱㄴㄷ" : p.kind === "short" ? "두 원이 만나지 않는다 → 삼각형이 안 된다" : "두 원이 밑변 위에서만 닿는다 → 삼각형이 안 된다"),
      why: (p) => (p.kind === "ok" ? "눕히면 겹치고 세우면 떨어지니, 그 사이에 두 끝이 꼭 한 번 만난다" : p.kind === "short" ? "세울수록 막대가 밑변 쪽으로 덮는 길이가 줄어 더 벌어진다" : "닿는 자리가 밑변 위라 세 꼭짓점이 한 줄에 놓인다"),
      ms: 2800,
    },
    { say: "그래서 세 막대로 삼각형을 만들려면 가장 긴 막대가 나머지 두 막대의 합보다 짧아야 해요. 「다른 막대로」 눌러 확인해 보세요.", line: "삼각형이 되려면: 가장 긴 변 < 나머지 두 변의 합", why: "가장 긴 변을 밑변으로 놓으면 두 짧은 막대가 겹쳐야 한다 — 같거나 모자라면 만나지 않는다", ms: 1600 },
  ],
  draw(f, k, p) {
    const { a, b, c, g, Lp, Rp, kind, Ap, thL, thR } = p;
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3), s4 = phase(k, 4);
    if (kind === "ok" && s3 > 0) f.poly([Lp, Rp, Ap], { fill: C.orangeSoft, stroke: "none", opacity: s3 });
    f.seg(Lp, Rp, { stroke: C.orange, w: 12, opacity: 0.45 * s0 + 0.0 }).seg(Lp, Rp, { stroke: "#b35f00", w: 3, grow: s0 });
    // 원(막대 끝이 지나는 길)
    const arcOp = s1 * 0.9;
    if (s1 > 0) {
      f.path(arcPts(Lp, a * g, 0, 112), { stroke: C.green, w: 1.8, dash: "6 6", draw: s1, opacity: arcOp });
      f.path(arcPts(Rp, b * g, 180, 68), { stroke: C.blue, w: 1.8, dash: "6 6", draw: s1, opacity: arcOp });
    }
    // 막대 자리와 방향
    let lS, lA, rS, rA;
    if (k < 2) { lS = lerp(P(Lp.x, 118), Lp, s1); lA = 90 * s1; rS = lerp(P(Rp.x, 168), Rp, s1); rA = 180 - 90 * s1; }
    else if (k < 3) { lS = Lp; rS = Rp; lA = 90 - 90 * s2; rA = 90 + 90 * s2; }
    else {
      lS = Lp; rS = Rp;
      const up = kind === "ok" ? [thL, thR] : kind === "short" ? [72, 108] : [38, 142];
      lA = up[0] * s3; rA = 180 + (up[1] - 180) * s3;
    }
    const lT = polar(lS, a * g, lA), rT = polar(rS, b * g, rA);
    f.seg(lS, lT, { stroke: C.green, w: 7 }).seg(rS, rT, { stroke: C.blue, w: 7 });
    f.dot(lT, { r: 5, fill: C.green }).dot(rT, { r: 5, fill: C.blue });
    dimLen(f, lS, lT, `${a}cm`, { side: -1, off: 18, color: C.green });   // 막대가 돌아도 같은 쪽(진행 방향 왼쪽)
    // 눕힌 동안은 오른쪽 막대의 호를 밑변 아래로(위에는 왼쪽 막대 호·겹침 호가 있다) — 장면 진행에 따라 부드럽게 넘어간다
    const flat = k < 2 ? 0 : k < 3 ? s2 : 1 - s3;
    dimLen(f, rS, rT, `${b}cm`, { side: 1 - 2 * flat, off: 18, color: C.blue });
    // 눕혔을 때
    const io = s2 * (1 - s3);
    const lt = P(Lp.x + a * g, Lp.y), rt = P(Rp.x - b * g, Rp.y);
    if (io > 0) {
      // 겹침·모자람은 변이 아니라 두 길이의 차이라 막대 위 글자 그대로(같은 쪽 두 호가 겹친 구간에서 서로 가로지르지 않게)
      if (kind === "short") { f.seg(lt, rt, { stroke: C.red, w: 5, opacity: io }); f.label(P((lt.x + rt.x) / 2, Lp.y - 52), `모자람 ${c - a - b}cm`, { color: C.red, opacity: io, size: 16 }); }
      else if (kind === "ok") { f.seg(rt, lt, { stroke: C.purple, w: 5, opacity: io }); f.label(P((lt.x + rt.x) / 2, Lp.y - 52), `겹침 ${a + b - c}cm`, { color: C.purple, opacity: io, size: 16 }); }
      else { f.dot(lt, { r: 7, fill: C.red, opacity: io }); f.label(P(lt.x, Lp.y - 52), "딱 맞닿음", { color: C.red, opacity: io, size: 16 }); }
    }
    if (kind !== "ok" && s3 > 0) {
      f.seg(lT, rT, { stroke: C.red, w: 2, dash: "5 5", opacity: s3 });
      f.label(add(mid(lT, rT), P(0, -16)), "닿지 않음", { color: C.red, size: 15, opacity: s3 });
    }
    if (kind === "ok") f.label(add(Ap, P(0, -22)), "ㄷ", { opacity: s3 });
    f.label(add(Lp, P(-16, 18)), "ㄱ", { opacity: s0 }).label(add(Rp, P(16, 18)), "ㄴ", { opacity: s0 });
    dimLen(f, Lp, Rp, `${c}cm`, { side: 1, off: 42, color: "#b35f00", opacity: s0 });
    const cmp = kind === "ok" ? `${a} + ${b} = ${a + b} > ${c}` : kind === "flat" ? `${a} + ${b} = ${a + b}, 밑변 ${c}와 같다` : `${a} + ${b} = ${a + b} < ${c}`;
    bottomNote(f, cmp, { opacity: s2 * (1 - phase(k, 4, 0, 0.35)), color: kind === "ok" ? C.green : C.red });
    bottomNote(f, "가장 긴 변 < 나머지 두 변의 합", { opacity: phase(k, 4, 0.35, 1), color: C.purple });
  },
};

// ── 7. 정삼각형 귀퉁이를 잘라 낸 육각형의 둘레 ─────────────────────
const hexCut = {
  id: "hexagon-cut",
  unit: U3,
  title: "귀퉁이를 잘라 낸 육각형의 둘레는 왜 그만큼 줄까",
  vary: "다른 길이로",
  params(seed) {
    const s = pick([{ L: 24, x: 6, y: 8, z: 4 }, { L: 30, x: 9, y: 6, z: 12 }, { L: 18, x: 6, y: 6, z: 6 }, { L: 27, x: 7, y: 10, z: 5 }, { L: 21, x: 5, y: 3, z: 9 }], seed);
    const B = P(140, 382), Cc = P(480, 382), A = P(310, 382 - 340 * Math.sin(Math.PI / 3));
    return { ...s, A, B, C: Cc, G: centroid([A, B, Cc]), fin: 3 * s.L - s.x - s.y - s.z };
  },
  scenes: [
    { say: (p) => `한 변이 ${p.L}cm인 정삼각형이에요. 둘레는 ${p.L} × 3 = ${3 * p.L}cm. 세 귀퉁이에서 작은 정삼각형을 잘라 내면 육각형의 둘레는 얼마일까요?`, line: (p) => `처음 둘레 = ${p.L} × 3 = ${3 * p.L}cm`, ms: 2000 },
    { say: (p) => `위 귀퉁이에서 한 변이 ${p.x}cm인 정삼각형을 잘라 내요. 잘라 낸 조각도 정삼각형이라 자른 선의 길이도 ${p.x}cm예요.`, line: (p) => `잘라 낸 조각: 세 변이 모두 ${p.x}cm`, why: "정삼각형은 세 변의 길이가 같다", ms: 2200 },
    { say: (p) => `둘레에서 빠지는 것은 귀퉁이의 두 토막(${p.x}cm, ${p.x}cm), 새로 생기는 것은 자른 선 ${p.x}cm 하나예요. 한 토막은 자른 선 자리로 돌아오고, 한 토막만 빠져요.`, line: (p) => `귀퉁이 하나를 자르면 둘레가 ${p.x}cm 준다`, why: (p) => `빠진 ${p.x} + ${p.x}, 새로 생긴 ${p.x} → ${p.x}만큼 줄어든다`, ms: 3200 },
    { say: (p) => `다른 두 귀퉁이도 똑같아요. 둘레가 ${p.y}cm, ${p.z}cm씩 줄어요.`, line: (p) => `나머지 귀퉁이: ${p.y}cm, ${p.z}cm씩 준다`, why: "잘라 낸 조각이 모두 정삼각형이라 같은 까닭", ms: 3200 },
    { say: (p) => `그래서 육각형의 둘레 = 처음 둘레 − 잘라 낸 정삼각형들의 한 변의 합 = ${3 * p.L} − ${p.x + p.y + p.z} = ${p.fin}cm. 「다른 길이로」도 같은 방법이에요.`, line: (p) => `육각형 둘레 = ${3 * p.L} − (${p.x} + ${p.y} + ${p.z}) = ${p.fin}cm`, why: "귀퉁이를 자를 때마다 그 정삼각형의 한 변만큼 준다", ms: 1600 },
  ],
  draw(f, k, p) {
    const { L, x, y, z, A, B, G } = p, Cc = p.C;
    const s0 = phase(k, 0), s1 = phase(k, 1), s4 = phase(k, 4);
    const A1 = lerp(A, B, x / L), A2 = lerp(A, Cc, x / L), B1 = lerp(B, A, y / L), B2 = lerp(B, Cc, y / L), C1 = lerp(Cc, A, z / L), C2 = lerp(Cc, B, z / L);
    if (k < 1) {
      f.poly([A, B, Cc], { draw: s0, fill: C.paper });
      [[A, B], [B, Cc], [Cc, A]].forEach(([u, v]) => dimLen(f, u, v, `${L}cm`, { away: G, off: 20, opacity: s0 }));
    } else {
      f.poly([A1, B1, B2, C2, C1, A2], { fill: C.paper, stroke: "none" });
      f.seg(A1, B1).seg(B2, C2).seg(C1, A2);
      const corner = (V, P1, P2, len, cutT, ta, tb) => {
        const off = mul(unit(sub(V, G)), 36 * tb);
        f.poly([V, P1, P2].map((q) => add(q, off)), { fill: C.paper, stroke: "none", opacity: 1 - 0.75 * tb });
        if (tb > 0) f.poly([V, P1, P2].map((q) => add(q, off)), { fill: "none", stroke: C.soft, w: 1.4, dash: "4 4", opacity: (1 - 0.5 * tb) * (1 - s4) });
        f.seg(P1, P2, { stroke: C.soft, w: 2, dash: "5 5", grow: cutT, opacity: cutT > 0 ? 1 - ta : 0 });
        const hl = ta > 0 ? C.red : C.ink;
        f.seg(add(V, off), add(P1, off), { stroke: hl, w: ta > 0 ? 3.4 : 2.4, opacity: (1 - 0.7 * tb) * (1 - s4) });
        let th = dirDeg(P2, P1) - dirDeg(P2, V);
        th = ((th % 360) + 540) % 360 - 180;
        const Vr = rot(V, P2, th * ta);
        f.seg(P2, Vr, { stroke: ta >= 1 ? C.green : hl, w: ta > 0 ? 3.4 : 2.4 });
        const tri = [V, P1, P2].map((q) => add(q, off));
        f.ticks(tri[0], tri[1], { opacity: cutT * (1 - tb), color: C.orange, len: 7 }).ticks(tri[0], tri[2], { opacity: cutT * (1 - tb), color: C.orange, len: 7 }).ticks(tri[1], tri[2], { opacity: cutT * (1 - tb), color: C.orange, len: 7 });
        // 잘라 낼 조각의 한 변(바깥 변에 호) → 떼어 내면 「− 길이」로 바뀐다
        dimLen(f, tri[0], tri[1], `${len}`, { away: G, off: 24, color: "#b35f00", opacity: cutT * (1 - tb) * (1 - s4) });
        f.label(add(add(V, off), mul(unit(sub(V, G)), 22)), `− ${len}`, { color: C.red, size: 16, opacity: tb * (1 - s4) });
      };
      corner(A, A1, A2, x, s1, phase(k, 2, 0, 0.55), phase(k, 2, 0.6, 1));
      const c3 = phase(k, 3, 0, 0.3), a3 = phase(k, 3, 0.3, 0.7), b3 = phase(k, 3, 0.72, 1);
      corner(B, B2, B1, y, c3, a3, b3);
      corner(Cc, C1, C2, z, c3, a3, b3);
      if (s4 > 0) {
        f.poly([A1, B1, B2, C2, C1, A2], { fill: C.greenSoft, stroke: "none", opacity: s4 * 0.6 });
        [[A1, B1, L - x - y], [B2, C2, L - y - z], [C1, A2, L - z - x]].forEach(([u, v, t]) => dimLen(f, u, v, String(t), { away: G, off: 18, opacity: s4 }));
        [[A1, A2, x], [B1, B2, y], [C1, C2, z]].forEach(([u, v, t]) => dimLen(f, u, v, String(t), { away: G, off: 16, color: C.green, opacity: s4 }));
      }
    }
    // 둘레 장부
    const nx = 452;
    f.note(P(nx, 70), `처음 둘레 ${3 * L}`, { anchor: "start", size: 18, opacity: s0 });
    f.note(P(nx, 106), `− ${x}`, { anchor: "start", size: 18, color: C.red, opacity: phase(k, 2, 0.6, 1) });
    f.note(P(nx, 142), `− ${y}  − ${z}`, { anchor: "start", size: 18, color: C.red, opacity: phase(k, 3, 0.72, 1) });
    f.note(P(nx, 184), `= ${p.fin}cm`, { anchor: "start", size: 24, color: C.green, opacity: s4 });
  },
};

// ── 8. 별 모양 다섯 꼭지각의 합: 나비각으로 옮기기 ─────────────────
const star = {
  id: "star-butterfly",
  unit: U4,
  title: "별 모양의 다섯 꼭지각을 모으면 왜 180°일까",
  vary: "다른 별로",
  params(seed) {
    const J = pick([
      [[0, 1], [0, 1], [0, 1], [0, 1], [0, 1]],
      [[8, 1], [-6, 0.92], [10, 1], [-4, 0.88], [6, 0.95]],
      [[-10, 0.95], [12, 1], [-8, 0.9], [6, 1], [-12, 0.92]],
      [[5, 0.9], [14, 0.95], [-5, 1], [-14, 0.95], [0, 0.86]],
    ], seed);
    const O = P(320, 212), R = 172;
    const ang = J.map(([da], i) => 90 - 72 * i + da);
    const T = J.map(([, dr], i) => polar(O, R * dr, ang[i]));
    const X = meet(T[1], T[3], T[2], T[4]);
    const tip = T.map((v, i) => angleAt(v, T[(i + 2) % 5], T[(i + 3) % 5]));
    const rd = tip.map(Math.round), big = rd.indexOf(Math.max(...rd));
    rd[big] += 180 - rd.reduce((s, v) => s + v, 0);
    const w5 = Math.round(angleAt(T[2], X, T[3])), w6 = rd[1] + rd[4] - w5;
    return { O, R, ang, T, X, rd, w5, w6, dr: J.map(([, d]) => d) };
  },
  scenes: [
    { say: "다섯 꼭짓점이 있는 별 모양이에요. 모양이 삐뚤빼뚤해도 다섯 꼭지각 ㉠ + ㉡ + ㉢ + ㉣ + ㉤은 늘 같을까요?", line: "별의 다섯 꼭지각의 합을 구한다", ms: 1800 },
    { say: "두 곧은 선 ㄴㄹ과 ㄷㅁ이 점 ㅂ에서 엇갈려요. 마주 보는 두 각(맞꼭지각)은 크기가 같아요.", line: "ㅂ에서 마주 보는 두 각 ●는 같다(맞꼭지각)", why: "둘 다 곧은 선 180°에서 사이에 낀 같은 각을 뺀 나머지", ms: 2400 },
    { say: "ㄷ과 ㄹ을 이으면 나비 모양이 생겨요. 위 날개 삼각형 ㅂㄴㅁ과 아래 날개 삼각형 ㅂㄷㄹ은 같은 ●를 하나씩 가지고 있어요.", line: "나비각: ㉡ + ㉤ = ㉥ + ㉦", why: "두 날개 삼각형 모두 세 각의 합 180°에서 같은 ●를 뺀 나머지", ms: 2600 },
    { say: "그러니 ㉡과 ㉤을 아래 날개의 ㉥과 ㉦으로 바꿔 놓아도 합은 그대로예요.", line: "㉡ + ㉤ 대신 ㉥ + ㉦을 센다", why: "앞 장면의 나비각 — 두 합이 같다", ms: 2600 },
    { say: "이제 다섯 각이 큰 삼각형 ㄱㄷㄹ 안에 모였어요. ㄱ에는 ㉠, ㄷ에는 ㉢ + ㉥, ㄹ에는 ㉣ + ㉦. 삼각형의 세 각이니 합은 180°예요. 「다른 별로」 눌러 확인해 보세요.", line: "㉠ + ㉡ + ㉢ + ㉣ + ㉤ = 삼각형 ㄱㄷㄹ의 세 각 = 180°", why: "ㄱ = ㉠, ㄷ = ㉢ + ㉥, ㄹ = ㉣ + ㉦ · 삼각형 세 각의 합 180°", ms: 2000 },
  ],
  draw(f, k, p) {
    const { O, R, ang, T, X, rd, w5, w6, dr } = p;
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3), s4 = phase(k, 4);
    const op = clamp(s0 * 2 - 1);
    // 날개
    if (s2 > 0) {
      f.poly([X, T[1], T[4]], { fill: C.greenSoft, stroke: "none", opacity: s2 * (1 - s4) * 0.9 });
      f.poly([X, T[2], T[3]], { fill: C.blueSoft, stroke: "none", opacity: s2 * (1 - s4) * 0.9 });
    }
    if (s4 > 0) f.poly([T[0], T[2], T[3]], { fill: C.orangeSoft, stroke: "none", opacity: s4 * 0.7 });
    for (let i = 0; i < 5; i += 1) f.seg(T[i], T[(i + 2) % 5], { grow: clamp(s0 * 1.5 - i * 0.12), w: 2.4 });
    f.seg(T[2], T[3], { stroke: C.blue, w: 2.2, dash: "7 6", opacity: s2 });
    // 엇갈리는 두 선
    const lo = s1 * (1 - s2 * 0.6) * (1 - s4);
    f.seg(T[1], T[3], { stroke: C.teal, w: 4, opacity: lo }).seg(T[2], T[4], { stroke: C.teal, w: 4, opacity: lo });
    const vo = s1 * (1 - s4);
    f.arc(X, T[1], T[4], { r: 22, color: C.teal, opacity: vo, label: "●", labelR: 36, size: 13 });
    f.arc(X, T[3], T[2], { r: 22, color: C.teal, opacity: vo, label: "●", labelR: 36, size: 13 });
    // 꼭지각
    const cols = [C.red, C.green, C.blue, C.purple, C.orange], names = ["㉠", "㉡", "㉢", "㉣", "㉤"];
    for (let i = 0; i < 5; i += 1) {
      const fade = i === 1 || i === 4 ? 1 - 0.75 * s3 : 1;
      f.arc(T[i], T[(i + 2) % 5], T[(i + 3) % 5], { r: 30, color: cols[i], opacity: op * fade, label: names[i], labelR: 48, size: 16 });
    }
    // 아래 날개 두 각
    f.arc(T[2], X, T[3], { r: 30, color: C.teal, opacity: s2, label: "㉥", labelR: 46, size: 15 });
    f.arc(T[3], X, T[2], { r: 30, color: C.teal, opacity: s2, label: "㉦", labelR: 46, size: 15 });
    // ㉡, ㉤이 ㅂ을 지나 아래 날개로
    if (s3 > 0 && s3 < 1) {
      const path = (a, b, t) => (t < 0.5 ? lerp(a, X, t * 2) : lerp(X, b, t * 2 - 1));
      f.label(path(T[1], T[2], s3), "㉡", { color: C.green, size: 18, opacity: Math.sin(s3 * Math.PI) });
      f.label(path(T[4], T[3], s3), "㉤", { color: C.orange, size: 18, opacity: Math.sin(s3 * Math.PI) });
    }
    if (s3 > 0) bottomNote(f, `㉡ + ㉤ = ${rd[1]}° + ${rd[4]}° = ${w5}° + ${w6}° = ㉥ + ㉦`, { opacity: s3 * (1 - phase(k, 4, 0, 0.35)), size: 17 });
    if (s4 > 0) {
      f.poly([T[0], T[2], T[3]], { fill: "none", stroke: C.orange, w: 4, opacity: s4 });
      bottomNote(f, `${rd.join("° + ")}° = 180°`, { opacity: phase(k, 4, 0.35, 1), size: 19, color: "#b35f00" });
    }
    ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ"].forEach((t, i) => f.label(polar(O, R * dr[i] + 22, ang[i]), t, { opacity: s0 }));
    f.label(add(X, P(26, 2)), "ㅂ", { opacity: s1 * (1 - s4), size: 16 });
  },
};

export const PROOFS = [stair, squareFifth, octagon, fib, ratioRects, sticks, hexCut, star];
