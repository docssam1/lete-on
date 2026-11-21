// 2과정 G1 「돌리기와 뒤집기」 개념 꾸러미(DESIGN-COURSE2.md 4절) — 차시(단원 번호 / 차시)마다 개념 꾸러미 목록.
// 꾸러미 한 개 = 되짚기(recall) → 해 보기(explore) → 따져 보기(proofs) → 정리(summary) → 예제 따라 풀기(example) → 개념 확인(check 3문제).
// explore 항목은 course2-deck.js의 차시 항목과 같은 꼴: ["board", 1과정 판서] · ["drill", 열쇠, 이름] · ["lab", 도구, 이름] · ["geo", 주소, 이름]
// proofs는 [course2-proofs/g1.js의 논증 id, 제목]. check는 [유형 id, 단계(concept 쉬움 · type 교재와 같게 · advanced 흔한 실수)].
// 예제는 창작 문제다(교재 문항을 옮기지 않는다). 단계 답은 그림을 만든 수에서 직접 계산해 적었다.
import { svg, text, line, poly, dot, at, P, sector, angleMark, dirOf, tick, regular, clock, GREEN, SOFT, YELLOW } from "./pack-kit.js?v=20261121f";

// ── 3단원 360도와 정다각형 · 1차시 그림 ──
const C = P(150, 140);
const circleParts = (n, shade = [], r = 105) => {
  let body = "";
  for (let k = 0; k < n; k += 1) body += sector(C, r, 90 - (360 / n) * (k + 1), 90 - (360 / n) * k, { fill: shade.includes(k) ? YELLOW : "#fff" });
  return body + dot(C, 4);
};
const figFourRight = () => svg(300, 280, circleParts(4, [0, 1, 2, 3]) + [0, 90, 180, 270].map((a) => angleMark(C, a, a + 90, 22, "")).join("") + text(150, 266, "직각 4개 = 한 바퀴", { size: 15, color: GREEN }), "직각 네 개가 한 점에 모인 그림");
const figSectorRule = () => svg(300, 290, circleParts(5, [0]) + angleMark(C, 18, 90, 30, "72°") + text(150, 276, "360° ÷ 5 = 72°", { size: 16, color: GREEN }), "원을 똑같이 다섯 조각으로 나눈 그림");
const figSectorExample = () => svg(300, 270, circleParts(8, [0, 1, 2]) + angleMark(C, -45, 90, 26, "?"), "원을 똑같이 여덟 조각으로 나누고 세 조각을 칠한 그림");

const T = [P(60, 210), P(250, 210), P(150, 50)];
const figStraight = () => svg(300, 200, line(P(30, 140), P(270, 140), { width: 3 }) + dot(P(150, 140), 4.5) + angleMark(P(150, 140), 0, 180, 34, "반 바퀴") + text(150, 180, "곧은 선 = 180°", { size: 16, color: GREEN }), "곧은 선 위의 반 바퀴 각");
const figTriangleSum = () => svg(300, 250,
  poly(T, { fill: SOFT })
  + angleMark(T[0], 0, dirOf(T[0], T[2]), 30, "㉠") + angleMark(T[1], dirOf(T[1], T[2]), 180, 30, "㉡") + angleMark(T[2], dirOf(T[2], T[0]), dirOf(T[2], T[1]), 26, "㉢")
  + text(150, 238, "㉠ + ㉡ + ㉢ = 180°", { size: 16, color: GREEN }), "삼각형의 세 각");
const I = [P(70, 210), P(230, 210), P(150, 50)];
const figIsoExample = () => svg(300, 240,
  poly(I, { fill: SOFT }) + tick(I[0], I[2]) + tick(I[1], I[2])
  + angleMark(I[2], dirOf(I[2], I[0]), dirOf(I[2], I[1]), 26, "40°") + angleMark(I[0], 0, dirOf(I[0], I[2]), 30, "?") + angleMark(I[1], dirOf(I[1], I[2]), 180, 30, ""), "꼭지각이 40도인 이등변삼각형");

const pentagon = regular(P(150, 135), 100, 5);
const figPentagonSplit = () => svg(300, 265,
  poly(pentagon, { fill: SOFT }) + line(pentagon[0], pentagon[2], { color: GREEN, dash: "6 5" }) + line(pentagon[0], pentagon[3], { color: GREEN, dash: "6 5" })
  + text(112, 150, "1", { color: GREEN, size: 18 }) + text(150, 185, "2", { color: GREEN, size: 18 }) + text(188, 150, "3", { color: GREEN, size: 18 })
  + text(150, 252, "삼각형 3개 → 180° × 3", { size: 15, color: GREEN }), "정오각형을 한 꼭짓점에서 대각선으로 나눈 그림");
const hexagon = regular(P(150, 130), 98, 6, 90);
const figHexagon = () => svg(300, 250,
  poly(hexagon, { fill: SOFT }) + angleMark(hexagon[0], dirOf(hexagon[0], hexagon[1]), dirOf(hexagon[0], hexagon[5]), 24, "?") + text(150, 242, "정육각형", { size: 15 }), "정육각형의 한 내각");
const figHexSplit = () => svg(300, 255,
  poly(hexagon, { fill: SOFT }) + [2, 3, 4].map((k) => line(hexagon[0], hexagon[k], { color: GREEN, dash: "6 5" })).join("")
  + text(150, 245, "정육각형 · 삼각형 몇 개?", { size: 15, color: GREEN }), "정육각형을 한 꼭짓점에서 대각선으로 나눈 그림");

// 정사각형과 정육각형이 공통 변 AB를 맞붙인 그림 — 꼭짓점 A에서 남는 각
const A = P(150, 160), B = P(150, 70);
const sq = [A, B, P(60, 70), P(60, 160)];
const hexPts = (() => {
  const pts = [A, B];
  let dir = 90, cur = B;   // A → B는 위쪽, 정육각형은 공통 변의 오른쪽
  for (let k = 0; k < 4; k += 1) { dir -= 60; cur = at(cur, 90, dir); pts.push(cur); }
  return pts;
})();
const figJoined = () => svg(330, 290,
  poly(sq, { fill: YELLOW }) + poly(hexPts, { fill: SOFT }) + dot(A, 4.5)
  + angleMark(A, dirOf(A, hexPts[5]), dirOf(A, sq[3]), 26, "?")
  + text(105, 118, "정사각형", { size: 14 }) + text(228, 120, "정육각형", { size: 14 }), "정사각형과 정육각형을 한 변으로 맞붙인 그림");

const CK = P(150, 140);
const figClockRule = () => svg(300, 290, clock(CK, 110, 3, 0) + angleMark(CK, 0, 90, 30, "90°") + text(150, 278, "숫자 한 칸 = 30°", { size: 15, color: GREEN }), "3시를 가리키는 시계");
const figClockExample = () => svg(300, 280, clock(CK, 110, 2, 30) + angleMark(CK, -90, 15, 28, "?"), "2시 30분을 가리키는 시계");

// ── 꾸러미 ──
export const PACKS = {
  // 3단원 360도와 정다각형 · 1차시(활동 1 · 확인 1)
  "2/1": [
    {
      id: "circle-360", title: "원을 나눈 조각의 각",
      recall: { figure: figFourRight, text: "직각 네 개를 한 점에 빈틈없이 모으면 한 바퀴를 돕니다.", ask: "직각 하나는 몇 도인가요?", options: ["45°", "90°", "180°"], answer: 1, why: "직각은 90°이고, 직각 4개가 모이면 90° × 4 = 360° — 한 바퀴예요.", hint: "종이 모서리처럼 반듯한 각이에요." },
      explore: [],
      proofs: [],
      summary: {
        figure: figSectorRule,
        terms: [["한 바퀴", "원의 가운데를 한 바퀴 도는 각 · <b>360°</b>"], ["가운데 각", "원의 가운데 점에서 두 반지름이 이루는 각"]],
        facts: ["원의 가운데를 도는 각을 모두 더하면 <b>360°</b>", "똑같이 <b>n조각</b>으로 나누면 한 조각의 가운데 각 = <b>360° ÷ n</b>", "모르는 조각 하나 = 360° − (아는 조각들의 합)"]
      },
      pitfall: "조각의 크기가 서로 다를 때는 나누지 않고 360에서 아는 각을 뺍니다.",
      example: {
        prompt: "원을 크기가 같은 8조각으로 나누고 3조각을 칠했습니다. 칠한 부분의 가운데 각을 모두 더하면 몇 도인가요?",
        figure: figSectorExample,
        steps: [
          { ask: "한 조각의 가운데 각은? 360 ÷ 8 =", answer: "45", unit: "°", why: "한 바퀴 360°를 똑같이 8개로 나눕니다.", hint: "360을 8로 나눠 봐요." },
          { ask: "칠한 3조각의 각은? 45 × 3 =", answer: "135", unit: "°", why: "같은 크기 조각 3개이니 한 조각의 각을 3번 더합니다.", hint: "45를 세 번 더해 봐요." }
        ]
      },
      check: [["c2-circle-sector-angle", "concept"], ["c2-circle-sector-angle", "type"], ["c2-circle-sector-angle", "advanced"]]
    },
    {
      id: "triangle-angles", title: "삼각형의 세 각과 이등변삼각형",
      recall: { figure: figStraight, text: "곧은 선 위의 한 점에서 한쪽을 도는 각은 반 바퀴입니다.", ask: "반 바퀴(곧은 선)는 몇 도인가요?", options: ["90°", "180°", "360°"], answer: 1, why: "한 바퀴 360°의 반이라 180°예요.", hint: "한 바퀴의 절반이에요." },
      explore: [["lab", "angles", "각 떼어 모으기"]],
      proofs: [["triangle-sum", "삼각형의 세 각을 모으면 왜 180°일까"], ["isosceles-base", "이등변삼각형의 두 밑각은 왜 같을까"]],
      summary: {
        figure: figTriangleSum,
        terms: [["이등변삼각형", "두 변의 길이가 같은 삼각형"], ["밑각", "같은 두 변이 아닌 나머지 변(밑변) 양 끝의 두 각"]],
        facts: ["삼각형의 세 각을 모으면 <b>180°</b>", "모르는 한 각 = 180° − (아는 두 각)", "이등변삼각형의 <b>두 밑각은 같다</b> → 밑각 = (180° − 꼭지각) ÷ 2"]
      },
      pitfall: "같은 두 변 사이의 각(꼭지각)은 밑각과 다릅니다. 표시된 각이 꼭지각인지 밑각인지부터 봅니다.",
      example: {
        prompt: "두 변의 길이가 같은 이등변삼각형에서 꼭지각이 40°입니다. ?의 각(밑각)은 몇 도인가요?",
        figure: figIsoExample,
        steps: [
          { ask: "두 밑각을 더하면? 180 − 40 =", answer: "140", unit: "°", why: "세 각의 합 180°에서 꼭지각을 뺀 나머지를 두 밑각이 나눠 가집니다.", hint: "180에서 40을 빼 봐요." },
          { ask: "밑각 하나는? 140 ÷ 2 =", answer: "70", unit: "°", why: "이등변삼각형의 두 밑각은 크기가 같으니 반으로 나눕니다.", hint: "두 밑각은 같아요 — 반으로 나눠요." }
        ]
      },
      check: [["c2-triangle-angle", "concept"], ["c2-triangle-angle", "type"], ["c2-triangle-angle", "advanced"]]
    },
    {
      id: "regular-polygon", title: "정다각형의 한 내각",
      recall: { figure: figTriangleSum, text: "삼각형은 모양이 달라도 세 각을 모으면 늘 같은 크기가 됩니다.", ask: "삼각형의 세 각을 모두 더하면?", options: ["90°", "180°", "360°"], answer: 1, why: "세 각을 접어 모으면 곧은 선이 되니 180°예요.", hint: "곧은 선과 같은 크기예요." },
      explore: [],
      proofs: [["regular-interior", "정다각형의 한 내각은 어떻게 구할까"], ["exterior-sum", "다각형의 외각을 모두 더하면 왜 360°일까"]],
      summary: {
        figure: figPentagonSplit,
        terms: [["정다각형", "변의 길이가 모두 같고 각의 크기도 모두 같은 다각형"], ["내각", "다각형 안쪽의 각"]],
        facts: ["한 꼭짓점에서 대각선을 그으면 삼각형이 <b>(변의 수 − 2)개</b>", "내각의 합 = <b>180° × (변의 수 − 2)</b>", "정다각형의 한 내각 = 내각의 합 ÷ 변의 수 — 정삼각형 60° · 정사각형 90° · 정오각형 108° · 정육각형 120°"]
      },
      pitfall: "삼각형의 개수는 변의 수가 아니라 (변의 수 − 2)개입니다. 대각선을 그어 직접 세어 봅니다.",
      example: {
        prompt: "정육각형의 한 내각은 몇 도인가요?",
        figure: figHexSplit,
        steps: [
          { ask: "한 꼭짓점에서 대각선을 그으면 삼각형은 6 − 2 =", answer: "4", unit: "개", why: "그림처럼 대각선 3개가 정육각형을 삼각형 4개로 나눕니다.", hint: "변의 수에서 2를 빼요." },
          { ask: "내각의 합은? 180 × 4 =", answer: "720", unit: "°", why: "삼각형 하나의 세 각이 180°이고, 삼각형 4개의 각이 모여 내각이 됩니다.", hint: "180을 4번 더해요." },
          { ask: "한 내각은? 720 ÷ 6 =", answer: "120", unit: "°", why: "정육각형은 여섯 각이 모두 같으니 똑같이 6으로 나눕니다.", hint: "각이 6개 모두 같아요." }
        ]
      },
      check: [["c2-regular-polygon-angle", "concept"], ["c2-regular-polygon-angle", "type"], ["c2-regular-polygon-angle", "advanced"]]
    },
    {
      id: "joined-polygons", title: "맞붙인 두 정다각형 사이의 각",
      recall: { figure: figHexagon, text: "정육각형은 삼각형 4개로 나뉘어 내각의 합이 720°입니다.", ask: "정육각형의 한 내각은 몇 도인가요?", options: ["108°", "120°", "135°"], answer: 1, why: "720 ÷ 6 = 120이에요.", hint: "720을 6으로 나눠요." },
      explore: [],
      proofs: [],
      summary: {
        figure: figJoined,
        terms: [["한 점을 도는 각", "한 점을 빙 둘러싼 각을 모두 더하면 360°"]],
        facts: ["두 정다각형을 한 변으로 맞붙이면 맞붙은 꼭짓점에 각이 세 개 모인다", "남는 각 = <b>360° − (한 정다각형의 한 내각) − (다른 정다각형의 한 내각)</b>"]
      },
      pitfall: "남는 각은 180°가 아니라 360°에서 뺍니다 — 꼭짓점을 빙 둘러싼 각이기 때문입니다.",
      example: {
        prompt: "정사각형과 정육각형의 한 변을 맞붙였습니다. 맞붙은 꼭짓점에서 ?의 각은 몇 도인가요?",
        figure: figJoined,
        steps: [
          { ask: "정사각형의 한 내각은?", answer: "90", unit: "°", why: "정사각형의 네 각은 모두 직각이에요.", hint: "정사각형의 각은 직각이에요." },
          { ask: "정육각형의 한 내각은?", answer: "120", unit: "°", why: "180 × 4 ÷ 6 = 120입니다.", hint: "앞에서 구한 정육각형의 한 내각이에요." },
          { ask: "?의 각은? 360 − 90 − 120 =", answer: "150", unit: "°", why: "꼭짓점을 빙 둘러싼 세 각의 합이 360°이므로 두 내각을 뺍니다.", hint: "360에서 두 각을 빼요." }
        ]
      },
      check: [["c2-joined-polygon-angle", "concept"], ["c2-joined-polygon-angle", "type"], ["c2-joined-polygon-angle", "advanced"]]
    },
    {
      id: "clock-hands", title: "시계 두 바늘이 이루는 각",
      recall: { figure: figClockRule, text: "시계판의 숫자 12개가 한 바퀴 360°를 똑같이 나눕니다.", ask: "숫자 한 칸(예: 12에서 1까지)은 몇 도인가요?", options: ["6°", "30°", "60°"], answer: 1, why: "360 ÷ 12 = 30이에요.", hint: "360을 12로 나눠요." },
      explore: [["lab", "clock", "시계 바늘 각"]],
      proofs: [["clock-angle", "시계 두 바늘 사이의 각 따지기"]],
      summary: {
        figure: figClockRule,
        terms: [["긴바늘", "60분에 한 바퀴 → <b>1분에 6°</b>"], ["짧은바늘", "12시간에 한 바퀴 → 1시간에 30°, <b>1분에 0.5°</b>"]],
        facts: ["12를 기준으로 두 바늘이 각각 몇 도 돌았는지 구한다", "두 바늘 사이의 각 = 큰 값 − 작은 값", "180°보다 크면 작은 쪽은 360°에서 뺀다"]
      },
      pitfall: "분이 지나면 짧은바늘도 움직입니다. 2시 30분의 짧은바늘은 2가 아니라 2와 3 사이 한가운데에 있습니다.",
      example: {
        prompt: "시계가 2시 30분을 가리킵니다. 짧은바늘과 긴바늘이 이루는 작은 쪽의 각은 몇 도인가요?",
        figure: figClockExample,
        steps: [
          { ask: "12에서 긴바늘이 돈 각은? 6 × 30 =", answer: "180", unit: "°", why: "긴바늘은 1분에 6°씩 30분 동안 돕니다.", hint: "1분에 6°예요." },
          { ask: "12에서 짧은바늘이 돈 각은? 30 × 2 + 0.5 × 30 =", answer: "75", unit: "°", why: "2시까지 30° × 2, 그 뒤 30분 동안 0.5° × 30을 더 갑니다.", hint: "60에 15를 더해요." },
          { ask: "두 바늘 사이의 각은? 180 − 75 =", answer: "105", unit: "°", why: "두 바늘이 돈 각의 차가 사이의 각이고, 180°보다 작으니 그대로 작은 쪽입니다.", hint: "큰 각에서 작은 각을 빼요." }
        ]
      },
      check: [["c2-clock-hand-angle", "concept"], ["c2-clock-hand-angle", "type"], ["c2-clock-hand-angle", "advanced"]]
    }
  ]
};
