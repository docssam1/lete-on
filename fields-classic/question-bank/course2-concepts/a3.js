// 2과정 A3 「규칙성과 수열」 개념 꾸러미(DESIGN-COURSE2.md 4절). 열쇠 「단원 번호(0부터)/차시(1부터)」.
// 예제는 새로 지은 문제라 단계 답을 이 파일에 둔다(교재 문항·답이 아니다).
// 글 속 분수는 「3/5」로 쓰면 화면·인쇄에서 수식으로 바뀐다(course2-pack.js · course2-pack-print.js의 mathText).
import { svg, text, rect, circle, line, grid, dot, P, INK, GREEN, SOFT, MARK, YELLOW, formulas, mathLabel } from "./pack-kit.js?v=20261122i";

const label = (x, y, t, o = {}) => mathLabel(x, y, t, { size: 13, color: "#56627f", ...o });
const board = (lines) => () => formulas(lines);
const figRows = () => {
  const rows = ["1", "2 3 4", "5 6 7 8 9", "10 … 16"];
  return svg(300, 140, rows.map((t, i) => text(150, 22 + i * 32, t, { size: 18 })).join("") + label(270, 22, "1개", { anchor: "end" }) + label(270, 54, "3개", { anchor: "end" }) + label(270, 86, "5개", { anchor: "end" }), "홀수 개씩 쓴 줄");
};
const figTriangle = () => {
  let body = "";
  for (let r = 0; r < 5; r += 1) for (let c = 0; c <= r; c += 1) body += circle(P(70 + c * 20 - r * 10, 18 + r * 18), 6, { fill: YELLOW, color: GREEN, width: 1.2 });
  return svg(300, 110, body + label(210, 40, "1, 3, 6, 10, 15 …") + label(210, 64, "□번째 = 1 + 2 + … + □"), "삼각수");
};
const figGauss = () => svg(340, 110, text(170, 26, "3 + 7 + 11 + … + 79", { size: 17 }) + text(170, 56, "79 + 75 + 71 + … + 3", { size: 17 }) + line(P(40, 74), P(300, 74), { color: GREEN }) + text(170, 92, "82 + 82 + … + 82 (20개)", { size: 17, color: GREEN }), "가우스의 덧셈");
const figPaths = (blocked = false) => () => {
  const o = P(30, 20), s = 56;
  let body = grid(o, blocked ? 2 : 3, 2, s, { color: INK, width: 2 });
  body += dot(o, 5, GREEN) + dot(P(o.x + (blocked ? 2 : 3) * s, o.y + 2 * s), 5, MARK) + label(o.x - 12, o.y - 6, "A") + label(o.x + (blocked ? 2 : 3) * s + 12, o.y + 2 * s + 10, "B");
  if (blocked) body += circle(P(o.x + s, o.y + s), 9, { fill: "#fff", color: MARK, width: 2.4 }) + label(o.x + s, o.y + s + 22, "못 지남", { color: MARK });
  else body += [[1, 0, "1"], [2, 0, "1"], [3, 0, "1"], [0, 1, "1"], [0, 2, "1"], [1, 1, "2"], [2, 1, "3"], [3, 1, "4"], [1, 2, "3"], [2, 2, "6"], [3, 2, "10"]].map(([c, r, v]) => text(o.x + c * s + 12, o.y + r * s - 10, v, { size: 13, color: GREEN, weight: 700 })).join("");
  return svg(260, 150, body, "바둑판 길");
};
const figCards = () => svg(300, 70, ["1", "2", "3", "4"].map((v, i) => rect(20 + i * 56, 12, 44, 46, { fill: "#fff" }) + text(42 + i * 56, 35, v, { size: 20 })).join(""), "숫자 카드");

export const PACKS = {
  "0/1": [{
    id: "repeating-decimal", title: "카프리카수와 마디수열 — 되풀이되는 소수",
    recall: { figure: board(["1 ÷ 3 = 0.333…", "1 ÷ 11 = 0.0909…"]), text: "나누어떨어지지 않는 나눗셈은 몫의 숫자가 어느 순간부터 되풀이됩니다.", ask: "0.090909…에서 되풀이되는 마디는?", options: ["09", "9", "090"], answer: 0, why: "0과 9 두 숫자가 되풀이돼요.", hint: "두 숫자" },
    explore: [["drill", "decimal", "되풀이 소수 연습"]],
    proofs: [],
    summary: {
      figure: board(["3/7 = 0.428571 428571 …"]),
      terms: [["마디", "되풀이되는 숫자 묶음"]],
      facts: ["분수 → 소수: 분자 ÷ 분모를 계속 나누어 마디를 찾는다", "소수점 아래 □번째 = □ ÷ 마디 길이의 <b>나머지</b>번째 숫자(나머지 0이면 마지막)", "거듭제곱의 일의 자리도 마디로 되풀이된다(2 → 4 → 8 → 6)"]
    },
    pitfall: "자리 번호는 소수점 바로 아래부터 1번째입니다. 0.4285…의 4가 1번째입니다.",
    example: {
      prompt: "3/7을 소수로 나타낼 때 소수점 아래 20번째 숫자를 구하세요.",
      figure: board(["3 ÷ 7 = 0.428571428571…"]),
      steps: [
        { ask: "되풀이되는 마디(428571)는 몇 자리?", answer: "6", unit: "자리", why: "4, 2, 8, 5, 7, 1 여섯 자리입니다.", hint: "숫자 세기" },
        { ask: "20 ÷ 6의 나머지는?", answer: "2", why: "6 × 3 = 18, 20 − 18 = 2입니다.", hint: "6 × 3" },
        { ask: "마디의 2번째 숫자는?", answer: "2", why: "4 2 8 5 7 1에서 두 번째는 2입니다.", hint: "428571" }
      ]
    },
    check: [["c2-repeating-decimal", "concept"], ["c2-power-last-digit", "type"], ["c2-repeating-decimal", "advanced"]]
  }],
  "0/2": [{
    id: "arith-sequence", title: "차가 같은 수열(등차수열)",
    recall: { figure: board(["5, 9, 13, 17, …"]), text: "앞의 수에 같은 수를 더해 가며 만든 수열을 등차수열이라 하고, 더하는 수를 「차」라 합니다.", ask: "5, 9, 13, 17, …의 차는?", options: ["4", "5", "9"], answer: 0, why: "9 − 5 = 4예요.", hint: "이웃한 두 수의 차" },
    explore: [["drill", "arith", "등차수열 연습"]],
    proofs: [],
    summary: {
      figure: board(["□번째 수 = 첫 수 + 차 × (□ − 1)"]),
      terms: [["차", "이웃한 두 수의 차 — 늘 같다"]],
      facts: ["□번째 수는 차를 <b>(□ − 1)번</b> 더한 수", "어떤 수가 몇 번째인지: (그 수 − 첫 수) ÷ 차 + 1", "범위 안의 개수: 처음 수와 마지막 수를 찾아 (마지막 − 처음) ÷ 차 + 1"]
    },
    pitfall: "30번째 수를 구할 때 차를 30번이 아니라 29번 더합니다(식목처럼 간격 수는 하나 적다).",
    example: {
      prompt: "수열 5, 9, 13, 17, …에서 30번째 수와, 201이 몇 번째 수인지 구하세요.",
      figure: board(["5, 9, 13, 17, …"]),
      steps: [
        { ask: "30번째 수는?", answer: "121", why: "5 + 4 × 29 = 121입니다.", hint: "5 + 4 × 29" },
        { ask: "201은 첫 수보다 차를 몇 번 더한 수?", answer: "49", unit: "번", why: "(201 − 5) ÷ 4 = 49입니다.", hint: "196 ÷ 4" },
        { ask: "201은 몇 번째?", answer: "50", unit: "번째", why: "49번 더했으니 49 + 1 = 50번째입니다.", hint: "+ 1" }
      ]
    },
    check: [["c2-arith-sequence", "concept"], ["c2-arith-sequence", "type"], ["c2-group-rows", "advanced"]]
  }],
  "0/3": [{
    id: "fraction-sequence", title: "등차수열과 분수 — 묶음으로 늘어놓은 분수",
    recall: { figure: board(["1/1 | 1/2, 2/2 | 1/3, 2/3, 3/3 | …"]), text: "분수를 분모가 같은 것끼리 묶으면 묶음마다 분수가 1개, 2개, 3개 … 들어 있습니다.", ask: "분모가 4인 묶음에는 분수가 몇 개?", options: ["4개", "3개", "5개"], answer: 0, why: "1/4, 2/4, 3/4, 4/4예요.", hint: "분모만큼" },
    explore: [["drill", "groups", "묶음수열 연습"]],
    proofs: [],
    summary: {
      figure: board(["1/1 | 1/2, 2/2 | 1/3, 2/3, 3/3 | …"]),
      terms: [["묶음수열", "몇 개씩 묶으면 묶음마다 같은 규칙이 되풀이되는 수열"]],
      facts: ["□번째 묶음까지의 개수 = 1 + 2 + … + □", "□번째 분수: 앞 묶음까지의 개수를 빼고 남은 수가 <b>그 묶음의 몇 번째</b>인지 본다", "분자·분모가 각각 어떻게 변하는지 따로 적어 본다"]
    },
    pitfall: "묶음 번호와 묶음 안의 자리를 섞지 않습니다. 표로 「몇 번째 묶음 · 몇 번째 자리」를 함께 적습니다.",
    example: {
      prompt: "분수를 1/1, 1/2, 2/2, 1/3, 2/3, 3/3, …처럼 늘어놓을 때 20번째 분수를 구하세요.",
      figure: board(["1/1 | 1/2, 2/2 | 1/3, 2/3, 3/3 | …"]),
      steps: [
        { ask: "5번째 묶음(분모 5)까지 분수는 모두 몇 개?", answer: "15", unit: "개", why: "1 + 2 + 3 + 4 + 5 = 15입니다.", hint: "1부터 5까지 더하기" },
        { ask: "20번째는 6번째 묶음의 몇 번째?", answer: "5", unit: "번째", why: "20 − 15 = 5입니다.", hint: "20 − 15" },
        { ask: "20번째 분수는? (분수로)", answer: "5/6", text: true, why: "분모 6인 묶음의 5번째이므로 5/6입니다.", hint: "분모 6" }
      ]
    },
    check: [["c2-fraction-sequence", "concept"], ["c2-fraction-sequence", "type"], ["c2-fraction-sequence", "advanced"]]
  }],
  "1/1": [{
    id: "square-rows", title: "사각수와 제곱수 — 홀수 개씩 쓴 줄",
    recall: { figure: figRows, text: "1부터 연속한 홀수 □개의 합은 □ × □입니다.", ask: "1 + 3 + 5 + 7은?", options: ["16", "12", "15"], answer: 0, why: "홀수 4개라 4 × 4예요.", hint: "4 × 4" },
    explore: [["drill", "groups", "묶음수열 연습"]],
    proofs: [],
    summary: {
      figure: figRows,
      terms: [["제곱수", "1, 4, 9, 16 … — 같은 수를 두 번 곱한 수"]],
      facts: ["줄마다 홀수 개씩 쓰면 □번째 줄의 <b>마지막 수 = □ × □</b>", "□번째 줄의 첫 수 = (□ − 1) × (□ − 1) + 1", "가운데 수 = 첫 수와 마지막 수의 가운데"]
    },
    pitfall: "줄의 마지막 수가 제곱수가 되는 것은 1, 3, 5 …처럼 홀수 개씩 쓸 때만입니다.",
    example: {
      prompt: "1부터 차례로 첫째 줄에 1개, 둘째 줄에 3개, 셋째 줄에 5개 … 씩 수를 씁니다. 7번째 줄의 첫 수와 마지막 수를 구하세요.",
      figure: figRows,
      steps: [
        { ask: "6번째 줄의 마지막 수는?", answer: "36", why: "6 × 6 = 36입니다.", hint: "6 × 6" },
        { ask: "7번째 줄의 첫 수는?", answer: "37", why: "36 다음 수입니다.", hint: "36 + 1" },
        { ask: "7번째 줄의 마지막 수는?", answer: "49", why: "7 × 7 = 49입니다(37부터 13개).", hint: "7 × 7" }
      ]
    },
    check: [["c2-odd-sum-square", "concept"], ["c2-group-rows", "type"], ["c2-group-rows", "advanced"]]
  }],
  "1/2": [{
    id: "gauss", title: "가우스와 등차수열의 합",
    recall: { figure: figGauss, text: "1 + 2 + … + 10을 거꾸로 한 줄 더 써서 위아래로 더하면 11이 10개 생깁니다.", ask: "그러면 1 + 2 + … + 10은?", options: ["55", "110", "50"], answer: 0, why: "11 × 10 = 110의 절반이에요.", hint: "110 ÷ 2" },
    explore: [["drill", "arith", "등차수열 연습"]],
    proofs: [],
    summary: {
      figure: figGauss,
      terms: [["가우스의 덧셈", "거꾸로 쓴 줄과 짝을 지어 더하는 방법"]],
      facts: ["등차수열의 합 = (첫 수 + 끝 수) × 개수 ÷ 2", "개수 = (끝 수 − 첫 수) ÷ 차 + 1", "분모가 같은 분수의 합은 분자들만 같은 방법으로 더한다"]
    },
    pitfall: "끝 수를 모를 때는 먼저 「□번째 수」로 끝 수부터 구합니다.",
    example: {
      prompt: "3 + 7 + 11 + … + 79의 값을 구하세요.",
      figure: figGauss,
      steps: [
        { ask: "더하는 수는 몇 개?", answer: "20", unit: "개", why: "(79 − 3) ÷ 4 + 1 = 20입니다.", hint: "76 ÷ 4 + 1" },
        { ask: "짝 하나의 합(3 + 79)은?", answer: "82", why: "첫 수와 끝 수를 더합니다.", hint: "3 + 79" },
        { ask: "합은?", answer: "820", why: "82 × 20 ÷ 2 = 820입니다.", hint: "82 × 20 ÷ 2" }
      ]
    },
    check: [["c2-gauss-sum", "concept"], ["c2-gauss-sum", "type"], ["c2-gauss-sum", "advanced"]]
  }],
  "1/3": [{
    id: "triangular", title: "삼각수와 묶음수열",
    recall: { figure: figTriangle, text: "점을 정삼각형 모양으로 늘어놓은 수 1, 3, 6, 10, …을 삼각수라 합니다.", ask: "다섯 번째 삼각수는?", options: ["15", "12", "25"], answer: 0, why: "1 + 2 + 3 + 4 + 5 = 15예요.", hint: "1부터 5까지" },
    explore: [["drill", "groups", "묶음수열 연습"]],
    proofs: [],
    summary: {
      figure: figTriangle,
      terms: [["삼각수", "1 + 2 + … + □ — 정삼각형 모양의 점 개수"]],
      facts: ["□번째 삼각수 = (1 + □) × □ ÷ 2", "1, 2, 2, 3, 3, 3, …처럼 묶은 수열에서 □번째 묶음이 끝나는 자리 = □번째 삼각수", "오각수·육각수도 늘어나는 개수를 표로 적어 이어 더한다"]
    },
    pitfall: "몇 번째 묶음인지 찾을 때는 삼각수가 처음으로 그 자리 이상이 되는 곳을 찾습니다.",
    example: {
      prompt: "1, 2, 2, 3, 3, 3, 4, 4, 4, 4, …처럼 늘어놓을 때 30번째 수를 구하세요.",
      figure: figTriangle,
      steps: [
        { ask: "7이 끝나는 자리(7번째 삼각수)는?", answer: "28", unit: "번째", why: "1 + 2 + … + 7 = 28입니다.", hint: "(1 + 7) × 7 ÷ 2" },
        { ask: "30번째 수는?", answer: "8", why: "29번째부터 36번째까지가 8이므로 30번째는 8입니다.", hint: "28 다음 묶음" }
      ]
    },
    check: [["c2-figurate-number", "concept"], ["c2-group-rows", "type"], ["c2-figurate-number", "advanced"]]
  }],
  "2/1": [{
    id: "digit-count", title: "숫자의 개수와 합 — 자릿수로 나누어 세기",
    recall: { figure: board(["1 … 9 → 9개", "10 … 99 → 90개 × 2"]), text: "두 자리 수는 10부터 99까지 90개이고, 하나에 숫자가 2개씩 있습니다.", ask: "10부터 99까지 쓸 때 숫자는 모두 몇 개?", options: ["180개", "90개", "99개"], answer: 0, why: "90 × 2 = 180이에요.", hint: "90 × 2" },
    explore: [["drill", "digits", "숫자 세기 연습"]],
    proofs: [],
    summary: {
      figure: board(["1~9: 9개", "10~99: 180개", "100~999: 2700개"]),
      terms: [["숫자의 개수", "쓴 수의 개수가 아니라 쓴 글자(0~9)의 개수"]],
      facts: ["자릿수가 같은 수끼리 묶어 <b>(개수 × 자릿수)</b>를 더한다", "□부터 ○까지의 개수 = ○ − □ + 1", "쓴 숫자 수로 쪽수 찾기: 9, 180을 빼 가며 몇 자리 쪽까지 썼는지 본다"]
    },
    pitfall: "100부터 150까지는 50개가 아니라 51개입니다(양 끝을 모두 셉니다).",
    example: {
      prompt: "1부터 150까지의 자연수를 모두 쓸 때 숫자는 모두 몇 개 쓰나요?",
      figure: board(["1 2 … 9 | 10 … 99 | 100 … 150"]),
      steps: [
        { ask: "두 자리 수(10~99)에서 쓰는 숫자는?", answer: "180", unit: "개", why: "90개 × 2입니다.", hint: "90 × 2" },
        { ask: "세 자리 수(100~150)에서 쓰는 숫자는?", answer: "153", unit: "개", why: "51개 × 3 = 153입니다.", hint: "51 × 3" },
        { ask: "모두 몇 개?", answer: "342", unit: "개", why: "9 + 180 + 153 = 342입니다.", hint: "9 + 180 + 153" }
      ]
    },
    check: [["c2-digit-count", "concept"], ["c2-digit-count", "type"], ["c2-digit-count", "advanced"]]
  }],
  "2/2": [{
    id: "digit-occurrence", title: "수와 숫자의 개수 — 어떤 숫자가 몇 번",
    recall: { figure: board(["1, 11, 21, …, 91 → 일의 자리 1", "10 … 19 → 십의 자리 1"]), text: "어떤 숫자가 몇 번 나오는지는 일의 자리·십의 자리·백의 자리를 따로 셉니다.", ask: "1부터 99까지 일의 자리에 1이 나오는 수는 몇 개?", options: ["10개", "9개", "11개"], answer: 0, why: "1, 11, 21, …, 91이에요.", hint: "1, 11, 21 …" },
    explore: [["drill", "digits", "숫자 세기 연습"]],
    proofs: [],
    summary: {
      figure: board(["일의 자리 · 십의 자리 · 백의 자리 따로"]),
      terms: [["자리마다 세기", "한 자리씩 고정하고 나머지 자리가 몇 가지인지 센다"]],
      facts: ["1~99에서 숫자 1~9는 각 자리에 <b>10번씩</b>, 모두 20번", "11처럼 한 수에 두 번 들어 있으면 두 번 센다", "0은 맨 앞에 쓰지 않으니 따로 조심한다"]
    },
    pitfall: "「숫자 1이 들어 있는 수의 개수」와 「숫자 1을 쓴 횟수」는 다릅니다.",
    example: {
      prompt: "1부터 99까지의 자연수를 모두 쓸 때 숫자 7은 모두 몇 번 쓰나요?",
      figure: board(["7, 17, 27, … · 70 … 79"]),
      steps: [
        { ask: "일의 자리에 7을 쓰는 횟수는?", answer: "10", unit: "번", why: "7, 17, …, 97로 10번입니다.", hint: "7, 17, 27 …" },
        { ask: "십의 자리에 7을 쓰는 횟수는?", answer: "10", unit: "번", why: "70부터 79까지 10번입니다.", hint: "70 … 79" },
        { ask: "모두 몇 번?", answer: "20", unit: "번", why: "77은 두 번 센 것이 맞습니다. 10 + 10 = 20입니다.", hint: "10 + 10" }
      ]
    },
    check: [["c2-digit-count", "concept"], ["c2-digit-count", "type"], ["c2-digit-position", "advanced"]]
  }],
  "2/3": [{
    id: "digit-position", title: "마지막 수와 숫자 구하기 — 이어 쓴 숫자의 자리",
    recall: { figure: board(["123456789 1011 1213 …"]), text: "1부터 이어 쓰면 한 자리 수 9개가 숫자 9개를 차지하고, 그다음부터 두 자리 수가 2개씩 차지합니다.", ask: "10번째 숫자는?", options: ["1", "0", "9"], answer: 0, why: "10의 첫 숫자 1이에요.", hint: "9 다음" },
    explore: [["drill", "digits", "숫자 세기 연습"]],
    proofs: [],
    summary: {
      figure: board(["9개 → 180개 → 2700개"]),
      terms: [["자리 찾기", "자릿수별로 차지하는 숫자 수를 빼 가며 범위를 좁힌다"]],
      facts: ["□번째 숫자: 9를 빼고, 180을 빼고 … 남은 수로 <b>몇 자리 수 부분</b>인지 정한다", "두 자리 부분의 ○번째 숫자 → (○ − 1) ÷ 2의 몫만큼 10에서 뒤로", "나머지로 그 수의 몇 번째 숫자인지 본다"]
    },
    pitfall: "두 자리 부분의 첫 수는 10입니다. 몫만큼 10에 더해야 그 수가 나옵니다.",
    example: {
      prompt: "1부터 자연수를 이어 써서 1234567891011…을 만들었습니다. 왼쪽부터 100번째 숫자를 구하세요.",
      figure: board(["123456789 | 10 11 12 … "]),
      steps: [
        { ask: "한 자리 수 9개를 빼면 두 자리 부분의 몇 번째 숫자?", answer: "91", unit: "번째", why: "100 − 9 = 91입니다.", hint: "100 − 9" },
        { ask: "그 숫자가 들어 있는 두 자리 수는?", answer: "55", why: "(91 − 1) ÷ 2 = 45이므로 10 + 45 = 55입니다.", hint: "10 + 45" },
        { ask: "100번째 숫자는?", answer: "5", why: "나머지가 0이라 55의 첫 번째 숫자 5입니다.", hint: "55의 첫 숫자" }
      ]
    },
    check: [["c2-digit-position", "concept"], ["c2-digit-position", "type"], ["c2-digit-position", "advanced"]]
  }],
  "3/1": [{
    id: "card-count", title: "크기 순으로 배열하기 — 숫자 카드로 만든 수",
    recall: { figure: figCards, text: "숫자 카드로 수를 만들 때는 높은 자리부터 하나씩 정하며 가짓수를 곱합니다.", ask: "카드 1, 2, 3으로 만드는 두 자리 수는 몇 개?", options: ["6개", "3개", "9개"], answer: 0, why: "십의 자리 3가지 × 일의 자리 2가지예요.", hint: "3 × 2" },
    explore: [["drill", "paths", "경우의 수 연습"]],
    proofs: [],
    summary: {
      figure: figCards,
      terms: [["가짓수 곱하기", "자리마다 고를 수 있는 가짓수를 곱한다"]],
      facts: ["카드 4장으로 세 자리 수: 4 × 3 × 2 = <b>24</b>개", "0이 있으면 맨 앞에 올 수 없다 — 맨 앞 자리부터 가짓수를 센다", "크기 순서: 맨 앞 숫자가 같은 묶음씩 세어 몇 번째인지 찾는다"]
    },
    pitfall: "0을 맨 앞에 놓은 「012」는 세 자리 수가 아닙니다.",
    example: {
      prompt: "숫자 카드 0, 1, 2, 3 중 3장을 골라 만들 수 있는 세 자리 수는 몇 개인가요?",
      figure: () => svg(300, 70, ["0", "1", "2", "3"].map((v, i) => rect(20 + i * 56, 12, 44, 46, { fill: "#fff" }) + text(42 + i * 56, 35, v, { size: 20 })).join(""), "숫자 카드"),
      steps: [
        { ask: "백의 자리에 올 수 있는 카드는 몇 가지?", answer: "3", unit: "가지", why: "0을 뺀 1, 2, 3입니다.", hint: "0은 안 됨" },
        { ask: "십의 자리는? (남은 카드)", answer: "3", unit: "가지", why: "0을 포함해 남은 3장입니다.", hint: "남은 3장" },
        { ask: "모두 몇 개?", answer: "18", unit: "개", why: "3 × 3 × 2 = 18입니다.", hint: "3 × 3 × 2" }
      ]
    },
    check: [["digit-card-number-enumeration", "concept"], ["digit-card-ranked-number", "type"], ["digit-card-number-enumeration", "advanced"]]
  }],
  "3/2": [{
    id: "shortest-path", title: "최단거리의 가짓수 — 갈림길마다 더하기",
    recall: { figure: figPaths(false), text: "오른쪽과 아래로만 가는 길에서는, 한 점까지 오는 방법 수 = 왼쪽 점까지 + 위 점까지 오는 방법 수입니다.", ask: "맨 윗줄의 점들까지 오는 방법은 각각?", options: ["1가지", "2가지", "점마다 다르다"], answer: 0, why: "오른쪽으로만 쭉 가는 한 가지예요.", hint: "한 줄로만" },
    explore: [["drill", "paths", "경우의 수 연습"]],
    proofs: [],
    summary: {
      figure: figPaths(false),
      terms: [["최단 경로", "되돌아가지 않고(오른쪽·아래로만) 가는 길"]],
      facts: ["가장자리 점은 모두 <b>1</b>", "안쪽 점 = 왼쪽 점의 수 + 위 점의 수", "B에 적힌 수가 가장 짧은 길의 가짓수"]
    },
    pitfall: "갈 수 없는 길이 있으면 그 점에는 0을 적고 다시 더해 나갑니다.",
    example: {
      prompt: "가로 3칸, 세로 2칸인 바둑판 길에서 A(왼쪽 위)부터 B(오른쪽 아래)까지 가장 짧은 길은 몇 가지인가요?",
      figure: figPaths(false),
      steps: [
        { ask: "가운데 줄 둘째 점(오른쪽 1칸·아래 1칸)은?", answer: "2", why: "왼쪽 1 + 위 1 = 2입니다.", hint: "1 + 1" },
        { ask: "가운데 줄 마지막 점은?", answer: "4", why: "1, 2, 3, 4로 더해 나갑니다.", hint: "3 + 1" },
        { ask: "B까지는?", answer: "10", unit: "가지", why: "맨 아랫줄은 1, 3, 6, 10입니다.", hint: "6 + 4" }
      ]
    },
    check: [["shortest-path-rectangle", "concept"], ["shortest-path-rectangle", "type"], ["shortest-path-rectangle", "advanced"]]
  }],
  "3/3": [{
    id: "blocked-path", title: "갈 수 없는 길의 최단거리",
    recall: { figure: figPaths(true), text: "지나지 못하는 점이 있으면, 전체 방법 수에서 그 점을 지나는 방법 수를 빼도 됩니다.", ask: "A에서 가운데 점까지 가는 방법이 2가지, 가운데 점에서 B까지 2가지라면 가운데를 지나는 방법은?", options: ["4가지", "2가지", "6가지"], answer: 0, why: "2 × 2 = 4예요.", hint: "곱하기" },
    explore: [["drill", "paths", "경우의 수 연습"]],
    proofs: [],
    summary: {
      figure: figPaths(true),
      terms: [["빼서 세기", "전체 − 막힌 곳을 지나는 길"]],
      facts: ["막힌 점을 지나는 길 = (A → 그 점) × (그 점 → B)", "막힌 점에 0을 적고 더해 나가도 같은 답", "연못·공사 구간처럼 큰 곳은 0을 적는 방법이 편하다"]
    },
    pitfall: "막힌 「점」과 막힌 「길(선분)」은 다릅니다. 선분이 막히면 그 선분으로 들어오는 수만 빼고 더합니다.",
    example: {
      prompt: "가로 2칸, 세로 2칸인 바둑판 길에서 가운데 점을 지나지 못할 때, A에서 B까지 가장 짧은 길은 몇 가지인가요?",
      figure: figPaths(true),
      steps: [
        { ask: "막힘이 없을 때 전체는?", answer: "6", unit: "가지", why: "윗줄 1, 2와 아랫줄 1, 3, 6으로 더해 가면 6입니다.", hint: "2칸 × 2칸" },
        { ask: "가운데 점을 지나는 길은?", answer: "4", unit: "가지", why: "A → 가운데 2가지 × 가운데 → B 2가지입니다.", hint: "2 × 2" },
        { ask: "답은?", answer: "2", unit: "가지", why: "6 − 4 = 2입니다(가장자리로만 도는 두 길).", hint: "6 − 4" }
      ]
    },
    check: [["shortest-path-irregular-grid", "concept"], ["shortest-path-irregular-grid", "type"], ["shortest-path-diagonal-shortcut-book5", "advanced"]]
  }]
};
