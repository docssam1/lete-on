// 2과정 A4 「마방진, 복면산과 비」 개념 꾸러미(DESIGN-COURSE2.md 4절). 열쇠 「단원 번호(0부터)/차시(1부터)」.
// 예제는 새로 지은 문제라 단계 답을 이 파일에 둔다(교재 문항·답이 아니다).
import { svg, text, rect, circle, line, P, INK, GREEN, SOFT, MARK, YELLOW, formulas, mathLabel, barModel, SHADOW } from "./pack-kit.js?v=20261122zf";

const label = (x, y, t, o = {}) => mathLabel(x, y, t, { size: 13, color: "#56627f", ...o });
const board = (lines) => () => formulas(lines);
const figMagic = (cells = [2, 7, 6, 9, 5, 1, 4, 3, 8]) => () => svg(300, 150, cells.map((v, i) => rect(20 + (i % 3) * 40, 14 + Math.floor(i / 3) * 40, 40, 40, { fill: i === 4 ? YELLOW : "#fff" }) + text(40 + (i % 3) * 40, 34 + Math.floor(i / 3) * 40, v === null ? "" : String(v), { size: 18 })).join("")
  + label(220, 50, "가로·세로·대각선") + label(220, 74, "합이 모두 15"), "3×3 마방진");
const figTriangle = () => {
  const pts = [P(150, 20), P(110, 80), P(190, 80), P(70, 140), P(150, 140), P(230, 140)];
  return svg(300, 190, line(pts[0], pts[3], { color: "#9aa39e" }) + line(pts[3], pts[5], { color: "#9aa39e" }) + line(pts[5], pts[0], { color: "#9aa39e" })
    + pts.map((p, i) => `<circle cx="${p.x}" cy="${p.y}" r="15" fill="${[0, 3, 5].includes(i) ? YELLOW : "#fff"}" stroke="#4d6b5a" stroke-width="1.5" ${SHADOW}/>`).join("") + label(150, 176, "꼭짓점 수는 두 변에 함께 들어간다"), "삼각진");
};
const figBars = (a, b, la, lb) => () => svg(60 + Math.max(a, b) * 26, 84, text(18, 24, la, { size: 15, weight: 700 }) + barModel(34, 12, a, { fill: SOFT })
  + text(18, 60, lb, { size: 15, weight: 700 }) + barModel(34, 48, b, { fill: YELLOW }), "칸 막대");
// 닭과 토끼(우리가 그린 단순한 모양): 닭 = 노란 몸 + 부리 + 다리 둘, 토끼 = 흰 몸 + 긴 귀 둘 + 다리 넷
const chick = (x, y) => line(P(x - 4, y + 9), P(x - 5, y + 17), { color: "#c0782a", width: 1.6 }) + line(P(x + 4, y + 9), P(x + 5, y + 17), { color: "#c0782a", width: 1.6 })
  + `<circle cx="${x}" cy="${y}" r="10" fill="${YELLOW}" stroke="#b89a4a" stroke-width="1.3" ${SHADOW}/>` + `<polygon points="${x + 9},${y - 2} ${x + 15},${y} ${x + 9},${y + 3}" fill="#e58a2a"/>` + `<circle cx="${x + 3}" cy="${y - 3}" r="1.4" fill="#24302b"/>`;
const bunny = (x, y) => [-6, -2, 2, 6].map((dx) => line(P(x + dx, y + 9), P(x + dx, y + 17), { color: "#8a8f8c", width: 1.5 })).join("")
  + `<ellipse cx="${x - 4}" cy="${y - 14}" rx="3" ry="8" fill="#fff" stroke="#8a8f8c" stroke-width="1.2"/><ellipse cx="${x + 4}" cy="${y - 14}" rx="3" ry="8" fill="#fff" stroke="#8a8f8c" stroke-width="1.2"/>`
  + `<circle cx="${x}" cy="${y}" r="10" fill="#fff" stroke="#8a8f8c" stroke-width="1.3" ${SHADOW}/>` + `<circle cx="${x + 3}" cy="${y - 2}" r="1.4" fill="#24302b"/>`;
const figLegs = () => svg(340, 120, Array.from({ length: 12 }, (_, i) => (i < 5 ? bunny : chick)(22 + i * 27, 42)).join("")
  + label(170, 86, "모두 닭(다리 2)이라고 가정하고") + label(170, 106, "하나씩 토끼(다리 4)로 바꾼다"), "가정하여 풀기");

export const PACKS = {
  "0/1": [{
    id: "magic-square", title: "마방진 — 한 줄의 합 찾기",
    recall: { figure: figMagic(), text: "가로·세로·대각선에 놓인 수의 합이 모두 같은 표를 마방진이라 합니다.", ask: "1부터 9까지를 모두 더하면?", options: ["45", "36", "50"], answer: 0, why: "(1 + 9) × 9 ÷ 2 = 45예요.", hint: "짝 지어 더하기" },
    explore: [["drill", "magic", "마방진 연습"]],
    proofs: [],
    summary: {
      figure: figMagic(),
      terms: [["마방진", "가로·세로·대각선의 합이 같은 수 배열"]],
      facts: ["한 줄의 합 = 모든 수의 합 ÷ 줄 수(3×3이면 ÷ 3)", "1~9로 만든 3×3 마방진은 한 줄의 합 <b>15</b>, 가운데 <b>5</b>", "가운데를 지나는 줄의 마주 보는 두 수는 합이 10"]
    },
    pitfall: "주어진 수가 1~9가 아니면 합과 가운데 수를 다시 계산합니다(가운데 = 한 줄의 합 ÷ 3).",
    example: {
      prompt: "1부터 9까지의 수를 한 번씩 써서 3×3 마방진을 만들 때, 한 줄의 합과 가운데 칸의 수를 구하세요.",
      figure: figMagic([null, null, null, null, null, null, null, null, null]),
      steps: [
        { ask: "아홉 수를 모두 더하면?", answer: "45", why: "1 + 2 + … + 9 = 45입니다.", hint: "(1 + 9) × 9 ÷ 2" },
        { ask: "한 줄의 합은?", answer: "15", why: "가로 세 줄에 모든 수가 한 번씩 들어가니 45 ÷ 3 = 15입니다.", hint: "45 ÷ 3" },
        { ask: "가운데 칸의 수는?", answer: "5", why: "가운데를 지나는 네 줄의 합 60 = 45 + 가운데 × 3이라 가운데는 5입니다.", hint: "15 ÷ 3" }
      ]
    },
    check: [["magic-square-three-target", "concept"], ["magic-square-three-complete", "type"], ["magic-square-four-target", "advanced"]]
  }],
  "0/2": [{
    id: "polygon-magic", title: "정다각별과 삼각진 — 두 번 세는 꼭짓점",
    recall: { figure: figTriangle, text: "삼각형의 세 변에 수를 놓으면 꼭짓점의 수는 두 변에 함께 들어갑니다.", ask: "세 변의 합을 모두 더하면 꼭짓점의 수는 몇 번 세어지나?", options: ["두 번", "한 번", "세 번"], answer: 0, why: "꼭짓점마다 두 변이 만나요.", hint: "만나는 변의 수" },
    explore: [["drill", "magic", "마방진 연습"]],
    proofs: [],
    summary: {
      figure: figTriangle,
      terms: [["삼각진·원형진", "도형의 변이나 원 위에 수를 놓아 줄마다 합을 같게 만든 것"]],
      facts: ["(한 변의 합) × 변의 수 = 모든 수의 합 + <b>두 번 센 수들의 합</b>", "한 변의 합을 크게 하려면 꼭짓점에 큰 수를 놓는다", "가운데 원이 모든 줄에 들어가면, 그 수는 줄 수만큼 세어진다"]
    },
    pitfall: "꼭짓점 수를 한 번만 더하면 식이 맞지 않습니다. 겹치는 자리부터 표시합니다.",
    example: {
      prompt: "1부터 6까지의 수를 삼각형의 세 꼭짓점과 세 변의 가운데에 한 번씩 놓아, 각 변의 세 수의 합이 10이 되게 하려고 합니다. 꼭짓점 세 수의 합은 얼마여야 하나요?",
      figure: figTriangle,
      steps: [
        { ask: "1부터 6까지의 합은?", answer: "21", why: "1 + 2 + … + 6 = 21입니다.", hint: "(1 + 6) × 6 ÷ 2" },
        { ask: "세 변의 합을 모두 더하면?", answer: "30", why: "10 × 3 = 30입니다.", hint: "10 × 3" },
        { ask: "꼭짓점 세 수의 합은?", answer: "9", why: "30 = 21 + 꼭짓점 합이므로 9입니다(예: 1, 3, 5).", hint: "30 − 21" }
      ]
    },
    check: [["circular-magic-seven-line-sum", "concept"], ["equal-line-sum", "type"], ["circular-magic-eleven-line-sum", "advanced"]]
  }],
  "1/1": [{
    id: "add-cryptarithm", title: "덧셈 복면산 — 자리마다 받아올림 따지기",
    recall: { figure: board(["A B", "+ B A", "= 1 3 2"]), text: "복면산은 같은 문자에 같은 숫자, 다른 문자에 다른 숫자를 넣어 식을 맞추는 퍼즐입니다.", ask: "두 자리 수 AB는 무엇과 같나?", options: ["A × 10 + B", "A + B", "A × B"], answer: 0, why: "A가 십의 자리라 10배예요.", hint: "자릿값" },
    explore: [["board", "book-03/cryptarithm-repeated"], ["drill", "crypt", "복면산 연습"]],
    proofs: [],
    summary: {
      figure: board(["AB + BA = 11 × (A + B)"]),
      terms: [["받아올림", "아래 자리의 합이 10 이상이면 윗자리에 1을 더한다"]],
      facts: ["일의 자리부터 보며 <b>받아올림이 있는지</b> 먼저 정한다", "AB + BA = 11 × (A + B) — 자리를 바꾼 두 수의 합은 11의 배수", "가장 높은 자리의 받아올림은 1뿐이다(두 수의 덧셈)"]
    },
    pitfall: "찾은 숫자를 식에 다시 넣어 확인합니다. 문자가 다르면 숫자도 달라야 합니다.",
    example: {
      prompt: "AB + BA = 132이고 A가 B보다 2 큽니다. A와 B를 구하세요.",
      figure: board(["A B", "+ B A", "= 1 3 2"]),
      steps: [
        { ask: "AB + BA = 11 × (A + B) — A + B는?", answer: "12", why: "132 ÷ 11 = 12입니다.", hint: "132 ÷ 11" },
        { ask: "A는? (A + B = 12, A − B = 2)", answer: "7", why: "(12 + 2) ÷ 2 = 7, B = 5입니다. 75 + 57 = 132로 확인됩니다.", hint: "(12 + 2) ÷ 2" }
      ]
    },
    check: [["two-digit-letter-cryptarithm", "concept"], ["cryptarithm-multi-symbol-carry", "type"], ["pyramid-cryptarithm-b8", "advanced"]]
  }],
  "1/2": [{
    id: "multiply-cryptarithm", title: "곱셈 복면산과 매트릭스 — 일의 자리로 좁히기",
    recall: { figure: board(["5 × 5 = 25", "6 × 6 = 36"]), text: "곱셈 복면산은 곱의 일의 자리를 먼저 보면 후보가 크게 줄어듭니다.", ask: "제곱했을 때 일의 자리가 자기 자신인 한 자리 수는?", options: ["0, 1, 5, 6", "2, 4, 8", "3, 7, 9"], answer: 0, why: "0·1·5·6만 그래요.", hint: "□ × □의 끝자리" },
    explore: [["drill", "crypt", "복면산 연습"]],
    proofs: [],
    summary: {
      figure: board(["△ × △ = □△"]),
      terms: [["후보 좁히기", "일의 자리·가장 높은 자리 조건으로 가능한 숫자를 줄인다"]],
      facts: ["곱의 <b>일의 자리</b>는 곱하는 두 수의 일의 자리만으로 정해진다", "곱이 몇 자리인지로 가장 높은 자리의 크기를 좁힌다", "칸에 수를 넣는 매트릭스는 곱(합)이 가장 큰 줄부터 채운다"]
    },
    pitfall: "0은 가장 높은 자리에 올 수 없습니다.",
    example: {
      prompt: "△ × △ = □△ (두 자리 수)이고 △는 짝수입니다. △와 □를 구하세요.",
      figure: board(["△ × △ = □△"]),
      steps: [
        { ask: "제곱의 일의 자리가 자기 자신이고 두 자리가 되는 짝수 △는?", answer: "6", why: "후보 5, 6 가운데 짝수는 6입니다.", hint: "5 또는 6" },
        { ask: "□는?", answer: "3", why: "6 × 6 = 36입니다.", hint: "6 × 6" }
      ]
    },
    check: [["symbol-multiplication-chain", "concept"], ["number-card-mixed-operations", "type"], ["letter-pyramid-cryptarithm-b8", "advanced"]]
  }],
  "2/1": [{
    id: "gcd", title: "최대공약수 — 남김없이 똑같이 나누기",
    recall: { figure: board(["12의 약수: 1 2 3 4 6 12", "18의 약수: 1 2 3 6 9 18"]), text: "두 수를 모두 나누어떨어지게 하는 수를 공약수, 그중 가장 큰 수를 최대공약수라 합니다.", ask: "12와 18의 최대공약수는?", options: ["6", "3", "36"], answer: 0, why: "공약수 1, 2, 3, 6 중 가장 커요.", hint: "공약수 중 최대" },
    explore: [["drill", "gcdlcm", "약수와 배수 연습"]],
    proofs: [],
    summary: {
      figure: board(["48 = 12 × 4", "36 = 12 × 3"]),
      terms: [["기약분수", "분자와 분모의 최대공약수가 1인 분수"]],
      facts: ["「될 수 있는 대로 많은 사람에게 남김없이 똑같이」 → <b>최대공약수</b>", "「가장 큰 정사각형으로 자르기」 → 가로·세로의 최대공약수", "「나누면 □가 남는다」 → 그 수에서 □를 빼고 공약수를 찾는다(□보다 커야 한다)"]
    },
    pitfall: "나머지가 있는 문제에서 나누는 수는 나머지보다 커야 합니다.",
    example: {
      prompt: "사과 48개와 배 36개를 될 수 있는 대로 많은 학생에게 남김없이 똑같이 나누어 주려고 합니다. 몇 명에게 줄 수 있고, 한 명이 사과를 몇 개 받나요?",
      figure: board(["48 = 12 × 4", "36 = 12 × 3"]),
      steps: [
        { ask: "48과 36의 최대공약수는?", answer: "12", why: "48 = 12 × 4, 36 = 12 × 3이고 4와 3은 공약수가 1뿐입니다.", hint: "공약수 중 최대" },
        { ask: "한 명이 받는 사과는?", answer: "4", unit: "개", why: "48 ÷ 12 = 4입니다(배는 3개).", hint: "48 ÷ 12" }
      ]
    },
    check: [["c2-gcd-word", "concept"], ["c2-unit-fraction", "type"], ["c2-gcd-word", "advanced"]]
  }],
  "2/2": [{
    id: "lcm", title: "최소공배수와 연속수 — 다시 함께 만나는 때",
    recall: { figure: board(["12의 배수: 12 24 36 48 …", "18의 배수: 18 36 54 …"]), text: "두 수의 배수 가운데 공통인 것을 공배수, 그중 가장 작은 것을 최소공배수라 합니다.", ask: "12와 18의 최소공배수는?", options: ["36", "72", "6"], answer: 0, why: "처음으로 함께 나오는 배수예요.", hint: "공통인 배수 중 최소" },
    explore: [["drill", "gcdlcm", "약수와 배수 연습"]],
    proofs: [],
    summary: {
      figure: board(["12분, 18분 → 36분마다 함께"]),
      terms: [["공배수", "두 수 모두의 배수 — 최소공배수의 배수들"]],
      facts: ["「동시에 다시 출발·켜짐」 → <b>최소공배수</b>", "「어느 수로 나누어도 □가 남는다」 → 최소공배수의 배수 + □", "연속한 세 수가 차례로 배수일 때는 첫째 수를 배수로 하나씩 놓아 본다"]
    },
    pitfall: "최대공약수와 최소공배수를 바꾸어 쓰지 않습니다 — 「나누기」는 약수, 「다시 만나기」는 배수입니다.",
    example: {
      prompt: "㉮ 버스는 12분마다, ㉯ 버스는 18분마다 떠납니다. 오전 9시에 함께 떠났다면 다음에 함께 떠나는 것은 몇 분 뒤이고, 그다음은 몇 분 뒤인가요?",
      figure: board(["12의 배수 · 18의 배수"]),
      steps: [
        { ask: "처음 다시 함께 떠나는 것은 몇 분 뒤?", answer: "36", unit: "분", why: "12와 18의 최소공배수 36입니다(오전 9시 36분).", hint: "최소공배수" },
        { ask: "그다음은 처음부터 몇 분 뒤?", answer: "72", unit: "분", why: "36의 배수마다 만나므로 72분 뒤(오전 10시 12분)입니다.", hint: "36 × 2" }
      ]
    },
    check: [["c2-lcm-word", "concept"], ["c2-consecutive-multiples", "type"], ["c2-lcm-word", "advanced"]]
  }],
  "2/3": [{
    id: "gcd-lcm-ratio", title: "최대공약수와 최소공배수 — 비로 두 수 찾기",
    recall: { figure: figBars(3, 5, "A", "B"), text: "A : B = 3 : 5이면 A = 3 × □, B = 5 × □처럼 같은 □를 곱한 수입니다.", ask: "그때 A와 B의 최대공약수는?", options: ["□", "3", "15"], answer: 0, why: "3과 5는 공약수가 1뿐이에요.", hint: "3, 5의 공약수" },
    explore: [["drill", "gcdlcm", "약수와 배수 연습"]],
    proofs: [],
    summary: {
      figure: figBars(3, 5, "A", "B"),
      terms: [["서로소", "공약수가 1뿐인 두 수(3과 5)"]],
      facts: ["A = 3 × □, B = 5 × □ (3과 5는 서로소) → 최대공약수 = □", "최소공배수 = 3 × 5 × □", "두 수의 곱 = 최대공약수 × 최소공배수"]
    },
    pitfall: "비가 6 : 10처럼 약분되는 꼴이면 먼저 3 : 5로 바꾼 뒤 □를 찾습니다.",
    example: {
      prompt: "두 자연수 A, B의 비가 3 : 5이고 최소공배수가 90입니다. A와 B를 구하세요.",
      figure: figBars(3, 5, "A", "B"),
      steps: [
        { ask: "최소공배수 = 3 × 5 × □ = 15 × □ — □는?", answer: "6", why: "90 ÷ 15 = 6입니다.", hint: "90 ÷ 15" },
        { ask: "A는?", answer: "18", why: "3 × 6 = 18, B = 5 × 6 = 30입니다.", hint: "3 × 6" }
      ]
    },
    check: [["c2-ratio-gcd-lcm", "concept"], ["c2-ratio-gcd-lcm", "type"], ["c2-unit-fraction", "advanced"]]
  }],
  "3/1": [{
    id: "ratio-balance", title: "양팔저울과 연비 — 몇 배가 같을 때",
    recall: { figure: figBars(5, 3, "형", "동"), text: "「형의 3배 = 동생의 5배」이면 형 1 : 동생 1 = 5 : 3입니다.", ask: "개수(배수)가 많은 쪽 한 개는?", options: ["더 작다", "더 크다", "같다"], answer: 0, why: "많이 있어야 같아지니 하나는 작아요.", hint: "5개 = 3개" },
    explore: [["board", "book-06/bar-balance-ratio-source"], ["drill", "assume", "비와 가정 연습"]],
    proofs: [],
    summary: {
      figure: figBars(5, 3, "형", "동"),
      terms: [["연비", "세 양 이상의 비 — 같은 양을 기준으로 이어 붙인다"]],
      facts: ["A × 3 = B × 5 → A : B = <b>5 : 3</b>(곱한 수를 엇갈려 쓴다)", "합이나 차가 몇 칸인지로 한 칸의 값을 구한다", "A : B와 B : C를 이을 때는 B의 칸 수를 같게 맞춘다"]
    },
    pitfall: "비를 거꾸로 쓰지 않았는지, 구한 값을 처음 조건에 넣어 확인합니다.",
    example: {
      prompt: "형 용돈의 3배는 동생 용돈의 5배와 같고, 형이 동생보다 2000원 많습니다. 형의 용돈은 얼마인가요?",
      figure: figBars(5, 3, "형", "동"),
      steps: [
        { ask: "형 : 동생 = 5 : □", answer: "3", why: "형 × 3 = 동생 × 5이므로 5 : 3입니다.", hint: "곱한 수를 바꾸어" },
        { ask: "한 칸은 얼마? (차 2칸 = 2000원)", answer: "1000", unit: "원", why: "2000 ÷ 2 = 1000입니다.", hint: "2000 ÷ 2" },
        { ask: "형의 용돈은?", answer: "5000", unit: "원", why: "5칸 × 1000 = 5000원(동생 3000원)입니다.", hint: "5 × 1000" }
      ]
    },
    check: [["c2-ratio-difference", "concept"], ["two-object-weight-unit-test-book6", "type"], ["c2-ratio-difference", "advanced"]]
  }],
  "3/2": [{
    id: "sum-difference", title: "합과 차를 이용한 문제해결",
    recall: { figure: figBars(4, 2, "큰", "작"), text: "두 수의 합과 차를 알면, 합에 차를 더하면 큰 수의 두 배가 됩니다.", ask: "합 10, 차 4인 두 수의 큰 수는?", options: ["7", "6", "3"], answer: 0, why: "(10 + 4) ÷ 2 = 7이에요.", hint: "(합 + 차) ÷ 2" },
    explore: [["drill", "assume", "비와 가정 연습"]],
    proofs: [],
    summary: {
      figure: figBars(4, 2, "큰", "작"),
      terms: [["합차", "합과 차로 두 수 찾기"]],
      facts: ["큰 수 = (합 + 차) ÷ 2, 작은 수 = (합 − 차) ÷ 2", "세 수일 때는 기준이 되는 수로 나머지를 나타내고 합을 맞춘다", "그림(막대)으로 그리면 같은 칸과 다른 칸이 보인다"]
    },
    pitfall: "합과 차가 둘 다 짝수이거나 둘 다 홀수여야 두 수가 자연수가 됩니다.",
    example: {
      prompt: "두 수의 합이 50이고 차가 14입니다. 두 수를 구하세요.",
      figure: figBars(4, 2, "큰", "작"),
      steps: [
        { ask: "큰 수는?", answer: "32", why: "(50 + 14) ÷ 2 = 32입니다.", hint: "64 ÷ 2" },
        { ask: "작은 수는?", answer: "18", why: "(50 − 14) ÷ 2 = 18입니다. 32 + 18 = 50, 32 − 18 = 14로 확인됩니다.", hint: "36 ÷ 2" }
      ]
    },
    check: [["two-class-total-difference", "concept"], ["two-type-unit-total", "type"], ["symbol-relation", "advanced"]]
  }],
  "3/3": [{
    id: "assume", title: "가정하여 해결하기 — 모두 한 가지라면",
    recall: { figure: figLegs, text: "닭과 토끼가 섞여 있을 때, 모두 닭이라고 가정해 다리를 세면 실제와 차이가 납니다.", ask: "닭 하나를 토끼로 바꾸면 다리는?", options: ["2개 늘어난다", "4개 늘어난다", "그대로"], answer: 0, why: "4 − 2 = 2예요.", hint: "4 − 2" },
    explore: [["drill", "assume", "비와 가정 연습"]],
    proofs: [],
    summary: {
      figure: figLegs,
      terms: [["가정하여 풀기", "모두 한 가지라고 놓고 실제와의 차이를 나누어 바꾸는 개수를 찾는다"]],
      facts: ["바꾸는 개수 = (실제 − 가정한 값) ÷ (하나 바꿀 때 달라지는 양)", "맞히면 +4점, 틀리면 −1점: 하나 틀릴 때마다 <b>4 + 1 = 5점</b>씩 줄어든다", "구한 개수로 처음 조건(합계)을 다시 확인한다"]
    },
    pitfall: "점수 문제에서 하나 틀리면 받을 점수(4점)를 못 받고 잃는 점수(1점)까지 빠지니 4 + 1 = 5점이 줄어듭니다(1점만 줄어드는 것이 아닙니다).",
    example: {
      prompt: "닭과 토끼가 모두 12마리 있고 다리는 모두 34개입니다. 토끼는 몇 마리인가요?",
      figure: figLegs,
      steps: [
        { ask: "모두 닭이라면 다리는?", answer: "24", unit: "개", why: "12 × 2 = 24입니다.", hint: "12 × 2" },
        { ask: "실제보다 몇 개 적은가요?", answer: "10", unit: "개", why: "34 − 24 = 10입니다.", hint: "34 − 24" },
        { ask: "토끼는?", answer: "5", unit: "마리", why: "하나 바꿀 때 2개씩 늘어 10 ÷ 2 = 5마리(닭 7마리)입니다.", hint: "10 ÷ 2" }
      ]
    },
    check: [["c2-assume-solve", "concept"], ["c2-assume-solve", "type"], ["c2-assume-solve", "advanced"]]
  }]
};
