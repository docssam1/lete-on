// 2과정 A1 「양팔저울과 규칙찾기」 개념 꾸러미(DESIGN-COURSE2.md 4절). 열쇠 「단원 번호(0부터)/차시(1부터)」.
// 예제는 새로 지은 문제라 단계 답을 이 파일에 둔다(교재 문항·답이 아니다). 대수 권은 그림 논증 대신 그림으로 「왜」를 보인다.
// 글 속 분수는 「3/5」로 쓰면 화면·인쇄에서 수식 분수로 바뀐다(course2-pack.js · course2-pack-print.js의 mathText).
import { svg, text, line, rect, circle, P, INK, GREEN, SOFT, MARK, YELLOW, mathLabel } from "./pack-kit.js?v=20261122i";

const label = (x, y, t, o = {}) => mathLabel(x, y, t, { size: 13, color: "#56627f", ...o });
const stone = (x, y, black) => circle(P(x, y), 10, { fill: black ? INK : "#fff", width: 1.8 });
const cells = (x, y, n, fill, w = 26) => Array.from({ length: n }, (_, i) => rect(x + i * w, y, w, 24, { fill, width: 1.6 })).join("");

// ── 그림 ──
const figPeriod = () => {
  const block = [true, false, false, true];
  let body = "";
  for (let i = 0; i < 12; i += 1) body += stone(24 + i * 28, 40, block[i % 4]);
  body += rect(10, 22, 4 * 28, 36, { color: GREEN, dash: "5 4", width: 1.6 }) + rect(10 + 4 * 28, 22, 4 * 28, 36, { color: GREEN, dash: "5 4", width: 1.6 });
  return svg(360, 90, body + label(66, 76, "마디 1") + label(178, 76, "마디 2") + label(290, 76, "마디 3"), "마디로 묶은 바둑돌");
};
const figDivide = () => svg(300, 90, text(150, 32, "13 ÷ 4 = 3 … 1", { size: 22 }) + label(150, 66, "마디 3번을 지나고, 다음 마디의 1번째"), "나눗셈과 마디");
const figRows = () => {
  let body = "";
  for (let r = 1; r <= 5; r += 1) for (let i = 0; i < r; i += 1) body += stone(150 - (r - 1) * 14 + i * 28, 18 + (r - 1) * 26, r % 2 === 1);
  return svg(300, 150, body + label(250, 18, "1줄: 검은 돌", { anchor: "start" }) + label(250, 44, "2줄: 흰 돌", { anchor: "start" }), "줄마다 색이 바뀌는 바둑돌");
};
const pan = (cx, items) => `<path d="M ${cx - 46} 70 Q ${cx} 100 ${cx + 46} 70" fill="${SOFT}" stroke="${INK}" stroke-width="1.8"/>` + items.map((s, i) => text(cx - (items.length - 1) * 11 + i * 22, 58, s, { size: 20 })).join("");
const figBalance = (left = ["○", "○"], right = ["△"]) => svg(320, 130,
  line(P(70, 70), P(250, 70), { width: 2.6 }) + line(P(160, 70), P(160, 118), { width: 2.6 }) + line(P(128, 118), P(192, 118), { width: 2.6 }) + pan(70, left) + pan(250, right), "평형을 이룬 양팔저울");
const figCoins = () => {
  let body = "";
  [0, 1, 2].forEach((g) => { for (let i = 0; i < 3; i += 1) body += circle(P(30 + g * 100 + i * 24, 40), 10, { fill: YELLOW, width: 1.6 }); body += rect(14 + g * 100, 24, 72, 32, { color: GREEN, dash: "5 4", width: 1.4 }); });
  return svg(320, 100, body + label(50, 76, "왼쪽 접시") + label(150, 76, "오른쪽 접시") + label(250, 76, "올리지 않음"), "셋으로 나눈 금화");
};
const figBars = (a = 5, b = 3, la = "A", lb = "B") => svg(60 + Math.max(a, b) * 26, 80, text(18, 24, la, { size: 15, weight: 700 }) + cells(34, 12, a, SOFT) + text(18, 58, lb, { size: 15, weight: 700 }) + cells(34, 46, b, YELLOW), "칸 막대");
const figRemain = () => svg(330, 96, cells(10, 14, 3, YELLOW, 100) + rect(10, 14, 100, 24, { fill: "#e8e2d2", width: 1.6 }) + label(60, 52, "1/3 사용") + label(210, 52, "남은 2/3") + cells(110, 62, 4, SOFT, 50) + rect(110, 62, 50, 24, { fill: "#e8e2d2", width: 1.6 }) + label(135, 92, "1/4 사용", { size: 11 }), "남은 양을 거꾸로");
const figFraction = () => svg(150, 84, text(75, 20, "분자", { size: 14, color: GREEN }) + line(P(35, 40), P(115, 40), { width: 2.4 }) + text(75, 62, "분모", { size: 14, color: GREEN }), "분수");
const figRoad = (closed = false) => {
  if (closed) {
    let body = circle(P(90, 80), 56, { color: "#8a948f", width: 3 });
    for (let k = 0; k < 8; k += 1) { const a = (k / 8) * Math.PI * 2; body += circle(P(90 + 56 * Math.cos(a), 80 + 56 * Math.sin(a)), 7, { fill: GREEN, color: GREEN }); }
    return svg(320, 160, body + label(240, 70, "나무 8그루") + label(240, 94, "간격도 8곳"), "둥근 연못 둘레의 나무");
  }
  let body = line(P(20, 60), P(300, 60), { color: "#8a948f", width: 3 });
  for (let k = 0; k <= 4; k += 1) body += circle(P(20 + k * 70, 44), 7, { fill: GREEN, color: GREEN });
  return svg(320, 100, body + label(160, 84, "나무 5그루 · 간격 4곳"), "곧은 길의 나무");
};
const figLog = () => {
  let body = rect(14, 20, 290, 34, { fill: "#d9b37c", width: 1.8 });
  for (let k = 1; k <= 3; k += 1) body += line(P(14 + k * 72.5, 12), P(14 + k * 72.5, 62), { color: MARK, dash: "4 3" });
  return svg(320, 90, body + label(160, 80, "4도막 = 3번 자르기 · 쉬는 것은 2번"), "통나무 자르기");
};

export const PACKS = {
  "0/1": [{
    id: "period", title: "마디수열 — 나머지로 몇 번째 찾기",
    recall: { figure: figDivide, text: "나눗셈에서 몫은 「몇 번 묶였나」, 나머지는 「묶고 남은 것」입니다.", ask: "13 ÷ 4의 나머지는?", options: ["1", "3", "4"], answer: 0, why: "4 × 3 = 12이고 13에서 12를 빼면 1이 남아요.", hint: "4 × 3 = 12" },
    explore: [["board", "book-02/repeating-sequence"], ["drill", "period", "마디 세기 연습"]],
    proofs: [],
    summary: {
      figure: figPeriod,
      terms: [["마디", "같은 차례로 되풀이되는 한 묶음"]],
      facts: ["몇 번째 ÷ 마디 길이 = <b>몫</b>(지나간 마디) … <b>나머지</b>(다음 마디의 몇 번째)", "나머지가 0이면 <b>마디의 마지막</b>", "몇 개인지 = 마디 하나의 개수 × 몫 + 남은 것 안의 개수"]
    },
    pitfall: "나머지가 0일 때 「0번째」는 없습니다. 바로 앞 마디의 마지막 것입니다.",
    example: {
      prompt: "● ○ ○ ● 를 같은 차례로 되풀이하여 늘어놓았습니다. 50번째 바둑돌은 무슨 색인가요?",
      figure: figPeriod,
      steps: [
        { ask: "마디 하나에 바둑돌이 몇 개인가요?", answer: "4", unit: "개", why: "● ○ ○ ● 네 개가 되풀이됩니다.", hint: "되풀이되는 묶음" },
        { ask: "50 ÷ 4의 나머지는?", answer: "2", why: "4 × 12 = 48, 50 − 48 = 2입니다.", hint: "4 × 12 = 48" },
        { ask: "마디의 2번째 돌은 무슨 색? (검은/흰)", answer: "흰", unit: "돌", text: true, why: "● ○ ○ ●의 2번째는 ○입니다.", hint: "마디의 2번째" }
      ]
    },
    check: [["c2-period-nth", "concept"], ["c2-period-number-sum", "type"], ["c2-period-nth", "advanced"]]
  }],
  "0/2": [{
    id: "stone-layers", title: "도형에서 규칙 찾기 — 줄마다 바뀌는 색",
    recall: { figure: figRows, text: "줄을 하나씩 늘려 가며 바둑돌을 놓으면 n번째 줄에는 n개가 놓입니다.", ask: "4번째 줄에는 바둑돌이 몇 개?", options: ["3개", "4개", "8개"], answer: 1, why: "줄의 번호만큼 놓여요.", hint: "줄 번호" },
    explore: [["board", "book-02/growth-patterns"]],
    proofs: [],
    summary: {
      figure: figRows,
      terms: [["표로 세기", "줄(또는 둘레)마다 색과 개수를 표에 적어 규칙을 찾는다"]],
      facts: ["홀수 번째 줄과 짝수 번째 줄의 색이 다르면 <b>두 줄씩 묶어</b> 차를 본다", "두 줄을 묶을 때마다 차가 <b>일정하게</b> 커지거나 그대로인지 확인한다", "몇 번째에서 차가 얼마인지 알면 거꾸로 몇 번째인지도 찾는다"]
    },
    pitfall: "마지막 묶음이 한 줄만 남는지(홀수 번째에서 끝나는지) 꼭 확인합니다.",
    example: {
      prompt: "1줄에 1개, 2줄에 2개, … 처럼 줄마다 하나씩 늘려 놓고, 홀수 번째 줄은 검은 돌, 짝수 번째 줄은 흰 돌을 놓습니다. 10줄까지 놓으면 어느 색이 몇 개 더 많은가요?",
      figure: figRows,
      steps: [
        { ask: "검은 돌(1·3·5·7·9줄)은 모두 몇 개?", answer: "25", unit: "개", why: "1 + 3 + 5 + 7 + 9 = 25입니다.", hint: "홀수 줄만 더하기" },
        { ask: "흰 돌(2·4·6·8·10줄)은 모두 몇 개?", answer: "30", unit: "개", why: "2 + 4 + 6 + 8 + 10 = 30입니다.", hint: "짝수 줄만 더하기" },
        { ask: "흰 돌이 몇 개 더 많은가요?", answer: "5", unit: "개", why: "두 줄씩 묶으면 흰 돌이 1개씩 많아 5묶음이면 5개입니다.", hint: "30 − 25" }
      ]
    },
    check: [["go-stone-difference", "concept"], ["border-go-stone-difference", "type"], ["go-stone-difference-inverse", "advanced"]]
  }],
  "1/1": [{
    id: "fake-coin", title: "양팔저울로 가짜 금화 찾기",
    recall: { figure: () => figBalance(["●"], ["○"]), text: "양팔저울은 무거운 쪽으로 기울고, 무게가 같으면 평형을 이룹니다.", ask: "왼쪽이 내려가면 가벼운 것은 어느 쪽?", options: ["왼쪽", "오른쪽"], answer: 1, why: "올라간 쪽이 가벼워요.", hint: "올라간 쪽" },
    explore: [],
    proofs: [],
    summary: {
      figure: figCoins,
      terms: [["셋으로 나누기", "왼쪽 접시 · 오른쪽 접시 · 저울 밖 — 한 번에 세 무리 중 하나를 고른다"]],
      facts: ["평형이면 가짜는 <b>저울 밖</b>, 기울면 <b>올라간 접시</b>에 있다", "저울 한 번에 찾을 수 있는 개수가 <b>3배</b>씩: 3 → 9 → 27 → 81", "적어도 몇 번 = 3을 몇 번 곱해야 금화 수 이상이 되나"]
    },
    pitfall: "두 무리로만 나누면 한 번에 반밖에 못 줄입니다. 저울 밖에 둔 무리도 한 번에 함께 가려집니다.",
    example: {
      prompt: "금화 27개 가운데 1개만 가볍습니다. 양팔저울을 적어도 몇 번 써야 반드시 찾을 수 있나요?",
      figure: figCoins,
      steps: [
        { ask: "첫 번째: 9개씩 세 무리로 나누면 가짜가 든 무리는 몇 개?", answer: "9", unit: "개", why: "9개씩 두 접시에 올리고 9개는 밖에 둡니다.", hint: "27 ÷ 3" },
        { ask: "두 번째: 그 9개를 다시 셋으로 나누면?", answer: "3", unit: "개", why: "3개씩 나눕니다.", hint: "9 ÷ 3" },
        { ask: "세 번째로 1개를 찾습니다. 모두 몇 번?", answer: "3", unit: "번", why: "27 = 3 × 3 × 3이므로 3번입니다.", hint: "3을 몇 번 곱했나" }
      ]
    },
    check: [["c2-fake-coin", "concept"], ["c2-fake-coin", "type"], ["c2-fake-coin", "advanced"]]
  }],
  "1/2": [{
    id: "balance-substitute", title: "양팔저울과 바꾸어 넣기",
    recall: { figure: () => figBalance(["○", "○"], ["△"]), text: "평형을 이룬 저울은 양쪽 무게가 같다는 식입니다.", ask: "○ ○ = △이면 △ 2개는 ○ 몇 개?", options: ["2개", "4개", "3개"], answer: 1, why: "△ 하나가 ○ 2개이니 △ 2개는 ○ 4개예요.", hint: "△ = ○ ○" },
    explore: [["board", "book-04/balance-substitution"], ["drill", "balance", "저울 바꾸어 넣기 연습"]],
    proofs: [],
    summary: {
      figure: () => figBalance(["○", "○"], ["△"]),
      terms: [["바꾸어 넣기", "같은 무게인 것으로 갈아 끼워 한 가지 모양으로 맞춘다"]],
      facts: ["저울 하나 = 식 하나(○ ○ = △)", "물어보는 모양으로 <b>모두 바꾸어</b> 센다", "양쪽에 같은 것을 더하거나 빼도 평형은 그대로"]
    },
    pitfall: "바꾸어 넣을 때 개수를 곱하는 것을 잊지 않습니다(△ 3개 = ○ 2개씩 3번).",
    example: {
      prompt: "○ 2개와 △ 1개의 무게가 같고, △ 3개와 □ 1개의 무게가 같습니다. □ 1개는 ○ 몇 개의 무게와 같나요?",
      figure: () => figBalance(["△", "△", "△"], ["□"]),
      steps: [
        { ask: "△ 1개는 ○ 몇 개?", answer: "2", unit: "개", why: "첫 저울에서 ○ ○ = △입니다.", hint: "첫 번째 저울" },
        { ask: "□ = △ 3개 = ○ 몇 개?", answer: "6", unit: "개", why: "○ 2개씩 3번이면 6개입니다.", hint: "2 × 3" }
      ]
    },
    check: [["balance-scale-three-objects", "concept"], ["g1-winter-three-balance-substitution", "type"], ["balance-scale-four-objects", "advanced"]]
  }],
  "1/3": [{
    id: "balance-ratio", title: "양팔저울과 비",
    recall: { figure: () => figBars(3, 2), text: "비 3 : 2는 한쪽이 3칸일 때 다른 쪽이 2칸이라는 뜻입니다.", ask: "A가 3칸, B가 2칸이면 A : B는?", options: ["3 : 2", "2 : 3", "5 : 3"], answer: 0, why: "앞에 쓴 것이 A예요.", hint: "칸 수" },
    explore: [["board", "book-06/bar-balance-ratio-source"], ["drill", "ratio", "비 찾기 연습"]],
    proofs: [],
    summary: {
      figure: () => figBars(5, 3),
      terms: [["거꾸로 비", "A × 3 = B × 5이면 A : B = 5 : 3 — 곱한 수가 서로 바뀐다"]],
      facts: ["○ 3개 = △ 5개이면 ○ 1개 : △ 1개 = <b>5 : 3</b>", "칸으로 그리고 <b>합(또는 차)이 몇 칸</b>인지 본다", "한 칸의 값을 구해 칸 수만큼 곱한다"]
    },
    pitfall: "개수가 많은 쪽이 한 개는 더 가볍습니다. 비를 거꾸로 쓰지 않았는지 다시 봅니다.",
    example: {
      prompt: "A의 3배와 B의 5배가 같고, A가 B보다 14 큽니다. A와 B를 구하세요.",
      figure: () => figBars(5, 3),
      steps: [
        { ask: "A : B = 5 : □", answer: "3", why: "A × 3 = B × 5이면 A는 5칸, B는 3칸입니다.", hint: "곱한 수를 바꾸어" },
        { ask: "차 2칸이 14 — 한 칸은?", answer: "7", why: "14 ÷ 2 = 7입니다.", hint: "14 ÷ 2" },
        { ask: "A는?", answer: "35", why: "5칸 × 7 = 35, B는 3칸 × 7 = 21입니다.", hint: "5 × 7" }
      ]
    },
    check: [["bar-ratio-read", "concept"], ["balance-ratio-book6", "type"], ["c2-ratio-difference", "advanced"]]
  }],
  "2/1": [{
    id: "fraction-backward", title: "그림으로 푸는 분수 문제 — 거꾸로",
    recall: { figure: figRemain, text: "전체의 1/3을 쓰면 남은 것은 전체의 2/3입니다.", ask: "전체의 1/4을 쓰면 남는 것은?", options: ["3/4", "1/4", "4/3"], answer: 0, why: "네 조각 중 한 조각을 써서 세 조각이 남아요.", hint: "1 − 1/4" },
    explore: [["board", "book-08/fraction-reverse-source"], ["board", "book-08/fraction-picture-source"]],
    proofs: [],
    summary: {
      figure: figRemain,
      terms: [["남은 것의 분수", "「남은 것의 1/4」은 전체가 아니라 남은 양을 다시 나눈 것"]],
      facts: ["남은 양 = 전체의 (1 − 쓴 분수)", "끝에서부터 <b>한 단계씩 거꾸로</b> 늘린다", "남은 수 ÷ 남은 조각 수 = 한 조각, × 전체 조각 수 = 그 앞의 양"]
    },
    pitfall: "두 번째로 쓴 분수는 처음 양이 아니라 남은 양의 분수입니다.",
    example: {
      prompt: "처음 구슬의 1/3을 동생에게 주고, 남은 것의 1/4을 친구에게 주었더니 18개가 남았습니다. 처음 구슬은 몇 개인가요?",
      figure: figRemain,
      steps: [
        { ask: "친구에게 주기 전에는 몇 개? (남은 3/4이 18개)", answer: "24", unit: "개", why: "18 ÷ 3 = 6이 한 조각, 6 × 4 = 24입니다.", hint: "18 ÷ 3 × 4" },
        { ask: "처음에는 몇 개? (남은 2/3이 24개)", answer: "36", unit: "개", why: "24 ÷ 2 = 12가 한 조각, 12 × 3 = 36입니다.", hint: "24 ÷ 2 × 3" }
      ]
    },
    check: [["fraction-given-away-original-b8", "concept"], ["sequential-fraction-remains-b8", "type"], ["fraction-difference-whole-b8", "advanced"]]
  }],
  "2/2": [{
    id: "fraction-ratio", title: "표로 푸는 분수 문제 — 분수와 비",
    recall: { figure: () => figBars(3, 5, "동", "언"), text: "「동생은 언니의 3/5」이면 언니를 5칸으로 나눌 때 동생은 3칸입니다.", ask: "그때 동생 : 언니는?", options: ["3 : 5", "5 : 3", "3 : 8"], answer: 0, why: "동생 3칸, 언니 5칸이에요.", hint: "칸 수" },
    explore: [["board", "book-06/fraction-balance-source"], ["drill", "fraction", "분수와 비 연습"]],
    proofs: [],
    summary: {
      figure: () => figBars(3, 5, "동", "언"),
      terms: [["기준", "「~의」 앞에 오는 쪽 — 분모만큼 칸으로 나눈다"]],
      facts: ["A가 B의 3/5이면 A : B = <b>3 : 5</b>", "합이 주어지면 (3 + 5)칸, 차가 주어지면 (5 − 3)칸으로 한 칸을 구한다", "전체의 분수(전체의 3/5)라면 나머지는 전체의 2/5 — 두 쪽을 칸으로 비교한다"]
    },
    pitfall: "「언니의 3/5」에서 기준은 언니입니다. 전체(둘을 합한 것)의 3/5가 아닙니다.",
    example: {
      prompt: "동생은 언니의 3/5만큼 초콜릿을 가졌고, 둘이 가진 초콜릿은 모두 40개입니다. 동생은 몇 개인가요?",
      figure: () => figBars(3, 5, "동", "언"),
      steps: [
        { ask: "모두 몇 칸인가요?", answer: "8", unit: "칸", why: "동생 3칸 + 언니 5칸 = 8칸입니다.", hint: "3 + 5" },
        { ask: "한 칸은 몇 개?", answer: "5", unit: "개", why: "40 ÷ 8 = 5입니다.", hint: "40 ÷ 8" },
        { ask: "동생은 몇 개?", answer: "15", unit: "개", why: "3칸 × 5 = 15, 언니는 25개입니다.", hint: "3 × 5" }
      ]
    },
    check: [["c2-fraction-ratio-split", "concept"], ["fraction-share-difference-b8", "type"], ["c2-fraction-ratio-split", "advanced"]]
  }],
  "2/3": [{
    id: "division-fraction", title: "나눗셈과 분수 — 몫과 나머지로 가분수 찾기",
    recall: { figure: figFraction, text: "가분수 17/5를 대분수로 바꾸면 17 ÷ 5 = 3 … 2라서 3과 2/5입니다.", ask: "분자 = 분모 × 몫 + □ 의 □는?", options: ["나머지", "몫", "분모"], answer: 0, why: "나눗셈의 검산식과 같아요.", hint: "검산식" },
    explore: [["drill", "fraction", "분수와 비 연습"]],
    proofs: [],
    summary: {
      figure: figFraction,
      terms: [["검산식", "나누어지는 수 = 나누는 수 × 몫 + 나머지"]],
      facts: ["분자 = 분모 × 몫 + 나머지 — 모르는 것을 <b>분모 하나</b>로 만든다", "분자 + 분모 = 분모 × (몫 + 1) + 나머지", "분자 − 분모 = 분모 × (몫 − 1) + 나머지"]
    },
    pitfall: "나머지는 늘 나누는 수(분모)보다 작아야 합니다. 구한 분모로 확인합니다.",
    example: {
      prompt: "어떤 가분수의 분자와 분모의 합은 31이고, 분자를 분모로 나누면 몫이 4, 나머지가 1입니다. 이 가분수를 구하세요.",
      figure: figFraction,
      steps: [
        { ask: "합 = 분모 × □ + 1 의 □는?", answer: "5", why: "분자 = 분모 × 4 + 1이니 분모를 더하면 분모 × 5 + 1입니다.", hint: "몫 + 1" },
        { ask: "분모는?", answer: "6", why: "(31 − 1) ÷ 5 = 6입니다.", hint: "30 ÷ 5" },
        { ask: "분자는?", answer: "25", why: "6 × 4 + 1 = 25 → 25/6입니다.", hint: "6 × 4 + 1" }
      ]
    },
    check: [["c2-improper-fraction", "concept"], ["c2-quotient-remainder-pair", "type"], ["c2-improper-fraction", "advanced"]]
  }],
  "3/1": [{
    id: "tree-planting", title: "가로수 심기 — 간격 수와 나무 수",
    recall: { figure: () => figRoad(false), text: "곧은 길의 처음과 끝에 모두 심으면 나무가 간격보다 1그루 많습니다.", ask: "간격이 4곳이면 나무는?", options: ["4그루", "5그루", "3그루"], answer: 1, why: "양 끝이 하나씩 더해져 간격 + 1이에요.", hint: "간격 + 1" },
    explore: [["board", "book-07/closed-loop-planting"], ["drill", "gaps", "간격 세기 연습"]],
    proofs: [],
    summary: {
      figure: () => figRoad(true),
      terms: [["간격 수", "길이 ÷ 간격"]],
      facts: ["곧은 길, 처음과 끝에 심음: 나무 = <b>간격 수 + 1</b>", "둥근 연못·사각 둘레(닫힌 길): 나무 = <b>간격 수</b>", "양쪽에 심으면 한쪽의 <b>2배</b> · 사이마다 꽃을 심으면 사이 수 = 간격 수"]
    },
    pitfall: "닫힌 둘레는 처음과 끝이 같은 자리라 한 그루를 더하지 않습니다.",
    example: {
      prompt: "둘레가 60m인 둥근 연못과 길이가 60m인 곧은 길에 각각 5m 간격으로 나무를 심습니다(곧은 길은 처음과 끝에도). 나무는 각각 몇 그루인가요?",
      figure: () => figRoad(true),
      steps: [
        { ask: "간격은 몇 곳?", answer: "12", unit: "곳", why: "60 ÷ 5 = 12입니다.", hint: "60 ÷ 5" },
        { ask: "둥근 연못의 나무는?", answer: "12", unit: "그루", why: "닫힌 둘레는 간격 수와 같습니다.", hint: "닫힌 둘레" },
        { ask: "곧은 길의 나무는?", answer: "13", unit: "그루", why: "처음과 끝에 심으면 12 + 1 = 13입니다.", hint: "간격 + 1" }
      ]
    },
    check: [["closed-perimeter-object-count-b7", "concept"], ["c2-road-trees", "type"], ["closed-perimeter-from-spacing-count-b7", "advanced"]]
  }],
  "3/2": [{
    id: "log-cut", title: "통나무 자르기 — 횟수와 시간",
    recall: { figure: figLog, text: "통나무를 4도막으로 자르려면 3번만 자르면 됩니다.", ask: "6도막이면 몇 번 자르나요?", options: ["6번", "5번", "7번"], answer: 1, why: "도막 수보다 한 번 적게 잘라요.", hint: "도막 − 1" },
    explore: [["drill", "gaps", "간격 세기 연습"]],
    proofs: [],
    summary: {
      figure: figLog,
      terms: [["자르는 횟수", "도막 수 − 1"], ["쉬는 횟수", "자르는 횟수 − 1 (마지막 뒤에는 쉬지 않음)"]],
      facts: ["걸린 시간 = 자르는 시간 × 자르는 횟수 + 쉬는 시간 × 쉬는 횟수", "한 번 자르는 시간 = 걸린 시간 ÷ (도막 수 − 1)", "종이 울리는 시간도 같다 — 울림 사이 = 울린 횟수 − 1"]
    },
    pitfall: "「몇 도막」과 「몇 번 자르기」를 섞지 않습니다. 그림에 자르는 선을 그어 셉니다.",
    example: {
      prompt: "통나무를 한 번 자르는 데 6분이 걸리고, 한 번 자른 뒤에는 2분씩 쉽니다. 5도막으로 자르는 데 모두 몇 분이 걸리나요?",
      figure: figLog,
      steps: [
        { ask: "자르는 횟수는?", answer: "4", unit: "번", why: "5도막이면 5 − 1 = 4번 자릅니다.", hint: "도막 − 1" },
        { ask: "쉬는 횟수는?", answer: "3", unit: "번", why: "마지막으로 자른 뒤에는 쉬지 않아 4 − 1 = 3번입니다.", hint: "자르기 − 1" },
        { ask: "모두 몇 분?", answer: "30", unit: "분", why: "6 × 4 + 2 × 3 = 24 + 6 = 30분입니다.", hint: "6 × 4 + 2 × 3" }
      ]
    },
    check: [["c2-log-cut-time", "concept"], ["c2-log-cut-time", "type"], ["c2-log-cut-time", "advanced"]]
  }]
};
