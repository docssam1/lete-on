// 2과정 G4 「도형의 복원과 측정」 개념 꾸러미(DESIGN-COURSE2.md 4절). 열쇠 「단원 번호(0부터)/차시(1부터)」.
// 예제는 새로 지은 문제라 단계 답을 이 파일에 둔다(교재 문항·답이 아니다).
import { svg, text, line, poly, rect, circle, dot, at, P, arrow, angleMark, dirOf, tick, regular, INK, GREEN, SOFT, MARK, BLUE, YELLOW } from "./pack-kit.js?v=20261122zf";

const label = (x, y, t, o = {}) => text(x, y, t, { size: 13, color: "#56627f", ...o });
const nm = (p, t, dx = 0, dy = 0) => text(p.x + dx, p.y + dy, t, { size: 14, weight: 700 });
const C3 = (type) => [[type, "concept"], [type, "type"], [type, "advanced"]];

// ── 그림 ──
const figConstruct = () => {
  const A = P(50, 170), B = P(230, 170), r = 180, C = at(A, r, 60);
  const arc = (c, a1, a2) => { const p1 = at(c, r, a1), p2 = at(c, r, a2); return `<path d="M ${p1.x} ${p1.y} A ${r} ${r} 0 0 0 ${p2.x} ${p2.y}" fill="none" stroke="${GREEN}" stroke-width="1.6" stroke-dasharray="5 4"/>`; };
  return svg(280, 200, arc(A, 40, 80) + arc(B, 100, 140) + poly([A, B, C], { fill: SOFT }) + angleMark(A, 0, 60, 26, "60°") + dot(A) + dot(B) + dot(C) + label(140, 190, "같은 반지름 두 호 → 정삼각형"), "컴퍼스로 그린 정삼각형");
};
const figInside = () => {
  const s = 150, A = P(40, 25), B = P(40, 25 + s), C = P(40 + s, 25 + s), D = P(40 + s, 25), E = at(B, s, 60);
  return svg(240, 200, poly([A, B, C, D], { fill: "#fff" }) + poly([E, B, C], { fill: SOFT }) + line(A, E) + tick(A, B) + tick(B, E) + angleMark(B, 60, 90, 26, "30°", { color: INK }) + angleMark(A, dirOf(A, B), dirOf(A, E), 22, "?")
    + nm(A, "A", -12, -6) + nm(B, "B", -12, 10) + nm(C, "C", 12, 10) + nm(D, "D", 12, -6) + nm(E, "E", 0, -14), "정사각형 안의 정삼각형");
};
const figSetSquare = () => {
  const C = P(40, 170), B = P(240, 170), A = P(40, 170 - 200 * Math.tan(30 * Math.PI / 180));
  return svg(280, 220, poly([A, B, C], { fill: SOFT }) + poly([C, B, P(40, 170 + (170 - A.y))], { fill: "none", color: "#9aa39e", width: 1.4 }) + angleMark(B, 180, dirOf(B, A), 30, "30°", { color: INK })
    + label(150, 100, "빗변 12cm") + label(26, (A.y + 170) / 2, "?", { color: MARK }), "30°·60°·90° 삼각형과 거울에 비친 짝");
};
const figTape = () => {
  const a = 50, top = 70, bot = 140, H = bot - top, F1 = P(120, bot), F2 = P(120 + H / Math.tan(a * Math.PI / 180), top);
  const u1 = at(F1, 120, 2 * a), u2 = at(F2, 120, 2 * a);
  return svg(300, 160, `<g transform="translate(0 20)">` + poly([P(20, top), F2, F1, P(20, bot)], { fill: SOFT, width: 0 }) + line(P(20, top), F2) + line(P(20, bot), F1)
    + poly([F1, F2, u2, u1], { fill: "rgba(255,241,191,.9)" }) + line(F1, F2, { color: MARK, dash: "6 4" }) + line(F2, P(F2.x + 50, top), { color: "#9aa39e", dash: "4 4", width: 1.2 })
    + angleMark(F2, 0, a + 180, 20, "50°", { color: INK }) + angleMark(F2, 2 * a, 180, 28, "?") + "</g>", "접은 종이 띠");
};
const figZigzag = () => svg(330, 220, line(P(20, 40), P(310, 40), { width: 2.4 }) + line(P(20, 180), P(310, 180), { width: 2.4 })
  + line(P(80, 40), P(220, 90)) + line(P(220, 90), P(110, 130)) + line(P(110, 130), P(240, 180))
  + angleMark(P(80, 40), dirOf(P(80, 40), P(220, 90)), 0, 30, "20°", { color: INK }) + angleMark(P(220, 90), dirOf(P(220, 90), P(80, 40)), dirOf(P(220, 90), P(110, 130)), 18, "?")
  + angleMark(P(110, 130), dirOf(P(110, 130), P(220, 90)), dirOf(P(110, 130), P(240, 180)), 18, "", { color: GREEN }) + angleMark(P(240, 180), 180, dirOf(P(240, 180), P(110, 130)), 28, "25°", { color: INK }), "평행선 사이 번개 모양");
const figSquaresJoin = () => {
  const k = 40;
  return svg(300, 160, [[0, 1], [1, 1], [2, 1], [2, 0]].map(([x, y]) => rect(30 + x * k, 20 + y * k, k, k, { fill: SOFT })).join("") + line(P(30, 20 + 2 * k), P(30 + 3 * k, 20)) + label(150, 150, "정사각형을 붙인 도형"), "정사각형을 붙인 도형");
};
const figRhombusMax = () => {
  const c = P(130, 110);
  return svg(260, 220, poly([P(130, 20), P(220, 110), P(130, 200), P(40, 110)], { fill: YELLOW }) + line(P(130, 20), P(130, 200), { color: GREEN, dash: "5 4" }) + line(P(40, 110), P(220, 110), { color: GREEN, dash: "5 4" }) + label(140, 60, "12cm", { anchor: "start" }) + label(80, 100, "8cm"), "수직으로 만나는 두 선분");
};
const figSplitTri = () => svg(320, 180, poly([P(30, 150), P(290, 150), P(110, 30)], { fill: "#fff" }) + poly([P(110, 30), P(30, 150), P(150, 150)], { fill: YELLOW }) + line(P(110, 30), P(110, 150), { color: GREEN, dash: "5 4" })
  + label(90, 168, "6cm") + label(220, 168, "7cm") + label(116, 90, "높이", { anchor: "start", color: GREEN }), "높이가 같은 두 삼각형");
const figTrapSplit = () => svg(320, 170, poly([P(90, 30), P(200, 30), P(280, 140), P(30, 140)], { fill: YELLOW }) + line(P(90, 30), P(280, 140), { color: GREEN, dash: "5 4" })
  + label(145, 18, "윗변 6cm") + label(155, 158, "아랫변 14cm") + line(P(200, 30), P(200, 140), { color: "#9aa39e", dash: "3 3", width: 1.2 }) + label(206, 90, "높이 5cm", { anchor: "start" }), "대각선으로 나눈 사다리꼴");
const figParts = () => svg(280, 180, rect(30, 20, 220, 140, { fill: "#fff", width: 2.4 }) + line(P(120, 20), P(120, 160)) + line(P(30, 80), P(250, 80))
  + label(75, 50, "22cm") + label(185, 50, "28cm") + label(75, 120, "26cm") + label(185, 120, "?", { color: MARK }), "넷으로 나눈 직사각형");
const figStair = () => {
  const o = P(30, 20), k = 14;
  const pts = [[0, 0], [4, 0], [4, 4], [9, 4], [9, 8], [14, 8], [14, 12], [0, 12]].map(([x, y]) => P(o.x + x * k, o.y + y * k));
  return svg(260, 220, poly(pts, { fill: YELLOW, width: 2.4 }) + rect(o.x, o.y, 14 * k, 12 * k, { color: GREEN, width: 1.4 }) + label(o.x + 7 * k, o.y + 12 * k + 16, "14cm") + label(o.x - 14, o.y + 6 * k, "12cm"), "계단 모양과 둘러싼 직사각형");
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
    recall: { figure: figConstruct, text: "정삼각형은 세 변과 세 각이 모두 같습니다.", ask: "정삼각형의 한 각은?", options: ["45°", "60°", "90°"], answer: 1, why: "180 ÷ 3 = 60°예요.", hint: "180을 셋으로" },
    explore: [["lab", "compass", "컴퍼스로 그리기"]],
    proofs: [["construct-sss", "세 변의 길이로 삼각형 작도하기"], ["construct-perpendicular-bisector", "선분의 수직이등분선"], ["construct-angle-bisector", "각의 이등분선"]],
    summary: {
      figure: figConstruct,
      terms: [["작도", "자와 컴퍼스만으로 도형을 그리는 것"], ["특수각", "90°·60°·45°·30°처럼 접기·작도로 바로 만드는 각"]],
      facts: ["같은 반지름 두 호의 교점 → <b>정삼각형 → 60°</b>", "선분의 수직이등분선 → <b>90°</b>, 그 각을 이등분 → <b>45°</b>", "60°를 이등분하거나 90° − 60° → <b>30°</b>"]
    },
    pitfall: "컴퍼스 폭을 바꾸면 두 호가 만든 삼각형은 정삼각형이 아닙니다. 같은 반지름으로 그립니다.",
    example: {
      prompt: "정사각형의 한 꼭짓점에서 정삼각형을 그려 직각을 나누었습니다. 남은 각을 반으로 나누면 몇 도인가요?",
      figure: figConstruct,
      steps: [
        { ask: "직각에서 정삼각형의 한 각을 빼면? 90 − 60 =", answer: "30", unit: "°", why: "정삼각형의 한 각은 60°입니다.", hint: "90 − 60" },
        { ask: "그 각을 반으로 나누면?", answer: "15", unit: "°", why: "각의 이등분선으로 똑같이 둘로 나눕니다.", hint: "30 ÷ 2" }
      ]
    },
    check: [["c2-special-angle", "concept"], ["c2-regular-polygon-angle", "type"], ["c2-joined-polygon-angle", "advanced"]]
  }],
  "0/2": [{
    id: "restore-angles", title: "같은 길이로 각 되살리기",
    recall: { figure: figInside, text: "이등변삼각형은 두 변의 길이가 같고 두 밑각이 같습니다.", ask: "꼭지각이 30°인 이등변삼각형의 밑각은?", options: ["65°", "75°", "150°"], answer: 1, why: "(180 − 30) ÷ 2 = 75°예요.", hint: "180 − 30을 반으로" },
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
    recall: { figure: figSetSquare, text: "삼각자는 30°·60°·90° 삼각형과 45°·45°·90° 삼각형입니다.", ask: "30°·60°·90° 삼각형 두 개를 30°와 마주 보는 변이 아닌 긴 다리로 붙이면?", options: ["정삼각형", "정사각형"], answer: 0, why: "세 각이 모두 60°가 돼요.", hint: "30 + 30 = 60" },
    explore: [],
    proofs: [["set-square-half", "30°와 마주 보는 변은 왜 빗변의 반일까"]],
    summary: {
      figure: figSetSquare,
      terms: [["빗변", "직각과 마주 보는 가장 긴 변"]],
      facts: ["30°·60°·90° 삼각형을 거울처럼 붙이면 <b>정삼각형</b>", "그래서 <b>30°와 마주 보는 변 = 빗변의 반</b>", "두 변과 끼인각 30°(또는 150°) → 높이 = 다른 변의 반 → 넓이를 구할 수 있다"]
    },
    pitfall: "60°와 마주 보는 변을 빗변의 반으로 놓으면 틀립니다. 반이 되는 것은 30°와 마주 보는 변입니다.",
    example: {
      prompt: "두 변이 12cm, 9cm이고 그 사이의 각이 30°인 삼각형의 넓이는 몇 ㎠인가요?",
      figure: figSetSquare,
      steps: [
        { ask: "9cm 변을 밑변으로 하면 높이는 12cm의 반 =", answer: "6", unit: "cm", why: "높이를 내리면 생기는 삼각자 모양에서 30°와 마주 보는 변이 높이입니다.", hint: "12 ÷ 2" },
        { ask: "넓이는? 9 × 6 ÷ 2 =", answer: "27", unit: "㎠", why: "삼각형의 넓이 = 밑변 × 높이 ÷ 2입니다.", hint: "54 ÷ 2" }
      ]
    },
    check: C3("c2-set-square-side")
  }],
  "1/1": [{
    id: "fold-tape", title: "평행선과 종이 띠 접기",
    recall: { figure: figTape, text: "평행선에서 엇각은 같습니다.", ask: "종이를 접으면 접는 선 양쪽의 각은?", options: ["같다", "합이 90°"], answer: 0, why: "접어서 겹치니 같은 크기예요.", hint: "포개어 보면?" },
    explore: [],
    proofs: [["tape-fold", "접은 종이 띠에 생기는 이등변삼각형"]],
    summary: {
      figure: figTape,
      terms: [["종이 띠", "위아래 변이 평행한 긴 종이"]],
      facts: ["접는 선 양쪽의 각은 <b>같다</b>(접어서 겹친다)", "띠의 위아래 변이 평행이라 <b>엇각</b>을 옮길 수 있다", "접은 부분에는 두 각이 같은 <b>이등변삼각형</b>이 생긴다 → 남은 각 = 180 − 2 × 접은 각"]
    },
    pitfall: "접힌 각 하나만 보고 끝내지 않습니다. 접힌 각은 언제나 두 개(같은 크기)입니다.",
    example: {
      prompt: "종이 띠를 접었더니 접는 선이 위 변과 50°를 이루었습니다. 접혀 올라간 띠가 위 변의 남은 쪽과 이루는 각 ?는?",
      figure: figTape,
      steps: [
        { ask: "접혀 올라간 변도 접는 선과 몇 도?", answer: "50", unit: "°", why: "접는 선 양쪽의 각은 같습니다.", hint: "접으면 겹쳐요." },
        { ask: "위 변의 오른쪽에서 접혀 올라간 변까지는? 50 + 50 =", answer: "100", unit: "°", why: "두 각이 나란히 붙어 있습니다.", hint: "더해요." },
        { ask: "? = 180 − 100 =", answer: "80", unit: "°", why: "위 변은 일직선(180°)입니다.", hint: "180 − 100" }
      ]
    },
    check: [["c2-fold-tape-angle", "concept"], ["c2-parallel-angle", "type"], ["c2-fold-tape-angle", "advanced"]]
  }],
  "1/2": [{
    id: "zigzag", title: "번개각 — 평행선 사이 지그재그",
    recall: { figure: figZigzag, text: "평행선과 한 직선이 만날 때 엇각은 같습니다.", ask: "꺾인 곳에 평행선을 하나 더 그으면 꺾인 각은?", options: ["두 엇각의 합", "두 엇각의 차"], answer: 0, why: "평행선이 꺾인 각을 엇각 둘로 나눠요.", hint: "나눠 보세요." },
    explore: [],
    proofs: [["zigzag-angle", "번개 모양 각의 규칙"], ["parallel-triangle-sum", "평행선으로 보는 삼각형 세 각의 합"]],
    summary: {
      figure: figZigzag,
      terms: [["번개각", "두 평행선 사이를 지그재그로 오가는 선이 만드는 각"]],
      facts: ["꺾인 곳마다 <b>평행선을 하나씩 더</b> 긋는다", "<b>오른쪽으로 벌어진 각의 합 = 왼쪽으로 벌어진 각의 합</b>", "꺾인 곳이 여럿이어도 같은 규칙"]
    },
    pitfall: "꺾인 곳 하나에만 평행선을 그으면 나머지 각을 옮길 수 없습니다. 꺾인 곳마다 긋습니다.",
    example: {
      prompt: "두 평행선 사이를 선이 지그재그로 꺾였습니다. 위 평행선과 이루는 각 20°와 왼쪽으로 꺾인 곳의 각 70°는 오른쪽으로 벌어지고, 오른쪽으로 꺾인 곳의 각 ?와 아래 평행선과 이루는 각 25°는 왼쪽으로 벌어집니다. ?는?",
      figure: figZigzag,
      steps: [
        { ask: "오른쪽으로 벌어진 각의 합 = 20 + 70 =", answer: "90", unit: "°", why: "꺾인 곳마다 평행선을 그어 엇각을 옮기면 같은 쪽으로 벌어진 각끼리 모입니다.", hint: "20 + 70" },
        { ask: "왼쪽으로 벌어진 각의 합 ? + 25도 90° — ?는?", answer: "65", unit: "°", why: "양쪽의 합이 같아 ? = 90 − 25 = 65°입니다.", hint: "90 − 25" }
      ]
    },
    check: C3("c2-parallel-angle")
  }],
  "1/3": [{
    id: "angle-moving", title: "외각의 합과 각 옮기기",
    recall: { figure: figSquaresJoin, text: "다각형의 외각을 모두 더하면 360°입니다.", ask: "정사각형의 한 외각은?", options: ["45°", "90°", "120°"], answer: 1, why: "360 ÷ 4 = 90°예요.", hint: "360 ÷ 4" },
    explore: [["lab", "angles", "각 떼어 모으기"]],
    proofs: [],
    summary: {
      figure: figSquaresJoin,
      terms: [["각 옮기기", "엇각·맞꼭지각·나비각으로 흩어진 각을 한곳에 모으기"]],
      facts: ["흩어진 각들은 평행선·맞꼭지각으로 <b>한 꼭짓점에 모은다</b>", "둘레를 따라 돌며 꺾는 각을 모두 더하면 <b>360°</b>", "정사각형을 붙인 모양에서는 대각선이 45°씩 나눈 각을 이용한다"]
    },
    pitfall: "모양이 복잡해도 각을 하나씩 따로 구하려 하지 말고, 합을 한 번에 구하는 방법(외각의 합)을 먼저 찾습니다.",
    example: {
      prompt: "어떤 오각형의 외각 다섯 개 중 넷이 60°, 70°, 80°, 90°입니다. 나머지 외각은 몇 도인가요?",
      figure: figSquaresJoin,
      steps: [
        { ask: "네 외각의 합은? 60 + 70 + 80 + 90 =", answer: "300", unit: "°", why: "알고 있는 외각을 모읍니다.", hint: "더해요." },
        { ask: "나머지 외각은? 360 − 300 =", answer: "60", unit: "°", why: "외각을 모두 더하면 360°입니다.", hint: "360 − 300" }
      ]
    },
    check: [["c2-exterior-walk", "concept"], ["c2-exterior-walk", "type"], ["c2-butterfly-angle", "advanced"]]
  }],
  "2/1": [{
    id: "diagonal-area-max", title: "대각선이 수직인 사각형의 넓이",
    recall: { figure: figRhombusMax, text: "대각선이 수직인 사각형의 넓이 = 두 대각선의 곱 ÷ 2.", ask: "대각선이 6cm, 10cm로 수직이면 넓이는?", options: ["16㎠", "30㎠", "60㎠"], answer: 1, why: "6 × 10 ÷ 2 = 30㎠예요.", hint: "60 ÷ 2" },
    explore: [],
    proofs: [["rhombus-area", "마름모의 넓이"]],
    summary: {
      figure: figRhombusMax,
      terms: [["수직으로 만나는 두 선분", "어디서 만나든 네 끝을 이은 사각형의 넓이는 곱 ÷ 2"]],
      facts: ["두 선분이 수직이면 만나는 자리에 상관없이 넓이 = <b>두 선분의 곱 ÷ 2</b>", "가운데 점을 이은 사각형의 넓이는 반", "두 선분이 수직이 아니면 넓이가 줄어든다 — 가장 클 때가 수직"]
    },
    pitfall: "만나는 점이 가운데가 아니어도(연 모양) 넓이 식은 같습니다. 다시 구하지 않아도 됩니다.",
    example: {
      prompt: "길이 12cm, 8cm인 두 막대를 서로 수직으로 겹쳐 놓고 네 끝을 이어 사각형을 만들었습니다. 넓이는?",
      figure: figRhombusMax,
      steps: [
        { ask: "둘러싼 직사각형의 넓이는? 12 × 8 =", answer: "96", unit: "㎠", why: "두 막대가 가로·세로입니다.", hint: "12 × 8" },
        { ask: "사각형은 그 반 =", answer: "48", unit: "㎠", why: "바깥 삼각형 넷과 안쪽 삼각형 넷이 같습니다.", hint: "96 ÷ 2" }
      ]
    },
    check: [["c2-rhombus-area", "concept"], ["c2-rhombus-area", "type"], ["c2-midpoint-nest-area", "advanced"]]
  }],
  "2/2": [{
    id: "parallelogram-heights", title: "평행사변형 — 밑변이 바뀌어도 넓이는 같다",
    recall: { figure: figSplitTri, text: "평행사변형의 넓이 = 밑변 × 높이.", ask: "밑변 10cm, 높이 4cm인 평행사변형의 넓이는?", options: ["14㎠", "40㎠", "20㎠"], answer: 1, why: "10 × 4 = 40㎠예요.", hint: "곱해요." },
    explore: [],
    proofs: [],
    summary: {
      figure: figSplitTri,
      terms: [["높이", "밑변과 마주 보는 변 사이의 수직 거리"]],
      facts: ["어느 변을 밑변으로 하든 <b>넓이는 같다</b> → 밑변 × 높이 = 다른 밑변 × 다른 높이", "밑변과 높이가 같으면 모양이 달라도 넓이가 같다", "길을 낸 평행사변형 정원은 길을 빼고 남은 조각을 붙여 넓이를 구한다"]
    },
    pitfall: "다른 변을 밑변으로 잡을 때 높이도 그 변에 수직인 것으로 바꿔야 합니다.",
    example: {
      prompt: "평행사변형의 밑변 15cm에 대한 높이가 8cm입니다. 길이 12cm인 다른 변을 밑변으로 하면 높이는?",
      figure: figSplitTri,
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
