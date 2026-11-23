// 2과정 A2 「복제수와 님게임」 개념 꾸러미(DESIGN-COURSE2.md 4절). 열쇠 「단원 번호(0부터)/차시(1부터)」.
// 예제는 새로 지은 문제라 단계 답을 이 파일에 둔다(교재 문항·답이 아니다).
// 글 속 거듭제곱은 「2^6」으로 쓰면 화면·인쇄에서 수식으로 바뀐다(course2-pack.js · course2-pack-print.js의 mathText).
import { svg, text, rect, circle, P, INK, GREEN, SOFT, YELLOW, formulas, mathLabel, card, SHADOW } from "./pack-kit.js?v=20261123b";

const label = (x, y, t, o = {}) => mathLabel(x, y, t, { size: 13, color: "#56627f", ...o });
const board = (lines) => () => formulas(lines);
const figPairs = () => {
  let body = "";
  for (let i = 0; i < 4; i += 1) body += card(14 + i * 74, 18, 64, 34, "2 × 5", { fill: YELLOW, color: "#b89a4a", size: 15 });
  body += card(14, 66, 64, 30, "2 × 2", { size: 15 });
  return svg(320, 110, body + label(220, 82, "짝마다 10 — 남는 것만 계산"), "2와 5의 짝");
};
const figOddSquare = () => {
  let body = "";
  for (let r = 0; r < 5; r += 1) for (let c = 0; c < 5; c += 1) body += circle(P(20 + c * 22, 20 + r * 22), 8, { fill: Math.max(r, c) % 2 ? YELLOW : SOFT, color: GREEN, width: 1.4 });
  return svg(300, 130, body + label(210, 40, "1 + 3 = 2 × 2") + label(210, 66, "+ 5 = 3 × 3") + label(210, 92, "+ 7 = 4 × 4"), "홀수만큼 둘러 커지는 정사각형");
};
const figNim = () => {
  let body = "";
  for (let g = 0; g < 3; g += 1) body += rect(58 + g * 96, 16, 92, 36, { fill: "#eef5ef", color: GREEN, width: 1.2, rx: 8, dash: "4 3" });
  for (let i = 0; i < 12; i += 1) body += `<circle cx="${20 + i * 24}" cy="34" r="9" fill="${i < 2 ? YELLOW : "#fff"}" stroke="#4d6b5a" stroke-width="1.3" ${SHADOW}/>`;
  return svg(360, 80, body + label(180, 66, "처음 2개 → 그다음은 둘이 합해 4개씩"), "님게임 묶음");
};
const figWeek = () => {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return svg(330, 76, days.map((d, i) => card(10 + i * 44, 14, 40, 30, d, { fill: i === 2 ? YELLOW : "#fff", size: 15, ink: i === 0 ? "#b4512e" : i === 6 ? "#2f5f8a" : "#24302b" })).join("") + label(165, 62, "7일마다 같은 요일 — 나머지만큼 옮긴다"), "요일");
};
const figTable = () => {
  const rows = [["", "A", "B", "C"], ["처음", "?", "?", "?"], ["1판 뒤", "", "", ""], ["2판 뒤", "", "", ""], ["3판 뒤", "16", "16", "16"]];
  return svg(300, 160, rows.map((row, r) => row.map((v, c) => rect(10 + c * 70, 6 + r * 30, 70, 30, { fill: r === 0 || c === 0 ? SOFT : "#fff", width: 1.2 }) + text(45 + c * 70, 21 + r * 30, v, { size: 14 })).join("")).join(""), "거꾸로 채우는 표");
};

export const PACKS = {
  "0/1": [{
    id: "power-ten", title: "10의 거듭제곱 — 2와 5의 짝",
    recall: { figure: board(["2 × 5 = 10", "4 × 25 = 100", "8 × 125 = 1000"]), text: "2와 5를 곱하면 10이 됩니다. 10을 여러 번 곱한 것을 10의 거듭제곱이라 하고 10^3처럼 씁니다.", ask: "10^3은?", options: ["1000", "30", "100"], answer: 0, why: "10을 세 번 곱하면 1000이에요.", hint: "10 × 10 × 10" },
    explore: [["drill", "powers", "10의 거듭제곱 연습"]],
    proofs: [],
    summary: {
      figure: figPairs,
      terms: [["거듭제곱", "같은 수를 여러 번 곱한 것 — 2^4 = 2 × 2 × 2 × 2"]],
      facts: ["2와 5를 하나씩 짝지을 때마다 <b>10</b>이 하나", "끝자리 0의 개수 = <b>짝의 수</b>(2와 5 중 적은 쪽의 개수)", "자릿수 = 남은 수의 자릿수 + 0의 개수"]
    },
    pitfall: "2^6은 2 × 6이 아닙니다. 2를 여섯 번 곱한 것입니다.",
    example: {
      prompt: "2^6 × 5^4를 계산하면 몇 자리 수인가요?",
      figure: figPairs,
      steps: [
        { ask: "2와 5를 몇 쌍 짝지을 수 있나요?", answer: "4", unit: "쌍", why: "5가 4개뿐이라 4쌍입니다.", hint: "적은 쪽" },
        { ask: "짝이 안 된 수(2 × 2)는?", answer: "4", why: "2가 두 개 남아 4입니다.", hint: "2 × 2" },
        { ask: "4 × 10^4는 몇 자리 수?", answer: "5", unit: "자리", why: "40000 — 4 뒤에 0이 4개라 5자리입니다.", hint: "40000" }
      ]
    },
    check: [["c2-smart-regroup", "concept"], ["c2-power-ten-zeros", "type"], ["c2-power-ten-zeros", "advanced"]]
  }],
  "0/2": [{
    id: "clone-numbers", title: "복제수와 수 피라미드",
    recall: { figure: board(["9 = 10 − 1", "99 = 100 − 1", "999 = 1000 − 1"]), text: "같은 숫자가 되풀이된 수(99, 111 …)를 복제수라 합니다. 9로만 된 수는 10의 거듭제곱보다 1 작습니다.", ask: "9999는?", options: ["10000 − 1", "1000 − 1", "9000 + 1"], answer: 0, why: "9999 + 1 = 10000이에요.", hint: "1을 더하면" },
    explore: [["drill", "clone", "복제수 연습"]],
    proofs: [],
    summary: {
      figure: board(["11 × 11 = 121", "111 × 111 = 12321", "1111 × 1111 = 1234321"]),
      terms: [["복제수", "같은 숫자로만 된 수"]],
      facts: ["□ × 99…9 = □ × 100…0 − □", "11을 곱할 때는 11 = 10 + 1로 나누어 더한다", "1로만 된 수의 제곱은 1, 2, 3 …으로 올라갔다가 내려온다(받아올림 전까지)"]
    },
    pitfall: "1로만 된 수가 열 자리를 넘으면 받아올림이 생겨 피라미드 모양이 깨집니다.",
    example: {
      prompt: "37 × 999를 간편하게 계산하세요.",
      figure: board(["999 = 1000 − 1"]),
      steps: [
        { ask: "37 × 1000은?", answer: "37000", why: "1000을 곱하면 뒤에 0이 3개 붙습니다.", hint: "0 세 개" },
        { ask: "37 × 999 = 37000 − □ 의 □는?", answer: "37", why: "999는 1000보다 1 작으니 37을 한 번 덜 더한 것입니다.", hint: "37 × 1" },
        { ask: "답은?", answer: "36963", why: "37000 − 37 = 36963입니다.", hint: "37000 − 37" }
      ]
    },
    check: [["c2-nines-product", "concept"], ["c2-repunit-square", "type"], ["c2-repunit-square", "advanced"]]
  }],
  "0/3": [{
    id: "regroup", title: "10, 100, 1000 …의 활용 — 짝 지어 간편 계산",
    recall: { figure: board(["4 × 25 = 100", "8 × 125 = 1000"]), text: "곱셈은 순서를 바꾸어 곱해도 값이 같습니다.", ask: "4 × 7 × 25 = 7 × (4 × 25)?", options: ["맞다", "틀리다"], answer: 0, why: "곱하는 순서만 바꾼 것이에요.", hint: "순서 바꾸기" },
    explore: [["drill", "powers", "10의 거듭제곱 연습"]],
    proofs: [],
    summary: {
      figure: board(["4 × 37 × 25", "= 37 × (4 × 25)", "= 37 × 100 = 3700"]),
      terms: [["간편 계산", "10, 100, 1000이 되는 짝을 먼저 곱하기"]],
      facts: ["짝: <b>2 × 5</b> · <b>4 × 25</b> · <b>8 × 125</b> · <b>16 × 625</b>", "÷ 25는 × 4 ÷ 100, ÷ 125는 × 8 ÷ 1000과 같다", "곱하는 수를 쪼개어 짝을 만든다(36 × 25 = 9 × 4 × 25)"]
    },
    pitfall: "나눗셈은 순서를 마음대로 바꿀 수 없습니다. 나누는 수와 나뉘는 수에 같은 수를 곱해 바꿉니다.",
    example: {
      prompt: "36 × 25를 간편하게 계산하세요.",
      figure: board(["36 × 25 = 9 × 4 × 25"]),
      steps: [
        { ask: "36 = 9 × □ 의 □는?", answer: "4", why: "25와 짝이 되는 4를 꺼냅니다.", hint: "25의 짝" },
        { ask: "4 × 25는?", answer: "100", why: "짝을 먼저 곱합니다.", hint: "100" },
        { ask: "답은?", answer: "900", why: "9 × 100 = 900입니다.", hint: "9 × 100" }
      ]
    },
    check: [["c2-smart-regroup", "concept"], ["c2-smart-regroup", "type"], ["c2-smart-regroup", "advanced"]]
  }],
  "1/1": [{
    id: "square-numbers", title: "사각수와 제곱수",
    recall: { figure: figOddSquare, text: "같은 수를 두 번 곱한 수를 제곱수라 합니다. 바둑돌을 정사각형으로 늘어놓은 개수와 같아 사각수라고도 합니다.", ask: "5 × 5는?", options: ["25", "10", "55"], answer: 0, why: "다섯 줄에 다섯 개씩이에요.", hint: "5 × 5" },
    explore: [["drill", "square", "사각수 연습"]],
    proofs: [],
    summary: {
      figure: figOddSquare,
      terms: [["사각수", "1, 4, 9, 16 … — 정사각형으로 늘어놓을 수 있는 수"]],
      facts: ["1부터 연속한 홀수 □개의 합 = <b>□ × □</b>", "마지막 홀수가 ○이면 홀수의 개수는 (○ + 1) ÷ 2", "일의 자리가 5인 수의 제곱: 십의 자리 × (십의 자리 + 1) 뒤에 <b>25</b>"]
    },
    pitfall: "마지막 홀수(19)를 개수로 착각하지 않습니다. 19는 10번째 홀수입니다.",
    example: {
      prompt: "1 + 3 + 5 + … + 19의 값을 구하세요.",
      figure: figOddSquare,
      steps: [
        { ask: "19는 몇 번째 홀수?", answer: "10", unit: "번째", why: "(19 + 1) ÷ 2 = 10입니다.", hint: "(19 + 1) ÷ 2" },
        { ask: "합은?", answer: "100", why: "홀수 10개의 합 = 10 × 10입니다.", hint: "10 × 10" }
      ]
    },
    check: [["c2-odd-sum-square", "concept"], ["c2-odd-sum-square", "type"], ["c2-odd-sum-square", "advanced"]]
  }],
  "1/2": [{
    id: "promise", title: "약속 — 새 연산 기호",
    recall: { figure: board(["가 ◎ 나 = 가 × 나 − (가 + 나)"]), text: "새 기호의 계산 방법을 약속하면, 약속대로 수를 넣어 계산합니다.", ask: "약속대로 4 ◎ 2는? (4 × 2 − (4 + 2))", options: ["2", "6", "8"], answer: 0, why: "8 − 6 = 2예요.", hint: "8 − 6" },
    explore: [],
    proofs: [],
    summary: {
      figure: board(["가 ◎ 나 = 가 × 나 − (가 + 나)"]),
      terms: [["약속", "새 기호의 계산 방법을 정한 식"]],
      facts: ["가·나 자리에 <b>그대로 바꾸어</b> 넣는다", "괄호가 있으면 <b>안쪽 약속부터</b> 계산한다", "약속은 순서를 바꾸면 값이 달라질 수 있다(가 ◇ 나 ≠ 나 ◇ 가)"]
    },
    pitfall: "약속을 두 번 쓰는 식은 안쪽 결과를 다시 「가」 자리에 넣습니다.",
    example: {
      prompt: "가 ◎ 나 = 가 × 나 − (가 + 나)로 약속할 때 (2 ◎ 4) ◎ 3을 구하세요.",
      figure: board(["(2 ◎ 4) ◎ 3"]),
      steps: [
        { ask: "2 ◎ 4는?", answer: "2", why: "2 × 4 − (2 + 4) = 8 − 6 = 2입니다.", hint: "8 − 6" },
        { ask: "2 ◎ 3은?", answer: "1", why: "2 × 3 − (2 + 3) = 6 − 5 = 1입니다.", hint: "6 − 5" }
      ]
    },
    check: [["two-custom-operations", "concept"], ["two-custom-operations", "type"], ["two-custom-operations", "advanced"]]
  }],
  "1/3": [{
    id: "four-fours", title: "포포즈 — 괄호와 연산 기호로 수 만들기",
    recall: { figure: board(["6 + 3 × 4 − 2 = 16"]), text: "괄호가 없으면 곱셈·나눗셈을 덧셈·뺄셈보다 먼저 합니다.", ask: "6 + 3 × 4는?", options: ["18", "36", "13"], answer: 0, why: "3 × 4 = 12를 먼저 해서 6 + 12예요.", hint: "곱셈 먼저" },
    explore: [],
    proofs: [],
    summary: {
      figure: board(["(6 + 3) × 4 − 2 = 34", "(6 + 3) × (4 − 2) = 18"]),
      terms: [["포포즈", "같은 수 네 개와 연산 기호·괄호로 여러 수를 만드는 놀이"]],
      facts: ["괄호 안을 <b>가장 먼저</b> 계산한다", "곱셈 앞뒤를 묶으면 값이 크게 바뀐다", "4 ÷ 4 = 1, 4 − 4 = 0처럼 작은 수를 만드는 묶음을 먼저 찾아 둔다"]
    },
    pitfall: "괄호를 넣을 때 수의 차례는 바꾸지 않습니다.",
    example: {
      prompt: "6 + 3 × 4 − 2에 괄호를 한 쌍 넣어 34를 만드세요.",
      figure: board(["6 + 3 × 4 − 2"]),
      steps: [
        { ask: "괄호 없이 계산하면?", answer: "16", why: "6 + 12 − 2 = 16입니다.", hint: "곱셈 먼저" },
        { ask: "(6 + 3) × 4 − 2는?", answer: "34", why: "9 × 4 − 2 = 36 − 2 = 34입니다.", hint: "9 × 4 − 2" }
      ]
    },
    check: [["c2-bracket-insert", "concept"], ["consecutive-sign-insertion", "type"], ["sign-insertion-triple-unit-test-book6", "advanced"]]
  }],
  "2/1": [{
    id: "year-shift", title: "율리우스력과 그레고리력 — 해가 바뀔 때의 요일",
    recall: { figure: figWeek, text: "1년은 365일(윤년은 366일)입니다. 365 = 7 × 52 + 1입니다.", ask: "365를 7로 나눈 나머지는?", options: ["1", "0", "2"], answer: 0, why: "7 × 52 = 364라서 1이 남아요.", hint: "7 × 52" },
    explore: [["board", "book-07/calendar-weekday"], ["drill", "calendar", "달력 연습"]],
    proofs: [],
    summary: {
      figure: figWeek,
      terms: [["윤년", "2월이 29일인 해 — 4로 나누어떨어지는 해(100의 배수는 400의 배수일 때만)"]],
      facts: ["평년이 지나면 요일이 <b>하루</b>, 윤년이 지나면 <b>이틀</b> 밀린다", "평년에는 1월 1일의 요일이 53번, 윤년에는 1월 1일과 1월 2일의 요일이 53번", "여러 해는 밀린 날 수를 모두 더해 7로 나눈 나머지만큼 옮긴다"]
    },
    pitfall: "어느 해의 윤년 여부는 지나가는 그해를 봅니다(2024년 1월 1일 → 2025년 1월 1일은 2024년이 윤년이라 이틀).",
    example: {
      prompt: "2023년 1월 1일은 일요일입니다. 2024년 1월 1일과 2025년 1월 1일은 각각 무슨 요일인가요?",
      figure: figWeek,
      steps: [
        { ask: "2023년은 평년 — 2024년 1월 1일은 ○요일?", answer: "월", unit: "요일", text: true, why: "하루 밀려 월요일입니다.", hint: "하루" },
        { ask: "2024년은 윤년 — 2025년 1월 1일은 ○요일?", answer: "수", unit: "요일", text: true, why: "이틀 밀려 수요일입니다.", hint: "이틀" }
      ]
    },
    check: [["c2-year-weekday-shift", "concept"], ["c2-year-weekday-shift", "type"], ["c2-year-weekday-shift", "advanced"]]
  }],
  "2/2": [{
    id: "calendar-weekday", title: "달력과 요일 — 7로 나눈 나머지",
    recall: { figure: figWeek, text: "같은 요일은 7일마다 돌아옵니다.", ask: "화요일에서 14일 뒤는?", options: ["화요일", "수요일", "목요일"], answer: 0, why: "14는 7의 배수예요.", hint: "7 × 2" },
    explore: [["board", "book-07/calendar-next-month-source"], ["drill", "calendar", "달력 연습"]],
    proofs: [],
    summary: {
      figure: figWeek,
      terms: [["며칠 뒤", "오늘을 빼고 센 날 수"]],
      facts: ["며칠 뒤 ÷ 7의 <b>나머지</b>만큼 요일을 옮긴다", "달을 건너갈 때는 그달의 날 수(30·31·28·29)를 더한다", "같은 요일의 날짜는 7씩 차이 난다 — 한 달에 4번이나 5번"]
    },
    pitfall: "「3월 1일부터 30일 뒤」는 3월 31일입니다. 오늘을 하루로 세지 않습니다.",
    example: {
      prompt: "어느 해 3월 1일은 화요일입니다. 3월 31일과 4월 1일은 각각 무슨 요일인가요?",
      figure: figWeek,
      steps: [
        { ask: "3월 31일은 3월 1일부터 며칠 뒤?", answer: "30", unit: "일", why: "31 − 1 = 30입니다.", hint: "31 − 1" },
        { ask: "30 ÷ 7의 나머지는?", answer: "2", why: "7 × 4 = 28, 30 − 28 = 2입니다.", hint: "7 × 4" },
        { ask: "3월 31일은 ○요일?", answer: "목", unit: "요일", text: true, why: "화요일에서 이틀 뒤 목요일, 4월 1일은 금요일입니다.", hint: "화 → 수 → 목" }
      ]
    },
    check: [["calendar-cross-month-weekday-b7", "concept"], ["weekday-after-days-b7", "type"], ["calendar-weekday-list-ordinal-book5", "advanced"]]
  }],
  "2/3": [{
    id: "nim", title: "100 만들기와 님게임 — 필승 묶음",
    recall: { figure: figNim, text: "두 사람이 번갈아 1개부터 3개까지 가져갈 때, 내가 상대의 수와 합해 4개가 되게 가져가면 한 번 주고받을 때마다 꼭 4개씩 줄어듭니다.", ask: "상대가 3개를 가져가면 나는 몇 개?", options: ["1개", "3개", "4개"], answer: 0, why: "3 + 1 = 4예요.", hint: "합해 4" },
    explore: [["drill", "nim", "님게임 연습"]],
    proofs: [],
    summary: {
      figure: figNim,
      terms: [["필승 묶음", "가져갈 수 있는 가장 큰 수 + 1 — 한 번씩 주고받을 때 이만큼씩 줄인다"]],
      facts: ["마지막 것을 가져가면 이기는 놀이: 전체 ÷ (가장 큰 수 + 1)의 <b>나머지</b>를 처음에 가져간다", "나머지가 0이면 <b>나중에 하는 사람</b>이 이긴다", "마지막 것을 가져가면 지는 놀이: 상대에게 1개를 남기도록 (전체 − 1)로 셈한다"]
    },
    pitfall: "처음에 가져간 다음부터는 늘 상대와 합해 묶음 수가 되게 해야 합니다. 한 번이라도 어기면 필승이 깨집니다.",
    example: {
      prompt: "바둑돌 30개를 두 사람이 번갈아 1개부터 3개까지 가져갑니다. 마지막 바둑돌을 가져가는 사람이 이길 때, 먼저 하는 사람은 처음에 몇 개를 가져가야 하나요?",
      figure: figNim,
      steps: [
        { ask: "필승 묶음(3 + 1)은?", answer: "4", unit: "개", why: "한 번씩 주고받을 때 4개씩 줄입니다.", hint: "3 + 1" },
        { ask: "30 ÷ 4의 나머지는?", answer: "2", why: "4 × 7 = 28, 30 − 28 = 2입니다.", hint: "4 × 7" },
        { ask: "처음에 가져갈 개수는?", answer: "2", unit: "개", why: "2개를 가져가면 28개(4의 배수)가 남아 늘 맞출 수 있습니다.", hint: "나머지" }
      ]
    },
    check: [["c2-nim-strategy", "concept"], ["c2-nim-strategy", "type"], ["c2-nim-strategy", "advanced"]]
  }],
  "3/1": [{
    id: "reverse", title: "거꾸로 생각하기 — 절반보다 많게·적게",
    recall: { figure: board(["? → − 절반 → 남은 것"]), text: "마지막 결과를 알고 처음을 찾을 때는 마지막에서부터 거꾸로, 한 일을 반대로 합니다.", ask: "절반을 쓰고 30이 남았으면 처음은?", options: ["60", "15", "30"], answer: 0, why: "남은 것도 절반이니 두 배예요.", hint: "× 2" },
    explore: [["board", "book-08/reverse-operation-chain"], ["drill", "reverse", "거꾸로 풀기 연습"]],
    proofs: [],
    summary: {
      figure: board(["절반보다 □ 적게 썼다 → 남은 것 = 절반 + □", "절반보다 □ 많이 썼다 → 남은 것 = 절반 − □"]),
      terms: [["거꾸로 풀기", "끝에서부터 한 일을 반대로(더하기 ↔ 빼기, 곱하기 ↔ 나누기)"]],
      facts: ["「절반보다 □ 적게 썼다」 → 쓰기 전 = (남은 것 − □) × 2", "「절반보다 □ 많이 썼다」 → 쓰기 전 = (남은 것 + □) × 2", "구한 처음 값으로 앞에서부터 다시 해 보아 확인한다"]
    },
    pitfall: "「적게 썼다」면 남은 것이 절반보다 많습니다. 더하고 빼는 방향을 그림으로 확인합니다.",
    example: {
      prompt: "첫 번째 가게에서 가진 돈의 절반보다 300원 더 많이 쓰고, 두 번째 가게에서 남은 돈의 절반보다 100원 적게 썼더니 600원이 남았습니다. 처음 가진 돈은 얼마인가요?",
      figure: board(["? → 첫 가게 → 두 번째 가게 → 600원"]),
      steps: [
        { ask: "두 번째 가게에 가기 전에는?", answer: "1000", unit: "원", why: "(600 − 100) × 2 = 1000입니다.", hint: "(600 − 100) × 2" },
        { ask: "처음에는?", answer: "2600", unit: "원", why: "(1000 + 300) × 2 = 2600입니다. 2600 → 1000 → 600으로 확인됩니다.", hint: "(1000 + 300) × 2" }
      ]
    },
    check: [["c2-reverse-half-chain", "concept"], ["sequential-fraction-remains-b8", "type"], ["c2-reverse-half-chain", "advanced"]]
  }],
  "3/2": [{
    id: "reverse-table", title: "표 그려 거꾸로 풀기",
    recall: { figure: figTable, text: "여러 사람이 주고받을 때는 표를 그리고, 마지막 줄부터 한 줄씩 위로 채웁니다.", ask: "가진 만큼 받아 두 배가 된 사람의 받기 전은?", options: ["지금의 절반", "지금의 두 배", "지금과 같다"], answer: 0, why: "두 배가 되었으니 절반으로 돌려요.", hint: "÷ 2" },
    explore: [["drill", "reverse", "거꾸로 풀기 연습"]],
    proofs: [],
    summary: {
      figure: figTable,
      terms: [["주고받기 표", "판마다 사람마다 가진 수를 적은 표 — 아래에서 위로 채운다"]],
      facts: ["받은 사람은 <b>절반으로</b>, 준 사람은 준 만큼을 <b>다시 더해</b> 한 줄 위를 채운다", "전체의 합은 주고받아도 그대로 — 줄마다 합을 확인한다", "마지막에 같아졌다면 마지막 줄은 전체 ÷ 사람 수"]
    },
    pitfall: "한 줄을 채울 때 진 사람(준 사람)을 맨 나중에 계산합니다. 다른 사람들이 받은 양을 먼저 알아야 하니까요.",
    example: {
      prompt: "A, B, C가 세 판을 하는데 판마다 진 사람이 나머지 두 사람에게 그들이 가진 만큼씩 구슬을 줍니다. 1판은 A, 2판은 B, 3판은 C가 졌고 끝나고 보니 세 사람 모두 16개였습니다. 처음에 A는 몇 개였나요?",
      figure: figTable,
      steps: [
        { ask: "3판 전 C는? (A·B는 8개씩)", answer: "32", unit: "개", why: "A·B가 받아 16이 되었으니 8씩이었고, C는 16 + 8 + 8 = 32입니다.", hint: "16 + 8 + 8" },
        { ask: "2판 전 B는? (A 4개, C 16개)", answer: "28", unit: "개", why: "8 + 4 + 16 = 28입니다.", hint: "8 + 4 + 16" },
        { ask: "처음 A는? (B 14개, C 8개)", answer: "26", unit: "개", why: "4 + 14 + 8 = 26입니다. 합 26 + 14 + 8 = 48 = 16 × 3으로 확인됩니다.", hint: "4 + 14 + 8" }
      ]
    },
    check: [["reverse-transfer-three-b8", "concept"], ["give-as-much-return-b8", "type"], ["reverse-two-container-transfers-b8", "advanced"]]
  }]
};
