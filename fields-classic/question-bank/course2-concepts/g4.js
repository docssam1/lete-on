// 2과정 G4 「도형의 복원과 측정」 개념 꾸러미(DESIGN-COURSE2.md 4절). 열쇠 「단원 번호(0부터)/차시(1부터)」.
// 예제는 새로 지은 문제라 단계 답을 이 파일에 둔다(교재 문항·답이 아니다).
import { foldStageSvg, foldArrowSvg, foldStepArrowSvg, foldCaptionSvg, foldWidthStyle, FOLD_CAPTION_SPACE } from "../fold-visuals.js?v=20261123a";
import { svg, text, line, poly, rect, circle, dot, at, P, arrow, angleMark, dirOf, tick, regular, INK, GREEN, SOFT, MARK, BLUE, YELLOW } from "./pack-kit.js?v=20261123b";
import { dimOut } from "../length-dim.js?v=20261124a";
// 길이 표시(스킬 gfield-textbook-design 4-3): 구간 두 끝을 잇는 바깥 곡선 점선 + 가운데 끊은 자리에 수·단위. c = 도형 안쪽 점(그 반대쪽으로 휜다).
// beside: 글자가 넓은 세로 구간(높이 등)은 점선을 끊지 않고 글자를 곡선 꼭대기 바깥 옆에 둔다.
const dim = (a, b, c, t, { off = 12, color = null, size = 13, beside = false } = {}) => dimOut(a, b, c, t, { off, size, labelColor: color, ...(beside ? { gap: 999 } : {}) });

const label = (x, y, t, o = {}) => text(x, y, t, { size: 13, color: "#56627f", ...o });
const nm = (p, t, dx = 0, dy = 0) => text(p.x + dx, p.y + dy, t, { size: 14, weight: 700 });
const C3 = (type) => [[type, "concept"], [type, "type"], [type, "advanced"]];

// ── 그림 ──
// 교재(N30) 차례에 맞춘 그림: 1단원은 색종이 접기 장면 줄 → 작도, 삼각자는 정사각형·정삼각형을 반으로 자른 모양,
// 2단원은 접은 종이 띠(접기 전 자리를 점선으로 되살림)·평행선 표시(›)가 있는 번개각·외각을 걸으며 꺾는 다각형,
// 3단원은 마름모를 둘러싼 직사각형·밑변과 높이가 둘인 평행사변형, 4단원은 밀어서 펴는 직각 도형.
const parMark = (x, y, n = 1) => Array.from({ length: n }, (_, k) => { const cx = x + k * 7; return line(P(cx - 6, y - 5), P(cx, y), { width: 1.8 }) + line(P(cx - 6, y + 5), P(cx, y), { width: 1.8 }); }).join("");
const rightMark = (v, a1, s = 9, color = INK) => angleMark(v, a1, a1 + 90, s, "", { color });
const foot = (p, a, b) => { const dx = b.x - a.x, dy = b.y - a.y, t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy); return P(a.x + t * dx, a.y + t * dy); };
const reflect = (p, a, b) => { const f = foot(p, a, b); return P(2 * f.x - p.x, 2 * f.y - p.y); };
const askBox = (x, y, w = 48, h = 48) => rect(x, y, w, h, { fill: "#fff", color: MARK, width: 1.8, rx: 6, dash: "5 4" }) + text(x + w / 2, y + h / 2, "?", { size: 22, color: MARK, weight: 800 });

// 0/1 색종이로 정삼각형 접기(문제은행 색종이 그림과 같은 한 줄 흐름: 처음 → 1번 접음 → 펼친 모양)
// 반으로 접었다 편 가운데 선 위로, 왼쪽 아래 꼭짓점을 지나는 선을 따라 오른쪽 아래 모서리를 접어 올린다 → 모서리가 닿은 점과 밑변의 두 끝이 정삼각형
const figFoldEquilateral = (mark = "?") => () => {
  const size = 100, top = 6, gap = 34;
  const A = { x: 0, y: 1 }, B = { x: 1, y: 1 }, Q = { x: 1, y: 1 - Math.tan(Math.PI / 6) }, T = { x: 0.5, y: 1 - Math.sqrt(3) / 2 };
  const SQ = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }];
  let shift = 6, parts = "";
  const S = (p) => P(shift + p.x * size, top + p.y * size);
  const dash = (a, b, { color = "#d4756c", width = 1.6, gap: g = "6 5" } = {}) => `<line x1="${S(a).x.toFixed(1)}" y1="${S(a).y.toFixed(1)}" x2="${S(b).x.toFixed(1)}" y2="${S(b).y.toFixed(1)}" stroke="${color}" stroke-width="${width}" stroke-dasharray="${g}"/>`;
  const middle = () => dash({ x: 0.5, y: 0 }, { x: 0.5, y: 1 }, { color: "#e2b1ab", width: 1.2, gap: "3 4" });
  const pts = (list) => list.map((p) => `${S(p).x.toFixed(1)},${S(p).y.toFixed(1)}`).join(" ");
  const next = () => { shift += size + 12; parts += foldStepArrowSvg(shift, top + size / 2); shift += gap; };
  // 처음: 가운데 선(반으로 접었다 편 자국) + 접는 선 + 빨간 굽은 화살표
  const away = { x: (A.x + B.x + Q.x) / 3, y: (A.y + B.y + Q.y) / 3 };
  const to = reflect(P(away.x, away.y), P(A.x, A.y), P(Q.x, Q.y));
  parts += foldStageSvg(SQ, { shift, top, size }) + middle() + dash(A, Q) + foldArrowSvg(away, { x: to.x, y: to.y }, shift, top, size) + foldCaptionSvg(shift + size / 2, top + size + 22, 0);
  next();
  // 1번 접음: 접어 올린 모서리가 가운데 선에 닿는다
  parts += foldStageSvg([{ x: 0, y: 0 }, { x: 1, y: 0 }, Q, A], { shift, top, size }) + middle()
    + `<polygon points="${pts([A, Q, T])}" fill="#f9c8c4" stroke="#e8968f" stroke-width="2"/>` + dot(S(T), 3.4, "#b03a5b") + foldCaptionSvg(shift + size / 2, top + size + 22, 1);
  next();
  // 펼친 모양: 모서리가 닿았던 점과 밑변의 두 끝을 이으면 정삼각형
  parts += foldStageSvg(SQ, { shift, top, size }) + middle() + dash(A, Q)
    + `<polygon points="${pts([A, B, T])}" fill="rgba(255,241,191,.95)" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>` + dot(S(T), 3.4, "#b03a5b")
    + angleMark(S(A), 0, 60, 18, mark, { size: 13, gap: 13 })
    + `<text x="${(shift + size / 2).toFixed(1)}" y="${(top + size + 22).toFixed(1)}" font-size="13" font-weight="800" text-anchor="middle" fill="#7a4a44" font-family="'Noto Sans KR',sans-serif">펼친 모양</text>`;
  shift += size + 12;
  return `<svg class="fold-pieces-svg" ${foldWidthStyle(shift + 6, size)} viewBox="0 0 ${shift + 6} ${size + 16 + FOLD_CAPTION_SPACE}" role="img" aria-label="색종이를 반으로 접었다 펴고, 오른쪽 아래 모서리를 가운데 선에 닿게 접어 올린 뒤 펼친 과정 — 닿은 점과 밑변의 두 끝이 정삼각형">${parts}</svg>`;
};
// 정사각형의 한 꼭짓점에서 정삼각형을 그리고 남은 각을 반으로
const figCornerSplit = () => {
  const s = 150, B = P(40, 180), C = P(40 + s, 180), A = P(40, 180 - s), D = P(40 + s, 180 - s), E = at(B, s, 60);
  return svg(240, 205, poly([A, B, C, D], { fill: "#fff" }) + poly([B, C, E], { fill: SOFT }) + line(B, at(B, s * 0.98, 75), { color: GREEN, dash: "5 4" })
    + angleMark(B, 0, 60, 26, "60°", { color: INK }) + angleMark(B, 75, 90, 46, "?")
    + nm(B, "B", -12, 10) + nm(C, "C", 12, 10) + nm(E, "E", 10, -10), "정사각형의 한 꼭짓점에 그린 정삼각형과 남은 각을 반으로 나눈 선");
};
// 0/2 이등변삼각형(꼭지각 30°)
const figIso30 = () => {
  const A = P(130, 22), B = at(A, 165, 255), C = at(A, 165, 285);
  return svg(260, 200, poly([A, B, C], { fill: SOFT }) + tick(A, B) + tick(A, C) + angleMark(A, 255, 285, 34, "30°", { color: INK })
    + angleMark(B, 0, 75, 24, "?") + angleMark(C, 105, 180, 24, "?"), "꼭지각이 30°인 이등변삼각형");
};
const figInside = () => {
  const s = 150, A = P(40, 25), B = P(40, 25 + s), C = P(40 + s, 25 + s), D = P(40 + s, 25), E = at(B, s, 60);
  return svg(240, 200, poly([A, B, C, D], { fill: "#fff" }) + poly([E, B, C], { fill: SOFT }) + poly([A, B, E], { fill: YELLOW }) + line(A, E) + line(E, D)
    + tick(A, B) + tick(B, E) + tick(E, C) + tick(C, D) + angleMark(B, 0, 60, 24, "60°", { color: INK }) + angleMark(A, dirOf(A, B), dirOf(A, E), 22, "?")
    + nm(A, "A", -12, -6) + nm(B, "B", -12, 10) + nm(C, "C", 12, 10) + nm(D, "D", 12, -6) + nm(E, "E", 0, -16), "정사각형 안의 정삼각형 — 같은 길이 표시와 이등변삼각형");
};
// 0/3 삼각자: 정사각형을 대각선으로, 정삼각형을 높이로 반씩 자른 모양
const halfSet = (T, R, F, mark = "30°") => poly([T, R, F], { fill: SOFT }) + rightMark(R, F.x < R.x ? 90 : 0) + angleMark(T, dirOf(T, F), dirOf(T, R), 26, mark, { color: INK, size: 13, gap: 12 });
const figSetPair = () => {
  const L = halfSet(P(100, 30), P(100, 150), P(31, 150)), Rr = poly([P(140, 30), P(140, 150), P(209, 150)], { fill: SOFT }) + rightMark(P(140, 150), 0) + angleMark(P(140, 30), 270, dirOf(P(140, 30), P(209, 150)), 26, "30°", { color: INK, size: 13, gap: 12 });
  return svg(340, 175, L + Rr + arrow(P(108, 95), P(116, 95), { color: GREEN }) + arrow(P(132, 95), P(124, 95), { color: GREEN })
    + arrow(P(228, 95), P(262, 95)) + askBox(272, 71), "30°·60°·90° 삼각자 두 개를 긴 다리끼리 맞대면 어떤 삼각형이 될까");
};
const figSetSource = () => {
  const sq = [P(20, 40), P(130, 40), P(130, 150), P(20, 150)], T = P(250, 150 - 130 * Math.sqrt(3) / 2), L = P(185, 150), R = P(315, 150), H = P(250, 150);
  return svg(340, 195, poly([sq[0], sq[3], sq[2]], { fill: SOFT }) + poly([sq[0], sq[1], sq[2]], { fill: YELLOW }) + line(sq[0], sq[2], { color: MARK })
    + angleMark(sq[2], 90, 135, 26, "45°", { color: INK, size: 13, gap: 12 }) + angleMark(sq[0], 270, 315, 26, "45°", { color: INK, size: 13, gap: 12 })
    + poly([T, L, H], { fill: SOFT }) + poly([T, H, R], { fill: YELLOW }) + line(T, H, { color: MARK }) + rightMark(H, 90)
    + angleMark(T, 240, 270, 30, "30°", { color: INK, size: 13, gap: 11 }) + angleMark(L, 0, 60, 22, "60°", { color: INK, size: 13, gap: 12 }) + tick(L, H) + tick(H, R)
    + label(75, 184, "정사각형 → 반") + label(250, 184, "정삼각형 → 반") + label(206, 84, "빗변", { anchor: "end" }) + label(217, 163, "빗변의 반"), "정사각형을 대각선으로, 정삼각형을 높이로 잘라 만든 삼각자");
};
// 두 변 12cm·9cm, 끼인각 30° — 높이를 내리면 삼각자 모양(빗변 12cm)이 생긴다
const figSideAngle = () => {
  const k = 17, A = P(30, 160), B = P(30 + 9 * k, 160), C = at(A, 12 * k, 30), H = P(C.x, 160);
  return svg(270, 190, poly([A, B, C], { fill: YELLOW }) + line(B, H, { color: "#9aa39e", dash: "4 4", width: 1.4 }) + line(C, H, { color: GREEN, dash: "5 4" }) + rightMark(H, 90, 8, GREEN)
    + angleMark(A, 0, 30, 34, "30°", { color: INK, size: 13 }) + dim(A, B, C, "9cm") + dim(A, C, B, "12cm") + dim(C, H, B, "?", { color: MARK, size: 15 }),
  "두 변이 12cm·9cm이고 끼인각이 30°인 삼각형과 그 높이");
};
// 1/1 접은 종이 띠: 띠의 오른쪽 끝을 비스듬한 선을 따라 아래로 접는다. 점선 = 접기 전 자리(교재 방법: 접힌 선을 대칭축으로 되살린다)
const figTape = (mode) => () => {
  const T = 40, Bt = 130, F2 = P(160, T), F1 = P(160 + (Bt - T) / Math.tan(50 * Math.PI / 180), Bt), E1 = P(305, T), E2 = P(305, Bt);
  const R1 = reflect(E1, F2, F1), R2 = reflect(E2, F2, F1), G = P(F2.x - (Bt - T) * Math.tan(10 * Math.PI / 180), Bt);
  let body = poly([P(20, T), F2, F1, P(20, Bt)], { fill: SOFT, width: 0 }) + line(P(20, T), F2) + line(P(20, Bt), F1)
    + poly([F2, E1, E2, F1], { fill: "none", color: "#9aa39e", width: 1.4, dash: "5 4" })
    + poly([F2, R1, R2, F1], { fill: "rgba(255,241,191,.92)" }) + line(F2, F1, { color: MARK, dash: "6 4" });
  if (mode === "summary") body += poly([F2, G, F1], { fill: "rgba(47,107,82,.2)", color: GREEN, width: 1.6 });
  body += angleMark(F2, 310, 360, 36, "50°", { color: INK, size: 13 });
  if (mode === "recall") body += angleMark(F2, 260, 310, 40, "?", { size: 14 });
  if (mode === "summary") body += angleMark(F2, 260, 310, 40, "50°", { color: INK, size: 13 }) + angleMark(F1, 130, 180, 24, "50°", { color: INK, size: 12, gap: 13 }) + angleMark(F2, 180, 260, 24, "80°", { color: MARK, size: 13 });
  if (mode === "example") body += angleMark(F2, 180, 260, 24, "?", { size: 15 });
  body += label(240, T - 12, "접기 전 자리") + label(85, T - 12, "종이 띠");
  return svg(320, 215, body, "종이 띠를 비스듬한 선을 따라 접은 모양 — 점선은 접기 전 자리");
};
// 1/2 번개각: 평행선 표시(›)와 꺾인 곳을 지나는 평행선(점선)
const twoLines = (y1, y2, w = 320) => line(P(20, y1), P(w - 10, y1), { width: 2.4 }) + line(P(20, y2), P(w - 10, y2), { width: 2.4 }) + parMark(w - 30, y1) + parMark(w - 30, y2);
const figBendOne = () => {
  const A = P(80, 40), V = P(210, 105), B = P(90, 170);
  return svg(320, 200, twoLines(40, 170) + line(A, V) + line(V, B) + line(P(40, 105), P(290, 105), { color: GREEN, dash: "6 5", width: 1.6 })
    + angleMark(A, dirOf(A, V), 0, 28, "㉠", { color: INK, size: 14 }) + angleMark(B, 0, dirOf(B, V), 28, "㉡", { color: INK, size: 14 }) + angleMark(V, dirOf(V, A), dirOf(V, B), 20, "?"), "평행선 사이에서 한 번 꺾인 선과 꺾인 곳을 지나는 평행선");
};
const figZigzag = (guides = false) => () => {
  const P0 = P(60, 30), V1 = at(P0, 180, -20), V2 = at(V1, 110, 225), P3 = at(V2, 40.6 / Math.sin(25 * Math.PI / 180), -25);
  const g = (y) => line(P(25, y), P(300, y), { color: GREEN, dash: "6 5", width: 1.4 });
  return svg(330, 235, twoLines(30, P3.y, 330) + (guides ? g(V1.y) + g(V2.y) : "") + line(P0, V1) + line(V1, V2) + line(V2, P3)
    + angleMark(P0, -20, 0, 40, "20°", { color: INK, size: 13 }) + angleMark(V1, 160, 225, 22, "?") + angleMark(V2, -25, 45, 22, "70°", { color: INK, size: 13 })
    + angleMark(P3, 155, 180, 40, "25°", { color: INK, size: 13 }), "두 평행선 사이를 지그재그로 꺾인 선");
};
// 1/3 외각: 한 변을 늘인 선과 이웃한 변 사이의 각
const figSquareExt = () => {
  const V = P(150, 150);
  return svg(260, 190, rect(50, 50, 100, 100, { fill: SOFT }) + line(V, P(225, 150), { color: "#9aa39e", dash: "5 4", width: 1.6 }) + angleMark(V, 0, 90, 22, "?"), "정사각형의 한 외각");
};
const figPentagonExt = (labels) => () => {
  const d = [0, 60, 130, 210, 300], L = [130, 90, 100, 173.2];
  const V = [P(90, 200)];
  L.forEach((len, i) => V.push(at(V[i], len, d[i])));
  let body = poly(V, { fill: SOFT });
  V.forEach((v, i) => {
    const before = d[(i + 4) % 5], after = d[i];
    body += line(v, at(v, 42, before), { color: "#9aa39e", dash: "5 4", width: 1.5 }) + angleMark(v, before, after, 20, labels[i], { color: labels[i] === "?" ? MARK : INK, size: 13, gap: 14 });
  });
  return svg(300, 245, body, "둘레를 따라 걸으며 꺾는 각(외각)을 표시한 오각형");
};
// 2/1 대각선이 수직인 사각형: 꼭 둘러싼 직사각형(교재처럼)
const figQuad = ({ v, h, vl, hl, cross = 0.5 }) => () => {
  const cx = 130, y0 = 20, yc = y0 + cross * v, T = P(cx, y0), B = P(cx, y0 + v), Lp = P(cx - h / 2, yc), Rp = P(cx + h / 2, yc);
  return svg(260, v + 44, rect(cx - h / 2, y0, h, v, { color: "#9aa39e", width: 1.4, dash: "5 4" }) + poly([T, Rp, B, Lp], { fill: YELLOW })
    + line(T, B, { color: GREEN, dash: "5 4" }) + line(Lp, Rp, { color: GREEN, dash: "5 4" }) + rightMark(P(cx, yc), 0, 8, GREEN)
    + dim(P(cx + h / 2, y0), P(cx + h / 2, y0 + v), P(cx, yc), vl, { off: 18 }) + dim(P(cx - h / 2, y0 + v), P(cx + h / 2, y0 + v), P(cx, yc), hl), "대각선이 수직인 사각형과 둘러싼 직사각형");
};
// 2/2 평행사변형: 밑변과 높이가 두 쌍(밑변 15 · 높이 8 · 다른 변 12)
const figParaHeights = (mode) => () => {
  const k = 12, th = Math.asin(8 / 12) * 180 / Math.PI, A = P(30, 140), B = P(30 + 15 * k, 140), D = at(A, 12 * k, th), C = at(B, 12 * k, th), H = P(D.x, 140), F = foot(D, B, C);
  const t = mode === "example" ? ["15cm", "8cm", "12cm", "?"] : ["밑변", "높이", "다른 밑변", "다른 높이"];
  return svg(350, 170, poly([A, B, C, D], { fill: YELLOW }) + line(D, H, { color: GREEN, dash: "5 4" }) + rightMark(H, 0, 8, GREEN) + line(D, F, { color: BLUE, dash: "5 4" }) + rightMark(F, th, 8, BLUE)
    + (mode === "example"   // 예제: 길이는 곡선 점선 · 정리: 이름만(밑변·높이)
      ? dim(A, B, D, t[0]) + dim(D, H, B, t[1], { color: GREEN, off: 18 }) + dim(B, C, A, t[2]) + dim(D, F, A, t[3], { color: MARK })
      : label((A.x + B.x) / 2, 157, t[0]) + label(D.x - 6, 100, t[1], { anchor: "end", color: GREEN }) + label((B.x + C.x) / 2 + 10, (B.y + C.y) / 2 + 8, t[2], { anchor: "start" })
        + label((D.x + F.x) / 2 + 2, (D.y + F.y) / 2 - 12, t[3], { color: BLUE, anchor: "start" })), "밑변과 높이가 두 쌍인 평행사변형");
};
const figParaBase = () => {
  const A = P(30, 130), B = P(230, 130), D = P(90, 40), C = P(290, 40), H = P(90, 130);
  return svg(310, 160, poly([A, B, C, D], { fill: YELLOW }) + line(D, H, { color: GREEN, dash: "5 4" }) + rightMark(H, 0, 8, GREEN) + label(130, 147, "밑변") + label(96, 88, "높이", { anchor: "start", color: GREEN }), "평행사변형의 밑변과 높이");
};
const figSplitTri = () => svg(320, 180, poly([P(30, 150), P(290, 150), P(110, 30)], { fill: "#fff" }) + poly([P(110, 30), P(30, 150), P(150, 150)], { fill: YELLOW }) + line(P(110, 30), P(110, 150), { color: GREEN, dash: "5 4" }) + rightMark(P(110, 150), 0, 7, GREEN)
  + dim(P(30, 150), P(150, 150), P(110, 30), "6cm") + dim(P(150, 150), P(290, 150), P(110, 30), "7cm") + label(104, 100, "높이", { anchor: "end", color: GREEN }), "높이가 같은 두 삼각형");
const figTrapSplit = () => svg(320, 170, poly([P(90, 30), P(200, 30), P(280, 140), P(30, 140)], { fill: YELLOW }) + line(P(90, 30), P(280, 140), { color: GREEN, dash: "5 4" })
  + dim(P(90, 30), P(200, 30), P(155, 85), "윗변 6cm") + dim(P(30, 140), P(280, 140), P(155, 85), "아랫변 14cm") + line(P(150, 30), P(150, 140), { color: "#9aa39e", dash: "3 3", width: 1.2 }) + dim(P(150, 30), P(150, 140), P(280, 85), "높이 5cm", { beside: true }), "대각선으로 나눈 사다리꼴");
const figParts = () => svg(280, 180, rect(30, 20, 220, 140, { fill: "#fff", width: 2.4 }) + line(P(120, 20), P(120, 160)) + line(P(30, 80), P(250, 80))
  + label(75, 50, "22cm") + label(185, 50, "28cm") + label(75, 120, "26cm") + label(185, 120, "?", { color: MARK }), "넷으로 나눈 직사각형");
// 4단원 직각으로 꺾인 도형: 안쪽 변을 바깥으로 밀어 펴면 둘러싼 직사각형(교재처럼 화살표로)
const figStair = () => {
  const o = P(50, 20), k = 14, X = (x) => o.x + x * k, Y = (y) => o.y + y * k;
  const pts = [[0, 0], [4, 0], [4, 4], [9, 4], [9, 8], [14, 8], [14, 12], [0, 12]].map(([x, y]) => P(X(x), Y(y)));
  const up = (x, y) => arrow(P(X(x), Y(y) - 2), P(X(x), Y(y) - 20), { color: MARK, width: 1.8 });
  const right = (x, y) => arrow(P(X(x) + 2, Y(y)), P(X(x) + 20, Y(y)), { color: MARK, width: 1.8 });
  return svg(280, 220, poly(pts, { fill: YELLOW, width: 2.4 }) + rect(o.x, o.y, 14 * k, 12 * k, { color: GREEN, width: 1.4, dash: "5 4" })
    + up(6.5, 4) + up(11.5, 8) + right(4, 2) + right(9, 6)
    + dim(P(o.x, o.y + 12 * k), P(o.x + 14 * k, o.y + 12 * k), P(o.x + 7 * k, o.y + 6 * k), "14cm") + dim(P(o.x, o.y), P(o.x, o.y + 12 * k), P(o.x + 7 * k, o.y + 6 * k), "12cm", { off: 18 }), "계단 모양의 안쪽 변을 밀어 펴면 둘러싼 직사각형");
};
const figCongruent = () => {
  let body = "";
  for (let i = 0; i < 4; i += 1) body += rect(20 + i * 50, 20, 50, 100, { fill: i === 0 ? YELLOW : "#fff" });
  for (let j = 0; j < 2; j += 1) body += rect(20 + j * 100, 120, 100, 50);
  return svg(240, 190, body + label(120, 185, "짧은 변 4개 = 긴 변 2개"), "똑같은 직사각형 6개");
};

export const PACKS = {
  "0/1": [{
    id: "construct-special", title: "접고 그려서 만드는 특수각(90°·60°·30°)",
    recall: { figure: figFoldEquilateral("?"), text: "정사각형 색종이를 반으로 접었다 펴고, 오른쪽 아래 모서리를 가운데 선에 닿게 접어 올렸다 펴면 세 변의 길이가 같은 정삼각형이 생깁니다.", ask: "펼친 모양에서 ?로 표시한 정삼각형의 한 각은?", options: ["45°", "60°", "90°"], answer: 1, why: "정삼각형의 세 각은 모두 같으니 180 ÷ 3 = 60°예요.", hint: "180을 셋으로" },
    explore: [["lab", "compass", "컴퍼스로 그리기"]],
    proofs: [["construct-sss", "세 변의 길이로 삼각형 작도하기"], ["construct-perpendicular-bisector", "선분의 수직이등분선"], ["construct-angle-bisector", "각의 이등분선"]],
    summary: {
      figure: figFoldEquilateral("60°"),
      terms: [["작도", "자와 컴퍼스만으로 도형을 그리는 것"], ["특수각", "90°·60°·45°·30°처럼 접기·작도로 바로 만드는 각"]],
      facts: ["색종이 모서리를 가운데 선에 닿게 접어 올리면 닿은 점에서 밑변의 두 끝까지가 밑변과 같다 → <b>정삼각형 → 60°</b>", "컴퍼스로는 같은 반지름 두 호의 교점 → <b>정삼각형 → 60°</b>", "선분의 수직이등분선 → <b>90°</b>, 그 각을 이등분 → <b>45°</b>", "60°를 이등분하거나 90° − 60° → <b>30°</b>"]
    },
    pitfall: "컴퍼스 폭을 바꾸면 두 호가 만든 삼각형은 정삼각형이 아닙니다. 같은 반지름으로 그립니다.",
    example: {
      prompt: "정사각형의 한 변 BC 위에 정삼각형 EBC를 그려 꼭짓점 B의 직각을 나누었습니다. 남은 각을 점선으로 반으로 나누면 ?는 몇 도인가요?",
      figure: figCornerSplit,
      steps: [
        { ask: "직각에서 정삼각형의 한 각을 빼면? 90 − 60 =", answer: "30", unit: "°", why: "정삼각형의 한 각은 60°입니다.", hint: "90 − 60" },
        { ask: "그 각을 반으로 나누면?", answer: "15", unit: "°", why: "각의 이등분선으로 똑같이 둘로 나눕니다.", hint: "30 ÷ 2" }
      ]
    },
    check: [["c2-special-angle", "concept"], ["c2-regular-polygon-angle", "type"], ["c2-joined-polygon-angle", "advanced"]]
  }],
  "0/2": [{
    id: "restore-angles", title: "같은 길이로 각 되살리기",
    recall: { figure: figIso30, text: "이등변삼각형은 두 변의 길이가 같고 두 밑각이 같습니다.", ask: "꼭지각이 30°인 이등변삼각형의 밑각 ?는?", options: ["65°", "75°", "150°"], answer: 1, why: "(180 − 30) ÷ 2 = 75°예요.", hint: "180 − 30을 반으로" },
    explore: [],
    proofs: [["square-equilateral", "정사각형 안 정삼각형이 만드는 각"]],
    summary: {
      figure: figInside,
      terms: [["같은 길이 표시", "같은 개수의 짧은 빗금이 있는 변은 길이가 같다"]],
      facts: ["같은 길이의 두 변을 찾으면 <b>이등변삼각형</b> → 두 밑각이 같다", "정사각형의 변 = 정삼각형의 변 → 정사각형과 정삼각형이 만나면 이등변삼각형이 생긴다", "같은 길이로 이은 지그재그는 밑각이 a, 2a, 3a …로 늘어난다"]
    },
    pitfall: "모양이 비슷해 보인다고 같은 길이로 놓지 않습니다. 표시나 조건으로 확인된 것만 씁니다.",
    example: {
      prompt: "정사각형 ABCD 안에 BC를 한 변으로 하는 정삼각형 EBC를 그렸습니다. 각 BAE는 몇 도인가요?",
      figure: figInside,
      steps: [
        { ask: "각 ABE는? 90 − 60 =", answer: "30", unit: "°", why: "정사각형의 직각에서 정삼각형의 한 각을 뺍니다.", hint: "90 − 60" },
        { ask: "AB = BE(정사각형의 변 = 정삼각형의 변)이므로 이등변 — 밑각 BAE는? (180 − 30) ÷ 2 =", answer: "75", unit: "°", why: "이등변삼각형의 두 밑각은 같습니다.", hint: "150 ÷ 2" }
      ]
    },
    check: C3("c2-special-angle")
  }],
  "0/3": [{
    id: "set-square", title: "삼각자 — 30°와 마주 보는 변은 빗변의 반",
    recall: { figure: figSetPair, text: "삼각자는 30°·60°·90° 삼각형과 45°·45°·90° 삼각형입니다.", ask: "30°·60°·90° 삼각자 두 개를 직각을 낀 긴 변끼리 맞대어 붙이면 어떤 삼각형이 되나요?", options: ["정삼각형", "정사각형"], answer: 0, why: "위의 각은 30 + 30 = 60°, 아래 두 각도 60°라 세 각이 모두 60°예요.", hint: "30 + 30 = 60" },
    explore: [],
    proofs: [["set-square-half", "30°와 마주 보는 변은 왜 빗변의 반일까"]],
    summary: {
      figure: figSetSource,
      terms: [["빗변", "직각과 마주 보는 가장 긴 변"]],
      facts: ["정사각형을 대각선으로 자르면 <b>45°·45°·90°</b> 삼각자, 정삼각형을 높이로 자르면 <b>30°·60°·90°</b> 삼각자", "30°·60°·90° 삼각형 둘을 다시 붙이면 <b>정삼각형</b>", "그래서 <b>30°와 마주 보는 변 = 빗변의 반</b>", "두 변과 끼인각 30°(또는 150°) → 높이 = 다른 변의 반 → 넓이를 구할 수 있다"]
    },
    pitfall: "60°와 마주 보는 변을 빗변의 반으로 놓으면 틀립니다. 반이 되는 것은 30°와 마주 보는 변입니다.",
    example: {
      prompt: "두 변이 12cm, 9cm이고 그 사이의 각이 30°인 삼각형의 넓이는 몇 ㎠인가요?",
      figure: figSideAngle,
      steps: [
        { ask: "9cm 변을 밑변으로 하면 높이는 12cm의 반 =", answer: "6", unit: "cm", why: "높이를 내리면 빗변이 12cm인 삼각자 모양이 생기고, 30°와 마주 보는 변이 높이입니다.", hint: "12 ÷ 2" },
        { ask: "넓이는? 9 × 6 ÷ 2 =", answer: "27", unit: "㎠", why: "삼각형의 넓이 = 밑변 × 높이 ÷ 2입니다.", hint: "54 ÷ 2" }
      ]
    },
    check: C3("c2-set-square-side")
  }],
  "1/1": [{
    id: "fold-tape", title: "평행선과 종이 띠 접기",
    recall: { figure: figTape("recall"), text: "종이를 접으면 접힌 부분과 접기 전 자리는 접는 선을 사이에 두고 꼭 겹칩니다.", ask: "접는 선과 접기 전 자리가 이루는 각이 50°일 때, 접는 선과 접힌 변이 이루는 각 ?는?", options: ["40°", "50°", "130°"], answer: 1, why: "접어서 겹치니 접는 선 양쪽의 각은 같은 크기예요.", hint: "포개어 보면?" },
    explore: [],
    proofs: [["tape-fold", "접은 종이 띠에 생기는 이등변삼각형"]],
    summary: {
      figure: figTape("summary"),
      terms: [["종이 띠", "위아래 변이 평행한 긴 종이"]],
      facts: ["접기 전 자리를 점선으로 되살려 그리면(접는 선이 대칭축) 같은 각이 보인다", "접는 선 양쪽의 각은 <b>같다</b>(접어서 겹친다)", "띠의 위아래 변이 평행이라 <b>엇각</b>을 옮길 수 있다", "접은 부분에는 두 각이 같은 <b>이등변삼각형</b>이 생긴다 → 남은 각 = 180 − 2 × 접은 각"]
    },
    pitfall: "접힌 각 하나만 보고 끝내지 않습니다. 접힌 각은 언제나 두 개(같은 크기)입니다.",
    example: {
      prompt: "종이 띠의 오른쪽 끝을 비스듬히 아래로 접었습니다. 접는 선과 접기 전 위 변(점선)이 이루는 각이 50°입니다. 접혀 내려간 변이 위 변의 남은 쪽과 이루는 각 ?는?",
      figure: figTape("example"),
      steps: [
        { ask: "접혀 내려간 변도 접는 선과 몇 도?", answer: "50", unit: "°", why: "접는 선 양쪽의 각은 같습니다.", hint: "접으면 겹쳐요." },
        { ask: "접기 전 위 변(점선)에서 접혀 내려간 변까지는? 50 + 50 =", answer: "100", unit: "°", why: "두 각이 나란히 붙어 있습니다.", hint: "더해요." },
        { ask: "? = 180 − 100 =", answer: "80", unit: "°", why: "위 변은 일직선(180°)입니다.", hint: "180 − 100" }
      ]
    },
    check: [["c2-fold-tape-angle", "concept"], ["c2-parallel-angle", "type"], ["c2-fold-tape-angle", "advanced"]]
  }],
  "1/2": [{
    id: "zigzag", title: "번개각 — 평행선 사이 지그재그",
    recall: { figure: figBendOne, text: "평행선과 한 직선이 만날 때 엇각은 같습니다.", ask: "꺾인 곳에 평행선(점선)을 하나 더 그으면 꺾인 각 ?는?", options: ["㉠ + ㉡", "㉠ − ㉡"], answer: 0, why: "평행선이 꺾인 각을 엇각 둘로 나눠요.", hint: "나눠 보세요." },
    explore: [],
    proofs: [["zigzag-angle", "번개 모양 각의 규칙"], ["parallel-triangle-sum", "평행선으로 보는 삼각형 세 각의 합"]],
    summary: {
      figure: figZigzag(true),
      terms: [["번개각", "두 평행선 사이를 지그재그로 오가는 선이 만드는 각"]],
      facts: ["꺾인 곳마다 <b>평행선을 하나씩 더</b> 긋는다", "<b>오른쪽으로 벌어진 각의 합 = 왼쪽으로 벌어진 각의 합</b>", "꺾인 곳이 여럿이어도 같은 규칙"]
    },
    pitfall: "꺾인 곳 하나에만 평행선을 그으면 나머지 각을 옮길 수 없습니다. 꺾인 곳마다 긋습니다.",
    example: {
      prompt: "두 평행선 사이를 선이 지그재그로 꺾였습니다. 위 평행선과 이루는 각 20°와 왼쪽으로 꺾인 곳의 각 70°는 오른쪽으로 벌어지고, 오른쪽으로 꺾인 곳의 각 ?와 아래 평행선과 이루는 각 25°는 왼쪽으로 벌어집니다. ?는?",
      figure: figZigzag(false),
      steps: [
        { ask: "오른쪽으로 벌어진 각의 합 = 20 + 70 =", answer: "90", unit: "°", why: "꺾인 곳마다 평행선을 그어 엇각을 옮기면 같은 쪽으로 벌어진 각끼리 모입니다.", hint: "20 + 70" },
        { ask: "왼쪽으로 벌어진 각의 합 ? + 25도 90° — ?는?", answer: "65", unit: "°", why: "양쪽의 합이 같아 ? = 90 − 25 = 65°입니다.", hint: "90 − 25" }
      ]
    },
    check: C3("c2-parallel-angle")
  }],
  "1/3": [{
    id: "angle-moving", title: "외각의 합과 각 옮기기",
    recall: { figure: figSquareExt, text: "외각은 한 변을 늘인 선과 이웃한 변이 이루는 각입니다. 다각형의 외각을 모두 더하면 360°입니다.", ask: "정사각형의 한 외각 ?는?", options: ["45°", "90°", "120°"], answer: 1, why: "360 ÷ 4 = 90°예요.", hint: "360 ÷ 4" },
    explore: [["lab", "angles", "각 떼어 모으기"]],
    proofs: [],
    summary: {
      figure: figPentagonExt(["", "", "", "", ""]),
      terms: [["외각", "한 변을 늘인 선(점선)과 이웃한 변이 이루는 각"], ["각 옮기기", "엇각·맞꼭지각·나비각으로 흩어진 각을 한곳에 모으기"]],
      facts: ["흩어진 각들은 평행선·맞꼭지각으로 <b>한 꼭짓점에 모은다</b>", "둘레를 따라 돌며 꺾는 각을 모두 더하면 <b>360°</b>", "정사각형을 붙인 모양에서는 대각선이 45°씩 나눈 각을 이용한다"]
    },
    pitfall: "모양이 복잡해도 각을 하나씩 따로 구하려 하지 말고, 합을 한 번에 구하는 방법(외각의 합)을 먼저 찾습니다.",
    example: {
      prompt: "어떤 오각형의 외각 다섯 개 중 넷이 60°, 70°, 80°, 90°입니다. 나머지 외각 ?는 몇 도인가요?",
      figure: figPentagonExt(["?", "60°", "70°", "80°", "90°"]),
      steps: [
        { ask: "네 외각의 합은? 60 + 70 + 80 + 90 =", answer: "300", unit: "°", why: "알고 있는 외각을 모읍니다.", hint: "더해요." },
        { ask: "나머지 외각은? 360 − 300 =", answer: "60", unit: "°", why: "외각을 모두 더하면 360°입니다.", hint: "360 − 300" }
      ]
    },
    check: [["c2-exterior-walk", "concept"], ["c2-exterior-walk", "type"], ["c2-butterfly-angle", "advanced"]]
  }],
  "2/1": [{
    id: "diagonal-area-max", title: "대각선이 수직인 사각형의 넓이",
    recall: { figure: figQuad({ v: 150, h: 90, vl: "10cm", hl: "6cm" }), text: "대각선이 수직인 사각형의 넓이 = 두 대각선의 곱 ÷ 2.", ask: "대각선이 6cm, 10cm로 수직이면 넓이는?", options: ["16㎠", "30㎠", "60㎠"], answer: 1, why: "6 × 10 ÷ 2 = 30㎠예요.", hint: "60 ÷ 2" },
    explore: [],
    proofs: [["rhombus-area", "마름모의 넓이"]],
    summary: {
      figure: figQuad({ v: 156, h: 104, vl: "12cm", hl: "8cm", cross: 0.34 }),
      terms: [["수직으로 만나는 두 선분", "어디서 만나든 네 끝을 이은 사각형의 넓이는 곱 ÷ 2"]],
      facts: ["두 선분이 수직이면 만나는 자리에 상관없이 넓이 = <b>두 선분의 곱 ÷ 2</b>", "가운데 점을 이은 사각형의 넓이는 반", "두 선분이 수직이 아니면 넓이가 줄어든다 — 가장 클 때가 수직"]
    },
    pitfall: "만나는 점이 가운데가 아니어도(연 모양) 넓이 식은 같습니다. 다시 구하지 않아도 됩니다.",
    example: {
      prompt: "길이 12cm, 8cm인 두 막대를 서로 수직으로 겹쳐 놓고 네 끝을 이어 사각형을 만들었습니다. 넓이는?",
      figure: figQuad({ v: 156, h: 104, vl: "12cm", hl: "8cm", cross: 0.34 }),
      steps: [
        { ask: "둘러싼 직사각형의 넓이는? 12 × 8 =", answer: "96", unit: "㎠", why: "두 막대가 가로·세로입니다.", hint: "12 × 8" },
        { ask: "사각형은 그 반 =", answer: "48", unit: "㎠", why: "바깥 삼각형 넷과 안쪽 삼각형 넷이 같습니다.", hint: "96 ÷ 2" }
      ]
    },
    check: [["c2-rhombus-area", "concept"], ["c2-rhombus-area", "type"], ["c2-midpoint-nest-area", "advanced"]]
  }],
  "2/2": [{
    id: "parallelogram-heights", title: "평행사변형 — 밑변이 바뀌어도 넓이는 같다",
    recall: { figure: figParaBase, text: "평행사변형의 넓이 = 밑변 × 높이.", ask: "밑변 10cm, 높이 4cm인 평행사변형의 넓이는?", options: ["14㎠", "40㎠", "20㎠"], answer: 1, why: "10 × 4 = 40㎠예요.", hint: "곱해요." },
    explore: [],
    proofs: [],
    summary: {
      figure: figParaHeights("summary"),
      terms: [["높이", "밑변과 마주 보는 변 사이의 수직 거리"]],
      facts: ["어느 변을 밑변으로 하든 <b>넓이는 같다</b> → 밑변 × 높이 = 다른 밑변 × 다른 높이", "밑변과 높이가 같으면 모양이 달라도 넓이가 같다", "길을 낸 평행사변형 정원은 길을 빼고 남은 조각을 붙여 넓이를 구한다"]
    },
    pitfall: "다른 변을 밑변으로 잡을 때 높이도 그 변에 수직인 것으로 바꿔야 합니다.",
    example: {
      prompt: "평행사변형의 밑변 15cm에 대한 높이가 8cm입니다. 길이 12cm인 다른 변을 밑변으로 하면 높이 ?는?",
      figure: figParaHeights("example"),
      steps: [
        { ask: "넓이는? 15 × 8 =", answer: "120", unit: "㎠", why: "밑변 × 높이입니다.", hint: "곱해요." },
        { ask: "다른 높이는? 120 ÷ 12 =", answer: "10", unit: "cm", why: "넓이는 그대로입니다.", hint: "나눠요." }
      ]
    },
    check: C3("c2-parallelogram-area")
  }],
  "2/3": [{
    id: "same-height-triangles", title: "높이가 같은 삼각형의 넓이",
    recall: { figure: figSplitTri, text: "삼각형의 넓이 = 밑변 × 높이 ÷ 2.", ask: "꼭짓점이 같고 밑변이 한 직선 위에 있는 두 삼각형의 높이는?", options: ["같다", "다르다"], answer: 0, why: "꼭짓점에서 같은 직선까지 내린 수직이라 같아요.", hint: "높이를 그어 봐요." },
    explore: [],
    proofs: [["triangle-area", "삼각형의 넓이는 왜 밑변 × 높이 ÷ 2일까"]],
    summary: {
      figure: figSplitTri,
      terms: [["높이가 같다", "꼭짓점이 같고 밑변이 한 직선 위"]],
      facts: ["높이가 같으면 <b>넓이의 비 = 밑변의 비</b>", "넓이를 알면 높이 = 넓이 × 2 ÷ 밑변", "복잡한 도형은 넓이를 아는 큰 도형에서 빼거나 삼각형으로 나누어 더한다"]
    },
    pitfall: "높이가 같은지 먼저 확인합니다. 꼭짓점이 다르면 넓이를 밑변만으로 비교할 수 없습니다.",
    example: {
      prompt: "꼭짓점이 같은 두 삼각형의 밑변이 한 직선 위에 6cm, 7cm로 나란히 있습니다. 왼쪽 삼각형의 넓이가 24㎠이면 오른쪽 삼각형의 넓이는?",
      figure: figSplitTri,
      steps: [
        { ask: "높이는? 24 × 2 ÷ 6 =", answer: "8", unit: "cm", why: "넓이 × 2 ÷ 밑변입니다.", hint: "48 ÷ 6" },
        { ask: "오른쪽 넓이는? 7 × 8 ÷ 2 =", answer: "28", unit: "㎠", why: "높이가 같으니 같은 높이를 씁니다.", hint: "56 ÷ 2" }
      ]
    },
    check: C3("c2-triangle-area")
  }],
  "2/4": [{
    id: "trapezoid-diagonal", title: "사다리꼴의 넓이 — 대각선으로 나누기",
    recall: { figure: figTrapSplit, text: "사다리꼴의 넓이 = (윗변 + 아랫변) × 높이 ÷ 2.", ask: "사다리꼴을 대각선으로 나누면 삼각형 몇 개?", options: ["2개", "3개", "4개"], answer: 0, why: "대각선 하나가 두 삼각형으로 나눠요.", hint: "선 하나" },
    explore: [],
    proofs: [["trapezoid-area", "사다리꼴의 넓이"]],
    summary: {
      figure: figTrapSplit,
      terms: [["대각선으로 나누기", "윗변을 밑변으로 하는 삼각형 + 아랫변을 밑변으로 하는 삼각형"]],
      facts: ["두 삼각형의 높이는 모두 사다리꼴의 높이", "넓이 = 윗변 × 높이 ÷ 2 + 아랫변 × 높이 ÷ 2 = <b>(윗변 + 아랫변) × 높이 ÷ 2</b>", "넓이·높이·한 변을 알면 나머지 변을 거꾸로 구한다"]
    },
    pitfall: "높이를 비스듬한 변으로 재지 않습니다. 평행한 두 변 사이의 수직 거리입니다.",
    example: {
      prompt: "윗변 6cm, 아랫변 14cm, 높이 5cm인 사다리꼴을 대각선으로 두 삼각형으로 나누었습니다. 넓이는?",
      figure: figTrapSplit,
      steps: [
        { ask: "윗변을 밑변으로 하는 삼각형: 6 × 5 ÷ 2 =", answer: "15", unit: "㎠", why: "높이는 사다리꼴의 높이입니다.", hint: "30 ÷ 2" },
        { ask: "아랫변을 밑변으로 하는 삼각형: 14 × 5 ÷ 2 =", answer: "35", unit: "㎠", why: "같은 높이입니다.", hint: "70 ÷ 2" },
        { ask: "사다리꼴의 넓이는?", answer: "50", unit: "㎠", why: "15 + 35 = 50 = (6 + 14) × 5 ÷ 2입니다.", hint: "더해요." }
      ]
    },
    check: C3("c2-trapezoid-area")
  }],
  "3/1": [{
    id: "rect-parts", title: "나누어진 직사각형의 둘레",
    recall: { figure: figParts, text: "직사각형의 둘레 = (가로 + 세로) × 2.", ask: "가로 5cm, 세로 3cm인 직사각형의 둘레는?", options: ["8cm", "15cm", "16cm"], answer: 2, why: "(5 + 3) × 2 = 16cm예요.", hint: "8 × 2" },
    explore: [],
    proofs: [["diagonal-rectangles", "대각선 자리 두 직사각형의 둘레"]],
    summary: {
      figure: figParts,
      terms: [["대각선 자리", "왼쪽 위와 오른쪽 아래, 오른쪽 위와 왼쪽 아래"]],
      facts: ["두 선분으로 넷으로 나누면 <b>대각선 자리 두 조각의 둘레의 합 = 큰 직사각형의 둘레</b>", "그래서 왼위 + 오른아래 = 오른위 + 왼아래", "넷 중 셋을 알면 나머지 하나를 구한다"]
    },
    pitfall: "네 조각의 둘레를 모두 더하면 큰 직사각형 둘레의 두 배입니다(안쪽 선분이 두 번씩 들어감).",
    example: {
      prompt: "직사각형을 넷으로 나누었더니 왼쪽 위 22cm, 오른쪽 위 28cm, 왼쪽 아래 26cm였습니다. 오른쪽 아래 조각의 둘레는?",
      figure: figParts,
      steps: [
        { ask: "오른쪽 위 + 왼쪽 아래 = 28 + 26 =", answer: "54", unit: "cm", why: "대각선 자리 두 조각입니다.", hint: "더해요." },
        { ask: "오른쪽 아래 = 54 − 22 =", answer: "32", unit: "cm", why: "왼쪽 위 + 오른쪽 아래도 54cm여야 합니다.", hint: "54 − 22" }
      ]
    },
    check: [["c2-rect-parts-perimeter", "concept"], ["c2-rect-parts-perimeter", "type"], ["c2-congruent-rect-perimeter", "advanced"]]
  }],
  "3/2": [{
    id: "rectilinear", title: "직각으로 꺾인 도형의 둘레",
    recall: { figure: figStair, text: "둘레는 도형의 바깥 테두리 길이입니다.", ask: "계단 모양의 가로 토막을 모두 위로 밀어 올리면?", options: ["둘러싼 직사각형의 윗변이 된다", "길이가 줄어든다"], answer: 0, why: "가로 토막을 이으면 가장 긴 가로와 같아요.", hint: "밀어 올려 봐요." },
    explore: [],
    proofs: [["staircase-perimeter", "계단 모양의 둘레"]],
    summary: {
      figure: figStair,
      terms: [["직각으로 꺾인 도형", "모든 각이 90° 또는 270°인 도형"]],
      facts: ["바깥으로 밀어낸 변들은 <b>둘러싼 직사각형의 둘레</b>와 같다", "안으로 파인 홈이 있으면 그 <b>홈의 옆변 두 개</b>를 더한다", "둘레 = (가장 긴 가로 + 가장 긴 세로) × 2 (+ 홈의 옆변)"]
    },
    pitfall: "넓이와 둘레를 섞지 않습니다. 계단 모양은 넓이는 줄어도 둘레는 직사각형과 같습니다.",
    example: {
      prompt: "가장 긴 가로 14cm, 가장 긴 세로 12cm인 계단 모양 도형의 둘레는?",
      figure: figStair,
      steps: [
        { ask: "가로 토막을 모으면?", answer: "14", unit: "cm", why: "위아래로 가로 토막을 밀면 가장 긴 가로가 됩니다(위·아래 두 번).", hint: "가장 긴 가로" },
        { ask: "둘레 = (14 + 12) × 2 =", answer: "52", unit: "cm", why: "둘러싼 직사각형의 둘레와 같습니다.", hint: "26 × 2" }
      ]
    },
    check: C3("c2-rectilinear-perimeter")
  }],
  "3/3": [{
    id: "congruent-ratio", title: "똑같은 직사각형과 비",
    recall: { figure: figCongruent, text: "같은 길이로 맞닿은 변을 찾으면 짧은 변 : 긴 변을 알 수 있습니다.", ask: "짧은 변 4개와 긴 변 2개가 같으면 짧은 변 : 긴 변은?", options: ["1 : 2", "2 : 1", "1 : 4"], answer: 0, why: "4 × 짧은 변 = 2 × 긴 변 → 긴 변이 2배예요.", hint: "4 ÷ 2" },
    explore: [],
    proofs: [],
    summary: {
      figure: figCongruent,
      terms: [["비", "짧은 변 : 긴 변"]],
      facts: ["맞닿은 같은 길이로 <b>짧은 변 : 긴 변</b>을 정한다", "작은 직사각형의 둘레로 <b>한 칸의 길이</b>를 구한다", "큰 도형의 가로·세로를 칸으로 세어 둘레를 구한다"]
    },
    pitfall: "작은 직사각형 둘레를 개수만큼 곱하지 않습니다. 맞닿은 변은 바깥 둘레가 아닙니다.",
    example: {
      prompt: "똑같은 직사각형 6개를 위에 세운 것 4개, 아래 눕힌 것 2개로 붙였습니다. 작은 직사각형의 둘레가 18cm일 때 큰 직사각형의 둘레는?",
      figure: figCongruent,
      steps: [
        { ask: "짧은 변을 1칸이라 하면 긴 변은?", answer: "2", unit: "칸", why: "짧은 변 4개 = 긴 변 2개입니다.", hint: "4 ÷ 2" },
        { ask: "둘레 18cm = (1 + 2) × 2 = 6칸 — 한 칸은?", answer: "3", unit: "cm", why: "18 ÷ 6 = 3cm입니다.", hint: "18 ÷ 6" },
        { ask: "큰 직사각형: 가로 4칸 = 12cm, 세로 2 + 1칸 = 9cm — 둘레는?", answer: "42", unit: "cm", why: "(12 + 9) × 2 = 42cm입니다.", hint: "21 × 2" }
      ]
    },
    check: C3("c2-congruent-rect-perimeter")
  }]
};
