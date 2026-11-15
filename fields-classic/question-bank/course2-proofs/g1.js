// 2과정 G1 「돌리기와 뒤집기」 그림 논증 — 본책 3단원(360도와 정다각형·원)·4단원(삼각형과 사각형)의 「왜 그럴까」.
// 본책은 「잘라서 맞춰 보니 일직선」으로 확인한다. 여기서는 한 걸음 더: 접는 까닭·같은 길이의 까닭을 근거로 쌓고,
// 「다른 모양으로」를 눌러 어떤 모양이어도 같은 논증이 통한다는 것(일반화)을 본다. 그림 도구는 proof-board.js.
import { C, P, add, sub, mul, lerp, mid, dist, dirDeg, polar, rot, fold, angleAt, clamp, ease, phase } from "../proof-board.js";

const pick = (list, seed) => list[seed % list.length];
const r0 = (v) => Math.round(v);
const bottomNote = (f, text, o = {}) => f.note(P(320, 412), text, o);

// ── 1. 삼각형 세 각의 합: 접어서 따지기 ───────────────────────────
const triSum = {
  id: "triangle-sum",
  unit: "3단원 · 360도와 정다각형",
  title: "삼각형의 세 각을 모으면 왜 180°일까",
  vary: "다른 삼각형으로",
  params(seed) {
    const s = pick([{ ax: 250, ay: 92 }, { ax: 390, ay: 118 }, { ax: 190, ay: 150 }, { ax: 330, ay: 70 }, { ax: 455, ay: 104 }], seed);
    const B = P(90, 350), Cc = P(550, 350), A = P(s.ax, s.ay);
    const a = r0(angleAt(A, B, Cc)), b = r0(angleAt(B, A, Cc));
    return { A, B, C: Cc, H: P(A.x, B.y), M1: mid(A, B), M2: mid(A, Cc), a, b, c: 180 - a - b };
  },
  scenes: [
    { say: "삼각형의 세 각 ㉠, ㉡, ㉢을 한데 모으면 몇 도가 될까요? 오려 붙이지 않고 접어서 따져 봐요.", line: "세 각 ㉠, ㉡, ㉢의 합을 구한다", ms: 1800 },
    { say: "가장 긴 변을 밑변으로 두고, 꼭짓점 ㄱ에서 밑변에 수직인 선 ㄱㄹ을 그어요. 두 변의 가운데 점을 이은 선이 접는 선이에요.", line: "접는 선은 높이 ㄱㄹ의 딱 가운데를 지난다", why: "두 변의 가운데 점을 이었으니 높이도 반씩", ms: 2400 },
    { say: "위쪽을 접는 선을 따라 내려 접어요. 꼭짓점 ㄱ이 어디에 닿나요?", line: "꼭짓점 ㄱ(각 ㉠)이 밑변 위 ㄹ에 닿는다", why: "접는 선이 높이의 가운데라 위쪽 반이 아래쪽 반에 딱 포개진다", ms: 2400 },
    { say: "양쪽 모서리도 가운데 점에서 내린 선을 따라 접어요. ㄴ과 ㄷ도 ㄹ에 닿아요.", line: "꼭짓점 ㄴ(㉡)과 ㄷ(㉢)도 ㄹ에 닿는다", why: "ㄴ과 ㄹ 사이, ㄷ과 ㄹ 사이의 가운데에서 접었으니", ms: 2600 },
    { say: "세 각이 한 점 ㄹ에서 겹치지 않고 빈틈없이 모였고, 바깥 두 변은 곧은 밑변 위에 놓였어요.", line: "㉡ + ㉠ + ㉢ = 곧은 선 = 반 바퀴 = 180°", why: "한 점에서 곧은 선을 이루는 각은 반 바퀴", ms: 2000 },
    { say: (p) => `이 삼각형은 ${p.a}° + ${p.b}° + ${p.c}° = 180°. 「다른 삼각형으로」를 눌러 보세요. 모양이 달라도 같은 까닭으로 접혀요.`, line: "어떤 삼각형도 세 각의 합은 180°", why: "가장 긴 변을 밑변으로 잡으면 ㄹ이 늘 밑변 위에 있어 똑같이 접을 수 있다", ms: 1400 },
  ],
  draw(f, k, p) {
    const { A, B, H, M1, M2 } = p, Cc = p.C;
    const D1 = P(M1.x, B.y), D2 = P(M2.x, B.y);
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3, 0.25, 1), s3a = phase(k, 3, 0, 0.3), s4 = phase(k, 4);
    const arcs = (v, p1, p2, color, label, o = {}) => f.arc(v, p1, p2, { r: 30, color, label, size: 18, ...o });
    if (s2 === 0) {
      f.poly([A, B, Cc], { draw: s0 });
      const op = clamp(s0 * 2 - 1);
      arcs(A, B, Cc, C.red, "㉠", { opacity: op }); arcs(B, A, Cc, C.green, "㉡", { opacity: op }); arcs(Cc, A, B, C.blue, "㉢", { opacity: op });
    } else {
      // 위 삼각형을 접는다(아래 사다리꼴은 그대로)
      const flipped = s2 > 0.5;
      if (s3 === 0) f.poly([M1, B, Cc, M2]);
      else {
        f.poly([M1, D1, D2, M2]);
        const L = [B, D1, M1].map((q) => fold(q, M1, D1, s3)), Rr = [Cc, D2, M2].map((q) => fold(q, M2, D2, s3));
        f.poly(L, { fill: s3 > 0.5 ? C.back : C.paper }); f.poly(Rr, { fill: s3 > 0.5 ? C.back : C.paper });
      }
      const T = [A, M1, M2].map((q) => fold(q, M1, M2, s2));
      f.poly(T, { fill: flipped ? C.back : C.paper });
      const po = { opacity: 1 - s4 };
      arcs(T[0], T[1], T[2], C.red, "㉠", po);
      const bL = s3 === 0 ? B : fold(B, M1, D1, s3), bR = s3 === 0 ? Cc : fold(Cc, M2, D2, s3);
      arcs(bL, s3 === 0 ? A : fold(M1, M1, D1, s3), s3 === 0 ? Cc : fold(D1, M1, D1, s3), C.green, "㉡", po);
      arcs(bR, s3 === 0 ? A : M2, s3 === 0 ? B : D2, C.blue, "㉢", po);
      // 접는 선(양옆)
      f.seg(M1, D1, { stroke: C.soft, w: 2, dash: "6 6", opacity: s3a * (1 - s4) });
      f.seg(M2, D2, { stroke: C.soft, w: 2, dash: "6 6", opacity: s3a * (1 - s4) });
    }
    // 높이와 접는 선
    const hOp = s1 * (1 - s2);
    f.seg(A, H, { stroke: C.purple, w: 2, dash: "7 6", grow: s1, opacity: hOp }).right(H, A, Cc, { opacity: hOp, color: C.purple });
    f.seg(M1, M2, { stroke: C.orange, w: 2.4, dash: "8 6", grow: clamp(s1 * 1.6 - 0.6), opacity: 1 - s3 * 0.6 });
    f.ticks(A, M1, { opacity: s1 * (1 - s2) }).ticks(M1, B, { opacity: s1 * (1 - s2) });
    f.ticks(A, M2, { n: 2, opacity: s1 * (1 - s2) }).ticks(M2, Cc, { n: 2, opacity: s1 * (1 - s2) });
    f.dot(M1, { opacity: s1, fill: C.orange }).dot(M2, { opacity: s1, fill: C.orange });
    // 꼭짓점 이름
    f.label(add(A, P(0, -20)), "ㄱ", { opacity: 1 - s2 }).label(add(B, P(-18, 8)), "ㄴ", { opacity: 1 - s3 }).label(add(Cc, P(18, 8)), "ㄷ", { opacity: 1 - s3 });
    f.label(add(H, P(0, 22)), "ㄹ", { opacity: s1, color: C.purple });
    // 모인 세 각
    if (s4 > 0) {
      f.seg(P(40, B.y), P(600, B.y), { stroke: C.orange, w: 4, opacity: s4 * 0.85 });
      f.wedge(H, 0, p.c, { r: 46, color: C.blue, opacity: s4, label: `㉢ ${p.c}°`, labelR: 74, size: 17 });
      f.wedge(H, p.c, p.a, { r: 46, color: C.red, opacity: s4, label: `㉠ ${p.a}°`, labelR: 74, size: 17 });
      f.wedge(H, p.c + p.a, p.b, { r: 46, color: C.green, opacity: s4, label: `㉡ ${p.b}°`, labelR: 74, size: 17 });
      bottomNote(f, "㉡ + ㉠ + ㉢ = 반 바퀴 = 180°", { opacity: s4 });
    }
  },
};

// ── 2. 이등변삼각형의 두 밑각: 접으면 포개진다 ───────────────────
const isosceles = {
  id: "isosceles-base",
  unit: "3단원 · 360도와 정다각형",
  title: "이등변삼각형의 두 밑각은 왜 같을까",
  vary: "다른 꼭지각으로",
  params(seed) {
    const apex = pick([40, 80, 30, 100, 50, 120], seed), L = apex > 90 ? 230 : 260, h = L * Math.cos(apex / 2 * Math.PI / 180), w = L * Math.sin(apex / 2 * Math.PI / 180);
    const base = 350, A = P(320, base - h);
    return { apex, A, B: P(320 - w, base), C: P(320 + w, base), M: P(320, base), base: (180 - apex) / 2 };
  },
  scenes: [
    { say: "두 변 ㄱㄴ과 ㄱㄷ의 길이가 같은 삼각형이에요(이등변삼각형). 밑의 두 각 ㉡과 ㉢은 어떤 사이일까요?", line: "ㄱㄴ = ㄱㄷ (두 변이 같다)", ms: 1800 },
    { say: "꼭짓점 ㄱ과 밑변의 가운데 점 ㅁ을 이어 접는 선을 그어요.", line: "ㄴㅁ = ㅁㄷ (밑변의 가운데)", why: "ㅁ을 밑변의 가운데로 잡았으니", ms: 1800 },
    { say: "접는 선을 따라 왼쪽을 오른쪽으로 접어요. ㄴ이 어디에 닿나요?", line: "접으면 ㄱㄴ이 ㄱㄷ에, ㄴ이 ㄷ에 포개진다", why: "세 변(ㄱㄴ = ㄱㄷ, ㄴㅁ = ㄷㅁ, ㄱㅁ은 같이 씀)이 모두 같으니 두 쪽이 꼭 맞는다", ms: 2600 },
    { say: "㉡이 ㉢에 빈틈없이 포개졌어요. 그래서 두 밑각은 크기가 같아요.", line: "㉡ = ㉢", why: "포개지는 각은 크기가 같다", ms: 1600 },
    { say: (p) => `꼭지각이 ${p.apex}°이면, 세 각의 합 180°에서 꼭지각을 빼고 남은 것을 두 밑각이 똑같이 나눠 가져요.`, line: (p) => `㉡ = ㉢ = (180° − ${p.apex}°) ÷ 2 = ${p.base}°`, why: "세 각의 합은 180°(앞 판서) + 두 밑각이 같다", ms: 2400 },
  ],
  draw(f, k, p) {
    const { A, B, M } = p, Cc = p.C;
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3), s4 = phase(k, 4);
    const back = 1 - s4;   // 마지막 장면에서 다시 펼친다
    const fl = s2 * back;
    f.poly([A, M, Cc], { draw: s0 });
    const Lf = [A, B, M].map((q) => fold(q, A, M, fl));
    f.poly(Lf, { fill: fl > 0.5 ? C.back : C.paper, draw: s0 });
    f.ticks(A, Cc, { opacity: s0 });
    f.ticks(Lf[0], Lf[1], { opacity: s0 });
    f.arc(Cc, A, M, { r: 38, color: C.blue, label: s4 > 0 ? `㉢ ${p.base}°` : "㉢", opacity: clamp(s0 * 2 - 1), labelR: s4 > 0 ? 66 : 55 });
    f.arc(Lf[1], Lf[0], Lf[2], { r: 38, color: C.green, label: s4 > 0 ? `㉡ ${p.base}°` : (s3 > 0.3 && fl > 0.9 ? "" : "㉡"), opacity: clamp(s0 * 2 - 1), labelR: s4 > 0 ? 66 : 55 });
    f.arc(A, B, Cc, { r: 34, color: C.soft, label: `${p.apex}°`, labelR: 52, opacity: s4 + clamp(s0 * 2 - 1) * (1 - s1) * 0.0 });
    f.seg(A, M, { stroke: C.orange, w: 2.4, dash: "8 6", grow: s1, opacity: s1 });
    f.ticks(Lf[1], Lf[2], { n: 2, opacity: s1 }).ticks(M, Cc, { n: 2, opacity: s1 });
    f.label(add(A, P(0, -20)), "ㄱ").label(add(Lf[1], P(-18, 10)), "ㄴ", { opacity: 1 - fl }).label(add(Cc, P(18, 10)), "ㄷ").label(add(M, P(0, 22)), "ㅁ", { opacity: s1 });
    if (s3 > 0) bottomNote(f, "㉡ = ㉢", { opacity: s3 * back, color: C.ink });
    if (s4 > 0) bottomNote(f, `(180° − ${p.apex}°) ÷ 2 = ${p.base}°`, { opacity: s4 });
  },
};

// ── 3. 정다각형의 한 내각: 이등변삼각형으로 나눠 따지기 ──────────
const regular = {
  id: "regular-interior",
  unit: "3단원 · 360도와 정다각형",
  title: "정다각형의 한 내각은 어떻게 구할까",
  vary: "다른 정다각형으로",
  params(seed) {
    const n = pick([6, 5, 8, 10, 12, 9], seed), name = { 5: "정오각형", 6: "정육각형", 8: "정팔각형", 9: "정구각형", 10: "정십각형", 12: "정십이각형" }[n];
    const c = 360 / n, b = (180 - c) / 2;
    const O = P(300, 220), Rr = 175, V = Array.from({ length: n }, (_, i) => polar(O, Rr, -90 - 180 / n + 360 * i / n + 180));
    return { n, name, c, b, O, V, inner: 180 - c };
  },
  scenes: [
    { say: (p) => `${p.name}은 변의 길이와 각의 크기가 모두 같아요. 한 내각은 몇 도일까요?`, line: (p) => `${p.name}: 변 ${p.n}개, 각 ${p.n}개가 모두 같다`, ms: 1700 },
    { say: "가운데 점에서 꼭짓점마다 선을 그으면, 똑같은 이등변삼각형으로 나뉘어요.", line: (p) => `똑같은 이등변삼각형 ${p.n}개로 나뉜다`, why: "가운데에서 꼭짓점까지의 길이가 모두 같다", ms: 2200 },
    { say: "가운데에 모인 각들은 한 바퀴를 똑같이 나눠 가져요.", line: (p) => `가운데 각 = 360° ÷ ${p.n} = ${p.c}°`, why: "가운데를 빙 둘러 한 바퀴 = 360°", ms: 2000 },
    { say: "이등변삼각형의 두 밑각은 같고, 세 각의 합은 180°예요.", line: (p) => `한 밑각 = (180° − ${p.c}°) ÷ 2 = ${p.b}°`, why: "이등변삼각형의 두 밑각은 같다 · 세 각의 합 180°", ms: 2000 },
    { say: "한 꼭짓점의 내각은 이웃한 두 삼각형의 밑각 두 개가 합쳐진 것이에요.", line: (p) => `한 내각 = ${p.b}° + ${p.b}° = ${p.inner}°`, why: "한 내각을 가운데로 가는 선이 둘로 나눈다", ms: 2400 },
    { say: (p) => `그래서 한 내각 = 180° − 360° ÷ ${p.n}. 「다른 정다각형으로」를 눌러 같은 방법으로 따져 보세요.`, line: "정다각형의 한 내각 = 180° − (360° ÷ 변의 수)", why: "밑각 두 개의 합 = 180° − 가운데 각", ms: 1400 },
  ],
  draw(f, k, p) {
    const { O, V, n } = p;
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3), s4 = phase(k, 4);
    const t0 = 0, t1 = 1, t2 = 2 % n;
    f.poly(V, { draw: s0 });
    if (s2 > 0) f.poly([O, V[t0], V[t1]], { fill: C.orangeSoft, stroke: "none", opacity: s2 });
    if (s4 > 0) f.poly([O, V[t1], V[t2]], { fill: C.orangeSoft, stroke: "none", opacity: s4 });
    V.forEach((v, i) => {
      f.seg(O, v, { stroke: C.ink, w: 1.8, grow: clamp(s1 * 1.3 - i * 0.3 / n), opacity: s1 });
      f.ticks(O, v, { opacity: s1 * 0.8 });
    });
    f.poly(V, { fill: "none" });
    f.dot(O, { opacity: s1 });
    // 가운데 각
    f.arc(O, V[t0], V[t1], { r: 30, color: C.orange, opacity: s2, label: `${p.c}°`, labelR: 52 });
    for (let i = 1; i < n; i += 1) f.arc(O, V[i], V[(i + 1) % n], { r: 30, color: C.orange, opacity: s2 * 0.35 * (1 - s4) });
    // 밑각
    const lab = s4 > 0.95 ? "" : `${p.b}°`;
    f.arc(V[t0], O, V[(t0 + 1) % n], { r: 34, color: C.green, opacity: s3, label: `${p.b}°`, labelR: 58 });
    f.arc(V[t1], O, V[t0], { r: 34, color: C.green, opacity: s3, label: lab, labelR: 58 });
    f.arc(V[t1], O, V[t2], { r: 34 + 0, color: C.teal, opacity: s4, label: lab, labelR: 58 });
    if (s4 > 0) f.arc(V[t1], V[t0], V[t2], { r: 22 + 26 * s4, color: C.purple, fillOpacity: 0.12, opacity: s4, label: `${p.inner}°`, labelR: 82, size: 20 });
    if (s4 > 0) bottomNote(f, `${p.b}° + ${p.b}° = ${p.inner}°`, { opacity: s4 });
  },
};

// ── 4. 외각의 합: 한 바퀴 걸어 보기 ──────────────────────────
const exterior = {
  id: "exterior-sum",
  unit: "3단원 · 360도와 정다각형",
  title: "다각형의 외각을 모두 더하면 왜 360°일까",
  vary: "다른 다각형으로",
  width: 640,
  params(seed) {
    const shapes = [
      [P(70, 300), P(300, 340), P(380, 200), P(240, 70), P(90, 150)],
      [P(80, 320), P(360, 320), P(330, 120), P(120, 90)],
      [P(70, 250), P(170, 350), P(330, 330), P(390, 190), P(290, 80), P(130, 100)],
    ];
    const V = pick(shapes, seed), n = V.length;
    const ext = V.map((v, i) => {
      const a = V[(i + n - 1) % n], b = V[(i + 1) % n];
      return ((dirDeg(v, b) - dirDeg(a, v)) % 360 + 360) % 360;
    });
    // 반올림 합을 360에 맞춘다
    const rd = ext.map((x) => Math.round(x)), fix = 360 - rd.reduce((s, x) => s + x, 0); rd[0] += fix;
    return { V, n, ext, rd, G: P(520, 210) };
  },
  scenes: [
    { say: "꼭짓점마다 한 변을 늘인 선과 다음 변 사이의 각을 외각이라고 해요. 외각을 모두 더하면 몇 도일까요?", line: (p) => `꼭짓점 ${p.n}개, 외각 ${p.n}개`, ms: 1800 },
    { say: "변을 하나씩 늘여 외각을 표시해요.", line: "한 꼭짓점에서 내각 + 외각 = 180°", why: "늘인 선은 곧은 선(반 바퀴)", ms: 2200 },
    { say: "변을 따라 한 바퀴 걸어 봐요. 꼭짓점마다 외각만큼 몸을 돌려요. 출발한 자리로 오면 처음 방향을 다시 봐요.", line: "걸으며 돈 각 = 외각을 모두 더한 것", why: "꼭짓점에서 돌아야 하는 만큼이 바로 외각", ms: 5200 },
    { say: "외각을 그대로 옮겨 한 점에 모으면, 빈틈도 겹침도 없이 한 바퀴가 돼요.", line: "외각의 합 = 한 바퀴 = 360°", why: "처음 방향으로 돌아왔으니 모두 합해 한 바퀴를 돈 것", ms: 2600 },
    { say: (p) => `그러니 내각의 합은 180° × ${p.n} − 360° = ${180 * p.n - 360}°. 변이 몇 개든 외각의 합은 360°예요.`, line: (p) => `내각의 합 = 180° × ${p.n} − 360° = ${180 * p.n - 360}°`, why: "(내각 + 외각) × 꼭짓점 수 − 외각의 합", ms: 1600 },
  ],
  draw(f, k, p) {
    const { V, n, ext, rd, G } = p;
    const s0 = phase(k, 0), s1 = phase(k, 1), s3 = phase(k, 3);
    const walk = clamp(k - 2);
    f.poly(V, { draw: s0, fill: C.paper });
    const colors = [C.red, C.green, C.blue, C.purple, C.orange, C.teal];
    V.forEach((v, i) => {
      const a = V[(i + n - 1) % n], dir = dirDeg(a, v), ext1 = polar(v, 60, dir);
      f.seg(v, ext1, { stroke: C.soft, w: 2, dash: "6 5", grow: s1, opacity: s1 });
      const from = v, to = lerp(v, G, s3);
      f.wedge(to, dir, ext[i], { r: 30, color: colors[i % 6], opacity: s1, label: s3 > 0.6 ? "" : `${rd[i]}°`, labelR: 46, size: 15 });
      void from;
    });
    if (s3 > 0) {
      f.circle(G, 30, { stroke: C.ink, w: 1.5, dash: "4 4", opacity: s3 });
      f.dot(G, { opacity: s3 });
      f.label(add(G, P(0, 58)), "모은 자리", { size: 15, opacity: s3 });
      bottomNote(f, `${rd.join("° + ")}° = 360°`, { opacity: s3, size: 18 });
    }
    // 걷기(장면 3)
    if (k > 2.001 && k < 3.999 && s3 < 0.05) {
      const u = walk * n, i = Math.min(n - 1, Math.floor(u)), fr = u - i;
      const a = V[i], b = V[(i + 1) % n], c = V[(i + 2) % n];
      const h1 = dirDeg(a, b), turn = ext[(i + 1) % n];
      const pos = fr < 0.75 ? lerp(a, b, fr / 0.75) : b, head = fr < 0.75 ? h1 : h1 + turn * ease((fr - 0.75) / 0.25);
      const turned = ext.slice(1, i + 1).reduce((s, x) => s + x, 0) + (fr >= 0.75 ? turn * ease((fr - 0.75) / 0.25) : 0);
      const tip = polar(pos, 20, head), l = polar(pos, 11, head + 140), r = polar(pos, 11, head - 140);
      f.poly([tip, l, r], { fill: C.ink, stroke: C.ink, w: 1 });
      void c;
      f.note(P(520, 380), `돈 각 ${Math.round(turned)}°`, { size: 20, color: C.purple });
    }
    if (k >= 3.999 || (k >= 3 && s3 >= 0.05)) f.note(P(520, 380), "돈 각 360°", { size: 20, color: C.purple, opacity: 1 - s3 });
  },
};

// ── 5. 시계 두 바늘 사이의 각 ─────────────────────────────────
const clock = {
  id: "clock-angle",
  unit: "3단원 · 360도와 정다각형",
  title: "시계 두 바늘 사이의 각 따지기",
  vary: "다른 시각으로",
  params(seed) {
    const [h, m] = pick([[4, 30], [2, 30], [7, 20], [8, 30], [1, 20], [10, 30]], seed);
    const M = m * 6, Hh = h * 30 + m / 2, d = Math.abs(M - Hh), small = d > 180 ? 360 - d : d;
    return { h, m, M, Hh, d, small, O: P(230, 220), R: 170 };
  },
  scenes: [
    { say: (p) => `${p.h}시 ${p.m}분, 시침과 분침 사이의 작은 쪽 각은 몇 도일까요? 두 바늘이 12에서 몇 도 돌았는지부터 따져요.`, line: (p) => `${p.h}시 ${p.m}분: 12에서 각 바늘이 돈 각을 구한다`, ms: 1600 },
    { say: (p) => `분침은 60분에 한 바퀴, 그러니 1분에 6°씩. ${p.m}분이면 ${p.M}°를 돌아요.`, line: (p) => `분침 = 6° × ${p.m} = ${p.M}°`, why: "360° ÷ 60분 = 1분에 6°", ms: 2600 },
    { say: (p) => `시침은 1시간에 큰 눈금 한 칸(30°). ${p.h}시까지 ${p.h * 30}°, 그리고 ${p.m}분 동안 한 칸의 일부를 더 가요.`, line: (p) => `시침 = 30° × ${p.h} + ${p.m} ÷ 2 = ${p.Hh}°`, why: "60분에 30° → 1분에 30° ÷ 60 = 반 도(2분에 1°)", ms: 3000 },
    { say: "두 바늘이 돈 각의 차가 두 바늘 사이의 각이에요. 180°보다 크면 반대쪽(작은 쪽)을 봐요.", line: (p) => (p.d > 180 ? `사이의 각 = 360° − ${p.d}° = ${p.small}°` : `사이의 각 = ${Math.max(p.M, p.Hh)}° − ${Math.min(p.M, p.Hh)}° = ${p.small}°`), why: "두 바늘 모두 12에서 같은 쪽(시계 방향)으로 잰 각", ms: 2200 },
  ],
  draw(f, k, p) {
    const { O, R: Rr } = p;
    const s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3);
    const cw = (deg) => 90 - deg;   // 12시에서 시계 방향 deg → 수학 각
    f.circle(O, Rr + 10, { fill: "#fff", w: 3 });
    for (let i = 0; i < 60; i += 1) {
      const big = i % 5 === 0;
      f.seg(polar(O, Rr + 4, cw(i * 6)), polar(O, big ? Rr - 12 : Rr - 4, cw(i * 6)), { w: big ? 3 : 1.1 });
      if (big) f.label(polar(O, Rr - 32, cw(i * 6)), String(i / 5 || 12), { size: 19, halo: false });
    }
    const mA = p.M * s1, hA = (p.h * 30) * clamp(s2 / 0.7) + (p.m / 2) * clamp((s2 - 0.7) / 0.3);
    if (s1 > 0 && s3 < 1) f.wedge(O, cw(mA), mA, { r: Rr - 52, color: C.blue, fillOpacity: 0.1, w: 1, opacity: 1 - s3 });
    if (s2 > 0 && s3 < 1) f.wedge(O, cw(hA), hA, { r: Rr - 86, color: C.ink, fillOpacity: 0.12, w: 1, opacity: 1 - s3 });
    if (s3 > 0) {
      let from = p.Hh, span = p.M - p.Hh;
      if (span < 0) { from = p.M; span = -span; }
      if (span > 180) { from = Math.max(p.M, p.Hh); span = 360 - span; }
      f.wedge(O, cw(from + span), span, { r: 64, color: C.orange, fillOpacity: 0.45, opacity: s3, label: `${p.small}°`, labelR: 92, size: 21, labelColor: "#b35f00" });
    }
    f.seg(O, polar(O, Rr - 74, cw(hA)), { w: 9, stroke: C.ink });
    f.seg(O, polar(O, Rr - 22, cw(mA)), { w: 5, stroke: C.blue });
    f.dot(O, { r: 7 });
    const x = 440;
    f.note(P(x, 120), `${p.h}시 ${p.m}분`, { size: 24, anchor: "start" });
    if (s1 > 0) f.note(P(x, 190), `분침 ${Math.round(mA)}°`, { color: C.blue, anchor: "start", size: 22 });
    if (s2 > 0) f.note(P(x, 240), `시침 ${Math.round(hA * 2) / 2}°`, { anchor: "start", size: 22 });
    if (s3 > 0) f.note(P(x, 300), `사이 ${p.small}°`, { color: "#b35f00", anchor: "start", size: 24, opacity: s3 });
  },
};

// ── 6. 원 안 정사각형(직사각형)의 가운데 점 잇기: 한 변 = 반지름 ──
const midSquare = {
  id: "circle-midpoints",
  unit: "3단원 · 원",
  title: "가운데 점을 이은 도형의 한 변은 왜 반지름과 같을까",
  vary: "직사각형으로도",
  params(seed) {
    const s = pick([{ shape: "square", r: 6 }, { shape: "rect", r: 8 }, { shape: "square", r: 4 }, { shape: "rect", r: 6 }], seed);
    const O = P(250, 220), Rr = 175, half = s.shape === "square" ? 45 : 32;
    const V0 = polar(O, Rr, half), V1 = polar(O, Rr, 180 - half), V2 = polar(O, Rr, 180 + half), V3 = polar(O, Rr, -half);
    return { ...s, O, Rr, V: [V0, V1, V2, V3], T: mid(V0, V1), Lm: mid(V1, V2), Bm: mid(V2, V3), Rm: mid(V3, V0), inner: s.shape === "square" ? "정사각형" : "마름모", outer: s.shape === "square" ? "정사각형" : "직사각형", quarter: s.shape === "square" ? "작은 정사각형" : "작은 직사각형" };
  },
  scenes: [
    { say: (p) => `반지름이 ${p.r}cm인 원 안에 ${p.outer}을 그리고, 네 변의 가운데 점을 이어 ${p.inner}을 그렸어요. 색칠한 ${p.inner}의 한 변은 몇 cm일까요?`, line: (p) => `원의 반지름 ${p.r}cm, 색칠한 ${p.inner}의 한 변 = ?`, ms: 2000 },
    { say: (p) => `원의 중심 ㅇ에서 위·오른쪽 변의 가운데 점으로 선을 그으면 ${p.outer}이 똑같이 4조각 나요. 그중 한 조각을 봐요.`, line: (p) => `ㅇ, 두 가운데 점, 꼭짓점 ㄱ이 ${p.quarter}을 이룬다`, why: (p) => `${p.outer}을 가로·세로 가운데 선으로 나눈 한 조각`, ms: 2200 },
    { say: (p) => `${p.quarter}의 두 대각선을 그어요. 하나는 중심에서 원 위의 꼭짓점까지(반지름), 다른 하나는 색칠한 ${p.inner}의 한 변이에요.`, line: "대각선 ㅇㄱ = 반지름", why: "꼭짓점 ㄱ이 원 위에 있다", ms: 2200 },
    { say: "보라색 대각선을 돌려 빨간 대각선에 겹쳐 보면 길이가 꼭 같아요.", line: (p) => `색칠한 ${p.inner}의 한 변 = ㅇㄱ = ${p.r}cm`, why: "직사각형(정사각형)의 두 대각선은 길이가 같다", ms: 2600 },
    { say: (p) => `네 조각 모두 같으니 네 변이 모두 ${p.r}cm. 둘레는 ${p.r} × 4 = ${p.r * 4}cm예요.`, line: (p) => `둘레 = ${p.r}cm × 4 = ${p.r * 4}cm`, why: "네 조각이 모두 같은 모양", ms: 1800 },
  ],
  draw(f, k, p) {
    const { O, Rr, V, T, Lm, Bm, Rm } = p;
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3), s4 = phase(k, 4);
    f.circle(O, Rr, { draw: s0, w: 2.2 });
    f.poly(V, { draw: s0, fill: "none" });
    f.poly([T, Lm, Bm, Rm], { fill: C.purpleSoft, stroke: C.purple, w: 2.4, opacity: clamp(s0 * 2 - 1) });
    f.dot(O, { opacity: s0 });
    f.seg(O, polar(O, Rr, 205), { stroke: C.soft, w: 2, dash: "5 5", opacity: s0 * (1 - s2) });
    f.label(polar(O, Rr * 0.55, 212), `${p.r}cm`, { size: 16, color: C.ink, opacity: s0 * (1 - s2) });
    // 4등분과 한 조각
    f.seg(T, Bm, { stroke: C.soft, w: 1.6, dash: "5 5", grow: s1, opacity: s1 * 0.8 });
    f.seg(Lm, Rm, { stroke: C.soft, w: 1.6, dash: "5 5", grow: s1, opacity: s1 * 0.8 });
    f.poly([O, T, V[0], Rm], { fill: C.orangeSoft, stroke: C.orange, w: 2.4, opacity: s1, fillOpacity: 0.7 });
    f.seg(T, Rm, { stroke: C.purple, w: 3, opacity: s1 });
    // 대각선
    f.seg(O, V[0], { stroke: C.red, w: 4, grow: s2, opacity: s2 });
    const Q = mid(O, V[0]), ang = dirDeg(T, Rm), want = dirDeg(O, V[0]);
    let turn = ((want - ang) % 360 + 540) % 360 - 180;
    const a1 = rot(T, Q, turn * s3), a2 = rot(Rm, Q, turn * s3);
    if (s3 > 0) f.seg(a1, a2, { stroke: C.purple, w: 4, dash: s3 > 0.98 ? "10 7" : null, opacity: 0.95 });
    f.label(add(polar(Q, 0, 0), P(18, 22)), s3 > 0.9 ? `${p.r}cm` : "", { size: 17, color: C.red });
    // 네 변 같음
    [[T, Lm], [Lm, Bm], [Bm, Rm], [Rm, T]].forEach(([a, b]) => f.ticks(a, b, { opacity: s4, color: C.purple }));
    f.label(add(O, P(-14, 14)), "ㅇ").label(add(V[0], P(14, -12)), "ㄱ", { opacity: s1 });
    if (s4 > 0) f.note(P(530, 400), `둘레 ${p.r} × 4 = ${p.r * 4}cm`, { opacity: s4, size: 19 });
  },
};

// ── 7. 중심이 서로의 원 위에 있는 두 원: 정삼각형 ───────────────
const twoCircles = {
  id: "two-circles-triangle",
  unit: "3단원 · 원",
  title: "두 원으로 만든 삼각형은 왜 정삼각형일까",
  vary: "다른 반지름으로",
  params(seed) {
    const r = pick([5, 3, 4, 6], seed), Rr = 140, O1 = P(250, 260), O2 = P(390, 260), Q = P(320, 260 - Rr * Math.sin(Math.PI / 3));
    return { r, Rr, O1, O2, Q };
  },
  scenes: [
    { say: (p) => `반지름이 ${p.r}cm인 두 원을, 한 원의 중심이 다른 원 위에 오도록 그렸어요. 두 중심과 두 원이 만나는 점을 이은 삼각형의 둘레는?`, line: (p) => `두 원 모두 반지름 ${p.r}cm`, ms: 2000 },
    { say: "변 ㄱㄴ: 중심 ㄴ이 왼쪽 원 위에 있으니, ㄱㄴ은 왼쪽 원의 반지름이에요.", line: (p) => `ㄱㄴ = ${p.r}cm`, why: "ㄴ이 왼쪽 원(중심 ㄱ) 위에 있다", ms: 2000 },
    { say: "변 ㄱㄷ: 점 ㄷ도 왼쪽 원 위에 있어요.", line: (p) => `ㄱㄷ = ${p.r}cm`, why: "ㄷ이 왼쪽 원(중심 ㄱ) 위에 있다", ms: 2000 },
    { say: "변 ㄴㄷ: 점 ㄷ은 오른쪽 원 위에도 있어요.", line: (p) => `ㄴㄷ = ${p.r}cm`, why: "ㄷ이 오른쪽 원(중심 ㄴ) 위에 있다", ms: 2000 },
    { say: (p) => `세 변이 모두 반지름이라 같아요. 정삼각형이고, 둘레는 ${p.r} × 3 = ${p.r * 3}cm.`, line: (p) => `정삼각형, 둘레 = ${p.r * 3}cm`, why: "세 변의 길이가 모두 같다", ms: 1600 },
  ],
  draw(f, k, p) {
    const { O1, O2, Q, Rr } = p;
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3), s4 = phase(k, 4);
    f.circle(O1, Rr, { draw: s0, stroke: C.green, w: 2.2, opacity: 1 - 0.5 * s3 });
    f.circle(O2, Rr, { draw: s0, stroke: C.blue, w: 2.2, opacity: 1 - 0.5 * (s1 + s2) * (1 - s3) });
    f.poly([O1, O2, Q], { fill: C.orangeSoft, stroke: C.ink, w: 2.2, opacity: clamp(s0 * 2 - 1) });
    // 반지름이 돌아와 변에 눕는다
    const sweep = (c, from, target, s, color) => {
      if (s <= 0) return;
      const end = dirDeg(c, target), st = end + 120 * (1 - s);
      f.seg(c, polar(c, Rr, st), { stroke: color, w: 5 });
    };
    sweep(O1, null, O2, s1, C.green);
    sweep(O1, null, Q, s2, C.green);
    sweep(O2, null, Q, s3, C.blue);
    f.ticks(O1, O2, { opacity: s1 }).ticks(O1, Q, { opacity: s2 }).ticks(O2, Q, { opacity: s3 });
    f.dot(O1).dot(O2).dot(Q, { opacity: s0 });
    f.label(add(O1, P(-6, 22)), "ㄱ").label(add(O2, P(6, 22)), "ㄴ").label(add(Q, P(0, -22)), "ㄷ");
    if (s4 > 0) f.note(P(320, 418), `${p.r} + ${p.r} + ${p.r} = ${p.r * 3}cm`, { opacity: s4 });
  },
};

// ── 8. 점판 위 기울어진 사각형: 정사각형인 까닭과 넓이 ─────────
const tilted = {
  id: "tilted-square",
  unit: "4단원 · 삼각형과 사각형",
  title: "점판 위 기울어진 사각형은 왜 정사각형일까",
  vary: "다른 기울기로",
  params(seed) {
    const [a, b] = pick([[2, 1], [3, 1], [3, 2], [1, 1], [2, 2]], seed), s = a + b, g = 52;
    const ox = 320 - (s * g) / 2 - 60, oy = 220 + (s * g) / 2;
    const at = (i, j) => P(ox + i * g, oy - j * g);
    return { a, b, s, g, at, ox, oy, area: a * a + b * b };
  },
  scenes: [
    { say: "점과 점을 이어 기울어진 사각형을 그렸어요. 이것은 정사각형일까요? 넓이는 몇 칸일까요?", line: "기울어진 사각형: 정사각형인가? 넓이는?", ms: 1600 },
    { say: "바깥을 둘러싸는 큰 정사각형을 그리면, 귀퉁이에 직각삼각형 4개가 생겨요.", line: (p) => `귀퉁이 직각삼각형 4개(가로 ${p.a}, 세로 ${p.b})`, why: "점판의 가로줄·세로줄로 둘러쌌다", ms: 2000 },
    { say: "그림 전체를 가운데를 중심으로 직각(반의 반 바퀴)만큼 돌려요. 삼각형들이 서로의 자리에 꼭 들어가요.", line: "돌려도 그대로 → 네 변의 길이가 같고 네 각이 같다", why: "직각만큼 돌리면 한 변이 다음 변 자리로 간다 → 정사각형", ms: 3000 },
    { say: "넓이는 큰 정사각형에서 귀퉁이 삼각형 4개를 빼면 돼요.", line: (p) => `넓이 = ${p.s} × ${p.s} − ${p.a} × ${p.b} ÷ 2 × 4 = ${p.s * p.s} − ${2 * p.a * p.b} = ${p.area}칸`, why: "직각삼각형 = 직사각형의 반", ms: 2400 },
  ],
  draw(f, k, p) {
    const { a, b, s, at, ox, oy, g } = p;
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3);
    for (let i = -1; i <= s + 1; i += 1) for (let j = -1; j <= s + 1; j += 1) f.dot(at(i, j), { r: 3.5, fill: C.soft });
    const c1 = at(a, 0), c2 = at(s, a), c3 = at(b, s), c4 = at(0, b);
    const B0 = at(0, 0), B1 = at(s, 0), B2 = at(s, s), B3 = at(0, s), center = at(s / 2, s / 2);
    const cols = [C.redSoft, C.greenSoft, C.blueSoft, C.orangeSoft], strokes = [C.red, C.green, C.blue, C.orange];
    const tris = [[B0, c1, c4], [B1, c2, c1], [B2, c3, c2], [B3, c4, c3]];
    f.poly([B0, B1, B2, B3], { fill: "none", stroke: C.orange, w: 2, dash: "7 5", draw: s1, opacity: s1 });
    if (s1 > 0) tris.forEach((t, i) => {
      const tt = t.map((q) => rot(q, center, -90 * s2));
      f.poly(tt, { fill: cols[i], stroke: strokes[i], w: 2, opacity: s1 * (1 - s3 * 0.85), fillOpacity: 0.9 });
    });
    f.poly([c1, c2, c3, c4], { fill: C.purpleSoft, stroke: C.purple, w: 3, draw: s0, fillOpacity: s3 > 0 ? 0.9 : 0.55 });
    [[c1, c2], [c2, c3], [c3, c4], [c4, c1]].forEach(([u, v]) => f.ticks(u, v, { opacity: clamp(s2 * 2 - 1), color: C.purple }));
    if (s2 > 0.98) [c1, c2, c3, c4].forEach((v, i, arr) => f.right(v, arr[(i + 1) % 4], arr[(i + 3) % 4], { color: C.purple }));
    if (s2 > 0 && s2 < 1) f.label(add(center, P(0, 0)), "↻", { size: 30, color: C.ink, opacity: Math.sin(s2 * Math.PI) });
    const nx = ox + (s + 1) * g + 40;
    if (s3 > 0) {
      f.note(P(nx, oy - s * g / 2 - 30), `${p.s} × ${p.s} = ${p.s * p.s}`, { anchor: "start", opacity: s3 });
      f.note(P(nx, oy - s * g / 2 + 4), `− ${p.a} × ${p.b} ÷ 2 × 4 = ${2 * p.a * p.b}`, { anchor: "start", opacity: s3 });
      f.note(P(nx, oy - s * g / 2 + 44), `넓이 ${p.area}칸`, { anchor: "start", opacity: s3, size: 24, color: C.purple });
    }
  },
};

export const PROOFS = [triSum, isosceles, regular, exterior, clock, midSquare, twoCircles, tilted];
// 쓰지 않는 도구를 지우지 않게(다른 권 논증에서 쓴다)
void sub; void mul; void dist;
