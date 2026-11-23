// 2과정 G3 「정육면체와 각·넓이」 개념 꾸러미(DESIGN-COURSE2.md 4절). 열쇠 「단원 번호(0부터)/차시(1부터)」.
// 예제는 새로 지은 문제라 단계 답을 이 파일에 둔다(교재 문항·답이 아니다).
import { svg, text, line, poly, rect, circle, dot, at, P, arrow, angleMark, dirOf, regular, clock, digital, INK, GREEN, SOFT, MARK, BLUE, YELLOW } from "./pack-kit.js?v=20261123b";

const label = (x, y, t, o = {}) => text(x, y, t, { size: 13, color: "#56627f", ...o });
const C3 = (type) => [[type, "concept"], [type, "type"], [type, "advanced"]];
const digits = (str, x, y, o = {}) => [...String(str)].map((c, i) => digital(c, x + i * 34, y, { w: 24, h: 44, width: 4.2, ...o })).join("");

// ── 그림 ──
// 교재(N30) 차례에 맞춘 그림: 디지털 숫자는 막대 숫자로(책상 위 식을 마주 앉은 두 사람이 보는 그림), 주사위는 눈으로,
// 평행선은 평행 표시(›), 넓이는 모눈 위에서 잘라 옮기거나 똑같은 도형을 돌려 붙이는 흐름(→)으로.
const parMark = (x, y) => line(P(x - 6, y - 5), P(x, y), { width: 1.8 }) + line(P(x - 6, y + 5), P(x, y), { width: 1.8 });
const rightMark = (v, a1, s = 8, color = GREEN) => angleMark(v, a1, a1 + 90, s, "", { color });
const askBox = (x, y, w = 48, h = 52) => rect(x, y, w, h, { fill: "#fff", color: MARK, width: 1.8, rx: 6, dash: "5 4" }) + text(x + w / 2, y + h / 2, "?", { size: 22, color: MARK, weight: 800 });
const flow = (x, y) => arrow(P(x, y), P(x + 34, y), { color: GREEN });
const paper = (x, y, cols, rows, k = 14) => {
  let out = "";
  for (let i = 0; i <= cols; i += 1) out += line(P(x + i * k, y), P(x + i * k, y + rows * k), { color: "#dfe6e1", width: 1 });
  for (let j = 0; j <= rows; j += 1) out += line(P(x, y + j * k), P(x + cols * k, y + j * k), { color: "#dfe6e1", width: 1 });
  return out;
};
const figHalfTurn = () => svg(330, 120, digits("25", 20, 30) + text(110, 52, "반 바퀴", { size: 14, color: GREEN }) + arrow(P(90, 74), P(150, 74), { color: GREEN })
  + `<g transform="rotate(180 213 52)">${digits("25", 180, 30)}</g>` + label(53, 100, "처음") + label(213, 100, "돌린 모양"), "25를 반 바퀴 돌린 모양");
const figHalfTurnAsk = () => svg(260, 120, digits("6", 40, 30) + text(122, 52, "반 바퀴", { size: 14, color: GREEN }) + arrow(P(92, 74), P(152, 74), { color: GREEN })
  + askBox(176, 26) + label(52, 100, "처음") + label(200, 100, "돌린 모양"), "디지털 숫자 6을 반 바퀴 돌리면?");
// 책상 위 식을 ①(나)는 아래에서, ②(맞은편 친구)는 위에서 본다
const figDesk = () => {
  const row = digits("16", 40, 52) + text(124, 74, "+", { size: 30, weight: 700 }) + digits("25", 146, 52);
  const up = arrow(P(124, 160), P(124, 134), { color: GREEN }), down = arrow(P(124, 14), P(124, 40), { color: GREEN });
  return svg(250, 190, rect(20, 44, 210, 62, { fill: "#fbfaf4", color: "#c9d3cd", width: 1.4, rx: 8 }) + row + up + down
    + label(124, 176, "① 나") + label(124, 6, "② 맞은편 친구"), "책상 위 디지털 숫자 식을 마주 앉은 두 사람이 보는 그림");
};
const figMirrorNum = () => svg(330, 120, digits("285", 20, 30) + line(P(130, 16), P(130, 96), { color: BLUE, dash: "6 5", width: 2.6 })
  + digits("582", 150, 30, { mirror: true }) + label(70, 110, "실제") + label(200, 110, "거울 속"), "285를 거울에 비춘 모양");
const figMirrorAsk = () => svg(260, 120, digits("2", 50, 30) + line(P(130, 16), P(130, 96), { color: BLUE, dash: "6 5", width: 2.6 })
  + askBox(166, 26) + label(62, 110, "실제") + label(190, 110, "거울 속") + label(130, 8, "거울"), "디지털 숫자 2를 거울에 비추면?");
const cube = (x, y, s, top = "", front = "", right = "") => {
  const d = s * 0.42;
  return poly([P(x, y + d), P(x + s, y + d), P(x + s, y + d + s), P(x, y + d + s)], { fill: "#fff" })
    + poly([P(x, y + d), P(x + d, y), P(x + s + d, y), P(x + s, y + d)], { fill: SOFT })
    + poly([P(x + s, y + d), P(x + s + d, y), P(x + s + d, y + s), P(x + s, y + d + s)], { fill: "#d6e2da" })
    + (top !== "" ? text(x + s / 2 + d / 2, y + d / 2, top, { size: 14 }) : "") + (front !== "" ? text(x + s / 2, y + d + s / 2, front, { size: 16 }) : "") + (right !== "" ? text(x + s + d / 2, y + d / 2 + s / 2, right, { size: 13 }) : "");
};
// 주사위 윗면의 눈(교재처럼 수 대신 눈) — 윗면 평행사변형 안의 칸 좌표(u 오른쪽, w 안쪽)로 찍는다
const PIPS = { 1: [[0.5, 0.5]], 2: [[0.25, 0.25], [0.75, 0.75]], 3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]], 4: [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]], 5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]], 6: [[0.25, 0.22], [0.25, 0.5], [0.25, 0.78], [0.75, 0.22], [0.75, 0.5], [0.75, 0.78]] };
const topPips = (x, y, s, n) => { const d = s * 0.42; return PIPS[n].map(([u, w]) => `<ellipse cx="${(x + u * s + w * d).toFixed(1)}" cy="${(y + d - w * d).toFixed(1)}" rx="3.6" ry="2.4" fill="${n === 1 ? MARK : INK}"/>`).join(""); };
const figDiceTower = () => svg(240, 200, cube(90, 110, 50) + cube(90, 60, 50) + cube(90, 10, 50) + topPips(90, 10, 50, 4), "세로로 쌓은 주사위 3개 — 맨 위 윗면의 눈 4");
const figNet = () => {
  const k = 44, o = P(20, 14), cells = [[1, 0, "1"], [0, 1, "2"], [1, 1, "3"], [2, 1, "5"], [3, 1, "4"], [1, 2, "?"]];
  return svg(220, 160, cells.map(([x, y, t]) => rect(o.x + x * k, o.y + y * k, k, k, { fill: t === "?" ? YELLOW : "#fff" }) + text(o.x + (x + 0.5) * k, o.y + (y + 0.5) * k, t, { size: 17, color: t === "?" ? MARK : INK })).join(""), "주사위 전개도");
};
const figRoll = () => {
  const k = 44, o = P(20, 30);
  return svg(260, 110, [0, 1, 2, 3].map((i) => rect(o.x + i * k, o.y, k, k, { fill: i === 0 ? YELLOW : i === 3 ? "#fbe3df" : "#fff" })).join("") + text(o.x + k / 2, o.y + k / 2, "1", { size: 16 }) + text(o.x + 3.5 * k, o.y + k / 2, "?", { size: 17, color: MARK })
    + arrow(P(o.x + k / 2, o.y + k + 18), P(o.x + 3.5 * k, o.y + k + 18), { color: GREEN }) + label(o.x + 2 * k, o.y - 14, "오른쪽으로 세 번"), "주사위를 오른쪽으로 굴리는 길");
};
const figViews = () => {
  const k = 26;
  const grid = (o, cells) => cells.map(([x, y]) => rect(o.x + x * k, o.y + y * k, k, k, { fill: SOFT })).join("");
  return svg(400, 150, grid(P(20, 30), [[0, 0], [1, 0], [0, 1], [1, 1]]) + label(46, 120, "위에서") + grid(P(150, 30), [[0, 1], [1, 1], [0, 0]]) + label(176, 120, "앞에서") + grid(P(280, 30), [[0, 1], [1, 1], [1, 0]]) + label(306, 120, "오른쪽에서"), "위·앞·오른쪽에서 본 모양");
};
const figExterior = () => {
  const A = P(150, 30), B = P(40, 180), C = P(240, 180);
  return svg(330, 210, poly([A, B, C], { fill: SOFT }) + line(C, P(320, 180), { color: "#9aa39e", dash: "5 4" }) + angleMark(A, dirOf(A, B), dirOf(A, C), 22, "60°", { color: INK })
    + angleMark(B, dirOf(B, C), dirOf(B, A), 24, "50°", { color: INK }) + angleMark(C, 0, dirOf(C, A), 26, "?"), "삼각형의 외각");
};
const figParallel = () => {
  const A = P(130, 50), B = P(210, 170);
  return svg(340, 220, line(P(20, 50), P(310, 50), { width: 2.4 }) + line(P(20, 170), P(310, 170), { width: 2.4 }) + parMark(290, 50) + parMark(290, 170) + line(at(A, 40, dirOf(B, A)), at(B, 40, dirOf(A, B)))
    + angleMark(A, dirOf(A, B), 0, 24, "56°", { color: INK }) + angleMark(B, dirOf(B, A), 180, 24, "?") + text(326, 50, "가", { size: 13 }) + text(326, 170, "나", { size: 13 }), "평행선과 엇각");
};
const figBend = () => {
  const V = P(230, 110), A = P(120, 40), B = P(110, 180);
  return svg(340, 220, line(P(20, 40), P(310, 40), { width: 2.4 }) + line(P(20, 180), P(310, 180), { width: 2.4 }) + parMark(290, 40) + parMark(290, 180) + line(A, V) + line(B, V) + line(V, P(310, 110), { color: GREEN, dash: "5 4", width: 1.6 })
    + angleMark(A, dirOf(A, V), 0, 34, "35°", { color: INK, size: 13 }) + angleMark(B, 0, dirOf(B, V), 34, "40°", { color: INK, size: 13 }) + angleMark(V, dirOf(V, A), dirOf(V, B), 20, "?")
    + text(326, 40, "가", { size: 13 }) + text(326, 180, "나", { size: 13 }), "꺾인 선과 평행선");
};
const figNoNumClock = () => svg(200, 200, clock(P(100, 100), 82, 3, 40, { labels: false }) + line(P(100, 100), P(100, 22), { color: "#9aa39e", dash: "4 4", width: 1.4 }) + angleMark(P(100, 100), 90 - 110, 90, 26, "", { color: MARK }), "숫자 없는 시계");
// 마름모(대각선 8cm·6cm)와 꼭 둘러싼 직사각형 — 모눈 위
const figRhombus = () => {
  const k = 20, x0 = 80, y0 = 20, w = 6 * k, h = 8 * k, cx = x0 + w / 2, cy = y0 + h / 2, p = [P(cx, y0), P(x0 + w, cy), P(cx, y0 + h), P(x0, cy)];
  return svg(280, 210, paper(x0 - 2 * k, y0, 10, 8, k) + rect(x0, y0, w, h, { color: "#9aa39e", width: 1.4, dash: "5 4" }) + poly(p, { fill: YELLOW }) + line(p[0], p[2], { color: GREEN, dash: "5 4" }) + line(p[1], p[3], { color: GREEN, dash: "5 4" })
    + label(x0 + w + 8, cy, "8cm", { anchor: "start" }) + label(cx, y0 + h + 14, "6cm"), "마름모와 둘러싼 직사각형");
};
// 평행사변형 → 높이 선을 따라 잘라 옮기면 직사각형(모눈, 한 칸 1cm)
const figPara = () => {
  const k = 14, x = 14, y = 22, H = 5 * k;
  const left = poly([P(x + 2 * k, y), P(x + 11 * k, y), P(x + 9 * k, y + H), P(x, y + H)], { fill: YELLOW }) + poly([P(x, y + H), P(x + 2 * k, y + H), P(x + 2 * k, y)], { fill: "rgba(180,85,63,.18)", color: MARK, width: 1.4 })
    + line(P(x + 2 * k, y), P(x + 2 * k, y + H), { color: GREEN, dash: "5 4" }) + label(x + 4.5 * k, y + H + 14, "밑변 9cm") + label(x + 2 * k + 5, y + H / 2, "높이 5cm", { anchor: "start", color: GREEN });
  const ox = x + 11 * k + 50;
  const right = poly([P(ox, y), P(ox + 9 * k, y), P(ox + 9 * k, y + H), P(ox, y + H)], { fill: YELLOW }) + poly([P(ox + 7 * k, y), P(ox + 9 * k, y), P(ox + 9 * k, y + H)], { fill: "rgba(180,85,63,.18)", color: MARK, width: 1.4 })
    + label(ox + 4.5 * k, y + H + 14, "9cm") + label(ox + 9 * k + 6, y + H / 2, "5cm", { anchor: "start" });
  return svg(ox + 9 * k + 40, 120, paper(x, y, 11, 5, k) + paper(ox, y, 9, 5, k) + left + flow(x + 11 * k + 8, y + H / 2) + right, "평행사변형을 높이 선으로 잘라 옮기면 직사각형");
};
// 삼각형: 평행사변형을 대각선으로 자르면 똑같은 삼각형 둘(교재처럼 모눈 위에서 → 반)
const figTriHalf = () => {
  const k = 14, x = 14, y = 20, H = 5 * k;
  const A = P(x, y + H), B = P(x + 8 * k, y + H), C = P(x + 11 * k, y), D = P(x + 3 * k, y);
  const ox = x + 11 * k + 50, A2 = P(ox, y + H), B2 = P(ox + 8 * k, y + H), C2 = P(ox + 11 * k, y);
  return svg(ox + 11 * k + 20, 120, paper(x, y, 11, 5, k) + paper(ox, y, 11, 5, k) + poly([A, B, C, D], { fill: "#fff" }) + poly([A, B, C], { fill: YELLOW }) + line(A, C, { color: MARK })
    + flow(x + 11 * k + 8, y + H / 2) + poly([A2, B2, C2], { fill: YELLOW }) + line(C2, P(C2.x, y + H), { color: GREEN, dash: "5 4" }) + line(B2, P(C2.x, y + H), { color: "#9aa39e", dash: "3 3", width: 1.2 })
    + label(ox + 4 * k, y + H + 14, "밑변") + label(C2.x + 6, y + H / 2, "높이", { anchor: "start", color: GREEN }), "평행사변형을 대각선으로 자른 반이 삼각형");
};
const figTriPair = () => {
  const t1 = [P(20, 140), P(140, 140), P(90, 40)], t2 = [P(170, 40), P(290, 40), P(220, 140)]; // 오른쪽은 왼쪽을 반 바퀴 돌린 것
  return svg(400, 170, poly(t1, { fill: YELLOW }) + poly(t2, { fill: YELLOW }) + arrow(P(300, 90), P(330, 90)) + askBox(340, 64), "똑같은 삼각형 두 개를 돌려 붙이면?");
};
const figTri = () => svg(300, 180, poly([P(40, 140), P(250, 140), P(150, 30)], { fill: YELLOW }) + line(P(150, 30), P(150, 140), { color: GREEN, dash: "5 4" }) + rightMark(P(150, 140), 0)
  + label(145, 160, "밑변 12cm") + label(144, 105, "높이 7cm", { anchor: "end", color: GREEN }), "삼각형");
// 사다리꼴: 평행한 두 변에 평행 표시, 똑같은 사다리꼴을 반 바퀴 돌려 붙이면 평행사변형
const trapPts = (ox, oy) => [P(ox + 60, oy), P(ox + 160, oy), P(ox + 220, oy + 100), P(ox, oy + 100)];
const figTrapAsk = () => {
  const t = trapPts(40, 30);
  return svg(300, 150, poly(t, { fill: YELLOW }) + parMark(115, 30) + parMark(135, 130), "평행한 두 변이 있는 사다리꼴");
};
const figTrapDouble = () => {
  const t = trapPts(30, 30), M = P((t[1].x + t[2].x) / 2, (t[1].y + t[2].y) / 2), turn = (p) => P(2 * M.x - p.x, 2 * M.y - p.y);
  const copy = [t[1], turn(t[3]), turn(t[0]), t[2]];
  return svg(430, 175, poly(t, { fill: YELLOW }) + poly(copy, { fill: "rgba(47,107,82,.15)", color: GREEN, width: 1.8, dash: "6 4" })
    + label((t[0].x + t[1].x) / 2, 18, "윗변") + label((t[3].x + t[2].x) / 2, 146, "아랫변") + label((copy[0].x + copy[1].x) / 2, 18, "아랫변", { color: GREEN }) + label((copy[2].x + copy[3].x) / 2, 146, "윗변", { color: GREEN })
    + label(215, 166, "밑변이 윗변 + 아랫변인 평행사변형", { color: GREEN }), "똑같은 사다리꼴을 반 바퀴 돌려 붙인 평행사변형");
};
const figTrap = () => svg(320, 170, poly([P(90, 30), P(190, 30), P(260, 130), P(30, 130)], { fill: YELLOW }) + line(P(190, 30), P(190, 130), { color: GREEN, dash: "5 4" }) + rightMark(P(190, 130), 90)
  + label(140, 18, "윗변 5cm") + label(145, 150, "아랫변 11cm") + label(184, 96, "높이 6cm", { anchor: "end", color: GREEN }), "사다리꼴");

export const PACKS = {
  "0/1": [{
    id: "half-turn-numbers", title: "반 바퀴 돌린 수와 식",
    recall: { figure: figHalfTurnAsk, text: "반 바퀴(180°) 돌리면 위아래와 왼쪽·오른쪽이 함께 바뀝니다.", ask: "디지털 숫자 [[d:6]]을 반 바퀴 돌리면?", options: ["[[d:6]]", "[[d:9]]", "[[d:0]]"], answer: 1, why: "[[d:6]]을 거꾸로 세우면 [[d:9]] 모양이에요.", hint: "종이를 거꾸로 돌려 봐요." },
    explore: [["board", "book-04/flip-rotate-source"]],
    proofs: [["half-turn-two-flips", "반 바퀴 돌리기는 왜 뒤집기 두 번과 같을까"]],
    summary: {
      figure: figHalfTurn,
      terms: [["점대칭", "한 점을 중심으로 반 바퀴 돌렸을 때 처음과 겹치는 것"]],
      facts: ["반 바퀴 돌리면 <b>숫자의 차례가 거꾸로</b> 되고 숫자 모양도 돈다", "반 바퀴에도 숫자인 것: [[d:0]] [[d:1]] [[d:2]] [[d:5]] [[d:8]](그대로), <b>[[d:6]] ↔ [[d:9]]</b>", "마주 앉은 사람이 보는 식 = 내 식을 반 바퀴 돌린 식"]
    },
    pitfall: "모양만 돌리고 자리의 차례를 거꾸로 하지 않으면 틀립니다. [[d:25]]를 돌리면 [[d:52]]입니다.",
    example: {
      prompt: "디지털 숫자로 쓴 식 [[d:16]] + [[d:25]]를 맞은편에 앉은 친구가 봅니다(반 바퀴 돌린 모양). 친구가 읽은 식을 계산하면 얼마인가요?",
      figure: figDesk,
      steps: [
        { ask: "[[d:25]]를 반 바퀴 돌리면?", answer: "52", unit: "", why: "차례가 거꾸로 되고 [[d:2]] [[d:5]]는 그대로입니다.", hint: "오른쪽 숫자가 맨 앞으로" },
        { ask: "[[d:16]]을 반 바퀴 돌리면?", answer: "91", unit: "", why: "차례가 거꾸로 되고 [[d:6]]은 [[d:9]]가 됩니다.", hint: "[[d:6]] → [[d:9]]" },
        { ask: "식 전체가 돌아 [[d:52]] + [[d:91]] — 계산하면?", answer: "143", unit: "", why: "식 전체를 돌리면 두 수의 차례도 바뀝니다. 덧셈이라 순서는 상관없습니다.", hint: "52 + 91" }
      ]
    },
    check: [["digital-transform-arithmetic", "concept"], ["digital-transform-arithmetic", "type"], ["c2-symmetric-number-count", "concept"]]
  }],
  "0/2": [{
    id: "symmetric-numbers", title: "거울수와 점대칭수 세기",
    recall: { figure: figMirrorAsk, text: "거울은 왼쪽과 오른쪽을 바꿉니다.", ask: "디지털 숫자 [[d:2]]를 거울에 비추면?", options: ["[[d:2]]", "[[d:5]]", "[[d:7]]"], answer: 1, why: "막대가 좌우로 바뀌어 [[d:5]] 모양이에요.", hint: "위 오른쪽 막대가 왼쪽으로 가요." },
    explore: [["board", "book-04/digital-flip-source"]],
    proofs: [],
    summary: {
      figure: figMirrorNum,
      terms: [["거울수", "거울에 비추어도 처음과 같은 수"], ["점대칭수", "반 바퀴 돌려도 처음과 같은 수"]],
      facts: ["차례가 거꾸로 되므로 <b>앞자리와 뒷자리를 짝</b>지어 고른다", "거울에서 앞뒤 짝: ([[d:1]], [[d:1]]) ([[d:2]], [[d:5]]) ([[d:5]], [[d:2]]) ([[d:8]], [[d:8]]) ([[d:0]], [[d:0]]) · 가운데 자리는 [[d:0]] [[d:1]] [[d:8]]", "반 바퀴에서 앞뒤 짝: ([[d:1]], [[d:1]]) ([[d:2]], [[d:2]]) ([[d:5]], [[d:5]]) ([[d:6]], [[d:9]]) ([[d:8]], [[d:8]]) ([[d:9]], [[d:6]]) ([[d:0]], [[d:0]]) · 가운데는 [[d:0]] [[d:1]] [[d:2]] [[d:5]] [[d:8]]", "맨 앞자리는 [[d:0]]이 될 수 없다 — 경우를 곱해서 센다"]
    },
    pitfall: "가운데 자리에 [[d:2]] [[d:5]](거울)나 [[d:6]] [[d:9]](반 바퀴)를 넣으면 안 됩니다. 가운데는 제자리에서 자기 자신이 되어야 합니다.",
    example: {
      prompt: "디지털 숫자로 쓴 세 자리 수 중 거울에 비추어도 처음과 똑같은 수는 몇 개인가요?",
      figure: figMirrorNum,
      steps: [
        { ask: "백의 자리([[d:0]] 빼고)와 일의 자리 짝 ([[d:1]], [[d:1]]) ([[d:2]], [[d:5]]) ([[d:5]], [[d:2]]) ([[d:8]], [[d:8]]) — 몇 가지?", answer: "4", unit: "가지", why: "맨 앞이 [[d:0]]이면 세 자리 수가 아닙니다.", hint: "짝을 세요." },
        { ask: "가운데 자리([[d:0]] [[d:1]] [[d:8]])는 몇 가지?", answer: "3", unit: "가지", why: "가운데는 거울에서 자기 자신이어야 합니다.", hint: "막대 숫자를 세요." },
        { ask: "모두 4 × 3 =", answer: "12", unit: "개", why: "앞뒤 짝마다 가운데를 세 가지씩 고를 수 있습니다.", hint: "곱해요." }
      ]
    },
    check: C3("c2-symmetric-number-count")
  }],
  "1/1": [{
    id: "dice-sum-seven", title: "주사위 — 마주 보는 면의 합 7",
    recall: { figure: figDiceTower, text: "주사위는 마주 보는 두 면의 눈을 더하면 7입니다.", ask: "윗면이 4이면 바닥면은?", options: ["3", "4", "6"], answer: 0, why: "4 + 3 = 7이에요.", hint: "7 − 4" },
    explore: [],
    proofs: [],
    summary: {
      figure: figDiceTower,
      terms: [["마주 보는 면", "위·아래, 앞·뒤, 왼쪽·오른쪽 — 합이 7"]],
      facts: ["한 주사위의 눈을 모두 더하면 1 + 2 + … + 6 = <b>21</b>", "위·아래 짝이 7이므로 옆 네 면의 합은 <b>14</b>", "세로로 쌓으면 주사위마다 위·아래가 겹쳐 가려진다 — 맨 위의 윗면만 보인다"]
    },
    pitfall: "가려진 면을 하나하나 맞히려 하지 말고, 마주 보는 짝(합 7)으로 묶어 셉니다.",
    example: {
      prompt: "마주 보는 면의 합이 7인 주사위 3개를 세로로 쌓았습니다. 맨 위 윗면이 4일 때, 바닥면을 포함해 가려진 면의 눈의 합은?",
      figure: figDiceTower,
      steps: [
        { ask: "주사위 3개의 위·아래 면을 모두 더하면? 7 × 3 =", answer: "21", unit: "", why: "주사위마다 위·아래 짝이 7입니다.", hint: "7 × 3" },
        { ask: "보이는 맨 위 윗면을 빼면? 21 − 4 =", answer: "17", unit: "", why: "가려진 것은 위·아래 면 중 맨 위의 윗면을 뺀 나머지 전부입니다.", hint: "21 − 4" }
      ]
    },
    check: C3("c2-dice-hidden-sum")
  }],
  "1/2": [{
    id: "nets-and-rolling", title: "전개도와 굴린 주사위",
    recall: { figure: figNet, text: "정육면체 전개도는 면 6개를 이어 펼친 그림입니다.", ask: "전개도에서 한 줄로 이어진 세 면 중 양 끝 두 면은?", options: ["이웃한다", "마주 본다"], answer: 1, why: "가운데 면을 바닥에 두고 양쪽을 세우면 서로 마주 봐요.", hint: "종이를 접어 상자를 만들어 봐요." },
    explore: [],
    proofs: [["cube-net-opposite", "전개도에서 마주 보는 면은 어떻게 찾을까"]],
    summary: {
      figure: figNet,
      terms: [["전개도", "정육면체를 모서리를 따라 잘라 펼친 그림(11가지)"]],
      facts: ["한 줄로 이어진 세 면의 <b>양 끝은 마주 본다</b>", "바로 붙은 두 면은 이웃한다(마주 보지 않는다)", "주사위를 한 칸 굴리면 <b>굴러가는 쪽의 반대편 면</b>이 위로 올라온다", "같은 쪽으로 네 번 굴리면 처음 모습으로 돌아온다"]
    },
    pitfall: "그림에서 멀리 떨어져 있다고 마주 보는 면은 아닙니다. 한 줄로 셋이 이어졌는지로 판단합니다.",
    example: {
      prompt: "마주 보는 면의 합이 7인 주사위의 윗면이 1, 왼쪽 면이 3입니다. 오른쪽으로 세 번 굴리면 윗면은 얼마인가요?",
      figure: figRoll,
      steps: [
        { ask: "오른쪽으로 한 번 굴리면 왼쪽 면이 위로 — 윗면은?", answer: "3", unit: "", why: "왼쪽 면(3)이 위로 올라옵니다.", hint: "왼쪽 면" },
        { ask: "두 번 굴리면? (처음 바닥면이 위로)", answer: "6", unit: "", why: "처음 바닥면은 7 − 1 = 6, 두 번째에 위로 옵니다.", hint: "7 − 1" },
        { ask: "세 번 굴리면? (처음 오른쪽 면이 위로)", answer: "4", unit: "", why: "처음 오른쪽 면 = 7 − 3 = 4입니다.", hint: "7 − 3" }
      ]
    },
    check: [["c2-cube-net-opposite", "concept"], ["c2-dice-roll", "type"], ["c2-cube-net-opposite", "advanced"]]
  }],
  "1/3": [{
    id: "stack-min-max", title: "세 방향에서 본 쌓기나무의 최대·최소",
    recall: { figure: figViews, text: "위에서 본 모양은 바닥에 놓인 칸을 알려 줍니다.", ask: "위에서 본 칸이 4개이면 바닥에 놓인 쌓기나무는 최소 몇 개?", options: ["2개", "4개", "8개"], answer: 1, why: "칸마다 적어도 하나씩은 있어야 해요.", hint: "빈칸은 없어요." },
    explore: [["board", "book-09/cube-views-source"], ["board", "book-09/cube-min-max-source"]],
    proofs: [["painted-cube", "겉을 칠한 정육면체, 몇 면이 칠해졌을까"]],
    summary: {
      figure: figViews,
      terms: [["바탕그림", "위에서 본 칸에 그 자리의 쌓은 개수를 적은 그림"]],
      facts: ["칸마다 높이는 <b>앞에서 본 높이와 옆에서 본 높이 중 작은 것</b>을 넘을 수 없다 → 그것이 <b>최대</b>", "앞·옆에서 본 가장 높은 기둥이 한 번씩은 꼭 보이게 놓으면 <b>최소</b>", "최대와 최소 사이의 개수는 모두 만들 수 있다"]
    },
    pitfall: "최대를 셀 때 앞에서 본 높이만 쓰면 옆에서 본 모양과 어긋납니다. 두 높이 중 작은 쪽을 씁니다.",
    example: {
      prompt: "위에서 본 모양이 2 × 2 칸이고, 앞에서 보면 왼쪽 기둥 2층·오른쪽 1층, 오른쪽에서 보면 앞 1층·뒤 2층입니다. 쌓기나무는 최대 몇 개, 최소 몇 개인가요?",
      figure: figViews,
      steps: [
        { ask: "칸마다 (앞에서 본 높이, 옆에서 본 높이) 중 작은 것을 더한 최대는? (왼쪽 뒤 2, 왼쪽 앞 1, 오른쪽 뒤 1, 오른쪽 앞 1)", answer: "5", unit: "개", why: "2 + 1 + 1 + 1 = 5개입니다.", hint: "네 칸을 더해요." },
        { ask: "최소는? (왼쪽 뒤 2층 하나로 두 방향의 2층을 함께 보이게, 나머지 세 칸은 1층)", answer: "5", unit: "개", why: "바닥 네 칸은 모두 1개 이상이고, 2층은 왼쪽 뒤 한 곳이면 앞·옆 모두 2층으로 보입니다. 이 모양은 최대와 최소가 같습니다.", hint: "2 + 1 + 1 + 1" }
      ]
    },
    check: [["cube-three-views", "concept"], ["cube-three-view-minmax", "type"], ["cube-three-view-minmax", "advanced"]]
  }],
  "2/1": [{
    id: "triangle-exterior", title: "삼각형의 외각과 정다각형",
    recall: { figure: figExterior, text: "삼각형의 세 각을 모으면 180°입니다.", ask: "두 각이 60°, 50°인 삼각형의 나머지 한 각은?", options: ["60°", "70°", "80°"], answer: 1, why: "180 − 60 − 50 = 70°예요.", hint: "180에서 빼요." },
    explore: [["lab", "angles", "각 떼어 모으기"]],
    proofs: [["triangle-exterior", "삼각형의 외각은 왜 두 내각의 합일까"]],
    summary: {
      figure: figExterior,
      terms: [["외각", "한 변을 늘인 선과 이웃한 변이 이루는 각"]],
      facts: ["삼각형의 한 외각 = <b>이웃하지 않은 두 내각의 합</b>", "까닭: 외각 + 그 옆 내각 = 180° = 세 내각의 합", "정다각형의 한 외각 = 360 ÷ 변의 수"]
    },
    pitfall: "외각은 바로 옆 내각과 더해 180°입니다. 마주 보는 두 내각의 합과 헷갈리지 않습니다.",
    example: {
      prompt: "삼각형의 두 내각이 60°, 50°입니다. 남은 꼭짓점에서 변을 늘여 만든 외각 ?는 몇 도인가요?",
      figure: figExterior,
      steps: [
        { ask: "남은 내각은? 180 − 60 − 50 =", answer: "70", unit: "°", why: "세 내각의 합은 180°입니다.", hint: "180 − 110" },
        { ask: "외각은? 180 − 70 =", answer: "110", unit: "°", why: "외각과 그 옆 내각은 일직선입니다. 60 + 50 = 110과 같습니다.", hint: "180 − 70" }
      ]
    },
    check: [["c2-triangle-angle", "concept"], ["c2-regular-polygon-angle", "type"], ["c2-triangle-angle", "advanced"]]
  }],
  "2/2": [{
    id: "parallel-lines", title: "평행선과 각",
    recall: { figure: figParallel, text: "평행선은 아무리 늘여도 만나지 않는 두 직선입니다.", ask: "두 직선이 만나 생긴 마주 보는 각(맞꼭지각)은?", options: ["같다", "합이 90°"], answer: 0, why: "둘 다 180°에서 같은 이웃 각을 뺀 것이에요.", hint: "일직선 두 개" },
    explore: [],
    proofs: [["parallel-angles", "평행선과 만나는 각은 왜 같을까"]],
    summary: {
      figure: figBend,
      terms: [["동위각", "같은 자리의 각 — 평행선이면 같다"], ["엇각", "엇갈린 자리의 각 — 평행선이면 같다"]],
      facts: ["평행선을 따라 교차점을 옮기면 같은 자리의 각이 겹친다 → <b>동위각이 같다</b>", "맞꼭지각과 함께 쓰면 <b>엇각이 같다</b>", "꺾인 선은 꺾인 곳에 <b>평행선을 하나 더</b> 그어 각을 나눈다 → 꺾인 각 = 두 엇각의 합"]
    },
    pitfall: "평행하다는 표시(화살표)가 없으면 엇각이 같다고 쓸 수 없습니다.",
    example: {
      prompt: "두 평행선 가·나 사이에서 선이 꺾였습니다. 가와 이루는 각이 35°, 나와 이루는 각이 40°일 때 꺾인 곳의 각 ?는?",
      figure: figBend,
      steps: [
        { ask: "꺾인 곳에 가·나와 평행한 점선을 그었습니다. 위쪽 각은(가의 35°와 엇각)?", answer: "35", unit: "°", why: "평행선의 엇각은 같습니다.", hint: "엇각" },
        { ask: "아래쪽 각은(나의 40°와 엇각)?", answer: "40", unit: "°", why: "역시 엇각입니다.", hint: "엇각" },
        { ask: "? = 35 + 40 =", answer: "75", unit: "°", why: "점선이 ?를 두 각으로 나눴습니다.", hint: "더해요." }
      ]
    },
    check: C3("c2-parallel-angle")
  }],
  "2/3": [{
    id: "clock-no-numbers", title: "숫자 없는 시계 읽기",
    recall: { figure: figNoNumClock, text: "짧은바늘은 1시간에 30°, 1분에 0.5° 움직입니다.", ask: "짧은바늘이 12에서 90° 갔으면 몇 시인가요?", options: ["2시", "3시", "4시"], answer: 1, why: "90 ÷ 30 = 3, 3시예요.", hint: "90 ÷ 30" },
    explore: [["lab", "clock", "시계 바늘 각"]],
    proofs: [],
    summary: {
      figure: figNoNumClock,
      terms: [["짧은바늘의 각", "12에서 시계 방향으로 잰 각 = 시 × 30 + 분 × 0.5"]],
      facts: ["짧은바늘의 각 ÷ 30 → <b>몫이 시, 나머지 ÷ 0.5가 분</b>", "두 바늘 사이는 1분에 6 − 0.5 = <b>5.5°</b>씩 달라진다", "숫자가 없어도 긴바늘의 작은 눈금(1분 = 6°)으로 분을 읽는다"]
    },
    pitfall: "짧은바늘이 숫자 사이에 있으면 앞 숫자가 시입니다. 가까운 숫자를 시로 읽지 않습니다.",
    example: {
      prompt: "숫자 없는 시계의 짧은바늘이 12시 자리에서 시계 방향으로 110° 돌아가 있습니다. 몇 시 몇 분인가요?",
      figure: figNoNumClock,
      steps: [
        { ask: "110 ÷ 30의 몫(시)은?", answer: "3", unit: "시", why: "30 × 3 = 90, 남는 것은 20°입니다.", hint: "30 × 3 = 90" },
        { ask: "남은 20°는 몇 분? 20 ÷ 0.5 =", answer: "40", unit: "분", why: "짧은바늘은 1분에 0.5°씩 갑니다.", hint: "20 × 2" }
      ]
    },
    check: [["c2-clock-from-angle", "concept"], ["c2-clock-from-angle", "type"], ["c2-clock-hand-angle", "advanced"]]
  }],
  "3/1": [{
    id: "diagonal-area", title: "대각선이 수직인 사각형의 넓이",
    recall: { figure: figRhombus, text: "직사각형의 넓이 = 가로 × 세로.", ask: "가로 8cm, 세로 6cm인 직사각형의 넓이는?", options: ["14㎠", "28㎠", "48㎠"], answer: 2, why: "8 × 6 = 48㎠예요.", hint: "곱해요." },
    explore: [],
    proofs: [["perpendicular-diagonals", "대각선이 수직인 사각형의 넓이는 왜 두 대각선의 곱 ÷ 2일까"]],
    summary: {
      figure: figRhombus,
      terms: [["마름모", "네 변의 길이가 같은 사각형 — 두 대각선이 서로 수직"]],
      facts: ["대각선이 수직인 사각형을 꼭 둘러싸는 직사각형을 그린다(가로·세로 = 두 대각선)", "사각형은 그 직사각형의 <b>반</b> — 넓이 = <b>대각선 × 대각선 ÷ 2</b>", "정사각형도 대각선이 수직이므로 대각선 × 대각선 ÷ 2로 구할 수 있다"]
    },
    pitfall: "대각선이 수직이 아닌 사각형(일반 평행사변형)에는 쓸 수 없습니다.",
    example: {
      prompt: "두 대각선이 8cm, 6cm인 마름모의 넓이는 몇 ㎠인가요?",
      figure: figRhombus,
      steps: [
        { ask: "둘러싼 직사각형의 넓이는? 8 × 6 =", answer: "48", unit: "㎠", why: "가로·세로가 두 대각선입니다.", hint: "8 × 6" },
        { ask: "마름모는 그 반 — 48 ÷ 2 =", answer: "24", unit: "㎠", why: "바깥 삼각형 넷이 안쪽 삼각형 넷과 똑같습니다.", hint: "반" }
      ]
    },
    check: C3("c2-rhombus-area")
  }],
  "3/2": [{
    id: "parallelogram-area", title: "평행사변형의 넓이",
    recall: { figure: figPara, text: "높이는 밑변에 수직으로 잰 길이입니다.", ask: "평행사변형의 비스듬한 변은 높이인가요?", options: ["높이다", "높이가 아니다"], answer: 1, why: "높이는 밑변과 직각으로 만나는 길이예요.", hint: "직각인지 보세요." },
    explore: [],
    proofs: [["parallelogram-area", "평행사변형의 넓이는 왜 밑변 × 높이일까"]],
    summary: {
      figure: figPara,
      terms: [["밑변·높이", "밑변과 그 맞은편 변 사이의 수직 거리가 높이"]],
      facts: ["높이 선을 따라 한쪽 삼각형을 잘라 반대편에 붙이면 <b>직사각형</b>", "넓이 = <b>밑변 × 높이</b>", "다른 변을 밑변으로 해도 넓이는 같다 → 밑변 × 높이 = 다른 밑변 × 다른 높이"]
    },
    pitfall: "비스듬한 변의 길이를 높이 대신 곱하면 넓이가 커집니다.",
    example: {
      prompt: "밑변 9cm, 높이 5cm인 평행사변형의 넓이와, 같은 평행사변형에서 밑변을 15cm인 변으로 했을 때의 높이를 구하세요.",
      figure: figPara,
      steps: [
        { ask: "넓이는? 9 × 5 =", answer: "45", unit: "㎠", why: "잘라 붙이면 9 × 5 직사각형입니다.", hint: "곱해요." },
        { ask: "15cm 변에 대한 높이는? 45 ÷ 15 =", answer: "3", unit: "cm", why: "넓이는 그대로이므로 넓이 ÷ 밑변입니다.", hint: "45 ÷ 15" }
      ]
    },
    check: C3("c2-parallelogram-area")
  }],
  "3/3": [{
    id: "triangle-area", title: "삼각형의 넓이",
    recall: { figure: figTriPair, text: "평행사변형의 넓이 = 밑변 × 높이.", ask: "똑같은 삼각형 두 개를 돌려 붙이면?", options: ["평행사변형", "원"], answer: 0, why: "마주 보는 변이 평행한 사각형이 돼요.", hint: "돌려 붙여 봐요." },
    explore: [],
    proofs: [["triangle-area", "삼각형의 넓이는 왜 밑변 × 높이 ÷ 2일까"]],
    summary: {
      figure: figTriHalf,
      terms: [["높이", "꼭짓점에서 밑변(또는 밑변을 늘인 선)에 수직으로 내린 길이"]],
      facts: ["똑같은 삼각형 둘 = 평행사변형 → 넓이 = <b>밑변 × 높이 ÷ 2</b>", "둔각삼각형은 높이가 밖으로 나가도 같은 식", "꼭짓점이 같은 두 삼각형은 높이가 같아 <b>넓이가 밑변에 비례</b>"]
    },
    pitfall: "÷ 2를 빠뜨리면 평행사변형의 넓이가 됩니다.",
    example: {
      prompt: "밑변 12cm, 높이 7cm인 삼각형의 넓이는 몇 ㎠인가요?",
      figure: figTri,
      steps: [
        { ask: "똑같은 삼각형 둘로 만든 평행사변형의 넓이는? 12 × 7 =", answer: "84", unit: "㎠", why: "밑변 × 높이입니다.", hint: "곱해요." },
        { ask: "삼각형은 그 반 — 84 ÷ 2 =", answer: "42", unit: "㎠", why: "삼각형은 평행사변형의 반입니다.", hint: "반" }
      ]
    },
    check: C3("c2-triangle-area")
  }],
  "3/4": [{
    id: "trapezoid-area", title: "사다리꼴의 넓이",
    recall: { figure: figTrapAsk, text: "사다리꼴은 마주 보는 한 쌍의 변이 평행합니다(평행 표시 ›).", ask: "사다리꼴에서 평행한 두 변을 무엇이라 하나요?", options: ["윗변과 아랫변", "높이"], answer: 0, why: "평행한 두 변이 윗변과 아랫변이에요.", hint: "평행한 변" },
    explore: [],
    proofs: [],
    summary: {
      figure: figTrapDouble,
      terms: [["윗변·아랫변", "사다리꼴에서 평행한 두 변"]],
      facts: ["똑같은 사다리꼴을 거꾸로 돌려 붙이면 밑변이 <b>윗변 + 아랫변</b>인 평행사변형", "넓이 = <b>(윗변 + 아랫변) × 높이 ÷ 2</b>", "윗변을 0으로 줄이면 삼각형의 식과 같아진다"]
    },
    pitfall: "윗변과 아랫변을 곱하지 않습니다. 둘을 더한 뒤 높이를 곱합니다.",
    example: {
      prompt: "윗변 5cm, 아랫변 11cm, 높이 6cm인 사다리꼴의 넓이는 몇 ㎠인가요?",
      figure: figTrap,
      steps: [
        { ask: "윗변 + 아랫변 =", answer: "16", unit: "cm", why: "돌려 붙인 평행사변형의 밑변입니다.", hint: "5 + 11" },
        { ask: "평행사변형 넓이 16 × 6 =", answer: "96", unit: "㎠", why: "밑변 × 높이입니다.", hint: "곱해요." },
        { ask: "사다리꼴은 그 반 — 96 ÷ 2 =", answer: "48", unit: "㎠", why: "똑같은 사다리꼴 둘로 만들었으니 반입니다.", hint: "반" }
      ]
    },
    check: C3("c2-trapezoid-area")
  }]
};
