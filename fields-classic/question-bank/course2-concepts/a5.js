// 2과정 A5 「소인수분해와 비」 개념 꾸러미(DESIGN-COURSE2.md 4절). 열쇠 「단원 번호(0부터)/차시(1부터)」.
// 예제는 새로 지은 문제라 단계 답을 이 파일에 둔다(교재 문항·답이 아니다).
// 글 속 분수·거듭제곱은 「3/5」「2^3」으로 쓰면 화면·인쇄에서 수식으로 바뀐다(course2-pack.js · course2-pack-print.js의 mathText).
import { svg, text, rect, circle, line, P, INK, GREEN, SOFT, YELLOW, formulas, mathLabel } from "./pack-kit.js?v=20261122i";

const label = (x, y, t, o = {}) => mathLabel(x, y, t, { size: 13, color: "#56627f", ...o });
const board = (lines) => () => formulas(lines);
const figTree = () => svg(300, 150, text(150, 20, "72", { size: 18, weight: 700 }) + line(P(140, 30), P(110, 56)) + line(P(160, 30), P(190, 56))
  + text(104, 66, "8", { size: 17 }) + text(196, 66, "9", { size: 17 }) + line(P(98, 76), P(80, 100)) + line(P(110, 76), P(126, 100)) + line(P(190, 76), P(176, 100)) + line(P(202, 76), P(218, 100))
  + text(76, 110, "2 × 2", { size: 15 }) + text(130, 110, "2", { size: 15 }) + text(174, 110, "3", { size: 15 }) + text(222, 110, "3", { size: 15 }) + label(150, 138, "72 = 2^3 × 3^2"), "소인수분해 나무");
const figVenn = () => svg(320, 150, rect(10, 10, 300, 130, { fill: "#fff" }) + circle(P(120, 75), 52, { fill: "rgba(230,239,232,.8)" }) + circle(P(195, 75), 52, { fill: "rgba(255,241,191,.7)" })
  + text(95, 75, "11", { size: 16 }) + text(158, 75, "7", { size: 16, weight: 700 }) + text(222, 75, "8", { size: 16 }) + label(285, 128, "4", { anchor: "end" }) + label(80, 20, "축구 18") + label(240, 20, "야구 15"), "두 원이 겹친 그림");
const figBounce = () => svg(320, 150, line(P(10, 130), P(310, 130), { color: "#9aa39e" }) + [81, 54, 36, 24].map((h, i) => rect(30 + i * 70, 130 - h * 1.3, 26, h * 1.3, { fill: i ? YELLOW : SOFT, width: 1.2 }) + text(43 + i * 70, 122 - h * 1.3, `${h}`, { size: 13 })).join(""), "튀어 오른 높이");
const figPond = () => svg(300, 170, rect(20, 70, 260, 90, { fill: "#cfe3f3", color: "#7fa7c9", width: 1.2 }) + rect(90, 20, 14, 140, { fill: YELLOW, width: 1.2 }) + rect(190, 0, 14, 160, { fill: YELLOW, width: 1.2 }) + text(150, 112, "깊이 ?", { size: 15 }), "연못과 두 막대");

export const PACKS = {
  "0/1": [{
    id: "divisibility", title: "배수판정법 — 나누지 않고 배수 알아보기",
    recall: { figure: board(["3의 배수: 각 자리 숫자의 합이 3의 배수", "4의 배수: 끝 두 자리가 4의 배수"]), text: "큰 수가 어떤 수의 배수인지는 끝자리나 각 자리 숫자의 합으로 알아볼 수 있습니다.", ask: "4512는 9의 배수일까요? (4 + 5 + 1 + 2 = 12)", options: ["아니다", "그렇다"], answer: 0, why: "12는 9의 배수가 아니에요.", hint: "자리 숫자의 합" },
    explore: [["drill", "factor", "소인수분해 연습"]],
    proofs: [],
    summary: {
      figure: board(["36 = 4 × 9", "45 = 5 × 9", "72 = 8 × 9"]),
      terms: [["배수판정법", "나누지 않고 끝자리·자리 숫자의 합으로 배수인지 알아보는 방법"]],
      facts: ["2·5: 끝자리 · 4: 끝 두 자리 · 8: 끝 세 자리 · 3·9: 자리 숫자의 합", "36의 배수 = <b>4의 배수이면서 9의 배수</b>(서로 공약수가 1뿐인 두 수로 나눈다)", "빈칸이 둘이면 끝자리 조건으로 먼저 줄이고 합 조건으로 맞춘다"]
    },
    pitfall: "36 = 6 × 6으로 나누면 안 됩니다. 6과 6은 공약수가 6이라 두 판정을 합칠 수 없습니다.",
    example: {
      prompt: "네 자리 수 ㉠56㉡이 36의 배수일 때, 이런 수 가운데 가장 큰 수를 구하세요.",
      figure: board(["㉠ 5 6 ㉡", "36 = 4 × 9"]),
      steps: [
        { ask: "끝 두 자리 6㉡이 4의 배수가 되는 ㉡은 몇 가지? (0·4·8)", answer: "3", unit: "가지", why: "60, 64, 68이 4의 배수입니다.", hint: "60, 64, 68" },
        { ask: "㉡ = 8일 때 ㉠ + 5 + 6 + 8이 9의 배수인 ㉠은?", answer: "8", why: "8 + 5 + 6 + 8 = 27입니다.", hint: "합 27" },
        { ask: "가장 큰 수는?", answer: "8568", why: "㉡ = 8, ㉠ = 8일 때가 가장 크고 8568 = 36 × 238입니다.", hint: "8 5 6 8" }
      ]
    },
    check: [["c2-divisibility-digits", "concept"], ["c2-divisibility-digits", "type"], ["c2-divisibility-digits", "advanced"]]
  }],
  "0/2": [{
    id: "prime-factor", title: "소인수분해와 제곱수",
    recall: { figure: figTree, text: "수를 소수(1과 자기 자신만으로 나누어떨어지는 수)들의 곱으로 나타내는 것을 소인수분해라 합니다.", ask: "12를 소인수분해하면?", options: ["2 × 2 × 3", "3 × 4", "2 × 6"], answer: 0, why: "4와 6은 소수가 아니라 더 쪼개요.", hint: "소수만 남기기" },
    explore: [["drill", "factor", "소인수분해 연습"]],
    proofs: [],
    summary: {
      figure: figTree,
      terms: [["소수", "2, 3, 5, 7, 11 … — 약수가 1과 자기 자신뿐인 수"]],
      facts: ["제곱수 = 소인수분해했을 때 거듭제곱이 <b>모두 짝수 번</b>", "제곱수로 만들려면 홀수 번인 소인수를 하나씩 더 곱한다(또는 나눈다)", "연속한 세 수의 곱은 소인수를 가까운 세 수로 묶어 찾는다"]
    },
    pitfall: "1은 소수가 아닙니다. 소인수분해에 1은 쓰지 않습니다.",
    example: {
      prompt: "72에 가장 작은 자연수를 곱하여 어떤 수의 제곱이 되게 하려고 합니다. 곱할 수와 그때 어떤 수를 구하세요.",
      figure: figTree,
      steps: [
        { ask: "72 = 2^□ × 3^2 의 □는?", answer: "3", why: "72 = 2 × 2 × 2 × 3 × 3입니다.", hint: "2가 몇 번" },
        { ask: "곱할 가장 작은 수는?", answer: "2", why: "2가 홀수 번(3번)이라 하나 더 곱해 4번으로 만듭니다.", hint: "홀수 번인 소인수" },
        { ask: "72 × 2 = 144 = □ × □ 의 □는?", answer: "12", why: "2^4 × 3^2 = (2^2 × 3) × (2^2 × 3) = 12 × 12입니다.", hint: "12 × 12" }
      ]
    },
    check: [["c2-square-multiplier", "concept"], ["c2-consecutive-product", "type"], ["c2-square-multiplier", "advanced"]]
  }],
  "0/3": [{
    id: "factorial-zeros", title: "10의 거듭제곱과 팩토리얼 — 끝자리 0 세기",
    recall: { figure: board(["10 = 2 × 5", "1 × 2 × 3 × 4 × 5 = 120"]), text: "1부터 N까지 모두 곱한 수를 N!(N 팩토리얼)이라 씁니다. 끝자리 0은 2 × 5가 하나 생길 때마다 하나 붙습니다.", ask: "5! = 120의 끝자리 0은?", options: ["1개", "2개", "0개"], answer: 0, why: "5가 한 번 들어 있어요.", hint: "5의 개수" },
    explore: [["drill", "factor", "소인수분해 연습"]],
    proofs: [],
    summary: {
      figure: board(["0의 개수 = 5의 개수", "N ÷ 5 + N ÷ 25 + N ÷ 125 … (몫)"]),
      terms: [["팩토리얼", "N! = 1 × 2 × … × N"]],
      facts: ["2는 5보다 늘 많으니 <b>5의 개수</b>만 센다", "25의 배수에는 5가 두 번, 125의 배수에는 세 번 — 몫을 차례로 더한다", "2^a × 5^b의 끝자리 0은 a와 b 중 작은 수만큼"]
    },
    pitfall: "N ÷ 5의 몫만 세면 25, 50, 75 …에 숨은 5를 하나씩 빠뜨립니다.",
    example: {
      prompt: "100!(1 × 2 × … × 100)의 끝자리에는 0이 몇 개 이어지나요?",
      figure: board(["100 ÷ 5 = 20", "100 ÷ 25 = 4"]),
      steps: [
        { ask: "100까지 5의 배수는 몇 개?", answer: "20", unit: "개", why: "100 ÷ 5 = 20입니다.", hint: "100 ÷ 5" },
        { ask: "그중 25의 배수(5가 하나 더)는?", answer: "4", unit: "개", why: "25, 50, 75, 100입니다.", hint: "100 ÷ 25" },
        { ask: "끝자리 0은 모두 몇 개?", answer: "24", unit: "개", why: "20 + 4 = 24입니다.", hint: "20 + 4" }
      ]
    },
    check: [["c2-factorial-zeros", "concept"], ["c2-power-ten-zeros", "type"], ["c2-factorial-zeros", "advanced"]]
  }],
  "1/1": [{
    id: "equivalent", title: "크기가 같은 분수 — 조건으로 찾기",
    recall: { figure: board(["2/3 = 4/6 = 6/9 = …"]), text: "분자와 분모에 같은 수를 곱하면 크기가 같은 분수가 됩니다.", ask: "2/3과 크기가 같은 것은?", options: ["10/15", "10/12", "3/4"], answer: 0, why: "분자·분모에 5를 곱했어요.", hint: "× 5" },
    explore: [["drill", "fraction", "분수 연습"]],
    proofs: [],
    summary: {
      figure: board(["2/3 = (2 × □)/(3 × □)"]),
      terms: [["기약분수", "더 약분할 수 없는 분수"]],
      facts: ["2/3과 크기가 같은 분수 = 분자 2 × □, 분모 3 × □ — 합은 (2 + 3) × □, 차는 (3 − 2) × □", "분자와 분모에 <b>같은 수를 더하면</b> 크기는 바뀌지만 <b>차는 그대로</b>", "두 조건을 함께 만족하는 분수는 한 조건으로 후보를 쓰고 다른 조건으로 고른다"]
    },
    pitfall: "분자·분모에 같은 수를 더하는 것과 곱하는 것은 다릅니다. 더하면 크기가 달라집니다.",
    example: {
      prompt: "2/3과 크기가 같고, 분모와 분자의 합이 45인 분수를 구하세요.",
      figure: board(["2/3 = (2 × □)/(3 × □)"]),
      steps: [
        { ask: "2 × □ + 3 × □ = 5 × □ = 45 — □는?", answer: "9", why: "45 ÷ 5 = 9입니다.", hint: "45 ÷ 5" },
        { ask: "구하는 분수는? (분수로)", answer: "18/27", text: true, why: "2 × 9 = 18, 3 × 9 = 27입니다.", hint: "2 × 9, 3 × 9" }
      ]
    },
    check: [["c2-equivalent-condition", "concept"], ["c2-equivalent-condition", "type"], ["c2-equivalent-condition", "advanced"]]
  }],
  "1/2": [{
    id: "partial-fraction", title: "부분분수 — 쪼개서 지우기",
    recall: { figure: board(["1/2 − 1/3 = 3/6 − 2/6 = 1/6"]), text: "1/2 − 1/3은 1/6이고, 6 = 2 × 3입니다.", ask: "1/3 − 1/4은?", options: ["1/12", "1/7", "1/1"], answer: 0, why: "4/12 − 3/12 = 1/12, 12 = 3 × 4예요.", hint: "통분" },
    explore: [["drill", "fraction", "분수 연습"]],
    proofs: [],
    summary: {
      figure: board(["1/(□ × (□ + 1))", "= 1/□ − 1/(□ + 1)"]),
      terms: [["부분분수", "하나의 분수를 두 분수의 차로 쪼갠 것"]],
      facts: ["이웃한 두 수의 곱이 분모이면 <b>1/(앞 수) − 1/(뒤 수)</b>로 쪼갠다", "차례로 쓰면 가운데 항이 지워져 <b>처음과 끝</b>만 남는다", "두 수의 차가 2, 3이면 쪼갠 값을 2, 3으로 나눈다"]
    },
    pitfall: "지워지지 않고 남는 것은 맨 앞의 1/(첫 수)와 맨 뒤의 1/(끝 수)뿐입니다. 끝 수를 잘못 읽지 않습니다.",
    example: {
      prompt: "1/(1 × 2) + 1/(2 × 3) + … + 1/(9 × 10)을 계산하세요.",
      figure: board(["(1/1 − 1/2)", "+ (1/2 − 1/3)", "+ … + (1/9 − 1/10)"]),
      steps: [
        { ask: "1/(2 × 3) = 1/2 − 1/□ 의 □는?", answer: "3", why: "1/2 − 1/3 = 1/6입니다.", hint: "1/6" },
        { ask: "모두 지우고 남는 식 1 − 1/□ 의 □는?", answer: "10", why: "맨 앞 1/1과 맨 뒤 1/10만 남습니다.", hint: "끝 수" },
        { ask: "답은? (분수로)", answer: "9/10", text: true, why: "1 − 1/10 = 9/10입니다.", hint: "10/10 − 1/10" }
      ]
    },
    check: [["c2-partial-fraction-sum", "concept"], ["c2-partial-fraction-sum", "type"], ["c2-partial-fraction-sum", "advanced"]]
  }],
  "1/3": [{
    id: "fraction-decimal", title: "분수와 소수 — 수직선 위의 자리",
    recall: { figure: board(["1/4 = 0.25", "1/2 = 0.5", "3/4 = 0.75"]), text: "분수는 분자 ÷ 분모로 소수로 바꿀 수 있습니다.", ask: "1/5을 소수로 바꾸면?", options: ["0.2", "0.5", "1.5"], answer: 0, why: "1 ÷ 5 = 0.2예요.", hint: "1 ÷ 5" },
    explore: [["drill", "fraction", "분수 연습"]],
    proofs: [],
    summary: {
      figure: board(["0 — 1/4 — 1/2 — 3/4 — 1"]),
      terms: [["수직선의 가운데", "두 수를 더해 2로 나눈 수"]],
      facts: ["분수 → 소수: 분자 ÷ 분모(나누어떨어지지 않으면 되풀이 마디)", "수직선의 두 점 사이를 □등분하면 한 칸 = (차) ÷ □", "가분수는 대분수로 바꾸면 수직선 위 자리가 바로 보인다"]
    },
    pitfall: "칸 수와 점의 수를 섞지 않습니다. 4등분하면 점은 3개 생깁니다.",
    example: {
      prompt: "3/8을 소수로 나타내고, 수직선에서 1/4과 3/4의 한가운데에 있는 수를 분수로 구하세요.",
      figure: board(["3 ÷ 8 = ?", "1/4 — ? — 3/4"]),
      steps: [
        { ask: "3/8을 소수로?", answer: "0.375", text: true, why: "3 ÷ 8 = 0.375입니다.", hint: "3 ÷ 8" },
        { ask: "1/4과 3/4의 한가운데는? (분수로)", answer: "1/2", text: true, why: "(1/4 + 3/4) ÷ 2 = 1 ÷ 2 = 1/2입니다.", hint: "더해서 ÷ 2" }
      ]
    },
    check: [["c2-repeating-decimal", "concept"], ["number-line-midpoint-book6", "type"], ["c2-improper-fraction", "advanced"]]
  }],
  "2/1": [{
    id: "inclusion-exclusion", title: "포함과 배제 — 두 번 센 것 빼기",
    recall: { figure: figVenn, text: "두 모임에 함께 든 사람은 두 모임을 더할 때 두 번 세어집니다.", ask: "축구 18명 + 야구 15명에서 둘 다 하는 7명은 몇 번 세어졌나?", options: ["두 번", "한 번", "세 번"], answer: 0, why: "양쪽에 다 들어 있어요.", hint: "겹친 부분" },
    explore: [["board", "book-07/venn-overlap-all"], ["drill", "venn", "포함과 배제 연습"]],
    proofs: [],
    summary: {
      figure: figVenn,
      terms: [["포함과 배제", "더한 뒤 두 번 센 것(겹친 부분)을 한 번 뺀다"]],
      facts: ["적어도 하나 = A + B − <b>둘 다</b>", "둘 다 아님 = 전체 − 적어도 하나", "겹친 부분을 모르면: 둘 다 = A + B − 적어도 하나"]
    },
    pitfall: "「둘 다」를 한 번만 빼야 합니다. 두 번 빼면 겹친 사람이 아예 사라집니다.",
    example: {
      prompt: "반 학생 30명 가운데 축구를 하는 학생은 18명, 야구를 하는 학생은 15명, 둘 다 하는 학생은 7명입니다. 둘 다 하지 않는 학생은 몇 명인가요?",
      figure: figVenn,
      steps: [
        { ask: "적어도 하나를 하는 학생은?", answer: "26", unit: "명", why: "18 + 15 − 7 = 26입니다.", hint: "18 + 15 − 7" },
        { ask: "둘 다 하지 않는 학생은?", answer: "4", unit: "명", why: "30 − 26 = 4입니다.", hint: "30 − 26" }
      ]
    },
    check: [["venn-union-total-b7", "concept"], ["venn-overlap-with-neither-b7", "type"], ["neither-set-count", "advanced"]]
  }],
  "2/2": [{
    id: "bounce", title: "튀어 오른 공의 높이",
    recall: { figure: figBounce, text: "떨어진 높이의 2/3만큼 튀어 오르는 공은, 튈 때마다 높이가 2/3배가 됩니다.", ask: "90cm에서 떨어뜨리면 첫 번째로 튀어 오른 높이는?", options: ["60cm", "30cm", "45cm"], answer: 0, why: "90 ÷ 3 × 2 = 60이에요.", hint: "90의 2/3" },
    explore: [["drill", "venn", "포함과 배제 연습"]],
    proofs: [],
    summary: {
      figure: figBounce,
      terms: [["튀어 오른 높이", "바로 앞에 떨어진 높이의 □/○"]],
      facts: ["앞으로: 높이 × □/○를 튄 횟수만큼", "거꾸로(처음 높이): 튀어 오른 높이 ÷ □ × ○", "움직인 거리: 처음 떨어진 높이 + 튀어 오른 높이 × 2씩(올라갔다 내려옴)"]
    },
    pitfall: "움직인 거리에서 마지막으로 튀어 오른 뒤 내려오는 거리를 셀지 문제를 다시 읽습니다.",
    example: {
      prompt: "81cm 높이에서 떨어뜨린 공이 떨어진 높이의 2/3만큼 튀어 오릅니다. 세 번째로 튀어 오른 높이는 몇 cm인가요?",
      figure: figBounce,
      steps: [
        { ask: "첫 번째로 튀어 오른 높이는?", answer: "54", unit: "cm", why: "81 ÷ 3 × 2 = 54입니다.", hint: "81의 2/3" },
        { ask: "두 번째는?", answer: "36", unit: "cm", why: "54 ÷ 3 × 2 = 36입니다.", hint: "54의 2/3" },
        { ask: "세 번째는?", answer: "24", unit: "cm", why: "36 ÷ 3 × 2 = 24입니다.", hint: "36의 2/3" }
      ]
    },
    check: [["c2-bounce-height", "concept"], ["c2-bounce-height", "type"], ["c2-bounce-height", "advanced"]]
  }],
  "2/3": [{
    id: "fraction-box", title: "□가 있는 분수식 — 남은 것으로 거꾸로",
    recall: { figure: board(["1/4 사용 → 남은 3/4", "남은 것의 2/3 사용 → 남은 1/3"]), text: "「남은 것의 2/3」은 처음 전체가 아니라 그때 남아 있던 양의 2/3입니다.", ask: "남은 것의 2/3을 쓰면 그 남은 것의 얼마가 남나?", options: ["1/3", "2/3", "3/2"], answer: 0, why: "1 − 2/3 = 1/3이에요.", hint: "1 − 2/3" },
    explore: [["board", "book-08/fraction-reverse-source"], ["drill", "venn", "포함과 배제 연습"]],
    proofs: [],
    summary: {
      figure: board(["처음 → × 3/4 → × 1/3 → 15"]),
      terms: [["거꾸로 풀기", "남은 양 ÷ 남은 분수의 분자 × 분모로 한 단계씩"]],
      facts: ["남은 양 = 앞의 양 × (1 − 쓴 분수)", "<b>끝에서부터</b> 남은 분수로 나누어 앞 양을 구한다", "구한 처음 양으로 다시 계산해 확인한다"]
    },
    pitfall: "두 번째 분수를 처음 양에 바로 곱하지 않습니다.",
    example: {
      prompt: "처음 구슬의 1/4을 쓰고, 남은 것의 2/3을 썼더니 15개가 남았습니다. 처음 구슬은 몇 개인가요?",
      figure: board(["처음 → × 3/4 → × 1/3 → 15개"]),
      steps: [
        { ask: "두 번째로 쓰기 전에는?", answer: "45", unit: "개", why: "남은 1/3이 15개이므로 15 × 3 = 45입니다.", hint: "15 × 3" },
        { ask: "처음에는?", answer: "60", unit: "개", why: "남은 3/4이 45개이므로 45 ÷ 3 × 4 = 60입니다.", hint: "45 ÷ 3 × 4" }
      ]
    },
    check: [["sequential-fraction-remains-b8", "concept"], ["fraction-given-away-original-b8", "type"], ["sequential-fraction-consumption-b8", "advanced"]]
  }],
  "3/1": [{
    id: "proportion", title: "지구의 둘레와 비율 — 비례식",
    recall: { figure: board(["3 : 5 = 6 : 10"]), text: "비의 앞뒤에 같은 수를 곱해도 비율은 같습니다. 이렇게 같은 두 비를 등호로 이은 식을 비례식이라 합니다.", ask: "3 : 5 = □ : 20의 □는?", options: ["12", "15", "8"], answer: 0, why: "5에 4를 곱해 20이니 3에도 4를 곱해요.", hint: "× 4" },
    explore: [["drill", "invariant", "변하지 않는 것 연습"]],
    proofs: [],
    summary: {
      figure: board(["3 : 5 = 24 : 40"]),
      terms: [["비례식", "비율이 같은 두 비를 등호로 이은 식"]],
      facts: ["비의 앞뒤에 <b>같은 수</b>를 곱하거나 나누어도 비율은 같다", "모르는 쪽이 몇 배인지 찾아 같은 배를 한다", "작은 부분으로 잰 비율로 전체(지구의 둘레 같은 큰 양)를 구할 수 있다"]
    },
    pitfall: "앞항과 뒤항의 짝을 바꾸지 않습니다. 같은 자리끼리 같은 배입니다.",
    example: {
      prompt: "3 : 5 = □ : 40에서 □를 구하세요.",
      figure: board(["3 : 5 = □ : 40"]),
      steps: [
        { ask: "40은 5의 몇 배?", answer: "8", unit: "배", why: "40 ÷ 5 = 8입니다.", hint: "40 ÷ 5" },
        { ask: "□는?", answer: "24", why: "3 × 8 = 24입니다.", hint: "3 × 8" }
      ]
    },
    check: [["equivalent-ratio-chain", "concept"], ["bar-ratio-total-length", "type"], ["c2-ratio-difference", "advanced"]]
  }],
  "3/2": [{
    id: "pond-depth", title: "연못의 깊이 — 같은 부분을 기준으로",
    recall: { figure: figPond, text: "길이가 다른 두 막대를 연못 바닥까지 꽂으면, 물에 잠긴 길이는 둘 다 연못의 깊이로 같습니다.", ask: "어떤 막대의 1/3이 잠겼다면 막대 길이는 깊이의 몇 배?", options: ["3배", "1/3배", "2배"], answer: 0, why: "깊이가 막대의 1/3이니까요.", hint: "거꾸로" },
    explore: [["drill", "invariant", "변하지 않는 것 연습"]],
    proofs: [],
    summary: {
      figure: figPond,
      terms: [["공통 부분", "두 양에 똑같이 들어 있는 부분 — 이것을 기준(칸)으로 잡는다"]],
      facts: ["잠긴 길이(깊이)를 1칸으로 놓으면 막대는 그 몇 배", "두 막대의 차 = 깊이의 (배수의 차)배", "겹친 넓이가 두 도형의 □/○, △/☆일 때도 같은 방법"]
    },
    pitfall: "막대 길이의 분수와 깊이의 배수를 거꾸로 쓰지 않습니다(1/3 잠김 → 막대는 깊이의 3배).",
    example: {
      prompt: "길이의 차가 42cm인 두 막대를 연못 바닥까지 꽂았더니 짧은 막대는 1/3, 긴 막대는 1/5만큼 물에 잠겼습니다. 연못의 깊이는 몇 cm인가요?",
      figure: figPond,
      steps: [
        { ask: "짧은 막대는 깊이의 몇 배?", answer: "3", unit: "배", why: "1/3이 잠겼으니 3배입니다.", hint: "1/3 → 3배" },
        { ask: "두 막대의 차는 깊이의 몇 배? (5배 − 3배)", answer: "2", unit: "배", why: "긴 막대는 5배라 5 − 3 = 2배입니다.", hint: "5 − 3" },
        { ask: "깊이는?", answer: "21", unit: "cm", why: "42 ÷ 2 = 21입니다(막대 63cm, 105cm).", hint: "42 ÷ 2" }
      ]
    },
    check: [["c2-pond-depth", "concept"], ["c2-pond-depth", "type"], ["fraction-share-difference-b8", "advanced"]]
  }],
  "3/3": [{
    id: "invariant", title: "비의 활용 — 변하지 않는 것 찾기",
    recall: { figure: board(["엄마 40살 · 아이 10살", "10년 뒤 50살 · 20살 — 차 30살 그대로"]), text: "해가 지나도 두 사람의 나이 차는 변하지 않습니다.", ask: "엄마가 아이보다 30살 많으면 20년 뒤에는?", options: ["30살 많다", "50살 많다", "10살 많다"], answer: 0, why: "둘 다 20살씩 먹어요.", hint: "같이 늘어난다" },
    explore: [["drill", "invariant", "변하지 않는 것 연습"]],
    proofs: [],
    summary: {
      figure: board(["나이 차 · 주고받은 뒤의 합 · 똑같이 쓴 뒤의 차"]),
      terms: [["변하지 않는 양", "상황이 바뀌어도 그대로인 양 — 비의 기준으로 삼는다"]],
      facts: ["나이: <b>차</b>가 그대로 — 몇 배가 될 때 차 = 아이 나이 × (배 − 1)", "주고받기: <b>합</b>이 그대로 — 두 비를 합의 칸 수가 같게 맞춘다", "똑같이 쓰기·받기: <b>차</b>가 그대로 — 두 비를 차의 칸 수가 같게 맞춘다"]
    },
    pitfall: "무엇이 변하지 않는지 먼저 정합니다. 합이 그대로인지 차가 그대로인지 바꾸면 답이 달라집니다.",
    example: {
      prompt: "지금 엄마는 40살, 아이는 10살입니다. 몇 년 뒤에 엄마의 나이가 아이 나이의 2배가 되나요?",
      figure: board(["차 30살은 그대로"]),
      steps: [
        { ask: "엄마와 아이의 나이 차는?", answer: "30", unit: "살", why: "40 − 10 = 30입니다.", hint: "40 − 10" },
        { ask: "엄마가 2배일 때 아이 나이는? (차 = 아이 × 1)", answer: "30", unit: "살", why: "2배일 때 차는 아이 나이와 같아 30살입니다.", hint: "차 ÷ (2 − 1)" },
        { ask: "몇 년 뒤?", answer: "20", unit: "년", why: "30 − 10 = 20년 뒤(엄마 60살)입니다.", hint: "30 − 10" }
      ]
    },
    check: [["c2-invariant-ratio", "concept"], ["c2-invariant-ratio", "type"], ["c2-invariant-ratio", "advanced"]]
  }]
};
