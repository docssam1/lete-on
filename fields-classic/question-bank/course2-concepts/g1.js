// 2과정 G1 「돌리기와 뒤집기」 개념 꾸러미(DESIGN-COURSE2.md 4절) — 차시(단원 번호 / 차시)마다 개념 꾸러미 목록.
// 꾸러미 한 개 = 되짚기(recall) → 해 보기(explore) → 따져 보기(proofs) → 정리(summary) → 예제 따라 풀기(example) → 개념 확인(check 3문제).
// explore 항목은 course2-deck.js의 차시 항목과 같은 꼴: ["board", 1과정 판서] · ["drill", 열쇠, 이름] · ["lab", 도구, 이름] · ["geo", 주소, 이름]
// proofs는 [course2-proofs/g1.js의 논증 id, 제목]. check는 [유형 id, 단계(concept 쉬움 · type 교재와 같게 · advanced 흔한 실수)].
// 예제는 창작 문제다(교재 문항을 옮기지 않는다). 단계 답은 그림을 만든 수에서 직접 계산해 적었다.
import { foldWordStrip, foldStageSvg, foldCreaseSvg } from "../fold-visuals.js?v=20261123a";
import { svg, text, line, poly, rect, circle, dot, at, P, arrow, sector, angleMark, dirOf, tick, regular, grid, clock, digital, INK, GREEN, SOFT, MARK, BLUE, YELLOW, PINK } from "./pack-kit.js?v=20261123b";

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
        facts: ["원의 가운데를 도는 각을 모두 더하면 <b>360°</b>", "똑같이 나누면 한 조각의 가운데 각 = <b>360° ÷ 조각 수</b>", "모르는 조각 하나 = 360° − (아는 조각들의 합)"]
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

// ════ 나머지 차시 그림 ════
const psq = (x, y, s, fill = PINK) => rect(x, y, s, s, { fill, width: 2 });
const label = (x, y, t, o = {}) => text(x, y, t, { size: 13, color: "#56627f", ...o });
// ── 색종이 접기 그림(원장 2026-11-23 「색종이는 접는 과정을 보여 주던지 화살표로 과정을 표시 해야」) ──
// 문제은행 색종이 그림과 같은 한 줄 흐름(fold-visuals.js foldWordStrip): 처음 → 1번 접음 → … → 펼친 모양, 장면 사이 회색 화살표, 접는 장면에 점선과 빨간 굽은 화살표.
// 좌표는 펼친 종이 한 장 = 0~1. 펼치기 = 마지막 접은 선부터 거울에 비춰 붙이기(unfold).
const CUT = "#b03a5b";
const ptsAt = (shape, x, y, size) => shape.map((p) => `${(x + p.x * size).toFixed(1)},${(y + p.y * size).toFixed(1)}`).join(" ");
const holeSvg = (shape, x, y, size, cut = false) => `<polygon points="${ptsAt(shape, x, y, size)}" fill="${cut ? CUT : "#fff"}" stroke="${CUT}" stroke-width="1.8" stroke-linejoin="round"/>`;
// lines: 접은 차례 그대로 [{ x: 0.5 } | { y: 0.5 }] — 펼칠 때는 거꾸로 비춘다
const unfold = (shapes, lines) => [...lines].reverse().reduce((all, l) => all.concat(all.map((sh) => sh.map((p) => ("x" in l ? { x: 2 * l.x - p.x, y: p.y } : { x: p.x, y: 2 * l.y - p.y })))), shapes);
const SQUARE = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }];
const unfolded = (lines, holes, { gather = null } = {}) => (x, y, size) => {
  let out = foldStageSvg(SQUARE, { shift: x, top: y, size });
  if (gather) out += `<rect x="${(x + gather.x0 * size).toFixed(1)}" y="${(y + gather.y0 * size).toFixed(1)}" width="${((gather.x1 - gather.x0) * size).toFixed(1)}" height="${((gather.y1 - gather.y0) * size).toFixed(1)}" fill="#ffe39a"/>`;
  for (const l of lines) out += "x" in l ? foldCreaseSvg(x + l.x * size, y, x + l.x * size, y + size) : foldCreaseSvg(x, y + l.y * size, x + size, y + l.y * size);
  if (gather) out += foldStageSvg(SQUARE, { shift: x, top: y, size }).replace('fill="#f9c8c4"', 'fill="none"');
  return out + unfold(holes, lines).map((h) => holeSvg(h, x, y, size)).join("");
};
const LINES2 = [{ y: 0.5 }, { x: 0.5 }];               // 아래로 → 왼쪽으로: 왼쪽 아래 칸에 4겹
const LINES3 = [{ y: 0.5 }, { x: 0.5 }, { y: 0.75 }];  // 한 번 더 아래로: 왼쪽 아래 칸의 아래 반에 8겹
const TRI = [[{ x: 0.2, y: 0.66 }, { x: 0.36, y: 0.66 }, { x: 0.2, y: 0.84 }]];               // 왼쪽 아래 칸 안쪽 삼각형 구멍
const ring = (cx, cy, r = 0.038, n = 10) => Array.from({ length: n }, (_, k) => ({ x: cx + r * Math.cos((2 * Math.PI * k) / n), y: cy + r * Math.sin((2 * Math.PI * k) / n) }));
const TWO_HOLES = [ring(0.14, 0.875), ring(0.33, 0.875)];   // 8겹 칸(x 0~0.5, y 0.75~1) 안의 동그라미 구멍 두 개
const cutFinal = (holes) => (x, y, size) => holes.map((h) => holeSvg(h, x, y, size, true)).join("");
// 접기만(겹 세기): 처음 → 1번 접음 → 2번 접음
const figFoldOnce = () => foldWordStrip(["아래로"], { label: "색종이를 반으로 한 번 접는 과정" });
const figFoldTwice = () => foldWordStrip(["아래로", "왼쪽으로"], { label: "색종이를 반으로 두 번 접는 과정" });
// 거꾸로: 두 번 접어 삼각형을 오려 내고 → 펼친 모양(종이가 모인 칸은 노랑)
const figFoldRegions = () => foldWordStrip(["아래로", "왼쪽으로"], { final: cutFinal(TRI), finalExtra: "오리기", after: unfolded(LINES2, TRI, { gather: { x0: 0, y0: 0.5, x1: 0.5, y1: 1 } }), afterCaption: "펼친 모양", label: "색종이를 두 번 접어 삼각형을 오려 내고 펼친 과정 — 다 접은 종이는 펼친 종이의 왼쪽 아래 칸(노랑)에 모인다" });
// 세 번 접어(8겹) 구멍 두 개를 뚫고 → 펼치면 칸마다 두 개
const figHoles = () => foldWordStrip(["아래로", "왼쪽으로", "아래로"], { final: cutFinal(TWO_HOLES), finalExtra: "구멍 2개", after: unfolded(LINES3, TWO_HOLES), afterCaption: "펼친 모양", label: "색종이를 세 번 접어 구멍 두 개를 뚫고 펼친 과정" });
// 거울: 좌우가 바뀐다
const flag = (x, y, m = 1) => poly([P(x, y), P(x, y + 90), P(x + 8 * m, y + 90), P(x + 8 * m, y + 45), P(x + 48 * m, y + 45), P(x + 48 * m, y + 32), P(x + 8 * m, y + 32), P(x + 8 * m, y + 14), P(x + 58 * m, y + 14), P(x + 58 * m, y)], { fill: SOFT });
const figMirror = () => svg(300, 170, flag(60, 30) + line(P(150, 15), P(150, 150), { dash: "7 6", color: BLUE, width: 2.6 }) + flag(240, 30, -1) + label(150, 162, "거울(대칭축)") + label(90, 8, "실제") + label(210, 8, "거울 속"), "거울에 비친 모양");
const figSymShapes = () => {
  const s1 = [P(30, 40), P(120, 40), P(120, 130), P(30, 130)];
  const t = regular(P(195, 95), 52, 3);
  const r1 = [P(255, 55), P(375, 55), P(375, 125), P(255, 125)];
  const ax = (a, b) => line(a, b, { dash: "5 5", color: MARK, width: 1.8 });
  return svg(400, 175, poly(s1, { fill: SOFT }) + ax(P(75, 30), P(75, 140)) + ax(P(20, 85), P(130, 85)) + ax(P(25, 35), P(125, 135)) + ax(P(125, 35), P(25, 135))
    + poly(t, { fill: SOFT }) + t.map((v, k) => { const m = P((t[(k + 1) % 3].x + t[(k + 2) % 3].x) / 2, (t[(k + 1) % 3].y + t[(k + 2) % 3].y) / 2); return ax(at(v, 10, dirOf(m, v)), m); }).join("")
    + poly(r1, { fill: SOFT }) + ax(P(315, 45), P(315, 135)) + ax(P(245, 90), P(385, 90))
    + label(75, 160, "정사각형 4개") + label(195, 160, "정삼각형 3개") + label(315, 160, "직사각형 2개"), "도형마다 대칭축");
};
const digitRow = (str, x, y, { mirror = false, w = 26, h = 46, gap = 10 } = {}) => {
  const chars = mirror ? [...str].reverse() : [...str];
  let cx = x, body = "";
  for (const c of chars) {
    if (c === ":") { body += dot(P(cx + 5, y + h * 0.32), 3.4) + dot(P(cx + 5, y + h * 0.68), 3.4); cx += 14; continue; }
    body += digital(c, cx, y, { w, h, width: 4.5, mirror }); cx += w + gap;
  }
  return body;
};
const figDigitMirror = () => svg(320, 150, digitRow("2", 50, 40) + line(P(160, 20), P(160, 120), { dash: "7 6", color: BLUE, width: 2.6 }) + digitRow("2", 240, 40, { mirror: true }) + label(66, 135, "실제") + label(256, 135, "거울 속") + label(160, 12, "거울"), "디지털 숫자 2를 거울에 비추면 5");
// 되짚기용: 답을 그림에 보이지 않는다 — 모르는 쪽은 「?」 칸
const askBox = (x, y) => rect(x, y, 30, 50, { fill: "#fff", color: "#9aa8c4", width: 1.6, rx: 6 }) + text(x + 15, y + 27, "?", { size: 24, color: "#56627f" });
const figDigitMirrorAsk = (real, seen) => () => svg(320, 150, (real ? digitRow(real, 50, 40) : askBox(48, 38)) + line(P(160, 20), P(160, 120), { dash: "7 6", color: BLUE, width: 2.6 })
  + (seen ? digitRow(seen, 240, 40) : askBox(240, 38)) + label(66, 135, "실제") + label(256, 135, "거울 속") + label(160, 12, "거울"), real ? `디지털 숫자 ${real}를 거울에 비추면?` : `거울 속 ${seen}는 실제로?`);
const figHalfTurnAsk = () => svg(320, 150, digitRow("6", 60, 40) + text(160, 62, "반 바퀴", { size: 15, color: GREEN }) + arrow(P(120, 80), P(200, 80), { color: GREEN }) + askBox(238, 38) + label(73, 130, "처음") + label(253, 130, "돌린 모양"), "디지털 6을 반 바퀴 돌리면?");
const figMirrorClockDigital = () => svg(300, 130, rect(30, 22, 240, 82, { fill: "#fff", width: 2.4 }) + digitRow("10:25", 52, 40, { mirror: true }) + label(150, 120, "거울에 비친 디지털 시계"), "거울에 비친 디지털 시계");
// 시간 계산
const figTimeAdd = () => svg(380, 200, clock(P(80, 90), 62, 2, 45, { labels: false }) + arrow(P(158, 90), P(222, 90)) + text(190, 70, "1시간 35분", { size: 14, color: GREEN }) + clock(P(300, 90), 62, 4, 20, { labels: false }) + label(80, 175, "2시 45분 시작") + label(300, 175, "끝나는 시각 ?"), "2시 45분에서 1시간 35분 뒤");
const figMirrorClock = () => svg(380, 200, clock(P(90, 90), 66, 3, 20) + line(P(190, 20), P(190, 165), { dash: "7 6", color: BLUE, width: 2.4 }) + clock(P(290, 90), 66, 8, 40) + label(90, 180, "거울 속 3시 20분") + label(290, 180, "실제 8시 40분"), "거울 속 시계와 실제 시계");
// 돌리기
const lshape = (o, k) => {   // 모눈 칸 크기 k, L 모양 세 칸
  return poly([P(o.x, o.y), P(o.x + k, o.y), P(o.x + k, o.y + k), P(o.x + 2 * k, o.y + k), P(o.x + 2 * k, o.y + 2 * k), P(o.x, o.y + 2 * k)], { fill: YELLOW });
};
const figTurns = () => {
  const k = 28;
  const turned = (cx, cy, deg) => `<g transform="rotate(${deg} ${cx} ${cy})">${lshape(P(cx - k, cy - k), k)}</g>`;
  return svg(430, 160, turned(55, 70, 0) + label(55, 140, "처음") + arrow(P(95, 70), P(125, 70)) + turned(165, 70, 90) + label(165, 140, "반의 반 바퀴")
    + arrow(P(205, 70), P(235, 70)) + turned(275, 70, 180) + label(275, 140, "반 바퀴") + arrow(P(315, 70), P(345, 70)) + turned(385, 70, 360) + label(385, 140, "한 바퀴 = 처음"), "시계 방향으로 반의 반 바퀴씩 돌린 모양");
};
const figPartition = () => {
  const o = P(60, 20), k = 30;
  const colors = [YELLOW, SOFT, PINK, "#dde9ff"];
  let body = grid(o, 6, 6, k);
  [[0, 0], [3, 0], [3, 3], [0, 3]].forEach(([c, r], i) => { body += rect(o.x + c * k, o.y + r * k, 3 * k, 3 * k, { fill: colors[i], width: 2.2 }); });
  return svg(300, 230, body + grid(o, 6, 6, k, { color: "#9aa39e", width: 0.8 }) + dot(P(o.x + 3 * k, o.y + 3 * k), 5, MARK) + label(150, 214, "가운데 점을 반의 반 바퀴씩 돌리면 겹친다"), "6×6 모눈을 같은 모양 넷으로 나눈 그림");
};
const figHalfTurnDigits = () => svg(320, 150, digitRow("6", 60, 40) + text(160, 62, "반 바퀴", { size: 15, color: GREEN }) + arrow(P(120, 80), P(200, 80), { color: GREEN }) + `<g transform="rotate(180 253 63)">${digitRow("6", 240, 40)}</g>` + label(73, 130, "처음") + label(253, 130, "돌린 모양"), "디지털 6을 반 바퀴 돌리면 9");
// 원과 반지름
const figCircleRadius = () => {
  const r = 46, c = [P(80, 70), P(172, 70), P(172, 162), P(80, 162)];
  return svg(260, 230, c.map((p) => circle(p, r, { fill: "#fff" })).join("") + poly(c, { color: MARK, width: 2.6 }) + c.map((p) => dot(p, 4)).join("")
    + label(126, 58, "3 + 3", { color: MARK }), "반지름 3cm 원 네 개를 맞닿게 놓은 그림");
};
const figMidpoint = () => {
  const c = P(150, 125), R = 100;
  const v = [at(c, R, 145), at(c, R, 35), at(c, R, -35), at(c, R, -145)];
  const m = v.map((p, k) => P((p.x + v[(k + 1) % 4].x) / 2, (p.y + v[(k + 1) % 4].y) / 2));
  return svg(300, 250, circle(c, R) + poly(v, { fill: SOFT }) + line(v[0], v[2], { dash: "6 5", color: BLUE }) + poly(m, { color: MARK, width: 2.6 }) + dot(c, 4) + label(150, 242, "대각선 = 지름 · 가운데 점을 이은 변 = 대각선의 반"), "원 안 직사각형과 가운데 점을 이은 사각형");
};
// 도형 세기
const figTriGrid = () => {
  const A = P(150, 20), B = P(40, 210), Cc = P(260, 210);
  const lerp = (p, q, t) => P(p.x + (q.x - p.x) * t, p.y + (q.y - p.y) * t);
  let body = poly([A, B, Cc], { fill: SOFT });
  for (let k = 1; k < 3; k += 1) {
    body += line(lerp(A, B, k / 3), lerp(A, Cc, k / 3), { width: 1.6 }) + line(lerp(B, A, k / 3), lerp(B, Cc, k / 3), { width: 1.6 }) + line(lerp(Cc, A, k / 3), lerp(Cc, B, k / 3), { width: 1.6 });
  }
  return svg(300, 240, body + label(150, 230, "한 변이 3칸인 정삼각형"), "작은 정삼각형으로 나뉜 큰 정삼각형");
};
const figCirclePoints = () => {
  const c = P(130, 120), r = 92, pts = regular(c, r, 8);
  return svg(260, 240, circle(c, r) + poly([pts[0], pts[2], pts[6]], { fill: YELLOW, color: MARK }) + pts.map((p) => dot(p, 4.4)).join("") + label(130, 232, "꼭대기에서 양쪽으로 같은 칸"), "원 위의 점 8개와 이등변삼각형");
};
const figQuadChain = () => svg(400, 230,
  rect(10, 10, 380, 210, { fill: "#fff" }) + label(70, 28, "사다리꼴", { color: INK })
  + rect(30, 42, 340, 168, { fill: SOFT }) + label(90, 60, "평행사변형", { color: INK })
  + rect(50, 76, 190, 124, { fill: YELLOW, dash: "" }) + label(95, 92, "직사각형", { color: INK })
  + rect(160, 76, 190, 124, { fill: "rgba(249,200,196,.65)" }) + label(305, 92, "마름모", { color: INK })
  + rect(160, 112, 80, 70, { fill: "#fff", color: MARK, width: 2.6 }) + text(200, 147, "정사각형", { size: 13, color: MARK }), "사각형 사이의 관계");
const figRectGrid = () => {
  const o = P(50, 30), k = 60;
  return svg(300, 200, grid(o, 3, 2, k, { color: INK, width: 1.6 }) + rect(o.x + k, o.y, 2 * k, k, { fill: "rgba(255,225,150,.7)", color: MARK, width: 3 })
    + label(150, 180, "가로선 2개 + 세로선 2개 → 사각형 1개"), "3×2 모눈에서 사각형 하나 고르기");
};

// ════ 나머지 차시 꾸러미 ════
const C3 = (type) => [[type, "concept"], [type, "type"], [type, "advanced"]];
Object.assign(PACKS, {
  // 1단원 색종이 접기와 뒤집기 · 1차시 — 거꾸로 해결하기
  "0/1": [
    {
      id: "fold-reverse", title: "접은 종이가 놓인 칸 찾기(거꾸로)",
      recall: { figure: figFoldOnce, text: "정사각형 색종이를 반으로 접으면 종이가 겹칩니다.", ask: "반으로 한 번 접으면 종이는 몇 겹인가요?", options: ["1겹", "2겹", "4겹"], answer: 1, why: "반으로 접으면 두 장이 겹쳐요. 한 번 더 접으면 4겹이에요.", hint: "접은 종이를 옆에서 보면 몇 장인지 세어 봐요." },
      explore: [["board", "book-04/fold-cut-source"], ["board", "book-04/fold-position-source"], ["drill", "fold-region", "접힌 부분 위치 찾기"], ["geo", "../../geometry/games/paper-fold/index.html?level=3", "접는 방법 거꾸로 찾기 게임"]],
      proofs: [["fold-cut-symmetry", "접어서 자르면 펼친 모양이 왜 대칭일까"]],
      summary: {
        figure: figFoldRegions,
        terms: [["접는 선", "종이를 접은 자리 — 펼치면 그 선에 대해 양쪽이 거울 모양"], ["거꾸로 해결", "펼친 모양에서 시작해 마지막에 접은 선부터 되돌려 생각하기"]],
        facts: ["펼친 종이에 <b>접는 선을 차례대로</b> 그어 칸을 나눈다", "접을 때 <b>움직이지 않은 쪽</b>이 종이가 모인 칸이다", "종이가 모인 칸 안의 자른 선·모양만 접힌 종이에 옮긴다"]
      },
      pitfall: "펼친 그림의 자른 모양을 모두 옮기면 안 됩니다. 종이가 모인 한 칸 안의 것만 접힌 종이에 있습니다.",
      example: {
        prompt: "정사각형 색종이를 그림처럼 반으로 두 번 접어 삼각형을 오려 냈더니, 펼친 종이에 삼각형 구멍이 4개 생겼습니다. 접힌 종이에서 오려 낸 삼각형은 몇 개인가요?",
        figure: figFoldRegions,
        steps: [
          { ask: "접는 선 두 개로 펼친 종이는 몇 칸으로 나뉘나요?", answer: "4", unit: "칸", why: "가로 접는 선과 세로 접는 선이 종이를 네 칸으로 나눕니다.", hint: "점선 두 개가 만든 칸을 세어 봐요." },
          { ask: "종이가 모인 칸은 몇 칸인가요?", answer: "1", unit: "칸", why: "다 접은 종이는 네 칸 중 한 칸 자리에 4겹으로 모입니다.", hint: "다 접으면 종이가 한 칸 크기가 돼요." },
          { ask: "그 칸 안의 삼각형만 옮기면 접힌 종이에서 자른 것은?", answer: "1", unit: "개", why: "4겹을 한 번에 잘라 펼치면 네 칸에 하나씩, 4개가 됩니다. 거꾸로 보면 자른 것은 1개입니다.", hint: "구멍 4개 ÷ 4겹을 생각해요." }
        ]
      },
      check: [["c2-reverse-fold-line", "concept"], ["c2-reverse-fold-shape", "type"], ["c2-reverse-fold-line", "advanced"]]
    },
    {
      id: "fold-holes", title: "접어서 뚫은 구멍 세기",
      recall: { figure: figFoldTwice, text: "접을 때마다 겹이 두 배가 됩니다.", ask: "반으로 두 번 접으면 몇 겹인가요?", options: ["2겹", "3겹", "4겹"], answer: 2, why: "1겹 → 2겹 → 4겹, 접을 때마다 두 배예요.", hint: "한 번 접을 때마다 두 배가 돼요." },
      explore: [["board", "book-04/fold-hole-count"]],
      proofs: [],
      summary: {
        figure: figHoles,
        terms: [["겹 수", "한 번 접으면 2겹, 두 번 4겹, 세 번 8겹 — 접을 때마다 두 배"]],
        facts: ["구멍 하나를 뚫으면 <b>겹 수만큼</b> 구멍이 생긴다", "펼친 구멍 수 = (접힌 종이에 뚫은 구멍 수) × (겹 수)", "접는 선 위에 걸친 구멍은 펼치면 두 개가 이어져 <b>하나</b>가 된다"]
      },
      pitfall: "접는 선(접힌 가장자리)에 걸쳐 뚫은 구멍은 겹 수만큼 생기지 않습니다. 이어지는 짝을 하나로 셉니다.",
      example: {
        prompt: "색종이를 그림처럼 반으로 세 번 접고, 접는 선에 걸치지 않게 구멍 2개를 뚫었습니다. 펼치면 구멍은 몇 개인가요?",
        figure: figHoles,
        steps: [
          { ask: "세 번 접으면 몇 겹인가요? 2 × 2 × 2 =", answer: "8", unit: "겹", why: "접을 때마다 겹이 두 배가 됩니다.", hint: "1 → 2 → 4 → ?" },
          { ask: "펼친 구멍은? 2 × 8 =", answer: "16", unit: "개", why: "구멍 하나가 8겹을 모두 뚫으므로 구멍마다 8개씩 생깁니다.", hint: "구멍 2개가 각각 8개씩이에요." }
        ]
      },
      check: [["fold-hole-count", "concept"], ["fold-diagonal-hole-count", "type"], ["practice-three-fold-hole-count", "advanced"]]
    }
  ],
  // 1단원 · 2차시 — 대칭과 거울
  "0/2": [
    {
      id: "symmetry-axis", title: "대칭축과 뒤집기",
      recall: { figure: figMirror, text: "거울에 비친 모양은 거울 선을 사이에 두고 마주 봅니다.", ask: "거울에 비치면 무엇이 바뀌나요?", options: ["위와 아래", "왼쪽과 오른쪽", "아무것도 안 바뀐다"], answer: 1, why: "세로로 선 거울은 왼쪽과 오른쪽을 바꿔요.", hint: "거울 앞에서 오른손을 들어 보면 거울 속은 어느 손일까요?" },
      explore: [["board", "book-01/mirror-reflection"]],
      proofs: [],
      summary: {
        figure: figSymShapes,
        terms: [["대칭축", "접었을 때 양쪽이 완전히 겹치는 선"], ["뒤집기", "선을 기준으로 거울처럼 옮기기"]],
        facts: ["정다각형의 대칭축 수 = <b>변의 수</b>(정삼각형 3 · 정사각형 4)", "직사각형은 2개, 원은 셀 수 없이 많다", "같은 선으로 <b>두 번 뒤집으면 처음 모양</b>으로 돌아온다"]
      },
      pitfall: "직사각형의 대각선은 대칭축이 아닙니다 — 대각선으로 접으면 두 쪽이 겹치지 않습니다.",
      example: {
        prompt: "정사각형, 정삼각형, 직사각형 세 도형의 대칭축은 모두 몇 개인가요?",
        figure: figSymShapes,
        steps: [
          { ask: "정사각형의 대칭축은?", answer: "4", unit: "개", why: "가로·세로 한가운데 선 2개와 대각선 2개입니다.", hint: "대각선도 접으면 겹쳐요." },
          { ask: "정삼각형의 대칭축은?", answer: "3", unit: "개", why: "꼭짓점에서 마주 보는 변의 가운데로 그은 선 3개입니다.", hint: "꼭짓점마다 하나씩이에요." },
          { ask: "직사각형의 대칭축은?", answer: "2", unit: "개", why: "가로·세로 한가운데 선만 겹칩니다. 대각선은 겹치지 않습니다.", hint: "대각선으로 접으면 겹치나요?" },
          { ask: "모두 더하면? 4 + 3 + 2 =", answer: "9", unit: "개", why: "도형마다 센 대칭축을 더합니다.", hint: "세 수를 더해요." }
        ]
      },
      check: C3("c2-symmetry-axis-count")
    },
    {
      id: "digital-mirror", title: "거울에 비친 디지털 숫자",
      recall: { figure: figDigitMirrorAsk("2", null), text: "디지털 숫자는 막대 일곱 개로 그립니다.", ask: "디지털 숫자 [[d:2]]를 거울에 비추면 어떤 숫자로 보이나요?", options: ["[[d:2]]", "[[d:5]]", "[[d:7]]"], answer: 1, why: "막대가 좌우로 바뀌어 [[d:5]] 모양이 돼요.", hint: "위 오른쪽 막대가 왼쪽으로 가요." },
      explore: [["board", "book-04/digital-flip-source"]],
      proofs: [],
      summary: {
        figure: figDigitMirror,
        terms: [["거울에 비추기", "좌우 뒤집기 — 숫자 모양이 바뀌고 숫자의 차례도 거꾸로 된다"]],
        facts: ["거울에 비쳐도 숫자가 되는 것: <b>[[d:0]] [[d:1]] [[d:8]]</b>(그대로), <b>[[d:2]] ↔ [[d:5]]</b>(서로 바뀜)", "두 자리 이상이면 <b>차례가 거꾸로</b> — 앞자리가 맨 뒤로 간다", "거울에 비쳐도 같은 수 = 앞뒤 자리를 짝지어 서로 거울 짝인 수"]
      },
      pitfall: "숫자 모양만 바꾸고 자리의 차례를 거꾸로 하지 않는 실수가 많습니다.",
      example: {
        prompt: "두 자리 수(10~99) 중에서 디지털 숫자로 써서 거울에 비추어도 같은 수로 보이는 것은 몇 개인가요?",
        figure: figDigitMirror,
        steps: [
          { ask: "거울에 비쳐도 숫자가 되는 디지털 숫자 [[d:0]] [[d:1]] [[d:2]] [[d:5]] [[d:8]]은 몇 개인가요?", answer: "5", unit: "개", why: "[[d:0]] [[d:1]] [[d:8]]은 그대로, [[d:2]]와 [[d:5]]는 서로 바뀝니다.", hint: "막대 숫자를 하나씩 세어 봐요." },
          { ask: "앞자리에 올 수 있는 것은([[d:0]]은 빼고)?", answer: "4", unit: "가지", why: "두 자리 수의 앞자리는 [[d:0]]이 될 수 없습니다.", hint: "5개에서 [[d:0]]을 빼요." },
          { ask: "뒷자리는 앞자리의 거울 짝으로 정해지니 모두 몇 개인가요?", answer: "4", unit: "개", why: "[[d:11]] [[d:25]] [[d:52]] [[d:88]] — 앞자리마다 뒷자리가 하나씩 정해집니다.", hint: "앞자리 하나에 뒷자리 하나예요." }
        ]
      },
      check: [["c2-digital-mirror-count", "concept"], ["c2-digital-mirror-count", "type"], ["digital-flip-addition-horizontal", "advanced"]]
    },
    {
      id: "mirror-digital-clock", title: "거울에 비친 디지털 시계",
      recall: { figure: figDigitMirrorAsk(null, "5"), text: "거울은 숫자의 모양과 차례를 함께 바꿉니다.", ask: "거울 속 [[d:5]]는 실제로 어떤 숫자인가요?", options: ["[[d:2]]", "[[d:5]]", "[[d:8]]"], answer: 0, why: "[[d:2]]와 [[d:5]]는 거울에서 서로 바뀌니 거울 속 [[d:5]]는 실제 [[d:2]]예요.", hint: "[[d:2]] ↔ [[d:5]]를 떠올려요." },
      explore: [],
      proofs: [["mirror-clock", "거울에 비친 시계로 진짜 시각을 왜 알 수 있을까"]],
      summary: {
        figure: figMirrorClockDigital,
        terms: [["거꾸로 읽기", "거울 속 모습을 다시 좌우로 뒤집으면 실제 모습"]],
        facts: ["거울 속 글자를 <b>오른쪽부터</b> 읽는다", "숫자마다 거울 짝으로 바꾼다 — <b>[[d:2]] ↔ [[d:5]]</b>, [[d:0]] [[d:1]] [[d:8]]은 그대로", "실제 시각을 구한 뒤 몇 분 뒤·전을 계산한다"]
      },
      pitfall: "차례만 거꾸로 하고 [[d:2]]와 [[d:5]]를 바꾸지 않으면 틀린 시각이 나옵니다.",
      example: {
        prompt: "거울에 비친 디지털 시계가 그림처럼 보입니다. 실제 시각은 몇 시 몇 분인가요?",
        figure: figMirrorClockDigital,
        steps: [
          { ask: "거울 속 숫자를 오른쪽부터 읽으면?", answer: "10:52", accept: ["1052", "10시52분"], unit: "", text: true, why: "거울은 차례를 거꾸로 하므로 오른쪽 끝이 실제의 맨 앞입니다.", hint: "오른쪽 끝 숫자부터 차례로 써요." },
          { ask: "[[d:2]]와 [[d:5]]를 서로 바꾸면 실제 시각은?", answer: "10:25", accept: ["1025", "10시25분"], unit: "", text: true, why: "거울에서 2와 5는 서로 바뀌어 보이므로 되돌려 바꿉니다.", hint: "[[d:52]]의 [[d:5]]와 [[d:2]]를 바꿔요." }
        ]
      },
      check: C3("c2-mirror-digital-clock")
    }
  ],
  // 1단원 · 3차시 — 시간 계산과 거울 시계
  "0/3": [
    {
      id: "time-base60", title: "60분 = 1시간, 시간 더하고 빼기",
      recall: { figure: () => figTimeAdd(), text: "긴바늘이 한 바퀴 돌면 짧은바늘이 숫자 한 칸 갑니다.", ask: "1시간은 몇 분인가요?", options: ["10분", "60분", "100분"], answer: 1, why: "긴바늘이 한 바퀴(60분) 돌면 1시간이에요.", hint: "시계 눈금 작은 칸이 모두 몇 개인지 떠올려요." },
      explore: [["board", "book-07/elapsed-time"]],
      proofs: [],
      summary: {
        figure: figTimeAdd,
        terms: [["시각", "시계가 가리키는 때(2시 45분)"], ["걸린 시간", "두 시각 사이의 길이(1시간 35분)"]],
        facts: ["분끼리 더해 <b>60분이 넘으면 1시간으로 올린다</b>", "분끼리 뺄 수 없으면 <b>1시간을 60분으로 바꿔</b> 빌려 온다", "걸린 시간 = 끝난 시각 − 시작한 시각"]
      },
      pitfall: "시간 계산은 100이 아니라 60에서 올리고 빌립니다. 80분을 '1시간 80분'이나 '0시간 80분'으로 두지 않습니다.",
      example: {
        prompt: "2시 45분에 시작한 영화가 1시간 35분 동안 상영했습니다. 영화가 끝난 시각은 몇 시 몇 분인가요?",
        figure: figTimeAdd,
        steps: [
          { ask: "분끼리 더하면? 45 + 35 =", answer: "80", unit: "분", why: "시각의 분과 걸린 시간의 분을 먼저 더합니다.", hint: "45에 35를 더해요." },
          { ask: "80분 = 1시간 몇 분?", answer: "20", unit: "분", why: "60분이 1시간이므로 80 − 60 = 20분이 남습니다.", hint: "80에서 60을 빼요." },
          { ask: "시는? 2 + 1 + 1 =", answer: "4", unit: "시", why: "시작 2시 + 걸린 1시간 + 분에서 올라온 1시간입니다.", hint: "올라온 1시간도 더해요." }
        ]
      },
      check: [["time-add-subtract-base60-b7", "concept"], ["elapsed-time-analog-b7", "type"], ["time-add-subtract-base60-b7", "advanced"]]
    },
    {
      id: "mirror-analog-clock", title: "거울에 비친 바늘 시계",
      recall: { figure: figMirror, text: "세로로 선 거울은 왼쪽과 오른쪽을 바꿉니다.", ask: "시계를 거울에 비추면 12와 6은 어디에 있나요?", options: ["제자리", "서로 바뀐다", "3과 9 자리로 간다"], answer: 0, why: "12와 6은 세로 한가운데 선 위에 있어 거울에서도 제자리예요.", hint: "12–6 선이 거울의 축과 나란해요." },
      explore: [],
      proofs: [["mirror-clock", "거울에 비친 시계로 진짜 시각을 왜 알 수 있을까"]],
      summary: {
        figure: figMirrorClock,
        terms: [["거울 시계", "12–6을 잇는 선을 기준으로 좌우가 바뀐 시계"]],
        facts: ["거울 속 시각과 실제 시각을 더하면 <b>12시</b>(정오 기준)가 된다", "실제 시각 = <b>12시 − 거울 속 시각</b>", "12시를 <b>11시 60분</b>으로 바꾸면 빼기 쉽다"]
      },
      pitfall: "거울 속 시계에서 바늘이 가리키는 숫자를 그대로 읽으면 안 됩니다. 반드시 12시에서 뺍니다.",
      example: {
        prompt: "거울에 비친 바늘 시계가 3시 20분으로 보입니다. 실제 시각은 몇 시 몇 분인가요?",
        figure: figMirrorClock,
        steps: [
          { ask: "12시를 11시 60분으로 바꾸고 분끼리 빼면? 60 − 20 =", answer: "40", unit: "분", why: "실제 시각 = 12시 − 거울 속 시각, 분부터 뺍니다.", hint: "60에서 20을 빼요." },
          { ask: "시끼리 빼면? 11 − 3 =", answer: "8", unit: "시", why: "1시간을 60분으로 바꿨으니 12시는 11시가 되었습니다.", hint: "11에서 3을 빼요." }
        ]
      },
      check: [["mirror-clock-reading-b7", "concept"], ["mirror-clock-reading-b7", "type"], ["mirror-clock-elapsed-b7", "advanced"]]
    }
  ],
  // 2단원 숫자판 돌리기 · 1차시
  "1/1": [
    {
      id: "turn-and-flip", title: "돌리기와 뒤집기",
      recall: { figure: figTurns, text: "한 바퀴를 네 번에 나누어 돌릴 수 있습니다.", ask: "시계 방향으로 반의 반 바퀴씩 몇 번 돌리면 처음 모양이 되나요?", options: ["2번", "4번", "6번"], answer: 1, why: "반의 반 바퀴 네 번이 한 바퀴예요.", hint: "반의 반 바퀴 = 한 바퀴의 4분의 1이에요." },
      explore: [["board", "book-04/flip-rotate-source"]],
      proofs: [["two-flips-half-turn", "두 번 뒤집으면 왜 반 바퀴 돌린 것과 같을까"]],
      summary: {
        figure: figTurns,
        terms: [["반의 반 바퀴", "90° 돌리기"], ["반 바퀴", "180° 돌리기 — 위아래 뒤집고 좌우 뒤집은 것과 같다"]],
        facts: ["같은 쪽으로 <b>네 번</b> 돌리면 처음 모양", "시계 방향 3번 = 시계 반대 방향 <b>1번</b>", "많이 돌릴 때는 4로 나눈 <b>나머지</b>만큼만 돌리면 된다"]
      },
      pitfall: "돌리기와 뒤집기를 섞지 않습니다. 뒤집기는 모양의 앞뒤가 바뀌고, 돌리기는 바뀌지 않습니다.",
      example: {
        prompt: "모양을 시계 방향으로 반의 반 바퀴씩 7번 돌렸습니다. 시계 반대 방향으로 반의 반 바퀴를 몇 번 돌린 것과 같나요?",
        figure: figTurns,
        steps: [
          { ask: "4번 돌리면 제자리 — 7번은 4번 하고 몇 번 더?", answer: "3", unit: "번", why: "7 = 4 + 3이고, 4번은 처음 모양이므로 3번만 남습니다.", hint: "7을 4로 나눈 나머지예요." },
          { ask: "시계 방향 3번은 시계 반대 방향 몇 번?", answer: "1", unit: "번", why: "3번 + 1번 = 4번(한 바퀴)이므로 반대로 1번 간 것과 같습니다.", hint: "4에서 3을 빼요." }
        ]
      },
      check: [["shape-quarter-half-turn", "concept"], ["shape-rotate-flip-grid", "type"], ["shape-flip-composition", "advanced"]]
    },
    {
      id: "rotational-partition", title: "돌려서 겹치는 똑같은 조각 나누기",
      recall: { figure: figPartition, text: "모양을 가운데 점에서 돌려 처음과 겹치면 같은 모양입니다.", ask: "6×6 모눈은 모두 몇 칸인가요?", options: ["12칸", "36칸", "66칸"], answer: 1, why: "가로 6칸이 6줄이라 6 × 6 = 36칸이에요.", hint: "가로 칸 수 × 세로 칸 수예요." },
      explore: [],
      proofs: [],
      summary: {
        figure: figPartition,
        terms: [["합동", "돌리거나 뒤집어 완전히 겹치는 모양"]],
        facts: ["넷으로 똑같이 나누면 한 조각은 <b>전체 칸 수 ÷ 4</b>칸", "가운데 점을 중심으로 <b>반의 반 바퀴씩 돌리면</b> 조각이 서로 겹친다", "한 조각의 경계를 그리면 나머지 셋은 돌려서 따라 그린다"]
      },
      pitfall: "조각의 칸 수만 같다고 같은 모양은 아닙니다. 돌려서 겹치는지 확인합니다.",
      example: {
        prompt: "6×6 모눈을 모양과 크기가 같은 4조각으로 나누려고 합니다. 한 조각은 몇 칸인가요?",
        figure: figPartition,
        steps: [
          { ask: "전체 칸 수는? 6 × 6 =", answer: "36", unit: "칸", why: "가로 6칸짜리 줄이 6줄입니다.", hint: "6을 6번 더해요." },
          { ask: "한 조각은? 36 ÷ 4 =", answer: "9", unit: "칸", why: "똑같은 네 조각이므로 넷으로 나눕니다.", hint: "36을 4로 나눠요." }
        ]
      },
      check: [["rotational-partition-four", "concept"], ["rotational-partition-four", "type"], ["rotational-partition-four", "advanced"]]
    }
  ],
  // 2단원 · 2차시
  "1/2": [
    {
      id: "digital-half-turn", title: "반 바퀴 돌린 디지털 숫자",
      recall: { figure: figHalfTurnAsk, text: "반 바퀴는 위아래와 좌우를 한꺼번에 바꿉니다.", ask: "디지털 숫자 [[d:6]]을 반 바퀴 돌리면?", options: ["[[d:6]]", "[[d:9]]", "[[d:8]]"], answer: 1, why: "[[d:6]]을 거꾸로 세우면 [[d:9]] 모양이에요.", hint: "종이를 거꾸로 돌려 봐요." },
      explore: [["board", "book-01/digital-turn-flip"]],
      proofs: [],
      summary: {
        figure: figHalfTurnDigits,
        terms: [["반 바퀴 돌리기", "위아래 뒤집기 + 좌우 뒤집기 — 숫자의 차례도 거꾸로"]],
        facts: ["반 바퀴 돌려도 숫자: <b>[[d:0]] [[d:1]] [[d:2]] [[d:5]] [[d:8]]</b>(그대로), <b>[[d:6]] ↔ [[d:9]]</b>", "여러 자리 수는 차례가 거꾸로 된다", "돌려도 같은 수 = 앞뒤 자리가 서로 반 바퀴 짝"]
      },
      pitfall: "거울(좌우 뒤집기)에서는 [[d:2]] ↔ [[d:5]], 반 바퀴에서는 [[d:6]] ↔ [[d:9]]가 바뀝니다. 두 규칙을 섞지 않습니다.",
      example: {
        prompt: "두 자리 수(10~99) 중에서 디지털 숫자로 써서 반 바퀴 돌려도 같은 수로 보이는 것은 몇 개인가요?",
        figure: figHalfTurnDigits,
        steps: [
          { ask: "반 바퀴 돌려도 숫자가 되는 것 [[d:0]] [[d:1]] [[d:2]] [[d:5]] [[d:6]] [[d:8]] [[d:9]]는 몇 개?", answer: "7", unit: "개", why: "[[d:0]] [[d:1]] [[d:2]] [[d:5]] [[d:8]]은 그대로, [[d:6]]과 [[d:9]]는 서로 바뀝니다.", hint: "막대 숫자를 하나씩 세요." },
          { ask: "앞자리([[d:0]] 빼고)가 될 수 있는 것은?", answer: "6", unit: "가지", why: "두 자리 수의 앞자리는 [[d:0]]이 될 수 없습니다.", hint: "7에서 하나를 빼요." },
          { ask: "뒷자리는 앞자리의 반 바퀴 짝 — 모두 몇 개?", answer: "6", unit: "개", why: "[[d:11]] [[d:22]] [[d:55]] [[d:69]] [[d:88]] [[d:96]] — 앞자리마다 하나씩입니다.", hint: "앞자리 하나에 뒷자리 하나예요." }
        ]
      },
      check: [["c2-digital-half-turn-count", "concept"], ["digital-transform-arithmetic", "type"], ["digital-grid-upright-after-moves", "advanced"]]
    }
  ],
  // 3단원 360도와 정다각형 · 2차시 — 원
  "2/2": [
    {
      id: "radius-perimeter", title: "반지름으로 만든 도형의 둘레",
      recall: { figure: figCircleRadius, text: "원의 가운데에서 원 위까지 그은 선이 반지름입니다.", ask: "지름은 반지름의 몇 배인가요?", options: ["2배", "3배", "4배"], answer: 0, why: "지름은 가운데를 지나 양쪽 반지름을 이은 것이라 2배예요.", hint: "반지름 두 개를 이어 봐요." },
      explore: [],
      proofs: [["two-circles-triangle", "두 원으로 만든 삼각형은 왜 정삼각형일까"]],
      summary: {
        figure: figCircleRadius,
        terms: [["반지름", "원의 가운데에서 원 위의 점까지 — 한 원에서는 모두 길이가 같다"]],
        facts: ["원 위의 어느 점이든 가운데에서 <b>같은 거리</b>", "맞닿은 두 원의 가운데 사이 = <b>반지름 + 반지름</b>", "가운데 점을 이은 도형의 둘레 = 변 하나의 길이 × 변의 수"]
      },
      pitfall: "맞닿은 두 원의 가운데 사이는 반지름 하나가 아니라 두 개입니다.",
      example: {
        prompt: "반지름이 3cm인 원 네 개를 이웃한 원끼리 맞닿게 놓았습니다. 네 원의 가운데 점을 이은 사각형의 둘레는 몇 cm인가요?",
        figure: figCircleRadius,
        steps: [
          { ask: "사각형의 한 변은? 3 + 3 =", answer: "6", unit: "cm", why: "맞닿은 두 원의 가운데 사이는 반지름 두 개입니다.", hint: "반지름 두 개를 더해요." },
          { ask: "둘레는? 6 × 4 =", answer: "24", unit: "cm", why: "네 변이 모두 6cm입니다.", hint: "변이 4개예요." }
        ]
      },
      check: C3("c2-circle-radius-perimeter")
    },
    {
      id: "inscribed-midpoint", title: "원 안 직사각형의 가운데 점 잇기",
      recall: { figure: figMidpoint, text: "직사각형의 두 대각선은 길이가 같습니다.", ask: "네 꼭짓점이 원 위에 있는 직사각형의 대각선은 원의 무엇과 같나요?", options: ["반지름", "지름", "둘레"], answer: 1, why: "대각선이 원의 가운데를 지나 원 위의 두 점을 잇기 때문에 지름이에요.", hint: "가운데를 지나는 선이에요." },
      explore: [],
      proofs: [["circle-midpoints", "가운데 점을 이은 도형의 한 변은 왜 반지름과 같을까"]],
      summary: {
        figure: figMidpoint,
        terms: [["가운데 점", "변을 똑같이 둘로 나누는 점"]],
        facts: ["원 안 직사각형의 대각선 = <b>지름</b>", "변의 가운데 점을 이은 선 = 대각선의 <b>반</b> = 반지름", "가운데 점을 이은 사각형은 네 변이 같아 둘레 = 반지름 × 4"]
      },
      pitfall: "가운데 점을 이은 선은 지름이 아니라 반지름과 같습니다 — 대각선의 반입니다.",
      example: {
        prompt: "반지름이 5cm인 원 안에 네 꼭짓점이 원 위에 있는 직사각형을 그리고, 네 변의 가운데 점을 이었습니다. 이은 사각형의 둘레는 몇 cm인가요?",
        figure: figMidpoint,
        steps: [
          { ask: "직사각형의 대각선은? 5 × 2 =", answer: "10", unit: "cm", why: "대각선은 원의 지름입니다.", hint: "지름 = 반지름 × 2" },
          { ask: "가운데 점을 이은 한 변은? 10 ÷ 2 =", answer: "5", unit: "cm", why: "가운데 점을 이은 선은 대각선의 반입니다.", hint: "대각선의 반이에요." },
          { ask: "둘레는? 5 × 4 =", answer: "20", unit: "cm", why: "네 변이 모두 5cm입니다.", hint: "변이 4개예요." }
        ]
      },
      check: C3("c2-inscribed-midpoint")
    }
  ],
  // 4단원 삼각형과 사각형 · 1차시 — 삼각형 세기
  "3/1": [
    {
      id: "count-triangles", title: "크기별로 나누어 삼각형 세기",
      recall: { figure: figTriGrid, text: "큰 정삼각형의 한 변을 똑같이 나누면 작은 정삼각형이 생깁니다.", ask: "한 변을 2칸으로 나누면 가장 작은 정삼각형은 몇 개인가요?", options: ["3개", "4개", "6개"], answer: 1, why: "위로 선 것 3개와 거꾸로 선 것 1개, 모두 4개예요.", hint: "거꾸로 선 것도 세어요." },
      explore: [],
      proofs: [],
      summary: {
        figure: figTriGrid,
        terms: [["크기별로 세기", "가장 작은 것부터 한 가지 크기씩 나누어 빠짐없이 세기"]],
        facts: ["가장 작은 삼각형 수 = <b>한 변의 칸 수 × 한 변의 칸 수</b>", "<b>거꾸로 선</b> 삼각형도 따로 센다", "크기마다 센 수를 모두 더한다"]
      },
      pitfall: "큰 삼각형을 세다가 거꾸로 선 삼각형을 빠뜨리기 쉽습니다. 크기마다 위로 선 것·거꾸로 선 것을 나누어 셉니다.",
      example: {
        prompt: "한 변이 3칸인 정삼각형을 그림처럼 나누었습니다. 크기와 상관없이 정삼각형은 모두 몇 개인가요?",
        figure: figTriGrid,
        steps: [
          { ask: "가장 작은 삼각형(1칸짜리)은? 3 × 3 =", answer: "9", unit: "개", why: "위로 선 것 6개 + 거꾸로 선 것 3개입니다.", hint: "한 변이 3칸이에요." },
          { ask: "한 변이 2칸인 삼각형은?", answer: "3", unit: "개", why: "위로 선 것만 3개 있습니다(거꾸로 선 2칸짜리는 들어가지 않습니다).", hint: "꼭짓점 쪽 세 곳이에요." },
          { ask: "한 변이 3칸인 것(전체)까지 모두 더하면? 9 + 3 + 1 =", answer: "13", unit: "개", why: "크기별로 센 수를 더합니다.", hint: "세 수를 더해요." }
        ]
      },
      check: [["regular-triangle-grid-count-book5", "concept"], ["c2-grid-right-triangle-count", "type"], ["regular-triangle-grid-count-book5", "advanced"]]
    },
    {
      id: "circle-point-triangles", title: "원 위의 점으로 이등변삼각형 만들기",
      recall: { figure: figCirclePoints, text: "이등변삼각형은 두 변의 길이가 같습니다.", ask: "원 위의 같은 간격 점에서, 꼭대기 점으로부터 양쪽으로 같은 칸 떨어진 두 점을 고르면?", options: ["직각삼각형", "이등변삼각형", "아무 삼각형"], answer: 1, why: "꼭대기에서 두 점까지의 길이가 같아 이등변삼각형이에요.", hint: "양쪽으로 똑같이 떨어졌어요." },
      explore: [],
      proofs: [],
      summary: {
        figure: figCirclePoints,
        terms: [["꼭대기 점", "이등변삼각형에서 같은 두 변이 만나는 꼭짓점"]],
        facts: ["꼭대기 점을 하나 정하고 <b>양쪽으로 같은 칸</b> 떨어진 두 점을 고른다", "꼭대기 하나에서 고르는 방법을 세어 <b>점의 수만큼 곱한다</b>", "정삼각형은 꼭대기가 셋이라 세 번 세어진다 — 한 번만 남긴다"]
      },
      pitfall: "점의 개수가 3으로 나누어지면 정삼각형이 생깁니다. 정삼각형을 세 번 세지 않도록 조심합니다.",
      example: {
        prompt: "원 위에 같은 간격으로 점 8개가 있습니다. 세 점을 이어 만들 수 있는 이등변삼각형은 모두 몇 개인가요?",
        figure: figCirclePoints,
        steps: [
          { ask: "꼭대기 점 하나에서 양쪽으로 1칸, 2칸, 3칸 — 몇 가지?", answer: "3", unit: "가지", why: "4칸 떨어진 점은 양쪽이 같은 점이라 삼각형이 되지 않습니다.", hint: "4칸이면 같은 점이에요." },
          { ask: "꼭대기가 될 수 있는 점 8개 — 3 × 8 =", answer: "24", unit: "개", why: "점마다 3가지씩입니다. 8은 3으로 나누어지지 않아 정삼각형은 없습니다.", hint: "3을 8번 더해요." }
        ]
      },
      check: [["c2-circle-point-triangles", "concept"], ["c2-circle-point-triangles", "type"], ["c2-dot-triangle-count", "advanced"]]
    }
  ],
  // 4단원 · 2차시 — 사각형
  "3/2": [
    {
      id: "quad-relations", title: "사각형 사이의 관계",
      recall: { figure: figQuadChain, text: "정사각형은 네 각이 모두 직각이고 네 변이 모두 같습니다.", ask: "정사각형을 직사각형이라고 할 수 있나요?", options: ["있다", "없다"], answer: 0, why: "네 각이 모두 직각이니 직사각형의 조건을 갖췄어요.", hint: "직사각형의 조건은 네 각이 직각인 것이에요." },
      explore: [],
      proofs: [],
      summary: {
        figure: figQuadChain,
        terms: [["사다리꼴", "마주 보는 한 쌍의 변이 평행"], ["평행사변형", "마주 보는 두 쌍의 변이 평행"], ["직사각형 · 마름모", "네 각이 직각 · 네 변이 같음"]],
        facts: ["정사각형 ⊂ 직사각형 · 마름모 ⊂ 평행사변형 ⊂ 사다리꼴", "<b>안쪽 도형</b>은 바깥 도형이라고 할 수 있다", "바깥 도형은 안쪽 도형이라고 <b>할 수 없다</b>(늘 그런 것은 아니다)"]
      },
      pitfall: "'직사각형은 정사각형이다'처럼 거꾸로 말하면 틀립니다. 그림에서 안쪽 → 바깥으로만 말할 수 있습니다.",
      example: {
        prompt: "다음이 맞으면 「예」, 틀리면 「아니요」를 쓰세요.",
        figure: figQuadChain,
        steps: [
          { ask: "마름모는 평행사변형이다.", answer: "예", accept: ["네", "o", "맞다"], text: true, why: "마름모는 마주 보는 두 쌍의 변이 평행하니 평행사변형 안에 있습니다.", hint: "그림에서 마름모가 어디 안에 있나요?" },
          { ask: "직사각형은 정사각형이다.", answer: "아니요", accept: ["아니오", "x", "틀리다"], text: true, why: "네 변이 같지 않은 직사각형이 있으니 늘 그런 것은 아닙니다.", hint: "바깥 → 안쪽으로 말했어요." },
          { ask: "정사각형은 사다리꼴이다.", answer: "예", accept: ["네", "o", "맞다"], text: true, why: "정사각형은 가장 안쪽이라 바깥 모든 도형이라고 할 수 있습니다.", hint: "가장 안쪽 도형이에요." }
        ]
      },
      check: C3("c2-quad-inclusion")
    },
    {
      id: "count-rectangles", title: "모눈에서 사각형·정사각형 세기",
      recall: { figure: figRectGrid, text: "사각형은 가로선 두 개와 세로선 두 개로 둘러싸입니다.", ask: "세로선이 4개일 때 두 개를 고르는 방법은 몇 가지인가요?", options: ["4가지", "6가지", "8가지"], answer: 1, why: "1-2, 1-3, 1-4, 2-3, 2-4, 3-4로 6가지예요.", hint: "짝을 빠짐없이 써 봐요." },
      explore: [["lab", "dots", "점판 위 정사각형"]],
      proofs: [["tilted-square", "점판 위 기울어진 사각형은 왜 정사각형일까"]],
      summary: {
        figure: figRectGrid,
        terms: [["선 고르기", "가로선 2개 + 세로선 2개를 고르면 사각형이 하나로 정해진다"]],
        facts: ["사각형 수 = (가로선 2개 고르는 방법) × (세로선 2개 고르는 방법)", "정사각형은 <b>크기별로</b> 센다 — 3×3 모눈: 9 + 4 + 1", "점판에서는 <b>기울어진 정사각형</b>도 빠뜨리지 않는다"]
      },
      pitfall: "작은 칸만 세고 여러 칸을 합친 큰 사각형을 빠뜨리기 쉽습니다. 선을 골라 세면 빠짐이 없습니다.",
      example: {
        prompt: "가로 3칸, 세로 2칸인 모눈에서 찾을 수 있는 크고 작은 사각형은 모두 몇 개인가요?",
        figure: figRectGrid,
        steps: [
          { ask: "가로선 3개 중 2개를 고르는 방법은?", answer: "3", unit: "가지", why: "위-가운데, 위-아래, 가운데-아래로 3가지입니다.", hint: "짝을 써 봐요." },
          { ask: "세로선 4개 중 2개를 고르는 방법은?", answer: "6", unit: "가지", why: "4개에서 짝을 지으면 6가지입니다.", hint: "되짚기에서 본 수예요." },
          { ask: "사각형은 모두? 3 × 6 =", answer: "18", unit: "개", why: "가로선 짝마다 세로선 짝 6가지가 하나씩 사각형을 만듭니다.", hint: "두 수를 곱해요." }
        ]
      },
      check: [["c2-rectangle-grid-count", "concept"], ["square-grid-count-book5", "type"], ["c2-dot-square-count", "advanced"]]
    }
  ]
});
