// 2과정 G2 「도형분할과 넓이」 개념 꾸러미(DESIGN-COURSE2.md 4절) — 차시마다 되짚기 → 해 보기 → 따져 보기 → 정리 → 예제 → 개념 확인.
// 열쇠 「단원 번호(0부터)/차시(1부터)」. 예제는 새로 지은 문제라 단계 답을 이 파일에 둔다(교재 문항·답이 아니다).
import { svg, text, line, poly, rect, circle, dot, at, P, arrow, angleMark, dirOf, regular, grid, dots, clock, INK, GREEN, SOFT, MARK, BLUE, YELLOW, PINK } from "./pack-kit.js?v=20261122ze";

const label = (x, y, t, o = {}) => text(x, y, t, { size: 13, color: "#56627f", ...o });
const mid = (a, b) => P((a.x + b.x) / 2, (a.y + b.y) / 2);
const C3 = (type) => [[type, "concept"], [type, "type"], [type, "advanced"]];

// ── 그림 ──
const figRearrange = () => {
  const k = 22;
  return svg(430, 170, grid(P(16, 40), 9, 4, k) + rect(16, 40, 9 * k, 4 * k, { fill: YELLOW }) + grid(P(16, 40), 9, 4, k, { color: "#b9c3bd", width: 0.8 })
    + arrow(P(224, 84), P(262, 84)) + grid(P(272, 18), 6, 6, k) + rect(272, 18, 6 * k, 6 * k, { fill: YELLOW }) + grid(P(272, 18), 6, 6, k, { color: "#b9c3bd", width: 0.8 })
    + label(115, 150, "9 × 4 = 36칸") + label(338, 158, "6 × 6 = 36칸"), "넓이가 같은 직사각형과 정사각형");
};
const figTwoPieces = () => {
  const k = 30, o = P(40, 20), q = (x, y) => P(o.x + x * k, o.y + y * k);
  // 넓이 12칸인 조각 — 가운데 점(3, 2)을 반 바퀴 돌리면 나머지 조각과 꼭 겹친다
  const piece = [q(0, 0), q(4, 0), q(4, 1), q(3, 1), q(3, 3), q(2, 3), q(2, 4), q(0, 4)];
  return svg(300, 210, rect(o.x, o.y, 6 * k, 4 * k, { fill: SOFT }) + poly(piece, { fill: YELLOW, width: 2.6 })
    + grid(o, 6, 4, k, { color: "#9aa39e", width: 0.8 }) + rect(o.x, o.y, 6 * k, 4 * k, { width: 2.4 }) + dot(q(3, 2), 5, MARK) + label(150, 200, "가운데 점을 반 바퀴 돌리면 두 조각이 겹친다"), "합동인 두 조각으로 나눈 직사각형");
};
const figUnitArea = () => {
  const k = 34, o = P(30, 16);
  const shape = [P(o.x + k, o.y), P(o.x + 3 * k, o.y), P(o.x + 4 * k, o.y + k), P(o.x + 4 * k, o.y + 3 * k), P(o.x + k, o.y + 3 * k), P(o.x, o.y + 2 * k), P(o.x, o.y + k)];
  return svg(240, 160, grid(o, 4, 3, k) + poly(shape, { fill: YELLOW, width: 2.4 }) + grid(o, 4, 3, k, { color: "#9aa39e", width: 0.8 }), "모눈 위의 도형");
};
const figTilted = () => {
  const k = 50, o = P(30, 20);
  const sq = [P(o.x + 2 * k, o.y), P(o.x + 3 * k, o.y + 2 * k), P(o.x + k, o.y + 3 * k), P(o.x, o.y + k)];
  return svg(240, 200, grid(o, 3, 3, k) + rect(o.x, o.y, 3 * k, 3 * k, { fill: SOFT, width: 1.6 }) + poly(sq, { fill: YELLOW, color: MARK, width: 2.6 })
    + text(o.x + 2.5 * k, o.y + 0.35 * k, "1", { size: 13 }) + text(o.x + 0.35 * k, o.y + 0.5 * k, "1", { size: 13 }) + label(105, 190, "3 × 3 − 삼각형 4개"), "기울어진 정사각형");
};
const figNestSquares = () => {
  let pts = [P(30, 20), P(210, 20), P(210, 200), P(30, 200)], body = "";
  const fills = ["#fff", SOFT, YELLOW, "rgba(180,85,63,.35)"];
  for (let i = 0; i < 4; i += 1) { body += poly(pts, { fill: fills[i] }); pts = pts.map((p, k) => mid(p, pts[(k + 1) % 4])); }
  return svg(240, 220, body, "가운데 점을 이어 그린 정사각형");
};
const figHexPieces = () => {
  const c = P(130, 115), v = regular(c, 100, 6, 90);
  let body = "";
  for (let i = 0; i < 6; i += 1) body += poly([c, v[i], v[(i + 1) % 6]], { fill: i < 4 ? YELLOW : "#fff", width: 1.8 });
  return svg(260, 230, body, "정삼각형 6개로 나눈 정육각형");
};
const fibBoxes = (unit, o = P(20, 20)) => {
  // 1,1,2,3,5 정사각형 배치(칸): 5×8 직사각형
  const sq = [[3, 0, 1], [4, 0, 1], [3, 1, 2], [0, 0, 3], [0, 3, 5]];
  return sq.map(([x, y, s], i) => rect(o.x + x * unit, o.y + y * unit, s * unit, s * unit, { fill: i === 0 ? YELLOW : "#fff" }) + text(o.x + (x + s / 2) * unit, o.y + (y + s / 2) * unit, String(s), { size: Math.min(18, 9 + s * 2) })).join("");
};
const figFib = () => svg(250, 330, fibBoxes(40, P(20, 10)) + label(125, 322, "한 변: 1, 1, 2, 3, 5 — 앞의 두 수의 합"), "정사각형을 붙여 만든 직사각형");
const figStack = () => {
  const t = 18, o = P(20, 20);   // 짧은 변 2칸, 긴 변 3칸
  let body = "";
  for (let i = 0; i < 3; i += 1) body += rect(o.x + i * 2 * t * 2, o.y, 2 * t * 2, 3 * t * 2, { fill: i === 0 ? YELLOW : "#fff" });
  for (let j = 0; j < 2; j += 1) body += rect(o.x + j * 3 * t * 2, o.y + 3 * t * 2, 3 * t * 2, 2 * t * 2);
  return svg(260, 220, body + label(128, 210, "짧은 변 3개 = 긴 변 2개"), "똑같은 직사각형 5개");
};
const figCircles = () => {
  const s = 14, A = P(70, 150), B = P(70 + 7 * s, 150);
  const x = (8 * 8 - 9 * 9 + 7 * 7) / (2 * 7), y = Math.sqrt(64 - x * x);
  const Cc = P(70 + x * s, 150 - y * s);
  return svg(260, 240, circle(A, 3 * s, { fill: "#fff" }) + circle(B, 4 * s, { fill: "#fff" }) + circle(Cc, 5 * s, { fill: YELLOW }) + poly([A, B, Cc], { color: MARK, width: 2.4 }) + dot(A) + dot(B) + dot(Cc)
    + label(A.x - 4, A.y + 16, "3") + label(B.x + 6, B.y + 16, "4") + label(Cc.x, Cc.y - 10, "5"), "맞닿은 세 원");
};
const figChain = () => {
  const s = 7, c0 = P(20 + 17.5 * s, 130), big = 17.5 * s;
  let body = circle(c0, big, { fill: "#fff", width: 2.4 }), x = 20;
  [20, 10, 5].forEach((d, i) => { body += circle(P(x + (d * s) / 2, c0.y), (d * s) / 2, { fill: i === 2 ? YELLOW : SOFT }); x += d * s; });
  return svg(285, 260, body + line(P(20, c0.y), P(20 + 35 * s, c0.y), { color: GREEN, dash: "5 4", width: 1.2 }), "큰 원의 지름 위에 나란히 놓인 원");
};
const figSticks = () => svg(320, 160, rect(20, 30, 4 * 20, 14, { fill: YELLOW }) + label(60, 18, "4cm") + rect(20, 80, 9 * 20, 14, { fill: SOFT }) + label(110, 68, "9cm")
  + rect(20, 125, 5 * 20, 6, { fill: MARK, color: MARK }) + label(140, 128, "5cm보다 길고") + rect(20, 140, 13 * 20, 6, { fill: GREEN, color: GREEN }) + label(300, 148, "13cm보다 짧게", { anchor: "end" }), "두 막대와 세 번째 막대의 범위");
const figCut = () => {
  const S = 200, A = P(130, 20), B = P(230, 20 + S * 0.866), C = P(30, 20 + S * 0.866);
  const pt = (p, q, t) => P(p.x + (q.x - p.x) * t, p.y + (q.y - p.y) * t);
  const cut = [4, 6, 8].map((v) => v / 30);
  const shape = [pt(A, B, cut[0]), pt(B, A, cut[1]), pt(B, C, cut[1]), pt(C, B, cut[2]), pt(C, A, cut[2]), pt(A, C, cut[0])];
  return svg(260, 220, poly([A, B, C], { color: "#9aa39e", width: 1.4 }) + poly(shape, { fill: YELLOW, width: 2.4 }) + label(A.x, A.y + 24, "4", { color: MARK }) + label(B.x - 22, B.y - 10, "6", { color: MARK }) + label(C.x + 26, C.y - 12, "8", { color: MARK }), "귀퉁이를 잘라 낸 정삼각형");
};
const figWalk = () => {
  const p = [P(30, 170)]; let d = 0;
  for (let i = 0; i < 4; i += 1) { p.push(at(p[i], 62, d)); d += 40; }
  return svg(280, 210, p.slice(0, -1).map((q, i) => line(q, p[i + 1], { width: 2.6 })).join("") + dot(p[0], 4.5, GREEN) + line(p[1], at(p[1], 40, 0), { color: "#9aa39e", dash: "4 4", width: 1.4 }) + angleMark(p[1], 0, 40, 26, "40°"), "40°씩 돌며 그은 선분");
};
const figButterfly = () => {
  const O = P(150, 100);
  const L1 = at(O, 120, 150), L2 = at(O, 105, 210), R1 = at(O, 110, 30), R2 = at(O, 100, -30);
  return svg(300, 200, poly([O, L1, L2], { fill: SOFT }) + poly([O, R1, R2], { fill: YELLOW }) + angleMark(L1, dirOf(L1, L2), dirOf(L1, O), 22, "50°", { color: INK })
    + angleMark(L2, dirOf(L2, O), dirOf(L2, L1), 22, "70°", { color: INK }) + angleMark(R1, dirOf(R1, O), dirOf(R1, R2), 22, "65°", { color: INK }) + angleMark(R2, dirOf(R2, R1), dirOf(R2, O), 22, "?") + angleMark(O, 150, 210, 18, "") + angleMark(O, -30, 30, 18, ""), "나비 모양");
};
const figStar = () => {
  const c = P(130, 120), v = regular(c, 100, 5, 90);
  const order = [0, 2, 4, 1, 3].map((i) => v[i]);
  return svg(260, 240, poly(order, { fill: "rgba(230,239,232,.7)" }) + v.map((p, i) => angleMark(p, dirOf(p, v[(i + 2) % 5]), dirOf(p, v[(i + 3) % 5]), 18, "")).join(""), "오각별");
};
const figClockMove = () => svg(380, 200, clock(P(95, 95), 78, 4, 0) + arrow(P(185, 95), P(215, 95)) + clock(P(290, 95), 78, 4, 20) + label(95, 188, "4시") + label(290, 188, "4시 20분"), "4시와 4시 20분");

export const PACKS = {
  "0/1": [
    {
      id: "rearrange-area", title: "잘라 붙여도 넓이는 그대로",
      recall: { figure: figUnitArea, text: "넓이는 단위넓이(1㎠ 정사각형)가 몇 개인지로 잽니다.", ask: "가로 3cm, 세로 2cm인 직사각형의 넓이는?", options: ["5㎠", "6㎠", "10㎠"], answer: 1, why: "1㎠ 정사각형이 3개씩 2줄, 3 × 2 = 6㎠예요.", hint: "칸 수를 세어 봐요." },
      explore: [["board", "book-09/partition-congruent"]],
      proofs: [["stair-square", "계단 모양으로 자르면 왜 정사각형이 될까"]],
      summary: {
        figure: figRearrange,
        terms: [["넓이", "도형이 덮는 단위넓이(1㎠)의 개수"], ["합동", "모양과 크기가 같아 완전히 겹치는 것"]],
        facts: ["잘라서 다시 붙여도 <b>넓이는 변하지 않는다</b>", "정사각형을 만들려면 먼저 넓이를 구하고, <b>같은 수를 두 번 곱해 그 넓이</b>가 되는 수가 한 변", "계단 모양으로 자르면 조각을 한 칸 밀어 정사각형을 맞출 수 있다"]
      },
      pitfall: "둘레는 잘라 붙이면 바뀝니다. 그대로인 것은 넓이뿐입니다.",
      example: {
        prompt: "가로 9cm, 세로 4cm인 직사각형을 두 조각으로 잘라 붙여 정사각형을 만들었습니다. 정사각형의 한 변은 몇 cm인가요?",
        figure: figRearrange,
        steps: [
          { ask: "직사각형의 넓이는? 9 × 4 =", answer: "36", unit: "㎠", why: "가로 9칸이 4줄 있습니다.", hint: "가로 × 세로" },
          { ask: "같은 수를 두 번 곱해 36이 되는 수는?", answer: "6", unit: "cm", why: "6 × 6 = 36이므로 정사각형의 한 변은 6cm입니다.", hint: "5 × 5, 6 × 6 …을 떠올려요." }
        ]
      },
      check: C3("c2-rearrange-square-side")
    },
    {
      id: "congruent-halves", title: "합동인 두 조각으로 나누기",
      recall: { figure: figTwoPieces, text: "모양과 크기가 같아 완전히 겹치는 두 도형을 합동이라고 합니다.", ask: "합동인 두 조각은 넓이가 어떤가요?", options: ["같다", "다를 수 있다"], answer: 0, why: "완전히 겹치니 넓이도 같아요.", hint: "겹쳐 보면 남는 곳이 있나요?" },
      explore: [],
      proofs: [],
      summary: {
        figure: figTwoPieces,
        terms: [["가운데 점", "반 바퀴 돌리면 도형이 제자리에 겹치는 점"]],
        facts: ["두 조각은 넓이가 같으므로 한 조각은 <b>전체 칸 수 ÷ 2</b>칸", "<b>가운데 점</b>을 지나는 선은 도형을 반 바퀴 돌려 겹치는 두 조각으로 나눈다", "넷으로 나눌 때는 반의 반 바퀴씩 돌려 겹치는지 본다"]
      },
      pitfall: "칸 수만 같다고 합동은 아닙니다. 돌리거나 뒤집어 완전히 겹치는지 확인합니다.",
      example: {
        prompt: "가로 6칸, 세로 4칸인 직사각형을 합동인 두 조각으로 나누려고 합니다. 한 조각은 몇 칸인가요?",
        figure: figTwoPieces,
        steps: [
          { ask: "전체 칸 수는? 6 × 4 =", answer: "24", unit: "칸", why: "가로 6칸이 4줄입니다.", hint: "가로 × 세로" },
          { ask: "한 조각은? 24 ÷ 2 =", answer: "12", unit: "칸", why: "합동인 두 조각은 넓이가 같습니다.", hint: "반으로 나눠요." }
        ]
      },
      check: [["rotational-partition-two", "concept"], ["rotational-partition-two", "type"], ["rotational-partition-four", "advanced"]]
    }
  ],
  "0/2": [
    {
      id: "unit-area", title: "모눈으로 넓이 세기",
      recall: { figure: figUnitArea, text: "모눈 한 칸은 1㎠입니다.", ask: "반 칸짜리 삼각형 2개를 모으면 몇 칸인가요?", options: ["반 칸", "1칸", "2칸"], answer: 1, why: "반 칸 둘이 모이면 온 칸 하나예요.", hint: "반 + 반 = ?" },
      explore: [["board", "book-03/unit-area-shapes"], ["board", "book-09/unit-area-and-half"]],
      proofs: [],
      summary: {
        figure: figUnitArea,
        terms: [["단위넓이", "한 변이 1cm인 정사각형의 넓이 1㎠"]],
        facts: ["<b>온 칸</b>을 먼저 센다", "반 칸(대각선으로 자른 칸)은 <b>둘을 묶어 한 칸</b>", "직사각형의 반으로 보이는 삼각형은 그 직사각형 넓이의 반"]
      },
      pitfall: "비스듬히 잘린 칸을 온 칸으로 세면 넓이가 커집니다.",
      example: {
        prompt: "그림의 도형은 온 칸 9개와 반 칸 4개로 되어 있습니다. 넓이는 몇 ㎠인가요?",
        figure: figUnitArea,
        steps: [
          { ask: "반 칸 4개는 온 칸 몇 개?", answer: "2", unit: "칸", why: "반 칸 둘이 온 칸 하나입니다.", hint: "4 ÷ 2" },
          { ask: "넓이는? 9 + 2 =", answer: "11", unit: "㎠", why: "온 칸과 묶은 칸을 더합니다.", hint: "두 수를 더해요." }
        ]
      },
      check: [["unit-grid-area", "type"], ["unit-grid-area", "advanced"], ["oblique-square-grid-area", "concept"]]
    },
    {
      id: "tilted-square-area", title: "기울어진 정사각형의 넓이",
      recall: { figure: figTilted, text: "직각삼각형은 같은 직사각형의 반입니다.", ask: "가로 2칸, 세로 1칸인 직사각형을 대각선으로 자른 삼각형은 몇 칸인가요?", options: ["1칸", "2칸", "3칸"], answer: 0, why: "직사각형 2칸의 반이라 1칸이에요.", hint: "2칸의 반" },
      explore: [["lab", "dots", "점판 위 정사각형"]],
      proofs: [["square-fifth", "안쪽 정사각형은 왜 전체를 5로 나눈 하나일까"]],
      summary: {
        figure: figTilted,
        terms: [["둘러싼 정사각형", "기울어진 정사각형에 꼭 맞게 바깥에 그린 반듯한 정사각형"]],
        facts: ["기울어진 정사각형 = <b>둘러싼 정사각형 − 귀퉁이 직각삼각형 4개</b>", "한 변이 가로 ㉠칸·세로 ㉡칸을 지나면 넓이 = ㉠ × ㉠ + ㉡ × ㉡", "점판에서 넓이가 다른 정사각형을 빠짐없이 찾을 수 있다"]
      },
      pitfall: "기울어진 정사각형의 한 변을 칸 수로 재면 안 됩니다. 넓이로 먼저 구합니다.",
      example: {
        prompt: "모눈 위에 한 변이 가로 2칸, 세로 1칸을 비스듬히 지나는 정사각형을 그렸습니다. 넓이는 몇 ㎠인가요?",
        figure: figTilted,
        steps: [
          { ask: "둘러싼 정사각형은 한 변 3칸 — 넓이는? 3 × 3 =", answer: "9", unit: "㎠", why: "2 + 1 = 3칸짜리 반듯한 정사각형입니다.", hint: "3 × 3" },
          { ask: "귀퉁이 삼각형 하나는(가로 2·세로 1의 반)?", answer: "1", unit: "㎠", why: "2칸 직사각형의 반입니다.", hint: "2 ÷ 2" },
          { ask: "기울어진 정사각형은? 9 − 1 × 4 =", answer: "5", unit: "㎠", why: "둘러싼 정사각형에서 삼각형 4개를 뺍니다. 2 × 2 + 1 × 1 = 5와도 같습니다.", hint: "9에서 4를 빼요." }
        ]
      },
      check: [["oblique-square-grid-area", "concept"], ["c2-grid-square-areas", "type"], ["c2-side-split-square", "advanced"]]
    }
  ],
  "0/3": [
    {
      id: "midpoint-half", title: "가운데 점을 이으면 반",
      recall: { figure: figNestSquares, text: "정사각형의 대각선은 정사각형을 똑같은 두 삼각형으로 나눕니다.", ask: "정사각형을 대각선 두 개로 나누면 똑같은 삼각형이 몇 개인가요?", options: ["2개", "4개", "8개"], answer: 1, why: "두 대각선이 만나 똑같은 삼각형 4개가 생겨요.", hint: "두 대각선을 그어 봐요." },
      explore: [],
      proofs: [],
      summary: {
        figure: figNestSquares,
        terms: [["가운데 점(중점)", "변을 똑같이 둘로 나누는 점"]],
        facts: ["정사각형의 네 변의 가운데 점을 이으면 넓이는 <b>반</b> — 귀퉁이 삼각형 넷을 접어 넣으면 안쪽을 꼭 덮는다", "정삼각형의 세 변의 가운데 점을 이으면 <b>4분의 1</b>", "여러 번 되풀이하면 그때마다 반(4분의 1)씩"]
      },
      pitfall: "변의 길이가 반이 되는 것이 아니라 넓이가 반이 됩니다.",
      example: {
        prompt: "넓이가 64㎠인 정사각형의 변의 가운데 점을 잇는 일을 세 번 했습니다. 가장 작은 정사각형의 넓이는 몇 ㎠인가요?",
        figure: figNestSquares,
        steps: [
          { ask: "한 번 이으면? 64 ÷ 2 =", answer: "32", unit: "㎠", why: "가운데 점을 이은 정사각형은 반입니다.", hint: "반" },
          { ask: "두 번 이으면?", answer: "16", unit: "㎠", why: "또 반입니다.", hint: "32의 반" },
          { ask: "세 번 이으면?", answer: "8", unit: "㎠", why: "64 → 32 → 16 → 8입니다.", hint: "16의 반" }
        ]
      },
      check: C3("c2-midpoint-nest-area")
    },
    {
      id: "regular-pieces", title: "정다각형을 똑같은 조각으로 나누기",
      recall: { figure: figHexPieces, text: "정육각형은 가운데 점과 꼭짓점을 이으면 정삼각형으로 나뉩니다.", ask: "정육각형은 똑같은 정삼각형 몇 개로 나뉘나요?", options: ["4개", "6개", "8개"], answer: 1, why: "꼭짓점이 6개라 조각도 6개예요.", hint: "꼭짓점 수를 세어요." },
      explore: [],
      proofs: [["octagon-corner", "정팔각형 귀퉁이 삼각형은 왜 가운데 정사각형의 4분의 1일까"]],
      summary: {
        figure: figHexPieces,
        terms: [["같은 조각", "모양과 크기가 같은 조각 — 넓이가 모두 같다"]],
        facts: ["정육각형 = 정삼각형 <b>6개</b> = 작은 정삼각형 <b>24개</b>", "한 조각의 넓이 = 전체 ÷ 조각 수, 색칠한 넓이 = 한 조각 × 색칠한 조각 수", "꼭 맞지 않는 조각은 반쪽끼리 맞춰 같은 조각으로 바꾸어 센다"]
      },
      pitfall: "크기가 다른 조각을 같은 수로 세지 않습니다. 같은 조각으로 다시 나누어 셉니다.",
      example: {
        prompt: "넓이가 36㎠인 정육각형을 정삼각형 6개로 나누고 4개를 색칠했습니다. 색칠한 넓이는 몇 ㎠인가요?",
        figure: figHexPieces,
        steps: [
          { ask: "한 조각은? 36 ÷ 6 =", answer: "6", unit: "㎠", why: "똑같은 조각 6개로 나뉩니다.", hint: "36 ÷ 6" },
          { ask: "색칠한 넓이는? 6 × 4 =", answer: "24", unit: "㎠", why: "색칠한 조각이 4개입니다.", hint: "6을 네 번" }
        ]
      },
      check: C3("c2-regular-piece-area")
    }
  ],
  "1/1": [
    {
      id: "fibonacci", title: "정사각형을 붙인 피보나치 사각형",
      recall: { figure: figFib, text: "정사각형은 네 변의 길이가 모두 같습니다.", ask: "한 변이 3cm인 정사각형의 둘레는?", options: ["9cm", "12cm", "6cm"], answer: 1, why: "3cm가 4개, 3 × 4 = 12cm예요.", hint: "변이 4개" },
      explore: [["board", "book-06/perimeter-source"]],
      proofs: [["fibonacci-rect", "피보나치 사각형의 한 변은 왜 앞의 두 수의 합일까"]],
      summary: {
        figure: figFib,
        terms: [["피보나치 수", "1, 1, 2, 3, 5, 8, 13 … — 앞의 두 수를 더해 다음 수"]],
        facts: ["새 정사각형의 한 변 = <b>바로 앞 두 정사각형의 한 변의 합</b>", "가장 작은 정사각형을 1로 놓고 차례로 적어 나간다", "긴 변·짧은 변이 몇인지 알면 <b>1에 해당하는 길이</b>로 실제 길이를 구한다"]
      },
      pitfall: "그림의 크기를 눈으로 재지 않습니다. 맞닿은 변의 길이가 같다는 것으로만 구합니다.",
      example: {
        prompt: "한 변이 1cm, 1cm, 2cm, 3cm, 5cm인 정사각형을 붙여 직사각형을 만들었습니다. 직사각형의 둘레는 몇 cm인가요?",
        figure: figFib,
        steps: [
          { ask: "직사각형의 짧은 변(가장 큰 정사각형의 한 변)은?", answer: "5", unit: "cm", why: "가장 큰 정사각형의 한 변이 짧은 변입니다.", hint: "5cm 정사각형" },
          { ask: "긴 변은? 5 + 3 =", answer: "8", unit: "cm", why: "가장 큰 두 정사각형이 나란히 놓입니다.", hint: "두 수를 더해요." },
          { ask: "둘레는? (5 + 8) × 2 =", answer: "26", unit: "cm", why: "직사각형의 둘레 = (가로 + 세로) × 2", hint: "13 × 2" }
        ]
      },
      check: C3("c2-fibonacci-rect")
    }
  ],
  "1/2": [
    {
      id: "rect-ratio", title: "똑같은 직사각형의 둘레와 비",
      recall: { figure: figStack, text: "두 길이를 견줄 때 몇 대 몇(비)으로 씁니다.", ask: "짧은 막대 3개와 긴 막대 2개의 길이가 같습니다. 짧은 막대 : 긴 막대는?", options: ["3 : 2", "2 : 3", "1 : 1"], answer: 1, why: "짧은 것 3개 = 긴 것 2개이니 짧은 것이 2, 긴 것이 3이에요.", hint: "6을 3으로, 2로 나눠 봐요." },
      explore: [["board", "book-06/rectangle-missing-side"]],
      proofs: [["ratio-rects", "작은 직사각형의 가로와 세로의 비는 어떻게 알까"]],
      summary: {
        figure: figStack,
        terms: [["비", "두 양을 견주는 것 — 짧은 변 : 긴 변"]],
        facts: ["같은 길이로 맞닿은 변을 찾아 <b>짧은 변 : 긴 변</b>을 먼저 정한다", "작은 직사각형의 둘레 = (짧은 변 + 긴 변) × 2 로 <b>한 칸의 길이</b>를 구한다", "큰 도형의 가로·세로를 칸으로 세어 둘레를 구한다"]
      },
      pitfall: "작은 직사각형의 둘레를 개수만큼 곱하면 안 됩니다. 붙은 변은 둘레에 들어가지 않습니다.",
      example: {
        prompt: "똑같은 직사각형 5개를 그림처럼 붙였습니다(위에 세운 것 3개, 아래 눕힌 것 2개). 작은 직사각형의 둘레가 20cm일 때, 큰 직사각형의 둘레는 몇 cm인가요?",
        figure: figStack,
        steps: [
          { ask: "짧은 변 3개 = 긴 변 2개 — 짧은 변을 2칸이라 하면 긴 변은 몇 칸?", answer: "3", unit: "칸", why: "2 × 3 = 6 = 3 × 2입니다.", hint: "6 ÷ 2" },
          { ask: "둘레 20cm = (2 + 3) × 2 = 10칸 — 한 칸은?", answer: "2", unit: "cm", why: "20 ÷ 10 = 2cm입니다.", hint: "20 ÷ 10" },
          { ask: "큰 직사각형은 가로 12cm, 세로 6 + 4 = 10cm — 둘레는?", answer: "44", unit: "cm", why: "짧은 변 4cm, 긴 변 6cm. 가로 = 짧은 변 3개 = 12cm, 세로 = 긴 변 + 짧은 변 = 10cm, (12 + 10) × 2 = 44cm입니다.", hint: "(12 + 10) × 2" }
        ]
      },
      check: C3("c2-congruent-rect-perimeter")
    }
  ],
  "2/1": [
    {
      id: "touching-circles", title: "맞닿은 원의 가운데 잇기",
      recall: { figure: figCircles, text: "원의 가운데에서 원 위까지의 길이가 반지름입니다.", ask: "반지름이 3cm, 4cm인 두 원이 밖에서 맞닿아 있습니다. 두 원의 가운데 사이는?", options: ["1cm", "7cm", "12cm"], answer: 1, why: "맞닿은 점까지 각각 반지름이라 3 + 4 = 7cm예요.", hint: "두 반지름을 이어 봐요." },
      explore: [["lab", "compass", "컴퍼스로 원 그리기"]],
      proofs: [],
      summary: {
        figure: figCircles,
        terms: [["반지름", "한 원에서는 모두 같은 길이"], ["지름", "반지름의 2배"]],
        facts: ["밖에서 맞닿은 두 원의 가운데 사이 = <b>두 반지름의 합</b>", "세 원의 가운데를 이은 삼각형의 둘레 = <b>세 반지름의 합 × 2</b>", "사분원이 변 위에서 만나면 그 변 = 두 반지름의 합"]
      },
      pitfall: "가운데 사이에 반지름을 하나만 쓰면 틀립니다. 맞닿은 두 원의 반지름을 모두 더합니다.",
      example: {
        prompt: "반지름이 3cm, 4cm, 5cm인 세 원이 서로 맞닿아 있습니다. 세 원의 가운데를 이은 삼각형의 둘레는 몇 cm인가요?",
        figure: figCircles,
        steps: [
          { ask: "세 변은 3 + 4, 4 + 5, 5 + 3 — 가장 긴 변은?", answer: "9", unit: "cm", why: "4cm 원과 5cm 원의 가운데 사이입니다.", hint: "4 + 5" },
          { ask: "둘레는? 7 + 9 + 8 =", answer: "24", unit: "cm", why: "반지름마다 두 번씩 들어가 (3 + 4 + 5) × 2 = 24와 같습니다.", hint: "세 수를 더해요." }
        ]
      },
      check: [["c2-circle-center-triangle", "concept"], ["c2-corner-quarter-circles", "type"], ["c2-circle-center-triangle", "advanced"]]
    },
    {
      id: "diameter-chain", title: "지름이 두 배씩인 원",
      recall: { figure: figChain, text: "지름은 원의 가운데를 지나 원을 가로지르는 선분입니다.", ask: "반지름이 5cm인 원의 지름은?", options: ["5cm", "10cm", "15cm"], answer: 1, why: "지름은 반지름의 2배예요.", hint: "5 × 2" },
      explore: [],
      proofs: [],
      summary: {
        figure: figChain,
        terms: [["두 배씩", "다음 원의 지름이 앞 원 지름의 2배"]],
        facts: ["가장 작은 원의 지름을 <b>1</b>로 놓는다", "두 배씩이면 지름은 1, 2, 4 …", "큰 원의 지름 위에 나란히 놓였으면 큰 원의 지름 = 작은 원 지름들의 <b>합</b>"]
      },
      pitfall: "반지름과 지름을 섞지 않습니다. 문제에서 묻는 것이 반지름인지 지름인지 끝까지 확인합니다.",
      example: {
        prompt: "큰 원의 지름 위에 원 ㉮, ㉯, ㉰를 나란히 그렸습니다. ㉮의 지름은 ㉯의 2배, ㉯는 ㉰의 2배이고 큰 원의 지름은 35cm입니다. ㉰의 지름은 몇 cm인가요?",
        figure: figChain,
        steps: [
          { ask: "㉰를 1로 놓으면 ㉮ + ㉯ + ㉰ = 4 + 2 + 1 =", answer: "7", unit: "", why: "지름이 두 배씩이므로 1, 2, 4입니다.", hint: "세 수를 더해요." },
          { ask: "㉰의 지름은? 35 ÷ 7 =", answer: "5", unit: "cm", why: "큰 원의 지름 35cm가 7에 해당합니다.", hint: "35 ÷ 7" }
        ]
      },
      check: [["c2-circle-diameter-chain", "concept"], ["c2-circle-diameter-chain", "type"], ["c2-inscribed-midpoint", "advanced"]]
    }
  ],
  "2/2": [
    {
      id: "triangle-rule", title: "세 막대로 삼각형 만들기",
      recall: { figure: figSticks, text: "삼각형은 세 변으로 둘러싸인 도형입니다.", ask: "3cm, 4cm, 8cm 막대로 삼각형을 만들 수 있나요?", options: ["있다", "없다"], answer: 1, why: "3 + 4 = 7이 8보다 짧아 두 막대가 만나지 못해요.", hint: "짧은 두 막대를 이어 8cm에 닿나요?" },
      explore: [],
      proofs: [["triangle-sticks", "세 막대로 삼각형을 만들 수 있는 때는 언제일까"]],
      summary: {
        figure: figSticks,
        terms: [["삼각형이 되는 조건", "가장 긴 변 < 나머지 두 변의 합"]],
        facts: ["짧은 두 변의 합이 가장 긴 변보다 <b>길어야</b> 삼각형이 된다(같으면 납작해진다)", "두 막대 ㉠ < ㉡에 셋째를 고르면 <b>㉡ − ㉠보다 길고 ㉠ + ㉡보다 짧게</b>", "둘레가 정해지면 가장 긴 변은 둘레의 반보다 짧다"]
      },
      pitfall: "두 변의 합이 셋째 변과 같을 때는 삼각형이 되지 않습니다(한 줄로 눕습니다).",
      example: {
        prompt: "4cm, 9cm 막대에 자연수 길이의 막대를 하나 더해 삼각형을 만들려고 합니다. 셋째 막대의 길이는 몇 가지인가요?",
        figure: figSticks,
        steps: [
          { ask: "9 − 4 =", answer: "5", unit: "cm", why: "셋째 막대는 이보다 길어야 합니다(그렇지 않으면 4cm와 합쳐도 9cm에 못 미칩니다).", hint: "두 수의 차" },
          { ask: "4 + 9 =", answer: "13", unit: "cm", why: "셋째 막대는 이보다 짧아야 합니다.", hint: "두 수의 합" },
          { ask: "6cm부터 12cm까지 — 몇 가지?", answer: "7", unit: "가지", why: "6, 7, 8, 9, 10, 11, 12로 7가지입니다.", hint: "12 − 6 + 1" }
        ]
      },
      check: C3("c2-triangle-inequality")
    },
    {
      id: "cut-corners", title: "귀퉁이를 잘라 낸 정삼각형의 둘레",
      recall: { figure: figCut, text: "정삼각형은 세 변의 길이가 같습니다.", ask: "한 변이 30cm인 정삼각형의 둘레는?", options: ["60cm", "90cm", "120cm"], answer: 1, why: "30 × 3 = 90cm예요.", hint: "변이 3개" },
      explore: [],
      proofs: [["hexagon-cut", "귀퉁이를 잘라 낸 육각형의 둘레는 왜 그만큼 줄까"]],
      summary: {
        figure: figCut,
        terms: [["귀퉁이 정삼각형", "큰 정삼각형의 꼭짓점 쪽에서 잘라 낸 작은 정삼각형"]],
        facts: ["귀퉁이를 하나 잘라 내면 변 두 토막이 없어지고 자른 선 한 토막이 생긴다", "그래서 둘레는 <b>잘라 낸 정삼각형의 한 변만큼 줄어든다</b>", "남은 도형의 둘레 = 큰 정삼각형 둘레 − 잘라 낸 한 변들의 합"]
      },
      pitfall: "잘라 낸 삼각형의 둘레 전체를 빼면 틀립니다. 줄어드는 것은 한 변 길이 하나뿐입니다.",
      example: {
        prompt: "한 변이 30cm인 정삼각형에서 한 변이 4cm, 6cm, 8cm인 정삼각형을 귀퉁이마다 잘라 냈습니다. 남은 육각형의 둘레는 몇 cm인가요?",
        figure: figCut,
        steps: [
          { ask: "큰 정삼각형의 둘레는? 30 × 3 =", answer: "90", unit: "cm", why: "세 변이 모두 30cm입니다.", hint: "30 × 3" },
          { ask: "줄어든 길이는? 4 + 6 + 8 =", answer: "18", unit: "cm", why: "귀퉁이마다 잘라 낸 한 변만큼 줄어듭니다.", hint: "세 수를 더해요." },
          { ask: "육각형의 둘레는? 90 − 18 =", answer: "72", unit: "cm", why: "큰 둘레에서 줄어든 만큼을 뺍니다.", hint: "90 − 18" }
        ]
      },
      check: C3("c2-cut-triangle-perimeter")
    }
  ],
  "3/1": [
    {
      id: "exterior-360", title: "한 바퀴 360°와 외각",
      recall: { figure: figWalk, text: "한 바퀴를 돌면 360°입니다.", ask: "반 바퀴는 몇 도인가요?", options: ["90°", "180°", "360°"], answer: 1, why: "한 바퀴 360°의 반이라 180°예요.", hint: "360의 반" },
      explore: [["lab", "angles", "각 떼어 모으기"]],
      proofs: [],
      summary: {
        figure: figWalk,
        terms: [["외각", "한 변을 늘인 선과 이웃한 변이 이루는 각"], ["내각 + 외각", "일직선이라 180°"]],
        facts: ["둘레를 따라 한 바퀴 돌면 <b>외각의 합 = 360°</b>(변이 몇 개든)", "정다각형의 한 외각 = 360 ÷ 변의 수, 변의 수 = 360 ÷ 한 외각", "한 내각 = 180 − 한 외각"]
      },
      pitfall: "내각의 합은 변의 수에 따라 달라지지만, 외각의 합은 언제나 360°입니다.",
      example: {
        prompt: "같은 길이의 선분을 긋고 그 끝에서 40°씩 같은 쪽으로 방향을 바꾸며 계속 그었습니다. 처음 점으로 돌아올 때까지 그린 도형의 한 내각은 몇 도인가요?",
        figure: figWalk,
        steps: [
          { ask: "선분은 몇 개? 360 ÷ 40 =", answer: "9", unit: "개", why: "한 바퀴 360°를 40°씩 돕니다 — 정구각형입니다.", hint: "360 ÷ 40" },
          { ask: "한 내각은? 180 − 40 =", answer: "140", unit: "°", why: "한 꼭짓점에서 내각과 외각은 일직선 180°입니다.", hint: "180 − 40" }
        ]
      },
      check: [["c2-exterior-walk", "concept"], ["c2-regular-polygon-angle", "type"], ["c2-joined-polygon-angle", "advanced"]]
    }
  ],
  "3/2": [
    {
      id: "butterfly", title: "맞꼭지각과 나비각",
      recall: { figure: figButterfly, text: "두 직선이 만나면 마주 보는 두 각(맞꼭지각)이 생깁니다.", ask: "맞꼭지각의 크기는 어떤가요?", options: ["같다", "합이 180°", "다르다"], answer: 0, why: "둘 다 180°에서 같은 이웃 각을 뺀 것이라 같아요.", hint: "이웃 각과 각각 일직선을 이뤄요." },
      explore: [],
      proofs: [],
      summary: {
        figure: figButterfly,
        terms: [["맞꼭지각", "두 직선이 만날 때 서로 마주 보는 각 — 크기가 같다"], ["나비각", "맞꼭지각을 낀 두 삼각형(나비 날개)"]],
        facts: ["두 날개 모두 세 각의 합이 180°이고 가운데 각이 같으므로", "<b>한쪽 날개의 나머지 두 각의 합 = 다른 쪽 날개의 나머지 두 각의 합</b>", "화살촉 모양에서 들어간 꼭짓점의 각 = 나머지 세 각의 합"]
      },
      pitfall: "같은 날개 안의 두 각을 서로 같다고 놓으면 틀립니다. 같은 것은 두 날개의 두 각의 합입니다.",
      example: {
        prompt: "나비 모양의 두 삼각형에서 한쪽 날개의 두 각이 50°, 70°이고, 다른 쪽 날개의 한 각이 65°입니다. ?의 각은 몇 도인가요?",
        figure: figButterfly,
        steps: [
          { ask: "한쪽 날개의 두 각의 합은? 50 + 70 =", answer: "120", unit: "°", why: "가운데 맞꼭지각을 뺀 나머지 두 각입니다.", hint: "두 수를 더해요." },
          { ask: "? = 120 − 65 =", answer: "55", unit: "°", why: "다른 쪽 날개의 두 각의 합도 120°입니다.", hint: "120 − 65" }
        ]
      },
      check: C3("c2-butterfly-angle")
    },
    {
      id: "star-sum", title: "별 모양 꼭짓점 각의 합",
      recall: { figure: figStar, text: "삼각형의 세 각을 모으면 180°입니다.", ask: "삼각형 세 각의 합은?", options: ["180°", "270°", "360°"], answer: 0, why: "세 각을 떼어 모으면 일직선이에요.", hint: "일직선" },
      explore: [],
      proofs: [["star-butterfly", "별 모양의 다섯 꼭지각을 모으면 왜 180°일까"]],
      summary: {
        figure: figStar,
        terms: [["꼭지각", "별의 뾰족한 끝의 각"]],
        facts: ["나비각으로 꼭지각 둘을 <b>옮겨</b> 한 삼각형에 모은다", "오각별의 꼭지각의 합 = <b>180°</b>", "꼭짓점이 많은 별은 하나 건너 이은 것일 때 180 × (꼭짓점 수 − 4)"]
      },
      pitfall: "별 안쪽 오각형의 각과 꼭지각을 섞지 않습니다. 표시한 뾰족한 끝의 각만 더합니다.",
      example: {
        prompt: "꼭짓점을 하나씩 건너 이은 칠각별이 있습니다. 꼭지각 7개의 합은 몇 도인가요?",
        figure: figStar,
        steps: [
          { ask: "오각별의 꼭지각의 합은?", answer: "180", unit: "°", why: "나비각으로 두 꼭지각을 옮기면 한 삼각형의 세 각이 됩니다.", hint: "삼각형 하나" },
          { ask: "칠각별은 180 × (7 − 4) =", answer: "540", unit: "°", why: "하나 건너 이은 별은 꼭짓점이 하나 늘 때마다 180°씩 늡니다.", hint: "180 × 3" }
        ]
      },
      check: C3("c2-star-angle-sum")
    }
  ],
  "3/3": [
    {
      id: "clock-hands", title: "시계 바늘이 움직이는 각",
      recall: { figure: figClockMove, text: "시계의 숫자 사이 한 칸은 360 ÷ 12 = 30°입니다.", ask: "긴바늘은 1분에 몇 도 움직이나요?", options: ["1°", "6°", "30°"], answer: 1, why: "60분에 한 바퀴 360°, 360 ÷ 60 = 6°예요.", hint: "360 ÷ 60" },
      explore: [["lab", "clock", "시계 바늘 각"], ["board", "book-07/clock-reading"]],
      proofs: [],
      summary: {
        figure: figClockMove,
        terms: [["긴바늘(분침)", "1분에 6°"], ["짧은바늘(시침)", "1시간에 30°, 1분에 0.5°"]],
        facts: ["짧은바늘도 분마다 조금씩 움직인다 — 정각 자리에서 <b>분 × 0.5°</b>", "12에서 잰 각: 긴바늘 = 분 × 6, 짧은바늘 = 시 × 30 + 분 × 0.5", "두 바늘 사이 = 두 각의 차(180°보다 크면 360에서 뺀 작은 쪽)"]
      },
      pitfall: "4시 20분의 짧은바늘은 4에 있지 않습니다. 4와 5 사이로 10°만큼 가 있습니다.",
      example: {
        prompt: "4시 20분에 짧은바늘과 긴바늘이 이루는 작은 쪽의 각은 몇 도인가요?",
        figure: figClockMove,
        steps: [
          { ask: "긴바늘은 12에서 20 × 6 =", answer: "120", unit: "°", why: "1분에 6°씩입니다.", hint: "20 × 6" },
          { ask: "짧은바늘은 12에서 4 × 30 + 20 × 0.5 =", answer: "130", unit: "°", why: "4시 자리 120°에 20분 동안 10° 더 갔습니다.", hint: "120 + 10" },
          { ask: "두 바늘 사이는? 130 − 120 =", answer: "10", unit: "°", why: "두 각의 차입니다.", hint: "두 수의 차" }
        ]
      },
      check: [["c2-hour-hand-moved", "concept"], ["c2-clock-hand-angle", "type"], ["c2-hour-hand-moved", "advanced"]]
    }
  ]
};
