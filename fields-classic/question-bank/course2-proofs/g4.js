// 2과정 G4 「도형의 복원과 측정」 그림 논증 — 본책 1단원(특수각과 도형의 복원)·2단원(평행선과 색종이 접기)·
// 3단원(평면도형의 넓이)·4단원(평면도형의 둘레)의 「왜 반드시 그런가」.
// 본책은 활동에서 각을 재고 길이를 구해 확인한다. 여기서는 접기·평행선·옮기기를 근거로 한 줄씩 쌓고,
// 「다른 …으로」를 눌러 크기·방향·모양이 달라도 같은 논증이 통한다는 것(일반화)을 본다. 그림 도구는 proof-board.js.
// 엇각은 G4 전체에서 같은 몸짓으로 보인다: 각을 가로지르는 선을 따라 밀어 올리고(동위각) 반 바퀴 돌린다(맞꼭지각).
import { C, P, add, sub, mul, lerp, mid, dirDeg, polar, rot, fold, angleAt, clamp, phase } from "../proof-board.js";

const U1 = "1단원 · 특수각과 도형의 복원";
const U2 = "2단원 · 평행선과 색종이 접기";
const U3 = "3단원 · 평면도형의 넓이";
const U4 = "4단원 · 평면도형의 둘레";
const RAD = Math.PI / 180;
const pick = (list, seed) => list[seed % list.length];
const bottomNote = (f, text, o = {}) => f.note(P(320, 414), text, o);
// 두 방향 사이의 작은 쪽 부채꼴(시작 방향과 벌어진 각)
function minorArc(d1, d2) {
  let span = ((d2 - d1) % 360 + 360) % 360, start = d1;
  if (span > 180) { start = d2; span = 360 - span; }
  return { start, span };
}
// 부채꼴을 점들로(접을 때 점마다 뒤집으려고)
function wedgePts(v, start, span, r) {
  const n = Math.max(2, Math.ceil(span / 6)), pts = [v];
  for (let i = 0; i <= n; i += 1) pts.push(polar(v, r, start + (span * i) / n));
  return pts;
}
// 좁은 각은 이름을 더 멀리(두 변에 글자가 걸치지 않게)
const lr = (span, r = 34) => clamp(14 / Math.sin((Math.max(span, 4) / 2) * RAD), r + 17, 120);
// 평행 표시(선 위의 작은 꺾쇠)
function chevron(f, p, deg, { color = C.ink, opacity = 1 } = {}) {
  f.path([polar(p, 9, deg + 150), p, polar(p, 9, deg - 150)], { stroke: color, w: 2.2, opacity });
}

// ── 1. 정사각형 색종이 접기: 60° · 30° · 75° · 15° ─────────────────
const squareFold = {
  id: "square-equilateral",
  unit: U1,
  title: "정사각형 색종이를 접으면 왜 60°·30°·75°·15°가 생길까",
  vary: "다른 크기·방향으로",
  params(seed) {
    const c = pick([{ s: 300, rot: 0 }, { s: 270, rot: 180 }, { s: 290, rot: 90 }, { s: 260, rot: 270 }, { s: 280, rot: 0 }], seed);
    const O = P(235, 215), h = c.s / 2;
    return {
      ...c, O, h,
      A: P(O.x - h, O.y - h), B: P(O.x - h, O.y + h), C: P(O.x + h, O.y + h), D: P(O.x + h, O.y - h),
      P: P(O.x, O.y + h - c.s * Math.sin(60 * RAD)), Q: P(O.x - h + c.s * Math.tan(15 * RAD), O.y - h),
      M1: P(O.x, O.y - h), M2: P(O.x, O.y + h),
    };
  },
  scenes: [
    { say: "정사각형 색종이 ㄱㄴㄷㄹ을 반으로 접었다 펴서 가운데에 접는 선을 만들어요.", line: "가운데 접는 선 위의 점은 ㄴ과 ㄷ에서 거리가 같다", why: "반으로 접으면 ㄴ이 ㄷ에 꼭 포개진다", ms: 2000 },
    { say: "ㄴ을 지나는 선으로 접어서, 꼭짓점 ㄱ이 가운데 접는 선에 닿게 해요. 닿은 점을 ㅁ이라고 해요.", line: "ㄴㅁ = ㄴㄱ = 정사각형의 한 변", why: "접어서 포개진 변은 길이가 같다", ms: 2600 },
    { say: "다시 펴고 ㅁ을 ㄴ, ㄷ과 이어요. 세 변의 길이를 따져 봐요.", line: "ㅁㄴ = ㅁㄷ = ㄴㄷ", why: "ㅁ은 가운데 접는 선 위 → ㅁㄴ = ㅁㄷ, ㄴㄷ도 한 변", ms: 2400 },
    { say: "세 변이 모두 같으니 삼각형 ㅁㄴㄷ은 정삼각형이에요. 세 각도 모두 같아요.", line: "㉠ = 180° ÷ 3 = 60°", why: "정삼각형은 세 각이 같다 · 세 각의 합은 180°", ms: 2000 },
    { say: "ㄴ의 직각에서 60°를 빼면 ㉡이에요. 삼각형 ㄱㄴㅁ은 ㄴㄱ = ㄴㅁ인 이등변삼각형이라 두 밑각이 같아요.", line: "㉡ = 90° − 60° = 30°, ㉢ = (180° − 30°) ÷ 2 = 75°", why: "ㄴㄱ = ㄴㅁ(장면 2) → 이등변삼각형의 두 밑각은 같다", ms: 2600 },
    { say: "ㄱ의 직각에서 ㉢을 빼면 ㉣이에요. 「다른 크기·방향으로」를 눌러 보세요. 각은 늘 그대로예요.", line: "㉣ = 90° − 75° = 15° — 크기·방향이 달라도 늘 같다", why: "길이 값은 하나도 쓰지 않고 「같은 길이」와 직각만 썼다", ms: 1800 },
  ],
  draw(f, k, p) {
    const T = (q) => rot(q, p.O, p.rot);
    const A = T(p.A), B = T(p.B), Cc = T(p.C), D = T(p.D), Pp = T(p.P), Q = T(p.Q), M1 = T(p.M1), M2 = T(p.M2);
    const s0 = phase(k, 0), cg = phase(k, 1, 0, 0.25), s1 = phase(k, 1, 0.25, 1);
    const s2a = phase(k, 2, 0, 0.35), s2b = phase(k, 2, 0.35, 1), s3 = phase(k, 3), s4 = phase(k, 4), s5 = phase(k, 5);
    const fl = s1 * (1 - s2a);
    if (fl <= 0.001) f.poly([A, B, Cc, D], { draw: s0 });
    else { f.poly([A, B, Q], { fill: "none", stroke: C.soft, w: 1.5, dash: "5 5" }); f.poly([Q, B, Cc, D]); }
    f.seg(M1, M2, { stroke: C.soft, w: 2, dash: "6 6", grow: clamp(s0 * 2 - 1) });
    if (s4 > 0) f.poly([A, B, Pp], { fill: C.orangeSoft, stroke: "none", opacity: s4 * 0.9 });
    if (fl > 0.001) f.poly([A, B, Q].map((q) => fold(q, B, Q, fl)), { fill: fl > 0.5 ? C.back : C.paper });
    f.seg(B, Q, { stroke: C.orange, w: 2.2, dash: "8 6", grow: cg, opacity: cg > 0 ? 1 - s3 : 0 });
    // 정삼각형
    f.seg(B, Pp, { stroke: C.purple, w: 3, grow: s2b, opacity: s2b > 0 ? 1 : 0 });
    f.seg(Cc, Pp, { stroke: C.purple, w: 3, grow: s2b, opacity: s2b > 0 ? 1 : 0 });
    f.ticks(B, Pp, { opacity: s2b, color: C.purple }).ticks(Pp, Cc, { opacity: s2b, color: C.purple }).ticks(B, Cc, { opacity: s2b, color: C.purple });
    f.dot(Pp, { opacity: clamp(s1 * 6 - 5), fill: C.purple });
    f.arc(B, Cc, Pp, { r: 34, color: C.green, label: "㉠", opacity: s3 });
    f.arc(Cc, B, Pp, { r: 30, color: C.green, opacity: s3 * 0.55 });
    f.arc(Pp, B, Cc, { r: 26, color: C.green, opacity: s3 * 0.55 });
    // 이등변삼각형 ㄱㄴㅁ
    f.seg(A, Pp, { w: 2.6, grow: s4, opacity: s4 > 0 ? 1 : 0 });
    f.ticks(A, B, { opacity: s4, color: C.purple });
    f.arc(B, Pp, A, { r: 34, color: C.blue, label: "㉡", opacity: s4 });
    f.arc(A, B, Pp, { r: 34, color: C.red, label: "㉢", opacity: s4 });
    f.arc(A, Pp, D, { r: 56, color: C.teal, label: "㉣", labelR: 118, opacity: s5 });
    // 꼭짓점 이름(펼친 종이 기준 자리)
    const lab = (q, dx, dy, t, o = {}) => f.label(T(P(q.x + dx, q.y + dy)), t, o);
    lab(p.A, -18, -16, "ㄱ", { opacity: 1 - fl }); lab(p.B, -18, 16, "ㄴ"); lab(p.C, 18, 16, "ㄷ"); lab(p.D, 18, -16, "ㄹ");
    lab(p.P, 0, -22, "ㅁ", { opacity: clamp(s1 * 6 - 5), color: C.purple });
    const x = 418;
    f.note(P(x, 120), "㉠ = 60°", { anchor: "start", color: C.green, opacity: s3 });
    f.note(P(x, 170), "㉡ = 30°", { anchor: "start", color: C.blue, opacity: s4 });
    f.note(P(x, 220), "㉢ = 75°", { anchor: "start", color: C.red, opacity: s4 });
    f.note(P(x, 270), "㉣ = 15°", { anchor: "start", color: C.teal, opacity: s5 });
  },
};

// ── 2. 삼각자: 30°를 마주 보는 변은 왜 빗변의 반일까 ───────────────
const setSquare = {
  id: "set-square-half",
  unit: U1,
  title: "삼각자의 짧은 변은 왜 빗변의 반일까",
  vary: "다른 크기로",
  params(seed) {
    const c = pick([{ L: 10, px: 300, flip: false }, { L: 8, px: 270, flip: true }, { L: 12, px: 310, flip: false }, { L: 6, px: 250, flip: true }], seed);
    const y = 212, ac = c.px / 2, bc = (c.px * Math.sqrt(3)) / 2, sg = c.flip ? -1 : 1, cx = c.flip ? 230 : 410;
    return { ...c, sg, C: P(cx, y), B: P(cx - sg * bc, y), A: P(cx, y - ac), A2: P(cx, y + ac) };
  },
  scenes: [
    { say: (p) => `직각삼각형 모양 삼각자 ㄱㄴㄷ이에요. ㄷ이 직각, ㄴ이 30°예요. 빗변 ㄱㄴ이 ${p.L}cm일 때, 짧은 변 ㄱㄷ은 몇 cm일까요?`, line: "각 ㄷ = 90°, 각 ㄴ = 30° → 각 ㄱ = 60°", why: "세 각의 합은 180°", ms: 2000 },
    { say: "변 ㄴㄷ을 접는 선으로 삼각자를 뒤집어 한 장 더 붙여요. 뒤집힌 ㄱ의 자리를 ㄹ이라고 해요.", line: "삼각형 ㄹㄴㄷ은 ㄱㄴㄷ과 꼭 같다", why: "뒤집어도 변의 길이와 각의 크기는 그대로", ms: 2400 },
    { say: "ㄷ에서 직각 두 개가 나란히 붙었어요.", line: "ㄱ, ㄷ, ㄹ은 한 직선 위에 있다", why: "90° + 90° = 180° = 곧은 선", ms: 2000 },
    { say: "큰 삼각형 ㄱㄴㄹ의 세 각을 봐요. ㄴ에서는 30°가 두 번 모였어요.", line: "각 ㄴ = 30° + 30° = 60°, 각 ㄱ = 각 ㄹ = 60° → 정삼각형", why: "세 각이 모두 같은 삼각형은 세 변도 모두 같다", ms: 2400 },
    { say: "ㄷ은 ㄱㄹ을 똑같이 둘로 나눠요. 그리고 ㄱㄹ은 정삼각형의 한 변이라 빗변 ㄱㄴ과 같아요.", line: (p) => `ㄱㄷ = ㄱㄹ ÷ 2 = ㄱㄴ ÷ 2 = ${p.L} ÷ 2 = ${p.L / 2}cm`, why: "ㄷㄱ = ㄷㄹ(뒤집어 생긴 짝) · ㄱㄹ = ㄱㄴ(정삼각형)", ms: 2400 },
    { say: "「다른 크기로」를 눌러 보세요. 크기가 달라도 삼각자 두 장은 늘 정삼각형을 만들어요.", line: "30°를 마주 보는 변 = 빗변 ÷ 2", why: "30°·60°·90° 삼각자는 정삼각형을 반으로 자른 것", ms: 1600 },
  ],
  draw(f, k, p) {
    const { A, B, A2, sg } = p, Cc = p.C;
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3), s4 = phase(k, 4), s5 = phase(k, 5);
    const Am = fold(A, B, Cc, s1);
    if (s1 > 0) f.poly([Am, B, Cc], { fill: s1 > 0.5 ? C.back : C.paper });
    f.poly([A, B, Cc], { draw: s0 });
    f.right(Cc, A, B, { opacity: s0 });
    if (s1 > 0.98) f.right(Cc, A2, B, { opacity: 1 });
    const op = clamp(s0 * 2 - 1);
    f.arc(B, Cc, A, { r: 46, color: C.red, label: "30°", labelR: 68, opacity: op });
    f.arc(A, B, Cc, { r: 30, color: C.blue, label: "60°", labelR: 52, opacity: op });
    if (s1 > 0) {
      f.arc(B, Cc, Am, { r: 46, color: C.red, label: s1 > 0.9 ? "30°" : "", labelR: 68, opacity: 1 });
      f.arc(Am, B, Cc, { r: 30, color: C.blue, label: s1 > 0.9 ? "60°" : "", labelR: 52 });
    }
    f.seg(A, A2, { stroke: C.orange, w: 4.5, grow: s2, opacity: s2 > 0 ? 0.85 * (1 - s5 * 0.3) : 0 });
    // 정삼각형
    if (s3 > 0) {
      f.arc(B, A2, A, { r: 92, color: C.purple, fillOpacity: 0.1, opacity: s3 });
      f.note(P(p.flip ? 24 : 452, 320), "30° + 30° = 60°", { anchor: "start", color: C.purple, size: 19, opacity: s3 });
      f.ticks(A, B, { n: 2, opacity: s3, color: C.purple }).ticks(B, A2, { n: 2, opacity: s3, color: C.purple });
    }
    f.ticks(A, Cc, { opacity: s4, color: C.orange }).ticks(Cc, A2, { opacity: s4, color: C.orange });
    // 길이
    const m = mid(A, B), out = sub(m, Cc), ol = Math.hypot(out.x, out.y);
    f.label(add(m, mul(out, 36 / ol)), `${p.L}cm`, { size: 18 });
    f.label(P(Cc.x + sg * 34, (A.y + Cc.y) / 2), s4 > 0.5 ? `${p.L / 2}cm` : "?", { size: 18, color: s4 > 0.5 ? "#b35f00" : C.ink });
    f.label(add(A, P(0, -20)), "ㄱ").label(add(B, P(-sg * 20, 0)), "ㄴ").label(add(Cc, P(sg * 16, 16)), "ㄷ");
    f.label(add(A2, P(0, 22)), "ㄹ", { opacity: clamp(s1 * 4 - 3) });
    if (s5 > 0) bottomNote(f, "30°를 마주 보는 변 = 빗변 ÷ 2", { opacity: s5 });
  },
};

// ── 3. 평행선으로 따지는 삼각형 세 각의 합 ─────────────────────
const parallelSum = {
  id: "parallel-triangle-sum",
  unit: U2,
  title: "평행선으로 따지면 삼각형의 세 각은 왜 180°일까",
  vary: "다른 삼각형으로",
  params(seed) {
    const s = pick([{ ax: 250, ay: 140 }, { ax: 400, ay: 160 }, { ax: 180, ay: 170 }, { ax: 330, ay: 130 }, { ax: 470, ay: 150 }], seed);
    const B = P(90, 350), Cc = P(550, 350), A = P(s.ax, s.ay);
    const bR = angleAt(B, A, Cc), cR = angleAt(Cc, A, B), b = Math.round(bR), c = Math.round(cR);
    return { A, B, C: Cc, bR, cR, b, c, a: 180 - b - c };
  },
  scenes: [
    { say: "삼각형 ㄱㄴㄷ의 세 각 ㉠, ㉡, ㉢. 이번에는 접지 않고 평행선으로 따져 봐요.", line: "세 각 ㉠ + ㉡ + ㉢ = ?", ms: 1600 },
    { say: "꼭짓점 ㄱ을 지나고 밑변 ㄴㄷ과 평행한 직선 가를 그어요.", line: "직선 가 ∥ 밑변 ㄴㄷ", why: "보조선: 각을 옮겨 놓을 자리를 만든다", ms: 2000 },
    { say: "㉡을 변 ㄴㄱ을 따라 ㄱ까지 그대로 밀어 올려요. ㉢도 변 ㄷㄱ을 따라 올려요. 두 평행선에 꼭 맞아요.", line: "밀어 올린 ㉡, ㉢은 ㄱ에서의 동위각", why: "평행한 두 직선을 한 직선이 지나가면 동위각은 같다", ms: 2800 },
    { say: "올린 각을 ㄱ을 중심으로 반 바퀴 돌려요. 마주 보는 각이라 크기가 그대로예요.", line: "㉡, ㉢이 삼각형 바로 옆(엇각 자리)으로 온다", why: "맞꼭지각은 같다 → 엇각 = 동위각", ms: 2600 },
    { say: "직선 가 위에 ㉡, ㉠, ㉢이 빈틈도 겹침도 없이 나란히 놓였어요.", line: "㉡ + ㉠ + ㉢ = 곧은 선 = 180°", why: "한 점에서 곧은 선을 이루는 각은 반 바퀴", ms: 2000 },
    { say: (p) => `이 삼각형은 ${p.b}° + ${p.a}° + ${p.c}° = 180°. 「다른 삼각형으로」를 눌러 보세요. 같은 까닭으로 늘 180°예요.`, line: "어떤 삼각형도 세 각의 합은 180°", why: "어느 삼각형이든 꼭짓점을 지나는 평행선을 그을 수 있다", ms: 1400 },
  ],
  draw(f, k, p) {
    const { A, B, bR, cR } = p, Cc = p.C;
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3), s4 = phase(k, 4);
    f.seg(P(30, B.y), P(610, B.y), { stroke: C.soft, w: 1.6, opacity: s1 });
    f.seg(P(30, A.y), P(610, A.y), { stroke: C.purple, w: 2.6, grow: s1, opacity: s1 > 0 ? 1 : 0 });
    chevron(f, P(596, A.y), 0, { color: C.purple, opacity: clamp(s1 * 4 - 3) }); chevron(f, P(596, B.y), 0, { color: C.soft, opacity: clamp(s1 * 4 - 3) });
    f.label(P(44, A.y - 18), "가", { color: C.purple, opacity: s1 });
    if (s4 > 0) f.seg(P(30, A.y), P(610, A.y), { stroke: C.orange, w: 5, opacity: s4 * 0.6 });
    f.poly([A, B, Cc], { draw: s0 });
    const op = clamp(s0 * 2 - 1);
    // 늘인 변(동위각의 팔)
    const ext = s2 * (1 - s4);
    f.seg(A, polar(A, 86, dirDeg(B, A)), { stroke: C.soft, w: 2, dash: "6 5", grow: s2, opacity: ext });
    f.seg(A, polar(A, 86, dirDeg(Cc, A)), { stroke: C.soft, w: 2, dash: "6 5", grow: s2, opacity: ext });
    f.arc(A, B, Cc, { r: 34, color: C.red, label: "㉠", opacity: op });
    // 원래 자리(옮기기 시작하면 흐리게)
    const ghost = s2 > 0 ? 0.3 : 1;
    f.wedge(B, 0, bR, { r: 34, color: C.green, label: ghost === 1 ? "㉡" : "", labelR: lr(bR), opacity: op * ghost });
    f.wedge(Cc, 180 - cR, cR, { r: 34, color: C.blue, label: ghost === 1 ? "㉢" : "", labelR: lr(cR), opacity: op * ghost });
    if (s2 > 0) {
      const th = 180 * s3;
      f.wedge(lerp(B, A, s2), th, bR, { r: 34, color: C.green, label: "㉡", labelR: lr(bR), fillOpacity: 0.4 });
      f.wedge(lerp(Cc, A, s2), 180 - cR + th, cR, { r: 34, color: C.blue, label: "㉢", labelR: lr(cR), fillOpacity: 0.4 });
    }
    f.label(add(A, P(0, -22)), "ㄱ", { opacity: s2 === 0 ? 1 : s4 });
    f.label(add(B, P(-18, 10)), "ㄴ").label(add(Cc, P(18, 10)), "ㄷ");
    if (s4 > 0) bottomNote(f, `㉡ ${p.b}° + ㉠ ${p.a}° + ㉢ ${p.c}° = 180°`, { opacity: s4 });
  },
};

// ── 4. 번개각: 평행선 사이 꺾인 각 = 양쪽 각의 합 ─────────────────
const zigzag = {
  id: "zigzag-angle",
  unit: U2,
  title: "평행선 사이에서 꺾인 각은 왜 두 각의 합일까",
  vary: "다른 꺾임으로",
  params(seed) {
    const base = [
      { U: P(340, 110), V: P(190, 220), W: P(360, 340) },
      { U: P(300, 110), V: P(200, 260), W: P(410, 340) },
      { U: P(390, 110), V: P(250, 190), W: P(330, 340) },
    ];
    const c = pick([{ i: 0, m: 0 }, { i: 1, m: 1 }, { i: 2, m: 0 }, { i: 0, m: 1 }, { i: 1, m: 0 }], seed);
    const mir = (q) => (c.m ? P(640 - q.x, q.y) : q);
    const { U, V, W } = base[c.i];
    const u = mir(U), v = mir(V), w = mir(W), hd = c.m ? 0 : 180;
    const aR = angleAt(u, polar(u, 50, hd), v), bR = angleAt(w, polar(w, 50, hd), v);
    const a = Math.round(aR), b = Math.round(bR);
    return { U: u, V: v, W: w, hd, m: c.m, a, b, c: a + b, wa: minorArc(hd, dirDeg(u, v)), wb: minorArc(hd, dirDeg(w, v)) };
  },
  scenes: [
    { say: "두 직선 가와 나는 평행해요. 그 사이에서 꺾인 선의 각 ㉢은 ㉠, ㉡과 어떤 사이일까요?", line: (p) => `가 ∥ 나, ㉠ = ${p.a}°, ㉡ = ${p.b}°, ㉢ = ?`, ms: 1800 },
    { say: "꺾인 점을 지나고 가, 나와 평행한 직선 다를 그어요. ㉢이 위아래 두 조각으로 나뉘어요.", line: "보조선 다 ∥ 가 ∥ 나", why: "평행선을 하나 더 그으면 꺾인 각이 둘로 나뉜다", ms: 2000 },
    { say: "㉠을 꺾인 선을 따라 꺾인 점까지 밀고, 반 바퀴 돌려요. 위쪽 조각에 꼭 맞아요.", line: "㉢의 위쪽 조각 = ㉠", why: "가 ∥ 다 → 엇각은 같다(밀면 동위각, 반 바퀴 돌리면 맞꼭지각)", ms: 2800 },
    { say: "㉡도 같은 방법으로 옮기면 아래쪽 조각에 꼭 맞아요.", line: "㉢의 아래쪽 조각 = ㉡", why: "나 ∥ 다 → 엇각은 같다", ms: 2800 },
    { say: (p) => `두 조각을 합하면 ㉢. ${p.a}° + ${p.b}° = ${p.c}°예요.`, line: (p) => `㉢ = ㉠ + ㉡ = ${p.a}° + ${p.b}° = ${p.c}°`, why: "㉢은 두 조각으로 빈틈없이 나뉘었다", ms: 1800 },
    { say: "「다른 꺾임으로」를 눌러 보세요. 꺾인 곳이 어디여도 보조선 하나로 같은 까닭이 통해요.", line: "평행선 사이에서 꺾인 각 = 양쪽 각의 합", why: "꺾인 점마다 평행한 보조선 → 엇각 두 번", ms: 1400 },
  ],
  draw(f, k, p) {
    const { U, V, W, wa, wb, m } = p;
    const s0 = phase(k, 0), s1 = phase(k, 1), s4 = phase(k, 4);
    const slA = phase(k, 2, 0, 0.5), rtA = phase(k, 2, 0.5, 1), slB = phase(k, 3, 0, 0.5), rtB = phase(k, 3, 0.5, 1);
    const L0 = 40, L1 = 600;
    f.seg(P(L0, U.y), P(L1, U.y), { w: 2.4, grow: s0 }).seg(P(L0, W.y), P(L1, W.y), { w: 2.4, grow: s0 });
    chevron(f, P(L1 - 14, U.y), 0, { opacity: s0 }); chevron(f, P(L1 - 14, W.y), 0, { opacity: s0 });
    const lx = m ? 590 : 50;
    f.label(P(lx, U.y - 18), "가", { opacity: s0 }).label(P(lx, W.y - 18), "나", { opacity: s0 });
    f.seg(P(L0, V.y), P(L1, V.y), { stroke: C.purple, w: 2, dash: "8 6", grow: s1, opacity: s1 > 0 ? 1 : 0 });
    chevron(f, P(L1 - 14, V.y), 0, { color: C.purple, opacity: clamp(s1 * 4 - 3) });
    f.label(P(lx, V.y - 18), "다", { color: C.purple, opacity: s1 });
    f.path([U, V, W], { w: 3, draw: s0 });
    // ㉢(꺾인 각)
    const cw = minorArc(dirDeg(V, U), dirDeg(V, W));
    f.wedge(V, cw.start, cw.span, { r: 66, color: C.purple, fillOpacity: 0.1, opacity: clamp(s0 * 2 - 1) });
    let md = cw.start + cw.span / 2;
    const off = ((md - (m ? 180 : 0)) % 360 + 540) % 360 - 180;
    if (Math.abs(off) < 16) md += off >= 0 ? 18 : -18;
    f.label(polar(V, 110, md), s4 > 0.5 ? `㉢ ${p.c}°` : "㉢", { color: C.purple, opacity: clamp(s0 * 2 - 1), size: 18 });
    // 원래 자리의 ㉠ ㉡
    const op = clamp(s0 * 2 - 1);
    f.wedge(U, wa.start, wa.span, { r: 34, color: C.red, label: slA > 0 ? "" : "㉠", labelR: lr(wa.span), opacity: op * (slA > 0 ? 0.3 : 1) });
    f.wedge(W, wb.start, wb.span, { r: 34, color: C.blue, label: slB > 0 ? "" : "㉡", labelR: lr(wb.span), opacity: op * (slB > 0 ? 0.3 : 1) });
    if (slA > 0) f.wedge(lerp(U, V, slA), wa.start + 180 * rtA, wa.span, { r: 34, color: C.red, label: "㉠", labelR: lr(wa.span), fillOpacity: 0.45 });
    if (slB > 0) f.wedge(lerp(W, V, slB), wb.start + 180 * rtB, wb.span, { r: 34, color: C.blue, label: "㉡", labelR: lr(wb.span), fillOpacity: 0.45 });
    f.note(P(320, 46), `㉠ = ${p.a}°   ㉡ = ${p.b}°`, { opacity: s0 });
    if (s4 > 0) bottomNote(f, `㉢ = ㉠ + ㉡ = ${p.a}° + ${p.b}° = ${p.c}°`, { opacity: s4, color: C.purple });
  },
};

// ── 5. 종이 테이프 접기: 접으면 이등변삼각형이 생긴다 ───────────────
const tapeFold = {
  id: "tape-fold",
  unit: U2,
  title: "종이 테이프를 접으면 왜 이등변삼각형이 생길까",
  vary: "다른 각으로",
  params(seed) {
    const t = pick([50, 65, 40, 70, 55], seed);
    const top = 160, bot = 300, h = bot - top, Rx = 300;
    const R = P(Rx, bot), Q = P(Rx + h / Math.tan(t * RAD), top);
    const Lr = Math.max(h / Math.sin(2 * t * RAD), h / Math.tan(t * RAD)) + 40, E = Rx + Lr;
    const S = P(Rx + h / Math.tan(2 * t * RAD), top);
    return { t, top, bot, R, Q, S, E, g: 180 - 2 * t };
  },
  scenes: [
    { say: (p) => `긴 직사각형 종이 테이프예요. 위아래 두 변은 평행해요. 접는 선 ㄱㄴ이 아랫변과 ${p.t}°를 이루도록 접으려고 해요.`, line: (p) => `위 변 ∥ 아래 변, 접는 선과 아랫변 사이 ${p.t}°`, ms: 2000 },
    { say: "접는 선을 따라 오른쪽을 접어 올려요. 접기는 뒤집기라, 접는 선 양쪽의 각이 꼭 포개져요.", line: (p) => `각 ㄷㄴㄱ = ${p.t}° (접은 각)`, why: "접기 전 각과 접은 뒤 각은 포개지므로 같다", ms: 2600 },
    { say: "아랫변의 그 각을 접는 선을 따라 ㄱ까지 밀어 올리고 반 바퀴 돌려요. 위 변과 접는 선 사이에 꼭 맞아요.", line: (p) => `각 ㄷㄱㄴ = ${p.t}° (엇각)`, why: "위 변 ∥ 아래 변 → 엇각은 같다", ms: 2800 },
    { say: "겹쳐진 삼각형 ㄱㄴㄷ은 두 각이 같아요. 그래서 두 변 ㄷㄱ과 ㄷㄴ의 길이도 같아요.", line: "삼각형 ㄱㄴㄷ은 이등변삼각형 (ㄷㄱ = ㄷㄴ)", why: "두 각이 같은 삼각형은 반으로 접으면 포개져 두 변이 같다", ms: 2200 },
    { say: (p) => `그래서 ㉠ = 180° − ${p.t}° × 2 = ${p.g}°. 「다른 각으로」를 눌러 보세요. 어떻게 접어도 이등변삼각형이 생겨요.`, line: (p) => `㉠ = 180° − ${p.t}° × 2 = ${p.g}°`, why: "세 각의 합은 180°", ms: 1800 },
  ],
  draw(f, k, p) {
    const { top, bot, R, Q, S, E, t } = p;
    const s0 = phase(k, 0), s1 = phase(k, 1, 0, 0.75), s1b = phase(k, 1, 0.7, 1), s2 = phase(k, 2, 0, 0.5), s2r = phase(k, 2, 0.5, 1), s3 = phase(k, 3), s4 = phase(k, 4);
    const fl = s1;
    const flap = [R, P(E, bot), P(E, top), Q];
    f.poly([P(30, top), Q, R, P(30, bot)], { draw: s0, fill: C.paper });
    if (fl > 0) f.poly(flap, { fill: "none", stroke: C.soft, w: 1.5, dash: "5 5" });
    else f.poly(flap, { draw: s0 });
    // 아랫변의 원래 각(접은 뒤에는 흐린 자리)
    f.wedge(R, 0, t, { r: 40, color: C.green, label: fl > 0 ? "" : `${t}°`, labelR: 60, opacity: clamp(s0 * 2 - 1) * (fl > 0 ? 0.35 : 1) });
    if (fl > 0) {
      f.poly(flap.map((q) => fold(q, R, Q, fl)), { fill: fl > 0.5 ? C.back : C.paper, fillOpacity: 0.92 });
      f.poly(wedgePts(R, 0, t, 40).map((q) => fold(q, R, Q, fl)), { fill: C.green, fillOpacity: 0.3, stroke: C.green, w: 2 });
      f.label(polar(R, 60, t * 1.5), `${t}°`, { color: C.green, opacity: s1b });
    }
    if (s3 > 0) f.poly([Q, R, S], { fill: C.orange, fillOpacity: 0.28, stroke: C.orange, w: 3, opacity: s3 });
    f.seg(R, Q, { stroke: C.orange, w: 2.4, dash: "8 6" });
    // 엇각: 밀어 올리고 반 바퀴
    if (s2 > 0) {
      f.wedge(lerp(R, Q, s2), 180 * s2r, t, { r: 40, color: C.blue, fillOpacity: 0.4 });
      f.label(polar(Q, 60, 180 + t / 2), `${t}°`, { color: C.blue, opacity: s2r });
    }
    f.ticks(S, Q, { opacity: s3, color: C.orange }).ticks(S, R, { opacity: s3, color: C.orange });
    f.arc(S, Q, R, { r: 26, color: C.red, label: "㉠", labelR: 44, opacity: s4 });
    f.label(add(Q, P(22, -14)), "ㄱ").label(add(R, P(0, 20)), "ㄴ").label(add(S, P(-18, 16)), "ㄷ", { opacity: s1b });
    f.note(P(60, 350), "위 변 ∥ 아래 변", { anchor: "start", size: 17, opacity: s0, color: C.soft });
    if (s4 > 0) bottomNote(f, `㉠ = 180° − ${t}° × 2 = ${p.g}°`, { opacity: s4, color: C.red });
  },
};

// ── 6. 삼각형의 넓이: 두 배 → 평행사변형 → 직사각형, 그리고 꼭짓점 옮기기 ──
const triArea = {
  id: "triangle-area",
  unit: U3,
  title: "삼각형의 넓이는 왜 밑변 × 높이 ÷ 2일까",
  vary: "다른 삼각형으로",
  params(seed) {
    const c = pick([{ b: 10, h: 6, ax: 3, ax2: 13 }, { b: 8, h: 8, ax: 5, ax2: -1 }, { b: 12, h: 5, ax: 4, ax2: 14 }, { b: 10, h: 7, ax: 6, ax2: 1 }, { b: 9, h: 6, ax: 2, ax2: 11 }], seed);
    const u = 25, B = P(70, 320);
    const A = P(B.x + c.ax * u, B.y - c.h * u), Cc = P(B.x + c.b * u, B.y), A2 = P(B.x + c.ax2 * u, A.y);
    return { ...c, B, A, C: Cc, A2, D: add(A, sub(Cc, B)), H: P(A.x, B.y), area: c.b * c.h };
  },
  scenes: [
    { say: (p) => `삼각형 ㄱㄴㄷ의 밑변은 ${p.b}cm, 높이는 ${p.h}cm예요. 넓이는 왜 밑변 × 높이 ÷ 2일까요?`, line: (p) => `밑변 ㄴㄷ = ${p.b}cm, 높이 ㄱㅁ = ${p.h}cm`, why: "높이는 꼭짓점에서 밑변에 수직으로 그은 길이", ms: 1800 },
    { say: "똑같은 삼각형을 변 ㄱㄷ의 가운데를 중심으로 반 바퀴 돌려 붙여요.", line: "똑같은 삼각형 두 개 = 평행사변형 ㄱㄴㄷㄹ", why: "반 바퀴 돌리면 마주 보는 변끼리 평행하고 길이가 같다", ms: 2400 },
    { say: "높이 선을 따라 왼쪽 조각을 잘라 오른쪽 끝으로 옮겨요. 직사각형이 돼요.", line: (p) => `평행사변형 = ${p.b} × ${p.h} = ${p.area}㎠`, why: "잘라 옮겨도 넓이는 그대로 · 직사각형은 가로 × 세로", ms: 2600 },
    { say: "처음 삼각형은 이 평행사변형의 꼭 절반이에요.", line: (p) => `삼각형 = ${p.b} × ${p.h} ÷ 2 = ${p.area / 2}㎠`, why: "똑같은 삼각형 두 개로 평행사변형을 만들었다", ms: 2200 },
    { say: "꼭짓점 ㄱ을 밑변과 평행한 선을 따라 옮겨 보세요. 모양은 달라져도 밑변과 높이가 그대로라 넓이도 그대로예요.", line: "꼭짓점을 밑변과 평행하게 옮겨도 넓이는 같다", why: "밑변 × 높이 ÷ 2에서 밑변도 높이도 바뀌지 않는다", ms: 3000 },
  ],
  draw(f, k, p) {
    const { A, B, D, H, A2 } = p, Cc = p.C;
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3), s4 = phase(k, 4);
    const back = 1 - s3;
    const Mac = mid(A, Cc);
    // 돌려 붙인 삼각형
    if (s1 > 0) f.poly([A, B, Cc].map((q) => rot(q, Mac, 180 * s1)), { fill: C.blueSoft, stroke: C.blue, w: 2.2, opacity: back });
    const sl = mul(sub(Cc, B), s2 * back);
    const Ak = lerp(A, A2, s4);
    if (s2 > 0 && back > 0) {
      f.poly([H, Cc, A], { fill: C.orangeSoft, stroke: C.ink, w: 2.4 });
      f.poly([B, H, A].map((q) => add(q, sl)), { fill: C.orangeSoft, stroke: C.orange, w: 2.4 });
    } else f.poly([Ak, B, Cc], { draw: s0, fill: s3 > 0 ? C.orangeSoft : C.paper });
    // 밑변과 평행한 선(꼭짓점이 다니는 길)
    if (s4 > 0) {
      f.seg(P(30, A.y), P(610, A.y), { stroke: C.purple, w: 2, dash: "8 6", opacity: s4 });
      chevron(f, P(596, A.y), 0, { color: C.purple, opacity: s4 });
      const lo = Math.min(B.x, Ak.x), hi = Math.max(Cc.x, Ak.x);
      f.seg(P(lo, B.y), P(hi, B.y), { stroke: C.soft, w: 2, dash: "5 5", opacity: s4 });
    }
    // 높이
    const Hk = P(Ak.x, B.y);
    f.seg(Ak, Hk, { stroke: C.purple, w: 2.2, dash: "7 6", grow: clamp(s0 * 2 - 1), opacity: s0 > 0 ? 1 : 0 });
    f.right(Hk, Ak, Hk.x < Cc.x - 1 ? Cc : B, { color: C.purple, opacity: clamp(s0 * 2 - 1) });
    f.label(P(Hk.x + (Hk.x > Cc.x ? -30 : 30), (Ak.y + Hk.y) / 2), `${p.h}cm`, { color: C.purple, size: 17, opacity: clamp(s0 * 2 - 1) });
    f.label(P((B.x + Cc.x) / 2, B.y + 46), `밑변 ${p.b}cm`, { size: 17 });
    f.label(add(Ak, P(0, -20)), "ㄱ").label(add(B, P(-16, 10)), "ㄴ").label(add(Cc, P(14, 14)), "ㄷ");
    f.label(add(Hk, P(0, 22)), "ㅁ", { color: C.purple, opacity: s2 > 0 && back > 0 ? 0 : 1 });
    f.label(add(D, P(14, -12)), "ㄹ", { opacity: clamp(s1 * 4 - 3) * back });
    f.note(P(320, 390), `평행사변형 = ${p.b} × ${p.h} = ${p.area}㎠`, { opacity: s2 * (1 - s4), size: 19 });
    f.note(P(320, 414), `삼각형 = ${p.b} × ${p.h} ÷ 2 = ${p.area / 2}㎠`, { opacity: s3, size: 19, color: "#b35f00" });
  },
};

// ── 6-2. 사다리꼴의 넓이: 똑같은 사다리꼴을 반 바퀴 돌려 붙이면 평행사변형 ──
const trapArea = {
  id: "trapezoid-area",
  unit: U3,
  title: "사다리꼴의 넓이는 왜 (윗변 + 아랫변) × 높이 ÷ 2일까",
  vary: "다른 사다리꼴로",
  params(seed) {
    const c = pick([{ a: 4, b: 8, h: 6, off: 1.5 }, { a: 3, b: 9, h: 5, off: 4 }, { a: 6, b: 10, h: 6, off: 2 }, { a: 2, b: 8, h: 7, off: 3 }, { a: 5, b: 7, h: 4, off: 0.5 }], seed);
    const u = 30, B = P(56, 300);
    const A = P(B.x + c.off * u, B.y - c.h * u), D = P(A.x + c.a * u, A.y), Cc = P(B.x + c.b * u, B.y);
    return { ...c, u, B, A, D, C: Cc, M: mid(Cc, D), area: ((c.a + c.b) * c.h) / 2 };
  },
  scenes: [
    { say: (p) => `윗변 ${p.a}cm, 아랫변 ${p.b}cm, 높이 ${p.h}cm인 사다리꼴이에요. 윗변과 아랫변은 평행해요. 넓이는 어떻게 구할까요?`, line: (p) => `윗변 ${p.a}cm ∥ 아랫변 ${p.b}cm, 높이 ${p.h}cm`, why: "사다리꼴은 마주 보는 한 쌍의 변이 평행한 사각형", ms: 1800 },
    { say: "똑같은 사다리꼴을 오른쪽 변의 가운데 점을 중심으로 반 바퀴 돌려 붙여요.", line: "돌린 사다리꼴의 아랫변은 위로, 윗변은 아래로 간다", why: "반 바퀴 돌리면 평행한 두 변이 자리를 바꾸고, 두 평행선 위에 그대로 이어진다", ms: 2600 },
    { say: (p) => `두 조각이 빈틈없이 맞물려 평행사변형이 됐어요. 밑변은 아랫변과 윗변을 이은 ${p.a + p.b}cm, 높이는 그대로 ${p.h}cm예요.`, line: (p) => `평행사변형 = (${p.b} + ${p.a}) × ${p.h} = ${(p.a + p.b) * p.h}㎠`, why: "평행사변형의 넓이 = 밑변 × 높이", ms: 2400 },
    { say: "처음 사다리꼴은 이 평행사변형의 꼭 절반이에요.", line: (p) => `사다리꼴 = (${p.a} + ${p.b}) × ${p.h} ÷ 2 = ${p.area}㎠`, why: "똑같은 사다리꼴 두 개로 평행사변형을 만들었다", ms: 2000 },
    { say: "윗변을 점점 줄여 0으로 만들면 사다리꼴이 삼각형이 돼요. 그래도 같은 식이 맞아요: (0 + 아랫변) × 높이 ÷ 2.", line: "윗변이 0이면 삼각형: (0 + 밑변) × 높이 ÷ 2", why: "삼각형의 넓이 공식과 같다 — 사다리꼴 식이 더 넓은 경우를 다 덮는다", ms: 2800 },
  ],
  draw(f, k, p) {
    const { A, B, D, M } = p, Cc = p.C;
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3), s4 = phase(k, 4);
    const top = mid(A, D), A4 = lerp(A, top, s4), D4 = lerp(D, top, s4);
    const copyOp = s4 > 0 ? 0 : 1 - 0.55 * s3;
    if (s1 > 0 && copyOp > 0) {
      const cp = [A, B, Cc, D].map((q) => rot(q, M, 180 * s1));
      f.poly(cp, { fill: C.blueSoft, stroke: C.blue, w: 2.4, opacity: copyOp });
      if (s1 > 0.95) {
        f.label(P((Cc.x + cp[0].x) / 2, B.y + 22), `${p.a}cm`, { color: C.blue, size: 16, opacity: copyOp });
        f.label(P((D.x + cp[1].x) / 2, A.y - 18), `${p.b}cm`, { color: C.blue, size: 16, opacity: copyOp });
      }
    }
    f.poly([A4, B, Cc, D4], { draw: s0, fill: s3 > 0 ? C.orangeSoft : C.paper });
    // 평행 표시
    if (s4 < 1) chevron(f, mid(A4, D4), 0, { opacity: s0 * (1 - s4) });
    chevron(f, mid(B, Cc), 0, { opacity: s0 });
    // 높이
    const H = P(A4.x, B.y);
    f.seg(A4, H, { stroke: C.purple, w: 2.2, dash: "7 6", grow: clamp(s0 * 2 - 1), opacity: s0 > 0 ? 1 : 0 });
    f.right(H, A4, Cc, { color: C.purple, opacity: clamp(s0 * 2 - 1) });
    f.label(P(H.x - 30, (A4.y + H.y) / 2), `${p.h}cm`, { color: C.purple, size: 16, opacity: clamp(s0 * 2 - 1) });
    if (s4 < 1) f.label(P(top.x, A.y - 18), s4 > 0 ? `윗변 ${Math.round(p.a * (1 - s4) * 10) / 10}cm` : `윗변 ${p.a}cm`, { size: 16, opacity: s1 > 0.95 && s4 === 0 ? 0 : 1 });
    else f.label(P(top.x, A.y - 18), "윗변 0", { size: 16 });
    f.label(P((B.x + Cc.x) / 2, B.y + 22), `아랫변 ${p.b}cm`, { size: 16 });
    // 이어진 밑변
    if (s2 > 0 && s4 === 0) {
      const end = P(Cc.x + p.a * p.u, B.y);
      f.seg(P(B.x, B.y + 48), P(end.x, B.y + 48), { stroke: C.orange, w: 3, grow: s2 });
      f.seg(P(B.x, B.y + 40), P(B.x, B.y + 56), { stroke: C.orange, w: 3, opacity: s2 });
      f.seg(P(end.x, B.y + 40), P(end.x, B.y + 56), { stroke: C.orange, w: 3, opacity: s2 });
      f.label(P((B.x + end.x) / 2, B.y + 68), `${p.b} + ${p.a} = ${p.a + p.b}cm`, { color: "#b35f00", size: 16, opacity: s2 });
    }
    f.note(P(320, 390), `평행사변형 = (${p.b} + ${p.a}) × ${p.h} = ${(p.a + p.b) * p.h}㎠`, { opacity: s2 * (1 - s4), size: 18 });
    f.note(P(320, 414), `사다리꼴 = (${p.a} + ${p.b}) × ${p.h} ÷ 2 = ${p.area}㎠`, { opacity: s3 * (1 - s4), size: 18, color: "#b35f00" });
    if (s4 > 0) f.note(P(320, 414), `삼각형 = (0 + ${p.b}) × ${p.h} ÷ 2 = ${(p.b * p.h) / 2}㎠`, { opacity: s4, size: 18, color: "#b35f00" });
  },
};

// ── 6-3. 마름모의 넓이: 대각선으로 잘라 삼각형 두 개 ───────────────
const rhombusArea = {
  id: "rhombus-area",
  unit: U3,
  title: "마름모의 넓이는 왜 두 대각선의 곱 ÷ 2일까",
  vary: "다른 마름모·연 모양으로",
  params(seed) {
    const c = pick([{ p: 10, q1: 3, q2: 3 }, { p: 8, q1: 4, q2: 4 }, { p: 12, q1: 2.5, q2: 2.5 }, { p: 10, q1: 2, q2: 5 }, { p: 9, q1: 3, q2: 5 }], seed);
    const u = 30, O = P(290, 188);
    const L = P(O.x - (c.p * u) / 2, O.y), R = P(O.x + (c.p * u) / 2, O.y), T = P(O.x, O.y - c.q1 * u), Bt = P(O.x, O.y + c.q2 * u);
    const q = c.q1 + c.q2, kite = c.q1 !== c.q2;
    return { ...c, q, kite, O, L, R, T, Bt, top: (c.p * c.q1) / 2, bot: (c.p * c.q2) / 2, area: (c.p * q) / 2 };
  },
  scenes: [
    { say: (p) => (p.kite ? `두 대각선이 수직으로 만나는 연 모양이에요. 가로 대각선 ${p.p}cm, 세로 대각선 ${p.q}cm. 넓이는?` : `마름모의 두 대각선은 수직으로 만나고 서로를 반으로 나눠요. 가로 대각선 ${p.p}cm, 세로 대각선 ${p.q}cm. 넓이는?`),
      line: (p) => `대각선 ${p.p}cm와 ${p.q}cm, 수직으로 만남`, why: (p) => (p.kite ? "연 모양: 세로 대각선이 가로 대각선을 수직으로 반으로 나눈다" : "마름모: 네 변이 같아 두 대각선이 수직이고 서로를 반으로 나눈다"), ms: 2000 },
    { say: "가로 대각선을 따라 잘라 위·아래 두 삼각형으로 나눠요.", line: "넓이 = 위 삼각형 + 아래 삼각형", why: "잘라도 넓이는 그대로", ms: 2200 },
    { say: (p) => `두 삼각형의 밑변은 똑같이 가로 대각선 ${p.p}cm예요. 높이는 세로 대각선이 나눈 두 토막 ${p.q1}cm와 ${p.q2}cm예요.`, line: (p) => `위 = ${p.p} × ${p.q1} ÷ 2 = ${p.top}㎠, 아래 = ${p.p} × ${p.q2} ÷ 2 = ${p.bot}㎠`, why: "대각선이 수직이라 세로 대각선의 토막이 곧 높이 · 삼각형 = 밑변 × 높이 ÷ 2", ms: 2600 },
    { say: (p) => `두 높이를 더하면 세로 대각선 전체 ${p.q}cm예요. 그래서 넓이는 ${p.p} × ${p.q} ÷ 2 = ${p.area}㎠. 둘러싼 직사각형의 꼭 절반이에요.`, line: (p) => `넓이 = ${p.p} × (${p.q1} + ${p.q2}) ÷ 2 = ${p.p} × ${p.q} ÷ 2 = ${p.area}㎠`, why: "밑변이 같은 두 삼각형은 높이를 더해 한 번에 계산할 수 있다", ms: 2600 },
    { say: "세로 대각선이 어디서 나뉘든(마름모든 연 모양이든) 두 토막의 합은 늘 세로 대각선 전체예요. 「다른 마름모·연 모양으로」를 눌러 보세요.", line: "두 대각선이 수직이면 넓이 = 대각선 × 대각선 ÷ 2", why: "높이 두 토막의 합 = 세로 대각선", ms: 1600 },
  ],
  draw(f, k, p) {
    const { O, L, R, T, Bt } = p;
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3);
    const gap = 24 * s1 * (1 - s3), up = P(0, -gap), dn = P(0, gap);
    if (s3 > 0) f.poly([P(L.x, T.y), P(R.x, T.y), P(R.x, Bt.y), P(L.x, Bt.y)], { fill: "none", stroke: C.orange, w: 2, dash: "7 5", opacity: s3 });
    f.poly([T, R, L].map((q) => add(q, up)), { fill: s1 > 0 ? C.blueSoft : C.paper, stroke: C.ink, w: 2.4, draw: s0 });
    f.poly([L, R, Bt].map((q) => add(q, dn)), { fill: s1 > 0 ? C.greenSoft : C.paper, stroke: C.ink, w: 2.4, draw: s0 });
    // 대각선
    f.seg(add(T, up), add(O, up), { stroke: C.purple, w: 2.2, dash: "7 6", opacity: clamp(s0 * 2 - 1) });
    f.seg(add(O, dn), add(Bt, dn), { stroke: C.purple, w: 2.2, dash: "7 6", opacity: clamp(s0 * 2 - 1) });
    f.seg(add(L, up), add(R, up), { stroke: s1 > 0 ? C.orange : C.purple, w: s1 > 0 ? 3 : 2.2, dash: s1 > 0 ? null : "7 6", opacity: clamp(s0 * 2 - 1) });
    f.right(add(O, up), add(R, up), add(T, up), { color: C.purple, opacity: clamp(s0 * 2 - 1) });
    if (!p.kite) [[T, R, up], [R, Bt, dn], [Bt, L, dn], [L, T, up]].forEach(([a, b, d]) => f.ticks(add(a, d), add(b, d), { opacity: s0 * (1 - s1) }));
    // 길이 이름
    f.label(P(R.x + 14, O.y - gap), `가로 ${p.p}cm`, { color: C.purple, size: 16, opacity: clamp(s0 * 2 - 1), anchor: "start" });
    f.label(P(O.x + 24, (T.y + O.y) / 2 - gap), `${p.q1}cm`, { color: C.purple, size: 16, opacity: clamp(s0 * 2 - 1), anchor: "start" });
    f.label(P(O.x + 24, (O.y + Bt.y) / 2 + gap), `${p.q2}cm`, { color: C.purple, size: 16, opacity: clamp(s0 * 2 - 1), anchor: "start" });
    f.note(P(320, 380), `위 ${p.top}㎠ + 아래 ${p.bot}㎠`, { opacity: s2 * (1 - s3), size: 18 });
    f.note(P(320, 380), `${p.p} × ${p.q} = ${p.p * p.q}㎠ (둘러싼 직사각형)`, { opacity: s3, size: 17, color: C.orange });
    f.note(P(320, 410), `넓이 = ${p.p} × ${p.q} ÷ 2 = ${p.area}㎠`, { opacity: s3, size: 19, color: "#b35f00" });
  },
};

// ── 7. 직각으로 꺾인 도형의 둘레: 변을 밀어 직사각형으로 ─────────────
const stairs = {
  id: "staircase-perimeter",
  unit: U4,
  title: "직각으로 꺾인 도형의 둘레는 왜 둘러싼 직사각형과 같을까",
  vary: "다른 계단으로",
  params(seed) {
    const shapes = [
      { W: 16, H: 12, pts: [[0, 0], [5, 0], [5, 4], [10, 4], [10, 7], [16, 7], [16, 12], [0, 12]] },
      { W: 15, H: 10, pts: [[0, 0], [3, 0], [3, 2], [7, 2], [7, 5], [12, 5], [12, 7], [15, 7], [15, 10], [0, 10]] },
      { W: 12, H: 12, pts: [[0, 0], [2, 0], [2, 3], [5, 3], [5, 6], [9, 6], [9, 9], [12, 9], [12, 12], [0, 12]] },
    ];
    const c = pick([{ i: 0, m: 0 }, { i: 1, m: 0 }, { i: 2, m: 1 }, { i: 0, m: 1 }, { i: 1, m: 1 }], seed);
    const s = shapes[c.i], u = 20, x0 = 70, y0 = 95;
    const at = ([x, y]) => P(x0 + (c.m ? s.W - x : x) * u, y0 + y * u);
    const V = s.pts.map(at), n = V.length, side = c.m ? 0 : s.W;
    const edges = V.map((a, i) => {
      const b = V[(i + 1) % n], [px, py] = s.pts[i], [qx, qy] = s.pts[(i + 1) % n];
      let kind = "fix", to = null;
      if (py === qy && py !== s.H) { kind = "h"; to = P(0, y0 - a.y); }
      if (px === qx && px !== 0) { kind = "v"; to = P(x0 + side * u - a.x, 0); }
      return { a, b, kind, to };
    });
    return { ...s, ...c, u, x0, y0, V, edges, box: [P(x0, y0), P(x0 + s.W * u, y0), P(x0 + s.W * u, y0 + s.H * u), P(x0, y0 + s.H * u)] };
  },
  scenes: [
    { say: (p) => `직각으로만 꺾인 계단 모양이에요. 아랫변 ${p.W}cm와 옆변 ${p.H}cm만 알아요. 꺾인 변들의 길이를 몰라도 둘레를 구할 수 있을까요?`, line: (p) => `가로 ${p.W}cm, 세로 ${p.H}cm인 계단 모양의 둘레 = ?`, ms: 2000 },
    { say: "도형을 꼭 맞게 둘러싸는 직사각형을 그려요.", line: (p) => `둘러싼 직사각형: 가로 ${p.W}cm, 세로 ${p.H}cm`, why: "가로는 아랫변, 세로는 옆변과 같다", ms: 1800 },
    { say: "가로로 누운 빨간 변들을 모두 위로 밀어 올려요. 윗변에 빈틈도 겹침도 없이 이어져요.", line: (p) => `빨간 변(위쪽 가로 변)을 모두 더하면 아랫변과 같은 ${p.W}cm`, why: "계단은 한쪽 끝에서 다른 끝까지 한 칸씩 이어져 있다", ms: 2600 },
    { say: "세로로 선 파란 변들을 모두 옆으로 밀어요. 옆변을 꼭 채워요.", line: (p) => `파란 변(꺾인 쪽 세로 변)을 모두 더하면 옆변과 같은 ${p.H}cm`, why: "위에서 아래까지 한 칸씩 이어져 있다", ms: 2600 },
    { say: (p) => `그러니 둘레는 둘러싼 직사각형의 둘레와 같아요. (${p.W} + ${p.H}) × 2 = ${2 * (p.W + p.H)}cm.`, line: (p) => `둘레 = (${p.W} + ${p.H}) × 2 = ${2 * (p.W + p.H)}cm`, why: "직각으로만 꺾인(계단) 도형은 변을 밀어 직사각형 둘레로 바꿀 수 있다", ms: 1800 },
  ],
  draw(f, k, p) {
    const { V, edges, box, x0, y0, u } = p;
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3), s4 = phase(k, 4);
    f.poly(box, { fill: "none", stroke: C.orange, w: 2, dash: "7 6", draw: s1, opacity: s1 > 0 ? 1 : 0 });
    f.poly(V, { fill: C.greenSoft, stroke: C.soft, w: 1.6, draw: s0 });
    edges.forEach(({ a, b, kind, to }) => {
      if (kind === "fix") { f.seg(a, b, { w: 4, opacity: clamp(s0 * 2 - 1) }); return; }
      const t = kind === "h" ? s2 : s3, d = mul(to, t);
      if (t > 0 && Math.hypot(to.x, to.y) > 1) f.seg(a, b, { stroke: kind === "h" ? C.red : C.blue, w: 2, dash: "4 5", opacity: 0.4 });
      f.seg(add(a, d), add(b, d), { stroke: kind === "h" ? C.red : C.blue, w: 4.5, opacity: clamp(s0 * 2 - 1) });
    });
    if (s4 > 0) f.poly(box, { fill: "none", stroke: C.purple, w: 5, opacity: s4 * 0.7 });
    f.label(P(x0 + (p.W * u) / 2, y0 + p.H * u + 24), `${p.W}cm`, { size: 18 });
    f.label(P(p.m ? x0 + p.W * u + 34 : x0 - 34, y0 + (p.H * u) / 2), `${p.H}cm`, { size: 18 });
    const nx = x0 + p.W * u + (p.m ? 78 : 46);
    f.note(P(nx, 130), `빨간 변 모두 = ${p.W}cm`, { anchor: "start", color: C.red, opacity: s2, size: 19 });
    f.note(P(nx, 175), `파란 변 모두 = ${p.H}cm`, { anchor: "start", color: C.blue, opacity: s3, size: 19 });
    f.note(P(nx, 235), `(${p.W} + ${p.H}) × 2`, { anchor: "start", opacity: s4, size: 19 });
    f.note(P(nx, 270), `= ${2 * (p.W + p.H)}cm`, { anchor: "start", opacity: s4, size: 22, color: C.purple });
  },
};

// ── 8. 대각선 위의 한 점: 두 직사각형의 넓이는 왜 같을까 ─────────────
const diagRect = {
  id: "diagonal-rectangles",
  unit: U4,
  title: "대각선 위의 점으로 나눈 두 직사각형은 왜 넓이가 같을까",
  vary: "다른 점으로",
  params(seed) {
    const c = pick([{ W: 10, H: 6, t: 0.5 }, { W: 10, H: 5, t: 0.4 }, { W: 12, H: 8, t: 0.25 }, { W: 15, H: 10, t: 0.6 }, { W: 14, H: 7, t: 5 / 7 }], seed);
    const sc = Math.min(370 / c.W, 270 / c.H, 376 / Math.hypot(c.W, c.H)), Wp = c.W * sc, Hp = c.H * sc, x0 = 250 - Wp / 2, y0 = 205 - Hp / 2;
    const A = P(x0, y0), B = P(x0, y0 + Hp), Cc = P(x0 + Wp, y0 + Hp), D = P(x0 + Wp, y0);
    const Pp = lerp(B, D, c.t);
    const r1 = (v) => Math.round(v * 100) / 100;
    return {
      ...c, A, B, C: Cc, D, P: Pp, E: P(x0, Pp.y), F: P(x0 + Wp, Pp.y), G: P(Pp.x, y0), Hh: P(Pp.x, y0 + Hp),
      w1: r1(c.t * c.W), w2: r1((1 - c.t) * c.W), h1: r1((1 - c.t) * c.H), h2: r1(c.t * c.H), area: r1(c.t * c.W * (1 - c.t) * c.H),
    };
  },
  scenes: [
    { say: "직사각형 ㄱㄴㄷㄹ의 대각선 ㄴㄹ 위의 한 점 ㅁ에서 가로·세로로 선을 그었어요. 색칠한 ㉠과 ㉡ 중 어느 쪽이 넓을까요?", line: "대각선 위의 점 ㅁ에서 가로·세로로 나눈 네 조각", ms: 2000 },
    { say: "대각선 ㄴㄹ이 직사각형을 두 큰 삼각형으로 나눠요. 위쪽 삼각형을 반 바퀴 돌리면 아래쪽에 꼭 포개져요.", line: "큰 삼각형 ㄱㄴㄹ = 큰 삼각형 ㄷㄹㄴ", why: "직사각형은 대각선으로 똑같이 둘로 나뉜다(반 바퀴 돌려 포개기)", ms: 2600 },
    { say: "오른쪽 위 작은 직사각형도 대각선 ㅁㄹ로 나뉘어요. 두 초록 삼각형도 반 바퀴 돌리면 포개져요.", line: "초록 삼각형 둘은 넓이가 같다", why: "같은 까닭: 직사각형을 대각선으로 나눈 두 조각", ms: 2400 },
    { say: "왼쪽 아래 작은 직사각형도 대각선 ㄴㅁ으로 나뉘어요. 두 파란 삼각형도 같아요.", line: "파란 삼각형 둘은 넓이가 같다", why: "같은 까닭", ms: 2400 },
    { say: "㉠은 위쪽 큰 삼각형에서 초록 하나, 파랑 하나를 뺀 것. ㉡은 아래쪽 큰 삼각형에서 초록 하나, 파랑 하나를 뺀 것이에요.", line: "㉠ = 큰 삼각형 − 초록 − 파랑 = ㉡", why: "같은 것에서 같은 것을 빼면 남은 것도 같다", ms: 2400 },
    { say: (p) => `이 그림에서는 ㉠ = ${p.w1} × ${p.h1} = ${p.area}㎠, ㉡ = ${p.w2} × ${p.h2} = ${p.area}㎠. 「다른 점으로」를 눌러 보세요.`, line: (p) => `㉠ = ${p.w1} × ${p.h1} = ${p.area}㎠ = ${p.w2} × ${p.h2} = ㉡`, why: "대각선 위라면 어느 점에서도 ㉠ = ㉡", ms: 1600 },
  ],
  draw(f, k, p) {
    const { A, B, D, E, F, G, Hh } = p, Cc = p.C, Pp = p.P;
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3), s4 = phase(k, 4), s5 = phase(k, 5);
    const op = clamp(s0 * 2 - 1);
    f.poly([A, B, Cc, D], { draw: s0 });
    const hi = 1 - 0.55 * Math.sin(Math.PI * s4);
    f.poly([A, G, Pp, E], { fill: C.orangeSoft, stroke: C.orange, w: 2, opacity: op * hi });
    f.poly([Pp, F, Cc, Hh], { fill: C.blueSoft, stroke: C.blue, w: 2, opacity: op * hi });
    // 큰 삼각형 돌리기
    if (s1 > 0) {
      const O = mid(B, D), pulse = Math.sin(Math.PI * s1);
      f.poly([A, B, D], { fill: C.purpleSoft, stroke: "none", opacity: 0.6 * pulse });
      f.poly([A, B, D].map((q) => rot(q, O, 180 * s1)), { fill: "none", stroke: C.purple, w: 3, dash: "8 5", opacity: pulse });
    }
    // 작은 삼각형 짝
    const pair = (a, b, c1, c2, s, color) => {
      if (s <= 0) return;
      const O = mid(a, b);
      f.poly([a, b, c1], { fill: color, stroke: "none", fillOpacity: 0.3, opacity: s });
      f.poly([a, b, c2], { fill: color, stroke: "none", fillOpacity: 0.3, opacity: clamp(s * 2 - 1) });
      if (s < 1) f.poly([a, b, c1].map((q) => rot(q, O, 180 * s)), { fill: "none", stroke: color, w: 3, dash: "6 5" });
    };
    pair(Pp, D, G, F, s2, C.green);
    pair(B, Pp, E, Hh, s3, C.teal);
    f.seg(E, F, { w: 2, opacity: op }).seg(G, Hh, { w: 2, opacity: op });
    f.seg(B, D, { stroke: C.purple, w: 2.6, grow: s0 });
    f.dot(Pp, { opacity: op, fill: C.purple });
    f.label(mid(A, Pp), "㉠", { size: 22, opacity: op, color: "#b35f00" }).label(mid(Pp, Cc), "㉡", { size: 22, opacity: op, color: C.blue });
    f.label(add(A, P(-16, -14)), "ㄱ").label(add(B, P(-16, 14)), "ㄴ").label(add(Cc, P(16, 14)), "ㄷ").label(add(D, P(16, -14)), "ㄹ");
    f.label(add(Pp, P(-15, -15)), "ㅁ", { color: C.purple, opacity: op });
    // 길이(마지막 장면)
    f.label(P((A.x + G.x) / 2, A.y - 18), `${p.w1}`, { size: 16, opacity: s5 }).label(P((G.x + D.x) / 2, A.y - 18), `${p.w2}`, { size: 16, opacity: s5 });
    f.label(P(A.x - 26, (A.y + E.y) / 2), `${p.h1}`, { size: 16, opacity: s5 }).label(P(A.x - 26, (E.y + B.y) / 2), `${p.h2}`, { size: 16, opacity: s5 });
    const nx = 470;
    f.note(P(nx, 150), "㉠ = ㉡", { anchor: "start", size: 26, opacity: s4 });
    f.note(P(nx, 200), `${p.area}㎠`, { anchor: "start", size: 22, opacity: s5, color: C.purple });
  },
};

export const PROOFS = [squareFold, setSquare, parallelSum, zigzag, tapeFold, triArea, trapArea, rhombusArea, stairs, diagRect];
