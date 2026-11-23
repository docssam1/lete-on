// 2과정 G5 「도형의 넓이와 비」 개념 꾸러미(DESIGN-COURSE2.md 4절). 열쇠 「단원 번호(0부터)/차시(1부터)」.
// 예제는 새로 지은 문제라 단계 답을 이 파일에 둔다(교재 문항·답이 아니다).
// 그림 꼴은 교재(N30) 활동 쪽과 대조해 맞췄다(2026-11-23): 원 위 같은 간격 점으로 그린 별 · 합동 조건 세 짝 · 같은 각 표시(•, ×) ·
// 꼭짓점/밑변 옮기기 · 비를 두 번 쓰는 보조선 · 둔각삼각형의 높이(연장선) · 두 높이로 밑변의 비 · 넓이 구하는 세 가지 길 · 닮음의 중심 · 피라미드/모래시계 닮음.
import { svg, text, line, poly, rect, dot, at, P, angleMark, dirOf, tick, regular, circle, sector, INK, GREEN, SOFT, MARK, YELLOW } from "./pack-kit.js?v=20261123b";

const label = (x, y, t, o = {}) => text(x, y, t, { size: 13, color: "#56627f", ...o });
const nm = (p, t, dx = 0, dy = 0) => text(p.x + dx, p.y + dy, t, { size: 14, weight: 700 });
const C3 = (type) => [[type, "concept"], [type, "type"], [type, "advanced"]];
const lerp = (a, b, t) => P(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
const mid = (a, b) => lerp(a, b, 0.5);
const GRAY = "#9aa39e", BROWN = "#a0522d";
// 직각 표시(꼭짓점 v, 두 변 방향 a1 → a2가 반시계로 90°)
const right = (v, a1, a2) => angleMark(v, a1, a2, 9, "", { color: GRAY });
// 평행 표시(변 가운데 작은 꺾쇠, 방향 a → b)
const par = (a, b) => { const m = mid(a, b), d = dirOf(a, b); return line(at(m, 6, d + 150), m, { color: GREEN, width: 1.6 }) + line(at(m, 6, d - 150), m, { color: GREEN, width: 1.6 }); };
// 비 칸(교재처럼 네모 안의 수)
const ratioBox = (p, v) => rect(p.x - 9, p.y - 9, 18, 18, { fill: "#fff", color: GREEN, width: 1.3, rx: 3 }) + text(p.x, p.y + 0.5, v, { size: 12, color: GREEN, weight: 700 });

// ── 0단원 1차시: 원 위 같은 간격의 점으로 그린 별(교재 활동 1: 중심각 → 원주각 → 꼭지각) ──
const figButterfly = () => {
  const O = P(150, 95), L1 = at(O, 110, 150), L2 = at(O, 100, 210), R1 = at(O, 100, 30), R2 = at(O, 110, -30);
  return svg(300, 190, poly([O, L1, L2], { fill: SOFT }) + poly([O, R1, R2], { fill: YELLOW })
    + angleMark(O, 150, 210, 18, "", { color: GREEN }) + angleMark(O, -30, 30, 18, "", { color: GREEN })
    + angleMark(L1, dirOf(L1, L2), dirOf(L1, O), 16, "") + angleMark(L2, dirOf(L2, O), dirOf(L2, L1), 16, "")
    + angleMark(R1, dirOf(R1, O), dirOf(R1, R2), 16, "", { color: BROWN }) + angleMark(R2, dirOf(R2, R1), dirOf(R2, O), 16, "", { color: BROWN })
    + label(150, 178, "초록 = 맞꼭지각"), "나비 모양");
};
const starInCircle = (n, skip, { tipLabel = "", centralLabel = "" } = {}) => {
  const O = P(140, 130), r = 100, v = regular(O, r, n, 90);
  const order = []; let k = 0;
  for (let i = 0; i < n; i += 1) { order.push(k); k = (k + skip + 1) % n; }
  const a = 90 + (360 / n) * (skip + 1), b = 90 + (360 / n) * (n - skip - 1);   // 꼭대기 꼭지각이 마주 보는 호의 두 끝
  let body = circle(O, r, { color: GRAY, width: 1.4, dash: "5 4" }) + sector(O, r, a, b, { fill: YELLOW, color: "#d8b24a", width: 1.2 });
  const star = n === 6 && skip === 1   // 육각별은 한붓으로 안 이어져 정삼각형 둘
    ? poly([v[0], v[2], v[4]], { fill: "rgba(230,239,232,.75)" }) + poly([v[1], v[3], v[5]], { fill: "rgba(230,239,232,.75)" })
    : poly(order.map((i) => v[i]), { fill: "rgba(230,239,232,.75)" });
  body += star + line(O, at(O, r, a), { color: GREEN, width: 1.5 }) + line(O, at(O, r, b), { color: GREEN, width: 1.5 })
    + angleMark(O, a, b, 16, centralLabel, { color: GREEN, size: 13 })
    + angleMark(v[0], dirOf(v[0], at(O, r, a)), dirOf(v[0], at(O, r, b)), 24, tipLabel, { size: 13, gap: 14 })
    + v.map((p) => dot(p, 3.4)).join("") + dot(O, 3) + text(O.x + 10, O.y - 10, "O", { size: 12, color: GREEN });
  return svg(280, 250, body, "원 위에 같은 간격으로 찍은 점으로 그린 별");
};
const figStar = () => starInCircle(5, 1, { tipLabel: "36°", centralLabel: "72°" });
const figHexStar = () => starInCircle(6, 1, { tipLabel: "?", centralLabel: "?" });

// ── 0단원 2차시: 합동 조건 세 짝(교재 활동 2 ②) ──
const pair = (ox, kind) => {
  const A = P(ox + 8, 110), B = P(ox + 66, 110), C = P(ox + 26, 40);
  const D = P(A.x + 74, A.y), E = P(B.x + 74, B.y), F = P(C.x + 74, C.y);
  let body = poly([A, B, C], { fill: SOFT, width: 1.8 }) + poly([D, E, F], { fill: YELLOW, width: 1.8 });
  const angA = (p, q, s) => angleMark(p, dirOf(p, q), dirOf(p, s), 11, "");
  if (kind === "sss") body += tick(A, B, 1) + tick(D, E, 1) + tick(B, C, 2) + tick(E, F, 2) + tick(C, A, 3) + tick(F, D, 3);
  if (kind === "sas") body += tick(A, B, 1) + tick(D, E, 1) + tick(C, A, 2) + tick(F, D, 2) + angA(A, B, C) + angA(D, E, F);
  if (kind === "asa") body += tick(A, B, 1) + tick(D, E, 1) + angA(A, B, C) + angA(D, E, F)
    + angleMark(B, dirOf(B, C), 180, 11, "", { color: GREEN }) + angleMark(E, dirOf(E, F), 180, 11, "", { color: GREEN });
  return body;
};
const figCongruentSum = () => svg(480, 145, pair(0, "sss") + pair(162, "sas") + pair(324, "asa")
  + label(77, 134, "세 변", { size: 15 }) + label(239, 134, "두 변과 끼인각", { size: 15 }) + label(401, 134, "한 변과 양 끝 각", { size: 15 }), "합동 조건 세 가지");
const figCongruent = () => {
  const A = P(30, 150), B = P(160, 150), C = P(70, 40), D = P(340, 40), E = P(210, 40), F = P(300, 150);
  return svg(370, 180, poly([A, B, C], { fill: SOFT }) + poly([D, E, F], { fill: YELLOW }) + tick(A, B, 1) + tick(D, E, 1) + tick(B, C, 2) + tick(E, F, 2) + tick(C, A, 3) + tick(F, D, 3)
    + angleMark(A, dirOf(A, B), dirOf(A, C), 18, "70°", { size: 12 }) + angleMark(B, dirOf(B, C), 180, 18, "45°", { size: 12 }) + angleMark(F, dirOf(F, D), dirOf(F, E), 18, "?", { size: 13 })
    + nm(A, "ㄱ", -10, 6) + nm(B, "ㄴ", 10, 6) + nm(C, "ㄷ", 0, -12) + nm(D, "ㄹ", 10, -6) + nm(E, "ㅁ", -10, -6) + nm(F, "ㅂ", 0, 14), "합동인 두 삼각형");
};

// ── 0단원 3차시: 같은 각은 같은 표시(•, ×)로 · 바깥 각(교재 활동 3) ──
const figEqualAngles = () => {
  const v = regular(P(150, 105), 78, 3, 90);
  return svg(300, 170, poly(v, { fill: SOFT }) + v.map((p, i) => angleMark(p, dirOf(p, v[(i + 1) % 3]), dirOf(p, v[(i + 2) % 3]), 18, "□", { size: 13, gap: 13 })).join(""), "세 각이 같은 삼각형");
};
const figExterior = () => {
  const A = P(120, 30), B = P(30, 160), C = P(220, 160), X = P(320, 160);
  return svg(340, 190, poly([A, B, C], { fill: SOFT }) + line(C, X, { color: GRAY, dash: "6 4" })
    + angleMark(A, dirOf(A, B), dirOf(A, C), 20, "•", { size: 26, gap: 12 }) + angleMark(B, 0, dirOf(B, A), 22, "×", { size: 19, gap: 12, color: BROWN })
    + angleMark(C, 0, dirOf(C, A), 24, "• + ×", { size: 18, gap: 26, color: GREEN })
    + label(170, 180, "바깥 각 = 이웃하지 않은 두 내각의 합"), "삼각형의 바깥 각");
};
const figBisector = () => {
  const A = P(150, 20), B = P(40, 200), C = P(290, 200);
  const a = Math.hypot(C.x - B.x, C.y - B.y), b = Math.hypot(A.x - C.x, A.y - C.y), c = Math.hypot(B.x - A.x, B.y - A.y);
  const I = P((a * A.x + b * B.x + c * C.x) / (a + b + c), (a * A.y + b * B.y + c * C.y) / (a + b + c));
  return svg(330, 230, poly([A, B, C], { fill: SOFT }) + line(B, I) + line(C, I)
    + angleMark(B, 0, dirOf(B, I), 30, "•", { size: 24, gap: 12 }) + angleMark(B, dirOf(B, I), dirOf(B, A), 40, "•", { size: 24, gap: 12 })
    + angleMark(C, dirOf(C, I), 180, 30, "×", { size: 18, gap: 12, color: BROWN }) + angleMark(C, dirOf(C, A), dirOf(C, I), 40, "×", { size: 18, gap: 12, color: BROWN })
    + angleMark(A, dirOf(A, B), dirOf(A, C), 22, "70°", { size: 14, gap: 16 }) + angleMark(I, dirOf(I, B), dirOf(I, C), 14, "?", { size: 16, gap: 13, color: GREEN })
    + nm(A, "ㄱ", 0, -12) + nm(B, "ㄴ", -12, 6) + nm(C, "ㄷ", 12, 6) + nm(I, "ㄹ", 0, -14), "두 각을 똑같이 나눈 선");
};

// ── 1단원 1차시: 등적변형 — 꼭짓점 옮기기 · 밑변 옮기기(교재 활동 1 ①②) ──
const figSlide = () => {
  const B = P(40, 160), C = P(220, 160), A = P(80, 60), A2 = P(250, 60);
  return svg(300, 190, line(P(20, 60), P(290, 60), { color: GREEN, dash: "6 4" }) + poly([A, B, C], { fill: SOFT }) + poly([A2, B, C], { fill: "rgba(255,241,191,.7)" }) + nm(A, "가", 0, -14) + nm(A2, "나", 0, -14) + label(130, 178, "밑변이 같고 높이가 같다"), "평행선 위로 꼭짓점 옮기기");
};
const figSlide2 = () => {
  const B = P(40, 150), C = P(200, 150), A = P(70, 50), A2 = P(150, 50), A3 = P(250, 50);
  let body = line(P(20, 50), P(300, 50), { color: GREEN, dash: "6 4" }) + poly([A, B, C], { fill: SOFT }) + poly([A2, B, C], { fill: "rgba(255,241,191,.55)" }) + poly([A3, B, C], { fill: "rgba(249,200,196,.35)" })
    + text(160, 170, "① 꼭짓점을 평행선 따라", { size: 16, color: GREEN });
  const T = P(110, 200), xs = [30, 100, 170, 240];
  body += line(P(15, 290), P(305, 290), { color: GRAY, width: 1.4 }) + poly([T, P(xs[0], 290), P(xs[1], 290)], { fill: SOFT }) + poly([T, P(xs[1], 290), P(xs[2], 290)], { fill: "rgba(255,241,191,.7)" }) + poly([T, P(xs[2], 290), P(xs[3], 290)], { fill: "rgba(249,200,196,.4)" })
    + [0, 1, 2].map((i) => tick(P(xs[i], 290), P(xs[i + 1], 290), 1)).join("")
    + text(160, 312, "② 같은 길이의 밑변을 옮겨", { size: 16, color: GREEN });
  return svg(320, 320, body, "등적변형 두 가지");
};
const figTrapDiag = () => {
  const A = P(110, 40), D = P(190, 40), B = P(60, 170), C = P(260, 170), O = lerp(A, C, 2 / 7);
  const cen = (p, q, r) => P((p.x + q.x + r.x) / 3, (p.y + q.y + r.y) / 3), L = cen(A, B, O), Rr = cen(D, O, C);
  return svg(320, 200, line(P(40, 40), P(280, 40), { color: GREEN, dash: "6 4", width: 1.2 }) + poly([A, B, C, D], { fill: "#fff" }) + poly([A, B, O], { fill: YELLOW }) + poly([D, O, C], { fill: "rgba(255,241,191,.6)" }) + line(A, C) + line(B, D)
    + par(A, D) + par(B, C) + text(L.x - 4, L.y + 4, "18㎠", { size: 12 }) + text(Rr.x + 4, Rr.y + 4, "?", { size: 15, color: MARK }), "대각선을 그은 사다리꼴");
};

// ── 1단원 2·3차시: 높이가 같은 삼각형 · 비를 두 번(교재 활동 2·3) ──
const figRatio = (m = 2, n = 3) => {
  const A = P(120, 30), B = P(30, 170), C = P(300, 170), D = lerp(B, C, m / (m + n));
  return svg(330, 205, poly([A, B, C], { fill: "#fff" }) + poly([A, B, D], { fill: YELLOW }) + line(A, D) + line(A, P(120, 170), { color: GREEN, dash: "5 4", width: 1.4 }) + right(P(120, 170), 0, 90)
    + text((A.x + B.x + D.x) / 3 - 6, (A.y + B.y + D.y) / 3 + 14, "㉮", { size: 14 }) + text((A.x + D.x + C.x) / 3 + 6, (A.y + D.y + C.y) / 3 + 14, "㉯", { size: 14 })
    + ratioBox(P((B.x + D.x) / 2, 190), m) + ratioBox(P((D.x + C.x) / 2, 190), n), `밑변을 ${m} : ${n}으로 나눈 삼각형`);
};
const figTwice = () => {
  const A = P(130, 24), B = P(30, 190), C = P(320, 190), D = lerp(A, B, 1 / 3), E = lerp(A, C, 3 / 5);
  return svg(350, 215, poly([A, B, C], { fill: "#fff" }) + poly([A, D, C], { fill: "rgba(230,239,232,.8)" }) + poly([A, D, E], { fill: YELLOW }) + line(D, C, { color: GREEN, dash: "6 4", width: 1.6 }) + line(D, E)
    + ratioBox(at(mid(A, D), 16, dirOf(A, D) - 90), 1) + ratioBox(at(mid(D, B), 16, dirOf(A, D) - 90), 2) + ratioBox(at(mid(A, E), 16, dirOf(A, E) + 90), 3) + ratioBox(at(mid(E, C), 16, dirOf(A, E) + 90), 2)
    + nm(A, "ㄱ", 0, -12) + nm(B, "ㄴ", -12, 6) + nm(C, "ㄷ", 12, 6) + nm(D, "ㄹ", -14, 0) + nm(E, "ㅁ", 12, -6)
    + text(165, 206, "초록 점선 = 보조선 ㄹㄷ", { size: 12, color: GREEN }), "보조선으로 비를 두 번 쓰는 삼각형");
};

// ── 2단원: 높이와 넓이 · 두 높이로 밑변의 비 · 식으로 넓이(교재 활동 1~3) ──
const figSimpleHeight = () => svg(300, 190, poly([P(110, 30), P(30, 160), P(260, 160)], { fill: SOFT }) + line(P(110, 30), P(110, 160), { color: GREEN, dash: "5 4", width: 1.8 }) + right(P(110, 160), 0, 90)
  + label(145, 178, "밑변 8cm") + label(116, 96, "높이 ?", { anchor: "start", color: GREEN }), "삼각형의 밑변과 높이");
// 둔각삼각형: 밑변 12, 높이 8, 다른 변 16(수에 맞춰 그림), 높이 하나는 밑변의 연장선 위에 떨어진다
const figHeights = () => {
  const s = 14, o = P(30, 170), u = (x, y) => P(o.x + x * s, o.y - y * s);
  const ax = Math.sqrt(16 * 16 - 64), B = u(0, 0), C = u(12, 0), A = u(ax, 8), H = u(ax, 0);
  const t = (12 * ax) / 256, F = u(t * ax, t * 8);
  return svg(300, 200, line(C, H, { color: GRAY, dash: "4 4", width: 1.4 }) + poly([A, B, C], { fill: SOFT }) + line(A, H, { color: GREEN, dash: "5 4", width: 1.8 }) + line(C, F, { color: BROWN, dash: "5 4", width: 1.8 })
    + right(H, 90, 180) + right(F, dirOf(F, C), dirOf(F, A))
    + label(mid(B, C).x, 186, "12cm") + label(A.x + 8, (A.y + H.y) / 2, "8cm", { anchor: "start", color: GREEN }) + label(mid(A, B).x - 22, mid(A, B).y - 10, "16cm") + label(mid(C, F).x + 12, mid(C, F).y + 6, "?", { color: MARK, size: 15 }), "둔각삼각형의 두 높이");
};
const figTwoHeights = (hA = "8cm", hB = "12cm") => {
  const B = P(30, 180), C = P(290, 180), A = P(200, 40), H = P(200, 180);
  const dir = P((C.x - A.x) / Math.hypot(C.x - A.x, C.y - A.y), (C.y - A.y) / Math.hypot(C.x - A.x, C.y - A.y));
  const tt = (B.x - A.x) * dir.x + (B.y - A.y) * dir.y, F = P(A.x + tt * dir.x, A.y + tt * dir.y);
  return svg(320, 210, poly([A, B, C], { fill: SOFT }) + line(A, H, { color: GREEN, dash: "5 4", width: 1.8 }) + line(B, F, { color: BROWN, dash: "5 4", width: 1.8 })
    + right(H, 90, 180) + right(F, dirOf(F, A), dirOf(F, B))
    + text(mid(B, C).x, 198, "변 가", { size: 13, weight: 700 }) + text(mid(A, C).x + 26, mid(A, C).y + 6, "변 나", { size: 13, weight: 700 })
    + label(A.x - 6, 152, hA, { anchor: "end", color: GREEN }) + label(at(mid(B, F), 16, dirOf(B, F) + 90).x, at(mid(B, F), 16, dirOf(B, F) + 90).y, hB, { color: BROWN }), "두 변과 두 높이");
};
const figTrapEq = () => svg(320, 180, poly([P(90, 30), P(190, 30), P(270, 140), P(30, 140)], { fill: YELLOW }) + line(P(190, 30), P(190, 140), { color: GREEN, dash: "5 4" }) + right(P(190, 140), 90, 180)
  + label(140, 16, "윗변 □cm") + label(150, 158, "아랫변 13cm") + label(184, 92, "높이 8cm", { anchor: "end", color: GREEN }), "사다리꼴");
const figTrapSplit = () => {
  const A = P(90, 30), D = P(190, 30), C = P(270, 140), B = P(30, 140);
  return svg(320, 175, poly([A, B, C], { fill: SOFT }) + poly([A, C, D], { fill: YELLOW }) + line(A, C, { color: GREEN, dash: "6 4", width: 1.6 })
    + label(140, 16, "윗변") + label(150, 158, "아랫변") + text(110, 112, "아랫변 × 높이 ÷ 2", { size: 11, color: GREEN }) + text(196, 56, "윗변 × 높이 ÷ 2", { size: 10, color: "#8a6a1e" }), "사다리꼴을 삼각형 둘로");
};
const figAreaWays = () => {
  // ① 원래 도형 복원 ② 전체에서 바깥 빼기 ③ 삼각형으로 쪼개기
  let body = poly([P(10, 130), P(140, 130), P(100, 80), P(50, 80)], { fill: YELLOW }) + line(P(50, 80), P(75, 48.75), { color: GREEN, dash: "5 4", width: 1.5 }) + line(P(100, 80), P(75, 48.75), { color: GREEN, dash: "5 4", width: 1.5 });
  body += rect(170, 50, 130, 80, { color: GREEN, dash: "5 4", width: 1.5 }) + poly([P(170, 90), P(250, 50), P(300, 130)], { fill: YELLOW });
  body += poly([P(330, 130), P(462, 130), P(440, 52), P(356, 70)], { fill: "#fff" }) + poly([P(330, 130), P(462, 130), P(356, 70)], { fill: SOFT }) + poly([P(462, 130), P(440, 52), P(356, 70)], { fill: YELLOW }) + line(P(356, 70), P(462, 130), { color: GREEN, dash: "5 4", width: 1.5 });
  return svg(480, 165, body + label(75, 150, "① 원래 도형으로 늘리기") + label(235, 150, "② 전체에서 바깥 빼기") + label(396, 150, "③ 삼각형으로 쪼개기"), "넓이를 구하는 세 가지 길");
};

// ── 3단원: 닮음의 중심 · 피라미드/모래시계 닮음(교재 활동 1·2) ──
const figSimilar = () => svg(340, 170, poly([P(20, 150), P(110, 150), P(40, 90)], { fill: SOFT }) + poly([P(140, 150), P(320, 150), P(180, 30)], { fill: YELLOW }) + label(65, 165, "4cm") + label(230, 165, "8cm"), "닮은 두 삼각형");
const figCenter = () => {
  const O = P(14, 110), A = P(50, 80), B = P(44, 135), C = P(76, 118), k = 2.5;
  const far = (p) => P(O.x + (p.x - O.x) * k, O.y + (p.y - O.y) * k), D = far(A), E = far(B), F = far(C);
  return svg(300, 210, [D, E, F].map((p) => line(O, p, { color: GRAY, dash: "4 4", width: 1.2 })).join("") + poly([A, B, C], { fill: SOFT }) + poly([D, E, F], { fill: YELLOW })
    + dot(O, 3.4) + text(O.x - 2, O.y - 14, "O", { size: 13, color: GREEN, weight: 700 }) + nm(A, "ㄱ", -4, -12) + nm(B, "ㄴ", -10, 10) + nm(C, "ㄷ", 6, 12) + nm(D, "ㄹ", 0, -12) + nm(E, "ㅁ", -6, 14) + nm(F, "ㅂ", 12, 6)
    + label(150, 200, "△ㄱㄴㄷ ∽ △ㄹㅁㅂ · O에서 잰 길이가 모두 같은 배"), "닮음의 중심");
};
const figParallelAngle = () => {
  const p1 = P(120, 140), d = 50, dx = 80 / Math.tan(d * Math.PI / 180), p2 = P(120 + dx, 60);
  return svg(320, 180, line(P(20, 60), P(300, 60)) + line(P(20, 140), P(300, 140)) + par(P(250, 60), P(290, 60)) + par(P(250, 140), P(290, 140))
    + line(at(p1, 40, d + 180), at(p2, 40, d), { color: GREEN }) + angleMark(p1, 0, d, 20, "50°", { size: 13 }) + angleMark(p2, 0, d, 20, "?", { size: 15 })
    + label(160, 172, "평행한 두 직선"), "평행선과 한 직선");
};
const figPyrHour = () => {
  const A = P(100, 24), B = P(24, 176), C = P(190, 176), D = lerp(A, B, 0.5), E = lerp(A, C, 0.5);
  const A2 = P(340, 96), B2 = P(272, 176), C2 = P(420, 176), k = 0.6, D2 = P(A2.x + k * (A2.x - C2.x), A2.y + k * (A2.y - C2.y)), E2 = P(A2.x + k * (A2.x - B2.x), A2.y + k * (A2.y - B2.y));
  let body = poly([A, B, C], { fill: "#fff" }) + poly([A, D, E], { fill: YELLOW }) + line(D, E) + par(D, E) + par(B, C)
    + angleMark(B, 0, dirOf(B, A), 16, "", { color: MARK }) + angleMark(D, 0, dirOf(D, A), 16, "", { color: MARK })
    + nm(A, "ㄱ", 0, -12) + nm(B, "ㄴ", -12, 4) + nm(C, "ㄷ", 12, 4) + nm(D, "ㄹ", -14, 0) + nm(E, "ㅁ", 14, 0);
  body += poly([A2, B2, C2], { fill: "#fff" }) + poly([A2, D2, E2], { fill: YELLOW }) + par(D2, E2) + par(B2, C2)
    + angleMark(B2, 0, dirOf(B2, A2), 16, "", { color: MARK }) + angleMark(E2, 180, dirOf(E2, A2), 16, "", { color: MARK })
    + nm(A2, "ㄱ", 16, 0) + nm(B2, "ㄴ", -12, 4) + nm(C2, "ㄷ", 12, 4) + nm(D2, "ㅁ", -12, -4) + nm(E2, "ㄹ", 12, -4)   // ㄹ은 직선 ㄴㄱ 위, ㅁ은 직선 ㄷㄱ 위;
  return svg(450, 215, body + label(107, 202, "피라미드 닮음") + label(346, 202, "모래시계 닮음"), "피라미드 닮음과 모래시계 닮음");
};
const figPyramidEx = () => {
  const A = P(130, 20), B = P(30, 190), C = P(300, 190), D = lerp(A, B, 0.6), E = lerp(A, C, 0.6);
  return svg(330, 215, poly([A, B, C], { fill: "#fff" }) + poly([A, D, E], { fill: YELLOW }) + line(D, E) + par(D, E) + par(B, C)
    + nm(A, "ㄱ", 0, -12) + nm(B, "ㄴ", -12, 4) + nm(C, "ㄷ", 12, 4) + nm(D, "ㄹ", -14, 0) + nm(E, "ㅁ", 14, 0)
    + label(mid(A, D).x - 20, mid(A, D).y, "6cm") + label(mid(D, B).x - 20, mid(D, B).y, "4cm") + label(mid(D, E).x, D.y - 10, "9cm") + label(mid(B, C).x, 205, "?", { color: MARK, size: 15 }), "밑변과 평행한 선을 그은 삼각형");
};

export const PACKS = {
  "0/1": [{
    id: "star-butterfly", title: "정다각별과 나비각",
    recall: { figure: figButterfly, text: "두 직선이 만나 생긴 맞꼭지각(초록)은 크기가 같습니다.", ask: "맞꼭지각을 낀 두 삼각형에서 나머지 두 각의 합(빨강 둘, 갈색 둘)은?", options: ["같다", "다르다"], answer: 0, why: "둘 다 180°에서 같은 맞꼭지각을 뺀 것이에요.", hint: "180 − 맞꼭지각" },
    explore: [["lab", "angles", "각 떼어 모으기"]],
    proofs: [["butterfly", "나비각"], ["star-tips", "별의 꼭지각을 모으면"], ["inscribed-angle", "원 위의 각"]],
    summary: {
      figure: figStar,
      terms: [["중심각 · 원주각", "호의 두 끝을 원의 가운데 O와 이은 각 · 원 위의 한 점과 이은 각"], ["정다각별", "원 위에 같은 간격으로 찍은 점을 같은 수씩 건너뛰며 이은 별"]],
      facts: ["점이 n개이면 한 칸 호의 중심각은 <b>360 ÷ n</b>", "같은 호에 대한 원주각 = 중심각의 <b>반</b> → 별의 꼭지각은 마주 보는 호의 원주각", "오각별: 꼭지각 하나 = 72 ÷ 2 = 36°, 다섯 개의 합 = <b>180°</b> · 나비각으로 각을 옮겨 모아도 같다"]
    },
    pitfall: "꼭지각이 마주 보는 호가 몇 칸인지 세어야 합니다. 별의 안쪽 각(가운데 다각형의 내각)과 꼭지각을 섞지 않습니다.",
    example: {
      prompt: "원 위에 같은 간격으로 6개의 점을 찍고 하나씩 건너 이어 육각별(정삼각형 두 개를 겹친 모양)을 그렸습니다. 꼭지각 6개의 합은?",
      figure: figHexStar,
      steps: [
        { ask: "한 칸 호의 중심각은? 360 ÷ 6 =", answer: "60", unit: "°", why: "원 한 바퀴 360°를 6칸으로 나눕니다.", hint: "360 ÷ 6" },
        { ask: "꼭지각이 마주 보는 호는 2칸 — 꼭지각 하나는? 60 × 2 ÷ 2 =", answer: "60", unit: "°", why: "2칸의 중심각은 120°이고, 원주각은 그 반이라 60°입니다.", hint: "중심각의 반" },
        { ask: "꼭지각 6개의 합은?", answer: "360", unit: "°", why: "60 × 6 = 360°입니다. 정삼각형 두 개의 각을 모은 180 × 2와도 같습니다.", hint: "60 × 6" }
      ]
    },
    check: [["c2-star-angle-sum", "concept"], ["c2-butterfly-angle", "type"], ["c2-star-angle-sum", "advanced"]]
  }],
  "0/2": [{
    id: "congruence", title: "삼각형의 합동",
    recall: { figure: figCongruent, text: "모양과 크기가 같아 완전히 겹치는 두 도형을 합동이라 합니다. 같은 표시는 길이가 같은 변입니다.", ask: "합동인 두 삼각형에서 대응하는 변의 길이는?", options: ["같다", "다를 수 있다"], answer: 0, why: "완전히 겹치니 대응하는 변도 겹쳐요.", hint: "겹쳐 보세요." },
    explore: [],
    proofs: [],
    summary: {
      figure: figCongruentSum,
      terms: [["대응", "겹쳤을 때 포개어지는 꼭짓점·변·각"], ["≡", "합동을 나타내는 기호 — △ㄱㄴㄷ ≡ △ㄹㅁㅂ"]],
      facts: ["합동 조건 셋: <b>세 변</b> / <b>두 변과 끼인각</b> / <b>한 변과 양 끝 각</b>", "대응하는 변의 길이·대응하는 각의 크기는 같다", "기호로 쓸 때는 <b>대응하는 꼭짓점의 차례</b>를 맞춰 쓴다"]
    },
    pitfall: "두 변과 끼이지 않은 각이 같다고 합동은 아닙니다. 각은 두 변 사이에 끼여 있어야 합니다.",
    example: {
      prompt: "삼각형 ㄱㄴㄷ과 ㄹㅁㅂ이 합동이고 ㄱ↔ㄹ, ㄴ↔ㅁ, ㄷ↔ㅂ입니다. 각 ㄱ = 70°, 각 ㄴ = 45°일 때 각 ㅂ은?",
      figure: figCongruent,
      steps: [
        { ask: "각 ㄷ = 180 − 70 − 45 =", answer: "65", unit: "°", why: "삼각형 세 각의 합은 180°입니다.", hint: "180 − 115" },
        { ask: "각 ㅂ은 각 ㄷ에 대응 — 각 ㅂ은?", answer: "65", unit: "°", why: "대응하는 각의 크기는 같습니다.", hint: "같아요." }
      ]
    },
    check: C3("c2-congruent-triangle")
  }],
  "0/3": [{
    id: "angle-equations", title: "식을 세워 각 구하기",
    recall: { figure: figEqualAngles, text: "삼각형의 세 각을 모으면 180°입니다. 같은 표시를 한 각은 크기가 같습니다.", ask: "세 각이 모두 □로 같으면 □는?", options: ["45°", "60°", "90°"], answer: 1, why: "□ × 3 = 180, □ = 60°예요.", hint: "180 ÷ 3" },
    explore: [],
    proofs: [],
    summary: {
      figure: figExterior,
      terms: [["같은 표시", "크기가 같은 각에 •, × 같은 표시를 하고 그 표시로 식을 쓴다"]],
      facts: ["세 각의 합: • + × + (나머지 각) = 180", "<b>바깥 각 = 이웃하지 않은 두 내각의 합</b>(• + ×) — 안쪽 각보다 빨리 식이 선다", "세 각의 비 2 : 3 : 4 → 한 칸 = 180 ÷ (2 + 3 + 4)"]
    },
    pitfall: "• 하나와 • 둘을 섞지 않습니다. 똑같이 둘로 나눈 각은 • + • 처럼 표시의 개수까지 식에 씁니다.",
    example: {
      prompt: "삼각형 ㄱㄴㄷ에서 각 ㄴ과 각 ㄷ을 각각 똑같이 둘로 나눈 선이 점 ㄹ에서 만납니다. 각 ㄱ이 70°일 때 각 ㄴㄹㄷ은 몇 도인가요?",
      figure: figBisector,
      steps: [
        { ask: "(• + •) + (× + ×) = 180 − 70 =", answer: "110", unit: "°", why: "삼각형 ㄱㄴㄷ의 세 각의 합이 180°입니다.", hint: "180 − 70" },
        { ask: "• + × =", answer: "55", unit: "°", why: "• 둘과 × 둘의 합이 110°이니 반은 55°입니다.", hint: "110 ÷ 2" },
        { ask: "각 ㄴㄹㄷ = 180 − (• + ×) =", answer: "125", unit: "°", why: "삼각형 ㄹㄴㄷ의 세 각은 •, ×, 각 ㄴㄹㄷ입니다.", hint: "180 − 55" }
      ]
    },
    check: C3("c2-angle-equation")
  }],
  "1/1": [{
    id: "equal-area", title: "평행선과 등적변형",
    recall: { figure: figSlide, text: "삼각형의 넓이 = 밑변 × 높이 ÷ 2.", ask: "밑변과 높이가 같은 두 삼각형 가, 나의 넓이는?", options: ["같다", "모양에 따라 다르다"], answer: 0, why: "넓이는 밑변과 높이만으로 정해져요.", hint: "식을 보세요." },
    explore: [],
    proofs: [["equal-area", "꼭짓점을 평행선 위로 옮겨도 넓이가 같은 까닭"]],
    summary: {
      figure: figSlide2,
      terms: [["등적변형", "넓이를 그대로 두고 모양만 바꾸기"]],
      facts: ["밑변을 두고 꼭짓점을 밑변과 <b>평행한 직선을 따라</b> 옮기면 높이가 그대로 → 넓이 그대로", "꼭짓점을 두고 밑변을 <b>같은 직선 위에서 같은 길이로</b> 옮겨도 넓이 그대로", "사다리꼴의 두 대각선으로 생긴 양옆 두 삼각형은 <b>넓이가 같다</b>"]
    },
    pitfall: "꼭짓점을 아무 방향으로나 옮기면 높이가 변합니다. 밑변과 평행한 방향만 됩니다.",
    example: {
      prompt: "사다리꼴(위아래 변이 평행)의 두 대각선이 만나 네 삼각형이 생겼습니다. 왼쪽 삼각형이 18㎠일 때 오른쪽 삼각형의 넓이는?",
      figure: figTrapDiag,
      steps: [
        { ask: "아랫변을 밑변으로 하는 두 큰 삼각형(왼쪽 위 꼭짓점·오른쪽 위 꼭짓점)의 넓이는 같은가요? 같으면 1, 다르면 0", answer: "1", unit: "", why: "밑변이 같고 꼭짓점이 아랫변과 평행한 윗변 위라 높이도 같습니다.", hint: "등적변형" },
        { ask: "둘에서 아래쪽 삼각형을 똑같이 빼면 오른쪽 삼각형은?", answer: "18", unit: "㎠", why: "같은 넓이에서 같은 것을 빼면 남은 것도 같습니다.", hint: "왼쪽과 같아요." }
      ]
    },
    check: C3("c2-equal-area-shift")
  }],
  "1/2": [{
    id: "ratio-same-height", title: "높이가 같은 삼각형의 넓이의 비",
    recall: { figure: () => figRatio(1, 1), text: "꼭짓점이 같고 밑변이 한 직선 위에 있으면 두 삼각형의 높이가 같습니다.", ask: "높이가 같은 ㉮와 ㉯의 밑변이 같으면 넓이는?", options: ["같다", "다르다"], answer: 0, why: "밑변과 높이가 같으니 넓이도 같아요.", hint: "밑변 × 높이 ÷ 2" },
    explore: [],
    proofs: [["ratio-twice", "비를 두 번 쓰는 넓이"]],
    summary: {
      figure: figRatio,
      terms: [["넓이의 비", "높이가 같은 두 삼각형의 넓이는 밑변의 길이에 비례한다"]],
      facts: ["점이 밑변을 2 : 3으로 나누면 ㉮ : ㉯도 <b>2 : 3</b>", "전체를 2 + 3 = 5칸으로 보고 한 칸의 넓이를 구한다", "넓이를 알면 거꾸로 밑변의 비도 구한다"]
    },
    pitfall: "꼭짓점이 다르면 높이가 달라 밑변의 비를 쓸 수 없습니다.",
    example: {
      prompt: "넓이가 40㎠인 삼각형의 밑변 위 점이 밑변을 2 : 3으로 나눕니다. ㉮의 넓이는?",
      figure: figRatio,
      steps: [
        { ask: "전체는 2 + 3 = 5칸 — 한 칸은 40 ÷ 5 =", answer: "8", unit: "㎠", why: "높이가 같아 넓이도 2 : 3으로 나뉩니다.", hint: "40 ÷ 5" },
        { ask: "㉮는 2칸 =", answer: "16", unit: "㎠", why: "2 × 8 = 16㎠입니다.", hint: "2 × 8" }
      ]
    },
    check: C3("c2-area-ratio-base")
  }],
  "1/3": [{
    id: "same-height-apply", title: "높이가 같은 삼각형의 응용 — 비를 두 번",
    recall: { figure: () => figRatio(1, 2), text: "높이가 같은 두 삼각형의 넓이의 비는 밑변의 비입니다.", ask: "전체 30㎠인 삼각형의 밑변을 1 : 2로 나누면 ㉮는?", options: ["10㎠", "15㎠", "20㎠"], answer: 0, why: "1 + 2 = 3칸, 30 ÷ 3 = 10이 한 칸이에요.", hint: "30 ÷ 3" },
    explore: [],
    proofs: [["ratio-twice", "비를 두 번 쓰는 넓이"]],
    summary: {
      figure: figTwice,
      terms: [["보조선", "높이가 같은 삼각형을 만들려고 새로 긋는 선(ㄹㄷ)"]],
      facts: ["① 보조선 ㄹㄷ: 삼각형 ㄱㄹㄷ = 전체의 <b>1/3</b>(ㄱㄹ : ㄱㄴ = 1 : 3)", "② 삼각형 ㄱㄹㅁ = 삼각형 ㄱㄹㄷ의 <b>3/5</b>(ㄱㅁ : ㄱㄷ = 3 : 5)", "색칠한 삼각형 = 전체 × 1/3 × 3/5 — 비를 차례로 두 번"]
    },
    pitfall: "1 : 2로 나눈 작은 쪽은 전체의 1/3입니다. 1/2로 계산하지 않습니다.",
    example: {
      prompt: "넓이가 60㎠인 삼각형 ㄱㄴㄷ에서 점 ㄹ은 변 ㄱㄴ을 1 : 2로, 점 ㅁ은 변 ㄱㄷ을 3 : 2로 나눕니다. 삼각형 ㄱㄹㅁ의 넓이는?",
      figure: figTwice,
      steps: [
        { ask: "보조선 ㄹㄷ — 삼각형 ㄱㄹㄷ은? 60 ÷ 3 × 1 =", answer: "20", unit: "㎠", why: "삼각형 ㄱㄹㄷ과 ㄹㄴㄷ은 높이가 같아 넓이가 1 : 2로 나뉩니다.", hint: "60 ÷ 3" },
        { ask: "삼각형 ㄱㄹㅁ은? 20 ÷ 5 × 3 =", answer: "12", unit: "㎠", why: "삼각형 ㄱㄹㅁ과 ㅁㄹㄷ은 높이가 같아 삼각형 ㄱㄹㄷ이 3 : 2로 나뉩니다.", hint: "20 ÷ 5 × 3" }
      ]
    },
    check: [["c2-area-ratio-base", "type"], ["c2-area-ratio-base", "advanced"], ["c2-triangle-area", "type"]]
  }],
  "2/1": [{
    id: "base-height-inverse", title: "삼각형의 높이와 두 밑변",
    recall: { figure: figSimpleHeight, text: "꼭짓점에서 밑변에 수직으로 내린 선의 길이가 높이이고, 삼각형의 넓이 = 밑변 × 높이 ÷ 2입니다.", ask: "넓이가 24㎠이고 밑변이 8cm이면 높이는?", options: ["6cm", "3cm", "12cm"], answer: 0, why: "24 × 2 ÷ 8 = 6cm예요.", hint: "넓이 × 2 ÷ 밑변" },
    explore: [],
    proofs: [["base-height-inverse", "밑변이 길면 높이가 짧은 까닭"]],
    summary: {
      figure: figHeights,
      terms: [["수선의 발", "꼭짓점에서 밑변(또는 그 연장선)에 수직으로 그은 선이 만나는 점"], ["밑변 × 높이", "어느 밑변으로 재도 같은 값(넓이의 두 배)"]],
      facts: ["삼각형에는 높이가 <b>셋</b> — 둔각삼각형은 밑변의 <b>연장선</b>에 수선을 내린다", "밑변 × 그 높이 = <b>다른 밑변 × 그 높이</b>", "밑변이 길수록 그 높이는 짧다"]
    },
    pitfall: "다른 변을 밑변으로 할 때 높이는 그 변(또는 늘인 선)에 수직이어야 합니다.",
    example: {
      prompt: "밑변 12cm에 대한 높이가 8cm인 삼각형에서, 길이 16cm인 다른 변에 대한 높이는?",
      figure: figHeights,
      steps: [
        { ask: "밑변 × 높이 = 12 × 8 =", answer: "96", unit: "", why: "넓이의 두 배입니다.", hint: "곱해요." },
        { ask: "다른 높이 = 96 ÷ 16 =", answer: "6", unit: "cm", why: "어느 밑변이든 밑변 × 높이는 같습니다.", hint: "나눠요." }
      ]
    },
    check: C3("c2-triangle-area")
  }],
  "2/2": [{
    id: "area-and-ratio", title: "도형의 넓이와 비 — 두 높이로 밑변의 비",
    recall: { figure: figHeights, text: "같은 삼각형에서는 밑변 × 그 높이가 어느 밑변으로 재도 같습니다.", ask: "밑변 12cm, 높이 8cm일 때 밑변 × 높이는?", options: ["96", "48", "20"], answer: 0, why: "12 × 8 = 96이에요.", hint: "12 × 8" },
    explore: [],
    proofs: [],
    summary: {
      figure: figTwoHeights,
      terms: [["거꾸로 비", "밑변 × 높이가 같으니 밑변의 비는 높이의 비를 거꾸로 쓴 것"]],
      facts: ["변 가 × 8 = 변 나 × 12 → 가 : 나 = <b>12 : 8 = 3 : 2</b>", "비와 <b>합</b>이 주어지면 (3 + 2)칸, <b>차</b>가 주어지면 (3 − 2)칸으로 한 칸을 구한다", "평행사변형도 같다: 두 밑변의 비 = 두 높이의 거꾸로 비"]
    },
    pitfall: "높이가 긴 쪽의 밑변이 짧습니다. 높이의 비를 그대로 밑변의 비로 쓰지 않습니다.",
    example: {
      prompt: "어떤 삼각형에서 변 가에 대한 높이는 10cm, 변 나에 대한 높이는 15cm이고, 두 변의 길이의 합은 25cm입니다. 변 가는 몇 cm인가요?",
      figure: () => figTwoHeights("10cm", "15cm"),
      steps: [
        { ask: "가 : 나 = 15 : 10 = 3 : □", answer: "2", why: "밑변의 비는 높이의 비 10 : 15를 거꾸로 쓴 것입니다.", hint: "높이를 바꾸어" },
        { ask: "한 칸은? 25 ÷ (3 + 2) =", answer: "5", unit: "cm", why: "합 25cm가 5칸입니다.", hint: "25 ÷ 5" },
        { ask: "변 가 = 3 × 5 =", answer: "15", unit: "cm", why: "변 나는 10cm — 15 × 10 = 10 × 15로 맞습니다.", hint: "3 × 5" }
      ]
    },
    check: C3("c2-area-ratio-base")
  }],
  "2/3": [{
    id: "area-equation", title: "식으로 구하는 도형의 넓이",
    recall: { figure: figTrapSplit, text: "사다리꼴은 대각선으로 삼각형 둘로 쪼개져서 넓이 = (윗변 + 아랫변) × 높이 ÷ 2입니다.", ask: "넓이 40㎠, 높이 5cm인 사다리꼴의 (윗변 + 아랫변)은?", options: ["8cm", "16cm", "20cm"], answer: 1, why: "40 × 2 ÷ 5 = 16cm예요.", hint: "넓이 × 2 ÷ 높이" },
    explore: [],
    proofs: [],
    summary: {
      figure: figAreaWays,
      terms: [["□로 놓기", "모르는 길이를 □로 두고 넓이 식을 세우기"]],
      facts: ["바로 못 구하는 넓이: ① 원래 도형으로 늘려서 빼기 ② 전체에서 바깥 빼기 ③ 삼각형으로 쪼개기", "모르는 길이는 □로 두고 넓이 식에 넣어 <b>거꾸로</b> 계산한다", "(윗변 + 아랫변) = 넓이 × 2 ÷ 높이"]
    },
    pitfall: "거꾸로 계산할 때 ÷ 2를 × 2로 되돌리는 것을 잊지 않습니다.",
    example: {
      prompt: "아랫변 13cm, 높이 8cm인 사다리꼴의 넓이가 80㎠입니다. 윗변은 몇 cm인가요?",
      figure: figTrapEq,
      steps: [
        { ask: "(윗변 + 아랫변) = 80 × 2 ÷ 8 =", answer: "20", unit: "cm", why: "넓이 식을 거꾸로 씁니다.", hint: "160 ÷ 8" },
        { ask: "윗변 = 20 − 13 =", answer: "7", unit: "cm", why: "아랫변을 뺍니다.", hint: "빼요." }
      ]
    },
    check: C3("c2-trapezoid-area")
  }],
  "3/1": [{
    id: "similarity", title: "닮음 — 길이가 2배면 넓이는 4배",
    recall: { figure: figSimilar, text: "모양이 같고 크기만 다른 두 도형을 닮은 도형이라 합니다.", ask: "한 변이 4cm에서 8cm로 늘었습니다. 몇 배인가요?", options: ["2배", "4배", "8배"], answer: 0, why: "8 ÷ 4 = 2배예요.", hint: "8 ÷ 4" },
    explore: [],
    proofs: [["similar-area", "길이가 2배면 넓이는 왜 4배일까"], ["pyramid-hourglass", "모래시계 모양의 닮음"]],
    summary: {
      figure: figCenter,
      terms: [["닮음의 중심", "대응하는 꼭짓점을 이은 선이 모이는 점 O"], ["닮음비", "대응하는 길이의 비 — 기호 ∽로 △ㄱㄴㄷ ∽ △ㄹㅁㅂ"]],
      facts: ["대응하는 각은 같고, 대응하는 길이는 모두 같은 배(예: <b>2배</b>)", "둘레도 같은 배(<b>2배</b>)", "넓이는 밑변도 높이도 2배라 <b>2 × 2 = 4배</b>(3배면 3 × 3 = 9배)"]
    },
    pitfall: "길이가 2배라고 넓이도 2배는 아닙니다. 넓이는 2 × 2 = 4배입니다.",
    example: {
      prompt: "닮은 두 삼각형의 대응하는 변이 4cm, 8cm입니다. 작은 삼각형의 넓이가 5㎠이면 큰 삼각형의 넓이는?",
      figure: figSimilar,
      steps: [
        { ask: "길이는 몇 배? 8 ÷ 4 =", answer: "2", unit: "배", why: "대응하는 변의 비(닮음비)가 1 : 2입니다.", hint: "8 ÷ 4" },
        { ask: "넓이는 2 × 2 = 4배 — 5 × 4 =", answer: "20", unit: "㎠", why: "밑변 2배 × 높이 2배 = 4배입니다.", hint: "5 × 4" }
      ]
    },
    check: C3("c2-similar-scale")
  }],
  "3/2": [{
    id: "shadow", title: "피라미드 닮음과 모래시계 닮음",
    recall: { figure: figParallelAngle, text: "평행한 두 직선이 다른 한 직선과 만나면 같은 자리에 생기는 두 각(동위각)은 크기가 같습니다.", ask: "그림의 ?는 몇 도인가요?", options: ["50°", "130°", "40°"], answer: 0, why: "같은 자리에 있는 각이라 50°예요.", hint: "같은 자리" },
    explore: [],
    proofs: [["pyramid-hourglass", "모래시계 모양의 닮음"]],
    summary: {
      figure: figPyrHour,
      terms: [["피라미드 닮음", "삼각형 안에 밑변과 평행한 선 — 위의 작은 삼각형과 전체가 닮음"], ["모래시계 닮음", "꼭짓점 ㄱ에서 엇갈려 마주 보는 두 삼각형이 닮음"]],
      facts: ["ㄹㅁ과 ㄴㄷ이 평행하면 각이 둘씩 같다(동위각·엇각, 꼭짓점 ㄱ은 함께 쓰거나 맞꼭지각) → △ㄱㄹㅁ ∽ △ㄱㄴㄷ", "<b>ㄱㄹ : ㄱㄴ = ㄱㅁ : ㄱㄷ = ㄹㅁ : ㄴㄷ</b>", "그림자로 높이 재기도 같은 닮음 — 같은 시각의 막대와 탑이 닮은 직각삼각형을 만든다"]
    },
    pitfall: "ㄱㄹ : ㄹㄴ으로 비를 세우면 틀립니다. 짝이 되는 길이는 꼭짓점 ㄱ에서 잰 ㄱㄹ과 ㄱㄴ입니다.",
    example: {
      prompt: "삼각형 ㄱㄴㄷ에서 ㄹㅁ과 ㄴㄷ이 평행합니다. ㄱㄹ = 6cm, ㄹㄴ = 4cm, ㄹㅁ = 9cm일 때 ㄴㄷ은 몇 cm인가요?",
      figure: figPyramidEx,
      steps: [
        { ask: "ㄱㄴ = 6 + 4 =", answer: "10", unit: "cm", why: "짝이 되는 길이는 ㄱㄹ과 ㄱㄴ입니다.", hint: "더해요." },
        { ask: "ㄱㄹ : ㄱㄴ = 6 : 10 = 3 : □", answer: "5", why: "두 수를 2로 나눕니다.", hint: "÷ 2" },
        { ask: "ㄴㄷ = 9 ÷ 3 × 5 =", answer: "15", unit: "cm", why: "ㄹㅁ : ㄴㄷ도 3 : 5입니다.", hint: "한 칸 3cm" }
      ]
    },
    check: C3("c2-shadow-height")
  }]
};
