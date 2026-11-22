// 2과정 G5 「도형의 넓이와 비」 개념 꾸러미(DESIGN-COURSE2.md 4절). 열쇠 「단원 번호(0부터)/차시(1부터)」.
// 예제는 새로 지은 문제라 단계 답을 이 파일에 둔다(교재 문항·답이 아니다).
import { svg, text, line, poly, rect, dot, at, P, angleMark, dirOf, tick, regular, INK, GREEN, SOFT, MARK, YELLOW } from "./pack-kit.js?v=20261122i";

const label = (x, y, t, o = {}) => text(x, y, t, { size: 13, color: "#56627f", ...o });
const nm = (p, t, dx = 0, dy = 0) => text(p.x + dx, p.y + dy, t, { size: 14, weight: 700 });
const C3 = (type) => [[type, "concept"], [type, "type"], [type, "advanced"]];
const lerp = (a, b, t) => P(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);

// ── 그림 ──
const figStar = () => {
  const c = P(130, 120), v = regular(c, 100, 5, 90);
  return svg(260, 240, poly([0, 2, 4, 1, 3].map((i) => v[i]), { fill: "rgba(230,239,232,.7)" }) + v.map((p, i) => angleMark(p, dirOf(p, v[(i + 2) % 5]), dirOf(p, v[(i + 3) % 5]), 18, "")).join(""), "오각별");
};
const figButterfly = () => {
  const O = P(150, 100), L1 = at(O, 110, 150), L2 = at(O, 100, 210), R1 = at(O, 100, 30), R2 = at(O, 110, -30);
  return svg(300, 200, poly([O, L1, L2], { fill: SOFT }) + poly([O, R1, R2], { fill: YELLOW }) + angleMark(O, 150, 210, 18, "", { color: GREEN }) + angleMark(O, -30, 30, 18, "", { color: GREEN }) + label(150, 190, "맞꼭지각이 같다 → 나머지 두 각의 합이 같다"), "나비 모양");
};
const figCongruent = () => {
  const A = P(30, 150), B = P(160, 150), C = P(70, 40), D = P(340, 40), E = P(210, 40), F = P(300, 150);
  return svg(370, 180, poly([A, B, C], { fill: SOFT }) + poly([D, E, F], { fill: YELLOW }) + tick(A, B, 1) + tick(D, E, 1) + tick(B, C, 2) + tick(E, F, 2) + tick(C, A, 3) + tick(F, D, 3)
    + nm(A, "ㄱ", -10, 6) + nm(B, "ㄴ", 10, 6) + nm(C, "ㄷ", 0, -12) + nm(D, "ㄹ", 10, -6) + nm(E, "ㅁ", -10, -6) + nm(F, "ㅂ", 0, 14), "합동인 두 삼각형");
};
const figRatioAngles = () => svg(310, 210, poly([P(150, 30), P(40, 180), P(270, 180)], { fill: SOFT }) + label(150, 62, "2") + label(72, 166, "3") + label(236, 166, "4"), "세 각의 비 2 : 3 : 4");
const figSlide = () => {
  const B = P(40, 160), C = P(220, 160), A = P(80, 60), A2 = P(250, 60);
  return svg(300, 190, line(P(20, 60), P(290, 60), { color: GREEN, dash: "6 4" }) + poly([A, B, C], { fill: SOFT }) + poly([A2, B, C], { fill: "rgba(255,241,191,.7)" }) + nm(A, "가", 0, -14) + nm(A2, "나", 0, -14) + label(130, 178, "밑변이 같고 높이가 같다"), "평행선 위로 꼭짓점 옮기기");
};
const figRatio = () => {
  const A = P(120, 30), B = P(30, 170), C = P(300, 170), D = lerp(B, C, 2 / 5);
  return svg(330, 200, poly([A, B, C], { fill: "#fff" }) + poly([A, B, D], { fill: YELLOW }) + line(A, D) + line(A, P(120, 170), { color: GREEN, dash: "5 4", width: 1.4 }) + label((B.x + D.x) / 2, 188, "2") + label((D.x + C.x) / 2, 188, "3"), "밑변을 2 : 3으로 나눈 삼각형");
};
const figTrapDiag = () => {
  const A = P(110, 40), D = P(190, 40), B = P(60, 170), C = P(260, 170), O = lerp(A, C, 2 / 7);
  return svg(320, 200, poly([A, B, C, D], { fill: "#fff" }) + poly([A, B, O], { fill: YELLOW }) + poly([D, O, C], { fill: "rgba(255,241,191,.6)" }) + line(A, C) + line(B, D), "대각선을 그은 사다리꼴");
};
const figHeights = () => svg(320, 190, poly([P(30, 160), P(250, 160), P(110, 40)], { fill: SOFT }) + line(P(110, 40), P(110, 160), { color: GREEN, dash: "5 4" }) + line(P(250, 160), at(P(250, 160), 150, 167), { color: MARK, dash: "5 4", width: 1.4 })
  + label(140, 178, "밑변 12cm") + label(116, 100, "높이 8cm", { anchor: "start", color: GREEN }), "두 밑변과 두 높이");
const figTrapEq = () => svg(320, 170, poly([P(90, 30), P(190, 30), P(270, 140), P(30, 140)], { fill: YELLOW }) + line(P(190, 30), P(190, 140), { color: GREEN, dash: "5 4" }) + label(140, 18, "윗변 □cm") + label(150, 158, "아랫변 13cm") + label(196, 86, "높이 8cm", { anchor: "start", color: GREEN }), "사다리꼴");
const figSimilar = () => svg(340, 170, poly([P(20, 150), P(110, 150), P(40, 90)], { fill: SOFT }) + poly([P(140, 150), P(320, 150), P(180, 30)], { fill: YELLOW }) + label(65, 165, "4cm") + label(230, 165, "8cm"), "닮은 두 삼각형");
const figShadow = () => svg(340, 190, rect(40, 40, 18, 130, { fill: SOFT }) + line(P(49, 40), P(280, 170), { color: "#e0a63c", dash: "5 4" }) + line(P(20, 170), P(320, 170), { color: "#9aa39e", width: 1.2 }) + line(P(49, 170), P(280, 170), { color: "#6b5b45", width: 5 })
  + line(P(250, 170), P(250, 140), { width: 3 }) + label(30, 100, "?", { anchor: "end", color: MARK }) + label(165, 184, "그림자 24m") + label(262, 150, "1m", { anchor: "start" }), "탑과 막대의 그림자");

export const PACKS = {
  "0/1": [{
    id: "star-butterfly", title: "정다각별과 나비각",
    recall: { figure: figButterfly, text: "두 직선이 만나 생긴 맞꼭지각은 크기가 같습니다.", ask: "맞꼭지각을 낀 두 삼각형에서 나머지 두 각의 합은?", options: ["같다", "다르다"], answer: 0, why: "둘 다 180°에서 같은 맞꼭지각을 뺀 것이에요.", hint: "180 − 맞꼭지각" },
    explore: [["lab", "angles", "각 떼어 모으기"]],
    proofs: [["butterfly", "나비각"], ["star-tips", "별의 꼭지각을 모으면"], ["inscribed-angle", "원 위의 각"]],
    summary: {
      figure: figStar,
      terms: [["나비각", "맞꼭지각을 낀 두 삼각형 — 나머지 두 각의 합이 같다"], ["정다각별", "정다각형의 꼭짓점을 건너뛰며 이은 별"]],
      facts: ["나비각으로 꼭지각 둘을 <b>옮겨</b> 한 삼각형에 모은다", "오각별 꼭지각의 합 = <b>180°</b>", "하나 건너 이은 별: 꼭지각의 합 = 180 × (꼭짓점 수 − 4)"]
    },
    pitfall: "별의 안쪽 각(오각형의 내각)과 꼭지각을 섞지 않습니다.",
    example: {
      prompt: "꼭짓점을 하나씩 건너 이은 육각별(정삼각형 두 개를 겹친 모양)의 꼭지각 6개의 합은?",
      figure: figStar,
      steps: [
        { ask: "정삼각형 하나의 세 각의 합은?", answer: "180", unit: "°", why: "삼각형 세 각의 합입니다.", hint: "삼각형" },
        { ask: "꼭지각 6개는 정삼각형 두 개의 각 — 합은?", answer: "360", unit: "°", why: "180 × 2 = 360 = 180 × (6 − 4)와 같습니다.", hint: "180 × 2" }
      ]
    },
    check: [["c2-star-angle-sum", "concept"], ["c2-butterfly-angle", "type"], ["c2-star-angle-sum", "advanced"]]
  }],
  "0/2": [{
    id: "congruence", title: "삼각형의 합동",
    recall: { figure: figCongruent, text: "모양과 크기가 같아 완전히 겹치는 두 도형을 합동이라 합니다.", ask: "합동인 두 삼각형에서 대응하는 변의 길이는?", options: ["같다", "다를 수 있다"], answer: 0, why: "완전히 겹치니 대응하는 변도 겹쳐요.", hint: "겹쳐 보세요." },
    explore: [],
    proofs: [],
    summary: {
      figure: figCongruent,
      terms: [["대응", "겹쳤을 때 포개어지는 꼭짓점·변·각"]],
      facts: ["합동 조건 셋: <b>세 변</b> / <b>두 변과 끼인각</b> / <b>한 변과 양 끝 각</b>", "대응하는 변의 길이·대응하는 각의 크기는 같다", "합동을 쓰려면 <b>꼭짓점의 대응 차례</b>부터 맞춘다"]
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
    recall: { figure: figRatioAngles, text: "삼각형의 세 각을 모으면 180°입니다.", ask: "세 각이 □, □, □(모두 같음)이면 □는?", options: ["45°", "60°", "90°"], answer: 1, why: "□ × 3 = 180, □ = 60°예요.", hint: "180 ÷ 3" },
    explore: [],
    proofs: [],
    summary: {
      figure: figRatioAngles,
      terms: [["□로 놓기", "모르는 각을 □로 두고 관계를 식으로 쓰기"]],
      facts: ["세 각의 비 a : b : c → 한 칸 = 180 ÷ (a + b + c)", "이등변삼각형: 두 밑각이 같다 → □ + □ + 꼭지각 = 180", "바깥 각 = 이웃하지 않은 두 내각의 합"]
    },
    pitfall: "비의 칸 수를 더하지 않고 바로 나누면 틀립니다. 칸을 모두 더한 뒤 180을 나눕니다.",
    example: {
      prompt: "삼각형의 세 각의 크기의 비가 2 : 3 : 4입니다. 가장 큰 각은 몇 도인가요?",
      figure: figRatioAngles,
      steps: [
        { ask: "칸은 모두 2 + 3 + 4 =", answer: "9", unit: "칸", why: "비의 수를 모두 더합니다.", hint: "더해요." },
        { ask: "한 칸은 180 ÷ 9 =", answer: "20", unit: "°", why: "세 각의 합 180°를 9칸으로 나눕니다.", hint: "180 ÷ 9" },
        { ask: "가장 큰 각은 4칸 =", answer: "80", unit: "°", why: "4 × 20 = 80°입니다.", hint: "4 × 20" }
      ]
    },
    check: C3("c2-angle-equation")
  }],
  "1/1": [{
    id: "equal-area", title: "평행선과 등적변형",
    recall: { figure: figSlide, text: "삼각형의 넓이 = 밑변 × 높이 ÷ 2.", ask: "밑변과 높이가 같은 두 삼각형의 넓이는?", options: ["같다", "모양에 따라 다르다"], answer: 0, why: "넓이는 밑변과 높이만으로 정해져요.", hint: "식을 보세요." },
    explore: [],
    proofs: [["equal-area", "꼭짓점을 평행선 위로 옮겨도 넓이가 같은 까닭"]],
    summary: {
      figure: figSlide,
      terms: [["등적변형", "넓이를 그대로 두고 모양만 바꾸기"]],
      facts: ["꼭짓점을 밑변과 <b>평행한 직선을 따라</b> 옮기면 높이가 그대로 → 넓이 그대로", "사다리꼴의 두 대각선으로 생긴 양옆 두 삼각형은 <b>넓이가 같다</b>", "복잡한 도형은 등적변형으로 넓이를 아는 도형으로 바꾼다"]
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
    recall: { figure: figRatio, text: "꼭짓점이 같고 밑변이 한 직선 위에 있으면 높이가 같습니다.", ask: "높이가 같은 두 삼각형의 밑변이 2cm, 3cm이면 넓이의 비는?", options: ["2 : 3", "3 : 2", "4 : 9"], answer: 0, why: "높이가 같으니 넓이는 밑변에 비례해요.", hint: "밑변의 비" },
    explore: [],
    proofs: [["ratio-twice", "비를 두 번 쓰는 넓이"]],
    summary: {
      figure: figRatio,
      terms: [["넓이의 비", "높이가 같을 때 = 밑변의 비"]],
      facts: ["점이 밑변을 m : n으로 나누면 두 삼각형 넓이도 <b>m : n</b>", "전체를 m + n칸으로 나누어 한 칸의 넓이를 구한다", "나눈 선 위를 또 나누면 비를 <b>두 번</b> 쓴다"]
    },
    pitfall: "꼭짓점이 다르면 높이가 달라 밑변의 비를 쓸 수 없습니다.",
    example: {
      prompt: "넓이가 40㎠인 삼각형의 밑변 위 점이 밑변을 2 : 3으로 나눕니다. 왼쪽 삼각형의 넓이는?",
      figure: figRatio,
      steps: [
        { ask: "전체는 2 + 3 = 5칸 — 한 칸은 40 ÷ 5 =", answer: "8", unit: "㎠", why: "높이가 같아 넓이도 2 : 3으로 나뉩니다.", hint: "40 ÷ 5" },
        { ask: "왼쪽은 2칸 =", answer: "16", unit: "㎠", why: "2 × 8 = 16㎠입니다.", hint: "2 × 8" }
      ]
    },
    check: C3("c2-area-ratio-base")
  }],
  "1/3": [{
    id: "same-height-apply", title: "높이가 같은 삼각형 활용",
    recall: { figure: figRatio, text: "삼각형의 넓이 = 밑변 × 높이 ÷ 2.", ask: "넓이 30㎠, 밑변 10cm인 삼각형의 높이는?", options: ["3cm", "6cm", "15cm"], answer: 1, why: "30 × 2 ÷ 10 = 6cm예요.", hint: "넓이 × 2 ÷ 밑변" },
    explore: [],
    proofs: [],
    summary: {
      figure: figRatio,
      terms: [["거꾸로 구하기", "넓이·밑변으로 높이, 넓이·높이로 밑변"]],
      facts: ["높이 = 넓이 × 2 ÷ 밑변", "꼭짓점이 같은 삼각형은 한 번 구한 높이를 함께 쓴다", "평행선 사이 삼각형들은 모두 높이가 같다"]
    },
    pitfall: "÷ 2를 잊고 넓이 ÷ 밑변으로 높이를 구하면 반으로 작게 나옵니다.",
    example: {
      prompt: "꼭짓점이 같은 두 삼각형의 밑변이 한 직선 위에 6cm, 9cm로 나란히 있습니다. 왼쪽이 21㎠이면 오른쪽은?",
      figure: figRatio,
      steps: [
        { ask: "높이는? 21 × 2 ÷ 6 =", answer: "7", unit: "cm", why: "넓이 × 2 ÷ 밑변입니다.", hint: "42 ÷ 6" },
        { ask: "오른쪽 넓이는? 9 × 7 ÷ 2 =", answer: "31.5", accept: ["31,5"], unit: "㎠", why: "같은 높이를 씁니다. 넓이의 비 6 : 9 = 2 : 3으로도 21 ÷ 2 × 3 = 31.5㎠입니다.", hint: "63 ÷ 2" }
      ]
    },
    check: [["c2-triangle-area", "concept"], ["c2-triangle-area", "type"], ["c2-equal-area-shift", "advanced"]]
  }],
  "2/1": [{
    id: "base-height-inverse", title: "두 밑변과 두 높이",
    recall: { figure: figHeights, text: "삼각형은 세 변 중 어느 것이든 밑변이 될 수 있습니다.", ask: "밑변을 바꾸면 넓이는?", options: ["그대로", "바뀐다"], answer: 0, why: "같은 삼각형이니 넓이는 하나예요.", hint: "같은 도형" },
    explore: [],
    proofs: [["base-height-inverse", "밑변이 길면 높이가 짧은 까닭"]],
    summary: {
      figure: figHeights,
      terms: [["밑변 × 높이", "어느 밑변으로 재도 같은 값(넓이의 두 배)"]],
      facts: ["밑변 × 그 높이 = <b>다른 밑변 × 그 높이</b>", "밑변이 길수록 그 높이는 짧다", "직각삼각형은 두 직각변으로 넓이를 구한 뒤 빗변에 대한 높이를 구한다"]
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
    id: "area-and-ratio", title: "도형의 넓이와 비",
    recall: { figure: figRatio, text: "넓이의 비는 높이가 같으면 밑변의 비입니다.", ask: "높이의 비가 1 : 2이고 밑변이 같으면 넓이의 비는?", options: ["1 : 2", "2 : 1", "1 : 4"], answer: 0, why: "밑변이 같으면 넓이는 높이에 비례해요.", hint: "높이의 비" },
    explore: [],
    proofs: [],
    summary: {
      figure: figRatio,
      terms: [["비로 나누기", "넓이를 몇 칸으로 보고 칸 수로 세기"]],
      facts: ["밑변이 같으면 넓이의 비 = 높이의 비", "높이가 같으면 넓이의 비 = 밑변의 비", "두 번 나누면 비를 차례로 곱해 칸을 맞춘다"]
    },
    pitfall: "넓이를 길이처럼 바로 나누지 않습니다. 같은 것이 높이인지 밑변인지 먼저 봅니다.",
    example: {
      prompt: "넓이 60㎠인 삼각형의 밑변을 1 : 2로 나눈 점과 꼭짓점을 잇고, 그 선분의 가운데 점과 밑변의 왼쪽 끝을 이었습니다. 왼쪽 맨 아래 작은 삼각형의 넓이는?",
      figure: figRatio,
      steps: [
        { ask: "밑변 1 : 2 → 왼쪽 큰 삼각형 = 60 ÷ 3 × 1 =", answer: "20", unit: "㎠", why: "높이가 같으니 밑변의 비로 나뉩니다.", hint: "60 ÷ 3" },
        { ask: "가운데 점으로 반 → 작은 삼각형 =", answer: "10", unit: "㎠", why: "꼭짓점이 같고 밑변이 같은 반쪽이라 넓이도 반입니다.", hint: "20 ÷ 2" }
      ]
    },
    check: C3("c2-area-ratio-base")
  }],
  "2/3": [{
    id: "area-equation", title: "식으로 구하는 도형의 넓이",
    recall: { figure: figTrapEq, text: "사다리꼴의 넓이 = (윗변 + 아랫변) × 높이 ÷ 2.", ask: "넓이 40㎠, 높이 5cm인 사다리꼴의 (윗변 + 아랫변)은?", options: ["8cm", "16cm", "20cm"], answer: 1, why: "40 × 2 ÷ 5 = 16cm예요.", hint: "넓이 × 2 ÷ 높이" },
    explore: [],
    proofs: [],
    summary: {
      figure: figTrapEq,
      terms: [["□로 놓기", "모르는 길이를 □로 두고 넓이 식을 세우기"]],
      facts: ["넓이 식에 아는 수를 넣고 <b>거꾸로</b> 계산한다", "(윗변 + 아랫변) = 넓이 × 2 ÷ 높이", "두 도형의 넓이가 같다는 조건으로도 식을 세운다"]
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
    id: "similarity", title: "닮음 — 길이는 k배, 넓이는 k × k배",
    recall: { figure: figSimilar, text: "모양이 같고 크기만 다른 두 도형을 닮은 도형이라 합니다.", ask: "한 변이 4cm에서 8cm로 늘었습니다. 몇 배인가요?", options: ["2배", "4배", "8배"], answer: 0, why: "8 ÷ 4 = 2배예요.", hint: "8 ÷ 4" },
    explore: [],
    proofs: [["similar-area", "닮은 도형의 넓이는 왜 k × k배일까"], ["pyramid-hourglass", "모래시계 모양의 닮음"]],
    summary: {
      figure: figSimilar,
      terms: [["닮음비", "대응하는 길이의 비 — 1 : k"]],
      facts: ["대응하는 각은 같고, 대응하는 길이는 모두 <b>k배</b>", "둘레도 <b>k배</b>", "넓이는 밑변도 높이도 k배라 <b>k × k배</b>"]
    },
    pitfall: "길이가 2배라고 넓이도 2배는 아닙니다. 넓이는 2 × 2 = 4배입니다.",
    example: {
      prompt: "닮은 두 삼각형의 대응하는 변이 4cm, 8cm입니다. 작은 삼각형의 넓이가 5㎠이면 큰 삼각형의 넓이는?",
      figure: figSimilar,
      steps: [
        { ask: "닮음비 k는? 8 ÷ 4 =", answer: "2", unit: "", why: "대응하는 변의 비입니다.", hint: "8 ÷ 4" },
        { ask: "넓이는 k × k배 — 5 × 4 =", answer: "20", unit: "㎠", why: "밑변 2배 × 높이 2배 = 4배입니다.", hint: "5 × 4" }
      ]
    },
    check: C3("c2-similar-scale")
  }],
  "3/2": [{
    id: "shadow", title: "그림자로 높이 재기(피라미드 재기)",
    recall: { figure: figShadow, text: "같은 시각에는 햇빛이 같은 기울기로 비춥니다.", ask: "같은 시각, 1m 막대의 그림자가 2m이면 3m 막대의 그림자는?", options: ["5m", "6m", "1.5m"], answer: 1, why: "높이가 3배이니 그림자도 3배, 6m예요.", hint: "3배" },
    explore: [],
    proofs: [["pyramid-hourglass", "모래시계 모양의 닮음"]],
    summary: {
      figure: figShadow,
      terms: [["닮은 직각삼각형", "물체–그림자–햇빛이 만드는 삼각형"]],
      facts: ["같은 시각의 막대와 탑은 <b>닮은 직각삼각형</b>을 만든다", "높이 : 그림자 = 막대 높이 : 막대 그림자", "그림자가 몇 배인지 구해 높이에 곱한다"]
    },
    pitfall: "시각이 다르면 햇빛의 기울기가 달라 비를 쓸 수 없습니다.",
    example: {
      prompt: "같은 시각에 1m 막대의 그림자가 3m이고, 탑의 그림자가 24m입니다. 탑의 높이는?",
      figure: figShadow,
      steps: [
        { ask: "탑의 그림자는 막대 그림자의 몇 배? 24 ÷ 3 =", answer: "8", unit: "배", why: "닮은 삼각형의 닮음비입니다.", hint: "24 ÷ 3" },
        { ask: "탑의 높이는? 1 × 8 =", answer: "8", unit: "m", why: "높이도 같은 배수로 늘어납니다.", hint: "1 × 8" }
      ]
    },
    check: C3("c2-shadow-height")
  }]
};
